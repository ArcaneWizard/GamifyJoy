import Crunker from "crunker";
import { Exists } from "../configs/AxiosRes";

const AudioContext = window.AudioContext;
const audioContext = new AudioContext();

function _base64ToArrayBuffer(base64: string) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

export const processing = async (data : any) => {
  console.log(data);

  var buffers = [];
  var B64Chunks = [];

  console.log("started processing");
  MergeAudioStatus = "syncing and merging audio";

  for (var key in data) {
    try {
      var B64Chunk = data[key]["mp3"];
      var buffer = await audioContext.decodeAudioData(
        _base64ToArrayBuffer(B64Chunk)
      );

      B64Chunks.push(B64Chunk);

      buffers.push(buffer);
    } catch {}
  }

  for (var i = 1; i < B64Chunks.length; i++) {
    console.log(B64Chunks[i] === B64Chunks[i - 1]);
  }

  try {
    let merger = new Crunker();
    console.log(buffers[0].length);
    let output = merger.export(merger.mergeAudio(buffers));
    merger.download(output.blob);
  } catch {}
  
  console.log("finished");
  MergeAudioStatus = "download ready";
};

export let MergeAudioStatus : string;