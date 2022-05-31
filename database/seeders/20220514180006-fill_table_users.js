'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');

const faker = require('@faker-js/faker').default;

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', new Array(30).fill().map(idx => {
      return {
        id: uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email().toLocaleLowerCase(),
        password: bcrypt.hashSync("12345678", 10)   
      };
    }), {});
   
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
