from fastapi import FastAPI,Depends
from app import models,oauth
from app.database import engine,get_db
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import redis
import json
from .routers import comments,friends,get_user,posts,user


app = FastAPI()
redis_client = redis.Redis(host='localhost', port=6379, db=0,decode_responses=True)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(comments.router)
app.include_router(friends.router)
app.include_router(get_user.router)
app.include_router(posts.router)
app.include_router(user.router)
models.Base.metadata.create_all(bind=engine)


@app.get("/")
def home(current_user:int = Depends(oauth.get_current_user), db:Session = Depends(get_db)):
    

    account = redis_client.get(f"{current_user.id}-account")

    if account is None:
        user = db.query(models.User).filter(models.User.id == current_user.id).first()
        data = {"first_name":user.first_name,"last_name":user.last_name,"profile":user.profile,"cover":user.cover}
        redis_client.set(f"{user.id}-account",json.dumps(data))


        return user

    else:

        return json.loads(account)









