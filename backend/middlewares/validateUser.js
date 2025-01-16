import Joi from 'joi'

export const validateUser = (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required()
    });
  
    const { error } = schema.validate(req.body);
  
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  
    next();
  };
  
export default validateUser;