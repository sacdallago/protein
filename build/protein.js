(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Protein"] = factory();
	else
		root["Protein"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/***
 * Protein
 *
 * Created by:
 *      Christian Dallago
 *      code@dallago.us
 *
 * Created on:
 *      10 Nov 2017
 */

/**
 * Class Protein exports functions to parse specific text formats
 */
class Protein {

    constructor(sequence, identifier){

    }

    hasMapping(){
        return false;
    }

    getUniprotMapping(){
        return undefined;
    }

    /**
     * Get Protein object from Fasta string.
     *
     *
     * @param text - A string representing the fasta input
     * @returns {Protein}
     */
    static fromFasta(text){
        if(typeof text !== 'string'){
            throw "Passed invalid object to parse function."
        }
        else if(text.length < 1){
            throw "Passed an empty string."
        }

        let sequences = [];

        text
            .split("\n")
            .filter(s => s.length > 0)
            .forEach((line,index) => {
                switch(true){
                    case /^>/.test(line):
                    case (/^;/.test(line) && index===0):
                        sequences.push({
                            header: line.substring(1, line.length),
                            sequence: '',
                            comments: ''
                        });
                        break;
                    case /^[A-z]+/.test(line):
                        sequences[sequences.length-1].sequence += line;
                        break;
                    case (/^;/.test(line)):
                        sequences[sequences.length-1].comments += line.substring(1, line.length) + ' ';
                        break;
                    default:
                        console.warn("Don't know what to do with line:" + line);
                        break
                }
            });

        console.log(sequences);

        return new Protein();
    }
}

module.exports = Protein;

/***/ })
/******/ ]);
});