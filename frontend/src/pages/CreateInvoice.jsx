import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CreateInvoice() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    client: "",
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    dueDate: "",
    notes: "",
  });
  const [items, setItems] = useState([{ description: "", quantity: 1, price: 0 }]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/clients").then((res) => setClients(res.data));
  }, []);

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === "description" ? value : Number(value);
    setItems(updated);
  };

  const addItem = () => setItems([...items, { description: "", quantity: 1, price: 0 }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.client) return setError("Please select a client");
    try {
      const res = await api.post("/invoices", { ...form, items });
      navigate(`/invoices/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create invoice");
    }
  };

  return (
    <div className="container">
      <div className="page-header"><h2>New Invoice</h2></div>
      <div className="card">
        {error && <div className="error">{error}</div>}
        <form onSubmit={submit}>
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <select required value={form.client}
              onChange={(e) => setForm({ ...form, client: e.target.value })}
              style={{ flex: 1, padding: 10, borderRadius: 6, border: "1px solid #cbd5e1" }}>
              <option value="">Select client</option>
              {clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <input value={form.invoiceNumber} readOnly
              style={{ flex: 1, padding: 10, borderRadius: 6, border: "1px solid #cbd5e1", background: "#f1f5f9" }} />
            <input type="date" required value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              style={{ flex: 1, padding: 10, borderRadius: 6, border: "1px solid #cbd5e1" }} />
          </div>

          <h4 style={{ margin: "14px 0 8px" }}>Items</h4>
          {items.map((item, index) => (
            <div className="item-row" key={index}>
              <input placeholder="Description" required value={item.description}
                onChange={(e) => updateItem(index, "description", e.target.value)} />
              <input type="number" placeholder="Qty" min="1" value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", e.target.value)}
                style={{ maxWidth: 80 }} />
              <input type="number" placeholder="Price" min="0" step="0.01" value={item.price}
                onChange={(e) => updateItem(index, "price", e.target.value)}
                style={{ maxWidth: 100 }} />
              {items.length > 1 && (
                <button type="button" className="btn danger" onClick={() => removeItem(index)}>×</button>
              )}
            </div>
          ))}
          <button type="button" className="btn secondary" onClick={addItem} style={{ marginBottom: 16 }}>
            + Add Item
          </button>

          <textarea placeholder="Notes (optional)" rows="2" value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })} />

          <h3 style={{ margin: "10px 0" }}>Total: ${total.toFixed(2)}</h3>
          <button className="btn" type="submit">Create Invoice</button>
        </form>
      </div>
    </div>
  );
}
