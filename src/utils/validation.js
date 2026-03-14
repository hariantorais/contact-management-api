const Joi = require("joi");

// USER

const registerUserValidation = Joi.object({
  name: Joi.string().max(100).required(),
  email: Joi.string().email().max(100).required(),
  password: Joi.string().min(6).max(100).required(),
});

const loginUserValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// CONTACT

const contactSchema = {
  firstName: Joi.string().max(100).optional(),
  lastName: Joi.string().max(100).optional(),
  phone: Joi.string().max(20).optional(),
  email: Joi.string().email().max(100).optional(),
};

const createContactValidation = Joi.object({
  ...contactSchema,
  firstName: contactSchema.firstName.required(),
  phone: contactSchema.phone.required(),
});

const updateContactValidation = Joi.object({
  ...contactSchema,
}).min(1);

const validate = (schema, request) => {
  const result = schema.validate(request, {
    abortEarly: false, // tangkap semua error
    allowUnknown: false, // tolak jika ada field yang tidak terdaftar
    stripUnknown: true, // hapus field liar agar db bersih
  });

  if (result.error) {
    console.error("joi validation error:", result.error.message);

    throw result.error;
  } else {
    return result.value;
  }
};

module.exports = {
  validate,
  registerUserValidation,
  loginUserValidation,
  createContactValidation,
  updateContactValidation,
};
