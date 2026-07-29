const express = require("express");
const Client = require("../models/Client");
const protect = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.get("/", async (req, res) => {
  const clients = await Client.find({ owner: req.user.id }).sort({ createdAt: -1 });
  res.json(clients);
});

router.post("/", async (req, res) => {
  try {
    const client = await Client.create({ ...req.body, owner: req.user.id });
    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const client = await Client.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    req.body,
    { new: true }
  );
  if (!client) return res.status(404).json({ message: "Client not found" });
  res.json(client);
});

router.delete("/:id", async (req, res) => {
  const client = await Client.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  if (!client) return res.status(404).json({ message: "Client not found" });
  res.json({ message: "Client deleted" });
});

module.exports = router;
