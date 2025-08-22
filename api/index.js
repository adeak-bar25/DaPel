import app from '../app.js'
import { port } from '../utils/config.js';

// const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;