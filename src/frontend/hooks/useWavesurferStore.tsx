import WaveSurfer from "wavesurfer.js"
import { create } from "zustand"

interface WaveSurferState {
    wavesurfer: WaveSurfer | null,
    loadedFile: string,
    init: (wavesufer: WaveSurfer) => void,
    setLoadedFile: (file: string) => void
}
  
const useWaveSurferStore = create<WaveSurferState>((set, get) => ({
    wavesurfer: null,
    loadedFile: '',
    init: (wavesurfer: WaveSurfer) => {
      set({ wavesurfer: wavesurfer })
    },
    setLoadedFile: (path: string) => {
      console.log('setLoadedFile');
      const wavesurfer = get().wavesurfer
      wavesurfer?.empty();
      wavesurfer?.load(path).then(() => {
        console.log('loaded');
        set({ loadedFile: path.split('/').pop() || '' });
      }
      ).catch(
        (error) => {
          console.log('error');
          console.log(error);
        }
      ).finally(() => {
        console.log('finally');
      });
    },
  }))


export default useWaveSurferStore