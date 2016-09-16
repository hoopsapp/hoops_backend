Meteor.onConnection(function(connection){
   console.log("New client connection: "  + connection.id + " from: " + connection.clientAddress);
});

Accounts.validateNewUser(function (user) {
    console.log("New user created:");
    console.log(user);
    return true;
});