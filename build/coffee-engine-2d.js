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
        return value = this.storage[Persist.PREFIX + "." + key], isNumeric(value) ? Number(value) : [ "true", "false" ].includes(value) ? Boolean(value) : "undefined" === value ? void 0 : value;
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
}();

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