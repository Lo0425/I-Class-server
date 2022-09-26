const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const { PORT, DB_HOST, DB_PORT, DB_NAME } = process.env;

// mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`);
mongoose.connect(
  "mongodb+srv://LoChiaChing:E!e4e00397@cluster0.jngi1nd.mongodb.net/?retryWrites=true&w=majority"
);

app.use("/users", require("./api/users"));
app.use("/class", require("./api/class"));

// app.use("/items", require("./routes/items"));
// app.use("/carts", require("./routes/carts"));
// app.use("/orders", require("./routes/orders"));
// app.use("/reviews", require("./routes/reviews"));

app.listen(PORT, () => console.log("Server is running in PORT " + PORT));

mongoose.connection.once("open", () =>
  console.log("We are connected to MongoDB")
);
