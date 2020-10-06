import express from 'express';
import expressRateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';

const app = express();

app.use(expressRateLimit({ 
  windowMs: 2000 * 60,
  max: 5,
 }));

app.use(compression({ level: 9 }));

app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
    ].join(' ');
  }),
);

let user = {
  name: 'Alex',
  modified: new Date()
}

app.param('name', (req, res, next, name) => {
  req.name = name;
  next()
});

app.param('text', (req, res, next, text) => {
  req.text = text;
  next();
})

app.get('/user', (req, res) => {
  res.append('Last-Modified', user.modified.toDateString())
  res.json(user)
});

app.get('/test/:text', (req, res) => {
  const repeatReverseText = req.text.split('').reverse().join('').repeat(1000)
  res.send(repeatReverseText);
})

app.get('test1/:text', (req, res) => {
  const stats = req.text
    .split('')
    .reduce((acc, curr) => {
      acc[curr]
        ? (acc[curr] += 1)
        : (acc[curr] = 1);
      return acc;
    }, {});
    res.send(stats);
})

app.put('user/:name', (req, res) => {
  user.name = req.name;
  user.modified = new Date()
  res.append('Last-Modified', user.modified.toDateString())
  res.json(user)
})

app.listen(3010, () => {
  console.log('Listening on 3010')
})