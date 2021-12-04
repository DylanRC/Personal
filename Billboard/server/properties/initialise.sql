DROP DATABASE IF EXISTS `cab302`;
CREATE DATABASE `cab302`;
USE `cab302`;

DROP TABLE IF EXISTS `billboards`;

CREATE TABLE `billboards` (
  `userName` varchar(15) NOT NULL,
  `billboardID` varchar(15) NOT NULL,
  `background` varchar(15) DEFAULT NULL,
  `msgColour` varchar(15) DEFAULT NULL,
  `msgText` varchar(255) DEFAULT NULL,
  `infoColour` varchar(15) DEFAULT NULL,
  `infoText` varchar(255) DEFAULT NULL,
  `picture` tinyblob DEFAULT NULL,
  UNIQUE KEY `billboardID` (`billboardID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `schedules`;

CREATE TABLE `schedules` (
  `userName` varchar(15) NOT NULL,
  `billboardID` varchar(15) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `runtime` time NOT NULL,
  UNIQUE KEY `billboardID` (`billboardID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `userpermissions`;

CREATE TABLE `userpermissions` (
  `userName` varchar(15) NOT NULL,
  `createBillboards` tinyint(1) NOT NULL,
  `editAllBillboards` tinyint(1) NOT NULL,
  `scheduleBillboards` tinyint(1) NOT NULL,
  `editUsers` tinyint(1) NOT NULL,
  UNIQUE KEY `userName` (`userName`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `userpermissions` WRITE;
/*!40000 ALTER TABLE `userpermissions` DISABLE KEYS */;
INSERT INTO `userpermissions` VALUES ('admin',1,1,1,1);
/*!40000 ALTER TABLE `userpermissions` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `userName` varchar(15) NOT NULL,
  `salt` varchar(255) NOT NULL,
  `hash` varchar(255) NOT NULL,
  PRIMARY KEY (`userName`),
  UNIQUE KEY `userName` (`userName`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('admin','3bae4a24af18c956f07182ffedae51bcf407ed558c83b8c74f8759e4099ac462','3e191c50d074ad95f8f58b654940fd3c75db850d1ac26ab6b65764a7b114fca0');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

ALTER TABLE `userPermissions`
	ADD FOREIGN KEY (`userName`) REFERENCES `users` (`userName`)