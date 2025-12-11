import Joi from "joi";

const applySchema = Joi.object({
  name: Joi.string()
    .required()
    .min(2)
    .max(100)
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 100 characters",
      "any.required": "Name is required"
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
      "string.empty": "Email is required",
      "any.required": "Email is required"
    }),
  
  path: Joi.string()
    .required()
    .messages({
      "string.empty": "File path is required",
      "any.required": "File is required"
    }),
    
  originalName: Joi.string()
    .optional()
    .allow('')
    .max(255)
    .messages({
      "string.max": "File name is too long"
    }),
    
  size: Joi.number()
    .optional()
    .min(1)
    .max(10 * 1024 * 1024) // 10MB max
    .messages({
      "number.min": "File is too small",
      "number.max": "File size cannot exceed 10MB"
    }),
    
  mimeType: Joi.string()
    .optional()
    .pattern(/^image\//)
    .messages({
      "string.pattern.base": "Only image files are allowed"
    })
});

export default function validateApply(data: any) {
  return applySchema.validate(data, { 
    abortEarly: false,
  });
}