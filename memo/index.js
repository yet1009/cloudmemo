const express = require('express');
const app = express();

const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));


function save() {
    fs.writeFileSync("data.json", JSON.stringify(data))
}

app.get('/', (req, res) => {
    res.json(data)
})


app.listen(9000, () => {
    console.log('listening......')
})