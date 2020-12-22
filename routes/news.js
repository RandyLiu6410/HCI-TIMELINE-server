const router = require('express').Router();
const fetch = require("node-fetch");
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEYS);
let News = require('../models/news.model');
let User = require('../models/user.model');

const keywords = ['Biden', 'Trump', 'COVID-19', 'Vaccines', 'Senate', 'Coronavirus', 'Trade Deal', 'Thai protest',
                  'Protester', 'Supreme Court', 'Top Court', 'Arms Sale', 'Marine', 'Pfizer', 'Quarantine', 'Person of The Year',
                  'North Korea', 'Russia', 'China', 'F-16 Pilot', 'Google', 'Facebook', 'Oracle', 'Chinese Spy',
                  'Andrew Yang', 'Cuba', 'Stay-at-home', 'Prince William', 'Hong Kong', 'Russian Spy', 'Texas',
                  'White House', 'Mexico', 'Covid Shaming'];

// router.route('/').post((req, res) => {
//   const newNews = new News(req.body);

//   newNews.save()
//   .then(() => res.json('News added!'))
//   .catch(err => res.status(400).json('Error: ' + err));
// });

router.route('/addtag/').post((req, res) => {
    keywords.map(async k => {
        await newsapi.v2.everything({
            q: k,
            pageSize: 100
        })
        .then(result => {
            result.articles.map(async a => {
                await News.findOne({url: a.url}).exec().then(
                    r => {
                        if(!r)
                        {
                            const newNews = new News({
                                ...a,
                                tags: [k],
                                source: a.source.name
                            });
    
                            newNews.save()
                            .then(() => console.log('News added!'))
                            .catch(err => console.log('Error: ' + err));
                        }
                        else{
                            if(!r.tags.includes(k))
                            {
                                News.update(
                                    { _id: r._id }, 
                                    { $push: { tags: k } },
                                    () => console.log('News updated!')
                                );
                            }
                        }
                    }
                )
                .catch((err) => console.log(err))
            })
        })
        // .then(() => res.json('News added!'))
        // .catch(err => res.status(400).json('Error: ' + err))
    })
});

router.route('/').get((req, res) => {
    if(req.query.url)
    {
        News.findOne({url: req.query.url})
        .then(news => res.json(news))
        .catch(err => res.status(400).json('Error: ' + err));
    }
    else{
        News.find().sort({'publishedAt': req.query.sort}).skip(parseInt(req.query.startIndex)).limit(parseInt(req.query.limit))
        .then(news => res.json(news))
        .catch(err => res.status(400).json('Error: ' + err));
    }
});

router.route('/tag/').get((req, res) => {
    News.find({ tags: { $in: req.query.tag }}).sort({'publishedAt': req.query.sort}).skip(parseInt(req.query.startIndex)).limit(parseInt(req.query.limit))
    .then(news => res.json(news))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/taglist/').get((req, res) => {
    res.json(keywords);
});

router.route('/following/').get((req, res) => {
    User.findOne({username: req.query.username})
    .then((result) => {
        const tags = result.followtags.map(t => t.tag);
        News.find({ tags: { $in: tags }}).sort({'publishedAt': req.query.sort}).skip(parseInt(req.query.startIndex)).limit(parseInt(req.query.limit))
        .then(news => res.json(news))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch((err) => {
        res.status(400);
        res.json(err);
    })
});

router.route('/keywords/').get((req, res) => {
    if(req.query.keyWord)
    {
        News.find({
            $or: [ { title : { $regex: req.query.keyWord, $options: 'i' }}, { description: { $regex: req.query.keyWord, $options: 'i' }}, { content: { $regex: req.query.keyWord, $options: 'i' }} ]
        }).sort({'publishedAt': req.query.sort}).skip(parseInt(req.query.startIndex)).limit(parseInt(req.query.limit))
        .then(news => res.json(news))
        .catch(err => res.status(400).json('Error: ' + err));
    }else{
        res.json(keywords);
    }
});

router.route('/').delete((req, res) => {
    News.findByIdAndDelete(req.query.id)
    .then(() => res.json('News deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/').put((req, res) => {
    News.findById(req.query.id)
    .then(news => {
        News.findByIdAndUpdate(news.id, req.body)
        .then(() => res.json('News updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;