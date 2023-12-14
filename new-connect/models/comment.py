import models
from models.base_models import Basemodels, Base
import sqlalchemy
from sqlalchemy import Column, String, ForeignKey, Integer
from sqlalchemy.orm import relationship


class Comment(Basemodels, Base):
    __tablename__ = 'comments'
    if models.storage_t == "db":
        user_id = Column(String(60), ForeignKey('users.id'), nullable=False)
        content_id = Column(String(60), ForeignKey('contents.id'), nullable=False)
        number_of_likes = Column(Integer, nullable=True, default=0)
        reply = Column(String(60), nullable=True)
        text = Column(String(1024), nullable=True)
        wrapped_session_id = Column(String(60), ForeignKey('wrapped_sessions.id'), nullable=True)
    else:
        user_id = ""
        number_of_likes = 0
        reply = ""
        text = ""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

