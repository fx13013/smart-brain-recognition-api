const jwt = require("jsonwebtoken");
const redis = require("redis");

// Setup Redis
const redisClient = redis.createClient({
  url: process.env.REDIS_URI,
  // url: "redis://localhost:6379",
});

console.log("Connecting to Redis at:", process.env.REDIS_URI);

redisClient.on("error", (err) => console.log("Redis Client Error", err));

async function connectRedis() {
  try {
    await redisClient.connect();
    console.log("Redis client connected successfully");
  } catch (err) {
    console.error("Failed to connect to Redis", err);
  }
}

connectRedis();

const handleSignin = async (req, res, db, bcrypt) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("incorrect form submission");
    }

    const data = await db
      .select("email", "hash")
      .from("login")
      .where("email", "=", email);

    if (data.length === 0) {
      throw new Error("wrong credentials");
    }

    const isValid = bcrypt.compareSync(password, data[0].hash);
    if (!isValid) {
      throw new Error("wrong credentials");
    }

    const user = await db.select("*").from("users").where("email", "=", email);

    if (user.length === 0) {
      throw new Error("unable to get user");
    }

    return user[0];
  } catch (error) {
    console.error("Error in handleSignin:", error);
    throw new Error(error.message);
  }
};

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, "JWT_SECRET", { expiresIn: "2 days" });
};

const setToken = async (key, value) => {
  return await Promise.resolve(redisClient.set(key, value));
};

const createSessions = async (user) => {
  const { id, email } = user;
  const token = signToken(email);
  try {
    return await setToken(token, id).then(() => {
      return { success: "true", userId: id, token };
    });
  } catch (err) {
    console.error(err);
    return await Promise.reject("Error creating session");
  }
};

const signinAuthentication = async (req, res, db, bcrypt) => {
  try {
    const { authorization } = req.headers;

    if (authorization) {
      // Si l'en-tête d'autorisation est présent, obtenir l'ID du jeton d'authentification
      await getAuthTokenId(req, res);
    } else {
      // Si l'en-tête d'autorisation est absent, gérer la connexion
      const data = await handleSignin(req, res, db, bcrypt);
      if (data.id && data.email) {
        // Si l'utilisateur et l'email existent, créer une session
        const session = await createSessions(data);
        res.json(session);
      } else {
        // Si l'utilisateur ou l'email est manquant, rejeter avec les données
        res.status(400).json(data);
      }
    }
  } catch (error) {
    console.error("Error in signinAuthentication:", error);
    res.status(500).json("Internal Server Error");
  }
};

const getAuthTokenId = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];
    const reply = await redisClient.get(token);
    if (!reply) {
      return res.status(400).json("🚩 Unauthorized");
    }

    return res.json({ id: reply });
  } catch (error) {
    console.error("Error getting auth token ID:", error);
    return res.status(500).json("Internal Server Error");
  }
};

module.exports = {
  signinAuthentication: signinAuthentication,
  redisClient: redisClient,
};
