const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

app.use(express.urlencoded({ extended: true }));

function createCSRFToken() {
  return Math.random().toString().slice(2);
}

let token = createCSRFToken();

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.setHeader('Set-Cookie', `csrfToken=${token}`);

  res.send(`
    <title>😇 GOOD</title>

    <form target='_blank' action='/' method='post'>
      <label>
        Tell me your secrets:
        <input type="text" name="secret" id="secret"/>
        <input type="hidden" name="csrf-token" value="${token}"/>
      </label>
      <input type="submit" value="Send"/>
      <input type="button" value="Send async" onclick="send()"/>
    </form>

    <script>
      function send() {
        fetch('/', {
          method: 'post',
          body: 'secret=' + secret.value + '&csrf-token=' + document.cookie.match(/csrfToken=(\\d+)/)[1],
          headers: { 'Content-Type': 'application/x-www-form-urlencoded'  }
        })
        .then(res => res.text())
        .then(alert);
      }
    </script>
  `);
})

app.post('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.body['csrf-token'] !== token) {
    console.log();
    res.send('You cant fool me!');
    return;
  }

  console.log('I know that', req.body.secret);

  res.send('I see. <script>setTimeout(() => window.close(), 3000)</script>')
})

app.listen(port, () => {
  console.log(`GOOD app listening at http://localhost:${port}`)
})
