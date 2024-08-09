import React, { useState, useEffect, ReactElement, useRef } from "react";
import { useWavesurfer } from '@wavesurfer/react';
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom.esm.js'
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import "./App.css";

declare global {
  interface Window {
    SERVER_DATA: { token: string };
  }
}

const App = (): ReactElement => {
  const { token } = window.SERVER_DATA;
  const [data, setData] = useState<{user: string} | null>(null);
  const containerRef = useRef(null)
  
  const { wavesurfer, isReady, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    url: `${window.location.origin}/audio.wav`,
    waveColor: 'purple',
    height: 100,
    width: 500,
  })

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause()
  }

  const refreshPlayer = () => {
    wavesurfer && wavesurfer.load(`${window.location.origin}/audio.wav`)
  }

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


  useEffect(() => {
    // Initialize the Zoom plugin
    wavesurfer?.registerPlugin(
      ZoomPlugin.create({
        // the amount of zoom per wheel step, e.g. 0.5 means a 50% magnification per scroll
        scale: 0.5,
        // Optionally, specify the maximum pixels-per-second factor while zooming
        maxZoom: 100,
      }),
    );

    wavesurfer?.registerPlugin(
      Hover.create({
        lineColor: '#ff0000',
        lineWidth: 2,
        labelBackground: '#555',
        labelColor: '#fff',
        labelSize: '11px',
      })
    );
    
    const regions = RegionsPlugin.create();
    wavesurfer?.registerPlugin(regions);

    wavesurfer?.on('decode', () => {
      regions.addRegion({
        start: 0,
        end: 8,
        content: 'Resize me',
        color: 'hsla(400, 100%, 30%, 0.1)',
        drag: false,
        resize: true,
      })
    });

  }, [isReady]);

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
        refreshPlayer();
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
          Edit <code>src/frontend/App.js</code> save to pas.
        </p>
        <button onClick={() => openFilePicker()}>Pick file</button>
        <div ref={containerRef} />

  <button onClick={onPlayPause}>
    {isPlaying ? 'Pause' : 'Play'}
  </button>
      </header>
      <body>
      </body>
    </div>
  );
};

export default App;