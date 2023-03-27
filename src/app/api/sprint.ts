import Post from '../db/model';

export default async function handler(req, res) {
  const { method, body } = req;

  switch (method) {
    case 'GET':
      try {
        const posts = await Post.findAll();
        res.status(200).json(posts);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;
    case 'POST':
      try {
        const post = await Post.create(body);
        res.status(201).json(post);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;
    default:
      res.status(400).json({ error: 'Invalid HTTP method' });
  }
}