var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE cuddlecount (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            number INTEGER,
            kisses INTEGER,
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO cuddlecount (number, kisses) VALUES (?, ?)'
                db.run(insert, [0, 0])
            }
        });  
    }
});

module.exports = db
