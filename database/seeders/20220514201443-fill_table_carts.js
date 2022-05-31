'use strict';

const { v4: uuid } = require('uuid');
const { User } = require('../models');

const faker = require('@faker-js/faker').default;

module.exports = {
  async up (queryInterface, Sequelize) {
    try {

      const usersIds = await User.findAll({ attributes: ['id'] })
      .then(ids => ids.map(id => id.dataValues.id));
      
      console.log(usersIds)
      await queryInterface.bulkInsert('carts', usersIds.map(userId => {
        return {
          id: uuid(),
          userId
        };
      }), {});
      
    } catch (err) {
      console.log(err)
    }
    },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('carts', null, {});
  }
};
