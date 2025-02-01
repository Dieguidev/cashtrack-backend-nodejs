import { Budget } from '@prisma/client';
import { prisma } from '../../data/prisma/prisma-db';
import {
  BudgetEntity,
  CreaateBudgetDto,
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
      include: {
        User: {
          select: {
            id: true,
          },
        }
      }
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
      include: {
        User: {
          select: {
            id: true,
          },
        }
      }
    });
    return BudgetEntity.fromJson(budget);
  }

  async deleteBudget(budgetId: string) {
    const budget = await prisma.budget.delete({
      where: { id: budgetId },
      include: {
        User: {
          select: {
            id: true,
          },
        }
      }
    });
    return BudgetEntity.fromJson(budget);
  }
}
