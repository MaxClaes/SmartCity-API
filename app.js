const Router = require('./route');
const express = require('express')
const app = express()
const port = 3001

app.use(express.json());
app.use(Router);

app.get('/', (req, res) => {
    res.send('Hello tout le monde !');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
