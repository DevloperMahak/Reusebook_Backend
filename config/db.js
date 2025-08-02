
const mongoose = require("mongoose");


//check database connected or not
const connection = async () => {
    try {
      await mongoose.connect("mongodb+srv://mahakguptaji2005:Lq1yG4ry04fBsSjO@reusebook-cluster.zip2ptq.mongodb.net/?retryWrites=true&w=majority&appName=reusebook-cluster");
      console.log("✅ Database connected successfully.");
    } catch (error) {
      console.error("❌ Database connection failed:", error.message);
      process.exit(1);
    }
  };


module.exports = connection;

