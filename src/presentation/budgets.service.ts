import { prisma } from "../data/prisma/prisma-db"

export class Budgetservice {
  async getAllBudgets(){
    const budgets = await prisma.budget.findMany()
    return budgets;
  }


}
