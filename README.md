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
<img width="1866" height="948" alt="Screenshot 2026-04-18 221134" src="https://github.com/user-attachments/assets/80fabe69-d73a-43eb-9775-b91464662a79" />
<img width="1866" height="950" alt="Screenshot 2026-04-18 221103" src="https://github.com/user-attachments/assets/f7ea2fba-c5fb-428d-8cb3-ee54de2355ec" />

