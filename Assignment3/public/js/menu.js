//this file generates the menu through DOM
content = document.getElementById("content");

async function checkLoggedIn(){
    const ret = await fetch('api/user',{
        method: 'GET'
    });
    const body = await ret.json();
    return body.success
}

const foods = {};

async function getFood(id, data) {
    if (foods[id]) return foods[id];

    if (data) {
        foods[id] = new Food("resources/Food/" + id + ".jpg", data.name, data.price, data.spiciness, data.calories, data.vegan, id);
        return foods[id];
    }

    const res = await fetch('api/food?id=' + id, { method: 'GET' });
    const json = await res.json();

    if (json.success) {
        foods[id] = new Food("resources/Food/" + id + ".jpg", json.food.name, json.food.price, json.food.spiciness, json.food.calories, json.food.vegan, id);
    } else return undefined;

    return foods[id];
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

    generateBasket(submit = false){ //Generate basket
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
            orderButton.onclick = async function(){
                await fetch('api/user/orders',{
                    method: 'POST'
                });
                window.location.href = 'user.html';
            }
        } else {
            basketItems.innerText = "";
        }
        // append all food in all sections with quantity to basket
        var price = 0;
        for (const food of Object.values(foods)){
            // ignore food without quantity
            if (food.selected){
                price += food.price * food.selected;
                basketItems.appendChild(food.generateStuff(false));
            }
        }

        // send basket to server
        var orders = [];
        for (const food of Object.values(foods)){
            // ignore food without quantity
            if (food.selected){
                orders.push({id: food.id, quantity: food.selected});
            }
        }  

        if (submit) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "api/user/currentorder", true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                order : orders
            }));
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
    constructor(imageSrc="", name="", price=420.69, spiciness = -1, calories = 0, vegan = false, id){
        this.name = name;
        this.price = price;
        this.spiciness = spiciness;
        this.calories = calories;
        this.vegan = vegan;
        this.imageSrc = imageSrc;
        this.selected = 0;
        this.id = id;
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
                if (this.selected > 0) result.classList.add("menu--selected");

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
                    if(this.selected > 0){this.selected--; value.innerText = this.selected; menu.generateBasket(true);}
                    // set selected class
                    if (this.selected === 0){
                        result.classList.remove("menu--selected");
                    }
                }
                plus.onclick = () => {
                    this.selected++; value.innerText = this.selected; menu.generateBasket(true);
                    result.classList.add("menu--selected");
                }
                
                // create div for buttons
                var buttons = document.createElement("div");
                buttons.classList.add("menu--buttons");
                buttons.appendChild(minus);
                buttons.appendChild(value);
                buttons.appendChild(plus);
                result.appendChild(buttons);
            } else if (!controls) {
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
                    this.foods = await Promise.all(json.food.map(async data => await getFood(data.id, data)));
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

burgerSection = new MenuSection("Burger"); //bourgir
chickenSection = new MenuSection("Chicken"); //mmm sjiken
drinkSection = new MenuSection("Drink");

menu = new Menu();
menu.sections = [burgerSection, chickenSection, drinkSection];

menu.generateBasket(false);
menu.generateNav();
menu.generateSections();

async function getCurrentOrder() {
    const res = await fetch('api/user/currentorder');
    const json = await res.json();

    if (json.success) {
        for (const v of json.order) {
            const food = await getFood(v.id);
            food.selected = v.quantity;
        }

        menu.generateBasket(false);
    }
}

getCurrentOrder();
