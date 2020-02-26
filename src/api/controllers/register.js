const handleRegister = async (req, res, db) => {
  const { name, email } = req.body;
  await db.collection('users').insertOne({ name, email });
  res.send('success');
};

module.exports = handleRegister;
