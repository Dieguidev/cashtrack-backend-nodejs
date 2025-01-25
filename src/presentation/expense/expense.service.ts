import { Expense } from '@prisma/client';
import { prisma } from '../../data/prisma/prisma-db';
import { CreateExpenseDto, ExpenseEntity } from '../../domain';

export class ExpenseService {
  async createExpense(budgetId: string, createExpenseDto: CreateExpenseDto) {
    const { amount, name } = createExpenseDto;
    const newExpense = await prisma.expense.create({
      data: {
        amount,
        name,
        budgetId,
      },
    });

    return ExpenseEntity.fromJson(newExpense);
  }

  async getExpenseByid(expense: Expense) {
      return ExpenseEntity.fromJson(expense);
    }
}
