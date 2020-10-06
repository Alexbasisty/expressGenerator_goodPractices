import express from 'express';
import expressRateLimit from 'express-rate-limit';
import compression from 'compression';

const app = express();

app.use(expressRateLimit({ 
  windowMs: 2000 * 60,
  max: 5,
 }));

app.use(compression({ level: 9 }));

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

app.put('user/:name', (req, res) => {
  user.name = req.name;
  user.modified = new Date()
  res.append('Last-Modified', user.modified.toDateString())
  res.json(user)
})

app.listen(3010, () => {
  console.log('Listening on 3010')
})