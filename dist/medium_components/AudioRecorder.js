"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_media_recorder_1 = require("react-media-recorder");
const axios_1 = __importDefault(require("axios"));
const AxiosConfigs_1 = __importDefault(require("../configs/AxiosConfigs"));
const react_router_1 = require("react-router");
const AudioRecorder = () => {
    const { state } = (0, react_router_1.useLocation)();
    const { lobby, name } = state;
    const [recordingState, updateRecordingState] = (0, react_1.useState)("ended");
    const [prevRecordingState, updatePrevRecordingState] = (0, react_1.useState)("ended");
    const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } = (0, react_media_recorder_1.useReactMediaRecorder)({ video: false });
    const audio = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const controller = new AbortController();
        const interval = setInterval(() => {
            AxiosConfigs_1.default
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
        };
    }, []);
    const actBasedOnRecordingState = () => {
        //  console.log("decide whether to begin or end recording");
        //  console.log(recordingState + ", " + prevRecordingState);
        if (recordingState == "in progress" && prevRecordingState != "in progress")
            beginRecording();
        else if (recordingState != "in progress" && prevRecordingState == "in progress")
            endRecording();
    };
    const beginRecording = () => {
        console.log("begin recording audio");
        startRecording();
        audio.current.pause();
    };
    const endRecording = () => {
        console.log("stop recording audio");
        stopRecording();
        setTimeout(() => {
            (0, axios_1.default)({
                method: "get",
                url: audio.current.src,
                responseType: "blob",
            }).then((res) => {
                console.log("woah");
                const reader = new FileReader();
                reader.readAsDataURL(res.data);
                reader.onloadend = () => {
                    const base64data = reader.result;
                    const base64file = base64data.split(",")[1];
                    console.log(base64file);
                    if (base64file != "") {
                        AxiosConfigs_1.default
                            .put(`${lobby}/user/audio`, {
                            name: `${name}`,
                            audioFile: base64file,
                        })
                            .then((res) => res.json)
                            .catch((err) => console.log(err.message));
                    }
                };
            });
        });
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("audio", { ref: audio, src: mediaBlobUrl, controls: true })));
};
exports.default = AudioRecorder;
