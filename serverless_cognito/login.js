'use strict';
const {
  CognitoUserPool
} = require("amazon-cognito-identity-js");
let AmazonCognitoIdentity = require("amazon-cognito-identity-js");

const USER_POOL_ID=""
const CLIENT_ID=""

module.exports.submit = async (event, context, callback) => {
  
  const return_login = await login(event).then((user) => {
      return user
  }).catch((error)=>{
       return error
  });
  callback(null, return_login)

};

const login = async (event) => {
  let body = JSON.parse(event.body);
  let authenticationData = {
    Username: body.email,
    Password: body.password,
  };
  let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData
  );
  const poolData = {
    UserPoolId: USER_POOL_ID,
    ClientId: CLIENT_ID,
  };
  let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  let userData = {
    Username: authenticationData.Username,
    Pool: userPool,
  };
  let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          const access_token = result.getAccessToken().getJwtToken();
          const id_token = result.getIdToken().getJwtToken();
          resolve({
            statusCode: 200,
            body: JSON.stringify({
              access_token: access_token,
              id_token:id_token
            }),
          });
        },
        onFailure: function (err) {
          reject({
            statusCode: 500,
            body: JSON.stringify({
              message: err.message,
            }),
          });
        },
      });
    });
  
}