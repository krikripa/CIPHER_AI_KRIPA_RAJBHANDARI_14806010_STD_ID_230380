from pydantic import BaseModel
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class HistoryCreate(BaseModel):
    username: str
    input_text: str
    output_text: str
    method: str
    mode: str
