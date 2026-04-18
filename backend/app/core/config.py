from pydantic import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = "change_me_in_production_so_this_is_not_empty"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATABASE_URL: str = "sqlite:///./taskmanager.db"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
