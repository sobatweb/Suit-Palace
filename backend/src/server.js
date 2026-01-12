require("dotenv").config();
const app = require("./app");
const db = require("./config/db");
const cors = require('cors');

const PORT = process.env.PORT || 3000;
app.use(cors());

(async () => {
    try {
      await db.query("SELECT 1");
      console.log("✅ Database connected");
      

      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
      });
    } catch (err) {
      console.error("❌ Database connection failed:", err.message);
    }
  })();
