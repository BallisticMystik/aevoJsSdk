const WebSocket = require('ws');
const axios = require('axios');
const { ethers } = require('ethers');
const crypto = require('crypto');

const CONFIG = {
    testnet: {
        rest_url: "https://api-testnet.aevo.xyz",
        ws_url: "wss://ws-testnet.aevo.xyz",
        signing_domain: {
            name: "Aevo Testnet",
            version: "1",
            chainId: "11155111",
        },
    },
    mainnet: {
        rest_url: "https://api.aevo.xyz",
        ws_url: "wss://ws.aevo.xyz",
        signing_domain: {
            name: "Aevo Mainnet",
            version: "1",
            chainId: "1",
        },
    },
};

class AevoClient {
    constructor({ signingKey = '', walletAddress = '', apiKey = '', apiSecret = '', env = 'testnet', restHeaders = {} }) {
        this.signingKey = signingKey;
        this.walletAddress = walletAddress;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.connection = null;
        this.restHeaders = {
            'AEVO-KEY': apiKey,
            'AEVO-SECRET': apiSecret,
            ...restHeaders
        };

        if (!['testnet', 'mainnet'].includes(env)) {
            throw new Error("Environment must be 'testnet' or 'mainnet'");
        }
        this.env = env;
    }

    get restUrl() {
        return CONFIG[this.env].rest_url;
    }

    get wsUrl() {
        return CONFIG[this.env].ws_url;
    }

    get signingDomain() {
        return CONFIG[this.env].signing_domain;
    }

    async openConnection(extraHeaders = {}) {
        console.log('Opening Aevo websocket connection...');
        this.connection = new WebSocket(this.wsUrl, {
            headers: extraHeaders,
        });

        this.connection.on('open', () => {
            console.log('Connection opened.');
            if (this.apiKey && this.walletAddress) {
                this.sendMessage({
                    id: 1,
                    op: 'auth',
                    data: {
                        key: this.apiKey,
                        secret: this.apiSecret,
                    },
                });
            }
        });

        this.connection.on('error', (err) => {
            console.error('WebSocket error:', err);
            setTimeout(() => this.reconnect(), 10000); // Reconnect with backoff
        });

        this.connection.on('close', () => {
            console.log('WebSocket closed.');
            setTimeout(() => this.reconnect(), 10000);
        });
    }

    async reconnect() {
        console.log('Reconnecting...');
        await this.closeConnection();
        await this.openConnection();
    }

    async closeConnection() {
        if (this.connection) {
            console.log('Closing connection...');
            this.connection.close();
            console.log('Connection closed.');
        }
    }

    sendMessage(data) {
        if (this.connection && this.connection.readyState === WebSocket.OPEN) {
            this.connection.send(JSON.stringify(data));
        } else {
            console.error('Connection is not open. Reconnecting...');
            this.reconnect();
        }
    }

    async subscribeTicker(channel) {
        this.sendMessage({
            op: 'subscribe',
            data: [channel],
        });
    }

    async readMessages(onMessage) {
        this.connection.on('message', (data) => {
            try {
                const message = JSON.parse(data);
                onMessage(message);
            } catch (err) {
                console.error('Error parsing message:', err);
            }
        });
    }

    async restGetMarkets(asset) {
        try {
            const response = await axios.get(`${this.restUrl}/markets?asset=${asset}`, { headers: this.restHeaders });
            return response.data;
        } catch (err) {
            console.error('Error fetching markets:', err);
            throw err;
        }
    }

    async restCreateOrder(instrumentId, isBuy, limitPrice, quantity, postOnly = true) {
        const data = this.createOrderPayload(instrumentId, isBuy, limitPrice, quantity, postOnly);
        try {
            const response = await axios.post(`${this.restUrl}/orders`, data, { headers: this.restHeaders });
            return response.data;
        } catch (err) {
            console.error('Error creating order:', err);
            throw err;
        }
    }

    createOrderPayload(instrumentId, isBuy, limitPrice, quantity, postOnly = true) {
        const salt = crypto.randomInt(0, 1e10);
        const timestamp = Math.floor(Date.now() / 1000);
        return {
            instrument: instrumentId,
            maker: this.walletAddress,
            is_buy: isBuy,
            amount: String(quantity * 1e6),
            limit_price: String(limitPrice * 1e6),
            salt: String(salt),
            post_only: postOnly,
            timestamp,
        };
    }
}

// Main Functionality
(async function main() {
    const aevoClient = new AevoClient({
        signingKey: '',
        walletAddress: '',
        apiKey: '',
        apiSecret: '',
        env: 'testnet',
    });

    const markets = await aevoClient.restGetMarkets('ETH');
    console.log('Markets:', markets);

    await aevoClient.openConnection();
    aevoClient.subscribeTicker('ticker:ETH:PERPETUAL');

    aevoClient.readMessages((message) => {
        console.log('Message:', message);
    });
})();
