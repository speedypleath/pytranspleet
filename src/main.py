import os
import webview
from backend.server import flask_server

DEBUG = True

def run():
    from utils import run_frontend_watcher
    template_dir = os.path.join(os.getcwd(), "src", "frontend")
    run_frontend_watcher(template_dir=template_dir)
    
    flask_server.debug = DEBUG
    webview.create_window("react-flask-pywebview-app", flask_server) # type: ignore
    webview.start(debug=DEBUG)