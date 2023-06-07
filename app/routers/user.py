from fastapi import APIRouter,UploadFile,File,Depends,Form
from app import models,utils,oauth
from sqlalchemy.orm import Session
from app.database import get_db
import os
import uuid
import redis
import json
from app.schemas import User,Login




router = APIRouter()
redis_client = redis.Redis(host='localhost', port=6379, db=0,decode_responses=True)




@router.post("/user")
def create_user(user:User,db:Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        return "email already exists"
    password = utils.hash(user.password)
    user = models.User(password=password, email=user.email, first_name=user.first_name, last_name=user.last_name)
    db.add(user)
    db.commit()


@router.post("/login")
def login(login:Login,db:Session = Depends(get_db)):
    user = db.query(models.User).filter(login.email == models.User.email).first()
    if not user:
        return "user does not exist"
    verify = utils.verify(login.password, user.password)
    if not verify:
        return "password is incorrect"
    access_token = oauth.create_access_token(data={"user_id":user.id})
    return {"token":access_token}


@router.put("/profile")
def change_profile(file: UploadFile = File(...), current_user: int = Depends(oauth.get_current_user),
                   db: Session = Depends(get_db)):
    filename = str(uuid.uuid4()) + '.' + file.filename.rsplit('.', 1)[1]
    file_path = os.path.join("./test/public/files", filename)
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    user = db.query(models.User).filter(models.User.id == current_user.id).first()
    user.profile = f"files/{filename}"
    db.commit()
    data = {"first_name": user.first_name, "last_name": user.last_name, "profile": user.profile, "cover": user.cover}
    redis_client.set(f"{user.id}-account", json.dumps(data))


@router.put("/cover")
def change_profile(file: UploadFile = File(...), current_user: int = Depends(oauth.get_current_user),
                   db: Session = Depends(get_db)):
    filename = str(uuid.uuid4()) + '.' + file.filename.rsplit('.', 1)[1]
    file_path = os.path.join("./test/public/files", filename)
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    user = db.query(models.User).filter(models.User.id == current_user.id).first()
    user.cover = f"files/{filename}"
    db.commit()
    data = {"first_name": user.first_name, "last_name": user.last_name, "profile": user.profile, "cover": user.cover}
    redis_client.set(f"{user.id}-account", json.dumps(data))
