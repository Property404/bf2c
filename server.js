const express = require("express"),
path = require("path"),
url = require("url"),
exec = require("child_process").exec,
fs = require("fs"),
bodyParser = require("body-parser"),
shellescape = require("shell-escape");


/* Execute a shell command and send back stdout and stdout */
function execute(command, callback){
	exec(command, function(error, stdout, stderr){callback(stdout, stderr);});
};

/* Set up app */
var app = express();

//* Set up bloo blap
app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 *  * Parses the text as JSON and exposes the resulting object on req.body.
 *   */
app.use(bodyParser.json());

// Handle dynamic Pageos through get/post
app.get('/:bf',(req, res)=> bfpage(req, res, false));
app.post('/:bf',(req, res)=> bfpage(req, res, false));
app.get('/', (req, res) => bfpage(req, res, true));

// Process request for a Brainfuck page
function bfpage(req, res, isindex) {
	var path = "./public/"+(isindex?"index.bf":req.path);
	console.log(path);
	fs.stat(path, function(err, stats){
		if(!err && !stats.isFile()){
			res.status(400).send("Ayy 404 lmao");
		}
		else{
			fs.readFile(path, "binary", function(err,file){
			if(err){
				res.status(500).send("Ayy 500 lmao");
			}
			else{
				postreq = "";
				for(var i in req.body){
					postreq+=i+"="+req.body[i]+"&";
				}
				postreq+="\\0";
				shult = shellescape(["echo", "-e", postreq])+"|"+shellescape(["bf", "-od", path])
				execute(shult, function(output, errput){
							if(path.indexOf(".css")!==-1){
								res.set("Content-type","text/css");
							}
							res.send(output);
						});
					}
				});
			}});

}

// Serve 
app.listen(8080, function() {
	console.log("Webfuck server running...");
});
