const { ethers } = require('ethers');

// Signing key and wallet address (Replace with your actual keys)
const signingKey = "your_private_key";
const wallet = new ethers.Wallet(signingKey);

// Order message to sign
const orderMessage = {
    maker: "your_wallet_address", // Replace with your wallet address
    isBuy: true,                 // true if buy, false if sell
    instrument: "ETH-24AUG22-1850-C", // Replace with the actual instrument

    // Limit price in 6 decimals, e.g., $10.00 = "10000000"
    limitPrice: ethers.utils.parseUnits("10", 6).toString(),

    // Number of contracts
    amount: 10,

    // Timestamp in UNIX seconds
    timestamp: Math.floor(Date.now() / 1000), // Current timestamp

    // Random salt
    salt: Math.floor(Math.random() * 1e6).toString(),
};

// EIP-712 domain details
const domain = {
    name: "Aevo Mainnet",  // Replace with appropriate network name
    version: "1",
    chainId: 1,            // Mainnet chain ID
};

// EIP-712 types for the `Order` message
const types = {
    Order: [
        { name: "maker", type: "address" },
        { name: "isBuy", type: "bool" },
        { name: "limitPrice", type: "uint256" },
        { name: "amount", type: "uint256" },
        { name: "salt", type: "uint256" },
        { name: "instrument", type: "string" },
        { name: "timestamp", type: "uint256" },
    ],
};

// Generate the signature for the order
async function signOrder() {
    try {
        // Sign the typed data
        const signature = await wallet._signTypedData(domain, types, orderMessage);
        console.log("Order Signature:", signature);
        return signature;
    } catch (error) {
        console.error("Error signing order:", error);
    }
}

signOrder();
