const inquirer = require('inquirer');
const util = require('./util.js');
const connection = util.connect();

const VIEW_PRODUCT_SALES_BY_DEPARTMENTS = 'View Product Sales by Department';
const CREATE_NEW_DEPARTMENT = 'Create New Department';
const EXIT = 'Exit';

const PRODUCT_SALES_BY_DEPARTMENT_SQL = `
SELECT
    id department_id,
    department_name,
    over_head_costs,
    IFNULL(product_sales, 0) product_sales,
    IFNULL(product_sales, 0) - over_head_costs total_profit
FROM departments
LEFT JOIN (
    SELECT
        products.department_id,
        sum(product_sales.price * product_sales.quantity) product_sales
    FROM products
    JOIN product_sales ON (products.id = product_sales.product_id)
    GROUP BY 1
) sales ON (departments.id = sales.department_id)
`;

inquirer.prompt([
    {
        type: 'list',
        name: 'option',
        message: "Welcome to BAMAZON supervisory system. Here are all available options:",
        choices: [
            VIEW_PRODUCT_SALES_BY_DEPARTMENTS,
            CREATE_NEW_DEPARTMENT,
            EXIT,
        ],
    },
]).then(function(answers) {
    switch (answers.option) {
        case VIEW_PRODUCT_SALES_BY_DEPARTMENTS:
            connection.query(PRODUCT_SALES_BY_DEPARTMENT_SQL, function(error, results) {
                console.log("\nProduct sales by department:\n" + util.createTable(results, [
                    { name: 'department_id', human_name: 'Department ID' },
                    { name: 'department_name', human_name: 'Department' },
                    { name: 'over_head_costs', human_name: 'Overhead Costs' },
                    { name: 'product_sales', human_name: 'Product Sales' },
                    { name: 'total_profit', human_name: 'Total Profit' }]));
                util.exit();
            });
            break;
        case CREATE_NEW_DEPARTMENT:
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: "What is the name of the new department",
                },
                {
                    type: 'input',
                    name: 'overHeadCosts',
                    message: "What are the over head costs of the new department",
                    validate: util.validatePrice
                },
            ]).then(function(answers) {
                connection.query('INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)', [answers.name, answers.overHeadCosts], function(error, results) {
                    if (error) {
                        if (error.code == 'ER_DUP_ENTRY') {
                            console.log("Department '" + answers.name + "' already exists");
                        } else {
                            console.log("DB error " + error);
                        }
                    } else {
                        console.log("Added new department '" + answers.name + "'.");
                    }    
                    util.exit();
                });
            });
            break;
        case EXIT:
            util.exit();
        default: throw "ASSERTION: unexpected choice '" + answers.option + "'";
    }
});
