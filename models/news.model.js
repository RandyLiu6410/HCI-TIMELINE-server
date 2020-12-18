const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const newsSchema = new Schema({
    url: {type: String, require: true},
    title: {type: String, require: true},
    source: {type: String, require: true},
    author: {type: String, require: true},
    description: {type: String, require: true},
    urlToImage: {type: String, require: true},
    publishedAt: {type: String, require: true},
    content: {type: String, require: true},
    tags: {type: [String], require: true}
    },
    { timestamps: true }
  );

const News = mongoose.model('News', newsSchema);

module.exports = News;