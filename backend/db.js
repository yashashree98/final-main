import bcrypt from 'bcryptjs';

const db = {
  users: [
      {
        name: 'User1',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('admin-123'),
        isAdmin: true,
      },
      {
        name: 'User2',
        email: 'user@gmail.com',
        password: bcrypt.hashSync('user-123'),
        isAdmin: false,
      },
  ],
    services: [
      {
       // _id: '1',
        name: 'Indoor Cleaning Services',
        slug: 'indoor-clean-service',
        image: '/images/indoor.png', // 679px × 829px
        price: 120,
        countInStock: 10,
        description: 'This is indoor cleaning services',
      },
      {
        //_id: '2',
        name: 'Outdoor Cleaning Services',
        slug: 'outdoor-clean-service',
        image: '/images/outdoor.png', // 679px × 829px
        price: 120,
        countInStock: 10,
        description: 'This is outdoor cleaning services',
      },
      {
       // _id: '3',
        name: 'Repairing Services',
        slug: 'repair-service',
        image: '/images/repair.png', // 679px × 829px
        price: 120,
        countInStock: 10,
        description: 'This is repairing services',
      },
      {
        //_id: '4',
        name: 'Plumbing Services',
        slug: 'plumbing-service',
        image: '/images/plumbing.png', // 679px × 829px
        price: 120,
        countInStock: 10,
        description: 'This is plumbing services',
      },
    ],
  };
  export default db;