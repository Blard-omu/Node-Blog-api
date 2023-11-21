// index.js
import express  from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import blogRouter from "./src/routes/blogRoutes.js";
import authRouter from "./src/routes/authRoutes.js";
import userRouter from "./src/routes/userRoutes.js";
import passport from 'passport';
import session from 'express-session';
import cors from "cors";
import "./src/controllers/socialAuth/passport.js"

const app = express();
dotenv.config();

let corsOptions = { 
  origin : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'], 
} 

// rate limit
// The blogApiLimiter mw will limit your IP address if you make 100 requests in 15min intervals

const blogsApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, 
  message: 'Too many requests from this IP, please try again later.',
});

// middleware
app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 
app.use(
  session({
    secret: process.env.GOOGLE_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/', userRouter); 
app.use('/', authRouter); 
app.use('/auth', authRouter); 
app.use('/',blogsApiLimiter, blogRouter);

// After app.use(passport.initialize()) and app.use(passport.session())
app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
    res.send(`Welcome back blogg page`);
  } else {
    res.redirect('/login'); 
  }
});




// console.log("Session secret: ", process.env.GOOGLE_SESSION_SECRET);





const port = process.env.PORT || 3000;
const dbURL = process.env.MONGODB_CONNECTION_URL;
console.log(dbURL);

// connect db
const connect = (url)=>{
    mongoose.connect(url)
    .then(() => console.log("DB Connected suceesfully!"))
    .catch((err)=>{
      console.log("Error connecting to DB", err.message);
    })
}
connect(dbURL)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});