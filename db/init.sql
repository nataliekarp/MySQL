USE bamazon;

INSERT INTO departments (department_name, over_head_costs) VALUES ("Books", 1000.00);
INSERT INTO departments (department_name, over_head_costs) VALUES ("Games", 100.00);
INSERT INTO departments (department_name, over_head_costs) VALUES ("VR", 5000.00);

INSERT INTO products (product_name, department_id, price, stock_quantity) VALUES ("Node.js design patterns", (SELECT id from departments where department_name = "Books"), 49.99, 10);
INSERT INTO products (product_name, department_id, price, stock_quantity) VALUES ("Learning Node.js development", (SELECT id from departments where department_name = "Books"), 39.99, 10);
INSERT INTO products (product_name, department_id, price, stock_quantity) VALUES ("What is Node", (SELECT id from departments where department_name = "Books"), 0, 100);
INSERT INTO products (product_name, department_id, price, stock_quantity) VALUES ("JavaScript * JQuery", (SELECT id from departments where department_name = "Books"), 37.76, 20);
INSERT INTO products (product_name, department_id, price, stock_quantity) VALUES ("Monopoly", (SELECT id from departments where department_name = "Games"), 11.99, 100);
INSERT INTO products (product_name, department_id, price, stock_quantity) VALUES ("Munchkin Deluxe", (SELECT id from departments where department_name = "Games"), 19.19, 10);
INSERT INTO products (product_name, department_id, price, stock_quantity) VALUES ("Catan", (SELECT id from departments where department_name = "Games"), 44.10, 100);
INSERT INTO products (product_name, department_id, price, stock_quantity) VALUES ("HTC VIVE", (SELECT id from departments where department_name = "VR"), 499.00, 3);
INSERT INTO products (product_name, department_id, price, stock_quantity) VALUES ("Occulus Go", (SELECT id from departments where department_name = "VR"), 249.00, 3);
INSERT INTO products (product_name, department_id, price, stock_quantity) VALUES ("Occulus touch", (SELECT id from departments where department_name = "VR"), 93.47, 6);
