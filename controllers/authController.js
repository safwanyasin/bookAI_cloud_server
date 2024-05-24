const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, listUsers } = require('../models/user');

const register = async (req, res) => {
  const { user_id, nickname, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await createUser(user_id, nickname, email, hashedPassword);
    res.status(201).json({ message: 'User created', user: newUser });
  } catch (error) {
    res.status(400).json(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log(token);
  res.json({ token });
};

const usersDetails = async (req, res) => {
  const users = await listUsers();

  res.status(200).json(users);
};

module.exports = {
  register,
  login,
  usersDetails
};
