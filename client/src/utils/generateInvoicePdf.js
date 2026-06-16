import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PRIMARY = [139, 26, 26];
const GOLD = [201, 162, 39];

let _cachedLogo = null;

export async function preloadLogo() {
  if (_cachedLogo) return _cachedLogo;
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
      _cachedLogo = canvas.toDataURL('image/png');
      resolve(_cachedLogo);
    };
    img.onerror = () => resolve(null);
    img.src = '/logo-main.png';
  });
}

function fmt(n) {
  return `£${Number(n).toFixed(2)}`;
}

export function buildInvoicePdf(invoice, settings = {}, logoBase64 = null) {
  const doc = new jsPDF();
  const W = doc.internal.pageSize.getWidth();
  const company = settings.companyDetails || {};
  const bank = settings.bankTransfer || {};

  // ── Header background strip ──────────────────────────────────────
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, W, 38, 'F');

  // Logo or text fallback
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', 12, 7, 48, 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(255, 220, 180);
    if (company.tagline) doc.text(company.tagline, 14, 26);
    if (company.address) doc.text(company.address, 14, 31);
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(company.name || 'Sizzling Sensations', 14, 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(255, 220, 180);
    if (company.tagline) doc.text(company.tagline, 14, 22);
    if (company.address) doc.text(company.address, 14, 28);
  }

  // INVOICE title top-right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text('INVOICE', W - 14, 18, { align: 'right' });

  // Invoice meta right column
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(255, 220, 180);
  doc.text(`No: ${invoice.invoiceNumber}`, W - 14, 27, { align: 'right' });
  doc.text(`Date: ${new Date(invoice.issueDate).toLocaleDateString('en-GB')}`, W - 14, 33, { align: 'right' });

  // ── Status badge ─────────────────────────────────────────────────
  const statusFill = {
    draft: [160, 160, 160],
    sent: [59, 130, 246],
    paid: [22, 163, 74],
    overdue: [220, 38, 38],
    cancelled: [107, 114, 128],
  }[invoice.status] || [160, 160, 160];
  doc.setFillColor(...statusFill);
  doc.roundedRect(14, 42, 28, 7, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text(invoice.status.toUpperCase(), 28, 46.8, { align: 'center' });

  // Due date
  if (invoice.dueDate) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80);
    doc.text(`Due: ${new Date(invoice.dueDate).toLocaleDateString('en-GB')}`, W - 14, 47, { align: 'right' });
  }

  // ── Divider ───────────────────────────────────────────────────────
  doc.setDrawColor(220, 220, 220);
  doc.line(14, 54, W - 14, 54);

  // ── Bill From / Bill To ───────────────────────────────────────────
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(150);
  doc.text('FROM', 14, 61);
  doc.text('BILL TO', W / 2 + 10, 61);

  doc.setTextColor(30);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(company.name || 'Sizzling Sensations', 14, 68);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80);
  if (company.email) doc.text(company.email, 14, 74);
  if (company.phone) doc.text(company.phone, 14, 79);
  if (company.website) doc.text(company.website, 14, 84);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30);
  doc.text(invoice.client.name, W / 2 + 10, 68);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text(invoice.client.email, W / 2 + 10, 74);
  if (invoice.client.phone) doc.text(invoice.client.phone, W / 2 + 10, 79);

  if (invoice.serviceDescription) {
    doc.setFontSize(8);
    doc.setTextColor(100);
    const wrapped = doc.splitTextToSize(`Re: ${invoice.serviceDescription}`, 85);
    doc.text(wrapped, 14, 91);
  }

  // ── Line items table ──────────────────────────────────────────────
  const tableY = invoice.serviceDescription ? 100 : 93;

  autoTable(doc, {
    startY: tableY,
    head: [['Description', 'Qty', 'Unit Price', 'Total']],
    body: invoice.lineItems.map(item => [
      item.isExtra ? `★ ${item.description}` : item.description,
      item.quantity,
      fmt(item.unitPrice),
      fmt(item.total),
    ]),
    headStyles: {
      fillColor: PRIMARY,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      cellPadding: 5,
    },
    bodyStyles: { fontSize: 9, cellPadding: 4 },
    alternateRowStyles: { fillColor: [250, 248, 248] },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 18, halign: 'center' },
      2: { cellWidth: 32, halign: 'right' },
      3: { cellWidth: 32, halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: 14, right: 14 },
    didParseCell(data) {
      if (data.section === 'body' && data.row.raw[0]?.startsWith('★')) {
        data.cell.styles.textColor = [139, 26, 26];
      }
    },
  });

  // ── Totals ────────────────────────────────────────────────────────
  const afterTable = doc.lastAutoTable.finalY + 6;

  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text('Subtotal:', W - 50, afterTable, { align: 'right' });
  doc.setTextColor(30);
  doc.text(fmt(invoice.subtotal), W - 14, afterTable, { align: 'right' });

  doc.setTextColor(80);
  doc.text(`VAT (${invoice.vatRate}%):`, W - 50, afterTable + 7, { align: 'right' });
  doc.setTextColor(30);
  doc.text(fmt(invoice.vatAmount), W - 14, afterTable + 7, { align: 'right' });

  doc.setFillColor(...PRIMARY);
  doc.roundedRect(W - 74, afterTable + 12, 60, 11, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL DUE:', W - 50, afterTable + 19, { align: 'right' });
  doc.text(fmt(invoice.grandTotal), W - 16, afterTable + 19, { align: 'right' });

  // ── Payment details ───────────────────────────────────────────────
  let payY = afterTable + 30;

  if (invoice.paymentMethod !== 'none') {
    doc.setFillColor(252, 249, 249);
    doc.setDrawColor(220, 200, 200);

    if (invoice.paymentMethod === 'bank_transfer') {
      const lines = [
        bank.bankName && `Bank: ${bank.bankName}`,
        bank.accountName && `Account Name: ${bank.accountName}`,
        bank.accountNumber && `Account No: ${bank.accountNumber}`,
        bank.sortCode && `Sort Code: ${bank.sortCode}`,
        bank.paymentReference && `Reference: ${bank.paymentReference.replace('[number]', invoice.invoiceNumber)}`,
      ].filter(Boolean);

      const boxH = 14 + lines.length * 6;
      doc.roundedRect(14, payY - 3, W - 28, boxH, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('BANK TRANSFER DETAILS', 20, payY + 3);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(30);
      lines.forEach((line, i) => doc.text(line, 20, payY + 11 + i * 6));
      payY += boxH + 8;
    } else if (invoice.paymentMethod === 'stripe' && invoice.stripePaymentLink) {
      doc.roundedRect(14, payY - 3, W - 28, 24, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('PAY ONLINE', 20, payY + 3);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(59, 130, 246);
      doc.text(invoice.stripePaymentLink, 20, payY + 11);
      doc.setTextColor(80);
      doc.setFontSize(8);
      doc.text('Click the link above or copy it into your browser to pay securely via Stripe.', 20, payY + 18);
      payY += 30;
    }
  }

  // ── Notes ─────────────────────────────────────────────────────────
  if (invoice.notes) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('NOTES', 14, payY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(50);
    const wrapped = doc.splitTextToSize(invoice.notes, W - 28);
    doc.text(wrapped, 14, payY + 7);
  }

  // ── Footer ────────────────────────────────────────────────────────
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFillColor(...PRIMARY);
  doc.rect(0, pageH - 14, W, 14, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(255, 220, 180);
  const footerText = [company.name, company.website, company.email].filter(Boolean).join('  •  ');
  doc.text(footerText, W / 2, pageH - 5, { align: 'center' });

  return doc;
}

export function downloadInvoicePdf(invoice, settings, logoBase64 = null) {
  const doc = buildInvoicePdf(invoice, settings, logoBase64);
  doc.save(`Invoice-${invoice.invoiceNumber}.pdf`);
}

export function getInvoicePdfBase64(invoice, settings, logoBase64 = null) {
  const doc = buildInvoicePdf(invoice, settings, logoBase64);
  return doc.output('datauristring').split(',')[1];
}
