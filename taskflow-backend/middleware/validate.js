
function validate(schema){
    return (req, res,next)=>{

        const result = schema.safeParse(req.body);

        if(!result.success){
            const err = new Error("Validation failed");
            err.status = 400;
            err.errors = result.error.flatten().fieldErrors;
            return next(err);
        }

        req.body = result.data;
        next();

    }
}

module.exports = validate;