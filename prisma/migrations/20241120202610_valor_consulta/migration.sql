/*
  Warnings:

  - You are about to drop the column `id_cartao` on the `tbl_pagamentos` table. All the data in the column will be lost.
  - You are about to drop the `tbl_cartoes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tbl_cliente_cartao` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `tbl_cliente_cartao` DROP FOREIGN KEY `CARTAO_CLIENTE_CARTAO`;

-- DropForeignKey
ALTER TABLE `tbl_cliente_cartao` DROP FOREIGN KEY `CLIENTE_CLIENTE_CARTAO`;

-- DropForeignKey
ALTER TABLE `tbl_pagamentos` DROP FOREIGN KEY `CARTAO_PAGAMENTO`;

-- AlterTable
ALTER TABLE `tbl_consultas` MODIFY `valor` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `tbl_pagamentos` DROP COLUMN `id_cartao`;

-- AlterTable
ALTER TABLE `tbl_psicologos` ADD COLUMN `descricao` VARCHAR(350) NULL,
    ADD COLUMN `price` DOUBLE NOT NULL DEFAULT 100.0;

-- DropTable
DROP TABLE `tbl_cartoes`;

-- DropTable
DROP TABLE `tbl_cliente_cartao`;

-- CreateTable
CREATE TABLE `tbl_avaliacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `texto` VARCHAR(250) NULL,
    `avaliacao` ENUM('1', '2', '3', '4', '5') NULL,
    `id_cliente` INTEGER NOT NULL,
    `id_psicologo` INTEGER NOT NULL,

    INDEX `CLIENTE_AVALIACAO`(`id_cliente`),
    INDEX `PSICOLOGO_AVALIACAO`(`id_psicologo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_clientes_preferencias` ADD CONSTRAINT `PREFERENCIAS_CLIENTES_PREFERENCIAS` FOREIGN KEY (`id_preferencias`) REFERENCES `tbl_preferencias`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_avaliacoes` ADD CONSTRAINT `CLIENTE_AVALIACAO` FOREIGN KEY (`id_cliente`) REFERENCES `tbl_clientes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_avaliacoes` ADD CONSTRAINT `PSICOLOGO_AVALIACAO` FOREIGN KEY (`id_psicologo`) REFERENCES `tbl_psicologos`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
