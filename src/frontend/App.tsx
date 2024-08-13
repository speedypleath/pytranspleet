import React, { useState, useEffect, ReactElement, useRef } from "react";
import { useWavesurfer } from '@wavesurfer/react';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import ZoomPlugin from "wavesurfer.js/dist/plugins/zoom.js";
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
import { FileHolder } from "./FileHolder";
import { Button, Grid } from "@mui/material";
import Divider from '@mui/material/Divider';
import { AudioPlayer } from "./AudioPlayer";

declare global {
  interface Window {
    SERVER_DATA: { token: string };
  }
}

const App = (): ReactElement => {
  const [files, setFiles] = useState<string[]>(['baga tek in pula mea'])

  return (
      <Grid className="App-body" container padding={0} margin={0} bgcolor="#282c34">

        
        <FileHolder files={files} />
        <Divider orientation="horizontal"></Divider>
        <AudioPlayer addFile={(file) => setFiles([...files, file])} />

      </Grid>
  );
};

export default App;