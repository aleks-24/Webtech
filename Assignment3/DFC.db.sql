BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "OrderProduct" (
	"FoodID"	INTEGER NOT NULL,
	"OrderID"	INTEGER NOT NULL,
	"Quantity"	INTEGER NOT NULL,
	FOREIGN KEY("FoodID") REFERENCES "Food"("FoodID"),
	FOREIGN KEY("OrderID") REFERENCES "Orders"("OrderId")
);
CREATE TABLE IF NOT EXISTS "Food" (
	"FoodID"	INTEGER NOT NULL UNIQUE,
	"Name"	TEXT NOT NULL,
	"Type"	TEXT NOT NULL,
	"Spiciness"	INTEGER,
	"Vegan"	TEXT,
	"Calories"	INTEGER,
	"Price"	REAL,
	PRIMARY KEY("FoodID" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Orders" (
	"OrderId"	INTEGER NOT NULL UNIQUE,
	"UserId"	INTEGER NOT NULL,
	"Status"	TEXT,
	"Timestamp"	INTEGER,
	PRIMARY KEY("OrderId" AUTOINCREMENT),
	FOREIGN KEY("UserId") REFERENCES "User"("UserID")
);
CREATE TABLE IF NOT EXISTS "User" (
	"UserID"	INTEGER NOT NULL UNIQUE,
	"Username"	TEXT NOT NULL,
	"FirstName"	TEXT NOT NULL,
	"LastName"	TEXT NOT NULL,
	"Password"	TEXT NOT NULL,
	"PhoneNumber"	TEXT NOT NULL,
	"EmailAddress"	TEXT NOT NULL,
	"PostalCode"	TEXT NOT NULL,
	"Address"	TEXT NOT NULL,
	PRIMARY KEY("UserID" AUTOINCREMENT)
);
INSERT INTO "OrderProduct" VALUES (1,1,4);
INSERT INTO "OrderProduct" VALUES (20,2,10);
INSERT INTO "Food" VALUES (1,'Basic Burger','Burger',2,'false',480,4.5);
INSERT INTO "Food" VALUES (2,'Veggie Burger','Burger',2,'true',500,4.8);
INSERT INTO "Food" VALUES (3,'Basic Chicken Burger','Burger',2,'false',500,4.6);
INSERT INTO "Food" VALUES (4,'Veggie Chicken Burger','Burger',2,'true',350,4.5);
INSERT INTO "Food" VALUES (5,'Spicy Chicken Burger','Burger',5,'false',240,4.5);
INSERT INTO "Food" VALUES (6,'Deluxe Burger','Burger',2,'false',365,4.8);
INSERT INTO "Food" VALUES (7,'Super Deluxe Burger','Burger',2,'false',500,4.6);
INSERT INTO "Food" VALUES (8,'Spicy Deluxe Burger','Burger',5,'false',469,4.9);
INSERT INTO "Food" VALUES (9,'Spicy Super Deluxe Burger','Burger',2,'false',600,5.2);
INSERT INTO "Food" VALUES (10,'Mystery Burger','Burger',2,'false',11,2.0);
INSERT INTO "Food" VALUES (11,'Basic Fried Chicken','Chicken',3,'false',600,4.0);
INSERT INTO "Food" VALUES (12,'Korean Fried Chicken','Chicken',4,'false',655,4.0);
INSERT INTO "Food" VALUES (13,'Spicy Fried Chicken','Chicken',5,'false',640,4.0);
INSERT INTO "Food" VALUES (14,'BBQ Fried Chicken','Chicken',4,'false',690,4.0);
INSERT INTO "Food" VALUES (15,'Vegan Fried Chicken','Chicken',2,'true',500,4.0);
INSERT INTO "Food" VALUES (16,'Chicken Drumsticks','Chicken',2,'false',670,4.0);
INSERT INTO "Food" VALUES (17,'Deluxe Fried Chicken','Chicken',3,'false',690,4.0);
INSERT INTO "Food" VALUES (18,'African Chicken Special','Chicken',4,'false',420,4.0);
INSERT INTO "Food" VALUES (19,'Blue Chicken','Chicken',3,'false',690,4.0);
INSERT INTO "Food" VALUES (20,'Mystery Chicken','Chicken',3,'true',690,4.0);
INSERT INTO "Food" VALUES (21,'Coca Cola','Drink',0,'true',40,2.3);
INSERT INTO "Food" VALUES (22,'Evian','Drink',0,'true',0,2.0);
INSERT INTO "Food" VALUES (23,'Fanta','Drink',0,'true',30,2.3);
INSERT INTO "Food" VALUES (24,'Lipton','Drink',0,'true',5,2.3);
INSERT INTO "Food" VALUES (25,'Pepsi Cola','Drink',0,'true',40,2.3);
INSERT INTO "Food" VALUES (26,'Sprite','Drink',0,'true',5,2.3);
INSERT INTO "Food" VALUES (27,'Coca Cola Light','Drink',0,'true',0,2.3);
INSERT INTO "Food" VALUES (28,'Kindercola','Drink',0,'true',45,2.3);
INSERT INTO "Food" VALUES (29,'Grape Soda','Drink',0,'true',50,3.0);
INSERT INTO "Food" VALUES (30,'Lemonade','Drink',0,'true',50,1.4);
INSERT INTO "Orders" VALUES (1,1,NULL,NULL);
INSERT INTO "Orders" VALUES (2,1,NULL,NULL);
INSERT INTO "User" VALUES (1,'TheLegend27','John','Legend','xd','612345678','thelegend27@hotmail.com','1337XD','Wakandastreet 69, Coolville');
INSERT INTO "User" VALUES (2,'nonya business','kiki','Pippinpaddleopsicopolis','$2b$10$k4HMxT5F7G7.rJiOjNTt3eXShIFUoq6j4g4bJ67vkqPlxBcX5W4ly','1234567890','dontemailme@example.com','420BI','no address, only deliver');
COMMIT;
