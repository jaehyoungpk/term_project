const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  review: { type: String },
});

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  director: { type: String },
  actors: { type: [String] },
  genre: { type: String },
  release_year: { type: Number },
  country: { type: String },
  poster_url: { type: String },
  synopsis: { type: String },
  keywords: { type: [String] },
  average_rating: { type: Number, default: 0 },
  ratings: [RatingSchema],
});

module.exports = mongoose.model('Movie', MovieSchema, 'movies');
