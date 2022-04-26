// Create express app
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var express = require("express");
const fs = require("fs");

var app = express();
var indexRouter = express.Router();
var db = require("./database.js");

// Server port
var HTTP_PORT = 8080
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/', indexRouter);

// app.use(function(req, res){
//     res.status(404);
// });

//Root endpoint
app.get("/", (req, res, next) => {
    res.json({ "message": "Ok" })
});

//Insert here other API endpoints
app.get("/getcuddlecount", (req, res, next) => {
    var sql = "select * from cuddlecount"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});

// app.get("/getcuddlecount", (req, res, next) => {
//     fs.readFile("./db.json", "utf8", (err, jsonString) => {
//         if (err) {
//           console.log("File read failed:", err);
//           return;
//         }
//         res.json({
//             data: jsonString
//         })
//         console.log("File data:", jsonString);
//       });
// });

app.put("/updatecounts", (req, res, next) => {
    let data = {
        "id": req.body.id,
        "number": req.body.number,
        "kisses": req.body.kisses
    };

    db.run(
        `UPDATE cuddlecount set 
           number = ?, 
           kisses = ?,  
           WHERE (id = ?)`,
        [data.number, data.kisses, data.id],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({
                "message": "success",
                "data": data,
                "changes": this.changes
            })
        });
})


