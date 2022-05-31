const { v4: uuid } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    }
  }, {
    tableName: 'products'
  });

  Product.beforeValidate(product => product.id = uuid());

  Product.associate = models => {
    Product.hasMany(models.CartItem, {
      foreignKey: 'productId',
      as: 'cartItems',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }

  return Product;
}