import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [error, setError] = useState("");

  const loadClients = async () => {
    const res = await api.get("/clients");
    setClients(res.data);
  };

  useEffect(() => { loadClients(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/clients", form);
      setForm({ name: "", email: "", phone: "", address: "" });
      loadClients();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add client");
    }
  };

  const removeClient = async (id) => {
    await api.delete(`/clients/${id}`);
    loadClients();
  };

  return (
    <div className="container">
      <div className="page-header"><h2>Clients</h2></div>

      <div className="card">
        <h3 style={{ marginBottom: 12 }}>Add Client</h3>
        {error && <div className="error">{error}</div>}
        <form onSubmit={submit} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input placeholder="Name" required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ flex: 1, minWidth: 150, padding: 8, borderRadius: 6, border: "1px solid #cbd5e1" }} />
          <input placeholder="Email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ flex: 1, minWidth: 150, padding: 8, borderRadius: 6, border: "1px solid #cbd5e1" }} />
          <input placeholder="Phone" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: "1px solid #cbd5e1" }} />
          <input placeholder="Address" value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            style={{ flex: 2, minWidth: 180, padding: 8, borderRadius: 6, border: "1px solid #cbd5e1" }} />
          <button className="btn" type="submit">Add</button>
        </form>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th></th></tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.address}</td>
                <td><button className="btn danger" onClick={() => removeClient(c._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {clients.length === 0 && <p>No clients yet.</p>}
      </div>
    </div>
  );
}
