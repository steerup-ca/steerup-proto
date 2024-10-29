import jsPDF from 'jspdf';
import { PortfolioInvestment } from '../types';

export const generateSecurityDocument = (investment: PortfolioInvestment, startupName: string): string => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Helper function to center text
  const centerText = (text: string, y: number) => {
    const textWidth = doc.getTextWidth(text);
    const x = (pageWidth - textWidth) / 2;
    doc.text(text, x, y);
  };

  // Certificate Header
  doc.setFontSize(24);
  centerText('SECURITY CERTIFICATE', 20);
  
  // Certificate Number and Date
  doc.setFontSize(10);
  doc.text(`Certificate No: ${investment.id}`, 20, 30);
  doc.text(`Issue Date: ${investment.investmentDate.toDate().toLocaleDateString()}`, pageWidth - 80, 30);
  
  // Company and Security Information
  doc.setFontSize(18);
  centerText(startupName, 45);
  
  doc.setFontSize(12);
  centerText(`${investment.type.toUpperCase()} SECURITY`, 55);
  
  // Line separator
  doc.setLineWidth(0.5);
  doc.line(20, 60, pageWidth - 20, 60);
  
  // Security Details
  doc.setFontSize(12);
  doc.text('1. SECURITY DETAILS', 20, 75);
  
  const details = [
    `This certificate represents ${investment.terms.equity?.percentageOwned}% ownership in the form of`,
    `${investment.terms.equity?.shareClass} shares, with a total investment value of $${investment.amount.toLocaleString()}.`
  ];
  
  let y = 85;
  details.forEach(line => {
    doc.text(line, 25, y);
    y += 7;
  });
  
  // Rights and Privileges
  doc.text('2. RIGHTS AND PRIVILEGES', 20, 105);
  const rights = [
    'The holder of this security is entitled to:',
    '• Ownership rights as specified in the company\'s governing documents',
    '• Participation in applicable distributions and dividends',
    '• Information rights as provided by applicable securities regulations',
    '• Voting rights in accordance with the share class provisions'
  ];
  
  y = 115;
  rights.forEach(line => {
    doc.text(line, 25, y);
    y += 7;
  });
  
  // Transfer Restrictions
  doc.text('3. TRANSFER RESTRICTIONS', 20, 150);
  const restrictions = [
    'This security is subject to:',
    '• Resale restrictions under applicable securities laws',
    '• Transfer limitations as specified in the shareholder agreement',
    '• Right of first refusal provisions',
    '• Drag-along and tag-along rights as applicable'
  ];
  
  y = 160;
  restrictions.forEach(line => {
    doc.text(line, 25, y);
    y += 7;
  });
  
  // Regulatory Compliance
  doc.text('4. REGULATORY COMPLIANCE', 20, 195);
  const compliance = [
    'This security has been issued in compliance with:',
    '• National Instrument 45-110 - Start-up Crowdfunding Registration',
    '  and Prospectus Exemptions',
    '• Applicable provincial and territorial securities regulations',
    '• The issuer\'s governing documents and shareholder agreements'
  ];
  
  y = 205;
  compliance.forEach(line => {
    doc.text(line, 25, y);
    y += 7;
  });
  
  // Authentication
  doc.text('5. AUTHENTICATION', 20, 240);
  const auth = [
    `Issued through the Steerup Platform`,
    `Platform Registration: [Registration Number]`,
    `Electronic Certificate ID: ${investment.id}`,
    `Issuance Date: ${investment.investmentDate.toDate().toLocaleDateString()}`
  ];
  
  y = 250;
  auth.forEach(line => {
    doc.text(line, 25, y);
    y += 7;
  });
  
  // Footer
  doc.setLineWidth(0.5);
  doc.line(20, 275, pageWidth - 20, 275);
  
  doc.setFontSize(9);
  const footer = [
    'This is an official security certificate issued electronically through the Steerup platform.',
    'The authenticity of this certificate can be verified through the Steerup platform.',
    'This certificate is valid without physical signature in accordance with electronic commerce regulations.'
  ];
  
  y = 280;
  footer.forEach(line => {
    centerText(line, y);
    y += 5;
  });
  
  // Convert to data URL
  return doc.output('datauristring');
};
