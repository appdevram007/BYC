# Bond Yield Calculator

A professional bond yield calculator built with React, NestJS, and TypeScript. Calculate bond yields quickly and accurately with a clean, responsive interface.

## Features

* Calculate **Current Yield** and **Yield to Maturity (YTM)**
* Support for **annual** and **semi-annual** coupon payments
* See a detailed **cash flow schedule** with payment dates
* Identify **premium** or **discount** bonds
* Real-time calculations with backend validation
* Professional, **responsive UI** for desktop and mobile

## Tech Stack

* **Frontend**: React 18 + TypeScript, Vite
* **Backend**: NestJS + TypeScript
* **Styling**: CSS Modules with custom design system
* **Date Handling**: date-fns
* **HTTP Client**: Axios

## Project Structure

```
BYC/
├── frontend/          # React app
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── services/    # API calls
│   │   ├── types/       # TypeScript interfaces
│   │   └── utils/       # Helper functions
│   └── package.json
├── backend/           # NestJS API
│   ├── src/
│   │   ├── bond/       # Bond calculation logic
│   │   ├── common/     # Shared modules and utils
│   │   └── main.ts
│   └── package.json
└── README.md
```

## Setup Instructions

### Backend

```bash
cd backend
npm install
npm run start:dev
```

The backend will run on: `http://localhost:3000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on: `http://localhost:5173`

---

## API Endpoints

### `POST /api/bond/calculate`

Calculate bond yields and generate cash flows.

**Request Example:**

```json
{
  "faceValue": 1000,
  "couponRate": 5,
  "marketPrice": 950,
  "yearsToMaturity": 10,
  "couponFrequency": "semi-annual"
}
```

**Response Example:**

```json
{
  "currentYield": 5.26,
  "yieldToMaturity": 5.65,
  "totalInterest": 500,
  "premiumDiscount": "discount",
  "discountAmount": 50,
  "cashFlows": [...]
}
```

---

## Implementation Approach (For Interviews)

**Prompting Strategy**

1. Defined clear architecture requirements (React + NestJS + TypeScript)
2. Requested a production-ready project structure
3. Specified high accuracy for financial calculations
4. Added comprehensive error handling and validation
5. Emphasized maintainable and clean code

**Key Design Decisions**

* **Backend-First Calculations**: Ensures accurate and consistent results
* **Type Safety**: Shared TypeScript interfaces between frontend and backend
* **YTM Calculation**: Uses Newton-Raphson method for precision
* **Date Handling**: Calculates proper payment dates with date-fns
* **Validation Layer**: DTO validation with class-validator on backend
* **Error Boundaries**: Graceful frontend error handling
* **Responsive Design**: Mobile-first approach with professional styling

---

## Code Quality Features

* **SOLID Principles**: Clean, modular code with single responsibility
* **Clean Architecture**: Controllers, services, DTOs separated
* **Type Safety**: No `any` types used
* **Error Handling**: Proper HTTP status codes and messages
* **Code Comments**: Explains financial logic
* **Scalability**: Easy to add new bond types or calculation methods

---
