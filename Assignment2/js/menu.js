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
           content.appendChild(image);
       }
   }

class MenuSection{
    constructor(menuType){
        this.menuType = menuType;
        this.foods = [];
    }

    generateItems(){ //Generate HTML for each item in this section
        for (const food of this.foods){
            food.generateStuff();
        }
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

burgerSection = new MenuSection("Chicken"); //mmm sjiken
chickenSection = new MenuSection("Burgers");
drinkSection = new MenuSection("Drinks");

menu = new Menu();
menu.sections = [burgerSection, chickenSection, drinkSection];


burgerSection.foods.push(new Burger("resources/Menu-Burgers/B1.jpg")); 
menu.generateNav();
menu.generateSections();