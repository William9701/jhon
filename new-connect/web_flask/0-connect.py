from models import storage
from models.content import Content
from flask import Flask, render_template

from models.user import User

app = Flask(__name__)


# app.jinja_env.trim_blocks = True
# app.jinja_env.lstrip_blocks = True


@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()


@app.route('/content', strict_slashes=False)
def states_list():
    """ displays a HTML page with a list of states """
    contents = storage.all(Content).values()

    return render_template('3-main.html', contents=contents)


@app.route('/content_by_users', strict_slashes=False)
def content_by_users():
    """ displays a HTML page with a list of contents by users """
    contents = storage.all(Content).values()
    users = storage.all(User).values()
    return render_template('2-main.html', contents=contents, users=users, h_1="Users")


if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5000)
