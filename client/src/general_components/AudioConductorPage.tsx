import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import ListPlayers from "../medium_components/ListPlayers.tsx";
import AudioRecorder from "../medium_components/AudioRecorder.tsx";
import YoutubeFrame from "../small_components/InsertVidElement.tsx";
import axiosConfig from "../configs/AxiosConfigs.ts";
import {processing, MergeAudioStatus} from "../audio_processing/MergeAudio.tsx";
import { AxiosResponse } from "axios";

const AudioConductorPage = () => {
  const { id } = useParams();
  const { lobby, name } = useLocation().state;
  const [ audioProcessingStatus, setProcessingStatus ] = useState("");
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingStatus(MergeAudioStatus)
    }, 100);

    return () => { 
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  });

  const handleBeforeUnload = async () => {
    axiosConfig.delete(`${lobby}/deleteUser`, {
        data: {
          name: `${name}`
        }
    });
  }

  const startAllRecordings = () => {
    axiosConfig
      .put(`${lobby}/beginRecording`, {
        name: `${name}`,
      })
      .catch((err) => console.log(err.message));
  };

  const stopAllRecordings = () => {
    axiosConfig
      .put(`${lobby}/endRecording`, {
        name: `${name}`,
      })
      .then(() => {
        axiosConfig
        .get(`${lobby}/userInfo`)
        .then((res : AxiosResponse<any>) => processing(res.data))
        .catch(() => 
          setTimeout(() => {
            axiosConfig
              .get(`${lobby}/userInfo`)
              .then((res) => processing(res.data));
          }, 500));
      }).catch((err) => console.log(err.message));
  };

  return (
    <div className="text-center">
      <h5 className="text-white pt-5">Lobby Code:</h5>
      <h1 className="text-white mb-5">{id}</h1>
      <div className="row pt-lg-4 mt-5">
        <button
          type="button"
          className="btn btn-primary m-auto float-none"
          onClick={() => startAllRecordings()}
          style={{ width: 200 }}
        >
          Start Recording
        </button>
        
      { <h1 className="text-white">{audioProcessingStatus}</h1> }
        <button
          type="button"
          className="btn btn-secondary m-auto float-none"
          onClick={() => stopAllRecordings()}
          style={{ width: 200 }}
        >
          Stop Recording
        </button>
        <div className="mt-5 container">
          <AudioRecorder />
        </div>
        <YoutubeFrame />

        <div className="fixed-bottom mb-5">
          <ListPlayers />
        </div>
      </div>
    </div>
  );
};

export default AudioConductorPage;
