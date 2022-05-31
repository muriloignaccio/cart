const { User } = require('../database/models');
const { hashSync, compareSync } = require('bcryptjs');

exports.createUser = async function(request, response) {
  const { firstName, lastName, email, password } = request.body;

  const userAlreadyExists = await User.findOne({ where: { email }});

  if(userAlreadyExists) return response.redirect('/login');

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashSync(password, 10)
  });

  await user.createCart();

  request.session.user = { ...user.toJSON(), password: null };

  return response.redirect('/login');
}

exports.authenticate = async function(request, response) {
  const { email, password } = request.body;

  const user = await User.findOne({ where: { email }});

  if (!user) return response.redirect('/login');

  console.log('found user')
  
  const doesPasswordMatch = compareSync(password, user.password);
  
  if (!doesPasswordMatch) return response.redirect('/login');
  
  console.log('password match')

  request.session.user = { ...user.toJSON(), password: null }

  return response.redirect('/cart');
}

exports.renderRegister = (request, response) => response.render('register');

exports.renderLogin = (request, response) => response.render('login');