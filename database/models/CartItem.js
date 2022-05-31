const { v4: uuid } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define('CartItem', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    cartId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'cartItems'
  });

  CartItem.beforeValidate(cartItem => cartItem.id = uuid());

  CartItem.associate = models => {
    CartItem.belongsTo(models.Cart, {
      foreignKey: 'cartId',
      as: 'cart',
      onUpdate: 'cascade',
      onDelete: 'cascade'
    });

    CartItem.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
      onUpdate: 'cascade',
      onDelete: 'cascade'
    });
  }

  return CartItem;
}