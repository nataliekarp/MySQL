DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE departments (
    id INT AUTO_INCREMENT, 
    department_name VARCHAR(255) NOT NULL,
    over_head_costs DECIMAL(10,2) NOT NULL,
    PRIMARY KEY(id),
    UNIQUE KEY(department_name), -- department name must be unique in the whole store
    CONSTRAINT over_head_costs_non_negative CHECK(over_head_costs >= 0), -- allow zero over head costs
);

CREATE TABLE products (
    id INT AUTO_INCREMENT, 
    product_name VARCHAR(255) NOT NULL,
    department_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY(id),
    UNIQUE KEY(product_name), -- product name shall be unique in the whole store, possible alternative is unique products within each department
    CONSTRAINT price_non_negative CHECK(price >= 0), -- allow zero price for free products
    CONSTRAINT stock_quantity_non_negative CHECK(stock_quantity >= 0), -- cannot go below zero for any product in stock
    CONSTRAINT department_id_fk FOREIGN KEY (department_id) REFERENCES departments(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE product_sales (
    id INT AUTO_INCREMENT,
    product_id INT NOT NULL,
    transaction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT price_non_negative CHECK(price >= 0), -- allow zero price for free products
    CONSTRAINT quantity_positive CHECK(quantity > 0),
    CONSTRAINT product_id_fk FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE ON DELETE RESTRICT
)