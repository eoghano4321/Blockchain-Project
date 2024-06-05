const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/api', createProxyMiddleware({
    target: 'https://rpc2.sepolia.org',
    changeOrigin: true,
    pathRewrite: {
        '^/api': ''
    },
}));

app.listen(3030, () => {
    console.log('Proxy server is running on http://localhost:3030');
});
