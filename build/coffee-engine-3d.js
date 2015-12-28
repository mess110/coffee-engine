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

var THREEx = THREEx || {};

THREEx.WindowResize = function(renderer, camera, dimension) {
    dimension = dimension || function() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    };
    var callback = function() {
        var rendererSize = dimension();
        renderer.setSize(rendererSize.width, rendererSize.height), camera.aspect = rendererSize.width / rendererSize.height, 
        camera.updateProjectionMatrix();
    };
    return window.addEventListener("resize", callback, !1), {
        trigger: function() {
            callback();
        },
        destroy: function() {
            window.removeEventListener("resize", callback);
        }
    };
};

var THREEx = THREEx || {};

THREEx.RendererStats = function() {
    var container = document.createElement("div");
    container.style.cssText = "width:80px;opacity:0.9;cursor:pointer";
    var msDiv = document.createElement("div");
    msDiv.style.cssText = "padding:0 0 3px 3px;text-align:left;background-color:#200;", 
    container.appendChild(msDiv);
    var msText = document.createElement("div");
    msText.style.cssText = "color:#f00;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px", 
    msText.innerHTML = "WebGLRenderer", msDiv.appendChild(msText);
    for (var msTexts = [], nLines = 9, i = 0; nLines > i; i++) msTexts[i] = document.createElement("div"), 
    msTexts[i].style.cssText = "color:#f00;background-color:#311;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px", 
    msDiv.appendChild(msTexts[i]), msTexts[i].innerHTML = "-";
    var lastTime = Date.now();
    return {
        domElement: container,
        update: function(webGLRenderer) {
            if (console.assert(webGLRenderer instanceof THREE.WebGLRenderer), !(Date.now() - lastTime < 1e3 / 30)) {
                lastTime = Date.now();
                var i = 0;
                msTexts[i++].textContent = "== Memory =====", msTexts[i++].textContent = "Programs: " + webGLRenderer.info.memory.programs, 
                msTexts[i++].textContent = "Geometries: " + webGLRenderer.info.memory.geometries, 
                msTexts[i++].textContent = "Textures: " + webGLRenderer.info.memory.textures, msTexts[i++].textContent = "== Render =====", 
                msTexts[i++].textContent = "Calls: " + webGLRenderer.info.render.calls, msTexts[i++].textContent = "Vertices: " + webGLRenderer.info.render.vertices, 
                msTexts[i++].textContent = "Faces: " + webGLRenderer.info.render.faces, msTexts[i++].textContent = "Points: " + webGLRenderer.info.render.points;
            }
        }
    };
};

var THREE = {
    REVISION: "73"
};

"function" == typeof define && define.amd ? define("three", THREE) : "undefined" != typeof exports && "undefined" != typeof module && (module.exports = THREE), 
(void 0 === self.requestAnimationFrame || void 0 === self.cancelAnimationFrame) && !function() {
    for (var lastTime = 0, vendors = [ "ms", "moz", "webkit", "o" ], x = 0; x < vendors.length && !self.requestAnimationFrame; ++x) self.requestAnimationFrame = self[vendors[x] + "RequestAnimationFrame"], 
    self.cancelAnimationFrame = self[vendors[x] + "CancelAnimationFrame"] || self[vendors[x] + "CancelRequestAnimationFrame"];
    void 0 === self.requestAnimationFrame && void 0 !== self.setTimeout && (self.requestAnimationFrame = function(callback) {
        var currTime = Date.now(), timeToCall = Math.max(0, 16 - (currTime - lastTime)), id = self.setTimeout(function() {
            callback(currTime + timeToCall);
        }, timeToCall);
        return lastTime = currTime + timeToCall, id;
    }), void 0 === self.cancelAnimationFrame && void 0 !== self.clearTimeout && (self.cancelAnimationFrame = function(id) {
        self.clearTimeout(id);
    });
}(), void 0 === self.performance && (self.performance = {}), void 0 === self.performance.now && !function() {
    var start = Date.now();
    self.performance.now = function() {
        return Date.now() - start;
    };
}(), void 0 === Number.EPSILON && (Number.EPSILON = Math.pow(2, -52)), void 0 === Math.sign && (Math.sign = function(x) {
    return 0 > x ? -1 : x > 0 ? 1 : +x;
}), void 0 === Function.prototype.name && void 0 !== Object.defineProperty && Object.defineProperty(Function.prototype, "name", {
    get: function() {
        return this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];
    }
}), THREE.MOUSE = {
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2
}, THREE.CullFaceNone = 0, THREE.CullFaceBack = 1, THREE.CullFaceFront = 2, THREE.CullFaceFrontBack = 3, 
THREE.FrontFaceDirectionCW = 0, THREE.FrontFaceDirectionCCW = 1, THREE.BasicShadowMap = 0, 
THREE.PCFShadowMap = 1, THREE.PCFSoftShadowMap = 2, THREE.FrontSide = 0, THREE.BackSide = 1, 
THREE.DoubleSide = 2, THREE.FlatShading = 1, THREE.SmoothShading = 2, THREE.NoColors = 0, 
THREE.FaceColors = 1, THREE.VertexColors = 2, THREE.NoBlending = 0, THREE.NormalBlending = 1, 
THREE.AdditiveBlending = 2, THREE.SubtractiveBlending = 3, THREE.MultiplyBlending = 4, 
THREE.CustomBlending = 5, THREE.AddEquation = 100, THREE.SubtractEquation = 101, 
THREE.ReverseSubtractEquation = 102, THREE.MinEquation = 103, THREE.MaxEquation = 104, 
THREE.ZeroFactor = 200, THREE.OneFactor = 201, THREE.SrcColorFactor = 202, THREE.OneMinusSrcColorFactor = 203, 
THREE.SrcAlphaFactor = 204, THREE.OneMinusSrcAlphaFactor = 205, THREE.DstAlphaFactor = 206, 
THREE.OneMinusDstAlphaFactor = 207, THREE.DstColorFactor = 208, THREE.OneMinusDstColorFactor = 209, 
THREE.SrcAlphaSaturateFactor = 210, THREE.NeverDepth = 0, THREE.AlwaysDepth = 1, 
THREE.LessDepth = 2, THREE.LessEqualDepth = 3, THREE.EqualDepth = 4, THREE.GreaterEqualDepth = 5, 
THREE.GreaterDepth = 6, THREE.NotEqualDepth = 7, THREE.MultiplyOperation = 0, THREE.MixOperation = 1, 
THREE.AddOperation = 2, THREE.UVMapping = 300, THREE.CubeReflectionMapping = 301, 
THREE.CubeRefractionMapping = 302, THREE.EquirectangularReflectionMapping = 303, 
THREE.EquirectangularRefractionMapping = 304, THREE.SphericalReflectionMapping = 305, 
THREE.RepeatWrapping = 1e3, THREE.ClampToEdgeWrapping = 1001, THREE.MirroredRepeatWrapping = 1002, 
THREE.NearestFilter = 1003, THREE.NearestMipMapNearestFilter = 1004, THREE.NearestMipMapLinearFilter = 1005, 
THREE.LinearFilter = 1006, THREE.LinearMipMapNearestFilter = 1007, THREE.LinearMipMapLinearFilter = 1008, 
THREE.UnsignedByteType = 1009, THREE.ByteType = 1010, THREE.ShortType = 1011, THREE.UnsignedShortType = 1012, 
THREE.IntType = 1013, THREE.UnsignedIntType = 1014, THREE.FloatType = 1015, THREE.HalfFloatType = 1025, 
THREE.UnsignedShort4444Type = 1016, THREE.UnsignedShort5551Type = 1017, THREE.UnsignedShort565Type = 1018, 
THREE.AlphaFormat = 1019, THREE.RGBFormat = 1020, THREE.RGBAFormat = 1021, THREE.LuminanceFormat = 1022, 
THREE.LuminanceAlphaFormat = 1023, THREE.RGBEFormat = THREE.RGBAFormat, THREE.RGB_S3TC_DXT1_Format = 2001, 
THREE.RGBA_S3TC_DXT1_Format = 2002, THREE.RGBA_S3TC_DXT3_Format = 2003, THREE.RGBA_S3TC_DXT5_Format = 2004, 
THREE.RGB_PVRTC_4BPPV1_Format = 2100, THREE.RGB_PVRTC_2BPPV1_Format = 2101, THREE.RGBA_PVRTC_4BPPV1_Format = 2102, 
THREE.RGBA_PVRTC_2BPPV1_Format = 2103, THREE.LoopOnce = 2200, THREE.LoopRepeat = 2201, 
THREE.LoopPingPong = 2202, THREE.Projector = function() {
    console.error("THREE.Projector has been moved to /examples/js/renderers/Projector.js."), 
    this.projectVector = function(vector, camera) {
        console.warn("THREE.Projector: .projectVector() is now vector.project()."), vector.project(camera);
    }, this.unprojectVector = function(vector, camera) {
        console.warn("THREE.Projector: .unprojectVector() is now vector.unproject()."), 
        vector.unproject(camera);
    }, this.pickingRay = function(vector, camera) {
        console.error("THREE.Projector: .pickingRay() is now raycaster.setFromCamera().");
    };
}, THREE.CanvasRenderer = function() {
    console.error("THREE.CanvasRenderer has been moved to /examples/js/renderers/CanvasRenderer.js"), 
    this.domElement = document.createElement("canvas"), this.clear = function() {}, 
    this.render = function() {}, this.setClearColor = function() {}, this.setSize = function() {};
}, THREE.Color = function(color) {
    return 3 === arguments.length ? this.fromArray(arguments) : this.set(color);
}, THREE.Color.prototype = {
    constructor: THREE.Color,
    r: 1,
    g: 1,
    b: 1,
    set: function(value) {
        return value instanceof THREE.Color ? this.copy(value) : "number" == typeof value ? this.setHex(value) : "string" == typeof value && this.setStyle(value), 
        this;
    },
    setHex: function(hex) {
        return hex = Math.floor(hex), this.r = (hex >> 16 & 255) / 255, this.g = (hex >> 8 & 255) / 255, 
        this.b = (255 & hex) / 255, this;
    },
    setRGB: function(r, g, b) {
        return this.r = r, this.g = g, this.b = b, this;
    },
    setHSL: function() {
        function hue2rgb(p, q, t) {
            return 0 > t && (t += 1), t > 1 && (t -= 1), 1 / 6 > t ? p + 6 * (q - p) * t : .5 > t ? q : 2 / 3 > t ? p + 6 * (q - p) * (2 / 3 - t) : p;
        }
        return function(h, s, l) {
            if (h = THREE.Math.euclideanModulo(h, 1), s = THREE.Math.clamp(s, 0, 1), l = THREE.Math.clamp(l, 0, 1), 
            0 === s) this.r = this.g = this.b = l; else {
                var p = .5 >= l ? l * (1 + s) : l + s - l * s, q = 2 * l - p;
                this.r = hue2rgb(q, p, h + 1 / 3), this.g = hue2rgb(q, p, h), this.b = hue2rgb(q, p, h - 1 / 3);
            }
            return this;
        };
    }(),
    setStyle: function(style) {
        function handleAlpha(string) {
            void 0 !== string && parseFloat(string) < 1 && console.warn("THREE.Color: Alpha component of " + style + " will be ignored.");
        }
        var m;
        if (m = /^((?:rgb|hsl)a?)\(\s*([^\)]*)\)/.exec(style)) {
            var color, name = m[1], components = m[2];
            switch (name) {
              case "rgb":
              case "rgba":
                if (color = /^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec(components)) return this.r = Math.min(255, parseInt(color[1], 10)) / 255, 
                this.g = Math.min(255, parseInt(color[2], 10)) / 255, this.b = Math.min(255, parseInt(color[3], 10)) / 255, 
                handleAlpha(color[5]), this;
                if (color = /^(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec(components)) return this.r = Math.min(100, parseInt(color[1], 10)) / 100, 
                this.g = Math.min(100, parseInt(color[2], 10)) / 100, this.b = Math.min(100, parseInt(color[3], 10)) / 100, 
                handleAlpha(color[5]), this;
                break;

              case "hsl":
              case "hsla":
                if (color = /^([0-9]*\.?[0-9]+)\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec(components)) {
                    var h = parseFloat(color[1]) / 360, s = parseInt(color[2], 10) / 100, l = parseInt(color[3], 10) / 100;
                    return handleAlpha(color[5]), this.setHSL(h, s, l);
                }
            }
        } else if (m = /^\#([A-Fa-f0-9]+)$/.exec(style)) {
            var hex = m[1], size = hex.length;
            if (3 === size) return this.r = parseInt(hex.charAt(0) + hex.charAt(0), 16) / 255, 
            this.g = parseInt(hex.charAt(1) + hex.charAt(1), 16) / 255, this.b = parseInt(hex.charAt(2) + hex.charAt(2), 16) / 255, 
            this;
            if (6 === size) return this.r = parseInt(hex.charAt(0) + hex.charAt(1), 16) / 255, 
            this.g = parseInt(hex.charAt(2) + hex.charAt(3), 16) / 255, this.b = parseInt(hex.charAt(4) + hex.charAt(5), 16) / 255, 
            this;
        }
        if (style && style.length > 0) {
            var hex = THREE.ColorKeywords[style];
            void 0 !== hex ? this.setHex(hex) : console.warn("THREE.Color: Unknown color " + style);
        }
        return this;
    },
    clone: function() {
        return new this.constructor(this.r, this.g, this.b);
    },
    copy: function(color) {
        return this.r = color.r, this.g = color.g, this.b = color.b, this;
    },
    copyGammaToLinear: function(color, gammaFactor) {
        return void 0 === gammaFactor && (gammaFactor = 2), this.r = Math.pow(color.r, gammaFactor), 
        this.g = Math.pow(color.g, gammaFactor), this.b = Math.pow(color.b, gammaFactor), 
        this;
    },
    copyLinearToGamma: function(color, gammaFactor) {
        void 0 === gammaFactor && (gammaFactor = 2);
        var safeInverse = gammaFactor > 0 ? 1 / gammaFactor : 1;
        return this.r = Math.pow(color.r, safeInverse), this.g = Math.pow(color.g, safeInverse), 
        this.b = Math.pow(color.b, safeInverse), this;
    },
    convertGammaToLinear: function() {
        var r = this.r, g = this.g, b = this.b;
        return this.r = r * r, this.g = g * g, this.b = b * b, this;
    },
    convertLinearToGamma: function() {
        return this.r = Math.sqrt(this.r), this.g = Math.sqrt(this.g), this.b = Math.sqrt(this.b), 
        this;
    },
    getHex: function() {
        return 255 * this.r << 16 ^ 255 * this.g << 8 ^ 255 * this.b << 0;
    },
    getHexString: function() {
        return ("000000" + this.getHex().toString(16)).slice(-6);
    },
    getHSL: function(optionalTarget) {
        var hue, saturation, hsl = optionalTarget || {
            h: 0,
            s: 0,
            l: 0
        }, r = this.r, g = this.g, b = this.b, max = Math.max(r, g, b), min = Math.min(r, g, b), lightness = (min + max) / 2;
        if (min === max) hue = 0, saturation = 0; else {
            var delta = max - min;
            switch (saturation = .5 >= lightness ? delta / (max + min) : delta / (2 - max - min), 
            max) {
              case r:
                hue = (g - b) / delta + (b > g ? 6 : 0);
                break;

              case g:
                hue = (b - r) / delta + 2;
                break;

              case b:
                hue = (r - g) / delta + 4;
            }
            hue /= 6;
        }
        return hsl.h = hue, hsl.s = saturation, hsl.l = lightness, hsl;
    },
    getStyle: function() {
        return "rgb(" + (255 * this.r | 0) + "," + (255 * this.g | 0) + "," + (255 * this.b | 0) + ")";
    },
    offsetHSL: function(h, s, l) {
        var hsl = this.getHSL();
        return hsl.h += h, hsl.s += s, hsl.l += l, this.setHSL(hsl.h, hsl.s, hsl.l), this;
    },
    add: function(color) {
        return this.r += color.r, this.g += color.g, this.b += color.b, this;
    },
    addColors: function(color1, color2) {
        return this.r = color1.r + color2.r, this.g = color1.g + color2.g, this.b = color1.b + color2.b, 
        this;
    },
    addScalar: function(s) {
        return this.r += s, this.g += s, this.b += s, this;
    },
    multiply: function(color) {
        return this.r *= color.r, this.g *= color.g, this.b *= color.b, this;
    },
    multiplyScalar: function(s) {
        return this.r *= s, this.g *= s, this.b *= s, this;
    },
    lerp: function(color, alpha) {
        return this.r += (color.r - this.r) * alpha, this.g += (color.g - this.g) * alpha, 
        this.b += (color.b - this.b) * alpha, this;
    },
    equals: function(c) {
        return c.r === this.r && c.g === this.g && c.b === this.b;
    },
    fromArray: function(array, offset) {
        return void 0 === offset && (offset = 0), this.r = array[offset], this.g = array[offset + 1], 
        this.b = array[offset + 2], this;
    },
    toArray: function(array, offset) {
        return void 0 === array && (array = []), void 0 === offset && (offset = 0), array[offset] = this.r, 
        array[offset + 1] = this.g, array[offset + 2] = this.b, array;
    }
}, THREE.ColorKeywords = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074
}, THREE.Quaternion = function(x, y, z, w) {
    this._x = x || 0, this._y = y || 0, this._z = z || 0, this._w = void 0 !== w ? w : 1;
}, THREE.Quaternion.prototype = {
    constructor: THREE.Quaternion,
    get x() {
        return this._x;
    },
    set x(value) {
        this._x = value, this.onChangeCallback();
    },
    get y() {
        return this._y;
    },
    set y(value) {
        this._y = value, this.onChangeCallback();
    },
    get z() {
        return this._z;
    },
    set z(value) {
        this._z = value, this.onChangeCallback();
    },
    get w() {
        return this._w;
    },
    set w(value) {
        this._w = value, this.onChangeCallback();
    },
    set: function(x, y, z, w) {
        return this._x = x, this._y = y, this._z = z, this._w = w, this.onChangeCallback(), 
        this;
    },
    clone: function() {
        return new this.constructor(this._x, this._y, this._z, this._w);
    },
    copy: function(quaternion) {
        return this._x = quaternion.x, this._y = quaternion.y, this._z = quaternion.z, this._w = quaternion.w, 
        this.onChangeCallback(), this;
    },
    setFromEuler: function(euler, update) {
        if (euler instanceof THREE.Euler == !1) throw new Error("THREE.Quaternion: .setFromEuler() now expects a Euler rotation rather than a Vector3 and order.");
        var c1 = Math.cos(euler._x / 2), c2 = Math.cos(euler._y / 2), c3 = Math.cos(euler._z / 2), s1 = Math.sin(euler._x / 2), s2 = Math.sin(euler._y / 2), s3 = Math.sin(euler._z / 2), order = euler.order;
        return "XYZ" === order ? (this._x = s1 * c2 * c3 + c1 * s2 * s3, this._y = c1 * s2 * c3 - s1 * c2 * s3, 
        this._z = c1 * c2 * s3 + s1 * s2 * c3, this._w = c1 * c2 * c3 - s1 * s2 * s3) : "YXZ" === order ? (this._x = s1 * c2 * c3 + c1 * s2 * s3, 
        this._y = c1 * s2 * c3 - s1 * c2 * s3, this._z = c1 * c2 * s3 - s1 * s2 * c3, this._w = c1 * c2 * c3 + s1 * s2 * s3) : "ZXY" === order ? (this._x = s1 * c2 * c3 - c1 * s2 * s3, 
        this._y = c1 * s2 * c3 + s1 * c2 * s3, this._z = c1 * c2 * s3 + s1 * s2 * c3, this._w = c1 * c2 * c3 - s1 * s2 * s3) : "ZYX" === order ? (this._x = s1 * c2 * c3 - c1 * s2 * s3, 
        this._y = c1 * s2 * c3 + s1 * c2 * s3, this._z = c1 * c2 * s3 - s1 * s2 * c3, this._w = c1 * c2 * c3 + s1 * s2 * s3) : "YZX" === order ? (this._x = s1 * c2 * c3 + c1 * s2 * s3, 
        this._y = c1 * s2 * c3 + s1 * c2 * s3, this._z = c1 * c2 * s3 - s1 * s2 * c3, this._w = c1 * c2 * c3 - s1 * s2 * s3) : "XZY" === order && (this._x = s1 * c2 * c3 - c1 * s2 * s3, 
        this._y = c1 * s2 * c3 - s1 * c2 * s3, this._z = c1 * c2 * s3 + s1 * s2 * c3, this._w = c1 * c2 * c3 + s1 * s2 * s3), 
        update !== !1 && this.onChangeCallback(), this;
    },
    setFromAxisAngle: function(axis, angle) {
        var halfAngle = angle / 2, s = Math.sin(halfAngle);
        return this._x = axis.x * s, this._y = axis.y * s, this._z = axis.z * s, this._w = Math.cos(halfAngle), 
        this.onChangeCallback(), this;
    },
    setFromRotationMatrix: function(m) {
        var s, te = m.elements, m11 = te[0], m12 = te[4], m13 = te[8], m21 = te[1], m22 = te[5], m23 = te[9], m31 = te[2], m32 = te[6], m33 = te[10], trace = m11 + m22 + m33;
        return trace > 0 ? (s = .5 / Math.sqrt(trace + 1), this._w = .25 / s, this._x = (m32 - m23) * s, 
        this._y = (m13 - m31) * s, this._z = (m21 - m12) * s) : m11 > m22 && m11 > m33 ? (s = 2 * Math.sqrt(1 + m11 - m22 - m33), 
        this._w = (m32 - m23) / s, this._x = .25 * s, this._y = (m12 + m21) / s, this._z = (m13 + m31) / s) : m22 > m33 ? (s = 2 * Math.sqrt(1 + m22 - m11 - m33), 
        this._w = (m13 - m31) / s, this._x = (m12 + m21) / s, this._y = .25 * s, this._z = (m23 + m32) / s) : (s = 2 * Math.sqrt(1 + m33 - m11 - m22), 
        this._w = (m21 - m12) / s, this._x = (m13 + m31) / s, this._y = (m23 + m32) / s, 
        this._z = .25 * s), this.onChangeCallback(), this;
    },
    setFromUnitVectors: function() {
        var v1, r, EPS = 1e-6;
        return function(vFrom, vTo) {
            return void 0 === v1 && (v1 = new THREE.Vector3()), r = vFrom.dot(vTo) + 1, EPS > r ? (r = 0, 
            Math.abs(vFrom.x) > Math.abs(vFrom.z) ? v1.set(-vFrom.y, vFrom.x, 0) : v1.set(0, -vFrom.z, vFrom.y)) : v1.crossVectors(vFrom, vTo), 
            this._x = v1.x, this._y = v1.y, this._z = v1.z, this._w = r, this.normalize(), this;
        };
    }(),
    inverse: function() {
        return this.conjugate().normalize(), this;
    },
    conjugate: function() {
        return this._x *= -1, this._y *= -1, this._z *= -1, this.onChangeCallback(), this;
    },
    dot: function(v) {
        return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;
    },
    lengthSq: function() {
        return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
    },
    length: function() {
        return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
    },
    normalize: function() {
        var l = this.length();
        return 0 === l ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (l = 1 / l, 
        this._x = this._x * l, this._y = this._y * l, this._z = this._z * l, this._w = this._w * l), 
        this.onChangeCallback(), this;
    },
    multiply: function(q, p) {
        return void 0 !== p ? (console.warn("THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead."), 
        this.multiplyQuaternions(q, p)) : this.multiplyQuaternions(this, q);
    },
    multiplyQuaternions: function(a, b) {
        var qax = a._x, qay = a._y, qaz = a._z, qaw = a._w, qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;
        return this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby, this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz, 
        this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx, this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz, 
        this.onChangeCallback(), this;
    },
    multiplyVector3: function(vector) {
        return console.warn("THREE.Quaternion: .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead."), 
        vector.applyQuaternion(this);
    },
    slerp: function(qb, t) {
        if (0 === t) return this;
        if (1 === t) return this.copy(qb);
        var x = this._x, y = this._y, z = this._z, w = this._w, cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;
        if (0 > cosHalfTheta ? (this._w = -qb._w, this._x = -qb._x, this._y = -qb._y, this._z = -qb._z, 
        cosHalfTheta = -cosHalfTheta) : this.copy(qb), cosHalfTheta >= 1) return this._w = w, 
        this._x = x, this._y = y, this._z = z, this;
        var halfTheta = Math.acos(cosHalfTheta), sinHalfTheta = Math.sqrt(1 - cosHalfTheta * cosHalfTheta);
        if (Math.abs(sinHalfTheta) < .001) return this._w = .5 * (w + this._w), this._x = .5 * (x + this._x), 
        this._y = .5 * (y + this._y), this._z = .5 * (z + this._z), this;
        var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta, ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
        return this._w = w * ratioA + this._w * ratioB, this._x = x * ratioA + this._x * ratioB, 
        this._y = y * ratioA + this._y * ratioB, this._z = z * ratioA + this._z * ratioB, 
        this.onChangeCallback(), this;
    },
    equals: function(quaternion) {
        return quaternion._x === this._x && quaternion._y === this._y && quaternion._z === this._z && quaternion._w === this._w;
    },
    fromArray: function(array, offset) {
        return void 0 === offset && (offset = 0), this._x = array[offset], this._y = array[offset + 1], 
        this._z = array[offset + 2], this._w = array[offset + 3], this.onChangeCallback(), 
        this;
    },
    toArray: function(array, offset) {
        return void 0 === array && (array = []), void 0 === offset && (offset = 0), array[offset] = this._x, 
        array[offset + 1] = this._y, array[offset + 2] = this._z, array[offset + 3] = this._w, 
        array;
    },
    onChange: function(callback) {
        return this.onChangeCallback = callback, this;
    },
    onChangeCallback: function() {}
}, THREE.Quaternion.slerp = function(qa, qb, qm, t) {
    return qm.copy(qa).slerp(qb, t);
}, THREE.Vector2 = function(x, y) {
    this.x = x || 0, this.y = y || 0;
}, THREE.Vector2.prototype = {
    constructor: THREE.Vector2,
    get width() {
        return this.x;
    },
    set width(value) {
        this.x = value;
    },
    get height() {
        return this.y;
    },
    set height(value) {
        this.y = value;
    },
    set: function(x, y) {
        return this.x = x, this.y = y, this;
    },
    setX: function(x) {
        return this.x = x, this;
    },
    setY: function(y) {
        return this.y = y, this;
    },
    setComponent: function(index, value) {
        switch (index) {
          case 0:
            this.x = value;
            break;

          case 1:
            this.y = value;
            break;

          default:
            throw new Error("index is out of range: " + index);
        }
    },
    getComponent: function(index) {
        switch (index) {
          case 0:
            return this.x;

          case 1:
            return this.y;

          default:
            throw new Error("index is out of range: " + index);
        }
    },
    clone: function() {
        return new this.constructor(this.x, this.y);
    },
    copy: function(v) {
        return this.x = v.x, this.y = v.y, this;
    },
    add: function(v, w) {
        return void 0 !== w ? (console.warn("THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead."), 
        this.addVectors(v, w)) : (this.x += v.x, this.y += v.y, this);
    },
    addScalar: function(s) {
        return this.x += s, this.y += s, this;
    },
    addVectors: function(a, b) {
        return this.x = a.x + b.x, this.y = a.y + b.y, this;
    },
    addScaledVector: function(v, s) {
        return this.x += v.x * s, this.y += v.y * s, this;
    },
    sub: function(v, w) {
        return void 0 !== w ? (console.warn("THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."), 
        this.subVectors(v, w)) : (this.x -= v.x, this.y -= v.y, this);
    },
    subScalar: function(s) {
        return this.x -= s, this.y -= s, this;
    },
    subVectors: function(a, b) {
        return this.x = a.x - b.x, this.y = a.y - b.y, this;
    },
    multiply: function(v) {
        return this.x *= v.x, this.y *= v.y, this;
    },
    multiplyScalar: function(scalar) {
        return isFinite(scalar) ? (this.x *= scalar, this.y *= scalar) : (this.x = 0, this.y = 0), 
        this;
    },
    divide: function(v) {
        return this.x /= v.x, this.y /= v.y, this;
    },
    divideScalar: function(scalar) {
        return this.multiplyScalar(1 / scalar);
    },
    min: function(v) {
        return this.x = Math.min(this.x, v.x), this.y = Math.min(this.y, v.y), this;
    },
    max: function(v) {
        return this.x = Math.max(this.x, v.x), this.y = Math.max(this.y, v.y), this;
    },
    clamp: function(min, max) {
        return this.x = Math.max(min.x, Math.min(max.x, this.x)), this.y = Math.max(min.y, Math.min(max.y, this.y)), 
        this;
    },
    clampScalar: function() {
        var min, max;
        return function(minVal, maxVal) {
            return void 0 === min && (min = new THREE.Vector2(), max = new THREE.Vector2()), 
            min.set(minVal, minVal), max.set(maxVal, maxVal), this.clamp(min, max);
        };
    }(),
    clampLength: function(min, max) {
        var length = this.length();
        return this.multiplyScalar(Math.max(min, Math.min(max, length)) / length), this;
    },
    floor: function() {
        return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
    },
    ceil: function() {
        return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
    },
    round: function() {
        return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
    },
    roundToZero: function() {
        return this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x), this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y), 
        this;
    },
    negate: function() {
        return this.x = -this.x, this.y = -this.y, this;
    },
    dot: function(v) {
        return this.x * v.x + this.y * v.y;
    },
    lengthSq: function() {
        return this.x * this.x + this.y * this.y;
    },
    length: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    lengthManhattan: function() {
        return Math.abs(this.x) + Math.abs(this.y);
    },
    normalize: function() {
        return this.divideScalar(this.length());
    },
    distanceTo: function(v) {
        return Math.sqrt(this.distanceToSquared(v));
    },
    distanceToSquared: function(v) {
        var dx = this.x - v.x, dy = this.y - v.y;
        return dx * dx + dy * dy;
    },
    setLength: function(length) {
        return this.multiplyScalar(length / this.length());
    },
    lerp: function(v, alpha) {
        return this.x += (v.x - this.x) * alpha, this.y += (v.y - this.y) * alpha, this;
    },
    lerpVectors: function(v1, v2, alpha) {
        return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1), this;
    },
    equals: function(v) {
        return v.x === this.x && v.y === this.y;
    },
    fromArray: function(array, offset) {
        return void 0 === offset && (offset = 0), this.x = array[offset], this.y = array[offset + 1], 
        this;
    },
    toArray: function(array, offset) {
        return void 0 === array && (array = []), void 0 === offset && (offset = 0), array[offset] = this.x, 
        array[offset + 1] = this.y, array;
    },
    fromAttribute: function(attribute, index, offset) {
        return void 0 === offset && (offset = 0), index = index * attribute.itemSize + offset, 
        this.x = attribute.array[index], this.y = attribute.array[index + 1], this;
    },
    rotateAround: function(center, angle) {
        var c = Math.cos(angle), s = Math.sin(angle), x = this.x - center.x, y = this.y - center.y;
        return this.x = x * c - y * s + center.x, this.y = x * s + y * c + center.y, this;
    }
}, THREE.Vector3 = function(x, y, z) {
    this.x = x || 0, this.y = y || 0, this.z = z || 0;
}, THREE.Vector3.prototype = {
    constructor: THREE.Vector3,
    set: function(x, y, z) {
        return this.x = x, this.y = y, this.z = z, this;
    },
    setX: function(x) {
        return this.x = x, this;
    },
    setY: function(y) {
        return this.y = y, this;
    },
    setZ: function(z) {
        return this.z = z, this;
    },
    setComponent: function(index, value) {
        switch (index) {
          case 0:
            this.x = value;
            break;

          case 1:
            this.y = value;
            break;

          case 2:
            this.z = value;
            break;

          default:
            throw new Error("index is out of range: " + index);
        }
    },
    getComponent: function(index) {
        switch (index) {
          case 0:
            return this.x;

          case 1:
            return this.y;

          case 2:
            return this.z;

          default:
            throw new Error("index is out of range: " + index);
        }
    },
    clone: function() {
        return new this.constructor(this.x, this.y, this.z);
    },
    copy: function(v) {
        return this.x = v.x, this.y = v.y, this.z = v.z, this;
    },
    add: function(v, w) {
        return void 0 !== w ? (console.warn("THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead."), 
        this.addVectors(v, w)) : (this.x += v.x, this.y += v.y, this.z += v.z, this);
    },
    addScalar: function(s) {
        return this.x += s, this.y += s, this.z += s, this;
    },
    addVectors: function(a, b) {
        return this.x = a.x + b.x, this.y = a.y + b.y, this.z = a.z + b.z, this;
    },
    addScaledVector: function(v, s) {
        return this.x += v.x * s, this.y += v.y * s, this.z += v.z * s, this;
    },
    sub: function(v, w) {
        return void 0 !== w ? (console.warn("THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."), 
        this.subVectors(v, w)) : (this.x -= v.x, this.y -= v.y, this.z -= v.z, this);
    },
    subScalar: function(s) {
        return this.x -= s, this.y -= s, this.z -= s, this;
    },
    subVectors: function(a, b) {
        return this.x = a.x - b.x, this.y = a.y - b.y, this.z = a.z - b.z, this;
    },
    multiply: function(v, w) {
        return void 0 !== w ? (console.warn("THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead."), 
        this.multiplyVectors(v, w)) : (this.x *= v.x, this.y *= v.y, this.z *= v.z, this);
    },
    multiplyScalar: function(scalar) {
        return isFinite(scalar) ? (this.x *= scalar, this.y *= scalar, this.z *= scalar) : (this.x = 0, 
        this.y = 0, this.z = 0), this;
    },
    multiplyVectors: function(a, b) {
        return this.x = a.x * b.x, this.y = a.y * b.y, this.z = a.z * b.z, this;
    },
    applyEuler: function() {
        var quaternion;
        return function(euler) {
            return euler instanceof THREE.Euler == !1 && console.error("THREE.Vector3: .applyEuler() now expects a Euler rotation rather than a Vector3 and order."), 
            void 0 === quaternion && (quaternion = new THREE.Quaternion()), this.applyQuaternion(quaternion.setFromEuler(euler)), 
            this;
        };
    }(),
    applyAxisAngle: function() {
        var quaternion;
        return function(axis, angle) {
            return void 0 === quaternion && (quaternion = new THREE.Quaternion()), this.applyQuaternion(quaternion.setFromAxisAngle(axis, angle)), 
            this;
        };
    }(),
    applyMatrix3: function(m) {
        var x = this.x, y = this.y, z = this.z, e = m.elements;
        return this.x = e[0] * x + e[3] * y + e[6] * z, this.y = e[1] * x + e[4] * y + e[7] * z, 
        this.z = e[2] * x + e[5] * y + e[8] * z, this;
    },
    applyMatrix4: function(m) {
        var x = this.x, y = this.y, z = this.z, e = m.elements;
        return this.x = e[0] * x + e[4] * y + e[8] * z + e[12], this.y = e[1] * x + e[5] * y + e[9] * z + e[13], 
        this.z = e[2] * x + e[6] * y + e[10] * z + e[14], this;
    },
    applyProjection: function(m) {
        var x = this.x, y = this.y, z = this.z, e = m.elements, d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
        return this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d, this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d, 
        this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d, this;
    },
    applyQuaternion: function(q) {
        var x = this.x, y = this.y, z = this.z, qx = q.x, qy = q.y, qz = q.z, qw = q.w, ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
        return this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy, this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz, 
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx, this;
    },
    project: function() {
        var matrix;
        return function(camera) {
            return void 0 === matrix && (matrix = new THREE.Matrix4()), matrix.multiplyMatrices(camera.projectionMatrix, matrix.getInverse(camera.matrixWorld)), 
            this.applyProjection(matrix);
        };
    }(),
    unproject: function() {
        var matrix;
        return function(camera) {
            return void 0 === matrix && (matrix = new THREE.Matrix4()), matrix.multiplyMatrices(camera.matrixWorld, matrix.getInverse(camera.projectionMatrix)), 
            this.applyProjection(matrix);
        };
    }(),
    transformDirection: function(m) {
        var x = this.x, y = this.y, z = this.z, e = m.elements;
        return this.x = e[0] * x + e[4] * y + e[8] * z, this.y = e[1] * x + e[5] * y + e[9] * z, 
        this.z = e[2] * x + e[6] * y + e[10] * z, this.normalize(), this;
    },
    divide: function(v) {
        return this.x /= v.x, this.y /= v.y, this.z /= v.z, this;
    },
    divideScalar: function(scalar) {
        return this.multiplyScalar(1 / scalar);
    },
    min: function(v) {
        return this.x = Math.min(this.x, v.x), this.y = Math.min(this.y, v.y), this.z = Math.min(this.z, v.z), 
        this;
    },
    max: function(v) {
        return this.x = Math.max(this.x, v.x), this.y = Math.max(this.y, v.y), this.z = Math.max(this.z, v.z), 
        this;
    },
    clamp: function(min, max) {
        return this.x = Math.max(min.x, Math.min(max.x, this.x)), this.y = Math.max(min.y, Math.min(max.y, this.y)), 
        this.z = Math.max(min.z, Math.min(max.z, this.z)), this;
    },
    clampScalar: function() {
        var min, max;
        return function(minVal, maxVal) {
            return void 0 === min && (min = new THREE.Vector3(), max = new THREE.Vector3()), 
            min.set(minVal, minVal, minVal), max.set(maxVal, maxVal, maxVal), this.clamp(min, max);
        };
    }(),
    clampLength: function(min, max) {
        var length = this.length();
        return this.multiplyScalar(Math.max(min, Math.min(max, length)) / length), this;
    },
    floor: function() {
        return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), 
        this;
    },
    ceil: function() {
        return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), 
        this;
    },
    round: function() {
        return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), 
        this;
    },
    roundToZero: function() {
        return this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x), this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y), 
        this.z = this.z < 0 ? Math.ceil(this.z) : Math.floor(this.z), this;
    },
    negate: function() {
        return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
    },
    dot: function(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    },
    lengthSq: function() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    },
    length: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },
    lengthManhattan: function() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    },
    normalize: function() {
        return this.divideScalar(this.length());
    },
    setLength: function(length) {
        return this.multiplyScalar(length / this.length());
    },
    lerp: function(v, alpha) {
        return this.x += (v.x - this.x) * alpha, this.y += (v.y - this.y) * alpha, this.z += (v.z - this.z) * alpha, 
        this;
    },
    lerpVectors: function(v1, v2, alpha) {
        return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1), this;
    },
    cross: function(v, w) {
        if (void 0 !== w) return console.warn("THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead."), 
        this.crossVectors(v, w);
        var x = this.x, y = this.y, z = this.z;
        return this.x = y * v.z - z * v.y, this.y = z * v.x - x * v.z, this.z = x * v.y - y * v.x, 
        this;
    },
    crossVectors: function(a, b) {
        var ax = a.x, ay = a.y, az = a.z, bx = b.x, by = b.y, bz = b.z;
        return this.x = ay * bz - az * by, this.y = az * bx - ax * bz, this.z = ax * by - ay * bx, 
        this;
    },
    projectOnVector: function() {
        var v1, dot;
        return function(vector) {
            return void 0 === v1 && (v1 = new THREE.Vector3()), v1.copy(vector).normalize(), 
            dot = this.dot(v1), this.copy(v1).multiplyScalar(dot);
        };
    }(),
    projectOnPlane: function() {
        var v1;
        return function(planeNormal) {
            return void 0 === v1 && (v1 = new THREE.Vector3()), v1.copy(this).projectOnVector(planeNormal), 
            this.sub(v1);
        };
    }(),
    reflect: function() {
        var v1;
        return function(normal) {
            return void 0 === v1 && (v1 = new THREE.Vector3()), this.sub(v1.copy(normal).multiplyScalar(2 * this.dot(normal)));
        };
    }(),
    angleTo: function(v) {
        var theta = this.dot(v) / (this.length() * v.length());
        return Math.acos(THREE.Math.clamp(theta, -1, 1));
    },
    distanceTo: function(v) {
        return Math.sqrt(this.distanceToSquared(v));
    },
    distanceToSquared: function(v) {
        var dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
        return dx * dx + dy * dy + dz * dz;
    },
    setEulerFromRotationMatrix: function(m, order) {
        console.error("THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.");
    },
    setEulerFromQuaternion: function(q, order) {
        console.error("THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.");
    },
    getPositionFromMatrix: function(m) {
        return console.warn("THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition()."), 
        this.setFromMatrixPosition(m);
    },
    getScaleFromMatrix: function(m) {
        return console.warn("THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale()."), 
        this.setFromMatrixScale(m);
    },
    getColumnFromMatrix: function(index, matrix) {
        return console.warn("THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn()."), 
        this.setFromMatrixColumn(index, matrix);
    },
    setFromMatrixPosition: function(m) {
        return this.x = m.elements[12], this.y = m.elements[13], this.z = m.elements[14], 
        this;
    },
    setFromMatrixScale: function(m) {
        var sx = this.set(m.elements[0], m.elements[1], m.elements[2]).length(), sy = this.set(m.elements[4], m.elements[5], m.elements[6]).length(), sz = this.set(m.elements[8], m.elements[9], m.elements[10]).length();
        return this.x = sx, this.y = sy, this.z = sz, this;
    },
    setFromMatrixColumn: function(index, matrix) {
        var offset = 4 * index, me = matrix.elements;
        return this.x = me[offset], this.y = me[offset + 1], this.z = me[offset + 2], this;
    },
    equals: function(v) {
        return v.x === this.x && v.y === this.y && v.z === this.z;
    },
    fromArray: function(array, offset) {
        return void 0 === offset && (offset = 0), this.x = array[offset], this.y = array[offset + 1], 
        this.z = array[offset + 2], this;
    },
    toArray: function(array, offset) {
        return void 0 === array && (array = []), void 0 === offset && (offset = 0), array[offset] = this.x, 
        array[offset + 1] = this.y, array[offset + 2] = this.z, array;
    },
    fromAttribute: function(attribute, index, offset) {
        return void 0 === offset && (offset = 0), index = index * attribute.itemSize + offset, 
        this.x = attribute.array[index], this.y = attribute.array[index + 1], this.z = attribute.array[index + 2], 
        this;
    }
}, THREE.Vector4 = function(x, y, z, w) {
    this.x = x || 0, this.y = y || 0, this.z = z || 0, this.w = void 0 !== w ? w : 1;
}, THREE.Vector4.prototype = {
    constructor: THREE.Vector4,
    set: function(x, y, z, w) {
        return this.x = x, this.y = y, this.z = z, this.w = w, this;
    },
    setX: function(x) {
        return this.x = x, this;
    },
    setY: function(y) {
        return this.y = y, this;
    },
    setZ: function(z) {
        return this.z = z, this;
    },
    setW: function(w) {
        return this.w = w, this;
    },
    setComponent: function(index, value) {
        switch (index) {
          case 0:
            this.x = value;
            break;

          case 1:
            this.y = value;
            break;

          case 2:
            this.z = value;
            break;

          case 3:
            this.w = value;
            break;

          default:
            throw new Error("index is out of range: " + index);
        }
    },
    getComponent: function(index) {
        switch (index) {
          case 0:
            return this.x;

          case 1:
            return this.y;

          case 2:
            return this.z;

          case 3:
            return this.w;

          default:
            throw new Error("index is out of range: " + index);
        }
    },
    clone: function() {
        return new this.constructor(this.x, this.y, this.z, this.w);
    },
    copy: function(v) {
        return this.x = v.x, this.y = v.y, this.z = v.z, this.w = void 0 !== v.w ? v.w : 1, 
        this;
    },
    add: function(v, w) {
        return void 0 !== w ? (console.warn("THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead."), 
        this.addVectors(v, w)) : (this.x += v.x, this.y += v.y, this.z += v.z, this.w += v.w, 
        this);
    },
    addScalar: function(s) {
        return this.x += s, this.y += s, this.z += s, this.w += s, this;
    },
    addVectors: function(a, b) {
        return this.x = a.x + b.x, this.y = a.y + b.y, this.z = a.z + b.z, this.w = a.w + b.w, 
        this;
    },
    addScaledVector: function(v, s) {
        return this.x += v.x * s, this.y += v.y * s, this.z += v.z * s, this.w += v.w * s, 
        this;
    },
    sub: function(v, w) {
        return void 0 !== w ? (console.warn("THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."), 
        this.subVectors(v, w)) : (this.x -= v.x, this.y -= v.y, this.z -= v.z, this.w -= v.w, 
        this);
    },
    subScalar: function(s) {
        return this.x -= s, this.y -= s, this.z -= s, this.w -= s, this;
    },
    subVectors: function(a, b) {
        return this.x = a.x - b.x, this.y = a.y - b.y, this.z = a.z - b.z, this.w = a.w - b.w, 
        this;
    },
    multiplyScalar: function(scalar) {
        return isFinite(scalar) ? (this.x *= scalar, this.y *= scalar, this.z *= scalar, 
        this.w *= scalar) : (this.x = 0, this.y = 0, this.z = 0, this.w = 0), this;
    },
    applyMatrix4: function(m) {
        var x = this.x, y = this.y, z = this.z, w = this.w, e = m.elements;
        return this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w, this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w, 
        this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w, this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w, 
        this;
    },
    divideScalar: function(scalar) {
        return this.multiplyScalar(1 / scalar);
    },
    setAxisAngleFromQuaternion: function(q) {
        this.w = 2 * Math.acos(q.w);
        var s = Math.sqrt(1 - q.w * q.w);
        return 1e-4 > s ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = q.x / s, this.y = q.y / s, 
        this.z = q.z / s), this;
    },
    setAxisAngleFromRotationMatrix: function(m) {
        var angle, x, y, z, epsilon = .01, epsilon2 = .1, te = m.elements, m11 = te[0], m12 = te[4], m13 = te[8], m21 = te[1], m22 = te[5], m23 = te[9], m31 = te[2], m32 = te[6], m33 = te[10];
        if (Math.abs(m12 - m21) < epsilon && Math.abs(m13 - m31) < epsilon && Math.abs(m23 - m32) < epsilon) {
            if (Math.abs(m12 + m21) < epsilon2 && Math.abs(m13 + m31) < epsilon2 && Math.abs(m23 + m32) < epsilon2 && Math.abs(m11 + m22 + m33 - 3) < epsilon2) return this.set(1, 0, 0, 0), 
            this;
            angle = Math.PI;
            var xx = (m11 + 1) / 2, yy = (m22 + 1) / 2, zz = (m33 + 1) / 2, xy = (m12 + m21) / 4, xz = (m13 + m31) / 4, yz = (m23 + m32) / 4;
            return xx > yy && xx > zz ? epsilon > xx ? (x = 0, y = .707106781, z = .707106781) : (x = Math.sqrt(xx), 
            y = xy / x, z = xz / x) : yy > zz ? epsilon > yy ? (x = .707106781, y = 0, z = .707106781) : (y = Math.sqrt(yy), 
            x = xy / y, z = yz / y) : epsilon > zz ? (x = .707106781, y = .707106781, z = 0) : (z = Math.sqrt(zz), 
            x = xz / z, y = yz / z), this.set(x, y, z, angle), this;
        }
        var s = Math.sqrt((m32 - m23) * (m32 - m23) + (m13 - m31) * (m13 - m31) + (m21 - m12) * (m21 - m12));
        return Math.abs(s) < .001 && (s = 1), this.x = (m32 - m23) / s, this.y = (m13 - m31) / s, 
        this.z = (m21 - m12) / s, this.w = Math.acos((m11 + m22 + m33 - 1) / 2), this;
    },
    min: function(v) {
        return this.x = Math.min(this.x, v.x), this.y = Math.min(this.y, v.y), this.z = Math.min(this.z, v.z), 
        this.w = Math.min(this.w, v.w), this;
    },
    max: function(v) {
        return this.x = Math.max(this.x, v.x), this.y = Math.max(this.y, v.y), this.z = Math.max(this.z, v.z), 
        this.w = Math.max(this.w, v.w), this;
    },
    clamp: function(min, max) {
        return this.x = Math.max(min.x, Math.min(max.x, this.x)), this.y = Math.max(min.y, Math.min(max.y, this.y)), 
        this.z = Math.max(min.z, Math.min(max.z, this.z)), this.w = Math.max(min.w, Math.min(max.w, this.w)), 
        this;
    },
    clampScalar: function() {
        var min, max;
        return function(minVal, maxVal) {
            return void 0 === min && (min = new THREE.Vector4(), max = new THREE.Vector4()), 
            min.set(minVal, minVal, minVal, minVal), max.set(maxVal, maxVal, maxVal, maxVal), 
            this.clamp(min, max);
        };
    }(),
    floor: function() {
        return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), 
        this.w = Math.floor(this.w), this;
    },
    ceil: function() {
        return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), 
        this.w = Math.ceil(this.w), this;
    },
    round: function() {
        return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), 
        this.w = Math.round(this.w), this;
    },
    roundToZero: function() {
        return this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x), this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y), 
        this.z = this.z < 0 ? Math.ceil(this.z) : Math.floor(this.z), this.w = this.w < 0 ? Math.ceil(this.w) : Math.floor(this.w), 
        this;
    },
    negate: function() {
        return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this;
    },
    dot: function(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    },
    lengthSq: function() {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    },
    length: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    },
    lengthManhattan: function() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
    },
    normalize: function() {
        return this.divideScalar(this.length());
    },
    setLength: function(length) {
        return this.multiplyScalar(length / this.length());
    },
    lerp: function(v, alpha) {
        return this.x += (v.x - this.x) * alpha, this.y += (v.y - this.y) * alpha, this.z += (v.z - this.z) * alpha, 
        this.w += (v.w - this.w) * alpha, this;
    },
    lerpVectors: function(v1, v2, alpha) {
        return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1), this;
    },
    equals: function(v) {
        return v.x === this.x && v.y === this.y && v.z === this.z && v.w === this.w;
    },
    fromArray: function(array, offset) {
        return void 0 === offset && (offset = 0), this.x = array[offset], this.y = array[offset + 1], 
        this.z = array[offset + 2], this.w = array[offset + 3], this;
    },
    toArray: function(array, offset) {
        return void 0 === array && (array = []), void 0 === offset && (offset = 0), array[offset] = this.x, 
        array[offset + 1] = this.y, array[offset + 2] = this.z, array[offset + 3] = this.w, 
        array;
    },
    fromAttribute: function(attribute, index, offset) {
        return void 0 === offset && (offset = 0), index = index * attribute.itemSize + offset, 
        this.x = attribute.array[index], this.y = attribute.array[index + 1], this.z = attribute.array[index + 2], 
        this.w = attribute.array[index + 3], this;
    }
}, THREE.Euler = function(x, y, z, order) {
    this._x = x || 0, this._y = y || 0, this._z = z || 0, this._order = order || THREE.Euler.DefaultOrder;
}, THREE.Euler.RotationOrders = [ "XYZ", "YZX", "ZXY", "XZY", "YXZ", "ZYX" ], THREE.Euler.DefaultOrder = "XYZ", 
THREE.Euler.prototype = {
    constructor: THREE.Euler,
    get x() {
        return this._x;
    },
    set x(value) {
        this._x = value, this.onChangeCallback();
    },
    get y() {
        return this._y;
    },
    set y(value) {
        this._y = value, this.onChangeCallback();
    },
    get z() {
        return this._z;
    },
    set z(value) {
        this._z = value, this.onChangeCallback();
    },
    get order() {
        return this._order;
    },
    set order(value) {
        this._order = value, this.onChangeCallback();
    },
    set: function(x, y, z, order) {
        return this._x = x, this._y = y, this._z = z, this._order = order || this._order, 
        this.onChangeCallback(), this;
    },
    clone: function() {
        return new this.constructor(this._x, this._y, this._z, this._order);
    },
    copy: function(euler) {
        return this._x = euler._x, this._y = euler._y, this._z = euler._z, this._order = euler._order, 
        this.onChangeCallback(), this;
    },
    setFromRotationMatrix: function(m, order, update) {
        var clamp = THREE.Math.clamp, te = m.elements, m11 = te[0], m12 = te[4], m13 = te[8], m21 = te[1], m22 = te[5], m23 = te[9], m31 = te[2], m32 = te[6], m33 = te[10];
        return order = order || this._order, "XYZ" === order ? (this._y = Math.asin(clamp(m13, -1, 1)), 
        Math.abs(m13) < .99999 ? (this._x = Math.atan2(-m23, m33), this._z = Math.atan2(-m12, m11)) : (this._x = Math.atan2(m32, m22), 
        this._z = 0)) : "YXZ" === order ? (this._x = Math.asin(-clamp(m23, -1, 1)), Math.abs(m23) < .99999 ? (this._y = Math.atan2(m13, m33), 
        this._z = Math.atan2(m21, m22)) : (this._y = Math.atan2(-m31, m11), this._z = 0)) : "ZXY" === order ? (this._x = Math.asin(clamp(m32, -1, 1)), 
        Math.abs(m32) < .99999 ? (this._y = Math.atan2(-m31, m33), this._z = Math.atan2(-m12, m22)) : (this._y = 0, 
        this._z = Math.atan2(m21, m11))) : "ZYX" === order ? (this._y = Math.asin(-clamp(m31, -1, 1)), 
        Math.abs(m31) < .99999 ? (this._x = Math.atan2(m32, m33), this._z = Math.atan2(m21, m11)) : (this._x = 0, 
        this._z = Math.atan2(-m12, m22))) : "YZX" === order ? (this._z = Math.asin(clamp(m21, -1, 1)), 
        Math.abs(m21) < .99999 ? (this._x = Math.atan2(-m23, m22), this._y = Math.atan2(-m31, m11)) : (this._x = 0, 
        this._y = Math.atan2(m13, m33))) : "XZY" === order ? (this._z = Math.asin(-clamp(m12, -1, 1)), 
        Math.abs(m12) < .99999 ? (this._x = Math.atan2(m32, m22), this._y = Math.atan2(m13, m11)) : (this._x = Math.atan2(-m23, m33), 
        this._y = 0)) : console.warn("THREE.Euler: .setFromRotationMatrix() given unsupported order: " + order), 
        this._order = order, update !== !1 && this.onChangeCallback(), this;
    },
    setFromQuaternion: function() {
        var matrix;
        return function(q, order, update) {
            return void 0 === matrix && (matrix = new THREE.Matrix4()), matrix.makeRotationFromQuaternion(q), 
            this.setFromRotationMatrix(matrix, order, update), this;
        };
    }(),
    setFromVector3: function(v, order) {
        return this.set(v.x, v.y, v.z, order || this._order);
    },
    reorder: function() {
        var q = new THREE.Quaternion();
        return function(newOrder) {
            q.setFromEuler(this), this.setFromQuaternion(q, newOrder);
        };
    }(),
    equals: function(euler) {
        return euler._x === this._x && euler._y === this._y && euler._z === this._z && euler._order === this._order;
    },
    fromArray: function(array) {
        return this._x = array[0], this._y = array[1], this._z = array[2], void 0 !== array[3] && (this._order = array[3]), 
        this.onChangeCallback(), this;
    },
    toArray: function(array, offset) {
        return void 0 === array && (array = []), void 0 === offset && (offset = 0), array[offset] = this._x, 
        array[offset + 1] = this._y, array[offset + 2] = this._z, array[offset + 3] = this._order, 
        array;
    },
    toVector3: function(optionalResult) {
        return optionalResult ? optionalResult.set(this._x, this._y, this._z) : new THREE.Vector3(this._x, this._y, this._z);
    },
    onChange: function(callback) {
        return this.onChangeCallback = callback, this;
    },
    onChangeCallback: function() {}
}, THREE.Line3 = function(start, end) {
    this.start = void 0 !== start ? start : new THREE.Vector3(), this.end = void 0 !== end ? end : new THREE.Vector3();
}, THREE.Line3.prototype = {
    constructor: THREE.Line3,
    set: function(start, end) {
        return this.start.copy(start), this.end.copy(end), this;
    },
    clone: function() {
        return new this.constructor().copy(this);
    },
    copy: function(line) {
        return this.start.copy(line.start), this.end.copy(line.end), this;
    },
    center: function(optionalTarget) {
        var result = optionalTarget || new THREE.Vector3();
        return result.addVectors(this.start, this.end).multiplyScalar(.5);
    },
    delta: function(optionalTarget) {
        var result = optionalTarget || new THREE.Vector3();
        return result.subVectors(this.end, this.start);
    },
    distanceSq: function() {
        return this.start.distanceToSquared(this.end);
    },
    distance: function() {
        return this.start.distanceTo(this.end);
    },
    at: function(t, optionalTarget) {
        var result = optionalTarget || new THREE.Vector3();
        return this.delta(result).multiplyScalar(t).add(this.start);
    },
    closestPointToPointParameter: function() {
        var startP = new THREE.Vector3(), startEnd = new THREE.Vector3();
        return function(point, clampToLine) {
            startP.subVectors(point, this.start), startEnd.subVectors(this.end, this.start);
            var startEnd2 = startEnd.dot(startEnd), startEnd_startP = startEnd.dot(startP), t = startEnd_startP / startEnd2;
            return clampToLine && (t = THREE.Math.clamp(t, 0, 1)), t;
        };
    }(),
    closestPointToPoint: function(point, clampToLine, optionalTarget) {
        var t = this.closestPointToPointParameter(point, clampToLine), result = optionalTarget || new THREE.Vector3();
        return this.delta(result).multiplyScalar(t).add(this.start);
    },
    applyMatrix4: function(matrix) {
        return this.start.applyMatrix4(matrix), this.end.applyMatrix4(matrix), this;
    },
    equals: function(line) {
        return line.start.equals(this.start) && line.end.equals(this.end);
    }
}, THREE.Box2 = function(min, max) {
    this.min = void 0 !== min ? min : new THREE.Vector2(1 / 0, 1 / 0), this.max = void 0 !== max ? max : new THREE.Vector2(-(1 / 0), -(1 / 0));
}, THREE.Box2.prototype = {
    constructor: THREE.Box2,
    set: function(min, max) {
        return this.min.copy(min), this.max.copy(max), this;
    },
    setFromPoints: function(points) {
        this.makeEmpty();
        for (var i = 0, il = points.length; il > i; i++) this.expandByPoint(points[i]);
        return this;
    },
    setFromCenterAndSize: function() {
        var v1 = new THREE.Vector2();
        return function(center, size) {
            var halfSize = v1.copy(size).multiplyScalar(.5);
            return this.min.copy(center).sub(halfSize), this.max.copy(center).add(halfSize), 
            this;
        };
    }(),
    clone: function() {
        return new this.constructor().copy(this);
    },
    copy: function(box) {
        return this.min.copy(box.min), this.max.copy(box.max), this;
    },
    makeEmpty: function() {
        return this.min.x = this.min.y = 1 / 0, this.max.x = this.max.y = -(1 / 0), this;
    },
    empty: function() {
        return this.max.x < this.min.x || this.max.y < this.min.y;
    },
    center: function(optionalTarget) {
        var result = optionalTarget || new THREE.Vector2();
        return result.addVectors(this.min, this.max).multiplyScalar(.5);
    },
    size: function(optionalTarget) {
        var result = optionalTarget || new THREE.Vector2();
        return result.subVectors(this.max, this.min);
    },
    expandByPoint: function(point) {
        return this.min.min(point), this.max.max(point), this;
    },
    expandByVector: function(vector) {
        return this.min.sub(vector), this.max.add(vector), this;
    },
    expandByScalar: function(scalar) {
        return this.min.addScalar(-scalar), this.max.addScalar(scalar), this;
    },
    containsPoint: function(point) {
        return point.x < this.min.x || point.x > this.max.x || point.y < this.min.y || point.y > this.max.y ? !1 : !0;
    },
    containsBox: function(box) {
        return this.min.x <= box.min.x && box.max.x <= this.max.x && this.min.y <= box.min.y && box.max.y <= this.max.y ? !0 : !1;
    },
    getParameter: function(point, optionalTarget) {
        var result = optionalTarget || new THREE.Vector2();
        return result.set((point.x - this.min.x) / (this.max.x - this.min.x), (point.y - this.min.y) / (this.max.y - this.min.y));
    },
    isIntersectionBox: function(box) {
        return box.max.x < this.min.x || box.min.x > this.max.x || box.max.y < this.min.y || box.min.y > this.max.y ? !1 : !0;
    },
    clampPoint: function(point, optionalTarget) {
        var result = optionalTarget || new THREE.Vector2();
        return result.copy(point).clamp(this.min, this.max);
    },
    distanceToPoint: function() {
        var v1 = new THREE.Vector2();
        return function(point) {
            var clampedPoint = v1.copy(point).clamp(this.min, this.max);
            return clampedPoint.sub(point).length();
        };
    }(),
    intersect: function(box) {
        return this.min.max(box.min), this.max.min(box.max), this;
    },
    union: function(box) {
        return this.min.min(box.min), this.max.max(box.max), this;
    },
    translate: function(offset) {
        return this.min.add(offset), this.max.add(offset), this;
    },
    equals: function(box) {
        return box.min.equals(this.min) && box.max.equals(this.max);
    }
}, THREE.Box3 = function(min, max) {
    this.min = void 0 !== min ? min : new THREE.Vector3(1 / 0, 1 / 0, 1 / 0), this.max = void 0 !== max ? max : new THREE.Vector3(-(1 / 0), -(1 / 0), -(1 / 0));
}, THREE.Box3.prototype = {
    constructor: THREE.Box3,
    set: function(min, max) {
        return this.min.copy(min), this.max.copy(max), this;
    },
    setFromPoints: function(points) {
        this.makeEmpty();
        for (var i = 0, il = points.length; il > i; i++) this.expandByPoint(points[i]);
        return this;
    },
    setFromCenterAndSize: function() {
        var v1 = new THREE.Vector3();
        return function(center, size) {
            var halfSize = v1.copy(size).multiplyScalar(.5);
            return this.min.copy(center).sub(halfSize), this.max.copy(center).add(halfSize), 
            this;
        };
    }(),
    setFromObject: function() {
        var v1 = new THREE.Vector3();
        return function(object) {
            var scope = this;
            return object.updateMatrixWorld(!0), this.makeEmpty(), object.traverse(function(node) {
                var geometry = node.geometry;
                if (void 0 !== geometry) if (geometry instanceof THREE.Geometry) for (var vertices = geometry.vertices, i = 0, il = vertices.length; il > i; i++) v1.copy(vertices[i]), 
                v1.applyMatrix4(node.matrixWorld), scope.expandByPoint(v1); else if (geometry instanceof THREE.BufferGeometry && void 0 !== geometry.attributes.position) for (var positions = geometry.attributes.position.array, i = 0, il = positions.length; il > i; i += 3) v1.set(positions[i], positions[i + 1], positions[i + 2]), 
                v1.applyMatrix4(node.matrixWorld), scope.expandByPoint(v1);
            }), this;
        };
    }(),
    clone: function() {
        return new this.constructor().copy(this);
    },
    copy: function(box) {
        return this.min.copy(box.min), this.max.copy(box.max), this;
    },
    makeEmpty: function() {
        return this.min.x = this.min.y = this.min.z = 1 / 0, this.max.x = this.max.y = this.max.z = -(1 / 0), 
        this;
    },
    empty: function() {
        return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
    },
    center: function(optionalTarget) {
        var result = optionalTarget || new THREE.Vector3();
        return result.addVectors(this.min, this.max).multiplyScalar(.5);
    },
    size: function(optionalTarget) {
        var result = optionalTarget || new THREE.Vector3();
        return result.subVectors(this.max, this.min);
    },
    expandByPoint: function(point) {
        return this.min.min(point), this.max.max(point), this;
    },
    expandByVector: function(vector) {
        return this.min.sub(vector), this.max.add(vector), this;
    },
    expandByScalar: function(scalar) {
        return this.min.addScalar(-scalar), this.max.addScalar(scalar), this;
    },
    containsPoint: function(point) {
        return point.x < this.min.x || point.x > this.max.x || point.y < this.min.y || point.y > this.max.y || point.z < this.min.z || point.z > this.max.z ? !1 : !0;
    },
    containsBox: function(box) {
        return this.min.x <= box.min.x && box.max.x <= this.max.x && this.min.y <= box.min.y && box.max.y <= this.max.y && this.min.z <= box.min.z && box.max.z <= this.max.z ? !0 : !1;
    },
    getParameter: function(point, optionalTarget) {
        var result = optionalTarget || new THREE.Vector3();
        return result.set((point.x - this.min.x) / (this.max.x - this.min.x), (point.y - this.min.y) / (this.max.y - this.min.y), (point.z - this.min.z) / (this.max.z - this.min.z));
    },
    isIntersectionBox: function(box) {
        return box.max.x < this.min.x || box.min.x > this.max.x || box.max.y < this.min.y || box.min.y > this.max.y || box.max.z < this.min.z || box.min.z > this.max.z ? !1 : !0;
    },
    clampPoint: function(point, optionalTarget) {
        var result = optionalTarget || new THREE.Vector3();
        return result.copy(point).clamp(this.min, this.max);
    },
    distanceToPoint: function() {
        var v1 = new THREE.Vector3();
        return function(point) {
            var clampedPoint = v1.copy(point).clamp(this.min, this.max);
            return clampedPoint.sub(point).length();
        };
    }(),
    getBoundingSphere: function() {
        var v1 = new THREE.Vector3();
        return function(optionalTarget) {
            var result = optionalTarget || new THREE.Sphere();
            return result.center = this.center(), result.radius = .5 * this.size(v1).length(), 
            result;
        };
    }(),
    intersect: function(box) {
        return this.min.max(box.min), this.max.min(box.max), this;
    },
    union: function(box) {
        return this.min.min(box.min), this.max.max(box.max), this;
    },
    applyMatrix4: function() {
        var points = [ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ];
        return function(matrix) {
            return points[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(matrix), points[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(matrix), 
            points[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(matrix), points[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(matrix), 
            points[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(matrix), points[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(matrix), 
            points[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(matrix), points[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(matrix), 
            this.makeEmpty(), this.setFromPoints(points), this;
        };
    }(),
    translate: function(offset) {
        return this.min.add(offset), this.max.add(offset), this;
    },
    equals: function(box) {
        return box.min.equals(this.min) && box.max.equals(this.max);
    }
}, THREE.Matrix3 = function() {
    this.elements = new Float32Array([ 1, 0, 0, 0, 1, 0, 0, 0, 1 ]), arguments.length > 0 && console.error("THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.");
}, THREE.Matrix3.prototype = {
    constructor: THREE.Matrix3,
    set: function(n11, n12, n13, n21, n22, n23, n31, n32, n33) {
        var te = this.elements;
        return te[0] = n11, te[3] = n12, te[6] = n13, te[1] = n21, te[4] = n22, te[7] = n23, 
        te[2] = n31, te[5] = n32, te[8] = n33, this;
    },
    identity: function() {
        return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this;
    },
    clone: function() {
        return new this.constructor().fromArray(this.elements);
    },
    copy: function(m) {
        var me = m.elements;
        return this.set(me[0], me[3], me[6], me[1], me[4], me[7], me[2], me[5], me[8]), 
        this;
    },
    multiplyVector3: function(vector) {
        return console.warn("THREE.Matrix3: .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead."), 
        vector.applyMatrix3(this);
    },
    multiplyVector3Array: function(a) {
        return console.warn("THREE.Matrix3: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead."), 
        this.applyToVector3Array(a);
    },
    applyToVector3Array: function() {
        var v1;
        return function(array, offset, length) {
            void 0 === v1 && (v1 = new THREE.Vector3()), void 0 === offset && (offset = 0), 
            void 0 === length && (length = array.length);
            for (var i = 0, j = offset; length > i; i += 3, j += 3) v1.fromArray(array, j), 
            v1.applyMatrix3(this), v1.toArray(array, j);
            return array;
        };
    }(),
    applyToBuffer: function() {
        var v1;
        return function(buffer, offset, length) {
            void 0 === v1 && (v1 = new THREE.Vector3()), void 0 === offset && (offset = 0), 
            void 0 === length && (length = buffer.length / buffer.itemSize);
            for (var i = 0, j = offset; length > i; i++, j++) v1.x = buffer.getX(j), v1.y = buffer.getY(j), 
            v1.z = buffer.getZ(j), v1.applyMatrix3(this), buffer.setXYZ(v1.x, v1.y, v1.z);
            return buffer;
        };
    }(),
    multiplyScalar: function(s) {
        var te = this.elements;
        return te[0] *= s, te[3] *= s, te[6] *= s, te[1] *= s, te[4] *= s, te[7] *= s, te[2] *= s, 
        te[5] *= s, te[8] *= s, this;
    },
    determinant: function() {
        var te = this.elements, a = te[0], b = te[1], c = te[2], d = te[3], e = te[4], f = te[5], g = te[6], h = te[7], i = te[8];
        return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
    },
    getInverse: function(matrix, throwOnInvertible) {
        var me = matrix.elements, te = this.elements;
        te[0] = me[10] * me[5] - me[6] * me[9], te[1] = -me[10] * me[1] + me[2] * me[9], 
        te[2] = me[6] * me[1] - me[2] * me[5], te[3] = -me[10] * me[4] + me[6] * me[8], 
        te[4] = me[10] * me[0] - me[2] * me[8], te[5] = -me[6] * me[0] + me[2] * me[4], 
        te[6] = me[9] * me[4] - me[5] * me[8], te[7] = -me[9] * me[0] + me[1] * me[8], te[8] = me[5] * me[0] - me[1] * me[4];
        var det = me[0] * te[0] + me[1] * te[3] + me[2] * te[6];
        if (0 === det) {
            var msg = "Matrix3.getInverse(): can't invert matrix, determinant is 0";
            if (throwOnInvertible) throw new Error(msg);
            return console.warn(msg), this.identity(), this;
        }
        return this.multiplyScalar(1 / det), this;
    },
    transpose: function() {
        var tmp, m = this.elements;
        return tmp = m[1], m[1] = m[3], m[3] = tmp, tmp = m[2], m[2] = m[6], m[6] = tmp, 
        tmp = m[5], m[5] = m[7], m[7] = tmp, this;
    },
    flattenToArrayOffset: function(array, offset) {
        var te = this.elements;
        return array[offset] = te[0], array[offset + 1] = te[1], array[offset + 2] = te[2], 
        array[offset + 3] = te[3], array[offset + 4] = te[4], array[offset + 5] = te[5], 
        array[offset + 6] = te[6], array[offset + 7] = te[7], array[offset + 8] = te[8], 
        array;
    },
    getNormalMatrix: function(m) {
        return this.getInverse(m).transpose(), this;
    },
    transposeIntoArray: function(r) {
        var m = this.elements;
        return r[0] = m[0], r[1] = m[3], r[2] = m[6], r[3] = m[1], r[4] = m[4], r[5] = m[7], 
        r[6] = m[2], r[7] = m[5], r[8] = m[8], this;
    },
    fromArray: function(array) {
        return this.elements.set(array), this;
    },
    toArray: function() {
        var te = this.elements;
        return [ te[0], te[1], te[2], te[3], te[4], te[5], te[6], te[7], te[8] ];
    }
}, THREE.Matrix4 = function() {
    this.elements = new Float32Array([ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ]), 
    arguments.length > 0 && console.error("THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.");
}, THREE.Matrix4.prototype = {
    constructor: THREE.Matrix4,
    set: function(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
        var te = this.elements;
        return te[0] = n11, te[4] = n12, te[8] = n13, te[12] = n14, te[1] = n21, te[5] = n22, 
        te[9] = n23, te[13] = n24, te[2] = n31, te[6] = n32, te[10] = n33, te[14] = n34, 
        te[3] = n41, te[7] = n42, te[11] = n43, te[15] = n44, this;
    },
    identity: function() {
        return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
    },
    clone: function() {
        return new THREE.Matrix4().fromArray(this.elements);
    },
    copy: function(m) {
        return this.elements.set(m.elements), this;
    },
    extractPosition: function(m) {
        return console.warn("THREE.Matrix4: .extractPosition() has been renamed to .copyPosition()."), 
        this.copyPosition(m);
    },
    copyPosition: function(m) {
        var te = this.elements, me = m.elements;
        return te[12] = me[12], te[13] = me[13], te[14] = me[14], this;
    },
    extractBasis: function(xAxis, yAxis, zAxis) {
        var te = this.elements;
        return xAxis.set(te[0], te[1], te[2]), yAxis.set(te[4], te[5], te[6]), zAxis.set(te[8], te[9], te[10]), 
        this;
    },
    makeBasis: function(xAxis, yAxis, zAxis) {
        return this.set(xAxis.x, yAxis.x, zAxis.x, 0, xAxis.y, yAxis.y, zAxis.y, 0, xAxis.z, yAxis.z, zAxis.z, 0, 0, 0, 0, 1), 
        this;
    },
    extractRotation: function() {
        var v1;
        return function(m) {
            void 0 === v1 && (v1 = new THREE.Vector3());
            var te = this.elements, me = m.elements, scaleX = 1 / v1.set(me[0], me[1], me[2]).length(), scaleY = 1 / v1.set(me[4], me[5], me[6]).length(), scaleZ = 1 / v1.set(me[8], me[9], me[10]).length();
            return te[0] = me[0] * scaleX, te[1] = me[1] * scaleX, te[2] = me[2] * scaleX, te[4] = me[4] * scaleY, 
            te[5] = me[5] * scaleY, te[6] = me[6] * scaleY, te[8] = me[8] * scaleZ, te[9] = me[9] * scaleZ, 
            te[10] = me[10] * scaleZ, this;
        };
    }(),
    makeRotationFromEuler: function(euler) {
        euler instanceof THREE.Euler == !1 && console.error("THREE.Matrix: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.");
        var te = this.elements, x = euler.x, y = euler.y, z = euler.z, a = Math.cos(x), b = Math.sin(x), c = Math.cos(y), d = Math.sin(y), e = Math.cos(z), f = Math.sin(z);
        if ("XYZ" === euler.order) {
            var ae = a * e, af = a * f, be = b * e, bf = b * f;
            te[0] = c * e, te[4] = -c * f, te[8] = d, te[1] = af + be * d, te[5] = ae - bf * d, 
            te[9] = -b * c, te[2] = bf - ae * d, te[6] = be + af * d, te[10] = a * c;
        } else if ("YXZ" === euler.order) {
            var ce = c * e, cf = c * f, de = d * e, df = d * f;
            te[0] = ce + df * b, te[4] = de * b - cf, te[8] = a * d, te[1] = a * f, te[5] = a * e, 
            te[9] = -b, te[2] = cf * b - de, te[6] = df + ce * b, te[10] = a * c;
        } else if ("ZXY" === euler.order) {
            var ce = c * e, cf = c * f, de = d * e, df = d * f;
            te[0] = ce - df * b, te[4] = -a * f, te[8] = de + cf * b, te[1] = cf + de * b, te[5] = a * e, 
            te[9] = df - ce * b, te[2] = -a * d, te[6] = b, te[10] = a * c;
        } else if ("ZYX" === euler.order) {
            var ae = a * e, af = a * f, be = b * e, bf = b * f;
            te[0] = c * e, te[4] = be * d - af, te[8] = ae * d + bf, te[1] = c * f, te[5] = bf * d + ae, 
            te[9] = af * d - be, te[2] = -d, te[6] = b * c, te[10] = a * c;
        } else if ("YZX" === euler.order) {
            var ac = a * c, ad = a * d, bc = b * c, bd = b * d;
            te[0] = c * e, te[4] = bd - ac * f, te[8] = bc * f + ad, te[1] = f, te[5] = a * e, 
            te[9] = -b * e, te[2] = -d * e, te[6] = ad * f + bc, te[10] = ac - bd * f;
        } else if ("XZY" === euler.order) {
            var ac = a * c, ad = a * d, bc = b * c, bd = b * d;
            te[0] = c * e, te[4] = -f, te[8] = d * e, te[1] = ac * f + bd, te[5] = a * e, te[9] = ad * f - bc, 
            te[2] = bc * f - ad, te[6] = b * e, te[10] = bd * f + ac;
        }
        return te[3] = 0, te[7] = 0, te[11] = 0, te[12] = 0, te[13] = 0, te[14] = 0, te[15] = 1, 
        this;
    },
    setRotationFromQuaternion: function(q) {
        return console.warn("THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion()."), 
        this.makeRotationFromQuaternion(q);
    },
    makeRotationFromQuaternion: function(q) {
        var te = this.elements, x = q.x, y = q.y, z = q.z, w = q.w, x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
        return te[0] = 1 - (yy + zz), te[4] = xy - wz, te[8] = xz + wy, te[1] = xy + wz, 
        te[5] = 1 - (xx + zz), te[9] = yz - wx, te[2] = xz - wy, te[6] = yz + wx, te[10] = 1 - (xx + yy), 
        te[3] = 0, te[7] = 0, te[11] = 0, te[12] = 0, te[13] = 0, te[14] = 0, te[15] = 1, 
        this;
    },
    lookAt: function() {
        var x, y, z;
        return function(eye, target, up) {
            void 0 === x && (x = new THREE.Vector3()), void 0 === y && (y = new THREE.Vector3()), 
            void 0 === z && (z = new THREE.Vector3());
            var te = this.elements;
            return z.subVectors(eye, target).normalize(), 0 === z.lengthSq() && (z.z = 1), x.crossVectors(up, z).normalize(), 
            0 === x.lengthSq() && (z.x += 1e-4, x.crossVectors(up, z).normalize()), y.crossVectors(z, x), 
            te[0] = x.x, te[4] = y.x, te[8] = z.x, te[1] = x.y, te[5] = y.y, te[9] = z.y, te[2] = x.z, 
            te[6] = y.z, te[10] = z.z, this;
        };
    }(),
    multiply: function(m, n) {
        return void 0 !== n ? (console.warn("THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead."), 
        this.multiplyMatrices(m, n)) : this.multiplyMatrices(this, m);
    },
    multiplyMatrices: function(a, b) {
        var ae = a.elements, be = b.elements, te = this.elements, a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12], a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13], a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14], a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15], b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12], b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13], b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14], b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];
        return te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41, te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42, 
        te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43, te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44, 
        te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41, te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42, 
        te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43, te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44, 
        te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41, te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42, 
        te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43, te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44, 
        te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41, te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42, 
        te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43, te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44, 
        this;
    },
    multiplyToArray: function(a, b, r) {
        var te = this.elements;
        return this.multiplyMatrices(a, b), r[0] = te[0], r[1] = te[1], r[2] = te[2], r[3] = te[3], 
        r[4] = te[4], r[5] = te[5], r[6] = te[6], r[7] = te[7], r[8] = te[8], r[9] = te[9], 
        r[10] = te[10], r[11] = te[11], r[12] = te[12], r[13] = te[13], r[14] = te[14], 
        r[15] = te[15], this;
    },
    multiplyScalar: function(s) {
        var te = this.elements;
        return te[0] *= s, te[4] *= s, te[8] *= s, te[12] *= s, te[1] *= s, te[5] *= s, 
        te[9] *= s, te[13] *= s, te[2] *= s, te[6] *= s, te[10] *= s, te[14] *= s, te[3] *= s, 
        te[7] *= s, te[11] *= s, te[15] *= s, this;
    },
    multiplyVector3: function(vector) {
        return console.warn("THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) or vector.applyProjection( matrix ) instead."), 
        vector.applyProjection(this);
    },
    multiplyVector4: function(vector) {
        return console.warn("THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead."), 
        vector.applyMatrix4(this);
    },
    multiplyVector3Array: function(a) {
        return console.warn("THREE.Matrix4: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead."), 
        this.applyToVector3Array(a);
    },
    applyToVector3Array: function() {
        var v1;
        return function(array, offset, length) {
            void 0 === v1 && (v1 = new THREE.Vector3()), void 0 === offset && (offset = 0), 
            void 0 === length && (length = array.length);
            for (var i = 0, j = offset; length > i; i += 3, j += 3) v1.fromArray(array, j), 
            v1.applyMatrix4(this), v1.toArray(array, j);
            return array;
        };
    }(),
    applyToBuffer: function() {
        var v1;
        return function(buffer, offset, length) {
            void 0 === v1 && (v1 = new THREE.Vector3()), void 0 === offset && (offset = 0), 
            void 0 === length && (length = buffer.length / buffer.itemSize);
            for (var i = 0, j = offset; length > i; i++, j++) v1.x = buffer.getX(j), v1.y = buffer.getY(j), 
            v1.z = buffer.getZ(j), v1.applyMatrix4(this), buffer.setXYZ(v1.x, v1.y, v1.z);
            return buffer;
        };
    }(),
    rotateAxis: function(v) {
        console.warn("THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead."), 
        v.transformDirection(this);
    },
    crossVector: function(vector) {
        return console.warn("THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead."), 
        vector.applyMatrix4(this);
    },
    determinant: function() {
        var te = this.elements, n11 = te[0], n12 = te[4], n13 = te[8], n14 = te[12], n21 = te[1], n22 = te[5], n23 = te[9], n24 = te[13], n31 = te[2], n32 = te[6], n33 = te[10], n34 = te[14], n41 = te[3], n42 = te[7], n43 = te[11], n44 = te[15];
        return n41 * (+n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34) + n42 * (+n11 * n23 * n34 - n11 * n24 * n33 + n14 * n21 * n33 - n13 * n21 * n34 + n13 * n24 * n31 - n14 * n23 * n31) + n43 * (+n11 * n24 * n32 - n11 * n22 * n34 - n14 * n21 * n32 + n12 * n21 * n34 + n14 * n22 * n31 - n12 * n24 * n31) + n44 * (-n13 * n22 * n31 - n11 * n23 * n32 + n11 * n22 * n33 + n13 * n21 * n32 - n12 * n21 * n33 + n12 * n23 * n31);
    },
    transpose: function() {
        var tmp, te = this.elements;
        return tmp = te[1], te[1] = te[4], te[4] = tmp, tmp = te[2], te[2] = te[8], te[8] = tmp, 
        tmp = te[6], te[6] = te[9], te[9] = tmp, tmp = te[3], te[3] = te[12], te[12] = tmp, 
        tmp = te[7], te[7] = te[13], te[13] = tmp, tmp = te[11], te[11] = te[14], te[14] = tmp, 
        this;
    },
    flattenToArrayOffset: function(array, offset) {
        var te = this.elements;
        return array[offset] = te[0], array[offset + 1] = te[1], array[offset + 2] = te[2], 
        array[offset + 3] = te[3], array[offset + 4] = te[4], array[offset + 5] = te[5], 
        array[offset + 6] = te[6], array[offset + 7] = te[7], array[offset + 8] = te[8], 
        array[offset + 9] = te[9], array[offset + 10] = te[10], array[offset + 11] = te[11], 
        array[offset + 12] = te[12], array[offset + 13] = te[13], array[offset + 14] = te[14], 
        array[offset + 15] = te[15], array;
    },
    getPosition: function() {
        var v1;
        return function() {
            void 0 === v1 && (v1 = new THREE.Vector3()), console.warn("THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead.");
            var te = this.elements;
            return v1.set(te[12], te[13], te[14]);
        };
    }(),
    setPosition: function(v) {
        var te = this.elements;
        return te[12] = v.x, te[13] = v.y, te[14] = v.z, this;
    },
    getInverse: function(m, throwOnInvertible) {
        var te = this.elements, me = m.elements, n11 = me[0], n12 = me[4], n13 = me[8], n14 = me[12], n21 = me[1], n22 = me[5], n23 = me[9], n24 = me[13], n31 = me[2], n32 = me[6], n33 = me[10], n34 = me[14], n41 = me[3], n42 = me[7], n43 = me[11], n44 = me[15];
        te[0] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44, 
        te[4] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44, 
        te[8] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44, 
        te[12] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34, 
        te[1] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44, 
        te[5] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44, 
        te[9] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44, 
        te[13] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34, 
        te[2] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44, 
        te[6] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44, 
        te[10] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44, 
        te[14] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34, 
        te[3] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43, 
        te[7] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43, 
        te[11] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43, 
        te[15] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;
        var det = n11 * te[0] + n21 * te[4] + n31 * te[8] + n41 * te[12];
        if (0 === det) {
            var msg = "THREE.Matrix4.getInverse(): can't invert matrix, determinant is 0";
            if (throwOnInvertible) throw new Error(msg);
            return console.warn(msg), this.identity(), this;
        }
        return this.multiplyScalar(1 / det), this;
    },
    translate: function(v) {
        console.error("THREE.Matrix4: .translate() has been removed.");
    },
    rotateX: function(angle) {
        console.error("THREE.Matrix4: .rotateX() has been removed.");
    },
    rotateY: function(angle) {
        console.error("THREE.Matrix4: .rotateY() has been removed.");
    },
    rotateZ: function(angle) {
        console.error("THREE.Matrix4: .rotateZ() has been removed.");
    },
    rotateByAxis: function(axis, angle) {
        console.error("THREE.Matrix4: .rotateByAxis() has been removed.");
    },
    scale: function(v) {
        var te = this.elements, x = v.x, y = v.y, z = v.z;
        return te[0] *= x, te[4] *= y, te[8] *= z, te[1] *= x, te[5] *= y, te[9] *= z, te[2] *= x, 
        te[6] *= y, te[10] *= z, te[3] *= x, te[7] *= y, te[11] *= z, this;
    },
    getMaxScaleOnAxis: function() {
        var te = this.elements, scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2], scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6], scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];
        return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
    },
    makeTranslation: function(x, y, z) {
        return this.set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1), this;
    },
    makeRotationX: function(theta) {
        var c = Math.cos(theta), s = Math.sin(theta);
        return this.set(1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1), this;
    },
    makeRotationY: function(theta) {
        var c = Math.cos(theta), s = Math.sin(theta);
        return this.set(c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1), this;
    },
    makeRotationZ: function(theta) {
        var c = Math.cos(theta), s = Math.sin(theta);
        return this.set(c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
    },
    makeRotationAxis: function(axis, angle) {
        var c = Math.cos(angle), s = Math.sin(angle), t = 1 - c, x = axis.x, y = axis.y, z = axis.z, tx = t * x, ty = t * y;
        return this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1), 
        this;
    },
    makeScale: function(x, y, z) {
        return this.set(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1), this;
    },
    compose: function(position, quaternion, scale) {
        return this.makeRotationFromQuaternion(quaternion), this.scale(scale), this.setPosition(position), 
        this;
    },
    decompose: function() {
        var vector, matrix;
        return function(position, quaternion, scale) {
            void 0 === vector && (vector = new THREE.Vector3()), void 0 === matrix && (matrix = new THREE.Matrix4());
            var te = this.elements, sx = vector.set(te[0], te[1], te[2]).length(), sy = vector.set(te[4], te[5], te[6]).length(), sz = vector.set(te[8], te[9], te[10]).length(), det = this.determinant();
            0 > det && (sx = -sx), position.x = te[12], position.y = te[13], position.z = te[14], 
            matrix.elements.set(this.elements);
            var invSX = 1 / sx, invSY = 1 / sy, invSZ = 1 / sz;
            return matrix.elements[0] *= invSX, matrix.elements[1] *= invSX, matrix.elements[2] *= invSX, 
            matrix.elements[4] *= invSY, matrix.elements[5] *= invSY, matrix.elements[6] *= invSY, 
            matrix.elements[8] *= invSZ, matrix.elements[9] *= invSZ, matrix.elements[10] *= invSZ, 
            quaternion.setFromRotationMatrix(matrix), scale.x = sx, scale.y = sy, scale.z = sz, 
            this;
        };
    }(),
    makeFrustum: function(left, right, bottom, top, near, far) {
        var te = this.elements, x = 2 * near / (right - left), y = 2 * near / (top - bottom), a = (right + left) / (right - left), b = (top + bottom) / (top - bottom), c = -(far + near) / (far - near), d = -2 * far * near / (far - near);
        return te[0] = x, te[4] = 0, te[8] = a, te[12] = 0, te[1] = 0, te[5] = y, te[9] = b, 
        te[13] = 0, te[2] = 0, te[6] = 0, te[10] = c, te[14] = d, te[3] = 0, te[7] = 0, 
        te[11] = -1, te[15] = 0, this;
    },
    makePerspective: function(fov, aspect, near, far) {
        var ymax = near * Math.tan(THREE.Math.degToRad(.5 * fov)), ymin = -ymax, xmin = ymin * aspect, xmax = ymax * aspect;
        return this.makeFrustum(xmin, xmax, ymin, ymax, near, far);
    },
    makeOrthographic: function(left, right, top, bottom, near, far) {
        var te = this.elements, w = right - left, h = top - bottom, p = far - near, x = (right + left) / w, y = (top + bottom) / h, z = (far + near) / p;
        return te[0] = 2 / w, te[4] = 0, te[8] = 0, te[12] = -x, te[1] = 0, te[5] = 2 / h, 
        te[9] = 0, te[13] = -y, te[2] = 0, te[6] = 0, te[10] = -2 / p, te[14] = -z, te[3] = 0, 
        te[7] = 0, te[11] = 0, te[15] = 1, this;
    },
    equals: function(matrix) {
        for (var te = this.elements, me = matrix.elements, i = 0; 16 > i; i++) if (te[i] !== me[i]) return !1;
        return !0;
    },
    fromArray: function(array) {
        return this.elements.set(array), this;
    },
    toArray: function() {
        var te = this.elements;
        return [ te[0], te[1], te[2], te[3], te[4], te[5], te[6], te[7], te[8], te[9], te[10], te[11], te[12], te[13], te[14], te[15] ];
    }
}, THREE.Ray = function(origin, direction) {
    this.origin = void 0 !== origin ? origin : new THREE.Vector3(), this.direction = void 0 !== direction ? direction : new THREE.Vector3();
}, THREE.Ray.prototype = {
    constructor: THREE.Ray,
    set: function(origin, direction) {
        return this.origin.copy(origin), this.direction.copy(direction), this;
    },
    clone: function() {
        return new this.constructor().copy(this);
    },
    copy: function(ray) {
        return this.origin.copy(ray.origin), this.direction.copy(ray.direction), this;
    },
    at: function(t, optionalTarget) {
        var result = optionalTarget || new THREE.Vector3();
        return result.copy(this.direction).multiplyScalar(t).add(this.origin);
    },
    recast: function() {
        var v1 = new THREE.Vector3();
        return function(t) {
            return this.origin.copy(this.at(t, v1)), this;
        };
    }(),
    closestPointToPoint: function(point, optionalTarget) {
        var result = optionalTarget || new THREE.Vector3();
        result.subVectors(point, this.origin);
        var directionDistance = result.dot(this.direction);
        return 0 > directionDistance ? result.copy(this.origin) : result.copy(this.direction).multiplyScalar(directionDistance).add(this.origin);
    },
    distanceToPoint: function(point) {
        return Math.sqrt(this.distanceSqToPoint(point));
    },
    distanceSqToPoint: function() {
        var v1 = new THREE.Vector3();
        return function(point) {
            var directionDistance = v1.subVectors(point, this.origin).dot(this.direction);
            return 0 > directionDistance ? this.origin.distanceToSquared(point) : (v1.copy(this.direction).multiplyScalar(directionDistance).add(this.origin), 
            v1.distanceToSquared(point));
        };
    }(),
    distanceSqToSegment: function() {
        var segCenter = new THREE.Vector3(), segDir = new THREE.Vector3(), diff = new THREE.Vector3();
        return function(v0, v1, optionalPointOnRay, optionalPointOnSegment) {
            segCenter.copy(v0).add(v1).multiplyScalar(.5), segDir.copy(v1).sub(v0).normalize(), 
            diff.copy(this.origin).sub(segCenter);
            var s0, s1, sqrDist, extDet, segExtent = .5 * v0.distanceTo(v1), a01 = -this.direction.dot(segDir), b0 = diff.dot(this.direction), b1 = -diff.dot(segDir), c = diff.lengthSq(), det = Math.abs(1 - a01 * a01);
            if (det > 0) if (s0 = a01 * b1 - b0, s1 = a01 * b0 - b1, extDet = segExtent * det, 
            s0 >= 0) if (s1 >= -extDet) if (extDet >= s1) {
                var invDet = 1 / det;
                s0 *= invDet, s1 *= invDet, sqrDist = s0 * (s0 + a01 * s1 + 2 * b0) + s1 * (a01 * s0 + s1 + 2 * b1) + c;
            } else s1 = segExtent, s0 = Math.max(0, -(a01 * s1 + b0)), sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c; else s1 = -segExtent, 
            s0 = Math.max(0, -(a01 * s1 + b0)), sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c; else -extDet >= s1 ? (s0 = Math.max(0, -(-a01 * segExtent + b0)), 
            s1 = s0 > 0 ? -segExtent : Math.min(Math.max(-segExtent, -b1), segExtent), sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c) : extDet >= s1 ? (s0 = 0, 
            s1 = Math.min(Math.max(-segExtent, -b1), segExtent), sqrDist = s1 * (s1 + 2 * b1) + c) : (s0 = Math.max(0, -(a01 * segExtent + b0)), 
            s1 = s0 > 0 ? segExtent : Math.min(Math.max(-segExtent, -b1), segExtent), sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c); else s1 = a01 > 0 ? -segExtent : segExtent, 
            s0 = Math.max(0, -(a01 * s1 + b0)), sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
            return optionalPointOnRay && optionalPointOnRay.copy(this.direction).multiplyScalar(s0).add(this.origin), 
            optionalPointOnSegment && optionalPointOnSegment.copy(segDir).multiplyScalar(s1).add(segCenter), 
            sqrDist;
        };
    }(),
    isIntersectionSphere: function(sphere) {
        return this.distanceToPoint(sphere.center) <= sphere.radius;
    },
    intersectSphere: function() {
        var v1 = new THREE.Vector3();
        return function(sphere, optionalTarget) {
            v1.subVectors(sphere.center, this.origin);
            var tca = v1.dot(this.direction), d2 = v1.dot(v1) - tca * tca, radius2 = sphere.radius * sphere.radius;
            if (d2 > radius2) return null;
            var thc = Math.sqrt(radius2 - d2), t0 = tca - thc, t1 = tca + thc;
            return 0 > t0 && 0 > t1 ? null : 0 > t0 ? this.at(t1, optionalTarget) : this.at(t0, optionalTarget);
        };
    }(),
    isIntersectionPlane: function(plane) {
        var distToPoint = plane.distanceToPoint(this.origin);
        if (0 === distToPoint) return !0;
        var denominator = plane.normal.dot(this.direction);
        return 0 > denominator * distToPoint ? !0 : !1;
    },
    distanceToPlane: function(plane) {
        var denominator = plane.normal.dot(this.direction);
        if (0 === denominator) return 0 === plane.distanceToPoint(this.origin) ? 0 : null;
        var t = -(this.origin.dot(plane.normal) + plane.constant) / denominator;
        return t >= 0 ? t : null;
    },
    intersectPlane: function(plane, optionalTarget) {
        var t = this.distanceToPlane(plane);
        return null === t ? null : this.at(t, optionalTarget);
    },
    isIntersectionBox: function() {
        var v = new THREE.Vector3();
        return function(box) {
            return null !== this.intersectBox(box, v);
        };
    }(),
    intersectBox: function(box, optionalTarget) {
        var tmin, tmax, tymin, tymax, tzmin, tzmax, invdirx = 1 / this.direction.x, invdiry = 1 / this.direction.y, invdirz = 1 / this.direction.z, origin = this.origin;
        return invdirx >= 0 ? (tmin = (box.min.x - origin.x) * invdirx, tmax = (box.max.x - origin.x) * invdirx) : (tmin = (box.max.x - origin.x) * invdirx, 
        tmax = (box.min.x - origin.x) * invdirx), invdiry >= 0 ? (tymin = (box.min.y - origin.y) * invdiry, 
        tymax = (box.max.y - origin.y) * invdiry) : (tymin = (box.max.y - origin.y) * invdiry, 
        tymax = (box.min.y - origin.y) * invdiry), tmin > tymax || tymin > tmax ? null : ((tymin > tmin || tmin !== tmin) && (tmin = tymin), 
        (tmax > tymax || tmax !== tmax) && (tmax = tymax), invdirz >= 0 ? (tzmin = (box.min.z - origin.z) * invdirz, 
        tzmax = (box.max.z - origin.z) * invdirz) : (tzmin = (box.max.z - origin.z) * invdirz, 
        tzmax = (box.min.z - origin.z) * invdirz), tmin > tzmax || tzmin > tmax ? null : ((tzmin > tmin || tmin !== tmin) && (tmin = tzmin), 
        (tmax > tzmax || tmax !== tmax) && (tmax = tzmax), 0 > tmax ? null : this.at(tmin >= 0 ? tmin : tmax, optionalTarget)));
    },
    intersectTriangle: function() {
        var diff = new THREE.Vector3(), edge1 = new THREE.Vector3(), edge2 = new THREE.Vector3(), normal = new THREE.Vector3();
        return function(a, b, c, backfaceCulling, optionalTarget) {
            edge1.subVectors(b, a), edge2.subVectors(c, a), normal.crossVectors(edge1, edge2);
            var sign, DdN = this.direction.dot(normal);
            if (DdN > 0) {
                if (backfaceCulling) return null;
                sign = 1;
            } else {
                if (!(0 > DdN)) return null;
                sign = -1, DdN = -DdN;
            }
            diff.subVectors(this.origin, a);
            var DdQxE2 = sign * this.direction.dot(edge2.crossVectors(diff, edge2));
            if (0 > DdQxE2) return null;
            var DdE1xQ = sign * this.direction.dot(edge1.cross(diff));
            if (0 > DdE1xQ) return null;
            if (DdQxE2 + DdE1xQ > DdN) return null;
            var QdN = -sign * diff.dot(normal);
            return 0 > QdN ? null : this.at(QdN / DdN, optionalTarget);
        };
    }(),
    applyMatrix4: function(matrix4) {
        return this.direction.add(this.origin).applyMatrix4(matrix4), this.origin.applyMatrix4(matrix4), 
        this.direction.sub(this.origin), this.direction.normalize(), this;
    },
    equals: function(ray) {
        return ray.origin.equals(this.origin) && ray.direction.equals(this.direction);
    }
}, THREE.Sphere = function(center, radius) {
    this.center = void 0 !== center ? center : new THREE.Vector3(), this.radius = void 0 !== radius ? radius : 0;
}, THREE.Sphere.prototype = {
    constructor: THREE.Sphere,
    set: function(center, radius) {
        return this.center.copy(center), this.radius = radius, this;
    },
    setFromPoints: function() {
        var box = new THREE.Box3();
        return function(points, optionalCenter) {
            var center = this.center;
            void 0 !== optionalCenter ? center.copy(optionalCenter) : box.setFromPoints(points).center(center);
            for (var maxRadiusSq = 0, i = 0, il = points.length; il > i; i++) maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(points[i]));
            return this.radius = Math.sqrt(maxRadiusSq), this;
        };
    }(),
    clone: function() {
        return new this.constructor().copy(this);
    },
    copy: function(sphere) {
        return this.center.copy(sphere.center), this.radius = sphere.radius, this;
    },
    empty: function() {
        return this.radius <= 0;
    },
    containsPoint: function(point) {
        return point.distanceToSquared(this.center) <= this.radius * this.radius;
    },
    distanceToPoint: function(point) {
        return point.distanceTo(this.center) - this.radius;
    },
    intersectsSphere: function(sphere) {
        var radiusSum = this.radius + sphere.radius;
        return sphere.center.distanceToSquared(this.center) <= radiusSum * radiusSum;
    },
    clampPoint: function(point, optionalTarget) {
        var deltaLengthSq = this.center.distanceToSquared(point), result = optionalTarget || new THREE.Vector3();
        return result.copy(point), deltaLengthSq > this.radius * this.radius && (result.sub(this.center).normalize(), 
        result.multiplyScalar(this.radius).add(this.center)), result;
    },
    getBoundingBox: function(optionalTarget) {
        var box = optionalTarget || new THREE.Box3();
        return box.set(this.center, this.center), box.expandByScalar(this.radius), box;
    },
    applyMatrix4: function(matrix) {
        return this.center.applyMatrix4(matrix), this.radius = this.radius * matrix.getMaxScaleOnAxis(), 
        this;
    },
    translate: function(offset) {
        return this.center.add(offset), this;
    },
    equals: function(sphere) {
        return sphere.center.equals(this.center) && sphere.radius === this.radius;
    }
}, THREE.Frustum = function(p0, p1, p2, p3, p4, p5) {
    this.planes = [ void 0 !== p0 ? p0 : new THREE.Plane(), void 0 !== p1 ? p1 : new THREE.Plane(), void 0 !== p2 ? p2 : new THREE.Plane(), void 0 !== p3 ? p3 : new THREE.Plane(), void 0 !== p4 ? p4 : new THREE.Plane(), void 0 !== p5 ? p5 : new THREE.Plane() ];
}, THREE.Frustum.prototype = {
    constructor: THREE.Frustum,
    set: function(p0, p1, p2, p3, p4, p5) {
        var planes = this.planes;
        return planes[0].copy(p0), planes[1].copy(p1), planes[2].copy(p2), planes[3].copy(p3), 
        planes[4].copy(p4), planes[5].copy(p5), this;
    },
    clone: function() {
        return new this.constructor().copy(this);
    },
    copy: function(frustum) {
        for (var planes = this.planes, i = 0; 6 > i; i++) planes[i].copy(frustum.planes[i]);
        return this;
    },
    setFromMatrix: function(m) {
        var planes = this.planes, me = m.elements, me0 = me[0], me1 = me[1], me2 = me[2], me3 = me[3], me4 = me[4], me5 = me[5], me6 = me[6], me7 = me[7], me8 = me[8], me9 = me[9], me10 = me[10], me11 = me[11], me12 = me[12], me13 = me[13], me14 = me[14], me15 = me[15];
        return planes[0].setComponents(me3 - me0, me7 - me4, me11 - me8, me15 - me12).normalize(), 
        planes[1].setComponents(me3 + me0, me7 + me4, me11 + me8, me15 + me12).normalize(), 
        planes[2].setComponents(me3 + me1, me7 + me5, me11 + me9, me15 + me13).normalize(), 
        planes[3].setComponents(me3 - me1, me7 - me5, me11 - me9, me15 - me13).normalize(), 
        planes[4].setComponents(me3 - me2, me7 - me6, me11 - me10, me15 - me14).normalize(), 
        planes[5].setComponents(me3 + me2, me7 + me6, me11 + me10, me15 + me14).normalize(), 
        this;
    },
    intersectsObject: function() {
        var sphere = new THREE.Sphere();
        return function(object) {
            var geometry = object.geometry;
            return null === geometry.boundingSphere && geometry.computeBoundingSphere(), sphere.copy(geometry.boundingSphere), 
            sphere.applyMatrix4(object.matrixWorld), this.intersectsSphere(sphere);
        };
    }(),
    intersectsSphere: function(sphere) {
        for (var planes = this.planes, center = sphere.center, negRadius = -sphere.radius, i = 0; 6 > i; i++) {
            var distance = planes[i].distanceToPoint(center);
            if (negRadius > distance) return !1;
        }
        return !0;
    },
    intersectsBox: function() {
        var p1 = new THREE.Vector3(), p2 = new THREE.Vector3();
        return function(box) {
            for (var planes = this.planes, i = 0; 6 > i; i++) {
                var plane = planes[i];
                p1.x = plane.normal.x > 0 ? box.min.x : box.max.x, p2.x = plane.normal.x > 0 ? box.max.x : box.min.x, 
                p1.y = plane.normal.y > 0 ? box.min.y : box.max.y, p2.y = plane.normal.y > 0 ? box.max.y : box.min.y, 
                p1.z = plane.normal.z > 0 ? box.min.z : box.max.z, p2.z = plane.normal.z > 0 ? box.max.z : box.min.z;
                var d1 = plane.distanceToPoint(p1), d2 = plane.distanceToPoint(p2);
                if (0 > d1 && 0 > d2) return !1;
            }
            return !0;
        };
    }(),
    containsPoint: function(point) {
        for (var planes = this.planes, i = 0; 6 > i; i++) if (planes[i].distanceToPoint(point) < 0) return !1;
        return !0;
    }
}, THREE.Plane = function(normal, constant) {
    this.normal = void 0 !== normal ? normal : new THREE.Vector3(1, 0, 0), this.constant = void 0 !== constant ? constant : 0;
}, THREE.Plane.prototype = {
    constructor: THREE.Plane,
    set: function(normal, constant) {
        return this.normal.copy(normal), this.constant = constant, this;
    },
    setComponents: function(x, y, z, w) {
        return this.normal.set(x, y, z), this.constant = w, this;
    },
    setFromNormalAndCoplanarPoint: function(normal, point) {
        return this.normal.copy(normal), this.constant = -point.dot(this.normal), this;
    },
    setFromCoplanarPoints: function() {
        var v1 = new THREE.Vector3(), v2 = new THREE.Vector3();
        return function(a, b, c) {
            var normal = v1.subVectors(c, b).cross(v2.subVectors(a, b)).normalize();
            return this.setFromNormalAndCoplanarPoint(normal, a), this;
        };
    }(),
    clone: function() {
        return new this.constructor().copy(this);
    },
    copy: function(plane) {
        return this.normal.copy(plane.normal), this.constant = plane.constant, this;
    },
    normalize: function() {
        var inverseNormalLength = 1 / this.normal.length();
        return this.normal.multiplyScalar(inverseNormalLength), this.constant *= inverseNormalLength, 
        this;
    },
    negate: function() {
        return this.constant *= -1, this.normal.negate(), this;
    },
    distanceToPoint: function(point) {
        return this.normal.dot(point) + this.constant;
    },
    distanceToSphere: function(sphere) {
        return this.distanceToPoint(sphere.center) - sphere.radius;
    },
    projectPoint: function(point, optionalTarget) {
        return this.orthoPoint(point, optionalTarget).sub(point).negate();
    },
    orthoPoint: function(point, optionalTarget) {
        var perpendicularMagnitude = this.distanceToPoint(point), result = optionalTarget || new THREE.Vector3();
        return result.copy(this.normal).multiplyScalar(perpendicularMagnitude);
    },
    isIntersectionLine: function(line) {
        var startSign = this.distanceToPoint(line.start), endSign = this.distanceToPoint(line.end);
        return 0 > startSign && endSign > 0 || 0 > endSign && startSign > 0;
    },
    intersectLine: function() {
        var v1 = new THREE.Vector3();
        return function(line, optionalTarget) {
            var result = optionalTarget || new THREE.Vector3(), direction = line.delta(v1), denominator = this.normal.dot(direction);
            if (0 === denominator) return 0 === this.distanceToPoint(line.start) ? result.copy(line.start) : void 0;
            var t = -(line.start.dot(this.normal) + this.constant) / denominator;
            return 0 > t || t > 1 ? void 0 : result.copy(direction).multiplyScalar(t).add(line.start);
        };
    }(),
    coplanarPoint: function(optionalTarget) {
        var result = optionalTarget || new THREE.Vector3();
        return result.copy(this.normal).multiplyScalar(-this.constant);
    },
    applyMatrix4: function() {
        var v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), m1 = new THREE.Matrix3();
        return function(matrix, optionalNormalMatrix) {
            var normalMatrix = optionalNormalMatrix || m1.getNormalMatrix(matrix), newNormal = v1.copy(this.normal).applyMatrix3(normalMatrix), newCoplanarPoint = this.coplanarPoint(v2);
            return newCoplanarPoint.applyMatrix4(matrix), this.setFromNormalAndCoplanarPoint(newNormal, newCoplanarPoint), 
            this;
        };
    }(),
    translate: function(offset) {
        return this.constant = this.constant - offset.dot(this.normal), this;
    },
    equals: function(plane) {
        return plane.normal.equals(this.normal) && plane.constant === this.constant;
    }
}, THREE.Math = {
    generateUUID: function() {
        var r, chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""), uuid = new Array(36), rnd = 0;
        return function() {
            for (var i = 0; 36 > i; i++) 8 === i || 13 === i || 18 === i || 23 === i ? uuid[i] = "-" : 14 === i ? uuid[i] = "4" : (2 >= rnd && (rnd = 33554432 + 16777216 * Math.random() | 0), 
            r = 15 & rnd, rnd >>= 4, uuid[i] = chars[19 === i ? 3 & r | 8 : r]);
            return uuid.join("");
        };
    }(),
    clamp: function(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },
    euclideanModulo: function(n, m) {
        return (n % m + m) % m;
    },
    mapLinear: function(x, a1, a2, b1, b2) {
        return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
    },
    smoothstep: function(x, min, max) {
        return min >= x ? 0 : x >= max ? 1 : (x = (x - min) / (max - min), x * x * (3 - 2 * x));
    },
    smootherstep: function(x, min, max) {
        return min >= x ? 0 : x >= max ? 1 : (x = (x - min) / (max - min), x * x * x * (x * (6 * x - 15) + 10));
    },
    random16: function() {
        return (65280 * Math.random() + 255 * Math.random()) / 65535;
    },
    randInt: function(low, high) {
        return low + Math.floor(Math.random() * (high - low + 1));
    },
    randFloat: function(low, high) {
        return low + Math.random() * (high - low);
    },
    randFloatSpread: function(range) {
        return range * (.5 - Math.random());
    },
    degToRad: function() {
        var degreeToRadiansFactor = Math.PI / 180;
        return function(degrees) {
            return degrees * degreeToRadiansFactor;
        };
    }(),
    radToDeg: function() {
        var radianToDegreesFactor = 180 / Math.PI;
        return function(radians) {
            return radians * radianToDegreesFactor;
        };
    }(),
    isPowerOfTwo: function(value) {
        return 0 === (value & value - 1) && 0 !== value;
    },
    nearestPowerOfTwo: function(value) {
        return Math.pow(2, Math.round(Math.log(value) / Math.LN2));
    },
    nextPowerOfTwo: function(value) {
        return value--, value |= value >> 1, value |= value >> 2, value |= value >> 4, value |= value >> 8, 
        value |= value >> 16, value++, value;
    }
}, THREE.Spline = function(points) {
    function interpolate(p0, p1, p2, p3, t, t2, t3) {
        var v0 = .5 * (p2 - p0), v1 = .5 * (p3 - p1);
        return (2 * (p1 - p2) + v0 + v1) * t3 + (-3 * (p1 - p2) - 2 * v0 - v1) * t2 + v0 * t + p1;
    }
    this.points = points;
    var point, intPoint, weight, w2, w3, pa, pb, pc, pd, c = [], v3 = {
        x: 0,
        y: 0,
        z: 0
    };
    this.initFromArray = function(a) {
        this.points = [];
        for (var i = 0; i < a.length; i++) this.points[i] = {
            x: a[i][0],
            y: a[i][1],
            z: a[i][2]
        };
    }, this.getPoint = function(k) {
        return point = (this.points.length - 1) * k, intPoint = Math.floor(point), weight = point - intPoint, 
        c[0] = 0 === intPoint ? intPoint : intPoint - 1, c[1] = intPoint, c[2] = intPoint > this.points.length - 2 ? this.points.length - 1 : intPoint + 1, 
        c[3] = intPoint > this.points.length - 3 ? this.points.length - 1 : intPoint + 2, 
        pa = this.points[c[0]], pb = this.points[c[1]], pc = this.points[c[2]], pd = this.points[c[3]], 
        w2 = weight * weight, w3 = weight * w2, v3.x = interpolate(pa.x, pb.x, pc.x, pd.x, weight, w2, w3), 
        v3.y = interpolate(pa.y, pb.y, pc.y, pd.y, weight, w2, w3), v3.z = interpolate(pa.z, pb.z, pc.z, pd.z, weight, w2, w3), 
        v3;
    }, this.getControlPointsArray = function() {
        var i, p, l = this.points.length, coords = [];
        for (i = 0; l > i; i++) p = this.points[i], coords[i] = [ p.x, p.y, p.z ];
        return coords;
    }, this.getLength = function(nSubDivisions) {
        var i, index, nSamples, position, point = 0, intPoint = 0, oldIntPoint = 0, oldPosition = new THREE.Vector3(), tmpVec = new THREE.Vector3(), chunkLengths = [], totalLength = 0;
        for (chunkLengths[0] = 0, nSubDivisions || (nSubDivisions = 100), nSamples = this.points.length * nSubDivisions, 
        oldPosition.copy(this.points[0]), i = 1; nSamples > i; i++) index = i / nSamples, 
        position = this.getPoint(index), tmpVec.copy(position), totalLength += tmpVec.distanceTo(oldPosition), 
        oldPosition.copy(position), point = (this.points.length - 1) * index, intPoint = Math.floor(point), 
        intPoint !== oldIntPoint && (chunkLengths[intPoint] = totalLength, oldIntPoint = intPoint);
        return chunkLengths[chunkLengths.length] = totalLength, {
            chunks: chunkLengths,
            total: totalLength
        };
    }, this.reparametrizeByArcLength = function(samplingCoef) {
        var i, j, index, indexCurrent, indexNext, realDistance, sampling, position, newpoints = [], tmpVec = new THREE.Vector3(), sl = this.getLength();
        for (newpoints.push(tmpVec.copy(this.points[0]).clone()), i = 1; i < this.points.length; i++) {
            for (realDistance = sl.chunks[i] - sl.chunks[i - 1], sampling = Math.ceil(samplingCoef * realDistance / sl.total), 
            indexCurrent = (i - 1) / (this.points.length - 1), indexNext = i / (this.points.length - 1), 
            j = 1; sampling - 1 > j; j++) index = indexCurrent + j * (1 / sampling) * (indexNext - indexCurrent), 
            position = this.getPoint(index), newpoints.push(tmpVec.copy(position).clone());
            newpoints.push(tmpVec.copy(this.points[i]).clone());
        }
        this.points = newpoints;
    };
}, THREE.Triangle = function(a, b, c) {
    this.a = void 0 !== a ? a : new THREE.Vector3(), this.b = void 0 !== b ? b : new THREE.Vector3(), 
    this.c = void 0 !== c ? c : new THREE.Vector3();
}, THREE.Triangle.normal = function() {
    var v0 = new THREE.Vector3();
    return function(a, b, c, optionalTarget) {
        var result = optionalTarget || new THREE.Vector3();
        result.subVectors(c, b), v0.subVectors(a, b), result.cross(v0);
        var resultLengthSq = result.lengthSq();
        return resultLengthSq > 0 ? result.multiplyScalar(1 / Math.sqrt(resultLengthSq)) : result.set(0, 0, 0);
    };
}(), THREE.Triangle.barycoordFromPoint = function() {
    var v0 = new THREE.Vector3(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3();
    return function(point, a, b, c, optionalTarget) {
        v0.subVectors(c, a), v1.subVectors(b, a), v2.subVectors(point, a);
        var dot00 = v0.dot(v0), dot01 = v0.dot(v1), dot02 = v0.dot(v2), dot11 = v1.dot(v1), dot12 = v1.dot(v2), denom = dot00 * dot11 - dot01 * dot01, result = optionalTarget || new THREE.Vector3();
        if (0 === denom) return result.set(-2, -1, -1);
        var invDenom = 1 / denom, u = (dot11 * dot02 - dot01 * dot12) * invDenom, v = (dot00 * dot12 - dot01 * dot02) * invDenom;
        return result.set(1 - u - v, v, u);
    };
}(), THREE.Triangle.containsPoint = function() {
    var v1 = new THREE.Vector3();
    return function(point, a, b, c) {
        var result = THREE.Triangle.barycoordFromPoint(point, a, b, c, v1);
        return result.x >= 0 && result.y >= 0 && result.x + result.y <= 1;
    };
}(), THREE.Triangle.prototype = {
    constructor: THREE.Triangle,
    set: function(a, b, c) {
        return this.a.copy(a), this.b.copy(b), this.c.copy(c), this;
    },
    setFromPointsAndIndices: function(points, i0, i1, i2) {
        return this.a.copy(points[i0]), this.b.copy(points[i1]), this.c.copy(points[i2]), 
        this;
    },
    clone: function() {
        return new this.constructor().copy(this);
    },
    copy: function(triangle) {
        return this.a.copy(triangle.a), this.b.copy(triangle.b), this.c.copy(triangle.c), 
        this;
    },
    area: function() {
        var v0 = new THREE.Vector3(), v1 = new THREE.Vector3();
        return function() {
            return v0.subVectors(this.c, this.b), v1.subVectors(this.a, this.b), .5 * v0.cross(v1).length();
        };
    }(),
    midpoint: function(optionalTarget) {
        var result = optionalTarget || new THREE.Vector3();
        return result.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
    },
    normal: function(optionalTarget) {
        return THREE.Triangle.normal(this.a, this.b, this.c, optionalTarget);
    },
    plane: function(optionalTarget) {
        var result = optionalTarget || new THREE.Plane();
        return result.setFromCoplanarPoints(this.a, this.b, this.c);
    },
    barycoordFromPoint: function(point, optionalTarget) {
        return THREE.Triangle.barycoordFromPoint(point, this.a, this.b, this.c, optionalTarget);
    },
    containsPoint: function(point) {
        return THREE.Triangle.containsPoint(point, this.a, this.b, this.c);
    },
    equals: function(triangle) {
        return triangle.a.equals(this.a) && triangle.b.equals(this.b) && triangle.c.equals(this.c);
    }
}, THREE.Channels = function() {
    this.mask = 1;
}, THREE.Channels.prototype = {
    constructor: THREE.Channels,
    set: function(channel) {
        this.mask = 1 << channel;
    },
    enable: function(channel) {
        this.mask |= 1 << channel;
    },
    toggle: function(channel) {
        this.mask ^= 1 << channel;
    },
    disable: function(channel) {
        this.mask &= ~(1 << channel);
    }
}, THREE.Clock = function(autoStart) {
    this.autoStart = void 0 !== autoStart ? autoStart : !0, this.startTime = 0, this.oldTime = 0, 
    this.elapsedTime = 0, this.running = !1;
}, THREE.Clock.prototype = {
    constructor: THREE.Clock,
    start: function() {
        this.startTime = self.performance.now(), this.oldTime = this.startTime, this.running = !0;
    },
    stop: function() {
        this.getElapsedTime(), this.running = !1;
    },
    getElapsedTime: function() {
        return this.getDelta(), this.elapsedTime;
    },
    getDelta: function() {
        var diff = 0;
        if (this.autoStart && !this.running && this.start(), this.running) {
            var newTime = self.performance.now();
            diff = .001 * (newTime - this.oldTime), this.oldTime = newTime, this.elapsedTime += diff;
        }
        return diff;
    }
}, THREE.EventDispatcher = function() {}, THREE.EventDispatcher.prototype = {
    constructor: THREE.EventDispatcher,
    apply: function(object) {
        object.addEventListener = THREE.EventDispatcher.prototype.addEventListener, object.hasEventListener = THREE.EventDispatcher.prototype.hasEventListener, 
        object.removeEventListener = THREE.EventDispatcher.prototype.removeEventListener, 
        object.dispatchEvent = THREE.EventDispatcher.prototype.dispatchEvent;
    },
    addEventListener: function(type, listener) {
        void 0 === this._listeners && (this._listeners = {});
        var listeners = this._listeners;
        void 0 === listeners[type] && (listeners[type] = []), -1 === listeners[type].indexOf(listener) && listeners[type].push(listener);
    },
    hasEventListener: function(type, listener) {
        if (void 0 === this._listeners) return !1;
        var listeners = this._listeners;
        return void 0 !== listeners[type] && -1 !== listeners[type].indexOf(listener) ? !0 : !1;
    },
    removeEventListener: function(type, listener) {
        if (void 0 !== this._listeners) {
            var listeners = this._listeners, listenerArray = listeners[type];
            if (void 0 !== listenerArray) {
                var index = listenerArray.indexOf(listener);
                -1 !== index && listenerArray.splice(index, 1);
            }
        }
    },
    dispatchEvent: function(event) {
        if (void 0 !== this._listeners) {
            var listeners = this._listeners, listenerArray = listeners[event.type];
            if (void 0 !== listenerArray) {
                event.target = this;
                for (var array = [], length = listenerArray.length, i = 0; length > i; i++) array[i] = listenerArray[i];
                for (var i = 0; length > i; i++) array[i].call(this, event);
            }
        }
    }
}, function(THREE) {
    function descSort(a, b) {
        return a.distance - b.distance;
    }
    function intersectObject(object, raycaster, intersects, recursive) {
        if (object.visible !== !1 && (object.raycast(raycaster, intersects), recursive === !0)) for (var children = object.children, i = 0, l = children.length; l > i; i++) intersectObject(children[i], raycaster, intersects, !0);
    }
    THREE.Raycaster = function(origin, direction, near, far) {
        this.ray = new THREE.Ray(origin, direction), this.near = near || 0, this.far = far || 1 / 0, 
        this.params = {
            Mesh: {},
            Line: {},
            LOD: {},
            Points: {
                threshold: 1
            },
            Sprite: {}
        }, Object.defineProperties(this.params, {
            PointCloud: {
                get: function() {
                    return console.warn("THREE.Raycaster: params.PointCloud has been renamed to params.Points."), 
                    this.Points;
                }
            }
        });
    }, THREE.Raycaster.prototype = {
        constructor: THREE.Raycaster,
        linePrecision: 1,
        set: function(origin, direction) {
            this.ray.set(origin, direction);
        },
        setFromCamera: function(coords, camera) {
            camera instanceof THREE.PerspectiveCamera ? (this.ray.origin.setFromMatrixPosition(camera.matrixWorld), 
            this.ray.direction.set(coords.x, coords.y, .5).unproject(camera).sub(this.ray.origin).normalize()) : camera instanceof THREE.OrthographicCamera ? (this.ray.origin.set(coords.x, coords.y, -1).unproject(camera), 
            this.ray.direction.set(0, 0, -1).transformDirection(camera.matrixWorld)) : console.error("THREE.Raycaster: Unsupported camera type.");
        },
        intersectObject: function(object, recursive) {
            var intersects = [];
            return intersectObject(object, this, intersects, recursive), intersects.sort(descSort), 
            intersects;
        },
        intersectObjects: function(objects, recursive) {
            var intersects = [];
            if (Array.isArray(objects) === !1) return console.warn("THREE.Raycaster.intersectObjects: objects is not an Array."), 
            intersects;
            for (var i = 0, l = objects.length; l > i; i++) intersectObject(objects[i], this, intersects, recursive);
            return intersects.sort(descSort), intersects;
        }
    };
}(THREE), THREE.Object3D = function() {
    function onRotationChange() {
        quaternion.setFromEuler(rotation, !1);
    }
    function onQuaternionChange() {
        rotation.setFromQuaternion(quaternion, void 0, !1);
    }
    Object.defineProperty(this, "id", {
        value: THREE.Object3DIdCount++
    }), this.uuid = THREE.Math.generateUUID(), this.name = "", this.type = "Object3D", 
    this.parent = null, this.channels = new THREE.Channels(), this.children = [], this.up = THREE.Object3D.DefaultUp.clone();
    var position = new THREE.Vector3(), rotation = new THREE.Euler(), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3(1, 1, 1);
    rotation.onChange(onRotationChange), quaternion.onChange(onQuaternionChange), Object.defineProperties(this, {
        position: {
            enumerable: !0,
            value: position
        },
        rotation: {
            enumerable: !0,
            value: rotation
        },
        quaternion: {
            enumerable: !0,
            value: quaternion
        },
        scale: {
            enumerable: !0,
            value: scale
        },
        modelViewMatrix: {
            value: new THREE.Matrix4()
        },
        normalMatrix: {
            value: new THREE.Matrix3()
        }
    }), this.rotationAutoUpdate = !0, this.matrix = new THREE.Matrix4(), this.matrixWorld = new THREE.Matrix4(), 
    this.matrixAutoUpdate = THREE.Object3D.DefaultMatrixAutoUpdate, this.matrixWorldNeedsUpdate = !1, 
    this.visible = !0, this.castShadow = !1, this.receiveShadow = !1, this.frustumCulled = !0, 
    this.renderOrder = 0, this.userData = {};
}, THREE.Object3D.DefaultUp = new THREE.Vector3(0, 1, 0), THREE.Object3D.DefaultMatrixAutoUpdate = !0, 
THREE.Object3D.prototype = {
    constructor: THREE.Object3D,
    get eulerOrder() {
        return console.warn("THREE.Object3D: .eulerOrder is now .rotation.order."), this.rotation.order;
    },
    set eulerOrder(value) {
        console.warn("THREE.Object3D: .eulerOrder is now .rotation.order."), this.rotation.order = value;
    },
    get useQuaternion() {
        console.warn("THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.");
    },
    set useQuaternion(value) {
        console.warn("THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.");
    },
    set renderDepth(value) {
        console.warn("THREE.Object3D: .renderDepth has been removed. Use .renderOrder, instead.");
    },
    applyMatrix: function(matrix) {
        this.matrix.multiplyMatrices(matrix, this.matrix), this.matrix.decompose(this.position, this.quaternion, this.scale);
    },
    setRotationFromAxisAngle: function(axis, angle) {
        this.quaternion.setFromAxisAngle(axis, angle);
    },
    setRotationFromEuler: function(euler) {
        this.quaternion.setFromEuler(euler, !0);
    },
    setRotationFromMatrix: function(m) {
        this.quaternion.setFromRotationMatrix(m);
    },
    setRotationFromQuaternion: function(q) {
        this.quaternion.copy(q);
    },
    rotateOnAxis: function() {
        var q1 = new THREE.Quaternion();
        return function(axis, angle) {
            return q1.setFromAxisAngle(axis, angle), this.quaternion.multiply(q1), this;
        };
    }(),
    rotateX: function() {
        var v1 = new THREE.Vector3(1, 0, 0);
        return function(angle) {
            return this.rotateOnAxis(v1, angle);
        };
    }(),
    rotateY: function() {
        var v1 = new THREE.Vector3(0, 1, 0);
        return function(angle) {
            return this.rotateOnAxis(v1, angle);
        };
    }(),
    rotateZ: function() {
        var v1 = new THREE.Vector3(0, 0, 1);
        return function(angle) {
            return this.rotateOnAxis(v1, angle);
        };
    }(),
    translateOnAxis: function() {
        var v1 = new THREE.Vector3();
        return function(axis, distance) {
            return v1.copy(axis).applyQuaternion(this.quaternion), this.position.add(v1.multiplyScalar(distance)), 
            this;
        };
    }(),
    translate: function(distance, axis) {
        return console.warn("THREE.Object3D: .translate() has been removed. Use .translateOnAxis( axis, distance ) instead."), 
        this.translateOnAxis(axis, distance);
    },
    translateX: function() {
        var v1 = new THREE.Vector3(1, 0, 0);
        return function(distance) {
            return this.translateOnAxis(v1, distance);
        };
    }(),
    translateY: function() {
        var v1 = new THREE.Vector3(0, 1, 0);
        return function(distance) {
            return this.translateOnAxis(v1, distance);
        };
    }(),
    translateZ: function() {
        var v1 = new THREE.Vector3(0, 0, 1);
        return function(distance) {
            return this.translateOnAxis(v1, distance);
        };
    }(),
    localToWorld: function(vector) {
        return vector.applyMatrix4(this.matrixWorld);
    },
    worldToLocal: function() {
        var m1 = new THREE.Matrix4();
        return function(vector) {
            return vector.applyMatrix4(m1.getInverse(this.matrixWorld));
        };
    }(),
    lookAt: function() {
        var m1 = new THREE.Matrix4();
        return function(vector) {
            m1.lookAt(vector, this.position, this.up), this.quaternion.setFromRotationMatrix(m1);
        };
    }(),
    add: function(object) {
        if (arguments.length > 1) {
            for (var i = 0; i < arguments.length; i++) this.add(arguments[i]);
            return this;
        }
        return object === this ? (console.error("THREE.Object3D.add: object can't be added as a child of itself.", object), 
        this) : (object instanceof THREE.Object3D ? (null !== object.parent && object.parent.remove(object), 
        object.parent = this, object.dispatchEvent({
            type: "added"
        }), this.children.push(object)) : console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", object), 
        this);
    },
    remove: function(object) {
        if (arguments.length > 1) for (var i = 0; i < arguments.length; i++) this.remove(arguments[i]);
        var index = this.children.indexOf(object);
        -1 !== index && (object.parent = null, object.dispatchEvent({
            type: "removed"
        }), this.children.splice(index, 1));
    },
    getChildByName: function(name) {
        return console.warn("THREE.Object3D: .getChildByName() has been renamed to .getObjectByName()."), 
        this.getObjectByName(name);
    },
    getObjectById: function(id) {
        return this.getObjectByProperty("id", id);
    },
    getObjectByName: function(name) {
        return this.getObjectByProperty("name", name);
    },
    getObjectByProperty: function(name, value) {
        if (this[name] === value) return this;
        for (var i = 0, l = this.children.length; l > i; i++) {
            var child = this.children[i], object = child.getObjectByProperty(name, value);
            if (void 0 !== object) return object;
        }
        return void 0;
    },
    getWorldPosition: function(optionalTarget) {
        var result = optionalTarget || new THREE.Vector3();
        return this.updateMatrixWorld(!0), result.setFromMatrixPosition(this.matrixWorld);
    },
    getWorldQuaternion: function() {
        var position = new THREE.Vector3(), scale = new THREE.Vector3();
        return function(optionalTarget) {
            var result = optionalTarget || new THREE.Quaternion();
            return this.updateMatrixWorld(!0), this.matrixWorld.decompose(position, result, scale), 
            result;
        };
    }(),
    getWorldRotation: function() {
        var quaternion = new THREE.Quaternion();
        return function(optionalTarget) {
            var result = optionalTarget || new THREE.Euler();
            return this.getWorldQuaternion(quaternion), result.setFromQuaternion(quaternion, this.rotation.order, !1);
        };
    }(),
    getWorldScale: function() {
        var position = new THREE.Vector3(), quaternion = new THREE.Quaternion();
        return function(optionalTarget) {
            var result = optionalTarget || new THREE.Vector3();
            return this.updateMatrixWorld(!0), this.matrixWorld.decompose(position, quaternion, result), 
            result;
        };
    }(),
    getWorldDirection: function() {
        var quaternion = new THREE.Quaternion();
        return function(optionalTarget) {
            var result = optionalTarget || new THREE.Vector3();
            return this.getWorldQuaternion(quaternion), result.set(0, 0, 1).applyQuaternion(quaternion);
        };
    }(),
    raycast: function() {},
    traverse: function(callback) {
        callback(this);
        for (var children = this.children, i = 0, l = children.length; l > i; i++) children[i].traverse(callback);
    },
    traverseVisible: function(callback) {
        if (this.visible !== !1) {
            callback(this);
            for (var children = this.children, i = 0, l = children.length; l > i; i++) children[i].traverseVisible(callback);
        }
    },
    traverseAncestors: function(callback) {
        var parent = this.parent;
        null !== parent && (callback(parent), parent.traverseAncestors(callback));
    },
    updateMatrix: function() {
        this.matrix.compose(this.position, this.quaternion, this.scale), this.matrixWorldNeedsUpdate = !0;
    },
    updateMatrixWorld: function(force) {
        this.matrixAutoUpdate === !0 && this.updateMatrix(), (this.matrixWorldNeedsUpdate === !0 || force === !0) && (null === this.parent ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix), 
        this.matrixWorldNeedsUpdate = !1, force = !0);
        for (var i = 0, l = this.children.length; l > i; i++) this.children[i].updateMatrixWorld(force);
    },
    toJSON: function(meta) {
        function extractFromCache(cache) {
            var values = [];
            for (var key in cache) {
                var data = cache[key];
                delete data.metadata, values.push(data);
            }
            return values;
        }
        var isRootObject = void 0 === meta, output = {};
        isRootObject && (meta = {
            geometries: {},
            materials: {},
            textures: {},
            images: {}
        }, output.metadata = {
            version: 4.4,
            type: "Object",
            generator: "Object3D.toJSON"
        });
        var object = {};
        if (object.uuid = this.uuid, object.type = this.type, "" !== this.name && (object.name = this.name), 
        "{}" !== JSON.stringify(this.userData) && (object.userData = this.userData), this.castShadow === !0 && (object.castShadow = !0), 
        this.receiveShadow === !0 && (object.receiveShadow = !0), this.visible === !1 && (object.visible = !1), 
        object.matrix = this.matrix.toArray(), void 0 !== this.geometry && (void 0 === meta.geometries[this.geometry.uuid] && (meta.geometries[this.geometry.uuid] = this.geometry.toJSON(meta)), 
        object.geometry = this.geometry.uuid), void 0 !== this.material && (void 0 === meta.materials[this.material.uuid] && (meta.materials[this.material.uuid] = this.material.toJSON(meta)), 
        object.material = this.material.uuid), this.children.length > 0) {
            object.children = [];
            for (var i = 0; i < this.children.length; i++) object.children.push(this.children[i].toJSON(meta).object);
        }
        if (isRootObject) {
            var geometries = extractFromCache(meta.geometries), materials = extractFromCache(meta.materials), textures = extractFromCache(meta.textures), images = extractFromCache(meta.images);
            geometries.length > 0 && (output.geometries = geometries), materials.length > 0 && (output.materials = materials), 
            textures.length > 0 && (output.textures = textures), images.length > 0 && (output.images = images);
        }
        return output.object = object, output;
    },
    clone: function(recursive) {
        return new this.constructor().copy(this, recursive);
    },
    copy: function(source, recursive) {
        if (void 0 === recursive && (recursive = !0), this.name = source.name, this.up.copy(source.up), 
        this.position.copy(source.position), this.quaternion.copy(source.quaternion), this.scale.copy(source.scale), 
        this.rotationAutoUpdate = source.rotationAutoUpdate, this.matrix.copy(source.matrix), 
        this.matrixWorld.copy(source.matrixWorld), this.matrixAutoUpdate = source.matrixAutoUpdate, 
        this.matrixWorldNeedsUpdate = source.matrixWorldNeedsUpdate, this.visible = source.visible, 
        this.castShadow = source.castShadow, this.receiveShadow = source.receiveShadow, 
        this.frustumCulled = source.frustumCulled, this.renderOrder = source.renderOrder, 
        this.userData = JSON.parse(JSON.stringify(source.userData)), recursive === !0) for (var i = 0; i < source.children.length; i++) {
            var child = source.children[i];
            this.add(child.clone());
        }
        return this;
    }
}, THREE.EventDispatcher.prototype.apply(THREE.Object3D.prototype), THREE.Object3DIdCount = 0, 
THREE.Face3 = function(a, b, c, normal, color, materialIndex) {
    this.a = a, this.b = b, this.c = c, this.normal = normal instanceof THREE.Vector3 ? normal : new THREE.Vector3(), 
    this.vertexNormals = Array.isArray(normal) ? normal : [], this.color = color instanceof THREE.Color ? color : new THREE.Color(), 
    this.vertexColors = Array.isArray(color) ? color : [], this.materialIndex = void 0 !== materialIndex ? materialIndex : 0;
}, THREE.Face3.prototype = {
    constructor: THREE.Face3,
    clone: function() {
        return new this.constructor().copy(this);
    },
    copy: function(source) {
        this.a = source.a, this.b = source.b, this.c = source.c, this.normal.copy(source.normal), 
        this.color.copy(source.color), this.materialIndex = source.materialIndex;
        for (var i = 0, il = source.vertexNormals.length; il > i; i++) this.vertexNormals[i] = source.vertexNormals[i].clone();
        for (var i = 0, il = source.vertexColors.length; il > i; i++) this.vertexColors[i] = source.vertexColors[i].clone();
        return this;
    }
}, THREE.Face4 = function(a, b, c, d, normal, color, materialIndex) {
    return console.warn("THREE.Face4 has been removed. A THREE.Face3 will be created instead."), 
    new THREE.Face3(a, b, c, normal, color, materialIndex);
}, THREE.BufferAttribute = function(array, itemSize) {
    this.uuid = THREE.Math.generateUUID(), this.array = array, this.itemSize = itemSize, 
    this.dynamic = !1, this.updateRange = {
        offset: 0,
        count: -1
    }, this.version = 0;
}, THREE.BufferAttribute.prototype = {
    constructor: THREE.BufferAttribute,
    get length() {
        return console.warn("THREE.BufferAttribute: .length has been deprecated. Please use .count."), 
        this.array.length;
    },
    get count() {
        return this.array.length / this.itemSize;
    },
    set needsUpdate(value) {
        value === !0 && this.version++;
    },
    setDynamic: function(value) {
        return this.dynamic = value, this;
    },
    copy: function(source) {
        return this.array = new source.array.constructor(source.array), this.itemSize = source.itemSize, 
        this.dynamic = source.dynamic, this;
    },
    copyAt: function(index1, attribute, index2) {
        index1 *= this.itemSize, index2 *= attribute.itemSize;
        for (var i = 0, l = this.itemSize; l > i; i++) this.array[index1 + i] = attribute.array[index2 + i];
        return this;
    },
    copyArray: function(array) {
        return this.array.set(array), this;
    },
    copyColorsArray: function(colors) {
        for (var array = this.array, offset = 0, i = 0, l = colors.length; l > i; i++) {
            var color = colors[i];
            void 0 === color && (console.warn("THREE.BufferAttribute.copyColorsArray(): color is undefined", i), 
            color = new THREE.Color()), array[offset++] = color.r, array[offset++] = color.g, 
            array[offset++] = color.b;
        }
        return this;
    },
    copyIndicesArray: function(indices) {
        for (var array = this.array, offset = 0, i = 0, l = indices.length; l > i; i++) {
            var index = indices[i];
            array[offset++] = index.a, array[offset++] = index.b, array[offset++] = index.c;
        }
        return this;
    },
    copyVector2sArray: function(vectors) {
        for (var array = this.array, offset = 0, i = 0, l = vectors.length; l > i; i++) {
            var vector = vectors[i];
            void 0 === vector && (console.warn("THREE.BufferAttribute.copyVector2sArray(): vector is undefined", i), 
            vector = new THREE.Vector2()), array[offset++] = vector.x, array[offset++] = vector.y;
        }
        return this;
    },
    copyVector3sArray: function(vectors) {
        for (var array = this.array, offset = 0, i = 0, l = vectors.length; l > i; i++) {
            var vector = vectors[i];
            void 0 === vector && (console.warn("THREE.BufferAttribute.copyVector3sArray(): vector is undefined", i), 
            vector = new THREE.Vector3()), array[offset++] = vector.x, array[offset++] = vector.y, 
            array[offset++] = vector.z;
        }
        return this;
    },
    copyVector4sArray: function(vectors) {
        for (var array = this.array, offset = 0, i = 0, l = vectors.length; l > i; i++) {
            var vector = vectors[i];
            void 0 === vector && (console.warn("THREE.BufferAttribute.copyVector4sArray(): vector is undefined", i), 
            vector = new THREE.Vector4()), array[offset++] = vector.x, array[offset++] = vector.y, 
            array[offset++] = vector.z, array[offset++] = vector.w;
        }
        return this;
    },
    set: function(value, offset) {
        return void 0 === offset && (offset = 0), this.array.set(value, offset), this;
    },
    getX: function(index) {
        return this.array[index * this.itemSize];
    },
    setX: function(index, x) {
        return this.array[index * this.itemSize] = x, this;
    },
    getY: function(index) {
        return this.array[index * this.itemSize + 1];
    },
    setY: function(index, y) {
        return this.array[index * this.itemSize + 1] = y, this;
    },
    getZ: function(index) {
        return this.array[index * this.itemSize + 2];
    },
    setZ: function(index, z) {
        return this.array[index * this.itemSize + 2] = z, this;
    },
    getW: function(index) {
        return this.array[index * this.itemSize + 3];
    },
    setW: function(index, w) {
        return this.array[index * this.itemSize + 3] = w, this;
    },
    setXY: function(index, x, y) {
        return index *= this.itemSize, this.array[index + 0] = x, this.array[index + 1] = y, 
        this;
    },
    setXYZ: function(index, x, y, z) {
        return index *= this.itemSize, this.array[index + 0] = x, this.array[index + 1] = y, 
        this.array[index + 2] = z, this;
    },
    setXYZW: function(index, x, y, z, w) {
        return index *= this.itemSize, this.array[index + 0] = x, this.array[index + 1] = y, 
        this.array[index + 2] = z, this.array[index + 3] = w, this;
    },
    clone: function() {
        return new this.constructor().copy(this);
    }
}, THREE.Int8Attribute = function(array, itemSize) {
    return new THREE.BufferAttribute(new Int8Array(array), itemSize);
}, THREE.Uint8Attribute = function(array, itemSize) {
    return new THREE.BufferAttribute(new Uint8Array(array), itemSize);
}, THREE.Uint8ClampedAttribute = function(array, itemSize) {
    return new THREE.BufferAttribute(new Uint8ClampedArray(array), itemSize);
}, THREE.Int16Attribute = function(array, itemSize) {
    return new THREE.BufferAttribute(new Int16Array(array), itemSize);
}, THREE.Uint16Attribute = function(array, itemSize) {
    return new THREE.BufferAttribute(new Uint16Array(array), itemSize);
}, THREE.Int32Attribute = function(array, itemSize) {
    return new THREE.BufferAttribute(new Int32Array(array), itemSize);
}, THREE.Uint32Attribute = function(array, itemSize) {
    return new THREE.BufferAttribute(new Uint32Array(array), itemSize);
}, THREE.Float32Attribute = function(array, itemSize) {
    return new THREE.BufferAttribute(new Float32Array(array), itemSize);
}, THREE.Float64Attribute = function(array, itemSize) {
    return new THREE.BufferAttribute(new Float64Array(array), itemSize);
}, THREE.DynamicBufferAttribute = function(array, itemSize) {
    return console.warn("THREE.DynamicBufferAttribute has been removed. Use new THREE.BufferAttribute().setDynamic( true ) instead."), 
    new THREE.BufferAttribute(array, itemSize).setDynamic(!0);
}, THREE.InstancedBufferAttribute = function(array, itemSize, meshPerAttribute) {
    THREE.BufferAttribute.call(this, array, itemSize), this.meshPerAttribute = meshPerAttribute || 1;
}, THREE.InstancedBufferAttribute.prototype = Object.create(THREE.BufferAttribute.prototype), 
THREE.InstancedBufferAttribute.prototype.constructor = THREE.InstancedBufferAttribute, 
THREE.InstancedBufferAttribute.prototype.copy = function(source) {
    return THREE.BufferAttribute.prototype.copy.call(this, source), this.meshPerAttribute = source.meshPerAttribute, 
    this;
}, THREE.InterleavedBuffer = function(array, stride) {
    this.uuid = THREE.Math.generateUUID(), this.array = array, this.stride = stride, 
    this.dynamic = !1, this.updateRange = {
        offset: 0,
        count: -1
    }, this.version = 0;
}, THREE.InterleavedBuffer.prototype = {
    constructor: THREE.InterleavedBuffer,
    get length() {
        return this.array.length;
    },
    get count() {
        return this.array.length / this.stride;
    },
    set needsUpdate(value) {
        value === !0 && this.version++;
    },
    setDynamic: function(value) {
        return this.dynamic = value, this;
    },
    copy: function(source) {
        this.array = new source.array.constructor(source.array), this.stride = source.stride, 
        this.dynamic = source.dynamic;
    },
    copyAt: function(index1, attribute, index2) {
        index1 *= this.stride, index2 *= attribute.stride;
        for (var i = 0, l = this.stride; l > i; i++) this.array[index1 + i] = attribute.array[index2 + i];
        return this;
    },
    set: function(value, offset) {
        return void 0 === offset && (offset = 0), this.array.set(value, offset), this;
    },
    clone: function() {
        return new this.constructor().copy(this);
    }
}, THREE.InstancedInterleavedBuffer = function(array, stride, meshPerAttribute) {
    THREE.InterleavedBuffer.call(this, array, stride), this.meshPerAttribute = meshPerAttribute || 1;
}, THREE.InstancedInterleavedBuffer.prototype = Object.create(THREE.InterleavedBuffer.prototype), 
THREE.InstancedInterleavedBuffer.prototype.constructor = THREE.InstancedInterleavedBuffer, 
THREE.InstancedInterleavedBuffer.prototype.copy = function(source) {
    return THREE.InterleavedBuffer.prototype.copy.call(this, source), this.meshPerAttribute = source.meshPerAttribute, 
    this;
}, THREE.InterleavedBufferAttribute = function(interleavedBuffer, itemSize, offset) {
    this.uuid = THREE.Math.generateUUID(), this.data = interleavedBuffer, this.itemSize = itemSize, 
    this.offset = offset;
}, THREE.InterleavedBufferAttribute.prototype = {
    constructor: THREE.InterleavedBufferAttribute,
    get length() {
        return console.warn("THREE.BufferAttribute: .length has been deprecated. Please use .count."), 
        this.array.length;
    },
    get count() {
        return this.data.array.length / this.data.stride;
    },
    setX: function(index, x) {
        return this.data.array[index * this.data.stride + this.offset] = x, this;
    },
    setY: function(index, y) {
        return this.data.array[index * this.data.stride + this.offset + 1] = y, this;
    },
    setZ: function(index, z) {
        return this.data.array[index * this.data.stride + this.offset + 2] = z, this;
    },
    setW: function(index, w) {
        return this.data.array[index * this.data.stride + this.offset + 3] = w, this;
    },
    getX: function(index) {
        return this.data.array[index * this.data.stride + this.offset];
    },
    getY: function(index) {
        return this.data.array[index * this.data.stride + this.offset + 1];
    },
    getZ: function(index) {
        return this.data.array[index * this.data.stride + this.offset + 2];
    },
    getW: function(index) {
        return this.data.array[index * this.data.stride + this.offset + 3];
    },
    setXY: function(index, x, y) {
        return index = index * this.data.stride + this.offset, this.data.array[index + 0] = x, 
        this.data.array[index + 1] = y, this;
    },
    setXYZ: function(index, x, y, z) {
        return index = index * this.data.stride + this.offset, this.data.array[index + 0] = x, 
        this.data.array[index + 1] = y, this.data.array[index + 2] = z, this;
    },
    setXYZW: function(index, x, y, z, w) {
        return index = index * this.data.stride + this.offset, this.data.array[index + 0] = x, 
        this.data.array[index + 1] = y, this.data.array[index + 2] = z, this.data.array[index + 3] = w, 
        this;
    }
}, THREE.Geometry = function() {
    Object.defineProperty(this, "id", {
        value: THREE.GeometryIdCount++
    }), this.uuid = THREE.Math.generateUUID(), this.name = "", this.type = "Geometry", 
    this.vertices = [], this.colors = [], this.faces = [], this.faceVertexUvs = [ [] ], 
    this.morphTargets = [], this.morphNormals = [], this.skinWeights = [], this.skinIndices = [], 
    this.lineDistances = [], this.boundingBox = null, this.boundingSphere = null, this.verticesNeedUpdate = !1, 
    this.elementsNeedUpdate = !1, this.uvsNeedUpdate = !1, this.normalsNeedUpdate = !1, 
    this.colorsNeedUpdate = !1, this.lineDistancesNeedUpdate = !1, this.groupsNeedUpdate = !1;
}, THREE.Geometry.prototype = {
    constructor: THREE.Geometry,
    applyMatrix: function(matrix) {
        for (var normalMatrix = new THREE.Matrix3().getNormalMatrix(matrix), i = 0, il = this.vertices.length; il > i; i++) {
            var vertex = this.vertices[i];
            vertex.applyMatrix4(matrix);
        }
        for (var i = 0, il = this.faces.length; il > i; i++) {
            var face = this.faces[i];
            face.normal.applyMatrix3(normalMatrix).normalize();
            for (var j = 0, jl = face.vertexNormals.length; jl > j; j++) face.vertexNormals[j].applyMatrix3(normalMatrix).normalize();
        }
        null !== this.boundingBox && this.computeBoundingBox(), null !== this.boundingSphere && this.computeBoundingSphere(), 
        this.verticesNeedUpdate = !0, this.normalsNeedUpdate = !0;
    },
    rotateX: function() {
        var m1;
        return function(angle) {
            return void 0 === m1 && (m1 = new THREE.Matrix4()), m1.makeRotationX(angle), this.applyMatrix(m1), 
            this;
        };
    }(),
    rotateY: function() {
        var m1;
        return function(angle) {
            return void 0 === m1 && (m1 = new THREE.Matrix4()), m1.makeRotationY(angle), this.applyMatrix(m1), 
            this;
        };
    }(),
    rotateZ: function() {
        var m1;
        return function(angle) {
            return void 0 === m1 && (m1 = new THREE.Matrix4()), m1.makeRotationZ(angle), this.applyMatrix(m1), 
            this;
        };
    }(),
    translate: function() {
        var m1;
        return function(x, y, z) {
            return void 0 === m1 && (m1 = new THREE.Matrix4()), m1.makeTranslation(x, y, z), 
            this.applyMatrix(m1), this;
        };
    }(),
    scale: function() {
        var m1;
        return function(x, y, z) {
            return void 0 === m1 && (m1 = new THREE.Matrix4()), m1.makeScale(x, y, z), this.applyMatrix(m1), 
            this;
        };
    }(),
    lookAt: function() {
        var obj;
        return function(vector) {
            void 0 === obj && (obj = new THREE.Object3D()), obj.lookAt(vector), obj.updateMatrix(), 
            this.applyMatrix(obj.matrix);
        };
    }(),
    fromBufferGeometry: function(geometry) {
        function addFace(a, b, c) {
            var vertexNormals = void 0 !== normals ? [ tempNormals[a].clone(), tempNormals[b].clone(), tempNormals[c].clone() ] : [], vertexColors = void 0 !== colors ? [ scope.colors[a].clone(), scope.colors[b].clone(), scope.colors[c].clone() ] : [], face = new THREE.Face3(a, b, c, vertexNormals, vertexColors);
            scope.faces.push(face), void 0 !== uvs && scope.faceVertexUvs[0].push([ tempUVs[a].clone(), tempUVs[b].clone(), tempUVs[c].clone() ]), 
            void 0 !== uvs2 && scope.faceVertexUvs[1].push([ tempUVs2[a].clone(), tempUVs2[b].clone(), tempUVs2[c].clone() ]);
        }
        var scope = this, indices = null !== geometry.index ? geometry.index.array : void 0, attributes = geometry.attributes, vertices = attributes.position.array, normals = void 0 !== attributes.normal ? attributes.normal.array : void 0, colors = void 0 !== attributes.color ? attributes.color.array : void 0, uvs = void 0 !== attributes.uv ? attributes.uv.array : void 0, uvs2 = void 0 !== attributes.uv2 ? attributes.uv2.array : void 0;
        void 0 !== uvs2 && (this.faceVertexUvs[1] = []);
        for (var tempNormals = [], tempUVs = [], tempUVs2 = [], i = 0, j = 0, k = 0; i < vertices.length; i += 3, 
        j += 2, k += 4) scope.vertices.push(new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2])), 
        void 0 !== normals && tempNormals.push(new THREE.Vector3(normals[i], normals[i + 1], normals[i + 2])), 
        void 0 !== colors && scope.colors.push(new THREE.Color(colors[i], colors[i + 1], colors[i + 2])), 
        void 0 !== uvs && tempUVs.push(new THREE.Vector2(uvs[j], uvs[j + 1])), void 0 !== uvs2 && tempUVs2.push(new THREE.Vector2(uvs2[j], uvs2[j + 1]));
        if (void 0 !== indices) {
            var groups = geometry.groups;
            if (groups.length > 0) for (var i = 0; i < groups.length; i++) for (var group = groups[i], start = group.start, count = group.count, j = start, jl = start + count; jl > j; j += 3) addFace(indices[j], indices[j + 1], indices[j + 2]); else for (var i = 0; i < indices.length; i += 3) addFace(indices[i], indices[i + 1], indices[i + 2]);
        } else for (var i = 0; i < vertices.length / 3; i += 3) addFace(i, i + 1, i + 2);
        return this.computeFaceNormals(), null !== geometry.boundingBox && (this.boundingBox = geometry.boundingBox.clone()), 
        null !== geometry.boundingSphere && (this.boundingSphere = geometry.boundingSphere.clone()), 
        this;
    },
    center: function() {
        this.computeBoundingBox();
        var offset = this.boundingBox.center().negate();
        return this.translate(offset.x, offset.y, offset.z), offset;
    },
    normalize: function() {
        this.computeBoundingSphere();
        var center = this.boundingSphere.center, radius = this.boundingSphere.radius, s = 0 === radius ? 1 : 1 / radius, matrix = new THREE.Matrix4();
        return matrix.set(s, 0, 0, -s * center.x, 0, s, 0, -s * center.y, 0, 0, s, -s * center.z, 0, 0, 0, 1), 
        this.applyMatrix(matrix), this;
    },
    computeFaceNormals: function() {
        for (var cb = new THREE.Vector3(), ab = new THREE.Vector3(), f = 0, fl = this.faces.length; fl > f; f++) {
            var face = this.faces[f], vA = this.vertices[face.a], vB = this.vertices[face.b], vC = this.vertices[face.c];
            cb.subVectors(vC, vB), ab.subVectors(vA, vB), cb.cross(ab), cb.normalize(), face.normal.copy(cb);
        }
    },
    computeVertexNormals: function(areaWeighted) {
        var v, vl, f, fl, face, vertices;
        for (vertices = new Array(this.vertices.length), v = 0, vl = this.vertices.length; vl > v; v++) vertices[v] = new THREE.Vector3();
        if (areaWeighted) {
            var vA, vB, vC, cb = new THREE.Vector3(), ab = new THREE.Vector3();
            for (f = 0, fl = this.faces.length; fl > f; f++) face = this.faces[f], vA = this.vertices[face.a], 
            vB = this.vertices[face.b], vC = this.vertices[face.c], cb.subVectors(vC, vB), ab.subVectors(vA, vB), 
            cb.cross(ab), vertices[face.a].add(cb), vertices[face.b].add(cb), vertices[face.c].add(cb);
        } else for (f = 0, fl = this.faces.length; fl > f; f++) face = this.faces[f], vertices[face.a].add(face.normal), 
        vertices[face.b].add(face.normal), vertices[face.c].add(face.normal);
        for (v = 0, vl = this.vertices.length; vl > v; v++) vertices[v].normalize();
        for (f = 0, fl = this.faces.length; fl > f; f++) {
            face = this.faces[f];
            var vertexNormals = face.vertexNormals;
            3 === vertexNormals.length ? (vertexNormals[0].copy(vertices[face.a]), vertexNormals[1].copy(vertices[face.b]), 
            vertexNormals[2].copy(vertices[face.c])) : (vertexNormals[0] = vertices[face.a].clone(), 
            vertexNormals[1] = vertices[face.b].clone(), vertexNormals[2] = vertices[face.c].clone());
        }
    },
    computeMorphNormals: function() {
        var i, il, f, fl, face;
        for (f = 0, fl = this.faces.length; fl > f; f++) for (face = this.faces[f], face.__originalFaceNormal ? face.__originalFaceNormal.copy(face.normal) : face.__originalFaceNormal = face.normal.clone(), 
        face.__originalVertexNormals || (face.__originalVertexNormals = []), i = 0, il = face.vertexNormals.length; il > i; i++) face.__originalVertexNormals[i] ? face.__originalVertexNormals[i].copy(face.vertexNormals[i]) : face.__originalVertexNormals[i] = face.vertexNormals[i].clone();
        var tmpGeo = new THREE.Geometry();
        for (tmpGeo.faces = this.faces, i = 0, il = this.morphTargets.length; il > i; i++) {
            if (!this.morphNormals[i]) {
                this.morphNormals[i] = {}, this.morphNormals[i].faceNormals = [], this.morphNormals[i].vertexNormals = [];
                var faceNormal, vertexNormals, dstNormalsFace = this.morphNormals[i].faceNormals, dstNormalsVertex = this.morphNormals[i].vertexNormals;
                for (f = 0, fl = this.faces.length; fl > f; f++) faceNormal = new THREE.Vector3(), 
                vertexNormals = {
                    a: new THREE.Vector3(),
                    b: new THREE.Vector3(),
                    c: new THREE.Vector3()
                }, dstNormalsFace.push(faceNormal), dstNormalsVertex.push(vertexNormals);
            }
            var morphNormals = this.morphNormals[i];
            tmpGeo.vertices = this.morphTargets[i].vertices, tmpGeo.computeFaceNormals(), tmpGeo.computeVertexNormals();
            var faceNormal, vertexNormals;
            for (f = 0, fl = this.faces.length; fl > f; f++) face = this.faces[f], faceNormal = morphNormals.faceNormals[f], 
            vertexNormals = morphNormals.vertexNormals[f], faceNormal.copy(face.normal), vertexNormals.a.copy(face.vertexNormals[0]), 
            vertexNormals.b.copy(face.vertexNormals[1]), vertexNormals.c.copy(face.vertexNormals[2]);
        }
        for (f = 0, fl = this.faces.length; fl > f; f++) face = this.faces[f], face.normal = face.__originalFaceNormal, 
        face.vertexNormals = face.__originalVertexNormals;
    },
    computeTangents: function() {
        console.warn("THREE.Geometry: .computeTangents() has been removed.");
    },
    computeLineDistances: function() {
        for (var d = 0, vertices = this.vertices, i = 0, il = vertices.length; il > i; i++) i > 0 && (d += vertices[i].distanceTo(vertices[i - 1])), 
        this.lineDistances[i] = d;
    },
    computeBoundingBox: function() {
        null === this.boundingBox && (this.boundingBox = new THREE.Box3()), this.boundingBox.setFromPoints(this.vertices);
    },
    computeBoundingSphere: function() {
        null === this.boundingSphere && (this.boundingSphere = new THREE.Sphere()), this.boundingSphere.setFromPoints(this.vertices);
    },
    merge: function(geometry, matrix, materialIndexOffset) {
        if (geometry instanceof THREE.Geometry == !1) return void console.error("THREE.Geometry.merge(): geometry not an instance of THREE.Geometry.", geometry);
        var normalMatrix, vertexOffset = this.vertices.length, vertices1 = this.vertices, vertices2 = geometry.vertices, faces1 = this.faces, faces2 = geometry.faces, uvs1 = this.faceVertexUvs[0], uvs2 = geometry.faceVertexUvs[0];
        void 0 === materialIndexOffset && (materialIndexOffset = 0), void 0 !== matrix && (normalMatrix = new THREE.Matrix3().getNormalMatrix(matrix));
        for (var i = 0, il = vertices2.length; il > i; i++) {
            var vertex = vertices2[i], vertexCopy = vertex.clone();
            void 0 !== matrix && vertexCopy.applyMatrix4(matrix), vertices1.push(vertexCopy);
        }
        for (i = 0, il = faces2.length; il > i; i++) {
            var faceCopy, normal, color, face = faces2[i], faceVertexNormals = face.vertexNormals, faceVertexColors = face.vertexColors;
            faceCopy = new THREE.Face3(face.a + vertexOffset, face.b + vertexOffset, face.c + vertexOffset), 
            faceCopy.normal.copy(face.normal), void 0 !== normalMatrix && faceCopy.normal.applyMatrix3(normalMatrix).normalize();
            for (var j = 0, jl = faceVertexNormals.length; jl > j; j++) normal = faceVertexNormals[j].clone(), 
            void 0 !== normalMatrix && normal.applyMatrix3(normalMatrix).normalize(), faceCopy.vertexNormals.push(normal);
            faceCopy.color.copy(face.color);
            for (var j = 0, jl = faceVertexColors.length; jl > j; j++) color = faceVertexColors[j], 
            faceCopy.vertexColors.push(color.clone());
            faceCopy.materialIndex = face.materialIndex + materialIndexOffset, faces1.push(faceCopy);
        }
        for (i = 0, il = uvs2.length; il > i; i++) {
            var uv = uvs2[i], uvCopy = [];
            if (void 0 !== uv) {
                for (var j = 0, jl = uv.length; jl > j; j++) uvCopy.push(uv[j].clone());
                uvs1.push(uvCopy);
            }
        }
    },
    mergeMesh: function(mesh) {
        return mesh instanceof THREE.Mesh == !1 ? void console.error("THREE.Geometry.mergeMesh(): mesh not an instance of THREE.Mesh.", mesh) : (mesh.matrixAutoUpdate && mesh.updateMatrix(), 
        void this.merge(mesh.geometry, mesh.matrix));
    },
    mergeVertices: function() {
        var v, key, i, il, face, indices, j, jl, verticesMap = {}, unique = [], changes = [], precisionPoints = 4, precision = Math.pow(10, precisionPoints);
        for (i = 0, il = this.vertices.length; il > i; i++) v = this.vertices[i], key = Math.round(v.x * precision) + "_" + Math.round(v.y * precision) + "_" + Math.round(v.z * precision), 
        void 0 === verticesMap[key] ? (verticesMap[key] = i, unique.push(this.vertices[i]), 
        changes[i] = unique.length - 1) : changes[i] = changes[verticesMap[key]];
        var faceIndicesToRemove = [];
        for (i = 0, il = this.faces.length; il > i; i++) {
            face = this.faces[i], face.a = changes[face.a], face.b = changes[face.b], face.c = changes[face.c], 
            indices = [ face.a, face.b, face.c ];
            for (var dupIndex = -1, n = 0; 3 > n; n++) if (indices[n] === indices[(n + 1) % 3]) {
                dupIndex = n, faceIndicesToRemove.push(i);
                break;
            }
        }
        for (i = faceIndicesToRemove.length - 1; i >= 0; i--) {
            var idx = faceIndicesToRemove[i];
            for (this.faces.splice(idx, 1), j = 0, jl = this.faceVertexUvs.length; jl > j; j++) this.faceVertexUvs[j].splice(idx, 1);
        }
        var diff = this.vertices.length - unique.length;
        return this.vertices = unique, diff;
    },
    sortFacesByMaterialIndex: function() {
        function materialIndexSort(a, b) {
            return a.materialIndex - b.materialIndex;
        }
        for (var faces = this.faces, length = faces.length, i = 0; length > i; i++) faces[i]._id = i;
        faces.sort(materialIndexSort);
        var newUvs1, newUvs2, uvs1 = this.faceVertexUvs[0], uvs2 = this.faceVertexUvs[1];
        uvs1 && uvs1.length === length && (newUvs1 = []), uvs2 && uvs2.length === length && (newUvs2 = []);
        for (var i = 0; length > i; i++) {
            var id = faces[i]._id;
            newUvs1 && newUvs1.push(uvs1[id]), newUvs2 && newUvs2.push(uvs2[id]);
        }
        newUvs1 && (this.faceVertexUvs[0] = newUvs1), newUvs2 && (this.faceVertexUvs[1] = newUvs2);
    },
    toJSON: function() {
        function setBit(value, position, enabled) {
            return enabled ? value | 1 << position : value & ~(1 << position);
        }
        function getNormalIndex(normal) {
            var hash = normal.x.toString() + normal.y.toString() + normal.z.toString();
            return void 0 !== normalsHash[hash] ? normalsHash[hash] : (normalsHash[hash] = normals.length / 3, 
            normals.push(normal.x, normal.y, normal.z), normalsHash[hash]);
        }
        function getColorIndex(color) {
            var hash = color.r.toString() + color.g.toString() + color.b.toString();
            return void 0 !== colorsHash[hash] ? colorsHash[hash] : (colorsHash[hash] = colors.length, 
            colors.push(color.getHex()), colorsHash[hash]);
        }
        function getUvIndex(uv) {
            var hash = uv.x.toString() + uv.y.toString();
            return void 0 !== uvsHash[hash] ? uvsHash[hash] : (uvsHash[hash] = uvs.length / 2, 
            uvs.push(uv.x, uv.y), uvsHash[hash]);
        }
        var data = {
            metadata: {
                version: 4.4,
                type: "Geometry",
                generator: "Geometry.toJSON"
            }
        };
        if (data.uuid = this.uuid, data.type = this.type, "" !== this.name && (data.name = this.name), 
        void 0 !== this.parameters) {
            var parameters = this.parameters;
            for (var key in parameters) void 0 !== parameters[key] && (data[key] = parameters[key]);
            return data;
        }
        for (var vertices = [], i = 0; i < this.vertices.length; i++) {
            var vertex = this.vertices[i];
            vertices.push(vertex.x, vertex.y, vertex.z);
        }
        for (var faces = [], normals = [], normalsHash = {}, colors = [], colorsHash = {}, uvs = [], uvsHash = {}, i = 0; i < this.faces.length; i++) {
            var face = this.faces[i], hasMaterial = !1, hasFaceUv = !1, hasFaceVertexUv = void 0 !== this.faceVertexUvs[0][i], hasFaceNormal = face.normal.length() > 0, hasFaceVertexNormal = face.vertexNormals.length > 0, hasFaceColor = 1 !== face.color.r || 1 !== face.color.g || 1 !== face.color.b, hasFaceVertexColor = face.vertexColors.length > 0, faceType = 0;
            if (faceType = setBit(faceType, 0, 0), faceType = setBit(faceType, 1, hasMaterial), 
            faceType = setBit(faceType, 2, hasFaceUv), faceType = setBit(faceType, 3, hasFaceVertexUv), 
            faceType = setBit(faceType, 4, hasFaceNormal), faceType = setBit(faceType, 5, hasFaceVertexNormal), 
            faceType = setBit(faceType, 6, hasFaceColor), faceType = setBit(faceType, 7, hasFaceVertexColor), 
            faces.push(faceType), faces.push(face.a, face.b, face.c), hasFaceVertexUv) {
                var faceVertexUvs = this.faceVertexUvs[0][i];
                faces.push(getUvIndex(faceVertexUvs[0]), getUvIndex(faceVertexUvs[1]), getUvIndex(faceVertexUvs[2]));
            }
            if (hasFaceNormal && faces.push(getNormalIndex(face.normal)), hasFaceVertexNormal) {
                var vertexNormals = face.vertexNormals;
                faces.push(getNormalIndex(vertexNormals[0]), getNormalIndex(vertexNormals[1]), getNormalIndex(vertexNormals[2]));
            }
            if (hasFaceColor && faces.push(getColorIndex(face.color)), hasFaceVertexColor) {
                var vertexColors = face.vertexColors;
                faces.push(getColorIndex(vertexColors[0]), getColorIndex(vertexColors[1]), getColorIndex(vertexColors[2]));
            }
        }
        return data.data = {}, data.data.vertices = vertices, data.data.normals = normals, 
        colors.length > 0 && (data.data.colors = colors), uvs.length > 0 && (data.data.uvs = [ uvs ]), 
        data.data.faces = faces, data;
    },
    clone: function() {
        return new this.constructor().copy(this);
    },
    copy: function(source) {
        this.vertices = [], this.faces = [], this.faceVertexUvs = [ [] ];
        for (var vertices = source.vertices, i = 0, il = vertices.length; il > i; i++) this.vertices.push(vertices[i].clone());
        for (var faces = source.faces, i = 0, il = faces.length; il > i; i++) this.faces.push(faces[i].clone());
        for (var i = 0, il = source.faceVertexUvs.length; il > i; i++) {
            var faceVertexUvs = source.faceVertexUvs[i];
            void 0 === this.faceVertexUvs[i] && (this.faceVertexUvs[i] = []);
            for (var j = 0, jl = faceVertexUvs.length; jl > j; j++) {
                for (var uvs = faceVertexUvs[j], uvsCopy = [], k = 0, kl = uvs.length; kl > k; k++) {
                    var uv = uvs[k];
                    uvsCopy.push(uv.clone());
                }
                this.faceVertexUvs[i].push(uvsCopy);
            }
        }
        return this;
    },
    dispose: function() {
        this.dispatchEvent({
            type: "dispose"
        });
    }
}, THREE.EventDispatcher.prototype.apply(THREE.Geometry.prototype), THREE.GeometryIdCount = 0, 
THREE.DirectGeometry = function() {
    Object.defineProperty(this, "id", {
        value: THREE.GeometryIdCount++
    }), this.uuid = THREE.Math.generateUUID(), this.name = "", this.type = "DirectGeometry", 
    this.indices = [], this.vertices = [], this.normals = [], this.colors = [], this.uvs = [], 
    this.uvs2 = [], this.groups = [], this.morphTargets = {}, this.skinWeights = [], 
    this.skinIndices = [], this.boundingBox = null, this.boundingSphere = null, this.verticesNeedUpdate = !1, 
    this.normalsNeedUpdate = !1, this.colorsNeedUpdate = !1, this.uvsNeedUpdate = !1, 
    this.groupsNeedUpdate = !1;
}, THREE.DirectGeometry.prototype = {
    constructor: THREE.DirectGeometry,
    computeBoundingBox: THREE.Geometry.prototype.computeBoundingBox,
    computeBoundingSphere: THREE.Geometry.prototype.computeBoundingSphere,
    computeFaceNormals: function() {
        console.warn("THREE.DirectGeometry: computeFaceNormals() is not a method of this type of geometry.");
    },
    computeVertexNormals: function() {
        console.warn("THREE.DirectGeometry: computeVertexNormals() is not a method of this type of geometry.");
    },
    computeGroups: function(geometry) {
        for (var group, materialIndex, groups = [], faces = geometry.faces, i = 0; i < faces.length; i++) {
            var face = faces[i];
            face.materialIndex !== materialIndex && (materialIndex = face.materialIndex, void 0 !== group && (group.count = 3 * i - group.start, 
            groups.push(group)), group = {
                start: 3 * i,
                materialIndex: materialIndex
            });
        }
        void 0 !== group && (group.count = 3 * i - group.start, groups.push(group)), this.groups = groups;
    },
    fromGeometry: function(geometry) {
        var faces = geometry.faces, vertices = geometry.vertices, faceVertexUvs = geometry.faceVertexUvs, hasFaceVertexUv = faceVertexUvs[0] && faceVertexUvs[0].length > 0, hasFaceVertexUv2 = faceVertexUvs[1] && faceVertexUvs[1].length > 0, morphTargets = geometry.morphTargets, morphTargetsLength = morphTargets.length;
        if (morphTargetsLength > 0) {
            for (var morphTargetsPosition = [], i = 0; morphTargetsLength > i; i++) morphTargetsPosition[i] = [];
            this.morphTargets.position = morphTargetsPosition;
        }
        var morphNormals = geometry.morphNormals, morphNormalsLength = morphNormals.length;
        if (morphNormalsLength > 0) {
            for (var morphTargetsNormal = [], i = 0; morphNormalsLength > i; i++) morphTargetsNormal[i] = [];
            this.morphTargets.normal = morphTargetsNormal;
        }
        for (var skinIndices = geometry.skinIndices, skinWeights = geometry.skinWeights, hasSkinIndices = skinIndices.length === vertices.length, hasSkinWeights = skinWeights.length === vertices.length, i = 0; i < faces.length; i++) {
            var face = faces[i];
            this.vertices.push(vertices[face.a], vertices[face.b], vertices[face.c]);
            var vertexNormals = face.vertexNormals;
            if (3 === vertexNormals.length) this.normals.push(vertexNormals[0], vertexNormals[1], vertexNormals[2]); else {
                var normal = face.normal;
                this.normals.push(normal, normal, normal);
            }
            var vertexColors = face.vertexColors;
            if (3 === vertexColors.length) this.colors.push(vertexColors[0], vertexColors[1], vertexColors[2]); else {
                var color = face.color;
                this.colors.push(color, color, color);
            }
            if (hasFaceVertexUv === !0) {
                var vertexUvs = faceVertexUvs[0][i];
                void 0 !== vertexUvs ? this.uvs.push(vertexUvs[0], vertexUvs[1], vertexUvs[2]) : (console.warn("THREE.DirectGeometry.fromGeometry(): Undefined vertexUv ", i), 
                this.uvs.push(new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()));
            }
            if (hasFaceVertexUv2 === !0) {
                var vertexUvs = faceVertexUvs[1][i];
                void 0 !== vertexUvs ? this.uvs2.push(vertexUvs[0], vertexUvs[1], vertexUvs[2]) : (console.warn("THREE.DirectGeometry.fromGeometry(): Undefined vertexUv2 ", i), 
                this.uvs2.push(new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()));
            }
            for (var j = 0; morphTargetsLength > j; j++) {
                var morphTarget = morphTargets[j].vertices;
                morphTargetsPosition[j].push(morphTarget[face.a], morphTarget[face.b], morphTarget[face.c]);
            }
            for (var j = 0; morphNormalsLength > j; j++) {
                var morphNormal = morphNormals[j].vertexNormals[i];
                morphTargetsNormal[j].push(morphNormal.a, morphNormal.b, morphNormal.c);
            }
            hasSkinIndices && this.skinIndices.push(skinIndices[face.a], skinIndices[face.b], skinIndices[face.c]), 
            hasSkinWeights && this.skinWeights.push(skinWeights[face.a], skinWeights[face.b], skinWeights[face.c]);
        }
        return this.computeGroups(geometry), this.verticesNeedUpdate = geometry.verticesNeedUpdate, 
        this.normalsNeedUpdate = geometry.normalsNeedUpdate, this.colorsNeedUpdate = geometry.colorsNeedUpdate, 
        this.uvsNeedUpdate = geometry.uvsNeedUpdate, this.groupsNeedUpdate = geometry.groupsNeedUpdate, 
        this;
    },
    dispose: function() {
        this.dispatchEvent({
            type: "dispose"
        });
    }
}, THREE.EventDispatcher.prototype.apply(THREE.DirectGeometry.prototype), THREE.BufferGeometry = function() {
    Object.defineProperty(this, "id", {
        value: THREE.GeometryIdCount++
    }), this.uuid = THREE.Math.generateUUID(), this.name = "", this.type = "BufferGeometry", 
    this.index = null, this.attributes = {}, this.morphAttributes = {}, this.groups = [], 
    this.boundingBox = null, this.boundingSphere = null, this.drawRange = {
        start: 0,
        count: 1 / 0
    };
}, THREE.BufferGeometry.prototype = {
    constructor: THREE.BufferGeometry,
    addIndex: function(index) {
        console.warn("THREE.BufferGeometry: .addIndex() has been renamed to .setIndex()."), 
        this.setIndex(index);
    },
    getIndex: function() {
        return this.index;
    },
    setIndex: function(index) {
        this.index = index;
    },
    addAttribute: function(name, attribute) {
        return attribute instanceof THREE.BufferAttribute == !1 && attribute instanceof THREE.InterleavedBufferAttribute == !1 ? (console.warn("THREE.BufferGeometry: .addAttribute() now expects ( name, attribute )."), 
        void this.addAttribute(name, new THREE.BufferAttribute(arguments[1], arguments[2]))) : "index" === name ? (console.warn("THREE.BufferGeometry.addAttribute: Use .setIndex() for index attribute."), 
        void this.setIndex(attribute)) : void (this.attributes[name] = attribute);
    },
    getAttribute: function(name) {
        return this.attributes[name];
    },
    removeAttribute: function(name) {
        delete this.attributes[name];
    },
    get drawcalls() {
        return console.error("THREE.BufferGeometry: .drawcalls has been renamed to .groups."), 
        this.groups;
    },
    get offsets() {
        return console.warn("THREE.BufferGeometry: .offsets has been renamed to .groups."), 
        this.groups;
    },
    addDrawCall: function(start, count, indexOffset) {
        void 0 !== indexOffset && console.warn("THREE.BufferGeometry: .addDrawCall() no longer supports indexOffset."), 
        console.warn("THREE.BufferGeometry: .addDrawCall() is now .addGroup()."), this.addGroup(start, count);
    },
    clearDrawCalls: function() {
        console.warn("THREE.BufferGeometry: .clearDrawCalls() is now .clearGroups()."), 
        this.clearGroups();
    },
    addGroup: function(start, count, materialIndex) {
        this.groups.push({
            start: start,
            count: count,
            materialIndex: void 0 !== materialIndex ? materialIndex : 0
        });
    },
    clearGroups: function() {
        this.groups = [];
    },
    setDrawRange: function(start, count) {
        this.drawRange.start = start, this.drawRange.count = count;
    },
    applyMatrix: function(matrix) {
        var position = this.attributes.position;
        void 0 !== position && (matrix.applyToVector3Array(position.array), position.needsUpdate = !0);
        var normal = this.attributes.normal;
        if (void 0 !== normal) {
            var normalMatrix = new THREE.Matrix3().getNormalMatrix(matrix);
            normalMatrix.applyToVector3Array(normal.array), normal.needsUpdate = !0;
        }
        null !== this.boundingBox && this.computeBoundingBox(), null !== this.boundingSphere && this.computeBoundingSphere();
    },
    rotateX: function() {
        var m1;
        return function(angle) {
            return void 0 === m1 && (m1 = new THREE.Matrix4()), m1.makeRotationX(angle), this.applyMatrix(m1), 
            this;
        };
    }(),
    rotateY: function() {
        var m1;
        return function(angle) {
            return void 0 === m1 && (m1 = new THREE.Matrix4()), m1.makeRotationY(angle), this.applyMatrix(m1), 
            this;
        };
    }(),
    rotateZ: function() {
        var m1;
        return function(angle) {
            return void 0 === m1 && (m1 = new THREE.Matrix4()), m1.makeRotationZ(angle), this.applyMatrix(m1), 
            this;
        };
    }(),
    translate: function() {
        var m1;
        return function(x, y, z) {
            return void 0 === m1 && (m1 = new THREE.Matrix4()), m1.makeTranslation(x, y, z), 
            this.applyMatrix(m1), this;
        };
    }(),
    scale: function() {
        var m1;
        return function(x, y, z) {
            return void 0 === m1 && (m1 = new THREE.Matrix4()), m1.makeScale(x, y, z), this.applyMatrix(m1), 
            this;
        };
    }(),
    lookAt: function() {
        var obj;
        return function(vector) {
            void 0 === obj && (obj = new THREE.Object3D()), obj.lookAt(vector), obj.updateMatrix(), 
            this.applyMatrix(obj.matrix);
        };
    }(),
    center: function() {
        this.computeBoundingBox();
        var offset = this.boundingBox.center().negate();
        return this.translate(offset.x, offset.y, offset.z), offset;
    },
    setFromObject: function(object) {
        var geometry = object.geometry;
        if (object instanceof THREE.Points || object instanceof THREE.Line) {
            var positions = new THREE.Float32Attribute(3 * geometry.vertices.length, 3), colors = new THREE.Float32Attribute(3 * geometry.colors.length, 3);
            if (this.addAttribute("position", positions.copyVector3sArray(geometry.vertices)), 
            this.addAttribute("color", colors.copyColorsArray(geometry.colors)), geometry.lineDistances && geometry.lineDistances.length === geometry.vertices.length) {
                var lineDistances = new THREE.Float32Attribute(geometry.lineDistances.length, 1);
                this.addAttribute("lineDistance", lineDistances.copyArray(geometry.lineDistances));
            }
            null !== geometry.boundingSphere && (this.boundingSphere = geometry.boundingSphere.clone()), 
            null !== geometry.boundingBox && (this.boundingBox = geometry.boundingBox.clone());
        } else object instanceof THREE.Mesh && geometry instanceof THREE.Geometry && this.fromGeometry(geometry);
        return this;
    },
    updateFromObject: function(object) {
        var geometry = object.geometry;
        if (object instanceof THREE.Mesh) {
            var direct = geometry.__directGeometry;
            if (void 0 === direct) return this.fromGeometry(geometry);
            direct.verticesNeedUpdate = geometry.verticesNeedUpdate, direct.normalsNeedUpdate = geometry.normalsNeedUpdate, 
            direct.colorsNeedUpdate = geometry.colorsNeedUpdate, direct.uvsNeedUpdate = geometry.uvsNeedUpdate, 
            direct.groupsNeedUpdate = geometry.groupsNeedUpdate, geometry.verticesNeedUpdate = !1, 
            geometry.normalsNeedUpdate = !1, geometry.colorsNeedUpdate = !1, geometry.uvsNeedUpdate = !1, 
            geometry.groupsNeedUpdate = !1, geometry = direct;
        }
        if (geometry.verticesNeedUpdate === !0) {
            var attribute = this.attributes.position;
            void 0 !== attribute && (attribute.copyVector3sArray(geometry.vertices), attribute.needsUpdate = !0), 
            geometry.verticesNeedUpdate = !1;
        }
        if (geometry.normalsNeedUpdate === !0) {
            var attribute = this.attributes.normal;
            void 0 !== attribute && (attribute.copyVector3sArray(geometry.normals), attribute.needsUpdate = !0), 
            geometry.normalsNeedUpdate = !1;
        }
        if (geometry.colorsNeedUpdate === !0) {
            var attribute = this.attributes.color;
            void 0 !== attribute && (attribute.copyColorsArray(geometry.colors), attribute.needsUpdate = !0), 
            geometry.colorsNeedUpdate = !1;
        }
        if (geometry.uvsNeedUpdate) {
            var attribute = this.attributes.uv;
            void 0 !== attribute && (attribute.copyVector2sArray(geometry.uvs), attribute.needsUpdate = !0), 
            geometry.uvsNeedUpdate = !1;
        }
        if (geometry.lineDistancesNeedUpdate) {
            var attribute = this.attributes.lineDistance;
            void 0 !== attribute && (attribute.copyArray(geometry.lineDistances), attribute.needsUpdate = !0), 
            geometry.lineDistancesNeedUpdate = !1;
        }
        return geometry.groupsNeedUpdate && (geometry.computeGroups(object.geometry), this.groups = geometry.groups, 
        geometry.groupsNeedUpdate = !1), this;
    },
    fromGeometry: function(geometry) {
        return geometry.__directGeometry = new THREE.DirectGeometry().fromGeometry(geometry), 
        this.fromDirectGeometry(geometry.__directGeometry);
    },
    fromDirectGeometry: function(geometry) {
        var positions = new Float32Array(3 * geometry.vertices.length);
        if (this.addAttribute("position", new THREE.BufferAttribute(positions, 3).copyVector3sArray(geometry.vertices)), 
        geometry.normals.length > 0) {
            var normals = new Float32Array(3 * geometry.normals.length);
            this.addAttribute("normal", new THREE.BufferAttribute(normals, 3).copyVector3sArray(geometry.normals));
        }
        if (geometry.colors.length > 0) {
            var colors = new Float32Array(3 * geometry.colors.length);
            this.addAttribute("color", new THREE.BufferAttribute(colors, 3).copyColorsArray(geometry.colors));
        }
        if (geometry.uvs.length > 0) {
            var uvs = new Float32Array(2 * geometry.uvs.length);
            this.addAttribute("uv", new THREE.BufferAttribute(uvs, 2).copyVector2sArray(geometry.uvs));
        }
        if (geometry.uvs2.length > 0) {
            var uvs2 = new Float32Array(2 * geometry.uvs2.length);
            this.addAttribute("uv2", new THREE.BufferAttribute(uvs2, 2).copyVector2sArray(geometry.uvs2));
        }
        if (geometry.indices.length > 0) {
            var TypeArray = geometry.vertices.length > 65535 ? Uint32Array : Uint16Array, indices = new TypeArray(3 * geometry.indices.length);
            this.setIndex(new THREE.BufferAttribute(indices, 1).copyIndicesArray(geometry.indices));
        }
        this.groups = geometry.groups;
        for (var name in geometry.morphTargets) {
            for (var array = [], morphTargets = geometry.morphTargets[name], i = 0, l = morphTargets.length; l > i; i++) {
                var morphTarget = morphTargets[i], attribute = new THREE.Float32Attribute(3 * morphTarget.length, 3);
                array.push(attribute.copyVector3sArray(morphTarget));
            }
            this.morphAttributes[name] = array;
        }
        if (geometry.skinIndices.length > 0) {
            var skinIndices = new THREE.Float32Attribute(4 * geometry.skinIndices.length, 4);
            this.addAttribute("skinIndex", skinIndices.copyVector4sArray(geometry.skinIndices));
        }
        if (geometry.skinWeights.length > 0) {
            var skinWeights = new THREE.Float32Attribute(4 * geometry.skinWeights.length, 4);
            this.addAttribute("skinWeight", skinWeights.copyVector4sArray(geometry.skinWeights));
        }
        return null !== geometry.boundingSphere && (this.boundingSphere = geometry.boundingSphere.clone()), 
        null !== geometry.boundingBox && (this.boundingBox = geometry.boundingBox.clone()), 
        this;
    },
    computeBoundingBox: function() {
        var vector = new THREE.Vector3();
        return function() {
            null === this.boundingBox && (this.boundingBox = new THREE.Box3());
            var positions = this.attributes.position.array;
            if (positions) {
                var bb = this.boundingBox;
                bb.makeEmpty();
                for (var i = 0, il = positions.length; il > i; i += 3) vector.fromArray(positions, i), 
                bb.expandByPoint(vector);
            }
            (void 0 === positions || 0 === positions.length) && (this.boundingBox.min.set(0, 0, 0), 
            this.boundingBox.max.set(0, 0, 0)), (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && console.error('THREE.BufferGeometry.computeBoundingBox: Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
        };
    }(),
    computeBoundingSphere: function() {
        var box = new THREE.Box3(), vector = new THREE.Vector3();
        return function() {
            null === this.boundingSphere && (this.boundingSphere = new THREE.Sphere());
            var positions = this.attributes.position.array;
            if (positions) {
                box.makeEmpty();
                for (var center = this.boundingSphere.center, i = 0, il = positions.length; il > i; i += 3) vector.fromArray(positions, i), 
                box.expandByPoint(vector);
                box.center(center);
                for (var maxRadiusSq = 0, i = 0, il = positions.length; il > i; i += 3) vector.fromArray(positions, i), 
                maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(vector));
                this.boundingSphere.radius = Math.sqrt(maxRadiusSq), isNaN(this.boundingSphere.radius) && console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
            }
        };
    }(),
    computeFaceNormals: function() {},
    computeVertexNormals: function() {
        var index = this.index, attributes = this.attributes, groups = this.groups;
        if (attributes.position) {
            var positions = attributes.position.array;
            if (void 0 === attributes.normal) this.addAttribute("normal", new THREE.BufferAttribute(new Float32Array(positions.length), 3)); else for (var normals = attributes.normal.array, i = 0, il = normals.length; il > i; i++) normals[i] = 0;
            var vA, vB, vC, normals = attributes.normal.array, pA = new THREE.Vector3(), pB = new THREE.Vector3(), pC = new THREE.Vector3(), cb = new THREE.Vector3(), ab = new THREE.Vector3();
            if (index) {
                var indices = index.array;
                0 === groups.length && this.addGroup(0, indices.length);
                for (var j = 0, jl = groups.length; jl > j; ++j) for (var group = groups[j], start = group.start, count = group.count, i = start, il = start + count; il > i; i += 3) vA = 3 * indices[i + 0], 
                vB = 3 * indices[i + 1], vC = 3 * indices[i + 2], pA.fromArray(positions, vA), pB.fromArray(positions, vB), 
                pC.fromArray(positions, vC), cb.subVectors(pC, pB), ab.subVectors(pA, pB), cb.cross(ab), 
                normals[vA] += cb.x, normals[vA + 1] += cb.y, normals[vA + 2] += cb.z, normals[vB] += cb.x, 
                normals[vB + 1] += cb.y, normals[vB + 2] += cb.z, normals[vC] += cb.x, normals[vC + 1] += cb.y, 
                normals[vC + 2] += cb.z;
            } else for (var i = 0, il = positions.length; il > i; i += 9) pA.fromArray(positions, i), 
            pB.fromArray(positions, i + 3), pC.fromArray(positions, i + 6), cb.subVectors(pC, pB), 
            ab.subVectors(pA, pB), cb.cross(ab), normals[i] = cb.x, normals[i + 1] = cb.y, normals[i + 2] = cb.z, 
            normals[i + 3] = cb.x, normals[i + 4] = cb.y, normals[i + 5] = cb.z, normals[i + 6] = cb.x, 
            normals[i + 7] = cb.y, normals[i + 8] = cb.z;
            this.normalizeNormals(), attributes.normal.needsUpdate = !0;
        }
    },
    computeTangents: function() {
        console.warn("THREE.BufferGeometry: .computeTangents() has been removed.");
    },
    computeOffsets: function(size) {
        console.warn("THREE.BufferGeometry: .computeOffsets() has been removed.");
    },
    merge: function(geometry, offset) {
        if (geometry instanceof THREE.BufferGeometry == !1) return void console.error("THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.", geometry);
        void 0 === offset && (offset = 0);
        var attributes = this.attributes;
        for (var key in attributes) if (void 0 !== geometry.attributes[key]) for (var attribute1 = attributes[key], attributeArray1 = attribute1.array, attribute2 = geometry.attributes[key], attributeArray2 = attribute2.array, attributeSize = attribute2.itemSize, i = 0, j = attributeSize * offset; i < attributeArray2.length; i++, 
        j++) attributeArray1[j] = attributeArray2[i];
        return this;
    },
    normalizeNormals: function() {
        for (var x, y, z, n, normals = this.attributes.normal.array, i = 0, il = normals.length; il > i; i += 3) x = normals[i], 
        y = normals[i + 1], z = normals[i + 2], n = 1 / Math.sqrt(x * x + y * y + z * z), 
        normals[i] *= n, normals[i + 1] *= n, normals[i + 2] *= n;
    },
    toJSON: function() {
        var data = {
            metadata: {
                version: 4.4,
                type: "BufferGeometry",
                generator: "BufferGeometry.toJSON"
            }
        };
        if (data.uuid = this.uuid, data.type = this.type, "" !== this.name && (data.name = this.name), 
        void 0 !== this.parameters) {
            var parameters = this.parameters;
            for (var key in parameters) void 0 !== parameters[key] && (data[key] = parameters[key]);
            return data;
        }
        data.data = {
            attributes: {}
        };
        var index = this.index;
        if (null !== index) {
            var array = Array.prototype.slice.call(index.array);
            data.data.index = {
                type: index.array.constructor.name,
                array: array
            };
        }
        var attributes = this.attributes;
        for (var key in attributes) {
            var attribute = attributes[key], array = Array.prototype.slice.call(attribute.array);
            data.data.attributes[key] = {
                itemSize: attribute.itemSize,
                type: attribute.array.constructor.name,
                array: array
            };
        }
        var groups = this.groups;
        groups.length > 0 && (data.data.groups = JSON.parse(JSON.stringify(groups)));
        var boundingSphere = this.boundingSphere;
        return null !== boundingSphere && (data.data.boundingSphere = {
            center: boundingSphere.center.toArray(),
            radius: boundingSphere.radius
        }), data;
    },
    clone: function() {
        return new this.constructor().copy(this);
    },
    copy: function(source) {
        var index = source.index;
        null !== index && this.setIndex(index.clone());
        var attributes = source.attributes;
        for (var name in attributes) {
            var attribute = attributes[name];
            this.addAttribute(name, attribute.clone());
        }
        for (var groups = source.groups, i = 0, l = groups.length; l > i; i++) {
            var group = groups[i];
            this.addGroup(group.start, group.count);
        }
        return this;
    },
    dispose: function() {
        this.dispatchEvent({
            type: "dispose"
        });
    }
}, THREE.EventDispatcher.prototype.apply(THREE.BufferGeometry.prototype), THREE.BufferGeometry.MaxIndex = 65535, 
THREE.InstancedBufferGeometry = function() {
    THREE.BufferGeometry.call(this), this.type = "InstancedBufferGeometry", this.maxInstancedCount = void 0;
}, THREE.InstancedBufferGeometry.prototype = Object.create(THREE.BufferGeometry.prototype), 
THREE.InstancedBufferGeometry.prototype.constructor = THREE.InstancedBufferGeometry, 
THREE.InstancedBufferGeometry.prototype.addGroup = function(start, count, instances) {
    this.groups.push({
        start: start,
        count: count,
        instances: instances
    });
}, THREE.InstancedBufferGeometry.prototype.copy = function(source) {
    var index = source.index;
    null !== index && this.setIndex(index.clone());
    var attributes = source.attributes;
    for (var name in attributes) {
        var attribute = attributes[name];
        this.addAttribute(name, attribute.clone());
    }
    for (var groups = source.groups, i = 0, l = groups.length; l > i; i++) {
        var group = groups[i];
        this.addGroup(group.start, group.count, group.instances);
    }
    return this;
}, THREE.EventDispatcher.prototype.apply(THREE.InstancedBufferGeometry.prototype), 
THREE.AnimationAction = function(clip, startTime, timeScale, weight, loop) {
    if (void 0 === clip) throw new Error("clip is null");
    this.clip = clip, this.localRoot = null, this.startTime = startTime || 0, this.timeScale = timeScale || 1, 
    this.weight = weight || 1, this.loop = loop || THREE.LoopRepeat, this.loopCount = 0, 
    this.enabled = !0, this.actionTime = -this.startTime, this.clipTime = 0, this.propertyBindings = [];
}, THREE.AnimationAction.prototype = {
    constructor: THREE.AnimationAction,
    setLocalRoot: function(localRoot) {
        return this.localRoot = localRoot, this;
    },
    updateTime: function(clipDeltaTime) {
        var previousClipTime = this.clipTime, previousLoopCount = this.loopCount, duration = (this.actionTime, 
        this.clip.duration);
        if (this.actionTime = this.actionTime + clipDeltaTime, this.loop === THREE.LoopOnce) return this.loopCount = 0, 
        this.clipTime = Math.min(Math.max(this.actionTime, 0), duration), this.clipTime !== previousClipTime && (this.clipTime === duration ? this.mixer.dispatchEvent({
            type: "finished",
            action: this,
            direction: 1
        }) : 0 === this.clipTime && this.mixer.dispatchEvent({
            type: "finished",
            action: this,
            direction: -1
        })), this.clipTime;
        this.loopCount = Math.floor(this.actionTime / duration);
        var newClipTime = this.actionTime - this.loopCount * duration;
        return newClipTime %= duration, this.loop == THREE.LoopPingPong && 1 === Math.abs(this.loopCount % 2) && (newClipTime = duration - newClipTime), 
        this.clipTime = newClipTime, this.loopCount !== previousLoopCount && this.mixer.dispatchEvent({
            type: "loop",
            action: this,
            loopDelta: this.loopCount - this.loopCount
        }), this.clipTime;
    },
    syncWith: function(action) {
        return this.actionTime = action.actionTime, this.timeScale = action.timeScale, this;
    },
    warpToDuration: function(duration) {
        return this.timeScale = this.clip.duration / duration, this;
    },
    init: function(time) {
        return this.clipTime = time - this.startTime, this;
    },
    update: function(clipDeltaTime) {
        this.updateTime(clipDeltaTime);
        var clipResults = this.clip.getAt(this.clipTime);
        return clipResults;
    },
    getTimeScaleAt: function(time) {
        return this.timeScale.getAt ? this.timeScale.getAt(time) : this.timeScale;
    },
    getWeightAt: function(time) {
        return this.weight.getAt ? this.weight.getAt(time) : this.weight;
    }
}, THREE.AnimationClip = function(name, duration, tracks) {
    if (this.name = name, this.tracks = tracks, this.duration = void 0 !== duration ? duration : -1, 
    this.duration < 0) for (var i = 0; i < this.tracks.length; i++) {
        var track = this.tracks[i];
        this.duration = Math.max(track.keys[track.keys.length - 1].time);
    }
    this.trim(), this.optimize(), this.results = [];
}, THREE.AnimationClip.prototype = {
    constructor: THREE.AnimationClip,
    getAt: function(clipTime) {
        clipTime = Math.max(0, Math.min(clipTime, this.duration));
        for (var i = 0; i < this.tracks.length; i++) {
            var track = this.tracks[i];
            this.results[i] = track.getAt(clipTime);
        }
        return this.results;
    },
    trim: function() {
        for (var i = 0; i < this.tracks.length; i++) this.tracks[i].trim(0, this.duration);
        return this;
    },
    optimize: function() {
        for (var i = 0; i < this.tracks.length; i++) this.tracks[i].optimize();
        return this;
    }
}, THREE.AnimationClip.CreateFromMorphTargetSequence = function(name, morphTargetSequence, fps) {
    for (var numMorphTargets = morphTargetSequence.length, tracks = [], i = 0; numMorphTargets > i; i++) {
        var keys = [];
        keys.push({
            time: (i + numMorphTargets - 1) % numMorphTargets,
            value: 0
        }), keys.push({
            time: i,
            value: 1
        }), keys.push({
            time: (i + 1) % numMorphTargets,
            value: 0
        }), keys.sort(THREE.KeyframeTrack.keyComparer), 0 === keys[0].time && keys.push({
            time: numMorphTargets,
            value: keys[0].value
        }), tracks.push(new THREE.NumberKeyframeTrack(".morphTargetInfluences[" + morphTargetSequence[i].name + "]", keys).scale(1 / fps));
    }
    return new THREE.AnimationClip(name, -1, tracks);
}, THREE.AnimationClip.findByName = function(clipArray, name) {
    for (var i = 0; i < clipArray.length; i++) if (clipArray[i].name === name) return clipArray[i];
    return null;
}, THREE.AnimationClip.CreateClipsFromMorphTargetSequences = function(morphTargets, fps) {
    for (var animationToMorphTargets = {}, pattern = /^([\w-]*?)([\d]+)$/, i = 0, il = morphTargets.length; il > i; i++) {
        var morphTarget = morphTargets[i], parts = morphTarget.name.match(pattern);
        if (parts && parts.length > 1) {
            var name = parts[1], animationMorphTargets = animationToMorphTargets[name];
            animationMorphTargets || (animationToMorphTargets[name] = animationMorphTargets = []), 
            animationMorphTargets.push(morphTarget);
        }
    }
    var clips = [];
    for (var name in animationToMorphTargets) clips.push(THREE.AnimationClip.CreateFromMorphTargetSequence(name, animationToMorphTargets[name], fps));
    return clips;
}, THREE.AnimationClip.parse = function(json) {
    for (var tracks = [], i = 0; i < json.tracks.length; i++) tracks.push(THREE.KeyframeTrack.parse(json.tracks[i]).scale(1 / json.fps));
    return new THREE.AnimationClip(json.name, json.duration, tracks);
}, THREE.AnimationClip.parseAnimation = function(animation, bones, nodeName) {
    if (!animation) return console.error("  no animation in JSONLoader data"), null;
    for (var convertTrack = function(trackName, animationKeys, propertyName, trackType, animationKeyToValueFunc) {
        for (var keys = [], k = 0; k < animationKeys.length; k++) {
            var animationKey = animationKeys[k];
            void 0 !== animationKey[propertyName] && keys.push({
                time: animationKey.time,
                value: animationKeyToValueFunc(animationKey)
            });
        }
        return keys.length > 0 ? new trackType(trackName, keys) : null;
    }, tracks = [], clipName = animation.name || "default", duration = animation.length || -1, fps = animation.fps || 30, hierarchyTracks = animation.hierarchy || [], h = 0; h < hierarchyTracks.length; h++) {
        var animationKeys = hierarchyTracks[h].keys;
        if (animationKeys && 0 != animationKeys.length) if (animationKeys[0].morphTargets) {
            for (var morphTargetNames = {}, k = 0; k < animationKeys.length; k++) if (animationKeys[k].morphTargets) for (var m = 0; m < animationKeys[k].morphTargets.length; m++) morphTargetNames[animationKeys[k].morphTargets[m]] = -1;
            for (var morphTargetName in morphTargetNames) {
                for (var keys = [], m = 0; m < animationKeys[k].morphTargets.length; m++) {
                    var animationKey = animationKeys[k];
                    keys.push({
                        time: animationKey.time,
                        value: animationKey.morphTarget === morphTargetName ? 1 : 0
                    });
                }
                tracks.push(new THREE.NumberKeyframeTrack(nodeName + ".morphTargetInfluence[" + morphTargetName + "]", keys));
            }
            duration = morphTargetNames.length * (fps || 1);
        } else {
            var boneName = nodeName + ".bones[" + bones[h].name + "]", positionTrack = convertTrack(boneName + ".position", animationKeys, "pos", THREE.VectorKeyframeTrack, function(animationKey) {
                return new THREE.Vector3().fromArray(animationKey.pos);
            });
            positionTrack && tracks.push(positionTrack);
            var quaternionTrack = convertTrack(boneName + ".quaternion", animationKeys, "rot", THREE.QuaternionKeyframeTrack, function(animationKey) {
                return animationKey.rot.slerp ? animationKey.rot.clone() : new THREE.Quaternion().fromArray(animationKey.rot);
            });
            quaternionTrack && tracks.push(quaternionTrack);
            var scaleTrack = convertTrack(boneName + ".scale", animationKeys, "scl", THREE.VectorKeyframeTrack, function(animationKey) {
                return new THREE.Vector3().fromArray(animationKey.scl);
            });
            scaleTrack && tracks.push(scaleTrack);
        }
    }
    if (0 === tracks.length) return null;
    var clip = new THREE.AnimationClip(clipName, duration, tracks);
    return clip;
}, THREE.AnimationMixer = function(root) {
    this.root = root, this.time = 0, this.timeScale = 1, this.actions = [], this.propertyBindingMap = {};
}, THREE.AnimationMixer.prototype = {
    constructor: THREE.AnimationMixer,
    addAction: function(action) {
        this.actions.push(action), action.init(this.time), action.mixer = this;
        for (var tracks = action.clip.tracks, root = action.localRoot || this.root, i = 0; i < tracks.length; i++) {
            var track = tracks[i], propertyBindingKey = root.uuid + "-" + track.name, propertyBinding = this.propertyBindingMap[propertyBindingKey];
            void 0 === propertyBinding && (propertyBinding = new THREE.PropertyBinding(root, track.name), 
            this.propertyBindingMap[propertyBindingKey] = propertyBinding), action.propertyBindings.push(propertyBinding), 
            propertyBinding.referenceCount += 1;
        }
    },
    removeAllActions: function() {
        for (var i = 0; i < this.actions.length; i++) this.actions[i].mixer = null;
        for (var properyBindingKey in this.propertyBindingMap) this.propertyBindingMap[properyBindingKey].unbind();
        return this.actions = [], this.propertyBindingMap = {}, this;
    },
    removeAction: function(action) {
        var index = this.actions.indexOf(action);
        -1 !== index && (this.actions.splice(index, 1), action.mixer = null);
        for (var root = action.localRoot || this.root, tracks = action.clip.tracks, i = 0; i < tracks.length; i++) {
            var track = tracks[i], propertyBindingKey = root.uuid + "-" + track.name, propertyBinding = this.propertyBindingMap[propertyBindingKey];
            propertyBinding.referenceCount -= 1, propertyBinding.referenceCount <= 0 && (propertyBinding.unbind(), 
            delete this.propertyBindingMap[propertyBindingKey]);
        }
        return this;
    },
    findActionByName: function(name) {
        for (var i = 0; i < this.actions.length; i++) if (this.actions[i].name === name) return this.actions[i];
        return null;
    },
    play: function(action, optionalFadeInDuration) {
        return action.startTime = this.time, this.addAction(action), this;
    },
    fadeOut: function(action, duration) {
        var keys = [];
        return keys.push({
            time: this.time,
            value: 1
        }), keys.push({
            time: this.time + duration,
            value: 0
        }), action.weight = new THREE.NumberKeyframeTrack("weight", keys), this;
    },
    fadeIn: function(action, duration) {
        var keys = [];
        return keys.push({
            time: this.time,
            value: 0
        }), keys.push({
            time: this.time + duration,
            value: 1
        }), action.weight = new THREE.NumberKeyframeTrack("weight", keys), this;
    },
    warp: function(action, startTimeScale, endTimeScale, duration) {
        var keys = [];
        return keys.push({
            time: this.time,
            value: startTimeScale
        }), keys.push({
            time: this.time + duration,
            value: endTimeScale
        }), action.timeScale = new THREE.NumberKeyframeTrack("timeScale", keys), this;
    },
    crossFade: function(fadeOutAction, fadeInAction, duration, warp) {
        if (this.fadeOut(fadeOutAction, duration), this.fadeIn(fadeInAction, duration), 
        warp) {
            var startEndRatio = fadeOutAction.clip.duration / fadeInAction.clip.duration, endStartRatio = 1 / startEndRatio;
            this.warp(fadeOutAction, 1, startEndRatio, duration), this.warp(fadeInAction, endStartRatio, 1, duration);
        }
        return this;
    },
    update: function(deltaTime) {
        var mixerDeltaTime = deltaTime * this.timeScale;
        this.time += mixerDeltaTime;
        for (var i = 0; i < this.actions.length; i++) {
            var action = this.actions[i], weight = action.getWeightAt(this.time), actionTimeScale = action.getTimeScaleAt(this.time), actionDeltaTime = mixerDeltaTime * actionTimeScale, actionResults = action.update(actionDeltaTime);
            if (!(action.weight <= 0) && action.enabled) for (var j = 0; j < actionResults.length; j++) {
                action.clip.tracks[j].name;
                action.propertyBindings[j].accumulate(actionResults[j], weight);
            }
        }
        for (var propertyBindingKey in this.propertyBindingMap) this.propertyBindingMap[propertyBindingKey].apply();
        return this;
    }
}, THREE.EventDispatcher.prototype.apply(THREE.AnimationMixer.prototype), THREE.AnimationUtils = {
    getEqualsFunc: function(exemplarValue) {
        return exemplarValue.equals ? function(a, b) {
            return a.equals(b);
        } : function(a, b) {
            return a === b;
        };
    },
    clone: function(exemplarValue) {
        var typeName = typeof exemplarValue;
        if ("object" === typeName) {
            if (exemplarValue.clone) return exemplarValue.clone();
            console.error("can not figure out how to copy exemplarValue", exemplarValue);
        }
        return exemplarValue;
    },
    lerp: function(a, b, alpha, interTrack) {
        var lerpFunc = THREE.AnimationUtils.getLerpFunc(a, interTrack);
        return lerpFunc(a, b, alpha);
    },
    lerp_object: function(a, b, alpha) {
        return a.lerp(b, alpha);
    },
    slerp_object: function(a, b, alpha) {
        return a.slerp(b, alpha);
    },
    lerp_number: function(a, b, alpha) {
        return a * (1 - alpha) + b * alpha;
    },
    lerp_boolean: function(a, b, alpha) {
        return .5 > alpha ? a : b;
    },
    lerp_boolean_immediate: function(a, b, alpha) {
        return a;
    },
    lerp_string: function(a, b, alpha) {
        return .5 > alpha ? a : b;
    },
    lerp_string_immediate: function(a, b, alpha) {
        return a;
    },
    getLerpFunc: function(exemplarValue, interTrack) {
        if (void 0 === exemplarValue || null === exemplarValue) throw new Error("examplarValue is null");
        var typeName = typeof exemplarValue;
        switch (typeName) {
          case "object":
            if (exemplarValue.lerp) return THREE.AnimationUtils.lerp_object;
            if (exemplarValue.slerp) return THREE.AnimationUtils.slerp_object;
            break;

          case "number":
            return THREE.AnimationUtils.lerp_number;

          case "boolean":
            return interTrack ? THREE.AnimationUtils.lerp_boolean : THREE.AnimationUtils.lerp_boolean_immediate;

          case "string":
            return interTrack ? THREE.AnimationUtils.lerp_string : THREE.AnimationUtils.lerp_string_immediate;
        }
    }
}, THREE.KeyframeTrack = function(name, keys) {
    if (void 0 === name) throw new Error("track name is undefined");
    if (void 0 === keys || 0 === keys.length) throw new Error("no keys in track named " + name);
    this.name = name, this.keys = keys, this.lastIndex = 0, this.validate(), this.optimize();
}, THREE.KeyframeTrack.prototype = {
    constructor: THREE.KeyframeTrack,
    getAt: function(time) {
        for (;this.lastIndex < this.keys.length && time >= this.keys[this.lastIndex].time; ) this.lastIndex++;
        for (;this.lastIndex > 0 && time < this.keys[this.lastIndex - 1].time; ) this.lastIndex--;
        if (this.lastIndex >= this.keys.length) return this.setResult(this.keys[this.keys.length - 1].value), 
        this.result;
        if (0 === this.lastIndex) return this.setResult(this.keys[0].value), this.result;
        var prevKey = this.keys[this.lastIndex - 1];
        if (this.setResult(prevKey.value), prevKey.constantToNext) return this.result;
        var currentKey = this.keys[this.lastIndex], alpha = (time - prevKey.time) / (currentKey.time - prevKey.time);
        return this.result = this.lerpValues(this.result, currentKey.value, alpha), this.result;
    },
    shift: function(timeOffset) {
        if (0 !== timeOffset) for (var i = 0; i < this.keys.length; i++) this.keys[i].time += timeOffset;
        return this;
    },
    scale: function(timeScale) {
        if (1 !== timeScale) for (var i = 0; i < this.keys.length; i++) this.keys[i].time *= timeScale;
        return this;
    },
    trim: function(startTime, endTime) {
        for (var firstKeysToRemove = 0, i = 1; i < this.keys.length; i++) this.keys[i] <= startTime && firstKeysToRemove++;
        for (var lastKeysToRemove = 0, i = this.keys.length - 2; i > 0 && this.keys[i] >= endTime; i++) lastKeysToRemove++;
        return firstKeysToRemove + lastKeysToRemove > 0 && (this.keys = this.keys.splice(firstKeysToRemove, this.keys.length - lastKeysToRemove - firstKeysToRemove)), 
        this;
    },
    validate: function() {
        var prevKey = null;
        if (0 === this.keys.length) return void console.error("  track is empty, no keys", this);
        for (var i = 0; i < this.keys.length; i++) {
            var currKey = this.keys[i];
            if (!currKey) return void console.error("  key is null in track", this, i);
            if ("number" != typeof currKey.time || isNaN(currKey.time)) return void console.error("  key.time is not a valid number", this, i, currKey);
            if (void 0 === currKey.value || null === currKey.value) return void console.error("  key.value is null in track", this, i, currKey);
            if (prevKey && prevKey.time > currKey.time) return void console.error("  key.time is less than previous key time, out of order keys", this, i, currKey, prevKey);
            prevKey = currKey;
        }
        return this;
    },
    optimize: function() {
        var newKeys = [], prevKey = this.keys[0];
        newKeys.push(prevKey);
        for (var i = (THREE.AnimationUtils.getEqualsFunc(prevKey.value), 1); i < this.keys.length - 1; i++) {
            var currKey = this.keys[i], nextKey = this.keys[i + 1];
            prevKey.time !== currKey.time && (this.compareValues(prevKey.value, currKey.value) && this.compareValues(currKey.value, nextKey.value) || (prevKey.constantToNext = this.compareValues(prevKey.value, currKey.value), 
            newKeys.push(currKey), prevKey = currKey));
        }
        return newKeys.push(this.keys[this.keys.length - 1]), this.keys = newKeys, this;
    }
}, THREE.KeyframeTrack.keyComparer = function(key0, key1) {
    return key0.time - key1.time;
}, THREE.KeyframeTrack.parse = function(json) {
    if (void 0 === json.type) throw new Error("track type undefined, can not parse");
    var trackType = THREE.KeyframeTrack.GetTrackTypeForTypeName(json.type);
    return trackType.parse(json);
}, THREE.KeyframeTrack.GetTrackTypeForTypeName = function(typeName) {
    switch (typeName.toLowerCase()) {
      case "vector":
      case "vector2":
      case "vector3":
      case "vector4":
        return THREE.VectorKeyframeTrack;

      case "quaternion":
        return THREE.QuaternionKeyframeTrack;

      case "integer":
      case "scalar":
      case "double":
      case "float":
      case "number":
        return THREE.NumberKeyframeTrack;

      case "bool":
      case "boolean":
        return THREE.BooleanKeyframeTrack;

      case "string":
        return THREE.StringKeyframeTrack;
    }
    throw new Error("Unsupported typeName: " + typeName);
}, THREE.PropertyBinding = function(rootNode, trackName) {
    this.rootNode = rootNode, this.trackName = trackName, this.referenceCount = 0, this.originalValue = null;
    var parseResults = THREE.PropertyBinding.parseTrackName(trackName);
    this.directoryName = parseResults.directoryName, this.nodeName = parseResults.nodeName, 
    this.objectName = parseResults.objectName, this.objectIndex = parseResults.objectIndex, 
    this.propertyName = parseResults.propertyName, this.propertyIndex = parseResults.propertyIndex, 
    this.node = THREE.PropertyBinding.findNode(rootNode, this.nodeName) || rootNode, 
    this.cumulativeValue = null, this.cumulativeWeight = 0;
}, THREE.PropertyBinding.prototype = {
    constructor: THREE.PropertyBinding,
    reset: function() {
        this.cumulativeValue = null, this.cumulativeWeight = 0;
    },
    accumulate: function(value, weight) {
        if (this.isBound || this.bind(), 0 === this.cumulativeWeight) weight > 0 && (null === this.cumulativeValue && (this.cumulativeValue = THREE.AnimationUtils.clone(value)), 
        this.cumulativeWeight = weight); else {
            var lerpAlpha = weight / (this.cumulativeWeight + weight);
            this.cumulativeValue = this.lerpValue(this.cumulativeValue, value, lerpAlpha), this.cumulativeWeight += weight;
        }
    },
    unbind: function() {
        this.isBound && (this.setValue(this.originalValue), this.setValue = null, this.getValue = null, 
        this.lerpValue = null, this.equalsValue = null, this.triggerDirty = null, this.isBound = !1);
    },
    bind: function() {
        if (!this.isBound) {
            var targetObject = this.node;
            if (!targetObject) return void console.error("  trying to update node for track: " + this.trackName + " but it wasn't found.");
            if (this.objectName) {
                if ("materials" === this.objectName) {
                    if (!targetObject.material) return void console.error("  can not bind to material as node does not have a material", this);
                    if (!targetObject.material.materials) return void console.error("  can not bind to material.materials as node.material does not have a materials array", this);
                    targetObject = targetObject.material.materials;
                } else if ("bones" === this.objectName) {
                    if (!targetObject.skeleton) return void console.error("  can not bind to bones as node does not have a skeleton", this);
                    targetObject = targetObject.skeleton.bones;
                    for (var i = 0; i < targetObject.length; i++) if (targetObject[i].name === this.objectIndex) {
                        this.objectIndex = i;
                        break;
                    }
                } else {
                    if (void 0 === targetObject[this.objectName]) return void console.error("  can not bind to objectName of node, undefined", this);
                    targetObject = targetObject[this.objectName];
                }
                if (void 0 !== this.objectIndex) {
                    if (void 0 === targetObject[this.objectIndex]) return void console.error("  trying to bind to objectIndex of objectName, but is undefined:", this, targetObject);
                    targetObject = targetObject[this.objectIndex];
                }
            }
            var nodeProperty = targetObject[this.propertyName];
            if (!nodeProperty) return void console.error("  trying to update property for track: " + this.nodeName + "." + this.propertyName + " but it wasn't found.", targetObject);
            if (void 0 !== this.propertyIndex) {
                if ("morphTargetInfluences" === this.propertyName) {
                    targetObject.geometry || console.error("  can not bind to morphTargetInfluences becasuse node does not have a geometry", this), 
                    targetObject.geometry.morphTargets || console.error("  can not bind to morphTargetInfluences becasuse node does not have a geometry.morphTargets", this);
                    for (var i = 0; i < this.node.geometry.morphTargets.length; i++) if (targetObject.geometry.morphTargets[i].name === this.propertyIndex) {
                        this.propertyIndex = i;
                        break;
                    }
                }
                this.setValue = function(value) {
                    return this.equalsValue(nodeProperty[this.propertyIndex], value) ? !1 : (nodeProperty[this.propertyIndex] = value, 
                    !0);
                }, this.getValue = function() {
                    return nodeProperty[this.propertyIndex];
                };
            } else nodeProperty.copy ? (this.setValue = function(value) {
                return this.equalsValue(nodeProperty, value) ? !1 : (nodeProperty.copy(value), !0);
            }, this.getValue = function() {
                return nodeProperty;
            }) : (this.setValue = function(value) {
                return this.equalsValue(targetObject[this.propertyName], value) ? !1 : (targetObject[this.propertyName] = value, 
                !0);
            }, this.getValue = function() {
                return targetObject[this.propertyName];
            });
            void 0 !== targetObject.needsUpdate ? this.triggerDirty = function() {
                this.node.needsUpdate = !0;
            } : void 0 !== targetObject.matrixWorldNeedsUpdate && (this.triggerDirty = function() {
                targetObject.matrixWorldNeedsUpdate = !0;
            }), this.originalValue = this.getValue(), this.equalsValue = THREE.AnimationUtils.getEqualsFunc(this.originalValue), 
            this.lerpValue = THREE.AnimationUtils.getLerpFunc(this.originalValue, !0), this.isBound = !0;
        }
    },
    apply: function() {
        if (this.isBound || this.bind(), this.cumulativeWeight > 0) {
            if (this.cumulativeWeight < 1) {
                var remainingWeight = 1 - this.cumulativeWeight, lerpAlpha = remainingWeight / (this.cumulativeWeight + remainingWeight);
                this.cumulativeValue = this.lerpValue(this.cumulativeValue, this.originalValue, lerpAlpha);
            }
            var valueChanged = this.setValue(this.cumulativeValue);
            valueChanged && this.triggerDirty && this.triggerDirty(), this.cumulativeValue = null, 
            this.cumulativeWeight = 0;
        }
    }
}, THREE.PropertyBinding.parseTrackName = function(trackName) {
    var re = /^(([\w]+\/)*)([\w-\d]+)?(\.([\w]+)(\[([\w\d\[\]\_. ]+)\])?)?(\.([\w.]+)(\[([\w\d\[\]\_. ]+)\])?)$/, matches = re.exec(trackName);
    if (!matches) throw new Error("cannot parse trackName at all: " + trackName);
    matches.index === re.lastIndex && re.lastIndex++;
    var results = {
        directoryName: matches[1],
        nodeName: matches[3],
        objectName: matches[5],
        objectIndex: matches[7],
        propertyName: matches[9],
        propertyIndex: matches[11]
    };
    if (null === results.propertyName || 0 === results.propertyName.length) throw new Error("can not parse propertyName from trackName: " + trackName);
    return results;
}, THREE.PropertyBinding.findNode = function(root, nodeName) {
    function searchSkeleton(skeleton) {
        for (var i = 0; i < skeleton.bones.length; i++) {
            var bone = skeleton.bones[i];
            if (bone.name === nodeName) return bone;
        }
        return null;
    }
    function searchNodeSubtree(children) {
        for (var i = 0; i < children.length; i++) {
            var childNode = children[i];
            if (childNode.name === nodeName || childNode.uuid === nodeName) return childNode;
            var result = searchNodeSubtree(childNode.children);
            if (result) return result;
        }
        return null;
    }
    if (!nodeName || "" === nodeName || "root" === nodeName || "." === nodeName || -1 === nodeName || nodeName === root.name || nodeName === root.uuid) return root;
    if (root.skeleton) {
        var bone = searchSkeleton(root.skeleton);
        if (bone) return bone;
    }
    if (root.children) {
        var subTreeNode = searchNodeSubtree(root.children);
        if (subTreeNode) return subTreeNode;
    }
    return null;
}, THREE.VectorKeyframeTrack = function(name, keys) {
    THREE.KeyframeTrack.call(this, name, keys), this.result = this.keys[0].value.clone();
}, THREE.VectorKeyframeTrack.prototype = Object.create(THREE.KeyframeTrack.prototype), 
THREE.VectorKeyframeTrack.prototype.constructor = THREE.VectorKeyframeTrack, THREE.VectorKeyframeTrack.prototype.setResult = function(value) {
    this.result.copy(value);
}, THREE.VectorKeyframeTrack.prototype.lerpValues = function(value0, value1, alpha) {
    return value0.lerp(value1, alpha);
}, THREE.VectorKeyframeTrack.prototype.compareValues = function(value0, value1) {
    return value0.equals(value1);
}, THREE.VectorKeyframeTrack.prototype.clone = function() {
    for (var clonedKeys = [], i = 0; i < this.keys.length; i++) {
        var key = this.keys[i];
        clonedKeys.push({
            time: key.time,
            value: key.value.clone()
        });
    }
    return new THREE.VectorKeyframeTrack(this.name, clonedKeys);
}, THREE.VectorKeyframeTrack.parse = function(json) {
    for (var elementCount = json.keys[0].value.length, valueType = THREE["Vector" + elementCount], keys = [], i = 0; i < json.keys.length; i++) {
        var jsonKey = json.keys[i];
        keys.push({
            value: new valueType().fromArray(jsonKey.value),
            time: jsonKey.time
        });
    }
    return new THREE.VectorKeyframeTrack(json.name, keys);
}, THREE.QuaternionKeyframeTrack = function(name, keys) {
    THREE.KeyframeTrack.call(this, name, keys), this.result = this.keys[0].value.clone();
}, THREE.QuaternionKeyframeTrack.prototype = Object.create(THREE.KeyframeTrack.prototype), 
THREE.QuaternionKeyframeTrack.prototype.constructor = THREE.QuaternionKeyframeTrack, 
THREE.QuaternionKeyframeTrack.prototype.setResult = function(value) {
    this.result.copy(value);
}, THREE.QuaternionKeyframeTrack.prototype.lerpValues = function(value0, value1, alpha) {
    return value0.slerp(value1, alpha);
}, THREE.QuaternionKeyframeTrack.prototype.compareValues = function(value0, value1) {
    return value0.equals(value1);
}, THREE.QuaternionKeyframeTrack.prototype.multiply = function(quat) {
    for (var i = 0; i < this.keys.length; i++) this.keys[i].value.multiply(quat);
    return this;
}, THREE.QuaternionKeyframeTrack.prototype.clone = function() {
    for (var clonedKeys = [], i = 0; i < this.keys.length; i++) {
        var key = this.keys[i];
        clonedKeys.push({
            time: key.time,
            value: key.value.clone()
        });
    }
    return new THREE.QuaternionKeyframeTrack(this.name, clonedKeys);
}, THREE.QuaternionKeyframeTrack.parse = function(json) {
    for (var keys = [], i = 0; i < json.keys.length; i++) {
        var jsonKey = json.keys[i];
        keys.push({
            value: new THREE.Quaternion().fromArray(jsonKey.value),
            time: jsonKey.time
        });
    }
    return new THREE.QuaternionKeyframeTrack(json.name, keys);
}, THREE.StringKeyframeTrack = function(name, keys) {
    THREE.KeyframeTrack.call(this, name, keys), this.result = this.keys[0].value;
}, THREE.StringKeyframeTrack.prototype = Object.create(THREE.KeyframeTrack.prototype), 
THREE.StringKeyframeTrack.prototype.constructor = THREE.StringKeyframeTrack, THREE.StringKeyframeTrack.prototype.setResult = function(value) {
    this.result = value;
}, THREE.StringKeyframeTrack.prototype.lerpValues = function(value0, value1, alpha) {
    return 1 > alpha ? value0 : value1;
}, THREE.StringKeyframeTrack.prototype.compareValues = function(value0, value1) {
    return value0 === value1;
}, THREE.StringKeyframeTrack.prototype.clone = function() {
    for (var clonedKeys = [], i = 0; i < this.keys.length; i++) {
        var key = this.keys[i];
        clonedKeys.push({
            time: key.time,
            value: key.value
        });
    }
    return new THREE.StringKeyframeTrack(this.name, clonedKeys);
}, THREE.StringKeyframeTrack.parse = function(json) {
    return new THREE.StringKeyframeTrack(json.name, json.keys);
}, THREE.BooleanKeyframeTrack = function(name, keys) {
    THREE.KeyframeTrack.call(this, name, keys), this.result = this.keys[0].value;
}, THREE.BooleanKeyframeTrack.prototype = Object.create(THREE.KeyframeTrack.prototype), 
THREE.BooleanKeyframeTrack.prototype.constructor = THREE.BooleanKeyframeTrack, THREE.BooleanKeyframeTrack.prototype.setResult = function(value) {
    this.result = value;
}, THREE.BooleanKeyframeTrack.prototype.lerpValues = function(value0, value1, alpha) {
    return 1 > alpha ? value0 : value1;
}, THREE.BooleanKeyframeTrack.prototype.compareValues = function(value0, value1) {
    return value0 === value1;
}, THREE.BooleanKeyframeTrack.prototype.clone = function() {
    for (var clonedKeys = [], i = 0; i < this.keys.length; i++) {
        var key = this.keys[i];
        clonedKeys.push({
            time: key.time,
            value: key.value
        });
    }
    return new THREE.BooleanKeyframeTrack(this.name, clonedKeys);
}, THREE.BooleanKeyframeTrack.parse = function(json) {
    return new THREE.BooleanKeyframeTrack(json.name, json.keys);
}, THREE.NumberKeyframeTrack = function(name, keys) {
    THREE.KeyframeTrack.call(this, name, keys), this.result = this.keys[0].value;
}, THREE.NumberKeyframeTrack.prototype = Object.create(THREE.KeyframeTrack.prototype), 
THREE.NumberKeyframeTrack.prototype.constructor = THREE.NumberKeyframeTrack, THREE.NumberKeyframeTrack.prototype.setResult = function(value) {
    this.result = value;
}, THREE.NumberKeyframeTrack.prototype.lerpValues = function(value0, value1, alpha) {
    return value0 * (1 - alpha) + value1 * alpha;
}, THREE.NumberKeyframeTrack.prototype.compareValues = function(value0, value1) {
    return value0 === value1;
}, THREE.NumberKeyframeTrack.prototype.clone = function() {
    for (var clonedKeys = [], i = 0; i < this.keys.length; i++) {
        var key = this.keys[i];
        clonedKeys.push({
            time: key.time,
            value: key.value
        });
    }
    return new THREE.NumberKeyframeTrack(this.name, clonedKeys);
}, THREE.NumberKeyframeTrack.parse = function(json) {
    return new THREE.NumberKeyframeTrack(json.name, json.keys);
}, THREE.Camera = function() {
    THREE.Object3D.call(this), this.type = "Camera", this.matrixWorldInverse = new THREE.Matrix4(), 
    this.projectionMatrix = new THREE.Matrix4();
}, THREE.Camera.prototype = Object.create(THREE.Object3D.prototype), THREE.Camera.prototype.constructor = THREE.Camera, 
THREE.Camera.prototype.getWorldDirection = function() {
    var quaternion = new THREE.Quaternion();
    return function(optionalTarget) {
        var result = optionalTarget || new THREE.Vector3();
        return this.getWorldQuaternion(quaternion), result.set(0, 0, -1).applyQuaternion(quaternion);
    };
}(), THREE.Camera.prototype.lookAt = function() {
    var m1 = new THREE.Matrix4();
    return function(vector) {
        m1.lookAt(this.position, vector, this.up), this.quaternion.setFromRotationMatrix(m1);
    };
}(), THREE.Camera.prototype.clone = function() {
    return new this.constructor().copy(this);
}, THREE.Camera.prototype.copy = function(source) {
    return THREE.Object3D.prototype.copy.call(this, source), this.matrixWorldInverse.copy(source.matrixWorldInverse), 
    this.projectionMatrix.copy(source.projectionMatrix), this;
}, THREE.CubeCamera = function(near, far, cubeResolution) {
    THREE.Object3D.call(this), this.type = "CubeCamera";
    var fov = 90, aspect = 1, cameraPX = new THREE.PerspectiveCamera(fov, aspect, near, far);
    cameraPX.up.set(0, -1, 0), cameraPX.lookAt(new THREE.Vector3(1, 0, 0)), this.add(cameraPX);
    var cameraNX = new THREE.PerspectiveCamera(fov, aspect, near, far);
    cameraNX.up.set(0, -1, 0), cameraNX.lookAt(new THREE.Vector3(-1, 0, 0)), this.add(cameraNX);
    var cameraPY = new THREE.PerspectiveCamera(fov, aspect, near, far);
    cameraPY.up.set(0, 0, 1), cameraPY.lookAt(new THREE.Vector3(0, 1, 0)), this.add(cameraPY);
    var cameraNY = new THREE.PerspectiveCamera(fov, aspect, near, far);
    cameraNY.up.set(0, 0, -1), cameraNY.lookAt(new THREE.Vector3(0, -1, 0)), this.add(cameraNY);
    var cameraPZ = new THREE.PerspectiveCamera(fov, aspect, near, far);
    cameraPZ.up.set(0, -1, 0), cameraPZ.lookAt(new THREE.Vector3(0, 0, 1)), this.add(cameraPZ);
    var cameraNZ = new THREE.PerspectiveCamera(fov, aspect, near, far);
    cameraNZ.up.set(0, -1, 0), cameraNZ.lookAt(new THREE.Vector3(0, 0, -1)), this.add(cameraNZ), 
    this.renderTarget = new THREE.WebGLRenderTargetCube(cubeResolution, cubeResolution, {
        format: THREE.RGBFormat,
        magFilter: THREE.LinearFilter,
        minFilter: THREE.LinearFilter
    }), this.updateCubeMap = function(renderer, scene) {
        null === this.parent && this.updateMatrixWorld();
        var renderTarget = this.renderTarget, generateMipmaps = renderTarget.texture.generateMipmaps;
        renderTarget.texture.generateMipmaps = !1, renderTarget.activeCubeFace = 0, renderer.render(scene, cameraPX, renderTarget), 
        renderTarget.activeCubeFace = 1, renderer.render(scene, cameraNX, renderTarget), 
        renderTarget.activeCubeFace = 2, renderer.render(scene, cameraPY, renderTarget), 
        renderTarget.activeCubeFace = 3, renderer.render(scene, cameraNY, renderTarget), 
        renderTarget.activeCubeFace = 4, renderer.render(scene, cameraPZ, renderTarget), 
        renderTarget.texture.generateMipmaps = generateMipmaps, renderTarget.activeCubeFace = 5, 
        renderer.render(scene, cameraNZ, renderTarget), renderer.setRenderTarget(null);
    };
}, THREE.CubeCamera.prototype = Object.create(THREE.Object3D.prototype), THREE.CubeCamera.prototype.constructor = THREE.CubeCamera, 
THREE.OrthographicCamera = function(left, right, top, bottom, near, far) {
    THREE.Camera.call(this), this.type = "OrthographicCamera", this.zoom = 1, this.left = left, 
    this.right = right, this.top = top, this.bottom = bottom, this.near = void 0 !== near ? near : .1, 
    this.far = void 0 !== far ? far : 2e3, this.updateProjectionMatrix();
}, THREE.OrthographicCamera.prototype = Object.create(THREE.Camera.prototype), THREE.OrthographicCamera.prototype.constructor = THREE.OrthographicCamera, 
THREE.OrthographicCamera.prototype.updateProjectionMatrix = function() {
    var dx = (this.right - this.left) / (2 * this.zoom), dy = (this.top - this.bottom) / (2 * this.zoom), cx = (this.right + this.left) / 2, cy = (this.top + this.bottom) / 2;
    this.projectionMatrix.makeOrthographic(cx - dx, cx + dx, cy + dy, cy - dy, this.near, this.far);
}, THREE.OrthographicCamera.prototype.copy = function(source) {
    return THREE.Camera.prototype.copy.call(this, source), this.left = source.left, 
    this.right = source.right, this.top = source.top, this.bottom = source.bottom, this.near = source.near, 
    this.far = source.far, this.zoom = source.zoom, this;
}, THREE.OrthographicCamera.prototype.toJSON = function(meta) {
    var data = THREE.Object3D.prototype.toJSON.call(this, meta);
    return data.object.zoom = this.zoom, data.object.left = this.left, data.object.right = this.right, 
    data.object.top = this.top, data.object.bottom = this.bottom, data.object.near = this.near, 
    data.object.far = this.far, data;
}, THREE.PerspectiveCamera = function(fov, aspect, near, far) {
    THREE.Camera.call(this), this.type = "PerspectiveCamera", this.zoom = 1, this.fov = void 0 !== fov ? fov : 50, 
    this.aspect = void 0 !== aspect ? aspect : 1, this.near = void 0 !== near ? near : .1, 
    this.far = void 0 !== far ? far : 2e3, this.updateProjectionMatrix();
}, THREE.PerspectiveCamera.prototype = Object.create(THREE.Camera.prototype), THREE.PerspectiveCamera.prototype.constructor = THREE.PerspectiveCamera, 
THREE.PerspectiveCamera.prototype.setLens = function(focalLength, frameHeight) {
    void 0 === frameHeight && (frameHeight = 24), this.fov = 2 * THREE.Math.radToDeg(Math.atan(frameHeight / (2 * focalLength))), 
    this.updateProjectionMatrix();
}, THREE.PerspectiveCamera.prototype.setViewOffset = function(fullWidth, fullHeight, x, y, width, height) {
    this.fullWidth = fullWidth, this.fullHeight = fullHeight, this.x = x, this.y = y, 
    this.width = width, this.height = height, this.updateProjectionMatrix();
}, THREE.PerspectiveCamera.prototype.updateProjectionMatrix = function() {
    var fov = THREE.Math.radToDeg(2 * Math.atan(Math.tan(.5 * THREE.Math.degToRad(this.fov)) / this.zoom));
    if (this.fullWidth) {
        var aspect = this.fullWidth / this.fullHeight, top = Math.tan(THREE.Math.degToRad(.5 * fov)) * this.near, bottom = -top, left = aspect * bottom, right = aspect * top, width = Math.abs(right - left), height = Math.abs(top - bottom);
        this.projectionMatrix.makeFrustum(left + this.x * width / this.fullWidth, left + (this.x + this.width) * width / this.fullWidth, top - (this.y + this.height) * height / this.fullHeight, top - this.y * height / this.fullHeight, this.near, this.far);
    } else this.projectionMatrix.makePerspective(fov, this.aspect, this.near, this.far);
}, THREE.PerspectiveCamera.prototype.copy = function(source) {
    return THREE.Camera.prototype.copy.call(this, source), this.fov = source.fov, this.aspect = source.aspect, 
    this.near = source.near, this.far = source.far, this.zoom = source.zoom, this;
}, THREE.PerspectiveCamera.prototype.toJSON = function(meta) {
    var data = THREE.Object3D.prototype.toJSON.call(this, meta);
    return data.object.zoom = this.zoom, data.object.fov = this.fov, data.object.aspect = this.aspect, 
    data.object.near = this.near, data.object.far = this.far, data;
}, THREE.Light = function(color) {
    THREE.Object3D.call(this), this.type = "Light", this.color = new THREE.Color(color), 
    this.receiveShadow = void 0;
}, THREE.Light.prototype = Object.create(THREE.Object3D.prototype), THREE.Light.prototype.constructor = THREE.Light, 
Object.defineProperties(THREE.Light.prototype, {
    onlyShadow: {
        set: function(value) {
            console.warn("THREE.Light: .onlyShadow has been removed.");
        }
    },
    shadowCameraFov: {
        set: function(value) {
            this.shadow.camera.fov = value;
        }
    },
    shadowCameraLeft: {
        set: function(value) {
            this.shadow.camera.left = value;
        }
    },
    shadowCameraRight: {
        set: function(value) {
            this.shadow.camera.right = value;
        }
    },
    shadowCameraTop: {
        set: function(value) {
            this.shadow.camera.top = value;
        }
    },
    shadowCameraBottom: {
        set: function(value) {
            this.shadow.camera.bottom = value;
        }
    },
    shadowCameraNear: {
        set: function(value) {
            this.shadow.camera.near = value;
        }
    },
    shadowCameraFar: {
        set: function(value) {
            this.shadow.camera.far = value;
        }
    },
    shadowCameraVisible: {
        set: function(value) {
            console.warn("THREE.Light: .shadowCameraVisible has been removed. Use new THREE.CameraHelper( light.shadow ) instead.");
        }
    },
    shadowBias: {
        set: function(value) {
            this.shadow.bias = value;
        }
    },
    shadowDarkness: {
        set: function(value) {
            this.shadow.darkness = value;
        }
    },
    shadowMapWidth: {
        set: function(value) {
            this.shadow.mapSize.width = value;
        }
    },
    shadowMapHeight: {
        set: function(value) {
            this.shadow.mapSize.height = value;
        }
    }
}), THREE.Light.prototype.copy = function(source) {
    return THREE.Object3D.prototype.copy.call(this, source), this.color.copy(source.color), 
    this;
}, THREE.Light.prototype.toJSON = function(meta) {
    var data = THREE.Object3D.prototype.toJSON.call(this, meta);
    return data.object.color = this.color.getHex(), void 0 !== this.groundColor && (data.object.groundColor = this.groundColor.getHex()), 
    void 0 !== this.intensity && (data.object.intensity = this.intensity), void 0 !== this.distance && (data.object.distance = this.distance), 
    void 0 !== this.angle && (data.object.angle = this.angle), void 0 !== this.decay && (data.object.decay = this.decay), 
    void 0 !== this.exponent && (data.object.exponent = this.exponent), data;
}, THREE.LightShadow = function(camera) {
    this.camera = camera, this.bias = 0, this.darkness = 1, this.mapSize = new THREE.Vector2(512, 512), 
    this.map = null, this.matrix = null;
}, THREE.LightShadow.prototype = {
    constructor: THREE.LightShadow,
    copy: function(source) {
        this.camera = source.camera.clone(), this.bias = source.bias, this.darkness = source.darkness, 
        this.mapSize.copy(source.mapSize);
    },
    clone: function() {
        return new this.constructor().copy(this);
    }
}, THREE.AmbientLight = function(color) {
    THREE.Light.call(this, color), this.type = "AmbientLight", this.castShadow = void 0;
}, THREE.AmbientLight.prototype = Object.create(THREE.Light.prototype), THREE.AmbientLight.prototype.constructor = THREE.AmbientLight, 
THREE.DirectionalLight = function(color, intensity) {
    THREE.Light.call(this, color), this.type = "DirectionalLight", this.position.set(0, 1, 0), 
    this.updateMatrix(), this.target = new THREE.Object3D(), this.intensity = void 0 !== intensity ? intensity : 1, 
    this.shadow = new THREE.LightShadow(new THREE.OrthographicCamera(-500, 500, 500, -500, 50, 5e3));
}, THREE.DirectionalLight.prototype = Object.create(THREE.Light.prototype), THREE.DirectionalLight.prototype.constructor = THREE.DirectionalLight, 
THREE.DirectionalLight.prototype.copy = function(source) {
    return THREE.Light.prototype.copy.call(this, source), this.intensity = source.intensity, 
    this.target = source.target.clone(), this.shadow = source.shadow.clone(), this;
}, THREE.HemisphereLight = function(skyColor, groundColor, intensity) {
    THREE.Light.call(this, skyColor), this.type = "HemisphereLight", this.castShadow = void 0, 
    this.position.set(0, 1, 0), this.updateMatrix(), this.groundColor = new THREE.Color(groundColor), 
    this.intensity = void 0 !== intensity ? intensity : 1;
}, THREE.HemisphereLight.prototype = Object.create(THREE.Light.prototype), THREE.HemisphereLight.prototype.constructor = THREE.HemisphereLight, 
THREE.HemisphereLight.prototype.copy = function(source) {
    return THREE.Light.prototype.copy.call(this, source), this.groundColor.copy(source.groundColor), 
    this.intensity = source.intensity, this;
}, THREE.PointLight = function(color, intensity, distance, decay) {
    THREE.Light.call(this, color), this.type = "PointLight", this.intensity = void 0 !== intensity ? intensity : 1, 
    this.distance = void 0 !== distance ? distance : 0, this.decay = void 0 !== decay ? decay : 1, 
    this.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(90, 1, 1, 500));
}, THREE.PointLight.prototype = Object.create(THREE.Light.prototype), THREE.PointLight.prototype.constructor = THREE.PointLight, 
THREE.PointLight.prototype.copy = function(source) {
    return THREE.Light.prototype.copy.call(this, source), this.intensity = source.intensity, 
    this.distance = source.distance, this.decay = source.decay, this.shadow = source.shadow.clone(), 
    this;
}, THREE.SpotLight = function(color, intensity, distance, angle, exponent, decay) {
    THREE.Light.call(this, color), this.type = "SpotLight", this.position.set(0, 1, 0), 
    this.updateMatrix(), this.target = new THREE.Object3D(), this.intensity = void 0 !== intensity ? intensity : 1, 
    this.distance = void 0 !== distance ? distance : 0, this.angle = void 0 !== angle ? angle : Math.PI / 3, 
    this.exponent = void 0 !== exponent ? exponent : 10, this.decay = void 0 !== decay ? decay : 1, 
    this.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(50, 1, 50, 5e3));
}, THREE.SpotLight.prototype = Object.create(THREE.Light.prototype), THREE.SpotLight.prototype.constructor = THREE.SpotLight, 
THREE.SpotLight.prototype.copy = function(source) {
    return THREE.Light.prototype.copy.call(this, source), this.intensity = source.intensity, 
    this.distance = source.distance, this.angle = source.angle, this.exponent = source.exponent, 
    this.decay = source.decay, this.target = source.target.clone(), this.shadow = source.shadow.clone(), 
    this;
}, THREE.Cache = {
    enabled: !1,
    files: {},
    add: function(key, file) {
        this.enabled !== !1 && (this.files[key] = file);
    },
    get: function(key) {
        return this.enabled !== !1 ? this.files[key] : void 0;
    },
    remove: function(key) {
        delete this.files[key];
    },
    clear: function() {
        this.files = {};
    }
}, THREE.Loader = function() {
    this.onLoadStart = function() {}, this.onLoadProgress = function() {}, this.onLoadComplete = function() {};
}, THREE.Loader.prototype = {
    constructor: THREE.Loader,
    crossOrigin: void 0,
    extractUrlBase: function(url) {
        var parts = url.split("/");
        return 1 === parts.length ? "./" : (parts.pop(), parts.join("/") + "/");
    },
    initMaterials: function(materials, texturePath, crossOrigin) {
        for (var array = [], i = 0; i < materials.length; ++i) array[i] = this.createMaterial(materials[i], texturePath, crossOrigin);
        return array;
    },
    createMaterial: function() {
        var color, textureLoader, materialLoader;
        return function(m, texturePath, crossOrigin) {
            function loadTexture(path, repeat, offset, wrap, anisotropy) {
                var texture, fullPath = texturePath + path, loader = THREE.Loader.Handlers.get(fullPath);
                null !== loader ? texture = loader.load(fullPath) : (textureLoader.setCrossOrigin(crossOrigin), 
                texture = textureLoader.load(fullPath)), void 0 !== repeat && (texture.repeat.fromArray(repeat), 
                1 !== repeat[0] && (texture.wrapS = THREE.RepeatWrapping), 1 !== repeat[1] && (texture.wrapT = THREE.RepeatWrapping)), 
                void 0 !== offset && texture.offset.fromArray(offset), void 0 !== wrap && ("repeat" === wrap[0] && (texture.wrapS = THREE.RepeatWrapping), 
                "mirror" === wrap[0] && (texture.wrapS = THREE.MirroredRepeatWrapping), "repeat" === wrap[1] && (texture.wrapT = THREE.RepeatWrapping), 
                "mirror" === wrap[1] && (texture.wrapT = THREE.MirroredRepeatWrapping)), void 0 !== anisotropy && (texture.anisotropy = anisotropy);
                var uuid = THREE.Math.generateUUID();
                return textures[uuid] = texture, uuid;
            }
            void 0 === color && (color = new THREE.Color()), void 0 === textureLoader && (textureLoader = new THREE.TextureLoader()), 
            void 0 === materialLoader && (materialLoader = new THREE.MaterialLoader());
            var textures = {}, json = {
                uuid: THREE.Math.generateUUID(),
                type: "MeshLambertMaterial"
            };
            for (var name in m) {
                var value = m[name];
                switch (name) {
                  case "DbgColor":
                    json.color = value;
                    break;

                  case "DbgIndex":
                  case "opticalDensity":
                  case "illumination":
                    break;

                  case "DbgName":
                    json.name = value;
                    break;

                  case "blending":
                    json.blending = THREE[value];
                    break;

                  case "colorDiffuse":
                    json.color = color.fromArray(value).getHex();
                    break;

                  case "colorSpecular":
                    json.specular = color.fromArray(value).getHex();
                    break;

                  case "colorEmissive":
                    json.emissive = color.fromArray(value).getHex();
                    break;

                  case "specularCoef":
                    json.shininess = value;
                    break;

                  case "shading":
                    "basic" === value.toLowerCase() && (json.type = "MeshBasicMaterial"), "phong" === value.toLowerCase() && (json.type = "MeshPhongMaterial");
                    break;

                  case "mapDiffuse":
                    json.map = loadTexture(value, m.mapDiffuseRepeat, m.mapDiffuseOffset, m.mapDiffuseWrap, m.mapDiffuseAnisotropy);
                    break;

                  case "mapDiffuseRepeat":
                  case "mapDiffuseOffset":
                  case "mapDiffuseWrap":
                  case "mapDiffuseAnisotropy":
                    break;

                  case "mapLight":
                    json.lightMap = loadTexture(value, m.mapLightRepeat, m.mapLightOffset, m.mapLightWrap, m.mapLightAnisotropy);
                    break;

                  case "mapLightRepeat":
                  case "mapLightOffset":
                  case "mapLightWrap":
                  case "mapLightAnisotropy":
                    break;

                  case "mapAO":
                    json.aoMap = loadTexture(value, m.mapAORepeat, m.mapAOOffset, m.mapAOWrap, m.mapAOAnisotropy);
                    break;

                  case "mapAORepeat":
                  case "mapAOOffset":
                  case "mapAOWrap":
                  case "mapAOAnisotropy":
                    break;

                  case "mapBump":
                    json.bumpMap = loadTexture(value, m.mapBumpRepeat, m.mapBumpOffset, m.mapBumpWrap, m.mapBumpAnisotropy);
                    break;

                  case "mapBumpScale":
                    json.bumpScale = value;
                    break;

                  case "mapBumpRepeat":
                  case "mapBumpOffset":
                  case "mapBumpWrap":
                  case "mapBumpAnisotropy":
                    break;

                  case "mapNormal":
                    json.normalMap = loadTexture(value, m.mapNormalRepeat, m.mapNormalOffset, m.mapNormalWrap, m.mapNormalAnisotropy);
                    break;

                  case "mapNormalFactor":
                    json.normalScale = [ value, value ];
                    break;

                  case "mapNormalRepeat":
                  case "mapNormalOffset":
                  case "mapNormalWrap":
                  case "mapNormalAnisotropy":
                    break;

                  case "mapSpecular":
                    json.specularMap = loadTexture(value, m.mapSpecularRepeat, m.mapSpecularOffset, m.mapSpecularWrap, m.mapSpecularAnisotropy);
                    break;

                  case "mapSpecularRepeat":
                  case "mapSpecularOffset":
                  case "mapSpecularWrap":
                  case "mapSpecularAnisotropy":
                    break;

                  case "mapAlpha":
                    json.alphaMap = loadTexture(value, m.mapAlphaRepeat, m.mapAlphaOffset, m.mapAlphaWrap, m.mapAlphaAnisotropy);
                    break;

                  case "mapAlphaRepeat":
                  case "mapAlphaOffset":
                  case "mapAlphaWrap":
                  case "mapAlphaAnisotropy":
                    break;

                  case "flipSided":
                    json.side = THREE.BackSide;
                    break;

                  case "doubleSided":
                    json.side = THREE.DoubleSide;
                    break;

                  case "transparency":
                    console.warn("THREE.Loader: transparency has been renamed to opacity"), json.opacity = value;
                    break;

                  case "opacity":
                  case "transparent":
                  case "depthTest":
                  case "depthWrite":
                  case "transparent":
                  case "visible":
                  case "wireframe":
                    json[name] = value;
                    break;

                  case "vertexColors":
                    value === !0 && (json.vertexColors = THREE.VertexColors), "face" === value && (json.vertexColors = THREE.FaceColors);
                    break;

                  default:
                    console.error("Loader.createMaterial: Unsupported", name, value);
                }
            }
            return "MeshPhongMaterial" !== json.type && delete json.specular, json.opacity < 1 && (json.transparent = !0), 
            materialLoader.setTextures(textures), materialLoader.parse(json);
        };
    }()
}, THREE.Loader.Handlers = {
    handlers: [],
    add: function(regex, loader) {
        this.handlers.push(regex, loader);
    },
    get: function(file) {
        for (var handlers = this.handlers, i = 0, l = handlers.length; l > i; i += 2) {
            var regex = handlers[i], loader = handlers[i + 1];
            if (regex.test(file)) return loader;
        }
        return null;
    }
}, THREE.XHRLoader = function(manager) {
    this.manager = void 0 !== manager ? manager : THREE.DefaultLoadingManager;
}, THREE.XHRLoader.prototype = {
    constructor: THREE.XHRLoader,
    load: function(url, onLoad, onProgress, onError) {
        var scope = this, cached = THREE.Cache.get(url);
        if (void 0 !== cached) return onLoad && setTimeout(function() {
            onLoad(cached);
        }, 0), cached;
        var request = new XMLHttpRequest();
        return request.open("GET", url, !0), request.addEventListener("load", function(event) {
            var response = event.target.response;
            THREE.Cache.add(url, response), onLoad && onLoad(response), scope.manager.itemEnd(url);
        }, !1), void 0 !== onProgress && request.addEventListener("progress", function(event) {
            onProgress(event);
        }, !1), request.addEventListener("error", function(event) {
            onError && onError(event), scope.manager.itemError(url);
        }, !1), void 0 !== this.crossOrigin && (request.crossOrigin = this.crossOrigin), 
        void 0 !== this.responseType && (request.responseType = this.responseType), void 0 !== this.withCredentials && (request.withCredentials = this.withCredentials), 
        request.send(null), scope.manager.itemStart(url), request;
    },
    setResponseType: function(value) {
        this.responseType = value;
    },
    setCrossOrigin: function(value) {
        this.crossOrigin = value;
    },
    setWithCredentials: function(value) {
        this.withCredentials = value;
    }
}, THREE.ImageLoader = function(manager) {
    this.manager = void 0 !== manager ? manager : THREE.DefaultLoadingManager;
}, THREE.ImageLoader.prototype = {
    constructor: THREE.ImageLoader,
    load: function(url, onLoad, onProgress, onError) {
        var scope = this, cached = THREE.Cache.get(url);
        if (void 0 !== cached) return scope.manager.itemStart(url), onLoad ? setTimeout(function() {
            onLoad(cached), scope.manager.itemEnd(url);
        }, 0) : scope.manager.itemEnd(url), cached;
        var image = document.createElement("img");
        return image.addEventListener("load", function(event) {
            THREE.Cache.add(url, this), onLoad && onLoad(this), scope.manager.itemEnd(url);
        }, !1), void 0 !== onProgress && image.addEventListener("progress", function(event) {
            onProgress(event);
        }, !1), image.addEventListener("error", function(event) {
            onError && onError(event), scope.manager.itemError(url);
        }, !1), void 0 !== this.crossOrigin && (image.crossOrigin = this.crossOrigin), scope.manager.itemStart(url), 
        image.src = url, image;
    },
    setCrossOrigin: function(value) {
        this.crossOrigin = value;
    }
}, THREE.JSONLoader = function(manager) {
    "boolean" == typeof manager && (console.warn("THREE.JSONLoader: showStatus parameter has been removed from constructor."), 
    manager = void 0), this.manager = void 0 !== manager ? manager : THREE.DefaultLoadingManager, 
    this.withCredentials = !1;
}, THREE.JSONLoader.prototype = {
    constructor: THREE.JSONLoader,
    get statusDomElement() {
        return void 0 === this._statusDomElement && (this._statusDomElement = document.createElement("div")), 
        console.warn("THREE.JSONLoader: .statusDomElement has been removed."), this._statusDomElement;
    },
    load: function(url, onLoad, onProgress, onError) {
        var scope = this, texturePath = this.texturePath && "string" == typeof this.texturePath ? this.texturePath : THREE.Loader.prototype.extractUrlBase(url), loader = new THREE.XHRLoader(this.manager);
        loader.setCrossOrigin(this.crossOrigin), loader.setWithCredentials(this.withCredentials), 
        loader.load(url, function(text) {
            var json = JSON.parse(text), metadata = json.metadata;
            if (void 0 !== metadata) {
                if ("object" === metadata.type) return void console.error("THREE.JSONLoader: " + url + " should be loaded with THREE.ObjectLoader instead.");
                if ("scene" === metadata.type) return void console.error("THREE.JSONLoader: " + url + " should be loaded with THREE.SceneLoader instead.");
            }
            var object = scope.parse(json, texturePath);
            onLoad(object.geometry, object.materials);
        });
    },
    setCrossOrigin: function(value) {
        this.crossOrigin = value;
    },
    setTexturePath: function(value) {
        this.texturePath = value;
    },
    parse: function(json, texturePath) {
        function parseModel(scale) {
            function isBitSet(value, position) {
                return value & 1 << position;
            }
            var i, j, fi, offset, zLength, colorIndex, normalIndex, uvIndex, materialIndex, type, isQuad, hasMaterial, hasFaceVertexUv, hasFaceNormal, hasFaceVertexNormal, hasFaceColor, hasFaceVertexColor, vertex, face, faceA, faceB, hex, normal, uvLayer, uv, u, v, faces = json.faces, vertices = json.vertices, normals = json.normals, colors = json.colors, nUvLayers = 0;
            if (void 0 !== json.uvs) {
                for (i = 0; i < json.uvs.length; i++) json.uvs[i].length && nUvLayers++;
                for (i = 0; nUvLayers > i; i++) geometry.faceVertexUvs[i] = [];
            }
            for (offset = 0, zLength = vertices.length; zLength > offset; ) vertex = new THREE.Vector3(), 
            vertex.x = vertices[offset++] * scale, vertex.y = vertices[offset++] * scale, vertex.z = vertices[offset++] * scale, 
            geometry.vertices.push(vertex);
            for (offset = 0, zLength = faces.length; zLength > offset; ) if (type = faces[offset++], 
            isQuad = isBitSet(type, 0), hasMaterial = isBitSet(type, 1), hasFaceVertexUv = isBitSet(type, 3), 
            hasFaceNormal = isBitSet(type, 4), hasFaceVertexNormal = isBitSet(type, 5), hasFaceColor = isBitSet(type, 6), 
            hasFaceVertexColor = isBitSet(type, 7), isQuad) {
                if (faceA = new THREE.Face3(), faceA.a = faces[offset], faceA.b = faces[offset + 1], 
                faceA.c = faces[offset + 3], faceB = new THREE.Face3(), faceB.a = faces[offset + 1], 
                faceB.b = faces[offset + 2], faceB.c = faces[offset + 3], offset += 4, hasMaterial && (materialIndex = faces[offset++], 
                faceA.materialIndex = materialIndex, faceB.materialIndex = materialIndex), fi = geometry.faces.length, 
                hasFaceVertexUv) for (i = 0; nUvLayers > i; i++) for (uvLayer = json.uvs[i], geometry.faceVertexUvs[i][fi] = [], 
                geometry.faceVertexUvs[i][fi + 1] = [], j = 0; 4 > j; j++) uvIndex = faces[offset++], 
                u = uvLayer[2 * uvIndex], v = uvLayer[2 * uvIndex + 1], uv = new THREE.Vector2(u, v), 
                2 !== j && geometry.faceVertexUvs[i][fi].push(uv), 0 !== j && geometry.faceVertexUvs[i][fi + 1].push(uv);
                if (hasFaceNormal && (normalIndex = 3 * faces[offset++], faceA.normal.set(normals[normalIndex++], normals[normalIndex++], normals[normalIndex]), 
                faceB.normal.copy(faceA.normal)), hasFaceVertexNormal) for (i = 0; 4 > i; i++) normalIndex = 3 * faces[offset++], 
                normal = new THREE.Vector3(normals[normalIndex++], normals[normalIndex++], normals[normalIndex]), 
                2 !== i && faceA.vertexNormals.push(normal), 0 !== i && faceB.vertexNormals.push(normal);
                if (hasFaceColor && (colorIndex = faces[offset++], hex = colors[colorIndex], faceA.color.setHex(hex), 
                faceB.color.setHex(hex)), hasFaceVertexColor) for (i = 0; 4 > i; i++) colorIndex = faces[offset++], 
                hex = colors[colorIndex], 2 !== i && faceA.vertexColors.push(new THREE.Color(hex)), 
                0 !== i && faceB.vertexColors.push(new THREE.Color(hex));
                geometry.faces.push(faceA), geometry.faces.push(faceB);
            } else {
                if (face = new THREE.Face3(), face.a = faces[offset++], face.b = faces[offset++], 
                face.c = faces[offset++], hasMaterial && (materialIndex = faces[offset++], face.materialIndex = materialIndex), 
                fi = geometry.faces.length, hasFaceVertexUv) for (i = 0; nUvLayers > i; i++) for (uvLayer = json.uvs[i], 
                geometry.faceVertexUvs[i][fi] = [], j = 0; 3 > j; j++) uvIndex = faces[offset++], 
                u = uvLayer[2 * uvIndex], v = uvLayer[2 * uvIndex + 1], uv = new THREE.Vector2(u, v), 
                geometry.faceVertexUvs[i][fi].push(uv);
                if (hasFaceNormal && (normalIndex = 3 * faces[offset++], face.normal.set(normals[normalIndex++], normals[normalIndex++], normals[normalIndex])), 
                hasFaceVertexNormal) for (i = 0; 3 > i; i++) normalIndex = 3 * faces[offset++], 
                normal = new THREE.Vector3(normals[normalIndex++], normals[normalIndex++], normals[normalIndex]), 
                face.vertexNormals.push(normal);
                if (hasFaceColor && (colorIndex = faces[offset++], face.color.setHex(colors[colorIndex])), 
                hasFaceVertexColor) for (i = 0; 3 > i; i++) colorIndex = faces[offset++], face.vertexColors.push(new THREE.Color(colors[colorIndex]));
                geometry.faces.push(face);
            }
        }
        function parseSkin() {
            var influencesPerVertex = void 0 !== json.influencesPerVertex ? json.influencesPerVertex : 2;
            if (json.skinWeights) for (var i = 0, l = json.skinWeights.length; l > i; i += influencesPerVertex) {
                var x = json.skinWeights[i], y = influencesPerVertex > 1 ? json.skinWeights[i + 1] : 0, z = influencesPerVertex > 2 ? json.skinWeights[i + 2] : 0, w = influencesPerVertex > 3 ? json.skinWeights[i + 3] : 0;
                geometry.skinWeights.push(new THREE.Vector4(x, y, z, w));
            }
            if (json.skinIndices) for (var i = 0, l = json.skinIndices.length; l > i; i += influencesPerVertex) {
                var a = json.skinIndices[i], b = influencesPerVertex > 1 ? json.skinIndices[i + 1] : 0, c = influencesPerVertex > 2 ? json.skinIndices[i + 2] : 0, d = influencesPerVertex > 3 ? json.skinIndices[i + 3] : 0;
                geometry.skinIndices.push(new THREE.Vector4(a, b, c, d));
            }
            geometry.bones = json.bones, geometry.bones && geometry.bones.length > 0 && (geometry.skinWeights.length !== geometry.skinIndices.length || geometry.skinIndices.length !== geometry.vertices.length) && console.warn("When skinning, number of vertices (" + geometry.vertices.length + "), skinIndices (" + geometry.skinIndices.length + "), and skinWeights (" + geometry.skinWeights.length + ") should match.");
        }
        function parseMorphing(scale) {
            if (void 0 !== json.morphTargets) for (var i = 0, l = json.morphTargets.length; l > i; i++) {
                geometry.morphTargets[i] = {}, geometry.morphTargets[i].name = json.morphTargets[i].name, 
                geometry.morphTargets[i].vertices = [];
                for (var dstVertices = geometry.morphTargets[i].vertices, srcVertices = json.morphTargets[i].vertices, v = 0, vl = srcVertices.length; vl > v; v += 3) {
                    var vertex = new THREE.Vector3();
                    vertex.x = srcVertices[v] * scale, vertex.y = srcVertices[v + 1] * scale, vertex.z = srcVertices[v + 2] * scale, 
                    dstVertices.push(vertex);
                }
            }
            if (void 0 !== json.morphColors && json.morphColors.length > 0) {
                console.warn('THREE.JSONLoader: "morphColors" no longer supported. Using them as face colors.');
                for (var faces = geometry.faces, morphColors = json.morphColors[0].colors, i = 0, l = faces.length; l > i; i++) faces[i].color.fromArray(morphColors, 3 * i);
            }
        }
        function parseAnimations() {
            var outputAnimations = [], animations = [];
            void 0 !== json.animation && animations.push(json.animation), void 0 !== json.animations && (json.animations.length ? animations = animations.concat(json.animations) : animations.push(json.animations));
            for (var i = 0; i < animations.length; i++) {
                var clip = THREE.AnimationClip.parseAnimation(animations[i], geometry.bones);
                clip && outputAnimations.push(clip);
            }
            if (geometry.morphTargets) {
                var morphAnimationClips = THREE.AnimationClip.CreateClipsFromMorphTargetSequences(geometry.morphTargets, 10);
                outputAnimations = outputAnimations.concat(morphAnimationClips);
            }
            outputAnimations.length > 0 && (geometry.animations = outputAnimations);
        }
        var geometry = new THREE.Geometry(), scale = void 0 !== json.scale ? 1 / json.scale : 1;
        if (parseModel(scale), parseSkin(), parseMorphing(scale), parseAnimations(), geometry.computeFaceNormals(), 
        geometry.computeBoundingSphere(), void 0 === json.materials || 0 === json.materials.length) return {
            geometry: geometry
        };
        var materials = THREE.Loader.prototype.initMaterials(json.materials, texturePath, this.crossOrigin);
        return {
            geometry: geometry,
            materials: materials
        };
    }
}, THREE.LoadingManager = function(onLoad, onProgress, onError) {
    var scope = this, isLoading = !1, itemsLoaded = 0, itemsTotal = 0;
    this.onStart = void 0, this.onLoad = onLoad, this.onProgress = onProgress, this.onError = onError, 
    this.itemStart = function(url) {
        itemsTotal++, isLoading === !1 && void 0 !== scope.onStart && scope.onStart(url, itemsLoaded, itemsTotal), 
        isLoading = !0;
    }, this.itemEnd = function(url) {
        itemsLoaded++, void 0 !== scope.onProgress && scope.onProgress(url, itemsLoaded, itemsTotal), 
        itemsLoaded === itemsTotal && (isLoading = !1, void 0 !== scope.onLoad && scope.onLoad());
    }, this.itemError = function(url) {
        void 0 !== scope.onError && scope.onError(url);
    };
}, THREE.DefaultLoadingManager = new THREE.LoadingManager(), THREE.BufferGeometryLoader = function(manager) {
    this.manager = void 0 !== manager ? manager : THREE.DefaultLoadingManager;
}, THREE.BufferGeometryLoader.prototype = {
    constructor: THREE.BufferGeometryLoader,
    load: function(url, onLoad, onProgress, onError) {
        var scope = this, loader = new THREE.XHRLoader(scope.manager);
        loader.setCrossOrigin(this.crossOrigin), loader.load(url, function(text) {
            onLoad(scope.parse(JSON.parse(text)));
        }, onProgress, onError);
    },
    setCrossOrigin: function(value) {
        this.crossOrigin = value;
    },
    parse: function(json) {
        var geometry = new THREE.BufferGeometry(), index = json.data.index;
        if (void 0 !== index) {
            var typedArray = new self[index.type](index.array);
            geometry.setIndex(new THREE.BufferAttribute(typedArray, 1));
        }
        var attributes = json.data.attributes;
        for (var key in attributes) {
            var attribute = attributes[key], typedArray = new self[attribute.type](attribute.array);
            geometry.addAttribute(key, new THREE.BufferAttribute(typedArray, attribute.itemSize));
        }
        var groups = json.data.groups || json.data.drawcalls || json.data.offsets;
        if (void 0 !== groups) for (var i = 0, n = groups.length; i !== n; ++i) {
            var group = groups[i];
            geometry.addGroup(group.start, group.count);
        }
        var boundingSphere = json.data.boundingSphere;
        if (void 0 !== boundingSphere) {
            var center = new THREE.Vector3();
            void 0 !== boundingSphere.center && center.fromArray(boundingSphere.center), geometry.boundingSphere = new THREE.Sphere(center, boundingSphere.radius);
        }
        return geometry;
    }
}, THREE.MaterialLoader = function(manager) {
    this.manager = void 0 !== manager ? manager : THREE.DefaultLoadingManager, this.textures = {};
}, THREE.MaterialLoader.prototype = {
    constructor: THREE.MaterialLoader,
    load: function(url, onLoad, onProgress, onError) {
        var scope = this, loader = new THREE.XHRLoader(scope.manager);
        loader.setCrossOrigin(this.crossOrigin), loader.load(url, function(text) {
            onLoad(scope.parse(JSON.parse(text)));
        }, onProgress, onError);
    },
    setCrossOrigin: function(value) {
        this.crossOrigin = value;
    },
    setTextures: function(value) {
        this.textures = value;
    },
    getTexture: function(name) {
        var textures = this.textures;
        return void 0 === textures[name] && console.warn("THREE.MaterialLoader: Undefined texture", name), 
        textures[name];
    },
    parse: function(json) {
        var material = new THREE[json.type]();
        if (material.uuid = json.uuid, void 0 !== json.name && (material.name = json.name), 
        void 0 !== json.color && material.color.setHex(json.color), void 0 !== json.emissive && material.emissive.setHex(json.emissive), 
        void 0 !== json.specular && material.specular.setHex(json.specular), void 0 !== json.shininess && (material.shininess = json.shininess), 
        void 0 !== json.uniforms && (material.uniforms = json.uniforms), void 0 !== json.vertexShader && (material.vertexShader = json.vertexShader), 
        void 0 !== json.fragmentShader && (material.fragmentShader = json.fragmentShader), 
        void 0 !== json.vertexColors && (material.vertexColors = json.vertexColors), void 0 !== json.shading && (material.shading = json.shading), 
        void 0 !== json.blending && (material.blending = json.blending), void 0 !== json.side && (material.side = json.side), 
        void 0 !== json.opacity && (material.opacity = json.opacity), void 0 !== json.transparent && (material.transparent = json.transparent), 
        void 0 !== json.alphaTest && (material.alphaTest = json.alphaTest), void 0 !== json.depthTest && (material.depthTest = json.depthTest), 
        void 0 !== json.depthWrite && (material.depthWrite = json.depthWrite), void 0 !== json.wireframe && (material.wireframe = json.wireframe), 
        void 0 !== json.wireframeLinewidth && (material.wireframeLinewidth = json.wireframeLinewidth), 
        void 0 !== json.size && (material.size = json.size), void 0 !== json.sizeAttenuation && (material.sizeAttenuation = json.sizeAttenuation), 
        void 0 !== json.map && (material.map = this.getTexture(json.map)), void 0 !== json.alphaMap && (material.alphaMap = this.getTexture(json.alphaMap), 
        material.transparent = !0), void 0 !== json.bumpMap && (material.bumpMap = this.getTexture(json.bumpMap)), 
        void 0 !== json.bumpScale && (material.bumpScale = json.bumpScale), void 0 !== json.normalMap && (material.normalMap = this.getTexture(json.normalMap)), 
        json.normalScale && (material.normalScale = new THREE.Vector2(json.normalScale, json.normalScale)), 
        void 0 !== json.displacementMap && (material.displacementMap = this.getTexture(json.displacementMap)), 
        void 0 !== json.displacementScale && (material.displacementScale = json.displacementScale), 
        void 0 !== json.displacementBias && (material.displacementBias = json.displacementBias), 
        void 0 !== json.specularMap && (material.specularMap = this.getTexture(json.specularMap)), 
        void 0 !== json.envMap && (material.envMap = this.getTexture(json.envMap), material.combine = THREE.MultiplyOperation), 
        json.reflectivity && (material.reflectivity = json.reflectivity), void 0 !== json.lightMap && (material.lightMap = this.getTexture(json.lightMap)), 
        void 0 !== json.lightMapIntensity && (material.lightMapIntensity = json.lightMapIntensity), 
        void 0 !== json.aoMap && (material.aoMap = this.getTexture(json.aoMap)), void 0 !== json.aoMapIntensity && (material.aoMapIntensity = json.aoMapIntensity), 
        void 0 !== json.materials) for (var i = 0, l = json.materials.length; l > i; i++) material.materials.push(this.parse(json.materials[i]));
        return material;
    }
}, THREE.ObjectLoader = function(manager) {
    this.manager = void 0 !== manager ? manager : THREE.DefaultLoadingManager, this.texturePath = "";
}, THREE.ObjectLoader.prototype = {
    constructor: THREE.ObjectLoader,
    load: function(url, onLoad, onProgress, onError) {
        "" === this.texturePath && (this.texturePath = url.substring(0, url.lastIndexOf("/") + 1));
        var scope = this, loader = new THREE.XHRLoader(scope.manager);
        loader.setCrossOrigin(this.crossOrigin), loader.load(url, function(text) {
            scope.parse(JSON.parse(text), onLoad);
        }, onProgress, onError);
    },
    setTexturePath: function(value) {
        this.texturePath = value;
    },
    setCrossOrigin: function(value) {
        this.crossOrigin = value;
    },
    parse: function(json, onLoad) {
        var geometries = this.parseGeometries(json.geometries), images = this.parseImages(json.images, function() {
            void 0 !== onLoad && onLoad(object);
        }), textures = this.parseTextures(json.textures, images), materials = this.parseMaterials(json.materials, textures), object = this.parseObject(json.object, geometries, materials);
        return json.animations && (object.animations = this.parseAnimations(json.animations)), 
        (void 0 === json.images || 0 === json.images.length) && void 0 !== onLoad && onLoad(object), 
        object;
    },
    parseGeometries: function(json) {
        var geometries = {};
        if (void 0 !== json) for (var geometryLoader = new THREE.JSONLoader(), bufferGeometryLoader = new THREE.BufferGeometryLoader(), i = 0, l = json.length; l > i; i++) {
            var geometry, data = json[i];
            switch (data.type) {
              case "PlaneGeometry":
              case "PlaneBufferGeometry":
                geometry = new THREE[data.type](data.width, data.height, data.widthSegments, data.heightSegments);
                break;

              case "BoxGeometry":
              case "CubeGeometry":
                geometry = new THREE.BoxGeometry(data.width, data.height, data.depth, data.widthSegments, data.heightSegments, data.depthSegments);
                break;

              case "CircleBufferGeometry":
                geometry = new THREE.CircleBufferGeometry(data.radius, data.segments, data.thetaStart, data.thetaLength);
                break;

              case "CircleGeometry":
                geometry = new THREE.CircleGeometry(data.radius, data.segments, data.thetaStart, data.thetaLength);
                break;

              case "CylinderGeometry":
                geometry = new THREE.CylinderGeometry(data.radiusTop, data.radiusBottom, data.height, data.radialSegments, data.heightSegments, data.openEnded, data.thetaStart, data.thetaLength);
                break;

              case "SphereGeometry":
                geometry = new THREE.SphereGeometry(data.radius, data.widthSegments, data.heightSegments, data.phiStart, data.phiLength, data.thetaStart, data.thetaLength);
                break;

              case "SphereBufferGeometry":
                geometry = new THREE.SphereBufferGeometry(data.radius, data.widthSegments, data.heightSegments, data.phiStart, data.phiLength, data.thetaStart, data.thetaLength);
                break;

              case "DodecahedronGeometry":
                geometry = new THREE.DodecahedronGeometry(data.radius, data.detail);
                break;

              case "IcosahedronGeometry":
                geometry = new THREE.IcosahedronGeometry(data.radius, data.detail);
                break;

              case "OctahedronGeometry":
                geometry = new THREE.OctahedronGeometry(data.radius, data.detail);
                break;

              case "TetrahedronGeometry":
                geometry = new THREE.TetrahedronGeometry(data.radius, data.detail);
                break;

              case "RingGeometry":
                geometry = new THREE.RingGeometry(data.innerRadius, data.outerRadius, data.thetaSegments, data.phiSegments, data.thetaStart, data.thetaLength);
                break;

              case "TorusGeometry":
                geometry = new THREE.TorusGeometry(data.radius, data.tube, data.radialSegments, data.tubularSegments, data.arc);
                break;

              case "TorusKnotGeometry":
                geometry = new THREE.TorusKnotGeometry(data.radius, data.tube, data.radialSegments, data.tubularSegments, data.p, data.q, data.heightScale);
                break;

              case "BufferGeometry":
                geometry = bufferGeometryLoader.parse(data);
                break;

              case "Geometry":
                geometry = geometryLoader.parse(data.data, this.texturePath).geometry;
                break;

              default:
                console.warn('THREE.ObjectLoader: Unsupported geometry type "' + data.type + '"');
                continue;
            }
            geometry.uuid = data.uuid, void 0 !== data.name && (geometry.name = data.name), 
            geometries[data.uuid] = geometry;
        }
        return geometries;
    },
    parseMaterials: function(json, textures) {
        var materials = {};
        if (void 0 !== json) {
            var loader = new THREE.MaterialLoader();
            loader.setTextures(textures);
            for (var i = 0, l = json.length; l > i; i++) {
                var material = loader.parse(json[i]);
                materials[material.uuid] = material;
            }
        }
        return materials;
    },
    parseAnimations: function(json) {
        for (var animations = [], i = 0; i < json.length; i++) {
            var clip = THREE.AnimationClip.parse(json[i]);
            animations.push(clip);
        }
        return animations;
    },
    parseImages: function(json, onLoad) {
        function loadImage(url) {
            return scope.manager.itemStart(url), loader.load(url, function() {
                scope.manager.itemEnd(url);
            });
        }
        var scope = this, images = {};
        if (void 0 !== json && json.length > 0) {
            var manager = new THREE.LoadingManager(onLoad), loader = new THREE.ImageLoader(manager);
            loader.setCrossOrigin(this.crossOrigin);
            for (var i = 0, l = json.length; l > i; i++) {
                var image = json[i], path = /^(\/\/)|([a-z]+:(\/\/)?)/i.test(image.url) ? image.url : scope.texturePath + image.url;
                images[image.uuid] = loadImage(path);
            }
        }
        return images;
    },
    parseTextures: function(json, images) {
        function parseConstant(value) {
            return "number" == typeof value ? value : (console.warn("THREE.ObjectLoader.parseTexture: Constant should be in numeric form.", value), 
            THREE[value]);
        }
        var textures = {};
        if (void 0 !== json) for (var i = 0, l = json.length; l > i; i++) {
            var data = json[i];
            void 0 === data.image && console.warn('THREE.ObjectLoader: No "image" specified for', data.uuid), 
            void 0 === images[data.image] && console.warn("THREE.ObjectLoader: Undefined image", data.image);
            var texture = new THREE.Texture(images[data.image]);
            texture.needsUpdate = !0, texture.uuid = data.uuid, void 0 !== data.name && (texture.name = data.name), 
            void 0 !== data.mapping && (texture.mapping = parseConstant(data.mapping)), void 0 !== data.offset && (texture.offset = new THREE.Vector2(data.offset[0], data.offset[1])), 
            void 0 !== data.repeat && (texture.repeat = new THREE.Vector2(data.repeat[0], data.repeat[1])), 
            void 0 !== data.minFilter && (texture.minFilter = parseConstant(data.minFilter)), 
            void 0 !== data.magFilter && (texture.magFilter = parseConstant(data.magFilter)), 
            void 0 !== data.anisotropy && (texture.anisotropy = data.anisotropy), Array.isArray(data.wrap) && (texture.wrapS = parseConstant(data.wrap[0]), 
            texture.wrapT = parseConstant(data.wrap[1])), textures[data.uuid] = texture;
        }
        return textures;
    },
    parseObject: function() {
        var matrix = new THREE.Matrix4();
        return function(data, geometries, materials) {
            function getGeometry(name) {
                return void 0 === geometries[name] && console.warn("THREE.ObjectLoader: Undefined geometry", name), 
                geometries[name];
            }
            function getMaterial(name) {
                return void 0 === name ? void 0 : (void 0 === materials[name] && console.warn("THREE.ObjectLoader: Undefined material", name), 
                materials[name]);
            }
            var object;
            switch (data.type) {
              case "Scene":
                object = new THREE.Scene();
                break;

              case "PerspectiveCamera":
                object = new THREE.PerspectiveCamera(data.fov, data.aspect, data.near, data.far);
                break;

              case "OrthographicCamera":
                object = new THREE.OrthographicCamera(data.left, data.right, data.top, data.bottom, data.near, data.far);
                break;

              case "AmbientLight":
                object = new THREE.AmbientLight(data.color);
                break;

              case "DirectionalLight":
                object = new THREE.DirectionalLight(data.color, data.intensity);
                break;

              case "PointLight":
                object = new THREE.PointLight(data.color, data.intensity, data.distance, data.decay);
                break;

              case "SpotLight":
                object = new THREE.SpotLight(data.color, data.intensity, data.distance, data.angle, data.exponent, data.decay);
                break;

              case "HemisphereLight":
                object = new THREE.HemisphereLight(data.color, data.groundColor, data.intensity);
                break;

              case "Mesh":
                object = new THREE.Mesh(getGeometry(data.geometry), getMaterial(data.material));
                break;

              case "LOD":
                object = new THREE.LOD();
                break;

              case "Line":
                object = new THREE.Line(getGeometry(data.geometry), getMaterial(data.material), data.mode);
                break;

              case "PointCloud":
              case "Points":
                object = new THREE.Points(getGeometry(data.geometry), getMaterial(data.material));
                break;

              case "Sprite":
                object = new THREE.Sprite(getMaterial(data.material));
                break;

              case "Group":
                object = new THREE.Group();
                break;

              default:
                object = new THREE.Object3D();
            }
            if (object.uuid = data.uuid, void 0 !== data.name && (object.name = data.name), 
            void 0 !== data.matrix ? (matrix.fromArray(data.matrix), matrix.decompose(object.position, object.quaternion, object.scale)) : (void 0 !== data.position && object.position.fromArray(data.position), 
            void 0 !== data.rotation && object.rotation.fromArray(data.rotation), void 0 !== data.scale && object.scale.fromArray(data.scale)), 
            void 0 !== data.castShadow && (object.castShadow = data.castShadow), void 0 !== data.receiveShadow && (object.receiveShadow = data.receiveShadow), 
            void 0 !== data.visible && (object.visible = data.visible), void 0 !== data.userData && (object.userData = data.userData), 
            void 0 !== data.children) for (var child in data.children) object.add(this.parseObject(data.children[child], geometries, materials));
            if ("LOD" === data.type) for (var levels = data.levels, l = 0; l < levels.length; l++) {
                var level = levels[l], child = object.getObjectByProperty("uuid", level.object);
                void 0 !== child && object.addLevel(child, level.distance);
            }
            return object;
        };
    }()
}, THREE.TextureLoader = function(manager) {
    this.manager = void 0 !== manager ? manager : THREE.DefaultLoadingManager;
}, THREE.TextureLoader.prototype = {
    constructor: THREE.TextureLoader,
    load: function(url, onLoad, onProgress, onError) {
        var texture = new THREE.Texture(), loader = new THREE.ImageLoader(this.manager);
        return loader.setCrossOrigin(this.crossOrigin), loader.load(url, function(image) {
            texture.image = image, texture.needsUpdate = !0, void 0 !== onLoad && onLoad(texture);
        }, onProgress, onError), texture;
    },
    setCrossOrigin: function(value) {
        this.crossOrigin = value;
    }
}, THREE.CubeTextureLoader = function(manager) {
    this.manager = void 0 !== manager ? manager : THREE.DefaultLoadingManager;
}, THREE.CubeTextureLoader.prototype = {
    constructor: THREE.CubeTextureLoader,
    load: function(urls, onLoad, onProgress, onError) {
        function loadTexture(i) {
            loader.load(urls[i], function(image) {
                texture.images[i] = image, loaded++, 6 === loaded && (texture.needsUpdate = !0, 
                onLoad && onLoad(texture));
            }, void 0, onError);
        }
        var texture = new THREE.CubeTexture([]), loader = new THREE.ImageLoader();
        loader.setCrossOrigin(this.crossOrigin);
        for (var loaded = 0, i = 0; i < urls.length; ++i) loadTexture(i);
        return texture;
    },
    setCrossOrigin: function(value) {
        this.crossOrigin = value;
    }
}, THREE.DataTextureLoader = THREE.BinaryTextureLoader = function(manager) {
    this.manager = void 0 !== manager ? manager : THREE.DefaultLoadingManager, this._parser = null;
}, THREE.BinaryTextureLoader.prototype = {
    constructor: THREE.BinaryTextureLoader,
    load: function(url, onLoad, onProgress, onError) {
        var scope = this, texture = new THREE.DataTexture(), loader = new THREE.XHRLoader(this.manager);
        return loader.setCrossOrigin(this.crossOrigin), loader.setResponseType("arraybuffer"), 
        loader.load(url, function(buffer) {
            var texData = scope._parser(buffer);
            texData && (void 0 !== texData.image ? texture.image = texData.image : void 0 !== texData.data && (texture.image.width = texData.width, 
            texture.image.height = texData.height, texture.image.data = texData.data), texture.wrapS = void 0 !== texData.wrapS ? texData.wrapS : THREE.ClampToEdgeWrapping, 
            texture.wrapT = void 0 !== texData.wrapT ? texData.wrapT : THREE.ClampToEdgeWrapping, 
            texture.magFilter = void 0 !== texData.magFilter ? texData.magFilter : THREE.LinearFilter, 
            texture.minFilter = void 0 !== texData.minFilter ? texData.minFilter : THREE.LinearMipMapLinearFilter, 
            texture.anisotropy = void 0 !== texData.anisotropy ? texData.anisotropy : 1, void 0 !== texData.format && (texture.format = texData.format), 
            void 0 !== texData.type && (texture.type = texData.type), void 0 !== texData.mipmaps && (texture.mipmaps = texData.mipmaps), 
            1 === texData.mipmapCount && (texture.minFilter = THREE.LinearFilter), texture.needsUpdate = !0, 
            onLoad && onLoad(texture, texData));
        }, onProgress, onError), texture;
    },
    setCrossOrigin: function(value) {
        this.crossOrigin = value;
    }
}, THREE.CompressedTextureLoader = function(manager) {
    this.manager = void 0 !== manager ? manager : THREE.DefaultLoadingManager, this._parser = null;
}, THREE.CompressedTextureLoader.prototype = {
    constructor: THREE.CompressedTextureLoader,
    load: function(url, onLoad, onProgress, onError) {
        var scope = this, images = [], texture = new THREE.CompressedTexture();
        texture.image = images;
        var loader = new THREE.XHRLoader(this.manager);
        if (loader.setCrossOrigin(this.crossOrigin), loader.setResponseType("arraybuffer"), 
        Array.isArray(url)) for (var loaded = 0, loadTexture = function(i) {
            loader.load(url[i], function(buffer) {
                var texDatas = scope._parser(buffer, !0);
                images[i] = {
                    width: texDatas.width,
                    height: texDatas.height,
                    format: texDatas.format,
                    mipmaps: texDatas.mipmaps
                }, loaded += 1, 6 === loaded && (1 === texDatas.mipmapCount && (texture.minFilter = THREE.LinearFilter), 
                texture.format = texDatas.format, texture.needsUpdate = !0, onLoad && onLoad(texture));
            }, onProgress, onError);
        }, i = 0, il = url.length; il > i; ++i) loadTexture(i); else loader.load(url, function(buffer) {
            var texDatas = scope._parser(buffer, !0);
            if (texDatas.isCubemap) for (var faces = texDatas.mipmaps.length / texDatas.mipmapCount, f = 0; faces > f; f++) {
                images[f] = {
                    mipmaps: []
                };
                for (var i = 0; i < texDatas.mipmapCount; i++) images[f].mipmaps.push(texDatas.mipmaps[f * texDatas.mipmapCount + i]), 
                images[f].format = texDatas.format, images[f].width = texDatas.width, images[f].height = texDatas.height;
            } else texture.image.width = texDatas.width, texture.image.height = texDatas.height, 
            texture.mipmaps = texDatas.mipmaps;
            1 === texDatas.mipmapCount && (texture.minFilter = THREE.LinearFilter), texture.format = texDatas.format, 
            texture.needsUpdate = !0, onLoad && onLoad(texture);
        }, onProgress, onError);
        return texture;
    },
    setCrossOrigin: function(value) {
        this.crossOrigin = value;
    }
}, THREE.Material = function() {
    Object.defineProperty(this, "id", {
        value: THREE.MaterialIdCount++
    }), this.uuid = THREE.Math.generateUUID(), this.name = "", this.type = "Material", 
    this.side = THREE.FrontSide, this.opacity = 1, this.transparent = !1, this.blending = THREE.NormalBlending, 
    this.blendSrc = THREE.SrcAlphaFactor, this.blendDst = THREE.OneMinusSrcAlphaFactor, 
    this.blendEquation = THREE.AddEquation, this.blendSrcAlpha = null, this.blendDstAlpha = null, 
    this.blendEquationAlpha = null, this.depthFunc = THREE.LessEqualDepth, this.depthTest = !0, 
    this.depthWrite = !0, this.colorWrite = !0, this.precision = null, this.polygonOffset = !1, 
    this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.alphaTest = 0, this.overdraw = 0, 
    this.visible = !0, this._needsUpdate = !0;
}, THREE.Material.prototype = {
    constructor: THREE.Material,
    get needsUpdate() {
        return this._needsUpdate;
    },
    set needsUpdate(value) {
        value === !0 && this.update(), this._needsUpdate = value;
    },
    setValues: function(values) {
        if (void 0 !== values) for (var key in values) {
            var newValue = values[key];
            if (void 0 !== newValue) {
                var currentValue = this[key];
                void 0 !== currentValue ? currentValue instanceof THREE.Color ? currentValue.set(newValue) : currentValue instanceof THREE.Vector3 && newValue instanceof THREE.Vector3 ? currentValue.copy(newValue) : "overdraw" === key ? this[key] = Number(newValue) : this[key] = newValue : console.warn("THREE." + this.type + ": '" + key + "' is not a property of this material.");
            } else console.warn("THREE.Material: '" + key + "' parameter is undefined.");
        }
    },
    toJSON: function(meta) {
        var data = {
            metadata: {
                version: 4.4,
                type: "Material",
                generator: "Material.toJSON"
            }
        };
        return data.uuid = this.uuid, data.type = this.type, "" !== this.name && (data.name = this.name), 
        this.color instanceof THREE.Color && (data.color = this.color.getHex()), this.emissive instanceof THREE.Color && (data.emissive = this.emissive.getHex()), 
        this.specular instanceof THREE.Color && (data.specular = this.specular.getHex()), 
        void 0 !== this.shininess && (data.shininess = this.shininess), this.map instanceof THREE.Texture && (data.map = this.map.toJSON(meta).uuid), 
        this.alphaMap instanceof THREE.Texture && (data.alphaMap = this.alphaMap.toJSON(meta).uuid), 
        this.lightMap instanceof THREE.Texture && (data.lightMap = this.lightMap.toJSON(meta).uuid), 
        this.bumpMap instanceof THREE.Texture && (data.bumpMap = this.bumpMap.toJSON(meta).uuid, 
        data.bumpScale = this.bumpScale), this.normalMap instanceof THREE.Texture && (data.normalMap = this.normalMap.toJSON(meta).uuid, 
        data.normalScale = this.normalScale), this.displacementMap instanceof THREE.Texture && (data.displacementMap = this.displacementMap.toJSON(meta).uuid, 
        data.displacementScale = this.displacementScale, data.displacementBias = this.displacementBias), 
        this.specularMap instanceof THREE.Texture && (data.specularMap = this.specularMap.toJSON(meta).uuid), 
        this.envMap instanceof THREE.Texture && (data.envMap = this.envMap.toJSON(meta).uuid, 
        data.reflectivity = this.reflectivity), void 0 !== this.size && (data.size = this.size), 
        void 0 !== this.sizeAttenuation && (data.sizeAttenuation = this.sizeAttenuation), 
        void 0 !== this.vertexColors && this.vertexColors !== THREE.NoColors && (data.vertexColors = this.vertexColors), 
        void 0 !== this.shading && this.shading !== THREE.SmoothShading && (data.shading = this.shading), 
        void 0 !== this.blending && this.blending !== THREE.NormalBlending && (data.blending = this.blending), 
        void 0 !== this.side && this.side !== THREE.FrontSide && (data.side = this.side), 
        this.opacity < 1 && (data.opacity = this.opacity), this.transparent === !0 && (data.transparent = this.transparent), 
        this.alphaTest > 0 && (data.alphaTest = this.alphaTest), this.wireframe === !0 && (data.wireframe = this.wireframe), 
        this.wireframeLinewidth > 1 && (data.wireframeLinewidth = this.wireframeLinewidth), 
        data;
    },
    clone: function() {
        return new this.constructor().copy(this);
    },
    copy: function(source) {
        return this.name = source.name, this.side = source.side, this.opacity = source.opacity, 
        this.transparent = source.transparent, this.blending = source.blending, this.blendSrc = source.blendSrc, 
        this.blendDst = source.blendDst, this.blendEquation = source.blendEquation, this.blendSrcAlpha = source.blendSrcAlpha, 
        this.blendDstAlpha = source.blendDstAlpha, this.blendEquationAlpha = source.blendEquationAlpha, 
        this.depthFunc = source.depthFunc, this.depthTest = source.depthTest, this.depthWrite = source.depthWrite, 
        this.precision = source.precision, this.polygonOffset = source.polygonOffset, this.polygonOffsetFactor = source.polygonOffsetFactor, 
        this.polygonOffsetUnits = source.polygonOffsetUnits, this.alphaTest = source.alphaTest, 
        this.overdraw = source.overdraw, this.visible = source.visible, this;
    },
    update: function() {
        this.dispatchEvent({
            type: "update"
        });
    },
    dispose: function() {
        this.dispatchEvent({
            type: "dispose"
        });
    },
    get wrapAround() {
        console.warn("THREE." + this.type + ": .wrapAround has been removed.");
    },
    set wrapAround(boolean) {
        console.warn("THREE." + this.type + ": .wrapAround has been removed.");
    },
    get wrapRGB() {
        return console.warn("THREE." + this.type + ": .wrapRGB has been removed."), new THREE.Color();
    }
}, THREE.EventDispatcher.prototype.apply(THREE.Material.prototype), THREE.MaterialIdCount = 0, 
THREE.LineBasicMaterial = function(parameters) {
    THREE.Material.call(this), this.type = "LineBasicMaterial", this.color = new THREE.Color(16777215), 
    this.linewidth = 1, this.linecap = "round", this.linejoin = "round", this.vertexColors = THREE.NoColors, 
    this.fog = !0, this.setValues(parameters);
}, THREE.LineBasicMaterial.prototype = Object.create(THREE.Material.prototype), 
THREE.LineBasicMaterial.prototype.constructor = THREE.LineBasicMaterial, THREE.LineBasicMaterial.prototype.copy = function(source) {
    return THREE.Material.prototype.copy.call(this, source), this.color.copy(source.color), 
    this.linewidth = source.linewidth, this.linecap = source.linecap, this.linejoin = source.linejoin, 
    this.vertexColors = source.vertexColors, this.fog = source.fog, this;
}, THREE.LineDashedMaterial = function(parameters) {
    THREE.Material.call(this), this.type = "LineDashedMaterial", this.color = new THREE.Color(16777215), 
    this.linewidth = 1, this.scale = 1, this.dashSize = 3, this.gapSize = 1, this.vertexColors = !1, 
    this.fog = !0, this.setValues(parameters);
}, THREE.LineDashedMaterial.prototype = Object.create(THREE.Material.prototype), 
THREE.LineDashedMaterial.prototype.constructor = THREE.LineDashedMaterial, THREE.LineDashedMaterial.prototype.copy = function(source) {
    return THREE.Material.prototype.copy.call(this, source), this.color.copy(source.color), 
    this.linewidth = source.linewidth, this.scale = source.scale, this.dashSize = source.dashSize, 
    this.gapSize = source.gapSize, this.vertexColors = source.vertexColors, this.fog = source.fog, 
    this;
}, THREE.MeshBasicMaterial = function(parameters) {
    THREE.Material.call(this), this.type = "MeshBasicMaterial", this.color = new THREE.Color(16777215), 
    this.map = null, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, 
    this.alphaMap = null, this.envMap = null, this.combine = THREE.MultiplyOperation, 
    this.reflectivity = 1, this.refractionRatio = .98, this.fog = !0, this.shading = THREE.SmoothShading, 
    this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", 
    this.wireframeLinejoin = "round", this.vertexColors = THREE.NoColors, this.skinning = !1, 
    this.morphTargets = !1, this.setValues(parameters);
}, THREE.MeshBasicMaterial.prototype = Object.create(THREE.Material.prototype), 
THREE.MeshBasicMaterial.prototype.constructor = THREE.MeshBasicMaterial, THREE.MeshBasicMaterial.prototype.copy = function(source) {
    return THREE.Material.prototype.copy.call(this, source), this.color.copy(source.color), 
    this.map = source.map, this.aoMap = source.aoMap, this.aoMapIntensity = source.aoMapIntensity, 
    this.specularMap = source.specularMap, this.alphaMap = source.alphaMap, this.envMap = source.envMap, 
    this.combine = source.combine, this.reflectivity = source.reflectivity, this.refractionRatio = source.refractionRatio, 
    this.fog = source.fog, this.shading = source.shading, this.wireframe = source.wireframe, 
    this.wireframeLinewidth = source.wireframeLinewidth, this.wireframeLinecap = source.wireframeLinecap, 
    this.wireframeLinejoin = source.wireframeLinejoin, this.vertexColors = source.vertexColors, 
    this.skinning = source.skinning, this.morphTargets = source.morphTargets, this;
}, THREE.MeshLambertMaterial = function(parameters) {
    THREE.Material.call(this), this.type = "MeshLambertMaterial", this.color = new THREE.Color(16777215), 
    this.emissive = new THREE.Color(0), this.map = null, this.specularMap = null, this.alphaMap = null, 
    this.envMap = null, this.combine = THREE.MultiplyOperation, this.reflectivity = 1, 
    this.refractionRatio = .98, this.fog = !0, this.wireframe = !1, this.wireframeLinewidth = 1, 
    this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.vertexColors = THREE.NoColors, 
    this.skinning = !1, this.morphTargets = !1, this.morphNormals = !1, this.setValues(parameters);
}, THREE.MeshLambertMaterial.prototype = Object.create(THREE.Material.prototype), 
THREE.MeshLambertMaterial.prototype.constructor = THREE.MeshLambertMaterial, THREE.MeshLambertMaterial.prototype.copy = function(source) {
    return THREE.Material.prototype.copy.call(this, source), this.color.copy(source.color), 
    this.emissive.copy(source.emissive), this.map = source.map, this.specularMap = source.specularMap, 
    this.alphaMap = source.alphaMap, this.envMap = source.envMap, this.combine = source.combine, 
    this.reflectivity = source.reflectivity, this.refractionRatio = source.refractionRatio, 
    this.fog = source.fog, this.wireframe = source.wireframe, this.wireframeLinewidth = source.wireframeLinewidth, 
    this.wireframeLinecap = source.wireframeLinecap, this.wireframeLinejoin = source.wireframeLinejoin, 
    this.vertexColors = source.vertexColors, this.skinning = source.skinning, this.morphTargets = source.morphTargets, 
    this.morphNormals = source.morphNormals, this;
}, THREE.MeshPhongMaterial = function(parameters) {
    THREE.Material.call(this), this.type = "MeshPhongMaterial", this.color = new THREE.Color(16777215), 
    this.emissive = new THREE.Color(0), this.specular = new THREE.Color(1118481), this.shininess = 30, 
    this.metal = !1, this.map = null, this.lightMap = null, this.lightMapIntensity = 1, 
    this.aoMap = null, this.aoMapIntensity = 1, this.emissiveMap = null, this.bumpMap = null, 
    this.bumpScale = 1, this.normalMap = null, this.normalScale = new THREE.Vector2(1, 1), 
    this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, 
    this.specularMap = null, this.alphaMap = null, this.envMap = null, this.combine = THREE.MultiplyOperation, 
    this.reflectivity = 1, this.refractionRatio = .98, this.fog = !0, this.shading = THREE.SmoothShading, 
    this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", 
    this.wireframeLinejoin = "round", this.vertexColors = THREE.NoColors, this.skinning = !1, 
    this.morphTargets = !1, this.morphNormals = !1, this.setValues(parameters);
}, THREE.MeshPhongMaterial.prototype = Object.create(THREE.Material.prototype), 
THREE.MeshPhongMaterial.prototype.constructor = THREE.MeshPhongMaterial, THREE.MeshPhongMaterial.prototype.copy = function(source) {
    return THREE.Material.prototype.copy.call(this, source), this.color.copy(source.color), 
    this.emissive.copy(source.emissive), this.specular.copy(source.specular), this.shininess = source.shininess, 
    this.metal = source.metal, this.map = source.map, this.lightMap = source.lightMap, 
    this.lightMapIntensity = source.lightMapIntensity, this.aoMap = source.aoMap, this.aoMapIntensity = source.aoMapIntensity, 
    this.emissiveMap = source.emissiveMap, this.bumpMap = source.bumpMap, this.bumpScale = source.bumpScale, 
    this.normalMap = source.normalMap, this.normalScale.copy(source.normalScale), this.displacementMap = source.displacementMap, 
    this.displacementScale = source.displacementScale, this.displacementBias = source.displacementBias, 
    this.specularMap = source.specularMap, this.alphaMap = source.alphaMap, this.envMap = source.envMap, 
    this.combine = source.combine, this.reflectivity = source.reflectivity, this.refractionRatio = source.refractionRatio, 
    this.fog = source.fog, this.shading = source.shading, this.wireframe = source.wireframe, 
    this.wireframeLinewidth = source.wireframeLinewidth, this.wireframeLinecap = source.wireframeLinecap, 
    this.wireframeLinejoin = source.wireframeLinejoin, this.vertexColors = source.vertexColors, 
    this.skinning = source.skinning, this.morphTargets = source.morphTargets, this.morphNormals = source.morphNormals, 
    this;
}, THREE.MeshDepthMaterial = function(parameters) {
    THREE.Material.call(this), this.type = "MeshDepthMaterial", this.morphTargets = !1, 
    this.wireframe = !1, this.wireframeLinewidth = 1, this.setValues(parameters);
}, THREE.MeshDepthMaterial.prototype = Object.create(THREE.Material.prototype), 
THREE.MeshDepthMaterial.prototype.constructor = THREE.MeshDepthMaterial, THREE.MeshDepthMaterial.prototype.copy = function(source) {
    return THREE.Material.prototype.copy.call(this, source), this.wireframe = source.wireframe, 
    this.wireframeLinewidth = source.wireframeLinewidth, this;
}, THREE.MeshNormalMaterial = function(parameters) {
    THREE.Material.call(this, parameters), this.type = "MeshNormalMaterial", this.wireframe = !1, 
    this.wireframeLinewidth = 1, this.morphTargets = !1, this.setValues(parameters);
}, THREE.MeshNormalMaterial.prototype = Object.create(THREE.Material.prototype), 
THREE.MeshNormalMaterial.prototype.constructor = THREE.MeshNormalMaterial, THREE.MeshNormalMaterial.prototype.copy = function(source) {
    return THREE.Material.prototype.copy.call(this, source), this.wireframe = source.wireframe, 
    this.wireframeLinewidth = source.wireframeLinewidth, this;
}, THREE.MultiMaterial = function(materials) {
    this.uuid = THREE.Math.generateUUID(), this.type = "MultiMaterial", this.materials = materials instanceof Array ? materials : [], 
    this.visible = !0;
}, THREE.MultiMaterial.prototype = {
    constructor: THREE.MultiMaterial,
    toJSON: function() {
        for (var output = {
            metadata: {
                version: 4.2,
                type: "material",
                generator: "MaterialExporter"
            },
            uuid: this.uuid,
            type: this.type,
            materials: []
        }, i = 0, l = this.materials.length; l > i; i++) output.materials.push(this.materials[i].toJSON());
        return output.visible = this.visible, output;
    },
    clone: function() {
        for (var material = new this.constructor(), i = 0; i < this.materials.length; i++) material.materials.push(this.materials[i].clone());
        return material.visible = this.visible, material;
    }
}, THREE.MeshFaceMaterial = THREE.MultiMaterial, THREE.PointsMaterial = function(parameters) {
    THREE.Material.call(this), this.type = "PointsMaterial", this.color = new THREE.Color(16777215), 
    this.map = null, this.size = 1, this.sizeAttenuation = !0, this.vertexColors = THREE.NoColors, 
    this.fog = !0, this.setValues(parameters);
}, THREE.PointsMaterial.prototype = Object.create(THREE.Material.prototype), THREE.PointsMaterial.prototype.constructor = THREE.PointsMaterial, 
THREE.PointsMaterial.prototype.copy = function(source) {
    return THREE.Material.prototype.copy.call(this, source), this.color.copy(source.color), 
    this.map = source.map, this.size = source.size, this.sizeAttenuation = source.sizeAttenuation, 
    this.vertexColors = source.vertexColors, this.fog = source.fog, this;
}, THREE.PointCloudMaterial = function(parameters) {
    return console.warn("THREE.PointCloudMaterial has been renamed to THREE.PointsMaterial."), 
    new THREE.PointsMaterial(parameters);
}, THREE.ParticleBasicMaterial = function(parameters) {
    return console.warn("THREE.ParticleBasicMaterial has been renamed to THREE.PointsMaterial."), 
    new THREE.PointsMaterial(parameters);
}, THREE.ParticleSystemMaterial = function(parameters) {
    return console.warn("THREE.ParticleSystemMaterial has been renamed to THREE.PointsMaterial."), 
    new THREE.PointsMaterial(parameters);
}, THREE.ShaderMaterial = function(parameters) {
    THREE.Material.call(this), this.type = "ShaderMaterial", this.defines = {}, this.uniforms = {}, 
    this.vertexShader = "void main() {\n	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}", 
    this.fragmentShader = "void main() {\n	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}", 
    this.shading = THREE.SmoothShading, this.linewidth = 1, this.wireframe = !1, this.wireframeLinewidth = 1, 
    this.fog = !1, this.lights = !1, this.vertexColors = THREE.NoColors, this.skinning = !1, 
    this.morphTargets = !1, this.morphNormals = !1, this.derivatives = !1, this.defaultAttributeValues = {
        color: [ 1, 1, 1 ],
        uv: [ 0, 0 ],
        uv2: [ 0, 0 ]
    }, this.index0AttributeName = void 0, void 0 !== parameters && (void 0 !== parameters.attributes && console.error("THREE.ShaderMaterial: attributes should now be defined in THREE.BufferGeometry instead."), 
    this.setValues(parameters));
}, THREE.ShaderMaterial.prototype = Object.create(THREE.Material.prototype), THREE.ShaderMaterial.prototype.constructor = THREE.ShaderMaterial, 
THREE.ShaderMaterial.prototype.copy = function(source) {
    return THREE.Material.prototype.copy.call(this, source), this.fragmentShader = source.fragmentShader, 
    this.vertexShader = source.vertexShader, this.uniforms = THREE.UniformsUtils.clone(source.uniforms), 
    this.attributes = source.attributes, this.defines = source.defines, this.shading = source.shading, 
    this.wireframe = source.wireframe, this.wireframeLinewidth = source.wireframeLinewidth, 
    this.fog = source.fog, this.lights = source.lights, this.vertexColors = source.vertexColors, 
    this.skinning = source.skinning, this.morphTargets = source.morphTargets, this.morphNormals = source.morphNormals, 
    this.derivatives = source.derivatives, this;
}, THREE.ShaderMaterial.prototype.toJSON = function(meta) {
    var data = THREE.Material.prototype.toJSON.call(this, meta);
    return data.uniforms = this.uniforms, data.attributes = this.attributes, data.vertexShader = this.vertexShader, 
    data.fragmentShader = this.fragmentShader, data;
}, THREE.RawShaderMaterial = function(parameters) {
    THREE.ShaderMaterial.call(this, parameters), this.type = "RawShaderMaterial";
}, THREE.RawShaderMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype), 
THREE.RawShaderMaterial.prototype.constructor = THREE.RawShaderMaterial, THREE.SpriteMaterial = function(parameters) {
    THREE.Material.call(this), this.type = "SpriteMaterial", this.color = new THREE.Color(16777215), 
    this.map = null, this.rotation = 0, this.fog = !1, this.setValues(parameters);
}, THREE.SpriteMaterial.prototype = Object.create(THREE.Material.prototype), THREE.SpriteMaterial.prototype.constructor = THREE.SpriteMaterial, 
THREE.SpriteMaterial.prototype.copy = function(source) {
    return THREE.Material.prototype.copy.call(this, source), this.color.copy(source.color), 
    this.map = source.map, this.rotation = source.rotation, this.fog = source.fog, this;
}, THREE.Texture = function(image, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy) {
    Object.defineProperty(this, "id", {
        value: THREE.TextureIdCount++
    }), this.uuid = THREE.Math.generateUUID(), this.name = "", this.sourceFile = "", 
    this.image = void 0 !== image ? image : THREE.Texture.DEFAULT_IMAGE, this.mipmaps = [], 
    this.mapping = void 0 !== mapping ? mapping : THREE.Texture.DEFAULT_MAPPING, this.wrapS = void 0 !== wrapS ? wrapS : THREE.ClampToEdgeWrapping, 
    this.wrapT = void 0 !== wrapT ? wrapT : THREE.ClampToEdgeWrapping, this.magFilter = void 0 !== magFilter ? magFilter : THREE.LinearFilter, 
    this.minFilter = void 0 !== minFilter ? minFilter : THREE.LinearMipMapLinearFilter, 
    this.anisotropy = void 0 !== anisotropy ? anisotropy : 1, this.format = void 0 !== format ? format : THREE.RGBAFormat, 
    this.type = void 0 !== type ? type : THREE.UnsignedByteType, this.offset = new THREE.Vector2(0, 0), 
    this.repeat = new THREE.Vector2(1, 1), this.generateMipmaps = !0, this.premultiplyAlpha = !1, 
    this.flipY = !0, this.unpackAlignment = 4, this.version = 0, this.onUpdate = null;
}, THREE.Texture.DEFAULT_IMAGE = void 0, THREE.Texture.DEFAULT_MAPPING = THREE.UVMapping, 
THREE.Texture.prototype = {
    constructor: THREE.Texture,
    set needsUpdate(value) {
        value === !0 && this.version++;
    },
    clone: function() {
        return new this.constructor().copy(this);
    },
    copy: function(source) {
        return this.image = source.image, this.mipmaps = source.mipmaps.slice(0), this.mapping = source.mapping, 
        this.wrapS = source.wrapS, this.wrapT = source.wrapT, this.magFilter = source.magFilter, 
        this.minFilter = source.minFilter, this.anisotropy = source.anisotropy, this.format = source.format, 
        this.type = source.type, this.offset.copy(source.offset), this.repeat.copy(source.repeat), 
        this.generateMipmaps = source.generateMipmaps, this.premultiplyAlpha = source.premultiplyAlpha, 
        this.flipY = source.flipY, this.unpackAlignment = source.unpackAlignment, this;
    },
    toJSON: function(meta) {
        function getDataURL(image) {
            var canvas;
            return void 0 !== image.toDataURL ? canvas = image : (canvas = document.createElement("canvas"), 
            canvas.width = image.width, canvas.height = image.height, canvas.getContext("2d").drawImage(image, 0, 0, image.width, image.height)), 
            canvas.width > 2048 || canvas.height > 2048 ? canvas.toDataURL("image/jpeg", .6) : canvas.toDataURL("image/png");
        }
        if (void 0 !== meta.textures[this.uuid]) return meta.textures[this.uuid];
        var output = {
            metadata: {
                version: 4.4,
                type: "Texture",
                generator: "Texture.toJSON"
            },
            uuid: this.uuid,
            name: this.name,
            mapping: this.mapping,
            repeat: [ this.repeat.x, this.repeat.y ],
            offset: [ this.offset.x, this.offset.y ],
            wrap: [ this.wrapS, this.wrapT ],
            minFilter: this.minFilter,
            magFilter: this.magFilter,
            anisotropy: this.anisotropy
        };
        if (void 0 !== this.image) {
            var image = this.image;
            void 0 === image.uuid && (image.uuid = THREE.Math.generateUUID()), void 0 === meta.images[image.uuid] && (meta.images[image.uuid] = {
                uuid: image.uuid,
                url: getDataURL(image)
            }), output.image = image.uuid;
        }
        return meta.textures[this.uuid] = output, output;
    },
    dispose: function() {
        this.dispatchEvent({
            type: "dispose"
        });
    },
    transformUv: function(uv) {
        if (this.mapping === THREE.UVMapping) {
            if (uv.multiply(this.repeat), uv.add(this.offset), uv.x < 0 || uv.x > 1) switch (this.wrapS) {
              case THREE.RepeatWrapping:
                uv.x = uv.x - Math.floor(uv.x);
                break;

              case THREE.ClampToEdgeWrapping:
                uv.x = uv.x < 0 ? 0 : 1;
                break;

              case THREE.MirroredRepeatWrapping:
                1 === Math.abs(Math.floor(uv.x) % 2) ? uv.x = Math.ceil(uv.x) - uv.x : uv.x = uv.x - Math.floor(uv.x);
            }
            if (uv.y < 0 || uv.y > 1) switch (this.wrapT) {
              case THREE.RepeatWrapping:
                uv.y = uv.y - Math.floor(uv.y);
                break;

              case THREE.ClampToEdgeWrapping:
                uv.y = uv.y < 0 ? 0 : 1;
                break;

              case THREE.MirroredRepeatWrapping:
                1 === Math.abs(Math.floor(uv.y) % 2) ? uv.y = Math.ceil(uv.y) - uv.y : uv.y = uv.y - Math.floor(uv.y);
            }
            this.flipY && (uv.y = 1 - uv.y);
        }
    }
}, THREE.EventDispatcher.prototype.apply(THREE.Texture.prototype), THREE.TextureIdCount = 0, 
THREE.CanvasTexture = function(canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy) {
    THREE.Texture.call(this, canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy), 
    this.needsUpdate = !0;
}, THREE.CanvasTexture.prototype = Object.create(THREE.Texture.prototype), THREE.CanvasTexture.prototype.constructor = THREE.CanvasTexture, 
THREE.CubeTexture = function(images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy) {
    mapping = void 0 !== mapping ? mapping : THREE.CubeReflectionMapping, THREE.Texture.call(this, images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy), 
    this.images = images, this.flipY = !1;
}, THREE.CubeTexture.prototype = Object.create(THREE.Texture.prototype), THREE.CubeTexture.prototype.constructor = THREE.CubeTexture, 
THREE.CubeTexture.prototype.copy = function(source) {
    return THREE.Texture.prototype.copy.call(this, source), this.images = source.images, 
    this;
}, THREE.CompressedTexture = function(mipmaps, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy) {
    THREE.Texture.call(this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy), 
    this.image = {
        width: width,
        height: height
    }, this.mipmaps = mipmaps, this.flipY = !1, this.generateMipmaps = !1;
}, THREE.CompressedTexture.prototype = Object.create(THREE.Texture.prototype), THREE.CompressedTexture.prototype.constructor = THREE.CompressedTexture, 
THREE.DataTexture = function(data, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy) {
    THREE.Texture.call(this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy), 
    this.image = {
        data: data,
        width: width,
        height: height
    }, this.magFilter = void 0 !== magFilter ? magFilter : THREE.NearestFilter, this.minFilter = void 0 !== minFilter ? minFilter : THREE.NearestFilter, 
    this.flipY = !1, this.generateMipmaps = !1;
}, THREE.DataTexture.prototype = Object.create(THREE.Texture.prototype), THREE.DataTexture.prototype.constructor = THREE.DataTexture, 
THREE.VideoTexture = function(video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy) {
    function update() {
        requestAnimationFrame(update), video.readyState === video.HAVE_ENOUGH_DATA && (scope.needsUpdate = !0);
    }
    THREE.Texture.call(this, video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy), 
    this.generateMipmaps = !1;
    var scope = this;
    update();
}, THREE.VideoTexture.prototype = Object.create(THREE.Texture.prototype), THREE.VideoTexture.prototype.constructor = THREE.VideoTexture, 
THREE.Group = function() {
    THREE.Object3D.call(this), this.type = "Group";
}, THREE.Group.prototype = Object.create(THREE.Object3D.prototype), THREE.Group.prototype.constructor = THREE.Group, 
THREE.Points = function(geometry, material) {
    THREE.Object3D.call(this), this.type = "Points", this.geometry = void 0 !== geometry ? geometry : new THREE.Geometry(), 
    this.material = void 0 !== material ? material : new THREE.PointsMaterial({
        color: 16777215 * Math.random()
    });
}, THREE.Points.prototype = Object.create(THREE.Object3D.prototype), THREE.Points.prototype.constructor = THREE.Points, 
THREE.Points.prototype.raycast = function() {
    var inverseMatrix = new THREE.Matrix4(), ray = new THREE.Ray();
    return function(raycaster, intersects) {
        function testPoint(point, index) {
            var rayPointDistanceSq = ray.distanceSqToPoint(point);
            if (localThresholdSq > rayPointDistanceSq) {
                var intersectPoint = ray.closestPointToPoint(point);
                intersectPoint.applyMatrix4(object.matrixWorld);
                var distance = raycaster.ray.origin.distanceTo(intersectPoint);
                if (distance < raycaster.near || distance > raycaster.far) return;
                intersects.push({
                    distance: distance,
                    distanceToRay: Math.sqrt(rayPointDistanceSq),
                    point: intersectPoint.clone(),
                    index: index,
                    face: null,
                    object: object
                });
            }
        }
        var object = this, geometry = object.geometry, threshold = raycaster.params.Points.threshold;
        if (inverseMatrix.getInverse(this.matrixWorld), ray.copy(raycaster.ray).applyMatrix4(inverseMatrix), 
        null === geometry.boundingBox || ray.isIntersectionBox(geometry.boundingBox) !== !1) {
            var localThreshold = threshold / ((this.scale.x + this.scale.y + this.scale.z) / 3), localThresholdSq = localThreshold * localThreshold, position = new THREE.Vector3();
            if (geometry instanceof THREE.BufferGeometry) {
                var index = geometry.index, attributes = geometry.attributes, positions = attributes.position.array;
                if (null !== index) for (var indices = index.array, i = 0, il = indices.length; il > i; i++) {
                    var a = indices[i];
                    position.fromArray(positions, 3 * a), testPoint(position, a);
                } else for (var i = 0, l = positions.length / 3; l > i; i++) position.fromArray(positions, 3 * i), 
                testPoint(position, i);
            } else for (var vertices = geometry.vertices, i = 0, l = vertices.length; l > i; i++) testPoint(vertices[i], i);
        }
    };
}(), THREE.Points.prototype.clone = function() {
    return new this.constructor(this.geometry, this.material).copy(this);
}, THREE.PointCloud = function(geometry, material) {
    return console.warn("THREE.PointCloud has been renamed to THREE.Points."), new THREE.Points(geometry, material);
}, THREE.ParticleSystem = function(geometry, material) {
    return console.warn("THREE.ParticleSystem has been renamed to THREE.Points."), new THREE.Points(geometry, material);
}, THREE.Line = function(geometry, material, mode) {
    return 1 === mode ? (console.warn("THREE.Line: parameter THREE.LinePieces no longer supported. Created THREE.LineSegments instead."), 
    new THREE.LineSegments(geometry, material)) : (THREE.Object3D.call(this), this.type = "Line", 
    this.geometry = void 0 !== geometry ? geometry : new THREE.Geometry(), void (this.material = void 0 !== material ? material : new THREE.LineBasicMaterial({
        color: 16777215 * Math.random()
    })));
}, THREE.Line.prototype = Object.create(THREE.Object3D.prototype), THREE.Line.prototype.constructor = THREE.Line, 
THREE.Line.prototype.raycast = function() {
    var inverseMatrix = new THREE.Matrix4(), ray = new THREE.Ray(), sphere = new THREE.Sphere();
    return function(raycaster, intersects) {
        var precision = raycaster.linePrecision, precisionSq = precision * precision, geometry = this.geometry;
        if (null === geometry.boundingSphere && geometry.computeBoundingSphere(), sphere.copy(geometry.boundingSphere), 
        sphere.applyMatrix4(this.matrixWorld), raycaster.ray.isIntersectionSphere(sphere) !== !1) {
            inverseMatrix.getInverse(this.matrixWorld), ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);
            var vStart = new THREE.Vector3(), vEnd = new THREE.Vector3(), interSegment = new THREE.Vector3(), interRay = new THREE.Vector3(), step = this instanceof THREE.LineSegments ? 2 : 1;
            if (geometry instanceof THREE.BufferGeometry) {
                var index = geometry.index, attributes = geometry.attributes;
                if (null !== index) for (var indices = index.array, positions = attributes.position.array, i = 0, l = indices.length - 1; l > i; i += step) {
                    var a = indices[i], b = indices[i + 1];
                    vStart.fromArray(positions, 3 * a), vEnd.fromArray(positions, 3 * b);
                    var distSq = ray.distanceSqToSegment(vStart, vEnd, interRay, interSegment);
                    if (!(distSq > precisionSq)) {
                        interRay.applyMatrix4(this.matrixWorld);
                        var distance = raycaster.ray.origin.distanceTo(interRay);
                        distance < raycaster.near || distance > raycaster.far || intersects.push({
                            distance: distance,
                            point: interSegment.clone().applyMatrix4(this.matrixWorld),
                            index: i,
                            face: null,
                            faceIndex: null,
                            object: this
                        });
                    }
                } else for (var positions = attributes.position.array, i = 0, l = positions.length / 3 - 1; l > i; i += step) {
                    vStart.fromArray(positions, 3 * i), vEnd.fromArray(positions, 3 * i + 3);
                    var distSq = ray.distanceSqToSegment(vStart, vEnd, interRay, interSegment);
                    if (!(distSq > precisionSq)) {
                        interRay.applyMatrix4(this.matrixWorld);
                        var distance = raycaster.ray.origin.distanceTo(interRay);
                        distance < raycaster.near || distance > raycaster.far || intersects.push({
                            distance: distance,
                            point: interSegment.clone().applyMatrix4(this.matrixWorld),
                            index: i,
                            face: null,
                            faceIndex: null,
                            object: this
                        });
                    }
                }
            } else if (geometry instanceof THREE.Geometry) for (var vertices = geometry.vertices, nbVertices = vertices.length, i = 0; nbVertices - 1 > i; i += step) {
                var distSq = ray.distanceSqToSegment(vertices[i], vertices[i + 1], interRay, interSegment);
                if (!(distSq > precisionSq)) {
                    interRay.applyMatrix4(this.matrixWorld);
                    var distance = raycaster.ray.origin.distanceTo(interRay);
                    distance < raycaster.near || distance > raycaster.far || intersects.push({
                        distance: distance,
                        point: interSegment.clone().applyMatrix4(this.matrixWorld),
                        index: i,
                        face: null,
                        faceIndex: null,
                        object: this
                    });
                }
            }
        }
    };
}(), THREE.Line.prototype.clone = function() {
    return new this.constructor(this.geometry, this.material).copy(this);
}, THREE.LineStrip = 0, THREE.LinePieces = 1, THREE.LineSegments = function(geometry, material) {
    THREE.Line.call(this, geometry, material), this.type = "LineSegments";
}, THREE.LineSegments.prototype = Object.create(THREE.Line.prototype), THREE.LineSegments.prototype.constructor = THREE.LineSegments, 
THREE.Mesh = function(geometry, material) {
    THREE.Object3D.call(this), this.type = "Mesh", this.geometry = void 0 !== geometry ? geometry : new THREE.Geometry(), 
    this.material = void 0 !== material ? material : new THREE.MeshBasicMaterial({
        color: 16777215 * Math.random()
    }), this.updateMorphTargets();
}, THREE.Mesh.prototype = Object.create(THREE.Object3D.prototype), THREE.Mesh.prototype.constructor = THREE.Mesh, 
THREE.Mesh.prototype.updateMorphTargets = function() {
    if (void 0 !== this.geometry.morphTargets && this.geometry.morphTargets.length > 0) {
        this.morphTargetBase = -1, this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (var m = 0, ml = this.geometry.morphTargets.length; ml > m; m++) this.morphTargetInfluences.push(0), 
        this.morphTargetDictionary[this.geometry.morphTargets[m].name] = m;
    }
}, THREE.Mesh.prototype.getMorphTargetIndexByName = function(name) {
    return void 0 !== this.morphTargetDictionary[name] ? this.morphTargetDictionary[name] : (console.warn("THREE.Mesh.getMorphTargetIndexByName: morph target " + name + " does not exist. Returning 0."), 
    0);
}, THREE.Mesh.prototype.raycast = function() {
    function uvIntersection(point, p1, p2, p3, uv1, uv2, uv3) {
        return THREE.Triangle.barycoordFromPoint(point, p1, p2, p3, barycoord), uv1.multiplyScalar(barycoord.x), 
        uv2.multiplyScalar(barycoord.y), uv3.multiplyScalar(barycoord.z), uv1.add(uv2).add(uv3), 
        uv1.clone();
    }
    function checkIntersection(object, raycaster, ray, pA, pB, pC, point) {
        var intersect, material = object.material;
        if (intersect = material.side === THREE.BackSide ? ray.intersectTriangle(pC, pB, pA, !0, point) : ray.intersectTriangle(pA, pB, pC, material.side !== THREE.DoubleSide, point), 
        null === intersect) return null;
        intersectionPointWorld.copy(point), intersectionPointWorld.applyMatrix4(object.matrixWorld);
        var distance = raycaster.ray.origin.distanceTo(intersectionPointWorld);
        return distance < raycaster.near || distance > raycaster.far ? null : {
            distance: distance,
            point: intersectionPointWorld.clone(),
            object: object
        };
    }
    function checkBufferGeometryIntersection(object, raycaster, ray, positions, uvs, a, b, c) {
        vA.fromArray(positions, 3 * a), vB.fromArray(positions, 3 * b), vC.fromArray(positions, 3 * c);
        var intersection = checkIntersection(object, raycaster, ray, vA, vB, vC, intersectionPoint);
        return intersection && (uvs && (uvA.fromArray(uvs, 2 * a), uvB.fromArray(uvs, 2 * b), 
        uvC.fromArray(uvs, 2 * c), intersection.uv = uvIntersection(intersectionPoint, vA, vB, vC, uvA, uvB, uvC)), 
        intersection.face = new THREE.Face3(a, b, c, THREE.Triangle.normal(vA, vB, vC)), 
        intersection.faceIndex = a), intersection;
    }
    var inverseMatrix = new THREE.Matrix4(), ray = new THREE.Ray(), sphere = new THREE.Sphere(), vA = new THREE.Vector3(), vB = new THREE.Vector3(), vC = new THREE.Vector3(), tempA = new THREE.Vector3(), tempB = new THREE.Vector3(), tempC = new THREE.Vector3(), uvA = new THREE.Vector2(), uvB = new THREE.Vector2(), uvC = new THREE.Vector2(), barycoord = new THREE.Vector3(), intersectionPoint = new THREE.Vector3(), intersectionPointWorld = new THREE.Vector3();
    return function(raycaster, intersects) {
        var geometry = this.geometry, material = this.material;
        if (void 0 !== material) {
            null === geometry.boundingSphere && geometry.computeBoundingSphere();
            var matrixWorld = this.matrixWorld;
            if (sphere.copy(geometry.boundingSphere), sphere.applyMatrix4(matrixWorld), raycaster.ray.isIntersectionSphere(sphere) !== !1 && (inverseMatrix.getInverse(matrixWorld), 
            ray.copy(raycaster.ray).applyMatrix4(inverseMatrix), null === geometry.boundingBox || ray.isIntersectionBox(geometry.boundingBox) !== !1)) {
                var uvs, intersection;
                if (geometry instanceof THREE.BufferGeometry) {
                    var a, b, c, index = geometry.index, attributes = geometry.attributes, positions = attributes.position.array;
                    if (void 0 !== attributes.uv && (uvs = attributes.uv.array), null !== index) for (var indices = index.array, i = 0, l = indices.length; l > i; i += 3) a = indices[i], 
                    b = indices[i + 1], c = indices[i + 2], intersection = checkBufferGeometryIntersection(this, raycaster, ray, positions, uvs, a, b, c), 
                    intersection && (intersection.faceIndex = Math.floor(i / 3), intersects.push(intersection)); else for (var i = 0, l = positions.length; l > i; i += 9) a = i / 3, 
                    b = a + 1, c = a + 2, intersection = checkBufferGeometryIntersection(this, raycaster, ray, positions, uvs, a, b, c), 
                    intersection && (intersection.index = a, intersects.push(intersection));
                } else if (geometry instanceof THREE.Geometry) {
                    var fvA, fvB, fvC, isFaceMaterial = material instanceof THREE.MeshFaceMaterial, materials = isFaceMaterial === !0 ? material.materials : null, vertices = geometry.vertices, faces = geometry.faces, faceVertexUvs = geometry.faceVertexUvs[0];
                    faceVertexUvs.length > 0 && (uvs = faceVertexUvs);
                    for (var f = 0, fl = faces.length; fl > f; f++) {
                        var face = faces[f], faceMaterial = isFaceMaterial === !0 ? materials[face.materialIndex] : material;
                        if (void 0 !== faceMaterial) {
                            if (fvA = vertices[face.a], fvB = vertices[face.b], fvC = vertices[face.c], faceMaterial.morphTargets === !0) {
                                var morphTargets = geometry.morphTargets, morphInfluences = this.morphTargetInfluences;
                                vA.set(0, 0, 0), vB.set(0, 0, 0), vC.set(0, 0, 0);
                                for (var t = 0, tl = morphTargets.length; tl > t; t++) {
                                    var influence = morphInfluences[t];
                                    if (0 !== influence) {
                                        var targets = morphTargets[t].vertices;
                                        vA.addScaledVector(tempA.subVectors(targets[face.a], fvA), influence), vB.addScaledVector(tempB.subVectors(targets[face.b], fvB), influence), 
                                        vC.addScaledVector(tempC.subVectors(targets[face.c], fvC), influence);
                                    }
                                }
                                vA.add(fvA), vB.add(fvB), vC.add(fvC), fvA = vA, fvB = vB, fvC = vC;
                            }
                            if (intersection = checkIntersection(this, raycaster, ray, fvA, fvB, fvC, intersectionPoint)) {
                                if (uvs) {
                                    var uvs_f = uvs[f];
                                    uvA.copy(uvs_f[0]), uvB.copy(uvs_f[1]), uvC.copy(uvs_f[2]), intersection.uv = uvIntersection(intersectionPoint, fvA, fvB, fvC, uvA, uvB, uvC);
                                }
                                intersection.face = face, intersection.faceIndex = f, intersects.push(intersection);
                            }
                        }
                    }
                }
            }
        }
    };
}(), THREE.Mesh.prototype.clone = function() {
    return new this.constructor(this.geometry, this.material).copy(this);
}, THREE.Bone = function(skin) {
    THREE.Object3D.call(this), this.type = "Bone", this.skin = skin;
}, THREE.Bone.prototype = Object.create(THREE.Object3D.prototype), THREE.Bone.prototype.constructor = THREE.Bone, 
THREE.Bone.prototype.copy = function(source) {
    return THREE.Object3D.prototype.copy.call(this, source), this.skin = source.skin, 
    this;
}, THREE.Skeleton = function(bones, boneInverses, useVertexTexture) {
    if (this.useVertexTexture = void 0 !== useVertexTexture ? useVertexTexture : !0, 
    this.identityMatrix = new THREE.Matrix4(), bones = bones || [], this.bones = bones.slice(0), 
    this.useVertexTexture) {
        var size = Math.sqrt(4 * this.bones.length);
        size = THREE.Math.nextPowerOfTwo(Math.ceil(size)), size = Math.max(size, 4), this.boneTextureWidth = size, 
        this.boneTextureHeight = size, this.boneMatrices = new Float32Array(this.boneTextureWidth * this.boneTextureHeight * 4), 
        this.boneTexture = new THREE.DataTexture(this.boneMatrices, this.boneTextureWidth, this.boneTextureHeight, THREE.RGBAFormat, THREE.FloatType);
    } else this.boneMatrices = new Float32Array(16 * this.bones.length);
    if (void 0 === boneInverses) this.calculateInverses(); else if (this.bones.length === boneInverses.length) this.boneInverses = boneInverses.slice(0); else {
        console.warn("THREE.Skeleton bonInverses is the wrong length."), this.boneInverses = [];
        for (var b = 0, bl = this.bones.length; bl > b; b++) this.boneInverses.push(new THREE.Matrix4());
    }
}, THREE.Skeleton.prototype.calculateInverses = function() {
    this.boneInverses = [];
    for (var b = 0, bl = this.bones.length; bl > b; b++) {
        var inverse = new THREE.Matrix4();
        this.bones[b] && inverse.getInverse(this.bones[b].matrixWorld), this.boneInverses.push(inverse);
    }
}, THREE.Skeleton.prototype.pose = function() {
    for (var bone, b = 0, bl = this.bones.length; bl > b; b++) bone = this.bones[b], 
    bone && bone.matrixWorld.getInverse(this.boneInverses[b]);
    for (var b = 0, bl = this.bones.length; bl > b; b++) bone = this.bones[b], bone && (bone.parent ? (bone.matrix.getInverse(bone.parent.matrixWorld), 
    bone.matrix.multiply(bone.matrixWorld)) : bone.matrix.copy(bone.matrixWorld), bone.matrix.decompose(bone.position, bone.quaternion, bone.scale));
}, THREE.Skeleton.prototype.update = function() {
    var offsetMatrix = new THREE.Matrix4();
    return function() {
        for (var b = 0, bl = this.bones.length; bl > b; b++) {
            var matrix = this.bones[b] ? this.bones[b].matrixWorld : this.identityMatrix;
            offsetMatrix.multiplyMatrices(matrix, this.boneInverses[b]), offsetMatrix.flattenToArrayOffset(this.boneMatrices, 16 * b);
        }
        this.useVertexTexture && (this.boneTexture.needsUpdate = !0);
    };
}(), THREE.Skeleton.prototype.clone = function() {
    return new THREE.Skeleton(this.bones, this.boneInverses, this.useVertexTexture);
}, THREE.SkinnedMesh = function(geometry, material, useVertexTexture) {
    THREE.Mesh.call(this, geometry, material), this.type = "SkinnedMesh", this.bindMode = "attached", 
    this.bindMatrix = new THREE.Matrix4(), this.bindMatrixInverse = new THREE.Matrix4();
    var bones = [];
    if (this.geometry && void 0 !== this.geometry.bones) {
        for (var bone, gbone, b = 0, bl = this.geometry.bones.length; bl > b; ++b) gbone = this.geometry.bones[b], 
        bone = new THREE.Bone(this), bones.push(bone), bone.name = gbone.name, bone.position.fromArray(gbone.pos), 
        bone.quaternion.fromArray(gbone.rotq), void 0 !== gbone.scl && bone.scale.fromArray(gbone.scl);
        for (var b = 0, bl = this.geometry.bones.length; bl > b; ++b) gbone = this.geometry.bones[b], 
        -1 !== gbone.parent && null !== gbone.parent ? bones[gbone.parent].add(bones[b]) : this.add(bones[b]);
    }
    this.normalizeSkinWeights(), this.updateMatrixWorld(!0), this.bind(new THREE.Skeleton(bones, void 0, useVertexTexture), this.matrixWorld);
}, THREE.SkinnedMesh.prototype = Object.create(THREE.Mesh.prototype), THREE.SkinnedMesh.prototype.constructor = THREE.SkinnedMesh, 
THREE.SkinnedMesh.prototype.bind = function(skeleton, bindMatrix) {
    this.skeleton = skeleton, void 0 === bindMatrix && (this.updateMatrixWorld(!0), 
    this.skeleton.calculateInverses(), bindMatrix = this.matrixWorld), this.bindMatrix.copy(bindMatrix), 
    this.bindMatrixInverse.getInverse(bindMatrix);
}, THREE.SkinnedMesh.prototype.pose = function() {
    this.skeleton.pose();
}, THREE.SkinnedMesh.prototype.normalizeSkinWeights = function() {
    if (this.geometry instanceof THREE.Geometry) for (var i = 0; i < this.geometry.skinIndices.length; i++) {
        var sw = this.geometry.skinWeights[i], scale = 1 / sw.lengthManhattan();
        scale !== 1 / 0 ? sw.multiplyScalar(scale) : sw.set(1);
    }
}, THREE.SkinnedMesh.prototype.updateMatrixWorld = function(force) {
    THREE.Mesh.prototype.updateMatrixWorld.call(this, !0), "attached" === this.bindMode ? this.bindMatrixInverse.getInverse(this.matrixWorld) : "detached" === this.bindMode ? this.bindMatrixInverse.getInverse(this.bindMatrix) : console.warn("THREE.SkinnedMesh unrecognized bindMode: " + this.bindMode);
}, THREE.SkinnedMesh.prototype.clone = function() {
    return new this.constructor(this.geometry, this.material, this.useVertexTexture).copy(this);
}, THREE.LOD = function() {
    THREE.Object3D.call(this), this.type = "LOD", Object.defineProperties(this, {
        levels: {
            enumerable: !0,
            value: []
        },
        objects: {
            get: function() {
                return console.warn("THREE.LOD: .objects has been renamed to .levels."), this.levels;
            }
        }
    });
}, THREE.LOD.prototype = Object.create(THREE.Object3D.prototype), THREE.LOD.prototype.constructor = THREE.LOD, 
THREE.LOD.prototype.addLevel = function(object, distance) {
    void 0 === distance && (distance = 0), distance = Math.abs(distance);
    for (var levels = this.levels, l = 0; l < levels.length && !(distance < levels[l].distance); l++) ;
    levels.splice(l, 0, {
        distance: distance,
        object: object
    }), this.add(object);
}, THREE.LOD.prototype.getObjectForDistance = function(distance) {
    for (var levels = this.levels, i = 1, l = levels.length; l > i && !(distance < levels[i].distance); i++) ;
    return levels[i - 1].object;
}, THREE.LOD.prototype.raycast = function() {
    var matrixPosition = new THREE.Vector3();
    return function(raycaster, intersects) {
        matrixPosition.setFromMatrixPosition(this.matrixWorld);
        var distance = raycaster.ray.origin.distanceTo(matrixPosition);
        this.getObjectForDistance(distance).raycast(raycaster, intersects);
    };
}(), THREE.LOD.prototype.update = function() {
    var v1 = new THREE.Vector3(), v2 = new THREE.Vector3();
    return function(camera) {
        var levels = this.levels;
        if (levels.length > 1) {
            v1.setFromMatrixPosition(camera.matrixWorld), v2.setFromMatrixPosition(this.matrixWorld);
            var distance = v1.distanceTo(v2);
            levels[0].object.visible = !0;
            for (var i = 1, l = levels.length; l > i && distance >= levels[i].distance; i++) levels[i - 1].object.visible = !1, 
            levels[i].object.visible = !0;
            for (;l > i; i++) levels[i].object.visible = !1;
        }
    };
}(), THREE.LOD.prototype.copy = function(source) {
    THREE.Object3D.prototype.copy.call(this, source, !1);
    for (var levels = source.levels, i = 0, l = levels.length; l > i; i++) {
        var level = levels[i];
        this.addLevel(level.object.clone(), level.distance);
    }
    return this;
}, THREE.LOD.prototype.toJSON = function(meta) {
    var data = THREE.Object3D.prototype.toJSON.call(this, meta);
    data.object.levels = [];
    for (var levels = this.levels, i = 0, l = levels.length; l > i; i++) {
        var level = levels[i];
        data.object.levels.push({
            object: level.object.uuid,
            distance: level.distance
        });
    }
    return data;
}, THREE.Sprite = function() {
    var indices = new Uint16Array([ 0, 1, 2, 0, 2, 3 ]), vertices = new Float32Array([ -.5, -.5, 0, .5, -.5, 0, .5, .5, 0, -.5, .5, 0 ]), uvs = new Float32Array([ 0, 0, 1, 0, 1, 1, 0, 1 ]), geometry = new THREE.BufferGeometry();
    return geometry.setIndex(new THREE.BufferAttribute(indices, 1)), geometry.addAttribute("position", new THREE.BufferAttribute(vertices, 3)), 
    geometry.addAttribute("uv", new THREE.BufferAttribute(uvs, 2)), function(material) {
        THREE.Object3D.call(this), this.type = "Sprite", this.geometry = geometry, this.material = void 0 !== material ? material : new THREE.SpriteMaterial();
    };
}(), THREE.Sprite.prototype = Object.create(THREE.Object3D.prototype), THREE.Sprite.prototype.constructor = THREE.Sprite, 
THREE.Sprite.prototype.raycast = function() {
    var matrixPosition = new THREE.Vector3();
    return function(raycaster, intersects) {
        matrixPosition.setFromMatrixPosition(this.matrixWorld);
        var distanceSq = raycaster.ray.distanceSqToPoint(matrixPosition), guessSizeSq = this.scale.x * this.scale.y;
        distanceSq > guessSizeSq || intersects.push({
            distance: Math.sqrt(distanceSq),
            point: this.position,
            face: null,
            object: this
        });
    };
}(), THREE.Sprite.prototype.clone = function() {
    return new this.constructor(this.material).copy(this);
}, THREE.Particle = THREE.Sprite, THREE.LensFlare = function(texture, size, distance, blending, color) {
    THREE.Object3D.call(this), this.lensFlares = [], this.positionScreen = new THREE.Vector3(), 
    this.customUpdateCallback = void 0, void 0 !== texture && this.add(texture, size, distance, blending, color);
}, THREE.LensFlare.prototype = Object.create(THREE.Object3D.prototype), THREE.LensFlare.prototype.constructor = THREE.LensFlare, 
THREE.LensFlare.prototype.add = function(texture, size, distance, blending, color, opacity) {
    void 0 === size && (size = -1), void 0 === distance && (distance = 0), void 0 === opacity && (opacity = 1), 
    void 0 === color && (color = new THREE.Color(16777215)), void 0 === blending && (blending = THREE.NormalBlending), 
    distance = Math.min(distance, Math.max(0, distance)), this.lensFlares.push({
        texture: texture,
        size: size,
        distance: distance,
        x: 0,
        y: 0,
        z: 0,
        scale: 1,
        rotation: 0,
        opacity: opacity,
        color: color,
        blending: blending
    });
}, THREE.LensFlare.prototype.updateLensFlares = function() {
    var f, flare, fl = this.lensFlares.length, vecX = 2 * -this.positionScreen.x, vecY = 2 * -this.positionScreen.y;
    for (f = 0; fl > f; f++) flare = this.lensFlares[f], flare.x = this.positionScreen.x + vecX * flare.distance, 
    flare.y = this.positionScreen.y + vecY * flare.distance, flare.wantedRotation = flare.x * Math.PI * .25, 
    flare.rotation += .25 * (flare.wantedRotation - flare.rotation);
}, THREE.LensFlare.prototype.copy = function(source) {
    THREE.Object3D.prototype.copy.call(this, source), this.positionScreen.copy(source.positionScreen), 
    this.customUpdateCallback = source.customUpdateCallback;
    for (var i = 0, l = source.lensFlares.length; l > i; i++) this.lensFlares.push(source.lensFlares[i]);
    return this;
}, THREE.Scene = function() {
    THREE.Object3D.call(this), this.type = "Scene", this.fog = null, this.overrideMaterial = null, 
    this.autoUpdate = !0;
}, THREE.Scene.prototype = Object.create(THREE.Object3D.prototype), THREE.Scene.prototype.constructor = THREE.Scene, 
THREE.Scene.prototype.copy = function(source) {
    return THREE.Object3D.prototype.copy.call(this, source), null !== source.fog && (this.fog = source.fog.clone()), 
    null !== source.overrideMaterial && (this.overrideMaterial = source.overrideMaterial.clone()), 
    this.autoUpdate = source.autoUpdate, this.matrixAutoUpdate = source.matrixAutoUpdate, 
    this;
}, THREE.Fog = function(color, near, far) {
    this.name = "", this.color = new THREE.Color(color), this.near = void 0 !== near ? near : 1, 
    this.far = void 0 !== far ? far : 1e3;
}, THREE.Fog.prototype.clone = function() {
    return new THREE.Fog(this.color.getHex(), this.near, this.far);
}, THREE.FogExp2 = function(color, density) {
    this.name = "", this.color = new THREE.Color(color), this.density = void 0 !== density ? density : 25e-5;
}, THREE.FogExp2.prototype.clone = function() {
    return new THREE.FogExp2(this.color.getHex(), this.density);
}, THREE.ShaderChunk = {}, THREE.ShaderChunk.alphamap_fragment = "#ifdef USE_ALPHAMAP\n\n	diffuseColor.a *= texture2D( alphaMap, vUv ).g;\n\n#endif\n", 
THREE.ShaderChunk.alphamap_pars_fragment = "#ifdef USE_ALPHAMAP\n\n	uniform sampler2D alphaMap;\n\n#endif\n", 
THREE.ShaderChunk.alphatest_fragment = "#ifdef ALPHATEST\n\n	if ( diffuseColor.a < ALPHATEST ) discard;\n\n#endif\n", 
THREE.ShaderChunk.aomap_fragment = "#ifdef USE_AOMAP\n\n	totalAmbientLight *= ( texture2D( aoMap, vUv2 ).r - 1.0 ) * aoMapIntensity + 1.0;\n\n#endif\n", 
THREE.ShaderChunk.aomap_pars_fragment = "#ifdef USE_AOMAP\n\n	uniform sampler2D aoMap;\n	uniform float aoMapIntensity;\n\n#endif", 
THREE.ShaderChunk.begin_vertex = "\nvec3 transformed = vec3( position );\n", THREE.ShaderChunk.beginnormal_vertex = "\nvec3 objectNormal = vec3( normal );\n", 
THREE.ShaderChunk.bumpmap_pars_fragment = "#ifdef USE_BUMPMAP\n\n	uniform sampler2D bumpMap;\n	uniform float bumpScale;\n\n\n\n	vec2 dHdxy_fwd() {\n\n		vec2 dSTdx = dFdx( vUv );\n		vec2 dSTdy = dFdy( vUv );\n\n		float Hll = bumpScale * texture2D( bumpMap, vUv ).x;\n		float dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;\n		float dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;\n\n		return vec2( dBx, dBy );\n\n	}\n\n	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {\n\n		vec3 vSigmaX = dFdx( surf_pos );\n		vec3 vSigmaY = dFdy( surf_pos );\n		vec3 vN = surf_norm;\n		vec3 R1 = cross( vSigmaY, vN );\n		vec3 R2 = cross( vN, vSigmaX );\n\n		float fDet = dot( vSigmaX, R1 );\n\n		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n		return normalize( abs( fDet ) * surf_norm - vGrad );\n\n	}\n\n#endif\n", 
THREE.ShaderChunk.color_fragment = "#ifdef USE_COLOR\n\n	diffuseColor.rgb *= vColor;\n\n#endif", 
THREE.ShaderChunk.color_pars_fragment = "#ifdef USE_COLOR\n\n	varying vec3 vColor;\n\n#endif\n", 
THREE.ShaderChunk.color_pars_vertex = "#ifdef USE_COLOR\n\n	varying vec3 vColor;\n\n#endif", 
THREE.ShaderChunk.color_vertex = "#ifdef USE_COLOR\n\n	vColor.xyz = color.xyz;\n\n#endif", 
THREE.ShaderChunk.common = "#define PI 3.14159\n#define PI2 6.28318\n#define RECIPROCAL_PI2 0.15915494\n#define LOG2 1.442695\n#define EPSILON 1e-6\n\n#define saturate(a) clamp( a, 0.0, 1.0 )\n#define whiteCompliment(a) ( 1.0 - saturate( a ) )\n\nvec3 transformDirection( in vec3 normal, in mat4 matrix ) {\n\n	return normalize( ( matrix * vec4( normal, 0.0 ) ).xyz );\n\n}\n\nvec3 inverseTransformDirection( in vec3 normal, in mat4 matrix ) {\n\n	return normalize( ( vec4( normal, 0.0 ) * matrix ).xyz );\n\n}\n\nvec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\n	float distance = dot( planeNormal, point - pointOnPlane );\n\n	return - distance * planeNormal + point;\n\n}\n\nfloat sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\n	return sign( dot( point - pointOnPlane, planeNormal ) );\n\n}\n\nvec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\n	return lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;\n\n}\n\nfloat calcLightAttenuation( float lightDistance, float cutoffDistance, float decayExponent ) {\n\n	if ( decayExponent > 0.0 ) {\n\n	  return pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );\n\n	}\n\n	return 1.0;\n\n}\n\nvec3 F_Schlick( in vec3 specularColor, in float dotLH ) {\n\n\n	float fresnel = exp2( ( -5.55437 * dotLH - 6.98316 ) * dotLH );\n\n	return ( 1.0 - specularColor ) * fresnel + specularColor;\n\n}\n\nfloat G_BlinnPhong_Implicit( /* in float dotNL, in float dotNV */ ) {\n\n\n	return 0.25;\n\n}\n\nfloat D_BlinnPhong( in float shininess, in float dotNH ) {\n\n\n	return ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );\n\n}\n\nvec3 BRDF_BlinnPhong( in vec3 specularColor, in float shininess, in vec3 normal, in vec3 lightDir, in vec3 viewDir ) {\n\n	vec3 halfDir = normalize( lightDir + viewDir );\n\n	float dotNH = saturate( dot( normal, halfDir ) );\n	float dotLH = saturate( dot( lightDir, halfDir ) );\n\n	vec3 F = F_Schlick( specularColor, dotLH );\n\n	float G = G_BlinnPhong_Implicit( /* dotNL, dotNV */ );\n\n	float D = D_BlinnPhong( shininess, dotNH );\n\n	return F * G * D;\n\n}\n\nvec3 inputToLinear( in vec3 a ) {\n\n	#ifdef GAMMA_INPUT\n\n		return pow( a, vec3( float( GAMMA_FACTOR ) ) );\n\n	#else\n\n		return a;\n\n	#endif\n\n}\n\nvec3 linearToOutput( in vec3 a ) {\n\n	#ifdef GAMMA_OUTPUT\n\n		return pow( a, vec3( 1.0 / float( GAMMA_FACTOR ) ) );\n\n	#else\n\n		return a;\n\n	#endif\n\n}\n", 
THREE.ShaderChunk.defaultnormal_vertex = "#ifdef FLIP_SIDED\n\n	objectNormal = -objectNormal;\n\n#endif\n\nvec3 transformedNormal = normalMatrix * objectNormal;\n", 
THREE.ShaderChunk.displacementmap_vertex = "#ifdef USE_DISPLACEMENTMAP\n\n	transformed += normal * ( texture2D( displacementMap, uv ).x * displacementScale + displacementBias );\n\n#endif\n", 
THREE.ShaderChunk.displacementmap_pars_vertex = "#ifdef USE_DISPLACEMENTMAP\n\n	uniform sampler2D displacementMap;\n	uniform float displacementScale;\n	uniform float displacementBias;\n\n#endif\n", 
THREE.ShaderChunk.emissivemap_fragment = "#ifdef USE_EMISSIVEMAP\n\n	vec4 emissiveColor = texture2D( emissiveMap, vUv );\n\n	emissiveColor.rgb = inputToLinear( emissiveColor.rgb );\n\n	totalEmissiveLight *= emissiveColor.rgb;\n\n#endif\n", 
THREE.ShaderChunk.emissivemap_pars_fragment = "#ifdef USE_EMISSIVEMAP\n\n	uniform sampler2D emissiveMap;\n\n#endif\n", 
THREE.ShaderChunk.envmap_fragment = "#ifdef USE_ENVMAP\n\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n\n		vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );\n\n		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );\n\n		#ifdef ENVMAP_MODE_REFLECTION\n\n			vec3 reflectVec = reflect( cameraToVertex, worldNormal );\n\n		#else\n\n			vec3 reflectVec = refract( cameraToVertex, worldNormal, refractionRatio );\n\n		#endif\n\n	#else\n\n		vec3 reflectVec = vReflect;\n\n	#endif\n\n	#ifdef DOUBLE_SIDED\n		float flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n	#else\n		float flipNormal = 1.0;\n	#endif\n\n	#ifdef ENVMAP_TYPE_CUBE\n		vec4 envColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n\n	#elif defined( ENVMAP_TYPE_EQUIREC )\n		vec2 sampleUV;\n		sampleUV.y = saturate( flipNormal * reflectVec.y * 0.5 + 0.5 );\n		sampleUV.x = atan( flipNormal * reflectVec.z, flipNormal * reflectVec.x ) * RECIPROCAL_PI2 + 0.5;\n		vec4 envColor = texture2D( envMap, sampleUV );\n\n	#elif defined( ENVMAP_TYPE_SPHERE )\n		vec3 reflectView = flipNormal * normalize((viewMatrix * vec4( reflectVec, 0.0 )).xyz + vec3(0.0,0.0,1.0));\n		vec4 envColor = texture2D( envMap, reflectView.xy * 0.5 + 0.5 );\n	#endif\n\n	envColor.xyz = inputToLinear( envColor.xyz );\n\n	#ifdef ENVMAP_BLENDING_MULTIPLY\n\n		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );\n\n	#elif defined( ENVMAP_BLENDING_MIX )\n\n		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );\n\n	#elif defined( ENVMAP_BLENDING_ADD )\n\n		outgoingLight += envColor.xyz * specularStrength * reflectivity;\n\n	#endif\n\n#endif\n", 
THREE.ShaderChunk.envmap_pars_fragment = "#ifdef USE_ENVMAP\n\n	uniform float reflectivity;\n	#ifdef ENVMAP_TYPE_CUBE\n		uniform samplerCube envMap;\n	#else\n		uniform sampler2D envMap;\n	#endif\n	uniform float flipEnvMap;\n\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n\n		uniform float refractionRatio;\n\n	#else\n\n		varying vec3 vReflect;\n\n	#endif\n\n#endif\n", 
THREE.ShaderChunk.envmap_pars_vertex = "#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP ) && ! defined( PHONG )\n\n	varying vec3 vReflect;\n\n	uniform float refractionRatio;\n\n#endif\n", 
THREE.ShaderChunk.envmap_vertex = "#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP ) && ! defined( PHONG )\n\n	vec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );\n\n	vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );\n\n	#ifdef ENVMAP_MODE_REFLECTION\n\n		vReflect = reflect( cameraToVertex, worldNormal );\n\n	#else\n\n		vReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n\n	#endif\n\n#endif\n", 
THREE.ShaderChunk.fog_fragment = "#ifdef USE_FOG\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		float depth = gl_FragDepthEXT / gl_FragCoord.w;\n\n	#else\n\n		float depth = gl_FragCoord.z / gl_FragCoord.w;\n\n	#endif\n\n	#ifdef FOG_EXP2\n\n		float fogFactor = whiteCompliment( exp2( - fogDensity * fogDensity * depth * depth * LOG2 ) );\n\n	#else\n\n		float fogFactor = smoothstep( fogNear, fogFar, depth );\n\n	#endif\n	\n	outgoingLight = mix( outgoingLight, fogColor, fogFactor );\n\n#endif", 
THREE.ShaderChunk.fog_pars_fragment = "#ifdef USE_FOG\n\n	uniform vec3 fogColor;\n\n	#ifdef FOG_EXP2\n\n		uniform float fogDensity;\n\n	#else\n\n		uniform float fogNear;\n		uniform float fogFar;\n	#endif\n\n#endif", 
THREE.ShaderChunk.hemilight_fragment = "#if MAX_HEMI_LIGHTS > 0\n\n	for ( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\n\n		vec3 lightDir = hemisphereLightDirection[ i ];\n\n		float dotProduct = dot( normal, lightDir );\n\n		float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\n\n		vec3 lightColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\n\n		totalAmbientLight += lightColor;\n\n	}\n\n#endif\n\n", 
THREE.ShaderChunk.lightmap_fragment = "#ifdef USE_LIGHTMAP\n\n	totalAmbientLight += texture2D( lightMap, vUv2 ).xyz * lightMapIntensity;\n\n#endif\n", 
THREE.ShaderChunk.lightmap_pars_fragment = "#ifdef USE_LIGHTMAP\n\n	uniform sampler2D lightMap;\n	uniform float lightMapIntensity;\n\n#endif", 
THREE.ShaderChunk.lights_lambert_pars_vertex = "#if MAX_DIR_LIGHTS > 0\n\n	uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\n	uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	uniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n	uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDecay[ MAX_POINT_LIGHTS ];\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	uniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightDecay[ MAX_SPOT_LIGHTS ];\n\n#endif\n", 
THREE.ShaderChunk.lights_lambert_vertex = "vLightFront = vec3( 0.0 );\n\n#ifdef DOUBLE_SIDED\n\n	vLightBack = vec3( 0.0 );\n\n#endif\n\nvec3 normal = normalize( transformedNormal );\n\n#if MAX_POINT_LIGHTS > 0\n\n	for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n\n		vec3 lightColor = pointLightColor[ i ];\n\n		vec3 lVector = pointLightPosition[ i ] - mvPosition.xyz;\n		vec3 lightDir = normalize( lVector );\n\n\n		float attenuation = calcLightAttenuation( length( lVector ), pointLightDistance[ i ], pointLightDecay[ i ] );\n\n\n		float dotProduct = dot( normal, lightDir );\n\n		vLightFront += lightColor * attenuation * saturate( dotProduct );\n\n		#ifdef DOUBLE_SIDED\n\n			vLightBack += lightColor * attenuation * saturate( - dotProduct );\n\n		#endif\n\n	}\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	for ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n\n		vec3 lightColor = spotLightColor[ i ];\n\n		vec3 lightPosition = spotLightPosition[ i ];\n		vec3 lVector = lightPosition - mvPosition.xyz;\n		vec3 lightDir = normalize( lVector );\n\n		float spotEffect = dot( spotLightDirection[ i ], lightDir );\n\n		if ( spotEffect > spotLightAngleCos[ i ] ) {\n\n			spotEffect = saturate( pow( saturate( spotEffect ), spotLightExponent[ i ] ) );\n\n\n			float attenuation = calcLightAttenuation( length( lVector ), spotLightDistance[ i ], spotLightDecay[ i ] );\n\n			attenuation *= spotEffect;\n\n\n			float dotProduct = dot( normal, lightDir );\n\n			vLightFront += lightColor * attenuation * saturate( dotProduct );\n\n			#ifdef DOUBLE_SIDED\n\n				vLightBack += lightColor * attenuation * saturate( - dotProduct );\n\n			#endif\n\n		}\n\n	}\n\n#endif\n\n#if MAX_DIR_LIGHTS > 0\n\n	for ( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\n\n		vec3 lightColor = directionalLightColor[ i ];\n\n		vec3 lightDir = directionalLightDirection[ i ];\n\n\n		float dotProduct = dot( normal, lightDir );\n\n		vLightFront += lightColor * saturate( dotProduct );\n\n		#ifdef DOUBLE_SIDED\n\n			vLightBack += lightColor * saturate( - dotProduct );\n\n		#endif\n\n	}\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	for ( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\n\n		vec3 lightDir = hemisphereLightDirection[ i ];\n\n\n		float dotProduct = dot( normal, lightDir );\n\n		float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\n\n		vLightFront += mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\n\n		#ifdef DOUBLE_SIDED\n\n			float hemiDiffuseWeightBack = - 0.5 * dotProduct + 0.5;\n\n			vLightBack += mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeightBack );\n\n		#endif\n\n	}\n\n#endif\n", 
THREE.ShaderChunk.lights_phong_fragment = "vec3 viewDir = normalize( vViewPosition );\n\nvec3 totalDiffuseLight = vec3( 0.0 );\nvec3 totalSpecularLight = vec3( 0.0 );\n\n#if MAX_POINT_LIGHTS > 0\n\n	for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n\n		vec3 lightColor = pointLightColor[ i ];\n\n		vec3 lightPosition = pointLightPosition[ i ];\n		vec3 lVector = lightPosition + vViewPosition.xyz;\n		vec3 lightDir = normalize( lVector );\n\n\n		float attenuation = calcLightAttenuation( length( lVector ), pointLightDistance[ i ], pointLightDecay[ i ] );\n\n\n		float cosineTerm = saturate( dot( normal, lightDir ) );\n\n		totalDiffuseLight += lightColor * attenuation * cosineTerm;\n\n\n		vec3 brdf = BRDF_BlinnPhong( specular, shininess, normal, lightDir, viewDir );\n\n		totalSpecularLight += brdf * specularStrength * lightColor * attenuation * cosineTerm;\n\n\n	}\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	for ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n\n		vec3 lightColor = spotLightColor[ i ];\n\n		vec3 lightPosition = spotLightPosition[ i ];\n		vec3 lVector = lightPosition + vViewPosition.xyz;\n		vec3 lightDir = normalize( lVector );\n\n		float spotEffect = dot( spotLightDirection[ i ], lightDir );\n\n		if ( spotEffect > spotLightAngleCos[ i ] ) {\n\n			spotEffect = saturate( pow( saturate( spotEffect ), spotLightExponent[ i ] ) );\n\n\n			float attenuation = calcLightAttenuation( length( lVector ), spotLightDistance[ i ], spotLightDecay[ i ] );\n\n			attenuation *= spotEffect;\n\n\n			float cosineTerm = saturate( dot( normal, lightDir ) );\n\n			totalDiffuseLight += lightColor * attenuation * cosineTerm;\n\n\n			vec3 brdf = BRDF_BlinnPhong( specular, shininess, normal, lightDir, viewDir );\n\n			totalSpecularLight += brdf * specularStrength * lightColor * attenuation * cosineTerm;\n\n		}\n\n	}\n\n#endif\n\n#if MAX_DIR_LIGHTS > 0\n\n	for ( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\n\n		vec3 lightColor = directionalLightColor[ i ];\n\n		vec3 lightDir = directionalLightDirection[ i ];\n\n\n		float cosineTerm = saturate( dot( normal, lightDir ) );\n\n		totalDiffuseLight += lightColor * cosineTerm;\n\n\n		vec3 brdf = BRDF_BlinnPhong( specular, shininess, normal, lightDir, viewDir );\n\n		totalSpecularLight += brdf * specularStrength * lightColor * cosineTerm;\n\n	}\n\n#endif\n", 
THREE.ShaderChunk.lights_phong_pars_fragment = "uniform vec3 ambientLightColor;\n\n#if MAX_DIR_LIGHTS > 0\n\n	uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\n	uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	uniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n\n	uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDecay[ MAX_POINT_LIGHTS ];\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	uniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightDecay[ MAX_SPOT_LIGHTS ];\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0 || defined( USE_ENVMAP )\n\n	varying vec3 vWorldPosition;\n\n#endif\n\nvarying vec3 vViewPosition;\n\n#ifndef FLAT_SHADED\n\n	varying vec3 vNormal;\n\n#endif\n", 
THREE.ShaderChunk.lights_phong_pars_vertex = "#if MAX_SPOT_LIGHTS > 0 || defined( USE_ENVMAP )\n\n	varying vec3 vWorldPosition;\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\n\n#endif\n", 
THREE.ShaderChunk.lights_phong_vertex = "#if MAX_SPOT_LIGHTS > 0 || defined( USE_ENVMAP )\n\n	vWorldPosition = worldPosition.xyz;\n\n#endif\n", 
THREE.ShaderChunk.linear_to_gamma_fragment = "\n	outgoingLight = linearToOutput( outgoingLight );\n", 
THREE.ShaderChunk.logdepthbuf_fragment = "#if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)\n\n	gl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;\n\n#endif", 
THREE.ShaderChunk.logdepthbuf_pars_fragment = "#ifdef USE_LOGDEPTHBUF\n\n	uniform float logDepthBufFC;\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		varying float vFragDepth;\n\n	#endif\n\n#endif\n", 
THREE.ShaderChunk.logdepthbuf_pars_vertex = "#ifdef USE_LOGDEPTHBUF\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		varying float vFragDepth;\n\n	#endif\n\n	uniform float logDepthBufFC;\n\n#endif", 
THREE.ShaderChunk.logdepthbuf_vertex = "#ifdef USE_LOGDEPTHBUF\n\n	gl_Position.z = log2(max( EPSILON, gl_Position.w + 1.0 )) * logDepthBufFC;\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		vFragDepth = 1.0 + gl_Position.w;\n\n#else\n\n		gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;\n\n	#endif\n\n#endif", 
THREE.ShaderChunk.map_fragment = "#ifdef USE_MAP\n\n	vec4 texelColor = texture2D( map, vUv );\n\n	texelColor.xyz = inputToLinear( texelColor.xyz );\n\n	diffuseColor *= texelColor;\n\n#endif\n", 
THREE.ShaderChunk.map_pars_fragment = "#ifdef USE_MAP\n\n	uniform sampler2D map;\n\n#endif", 
THREE.ShaderChunk.map_particle_fragment = "#ifdef USE_MAP\n\n	diffuseColor *= texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) * offsetRepeat.zw + offsetRepeat.xy );\n\n#endif\n", 
THREE.ShaderChunk.map_particle_pars_fragment = "#ifdef USE_MAP\n\n	uniform vec4 offsetRepeat;\n	uniform sampler2D map;\n\n#endif\n", 
THREE.ShaderChunk.morphnormal_vertex = "#ifdef USE_MORPHNORMALS\n\n	objectNormal += ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];\n	objectNormal += ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];\n	objectNormal += ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];\n	objectNormal += ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];\n\n#endif\n", 
THREE.ShaderChunk.morphtarget_pars_vertex = "#ifdef USE_MORPHTARGETS\n\n	#ifndef USE_MORPHNORMALS\n\n	uniform float morphTargetInfluences[ 8 ];\n\n	#else\n\n	uniform float morphTargetInfluences[ 4 ];\n\n	#endif\n\n#endif", 
THREE.ShaderChunk.morphtarget_vertex = "#ifdef USE_MORPHTARGETS\n\n	transformed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];\n	transformed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];\n	transformed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];\n	transformed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\n\n	#ifndef USE_MORPHNORMALS\n\n	transformed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];\n	transformed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];\n	transformed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];\n	transformed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\n\n	#endif\n\n#endif\n", 
THREE.ShaderChunk.normal_phong_fragment = "#ifndef FLAT_SHADED\n\n	vec3 normal = normalize( vNormal );\n\n	#ifdef DOUBLE_SIDED\n\n		normal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n\n	#endif\n\n#else\n\n	vec3 fdx = dFdx( vViewPosition );\n	vec3 fdy = dFdy( vViewPosition );\n	vec3 normal = normalize( cross( fdx, fdy ) );\n\n#endif\n\n#ifdef USE_NORMALMAP\n\n	normal = perturbNormal2Arb( -vViewPosition, normal );\n\n#elif defined( USE_BUMPMAP )\n\n	normal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );\n\n#endif\n\n", 
THREE.ShaderChunk.normalmap_pars_fragment = "#ifdef USE_NORMALMAP\n\n	uniform sampler2D normalMap;\n	uniform vec2 normalScale;\n\n\n	vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {\n\n		vec3 q0 = dFdx( eye_pos.xyz );\n		vec3 q1 = dFdy( eye_pos.xyz );\n		vec2 st0 = dFdx( vUv.st );\n		vec2 st1 = dFdy( vUv.st );\n\n		vec3 S = normalize( q0 * st1.t - q1 * st0.t );\n		vec3 T = normalize( -q0 * st1.s + q1 * st0.s );\n		vec3 N = normalize( surf_norm );\n\n		vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;\n		mapN.xy = normalScale * mapN.xy;\n		mat3 tsn = mat3( S, T, N );\n		return normalize( tsn * mapN );\n\n	}\n\n#endif\n", 
THREE.ShaderChunk.project_vertex = "#ifdef USE_SKINNING\n\n	vec4 mvPosition = modelViewMatrix * skinned;\n\n#else\n\n	vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );\n\n#endif\n\ngl_Position = projectionMatrix * mvPosition;\n", 
THREE.ShaderChunk.shadowmap_fragment = "#ifdef USE_SHADOWMAP\n\n	for ( int i = 0; i < MAX_SHADOWS; i ++ ) {\n\n		float texelSizeY =  1.0 / shadowMapSize[ i ].y;\n\n		float shadow = 0.0;\n\n#if defined( POINT_LIGHT_SHADOWS )\n\n		bool isPointLight = shadowDarkness[ i ] < 0.0;\n\n		if ( isPointLight ) {\n\n			float realShadowDarkness = abs( shadowDarkness[ i ] );\n\n			vec3 lightToPosition = vShadowCoord[ i ].xyz;\n\n	#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT )\n\n			vec3 bd3D = normalize( lightToPosition );\n			float dp = length( lightToPosition );\n\n			adjustShadowValue1K( dp, texture2D( shadowMap[ i ], cubeToUV( bd3D, texelSizeY ) ), shadowBias[ i ], shadow );\n\n\n	#if defined( SHADOWMAP_TYPE_PCF )\n			const float Dr = 1.25;\n	#elif defined( SHADOWMAP_TYPE_PCF_SOFT )\n			const float Dr = 2.25;\n	#endif\n\n			float os = Dr *  2.0 * texelSizeY;\n\n			const vec3 Gsd = vec3( - 1, 0, 1 );\n\n			adjustShadowValue1K( dp, texture2D( shadowMap[ i ], cubeToUV( bd3D + Gsd.zzz * os, texelSizeY ) ), shadowBias[ i ], shadow );\n			adjustShadowValue1K( dp, texture2D( shadowMap[ i ], cubeToUV( bd3D + Gsd.zxz * os, texelSizeY ) ), shadowBias[ i ], shadow );\n			adjustShadowValue1K( dp, texture2D( shadowMap[ i ], cubeToUV( bd3D + Gsd.xxz * os, texelSizeY ) ), shadowBias[ i ], shadow );\n			adjustShadowValue1K( dp, texture2D( shadowMap[ i ], cubeToUV( bd3D + Gsd.xzz * os, texelSizeY ) ), shadowBias[ i ], shadow );\n			adjustShadowValue1K( dp, texture2D( shadowMap[ i ], cubeToUV( bd3D + Gsd.zzx * os, texelSizeY ) ), shadowBias[ i ], shadow );\n			adjustShadowValue1K( dp, texture2D( shadowMap[ i ], cubeToUV( bd3D + Gsd.zxx * os, texelSizeY ) ), shadowBias[ i ], shadow );\n			adjustShadowValue1K( dp, texture2D( shadowMap[ i ], cubeToUV( bd3D + Gsd.xxx * os, texelSizeY ) ), shadowBias[ i ], shadow );\n			adjustShadowValue1K( dp, texture2D( shadowMap[ i ], cubeToUV( bd3D + Gsd.xzx * os, texelSizeY ) ), shadowBias[ i ], shadow );\n			adjustShadowValue1K( dp, texture2D( shadowMap[ i ], cubeToUV( bd3D + Gsd.zzy * os, texelSizeY ) ), shadowBias[ i ], shadow );\n			adjustShadowValue1K( dp, texture2D( shadowMap[ i ], cubeToUV( bd3D + Gsd.zxy * os, texelSizeY ) ), shadowBias[ i ], shadow );\n\n			adjustShadowValue1K( dp, texture2D( shadowMap[ i ], cubeToUV( bd3D + Gsd.xxy * os, texelSizeY ) ), shadowBias[ i ], shadow );\n			adjustShadowValue1K( dp, texture2D( shadowMap[ i ], cubeToUV( bd3D + Gsd.xzy * os, texelSizeY ) ), shadowBias[ i ], shadow );\n			adjustShadowValue1K( dp, texture2D( shadowMap[ i ], cubeToUV( bd3D + Gsd.zyz * os, texelSizeY ) ), shadowBias[ i ], shadow );\n			adjustShadowValue1K( dp, texture2D( shadowMap[ i ], cubeToUV( bd3D + Gsd.xyz * os, texelSizeY ) ), shadowBias[ i ], shadow );\n			adjustShadowValue1K( dp, texture2D( shadowMap[ i ], cubeToUV( bd3D + Gsd.zyx * os, texelSizeY ) ), shadowBias[ i ], shadow );\n			adjustShadowValue1K( dp, texture2D( shadowMap[ i ], cubeToUV( bd3D + Gsd.xyx * os, texelSizeY ) ), shadowBias[ i ], shadow );\n			adjustShadowValue1K( dp, texture2D( shadowMap[ i ], cubeToUV( bd3D + Gsd.yzz * os, texelSizeY ) ), shadowBias[ i ], shadow );\n			adjustShadowValue1K( dp, texture2D( shadowMap[ i ], cubeToUV( bd3D + Gsd.yxz * os, texelSizeY ) ), shadowBias[ i ], shadow );\n			adjustShadowValue1K( dp, texture2D( shadowMap[ i ], cubeToUV( bd3D + Gsd.yxx * os, texelSizeY ) ), shadowBias[ i ], shadow );\n			adjustShadowValue1K( dp, texture2D( shadowMap[ i ], cubeToUV( bd3D + Gsd.yzx * os, texelSizeY ) ), shadowBias[ i ], shadow );\n\n			shadow *= realShadowDarkness * ( 1.0 / 21.0 );\n\n	#else \n			vec3 bd3D = normalize( lightToPosition );\n			float dp = length( lightToPosition );\n\n			adjustShadowValue1K( dp, texture2D( shadowMap[ i ], cubeToUV( bd3D, texelSizeY ) ), shadowBias[ i ], shadow );\n\n			shadow *= realShadowDarkness;\n\n	#endif\n\n		} else {\n\n#endif \n			float texelSizeX =  1.0 / shadowMapSize[ i ].x;\n\n			vec3 shadowCoord = vShadowCoord[ i ].xyz / vShadowCoord[ i ].w;\n\n\n			bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n			bool inFrustum = all( inFrustumVec );\n\n			bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n\n			bool frustumTest = all( frustumTestVec );\n\n			if ( frustumTest ) {\n\n	#if defined( SHADOWMAP_TYPE_PCF )\n\n\n				/*\n					for ( float y = -1.25; y <= 1.25; y += 1.25 )\n						for ( float x = -1.25; x <= 1.25; x += 1.25 ) {\n							vec4 rgbaDepth = texture2D( shadowMap[ i ], vec2( x * xPixelOffset, y * yPixelOffset ) + shadowCoord.xy );\n							float fDepth = unpackDepth( rgbaDepth );\n							if ( fDepth < shadowCoord.z )\n								shadow += 1.0;\n					}\n					shadow /= 9.0;\n				*/\n\n				shadowCoord.z += shadowBias[ i ];\n\n				const float ShadowDelta = 1.0 / 9.0;\n\n				float xPixelOffset = texelSizeX;\n				float yPixelOffset = texelSizeY;\n\n				float dx0 = - 1.25 * xPixelOffset;\n				float dy0 = - 1.25 * yPixelOffset;\n				float dx1 = 1.25 * xPixelOffset;\n				float dy1 = 1.25 * yPixelOffset;\n\n				float fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += ShadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += ShadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += ShadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += ShadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\n				if ( fDepth < shadowCoord.z ) shadow += ShadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += ShadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += ShadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += ShadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += ShadowDelta;\n\n				shadow *= shadowDarkness[ i ];\n\n	#elif defined( SHADOWMAP_TYPE_PCF_SOFT )\n\n\n				shadowCoord.z += shadowBias[ i ];\n\n				float xPixelOffset = texelSizeX;\n				float yPixelOffset = texelSizeY;\n\n				float dx0 = - 1.0 * xPixelOffset;\n				float dy0 = - 1.0 * yPixelOffset;\n				float dx1 = 1.0 * xPixelOffset;\n				float dy1 = 1.0 * yPixelOffset;\n\n				mat3 shadowKernel;\n				mat3 depthKernel;\n\n				depthKernel[ 0 ][ 0 ] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\n				depthKernel[ 0 ][ 1 ] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\n				depthKernel[ 0 ][ 2 ] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\n				depthKernel[ 1 ][ 0 ] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\n				depthKernel[ 1 ][ 1 ] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\n				depthKernel[ 1 ][ 2 ] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\n				depthKernel[ 2 ][ 0 ] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\n				depthKernel[ 2 ][ 1 ] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\n				depthKernel[ 2 ][ 2 ] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\n\n				vec3 shadowZ = vec3( shadowCoord.z );\n				shadowKernel[ 0 ] = vec3( lessThan( depthKernel[ 0 ], shadowZ ) );\n				shadowKernel[ 0 ] *= vec3( 0.25 );\n\n				shadowKernel[ 1 ] = vec3( lessThan( depthKernel[ 1 ], shadowZ ) );\n				shadowKernel[ 1 ] *= vec3( 0.25 );\n\n				shadowKernel[ 2 ] = vec3( lessThan( depthKernel[ 2 ], shadowZ ) );\n				shadowKernel[ 2 ] *= vec3( 0.25 );\n\n				vec2 fractionalCoord = 1.0 - fract( shadowCoord.xy * shadowMapSize[ i ].xy );\n\n				shadowKernel[ 0 ] = mix( shadowKernel[ 1 ], shadowKernel[ 0 ], fractionalCoord.x );\n				shadowKernel[ 1 ] = mix( shadowKernel[ 2 ], shadowKernel[ 1 ], fractionalCoord.x );\n\n				vec4 shadowValues;\n				shadowValues.x = mix( shadowKernel[ 0 ][ 1 ], shadowKernel[ 0 ][ 0 ], fractionalCoord.y );\n				shadowValues.y = mix( shadowKernel[ 0 ][ 2 ], shadowKernel[ 0 ][ 1 ], fractionalCoord.y );\n				shadowValues.z = mix( shadowKernel[ 1 ][ 1 ], shadowKernel[ 1 ][ 0 ], fractionalCoord.y );\n				shadowValues.w = mix( shadowKernel[ 1 ][ 2 ], shadowKernel[ 1 ][ 1 ], fractionalCoord.y );\n\n				shadow = dot( shadowValues, vec4( 1.0 ) ) * shadowDarkness[ i ];\n\n	#else \n				shadowCoord.z += shadowBias[ i ];\n\n				vec4 rgbaDepth = texture2D( shadowMap[ i ], shadowCoord.xy );\n				float fDepth = unpackDepth( rgbaDepth );\n\n				if ( fDepth < shadowCoord.z )\n					shadow = shadowDarkness[ i ];\n\n	#endif\n\n			}\n\n#ifdef SHADOWMAP_DEBUG\n\n			if ( inFrustum ) {\n\n				if ( i == 0 ) {\n\n					outgoingLight *= vec3( 1.0, 0.5, 0.0 );\n\n				} else if ( i == 1 ) {\n\n					outgoingLight *= vec3( 0.0, 1.0, 0.8 );\n\n				} else {\n\n					outgoingLight *= vec3( 0.0, 0.5, 1.0 );\n\n				}\n\n			}\n\n#endif\n\n#if defined( POINT_LIGHT_SHADOWS )\n\n		}\n\n#endif\n\n		shadowMask = shadowMask * vec3( 1.0 - shadow );\n\n	}\n\n#endif\n", 
THREE.ShaderChunk.shadowmap_pars_fragment = "#ifdef USE_SHADOWMAP\n\n	uniform sampler2D shadowMap[ MAX_SHADOWS ];\n	uniform vec2 shadowMapSize[ MAX_SHADOWS ];\n\n	uniform float shadowDarkness[ MAX_SHADOWS ];\n	uniform float shadowBias[ MAX_SHADOWS ];\n\n	varying vec4 vShadowCoord[ MAX_SHADOWS ];\n\n	float unpackDepth( const in vec4 rgba_depth ) {\n\n		const vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );\n		float depth = dot( rgba_depth, bit_shift );\n		return depth;\n\n	}\n\n	#if defined(POINT_LIGHT_SHADOWS)\n\n\n		void adjustShadowValue1K( const float testDepth, const vec4 textureData, const float bias, inout float shadowValue ) {\n\n			const vec4 bitSh = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );\n			if ( testDepth >= dot( textureData, bitSh ) * 1000.0 + bias )\n				shadowValue += 1.0;\n\n		}\n\n\n		vec2 cubeToUV( vec3 v, float texelSizeY ) {\n\n\n			vec3 absV = abs( v );\n\n\n			float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );\n			absV *= scaleToCube;\n\n\n			v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );\n\n\n\n			vec2 planar = v.xy;\n\n			float almostATexel = 1.5 * texelSizeY;\n			float almostOne = 1.0 - almostATexel;\n\n			if ( absV.z >= almostOne ) {\n\n				if ( v.z > 0.0 )\n					planar.x = 4.0 - v.x;\n\n			} else if ( absV.x >= almostOne ) {\n\n				float signX = sign( v.x );\n				planar.x = v.z * signX + 2.0 * signX;\n\n			} else if ( absV.y >= almostOne ) {\n\n				float signY = sign( v.y );\n				planar.x = v.x + 2.0 * signY + 2.0;\n				planar.y = v.z * signY - 2.0;\n\n			}\n\n\n			return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );\n\n		}\n\n	#endif\n\n#endif\n", 
THREE.ShaderChunk.shadowmap_pars_vertex = "#ifdef USE_SHADOWMAP\n\n	uniform float shadowDarkness[ MAX_SHADOWS ];\n	uniform mat4 shadowMatrix[ MAX_SHADOWS ];\n	varying vec4 vShadowCoord[ MAX_SHADOWS ];\n\n#endif", 
THREE.ShaderChunk.shadowmap_vertex = "#ifdef USE_SHADOWMAP\n\n	for ( int i = 0; i < MAX_SHADOWS; i ++ ) {\n\n			vShadowCoord[ i ] = shadowMatrix[ i ] * worldPosition;\n\n	}\n\n#endif", 
THREE.ShaderChunk.skinbase_vertex = "#ifdef USE_SKINNING\n\n	mat4 boneMatX = getBoneMatrix( skinIndex.x );\n	mat4 boneMatY = getBoneMatrix( skinIndex.y );\n	mat4 boneMatZ = getBoneMatrix( skinIndex.z );\n	mat4 boneMatW = getBoneMatrix( skinIndex.w );\n\n#endif", 
THREE.ShaderChunk.skinning_pars_vertex = "#ifdef USE_SKINNING\n\n	uniform mat4 bindMatrix;\n	uniform mat4 bindMatrixInverse;\n\n	#ifdef BONE_TEXTURE\n\n		uniform sampler2D boneTexture;\n		uniform int boneTextureWidth;\n		uniform int boneTextureHeight;\n\n		mat4 getBoneMatrix( const in float i ) {\n\n			float j = i * 4.0;\n			float x = mod( j, float( boneTextureWidth ) );\n			float y = floor( j / float( boneTextureWidth ) );\n\n			float dx = 1.0 / float( boneTextureWidth );\n			float dy = 1.0 / float( boneTextureHeight );\n\n			y = dy * ( y + 0.5 );\n\n			vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\n			vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\n			vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\n			vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\n\n			mat4 bone = mat4( v1, v2, v3, v4 );\n\n			return bone;\n\n		}\n\n	#else\n\n		uniform mat4 boneGlobalMatrices[ MAX_BONES ];\n\n		mat4 getBoneMatrix( const in float i ) {\n\n			mat4 bone = boneGlobalMatrices[ int(i) ];\n			return bone;\n\n		}\n\n	#endif\n\n#endif\n", 
THREE.ShaderChunk.skinning_vertex = "#ifdef USE_SKINNING\n\n	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );\n\n	vec4 skinned = vec4( 0.0 );\n	skinned += boneMatX * skinVertex * skinWeight.x;\n	skinned += boneMatY * skinVertex * skinWeight.y;\n	skinned += boneMatZ * skinVertex * skinWeight.z;\n	skinned += boneMatW * skinVertex * skinWeight.w;\n	skinned  = bindMatrixInverse * skinned;\n\n#endif\n", 
THREE.ShaderChunk.skinnormal_vertex = "#ifdef USE_SKINNING\n\n	mat4 skinMatrix = mat4( 0.0 );\n	skinMatrix += skinWeight.x * boneMatX;\n	skinMatrix += skinWeight.y * boneMatY;\n	skinMatrix += skinWeight.z * boneMatZ;\n	skinMatrix += skinWeight.w * boneMatW;\n	skinMatrix  = bindMatrixInverse * skinMatrix * bindMatrix;\n\n	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;\n\n#endif\n", 
THREE.ShaderChunk.specularmap_fragment = "float specularStrength;\n\n#ifdef USE_SPECULARMAP\n\n	vec4 texelSpecular = texture2D( specularMap, vUv );\n	specularStrength = texelSpecular.r;\n\n#else\n\n	specularStrength = 1.0;\n\n#endif", 
THREE.ShaderChunk.specularmap_pars_fragment = "#ifdef USE_SPECULARMAP\n\n	uniform sampler2D specularMap;\n\n#endif", 
THREE.ShaderChunk.uv2_pars_fragment = "#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n\n	varying vec2 vUv2;\n\n#endif", 
THREE.ShaderChunk.uv2_pars_vertex = "#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n\n	attribute vec2 uv2;\n	varying vec2 vUv2;\n\n#endif", 
THREE.ShaderChunk.uv2_vertex = "#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n\n	vUv2 = uv2;\n\n#endif", 
THREE.ShaderChunk.uv_pars_fragment = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP )\n\n	varying vec2 vUv;\n\n#endif", 
THREE.ShaderChunk.uv_pars_vertex = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP )\n\n	varying vec2 vUv;\n	uniform vec4 offsetRepeat;\n\n#endif\n", 
THREE.ShaderChunk.uv_vertex = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP )\n\n	vUv = uv * offsetRepeat.zw + offsetRepeat.xy;\n\n#endif", 
THREE.ShaderChunk.worldpos_vertex = "#if defined( USE_ENVMAP ) || defined( PHONG ) || defined( LAMBERT ) || defined ( USE_SHADOWMAP )\n\n	#ifdef USE_SKINNING\n\n		vec4 worldPosition = modelMatrix * skinned;\n\n	#else\n\n		vec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );\n\n	#endif\n\n#endif\n", 
THREE.UniformsUtils = {
    merge: function(uniforms) {
        for (var merged = {}, u = 0; u < uniforms.length; u++) {
            var tmp = this.clone(uniforms[u]);
            for (var p in tmp) merged[p] = tmp[p];
        }
        return merged;
    },
    clone: function(uniforms_src) {
        var uniforms_dst = {};
        for (var u in uniforms_src) {
            uniforms_dst[u] = {};
            for (var p in uniforms_src[u]) {
                var parameter_src = uniforms_src[u][p];
                parameter_src instanceof THREE.Color || parameter_src instanceof THREE.Vector2 || parameter_src instanceof THREE.Vector3 || parameter_src instanceof THREE.Vector4 || parameter_src instanceof THREE.Matrix3 || parameter_src instanceof THREE.Matrix4 || parameter_src instanceof THREE.Texture ? uniforms_dst[u][p] = parameter_src.clone() : Array.isArray(parameter_src) ? uniforms_dst[u][p] = parameter_src.slice() : uniforms_dst[u][p] = parameter_src;
            }
        }
        return uniforms_dst;
    }
}, THREE.UniformsLib = {
    common: {
        diffuse: {
            type: "c",
            value: new THREE.Color(15658734)
        },
        opacity: {
            type: "f",
            value: 1
        },
        map: {
            type: "t",
            value: null
        },
        offsetRepeat: {
            type: "v4",
            value: new THREE.Vector4(0, 0, 1, 1)
        },
        specularMap: {
            type: "t",
            value: null
        },
        alphaMap: {
            type: "t",
            value: null
        },
        envMap: {
            type: "t",
            value: null
        },
        flipEnvMap: {
            type: "f",
            value: -1
        },
        reflectivity: {
            type: "f",
            value: 1
        },
        refractionRatio: {
            type: "f",
            value: .98
        }
    },
    aomap: {
        aoMap: {
            type: "t",
            value: null
        },
        aoMapIntensity: {
            type: "f",
            value: 1
        }
    },
    lightmap: {
        lightMap: {
            type: "t",
            value: null
        },
        lightMapIntensity: {
            type: "f",
            value: 1
        }
    },
    emissivemap: {
        emissiveMap: {
            type: "t",
            value: null
        }
    },
    bumpmap: {
        bumpMap: {
            type: "t",
            value: null
        },
        bumpScale: {
            type: "f",
            value: 1
        }
    },
    normalmap: {
        normalMap: {
            type: "t",
            value: null
        },
        normalScale: {
            type: "v2",
            value: new THREE.Vector2(1, 1)
        }
    },
    displacementmap: {
        displacementMap: {
            type: "t",
            value: null
        },
        displacementScale: {
            type: "f",
            value: 1
        },
        displacementBias: {
            type: "f",
            value: 0
        }
    },
    fog: {
        fogDensity: {
            type: "f",
            value: 25e-5
        },
        fogNear: {
            type: "f",
            value: 1
        },
        fogFar: {
            type: "f",
            value: 2e3
        },
        fogColor: {
            type: "c",
            value: new THREE.Color(16777215)
        }
    },
    lights: {
        ambientLightColor: {
            type: "fv",
            value: []
        },
        directionalLightDirection: {
            type: "fv",
            value: []
        },
        directionalLightColor: {
            type: "fv",
            value: []
        },
        hemisphereLightDirection: {
            type: "fv",
            value: []
        },
        hemisphereLightSkyColor: {
            type: "fv",
            value: []
        },
        hemisphereLightGroundColor: {
            type: "fv",
            value: []
        },
        pointLightColor: {
            type: "fv",
            value: []
        },
        pointLightPosition: {
            type: "fv",
            value: []
        },
        pointLightDistance: {
            type: "fv1",
            value: []
        },
        pointLightDecay: {
            type: "fv1",
            value: []
        },
        spotLightColor: {
            type: "fv",
            value: []
        },
        spotLightPosition: {
            type: "fv",
            value: []
        },
        spotLightDirection: {
            type: "fv",
            value: []
        },
        spotLightDistance: {
            type: "fv1",
            value: []
        },
        spotLightAngleCos: {
            type: "fv1",
            value: []
        },
        spotLightExponent: {
            type: "fv1",
            value: []
        },
        spotLightDecay: {
            type: "fv1",
            value: []
        }
    },
    points: {
        psColor: {
            type: "c",
            value: new THREE.Color(15658734)
        },
        opacity: {
            type: "f",
            value: 1
        },
        size: {
            type: "f",
            value: 1
        },
        scale: {
            type: "f",
            value: 1
        },
        map: {
            type: "t",
            value: null
        },
        offsetRepeat: {
            type: "v4",
            value: new THREE.Vector4(0, 0, 1, 1)
        },
        fogDensity: {
            type: "f",
            value: 25e-5
        },
        fogNear: {
            type: "f",
            value: 1
        },
        fogFar: {
            type: "f",
            value: 2e3
        },
        fogColor: {
            type: "c",
            value: new THREE.Color(16777215)
        }
    },
    shadowmap: {
        shadowMap: {
            type: "tv",
            value: []
        },
        shadowMapSize: {
            type: "v2v",
            value: []
        },
        shadowBias: {
            type: "fv1",
            value: []
        },
        shadowDarkness: {
            type: "fv1",
            value: []
        },
        shadowMatrix: {
            type: "m4v",
            value: []
        }
    }
}, THREE.ShaderLib = {
    basic: {
        uniforms: THREE.UniformsUtils.merge([ THREE.UniformsLib.common, THREE.UniformsLib.aomap, THREE.UniformsLib.fog, THREE.UniformsLib.shadowmap ]),
        vertexShader: [ THREE.ShaderChunk.common, THREE.ShaderChunk.uv_pars_vertex, THREE.ShaderChunk.uv2_pars_vertex, THREE.ShaderChunk.envmap_pars_vertex, THREE.ShaderChunk.color_pars_vertex, THREE.ShaderChunk.morphtarget_pars_vertex, THREE.ShaderChunk.skinning_pars_vertex, THREE.ShaderChunk.shadowmap_pars_vertex, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", THREE.ShaderChunk.uv_vertex, THREE.ShaderChunk.uv2_vertex, THREE.ShaderChunk.color_vertex, THREE.ShaderChunk.skinbase_vertex, "	#ifdef USE_ENVMAP", THREE.ShaderChunk.beginnormal_vertex, THREE.ShaderChunk.morphnormal_vertex, THREE.ShaderChunk.skinnormal_vertex, THREE.ShaderChunk.defaultnormal_vertex, "	#endif", THREE.ShaderChunk.begin_vertex, THREE.ShaderChunk.morphtarget_vertex, THREE.ShaderChunk.skinning_vertex, THREE.ShaderChunk.project_vertex, THREE.ShaderChunk.logdepthbuf_vertex, THREE.ShaderChunk.worldpos_vertex, THREE.ShaderChunk.envmap_vertex, THREE.ShaderChunk.shadowmap_vertex, "}" ].join("\n"),
        fragmentShader: [ "uniform vec3 diffuse;", "uniform float opacity;", THREE.ShaderChunk.common, THREE.ShaderChunk.color_pars_fragment, THREE.ShaderChunk.uv_pars_fragment, THREE.ShaderChunk.uv2_pars_fragment, THREE.ShaderChunk.map_pars_fragment, THREE.ShaderChunk.alphamap_pars_fragment, THREE.ShaderChunk.aomap_pars_fragment, THREE.ShaderChunk.envmap_pars_fragment, THREE.ShaderChunk.fog_pars_fragment, THREE.ShaderChunk.shadowmap_pars_fragment, THREE.ShaderChunk.specularmap_pars_fragment, THREE.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	vec3 outgoingLight = vec3( 0.0 );", "	vec4 diffuseColor = vec4( diffuse, opacity );", "	vec3 totalAmbientLight = vec3( 1.0 );", "	vec3 shadowMask = vec3( 1.0 );", THREE.ShaderChunk.logdepthbuf_fragment, THREE.ShaderChunk.map_fragment, THREE.ShaderChunk.color_fragment, THREE.ShaderChunk.alphamap_fragment, THREE.ShaderChunk.alphatest_fragment, THREE.ShaderChunk.specularmap_fragment, THREE.ShaderChunk.aomap_fragment, THREE.ShaderChunk.shadowmap_fragment, "	outgoingLight = diffuseColor.rgb * totalAmbientLight * shadowMask;", THREE.ShaderChunk.envmap_fragment, THREE.ShaderChunk.linear_to_gamma_fragment, THREE.ShaderChunk.fog_fragment, "	gl_FragColor = vec4( outgoingLight, diffuseColor.a );", "}" ].join("\n")
    },
    lambert: {
        uniforms: THREE.UniformsUtils.merge([ THREE.UniformsLib.common, THREE.UniformsLib.fog, THREE.UniformsLib.lights, THREE.UniformsLib.shadowmap, {
            emissive: {
                type: "c",
                value: new THREE.Color(0)
            }
        } ]),
        vertexShader: [ "#define LAMBERT", "varying vec3 vLightFront;", "#ifdef DOUBLE_SIDED", "	varying vec3 vLightBack;", "#endif", THREE.ShaderChunk.common, THREE.ShaderChunk.uv_pars_vertex, THREE.ShaderChunk.uv2_pars_vertex, THREE.ShaderChunk.envmap_pars_vertex, THREE.ShaderChunk.lights_lambert_pars_vertex, THREE.ShaderChunk.color_pars_vertex, THREE.ShaderChunk.morphtarget_pars_vertex, THREE.ShaderChunk.skinning_pars_vertex, THREE.ShaderChunk.shadowmap_pars_vertex, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", THREE.ShaderChunk.uv_vertex, THREE.ShaderChunk.uv2_vertex, THREE.ShaderChunk.color_vertex, THREE.ShaderChunk.beginnormal_vertex, THREE.ShaderChunk.morphnormal_vertex, THREE.ShaderChunk.skinbase_vertex, THREE.ShaderChunk.skinnormal_vertex, THREE.ShaderChunk.defaultnormal_vertex, THREE.ShaderChunk.begin_vertex, THREE.ShaderChunk.morphtarget_vertex, THREE.ShaderChunk.skinning_vertex, THREE.ShaderChunk.project_vertex, THREE.ShaderChunk.logdepthbuf_vertex, THREE.ShaderChunk.worldpos_vertex, THREE.ShaderChunk.envmap_vertex, THREE.ShaderChunk.lights_lambert_vertex, THREE.ShaderChunk.shadowmap_vertex, "}" ].join("\n"),
        fragmentShader: [ "uniform vec3 diffuse;", "uniform vec3 emissive;", "uniform float opacity;", "uniform vec3 ambientLightColor;", "varying vec3 vLightFront;", "#ifdef DOUBLE_SIDED", "	varying vec3 vLightBack;", "#endif", THREE.ShaderChunk.common, THREE.ShaderChunk.color_pars_fragment, THREE.ShaderChunk.uv_pars_fragment, THREE.ShaderChunk.uv2_pars_fragment, THREE.ShaderChunk.map_pars_fragment, THREE.ShaderChunk.alphamap_pars_fragment, THREE.ShaderChunk.envmap_pars_fragment, THREE.ShaderChunk.fog_pars_fragment, THREE.ShaderChunk.shadowmap_pars_fragment, THREE.ShaderChunk.specularmap_pars_fragment, THREE.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	vec3 outgoingLight = vec3( 0.0 );", "	vec4 diffuseColor = vec4( diffuse, opacity );", "	vec3 totalAmbientLight = ambientLightColor;", "	vec3 shadowMask = vec3( 1.0 );", THREE.ShaderChunk.logdepthbuf_fragment, THREE.ShaderChunk.map_fragment, THREE.ShaderChunk.color_fragment, THREE.ShaderChunk.alphamap_fragment, THREE.ShaderChunk.alphatest_fragment, THREE.ShaderChunk.specularmap_fragment, THREE.ShaderChunk.shadowmap_fragment, "	#ifdef DOUBLE_SIDED", "		if ( gl_FrontFacing )", "			outgoingLight += diffuseColor.rgb * ( vLightFront * shadowMask + totalAmbientLight ) + emissive;", "		else", "			outgoingLight += diffuseColor.rgb * ( vLightBack * shadowMask + totalAmbientLight ) + emissive;", "	#else", "		outgoingLight += diffuseColor.rgb * ( vLightFront * shadowMask + totalAmbientLight ) + emissive;", "	#endif", THREE.ShaderChunk.envmap_fragment, THREE.ShaderChunk.linear_to_gamma_fragment, THREE.ShaderChunk.fog_fragment, "	gl_FragColor = vec4( outgoingLight, diffuseColor.a );", "}" ].join("\n")
    },
    phong: {
        uniforms: THREE.UniformsUtils.merge([ THREE.UniformsLib.common, THREE.UniformsLib.aomap, THREE.UniformsLib.lightmap, THREE.UniformsLib.emissivemap, THREE.UniformsLib.bumpmap, THREE.UniformsLib.normalmap, THREE.UniformsLib.displacementmap, THREE.UniformsLib.fog, THREE.UniformsLib.lights, THREE.UniformsLib.shadowmap, {
            emissive: {
                type: "c",
                value: new THREE.Color(0)
            },
            specular: {
                type: "c",
                value: new THREE.Color(1118481)
            },
            shininess: {
                type: "f",
                value: 30
            }
        } ]),
        vertexShader: [ "#define PHONG", "varying vec3 vViewPosition;", "#ifndef FLAT_SHADED", "	varying vec3 vNormal;", "#endif", THREE.ShaderChunk.common, THREE.ShaderChunk.uv_pars_vertex, THREE.ShaderChunk.uv2_pars_vertex, THREE.ShaderChunk.displacementmap_pars_vertex, THREE.ShaderChunk.envmap_pars_vertex, THREE.ShaderChunk.lights_phong_pars_vertex, THREE.ShaderChunk.color_pars_vertex, THREE.ShaderChunk.morphtarget_pars_vertex, THREE.ShaderChunk.skinning_pars_vertex, THREE.ShaderChunk.shadowmap_pars_vertex, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", THREE.ShaderChunk.uv_vertex, THREE.ShaderChunk.uv2_vertex, THREE.ShaderChunk.color_vertex, THREE.ShaderChunk.beginnormal_vertex, THREE.ShaderChunk.morphnormal_vertex, THREE.ShaderChunk.skinbase_vertex, THREE.ShaderChunk.skinnormal_vertex, THREE.ShaderChunk.defaultnormal_vertex, "#ifndef FLAT_SHADED", "	vNormal = normalize( transformedNormal );", "#endif", THREE.ShaderChunk.begin_vertex, THREE.ShaderChunk.displacementmap_vertex, THREE.ShaderChunk.morphtarget_vertex, THREE.ShaderChunk.skinning_vertex, THREE.ShaderChunk.project_vertex, THREE.ShaderChunk.logdepthbuf_vertex, "	vViewPosition = - mvPosition.xyz;", THREE.ShaderChunk.worldpos_vertex, THREE.ShaderChunk.envmap_vertex, THREE.ShaderChunk.lights_phong_vertex, THREE.ShaderChunk.shadowmap_vertex, "}" ].join("\n"),
        fragmentShader: [ "#define PHONG", "uniform vec3 diffuse;", "uniform vec3 emissive;", "uniform vec3 specular;", "uniform float shininess;", "uniform float opacity;", THREE.ShaderChunk.common, THREE.ShaderChunk.color_pars_fragment, THREE.ShaderChunk.uv_pars_fragment, THREE.ShaderChunk.uv2_pars_fragment, THREE.ShaderChunk.map_pars_fragment, THREE.ShaderChunk.alphamap_pars_fragment, THREE.ShaderChunk.aomap_pars_fragment, THREE.ShaderChunk.lightmap_pars_fragment, THREE.ShaderChunk.emissivemap_pars_fragment, THREE.ShaderChunk.envmap_pars_fragment, THREE.ShaderChunk.fog_pars_fragment, THREE.ShaderChunk.lights_phong_pars_fragment, THREE.ShaderChunk.shadowmap_pars_fragment, THREE.ShaderChunk.bumpmap_pars_fragment, THREE.ShaderChunk.normalmap_pars_fragment, THREE.ShaderChunk.specularmap_pars_fragment, THREE.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	vec3 outgoingLight = vec3( 0.0 );", "	vec4 diffuseColor = vec4( diffuse, opacity );", "	vec3 totalAmbientLight = ambientLightColor;", "	vec3 totalEmissiveLight = emissive;", "	vec3 shadowMask = vec3( 1.0 );", THREE.ShaderChunk.logdepthbuf_fragment, THREE.ShaderChunk.map_fragment, THREE.ShaderChunk.color_fragment, THREE.ShaderChunk.alphamap_fragment, THREE.ShaderChunk.alphatest_fragment, THREE.ShaderChunk.specularmap_fragment, THREE.ShaderChunk.normal_phong_fragment, THREE.ShaderChunk.lightmap_fragment, THREE.ShaderChunk.hemilight_fragment, THREE.ShaderChunk.aomap_fragment, THREE.ShaderChunk.emissivemap_fragment, THREE.ShaderChunk.lights_phong_fragment, THREE.ShaderChunk.shadowmap_fragment, "totalDiffuseLight *= shadowMask;", "totalSpecularLight *= shadowMask;", "#ifdef METAL", "	outgoingLight += diffuseColor.rgb * ( totalDiffuseLight + totalAmbientLight ) * specular + totalSpecularLight + totalEmissiveLight;", "#else", "	outgoingLight += diffuseColor.rgb * ( totalDiffuseLight + totalAmbientLight ) + totalSpecularLight + totalEmissiveLight;", "#endif", THREE.ShaderChunk.envmap_fragment, THREE.ShaderChunk.linear_to_gamma_fragment, THREE.ShaderChunk.fog_fragment, "	gl_FragColor = vec4( outgoingLight, diffuseColor.a );", "}" ].join("\n")
    },
    points: {
        uniforms: THREE.UniformsUtils.merge([ THREE.UniformsLib.points, THREE.UniformsLib.shadowmap ]),
        vertexShader: [ "uniform float size;", "uniform float scale;", THREE.ShaderChunk.common, THREE.ShaderChunk.color_pars_vertex, THREE.ShaderChunk.shadowmap_pars_vertex, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", THREE.ShaderChunk.color_vertex, "	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );", "	#ifdef USE_SIZEATTENUATION", "		gl_PointSize = size * ( scale / length( mvPosition.xyz ) );", "	#else", "		gl_PointSize = size;", "	#endif", "	gl_Position = projectionMatrix * mvPosition;", THREE.ShaderChunk.logdepthbuf_vertex, THREE.ShaderChunk.worldpos_vertex, THREE.ShaderChunk.shadowmap_vertex, "}" ].join("\n"),
        fragmentShader: [ "uniform vec3 psColor;", "uniform float opacity;", THREE.ShaderChunk.common, THREE.ShaderChunk.color_pars_fragment, THREE.ShaderChunk.map_particle_pars_fragment, THREE.ShaderChunk.fog_pars_fragment, THREE.ShaderChunk.shadowmap_pars_fragment, THREE.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	vec3 outgoingLight = vec3( 0.0 );", "	vec4 diffuseColor = vec4( psColor, opacity );", "	vec3 shadowMask = vec3( 1.0 );", THREE.ShaderChunk.logdepthbuf_fragment, THREE.ShaderChunk.map_particle_fragment, THREE.ShaderChunk.color_fragment, THREE.ShaderChunk.alphatest_fragment, THREE.ShaderChunk.shadowmap_fragment, "	outgoingLight = diffuseColor.rgb * shadowMask;", THREE.ShaderChunk.fog_fragment, "	gl_FragColor = vec4( outgoingLight, diffuseColor.a );", "}" ].join("\n")
    },
    dashed: {
        uniforms: THREE.UniformsUtils.merge([ THREE.UniformsLib.common, THREE.UniformsLib.fog, {
            scale: {
                type: "f",
                value: 1
            },
            dashSize: {
                type: "f",
                value: 1
            },
            totalSize: {
                type: "f",
                value: 2
            }
        } ]),
        vertexShader: [ "uniform float scale;", "attribute float lineDistance;", "varying float vLineDistance;", THREE.ShaderChunk.common, THREE.ShaderChunk.color_pars_vertex, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", THREE.ShaderChunk.color_vertex, "	vLineDistance = scale * lineDistance;", "	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );", "	gl_Position = projectionMatrix * mvPosition;", THREE.ShaderChunk.logdepthbuf_vertex, "}" ].join("\n"),
        fragmentShader: [ "uniform vec3 diffuse;", "uniform float opacity;", "uniform float dashSize;", "uniform float totalSize;", "varying float vLineDistance;", THREE.ShaderChunk.common, THREE.ShaderChunk.color_pars_fragment, THREE.ShaderChunk.fog_pars_fragment, THREE.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	if ( mod( vLineDistance, totalSize ) > dashSize ) {", "		discard;", "	}", "	vec3 outgoingLight = vec3( 0.0 );", "	vec4 diffuseColor = vec4( diffuse, opacity );", THREE.ShaderChunk.logdepthbuf_fragment, THREE.ShaderChunk.color_fragment, "	outgoingLight = diffuseColor.rgb;", THREE.ShaderChunk.fog_fragment, "	gl_FragColor = vec4( outgoingLight, diffuseColor.a );", "}" ].join("\n")
    },
    depth: {
        uniforms: {
            mNear: {
                type: "f",
                value: 1
            },
            mFar: {
                type: "f",
                value: 2e3
            },
            opacity: {
                type: "f",
                value: 1
            }
        },
        vertexShader: [ THREE.ShaderChunk.common, THREE.ShaderChunk.morphtarget_pars_vertex, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", THREE.ShaderChunk.begin_vertex, THREE.ShaderChunk.morphtarget_vertex, THREE.ShaderChunk.project_vertex, THREE.ShaderChunk.logdepthbuf_vertex, "}" ].join("\n"),
        fragmentShader: [ "uniform float mNear;", "uniform float mFar;", "uniform float opacity;", THREE.ShaderChunk.common, THREE.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", THREE.ShaderChunk.logdepthbuf_fragment, "	#ifdef USE_LOGDEPTHBUF_EXT", "		float depth = gl_FragDepthEXT / gl_FragCoord.w;", "	#else", "		float depth = gl_FragCoord.z / gl_FragCoord.w;", "	#endif", "	float color = 1.0 - smoothstep( mNear, mFar, depth );", "	gl_FragColor = vec4( vec3( color ), opacity );", "}" ].join("\n")
    },
    normal: {
        uniforms: {
            opacity: {
                type: "f",
                value: 1
            }
        },
        vertexShader: [ "varying vec3 vNormal;", THREE.ShaderChunk.common, THREE.ShaderChunk.morphtarget_pars_vertex, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", "	vNormal = normalize( normalMatrix * normal );", THREE.ShaderChunk.begin_vertex, THREE.ShaderChunk.morphtarget_vertex, THREE.ShaderChunk.project_vertex, THREE.ShaderChunk.logdepthbuf_vertex, "}" ].join("\n"),
        fragmentShader: [ "uniform float opacity;", "varying vec3 vNormal;", THREE.ShaderChunk.common, THREE.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	gl_FragColor = vec4( 0.5 * normalize( vNormal ) + 0.5, opacity );", THREE.ShaderChunk.logdepthbuf_fragment, "}" ].join("\n")
    },
    cube: {
        uniforms: {
            tCube: {
                type: "t",
                value: null
            },
            tFlip: {
                type: "f",
                value: -1
            }
        },
        vertexShader: [ "varying vec3 vWorldPosition;", THREE.ShaderChunk.common, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", "	vWorldPosition = transformDirection( position, modelMatrix );", "	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", THREE.ShaderChunk.logdepthbuf_vertex, "}" ].join("\n"),
        fragmentShader: [ "uniform samplerCube tCube;", "uniform float tFlip;", "varying vec3 vWorldPosition;", THREE.ShaderChunk.common, THREE.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	gl_FragColor = textureCube( tCube, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) );", THREE.ShaderChunk.logdepthbuf_fragment, "}" ].join("\n")
    },
    equirect: {
        uniforms: {
            tEquirect: {
                type: "t",
                value: null
            },
            tFlip: {
                type: "f",
                value: -1
            }
        },
        vertexShader: [ "varying vec3 vWorldPosition;", THREE.ShaderChunk.common, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", "	vWorldPosition = transformDirection( position, modelMatrix );", "	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", THREE.ShaderChunk.logdepthbuf_vertex, "}" ].join("\n"),
        fragmentShader: [ "uniform sampler2D tEquirect;", "uniform float tFlip;", "varying vec3 vWorldPosition;", THREE.ShaderChunk.common, THREE.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "vec3 direction = normalize( vWorldPosition );", "vec2 sampleUV;", "sampleUV.y = saturate( tFlip * direction.y * -0.5 + 0.5 );", "sampleUV.x = atan( direction.z, direction.x ) * RECIPROCAL_PI2 + 0.5;", "gl_FragColor = texture2D( tEquirect, sampleUV );", THREE.ShaderChunk.logdepthbuf_fragment, "}" ].join("\n")
    },
    depthRGBA: {
        uniforms: {},
        vertexShader: [ THREE.ShaderChunk.common, THREE.ShaderChunk.morphtarget_pars_vertex, THREE.ShaderChunk.skinning_pars_vertex, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", THREE.ShaderChunk.skinbase_vertex, THREE.ShaderChunk.begin_vertex, THREE.ShaderChunk.morphtarget_vertex, THREE.ShaderChunk.skinning_vertex, THREE.ShaderChunk.project_vertex, THREE.ShaderChunk.logdepthbuf_vertex, "}" ].join("\n"),
        fragmentShader: [ THREE.ShaderChunk.common, THREE.ShaderChunk.logdepthbuf_pars_fragment, "vec4 pack_depth( const in float depth ) {", "	const vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );", "	const vec4 bit_mask = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );", "	vec4 res = mod( depth * bit_shift * vec4( 255 ), vec4( 256 ) ) / vec4( 255 );", "	res -= res.xxyz * bit_mask;", "	return res;", "}", "void main() {", THREE.ShaderChunk.logdepthbuf_fragment, "	#ifdef USE_LOGDEPTHBUF_EXT", "		gl_FragData[ 0 ] = pack_depth( gl_FragDepthEXT );", "	#else", "		gl_FragData[ 0 ] = pack_depth( gl_FragCoord.z );", "	#endif", "}" ].join("\n")
    },
    distanceRGBA: {
        uniforms: {
            lightPos: {
                type: "v3",
                value: new THREE.Vector3(0, 0, 0)
            }
        },
        vertexShader: [ "varying vec4 vWorldPosition;", THREE.ShaderChunk.common, THREE.ShaderChunk.morphtarget_pars_vertex, THREE.ShaderChunk.skinning_pars_vertex, "void main() {", THREE.ShaderChunk.skinbase_vertex, THREE.ShaderChunk.begin_vertex, THREE.ShaderChunk.morphtarget_vertex, THREE.ShaderChunk.skinning_vertex, THREE.ShaderChunk.project_vertex, THREE.ShaderChunk.worldpos_vertex, "vWorldPosition = worldPosition;", "}" ].join("\n"),
        fragmentShader: [ "uniform vec3 lightPos;", "varying vec4 vWorldPosition;", THREE.ShaderChunk.common, "vec4 pack1K ( float depth ) {", "   depth /= 1000.0;", "   const vec4 bitSh = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );", "	const vec4 bitMsk = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );", "	vec4 res = fract( depth * bitSh );", "	res -= res.xxyz * bitMsk;", "	return res; ", "}", "float unpack1K ( vec4 color ) {", "	const vec4 bitSh = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );", "	return dot( color, bitSh ) * 1000.0;", "}", "void main () {", "	gl_FragColor = pack1K( length( vWorldPosition.xyz - lightPos.xyz ) );", "}" ].join("\n")
    }
}, THREE.WebGLRenderer = function(parameters) {
    function glClearColor(r, g, b, a) {
        _premultipliedAlpha === !0 && (r *= a, g *= a, b *= a), _gl.clearColor(r, g, b, a);
    }
    function setDefaultGLState() {
        state.init(), _gl.viewport(_viewportX, _viewportY, _viewportWidth, _viewportHeight), 
        glClearColor(_clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha);
    }
    function resetGLState() {
        _currentProgram = null, _currentCamera = null, _currentGeometryProgram = "", _currentMaterialId = -1, 
        _lightsNeedUpdate = !0, state.reset();
    }
    function onContextLost(event) {
        event.preventDefault(), resetGLState(), setDefaultGLState(), properties.clear();
    }
    function onTextureDispose(event) {
        var texture = event.target;
        texture.removeEventListener("dispose", onTextureDispose), deallocateTexture(texture), 
        _infoMemory.textures--;
    }
    function onRenderTargetDispose(event) {
        var renderTarget = event.target;
        renderTarget.removeEventListener("dispose", onRenderTargetDispose), deallocateRenderTarget(renderTarget), 
        _infoMemory.textures--;
    }
    function onMaterialDispose(event) {
        var material = event.target;
        material.removeEventListener("dispose", onMaterialDispose), deallocateMaterial(material);
    }
    function deallocateTexture(texture) {
        var textureProperties = properties.get(texture);
        if (texture.image && textureProperties.__image__webglTextureCube) _gl.deleteTexture(textureProperties.__image__webglTextureCube); else {
            if (void 0 === textureProperties.__webglInit) return;
            _gl.deleteTexture(textureProperties.__webglTexture);
        }
        properties["delete"](texture);
    }
    function deallocateRenderTarget(renderTarget) {
        var renderTargetProperties = properties.get(renderTarget), textureProperties = properties.get(renderTarget.texture);
        if (renderTarget && void 0 !== textureProperties.__webglTexture) {
            if (_gl.deleteTexture(textureProperties.__webglTexture), renderTarget instanceof THREE.WebGLRenderTargetCube) for (var i = 0; 6 > i; i++) _gl.deleteFramebuffer(renderTargetProperties.__webglFramebuffer[i]), 
            _gl.deleteRenderbuffer(renderTargetProperties.__webglRenderbuffer[i]); else _gl.deleteFramebuffer(renderTargetProperties.__webglFramebuffer), 
            _gl.deleteRenderbuffer(renderTargetProperties.__webglRenderbuffer);
            properties["delete"](renderTarget.texture), properties["delete"](renderTarget);
        }
    }
    function deallocateMaterial(material) {
        releaseMaterialProgramReference(material), properties["delete"](material);
    }
    function releaseMaterialProgramReference(material) {
        var programInfo = properties.get(material).program;
        material.program = void 0, void 0 !== programInfo && programCache.releaseProgram(programInfo);
    }
    function setupVertexAttributes(material, program, geometry, startIndex) {
        var extension;
        if (geometry instanceof THREE.InstancedBufferGeometry && (extension = extensions.get("ANGLE_instanced_arrays"), 
        null === extension)) return void console.error("THREE.WebGLRenderer.setupVertexAttributes: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");
        void 0 === startIndex && (startIndex = 0), state.initAttributes();
        var geometryAttributes = geometry.attributes, programAttributes = program.getAttributes(), materialDefaultAttributeValues = material.defaultAttributeValues;
        for (var name in programAttributes) {
            var programAttribute = programAttributes[name];
            if (programAttribute >= 0) {
                var geometryAttribute = geometryAttributes[name];
                if (void 0 !== geometryAttribute) {
                    var size = geometryAttribute.itemSize, buffer = objects.getAttributeBuffer(geometryAttribute);
                    if (geometryAttribute instanceof THREE.InterleavedBufferAttribute) {
                        var data = geometryAttribute.data, stride = data.stride, offset = geometryAttribute.offset;
                        data instanceof THREE.InstancedInterleavedBuffer ? (state.enableAttributeAndDivisor(programAttribute, data.meshPerAttribute, extension), 
                        void 0 === geometry.maxInstancedCount && (geometry.maxInstancedCount = data.meshPerAttribute * data.count)) : state.enableAttribute(programAttribute), 
                        _gl.bindBuffer(_gl.ARRAY_BUFFER, buffer), _gl.vertexAttribPointer(programAttribute, size, _gl.FLOAT, !1, stride * data.array.BYTES_PER_ELEMENT, (startIndex * stride + offset) * data.array.BYTES_PER_ELEMENT);
                    } else geometryAttribute instanceof THREE.InstancedBufferAttribute ? (state.enableAttributeAndDivisor(programAttribute, geometryAttribute.meshPerAttribute, extension), 
                    void 0 === geometry.maxInstancedCount && (geometry.maxInstancedCount = geometryAttribute.meshPerAttribute * geometryAttribute.count)) : state.enableAttribute(programAttribute), 
                    _gl.bindBuffer(_gl.ARRAY_BUFFER, buffer), _gl.vertexAttribPointer(programAttribute, size, _gl.FLOAT, !1, 0, startIndex * size * 4);
                } else if (void 0 !== materialDefaultAttributeValues) {
                    var value = materialDefaultAttributeValues[name];
                    if (void 0 !== value) switch (value.length) {
                      case 2:
                        _gl.vertexAttrib2fv(programAttribute, value);
                        break;

                      case 3:
                        _gl.vertexAttrib3fv(programAttribute, value);
                        break;

                      case 4:
                        _gl.vertexAttrib4fv(programAttribute, value);
                        break;

                      default:
                        _gl.vertexAttrib1fv(programAttribute, value);
                    }
                }
            }
        }
        state.disableUnusedAttributes();
    }
    function numericalSort(a, b) {
        return b[0] - a[0];
    }
    function painterSortStable(a, b) {
        return a.object.renderOrder !== b.object.renderOrder ? a.object.renderOrder - b.object.renderOrder : a.material.id !== b.material.id ? a.material.id - b.material.id : a.z !== b.z ? a.z - b.z : a.id - b.id;
    }
    function reversePainterSortStable(a, b) {
        return a.object.renderOrder !== b.object.renderOrder ? a.object.renderOrder - b.object.renderOrder : a.z !== b.z ? b.z - a.z : a.id - b.id;
    }
    function pushRenderItem(object, geometry, material, z, group) {
        var array, index;
        material.transparent ? (array = transparentObjects, index = ++transparentObjectsLastIndex) : (array = opaqueObjects, 
        index = ++opaqueObjectsLastIndex);
        var renderItem = array[index];
        void 0 !== renderItem ? (renderItem.id = object.id, renderItem.object = object, 
        renderItem.geometry = geometry, renderItem.material = material, renderItem.z = _vector3.z, 
        renderItem.group = group) : (renderItem = {
            id: object.id,
            object: object,
            geometry: geometry,
            material: material,
            z: _vector3.z,
            group: group
        }, array.push(renderItem));
    }
    function projectObject(object, camera) {
        if (object.visible !== !1) {
            if (0 !== (object.channels.mask & camera.channels.mask)) if (object instanceof THREE.Light) lights.push(object); else if (object instanceof THREE.Sprite) sprites.push(object); else if (object instanceof THREE.LensFlare) lensFlares.push(object); else if (object instanceof THREE.ImmediateRenderObject) _this.sortObjects === !0 && (_vector3.setFromMatrixPosition(object.matrixWorld), 
            _vector3.applyProjection(_projScreenMatrix)), pushRenderItem(object, null, object.material, _vector3.z, null); else if ((object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) && (object instanceof THREE.SkinnedMesh && object.skeleton.update(), 
            object.frustumCulled === !1 || _frustum.intersectsObject(object) === !0)) {
                var material = object.material;
                if (material.visible === !0) {
                    _this.sortObjects === !0 && (_vector3.setFromMatrixPosition(object.matrixWorld), 
                    _vector3.applyProjection(_projScreenMatrix));
                    var geometry = objects.update(object);
                    if (material instanceof THREE.MeshFaceMaterial) for (var groups = geometry.groups, materials = material.materials, i = 0, l = groups.length; l > i; i++) {
                        var group = groups[i], groupMaterial = materials[group.materialIndex];
                        groupMaterial.visible === !0 && pushRenderItem(object, geometry, groupMaterial, _vector3.z, group);
                    } else pushRenderItem(object, geometry, material, _vector3.z, null);
                }
            }
            for (var children = object.children, i = 0, l = children.length; l > i; i++) projectObject(children[i], camera);
        }
    }
    function renderObjects(renderList, camera, lights, fog, overrideMaterial) {
        for (var i = 0, l = renderList.length; l > i; i++) {
            var renderItem = renderList[i], object = renderItem.object, geometry = renderItem.geometry, material = void 0 === overrideMaterial ? renderItem.material : overrideMaterial, group = renderItem.group;
            if (object.modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, object.matrixWorld), 
            object.normalMatrix.getNormalMatrix(object.modelViewMatrix), object instanceof THREE.ImmediateRenderObject) {
                setMaterial(material);
                var program = setProgram(camera, lights, fog, material, object);
                _currentGeometryProgram = "", object.render(function(object) {
                    _this.renderBufferImmediate(object, program, material);
                });
            } else _this.renderBufferDirect(camera, lights, fog, geometry, material, object, group);
        }
    }
    function initMaterial(material, lights, fog, object) {
        var materialProperties = properties.get(material), parameters = programCache.getParameters(material, lights, fog, object), code = programCache.getProgramCode(material, parameters), program = materialProperties.program, programChange = !0;
        if (void 0 === program) material.addEventListener("dispose", onMaterialDispose); else if (program.code !== code) releaseMaterialProgramReference(material); else {
            if (void 0 !== parameters.shaderID) return;
            programChange = !1;
        }
        if (programChange) {
            if (parameters.shaderID) {
                var shader = THREE.ShaderLib[parameters.shaderID];
                materialProperties.__webglShader = {
                    name: material.type,
                    uniforms: THREE.UniformsUtils.clone(shader.uniforms),
                    vertexShader: shader.vertexShader,
                    fragmentShader: shader.fragmentShader
                };
            } else materialProperties.__webglShader = {
                name: material.type,
                uniforms: material.uniforms,
                vertexShader: material.vertexShader,
                fragmentShader: material.fragmentShader
            };
            material.__webglShader = materialProperties.__webglShader, program = programCache.acquireProgram(material, parameters, code), 
            materialProperties.program = program, material.program = program;
        }
        var attributes = program.getAttributes();
        if (material.morphTargets) {
            material.numSupportedMorphTargets = 0;
            for (var i = 0; i < _this.maxMorphTargets; i++) attributes["morphTarget" + i] >= 0 && material.numSupportedMorphTargets++;
        }
        if (material.morphNormals) for (material.numSupportedMorphNormals = 0, i = 0; i < _this.maxMorphNormals; i++) attributes["morphNormal" + i] >= 0 && material.numSupportedMorphNormals++;
        materialProperties.uniformsList = [];
        var uniformLocations = materialProperties.program.getUniforms();
        for (var u in materialProperties.__webglShader.uniforms) {
            var location = uniformLocations[u];
            location && materialProperties.uniformsList.push([ materialProperties.__webglShader.uniforms[u], location ]);
        }
    }
    function setMaterial(material) {
        setMaterialFaces(material), material.transparent === !0 ? state.setBlending(material.blending, material.blendEquation, material.blendSrc, material.blendDst, material.blendEquationAlpha, material.blendSrcAlpha, material.blendDstAlpha) : state.setBlending(THREE.NoBlending), 
        state.setDepthFunc(material.depthFunc), state.setDepthTest(material.depthTest), 
        state.setDepthWrite(material.depthWrite), state.setColorWrite(material.colorWrite), 
        state.setPolygonOffset(material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits);
    }
    function setMaterialFaces(material) {
        material.side !== THREE.DoubleSide ? state.enable(_gl.CULL_FACE) : state.disable(_gl.CULL_FACE), 
        state.setFlipSided(material.side === THREE.BackSide);
    }
    function setProgram(camera, lights, fog, material, object) {
        _usedTextureUnits = 0;
        var materialProperties = properties.get(material);
        (material.needsUpdate || !materialProperties.program) && (initMaterial(material, lights, fog, object), 
        material.needsUpdate = !1);
        var refreshProgram = !1, refreshMaterial = !1, refreshLights = !1, program = materialProperties.program, p_uniforms = program.getUniforms(), m_uniforms = materialProperties.__webglShader.uniforms;
        if (program.id !== _currentProgram && (_gl.useProgram(program.program), _currentProgram = program.id, 
        refreshProgram = !0, refreshMaterial = !0, refreshLights = !0), material.id !== _currentMaterialId && (-1 === _currentMaterialId && (refreshLights = !0), 
        _currentMaterialId = material.id, refreshMaterial = !0), (refreshProgram || camera !== _currentCamera) && (_gl.uniformMatrix4fv(p_uniforms.projectionMatrix, !1, camera.projectionMatrix.elements), 
        capabilities.logarithmicDepthBuffer && _gl.uniform1f(p_uniforms.logDepthBufFC, 2 / (Math.log(camera.far + 1) / Math.LN2)), 
        camera !== _currentCamera && (_currentCamera = camera), (material instanceof THREE.ShaderMaterial || material instanceof THREE.MeshPhongMaterial || material.envMap) && void 0 !== p_uniforms.cameraPosition && (_vector3.setFromMatrixPosition(camera.matrixWorld), 
        _gl.uniform3f(p_uniforms.cameraPosition, _vector3.x, _vector3.y, _vector3.z)), (material instanceof THREE.MeshPhongMaterial || material instanceof THREE.MeshLambertMaterial || material instanceof THREE.MeshBasicMaterial || material instanceof THREE.ShaderMaterial || material.skinning) && void 0 !== p_uniforms.viewMatrix && _gl.uniformMatrix4fv(p_uniforms.viewMatrix, !1, camera.matrixWorldInverse.elements)), 
        material.skinning) if (object.bindMatrix && void 0 !== p_uniforms.bindMatrix && _gl.uniformMatrix4fv(p_uniforms.bindMatrix, !1, object.bindMatrix.elements), 
        object.bindMatrixInverse && void 0 !== p_uniforms.bindMatrixInverse && _gl.uniformMatrix4fv(p_uniforms.bindMatrixInverse, !1, object.bindMatrixInverse.elements), 
        capabilities.floatVertexTextures && object.skeleton && object.skeleton.useVertexTexture) {
            if (void 0 !== p_uniforms.boneTexture) {
                var textureUnit = getTextureUnit();
                _gl.uniform1i(p_uniforms.boneTexture, textureUnit), _this.setTexture(object.skeleton.boneTexture, textureUnit);
            }
            void 0 !== p_uniforms.boneTextureWidth && _gl.uniform1i(p_uniforms.boneTextureWidth, object.skeleton.boneTextureWidth), 
            void 0 !== p_uniforms.boneTextureHeight && _gl.uniform1i(p_uniforms.boneTextureHeight, object.skeleton.boneTextureHeight);
        } else object.skeleton && object.skeleton.boneMatrices && void 0 !== p_uniforms.boneGlobalMatrices && _gl.uniformMatrix4fv(p_uniforms.boneGlobalMatrices, !1, object.skeleton.boneMatrices);
        return refreshMaterial && (fog && material.fog && refreshUniformsFog(m_uniforms, fog), 
        (material instanceof THREE.MeshPhongMaterial || material instanceof THREE.MeshLambertMaterial || material.lights) && (_lightsNeedUpdate && (refreshLights = !0, 
        setupLights(lights, camera), _lightsNeedUpdate = !1), refreshLights ? (refreshUniformsLights(m_uniforms, _lights), 
        markUniformsLightsNeedsUpdate(m_uniforms, !0)) : markUniformsLightsNeedsUpdate(m_uniforms, !1)), 
        (material instanceof THREE.MeshBasicMaterial || material instanceof THREE.MeshLambertMaterial || material instanceof THREE.MeshPhongMaterial) && refreshUniformsCommon(m_uniforms, material), 
        material instanceof THREE.LineBasicMaterial ? refreshUniformsLine(m_uniforms, material) : material instanceof THREE.LineDashedMaterial ? (refreshUniformsLine(m_uniforms, material), 
        refreshUniformsDash(m_uniforms, material)) : material instanceof THREE.PointsMaterial ? refreshUniformsParticle(m_uniforms, material) : material instanceof THREE.MeshPhongMaterial ? refreshUniformsPhong(m_uniforms, material) : material instanceof THREE.MeshDepthMaterial ? (m_uniforms.mNear.value = camera.near, 
        m_uniforms.mFar.value = camera.far, m_uniforms.opacity.value = material.opacity) : material instanceof THREE.MeshNormalMaterial && (m_uniforms.opacity.value = material.opacity), 
        object.receiveShadow && !material._shadowPass && refreshUniformsShadow(m_uniforms, lights, camera), 
        loadUniformsGeneric(materialProperties.uniformsList)), loadUniformsMatrices(p_uniforms, object), 
        void 0 !== p_uniforms.modelMatrix && _gl.uniformMatrix4fv(p_uniforms.modelMatrix, !1, object.matrixWorld.elements), 
        program;
    }
    function refreshUniformsCommon(uniforms, material) {
        uniforms.opacity.value = material.opacity, uniforms.diffuse.value = material.color, 
        material.emissive && (uniforms.emissive.value = material.emissive), uniforms.map.value = material.map, 
        uniforms.specularMap.value = material.specularMap, uniforms.alphaMap.value = material.alphaMap, 
        material.aoMap && (uniforms.aoMap.value = material.aoMap, uniforms.aoMapIntensity.value = material.aoMapIntensity);
        var uvScaleMap;
        if (material.map ? uvScaleMap = material.map : material.specularMap ? uvScaleMap = material.specularMap : material.displacementMap ? uvScaleMap = material.displacementMap : material.normalMap ? uvScaleMap = material.normalMap : material.bumpMap ? uvScaleMap = material.bumpMap : material.alphaMap ? uvScaleMap = material.alphaMap : material.emissiveMap && (uvScaleMap = material.emissiveMap), 
        void 0 !== uvScaleMap) {
            uvScaleMap instanceof THREE.WebGLRenderTarget && (uvScaleMap = uvScaleMap.texture);
            var offset = uvScaleMap.offset, repeat = uvScaleMap.repeat;
            uniforms.offsetRepeat.value.set(offset.x, offset.y, repeat.x, repeat.y);
        }
        uniforms.envMap.value = material.envMap, uniforms.flipEnvMap.value = material.envMap instanceof THREE.WebGLRenderTargetCube ? 1 : -1, 
        uniforms.reflectivity.value = material.reflectivity, uniforms.refractionRatio.value = material.refractionRatio;
    }
    function refreshUniformsLine(uniforms, material) {
        uniforms.diffuse.value = material.color, uniforms.opacity.value = material.opacity;
    }
    function refreshUniformsDash(uniforms, material) {
        uniforms.dashSize.value = material.dashSize, uniforms.totalSize.value = material.dashSize + material.gapSize, 
        uniforms.scale.value = material.scale;
    }
    function refreshUniformsParticle(uniforms, material) {
        if (uniforms.psColor.value = material.color, uniforms.opacity.value = material.opacity, 
        uniforms.size.value = material.size, uniforms.scale.value = _canvas.height / 2, 
        uniforms.map.value = material.map, null !== material.map) {
            var offset = material.map.offset, repeat = material.map.repeat;
            uniforms.offsetRepeat.value.set(offset.x, offset.y, repeat.x, repeat.y);
        }
    }
    function refreshUniformsFog(uniforms, fog) {
        uniforms.fogColor.value = fog.color, fog instanceof THREE.Fog ? (uniforms.fogNear.value = fog.near, 
        uniforms.fogFar.value = fog.far) : fog instanceof THREE.FogExp2 && (uniforms.fogDensity.value = fog.density);
    }
    function refreshUniformsPhong(uniforms, material) {
        uniforms.specular.value = material.specular, uniforms.shininess.value = Math.max(material.shininess, 1e-4), 
        material.lightMap && (uniforms.lightMap.value = material.lightMap, uniforms.lightMapIntensity.value = material.lightMapIntensity), 
        material.emissiveMap && (uniforms.emissiveMap.value = material.emissiveMap), material.bumpMap && (uniforms.bumpMap.value = material.bumpMap, 
        uniforms.bumpScale.value = material.bumpScale), material.normalMap && (uniforms.normalMap.value = material.normalMap, 
        uniforms.normalScale.value.copy(material.normalScale)), material.displacementMap && (uniforms.displacementMap.value = material.displacementMap, 
        uniforms.displacementScale.value = material.displacementScale, uniforms.displacementBias.value = material.displacementBias);
    }
    function refreshUniformsLights(uniforms, lights) {
        uniforms.ambientLightColor.value = lights.ambient, uniforms.directionalLightColor.value = lights.directional.colors, 
        uniforms.directionalLightDirection.value = lights.directional.positions, uniforms.pointLightColor.value = lights.point.colors, 
        uniforms.pointLightPosition.value = lights.point.positions, uniforms.pointLightDistance.value = lights.point.distances, 
        uniforms.pointLightDecay.value = lights.point.decays, uniforms.spotLightColor.value = lights.spot.colors, 
        uniforms.spotLightPosition.value = lights.spot.positions, uniforms.spotLightDistance.value = lights.spot.distances, 
        uniforms.spotLightDirection.value = lights.spot.directions, uniforms.spotLightAngleCos.value = lights.spot.anglesCos, 
        uniforms.spotLightExponent.value = lights.spot.exponents, uniforms.spotLightDecay.value = lights.spot.decays, 
        uniforms.hemisphereLightSkyColor.value = lights.hemi.skyColors, uniforms.hemisphereLightGroundColor.value = lights.hemi.groundColors, 
        uniforms.hemisphereLightDirection.value = lights.hemi.positions;
    }
    function markUniformsLightsNeedsUpdate(uniforms, value) {
        uniforms.ambientLightColor.needsUpdate = value, uniforms.directionalLightColor.needsUpdate = value, 
        uniforms.directionalLightDirection.needsUpdate = value, uniforms.pointLightColor.needsUpdate = value, 
        uniforms.pointLightPosition.needsUpdate = value, uniforms.pointLightDistance.needsUpdate = value, 
        uniforms.pointLightDecay.needsUpdate = value, uniforms.spotLightColor.needsUpdate = value, 
        uniforms.spotLightPosition.needsUpdate = value, uniforms.spotLightDistance.needsUpdate = value, 
        uniforms.spotLightDirection.needsUpdate = value, uniforms.spotLightAngleCos.needsUpdate = value, 
        uniforms.spotLightExponent.needsUpdate = value, uniforms.spotLightDecay.needsUpdate = value, 
        uniforms.hemisphereLightSkyColor.needsUpdate = value, uniforms.hemisphereLightGroundColor.needsUpdate = value, 
        uniforms.hemisphereLightDirection.needsUpdate = value;
    }
    function refreshUniformsShadow(uniforms, lights, camera) {
        if (uniforms.shadowMatrix) for (var j = 0, i = 0, il = lights.length; il > i; i++) {
            var light = lights[i];
            if (light.castShadow === !0 && (light instanceof THREE.PointLight || light instanceof THREE.SpotLight || light instanceof THREE.DirectionalLight)) {
                var shadow = light.shadow;
                light instanceof THREE.PointLight ? (_vector3.setFromMatrixPosition(light.matrixWorld).negate(), 
                shadow.matrix.identity().setPosition(_vector3), uniforms.shadowDarkness.value[j] = -shadow.darkness) : uniforms.shadowDarkness.value[j] = shadow.darkness, 
                uniforms.shadowMatrix.value[j] = shadow.matrix, uniforms.shadowMap.value[j] = shadow.map, 
                uniforms.shadowMapSize.value[j] = shadow.mapSize, uniforms.shadowBias.value[j] = shadow.bias, 
                j++;
            }
        }
    }
    function loadUniformsMatrices(uniforms, object) {
        _gl.uniformMatrix4fv(uniforms.modelViewMatrix, !1, object.modelViewMatrix.elements), 
        uniforms.normalMatrix && _gl.uniformMatrix3fv(uniforms.normalMatrix, !1, object.normalMatrix.elements);
    }
    function getTextureUnit() {
        var textureUnit = _usedTextureUnits;
        return textureUnit >= capabilities.maxTextures && console.warn("WebGLRenderer: trying to use " + textureUnit + " texture units while this GPU supports only " + capabilities.maxTextures), 
        _usedTextureUnits += 1, textureUnit;
    }
    function loadUniformsGeneric(uniforms) {
        for (var texture, textureUnit, j = 0, jl = uniforms.length; jl > j; j++) {
            var uniform = uniforms[j][0];
            if (uniform.needsUpdate !== !1) {
                var type = uniform.type, value = uniform.value, location = uniforms[j][1];
                switch (type) {
                  case "1i":
                    _gl.uniform1i(location, value);
                    break;

                  case "1f":
                    _gl.uniform1f(location, value);
                    break;

                  case "2f":
                    _gl.uniform2f(location, value[0], value[1]);
                    break;

                  case "3f":
                    _gl.uniform3f(location, value[0], value[1], value[2]);
                    break;

                  case "4f":
                    _gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                    break;

                  case "1iv":
                    _gl.uniform1iv(location, value);
                    break;

                  case "3iv":
                    _gl.uniform3iv(location, value);
                    break;

                  case "1fv":
                    _gl.uniform1fv(location, value);
                    break;

                  case "2fv":
                    _gl.uniform2fv(location, value);
                    break;

                  case "3fv":
                    _gl.uniform3fv(location, value);
                    break;

                  case "4fv":
                    _gl.uniform4fv(location, value);
                    break;

                  case "Matrix3fv":
                    _gl.uniformMatrix3fv(location, !1, value);
                    break;

                  case "Matrix4fv":
                    _gl.uniformMatrix4fv(location, !1, value);
                    break;

                  case "i":
                    _gl.uniform1i(location, value);
                    break;

                  case "f":
                    _gl.uniform1f(location, value);
                    break;

                  case "v2":
                    _gl.uniform2f(location, value.x, value.y);
                    break;

                  case "v3":
                    _gl.uniform3f(location, value.x, value.y, value.z);
                    break;

                  case "v4":
                    _gl.uniform4f(location, value.x, value.y, value.z, value.w);
                    break;

                  case "c":
                    _gl.uniform3f(location, value.r, value.g, value.b);
                    break;

                  case "iv1":
                    _gl.uniform1iv(location, value);
                    break;

                  case "iv":
                    _gl.uniform3iv(location, value);
                    break;

                  case "fv1":
                    _gl.uniform1fv(location, value);
                    break;

                  case "fv":
                    _gl.uniform3fv(location, value);
                    break;

                  case "v2v":
                    void 0 === uniform._array && (uniform._array = new Float32Array(2 * value.length));
                    for (var i = 0, i2 = 0, il = value.length; il > i; i++, i2 += 2) uniform._array[i2 + 0] = value[i].x, 
                    uniform._array[i2 + 1] = value[i].y;
                    _gl.uniform2fv(location, uniform._array);
                    break;

                  case "v3v":
                    void 0 === uniform._array && (uniform._array = new Float32Array(3 * value.length));
                    for (var i = 0, i3 = 0, il = value.length; il > i; i++, i3 += 3) uniform._array[i3 + 0] = value[i].x, 
                    uniform._array[i3 + 1] = value[i].y, uniform._array[i3 + 2] = value[i].z;
                    _gl.uniform3fv(location, uniform._array);
                    break;

                  case "v4v":
                    void 0 === uniform._array && (uniform._array = new Float32Array(4 * value.length));
                    for (var i = 0, i4 = 0, il = value.length; il > i; i++, i4 += 4) uniform._array[i4 + 0] = value[i].x, 
                    uniform._array[i4 + 1] = value[i].y, uniform._array[i4 + 2] = value[i].z, uniform._array[i4 + 3] = value[i].w;
                    _gl.uniform4fv(location, uniform._array);
                    break;

                  case "m3":
                    _gl.uniformMatrix3fv(location, !1, value.elements);
                    break;

                  case "m3v":
                    void 0 === uniform._array && (uniform._array = new Float32Array(9 * value.length));
                    for (var i = 0, il = value.length; il > i; i++) value[i].flattenToArrayOffset(uniform._array, 9 * i);
                    _gl.uniformMatrix3fv(location, !1, uniform._array);
                    break;

                  case "m4":
                    _gl.uniformMatrix4fv(location, !1, value.elements);
                    break;

                  case "m4v":
                    void 0 === uniform._array && (uniform._array = new Float32Array(16 * value.length));
                    for (var i = 0, il = value.length; il > i; i++) value[i].flattenToArrayOffset(uniform._array, 16 * i);
                    _gl.uniformMatrix4fv(location, !1, uniform._array);
                    break;

                  case "t":
                    if (texture = value, textureUnit = getTextureUnit(), _gl.uniform1i(location, textureUnit), 
                    !texture) continue;
                    texture instanceof THREE.CubeTexture || Array.isArray(texture.image) && 6 === texture.image.length ? setCubeTexture(texture, textureUnit) : texture instanceof THREE.WebGLRenderTargetCube ? setCubeTextureDynamic(texture.texture, textureUnit) : texture instanceof THREE.WebGLRenderTarget ? _this.setTexture(texture.texture, textureUnit) : _this.setTexture(texture, textureUnit);
                    break;

                  case "tv":
                    void 0 === uniform._array && (uniform._array = []);
                    for (var i = 0, il = uniform.value.length; il > i; i++) uniform._array[i] = getTextureUnit();
                    _gl.uniform1iv(location, uniform._array);
                    for (var i = 0, il = uniform.value.length; il > i; i++) texture = uniform.value[i], 
                    textureUnit = uniform._array[i], texture && (texture instanceof THREE.CubeTexture || texture.image instanceof Array && 6 === texture.image.length ? setCubeTexture(texture, textureUnit) : texture instanceof THREE.WebGLRenderTarget ? _this.setTexture(texture.texture, textureUnit) : texture instanceof THREE.WebGLRenderTargetCube ? setCubeTextureDynamic(texture.texture, textureUnit) : _this.setTexture(texture, textureUnit));
                    break;

                  default:
                    console.warn("THREE.WebGLRenderer: Unknown uniform type: " + type);
                }
            }
        }
    }
    function setColorLinear(array, offset, color, intensity) {
        array[offset + 0] = color.r * intensity, array[offset + 1] = color.g * intensity, 
        array[offset + 2] = color.b * intensity;
    }
    function setupLights(lights, camera) {
        var l, ll, light, color, skyColor, groundColor, intensity, distance, r = 0, g = 0, b = 0, zlights = _lights, viewMatrix = camera.matrixWorldInverse, dirColors = zlights.directional.colors, dirPositions = zlights.directional.positions, pointColors = zlights.point.colors, pointPositions = zlights.point.positions, pointDistances = zlights.point.distances, pointDecays = zlights.point.decays, spotColors = zlights.spot.colors, spotPositions = zlights.spot.positions, spotDistances = zlights.spot.distances, spotDirections = zlights.spot.directions, spotAnglesCos = zlights.spot.anglesCos, spotExponents = zlights.spot.exponents, spotDecays = zlights.spot.decays, hemiSkyColors = zlights.hemi.skyColors, hemiGroundColors = zlights.hemi.groundColors, hemiPositions = zlights.hemi.positions, dirLength = 0, pointLength = 0, spotLength = 0, hemiLength = 0, dirCount = 0, pointCount = 0, spotCount = 0, hemiCount = 0, dirOffset = 0, pointOffset = 0, spotOffset = 0, hemiOffset = 0;
        for (l = 0, ll = lights.length; ll > l; l++) if (light = lights[l], color = light.color, 
        intensity = light.intensity, distance = light.distance, light instanceof THREE.AmbientLight) {
            if (!light.visible) continue;
            r += color.r, g += color.g, b += color.b;
        } else if (light instanceof THREE.DirectionalLight) {
            if (dirCount += 1, !light.visible) continue;
            _direction.setFromMatrixPosition(light.matrixWorld), _vector3.setFromMatrixPosition(light.target.matrixWorld), 
            _direction.sub(_vector3), _direction.transformDirection(viewMatrix), dirOffset = 3 * dirLength, 
            dirPositions[dirOffset + 0] = _direction.x, dirPositions[dirOffset + 1] = _direction.y, 
            dirPositions[dirOffset + 2] = _direction.z, setColorLinear(dirColors, dirOffset, color, intensity), 
            dirLength += 1;
        } else if (light instanceof THREE.PointLight) {
            if (pointCount += 1, !light.visible) continue;
            pointOffset = 3 * pointLength, setColorLinear(pointColors, pointOffset, color, intensity), 
            _vector3.setFromMatrixPosition(light.matrixWorld), _vector3.applyMatrix4(viewMatrix), 
            pointPositions[pointOffset + 0] = _vector3.x, pointPositions[pointOffset + 1] = _vector3.y, 
            pointPositions[pointOffset + 2] = _vector3.z, pointDistances[pointLength] = distance, 
            pointDecays[pointLength] = 0 === light.distance ? 0 : light.decay, pointLength += 1;
        } else if (light instanceof THREE.SpotLight) {
            if (spotCount += 1, !light.visible) continue;
            spotOffset = 3 * spotLength, setColorLinear(spotColors, spotOffset, color, intensity), 
            _direction.setFromMatrixPosition(light.matrixWorld), _vector3.copy(_direction).applyMatrix4(viewMatrix), 
            spotPositions[spotOffset + 0] = _vector3.x, spotPositions[spotOffset + 1] = _vector3.y, 
            spotPositions[spotOffset + 2] = _vector3.z, spotDistances[spotLength] = distance, 
            _vector3.setFromMatrixPosition(light.target.matrixWorld), _direction.sub(_vector3), 
            _direction.transformDirection(viewMatrix), spotDirections[spotOffset + 0] = _direction.x, 
            spotDirections[spotOffset + 1] = _direction.y, spotDirections[spotOffset + 2] = _direction.z, 
            spotAnglesCos[spotLength] = Math.cos(light.angle), spotExponents[spotLength] = light.exponent, 
            spotDecays[spotLength] = 0 === light.distance ? 0 : light.decay, spotLength += 1;
        } else if (light instanceof THREE.HemisphereLight) {
            if (hemiCount += 1, !light.visible) continue;
            _direction.setFromMatrixPosition(light.matrixWorld), _direction.transformDirection(viewMatrix), 
            hemiOffset = 3 * hemiLength, hemiPositions[hemiOffset + 0] = _direction.x, hemiPositions[hemiOffset + 1] = _direction.y, 
            hemiPositions[hemiOffset + 2] = _direction.z, skyColor = light.color, groundColor = light.groundColor, 
            setColorLinear(hemiSkyColors, hemiOffset, skyColor, intensity), setColorLinear(hemiGroundColors, hemiOffset, groundColor, intensity), 
            hemiLength += 1;
        }
        for (l = 3 * dirLength, ll = Math.max(dirColors.length, 3 * dirCount); ll > l; l++) dirColors[l] = 0;
        for (l = 3 * pointLength, ll = Math.max(pointColors.length, 3 * pointCount); ll > l; l++) pointColors[l] = 0;
        for (l = 3 * spotLength, ll = Math.max(spotColors.length, 3 * spotCount); ll > l; l++) spotColors[l] = 0;
        for (l = 3 * hemiLength, ll = Math.max(hemiSkyColors.length, 3 * hemiCount); ll > l; l++) hemiSkyColors[l] = 0;
        for (l = 3 * hemiLength, ll = Math.max(hemiGroundColors.length, 3 * hemiCount); ll > l; l++) hemiGroundColors[l] = 0;
        zlights.directional.length = dirLength, zlights.point.length = pointLength, zlights.spot.length = spotLength, 
        zlights.hemi.length = hemiLength, zlights.ambient[0] = r, zlights.ambient[1] = g, 
        zlights.ambient[2] = b;
    }
    function setTextureParameters(textureType, texture, isImagePowerOfTwo) {
        var extension;
        if (isImagePowerOfTwo ? (_gl.texParameteri(textureType, _gl.TEXTURE_WRAP_S, paramThreeToGL(texture.wrapS)), 
        _gl.texParameteri(textureType, _gl.TEXTURE_WRAP_T, paramThreeToGL(texture.wrapT)), 
        _gl.texParameteri(textureType, _gl.TEXTURE_MAG_FILTER, paramThreeToGL(texture.magFilter)), 
        _gl.texParameteri(textureType, _gl.TEXTURE_MIN_FILTER, paramThreeToGL(texture.minFilter))) : (_gl.texParameteri(textureType, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE), 
        _gl.texParameteri(textureType, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE), (texture.wrapS !== THREE.ClampToEdgeWrapping || texture.wrapT !== THREE.ClampToEdgeWrapping) && console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping.", texture), 
        _gl.texParameteri(textureType, _gl.TEXTURE_MAG_FILTER, filterFallback(texture.magFilter)), 
        _gl.texParameteri(textureType, _gl.TEXTURE_MIN_FILTER, filterFallback(texture.minFilter)), 
        texture.minFilter !== THREE.NearestFilter && texture.minFilter !== THREE.LinearFilter && console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.", texture)), 
        extension = extensions.get("EXT_texture_filter_anisotropic")) {
            if (texture.type === THREE.FloatType && null === extensions.get("OES_texture_float_linear")) return;
            if (texture.type === THREE.HalfFloatType && null === extensions.get("OES_texture_half_float_linear")) return;
            (texture.anisotropy > 1 || properties.get(texture).__currentAnisotropy) && (_gl.texParameterf(textureType, extension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(texture.anisotropy, _this.getMaxAnisotropy())), 
            properties.get(texture).__currentAnisotropy = texture.anisotropy);
        }
    }
    function uploadTexture(textureProperties, texture, slot) {
        void 0 === textureProperties.__webglInit && (textureProperties.__webglInit = !0, 
        texture.addEventListener("dispose", onTextureDispose), textureProperties.__webglTexture = _gl.createTexture(), 
        _infoMemory.textures++), state.activeTexture(_gl.TEXTURE0 + slot), state.bindTexture(_gl.TEXTURE_2D, textureProperties.__webglTexture), 
        _gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, texture.flipY), _gl.pixelStorei(_gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultiplyAlpha), 
        _gl.pixelStorei(_gl.UNPACK_ALIGNMENT, texture.unpackAlignment), texture.image = clampToMaxSize(texture.image, capabilities.maxTextureSize), 
        textureNeedsPowerOfTwo(texture) && isPowerOfTwo(texture.image) === !1 && (texture.image = makePowerOfTwo(texture.image));
        var image = texture.image, isImagePowerOfTwo = isPowerOfTwo(image), glFormat = paramThreeToGL(texture.format), glType = paramThreeToGL(texture.type);
        setTextureParameters(_gl.TEXTURE_2D, texture, isImagePowerOfTwo);
        var mipmap, mipmaps = texture.mipmaps;
        if (texture instanceof THREE.DataTexture) if (mipmaps.length > 0 && isImagePowerOfTwo) {
            for (var i = 0, il = mipmaps.length; il > i; i++) mipmap = mipmaps[i], state.texImage2D(_gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data);
            texture.generateMipmaps = !1;
        } else state.texImage2D(_gl.TEXTURE_2D, 0, glFormat, image.width, image.height, 0, glFormat, glType, image.data); else if (texture instanceof THREE.CompressedTexture) for (var i = 0, il = mipmaps.length; il > i; i++) mipmap = mipmaps[i], 
        texture.format !== THREE.RGBAFormat && texture.format !== THREE.RGBFormat ? state.getCompressedTextureFormats().indexOf(glFormat) > -1 ? state.compressedTexImage2D(_gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, mipmap.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : state.texImage2D(_gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data); else if (mipmaps.length > 0 && isImagePowerOfTwo) {
            for (var i = 0, il = mipmaps.length; il > i; i++) mipmap = mipmaps[i], state.texImage2D(_gl.TEXTURE_2D, i, glFormat, glFormat, glType, mipmap);
            texture.generateMipmaps = !1;
        } else state.texImage2D(_gl.TEXTURE_2D, 0, glFormat, glFormat, glType, texture.image);
        texture.generateMipmaps && isImagePowerOfTwo && _gl.generateMipmap(_gl.TEXTURE_2D), 
        textureProperties.__version = texture.version, texture.onUpdate && texture.onUpdate(texture);
    }
    function clampToMaxSize(image, maxSize) {
        if (image.width > maxSize || image.height > maxSize) {
            var scale = maxSize / Math.max(image.width, image.height), canvas = document.createElement("canvas");
            canvas.width = Math.floor(image.width * scale), canvas.height = Math.floor(image.height * scale);
            var context = canvas.getContext("2d");
            return context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height), 
            console.warn("THREE.WebGLRenderer: image is too big (" + image.width + "x" + image.height + "). Resized to " + canvas.width + "x" + canvas.height, image), 
            canvas;
        }
        return image;
    }
    function isPowerOfTwo(image) {
        return THREE.Math.isPowerOfTwo(image.width) && THREE.Math.isPowerOfTwo(image.height);
    }
    function textureNeedsPowerOfTwo(texture) {
        return texture.wrapS !== THREE.ClampToEdgeWrapping || texture.wrapT !== THREE.ClampToEdgeWrapping ? !0 : texture.minFilter !== THREE.NearestFilter && texture.minFilter !== THREE.LinearFilter ? !0 : !1;
    }
    function makePowerOfTwo(image) {
        if (image instanceof HTMLImageElement || image instanceof HTMLCanvasElement) {
            var canvas = document.createElement("canvas");
            canvas.width = THREE.Math.nearestPowerOfTwo(image.width), canvas.height = THREE.Math.nearestPowerOfTwo(image.height);
            var context = canvas.getContext("2d");
            return context.drawImage(image, 0, 0, canvas.width, canvas.height), console.warn("THREE.WebGLRenderer: image is not power of two (" + image.width + "x" + image.height + "). Resized to " + canvas.width + "x" + canvas.height, image), 
            canvas;
        }
        return image;
    }
    function setCubeTexture(texture, slot) {
        var textureProperties = properties.get(texture);
        if (6 === texture.image.length) if (texture.version > 0 && textureProperties.__version !== texture.version) {
            textureProperties.__image__webglTextureCube || (texture.addEventListener("dispose", onTextureDispose), 
            textureProperties.__image__webglTextureCube = _gl.createTexture(), _infoMemory.textures++), 
            state.activeTexture(_gl.TEXTURE0 + slot), state.bindTexture(_gl.TEXTURE_CUBE_MAP, textureProperties.__image__webglTextureCube), 
            _gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);
            for (var isCompressed = texture instanceof THREE.CompressedTexture, isDataTexture = texture.image[0] instanceof THREE.DataTexture, cubeImage = [], i = 0; 6 > i; i++) !_this.autoScaleCubemaps || isCompressed || isDataTexture ? cubeImage[i] = isDataTexture ? texture.image[i].image : texture.image[i] : cubeImage[i] = clampToMaxSize(texture.image[i], capabilities.maxCubemapSize);
            var image = cubeImage[0], isImagePowerOfTwo = isPowerOfTwo(image), glFormat = paramThreeToGL(texture.format), glType = paramThreeToGL(texture.type);
            setTextureParameters(_gl.TEXTURE_CUBE_MAP, texture, isImagePowerOfTwo);
            for (var i = 0; 6 > i; i++) if (isCompressed) for (var mipmap, mipmaps = cubeImage[i].mipmaps, j = 0, jl = mipmaps.length; jl > j; j++) mipmap = mipmaps[j], 
            texture.format !== THREE.RGBAFormat && texture.format !== THREE.RGBFormat ? state.getCompressedTextureFormats().indexOf(glFormat) > -1 ? state.compressedTexImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, mipmap.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setCubeTexture()") : state.texImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data); else isDataTexture ? state.texImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, cubeImage[i].width, cubeImage[i].height, 0, glFormat, glType, cubeImage[i].data) : state.texImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, glFormat, glType, cubeImage[i]);
            texture.generateMipmaps && isImagePowerOfTwo && _gl.generateMipmap(_gl.TEXTURE_CUBE_MAP), 
            textureProperties.__version = texture.version, texture.onUpdate && texture.onUpdate(texture);
        } else state.activeTexture(_gl.TEXTURE0 + slot), state.bindTexture(_gl.TEXTURE_CUBE_MAP, textureProperties.__image__webglTextureCube);
    }
    function setCubeTextureDynamic(texture, slot) {
        state.activeTexture(_gl.TEXTURE0 + slot), state.bindTexture(_gl.TEXTURE_CUBE_MAP, properties.get(texture).__webglTexture);
    }
    function setupFrameBuffer(framebuffer, renderTarget, textureTarget) {
        _gl.bindFramebuffer(_gl.FRAMEBUFFER, framebuffer), _gl.framebufferTexture2D(_gl.FRAMEBUFFER, _gl.COLOR_ATTACHMENT0, textureTarget, properties.get(renderTarget.texture).__webglTexture, 0);
    }
    function setupRenderBuffer(renderbuffer, renderTarget) {
        _gl.bindRenderbuffer(_gl.RENDERBUFFER, renderbuffer), renderTarget.depthBuffer && !renderTarget.stencilBuffer ? (_gl.renderbufferStorage(_gl.RENDERBUFFER, _gl.DEPTH_COMPONENT16, renderTarget.width, renderTarget.height), 
        _gl.framebufferRenderbuffer(_gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer)) : renderTarget.depthBuffer && renderTarget.stencilBuffer ? (_gl.renderbufferStorage(_gl.RENDERBUFFER, _gl.DEPTH_STENCIL, renderTarget.width, renderTarget.height), 
        _gl.framebufferRenderbuffer(_gl.FRAMEBUFFER, _gl.DEPTH_STENCIL_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer)) : _gl.renderbufferStorage(_gl.RENDERBUFFER, _gl.RGBA4, renderTarget.width, renderTarget.height);
    }
    function updateRenderTargetMipmap(renderTarget) {
        var target = renderTarget instanceof THREE.WebGLRenderTargetCube ? _gl.TEXTURE_CUBE_MAP : _gl.TEXTURE_2D, texture = properties.get(renderTarget.texture).__webglTexture;
        state.bindTexture(target, texture), _gl.generateMipmap(target), state.bindTexture(target, null);
    }
    function filterFallback(f) {
        return f === THREE.NearestFilter || f === THREE.NearestMipMapNearestFilter || f === THREE.NearestMipMapLinearFilter ? _gl.NEAREST : _gl.LINEAR;
    }
    function paramThreeToGL(p) {
        var extension;
        if (p === THREE.RepeatWrapping) return _gl.REPEAT;
        if (p === THREE.ClampToEdgeWrapping) return _gl.CLAMP_TO_EDGE;
        if (p === THREE.MirroredRepeatWrapping) return _gl.MIRRORED_REPEAT;
        if (p === THREE.NearestFilter) return _gl.NEAREST;
        if (p === THREE.NearestMipMapNearestFilter) return _gl.NEAREST_MIPMAP_NEAREST;
        if (p === THREE.NearestMipMapLinearFilter) return _gl.NEAREST_MIPMAP_LINEAR;
        if (p === THREE.LinearFilter) return _gl.LINEAR;
        if (p === THREE.LinearMipMapNearestFilter) return _gl.LINEAR_MIPMAP_NEAREST;
        if (p === THREE.LinearMipMapLinearFilter) return _gl.LINEAR_MIPMAP_LINEAR;
        if (p === THREE.UnsignedByteType) return _gl.UNSIGNED_BYTE;
        if (p === THREE.UnsignedShort4444Type) return _gl.UNSIGNED_SHORT_4_4_4_4;
        if (p === THREE.UnsignedShort5551Type) return _gl.UNSIGNED_SHORT_5_5_5_1;
        if (p === THREE.UnsignedShort565Type) return _gl.UNSIGNED_SHORT_5_6_5;
        if (p === THREE.ByteType) return _gl.BYTE;
        if (p === THREE.ShortType) return _gl.SHORT;
        if (p === THREE.UnsignedShortType) return _gl.UNSIGNED_SHORT;
        if (p === THREE.IntType) return _gl.INT;
        if (p === THREE.UnsignedIntType) return _gl.UNSIGNED_INT;
        if (p === THREE.FloatType) return _gl.FLOAT;
        if (extension = extensions.get("OES_texture_half_float"), null !== extension && p === THREE.HalfFloatType) return extension.HALF_FLOAT_OES;
        if (p === THREE.AlphaFormat) return _gl.ALPHA;
        if (p === THREE.RGBFormat) return _gl.RGB;
        if (p === THREE.RGBAFormat) return _gl.RGBA;
        if (p === THREE.LuminanceFormat) return _gl.LUMINANCE;
        if (p === THREE.LuminanceAlphaFormat) return _gl.LUMINANCE_ALPHA;
        if (p === THREE.AddEquation) return _gl.FUNC_ADD;
        if (p === THREE.SubtractEquation) return _gl.FUNC_SUBTRACT;
        if (p === THREE.ReverseSubtractEquation) return _gl.FUNC_REVERSE_SUBTRACT;
        if (p === THREE.ZeroFactor) return _gl.ZERO;
        if (p === THREE.OneFactor) return _gl.ONE;
        if (p === THREE.SrcColorFactor) return _gl.SRC_COLOR;
        if (p === THREE.OneMinusSrcColorFactor) return _gl.ONE_MINUS_SRC_COLOR;
        if (p === THREE.SrcAlphaFactor) return _gl.SRC_ALPHA;
        if (p === THREE.OneMinusSrcAlphaFactor) return _gl.ONE_MINUS_SRC_ALPHA;
        if (p === THREE.DstAlphaFactor) return _gl.DST_ALPHA;
        if (p === THREE.OneMinusDstAlphaFactor) return _gl.ONE_MINUS_DST_ALPHA;
        if (p === THREE.DstColorFactor) return _gl.DST_COLOR;
        if (p === THREE.OneMinusDstColorFactor) return _gl.ONE_MINUS_DST_COLOR;
        if (p === THREE.SrcAlphaSaturateFactor) return _gl.SRC_ALPHA_SATURATE;
        if (extension = extensions.get("WEBGL_compressed_texture_s3tc"), null !== extension) {
            if (p === THREE.RGB_S3TC_DXT1_Format) return extension.COMPRESSED_RGB_S3TC_DXT1_EXT;
            if (p === THREE.RGBA_S3TC_DXT1_Format) return extension.COMPRESSED_RGBA_S3TC_DXT1_EXT;
            if (p === THREE.RGBA_S3TC_DXT3_Format) return extension.COMPRESSED_RGBA_S3TC_DXT3_EXT;
            if (p === THREE.RGBA_S3TC_DXT5_Format) return extension.COMPRESSED_RGBA_S3TC_DXT5_EXT;
        }
        if (extension = extensions.get("WEBGL_compressed_texture_pvrtc"), null !== extension) {
            if (p === THREE.RGB_PVRTC_4BPPV1_Format) return extension.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
            if (p === THREE.RGB_PVRTC_2BPPV1_Format) return extension.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
            if (p === THREE.RGBA_PVRTC_4BPPV1_Format) return extension.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
            if (p === THREE.RGBA_PVRTC_2BPPV1_Format) return extension.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
        }
        if (extension = extensions.get("EXT_blend_minmax"), null !== extension) {
            if (p === THREE.MinEquation) return extension.MIN_EXT;
            if (p === THREE.MaxEquation) return extension.MAX_EXT;
        }
        return 0;
    }
    console.log("THREE.WebGLRenderer", THREE.REVISION), parameters = parameters || {};
    var _canvas = void 0 !== parameters.canvas ? parameters.canvas : document.createElement("canvas"), _context = void 0 !== parameters.context ? parameters.context : null, _width = _canvas.width, _height = _canvas.height, pixelRatio = 1, _alpha = void 0 !== parameters.alpha ? parameters.alpha : !1, _depth = void 0 !== parameters.depth ? parameters.depth : !0, _stencil = void 0 !== parameters.stencil ? parameters.stencil : !0, _antialias = void 0 !== parameters.antialias ? parameters.antialias : !1, _premultipliedAlpha = void 0 !== parameters.premultipliedAlpha ? parameters.premultipliedAlpha : !0, _preserveDrawingBuffer = void 0 !== parameters.preserveDrawingBuffer ? parameters.preserveDrawingBuffer : !1, _clearColor = new THREE.Color(0), _clearAlpha = 0, lights = [], opaqueObjects = [], opaqueObjectsLastIndex = -1, transparentObjects = [], transparentObjectsLastIndex = -1, morphInfluences = new Float32Array(8), sprites = [], lensFlares = [];
    this.domElement = _canvas, this.context = null, this.autoClear = !0, this.autoClearColor = !0, 
    this.autoClearDepth = !0, this.autoClearStencil = !0, this.sortObjects = !0, this.gammaFactor = 2, 
    this.gammaInput = !1, this.gammaOutput = !1, this.maxMorphTargets = 8, this.maxMorphNormals = 4, 
    this.autoScaleCubemaps = !0;
    var _this = this, _currentProgram = null, _currentFramebuffer = null, _currentMaterialId = -1, _currentGeometryProgram = "", _currentCamera = null, _usedTextureUnits = 0, _viewportX = 0, _viewportY = 0, _viewportWidth = _canvas.width, _viewportHeight = _canvas.height, _currentWidth = 0, _currentHeight = 0, _frustum = new THREE.Frustum(), _projScreenMatrix = new THREE.Matrix4(), _vector3 = new THREE.Vector3(), _direction = new THREE.Vector3(), _lightsNeedUpdate = !0, _lights = {
        ambient: [ 0, 0, 0 ],
        directional: {
            length: 0,
            colors: [],
            positions: []
        },
        point: {
            length: 0,
            colors: [],
            positions: [],
            distances: [],
            decays: []
        },
        spot: {
            length: 0,
            colors: [],
            positions: [],
            distances: [],
            directions: [],
            anglesCos: [],
            exponents: [],
            decays: []
        },
        hemi: {
            length: 0,
            skyColors: [],
            groundColors: [],
            positions: []
        }
    }, _infoMemory = {
        geometries: 0,
        textures: 0
    }, _infoRender = {
        calls: 0,
        vertices: 0,
        faces: 0,
        points: 0
    };
    this.info = {
        render: _infoRender,
        memory: _infoMemory,
        programs: null
    };
    var _gl;
    try {
        var attributes = {
            alpha: _alpha,
            depth: _depth,
            stencil: _stencil,
            antialias: _antialias,
            premultipliedAlpha: _premultipliedAlpha,
            preserveDrawingBuffer: _preserveDrawingBuffer
        };
        if (_gl = _context || _canvas.getContext("webgl", attributes) || _canvas.getContext("experimental-webgl", attributes), 
        null === _gl) throw null !== _canvas.getContext("webgl") ? "Error creating WebGL context with your selected attributes." : "Error creating WebGL context.";
        _canvas.addEventListener("webglcontextlost", onContextLost, !1);
    } catch (error) {
        console.error("THREE.WebGLRenderer: " + error);
    }
    var extensions = new THREE.WebGLExtensions(_gl);
    extensions.get("OES_texture_float"), extensions.get("OES_texture_float_linear"), 
    extensions.get("OES_texture_half_float"), extensions.get("OES_texture_half_float_linear"), 
    extensions.get("OES_standard_derivatives"), extensions.get("ANGLE_instanced_arrays"), 
    extensions.get("OES_element_index_uint") && (THREE.BufferGeometry.MaxIndex = 4294967296);
    var capabilities = new THREE.WebGLCapabilities(_gl, extensions, parameters), state = new THREE.WebGLState(_gl, extensions, paramThreeToGL), properties = new THREE.WebGLProperties(), objects = new THREE.WebGLObjects(_gl, properties, this.info), programCache = new THREE.WebGLPrograms(this, capabilities);
    this.info.programs = programCache.programs;
    var bufferRenderer = new THREE.WebGLBufferRenderer(_gl, extensions, _infoRender), indexedBufferRenderer = new THREE.WebGLIndexedBufferRenderer(_gl, extensions, _infoRender);
    setDefaultGLState(), this.context = _gl, this.capabilities = capabilities, this.extensions = extensions, 
    this.state = state;
    var shadowMap = new THREE.WebGLShadowMap(this, lights, objects);
    this.shadowMap = shadowMap;
    var spritePlugin = new THREE.SpritePlugin(this, sprites), lensFlarePlugin = new THREE.LensFlarePlugin(this, lensFlares);
    this.getContext = function() {
        return _gl;
    }, this.getContextAttributes = function() {
        return _gl.getContextAttributes();
    }, this.forceContextLoss = function() {
        extensions.get("WEBGL_lose_context").loseContext();
    }, this.getMaxAnisotropy = function() {
        var value;
        return function() {
            if (void 0 !== value) return value;
            var extension = extensions.get("EXT_texture_filter_anisotropic");
            return value = null !== extension ? _gl.getParameter(extension.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0;
        };
    }(), this.getPrecision = function() {
        return capabilities.precision;
    }, this.getPixelRatio = function() {
        return pixelRatio;
    }, this.setPixelRatio = function(value) {
        void 0 !== value && (pixelRatio = value);
    }, this.getSize = function() {
        return {
            width: _width,
            height: _height
        };
    }, this.setSize = function(width, height, updateStyle) {
        _width = width, _height = height, _canvas.width = width * pixelRatio, _canvas.height = height * pixelRatio, 
        updateStyle !== !1 && (_canvas.style.width = width + "px", _canvas.style.height = height + "px"), 
        this.setViewport(0, 0, width, height);
    }, this.setViewport = function(x, y, width, height) {
        _viewportX = x * pixelRatio, _viewportY = y * pixelRatio, _viewportWidth = width * pixelRatio, 
        _viewportHeight = height * pixelRatio, _gl.viewport(_viewportX, _viewportY, _viewportWidth, _viewportHeight);
    }, this.getViewport = function(dimensions) {
        dimensions.x = _viewportX / pixelRatio, dimensions.y = _viewportY / pixelRatio, 
        dimensions.z = _viewportWidth / pixelRatio, dimensions.w = _viewportHeight / pixelRatio;
    }, this.setScissor = function(x, y, width, height) {
        _gl.scissor(x * pixelRatio, y * pixelRatio, width * pixelRatio, height * pixelRatio);
    }, this.enableScissorTest = function(boolean) {
        state.setScissorTest(boolean);
    }, this.getClearColor = function() {
        return _clearColor;
    }, this.setClearColor = function(color, alpha) {
        _clearColor.set(color), _clearAlpha = void 0 !== alpha ? alpha : 1, glClearColor(_clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha);
    }, this.getClearAlpha = function() {
        return _clearAlpha;
    }, this.setClearAlpha = function(alpha) {
        _clearAlpha = alpha, glClearColor(_clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha);
    }, this.clear = function(color, depth, stencil) {
        var bits = 0;
        (void 0 === color || color) && (bits |= _gl.COLOR_BUFFER_BIT), (void 0 === depth || depth) && (bits |= _gl.DEPTH_BUFFER_BIT), 
        (void 0 === stencil || stencil) && (bits |= _gl.STENCIL_BUFFER_BIT), _gl.clear(bits);
    }, this.clearColor = function() {
        _gl.clear(_gl.COLOR_BUFFER_BIT);
    }, this.clearDepth = function() {
        _gl.clear(_gl.DEPTH_BUFFER_BIT);
    }, this.clearStencil = function() {
        _gl.clear(_gl.STENCIL_BUFFER_BIT);
    }, this.clearTarget = function(renderTarget, color, depth, stencil) {
        this.setRenderTarget(renderTarget), this.clear(color, depth, stencil);
    }, this.resetGLState = resetGLState, this.dispose = function() {
        _canvas.removeEventListener("webglcontextlost", onContextLost, !1);
    }, this.renderBufferImmediate = function(object, program, material) {
        state.initAttributes();
        var buffers = properties.get(object);
        object.hasPositions && !buffers.position && (buffers.position = _gl.createBuffer()), 
        object.hasNormals && !buffers.normal && (buffers.normal = _gl.createBuffer()), object.hasUvs && !buffers.uv && (buffers.uv = _gl.createBuffer()), 
        object.hasColors && !buffers.color && (buffers.color = _gl.createBuffer());
        var attributes = program.getAttributes();
        if (object.hasPositions && (_gl.bindBuffer(_gl.ARRAY_BUFFER, buffers.position), 
        _gl.bufferData(_gl.ARRAY_BUFFER, object.positionArray, _gl.DYNAMIC_DRAW), state.enableAttribute(attributes.position), 
        _gl.vertexAttribPointer(attributes.position, 3, _gl.FLOAT, !1, 0, 0)), object.hasNormals) {
            if (_gl.bindBuffer(_gl.ARRAY_BUFFER, buffers.normal), "MeshPhongMaterial" !== material.type && material.shading === THREE.FlatShading) for (var i = 0, l = 3 * object.count; l > i; i += 9) {
                var array = object.normalArray, nx = (array[i + 0] + array[i + 3] + array[i + 6]) / 3, ny = (array[i + 1] + array[i + 4] + array[i + 7]) / 3, nz = (array[i + 2] + array[i + 5] + array[i + 8]) / 3;
                array[i + 0] = nx, array[i + 1] = ny, array[i + 2] = nz, array[i + 3] = nx, array[i + 4] = ny, 
                array[i + 5] = nz, array[i + 6] = nx, array[i + 7] = ny, array[i + 8] = nz;
            }
            _gl.bufferData(_gl.ARRAY_BUFFER, object.normalArray, _gl.DYNAMIC_DRAW), state.enableAttribute(attributes.normal), 
            _gl.vertexAttribPointer(attributes.normal, 3, _gl.FLOAT, !1, 0, 0);
        }
        object.hasUvs && material.map && (_gl.bindBuffer(_gl.ARRAY_BUFFER, buffers.uv), 
        _gl.bufferData(_gl.ARRAY_BUFFER, object.uvArray, _gl.DYNAMIC_DRAW), state.enableAttribute(attributes.uv), 
        _gl.vertexAttribPointer(attributes.uv, 2, _gl.FLOAT, !1, 0, 0)), object.hasColors && material.vertexColors !== THREE.NoColors && (_gl.bindBuffer(_gl.ARRAY_BUFFER, buffers.color), 
        _gl.bufferData(_gl.ARRAY_BUFFER, object.colorArray, _gl.DYNAMIC_DRAW), state.enableAttribute(attributes.color), 
        _gl.vertexAttribPointer(attributes.color, 3, _gl.FLOAT, !1, 0, 0)), state.disableUnusedAttributes(), 
        _gl.drawArrays(_gl.TRIANGLES, 0, object.count), object.count = 0;
    }, this.renderBufferDirect = function(camera, lights, fog, geometry, material, object, group) {
        setMaterial(material);
        var program = setProgram(camera, lights, fog, material, object), updateBuffers = !1, geometryProgram = geometry.id + "_" + program.id + "_" + material.wireframe;
        geometryProgram !== _currentGeometryProgram && (_currentGeometryProgram = geometryProgram, 
        updateBuffers = !0);
        var morphTargetInfluences = object.morphTargetInfluences;
        if (void 0 !== morphTargetInfluences) {
            for (var activeInfluences = [], i = 0, l = morphTargetInfluences.length; l > i; i++) {
                var influence = morphTargetInfluences[i];
                activeInfluences.push([ influence, i ]);
            }
            activeInfluences.sort(numericalSort), activeInfluences.length > 8 && (activeInfluences.length = 8);
            for (var morphAttributes = geometry.morphAttributes, i = 0, l = activeInfluences.length; l > i; i++) {
                var influence = activeInfluences[i];
                if (morphInfluences[i] = influence[0], 0 !== influence[0]) {
                    var index = influence[1];
                    material.morphTargets === !0 && morphAttributes.position && geometry.addAttribute("morphTarget" + i, morphAttributes.position[index]), 
                    material.morphNormals === !0 && morphAttributes.normal && geometry.addAttribute("morphNormal" + i, morphAttributes.normal[index]);
                } else material.morphTargets === !0 && geometry.removeAttribute("morphTarget" + i), 
                material.morphNormals === !0 && geometry.removeAttribute("morphNormal" + i);
            }
            var uniforms = program.getUniforms();
            null !== uniforms.morphTargetInfluences && _gl.uniform1fv(uniforms.morphTargetInfluences, morphInfluences), 
            updateBuffers = !0;
        }
        var index = geometry.index, position = geometry.attributes.position;
        material.wireframe === !0 && (index = objects.getWireframeAttribute(geometry));
        var renderer;
        null !== index ? (renderer = indexedBufferRenderer, renderer.setIndex(index)) : renderer = bufferRenderer, 
        updateBuffers && (setupVertexAttributes(material, program, geometry), null !== index && _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, objects.getAttributeBuffer(index)));
        var dataStart = 0, dataCount = 1 / 0;
        null !== index ? dataCount = index.count : void 0 !== position && (dataCount = position.count);
        var rangeStart = geometry.drawRange.start, rangeCount = geometry.drawRange.count, groupStart = null !== group ? group.start : 0, groupCount = null !== group ? group.count : 1 / 0, drawStart = Math.max(dataStart, rangeStart, groupStart), drawEnd = Math.min(dataStart + dataCount, rangeStart + rangeCount, groupStart + groupCount) - 1, drawCount = Math.max(0, drawEnd - drawStart + 1);
        if (object instanceof THREE.Mesh) material.wireframe === !0 ? (state.setLineWidth(material.wireframeLinewidth * pixelRatio), 
        renderer.setMode(_gl.LINES)) : renderer.setMode(_gl.TRIANGLES), geometry instanceof THREE.InstancedBufferGeometry && geometry.maxInstancedCount > 0 ? renderer.renderInstances(geometry) : renderer.render(drawStart, drawCount); else if (object instanceof THREE.Line) {
            var lineWidth = material.linewidth;
            void 0 === lineWidth && (lineWidth = 1), state.setLineWidth(lineWidth * pixelRatio), 
            object instanceof THREE.LineSegments ? renderer.setMode(_gl.LINES) : renderer.setMode(_gl.LINE_STRIP), 
            renderer.render(drawStart, drawCount);
        } else object instanceof THREE.Points && (renderer.setMode(_gl.POINTS), renderer.render(drawStart, drawCount));
    }, this.render = function(scene, camera, renderTarget, forceClear) {
        if (camera instanceof THREE.Camera == !1) return void console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");
        var fog = scene.fog;
        if (_currentGeometryProgram = "", _currentMaterialId = -1, _currentCamera = null, 
        _lightsNeedUpdate = !0, scene.autoUpdate === !0 && scene.updateMatrixWorld(), null === camera.parent && camera.updateMatrixWorld(), 
        camera.matrixWorldInverse.getInverse(camera.matrixWorld), _projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse), 
        _frustum.setFromMatrix(_projScreenMatrix), lights.length = 0, opaqueObjectsLastIndex = -1, 
        transparentObjectsLastIndex = -1, sprites.length = 0, lensFlares.length = 0, projectObject(scene, camera), 
        opaqueObjects.length = opaqueObjectsLastIndex + 1, transparentObjects.length = transparentObjectsLastIndex + 1, 
        _this.sortObjects === !0 && (opaqueObjects.sort(painterSortStable), transparentObjects.sort(reversePainterSortStable)), 
        shadowMap.render(scene), _infoRender.calls = 0, _infoRender.vertices = 0, _infoRender.faces = 0, 
        _infoRender.points = 0, this.setRenderTarget(renderTarget), (this.autoClear || forceClear) && this.clear(this.autoClearColor, this.autoClearDepth, this.autoClearStencil), 
        scene.overrideMaterial) {
            var overrideMaterial = scene.overrideMaterial;
            renderObjects(opaqueObjects, camera, lights, fog, overrideMaterial), renderObjects(transparentObjects, camera, lights, fog, overrideMaterial);
        } else state.setBlending(THREE.NoBlending), renderObjects(opaqueObjects, camera, lights, fog), 
        renderObjects(transparentObjects, camera, lights, fog);
        if (spritePlugin.render(scene, camera), lensFlarePlugin.render(scene, camera, _currentWidth, _currentHeight), 
        renderTarget) {
            var texture = renderTarget.texture, isTargetPowerOfTwo = isPowerOfTwo(renderTarget);
            texture.generateMipmaps && isTargetPowerOfTwo && texture.minFilter !== THREE.NearestFilter && texture.minFilter !== THREE.LinearFilter && updateRenderTargetMipmap(renderTarget);
        }
        state.setDepthTest(!0), state.setDepthWrite(!0), state.setColorWrite(!0);
    }, this.setFaceCulling = function(cullFace, frontFaceDirection) {
        cullFace === THREE.CullFaceNone ? state.disable(_gl.CULL_FACE) : (frontFaceDirection === THREE.FrontFaceDirectionCW ? _gl.frontFace(_gl.CW) : _gl.frontFace(_gl.CCW), 
        cullFace === THREE.CullFaceBack ? _gl.cullFace(_gl.BACK) : cullFace === THREE.CullFaceFront ? _gl.cullFace(_gl.FRONT) : _gl.cullFace(_gl.FRONT_AND_BACK), 
        state.enable(_gl.CULL_FACE));
    }, this.setTexture = function(texture, slot) {
        var textureProperties = properties.get(texture);
        if (texture.version > 0 && textureProperties.__version !== texture.version) {
            var image = texture.image;
            return void 0 === image ? void console.warn("THREE.WebGLRenderer: Texture marked for update but image is undefined", texture) : image.complete === !1 ? void console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete", texture) : void uploadTexture(textureProperties, texture, slot);
        }
        state.activeTexture(_gl.TEXTURE0 + slot), state.bindTexture(_gl.TEXTURE_2D, textureProperties.__webglTexture);
    }, this.setRenderTarget = function(renderTarget) {
        var isCube = renderTarget instanceof THREE.WebGLRenderTargetCube;
        if (renderTarget && void 0 === properties.get(renderTarget).__webglFramebuffer) {
            var renderTargetProperties = properties.get(renderTarget), textureProperties = properties.get(renderTarget.texture);
            void 0 === renderTarget.depthBuffer && (renderTarget.depthBuffer = !0), void 0 === renderTarget.stencilBuffer && (renderTarget.stencilBuffer = !0), 
            renderTarget.addEventListener("dispose", onRenderTargetDispose), textureProperties.__webglTexture = _gl.createTexture(), 
            _infoMemory.textures++;
            var isTargetPowerOfTwo = isPowerOfTwo(renderTarget), glFormat = paramThreeToGL(renderTarget.texture.format), glType = paramThreeToGL(renderTarget.texture.type);
            if (isCube) {
                renderTargetProperties.__webglFramebuffer = [], renderTargetProperties.__webglRenderbuffer = [], 
                state.bindTexture(_gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture), setTextureParameters(_gl.TEXTURE_CUBE_MAP, renderTarget.texture, isTargetPowerOfTwo);
                for (var i = 0; 6 > i; i++) renderTargetProperties.__webglFramebuffer[i] = _gl.createFramebuffer(), 
                renderTargetProperties.__webglRenderbuffer[i] = _gl.createRenderbuffer(), state.texImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, renderTarget.width, renderTarget.height, 0, glFormat, glType, null), 
                setupFrameBuffer(renderTargetProperties.__webglFramebuffer[i], renderTarget, _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i), 
                setupRenderBuffer(renderTargetProperties.__webglRenderbuffer[i], renderTarget);
                renderTarget.texture.generateMipmaps && isTargetPowerOfTwo && _gl.generateMipmap(_gl.TEXTURE_CUBE_MAP);
            } else renderTargetProperties.__webglFramebuffer = _gl.createFramebuffer(), renderTarget.shareDepthFrom ? renderTargetProperties.__webglRenderbuffer = renderTarget.shareDepthFrom.__webglRenderbuffer : renderTargetProperties.__webglRenderbuffer = _gl.createRenderbuffer(), 
            state.bindTexture(_gl.TEXTURE_2D, textureProperties.__webglTexture), setTextureParameters(_gl.TEXTURE_2D, renderTarget.texture, isTargetPowerOfTwo), 
            state.texImage2D(_gl.TEXTURE_2D, 0, glFormat, renderTarget.width, renderTarget.height, 0, glFormat, glType, null), 
            setupFrameBuffer(renderTargetProperties.__webglFramebuffer, renderTarget, _gl.TEXTURE_2D), 
            renderTarget.shareDepthFrom ? renderTarget.depthBuffer && !renderTarget.stencilBuffer ? _gl.framebufferRenderbuffer(_gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, renderTargetProperties.__webglRenderbuffer) : renderTarget.depthBuffer && renderTarget.stencilBuffer && _gl.framebufferRenderbuffer(_gl.FRAMEBUFFER, _gl.DEPTH_STENCIL_ATTACHMENT, _gl.RENDERBUFFER, renderTargetProperties.__webglRenderbuffer) : setupRenderBuffer(renderTargetProperties.__webglRenderbuffer, renderTarget), 
            renderTarget.texture.generateMipmaps && isTargetPowerOfTwo && _gl.generateMipmap(_gl.TEXTURE_2D);
            isCube ? state.bindTexture(_gl.TEXTURE_CUBE_MAP, null) : state.bindTexture(_gl.TEXTURE_2D, null), 
            _gl.bindRenderbuffer(_gl.RENDERBUFFER, null), _gl.bindFramebuffer(_gl.FRAMEBUFFER, null);
        }
        var framebuffer, width, height, vx, vy;
        if (renderTarget) {
            var renderTargetProperties = properties.get(renderTarget);
            framebuffer = isCube ? renderTargetProperties.__webglFramebuffer[renderTarget.activeCubeFace] : renderTargetProperties.__webglFramebuffer, 
            width = renderTarget.width, height = renderTarget.height, vx = 0, vy = 0;
        } else framebuffer = null, width = _viewportWidth, height = _viewportHeight, vx = _viewportX, 
        vy = _viewportY;
        if (framebuffer !== _currentFramebuffer && (_gl.bindFramebuffer(_gl.FRAMEBUFFER, framebuffer), 
        _gl.viewport(vx, vy, width, height), _currentFramebuffer = framebuffer), isCube) {
            var textureProperties = properties.get(renderTarget.texture);
            _gl.framebufferTexture2D(_gl.FRAMEBUFFER, _gl.COLOR_ATTACHMENT0, _gl.TEXTURE_CUBE_MAP_POSITIVE_X + renderTarget.activeCubeFace, textureProperties.__webglTexture, 0);
        }
        _currentWidth = width, _currentHeight = height;
    }, this.readRenderTargetPixels = function(renderTarget, x, y, width, height, buffer) {
        if (renderTarget instanceof THREE.WebGLRenderTarget == !1) return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
        var framebuffer = properties.get(renderTarget).__webglFramebuffer;
        if (framebuffer) {
            var restore = !1;
            framebuffer !== _currentFramebuffer && (_gl.bindFramebuffer(_gl.FRAMEBUFFER, framebuffer), 
            restore = !0);
            try {
                var texture = renderTarget.texture;
                if (texture.format !== THREE.RGBAFormat && paramThreeToGL(texture.format) !== _gl.getParameter(_gl.IMPLEMENTATION_COLOR_READ_FORMAT)) return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
                if (!(texture.type === THREE.UnsignedByteType || paramThreeToGL(texture.type) === _gl.getParameter(_gl.IMPLEMENTATION_COLOR_READ_TYPE) || texture.type === THREE.FloatType && extensions.get("WEBGL_color_buffer_float") || texture.type === THREE.HalfFloatType && extensions.get("EXT_color_buffer_half_float"))) return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");
                _gl.checkFramebufferStatus(_gl.FRAMEBUFFER) === _gl.FRAMEBUFFER_COMPLETE ? _gl.readPixels(x, y, width, height, paramThreeToGL(texture.format), paramThreeToGL(texture.type), buffer) : console.error("THREE.WebGLRenderer.readRenderTargetPixels: readPixels from renderTarget failed. Framebuffer not complete.");
            } finally {
                restore && _gl.bindFramebuffer(_gl.FRAMEBUFFER, _currentFramebuffer);
            }
        }
    }, this.supportsFloatTextures = function() {
        return console.warn("THREE.WebGLRenderer: .supportsFloatTextures() is now .extensions.get( 'OES_texture_float' )."), 
        extensions.get("OES_texture_float");
    }, this.supportsHalfFloatTextures = function() {
        return console.warn("THREE.WebGLRenderer: .supportsHalfFloatTextures() is now .extensions.get( 'OES_texture_half_float' )."), 
        extensions.get("OES_texture_half_float");
    }, this.supportsStandardDerivatives = function() {
        return console.warn("THREE.WebGLRenderer: .supportsStandardDerivatives() is now .extensions.get( 'OES_standard_derivatives' )."), 
        extensions.get("OES_standard_derivatives");
    }, this.supportsCompressedTextureS3TC = function() {
        return console.warn("THREE.WebGLRenderer: .supportsCompressedTextureS3TC() is now .extensions.get( 'WEBGL_compressed_texture_s3tc' )."), 
        extensions.get("WEBGL_compressed_texture_s3tc");
    }, this.supportsCompressedTexturePVRTC = function() {
        return console.warn("THREE.WebGLRenderer: .supportsCompressedTexturePVRTC() is now .extensions.get( 'WEBGL_compressed_texture_pvrtc' )."), 
        extensions.get("WEBGL_compressed_texture_pvrtc");
    }, this.supportsBlendMinMax = function() {
        return console.warn("THREE.WebGLRenderer: .supportsBlendMinMax() is now .extensions.get( 'EXT_blend_minmax' )."), 
        extensions.get("EXT_blend_minmax");
    }, this.supportsVertexTextures = function() {
        return capabilities.vertexTextures;
    }, this.supportsInstancedArrays = function() {
        return console.warn("THREE.WebGLRenderer: .supportsInstancedArrays() is now .extensions.get( 'ANGLE_instanced_arrays' )."), 
        extensions.get("ANGLE_instanced_arrays");
    }, this.initMaterial = function() {
        console.warn("THREE.WebGLRenderer: .initMaterial() has been removed.");
    }, this.addPrePlugin = function() {
        console.warn("THREE.WebGLRenderer: .addPrePlugin() has been removed.");
    }, this.addPostPlugin = function() {
        console.warn("THREE.WebGLRenderer: .addPostPlugin() has been removed.");
    }, this.updateShadowMap = function() {
        console.warn("THREE.WebGLRenderer: .updateShadowMap() has been removed.");
    }, Object.defineProperties(this, {
        shadowMapEnabled: {
            get: function() {
                return shadowMap.enabled;
            },
            set: function(value) {
                console.warn("THREE.WebGLRenderer: .shadowMapEnabled is now .shadowMap.enabled."), 
                shadowMap.enabled = value;
            }
        },
        shadowMapType: {
            get: function() {
                return shadowMap.type;
            },
            set: function(value) {
                console.warn("THREE.WebGLRenderer: .shadowMapType is now .shadowMap.type."), shadowMap.type = value;
            }
        },
        shadowMapCullFace: {
            get: function() {
                return shadowMap.cullFace;
            },
            set: function(value) {
                console.warn("THREE.WebGLRenderer: .shadowMapCullFace is now .shadowMap.cullFace."), 
                shadowMap.cullFace = value;
            }
        },
        shadowMapDebug: {
            get: function() {
                return shadowMap.debug;
            },
            set: function(value) {
                console.warn("THREE.WebGLRenderer: .shadowMapDebug is now .shadowMap.debug."), shadowMap.debug = value;
            }
        }
    });
}, THREE.WebGLRenderTarget = function(width, height, options) {
    this.uuid = THREE.Math.generateUUID(), this.width = width, this.height = height, 
    options = options || {}, void 0 === options.minFilter && (options.minFilter = THREE.LinearFilter), 
    this.texture = new THREE.Texture(void 0, void 0, options.wrapS, options.wrapT, options.magFilter, options.minFilter, options.format, options.type, options.anisotropy), 
    this.depthBuffer = void 0 !== options.depthBuffer ? options.depthBuffer : !0, this.stencilBuffer = void 0 !== options.stencilBuffer ? options.stencilBuffer : !0, 
    this.shareDepthFrom = void 0 !== options.shareDepthFrom ? options.shareDepthFrom : null;
}, THREE.WebGLRenderTarget.prototype = {
    constructor: THREE.WebGLRenderTarget,
    get wrapS() {
        return console.warn("THREE.WebGLRenderTarget: .wrapS is now .texture.wrapS."), this.texture.wrapS;
    },
    set wrapS(value) {
        console.warn("THREE.WebGLRenderTarget: .wrapS is now .texture.wrapS."), this.texture.wrapS = value;
    },
    get wrapT() {
        return console.warn("THREE.WebGLRenderTarget: .wrapT is now .texture.wrapT."), this.texture.wrapT;
    },
    set wrapT(value) {
        console.warn("THREE.WebGLRenderTarget: .wrapT is now .texture.wrapT."), this.texture.wrapT = value;
    },
    get magFilter() {
        return console.warn("THREE.WebGLRenderTarget: .magFilter is now .texture.magFilter."), 
        this.texture.magFilter;
    },
    set magFilter(value) {
        console.warn("THREE.WebGLRenderTarget: .magFilter is now .texture.magFilter."), 
        this.texture.magFilter = value;
    },
    get minFilter() {
        return console.warn("THREE.WebGLRenderTarget: .minFilter is now .texture.minFilter."), 
        this.texture.minFilter;
    },
    set minFilter(value) {
        console.warn("THREE.WebGLRenderTarget: .minFilter is now .texture.minFilter."), 
        this.texture.minFilter = value;
    },
    get anisotropy() {
        return console.warn("THREE.WebGLRenderTarget: .anisotropy is now .texture.anisotropy."), 
        this.texture.anisotropy;
    },
    set anisotropy(value) {
        console.warn("THREE.WebGLRenderTarget: .anisotropy is now .texture.anisotropy."), 
        this.texture.anisotropy = value;
    },
    get offset() {
        return console.warn("THREE.WebGLRenderTarget: .offset is now .texture.offset."), 
        this.texture.offset;
    },
    set offset(value) {
        console.warn("THREE.WebGLRenderTarget: .offset is now .texture.offset."), this.texture.offset = value;
    },
    get repeat() {
        return console.warn("THREE.WebGLRenderTarget: .repeat is now .texture.repeat."), 
        this.texture.repeat;
    },
    set repeat(value) {
        console.warn("THREE.WebGLRenderTarget: .repeat is now .texture.repeat."), this.texture.repeat = value;
    },
    get format() {
        return console.warn("THREE.WebGLRenderTarget: .format is now .texture.format."), 
        this.texture.format;
    },
    set format(value) {
        console.warn("THREE.WebGLRenderTarget: .format is now .texture.format."), this.texture.format = value;
    },
    get type() {
        return console.warn("THREE.WebGLRenderTarget: .type is now .texture.type."), this.texture.type;
    },
    set type(value) {
        console.warn("THREE.WebGLRenderTarget: .type is now .texture.type."), this.texture.type = value;
    },
    get generateMipmaps() {
        return console.warn("THREE.WebGLRenderTarget: .generateMipmaps is now .texture.generateMipmaps."), 
        this.texture.generateMipmaps;
    },
    set generateMipmaps(value) {
        console.warn("THREE.WebGLRenderTarget: .generateMipmaps is now .texture.generateMipmaps."), 
        this.texture.generateMipmaps = value;
    },
    setSize: function(width, height) {
        (this.width !== width || this.height !== height) && (this.width = width, this.height = height, 
        this.dispose());
    },
    clone: function() {
        return new this.constructor().copy(this);
    },
    copy: function(source) {
        return this.width = source.width, this.height = source.height, this.texture = source.texture.clone(), 
        this.depthBuffer = source.depthBuffer, this.stencilBuffer = source.stencilBuffer, 
        this.shareDepthFrom = source.shareDepthFrom, this;
    },
    dispose: function() {
        this.dispatchEvent({
            type: "dispose"
        });
    }
}, THREE.EventDispatcher.prototype.apply(THREE.WebGLRenderTarget.prototype), THREE.WebGLRenderTargetCube = function(width, height, options) {
    THREE.WebGLRenderTarget.call(this, width, height, options), this.activeCubeFace = 0;
}, THREE.WebGLRenderTargetCube.prototype = Object.create(THREE.WebGLRenderTarget.prototype), 
THREE.WebGLRenderTargetCube.prototype.constructor = THREE.WebGLRenderTargetCube, 
THREE.WebGLBufferRenderer = function(_gl, extensions, _infoRender) {
    function setMode(value) {
        mode = value;
    }
    function render(start, count) {
        _gl.drawArrays(mode, start, count), _infoRender.calls++, _infoRender.vertices += count, 
        mode === _gl.TRIANGLES && (_infoRender.faces += count / 3);
    }
    function renderInstances(geometry) {
        var extension = extensions.get("ANGLE_instanced_arrays");
        if (null === extension) return void console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");
        var position = geometry.attributes.position;
        position instanceof THREE.InterleavedBufferAttribute ? extension.drawArraysInstancedANGLE(mode, 0, position.data.count, geometry.maxInstancedCount) : extension.drawArraysInstancedANGLE(mode, 0, position.count, geometry.maxInstancedCount);
    }
    var mode;
    this.setMode = setMode, this.render = render, this.renderInstances = renderInstances;
}, THREE.WebGLIndexedBufferRenderer = function(_gl, extensions, _infoRender) {
    function setMode(value) {
        mode = value;
    }
    function setIndex(index) {
        index.array instanceof Uint32Array && extensions.get("OES_element_index_uint") ? (type = _gl.UNSIGNED_INT, 
        size = 4) : (type = _gl.UNSIGNED_SHORT, size = 2);
    }
    function render(start, count) {
        _gl.drawElements(mode, count, type, start * size), _infoRender.calls++, _infoRender.vertices += count, 
        mode === _gl.TRIANGLES && (_infoRender.faces += count / 3);
    }
    function renderInstances(geometry) {
        var extension = extensions.get("ANGLE_instanced_arrays");
        if (null === extension) return void console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");
        var index = geometry.index;
        extension.drawElementsInstancedANGLE(mode, index.array.length, type, 0, geometry.maxInstancedCount);
    }
    var mode, type, size;
    this.setMode = setMode, this.setIndex = setIndex, this.render = render, this.renderInstances = renderInstances;
}, THREE.WebGLExtensions = function(gl) {
    var extensions = {};
    this.get = function(name) {
        if (void 0 !== extensions[name]) return extensions[name];
        var extension;
        switch (name) {
          case "EXT_texture_filter_anisotropic":
            extension = gl.getExtension("EXT_texture_filter_anisotropic") || gl.getExtension("MOZ_EXT_texture_filter_anisotropic") || gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
            break;

          case "WEBGL_compressed_texture_s3tc":
            extension = gl.getExtension("WEBGL_compressed_texture_s3tc") || gl.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || gl.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
            break;

          case "WEBGL_compressed_texture_pvrtc":
            extension = gl.getExtension("WEBGL_compressed_texture_pvrtc") || gl.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
            break;

          default:
            extension = gl.getExtension(name);
        }
        return null === extension && console.warn("THREE.WebGLRenderer: " + name + " extension not supported."), 
        extensions[name] = extension, extension;
    };
}, THREE.WebGLCapabilities = function(gl, extensions, parameters) {
    function getMaxPrecision(precision) {
        if ("highp" === precision) {
            if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).precision > 0 && gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision > 0) return "highp";
            precision = "mediump";
        }
        return "mediump" === precision && gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).precision > 0 && gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).precision > 0 ? "mediump" : "lowp";
    }
    this.getMaxPrecision = getMaxPrecision, this.precision = void 0 !== parameters.precision ? parameters.precision : "highp", 
    this.logarithmicDepthBuffer = void 0 !== parameters.logarithmicDepthBuffer ? parameters.logarithmicDepthBuffer : !1, 
    this.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS), this.maxVertexTextures = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS), 
    this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE), this.maxCubemapSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE), 
    this.maxAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS), this.maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS), 
    this.maxVaryings = gl.getParameter(gl.MAX_VARYING_VECTORS), this.maxFragmentUniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS), 
    this.vertexTextures = this.maxVertexTextures > 0, this.floatFragmentTextures = !!extensions.get("OES_texture_float"), 
    this.floatVertexTextures = this.vertexTextures && this.floatFragmentTextures;
    var _maxPrecision = getMaxPrecision(this.precision);
    _maxPrecision !== this.precision && (console.warn("THREE.WebGLRenderer:", this.precision, "not supported, using", _maxPrecision, "instead."), 
    this.precision = _maxPrecision), this.logarithmicDepthBuffer && (this.logarithmicDepthBuffer = !!extensions.get("EXT_frag_depth"));
}, THREE.WebGLGeometries = function(gl, properties, info) {
    function get(object) {
        var geometry = object.geometry;
        if (void 0 !== geometries[geometry.id]) return geometries[geometry.id];
        geometry.addEventListener("dispose", onGeometryDispose);
        var buffergeometry;
        return geometry instanceof THREE.BufferGeometry ? buffergeometry = geometry : geometry instanceof THREE.Geometry && (void 0 === geometry._bufferGeometry && (geometry._bufferGeometry = new THREE.BufferGeometry().setFromObject(object)), 
        buffergeometry = geometry._bufferGeometry), geometries[geometry.id] = buffergeometry, 
        info.memory.geometries++, buffergeometry;
    }
    function onGeometryDispose(event) {
        var geometry = event.target, buffergeometry = geometries[geometry.id];
        deleteAttributes(buffergeometry.attributes), geometry.removeEventListener("dispose", onGeometryDispose), 
        delete geometries[geometry.id];
        var property = properties.get(geometry);
        property.wireframe && deleteAttribute(property.wireframe), info.memory.geometries--;
    }
    function getAttributeBuffer(attribute) {
        return attribute instanceof THREE.InterleavedBufferAttribute ? properties.get(attribute.data).__webglBuffer : properties.get(attribute).__webglBuffer;
    }
    function deleteAttribute(attribute) {
        var buffer = getAttributeBuffer(attribute);
        void 0 !== buffer && (gl.deleteBuffer(buffer), removeAttributeBuffer(attribute));
    }
    function deleteAttributes(attributes) {
        for (var name in attributes) deleteAttribute(attributes[name]);
    }
    function removeAttributeBuffer(attribute) {
        attribute instanceof THREE.InterleavedBufferAttribute ? properties["delete"](attribute.data) : properties["delete"](attribute);
    }
    var geometries = {};
    this.get = get;
}, THREE.WebGLObjects = function(gl, properties, info) {
    function update(object) {
        var geometry = geometries.get(object);
        object.geometry instanceof THREE.Geometry && geometry.updateFromObject(object);
        var index = geometry.index, attributes = geometry.attributes;
        null !== index && updateAttribute(index, gl.ELEMENT_ARRAY_BUFFER);
        for (var name in attributes) updateAttribute(attributes[name], gl.ARRAY_BUFFER);
        var morphAttributes = geometry.morphAttributes;
        for (var name in morphAttributes) for (var array = morphAttributes[name], i = 0, l = array.length; l > i; i++) updateAttribute(array[i], gl.ARRAY_BUFFER);
        return geometry;
    }
    function updateAttribute(attribute, bufferType) {
        var data = attribute instanceof THREE.InterleavedBufferAttribute ? attribute.data : attribute, attributeProperties = properties.get(data);
        void 0 === attributeProperties.__webglBuffer ? createBuffer(attributeProperties, data, bufferType) : attributeProperties.version !== data.version && updateBuffer(attributeProperties, data, bufferType);
    }
    function createBuffer(attributeProperties, data, bufferType) {
        attributeProperties.__webglBuffer = gl.createBuffer(), gl.bindBuffer(bufferType, attributeProperties.__webglBuffer);
        var usage = data.dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
        gl.bufferData(bufferType, data.array, usage), attributeProperties.version = data.version;
    }
    function updateBuffer(attributeProperties, data, bufferType) {
        gl.bindBuffer(bufferType, attributeProperties.__webglBuffer), data.dynamic === !1 || -1 === data.updateRange.count ? gl.bufferSubData(bufferType, 0, data.array) : 0 === data.updateRange.count ? console.error("THREE.WebGLObjects.updateBuffer: dynamic THREE.BufferAttribute marked as needsUpdate but updateRange.count is 0, ensure you are using set methods or updating manually.") : (gl.bufferSubData(bufferType, data.updateRange.offset * data.array.BYTES_PER_ELEMENT, data.array.subarray(data.updateRange.offset, data.updateRange.offset + data.updateRange.count)), 
        data.updateRange.count = 0), attributeProperties.version = data.version;
    }
    function getAttributeBuffer(attribute) {
        return attribute instanceof THREE.InterleavedBufferAttribute ? properties.get(attribute.data).__webglBuffer : properties.get(attribute).__webglBuffer;
    }
    function getWireframeAttribute(geometry) {
        var property = properties.get(geometry);
        if (void 0 !== property.wireframe) return property.wireframe;
        var indices = [], index = geometry.index, attributes = geometry.attributes, position = attributes.position;
        if (null !== index) for (var edges = {}, array = index.array, i = 0, l = array.length; l > i; i += 3) {
            var a = array[i + 0], b = array[i + 1], c = array[i + 2];
            checkEdge(edges, a, b) && indices.push(a, b), checkEdge(edges, b, c) && indices.push(b, c), 
            checkEdge(edges, c, a) && indices.push(c, a);
        } else for (var array = attributes.position.array, i = 0, l = array.length / 3 - 1; l > i; i += 3) {
            var a = i + 0, b = i + 1, c = i + 2;
            indices.push(a, b, b, c, c, a);
        }
        var TypeArray = position.count > 65535 ? Uint32Array : Uint16Array, attribute = new THREE.BufferAttribute(new TypeArray(indices), 1);
        return updateAttribute(attribute, gl.ELEMENT_ARRAY_BUFFER), property.wireframe = attribute, 
        attribute;
    }
    function checkEdge(edges, a, b) {
        if (a > b) {
            var tmp = a;
            a = b, b = tmp;
        }
        var list = edges[a];
        return void 0 === list ? (edges[a] = [ b ], !0) : -1 === list.indexOf(b) ? (list.push(b), 
        !0) : !1;
    }
    var geometries = new THREE.WebGLGeometries(gl, properties, info);
    this.getAttributeBuffer = getAttributeBuffer, this.getWireframeAttribute = getWireframeAttribute, 
    this.update = update;
}, THREE.WebGLProgram = function() {
    function generateDefines(defines) {
        var chunks = [];
        for (var name in defines) {
            var value = defines[name];
            value !== !1 && chunks.push("#define " + name + " " + value);
        }
        return chunks.join("\n");
    }
    function fetchUniformLocations(gl, program, identifiers) {
        for (var uniforms = {}, n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS), i = 0; n > i; i++) {
            var info = gl.getActiveUniform(program, i), name = info.name, location = gl.getUniformLocation(program, name), suffixPos = name.lastIndexOf("[0]");
            -1 !== suffixPos && suffixPos === name.length - 3 && (uniforms[name.substr(0, suffixPos)] = location), 
            uniforms[name] = location;
        }
        return uniforms;
    }
    function fetchAttributeLocations(gl, program, identifiers) {
        for (var attributes = {}, n = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES), i = 0; n > i; i++) {
            var info = gl.getActiveAttrib(program, i), name = info.name;
            attributes[name] = gl.getAttribLocation(program, name);
        }
        return attributes;
    }
    function filterEmptyLine(string) {
        return "" !== string;
    }
    var programIdCount = 0;
    return function(renderer, code, material, parameters) {
        var gl = renderer.context, defines = material.defines, vertexShader = material.__webglShader.vertexShader, fragmentShader = material.__webglShader.fragmentShader, shadowMapTypeDefine = "SHADOWMAP_TYPE_BASIC";
        parameters.shadowMapType === THREE.PCFShadowMap ? shadowMapTypeDefine = "SHADOWMAP_TYPE_PCF" : parameters.shadowMapType === THREE.PCFSoftShadowMap && (shadowMapTypeDefine = "SHADOWMAP_TYPE_PCF_SOFT");
        var envMapTypeDefine = "ENVMAP_TYPE_CUBE", envMapModeDefine = "ENVMAP_MODE_REFLECTION", envMapBlendingDefine = "ENVMAP_BLENDING_MULTIPLY";
        if (parameters.envMap) {
            switch (material.envMap.mapping) {
              case THREE.CubeReflectionMapping:
              case THREE.CubeRefractionMapping:
                envMapTypeDefine = "ENVMAP_TYPE_CUBE";
                break;

              case THREE.EquirectangularReflectionMapping:
              case THREE.EquirectangularRefractionMapping:
                envMapTypeDefine = "ENVMAP_TYPE_EQUIREC";
                break;

              case THREE.SphericalReflectionMapping:
                envMapTypeDefine = "ENVMAP_TYPE_SPHERE";
            }
            switch (material.envMap.mapping) {
              case THREE.CubeRefractionMapping:
              case THREE.EquirectangularRefractionMapping:
                envMapModeDefine = "ENVMAP_MODE_REFRACTION";
            }
            switch (material.combine) {
              case THREE.MultiplyOperation:
                envMapBlendingDefine = "ENVMAP_BLENDING_MULTIPLY";
                break;

              case THREE.MixOperation:
                envMapBlendingDefine = "ENVMAP_BLENDING_MIX";
                break;

              case THREE.AddOperation:
                envMapBlendingDefine = "ENVMAP_BLENDING_ADD";
            }
        }
        var prefixVertex, prefixFragment, gammaFactorDefine = renderer.gammaFactor > 0 ? renderer.gammaFactor : 1, customDefines = generateDefines(defines), program = gl.createProgram();
        material instanceof THREE.RawShaderMaterial ? (prefixVertex = "", prefixFragment = "") : (prefixVertex = [ "precision " + parameters.precision + " float;", "precision " + parameters.precision + " int;", "#define SHADER_NAME " + material.__webglShader.name, customDefines, parameters.supportsVertexTextures ? "#define VERTEX_TEXTURES" : "", renderer.gammaInput ? "#define GAMMA_INPUT" : "", renderer.gammaOutput ? "#define GAMMA_OUTPUT" : "", "#define GAMMA_FACTOR " + gammaFactorDefine, "#define MAX_DIR_LIGHTS " + parameters.maxDirLights, "#define MAX_POINT_LIGHTS " + parameters.maxPointLights, "#define MAX_SPOT_LIGHTS " + parameters.maxSpotLights, "#define MAX_HEMI_LIGHTS " + parameters.maxHemiLights, "#define MAX_SHADOWS " + parameters.maxShadows, "#define MAX_BONES " + parameters.maxBones, parameters.map ? "#define USE_MAP" : "", parameters.envMap ? "#define USE_ENVMAP" : "", parameters.envMap ? "#define " + envMapModeDefine : "", parameters.lightMap ? "#define USE_LIGHTMAP" : "", parameters.aoMap ? "#define USE_AOMAP" : "", parameters.emissiveMap ? "#define USE_EMISSIVEMAP" : "", parameters.bumpMap ? "#define USE_BUMPMAP" : "", parameters.normalMap ? "#define USE_NORMALMAP" : "", parameters.displacementMap && parameters.supportsVertexTextures ? "#define USE_DISPLACEMENTMAP" : "", parameters.specularMap ? "#define USE_SPECULARMAP" : "", parameters.alphaMap ? "#define USE_ALPHAMAP" : "", parameters.vertexColors ? "#define USE_COLOR" : "", parameters.flatShading ? "#define FLAT_SHADED" : "", parameters.skinning ? "#define USE_SKINNING" : "", parameters.useVertexTexture ? "#define BONE_TEXTURE" : "", parameters.morphTargets ? "#define USE_MORPHTARGETS" : "", parameters.morphNormals && parameters.flatShading === !1 ? "#define USE_MORPHNORMALS" : "", parameters.doubleSided ? "#define DOUBLE_SIDED" : "", parameters.flipSided ? "#define FLIP_SIDED" : "", parameters.shadowMapEnabled ? "#define USE_SHADOWMAP" : "", parameters.shadowMapEnabled ? "#define " + shadowMapTypeDefine : "", parameters.shadowMapDebug ? "#define SHADOWMAP_DEBUG" : "", parameters.pointLightShadows > 0 ? "#define POINT_LIGHT_SHADOWS" : "", parameters.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "", parameters.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "", parameters.logarithmicDepthBuffer && renderer.extensions.get("EXT_frag_depth") ? "#define USE_LOGDEPTHBUF_EXT" : "", "uniform mat4 modelMatrix;", "uniform mat4 modelViewMatrix;", "uniform mat4 projectionMatrix;", "uniform mat4 viewMatrix;", "uniform mat3 normalMatrix;", "uniform vec3 cameraPosition;", "attribute vec3 position;", "attribute vec3 normal;", "attribute vec2 uv;", "#ifdef USE_COLOR", "	attribute vec3 color;", "#endif", "#ifdef USE_MORPHTARGETS", "	attribute vec3 morphTarget0;", "	attribute vec3 morphTarget1;", "	attribute vec3 morphTarget2;", "	attribute vec3 morphTarget3;", "	#ifdef USE_MORPHNORMALS", "		attribute vec3 morphNormal0;", "		attribute vec3 morphNormal1;", "		attribute vec3 morphNormal2;", "		attribute vec3 morphNormal3;", "	#else", "		attribute vec3 morphTarget4;", "		attribute vec3 morphTarget5;", "		attribute vec3 morphTarget6;", "		attribute vec3 morphTarget7;", "	#endif", "#endif", "#ifdef USE_SKINNING", "	attribute vec4 skinIndex;", "	attribute vec4 skinWeight;", "#endif", "\n" ].filter(filterEmptyLine).join("\n"), 
        prefixFragment = [ parameters.bumpMap || parameters.normalMap || parameters.flatShading || material.derivatives ? "#extension GL_OES_standard_derivatives : enable" : "", parameters.logarithmicDepthBuffer && renderer.extensions.get("EXT_frag_depth") ? "#extension GL_EXT_frag_depth : enable" : "", "precision " + parameters.precision + " float;", "precision " + parameters.precision + " int;", "#define SHADER_NAME " + material.__webglShader.name, customDefines, "#define MAX_DIR_LIGHTS " + parameters.maxDirLights, "#define MAX_POINT_LIGHTS " + parameters.maxPointLights, "#define MAX_SPOT_LIGHTS " + parameters.maxSpotLights, "#define MAX_HEMI_LIGHTS " + parameters.maxHemiLights, "#define MAX_SHADOWS " + parameters.maxShadows, parameters.alphaTest ? "#define ALPHATEST " + parameters.alphaTest : "", renderer.gammaInput ? "#define GAMMA_INPUT" : "", renderer.gammaOutput ? "#define GAMMA_OUTPUT" : "", "#define GAMMA_FACTOR " + gammaFactorDefine, parameters.useFog && parameters.fog ? "#define USE_FOG" : "", parameters.useFog && parameters.fogExp ? "#define FOG_EXP2" : "", parameters.map ? "#define USE_MAP" : "", parameters.envMap ? "#define USE_ENVMAP" : "", parameters.envMap ? "#define " + envMapTypeDefine : "", parameters.envMap ? "#define " + envMapModeDefine : "", parameters.envMap ? "#define " + envMapBlendingDefine : "", parameters.lightMap ? "#define USE_LIGHTMAP" : "", parameters.aoMap ? "#define USE_AOMAP" : "", parameters.emissiveMap ? "#define USE_EMISSIVEMAP" : "", parameters.bumpMap ? "#define USE_BUMPMAP" : "", parameters.normalMap ? "#define USE_NORMALMAP" : "", parameters.specularMap ? "#define USE_SPECULARMAP" : "", parameters.alphaMap ? "#define USE_ALPHAMAP" : "", parameters.vertexColors ? "#define USE_COLOR" : "", parameters.flatShading ? "#define FLAT_SHADED" : "", parameters.metal ? "#define METAL" : "", parameters.doubleSided ? "#define DOUBLE_SIDED" : "", parameters.flipSided ? "#define FLIP_SIDED" : "", parameters.shadowMapEnabled ? "#define USE_SHADOWMAP" : "", parameters.shadowMapEnabled ? "#define " + shadowMapTypeDefine : "", parameters.shadowMapDebug ? "#define SHADOWMAP_DEBUG" : "", parameters.pointLightShadows > 0 ? "#define POINT_LIGHT_SHADOWS" : "", parameters.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "", parameters.logarithmicDepthBuffer && renderer.extensions.get("EXT_frag_depth") ? "#define USE_LOGDEPTHBUF_EXT" : "", "uniform mat4 viewMatrix;", "uniform vec3 cameraPosition;", "\n" ].filter(filterEmptyLine).join("\n"));
        var vertexGlsl = prefixVertex + vertexShader, fragmentGlsl = prefixFragment + fragmentShader, glVertexShader = THREE.WebGLShader(gl, gl.VERTEX_SHADER, vertexGlsl), glFragmentShader = THREE.WebGLShader(gl, gl.FRAGMENT_SHADER, fragmentGlsl);
        gl.attachShader(program, glVertexShader), gl.attachShader(program, glFragmentShader), 
        void 0 !== material.index0AttributeName ? gl.bindAttribLocation(program, 0, material.index0AttributeName) : parameters.morphTargets === !0 && gl.bindAttribLocation(program, 0, "position"), 
        gl.linkProgram(program);
        var programLog = gl.getProgramInfoLog(program), vertexLog = gl.getShaderInfoLog(glVertexShader), fragmentLog = gl.getShaderInfoLog(glFragmentShader), runnable = !0, haveDiagnostics = !0;
        gl.getProgramParameter(program, gl.LINK_STATUS) === !1 ? (runnable = !1, console.error("THREE.WebGLProgram: shader error: ", gl.getError(), "gl.VALIDATE_STATUS", gl.getProgramParameter(program, gl.VALIDATE_STATUS), "gl.getProgramInfoLog", programLog, vertexLog, fragmentLog)) : "" !== programLog ? console.warn("THREE.WebGLProgram: gl.getProgramInfoLog()", programLog) : ("" === vertexLog || "" === fragmentLog) && (haveDiagnostics = !1), 
        haveDiagnostics && (this.diagnostics = {
            runnable: runnable,
            material: material,
            programLog: programLog,
            vertexShader: {
                log: vertexLog,
                prefix: prefixVertex
            },
            fragmentShader: {
                log: fragmentLog,
                prefix: prefixFragment
            }
        }), gl.deleteShader(glVertexShader), gl.deleteShader(glFragmentShader);
        var cachedUniforms;
        this.getUniforms = function() {
            return void 0 === cachedUniforms && (cachedUniforms = fetchUniformLocations(gl, program)), 
            cachedUniforms;
        };
        var cachedAttributes;
        return this.getAttributes = function() {
            return void 0 === cachedAttributes && (cachedAttributes = fetchAttributeLocations(gl, program)), 
            cachedAttributes;
        }, this.destroy = function() {
            gl.deleteProgram(program), this.program = void 0;
        }, Object.defineProperties(this, {
            uniforms: {
                get: function() {
                    return console.warn("THREE.WebGLProgram: .uniforms is now .getUniforms()."), this.getUniforms();
                }
            },
            attributes: {
                get: function() {
                    return console.warn("THREE.WebGLProgram: .attributes is now .getAttributes()."), 
                    this.getAttributes();
                }
            }
        }), this.id = programIdCount++, this.code = code, this.usedTimes = 1, this.program = program, 
        this.vertexShader = glVertexShader, this.fragmentShader = glFragmentShader, this;
    };
}(), THREE.WebGLPrograms = function(renderer, capabilities) {
    function allocateBones(object) {
        if (capabilities.floatVertexTextures && object && object.skeleton && object.skeleton.useVertexTexture) return 1024;
        var nVertexUniforms = capabilities.maxVertexUniforms, nVertexMatrices = Math.floor((nVertexUniforms - 20) / 4), maxBones = nVertexMatrices;
        return void 0 !== object && object instanceof THREE.SkinnedMesh && (maxBones = Math.min(object.skeleton.bones.length, maxBones), 
        maxBones < object.skeleton.bones.length && console.warn("WebGLRenderer: too many bones - " + object.skeleton.bones.length + ", this GPU supports just " + maxBones + " (try OpenGL instead of ANGLE)")), 
        maxBones;
    }
    function allocateLights(lights) {
        for (var dirLights = 0, pointLights = 0, spotLights = 0, hemiLights = 0, l = 0, ll = lights.length; ll > l; l++) {
            var light = lights[l];
            light.visible !== !1 && (light instanceof THREE.DirectionalLight && dirLights++, 
            light instanceof THREE.PointLight && pointLights++, light instanceof THREE.SpotLight && spotLights++, 
            light instanceof THREE.HemisphereLight && hemiLights++);
        }
        return {
            directional: dirLights,
            point: pointLights,
            spot: spotLights,
            hemi: hemiLights
        };
    }
    function allocateShadows(lights) {
        for (var maxShadows = 0, pointLightShadows = 0, l = 0, ll = lights.length; ll > l; l++) {
            var light = lights[l];
            light.castShadow && ((light instanceof THREE.SpotLight || light instanceof THREE.DirectionalLight) && maxShadows++, 
            light instanceof THREE.PointLight && (maxShadows++, pointLightShadows++));
        }
        return {
            maxShadows: maxShadows,
            pointLightShadows: pointLightShadows
        };
    }
    var programs = [], shaderIDs = {
        MeshDepthMaterial: "depth",
        MeshNormalMaterial: "normal",
        MeshBasicMaterial: "basic",
        MeshLambertMaterial: "lambert",
        MeshPhongMaterial: "phong",
        LineBasicMaterial: "basic",
        LineDashedMaterial: "dashed",
        PointsMaterial: "points"
    }, parameterNames = [ "precision", "supportsVertexTextures", "map", "envMap", "envMapMode", "lightMap", "aoMap", "emissiveMap", "bumpMap", "normalMap", "displacementMap", "specularMap", "alphaMap", "combine", "vertexColors", "fog", "useFog", "fogExp", "flatShading", "sizeAttenuation", "logarithmicDepthBuffer", "skinning", "maxBones", "useVertexTexture", "morphTargets", "morphNormals", "maxMorphTargets", "maxMorphNormals", "maxDirLights", "maxPointLights", "maxSpotLights", "maxHemiLights", "maxShadows", "shadowMapEnabled", "pointLightShadows", "shadowMapType", "shadowMapDebug", "alphaTest", "metal", "doubleSided", "flipSided" ];
    this.getParameters = function(material, lights, fog, object) {
        var shaderID = shaderIDs[material.type], maxLightCount = allocateLights(lights), allocatedShadows = allocateShadows(lights), maxBones = allocateBones(object), precision = renderer.getPrecision();
        null !== material.precision && (precision = capabilities.getMaxPrecision(material.precision), 
        precision !== material.precision && console.warn("THREE.WebGLRenderer.initMaterial:", material.precision, "not supported, using", precision, "instead."));
        var parameters = {
            shaderID: shaderID,
            precision: precision,
            supportsVertexTextures: capabilities.vertexTextures,
            map: !!material.map,
            envMap: !!material.envMap,
            envMapMode: material.envMap && material.envMap.mapping,
            lightMap: !!material.lightMap,
            aoMap: !!material.aoMap,
            emissiveMap: !!material.emissiveMap,
            bumpMap: !!material.bumpMap,
            normalMap: !!material.normalMap,
            displacementMap: !!material.displacementMap,
            specularMap: !!material.specularMap,
            alphaMap: !!material.alphaMap,
            combine: material.combine,
            vertexColors: material.vertexColors,
            fog: fog,
            useFog: material.fog,
            fogExp: fog instanceof THREE.FogExp2,
            flatShading: material.shading === THREE.FlatShading,
            sizeAttenuation: material.sizeAttenuation,
            logarithmicDepthBuffer: capabilities.logarithmicDepthBuffer,
            skinning: material.skinning,
            maxBones: maxBones,
            useVertexTexture: capabilities.floatVertexTextures && object && object.skeleton && object.skeleton.useVertexTexture,
            morphTargets: material.morphTargets,
            morphNormals: material.morphNormals,
            maxMorphTargets: renderer.maxMorphTargets,
            maxMorphNormals: renderer.maxMorphNormals,
            maxDirLights: maxLightCount.directional,
            maxPointLights: maxLightCount.point,
            maxSpotLights: maxLightCount.spot,
            maxHemiLights: maxLightCount.hemi,
            maxShadows: allocatedShadows.maxShadows,
            pointLightShadows: allocatedShadows.pointLightShadows,
            shadowMapEnabled: renderer.shadowMap.enabled && object.receiveShadow && allocatedShadows.maxShadows > 0,
            shadowMapType: renderer.shadowMap.type,
            shadowMapDebug: renderer.shadowMap.debug,
            alphaTest: material.alphaTest,
            metal: material.metal,
            doubleSided: material.side === THREE.DoubleSide,
            flipSided: material.side === THREE.BackSide
        };
        return parameters;
    }, this.getProgramCode = function(material, parameters) {
        var chunks = [];
        if (parameters.shaderID ? chunks.push(parameters.shaderID) : (chunks.push(material.fragmentShader), 
        chunks.push(material.vertexShader)), void 0 !== material.defines) for (var name in material.defines) chunks.push(name), 
        chunks.push(material.defines[name]);
        for (var i = 0; i < parameterNames.length; i++) {
            var parameterName = parameterNames[i];
            chunks.push(parameterName), chunks.push(parameters[parameterName]);
        }
        return chunks.join();
    }, this.acquireProgram = function(material, parameters, code) {
        for (var program, p = 0, pl = programs.length; pl > p; p++) {
            var programInfo = programs[p];
            if (programInfo.code === code) {
                program = programInfo, ++program.usedTimes;
                break;
            }
        }
        return void 0 === program && (program = new THREE.WebGLProgram(renderer, code, material, parameters), 
        programs.push(program)), program;
    }, this.releaseProgram = function(program) {
        if (0 === --program.usedTimes) {
            var i = programs.indexOf(program);
            programs[i] = programs[programs.length - 1], programs.pop(), program.destroy();
        }
    }, this.programs = programs;
}, THREE.WebGLProperties = function() {
    var properties = {};
    this.get = function(object) {
        var uuid = object.uuid, map = properties[uuid];
        return void 0 === map && (map = {}, properties[uuid] = map), map;
    }, this["delete"] = function(object) {
        delete properties[object.uuid];
    }, this.clear = function() {
        properties = {};
    };
}, THREE.WebGLShader = function() {
    function addLineNumbers(string) {
        for (var lines = string.split("\n"), i = 0; i < lines.length; i++) lines[i] = i + 1 + ": " + lines[i];
        return lines.join("\n");
    }
    return function(gl, type, string) {
        var shader = gl.createShader(type);
        return gl.shaderSource(shader, string), gl.compileShader(shader), gl.getShaderParameter(shader, gl.COMPILE_STATUS) === !1 && console.error("THREE.WebGLShader: Shader couldn't compile."), 
        "" !== gl.getShaderInfoLog(shader) && console.warn("THREE.WebGLShader: gl.getShaderInfoLog()", type === gl.VERTEX_SHADER ? "vertex" : "fragment", gl.getShaderInfoLog(shader), addLineNumbers(string)), 
        shader;
    };
}(), THREE.WebGLShadowMap = function(_renderer, _lights, _objects) {
    function getDepthMaterial(object, material, isPointLight, lightPositionWorld) {
        var geometry = object.geometry, newMaterial = null, materialVariants = _depthMaterials, customMaterial = object.customDepthMaterial;
        if (isPointLight && (materialVariants = _distanceMaterials, customMaterial = object.customDistanceMaterial), 
        customMaterial) newMaterial = customMaterial; else {
            var useMorphing = void 0 !== geometry.morphTargets && geometry.morphTargets.length > 0 && material.morphTargets, useSkinning = object instanceof THREE.SkinnedMesh && material.skinning, variantIndex = 0;
            useMorphing && (variantIndex |= _MorphingFlag), useSkinning && (variantIndex |= _SkinningFlag), 
            newMaterial = materialVariants[variantIndex];
        }
        return newMaterial.visible = material.visible, newMaterial.wireframe = material.wireframe, 
        newMaterial.wireframeLinewidth = material.wireframeLinewidth, isPointLight && void 0 !== newMaterial.uniforms.lightPos && newMaterial.uniforms.lightPos.value.copy(lightPositionWorld), 
        newMaterial;
    }
    function projectObject(object, camera) {
        if (object.visible !== !1) {
            if ((object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) && object.castShadow && (object.frustumCulled === !1 || _frustum.intersectsObject(object) === !0)) {
                var material = object.material;
                material.visible === !0 && (object.modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, object.matrixWorld), 
                _renderList.push(object));
            }
            for (var children = object.children, i = 0, l = children.length; l > i; i++) projectObject(children[i], camera);
        }
    }
    for (var _gl = _renderer.context, _state = _renderer.state, _frustum = new THREE.Frustum(), _projScreenMatrix = new THREE.Matrix4(), _lookTarget = (new THREE.Vector3(), 
    new THREE.Vector3(), new THREE.Vector3()), _lightPositionWorld = new THREE.Vector3(), _renderList = [], _MorphingFlag = 1, _SkinningFlag = 2, _NumberOfMaterialVariants = (_MorphingFlag | _SkinningFlag) + 1, _depthMaterials = new Array(_NumberOfMaterialVariants), _distanceMaterials = new Array(_NumberOfMaterialVariants), cubeDirections = [ new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0) ], cubeUps = [ new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1) ], cube2DViewPorts = [ new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4() ], _vector4 = new THREE.Vector4(), depthShader = THREE.ShaderLib.depthRGBA, depthUniforms = THREE.UniformsUtils.clone(depthShader.uniforms), distanceShader = THREE.ShaderLib.distanceRGBA, distanceUniforms = THREE.UniformsUtils.clone(distanceShader.uniforms), i = 0; i !== _NumberOfMaterialVariants; ++i) {
        var useMorphing = 0 !== (i & _MorphingFlag), useSkinning = 0 !== (i & _SkinningFlag), depthMaterial = new THREE.ShaderMaterial({
            uniforms: depthUniforms,
            vertexShader: depthShader.vertexShader,
            fragmentShader: depthShader.fragmentShader,
            morphTargets: useMorphing,
            skinning: useSkinning
        });
        depthMaterial._shadowPass = !0, _depthMaterials[i] = depthMaterial;
        var distanceMaterial = new THREE.ShaderMaterial({
            uniforms: distanceUniforms,
            vertexShader: distanceShader.vertexShader,
            fragmentShader: distanceShader.fragmentShader,
            morphTargets: useMorphing,
            skinning: useSkinning
        });
        distanceMaterial._shadowPass = !0, _distanceMaterials[i] = distanceMaterial;
    }
    var scope = this;
    this.enabled = !1, this.autoUpdate = !0, this.needsUpdate = !1, this.type = THREE.PCFShadowMap, 
    this.cullFace = THREE.CullFaceFront, this.render = function(scene) {
        var faceCount, isPointLight;
        if (scope.enabled !== !1 && (scope.autoUpdate !== !1 || scope.needsUpdate !== !1)) {
            _gl.clearColor(1, 1, 1, 1), _state.disable(_gl.BLEND), _state.enable(_gl.CULL_FACE), 
            _gl.frontFace(_gl.CCW), _gl.cullFace(scope.cullFace === THREE.CullFaceFront ? _gl.FRONT : _gl.BACK), 
            _state.setDepthTest(!0), _renderer.getViewport(_vector4);
            for (var i = 0, il = _lights.length; il > i; i++) {
                var light = _lights[i];
                if (light.castShadow === !0) {
                    var shadow = light.shadow, shadowCamera = shadow.camera, shadowMapSize = shadow.mapSize;
                    if (light instanceof THREE.PointLight) {
                        faceCount = 6, isPointLight = !0;
                        var vpWidth = shadowMapSize.x / 4, vpHeight = shadowMapSize.y / 2;
                        cube2DViewPorts[0].set(2 * vpWidth, vpHeight, vpWidth, vpHeight), cube2DViewPorts[1].set(0, vpHeight, vpWidth, vpHeight), 
                        cube2DViewPorts[2].set(3 * vpWidth, vpHeight, vpWidth, vpHeight), cube2DViewPorts[3].set(vpWidth, vpHeight, vpWidth, vpHeight), 
                        cube2DViewPorts[4].set(3 * vpWidth, 0, vpWidth, vpHeight), cube2DViewPorts[5].set(vpWidth, 0, vpWidth, vpHeight);
                    } else faceCount = 1, isPointLight = !1;
                    if (null === shadow.map) {
                        var shadowFilter = THREE.LinearFilter;
                        scope.type === THREE.PCFSoftShadowMap && (shadowFilter = THREE.NearestFilter);
                        var pars = {
                            minFilter: shadowFilter,
                            magFilter: shadowFilter,
                            format: THREE.RGBAFormat
                        };
                        shadow.map = new THREE.WebGLRenderTarget(shadowMapSize.x, shadowMapSize.y, pars), 
                        shadow.matrix = new THREE.Matrix4(), light instanceof THREE.SpotLight && (shadowCamera.aspect = shadowMapSize.x / shadowMapSize.y), 
                        shadowCamera.updateProjectionMatrix();
                    }
                    var shadowMap = shadow.map, shadowMatrix = shadow.matrix;
                    _lightPositionWorld.setFromMatrixPosition(light.matrixWorld), shadowCamera.position.copy(_lightPositionWorld), 
                    _renderer.setRenderTarget(shadowMap), _renderer.clear();
                    for (var face = 0; faceCount > face; face++) {
                        if (isPointLight) {
                            _lookTarget.copy(shadowCamera.position), _lookTarget.add(cubeDirections[face]), 
                            shadowCamera.up.copy(cubeUps[face]), shadowCamera.lookAt(_lookTarget);
                            var vpDimensions = cube2DViewPorts[face];
                            _renderer.setViewport(vpDimensions.x, vpDimensions.y, vpDimensions.z, vpDimensions.w);
                        } else _lookTarget.setFromMatrixPosition(light.target.matrixWorld), shadowCamera.lookAt(_lookTarget);
                        shadowCamera.updateMatrixWorld(), shadowCamera.matrixWorldInverse.getInverse(shadowCamera.matrixWorld), 
                        shadowMatrix.set(.5, 0, 0, .5, 0, .5, 0, .5, 0, 0, .5, .5, 0, 0, 0, 1), shadowMatrix.multiply(shadowCamera.projectionMatrix), 
                        shadowMatrix.multiply(shadowCamera.matrixWorldInverse), _projScreenMatrix.multiplyMatrices(shadowCamera.projectionMatrix, shadowCamera.matrixWorldInverse), 
                        _frustum.setFromMatrix(_projScreenMatrix), _renderList.length = 0, projectObject(scene, shadowCamera);
                        for (var j = 0, jl = _renderList.length; jl > j; j++) {
                            var object = _renderList[j], geometry = _objects.update(object), material = object.material;
                            if (material instanceof THREE.MeshFaceMaterial) for (var groups = geometry.groups, materials = material.materials, k = 0, kl = groups.length; kl > k; k++) {
                                var group = groups[k], groupMaterial = materials[group.materialIndex];
                                if (groupMaterial.visible === !0) {
                                    var depthMaterial = getDepthMaterial(object, groupMaterial, isPointLight, _lightPositionWorld);
                                    _renderer.renderBufferDirect(shadowCamera, _lights, null, geometry, depthMaterial, object, group);
                                }
                            } else {
                                var depthMaterial = getDepthMaterial(object, material, isPointLight, _lightPositionWorld);
                                _renderer.renderBufferDirect(shadowCamera, _lights, null, geometry, depthMaterial, object, null);
                            }
                        }
                    }
                    _renderer.resetGLState();
                }
            }
            _renderer.setViewport(_vector4.x, _vector4.y, _vector4.z, _vector4.w);
            var clearColor = _renderer.getClearColor(), clearAlpha = _renderer.getClearAlpha();
            _renderer.setClearColor(clearColor, clearAlpha), _state.enable(_gl.BLEND), scope.cullFace === THREE.CullFaceFront && _gl.cullFace(_gl.BACK), 
            _renderer.resetGLState(), scope.needsUpdate = !1;
        }
    };
}, THREE.WebGLState = function(gl, extensions, paramThreeToGL) {
    var _this = this, newAttributes = new Uint8Array(16), enabledAttributes = new Uint8Array(16), attributeDivisors = new Uint8Array(16), capabilities = {}, compressedTextureFormats = null, currentBlending = null, currentBlendEquation = null, currentBlendSrc = null, currentBlendDst = null, currentBlendEquationAlpha = null, currentBlendSrcAlpha = null, currentBlendDstAlpha = null, currentDepthFunc = null, currentDepthWrite = null, currentColorWrite = null, currentFlipSided = null, currentLineWidth = null, currentPolygonOffsetFactor = null, currentPolygonOffsetUnits = null, maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS), currentTextureSlot = void 0, currentBoundTextures = {};
    this.init = function() {
        gl.clearColor(0, 0, 0, 1), gl.clearDepth(1), gl.clearStencil(0), this.enable(gl.DEPTH_TEST), 
        gl.depthFunc(gl.LEQUAL), gl.frontFace(gl.CCW), gl.cullFace(gl.BACK), this.enable(gl.CULL_FACE), 
        this.enable(gl.BLEND), gl.blendEquation(gl.FUNC_ADD), gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }, this.initAttributes = function() {
        for (var i = 0, l = newAttributes.length; l > i; i++) newAttributes[i] = 0;
    }, this.enableAttribute = function(attribute) {
        if (newAttributes[attribute] = 1, 0 === enabledAttributes[attribute] && (gl.enableVertexAttribArray(attribute), 
        enabledAttributes[attribute] = 1), 0 !== attributeDivisors[attribute]) {
            var extension = extensions.get("ANGLE_instanced_arrays");
            extension.vertexAttribDivisorANGLE(attribute, 0), attributeDivisors[attribute] = 0;
        }
    }, this.enableAttributeAndDivisor = function(attribute, meshPerAttribute, extension) {
        newAttributes[attribute] = 1, 0 === enabledAttributes[attribute] && (gl.enableVertexAttribArray(attribute), 
        enabledAttributes[attribute] = 1), attributeDivisors[attribute] !== meshPerAttribute && (extension.vertexAttribDivisorANGLE(attribute, meshPerAttribute), 
        attributeDivisors[attribute] = meshPerAttribute);
    }, this.disableUnusedAttributes = function() {
        for (var i = 0, l = enabledAttributes.length; l > i; i++) enabledAttributes[i] !== newAttributes[i] && (gl.disableVertexAttribArray(i), 
        enabledAttributes[i] = 0);
    }, this.enable = function(id) {
        capabilities[id] !== !0 && (gl.enable(id), capabilities[id] = !0);
    }, this.disable = function(id) {
        capabilities[id] !== !1 && (gl.disable(id), capabilities[id] = !1);
    }, this.getCompressedTextureFormats = function() {
        if (null === compressedTextureFormats && (compressedTextureFormats = [], extensions.get("WEBGL_compressed_texture_pvrtc") || extensions.get("WEBGL_compressed_texture_s3tc"))) for (var formats = gl.getParameter(gl.COMPRESSED_TEXTURE_FORMATS), i = 0; i < formats.length; i++) compressedTextureFormats.push(formats[i]);
        return compressedTextureFormats;
    }, this.setBlending = function(blending, blendEquation, blendSrc, blendDst, blendEquationAlpha, blendSrcAlpha, blendDstAlpha) {
        blending !== currentBlending && (blending === THREE.NoBlending ? this.disable(gl.BLEND) : blending === THREE.AdditiveBlending ? (this.enable(gl.BLEND), 
        gl.blendEquation(gl.FUNC_ADD), gl.blendFunc(gl.SRC_ALPHA, gl.ONE)) : blending === THREE.SubtractiveBlending ? (this.enable(gl.BLEND), 
        gl.blendEquation(gl.FUNC_ADD), gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_COLOR)) : blending === THREE.MultiplyBlending ? (this.enable(gl.BLEND), 
        gl.blendEquation(gl.FUNC_ADD), gl.blendFunc(gl.ZERO, gl.SRC_COLOR)) : blending === THREE.CustomBlending ? this.enable(gl.BLEND) : (this.enable(gl.BLEND), 
        gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD), gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)), 
        currentBlending = blending), blending === THREE.CustomBlending ? (blendEquationAlpha = blendEquationAlpha || blendEquation, 
        blendSrcAlpha = blendSrcAlpha || blendSrc, blendDstAlpha = blendDstAlpha || blendDst, 
        (blendEquation !== currentBlendEquation || blendEquationAlpha !== currentBlendEquationAlpha) && (gl.blendEquationSeparate(paramThreeToGL(blendEquation), paramThreeToGL(blendEquationAlpha)), 
        currentBlendEquation = blendEquation, currentBlendEquationAlpha = blendEquationAlpha), 
        (blendSrc !== currentBlendSrc || blendDst !== currentBlendDst || blendSrcAlpha !== currentBlendSrcAlpha || blendDstAlpha !== currentBlendDstAlpha) && (gl.blendFuncSeparate(paramThreeToGL(blendSrc), paramThreeToGL(blendDst), paramThreeToGL(blendSrcAlpha), paramThreeToGL(blendDstAlpha)), 
        currentBlendSrc = blendSrc, currentBlendDst = blendDst, currentBlendSrcAlpha = blendSrcAlpha, 
        currentBlendDstAlpha = blendDstAlpha)) : (currentBlendEquation = null, currentBlendSrc = null, 
        currentBlendDst = null, currentBlendEquationAlpha = null, currentBlendSrcAlpha = null, 
        currentBlendDstAlpha = null);
    }, this.setDepthFunc = function(depthFunc) {
        if (currentDepthFunc !== depthFunc) {
            if (depthFunc) switch (depthFunc) {
              case THREE.NeverDepth:
                gl.depthFunc(gl.NEVER);
                break;

              case THREE.AlwaysDepth:
                gl.depthFunc(gl.ALWAYS);
                break;

              case THREE.LessDepth:
                gl.depthFunc(gl.LESS);
                break;

              case THREE.LessEqualDepth:
                gl.depthFunc(gl.LEQUAL);
                break;

              case THREE.EqualDepth:
                gl.depthFunc(gl.EQUAL);
                break;

              case THREE.GreaterEqualDepth:
                gl.depthFunc(gl.GEQUAL);
                break;

              case THREE.GreaterDepth:
                gl.depthFunc(gl.GREATER);
                break;

              case THREE.NotEqualDepth:
                gl.depthFunc(gl.NOTEQUAL);
                break;

              default:
                gl.depthFunc(gl.LEQUAL);
            } else gl.depthFunc(gl.LEQUAL);
            currentDepthFunc = depthFunc;
        }
    }, this.setDepthTest = function(depthTest) {
        depthTest ? this.enable(gl.DEPTH_TEST) : this.disable(gl.DEPTH_TEST);
    }, this.setDepthWrite = function(depthWrite) {
        currentDepthWrite !== depthWrite && (gl.depthMask(depthWrite), currentDepthWrite = depthWrite);
    }, this.setColorWrite = function(colorWrite) {
        currentColorWrite !== colorWrite && (gl.colorMask(colorWrite, colorWrite, colorWrite, colorWrite), 
        currentColorWrite = colorWrite);
    }, this.setFlipSided = function(flipSided) {
        currentFlipSided !== flipSided && (flipSided ? gl.frontFace(gl.CW) : gl.frontFace(gl.CCW), 
        currentFlipSided = flipSided);
    }, this.setLineWidth = function(width) {
        width !== currentLineWidth && (gl.lineWidth(width), currentLineWidth = width);
    }, this.setPolygonOffset = function(polygonOffset, factor, units) {
        polygonOffset ? this.enable(gl.POLYGON_OFFSET_FILL) : this.disable(gl.POLYGON_OFFSET_FILL), 
        !polygonOffset || currentPolygonOffsetFactor === factor && currentPolygonOffsetUnits === units || (gl.polygonOffset(factor, units), 
        currentPolygonOffsetFactor = factor, currentPolygonOffsetUnits = units);
    }, this.setScissorTest = function(scissorTest) {
        scissorTest ? this.enable(gl.SCISSOR_TEST) : this.disable(gl.SCISSOR_TEST);
    }, this.activeTexture = function(webglSlot) {
        void 0 === webglSlot && (webglSlot = gl.TEXTURE0 + maxTextures - 1), currentTextureSlot !== webglSlot && (gl.activeTexture(webglSlot), 
        currentTextureSlot = webglSlot);
    }, this.bindTexture = function(webglType, webglTexture) {
        void 0 === currentTextureSlot && _this.activeTexture();
        var boundTexture = currentBoundTextures[currentTextureSlot];
        void 0 === boundTexture && (boundTexture = {
            type: void 0,
            texture: void 0
        }, currentBoundTextures[currentTextureSlot] = boundTexture), (boundTexture.type !== webglType || boundTexture.texture !== webglTexture) && (gl.bindTexture(webglType, webglTexture), 
        boundTexture.type = webglType, boundTexture.texture = webglTexture);
    }, this.compressedTexImage2D = function() {
        try {
            gl.compressedTexImage2D.apply(gl, arguments);
        } catch (error) {
            console.error(error);
        }
    }, this.texImage2D = function() {
        try {
            gl.texImage2D.apply(gl, arguments);
        } catch (error) {
            console.error(error);
        }
    }, this.reset = function() {
        for (var i = 0; i < enabledAttributes.length; i++) 1 === enabledAttributes[i] && (gl.disableVertexAttribArray(i), 
        enabledAttributes[i] = 0);
        capabilities = {}, compressedTextureFormats = null, currentBlending = null, currentDepthWrite = null, 
        currentColorWrite = null, currentFlipSided = null;
    };
}, THREE.LensFlarePlugin = function(renderer, flares) {
    function init() {
        var vertices = new Float32Array([ -1, -1, 0, 0, 1, -1, 1, 0, 1, 1, 1, 1, -1, 1, 0, 1 ]), faces = new Uint16Array([ 0, 1, 2, 0, 2, 3 ]);
        vertexBuffer = gl.createBuffer(), elementBuffer = gl.createBuffer(), gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer), 
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW), gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer), 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW), tempTexture = gl.createTexture(), 
        occlusionTexture = gl.createTexture(), state.bindTexture(gl.TEXTURE_2D, tempTexture), 
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 16, 16, 0, gl.RGB, gl.UNSIGNED_BYTE, null), 
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE), 
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST), 
        state.bindTexture(gl.TEXTURE_2D, occlusionTexture), gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 16, 16, 0, gl.RGBA, gl.UNSIGNED_BYTE, null), 
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE), 
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST), 
        hasVertexTexture = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) > 0;
        var shader;
        shader = hasVertexTexture ? {
            vertexShader: [ "uniform lowp int renderType;", "uniform vec3 screenPosition;", "uniform vec2 scale;", "uniform float rotation;", "uniform sampler2D occlusionMap;", "attribute vec2 position;", "attribute vec2 uv;", "varying vec2 vUV;", "varying float vVisibility;", "void main() {", "vUV = uv;", "vec2 pos = position;", "if ( renderType == 2 ) {", "vec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) );", "visibility += texture2D( occlusionMap, vec2( 0.5, 0.1 ) );", "visibility += texture2D( occlusionMap, vec2( 0.9, 0.1 ) );", "visibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) );", "visibility += texture2D( occlusionMap, vec2( 0.9, 0.9 ) );", "visibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) );", "visibility += texture2D( occlusionMap, vec2( 0.1, 0.9 ) );", "visibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) );", "visibility += texture2D( occlusionMap, vec2( 0.5, 0.5 ) );", "vVisibility =        visibility.r / 9.0;", "vVisibility *= 1.0 - visibility.g / 9.0;", "vVisibility *=       visibility.b / 9.0;", "vVisibility *= 1.0 - visibility.a / 9.0;", "pos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;", "pos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;", "}", "gl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );", "}" ].join("\n"),
            fragmentShader: [ "uniform lowp int renderType;", "uniform sampler2D map;", "uniform float opacity;", "uniform vec3 color;", "varying vec2 vUV;", "varying float vVisibility;", "void main() {", "if ( renderType == 0 ) {", "gl_FragColor = vec4( 1.0, 0.0, 1.0, 0.0 );", "} else if ( renderType == 1 ) {", "gl_FragColor = texture2D( map, vUV );", "} else {", "vec4 texture = texture2D( map, vUV );", "texture.a *= opacity * vVisibility;", "gl_FragColor = texture;", "gl_FragColor.rgb *= color;", "}", "}" ].join("\n")
        } : {
            vertexShader: [ "uniform lowp int renderType;", "uniform vec3 screenPosition;", "uniform vec2 scale;", "uniform float rotation;", "attribute vec2 position;", "attribute vec2 uv;", "varying vec2 vUV;", "void main() {", "vUV = uv;", "vec2 pos = position;", "if ( renderType == 2 ) {", "pos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;", "pos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;", "}", "gl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );", "}" ].join("\n"),
            fragmentShader: [ "precision mediump float;", "uniform lowp int renderType;", "uniform sampler2D map;", "uniform sampler2D occlusionMap;", "uniform float opacity;", "uniform vec3 color;", "varying vec2 vUV;", "void main() {", "if ( renderType == 0 ) {", "gl_FragColor = vec4( texture2D( map, vUV ).rgb, 0.0 );", "} else if ( renderType == 1 ) {", "gl_FragColor = texture2D( map, vUV );", "} else {", "float visibility = texture2D( occlusionMap, vec2( 0.5, 0.1 ) ).a;", "visibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) ).a;", "visibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) ).a;", "visibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) ).a;", "visibility = ( 1.0 - visibility / 4.0 );", "vec4 texture = texture2D( map, vUV );", "texture.a *= opacity * visibility;", "gl_FragColor = texture;", "gl_FragColor.rgb *= color;", "}", "}" ].join("\n")
        }, program = createProgram(shader), attributes = {
            vertex: gl.getAttribLocation(program, "position"),
            uv: gl.getAttribLocation(program, "uv")
        }, uniforms = {
            renderType: gl.getUniformLocation(program, "renderType"),
            map: gl.getUniformLocation(program, "map"),
            occlusionMap: gl.getUniformLocation(program, "occlusionMap"),
            opacity: gl.getUniformLocation(program, "opacity"),
            color: gl.getUniformLocation(program, "color"),
            scale: gl.getUniformLocation(program, "scale"),
            rotation: gl.getUniformLocation(program, "rotation"),
            screenPosition: gl.getUniformLocation(program, "screenPosition")
        };
    }
    function createProgram(shader) {
        var program = gl.createProgram(), fragmentShader = gl.createShader(gl.FRAGMENT_SHADER), vertexShader = gl.createShader(gl.VERTEX_SHADER), prefix = "precision " + renderer.getPrecision() + " float;\n";
        return gl.shaderSource(fragmentShader, prefix + shader.fragmentShader), gl.shaderSource(vertexShader, prefix + shader.vertexShader), 
        gl.compileShader(fragmentShader), gl.compileShader(vertexShader), gl.attachShader(program, fragmentShader), 
        gl.attachShader(program, vertexShader), gl.linkProgram(program), program;
    }
    var vertexBuffer, elementBuffer, program, attributes, uniforms, hasVertexTexture, tempTexture, occlusionTexture, gl = renderer.context, state = renderer.state;
    this.render = function(scene, camera, viewportWidth, viewportHeight) {
        if (0 !== flares.length) {
            var tempPosition = new THREE.Vector3(), invAspect = viewportHeight / viewportWidth, halfViewportWidth = .5 * viewportWidth, halfViewportHeight = .5 * viewportHeight, size = 16 / viewportHeight, scale = new THREE.Vector2(size * invAspect, size), screenPosition = new THREE.Vector3(1, 1, 0), screenPositionPixels = new THREE.Vector2(1, 1);
            void 0 === program && init(), gl.useProgram(program), state.initAttributes(), state.enableAttribute(attributes.vertex), 
            state.enableAttribute(attributes.uv), state.disableUnusedAttributes(), gl.uniform1i(uniforms.occlusionMap, 0), 
            gl.uniform1i(uniforms.map, 1), gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer), gl.vertexAttribPointer(attributes.vertex, 2, gl.FLOAT, !1, 16, 0), 
            gl.vertexAttribPointer(attributes.uv, 2, gl.FLOAT, !1, 16, 8), gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer), 
            state.disable(gl.CULL_FACE), gl.depthMask(!1);
            for (var i = 0, l = flares.length; l > i; i++) {
                size = 16 / viewportHeight, scale.set(size * invAspect, size);
                var flare = flares[i];
                if (tempPosition.set(flare.matrixWorld.elements[12], flare.matrixWorld.elements[13], flare.matrixWorld.elements[14]), 
                tempPosition.applyMatrix4(camera.matrixWorldInverse), tempPosition.applyProjection(camera.projectionMatrix), 
                screenPosition.copy(tempPosition), screenPositionPixels.x = screenPosition.x * halfViewportWidth + halfViewportWidth, 
                screenPositionPixels.y = screenPosition.y * halfViewportHeight + halfViewportHeight, 
                hasVertexTexture || screenPositionPixels.x > 0 && screenPositionPixels.x < viewportWidth && screenPositionPixels.y > 0 && screenPositionPixels.y < viewportHeight) {
                    state.activeTexture(gl.TEXTURE0), state.bindTexture(gl.TEXTURE_2D, null), state.activeTexture(gl.TEXTURE1), 
                    state.bindTexture(gl.TEXTURE_2D, tempTexture), gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGB, screenPositionPixels.x - 8, screenPositionPixels.y - 8, 16, 16, 0), 
                    gl.uniform1i(uniforms.renderType, 0), gl.uniform2f(uniforms.scale, scale.x, scale.y), 
                    gl.uniform3f(uniforms.screenPosition, screenPosition.x, screenPosition.y, screenPosition.z), 
                    state.disable(gl.BLEND), state.enable(gl.DEPTH_TEST), gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0), 
                    state.activeTexture(gl.TEXTURE0), state.bindTexture(gl.TEXTURE_2D, occlusionTexture), 
                    gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, screenPositionPixels.x - 8, screenPositionPixels.y - 8, 16, 16, 0), 
                    gl.uniform1i(uniforms.renderType, 1), state.disable(gl.DEPTH_TEST), state.activeTexture(gl.TEXTURE1), 
                    state.bindTexture(gl.TEXTURE_2D, tempTexture), gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0), 
                    flare.positionScreen.copy(screenPosition), flare.customUpdateCallback ? flare.customUpdateCallback(flare) : flare.updateLensFlares(), 
                    gl.uniform1i(uniforms.renderType, 2), state.enable(gl.BLEND);
                    for (var j = 0, jl = flare.lensFlares.length; jl > j; j++) {
                        var sprite = flare.lensFlares[j];
                        sprite.opacity > .001 && sprite.scale > .001 && (screenPosition.x = sprite.x, screenPosition.y = sprite.y, 
                        screenPosition.z = sprite.z, size = sprite.size * sprite.scale / viewportHeight, 
                        scale.x = size * invAspect, scale.y = size, gl.uniform3f(uniforms.screenPosition, screenPosition.x, screenPosition.y, screenPosition.z), 
                        gl.uniform2f(uniforms.scale, scale.x, scale.y), gl.uniform1f(uniforms.rotation, sprite.rotation), 
                        gl.uniform1f(uniforms.opacity, sprite.opacity), gl.uniform3f(uniforms.color, sprite.color.r, sprite.color.g, sprite.color.b), 
                        state.setBlending(sprite.blending, sprite.blendEquation, sprite.blendSrc, sprite.blendDst), 
                        renderer.setTexture(sprite.texture, 1), gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0));
                    }
                }
            }
            state.enable(gl.CULL_FACE), state.enable(gl.DEPTH_TEST), gl.depthMask(!0), renderer.resetGLState();
        }
    };
}, THREE.SpritePlugin = function(renderer, sprites) {
    function init() {
        var vertices = new Float32Array([ -.5, -.5, 0, 0, .5, -.5, 1, 0, .5, .5, 1, 1, -.5, .5, 0, 1 ]), faces = new Uint16Array([ 0, 1, 2, 0, 2, 3 ]);
        vertexBuffer = gl.createBuffer(), elementBuffer = gl.createBuffer(), gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer), 
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW), gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer), 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW), program = createProgram(), 
        attributes = {
            position: gl.getAttribLocation(program, "position"),
            uv: gl.getAttribLocation(program, "uv")
        }, uniforms = {
            uvOffset: gl.getUniformLocation(program, "uvOffset"),
            uvScale: gl.getUniformLocation(program, "uvScale"),
            rotation: gl.getUniformLocation(program, "rotation"),
            scale: gl.getUniformLocation(program, "scale"),
            color: gl.getUniformLocation(program, "color"),
            map: gl.getUniformLocation(program, "map"),
            opacity: gl.getUniformLocation(program, "opacity"),
            modelViewMatrix: gl.getUniformLocation(program, "modelViewMatrix"),
            projectionMatrix: gl.getUniformLocation(program, "projectionMatrix"),
            fogType: gl.getUniformLocation(program, "fogType"),
            fogDensity: gl.getUniformLocation(program, "fogDensity"),
            fogNear: gl.getUniformLocation(program, "fogNear"),
            fogFar: gl.getUniformLocation(program, "fogFar"),
            fogColor: gl.getUniformLocation(program, "fogColor"),
            alphaTest: gl.getUniformLocation(program, "alphaTest")
        };
        var canvas = document.createElement("canvas");
        canvas.width = 8, canvas.height = 8;
        var context = canvas.getContext("2d");
        context.fillStyle = "white", context.fillRect(0, 0, 8, 8), texture = new THREE.Texture(canvas), 
        texture.needsUpdate = !0;
    }
    function createProgram() {
        var program = gl.createProgram(), vertexShader = gl.createShader(gl.VERTEX_SHADER), fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        return gl.shaderSource(vertexShader, [ "precision " + renderer.getPrecision() + " float;", "uniform mat4 modelViewMatrix;", "uniform mat4 projectionMatrix;", "uniform float rotation;", "uniform vec2 scale;", "uniform vec2 uvOffset;", "uniform vec2 uvScale;", "attribute vec2 position;", "attribute vec2 uv;", "varying vec2 vUV;", "void main() {", "vUV = uvOffset + uv * uvScale;", "vec2 alignedPosition = position * scale;", "vec2 rotatedPosition;", "rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;", "rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;", "vec4 finalPosition;", "finalPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );", "finalPosition.xy += rotatedPosition;", "finalPosition = projectionMatrix * finalPosition;", "gl_Position = finalPosition;", "}" ].join("\n")), 
        gl.shaderSource(fragmentShader, [ "precision " + renderer.getPrecision() + " float;", "uniform vec3 color;", "uniform sampler2D map;", "uniform float opacity;", "uniform int fogType;", "uniform vec3 fogColor;", "uniform float fogDensity;", "uniform float fogNear;", "uniform float fogFar;", "uniform float alphaTest;", "varying vec2 vUV;", "void main() {", "vec4 texture = texture2D( map, vUV );", "if ( texture.a < alphaTest ) discard;", "gl_FragColor = vec4( color * texture.xyz, texture.a * opacity );", "if ( fogType > 0 ) {", "float depth = gl_FragCoord.z / gl_FragCoord.w;", "float fogFactor = 0.0;", "if ( fogType == 1 ) {", "fogFactor = smoothstep( fogNear, fogFar, depth );", "} else {", "const float LOG2 = 1.442695;", "fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );", "fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );", "}", "gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );", "}", "}" ].join("\n")), 
        gl.compileShader(vertexShader), gl.compileShader(fragmentShader), gl.attachShader(program, vertexShader), 
        gl.attachShader(program, fragmentShader), gl.linkProgram(program), program;
    }
    function painterSortStable(a, b) {
        return a.z !== b.z ? b.z - a.z : b.id - a.id;
    }
    var vertexBuffer, elementBuffer, program, attributes, uniforms, texture, gl = renderer.context, state = renderer.state, spritePosition = new THREE.Vector3(), spriteRotation = new THREE.Quaternion(), spriteScale = new THREE.Vector3();
    this.render = function(scene, camera) {
        if (0 !== sprites.length) {
            void 0 === program && init(), gl.useProgram(program), state.initAttributes(), state.enableAttribute(attributes.position), 
            state.enableAttribute(attributes.uv), state.disableUnusedAttributes(), state.disable(gl.CULL_FACE), 
            state.enable(gl.BLEND), gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer), gl.vertexAttribPointer(attributes.position, 2, gl.FLOAT, !1, 16, 0), 
            gl.vertexAttribPointer(attributes.uv, 2, gl.FLOAT, !1, 16, 8), gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer), 
            gl.uniformMatrix4fv(uniforms.projectionMatrix, !1, camera.projectionMatrix.elements), 
            state.activeTexture(gl.TEXTURE0), gl.uniform1i(uniforms.map, 0);
            var oldFogType = 0, sceneFogType = 0, fog = scene.fog;
            fog ? (gl.uniform3f(uniforms.fogColor, fog.color.r, fog.color.g, fog.color.b), fog instanceof THREE.Fog ? (gl.uniform1f(uniforms.fogNear, fog.near), 
            gl.uniform1f(uniforms.fogFar, fog.far), gl.uniform1i(uniforms.fogType, 1), oldFogType = 1, 
            sceneFogType = 1) : fog instanceof THREE.FogExp2 && (gl.uniform1f(uniforms.fogDensity, fog.density), 
            gl.uniform1i(uniforms.fogType, 2), oldFogType = 2, sceneFogType = 2)) : (gl.uniform1i(uniforms.fogType, 0), 
            oldFogType = 0, sceneFogType = 0);
            for (var i = 0, l = sprites.length; l > i; i++) {
                var sprite = sprites[i];
                sprite.modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, sprite.matrixWorld), 
                sprite.z = -sprite.modelViewMatrix.elements[14];
            }
            sprites.sort(painterSortStable);
            for (var scale = [], i = 0, l = sprites.length; l > i; i++) {
                var sprite = sprites[i], material = sprite.material;
                gl.uniform1f(uniforms.alphaTest, material.alphaTest), gl.uniformMatrix4fv(uniforms.modelViewMatrix, !1, sprite.modelViewMatrix.elements), 
                sprite.matrixWorld.decompose(spritePosition, spriteRotation, spriteScale), scale[0] = spriteScale.x, 
                scale[1] = spriteScale.y;
                var fogType = 0;
                scene.fog && material.fog && (fogType = sceneFogType), oldFogType !== fogType && (gl.uniform1i(uniforms.fogType, fogType), 
                oldFogType = fogType), null !== material.map ? (gl.uniform2f(uniforms.uvOffset, material.map.offset.x, material.map.offset.y), 
                gl.uniform2f(uniforms.uvScale, material.map.repeat.x, material.map.repeat.y)) : (gl.uniform2f(uniforms.uvOffset, 0, 0), 
                gl.uniform2f(uniforms.uvScale, 1, 1)), gl.uniform1f(uniforms.opacity, material.opacity), 
                gl.uniform3f(uniforms.color, material.color.r, material.color.g, material.color.b), 
                gl.uniform1f(uniforms.rotation, material.rotation), gl.uniform2fv(uniforms.scale, scale), 
                state.setBlending(material.blending, material.blendEquation, material.blendSrc, material.blendDst), 
                state.setDepthTest(material.depthTest), state.setDepthWrite(material.depthWrite), 
                material.map && material.map.image && material.map.image.width ? renderer.setTexture(material.map, 0) : renderer.setTexture(texture, 0), 
                gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
            }
            state.enable(gl.CULL_FACE), renderer.resetGLState();
        }
    };
}, THREE.CurveUtils = {
    tangentQuadraticBezier: function(t, p0, p1, p2) {
        return 2 * (1 - t) * (p1 - p0) + 2 * t * (p2 - p1);
    },
    tangentCubicBezier: function(t, p0, p1, p2, p3) {
        return -3 * p0 * (1 - t) * (1 - t) + 3 * p1 * (1 - t) * (1 - t) - 6 * t * p1 * (1 - t) + 6 * t * p2 * (1 - t) - 3 * t * t * p2 + 3 * t * t * p3;
    },
    tangentSpline: function(t, p0, p1, p2, p3) {
        var h00 = 6 * t * t - 6 * t, h10 = 3 * t * t - 4 * t + 1, h01 = -6 * t * t + 6 * t, h11 = 3 * t * t - 2 * t;
        return h00 + h10 + h01 + h11;
    },
    interpolate: function(p0, p1, p2, p3, t) {
        var v0 = .5 * (p2 - p0), v1 = .5 * (p3 - p1), t2 = t * t, t3 = t * t2;
        return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
    }
}, THREE.GeometryUtils = {
    merge: function(geometry1, geometry2, materialIndexOffset) {
        console.warn("THREE.GeometryUtils: .merge() has been moved to Geometry. Use geometry.merge( geometry2, matrix, materialIndexOffset ) instead.");
        var matrix;
        geometry2 instanceof THREE.Mesh && (geometry2.matrixAutoUpdate && geometry2.updateMatrix(), 
        matrix = geometry2.matrix, geometry2 = geometry2.geometry), geometry1.merge(geometry2, matrix, materialIndexOffset);
    },
    center: function(geometry) {
        return console.warn("THREE.GeometryUtils: .center() has been moved to Geometry. Use geometry.center() instead."), 
        geometry.center();
    }
}, THREE.ImageUtils = {
    crossOrigin: void 0,
    loadTexture: function(url, mapping, onLoad, onError) {
        console.warn("THREE.ImageUtils.loadTexture is being deprecated. Use THREE.TextureLoader() instead.");
        var loader = new THREE.TextureLoader();
        loader.setCrossOrigin(this.crossOrigin);
        var texture = loader.load(url, onLoad, void 0, onError);
        return mapping && (texture.mapping = mapping), texture;
    },
    loadTextureCube: function(urls, mapping, onLoad, onError) {
        console.warn("THREE.ImageUtils.loadTextureCube is being deprecated. Use THREE.CubeTextureLoader() instead.");
        var loader = new THREE.CubeTextureLoader();
        loader.setCrossOrigin(this.crossOrigin);
        var texture = loader.load(urls, onLoad, void 0, onError);
        return mapping && (texture.mapping = mapping), texture;
    },
    loadCompressedTexture: function() {
        console.error("THREE.ImageUtils.loadCompressedTexture has been removed. Use THREE.DDSLoader instead.");
    },
    loadCompressedTextureCube: function() {
        console.error("THREE.ImageUtils.loadCompressedTextureCube has been removed. Use THREE.DDSLoader instead.");
    }
}, THREE.SceneUtils = {
    createMultiMaterialObject: function(geometry, materials) {
        for (var group = new THREE.Group(), i = 0, l = materials.length; l > i; i++) group.add(new THREE.Mesh(geometry, materials[i]));
        return group;
    },
    detach: function(child, parent, scene) {
        child.applyMatrix(parent.matrixWorld), parent.remove(child), scene.add(child);
    },
    attach: function(child, scene, parent) {
        var matrixWorldInverse = new THREE.Matrix4();
        matrixWorldInverse.getInverse(parent.matrixWorld), child.applyMatrix(matrixWorldInverse), 
        scene.remove(child), parent.add(child);
    }
}, THREE.ShapeUtils = {
    area: function(contour) {
        for (var n = contour.length, a = 0, p = n - 1, q = 0; n > q; p = q++) a += contour[p].x * contour[q].y - contour[q].x * contour[p].y;
        return .5 * a;
    },
    triangulate: function() {
        function snip(contour, u, v, w, n, verts) {
            var p, ax, ay, bx, by, cx, cy, px, py;
            if (ax = contour[verts[u]].x, ay = contour[verts[u]].y, bx = contour[verts[v]].x, 
            by = contour[verts[v]].y, cx = contour[verts[w]].x, cy = contour[verts[w]].y, Number.EPSILON > (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)) return !1;
            var aX, aY, bX, bY, cX, cY, apx, apy, bpx, bpy, cpx, cpy, cCROSSap, bCROSScp, aCROSSbp;
            for (aX = cx - bx, aY = cy - by, bX = ax - cx, bY = ay - cy, cX = bx - ax, cY = by - ay, 
            p = 0; n > p; p++) if (px = contour[verts[p]].x, py = contour[verts[p]].y, !(px === ax && py === ay || px === bx && py === by || px === cx && py === cy) && (apx = px - ax, 
            apy = py - ay, bpx = px - bx, bpy = py - by, cpx = px - cx, cpy = py - cy, aCROSSbp = aX * bpy - aY * bpx, 
            cCROSSap = cX * apy - cY * apx, bCROSScp = bX * cpy - bY * cpx, aCROSSbp >= -Number.EPSILON && bCROSScp >= -Number.EPSILON && cCROSSap >= -Number.EPSILON)) return !1;
            return !0;
        }
        return function(contour, indices) {
            var n = contour.length;
            if (3 > n) return null;
            var u, v, w, result = [], verts = [], vertIndices = [];
            if (THREE.ShapeUtils.area(contour) > 0) for (v = 0; n > v; v++) verts[v] = v; else for (v = 0; n > v; v++) verts[v] = n - 1 - v;
            var nv = n, count = 2 * nv;
            for (v = nv - 1; nv > 2; ) {
                if (count-- <= 0) return console.warn("THREE.ShapeUtils: Unable to triangulate polygon! in triangulate()"), 
                indices ? vertIndices : result;
                if (u = v, u >= nv && (u = 0), v = u + 1, v >= nv && (v = 0), w = v + 1, w >= nv && (w = 0), 
                snip(contour, u, v, w, nv, verts)) {
                    var a, b, c, s, t;
                    for (a = verts[u], b = verts[v], c = verts[w], result.push([ contour[a], contour[b], contour[c] ]), 
                    vertIndices.push([ verts[u], verts[v], verts[w] ]), s = v, t = v + 1; nv > t; s++, 
                    t++) verts[s] = verts[t];
                    nv--, count = 2 * nv;
                }
            }
            return indices ? vertIndices : result;
        };
    }(),
    triangulateShape: function(contour, holes) {
        function point_in_segment_2D_colin(inSegPt1, inSegPt2, inOtherPt) {
            return inSegPt1.x !== inSegPt2.x ? inSegPt1.x < inSegPt2.x ? inSegPt1.x <= inOtherPt.x && inOtherPt.x <= inSegPt2.x : inSegPt2.x <= inOtherPt.x && inOtherPt.x <= inSegPt1.x : inSegPt1.y < inSegPt2.y ? inSegPt1.y <= inOtherPt.y && inOtherPt.y <= inSegPt2.y : inSegPt2.y <= inOtherPt.y && inOtherPt.y <= inSegPt1.y;
        }
        function intersect_segments_2D(inSeg1Pt1, inSeg1Pt2, inSeg2Pt1, inSeg2Pt2, inExcludeAdjacentSegs) {
            var seg1dx = inSeg1Pt2.x - inSeg1Pt1.x, seg1dy = inSeg1Pt2.y - inSeg1Pt1.y, seg2dx = inSeg2Pt2.x - inSeg2Pt1.x, seg2dy = inSeg2Pt2.y - inSeg2Pt1.y, seg1seg2dx = inSeg1Pt1.x - inSeg2Pt1.x, seg1seg2dy = inSeg1Pt1.y - inSeg2Pt1.y, limit = seg1dy * seg2dx - seg1dx * seg2dy, perpSeg1 = seg1dy * seg1seg2dx - seg1dx * seg1seg2dy;
            if (Math.abs(limit) > Number.EPSILON) {
                var perpSeg2;
                if (limit > 0) {
                    if (0 > perpSeg1 || perpSeg1 > limit) return [];
                    if (perpSeg2 = seg2dy * seg1seg2dx - seg2dx * seg1seg2dy, 0 > perpSeg2 || perpSeg2 > limit) return [];
                } else {
                    if (perpSeg1 > 0 || limit > perpSeg1) return [];
                    if (perpSeg2 = seg2dy * seg1seg2dx - seg2dx * seg1seg2dy, perpSeg2 > 0 || limit > perpSeg2) return [];
                }
                if (0 === perpSeg2) return !inExcludeAdjacentSegs || 0 !== perpSeg1 && perpSeg1 !== limit ? [ inSeg1Pt1 ] : [];
                if (perpSeg2 === limit) return !inExcludeAdjacentSegs || 0 !== perpSeg1 && perpSeg1 !== limit ? [ inSeg1Pt2 ] : [];
                if (0 === perpSeg1) return [ inSeg2Pt1 ];
                if (perpSeg1 === limit) return [ inSeg2Pt2 ];
                var factorSeg1 = perpSeg2 / limit;
                return [ {
                    x: inSeg1Pt1.x + factorSeg1 * seg1dx,
                    y: inSeg1Pt1.y + factorSeg1 * seg1dy
                } ];
            }
            if (0 !== perpSeg1 || seg2dy * seg1seg2dx !== seg2dx * seg1seg2dy) return [];
            var seg1Pt = 0 === seg1dx && 0 === seg1dy, seg2Pt = 0 === seg2dx && 0 === seg2dy;
            if (seg1Pt && seg2Pt) return inSeg1Pt1.x !== inSeg2Pt1.x || inSeg1Pt1.y !== inSeg2Pt1.y ? [] : [ inSeg1Pt1 ];
            if (seg1Pt) return point_in_segment_2D_colin(inSeg2Pt1, inSeg2Pt2, inSeg1Pt1) ? [ inSeg1Pt1 ] : [];
            if (seg2Pt) return point_in_segment_2D_colin(inSeg1Pt1, inSeg1Pt2, inSeg2Pt1) ? [ inSeg2Pt1 ] : [];
            var seg1min, seg1max, seg1minVal, seg1maxVal, seg2min, seg2max, seg2minVal, seg2maxVal;
            return 0 !== seg1dx ? (inSeg1Pt1.x < inSeg1Pt2.x ? (seg1min = inSeg1Pt1, seg1minVal = inSeg1Pt1.x, 
            seg1max = inSeg1Pt2, seg1maxVal = inSeg1Pt2.x) : (seg1min = inSeg1Pt2, seg1minVal = inSeg1Pt2.x, 
            seg1max = inSeg1Pt1, seg1maxVal = inSeg1Pt1.x), inSeg2Pt1.x < inSeg2Pt2.x ? (seg2min = inSeg2Pt1, 
            seg2minVal = inSeg2Pt1.x, seg2max = inSeg2Pt2, seg2maxVal = inSeg2Pt2.x) : (seg2min = inSeg2Pt2, 
            seg2minVal = inSeg2Pt2.x, seg2max = inSeg2Pt1, seg2maxVal = inSeg2Pt1.x)) : (inSeg1Pt1.y < inSeg1Pt2.y ? (seg1min = inSeg1Pt1, 
            seg1minVal = inSeg1Pt1.y, seg1max = inSeg1Pt2, seg1maxVal = inSeg1Pt2.y) : (seg1min = inSeg1Pt2, 
            seg1minVal = inSeg1Pt2.y, seg1max = inSeg1Pt1, seg1maxVal = inSeg1Pt1.y), inSeg2Pt1.y < inSeg2Pt2.y ? (seg2min = inSeg2Pt1, 
            seg2minVal = inSeg2Pt1.y, seg2max = inSeg2Pt2, seg2maxVal = inSeg2Pt2.y) : (seg2min = inSeg2Pt2, 
            seg2minVal = inSeg2Pt2.y, seg2max = inSeg2Pt1, seg2maxVal = inSeg2Pt1.y)), seg2minVal >= seg1minVal ? seg2minVal > seg1maxVal ? [] : seg1maxVal === seg2minVal ? inExcludeAdjacentSegs ? [] : [ seg2min ] : seg2maxVal >= seg1maxVal ? [ seg2min, seg1max ] : [ seg2min, seg2max ] : seg1minVal > seg2maxVal ? [] : seg1minVal === seg2maxVal ? inExcludeAdjacentSegs ? [] : [ seg1min ] : seg2maxVal >= seg1maxVal ? [ seg1min, seg1max ] : [ seg1min, seg2max ];
        }
        function isPointInsideAngle(inVertex, inLegFromPt, inLegToPt, inOtherPt) {
            var legFromPtX = inLegFromPt.x - inVertex.x, legFromPtY = inLegFromPt.y - inVertex.y, legToPtX = inLegToPt.x - inVertex.x, legToPtY = inLegToPt.y - inVertex.y, otherPtX = inOtherPt.x - inVertex.x, otherPtY = inOtherPt.y - inVertex.y, from2toAngle = legFromPtX * legToPtY - legFromPtY * legToPtX, from2otherAngle = legFromPtX * otherPtY - legFromPtY * otherPtX;
            if (Math.abs(from2toAngle) > Number.EPSILON) {
                var other2toAngle = otherPtX * legToPtY - otherPtY * legToPtX;
                return from2toAngle > 0 ? from2otherAngle >= 0 && other2toAngle >= 0 : from2otherAngle >= 0 || other2toAngle >= 0;
            }
            return from2otherAngle > 0;
        }
        function removeHoles(contour, holes) {
            function isCutLineInsideAngles(inShapeIdx, inHoleIdx) {
                var lastShapeIdx = shape.length - 1, prevShapeIdx = inShapeIdx - 1;
                0 > prevShapeIdx && (prevShapeIdx = lastShapeIdx);
                var nextShapeIdx = inShapeIdx + 1;
                nextShapeIdx > lastShapeIdx && (nextShapeIdx = 0);
                var insideAngle = isPointInsideAngle(shape[inShapeIdx], shape[prevShapeIdx], shape[nextShapeIdx], hole[inHoleIdx]);
                if (!insideAngle) return !1;
                var lastHoleIdx = hole.length - 1, prevHoleIdx = inHoleIdx - 1;
                0 > prevHoleIdx && (prevHoleIdx = lastHoleIdx);
                var nextHoleIdx = inHoleIdx + 1;
                return nextHoleIdx > lastHoleIdx && (nextHoleIdx = 0), insideAngle = isPointInsideAngle(hole[inHoleIdx], hole[prevHoleIdx], hole[nextHoleIdx], shape[inShapeIdx]), 
                insideAngle ? !0 : !1;
            }
            function intersectsShapeEdge(inShapePt, inHolePt) {
                var sIdx, nextIdx, intersection;
                for (sIdx = 0; sIdx < shape.length; sIdx++) if (nextIdx = sIdx + 1, nextIdx %= shape.length, 
                intersection = intersect_segments_2D(inShapePt, inHolePt, shape[sIdx], shape[nextIdx], !0), 
                intersection.length > 0) return !0;
                return !1;
            }
            function intersectsHoleEdge(inShapePt, inHolePt) {
                var ihIdx, chkHole, hIdx, nextIdx, intersection;
                for (ihIdx = 0; ihIdx < indepHoles.length; ihIdx++) for (chkHole = holes[indepHoles[ihIdx]], 
                hIdx = 0; hIdx < chkHole.length; hIdx++) if (nextIdx = hIdx + 1, nextIdx %= chkHole.length, 
                intersection = intersect_segments_2D(inShapePt, inHolePt, chkHole[hIdx], chkHole[nextIdx], !0), 
                intersection.length > 0) return !0;
                return !1;
            }
            for (var hole, holeIndex, shapeIndex, shapePt, holePt, holeIdx, cutKey, tmpShape1, tmpShape2, tmpHole1, tmpHole2, shape = contour.concat(), indepHoles = [], failedCuts = [], h = 0, hl = holes.length; hl > h; h++) indepHoles.push(h);
            for (var minShapeIndex = 0, counter = 2 * indepHoles.length; indepHoles.length > 0; ) {
                if (counter--, 0 > counter) {
                    console.log("Infinite Loop! Holes left:" + indepHoles.length + ", Probably Hole outside Shape!");
                    break;
                }
                for (shapeIndex = minShapeIndex; shapeIndex < shape.length; shapeIndex++) {
                    shapePt = shape[shapeIndex], holeIndex = -1;
                    for (var h = 0; h < indepHoles.length; h++) if (holeIdx = indepHoles[h], cutKey = shapePt.x + ":" + shapePt.y + ":" + holeIdx, 
                    void 0 === failedCuts[cutKey]) {
                        hole = holes[holeIdx];
                        for (var h2 = 0; h2 < hole.length; h2++) if (holePt = hole[h2], isCutLineInsideAngles(shapeIndex, h2) && !intersectsShapeEdge(shapePt, holePt) && !intersectsHoleEdge(shapePt, holePt)) {
                            holeIndex = h2, indepHoles.splice(h, 1), tmpShape1 = shape.slice(0, shapeIndex + 1), 
                            tmpShape2 = shape.slice(shapeIndex), tmpHole1 = hole.slice(holeIndex), tmpHole2 = hole.slice(0, holeIndex + 1), 
                            shape = tmpShape1.concat(tmpHole1).concat(tmpHole2).concat(tmpShape2), minShapeIndex = shapeIndex;
                            break;
                        }
                        if (holeIndex >= 0) break;
                        failedCuts[cutKey] = !0;
                    }
                    if (holeIndex >= 0) break;
                }
            }
            return shape;
        }
        for (var i, il, f, face, key, index, allPointsMap = {}, allpoints = contour.concat(), h = 0, hl = holes.length; hl > h; h++) Array.prototype.push.apply(allpoints, holes[h]);
        for (i = 0, il = allpoints.length; il > i; i++) key = allpoints[i].x + ":" + allpoints[i].y, 
        void 0 !== allPointsMap[key] && console.warn("THREE.Shape: Duplicate point", key), 
        allPointsMap[key] = i;
        var shapeWithoutHoles = removeHoles(contour, holes), triangles = THREE.ShapeUtils.triangulate(shapeWithoutHoles, !1);
        for (i = 0, il = triangles.length; il > i; i++) for (face = triangles[i], f = 0; 3 > f; f++) key = face[f].x + ":" + face[f].y, 
        index = allPointsMap[key], void 0 !== index && (face[f] = index);
        return triangles.concat();
    },
    isClockWise: function(pts) {
        return THREE.ShapeUtils.area(pts) < 0;
    },
    b2: function() {
        function b2p0(t, p) {
            var k = 1 - t;
            return k * k * p;
        }
        function b2p1(t, p) {
            return 2 * (1 - t) * t * p;
        }
        function b2p2(t, p) {
            return t * t * p;
        }
        return function(t, p0, p1, p2) {
            return b2p0(t, p0) + b2p1(t, p1) + b2p2(t, p2);
        };
    }(),
    b3: function() {
        function b3p0(t, p) {
            var k = 1 - t;
            return k * k * k * p;
        }
        function b3p1(t, p) {
            var k = 1 - t;
            return 3 * k * k * t * p;
        }
        function b3p2(t, p) {
            var k = 1 - t;
            return 3 * k * t * t * p;
        }
        function b3p3(t, p) {
            return t * t * t * p;
        }
        return function(t, p0, p1, p2, p3) {
            return b3p0(t, p0) + b3p1(t, p1) + b3p2(t, p2) + b3p3(t, p3);
        };
    }()
}, THREE.Audio = function(listener) {
    THREE.Object3D.call(this), this.type = "Audio", this.context = listener.context, 
    this.source = this.context.createBufferSource(), this.source.onended = this.onEnded.bind(this), 
    this.gain = this.context.createGain(), this.gain.connect(this.context.destination), 
    this.panner = this.context.createPanner(), this.panner.connect(this.gain), this.autoplay = !1, 
    this.startTime = 0, this.playbackRate = 1, this.isPlaying = !1;
}, THREE.Audio.prototype = Object.create(THREE.Object3D.prototype), THREE.Audio.prototype.constructor = THREE.Audio, 
THREE.Audio.prototype.load = function(file) {
    var scope = this, request = new XMLHttpRequest();
    return request.open("GET", file, !0), request.responseType = "arraybuffer", request.onload = function(e) {
        scope.context.decodeAudioData(this.response, function(buffer) {
            scope.source.buffer = buffer, scope.autoplay && scope.play();
        });
    }, request.send(), this;
}, THREE.Audio.prototype.play = function() {
    if (this.isPlaying === !0) return void console.warn("THREE.Audio: Audio is already playing.");
    var source = this.context.createBufferSource();
    source.buffer = this.source.buffer, source.loop = this.source.loop, source.onended = this.source.onended, 
    source.start(0, this.startTime), source.playbackRate.value = this.playbackRate, 
    this.isPlaying = !0, this.source = source, this.connect();
}, THREE.Audio.prototype.pause = function() {
    this.source.stop(), this.startTime = this.context.currentTime;
}, THREE.Audio.prototype.stop = function() {
    this.source.stop(), this.startTime = 0;
}, THREE.Audio.prototype.connect = function() {
    void 0 !== this.filter ? (this.source.connect(this.filter), this.filter.connect(this.panner)) : this.source.connect(this.panner);
}, THREE.Audio.prototype.disconnect = function() {
    void 0 !== this.filter ? (this.source.disconnect(this.filter), this.filter.disconnect(this.panner)) : this.source.disconnect(this.panner);
}, THREE.Audio.prototype.setFilter = function(value) {
    this.isPlaying === !0 ? (this.disconnect(), this.filter = value, this.connect()) : this.filter = value;
}, THREE.Audio.prototype.getFilter = function() {
    return this.filter;
}, THREE.Audio.prototype.setPlaybackRate = function(value) {
    this.playbackRate = value, this.isPlaying === !0 && (this.source.playbackRate.value = this.playbackRate);
}, THREE.Audio.prototype.getPlaybackRate = function() {
    return this.playbackRate;
}, THREE.Audio.prototype.onEnded = function() {
    this.isPlaying = !1;
}, THREE.Audio.prototype.setLoop = function(value) {
    this.source.loop = value;
}, THREE.Audio.prototype.getLoop = function() {
    return this.source.loop;
}, THREE.Audio.prototype.setRefDistance = function(value) {
    this.panner.refDistance = value;
}, THREE.Audio.prototype.getRefDistance = function() {
    return this.panner.refDistance;
}, THREE.Audio.prototype.setRolloffFactor = function(value) {
    this.panner.rolloffFactor = value;
}, THREE.Audio.prototype.getRolloffFactor = function() {
    return this.panner.rolloffFactor;
}, THREE.Audio.prototype.setVolume = function(value) {
    this.gain.gain.value = value;
}, THREE.Audio.prototype.getVolume = function() {
    return this.gain.gain.value;
}, THREE.Audio.prototype.updateMatrixWorld = function() {
    var position = new THREE.Vector3();
    return function(force) {
        THREE.Object3D.prototype.updateMatrixWorld.call(this, force), position.setFromMatrixPosition(this.matrixWorld), 
        this.panner.setPosition(position.x, position.y, position.z);
    };
}(), THREE.AudioListener = function() {
    THREE.Object3D.call(this), this.type = "AudioListener", this.context = new (window.AudioContext || window.webkitAudioContext)();
}, THREE.AudioListener.prototype = Object.create(THREE.Object3D.prototype), THREE.AudioListener.prototype.constructor = THREE.AudioListener, 
THREE.AudioListener.prototype.updateMatrixWorld = function() {
    var position = new THREE.Vector3(), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3(), orientation = new THREE.Vector3();
    return function(force) {
        THREE.Object3D.prototype.updateMatrixWorld.call(this, force);
        var listener = this.context.listener, up = this.up;
        this.matrixWorld.decompose(position, quaternion, scale), orientation.set(0, 0, -1).applyQuaternion(quaternion), 
        listener.setPosition(position.x, position.y, position.z), listener.setOrientation(orientation.x, orientation.y, orientation.z, up.x, up.y, up.z);
    };
}(), THREE.Curve = function() {}, THREE.Curve.prototype = {
    constructor: THREE.Curve,
    getPoint: function(t) {
        return console.warn("THREE.Curve: Warning, getPoint() not implemented!"), null;
    },
    getPointAt: function(u) {
        var t = this.getUtoTmapping(u);
        return this.getPoint(t);
    },
    getPoints: function(divisions) {
        divisions || (divisions = 5);
        var d, pts = [];
        for (d = 0; divisions >= d; d++) pts.push(this.getPoint(d / divisions));
        return pts;
    },
    getSpacedPoints: function(divisions) {
        divisions || (divisions = 5);
        var d, pts = [];
        for (d = 0; divisions >= d; d++) pts.push(this.getPointAt(d / divisions));
        return pts;
    },
    getLength: function() {
        var lengths = this.getLengths();
        return lengths[lengths.length - 1];
    },
    getLengths: function(divisions) {
        if (divisions || (divisions = this.__arcLengthDivisions ? this.__arcLengthDivisions : 200), 
        this.cacheArcLengths && this.cacheArcLengths.length === divisions + 1 && !this.needsUpdate) return this.cacheArcLengths;
        this.needsUpdate = !1;
        var current, p, cache = [], last = this.getPoint(0), sum = 0;
        for (cache.push(0), p = 1; divisions >= p; p++) current = this.getPoint(p / divisions), 
        sum += current.distanceTo(last), cache.push(sum), last = current;
        return this.cacheArcLengths = cache, cache;
    },
    updateArcLengths: function() {
        this.needsUpdate = !0, this.getLengths();
    },
    getUtoTmapping: function(u, distance) {
        var targetArcLength, arcLengths = this.getLengths(), i = 0, il = arcLengths.length;
        targetArcLength = distance ? distance : u * arcLengths[il - 1];
        for (var comparison, low = 0, high = il - 1; high >= low; ) if (i = Math.floor(low + (high - low) / 2), 
        comparison = arcLengths[i] - targetArcLength, 0 > comparison) low = i + 1; else {
            if (!(comparison > 0)) {
                high = i;
                break;
            }
            high = i - 1;
        }
        if (i = high, arcLengths[i] === targetArcLength) {
            var t = i / (il - 1);
            return t;
        }
        var lengthBefore = arcLengths[i], lengthAfter = arcLengths[i + 1], segmentLength = lengthAfter - lengthBefore, segmentFraction = (targetArcLength - lengthBefore) / segmentLength, t = (i + segmentFraction) / (il - 1);
        return t;
    },
    getTangent: function(t) {
        var delta = 1e-4, t1 = t - delta, t2 = t + delta;
        0 > t1 && (t1 = 0), t2 > 1 && (t2 = 1);
        var pt1 = this.getPoint(t1), pt2 = this.getPoint(t2), vec = pt2.clone().sub(pt1);
        return vec.normalize();
    },
    getTangentAt: function(u) {
        var t = this.getUtoTmapping(u);
        return this.getTangent(t);
    }
}, THREE.Curve.Utils = THREE.CurveUtils, THREE.Curve.create = function(constructor, getPointFunc) {
    return constructor.prototype = Object.create(THREE.Curve.prototype), constructor.prototype.constructor = constructor, 
    constructor.prototype.getPoint = getPointFunc, constructor;
}, THREE.CurvePath = function() {
    this.curves = [], this.autoClose = !1;
}, THREE.CurvePath.prototype = Object.create(THREE.Curve.prototype), THREE.CurvePath.prototype.constructor = THREE.CurvePath, 
THREE.CurvePath.prototype.add = function(curve) {
    this.curves.push(curve);
}, THREE.CurvePath.prototype.closePath = function() {
    var startPoint = this.curves[0].getPoint(0), endPoint = this.curves[this.curves.length - 1].getPoint(1);
    startPoint.equals(endPoint) || this.curves.push(new THREE.LineCurve(endPoint, startPoint));
}, THREE.CurvePath.prototype.getPoint = function(t) {
    for (var d = t * this.getLength(), curveLengths = this.getCurveLengths(), i = 0; i < curveLengths.length; ) {
        if (curveLengths[i] >= d) {
            var diff = curveLengths[i] - d, curve = this.curves[i], u = 1 - diff / curve.getLength();
            return curve.getPointAt(u);
        }
        i++;
    }
    return null;
}, THREE.CurvePath.prototype.getLength = function() {
    var lens = this.getCurveLengths();
    return lens[lens.length - 1];
}, THREE.CurvePath.prototype.getCurveLengths = function() {
    if (this.cacheLengths && this.cacheLengths.length === this.curves.length) return this.cacheLengths;
    for (var lengths = [], sums = 0, i = 0, l = this.curves.length; l > i; i++) sums += this.curves[i].getLength(), 
    lengths.push(sums);
    return this.cacheLengths = lengths, lengths;
}, THREE.CurvePath.prototype.createPointsGeometry = function(divisions) {
    var pts = this.getPoints(divisions, !0);
    return this.createGeometry(pts);
}, THREE.CurvePath.prototype.createSpacedPointsGeometry = function(divisions) {
    var pts = this.getSpacedPoints(divisions, !0);
    return this.createGeometry(pts);
}, THREE.CurvePath.prototype.createGeometry = function(points) {
    for (var geometry = new THREE.Geometry(), i = 0, l = points.length; l > i; i++) {
        var point = points[i];
        geometry.vertices.push(new THREE.Vector3(point.x, point.y, point.z || 0));
    }
    return geometry;
}, THREE.Path = function(points) {
    THREE.CurvePath.call(this), this.actions = [], points && this.fromPoints(points);
}, THREE.Path.prototype = Object.create(THREE.CurvePath.prototype), THREE.Path.prototype.constructor = THREE.Path, 
THREE.Path.prototype.fromPoints = function(vectors) {
    this.moveTo(vectors[0].x, vectors[0].y);
    for (var i = 1, l = vectors.length; l > i; i++) this.lineTo(vectors[i].x, vectors[i].y);
}, THREE.Path.prototype.moveTo = function(x, y) {
    this.actions.push({
        action: "moveTo",
        args: [ x, y ]
    });
}, THREE.Path.prototype.lineTo = function(x, y) {
    var lastargs = this.actions[this.actions.length - 1].args, x0 = lastargs[lastargs.length - 2], y0 = lastargs[lastargs.length - 1], curve = new THREE.LineCurve(new THREE.Vector2(x0, y0), new THREE.Vector2(x, y));
    this.curves.push(curve), this.actions.push({
        action: "lineTo",
        args: [ x, y ]
    });
}, THREE.Path.prototype.quadraticCurveTo = function(aCPx, aCPy, aX, aY) {
    var lastargs = this.actions[this.actions.length - 1].args, x0 = lastargs[lastargs.length - 2], y0 = lastargs[lastargs.length - 1], curve = new THREE.QuadraticBezierCurve(new THREE.Vector2(x0, y0), new THREE.Vector2(aCPx, aCPy), new THREE.Vector2(aX, aY));
    this.curves.push(curve), this.actions.push({
        action: "quadraticCurveTo",
        args: [ aCPx, aCPy, aX, aY ]
    });
}, THREE.Path.prototype.bezierCurveTo = function(aCP1x, aCP1y, aCP2x, aCP2y, aX, aY) {
    var lastargs = this.actions[this.actions.length - 1].args, x0 = lastargs[lastargs.length - 2], y0 = lastargs[lastargs.length - 1], curve = new THREE.CubicBezierCurve(new THREE.Vector2(x0, y0), new THREE.Vector2(aCP1x, aCP1y), new THREE.Vector2(aCP2x, aCP2y), new THREE.Vector2(aX, aY));
    this.curves.push(curve), this.actions.push({
        action: "bezierCurveTo",
        args: [ aCP1x, aCP1y, aCP2x, aCP2y, aX, aY ]
    });
}, THREE.Path.prototype.splineThru = function(pts) {
    var args = Array.prototype.slice.call(arguments), lastargs = this.actions[this.actions.length - 1].args, x0 = lastargs[lastargs.length - 2], y0 = lastargs[lastargs.length - 1], npts = [ new THREE.Vector2(x0, y0) ];
    Array.prototype.push.apply(npts, pts);
    var curve = new THREE.SplineCurve(npts);
    this.curves.push(curve), this.actions.push({
        action: "splineThru",
        args: args
    });
}, THREE.Path.prototype.arc = function(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
    var lastargs = this.actions[this.actions.length - 1].args, x0 = lastargs[lastargs.length - 2], y0 = lastargs[lastargs.length - 1];
    this.absarc(aX + x0, aY + y0, aRadius, aStartAngle, aEndAngle, aClockwise);
}, THREE.Path.prototype.absarc = function(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
    this.absellipse(aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise);
}, THREE.Path.prototype.ellipse = function(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation) {
    var lastargs = this.actions[this.actions.length - 1].args, x0 = lastargs[lastargs.length - 2], y0 = lastargs[lastargs.length - 1];
    this.absellipse(aX + x0, aY + y0, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation);
}, THREE.Path.prototype.absellipse = function(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation) {
    var args = [ aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation || 0 ], curve = new THREE.EllipseCurve(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation);
    this.curves.push(curve);
    var lastPoint = curve.getPoint(1);
    args.push(lastPoint.x), args.push(lastPoint.y), this.actions.push({
        action: "ellipse",
        args: args
    });
}, THREE.Path.prototype.getSpacedPoints = function(divisions, closedPath) {
    divisions || (divisions = 40);
    for (var points = [], i = 0; divisions > i; i++) points.push(this.getPoint(i / divisions));
    return points;
}, THREE.Path.prototype.getPoints = function(divisions, closedPath) {
    divisions = divisions || 12;
    for (var cpx, cpy, cpx2, cpy2, cpx1, cpy1, cpx0, cpy0, laste, tx, ty, b2 = THREE.ShapeUtils.b2, b3 = THREE.ShapeUtils.b3, points = [], i = 0, l = this.actions.length; l > i; i++) {
        var item = this.actions[i], action = item.action, args = item.args;
        switch (action) {
          case "moveTo":
            points.push(new THREE.Vector2(args[0], args[1]));
            break;

          case "lineTo":
            points.push(new THREE.Vector2(args[0], args[1]));
            break;

          case "quadraticCurveTo":
            cpx = args[2], cpy = args[3], cpx1 = args[0], cpy1 = args[1], points.length > 0 ? (laste = points[points.length - 1], 
            cpx0 = laste.x, cpy0 = laste.y) : (laste = this.actions[i - 1].args, cpx0 = laste[laste.length - 2], 
            cpy0 = laste[laste.length - 1]);
            for (var j = 1; divisions >= j; j++) {
                var t = j / divisions;
                tx = b2(t, cpx0, cpx1, cpx), ty = b2(t, cpy0, cpy1, cpy), points.push(new THREE.Vector2(tx, ty));
            }
            break;

          case "bezierCurveTo":
            cpx = args[4], cpy = args[5], cpx1 = args[0], cpy1 = args[1], cpx2 = args[2], cpy2 = args[3], 
            points.length > 0 ? (laste = points[points.length - 1], cpx0 = laste.x, cpy0 = laste.y) : (laste = this.actions[i - 1].args, 
            cpx0 = laste[laste.length - 2], cpy0 = laste[laste.length - 1]);
            for (var j = 1; divisions >= j; j++) {
                var t = j / divisions;
                tx = b3(t, cpx0, cpx1, cpx2, cpx), ty = b3(t, cpy0, cpy1, cpy2, cpy), points.push(new THREE.Vector2(tx, ty));
            }
            break;

          case "splineThru":
            laste = this.actions[i - 1].args;
            var last = new THREE.Vector2(laste[laste.length - 2], laste[laste.length - 1]), spts = [ last ], n = divisions * args[0].length;
            spts = spts.concat(args[0]);
            for (var spline = new THREE.SplineCurve(spts), j = 1; n >= j; j++) points.push(spline.getPointAt(j / n));
            break;

          case "arc":
            for (var angle, aX = args[0], aY = args[1], aRadius = args[2], aStartAngle = args[3], aEndAngle = args[4], aClockwise = !!args[5], deltaAngle = aEndAngle - aStartAngle, tdivisions = 2 * divisions, j = 1; tdivisions >= j; j++) {
                var t = j / tdivisions;
                aClockwise || (t = 1 - t), angle = aStartAngle + t * deltaAngle, tx = aX + aRadius * Math.cos(angle), 
                ty = aY + aRadius * Math.sin(angle), points.push(new THREE.Vector2(tx, ty));
            }
            break;

          case "ellipse":
            var angle, cos, sin, aX = args[0], aY = args[1], xRadius = args[2], yRadius = args[3], aStartAngle = args[4], aEndAngle = args[5], aClockwise = !!args[6], aRotation = args[7], deltaAngle = aEndAngle - aStartAngle, tdivisions = 2 * divisions;
            0 !== aRotation && (cos = Math.cos(aRotation), sin = Math.sin(aRotation));
            for (var j = 1; tdivisions >= j; j++) {
                var t = j / tdivisions;
                if (aClockwise || (t = 1 - t), angle = aStartAngle + t * deltaAngle, tx = aX + xRadius * Math.cos(angle), 
                ty = aY + yRadius * Math.sin(angle), 0 !== aRotation) {
                    var x = tx, y = ty;
                    tx = (x - aX) * cos - (y - aY) * sin + aX, ty = (x - aX) * sin + (y - aY) * cos + aY;
                }
                points.push(new THREE.Vector2(tx, ty));
            }
        }
    }
    var lastPoint = points[points.length - 1];
    return Math.abs(lastPoint.x - points[0].x) < Number.EPSILON && Math.abs(lastPoint.y - points[0].y) < Number.EPSILON && points.splice(points.length - 1, 1), 
    closedPath && points.push(points[0]), points;
}, THREE.Path.prototype.toShapes = function(isCCW, noHoles) {
    function extractSubpaths(inActions) {
        for (var subPaths = [], lastPath = new THREE.Path(), i = 0, l = inActions.length; l > i; i++) {
            var item = inActions[i], args = item.args, action = item.action;
            "moveTo" === action && 0 !== lastPath.actions.length && (subPaths.push(lastPath), 
            lastPath = new THREE.Path()), lastPath[action].apply(lastPath, args);
        }
        return 0 !== lastPath.actions.length && subPaths.push(lastPath), subPaths;
    }
    function toShapesNoHoles(inSubpaths) {
        for (var shapes = [], i = 0, l = inSubpaths.length; l > i; i++) {
            var tmpPath = inSubpaths[i], tmpShape = new THREE.Shape();
            tmpShape.actions = tmpPath.actions, tmpShape.curves = tmpPath.curves, shapes.push(tmpShape);
        }
        return shapes;
    }
    function isPointInsidePolygon(inPt, inPolygon) {
        for (var polyLen = inPolygon.length, inside = !1, p = polyLen - 1, q = 0; polyLen > q; p = q++) {
            var edgeLowPt = inPolygon[p], edgeHighPt = inPolygon[q], edgeDx = edgeHighPt.x - edgeLowPt.x, edgeDy = edgeHighPt.y - edgeLowPt.y;
            if (Math.abs(edgeDy) > Number.EPSILON) {
                if (0 > edgeDy && (edgeLowPt = inPolygon[q], edgeDx = -edgeDx, edgeHighPt = inPolygon[p], 
                edgeDy = -edgeDy), inPt.y < edgeLowPt.y || inPt.y > edgeHighPt.y) continue;
                if (inPt.y === edgeLowPt.y) {
                    if (inPt.x === edgeLowPt.x) return !0;
                } else {
                    var perpEdge = edgeDy * (inPt.x - edgeLowPt.x) - edgeDx * (inPt.y - edgeLowPt.y);
                    if (0 === perpEdge) return !0;
                    if (0 > perpEdge) continue;
                    inside = !inside;
                }
            } else {
                if (inPt.y !== edgeLowPt.y) continue;
                if (edgeHighPt.x <= inPt.x && inPt.x <= edgeLowPt.x || edgeLowPt.x <= inPt.x && inPt.x <= edgeHighPt.x) return !0;
            }
        }
        return inside;
    }
    var isClockWise = THREE.ShapeUtils.isClockWise, subPaths = extractSubpaths(this.actions);
    if (0 === subPaths.length) return [];
    if (noHoles === !0) return toShapesNoHoles(subPaths);
    var solid, tmpPath, tmpShape, shapes = [];
    if (1 === subPaths.length) return tmpPath = subPaths[0], tmpShape = new THREE.Shape(), 
    tmpShape.actions = tmpPath.actions, tmpShape.curves = tmpPath.curves, shapes.push(tmpShape), 
    shapes;
    var holesFirst = !isClockWise(subPaths[0].getPoints());
    holesFirst = isCCW ? !holesFirst : holesFirst;
    var tmpPoints, betterShapeHoles = [], newShapes = [], newShapeHoles = [], mainIdx = 0;
    newShapes[mainIdx] = void 0, newShapeHoles[mainIdx] = [];
    for (var i = 0, l = subPaths.length; l > i; i++) tmpPath = subPaths[i], tmpPoints = tmpPath.getPoints(), 
    solid = isClockWise(tmpPoints), solid = isCCW ? !solid : solid, solid ? (!holesFirst && newShapes[mainIdx] && mainIdx++, 
    newShapes[mainIdx] = {
        s: new THREE.Shape(),
        p: tmpPoints
    }, newShapes[mainIdx].s.actions = tmpPath.actions, newShapes[mainIdx].s.curves = tmpPath.curves, 
    holesFirst && mainIdx++, newShapeHoles[mainIdx] = []) : newShapeHoles[mainIdx].push({
        h: tmpPath,
        p: tmpPoints[0]
    });
    if (!newShapes[0]) return toShapesNoHoles(subPaths);
    if (newShapes.length > 1) {
        for (var ambiguous = !1, toChange = [], sIdx = 0, sLen = newShapes.length; sLen > sIdx; sIdx++) betterShapeHoles[sIdx] = [];
        for (var sIdx = 0, sLen = newShapes.length; sLen > sIdx; sIdx++) for (var sho = newShapeHoles[sIdx], hIdx = 0; hIdx < sho.length; hIdx++) {
            for (var ho = sho[hIdx], hole_unassigned = !0, s2Idx = 0; s2Idx < newShapes.length; s2Idx++) isPointInsidePolygon(ho.p, newShapes[s2Idx].p) && (sIdx !== s2Idx && toChange.push({
                froms: sIdx,
                tos: s2Idx,
                hole: hIdx
            }), hole_unassigned ? (hole_unassigned = !1, betterShapeHoles[s2Idx].push(ho)) : ambiguous = !0);
            hole_unassigned && betterShapeHoles[sIdx].push(ho);
        }
        toChange.length > 0 && (ambiguous || (newShapeHoles = betterShapeHoles));
    }
    for (var tmpHoles, i = 0, il = newShapes.length; il > i; i++) {
        tmpShape = newShapes[i].s, shapes.push(tmpShape), tmpHoles = newShapeHoles[i];
        for (var j = 0, jl = tmpHoles.length; jl > j; j++) tmpShape.holes.push(tmpHoles[j].h);
    }
    return shapes;
}, THREE.Shape = function() {
    THREE.Path.apply(this, arguments), this.holes = [];
}, THREE.Shape.prototype = Object.create(THREE.Path.prototype), THREE.Shape.prototype.constructor = THREE.Shape, 
THREE.Shape.prototype.extrude = function(options) {
    return new THREE.ExtrudeGeometry(this, options);
}, THREE.Shape.prototype.makeGeometry = function(options) {
    return new THREE.ShapeGeometry(this, options);
}, THREE.Shape.prototype.getPointsHoles = function(divisions) {
    for (var holesPts = [], i = 0, l = this.holes.length; l > i; i++) holesPts[i] = this.holes[i].getPoints(divisions);
    return holesPts;
}, THREE.Shape.prototype.extractAllPoints = function(divisions) {
    return {
        shape: this.getPoints(divisions),
        holes: this.getPointsHoles(divisions)
    };
}, THREE.Shape.prototype.extractPoints = function(divisions) {
    return this.extractAllPoints(divisions);
}, THREE.Shape.Utils = THREE.ShapeUtils, THREE.LineCurve = function(v1, v2) {
    this.v1 = v1, this.v2 = v2;
}, THREE.LineCurve.prototype = Object.create(THREE.Curve.prototype), THREE.LineCurve.prototype.constructor = THREE.LineCurve, 
THREE.LineCurve.prototype.getPoint = function(t) {
    var point = this.v2.clone().sub(this.v1);
    return point.multiplyScalar(t).add(this.v1), point;
}, THREE.LineCurve.prototype.getPointAt = function(u) {
    return this.getPoint(u);
}, THREE.LineCurve.prototype.getTangent = function(t) {
    var tangent = this.v2.clone().sub(this.v1);
    return tangent.normalize();
}, THREE.QuadraticBezierCurve = function(v0, v1, v2) {
    this.v0 = v0, this.v1 = v1, this.v2 = v2;
}, THREE.QuadraticBezierCurve.prototype = Object.create(THREE.Curve.prototype), 
THREE.QuadraticBezierCurve.prototype.constructor = THREE.QuadraticBezierCurve, THREE.QuadraticBezierCurve.prototype.getPoint = function(t) {
    var b2 = THREE.ShapeUtils.b2;
    return new THREE.Vector2(b2(t, this.v0.x, this.v1.x, this.v2.x), b2(t, this.v0.y, this.v1.y, this.v2.y));
}, THREE.QuadraticBezierCurve.prototype.getTangent = function(t) {
    var tangentQuadraticBezier = THREE.CurveUtils.tangentQuadraticBezier;
    return new THREE.Vector2(tangentQuadraticBezier(t, this.v0.x, this.v1.x, this.v2.x), tangentQuadraticBezier(t, this.v0.y, this.v1.y, this.v2.y)).normalize();
}, THREE.CubicBezierCurve = function(v0, v1, v2, v3) {
    this.v0 = v0, this.v1 = v1, this.v2 = v2, this.v3 = v3;
}, THREE.CubicBezierCurve.prototype = Object.create(THREE.Curve.prototype), THREE.CubicBezierCurve.prototype.constructor = THREE.CubicBezierCurve, 
THREE.CubicBezierCurve.prototype.getPoint = function(t) {
    var b3 = THREE.ShapeUtils.b3;
    return new THREE.Vector2(b3(t, this.v0.x, this.v1.x, this.v2.x, this.v3.x), b3(t, this.v0.y, this.v1.y, this.v2.y, this.v3.y));
}, THREE.CubicBezierCurve.prototype.getTangent = function(t) {
    var tangentCubicBezier = THREE.CurveUtils.tangentCubicBezier;
    return new THREE.Vector2(tangentCubicBezier(t, this.v0.x, this.v1.x, this.v2.x, this.v3.x), tangentCubicBezier(t, this.v0.y, this.v1.y, this.v2.y, this.v3.y)).normalize();
}, THREE.SplineCurve = function(points) {
    this.points = void 0 == points ? [] : points;
}, THREE.SplineCurve.prototype = Object.create(THREE.Curve.prototype), THREE.SplineCurve.prototype.constructor = THREE.SplineCurve, 
THREE.SplineCurve.prototype.getPoint = function(t) {
    var points = this.points, point = (points.length - 1) * t, intPoint = Math.floor(point), weight = point - intPoint, point0 = points[0 === intPoint ? intPoint : intPoint - 1], point1 = points[intPoint], point2 = points[intPoint > points.length - 2 ? points.length - 1 : intPoint + 1], point3 = points[intPoint > points.length - 3 ? points.length - 1 : intPoint + 2], interpolate = THREE.CurveUtils.interpolate;
    return new THREE.Vector2(interpolate(point0.x, point1.x, point2.x, point3.x, weight), interpolate(point0.y, point1.y, point2.y, point3.y, weight));
}, THREE.EllipseCurve = function(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation) {
    this.aX = aX, this.aY = aY, this.xRadius = xRadius, this.yRadius = yRadius, this.aStartAngle = aStartAngle, 
    this.aEndAngle = aEndAngle, this.aClockwise = aClockwise, this.aRotation = aRotation || 0;
}, THREE.EllipseCurve.prototype = Object.create(THREE.Curve.prototype), THREE.EllipseCurve.prototype.constructor = THREE.EllipseCurve, 
THREE.EllipseCurve.prototype.getPoint = function(t) {
    var deltaAngle = this.aEndAngle - this.aStartAngle;
    0 > deltaAngle && (deltaAngle += 2 * Math.PI), deltaAngle > 2 * Math.PI && (deltaAngle -= 2 * Math.PI);
    var angle;
    angle = this.aClockwise === !0 ? this.aEndAngle + (1 - t) * (2 * Math.PI - deltaAngle) : this.aStartAngle + t * deltaAngle;
    var x = this.aX + this.xRadius * Math.cos(angle), y = this.aY + this.yRadius * Math.sin(angle);
    if (0 !== this.aRotation) {
        var cos = Math.cos(this.aRotation), sin = Math.sin(this.aRotation), tx = x, ty = y;
        x = (tx - this.aX) * cos - (ty - this.aY) * sin + this.aX, y = (tx - this.aX) * sin + (ty - this.aY) * cos + this.aY;
    }
    return new THREE.Vector2(x, y);
}, THREE.ArcCurve = function(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
    THREE.EllipseCurve.call(this, aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise);
}, THREE.ArcCurve.prototype = Object.create(THREE.EllipseCurve.prototype), THREE.ArcCurve.prototype.constructor = THREE.ArcCurve, 
THREE.LineCurve3 = THREE.Curve.create(function(v1, v2) {
    this.v1 = v1, this.v2 = v2;
}, function(t) {
    var vector = new THREE.Vector3();
    return vector.subVectors(this.v2, this.v1), vector.multiplyScalar(t), vector.add(this.v1), 
    vector;
}), THREE.QuadraticBezierCurve3 = THREE.Curve.create(function(v0, v1, v2) {
    this.v0 = v0, this.v1 = v1, this.v2 = v2;
}, function(t) {
    var b2 = THREE.ShapeUtils.b2;
    return new THREE.Vector3(b2(t, this.v0.x, this.v1.x, this.v2.x), b2(t, this.v0.y, this.v1.y, this.v2.y), b2(t, this.v0.z, this.v1.z, this.v2.z));
}), THREE.CubicBezierCurve3 = THREE.Curve.create(function(v0, v1, v2, v3) {
    this.v0 = v0, this.v1 = v1, this.v2 = v2, this.v3 = v3;
}, function(t) {
    var b3 = THREE.ShapeUtils.b3;
    return new THREE.Vector3(b3(t, this.v0.x, this.v1.x, this.v2.x, this.v3.x), b3(t, this.v0.y, this.v1.y, this.v2.y, this.v3.y), b3(t, this.v0.z, this.v1.z, this.v2.z, this.v3.z));
}), THREE.SplineCurve3 = THREE.Curve.create(function(points) {
    console.warn("THREE.SplineCurve3 will be deprecated. Please use THREE.CatmullRomCurve3"), 
    this.points = void 0 == points ? [] : points;
}, function(t) {
    var points = this.points, point = (points.length - 1) * t, intPoint = Math.floor(point), weight = point - intPoint, point0 = points[0 == intPoint ? intPoint : intPoint - 1], point1 = points[intPoint], point2 = points[intPoint > points.length - 2 ? points.length - 1 : intPoint + 1], point3 = points[intPoint > points.length - 3 ? points.length - 1 : intPoint + 2], interpolate = THREE.CurveUtils.interpolate;
    return new THREE.Vector3(interpolate(point0.x, point1.x, point2.x, point3.x, weight), interpolate(point0.y, point1.y, point2.y, point3.y, weight), interpolate(point0.z, point1.z, point2.z, point3.z, weight));
}), THREE.CatmullRomCurve3 = function() {
    function CubicPoly() {}
    var tmp = new THREE.Vector3(), px = new CubicPoly(), py = new CubicPoly(), pz = new CubicPoly();
    return CubicPoly.prototype.init = function(x0, x1, t0, t1) {
        this.c0 = x0, this.c1 = t0, this.c2 = -3 * x0 + 3 * x1 - 2 * t0 - t1, this.c3 = 2 * x0 - 2 * x1 + t0 + t1;
    }, CubicPoly.prototype.initNonuniformCatmullRom = function(x0, x1, x2, x3, dt0, dt1, dt2) {
        var t1 = (x1 - x0) / dt0 - (x2 - x0) / (dt0 + dt1) + (x2 - x1) / dt1, t2 = (x2 - x1) / dt1 - (x3 - x1) / (dt1 + dt2) + (x3 - x2) / dt2;
        t1 *= dt1, t2 *= dt1, this.init(x1, x2, t1, t2);
    }, CubicPoly.prototype.initCatmullRom = function(x0, x1, x2, x3, tension) {
        this.init(x1, x2, tension * (x2 - x0), tension * (x3 - x1));
    }, CubicPoly.prototype.calc = function(t) {
        var t2 = t * t, t3 = t2 * t;
        return this.c0 + this.c1 * t + this.c2 * t2 + this.c3 * t3;
    }, THREE.Curve.create(function(p) {
        this.points = p || [];
    }, function(t) {
        var point, intPoint, weight, l, points = this.points;
        l = points.length, 2 > l && console.log("duh, you need at least 2 points"), point = (l - 1) * t, 
        intPoint = Math.floor(point), weight = point - intPoint, 0 === weight && intPoint === l - 1 && (intPoint = l - 2, 
        weight = 1);
        var p0, p1, p2, p3;
        if (0 === intPoint ? (tmp.subVectors(points[0], points[1]).add(points[0]), p0 = tmp) : p0 = points[intPoint - 1], 
        p1 = points[intPoint], p2 = points[intPoint + 1], l > intPoint + 2 ? p3 = points[intPoint + 2] : (tmp.subVectors(points[l - 1], points[l - 2]).add(points[l - 2]), 
        p3 = tmp), void 0 === this.type || "centripetal" === this.type || "chordal" === this.type) {
            var pow = "chordal" === this.type ? .5 : .25, dt0 = Math.pow(p0.distanceToSquared(p1), pow), dt1 = Math.pow(p1.distanceToSquared(p2), pow), dt2 = Math.pow(p2.distanceToSquared(p3), pow);
            1e-4 > dt1 && (dt1 = 1), 1e-4 > dt0 && (dt0 = dt1), 1e-4 > dt2 && (dt2 = dt1), px.initNonuniformCatmullRom(p0.x, p1.x, p2.x, p3.x, dt0, dt1, dt2), 
            py.initNonuniformCatmullRom(p0.y, p1.y, p2.y, p3.y, dt0, dt1, dt2), pz.initNonuniformCatmullRom(p0.z, p1.z, p2.z, p3.z, dt0, dt1, dt2);
        } else if ("catmullrom" === this.type) {
            var tension = void 0 !== this.tension ? this.tension : .5;
            px.initCatmullRom(p0.x, p1.x, p2.x, p3.x, tension), py.initCatmullRom(p0.y, p1.y, p2.y, p3.y, tension), 
            pz.initCatmullRom(p0.z, p1.z, p2.z, p3.z, tension);
        }
        var v = new THREE.Vector3(px.calc(weight), py.calc(weight), pz.calc(weight));
        return v;
    });
}(), THREE.ClosedSplineCurve3 = THREE.Curve.create(function(points) {
    this.points = void 0 == points ? [] : points;
}, function(t) {
    var points = this.points, point = (points.length - 0) * t, intPoint = Math.floor(point), weight = point - intPoint;
    intPoint += intPoint > 0 ? 0 : (Math.floor(Math.abs(intPoint) / points.length) + 1) * points.length;
    var point0 = points[(intPoint - 1) % points.length], point1 = points[intPoint % points.length], point2 = points[(intPoint + 1) % points.length], point3 = points[(intPoint + 2) % points.length], interpolate = THREE.CurveUtils.interpolate;
    return new THREE.Vector3(interpolate(point0.x, point1.x, point2.x, point3.x, weight), interpolate(point0.y, point1.y, point2.y, point3.y, weight), interpolate(point0.z, point1.z, point2.z, point3.z, weight));
}), THREE.BoxGeometry = function(width, height, depth, widthSegments, heightSegments, depthSegments) {
    function buildPlane(u, v, udir, vdir, width, height, depth, materialIndex) {
        var w, ix, iy, gridX = scope.widthSegments, gridY = scope.heightSegments, width_half = width / 2, height_half = height / 2, offset = scope.vertices.length;
        "x" === u && "y" === v || "y" === u && "x" === v ? w = "z" : "x" === u && "z" === v || "z" === u && "x" === v ? (w = "y", 
        gridY = scope.depthSegments) : ("z" === u && "y" === v || "y" === u && "z" === v) && (w = "x", 
        gridX = scope.depthSegments);
        var gridX1 = gridX + 1, gridY1 = gridY + 1, segment_width = width / gridX, segment_height = height / gridY, normal = new THREE.Vector3();
        for (normal[w] = depth > 0 ? 1 : -1, iy = 0; gridY1 > iy; iy++) for (ix = 0; gridX1 > ix; ix++) {
            var vector = new THREE.Vector3();
            vector[u] = (ix * segment_width - width_half) * udir, vector[v] = (iy * segment_height - height_half) * vdir, 
            vector[w] = depth, scope.vertices.push(vector);
        }
        for (iy = 0; gridY > iy; iy++) for (ix = 0; gridX > ix; ix++) {
            var a = ix + gridX1 * iy, b = ix + gridX1 * (iy + 1), c = ix + 1 + gridX1 * (iy + 1), d = ix + 1 + gridX1 * iy, uva = new THREE.Vector2(ix / gridX, 1 - iy / gridY), uvb = new THREE.Vector2(ix / gridX, 1 - (iy + 1) / gridY), uvc = new THREE.Vector2((ix + 1) / gridX, 1 - (iy + 1) / gridY), uvd = new THREE.Vector2((ix + 1) / gridX, 1 - iy / gridY), face = new THREE.Face3(a + offset, b + offset, d + offset);
            face.normal.copy(normal), face.vertexNormals.push(normal.clone(), normal.clone(), normal.clone()), 
            face.materialIndex = materialIndex, scope.faces.push(face), scope.faceVertexUvs[0].push([ uva, uvb, uvd ]), 
            face = new THREE.Face3(b + offset, c + offset, d + offset), face.normal.copy(normal), 
            face.vertexNormals.push(normal.clone(), normal.clone(), normal.clone()), face.materialIndex = materialIndex, 
            scope.faces.push(face), scope.faceVertexUvs[0].push([ uvb.clone(), uvc, uvd.clone() ]);
        }
    }
    THREE.Geometry.call(this), this.type = "BoxGeometry", this.parameters = {
        width: width,
        height: height,
        depth: depth,
        widthSegments: widthSegments,
        heightSegments: heightSegments,
        depthSegments: depthSegments
    }, this.widthSegments = widthSegments || 1, this.heightSegments = heightSegments || 1, 
    this.depthSegments = depthSegments || 1;
    var scope = this, width_half = width / 2, height_half = height / 2, depth_half = depth / 2;
    buildPlane("z", "y", -1, -1, depth, height, width_half, 0), buildPlane("z", "y", 1, -1, depth, height, -width_half, 1), 
    buildPlane("x", "z", 1, 1, width, depth, height_half, 2), buildPlane("x", "z", 1, -1, width, depth, -height_half, 3), 
    buildPlane("x", "y", 1, -1, width, height, depth_half, 4), buildPlane("x", "y", -1, -1, width, height, -depth_half, 5), 
    this.mergeVertices();
}, THREE.BoxGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.BoxGeometry.prototype.constructor = THREE.BoxGeometry, 
THREE.BoxGeometry.prototype.clone = function() {
    var parameters = this.parameters;
    return new THREE.BoxGeometry(parameters.width, parameters.height, parameters.depth, parameters.widthSegments, parameters.heightSegments, parameters.depthSegments);
}, THREE.CubeGeometry = THREE.BoxGeometry, THREE.CircleGeometry = function(radius, segments, thetaStart, thetaLength) {
    THREE.Geometry.call(this), this.type = "CircleGeometry", this.parameters = {
        radius: radius,
        segments: segments,
        thetaStart: thetaStart,
        thetaLength: thetaLength
    }, this.fromBufferGeometry(new THREE.CircleBufferGeometry(radius, segments, thetaStart, thetaLength));
}, THREE.CircleGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.CircleGeometry.prototype.constructor = THREE.CircleGeometry, 
THREE.CircleGeometry.prototype.clone = function() {
    var parameters = this.parameters;
    return new THREE.CircleGeometry(parameters.radius, parameters.segments, parameters.thetaStart, parameters.thetaLength);
}, THREE.CircleBufferGeometry = function(radius, segments, thetaStart, thetaLength) {
    THREE.BufferGeometry.call(this), this.type = "CircleBufferGeometry", this.parameters = {
        radius: radius,
        segments: segments,
        thetaStart: thetaStart,
        thetaLength: thetaLength
    }, radius = radius || 50, segments = void 0 !== segments ? Math.max(3, segments) : 8, 
    thetaStart = void 0 !== thetaStart ? thetaStart : 0, thetaLength = void 0 !== thetaLength ? thetaLength : 2 * Math.PI;
    var vertices = segments + 2, positions = new Float32Array(3 * vertices), normals = new Float32Array(3 * vertices), uvs = new Float32Array(2 * vertices);
    normals[2] = 1, uvs[0] = .5, uvs[1] = .5;
    for (var s = 0, i = 3, ii = 2; segments >= s; s++, i += 3, ii += 2) {
        var segment = thetaStart + s / segments * thetaLength;
        positions[i] = radius * Math.cos(segment), positions[i + 1] = radius * Math.sin(segment), 
        normals[i + 2] = 1, uvs[ii] = (positions[i] / radius + 1) / 2, uvs[ii + 1] = (positions[i + 1] / radius + 1) / 2;
    }
    for (var indices = [], i = 1; segments >= i; i++) indices.push(i, i + 1, 0);
    this.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1)), this.addAttribute("position", new THREE.BufferAttribute(positions, 3)), 
    this.addAttribute("normal", new THREE.BufferAttribute(normals, 3)), this.addAttribute("uv", new THREE.BufferAttribute(uvs, 2)), 
    this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);
}, THREE.CircleBufferGeometry.prototype = Object.create(THREE.BufferGeometry.prototype), 
THREE.CircleBufferGeometry.prototype.constructor = THREE.CircleBufferGeometry, THREE.CircleBufferGeometry.prototype.clone = function() {
    var parameters = this.parameters;
    return new THREE.CircleBufferGeometry(parameters.radius, parameters.segments, parameters.thetaStart, parameters.thetaLength);
}, THREE.CylinderGeometry = function(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
    THREE.Geometry.call(this), this.type = "CylinderGeometry", this.parameters = {
        radiusTop: radiusTop,
        radiusBottom: radiusBottom,
        height: height,
        radialSegments: radialSegments,
        heightSegments: heightSegments,
        openEnded: openEnded,
        thetaStart: thetaStart,
        thetaLength: thetaLength
    }, radiusTop = void 0 !== radiusTop ? radiusTop : 20, radiusBottom = void 0 !== radiusBottom ? radiusBottom : 20, 
    height = void 0 !== height ? height : 100, radialSegments = radialSegments || 8, 
    heightSegments = heightSegments || 1, openEnded = void 0 !== openEnded ? openEnded : !1, 
    thetaStart = void 0 !== thetaStart ? thetaStart : 0, thetaLength = void 0 !== thetaLength ? thetaLength : 2 * Math.PI;
    var x, y, heightHalf = height / 2, vertices = [], uvs = [];
    for (y = 0; heightSegments >= y; y++) {
        var verticesRow = [], uvsRow = [], v = y / heightSegments, radius = v * (radiusBottom - radiusTop) + radiusTop;
        for (x = 0; radialSegments >= x; x++) {
            var u = x / radialSegments, vertex = new THREE.Vector3();
            vertex.x = radius * Math.sin(u * thetaLength + thetaStart), vertex.y = -v * height + heightHalf, 
            vertex.z = radius * Math.cos(u * thetaLength + thetaStart), this.vertices.push(vertex), 
            verticesRow.push(this.vertices.length - 1), uvsRow.push(new THREE.Vector2(u, 1 - v));
        }
        vertices.push(verticesRow), uvs.push(uvsRow);
    }
    var na, nb, tanTheta = (radiusBottom - radiusTop) / height;
    for (x = 0; radialSegments > x; x++) for (0 !== radiusTop ? (na = this.vertices[vertices[0][x]].clone(), 
    nb = this.vertices[vertices[0][x + 1]].clone()) : (na = this.vertices[vertices[1][x]].clone(), 
    nb = this.vertices[vertices[1][x + 1]].clone()), na.setY(Math.sqrt(na.x * na.x + na.z * na.z) * tanTheta).normalize(), 
    nb.setY(Math.sqrt(nb.x * nb.x + nb.z * nb.z) * tanTheta).normalize(), y = 0; heightSegments > y; y++) {
        var v1 = vertices[y][x], v2 = vertices[y + 1][x], v3 = vertices[y + 1][x + 1], v4 = vertices[y][x + 1], n1 = na.clone(), n2 = na.clone(), n3 = nb.clone(), n4 = nb.clone(), uv1 = uvs[y][x].clone(), uv2 = uvs[y + 1][x].clone(), uv3 = uvs[y + 1][x + 1].clone(), uv4 = uvs[y][x + 1].clone();
        this.faces.push(new THREE.Face3(v1, v2, v4, [ n1, n2, n4 ])), this.faceVertexUvs[0].push([ uv1, uv2, uv4 ]), 
        this.faces.push(new THREE.Face3(v2, v3, v4, [ n2.clone(), n3, n4.clone() ])), this.faceVertexUvs[0].push([ uv2.clone(), uv3, uv4.clone() ]);
    }
    if (openEnded === !1 && radiusTop > 0) for (this.vertices.push(new THREE.Vector3(0, heightHalf, 0)), 
    x = 0; radialSegments > x; x++) {
        var v1 = vertices[0][x], v2 = vertices[0][x + 1], v3 = this.vertices.length - 1, n1 = new THREE.Vector3(0, 1, 0), n2 = new THREE.Vector3(0, 1, 0), n3 = new THREE.Vector3(0, 1, 0), uv1 = uvs[0][x].clone(), uv2 = uvs[0][x + 1].clone(), uv3 = new THREE.Vector2(uv2.x, 0);
        this.faces.push(new THREE.Face3(v1, v2, v3, [ n1, n2, n3 ], void 0, 1)), this.faceVertexUvs[0].push([ uv1, uv2, uv3 ]);
    }
    if (openEnded === !1 && radiusBottom > 0) for (this.vertices.push(new THREE.Vector3(0, -heightHalf, 0)), 
    x = 0; radialSegments > x; x++) {
        var v1 = vertices[heightSegments][x + 1], v2 = vertices[heightSegments][x], v3 = this.vertices.length - 1, n1 = new THREE.Vector3(0, -1, 0), n2 = new THREE.Vector3(0, -1, 0), n3 = new THREE.Vector3(0, -1, 0), uv1 = uvs[heightSegments][x + 1].clone(), uv2 = uvs[heightSegments][x].clone(), uv3 = new THREE.Vector2(uv2.x, 1);
        this.faces.push(new THREE.Face3(v1, v2, v3, [ n1, n2, n3 ], void 0, 2)), this.faceVertexUvs[0].push([ uv1, uv2, uv3 ]);
    }
    this.computeFaceNormals();
}, THREE.CylinderGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.CylinderGeometry.prototype.constructor = THREE.CylinderGeometry, 
THREE.CylinderGeometry.prototype.clone = function() {
    var parameters = this.parameters;
    return new THREE.CylinderGeometry(parameters.radiusTop, parameters.radiusBottom, parameters.height, parameters.radialSegments, parameters.heightSegments, parameters.openEnded, parameters.thetaStart, parameters.thetaLength);
}, THREE.EdgesGeometry = function(geometry, thresholdAngle) {
    function sortFunction(a, b) {
        return a - b;
    }
    THREE.BufferGeometry.call(this), thresholdAngle = void 0 !== thresholdAngle ? thresholdAngle : 1;
    var geometry2, thresholdDot = Math.cos(THREE.Math.degToRad(thresholdAngle)), edge = [ 0, 0 ], hash = {}, keys = [ "a", "b", "c" ];
    geometry instanceof THREE.BufferGeometry ? (geometry2 = new THREE.Geometry(), geometry2.fromBufferGeometry(geometry)) : geometry2 = geometry.clone(), 
    geometry2.mergeVertices(), geometry2.computeFaceNormals();
    for (var vertices = geometry2.vertices, faces = geometry2.faces, i = 0, l = faces.length; l > i; i++) for (var face = faces[i], j = 0; 3 > j; j++) {
        edge[0] = face[keys[j]], edge[1] = face[keys[(j + 1) % 3]], edge.sort(sortFunction);
        var key = edge.toString();
        void 0 === hash[key] ? hash[key] = {
            vert1: edge[0],
            vert2: edge[1],
            face1: i,
            face2: void 0
        } : hash[key].face2 = i;
    }
    var coords = [];
    for (var key in hash) {
        var h = hash[key];
        if (void 0 === h.face2 || faces[h.face1].normal.dot(faces[h.face2].normal) <= thresholdDot) {
            var vertex = vertices[h.vert1];
            coords.push(vertex.x), coords.push(vertex.y), coords.push(vertex.z), vertex = vertices[h.vert2], 
            coords.push(vertex.x), coords.push(vertex.y), coords.push(vertex.z);
        }
    }
    this.addAttribute("position", new THREE.BufferAttribute(new Float32Array(coords), 3));
}, THREE.EdgesGeometry.prototype = Object.create(THREE.BufferGeometry.prototype), 
THREE.EdgesGeometry.prototype.constructor = THREE.EdgesGeometry, THREE.ExtrudeGeometry = function(shapes, options) {
    return "undefined" == typeof shapes ? void (shapes = []) : (THREE.Geometry.call(this), 
    this.type = "ExtrudeGeometry", shapes = Array.isArray(shapes) ? shapes : [ shapes ], 
    this.addShapeList(shapes, options), void this.computeFaceNormals());
}, THREE.ExtrudeGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.ExtrudeGeometry.prototype.constructor = THREE.ExtrudeGeometry, 
THREE.ExtrudeGeometry.prototype.addShapeList = function(shapes, options) {
    for (var sl = shapes.length, s = 0; sl > s; s++) {
        var shape = shapes[s];
        this.addShape(shape, options);
    }
}, THREE.ExtrudeGeometry.prototype.addShape = function(shape, options) {
    function scalePt2(pt, vec, size) {
        return vec || console.error("THREE.ExtrudeGeometry: vec does not exist"), vec.clone().multiplyScalar(size).add(pt);
    }
    function getBevelVec(inPt, inPrev, inNext) {
        var v_trans_x, v_trans_y, shrink_by = 1, v_prev_x = inPt.x - inPrev.x, v_prev_y = inPt.y - inPrev.y, v_next_x = inNext.x - inPt.x, v_next_y = inNext.y - inPt.y, v_prev_lensq = v_prev_x * v_prev_x + v_prev_y * v_prev_y, collinear0 = v_prev_x * v_next_y - v_prev_y * v_next_x;
        if (Math.abs(collinear0) > Number.EPSILON) {
            var v_prev_len = Math.sqrt(v_prev_lensq), v_next_len = Math.sqrt(v_next_x * v_next_x + v_next_y * v_next_y), ptPrevShift_x = inPrev.x - v_prev_y / v_prev_len, ptPrevShift_y = inPrev.y + v_prev_x / v_prev_len, ptNextShift_x = inNext.x - v_next_y / v_next_len, ptNextShift_y = inNext.y + v_next_x / v_next_len, sf = ((ptNextShift_x - ptPrevShift_x) * v_next_y - (ptNextShift_y - ptPrevShift_y) * v_next_x) / (v_prev_x * v_next_y - v_prev_y * v_next_x);
            v_trans_x = ptPrevShift_x + v_prev_x * sf - inPt.x, v_trans_y = ptPrevShift_y + v_prev_y * sf - inPt.y;
            var v_trans_lensq = v_trans_x * v_trans_x + v_trans_y * v_trans_y;
            if (2 >= v_trans_lensq) return new THREE.Vector2(v_trans_x, v_trans_y);
            shrink_by = Math.sqrt(v_trans_lensq / 2);
        } else {
            var direction_eq = !1;
            v_prev_x > Number.EPSILON ? v_next_x > Number.EPSILON && (direction_eq = !0) : v_prev_x < -Number.EPSILON ? v_next_x < -Number.EPSILON && (direction_eq = !0) : Math.sign(v_prev_y) === Math.sign(v_next_y) && (direction_eq = !0), 
            direction_eq ? (v_trans_x = -v_prev_y, v_trans_y = v_prev_x, shrink_by = Math.sqrt(v_prev_lensq)) : (v_trans_x = v_prev_x, 
            v_trans_y = v_prev_y, shrink_by = Math.sqrt(v_prev_lensq / 2));
        }
        return new THREE.Vector2(v_trans_x / shrink_by, v_trans_y / shrink_by);
    }
    function buildLidFaces() {
        if (bevelEnabled) {
            var layer = 0, offset = vlen * layer;
            for (i = 0; flen > i; i++) face = faces[i], f3(face[2] + offset, face[1] + offset, face[0] + offset);
            for (layer = steps + 2 * bevelSegments, offset = vlen * layer, i = 0; flen > i; i++) face = faces[i], 
            f3(face[0] + offset, face[1] + offset, face[2] + offset);
        } else {
            for (i = 0; flen > i; i++) face = faces[i], f3(face[2], face[1], face[0]);
            for (i = 0; flen > i; i++) face = faces[i], f3(face[0] + vlen * steps, face[1] + vlen * steps, face[2] + vlen * steps);
        }
    }
    function buildSideFaces() {
        var layeroffset = 0;
        for (sidewalls(contour, layeroffset), layeroffset += contour.length, h = 0, hl = holes.length; hl > h; h++) ahole = holes[h], 
        sidewalls(ahole, layeroffset), layeroffset += ahole.length;
    }
    function sidewalls(contour, layeroffset) {
        var j, k;
        for (i = contour.length; --i >= 0; ) {
            j = i, k = i - 1, 0 > k && (k = contour.length - 1);
            var s = 0, sl = steps + 2 * bevelSegments;
            for (s = 0; sl > s; s++) {
                var slen1 = vlen * s, slen2 = vlen * (s + 1), a = layeroffset + j + slen1, b = layeroffset + k + slen1, c = layeroffset + k + slen2, d = layeroffset + j + slen2;
                f4(a, b, c, d, contour, s, sl, j, k);
            }
        }
    }
    function v(x, y, z) {
        scope.vertices.push(new THREE.Vector3(x, y, z));
    }
    function f3(a, b, c) {
        a += shapesOffset, b += shapesOffset, c += shapesOffset, scope.faces.push(new THREE.Face3(a, b, c, null, null, 0));
        var uvs = uvgen.generateTopUV(scope, a, b, c);
        scope.faceVertexUvs[0].push(uvs);
    }
    function f4(a, b, c, d, wallContour, stepIndex, stepsLength, contourIndex1, contourIndex2) {
        a += shapesOffset, b += shapesOffset, c += shapesOffset, d += shapesOffset, scope.faces.push(new THREE.Face3(a, b, d, null, null, 1)), 
        scope.faces.push(new THREE.Face3(b, c, d, null, null, 1));
        var uvs = uvgen.generateSideWallUV(scope, a, b, c, d);
        scope.faceVertexUvs[0].push([ uvs[0], uvs[1], uvs[3] ]), scope.faceVertexUvs[0].push([ uvs[1], uvs[2], uvs[3] ]);
    }
    var extrudePts, splineTube, binormal, normal, position2, amount = void 0 !== options.amount ? options.amount : 100, bevelThickness = void 0 !== options.bevelThickness ? options.bevelThickness : 6, bevelSize = void 0 !== options.bevelSize ? options.bevelSize : bevelThickness - 2, bevelSegments = void 0 !== options.bevelSegments ? options.bevelSegments : 3, bevelEnabled = void 0 !== options.bevelEnabled ? options.bevelEnabled : !0, curveSegments = void 0 !== options.curveSegments ? options.curveSegments : 12, steps = void 0 !== options.steps ? options.steps : 1, extrudePath = options.extrudePath, extrudeByPath = !1, uvgen = void 0 !== options.UVGenerator ? options.UVGenerator : THREE.ExtrudeGeometry.WorldUVGenerator;
    extrudePath && (extrudePts = extrudePath.getSpacedPoints(steps), extrudeByPath = !0, 
    bevelEnabled = !1, splineTube = void 0 !== options.frames ? options.frames : new THREE.TubeGeometry.FrenetFrames(extrudePath, steps, !1), 
    binormal = new THREE.Vector3(), normal = new THREE.Vector3(), position2 = new THREE.Vector3()), 
    bevelEnabled || (bevelSegments = 0, bevelThickness = 0, bevelSize = 0);
    var ahole, h, hl, scope = this, shapesOffset = this.vertices.length, shapePoints = shape.extractPoints(curveSegments), vertices = shapePoints.shape, holes = shapePoints.holes, reverse = !THREE.ShapeUtils.isClockWise(vertices);
    if (reverse) {
        for (vertices = vertices.reverse(), h = 0, hl = holes.length; hl > h; h++) ahole = holes[h], 
        THREE.ShapeUtils.isClockWise(ahole) && (holes[h] = ahole.reverse());
        reverse = !1;
    }
    var faces = THREE.ShapeUtils.triangulateShape(vertices, holes), contour = vertices;
    for (h = 0, hl = holes.length; hl > h; h++) ahole = holes[h], vertices = vertices.concat(ahole);
    for (var b, bs, t, z, vert, face, vlen = vertices.length, flen = faces.length, contourMovements = [], i = 0, il = contour.length, j = il - 1, k = i + 1; il > i; i++, 
    j++, k++) j === il && (j = 0), k === il && (k = 0), contourMovements[i] = getBevelVec(contour[i], contour[j], contour[k]);
    var oneHoleMovements, holesMovements = [], verticesMovements = contourMovements.concat();
    for (h = 0, hl = holes.length; hl > h; h++) {
        for (ahole = holes[h], oneHoleMovements = [], i = 0, il = ahole.length, j = il - 1, 
        k = i + 1; il > i; i++, j++, k++) j === il && (j = 0), k === il && (k = 0), oneHoleMovements[i] = getBevelVec(ahole[i], ahole[j], ahole[k]);
        holesMovements.push(oneHoleMovements), verticesMovements = verticesMovements.concat(oneHoleMovements);
    }
    for (b = 0; bevelSegments > b; b++) {
        for (t = b / bevelSegments, z = bevelThickness * (1 - t), bs = bevelSize * Math.sin(t * Math.PI / 2), 
        i = 0, il = contour.length; il > i; i++) vert = scalePt2(contour[i], contourMovements[i], bs), 
        v(vert.x, vert.y, -z);
        for (h = 0, hl = holes.length; hl > h; h++) for (ahole = holes[h], oneHoleMovements = holesMovements[h], 
        i = 0, il = ahole.length; il > i; i++) vert = scalePt2(ahole[i], oneHoleMovements[i], bs), 
        v(vert.x, vert.y, -z);
    }
    for (bs = bevelSize, i = 0; vlen > i; i++) vert = bevelEnabled ? scalePt2(vertices[i], verticesMovements[i], bs) : vertices[i], 
    extrudeByPath ? (normal.copy(splineTube.normals[0]).multiplyScalar(vert.x), binormal.copy(splineTube.binormals[0]).multiplyScalar(vert.y), 
    position2.copy(extrudePts[0]).add(normal).add(binormal), v(position2.x, position2.y, position2.z)) : v(vert.x, vert.y, 0);
    var s;
    for (s = 1; steps >= s; s++) for (i = 0; vlen > i; i++) vert = bevelEnabled ? scalePt2(vertices[i], verticesMovements[i], bs) : vertices[i], 
    extrudeByPath ? (normal.copy(splineTube.normals[s]).multiplyScalar(vert.x), binormal.copy(splineTube.binormals[s]).multiplyScalar(vert.y), 
    position2.copy(extrudePts[s]).add(normal).add(binormal), v(position2.x, position2.y, position2.z)) : v(vert.x, vert.y, amount / steps * s);
    for (b = bevelSegments - 1; b >= 0; b--) {
        for (t = b / bevelSegments, z = bevelThickness * (1 - t), bs = bevelSize * Math.sin(t * Math.PI / 2), 
        i = 0, il = contour.length; il > i; i++) vert = scalePt2(contour[i], contourMovements[i], bs), 
        v(vert.x, vert.y, amount + z);
        for (h = 0, hl = holes.length; hl > h; h++) for (ahole = holes[h], oneHoleMovements = holesMovements[h], 
        i = 0, il = ahole.length; il > i; i++) vert = scalePt2(ahole[i], oneHoleMovements[i], bs), 
        extrudeByPath ? v(vert.x, vert.y + extrudePts[steps - 1].y, extrudePts[steps - 1].x + z) : v(vert.x, vert.y, amount + z);
    }
    buildLidFaces(), buildSideFaces();
}, THREE.ExtrudeGeometry.WorldUVGenerator = {
    generateTopUV: function(geometry, indexA, indexB, indexC) {
        var vertices = geometry.vertices, a = vertices[indexA], b = vertices[indexB], c = vertices[indexC];
        return [ new THREE.Vector2(a.x, a.y), new THREE.Vector2(b.x, b.y), new THREE.Vector2(c.x, c.y) ];
    },
    generateSideWallUV: function(geometry, indexA, indexB, indexC, indexD) {
        var vertices = geometry.vertices, a = vertices[indexA], b = vertices[indexB], c = vertices[indexC], d = vertices[indexD];
        return Math.abs(a.y - b.y) < .01 ? [ new THREE.Vector2(a.x, 1 - a.z), new THREE.Vector2(b.x, 1 - b.z), new THREE.Vector2(c.x, 1 - c.z), new THREE.Vector2(d.x, 1 - d.z) ] : [ new THREE.Vector2(a.y, 1 - a.z), new THREE.Vector2(b.y, 1 - b.z), new THREE.Vector2(c.y, 1 - c.z), new THREE.Vector2(d.y, 1 - d.z) ];
    }
}, THREE.ShapeGeometry = function(shapes, options) {
    THREE.Geometry.call(this), this.type = "ShapeGeometry", Array.isArray(shapes) === !1 && (shapes = [ shapes ]), 
    this.addShapeList(shapes, options), this.computeFaceNormals();
}, THREE.ShapeGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.ShapeGeometry.prototype.constructor = THREE.ShapeGeometry, 
THREE.ShapeGeometry.prototype.addShapeList = function(shapes, options) {
    for (var i = 0, l = shapes.length; l > i; i++) this.addShape(shapes[i], options);
    return this;
}, THREE.ShapeGeometry.prototype.addShape = function(shape, options) {
    void 0 === options && (options = {});
    var i, l, hole, curveSegments = void 0 !== options.curveSegments ? options.curveSegments : 12, material = options.material, uvgen = void 0 === options.UVGenerator ? THREE.ExtrudeGeometry.WorldUVGenerator : options.UVGenerator, shapesOffset = this.vertices.length, shapePoints = shape.extractPoints(curveSegments), vertices = shapePoints.shape, holes = shapePoints.holes, reverse = !THREE.ShapeUtils.isClockWise(vertices);
    if (reverse) {
        for (vertices = vertices.reverse(), i = 0, l = holes.length; l > i; i++) hole = holes[i], 
        THREE.ShapeUtils.isClockWise(hole) && (holes[i] = hole.reverse());
        reverse = !1;
    }
    var faces = THREE.ShapeUtils.triangulateShape(vertices, holes);
    for (i = 0, l = holes.length; l > i; i++) hole = holes[i], vertices = vertices.concat(hole);
    var vert, face, vlen = vertices.length, flen = faces.length;
    for (i = 0; vlen > i; i++) vert = vertices[i], this.vertices.push(new THREE.Vector3(vert.x, vert.y, 0));
    for (i = 0; flen > i; i++) {
        face = faces[i];
        var a = face[0] + shapesOffset, b = face[1] + shapesOffset, c = face[2] + shapesOffset;
        this.faces.push(new THREE.Face3(a, b, c, null, null, material)), this.faceVertexUvs[0].push(uvgen.generateTopUV(this, a, b, c));
    }
}, THREE.LatheGeometry = function(points, segments, phiStart, phiLength) {
    THREE.Geometry.call(this), this.type = "LatheGeometry", this.parameters = {
        points: points,
        segments: segments,
        phiStart: phiStart,
        phiLength: phiLength
    }, segments = segments || 12, phiStart = phiStart || 0, phiLength = phiLength || 2 * Math.PI;
    for (var inversePointLength = 1 / (points.length - 1), inverseSegments = 1 / segments, i = 0, il = segments; il >= i; i++) for (var phi = phiStart + i * inverseSegments * phiLength, c = Math.cos(phi), s = Math.sin(phi), j = 0, jl = points.length; jl > j; j++) {
        var pt = points[j], vertex = new THREE.Vector3();
        vertex.x = c * pt.x - s * pt.y, vertex.y = s * pt.x + c * pt.y, vertex.z = pt.z, 
        this.vertices.push(vertex);
    }
    for (var np = points.length, i = 0, il = segments; il > i; i++) for (var j = 0, jl = points.length - 1; jl > j; j++) {
        var base = j + np * i, a = base, b = base + np, c = base + 1 + np, d = base + 1, u0 = i * inverseSegments, v0 = j * inversePointLength, u1 = u0 + inverseSegments, v1 = v0 + inversePointLength;
        this.faces.push(new THREE.Face3(a, b, d)), this.faceVertexUvs[0].push([ new THREE.Vector2(u0, v0), new THREE.Vector2(u1, v0), new THREE.Vector2(u0, v1) ]), 
        this.faces.push(new THREE.Face3(b, c, d)), this.faceVertexUvs[0].push([ new THREE.Vector2(u1, v0), new THREE.Vector2(u1, v1), new THREE.Vector2(u0, v1) ]);
    }
    this.mergeVertices(), this.computeFaceNormals(), this.computeVertexNormals();
}, THREE.LatheGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.LatheGeometry.prototype.constructor = THREE.LatheGeometry, 
THREE.PlaneGeometry = function(width, height, widthSegments, heightSegments) {
    THREE.Geometry.call(this), this.type = "PlaneGeometry", this.parameters = {
        width: width,
        height: height,
        widthSegments: widthSegments,
        heightSegments: heightSegments
    }, this.fromBufferGeometry(new THREE.PlaneBufferGeometry(width, height, widthSegments, heightSegments));
}, THREE.PlaneGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.PlaneGeometry.prototype.constructor = THREE.PlaneGeometry, 
THREE.PlaneGeometry.prototype.clone = function() {
    var parameters = this.parameters;
    return new THREE.PlaneGeometry(parameters.width, parameters.height, parameters.widthSegments, parameters.heightSegments);
}, THREE.PlaneBufferGeometry = function(width, height, widthSegments, heightSegments) {
    THREE.BufferGeometry.call(this), this.type = "PlaneBufferGeometry", this.parameters = {
        width: width,
        height: height,
        widthSegments: widthSegments,
        heightSegments: heightSegments
    };
    for (var width_half = width / 2, height_half = height / 2, gridX = Math.floor(widthSegments) || 1, gridY = Math.floor(heightSegments) || 1, gridX1 = gridX + 1, gridY1 = gridY + 1, segment_width = width / gridX, segment_height = height / gridY, vertices = new Float32Array(gridX1 * gridY1 * 3), normals = new Float32Array(gridX1 * gridY1 * 3), uvs = new Float32Array(gridX1 * gridY1 * 2), offset = 0, offset2 = 0, iy = 0; gridY1 > iy; iy++) for (var y = iy * segment_height - height_half, ix = 0; gridX1 > ix; ix++) {
        var x = ix * segment_width - width_half;
        vertices[offset] = x, vertices[offset + 1] = -y, normals[offset + 2] = 1, uvs[offset2] = ix / gridX, 
        uvs[offset2 + 1] = 1 - iy / gridY, offset += 3, offset2 += 2;
    }
    offset = 0;
    for (var indices = new (vertices.length / 3 > 65535 ? Uint32Array : Uint16Array)(gridX * gridY * 6), iy = 0; gridY > iy; iy++) for (var ix = 0; gridX > ix; ix++) {
        var a = ix + gridX1 * iy, b = ix + gridX1 * (iy + 1), c = ix + 1 + gridX1 * (iy + 1), d = ix + 1 + gridX1 * iy;
        indices[offset] = a, indices[offset + 1] = b, indices[offset + 2] = d, indices[offset + 3] = b, 
        indices[offset + 4] = c, indices[offset + 5] = d, offset += 6;
    }
    this.setIndex(new THREE.BufferAttribute(indices, 1)), this.addAttribute("position", new THREE.BufferAttribute(vertices, 3)), 
    this.addAttribute("normal", new THREE.BufferAttribute(normals, 3)), this.addAttribute("uv", new THREE.BufferAttribute(uvs, 2));
}, THREE.PlaneBufferGeometry.prototype = Object.create(THREE.BufferGeometry.prototype), 
THREE.PlaneBufferGeometry.prototype.constructor = THREE.PlaneBufferGeometry, THREE.PlaneBufferGeometry.prototype.clone = function() {
    var parameters = this.parameters;
    return new THREE.PlaneBufferGeometry(parameters.width, parameters.height, parameters.widthSegments, parameters.heightSegments);
}, THREE.RingGeometry = function(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength) {
    THREE.Geometry.call(this), this.type = "RingGeometry", this.parameters = {
        innerRadius: innerRadius,
        outerRadius: outerRadius,
        thetaSegments: thetaSegments,
        phiSegments: phiSegments,
        thetaStart: thetaStart,
        thetaLength: thetaLength
    }, innerRadius = innerRadius || 0, outerRadius = outerRadius || 50, thetaStart = void 0 !== thetaStart ? thetaStart : 0, 
    thetaLength = void 0 !== thetaLength ? thetaLength : 2 * Math.PI, thetaSegments = void 0 !== thetaSegments ? Math.max(3, thetaSegments) : 8, 
    phiSegments = void 0 !== phiSegments ? Math.max(1, phiSegments) : 8;
    var i, o, uvs = [], radius = innerRadius, radiusStep = (outerRadius - innerRadius) / phiSegments;
    for (i = 0; phiSegments + 1 > i; i++) {
        for (o = 0; thetaSegments + 1 > o; o++) {
            var vertex = new THREE.Vector3(), segment = thetaStart + o / thetaSegments * thetaLength;
            vertex.x = radius * Math.cos(segment), vertex.y = radius * Math.sin(segment), this.vertices.push(vertex), 
            uvs.push(new THREE.Vector2((vertex.x / outerRadius + 1) / 2, (vertex.y / outerRadius + 1) / 2));
        }
        radius += radiusStep;
    }
    var n = new THREE.Vector3(0, 0, 1);
    for (i = 0; phiSegments > i; i++) {
        var thetaSegment = i * (thetaSegments + 1);
        for (o = 0; thetaSegments > o; o++) {
            var segment = o + thetaSegment, v1 = segment, v2 = segment + thetaSegments + 1, v3 = segment + thetaSegments + 2;
            this.faces.push(new THREE.Face3(v1, v2, v3, [ n.clone(), n.clone(), n.clone() ])), 
            this.faceVertexUvs[0].push([ uvs[v1].clone(), uvs[v2].clone(), uvs[v3].clone() ]), 
            v1 = segment, v2 = segment + thetaSegments + 2, v3 = segment + 1, this.faces.push(new THREE.Face3(v1, v2, v3, [ n.clone(), n.clone(), n.clone() ])), 
            this.faceVertexUvs[0].push([ uvs[v1].clone(), uvs[v2].clone(), uvs[v3].clone() ]);
        }
    }
    this.computeFaceNormals(), this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);
}, THREE.RingGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.RingGeometry.prototype.constructor = THREE.RingGeometry, 
THREE.RingGeometry.prototype.clone = function() {
    var parameters = this.parameters;
    return new THREE.RingGeometry(parameters.innerRadius, parameters.outerRadius, parameters.thetaSegments, parameters.phiSegments, parameters.thetaStart, parameters.thetaLength);
}, THREE.SphereGeometry = function(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
    THREE.Geometry.call(this), this.type = "SphereGeometry", this.parameters = {
        radius: radius,
        widthSegments: widthSegments,
        heightSegments: heightSegments,
        phiStart: phiStart,
        phiLength: phiLength,
        thetaStart: thetaStart,
        thetaLength: thetaLength
    }, this.fromBufferGeometry(new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength));
}, THREE.SphereGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.SphereGeometry.prototype.constructor = THREE.SphereGeometry, 
THREE.SphereGeometry.prototype.clone = function() {
    var parameters = this.parameters;
    return new THREE.SphereGeometry(parameters.radius, parameters.widthSegments, parameters.heightSegments, parameters.phiStart, parameters.phiLength, parameters.thetaStart, parameters.thetaLength);
}, THREE.SphereBufferGeometry = function(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
    THREE.BufferGeometry.call(this), this.type = "SphereBufferGeometry", this.parameters = {
        radius: radius,
        widthSegments: widthSegments,
        heightSegments: heightSegments,
        phiStart: phiStart,
        phiLength: phiLength,
        thetaStart: thetaStart,
        thetaLength: thetaLength
    }, radius = radius || 50, widthSegments = Math.max(3, Math.floor(widthSegments) || 8), 
    heightSegments = Math.max(2, Math.floor(heightSegments) || 6), phiStart = void 0 !== phiStart ? phiStart : 0, 
    phiLength = void 0 !== phiLength ? phiLength : 2 * Math.PI, thetaStart = void 0 !== thetaStart ? thetaStart : 0, 
    thetaLength = void 0 !== thetaLength ? thetaLength : Math.PI;
    for (var thetaEnd = thetaStart + thetaLength, vertexCount = (widthSegments + 1) * (heightSegments + 1), positions = new THREE.BufferAttribute(new Float32Array(3 * vertexCount), 3), normals = new THREE.BufferAttribute(new Float32Array(3 * vertexCount), 3), uvs = new THREE.BufferAttribute(new Float32Array(2 * vertexCount), 2), index = 0, vertices = [], normal = new THREE.Vector3(), y = 0; heightSegments >= y; y++) {
        for (var verticesRow = [], v = y / heightSegments, x = 0; widthSegments >= x; x++) {
            var u = x / widthSegments, px = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength), py = radius * Math.cos(thetaStart + v * thetaLength), pz = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
            normal.set(px, py, pz).normalize(), positions.setXYZ(index, px, py, pz), normals.setXYZ(index, normal.x, normal.y, normal.z), 
            uvs.setXY(index, u, 1 - v), verticesRow.push(index), index++;
        }
        vertices.push(verticesRow);
    }
    for (var indices = [], y = 0; heightSegments > y; y++) for (var x = 0; widthSegments > x; x++) {
        var v1 = vertices[y][x + 1], v2 = vertices[y][x], v3 = vertices[y + 1][x], v4 = vertices[y + 1][x + 1];
        (0 !== y || thetaStart > 0) && indices.push(v1, v2, v4), (y !== heightSegments - 1 || thetaEnd < Math.PI) && indices.push(v2, v3, v4);
    }
    this.setIndex(new (positions.count > 65535 ? THREE.Uint32Attribute : THREE.Uint16Attribute)(indices, 1)), 
    this.addAttribute("position", positions), this.addAttribute("normal", normals), 
    this.addAttribute("uv", uvs), this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);
}, THREE.SphereBufferGeometry.prototype = Object.create(THREE.BufferGeometry.prototype), 
THREE.SphereBufferGeometry.prototype.constructor = THREE.SphereBufferGeometry, THREE.SphereBufferGeometry.prototype.clone = function() {
    var parameters = this.parameters;
    return new THREE.SphereBufferGeometry(parameters.radius, parameters.widthSegments, parameters.heightSegments, parameters.phiStart, parameters.phiLength, parameters.thetaStart, parameters.thetaLength);
}, THREE.TorusGeometry = function(radius, tube, radialSegments, tubularSegments, arc) {
    THREE.Geometry.call(this), this.type = "TorusGeometry", this.parameters = {
        radius: radius,
        tube: tube,
        radialSegments: radialSegments,
        tubularSegments: tubularSegments,
        arc: arc
    }, radius = radius || 100, tube = tube || 40, radialSegments = radialSegments || 8, 
    tubularSegments = tubularSegments || 6, arc = arc || 2 * Math.PI;
    for (var center = new THREE.Vector3(), uvs = [], normals = [], j = 0; radialSegments >= j; j++) for (var i = 0; tubularSegments >= i; i++) {
        var u = i / tubularSegments * arc, v = j / radialSegments * Math.PI * 2;
        center.x = radius * Math.cos(u), center.y = radius * Math.sin(u);
        var vertex = new THREE.Vector3();
        vertex.x = (radius + tube * Math.cos(v)) * Math.cos(u), vertex.y = (radius + tube * Math.cos(v)) * Math.sin(u), 
        vertex.z = tube * Math.sin(v), this.vertices.push(vertex), uvs.push(new THREE.Vector2(i / tubularSegments, j / radialSegments)), 
        normals.push(vertex.clone().sub(center).normalize());
    }
    for (var j = 1; radialSegments >= j; j++) for (var i = 1; tubularSegments >= i; i++) {
        var a = (tubularSegments + 1) * j + i - 1, b = (tubularSegments + 1) * (j - 1) + i - 1, c = (tubularSegments + 1) * (j - 1) + i, d = (tubularSegments + 1) * j + i, face = new THREE.Face3(a, b, d, [ normals[a].clone(), normals[b].clone(), normals[d].clone() ]);
        this.faces.push(face), this.faceVertexUvs[0].push([ uvs[a].clone(), uvs[b].clone(), uvs[d].clone() ]), 
        face = new THREE.Face3(b, c, d, [ normals[b].clone(), normals[c].clone(), normals[d].clone() ]), 
        this.faces.push(face), this.faceVertexUvs[0].push([ uvs[b].clone(), uvs[c].clone(), uvs[d].clone() ]);
    }
    this.computeFaceNormals();
}, THREE.TorusGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.TorusGeometry.prototype.constructor = THREE.TorusGeometry, 
THREE.TorusGeometry.prototype.clone = function() {
    var parameters = this.parameters;
    return new THREE.TorusGeometry(parameters.radius, parameters.tube, parameters.radialSegments, parameters.tubularSegments, parameters.arc);
}, THREE.TorusKnotGeometry = function(radius, tube, radialSegments, tubularSegments, p, q, heightScale) {
    function getPos(u, in_q, in_p, radius, heightScale) {
        var cu = Math.cos(u), su = Math.sin(u), quOverP = in_q / in_p * u, cs = Math.cos(quOverP), tx = radius * (2 + cs) * .5 * cu, ty = radius * (2 + cs) * su * .5, tz = heightScale * radius * Math.sin(quOverP) * .5;
        return new THREE.Vector3(tx, ty, tz);
    }
    THREE.Geometry.call(this), this.type = "TorusKnotGeometry", this.parameters = {
        radius: radius,
        tube: tube,
        radialSegments: radialSegments,
        tubularSegments: tubularSegments,
        p: p,
        q: q,
        heightScale: heightScale
    }, radius = radius || 100, tube = tube || 40, radialSegments = radialSegments || 64, 
    tubularSegments = tubularSegments || 8, p = p || 2, q = q || 3, heightScale = heightScale || 1;
    for (var grid = new Array(radialSegments), tang = new THREE.Vector3(), n = new THREE.Vector3(), bitan = new THREE.Vector3(), i = 0; radialSegments > i; ++i) {
        grid[i] = new Array(tubularSegments);
        var u = i / radialSegments * 2 * p * Math.PI, p1 = getPos(u, q, p, radius, heightScale), p2 = getPos(u + .01, q, p, radius, heightScale);
        tang.subVectors(p2, p1), n.addVectors(p2, p1), bitan.crossVectors(tang, n), n.crossVectors(bitan, tang), 
        bitan.normalize(), n.normalize();
        for (var j = 0; tubularSegments > j; ++j) {
            var v = j / tubularSegments * 2 * Math.PI, cx = -tube * Math.cos(v), cy = tube * Math.sin(v), pos = new THREE.Vector3();
            pos.x = p1.x + cx * n.x + cy * bitan.x, pos.y = p1.y + cx * n.y + cy * bitan.y, 
            pos.z = p1.z + cx * n.z + cy * bitan.z, grid[i][j] = this.vertices.push(pos) - 1;
        }
    }
    for (var i = 0; radialSegments > i; ++i) for (var j = 0; tubularSegments > j; ++j) {
        var ip = (i + 1) % radialSegments, jp = (j + 1) % tubularSegments, a = grid[i][j], b = grid[ip][j], c = grid[ip][jp], d = grid[i][jp], uva = new THREE.Vector2(i / radialSegments, j / tubularSegments), uvb = new THREE.Vector2((i + 1) / radialSegments, j / tubularSegments), uvc = new THREE.Vector2((i + 1) / radialSegments, (j + 1) / tubularSegments), uvd = new THREE.Vector2(i / radialSegments, (j + 1) / tubularSegments);
        this.faces.push(new THREE.Face3(a, b, d)), this.faceVertexUvs[0].push([ uva, uvb, uvd ]), 
        this.faces.push(new THREE.Face3(b, c, d)), this.faceVertexUvs[0].push([ uvb.clone(), uvc, uvd.clone() ]);
    }
    this.computeFaceNormals(), this.computeVertexNormals();
}, THREE.TorusKnotGeometry.prototype = Object.create(THREE.Geometry.prototype), 
THREE.TorusKnotGeometry.prototype.constructor = THREE.TorusKnotGeometry, THREE.TorusKnotGeometry.prototype.clone = function() {
    var parameters = this.parameters;
    return new THREE.TorusKnotGeometry(parameters.radius, parameters.tube, parameters.radialSegments, parameters.tubularSegments, parameters.p, parameters.q, parameters.heightScale);
}, THREE.TubeGeometry = function(path, segments, radius, radialSegments, closed, taper) {
    function vert(x, y, z) {
        return scope.vertices.push(new THREE.Vector3(x, y, z)) - 1;
    }
    THREE.Geometry.call(this), this.type = "TubeGeometry", this.parameters = {
        path: path,
        segments: segments,
        radius: radius,
        radialSegments: radialSegments,
        closed: closed,
        taper: taper
    }, segments = segments || 64, radius = radius || 1, radialSegments = radialSegments || 8, 
    closed = closed || !1, taper = taper || THREE.TubeGeometry.NoTaper;
    var tangent, normal, binormal, u, v, r, cx, cy, pos, i, j, ip, jp, a, b, c, d, uva, uvb, uvc, uvd, grid = [], scope = this, numpoints = segments + 1, pos2 = new THREE.Vector3(), frames = new THREE.TubeGeometry.FrenetFrames(path, segments, closed), tangents = frames.tangents, normals = frames.normals, binormals = frames.binormals;
    for (this.tangents = tangents, this.normals = normals, this.binormals = binormals, 
    i = 0; numpoints > i; i++) for (grid[i] = [], u = i / (numpoints - 1), pos = path.getPointAt(u), 
    tangent = tangents[i], normal = normals[i], binormal = binormals[i], r = radius * taper(u), 
    j = 0; radialSegments > j; j++) v = j / radialSegments * 2 * Math.PI, cx = -r * Math.cos(v), 
    cy = r * Math.sin(v), pos2.copy(pos), pos2.x += cx * normal.x + cy * binormal.x, 
    pos2.y += cx * normal.y + cy * binormal.y, pos2.z += cx * normal.z + cy * binormal.z, 
    grid[i][j] = vert(pos2.x, pos2.y, pos2.z);
    for (i = 0; segments > i; i++) for (j = 0; radialSegments > j; j++) ip = closed ? (i + 1) % segments : i + 1, 
    jp = (j + 1) % radialSegments, a = grid[i][j], b = grid[ip][j], c = grid[ip][jp], 
    d = grid[i][jp], uva = new THREE.Vector2(i / segments, j / radialSegments), uvb = new THREE.Vector2((i + 1) / segments, j / radialSegments), 
    uvc = new THREE.Vector2((i + 1) / segments, (j + 1) / radialSegments), uvd = new THREE.Vector2(i / segments, (j + 1) / radialSegments), 
    this.faces.push(new THREE.Face3(a, b, d)), this.faceVertexUvs[0].push([ uva, uvb, uvd ]), 
    this.faces.push(new THREE.Face3(b, c, d)), this.faceVertexUvs[0].push([ uvb.clone(), uvc, uvd.clone() ]);
    this.computeFaceNormals(), this.computeVertexNormals();
}, THREE.TubeGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.TubeGeometry.prototype.constructor = THREE.TubeGeometry, 
THREE.TubeGeometry.prototype.clone = function() {
    return new this.constructor(this.parameters.path, this.parameters.segments, this.parameters.radius, this.parameters.radialSegments, this.parameters.closed, this.parameters.taper);
}, THREE.TubeGeometry.NoTaper = function(u) {
    return 1;
}, THREE.TubeGeometry.SinusoidalTaper = function(u) {
    return Math.sin(Math.PI * u);
}, THREE.TubeGeometry.FrenetFrames = function(path, segments, closed) {
    function initialNormal3() {
        normals[0] = new THREE.Vector3(), binormals[0] = new THREE.Vector3(), smallest = Number.MAX_VALUE, 
        tx = Math.abs(tangents[0].x), ty = Math.abs(tangents[0].y), tz = Math.abs(tangents[0].z), 
        smallest >= tx && (smallest = tx, normal.set(1, 0, 0)), smallest >= ty && (smallest = ty, 
        normal.set(0, 1, 0)), smallest >= tz && normal.set(0, 0, 1), vec.crossVectors(tangents[0], normal).normalize(), 
        normals[0].crossVectors(tangents[0], vec), binormals[0].crossVectors(tangents[0], normals[0]);
    }
    var theta, smallest, tx, ty, tz, i, u, normal = new THREE.Vector3(), tangents = [], normals = [], binormals = [], vec = new THREE.Vector3(), mat = new THREE.Matrix4(), numpoints = segments + 1;
    for (this.tangents = tangents, this.normals = normals, this.binormals = binormals, 
    i = 0; numpoints > i; i++) u = i / (numpoints - 1), tangents[i] = path.getTangentAt(u), 
    tangents[i].normalize();
    for (initialNormal3(), i = 1; numpoints > i; i++) normals[i] = normals[i - 1].clone(), 
    binormals[i] = binormals[i - 1].clone(), vec.crossVectors(tangents[i - 1], tangents[i]), 
    vec.length() > Number.EPSILON && (vec.normalize(), theta = Math.acos(THREE.Math.clamp(tangents[i - 1].dot(tangents[i]), -1, 1)), 
    normals[i].applyMatrix4(mat.makeRotationAxis(vec, theta))), binormals[i].crossVectors(tangents[i], normals[i]);
    if (closed) for (theta = Math.acos(THREE.Math.clamp(normals[0].dot(normals[numpoints - 1]), -1, 1)), 
    theta /= numpoints - 1, tangents[0].dot(vec.crossVectors(normals[0], normals[numpoints - 1])) > 0 && (theta = -theta), 
    i = 1; numpoints > i; i++) normals[i].applyMatrix4(mat.makeRotationAxis(tangents[i], theta * i)), 
    binormals[i].crossVectors(tangents[i], normals[i]);
}, THREE.PolyhedronGeometry = function(vertices, indices, radius, detail) {
    function prepare(vector) {
        var vertex = vector.normalize().clone();
        vertex.index = that.vertices.push(vertex) - 1;
        var u = azimuth(vector) / 2 / Math.PI + .5, v = inclination(vector) / Math.PI + .5;
        return vertex.uv = new THREE.Vector2(u, 1 - v), vertex;
    }
    function make(v1, v2, v3, materialIndex) {
        var face = new THREE.Face3(v1.index, v2.index, v3.index, [ v1.clone(), v2.clone(), v3.clone() ], void 0, materialIndex);
        that.faces.push(face), centroid.copy(v1).add(v2).add(v3).divideScalar(3);
        var azi = azimuth(centroid);
        that.faceVertexUvs[0].push([ correctUV(v1.uv, v1, azi), correctUV(v2.uv, v2, azi), correctUV(v3.uv, v3, azi) ]);
    }
    function subdivide(face, detail) {
        for (var cols = Math.pow(2, detail), a = prepare(that.vertices[face.a]), b = prepare(that.vertices[face.b]), c = prepare(that.vertices[face.c]), v = [], materialIndex = face.materialIndex, i = 0; cols >= i; i++) {
            v[i] = [];
            for (var aj = prepare(a.clone().lerp(c, i / cols)), bj = prepare(b.clone().lerp(c, i / cols)), rows = cols - i, j = 0; rows >= j; j++) 0 === j && i === cols ? v[i][j] = aj : v[i][j] = prepare(aj.clone().lerp(bj, j / rows));
        }
        for (var i = 0; cols > i; i++) for (var j = 0; 2 * (cols - i) - 1 > j; j++) {
            var k = Math.floor(j / 2);
            j % 2 === 0 ? make(v[i][k + 1], v[i + 1][k], v[i][k], materialIndex) : make(v[i][k + 1], v[i + 1][k + 1], v[i + 1][k], materialIndex);
        }
    }
    function azimuth(vector) {
        return Math.atan2(vector.z, -vector.x);
    }
    function inclination(vector) {
        return Math.atan2(-vector.y, Math.sqrt(vector.x * vector.x + vector.z * vector.z));
    }
    function correctUV(uv, vector, azimuth) {
        return 0 > azimuth && 1 === uv.x && (uv = new THREE.Vector2(uv.x - 1, uv.y)), 0 === vector.x && 0 === vector.z && (uv = new THREE.Vector2(azimuth / 2 / Math.PI + .5, uv.y)), 
        uv.clone();
    }
    THREE.Geometry.call(this), this.type = "PolyhedronGeometry", this.parameters = {
        vertices: vertices,
        indices: indices,
        radius: radius,
        detail: detail
    }, radius = radius || 1, detail = detail || 0;
    for (var that = this, i = 0, l = vertices.length; l > i; i += 3) prepare(new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]));
    for (var p = this.vertices, faces = [], i = 0, j = 0, l = indices.length; l > i; i += 3, 
    j++) {
        var v1 = p[indices[i]], v2 = p[indices[i + 1]], v3 = p[indices[i + 2]];
        faces[j] = new THREE.Face3(v1.index, v2.index, v3.index, [ v1.clone(), v2.clone(), v3.clone() ], void 0, j);
    }
    for (var centroid = new THREE.Vector3(), i = 0, l = faces.length; l > i; i++) subdivide(faces[i], detail);
    for (var i = 0, l = this.faceVertexUvs[0].length; l > i; i++) {
        var uvs = this.faceVertexUvs[0][i], x0 = uvs[0].x, x1 = uvs[1].x, x2 = uvs[2].x, max = Math.max(x0, x1, x2), min = Math.min(x0, x1, x2);
        max > .9 && .1 > min && (.2 > x0 && (uvs[0].x += 1), .2 > x1 && (uvs[1].x += 1), 
        .2 > x2 && (uvs[2].x += 1));
    }
    for (var i = 0, l = this.vertices.length; l > i; i++) this.vertices[i].multiplyScalar(radius);
    this.mergeVertices(), this.computeFaceNormals(), this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);
}, THREE.PolyhedronGeometry.prototype = Object.create(THREE.Geometry.prototype), 
THREE.PolyhedronGeometry.prototype.constructor = THREE.PolyhedronGeometry, THREE.PolyhedronGeometry.prototype.clone = function() {
    var parameters = this.parameters;
    return new THREE.PolyhedronGeometry(parameters.vertices, parameters.indices, parameters.radius, parameters.detail);
}, THREE.DodecahedronGeometry = function(radius, detail) {
    var t = (1 + Math.sqrt(5)) / 2, r = 1 / t, vertices = [ -1, -1, -1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, -1, -1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0, -r, -t, 0, -r, t, 0, r, -t, 0, r, t, -r, -t, 0, -r, t, 0, r, -t, 0, r, t, 0, -t, 0, -r, t, 0, -r, -t, 0, r, t, 0, r ], indices = [ 3, 11, 7, 3, 7, 15, 3, 15, 13, 7, 19, 17, 7, 17, 6, 7, 6, 15, 17, 4, 8, 17, 8, 10, 17, 10, 6, 8, 0, 16, 8, 16, 2, 8, 2, 10, 0, 12, 1, 0, 1, 18, 0, 18, 16, 6, 10, 2, 6, 2, 13, 6, 13, 15, 2, 16, 18, 2, 18, 3, 2, 3, 13, 18, 1, 9, 18, 9, 11, 18, 11, 3, 4, 14, 12, 4, 12, 0, 4, 0, 8, 11, 9, 5, 11, 5, 19, 11, 19, 7, 19, 5, 14, 19, 14, 4, 19, 4, 17, 1, 12, 14, 1, 14, 5, 1, 5, 9 ];
    THREE.PolyhedronGeometry.call(this, vertices, indices, radius, detail), this.type = "DodecahedronGeometry", 
    this.parameters = {
        radius: radius,
        detail: detail
    };
}, THREE.DodecahedronGeometry.prototype = Object.create(THREE.PolyhedronGeometry.prototype), 
THREE.DodecahedronGeometry.prototype.constructor = THREE.DodecahedronGeometry, THREE.DodecahedronGeometry.prototype.clone = function() {
    var parameters = this.parameters;
    return new THREE.DodecahedronGeometry(parameters.radius, parameters.detail);
}, THREE.IcosahedronGeometry = function(radius, detail) {
    var t = (1 + Math.sqrt(5)) / 2, vertices = [ -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, 0, 0, -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, t, 0, -1, t, 0, 1, -t, 0, -1, -t, 0, 1 ], indices = [ 0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1 ];
    THREE.PolyhedronGeometry.call(this, vertices, indices, radius, detail), this.type = "IcosahedronGeometry", 
    this.parameters = {
        radius: radius,
        detail: detail
    };
}, THREE.IcosahedronGeometry.prototype = Object.create(THREE.PolyhedronGeometry.prototype), 
THREE.IcosahedronGeometry.prototype.constructor = THREE.IcosahedronGeometry, THREE.IcosahedronGeometry.prototype.clone = function() {
    var parameters = this.parameters;
    return new THREE.IcosahedronGeometry(parameters.radius, parameters.detail);
}, THREE.OctahedronGeometry = function(radius, detail) {
    var vertices = [ 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1 ], indices = [ 0, 2, 4, 0, 4, 3, 0, 3, 5, 0, 5, 2, 1, 2, 5, 1, 5, 3, 1, 3, 4, 1, 4, 2 ];
    THREE.PolyhedronGeometry.call(this, vertices, indices, radius, detail), this.type = "OctahedronGeometry", 
    this.parameters = {
        radius: radius,
        detail: detail
    };
}, THREE.OctahedronGeometry.prototype = Object.create(THREE.PolyhedronGeometry.prototype), 
THREE.OctahedronGeometry.prototype.constructor = THREE.OctahedronGeometry, THREE.OctahedronGeometry.prototype.clone = function() {
    var parameters = this.parameters;
    return new THREE.OctahedronGeometry(parameters.radius, parameters.detail);
}, THREE.TetrahedronGeometry = function(radius, detail) {
    var vertices = [ 1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1 ], indices = [ 2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1 ];
    THREE.PolyhedronGeometry.call(this, vertices, indices, radius, detail), this.type = "TetrahedronGeometry", 
    this.parameters = {
        radius: radius,
        detail: detail
    };
}, THREE.TetrahedronGeometry.prototype = Object.create(THREE.PolyhedronGeometry.prototype), 
THREE.TetrahedronGeometry.prototype.constructor = THREE.TetrahedronGeometry, THREE.TetrahedronGeometry.prototype.clone = function() {
    var parameters = this.parameters;
    return new THREE.TetrahedronGeometry(parameters.radius, parameters.detail);
}, THREE.ParametricGeometry = function(func, slices, stacks) {
    THREE.Geometry.call(this), this.type = "ParametricGeometry", this.parameters = {
        func: func,
        slices: slices,
        stacks: stacks
    };
    var i, j, p, u, v, verts = this.vertices, faces = this.faces, uvs = this.faceVertexUvs[0], sliceCount = slices + 1;
    for (i = 0; stacks >= i; i++) for (v = i / stacks, j = 0; slices >= j; j++) u = j / slices, 
    p = func(u, v), verts.push(p);
    var a, b, c, d, uva, uvb, uvc, uvd;
    for (i = 0; stacks > i; i++) for (j = 0; slices > j; j++) a = i * sliceCount + j, 
    b = i * sliceCount + j + 1, c = (i + 1) * sliceCount + j + 1, d = (i + 1) * sliceCount + j, 
    uva = new THREE.Vector2(j / slices, i / stacks), uvb = new THREE.Vector2((j + 1) / slices, i / stacks), 
    uvc = new THREE.Vector2((j + 1) / slices, (i + 1) / stacks), uvd = new THREE.Vector2(j / slices, (i + 1) / stacks), 
    faces.push(new THREE.Face3(a, b, d)), uvs.push([ uva, uvb, uvd ]), faces.push(new THREE.Face3(b, c, d)), 
    uvs.push([ uvb.clone(), uvc, uvd.clone() ]);
    this.computeFaceNormals(), this.computeVertexNormals();
}, THREE.ParametricGeometry.prototype = Object.create(THREE.Geometry.prototype), 
THREE.ParametricGeometry.prototype.constructor = THREE.ParametricGeometry, THREE.WireframeGeometry = function(geometry) {
    function sortFunction(a, b) {
        return a - b;
    }
    THREE.BufferGeometry.call(this);
    var edge = [ 0, 0 ], hash = {}, keys = [ "a", "b", "c" ];
    if (geometry instanceof THREE.Geometry) {
        for (var vertices = geometry.vertices, faces = geometry.faces, numEdges = 0, edges = new Uint32Array(6 * faces.length), i = 0, l = faces.length; l > i; i++) for (var face = faces[i], j = 0; 3 > j; j++) {
            edge[0] = face[keys[j]], edge[1] = face[keys[(j + 1) % 3]], edge.sort(sortFunction);
            var key = edge.toString();
            void 0 === hash[key] && (edges[2 * numEdges] = edge[0], edges[2 * numEdges + 1] = edge[1], 
            hash[key] = !0, numEdges++);
        }
        for (var coords = new Float32Array(2 * numEdges * 3), i = 0, l = numEdges; l > i; i++) for (var j = 0; 2 > j; j++) {
            var vertex = vertices[edges[2 * i + j]], index = 6 * i + 3 * j;
            coords[index + 0] = vertex.x, coords[index + 1] = vertex.y, coords[index + 2] = vertex.z;
        }
        this.addAttribute("position", new THREE.BufferAttribute(coords, 3));
    } else if (geometry instanceof THREE.BufferGeometry) if (null !== geometry.index) {
        var indices = geometry.index.array, vertices = geometry.attributes.position, drawcalls = geometry.drawcalls, numEdges = 0;
        0 === drawcalls.length && geometry.addGroup(0, indices.length);
        for (var edges = new Uint32Array(2 * indices.length), o = 0, ol = drawcalls.length; ol > o; ++o) for (var drawcall = drawcalls[o], start = drawcall.start, count = drawcall.count, i = start, il = start + count; il > i; i += 3) for (var j = 0; 3 > j; j++) {
            edge[0] = indices[i + j], edge[1] = indices[i + (j + 1) % 3], edge.sort(sortFunction);
            var key = edge.toString();
            void 0 === hash[key] && (edges[2 * numEdges] = edge[0], edges[2 * numEdges + 1] = edge[1], 
            hash[key] = !0, numEdges++);
        }
        for (var coords = new Float32Array(2 * numEdges * 3), i = 0, l = numEdges; l > i; i++) for (var j = 0; 2 > j; j++) {
            var index = 6 * i + 3 * j, index2 = edges[2 * i + j];
            coords[index + 0] = vertices.getX(index2), coords[index + 1] = vertices.getY(index2), 
            coords[index + 2] = vertices.getZ(index2);
        }
        this.addAttribute("position", new THREE.BufferAttribute(coords, 3));
    } else {
        for (var vertices = geometry.attributes.position.array, numEdges = vertices.length / 3, numTris = numEdges / 3, coords = new Float32Array(2 * numEdges * 3), i = 0, l = numTris; l > i; i++) for (var j = 0; 3 > j; j++) {
            var index = 18 * i + 6 * j, index1 = 9 * i + 3 * j;
            coords[index + 0] = vertices[index1], coords[index + 1] = vertices[index1 + 1], 
            coords[index + 2] = vertices[index1 + 2];
            var index2 = 9 * i + 3 * ((j + 1) % 3);
            coords[index + 3] = vertices[index2], coords[index + 4] = vertices[index2 + 1], 
            coords[index + 5] = vertices[index2 + 2];
        }
        this.addAttribute("position", new THREE.BufferAttribute(coords, 3));
    }
}, THREE.WireframeGeometry.prototype = Object.create(THREE.BufferGeometry.prototype), 
THREE.WireframeGeometry.prototype.constructor = THREE.WireframeGeometry, THREE.AxisHelper = function(size) {
    size = size || 1;
    var vertices = new Float32Array([ 0, 0, 0, size, 0, 0, 0, 0, 0, 0, size, 0, 0, 0, 0, 0, 0, size ]), colors = new Float32Array([ 1, 0, 0, 1, .6, 0, 0, 1, 0, .6, 1, 0, 0, 0, 1, 0, .6, 1 ]), geometry = new THREE.BufferGeometry();
    geometry.addAttribute("position", new THREE.BufferAttribute(vertices, 3)), geometry.addAttribute("color", new THREE.BufferAttribute(colors, 3));
    var material = new THREE.LineBasicMaterial({
        vertexColors: THREE.VertexColors
    });
    THREE.LineSegments.call(this, geometry, material);
}, THREE.AxisHelper.prototype = Object.create(THREE.LineSegments.prototype), THREE.AxisHelper.prototype.constructor = THREE.AxisHelper, 
THREE.ArrowHelper = function() {
    var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
    var coneGeometry = new THREE.CylinderGeometry(0, .5, 1, 5, 1);
    return coneGeometry.translate(0, -.5, 0), function(dir, origin, length, color, headLength, headWidth) {
        THREE.Object3D.call(this), void 0 === color && (color = 16776960), void 0 === length && (length = 1), 
        void 0 === headLength && (headLength = .2 * length), void 0 === headWidth && (headWidth = .2 * headLength), 
        this.position.copy(origin), length > headLength && (this.line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({
            color: color
        })), this.line.matrixAutoUpdate = !1, this.add(this.line)), this.cone = new THREE.Mesh(coneGeometry, new THREE.MeshBasicMaterial({
            color: color
        })), this.cone.matrixAutoUpdate = !1, this.add(this.cone), this.setDirection(dir), 
        this.setLength(length, headLength, headWidth);
    };
}(), THREE.ArrowHelper.prototype = Object.create(THREE.Object3D.prototype), THREE.ArrowHelper.prototype.constructor = THREE.ArrowHelper, 
THREE.ArrowHelper.prototype.setDirection = function() {
    var radians, axis = new THREE.Vector3();
    return function(dir) {
        dir.y > .99999 ? this.quaternion.set(0, 0, 0, 1) : dir.y < -.99999 ? this.quaternion.set(1, 0, 0, 0) : (axis.set(dir.z, 0, -dir.x).normalize(), 
        radians = Math.acos(dir.y), this.quaternion.setFromAxisAngle(axis, radians));
    };
}(), THREE.ArrowHelper.prototype.setLength = function(length, headLength, headWidth) {
    void 0 === headLength && (headLength = .2 * length), void 0 === headWidth && (headWidth = .2 * headLength), 
    length > headLength && (this.line.scale.set(1, length - headLength, 1), this.line.updateMatrix()), 
    this.cone.scale.set(headWidth, headLength, headWidth), this.cone.position.y = length, 
    this.cone.updateMatrix();
}, THREE.ArrowHelper.prototype.setColor = function(color) {
    void 0 !== this.line && this.line.material.color.set(color), this.cone.material.color.set(color);
}, THREE.BoxHelper = function(object) {
    var indices = new Uint16Array([ 0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7 ]), positions = new Float32Array(24), geometry = new THREE.BufferGeometry();
    geometry.setIndex(new THREE.BufferAttribute(indices, 1)), geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3)), 
    THREE.LineSegments.call(this, geometry, new THREE.LineBasicMaterial({
        color: 16776960
    })), void 0 !== object && this.update(object);
}, THREE.BoxHelper.prototype = Object.create(THREE.LineSegments.prototype), THREE.BoxHelper.prototype.constructor = THREE.BoxHelper, 
THREE.BoxHelper.prototype.update = function() {
    var box = new THREE.Box3();
    return function(object) {
        if (box.setFromObject(object), !box.empty()) {
            var min = box.min, max = box.max, position = this.geometry.attributes.position, array = position.array;
            array[0] = max.x, array[1] = max.y, array[2] = max.z, array[3] = min.x, array[4] = max.y, 
            array[5] = max.z, array[6] = min.x, array[7] = min.y, array[8] = max.z, array[9] = max.x, 
            array[10] = min.y, array[11] = max.z, array[12] = max.x, array[13] = max.y, array[14] = min.z, 
            array[15] = min.x, array[16] = max.y, array[17] = min.z, array[18] = min.x, array[19] = min.y, 
            array[20] = min.z, array[21] = max.x, array[22] = min.y, array[23] = min.z, position.needsUpdate = !0, 
            this.geometry.computeBoundingSphere();
        }
    };
}(), THREE.BoundingBoxHelper = function(object, hex) {
    var color = void 0 !== hex ? hex : 8947848;
    this.object = object, this.box = new THREE.Box3(), THREE.Mesh.call(this, new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({
        color: color,
        wireframe: !0
    }));
}, THREE.BoundingBoxHelper.prototype = Object.create(THREE.Mesh.prototype), THREE.BoundingBoxHelper.prototype.constructor = THREE.BoundingBoxHelper, 
THREE.BoundingBoxHelper.prototype.update = function() {
    this.box.setFromObject(this.object), this.box.size(this.scale), this.box.center(this.position);
}, THREE.CameraHelper = function(camera) {
    function addLine(a, b, hex) {
        addPoint(a, hex), addPoint(b, hex);
    }
    function addPoint(id, hex) {
        geometry.vertices.push(new THREE.Vector3()), geometry.colors.push(new THREE.Color(hex)), 
        void 0 === pointMap[id] && (pointMap[id] = []), pointMap[id].push(geometry.vertices.length - 1);
    }
    var geometry = new THREE.Geometry(), material = new THREE.LineBasicMaterial({
        color: 16777215,
        vertexColors: THREE.FaceColors
    }), pointMap = {}, hexFrustum = 16755200, hexCone = 16711680, hexUp = 43775, hexTarget = 16777215, hexCross = 3355443;
    addLine("n1", "n2", hexFrustum), addLine("n2", "n4", hexFrustum), addLine("n4", "n3", hexFrustum), 
    addLine("n3", "n1", hexFrustum), addLine("f1", "f2", hexFrustum), addLine("f2", "f4", hexFrustum), 
    addLine("f4", "f3", hexFrustum), addLine("f3", "f1", hexFrustum), addLine("n1", "f1", hexFrustum), 
    addLine("n2", "f2", hexFrustum), addLine("n3", "f3", hexFrustum), addLine("n4", "f4", hexFrustum), 
    addLine("p", "n1", hexCone), addLine("p", "n2", hexCone), addLine("p", "n3", hexCone), 
    addLine("p", "n4", hexCone), addLine("u1", "u2", hexUp), addLine("u2", "u3", hexUp), 
    addLine("u3", "u1", hexUp), addLine("c", "t", hexTarget), addLine("p", "c", hexCross), 
    addLine("cn1", "cn2", hexCross), addLine("cn3", "cn4", hexCross), addLine("cf1", "cf2", hexCross), 
    addLine("cf3", "cf4", hexCross), THREE.LineSegments.call(this, geometry, material), 
    this.camera = camera, this.camera.updateProjectionMatrix(), this.matrix = camera.matrixWorld, 
    this.matrixAutoUpdate = !1, this.pointMap = pointMap, this.update();
}, THREE.CameraHelper.prototype = Object.create(THREE.LineSegments.prototype), THREE.CameraHelper.prototype.constructor = THREE.CameraHelper, 
THREE.CameraHelper.prototype.update = function() {
    function setPoint(point, x, y, z) {
        vector.set(x, y, z).unproject(camera);
        var points = pointMap[point];
        if (void 0 !== points) for (var i = 0, il = points.length; il > i; i++) geometry.vertices[points[i]].copy(vector);
    }
    var geometry, pointMap, vector = new THREE.Vector3(), camera = new THREE.Camera();
    return function() {
        geometry = this.geometry, pointMap = this.pointMap;
        var w = 1, h = 1;
        camera.projectionMatrix.copy(this.camera.projectionMatrix), setPoint("c", 0, 0, -1), 
        setPoint("t", 0, 0, 1), setPoint("n1", -w, -h, -1), setPoint("n2", w, -h, -1), setPoint("n3", -w, h, -1), 
        setPoint("n4", w, h, -1), setPoint("f1", -w, -h, 1), setPoint("f2", w, -h, 1), setPoint("f3", -w, h, 1), 
        setPoint("f4", w, h, 1), setPoint("u1", .7 * w, 1.1 * h, -1), setPoint("u2", .7 * -w, 1.1 * h, -1), 
        setPoint("u3", 0, 2 * h, -1), setPoint("cf1", -w, 0, 1), setPoint("cf2", w, 0, 1), 
        setPoint("cf3", 0, -h, 1), setPoint("cf4", 0, h, 1), setPoint("cn1", -w, 0, -1), 
        setPoint("cn2", w, 0, -1), setPoint("cn3", 0, -h, -1), setPoint("cn4", 0, h, -1), 
        geometry.verticesNeedUpdate = !0;
    };
}(), THREE.DirectionalLightHelper = function(light, size) {
    THREE.Object3D.call(this), this.light = light, this.light.updateMatrixWorld(), this.matrix = light.matrixWorld, 
    this.matrixAutoUpdate = !1, size = size || 1;
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-size, size, 0), new THREE.Vector3(size, size, 0), new THREE.Vector3(size, -size, 0), new THREE.Vector3(-size, -size, 0), new THREE.Vector3(-size, size, 0));
    var material = new THREE.LineBasicMaterial({
        fog: !1
    });
    material.color.copy(this.light.color).multiplyScalar(this.light.intensity), this.lightPlane = new THREE.Line(geometry, material), 
    this.add(this.lightPlane), geometry = new THREE.Geometry(), geometry.vertices.push(new THREE.Vector3(), new THREE.Vector3()), 
    material = new THREE.LineBasicMaterial({
        fog: !1
    }), material.color.copy(this.light.color).multiplyScalar(this.light.intensity), 
    this.targetLine = new THREE.Line(geometry, material), this.add(this.targetLine), 
    this.update();
}, THREE.DirectionalLightHelper.prototype = Object.create(THREE.Object3D.prototype), 
THREE.DirectionalLightHelper.prototype.constructor = THREE.DirectionalLightHelper, 
THREE.DirectionalLightHelper.prototype.dispose = function() {
    this.lightPlane.geometry.dispose(), this.lightPlane.material.dispose(), this.targetLine.geometry.dispose(), 
    this.targetLine.material.dispose();
}, THREE.DirectionalLightHelper.prototype.update = function() {
    var v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), v3 = new THREE.Vector3();
    return function() {
        v1.setFromMatrixPosition(this.light.matrixWorld), v2.setFromMatrixPosition(this.light.target.matrixWorld), 
        v3.subVectors(v2, v1), this.lightPlane.lookAt(v3), this.lightPlane.material.color.copy(this.light.color).multiplyScalar(this.light.intensity), 
        this.targetLine.geometry.vertices[1].copy(v3), this.targetLine.geometry.verticesNeedUpdate = !0, 
        this.targetLine.material.color.copy(this.lightPlane.material.color);
    };
}(), THREE.EdgesHelper = function(object, hex, thresholdAngle) {
    var color = void 0 !== hex ? hex : 16777215;
    THREE.LineSegments.call(this, new THREE.EdgesGeometry(object.geometry, thresholdAngle), new THREE.LineBasicMaterial({
        color: color
    })), this.matrix = object.matrixWorld, this.matrixAutoUpdate = !1;
}, THREE.EdgesHelper.prototype = Object.create(THREE.LineSegments.prototype), THREE.EdgesHelper.prototype.constructor = THREE.EdgesHelper, 
THREE.FaceNormalsHelper = function(object, size, hex, linewidth) {
    this.object = object, this.size = void 0 !== size ? size : 1;
    var color = void 0 !== hex ? hex : 16776960, width = void 0 !== linewidth ? linewidth : 1, nNormals = 0, objGeometry = this.object.geometry;
    objGeometry instanceof THREE.Geometry ? nNormals = objGeometry.faces.length : console.warn("THREE.FaceNormalsHelper: only THREE.Geometry is supported. Use THREE.VertexNormalsHelper, instead.");
    var geometry = new THREE.BufferGeometry(), positions = new THREE.Float32Attribute(2 * nNormals * 3, 3);
    geometry.addAttribute("position", positions), THREE.LineSegments.call(this, geometry, new THREE.LineBasicMaterial({
        color: color,
        linewidth: width
    })), this.matrixAutoUpdate = !1, this.update();
}, THREE.FaceNormalsHelper.prototype = Object.create(THREE.LineSegments.prototype), 
THREE.FaceNormalsHelper.prototype.constructor = THREE.FaceNormalsHelper, THREE.FaceNormalsHelper.prototype.update = function() {
    var v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), normalMatrix = new THREE.Matrix3();
    return function() {
        this.object.updateMatrixWorld(!0), normalMatrix.getNormalMatrix(this.object.matrixWorld);
        for (var matrixWorld = this.object.matrixWorld, position = this.geometry.attributes.position, objGeometry = this.object.geometry, vertices = objGeometry.vertices, faces = objGeometry.faces, idx = 0, i = 0, l = faces.length; l > i; i++) {
            var face = faces[i], normal = face.normal;
            v1.copy(vertices[face.a]).add(vertices[face.b]).add(vertices[face.c]).divideScalar(3).applyMatrix4(matrixWorld), 
            v2.copy(normal).applyMatrix3(normalMatrix).normalize().multiplyScalar(this.size).add(v1), 
            position.setXYZ(idx, v1.x, v1.y, v1.z), idx += 1, position.setXYZ(idx, v2.x, v2.y, v2.z), 
            idx += 1;
        }
        return position.needsUpdate = !0, this;
    };
}(), THREE.GridHelper = function(size, step) {
    var geometry = new THREE.Geometry(), material = new THREE.LineBasicMaterial({
        vertexColors: THREE.VertexColors
    });
    this.color1 = new THREE.Color(4473924), this.color2 = new THREE.Color(8947848);
    for (var i = -size; size >= i; i += step) {
        geometry.vertices.push(new THREE.Vector3(-size, 0, i), new THREE.Vector3(size, 0, i), new THREE.Vector3(i, 0, -size), new THREE.Vector3(i, 0, size));
        var color = 0 === i ? this.color1 : this.color2;
        geometry.colors.push(color, color, color, color);
    }
    THREE.LineSegments.call(this, geometry, material);
}, THREE.GridHelper.prototype = Object.create(THREE.LineSegments.prototype), THREE.GridHelper.prototype.constructor = THREE.GridHelper, 
THREE.GridHelper.prototype.setColors = function(colorCenterLine, colorGrid) {
    this.color1.set(colorCenterLine), this.color2.set(colorGrid), this.geometry.colorsNeedUpdate = !0;
}, THREE.HemisphereLightHelper = function(light, sphereSize) {
    THREE.Object3D.call(this), this.light = light, this.light.updateMatrixWorld(), this.matrix = light.matrixWorld, 
    this.matrixAutoUpdate = !1, this.colors = [ new THREE.Color(), new THREE.Color() ];
    var geometry = new THREE.SphereGeometry(sphereSize, 4, 2);
    geometry.rotateX(-Math.PI / 2);
    for (var i = 0, il = 8; il > i; i++) geometry.faces[i].color = this.colors[4 > i ? 0 : 1];
    var material = new THREE.MeshBasicMaterial({
        vertexColors: THREE.FaceColors,
        wireframe: !0
    });
    this.lightSphere = new THREE.Mesh(geometry, material), this.add(this.lightSphere), 
    this.update();
}, THREE.HemisphereLightHelper.prototype = Object.create(THREE.Object3D.prototype), 
THREE.HemisphereLightHelper.prototype.constructor = THREE.HemisphereLightHelper, 
THREE.HemisphereLightHelper.prototype.dispose = function() {
    this.lightSphere.geometry.dispose(), this.lightSphere.material.dispose();
}, THREE.HemisphereLightHelper.prototype.update = function() {
    var vector = new THREE.Vector3();
    return function() {
        this.colors[0].copy(this.light.color).multiplyScalar(this.light.intensity), this.colors[1].copy(this.light.groundColor).multiplyScalar(this.light.intensity), 
        this.lightSphere.lookAt(vector.setFromMatrixPosition(this.light.matrixWorld).negate()), 
        this.lightSphere.geometry.colorsNeedUpdate = !0;
    };
}(), THREE.PointLightHelper = function(light, sphereSize) {
    this.light = light, this.light.updateMatrixWorld();
    var geometry = new THREE.SphereGeometry(sphereSize, 4, 2), material = new THREE.MeshBasicMaterial({
        wireframe: !0,
        fog: !1
    });
    material.color.copy(this.light.color).multiplyScalar(this.light.intensity), THREE.Mesh.call(this, geometry, material), 
    this.matrix = this.light.matrixWorld, this.matrixAutoUpdate = !1;
}, THREE.PointLightHelper.prototype = Object.create(THREE.Mesh.prototype), THREE.PointLightHelper.prototype.constructor = THREE.PointLightHelper, 
THREE.PointLightHelper.prototype.dispose = function() {
    this.geometry.dispose(), this.material.dispose();
}, THREE.PointLightHelper.prototype.update = function() {
    this.material.color.copy(this.light.color).multiplyScalar(this.light.intensity);
}, THREE.SkeletonHelper = function(object) {
    this.bones = this.getBoneList(object);
    for (var geometry = new THREE.Geometry(), i = 0; i < this.bones.length; i++) {
        var bone = this.bones[i];
        bone.parent instanceof THREE.Bone && (geometry.vertices.push(new THREE.Vector3()), 
        geometry.vertices.push(new THREE.Vector3()), geometry.colors.push(new THREE.Color(0, 0, 1)), 
        geometry.colors.push(new THREE.Color(0, 1, 0)));
    }
    geometry.dynamic = !0;
    var material = new THREE.LineBasicMaterial({
        vertexColors: THREE.VertexColors,
        depthTest: !1,
        depthWrite: !1,
        transparent: !0
    });
    THREE.LineSegments.call(this, geometry, material), this.root = object, this.matrix = object.matrixWorld, 
    this.matrixAutoUpdate = !1, this.update();
}, THREE.SkeletonHelper.prototype = Object.create(THREE.LineSegments.prototype), 
THREE.SkeletonHelper.prototype.constructor = THREE.SkeletonHelper, THREE.SkeletonHelper.prototype.getBoneList = function(object) {
    var boneList = [];
    object instanceof THREE.Bone && boneList.push(object);
    for (var i = 0; i < object.children.length; i++) boneList.push.apply(boneList, this.getBoneList(object.children[i]));
    return boneList;
}, THREE.SkeletonHelper.prototype.update = function() {
    for (var geometry = this.geometry, matrixWorldInv = new THREE.Matrix4().getInverse(this.root.matrixWorld), boneMatrix = new THREE.Matrix4(), j = 0, i = 0; i < this.bones.length; i++) {
        var bone = this.bones[i];
        bone.parent instanceof THREE.Bone && (boneMatrix.multiplyMatrices(matrixWorldInv, bone.matrixWorld), 
        geometry.vertices[j].setFromMatrixPosition(boneMatrix), boneMatrix.multiplyMatrices(matrixWorldInv, bone.parent.matrixWorld), 
        geometry.vertices[j + 1].setFromMatrixPosition(boneMatrix), j += 2);
    }
    geometry.verticesNeedUpdate = !0, geometry.computeBoundingSphere();
}, THREE.SpotLightHelper = function(light) {
    THREE.Object3D.call(this), this.light = light, this.light.updateMatrixWorld(), this.matrix = light.matrixWorld, 
    this.matrixAutoUpdate = !1;
    var geometry = new THREE.CylinderGeometry(0, 1, 1, 8, 1, !0);
    geometry.translate(0, -.5, 0), geometry.rotateX(-Math.PI / 2);
    var material = new THREE.MeshBasicMaterial({
        wireframe: !0,
        fog: !1
    });
    this.cone = new THREE.Mesh(geometry, material), this.add(this.cone), this.update();
}, THREE.SpotLightHelper.prototype = Object.create(THREE.Object3D.prototype), THREE.SpotLightHelper.prototype.constructor = THREE.SpotLightHelper, 
THREE.SpotLightHelper.prototype.dispose = function() {
    this.cone.geometry.dispose(), this.cone.material.dispose();
}, THREE.SpotLightHelper.prototype.update = function() {
    var vector = new THREE.Vector3(), vector2 = new THREE.Vector3();
    return function() {
        var coneLength = this.light.distance ? this.light.distance : 1e4, coneWidth = coneLength * Math.tan(this.light.angle);
        this.cone.scale.set(coneWidth, coneWidth, coneLength), vector.setFromMatrixPosition(this.light.matrixWorld), 
        vector2.setFromMatrixPosition(this.light.target.matrixWorld), this.cone.lookAt(vector2.sub(vector)), 
        this.cone.material.color.copy(this.light.color).multiplyScalar(this.light.intensity);
    };
}(), THREE.VertexNormalsHelper = function(object, size, hex, linewidth) {
    this.object = object, this.size = void 0 !== size ? size : 1;
    var color = void 0 !== hex ? hex : 16711680, width = void 0 !== linewidth ? linewidth : 1, nNormals = 0, objGeometry = this.object.geometry;
    objGeometry instanceof THREE.Geometry ? nNormals = 3 * objGeometry.faces.length : objGeometry instanceof THREE.BufferGeometry && (nNormals = objGeometry.attributes.normal.count);
    var geometry = new THREE.BufferGeometry(), positions = new THREE.Float32Attribute(2 * nNormals * 3, 3);
    geometry.addAttribute("position", positions), THREE.LineSegments.call(this, geometry, new THREE.LineBasicMaterial({
        color: color,
        linewidth: width
    })), this.matrixAutoUpdate = !1, this.update();
}, THREE.VertexNormalsHelper.prototype = Object.create(THREE.LineSegments.prototype), 
THREE.VertexNormalsHelper.prototype.constructor = THREE.VertexNormalsHelper, THREE.VertexNormalsHelper.prototype.update = function() {
    var v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), normalMatrix = new THREE.Matrix3();
    return function() {
        var keys = [ "a", "b", "c" ];
        this.object.updateMatrixWorld(!0), normalMatrix.getNormalMatrix(this.object.matrixWorld);
        var matrixWorld = this.object.matrixWorld, position = this.geometry.attributes.position, objGeometry = this.object.geometry;
        if (objGeometry instanceof THREE.Geometry) for (var vertices = objGeometry.vertices, faces = objGeometry.faces, idx = 0, i = 0, l = faces.length; l > i; i++) for (var face = faces[i], j = 0, jl = face.vertexNormals.length; jl > j; j++) {
            var vertex = vertices[face[keys[j]]], normal = face.vertexNormals[j];
            v1.copy(vertex).applyMatrix4(matrixWorld), v2.copy(normal).applyMatrix3(normalMatrix).normalize().multiplyScalar(this.size).add(v1), 
            position.setXYZ(idx, v1.x, v1.y, v1.z), idx += 1, position.setXYZ(idx, v2.x, v2.y, v2.z), 
            idx += 1;
        } else if (objGeometry instanceof THREE.BufferGeometry) for (var objPos = objGeometry.attributes.position, objNorm = objGeometry.attributes.normal, idx = 0, j = 0, jl = objPos.count; jl > j; j++) v1.set(objPos.getX(j), objPos.getY(j), objPos.getZ(j)).applyMatrix4(matrixWorld), 
        v2.set(objNorm.getX(j), objNorm.getY(j), objNorm.getZ(j)), v2.applyMatrix3(normalMatrix).normalize().multiplyScalar(this.size).add(v1), 
        position.setXYZ(idx, v1.x, v1.y, v1.z), idx += 1, position.setXYZ(idx, v2.x, v2.y, v2.z), 
        idx += 1;
        return position.needsUpdate = !0, this;
    };
}(), THREE.WireframeHelper = function(object, hex) {
    var color = void 0 !== hex ? hex : 16777215;
    THREE.LineSegments.call(this, new THREE.WireframeGeometry(object.geometry), new THREE.LineBasicMaterial({
        color: color
    })), this.matrix = object.matrixWorld, this.matrixAutoUpdate = !1;
}, THREE.WireframeHelper.prototype = Object.create(THREE.LineSegments.prototype), 
THREE.WireframeHelper.prototype.constructor = THREE.WireframeHelper, THREE.ImmediateRenderObject = function(material) {
    THREE.Object3D.call(this), this.material = material, this.render = function(renderCallback) {};
}, THREE.ImmediateRenderObject.prototype = Object.create(THREE.Object3D.prototype), 
THREE.ImmediateRenderObject.prototype.constructor = THREE.ImmediateRenderObject, 
THREE.MorphBlendMesh = function(geometry, material) {
    THREE.Mesh.call(this, geometry, material), this.animationsMap = {}, this.animationsList = [];
    var numFrames = this.geometry.morphTargets.length, name = "__default", startFrame = 0, endFrame = numFrames - 1, fps = numFrames / 1;
    this.createAnimation(name, startFrame, endFrame, fps), this.setAnimationWeight(name, 1);
}, THREE.MorphBlendMesh.prototype = Object.create(THREE.Mesh.prototype), THREE.MorphBlendMesh.prototype.constructor = THREE.MorphBlendMesh, 
THREE.MorphBlendMesh.prototype.createAnimation = function(name, start, end, fps) {
    var animation = {
        start: start,
        end: end,
        length: end - start + 1,
        fps: fps,
        duration: (end - start) / fps,
        lastFrame: 0,
        currentFrame: 0,
        active: !1,
        time: 0,
        direction: 1,
        weight: 1,
        directionBackwards: !1,
        mirroredLoop: !1
    };
    this.animationsMap[name] = animation, this.animationsList.push(animation);
}, THREE.MorphBlendMesh.prototype.autoCreateAnimations = function(fps) {
    for (var firstAnimation, pattern = /([a-z]+)_?(\d+)/, frameRanges = {}, geometry = this.geometry, i = 0, il = geometry.morphTargets.length; il > i; i++) {
        var morph = geometry.morphTargets[i], chunks = morph.name.match(pattern);
        if (chunks && chunks.length > 1) {
            var name = chunks[1];
            frameRanges[name] || (frameRanges[name] = {
                start: 1 / 0,
                end: -(1 / 0)
            });
            var range = frameRanges[name];
            i < range.start && (range.start = i), i > range.end && (range.end = i), firstAnimation || (firstAnimation = name);
        }
    }
    for (var name in frameRanges) {
        var range = frameRanges[name];
        this.createAnimation(name, range.start, range.end, fps);
    }
    this.firstAnimation = firstAnimation;
}, THREE.MorphBlendMesh.prototype.setAnimationDirectionForward = function(name) {
    var animation = this.animationsMap[name];
    animation && (animation.direction = 1, animation.directionBackwards = !1);
}, THREE.MorphBlendMesh.prototype.setAnimationDirectionBackward = function(name) {
    var animation = this.animationsMap[name];
    animation && (animation.direction = -1, animation.directionBackwards = !0);
}, THREE.MorphBlendMesh.prototype.setAnimationFPS = function(name, fps) {
    var animation = this.animationsMap[name];
    animation && (animation.fps = fps, animation.duration = (animation.end - animation.start) / animation.fps);
}, THREE.MorphBlendMesh.prototype.setAnimationDuration = function(name, duration) {
    var animation = this.animationsMap[name];
    animation && (animation.duration = duration, animation.fps = (animation.end - animation.start) / animation.duration);
}, THREE.MorphBlendMesh.prototype.setAnimationWeight = function(name, weight) {
    var animation = this.animationsMap[name];
    animation && (animation.weight = weight);
}, THREE.MorphBlendMesh.prototype.setAnimationTime = function(name, time) {
    var animation = this.animationsMap[name];
    animation && (animation.time = time);
}, THREE.MorphBlendMesh.prototype.getAnimationTime = function(name) {
    var time = 0, animation = this.animationsMap[name];
    return animation && (time = animation.time), time;
}, THREE.MorphBlendMesh.prototype.getAnimationDuration = function(name) {
    var duration = -1, animation = this.animationsMap[name];
    return animation && (duration = animation.duration), duration;
}, THREE.MorphBlendMesh.prototype.playAnimation = function(name) {
    var animation = this.animationsMap[name];
    animation ? (animation.time = 0, animation.active = !0) : console.warn("THREE.MorphBlendMesh: animation[" + name + "] undefined in .playAnimation()");
}, THREE.MorphBlendMesh.prototype.stopAnimation = function(name) {
    var animation = this.animationsMap[name];
    animation && (animation.active = !1);
}, THREE.MorphBlendMesh.prototype.update = function(delta) {
    for (var i = 0, il = this.animationsList.length; il > i; i++) {
        var animation = this.animationsList[i];
        if (animation.active) {
            var frameTime = animation.duration / animation.length;
            animation.time += animation.direction * delta, animation.mirroredLoop ? (animation.time > animation.duration || animation.time < 0) && (animation.direction *= -1, 
            animation.time > animation.duration && (animation.time = animation.duration, animation.directionBackwards = !0), 
            animation.time < 0 && (animation.time = 0, animation.directionBackwards = !1)) : (animation.time = animation.time % animation.duration, 
            animation.time < 0 && (animation.time += animation.duration));
            var keyframe = animation.start + THREE.Math.clamp(Math.floor(animation.time / frameTime), 0, animation.length - 1), weight = animation.weight;
            keyframe !== animation.currentFrame && (this.morphTargetInfluences[animation.lastFrame] = 0, 
            this.morphTargetInfluences[animation.currentFrame] = 1 * weight, this.morphTargetInfluences[keyframe] = 0, 
            animation.lastFrame = animation.currentFrame, animation.currentFrame = keyframe);
            var mix = animation.time % frameTime / frameTime;
            animation.directionBackwards && (mix = 1 - mix), animation.currentFrame !== animation.lastFrame ? (this.morphTargetInfluences[animation.currentFrame] = mix * weight, 
            this.morphTargetInfluences[animation.lastFrame] = (1 - mix) * weight) : this.morphTargetInfluences[animation.currentFrame] = weight;
        }
    }
};

var THREEx = THREEx || {};

THREEx.UniversalLoader = function() {}, THREEx.UniversalLoader.prototype.load = function(urls, onLoad) {
    return "string" == typeof urls && (urls = [ urls ]), urls[0].match(/\.stl$/i) && 1 === urls.length ? (this.loader = new THREE.STLLoader(), 
    this.loader.addEventListener("load", function(event) {
        var geometry = event.content, material = new THREE.MeshPhongMaterial(), object3d = new THREE.Mesh(geometry, material);
        onLoad(object3d);
    }), void this.loader.load(urls[0])) : urls[0].match(/\.dae$/i) && 1 === urls.length ? (this.loader = new THREE.ColladaLoader(), 
    this.loader.options.convertUpAxis = !0, void this.loader.load(urls[0], function(collada) {
        var object3d = collada.scene;
        onLoad(object3d);
    })) : urls[0].match(/\.js$/i) && 1 === urls.length ? (this.loader = new THREE.JSONLoader(), 
    void this.loader.load(urls[0], function(geometry, materials) {
        if (materials.length > 1) var material = new THREE.MeshFaceMaterial(materials); else var material = materials[0];
        var object3d = new THREE.Mesh(geometry, material);
        onLoad(object3d);
    })) : urls[0].match(/\.obj$/i) && 1 === urls.length ? (this.loader = new THREE.OBJLoader(), 
    void this.loader.load(urls[0], function(object3d) {
        onLoad(object3d);
    })) : 2 === urls.length && urls[0].match(/\.mtl$/i) && urls[1].match(/\.obj$/i) ? (this.loader = new THREE.OBJMTLLoader(), 
    void this.loader.load(urls[1], urls[0], function(object3d) {
        onLoad(object3d);
    })) : 2 === urls.length && urls[0].match(/\.obj$/i) && urls[1].match(/\.mtl$/i) ? (this.loader = new THREE.OBJMTLLoader(), 
    void this.loader.load(urls[0], urls[1], function(object3d) {
        onLoad(object3d);
    })) : void console.assert(!1);
};

var SceneManager;

SceneManager = function() {
    function SceneManager() {}
    var PrivateClass, instance;
    return instance = null, PrivateClass = function() {
        function PrivateClass() {
            this.scenes = [], this.currentSceneIndex = void 0;
        }
        return PrivateClass.prototype.currentScene = function() {
            if (void 0 === this.currentSceneIndex) throw "SceneManager.setScene not called";
            if (0 === this.scenes.length) throw "Requires at least one scene";
            return this.scenes[this.currentSceneIndex];
        }, PrivateClass.prototype.addScene = function(scene) {
            var i;
            return i = this.scenes.indexOf(scene), -1 === i ? this.scenes.push(scene) : void 0;
        }, PrivateClass.prototype.removeScene = function(scene) {
            var i;
            return i = this.scenes.indexOf(scene), this.removeSceneByIndex(i);
        }, PrivateClass.prototype.removeSceneByIndex = function(i) {
            return i >= 0 ? (i === this.currentSceneIndex && (this.currentSceneIndex = void 0), 
            array.splice(i, 1)) : void 0;
        }, PrivateClass.prototype.setScene = function(scene) {
            var i;
            return i = this.scenes.indexOf(scene), this.setSceneByIndex(i), this.currentScene();
        }, PrivateClass.prototype.setSceneByIndex = function(i) {
            return !this.isEmpty() && this.isValidIndex(i) && (this.currentSceneIndex = i), 
            this.currentScene();
        }, PrivateClass.prototype.isEmpty = function() {
            return 0 === this.scenes.length;
        }, PrivateClass.prototype.isValidIndex = function(i) {
            return i >= 0 && i < this.scenes.length;
        }, PrivateClass.prototype.tick = function(tpf) {
            return this.currentScene().tick(tpf);
        }, PrivateClass;
    }(), SceneManager.get = function() {
        return null != instance ? instance : instance = new PrivateClass();
    }, SceneManager;
}();

var NetworkManager;

NetworkManager = function() {
    function NetworkManager() {}
    var PrivateClass, instance;
    return instance = null, PrivateClass = function() {
        function PrivateClass() {
            this.socket = void 0;
        }
        return PrivateClass.prototype.connect = function(namespace) {
            return null == namespace && (namespace = "/"), this.socket = io.connect(namespace), 
            this.socket.on("error", function(err) {
                return console.error(err);
            }), this.socket.on("message", function(msg) {
                return console.log(msg);
            });
        }, PrivateClass.prototype.emit = function(event, params) {
            return params.timestamp = new Date().getTime(), this.socket.emit(event, params);
        }, PrivateClass;
    }(), NetworkManager.get = function() {
        return null != instance ? instance : instance = new PrivateClass();
    }, NetworkManager;
}();

var StatsManager;

StatsManager = function() {
    function StatsManager() {}
    var PrivateClass, instance;
    return instance = null, PrivateClass = function() {
        function PrivateClass() {
            this.statsVisible = !1, this.stats = new Stats(), this.stats.domElement.style.position = "absolute", 
            this.stats.domElement.style.top = "0px", this.rendererStats = new THREEx.RendererStats(), 
            this.rendererStats.domElement.style.position = "absolute", this.rendererStats.domElement.style.left = "0px", 
            this.rendererStats.domElement.style.bottom = "0px";
        }
        return PrivateClass.prototype.toggle = function() {
            return this.statsVisible = !this.statsVisible, this.statsVisible ? (document.body.appendChild(this.stats.domElement), 
            document.body.appendChild(this.rendererStats.domElement)) : (document.body.removeChild(this.stats.domElement), 
            document.body.removeChild(this.rendererStats.domElement)), this.statsVisible;
        }, PrivateClass.prototype.update = function(renderer) {
            return this.stats.update(), this.rendererStats.update(renderer);
        }, PrivateClass;
    }(), StatsManager.get = function() {
        return null != instance ? instance : instance = new PrivateClass();
    }, StatsManager;
}();

var SoundManager;

SoundManager = function() {
    function SoundManager() {}
    var PrivateClass, instance;
    return instance = null, PrivateClass = function() {
        function PrivateClass() {
            this.sounds = {};
        }
        return PrivateClass.prototype.add = function(key, url) {
            var audio, source;
            return audio = document.createElement("audio"), source = document.createElement("source"), 
            source.src = url, audio.appendChild(source), this.sounds[key] = audio;
        }, PrivateClass.prototype.play = function(key) {
            return key in this.sounds ? this.sounds[key].play() : console.log("Sound with key: " + key + " not found!");
        }, PrivateClass.prototype.updateGlobalVolume = function(i) {
            var key;
            0 > i && (i = 0), i > 1 && (i = 1);
            for (key in this.sounds) this.sounds[key].volume = i;
            return i;
        }, PrivateClass;
    }(), SoundManager.get = function() {
        return null != instance ? instance : instance = new PrivateClass();
    }, SoundManager;
}();

var EngineUtils;

EngineUtils = function() {
    function EngineUtils() {}
    return EngineUtils.toggleFullScreen = function() {
        document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement ? document.exitFullscreen ? document.exitFullscreen() : document.msExitFullscreen ? document.msExitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen && document.webkitExitFullscreen() : document.documentElement.requestFullscreen ? document.documentElement.requestFullscreen() : document.documentElement.msRequestFullscreen ? document.documentElement.msRequestFullscreen() : document.documentElement.mozRequestFullScreen ? document.documentElement.mozRequestFullScreen() : document.documentElement.webkitRequestFullscreen && document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }, EngineUtils.guid = function() {
        var s4;
        return s4 = function() {
            return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
        }, s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    }, EngineUtils;
}(), THREE.AnaglyphEffect = function(renderer, width, height) {
    var _aspect, _camera, _cameraL, _cameraR, _far, _fov, _material, _near, _params, _renderTargetL, _renderTargetR, _scene, distanceBetweenGlyhs, eyeLeft, eyeRight, focalLength, mesh;
    eyeRight = new THREE.Matrix4(), eyeLeft = new THREE.Matrix4(), distanceBetweenGlyhs = 30, 
    focalLength = 125, _aspect = void 0, _near = void 0, _far = void 0, _fov = void 0, 
    _cameraL = new THREE.PerspectiveCamera(), _cameraL.matrixAutoUpdate = !1, _cameraR = new THREE.PerspectiveCamera(), 
    _cameraR.matrixAutoUpdate = !1, _camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), 
    _scene = new THREE.Scene(), _params = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat
    }, void 0 === width && (width = 512), void 0 === height && (height = 512), _renderTargetL = new THREE.WebGLRenderTarget(width, height, _params), 
    _renderTargetR = new THREE.WebGLRenderTarget(width, height, _params), _material = new THREE.ShaderMaterial({
        uniforms: {
            mapLeft: {
                type: "t",
                value: _renderTargetL
            },
            mapRight: {
                type: "t",
                value: _renderTargetR
            }
        },
        vertexShader: [ "varying vec2 vUv;", "void main() {", "	vUv = vec2( uv.x, uv.y );", "	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}" ].join("\n"),
        fragmentShader: [ "uniform sampler2D mapLeft;", "uniform sampler2D mapRight;", "varying vec2 vUv;", "void main() {", "	vec4 colorL, colorR;", "	vec2 uv = vUv;", "	colorL = texture2D( mapLeft, uv );", "	colorR = texture2D( mapRight, uv );", "	gl_FragColor = vec4( colorL.g * 0.7 + colorL.b * 0.3, colorR.g, colorR.b, colorL.a + colorR.a ) * 1.1;", "}" ].join("\n")
    }), mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), _material), _scene.add(mesh), 
    this.setSize = function(width, height) {
        return _renderTargetL = new THREE.WebGLRenderTarget(width, height, _params), _renderTargetR = new THREE.WebGLRenderTarget(width, height, _params), 
        _material.uniforms.mapLeft.value = _renderTargetL, _material.uniforms.mapRight.value = _renderTargetR, 
        renderer.setSize(width, height);
    }, this.setDistanceBetweenGlyphs = function(dist) {
        return distanceBetweenGlyhs = dist;
    }, this.render = function(scene, camera) {
        var eyeSep, eyeSepOnProjection, hasCameraChanged, projectionMatrix, xmax, xmin, ymax;
        scene.updateMatrixWorld(), void 0 === camera.parent && camera.updateMatrixWorld(), 
        hasCameraChanged = _aspect !== camera.aspect || _near !== camera.near || _far !== camera.far || _fov !== camera.fov, 
        hasCameraChanged && (_aspect = camera.aspect, _near = camera.near, _far = camera.far, 
        _fov = camera.fov, projectionMatrix = camera.projectionMatrix.clone(), eyeSep = focalLength / distanceBetweenGlyhs * .5, 
        eyeSepOnProjection = eyeSep * _near / focalLength, ymax = _near * Math.tan(THREE.Math.degToRad(.5 * _fov)), 
        xmin = void 0, xmax = void 0, eyeRight.elements[12] = eyeSep, eyeLeft.elements[12] = -eyeSep, 
        xmin = -ymax * _aspect + eyeSepOnProjection, xmax = ymax * _aspect + eyeSepOnProjection, 
        projectionMatrix.elements[0] = 2 * _near / (xmax - xmin), projectionMatrix.elements[8] = (xmax + xmin) / (xmax - xmin), 
        _cameraL.projectionMatrix.copy(projectionMatrix), xmin = -ymax * _aspect - eyeSepOnProjection, 
        xmax = ymax * _aspect - eyeSepOnProjection, projectionMatrix.elements[0] = 2 * _near / (xmax - xmin), 
        projectionMatrix.elements[8] = (xmax + xmin) / (xmax - xmin), _cameraR.projectionMatrix.copy(projectionMatrix)), 
        _cameraL.matrixWorld.copy(camera.matrixWorld).multiply(eyeLeft), _cameraL.position.copy(camera.position), 
        _cameraL.near = camera.near, _cameraL.far = camera.far, renderer.render(scene, _cameraL, _renderTargetL, !0), 
        _cameraR.matrixWorld.copy(camera.matrixWorld).multiply(eyeRight), _cameraR.position.copy(camera.position), 
        _cameraR.near = camera.near, _cameraR.far = camera.far, renderer.render(scene, _cameraR, _renderTargetR, !0), 
        renderer.render(_scene, _camera);
    };
};

var exports;

exports = void 0, ("undefined" == typeof exports || null === exports) && (exports = {});

var JsonModelManager;

JsonModelManager = function() {
    function JsonModelManager() {}
    var PrivateClass, instance;
    return instance = null, PrivateClass = function() {
        function PrivateClass() {
            this.loader = new THREE.JSONLoader(), this.models = {}, this.loadCount = 0;
        }
        return PrivateClass.prototype.load = function(key, url, callback) {
            return this.loadCount += 1, this.loader.load(url, function(geometry, materials) {
                var anim, animation, i, j, len, mat, material, mesh, ref;
                for (mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials)), 
                material = mesh.material.materials, i = 0; i < materials.length; ) mat = materials[i], 
                mat.skinning = !0, i++;
                if (null != mesh.animations) throw "mesh already has animations. not overwriting default behaviour";
                if (mesh.animations = [], null != mesh.geometry.animations) for (ref = mesh.geometry.animations, 
                j = 0, len = ref.length; len > j; j++) anim = ref[j], animation = new THREE.Animation(mesh, anim, THREE.AnimationHandler.CATMULLROM), 
                mesh.animations.push(animation);
                return JsonModelManager.get().models[key] = mesh, callback(mesh);
            });
        }, PrivateClass.prototype.hasFinishedLoading = function() {
            return this.loadCount === Object.keys(this.models).size();
        }, PrivateClass;
    }(), JsonModelManager.get = function() {
        return null != instance ? instance : instance = new PrivateClass();
    }, JsonModelManager;
}();

var ResourceManager;

ResourceManager = function() {
    function ResourceManager() {}
    var PrivateClass, instance;
    return instance = null, PrivateClass = function() {
        function PrivateClass() {
            this.loadedImages = 0, this.totalImages = 0, this.images = {};
        }
        return PrivateClass.prototype.addImage = function(key, url) {
            var material;
            return this.totalImages += 1, material = new THREE.MeshBasicMaterial({
                transparent: !0,
                map: THREE.ImageUtils.loadTexture(url, {}, this._inc)
            }), this.images[key] = material, this;
        }, PrivateClass.prototype.image = function(key) {
            return this.images[key];
        }, PrivateClass.prototype.hasFinishedLoading = function() {
            return this.loadedImages === this.totalImages;
        }, PrivateClass.prototype._inc = function() {
            return ResourceManager.get().loadedImages += 1;
        }, PrivateClass;
    }(), ResourceManager.get = function() {
        return null != instance ? instance : instance = new PrivateClass();
    }, ResourceManager;
}();

var BaseScene;

BaseScene = function() {
    function BaseScene() {
        this.scene = new THREE.Scene(), this.lastMousePosition = void 0, this.loaded = !1;
    }
    return BaseScene.prototype.tick = function(tpf) {
        throw "scene.tick not implemented";
    }, BaseScene.prototype.doMouseEvent = function(event, raycaster) {
        throw "scene.doMouseEvent not implemented";
    }, BaseScene.prototype.doKeyboardEvent = function(event) {
        throw "scene.doKeyboardEvent not implemented";
    }, BaseScene;
}();

var BaseModel;

BaseModel = function() {
    function BaseModel() {
        this.mesh = void 0, this.visible = !0;
    }
    return BaseModel.prototype.setRotation = function(x, y, z) {
        return this.mesh.rotation.x = x, this.mesh.rotation.y = y, this.mesh.rotation.z = z;
    }, BaseModel.prototype.setPosition = function(x, y, z) {
        return null != y ? (this.mesh.position.x = x, this.mesh.position.y = y, this.mesh.position.z = z) : (this.mesh.position.x = null != x.x ? x.x : 0, 
        this.mesh.position.y = null != x.y ? x.y : 0, this.mesh.position.z = null != x.z ? x.z : 0, 
        this.mesh.rotation.x = null != x.rX ? x.rX : 0, this.mesh.rotation.y = null != x.rY ? x.rY : 0, 
        this.mesh.rotation.z = null != x.rZ ? x.rZ : 0);
    }, BaseModel.prototype.getTweenFromPosition = function() {
        return {
            x: this.mesh.position.x,
            y: this.mesh.position.y,
            z: this.mesh.position.z,
            rX: this.mesh.rotation.x,
            rY: this.mesh.rotation.y,
            rZ: this.mesh.rotation.z
        };
    }, BaseModel.prototype.setPositionX = function(x) {
        return this.mesh.position.x = x;
    }, BaseModel.prototype.setPositionY = function(y) {
        return this.mesh.position.y = y;
    }, BaseModel.prototype.setPositionZ = function(z) {
        return this.mesh.position.z = z;
    }, BaseModel.prototype.modifyPosition = function(x, y, z) {
        return this.mesh.position.x += x, this.mesh.position.y += y, this.mesh.position.z += z;
    }, BaseModel.prototype.setScale = function(i) {
        return this.mesh.scale.set(i, i, i);
    }, BaseModel.prototype.setVisible = function(b) {
        return this.mesh.traverse(function(object) {
            return object.visible = b;
        }), this.visible = b;
    }, BaseModel.prototype.isPressed = function(raycaster) {
        return raycaster.intersectObject(this.mesh).length > 0;
    }, BaseModel.prototype.isHovered = function(raycaster) {
        return raycaster.intersectObject(this.mesh).length > 0;
    }, BaseModel.prototype.attachParticle = function(particle) {
        return null != this.mesh ? (this.particle = particle, this.particle.attached = !0, 
        this.mesh.add(particle.mesh)) : void 0;
    }, BaseModel.prototype.detachParticle = function() {
        return null != this.mesh && null != this.particle ? (this.mesh.remove(this.particle.mesh), 
        this.particle.attached = !1, this.particle = void 0) : void 0;
    }, BaseModel;
}();

var Config;

Config = function() {
    function Config() {}
    var PrivateClass, instance;
    return instance = null, PrivateClass = function() {
        function PrivateClass() {
            this.showStatsOnLoad = !1, this.contextMenuDisabled = !0, this.antialias = !0, this.anaglyph = !1, 
            this.anaglyphDistance = 600, this.resize = !1, this.width = 1280, this.height = 720, 
            this.soundEnabled = !1, this.debug = !1, this.preventDefaultMouseEvents = !0, this.animate = !0, 
            this.transparentBackground = !1;
        }
        return PrivateClass.prototype.fillWindow = function() {
            return this.resize = !0, this.width = window.innerWidth, this.height = window.innerHeight;
        }, PrivateClass.prototype.toggleAnaglyph = function() {
            return this.anaglyph = !this.anaglyph;
        }, PrivateClass.prototype.toggleStats = function() {
            return StatsManager.get().toggle();
        }, PrivateClass.prototype.toggleSound = function() {
            return this.soundEnabled = !this.soundEnabled;
        }, PrivateClass.prototype.toggleDebug = function() {
            return this.debug = !this.debug;
        }, PrivateClass.prototype.toggleFullScreen = function() {
            return EngineUtils.toggleFullScreen();
        }, PrivateClass;
    }(), Config.get = function() {
        return null != instance ? instance : instance = new PrivateClass();
    }, Config;
}(), exports.Config = Config;

var Helper;

Helper = function() {
    function Helper() {}
    return Helper.camera = function(options) {
        var config;
        return null == options && (options = {}), config = Config.get(), null == options.view_angle && (options.view_angle = 45), 
        null == options.aspect && (options.aspect = config.width / config.height), null == options.near && (options.near = 1), 
        null == options.far && (options.far = 1e4), new THREE.PerspectiveCamera(options.view_angle, options.aspect, options.near, options.far);
    }, Helper.light = function() {
        var light;
        return light = new THREE.DirectionalLight(16777215), light.position.set(0, 100, 60), 
        light.castShadow = !0, light.shadowCameraLeft = -60, light.shadowCameraTop = -60, 
        light.shadowCameraRight = 60, light.shadowCameraBottom = 60, light.shadowCameraNear = 1, 
        light.shadowCameraFar = 1e3, light.shadowBias = -1e-4, light.shadowMapWidth = light.shadowMapHeight = 1024, 
        light.shadowDarkness = .7, light;
    }, Helper.ambientLight = function() {
        return new THREE.AmbientLight(4210752);
    }, Helper.cube = function() {
        var box, mat;
        return box = new THREE.BoxGeometry(10, 10, 10), mat = new THREE.MeshLambertMaterial({
            color: 16711680
        }), new THREE.Mesh(box, mat);
    }, Helper.fancyShadows = function(renderer) {
        return renderer.shadowMapEnabled = !0, renderer.shadowMapSoft = !0, renderer.shadowMapType = THREE.PCFShadowMap, 
        renderer.shadowMapAutoUpdate = !0;
    }, Helper;
}();

var Engine3D, bind = function(fn, me) {
    return function() {
        return fn.apply(me, arguments);
    };
};

Engine3D = function() {
    function Engine3D() {
        this.render = bind(this.render, this), this.onDocumentKeyboardEvent = bind(this.onDocumentKeyboardEvent, this), 
        this.onDocumentMouseEvent = bind(this.onDocumentMouseEvent, this);
        var camera;
        this.config = Config.get(), this.width = this.config.width, this.height = this.config.height, 
        this.time = void 0, this.renderer = new THREE.WebGLRenderer({
            antialias: this.config.antialias,
            alpha: this.config.transparentBackground
        }), this.renderer.setSize(this.width, this.height), document.body.appendChild(this.renderer.domElement), 
        camera = new THREE.PerspectiveCamera(75, this.width / this.height, .1, 1e3), this.setCamera(camera), 
        this.camera.position.z = 10, this.anaglyphEffect = new THREE.AnaglyphEffect(this.renderer), 
        this.anaglyphEffect.setSize(this.width, this.height), this.anaglyphEffect.setDistanceBetweenGlyphs(this.config.anaglyphDistance), 
        this.sceneManager = SceneManager.get(), document.addEventListener("mouseup", this.onDocumentMouseEvent, !1), 
        document.addEventListener("mousedown", this.onDocumentMouseEvent, !1), document.addEventListener("mousemove", this.onDocumentMouseEvent, !1), 
        document.addEventListener("keydown", this.onDocumentKeyboardEvent, !1), document.addEventListener("keyup", this.onDocumentKeyboardEvent, !1), 
        this.config.contextMenuDisabled && document.addEventListener("contextmenu", function(e) {
            return e.preventDefault();
        }, !1), this.statsManager = StatsManager.get(), this.config.showStatsOnLoad && this.statsManager.toggle();
    }
    return Engine3D.prototype.onDocumentMouseEvent = function(event) {
        var raycaster;
        return raycaster = this._parseMouseEvent(event), null != raycaster ? this.sceneManager.currentScene().doMouseEvent(event, raycaster) : void 0;
    }, Engine3D.prototype.onDocumentKeyboardEvent = function(event) {
        return this.sceneManager.currentScene().doKeyboardEvent(event);
    }, Engine3D.prototype.setCursor = function(url) {
        return document.body.style.cursor = "url('" + url + "'), auto";
    }, Engine3D.prototype.setCamera = function(camera) {
        return this.camera = camera, this.config.resize ? this.winResize = new THREEx.WindowResize(this.renderer, this.camera) : void 0;
    }, Engine3D.prototype.addScene = function(scene) {
        return this.sceneManager.addScene(scene), null == this.sceneManager.currentSceneIndex ? this.sceneManager.setScene(scene) : void 0;
    }, Engine3D.prototype.removeScene = function(scene) {
        return this.sceneManager.removeScene(scene);
    }, Engine3D.prototype.render = function() {
        var now, tpf;
        return requestAnimationFrame(this.render), this.width = window.innerWidth, this.height = window.innerHeight, 
        now = new Date().getTime(), tpf = (now - (this.time || now)) / 1e3, this.time = now, 
        this.sceneManager.tick(tpf), this.config.animate && THREE.AnimationHandler.update(tpf), 
        this.statsManager.update(this.renderer), TWEEN.update(), this.renderer.render(this.sceneManager.currentScene().scene, this.camera), 
        this.config.anaglyph ? this.anaglyphEffect.render(this.sceneManager.currentScene().scene, this.camera) : void 0;
    }, Engine3D.prototype._parseMouseEvent = function(event) {
        var mouseX, mouseY, vector;
        return this.config.preventDefaultMouseEvents && event.preventDefault(), event.target === this.renderer.domElement ? (mouseX = event.layerX / this.width * 2 - 1, 
        mouseY = 2 * -(event.layerY / this.height) + 1, vector = new THREE.Vector3(mouseX, mouseY, .5), 
        vector.unproject(this.camera), new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize())) : void 0;
    }, Engine3D;
}();