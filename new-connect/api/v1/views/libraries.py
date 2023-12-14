#!/usr/bin/python3
""" objects that handle all default RestFul API actions for libraries """
from models.library import Library
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
from flasgger.utils import swag_from


@app_views.route('/libraries', methods=['GET'], strict_slashes=False)
@swag_from('documentation/library/get_library.yml', methods=['GET'])
def get_libraries():
    """
    Retrieves the list of all library objects
    """
    all_libraries = storage.all(Library).values()
    list_libraries = []
    for library in all_libraries:
        list_libraries.append(library.to_dict())
    return jsonify(list_libraries)


@app_views.route('/libraries/<library_id>', methods=['GET'], strict_slashes=False)
@swag_from('documentation/library/get_id_library.yml', methods=['get'])
def get_library(library_id):
    """ Retrieves a specific library """
    library = storage.get(Library, library_id)
    if not library:
        abort(404)

    return jsonify(library.to_dict())


@app_views.route('/libraries/<library_id>', methods=['DELETE'],
                 strict_slashes=False)
@swag_from('documentation/library/delete_library.yml', methods=['DELETE'])
def delete_library(library_id):
    """
    Deletes a library Object
    """

    library = storage.get(Library, library_id)

    if not library:
        abort(404)

    storage.delete(library)
    storage.save()

    return make_response(jsonify({}), 200)


@app_views.route('/libraries', methods=['POST'], strict_slashes=False)
@swag_from('documentation/library/post_library.yml', methods=['POST'])
def post_library():
    """
    Creates a library
    """
    if not request.get_json():
        abort(400, description="Not a JSON")

    data = request.get_json()
    instance = Library(**data)
    instance.save()
    return make_response(jsonify(instance.to_dict()), 201)


@app_views.route('/libraries/<library_id>', methods=['PUT'], strict_slashes=False)
@swag_from('documentation/library/put_library.yml', methods=['PUT'])
def put_library(library_id):
    """
    Updates a library
    """
    library = storage.get(Library, library_id)

    if not library:
        abort(404)

    if not request.get_json():
        abort(400, description="Not a JSON")

    ignore = ['id', 'created_at', 'updated_at']

    data = request.get_json()
    for key, value in data.items():
        if key not in ignore:
            setattr(library, key, value)
    storage.save()
    return make_response(jsonify(library.to_dict()), 200)
