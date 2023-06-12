const express = require('express')
const bodyParser = require('body-parser')
const usersRepo = require('./repository/users')

const app = express();

app.use(bodyParser.urlencoded({ extended: true })); //every handler auto apply

app.get('/', (req, res) => {
    res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <input name="passwordconfirmation" placeholder="password confirmation" />
            <button>Sign Up</button>
        </form>
    </div>
`)
});


app.post('/', async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;
    const existingUser = await usersRepo.getOneBy({ email });
    //1
    if (existingUser) {
        return res.send('Email in use')
    }
    //2
    if (password !== passwordConfirmation) {
        return res.send('Password Must Match')
    }
    res.send('Account created')
})


app.listen(3000, () => {
    console.log('Listening')
})

