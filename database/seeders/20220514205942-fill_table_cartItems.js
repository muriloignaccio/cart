'use strict';

const { v4: uuid } = require('uuid');
const { Cart, Product } = require('../models');

const faker = require('@faker-js/faker').default;

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      const cartsIds = await Cart.findAll({ attributes: ['id'] })
        .then(ids => ids.map(id => id.dataValues.id));

      const productsIds = await Product.findAll({ attributes: ['id'] })
        .then(ids => ids.map(id => id.dataValues.id));
      
      await queryInterface.bulkInsert('cartItems', cartsIds.map(cartId => {
        return {
          id: uuid(),
          cartId,
          productId: productsIds[Math.ceil(Math.random() * productsIds.length) - 1],
          quantity: Math.ceil(Math.random() * 3)
        };
      }), {});
      
    } catch (err) {
      console.log(err)
    }
    },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('cartItems', null, {});
  }
};
