#!/usr/bin/python3
"""This is the history class"""
import models
from models.base_models import Basemodels, Base
import sqlalchemy
from sqlalchemy import Column, String, ForeignKey


class History(Basemodels, Base):
    __tablename__ = "history"
    if models.storage_t == "db":
        user_id = Column(String(60), ForeignKey('users.id'), nullable=False)
        content_id = Column(String(60), ForeignKey('contents.id'), nullable=False)
    else:
        user_id = ""
        content_id = ""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
