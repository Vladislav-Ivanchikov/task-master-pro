"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Checkbox = void 0;
const react_1 = __importDefault(require("react"));
const Checkbox_module_css_1 = __importDefault(require("./Checkbox.module.css"));
const Checkbox = ({ name, label, checked = false, defaultChecked, disabled = false, indeterminate = false, required = false, error, onChange, ...rest }) => {
    const checkboxRef = react_1.default.useRef(null);
    react_1.default.useEffect(() => {
        if (checkboxRef.current) {
            checkboxRef.current.indeterminate = indeterminate;
        }
    }, [indeterminate]);
    const handleChange = (event) => {
        onChange?.(event.target.checked);
    };
    return (react_1.default.createElement("label", null,
        react_1.default.createElement("input", { type: "checkbox", name: name, checked: checked, defaultChecked: defaultChecked, disabled: disabled, ref: checkboxRef, required: required, className: Checkbox_module_css_1.default.input + error ? " " + Checkbox_module_css_1.default.error : "", onChange: (e) => handleChange(e), ...rest }),
        react_1.default.createElement("span", { className: Checkbox_module_css_1.default.customCheckbox }),
        label && react_1.default.createElement("span", { className: Checkbox_module_css_1.default.label }, label),
        error && react_1.default.createElement("div", { className: Checkbox_module_css_1.default.errorMessage }, error)));
};
exports.Checkbox = Checkbox;
