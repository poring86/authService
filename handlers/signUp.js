//Import  the required AWS Cognito SDK 

const {CognitoIdentityProviderClient, SignUpCommand} = require('@aws-sdk/client-cognito-identity-provider');


const client = new CognitoIdentityProviderClient({
    region: 'us-east-1',
});


const CLIENT_ID = process.env.CLIENT_ID;


//Exported sign-up function to handle new user registration

exports.signUp = async (event)=>{
    const {email, password, fullName}  = JSON.parse(event.body);

    const params = {
        ClientId : CLIENT_ID,//Coginitor App Client ID
        Username: email, //User's emailas the username in coginito
        Password: password,// User's chosen password
        UserAttributes:[//Additinal  user attributes  for coginito
            {Name: 'email', Value: email},
            {Name: 'name', Value: fullName},

        ]
    };


try {

    const command = new SignUpCommand(params);
    //Execute the sign-up request
    await client.send(command);

    //Return success reponse to the client

    return {
        statusCode:200,
        body: JSON.stringify({msg:"User successfully signed up!"}),
    };
} catch (error) {
    return {
        statusCode:400,
        body:JSON.stringify({msg: 'sign-up failed', error:error.message}),
    };
}
}
