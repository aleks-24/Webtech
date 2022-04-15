 == GROUP ==

group4

- Lena van Staalduine, 2218224
- Marlinde Drent, 4704947
- Aleksej Cornelissen, 6921701

http://webtech.science.uu.nl/group4/
 
 == WEBSITE DESCRIPTION ==

This is the website for a fictional company called Dutch Fried Chicken. You can log in using the login button on the header, and then order food using the menu.
Selected food items will be added to a basket. When complete, the order button adds the order to the order history. This history can be viewed on the Order page.
This Order page also contains the user's data.

 == FILES ==

- index.js                : start of the server
- db.js                   : quick way to create the database using DFC.db.sql
- DFC.db.sql              : used in db.js to quickly create the database
- routes/
   - api.js               : contains all the endpoints under the /api/ url
- public/                 : contains all files that are directly sent to the browser
   - index.html           : homepage
   - about.html           : about page
   - contact.html         : contact page
   - menu.html            : menu page where users can order food and drinks
   - login.html           : login page where users can login or register an account
   - user.html            : contains user data and order history for a logged in user
   - vacancies.html       : advertising for working at the company
   - resources/           : contains all images for the website
   - js/
       - header.js        : adds a login button for anonymous users and a user and logout button for logged in users
       - login.js         : logic for logging in or regisering an account
       - manipulator.js   : adds comboboxes to the footer to manipulate the webpage
       - menu.js          : adds logic for looking at and ordering food
       - user.js          : fetches the user data from the server
   - css/
       - stylesheet.css   : makes the site look good
 
 == DB DESCRIPTION ==

Our database has a table for food, a table for users and 2 tables dedicated to orders.
The "Food" table contains all our food and related information.
The "Users" table contains all information regarding our users.
The main "Orders" table keeps track of which order has been placed by what user.
The table "OrderProduct" keeps track of the multiple types of food associated with each order, and the quantity of that food, handling the many-to-many relationship smoothly.

Evertime an order is placed, a new orderID is generated, which can then be used to add multiple food items in OrderProducts.

 == ACCOUNTS ==

username: stillewillem
password: holaspanjolen

username: ronaldmcdonald
password: iloveburgerking

username: spongebob
password: imready

username: slenderman
password: AAAA

username: bongocat
password: meow

 == DB CODE ==

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
