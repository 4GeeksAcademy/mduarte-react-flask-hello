"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, Users, Favorites
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands 
from flask_cors import CORS
from sqlalchemy import select
from datetime import datetime, timezone
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager

print(db.metadata.tables.keys())

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
CORS(app)
app.config["JWT_SECRET_KEY"] = "clave-super-secreta"  # cambia esto por una segura
jwt = JWTManager(app)
app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response 

@app.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    query_user= db.session.execute(select(Users).where(Users.email == email)).scalar_one_or_none()

    if query_user is None:
        return jsonify({"msg": "User not exist"}), 404
    
    if email != query_user.email or password != query_user.password:
        return jsonify({"msg": "Bad username or password"}),401

    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token), 200 



@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")
    password = data.get("password")

    # Validaciones básicas
    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400

    # Verificar si el usuario ya existe
    existing_user = db.session.execute(
        select(Users).where(Users.email == email)
    ).scalar_one_or_none()

    if existing_user:
        return jsonify({"msg": "User already exists"}), 409

    # Crear nuevo usuario
    new_user = Users(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=password,  # Idealmente aquí hashea la contraseña
        subscription_date = datetime.now(timezone.utc)
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201


# Protect a route with jwt_required, which will kick out requests
# without a valid JWT present.
@app.route("/favorites", methods=["GET"])
@jwt_required()
def protected():
    current_user_email = get_jwt_identity()
    query_user = db.session.execute(select(Users).where(Users.email == current_user_email)).scalar_one_or_none()

    if query_user is None:
        return jsonify({"msg": "User not found"}), 404

    user_favorites = db.session.execute(
        select(Favorites).where(Favorites.user_id == query_user.id)
    ).scalars().all()

    favorites_list = [fav.serialize() for fav in user_favorites]

    return jsonify(
        logged_in_as=query_user.serialize(),
        favorites=favorites_list
    ), 200

@app.route("/private", methods=["GET"])
@jwt_required()
def private():
    current_user = get_jwt_identity()
    return jsonify({
        "msg": "Bienvenido al área privada",
        "user": current_user
    }), 200

    # return jsonify(logged_in_as=current_user), 200 

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
