-- DropForeignKey
ALTER TABLE `tbl_clientes_preferencias` DROP FOREIGN KEY `PREFERENCIAS_CLIENTES_PREFERENCIAS`;

-- DropForeignKey
ALTER TABLE `tbl_psicologo_disponibilidade` DROP FOREIGN KEY `tbl_psicologo_disponibilidade_ibfk_1`;

-- DropForeignKey
ALTER TABLE `tbl_psicologo_disponibilidade` DROP FOREIGN KEY `tbl_psicologo_disponibilidade_ibfk_2`;

-- CreateTable
CREATE TABLE `tbl_cartoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `modalidade` ENUM('Credito', 'Debito') NOT NULL,
    `nome` VARCHAR(50) NOT NULL,
    `numero_cartao` VARCHAR(16) NOT NULL,
    `cvc` VARCHAR(4) NOT NULL,
    `validade` DATE NOT NULL,

    UNIQUE INDEX `numero_cartao`(`numero_cartao`),
    UNIQUE INDEX `cvc`(`cvc`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_consultas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data_consulta` DATETIME(0) NOT NULL,
    `valor` FLOAT NOT NULL,
    `avaliacao` ENUM('1', '2', '3', '4', '5') NOT NULL,
    `id_cliente` INTEGER NOT NULL,
    `id_psicologo` INTEGER NOT NULL,

    INDEX `CLIENTE_CONSULTA`(`id_cliente`),
    INDEX `PSICOLOGO_CONSULTA`(`id_psicologo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_pagamentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `is_paid` BOOLEAN NOT NULL,
    `intent_payment_id` VARCHAR(250) NULL,
    `id_consulta` INTEGER NOT NULL,
    `id_cartao` INTEGER NOT NULL,

    INDEX `CARTAO_PAGAMENTO`(`id_cartao`),
    INDEX `CONSULTA_PAGAMENTO`(`id_consulta`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_cliente_cartao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_cliente` INTEGER NOT NULL,
    `id_cartao` INTEGER NOT NULL,

    INDEX `CARTAO_CLIENTE_CARTAO`(`id_cartao`),
    INDEX `CLIENTE_CLIENTE_CARTAO`(`id_cliente`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_consultas` ADD CONSTRAINT `CLIENTE_CONSULTA` FOREIGN KEY (`id_cliente`) REFERENCES `tbl_clientes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_consultas` ADD CONSTRAINT `PSICOLOGO_CONSULTA` FOREIGN KEY (`id_psicologo`) REFERENCES `tbl_psicologos`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_pagamentos` ADD CONSTRAINT `CARTAO_PAGAMENTO` FOREIGN KEY (`id_cartao`) REFERENCES `tbl_cartoes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_pagamentos` ADD CONSTRAINT `CONSULTA_PAGAMENTO` FOREIGN KEY (`id_consulta`) REFERENCES `tbl_consultas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_psicologo_disponibilidade` ADD CONSTRAINT `DISPONIBILIDADE_PSICOLOGO_DISPONIBILIDADE` FOREIGN KEY (`disponibilidade_id`) REFERENCES `tbl_disponibilidade`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_psicologo_disponibilidade` ADD CONSTRAINT `PSICOLOGO_PSICOLOGO_DISPONIBILIDADE` FOREIGN KEY (`psicologo_id`) REFERENCES `tbl_psicologos`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_cliente_cartao` ADD CONSTRAINT `CARTAO_CLIENTE_CARTAO` FOREIGN KEY (`id_cartao`) REFERENCES `tbl_cartoes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_cliente_cartao` ADD CONSTRAINT `CLIENTE_CLIENTE_CARTAO` FOREIGN KEY (`id_cliente`) REFERENCES `tbl_clientes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
