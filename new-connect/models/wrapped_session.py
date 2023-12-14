#!/usr/bin/python3
""" This is the wrapped session class """
from sqlalchemy.orm import relationship

import models
from models.base_models import Basemodels, Base
from models.content import Content
from sqlalchemy import Column, DateTime, String, ForeignKey, Integer
from datetime import datetime


class Wrapped_Session(Basemodels, Base):
    __tablename__ = "wrapped_sessions"
    if models.storage_t == "db":
        wrapped_time = Column(DateTime, default=datetime.utcnow)
        user_id = Column(String(60), ForeignKey('users.id'), nullable=False)
        location_id = Column(String(60), ForeignKey('locations.id'), nullable=False)
        content = Column(String(128), nullable=False)  # This will store the path to the video file
        number_of_likes = Column(Integer, default=0)
        number_of_dislikes = Column(Integer, default=0)
        number_of_views = Column(Integer, default=0)
        comments = relationship("Comment", backref="wrapped_session", cascade="all, delete, delete-orphan")
    else:
        wrapped_time = ""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
