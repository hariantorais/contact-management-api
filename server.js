const app = require("./src/app");
require("dotenv").config();

const PORT = process.env.PORT || 8081;

app.listen(PORT, "127.0.0.1", () => {
  console.log(`=================================`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`=================================`);
});
