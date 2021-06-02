
"use strict";
const {
  CognitoUserPool,
  CognitoUserAttribute,
} = require("amazon-cognito-identity-js");
let AmazonCognitoIdentity = require("amazon-cognito-identity-js");

const USER_POOL_ID=""
const CLIENT_ID=""

module.exports.submit = async (event, context, callback) => {

  const return_register = await register(event)
    .then((user) => {
      return user;
    })
    .catch((error)=>{
      return error;
    });
    callback(null, return_register)
};


const register = async (event) => {
  const poolData = {
    UserPoolId: USER_POOL_ID,
    ClientId: CLIENT_ID,
  };
  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  let body = JSON.parse(event.body);

  let dataName = {
    Name: "name",
    Value: body.name,
  };
  let dataEmail = {
    Name: "email",
    Value: body.email,
  };
  let attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(dataName);
  let attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(
    dataEmail
  );

  let attributeList = [];
  attributeList.push(attributeName);
  attributeList.push(attributeEmail);

  return new Promise((resolve, reject) => {
    
    userPool.signUp(
      body.email,
      body.password,
      attributeList,
      null,
      function (err, result) {
        if (err) {
        reject({
            statusCode: 500,
            body: JSON.stringify({
              message: err.message,
            }),
          });
        }
        resolve({
          statusCode: 200,
          body: JSON.stringify({
            user: result
          }),
        });
      }
    );
  });
}