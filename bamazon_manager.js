const inquirer = require('inquirer');
const util = require('./util.js');
const connection = util.connect();

const VIEW_PRODUCTS_FOR_SALE = 'View Products for Sale';
const VIEW_LOW_INVENTORY = 'View Low Inventory';
const ADD_TO_INVENTORY = 'Add to Inventory';
const ADD_NEW_PRODUCT = 'Add New Product';
const EXIT = 'Exit';

inquirer.prompt([
    {
        type: 'list',
        name: 'option',
        message: "Welcome to BAMAZON management system. Here are all available options:",
        choices: [
            VIEW_PRODUCTS_FOR_SALE,
            VIEW_LOW_INVENTORY,
            ADD_TO_INVENTORY,
            ADD_NEW_PRODUCT,
            EXIT,
        ],
    },
]).then(function(answers) {
    switch (answers.option) {
        case VIEW_PRODUCTS_FOR_SALE:
            connection.query('SELECT id, product_name, price, stock_quantity FROM products WHERE stock_quantity > 0', function(error, results) {
                console.log("\nAll available products:\n" + util.createTable(results, [
                    { name: 'id', human_name: 'ID' },
                    { name: 'product_name', human_name: 'Product' },
                    { name: 'price', human_name: 'Price' },
                    { name: 'stock_quantity', human_name: 'in stock' }]));
                util.exit();
            });
            break;
        case VIEW_LOW_INVENTORY:
            connection.query('SELECT id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5', function(error, results) {
                console.log("\nAll low inventory products:\n" + util.createTable(results, [
                    { name: 'id', human_name: 'ID' },
                    { name: 'product_name', human_name: 'Product' },
                    { name: 'price', human_name: 'Price' },
                    { name: 'stock_quantity', human_name: 'in stock' }]));
                util.exit();
            });
            break;
        case ADD_TO_INVENTORY:
            connection.query('SELECT id, product_name, price, stock_quantity FROM products', function(error, results) {
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'productId',
                        message: "All products:\n" +
                            util.createTable(results, [
                                { name: 'id', human_name: 'ID' },
                                { name: 'product_name', human_name: 'Product' },
                                { name: 'price', human_name: 'Price' },
                                { name: 'stock_quantity', human_name: 'In stock' }]) +
                            "What is the ID of the product you would like to add",
                        validate: util.validateProductId(results)
                    },
                    {
                        type: 'input',
                        name: 'quantity',
                        message: "How many units you would like to add",
                        validate: util.validatePositiveInteger("quantity")
                    },
                ]).then(function(answers) {
                    connection.query('UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?', [answers.quantity, answers.productId], function(error, results) {
                        if (error) {
                            console.log("DB error " + error);
                        } else {
                            console.log("Added '" + answers.quantity + "' units.");
                        }    
                        util.exit();
                    });
                });
            });
            break;    
        case ADD_NEW_PRODUCT:
            connection.query('SELECT id, department_name FROM departments', function(error, results) {
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'departmentId',
                        message: "Please select the department for the new product",
                        choices: departmentNames(results),
                        filter: convertToDepartmentId(results)
                    },
                    {
                        type: 'input',
                        name: 'name',
                        message: "What is the name of the new product",
                    },
                    {
                        type: 'input',
                        name: 'price',
                        message: "What is the price of the new product",
                        validate: util.validatePrice
                    },
                    {
                        type: 'input',
                        name: 'quantity',
                        message: "What is the initial quantity of the new product",
                        validate: util.validateNonnegativeInteger("quantity")
                    },
                ]).then(function(answers) {
                    connection.query('INSERT INTO products (product_name, department_id, price, stock_quantity) VALUES (?, ?, ?, ?)', [answers.name, answers.departmentId, answers.price, answers.quantity], function(error, results) {
                        if (error) {
                            if (error.code == 'ER_DUP_ENTRY') {
                                console.log("Product '" + answers.name + "' already exists");
                            } else {
                              console.log("DB error " + error);
                            }
                        } else {
                            console.log("Added new product '" + answers.name + "'.");
                        }    
                        util.exit();
                    });
                });
            });
            break;
        case EXIT:
            util.exit();
        default: throw "ASSERTION: unexpected choice '" + answers.option + "'";
    }
});

function departmentNames(departments) {
    var result = [];
    for (var d of departments) {
        result.push(d.department_name);
    }
    return result;
}

function convertToDepartmentId(departments) {
    return function(input) {
        for (var d of departments) {
            if (input == d.department_name) {
                return d.id;
            }
        }
        throw "ASSERTION: unexpected departement name '" + input + "'";
    };
}
