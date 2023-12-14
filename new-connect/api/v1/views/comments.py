#!/usr/bin/python3
""" objects that handles all default RestFul API actions for comment """
from models.comment import Comment
from models.content import Content
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
from flasgger.utils import swag_from


@app_views.route('/contents/<content_id>/comment', methods=['GET'],
                 strict_slashes=False)
@swag_from('documentation/comment/comment_by_content.yml', methods=['GET'])
def get_comments(content_id):
    """
    Retrieves the list of all comment objects
    of a specific content, or a specific comment
    """
    list_comment = []
    content = storage.get(Content, content_id)
    if not content:
        abort(404)
    for comment in content.comments:
        list_comment.append(comment.to_dict())

    return jsonify(list_comment)


@app_views.route('/comment/<comment_id>/', methods=['GET'], strict_slashes=False)
@swag_from('documentation/comment/get_comment.yml', methods=['GET'])
def get_comment(comment_id):
    """
    Retrieves a specific comment based on id
    """
    comment = storage.get(Comment, comment_id)
    if not comment:
        abort(404)
    return jsonify(comment.to_dict())


@app_views.route('/comment/<comment_id>', methods=['DELETE'], strict_slashes=False)
@swag_from('documentation/comment/delete_comment.yml', methods=['DELETE'])
def delete_comment(comment_id):
    """
    Deletes a comment based on id provided
    """
    comment = storage.get(Comment, comment_id)

    if not comment:
        abort(404)
    storage.delete(comment)
    storage.save()

    return make_response(jsonify({}), 200)


@app_views.route('/contents/<content_id>/comment', methods=['POST'],
                 strict_slashes=False)
@swag_from('documentation/comment/post_comment.yml', methods=['POST'])
def post_comment(content_id):
    """
    Creates a comment
    """
    content = storage.get(Content, content_id)
    if not content:
        abort(404)
    if not request.get_json():
        abort(400, description="Not a JSON")

    if 'user_id' not in request.get_json():
        abort(400, description="Missing user_id")

    data = request.get_json()
    instance = Comment(**data)
    instance.content_id = content.id
    instance.save()
    return make_response(jsonify(instance.to_dict()), 201)


@app_views.route('/comment/<comment_id>', methods=['PUT'], strict_slashes=False)
@swag_from('documentation/comment/put_comment.yml', methods=['PUT'])
def put_comment(comment_id):
    """
    Updates a comment
    """
    comment = storage.get(Comment, comment_id)
    if not comment:
        abort(404)

    if not request.get_json():
        abort(400, description="Not a JSON")

    ignore = ['id', 'content_id', 'created_at', 'updated_at']

    data = request.get_json()
    for key, value in data.items():
        if key not in ignore:
            setattr(comment, key, value)
    storage.save()
    return make_response(jsonify(comment.to_dict()), 200)
