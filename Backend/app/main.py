from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .app_routes import auth_routes, history_routes
from .app_routes import auth_routes, history_routes, pki_routes
from .database import engine
from . import models

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(history_routes.router)
app.include_router(pki_routes.router)
models.Base.metadata.create_all(bind=engine)

