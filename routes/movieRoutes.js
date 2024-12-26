const express = require('express');
const router = express.Router();
const Movie = require('../models/Movies');

// 1. 모든 영화 가져오기
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find(); // 모든 영화 데이터 가져오기
    res.json(movies); // JSON 형식으로 응답
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
});


// 2. 영화 검색
router.post('/search', async (req, res) => {
  const { query, minYear, maxYear } = req.body;

  try {
    // 동적 쿼리 생성
    const searchQuery = {};

    if (query) {
      searchQuery.$or = [
        { title: { $regex: query, $options: 'i' } }, // 제목 검색
        { director: { $regex: query, $options: 'i' } }, // 감독 검색
        { actors: { $regex: query, $options: 'i' } }, // 배우 검색
        { genre: { $regex: query, $options: 'i' } }, // 장르 검색
        { keywords: { $regex: query, $options: 'i' } }, // 키워드 검색
        { country: { $regex: query, $options: 'i' } }, // 국가 검색
      ];
    }

    if (minYear || maxYear) {
      searchQuery.release_year = {};
      if (minYear) searchQuery.release_year.$gte = parseInt(minYear); // 최소 연도
      if (maxYear) searchQuery.release_year.$lte = parseInt(maxYear); // 최대 연도
    }

    // 쿼리를 실행해 결과 반환
    const movies = await Movie.find(searchQuery);
    console.log(movies);
    res.json(movies);
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

//자동완성기능
router.get('/autocomplete', async (req, res) => {
  const { query } = req.query;

  try {
    if (!query) return res.json([]); // 빈 검색어일 경우 빈 배열 반환

    const movies = await Movie.find(
      {
        $or: [
          { title: { $regex: query, $options: 'i' } }, // 제목 검색
          { director: { $regex: query, $options: 'i' } }, // 감독 검색
          { actors: { $regex: query, $options: 'i' } }, // 배우 검색
        ],
      },
      { title: 1, director: 1, actors: 1 } // 필요한 필드만 반환
    ).limit(10);

    // 매칭된 필드를 식별
    const suggestions = movies.flatMap((movie) => {
      const matches = [];
      if (movie.title.match(new RegExp(query, 'i'))) {
        matches.push({ type: 'Title', value: movie.title });
      }
      if (movie.director.match(new RegExp(query, 'i'))) {
        matches.push({ type: 'Director', value: movie.director });
      }
      if (movie.actors.some((actor) => actor.match(new RegExp(query, 'i')))) {
        movie.actors.forEach((actor) => {
          if (actor.match(new RegExp(query, 'i'))) {
            matches.push({ type: 'Actor', value: actor });
          }
        });
      }
      return matches;
    });

    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
});



// 3. 특정 영화 상세정보 가져오기
router.get('/details/:title', async (req, res) => {
  const { title } = req.params;

  try {
    // 영화 제목으로 검색 (대소문자 구분 없이 정확히 일치)
    const movie = await Movie.findOne({ title: { $regex: `^${title}$`, $options: 'i' } });

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    console.error('Error fetching movie by title:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

// 4. 리뷰 추가
router.post('/details/:title/rating', async (req, res) => {
  const { title } = req.params;
  const { rating, review } = req.body;

  try {
    const movie = await Movie.findOne({ title: { $regex: `^${title}$`, $options: 'i' } });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // 새로운 리뷰 추가
    const newRating = {
      rating, // 숫자로 변환
      review,
    };
    movie.ratings.push(newRating);

    // 평균 평점 갱신
    const totalRatings = movie.ratings.reduce((sum, r) => sum + r.rating, 0);
    movie.average_rating = (totalRatings / movie.ratings.length).toFixed(1);

    await movie.save();
    res.status(201).json({ message: 'Rating added successfully', movie });
  } catch (error) {
    console.error('Error adding rating:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
