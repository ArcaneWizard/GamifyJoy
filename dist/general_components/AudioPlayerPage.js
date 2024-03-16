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
const AudioRecorder_1 = __importDefault(require("../medium_components/AudioRecorder"));
const ListPlayers_1 = __importDefault(require("../medium_components/ListPlayers"));
const VidElement_1 = __importDefault(require("../small_components/VidElement"));
const AxiosConfigs_1 = __importDefault(require("../configs/AxiosConfigs"));
const AudioPlayerPage = () => {
    const { id } = (0, react_router_1.useParams)();
    const { lobby, name } = (0, react_router_1.useLocation)().state;
    const [embeddedLink, setEmbeddedLink] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        AxiosConfigs_1.default
            .post(`/${lobby}/user`, {
            name: name
        });
        const interval = setInterval(() => {
            AxiosConfigs_1.default
                .post(`/${lobby}/user`, {
                name: name
            });
            // axiosConfig
            //   .get(`/${lobby}/embeddedLink`)
            //   .then((link) => {
            //     console.log(link.data);
            //     setEmbeddedLink(link.data);
            //   })
            //   .catch((err) => {
            //     console.log(err.message);
            //   });
        }, 1500);
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => { clearInterval(interval); console.log("hehehehe"); handleBeforeUnload(); };
    }, []);
    const handleBeforeUnload = () => {
        console.log(lobby + ", " + name + ", high");
        AxiosConfigs_1.default.delete(`${lobby}`, {
            params: {
                name: `${name}`
            }
        });
    };
    return (react_1.default.createElement("div", { className: "text-center" },
        react_1.default.createElement("h5", { className: "text-white pt-5" }, "Lobby Code:"),
        react_1.default.createElement("h1", { className: "text-white mb-5" }, id),
        react_1.default.createElement("div", { class: "row pt-lg-4" }),
        react_1.default.createElement("div", { className: "fixed-bottom mb-5" },
            react_1.default.createElement(ListPlayers_1.default, null)),
        react_1.default.createElement(AudioRecorder_1.default, null),
        react_1.default.createElement(VidElement_1.default, { embeddedLink: embeddedLink })));
};
exports.default = AudioPlayerPage;
