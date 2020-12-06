import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import expressSession from "express-session";
import MongoStore from "connect-mongodb-session";
import AuthRoute from "./Routes/AuthRoute/AuthRoute";
import QuestionRoute from "./Routes/QuestionRoute/Question";
dotenv.config();

const app = express();

//=====================================================Middlewares======================================================
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const mongoStore = MongoStore(expressSession);
const mongoURI = process.env.mongoURI;
const store = new mongoStore({
  collection: "usersessions",
  uri: mongoURI,
  expires: 10 * 60 * 60 * 24 * 1000,
});

app.use(
  expressSession({
    name: "_sid",
    secret: process.env.session_secret,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 10 * 60 * 60 * 24 * 1000,
      sameSite: false,
    },
  })
);

//=========================================================MongoDB Connection & Configs=================================
const mongoDB_connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};
mongoose.connect(mongoURI, mongoDB_connectionOptions, (error) => {
  if (error) {
    return console.error(error);
  }

  console.log("Connection to MongoDB was successful");
});

//=========================================================Server EndPoints=============================================
app.use(AuthRoute);
app.use(QuestionRoute);

//=========================================================Server Connection & Configs==================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
