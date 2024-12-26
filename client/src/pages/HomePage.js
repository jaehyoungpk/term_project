import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [query, setQuery] = useState(''); // 기본 검색어 상태
  const [filters, setFilters] = useState({ minYear: '', maxYear: '' }); // 개봉 연도 필터 상태
  const [showFilters, setShowFilters] = useState(false); // 세부 검색 필드 표시 여부
  const [suggestions, setSuggestions] = useState([]); // 자동 완성 상태
  const [movies, setMovies] = useState([]); // 검색 결과 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태

  useEffect(() => {
    // 로그인 상태 확인
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    // JWT 토큰 삭제
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  // 기본 검색어 입력 처리
  const handleQueryChange = async (e) => {
    const queryText = e.target.value;
    setQuery(queryText);

    if (queryText.length > 0) {
      try {
        const response = await axios.get('http://localhost:5000/movies/autocomplete', {
          params: { query: queryText },
        });
        setSuggestions(response.data); // 자동 완성 결과 저장
      } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);
      }
    } else {
      setSuggestions([]); // 검색어가 없을 경우 비우기
    }
  };

  // 드롭다운 항목 선택
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.value); // 선택한 항목으로 검색창 채우기
    setSuggestions([]); // 드롭다운 닫기
  };

  // 세부 필터 입력 처리
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // 검색 버튼 클릭
  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:5000/movies/search', {
        query,
        minYear: filters.minYear,
        maxYear: filters.maxYear,
      });
      setMovies(response.data); // 검색 결과 저장
    } catch (error) {
      console.error('Error searching movies:', error);
    }
  };

  // 세부 검색 필드 표시/숨기기
  const toggleFilters = () => {
    setShowFilters((prevShow) => !prevShow);
  };

  return (
    <div>
      <h1>Movie Search</h1>

      <div>
        {isLoggedIn ? (
          <button onClick={handleLogout} style={{ marginRight: '10px' }}>Logout</button>
        ) : (
          <>
            <Link to="/register" style={{ marginRight: '10px' }}>Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>

      {/* 기본 검색창 */}
      <input
        type="text"
        placeholder="Search by title, director, or actor"
        value={query}
        onChange={handleQueryChange} // 검색어 입력 처리
      />

      {/* 자동 완성 드롭다운 */}
      {suggestions.length > 0 && (
        <ul style={{ border: '1px solid #ccc', padding: '0', maxHeight: '150px', overflowY: 'auto' }}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              style={{ cursor: 'pointer', padding: '5px', listStyleType: 'none' }}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <strong>{suggestion.type}:</strong> {suggestion.value}
            </li>
          ))}
        </ul>
      )}

      {/* 세부 검색 필드 토글 버튼 */}
      <button onClick={toggleFilters}>
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {/* 세부 검색 필드 (토글 상태에 따라 표시) */}
      {showFilters && (
        <div>
          <input
            type="number"
            name="minYear"
            placeholder="Min Year"
            value={filters.minYear}
            onChange={handleFilterChange} // 최소 연도 입력 처리
          />
          <input
            type="number"
            name="maxYear"
            placeholder="Max Year"
            value={filters.maxYear}
            onChange={handleFilterChange} // 최대 연도 입력 처리
          />
        </div>
      )}

      {/* 검색 버튼 */}
      <button onClick={handleSearch}>Search</button>

      {/* 검색 결과 */}
      {movies.length > 0 && (
        <ul>
          {movies.map((movie) => (
            <li key={movie._id}>
            <h2>{movie.title}</h2>
            <p>Director: {movie.director}</p>
            <p>Genre: {movie.genre}</p>
            <p>Release Year: {movie.release_year}</p>
            {/* `_id`를 URL에 포함 */}
            <Link to={`/movies/details/${encodeURIComponent(movie.title)}`}>View Details</Link>
            </li>
        ))}
        </ul>
      )}

      {movies.length === 0 && <p>No movies found. Please refine your search.</p>}
    </div>
  );
};

export default HomePage;
