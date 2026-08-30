const Joi = require("joi");

const createTodoSchema = Joi.object({
    title:Joi.string().trim().min(3).required(),
    completed:Joi.boolean().optional()
}).unknown(false);;

const updateTodoSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(3)
        .required(),

    completed: Joi.boolean()
        .required()
}).unknown(false);;
 
const patchTodoSchema = Joi.object({
    title:Joi.string().trim().min(3).optional(),
    completed:Joi.boolean().optional()
}).min(1).unknown(false);

module.exports = {
    createTodoSchema,
    updateTodoSchema,
    patchTodoSchema
};