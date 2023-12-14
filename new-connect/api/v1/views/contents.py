#!/usr/bin/python3
""" objects that handle all default RestFul API actions for contents """
from models.content import Content
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
from flasgger.utils import swag_from


@app_views.route('/contents', methods=['GET'], strict_slashes=False)
@swag_from('documentation/content/get_content.yml', methods=['GET'])
def get_contents():
    """
    Retrieves the list of all content objects
    """
    all_contents = storage.all(Content).values()
    list_contents = []
    for content in all_contents:
        list_contents.append(content.to_dict())
    return jsonify(list_contents)


@app_views.route('/contents/<content_id>', methods=['GET'], strict_slashes=False)
@swag_from('documentation/content/get_id_content.yml', methods=['get'])
def get_content(content_id):
    """ Retrieves a specific content """
    content = storage.get(Content, content_id)
    if not content:
        abort(404)

    return jsonify(content.to_dict())


@app_views.route('/contents/<content_id>', methods=['DELETE'],
                 strict_slashes=False)
@swag_from('documentation/content/delete_content.yml', methods=['DELETE'])
def delete_content(content_id):
    """
    Deletes a content Object
    """

    content = storage.get(Content, content_id)

    if not content:
        abort(404)

    storage.delete(content)
    storage.save()

    return make_response(jsonify({}), 200)


@app_views.route('/contents', methods=['POST'], strict_slashes=False)
@swag_from('documentation/content/post_content.yml', methods=['POST'])
def post_content():
    """
    Creates a content
    """
    if not request.get_json():
        abort(400, description="Not a JSON")

    data = request.get_json()
    instance = Content(**data)
    instance.save()
    return make_response(jsonify(instance.to_dict()), 201)


@app_views.route('/contents/<content_id>', methods=['PUT'], strict_slashes=False)
@swag_from('documentation/content/put_content.yml', methods=['PUT'])
def put_content(content_id):
    """
    Updates a content
    """
    content = storage.get(Content, content_id)

    if not content:
        abort(404)

    if not request.get_json():
        abort(400, description="Not a JSON")

    ignore = ['id', 'created_at', 'updated_at']

    data = request.get_json()
    for key, value in data.items():
        if key not in ignore:
            setattr(content, key, value)
    storage.save()
    return make_response(jsonify(content.to_dict()), 200)
