from threading import Thread
from src.main import run
import webview
import requests
from time import sleep

def thread_test():    
    window = webview.active_window()
    while window is None:
        sleep(1)
        window = webview.active_window()
    
    url = window.get_current_url()
    if url is None:
        assert False
    response = requests.get(url + "/open_file_dialog")
    assert response.status_code == 200 
    window.destroy()


def test_open_gui():
    thread = Thread(target=thread_test)
    thread.start()
    run()
    thread.join()