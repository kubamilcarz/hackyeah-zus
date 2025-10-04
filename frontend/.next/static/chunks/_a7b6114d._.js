(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/zus-ui.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ZusAlert",
    ()=>ZusAlert,
    "ZusBadge",
    ()=>ZusBadge,
    "ZusButton",
    ()=>ZusButton,
    "ZusCard",
    ()=>ZusCard,
    "ZusCardBody",
    ()=>ZusCardBody,
    "ZusCardFooter",
    ()=>ZusCardFooter,
    "ZusCardHeader",
    ()=>ZusCardHeader,
    "ZusHeading",
    ()=>ZusHeading,
    "ZusInput",
    ()=>ZusInput,
    "ZusSelect",
    ()=>ZusSelect,
    "ZusText",
    ()=>ZusText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const ZusCard = (param)=>{
    let { children, variant = 'default', className = '', hoverable = true } = param;
    const baseClasses = "zus-card ".concat(hoverable ? '' : 'hover:transform-none hover:shadow-none');
    const variantClasses = variant !== 'default' ? "zus-card-".concat(variant) : '';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "".concat(baseClasses, " ").concat(variantClasses, " ").concat(className),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/zus-ui.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = ZusCard;
const ZusCardHeader = (param)=>{
    let { children, className = '' } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "zus-card-header ".concat(className),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/zus-ui.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c1 = ZusCardHeader;
const ZusCardBody = (param)=>{
    let { children, className = '' } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "zus-card-body ".concat(className),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/zus-ui.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c2 = ZusCardBody;
const ZusCardFooter = (param)=>{
    let { children, className = '' } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "zus-card-footer ".concat(className),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/zus-ui.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c3 = ZusCardFooter;
const ZusButton = (param)=>{
    let { children, variant = 'primary', size = 'default', disabled = false, loading = false, onClick, type = 'button', className = '' } = param;
    const baseClasses = 'zus-btn';
    const variantClasses = "zus-btn-".concat(variant);
    const sizeClasses = size !== 'default' ? "zus-btn-".concat(size) : '';
    const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: type,
        onClick: onClick,
        disabled: disabled || loading,
        className: "".concat(baseClasses, " ").concat(variantClasses, " ").concat(sizeClasses, " ").concat(disabledClasses, " ").concat(className),
        children: [
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "animate-spin h-4 w-4",
                fill: "none",
                viewBox: "0 0 24 24",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        className: "opacity-25",
                        cx: "12",
                        cy: "12",
                        r: "10",
                        stroke: "currentColor",
                        strokeWidth: "4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/zus-ui.tsx",
                        lineNumber: 100,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        className: "opacity-75",
                        fill: "currentColor",
                        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    }, void 0, false, {
                        fileName: "[project]/src/components/zus-ui.tsx",
                        lineNumber: 101,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/zus-ui.tsx",
                lineNumber: 99,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/zus-ui.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c4 = ZusButton;
const ZusBadge = (param)=>{
    let { children, variant = 'neutral', className = '' } = param;
    const baseClasses = 'zus-badge';
    const variantClasses = "zus-badge-".concat(variant);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "".concat(baseClasses, " ").concat(variantClasses, " ").concat(className),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/zus-ui.tsx",
        lineNumber: 120,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c5 = ZusBadge;
const ZusAlert = (param)=>{
    let { children, variant = 'info', title, className = '' } = param;
    const baseClasses = 'zus-alert';
    const variantClasses = "zus-alert-".concat(variant);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "".concat(baseClasses, " ").concat(variantClasses, " ").concat(className),
        children: [
            title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "zus-alert-title",
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/zus-ui.tsx",
                lineNumber: 139,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/zus-ui.tsx",
                lineNumber: 140,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/zus-ui.tsx",
        lineNumber: 138,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c6 = ZusAlert;
const ZusInput = (param)=>{
    let { id, label, placeholder, value, min, max, step, onChange, type = 'text', required = false, disabled = false, error, className = '', hintAction } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "".concat(className),
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "zus-label",
                children: [
                    label,
                    required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-error ml-1",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/src/components/zus-ui.tsx",
                        lineNumber: 184,
                        columnNumber: 24
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/zus-ui.tsx",
                lineNumber: 182,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                id: id,
                type: type,
                placeholder: placeholder,
                value: value,
                onChange: (e)=>onChange === null || onChange === void 0 ? void 0 : onChange(e.target.value),
                required: required,
                disabled: disabled,
                className: "zus-input ".concat(error ? 'border-error' : '')
            }, void 0, false, {
                fileName: "[project]/src/components/zus-ui.tsx",
                lineNumber: 187,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-error zus-text-small mt-1",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/zus-ui.tsx",
                lineNumber: 198,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/zus-ui.tsx",
        lineNumber: 180,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c7 = ZusInput;
const ZusSelect = (param)=>{
    let { label, options, value, onChange, placeholder, required = false, disabled = false, error, className = '' } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "".concat(className),
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "zus-label",
                children: [
                    label,
                    required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-error ml-1",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/src/components/zus-ui.tsx",
                        lineNumber: 232,
                        columnNumber: 24
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/zus-ui.tsx",
                lineNumber: 230,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                value: value,
                onChange: (e)=>onChange === null || onChange === void 0 ? void 0 : onChange(e.target.value),
                required: required,
                disabled: disabled,
                className: "zus-select ".concat(error ? 'border-error' : ''),
                children: [
                    placeholder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "",
                        children: placeholder
                    }, void 0, false, {
                        fileName: "[project]/src/components/zus-ui.tsx",
                        lineNumber: 242,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0)),
                    options.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: option.value,
                            children: option.label
                        }, option.value, false, {
                            fileName: "[project]/src/components/zus-ui.tsx",
                            lineNumber: 244,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/zus-ui.tsx",
                lineNumber: 235,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-error zus-text-small mt-1",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/zus-ui.tsx",
                lineNumber: 250,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/zus-ui.tsx",
        lineNumber: 228,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c8 = ZusSelect;
const ZusHeading = (param)=>{
    let { children, level = 1, className = '' } = param;
    const classes = "zus-text-h".concat(level, " ").concat(className);
    switch(level){
        case 1:
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: classes,
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/zus-ui.tsx",
                lineNumber: 269,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case 2:
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: classes,
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/zus-ui.tsx",
                lineNumber: 271,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case 3:
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: classes,
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/zus-ui.tsx",
                lineNumber: 273,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case 4:
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                className: classes,
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/zus-ui.tsx",
                lineNumber: 275,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        default:
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: classes,
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/zus-ui.tsx",
                lineNumber: 277,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
    }
};
_c9 = ZusHeading;
const ZusText = (param)=>{
    let { children, variant = 'body', className = '' } = param;
    const classes = "zus-text-".concat(variant, " ").concat(className);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: classes,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/zus-ui.tsx",
        lineNumber: 290,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_c10 = ZusText;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10;
__turbopack_context__.k.register(_c, "ZusCard");
__turbopack_context__.k.register(_c1, "ZusCardHeader");
__turbopack_context__.k.register(_c2, "ZusCardBody");
__turbopack_context__.k.register(_c3, "ZusCardFooter");
__turbopack_context__.k.register(_c4, "ZusButton");
__turbopack_context__.k.register(_c5, "ZusBadge");
__turbopack_context__.k.register(_c6, "ZusAlert");
__turbopack_context__.k.register(_c7, "ZusInput");
__turbopack_context__.k.register(_c8, "ZusSelect");
__turbopack_context__.k.register(_c9, "ZusHeading");
__turbopack_context__.k.register(_c10, "ZusText");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/result/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ResultPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$zus$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/zus-ui.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function fmtPLN(n) {
    return new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
        maximumFractionDigits: 0
    }).format(isFinite(n) ? n : 0);
}
function ResultPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    var _params_get;
    const zusPension = Number((_params_get = params.get("zusPension")) !== null && _params_get !== void 0 ? _params_get : 2964);
    var _params_get1;
    const realToday = Number((_params_get1 = params.get("realPowerToday")) !== null && _params_get1 !== void 0 ? _params_get1 : 2075);
    var _params_get2;
    const monthlySavings = Number((_params_get2 = params.get("monthlyTotal")) !== null && _params_get2 !== void 0 ? _params_get2 : 0);
    // Simulated total for now — replace with backend calc later
    const projectedWithSavings = zusPension + monthlySavings * 0.3; // simplified illustrative model
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen max-w-6xl mx-auto py-12 px-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-zus-card rounded-2xl",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-8 md:p-10 space-y-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "space-y-2 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl md:text-3xl font-semibold text-[rgb(var(--zus-black))]",
                                style: {
                                    fontSize: "calc(1.625rem * var(--font-scale))"
                                },
                                children: "Twoja prognoza emerytalna"
                            }, void 0, false, {
                                fileName: "[project]/src/app/result/page.tsx",
                                lineNumber: 32,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$zus$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ZusText"], {
                                className: "text-neutral-700",
                                children: "Szacunkowa wysokość przyszłego świadczenia na podstawie Twoich danych."
                            }, void 0, false, {
                                fileName: "[project]/src/app/result/page.tsx",
                                lineNumber: 35,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/result/page.tsx",
                        lineNumber: 31,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tile, {
                                tone: "primary",
                                title: "Emerytura z ZUS",
                                subtitle: "Kwota nominalna",
                                value: fmtPLN(zusPension)
                            }, void 0, false, {
                                fileName: "[project]/src/app/result/page.tsx",
                                lineNumber: 42,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tile, {
                                tone: "success",
                                title: "Siła nabywcza dziś",
                                subtitle: "Uwzględnia inflację",
                                value: fmtPLN(realToday)
                            }, void 0, false, {
                                fileName: "[project]/src/app/result/page.tsx",
                                lineNumber: 48,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tile, {
                                tone: "neutral",
                                title: "Z oszczędności",
                                subtitle: "Prognozowany miesięczny dodatek",
                                value: fmtPLN(projectedWithSavings - zusPension)
                            }, void 0, false, {
                                fileName: "[project]/src/app/result/page.tsx",
                                lineNumber: 54,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/result/page.tsx",
                        lineNumber: 41,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "bg-zus-bg rounded-xl p-6 space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg md:text-xl font-semibold text-neutral-700",
                                style: {
                                    fontSize: "calc(1.125rem * var(--font-scale))"
                                },
                                children: "Wnioski"
                            }, void 0, false, {
                                fileName: "[project]/src/app/result/page.tsx",
                                lineNumber: 64,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$zus$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ZusText"], {
                                className: "text-neutral-800 leading-relaxed",
                                children: [
                                    "Na podstawie wprowadzonych danych Twoja ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "prognozowana emerytura"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/result/page.tsx",
                                        lineNumber: 69,
                                        columnNumber: 55
                                    }, this),
                                    " ",
                                    "wynosi około ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: fmtPLN(projectedWithSavings)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/result/page.tsx",
                                        lineNumber: 70,
                                        columnNumber: 28
                                    }, this),
                                    " miesięcznie."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/result/page.tsx",
                                lineNumber: 68,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$zus$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ZusText"], {
                                className: "text-neutral-800 leading-relaxed",
                                children: "Warto rozważyć regularne oszczędzanie w ramach IKE, IKZE lub PPK — każda z tych form pozwala zwiększyć świadczenie o kilka–kilkanaście procent, zwłaszcza przy dłuższym okresie oszczędzania."
                            }, void 0, false, {
                                fileName: "[project]/src/app/result/page.tsx",
                                lineNumber: 73,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$zus$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ZusText"], {
                                className: "text-neutral-800 leading-relaxed",
                                children: [
                                    "Nawet niewielkie miesięczne wpłaty (np. ",
                                    fmtPLN(200),
                                    ") mogą w dłuższej perspektywie wygenerować zauważalny dodatek do emerytury."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/result/page.tsx",
                                lineNumber: 79,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/result/page.tsx",
                        lineNumber: 63,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col md:flex-row gap-3 justify-between pt-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$zus$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ZusButton"], {
                                variant: "ghost",
                                size: "small",
                                type: "button",
                                className: "px-8",
                                onClick: ()=>router.push("/"),
                                children: "Zacznij od nowa"
                            }, void 0, false, {
                                fileName: "[project]/src/app/result/page.tsx",
                                lineNumber: 87,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col md:flex-row gap-3 justify-center pt-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$zus$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ZusButton"], {
                                        variant: "outline",
                                        type: "button",
                                        className: "px-8",
                                        children: "Pobierz raport PDF"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/result/page.tsx",
                                        lineNumber: 98,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$zus$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ZusButton"], {
                                        variant: "primary",
                                        type: "button",
                                        className: "px-8",
                                        children: "Sprawdź inne prognozy"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/result/page.tsx",
                                        lineNumber: 102,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/result/page.tsx",
                                lineNumber: 97,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/result/page.tsx",
                        lineNumber: 86,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/result/page.tsx",
                lineNumber: 29,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/result/page.tsx",
            lineNumber: 28,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/result/page.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_s(ResultPage, "4/fa/A+dNlJIpx43VVQKacWeq4A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ResultPage;
/* --- Tiles --- */ function Tile(param) {
    let { title, subtitle, value, tone = "primary" } = param;
    const bg = tone === "success" ? "bg-[var(--color-zus-green-bg)]" : tone === "neutral" ? "bg-card/20" : "bg-zus-bg";
    const getTitleStyle = ()=>{
        if (tone === "success") return {
            color: "rgb(var(--zus-green))"
        };
        if (tone === "neutral") return {
            color: "rgb(var(--color-text) / 0.7)"
        };
        return {
            color: "rgb(var(--color-accent))"
        };
    };
    const circleColor = tone === "success" ? "fill-[var(--zus-green)]/10" : tone === "neutral" ? "fill-neutral-400/10" : "fill-[#2E6AA2]/10";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "group relative overflow-hidden rounded-xl p-5 md:p-6 ".concat(bg, " transition-transform"),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                "aria-hidden": true,
                className: "absolute inset-0 w-full h-full scale-100 transition-transform duration-700 ease-out group-hover:scale-110",
                viewBox: "0 0 200 200",
                preserveAspectRatio: "none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "170",
                        cy: "30",
                        r: "60",
                        className: circleColor
                    }, void 0, false, {
                        fileName: "[project]/src/app/result/page.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "30",
                        cy: "180",
                        r: "50",
                        className: circleColor
                    }, void 0, false, {
                        fileName: "[project]/src/app/result/page.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/result/page.tsx",
                lineNumber: 148,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm font-semibold",
                        style: {
                            fontSize: "calc(0.8125rem * var(--font-scale))",
                            ...getTitleStyle()
                        },
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/app/result/page.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1 text-3xl md:text-4xl font-extrabold transition-transform duration-300 group-hover:scale-[1.02]",
                        style: {
                            fontSize: "calc(1.875rem * var(--font-scale))",
                            color: "rgb(var(--color-text))"
                        },
                        children: value
                    }, void 0, false, {
                        fileName: "[project]/src/app/result/page.tsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1 text-sm",
                        style: {
                            fontSize: "calc(0.8125rem * var(--font-scale))",
                            color: "rgb(var(--color-text) / 0.7)"
                        },
                        children: subtitle
                    }, void 0, false, {
                        fileName: "[project]/src/app/result/page.tsx",
                        lineNumber: 177,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/result/page.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/result/page.tsx",
        lineNumber: 144,
        columnNumber: 5
    }, this);
}
_c1 = Tile;
var _c, _c1;
__turbopack_context__.k.register(_c, "ResultPage");
__turbopack_context__.k.register(_c1, "Tile");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_a7b6114d._.js.map