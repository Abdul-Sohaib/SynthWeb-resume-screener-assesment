import { app } from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server] Resume Screener Assistant API listening on http://localhost:${PORT}`);
});

