#!/usr/bin/python3
""" This is the content class """
from models.base_models import Basemodels, Base
import sqlalchemy
from sqlalchemy import Column, String, ForeignKey, Integer
import models
from sqlalchemy.orm import relationship
from models.comment import Comment


class Content(Basemodels, Base):
    __tablename__ = 'contents'
    if models.storage_t == "db":
        user_id = Column(String(60), ForeignKey('users.id'), nullable=False)
        location_id = Column(String(60), ForeignKey('locations.id', ondelete='CASCADE'), nullable=True)
        content = Column(String(128), nullable=False)  # This will store the path to the video file
        description = Column(String(255), nullable=True)
        number_of_likes = Column(Integer, default=0)
        number_of_dislikes = Column(Integer, default=0)
        number_of_views = Column(Integer, default=0)
        comments = relationship("Comment", backref="content", cascade="all, delete, delete-orphan")

    else:
        user_id = ""
        content = ""
        comment = ""
        number_of_likes = 0
        number_of_dislikes = 0
        number_of_views = 0

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
