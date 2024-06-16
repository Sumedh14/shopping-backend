const express = require('express');
const server = express();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const cookieParser = require('cookie-parser');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { User } = require('./model/User');
const { isAuth, sanitizeUser, cookieExtractor } = require('./services/common');

const productsRouter = require('./routes/Products');
const categoriesRouter = require('./routes/Category');
const brandRouter = require('./routes/Brand');
const userRouter = require('./routes/User');
const authRouter = require('./routes/Auth');
const cartRouter = require('./routes/Cart');
const ordersRouter = require('./routes/Order');

const SECRET_KEY = 'SECRET_KEY';
// JWT options
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY;

server.use(express.static('build'));
server.use(cookieParser());
server.use(
    session({
        secret: 'keyboard cat',
        resave: false, // don't save session if unmodified
        saveUninitialized: false, // don't create session until something stored
    })
);
server.use(cors({
    exposedHeaders: ['X-Total_Count']
}))
server.use(express.json());


server.use('/products', isAuth(), productsRouter.router);
server.use('/categories', isAuth(), categoriesRouter.router);
server.use('/brand', isAuth(), brandRouter.router);
server.use('/users', isAuth(), userRouter.router);
server.use('/auth', authRouter.router);
server.use('/cart', isAuth(), cartRouter.router);
server.use('/orders', isAuth(), ordersRouter.router)


// Passport Strategies
passport.use(
    { usernameField: 'email' },
    'local',
    new LocalStrategy(async function (email, password, done) {
        
        try {
            const user = await User.findOne({ email: email });
            console.log(email, password, user);
            if (!user) {
                return done(null, false, { message: 'invalid credentials' });
            }
            crypto.pbkdf2(
                password,
                user.salt,
                310000,
                32,
                'sha256',
                async function (err, hashedPassword) {
                    if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                        return done(null, false, { message: 'invalid credentials' });
                    }
                    const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
                    done(null, { id: user.id, role: user.role });
                }
            );
        } catch (err) {
            done(err);
        }
    })
);

passport.use(
    'jwt',
    new JwtStrategy(opts, async function (jwt_payload, done) {
        console.log({ jwt_payload });
        try {
            const user = await User.findById(jwt_payload.id);
            if (user) {
                return done(null, sanitizeUser(user)); // this calls serializer
            } else {
                return done(null, false);
            }
        } catch (err) {
            return done(err, false);
        }
    })
);

passport.serializeUser(function (user, cb) {
    console.log('serialize', user);
    process.nextTick(function () {
        return cb(null, { id: user.id, role: user.role });
    });
});

passport.deserializeUser(function (user, cb) {
    console.log('de-serialize', user);
    process.nextTick(function () {
        return cb(null, user);
    });
});


main().catch(err => console.log(err));

async function main () {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log('database connected');
}

server.listen(8081, () => {
    console.log('server started')
});