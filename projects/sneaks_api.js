const express = require('express');
const SneaksAPI = require('sneaks-api');

const app = express();
const sneaks = new SneaksAPI();


// Endpoint to fetch product prices
app.get('/product/:productId', (req, res) => {
    const productId = req.params.productId;
    sneaks.getProductPrices(productId, function (err, product) {
        if (err) {
            console.error("Error getting product prices:", err);
            res.status(500).send(`Error getting product prices: ${err.message}`);
        } else if (!product || !product.lowestResellPrice || !product.lowestResellPrice.stockX) {
            res.status(404).send(`No products found for productId: ${productId}`);
        } else {
            const stockXPrice = product.lowestResellPrice.stockX;
            res.json({ price: stockXPrice });
        }
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
