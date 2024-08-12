import React, { useState, useEffect, ReactElement, useRef } from "react";
import { useWavesurfer } from '@wavesurfer/react';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import ZoomPlugin from "wavesurfer.js/dist/plugins/zoom.js";
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
import "./App.css";

declare global {
  interface Window {
    SERVER_DATA: { token: string };
  }
}

const App = (): ReactElement => {
  const { token } = window.SERVER_DATA;
  const [data, setData] = useState<{user: string} | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [regions, setRegions] = useState<RegionsPlugin | null>(null);
  const containerRef = useRef(null)
  
  const { wavesurfer, isReady, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    url: `${window.location.origin}/audio.wav`,
    waveColor: 'purple',
    height: 100,
    width: 500,
    dragToSeek: true,
  })

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause()
  }

  const refreshPlayer = () => {
    wavesurfer && wavesurfer.load(`${window.location.origin}/audio.wav`)
  }

  useEffect(() => {
    if(wavesurfer) {
      regions?.clearRegions();
      regions?.addRegion({
        start: startTime,
        end: endTime,
        color: 'hsla(400, 100%, 30%, 0.1)',
        drag: true,
        resize: true,
      });
    }
  }, [endTime]);

  const onStartDrag = (start: number) => {
    setStartTime(start);
  };

  const onEndDrag = (end: number) => {
    setEndTime(end);
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
    
    const regions = RegionsPlugin.create()
    
    regions.enableDragSelection({color: 'rgba(255, 0, 0, 0.1)'});
    setRegions(regions);
    wavesurfer?.registerPlugin(regions);
    
    wavesurfer?.on('drag', (e) => onEndDrag(e * wavesurfer.getDuration()));
    wavesurfer?.on('dragstart', (start) => onStartDrag(start * wavesurfer.getDuration()));
    wavesurfer?.on('dragend', (end) => onEndDrag(end * wavesurfer.getDuration()));
    wavesurfer?.on('click', (e) => {
      console.log(e);
    });
    return () => { 
      wavesurfer?.unAll();
    };
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
              Hell, <code>{data?.user}</code>! <br />
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