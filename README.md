# invoice-billing-app

An invoicing and billing system with PDF generation and payment tracking, built with the MERN stack.

## Features
- User authentication (JWT-based register/login)
- Client management (add, edit, delete clients)
- Create invoices with multiple line items and auto-calculated totals
- Track invoice status: unpaid / paid / overdue
- Download any invoice as a PDF
- Dashboard with totals for outstanding and paid amounts

## Tech Stack
- **Frontend:** React (Vite), React Router, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcrypt
- **PDF generation:** PDFKit

## Project Structure
```
invoice-billing-app/
├── backend/
│   ├── config/db.js
│   ├── models/        # User, Client, Invoice
│   ├── middleware/auth.js
│   ├── routes/         # auth, clients, invoices
│   ├── utils/generatePDF.js
│   └── server.js
└── frontend/
    └── src/
        ├── api/axios.js
        ├── components/  # Navbar, InvoiceTable
        └── pages/        # Login, Register, Dashboard, Clients, CreateInvoice, InvoiceDetail
```

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env   # then set MONGO_URI and JWT_SECRET
npm run dev
```
Runs on `http://localhost:5000`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173` and proxies `/api` to the backend.

## API Overview
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login |
| GET | /api/clients | List clients (auth required) |
| POST | /api/clients | Add client (auth required) |
| PUT | /api/clients/:id | Update client (auth required) |
| DELETE | /api/clients/:id | Delete client (auth required) |
| GET | /api/invoices | List invoices (auth required) |
| POST | /api/invoices | Create invoice (auth required) |
| GET | /api/invoices/:id | Get one invoice (auth required) |
| PUT | /api/invoices/:id | Update invoice / status (auth required) |
| DELETE | /api/invoices/:id | Delete invoice (auth required) |
| GET | /api/invoices/:id/pdf | Download invoice as PDF (auth required) |

## Notes / Next Steps
- Add a scheduled job to auto-mark invoices "overdue" once dueDate passes.
- Integrate a real payment gateway (Stripe) to move status to "paid" automatically.
- Add email sending (e.g. Nodemailer) to send invoices directly to clients.
