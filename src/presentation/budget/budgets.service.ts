import { Budget } from '@prisma/client';
import { prisma } from '../../data/prisma/prisma-db';
import {
  BudgetEntity,
  CreaateBudgetDto,
  CustomError,
  GetBudgetByIdDto,
  UpdateBudgetDto,
} from '../../domain';

export class Budgetservice {
  async createBudget(createBudgetDto: CreaateBudgetDto, userId: string) {
    const { name, amount } = createBudgetDto;
    const budget = await prisma.budget.create({
      data: { name, amount, userId },
    });
    return BudgetEntity.fromJson(budget);
  }

  async getAllBudgets(userId: string) {
    const budgets = await prisma.budget.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    const budgetsEntity = budgets.map((budget) =>
      BudgetEntity.fromJson(budget)
    );
    return budgetsEntity;
  }

  async getBudgetById(budget: Budget, userId: string) {
    if (budget.userId !== userId) {
      throw CustomError.unauthorized('You are not authorized to view this budget');
    }
    return BudgetEntity.fromJson(budget);
  }

  async updateBudget(budgetId: string, updateBudgetDto: UpdateBudgetDto) {
    const { name, amount } = updateBudgetDto;

    const budget = await prisma.budget.update({
      where: { id: budgetId },
      data: { name, amount },
    });
    return BudgetEntity.fromJson(budget);
  }

  async deleteBudget(budgetId: string) {
    const budget = await prisma.budget.delete({
      where: { id: budgetId },
    });
    return BudgetEntity.fromJson(budget);
  }
}
