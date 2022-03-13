content = document.getElementById("content");

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
            //console.log(result);
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
  
        

        for (const food of this.foods){
            var foodCell = food.generateStuff()
            table.appendChild(foodCell);
            //table manipulation here
        }
        content.appendChild(table);
    }
}


class Burger extends Food{
    constructor(...params){
        super(...params)
    }
}

class Chicken extends Food{
    constructor(...params){
        super(...params)
    }
}

class Drinks extends Food{
    constructor(...params){
        super(...params)
    }
}

burgerSection = new MenuSection("Burgers"); 
chickenSection = new MenuSection("Chicken"); //mmm sjiken
drinkSection = new MenuSection("Drinks");

menu = new Menu();
menu.sections = [burgerSection, chickenSection, drinkSection];

//push the food and drink items to their respective arrays
burgerSection.foods.push(new Burger("resources/Menu-Burgers/B1.jpg")); 
burgerSection.foods.push(new Burger("resources/Menu-Burgers/B2.jpg")); 
burgerSection.foods.push(new Burger("resources/Menu-Burgers/B3.jpg")); 
burgerSection.foods.push(new Burger("resources/Menu-Burgers/B4.jpg")); 
burgerSection.foods.push(new Burger("resources/Menu-Burgers/B5.jpg")); 
burgerSection.foods.push(new Burger("resources/Menu-Burgers/B6.jpg")); 

chickenSection.foods.push(new Chicken("resources/Menu-Chicken/C1.jpg", "Basic Fried Chicken"));
chickenSection.foods.push(new Chicken("resources/Menu-Chicken/C2.jpg", "Korean Fried Chicken"));
chickenSection.foods.push(new Chicken("resources/Menu-Chicken/C3.jpg", "Spicy Fried Chicken"));
chickenSection.foods.push(new Chicken("resources/Menu-Chicken/C4.jpg", "BBQ Fried Chicken"));
chickenSection.foods.push(new Chicken("resources/Menu-Chicken/C5.jpg", "Vegan Fried Chicken"));
chickenSection.foods.push(new Chicken("resources/Menu-Chicken/C6.jpg", "Chicken Drumstickes"));

drinkSection.foods.push(new Drinks("resources/Menu-Drinks/CocaCola.jpg"));
drinkSection.foods.push(new Drinks("resources/Menu-Drinks/Evian.jpg"));
drinkSection.foods.push(new Drinks("resources/Menu-Drinks/Fanta.png"));
drinkSection.foods.push(new Drinks("resources/Menu-Drinks/Lipton.png"));
drinkSection.foods.push(new Drinks("resources/Menu-Drinks/Pepsi.png"));
drinkSection.foods.push(new Drinks("resources/Menu-Drinks/Sprite.png"));

console.log(burgerSection);

menu.generateNav();
menu.generateSections();