module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products', [
      {
        name: 'Yamaha C40',
        description: 'A classic nylon-string guitar, perfect for beginners.',
        price: '150',
        image: 'url_to_image21',
        inStock: true,
        brand: 'Yamaha',
        category: 'Classical',
        sku: 'YAMAHA-C40-021',
        quantity: 25,
        type: 'Classical',
        rating: '4.2',
        reviews_count: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Yamaha APX600',
        description: 'A thin body acoustic-electric guitar, ideal for performance.',
        price: '300',
        image: 'url_to_image22',
        inStock: true,
        brand: 'Yamaha',
        category: 'Acoustic-Electric',
        sku: 'YAMAHA-APX600-022',
        quantity: 15,
        type: 'Acoustic-Electric',
        rating: '4.5',
        reviews_count: 40,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Yamaha FS800',
        description: 'A small body acoustic guitar with rich sound.',
        price: '250',
        image: 'url_to_image23',
        inStock: true,
        brand: 'Yamaha',
        category: 'Acoustic',
        sku: 'YAMAHA-FS800-023',
        quantity: 20,
        type: 'Acoustic',
        rating: '4.3',
        reviews_count: 35,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Yamaha PAC012',
        description: 'An affordable electric guitar with a solid alder body.',
        price: '180',
        image: 'url_to_image24',
        inStock: true,
        brand: 'Yamaha',
        category: 'Electric',
        sku: 'YAMAHA-PAC012-024',
        quantity: 30,
        type: 'Electric',
        rating: '4.4',
        reviews_count: 45,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Yamaha LL6 ARE',
        description: 'A premium acoustic guitar with exceptional sound quality.',
        price: '700',
        image: 'url_to_image25',
        inStock: true,
        brand: 'Yamaha',
        category: 'Acoustic',
        sku: 'YAMAHA-LL6-ARE-025',
        quantity: 10,
        type: 'Acoustic',
        rating: '4.8',
        reviews_count: 25,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {});
  }
};