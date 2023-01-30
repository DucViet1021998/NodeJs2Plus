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




router.get('/users', (req, res) => {
    try {
        const dataUsers = JSON.parse(readData('users.txt'))
        if (!dataUsers) {
            res.send('no data')
        }
        res.send(dataUsers)
    } catch (error) {
        console.log(error);
        res.send('Error!')
    }
})



router.get('/users/:userId', (req, res) => {
    try {
        const data = JSON.parse(readData('users.txt'))
        const userId = data.filter(user => user.id == req.params.userId)
        res.send(userId)
    } catch (error) {
        console.log(error);
        res.send("Error!")
    }
})


router.post('/users', (req, res) => {
    try {
        const check = fs.existsSync('./users.txt')
        if (check == true) {
            fs.readFile("users.txt", function (err, data) {
                if (data.length == 0) {
                    const randomId = uuidv4() // đặt bên trong hàm route để chạy lại random
                    if (!req.body.name || !req.body.address) {
                        res.send(" Nhập name và address đi thằng ngu!")
                    }
                    const data = [{
                        id: randomId,
                        name: req.body.name,
                        address: req.body.address
                    }]
                    fs.writeFileSync('users.txt', JSON.stringify(data))
                    res.send(data)

                } else {
                    const data = JSON.parse(readData('users.txt'))
                    const randomId = uuidv4()
                    if (!req.body.name || !req.body.address) {
                        res.send(" Nhập name và address đi thằng ngu!")
                    }
                    const newUser = {
                        id: randomId,
                        name: req.body.name,
                        address: req.body.address
                    }
                    data.push(newUser)
                    fs.writeFileSync('users.txt', JSON.stringify(data))
                    res.send(data)
                }
            })
        }

        else if (check == false) {
            const openFile = fs.openSync('users.txt', 'w')
            const randomId = uuidv4() // đặt bên trong hàm route để chạy lại random
            if (!req.body.name || !req.body.address) {
                res.send(" Nhập name và address đi thằng ngu!")
            }
            const data = [{
                id: randomId,
                name: req.body.name,
                address: req.body.address
            }]
            fs.writeFileSync('users.txt', JSON.stringify(data))
            fs.closeSync(openFile)
            res.send(data)
        }


    }
    catch (error) {
        console.log(error);
        res.send("Error!")
    }
})

router.patch('/users/:userId', (req, res) => {
    try {
        const data = JSON.parse(readData('users.txt'))
        const userId = data.findIndex(user => user.id == req.params.userId) // FindIndex trả về index trong mảng của ID cần tìm
        data[userId] =  // thay đổi Object tại Index trong mảng có sẵn
        {
            ...data[userId],
            name: req.body.name,
            address: req.body.address
        }

        fs.writeFileSync('users.txt', JSON.stringify(data))

        res.send(data)

    } catch (error) {
        console.log(error);
        res.send("Error!")
    }
})


router.delete('/users/:userId', (req, res) => {
    try {
        const data = JSON.parse(readData('users.txt'))
        const userId = data.findIndex(user => user.id == req.params.userId)
        if (userId == -1) {
            res.send('No User Found!')
        }

        data.splice(userId, 1)
        fs.writeFileSync('users.txt', JSON.stringify(data))
        res.send(data)

    } catch (error) {
        console.log(error);
        res.send("Error!")
    }
})




module.exports = router