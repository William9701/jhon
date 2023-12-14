#!/usr/bin/python3
"""This is the history class"""
import models
from models.base_models import Basemodels, Base
import sqlalchemy
from sqlalchemy import Column, String, ForeignKey


class Library(Basemodels, Base):
    __tablename__ = "library"
    if models.storage_t == "db":
        user_id = Column(String(60), ForeignKey('users.id'), nullable=False)
        content = Column(String(128), nullable=False)
        description = Column(String(255), nullable=True)
    else:
        user_id = ""
        content = ""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)