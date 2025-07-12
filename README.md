# Pesapal API Client for Node.js

This is a Node.js/TypeScript client for interacting with the Pesapal API. It provides a convenient way to integrate Pesapal payment services into your Node.js applications.

## Features
- Simple, promise-based API for Pesapal integration
- Handles authentication, IPN registration, payment initiation, and transaction status
- Written in TypeScript for type safety
- Supports both CommonJS (`require`) and ES Module (`import`) usage

## Installation

```bash
npm install pesapal-v3
```

## Usage

### Importing the Client

#### ES Module (import)
```js
import { Pesapal } from 'pesapal-v3';
```

#### CommonJS (require)
```js
const { Pesapal } = require('pesapal-v3');
```

### Initialize the Pesapal Client

```js
const pesapal = new Pesapal({
  consumerKey: 'YOUR_CONSUMER_KEY',
  consumerSecret: 'YOUR_CONSUMER_SECRET',
  apiBaseUrl: 'https://cybqa.pesapal.com/pesapalv3/api', // Use 'https://pay.pesapal.com/v3/api' for production
});
```

### Authentication

The client handles authentication automatically, but you can explicitly get a token if needed:

```js
const token = await pesapal.getAuthToken();
console.log(token);
```

### Register an IPN URL

```js
const response = await pesapal.registerIPN({
  url: 'YOUR_IPN_CALLBACK_URL',
  ipn_notification_type: 'POST', // or 'GET'
});
console.log(response);
```

### Initiate a Payment

```js
const response = await pesapal.submitOrder({
  id: 'ORDER_ID'// can be a UUID or anything else,
  currency: 'KES',
  amount: 100,
  description: 'Payment for goods',
  callback_url: 'YOUR_PAYMENT_CALLBACK_URL',
  notification_id: 'YOUR_IPN_ID',
  billing_address: {
    email_address: 'test@example.com',
    phone_number: '123456789',
    first_name: 'John',
    last_name: 'Doe',
  },
});
console.log(response);
```

### Get Transaction Status

```js
const response = await pesapal.getTransactionStatus('ORDER_TRACKING_ID');
console.log(response);
```

## API Reference

The client exposes the following methods:

- `getAuthToken()`: Returns a promise that resolves to the authentication token.
- `registerIPN(data)`: Registers an IPN URL.
- `submitOrder(data)`: Initiates a payment.
- `getTransactionStatus(orderTrackingId)`: Gets the status of a transaction.

## Exports Field

This package uses the `exports` field in `package.json` to support both `require` and `import` usage. You can safely use either import style in your project.

## Further Reading

- **Pesapal Official API Documentation:** [API Reference](https://developer.pesapal.com/how-to-integrate/e-commerce/api-30-json/api-reference)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Maintainer

Maintained by [@mwondha](https://github.com/mwondhaf)
