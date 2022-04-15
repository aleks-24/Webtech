//this file gets the user and order information from the API and displays it using DOM
var user;

const foods = {};

async function getFood(id) {
    if (foods[id]) return foods[id];

    const res = await fetch('api/food?id=' + id, { method: 'GET' });
    const json = await res.json();

    if (json.success) {
        foods[id] = new Food("resources/Food/" + id + ".jpg", json.food.name, json.food.price, json.food.spiciness, json.food.calories, json.food.vegan, id);
    } else return undefined;

    return foods[id];
}

class Food{
    constructor(imageSrc="", name="", price=420.69, spiciness = -1, calories = 0, vegan = false, id){
        this.name = name;
        this.price = price;
        this.spiciness = spiciness;
        this.calories = calories;
        this.vegan = vegan;
        this.imageSrc = imageSrc;
        this.id = id;
       }

       generateStuff(selected){
           //do HTML DOM stuff
           var image = document.createElement("IMG");
           image.setAttribute("src", this.imageSrc);
           image.setAttribute("alt", this.name);
           image.setAttribute("loading", "lazy")
           image.classList.add("menuItem");
           var caption = document.createElement("figcaption");
           caption.innerText = "";
           caption.classList.add("caption");
            // add price to caption, with euro sign and two decimal places
            var price = document.createElement("p");
            price.innerText = "€" + this.price.toFixed(2);
            price.classList.add("price");
            caption.appendChild(price);

            var result = document.createElement("td");

            result.appendChild(image);
            result.appendChild(caption);

            var value = document.createElement("span");
            value.innerText = selected;
            result.appendChild(value);

            return result;
       }
   }

//gets the current User
async function getUser(){
    const ret = await fetch('api/user',{
        method: 'GET'
    });
    const body = await ret.json();
    user = body.user;
    var a = document.getElementById("data");
    for( const [key, value] of Object.entries(user)){
        var paragraph = document.createElement("P");
        paragraph.innerText = capitalize(key) + ": " + value;
        a.appendChild(paragraph);
    }
    getOrders(); //get users orders
}

//get all orders
async function getOrders(){
    const ret = await fetch('api/user/orders',{
        method: 'GET'
    });
    const body = await ret.json();
    orders = body.orders;
    var a = document.getElementById("orders");

    //print orders
    for(const order of orders){
        if (order.status == "Unfinished") continue;
        if (order.products.length != 0){
            basket = document.createElement("section");
            basket.classList.add("order");
            // add div for basket items
            basketItems = document.createElement("div");
            basketItems.setAttribute("id", "basket--items");
            basket.appendChild(basketItems);
            // add total price with euro and two decimals
            total = document.createElement("p");
            total.textContent = "Total: €0.00";
            total.setAttribute("id", "basket--total");
            basket.appendChild(total);

            let price = 0;

            for(const product of order.products){
                const food = await getFood(product.id);
                if (!food) continue;
                price += food.price * product.quantity;
                basketItems.appendChild(food.generateStuff(product.quantity));
            }

            total.textContent = "Total: €" + price.toFixed(2);
            a.appendChild(basket);
        }
    }
}
getUser();

//capitalize first letter
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }