const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const ConnetToDb = require("./config/db");
const auth = require("./routes/auth");
const contact = require("./routes/ContactsRoute");
const fetchuser = require("./middleware/JWT");

// Middleware
dotenv.config();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: "https://contact-manager-g1.pages.dev",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.use("/api", auth);
app.use("/api", contact);

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await ConnetToDb();
    console.log(`Server started on port ${PORT}`);
  } catch (err) {
    console.log(err);
  }
});
