#!/usr/bin/python3
""" objects that handle all default RestFul API actions for histories """
from models.history import History
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
from flasgger.utils import swag_from


@app_views.route('/histories', methods=['GET'], strict_slashes=False)
@swag_from('documentation/history/get_history.yml', methods=['GET'])
def get_histories():
    """
    Retrieves the list of all history objects
    """
    all_histories = storage.all(History).values()
    list_histories = []
    for history in all_histories:
        list_histories.append(history.to_dict())
    return jsonify(list_histories)


@app_views.route('/histories/<history_id>', methods=['GET'], strict_slashes=False)
@swag_from('documentation/history/get_id_history.yml', methods=['get'])
def get_history(history_id):
    """ Retrieves a specific history """
    history = storage.get(History, history_id)
    if not history:
        abort(404)

    return jsonify(history.to_dict())


@app_views.route('/histories/<history_id>', methods=['DELETE'],
                 strict_slashes=False)
@swag_from('documentation/history/delete_history.yml', methods=['DELETE'])
def delete_history(history_id):
    """
    Deletes a history Object
    """

    history = storage.get(History, history_id)

    if not history:
        abort(404)

    storage.delete(history)
    storage.save()

    return make_response(jsonify({}), 200)


@app_views.route('/histories', methods=['POST'], strict_slashes=False)
@swag_from('documentation/history/post_history.yml', methods=['POST'])
def post_history():
    """
    Creates a history
    """
    if not request.get_json():
        abort(400, description="Not a JSON")

    data = request.get_json()
    instance = History(**data)
    instance.save()
    return make_response(jsonify(instance.to_dict()), 201)


@app_views.route('/histories/<history_id>', methods=['PUT'], strict_slashes=False)
@swag_from('documentation/history/put_history.yml', methods=['PUT'])
def put_history(history_id):
    """
    Updates a history
    """
    history = storage.get(History, history_id)

    if not history:
        abort(404)

    if not request.get_json():
        abort(400, description="Not a JSON")

    ignore = ['id', 'created_at', 'updated_at']

    data = request.get_json()
    for key, value in data.items():
        if key not in ignore:
            setattr(history, key, value)
    storage.save()
    return make_response(jsonify(history.to_dict()), 200)
