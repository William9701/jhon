""" Test .get() and .count() methods
"""
from models import storage
from models.user import User

print("All objects: {}".format(storage.count()))
print("User objects: {}".format(storage.count(User)))

first_state_id = list(storage.all(User).values())[0].id
print("First user: {}".format(storage.get(User, first_state_id)))