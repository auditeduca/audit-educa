import express from 'express';
import { suggestionLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/', suggestionLimiter, (req, res) => {
  const { message } = req.body;

  if (!message || message.length < 10) {
    return res.status(400).json({ error: 'Mensagem inválida' });
  }

  console.log('Sugestão recebida:', message);

  res.json({ success: true });
});

export default router;