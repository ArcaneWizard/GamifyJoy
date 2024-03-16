"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
require("./App.css");
//components 
const HomePage_1 = require("./general_components/HomePage");
const AudioConductorPage_1 = __importDefault(require("./general_components/AudioConductorPage"));
const AudioPlayerPage_1 = __importDefault(require("./general_components/AudioPlayerPage"));
const background_png_1 = __importDefault(require("../src/images/background.png"));
function App() {
    var sectionStyle = {
        backgroundImage: `url(${background_png_1.default})`,
    };
    return (react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
        react_1.default.createElement("div", { className: "container-fluid min-vh-100 view", style: sectionStyle },
            react_1.default.createElement(react_router_dom_1.Switch, null,
                react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: "/" },
                    react_1.default.createElement(HomePage_1.HomePage, null)),
                react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: "/:id/conductor" },
                    react_1.default.createElement(AudioConductorPage_1.default, null)),
                react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: "/:id/player" },
                    react_1.default.createElement(AudioPlayerPage_1.default, null))))));
}
const AnotherPage = () => {
    const history = (0, react_router_dom_1.useHistory)();
    const ReturnToHomePage = () => {
        history.push("/");
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h2", null, "Another"),
        react_1.default.createElement("button", { className: "btn btn-dark", onClick: () => ReturnToHomePage() }, "Hello")));
};
const BoredPage = () => {
    return react_1.default.createElement("h2", null, "Bored");
};
exports.default = App;
