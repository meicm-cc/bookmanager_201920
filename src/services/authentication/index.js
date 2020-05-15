const express = require('express');
const cors = require('cors')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const mongo = require('./database.js');

const SERVICE_PORT = process.env.SERVICE_PORT || 10000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';


const start = async () => {
    const app = express();
    const mongoElements = await mongo.connect();

    passport.use(new passportLocal((username, password, done) => {
        const users = mongoElements.db.collection('users');
        users.findOne({ username: username }, (err, user) => {
            if (err) return done(err);
            if (!user) return done(null, false);
            if (!bcrypt.compareSync(password, user.password)) return done(null, false);
            return done(null, user);
        });
    }));

    app.use(cors())
    app.use(passport.initialize());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.post('/api/signin', passport.authenticate('local', { session: false }), async (request, response) => {
        let user = request.user;
        user.token = jwt.sign({ userID: user._id }, JWT_SECRET);
        await mongo.updateUser(mongoElements.db, user);
        return response.send({ token: user.token });
    });


    app.listen(SERVICE_PORT, () => console.log(`Book Manager API listening on port ${SERVICE_PORT}`));
}
start();

