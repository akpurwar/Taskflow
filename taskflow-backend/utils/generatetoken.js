const jwt = require("jsonwebtoken");

function  generateAccesstoken(userId){

    return jwt.sign({sub: userId}, "kanban@123#" , {expiresIn : '15m'})

}


function  generateRefreshAccesstoken(userId){

    return jwt.sign({sub: userId}, "kanban@123#" , {expiresIn : '7d'})

}

module.exports = {generateAccesstoken ,generateRefreshAccesstoken};
