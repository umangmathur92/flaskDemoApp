import os

from flask import Flask, jsonify, request, render_template

from demo_app import (db)
from demo_app.db import get_db

secret_key = 'dev'


def create_app():
    app = Flask(__name__)
    ensure_instance_folder_exists(app)
    database_path = os.path.join(app.instance_path, db.db_name)
    app.config.from_mapping(SECRET_KEY=secret_key, DATABASE=database_path)
    db.init_app(app)

    @app.route("/")
    def home_page():
        return render_template("home.html")

    @app.route("/otherpage")
    def other_page():
        return render_template("otherpage.html")

    @app.route('/getallpersons', methods=['GET'])
    def all_persons():
        db_connection = get_db()
        persons = db_connection.execute('SELECT id, firstname, lastname, address, phone FROM person').fetchall()
        return jsonify(persons)

    @app.route('/getperson', methods=['GET'])
    def get_person():
        p_id = request.args.get('person_id')
        db_connection = get_db()
        persons = db_connection.execute('SELECT id, firstname, lastname, address, phone FROM person WHERE id = ?', (p_id,)).fetchone()
        return jsonify(persons)

    @app.route('/addperson', methods=['POST'])
    def add_person():
        is_successful = True

        try:
            incoming_json = request.get_json(force=True)
            print(incoming_json)
            f_name = incoming_json['firstname']
            l_name = incoming_json['lastname']
            addr = incoming_json['address']
            phone_num = incoming_json['phone']

            if not f_name or not l_name or not addr or not phone_num:
                is_successful = False
                print('Invalid input parameters!!')
            else:
                db_connection = get_db()
                db_connection.execute('INSERT INTO person (firstname, lastname, address, phone)  VALUES (?, ?, ?, ?)', (f_name, l_name, addr, phone_num))
                db_connection.commit()

        except Exception as e:
            is_successful = False
            print(str(e))

        if is_successful:
            return jsonify('{"success": true}')
        else:
            return jsonify('{"success": false}')

    return app


def ensure_instance_folder_exists(app):
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
