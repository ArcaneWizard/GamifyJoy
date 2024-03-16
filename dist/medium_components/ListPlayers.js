"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const AxiosConfigs_1 = __importDefault(require("../configs/AxiosConfigs"));
const react_router_1 = require("react-router");
const react_2 = require("react");
const ListPlayers = () => {
    const { state } = (0, react_router_1.useLocation)();
    const { lobby } = state;
    const [players, updatePlayers] = (0, react_2.useState)([]);
    const updatePlayerList = () => {
        AxiosConfigs_1.default
            .get(`/${lobby}/users`)
            .then((res) => {
            updatePlayers(res.data);
        });
    };
    (0, react_2.useEffect)(() => {
        updatePlayerList();
        const interval = setInterval(updatePlayerList, 333);
        return () => clearInterval(interval);
    }, []);
    return (react_1.default.createElement("div", { class: "" },
        react_1.default.createElement("h3", { class: " text-white mb-4" }, "Participants"),
        react_1.default.createElement("ul", { class: " container-fluid float-none m-auto d-flex" }, players.map((player, index) => (react_1.default.createElement("p", { className: "fw-bold font-monospace bg-transparent \r\n            text-white w-100 float-none m-auto", key: index }, player.name))))));
};
exports.default = ListPlayers;
