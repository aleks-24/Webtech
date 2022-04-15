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

    async generateItems(){ //Generate HTML for each item in this section
        //Making a table
        var section = document.createElement("section");
        var h2 = document.createElement("h2");
        h2.textContent = this.menuType;

        var table = document.createElement("table");
        table.id = this.menuType;

        var i = 0;
        const width = 4;
        var logIn = await checkLoggedIn();
        console.log(logIn);
        while(i < this.foods.length){
            var newRow = table.insertRow(-1);
            var iterOld = i;
            while(i < (iterOld + width) && i < this.foods.length){
                var food = this.foods[i];
                var foodCell = food.generateStuff(true, logIn);
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



function loadDoc(){
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function(){processXML(this)}
    xhttp.open("GET", "xml/menu.xml")
    xhttp.send()
}


function processXML(xml){
    const xmlDoc = xml.responseXML;
    const burgers = xmlDoc.getElementsByTagName("burgers")[0].getElementsByTagName("burger");
    for (let i = 0; i < burgers.length; i++){
        burger = burgers[i]
        const chicken = burger.getElementsByTagName("chicken")[0].childNodes[0].nodeValue === "true";
        const img = burger.getElementsByTagName("image")[0].childNodes[0].nodeValue;
        const name = burger.getElementsByTagName("name")[0].childNodes[0].nodeValue;
        const price = parseFloat(burger.getElementsByTagName("price")[0].childNodes[0].nodeValue);
        const spiciness = burger.getElementsByTagName("spiciness")[0].childNodes[0].nodeValue;
        const calories = burger.getElementsByTagName("calories")[0].childNodes[0].nodeValue;
        const vegan = burger.getElementsByTagName("vegan")[0].childNodes[0].nodeValue === "true";
        burgerSection.foods.push(new Burger(chicken, img, name, price, spiciness, calories, vegan));
    }

    const chickens = xmlDoc.getElementsByTagName("chickens")[0].getElementsByTagName("chicken");
    for (let i = 0; i < chickens.length; i++){
        chicken = chickens[i]
        console.log(chicken)
        console.log(chicken.getElementsByTagName("boneless")[0])
        const boneless = chicken.getElementsByTagName("boneless")[0].childNodes[0].nodeValue === "true";
        const img = chicken.getElementsByTagName("image")[0].childNodes[0].nodeValue;
        const name = chicken.getElementsByTagName("name")[0].childNodes[0].nodeValue;
        const price = parseFloat(chicken.getElementsByTagName("price")[0].childNodes[0].nodeValue);
        const spiciness = chicken.getElementsByTagName("spiciness")[0].childNodes[0].nodeValue;
        const calories = chicken.getElementsByTagName("calories")[0].childNodes[0].nodeValue;
        const vegan = chicken.getElementsByTagName("vegan")[0].childNodes[0].nodeValue === "true";
        chickenSection.foods.push(new Chicken(boneless, img, name, price, spiciness, calories, vegan));
    }

    const drinks = xmlDoc.getElementsByTagName("drinks")[0].getElementsByTagName("drink");
    for (let i = 0; i < drinks.length; i++){
        drink = drinks[i]
        const carbonated = drink.getElementsByTagName("carbonated")[0].childNodes[0].nodeValue === "true";
        const img = drink.getElementsByTagName("image")[0].childNodes[0].nodeValue;
        const name = drink.getElementsByTagName("name")[0].childNodes[0].nodeValue;
        const price = parseFloat(drink.getElementsByTagName("price")[0].childNodes[0].nodeValue);
        const spiciness = drink.getElementsByTagName("spiciness")[0].childNodes[0].nodeValue;
        const calories = drink.getElementsByTagName("calories")[0].childNodes[0].nodeValue;
        const vegan = drink.getElementsByTagName("vegan")[0].childNodes[0].nodeValue === "true";
        drinkSection.foods.push(new Drinks(carbonated, img, name, price, spiciness, calories, vegan));
    }



    menu.generateBasket();
    menu.generateNav();
    menu.generateSections();
}
loadDoc()




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
