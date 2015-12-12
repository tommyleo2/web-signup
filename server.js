var http = require('http');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');
var jade = require('jade');
var validator = require('./source/js/validate');
var mimetype = {
    ".css" : "text/css",
    ".js" : "text/javascrip",
    ".html" : "text/html",
    ".png" : "image/png"
}

function User(username, id, phone, email) {
    this.username = username;
    this.id = id;
    this.phone = phone;
    this.email = email;
}
var users = [];

http.createServer(function(req,res) {
    var pathname = url.parse(req.url).pathname;
    var ext = pathname.match(/\.([a-zA-Z]){1,4}/);
    if (ext) {
        sendFile(req, res);
    } else {
        req.method === "GET" ? sendPage(req, res) : registerUser(req, res);
    }
}).listen(8000);

console.log("Server is running on port 8000");

(function exampleData() {
    var user = new User("abc", "example", "example", "example");
    users.push(user);
    console.log("Example user loaded:\n", user);
})()


function registerUser(req, res) {
    req.on("data", function(chunk) {
        console.log("Post recieved: ", chunk.toString());
        var user = querystring.parse(chunk.toString());
        var msg = isRegister(user);
        if (!msg.length) {
            Register(user);
            res.writeHead(301, {Location: "?username=" + user.username});
            res.end();
        } else {
            sendSignup(req, res, {user: user, error: msg.join("<br/><br/>")});
        }
    });
}

function isRegister(user) {
    var msg = [];
    for (var i = 0; i < users.length; i ++) {
        for (var j in user) {
            if (users[i][j] === user[j]) {
                console.warn("WARNING: user info ", user[j], " has been registered");
                console.log("---------In user\n", users[i]);
                msg.push(j + ": " + user[j] + " has been registered");
            }
        }
    }
    return msg;
}

function Register(user) {
    users.push(user);
}

function sendPage(req, res) {
    var username = parseUsername(req);
    var user = new User("", "", "", "");
    if (!username) {
        sendSignup(req, res, {user: user, err: ""});
    } else {
        var user = findUser(username)
        if (!user) {
            sendSignup(req, res, {user: user, error: "User: " + username + " has not been registered"});
        } else {
            sendDetail(req, res, user);
        }
    }
}

function parseUsername(req) {
    return querystring.parse(url.parse(req.url).query).username;
}

function findUser(username) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            return users[i];
        }
    }
    return false;
}

function sendSignup(req, res, user) {
    sendhtml(req, res, false, user);
}

function sendDetail(req, res, user) {
    sendhtml(req, res, true, user);
}

function sendhtml(req, res, detail, data) {
    res.writeHead(200, {'Content-Type' : "text/html"});
    console.log("Requiring file: ", detail ? "source/detail.jade" : "source/index.jade");
    if (detail) {
        res.end(jade.renderFile("source/detail.jade", data));
    } else {
        console.log(data);
        res.end(jade.renderFile("source/index.jade", data));
    }
    console.log("Succeeding sending: ", detail ? "source/detail.jade" : "source/index.jade");
}

function sendFile(req, res) {
    var pathname = url.parse(req.url).pathname;
    pathname = "source" + pathname;
    console.log("Requiring file: " + pathname);
    var ext = pathname.match(/\.([a-zA-Z]){1,4}/)[0];
    fs.readFile(pathname, function(err, data) {
        if (err) {
            console.error("ERROR: ", pathname, " not found");
            res.writeHead(404, {'Content-Type' : 'text/plain'});
            res.write("404 " + pathname + " not found");
            res.end();
        } else {
            res.writeHead(200, {'Content-Type' : mimetype[ext]});
            res.write(data);
            res.end();
            console.log("Succeeding sending: ", pathname);
        }
    });
}
