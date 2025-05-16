
class Settings:
    def __init__(self):
        self.PROJECT_NAME = "lol"
        self.PROJECT_DESCRIPTION = "lol"
        self.PROJECT_VERSION = "0.1.0"
        self.CORS_ORIGINS = [
            "http://localhost:3000",
            "https://localhost:3000",
            "http://localhost:5000",
            "https://localhost:5000",
            "http://localhost:5173",
            "https://localhost:5173"
        ]

        

settings = Settings()