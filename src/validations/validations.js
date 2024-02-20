const Validation = {}

const Joi = require('joi');


const registerSchema = Joi.object({ 
    firstname: Joi.string().regex(/^[a-zA-Z]+$/).min(3).max(30).required(),
    email: Joi.string().email().max(50).required(),
    lastname: Joi.string().regex(/^[a-zA-Z]+$/).min(3).max(30).required(),
    city: Joi.string().regex(/^[a-zA-Z]+$/).max(40).required(),
    country: Joi.string().regex(/^[a-zA-Z]+$/).max(30).required()
});
    


Validation.register = (req, res, next) => {
    try {
        const {error} =  registerSchema.validate(req.body);
        if(error) {
            return res.status(400).send(error.message);
        }
        next();
    } 
    catch (error) {
        return {
            success: false,
            message: `Invalid input: ${error.message}`
        }
    }
}


const loginSchema = Joi.object({
    email: Joi.string().email().max(50).required()
});

Validation.login = (req, res, next) => {
    try {
        const {error} =  loginSchema.validate(req.body);
        if (error) {
            return res.status(400).send(error.message);
        }
        next();
    } 
    catch (error) {
        return {
            success: false,
            message: `Invalid input: ${error.message}`
        }
    }
}

module.exports = Validation;