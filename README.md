# Chakki Business Backend

Simple Node.js + Express + MongoDB monolith for a small flour mill/grinding business.

## 1. Install

```bash
npm install
```

## 2. Environment

Copy `.env.example` to `.env` and update values.

```bash
cp .env.example .env
```

## 3. Start MongoDB

If MongoDB is installed locally:

```bash
brew services start mongodb-community
```

Or run your MongoDB service using your normal setup.

## 4. Seed admin and default products

```bash
node src/seed.js
```

## 5. Development

```bash
npm run dev
```

API:

```text
http://localhost:5000
```

Health:

```text
GET /api/health
```

## Authentication

Login:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "ChangeMe123!"
}
```

Use returned token:

```http
Authorization: Bearer YOUR_TOKEN
```

## Main API groups

```text
POST   /api/auth/login
GET    /api/auth/me

GET    /api/clients
POST   /api/clients
GET    /api/clients/:id
PATCH  /api/clients/:id
DELETE /api/clients/:id
GET    /api/clients/:id/ledger

GET    /api/products
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id

GET    /api/grinding
POST   /api/grinding
GET    /api/grinding/:id

GET    /api/sales
POST   /api/sales
GET    /api/sales/:id

GET    /api/payments
POST   /api/payments

GET    /api/dashboard/summary
GET    /api/dashboard/client-balances
```

## Important business rules

1. Customer-owned wheat brought for grinding is not added to business stock.
2. Business-owned products sold to a customer reduce product stock.
3. Grinding and sales create client ledger debit entries.
4. Payments create client ledger credit entries.
5. Client outstanding balance is calculated from the ledger.
6. The backend calculates grinding/sale totals instead of trusting frontend totals.
