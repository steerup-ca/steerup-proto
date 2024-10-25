/**
 * Masks a bank account number by showing only the last 4 digits
 * @param accountNumber The full account number to mask
 * @returns The masked account number
 */
export const maskAccountNumber = (accountNumber: string): string => {
  if (!accountNumber) return '';
  const lastFourDigits = accountNumber.slice(-4);
  const maskedPortion = '*'.repeat(Math.max(0, accountNumber.length - 4));
  return `${maskedPortion}${lastFourDigits}`;
};
