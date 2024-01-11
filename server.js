const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

// const db = knex({
//   client: "pg",
//   connection: {
//     host: "127.0.0.1",
//     port: 5432,
//     user: "postgres",
//     password: "sql13013*",
//     database: "smart-brain",
//   },
// });

const db = knex({
  client: "pg",
  connection: {
    connectString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    host: process.env.DATABASE_HOST,
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_DB,
  },
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("success");
});

app.get("/profile/:id", (req, res) => profile.handleProfileGet(req, res, db));

app.post("/signin", (req, res) => signin.handleSignin(req, res, db, bcrypt));
app.post("/register", (req, res) =>
  register.handleRegister(req, res, db, bcrypt)
);

app.post("/imageurl", (req, res) => image.handleClarifaiApiCall(req, res));

app.put("/image", (req, res) => image.handleImage(req, res, db));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(process.env);
  console.log(`APP IS RUNNING ON PORT ${PORT}!!!"`);
});
