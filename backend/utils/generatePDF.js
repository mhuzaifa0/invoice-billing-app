const PDFDocument = require("pdfkit");

function generateInvoicePDF(invoice, client, owner, res) {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);
  doc.pipe(res);

  doc.fontSize(20).text(owner.company || owner.name, { align: "left" });
  doc.moveDown();
  doc.fontSize(16).text(`Invoice #${invoice.invoiceNumber}`, { align: "right" });
  doc.fontSize(10).text(`Due: ${new Date(invoice.dueDate).toDateString()}`, { align: "right" });
  doc.moveDown();

  doc.fontSize(12).text(`Bill To: ${client.name}`);
  doc.text(client.email);
  if (client.address) doc.text(client.address);
  doc.moveDown();

  doc.font("Helvetica-Bold");
  doc.text("Description", 50, doc.y, { continued: true, width: 250 });
  doc.text("Qty", 300, doc.y, { continued: true, width: 80 });
  doc.text("Price", 380, doc.y, { continued: true, width: 80 });
  doc.text("Subtotal", 460);
  doc.font("Helvetica");
  doc.moveDown(0.5);

  let total = 0;
  invoice.items.forEach((item) => {
    const subtotal = item.quantity * item.price;
    total += subtotal;
    doc.text(item.description, 50, doc.y, { continued: true, width: 250 });
    doc.text(String(item.quantity), 300, doc.y, { continued: true, width: 80 });
    doc.text(item.price.toFixed(2), 380, doc.y, { continued: true, width: 80 });
    doc.text(subtotal.toFixed(2), 460);
  });

  doc.moveDown();
  doc.font("Helvetica-Bold").text(`Total: ${total.toFixed(2)}`, { align: "right" });
  doc.font("Helvetica").text(`Status: ${invoice.status.toUpperCase()}`, { align: "right" });

  if (invoice.notes) {
    doc.moveDown();
    doc.fontSize(10).text(`Notes: ${invoice.notes}`);
  }

  doc.end();
}

module.exports = generateInvoicePDF;
