from fastapi import APIRouter,Depends
from app import models,oauth
from sqlalchemy.orm import Session
from app.database import get_db
from sqlalchemy import desc
import redis
import json
from app.schemas import Comment




router = APIRouter()
redis_client = redis.Redis(host='localhost', port=6379, db=0,decode_responses=True)


@router.post("/comment/{id}")
def post_comment(id: int, comment: Comment, current_user: int = Depends(oauth.get_current_user),
                 db: Session = Depends(get_db)):
    comment = models.Comment(text=comment.text, post_id=id, user_id=current_user.id)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    comments = db.query(models.Comment.text, models.Comment.created_date, models.User.first_name, models.User.last_name,
                        models.User.profile).join(models.User, models.User.id == models.Comment.user_id).filter(
        models.Comment.post_id == id).order_by(desc(models.Comment.id)).all()
    comments_dict = [
        {"text": comment[0], "date": comment[1].strftime("%B %d, %Y"), "user": f"{comment[2]} {comment[3]}",
         "profile": comment[4]} for comment in comments]
    redis_client.set(f"{id}-comments", json.dumps(comments_dict))
    get_comments = redis_client.get(f"{id}-comments")
    return json.loads(get_comments)


@router.get("/comments/{id}")
def get_comments(id: int, current_user: int = Depends(oauth.get_current_user), db: Session = Depends(get_db)):
    comments = redis_client.get(f"{id}-comments")
    if comments is None:
        comments = db.query(models.Comment.text, models.Comment.created_date, models.User.first_name,
                            models.User.last_name, models.User.profile).join(models.User,
                                                                             models.User.id == models.Comment.user_id).filter(
            models.Comment.post_id == id).order_by(desc(models.Comment.id)).all()
        if comments:
            comments_dict = [
                {"text": comment[0], "date": comment[1].strftime("%B %d, %Y"), "user": f"{comment[2]} {comment[3]}",
                 "profile": comment[4]} for comment in comments]
            redis_client.set(f"{id}-comments", json.dumps(comments_dict))
            return comments_dict
    else:
        return json.loads(comments)
