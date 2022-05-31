const { v4: uuid } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.00
    }
  }, {
    tableName: 'carts'
  });

  Cart.beforeValidate(cart => cart.id = uuid());

  Cart.prototype.updateTotal = async function(userId){
    const cart =  await Cart.findOne({ 
      where: { userId },
      include: { all: true, nested: true }
    });

    const total = cart.toJSON().items.reduce((total, item) => {
      return total + item.quantity * item.product.price;
    }, 0);

    cart.total = total;

    await cart.save();
  }

  Cart.associate = models => {
    Cart.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    Cart.hasMany(models.CartItem, {
      foreignKey: 'cartId',
      as: 'items',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }

  return Cart;
}