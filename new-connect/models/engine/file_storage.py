import json

from models.library import Library


class Filestorage:
    # string - path to the JSON file
    __file_path = "file.json"
    # dictionary - empty but will store all objects by <class name>.id
    __objects = {}

    def all(self, cls=None):
        """returns the dictionary __objects"""
        if cls is not None:
            new_dict = {}
            for key, value in self.__objects.items():
                if cls == value.__class__ or cls == value.__class__.__name__:
                    new_dict[key] = value
            return new_dict
        return self.__objects

    def new(self, obj):
        """sets in __objects the obj with key <obj class name>.id"""
        if obj is not None:
            key = obj.__class__.__name__ + "." + obj.id
            self.__objects[key] = obj

    def close(self):
        """call reload() method for deserializing the JSON file to objects"""
        self.reload()

    def save(self):
        """serializes __objects to the JSON file (path: __file_path)"""
        json_objects = {}
        for key in self.__objects:
            if key == "password":
                json_objects[key].decode()
            json_objects[key] = self.__objects[key].to_dict(save_fs=1)
        with open(self.__file_path, 'w') as f:
            json.dump(json_objects, f)

    def reload(self):
        """deserializes the JSON file to __objects"""
        from models.base_models import Basemodels
        from models.comment import Comment
        from models.content import Content
        from models.user import User
        from models.history import History
        from models.location import Location
        from models.wrapped_session import Wrapped_Session

        classes = {"Comment": Comment,
                   "Content": Content,
                   "User": User,
                   "Location": Location,
                   "Library": Library,
                   "History": History,
                   "Wrapped_session": Wrapped_Session
                   }
        try:
            with open(self.__file_path, 'r') as f:
                jo = json.load(f)
            for key in jo:
                self.__objects[key] = classes[jo[key]["__class__"]](**jo[key])
        except:
            pass

    def delete(self, obj=None):
        """delete obj from __objects if it’s inside"""
        if obj is not None:
            key = obj.__class__.__name__ + '.' + obj.id
            if key in self.__objects:
                del self.__objects[key]

    def get(self, cls, id):
        """
        Returns the object based on the class name and its ID, or
        None if not found
        """
        from models.base_models import Basemodels
        from models.comment import Comment
        from models.content import Content
        from models.user import User
        import models
        from models.history import History
        from models.location import Location
        from models.wrapped_session import Wrapped_Session

        classes = {"Comment": Comment,
                   "Content": Content,
                   "User": User,
                   "Location": Location,
                   "Library": Library,
                   "History": History,
                   "Wrapped_session": Wrapped_Session
                   }
        if cls not in classes.values():
            return None

        all_cls = models.storage.all(cls)
        for value in all_cls.values():
            if value.id == id:
                return value

        return None

    def count(self, cls=None):
        """
        count the number of objects in storage
        """
        from models.base_models import Basemodels
        from models.comment import Comment
        from models.content import Content
        from models.user import User
        import models
        from models.history import History
        from models.location import Location
        from models.wrapped_session import Wrapped_Session

        classes = {"Comment": Comment,
                   "Content": Content,
                   "User": User,
                   "Location": Location,
                   "Library": Library,
                   "History": History,
                   "Wrapped_session": Wrapped_Session
                   }
        all_class = classes.values()

        if not cls:
            count = 0
            for clas in all_class:
                count += len(models.storage.all(clas).values())
        else:
            count = len(models.storage.all(cls).values())

        return count
