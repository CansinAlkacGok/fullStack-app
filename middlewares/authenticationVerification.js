import jwt from 'jsonwebtoken'
import UsersCollection from '../models/usersSchema.js'

async function verifyToken (req,res,next){

    try{
        //extracting token out from headers
        const token = req.headers["token"]
        //const {token} = req.headers
        //console.log(token)
        //const token = req.headers.token

         // in order to read cookie we need to install cookie parser: npm i cookie-parser.  we went to app and import it there and used it there
       // const token = req.cookies.token
       // console.log(res.cookies)

        // we need to pass token in thunderclients req headers

        //verify token
        const payload = jwt.verify(token, process.env.TOKEN_SECRET_KEY )
        //console.log(payload)
        /* 
        {
          _id: '636cd2ae3792b8bf911ff94d',
          firstName: 'Cansin',
          iat: 1668417754,
          exp: 1672737754,
          aud: 'students',
          iss: 'Cansin'
        }
        */

        //get user from database
        const user = await UsersCollection.findById(payload._id)

        req.user = user // attaching user in request
        next() // if we pass something inside the next it will give error

        // now its easier to check users role. go to isAdmin middleware
    }
    catch(err){
        next(err)
    }
}

export default verifyToken