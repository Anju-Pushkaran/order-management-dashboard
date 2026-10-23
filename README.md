# Order Management Dashboard

A web-based dashboard for viewing, searching, filtering and managing customer orders.

- **Frontend:** React 19 + TypeScript, built with Vite
- **Backend:** ASP.NET Core Web API (.NET 8, C#)
- **Data:** in-memory list loaded from a local JSON file (no database)

---

## Prerequisites

| Tool                                              | Version                         |
| ------------------------------------------------- | ------------------------------- |
| [.NET SDK](https://dotnet.microsoft.com/download) | 8.0 or later                    |
| [Node.js](https://nodejs.org/)                    | 20.19+ or 22.12+ (includes npm) |

---

## Getting started

Clone the repository:

```bash
git clone https://github.com/Anju-Pushkaran/order-management-dashboard.git
cd order-management-dashboard
```

### 1. Start the backend API

```bash
dotnet run --project backend/OrderApi --launch-profile http
```

- The API runs at **http://localhost:5172**
- Swagger UI (API documentation and test page): **http://localhost:5172/swagger**
- In Visual Studio: open `OrderDashboard.sln`, choose the **http** profile and press F5.

> Use the **http** profile. The https profile redirects requests, and browsers block redirects during the CORS preflight request, so the frontend could not reach the API.

### 2. Start the frontend (in a second terminal)

```bash
cd frontend
npm install
npm run dev
```

- The app runs at **http://localhost:5173**
- The API address is configured in `frontend/.env.development` (`VITE_API_BASE_URL`).
- Port 5173 is fixed (`strictPort`) because the API's CORS policy only allows this origin.

---

## Running the tests

**Backend (xUnit) – 10 tests**, from the repository root:

```bash
dotnet test
```

> Stop the API first if it is running, otherwise the build output may be locked.

**Frontend (Vitest) – 11 tests:**

```bash
cd frontend
npm test
```

---

## API endpoints

| Method | Endpoint       | Description                       | Responses     |
| ------ | -------------- | --------------------------------- | ------------- |
| GET    | `/orders`      | Retrieve all orders               | 200           |
| GET    | `/orders/{id}` | Retrieve one order with its items | 200, 404      |
| PATCH  | `/orders/{id}` | Update an order's status          | 200, 400, 404 |

Example request body for PATCH:

```json
{ "status": "Processing" }
```

**Allowed status transitions** (validated on the backend):

| From                  | To                                           |
| --------------------- | -------------------------------------------- |
| Pending               | Processing, Cancelled                        |
| Processing            | Completed, Cancelled                         |
| Completed / Cancelled | none – these orders can no longer be changed |

Errors are returned as **ProblemDetails** JSON (`title`, `status`, `detail`), for example:

```json
{
  "title": "Invalid status change",
  "status": 400,
  "detail": "Cannot change status from Processing to Pending."
}
```

Unexpected errors are handled by global exception-handling middleware and return a 500 ProblemDetails response.

---

## Architecture

```
order-management-dashboard/
├── backend/
│   ├── OrderApi/                  ASP.NET Core Web API
│   │   ├── Controllers/           HTTP layer: routes, status codes
│   │   ├── Services/              Business rules: status transitions
│   │   ├── Data/                  Data access: JSON repository + orders.json
│   │   ├── Models/                Order, OrderItem, OrderStatus, request model
│   │   └── Program.cs             Dependency injection, CORS, error handling
│   └── OrderApi.Tests/            xUnit tests for the service
├── frontend/
│   └── src/
│       ├── api/                   HTTP calls to the backend (fetch + error handling)
│       ├── components/            React components
│       ├── types/                 TypeScript types for the API data
│       └── utils/                 Pure functions: filtering, sorting, formatting (+ tests)
└── OrderDashboard.sln
```

### Backend: layered architecture

**Controller → Service → Repository**

- **`OrdersController`** handles HTTP only: reads the request, calls the service and maps the result to 200 / 400 / 404.
- **`OrderService`** contains the business rules (allowed status transitions, locked statuses). It returns a result object (`Success`, `NotFound`, `InvalidTransition`) instead of throwing exceptions for expected business outcomes.
- **`JsonOrderRepository`** loads `Data/orders.json` into memory at startup and handles reads and updates. It is registered as a **singleton** so changes persist between requests, and it uses a lock for thread safety.
- Layers depend on **interfaces** (`IOrderService`, `IOrderRepository`) registered with ASP.NET Core **dependency injection**. This keeps the service testable with a fake repository and would allow swapping the JSON repository for a database (e.g. SQL Server with EF Core) without changing the controller or service.
- Request validation: `[ApiController]` + `[Required]` on the request model return 400 automatically for a missing or unknown status.
- Order and line totals are **calculated** properties (`decimal`), so they can never disagree with the order items.

### Frontend: component structure

```
App                      state: orders, loading, error, search, status filter, sort, selected order
├── SummaryCards         order counts per status
├── SearchFilterBar      search box, status filter, sort selector
├── OrderTable           orders table (click a row or press Enter to open details)
│   └── StatusBadge
└── OrderDetailsModal    loads GET /orders/{id}, shows items and totals
    └── StatusUpdateForm shows only allowed next statuses, sends PATCH
```

- **State** lives in `App`. Child components receive data through props and report user actions through callback props.
- The visible list is **derived** on each render: `orders → filterOrders → sortOrders → table`, so search, filter and sort always work together.
- All HTTP calls are in `src/api/ordersApi.ts`, separate from the UI. Failed responses are turned into a single `ApiError` with a readable message.
- The UI shows a status change **only after the API confirms it**, then updates the table, the summary cards and the modal from the server's response.

---

## Features

### Priority 1 – completed

- Order listing with ID, customer, date, status (colour-coded badge) and total
- Loading indicator, error messages and an empty-state message
- Search by order ID or customer name (case-insensitive) and filter by status, combined, without page reloads
- Order details modal loaded from the API: items, quantities, unit prices, line totals and order total; "order not found" handled
- Status update with only valid transitions offered; Completed/Cancelled orders locked; errors displayed if the update fails
- REST API with validation, correct status codes and exception handling

### Priority 2 – completed

- Summary cards (total, pending, processing, completed, cancelled) that update after a status change
- Sorting by order date or total, ascending or descending, working together with search and filter
- Responsive layout for desktop and mobile (tables scroll horizontally on small screens)
- Accessibility: labelled inputs, keyboard-accessible table rows, visible focus outlines, dialog and alert roles
- Automated tests: 10 backend (xUnit) + 11 frontend (Vitest)
- Backend code organisation: separated controllers, services and data access; structured ProblemDetails errors; request validation

---

## Assumptions and limitations

- **Data is in memory.** Status changes are kept while the API runs but are reset to `orders.json` when the API restarts. A production version would use a database.
- **No authentication or authorisation**, as stated in the assessment.
- **Search, filter and sort run in the browser** on the full list, which is fine for this data size. For large data sets they should move to the API (query parameters, SQL `ORDER BY`/`WHERE` with indexes, and paging).
- **Status transition rules exist on both sides:** the frontend uses them to show only valid options, and the backend enforces them. If the rules change, both must be updated (an alternative would be for the API to return the allowed next statuses).
- **Concurrency:** two simultaneous updates to the same order are not detected. With a database I would add optimistic concurrency (a row version and a 409 Conflict response).
- **Dates** are treated as date-only values (`YYYY-MM-DD`) and displayed in local time.
- All customer and product data is **fictional**.

### Possible improvements

- Integration tests for the API endpoints (`WebApplicationFactory`) and React component tests (React Testing Library)
- CI pipeline running `dotnet test` and `npm test` on every push
- Close the details dialog with the Escape key and return keyboard focus to the selected row
- Clickable column headers for sorting

---

## Use of AI-assisted tools

## Use of AI-assisted tools

I used **Claude** as an AI assistant to brush up on React and to complete the application within the 48-hour timeframe. It supported planning, architecture decisions,styling and responsive design, writing tests, verification and debugging, and drafting this README. I reviewed every change and made the final decisions.
