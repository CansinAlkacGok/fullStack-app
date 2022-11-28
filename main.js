//note: mongodb is schemaless but mongoose is schemafull?

// 1- npm init -y -> initialize project
// 2- npm i express mongoose -> install main dependencies. we can also use --save at the end to make sure that it will place under dependencies
// 3- create gitignore -> to prevent to push node_modules and git ignore to the github
// 4- we use es6 syntax: added "type": "module" to package.json
// 5- also added some scripts to package.json
// 6- we don't have to change main file name , its optional but it would be good to change it.
// 7- they also installed nodemon but I have already had it globally. they used: npm i nodemon --save-dev /or npm i nodemon -D -> it will save under devDependencies in package.json 
// 8- npm i morgan -D -> printout request from users. totally optional because of that its under devDependencies
// NOTE: to use scripts need to write in terminal: npm run scriptName 
// 9- We organized files and controllers
// 10- create connection with our app and mongo DB we need to install mongoose: npm i mongoose
// 11- created env file and we need to install env package to load/store env variables into process.env variable : npm i dotenv
// NOTE: in react app we don't need .en package because it is already there
// 12- We need to create our schemas in models folder.
// 13- We need to connect them it with  mongoDB by importing schema file to controller files
// 14- we can ad data to document with mongodb compass or we can use faker. For it we created seed folder and seed file inside it. We created seed folder here but its also okay of we create it outside of the this folder
// 15- Need to install faker package: npm i @faker-js/faker -D to insert dummy data (-D because its only for development proposes)
// 16- express validator we install to validate our data : npm i express-validator / npm i --save express-validator -> validation means validating data
      //sanitization means clean up the data. user provide name with useless spaces. so we can clean up this spaces. or user write his/her email with capital letters, we can store it in small letters with sanitization 

     // https://express-validator.github.io/docs/

// 17- Day 5 -> we are adding status codes in controllers files
// 18 - we can secure all users information with hash value. we have package for it: npm i bcrypt / npm i bcrypt --save (save means saying always save this in main dependencies)
// 19 - for the authentication we need to install jsonwebtoken: npm i jsonwebtoken -> its for create a token- jwt.io..
// 20 - in order to read cookie we need to install cookie parser: npm i cookie-parser
// 21 - if use upload some file then we need to handle it with some middleware like multer(it stores images automatically) or express-fileupload(it shows file and then you can store it in database not directly in server). he prefers to use express-fileupload. but for this module we need to use multer: 
// user send request and backend share sources -> this is restful api. we have tested our backend with thunderclient. now its time to test it in app.
// we need to keep running backend at the background. its running at port 4000
// we used npx naqvi-app
// react is fullstack application not just frontend. react scripts provide development server to test our frontend code.
//because our origin for react is 3000 but for backend is 4000. so we have CORS error. We need to attach 'Access-Control-Allow-Origin'. so go back to backend and import and install CORS IN BACKEND. :npm i cors