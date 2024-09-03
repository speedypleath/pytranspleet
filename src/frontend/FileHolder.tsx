import * as React from 'react';
import List from '@mui/material/List';
import { Grid, ListItem, ListItemButton, ListItemText } from '@mui/material';
import useWaveSurferStore from './hooks/useWavesurferStore';

const style = {
  p: 0,
  width: '100%',
  maxWidth: 360,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'background.paper',
};

export const FileHolder = ({ files }: { files: string[]}): React.ReactElement => {
  const waveSurferState = useWaveSurferStore(state => state);

    return (
        <Grid container height='100vh' width='30vw' left={0} sx={style} xs={4}>
            <List>
            { files.map((file: string) => {
                return <ListItem key={file}>
                      <ListItemButton onClick={() => { 
                        console.log('clicked');
                        waveSurferState.setLoadedFile(`${window.location.origin}/audio/${file}`)
                      } 
                      }>
                        {file}
                      </ListItemButton>
                      
                    </ListItem>
            })  }
            </List>
        </Grid>
    )
}