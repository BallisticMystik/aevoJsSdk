const { AevoClient } = require('alethieum-aevo-sdk'); // Hypothetical SDK, replace with the actual SDK if available
const { clientConfig } = require('./clientConfig'); // Assuming clientConfig.js exports configuration
const log = require('loguru'); // If loguru is not available in JS, use `console.log` or another logging library

// Add Credentials
const aevo = new AevoClient(clientConfig);

// Create a market order
const orderParams = {
    instrument_id: '',  // Instrument ID number
    is_buy: '',         // True for long order, false for short order
    quantity: '',       // Number of contracts, in 6 decimals fixed number
};

(async function() {
    try {
        const order = await aevo.restCreateMarketOrder(orderParams);
        log.info(`Order: ${JSON.stringify(order)}`);
    } catch (error) {
        log.error(`Error creating market order: ${error.message}`);
    }
})();
