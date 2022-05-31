const { v4: uuid } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.CHAR(60),
      allowNull: false
    }
  }, {
    tableName: 'users'
  });

  User.beforeValidate(user => {
    user.id = uuid()
  });

  User.associate = models => {
    User.hasOne(models.Cart, {
      foreignKey: 'userId',
      as: 'cart',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }

  return User;
}