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
        REVISION: 11,
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

void 0 === Date.now && (Date.now = function() {
    return new Date().valueOf();
});

var TWEEN = TWEEN || function() {
    var _tweens = [];
    return {
        REVISION: "14",
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
            for (time = void 0 !== time ? time : "undefined" != typeof window && void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now(); i < _tweens.length; ) _tweens[i].update(time) ? i++ : _tweens.splice(i, 1);
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
        TWEEN.add(this), _isPlaying = !0, _onStartCallbackFired = !1, _startTime = void 0 !== time ? time : "undefined" != typeof window && void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now(), 
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
            var s, a = .1, p = .4;
            return 0 === k ? 0 : 1 === k ? 1 : (!a || a < 1 ? (a = 1, s = p / 4) : s = p * Math.asin(1 / a) / (2 * Math.PI), 
            -a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
        },
        Out: function(k) {
            var s, a = .1, p = .4;
            return 0 === k ? 0 : 1 === k ? 1 : (!a || a < 1 ? (a = 1, s = p / 4) : s = p * Math.asin(1 / a) / (2 * Math.PI), 
            a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
        },
        InOut: function(k) {
            var s, a = .1, p = .4;
            return 0 === k ? 0 : 1 === k ? 1 : (!a || a < 1 ? (a = 1, s = p / 4) : s = p * Math.asin(1 / a) / (2 * Math.PI), 
            (k *= 2) < 1 ? a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * -.5 : a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * .5 + 1);
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
};

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
            img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AYMDR07WbntUQAAAMZJREFUWMPtl7ENgzAQRR+IkhFYIdUVUTKP9wjswSCZIBHFVVmBEVKbNBTIMsFBcpLiXnlC9ke+7/suRGQinU5V23cfiEgLXFIXLPkxJqCK1J7AY0XcmLDmCAyRugcOQL0sFpEmvKvqOcffisgNOG0dQfnNI7cmNAEV0O2w2l564IphGEYwjsOMN6pqn2kcO6AJb8IwQA7zjZUDBxxtGJmALQE+434+ZsPpg1jeb1l0tppLjeWxd0EdRucFKWGiCa1mTfjXAl7JzisvsBIkfgAAAABJRU5ErkJggg==") : "reinit" === options.type && (img.setAttribute("onclick", "engine.initScene(SceneManager.currentScene())"), 
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
            return this.items[key] = item;
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
}();

var io = "undefined" == typeof module ? {} : module.exports;

!function() {
    if (function(exports, global) {
        var io = exports;
        io.version = "0.9.17", io.protocol = 1, io.transports = [], io.j = [], io.sockets = {}, 
        io.connect = function(host, details) {
            var uuri, socket, uri = io.util.parseUri(host);
            global && global.location && (uri.protocol = uri.protocol || global.location.protocol.slice(0, -1), 
            uri.host = uri.host || (global.document ? global.document.domain : global.location.hostname), 
            uri.port = uri.port || global.location.port), uuri = io.util.uniqueUri(uri);
            var options = {
                host: uri.host,
                secure: "https" == uri.protocol,
                port: uri.port || ("https" == uri.protocol ? 443 : 80),
                query: uri.query || ""
            };
            return io.util.merge(options, details), !options["force new connection"] && io.sockets[uuri] || (socket = new io.Socket(options)), 
            !options["force new connection"] && socket && (io.sockets[uuri] = socket), socket = socket || io.sockets[uuri], 
            socket.of(uri.path.length > 1 ? uri.path : "");
        };
    }("object" == typeof module ? module.exports : this.io = {}, this), function(exports, global) {
        var util = exports.util = {}, re = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, parts = [ "source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor" ];
        util.parseUri = function(str) {
            for (var m = re.exec(str || ""), uri = {}, i = 14; i--; ) uri[parts[i]] = m[i] || "";
            return uri;
        }, util.uniqueUri = function(uri) {
            var protocol = uri.protocol, host = uri.host, port = uri.port;
            return "document" in global ? (host = host || document.domain, port = port || ("https" == protocol && "https:" !== document.location.protocol ? 443 : document.location.port)) : (host = host || "localhost", 
            port || "https" != protocol || (port = 443)), (protocol || "http") + "://" + host + ":" + (port || 80);
        }, util.query = function(base, addition) {
            var query = util.chunkQuery(base || ""), components = [];
            util.merge(query, util.chunkQuery(addition || ""));
            for (var part in query) query.hasOwnProperty(part) && components.push(part + "=" + query[part]);
            return components.length ? "?" + components.join("&") : "";
        }, util.chunkQuery = function(qs) {
            for (var kv, query = {}, params = qs.split("&"), i = 0, l = params.length; i < l; ++i) kv = params[i].split("="), 
            kv[0] && (query[kv[0]] = kv[1]);
            return query;
        };
        var pageLoaded = !1;
        util.load = function(fn) {
            if ("document" in global && "complete" === document.readyState || pageLoaded) return fn();
            util.on(global, "load", fn, !1);
        }, util.on = function(element, event, fn, capture) {
            element.attachEvent ? element.attachEvent("on" + event, fn) : element.addEventListener && element.addEventListener(event, fn, capture);
        }, util.request = function(xdomain) {
            if (xdomain && "undefined" != typeof XDomainRequest && !util.ua.hasCORS) return new XDomainRequest();
            if ("undefined" != typeof XMLHttpRequest && (!xdomain || util.ua.hasCORS)) return new XMLHttpRequest();
            if (!xdomain) try {
                return new (window[[ "Active" ].concat("Object").join("X")])("Microsoft.XMLHTTP");
            } catch (e) {}
            return null;
        }, "undefined" != typeof window && util.load(function() {
            pageLoaded = !0;
        }), util.defer = function(fn) {
            if (!util.ua.webkit || "undefined" != typeof importScripts) return fn();
            util.load(function() {
                setTimeout(fn, 100);
            });
        }, util.merge = function(target, additional, deep, lastseen) {
            var prop, seen = lastseen || [], depth = void 0 === deep ? 2 : deep;
            for (prop in additional) additional.hasOwnProperty(prop) && util.indexOf(seen, prop) < 0 && ("object" == typeof target[prop] && depth ? util.merge(target[prop], additional[prop], depth - 1, seen) : (target[prop] = additional[prop], 
            seen.push(additional[prop])));
            return target;
        }, util.mixin = function(ctor, ctor2) {
            util.merge(ctor.prototype, ctor2.prototype);
        }, util.inherit = function(ctor, ctor2) {
            function f() {}
            f.prototype = ctor2.prototype, ctor.prototype = new f();
        }, util.isArray = Array.isArray || function(obj) {
            return "[object Array]" === Object.prototype.toString.call(obj);
        }, util.intersect = function(arr, arr2) {
            for (var ret = [], longest = arr.length > arr2.length ? arr : arr2, shortest = arr.length > arr2.length ? arr2 : arr, i = 0, l = shortest.length; i < l; i++) ~util.indexOf(longest, shortest[i]) && ret.push(shortest[i]);
            return ret;
        }, util.indexOf = function(arr, o, i) {
            for (var j = arr.length, i = i < 0 ? i + j < 0 ? 0 : i + j : i || 0; i < j && arr[i] !== o; i++) ;
            return j <= i ? -1 : i;
        }, util.toArray = function(enu) {
            for (var arr = [], i = 0, l = enu.length; i < l; i++) arr.push(enu[i]);
            return arr;
        }, util.ua = {}, util.ua.hasCORS = "undefined" != typeof XMLHttpRequest && function() {
            try {
                var a = new XMLHttpRequest();
            } catch (e) {
                return !1;
            }
            return void 0 != a.withCredentials;
        }(), util.ua.webkit = "undefined" != typeof navigator && /webkit/i.test(navigator.userAgent), 
        util.ua.iDevice = "undefined" != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent);
    }(void 0 !== io ? io : module.exports, this), function(exports, io) {
        function EventEmitter() {}
        exports.EventEmitter = EventEmitter, EventEmitter.prototype.on = function(name, fn) {
            return this.$events || (this.$events = {}), this.$events[name] ? io.util.isArray(this.$events[name]) ? this.$events[name].push(fn) : this.$events[name] = [ this.$events[name], fn ] : this.$events[name] = fn, 
            this;
        }, EventEmitter.prototype.addListener = EventEmitter.prototype.on, EventEmitter.prototype.once = function(name, fn) {
            function on() {
                self.removeListener(name, on), fn.apply(this, arguments);
            }
            var self = this;
            return on.listener = fn, this.on(name, on), this;
        }, EventEmitter.prototype.removeListener = function(name, fn) {
            if (this.$events && this.$events[name]) {
                var list = this.$events[name];
                if (io.util.isArray(list)) {
                    for (var pos = -1, i = 0, l = list.length; i < l; i++) if (list[i] === fn || list[i].listener && list[i].listener === fn) {
                        pos = i;
                        break;
                    }
                    if (pos < 0) return this;
                    list.splice(pos, 1), list.length || delete this.$events[name];
                } else (list === fn || list.listener && list.listener === fn) && delete this.$events[name];
            }
            return this;
        }, EventEmitter.prototype.removeAllListeners = function(name) {
            return void 0 === name ? (this.$events = {}, this) : (this.$events && this.$events[name] && (this.$events[name] = null), 
            this);
        }, EventEmitter.prototype.listeners = function(name) {
            return this.$events || (this.$events = {}), this.$events[name] || (this.$events[name] = []), 
            io.util.isArray(this.$events[name]) || (this.$events[name] = [ this.$events[name] ]), 
            this.$events[name];
        }, EventEmitter.prototype.emit = function(name) {
            if (!this.$events) return !1;
            var handler = this.$events[name];
            if (!handler) return !1;
            var args = Array.prototype.slice.call(arguments, 1);
            if ("function" == typeof handler) handler.apply(this, args); else {
                if (!io.util.isArray(handler)) return !1;
                for (var listeners = handler.slice(), i = 0, l = listeners.length; i < l; i++) listeners[i].apply(this, args);
            }
            return !0;
        };
    }(void 0 !== io ? io : module.exports, void 0 !== io ? io : module.parent.exports), 
    function(exports, nativeJSON) {
        "use strict";
        function f(n) {
            return n < 10 ? "0" + n : n;
        }
        function date(d, key) {
            return isFinite(d.valueOf()) ? d.getUTCFullYear() + "-" + f(d.getUTCMonth() + 1) + "-" + f(d.getUTCDate()) + "T" + f(d.getUTCHours()) + ":" + f(d.getUTCMinutes()) + ":" + f(d.getUTCSeconds()) + "Z" : null;
        }
        function quote(string) {
            return escapable.lastIndex = 0, escapable.test(string) ? '"' + string.replace(escapable, function(a) {
                var c = meta[a];
                return "string" == typeof c ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        }
        function str(key, holder) {
            var i, k, v, length, partial, mind = gap, value = holder[key];
            switch (value instanceof Date && (value = date(key)), "function" == typeof rep && (value = rep.call(holder, key, value)), 
            typeof value) {
              case "string":
                return quote(value);

              case "number":
                return isFinite(value) ? String(value) : "null";

              case "boolean":
              case "null":
                return String(value);

              case "object":
                if (!value) return "null";
                if (gap += indent, partial = [], "[object Array]" === Object.prototype.toString.apply(value)) {
                    for (length = value.length, i = 0; i < length; i += 1) partial[i] = str(i, value) || "null";
                    return v = 0 === partial.length ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]", 
                    gap = mind, v;
                }
                if (rep && "object" == typeof rep) for (length = rep.length, i = 0; i < length; i += 1) "string" == typeof rep[i] && (k = rep[i], 
                (v = str(k, value)) && partial.push(quote(k) + (gap ? ": " : ":") + v)); else for (k in value) Object.prototype.hasOwnProperty.call(value, k) && (v = str(k, value)) && partial.push(quote(k) + (gap ? ": " : ":") + v);
                return v = 0 === partial.length ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}", 
                gap = mind, v;
            }
        }
        if (nativeJSON && nativeJSON.parse) return exports.JSON = {
            parse: nativeJSON.parse,
            stringify: nativeJSON.stringify
        };
        var JSON = exports.JSON = {}, cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        }, rep;
        JSON.stringify = function(value, replacer, space) {
            var i;
            if (gap = "", indent = "", "number" == typeof space) for (i = 0; i < space; i += 1) indent += " "; else "string" == typeof space && (indent = space);
            if (rep = replacer, replacer && "function" != typeof replacer && ("object" != typeof replacer || "number" != typeof replacer.length)) throw new Error("JSON.stringify");
            return str("", {
                "": value
            });
        }, JSON.parse = function(text, reviver) {
            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && "object" == typeof value) for (k in value) Object.prototype.hasOwnProperty.call(value, k) && (v = walk(value, k), 
                void 0 !== v ? value[k] = v : delete value[k]);
                return reviver.call(holder, key, value);
            }
            var j;
            if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(a) {
                return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), 
            "function" == typeof reviver ? walk({
                "": j
            }, "") : j;
            throw new SyntaxError("JSON.parse");
        };
    }(void 0 !== io ? io : module.exports, "undefined" != typeof JSON ? JSON : void 0), 
    function(exports, io) {
        var parser = exports.parser = {}, packets = parser.packets = [ "disconnect", "connect", "heartbeat", "message", "json", "event", "ack", "error", "noop" ], reasons = parser.reasons = [ "transport not supported", "client not handshaken", "unauthorized" ], advice = parser.advice = [ "reconnect" ], JSON = io.JSON, indexOf = io.util.indexOf;
        parser.encodePacket = function(packet) {
            var type = indexOf(packets, packet.type), id = packet.id || "", endpoint = packet.endpoint || "", ack = packet.ack, data = null;
            switch (packet.type) {
              case "error":
                var reason = packet.reason ? indexOf(reasons, packet.reason) : "", adv = packet.advice ? indexOf(advice, packet.advice) : "";
                "" === reason && "" === adv || (data = reason + ("" !== adv ? "+" + adv : ""));
                break;

              case "message":
                "" !== packet.data && (data = packet.data);
                break;

              case "event":
                var ev = {
                    name: packet.name
                };
                packet.args && packet.args.length && (ev.args = packet.args), data = JSON.stringify(ev);
                break;

              case "json":
                data = JSON.stringify(packet.data);
                break;

              case "connect":
                packet.qs && (data = packet.qs);
                break;

              case "ack":
                data = packet.ackId + (packet.args && packet.args.length ? "+" + JSON.stringify(packet.args) : "");
            }
            var encoded = [ type, id + ("data" == ack ? "+" : ""), endpoint ];
            return null !== data && void 0 !== data && encoded.push(data), encoded.join(":");
        }, parser.encodePayload = function(packets) {
            var decoded = "";
            if (1 == packets.length) return packets[0];
            for (var i = 0, l = packets.length; i < l; i++) {
                decoded += "�" + packets[i].length + "�" + packets[i];
            }
            return decoded;
        };
        var regexp = /([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;
        parser.decodePacket = function(data) {
            var pieces = data.match(regexp);
            if (!pieces) return {};
            var id = pieces[2] || "", data = pieces[5] || "", packet = {
                type: packets[pieces[1]],
                endpoint: pieces[4] || ""
            };
            switch (id && (packet.id = id, pieces[3] ? packet.ack = "data" : packet.ack = !0), 
            packet.type) {
              case "error":
                var pieces = data.split("+");
                packet.reason = reasons[pieces[0]] || "", packet.advice = advice[pieces[1]] || "";
                break;

              case "message":
                packet.data = data || "";
                break;

              case "event":
                try {
                    var opts = JSON.parse(data);
                    packet.name = opts.name, packet.args = opts.args;
                } catch (e) {}
                packet.args = packet.args || [];
                break;

              case "json":
                try {
                    packet.data = JSON.parse(data);
                } catch (e) {}
                break;

              case "connect":
                packet.qs = data || "";
                break;

              case "ack":
                var pieces = data.match(/^([0-9]+)(\+)?(.*)/);
                if (pieces && (packet.ackId = pieces[1], packet.args = [], pieces[3])) try {
                    packet.args = pieces[3] ? JSON.parse(pieces[3]) : [];
                } catch (e) {}
            }
            return packet;
        }, parser.decodePayload = function(data) {
            if ("�" == data.charAt(0)) {
                for (var ret = [], i = 1, length = ""; i < data.length; i++) "�" == data.charAt(i) ? (ret.push(parser.decodePacket(data.substr(i + 1).substr(0, length))), 
                i += Number(length) + 1, length = "") : length += data.charAt(i);
                return ret;
            }
            return [ parser.decodePacket(data) ];
        };
    }(void 0 !== io ? io : module.exports, void 0 !== io ? io : module.parent.exports), 
    function(exports, io) {
        function Transport(socket, sessid) {
            this.socket = socket, this.sessid = sessid;
        }
        exports.Transport = Transport, io.util.mixin(Transport, io.EventEmitter), Transport.prototype.heartbeats = function() {
            return !0;
        }, Transport.prototype.onData = function(data) {
            if (this.clearCloseTimeout(), (this.socket.connected || this.socket.connecting || this.socket.reconnecting) && this.setCloseTimeout(), 
            "" !== data) {
                var msgs = io.parser.decodePayload(data);
                if (msgs && msgs.length) for (var i = 0, l = msgs.length; i < l; i++) this.onPacket(msgs[i]);
            }
            return this;
        }, Transport.prototype.onPacket = function(packet) {
            return this.socket.setHeartbeatTimeout(), "heartbeat" == packet.type ? this.onHeartbeat() : ("connect" == packet.type && "" == packet.endpoint && this.onConnect(), 
            "error" == packet.type && "reconnect" == packet.advice && (this.isOpen = !1), this.socket.onPacket(packet), 
            this);
        }, Transport.prototype.setCloseTimeout = function() {
            if (!this.closeTimeout) {
                var self = this;
                this.closeTimeout = setTimeout(function() {
                    self.onDisconnect();
                }, this.socket.closeTimeout);
            }
        }, Transport.prototype.onDisconnect = function() {
            return this.isOpen && this.close(), this.clearTimeouts(), this.socket.onDisconnect(), 
            this;
        }, Transport.prototype.onConnect = function() {
            return this.socket.onConnect(), this;
        }, Transport.prototype.clearCloseTimeout = function() {
            this.closeTimeout && (clearTimeout(this.closeTimeout), this.closeTimeout = null);
        }, Transport.prototype.clearTimeouts = function() {
            this.clearCloseTimeout(), this.reopenTimeout && clearTimeout(this.reopenTimeout);
        }, Transport.prototype.packet = function(packet) {
            this.send(io.parser.encodePacket(packet));
        }, Transport.prototype.onHeartbeat = function(heartbeat) {
            this.packet({
                type: "heartbeat"
            });
        }, Transport.prototype.onOpen = function() {
            this.isOpen = !0, this.clearCloseTimeout(), this.socket.onOpen();
        }, Transport.prototype.onClose = function() {
            this.isOpen = !1, this.socket.onClose(), this.onDisconnect();
        }, Transport.prototype.prepareUrl = function() {
            var options = this.socket.options;
            return this.scheme() + "://" + options.host + ":" + options.port + "/" + options.resource + "/" + io.protocol + "/" + this.name + "/" + this.sessid;
        }, Transport.prototype.ready = function(socket, fn) {
            fn.call(this);
        };
    }(void 0 !== io ? io : module.exports, void 0 !== io ? io : module.parent.exports), 
    function(exports, io, global) {
        function Socket(options) {
            if (this.options = {
                port: 80,
                secure: !1,
                document: "document" in global && document,
                resource: "socket.io",
                transports: io.transports,
                "connect timeout": 1e4,
                "try multiple transports": !0,
                reconnect: !0,
                "reconnection delay": 500,
                "reconnection limit": 1 / 0,
                "reopen delay": 3e3,
                "max reconnection attempts": 10,
                "sync disconnect on unload": !1,
                "auto connect": !0,
                "flash policy port": 10843,
                manualFlush: !1
            }, io.util.merge(this.options, options), this.connected = !1, this.open = !1, this.connecting = !1, 
            this.reconnecting = !1, this.namespaces = {}, this.buffer = [], this.doBuffer = !1, 
            this.options["sync disconnect on unload"] && (!this.isXDomain() || io.util.ua.hasCORS)) {
                var self = this;
                io.util.on(global, "beforeunload", function() {
                    self.disconnectSync();
                }, !1);
            }
            this.options["auto connect"] && this.connect();
        }
        function empty() {}
        exports.Socket = Socket, io.util.mixin(Socket, io.EventEmitter), Socket.prototype.of = function(name) {
            return this.namespaces[name] || (this.namespaces[name] = new io.SocketNamespace(this, name), 
            "" !== name && this.namespaces[name].packet({
                type: "connect"
            })), this.namespaces[name];
        }, Socket.prototype.publish = function() {
            this.emit.apply(this, arguments);
            var nsp;
            for (var i in this.namespaces) this.namespaces.hasOwnProperty(i) && (nsp = this.of(i), 
            nsp.$emit.apply(nsp, arguments));
        }, Socket.prototype.handshake = function(fn) {
            function complete(data) {
                data instanceof Error ? (self.connecting = !1, self.onError(data.message)) : fn.apply(null, data.split(":"));
            }
            var self = this, options = this.options, url = [ "http" + (options.secure ? "s" : "") + ":/", options.host + ":" + options.port, options.resource, io.protocol, io.util.query(this.options.query, "t=" + +new Date()) ].join("/");
            if (this.isXDomain() && !io.util.ua.hasCORS) {
                var insertAt = document.getElementsByTagName("script")[0], script = document.createElement("script");
                script.src = url + "&jsonp=" + io.j.length, insertAt.parentNode.insertBefore(script, insertAt), 
                io.j.push(function(data) {
                    complete(data), script.parentNode.removeChild(script);
                });
            } else {
                var xhr = io.util.request();
                xhr.open("GET", url, !0), this.isXDomain() && (xhr.withCredentials = !0), xhr.onreadystatechange = function() {
                    4 == xhr.readyState && (xhr.onreadystatechange = empty, 200 == xhr.status ? complete(xhr.responseText) : 403 == xhr.status ? self.onError(xhr.responseText) : (self.connecting = !1, 
                    !self.reconnecting && self.onError(xhr.responseText)));
                }, xhr.send(null);
            }
        }, Socket.prototype.getTransport = function(override) {
            for (var transport, transports = override || this.transports, i = 0; transport = transports[i]; i++) if (io.Transport[transport] && io.Transport[transport].check(this) && (!this.isXDomain() || io.Transport[transport].xdomainCheck(this))) return new io.Transport[transport](this, this.sessionid);
            return null;
        }, Socket.prototype.connect = function(fn) {
            if (this.connecting) return this;
            var self = this;
            return self.connecting = !0, this.handshake(function(sid, heartbeat, close, transports) {
                function connect(transports) {
                    if (self.transport && self.transport.clearTimeouts(), self.transport = self.getTransport(transports), 
                    !self.transport) return self.publish("connect_failed");
                    self.transport.ready(self, function() {
                        self.connecting = !0, self.publish("connecting", self.transport.name), self.transport.open(), 
                        self.options["connect timeout"] && (self.connectTimeoutTimer = setTimeout(function() {
                            if (!self.connected && (self.connecting = !1, self.options["try multiple transports"])) {
                                for (var remaining = self.transports; remaining.length > 0 && remaining.splice(0, 1)[0] != self.transport.name; ) ;
                                remaining.length ? connect(remaining) : self.publish("connect_failed");
                            }
                        }, self.options["connect timeout"]));
                    });
                }
                self.sessionid = sid, self.closeTimeout = 1e3 * close, self.heartbeatTimeout = 1e3 * heartbeat, 
                self.transports || (self.transports = self.origTransports = transports ? io.util.intersect(transports.split(","), self.options.transports) : self.options.transports), 
                self.setHeartbeatTimeout(), connect(self.transports), self.once("connect", function() {
                    clearTimeout(self.connectTimeoutTimer), fn && "function" == typeof fn && fn();
                });
            }), this;
        }, Socket.prototype.setHeartbeatTimeout = function() {
            if (clearTimeout(this.heartbeatTimeoutTimer), !this.transport || this.transport.heartbeats()) {
                var self = this;
                this.heartbeatTimeoutTimer = setTimeout(function() {
                    self.transport.onClose();
                }, this.heartbeatTimeout);
            }
        }, Socket.prototype.packet = function(data) {
            return this.connected && !this.doBuffer ? this.transport.packet(data) : this.buffer.push(data), 
            this;
        }, Socket.prototype.setBuffer = function(v) {
            this.doBuffer = v, !v && this.connected && this.buffer.length && (this.options.manualFlush || this.flushBuffer());
        }, Socket.prototype.flushBuffer = function() {
            this.transport.payload(this.buffer), this.buffer = [];
        }, Socket.prototype.disconnect = function() {
            return (this.connected || this.connecting) && (this.open && this.of("").packet({
                type: "disconnect"
            }), this.onDisconnect("booted")), this;
        }, Socket.prototype.disconnectSync = function() {
            var xhr = io.util.request(), uri = [ "http" + (this.options.secure ? "s" : "") + ":/", this.options.host + ":" + this.options.port, this.options.resource, io.protocol, "", this.sessionid ].join("/") + "/?disconnect=1";
            xhr.open("GET", uri, !1), xhr.send(null), this.onDisconnect("booted");
        }, Socket.prototype.isXDomain = function() {
            var port = global.location.port || ("https:" == global.location.protocol ? 443 : 80);
            return this.options.host !== global.location.hostname || this.options.port != port;
        }, Socket.prototype.onConnect = function() {
            this.connected || (this.connected = !0, this.connecting = !1, this.doBuffer || this.setBuffer(!1), 
            this.emit("connect"));
        }, Socket.prototype.onOpen = function() {
            this.open = !0;
        }, Socket.prototype.onClose = function() {
            this.open = !1, clearTimeout(this.heartbeatTimeoutTimer);
        }, Socket.prototype.onPacket = function(packet) {
            this.of(packet.endpoint).onPacket(packet);
        }, Socket.prototype.onError = function(err) {
            err && err.advice && "reconnect" === err.advice && (this.connected || this.connecting) && (this.disconnect(), 
            this.options.reconnect && this.reconnect()), this.publish("error", err && err.reason ? err.reason : err);
        }, Socket.prototype.onDisconnect = function(reason) {
            var wasConnected = this.connected, wasConnecting = this.connecting;
            this.connected = !1, this.connecting = !1, this.open = !1, (wasConnected || wasConnecting) && (this.transport.close(), 
            this.transport.clearTimeouts(), wasConnected && (this.publish("disconnect", reason), 
            "booted" != reason && this.options.reconnect && !this.reconnecting && this.reconnect()));
        }, Socket.prototype.reconnect = function() {
            function reset() {
                if (self.connected) {
                    for (var i in self.namespaces) self.namespaces.hasOwnProperty(i) && "" !== i && self.namespaces[i].packet({
                        type: "connect"
                    });
                    self.publish("reconnect", self.transport.name, self.reconnectionAttempts);
                }
                clearTimeout(self.reconnectionTimer), self.removeListener("connect_failed", maybeReconnect), 
                self.removeListener("connect", maybeReconnect), self.reconnecting = !1, delete self.reconnectionAttempts, 
                delete self.reconnectionDelay, delete self.reconnectionTimer, delete self.redoTransports, 
                self.options["try multiple transports"] = tryMultiple;
            }
            function maybeReconnect() {
                if (self.reconnecting) return self.connected ? reset() : self.connecting && self.reconnecting ? self.reconnectionTimer = setTimeout(maybeReconnect, 1e3) : void (self.reconnectionAttempts++ >= maxAttempts ? self.redoTransports ? (self.publish("reconnect_failed"), 
                reset()) : (self.on("connect_failed", maybeReconnect), self.options["try multiple transports"] = !0, 
                self.transports = self.origTransports, self.transport = self.getTransport(), self.redoTransports = !0, 
                self.connect()) : (self.reconnectionDelay < limit && (self.reconnectionDelay *= 2), 
                self.connect(), self.publish("reconnecting", self.reconnectionDelay, self.reconnectionAttempts), 
                self.reconnectionTimer = setTimeout(maybeReconnect, self.reconnectionDelay)));
            }
            this.reconnecting = !0, this.reconnectionAttempts = 0, this.reconnectionDelay = this.options["reconnection delay"];
            var self = this, maxAttempts = this.options["max reconnection attempts"], tryMultiple = this.options["try multiple transports"], limit = this.options["reconnection limit"];
            this.options["try multiple transports"] = !1, this.reconnectionTimer = setTimeout(maybeReconnect, this.reconnectionDelay), 
            this.on("connect", maybeReconnect);
        };
    }(void 0 !== io ? io : module.exports, void 0 !== io ? io : module.parent.exports, this), 
    function(exports, io) {
        function SocketNamespace(socket, name) {
            this.socket = socket, this.name = name || "", this.flags = {}, this.json = new Flag(this, "json"), 
            this.ackPackets = 0, this.acks = {};
        }
        function Flag(nsp, name) {
            this.namespace = nsp, this.name = name;
        }
        exports.SocketNamespace = SocketNamespace, io.util.mixin(SocketNamespace, io.EventEmitter), 
        SocketNamespace.prototype.$emit = io.EventEmitter.prototype.emit, SocketNamespace.prototype.of = function() {
            return this.socket.of.apply(this.socket, arguments);
        }, SocketNamespace.prototype.packet = function(packet) {
            return packet.endpoint = this.name, this.socket.packet(packet), this.flags = {}, 
            this;
        }, SocketNamespace.prototype.send = function(data, fn) {
            var packet = {
                type: this.flags.json ? "json" : "message",
                data: data
            };
            return "function" == typeof fn && (packet.id = ++this.ackPackets, packet.ack = !0, 
            this.acks[packet.id] = fn), this.packet(packet);
        }, SocketNamespace.prototype.emit = function(name) {
            var args = Array.prototype.slice.call(arguments, 1), lastArg = args[args.length - 1], packet = {
                type: "event",
                name: name
            };
            return "function" == typeof lastArg && (packet.id = ++this.ackPackets, packet.ack = "data", 
            this.acks[packet.id] = lastArg, args = args.slice(0, args.length - 1)), packet.args = args, 
            this.packet(packet);
        }, SocketNamespace.prototype.disconnect = function() {
            return "" === this.name ? this.socket.disconnect() : (this.packet({
                type: "disconnect"
            }), this.$emit("disconnect")), this;
        }, SocketNamespace.prototype.onPacket = function(packet) {
            function ack() {
                self.packet({
                    type: "ack",
                    args: io.util.toArray(arguments),
                    ackId: packet.id
                });
            }
            var self = this;
            switch (packet.type) {
              case "connect":
                this.$emit("connect");
                break;

              case "disconnect":
                "" === this.name ? this.socket.onDisconnect(packet.reason || "booted") : this.$emit("disconnect", packet.reason);
                break;

              case "message":
              case "json":
                var params = [ "message", packet.data ];
                "data" == packet.ack ? params.push(ack) : packet.ack && this.packet({
                    type: "ack",
                    ackId: packet.id
                }), this.$emit.apply(this, params);
                break;

              case "event":
                var params = [ packet.name ].concat(packet.args);
                "data" == packet.ack && params.push(ack), this.$emit.apply(this, params);
                break;

              case "ack":
                this.acks[packet.ackId] && (this.acks[packet.ackId].apply(this, packet.args), delete this.acks[packet.ackId]);
                break;

              case "error":
                packet.advice ? this.socket.onError(packet) : "unauthorized" == packet.reason ? this.$emit("connect_failed", packet.reason) : this.$emit("error", packet.reason);
            }
        }, Flag.prototype.send = function() {
            this.namespace.flags[this.name] = !0, this.namespace.send.apply(this.namespace, arguments);
        }, Flag.prototype.emit = function() {
            this.namespace.flags[this.name] = !0, this.namespace.emit.apply(this.namespace, arguments);
        };
    }(void 0 !== io ? io : module.exports, void 0 !== io ? io : module.parent.exports), 
    function(exports, io, global) {
        function WS(socket) {
            io.Transport.apply(this, arguments);
        }
        exports.websocket = WS, io.util.inherit(WS, io.Transport), WS.prototype.name = "websocket", 
        WS.prototype.open = function() {
            var Socket, query = io.util.query(this.socket.options.query), self = this;
            return Socket || (Socket = global.MozWebSocket || global.WebSocket), this.websocket = new Socket(this.prepareUrl() + query), 
            this.websocket.onopen = function() {
                self.onOpen(), self.socket.setBuffer(!1);
            }, this.websocket.onmessage = function(ev) {
                self.onData(ev.data);
            }, this.websocket.onclose = function() {
                self.onClose(), self.socket.setBuffer(!0);
            }, this.websocket.onerror = function(e) {
                self.onError(e);
            }, this;
        }, io.util.ua.iDevice ? WS.prototype.send = function(data) {
            var self = this;
            return setTimeout(function() {
                self.websocket.send(data);
            }, 0), this;
        } : WS.prototype.send = function(data) {
            return this.websocket.send(data), this;
        }, WS.prototype.payload = function(arr) {
            for (var i = 0, l = arr.length; i < l; i++) this.packet(arr[i]);
            return this;
        }, WS.prototype.close = function() {
            return this.websocket.close(), this;
        }, WS.prototype.onError = function(e) {
            this.socket.onError(e);
        }, WS.prototype.scheme = function() {
            return this.socket.options.secure ? "wss" : "ws";
        }, WS.check = function() {
            return "WebSocket" in global && !("__addTask" in WebSocket) || "MozWebSocket" in global;
        }, WS.xdomainCheck = function() {
            return !0;
        }, io.transports.push("websocket");
    }(void 0 !== io ? io.Transport : module.exports, void 0 !== io ? io : module.parent.exports, this), 
    function(exports, io) {
        function Flashsocket() {
            io.Transport.websocket.apply(this, arguments);
        }
        exports.flashsocket = Flashsocket, io.util.inherit(Flashsocket, io.Transport.websocket), 
        Flashsocket.prototype.name = "flashsocket", Flashsocket.prototype.open = function() {
            var self = this, args = arguments;
            return WebSocket.__addTask(function() {
                io.Transport.websocket.prototype.open.apply(self, args);
            }), this;
        }, Flashsocket.prototype.send = function() {
            var self = this, args = arguments;
            return WebSocket.__addTask(function() {
                io.Transport.websocket.prototype.send.apply(self, args);
            }), this;
        }, Flashsocket.prototype.close = function() {
            return WebSocket.__tasks.length = 0, io.Transport.websocket.prototype.close.call(this), 
            this;
        }, Flashsocket.prototype.ready = function(socket, fn) {
            function init() {
                var options = socket.options, port = options["flash policy port"], path = [ "http" + (options.secure ? "s" : "") + ":/", options.host + ":" + options.port, options.resource, "static/flashsocket", "WebSocketMain" + (socket.isXDomain() ? "Insecure" : "") + ".swf" ];
                Flashsocket.loaded || ("undefined" == typeof WEB_SOCKET_SWF_LOCATION && (WEB_SOCKET_SWF_LOCATION = path.join("/")), 
                843 !== port && WebSocket.loadFlashPolicyFile("xmlsocket://" + options.host + ":" + port), 
                WebSocket.__initialize(), Flashsocket.loaded = !0), fn.call(self);
            }
            var self = this;
            if (document.body) return init();
            io.util.load(init);
        }, Flashsocket.check = function() {
            return !!("undefined" != typeof WebSocket && "__initialize" in WebSocket && swfobject) && swfobject.getFlashPlayerVersion().major >= 10;
        }, Flashsocket.xdomainCheck = function() {
            return !0;
        }, "undefined" != typeof window && (WEB_SOCKET_DISABLE_AUTO_INITIALIZATION = !0), 
        io.transports.push("flashsocket");
    }(void 0 !== io ? io.Transport : module.exports, void 0 !== io ? io : module.parent.exports), 
    "undefined" != typeof window) var swfobject = function() {
        function f() {
            if (!J) {
                try {
                    var Z = j.getElementsByTagName("body")[0].appendChild(C("span"));
                    Z.parentNode.removeChild(Z);
                } catch (aa) {
                    return;
                }
                J = !0;
                for (var X = U.length, Y = 0; Y < X; Y++) U[Y]();
            }
        }
        function K(X) {
            J ? X() : U[U.length] = X;
        }
        function s(Y) {
            if (typeof O.addEventListener != D) O.addEventListener("load", Y, !1); else if (typeof j.addEventListener != D) j.addEventListener("load", Y, !1); else if (typeof O.attachEvent != D) i(O, "onload", Y); else if ("function" == typeof O.onload) {
                var X = O.onload;
                O.onload = function() {
                    X(), Y();
                };
            } else O.onload = Y;
        }
        function h() {
            T ? V() : H();
        }
        function V() {
            var X = j.getElementsByTagName("body")[0], aa = C(r);
            aa.setAttribute("type", q);
            var Z = X.appendChild(aa);
            if (Z) {
                var Y = 0;
                !function() {
                    if (typeof Z.GetVariable != D) {
                        var ab = Z.GetVariable("$version");
                        ab && (ab = ab.split(" ")[1].split(","), M.pv = [ parseInt(ab[0], 10), parseInt(ab[1], 10), parseInt(ab[2], 10) ]);
                    } else if (Y < 10) return Y++, void setTimeout(arguments.callee, 10);
                    X.removeChild(aa), Z = null, H();
                }();
            } else H();
        }
        function H() {
            var ag = o.length;
            if (ag > 0) for (var af = 0; af < ag; af++) {
                var Y = o[af].id, ab = o[af].callbackFn, aa = {
                    success: !1,
                    id: Y
                };
                if (M.pv[0] > 0) {
                    var ae = c(Y);
                    if (ae) if (!F(o[af].swfVersion) || M.wk && M.wk < 312) if (o[af].expressInstall && A()) {
                        var ai = {};
                        ai.data = o[af].expressInstall, ai.width = ae.getAttribute("width") || "0", ai.height = ae.getAttribute("height") || "0", 
                        ae.getAttribute("class") && (ai.styleclass = ae.getAttribute("class")), ae.getAttribute("align") && (ai.align = ae.getAttribute("align"));
                        for (var ah = {}, X = ae.getElementsByTagName("param"), ac = X.length, ad = 0; ad < ac; ad++) "movie" != X[ad].getAttribute("name").toLowerCase() && (ah[X[ad].getAttribute("name")] = X[ad].getAttribute("value"));
                        P(ai, ah, Y, ab);
                    } else p(ae), ab && ab(aa); else w(Y, !0), ab && (aa.success = !0, aa.ref = z(Y), 
                    ab(aa));
                } else if (w(Y, !0), ab) {
                    var Z = z(Y);
                    Z && typeof Z.SetVariable != D && (aa.success = !0, aa.ref = Z), ab(aa);
                }
            }
        }
        function z(aa) {
            var X = null, Y = c(aa);
            if (Y && "OBJECT" == Y.nodeName) if (typeof Y.SetVariable != D) X = Y; else {
                var Z = Y.getElementsByTagName(r)[0];
                Z && (X = Z);
            }
            return X;
        }
        function A() {
            return !a && F("6.0.65") && (M.win || M.mac) && !(M.wk && M.wk < 312);
        }
        function P(aa, ab, X, Z) {
            a = !0, E = Z || null, B = {
                success: !1,
                id: X
            };
            var ae = c(X);
            if (ae) {
                "OBJECT" == ae.nodeName ? (l = g(ae), Q = null) : (l = ae, Q = X), aa.id = R, (typeof aa.width == D || !/%$/.test(aa.width) && parseInt(aa.width, 10) < 310) && (aa.width = "310"), 
                (typeof aa.height == D || !/%$/.test(aa.height) && parseInt(aa.height, 10) < 137) && (aa.height = "137"), 
                j.title = j.title.slice(0, 47) + " - Flash Player Installation";
                var ad = M.ie && M.win ? [ "Active" ].concat("").join("X") : "PlugIn", ac = "MMredirectURL=" + O.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + ad + "&MMdoctitle=" + j.title;
                if (typeof ab.flashvars != D ? ab.flashvars += "&" + ac : ab.flashvars = ac, M.ie && M.win && 4 != ae.readyState) {
                    var Y = C("div");
                    X += "SWFObjectNew", Y.setAttribute("id", X), ae.parentNode.insertBefore(Y, ae), 
                    ae.style.display = "none", function() {
                        4 == ae.readyState ? ae.parentNode.removeChild(ae) : setTimeout(arguments.callee, 10);
                    }();
                }
                u(aa, ab, X);
            }
        }
        function p(Y) {
            if (M.ie && M.win && 4 != Y.readyState) {
                var X = C("div");
                Y.parentNode.insertBefore(X, Y), X.parentNode.replaceChild(g(Y), X), Y.style.display = "none", 
                function() {
                    4 == Y.readyState ? Y.parentNode.removeChild(Y) : setTimeout(arguments.callee, 10);
                }();
            } else Y.parentNode.replaceChild(g(Y), Y);
        }
        function g(ab) {
            var aa = C("div");
            if (M.win && M.ie) aa.innerHTML = ab.innerHTML; else {
                var Y = ab.getElementsByTagName(r)[0];
                if (Y) {
                    var ad = Y.childNodes;
                    if (ad) for (var X = ad.length, Z = 0; Z < X; Z++) 1 == ad[Z].nodeType && "PARAM" == ad[Z].nodeName || 8 == ad[Z].nodeType || aa.appendChild(ad[Z].cloneNode(!0));
                }
            }
            return aa;
        }
        function u(ai, ag, Y) {
            var X, aa = c(Y);
            if (M.wk && M.wk < 312) return X;
            if (aa) if (typeof ai.id == D && (ai.id = Y), M.ie && M.win) {
                var ah = "";
                for (var ae in ai) ai[ae] != Object.prototype[ae] && ("data" == ae.toLowerCase() ? ag.movie = ai[ae] : "styleclass" == ae.toLowerCase() ? ah += ' class="' + ai[ae] + '"' : "classid" != ae.toLowerCase() && (ah += " " + ae + '="' + ai[ae] + '"'));
                var af = "";
                for (var ad in ag) ag[ad] != Object.prototype[ad] && (af += '<param name="' + ad + '" value="' + ag[ad] + '" />');
                aa.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + ah + ">" + af + "</object>", 
                N[N.length] = ai.id, X = c(ai.id);
            } else {
                var Z = C(r);
                Z.setAttribute("type", q);
                for (var ac in ai) ai[ac] != Object.prototype[ac] && ("styleclass" == ac.toLowerCase() ? Z.setAttribute("class", ai[ac]) : "classid" != ac.toLowerCase() && Z.setAttribute(ac, ai[ac]));
                for (var ab in ag) ag[ab] != Object.prototype[ab] && "movie" != ab.toLowerCase() && e(Z, ab, ag[ab]);
                aa.parentNode.replaceChild(Z, aa), X = Z;
            }
            return X;
        }
        function e(Z, X, Y) {
            var aa = C("param");
            aa.setAttribute("name", X), aa.setAttribute("value", Y), Z.appendChild(aa);
        }
        function y(Y) {
            var X = c(Y);
            X && "OBJECT" == X.nodeName && (M.ie && M.win ? (X.style.display = "none", function() {
                4 == X.readyState ? b(Y) : setTimeout(arguments.callee, 10);
            }()) : X.parentNode.removeChild(X));
        }
        function b(Z) {
            var Y = c(Z);
            if (Y) {
                for (var X in Y) "function" == typeof Y[X] && (Y[X] = null);
                Y.parentNode.removeChild(Y);
            }
        }
        function c(Z) {
            var X = null;
            try {
                X = j.getElementById(Z);
            } catch (Y) {}
            return X;
        }
        function C(X) {
            return j.createElement(X);
        }
        function i(Z, X, Y) {
            Z.attachEvent(X, Y), I[I.length] = [ Z, X, Y ];
        }
        function F(Z) {
            var Y = M.pv, X = Z.split(".");
            return X[0] = parseInt(X[0], 10), X[1] = parseInt(X[1], 10) || 0, X[2] = parseInt(X[2], 10) || 0, 
            Y[0] > X[0] || Y[0] == X[0] && Y[1] > X[1] || Y[0] == X[0] && Y[1] == X[1] && Y[2] >= X[2];
        }
        function v(ac, Y, ad, ab) {
            if (!M.ie || !M.mac) {
                var aa = j.getElementsByTagName("head")[0];
                if (aa) {
                    var X = ad && "string" == typeof ad ? ad : "screen";
                    if (ab && (n = null, G = null), !n || G != X) {
                        var Z = C("style");
                        Z.setAttribute("type", "text/css"), Z.setAttribute("media", X), n = aa.appendChild(Z), 
                        M.ie && M.win && typeof j.styleSheets != D && j.styleSheets.length > 0 && (n = j.styleSheets[j.styleSheets.length - 1]), 
                        G = X;
                    }
                    M.ie && M.win ? n && typeof n.addRule == r && n.addRule(ac, Y) : n && typeof j.createTextNode != D && n.appendChild(j.createTextNode(ac + " {" + Y + "}"));
                }
            }
        }
        function w(Z, X) {
            if (m) {
                var Y = X ? "visible" : "hidden";
                J && c(Z) ? c(Z).style.visibility = Y : v("#" + Z, "visibility:" + Y);
            }
        }
        function L(Y) {
            return null != /[\\\"<>\.;]/.exec(Y) && typeof encodeURIComponent != D ? encodeURIComponent(Y) : Y;
        }
        var l, Q, E, B, n, G, D = "undefined", r = "object", S = "Shockwave Flash", W = "ShockwaveFlash.ShockwaveFlash", q = "application/x-shockwave-flash", R = "SWFObjectExprInst", x = "onreadystatechange", O = window, j = document, t = navigator, T = !1, U = [ h ], o = [], N = [], I = [], J = !1, a = !1, m = !0, M = function() {
            var aa = typeof j.getElementById != D && typeof j.getElementsByTagName != D && typeof j.createElement != D, ah = t.userAgent.toLowerCase(), Y = t.platform.toLowerCase(), ae = /win/.test(Y ? Y : ah), ac = /mac/.test(Y ? Y : ah), af = !!/webkit/.test(ah) && parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")), X = !1, ag = [ 0, 0, 0 ], ab = null;
            if (typeof t.plugins != D && typeof t.plugins[S] == r) !(ab = t.plugins[S].description) || typeof t.mimeTypes != D && t.mimeTypes[q] && !t.mimeTypes[q].enabledPlugin || (T = !0, 
            X = !1, ab = ab.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), ag[0] = parseInt(ab.replace(/^(.*)\..*$/, "$1"), 10), 
            ag[1] = parseInt(ab.replace(/^.*\.(.*)\s.*$/, "$1"), 10), ag[2] = /[a-zA-Z]/.test(ab) ? parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0); else if (typeof O[[ "Active" ].concat("Object").join("X")] != D) try {
                var ad = new (window[[ "Active" ].concat("Object").join("X")])(W);
                ad && (ab = ad.GetVariable("$version")) && (X = !0, ab = ab.split(" ")[1].split(","), 
                ag = [ parseInt(ab[0], 10), parseInt(ab[1], 10), parseInt(ab[2], 10) ]);
            } catch (Z) {}
            return {
                w3: aa,
                pv: ag,
                wk: af,
                ie: X,
                win: ae,
                mac: ac
            };
        }();
        (function() {
            M.w3 && ((typeof j.readyState != D && "complete" == j.readyState || typeof j.readyState == D && (j.getElementsByTagName("body")[0] || j.body)) && f(), 
            J || (typeof j.addEventListener != D && j.addEventListener("DOMContentLoaded", f, !1), 
            M.ie && M.win && (j.attachEvent(x, function() {
                "complete" == j.readyState && (j.detachEvent(x, arguments.callee), f());
            }), O == top && function() {
                if (!J) {
                    try {
                        j.documentElement.doScroll("left");
                    } catch (X) {
                        return void setTimeout(arguments.callee, 0);
                    }
                    f();
                }
            }()), M.wk && function() {
                if (!J) /loaded|complete/.test(j.readyState) ? f() : setTimeout(arguments.callee, 0);
            }(), s(f)));
        })(), function() {
            M.ie && M.win && window.attachEvent("onunload", function() {
                for (var ac = I.length, ab = 0; ab < ac; ab++) I[ab][0].detachEvent(I[ab][1], I[ab][2]);
                for (var Z = N.length, aa = 0; aa < Z; aa++) y(N[aa]);
                for (var Y in M) M[Y] = null;
                M = null;
                for (var X in swfobject) swfobject[X] = null;
                swfobject = null;
            });
        }();
        return {
            registerObject: function(ab, X, aa, Z) {
                if (M.w3 && ab && X) {
                    var Y = {};
                    Y.id = ab, Y.swfVersion = X, Y.expressInstall = aa, Y.callbackFn = Z, o[o.length] = Y, 
                    w(ab, !1);
                } else Z && Z({
                    success: !1,
                    id: ab
                });
            },
            getObjectById: function(X) {
                if (M.w3) return z(X);
            },
            embedSWF: function(ab, ah, ae, ag, Y, aa, Z, ad, af, ac) {
                var X = {
                    success: !1,
                    id: ah
                };
                M.w3 && !(M.wk && M.wk < 312) && ab && ah && ae && ag && Y ? (w(ah, !1), K(function() {
                    ae += "", ag += "";
                    var aj = {};
                    if (af && typeof af === r) for (var al in af) aj[al] = af[al];
                    aj.data = ab, aj.width = ae, aj.height = ag;
                    var am = {};
                    if (ad && typeof ad === r) for (var ak in ad) am[ak] = ad[ak];
                    if (Z && typeof Z === r) for (var ai in Z) typeof am.flashvars != D ? am.flashvars += "&" + ai + "=" + Z[ai] : am.flashvars = ai + "=" + Z[ai];
                    if (F(Y)) {
                        var an = u(aj, am, ah);
                        aj.id == ah && w(ah, !0), X.success = !0, X.ref = an;
                    } else {
                        if (aa && A()) return aj.data = aa, void P(aj, am, ah, ac);
                        w(ah, !0);
                    }
                    ac && ac(X);
                })) : ac && ac(X);
            },
            switchOffAutoHideShow: function() {
                m = !1;
            },
            ua: M,
            getFlashPlayerVersion: function() {
                return {
                    major: M.pv[0],
                    minor: M.pv[1],
                    release: M.pv[2]
                };
            },
            hasFlashPlayerVersion: F,
            createSWF: function(Z, Y, X) {
                return M.w3 ? u(Z, Y, X) : void 0;
            },
            showExpressInstall: function(Z, aa, X, Y) {
                M.w3 && A() && P(Z, aa, X, Y);
            },
            removeSWF: function(X) {
                M.w3 && y(X);
            },
            createCSS: function(aa, Z, Y, X) {
                M.w3 && v(aa, Z, Y, X);
            },
            addDomLoadEvent: K,
            addLoadEvent: s,
            getQueryParamValue: function(aa) {
                var Z = j.location.search || j.location.hash;
                if (Z) {
                    if (/\?/.test(Z) && (Z = Z.split("?")[1]), null == aa) return L(Z);
                    for (var Y = Z.split("&"), X = 0; X < Y.length; X++) if (Y[X].substring(0, Y[X].indexOf("=")) == aa) return L(Y[X].substring(Y[X].indexOf("=") + 1));
                }
                return "";
            },
            expressInstallCallback: function() {
                if (a) {
                    var X = c(R);
                    X && l && (X.parentNode.replaceChild(l, X), Q && (w(Q, !0), M.ie && M.win && (l.style.display = "block")), 
                    E && E(B)), a = !1;
                }
            }
        };
    }();
    !function() {
        if ("undefined" != typeof window && !window.WebSocket) {
            var console = window.console;
            if (console && console.log && console.error || (console = {
                log: function() {},
                error: function() {}
            }), !swfobject.hasFlashPlayerVersion("10.0.0")) return void console.error("Flash Player >= 10.0.0 is required.");
            "file:" == location.protocol && console.error("WARNING: web-socket-js doesn't work in file:///... URL unless you set Flash Security Settings properly. Open the page via Web server i.e. http://..."), 
            WebSocket = function(url, protocols, proxyHost, proxyPort, headers) {
                var self = this;
                self.__id = WebSocket.__nextId++, WebSocket.__instances[self.__id] = self, self.readyState = WebSocket.CONNECTING, 
                self.bufferedAmount = 0, self.__events = {}, protocols ? "string" == typeof protocols && (protocols = [ protocols ]) : protocols = [], 
                setTimeout(function() {
                    WebSocket.__addTask(function() {
                        WebSocket.__flash.create(self.__id, url, protocols, proxyHost || null, proxyPort || 0, headers || null);
                    });
                }, 0);
            }, WebSocket.prototype.send = function(data) {
                if (this.readyState == WebSocket.CONNECTING) throw "INVALID_STATE_ERR: Web Socket connection has not been established";
                var result = WebSocket.__flash.send(this.__id, encodeURIComponent(data));
                return result < 0 || (this.bufferedAmount += result, !1);
            }, WebSocket.prototype.close = function() {
                this.readyState != WebSocket.CLOSED && this.readyState != WebSocket.CLOSING && (this.readyState = WebSocket.CLOSING, 
                WebSocket.__flash.close(this.__id));
            }, WebSocket.prototype.addEventListener = function(type, listener, useCapture) {
                type in this.__events || (this.__events[type] = []), this.__events[type].push(listener);
            }, WebSocket.prototype.removeEventListener = function(type, listener, useCapture) {
                if (type in this.__events) for (var events = this.__events[type], i = events.length - 1; i >= 0; --i) if (events[i] === listener) {
                    events.splice(i, 1);
                    break;
                }
            }, WebSocket.prototype.dispatchEvent = function(event) {
                for (var events = this.__events[event.type] || [], i = 0; i < events.length; ++i) events[i](event);
                var handler = this["on" + event.type];
                handler && handler(event);
            }, WebSocket.prototype.__handleEvent = function(flashEvent) {
                "readyState" in flashEvent && (this.readyState = flashEvent.readyState), "protocol" in flashEvent && (this.protocol = flashEvent.protocol);
                var jsEvent;
                if ("open" == flashEvent.type || "error" == flashEvent.type) jsEvent = this.__createSimpleEvent(flashEvent.type); else if ("close" == flashEvent.type) jsEvent = this.__createSimpleEvent("close"); else {
                    if ("message" != flashEvent.type) throw "unknown event type: " + flashEvent.type;
                    var data = decodeURIComponent(flashEvent.message);
                    jsEvent = this.__createMessageEvent("message", data);
                }
                this.dispatchEvent(jsEvent);
            }, WebSocket.prototype.__createSimpleEvent = function(type) {
                if (document.createEvent && window.Event) {
                    var event = document.createEvent("Event");
                    return event.initEvent(type, !1, !1), event;
                }
                return {
                    type: type,
                    bubbles: !1,
                    cancelable: !1
                };
            }, WebSocket.prototype.__createMessageEvent = function(type, data) {
                if (document.createEvent && window.MessageEvent && !window.opera) {
                    var event = document.createEvent("MessageEvent");
                    return event.initMessageEvent("message", !1, !1, data, null, null, window, null), 
                    event;
                }
                return {
                    type: type,
                    data: data,
                    bubbles: !1,
                    cancelable: !1
                };
            }, WebSocket.CONNECTING = 0, WebSocket.OPEN = 1, WebSocket.CLOSING = 2, WebSocket.CLOSED = 3, 
            WebSocket.__flash = null, WebSocket.__instances = {}, WebSocket.__tasks = [], WebSocket.__nextId = 0, 
            WebSocket.loadFlashPolicyFile = function(url) {
                WebSocket.__addTask(function() {
                    WebSocket.__flash.loadManualPolicyFile(url);
                });
            }, WebSocket.__initialize = function() {
                if (!WebSocket.__flash) {
                    if (WebSocket.__swfLocation && (window.WEB_SOCKET_SWF_LOCATION = WebSocket.__swfLocation), 
                    !window.WEB_SOCKET_SWF_LOCATION) return void console.error("[WebSocket] set WEB_SOCKET_SWF_LOCATION to location of WebSocketMain.swf");
                    var container = document.createElement("div");
                    container.id = "webSocketContainer", container.style.position = "absolute", WebSocket.__isFlashLite() ? (container.style.left = "0px", 
                    container.style.top = "0px") : (container.style.left = "-100px", container.style.top = "-100px");
                    var holder = document.createElement("div");
                    holder.id = "webSocketFlash", container.appendChild(holder), document.body.appendChild(container), 
                    swfobject.embedSWF(WEB_SOCKET_SWF_LOCATION, "webSocketFlash", "1", "1", "10.0.0", null, null, {
                        hasPriority: !0,
                        swliveconnect: !0,
                        allowScriptAccess: "always"
                    }, null, function(e) {
                        e.success || console.error("[WebSocket] swfobject.embedSWF failed");
                    });
                }
            }, WebSocket.__onFlashInitialized = function() {
                setTimeout(function() {
                    WebSocket.__flash = document.getElementById("webSocketFlash"), WebSocket.__flash.setCallerUrl(location.href), 
                    WebSocket.__flash.setDebug(!!window.WEB_SOCKET_DEBUG);
                    for (var i = 0; i < WebSocket.__tasks.length; ++i) WebSocket.__tasks[i]();
                    WebSocket.__tasks = [];
                }, 0);
            }, WebSocket.__onFlashEvent = function() {
                return setTimeout(function() {
                    try {
                        for (var events = WebSocket.__flash.receiveEvents(), i = 0; i < events.length; ++i) WebSocket.__instances[events[i].webSocketId].__handleEvent(events[i]);
                    } catch (e) {
                        console.error(e);
                    }
                }, 0), !0;
            }, WebSocket.__log = function(message) {
                console.log(decodeURIComponent(message));
            }, WebSocket.__error = function(message) {
                console.error(decodeURIComponent(message));
            }, WebSocket.__addTask = function(task) {
                WebSocket.__flash ? task() : WebSocket.__tasks.push(task);
            }, WebSocket.__isFlashLite = function() {
                if (!window.navigator || !window.navigator.mimeTypes) return !1;
                var mimeType = window.navigator.mimeTypes["application/x-shockwave-flash"];
                return !!(mimeType && mimeType.enabledPlugin && mimeType.enabledPlugin.filename) && !!mimeType.enabledPlugin.filename.match(/flashlite/i);
            }, window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION || (window.addEventListener ? window.addEventListener("load", function() {
                WebSocket.__initialize();
            }, !1) : window.attachEvent("onload", function() {
                WebSocket.__initialize();
            }));
        }
    }(), function(exports, io, global) {
        function XHR(socket) {
            socket && (io.Transport.apply(this, arguments), this.sendBuffer = []);
        }
        function empty() {}
        exports.XHR = XHR, io.util.inherit(XHR, io.Transport), XHR.prototype.open = function() {
            return this.socket.setBuffer(!1), this.onOpen(), this.get(), this.setCloseTimeout(), 
            this;
        }, XHR.prototype.payload = function(payload) {
            for (var msgs = [], i = 0, l = payload.length; i < l; i++) msgs.push(io.parser.encodePacket(payload[i]));
            this.send(io.parser.encodePayload(msgs));
        }, XHR.prototype.send = function(data) {
            return this.post(data), this;
        }, XHR.prototype.post = function(data) {
            function stateChange() {
                4 == this.readyState && (this.onreadystatechange = empty, self.posting = !1, 200 == this.status ? self.socket.setBuffer(!1) : self.onClose());
            }
            function onload() {
                this.onload = empty, self.socket.setBuffer(!1);
            }
            var self = this;
            this.socket.setBuffer(!0), this.sendXHR = this.request("POST"), global.XDomainRequest && this.sendXHR instanceof XDomainRequest ? this.sendXHR.onload = this.sendXHR.onerror = onload : this.sendXHR.onreadystatechange = stateChange, 
            this.sendXHR.send(data);
        }, XHR.prototype.close = function() {
            return this.onClose(), this;
        }, XHR.prototype.request = function(method) {
            var req = io.util.request(this.socket.isXDomain()), query = io.util.query(this.socket.options.query, "t=" + +new Date());
            if (req.open(method || "GET", this.prepareUrl() + query, !0), "POST" == method) try {
                req.setRequestHeader ? req.setRequestHeader("Content-type", "text/plain;charset=UTF-8") : req.contentType = "text/plain";
            } catch (e) {}
            return req;
        }, XHR.prototype.scheme = function() {
            return this.socket.options.secure ? "https" : "http";
        }, XHR.check = function(socket, xdomain) {
            try {
                var request = io.util.request(xdomain), usesXDomReq = global.XDomainRequest && request instanceof XDomainRequest, socketProtocol = socket && socket.options && socket.options.secure ? "https:" : "http:", isXProtocol = global.location && socketProtocol != global.location.protocol;
                if (request && (!usesXDomReq || !isXProtocol)) return !0;
            } catch (e) {}
            return !1;
        }, XHR.xdomainCheck = function(socket) {
            return XHR.check(socket, !0);
        };
    }(void 0 !== io ? io.Transport : module.exports, void 0 !== io ? io : module.parent.exports, this), 
    function(exports, io) {
        function HTMLFile(socket) {
            io.Transport.XHR.apply(this, arguments);
        }
        exports.htmlfile = HTMLFile, io.util.inherit(HTMLFile, io.Transport.XHR), HTMLFile.prototype.name = "htmlfile", 
        HTMLFile.prototype.get = function() {
            this.doc = new (window[[ "Active" ].concat("Object").join("X")])("htmlfile"), this.doc.open(), 
            this.doc.write("<html></html>"), this.doc.close(), this.doc.parentWindow.s = this;
            var iframeC = this.doc.createElement("div");
            iframeC.className = "socketio", this.doc.body.appendChild(iframeC), this.iframe = this.doc.createElement("iframe"), 
            iframeC.appendChild(this.iframe);
            var self = this, query = io.util.query(this.socket.options.query, "t=" + +new Date());
            this.iframe.src = this.prepareUrl() + query, io.util.on(window, "unload", function() {
                self.destroy();
            });
        }, HTMLFile.prototype._ = function(data, doc) {
            data = data.replace(/\\\//g, "/"), this.onData(data);
            try {
                var script = doc.getElementsByTagName("script")[0];
                script.parentNode.removeChild(script);
            } catch (e) {}
        }, HTMLFile.prototype.destroy = function() {
            if (this.iframe) {
                try {
                    this.iframe.src = "about:blank";
                } catch (e) {}
                this.doc = null, this.iframe.parentNode.removeChild(this.iframe), this.iframe = null, 
                CollectGarbage();
            }
        }, HTMLFile.prototype.close = function() {
            return this.destroy(), io.Transport.XHR.prototype.close.call(this);
        }, HTMLFile.check = function(socket) {
            if ("undefined" != typeof window && [ "Active" ].concat("Object").join("X") in window) try {
                return new (window[[ "Active" ].concat("Object").join("X")])("htmlfile") && io.Transport.XHR.check(socket);
            } catch (e) {}
            return !1;
        }, HTMLFile.xdomainCheck = function() {
            return !1;
        }, io.transports.push("htmlfile");
    }(void 0 !== io ? io.Transport : module.exports, void 0 !== io ? io : module.parent.exports), 
    function(exports, io, global) {
        function XHRPolling() {
            io.Transport.XHR.apply(this, arguments);
        }
        function empty() {}
        exports["xhr-polling"] = XHRPolling, io.util.inherit(XHRPolling, io.Transport.XHR), 
        io.util.merge(XHRPolling, io.Transport.XHR), XHRPolling.prototype.name = "xhr-polling", 
        XHRPolling.prototype.heartbeats = function() {
            return !1;
        }, XHRPolling.prototype.open = function() {
            var self = this;
            return io.Transport.XHR.prototype.open.call(self), !1;
        }, XHRPolling.prototype.get = function() {
            function stateChange() {
                4 == this.readyState && (this.onreadystatechange = empty, 200 == this.status ? (self.onData(this.responseText), 
                self.get()) : self.onClose());
            }
            function onload() {
                this.onload = empty, this.onerror = empty, self.retryCounter = 1, self.onData(this.responseText), 
                self.get();
            }
            function onerror() {
                self.retryCounter++, !self.retryCounter || self.retryCounter > 3 ? self.onClose() : self.get();
            }
            if (this.isOpen) {
                var self = this;
                this.xhr = this.request(), global.XDomainRequest && this.xhr instanceof XDomainRequest ? (this.xhr.onload = onload, 
                this.xhr.onerror = onerror) : this.xhr.onreadystatechange = stateChange, this.xhr.send(null);
            }
        }, XHRPolling.prototype.onClose = function() {
            if (io.Transport.XHR.prototype.onClose.call(this), this.xhr) {
                this.xhr.onreadystatechange = this.xhr.onload = this.xhr.onerror = empty;
                try {
                    this.xhr.abort();
                } catch (e) {}
                this.xhr = null;
            }
        }, XHRPolling.prototype.ready = function(socket, fn) {
            var self = this;
            io.util.defer(function() {
                fn.call(self);
            });
        }, io.transports.push("xhr-polling");
    }(void 0 !== io ? io.Transport : module.exports, void 0 !== io ? io : module.parent.exports, this), 
    function(exports, io, global) {
        function JSONPPolling(socket) {
            io.Transport["xhr-polling"].apply(this, arguments), this.index = io.j.length;
            var self = this;
            io.j.push(function(msg) {
                self._(msg);
            });
        }
        var indicator = global.document && "MozAppearance" in global.document.documentElement.style;
        exports["jsonp-polling"] = JSONPPolling, io.util.inherit(JSONPPolling, io.Transport["xhr-polling"]), 
        JSONPPolling.prototype.name = "jsonp-polling", JSONPPolling.prototype.post = function(data) {
            function complete() {
                initIframe(), self.socket.setBuffer(!1);
            }
            function initIframe() {
                self.iframe && self.form.removeChild(self.iframe);
                try {
                    iframe = document.createElement('<iframe name="' + self.iframeId + '">');
                } catch (e) {
                    iframe = document.createElement("iframe"), iframe.name = self.iframeId;
                }
                iframe.id = self.iframeId, self.form.appendChild(iframe), self.iframe = iframe;
            }
            var self = this, query = io.util.query(this.socket.options.query, "t=" + +new Date() + "&i=" + this.index);
            if (!this.form) {
                var iframe, form = document.createElement("form"), area = document.createElement("textarea"), id = this.iframeId = "socketio_iframe_" + this.index;
                form.className = "socketio", form.style.position = "absolute", form.style.top = "0px", 
                form.style.left = "0px", form.style.display = "none", form.target = id, form.method = "POST", 
                form.setAttribute("accept-charset", "utf-8"), area.name = "d", form.appendChild(area), 
                document.body.appendChild(form), this.form = form, this.area = area;
            }
            this.form.action = this.prepareUrl() + query, initIframe(), this.area.value = io.JSON.stringify(data);
            try {
                this.form.submit();
            } catch (e) {}
            this.iframe.attachEvent ? iframe.onreadystatechange = function() {
                "complete" == self.iframe.readyState && complete();
            } : this.iframe.onload = complete, this.socket.setBuffer(!0);
        }, JSONPPolling.prototype.get = function() {
            var self = this, script = document.createElement("script"), query = io.util.query(this.socket.options.query, "t=" + +new Date() + "&i=" + this.index);
            this.script && (this.script.parentNode.removeChild(this.script), this.script = null), 
            script.async = !0, script.src = this.prepareUrl() + query, script.onerror = function() {
                self.onClose();
            };
            var insertAt = document.getElementsByTagName("script")[0];
            insertAt.parentNode.insertBefore(script, insertAt), this.script = script, indicator && setTimeout(function() {
                var iframe = document.createElement("iframe");
                document.body.appendChild(iframe), document.body.removeChild(iframe);
            }, 100);
        }, JSONPPolling.prototype._ = function(msg) {
            return this.onData(msg), this.isOpen && this.get(), this;
        }, JSONPPolling.prototype.ready = function(socket, fn) {
            var self = this;
            if (!indicator) return fn.call(this);
            io.util.load(function() {
                fn.call(self);
            });
        }, JSONPPolling.check = function() {
            return "document" in global;
        }, JSONPPolling.xdomainCheck = function() {
            return !0;
        }, io.transports.push("jsonp-polling");
    }(void 0 !== io ? io.Transport : module.exports, void 0 !== io ? io : module.parent.exports, this), 
    "function" == typeof define && define.amd && define([], function() {
        return io;
    });
}();

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