import express from 'express';
import Account from '../models/account';

const router = express.Router();

/*
    회원가입
    ACCOUNT SIGNUP: POST /api/account/signup
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: BAD USERNAME
        2: BAD PASSWORD
        3: USERNAME EXISTS
*/
router.post('/signup', (req, res) => {
    // Check Username Format
    let usernameRegex = /^[a-z0-9]+$/;

    if(!usernameRegex.test(req.body.username)) {
        return res.status(400).json({
            error: 'BAD USERNAME',
            code: 1
        });
    }

    // Check Password Length
    if(req.body.password.length < 4 || typeof req.body.password !== "string") {
        return res.status(400).json({
            error: 'BAD PASSWORD',
            code: 2
        });
    }

    // Check Username Existance
    Account.findOne({ username: req.body.username }, (err, exists) => {
        if(err) throw err;
        if(exists){
            return res.status(400).json({
                error: 'USERNAME EXISTS',
                code: 3
            });
        }

        // CREATE ACCOUNT
        let account = new Account({
            username: req.body.username,
            password: req.body.password
        });

        account.password = account.generateHash(account.password);

        // SAVE IN THE DATABASE
        account.save( err => {
            if(err) throw err;
            return res.json({
                success: true
            });
        });
    })
});

/*
    로그인
    ACCOUNT SIGNIN: POST /api/account/signin
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: LOGIN FAILED
*/
router.post('/signin', (req, res) => {


    if(typeof req.body.password !== 'string') {
        return res.status(401).json({
            error: "LOGIN FAILED",
            code: 1
        });
    }

    // FIND THE USER BY USERNAME
    Account.findOne({ username: req.body.username }, (err, account) => {
        if(err) throw err;

        // CHECK ACCOUNT EXISTANCY
        if(!account) {
            console.log("===== 해당 계정이 없다 =====");
            return res.status(401).json({
                error: "LOGIN FAILED",
                code: 1
            });
        }

        // CHECK WHETHER THE PASSWORD IS VALID
        if(!account.validateHash(req.body.password)) {
            return res.status(401).json({
                error: "LOGIN FAILED",
                code: 1
            });
        }

        // ALTER SESSION
        let session = req.session;
        session.loginInfo = {
            _id: account._id,
            username: account.username
        };

        // RETURN SUCCESS
        return res.json({
            success: true
        });
    });
});

/*
    세션확인 구현
    :로그인 시 로그인 데이터를 쿠키에 담고 사용하다
    새로고침시 다시 랜더링할 때 쿠키 유효 확인
    GET CURRENT USER INFO GET /api/account/getInfo
*/
router.get('/getinfo', (req, res) => {
    if(typeof req.session.loginInfo === "undefined") {
        return res.status(401).json({
            error: 1
        });
    }
    res.json({ info: req.session.loginInfo });
});

/*
    LOGOUT: POST /api/account/logout
*/
router.post('/logout', (req, res) => {
    req.session.destroy(err => { if(err) throw err; });
    return res.json({ success: true });
})

/*
    사용자 검색 API
    Search USER: GET /api/account/search/:username
*/
router.get('/search/:username', (req, res) => {
    // SEARCH USERNAMES THAT STARTS WITH GIVEN KEYWORD USING REGEX
    // username으로 시작하는 사용자 5개를 검색해 _id는 제외하고 username만 보여준다
    var re = new RegExp('^' + req.params.username);
    Account.find({username: {$regex: re}}, {_id: false, username: true})
            .limit(5)
            .sort({username: 1})
            .exec((err, accounts) => {
                if(err) throw err;
                return res.json(accounts);
            });
});

// EMPTY SEARCH REQUEST: GET /api/account/search
router.get('/search', (req, res) => {
    res.json([]);
})

export default router;