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
}

class MenuSection{
    constructor(menuType){
        this.menuType = menuType;
    }
}

class Food{

}

class Burger extends Food{

}

class Chicken extends Food{

}

class Drinks extends Food{

}

burgerSection = new MenuSection("Chicken");
chickenSection = new MenuSection("Burgers");
drinkSection = new MenuSection("Drinks");

menu = new Menu();
menu.sections = [burgerSection, chickenSection, drinkSection];

menu.generateNav();