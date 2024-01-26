const mongoose = require("mongoose");
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, clientOptions);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB Connection Failed");
  }
};

module.exports = { db };
