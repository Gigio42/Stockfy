/*
  Warnings:

  - A unique constraint covering the columns `[part_number]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Item_part_number_key" ON "Item"("part_number");
