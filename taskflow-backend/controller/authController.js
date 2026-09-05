const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
 
const User = require('../models/User');
const { generateAccesstoken, generateRefreshAccesstoken } = require('../utils/generatetoken');
const { accessCookieOptions, refreshCookieOptions } = require('../utils/cookieOptions');



async function signup(req,res,next){
    try {

        const {email , password , name} = req.body;

        const existing = await User.findOne({email});

        if(existing){
            throw new Error("Email already exisits");
        }

        const hashedpassword = await bcrypt.hash(password , 10);

       const user = await User.create({ name, email,passwordHash: hashedpassword });

       const accessToken = generateAccesstoken(user._id);
       const refreshToken = generateRefreshAccesstoken(user._id);

       res.cookie("accesstoken", accessToken , accessCookieOptions);
       res.cookie("refreshtoken", refreshToken , refreshCookieOptions  );

       res.json({
         success: true,
         message :"Sign up sucessfully",
         data : {
            user : {
                id : user._id,
                name: user.name,
                email: user.email
            },
         accessToken,
         refreshToken,
         }
       });

    }catch(err){
        next(err);
    }

}


async function login(req,res,next){
    try {

        const {email ,password} = req.body;

        const user =  await User.findOne({email}).select('+passwordHash');


        if(!user){
            throw new Error("Invalid credentials");
        }

        const ismatchpassword = await bcrypt.compare(password , user.passwordHash);

        if(!ismatchpassword){
            throw new Error("Password is wrong");
        }else {
            const accessToken = generateAccesstoken(user._id);
            const refreshToken = generateRefreshAccesstoken(user._id);

            user.refreshToken = refreshToken;
            user.save();

       res.cookie("accesstoken", accessToken , accessCookieOptions);
       res.cookie("refreshtoken", refreshToken , refreshCookieOptions  );

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
         accessToken,
        refreshToken,
      },
    });
        }
       

    }
    catch(err){
        next(err);
    }
}

async function refresh(req, res,next){
    try{
     
    const refreshtoken = req.cookies.refreshtoken;

    if (!refreshtoken) {
      const err = new Error('Refresh token missing');
      err.status = 401;
      throw err;
    }

    let payload ;
    try{
    payload = jwt.verify(refreshtoken, 'kanban@123#');
    }catch{
      const err = new Error('Invalid or expired refresh token');
      err.status = 401;
      throw err;

    }


    const user = await User.findById(payload.sub).select('+refreshToken')
  


    if(!user || user.refreshToken !== refreshtoken){
        throw new Error("Refresh token is not valid");
    }

    const newaccesstoken = generateAccesstoken(user._id);

    res.json({
        success:true,
        message:"Token refreshed",
        accessToken: newaccesstoken
    })
} catch(err){
    next(err);
}
}

async function logout(req,res,next){
    try{
    const refreshtoken = req.cookies.refreshtoken;
     let payload ;
    if(refreshtoken){

        try{

        payload = jwt.verify(refreshtoken , "kanban@123#");

        const user =  await User.findByIdAndUpdate(payload.sub , {refreshToken: null});

     
        }catch{

        }
    }

        res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
    });

      res.json({
      success: true,
      message: "Logged out",
    });
        
    
} catch(err){
    next(err);
}
}


module.exports = {signup,login,refresh,logout}