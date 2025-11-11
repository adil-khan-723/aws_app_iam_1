const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Deployed via Jenkins CI/CD 🚀');
});

app.get('/health', (req, res) => {
  res.send('OK');
});

const PORT = 33333;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});