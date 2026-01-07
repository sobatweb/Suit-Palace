require("dotenv").config();
const app = require("./app");
const db = require("./config/db");

const PORT = process.env.PORT || 3000;
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
