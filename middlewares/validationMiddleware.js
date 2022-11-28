import { body, check, validationResult } from 'express-validator';

/* export let usersValidation = [

    //check("firstName").exists().trim().withMessage("Please provide us with your first name").isLength({max:20}).withMessage("maximum length of first name should be 20"), check("lastName"), // we already are checking existing firstName in schema so no need to use it here
    check("firstName").escape().trim().withMessage("Please provide us with your first name").isLength({ max: 20 }).withMessage("maximum length of first name should be 20"),
    // escape is for converting the html tags "<h1>cansin</h1>" to some special character
    check("lastName").trim().isLength({ max: 20 }).withMessage("maximum characters allowed are 20"),

    check("email").isEmail().normalizeEmail().withMessage("please provide valid email"),

    //check("password").exists().isLength({min:5, max:20}).withMessage("your password is too short or too long")
    check("password").exists().isLength({ min: 5 }).withMessage("your password is too short").isLength({ max: 20 }).withMessage("your password is too long")
]
 */

export let usersValidation = [

    check("firstName").escape().trim().isLength({min:3}).withMessage("minimum character required is 3"),
    
    check("lastName").escape().trim().isLength({max:20}).withMessage("maximum characters allowed are 20"),
    
   // check("email").isEmail().normalizeEmail().withMessage("please provide us with valid email"), // with normalize email method we are losing the dot in email addresses
    check("email").isEmail().toLowerCase().withMessage("please provide us with valid email"), 
    
    /* check("password").exists().isLength({min:5, max:20}).withMessage("your password is too short or too long") */
    check("password").exists().isLength({min:3}).withMessage("password is too shorts...").isLength({max:20}).withMessage("password is too long ..."),

    (req,res,next) => {
        const result = validationResult(req)
        if(result.isEmpty()){
            next() // if everything is okay next it will go to controller and execute the code
        }else{
            //next({message:result.errors}) // if we have errors then it will send directly to universal error handler.
            /* error message is like that:
            {
              "success": false,
              "message": {
                "message": [
                  {
                    "value": "",
                    "msg": "minimum character required is 3",
                    "param": "firstName",
                    "location": "body"
                  },
                  {
                    "value": "12",
                    "msg": "password is too shorts...",
                    "param": "password",
                    "location": "body"
                  }
                ]
              }
            }
            */
           // we want to get short message. refactor the message for frontend developer to make their work easy
           const error = result.errors.reduce((acc,currentItem)=> {

            acc[currentItem.param] = currentItem.msg // here we are creating key inside our accumulator and define it
            return acc;

           } , {})// here, at the end we have value that we should pass which format we want to get. its accumulator

           next({message:error})
        }
    } 
    ] 

    //we pass
    /* 
    {
        "firstName": "Cansin",
        "lastName": "Alkac",
        "email": "cansjhbhjbnh",
        "password": "12"
    }
    */
   // what we get from validator(in terminal)
   /* 
   Result {
    formatter: [Function: formatter],
    errors: [
      {
        value: 'cansjhbhjbnh',
        msg: 'please provide us with valid email',
        param: 'email',
        location: 'body'
      },
      {
        value: '12',
        msg: 'password is too shorts...',
        param: 'password',
        location: 'body'
      }
    ] 
  }
*/
//what we get from mongoose
/* 
{
  "success": true,
  "user": {
    "firstName": "Cansin",
    "lastName": "Alkac",
    "email": "@cansjhbhjbnh",
    "password": "12",
    "_id": "636a3f480b1b6033833f1647",
    "__v": 0
  }
}
*/