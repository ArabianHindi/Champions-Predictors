# Champions League Predictors - Backend

A Node.js/Express backend for the Champions League match prediction system. This API handles user authentication, match data, predictions, and leaderboard functionality.

## Features

- User authentication with JWT
- Role-based access control (Admin and Normal users)
- Real-time match data integration with football-data.org API
- Match prediction system with points calculation
- Leaderboard with Excel export functionality
- MongoDB database integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- football-data.org API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd champions-predictors
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/champions-predictors
JWT_SECRET=your_jwt_secret_key_here
FOOTBALL_API_KEY=your_football_data_api_key_here
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response:** User object and JWT token

#### Login User
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:** User object and JWT token

#### Get Current User
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** User object

### Matches

#### Get All Matches
- **GET** `/api/matches`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of match objects

#### Fetch Matches from API (Admin Only)
- **POST** `/api/matches/fetch`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Success message

#### Update Match Result (Admin Only)
- **PATCH** `/api/matches/:matchId`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "result": "HOME_WIN" | "AWAY_WIN" | "DRAW"
  }
  ```
- **Response:** Updated match object

### Predictions

#### Get User's Predictions
- **GET** `/api/predictions`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of prediction objects

#### Create/Update Prediction
- **POST** `/api/predictions/:matchId`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "prediction": "HOME_WIN" | "AWAY_WIN" | "DRAW"
  }
  ```
- **Response:** Prediction object

#### Calculate Points for Match
- **POST** `/api/predictions/calculate/:matchId`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Success message

### Leaderboard

#### Get Leaderboard
- **GET** `/api/leaderboard`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of user objects with scores

#### Export Leaderboard to Excel
- **GET** `/api/leaderboard/export`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Excel file

## Scoring System

- 3 points for correct win prediction
- 1 point for correct draw prediction
- 0 points for incorrect prediction

## Database Schema

### User
```javascript
{
  username: String,
  email: String,
  password: String,
  role: String, // 'user' or 'admin'
  totalScore: Number
}
```

### Match
```javascript
{
  matchId: String,
  homeTeam: String,
  awayTeam: String,
  matchDate: Date,
  status: String, // 'SCHEDULED', 'LIVE', 'FINISHED'
  score: {
    homeTeam: Number,
    awayTeam: Number
  },
  result: String // 'HOME_WIN', 'AWAY_WIN', 'DRAW', null
}
```

### Prediction
```javascript
{
  user: ObjectId,
  match: ObjectId,
  prediction: String, // 'HOME_WIN', 'AWAY_WIN', 'DRAW'
  points: Number,
  isLocked: Boolean
}
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses include a message:
```json
{
  "error": "Error message"
}
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Role-based access control
- Input validation
- CORS enabled

## Dependencies

- express: Web framework
- mongoose: MongoDB ODM
- jsonwebtoken: JWT authentication
- bcryptjs: Password hashing
- axios: HTTP client
- exceljs: Excel file generation
- cors: Cross-origin resource sharing
- dotenv: Environment variables

## Development

To run the server in development mode with hot reloading:
```bash
npm run dev
```

## Production

For production deployment:
1. Set appropriate environment variables
2. Build the application:
```bash
npm run build
```
3. Start the server:
```bash
npm start
```

## License

MIT 