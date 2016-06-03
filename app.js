var portNumber = 18000;
var serverName = '192.168.8.236';

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
//var https = require('https');
var request = require('request');
var custom_content;

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.use(bodyParser.json());
app.use(express.static('public'));


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



// viewed at http://localhost:8080
app.get('/', function(req, res) {

	res.sendFile(path.join(__dirname + '/public/views/index.html'));


});
   
app.post('/api', function(req, res) {

    var data = {};
    data.body = custom_content.text;//"This is another test message";
    data.title = "Realbox Notifications";
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
    
    //var receive_key = '"doIfMEbE1xo:APA91bFolX43Gi_VibjLRwUzOqyeNGmlsix99DSrYZrFimHn1w07Wg-Y0yuQ_zMzKC4rCkPkdFAMJ1e_gJ0fdJEZrghFeXM5iPvMisTwR1Z82TiqgPRhamtJg1j0AZaCokp9Ys2SDWkL"'
    //var receive_key = '"fKU8sRSJtIs:APA91bF0q0v_hJiCq9mYBrqpYHQMbSUZe9bkJzOxJkIYUkiS7WK767ovFe96R_HVdXdZDl_ie1BxhsHC19kJ8Yqx7qpX_2kY-EzuRn6KNsjzCKY73jG7aqz2ypUWy3UbdrSjxscsmGHT"'
     
	custom_content = req.body.data;
	//console.log(custom_content);
	
    var receive_key = "\"" + custom_content._id + "\"";
    var dataString = '{"registration_ids":['+ receive_key +']}';
    
    console.log(dataString);

    var options = {
    url: 'https://android.googleapis.com/gcm/send',
    method: 'POST',
    body: dataString,
    headers: { 

     "Authorization": "key=AIzaSyDolKXSYT4qVoksR5V8S78YUdxwFzdocT8", 
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
    //console.log('KeySaved');
    var r = req.body;
    console.log(r);
    MongoClient.connect('mongodb://127.0.0.1:27017/Realbox', function(err, db) {
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
});


app.post('/getDetails', function(req, res) {
    //console.log('getDetails');
    var r = req.body;
    //console.log(r);
    MongoClient.connect('mongodb://127.0.0.1:27017/Realbox', function(err, db) {
        var collection = db.collection('keys');
        collection.find({}).toArray(function(err,items){
            res.json(items);
            //console.log(items);
            db.close();
        })
            
        });

    });


app.listen(18000);

// https.createServer({
//       key: fs.readFileSync('server.key'),
//       cert: fs.readFileSync('server.crt')
//     }, app).listen(8000);


