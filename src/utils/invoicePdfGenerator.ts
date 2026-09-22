import { jsPDF } from 'jspdf';
import { ShopOwner } from '../types';
import { BillRecord } from '../types/shop';

/**
 * Generates a clean, professional vector PDF for a shop bill/invoice.
 * Returns the jsPDF instance which supports:
 * - doc.save('filename.pdf')
 * - doc.output('blob')
 */
export function generateInvoicePdf(shop: ShopOwner, bill: BillRecord): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const leftMargin = 15;
  const rightMargin = pageWidth - 15;
  let y = 18;

  // 1. TOP HEADER - SHOP DETAILS & INVOICE TITLE
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(shop.shopName, leftMargin, y);

  // Right-aligned TAX INVOICE header
  doc.setFontSize(16);
  doc.setTextColor(37, 99, 235); // blue-600
  doc.text('TAX INVOICE', rightMargin, y, { align: 'right' });

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // slate-500
  
  // Shop metadata
  const shopMetaLines = [
    shop.shopAddress || 'Retail & Commercial Merchant',
    `Mobile: +91 ${shop.mobileNumber}`,
    `GSTIN: ${shop.gstNumber || '29ABCDE1234F1Z5'}`,
    `Store URL: https://${shop.subdomain}.zetaven.com`
  ];

  let metaY = y;
  shopMetaLines.forEach(line => {
    doc.text(line, leftMargin, metaY);
    metaY += 4.2;
  });

  // Invoice metadata on the right
  const dateStr = new Date(bill.date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const invMetaLines = [
    `Invoice No: ${bill.invoiceNumber}`,
    `Invoice Date: ${dateStr}`,
    `Payment Mode: ${bill.paymentMode}`,
    `Status: ${bill.status.toUpperCase()}${bill.dueAmount > 0 ? ` (Due: Rs. ${bill.dueAmount})` : ''}`
  ];

  let invY = y;
  invMetaLines.forEach(line => {
    doc.text(line, rightMargin, invY, { align: 'right' });
    invY += 4.2;
  });

  y = Math.max(metaY, invY) + 3;

  // Divider Line
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(leftMargin, y, rightMargin, y);
  y += 6;

  // 2. CUSTOMER DETAILS (BILLED TO)
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(leftMargin, y, rightMargin - leftMargin, 16, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(leftMargin, y, rightMargin - leftMargin, 16, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('BILLED TO (CUSTOMER DETAILS)', leftMargin + 4, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(bill.customerName || 'Walk-in Customer', leftMargin + 4, y + 11);

  if (bill.customerMobile) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Mobile: +91 ${bill.customerMobile}`, rightMargin - 4, y + 11, { align: 'right' });
  }

  y += 22;

  // 3. TABLE HEADER
  const colX = {
    index: leftMargin + 2,
    desc: leftMargin + 12,
    qty: leftMargin + 105,
    rate: leftMargin + 135,
    total: rightMargin - 4
  };

  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(leftMargin, y, rightMargin - leftMargin, 7, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.line(leftMargin, y + 7, rightMargin, y + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text('#', colX.index, y + 4.8);
  doc.text('ITEM DESCRIPTION / SERVICE', colX.desc, y + 4.8);
  doc.text('QTY', colX.qty, y + 4.8, { align: 'right' });
  doc.text('RATE (Rs.)', colX.rate, y + 4.8, { align: 'right' });
  doc.text('AMOUNT (Rs.)', colX.total, y + 4.8, { align: 'right' });

  y += 10;

  // 4. TABLE ROWS
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  bill.items.forEach((item, idx) => {
    // Check if near bottom
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setTextColor(100, 116, 139);
    doc.text(String(idx + 1), colX.index, y);

    // Item name / description (wrap if needed)
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    const descLines = doc.splitTextToSize(item.productName, 88);
    doc.text(descLines, colX.desc, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(String(item.quantity), colX.qty, y, { align: 'right' });
    doc.text(item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 }), colX.rate, y, { align: 'right' });
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(item.total.toLocaleString('en-IN', { minimumFractionDigits: 2 }), colX.total, y, { align: 'right' });

    const rowHeight = Math.max(7, descLines.length * 4.5 + 2);
    y += rowHeight;

    // Subtle line between items
    doc.setDrawColor(241, 245, 249);
    doc.line(leftMargin, y - 1, rightMargin, y - 1);
  });

  y += 4;
  doc.setDrawColor(203, 213, 225);
  doc.line(leftMargin, y, rightMargin, y);
  y += 6;

  // 5. SUMMARY AND TOTALS BLOCK
  const totalsLeft = rightMargin - 75;
  const totalsRight = rightMargin - 2;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  // Subtotal
  doc.text('Items Subtotal:', totalsLeft, y);
  doc.text(`Rs. ${bill.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, totalsRight, y, { align: 'right' });
  y += 5;

  // Tax
  if (bill.taxAmount > 0) {
    doc.text('GST / Tax (5%):', totalsLeft, y);
    doc.text(`Rs. ${bill.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, totalsRight, y, { align: 'right' });
    y += 5;
  }

  // Discount
  if (bill.discountAmount > 0) {
    doc.setTextColor(5, 150, 105); // emerald-600
    doc.text('Owner Discount:', totalsLeft, y);
    doc.text(`- Rs. ${bill.discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, totalsRight, y, { align: 'right' });
    y += 5;
  }

  // Grand Total Box
  doc.setFillColor(241, 245, 249);
  doc.rect(totalsLeft - 4, y - 1, (totalsRight - totalsLeft) + 8, 8, 'F');
  doc.setDrawColor(148, 163, 184);
  doc.rect(totalsLeft - 4, y - 1, (totalsRight - totalsLeft) + 8, 8, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Grand Total:', totalsLeft, y + 4.5);
  doc.text(`Rs. ${bill.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, totalsRight, y + 4.5, { align: 'right' });
  y += 12;

  // Paid & Due
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Amount Paid:', totalsLeft, y);
  doc.text(`Rs. ${bill.paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, totalsRight, y, { align: 'right' });
  y += 5;

  if (bill.dueAmount > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(217, 119, 6); // amber-600
    doc.text('Balance Due:', totalsLeft, y);
    doc.text(`Rs. ${bill.dueAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, totalsRight, y, { align: 'right' });
    y += 5;
  }

  // 6. NOTES & SIGNATURE
  y = Math.max(y + 8, 250);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);

  if (bill.notes) {
    doc.text(`Notes: ${bill.notes}`, leftMargin, y);
  } else {
    doc.text('Thank you for shopping with us! Please retain this invoice for your records.', leftMargin, y);
  }

  // Authorized Signature line
  doc.setDrawColor(203, 213, 225);
  doc.line(rightMargin - 50, y + 8, rightMargin, y + 8);
  doc.text('Authorized Signatory', rightMargin - 35, y + 12, { align: 'center' });

  // Bottom footer branding
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated by Zetaven Subdomain Cloud • https://${shop.subdomain}.zetaven.com`, leftMargin, 285);

  return doc;
}
