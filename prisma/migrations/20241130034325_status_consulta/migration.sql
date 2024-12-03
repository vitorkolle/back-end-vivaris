/*
  Warnings:

  - You are about to alter the column `horario_inicio` on the `tbl_disponibilidade` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(8)`.
  - You are about to alter the column `horario_fim` on the `tbl_disponibilidade` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(8)`.
  - Added the required column `status` to the `tbl_consultas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tbl_consultas` ADD COLUMN `status` VARCHAR(12) NOT NULL;

-- AlterTable
ALTER TABLE `tbl_disponibilidade` MODIFY `horario_inicio` VARCHAR(8) NOT NULL,
    MODIFY `horario_fim` VARCHAR(8) NOT NULL;

-- AlterTable
ALTER TABLE `tbl_preferencias` MODIFY `nome` VARCHAR(50) NOT NULL;
