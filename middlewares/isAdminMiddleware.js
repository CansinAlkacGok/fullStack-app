// this is going to check the role. and according to the roles we going to give some permissions for operations

export const isAdmin = (req, res, next) => {
     //if user is admin  next()
     //else { const error = new Error("unauthorised access") 
     //       error.status = 403
     //       next(error)     //it will go to the universal error handler  
     //     }

     // next(); // to forward out request
     
     if(req.user.role === "admin"){
          next()
     }else{
          //console.log(req.params.id, req.user._id) // first one is string second is object id.so we cannot compare directly
          if(req.user._id.toString() === req.params.id || req.user.orders.includes(req.params.id)){ // params.id is what we pass as endpoint when we check
               next()
          }else {
               const error = new Error("unauthorized access") 
               error.status = 403 // means forbidden
               next(error)
          }
          
     }

}

// authentication and authorization
// we are sending http request from client to the server and server send back to response. http is stateless protocol. there is no record for this unique request and cycle is completed. this way its not possible to authenticate the user because each request is unique so we need to make our server to remember last request and user. what server can do? through http request is stateless, server can create a certificate for the request. certificate is token, unique code and server send it to user. so server authenticate the user. this is authorization. authorization is verification of the certificate. authentication is creating certificate. for the server each request is unique so cannot remember that this is the last user. server remember all thing by using certificate. we need to create certificate we need to go to login in usercontroller


    /* 
    1-create certificate
    2-create token
    3-verify token
    4-get user according to the token
    5-and next to admin
    6-check role of the user if its admin
    */