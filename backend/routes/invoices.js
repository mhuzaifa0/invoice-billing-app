const express = require("express");
const Invoice = require("../models/Invoice");
const Client = require("../models/Client");
const User = require("../models/User");
const protect = require("../middleware/auth");
const generateInvoicePDF = require("../utils/generatePDF");

const router = express.Router();
router.use(protect);

// Get all invoices
router.get("/", async (req, res) => {
  const invoices = await Invoice.find({ owner: req.user.id })
    .populate("client", "name email")
    .sort({ createdAt: -1 });
  res.json(invoices);
});

// Get single invoice
router.get("/:id", async (req, res) => {
  const invoice = await Invoice.findOne({ _id: req.params.id, owner: req.user.id }).populate("client");
  if (!invoice) return res.status(404).json({ message: "Invoice not found" });
  res.json(invoice);
});

// Create invoice
router.post("/", async (req, res) => {
  try {
    const invoice = await Invoice.create({ ...req.body, owner: req.user.id });
    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update invoice (e.g. mark as paid)
router.put("/:id", async (req, res) => {
  const invoice = await Invoice.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    req.body,
    { new: true }
  );
  if (!invoice) return res.status(404).json({ message: "Invoice not found" });
  res.json(invoice);
});

// Delete invoice
router.delete("/:id", async (req, res) => {
  const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  if (!invoice) return res.status(404).json({ message: "Invoice not found" });
  res.json({ message: "Invoice deleted" });
});

// Download invoice as PDF
router.get("/:id/pdf", async (req, res) => {
  const invoice = await Invoice.findOne({ _id: req.params.id, owner: req.user.id }).populate("client");
  if (!invoice) return res.status(404).json({ message: "Invoice not found" });

  const owner = await User.findById(req.user.id);
  generateInvoicePDF(invoice, invoice.client, owner, res);
});

module.exports = router;
