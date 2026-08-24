const { mockDeep, mockReset } = require('jest-mock-extended');
const prisma = require('../../src/config/prisma');

jest.mock('../../src/config/prisma', () => mockDeep());

beforeEach(() => {
  mockReset(prisma);
});

module.exports = prisma;