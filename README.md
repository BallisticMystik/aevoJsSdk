Overview
The Aevo SDK is a powerful library designed for interacting with the Aevo exchange. It provides developers with the tools to integrate trading, data retrieval, and account management into their applications. The SDK includes real-time market data, trading automation features, and supports advanced order execution strategies.

Features & Functions
Key Features
Real-time Market Data:
Access live data for all instruments on the Aevo exchange, including:
-----------------------------------------
Order book data
Trade data
Ticker data
Order Execution Strategies:
Automate trading with various order types:
-----------------------------------------   
Market orders
Limit orders
Stop orders
Trading Bots:
Automate trading further with built-in bots like Gridbots, designed to execute trades based on specific market conditions.
-----------------------------------------
Webhooks:
Receive real-time updates on market events and order execution using webhooks.
-----------------------------------------

Core Functions
The SDK provides the following functions to streamline interaction with the Aevo exchange:
-----------------------------------------
Market Data
get_instruments(): Returns a list of all instruments on the Aevo exchange.
get_order_book(instrument_id): Fetches the order book for a specific instrument.
get_trades(instrument_id): Retrieves trade data for a specific instrument.
get_ticker(instrument_id): Fetches ticker data for a specific instrument.
------------------------------------------------------------------------------------------------
Order Management
place_market_order(instrument_id, side, quantity): Places a market order.
place_limit_order(instrument_id, side, quantity, price): Places a limit order.
place_stop_order(instrument_id, side, quantity, stop_price): Places a stop order.
cancel_order(order_id): Cancels an existing order.
get_order(order_id): Retrieves information about an order.
get_orders(): Lists all open orders.
get_order_history(): Retrieves all filled and cancelled orders.

Account Management
get_account(): Retrieves user account details.
get_balance(currency): Returns the user's balance for a specific currency.
get_deposit_address(currency): Fetches the deposit address for a currency.
withdraw(currency, amount, address): Withdraws funds to a specified address.

------------------------------------------------------------------------------------------------
Order Signing
sign_order(instrument_id, is_buy, limit_price, quantity): Signs an order with the user’s private key for secure trading.
Setup Instructions
Prerequisites
Node.js: Ensure you have Node.js installed. Download it from Node.js.
API Key and Secret: Generate your API key and secret from the Aevo platform.
Installation
Clone the repository or download the SDK.
Install dependencies using npm:
bash
Copy code
npm install
Configuration
Create a clientConfig.js file in your project directory with the following structure:


javascript
Copy code
const CLIENT_CONFIG = {
    signingKey: '',     // Your signing key
    walletAddress: '',  // Your wallet address
    apiKey: '',         // Your API key
    apiSecret: '',      // Your API secret
    env: 'testnet',     // Environment: 'testnet' or 'mainnet'
};

module.exports = CLIENT_CONFIG;
Replace placeholders with your credentials. Refer to the instructions in the Aevo documentation for generating API keys and secrets.

Usage Example
javascript
Copy code
const { AevoClient } = require('alethieum-aevo-sdk');
const clientConfig = require('./clientConfig');
const log = require('loguru'); // Replace with console.log if loguru isn't installed

(async function main() {
    // Initialize AevoClient with credentials
    const aevo = new AevoClient(clientConfig);

    // Fetch and log available instruments
    const instruments = await aevo.getInstruments();
    log.info(`Instruments: ${JSON.stringify(instruments)}`);

    // Place a market order
    const orderParams = {
        instrument_id: '123', // Replace with a valid instrument ID
        side: 'buy',          // 'buy' or 'sell'
        quantity: 1.0,        // Quantity in 6-decimal format
    };

    const order = await aevo.placeMarketOrder(orderParams);
    log.info(`Order created: ${JSON.stringify(order)}`);
})();

------------------------------------------------------------------------------------------------
Best Practices
Secure Credentials: Use environment variables to store sensitive information like API keys and secrets. Example:

javascript
Copy code
const CLIENT_CONFIG = {
    signingKey: process.env.SIGNING_KEY,
    walletAddress: process.env.WALLET_ADDRESS,
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    env: process.env.ENV || 'testnet',
};
Error Handling: Wrap API calls in try...catch blocks to handle failures gracefully.

Keep SDK Updated: Check for updates regularly to ensure compatibility with the Aevo exchange.

Troubleshooting
Connection Issues:

Ensure the env field in your clientConfig matches the desired environment (testnet or mainnet).
Check your internet connection and API credentials.
Invalid API Key/Secret:

Double-check the keys in your clientConfig file.
Regenerate keys via the Aevo platform if necessary.
Order Placement Errors:

Verify instrument IDs and other parameters before placing orders.
Check for sufficient balance in your account.
Support
For further assistance, visit the Aevo Documentation or contact support.
------------------------------------------------------------------------------------------------

OrderSigning:

EIP-712 Signing with ethers.js
Steps:
Initialize the Wallet:

Use ethers.Wallet with your private key (signing key).
Define the Domain:

This includes the EIP-712 domain details (name, version, and chainId).
Define the Data Structure:

Specify the types and fields of the message structure (e.g., Order).
Prepare the Payload:

Populate the fields of the message with actual values.
Sign the Typed Data:

Use _signTypedData method provided by ethers.js to sign the data.

------------------------------------------------------------------------------------------------
Explanation of Key Components
domain:

The EIP-712 domain specifies metadata about the application or protocol. It ensures signatures are specific to the context (e.g., the Aevo exchange).
types:

Defines the structure of the typed data. Each field includes a name and type, matching the solidity EIP-712 type definitions.
orderMessage:

This is the actual data being signed. Replace placeholders with real values as per your use case.
_signTypedData:

This method combines the domain, types, and message into the structured format required by EIP-712 and generates a signature.

------------------------------------------------------------------------------------------------
npm install axios big-integer ethers lru-cache lodash moment rlp web3 winston ws ajv
