const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");
const morgan = require("morgan");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const auth = require("./controllers/authorization");

// For Docker
const db = knex({
  client: "pg",
  connection: {
    host: process.env.POSTGRES_HOST,
    port: 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
});

// For development local
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

// For production
// const db = knex({
//   client: "pg",
//   connection: {
//     connectionString: process.env.DATABASE_URL,
//     ssl: { rejectUnauthorized: false },
//     host: process.env.DATABASE_HOST,
//     port: 5432,
//     user: process.env.DATABASE_USER,
//     password: process.env.DATABASE_PW,
//     database: process.env.DATABASE_DB,
//   },
// });

db.raw("SELECT 1")
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.send("success");
});

app.post("/signin", (req, res) =>
  signin.signinAuthentication(req, res, db, bcrypt)
);
app.post("/register", (req, res) =>
  register.handleRegister(req, res, db, bcrypt)
);

app.get("/profile/:id", auth.requireAuth, (req, res) =>
  profile.handleProfileGet(req, res, db)
);
app.post("/profile/:id", auth.requireAuth, (req, res) => {
  profile.handleProfileUpdate(req, res, db);
});

app.post("/imageurl", auth.requireAuth, (req, res) =>
  image.handleClarifaiApiCall(req, res)
);
app.put("/image", auth.requireAuth, (req, res) =>
  image.handleImage(req, res, db)
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`APP IS RUNNING ON PORT ${PORT}!!!"`);
});
