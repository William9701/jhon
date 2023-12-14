import os
import uuid
from flask import flash, abort, redirect, url_for

from models import storage
from models.content import Content
from models.location import Location
from models.user import User
from flask import Flask, render_template, request
from flask_bcrypt import Bcrypt
from models.user import User
from jinja2 import Environment, select_autoescape
from datetime import datetime
from models.library import Library

app = Flask(__name__)
app.secret_key = 'william667'
bcrypt = Bcrypt(app)


# app.jinja_env.trim_blocks = True
# app.jinja_env.lstrip_blocks = True


@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()


@app.route('/content', strict_slashes=False)
def content_list():
    """ displays a HTML page with a list of contents"""
    cache_id = str(uuid.uuid4())
    contents = storage.all(Content).values()
    users = storage.all(User).values()
    locations = storage.all(Location).values()

    return render_template('index.html', contents=contents, locations=locations, users=users, cache_id=cache_id)


@app.route('/profile/<string:user_id>', strict_slashes=False)
def profile(user_id):
    # Fetch user data using user_id
    user = storage.get(User, user_id)
    contents = storage.all(Content).values()
    locations = storage.all(Location).values()
    if user is None:
        # Handle the case where the user with the given ID is not found
        abort(404)
    return render_template('profile.html', user=user, contents=contents, locations=locations)


# Update the /camera route to accept user_id parameter


@app.route('/camera/<string:user_id>', strict_slashes=False)
def camera(user_id):
    # Fetch user data using user_id
    user = storage.get(User, user_id)
    if user is None:
        # Handle the case where the user with the given ID is not found
        abort(404)

    return render_template('camera.html', user=user)


@app.route('/upload', methods=['POST'], strict_slashes=False)
def upload_file():
    file = request.files['file']
    save_path = os.path.join(os.pardir, 'new-connect', 'web_dynamic',
                             'static', 'vidFiles', 'videos', file.filename)
    file.save(save_path)
    return 'File uploaded successfully'


@app.route('/upload_snapshot', methods=['POST'], strict_slashes=False)
def upload_snap():
    file = request.files['file']
    save_path = os.path.join(os.pardir, 'new-connect', 'web_dynamic',
                             'static', 'vidFiles', 'images', file.filename)
    file.save(save_path)
    return 'File uploaded successfully'


@app.route('/login', strict_slashes=False, methods=['GET', 'POST'])
def login():
    cache_id = str(uuid.uuid4())
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        users = storage.all(User).values()
        locations = storage.all(Location).values()
        contents = storage.all(Content).values()

        for user in users:
            if user.username == username:
                if bcrypt.check_password_hash(user.password, password):
                    # Successful login, you can redirect to another page or return a response
                    return render_template('user-index.html', user=user, users=users, cache_id=cache_id,
                                           locations=locations,
                                           contents=contents)
                else:
                    # Incorrect password
                    flash("Invalid password. Please try again.")
                    return render_template('login.html')
        # Incorrect username
        flash("Invalid username. Please try again.")
        return render_template('login.html')

    # Render the login page for GET requests
    return render_template('login.html')


@app.route('/user_index/<string:user_id>', strict_slashes=False)
def user_index(user_id):
    user = storage.get(User, user_id)
    locations = storage.all(Location).values()
    contents = storage.all(Content).values()
    cache_id = str(uuid.uuid4())
    return render_template('user-index.html', user=user, cache_id=cache_id, locations=locations, contents=contents)


@app.route('/signup', strict_slashes=False)
def signup():
    """ signup page """

    return render_template('signup.html')


@app.route('/logout', strict_slashes=False)
def logout():
    """ logout page """
    storage.close()
    return redirect(url_for('content_list'))


@app.route('/play/<string:content_id>', strict_slashes=False)
def play(content_id):
    """ play page """
    content = storage.get(Content, content_id)
    users = storage.all(User).values()
    contents = storage.all(Content).values()
    locations = storage.all(Location).values()
    return render_template('play-video.html', content=content, users=users, contents=contents, locations=locations)


@app.route('/vid-chat/', strict_slashes=False)
def vid_chat():
    return render_template('receiver.html')


@app.route('/lobby/', strict_slashes=False)
def lobby():
    return render_template('lobby.html')


@app.route('/room/<invite_code>', strict_slashes=False)
def room(invite_code):
    return render_template('room.html', invite_code=invite_code)


@app.route('/vid-chat-s/<string:user_id>', strict_slashes=False)
def vid_chat_s(user_id):
    # Fetch user data using user_id
    user = storage.get(User, user_id)
    if user is None:
        # Handle the case where the user with the given ID is not found
        abort(404)
    return render_template('sender.html', user=user)


@app.route('/library/<string:user_id>', strict_slashes=False)
def library(user_id):
    # Fetch user data using user_id
    user = storage.get(User, user_id)
    libraries = storage.all(Library).values()
    if user is None:
        # Handle the case where the user with the given ID is not found
        abort(404)
    return render_template('library.html', user=user, libraries=libraries)


@app.route('/play-lib/<string:content_id>', strict_slashes=False)
def play_lib(content_id):
    """ play page """
    library = storage.get(Library, content_id)
    users = storage.all(User).values()
    contents = storage.all(Content).values()
    locations = storage.all(Location).values()
    return render_template('play-lib.html', library=library, users=users, contents=contents, locations=locations)


@app.route('/vid-c/', strict_slashes=False)
def vid_c():
    return render_template('vid_c_index.html')

if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5000, debug=True)
