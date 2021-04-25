var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var query = "";
var port = process.env.PORT || 3000;

http.createServer(function (req, res)
  {

	  if (req.url == "/")
	  {
		  file = 'stock.html';
		  fs.readFile(file, function(err, txt) {
    	  res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(txt);
          res.end();
		  });
	  }
	  else if (req.url == "/process")
	  {
		 res.writeHead(200, {'Content-Type':'text/html'});
		 res.write ("Process the form<br>");
		 pdata = "";
		 req.on('data', data => {
           pdata += data.toString();
         });

		// when complete POST data is received
		req.on('end', () => {
			pdata = qs.parse(pdata);
			if (pdata['company'] == ""){
					query = {ticker:"NULL"};
					query["ticker"] = pdata['ticker'];
			}else{
					query = {company:"NULL"};
					query["company"] = pdata['company'];
			}
			const MongoClient = require('mongodb').MongoClient;
			const url = "mongodb+srv://jiake3109:Jiake76526890@cluster0.j71nv.mongodb.net/band?retryWrites=true&w=majority";
			MongoClient.connect(url, {useUnifiedTopology: true }, function(err,db){
				  if (err) {return console.log(err); return;}
				  var dbo = db.db("companies");
				  var collection = dbo.collection("company_list");
					collection.find(query).toArray(function(err, items) {
						  if (err) {
							console.log("Error: " + err);
						  }
						  else
						  {
							console.log("Items: ");
							for (i=0; i < items.length; i++)
								res.write("The company name is: " + items[i].company + ".<br>" + "The ticker code is:" + items[i].ticker + ".<br><br>");
						  }
// 						  db.close();
					});
			});
			res.end();
		});
	  }
}).listen(port);
