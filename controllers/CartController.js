const { Cart, CartItem, Product, User } = require('../database/models');

exports.renderCart = async (request, response) => {
  const cart = await Cart.findOne({ 
    where: { userId: request.session.user.id },
    include: {
      model: CartItem, 
      as: "items", 
      include: {
        model: Product,
        as: "product"
      }
    } 
  });

  return response.render('cart', { cart });
}

exports.addToCart = async function(request, response) {
  const { productId } = request.params;
  const { quantity = 1 } = request.body;

  const cart = await Cart.findOne({ 
    where: { userId: request.session.user.id },
    include: { all: true, nested: true }
  });

  const isProductInCart = await cart.getItems({ where: { productId }})
    .then(items => items[0])

  if (!isProductInCart) {
    await cart.createItem({ productId, quantity: Number(quantity) });
  } else {
    isProductInCart.quantity += Number(quantity);
    await isProductInCart.save()
  }

  await cart.reload();

  const total = cart.toJSON().items.reduce((total, item) => {
    return total + item.quantity * item.product.price;
  }, 0);

  cart.total = total;

  await cart.save();
  
  return response.redirect('/cart');
};

exports.removeFromCart = async function(request, response) {
  const { productId } = request.params;
  const { id: userId } = request.session.user;

  const cart = await Cart.findOne({ 
    where: { userId },
    include: { all: true, nested: true }
  });
  
  await CartItem.destroy({ where: { productId } });
  
  await cart.updateTotal(userId);

  return response.redirect('/cart');
}

exports.incrementProductQuantity = async function(request, response) {
  const { productId } = request.params;
  const { id: userId } = request.session.user;

  const cart = await Cart.findOne({ 
    where: { userId },
    include: { all: true, nested: true }
  });

  const cartProduct = await cart.getItems({ where: { productId }})
    .then(items => items[0]);
  
  cartProduct.quantity += 1;

  await cartProduct.save()

  await cart.updateTotal(userId);

  return response.redirect('/cart');
}

exports.decrementProductQuantity = async function(request, response) {
  const { productId } = request.params;
  const { id: userId } = request.session.user;

  const cart = await Cart.findOne({ 
    where: { userId },
    include: { all: true, nested: true }
  });

  const cartProduct = await cart.getItems({ where: { productId }})
    .then(items => items[0]);

  if (cartProduct.quantity - 1 === 0) {
    await CartItem.destroy({ where: { productId } });
  } else {
    cartProduct.quantity -= 1;
    await cartProduct.save()
  }

  await cart.updateTotal(userId);

  return response.redirect('/cart');
}