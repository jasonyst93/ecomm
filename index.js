const express = require('express')
const bodyParser = require('body-parser')
const usersRepo = require('./repository/users')
const cookieSession = require('cookie-session');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cookieSession({
        keys: ['jahsdfsasklhsfd'],
    }))

app.get('/signup', (req, res) => {
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


app.post('/signup', async (req, res) => {
    const { email, password, passwordconfirmation } = req.body;
    const existingUser = await usersRepo.getOneBy({ email });
    console.log(req.body)
    if (existingUser) {
        return res.send('Email in use')
    }
    if (password !== passwordconfirmation) {
        return res.send('Password Must Match')
    }
    const user = await usersRepo.create({ email, password });
    req.session.userId = user.id;
    res.send('Account created')
})

app.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are logged out')
})

app.get('/signin', (req, res) => {
    res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <button>Sign In</button>
        </form>
    </div>
`)
})

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    const user = await usersRepo.getOneBy({ email });
    if (!user) {
        return res.send('Email not found')
    }
    const validPassword = await usersRepo.comparePassword(
        user.password,
        password
    )
    if (!validPassword) {
        return res.send('Invalid password')
    }
    req.session.userId = user.id;
    res.send('You are signed in!!!')
})

app.listen(3000, () => {
    console.log('Listening')
})

