const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors")
const controllers = require("./controllers/auth");
const notFound = require("./middlewares/not-found");
const errorHandler = require("./middlewares/error-handler");
const connectDB = require("./database/connect");
const isAuthenticated = require("./middlewares/authentication");

dotenv.config();

const app = express();
app.use(cors())
app.use(express.json());

app.post("/signup", controllers.signup);
app.post("/login", controllers.login);
app.get("/protected", isAuthenticated, controllers.protected);

app.use(notFound);
app.use(errorHandler);

connectDB();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`http://localhost:${port}`));
