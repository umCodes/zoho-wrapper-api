# Zoho Inventory API Wrapper

A backend service that wraps the Zoho Inventory API to simplify data entry, normalize request payloads, and return cleaner, developer-friendly responses.  
The system abstracts third-party complexity and exposes a structured, authenticated REST API for internal use.

---

## Tech Stack

- Node.js
- Express
- PostgreSQL
- Redis
- JWT Authentication (Access + Refresh Tokens)
- RESTful Client–Server Architecture

---

## Features

- User registration and authentication
- Access & refresh token flow
- Role-based access control
- Centralized JWT authentication middleware
- CRUD operations for inventory workflows
- Structured request validation
- Service-layer abstraction over Zoho API

---

# Authentication & Headers

All routes **except**:

- `POST /api/auth/register`
- `POST /api/auth/login`

require the following headers:

```

Authorization: Bearer <access_token>

```

The authentication middleware:

- Extracts the access token from the `Authorization` header
- Verifies it using `ACCESS_TOKEN_SIGNATURE`
- Attaches the decoded payload to `req.user`
- Rejects missing or invalid tokens

```

auth-refresh-token: <refresh_token>

````

---

# API Endpoints

> Unless stated otherwise, all endpoints require:
>
> `Authorization: Bearer <access_token>`

---

## Authentication

### Register
`POST /api/auth/register`

```json
{
  "name": "",
  "role": "",
  "phone_number": "",
  "password": "",
  "confirm_password": ""
}
````

### Login

`POST /api/auth/login`

```json
{
  "phone_number": "",
  "password": ""
}
```

### Logout

`DELETE /api/auth/logout`

Headers:

```
Authorization: Bearer <access_token>
auth-refresh-token: <refresh_token>
```

### Refresh Access Token

`POST /api/auth/refresh`

Headers:

```
Authorization: Bearer <access_token>
auth-refresh-token: <refresh_token>
```

---

## Items

### Get Items

`GET /api/items`

### Create Item

`POST /api/item`

Required fields:

* name
* description
* unit
* rate
* purchase_rate
* product_type
* inventory_account_id
* location:

  * location_id
  * initial_stock

---

## Composite Items

### Get Composite Items

`GET /api/compositeitems`

### Get Composite Item by ID

`GET /api/compositeitems/:composite_item_id`

### Create Composite Item

`POST /api/compositeItem`

Required fields:

* name
* description
* mapped_items:

  * item_id
  * quantity
* item_type
* unit
* sku
* rate
* product_type
* inventory_account_id

---

## Assemblies

### Create Assembly

`POST /api/assembly`

Required fields:

* composite_item_id
* composite_item_name
* description
* date
* quantity_to_bundle
* line_items:

  * item_id
  * name
  * quantity_consumed
  * unit
  * warehouse_id
* is_complete
* warehouse_id

---

## Sales Orders

### Create Sales Order

`POST /api/salesorders`

Required fields:

* customer_id
* line_items:

  * item_id
  * quantity

### Get Sales Orders

`GET /api/salesorders`

### Get Sales Order by ID

`GET /api/salesorders/:id`

---

## Packages

### Get Packages

`GET /api/packages`

### Get Package by ID

`GET /api/packages/:id`

### Create Package

`POST /api/packages`

Required fields:

* salesorder_id
* line_items:

  * so_line_item_id
  * quantity
* date

### Ship Order

`POST /api/packages/ship`

```json
{
  "salesorder_id": "",
  "package_ids": []
}
```

---

## Shipments

### Get Shipments

`GET /api/shipments`

### Get Shipment by ID

`GET /api/shipments/:id`

---

## Customers

### Get Customers

`GET /api/customers`

---

# Installation

```bash
git clone https://github.com/umCodes/zoho-wrapper-api
cd project
npm install
npm run dev
```

---

# Environment Variables

## Application

```
PORT=
```

## JWT Configuration

```
ACCESS_TOKEN_SIGNATURE=
REFRESH_TOKEN_SIGNATURE=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_EXPIRY=
```

## Zoho Configuration

```
ORGANIZATION_ID=
ZOHO_REFRESH_TOKEN=
ZOHO_REDIRECT_URI=
CLIENT_ID=
CLIENT_SECRET=
WAREHOUSE_ID=
```

## PostgreSQL (Development)

```
PG_HOST=
PG_PORT=
PG_USER=
PG_PASSWORD=
PG_DB_NAME=
```

---

## Future Improvements

* Rate limiting
* Centralized validation middleware
* Structured logging
* Docker containerization
* Unit & integration testing
* Refresh token rotation strategy
