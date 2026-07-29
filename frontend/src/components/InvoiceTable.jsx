import { Link } from "react-router-dom";

export default function InvoiceTable({ invoices }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Invoice #</th>
          <th>Client</th>
          <th>Due Date</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((inv) => (
          <tr key={inv._id}>
            <td><Link to={`/invoices/${inv._id}`}>{inv.invoiceNumber}</Link></td>
            <td>{inv.client?.name}</td>
            <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
            <td>${inv.total?.toFixed(2)}</td>
            <td><span className={`status ${inv.status}`}>{inv.status}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
