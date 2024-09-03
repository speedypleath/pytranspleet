import os
from re import sub
import sys
import time
import json
import getpass  # get user
from functools import wraps
from tkinter import NO
from typing import List, cast
from markupsafe import escape
import webview
from flask import Flask, render_template, jsonify, request, send_file
from backend.utils.filesystem import cut_audio_segment
from pathlib import Path


# Template directory
if sys.flags.dev_mode:
    MAIN_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "dist")  # development
else:
    MAIN_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "dist")  # production


def wait_template():
    while not os.path.exists(os.path.join(MAIN_DIR, "index.html")) and sys.flags.dev_mode:
        time.sleep(0.5)


flask_server = Flask(__name__, template_folder=MAIN_DIR, static_folder=MAIN_DIR, static_url_path="/")
flask_server.config["SEND_FILE_MAX_AGE_DEFAULT"] = 1

def get_file_picker(window: webview.Window):
    def open_file_picker():
        file_types = ('Audio Files (*.wav;*.mp3;*.flac)', 'All files (*.*)')
        result = window.create_file_dialog(webview.OPEN_DIALOG, allow_multiple=True, file_types=file_types)
        return result
    return open_file_picker


def verify_token(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        data = json.loads(request.data)
        token = data.get("token")
        if token == webview.token:
            return function(*args, **kwargs)
        raise Exception("Authentication error")

    return wrapper


@flask_server.after_request
def add_header(response):
    response.headers["Cache-Control"] = "no-store"
    return response


@flask_server.route("/", defaults={"path": ""})
@flask_server.route("/<path:path>")
def serve(path):
    # Handle first launch on development stage
    wait_template()

    return render_template("index.html", token=webview.token)


@flask_server.route("/init", methods=["POST"])
@verify_token
def initialize():
    return jsonify({"user": getpass.getuser()})

files = { 'audio.wav': "/Users/andrei/Projects/pytranspleet/tests/rollwiththepunches.wav"}


@flask_server.route('/open_file_dialog', methods=['GET'])  # type: ignore
def open_file_dialog():
    window = webview.active_window()
    if window is None:
        raise Exception("Window is not initialized")
    
    file = cast(str,window.create_file_dialog(webview.OPEN_DIALOG, allow_multiple=False, file_types=('Audio Files (*.wav;*.mp3;*.flac)', 'All files (*.*)')))[0]
    if file:
        print(file)
        print(file.split('/')[-1])
        print(file)
        files[file.split('/')[-1]] = file
        return { 'file': file.split('/')[-1] }
    return { file: None }


@flask_server.route('/audio/<path:subpath>', methods=['GET'])
def route_audio_file(subpath):
    print(subpath)
    print(files.keys())
    if subpath not in files:
        return jsonify({"error": "Audio file doesn't exit"})
    return send_file(
        files[subpath], 
        mimetype="audio/wav", 
        as_attachment=True)
    

@flask_server.route('/cut_segment/<path:file>', methods=['POST'])
def cut_segment(file):
    if file not in files:
        return jsonify({"error": "Audio file doesn't exit"})
    path = files[file]
    left = request.json.get('start_time')
    right = request.json.get('end_time')
    
    if not left or not right:
        return jsonify({"error": "Wrong data"})
    
    new_file = cut_audio_segment(Path(path), left, right)
    files[new_file.split('/')[-1]] = new_file
    print(new_file)
    return { 'file': new_file.split('/')[-1] }
