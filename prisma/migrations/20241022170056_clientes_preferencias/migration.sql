/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `tbl_clientes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `tbl_clientes` MODIFY `email` VARCHAR(256) NOT NULL,
    MODIFY `id_sexo` INTEGER NULL;

-- AlterTable
ALTER TABLE `tbl_sexo` MODIFY `sexo` VARCHAR(50) NULL;

-- CreateTable
CREATE TABLE `tbl_preferencias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(15) NOT NULL,
    `cor` VARCHAR(7) NOT NULL,

    UNIQUE INDEX `nome`(`nome`),
    UNIQUE INDEX `cor`(`cor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_psicologos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(50) NOT NULL,
    `data_nascimento` DATE NOT NULL,
    `cip` VARCHAR(9) NOT NULL,
    `cpf` VARCHAR(11) NOT NULL,
    `email` VARCHAR(256) NOT NULL,
    `senha` VARCHAR(20) NOT NULL,
    `telefone` VARCHAR(11) NOT NULL,
    `foto_perfil` VARCHAR(300) NULL,
    `link_instagram` VARCHAR(56) NULL,
    `id_sexo` INTEGER NOT NULL,

    UNIQUE INDEX `cip`(`cip`),
    UNIQUE INDEX `cpf`(`cpf`),
    UNIQUE INDEX `email`(`email`),
    INDEX `SEXO_PSICOLOGOS`(`id_sexo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_clientes_preferencias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_clientes` INTEGER NULL,
    `id_preferencias` INTEGER NULL,

    INDEX `CLIENTES_CLIENTES_PREFERENCIAS`(`id_clientes`),
    INDEX `PREFERENCIAS_CLIENTES_PREFERENCIAS`(`id_preferencias`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_disponibilidade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dia_semana` ENUM('Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado') NOT NULL,
    `horario_inicio` TIME(0) NOT NULL,
    `horario_fim` TIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_psicologo_disponibilidade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `psicologo_id` INTEGER NOT NULL,
    `disponibilidade_id` INTEGER NOT NULL,
    `status_disponibilidade` VARCHAR(20) NOT NULL,

    INDEX `DISPONIBILIDADE_PSICOLOGO_DISPONIBILIDADE`(`disponibilidade_id`),
    INDEX `PSICOLOGO_PSICOLOGO_DISPONIBILIDADE`(`psicologo_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `cpf` ON `tbl_clientes`(`cpf`);

-- AddForeignKey
ALTER TABLE `tbl_psicologos` ADD CONSTRAINT `SEXO_PSICOLOGOS` FOREIGN KEY (`id_sexo`) REFERENCES `tbl_sexo`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_clientes_preferencias` ADD CONSTRAINT `CLIENTES_CLIENTES_PREFERENCIAS` FOREIGN KEY (`id_clientes`) REFERENCES `tbl_clientes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_clientes_preferencias` ADD CONSTRAINT `PREFERENCIAS_CLIENTES_PREFERENCIAS` FOREIGN KEY (`id_preferencias`) REFERENCES `tbl_preferencias`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_psicologo_disponibilidade` ADD CONSTRAINT `tbl_psicologo_disponibilidade_ibfk_2` FOREIGN KEY (`disponibilidade_id`) REFERENCES `tbl_disponibilidade`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_psicologo_disponibilidade` ADD CONSTRAINT `tbl_psicologo_disponibilidade_ibfk_1` FOREIGN KEY (`psicologo_id`) REFERENCES `tbl_psicologos`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- RenameIndex
ALTER TABLE `tbl_clientes` RENAME INDEX `tbl_clientes_email_key` TO `email`;
