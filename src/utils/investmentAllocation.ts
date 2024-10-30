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
 * Calculate minimum viable investment that allows buying whole securities
 * while maintaining proportions as closely as possible
 */
export function calculateMinimumViableInvestment(
  campaigns: Campaign[],
  selection: StartupsSelection
): number {
  // Sum of minimum security prices for each campaign
  const minTotal = campaigns.reduce((sum, campaign) => {
    return sum + campaign.offeringDetails.minAmount;
  }, 0);

  // Ensure it's at least the platform minimum
  return Math.max(minTotal, INVESTMENT_LIMITS.PLATFORM_MINIMUM);
}

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
 * Calculate number of whole securities that can be purchased
 */
export function calculateSecurities(maxPrice: number, securityPrice: number): number {
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

  // Calculate remaining investment after ensuring minimum securities
  let remainingInvestment = totalInvestment;
  const totalAmount = selection.goal;

  // First pass: ensure minimum one security for each campaign
  for (const campaign of campaigns) {
    const securityPrice = campaign.offeringDetails.minAmount;
    remainingInvestment -= securityPrice;

    // Validate non-accredited investor limits
    if (!isAccredited && securityPrice > INVESTMENT_LIMITS.NON_ACCREDITED_MAX_PER_STARTUP) {
      errors.push(
        `Investment in startup ${campaign.startupId} exceeds non-accredited investor limit of $${INVESTMENT_LIMITS.NON_ACCREDITED_MAX_PER_STARTUP}`
      );
    }
  }

  // Validate remaining amount is non-negative
  if (remainingInvestment < 0) {
    errors.push(`Total investment must be at least $${totalInvestment - remainingInvestment}`);
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
  const totalAmount = selection.goal;
  let remainingInvestment = totalInvestment;
  
  // First pass: allocate minimum one security to each campaign
  const allocations = campaigns.map((campaign) => {
    const proportion = campaign.steerup_amount / totalAmount;
    const securityPrice = campaign.offeringDetails.minAmount;
    remainingInvestment -= securityPrice;

    return {
      startupId: campaign.startupId,
      proportion,
      maxPrice: securityPrice,
      securityPrice,
      maxSecurities: 1,
    };
  });

  // Second pass: allocate remaining investment based on proportions
  if (remainingInvestment > 0) {
    for (const allocation of allocations) {
      const campaign = campaigns.find(c => c.startupId === allocation.startupId)!;
      const targetProportion = campaign.steerup_amount / totalAmount;
      const targetAmount = remainingInvestment * targetProportion;
      const additionalSecurities = Math.floor(targetAmount / allocation.securityPrice);
      
      allocation.maxSecurities += additionalSecurities;
      allocation.maxPrice += additionalSecurities * allocation.securityPrice;
      remainingInvestment -= additionalSecurities * allocation.securityPrice;
    }
  }

  return allocations;
}
