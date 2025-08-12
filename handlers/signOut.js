const {CognitoIdentityProviderClient,GlobalSignOutCommand} = require("@aws-sdk/client-cognito-identity-provider");

const client = new CognitoIdentityProviderClient({
    region: 'us-east-1',
});


exports.signOut = async (event)=>{
    const {accessToken} = JSON.parse(event.body);

   const params ={
    AccessToken :accessToken,
   };

   try {
    const command = new GlobalSignOutCommand(params);
    await client.send(command);
    return {
        statusCode:200,
        body: JSON.stringify({msg:"User succesfully signed out!"}),
    };
   } catch (error) {
    return {
        statusCode:400,
        body:JSON.stringify({msg: 'sign-out failed', error:error.message}),
    };
   }
}