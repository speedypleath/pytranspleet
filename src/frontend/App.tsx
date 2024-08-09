import React, { useState, useEffect, ReactElement } from "react";
import "./App.css";

declare global {
  interface Window {
    SERVER_DATA: { token: string };
  }
}

const App = (): ReactElement => {
  const { token } = window.SERVER_DATA;
  const [data, setData] = useState<{user: string} | null>(null);

  useEffect(() => {
    fetch(`${window.location.origin}/init`, {
      method: "POST",
      body: JSON.stringify({ token: token }),
      headers: { "Content-type": "application/json" },
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw response;
      })
      .then((response) => {
        setData(response);
      });
  }, []);

  const openFilePicker = () => {
    fetch(`${window.location.origin}/open_file_dialog`, {
      method: "GET",
      headers: { "Content-type": "application/json" },
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw response;
      })
      .then((response) => {
        console.log(response);
      });
  }
  

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {data ? (
            <span>
              Hello, <code>{data?.user}</code>! <br />
            </span>
          ) : null}
          Edit <code>src/frontend/App.js</code> save to pla.
        </p>
        <button onClick={() => openFilePicker()}>Pick file</button>
      </header>
    </div>
  );
};

export default App;