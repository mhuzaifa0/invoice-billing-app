import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function InvoiceDetail() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  const load = async () => {
    const res = await api.get(`/invoices/${id}`);
    setInvoice(res.data);
  };

  useEffect(() => { load(); }, [id]);

  const updateStatus = async (status) => {
    await api.put(`/invoices/${id}`, { status });
    load();
  };

  const downloadPDF = async () => {
    const res = await api.get(`/invoices/${id}/pdf`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoice-${invoice.invoiceNumber}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (!invoice) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="page-header">
        <h2>Invoice {invoice.invoiceNumber}</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn secondary" onClick={downloadPDF}>Download PDF</button>
          {invoice.status !== "paid" && (
            <button className="btn success" onClick={() => updateStatus("paid")}>Mark as Paid</button>
          )}
        </div>
      </div>

      <div className="card">
        <p><strong>Client:</strong> {invoice.client?.name} ({invoice.client?.email})</p>
        <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong> <span className={`status ${invoice.status}`}>{invoice.status}</span></p>

        <table style={{ marginTop: 16 }}>
          <thead>
            <tr><th>Description</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i}>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 style={{ marginTop: 16, textAlign: "right" }}>Total: ${invoice.total?.toFixed(2)}</h3>
        {invoice.notes && <p style={{ marginTop: 10 }}><strong>Notes:</strong> {invoice.notes}</p>}
      </div>
    </div>
  );
}
