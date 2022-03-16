content = document.getElementById("content");
var basketDict = {};

class Menu{
    constructor(){
        this.sections = [];
    }

    generateNav(){ //generate nav menu
        var list = document.createElement("UL");
        for (const section of this.sections){
            
            var element = document.createElement("LI");
            var link = document.createElement("A");
            
            link.setAttribute("href", "#" + section.menuType);
            link.setAttribute("class", "menuLink")
            link.textContent = section.menuType;
            element.appendChild(link);
            list.appendChild(element);
        }
        var nav = document.createElement("NAV");

        var header = document.createElement("H1");
        header.textContent = "Menu";

        nav.appendChild(header);
        nav.appendChild(list);
        content.appendChild(nav);
    }

    generateSections(){ //Generate HTML for each section
        this.sections.forEach(section => {
            section.generateItems();            
        });
    }
}

class Food{
    constructor(imageSrc="", name="", price=0, spiciness = -1, calories = 0, vegan = false){
        this.name = name;
        this.price = price;
        this.spiciness = spiciness;
        this.calories = calories;
        this.vegan = vegan;
        this.imageSrc = imageSrc;
       }

       generateStuff(){
           //do HTML DOM stuff
           var image = document.createElement("IMG");
           image.setAttribute("src", this.imageSrc);
           image.setAttribute("alt", this.name);
           image.classList.add("menuItem");
           var caption = document.createElement("figcaption");
           caption.innerHTML = this.name;
           caption.classList.add("caption");
            var result = document.createElement("td");

            result.appendChild(image);
            result.appendChild(caption);

            //Creating plus and minus button
            var plus = document.createElement("button");
            var minus = document.createElement("button");
            plus.setAttribute('name', "plus")
            plus.innerHTML = "+"
            minus.setAttribute('name', "minus")
            minus.innerHTML = '-'

            //Click event
            let x = 0;
            let name = this.name;
            var value = document.createElement("span");
            value.innerHTML = x;
            minus.onclick = function(){if(x > 0){x--; value.innerHTML = x; basketDict[name] = x;}}
            plus.onclick = function(){x++; value.innerHTML = x; basketDict[name] = x;}
            result.appendChild(minus);
            result.appendChild(value);
            result.appendChild(plus);

            return result;
       }
   }

class MenuSection{
    constructor(menuType){
        this.menuType = menuType;
        this.foods = [];
    }

    generateItems(){ //Generate HTML for each item in this section
        //Making a table
        var table = document.createElement("table");
        table.id = this.menuType;

        var i = 0;
        const width = 3;
        while(i < this.foods.length){
            var newRow = table.insertRow(-1);
            var iterOld = i;
            while(i < (iterOld + width) && i < this.foods.length){
                var food = this.foods[i];
                var foodCell = food.generateStuff();
                var cell = newRow.insertCell(-1);
                cell.appendChild(foodCell);
                i++;
            }
        }
        
        content.appendChild(table);
    }
}

class Burger extends Food{
    constructor(chicken = false, ...params){
        super(...params)
        this.chicken = chicken;
    }
}

class Chicken extends Food{
    constructor(boneless = false, ...params){
        super(...params)
        this.boneless = boneless;
    }
}

class Drinks extends Food{
    constructor(carbonated = true, ...params){
        super(...params)
        this.carbonated = carbonated
    }
}

burgerSection = new MenuSection("Burgers"); //bourgir
chickenSection = new MenuSection("Chicken"); //mmm sjiken
drinkSection = new MenuSection("Drinks");

menu = new Menu();
menu.sections = [burgerSection, chickenSection, drinkSection];

//push the food and drink items to their respective arrays
burgerSection.foods.push(new Burger(false, "resources/Menu-Burgers/B1.jpg", "Basic Burger")); 
burgerSection.foods.push(new Burger(false, "resources/Menu-Burgers/B2.jpg", "Veggie Burger")); 
burgerSection.foods.push(new Burger(false, "resources/Menu-Burgers/B3.jpg", "Spicy Burger")); 
burgerSection.foods.push(new Burger(true, "resources/Menu-Burgers/B4.jpg", "Basic Chicken Burger")); 
burgerSection.foods.push(new Burger(true, "resources/Menu-Burgers/B5.jpg", "Veggie Chicken Burger")); 
burgerSection.foods.push(new Burger(true, "resources/Menu-Burgers/B6.jpg", "Spicy Chicken Burger")); 

chickenSection.foods.push(new Chicken(false, "resources/Menu-Chicken/C1.jpg", "Basic Fried Chicken"));
chickenSection.foods.push(new Chicken(true, "resources/Menu-Chicken/C2.jpg", "Korean Fried Chicken"));
chickenSection.foods.push(new Chicken(false, "resources/Menu-Chicken/C3.jpg", "Spicy Fried Chicken"));
chickenSection.foods.push(new Chicken(true, "resources/Menu-Chicken/C4.jpg", "BBQ Fried Chicken"));
chickenSection.foods.push(new Chicken(false, "resources/Menu-Chicken/C5.jpg", "Vegan Fried Chicken"));
chickenSection.foods.push(new Chicken(false, "resources/Menu-Chicken/C6.jpg", "Chicken Drumstickes"));

drinkSection.foods.push(new Drinks(true, "resources/Menu-Drinks/CocaCola.jpg", "Coca Cola"));
drinkSection.foods.push(new Drinks(false, "resources/Menu-Drinks/Evian.jpg", "Evian"));
drinkSection.foods.push(new Drinks(true, "resources/Menu-Drinks/Fanta.png", "Fanta"));
drinkSection.foods.push(new Drinks(false, "resources/Menu-Drinks/Lipton.png", "Lipton"));
drinkSection.foods.push(new Drinks(true, "resources/Menu-Drinks/Pepsi.png", "Pepsi Cola"));
drinkSection.foods.push(new Drinks(true, "resources/Menu-Drinks/Sprite.png", "Sprite"));

//console.log(burgerSection.foods[0]);

menu.generateNav();
menu.generateSections();