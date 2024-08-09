from threading import Thread
from src.main import run
import webview
from time import sleep

def thread_test():    
    window = webview.active_window()
    while window is None:
        sleep(1)
        window = webview.active_window()
    
    url = window.get_current_url()
    if url is None:
        assert False
    assert url.startswith("http://127.0.0.1")
    window.destroy()


def test_open_gui():
    thread = Thread(target=thread_test)
    thread.start()
    run()
    thread.join()