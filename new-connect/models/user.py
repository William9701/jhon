from hashlib import md5

from models.base_models import Basemodels, Base
import sqlalchemy
from sqlalchemy import Column, String, ForeignKey, Integer
import models
from models.content import Content
from models.comment import Comment
from sqlalchemy.orm import relationship, Session
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()


class User(Basemodels, Base):
    __tablename__ = 'users'
    if models.storage_t == "db":

        email = Column(String(128), unique=True, nullable=False)
        username = Column(String(128), unique=True, nullable=False)
        password = Column(String(128), nullable=False)
        first_name = Column(String(128), nullable=False)
        last_name = Column(String(128), nullable=False)
        location = Column(String(128), nullable=False)
        description = Column(String(1024), nullable=False)
        contents = relationship("Content", backref="user", cascade="all, delete, delete-orphan")
        comments = relationship("Comment", backref="user", cascade="all, delete, delete-orphan")
    else:
        first_name = ""
        last_name = ""
        email = ""
        password = ""
        location = ""
        description = ""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __setattr__(self, name, value):
        """sets a password with md5 encryption"""
        if name == "password":
            value = bcrypt.generate_password_hash(value).decode('utf-8')
        if name == "username":
            value = f"@{value}"
        super().__setattr__(name, value)



