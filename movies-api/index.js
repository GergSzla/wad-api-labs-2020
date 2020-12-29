import dotenv from 'dotenv';
import express from 'express';
import moviesRouter from './api/movies';
app.use('/api/users', usersRouter);
import bodyParser from 'body-parser';
import './db';
import { loadUsers, loadMovies } from './seedData'
import usersRouter from './api/users';
import session from 'express-session';
import passport from './authenticate';

dotenv.config();
const errHandler = (err, req, res, next) => {
  /* if the error in development then send stack trace to display whole error,
  if it's in production then just send error message  */
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).send(`Something went wrong!`);
  }
  res.status(500).send(`Hey!! You caught the error 👍👍, ${err.stack} `);
};
const app = express();
app.use(passport.initialize());​
app.use('/api/movies', passport.authenticate('jwt', {session: false}), moviesRouter);

if (process.env.SEED_DB) {
  loadUsers();
  loadMovies();
}

app.use(session({
  secret: 'ilikecake',
  resave: true,
  saveUninitialized: true
}));

const port = process.env.PORT;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.static('public'));
app.use('/api/movies', moviesRouter);
app.use(errHandler);
app.listen(port, () => {
  console.info(`Server running at ${port}`);
});

