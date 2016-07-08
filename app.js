var portNumber = 18000;
var serverName = '192.168.8.236';

var express = require('express');
//var forceSSL = require('express-force-ssl');
var app = express();
var path = require('path');
var cookieParser = require("cookie-parser");
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var https = require('https');
var request = require('request');
var custom_content;

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function requireHTTPS(req, res, next) {
    
    if (!req.secure) {
        //FYI this should work for local development as well
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}

app.use(requireHTTPS);
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cookieParser());
//app.use(forceSSL);
//app.use(app.router);

app.set('forceSSLOptions', {
  enable301Redirects: true,
  trustXFPHeader: false,
  httpsPort: 18000,
  sslRequiredMessage: 'SSL Required.'
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



// viewed at http://localhost:8080
app.get('/', function(req, res) {

    console.log(req.cookies);
    res.cookie("cookie_name","TestCookieRealbox");
	res.sendFile(path.join(__dirname + '/public/views/index.html'));


});
   
app.post('/api', function(req, res) {

    var data = {};
    console.log(custom_content);
    
    data.body = custom_content.text;//"This is another test message";
    data.title = custom_content.title //"Realbox Notifications";
    data.icon = "/images/realboxLogo.ico";
    data.url = custom_content.url;

    console.log(data)
    res.send(data);


});


app.get('/post', function(req,res){

res.sendFile(path.join(__dirname + '/public/views/post.html') );	
});

//app.get('/postMsg' , function (req,res) {
app.post('/postMsg' , function (req,res) {
    
     
	custom_content = req.body.data;
	console.log(custom_content);
	console.log("==============================");
    


    var receive_key = "\"" + custom_content._id + "\"";
    var dataString = '{"registration_ids":['+ receive_key +']}';
    
    console.log(dataString);

    var options = {
    url: 'https://android.googleapis.com/gcm/send',
    method: 'POST',
    body: dataString,
    headers: { 

     "Authorization": "key=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", 
     "Content-Type": "application/json" 

    }
};

function callback(error, response, body_input) {
    if (!error && response.statusCode == 200) {
        
        var body = JSON.parse(body_input);

        //console.log(body);
        console.log(body['failure']);
        if(body.failure)
        {   
           
            if (body.results[0]["error"] == "NotRegistered")
            {
                console.log("Unregistered Caught");
                MongoClient.connect('mongodb://127.0.0.1:27017/Realbox', function(err, db) {
//  MongoClient.connect('mongodb://192.168.8.236:27017/Realbox', function(err, db) {
                var collection = db.collection('keys');
                collection.deleteOne({"_id":receive_key.slice(1,receive_key.length -1)}, function(err, numberOfRemovedDocs) {
                     console.log(err, numberOfRemovedDocs);
                     db.close();
                });
               });
            }

            else if (body.results[0]["error"] == "InvalidRegistration")
            {
                res.send("Invalid Registration");
            }
        }

    }
}

request(options, callback);

console.log("After request")
res.send("Message Sent")

});

app.post('/saveKey', function(req, res) {
    console.log('KeySaved');
    var r = req.body;
//    console.log(r);
   MongoClient.connect('mongodb://127.0.0.1:27017/Realbox', function(err, db) {
 //  MongoClient.connect('mongodb://192.168.8.236:27017/Realbox', function(err, db) {
        var collection = db.collection('keys');
        collection.find({_id:r._id}).toArray(function(err,items){
            if(items.length == 0)
            {
                 collection.save(r, function(err,items){
                    console.log(items);
                    console.log("User Registered");
                    db.close();
                 });   
            }
            else
            {
                console.log("Already Registered");
                collection.update({_id:r._id}, {$set:r}, function(err,items){
                    console.log(items);
                    console.log("User Updated");
                    db.close();
                 });   
            }        

        });

    });
//res.cookie("gcmId", "True");
//res.sendFile(path.join(__dirname + '/public/views/index.html'));
res.send("Registration Successful");
});


app.post('/getDetails', function(req, res) {
    //console.log('getDetails');
    var r = req.body;
    //console.log(r);
   MongoClient.connect('mongodb://127.0.0.1:27017/Realbox', function(err, db) {
   // MongoClient.connect('mongodb://192.168.8.236:27017/Realbox', function(err, db) {
        var collection = db.collection('keys');
        collection.find({}).toArray(function(err,items){
            res.json(items);
            //console.log(items);
            db.close();
        })
            
        });

    });


//app.listen(18000);
var options = {
  key: fs.readFileSync('/home/dhuadaar-user/certs/localhost.key'),
  cert: fs.readFileSync('/home/dhuadaar-user/certs/localhost.crt')
};

https.createServer(options,app).listen(18000);
