window.MathJax = {
    delayStartupUntil : "configured",

    jax: ["input/TeX","output/HTML-CSS"],
    extensions: ["tex2jax.js","MathMenu.js","MathZoom.js", "toMathML.js", "AssistiveMML.js", "[a11y]/accessibility-menu.js"],

    tex2jax: {preview: "none"},

    "HTML-CSS": {
        availableFonts: ["Tex"],
        imageFont: null
    },
	
    processEnvironments: true,
    showProcessingMessages: false,
    messageStyle: 'none',
    
    MathMenu: {
	showRenderer: false,
	showMathPlayer: false
    },
    
    // BADBAD: this also breaks the layout triggers
    // showMathMenu: false,

    TeX: {
	equationNumbers: { autoNumber: "AMS" },
	extensions: ["AMSmath.js","AMSsymbols.js","noErrors.js","noUndefined.js","color.js","cancel.js"],
	noErrors: {disabled: true},
	Macros: {
	    xspace: '',
	    ensuremath: ''
	}
    },

    root: window.toValidPath("/node_modules/mathjax/")
};

if (window.standalone)
    window.MathJax.root = "https://ximera.osu.edu/node_modules/mathjax";

require('mathjax2');

module.exports = window.MathJax;
