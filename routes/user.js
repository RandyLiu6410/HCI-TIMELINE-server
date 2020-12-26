const router = require('express').Router();
const e = require('express');
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
        if(result.followtags.filter(tag => tag.tag === req.query.tag).length === 0)
        {
            User.update(
                { _id: result._id }, 
                { $push: { followtags: {
                    tag: req.query.tag,
                    followtime: new Date()
                } } },
                () => {
                    res.status(200);
                    res.json('Tag is added.');
                }
            );
        }
        else{
            res.status(200);
            res.json('Tag exists.');
        }
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

router.route('/followtags').delete((req, res) => {
    User.findOne({username: req.query.username})
    .then((result) => {
        if(result.followtags.filter(tag => tag.tag === req.query.tag).length === 0) {
            res.status(400);
            res.json('Tag does not exist.');
        }
        else {
            User.update(
                { _id: result._id }, 
                { $pull: { followtags: {
                    tag: req.query.tag,
                } } },
                {safe: true, multi: true},
                () => {
                    res.status(200);
                    res.json('Tag is deleted.');
                }
            );
        }
    })
    .catch((err) => {
        res.status(400);
        res.json(err);
    })
});

router.route('/checkfollow').get((req, res) => {
    User.findOne({username: req.query.username})
    .then((result) => {
        res.status(200);
        res.json(result.followtags.filter(follow => follow.tag === req.query.tag).length > 0);
    })
    .catch((err) => {
        res.status(400);
        res.json(err);
    })
});

router.route('/customtags').post((req, res) => {
    User.findOne({username: req.query.username})
    .then((result) => {
        if(result.customtags.filter(tag => tag.tag === req.query.tag).length === 0)
        {
            User.update(
                { _id: result._id }, 
                { $push: { customtags: {
                    tag: req.query.tag,
                    followtime: new Date()
                } } },
                () => {
                    res.status(200);
                    res.json('Tag is added.');
                }
            );
        }
        else{
            res.status(200);
            res.json('Tag is added.');
        }
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
        if(!result.history.includes(req.query.url))
        {
            User.update(
                { _id: result._id }, 
                { $push: { history: req.query.url } },
                () => {
                    res.status(200);
                    res.json('History is added.');
                }
            );
        }
        else{
            res.status(200);
            res.json('History is added.');
        }
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

router.route('/searchhistory').post((req, res) => {
    User.findOne({username: req.query.username})
    .then((result) => {
        if(req.query.tag)
        {
            if(!result.tagsearchhistory.includes(req.query.tag))
            {
                User.update(
                    { _id: result._id }, 
                    { $push: { tagsearchhistory: req.query.tag } },
                    () => {
                        res.status(200);
                        res.json('History is added.');
                    }
                );
            }
            else{
                res.status(200);
                res.json('History exists.');
            }
        }
        else if(req.query.keyword)
        {
            if(!result.keywordsearchhistory.includes(req.query.keyword))
            {
                User.update(
                    { _id: result._id }, 
                    { $push: { keywordsearchhistory: req.query.keyword } },
                    () => {
                        res.status(200);
                        res.json('History is added.');
                    }
                );
            }
            else{
                res.status(200);
                res.json('History exists.');
            }
        }
        else
        {
            res.status(400);
            res.json('Lack of variables.');
        }
    })
    .catch((err) => {
        res.status(400);
        res.json(err);
    })
});

router.route('/searchhistory').get((req, res) => {
    User.findOne({username: req.query.username})
    .then((result) => {
        res.status(200);
        res.json({
            tags: result.tagsearchhistory,
            keywords: result.keywordsearchhistory
        });
    })
    .catch((err) => {
        res.status(400);
        res.json(err);
    })
});

module.exports = router;