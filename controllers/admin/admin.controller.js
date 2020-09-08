var Admin = require('../../models/admins.model');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/linkdin", {useNewUrlParser: true,useUnifiedTopology: true });
var db = mongoose.connection;
const axios = require('axios');
const https = require('https');
const crypto = require("crypto");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const login = (req, res) => {
const AppDetails = {
//   client_id:"Enter a valid client id",
//   client_secret:"Enter a valid secret code",
//   redirect_uri:"It should be a valid uri",
  state_key:Math.random().toString(36).substring(2,22)+
            Math.random().toString(36).substring(2,22),
}
    if(req.query.error==='user_cancelled_login' || req.query.error==='user_cancelled_authorize') {
      console.log('condition1')  
    }
    else if(req.query.code && req.query.state) {
      console.log('condition2')
      console.log("Req querys>>>",req.query.code , req.query.state)
      
    let params = {
        grant_type:'authorization_code',
        code:req.query.code,
        // redirect_uri:'It should be a valid uri',
        // client_id:'Enter a valid client id',
        // client_secret:'Enter a valid secret code'
      }

    axios.post(`https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${req.query.code}&redirect_uri=enter valid uri&client_id=enter client id&client_secret=enter secret code`)
    .then((axiosres) => {
        console.log("CONSOLING ACCESS_TOKEN >>>", axiosres.data);
        const access_token = axiosres.data.access_token;

        let email_Id ="" , user_Name = "";
        
        if(access_token) {
            const AuthStr = 'Bearer '.concat(access_token);

            axios.get(`https://api.linkedin.com/v2/me`, 
            { headers: { Authorization: AuthStr },
            Connection: 'Keep-Alive'  }
            )
            .then(nameRes => {
                console.log("CONSOLING DATA >>>", nameRes.data);
                user_Name = nameRes.data.localizedFirstName + ' ' + nameRes.data.localizedLastName 
                axios.get(`https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))`, 
                { headers: { Authorization: AuthStr },
                Connection: 'Keep-Alive'  }
                )
                .then(mailRes => {
                    email_Id = JSON.stringify(mailRes.data).split('"')[11];

                    console.log("CONSOLING DATA >>>", email_Id);
                    // email_Id = 
                    console.log("NAME CONSOLE >> ", user_Name);
                    let rpassword = crypto.randomBytes(10).toString("hex");
                    Admin.findOne({
                      email: email_Id
                    }).then(user => {
                      if (user) {
                        console.log("Consoling Success>>", user )
                        
                    
                        jwt.sign(
                          payload,
                          "secret",
                          {
                            expiresIn: 3600
                          },
                          (err, token) => {
                            if (err) console.error("There is some error in token", err);
                            else {
                              let userDataofLinkedIN = user._id;
                              res.cookie("userData", userDataofLinkedIN);
                           
                            }
                          }
                        );
                      } else {
                        const avatar = gravatar.url(req.body.email, {
                          s: "200",
                          r: "pg",
                          d: "mm"
                        });
                    
                        
                      }
                    });

                })
                .catch(err => {
                    console.log("CONSOLING FOR MAIL RETRIVE  >>>", err)
                })

            })
            .catch(err => {
                console.log("CONSOLING PROFILE RETRIVE  >>>", err)
            })
        }


    })
    .catch((err) => {
        console.log("CONSOLING ERROR >>>", err) 
    })
      
    } else {
  
    res.status(200).json({
        url:`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${AppDetails.client_id}&redirect_uri=${AppDetails.redirect_uri}&state=${AppDetails.state_key}&scope=r_liteprofile%20r_emailaddress%20w_member_social`,
    });
  
  }
  
  };

  module.exports = {
    login,
    
    
}