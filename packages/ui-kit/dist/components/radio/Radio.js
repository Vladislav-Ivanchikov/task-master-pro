"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Radio = void 0;
const react_1 = __importDefault(require("react"));
const Radio_module_css_1 = __importDefault(require("./Radio.module.css"));
const Radio = ({ label, name, value, checked, onChange, disabled, }) => {
    return (react_1.default.createElement("label", { className: Radio_module_css_1.default.radioWrapper },
        react_1.default.createElement("input", { type: "radio", name: name, value: value, checked: checked, onChange: onChange, disabled: disabled, className: Radio_module_css_1.default.input }),
        react_1.default.createElement("span", { className: Radio_module_css_1.default.customRadio }),
        react_1.default.createElement("span", { className: Radio_module_css_1.default.label }, label)));
};
exports.Radio = Radio;
