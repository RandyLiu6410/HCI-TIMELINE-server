const router = require('express').Router();
const fetch = require("node-fetch");
let User = require('../models/user.model');

router.route('/').post((req, res) => {
    const newUser = new User({
        username: req.query.username,
        password: req.query.password,
        followtags: [],
        customtags: [],
        history: []
    });

    User.findOne({username: req.query.username})
    .then((result) => {
        if(result)
        {
            res.status(400);
            res.json('User exists');
        }
        else
        {
            newUser.save()
            .then(() => {
                res.status(200);
                res.json('Sign up successfully.');
            })
            .catch((err) => {
                res.status(400);
                res.json(err);
            });
        }
    })
    .catch((err) => {
        res.status(400);
        res.json(err);
    })
});

router.route('/login').post((req, res) => {
    User.findOne({username: req.query.username})
    .then((result) => {
        if(result && result.password === req.query.password)
        {
            res.status(200);
            res.json('authorized');
        }
        else if(result && result.password !== req.query.password)
        {
            res.status(401);
            res.json('Password is not correct.');
        }
        else
        {
            res.status(400);
            res.json('User doesn\'t exist');
        }
    })
    .catch((err) => {
        res.status(400);
        res.json(err);
    })
});

router.route('/followtags').post((req, res) => {
    User.findOne({username: req.query.username})
    .then((result) => {
        User.update(
            { _id: result._id }, 
            { $push: { followtags: req.query.tag } },
            () => {
                res.status(200);
                res.json('Tag is added.');
            }
        );
    })
    .catch((err) => {
        res.status(400);
        res.json(err);
    })
});

router.route('/followtags').get((req, res) => {
    User.findOne({username: req.query.username})
    .then((result) => {
        res.status(200);
        res.json(result.followtags);
    })
    .catch((err) => {
        res.status(400);
        res.json(err);
    })
});

router.route('/customtags').post((req, res) => {
    User.findOne({username: req.query.username})
    .then((result) => {
        User.update(
            { _id: result._id }, 
            { $push: { customtags: req.query.tag } },
            () => {
                res.status(200);
                res.json('Tag is added.');
            }
        );
    })
    .catch((err) => {
        res.status(400);
        res.json(err);
    })
});

router.route('/customtags').get((req, res) => {
    User.findOne({username: req.query.username})
    .then((result) => {
        res.status(200);
        res.json(result.customtags);
    })
    .catch((err) => {
        res.status(400);
        res.json(err);
    })
});

router.route('/history').post((req, res) => {
    User.findOne({username: req.query.username})
    .then((result) => {
        User.update(
            { _id: result._id }, 
            { $push: { history: req.query.url } },
            () => {
                res.status(200);
                res.json('History is added.');
            }
        );
    })
    .catch((err) => {
        res.status(400);
        res.json(err);
    })
});

router.route('/history').get((req, res) => {
    User.findOne({username: req.query.username})
    .then((result) => {
        res.status(200);
        res.json(result.history);
    })
    .catch((err) => {
        res.status(400);
        res.json(err);
    })
});

module.exports = router;