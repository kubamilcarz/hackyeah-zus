module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/components/constrast-toggle.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ContrastToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
"use client";
;
;
;
const CONTRAST_KEY = "contrast-mode";
const FONT_KEY = "font-scale";
const COLLAPSE_KEY = "a11y-collapsed";
function ContrastToggle() {
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("regular");
    const [scale, setScale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [collapsed, setCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    /* --- Load user settings --- */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const savedMode = localStorage.getItem(CONTRAST_KEY) || "regular";
        const savedScale = parseFloat(localStorage.getItem(FONT_KEY) || "1");
        const savedCollapsed = localStorage.getItem(COLLAPSE_KEY) === "true";
        setMode(savedMode);
        setScale(savedScale);
        setCollapsed(savedCollapsed);
        applyMode(savedMode);
        applyScale(savedScale);
    }, []);
    /* --- Apply helpers --- */ function applyMode(m) {
        const html = document.documentElement;
        html.classList.remove("hc-white", "hc-yellow");
        if (m !== "regular") html.classList.add(m);
    }
    function applyScale(next) {
        document.documentElement.style.setProperty("--font-scale", String(next));
    }
    function setAndStoreMode(next) {
        setMode(next);
        // inside ContrastToggle
        document.documentElement.classList.remove("hc-white", "hc-yellow");
        if (next !== "regular") document.documentElement.classList.add(next);
        localStorage.setItem(CONTRAST_KEY, next);
        applyMode(next);
    }
    function adjustFont(delta) {
        const next = Math.min(2.5, Math.max(0.6, parseFloat((scale + delta).toFixed(2))));
        setScale(next);
        localStorage.setItem(FONT_KEY, String(next));
        applyScale(next);
    }
    function resetFont() {
        setScale(1);
        localStorage.setItem(FONT_KEY, "1");
        applyScale(1);
    }
    function toggleCollapse() {
        const next = !collapsed;
        setCollapsed(next);
        localStorage.setItem(COLLAPSE_KEY, String(next));
    }
    /* --- Render --- */ if (collapsed) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            onClick: toggleCollapse,
            className: "fixed top-3 right-3 z-50 border shadow-sm px-3 py-1.5 rounded-full text-sm font-medium focus-visible:ring-2",
            style: {
                backgroundColor: `rgb(var(--color-card) / 0.9)`,
                color: `rgb(var(--color-text))`,
                borderColor: `rgb(var(--color-text) / 0.2)`
            },
            "aria-label": "Pokaż ustawienia dostępności",
            children: "⚙ Dostępność"
        }, void 0, false, {
            fileName: "[project]/src/components/constrast-toggle.tsx",
            lineNumber: 72,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed top-3 right-3 z-50 rounded-md backdrop-blur border px-2.5 py-2 shadow-sm",
        style: {
            backgroundColor: `rgb(var(--color-card) / 0.9)`,
            borderColor: `rgb(var(--color-text) / 0.2)`
        },
        "aria-label": "Ustawienia dostępności",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[13px] font-medium",
                        style: {
                            color: `rgb(var(--color-text))`,
                            fontSize: `calc(13px * var(--font-scale))`
                        },
                        children: "Dostępność"
                    }, void 0, false, {
                        fileName: "[project]/src/components/constrast-toggle.tsx",
                        lineNumber: 98,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: toggleCollapse,
                        className: "text-[13px] hover:opacity-80",
                        style: {
                            color: `rgb(var(--color-text) / 0.7)`,
                            fontSize: `calc(13px * var(--font-scale))`
                        },
                        "aria-label": "Zwiń panel",
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/src/components/constrast-toggle.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/constrast-toggle.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 space-y-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center flex-wrap gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ToggleBtn, {
                                label: "A",
                                title: "Kontrast normalny",
                                active: mode === "regular",
                                onClick: ()=>setAndStoreMode("regular")
                            }, void 0, false, {
                                fileName: "[project]/src/components/constrast-toggle.tsx",
                                lineNumber: 123,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ToggleBtn, {
                                label: "A",
                                title: "Białe litery na czarnym tle",
                                active: mode === "hc-white",
                                onClick: ()=>setAndStoreMode("hc-white"),
                                style: {
                                    color: "#fff",
                                    background: "#000"
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/constrast-toggle.tsx",
                                lineNumber: 124,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ToggleBtn, {
                                label: "A",
                                title: "Żółte litery na czarnym tle",
                                active: mode === "hc-yellow",
                                onClick: ()=>setAndStoreMode("hc-yellow"),
                                style: {
                                    color: "#ffd800",
                                    background: "#000"
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/constrast-toggle.tsx",
                                lineNumber: 125,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mx-1 h-5 w-px",
                                style: {
                                    backgroundColor: `rgb(var(--color-text) / 0.2)`
                                },
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/components/constrast-toggle.tsx",
                                lineNumber: 127,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ToggleBtn, {
                                label: "A−",
                                title: scale <= 0.6 ? "Minimalna czcionka osiągnięta" : `Zmniejsz czcionkę (obecnie: ${Math.round(scale * 100)}%)`,
                                onClick: ()=>adjustFont(-0.1),
                                disabled: scale <= 0.6
                            }, void 0, false, {
                                fileName: "[project]/src/components/constrast-toggle.tsx",
                                lineNumber: 134,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ToggleBtn, {
                                label: "A",
                                title: `Przywróć domyślny rozmiar (obecnie: ${Math.round(scale * 100)}%)`,
                                active: scale === 1,
                                onClick: resetFont
                            }, void 0, false, {
                                fileName: "[project]/src/components/constrast-toggle.tsx",
                                lineNumber: 140,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ToggleBtn, {
                                label: "A+",
                                title: scale >= 2.5 ? "Maksymalna czcionka osiągnięta" : `Zwiększ czcionkę (obecnie: ${Math.round(scale * 100)}%)`,
                                onClick: ()=>adjustFont(+0.1),
                                disabled: scale >= 2.5
                            }, void 0, false, {
                                fileName: "[project]/src/components/constrast-toggle.tsx",
                                lineNumber: 146,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/constrast-toggle.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs",
                            style: {
                                color: scale <= 0.6 || scale >= 2.5 ? `rgb(var(--color-accent))` : `rgb(var(--color-text) / 0.6)`,
                                fontSize: `calc(11px * var(--font-scale))`
                            },
                            children: [
                                "Rozmiar: ",
                                Math.round(scale * 100),
                                "%",
                                scale <= 0.6 && " (min)",
                                scale >= 2.5 && " (max)"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/constrast-toggle.tsx",
                            lineNumber: 156,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/constrast-toggle.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/constrast-toggle.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/constrast-toggle.tsx",
        lineNumber: 89,
        columnNumber: 5
    }, this);
}
/* --- Sub-button component --- */ function ToggleBtn({ label, title, active, onClick, style, disabled }) {
    const buttonStyle = style ? style : {
        backgroundColor: active ? `rgb(var(--color-accent) / 0.2)` : 'transparent',
        color: disabled ? `rgb(var(--color-text) / 0.3)` : `rgb(var(--color-text))`
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        disabled: disabled,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("h-8 min-w-[32px] grid place-items-center rounded text-sm font-semibold select-none focus:outline-none focus-visible:ring-2 transition", !disabled && "hover:opacity-80", active && !style && "ring-2", disabled && "cursor-not-allowed opacity-50"),
        style: {
            ...buttonStyle,
            fontSize: `calc(14px * var(--font-scale))`,
            ...active && !style && {
                boxShadow: `0 0 0 2px rgb(var(--color-accent))`
            }
        },
        title: title,
        "aria-pressed": !!active,
        onClick: disabled ? undefined : onClick,
        children: label
    }, void 0, false, {
        fileName: "[project]/src/components/constrast-toggle.tsx",
        lineNumber: 195,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
"[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clsx",
    ()=>clsx,
    "default",
    ()=>__TURBOPACK__default__export__
]);
function r(e) {
    var t, f, n = "";
    if ("string" == typeof e || "number" == typeof e) n += e;
    else if ("object" == typeof e) if (Array.isArray(e)) {
        var o = e.length;
        for(t = 0; t < o; t++)e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
    } else for(f in e)e[f] && (n && (n += " "), n += f);
    return n;
}
function clsx() {
    for(var e, t, f = 0, n = "", o = arguments.length; f < o; f++)(e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
    return n;
}
const __TURBOPACK__default__export__ = clsx;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d7340d8d._.js.map