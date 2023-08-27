const express = require('express');
const app = express();

const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

let tmp = '';


app.use(express.json())

function save() {
    fs.writeFileSync("data.json", JSON.stringify(data))
}

app.get('/', (req, res) => {
    res.json(data.filter(d => d.deleted_at === null))
})

app.get('/tmp', (req, res) => {
    const { content } = req.body;

    if(!content) {
        res.status(400).json({
            msg: 'content가 올바르지 않음'
        })
        return;
    }

    tmp = content;

    res.json({
        rs: true,
    })
})

app.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if(isNaN(id) || data.length <= id || id < 0) {
        res.status(400).json({
            msg: '잘못된 id입니다'
        })

        return;
    }

    if(data[id].deleted_at !== null) {
        res.status(400).json({
            msg: '이미 제거된 메모입니다.'
        })
        return;
    }

    res.json(data[id])
})

app.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if(isNaN(id) || data.length <= id || id < 0) {
        res.status(400).json({
            msg: '잘못된 id입니다'
        })
        return;
    }

    if(data[id].deleted_at !== null) {
        res.status(400).json({
            msg: '이미 제거된 메모입니다.'
        })
        return;
    }

    data[id].deleted_at = Date.now();
    res.json(data[id])

    save()
})


app.delete('/', (req, res) => {

    for(const memo of data) {
        if(memo.deleted_at === null) {
            memo.deleted_at = Date.now()
        }
    }

    res.json(data)

    save()
})

app.post('/', (req, res) => {
    const { content } = req.body

    if(!content || content.length === 0) {
        res.status(400).json({
            msg: 'content가 올바르지 않습니다.'
        })
        return;
    }

    const memo = {
        content,
        created_at: Date.now(),
        updated_at: null,
        deleted_at: null,
    }

    data.push(memo)
    res.json(memo)

    save()
})

app.put('/:id', (req,res) => {
    const id = parseInt(req.params.id);
    const { content } = req.body;

    if(!content || content.length === 0) {
        res.status(400).json({
            msg: 'content가 올바르지 않습니다.'
        })
        return;
    }


    if(isNaN(id) || data.length <= id || id < 0) {
        res.status(400).json({
            msg: '잘못된 id입니다'
        })
        return;
    }

    if(data[id].deleted_at !== null) {
        res.status(400).json({
            msg: '이미 제거된 메모입니다.'
        })
        return;
    }

    data[id].updated_at = Date.now();
    data[id].content = content;

    res.json(data[id])

    save()
})


app.listen(9000, () => {
    console.log('listening......')
})