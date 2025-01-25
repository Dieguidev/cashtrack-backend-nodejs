-- DropForeignKey
ALTER TABLE `expense` DROP FOREIGN KEY `Expense_budgetId_fkey`;

-- DropIndex
DROP INDEX `Expense_budgetId_fkey` ON `expense`;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_budgetId_fkey` FOREIGN KEY (`budgetId`) REFERENCES `Budget`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
