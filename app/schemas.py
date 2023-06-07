from pydantic import BaseModel


class User(BaseModel):
    first_name:str
    last_name:str
    email:str
    password:str

class Login(BaseModel):
    email:str
    password:str


class Token(BaseModel):
    id:int
class Comment(BaseModel):
    text:str