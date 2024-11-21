/*
  Warnings:

  - You are about to drop the column `price` on the `tbl_psicologos` table. All the data in the column will be lost.
  - Added the required column `preco` to the `tbl_psicologos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tbl_consultas` MODIFY `valor` FLOAT NOT NULL;

-- AlterTable
ALTER TABLE `tbl_psicologos` DROP COLUMN `price`,
    ADD COLUMN `preco` FLOAT NOT NULL;
