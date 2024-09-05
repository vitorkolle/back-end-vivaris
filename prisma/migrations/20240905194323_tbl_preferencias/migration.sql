/*
  Warnings:

  - Made the column `id_sexo` on table `tbl_clientes` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `tbl_clientes` DROP FOREIGN KEY `SEXO_CLIENTE`;

-- AlterTable
ALTER TABLE `tbl_clientes` MODIFY `cpf` VARCHAR(11) NOT NULL,
    MODIFY `telefone` VARCHAR(11) NOT NULL,
    MODIFY `id_sexo` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `tbl_clientes` ADD CONSTRAINT `SEXO_CLIENTE` FOREIGN KEY (`id_sexo`) REFERENCES `tbl_sexo`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
