import { budgets } from './mocks/budgets';
import { createRequest, createResponse } from 'node-mocks-http';
import { BudgetController } from '../../../src/presentation/budget/budget.controller';
import { Budgetservice } from '../../../src/presentation/budget/budgets.service';
import { prisma } from '../../../src/data/prisma/prisma-db';

const budgetService = new Budgetservice();
const budgetController = new BudgetController(budgetService);

jest.mock('../../../src/data/prisma/prisma-db', () => ({
  __esModule: true,
  prisma: {
    budget: {
      findMany: jest.fn(),
    },
  },
}));

describe('BudgetController', () => {
  it('should retrieve 3 budgets', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/api//budget',
      user: { id: '826f3d07-8dd8-4269-8144-ce4895928b19' },
    });
    const res = createResponse();

    (prisma.budget.findMany as jest.Mock).mockResolvedValue(budgets);
    await budgetController.getAllBudgets(req, res);

    console.log(res._getData());

    expect(res.statusCode).toBe(200);
    // expect(res._getJSONData()).toEqual(budgets);
  });
});
