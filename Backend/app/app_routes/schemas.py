from pydantic import BaseModel


# Used when registering user
class UserCreate(BaseModel):
    username: str
    password: str


# Used when logging in
class UserLogin(BaseModel):
    username: str
    password: str


# Used for encoding request
class EncodeRequest(BaseModel):
    input_text: str
