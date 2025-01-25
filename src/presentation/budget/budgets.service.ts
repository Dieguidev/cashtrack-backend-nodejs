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
  async createBudget(createBudgetDto: CreaateBudgetDto) {
    const budget = await prisma.budget.create({
      data: createBudgetDto,
    });
    return BudgetEntity.fromJson(budget);
  }
  async getAllBudgets() {
    const budgets = await prisma.budget.findMany({
      orderBy: { createdAt: 'desc' },
      // TODO: filtrar por usuario
    });
    const budgetsEntity = budgets.map((budget) =>
      BudgetEntity.fromJson(budget)
    );
    return budgetsEntity;
  }

  async getBudgetById(budget: Budget) {
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

  async deleteBudget(getBudgetByIdDto: GetBudgetByIdDto) {
    const { id } = getBudgetByIdDto;
    const budgetExists = await prisma.budget.findUnique({
      where: { id },
    });
    if (!budgetExists) {
      throw CustomError.notFound('Budget not found');
    }
    const budget = await prisma.budget.delete({
      where: { id },
    });
    return BudgetEntity.fromJson(budget);
  }
}
