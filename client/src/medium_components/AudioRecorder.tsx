import React, { useRef, useEffect, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import axios from "axios";
import axiosConfig from "../configs/AxiosConfigs.ts";
import { useLocation } from "react-router";
import { AxiosResponse } from "axios";

const AudioRecorder = () => {
  const { state } = useLocation();
  const { lobby, name } = state;
  const [recordingState, updateRecordingState] = useState("ended");
  const [prevRecordingState, updatePrevRecordingState] = useState("ended");

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ video: false });

  const audio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    
    const controller = new AbortController();
    const interval = setInterval(() => {
        
        axiosConfig
          .get(`/${lobby}/getRecordingState`)
          .then((res) => {
            console.log("updating recording state");
            updatePrevRecordingState(recordingState);
            updateRecordingState(res.data);
            actBasedOnRecordingState();
          })
          .catch((err) => {
            console.log("error with recoridng state");
            console.log(err.message);
          });
      }, 100);

    return () => {
      clearInterval(interval);
      controller.abort();
    }
  });

  const actBasedOnRecordingState = () => {
  //  console.log("decide whether to begin or end recording");
  //  console.log(recordingState + ", " + prevRecordingState);
    if (recordingState === "in progress" && prevRecordingState !== "in progress")
      beginRecording();
    else if (recordingState !== "in progress" && prevRecordingState === "in progress")
      endRecording();
  };

  const beginRecording = () => {
    console.log("begin recording audio");
    startRecording();

    if (audio.current != null)
      audio.current.pause();
  };

  const endRecording = () => {
    console.log("stop recording audio");
    stopRecording();
    setTimeout(() => {
      axios({
        method: "get",
        url: ((audio.current != null) ? audio.current.src : ""),
        responseType: "blob",
      }).then((res) => {
        const reader = new FileReader();
        reader.readAsDataURL(res.data);
        reader.onloadend = () => {
          const base64data = reader.result;

          if (base64data != null && typeof base64data === 'string') {
            const base64file = base64data.split(",")[1];
            console.log(base64file);

            if (base64file !== "") {
              axiosConfig
                .put(`${lobby}/user/audio`, {
                  name: `${name}`,
                  audioFile: base64file,
                })
                .then((res : AxiosResponse<any>) => res.data)
                .catch((err) => console.log(err.message));
            }
          }
        };
      });
    });
  };

  return (
    <div>
      <audio ref={audio} src={mediaBlobUrl} controls />
    </div>
  );
};

export default AudioRecorder;
