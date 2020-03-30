const bcrypt = require('bcrypt');
const nodemailer=require('nodemailer');
const jwt=require('jsonwebtoken');

const handleSignup = async (req, res, db) => {
  const { name, email, phone, password, password2 } = req.body;
  const errors = [];
  if (!name || !email || !password || !password2 || !phone) errors.push('Fields can not be empty');
  const exists = await db.collection('users').findOne({ email });
  if (exists) errors.push('Email already exists');
  if (password.length < 6) errors.push('Password should be at least 6 chars long');
  if (password !== password2) errors.push('passwords do not match');
  if (errors.length) res.status(400).send(errors);
  else {
    const hash = await bcrypt.hash(password, 10);
    await db
      .collection('users')
      .insertOne({ name, email, phone, hash, isAdmin: false, isVerified: false,isEmailVerified:false });
    const { isVerified } = await db.collection('users').findOne({ email });
    const user = await db.collection('users').findOne({ email });
    const userID = user._id;
    //console.log(userID);
    if (!isVerified) {
      // if it is not a admin then verify a user by admin
      await db.collection('admins').updateOne({}, { $push: { usersToVerify: userID } });
    }
    res.status(200).send('verify your email');

          var transport=nodemailer.createTransport({
              service:"Gmail",
              auth:{
                  user: process.env.SERVER_MAIL_ADDRESS,
                  pass: process.env.SERVER_PASSWORD
              }
          });
          //console.log(user);

          const info={
              username: user.name,
              id:user._id,
              expiry :  new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
          }
          var token=jwt.sign(info,process.env.TOKEN_ACCESS_SECRET,{expiresIn:'1h'});
          //console.log(token);
          var mailOptions={
              from:"noreply <process.env.SERVER_MAIL_ADDRESS>",
              to: user.email,
              subject:"Email verification",
              text : 'Visit this http://localhost:4000/verifyEmail/'+token,
             html : '<a href="http://localhost:4000/api/verifyEmail/'+token+'"><H2>Click on this link to verify your email!!</H2></a>'
          }
          //console.log(mailOptions);
          transport.sendMail(mailOptions,(emailErr,emailData)=>{
              if(emailErr){
                  console.log(emailErr);
                  res.json(emailErr)
              }
          })
      } 
};

module.exports = { handleSignup };

