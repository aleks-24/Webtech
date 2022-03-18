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
            link.setAttribute("class", "menuLink");
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

    generateBasket(){ //Generate basket
        // search for existing basket
        var basket = document.getElementById("basket");
        var basketItems = document.getElementById("basket--items");
        var total = document.getElementById("basket--total");
        if (!basket){
            basket = document.createElement("section");
            basket.setAttribute("id", "basket");
            // add h2
            var h2 = document.createElement("h2");
            h2.textContent = "Basket";
            basket.appendChild(h2);
            content.appendChild(basket);
            // add div for basket items
            basketItems = document.createElement("div");
            basketItems.setAttribute("id", "basket--items");
            basket.appendChild(basketItems);
            // add total price with euro and two decimals
            total = document.createElement("p");
            total.textContent = "Total: €0.00";
            total.setAttribute("id", "basket--total");
            basket.appendChild(total);
            // add button to minimise basketItems
            var button = document.createElement("button");
            button.setAttribute("id", "minimiseBasket");
            button.textContent = "Collapse";
            basket.appendChild(button);
            // on click, hide basketItems
            basketItems.style.display = "block";
            button.onclick = function(){
                if (basketItems.style.display == "block"){
                    basketItems.style.display = "none";
                    button.textContent = "Expand";
                } else {
                    basketItems.style.display = "block";
                    button.textContent = "Collapse";
                }
            }
            // add order button
            var orderButton = document.createElement("button");
            orderButton.textContent = "Order";
            basket.appendChild(orderButton);
            orderButton.onclick = function(){
                alert("Order placed!");
            }
        } else {
            basketItems.innerHTML = "";
        }
        // append all food in all sections with quantity to basket
        var price = 0;
        for (const section of this.sections){
            for (const food of section.foods){
                // ignore food without quantity
                if (food.selected){
                    price += food.price * food.selected;
                    basketItems.appendChild(food.generateStuff(false));
                }
            }
        }
        if (basketItems.childElementCount === 0){
            // hide basket
            basket.style.display = "none";
            return;
        } else {
            // show basket
            basket.style.display = "block";
        }
        // update total price
        total.textContent = "Total: €" + price.toFixed(2);
    }

    generateSections(){ //Generate HTML for each section
        this.sections.forEach(section => {
            section.generateItems();            
        });
    }
}

class Food{
    constructor(imageSrc="", name="", price=420.69, spiciness = -1, calories = 0, vegan = false){
        this.name = name;
        this.price = price;
        this.spiciness = spiciness;
        this.calories = calories;
        this.vegan = vegan;
        this.imageSrc = imageSrc;
        this.selected = 0;
       }

       generateStuff(controls=true){
           //do HTML DOM stuff
           var image = document.createElement("IMG");
           image.setAttribute("src", this.imageSrc);
           image.setAttribute("alt", this.name);
           image.classList.add("menuItem");
           var caption = document.createElement("figcaption");
           caption.innerHTML = controls ? this.name : "";
           caption.classList.add("caption");
            // add price to caption, with euro sign and two decimal places
            var price = document.createElement("p");
            price.innerHTML = "€" + this.price.toFixed(2);
            price.classList.add("price");
            caption.appendChild(price);

            var result = document.createElement("td");

            result.appendChild(image);
            result.appendChild(caption);

            //Creating plus and minus button
            if (controls){
                var plus = document.createElement("button");
                var minus = document.createElement("button");
                plus.setAttribute('name', "plus");
                plus.innerHTML = "+";
                minus.setAttribute('name', "minus");
                minus.innerHTML = '-';

                //Click event
                let name = this.name;
                var value = document.createElement("span");
                value.innerHTML = this.selected;
                minus.onclick = () => {
                    if(this.selected > 0){this.selected--; value.innerHTML = this.selected; menu.generateBasket();}
                    // set selected class
                    if (this.selected === 0){
                        result.classList.remove("menu--selected");
                    }
                }
                plus.onclick = () => {
                    this.selected++; value.innerHTML = this.selected; menu.generateBasket();
                    result.classList.add("menu--selected");
                }
                result.appendChild(minus);
                result.appendChild(value);
                result.appendChild(plus);
            } else {
                var value = document.createElement("span");
                value.innerHTML = this.selected;
                result.appendChild(value);
            }

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
        var section = document.createElement("section");
        var h2 = document.createElement("h2");
        h2.textContent = this.menuType;

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
        
        section.appendChild(h2);
        section.appendChild(table);
        content.appendChild(section);
    }
}

class Burger extends Food{
    constructor(chicken = false, ...params){
        super(...params);
        this.chicken = chicken;
    }
}

class Chicken extends Food{
    constructor(boneless = false, ...params){
        super(...params);
        this.boneless = boneless;
    }
}

class Drinks extends Food{
    constructor(carbonated = true, ...params){
        super(...params);
        this.carbonated = carbonated;
    }
}

burgerSection = new MenuSection("Burgers"); //bourgir
chickenSection = new MenuSection("Chicken"); //mmm sjiken
drinkSection = new MenuSection("Drinks");

menu = new Menu();
menu.sections = [burgerSection, chickenSection, drinkSection];

//push the food and drink items to their respective arrays
burgerSection.foods.push(new Burger(false, "resources/Menu-Burgers/B1.jpg", "Basic Burger", 4.50, 2, 480, false)); 
burgerSection.foods.push(new Burger(false, "resources/Menu-Burgers/B2.jpg", "Veggie Burger", 4.80, 2, 500, true)); 
burgerSection.foods.push(new Burger(false, "resources/Menu-Burgers/B3.jpg", "Spicy Burger", 4.60, 5, 500, false)); 
burgerSection.foods.push(new Burger(true, "resources/Menu-Burgers/B4.jpg", "Basic Chicken Burger", 4.50, 2, 350, false)); 
burgerSection.foods.push(new Burger(true, "resources/Menu-Burgers/B5.jpg", "Veggie Chicken Burger",4.80, 2, 240, true)); 
burgerSection.foods.push(new Burger(true, "resources/Menu-Burgers/B6.jpg", "Spicy Chicken Burger", 4.60, 5, 365, false)); 

chickenSection.foods.push(new Chicken(false, "resources/Menu-Chicken/C1.jpg", "Basic Fried Chicken", 4.00, 3, 600, false));
chickenSection.foods.push(new Chicken(true, "resources/Menu-Chicken/C2.jpg", "Korean Fried Chicken", 4.30, 4, 655, false));
chickenSection.foods.push(new Chicken(false, "resources/Menu-Chicken/C3.jpg", "Spicy Fried Chicken", 4.40, 5, 640, false));
chickenSection.foods.push(new Chicken(true, "resources/Menu-Chicken/C4.jpg", "BBQ Fried Chicken", 4.30, 3, 690, false));
chickenSection.foods.push(new Chicken(false, "resources/Menu-Chicken/C5.jpg", "Vegan Fried Chicken", 4.80, 2, 500, true));
chickenSection.foods.push(new Chicken(false, "resources/Menu-Chicken/C6.jpg", "Chicken Drumstickes", 5.00, 2, 670, false));

drinkSection.foods.push(new Drinks(true, "resources/Menu-Drinks/CocaCola.jpg", "Coca Cola", 2.30, calories = 40));
drinkSection.foods.push(new Drinks(false, "resources/Menu-Drinks/Evian.jpg", "Evian", 2.00, calories = 0));
drinkSection.foods.push(new Drinks(true, "resources/Menu-Drinks/Fanta.png", "Fanta", 2.30, calories = 30));
drinkSection.foods.push(new Drinks(false, "resources/Menu-Drinks/Lipton.png", "Lipton", 2.20, calories = 5));
drinkSection.foods.push(new Drinks(true, "resources/Menu-Drinks/Pepsi.png", "Pepsi Cola", 2.30, calories = 40));
drinkSection.foods.push(new Drinks(true, "resources/Menu-Drinks/Sprite.png", "Sprite", 2.20, calories = 5));

menu.generateBasket();
menu.generateNav();
menu.generateSections();