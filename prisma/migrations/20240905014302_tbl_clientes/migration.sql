/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `tbl_clientes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(50) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `data_nascimento` DATE NOT NULL,
    `cpf` BIGINT NOT NULL,
    `senha` VARCHAR(20) NOT NULL,
    `foto_perfil` VARCHAR(300) NULL,
    `telefone` BIGINT NOT NULL,
    `link_instagram` VARCHAR(56) NULL,
    `id_sexo` INTEGER NULL,

    UNIQUE INDEX `tbl_clientes_email_key`(`email`),
    INDEX `SEXO_CLIENTE`(`id_sexo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_sexo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sexo` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_clientes` ADD CONSTRAINT `SEXO_CLIENTE` FOREIGN KEY (`id_sexo`) REFERENCES `tbl_sexo`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
