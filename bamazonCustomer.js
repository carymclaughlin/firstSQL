var mysql = require("mysql");
var inquirer = require("inquirer");

var choiceArray = []
var priceArray = []
var buy
var quantityArray = []
var quant1
var saleprice
var qoh
var obJ = []
var nameArray = []
var chosen

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "root",
    database: "bamazon"
});
connection.connect(function (err) {
    if (err) throw err;
    unpack();
});
function unpack() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // console.log(res);

        for (var i = 0; i < res.length; i++) {
            choiceArray.push(res[i].item_id);
            priceArray.push(res[i].price);
            quantityArray.push(res[i].stock_quantity)
            nameArray.push(res[i].product_name)
            obJ.push(res[i])

        }
        // console.log(choiceArray)
        // console.log(priceArray)
        // console.log(quantityArray)
        // connection.end();
        fstart()
    });


}


function fstart() {
    inquirer
        .prompt({
            name: "initialize",
            type: "list",
            message: "Would you like to See Inventory or Make a Purchase?",
            choices: ["Inventory", "Purchase"]

        })
        .then(function (answer) {
            if (answer.initialize == "Inventory") {
                Inventory();
            }
            else {
                purchase();
            }
        });
}
function Inventory() {
    console.log(obJ);
    fstart();
}
function purchase() {
    inquirer
        .prompt({
            name: "purchase",
            type: "input",
            message: "Please enter the product ID associated with the item you wish to purchase:",
        })
        .then(function (answer) {

            for (var i = 0; i < choiceArray.length; i++) {
                if (answer.purchase == choiceArray[i]) {
                 
                    buy = choiceArray[i];
                    saleprice = priceArray[i];
                    qoh = quantityArray[i];
                    chosen = nameArray[i];

                }
            }
            if (buy != undefined) {
                quantity();
            }
            else {
                console.log("Ivalid ID, please try again")
                fstart();
            }

        })
};

function quantity() {
    inquirer
        .prompt({
            name: "quantity",
            type: "input",
            message: "Please enter the quantity you wish to purchase:",
        })
        .then(function (answer) {

            quant1 = answer.quantity
            if (quant1 <= qoh) {

                sale();
            }
            else {
                console.log("Quantity not on hand. Please try again.")
                fstart();
            }
        });
}
function sale() {
    var trxCost = (quant1 * saleprice).toFixed(2);
    var updateQ = qoh - quant1
    console.log("update number: " + updateQ)
    console.log("You have purchased " + quant1 + " " + chosen + " for $" + trxCost)
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: updateQ
            },
            {
                item_id: buy
            }
        ],
    );
    // console.log("done");
    connection.end();

}
