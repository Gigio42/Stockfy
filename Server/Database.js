const sqlite3 = require('sqlite3').verbose();

class Database {
    constructor(dbFilePath) {
        const db = new sqlite3.Database(dbFilePath, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('Connected to the SQLite database.');
            }
        });

        this.run = function (sql, params = []) {
            return new Promise((resolve, reject) => {
                db.run(sql, params, function (err) {
                    if (err) {
                        console.log('Error running sql ' + sql);
                        console.log(err);
                        reject(err);
                    } else {
                        resolve({ id: this.lastID });
                    }
                });
            });
        };

        this.get = function (sql, params = []) {
            return new Promise((resolve, reject) => {
                db.get(sql, params, (err, result) => {
                    if (err) {
                        console.log('Error running sql ' + sql);
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        };

        this.all = function (sql, params = []) {
            return new Promise((resolve, reject) => {
                db.all(sql, params, (err, rows) => {
                    if (err) {
                        console.log('Error running sql ' + sql);
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
        };
    }
}

module.exports = new Database('./estoque.db');