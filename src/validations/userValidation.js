const Joi = require("joi");

const registerUserSchema = Joi.object({
    name:Joi.string().trim().min(2).required(),
    
    email:Joi.string().trim().lowercase().email().required(),

    password: Joi.string().min(6).required()
}).unknown(false);

const loginUserSchema = Joi.object({
        email:Joi.string().trim().lowercase().email().required(),
        password:Joi.string().required()
}).unknown(false);

module.exports = {
    registerUserSchema,
    loginUserSchema
};