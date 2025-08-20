'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = JSON.parse(
      fs.readFileSync(path.join(__dirname, './data/brands.json'), 'utf-8')
    ).map(item => {
      delete item.id;

      item.createdAt = new Date();
      item.updatedAt = new Date();
      return item;
    });

    await queryInterface.bulkInsert('Brands', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Brands', null, {});
  }
};
