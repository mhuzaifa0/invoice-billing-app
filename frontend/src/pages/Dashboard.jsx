import { useEffect, useState } from "react";
import api from "../api/axios";
import InvoiceTable from "../components/InvoiceTable";

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    api.get("/invoices").then((res) => setInvoices(res.data));
  }, []);

  const totalDue = invoices
    .filter((i) => i.status !== "paid")
    .reduce((sum, i) => sum + (i.total || 0), 0);
  const totalPaid = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + (i.total || 0), 0);

  return (
    <div className="container">
      <div className="page-header">
        <h2>Dashboard</h2>
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
        <div className="card" style={{ flex: 1 }}>
          <div style={{ color: "#64748b", fontSize: 13 }}>Total Invoices</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{invoices.length}</div>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <div style={{ color: "#64748b", fontSize: 13 }}>Outstanding</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#dc2626" }}>${totalDue.toFixed(2)}</div>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <div style={{ color: "#64748b", fontSize: 13 }}>Paid</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#16a34a" }}>${totalPaid.toFixed(2)}</div>
        </div>
      </div>
      <div className="card">
        <InvoiceTable invoices={invoices} />
        {invoices.length === 0 && <p>No invoices yet.</p>}
      </div>
    </div>
  );
}
