const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

app.use(bodyParser.json())

const readData = fileName => {
    let data = fs.readFileSync(fileName)
    data = data.toString()
    return data
}

router.get('/songs', (req, res) => {
    try {
        const dataSongs = JSON.parse(readData('songs.txt'))
        if (!dataSongs) {
            res.send('no data Songs')
        }
        res.send(dataSongs)
    } catch (error) {
        console.log(error);
        res.send('Error!')
    }
})



router.get('/songs/:songId', (req, res) => {
    try {
        const data = JSON.parse(readData('songs.txt'))
        const songId = data.filter(song => song.id == req.params.songId)
        res.send(songId)
    } catch (error) {
        console.log(error);
        res.send("Error!")
    }
})


router.post('/songs', (req, res) => {
    try {
        const check = fs.existsSync('./songs.txt')
        if (check == true) {
            fs.readFile("songs.txt", function (err, data) {
                if (data.length == 0) {
                    const randomId = uuidv4() // đặt bên trong hàm route để chạy lại random
                    if (!req.body.author || !req.body.singer) {
                        res.send(" Nhập author và singer đi thằng ngu!")
                    }
                    const data = [{
                        id: randomId,
                        author: req.body.author,
                        singer: req.body.singer
                    }]
                    fs.writeFileSync('songs.txt', JSON.stringify(data))
                    res.send(data)

                } else {
                    const data = JSON.parse(readData('songs.txt'))
                    const randomId = uuidv4()
                    if (!req.body.author || !req.body.singer) {
                        res.send(" Nhập author và singer đi thằng ngu!")
                    }
                    const newUser = {
                        id: randomId,
                        author: req.body.author,
                        singer: req.body.singer
                    }
                    data.push(newUser)
                    fs.writeFileSync('songs.txt', JSON.stringify(data))
                    res.send(data)
                }
            })
        }

        else if (check == false) {
            const openFile = fs.openSync('songs.txt', 'w')
            const randomId = uuidv4() // đặt bên trong hàm route để chạy lại random
            if (!req.body.author || !req.body.singer) {
                res.send(" Nhập author và singer đi thằng ngu!")
            }
            const data = [{
                id: randomId,
                author: req.body.author,
                singer: req.body.singer
            }]
            fs.writeFileSync('songs.txt', JSON.stringify(data))
            fs.closeSync(openFile)
            res.send(data)
        }


    }
    catch (error) {
        console.log(error);
        res.send("Error!")
    }
})

router.patch('/songs/:songId', (req, res) => {
    try {
        const data = JSON.parse(readData('songs.txt'))
        const songId = data.findIndex(song => song.id == req.params.songId) // FindIndex trả về index trong mảng của ID cần tìm
        data[songId] =  // thay đổi Object tại Index trong mảng có sẵn
        {
            ...data[songId],
            author: req.body.author,
            singer: req.body.singer
        }

        fs.writeFileSync('songs.txt', JSON.stringify(data))

        res.send(data)

    } catch (error) {
        console.log(error);
        res.send("Error!")
    }
})


router.delete('/songs/:songId', (req, res) => {
    try {
        const data = JSON.parse(readData('songs.txt'))
        const songId = data.findIndex(song => song.id == req.params.songId)
        if (songId == -1) {
            res.send('No User Found!')
        }

        data.splice(songId, 1)
        fs.writeFileSync('songs.txt', JSON.stringify(data))
        res.send(data)

    } catch (error) {
        console.log(error);
        res.send("Error!")
    }
})




module.exports = router