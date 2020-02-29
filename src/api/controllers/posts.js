module.exports = async (req, res, db) => {
  const { title, text } = req.body;
  const user = await db.collection('users').findOne({ email: req.user.email });
  const ID = user._id;
  await db.collection('posts').insertOne({ ID, title, text });
  const post = await db.collection('posts').findOne({ ID });
  const postID = post._id;
  await db.collection('users').update({ email: req.user.email }, { $push: { Posts: postID } });
  res.status(200).send('success');
};
