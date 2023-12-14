from models.base_models import Basemodels, Base
from models.comment import Comment
from models.content import Content
from models.history import History
from models.location import Location
from models.library import Library
from models.user import User
import models
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from os import getenv
from dotenv import load_dotenv

from models.wrapped_session import Wrapped_Session

load_dotenv()

classes = {"Comment": Comment,
           "Content": Content,
           "User": User,
           "Location": Location,
           "Library": Library,
           "History": History,
           "Wrapped_session": Wrapped_Session
           }


class DBStorage:
    """interaacts with the MySQL database"""
    __engine = None
    __session = None

    def __init__(self):

        """Instantiate a DBStorage object"""
        Connect_MYSQL_USER = getenv('Connect_MYSQL_USER')
        Connect_MYSQL_PWD = getenv('Connect_MYSQL_PWD')
        Connect_MYSQL_HOST = getenv('Connect_MYSQL_HOST')
        Connect_MYSQL_DB = getenv('Connect_MYSQL_DB')
        Connect_ENV = getenv('Connect_ENV')
        self.__engine = create_engine('mysql+mysqldb://{}:{}@{}/{}'.
                                      format(Connect_MYSQL_USER,
                                             Connect_MYSQL_PWD,
                                             Connect_MYSQL_HOST,
                                             Connect_MYSQL_DB))
        if Connect_ENV == "test":
            Base.metadata.drop_all(self.__engine)
        
        

    def all(self, cls=None):
        """query on the current database session"""
        new_dict = {}
        for clss in classes:
            if cls is None or cls is classes[clss] or cls is clss:
                objs = self.__session.query(classes[clss]).all()
                for obj in objs:
                    key = obj.__class__.__name__ + '.' + obj.id
                    new_dict[key] = obj
        return new_dict

    def new(self, obj):
        """add the object to the current database session"""
        self.__session.add(obj)

    def save(self):
        """commit all changes of the current database session"""
        self.__session.commit()

    def close(self):
        """call remove() method on the private session attribute"""
        self.__session.remove()

    def delete(self, obj=None):
        """delete from the current database session obj if not None"""
        if obj is not None:
            self.__session.delete(obj)
    def rollback(self):
        """ Roll back a session"""
        self.__session.rollback()

    def reload(self):
        """reloads data from the database"""
        Base.metadata.create_all(self.__engine)
        sess_factory = sessionmaker(bind=self.__engine, expire_on_commit=False)
        Session = scoped_session(sess_factory)
        self.__session = Session



    def get(self, cls, id):
        """
        Returns the object based on the class name and its ID, or
        None if not found
        """
        if cls not in classes.values():
            return None

        all_cls = models.storage.all(cls)
        for value in all_cls.values():
            if value.id == id:
                return value

        return None

    def get_by_name(self, cls, name):
        """
        Returns the object based on the class name and attribute "name", or
        None if not found
        """
        if cls not in classes.values():
            return None

        list = []
        all_cls = models.storage.all(cls)
        for value in all_cls.values():
            if value.name == name.lower():
                list.append(value)

        return list

    def count(self, cls=None):
        """
        count the number of objects in storage
        """
        all_class = classes.values()

        if not cls:
            count = 0
            for clas in all_class:
                count += len(models.storage.all(clas).values())
        else:
            count = len(models.storage.all(cls).values())

        return count
