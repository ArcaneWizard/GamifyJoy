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
const react_router_1 = require("react-router");
const ListPlayers_1 = __importDefault(require("../medium_components/ListPlayers"));
const AudioRecorder_1 = __importDefault(require("../medium_components/AudioRecorder"));
const InsertVidElement_1 = __importDefault(require("../small_components/InsertVidElement"));
const AxiosConfigs_1 = __importDefault(require("../configs/AxiosConfigs"));
const MergeAudio_1 = require("../audio_processing/MergeAudio");
const AudioConductorPage = () => {
    const { id } = (0, react_router_1.useParams)();
    const { lobby, name } = (0, react_router_1.useLocation)().state;
    const [audioProcessingStatus, setProcessingStatus] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        console.log("sketch");
        const interval = setInterval(() => {
            setProcessingStatus(MergeAudio_1.MergeAudioStatus);
        }, 100);
        //   console.log(name + ", cow");
        //   axiosConfig.delete(`${lobby}/deleteUser`, {
        //     name: `${name}`
        // });
        // window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            clearInterval(interval);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    const handleBeforeUnload = () => {
        console.log("unloaded");
        AxiosConfigs_1.default.delete(`${lobby}/deleteUser`, {
            name: `${name}`
        });
    };
    const startAllRecordings = () => {
        console.log("start");
        AxiosConfigs_1.default
            .put(`${lobby}/beginRecording`, {
            name: `${name}`,
        })
            .catch((err) => console.log(err.message));
    };
    const stopAllRecordings = () => {
        console.log("stop");
        AxiosConfigs_1.default
            .put(`${lobby}/endRecording`, {
            name: `${name}`,
        })
            .then(AxiosConfigs_1.default
            .get(`${lobby}/userInfo`)
            .then((res) => (0, MergeAudio_1.processing)(res.data))
            .catch(() => setTimeout(() => {
            AxiosConfigs_1.default
                .get(`${lobby}/userInfo`)
                .then((res) => (0, MergeAudio_1.processing)(res.data));
        }), 500))
            .catch((err) => console.log(err.message));
    };
    return (react_1.default.createElement("div", { className: "text-center" },
        react_1.default.createElement("h5", { className: "text-white pt-5" }, "Lobby Code:"),
        react_1.default.createElement("h1", { className: "text-white mb-5" }, id),
        react_1.default.createElement("div", { class: "row pt-lg-4 mt-5" },
            react_1.default.createElement("button", { type: "button", class: "btn btn-primary m-auto float-none", onClick: () => startAllRecordings(), style: { width: 200 } }, "Start Recording"),
            react_1.default.createElement("h1", { className: "text-white" }, audioProcessingStatus),
            react_1.default.createElement("button", { type: "button", class: "btn btn-secondary m-auto float-none", onClick: () => stopAllRecordings(), style: { width: 200 } }, "Stop Recording"),
            react_1.default.createElement("div", { class: "mt-5 container" },
                react_1.default.createElement(AudioRecorder_1.default, null)),
            react_1.default.createElement(InsertVidElement_1.default, null),
            react_1.default.createElement("div", { className: "fixed-bottom mb-5" },
                react_1.default.createElement(ListPlayers_1.default, null)))));
};
exports.default = AudioConductorPage;
