import { ExpenseService } from "./expense.service";

export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}
}
