var express = require("express");
var app = express();
var path = require("path");
const exphbs = require('express-handlebars');
const multer = require("multer");
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dcordi14@gmail.com',
      pass: 'Nidan&Dnail'
    }
  });

const HTTP_PORT =  process.env.PORT || 8080;

app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

function onHttpStart() 
{
    console.log("Express http server listening on: " + HTTP_PORT);
}

const storage = multer.diskStorage
({
    destination: "./static/photos/",
    filename: function (req, file, cb) 
    {
     
      cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
// Contents of Folder "static" are now available
app.use(express.static("static"));

// Homepage URL
app.get("/", (req, res) => 
{
    
    //res.sendFile(path.join(__dirname, "views/home.html"));


    res.render('home', 
    {
        layout: false 
    });
});

// Room Listing URL
app.get("/roomListing", (req, res) => 
{
    
    //res.sendFile(path.join(__dirname, "views/roomListing.html"));


    res.render('roomListing', 
    {
        layout: false 
    });
});

// User Registration URL
app.get("/userRegistration", (req, res) => 
{
    
    // res.sendFile(path.join(__dirname, "views/userRegistration.html"));

    var someData = 
    {
        name: "John"
    };

    res.render('userRegistration', 
    {
        layout: false 
    });
});

app.post("/register-user", upload.single("photo"), (req, res) => 
{
    // const formData = req.body;
    // const formFile = req.file;
  
    // const dataReceived = "Your submission was received:<br/><br/>" +
    //   "Your form data was:<br/>" + JSON.stringify(formData) + "<br/><br/>" +
    //   "Your File data was:<br/>" + JSON.stringify(formFile) 
    //   //"<br/><p>This is the image you sent:<br/><img src='/photos/" + formFile.filename + "'/>";
    // res.send(dataReceived);
    //res.send("register");

    //assignment two code
    const email = req.body.email;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const password = req.body.password;

    var name_regx = /^[a-zA-Z]+$/;
    var psw_regx = /^[a-zA-Z0-9]{6,12}$/;
    
//errormsg
    var somedata = {
        user_reg_invalid_flag: false,
        errormsg:"try something"
   };


   if (email === null || email === "") {
        somedata.user_reg_invalid_flag = true;
        somedata.errormsg="Email is empty Re-enter"
   }
   else if (fname === null || fname === "") {
        somedata.user_reg_invalid_flag = true;
        somedata.errormsg="First Name is empty Re-enter"
   }
  else if (lname === null || lname === "") {
        somedata.user_reg_invalid_flag = true; 
        somedata.errormsg="Last Name is empty Re-enter"
    }
    else if (password === null || password === "") {
        somedata.user_reg_invalid_flag = true;
        somedata.errormsg="Password is empty Re-enter"
    }
    else if (!name_regx.test(fname)) {
        somedata.user_reg_invalid_flag = true;
        somedata.errormsg="First Name can only have letters"
    }
    else if (!name_regx.test(lname)) {
        somedata.user_reg_invalid_flag = true;
        somedata.errormsg="Last Name can only have letters"
    }
    else if(!psw_regx.test(password)) {
        somedata.user_reg_invalid_flag = true;
        somedata.errormsg="Password can only have Upper, Lower letters and Numbers"
    } else 
    {
        errormsg=""
    }

    var mailOptions = {
        from: 'dcordi14@gmail.com',
        to: email,
        subject: 'Welcome ' + fname + ' ' + lname + '!',
        text: 'Thanks for joining.'
      }

      if (!somedata.user_reg_invalid_flag) {
            transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

          res.render('dashBoard', 
                {
                    data:  somedata,
                    layout: false 
                });
      }
      else {
    
            res.render('userRegistration', 
            {
                data:  somedata,
                layout: false 
            });

        }


});

app.post("/login-user", upload.single("photo"), (req, res) => 
{
    //const formData = req.body;
    //const formFile = req.file;
  
    //const dataReceived = "Your submission was received:<br/><br/>" +
     // "Your form data was:<br/>" + JSON.stringify(formData) + "<br/><br/>" ;
     // "Your File data was:<br/>" + JSON.stringify(formFile) 
      //"<br/><p>This is the image you sent:<br/><img src='/photos/" + formFile.filename + "'/>";
    //res.send(dataReceived);
   
   //assignment tow code 
   const uname = req.body.uname
   const psw = req.body.psw

   var somedata = {
        invalid_flag: false
   };
   
   //check for nulls
   if (uname === null || uname === "") {
       somedata.invalid_flag = true;
      // console.log("you are null ");
      // console.log("uname =" + somedata.invalid_flag)

   }
   if (psw === null || psw === "") {
        somedata.invalid_flag = true;
      //  console.log("you are null ");
       // console.log("psw =" + somedata.invalid_flag)
    }



    res.render('home', 
    {
        data:  somedata,
        layout: false 
    });
    
});

app.listen(HTTP_PORT, onHttpStart);