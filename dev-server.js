const app = require('./api/index.js');

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`✅ Local Dev Server đang chạy tại http://localhost:${port}`);
});
