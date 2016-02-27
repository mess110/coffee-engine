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
        var child = dom.appendChild(dom.firstChild);
        child.style.height = value + "px";
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
        for (var i = 0, numChainedTweens = _chainedTweens.length; numChainedTweens > i; i++) _chainedTweens[i].stop();
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
        if (_startTime > time) return !0;
        _onStartCallbackFired === !1 && (null !== _onStartCallback && _onStartCallback.call(_object), 
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
            for (var i = 0, numChainedTweens = _chainedTweens.length; numChainedTweens > i; i++) _chainedTweens[i].start(time);
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
            return 0 === k ? 0 : 1 === k ? 1 : (k *= 2) < 1 ? .5 * Math.pow(1024, k - 1) : .5 * (-Math.pow(2, -10 * (k - 1)) + 2);
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
            return 0 === k ? 0 : 1 === k ? 1 : (!a || 1 > a ? (a = 1, s = p / 4) : s = p * Math.asin(1 / a) / (2 * Math.PI), 
            -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p)));
        },
        Out: function(k) {
            var s, a = .1, p = .4;
            return 0 === k ? 0 : 1 === k ? 1 : (!a || 1 > a ? (a = 1, s = p / 4) : s = p * Math.asin(1 / a) / (2 * Math.PI), 
            a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
        },
        InOut: function(k) {
            var s, a = .1, p = .4;
            return 0 === k ? 0 : 1 === k ? 1 : (!a || 1 > a ? (a = 1, s = p / 4) : s = p * Math.asin(1 / a) / (2 * Math.PI), 
            (k *= 2) < 1 ? -.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p)) : a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * .5 + 1);
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
            return (k *= 2) < 1 ? .5 * (k * k * ((s + 1) * k - s)) : .5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
        }
    },
    Bounce: {
        In: function(k) {
            return 1 - TWEEN.Easing.Bounce.Out(1 - k);
        },
        Out: function(k) {
            return 1 / 2.75 > k ? 7.5625 * k * k : 2 / 2.75 > k ? 7.5625 * (k -= 1.5 / 2.75) * k + .75 : 2.5 / 2.75 > k ? 7.5625 * (k -= 2.25 / 2.75) * k + .9375 : 7.5625 * (k -= 2.625 / 2.75) * k + .984375;
        },
        InOut: function(k) {
            return .5 > k ? .5 * TWEEN.Easing.Bounce.In(2 * k) : .5 * TWEEN.Easing.Bounce.Out(2 * k - 1) + .5;
        }
    }
}, TWEEN.Interpolation = {
    Linear: function(v, k) {
        var m = v.length - 1, f = m * k, i = Math.floor(f), fn = TWEEN.Interpolation.Utils.Linear;
        return 0 > k ? fn(v[0], v[1], f) : k > 1 ? fn(v[m], v[m - 1], m - f) : fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
    },
    Bezier: function(v, k) {
        var i, b = 0, n = v.length - 1, pw = Math.pow, bn = TWEEN.Interpolation.Utils.Bernstein;
        for (i = 0; n >= i; i++) b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
        return b;
    },
    CatmullRom: function(v, k) {
        var m = v.length - 1, f = m * k, i = Math.floor(f), fn = TWEEN.Interpolation.Utils.CatmullRom;
        return v[0] === v[m] ? (0 > k && (i = Math.floor(f = m * (1 + k))), fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i)) : 0 > k ? v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]) : k > 1 ? v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]) : fn(v[i ? i - 1 : 0], v[i], v[i + 1 > m ? m : i + 1], v[i + 2 > m ? m : i + 2], f - i);
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
            var v0 = .5 * (p2 - p0), v1 = .5 * (p3 - p1), t2 = t * t, t3 = t * t2;
            return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
        }
    }
};

var SceneManager;

SceneManager = function() {
    function SceneManager() {}
    var instance;
    return instance = null, Singleton.SceneManager = function() {
        function SceneManager() {}
        return SceneManager.prototype.scenes = [], SceneManager.prototype.currentSceneIndex = void 0, 
        SceneManager.prototype.currentScene = function() {
            if (null == this.currentSceneIndex) throw "SceneManager.setScene not called";
            if (this.isEmpty()) throw "Requires at least one scene";
            return this.scenes[this.currentSceneIndex];
        }, SceneManager.prototype.addScene = function(scene) {
            var i;
            return i = this.scenes.indexOf(scene), -1 === i ? this.scenes.push(scene) : void 0;
        }, SceneManager.prototype.removeScene = function(scene) {
            var i;
            return i = this.scenes.indexOf(scene), this.removeSceneByIndex(i);
        }, SceneManager.prototype.removeSceneByIndex = function(i) {
            return i >= 0 ? (i === this.currentSceneIndex && (this.currentSceneIndex = void 0), 
            array.splice(i, 1)) : void 0;
        }, SceneManager.prototype.setScene = function(scene) {
            var i;
            if (i = this.scenes.indexOf(scene), -1 === i) throw "scene not added to SceneManager";
            return this.setSceneByIndex(i), this.currentScene();
        }, SceneManager.prototype.setSceneByIndex = function(i) {
            if (this.isEmpty() || !this.isValidIndex(i)) throw "invalid scene index";
            return this.currentSceneIndex = i, Config.get().debug && console.log("Changing to scene " + i), 
            this.currentScene();
        }, SceneManager.prototype.isEmpty = function() {
            return 0 === this.scenes.length;
        }, SceneManager.prototype.isValidIndex = function(i) {
            return i >= 0 && i < this.scenes.length;
        }, SceneManager.prototype.tick = function(tpf) {
            return this.currentScene().fullTick(tpf);
        }, SceneManager;
    }(), SceneManager.get = function() {
        return null != instance ? instance : instance = new Singleton.SceneManager();
    }, SceneManager;
}();

var Persist;

Persist = function() {
    function Persist() {
        this.storage = localStorage;
    }
    return Persist.PREFIX = "ce", Persist.DEFAULT_SUFFIX = "default", Persist.prototype.set = function(key, value, def) {
        if (null == def && (def = void 0), null == key) throw "key missing";
        return this.storage[Persist.PREFIX + "." + key] = value, null != def ? this["default"](key, def) : void 0;
    }, Persist.prototype["default"] = function(key, value) {
        return this.set(key + "." + Persist.DEFAULT_SUFFIX, value);
    }, Persist.prototype.get = function(key) {
        var value;
        return value = this._get(key), null == value ? this._get(key + "." + Persist.DEFAULT_SUFFIX) : value;
    }, Persist.prototype._get = function(key) {
        var value;
        if (null == key) throw "key missing";
        return value = this.storage[Persist.PREFIX + "." + key], isNumeric(value) ? Number(value) : [ "true", "false" ].includes(value) ? Boolean(value) : "undefined" !== value ? value : void 0;
    }, Persist.prototype.rm = function(key) {
        if (null == key) throw "key missing";
        return this.storage.removeItem(key);
    }, Persist.prototype.clear = function(exceptions, withDefaults) {
        var results, storage;
        null == exceptions && (exceptions = []), null == withDefaults && (withDefaults = !1), 
        exceptions instanceof Array || (exceptions = [ exceptions ]), results = [];
        for (storage in this.storage) storage.endsWith("." + Persist.DEFAULT_SUFFIX) && withDefaults === !1 || (exceptions.includes(storage) ? results.push(void 0) : results.push(this.rm(storage)));
        return results;
    }, Persist.get = function(key) {
        return new Persist().get(key);
    }, Persist.set = function(key, value, def) {
        return new Persist().set(key, value, def);
    }, Persist["default"] = function(key, value) {
        return new Persist()["default"](key, value);
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
    Utils.SAVE_URLS = [ ".save" ], Utils.toggleFullScreen = function() {
        document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement ? document.exitFullscreen ? document.exitFullscreen() : document.msExitFullscreen ? document.msExitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen && document.webkitExitFullscreen() : document.documentElement.requestFullscreen ? document.documentElement.requestFullscreen() : document.documentElement.msRequestFullscreen ? document.documentElement.msRequestFullscreen() : document.documentElement.mozRequestFullScreen ? document.documentElement.mozRequestFullScreen() : document.documentElement.webkitRequestFullscreen && document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }, Utils.guid = function() {
        var s4;
        return s4 = function() {
            return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
        }, s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    }, Utils.setCursor = function(url) {
        return document.body.style.cursor = "url('" + url + "'), auto";
    }, Utils.rgbToHex = function(r, g, b) {
        if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
        return (r << 16 | g << 8 | b).toString(16);
    }, Utils.getKeyName = function(url, array) {
        return url.replaceAny(array, "").split("/").last();
    }, Utils.saveFile = function(content, fileName, format) {
        var blob, e, error, isFileSaverSupported, json;
        null == format && (format = "application/json");
        try {
            isFileSaverSupported = !!new Blob();
        } catch (error) {
            throw e = error, "FileSaver not supported";
        }
        return json = JSON.stringify(content, null, 2), blob = new Blob([ json ], {
            type: format + ";charset=utf-8"
        }), saveAs(blob, fileName);
    }, Utils;
}(), exports.Utils = Utils;

var BaseScene;

BaseScene = function() {
    function BaseScene(engine) {
        this.engine = engine, this.context = this.engine.context;
    }
    return BaseScene.prototype.tick = function(tpf) {
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
        return this.loaded ? context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height) : void 0;
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
        document.addEventListener("keyup", this.onDocumentKeyboardEvent, !1), this.canvas = document.getElementById(this.canvasId), 
        this.canvas.width = width, this.canvas.height = height, this.context = this.canvas.getContext("2d"), 
        windowResize && (window.addEventListener("resize", this.resize, !1), this.resize());
    }
    return Engine2D.prototype.resize = function() {
        var canvasRatio, height, width, windowRatio;
        return canvasRatio = this.canvas.height / this.canvas.width, windowRatio = window.innerHeight / window.innerWidth, 
        width = void 0, height = void 0, canvasRatio > windowRatio ? (height = window.innerHeight, 
        width = height / canvasRatio) : (width = window.innerWidth, height = width * canvasRatio), 
        this.canvas.style.width = width + "px", this.canvas.style.height = height + "px";
    }, Engine2D.prototype.onDocumentMouseEvent = function(event) {
        return this.sceneManager.currentScene().doMouseEvent(event);
    }, Engine2D.prototype.onDocumentKeyboardEvent = function(event) {
        return this.sceneManager.currentScene().doKeyboardEvent(event);
    }, Engine2D.prototype.clear = function() {
        return this.context.fillStyle = this.backgroundColor, this.context.fillRect(0, 0, this.width, this.height);
    }, Engine2D.prototype.render = function() {
        var now, tpf;
        return requestAnimationFrame(this.render), now = new Date().getTime(), tpf = (now - (this.time || now)) / 1e3, 
        this.time = now, this.sceneManager.tick(tpf);
    }, Engine2D;
}();

var isNumeric;

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
    for (eq = !0, i = j = 0, ref = a.size(); ref >= 0 ? ref >= j : j >= ref; i = ref >= 0 ? ++j : --j) if (a[i] !== this[i]) {
        eq = !1;
        break;
    }
    return eq;
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
    var e, j, len, sum;
    for (sum = 0, j = 0, len = this.length; len > j; j++) e = this[j], sum += e;
    return sum;
}, String.prototype.size = function(s) {
    return this.length;
}, String.prototype.startsWith = function(s) {
    return 0 === this.indexOf(s);
}, String.prototype.startsWithAny = function(prefixes) {
    var j, len, prefix, startsWith;
    for (startsWith = !1, j = 0, len = prefixes.length; len > j; j++) prefix = prefixes[j], 
    this.startsWith(prefix) && (startsWith = !0);
    return startsWith;
}, String.prototype.endsWith = function(suffix) {
    return -1 !== this.indexOf(suffix, this.length - suffix.length);
}, String.prototype.endsWithAny = function(suffixes) {
    var endsWith, j, len, suffix;
    for (endsWith = !1, j = 0, len = suffixes.length; len > j; j++) suffix = suffixes[j], 
    this.endsWith(suffix) && (endsWith = !0);
    return endsWith;
}, String.prototype.replaceAny = function(sources, dest) {
    var j, len, source, tmp;
    for (tmp = this, j = 0, len = sources.length; len > j; j++) source = sources[j], 
    tmp = tmp.replace(source, dest);
    return tmp;
}, String.prototype.isEmpty = function() {
    return 0 === this.size();
}, String.prototype.contains = function(s) {
    return -1 !== this.indexOf(s);
}, String.prototype.isPresent = function() {
    return "undefined" != typeof this && null !== this && !this.isEmpty();
}, String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}, isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

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
            for (var kv, query = {}, params = qs.split("&"), i = 0, l = params.length; l > i; ++i) kv = params[i].split("="), 
            kv[0] && (query[kv[0]] = kv[1]);
            return query;
        };
        var pageLoaded = !1;
        util.load = function(fn) {
            return "document" in global && "complete" === document.readyState || pageLoaded ? fn() : void util.on(global, "load", fn, !1);
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
            return util.ua.webkit && "undefined" == typeof importScripts ? void util.load(function() {
                setTimeout(fn, 100);
            }) : fn();
        }, util.merge = function(target, additional, deep, lastseen) {
            var prop, seen = lastseen || [], depth = "undefined" == typeof deep ? 2 : deep;
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
            for (var ret = [], longest = arr.length > arr2.length ? arr : arr2, shortest = arr.length > arr2.length ? arr2 : arr, i = 0, l = shortest.length; l > i; i++) ~util.indexOf(longest, shortest[i]) && ret.push(shortest[i]);
            return ret;
        }, util.indexOf = function(arr, o, i) {
            for (var j = arr.length, i = 0 > i ? 0 > i + j ? 0 : i + j : i || 0; j > i && arr[i] !== o; i++) ;
            return i >= j ? -1 : i;
        }, util.toArray = function(enu) {
            for (var arr = [], i = 0, l = enu.length; l > i; i++) arr.push(enu[i]);
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
    }("undefined" != typeof io ? io : module.exports, this), function(exports, io) {
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
                    for (var pos = -1, i = 0, l = list.length; l > i; i++) if (list[i] === fn || list[i].listener && list[i].listener === fn) {
                        pos = i;
                        break;
                    }
                    if (0 > pos) return this;
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
                for (var listeners = handler.slice(), i = 0, l = listeners.length; l > i; i++) listeners[i].apply(this, args);
            }
            return !0;
        };
    }("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), 
    function(exports, nativeJSON) {
        "use strict";
        function f(n) {
            return 10 > n ? "0" + n : n;
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
                    for (length = value.length, i = 0; length > i; i += 1) partial[i] = str(i, value) || "null";
                    return v = 0 === partial.length ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]", 
                    gap = mind, v;
                }
                if (rep && "object" == typeof rep) for (length = rep.length, i = 0; length > i; i += 1) "string" == typeof rep[i] && (k = rep[i], 
                v = str(k, value), v && partial.push(quote(k) + (gap ? ": " : ":") + v)); else for (k in value) Object.prototype.hasOwnProperty.call(value, k) && (v = str(k, value), 
                v && partial.push(quote(k) + (gap ? ": " : ":") + v));
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
            "	": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        }, rep;
        JSON.stringify = function(value, replacer, space) {
            var i;
            if (gap = "", indent = "", "number" == typeof space) for (i = 0; space > i; i += 1) indent += " "; else "string" == typeof space && (indent = space);
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
    }("undefined" != typeof io ? io : module.exports, "undefined" != typeof JSON ? JSON : void 0), 
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
            for (var i = 0, l = packets.length; l > i; i++) {
                var packet = packets[i];
                decoded += "�" + packet.length + "�" + packets[i];
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
                break;

              case "disconnect":
              case "heartbeat":            }
            return packet;
        }, parser.decodePayload = function(data) {
            if ("�" == data.charAt(0)) {
                for (var ret = [], i = 1, length = ""; i < data.length; i++) "�" == data.charAt(i) ? (ret.push(parser.decodePacket(data.substr(i + 1).substr(0, length))), 
                i += Number(length) + 1, length = "") : length += data.charAt(i);
                return ret;
            }
            return [ parser.decodePacket(data) ];
        };
    }("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), 
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
                if (msgs && msgs.length) for (var i = 0, l = msgs.length; l > i; i++) this.onPacket(msgs[i]);
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
    }("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), 
    function(exports, io, global) {
        function Socket(options) {
            if (this.options = {
                port: 80,
                secure: !1,
                document: "document" in global ? document : !1,
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
                    return self.transport && self.transport.clearTimeouts(), self.transport = self.getTransport(transports), 
                    self.transport ? void self.transport.ready(self, function() {
                        self.connecting = !0, self.publish("connecting", self.transport.name), self.transport.open(), 
                        self.options["connect timeout"] && (self.connectTimeoutTimer = setTimeout(function() {
                            if (!self.connected && (self.connecting = !1, self.options["try multiple transports"])) {
                                for (var remaining = self.transports; remaining.length > 0 && remaining.splice(0, 1)[0] != self.transport.name; ) ;
                                remaining.length ? connect(remaining) : self.publish("connect_failed");
                            }
                        }, self.options["connect timeout"]));
                    }) : self.publish("connect_failed");
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
                return self.reconnecting ? self.connected ? reset() : self.connecting && self.reconnecting ? self.reconnectionTimer = setTimeout(maybeReconnect, 1e3) : void (self.reconnectionAttempts++ >= maxAttempts ? self.redoTransports ? (self.publish("reconnect_failed"), 
                reset()) : (self.on("connect_failed", maybeReconnect), self.options["try multiple transports"] = !0, 
                self.transports = self.origTransports, self.transport = self.getTransport(), self.redoTransports = !0, 
                self.connect()) : (self.reconnectionDelay < limit && (self.reconnectionDelay *= 2), 
                self.connect(), self.publish("reconnecting", self.reconnectionDelay, self.reconnectionAttempts), 
                self.reconnectionTimer = setTimeout(maybeReconnect, self.reconnectionDelay))) : void 0;
            }
            this.reconnecting = !0, this.reconnectionAttempts = 0, this.reconnectionDelay = this.options["reconnection delay"];
            var self = this, maxAttempts = this.options["max reconnection attempts"], tryMultiple = this.options["try multiple transports"], limit = this.options["reconnection limit"];
            this.options["try multiple transports"] = !1, this.reconnectionTimer = setTimeout(maybeReconnect, this.reconnectionDelay), 
            this.on("connect", maybeReconnect);
        };
    }("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), 
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
    }("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), 
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
            for (var i = 0, l = arr.length; l > i; i++) this.packet(arr[i]);
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
    }("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), 
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
            return document.body ? init() : void io.util.load(init);
        }, Flashsocket.check = function() {
            return "undefined" != typeof WebSocket && "__initialize" in WebSocket && swfobject ? swfobject.getFlashPlayerVersion().major >= 10 : !1;
        }, Flashsocket.xdomainCheck = function() {
            return !0;
        }, "undefined" != typeof window && (WEB_SOCKET_DISABLE_AUTO_INITIALIZATION = !0), 
        io.transports.push("flashsocket");
    }("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports), 
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
                for (var X = U.length, Y = 0; X > Y; Y++) U[Y]();
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
                    } else if (10 > Y) return Y++, void setTimeout(arguments.callee, 10);
                    X.removeChild(aa), Z = null, H();
                }();
            } else H();
        }
        function H() {
            var ag = o.length;
            if (ag > 0) for (var af = 0; ag > af; af++) {
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
                        for (var ah = {}, X = ae.getElementsByTagName("param"), ac = X.length, ad = 0; ac > ad; ad++) "movie" != X[ad].getAttribute("name").toLowerCase() && (ah[X[ad].getAttribute("name")] = X[ad].getAttribute("value"));
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
                    if (ad) for (var X = ad.length, Z = 0; X > Z; Z++) 1 == ad[Z].nodeType && "PARAM" == ad[Z].nodeName || 8 == ad[Z].nodeType || aa.appendChild(ad[Z].cloneNode(!0));
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
            var Z = /[\\\"<>\.;]/, X = null != Z.exec(Y);
            return X && typeof encodeURIComponent != D ? encodeURIComponent(Y) : Y;
        }
        var l, Q, E, B, n, G, D = "undefined", r = "object", S = "Shockwave Flash", W = "ShockwaveFlash.ShockwaveFlash", q = "application/x-shockwave-flash", R = "SWFObjectExprInst", x = "onreadystatechange", O = window, j = document, t = navigator, T = !1, U = [ h ], o = [], N = [], I = [], J = !1, a = !1, m = !0, M = function() {
            var aa = typeof j.getElementById != D && typeof j.getElementsByTagName != D && typeof j.createElement != D, ah = t.userAgent.toLowerCase(), Y = t.platform.toLowerCase(), ae = Y ? /win/.test(Y) : /win/.test(ah), ac = Y ? /mac/.test(Y) : /mac/.test(ah), af = /webkit/.test(ah) ? parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : !1, X = !1, ag = [ 0, 0, 0 ], ab = null;
            if (typeof t.plugins != D && typeof t.plugins[S] == r) ab = t.plugins[S].description, 
            !ab || typeof t.mimeTypes != D && t.mimeTypes[q] && !t.mimeTypes[q].enabledPlugin || (T = !0, 
            X = !1, ab = ab.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), ag[0] = parseInt(ab.replace(/^(.*)\..*$/, "$1"), 10), 
            ag[1] = parseInt(ab.replace(/^.*\.(.*)\s.*$/, "$1"), 10), ag[2] = /[a-zA-Z]/.test(ab) ? parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0); else if (typeof O[[ "Active" ].concat("Object").join("X")] != D) try {
                var ad = new (window[[ "Active" ].concat("Object").join("X")])(W);
                ad && (ab = ad.GetVariable("$version"), ab && (X = !0, ab = ab.split(" ")[1].split(","), 
                ag = [ parseInt(ab[0], 10), parseInt(ab[1], 10), parseInt(ab[2], 10) ]));
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
            }), O == top && !function() {
                if (!J) {
                    try {
                        j.documentElement.doScroll("left");
                    } catch (X) {
                        return void setTimeout(arguments.callee, 0);
                    }
                    f();
                }
            }()), M.wk && !function() {
                return J ? void 0 : /loaded|complete/.test(j.readyState) ? void f() : void setTimeout(arguments.callee, 0);
            }(), s(f)));
        })(), function() {
            M.ie && M.win && window.attachEvent("onunload", function() {
                for (var ac = I.length, ab = 0; ac > ab; ab++) I[ab][0].detachEvent(I[ab][1], I[ab][2]);
                for (var Z = N.length, aa = 0; Z > aa; aa++) y(N[aa]);
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
                return M.w3 ? z(X) : void 0;
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
                return 0 > result ? !0 : (this.bufferedAmount += result, !1);
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
                return mimeType && mimeType.enabledPlugin && mimeType.enabledPlugin.filename ? !!mimeType.enabledPlugin.filename.match(/flashlite/i) : !1;
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
            for (var msgs = [], i = 0, l = payload.length; l > i; i++) msgs.push(io.parser.encodePacket(payload[i]));
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
    }("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), 
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
                var a = new (window[[ "Active" ].concat("Object").join("X")])("htmlfile");
                return a && io.Transport.XHR.check(socket);
            } catch (e) {}
            return !1;
        }, HTMLFile.xdomainCheck = function() {
            return !1;
        }, io.transports.push("htmlfile");
    }("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports), 
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
    }("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), 
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
            return indicator ? void io.util.load(function() {
                fn.call(self);
            }) : fn.call(this);
        }, JSONPPolling.check = function() {
            return "document" in global;
        }, JSONPPolling.xdomainCheck = function() {
            return !0;
        }, io.transports.push("jsonp-polling");
    }("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), 
    "function" == typeof define && define.amd && define([], function() {
        return io;
    });
}();