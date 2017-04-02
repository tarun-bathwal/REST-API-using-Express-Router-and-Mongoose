var express = require("express");
var app = express();	
var	bodyParser = require("body-parser");
var	router = express.Router();
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/userdb");

var mongoSchema = mongoose.Schema;
var userSchema = {
	"email":String,
	"password":String
};
userschema = mongoose.model('user_login',userSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended":false}));

router.get("/",function(req,res){
	res.json({"error":false,"message":"hello"});
});

router.route("/users")
	.get(function(req,res){
		var response = {};
		userschema.find({},function(err,data){
			if(err){
				response = { "error" : true , "msg" : "could not retrieve data"};
			}
			else{
				response={"error":false,"message":data};
			}
		
		res.json(response);
	});
})
	.post(function(req,res){
		var db = new userschema();
		var response={};
		db.email=req.body.email;
		db.password=require('crypto').createHash('sha1').update(req.body.password).digest('base64');
		db.save(function(err){
			if(err){
				response={"error":true,"message":"could not add details"};
			}
			else{
				response={"error":false,"message":"added details"};
			}
			res.json(response);
		});
	});

router.route("/users/:id")
	.get(function(req,res){
		var response={};
		userschema.findById(req.params.id,function(err,data){
			if(err){
				response={"error":true,"message":"could not retrieve this id"};
			}
			else{
				response={"error":false,"message":data};
			}
			res.json(response);
		});
	})
	.put(function(req,res){
		var response={};
		userschema.findById(req.params.id,function(err,data){
			if(err){
				response={"error":true,"message":"could not find id"};
				res.json(response);
			}
			else{
				if(req.body.email!==undefined)
					data.email=req.body.email;
				if(req.body.password!==undefined)
					data.password=require('crypto').createHash('sha1').update(req.body.password).digest('base64');
				data.save(function(err){
					if(err){
						response={"error":true,"message":"error updating"};
					}
					else{
						response={"error":false,"message":"successfully done"};
					}
					res.json(response);
				});	
			}

		});
	})
	.delete(function(req,res){
		var response={};
		userschema.findById(req.params.id,function(err,data){
			if(err){
				response={"error":true,"message":"error retrieveing id"};
			}
			else{
				userschema.remove({_id:req.params.id},function(err){
					if(err){
						response={"error":true,"message":"error deleting"};
					}
					else{
						response={"error":false,"message":"deleted"};
					}
					res.json(response);
				});
			}
		});
	});

app.use('/',router);

app.listen(3000);
console.log("listening to port 3000");