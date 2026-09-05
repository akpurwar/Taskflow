const jwt = require("jsonwebtoken");

function authMiddleWare(req, res, next) {



    const authorizationtoken = req.cookies.accesstoken;

    

    if (!authorizationtoken) {
        const error = new Error("Authorization required");
        return next(error);
    }
 

    let payload;

    try {

        payload = jwt.verify(authorizationtoken, "kanban@123#");

         req.user = { id: payload.sub };
        next();
    }
    catch {
        const error = new Error("token got expired");
        next(error);
    }

}

module.exports = { authMiddleWare };