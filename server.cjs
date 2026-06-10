const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const app = express();

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: 'Too many messages. Please try again in an hour.' }
});

app.use(cors({ origin: 'https://kolonel-ten.vercel.app' }));
app.use(express.json());
app.use('/api/chat', limiter);

app.post('/api/chat', async (req, res) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`KOLONEL server running on port ${PORT}`));