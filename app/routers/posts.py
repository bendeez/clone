from fastapi import APIRouter,UploadFile,File,Depends,Form
from app import models,oauth
from sqlalchemy.orm import Session
from app.database import get_db
import os
import uuid
from sqlalchemy import desc
import redis
import json
from datetime import timedelta



router = APIRouter()
redis_client = redis.Redis(host='localhost', port=6379, db=0,decode_responses=True)


@router.post("/post")
def create_post(file: UploadFile = File(None), text: str = Form(...),
                current_user: int = Depends(oauth.get_current_user), db: Session = Depends(get_db)):
    if file is not None:
        filename = str(uuid.uuid4()) + '.' + file.filename.rsplit('.', 1)[1]
        file_path = os.path.join("./test/public/files", filename)
        with open(file_path, "wb") as f:
            f.write(file.file.read())
        create_post = models.Post(user_id=current_user.id, text=text, photo=f"files/{filename}")
    else:
        create_post = models.Post(user_id=current_user.id, text=text)

    db.add(create_post)
    db.commit()
    db.refresh(create_post)
    data = {"user": f"{current_user.first_name} {current_user.last_name}", "profile": current_user.profile,
            "created": create_post.created_date.strftime("%B %d, %Y"), "text": create_post.text,
            "photo": create_post.photo, "id": create_post.id}
    redis_client.set(f"{current_user.id}-recentpost", json.dumps(data))
    redis_client.expire(f"{current_user.id}-recentpost", timedelta(hours=24))
    posts = db.query(models.Post.id, models.Post.text, models.Post.created_date, models.User.profile,
                     models.User.first_name, models.User.last_name, models.User.id, models.Post.photo).join(models.User,
                                                                                                            models.Post.user_id == models.User.id).filter(
        models.Post.user_id == current_user.id).order_by(desc(models.Post.created_date), desc(models.Post.id)).all()
    post_dict = [{"id": post[0], "text": post[1], "date": post[2].strftime("%B %d, %Y"), "profile": post[3],
                  "user": f"{post[4]} {post[5]}", "user_id": post[6], "photo": post[7]} for post in posts]
    redis_client.set(f"{current_user.id}-posts", json.dumps(post_dict))
    user = db.query(models.User).filter(models.User.id == current_user.id).first()
    user_data = {"user": {"profile": user.profile, "user": f"{user.first_name} {user.last_name}", "cover": user.cover},
                 "posts": [
                     {"date": post.created_date.strftime("%B %d, %Y"), "text": post.text, "photo": post.photo,
                      "id": post.id}
                     for post in posts]}
    redis_client.set(f"user-{current_user.id}", json.dumps(user_data))


@router.get("/recentpost")
def get_post(current_user: int = Depends(oauth.get_current_user), db: Session = Depends(get_db)):
    recent_post = redis_client.get(f"{current_user.id}-recentpost")
    if recent_post is not None:
        parsed_post = json.loads(recent_post)
        return parsed_post


@router.get("/profileposts")
def get_profile_posts(current_user: int = Depends(oauth.get_current_user), db: Session = Depends(get_db)):
    profile_posts = redis_client.get(f"{current_user.id}-posts")
    if profile_posts is None:
        posts = db.query(models.Post.id, models.Post.text, models.Post.created_date, models.User.profile,
                         models.User.first_name, models.User.last_name, models.User.id, models.Post.photo).join(
            models.User, models.Post.user_id == models.User.id).filter(models.Post.user_id == current_user.id).order_by(
            desc(models.Post.created_date), desc(models.Post.id)).all()
        post_dict = [{"id": post[0], "text": post[1], "date": post[2].strftime("%B %d, %Y"), "profile": post[3],
                      "user": f"{post[4]} {post[5]}", "user_id": post[6], "photo": post[7]} for post in posts]
        redis_client.set(f"{current_user.id}-posts", json.dumps(post_dict))
        return post_dict
    else:
        profile_posts_json = json.loads(profile_posts)
        return profile_posts_json
