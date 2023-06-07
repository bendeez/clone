from jose import jwt,JWTError
from fastapi.security import OAuth2PasswordBearer
from app import database, models
from fastapi import Depends,status,HTTPException
from sqlalchemy.orm import Session
from app import schemas



SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"



oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def create_access_token(data: dict):
    to_encode = data.copy()


    encoded_jwt = jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)

    return encoded_jwt






def get_current_user(token:str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    try:

        payload = jwt.decode(token, SECRET_KEY, ALGORITHM)
        id = payload.get("user_id")

        if id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

        token_data = schemas.Token(id=id)


        user = db.query(models.User).filter(models.User.id == token_data.id).first()
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        return user
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)



