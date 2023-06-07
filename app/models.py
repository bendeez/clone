from sqlalchemy import Column, ForeignKey, Integer, String,Date
from app.database import Base
import datetime


class User(Base):
    __tablename__ = "user"
    id = Column(Integer,primary_key=True)
    first_name = Column(String,nullable=False)
    last_name = Column(String,nullable=False)
    password = Column(String, nullable=False)
    email = Column(String, nullable=False)
    profile = Column(String,default="img.png")
    cover = Column(String,default="none")

class Post(Base):
    __tablename__ = "post"
    id = Column(Integer,primary_key=True)
    text = Column(String,nullable=False)
    created_date = Column(Date,default=datetime.datetime.now())
    user_id = Column(ForeignKey("user.id",ondelete="CASCADE"))
    photo = Column(String,default="none")
class Comment(Base):
    __tablename__ = "comment"
    id = Column(Integer,primary_key=True)
    text = Column(String, nullable=False)
    created_date = Column(Date, default=datetime.datetime.now())
    user_id = Column(ForeignKey("user.id", ondelete="CASCADE"))
    post_id = Column(ForeignKey("post.id",ondelete="CASCADE"))

class Friend(Base):
    __tablename__ = "friend"
    id = Column(Integer,primary_key=True)
    sender = Column(ForeignKey("user.id", ondelete="CASCADE"))
    getter = Column(ForeignKey("user.id", ondelete="CASCADE"))
class FriendRequest(Base):
    __tablename__ = "friendrequest"
    id = Column(Integer,primary_key=True)
    sender = Column(ForeignKey("user.id", ondelete="CASCADE"))
    getter = Column(ForeignKey("user.id", ondelete="CASCADE"))
