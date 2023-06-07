from fastapi import APIRouter,Depends,HTTPException,status
from app import models,oauth
from sqlalchemy.orm import Session
from app.database import get_db
import redis
import json
from sqlalchemy import or_


router = APIRouter()
redis_client = redis.Redis(host='localhost', port=6379, db=0,decode_responses=True)



@router.get("/notification")
def notification(db :Session = Depends(get_db), current_user :int = Depends(oauth.get_current_user)):


    posts = db.query(models.Post.id).filter(models.Post.user_id == current_user.id).all()
    post_list = [post.id for post in posts]
    comment_list = []
    for id in post_list:
        comments = redis_client.get(f"{id}-comments")
        if comments is not None:
            comments_json = json.loads(comments)
            for comment in comments_json:
                comment_list.append(comment)


    return comment_list

@router.post("/request/{id}")
def send_request(id :int, db :Session = Depends(get_db), current_user :int = Depends(oauth.get_current_user)):


    already_request = db.query(models.FriendRequest).filter(models.FriendRequest.sender == current_user.id,
                                                            models.FriendRequest.getter == id).first()

    if already_request:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT)
    else:
        if current_user.id == id:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT)
        friend_request = models.FriendRequest(sender=current_user.id, getter=id)
        db.add(friend_request)
        db.commit()
        friend_requests = db.query(models.FriendRequest.sender, models.User.profile, models.User.first_name,
                                   models.User.last_name).join(models.User,
                                                               models.User.id == models.FriendRequest.sender).filter(
            models.FriendRequest.getter == id).all()
        data = [{"id" :friend_request.sender ,"profile" :friend_request.profile
                 ,"user" :f"{friend_request.first_name} {friend_request.last_name}"} for friend_request in friend_requests]
        redis_client.set(f"{id}-friendrequests" ,json.dumps(data))

@router.get("/friendrequests")
def get_friendrequests(db :Session = Depends(get_db), current_user :int = Depends(oauth.get_current_user)):


    friend_requests = redis_client.get(f"{current_user.id}-friendrequests")
    if friend_requests is not None:
        return json.loads(friend_requests)

@router.post("/acceptfriendrequest/{id}")
def accept_friendrequest(id :int, db :Session = Depends(get_db), current_user :int = Depends(oauth.get_current_user)):


    new_friend = models.Friend(sender=id, getter=current_user.id)
    db.add(new_friend)
    db.commit()
    already_request = db.query(models.FriendRequest).filter(models.FriendRequest.sender == id,
                                                            models.FriendRequest.getter == current_user.id).first()

    db.delete(already_request)
    friend_requests = db.query(models.FriendRequest.id, models.User.profile, models.User.first_name,
                               models.User.last_name).join(models.User,
                                                           models.User.id == models.FriendRequest.sender).filter(
        models.FriendRequest.getter == id).all()
    data = [{"id": friend_request.id, "profile": friend_request.profile,
             "user": f"{friend_request.first_name} {friend_request.last_name}"} for friend_request in friend_requests]
    redis_client.set(f"{id}-friendrequests", json.dumps(data))
    redis_client.set(f"{current_user.id}-friendrequests" ,json.dumps(data))

@router.delete("/acceptfriendrequest/{id}")
def deletefriendrequest(id :int, db :Session = Depends(get_db), current_user :int = Depends(oauth.get_current_user)):


    already_request = db.query(models.FriendRequest).filter(models.FriendRequest.sender == id,
                                                                models.FriendRequest.getter == current_user.id, ).first()
    if already_request is not None:
        db.delete(already_request)
    friend_requests = db.query(models.FriendRequest.id, models.User.profile, models.User.first_name,
                               models.User.last_name).join(models.User,
                                                           models.User.id == models.FriendRequest.sender).filter(
        models.FriendRequest.getter == id).all()
    data = [{"id": friend_request.id, "profile": friend_request.profile,
             "user": f"{friend_request.first_name} {friend_request.last_name}"} for friend_request in friend_requests]
    redis_client.set(f"{id}-friendrequests", json.dumps(data))
    redis_client.set(f"{current_user.id}-friendrequests", json.dumps(data))
@router.get("/friends")
def get_friends(db :Session = Depends(get_db), current_user :int = Depends(oauth.get_current_user)):


    friends = db.query(models.Friend, models.User.id, models.User.profile, models.User.first_name,
                       models.User.last_name).join(models.User, models.User.id != current_user.id).filter(or_(
        models.Friend.getter == current_user.id, models.Friend.sender == current_user.id)).all()

    data = [{"user" :f"{friend.first_name} {friend.last_name}" ,"profile" :friend.profile ,"id" :friend.id} for friend in friends]
    return data
