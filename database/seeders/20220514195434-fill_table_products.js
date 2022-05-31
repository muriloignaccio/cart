'use strict';

const { v4: uuid } = require('uuid');

const faker = require('@faker-js/faker').default;

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', new Array(30).fill().map(idx => {
      return {
        id: uuid(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: Number(faker.commerce.price()),
      };
    }), {});
   
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
