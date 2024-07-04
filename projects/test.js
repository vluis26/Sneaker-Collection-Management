const SneaksAPI = require('sneaks-api');
const sneaks = new SneaksAPI();


sneaks.getProductPrices("DZ5485-612", function(err, product){
    console.log(product)
})
