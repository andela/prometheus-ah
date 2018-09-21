import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import errorhandler from 'errorhandler';
import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import passport from 'passport';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import Socket from './server/utils/socket';
import swaggerSpec from './server/utils/swagger';
import routes from './server/routes';
import './server/database/config/passport';


dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// Create global app objects
const app = express();
const server = http.Server(app);
const io = socketIo(server);

Socket.connect(io);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.use(cors());

// initial passport for persistent session
app.use(passport.initialize());
// Normal express config defaults
app.use(require('morgan')('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(require('method-override')());

app.use(express.static(`${__dirname}/'public'`));

if (!isProduction) {
  app.use(errorhandler());
}

app.use(routes);

if (!isProduction) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
// catch 404 and forward to error handler

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace

if (!isProduction) {
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    // eslint-disable-next-line no-console
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}

// production error handler
// no stacktraces leaked to user
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

// finally, let's start our server...
server.listen(process.env.PORT || 3000, () => {
  // eslint-disable-next-line no-console
  console.log(`'Listening on port '${server.address().port}`);
});

export default app;
