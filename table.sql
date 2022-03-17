CREATE TABLE `prueba`.`publicaciones` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `img` VARCHAR(255) NOT NULL,
  `contenido` VARCHAR(255) NOT NULL,
  `fecha` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;