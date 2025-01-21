import { prisma } from '../data/prisma/prisma-db';
import {
  BudgetEntity,
  CreaateBudgetDto,
  CustomError,
  GetBudgetByIdDto,
} from '../domain';

export class Budgetservice {
  async createBudget(createBudgetDto: CreaateBudgetDto) {
    const budget = await prisma.budget.create({
      data: createBudgetDto,
    });
    return BudgetEntity.fromJson(budget);
  }
  async getAllBudgets() {
    const budgets = await prisma.budget.findMany();
    const budgetsEntity = budgets.map((budget) =>
      BudgetEntity.fromJson(budget)
    );
    return budgetsEntity;
  }

  async getBudgetById(getBudgetByIdDto: GetBudgetByIdDto) {
    const { id } = getBudgetByIdDto;
    const budget = await prisma.budget.findUnique({
      where: { id },
    });
    if (!budget) {
      throw CustomError.notFound('Budget not found');
    }

    return BudgetEntity.fromJson(budget);
  }
}
