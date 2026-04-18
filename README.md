# FastAPI Task Manager

A full-stack Task Manager application showcasing a modern Python backend (FastAPI + Clean Architecture) and a Vanilla JS frontend.
Features robust JWT authentication, comprehensive Task CRUD operations scoped per user, pagination/filtering, and complete test coverage using `pytest`.

## Project Architecture

```text
/fastapi-task-manager
│
├── /backend
│   ├── /app
│   │   ├── /api          # Routes (auth.py, tasks.py)
│   │   ├── /core         # Security (JWT, hashing), Config
│   │   ├── /models       # SQLAlchemy database models
│   │   ├── /schemas      # Pydantic models for validation
│   │   ├── /db           # Session management and database engine
│   │   └── main.py       # Application entry point
│   ├── /tests            # Pytest test suite
│   ├── .env.example
│   ├── requirements.txt
│   └── Dockerfile
│
├── /frontend             # HTML, CSS, and Vanilla JS app
└── README.md             # Setup and deployment instructions 
```

## Features
* **Backend**: FastAPI, Clean Architecture, Pydantic, SQLAlchemy (SQLite), passlib (bcrypt), python-jose (JWT).
* **Security**: JWT-based authentication. Users can only access their own tasks.
* **API Features**: Pagination (`skip`, `limit`) and filtering (`?completed=true`) for tasks.
* **Frontend**: Vanilla HTML/JS with modern glassmorphism styling. Handles JWT token management in `localStorage`.
* **Bonus**: Complete unit test suite using `pytest`.

## Setup Instructions

1. Clone the repository.
2. Ensure you have Python 3.9+ installed.
3. Navigate into the `backend` directory and set up a virtual environment:
   ```bash
   cd backend
   python -m venv .venv
   
   # Windows
   .venv\Scripts\activate
   # Linux/Mac
   source .venv/bin/activate
   ```
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Set up environment variables:
   Copy `.env.example` to `.env` inside the `backend` folder and configure your secret key.
   ```bash
   cp .env.example .env
   ```

## Running the Application Locally

From the `backend` directory, start the Uvicorn server:
```bash
uvicorn app.main:app --reload
```
The application will serve the frontend at `http://localhost:8000` and the interactive API documentation at `http://localhost:8000/docs`.

## Running Tests

This project includes a suite of unit tests. While your virtual environment is active in the `backend` directory, run:
```bash
pytest
```
This will automatically create a temporary test database, run through the authentication and task CRUD scenarios, and clean up afterwards.

## Deployment

This project includes a `Dockerfile` for easy containerization.
To run with Docker:
```bash
cd backend
docker build -t fastapi-task-manager .
docker run -p 8000:8000 --env-file .env fastapi-task-manager
```
For platforms like **Render** or **Railway**:
1. Connect your repository.
2. Set your Root Directory to `backend` (if supported) or customize your build/start commands.
3. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Ensure you set the `SECRET_KEY` environment variable in the deployment dashboard.
