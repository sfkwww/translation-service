# translation-service

# Setup
- Start MongoDB
- Add port and mongoDB URI to .env
- Run npm i
- Run npm scripts build & start

# Endpoints
- GET /
  - Query Params: id (language string), key (translation key)
  - Returns: The translation if found, otherwise an error.
- POST /
  - Body: id (language string), key(translation key), translation
  - Returns: The inserted translation object if successful, otherwise an error.