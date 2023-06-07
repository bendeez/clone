from fastapi import APIRouter,Depends,status
from app import models,oauth
from sqlalchemy.orm import Session
from app.database import get_db
import redis
import json
from datetime import timedelta
from sqlalchemy.sql.expression import func




router = APIRouter()
redis_client = redis.Redis(host='localhost', port=6379, db=0,decode_responses=True)


@router.get("/search/{name}")
def search(name :str, current_user :int = Depends(oauth.get_current_user), db :Session = Depends(get_db)):


    users = redis_client.get(name)
    if users is None:
        full_name = func.concat(models.User.first_name, " ", models.User.last_name)
        users = db.query(models.User).filter(full_name.ilike(f"{name}%")).all()
        data = [{"id" :user.id ,"user" :f"{user.first_name} {user.last_name}"} for user in users]
        redis_client.set(name ,json.dumps(data))
        redis_client.expire(name ,timedelta(minutes=60))
        return data
    else:
        return json.loads(users)

@router.get("/user/{id}")
def get_user(id :int, db :Session = Depends(get_db), current_user :int = Depends(oauth.get_current_user)):


    user = redis_client.get(f"user-{id}")
    if user is None:
        user = db.query(models.User).filter(models.User.id == id).first()
        posts = db.query(models.Post).filter(models.Post.user_id == id).all()


        if user is not None and posts is not None:
            data =  {"user": {"profile": user.profile, "user": f"{user.first_name} {user.last_name}", "cover": user.cover
                         }, "posts": [
                    {"date": post.created_date.strftime("%B %d, %Y"), "text": post.text, "photo": post.photo,
                     "id": post.id} for post in posts]}
            print(data)
            redis_client.set(f"user-{id}", json.dumps(data))
            return data
    else:
        return json.loads(user)