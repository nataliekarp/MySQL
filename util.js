const mysql = require('mysql');
const Table = require('cli-table3');

function createTable(results, fields) {
    // var result = "";
    // for (const r of results) {
    //     result += "|"
    //     for (const f of fields) {
    //         result += " " + f.human_name + ": " + r[f.name] + " |";
    //     }
    //     result += "\n";
    // }
    // return result;

    var field_names = [];
    for (const f of fields) {
        field_names.push(f.human_name);
    }
    var table = new Table({ head: field_names});
    for (const r of results) {
        var row = [];
        for (const f of fields) {
            row.push(r[f.name]);
        }
        table.push(row);
    }
    return table.toString() + "\n";
}

function validateProductId(products) {
    return function(value) {
        if (!/^[1-9]\d*$/.test(value)) {
            return "Invalid input + '" + value + "', product ID must be a positive integer!"
        }
        for (const p of products) {
            if (value == p.id) return true;
        }
        return "Product with ID '" + value + "' not found";
    }
}

function validatePositiveInteger(name) {
    return function(value) {
        if (!/^[1-9]\d*$/.test(value)) {
            return "Invalid input + '" + value + "', " + name + " must be a positive integer!"
        }
        return true;
    };
}

function validateNonnegativeInteger(name) {
    return function(value) {
        if (!/^(?:0|[1-9]\d*)$/.test(value)) {
            return "Invalid input + '" + value + "', " + name + " must be a non negative integer!"
        }
        return true;
    };
}

var _connection;

function connect() {
    _connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'bamazon'
    });
    _connection.connect(function(error) {
    if (error) throw error;
    });
    return _connection;
}

function exit() {
    _connection.end();
    process.exit();
}

module.exports = { createTable, validateProductId, validatePositiveInteger, validateNonnegativeInteger, connect, exit };
