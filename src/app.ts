import express from 'express';
import path from 'path';

const PORT = 5000;
const app = express();

app.use(express.static(path.resolve(__dirname, '../public')));

app.listen(PORT, () => {
  console.log(`Server started on port http://localhost:${PORT}`);
});
