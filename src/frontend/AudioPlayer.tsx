import React, { useState, useEffect, useRef } from "react";
import { useWavesurfer } from '@wavesurfer/react';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import ZoomPlugin from "wavesurfer.js/dist/plugins/zoom.js";
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
import { Button, Grid } from "@mui/material";



export const AudioPlayer = ({ addFile }: { addFile: (file: string) => void}): React.ReactElement => {
    const [startTime, setStartTime] = useState<number>(0);
    const [endTime, setEndTime] = useState<number>(0);
    const [regions, setRegions] = useState<RegionsPlugin | null>(null);
    const [loadedFile, setLoadedFile] = useState<string>('')
    const containerRef = useRef(null)
    
    const { wavesurfer, isReady, isPlaying, currentTime } = useWavesurfer({
      container: containerRef,
      url: ``,
      waveColor: 'purple',
      height: 100,
      width: 500,
      dragToSeek: true,
    })
  
    const onPlayPause = () => {
      wavesurfer && wavesurfer.playPause()
    }
  
    const cropSegment = () => {
      fetch(`${window.location.origin}/cut_segment/${loadedFile}`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          start_time: startTime,
          end_time: endTime,
          file: loadedFile
        })
      }).then((response) => {
        response.json().then((data) => {
          console.log(data);
          addFile(data.file);
          console.log(wavesurfer);
          wavesurfer?.empty();
          wavesurfer?.load(`${window.location.origin}/audio/${data.file}`).then(() => {
            console.log('loaded');
            setLoadedFile(data.file);
            setEndTime(0);
            setStartTime(0);
          }
          ).catch(
            (error) => {
              console.log('error');
              console.log(error);
            }
          ).finally(() => {
            console.log('finally');
          });
        });
      });
    }
    
    useEffect(() => {
      if(wavesurfer) {
        regions?.clearRegions();
        if(startTime > endTime) return;
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
          wavesurfer?.load(`${window.location.origin}/audio/${response.file}`).then(() => {
            console.log('loaded');
            setLoadedFile(response.file);
          });
        });
    }
    
    return (
        <Grid>
        <div ref={containerRef} />
        <Button variant="contained" onClick={openFilePicker}>
          Select file
        </Button>
        <Button variant="contained" onClick={onPlayPause}>
          { isPlaying ? "Pause" : "Play" }
        </Button>
        <Button variant="contained" onClick={cropSegment}>
          Crop
        </Button>
      </Grid>
    )
}