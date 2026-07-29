const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    items: [itemSchema],
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["unpaid", "paid", "overdue"], default: "unpaid" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

invoiceSchema.virtual("total").get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
});
invoiceSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Invoice", invoiceSchema);
