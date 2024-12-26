# 구동 환경

1. 사용 기술 스택
- **프론트엔드**:
"dependencies": {
    "@testing-library/jest-dom": "^5.14.1",
    "@testing-library/react": "^13.0.0",
    "@testing-library/user-event": "^13.2.1",
    "axios": "^1.7.9",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.1.1",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.0"
  },

- **백엔드**:
  - Node.js: v22.11.0
  "dependencies": {
    "bcrypt": "^5.1.1",
    "body-parser": "^1.20.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.9.2",
    "node-fetch": "^3.3.2"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }

- **데이터베이스**:
  - MongoDB: 8.0

2. 실행 방법
- **백엔드**:
  1. `npm install`로 필요한 패키지 설치.
  2. `node server.js` 또는 `npx nodemon server.js`로 서버 실행.
- **프론트엔드**:
  1. `cd client`로 클라이언트 디렉토리로 이동.
  2. `npm install`로 필요한 패키지 설치.
  3. `npm start`로 클라이언트 실행.

3. 주의 사항
- `.env` 파일에 필요한 환경 변수 설정:
  - `MONGO_URI`: MongoDB 연결 URI
