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
exports.HomePage = void 0;
const react_1 = __importStar(require("react"));
const react_router_1 = require("react-router");
const AxiosConfigs_1 = __importDefault(require("../configs/AxiosConfigs"));
const white_logo_3_png_1 = __importDefault(require("../images/white_logo_3.png"));
const styled_components_1 = __importDefault(require("styled-components"));
const HomePage = () => {
    const [code, setCode] = (0, react_1.useState)(""); // lobby code
    const [name, setName] = (0, react_1.useState)(""); // user name
    const [errorMsg, updateErrorMsg] = (0, react_1.useState)("");
    const history = (0, react_router_1.useHistory)();
    const controller = new AbortController();
    let isCreatingLobby = false;
    let isUpdatingJoinableLobby = false;
    // generates a random 5-letter lobby code, all capital letters
    let generateLobbyCode = () => {
        let code = "";
        let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (var i = 1; i <= 5; i++) {
            code += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }
        return code;
    };
    // find the lobby that matches with the specified code. If a lobby can't be joined.
    // give an error message. Join the lobby only if the user clicked join
    let joinLobby = async (newCode, clickedJoin) => {
        if (isUpdatingJoinableLobby)
            return;
        isUpdatingJoinableLobby = true;
        setCode(newCode);
        if (name == "" && clickedJoin) {
            updateErrorMsg("Please enter a name before joining a lobby.");
            isUpdatingJoinableLobby = false;
            return;
        }
        else if (name == "" && !clickedJoin) {
            updateErrorMsg("Please enter a name before creating a lobby.");
            isUpdatingJoinableLobby = false;
            return;
        }
        else if (newCode.length == 0 && !clickedJoin) {
            updateErrorMsg("");
            isUpdatingJoinableLobby = false;
            return;
        }
        else if (newCode.length != 5) {
            updateErrorMsg("A lobby code must be 5 letters long");
            isUpdatingJoinableLobby = false;
            return;
        }
        else {
            try {
                // abort get request if stale for 1 second
                let timer = setTimeout(() => { controller.abort(); }, 1000);
                const res = await AxiosConfigs_1.default.get(`/${newCode}`, { signal: controller.signal });
                clearTimeout(timer);
                if (!res.data.exists)
                    updateErrorMsg("Lobby could not be found");
                else if (!clickedJoin)
                    updateErrorMsg("Lobby found! Click to join");
                else {
                    let timer = setTimeout(() => { controller.abort(); }, 1000);
                    let res = await AxiosConfigs_1.default.get(`/${newCode}/user`, { params: { name: name } });
                    clearTimeout(timer);
                    if (res.data.exists) {
                        updateErrorMsg("Username is taken in the lobby entered.");
                        isUpdatingJoinableLobby = false;
                        return;
                    }
                    const nextPageLocation = {
                        pathname: `${newCode}/player`,
                        state: {
                            name: name,
                            lobby: newCode,
                        },
                    };
                    history.push(nextPageLocation);
                }
            }
            catch {
                updateErrorMsg("Network Error. Couldn't connect to server");
            }
            isUpdatingJoinableLobby = false;
        }
    };
    const LobbyCreationStatus = {
        SUCCESS: 1,
        FAIL_ERROR: 2,
        RETRY_ERROR: 3,
    };
    // returns whether or not a lobby with the specified code can be created
    let tryToCreateLobby = async (newCode) => {
        try {
            // abort post request after 1 second. will enter catch statement if aborted
            let timer = setTimeout(() => { controller.abort(); }, 1000);
            const res = await AxiosConfigs_1.default.post(`/${newCode}`, null, { signal: controller.signal });
            clearTimeout(timer);
            if (res.data.success)
                return LobbyCreationStatus.SUCCESS;
            else
                return LobbyCreationStatus.RETRY_ERROR;
        }
        catch (err) {
            return LobbyCreationStatus.FAIL_ERROR;
        }
    };
    // create a lobby and load it. Throw an error if applicable
    let createLobby = async () => {
        // wait till this async func completes before starting a new one
        if (isCreatingLobby)
            return;
        isCreatingLobby = true;
        // invalid username error
        if (name == "") {
            updateErrorMsg("Please enter a name before joining a lobby");
            isCreatingLobby = false;
            return;
        }
        // try to create lobby with unique code
        let status = LobbyCreationStatus.RETRY_ERROR;
        let newCode = "";
        while (status == LobbyCreationStatus.RETRY_ERROR) {
            newCode = generateLobbyCode();
            status = await tryToCreateLobby(newCode);
        }
        // add user to lobby and load it
        if (status == LobbyCreationStatus.SUCCESS) {
            AxiosConfigs_1.default
                .post(`/${newCode}/user`, {
                name: name
            })
                .then((res) => {
                if (res.data.success) {
                    const nextPageLocation = {
                        pathname: `${newCode}/conductor`,
                        state: {
                            name: name,
                            lobby: newCode,
                        },
                    };
                    isCreatingLobby = false;
                    history.push(nextPageLocation);
                }
            })
                .catch(() => {
                updateErrorMsg("Network Error. Couldn't connect to server");
                isCreatingLobby = false;
            });
        }
        else if (status == LobbyCreationStatus.FAIL_ERROR) {
            updateErrorMsg("Network Error. Couldn't connect to server");
            isCreatingLobby = false;
        }
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("div", { className: "row min-vh-100" },
            react_1.default.createElement("div", { className: "col-sm" }),
            react_1.default.createElement("div", { className: "col-sm my-auto float-none text-center pt-5" },
                react_1.default.createElement("img", { src: white_logo_3_png_1.default, alt: "...", className: "img m-auto float-none mb-4", width: "150" }),
                react_1.default.createElement("form", null,
                    react_1.default.createElement("div", { className: "form-group w-50 text-center m-auto float-none " },
                        react_1.default.createElement("input", { type: "text", className: "form-control font-monospace fs-5", value: name, onChange: (e) => setName(e.target.value), id: "example", "aria-describedby": "emailHelp", placeholder: "Enter name" })),
                    react_1.default.createElement("div", { className: "pt-3 text-center" },
                        react_1.default.createElement(LobbyButton, { onClick: (e) => {
                                e.preventDefault();
                                createLobby();
                            } }, "Create Lobby")),
                    react_1.default.createElement(Or, null, "OR"),
                    react_1.default.createElement("div", { className: "pt-3 text-center" },
                        react_1.default.createElement(LobbyCode, { value: code, onChange: (e) => joinLobby(e.target.value.toUpperCase(), false), placeholder: "Enter Code" }),
                        react_1.default.createElement(JoinButton, { onClick: (e) => {
                                e.preventDefault();
                                joinLobby(code, true);
                            } }, "Join")))),
            react_1.default.createElement("div", { className: "col-sm" }),
            react_1.default.createElement(ErrorDiv, null,
                react_1.default.createElement(ErrorMsg, null, errorMsg)))));
};
exports.HomePage = HomePage;
const LobbyButton = styled_components_1.default.button `
  type: text; 
  background-color: #64aee3;
  border: 0px solid #000000;
  border-radius: 5px;c
  text-align: center
  width: 14vw
  color: #000000;
  font-family: monospace
  font-size: 18px
  height: 40px;

  :hover {
    background-color: #3d85c6;
    border:  1px solid #ffffff;
    color: #ffffff;
  }
`;
const JoinButton = styled_components_1.default.button `
  type: text; 
  background-color: #c45897;
  border: 0px solid #000000;
  border-radius: 5px;
  padding: 0px 0px
  margin: -10px 0px 0px 5px
  width: 4vw
  color: #ffffff;
  font-family: monospace
  height: 40px;

  :hover {
    background-color: #943784;
    border:  1px solid #ffffff;
    color: #ffffff;
  }
`;
const LobbyCode = styled_components_1.default.input `
  type: text; 
  background-color: #4743b5;
  border: 0px solid #000000;
  border-radius: 5px;
  text-align: center
  margin: -10px 0px
  width: 8vw
  color: #ffffff;
  font-family: monospace
  height: 40px;

  ::placeholder {
    text: hi;
    color: #ffffff;
  }
`;
const ErrorDiv = styled_components_1.default.div `
  text-align: center
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 4vw;
  center:50%;
`;
const ErrorMsg = styled_components_1.default.h5 `
  text-align: center
  color: #ffffff;
  font-family: monospace
`;
const Or = styled_components_1.default.h5 `
  text-align: center
  color: #ffffff;
  font-family: monospace
  margin: 10px 0px;
`;
