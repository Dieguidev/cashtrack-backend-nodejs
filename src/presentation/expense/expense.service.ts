import { prisma } from '../../data/prisma/prisma-db';
import { CreateExpenseDto } from '../../domain';

export class ExpenseService {
  async createExpense(budgetId: string, createExpenseDto: CreateExpenseDto) {
    const { amount, name } = createExpenseDto;
    const newExpense = await prisma.expense.create({
      data: {
        amount,
        name,
        budgetId
      }
    })
  }
}
