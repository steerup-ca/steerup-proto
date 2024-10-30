import { 
  User, 
  Campaign, 
  StartupsSelection, 
  AccreditationStatus,
  SecurityAllocation,
  AllocationValidationResult,
  INVESTMENT_LIMITS
} from '../types';

/**
 * Calculate maximum security price based on proportion and investor type
 */
export function calculateMaxSecurityPrice(
  totalInvestment: number,
  proportion: number,
  isAccredited: boolean
): number {
  const proportionalAmount = totalInvestment * proportion;
  return isAccredited
    ? proportionalAmount
    : Math.min(proportionalAmount, INVESTMENT_LIMITS.NON_ACCREDITED_MAX_PER_STARTUP);
}

/**
 * Calculate maximum number of securities that can be purchased
 */
export function calculateMaxSecurities(maxPrice: number, securityPrice: number): number {
  return Math.floor(maxPrice / securityPrice);
}

/**
 * Validate total investment amount
 */
export function validateTotalInvestment(amount: number): AllocationValidationResult {
  const errors: string[] = [];
  
  if (amount < INVESTMENT_LIMITS.PLATFORM_MINIMUM) {
    errors.push(`Total investment must be at least $${INVESTMENT_LIMITS.PLATFORM_MINIMUM}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate investment allocations for a selection
 */
export function validateInvestmentAllocations(
  user: User,
  selection: StartupsSelection,
  campaigns: Campaign[],
  totalInvestment: number
): AllocationValidationResult {
  const errors: string[] = [];
  const isAccredited = user.accreditationStatus === AccreditationStatus.Accredited;

  // Validate total investment
  const totalValidation = validateTotalInvestment(totalInvestment);
  if (!totalValidation.isValid) {
    return totalValidation;
  }

  // Calculate proportions and validate allocations
  let totalProportion = 0;
  const allocations: SecurityAllocation[] = [];

  campaigns.forEach((campaign) => {
    // Calculate proportion based on campaign amount relative to total selection goal
    const proportion = campaign.steerup_amount / selection.goal;
    totalProportion += proportion;

    const maxPrice = calculateMaxSecurityPrice(
      totalInvestment,
      proportion,
      isAccredited
    );

    const securityPrice = campaign.offeringDetails.minAmount;
    const maxSecurities = calculateMaxSecurities(maxPrice, securityPrice);

    // Validate non-accredited investor limits
    if (!isAccredited && maxPrice > INVESTMENT_LIMITS.NON_ACCREDITED_MAX_PER_STARTUP) {
      errors.push(
        `Allocation for startup ${campaign.startupId} exceeds non-accredited investor limit of $${INVESTMENT_LIMITS.NON_ACCREDITED_MAX_PER_STARTUP}`
      );
    }

    // Validate minimum security purchase
    if (maxSecurities < 1) {
      errors.push(
        `Allocation for startup ${campaign.startupId} is insufficient to purchase at least one security`
      );
    }

    allocations.push({
      startupId: campaign.startupId,
      proportion,
      maxPrice,
      securityPrice,
      maxSecurities,
    });
  });

  // Validate total proportion
  if (Math.abs(totalProportion - 1) > 0.0001) { // Using small epsilon for floating point comparison
    errors.push('Campaign allocations must sum to 100%');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate investment allocations for a selection
 */
export function calculateInvestmentAllocations(
  user: User,
  selection: StartupsSelection,
  campaigns: Campaign[],
  totalInvestment: number
): SecurityAllocation[] {
  const isAccredited = user.accreditationStatus === AccreditationStatus.Accredited;
  
  return campaigns.map((campaign) => {
    const proportion = campaign.steerup_amount / selection.goal;
    const maxPrice = calculateMaxSecurityPrice(
      totalInvestment,
      proportion,
      isAccredited
    );
    const securityPrice = campaign.offeringDetails.minAmount;
    const maxSecurities = calculateMaxSecurities(maxPrice, securityPrice);

    return {
      startupId: campaign.startupId,
      proportion,
      maxPrice,
      securityPrice,
      maxSecurities,
    };
  });
}
