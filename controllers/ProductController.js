const { Product } = require('../database/models');

exports.renderProducts = async function(request, response) {
  const products = await Product.findAll();

  return response.render('products', { products });
}

exports.renderSingleProduct = async function(request, response) {
  const { productId } = request.params;

  const product = await Product.findByPk(productId);

  return response.render('product', { product });
}