"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const VidElement = ({ embeddedLink }) => {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("div", { className: "video-responsive mt-5" },
            react_1.default.createElement("div", { class: "embed-responsive embed-responsive-16by9" },
                react_1.default.createElement("iframe", { class: "embed-responsive-item", src: embeddedLink, frameborder: "0", width: "1000", height: "560", allowfullscreen: true, title: "video" })))));
};
exports.default = VidElement;
