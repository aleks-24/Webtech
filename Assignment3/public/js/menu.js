content = document.getElementById("content");

async function checkLoggedIn(){
    const ret = await fetch('api/user',{
        method: 'GET'
    });
    const body = await ret.json();
    return body.success
}

class Menu{
    constructor(){
        this.sections = [];
    }


    generateNav(){ //generate nav menu
        var header = document.createElement("H1");
        header.textContent = "Menu";
        content.appendChild(header);
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
            var menuSections = this.sections;
            orderButton.onclick = function(){

                var xhr = new XMLHttpRequest();
                var orders = [];
                console.log(menuSections)
                for (const section of menuSections){
                    for (const food of section.foods){
                        // ignore food without quantity
                        if (food.selected){
                            orders.push({id: food.id, quantity: food.selected});
                        }
                    }
                }        
                xhr.open("POST", "api/user/orders", true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({
                    order : orders
                 }));
                xhr.onload = function () {
                    var data = this.responseText;
                }
                alert("Order placed!");
            }
        } else {
            basketItems.innerText = "";
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
            section.generateHtml();            
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
        this.id = 69;
       }

       generateStuff(controls=true, logIn = false){
           //do HTML DOM stuff
           var image = document.createElement("IMG");
           image.setAttribute("src", this.imageSrc);
           image.setAttribute("alt", this.name);
           image.setAttribute("loading", "lazy")
           image.classList.add("menuItem");
           var caption = document.createElement("figcaption");
           caption.innerText = controls ? this.name : "";
           caption.classList.add("caption");
            // add price to caption, with euro sign and two decimal places
            var price = document.createElement("p");
            price.innerText = "€" + this.price.toFixed(2);
            price.classList.add("price");
            caption.appendChild(price);

            var result = document.createElement("td");

            result.appendChild(image);
            result.appendChild(caption);

            //Creating plus and minus button
            if (controls && logIn){
                var plus = document.createElement("button");
                var minus = document.createElement("button");
                plus.setAttribute('name', "plus");
                plus.innerText = "+";
                minus.setAttribute('name', "minus");
                minus.innerText = '-';

                //Click event
                let name = this.name;
                var value = document.createElement("span");
                value.innerText = this.selected;
                minus.onclick = () => {
                    if(this.selected > 0){this.selected--; value.innerText = this.selected; menu.generateBasket();}
                    // set selected class
                    if (this.selected === 0){
                        result.classList.remove("menu--selected");
                    }
                }
                plus.onclick = () => {
                    this.selected++; value.innerText = this.selected; menu.generateBasket();
                    result.classList.add("menu--selected");
                }
                
                // create div for buttons
                var buttons = document.createElement("div");
                buttons.classList.add("menu--buttons");
                buttons.appendChild(minus);
                buttons.appendChild(value);
                buttons.appendChild(plus);
                result.appendChild(buttons);
            } else if(logIn) {
                var value = document.createElement("span");
                value.innerText = this.selected;
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

    generateHtml(){
        //Making a table
        var section = document.createElement("section");
        var button = document.createElement("button");
        button.classList.add("menu--collapsable");
        button.classList.add("menu--collapsed");
        button.addEventListener("click", async () => {
            if (button.classList.contains("menu--collapsed")) {
                button.classList.remove("menu--collapsed");
                button.classList.add("menu--expanded");
                this.table.style.display = "table";
                
                if (this.table.rows.length) return;

                const res = await fetch('api/food?type=' + this.menuType, { method: 'GET' });
                const json = await res.json();

                if (json.success) {
                    this.foods = json.food.map(data => new Food("resources/Menu-Burgers/B1.jpg", data.name, data.price, data.spiciness, data.calories, data.vegan));
                    this.generateItems();
                }
            } else {
                button.classList.add("menu--collapsed");
                button.classList.remove("menu--expanded");
                this.table.style.display = "none";
            }
        });
        var h2 = document.createElement("h2");
        h2.textContent = this.menuType;

        this.table = document.createElement("table");
        this.table.id = this.menuType;
        this.table.style.display = "none";
        
        button.appendChild(h2);
        section.appendChild(button);
        section.appendChild(this.table);
        content.appendChild(section);
    }

    async generateItems(){ //Generate HTML for each item in this section
        var i = 0;
        const width = 4;
        var logIn = await checkLoggedIn();
        console.log(logIn);
        while(i < this.foods.length){
            var newRow = this.table.insertRow(-1);
            var iterOld = i;
            while(i < (iterOld + width) && i < this.foods.length){
                var food = this.foods[i];
                var foodCell = food.generateStuff(true, logIn);
                var cell = newRow.insertCell(-1);
                cell.appendChild(foodCell);
                i++;
            }
        }
    }
}

/*
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
*/

burgerSection = new MenuSection("Burger"); //bourgir
chickenSection = new MenuSection("Chicken"); //mmm sjiken
drinkSection = new MenuSection("Drink");

menu = new Menu();
menu.sections = [burgerSection, chickenSection, drinkSection];

menu.generateBasket();
menu.generateNav();
menu.generateSections();

//push the food and drink items to their respective arrays
// burgerSection.foods.push(new Burger(false, "resources/Menu-Burgers/B1.jpg", "Basic Burger", 4.50, 2, 480, false)); 
// burgerSection.foods.push(new Burger(false, "resources/Menu-Burgers/B2.jpg", "Veggie Burger", 4.80, 2, 500, true)); 
// burgerSection.foods.push(new Burger(false, "resources/Menu-Burgers/B3.jpg", "Spicy Burger", 4.60, 5, 500, false)); 
// burgerSection.foods.push(new Burger(true, "resources/Menu-Burgers/B4.jpg", "Basic Chicken Burger", 4.50, 2, 350, false)); 
// burgerSection.foods.push(new Burger(true, "resources/Menu-Burgers/B5.jpg", "Veggie Chicken Burger",4.80, 2, 240, true)); 
// burgerSection.foods.push(new Burger(true, "resources/Menu-Burgers/B6.jpg", "Spicy Chicken Burger", 4.60, 5, 365, false)); 

// chickenSection.foods.push(new Chicken(false, "resources/Menu-Chicken/C1.jpg", "Basic Fried Chicken", 4.00, 3, 600, false));
// chickenSection.foods.push(new Chicken(true, "resources/Menu-Chicken/C2.jpg", "Korean Fried Chicken", 4.30, 4, 655, false));
// chickenSection.foods.push(new Chicken(false, "resources/Menu-Chicken/C3.jpg", "Spicy Fried Chicken", 4.40, 5, 640, false));
// chickenSection.foods.push(new Chicken(true, "resources/Menu-Chicken/C4.jpg", "BBQ Fried Chicken", 4.30, 3, 690, false));
// chickenSection.foods.push(new Chicken(false, "resources/Menu-Chicken/C5.jpg", "Vegan Fried Chicken", 4.80, 2, 500, true));
// chickenSection.foods.push(new Chicken(false, "resources/Menu-Chicken/C6.jpg", "Chicken Drumstickes", 5.00, 2, 670, false));

// drinkSection.foods.push(new Drinks(true, "resources/Menu-Drinks/CocaCola.jpg", "Coca Cola", 2.30, calories = 40));
// drinkSection.foods.push(new Drinks(false, "resources/Menu-Drinks/Evian.jpg", "Evian", 2.00, calories = 0));
// drinkSection.foods.push(new Drinks(true, "resources/Menu-Drinks/Fanta.png", "Fanta", 2.30, calories = 30));
// drinkSection.foods.push(new Drinks(false, "resources/Menu-Drinks/Lipton.png", "Lipton", 2.20, calories = 5));
// drinkSection.foods.push(new Drinks(true, "resources/Menu-Drinks/Pepsi.png", "Pepsi Cola", 2.30, calories = 40));
// drinkSection.foods.push(new Drinks(true, "resources/Menu-Drinks/Sprite.png", "Sprite", 2.20, calories = 5));

//menu.generateBasket();
//menu.generateNav();
//menu.generateSections();
