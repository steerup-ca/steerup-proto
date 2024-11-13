import { 
  User, 
  Campaign, 
  StartupsSelection, 
  AccreditationStatus,
  SecurityAllocation,
  AllocationValidationResult,
  INVESTMENT_LIMITS,
  InvestmentType
} from '../types';

/**
 * Validate campaign data
 */
function validateCampaign(campaign: Campaign): boolean {
  return (
    campaign &&
    typeof campaign.id === 'string' &&
    typeof campaign.startupId === 'string' &&
    typeof campaign.steerup_amount === 'number' &&
    campaign.offeringDetails &&
    typeof campaign.offeringDetails.minAmount === 'number'
  );
}

/**
 * Calculate minimum viable investment that allows buying whole securities
 * while maintaining proportions as closely as possible
 */
export function calculateMinimumViableInvestment(
  campaigns: Campaign[],
  selection: StartupsSelection
): number {
  if (!Array.isArray(campaigns) || campaigns.length === 0) {
    console.error('Invalid campaigns array in calculateMinimumViableInvestment');
    return INVESTMENT_LIMITS.PLATFORM_MINIMUM;
  }

  // Filter out invalid campaigns
  const validCampaigns = campaigns.filter(validateCampaign);
  
  if (validCampaigns.length === 0) {
    console.error('No valid campaigns found in calculateMinimumViableInvestment');
    return INVESTMENT_LIMITS.PLATFORM_MINIMUM;
  }

  if (selection.investmentType === InvestmentType.DEBT) {
    // For debt investments, use the minimum from the first campaign
    // since debt doesn't require buying whole securities
    const firstCampaign = validCampaigns[0];
    return firstCampaign.offeringDetails.minAmount || INVESTMENT_LIMITS.PLATFORM_MINIMUM;
  }

  // For equity investments, sum minimum security prices
  const minTotal = validCampaigns.reduce((sum, campaign) => {
    return sum + (campaign.offeringDetails.minAmount || 0);
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
  isAccredited: boolean,
  isDebt: boolean
): number {
  if (typeof totalInvestment !== 'number' || typeof proportion !== 'number') {
    console.error('Invalid input in calculateMaxSecurityPrice');
    return 0;
  }

  const proportionalAmount = totalInvestment * (proportion / 100);
  
  if (isDebt) {
    // For debt investments, no maximum limit per startup
    return proportionalAmount;
  }

  // For equity investments, apply non-accredited investor limits
  return isAccredited
    ? proportionalAmount
    : Math.min(proportionalAmount, INVESTMENT_LIMITS.NON_ACCREDITED_MAX_PER_STARTUP);
}

/**
 * Calculate number of whole securities that can be purchased
 */
export function calculateSecurities(
  maxPrice: number, 
  securityPrice: number,
  isDebt: boolean
): number {
  if (typeof maxPrice !== 'number' || typeof securityPrice !== 'number' || securityPrice <= 0) {
    console.error('Invalid input in calculateSecurities');
    return 0;
  }

  if (isDebt) {
    // For debt investments, allow fractional amounts
    return maxPrice / securityPrice;
  }
  // For equity investments, require whole securities
  return Math.floor(maxPrice / securityPrice);
}

/**
 * Validate total investment amount
 */
export function validateTotalInvestment(
  amount: number,
  selection: StartupsSelection
): AllocationValidationResult {
  const errors: string[] = [];
  
  if (typeof amount !== 'number' || amount < 0) {
    errors.push('Invalid investment amount');
    return { isValid: false, errors };
  }

  if (amount < INVESTMENT_LIMITS.PLATFORM_MINIMUM) {
    errors.push(`Total investment must be at least $${INVESTMENT_LIMITS.PLATFORM_MINIMUM}`);
  }

  if (selection.investmentType === InvestmentType.DEBT && selection.debtTerms) {
    // Add debt-specific validations if needed
    // For example, check if amount is within debt terms limits
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

  // Validate input parameters
  if (!user || !selection || !Array.isArray(campaigns)) {
    errors.push('Invalid input parameters');
    return { isValid: false, errors };
  }

  // Filter out invalid campaigns
  const validCampaigns = campaigns.filter(validateCampaign);

  if (validCampaigns.length === 0) {
    errors.push('No valid campaigns found');
    return { isValid: false, errors };
  }

  const isAccredited = user.accreditationStatus === AccreditationStatus.Accredited;
  const isDebt = selection.investmentType === InvestmentType.DEBT;

  // Validate total investment
  const totalValidation = validateTotalInvestment(totalInvestment, selection);
  if (!totalValidation.isValid) {
    return totalValidation;
  }

  // Calculate remaining investment
  let remainingInvestment = totalInvestment;

  if (isDebt) {
    // For debt investments, just validate the total amount
    if (totalInvestment > selection.goal) {
      errors.push(`Total investment cannot exceed the goal amount of $${selection.goal}`);
    }
  } else {
    // For equity investments, validate security requirements
    for (const campaign of validCampaigns) {
      const securityPrice = campaign.offeringDetails.minAmount;
      remainingInvestment -= securityPrice;

      // Validate non-accredited investor limits for equity investments
      if (!isAccredited && securityPrice > INVESTMENT_LIMITS.NON_ACCREDITED_MAX_PER_STARTUP) {
        errors.push(
          `Investment in startup ${campaign.startupId} exceeds non-accredited investor limit of $${INVESTMENT_LIMITS.NON_ACCREDITED_MAX_PER_STARTUP}`
        );
      }
    }

    // Validate remaining amount is non-negative for equity investments
    if (remainingInvestment < 0) {
      errors.push(`Total investment must be at least $${totalInvestment - remainingInvestment}`);
    }
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
  // Validate input parameters
  if (!user || !selection || !Array.isArray(campaigns) || typeof totalInvestment !== 'number') {
    console.error('Invalid input parameters in calculateInvestmentAllocations');
    return [];
  }

  // Filter out invalid campaigns
  const validCampaigns = campaigns.filter(validateCampaign);

  if (validCampaigns.length === 0) {
    console.error('No valid campaigns found in calculateInvestmentAllocations');
    return [];
  }

  const totalAmount = selection.goal;
  const isDebt = selection.investmentType === InvestmentType.DEBT;
  let remainingInvestment = totalInvestment;
  
  if (isDebt) {
    // For debt investments, allocate based on proportions without requiring whole securities
    return validCampaigns.map((campaign) => {
      const proportion = campaign.steerup_amount / totalAmount;
      const amount = totalInvestment * proportion;
      const securityPrice = campaign.offeringDetails.minAmount;

      return {
        startupId: campaign.startupId,
        proportion,
        maxPrice: amount,
        securityPrice,
        maxSecurities: amount / securityPrice, // Allow fractional securities for debt
      };
    });
  }

  // For equity investments, maintain the original logic requiring whole securities
  // First pass: allocate minimum one security to each campaign
  const allocations = validCampaigns.map((campaign) => {
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
      const campaign = validCampaigns.find(c => c.startupId === allocation.startupId);
      if (!campaign) continue;

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
