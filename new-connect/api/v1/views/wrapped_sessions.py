#!/usr/bin/python3
""" objects that handle all default RestFul API actions for wrapped_sessions """
from models.wrapped_session import Wrapped_Session
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
from flasgger.utils import swag_from


@app_views.route('/wrapped_sessions', methods=['GET'], strict_slashes=False)
@swag_from('documentation/wrapped_session/get_wrapped_session.yml', methods=['GET'])
def get_wrapped_sessions():
    """
    Retrieves the list of all wrapped_session objects
    """
    all_wrapped_sessions = storage.all(Wrapped_Session).values()
    list_wrapped_sessions = []
    for wrapped_session in all_wrapped_sessions:
        list_wrapped_sessions.append(wrapped_session.to_dict())
    return jsonify(list_wrapped_sessions)


@app_views.route('/wrapped_sessions/<wrapped_session_id>', methods=['GET'], strict_slashes=False)
@swag_from('documentation/wrapped_session/get_id_wrapped_session.yml', methods=['get'])
def get_wrapped_session(wrapped_session_id):
    """ Retrieves a specific wrapped_session """
    wrapped_session = storage.get(Wrapped_Session, wrapped_session_id)
    if not wrapped_session:
        abort(404)

    return jsonify(wrapped_session.to_dict())


@app_views.route('/wrapped_sessions/<wrapped_session_id>', methods=['DELETE'],
                 strict_slashes=False)
@swag_from('documentation/wrapped_session/delete_wrapped_session.yml', methods=['DELETE'])
def delete_wrapped_session(wrapped_session_id):
    """
    Deletes a wrapped_session Object
    """

    wrapped_session = storage.get(Wrapped_Session, wrapped_session_id)

    if not wrapped_session:
        abort(404)

    storage.delete(wrapped_session)
    storage.save()

    return make_response(jsonify({}), 200)


@app_views.route('/wrapped_sessions', methods=['POST'], strict_slashes=False)
@swag_from('documentation/wrapped_session/post_wrapped_session.yml', methods=['POST'])
def post_wrapped_session():
    """
    Creates a wrapped_session
    """
    if not request.get_json():
        abort(400, description="Not a JSON")

    data = request.get_json()
    instance = Wrapped_Session(**data)
    instance.save()
    return make_response(jsonify(instance.to_dict()), 201)


@app_views.route('/wrapped_sessions/<wrapped_session_id>', methods=['PUT'], strict_slashes=False)
@swag_from('documentation/wrapped_session/put_wrapped_session.yml', methods=['PUT'])
def put_wrapped_session(wrapped_session_id):
    """
    Updates a wrapped_session
    """
    wrapped_session = storage.get(Wrapped_Session, wrapped_session_id)

    if not wrapped_session:
        abort(404)

    if not request.get_json():
        abort(400, description="Not a JSON")

    ignore = ['id', 'created_at', 'updated_at']

    data = request.get_json()
    for key, value in data.items():
        if key not in ignore:
            setattr(wrapped_session, key, value)
    storage.save()
    return make_response(jsonify(wrapped_session.to_dict()), 200)
