const UserModel = require('../models/UserModel');
//Import  the required AWS Cognito SDK 

const {CognitoIdentityProviderClient, SignUpCommand} = require('@aws-sdk/client-cognito-identity-provider');

//Initialize Cognito client with specified AWS region

const client = new CognitoIdentityProviderClient({
    region: 'us-east-1',
});

//Define Coginto App Client ID for user pool authention

const CLIENT_ID =   process.env.CLIENT_ID;


//Exported sign-up function to handle new user registration

exports.signUp = async (event)=>{
    //Parse the incoming request body to extract  user data
    const {email, password, fullName}  = JSON.parse(event.body);
    const username  = fullName.replace(/\s+/g, '_'); //replace space with underscore
    //Configure parameters for Cognito  SignupCommand

    const params = {
        ClientId : CLIENT_ID,//Coginitor App Client ID
        Username: email, //User's email as the username in coginito
        Password: password,// User's chosen password
        UserAttributes:[//Additinal  user attributes  for coginito
            {Name: 'email', Value: email},//Email attribute
            {Name: 'name', Value: fullName},// Fullname attribute

        ]
    };


try {
    //Create the user in Cognito user pool
    const command = new SignUpCommand(params);
    //Execute the sign-up request
    await client.send(command);

    //save user in DynamoDb after Cognito sign-up succeeds
    const newUser  = new UserModel(email,username);

    await newUser.save();

    //Return success reponse to the client

    return {
        statusCode:200,
        body: JSON.stringify({msg:"Account created please verify your email!"}),
    };
} catch (error) {
    return {
        statusCode:400,
        body:JSON.stringify({msg: 'sign-up failed', error:error.message}),
    };
}
}
