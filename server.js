const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// 환경 변수 로드
dotenv.config();

// MongoDB 연결
connectDB();

// Express 앱 초기화
const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 라우트 설정
app.use('/movies', require('./routes/movieRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/images', express.static(path.join(__dirname, 'poster')));

// 포트 설정 및 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
