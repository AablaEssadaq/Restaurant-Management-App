import Joi from 'joi'

export const validateOwner = (req, res, next) => {
    const schema = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      phoneNumber: Joi.string().pattern(/^\+?\d{10,15}$/).required(),
      password: Joi.string().min(8).required(),
      confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
      country: Joi.string().required(),
      city: Joi.string().required(),
      restaurantName: Joi.string().required(),
      restaurantCountry: Joi.string().required(),
      restaurantCity: Joi.string().required(),
      restaurantStreet: Joi.string().required(),
    });
  
    const { error } = schema.validate(req.body);
  
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  
    next();
  };
  
export default validateOwner;