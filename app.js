import express from 'express';
import expressRateLimit from 'express-rate-limit';

const app = express();

app.use(expressRateLimit({ 
  windowMs: 2000 * 60,
  max: 5,
 }));

let user = {
  name: 'Alex',
  modified: new Date()
}

app.param('name', (req, res, next, name) => {
  req.name = name;
  next()
})

app.get('/user', (req, res) => {
  res.append('Last-Modified', user.modified.toDateString())
  res.json(user)
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