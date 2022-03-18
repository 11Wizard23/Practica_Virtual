---Tabla de publicaciones, necesatia para el funcionamiento
CREATE TABLE `prueba`.`publicaciones` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `img` VARCHAR(255) NOT NULL,
  `contenido` VARCHAR(255) NOT NULL,
  `fecha` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

---Tabla de usuarios, necesaria para el funcionamiento
CREATE TABLE `prueba`.`admins` (
  `id` BIGINT(12) NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(500) NOT NULL
) ENGINE = InnoDB;
ALTER TABLE `admins` ADD UNIQUE(`email`);
ALTER TABLE `admins` CHANGE `id` `id` BIGINT(12) NOT NULL AUTO_INCREMENT, add PRIMARY KEY (`id`)