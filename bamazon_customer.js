const inquirer = require('inquirer');
const util = require('./util.js');
const connection = util.connect();

connection.query('SELECT id, product_name, price, stock_quantity FROM products WHERE stock_quantity > 0', function(error, results) {
    if (error) throw error;
    else {
        inquirer.prompt([
            {
                type: 'input',
                name: 'productId',
                message: "Welcome to BAMAZON. Here are all available products:\n" +
                    util.createTable(results, [
                        { name: 'id', human_name: 'ID' },
                        { name: 'product_name', human_name: 'Product' },
                        { name: 'price', human_name: 'Price' }]) +
                    "What is the ID of the product you would like to buy",
                validate: util.validateProductId(results)
            },
            {
                type: 'input',
                name: 'quantity',
                message: "How many units you would like to buy",
                validate: util.validatePositiveInteger("quantity")
            },
        ]).then(function(answers) {
            var found = false
            for (var p of results) {
                if (p.id == answers.productId) {
                    if (p.stock_quantity < answers.quantity) {
                        console.log("There is no sufficient quantity of '" + p.product_name + "' in stock, only '" + p.stock_quantity + "' units are available!");
                        util.exit();
                    } else {
                        connection.beginTransaction(function(error) {
                            if (error) throw error;
                            connection.query('INSERT INTO product_sales (product_id, price, quantity) VALUES (?, ?, ?)',
                                    [answers.productId, p.price, answers.quantity], function(error, results) {
                                if (error) {
                                    connection.rollback(function() { throw error;});
                                    util.exit();
                                } else {
                                    connection.query('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                                            [answers.quantity, answers.productId], function(error, results) {
                                        if (error) {
                                            connection.rollback(function() { throw error;});
                                            util.exit();
                                        } else {
                                            connection.commit(function(error) {
                                                if (error) {
                                                    console.log("DB error " + error);
                                                    connection.rollback(function() { throw error;});
                                                    util.exit();
                                                } else {
                                                    console.log("Thank you for purchasing '" + p.product_name + "', your total costs was '" + answers.quantity * p.price) + "'";
                                                    util.exit();
                                                }
                                            });
                                        }        
                                    });
                                }
                            });
                        });
                    }
                    found = true;
                    break;
                }
            }
            if (!found) throw "ASSERTION: unexpected productId '" + answers.productId + "'";
        });
    }    
});
