# Store management

Store Management is a frontend application built with [Next.js](https://nextjs.org/) for comprehensive store management. It allows you to manage products, orders, customers, invoices, and more.

This project is a frontend part of [Store Management Backend](https://github.com/berthosefin/lv-mgz-api/).

**Features**:

<ul>
	<li>- [x] Dashboard</li>
	<li>- [x] User management</li>
	<li>- [x] Article management</li>
	<li>- [x] Order management</li>
	<li>- [x] Customer management</li>
	<li>- [x] Invoice management</li>
	<li>- [x] Cash desk summary and transaction list</li>
	<li>- [x] Dark mode support</li>
	<li>- [ ] Internationalization</li>
</ul>

## Installation and setup

Create a `.env.local` file with the following properties:

```
# Backend API URL
NEXT_PUBLIC_API_URL="http://localhost:3001/api"

# JWT Expiration Times in seconds
JWT_EXPIRATION_TIME=3600  # 1 hour
JWT_REFRESH_EXPIRATION_TIME=2592000  # 30 days
```

Installing dependencies

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run dev
```
