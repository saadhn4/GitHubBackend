import express from "express";
import config from "config";
import "./utils/dbConnect.js";
import publicRouter from "./controllers/public/index.js";
import gistsRouter from "./controllers/gists/index.js";
import userRouter from "./controllers/user/index.js";
import reposRouter from "./controllers/repos/index.js";
import authMiddleware from "./middlewares/auth.js";
import rateLimit from "express-rate-limit";

const app = express();
app.use(express.json());
const PORT = config.get("PORT");

app.get("/", (req, res) => {
  try {
    res.status(200).json({ msg: "Hello world!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);

app.use("/api/public", publicRouter);
app.use(authMiddleware);
app.use("/api/gists", gistsRouter);
app.use("/api/users", userRouter);
app.use("/api/repos", reposRouter);

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
