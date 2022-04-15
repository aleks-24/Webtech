var user;

//gets the current User
async function getUser(){
    const ret = await fetch('api/user',{
        method: 'GET'
    });
    const body = await ret.json();
    user = body.user;
    var a = document.getElementsByTagName("article")[0];
    console.log(user)
    for( const [key, value] of Object.entries(user)){
        var paragraph = document.createElement("P");
        paragraph.innerText = capitalize(key) + ": " + value;
        a.appendChild(paragraph);
    }
}

//get all orders
async function getOrders(){
    const ret = await fetch('api/user/orders',{
        method: 'GET'
    });
    const body = await ret.json();
    orders = body.orders;
    var a = document.getElementsByTagName("article")[0];

    //print orders
    for(const order of orders){
        if (order.products.length != 0){
            var header = document.createElement("H2");
            header.innerText = "Order " + order.id + ":";
            a.appendChild(header);
            for(const product of order.products){
                var paragraph = document.createElement("P");
                paragraph.innerText = product.id + ": " + product.quantity;
                a.appendChild(paragraph);
            }
        }
    }
}
getUser();
getOrders();

//capitalize first letter
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }