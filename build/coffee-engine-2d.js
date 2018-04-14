var Stats = function() {
    var startTime = Date.now(), prevTime = startTime, ms = 0, msMin = 1 / 0, msMax = 0, fps = 0, fpsMin = 1 / 0, fpsMax = 0, frames = 0, mode = 0, container = document.createElement("div");
    container.id = "stats", container.addEventListener("mousedown", function(event) {
        event.preventDefault(), setMode(++mode % 2);
    }, !1), container.style.cssText = "width:80px;opacity:0.9;cursor:pointer";
    var fpsDiv = document.createElement("div");
    fpsDiv.id = "fps", fpsDiv.style.cssText = "padding:0 0 3px 3px;text-align:left;background-color:#002", 
    container.appendChild(fpsDiv);
    var fpsText = document.createElement("div");
    fpsText.id = "fpsText", fpsText.style.cssText = "color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px", 
    fpsText.innerHTML = "FPS", fpsDiv.appendChild(fpsText);
    var fpsGraph = document.createElement("div");
    for (fpsGraph.id = "fpsGraph", fpsGraph.style.cssText = "position:relative;width:74px;height:30px;background-color:#0ff", 
    fpsDiv.appendChild(fpsGraph); fpsGraph.children.length < 74; ) {
        var bar = document.createElement("span");
        bar.style.cssText = "width:1px;height:30px;float:left;background-color:#113", fpsGraph.appendChild(bar);
    }
    var msDiv = document.createElement("div");
    msDiv.id = "ms", msDiv.style.cssText = "padding:0 0 3px 3px;text-align:left;background-color:#020;display:none", 
    container.appendChild(msDiv);
    var msText = document.createElement("div");
    msText.id = "msText", msText.style.cssText = "color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px", 
    msText.innerHTML = "MS", msDiv.appendChild(msText);
    var msGraph = document.createElement("div");
    for (msGraph.id = "msGraph", msGraph.style.cssText = "position:relative;width:74px;height:30px;background-color:#0f0", 
    msDiv.appendChild(msGraph); msGraph.children.length < 74; ) {
        var bar = document.createElement("span");
        bar.style.cssText = "width:1px;height:30px;float:left;background-color:#131", msGraph.appendChild(bar);
    }
    var setMode = function(value) {
        switch (mode = value) {
          case 0:
            fpsDiv.style.display = "block", msDiv.style.display = "none";
            break;

          case 1:
            fpsDiv.style.display = "none", msDiv.style.display = "block";
        }
    }, updateGraph = function(dom, value) {
        dom.appendChild(dom.firstChild).style.height = value + "px";
    };
    return {
        REVISION: 12,
        domElement: container,
        setMode: setMode,
        begin: function() {
            startTime = Date.now();
        },
        end: function() {
            var time = Date.now();
            return ms = time - startTime, msMin = Math.min(msMin, ms), msMax = Math.max(msMax, ms), 
            msText.textContent = ms + " MS (" + msMin + "-" + msMax + ")", updateGraph(msGraph, Math.min(30, 30 - ms / 200 * 30)), 
            frames++, time > prevTime + 1e3 && (fps = Math.round(1e3 * frames / (time - prevTime)), 
            fpsMin = Math.min(fpsMin, fps), fpsMax = Math.max(fpsMax, fps), fpsText.textContent = fps + " FPS (" + fpsMin + "-" + fpsMax + ")", 
            updateGraph(fpsGraph, Math.min(30, 30 - fps / 100 * 30)), prevTime = time, frames = 0), 
            time;
        },
        update: function() {
            startTime = this.end();
        }
    };
};

"object" == typeof module && (module.exports = Stats), function() {
    if ("performance" in window == !1 && (window.performance = {}), Date.now = Date.now || function() {
        return new Date().getTime();
    }, "now" in window.performance == !1) {
        var offset = window.performance.timing && window.performance.timing.navigationStart ? window.performance.timing.navigationStart : Date.now();
        window.performance.now = function() {
            return Date.now() - offset;
        };
    }
}();

var TWEEN = TWEEN || function() {
    var _tweens = [];
    return {
        getAll: function() {
            return _tweens;
        },
        removeAll: function() {
            _tweens = [];
        },
        add: function(tween) {
            _tweens.push(tween);
        },
        remove: function(tween) {
            var i = _tweens.indexOf(tween);
            -1 !== i && _tweens.splice(i, 1);
        },
        update: function(time) {
            if (0 === _tweens.length) return !1;
            var i = 0;
            for (time = void 0 !== time ? time : window.performance.now(); i < _tweens.length; ) _tweens[i].update(time) ? i++ : _tweens.splice(i, 1);
            return !0;
        }
    };
}();

TWEEN.Tween = function(object) {
    var _object = object, _valuesStart = {}, _valuesEnd = {}, _valuesStartRepeat = {}, _duration = 1e3, _repeat = 0, _yoyo = !1, _isPlaying = !1, _reversed = !1, _delayTime = 0, _startTime = null, _easingFunction = TWEEN.Easing.Linear.None, _interpolationFunction = TWEEN.Interpolation.Linear, _chainedTweens = [], _onStartCallback = null, _onStartCallbackFired = !1, _onUpdateCallback = null, _onCompleteCallback = null, _onStopCallback = null;
    for (var field in object) _valuesStart[field] = parseFloat(object[field], 10);
    this.to = function(properties, duration) {
        return void 0 !== duration && (_duration = duration), _valuesEnd = properties, this;
    }, this.start = function(time) {
        TWEEN.add(this), _isPlaying = !0, _onStartCallbackFired = !1, _startTime = void 0 !== time ? time : window.performance.now(), 
        _startTime += _delayTime;
        for (var property in _valuesEnd) {
            if (_valuesEnd[property] instanceof Array) {
                if (0 === _valuesEnd[property].length) continue;
                _valuesEnd[property] = [ _object[property] ].concat(_valuesEnd[property]);
            }
            _valuesStart[property] = _object[property], _valuesStart[property] instanceof Array == !1 && (_valuesStart[property] *= 1), 
            _valuesStartRepeat[property] = _valuesStart[property] || 0;
        }
        return this;
    }, this.stop = function() {
        return _isPlaying ? (TWEEN.remove(this), _isPlaying = !1, null !== _onStopCallback && _onStopCallback.call(_object), 
        this.stopChainedTweens(), this) : this;
    }, this.stopChainedTweens = function() {
        for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) _chainedTweens[i].stop();
    }, this.delay = function(amount) {
        return _delayTime = amount, this;
    }, this.repeat = function(times) {
        return _repeat = times, this;
    }, this.yoyo = function(yoyo) {
        return _yoyo = yoyo, this;
    }, this.easing = function(easing) {
        return _easingFunction = easing, this;
    }, this.interpolation = function(interpolation) {
        return _interpolationFunction = interpolation, this;
    }, this.chain = function() {
        return _chainedTweens = arguments, this;
    }, this.onStart = function(callback) {
        return _onStartCallback = callback, this;
    }, this.onUpdate = function(callback) {
        return _onUpdateCallback = callback, this;
    }, this.onComplete = function(callback) {
        return _onCompleteCallback = callback, this;
    }, this.onStop = function(callback) {
        return _onStopCallback = callback, this;
    }, this.update = function(time) {
        var property;
        if (time < _startTime) return !0;
        !1 === _onStartCallbackFired && (null !== _onStartCallback && _onStartCallback.call(_object), 
        _onStartCallbackFired = !0);
        var elapsed = (time - _startTime) / _duration;
        elapsed = elapsed > 1 ? 1 : elapsed;
        var value = _easingFunction(elapsed);
        for (property in _valuesEnd) {
            var start = _valuesStart[property] || 0, end = _valuesEnd[property];
            end instanceof Array ? _object[property] = _interpolationFunction(end, value) : ("string" == typeof end && (end = start + parseFloat(end, 10)), 
            "number" == typeof end && (_object[property] = start + (end - start) * value));
        }
        if (null !== _onUpdateCallback && _onUpdateCallback.call(_object, value), 1 == elapsed) {
            if (_repeat > 0) {
                isFinite(_repeat) && _repeat--;
                for (property in _valuesStartRepeat) {
                    if ("string" == typeof _valuesEnd[property] && (_valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property], 10)), 
                    _yoyo) {
                        var tmp = _valuesStartRepeat[property];
                        _valuesStartRepeat[property] = _valuesEnd[property], _valuesEnd[property] = tmp;
                    }
                    _valuesStart[property] = _valuesStartRepeat[property];
                }
                return _yoyo && (_reversed = !_reversed), _startTime = time + _delayTime, !0;
            }
            null !== _onCompleteCallback && _onCompleteCallback.call(_object);
            for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) _chainedTweens[i].start(time);
            return !1;
        }
        return !0;
    };
}, TWEEN.Easing = {
    Linear: {
        None: function(k) {
            return k;
        }
    },
    Quadratic: {
        In: function(k) {
            return k * k;
        },
        Out: function(k) {
            return k * (2 - k);
        },
        InOut: function(k) {
            return (k *= 2) < 1 ? .5 * k * k : -.5 * (--k * (k - 2) - 1);
        }
    },
    Cubic: {
        In: function(k) {
            return k * k * k;
        },
        Out: function(k) {
            return --k * k * k + 1;
        },
        InOut: function(k) {
            return (k *= 2) < 1 ? .5 * k * k * k : .5 * ((k -= 2) * k * k + 2);
        }
    },
    Quartic: {
        In: function(k) {
            return k * k * k * k;
        },
        Out: function(k) {
            return 1 - --k * k * k * k;
        },
        InOut: function(k) {
            return (k *= 2) < 1 ? .5 * k * k * k * k : -.5 * ((k -= 2) * k * k * k - 2);
        }
    },
    Quintic: {
        In: function(k) {
            return k * k * k * k * k;
        },
        Out: function(k) {
            return --k * k * k * k * k + 1;
        },
        InOut: function(k) {
            return (k *= 2) < 1 ? .5 * k * k * k * k * k : .5 * ((k -= 2) * k * k * k * k + 2);
        }
    },
    Sinusoidal: {
        In: function(k) {
            return 1 - Math.cos(k * Math.PI / 2);
        },
        Out: function(k) {
            return Math.sin(k * Math.PI / 2);
        },
        InOut: function(k) {
            return .5 * (1 - Math.cos(Math.PI * k));
        }
    },
    Exponential: {
        In: function(k) {
            return 0 === k ? 0 : Math.pow(1024, k - 1);
        },
        Out: function(k) {
            return 1 === k ? 1 : 1 - Math.pow(2, -10 * k);
        },
        InOut: function(k) {
            return 0 === k ? 0 : 1 === k ? 1 : (k *= 2) < 1 ? .5 * Math.pow(1024, k - 1) : .5 * (2 - Math.pow(2, -10 * (k - 1)));
        }
    },
    Circular: {
        In: function(k) {
            return 1 - Math.sqrt(1 - k * k);
        },
        Out: function(k) {
            return Math.sqrt(1 - --k * k);
        },
        InOut: function(k) {
            return (k *= 2) < 1 ? -.5 * (Math.sqrt(1 - k * k) - 1) : .5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
        }
    },
    Elastic: {
        In: function(k) {
            var s, a = .1;
            return 0 === k ? 0 : 1 === k ? 1 : (!a || a < 1 ? (a = 1, s = .1) : s = .4 * Math.asin(1 / a) / (2 * Math.PI), 
            -a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / .4));
        },
        Out: function(k) {
            var s, a = .1;
            return 0 === k ? 0 : 1 === k ? 1 : (!a || a < 1 ? (a = 1, s = .1) : s = .4 * Math.asin(1 / a) / (2 * Math.PI), 
            a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / .4) + 1);
        },
        InOut: function(k) {
            var s, a = .1;
            return 0 === k ? 0 : 1 === k ? 1 : (!a || a < 1 ? (a = 1, s = .1) : s = .4 * Math.asin(1 / a) / (2 * Math.PI), 
            (k *= 2) < 1 ? a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / .4) * -.5 : a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / .4) * .5 + 1);
        }
    },
    Back: {
        In: function(k) {
            var s = 1.70158;
            return k * k * ((s + 1) * k - s);
        },
        Out: function(k) {
            var s = 1.70158;
            return --k * k * ((s + 1) * k + s) + 1;
        },
        InOut: function(k) {
            var s = 2.5949095;
            return (k *= 2) < 1 ? k * k * ((s + 1) * k - s) * .5 : .5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
        }
    },
    Bounce: {
        In: function(k) {
            return 1 - TWEEN.Easing.Bounce.Out(1 - k);
        },
        Out: function(k) {
            return k < 1 / 2.75 ? 7.5625 * k * k : k < 2 / 2.75 ? 7.5625 * (k -= 1.5 / 2.75) * k + .75 : k < 2.5 / 2.75 ? 7.5625 * (k -= 2.25 / 2.75) * k + .9375 : 7.5625 * (k -= 2.625 / 2.75) * k + .984375;
        },
        InOut: function(k) {
            return k < .5 ? .5 * TWEEN.Easing.Bounce.In(2 * k) : .5 * TWEEN.Easing.Bounce.Out(2 * k - 1) + .5;
        }
    }
}, TWEEN.Interpolation = {
    Linear: function(v, k) {
        var m = v.length - 1, f = m * k, i = Math.floor(f), fn = TWEEN.Interpolation.Utils.Linear;
        return k < 0 ? fn(v[0], v[1], f) : k > 1 ? fn(v[m], v[m - 1], m - f) : fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
    },
    Bezier: function(v, k) {
        var i, b = 0, n = v.length - 1, pw = Math.pow, bn = TWEEN.Interpolation.Utils.Bernstein;
        for (i = 0; i <= n; i++) b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
        return b;
    },
    CatmullRom: function(v, k) {
        var m = v.length - 1, f = m * k, i = Math.floor(f), fn = TWEEN.Interpolation.Utils.CatmullRom;
        return v[0] === v[m] ? (k < 0 && (i = Math.floor(f = m * (1 + k))), fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i)) : k < 0 ? v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]) : k > 1 ? v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]) : fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
    },
    Utils: {
        Linear: function(p0, p1, t) {
            return (p1 - p0) * t + p0;
        },
        Bernstein: function(n, i) {
            var fc = TWEEN.Interpolation.Utils.Factorial;
            return fc(n) / fc(i) / fc(n - i);
        },
        Factorial: function() {
            var a = [ 1 ];
            return function(n) {
                var i, s = 1;
                if (a[n]) return a[n];
                for (i = n; i > 1; i--) s *= i;
                return a[n] = s;
            };
        }(),
        CatmullRom: function(p0, p1, p2, p3, t) {
            var v0 = .5 * (p2 - p0), v1 = .5 * (p3 - p1), t2 = t * t;
            return (2 * p1 - 2 * p2 + v0 + v1) * (t * t2) + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
        }
    }
}, function(root) {
    "function" == typeof define && define.amd ? define([], function() {
        return TWEEN;
    }) : "object" == typeof exports ? module.exports = TWEEN : root.TWEEN = TWEEN;
}(this);

var Singleton, exports;

exports = void 0, void 0 !== exports && null !== exports || (exports = {}), Singleton = function() {
    function Singleton() {}
    return Singleton;
}();

var SceneManager;

SceneManager = function() {
    function SceneManager() {}
    var instance;
    return instance = null, Singleton.SceneManager = function() {
        function SceneManager() {}
        return SceneManager.prototype.scenes = [], SceneManager.prototype.currentSceneIndex = void 0, 
        SceneManager.prototype.currentScene = function() {
            if (null == this.currentSceneIndex) throw new Error("SceneManager.setScene not called");
            if (this.isEmpty()) throw new Error("Requires at least one scene");
            return this.scenes[this.currentSceneIndex];
        }, SceneManager.prototype.addScene = function(scene) {
            if (null == scene) throw new Error("missing scene param");
            if (-1 === this.scenes.indexOf(scene)) return this.scenes.push(scene);
        }, SceneManager.prototype.removeScene = function(scene) {
            var i;
            if (null == scene) throw new Error("missing scene param");
            return i = this.scenes.indexOf(scene), this.removeSceneByIndex(i);
        }, SceneManager.prototype.removeSceneByIndex = function(i) {
            if (i >= 0) return i === this.currentSceneIndex && (this.currentSceneIndex = void 0), 
            array.splice(i, 1);
        }, SceneManager.prototype.setScene = function(scene) {
            var i;
            if (null == scene) throw new Error("missing scene param");
            if (-1 === (i = this.scenes.indexOf(scene))) throw new Error("scene not added to SceneManager");
            return this.setSceneByIndex(i), this.currentScene();
        }, SceneManager.prototype.setSceneByIndex = function(i) {
            var debugMsg, scene;
            if (this.isEmpty() || !this.isValidIndex(i)) throw new Error("invalid scene index");
            this.currentSceneIndex = i, scene = this.currentScene(), debugMsg = "Changing to scene " + i;
            try {
                debugMsg += ": " + scene.constructor.name;
            } catch (error) {
                error;
            }
            return console.ce(debugMsg), scene;
        }, SceneManager.prototype.isEmpty = function() {
            return 0 === this.scenes.length;
        }, SceneManager.prototype.isValidIndex = function(i) {
            return 0 <= i && i < this.scenes.length;
        }, SceneManager.prototype.hasScene = function(scene) {
            return this.scenes.includes(scene);
        }, SceneManager.prototype.tick = function(tpf) {
            return this.currentScene().fullTick(tpf);
        }, SceneManager;
    }(), SceneManager.get = function() {
        return null != instance ? instance : instance = new Singleton.SceneManager();
    }, SceneManager.currentScene = function() {
        return this.get().currentScene();
    }, SceneManager.addScene = function(scene) {
        return this.get().addScene(scene);
    }, SceneManager;
}();

var Persist;

Persist = function() {
    function Persist() {
        this.storage = localStorage;
    }
    return Persist.PREFIX = "ce", Persist.DEFAULT_SUFFIX = "default", Persist.prototype.setJson = function(key, value, def) {
        return null == def && (def = void 0), value = JSON.stringify(value), null != def && (def = JSON.stringify(def)), 
        this.set(key, value, def);
    }, Persist.prototype.set = function(key, value, def) {
        if (null == def && (def = void 0), null == key) throw "key missing";
        if (this.storage[Persist.PREFIX + "." + key] = value, null != def) return this.default(key, def);
    }, Persist.prototype.defaultJson = function(key, value) {
        return value = JSON.stringify(value), this.default(key, value);
    }, Persist.prototype.default = function(key, value) {
        return this.set(key + "." + Persist.DEFAULT_SUFFIX, value);
    }, Persist.prototype.getJson = function(key) {
        var item;
        if (null != (item = this.get(key))) return JSON.parse(item);
    }, Persist.prototype.get = function(key) {
        var value;
        return value = this._get(key), null == value ? this._get(key + "." + Persist.DEFAULT_SUFFIX) : value;
    }, Persist.prototype._get = function(key) {
        var value;
        if (null == key) throw "key missing";
        return value = this.storage[Persist.PREFIX + "." + key], isNumeric(value) ? Number(value) : "true" === value || "false" !== value && ("undefined" !== value ? value : void 0);
    }, Persist.prototype.rm = function(key) {
        if (null == key) throw "key missing";
        return this.storage.removeItem(Persist.PREFIX + "." + key);
    }, Persist.prototype.clear = function(exceptions, withDefaults) {
        var results, storage;
        null == exceptions && (exceptions = []), null == withDefaults && (withDefaults = !1), 
        exceptions instanceof Array || (exceptions = [ exceptions ]), results = [];
        for (storage in this.storage) storage.endsWith("." + Persist.DEFAULT_SUFFIX) && !1 === withDefaults || (exceptions.includes(storage) ? results.push(void 0) : results.push(this.rm(storage)));
        return results;
    }, Persist.sessionStorage = function() {
        var persist;
        return persist = new Persist(), persist.storage = sessionStorage, persist;
    }, Persist.getJson = function(key) {
        return new Persist().getJson(key);
    }, Persist.get = function(key) {
        return new Persist().get(key);
    }, Persist.setJson = function(key, value, def) {
        return new Persist().setJson(key, value, def);
    }, Persist.set = function(key, value, def) {
        return new Persist().set(key, value, def);
    }, Persist.default = function(key, value) {
        return new Persist().default(key, value);
    }, Persist.defaultJson = function(key, value) {
        return new Persist().defaultJson(key, value);
    }, Persist.rm = function(key) {
        return new Persist().rm(key);
    }, Persist.clear = function(exceptions, withDefaults) {
        return new Persist().clear(exceptions, withDefaults);
    }, Persist;
}();

var Utils;

Utils = function() {
    function Utils() {}
    return Utils.JSON_URLS = [ ".json" ], Utils.IMG_URLS = [ ".png", ".jpg", ".jpeg" ], 
    Utils.SAVE_URLS = [ ".save.json" ], Utils.AUDIO_URLS = [ ".mp3", ".ogg", ".wav" ], 
    Utils.CAMERA_DEFAULT_VIEW_ANGLE = 45, Utils.CAMERA_DEFAULT_NEAR = 1, Utils.CAMERA_DEFAULT_FAR = 1e5, 
    Utils.CAMERA_DEFAULT_TYPE = "PerspectiveCamera", Utils.SKY_SPHERE_DEFAULT_RADIUS = 5e4, 
    Utils.SKY_SPHERE_DEFAULT_SEGMENTS = 64, Utils.PLANE_DEFAULT_COLOR = "#ff0000", Utils.PLANE_DEFAULT_WIDTH = 5, 
    Utils.PLANE_DEFAULT_HEIGHT = 5, Utils.PLANE_DEFAULT_W_SEGMENTS = 1, Utils.PLANE_DEFAULT_H_SEGMENTS = 1, 
    Utils.AMBIENT_LIGHT_DEFAULT_COLOR = "#404040", Utils.LIGHT_DEFAULT_COLOR = "#ffffff", 
    Utils.LIGHT_DEFAULT_POSITION_X = 0, Utils.LIGHT_DEFAULT_POSITION_Y = 100, Utils.LIGHT_DEFAULT_POSITION_Z = 60, 
    Utils.POINT_LIGHT_DEFAULT_COLOR = "#ffffff", Utils.POINT_LIGHT_DEFAULT_INTENSITY = 1, 
    Utils.POINT_LIGHT_DEFAULT_DISTANCE = 100, Utils.POINT_LIGHT_DEFAULT_DECAY = 1, Utils.MIRROR_DEFAULT_COLOR = "#777777", 
    Utils.MIRROR_DEFAULT_TEXTURE_WIDTH = 512, Utils.MIRROR_DEFAULT_TEXTURE_HEIGHT = 512, 
    Utils.MIRROR_DEFAULT_CLIP_BIAS = .003, Utils.WATER_DEFAULT_WATER_COLOR = "#001e0f", 
    Utils.WATER_DEFAULT_ALPHA = 1, Utils.CE_BUTTON_POSITIONS = [ "top-right", "bottom-right", "top-left", "bottom-left" ], 
    Utils.CE_BUTTON_TYPES = [ "fullscreen", "reinit" ], Utils.CE_UI_Z_INDEX = 1e3, Utils.ORIENTATIONS = [ "all", "landscape", "portrait" ], 
    Utils.FADE_COLOR = "black", Utils.FADE_DEFAULT_DURATION = 1e3, Utils.PHYSICS = {
        DISABLE_DEACTIVATION: 4
    }, Utils.toggleFullscreen = function() {
        document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement ? document.exitFullscreen ? document.exitFullscreen() : document.msExitFullscreen ? document.msExitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen && document.webkitExitFullscreen() : document.documentElement.requestFullscreen ? document.documentElement.requestFullscreen() : document.documentElement.msRequestFullscreen ? document.documentElement.msRequestFullscreen() : document.documentElement.mozRequestFullScreen ? document.documentElement.mozRequestFullScreen() : document.documentElement.webkitRequestFullscreen && document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }, Utils.guid = function() {
        var s4;
        return (s4 = function() {
            return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
        })() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    }, Utils.setCursor = function(url) {
        return document.body.style.cursor = "url('" + url + "'), auto";
    }, Utils.rgbToHex = function(r, g, b) {
        if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
        return (r << 16 | g << 8 | b).toString(16);
    }, Utils.degToRadians = function(angle) {
        return angle * Math.PI / 180;
    }, Utils.getKeyName = function(url, array) {
        return url.replaceAny(array, "").split("/").last();
    }, Utils.encrypt = function(json) {
        var s;
        return s = JSON.stringify(json), window.btoa(s);
    }, Utils.decrypt = function(s) {
        return JSON.parse(window.atob(s));
    }, Utils.saveFile = function(content, fileName, format) {
        var blob, json;
        return null == format && (format = "application/json"), Utils._ensureBlobPresence(), 
        json = JSON.stringify(content, null, 2), blob = new Blob([ json ], {
            type: format + ";charset=utf-8"
        }), saveAs(blob, fileName);
    }, Utils.saveScreenshot = function(engine, fileName) {
        var content;
        return null == fileName && (fileName = "screenshot.png"), Utils._ensureBlobPresence(), 
        content = engine.getScreenshot(), saveAs(Utils.base64ToBlob(content), fileName);
    }, Utils._ensureBlobPresence = function() {
        try {
            return !!new Blob();
        } catch (error) {
            throw error, "FileSaver not supported";
        }
    }, Utils.base64ToBlob = function(b64Data, contentType, sliceSize) {
        var byteArray, byteArrays, byteCharacters, byteNumbers, i, offset, slice;
        for (contentType = contentType || "", sliceSize = sliceSize || 512, byteCharacters = atob(b64Data), 
        byteArrays = [], offset = 0; offset < byteCharacters.length; ) {
            for (slice = byteCharacters.slice(offset, offset + sliceSize), byteNumbers = new Array(slice.length), 
            i = 0; i < slice.length; ) byteNumbers[i] = slice.charCodeAt(i), i++;
            byteArray = new Uint8Array(byteNumbers), byteArrays.push(byteArray), offset += sliceSize;
        }
        return new Blob(byteArrays, {
            type: contentType
        });
    }, Utils.addCEButton = function(options) {
        var img, posArray;
        if (null == options && (options = {}), null == options.size && (options.size = "32px"), 
        null == options.padding && (options.padding = "32px"), null == options.position && (options.position = "bottom-right"), 
        null == options.type && (options.type = "fullscreen"), options.size.endsWith("px") || (options.size = options.size + "px"), 
        options.padding.endsWith("px") || (options.padding = options.padding + "px"), !Utils.CE_BUTTON_TYPES.includes(options.type)) throw new Error("invalid type " + options.type);
        if (!document.querySelector(".ce-button-" + options.type)) {
            if (!Utils.CE_BUTTON_POSITIONS.includes(options.position)) throw new Error("invalid position " + options.position);
            return posArray = options.position.split("-"), img = document.createElement("img"), 
            img.style = "position: absolute; width: " + options.size + "; height: " + options.size + ";" + posArray[0] + ": " + options.padding + "; " + posArray[1] + ": " + options.padding, 
            img.setAttribute("class", "ce-button-" + options.type), "fullscreen" === options.type ? (img.setAttribute("onclick", "Utils.toggleFullscreen()"), 
            img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AYMDR07WbntUQAAAMZJREFUWMPtl7ENgzAQRR+IkhFYIdUVUTKP9wjswSCZIBHFVVmBEVKbNBTIMsFBcpLiXnlC9ke+7/suRGQinU5V23cfiEgLXFIXLPkxJqCK1J7AY0XcmLDmCAyRugcOQL0sFpEmvKvqOcffisgNOG0dQfnNI7cmNAEV0O2w2l564IphGEYwjsOMN6pqn2kcO6AJb8IwQA7zjZUDBxxtGJmALQE+434+ZsPpg1jeb1l0tppLjeWxd0EdRucFKWGiCa1mTfjXAl7JzisvsBIkfgAAAABJRU5ErkJggg==") : "reinit" === options.type && (img.setAttribute("onclick", 'Hodler.item("engine").initScene(SceneManager.currentScene())'), 
            img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfgBgwNMCmKKsb2AAACbklEQVRIx5XVz2tcVRQH8M971dZ01GppNWbhSHFjdJXTookiCOpGChKKVv8E68Yfiy6sol0J1l3ddCmIOxfBleBCyISqZ1BoxIUUuxCNJdVYiaEQdDF3zEzn1XG+m8u795zvvfec+77fSkHI3njEvCMeczQvGEI/YhiVnbR5C+7tL2Q1GhxP5WfX09wU73peeyT2e034MLY858tBktrbWv4eCV1pJLim7Xy8l2KAYFPb+ghFZ66JoAavxec7FHWyqe3X60/QbSJ4v4xPxHKfol/EM14djGwqIcQhF0yBM/l6IQjC18MlzAduQMBt1grFI86nmmSprP9UatFcQiRXzZaPjxN1iGfdA067v5SzuYSFIn90EtwXx0JFfOUwtnIq2OuSAx7KVf+J+FMLK7lQR8th8BalI5vj0nEazMettWfK1Llyx83tO43HuTI+WXsYXM7f+nf85tr4/Lzid/B4Xf6Db02KXuNnanfAyEscj3VwoC5vsZqYYBvsql0FBycmuAts1H4AcxMT9DIu1kUb9kd7kuxo299rR+3TMvfCRPv3o5cqIs3hr9w7wQk2TaGbsSvYcAw3z2z//MX/TH/D0+CVmdUK4hd3gwd9l+OSmdX7V9Zymppgsax2tWJcektf7RajJ5MpO86C3db/lYtmzFq3G3yQnezrbMiXLaOyx2qcuuH+p6zao0InTwyLqhTLFkrklnd8lJeG+v6iN93SF/18tG8u1aDzxVkvDWx4RddlHDRXno1y+BM73lQNm2fM+6R0pBlrFrMzbG2DistKTjuu0VV0Hc9pHUP22uTBUtzuqHDIPmy4KC3lH00G/w/Uq7TDOW+poQAAAABJRU5ErkJggg=="), 
            null != options.src && (img.src = options.src), document.body.appendChild(img);
        }
    }, Utils.isMobile = function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }, Utils.orientation = function(orientation) {
        var a1, a2, baseStyle, div, existingElement, existingStyle, img, style;
        if (null == orientation && (orientation = "all"), existingElement = document.querySelector(".ce-turn-screen"), 
        null != existingElement && document.body.removeChild(existingElement), existingStyle = document.querySelector(".ce-turn-screen-style"), 
        null != existingStyle && document.head.removeChild(existingStyle), "all" !== orientation) {
            if (!Utils.ORIENTATIONS.includes(orientation)) throw new Error("invalid orientation type '" + orientation + "'");
            return div = document.createElement("div"), div.setAttribute("class", "ce-turn-screen"), 
            div.style = "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; background-color: #f0f0f0; z-index: " + Utils.CE_UI_Z_INDEX + ";", 
            img = document.createElement("img"), img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AYNDy012n9FrgAABkxJREFUeNrt3T1sG+cBgGGTRx3FH5GipADhjyGAg5EgaBa1BWog7dIgY5DFXQLEBRJ4yFI0S7aqyOAtS1B3bBEgWYIMLYJ0MZKxk7yoSzoYgmFRaAtRKgmSIU++6xKgi4eTJYo0+TzzR+l0pxffd+Tx7to1AAAAAAAAAOD/MnbB07Xb7d2HDx/uTvN37OzsJPb0bOzt7aX638/aVU9Xq9V+1263d+2J5SYQkSAQkSAQkSAQkSAQkSAQkSAQkSAQkbCocsv2BzcajReDIHg1CIJXgiBo53K57SAI6kEQbGaz2Vo2m13NZDLhOSK5Nu1P3NN+6svlX52w8IE0m80bKysrb4Rh+Nrq6urNlZWV5hRmkqlHghnk0rRarZ/m8/lbxWLxrTAM21e03BKJQOZ66fRCPp+/XSqV3s3n8zdmdE4iEoHM3RLq5UKh8MHa2trb2Ww2Pwcn7iIRyFyE8VKpVNotl8u3MpmMk1gE8sNSaqtYLH5UqVTey2QywTxt28nJye/NHgKZiXq9ngnD8M76+vrdXC63Pm/bJw6BzHI51a5UKn8qFos/n8ftE4dAZmZ7e/udWq32SRAEa1f1O5MkeZJ2+SYOgcxqSbVaKpXuVavVX1/2zz47OzudTCb7URTtR1G0H8fxQRzHnSRJ/pUkSffo6ChK84msOAQyqyVVo1qt/qVQKPz4Mn5eHMfj4XD4zXg8vh9F0f04jvePjo4udEmCOAQyqzh+tLGx8XUYhq0LLpOS4XD47Wg0+iyKoi87nc5/nXPwXAfSarVubm1tfR0EQfUCs8X3/X7/09Fo9PHh4eF3TshZiECuX7/+i83Nza+CICg/YxiTXq93bzQa3e10Ov+exjaKQyCzmjl+dpE4+v3+F4PB4MPDw8OH09pGcQhkZuccW1tbf3uWOKIo6pyent559OjRV9PcRnEIZFZxNDY2Np7pnKPX630+GAze73Q6p+Jg4QKp1+ur1Wr1r+d9typJkqjb7f7m4ODg3rS3URzMLJByufzHQqGwc57XnJ2d/ef4+PjNx48f/10cLGwg29vb71Qqldvnec1kMnnU7XZfPzw8/OdVbKM4mEkgzWazXavVPjnPa8bj8XfdbveXnU7nsUPGVbrS2/7U6/VMpVL583kuPPxh5hAHix9IGIZ3isXia+c55+h2u6+Lg4UPpNFobK2vr99NOz6O48nx8fGbV3XOATMNpFgsfnSebwKenJz89irerYKZB9JsNl+qVCrvpR3f6/U+Pzg4+IPDw1IEUiqVdtN+Qy+Kos5gMHjfoWEpAmk2my+Xy+Vbacefnp7emfblIzA3gRQKhQ/S3req3+9/Me0LD2FuAmk0Gi+sra29nWZsHMeTwWDwoUPC0gSSz+dvp70daK/XuzfN73PA3AVSKpXeTTl7fD8aje46HCxNIK1W6ydp77Le7/c/ndbXZGEuA8nn879KMy5JkmQ0Gn3sULBUgRSLxbfSjBsOh99O4+4jMLeBNJvNG2mf7DQajT5zGFiqQFZWVt5IeXI+jqLoS4eBpQokDMNUl7QPh8NvLvOOh/BcBLK6unozzbjxeHzfIWCpAmk0Gi+mfdRyFEUCYbkCCYLg1TTjzs7OTuM43ncIWLZAXkkzbjKZXPgRBPA8BpLq7d0oisweLF8guVxuO+US6x92P8s4g9TTjHvy5MmB3c8yBrKZZlySJB27n6ULJJvN1tKMi+PY1bssZSCrKWcQ3ztn+QLJZDJhmnFHR0cju595d+k3r37w4EFgt2IGAYGAQACBgEBAICAQEAgIBAQCAgGBAAIBgYBAQCAgEBAICAQEAgIBgQACAYHA5Ul947idnR0Pu5mR53Hf7+3tZcwgYIkFAgEEAgIBgYBAQCAgEHguXfoj2BblE1SebtmuqDCDgEBAICAQEAgIBAQCAgGBgEAAgYBAQCAgEBAICAQEAgIBgYBAAIGAQEAgIBAQCAgEBAICAYEAAgGBgEBAICAQmDc5u4BpWJRHtZlBQCAgEBAICAQEAgIBgYBAYAn5JJ2p2Nvby5hBwBILBAIIBAQCAgGBgEBAICAQEAgIBBAICAQEAgIBgYBAQCAgEBAICAQQCAgEBAICAYGAQEAgsFAu/e7ui/J8bDCDgEBAICAQEAgIBAQCAgGBAAAAAAAAAADAtf8BFNg15uCjV1oAAAAASUVORK5CYII=", 
            baseStyle = "position: absolute; margin: auto; top: 0; left: 0; right: 0; bottom: 0;", 
            "landscape" === orientation ? (img.style = baseStyle + "transform: rotate(90deg);", 
            a1 = "canvas#coffee-engine-dom", a2 = ".ce-turn-screen") : (img.style = baseStyle, 
            a1 = ".ce-turn-screen", a2 = "canvas#coffee-engine-dom"), style = document.createElement("style"), 
            style.setAttribute("class", "ce-turn-screen-style"), style.setAttribute("type", "text/css"), 
            style.setAttribute("media", "all"), style.innerHTML = "@media all and (orientation:portrait) { " + a1 + " { display: none; } } @media all and (orientation:landscape) { " + a2 + " { display: none; } }", 
            document.head.appendChild(style), div.appendChild(img), document.body.appendChild(div);
        }
    }, Utils.overrideConsole = function() {
        return window._log = console.log, window._warn = console.warn, window._info = console.info, 
        window._error = console.error, window._ceOutput = "coffee-engine console >", console.log = function(message) {
            var html;
            window._ceOutput += "\n" + message, html = document.querySelector(".ce-console-text"), 
            null != html && (html.innerHTML = window._ceOutput, html.scrollTop = html.scrollHeight), 
            window._log.apply(console, arguments);
        }, console.info = function(message) {
            var html;
            window._ceOutput += "\n" + message, html = document.querySelector(".ce-console-text"), 
            null != html && (html.innerHTML = window._ceOutput, html.scrollTop = html.scrollHeight), 
            window._info.apply(console, arguments);
        }, console.warn = function(message) {
            var html;
            window._ceOutput += "\n" + message, html = document.querySelector(".ce-console-text"), 
            null != html && (html.innerHTML = window._ceOutput, html.scrollTop = html.scrollHeight), 
            window._warn.apply(console, arguments);
        }, console.error = function(message) {
            var html;
            window._ceOutput += "\n" + message, html = document.querySelector(".ce-console-text"), 
            null != html && (html.innerHTML = window._ceOutput, html.scrollTop = html.scrollHeight), 
            window._error.apply(console, arguments);
        };
    }, Utils.console = function() {
        var div, divText, existingElement, existingStyle, style;
        return null == window._ceOutput && this.overrideConsole(), existingElement = document.querySelector(".ce-console"), 
        null != existingElement ? (document.body.removeChild(existingElement), existingStyle = document.head.querySelector(".ce-console-style"), 
        null != existingStyle && document.head.removeChild(existingStyle), !1) : (div = document.createElement("div"), 
        div.setAttribute("class", "ce-console"), divText = document.createElement("div"), 
        divText.setAttribute("class", "ce-console-text"), "undefined" != typeof _ceOutput && null !== _ceOutput && (divText.innerHTML = _ceOutput), 
        style = document.createElement("style"), style.setAttribute("class", "ce-console-style"), 
        style.setAttribute("type", "text/css"), style.setAttribute("media", "all"), style.innerHTML = ".ce-console { position: absolute; top: 0px; left: 0px; width: 100%; z-index: 3; background-color: gray; } .ce-console-text { height: 120px; padding: 5px; overflow-y: scroll; white-space: pre; color: black; }", 
        document.head.appendChild(style), div.appendChild(divText), document.body.appendChild(div), 
        !0);
    }, Utils.fade = function(options) {
        var animationEvent, div, existingElement, existingStyle, pointerEvents, style;
        return null == options && (options = {}), null == options.duration && (options.duration = Utils.FADE_DEFAULT_DURATION), 
        options.duration = options.duration / 1e3, null == options.type && (options.type = "in"), 
        "in" === options.type ? (options.opacityFrom = 0, options.opacityTo = 1) : (options.opacityFrom = 1, 
        options.opacityTo = 0), null == options.clickThrough && (options.clickThrough = !0), 
        existingElement = document.querySelector(".ce-fader"), null != existingElement && (document.body.removeChild(existingElement), 
        null != (existingStyle = document.head.querySelector(".ce-fader-style")) && document.head.removeChild(existingStyle)), 
        div = document.createElement("div"), div.setAttribute("class", "ce-fader"), options.clickThrough && (pointerEvents = "  pointer-events: none;"), 
        style = document.createElement("style"), style.setAttribute("class", "ce-fader-style"), 
        style.setAttribute("type", "text/css"), style.setAttribute("media", "all"), style.innerHTML = ".ce-fader { position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; background-color: " + Utils.FADE_COLOR + "; z-index: " + (Utils.CE_UI_Z_INDEX - 1) + "; " + pointerEvents + " -webkit-animation: fade-animation " + options.duration + "s; /* Safari, Chrome and Opera > 12.1 */ -moz-animation: fade-animation " + options.duration + "s; /* Firefox < 16 */ -ms-animation: fade-animation " + options.duration + "s; /* Internet Explorer */ -o-animation: fade-animation " + options.duration + "s; /* Opera < 12.1 */ animation: fade-animation " + options.duration + "s; } @keyframes fade-animation { from { opacity: " + options.opacityFrom + "; } to   { opacity: " + options.opacityTo + "; } } /* Firefox < 16 */ @-moz-keyframes fade-animation { from { opacity: " + options.opacityFrom + "; } to   { opacity: " + options.opacityTo + "; } } /* Safari, Chrome and Opera > 12.1 */ @-webkit-keyframes fade-animation { from { opacity: " + options.opacityFrom + "; } to   { opacity: " + options.opacityTo + "; } } /* Internet Explorer */ @-ms-keyframes fade-animation { from { opacity: " + options.opacityFrom + "; } to   { opacity: " + options.opacityTo + "; } } /* Opera < 12.1 */ @-o-keyframes fade-animation { from { opacity: " + options.opacityFrom + "; } to   { opacity: " + options.opacityTo + "; } }", 
        document.head.appendChild(style), document.body.appendChild(div), 0 === options.opacityTo && (animationEvent = whichAnimationEvent()) && div.addEventListener(animationEvent, function() {
            document.body.removeChild(div), document.head.removeChild(style);
        }), !0;
    }, Utils;
}(), exports.Utils = Utils;

var BaseScene;

BaseScene = function() {
    function BaseScene(engine) {
        this.engine = engine, this.context = this.engine.context, this.loaded = !1, this.uptime = 0;
    }
    return BaseScene.prototype.fullTick = function(tpf) {
        return this.uptime += tpf, this.tick(tpf);
    }, BaseScene.prototype.tick = function(tpf) {
        throw "scene.tick not implemented";
    }, BaseScene.prototype.doMouseEvent = function(event) {
        throw "scene.doMouseEvent not implemented";
    }, BaseScene.prototype.doKeyboardEvent = function(event) {
        throw "scene.doKeyboardEvent not implemented";
    }, BaseScene.prototype.drawText = function(text) {
        return this.context.fillStyle = "blue", this.context.font = "bold 16px Arial", this.context.fillText(text, 10, 30);
    }, BaseScene.prototype.getHexData = function(x, y, w, h) {
        var p;
        return p = this.context.getImageData(x, y, w, h).data, "#" + ("000000" + Utils.rgbToHex(p[0], p[1], p[2])).slice(-6);
    }, BaseScene;
}();

var BaseModel;

BaseModel = function() {
    function BaseModel(options) {
        if (options.position || (options.position = {}), this.loaded = !1, this.position = {
            x: options.position.x || 0,
            y: options.position.y || 0
        }, null == options.url) throw "missing url";
        this.image = new Image(), this.image.src = options.url, this.image.onload = function(_this) {
            return function() {
                return _this.width = _this.image.width, _this.height = _this.image.height, _this.loaded = !0;
            };
        }(this);
    }
    return BaseModel.prototype.render = function(context) {
        if (this.loaded) return context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }, BaseModel;
}();

var Engine2D, bind = function(fn, me) {
    return function() {
        return fn.apply(me, arguments);
    };
};

Engine2D = function() {
    function Engine2D(canvasId, width, height, windowResize) {
        null == windowResize && (windowResize = !1), this.render = bind(this.render, this), 
        this.onDocumentKeyboardEvent = bind(this.onDocumentKeyboardEvent, this), this.onDocumentMouseEvent = bind(this.onDocumentMouseEvent, this), 
        this.sceneManager = SceneManager.get(), this.time = void 0, this.width = width, 
        this.height = height, this.backgroundColor = "#FFFFFF", this.canvasId = canvasId, 
        document.addEventListener("mousedown", this.onDocumentMouseEvent, !1), document.addEventListener("mouseup", this.onDocumentMouseEvent, !1), 
        document.addEventListener("mousemove", this.onDocumentMouseEvent, !1), document.addEventListener("keydown", this.onDocumentKeyboardEvent, !1), 
        document.addEventListener("keyup", this.onDocumentKeyboardEvent, !1), document.addEventListener("touchstart", this.touchHandler, !1), 
        document.addEventListener("touchmove", this.touchHandler, !1), document.addEventListener("touchend", this.touchHandler, !1), 
        document.addEventListener("touchcancel", this.touchHandler, !1), this.canvas = document.getElementById(this.canvasId), 
        this.canvas.width = width, this.canvas.height = height, this.context = this.canvas.getContext("2d"), 
        windowResize && (window.addEventListener("resize", this.resize, !1), this.resize());
    }
    return Engine2D.prototype.resize = function() {
        var canvasRatio, height, width, windowRatio;
        return canvasRatio = this.canvas.height / this.canvas.width, windowRatio = window.innerHeight / window.innerWidth, 
        width = void 0, height = void 0, windowRatio < canvasRatio ? (height = window.innerHeight, 
        width = height / canvasRatio) : (width = window.innerWidth, height = width * canvasRatio), 
        this.canvas.style.width = width + "px", this.canvas.style.height = height + "px";
    }, Engine2D.prototype.onDocumentMouseEvent = function(event) {
        return this.sceneManager.currentScene().doMouseEvent(event);
    }, Engine2D.prototype.onDocumentKeyboardEvent = function(event) {
        return this.sceneManager.currentScene().doKeyboardEvent(event);
    }, Engine2D.prototype.touchHandler = function(event) {
        var first, simulatedEvent, touches, type;
        switch (touches = event.changedTouches, first = touches[0], type = "", event.type) {
          case "touchstart":
            type = "mousedown";
            break;

          case "touchmove":
            type = "mousemove";
            break;

          case "touchend":
            type = "mouseup";
            break;

          default:
            return;
        }
        simulatedEvent = document.createEvent("MouseEvent"), simulatedEvent.initMouseEvent(type, !0, !0, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, !1, !1, !1, !1, 0, null), 
        first.target.dispatchEvent(simulatedEvent), event.preventDefault();
    }, Engine2D.prototype.clear = function() {
        return this.context.fillStyle = this.backgroundColor, this.context.fillRect(0, 0, this.width, this.height);
    }, Engine2D.prototype.render = function() {
        var now, tpf;
        return requestAnimationFrame(this.render), now = new Date().getTime(), tpf = (now - (this.time || now)) / 1e3, 
        this.time = now, this.sceneManager.tick(tpf);
    }, Engine2D;
}();

var CyclicArray, Playlist, isNumeric, whichAnimationEvent;

Array.prototype.isEmpty = function() {
    return 0 === this.length;
}, Array.prototype.any = function() {
    return !this.isEmpty();
}, Array.prototype.clear = function() {
    var results;
    for (results = []; this.any(); ) results.push(this.pop());
    return results;
}, Array.prototype.last = function() {
    return this[this.length - 1];
}, Array.prototype.first = function() {
    return this[0];
}, Array.prototype.size = function() {
    return this.length;
}, Array.prototype.includes = function(e) {
    return -1 !== this.indexOf(e);
}, Array.prototype.shuffle = function() {
    var array, i, m, t;
    for (array = this, m = array.length, t = void 0, i = void 0; m; ) i = Math.floor(Math.random() * m--), 
    t = array[m], array[m] = array[i], array[i] = t;
    return array;
}, Array.prototype.equalsArray = function(a) {
    var eq, i, j, ref;
    for (eq = !0, i = j = 0, ref = a.size(); 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) if (a[i] !== this[i]) {
        eq = !1;
        break;
    }
    return eq;
}, Array.prototype.random = function() {
    return this.shuffle().first();
}, Array.prototype.diff = function(a) {
    return this.filter(function(i) {
        return a.indexOf(i) < 0;
    });
}, Array.prototype.remove = function(e) {
    var pos;
    return pos = this.indexOf(e), pos > -1 && this.splice(pos, 1), pos > -1 ? e : null;
}, Array.prototype.findById = function(id) {
    return this.filter(function(i) {
        return i.id === id;
    });
}, Array.prototype.sum = function() {
    var e, j, len, ref, sum;
    for (sum = 0, ref = this, j = 0, len = ref.length; j < len; j++) e = ref[j], sum += e;
    return sum;
}, Array.prototype.where = function(hash) {
    return this.filter(function(d) {
        var found, item, j, key, len, ok, ref;
        ok = !0;
        for (key in hash) if (found = !1, hash[key] instanceof Array) {
            for (ref = hash[key], j = 0, len = ref.length; j < len; j++) if (item = ref[j], 
            d[key] === item) {
                found = !0;
                break;
            }
            ok = ok && found;
        } else ok = ok && d[key] === hash[key];
        return ok;
    });
}, Array.prototype.insert = function(index, item) {
    this.splice(index, 0, item);
}, Array.prototype.toCyclicArray = function() {
    return new CyclicArray(this);
}, Array.prototype.shallowClone = function() {
    return JSON.parse(JSON.stringify(this));
}, String.prototype.size = function(s) {
    return this.length;
}, String.prototype.startsWith = function(s) {
    return 0 === this.indexOf(s);
}, String.prototype.startsWithAny = function(prefixes) {
    var j, len, prefix, startsWith;
    for (startsWith = !1, j = 0, len = prefixes.length; j < len; j++) prefix = prefixes[j], 
    this.startsWith(prefix) && (startsWith = !0);
    return startsWith;
}, String.prototype.endsWith = function(suffix) {
    return -1 !== this.indexOf(suffix, this.length - suffix.length);
}, String.prototype.endsWithAny = function(suffixes) {
    var endsWith, j, len, suffix;
    if (endsWith = !1, null == suffixes) return !1;
    for (j = 0, len = suffixes.length; j < len; j++) suffix = suffixes[j], this.endsWith(suffix) && (endsWith = !0);
    return endsWith;
}, String.prototype.replaceAny = function(sources, dest) {
    var j, len, source, tmp;
    for (tmp = this, j = 0, len = sources.length; j < len; j++) source = sources[j], 
    tmp = tmp.replace(source, dest);
    return tmp;
}, String.prototype.isEmpty = function() {
    return 0 === this.size();
}, String.prototype.contains = function(s) {
    return -1 !== this.indexOf(s);
}, String.prototype.containsAny = function(strings) {
    var containsAny, j, len, s;
    if (containsAny = !1, null == strings) return !1;
    for (j = 0, len = strings.length; j < len; j++) s = strings[j], this.contains(s) && (containsAny = !0);
    return containsAny;
}, String.prototype.isPresent = function() {
    return null != this && !this.isEmpty();
}, String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}, isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}, Number.prototype.endsWith = function(s) {
    return this.toString().endsWith(s);
}, console.ce = function(message) {
    ("undefined" == typeof Config || null === Config || Config.get().debug) && console.log(message);
}, CyclicArray = function() {
    function CyclicArray(items) {
        null == items && (items = []), this.items = items, this.index = 0;
    }
    return CyclicArray.prototype.get = function() {
        return this.items[this.index];
    }, CyclicArray.prototype.next = function() {
        return this.index += 1, this.index > this.items.size() - 1 && (this.index = 0), 
        this.get();
    }, CyclicArray.prototype.prev = function() {
        return this.index -= 1, this.index < 0 && (this.index = this.items.size() - 1), 
        this.get();
    }, CyclicArray.prototype.size = function() {
        return this.items.size();
    }, CyclicArray;
}(), whichAnimationEvent = function() {
    var animations, el, t;
    el = document.createElement("fakeelement"), animations = {
        animation: "animationend",
        OAnimation: "oAnimationEnd",
        MozAnimation: "animationend",
        WebkitAnimation: "webkitAnimationEnd"
    };
    for (t in animations) if (void 0 !== el.style[t]) return animations[t];
}, Playlist = function() {
    function Playlist(keys) {
        var j, key, len;
        if (!(keys instanceof Array)) throw new Error("keys needs to be an array");
        for (j = 0, len = keys.length; j < len; j++) if (key = keys[j], !SoundManager.has(key)) throw new Error("key '" + key + "' not loaded in SoundManager");
        this.items = new CyclicArray(keys);
    }
    return Playlist.prototype.cmd = function(options) {
        var audio, item, j, len, ref;
        if (options.key = this.items.get(), "volumeAll" === options.type) for (options.type = "volume", 
        ref = this.items.items, j = 0, len = ref.length; j < len; j++) item = ref[j], options.key = item, 
        SoundManager.cmd(options); else audio = SoundManager.cmd(options);
        return [ "play", "fadeIn" ].includes(options.type) ? (audio._onend = [], audio.on("end", function(_this) {
            return function(data) {
                return _this.items.next(), _this.cmd(options);
            };
        }(this))) : [ "volume", "volumeAll" ].includes(options.type) ? void 0 : audio._onend = [];
    }, Playlist.prototype.getPlayingKey = function() {
        return this.items.get();
    }, Playlist.prototype.getPlayingAudio = function() {
        return SoundManager.get().items[this.getPlayingKey()];
    }, Playlist;
}();

var Hodler;

Hodler = function() {
    function Hodler() {}
    var instance;
    return instance = null, Singleton.Hodler = function() {
        function Hodler() {}
        return Hodler.prototype.items = {}, Hodler.prototype.add = function(key, item) {
            return this.items[key] = item, this.item(key);
        }, Hodler.prototype.item = function(key) {
            return this.items[key];
        }, Hodler;
    }(), Hodler.get = function() {
        return null != instance ? instance : instance = new Singleton.Hodler();
    }, Hodler.add = function(key, item) {
        return this.get().add(key, item);
    }, Hodler.item = function(key) {
        return this.get().item(key);
    }, Hodler;
}(), function() {
    var cache = {}, ctx = null, usingWebAudio = !0, noAudio = !1;
    try {
        "undefined" != typeof AudioContext ? ctx = new AudioContext() : "undefined" != typeof webkitAudioContext ? ctx = new webkitAudioContext() : usingWebAudio = !1;
    } catch (e) {
        usingWebAudio = !1;
    }
    if (!usingWebAudio) if ("undefined" != typeof Audio) try {
        new Audio();
    } catch (e) {
        noAudio = !0;
    } else noAudio = !0;
    if (usingWebAudio) {
        var masterGain = void 0 === ctx.createGain ? ctx.createGainNode() : ctx.createGain();
        masterGain.gain.value = 1, masterGain.connect(ctx.destination);
    }
    var HowlerGlobal = function(codecs) {
        this._volume = 1, this._muted = !1, this.usingWebAudio = usingWebAudio, this.ctx = ctx, 
        this.noAudio = noAudio, this._howls = [], this._codecs = codecs, this.iOSAutoEnable = !0;
    };
    HowlerGlobal.prototype = {
        volume: function(vol) {
            var self = this;
            if ((vol = parseFloat(vol)) >= 0 && vol <= 1) {
                self._volume = vol, usingWebAudio && (masterGain.gain.value = vol);
                for (var key in self._howls) if (self._howls.hasOwnProperty(key) && !1 === self._howls[key]._webAudio) for (var i = 0; i < self._howls[key]._audioNode.length; i++) self._howls[key]._audioNode[i].volume = self._howls[key]._volume * self._volume;
                return self;
            }
            return usingWebAudio ? masterGain.gain.value : self._volume;
        },
        mute: function() {
            return this._setMuted(!0), this;
        },
        unmute: function() {
            return this._setMuted(!1), this;
        },
        _setMuted: function(muted) {
            var self = this;
            self._muted = muted, usingWebAudio && (masterGain.gain.value = muted ? 0 : self._volume);
            for (var key in self._howls) if (self._howls.hasOwnProperty(key) && !1 === self._howls[key]._webAudio) for (var i = 0; i < self._howls[key]._audioNode.length; i++) self._howls[key]._audioNode[i].muted = muted;
        },
        codecs: function(ext) {
            return this._codecs[ext];
        },
        _enableiOSAudio: function() {
            var self = this;
            if (!ctx || !self._iOSEnabled && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                self._iOSEnabled = !1;
                var unlock = function() {
                    var buffer = ctx.createBuffer(1, 1, 22050), source = ctx.createBufferSource();
                    source.buffer = buffer, source.connect(ctx.destination), void 0 === source.start ? source.noteOn(0) : source.start(0), 
                    setTimeout(function() {
                        source.playbackState !== source.PLAYING_STATE && source.playbackState !== source.FINISHED_STATE || (self._iOSEnabled = !0, 
                        self.iOSAutoEnable = !1, window.removeEventListener("touchend", unlock, !1));
                    }, 0);
                };
                return window.addEventListener("touchend", unlock, !1), self;
            }
        }
    };
    var audioTest = null, codecs = {};
    noAudio || (audioTest = new Audio(), codecs = {
        mp3: !!audioTest.canPlayType("audio/mpeg;").replace(/^no$/, ""),
        opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
        ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
        wav: !!audioTest.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""),
        aac: !!audioTest.canPlayType("audio/aac;").replace(/^no$/, ""),
        m4a: !!(audioTest.canPlayType("audio/x-m4a;") || audioTest.canPlayType("audio/m4a;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
        mp4: !!(audioTest.canPlayType("audio/x-mp4;") || audioTest.canPlayType("audio/mp4;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
        weba: !!audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")
    });
    var Howler = new HowlerGlobal(codecs), Howl = function(o) {
        var self = this;
        self._autoplay = o.autoplay || !1, self._buffer = o.buffer || !1, self._duration = o.duration || 0, 
        self._format = o.format || null, self._loop = o.loop || !1, self._loaded = !1, self._sprite = o.sprite || {}, 
        self._src = o.src || "", self._pos3d = o.pos3d || [ 0, 0, -.5 ], self._volume = void 0 !== o.volume ? o.volume : 1, 
        self._urls = o.urls || [], self._rate = o.rate || 1, self._model = o.model || null, 
        self._onload = [ o.onload || function() {} ], self._onloaderror = [ o.onloaderror || function() {} ], 
        self._onend = [ o.onend || function() {} ], self._onpause = [ o.onpause || function() {} ], 
        self._onplay = [ o.onplay || function() {} ], self._onendTimer = [], self._webAudio = usingWebAudio && !self._buffer, 
        self._audioNode = [], self._webAudio && self._setupAudioNode(), void 0 !== ctx && ctx && Howler.iOSAutoEnable && Howler._enableiOSAudio(), 
        Howler._howls.push(self), self.load();
    };
    if (Howl.prototype = {
        load: function() {
            var self = this, url = null;
            if (noAudio) return void self.on("loaderror", new Error("No audio support."));
            for (var i = 0; i < self._urls.length; i++) {
                var ext, urlItem;
                if (self._format) ext = self._format; else {
                    if (urlItem = self._urls[i], ext = /^data:audio\/([^;,]+);/i.exec(urlItem), ext || (ext = /\.([^.]+)$/.exec(urlItem.split("?", 1)[0])), 
                    !ext) return void self.on("loaderror", new Error("Could not extract format from passed URLs, please add format parameter."));
                    ext = ext[1].toLowerCase();
                }
                if (codecs[ext]) {
                    url = self._urls[i];
                    break;
                }
            }
            if (!url) return void self.on("loaderror", new Error("No codec support for selected audio sources."));
            if (self._src = url, self._webAudio) loadBuffer(self, url); else {
                var newNode = new Audio();
                newNode.addEventListener("error", function() {
                    newNode.error && 4 === newNode.error.code && (HowlerGlobal.noAudio = !0), self.on("loaderror", {
                        type: newNode.error ? newNode.error.code : 0
                    });
                }, !1), self._audioNode.push(newNode), newNode.src = url, newNode._pos = 0, newNode.preload = "auto", 
                newNode.volume = Howler._muted ? 0 : self._volume * Howler.volume();
                var listener = function() {
                    self._duration = Math.ceil(10 * newNode.duration) / 10, 0 === Object.getOwnPropertyNames(self._sprite).length && (self._sprite = {
                        _default: [ 0, 1e3 * self._duration ]
                    }), self._loaded || (self._loaded = !0, self.on("load")), self._autoplay && self.play(), 
                    newNode.removeEventListener("canplaythrough", listener, !1);
                };
                newNode.addEventListener("canplaythrough", listener, !1), newNode.load();
            }
            return self;
        },
        urls: function(urls) {
            var self = this;
            return urls ? (self.stop(), self._urls = "string" == typeof urls ? [ urls ] : urls, 
            self._loaded = !1, self.load(), self) : self._urls;
        },
        play: function(sprite, callback) {
            var self = this;
            return "function" == typeof sprite && (callback = sprite), sprite && "function" != typeof sprite || (sprite = "_default"), 
            self._loaded ? self._sprite[sprite] ? (self._inactiveNode(function(node) {
                node._sprite = sprite;
                var pos = node._pos > 0 ? node._pos : self._sprite[sprite][0] / 1e3, duration = 0;
                self._webAudio ? (duration = self._sprite[sprite][1] / 1e3 - node._pos, node._pos > 0 && (pos = self._sprite[sprite][0] / 1e3 + pos)) : duration = self._sprite[sprite][1] / 1e3 - (pos - self._sprite[sprite][0] / 1e3);
                var timerId, loop = !(!self._loop && !self._sprite[sprite][2]), soundId = "string" == typeof callback ? callback : Math.round(Date.now() * Math.random()) + "";
                if (function() {
                    var data = {
                        id: soundId,
                        sprite: sprite,
                        loop: loop
                    };
                    timerId = setTimeout(function() {
                        !self._webAudio && loop && self.stop(data.id).play(sprite, data.id), self._webAudio && !loop && (self._nodeById(data.id).paused = !0, 
                        self._nodeById(data.id)._pos = 0, self._clearEndTimer(data.id)), self._webAudio || loop || self.stop(data.id), 
                        self.on("end", soundId);
                    }, duration / self._rate * 1e3), self._onendTimer.push({
                        timer: timerId,
                        id: data.id
                    });
                }(), self._webAudio) {
                    var loopStart = self._sprite[sprite][0] / 1e3, loopEnd = self._sprite[sprite][1] / 1e3;
                    node.id = soundId, node.paused = !1, refreshBuffer(self, [ loop, loopStart, loopEnd ], soundId), 
                    self._playStart = ctx.currentTime, node.gain.value = self._volume, void 0 === node.bufferSource.start ? loop ? node.bufferSource.noteGrainOn(0, pos, 86400) : node.bufferSource.noteGrainOn(0, pos, duration) : loop ? node.bufferSource.start(0, pos, 86400) : node.bufferSource.start(0, pos, duration);
                } else {
                    if (4 !== node.readyState && (node.readyState || !navigator.isCocoonJS)) return self._clearEndTimer(soundId), 
                    function() {
                        var sound = self, playSprite = sprite, fn = callback, newNode = node, listener = function() {
                            sound.play(playSprite, fn), newNode.removeEventListener("canplaythrough", listener, !1);
                        };
                        newNode.addEventListener("canplaythrough", listener, !1);
                    }(), self;
                    node.readyState = 4, node.id = soundId, node.currentTime = pos, node.muted = Howler._muted || node.muted, 
                    node.volume = self._volume * Howler.volume(), setTimeout(function() {
                        node.play();
                    }, 0);
                }
                return self.on("play"), "function" == typeof callback && callback(soundId), self;
            }), self) : ("function" == typeof callback && callback(), self) : (self.on("load", function() {
                self.play(sprite, callback);
            }), self);
        },
        pause: function(id) {
            var self = this;
            if (!self._loaded) return self.on("play", function() {
                self.pause(id);
            }), self;
            self._clearEndTimer(id);
            var activeNode = id ? self._nodeById(id) : self._activeNode();
            if (activeNode) if (activeNode._pos = self.pos(null, id), self._webAudio) {
                if (!activeNode.bufferSource || activeNode.paused) return self;
                activeNode.paused = !0, void 0 === activeNode.bufferSource.stop ? activeNode.bufferSource.noteOff(0) : activeNode.bufferSource.stop(0);
            } else activeNode.pause();
            return self.on("pause"), self;
        },
        stop: function(id) {
            var self = this;
            if (!self._loaded) return self.on("play", function() {
                self.stop(id);
            }), self;
            self._clearEndTimer(id);
            var activeNode = id ? self._nodeById(id) : self._activeNode();
            if (activeNode) if (activeNode._pos = 0, self._webAudio) {
                if (!activeNode.bufferSource || activeNode.paused) return self;
                activeNode.paused = !0, void 0 === activeNode.bufferSource.stop ? activeNode.bufferSource.noteOff(0) : activeNode.bufferSource.stop(0);
            } else isNaN(activeNode.duration) || (activeNode.pause(), activeNode.currentTime = 0);
            return self;
        },
        mute: function(id) {
            var self = this;
            if (!self._loaded) return self.on("play", function() {
                self.mute(id);
            }), self;
            var activeNode = id ? self._nodeById(id) : self._activeNode();
            return activeNode && (self._webAudio ? activeNode.gain.value = 0 : activeNode.muted = !0), 
            self;
        },
        unmute: function(id) {
            var self = this;
            if (!self._loaded) return self.on("play", function() {
                self.unmute(id);
            }), self;
            var activeNode = id ? self._nodeById(id) : self._activeNode();
            return activeNode && (self._webAudio ? activeNode.gain.value = self._volume : activeNode.muted = !1), 
            self;
        },
        volume: function(vol, id) {
            var self = this;
            if ((vol = parseFloat(vol)) >= 0 && vol <= 1) {
                if (self._volume = vol, !self._loaded) return self.on("play", function() {
                    self.volume(vol, id);
                }), self;
                var activeNode = id ? self._nodeById(id) : self._activeNode();
                return activeNode && (self._webAudio ? activeNode.gain.value = vol : activeNode.volume = vol * Howler.volume()), 
                self;
            }
            return self._volume;
        },
        loop: function(loop) {
            var self = this;
            return "boolean" == typeof loop ? (self._loop = loop, self) : self._loop;
        },
        sprite: function(sprite) {
            var self = this;
            return "object" == typeof sprite ? (self._sprite = sprite, self) : self._sprite;
        },
        pos: function(pos, id) {
            var self = this;
            if (!self._loaded) return self.on("load", function() {
                self.pos(pos);
            }), "number" == typeof pos ? self : self._pos || 0;
            pos = parseFloat(pos);
            var activeNode = id ? self._nodeById(id) : self._activeNode();
            if (activeNode) return pos >= 0 ? (self.pause(id), activeNode._pos = pos, self.play(activeNode._sprite, id), 
            self) : self._webAudio ? activeNode._pos + (ctx.currentTime - self._playStart) : activeNode.currentTime;
            if (pos >= 0) return self;
            for (var i = 0; i < self._audioNode.length; i++) if (self._audioNode[i].paused && 4 === self._audioNode[i].readyState) return self._webAudio ? self._audioNode[i]._pos : self._audioNode[i].currentTime;
        },
        pos3d: function(x, y, z, id) {
            var self = this;
            if (y = void 0 !== y && y ? y : 0, z = void 0 !== z && z ? z : -.5, !self._loaded) return self.on("play", function() {
                self.pos3d(x, y, z, id);
            }), self;
            if (!(x >= 0 || x < 0)) return self._pos3d;
            if (self._webAudio) {
                var activeNode = id ? self._nodeById(id) : self._activeNode();
                activeNode && (self._pos3d = [ x, y, z ], activeNode.panner.setPosition(x, y, z), 
                activeNode.panner.panningModel = self._model || "HRTF");
            }
            return self;
        },
        fade: function(from, to, len, callback, id) {
            var self = this, diff = Math.abs(from - to), dir = from > to ? "down" : "up", steps = diff / .01, stepTime = len / steps;
            if (!self._loaded) return self.on("load", function() {
                self.fade(from, to, len, callback, id);
            }), self;
            self.volume(from, id);
            for (var i = 1; i <= steps; i++) !function() {
                var change = self._volume + ("up" === dir ? .01 : -.01) * i, vol = Math.round(1e3 * change) / 1e3, toVol = to;
                setTimeout(function() {
                    self.volume(vol, id), vol === toVol && callback && callback();
                }, stepTime * i);
            }();
        },
        fadeIn: function(to, len, callback) {
            return this.volume(0).play().fade(0, to, len, callback);
        },
        fadeOut: function(to, len, callback, id) {
            var self = this;
            return self.fade(self._volume, to, len, function() {
                callback && callback(), self.pause(id), self.on("end");
            }, id);
        },
        _nodeById: function(id) {
            for (var self = this, node = self._audioNode[0], i = 0; i < self._audioNode.length; i++) if (self._audioNode[i].id === id) {
                node = self._audioNode[i];
                break;
            }
            return node;
        },
        _activeNode: function() {
            for (var self = this, node = null, i = 0; i < self._audioNode.length; i++) if (!self._audioNode[i].paused) {
                node = self._audioNode[i];
                break;
            }
            return self._drainPool(), node;
        },
        _inactiveNode: function(callback) {
            for (var self = this, node = null, i = 0; i < self._audioNode.length; i++) if (self._audioNode[i].paused && 4 === self._audioNode[i].readyState) {
                callback(self._audioNode[i]), node = !0;
                break;
            }
            if (self._drainPool(), !node) {
                var newNode;
                if (self._webAudio) newNode = self._setupAudioNode(), callback(newNode); else {
                    self.load(), newNode = self._audioNode[self._audioNode.length - 1];
                    var listenerEvent = navigator.isCocoonJS ? "canplaythrough" : "loadedmetadata", listener = function() {
                        newNode.removeEventListener(listenerEvent, listener, !1), callback(newNode);
                    };
                    newNode.addEventListener(listenerEvent, listener, !1);
                }
            }
        },
        _drainPool: function() {
            var i, self = this, inactive = 0;
            for (i = 0; i < self._audioNode.length; i++) self._audioNode[i].paused && inactive++;
            for (i = self._audioNode.length - 1; i >= 0 && !(inactive <= 5); i--) self._audioNode[i].paused && (self._webAudio && self._audioNode[i].disconnect(0), 
            inactive--, self._audioNode.splice(i, 1));
        },
        _clearEndTimer: function(soundId) {
            for (var self = this, index = -1, i = 0; i < self._onendTimer.length; i++) if (self._onendTimer[i].id === soundId) {
                index = i;
                break;
            }
            var timer = self._onendTimer[index];
            timer && (clearTimeout(timer.timer), self._onendTimer.splice(index, 1));
        },
        _setupAudioNode: function() {
            var self = this, node = self._audioNode, index = self._audioNode.length;
            return node[index] = void 0 === ctx.createGain ? ctx.createGainNode() : ctx.createGain(), 
            node[index].gain.value = self._volume, node[index].paused = !0, node[index]._pos = 0, 
            node[index].readyState = 4, node[index].connect(masterGain), node[index].panner = ctx.createPanner(), 
            node[index].panner.panningModel = self._model || "equalpower", node[index].panner.setPosition(self._pos3d[0], self._pos3d[1], self._pos3d[2]), 
            node[index].panner.connect(node[index]), node[index];
        },
        on: function(event, fn) {
            var self = this, events = self["_on" + event];
            if ("function" == typeof fn) events.push(fn); else for (var i = 0; i < events.length; i++) fn ? events[i].call(self, fn) : events[i].call(self);
            return self;
        },
        off: function(event, fn) {
            var self = this, events = self["_on" + event];
            if (fn) {
                for (var i = 0; i < events.length; i++) if (fn === events[i]) {
                    events.splice(i, 1);
                    break;
                }
            } else self["_on" + event] = [];
            return self;
        },
        unload: function() {
            for (var self = this, nodes = self._audioNode, i = 0; i < self._audioNode.length; i++) nodes[i].paused || (self.stop(nodes[i].id), 
            self.on("end", nodes[i].id)), self._webAudio ? nodes[i].disconnect(0) : nodes[i].src = "";
            for (i = 0; i < self._onendTimer.length; i++) clearTimeout(self._onendTimer[i].timer);
            var index = Howler._howls.indexOf(self);
            null !== index && index >= 0 && Howler._howls.splice(index, 1), delete cache[self._src], 
            self = null;
        }
    }, usingWebAudio) var loadBuffer = function(obj, url) {
        if (url in cache) return obj._duration = cache[url].duration, void loadSound(obj);
        if (/^data:[^;]+;base64,/.test(url)) {
            for (var data = atob(url.split(",")[1]), dataView = new Uint8Array(data.length), i = 0; i < data.length; ++i) dataView[i] = data.charCodeAt(i);
            decodeAudioData(dataView.buffer, obj, url);
        } else {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, !0), xhr.responseType = "arraybuffer", xhr.onload = function() {
                decodeAudioData(xhr.response, obj, url);
            }, xhr.onerror = function() {
                obj._webAudio && (obj._buffer = !0, obj._webAudio = !1, obj._audioNode = [], delete obj._gainNode, 
                delete cache[url], obj.load());
            };
            try {
                xhr.send();
            } catch (e) {
                xhr.onerror();
            }
        }
    }, decodeAudioData = function(arraybuffer, obj, url) {
        ctx.decodeAudioData(arraybuffer, function(buffer) {
            buffer && (cache[url] = buffer, loadSound(obj, buffer));
        }, function(err) {
            obj.on("loaderror", err);
        });
    }, loadSound = function(obj, buffer) {
        obj._duration = buffer ? buffer.duration : obj._duration, 0 === Object.getOwnPropertyNames(obj._sprite).length && (obj._sprite = {
            _default: [ 0, 1e3 * obj._duration ]
        }), obj._loaded || (obj._loaded = !0, obj.on("load")), obj._autoplay && obj.play();
    }, refreshBuffer = function(obj, loop, id) {
        var node = obj._nodeById(id);
        node.bufferSource = ctx.createBufferSource(), node.bufferSource.buffer = cache[obj._src], 
        node.bufferSource.connect(node.panner), node.bufferSource.loop = loop[0], loop[0] && (node.bufferSource.loopStart = loop[1], 
        node.bufferSource.loopEnd = loop[1] + loop[2]), node.bufferSource.playbackRate.value = obj._rate;
    };
    "function" == typeof define && define.amd && define(function() {
        return {
            Howler: Howler,
            Howl: Howl
        };
    }), void 0 !== exports && (exports.Howler = Howler, exports.Howl = Howl), "undefined" != typeof window && (window.Howler = Howler, 
    window.Howl = Howl);
}(), function(root, factory) {
    "object" == typeof exports && "object" == typeof module ? module.exports = factory() : "function" == typeof define && define.amd ? define([], factory) : "object" == typeof exports ? exports.io = factory() : root.io = factory();
}(this, function() {
    return function(modules) {
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) return installedModules[moduleId].exports;
            var module = installedModules[moduleId] = {
                exports: {},
                id: moduleId,
                loaded: !1
            };
            return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
            module.loaded = !0, module.exports;
        }
        var installedModules = {};
        return __webpack_require__.m = modules, __webpack_require__.c = installedModules, 
        __webpack_require__.p = "", __webpack_require__(0);
    }([ function(module, exports, __webpack_require__) {
        "use strict";
        function lookup(uri, opts) {
            "object" === (void 0 === uri ? "undefined" : _typeof(uri)) && (opts = uri, uri = void 0), 
            opts = opts || {};
            var io, parsed = url(uri), source = parsed.source, id = parsed.id, path = parsed.path, sameNamespace = cache[id] && path in cache[id].nsps, newConnection = opts.forceNew || opts["force new connection"] || !1 === opts.multiplex || sameNamespace;
            return newConnection ? (debug("ignoring socket cache for %s", source), io = Manager(source, opts)) : (cache[id] || (debug("new io instance for %s", source), 
            cache[id] = Manager(source, opts)), io = cache[id]), parsed.query && !opts.query ? opts.query = parsed.query : opts && "object" === _typeof(opts.query) && (opts.query = encodeQueryString(opts.query)), 
            io.socket(parsed.path, opts);
        }
        function encodeQueryString(obj) {
            var str = [];
            for (var p in obj) obj.hasOwnProperty(p) && str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        }
        var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        }, url = __webpack_require__(1), parser = __webpack_require__(7), Manager = __webpack_require__(17), debug = __webpack_require__(3)("socket.io-client");
        module.exports = exports = lookup;
        var cache = exports.managers = {};
        exports.protocol = parser.protocol, exports.connect = lookup, exports.Manager = __webpack_require__(17), 
        exports.Socket = __webpack_require__(44);
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            "use strict";
            function url(uri, loc) {
                var obj = uri;
                loc = loc || global.location, null == uri && (uri = loc.protocol + "//" + loc.host), 
                "string" == typeof uri && ("/" === uri.charAt(0) && (uri = "/" === uri.charAt(1) ? loc.protocol + uri : loc.host + uri), 
                /^(https?|wss?):\/\//.test(uri) || (debug("protocol-less url %s", uri), uri = void 0 !== loc ? loc.protocol + "//" + uri : "https://" + uri), 
                debug("parse %s", uri), obj = parseuri(uri)), obj.port || (/^(http|ws)$/.test(obj.protocol) ? obj.port = "80" : /^(http|ws)s$/.test(obj.protocol) && (obj.port = "443")), 
                obj.path = obj.path || "/";
                var ipv6 = -1 !== obj.host.indexOf(":"), host = ipv6 ? "[" + obj.host + "]" : obj.host;
                return obj.id = obj.protocol + "://" + host + ":" + obj.port, obj.href = obj.protocol + "://" + host + (loc && loc.port === obj.port ? "" : ":" + obj.port), 
                obj;
            }
            var parseuri = __webpack_require__(2), debug = __webpack_require__(3)("socket.io-client:url");
            module.exports = url;
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports) {
        var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, parts = [ "source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor" ];
        module.exports = function(str) {
            var src = str, b = str.indexOf("["), e = str.indexOf("]");
            -1 != b && -1 != e && (str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ";") + str.substring(e, str.length));
            for (var m = re.exec(str || ""), uri = {}, i = 14; i--; ) uri[parts[i]] = m[i] || "";
            return -1 != b && -1 != e && (uri.source = src, uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ":"), 
            uri.authority = uri.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), 
            uri.ipv6uri = !0), uri;
        };
    }, function(module, exports, __webpack_require__) {
        (function(process) {
            function useColors() {
                return "undefined" != typeof document && "WebkitAppearance" in document.documentElement.style || window.console && (console.firebug || console.exception && console.table) || navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31;
            }
            function formatArgs() {
                var args = arguments, useColors = this.useColors;
                if (args[0] = (useColors ? "%c" : "") + this.namespace + (useColors ? " %c" : " ") + args[0] + (useColors ? "%c " : " ") + "+" + exports.humanize(this.diff), 
                !useColors) return args;
                var c = "color: " + this.color;
                args = [ args[0], c, "color: inherit" ].concat(Array.prototype.slice.call(args, 1));
                var index = 0, lastC = 0;
                return args[0].replace(/%[a-z%]/g, function(match) {
                    "%%" !== match && (index++, "%c" === match && (lastC = index));
                }), args.splice(lastC, 0, c), args;
            }
            function log() {
                return "object" == typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
            }
            function save(namespaces) {
                try {
                    null == namespaces ? exports.storage.removeItem("debug") : exports.storage.debug = namespaces;
                } catch (e) {}
            }
            function load() {
                try {
                    return exports.storage.debug;
                } catch (e) {}
                if (void 0 !== process && "env" in process) return process.env.DEBUG;
            }
            exports = module.exports = __webpack_require__(5), exports.log = log, exports.formatArgs = formatArgs, 
            exports.save = save, exports.load = load, exports.useColors = useColors, exports.storage = "undefined" != typeof chrome && void 0 !== chrome.storage ? chrome.storage.local : function() {
                try {
                    return window.localStorage;
                } catch (e) {}
            }(), exports.colors = [ "lightseagreen", "forestgreen", "goldenrod", "dodgerblue", "darkorchid", "crimson" ], 
            exports.formatters.j = function(v) {
                try {
                    return JSON.stringify(v);
                } catch (err) {
                    return "[UnexpectedJSONParseError]: " + err.message;
                }
            }, exports.enable(load());
        }).call(exports, __webpack_require__(4));
    }, function(module, exports) {
        function defaultSetTimout() {
            throw new Error("setTimeout has not been defined");
        }
        function defaultClearTimeout() {
            throw new Error("clearTimeout has not been defined");
        }
        function runTimeout(fun) {
            if (cachedSetTimeout === setTimeout) return setTimeout(fun, 0);
            if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) return cachedSetTimeout = setTimeout, 
            setTimeout(fun, 0);
            try {
                return cachedSetTimeout(fun, 0);
            } catch (e) {
                try {
                    return cachedSetTimeout.call(null, fun, 0);
                } catch (e) {
                    return cachedSetTimeout.call(this, fun, 0);
                }
            }
        }
        function runClearTimeout(marker) {
            if (cachedClearTimeout === clearTimeout) return clearTimeout(marker);
            if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) return cachedClearTimeout = clearTimeout, 
            clearTimeout(marker);
            try {
                return cachedClearTimeout(marker);
            } catch (e) {
                try {
                    return cachedClearTimeout.call(null, marker);
                } catch (e) {
                    return cachedClearTimeout.call(this, marker);
                }
            }
        }
        function cleanUpNextTick() {
            draining && currentQueue && (draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, 
            queue.length && drainQueue());
        }
        function drainQueue() {
            if (!draining) {
                var timeout = runTimeout(cleanUpNextTick);
                draining = !0;
                for (var len = queue.length; len; ) {
                    for (currentQueue = queue, queue = []; ++queueIndex < len; ) currentQueue && currentQueue[queueIndex].run();
                    queueIndex = -1, len = queue.length;
                }
                currentQueue = null, draining = !1, runClearTimeout(timeout);
            }
        }
        function Item(fun, array) {
            this.fun = fun, this.array = array;
        }
        function noop() {}
        var cachedSetTimeout, cachedClearTimeout, process = module.exports = {};
        !function() {
            try {
                cachedSetTimeout = "function" == typeof setTimeout ? setTimeout : defaultSetTimout;
            } catch (e) {
                cachedSetTimeout = defaultSetTimout;
            }
            try {
                cachedClearTimeout = "function" == typeof clearTimeout ? clearTimeout : defaultClearTimeout;
            } catch (e) {
                cachedClearTimeout = defaultClearTimeout;
            }
        }();
        var currentQueue, queue = [], draining = !1, queueIndex = -1;
        process.nextTick = function(fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
            queue.push(new Item(fun, args)), 1 !== queue.length || draining || runTimeout(drainQueue);
        }, Item.prototype.run = function() {
            this.fun.apply(null, this.array);
        }, process.title = "browser", process.browser = !0, process.env = {}, process.argv = [], 
        process.version = "", process.versions = {}, process.on = noop, process.addListener = noop, 
        process.once = noop, process.off = noop, process.removeListener = noop, process.removeAllListeners = noop, 
        process.emit = noop, process.binding = function(name) {
            throw new Error("process.binding is not supported");
        }, process.cwd = function() {
            return "/";
        }, process.chdir = function(dir) {
            throw new Error("process.chdir is not supported");
        }, process.umask = function() {
            return 0;
        };
    }, function(module, exports, __webpack_require__) {
        function selectColor() {
            return exports.colors[prevColor++ % exports.colors.length];
        }
        function debug(namespace) {
            function disabled() {}
            function enabled() {
                var self = enabled, curr = +new Date(), ms = curr - (prevTime || curr);
                self.diff = ms, self.prev = prevTime, self.curr = curr, prevTime = curr, null == self.useColors && (self.useColors = exports.useColors()), 
                null == self.color && self.useColors && (self.color = selectColor());
                for (var args = new Array(arguments.length), i = 0; i < args.length; i++) args[i] = arguments[i];
                args[0] = exports.coerce(args[0]), "string" != typeof args[0] && (args = [ "%o" ].concat(args));
                var index = 0;
                args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
                    if ("%%" === match) return match;
                    index++;
                    var formatter = exports.formatters[format];
                    if ("function" == typeof formatter) {
                        var val = args[index];
                        match = formatter.call(self, val), args.splice(index, 1), index--;
                    }
                    return match;
                }), args = exports.formatArgs.apply(self, args), (enabled.log || exports.log || console.log.bind(console)).apply(self, args);
            }
            disabled.enabled = !1, enabled.enabled = !0;
            var fn = exports.enabled(namespace) ? enabled : disabled;
            return fn.namespace = namespace, fn;
        }
        function enable(namespaces) {
            exports.save(namespaces);
            for (var split = (namespaces || "").split(/[\s,]+/), len = split.length, i = 0; i < len; i++) split[i] && (namespaces = split[i].replace(/[\\^$+?.()|[\]{}]/g, "\\$&").replace(/\*/g, ".*?"), 
            "-" === namespaces[0] ? exports.skips.push(new RegExp("^" + namespaces.substr(1) + "$")) : exports.names.push(new RegExp("^" + namespaces + "$")));
        }
        function disable() {
            exports.enable("");
        }
        function enabled(name) {
            var i, len;
            for (i = 0, len = exports.skips.length; i < len; i++) if (exports.skips[i].test(name)) return !1;
            for (i = 0, len = exports.names.length; i < len; i++) if (exports.names[i].test(name)) return !0;
            return !1;
        }
        function coerce(val) {
            return val instanceof Error ? val.stack || val.message : val;
        }
        exports = module.exports = debug.debug = debug, exports.coerce = coerce, exports.disable = disable, 
        exports.enable = enable, exports.enabled = enabled, exports.humanize = __webpack_require__(6), 
        exports.names = [], exports.skips = [], exports.formatters = {};
        var prevTime, prevColor = 0;
    }, function(module, exports) {
        function parse(str) {
            if (str = String(str), !(str.length > 1e4)) {
                var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
                if (match) {
                    var n = parseFloat(match[1]);
                    switch ((match[2] || "ms").toLowerCase()) {
                      case "years":
                      case "year":
                      case "yrs":
                      case "yr":
                      case "y":
                        return n * y;

                      case "days":
                      case "day":
                      case "d":
                        return n * d;

                      case "hours":
                      case "hour":
                      case "hrs":
                      case "hr":
                      case "h":
                        return n * h;

                      case "minutes":
                      case "minute":
                      case "mins":
                      case "min":
                      case "m":
                        return n * m;

                      case "seconds":
                      case "second":
                      case "secs":
                      case "sec":
                      case "s":
                        return n * s;

                      case "milliseconds":
                      case "millisecond":
                      case "msecs":
                      case "msec":
                      case "ms":
                        return n;

                      default:
                        return;
                    }
                }
            }
        }
        function fmtShort(ms) {
            return ms >= d ? Math.round(ms / d) + "d" : ms >= h ? Math.round(ms / h) + "h" : ms >= m ? Math.round(ms / m) + "m" : ms >= s ? Math.round(ms / s) + "s" : ms + "ms";
        }
        function fmtLong(ms) {
            return plural(ms, d, "day") || plural(ms, h, "hour") || plural(ms, m, "minute") || plural(ms, s, "second") || ms + " ms";
        }
        function plural(ms, n, name) {
            if (!(ms < n)) return ms < 1.5 * n ? Math.floor(ms / n) + " " + name : Math.ceil(ms / n) + " " + name + "s";
        }
        var s = 1e3, m = 60 * s, h = 60 * m, d = 24 * h, y = 365.25 * d;
        module.exports = function(val, options) {
            options = options || {};
            var type = typeof val;
            if ("string" === type && val.length > 0) return parse(val);
            if ("number" === type && !1 === isNaN(val)) return options.long ? fmtLong(val) : fmtShort(val);
            throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
        };
    }, function(module, exports, __webpack_require__) {
        function Encoder() {}
        function encodeAsString(obj) {
            var str = "", nsp = !1;
            return str += obj.type, exports.BINARY_EVENT != obj.type && exports.BINARY_ACK != obj.type || (str += obj.attachments, 
            str += "-"), obj.nsp && "/" != obj.nsp && (nsp = !0, str += obj.nsp), null != obj.id && (nsp && (str += ",", 
            nsp = !1), str += obj.id), null != obj.data && (nsp && (str += ","), str += json.stringify(obj.data)), 
            debug("encoded %j as %s", obj, str), str;
        }
        function encodeAsBinary(obj, callback) {
            function writeEncoding(bloblessData) {
                var deconstruction = binary.deconstructPacket(bloblessData), pack = encodeAsString(deconstruction.packet), buffers = deconstruction.buffers;
                buffers.unshift(pack), callback(buffers);
            }
            binary.removeBlobs(obj, writeEncoding);
        }
        function Decoder() {
            this.reconstructor = null;
        }
        function decodeString(str) {
            var p = {}, i = 0;
            if (p.type = Number(str.charAt(0)), null == exports.types[p.type]) return error();
            if (exports.BINARY_EVENT == p.type || exports.BINARY_ACK == p.type) {
                for (var buf = ""; "-" != str.charAt(++i) && (buf += str.charAt(i), i != str.length); ) ;
                if (buf != Number(buf) || "-" != str.charAt(i)) throw new Error("Illegal attachments");
                p.attachments = Number(buf);
            }
            if ("/" == str.charAt(i + 1)) for (p.nsp = ""; ++i; ) {
                var c = str.charAt(i);
                if ("," == c) break;
                if (p.nsp += c, i == str.length) break;
            } else p.nsp = "/";
            var next = str.charAt(i + 1);
            if ("" !== next && Number(next) == next) {
                for (p.id = ""; ++i; ) {
                    var c = str.charAt(i);
                    if (null == c || Number(c) != c) {
                        --i;
                        break;
                    }
                    if (p.id += str.charAt(i), i == str.length) break;
                }
                p.id = Number(p.id);
            }
            return str.charAt(++i) && (p = tryParse(p, str.substr(i))), debug("decoded %s as %j", str, p), 
            p;
        }
        function tryParse(p, str) {
            try {
                p.data = json.parse(str);
            } catch (e) {
                return error();
            }
            return p;
        }
        function BinaryReconstructor(packet) {
            this.reconPack = packet, this.buffers = [];
        }
        function error(data) {
            return {
                type: exports.ERROR,
                data: "parser error"
            };
        }
        var debug = __webpack_require__(8)("socket.io-parser"), json = __webpack_require__(11), Emitter = __webpack_require__(13), binary = __webpack_require__(14), isBuf = __webpack_require__(16);
        exports.protocol = 4, exports.types = [ "CONNECT", "DISCONNECT", "EVENT", "ACK", "ERROR", "BINARY_EVENT", "BINARY_ACK" ], 
        exports.CONNECT = 0, exports.DISCONNECT = 1, exports.EVENT = 2, exports.ACK = 3, 
        exports.ERROR = 4, exports.BINARY_EVENT = 5, exports.BINARY_ACK = 6, exports.Encoder = Encoder, 
        exports.Decoder = Decoder, Encoder.prototype.encode = function(obj, callback) {
            if (debug("encoding packet %j", obj), exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) encodeAsBinary(obj, callback); else {
                callback([ encodeAsString(obj) ]);
            }
        }, Emitter(Decoder.prototype), Decoder.prototype.add = function(obj) {
            var packet;
            if ("string" == typeof obj) packet = decodeString(obj), exports.BINARY_EVENT == packet.type || exports.BINARY_ACK == packet.type ? (this.reconstructor = new BinaryReconstructor(packet), 
            0 === this.reconstructor.reconPack.attachments && this.emit("decoded", packet)) : this.emit("decoded", packet); else {
                if (!isBuf(obj) && !obj.base64) throw new Error("Unknown type: " + obj);
                if (!this.reconstructor) throw new Error("got binary data when not reconstructing a packet");
                (packet = this.reconstructor.takeBinaryData(obj)) && (this.reconstructor = null, 
                this.emit("decoded", packet));
            }
        }, Decoder.prototype.destroy = function() {
            this.reconstructor && this.reconstructor.finishedReconstruction();
        }, BinaryReconstructor.prototype.takeBinaryData = function(binData) {
            if (this.buffers.push(binData), this.buffers.length == this.reconPack.attachments) {
                var packet = binary.reconstructPacket(this.reconPack, this.buffers);
                return this.finishedReconstruction(), packet;
            }
            return null;
        }, BinaryReconstructor.prototype.finishedReconstruction = function() {
            this.reconPack = null, this.buffers = [];
        };
    }, function(module, exports, __webpack_require__) {
        function useColors() {
            return "WebkitAppearance" in document.documentElement.style || window.console && (console.firebug || console.exception && console.table) || navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31;
        }
        function formatArgs() {
            var args = arguments, useColors = this.useColors;
            if (args[0] = (useColors ? "%c" : "") + this.namespace + (useColors ? " %c" : " ") + args[0] + (useColors ? "%c " : " ") + "+" + exports.humanize(this.diff), 
            !useColors) return args;
            var c = "color: " + this.color;
            args = [ args[0], c, "color: inherit" ].concat(Array.prototype.slice.call(args, 1));
            var index = 0, lastC = 0;
            return args[0].replace(/%[a-z%]/g, function(match) {
                "%%" !== match && (index++, "%c" === match && (lastC = index));
            }), args.splice(lastC, 0, c), args;
        }
        function log() {
            return "object" == typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
        }
        function save(namespaces) {
            try {
                null == namespaces ? exports.storage.removeItem("debug") : exports.storage.debug = namespaces;
            } catch (e) {}
        }
        function load() {
            var r;
            try {
                r = exports.storage.debug;
            } catch (e) {}
            return r;
        }
        exports = module.exports = __webpack_require__(9), exports.log = log, exports.formatArgs = formatArgs, 
        exports.save = save, exports.load = load, exports.useColors = useColors, exports.storage = "undefined" != typeof chrome && void 0 !== chrome.storage ? chrome.storage.local : function() {
            try {
                return window.localStorage;
            } catch (e) {}
        }(), exports.colors = [ "lightseagreen", "forestgreen", "goldenrod", "dodgerblue", "darkorchid", "crimson" ], 
        exports.formatters.j = function(v) {
            return JSON.stringify(v);
        }, exports.enable(load());
    }, function(module, exports, __webpack_require__) {
        function selectColor() {
            return exports.colors[prevColor++ % exports.colors.length];
        }
        function debug(namespace) {
            function disabled() {}
            function enabled() {
                var self = enabled, curr = +new Date(), ms = curr - (prevTime || curr);
                self.diff = ms, self.prev = prevTime, self.curr = curr, prevTime = curr, null == self.useColors && (self.useColors = exports.useColors()), 
                null == self.color && self.useColors && (self.color = selectColor());
                var args = Array.prototype.slice.call(arguments);
                args[0] = exports.coerce(args[0]), "string" != typeof args[0] && (args = [ "%o" ].concat(args));
                var index = 0;
                args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
                    if ("%%" === match) return match;
                    index++;
                    var formatter = exports.formatters[format];
                    if ("function" == typeof formatter) {
                        var val = args[index];
                        match = formatter.call(self, val), args.splice(index, 1), index--;
                    }
                    return match;
                }), "function" == typeof exports.formatArgs && (args = exports.formatArgs.apply(self, args)), 
                (enabled.log || exports.log || console.log.bind(console)).apply(self, args);
            }
            disabled.enabled = !1, enabled.enabled = !0;
            var fn = exports.enabled(namespace) ? enabled : disabled;
            return fn.namespace = namespace, fn;
        }
        function enable(namespaces) {
            exports.save(namespaces);
            for (var split = (namespaces || "").split(/[\s,]+/), len = split.length, i = 0; i < len; i++) split[i] && (namespaces = split[i].replace(/\*/g, ".*?"), 
            "-" === namespaces[0] ? exports.skips.push(new RegExp("^" + namespaces.substr(1) + "$")) : exports.names.push(new RegExp("^" + namespaces + "$")));
        }
        function disable() {
            exports.enable("");
        }
        function enabled(name) {
            var i, len;
            for (i = 0, len = exports.skips.length; i < len; i++) if (exports.skips[i].test(name)) return !1;
            for (i = 0, len = exports.names.length; i < len; i++) if (exports.names[i].test(name)) return !0;
            return !1;
        }
        function coerce(val) {
            return val instanceof Error ? val.stack || val.message : val;
        }
        exports = module.exports = debug, exports.coerce = coerce, exports.disable = disable, 
        exports.enable = enable, exports.enabled = enabled, exports.humanize = __webpack_require__(10), 
        exports.names = [], exports.skips = [], exports.formatters = {};
        var prevTime, prevColor = 0;
    }, function(module, exports) {
        function parse(str) {
            if (str = "" + str, !(str.length > 1e4)) {
                var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
                if (match) {
                    var n = parseFloat(match[1]);
                    switch ((match[2] || "ms").toLowerCase()) {
                      case "years":
                      case "year":
                      case "yrs":
                      case "yr":
                      case "y":
                        return n * y;

                      case "days":
                      case "day":
                      case "d":
                        return n * d;

                      case "hours":
                      case "hour":
                      case "hrs":
                      case "hr":
                      case "h":
                        return n * h;

                      case "minutes":
                      case "minute":
                      case "mins":
                      case "min":
                      case "m":
                        return n * m;

                      case "seconds":
                      case "second":
                      case "secs":
                      case "sec":
                      case "s":
                        return n * s;

                      case "milliseconds":
                      case "millisecond":
                      case "msecs":
                      case "msec":
                      case "ms":
                        return n;
                    }
                }
            }
        }
        function short(ms) {
            return ms >= d ? Math.round(ms / d) + "d" : ms >= h ? Math.round(ms / h) + "h" : ms >= m ? Math.round(ms / m) + "m" : ms >= s ? Math.round(ms / s) + "s" : ms + "ms";
        }
        function long(ms) {
            return plural(ms, d, "day") || plural(ms, h, "hour") || plural(ms, m, "minute") || plural(ms, s, "second") || ms + " ms";
        }
        function plural(ms, n, name) {
            if (!(ms < n)) return ms < 1.5 * n ? Math.floor(ms / n) + " " + name : Math.ceil(ms / n) + " " + name + "s";
        }
        var s = 1e3, m = 60 * s, h = 60 * m, d = 24 * h, y = 365.25 * d;
        module.exports = function(val, options) {
            return options = options || {}, "string" == typeof val ? parse(val) : options.long ? long(val) : short(val);
        };
    }, function(module, exports, __webpack_require__) {
        (function(module, global) {
            var define = !1;
            (function() {
                function runInContext(context, exports) {
                    function has(name) {
                        if (has[name] !== undef) return has[name];
                        var isSupported;
                        if ("bug-string-char-index" == name) isSupported = "a" != "a"[0]; else if ("json" == name) isSupported = has("json-stringify") && has("json-parse"); else {
                            var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
                            if ("json-stringify" == name) {
                                var stringify = exports.stringify, stringifySupported = "function" == typeof stringify && isExtended;
                                if (stringifySupported) {
                                    (value = function() {
                                        return 1;
                                    }).toJSON = value;
                                    try {
                                        stringifySupported = "0" === stringify(0) && "0" === stringify(new Number()) && '""' == stringify(new String()) && stringify(getClass) === undef && stringify(undef) === undef && stringify() === undef && "1" === stringify(value) && "[1]" == stringify([ value ]) && "[null]" == stringify([ undef ]) && "null" == stringify(null) && "[null,null,null]" == stringify([ undef, getClass, null ]) && stringify({
                                            a: [ value, !0, !1, null, "\0\b\n\f\r\t" ]
                                        }) == serialized && "1" === stringify(null, value) && "[\n 1,\n 2\n]" == stringify([ 1, 2 ], null, 1) && '"-271821-04-20T00:00:00.000Z"' == stringify(new Date(-864e13)) && '"+275760-09-13T00:00:00.000Z"' == stringify(new Date(864e13)) && '"-000001-01-01T00:00:00.000Z"' == stringify(new Date(-621987552e5)) && '"1969-12-31T23:59:59.999Z"' == stringify(new Date(-1));
                                    } catch (exception) {
                                        stringifySupported = !1;
                                    }
                                }
                                isSupported = stringifySupported;
                            }
                            if ("json-parse" == name) {
                                var parse = exports.parse;
                                if ("function" == typeof parse) try {
                                    if (0 === parse("0") && !parse(!1)) {
                                        value = parse(serialized);
                                        var parseSupported = 5 == value.a.length && 1 === value.a[0];
                                        if (parseSupported) {
                                            try {
                                                parseSupported = !parse('"\t"');
                                            } catch (exception) {}
                                            if (parseSupported) try {
                                                parseSupported = 1 !== parse("01");
                                            } catch (exception) {}
                                            if (parseSupported) try {
                                                parseSupported = 1 !== parse("1.");
                                            } catch (exception) {}
                                        }
                                    }
                                } catch (exception) {
                                    parseSupported = !1;
                                }
                                isSupported = parseSupported;
                            }
                        }
                        return has[name] = !!isSupported;
                    }
                    context || (context = root.Object()), exports || (exports = root.Object());
                    var Number = context.Number || root.Number, String = context.String || root.String, Object = context.Object || root.Object, Date = context.Date || root.Date, SyntaxError = context.SyntaxError || root.SyntaxError, TypeError = context.TypeError || root.TypeError, Math = context.Math || root.Math, nativeJSON = context.JSON || root.JSON;
                    "object" == typeof nativeJSON && nativeJSON && (exports.stringify = nativeJSON.stringify, 
                    exports.parse = nativeJSON.parse);
                    var isProperty, forEach, undef, objectProto = Object.prototype, getClass = objectProto.toString, isExtended = new Date(-0xc782b5b800cec);
                    try {
                        isExtended = -109252 == isExtended.getUTCFullYear() && 0 === isExtended.getUTCMonth() && 1 === isExtended.getUTCDate() && 10 == isExtended.getUTCHours() && 37 == isExtended.getUTCMinutes() && 6 == isExtended.getUTCSeconds() && 708 == isExtended.getUTCMilliseconds();
                    } catch (exception) {}
                    if (!has("json")) {
                        var charIndexBuggy = has("bug-string-char-index");
                        if (!isExtended) var floor = Math.floor, Months = [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ], getDay = function(year, month) {
                            return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
                        };
                        if ((isProperty = objectProto.hasOwnProperty) || (isProperty = function(property) {
                            var constructor, members = {};
                            return (members.__proto__ = null, members.__proto__ = {
                                toString: 1
                            }, members).toString != getClass ? isProperty = function(property) {
                                var original = this.__proto__, result = property in (this.__proto__ = null, this);
                                return this.__proto__ = original, result;
                            } : (constructor = members.constructor, isProperty = function(property) {
                                var parent = (this.constructor || constructor).prototype;
                                return property in this && !(property in parent && this[property] === parent[property]);
                            }), members = null, isProperty.call(this, property);
                        }), forEach = function(object, callback) {
                            var Properties, members, property, size = 0;
                            (Properties = function() {
                                this.valueOf = 0;
                            }).prototype.valueOf = 0, members = new Properties();
                            for (property in members) isProperty.call(members, property) && size++;
                            return Properties = members = null, size ? forEach = 2 == size ? function(object, callback) {
                                var property, members = {}, isFunction = "[object Function]" == getClass.call(object);
                                for (property in object) isFunction && "prototype" == property || isProperty.call(members, property) || !(members[property] = 1) || !isProperty.call(object, property) || callback(property);
                            } : function(object, callback) {
                                var property, isConstructor, isFunction = "[object Function]" == getClass.call(object);
                                for (property in object) isFunction && "prototype" == property || !isProperty.call(object, property) || (isConstructor = "constructor" === property) || callback(property);
                                (isConstructor || isProperty.call(object, property = "constructor")) && callback(property);
                            } : (members = [ "valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor" ], 
                            forEach = function(object, callback) {
                                var property, length, isFunction = "[object Function]" == getClass.call(object), hasProperty = !isFunction && "function" != typeof object.constructor && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
                                for (property in object) isFunction && "prototype" == property || !hasProperty.call(object, property) || callback(property);
                                for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property)) ;
                            }), forEach(object, callback);
                        }, !has("json-stringify")) {
                            var Escapes = {
                                92: "\\\\",
                                34: '\\"',
                                8: "\\b",
                                12: "\\f",
                                10: "\\n",
                                13: "\\r",
                                9: "\\t"
                            }, toPaddedString = function(width, value) {
                                return ("000000" + (value || 0)).slice(-width);
                            }, quote = function(value) {
                                for (var result = '"', index = 0, length = value.length, useCharIndex = !charIndexBuggy || length > 10, symbols = useCharIndex && (charIndexBuggy ? value.split("") : value); index < length; index++) {
                                    var charCode = value.charCodeAt(index);
                                    switch (charCode) {
                                      case 8:
                                      case 9:
                                      case 10:
                                      case 12:
                                      case 13:
                                      case 34:
                                      case 92:
                                        result += Escapes[charCode];
                                        break;

                                      default:
                                        if (charCode < 32) {
                                            result += "\\u00" + toPaddedString(2, charCode.toString(16));
                                            break;
                                        }
                                        result += useCharIndex ? symbols[index] : value.charAt(index);
                                    }
                                }
                                return result + '"';
                            }, serialize = function(property, object, callback, properties, whitespace, indentation, stack) {
                                var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
                                try {
                                    value = object[property];
                                } catch (exception) {}
                                if ("object" == typeof value && value) if ("[object Date]" != (className = getClass.call(value)) || isProperty.call(value, "toJSON")) "function" == typeof value.toJSON && ("[object Number]" != className && "[object String]" != className && "[object Array]" != className || isProperty.call(value, "toJSON")) && (value = value.toJSON(property)); else if (value > -1 / 0 && value < 1 / 0) {
                                    if (getDay) {
                                        for (date = floor(value / 864e5), year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++) ;
                                        for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++) ;
                                        date = 1 + date - getDay(year, month), time = (value % 864e5 + 864e5) % 864e5, hours = floor(time / 36e5) % 24, 
                                        minutes = floor(time / 6e4) % 60, seconds = floor(time / 1e3) % 60, milliseconds = time % 1e3;
                                    } else year = value.getUTCFullYear(), month = value.getUTCMonth(), date = value.getUTCDate(), 
                                    hours = value.getUTCHours(), minutes = value.getUTCMinutes(), seconds = value.getUTCSeconds(), 
                                    milliseconds = value.getUTCMilliseconds();
                                    value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) + "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) + "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) + "." + toPaddedString(3, milliseconds) + "Z";
                                } else value = null;
                                if (callback && (value = callback.call(object, property, value)), null === value) return "null";
                                if ("[object Boolean]" == (className = getClass.call(value))) return "" + value;
                                if ("[object Number]" == className) return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
                                if ("[object String]" == className) return quote("" + value);
                                if ("object" == typeof value) {
                                    for (length = stack.length; length--; ) if (stack[length] === value) throw TypeError();
                                    if (stack.push(value), results = [], prefix = indentation, indentation += whitespace, 
                                    "[object Array]" == className) {
                                        for (index = 0, length = value.length; index < length; index++) element = serialize(index, value, callback, properties, whitespace, indentation, stack), 
                                        results.push(element === undef ? "null" : element);
                                        result = results.length ? whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : "[" + results.join(",") + "]" : "[]";
                                    } else forEach(properties || value, function(property) {
                                        var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                                        element !== undef && results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                                    }), result = results.length ? whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : "{" + results.join(",") + "}" : "{}";
                                    return stack.pop(), result;
                                }
                            };
                            exports.stringify = function(source, filter, width) {
                                var whitespace, callback, properties, className;
                                if (objectTypes[typeof filter] && filter) if ("[object Function]" == (className = getClass.call(filter))) callback = filter; else if ("[object Array]" == className) {
                                    properties = {};
                                    for (var value, index = 0, length = filter.length; index < length; value = filter[index++], 
                                    ("[object String]" == (className = getClass.call(value)) || "[object Number]" == className) && (properties[value] = 1)) ;
                                }
                                if (width) if ("[object Number]" == (className = getClass.call(width))) {
                                    if ((width -= width % 1) > 0) for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ") ;
                                } else "[object String]" == className && (whitespace = width.length <= 10 ? width : width.slice(0, 10));
                                return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
                            };
                        }
                        if (!has("json-parse")) {
                            var Index, Source, fromCharCode = String.fromCharCode, Unescapes = {
                                92: "\\",
                                34: '"',
                                47: "/",
                                98: "\b",
                                116: "\t",
                                110: "\n",
                                102: "\f",
                                114: "\r"
                            }, abort = function() {
                                throw Index = Source = null, SyntaxError();
                            }, lex = function() {
                                for (var value, begin, position, isSigned, charCode, source = Source, length = source.length; Index < length; ) switch (charCode = source.charCodeAt(Index)) {
                                  case 9:
                                  case 10:
                                  case 13:
                                  case 32:
                                    Index++;
                                    break;

                                  case 123:
                                  case 125:
                                  case 91:
                                  case 93:
                                  case 58:
                                  case 44:
                                    return value = charIndexBuggy ? source.charAt(Index) : source[Index], Index++, value;

                                  case 34:
                                    for (value = "@", Index++; Index < length; ) if ((charCode = source.charCodeAt(Index)) < 32) abort(); else if (92 == charCode) switch (charCode = source.charCodeAt(++Index)) {
                                      case 92:
                                      case 34:
                                      case 47:
                                      case 98:
                                      case 116:
                                      case 110:
                                      case 102:
                                      case 114:
                                        value += Unescapes[charCode], Index++;
                                        break;

                                      case 117:
                                        for (begin = ++Index, position = Index + 4; Index < position; Index++) (charCode = source.charCodeAt(Index)) >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70 || abort();
                                        value += fromCharCode("0x" + source.slice(begin, Index));
                                        break;

                                      default:
                                        abort();
                                    } else {
                                        if (34 == charCode) break;
                                        for (charCode = source.charCodeAt(Index), begin = Index; charCode >= 32 && 92 != charCode && 34 != charCode; ) charCode = source.charCodeAt(++Index);
                                        value += source.slice(begin, Index);
                                    }
                                    if (34 == source.charCodeAt(Index)) return Index++, value;
                                    abort();

                                  default:
                                    if (begin = Index, 45 == charCode && (isSigned = !0, charCode = source.charCodeAt(++Index)), 
                                    charCode >= 48 && charCode <= 57) {
                                        for (48 == charCode && (charCode = source.charCodeAt(Index + 1)) >= 48 && charCode <= 57 && abort(), 
                                        isSigned = !1; Index < length && (charCode = source.charCodeAt(Index)) >= 48 && charCode <= 57; Index++) ;
                                        if (46 == source.charCodeAt(Index)) {
                                            for (position = ++Index; position < length && (charCode = source.charCodeAt(position)) >= 48 && charCode <= 57; position++) ;
                                            position == Index && abort(), Index = position;
                                        }
                                        if (101 == (charCode = source.charCodeAt(Index)) || 69 == charCode) {
                                            for (charCode = source.charCodeAt(++Index), 43 != charCode && 45 != charCode || Index++, 
                                            position = Index; position < length && (charCode = source.charCodeAt(position)) >= 48 && charCode <= 57; position++) ;
                                            position == Index && abort(), Index = position;
                                        }
                                        return +source.slice(begin, Index);
                                    }
                                    if (isSigned && abort(), "true" == source.slice(Index, Index + 4)) return Index += 4, 
                                    !0;
                                    if ("false" == source.slice(Index, Index + 5)) return Index += 5, !1;
                                    if ("null" == source.slice(Index, Index + 4)) return Index += 4, null;
                                    abort();
                                }
                                return "$";
                            }, get = function(value) {
                                var results, hasMembers;
                                if ("$" == value && abort(), "string" == typeof value) {
                                    if ("@" == (charIndexBuggy ? value.charAt(0) : value[0])) return value.slice(1);
                                    if ("[" == value) {
                                        for (results = []; "]" != (value = lex()); hasMembers || (hasMembers = !0)) hasMembers && ("," == value ? "]" == (value = lex()) && abort() : abort()), 
                                        "," == value && abort(), results.push(get(value));
                                        return results;
                                    }
                                    if ("{" == value) {
                                        for (results = {}; "}" != (value = lex()); hasMembers || (hasMembers = !0)) hasMembers && ("," == value ? "}" == (value = lex()) && abort() : abort()), 
                                        "," != value && "string" == typeof value && "@" == (charIndexBuggy ? value.charAt(0) : value[0]) && ":" == lex() || abort(), 
                                        results[value.slice(1)] = get(lex());
                                        return results;
                                    }
                                    abort();
                                }
                                return value;
                            }, update = function(source, property, callback) {
                                var element = walk(source, property, callback);
                                element === undef ? delete source[property] : source[property] = element;
                            }, walk = function(source, property, callback) {
                                var length, value = source[property];
                                if ("object" == typeof value && value) if ("[object Array]" == getClass.call(value)) for (length = value.length; length--; ) update(value, length, callback); else forEach(value, function(property) {
                                    update(value, property, callback);
                                });
                                return callback.call(source, property, value);
                            };
                            exports.parse = function(source, callback) {
                                var result, value;
                                return Index = 0, Source = "" + source, result = get(lex()), "$" != lex() && abort(), 
                                Index = Source = null, callback && "[object Function]" == getClass.call(callback) ? walk((value = {}, 
                                value[""] = result, value), "", callback) : result;
                            };
                        }
                    }
                    return exports.runInContext = runInContext, exports;
                }
                var isLoader = "function" == typeof define && define.amd, objectTypes = {
                    function: !0,
                    object: !0
                }, freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports, root = objectTypes[typeof window] && window || this, freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && "object" == typeof global && global;
                if (!freeGlobal || freeGlobal.global !== freeGlobal && freeGlobal.window !== freeGlobal && freeGlobal.self !== freeGlobal || (root = freeGlobal), 
                freeExports && !isLoader) runInContext(root, freeExports); else {
                    var nativeJSON = root.JSON, previousJSON = root.JSON3, isRestored = !1, JSON3 = runInContext(root, root.JSON3 = {
                        noConflict: function() {
                            return isRestored || (isRestored = !0, root.JSON = nativeJSON, root.JSON3 = previousJSON, 
                            nativeJSON = previousJSON = null), JSON3;
                        }
                    });
                    root.JSON = {
                        parse: JSON3.parse,
                        stringify: JSON3.stringify
                    };
                }
                isLoader && define(function() {
                    return JSON3;
                });
            }).call(this);
        }).call(exports, __webpack_require__(12)(module), function() {
            return this;
        }());
    }, function(module, exports) {
        module.exports = function(module) {
            return module.webpackPolyfill || (module.deprecate = function() {}, module.paths = [], 
            module.children = [], module.webpackPolyfill = 1), module;
        };
    }, function(module, exports) {
        function Emitter(obj) {
            if (obj) return mixin(obj);
        }
        function mixin(obj) {
            for (var key in Emitter.prototype) obj[key] = Emitter.prototype[key];
            return obj;
        }
        module.exports = Emitter, Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
            return this._callbacks = this._callbacks || {}, (this._callbacks[event] = this._callbacks[event] || []).push(fn), 
            this;
        }, Emitter.prototype.once = function(event, fn) {
            function on() {
                self.off(event, on), fn.apply(this, arguments);
            }
            var self = this;
            return this._callbacks = this._callbacks || {}, on.fn = fn, this.on(event, on), 
            this;
        }, Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
            if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, 
            this;
            var callbacks = this._callbacks[event];
            if (!callbacks) return this;
            if (1 == arguments.length) return delete this._callbacks[event], this;
            for (var cb, i = 0; i < callbacks.length; i++) if ((cb = callbacks[i]) === fn || cb.fn === fn) {
                callbacks.splice(i, 1);
                break;
            }
            return this;
        }, Emitter.prototype.emit = function(event) {
            this._callbacks = this._callbacks || {};
            var args = [].slice.call(arguments, 1), callbacks = this._callbacks[event];
            if (callbacks) {
                callbacks = callbacks.slice(0);
                for (var i = 0, len = callbacks.length; i < len; ++i) callbacks[i].apply(this, args);
            }
            return this;
        }, Emitter.prototype.listeners = function(event) {
            return this._callbacks = this._callbacks || {}, this._callbacks[event] || [];
        }, Emitter.prototype.hasListeners = function(event) {
            return !!this.listeners(event).length;
        };
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            var isArray = __webpack_require__(15), isBuf = __webpack_require__(16);
            exports.deconstructPacket = function(packet) {
                function _deconstructPacket(data) {
                    if (!data) return data;
                    if (isBuf(data)) {
                        var placeholder = {
                            _placeholder: !0,
                            num: buffers.length
                        };
                        return buffers.push(data), placeholder;
                    }
                    if (isArray(data)) {
                        for (var newData = new Array(data.length), i = 0; i < data.length; i++) newData[i] = _deconstructPacket(data[i]);
                        return newData;
                    }
                    if ("object" == typeof data && !(data instanceof Date)) {
                        var newData = {};
                        for (var key in data) newData[key] = _deconstructPacket(data[key]);
                        return newData;
                    }
                    return data;
                }
                var buffers = [], packetData = packet.data, pack = packet;
                return pack.data = _deconstructPacket(packetData), pack.attachments = buffers.length, 
                {
                    packet: pack,
                    buffers: buffers
                };
            }, exports.reconstructPacket = function(packet, buffers) {
                function _reconstructPacket(data) {
                    if (data && data._placeholder) {
                        return buffers[data.num];
                    }
                    if (isArray(data)) {
                        for (var i = 0; i < data.length; i++) data[i] = _reconstructPacket(data[i]);
                        return data;
                    }
                    if (data && "object" == typeof data) {
                        for (var key in data) data[key] = _reconstructPacket(data[key]);
                        return data;
                    }
                    return data;
                }
                return packet.data = _reconstructPacket(packet.data), packet.attachments = void 0, 
                packet;
            }, exports.removeBlobs = function(data, callback) {
                function _removeBlobs(obj, curKey, containingObject) {
                    if (!obj) return obj;
                    if (global.Blob && obj instanceof Blob || global.File && obj instanceof File) {
                        pendingBlobs++;
                        var fileReader = new FileReader();
                        fileReader.onload = function() {
                            containingObject ? containingObject[curKey] = this.result : bloblessData = this.result, 
                            --pendingBlobs || callback(bloblessData);
                        }, fileReader.readAsArrayBuffer(obj);
                    } else if (isArray(obj)) for (var i = 0; i < obj.length; i++) _removeBlobs(obj[i], i, obj); else if (obj && "object" == typeof obj && !isBuf(obj)) for (var key in obj) _removeBlobs(obj[key], key, obj);
                }
                var pendingBlobs = 0, bloblessData = data;
                _removeBlobs(bloblessData), pendingBlobs || callback(bloblessData);
            };
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports) {
        module.exports = Array.isArray || function(arr) {
            return "[object Array]" == Object.prototype.toString.call(arr);
        };
    }, function(module, exports) {
        (function(global) {
            function isBuf(obj) {
                return global.Buffer && global.Buffer.isBuffer(obj) || global.ArrayBuffer && obj instanceof ArrayBuffer;
            }
            module.exports = isBuf;
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports, __webpack_require__) {
        "use strict";
        function Manager(uri, opts) {
            if (!(this instanceof Manager)) return new Manager(uri, opts);
            uri && "object" === (void 0 === uri ? "undefined" : _typeof(uri)) && (opts = uri, 
            uri = void 0), opts = opts || {}, opts.path = opts.path || "/socket.io", this.nsps = {}, 
            this.subs = [], this.opts = opts, this.reconnection(!1 !== opts.reconnection), this.reconnectionAttempts(opts.reconnectionAttempts || 1 / 0), 
            this.reconnectionDelay(opts.reconnectionDelay || 1e3), this.reconnectionDelayMax(opts.reconnectionDelayMax || 5e3), 
            this.randomizationFactor(opts.randomizationFactor || .5), this.backoff = new Backoff({
                min: this.reconnectionDelay(),
                max: this.reconnectionDelayMax(),
                jitter: this.randomizationFactor()
            }), this.timeout(null == opts.timeout ? 2e4 : opts.timeout), this.readyState = "closed", 
            this.uri = uri, this.connecting = [], this.lastPing = null, this.encoding = !1, 
            this.packetBuffer = [], this.encoder = new parser.Encoder(), this.decoder = new parser.Decoder(), 
            this.autoConnect = !1 !== opts.autoConnect, this.autoConnect && this.open();
        }
        var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        }, eio = __webpack_require__(18), Socket = __webpack_require__(44), Emitter = __webpack_require__(35), parser = __webpack_require__(7), on = __webpack_require__(46), bind = __webpack_require__(47), debug = __webpack_require__(3)("socket.io-client:manager"), indexOf = __webpack_require__(42), Backoff = __webpack_require__(48), has = Object.prototype.hasOwnProperty;
        module.exports = Manager, Manager.prototype.emitAll = function() {
            this.emit.apply(this, arguments);
            for (var nsp in this.nsps) has.call(this.nsps, nsp) && this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
        }, Manager.prototype.updateSocketIds = function() {
            for (var nsp in this.nsps) has.call(this.nsps, nsp) && (this.nsps[nsp].id = this.engine.id);
        }, Emitter(Manager.prototype), Manager.prototype.reconnection = function(v) {
            return arguments.length ? (this._reconnection = !!v, this) : this._reconnection;
        }, Manager.prototype.reconnectionAttempts = function(v) {
            return arguments.length ? (this._reconnectionAttempts = v, this) : this._reconnectionAttempts;
        }, Manager.prototype.reconnectionDelay = function(v) {
            return arguments.length ? (this._reconnectionDelay = v, this.backoff && this.backoff.setMin(v), 
            this) : this._reconnectionDelay;
        }, Manager.prototype.randomizationFactor = function(v) {
            return arguments.length ? (this._randomizationFactor = v, this.backoff && this.backoff.setJitter(v), 
            this) : this._randomizationFactor;
        }, Manager.prototype.reconnectionDelayMax = function(v) {
            return arguments.length ? (this._reconnectionDelayMax = v, this.backoff && this.backoff.setMax(v), 
            this) : this._reconnectionDelayMax;
        }, Manager.prototype.timeout = function(v) {
            return arguments.length ? (this._timeout = v, this) : this._timeout;
        }, Manager.prototype.maybeReconnectOnOpen = function() {
            !this.reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect();
        }, Manager.prototype.open = Manager.prototype.connect = function(fn, opts) {
            if (debug("readyState %s", this.readyState), ~this.readyState.indexOf("open")) return this;
            debug("opening %s", this.uri), this.engine = eio(this.uri, this.opts);
            var socket = this.engine, self = this;
            this.readyState = "opening", this.skipReconnect = !1;
            var openSub = on(socket, "open", function() {
                self.onopen(), fn && fn();
            }), errorSub = on(socket, "error", function(data) {
                if (debug("connect_error"), self.cleanup(), self.readyState = "closed", self.emitAll("connect_error", data), 
                fn) {
                    var err = new Error("Connection error");
                    err.data = data, fn(err);
                } else self.maybeReconnectOnOpen();
            });
            if (!1 !== this._timeout) {
                var timeout = this._timeout;
                debug("connect attempt will timeout after %d", timeout);
                var timer = setTimeout(function() {
                    debug("connect attempt timed out after %d", timeout), openSub.destroy(), socket.close(), 
                    socket.emit("error", "timeout"), self.emitAll("connect_timeout", timeout);
                }, timeout);
                this.subs.push({
                    destroy: function() {
                        clearTimeout(timer);
                    }
                });
            }
            return this.subs.push(openSub), this.subs.push(errorSub), this;
        }, Manager.prototype.onopen = function() {
            debug("open"), this.cleanup(), this.readyState = "open", this.emit("open");
            var socket = this.engine;
            this.subs.push(on(socket, "data", bind(this, "ondata"))), this.subs.push(on(socket, "ping", bind(this, "onping"))), 
            this.subs.push(on(socket, "pong", bind(this, "onpong"))), this.subs.push(on(socket, "error", bind(this, "onerror"))), 
            this.subs.push(on(socket, "close", bind(this, "onclose"))), this.subs.push(on(this.decoder, "decoded", bind(this, "ondecoded")));
        }, Manager.prototype.onping = function() {
            this.lastPing = new Date(), this.emitAll("ping");
        }, Manager.prototype.onpong = function() {
            this.emitAll("pong", new Date() - this.lastPing);
        }, Manager.prototype.ondata = function(data) {
            this.decoder.add(data);
        }, Manager.prototype.ondecoded = function(packet) {
            this.emit("packet", packet);
        }, Manager.prototype.onerror = function(err) {
            debug("error", err), this.emitAll("error", err);
        }, Manager.prototype.socket = function(nsp, opts) {
            function onConnecting() {
                ~indexOf(self.connecting, socket) || self.connecting.push(socket);
            }
            var socket = this.nsps[nsp];
            if (!socket) {
                socket = new Socket(this, nsp, opts), this.nsps[nsp] = socket;
                var self = this;
                socket.on("connecting", onConnecting), socket.on("connect", function() {
                    socket.id = self.engine.id;
                }), this.autoConnect && onConnecting();
            }
            return socket;
        }, Manager.prototype.destroy = function(socket) {
            var index = indexOf(this.connecting, socket);
            ~index && this.connecting.splice(index, 1), this.connecting.length || this.close();
        }, Manager.prototype.packet = function(packet) {
            debug("writing packet %j", packet);
            var self = this;
            packet.query && 0 === packet.type && (packet.nsp += "?" + packet.query), self.encoding ? self.packetBuffer.push(packet) : (self.encoding = !0, 
            this.encoder.encode(packet, function(encodedPackets) {
                for (var i = 0; i < encodedPackets.length; i++) self.engine.write(encodedPackets[i], packet.options);
                self.encoding = !1, self.processPacketQueue();
            }));
        }, Manager.prototype.processPacketQueue = function() {
            if (this.packetBuffer.length > 0 && !this.encoding) {
                var pack = this.packetBuffer.shift();
                this.packet(pack);
            }
        }, Manager.prototype.cleanup = function() {
            debug("cleanup");
            for (var subsLength = this.subs.length, i = 0; i < subsLength; i++) {
                this.subs.shift().destroy();
            }
            this.packetBuffer = [], this.encoding = !1, this.lastPing = null, this.decoder.destroy();
        }, Manager.prototype.close = Manager.prototype.disconnect = function() {
            debug("disconnect"), this.skipReconnect = !0, this.reconnecting = !1, "opening" === this.readyState && this.cleanup(), 
            this.backoff.reset(), this.readyState = "closed", this.engine && this.engine.close();
        }, Manager.prototype.onclose = function(reason) {
            debug("onclose"), this.cleanup(), this.backoff.reset(), this.readyState = "closed", 
            this.emit("close", reason), this._reconnection && !this.skipReconnect && this.reconnect();
        }, Manager.prototype.reconnect = function() {
            if (this.reconnecting || this.skipReconnect) return this;
            var self = this;
            if (this.backoff.attempts >= this._reconnectionAttempts) debug("reconnect failed"), 
            this.backoff.reset(), this.emitAll("reconnect_failed"), this.reconnecting = !1; else {
                var delay = this.backoff.duration();
                debug("will wait %dms before reconnect attempt", delay), this.reconnecting = !0;
                var timer = setTimeout(function() {
                    self.skipReconnect || (debug("attempting reconnect"), self.emitAll("reconnect_attempt", self.backoff.attempts), 
                    self.emitAll("reconnecting", self.backoff.attempts), self.skipReconnect || self.open(function(err) {
                        err ? (debug("reconnect attempt error"), self.reconnecting = !1, self.reconnect(), 
                        self.emitAll("reconnect_error", err.data)) : (debug("reconnect success"), self.onreconnect());
                    }));
                }, delay);
                this.subs.push({
                    destroy: function() {
                        clearTimeout(timer);
                    }
                });
            }
        }, Manager.prototype.onreconnect = function() {
            var attempt = this.backoff.attempts;
            this.reconnecting = !1, this.backoff.reset(), this.updateSocketIds(), this.emitAll("reconnect", attempt);
        };
    }, function(module, exports, __webpack_require__) {
        module.exports = __webpack_require__(19);
    }, function(module, exports, __webpack_require__) {
        module.exports = __webpack_require__(20), module.exports.parser = __webpack_require__(27);
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            function Socket(uri, opts) {
                if (!(this instanceof Socket)) return new Socket(uri, opts);
                opts = opts || {}, uri && "object" == typeof uri && (opts = uri, uri = null), uri ? (uri = parseuri(uri), 
                opts.hostname = uri.host, opts.secure = "https" === uri.protocol || "wss" === uri.protocol, 
                opts.port = uri.port, uri.query && (opts.query = uri.query)) : opts.host && (opts.hostname = parseuri(opts.host).host), 
                this.secure = null != opts.secure ? opts.secure : global.location && "https:" === location.protocol, 
                opts.hostname && !opts.port && (opts.port = this.secure ? "443" : "80"), this.agent = opts.agent || !1, 
                this.hostname = opts.hostname || (global.location ? location.hostname : "localhost"), 
                this.port = opts.port || (global.location && location.port ? location.port : this.secure ? 443 : 80), 
                this.query = opts.query || {}, "string" == typeof this.query && (this.query = parseqs.decode(this.query)), 
                this.upgrade = !1 !== opts.upgrade, this.path = (opts.path || "/engine.io").replace(/\/$/, "") + "/", 
                this.forceJSONP = !!opts.forceJSONP, this.jsonp = !1 !== opts.jsonp, this.forceBase64 = !!opts.forceBase64, 
                this.enablesXDR = !!opts.enablesXDR, this.timestampParam = opts.timestampParam || "t", 
                this.timestampRequests = opts.timestampRequests, this.transports = opts.transports || [ "polling", "websocket" ], 
                this.readyState = "", this.writeBuffer = [], this.prevBufferLen = 0, this.policyPort = opts.policyPort || 843, 
                this.rememberUpgrade = opts.rememberUpgrade || !1, this.binaryType = null, this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades, 
                this.perMessageDeflate = !1 !== opts.perMessageDeflate && (opts.perMessageDeflate || {}), 
                !0 === this.perMessageDeflate && (this.perMessageDeflate = {}), this.perMessageDeflate && null == this.perMessageDeflate.threshold && (this.perMessageDeflate.threshold = 1024), 
                this.pfx = opts.pfx || null, this.key = opts.key || null, this.passphrase = opts.passphrase || null, 
                this.cert = opts.cert || null, this.ca = opts.ca || null, this.ciphers = opts.ciphers || null, 
                this.rejectUnauthorized = void 0 === opts.rejectUnauthorized ? null : opts.rejectUnauthorized, 
                this.forceNode = !!opts.forceNode;
                var freeGlobal = "object" == typeof global && global;
                freeGlobal.global === freeGlobal && (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0 && (this.extraHeaders = opts.extraHeaders), 
                opts.localAddress && (this.localAddress = opts.localAddress)), this.id = null, this.upgrades = null, 
                this.pingInterval = null, this.pingTimeout = null, this.pingIntervalTimer = null, 
                this.pingTimeoutTimer = null, this.open();
            }
            function clone(obj) {
                var o = {};
                for (var i in obj) obj.hasOwnProperty(i) && (o[i] = obj[i]);
                return o;
            }
            var transports = __webpack_require__(21), Emitter = __webpack_require__(35), debug = __webpack_require__(3)("engine.io-client:socket"), index = __webpack_require__(42), parser = __webpack_require__(27), parseuri = __webpack_require__(2), parsejson = __webpack_require__(43), parseqs = __webpack_require__(36);
            module.exports = Socket, Socket.priorWebsocketSuccess = !1, Emitter(Socket.prototype), 
            Socket.protocol = parser.protocol, Socket.Socket = Socket, Socket.Transport = __webpack_require__(26), 
            Socket.transports = __webpack_require__(21), Socket.parser = __webpack_require__(27), 
            Socket.prototype.createTransport = function(name) {
                debug('creating transport "%s"', name);
                var query = clone(this.query);
                return query.EIO = parser.protocol, query.transport = name, this.id && (query.sid = this.id), 
                new transports[name]({
                    agent: this.agent,
                    hostname: this.hostname,
                    port: this.port,
                    secure: this.secure,
                    path: this.path,
                    query: query,
                    forceJSONP: this.forceJSONP,
                    jsonp: this.jsonp,
                    forceBase64: this.forceBase64,
                    enablesXDR: this.enablesXDR,
                    timestampRequests: this.timestampRequests,
                    timestampParam: this.timestampParam,
                    policyPort: this.policyPort,
                    socket: this,
                    pfx: this.pfx,
                    key: this.key,
                    passphrase: this.passphrase,
                    cert: this.cert,
                    ca: this.ca,
                    ciphers: this.ciphers,
                    rejectUnauthorized: this.rejectUnauthorized,
                    perMessageDeflate: this.perMessageDeflate,
                    extraHeaders: this.extraHeaders,
                    forceNode: this.forceNode,
                    localAddress: this.localAddress
                });
            }, Socket.prototype.open = function() {
                var transport;
                if (this.rememberUpgrade && Socket.priorWebsocketSuccess && -1 !== this.transports.indexOf("websocket")) transport = "websocket"; else {
                    if (0 === this.transports.length) {
                        var self = this;
                        return void setTimeout(function() {
                            self.emit("error", "No transports available");
                        }, 0);
                    }
                    transport = this.transports[0];
                }
                this.readyState = "opening";
                try {
                    transport = this.createTransport(transport);
                } catch (e) {
                    return this.transports.shift(), void this.open();
                }
                transport.open(), this.setTransport(transport);
            }, Socket.prototype.setTransport = function(transport) {
                debug("setting transport %s", transport.name);
                var self = this;
                this.transport && (debug("clearing existing transport %s", this.transport.name), 
                this.transport.removeAllListeners()), this.transport = transport, transport.on("drain", function() {
                    self.onDrain();
                }).on("packet", function(packet) {
                    self.onPacket(packet);
                }).on("error", function(e) {
                    self.onError(e);
                }).on("close", function() {
                    self.onClose("transport close");
                });
            }, Socket.prototype.probe = function(name) {
                function onTransportOpen() {
                    if (self.onlyBinaryUpgrades) {
                        var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
                        failed = failed || upgradeLosesBinary;
                    }
                    failed || (debug('probe transport "%s" opened', name), transport.send([ {
                        type: "ping",
                        data: "probe"
                    } ]), transport.once("packet", function(msg) {
                        if (!failed) if ("pong" === msg.type && "probe" === msg.data) {
                            if (debug('probe transport "%s" pong', name), self.upgrading = !0, self.emit("upgrading", transport), 
                            !transport) return;
                            Socket.priorWebsocketSuccess = "websocket" === transport.name, debug('pausing current transport "%s"', self.transport.name), 
                            self.transport.pause(function() {
                                failed || "closed" !== self.readyState && (debug("changing transport and sending upgrade packet"), 
                                cleanup(), self.setTransport(transport), transport.send([ {
                                    type: "upgrade"
                                } ]), self.emit("upgrade", transport), transport = null, self.upgrading = !1, self.flush());
                            });
                        } else {
                            debug('probe transport "%s" failed', name);
                            var err = new Error("probe error");
                            err.transport = transport.name, self.emit("upgradeError", err);
                        }
                    }));
                }
                function freezeTransport() {
                    failed || (failed = !0, cleanup(), transport.close(), transport = null);
                }
                function onerror(err) {
                    var error = new Error("probe error: " + err);
                    error.transport = transport.name, freezeTransport(), debug('probe transport "%s" failed because of error: %s', name, err), 
                    self.emit("upgradeError", error);
                }
                function onTransportClose() {
                    onerror("transport closed");
                }
                function onclose() {
                    onerror("socket closed");
                }
                function onupgrade(to) {
                    transport && to.name !== transport.name && (debug('"%s" works - aborting "%s"', to.name, transport.name), 
                    freezeTransport());
                }
                function cleanup() {
                    transport.removeListener("open", onTransportOpen), transport.removeListener("error", onerror), 
                    transport.removeListener("close", onTransportClose), self.removeListener("close", onclose), 
                    self.removeListener("upgrading", onupgrade);
                }
                debug('probing transport "%s"', name);
                var transport = this.createTransport(name, {
                    probe: 1
                }), failed = !1, self = this;
                Socket.priorWebsocketSuccess = !1, transport.once("open", onTransportOpen), transport.once("error", onerror), 
                transport.once("close", onTransportClose), this.once("close", onclose), this.once("upgrading", onupgrade), 
                transport.open();
            }, Socket.prototype.onOpen = function() {
                if (debug("socket open"), this.readyState = "open", Socket.priorWebsocketSuccess = "websocket" === this.transport.name, 
                this.emit("open"), this.flush(), "open" === this.readyState && this.upgrade && this.transport.pause) {
                    debug("starting upgrade probes");
                    for (var i = 0, l = this.upgrades.length; i < l; i++) this.probe(this.upgrades[i]);
                }
            }, Socket.prototype.onPacket = function(packet) {
                if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) switch (debug('socket receive: type "%s", data "%s"', packet.type, packet.data), 
                this.emit("packet", packet), this.emit("heartbeat"), packet.type) {
                  case "open":
                    this.onHandshake(parsejson(packet.data));
                    break;

                  case "pong":
                    this.setPing(), this.emit("pong");
                    break;

                  case "error":
                    var err = new Error("server error");
                    err.code = packet.data, this.onError(err);
                    break;

                  case "message":
                    this.emit("data", packet.data), this.emit("message", packet.data);
                } else debug('packet received with socket readyState "%s"', this.readyState);
            }, Socket.prototype.onHandshake = function(data) {
                this.emit("handshake", data), this.id = data.sid, this.transport.query.sid = data.sid, 
                this.upgrades = this.filterUpgrades(data.upgrades), this.pingInterval = data.pingInterval, 
                this.pingTimeout = data.pingTimeout, this.onOpen(), "closed" !== this.readyState && (this.setPing(), 
                this.removeListener("heartbeat", this.onHeartbeat), this.on("heartbeat", this.onHeartbeat));
            }, Socket.prototype.onHeartbeat = function(timeout) {
                clearTimeout(this.pingTimeoutTimer);
                var self = this;
                self.pingTimeoutTimer = setTimeout(function() {
                    "closed" !== self.readyState && self.onClose("ping timeout");
                }, timeout || self.pingInterval + self.pingTimeout);
            }, Socket.prototype.setPing = function() {
                var self = this;
                clearTimeout(self.pingIntervalTimer), self.pingIntervalTimer = setTimeout(function() {
                    debug("writing ping packet - expecting pong within %sms", self.pingTimeout), self.ping(), 
                    self.onHeartbeat(self.pingTimeout);
                }, self.pingInterval);
            }, Socket.prototype.ping = function() {
                var self = this;
                this.sendPacket("ping", function() {
                    self.emit("ping");
                });
            }, Socket.prototype.onDrain = function() {
                this.writeBuffer.splice(0, this.prevBufferLen), this.prevBufferLen = 0, 0 === this.writeBuffer.length ? this.emit("drain") : this.flush();
            }, Socket.prototype.flush = function() {
                "closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (debug("flushing %d packets in socket", this.writeBuffer.length), 
                this.transport.send(this.writeBuffer), this.prevBufferLen = this.writeBuffer.length, 
                this.emit("flush"));
            }, Socket.prototype.write = Socket.prototype.send = function(msg, options, fn) {
                return this.sendPacket("message", msg, options, fn), this;
            }, Socket.prototype.sendPacket = function(type, data, options, fn) {
                if ("function" == typeof data && (fn = data, data = void 0), "function" == typeof options && (fn = options, 
                options = null), "closing" !== this.readyState && "closed" !== this.readyState) {
                    options = options || {}, options.compress = !1 !== options.compress;
                    var packet = {
                        type: type,
                        data: data,
                        options: options
                    };
                    this.emit("packetCreate", packet), this.writeBuffer.push(packet), fn && this.once("flush", fn), 
                    this.flush();
                }
            }, Socket.prototype.close = function() {
                function close() {
                    self.onClose("forced close"), debug("socket closing - telling transport to close"), 
                    self.transport.close();
                }
                function cleanupAndClose() {
                    self.removeListener("upgrade", cleanupAndClose), self.removeListener("upgradeError", cleanupAndClose), 
                    close();
                }
                function waitForUpgrade() {
                    self.once("upgrade", cleanupAndClose), self.once("upgradeError", cleanupAndClose);
                }
                if ("opening" === this.readyState || "open" === this.readyState) {
                    this.readyState = "closing";
                    var self = this;
                    this.writeBuffer.length ? this.once("drain", function() {
                        this.upgrading ? waitForUpgrade() : close();
                    }) : this.upgrading ? waitForUpgrade() : close();
                }
                return this;
            }, Socket.prototype.onError = function(err) {
                debug("socket error %j", err), Socket.priorWebsocketSuccess = !1, this.emit("error", err), 
                this.onClose("transport error", err);
            }, Socket.prototype.onClose = function(reason, desc) {
                if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
                    debug('socket close with reason: "%s"', reason);
                    var self = this;
                    clearTimeout(this.pingIntervalTimer), clearTimeout(this.pingTimeoutTimer), this.transport.removeAllListeners("close"), 
                    this.transport.close(), this.transport.removeAllListeners(), this.readyState = "closed", 
                    this.id = null, this.emit("close", reason, desc), self.writeBuffer = [], self.prevBufferLen = 0;
                }
            }, Socket.prototype.filterUpgrades = function(upgrades) {
                for (var filteredUpgrades = [], i = 0, j = upgrades.length; i < j; i++) ~index(this.transports, upgrades[i]) && filteredUpgrades.push(upgrades[i]);
                return filteredUpgrades;
            };
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            function polling(opts) {
                var xd = !1, xs = !1, jsonp = !1 !== opts.jsonp;
                if (global.location) {
                    var isSSL = "https:" === location.protocol, port = location.port;
                    port || (port = isSSL ? 443 : 80), xd = opts.hostname !== location.hostname || port !== opts.port, 
                    xs = opts.secure !== isSSL;
                }
                if (opts.xdomain = xd, opts.xscheme = xs, "open" in new XMLHttpRequest(opts) && !opts.forceJSONP) return new XHR(opts);
                if (!jsonp) throw new Error("JSONP disabled");
                return new JSONP(opts);
            }
            var XMLHttpRequest = __webpack_require__(22), XHR = __webpack_require__(24), JSONP = __webpack_require__(39), websocket = __webpack_require__(40);
            exports.polling = polling, exports.websocket = websocket;
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            var hasCORS = __webpack_require__(23);
            module.exports = function(opts) {
                var xdomain = opts.xdomain, xscheme = opts.xscheme, enablesXDR = opts.enablesXDR;
                try {
                    if ("undefined" != typeof XMLHttpRequest && (!xdomain || hasCORS)) return new XMLHttpRequest();
                } catch (e) {}
                try {
                    if ("undefined" != typeof XDomainRequest && !xscheme && enablesXDR) return new XDomainRequest();
                } catch (e) {}
                if (!xdomain) try {
                    return new (global[[ "Active" ].concat("Object").join("X")])("Microsoft.XMLHTTP");
                } catch (e) {}
            };
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports) {
        try {
            module.exports = "undefined" != typeof XMLHttpRequest && "withCredentials" in new XMLHttpRequest();
        } catch (err) {
            module.exports = !1;
        }
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            function empty() {}
            function XHR(opts) {
                if (Polling.call(this, opts), this.requestTimeout = opts.requestTimeout, global.location) {
                    var isSSL = "https:" === location.protocol, port = location.port;
                    port || (port = isSSL ? 443 : 80), this.xd = opts.hostname !== global.location.hostname || port !== opts.port, 
                    this.xs = opts.secure !== isSSL;
                } else this.extraHeaders = opts.extraHeaders;
            }
            function Request(opts) {
                this.method = opts.method || "GET", this.uri = opts.uri, this.xd = !!opts.xd, this.xs = !!opts.xs, 
                this.async = !1 !== opts.async, this.data = void 0 !== opts.data ? opts.data : null, 
                this.agent = opts.agent, this.isBinary = opts.isBinary, this.supportsBinary = opts.supportsBinary, 
                this.enablesXDR = opts.enablesXDR, this.requestTimeout = opts.requestTimeout, this.pfx = opts.pfx, 
                this.key = opts.key, this.passphrase = opts.passphrase, this.cert = opts.cert, this.ca = opts.ca, 
                this.ciphers = opts.ciphers, this.rejectUnauthorized = opts.rejectUnauthorized, 
                this.extraHeaders = opts.extraHeaders, this.create();
            }
            function unloadHandler() {
                for (var i in Request.requests) Request.requests.hasOwnProperty(i) && Request.requests[i].abort();
            }
            var XMLHttpRequest = __webpack_require__(22), Polling = __webpack_require__(25), Emitter = __webpack_require__(35), inherit = __webpack_require__(37), debug = __webpack_require__(3)("engine.io-client:polling-xhr");
            module.exports = XHR, module.exports.Request = Request, inherit(XHR, Polling), XHR.prototype.supportsBinary = !0, 
            XHR.prototype.request = function(opts) {
                return opts = opts || {}, opts.uri = this.uri(), opts.xd = this.xd, opts.xs = this.xs, 
                opts.agent = this.agent || !1, opts.supportsBinary = this.supportsBinary, opts.enablesXDR = this.enablesXDR, 
                opts.pfx = this.pfx, opts.key = this.key, opts.passphrase = this.passphrase, opts.cert = this.cert, 
                opts.ca = this.ca, opts.ciphers = this.ciphers, opts.rejectUnauthorized = this.rejectUnauthorized, 
                opts.requestTimeout = this.requestTimeout, opts.extraHeaders = this.extraHeaders, 
                new Request(opts);
            }, XHR.prototype.doWrite = function(data, fn) {
                var isBinary = "string" != typeof data && void 0 !== data, req = this.request({
                    method: "POST",
                    data: data,
                    isBinary: isBinary
                }), self = this;
                req.on("success", fn), req.on("error", function(err) {
                    self.onError("xhr post error", err);
                }), this.sendXhr = req;
            }, XHR.prototype.doPoll = function() {
                debug("xhr poll");
                var req = this.request(), self = this;
                req.on("data", function(data) {
                    self.onData(data);
                }), req.on("error", function(err) {
                    self.onError("xhr poll error", err);
                }), this.pollXhr = req;
            }, Emitter(Request.prototype), Request.prototype.create = function() {
                var opts = {
                    agent: this.agent,
                    xdomain: this.xd,
                    xscheme: this.xs,
                    enablesXDR: this.enablesXDR
                };
                opts.pfx = this.pfx, opts.key = this.key, opts.passphrase = this.passphrase, opts.cert = this.cert, 
                opts.ca = this.ca, opts.ciphers = this.ciphers, opts.rejectUnauthorized = this.rejectUnauthorized;
                var xhr = this.xhr = new XMLHttpRequest(opts), self = this;
                try {
                    debug("xhr open %s: %s", this.method, this.uri), xhr.open(this.method, this.uri, this.async);
                    try {
                        if (this.extraHeaders) {
                            xhr.setDisableHeaderCheck(!0);
                            for (var i in this.extraHeaders) this.extraHeaders.hasOwnProperty(i) && xhr.setRequestHeader(i, this.extraHeaders[i]);
                        }
                    } catch (e) {}
                    if (this.supportsBinary && (xhr.responseType = "arraybuffer"), "POST" === this.method) try {
                        this.isBinary ? xhr.setRequestHeader("Content-type", "application/octet-stream") : xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
                    } catch (e) {}
                    try {
                        xhr.setRequestHeader("Accept", "*/*");
                    } catch (e) {}
                    "withCredentials" in xhr && (xhr.withCredentials = !0), this.requestTimeout && (xhr.timeout = this.requestTimeout), 
                    this.hasXDR() ? (xhr.onload = function() {
                        self.onLoad();
                    }, xhr.onerror = function() {
                        self.onError(xhr.responseText);
                    }) : xhr.onreadystatechange = function() {
                        4 === xhr.readyState && (200 === xhr.status || 1223 === xhr.status ? self.onLoad() : setTimeout(function() {
                            self.onError(xhr.status);
                        }, 0));
                    }, debug("xhr data %s", this.data), xhr.send(this.data);
                } catch (e) {
                    return void setTimeout(function() {
                        self.onError(e);
                    }, 0);
                }
                global.document && (this.index = Request.requestsCount++, Request.requests[this.index] = this);
            }, Request.prototype.onSuccess = function() {
                this.emit("success"), this.cleanup();
            }, Request.prototype.onData = function(data) {
                this.emit("data", data), this.onSuccess();
            }, Request.prototype.onError = function(err) {
                this.emit("error", err), this.cleanup(!0);
            }, Request.prototype.cleanup = function(fromError) {
                if (void 0 !== this.xhr && null !== this.xhr) {
                    if (this.hasXDR() ? this.xhr.onload = this.xhr.onerror = empty : this.xhr.onreadystatechange = empty, 
                    fromError) try {
                        this.xhr.abort();
                    } catch (e) {}
                    global.document && delete Request.requests[this.index], this.xhr = null;
                }
            }, Request.prototype.onLoad = function() {
                var data;
                try {
                    var contentType;
                    try {
                        contentType = this.xhr.getResponseHeader("Content-Type").split(";")[0];
                    } catch (e) {}
                    if ("application/octet-stream" === contentType) data = this.xhr.response || this.xhr.responseText; else if (this.supportsBinary) try {
                        data = String.fromCharCode.apply(null, new Uint8Array(this.xhr.response));
                    } catch (e) {
                        for (var ui8Arr = new Uint8Array(this.xhr.response), dataArray = [], idx = 0, length = ui8Arr.length; idx < length; idx++) dataArray.push(ui8Arr[idx]);
                        data = String.fromCharCode.apply(null, dataArray);
                    } else data = this.xhr.responseText;
                } catch (e) {
                    this.onError(e);
                }
                null != data && this.onData(data);
            }, Request.prototype.hasXDR = function() {
                return void 0 !== global.XDomainRequest && !this.xs && this.enablesXDR;
            }, Request.prototype.abort = function() {
                this.cleanup();
            }, Request.requestsCount = 0, Request.requests = {}, global.document && (global.attachEvent ? global.attachEvent("onunload", unloadHandler) : global.addEventListener && global.addEventListener("beforeunload", unloadHandler, !1));
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports, __webpack_require__) {
        function Polling(opts) {
            var forceBase64 = opts && opts.forceBase64;
            hasXHR2 && !forceBase64 || (this.supportsBinary = !1), Transport.call(this, opts);
        }
        var Transport = __webpack_require__(26), parseqs = __webpack_require__(36), parser = __webpack_require__(27), inherit = __webpack_require__(37), yeast = __webpack_require__(38), debug = __webpack_require__(3)("engine.io-client:polling");
        module.exports = Polling;
        var hasXHR2 = function() {
            return null != new (__webpack_require__(22))({
                xdomain: !1
            }).responseType;
        }();
        inherit(Polling, Transport), Polling.prototype.name = "polling", Polling.prototype.doOpen = function() {
            this.poll();
        }, Polling.prototype.pause = function(onPause) {
            function pause() {
                debug("paused"), self.readyState = "paused", onPause();
            }
            var self = this;
            if (this.readyState = "pausing", this.polling || !this.writable) {
                var total = 0;
                this.polling && (debug("we are currently polling - waiting to pause"), total++, 
                this.once("pollComplete", function() {
                    debug("pre-pause polling complete"), --total || pause();
                })), this.writable || (debug("we are currently writing - waiting to pause"), total++, 
                this.once("drain", function() {
                    debug("pre-pause writing complete"), --total || pause();
                }));
            } else pause();
        }, Polling.prototype.poll = function() {
            debug("polling"), this.polling = !0, this.doPoll(), this.emit("poll");
        }, Polling.prototype.onData = function(data) {
            var self = this;
            debug("polling got data %s", data);
            var callback = function(packet, index, total) {
                if ("opening" === self.readyState && self.onOpen(), "close" === packet.type) return self.onClose(), 
                !1;
                self.onPacket(packet);
            };
            parser.decodePayload(data, this.socket.binaryType, callback), "closed" !== this.readyState && (this.polling = !1, 
            this.emit("pollComplete"), "open" === this.readyState ? this.poll() : debug('ignoring poll - transport state "%s"', this.readyState));
        }, Polling.prototype.doClose = function() {
            function close() {
                debug("writing close packet"), self.write([ {
                    type: "close"
                } ]);
            }
            var self = this;
            "open" === this.readyState ? (debug("transport open - closing"), close()) : (debug("transport not open - deferring close"), 
            this.once("open", close));
        }, Polling.prototype.write = function(packets) {
            var self = this;
            this.writable = !1;
            var callbackfn = function() {
                self.writable = !0, self.emit("drain");
            };
            parser.encodePayload(packets, this.supportsBinary, function(data) {
                self.doWrite(data, callbackfn);
            });
        }, Polling.prototype.uri = function() {
            var query = this.query || {}, schema = this.secure ? "https" : "http", port = "";
            return !1 !== this.timestampRequests && (query[this.timestampParam] = yeast()), 
            this.supportsBinary || query.sid || (query.b64 = 1), query = parseqs.encode(query), 
            this.port && ("https" === schema && 443 !== Number(this.port) || "http" === schema && 80 !== Number(this.port)) && (port = ":" + this.port), 
            query.length && (query = "?" + query), schema + "://" + (-1 !== this.hostname.indexOf(":") ? "[" + this.hostname + "]" : this.hostname) + port + this.path + query;
        };
    }, function(module, exports, __webpack_require__) {
        function Transport(opts) {
            this.path = opts.path, this.hostname = opts.hostname, this.port = opts.port, this.secure = opts.secure, 
            this.query = opts.query, this.timestampParam = opts.timestampParam, this.timestampRequests = opts.timestampRequests, 
            this.readyState = "", this.agent = opts.agent || !1, this.socket = opts.socket, 
            this.enablesXDR = opts.enablesXDR, this.pfx = opts.pfx, this.key = opts.key, this.passphrase = opts.passphrase, 
            this.cert = opts.cert, this.ca = opts.ca, this.ciphers = opts.ciphers, this.rejectUnauthorized = opts.rejectUnauthorized, 
            this.forceNode = opts.forceNode, this.extraHeaders = opts.extraHeaders, this.localAddress = opts.localAddress;
        }
        var parser = __webpack_require__(27), Emitter = __webpack_require__(35);
        module.exports = Transport, Emitter(Transport.prototype), Transport.prototype.onError = function(msg, desc) {
            var err = new Error(msg);
            return err.type = "TransportError", err.description = desc, this.emit("error", err), 
            this;
        }, Transport.prototype.open = function() {
            return "closed" !== this.readyState && "" !== this.readyState || (this.readyState = "opening", 
            this.doOpen()), this;
        }, Transport.prototype.close = function() {
            return "opening" !== this.readyState && "open" !== this.readyState || (this.doClose(), 
            this.onClose()), this;
        }, Transport.prototype.send = function(packets) {
            if ("open" !== this.readyState) throw new Error("Transport not open");
            this.write(packets);
        }, Transport.prototype.onOpen = function() {
            this.readyState = "open", this.writable = !0, this.emit("open");
        }, Transport.prototype.onData = function(data) {
            var packet = parser.decodePacket(data, this.socket.binaryType);
            this.onPacket(packet);
        }, Transport.prototype.onPacket = function(packet) {
            this.emit("packet", packet);
        }, Transport.prototype.onClose = function() {
            this.readyState = "closed", this.emit("close");
        };
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            function encodeBase64Object(packet, callback) {
                return callback("b" + exports.packets[packet.type] + packet.data.data);
            }
            function encodeArrayBuffer(packet, supportsBinary, callback) {
                if (!supportsBinary) return exports.encodeBase64Packet(packet, callback);
                var data = packet.data, contentArray = new Uint8Array(data), resultBuffer = new Uint8Array(1 + data.byteLength);
                resultBuffer[0] = packets[packet.type];
                for (var i = 0; i < contentArray.length; i++) resultBuffer[i + 1] = contentArray[i];
                return callback(resultBuffer.buffer);
            }
            function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
                if (!supportsBinary) return exports.encodeBase64Packet(packet, callback);
                var fr = new FileReader();
                return fr.onload = function() {
                    packet.data = fr.result, exports.encodePacket(packet, supportsBinary, !0, callback);
                }, fr.readAsArrayBuffer(packet.data);
            }
            function encodeBlob(packet, supportsBinary, callback) {
                if (!supportsBinary) return exports.encodeBase64Packet(packet, callback);
                if (dontSendBlobs) return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
                var length = new Uint8Array(1);
                return length[0] = packets[packet.type], callback(new Blob([ length.buffer, packet.data ]));
            }
            function tryDecode(data) {
                try {
                    data = utf8.decode(data);
                } catch (e) {
                    return !1;
                }
                return data;
            }
            function map(ary, each, done) {
                for (var result = new Array(ary.length), next = after(ary.length, done), i = 0; i < ary.length; i++) !function(i, el, cb) {
                    each(el, function(error, msg) {
                        result[i] = msg, cb(error, result);
                    });
                }(i, ary[i], next);
            }
            var base64encoder, keys = __webpack_require__(28), hasBinary = __webpack_require__(29), sliceBuffer = __webpack_require__(30), after = __webpack_require__(31), utf8 = __webpack_require__(32);
            global && global.ArrayBuffer && (base64encoder = __webpack_require__(33));
            var isAndroid = "undefined" != typeof navigator && /Android/i.test(navigator.userAgent), isPhantomJS = "undefined" != typeof navigator && /PhantomJS/i.test(navigator.userAgent), dontSendBlobs = isAndroid || isPhantomJS;
            exports.protocol = 3;
            var packets = exports.packets = {
                open: 0,
                close: 1,
                ping: 2,
                pong: 3,
                message: 4,
                upgrade: 5,
                noop: 6
            }, packetslist = keys(packets), err = {
                type: "error",
                data: "parser error"
            }, Blob = __webpack_require__(34);
            exports.encodePacket = function(packet, supportsBinary, utf8encode, callback) {
                "function" == typeof supportsBinary && (callback = supportsBinary, supportsBinary = !1), 
                "function" == typeof utf8encode && (callback = utf8encode, utf8encode = null);
                var data = void 0 === packet.data ? void 0 : packet.data.buffer || packet.data;
                if (global.ArrayBuffer && data instanceof ArrayBuffer) return encodeArrayBuffer(packet, supportsBinary, callback);
                if (Blob && data instanceof global.Blob) return encodeBlob(packet, supportsBinary, callback);
                if (data && data.base64) return encodeBase64Object(packet, callback);
                var encoded = packets[packet.type];
                return void 0 !== packet.data && (encoded += utf8encode ? utf8.encode(String(packet.data)) : String(packet.data)), 
                callback("" + encoded);
            }, exports.encodeBase64Packet = function(packet, callback) {
                var message = "b" + exports.packets[packet.type];
                if (Blob && packet.data instanceof global.Blob) {
                    var fr = new FileReader();
                    return fr.onload = function() {
                        var b64 = fr.result.split(",")[1];
                        callback(message + b64);
                    }, fr.readAsDataURL(packet.data);
                }
                var b64data;
                try {
                    b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
                } catch (e) {
                    for (var typed = new Uint8Array(packet.data), basic = new Array(typed.length), i = 0; i < typed.length; i++) basic[i] = typed[i];
                    b64data = String.fromCharCode.apply(null, basic);
                }
                return message += global.btoa(b64data), callback(message);
            }, exports.decodePacket = function(data, binaryType, utf8decode) {
                if (void 0 === data) return err;
                if ("string" == typeof data) {
                    if ("b" == data.charAt(0)) return exports.decodeBase64Packet(data.substr(1), binaryType);
                    if (utf8decode && !1 === (data = tryDecode(data))) return err;
                    var type = data.charAt(0);
                    return Number(type) == type && packetslist[type] ? data.length > 1 ? {
                        type: packetslist[type],
                        data: data.substring(1)
                    } : {
                        type: packetslist[type]
                    } : err;
                }
                var asArray = new Uint8Array(data), type = asArray[0], rest = sliceBuffer(data, 1);
                return Blob && "blob" === binaryType && (rest = new Blob([ rest ])), {
                    type: packetslist[type],
                    data: rest
                };
            }, exports.decodeBase64Packet = function(msg, binaryType) {
                var type = packetslist[msg.charAt(0)];
                if (!base64encoder) return {
                    type: type,
                    data: {
                        base64: !0,
                        data: msg.substr(1)
                    }
                };
                var data = base64encoder.decode(msg.substr(1));
                return "blob" === binaryType && Blob && (data = new Blob([ data ])), {
                    type: type,
                    data: data
                };
            }, exports.encodePayload = function(packets, supportsBinary, callback) {
                function setLengthHeader(message) {
                    return message.length + ":" + message;
                }
                function encodeOne(packet, doneCallback) {
                    exports.encodePacket(packet, !!isBinary && supportsBinary, !0, function(message) {
                        doneCallback(null, setLengthHeader(message));
                    });
                }
                "function" == typeof supportsBinary && (callback = supportsBinary, supportsBinary = null);
                var isBinary = hasBinary(packets);
                return supportsBinary && isBinary ? Blob && !dontSendBlobs ? exports.encodePayloadAsBlob(packets, callback) : exports.encodePayloadAsArrayBuffer(packets, callback) : packets.length ? void map(packets, encodeOne, function(err, results) {
                    return callback(results.join(""));
                }) : callback("0:");
            }, exports.decodePayload = function(data, binaryType, callback) {
                if ("string" != typeof data) return exports.decodePayloadAsBinary(data, binaryType, callback);
                "function" == typeof binaryType && (callback = binaryType, binaryType = null);
                var packet;
                if ("" == data) return callback(err, 0, 1);
                for (var n, msg, length = "", i = 0, l = data.length; i < l; i++) {
                    var chr = data.charAt(i);
                    if (":" != chr) length += chr; else {
                        if ("" == length || length != (n = Number(length))) return callback(err, 0, 1);
                        if (msg = data.substr(i + 1, n), length != msg.length) return callback(err, 0, 1);
                        if (msg.length) {
                            if (packet = exports.decodePacket(msg, binaryType, !0), err.type == packet.type && err.data == packet.data) return callback(err, 0, 1);
                            if (!1 === callback(packet, i + n, l)) return;
                        }
                        i += n, length = "";
                    }
                }
                return "" != length ? callback(err, 0, 1) : void 0;
            }, exports.encodePayloadAsArrayBuffer = function(packets, callback) {
                function encodeOne(packet, doneCallback) {
                    exports.encodePacket(packet, !0, !0, function(data) {
                        return doneCallback(null, data);
                    });
                }
                if (!packets.length) return callback(new ArrayBuffer(0));
                map(packets, encodeOne, function(err, encodedPackets) {
                    var totalLength = encodedPackets.reduce(function(acc, p) {
                        var len;
                        return len = "string" == typeof p ? p.length : p.byteLength, acc + len.toString().length + len + 2;
                    }, 0), resultArray = new Uint8Array(totalLength), bufferIndex = 0;
                    return encodedPackets.forEach(function(p) {
                        var isString = "string" == typeof p, ab = p;
                        if (isString) {
                            for (var view = new Uint8Array(p.length), i = 0; i < p.length; i++) view[i] = p.charCodeAt(i);
                            ab = view.buffer;
                        }
                        resultArray[bufferIndex++] = isString ? 0 : 1;
                        for (var lenStr = ab.byteLength.toString(), i = 0; i < lenStr.length; i++) resultArray[bufferIndex++] = parseInt(lenStr[i]);
                        resultArray[bufferIndex++] = 255;
                        for (var view = new Uint8Array(ab), i = 0; i < view.length; i++) resultArray[bufferIndex++] = view[i];
                    }), callback(resultArray.buffer);
                });
            }, exports.encodePayloadAsBlob = function(packets, callback) {
                function encodeOne(packet, doneCallback) {
                    exports.encodePacket(packet, !0, !0, function(encoded) {
                        var binaryIdentifier = new Uint8Array(1);
                        if (binaryIdentifier[0] = 1, "string" == typeof encoded) {
                            for (var view = new Uint8Array(encoded.length), i = 0; i < encoded.length; i++) view[i] = encoded.charCodeAt(i);
                            encoded = view.buffer, binaryIdentifier[0] = 0;
                        }
                        for (var len = encoded instanceof ArrayBuffer ? encoded.byteLength : encoded.size, lenStr = len.toString(), lengthAry = new Uint8Array(lenStr.length + 1), i = 0; i < lenStr.length; i++) lengthAry[i] = parseInt(lenStr[i]);
                        if (lengthAry[lenStr.length] = 255, Blob) {
                            var blob = new Blob([ binaryIdentifier.buffer, lengthAry.buffer, encoded ]);
                            doneCallback(null, blob);
                        }
                    });
                }
                map(packets, encodeOne, function(err, results) {
                    return callback(new Blob(results));
                });
            }, exports.decodePayloadAsBinary = function(data, binaryType, callback) {
                "function" == typeof binaryType && (callback = binaryType, binaryType = null);
                for (var bufferTail = data, buffers = [], numberTooLong = !1; bufferTail.byteLength > 0; ) {
                    for (var tailArray = new Uint8Array(bufferTail), isString = 0 === tailArray[0], msgLength = "", i = 1; 255 != tailArray[i]; i++) {
                        if (msgLength.length > 310) {
                            numberTooLong = !0;
                            break;
                        }
                        msgLength += tailArray[i];
                    }
                    if (numberTooLong) return callback(err, 0, 1);
                    bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length), msgLength = parseInt(msgLength);
                    var msg = sliceBuffer(bufferTail, 0, msgLength);
                    if (isString) try {
                        msg = String.fromCharCode.apply(null, new Uint8Array(msg));
                    } catch (e) {
                        var typed = new Uint8Array(msg);
                        msg = "";
                        for (var i = 0; i < typed.length; i++) msg += String.fromCharCode(typed[i]);
                    }
                    buffers.push(msg), bufferTail = sliceBuffer(bufferTail, msgLength);
                }
                var total = buffers.length;
                buffers.forEach(function(buffer, i) {
                    callback(exports.decodePacket(buffer, binaryType, !0), i, total);
                });
            };
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports) {
        module.exports = Object.keys || function(obj) {
            var arr = [], has = Object.prototype.hasOwnProperty;
            for (var i in obj) has.call(obj, i) && arr.push(i);
            return arr;
        };
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            function hasBinary(data) {
                function _hasBinary(obj) {
                    if (!obj) return !1;
                    if (global.Buffer && global.Buffer.isBuffer && global.Buffer.isBuffer(obj) || global.ArrayBuffer && obj instanceof ArrayBuffer || global.Blob && obj instanceof Blob || global.File && obj instanceof File) return !0;
                    if (isArray(obj)) {
                        for (var i = 0; i < obj.length; i++) if (_hasBinary(obj[i])) return !0;
                    } else if (obj && "object" == typeof obj) {
                        obj.toJSON && "function" == typeof obj.toJSON && (obj = obj.toJSON());
                        for (var key in obj) if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) return !0;
                    }
                    return !1;
                }
                return _hasBinary(data);
            }
            var isArray = __webpack_require__(15);
            module.exports = hasBinary;
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports) {
        module.exports = function(arraybuffer, start, end) {
            var bytes = arraybuffer.byteLength;
            if (start = start || 0, end = end || bytes, arraybuffer.slice) return arraybuffer.slice(start, end);
            if (start < 0 && (start += bytes), end < 0 && (end += bytes), end > bytes && (end = bytes), 
            start >= bytes || start >= end || 0 === bytes) return new ArrayBuffer(0);
            for (var abv = new Uint8Array(arraybuffer), result = new Uint8Array(end - start), i = start, ii = 0; i < end; i++, 
            ii++) result[ii] = abv[i];
            return result.buffer;
        };
    }, function(module, exports) {
        function after(count, callback, err_cb) {
            function proxy(err, result) {
                if (proxy.count <= 0) throw new Error("after called too many times");
                --proxy.count, err ? (bail = !0, callback(err), callback = err_cb) : 0 !== proxy.count || bail || callback(null, result);
            }
            var bail = !1;
            return err_cb = err_cb || noop, proxy.count = count, 0 === count ? callback() : proxy;
        }
        function noop() {}
        module.exports = after;
    }, function(module, exports, __webpack_require__) {
        var __WEBPACK_AMD_DEFINE_RESULT__;
        (function(module, global) {
            !function(root) {
                function ucs2decode(string) {
                    for (var value, extra, output = [], counter = 0, length = string.length; counter < length; ) value = string.charCodeAt(counter++), 
                    value >= 55296 && value <= 56319 && counter < length ? (extra = string.charCodeAt(counter++), 
                    56320 == (64512 & extra) ? output.push(((1023 & value) << 10) + (1023 & extra) + 65536) : (output.push(value), 
                    counter--)) : output.push(value);
                    return output;
                }
                function ucs2encode(array) {
                    for (var value, length = array.length, index = -1, output = ""; ++index < length; ) value = array[index], 
                    value > 65535 && (value -= 65536, output += stringFromCharCode(value >>> 10 & 1023 | 55296), 
                    value = 56320 | 1023 & value), output += stringFromCharCode(value);
                    return output;
                }
                function createByte(codePoint, shift) {
                    return stringFromCharCode(codePoint >> shift & 63 | 128);
                }
                function encodeCodePoint(codePoint) {
                    if (0 == (4294967168 & codePoint)) return stringFromCharCode(codePoint);
                    var symbol = "";
                    return 0 == (4294965248 & codePoint) ? symbol = stringFromCharCode(codePoint >> 6 & 31 | 192) : 0 == (4294901760 & codePoint) ? (symbol = stringFromCharCode(codePoint >> 12 & 15 | 224), 
                    symbol += createByte(codePoint, 6)) : 0 == (4292870144 & codePoint) && (symbol = stringFromCharCode(codePoint >> 18 & 7 | 240), 
                    symbol += createByte(codePoint, 12), symbol += createByte(codePoint, 6)), symbol += stringFromCharCode(63 & codePoint | 128);
                }
                function wtf8encode(string) {
                    for (var codePoint, codePoints = ucs2decode(string), length = codePoints.length, index = -1, byteString = ""; ++index < length; ) codePoint = codePoints[index], 
                    byteString += encodeCodePoint(codePoint);
                    return byteString;
                }
                function readContinuationByte() {
                    if (byteIndex >= byteCount) throw Error("Invalid byte index");
                    var continuationByte = 255 & byteArray[byteIndex];
                    if (byteIndex++, 128 == (192 & continuationByte)) return 63 & continuationByte;
                    throw Error("Invalid continuation byte");
                }
                function decodeSymbol() {
                    var byte1, byte2, byte3, byte4, codePoint;
                    if (byteIndex > byteCount) throw Error("Invalid byte index");
                    if (byteIndex == byteCount) return !1;
                    if (byte1 = 255 & byteArray[byteIndex], byteIndex++, 0 == (128 & byte1)) return byte1;
                    if (192 == (224 & byte1)) {
                        var byte2 = readContinuationByte();
                        if ((codePoint = (31 & byte1) << 6 | byte2) >= 128) return codePoint;
                        throw Error("Invalid continuation byte");
                    }
                    if (224 == (240 & byte1)) {
                        if (byte2 = readContinuationByte(), byte3 = readContinuationByte(), (codePoint = (15 & byte1) << 12 | byte2 << 6 | byte3) >= 2048) return codePoint;
                        throw Error("Invalid continuation byte");
                    }
                    if (240 == (248 & byte1) && (byte2 = readContinuationByte(), byte3 = readContinuationByte(), 
                    byte4 = readContinuationByte(), (codePoint = (15 & byte1) << 18 | byte2 << 12 | byte3 << 6 | byte4) >= 65536 && codePoint <= 1114111)) return codePoint;
                    throw Error("Invalid WTF-8 detected");
                }
                function wtf8decode(byteString) {
                    byteArray = ucs2decode(byteString), byteCount = byteArray.length, byteIndex = 0;
                    for (var tmp, codePoints = []; !1 !== (tmp = decodeSymbol()); ) codePoints.push(tmp);
                    return ucs2encode(codePoints);
                }
                var freeExports = "object" == typeof exports && exports, freeGlobal = ("object" == typeof module && module && module.exports, 
                "object" == typeof global && global);
                var byteArray, byteCount, byteIndex, stringFromCharCode = String.fromCharCode, wtf8 = {
                    version: "1.0.0",
                    encode: wtf8encode,
                    decode: wtf8decode
                };
                void 0 !== (__WEBPACK_AMD_DEFINE_RESULT__ = function() {
                    return wtf8;
                }.call(exports, __webpack_require__, exports, module)) && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__);
            }();
        }).call(exports, __webpack_require__(12)(module), function() {
            return this;
        }());
    }, function(module, exports) {
        !function() {
            "use strict";
            for (var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", lookup = new Uint8Array(256), i = 0; i < chars.length; i++) lookup[chars.charCodeAt(i)] = i;
            exports.encode = function(arraybuffer) {
                var i, bytes = new Uint8Array(arraybuffer), len = bytes.length, base64 = "";
                for (i = 0; i < len; i += 3) base64 += chars[bytes[i] >> 2], base64 += chars[(3 & bytes[i]) << 4 | bytes[i + 1] >> 4], 
                base64 += chars[(15 & bytes[i + 1]) << 2 | bytes[i + 2] >> 6], base64 += chars[63 & bytes[i + 2]];
                return len % 3 == 2 ? base64 = base64.substring(0, base64.length - 1) + "=" : len % 3 == 1 && (base64 = base64.substring(0, base64.length - 2) + "=="), 
                base64;
            }, exports.decode = function(base64) {
                var i, encoded1, encoded2, encoded3, encoded4, bufferLength = .75 * base64.length, len = base64.length, p = 0;
                "=" === base64[base64.length - 1] && (bufferLength--, "=" === base64[base64.length - 2] && bufferLength--);
                var arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
                for (i = 0; i < len; i += 4) encoded1 = lookup[base64.charCodeAt(i)], encoded2 = lookup[base64.charCodeAt(i + 1)], 
                encoded3 = lookup[base64.charCodeAt(i + 2)], encoded4 = lookup[base64.charCodeAt(i + 3)], 
                bytes[p++] = encoded1 << 2 | encoded2 >> 4, bytes[p++] = (15 & encoded2) << 4 | encoded3 >> 2, 
                bytes[p++] = (3 & encoded3) << 6 | 63 & encoded4;
                return arraybuffer;
            };
        }();
    }, function(module, exports) {
        (function(global) {
            function mapArrayBufferViews(ary) {
                for (var i = 0; i < ary.length; i++) {
                    var chunk = ary[i];
                    if (chunk.buffer instanceof ArrayBuffer) {
                        var buf = chunk.buffer;
                        if (chunk.byteLength !== buf.byteLength) {
                            var copy = new Uint8Array(chunk.byteLength);
                            copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength)), buf = copy.buffer;
                        }
                        ary[i] = buf;
                    }
                }
            }
            function BlobBuilderConstructor(ary, options) {
                options = options || {};
                var bb = new BlobBuilder();
                mapArrayBufferViews(ary);
                for (var i = 0; i < ary.length; i++) bb.append(ary[i]);
                return options.type ? bb.getBlob(options.type) : bb.getBlob();
            }
            function BlobConstructor(ary, options) {
                return mapArrayBufferViews(ary), new Blob(ary, options || {});
            }
            var BlobBuilder = global.BlobBuilder || global.WebKitBlobBuilder || global.MSBlobBuilder || global.MozBlobBuilder, blobSupported = function() {
                try {
                    return 2 === new Blob([ "hi" ]).size;
                } catch (e) {
                    return !1;
                }
            }(), blobSupportsArrayBufferView = blobSupported && function() {
                try {
                    return 2 === new Blob([ new Uint8Array([ 1, 2 ]) ]).size;
                } catch (e) {
                    return !1;
                }
            }(), blobBuilderSupported = BlobBuilder && BlobBuilder.prototype.append && BlobBuilder.prototype.getBlob;
            module.exports = function() {
                return blobSupported ? blobSupportsArrayBufferView ? global.Blob : BlobConstructor : blobBuilderSupported ? BlobBuilderConstructor : void 0;
            }();
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports, __webpack_require__) {
        function Emitter(obj) {
            if (obj) return mixin(obj);
        }
        function mixin(obj) {
            for (var key in Emitter.prototype) obj[key] = Emitter.prototype[key];
            return obj;
        }
        module.exports = Emitter, Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
            return this._callbacks = this._callbacks || {}, (this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn), 
            this;
        }, Emitter.prototype.once = function(event, fn) {
            function on() {
                this.off(event, on), fn.apply(this, arguments);
            }
            return on.fn = fn, this.on(event, on), this;
        }, Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
            if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, 
            this;
            var callbacks = this._callbacks["$" + event];
            if (!callbacks) return this;
            if (1 == arguments.length) return delete this._callbacks["$" + event], this;
            for (var cb, i = 0; i < callbacks.length; i++) if ((cb = callbacks[i]) === fn || cb.fn === fn) {
                callbacks.splice(i, 1);
                break;
            }
            return this;
        }, Emitter.prototype.emit = function(event) {
            this._callbacks = this._callbacks || {};
            var args = [].slice.call(arguments, 1), callbacks = this._callbacks["$" + event];
            if (callbacks) {
                callbacks = callbacks.slice(0);
                for (var i = 0, len = callbacks.length; i < len; ++i) callbacks[i].apply(this, args);
            }
            return this;
        }, Emitter.prototype.listeners = function(event) {
            return this._callbacks = this._callbacks || {}, this._callbacks["$" + event] || [];
        }, Emitter.prototype.hasListeners = function(event) {
            return !!this.listeners(event).length;
        };
    }, function(module, exports) {
        exports.encode = function(obj) {
            var str = "";
            for (var i in obj) obj.hasOwnProperty(i) && (str.length && (str += "&"), str += encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
            return str;
        }, exports.decode = function(qs) {
            for (var qry = {}, pairs = qs.split("&"), i = 0, l = pairs.length; i < l; i++) {
                var pair = pairs[i].split("=");
                qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            }
            return qry;
        };
    }, function(module, exports) {
        module.exports = function(a, b) {
            var fn = function() {};
            fn.prototype = b.prototype, a.prototype = new fn(), a.prototype.constructor = a;
        };
    }, function(module, exports) {
        "use strict";
        function encode(num) {
            var encoded = "";
            do {
                encoded = alphabet[num % length] + encoded, num = Math.floor(num / length);
            } while (num > 0);
            return encoded;
        }
        function decode(str) {
            var decoded = 0;
            for (i = 0; i < str.length; i++) decoded = decoded * length + map[str.charAt(i)];
            return decoded;
        }
        function yeast() {
            var now = encode(+new Date());
            return now !== prev ? (seed = 0, prev = now) : now + "." + encode(seed++);
        }
        for (var prev, alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), length = 64, map = {}, seed = 0, i = 0; i < length; i++) map[alphabet[i]] = i;
        yeast.encode = encode, yeast.decode = decode, module.exports = yeast;
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            function empty() {}
            function JSONPPolling(opts) {
                Polling.call(this, opts), this.query = this.query || {}, callbacks || (global.___eio || (global.___eio = []), 
                callbacks = global.___eio), this.index = callbacks.length;
                var self = this;
                callbacks.push(function(msg) {
                    self.onData(msg);
                }), this.query.j = this.index, global.document && global.addEventListener && global.addEventListener("beforeunload", function() {
                    self.script && (self.script.onerror = empty);
                }, !1);
            }
            var Polling = __webpack_require__(25), inherit = __webpack_require__(37);
            module.exports = JSONPPolling;
            var callbacks, rNewline = /\n/g, rEscapedNewline = /\\n/g;
            inherit(JSONPPolling, Polling), JSONPPolling.prototype.supportsBinary = !1, JSONPPolling.prototype.doClose = function() {
                this.script && (this.script.parentNode.removeChild(this.script), this.script = null), 
                this.form && (this.form.parentNode.removeChild(this.form), this.form = null, this.iframe = null), 
                Polling.prototype.doClose.call(this);
            }, JSONPPolling.prototype.doPoll = function() {
                var self = this, script = document.createElement("script");
                this.script && (this.script.parentNode.removeChild(this.script), this.script = null), 
                script.async = !0, script.src = this.uri(), script.onerror = function(e) {
                    self.onError("jsonp poll error", e);
                };
                var insertAt = document.getElementsByTagName("script")[0];
                insertAt ? insertAt.parentNode.insertBefore(script, insertAt) : (document.head || document.body).appendChild(script), 
                this.script = script, "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent) && setTimeout(function() {
                    var iframe = document.createElement("iframe");
                    document.body.appendChild(iframe), document.body.removeChild(iframe);
                }, 100);
            }, JSONPPolling.prototype.doWrite = function(data, fn) {
                function complete() {
                    initIframe(), fn();
                }
                function initIframe() {
                    if (self.iframe) try {
                        self.form.removeChild(self.iframe);
                    } catch (e) {
                        self.onError("jsonp polling iframe removal error", e);
                    }
                    try {
                        var html = '<iframe src="javascript:0" name="' + self.iframeId + '">';
                        iframe = document.createElement(html);
                    } catch (e) {
                        iframe = document.createElement("iframe"), iframe.name = self.iframeId, iframe.src = "javascript:0";
                    }
                    iframe.id = self.iframeId, self.form.appendChild(iframe), self.iframe = iframe;
                }
                var self = this;
                if (!this.form) {
                    var iframe, form = document.createElement("form"), area = document.createElement("textarea"), id = this.iframeId = "eio_iframe_" + this.index;
                    form.className = "socketio", form.style.position = "absolute", form.style.top = "-1000px", 
                    form.style.left = "-1000px", form.target = id, form.method = "POST", form.setAttribute("accept-charset", "utf-8"), 
                    area.name = "d", form.appendChild(area), document.body.appendChild(form), this.form = form, 
                    this.area = area;
                }
                this.form.action = this.uri(), initIframe(), data = data.replace(rEscapedNewline, "\\\n"), 
                this.area.value = data.replace(rNewline, "\\n");
                try {
                    this.form.submit();
                } catch (e) {}
                this.iframe.attachEvent ? this.iframe.onreadystatechange = function() {
                    "complete" === self.iframe.readyState && complete();
                } : this.iframe.onload = complete;
            };
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            function WS(opts) {
                opts && opts.forceBase64 && (this.supportsBinary = !1), this.perMessageDeflate = opts.perMessageDeflate, 
                this.usingBrowserWebSocket = BrowserWebSocket && !opts.forceNode, this.usingBrowserWebSocket || (WebSocket = NodeWebSocket), 
                Transport.call(this, opts);
            }
            var NodeWebSocket, Transport = __webpack_require__(26), parser = __webpack_require__(27), parseqs = __webpack_require__(36), inherit = __webpack_require__(37), yeast = __webpack_require__(38), debug = __webpack_require__(3)("engine.io-client:websocket"), BrowserWebSocket = global.WebSocket || global.MozWebSocket;
            if ("undefined" == typeof window) try {
                NodeWebSocket = __webpack_require__(41);
            } catch (e) {}
            var WebSocket = BrowserWebSocket;
            WebSocket || "undefined" != typeof window || (WebSocket = NodeWebSocket), module.exports = WS, 
            inherit(WS, Transport), WS.prototype.name = "websocket", WS.prototype.supportsBinary = !0, 
            WS.prototype.doOpen = function() {
                if (this.check()) {
                    var uri = this.uri(), opts = {
                        agent: this.agent,
                        perMessageDeflate: this.perMessageDeflate
                    };
                    opts.pfx = this.pfx, opts.key = this.key, opts.passphrase = this.passphrase, opts.cert = this.cert, 
                    opts.ca = this.ca, opts.ciphers = this.ciphers, opts.rejectUnauthorized = this.rejectUnauthorized, 
                    this.extraHeaders && (opts.headers = this.extraHeaders), this.localAddress && (opts.localAddress = this.localAddress);
                    try {
                        this.ws = this.usingBrowserWebSocket ? new WebSocket(uri) : new WebSocket(uri, void 0, opts);
                    } catch (err) {
                        return this.emit("error", err);
                    }
                    void 0 === this.ws.binaryType && (this.supportsBinary = !1), this.ws.supports && this.ws.supports.binary ? (this.supportsBinary = !0, 
                    this.ws.binaryType = "nodebuffer") : this.ws.binaryType = "arraybuffer", this.addEventListeners();
                }
            }, WS.prototype.addEventListeners = function() {
                var self = this;
                this.ws.onopen = function() {
                    self.onOpen();
                }, this.ws.onclose = function() {
                    self.onClose();
                }, this.ws.onmessage = function(ev) {
                    self.onData(ev.data);
                }, this.ws.onerror = function(e) {
                    self.onError("websocket error", e);
                };
            }, WS.prototype.write = function(packets) {
                function done() {
                    self.emit("flush"), setTimeout(function() {
                        self.writable = !0, self.emit("drain");
                    }, 0);
                }
                var self = this;
                this.writable = !1;
                for (var total = packets.length, i = 0, l = total; i < l; i++) !function(packet) {
                    parser.encodePacket(packet, self.supportsBinary, function(data) {
                        if (!self.usingBrowserWebSocket) {
                            var opts = {};
                            if (packet.options && (opts.compress = packet.options.compress), self.perMessageDeflate) {
                                ("string" == typeof data ? global.Buffer.byteLength(data) : data.length) < self.perMessageDeflate.threshold && (opts.compress = !1);
                            }
                        }
                        try {
                            self.usingBrowserWebSocket ? self.ws.send(data) : self.ws.send(data, opts);
                        } catch (e) {
                            debug("websocket closed before onclose event");
                        }
                        --total || done();
                    });
                }(packets[i]);
            }, WS.prototype.onClose = function() {
                Transport.prototype.onClose.call(this);
            }, WS.prototype.doClose = function() {
                void 0 !== this.ws && this.ws.close();
            }, WS.prototype.uri = function() {
                var query = this.query || {}, schema = this.secure ? "wss" : "ws", port = "";
                return this.port && ("wss" === schema && 443 !== Number(this.port) || "ws" === schema && 80 !== Number(this.port)) && (port = ":" + this.port), 
                this.timestampRequests && (query[this.timestampParam] = yeast()), this.supportsBinary || (query.b64 = 1), 
                query = parseqs.encode(query), query.length && (query = "?" + query), schema + "://" + (-1 !== this.hostname.indexOf(":") ? "[" + this.hostname + "]" : this.hostname) + port + this.path + query;
            }, WS.prototype.check = function() {
                return !(!WebSocket || "__initialize" in WebSocket && this.name === WS.prototype.name);
            };
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports) {}, function(module, exports) {
        var indexOf = [].indexOf;
        module.exports = function(arr, obj) {
            if (indexOf) return arr.indexOf(obj);
            for (var i = 0; i < arr.length; ++i) if (arr[i] === obj) return i;
            return -1;
        };
    }, function(module, exports) {
        (function(global) {
            var rvalidchars = /^[\],:{}\s]*$/, rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g, rtrimLeft = /^\s+/, rtrimRight = /\s+$/;
            module.exports = function(data) {
                return "string" == typeof data && data ? (data = data.replace(rtrimLeft, "").replace(rtrimRight, ""), 
                global.JSON && JSON.parse ? JSON.parse(data) : rvalidchars.test(data.replace(rvalidescape, "@").replace(rvalidtokens, "]").replace(rvalidbraces, "")) ? new Function("return " + data)() : void 0) : null;
            };
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports, __webpack_require__) {
        "use strict";
        function Socket(io, nsp, opts) {
            this.io = io, this.nsp = nsp, this.json = this, this.ids = 0, this.acks = {}, this.receiveBuffer = [], 
            this.sendBuffer = [], this.connected = !1, this.disconnected = !0, opts && opts.query && (this.query = opts.query), 
            this.io.autoConnect && this.open();
        }
        var parser = __webpack_require__(7), Emitter = __webpack_require__(35), toArray = __webpack_require__(45), on = __webpack_require__(46), bind = __webpack_require__(47), debug = __webpack_require__(3)("socket.io-client:socket"), hasBin = __webpack_require__(29);
        module.exports = Socket;
        var events = {
            connect: 1,
            connect_error: 1,
            connect_timeout: 1,
            connecting: 1,
            disconnect: 1,
            error: 1,
            reconnect: 1,
            reconnect_attempt: 1,
            reconnect_failed: 1,
            reconnect_error: 1,
            reconnecting: 1,
            ping: 1,
            pong: 1
        }, emit = Emitter.prototype.emit;
        Emitter(Socket.prototype), Socket.prototype.subEvents = function() {
            if (!this.subs) {
                var io = this.io;
                this.subs = [ on(io, "open", bind(this, "onopen")), on(io, "packet", bind(this, "onpacket")), on(io, "close", bind(this, "onclose")) ];
            }
        }, Socket.prototype.open = Socket.prototype.connect = function() {
            return this.connected ? this : (this.subEvents(), this.io.open(), "open" === this.io.readyState && this.onopen(), 
            this.emit("connecting"), this);
        }, Socket.prototype.send = function() {
            var args = toArray(arguments);
            return args.unshift("message"), this.emit.apply(this, args), this;
        }, Socket.prototype.emit = function(ev) {
            if (events.hasOwnProperty(ev)) return emit.apply(this, arguments), this;
            var args = toArray(arguments), parserType = parser.EVENT;
            hasBin(args) && (parserType = parser.BINARY_EVENT);
            var packet = {
                type: parserType,
                data: args
            };
            return packet.options = {}, packet.options.compress = !this.flags || !1 !== this.flags.compress, 
            "function" == typeof args[args.length - 1] && (debug("emitting packet with ack id %d", this.ids), 
            this.acks[this.ids] = args.pop(), packet.id = this.ids++), this.connected ? this.packet(packet) : this.sendBuffer.push(packet), 
            delete this.flags, this;
        }, Socket.prototype.packet = function(packet) {
            packet.nsp = this.nsp, this.io.packet(packet);
        }, Socket.prototype.onopen = function() {
            debug("transport is open - connecting"), "/" !== this.nsp && (this.query ? this.packet({
                type: parser.CONNECT,
                query: this.query
            }) : this.packet({
                type: parser.CONNECT
            }));
        }, Socket.prototype.onclose = function(reason) {
            debug("close (%s)", reason), this.connected = !1, this.disconnected = !0, delete this.id, 
            this.emit("disconnect", reason);
        }, Socket.prototype.onpacket = function(packet) {
            if (packet.nsp === this.nsp) switch (packet.type) {
              case parser.CONNECT:
                this.onconnect();
                break;

              case parser.EVENT:
              case parser.BINARY_EVENT:
                this.onevent(packet);
                break;

              case parser.ACK:
              case parser.BINARY_ACK:
                this.onack(packet);
                break;

              case parser.DISCONNECT:
                this.ondisconnect();
                break;

              case parser.ERROR:
                this.emit("error", packet.data);
            }
        }, Socket.prototype.onevent = function(packet) {
            var args = packet.data || [];
            debug("emitting event %j", args), null != packet.id && (debug("attaching ack callback to event"), 
            args.push(this.ack(packet.id))), this.connected ? emit.apply(this, args) : this.receiveBuffer.push(args);
        }, Socket.prototype.ack = function(id) {
            var self = this, sent = !1;
            return function() {
                if (!sent) {
                    sent = !0;
                    var args = toArray(arguments);
                    debug("sending ack %j", args);
                    var type = hasBin(args) ? parser.BINARY_ACK : parser.ACK;
                    self.packet({
                        type: type,
                        id: id,
                        data: args
                    });
                }
            };
        }, Socket.prototype.onack = function(packet) {
            var ack = this.acks[packet.id];
            "function" == typeof ack ? (debug("calling ack %s with %j", packet.id, packet.data), 
            ack.apply(this, packet.data), delete this.acks[packet.id]) : debug("bad ack %s", packet.id);
        }, Socket.prototype.onconnect = function() {
            this.connected = !0, this.disconnected = !1, this.emit("connect"), this.emitBuffered();
        }, Socket.prototype.emitBuffered = function() {
            var i;
            for (i = 0; i < this.receiveBuffer.length; i++) emit.apply(this, this.receiveBuffer[i]);
            for (this.receiveBuffer = [], i = 0; i < this.sendBuffer.length; i++) this.packet(this.sendBuffer[i]);
            this.sendBuffer = [];
        }, Socket.prototype.ondisconnect = function() {
            debug("server disconnect (%s)", this.nsp), this.destroy(), this.onclose("io server disconnect");
        }, Socket.prototype.destroy = function() {
            if (this.subs) {
                for (var i = 0; i < this.subs.length; i++) this.subs[i].destroy();
                this.subs = null;
            }
            this.io.destroy(this);
        }, Socket.prototype.close = Socket.prototype.disconnect = function() {
            return this.connected && (debug("performing disconnect (%s)", this.nsp), this.packet({
                type: parser.DISCONNECT
            })), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
        }, Socket.prototype.compress = function(compress) {
            return this.flags = this.flags || {}, this.flags.compress = compress, this;
        };
    }, function(module, exports) {
        function toArray(list, index) {
            var array = [];
            index = index || 0;
            for (var i = index || 0; i < list.length; i++) array[i - index] = list[i];
            return array;
        }
        module.exports = toArray;
    }, function(module, exports) {
        "use strict";
        function on(obj, ev, fn) {
            return obj.on(ev, fn), {
                destroy: function() {
                    obj.removeListener(ev, fn);
                }
            };
        }
        module.exports = on;
    }, function(module, exports) {
        var slice = [].slice;
        module.exports = function(obj, fn) {
            if ("string" == typeof fn && (fn = obj[fn]), "function" != typeof fn) throw new Error("bind() requires a function");
            var args = slice.call(arguments, 2);
            return function() {
                return fn.apply(obj, args.concat(slice.call(arguments)));
            };
        };
    }, function(module, exports) {
        function Backoff(opts) {
            opts = opts || {}, this.ms = opts.min || 100, this.max = opts.max || 1e4, this.factor = opts.factor || 2, 
            this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0, this.attempts = 0;
        }
        module.exports = Backoff, Backoff.prototype.duration = function() {
            var ms = this.ms * Math.pow(this.factor, this.attempts++);
            if (this.jitter) {
                var rand = Math.random(), deviation = Math.floor(rand * this.jitter * ms);
                ms = 0 == (1 & Math.floor(10 * rand)) ? ms - deviation : ms + deviation;
            }
            return 0 | Math.min(ms, this.max);
        }, Backoff.prototype.reset = function() {
            this.attempts = 0;
        }, Backoff.prototype.setMin = function(min) {
            this.ms = min;
        }, Backoff.prototype.setMax = function(max) {
            this.max = max;
        }, Backoff.prototype.setJitter = function(jitter) {
            this.jitter = jitter;
        };
    } ]);
});

var StackOverflow, bezier, bezier1, bezier2, bezierT;

StackOverflow = StackOverflow || {}, StackOverflow.drawBezier = function(options, ctx) {
    var a, b, c, cDist, curveSample, i, j, k, len, letterPadding, p, ref, ribbon, ribbonSpecs, textCurve, totalLength, totalPadding, w, ww, x1, x2, z;
    if (null == options && (options = {}), options = Helper.shallowClone(options), null != options.curve && null == options.points && (options.points = options.curve.split(",")), 
    null == options.text && (options.text = "Text"), null == options.letterPadding && (options.letterPadding = .25), 
    null == options.fillStyle && (options.fillStyle = "white"), null == options.fillLineWidth && (options.fillLineWidth = 1), 
    null == options.strokeLineWidth && (options.strokeLineWidth = 10), null == options.strokeStyle && (options.strokeStyle = void 0), 
    null == options.font && (options.font = "40px Helvetica"), null == options.points && (options.points = []), 
    null == options.drawText && (options.drawText = !0), null == options.drawCurve && (options.drawCurve = !1), 
    null == options.maxChar && (options.maxChar = 50), null == options.x && (options.x = 0), 
    null == options.y && (options.y = 0), 8 !== options.points.length) throw "needs 8 points";
    for (options.points = options.points.map(function(item) {
        return parseFloat(item);
    }), i = 0, ref = options.points, k = 0, len = ref.length; k < len; k++) ref[k], 
    options.points[i] += i % 2 == 0 ? options.x : options.y, i += 1;
    if (ribbonSpecs = {
        maxChar: options.maxChar,
        startX: options.points[0],
        startY: options.points[1],
        control1X: options.points[2],
        control1Y: options.points[3],
        control2X: options.points[4],
        control2Y: options.points[5],
        endX: options.points[6],
        endY: options.points[7]
    }, options.drawCurve && (ctx.save(), ctx.beginPath(), ctx.moveTo(ribbonSpecs.startX, ribbonSpecs.startY), 
    ctx.bezierCurveTo(ribbonSpecs.control1X, ribbonSpecs.control1Y, ribbonSpecs.control2X, ribbonSpecs.control2Y, ribbonSpecs.endX, ribbonSpecs.endY), 
    ctx.stroke(), ctx.restore()), options.drawText) {
        for (textCurve = [], ribbon = options.text.substring(0, ribbonSpecs.maxChar), curveSample = 1e3, 
        0, i = 0, i = 0; i < curveSample; ) a = new bezier2(i / curveSample, ribbonSpecs.startX, ribbonSpecs.startY, ribbonSpecs.control1X, ribbonSpecs.control1Y, ribbonSpecs.control2X, ribbonSpecs.control2Y, ribbonSpecs.endX, ribbonSpecs.endY), 
        b = new bezier2((i + 1) / curveSample, ribbonSpecs.startX, ribbonSpecs.startY, ribbonSpecs.control1X, ribbonSpecs.control1Y, ribbonSpecs.control2X, ribbonSpecs.control2Y, ribbonSpecs.endX, ribbonSpecs.endY), 
        c = new bezier(a, b), textCurve.push({
            bezier: a,
            curve: c.curve
        }), i++;
        for (letterPadding = ctx.measureText(" ").width * options.letterPadding, w = ribbon.length, 
        ww = Math.round(ctx.measureText(ribbon).width), totalPadding = (w - 1) * letterPadding, 
        totalLength = ww + totalPadding, p = 0, cDist = textCurve[curveSample - 1].curve.cDist, 
        z = cDist / 2 - totalLength / 2, i = 0; i < curveSample; ) {
            if (textCurve[i].curve.cDist >= z) {
                p = i;
                break;
            }
            i++;
        }
        for (i = 0; i < w; ) {
            for (ctx.save(), ctx.translate(textCurve[p].bezier.point.x, textCurve[p].bezier.point.y), 
            ctx.rotate(textCurve[p].curve.rad), ctx.font = options.font, null != options.strokeStyle && (ctx.strokeStyle = options.strokeStyle, 
            ctx.lineWidth = options.strokeLineWidth, ctx.strokeText(ribbon[i], 0, 0)), ctx.fillStyle = options.fillStyle, 
            ctx.lineWidth = options.fillLineWidth, ctx.fillText(ribbon[i], 0, 0), ctx.restore(), 
            x1 = ctx.measureText(ribbon[i]).width + letterPadding, x2 = 0, j = p; j < curveSample; ) {
                if ((x2 += textCurve[j].curve.dist) >= x1) {
                    p = j;
                    break;
                }
                j++;
            }
            i++;
        }
    }
}, bezier = function(b1, b2) {
    var xDist;
    this.rad = Math.atan(b1.point.mY / b1.point.mX), this.b2 = b2, this.b1 = b1, b2.x, 
    b1.x, b2.x, b1.x, b2.x, b1.x, this.dist = Math.sqrt((b2.x - b1.x) * (b2.x - b1.x) + (b2.y - b1.y) * (b2.y - b1.y)), 
    xDist += this.dist, this.curve = {
        rad: this.rad,
        dist: this.dist,
        cDist: xDist
    };
}, bezierT = function(t, startX, startY, control1X, control1Y, control2X, control2Y, endX, endY) {
    this.mx = 3 * (1 - t) * (1 - t) * (control1X - startX) + 6 * (1 - t) * t * (control2X - control1X) + 3 * t * t * (endX - control2X), 
    this.my = 3 * (1 - t) * (1 - t) * (control1Y - startY) + 6 * (1 - t) * t * (control2Y - control1Y) + 3 * t * t * (endY - control2Y);
}, bezier2 = function(t, startX, startY, control1X, control1Y, control2X, control2Y, endX, endY) {
    this.Bezier1 = new bezier1(t, startX, startY, control1X, control1Y, control2X, control2Y), 
    this.Bezier2 = new bezier1(t, control1X, control1Y, control2X, control2Y, endX, endY), 
    this.x = (1 - t) * this.Bezier1.x + t * this.Bezier2.x, this.y = (1 - t) * this.Bezier1.y + t * this.Bezier2.y, 
    this.slope = new bezierT(t, startX, startY, control1X, control1Y, control2X, control2Y, endX, endY), 
    this.point = {
        t: t,
        x: this.x,
        y: this.y,
        mX: this.slope.mx,
        mY: this.slope.my
    };
}, bezier1 = function(t, startX, startY, control1X, control1Y, control2X, control2Y) {
    this.x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * control1X + t * t * control2X, 
    this.y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * control1Y + t * t * control2Y;
}, window.jNorthPole = {
    BASE_URL: "https://json.northpole.ro/",
    help: "NorthPole JS wrapper example usage:\n\nresponseHandler = function (data) {\n  console.log(data);\n};\n\njNorthPole.getStorage(json, responseHandler);\n\nsocket = jNorthPole.getNewRealtimeSocket(responseHandler)\njNorthPole.subscribe(socket, 'foo')\njNorthPole.publish(socket, 'foo', { message: 'hello' })",
    genericRequest: function(jsonObj, method, endPoint, responseHandler, errorHandler) {
        var r;
        if (null == errorHandler && (errorHandler = responseHandler), null == responseHandler) throw "responseHandler function missing";
        r = new XMLHttpRequest(), r.open(method, "" + this.BASE_URL + endPoint + ".json", !0), 
        r.onreadystatechange = function() {
            4 === r.readyState && (200 === r.status ? responseHandler(JSON.parse(r.responseText), r.status) : errorHandler(JSON.parse(r.responseText), r.status));
        }, r.send(JSON.stringify(jsonObj));
    },
    createUser: function(api_key, secret, success, failure) {
        var jsonObj;
        jsonObj = {
            api_key: api_key,
            secret: secret
        }, this.genericRequest(jsonObj, "POST", "user", success, failure);
    },
    getUser: function(jsonObj, responseHandler, errorHandler) {
        this.genericRequest(jsonObj, "SEARCH", "user", responseHandler, errorHandler);
    },
    createStorage: function(jsonObj, responseHandler, errorHandler) {
        this.genericRequest(jsonObj, "POST", "storage", responseHandler, errorHandler);
    },
    getStorage: function(jsonObj, responseHandler, errorHandler) {
        this.genericRequest(jsonObj, "SEARCH", "storage", responseHandler, errorHandler);
    },
    putStorage: function(jsonObj, responseHandler, errorHandler) {
        this.genericRequest(jsonObj, "PUT", "storage", responseHandler, errorHandler);
    },
    deleteStorage: function(jsonObj, responseHandler, errorHandler) {
        this.genericRequest(jsonObj, "DELETE", "storage", responseHandler, errorHandler);
    },
    getNewRealtimeSocket: function(responseHandler, errorHandler) {
        var socket, socketUrl;
        return null == errorHandler && (errorHandler = responseHandler), socketUrl = this.BASE_URL.replace("http", "ws"), 
        socket = new WebSocket(socketUrl + "realtime"), socket.onmessage = responseHandler, 
        socket.onclose = errorHandler, socket;
    },
    subscribe: function(socket, channel_name) {
        return socket.send(JSON.stringify({
            type: "subscribe",
            channel_name: channel_name
        }));
    },
    unsubscribe: function(socket, channel_name) {
        return socket.send(JSON.stringify({
            type: "unsubscribe",
            channel_name: channel_name
        }));
    },
    publish: function(socket, channel_name, json) {
        return socket.send(JSON.stringify({
            type: "publish",
            channel_name: channel_name,
            content: json
        }));
    }
};

var GameInstance, Utils, e, bind = function(fn, me) {
    return function() {
        return fn.apply(me, arguments);
    };
};

try {
    Utils = require("../shared/Utils.coffee").Utils;
} catch (error) {
    e = error, console.ce(e);
}

GameInstance = function() {
    function GameInstance(config) {
        null == config && (config = {}), this.tick = bind(this.tick, this), null == config.ticksPerSecond && (config.ticksPerSecond = 10), 
        null == config.autoStart && (config.autoStart = !0), this.players = {}, this.sockets = {}, 
        this.inputs = [], this.id = config.id || Utils.guid(), this.config = config, this.config.autoStart && this.setTickInterval(this.config.ticksPerSecond);
    }
    return GameInstance.prototype.tick = function() {
        throw "tick needs to be implemented";
    }, GameInstance.prototype.setTickInterval = function(tps) {
        return null == tps && (tps = 10), this.config.ticksPerSecond = tps, null != this.tickInterval && clearInterval(this.tickInterval), 
        this.tickInterval = setInterval(this.tick, 1e3 / this.config.ticksPerSecond);
    }, GameInstance.prototype.startTicking = function() {
        return this.setTickInterval(this.config.ticksPerSecond);
    }, GameInstance.prototype.stopTicking = function() {
        if (null != this.tickInterval) return clearInterval(this.tickInterval);
    }, GameInstance;
}(), exports.GameInstance = GameInstance;