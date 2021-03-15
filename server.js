const express = require('express');

const app = express();

app.all('/', (req, res)=> {
    res.send('Your bot is alive!')
})
PORT = process.env.PORT || 3000;
let  keepAlive = () => {
    app.listen(PORT, () => {
        console.log("Server is Ready!")
    });
}

module.exports = keepAlive;