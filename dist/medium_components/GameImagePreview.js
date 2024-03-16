"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Panda_png_1 = __importDefault(require("../test_images/Panda.png"));
const GameImagePreview = () => {
    return (react_1.default.createElement("div", { className: "container-fluid" },
        react_1.default.createElement("img", { src: Panda_png_1.default, className: "img-fluid flex-content rounded text-center", alt: "Responsive image" })));
};
exports.default = GameImagePreview;
