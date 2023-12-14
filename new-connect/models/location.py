#!/usr/bin/python3
""" This is the location class"""
from models.base_models import Basemodels, Base
import sqlalchemy
from sqlalchemy import Column, String, ForeignKey, Integer, Float
import models
from sqlalchemy.orm import relationship
from models.content import Content


class Location(Basemodels, Base):
    __tablename__ = "locations"
    if models.storage_t == "db":
        user_id = Column(String(60), ForeignKey('users.id'), nullable=False)
        content_id = Column(String(60), ForeignKey('contents.id'), nullable=False)
        name = Column(String(128), nullable=False)
        latitude = Column(Float, nullable=True)
        longitude = Column(Float, nullable=True)
        contents = relationship("Content", backref="location", foreign_keys="[Content.location_id]")

        def __setattr__(self, name, value):
            """sets a password with md5 encryption"""
            if name == "name":
                value = value.lower()
            super().__setattr__(name, value)
    else:
        user_id = ""
        content_id = ""
        name = ""
        latitude = ""
        longitude = ""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
