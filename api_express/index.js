//app.js
"use strict";

const express = require("express"),
	CognitoExpress = require("cognito-express"),
	port = process.env.PORT || 3001;

const app = express(), authenticatedRoute = express.Router(); //I prefer creating a separate Router for authenticated requests

app.use("/api", authenticatedRoute);

app.get('/', (req, res) => {
  res.send('Hello world seguro')
})

const cognitoExpress = new CognitoExpress({
	region: "us-east-1",
	cognitoUserPoolId: "us-east-1_52owBGZfc",
	tokenUse: "id", 
	tokenExpiration: 3600000 
});


authenticatedRoute.use(function(req, res, next) {
	
	let idToken = req.headers.authorization;
	if (!idToken) return res.status(401).send("ID Token missing from header");

	cognitoExpress.validate(idToken, function(err, response) {
		if (err) return res.status(401).send(err);
		res.locals.user = response;
		next();
	});
});
authenticatedRoute.get("/getuser", function(req, res, next) {
  console.log(res.locals.user)
	res.send(`Hi ${res.locals.user.name} (${res.locals.user.email}), your API call is authenticated!`);
});

app.listen(port, function() {
	console.log(`Live on port: ${port}!`);
});