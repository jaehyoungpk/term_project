import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MoviePage = () => {
  const { title } = useParams(); // URL에서 영화 제목 가져오기
  const [movie, setMovie] = useState(null);
  const [newRating, setNewRating] = useState({ rating: '', review: '' }); // 새로운 평점/리뷰 상태
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/movies/details/${encodeURIComponent(title)}`);
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovie();
  }, [title]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRating({ ...newRating, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // 인증 토큰
      if (!token) {
        setMessage('You must be logged in to submit a review.');
        return;
      }
  
      const response = await axios.post(
        `http://localhost:5000/movies/details/${encodeURIComponent(title)}/rating`,
        {
          rating: newRating.rating, // 숫자로 전달
          review: newRating.review,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setMessage(response.data.message);
      setMovie(response.data.movie); // 영화 데이터 갱신
      setNewRating({ rating: '', review: '' }); // 입력 필드 초기화
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding rating');
    }
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <div>
      <h1>{movie.title}</h1>
      <p>Director: {movie.director}</p>
      <p>Genre: {movie.genre}</p>
      <p>Release Year: {movie.release_year}</p>
      <p>Country: {movie.country}</p>
      <p>Synopsis: {movie.synopsis}</p>
      <img src={movie.poster_url} alt={`${movie.title} Poster`} style={{ maxWidth: '300px' }} />
      <h2>Average Rating: {movie.average_rating}</h2>

      <h2>Reviews</h2>
      {movie.ratings.map((rating, index) => (
        <div key={index}>
          <p>Rating: {rating.rating}</p>
          <p>Review: {rating.review}</p>
        </div>
      ))}

      <h2>Add a Review</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="rating"
          placeholder="Rating (1-5)"
          value={newRating.rating}
          onChange={handleInputChange}
          min="1"
          max="5"
          required
        />
        <textarea
          name="review"
          placeholder="Write your review here"
          value={newRating.review}
          onChange={handleInputChange}
          required
        ></textarea>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MoviePage;
