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

var THREE = {
    REVISION: "71"
};

"object" == typeof module && (module.exports = THREE), void 0 === Math.sign && (Math.sign = function(x) {
    return 0 > x ? -1 : x > 0 ? 1 : +x;
}), THREE.log = function() {
    console.log.apply(console, arguments);
}, THREE.warn = function() {
    console.warn.apply(console, arguments);
}, THREE.error = function() {
    console.error.apply(console, arguments);
}, THREE.MOUSE = {
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2
}, THREE.CullFaceNone = 0, THREE.CullFaceBack = 1, THREE.CullFaceFront = 2, THREE.CullFaceFrontBack = 3, 
THREE.FrontFaceDirectionCW = 0, THREE.FrontFaceDirectionCCW = 1, THREE.BasicShadowMap = 0, 
THREE.PCFShadowMap = 1, THREE.PCFSoftShadowMap = 2, THREE.FrontSide = 0, THREE.BackSide = 1, 
THREE.DoubleSide = 2, THREE.NoShading = 0, THREE.FlatShading = 1, THREE.SmoothShading = 2, 
THREE.NoColors = 0, THREE.FaceColors = 1, THREE.VertexColors = 2, THREE.NoBlending = 0, 
THREE.NormalBlending = 1, THREE.AdditiveBlending = 2, THREE.SubtractiveBlending = 3, 
THREE.MultiplyBlending = 4, THREE.CustomBlending = 5, THREE.AddEquation = 100, THREE.SubtractEquation = 101, 
THREE.ReverseSubtractEquation = 102, THREE.MinEquation = 103, THREE.MaxEquation = 104, 
THREE.ZeroFactor = 200, THREE.OneFactor = 201, THREE.SrcColorFactor = 202, THREE.OneMinusSrcColorFactor = 203, 
THREE.SrcAlphaFactor = 204, THREE.OneMinusSrcAlphaFactor = 205, THREE.DstAlphaFactor = 206, 
THREE.OneMinusDstAlphaFactor = 207, THREE.DstColorFactor = 208, THREE.OneMinusDstColorFactor = 209, 
THREE.SrcAlphaSaturateFactor = 210, THREE.MultiplyOperation = 0, THREE.MixOperation = 1, 
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
THREE.RGBA_PVRTC_2BPPV1_Format = 2103, THREE.Projector = function() {
    THREE.error("THREE.Projector has been moved to /examples/js/renderers/Projector.js."), 
    this.projectVector = function(vector, camera) {
        THREE.warn("THREE.Projector: .projectVector() is now vector.project()."), vector.project(camera);
    }, this.unprojectVector = function(vector, camera) {
        THREE.warn("THREE.Projector: .unprojectVector() is now vector.unproject()."), vector.unproject(camera);
    }, this.pickingRay = function(vector, camera) {
        THREE.error("THREE.Projector: .pickingRay() is now raycaster.setFromCamera().");
    };
}, THREE.CanvasRenderer = function() {
    THREE.error("THREE.CanvasRenderer has been moved to /examples/js/renderers/CanvasRenderer.js"), 
    this.domElement = document.createElement("canvas"), this.clear = function() {}, 
    this.render = function() {}, this.setClearColor = function() {}, this.setSize = function() {};
}, THREE.Color = function(color) {
    return 3 === arguments.length ? this.setRGB(arguments[0], arguments[1], arguments[2]) : this.set(color);
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
    setHSL: function(h, s, l) {
        if (0 === s) this.r = this.g = this.b = l; else {
            var hue2rgb = function(p, q, t) {
                return 0 > t && (t += 1), t > 1 && (t -= 1), 1 / 6 > t ? p + 6 * (q - p) * t : .5 > t ? q : 2 / 3 > t ? p + 6 * (q - p) * (2 / 3 - t) : p;
            }, p = .5 >= l ? l * (1 + s) : l + s - l * s, q = 2 * l - p;
            this.r = hue2rgb(q, p, h + 1 / 3), this.g = hue2rgb(q, p, h), this.b = hue2rgb(q, p, h - 1 / 3);
        }
        return this;
    },
    setStyle: function(style) {
        if (/^rgb\((\d+), ?(\d+), ?(\d+)\)$/i.test(style)) {
            var color = /^rgb\((\d+), ?(\d+), ?(\d+)\)$/i.exec(style);
            return this.r = Math.min(255, parseInt(color[1], 10)) / 255, this.g = Math.min(255, parseInt(color[2], 10)) / 255, 
            this.b = Math.min(255, parseInt(color[3], 10)) / 255, this;
        }
        if (/^rgb\((\d+)\%, ?(\d+)\%, ?(\d+)\%\)$/i.test(style)) {
            var color = /^rgb\((\d+)\%, ?(\d+)\%, ?(\d+)\%\)$/i.exec(style);
            return this.r = Math.min(100, parseInt(color[1], 10)) / 100, this.g = Math.min(100, parseInt(color[2], 10)) / 100, 
            this.b = Math.min(100, parseInt(color[3], 10)) / 100, this;
        }
        if (/^\#([0-9a-f]{6})$/i.test(style)) {
            var color = /^\#([0-9a-f]{6})$/i.exec(style);
            return this.setHex(parseInt(color[1], 16)), this;
        }
        if (/^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.test(style)) {
            var color = /^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(style);
            return this.setHex(parseInt(color[1] + color[1] + color[2] + color[2] + color[3] + color[3], 16)), 
            this;
        }
        return /^(\w+)$/i.test(style) ? (this.setHex(THREE.ColorKeywords[style]), this) : void 0;
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
    fromArray: function(array) {
        return this.r = array[0], this.g = array[1], this.b = array[2], this;
    },
    toArray: function(array, offset) {
        return void 0 === array && (array = []), void 0 === offset && (offset = 0), array[offset] = this.r, 
        array[offset + 1] = this.g, array[offset + 2] = this.b, array;
    },
    clone: function() {
        return new THREE.Color().setRGB(this.r, this.g, this.b);
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
    _x: 0,
    _y: 0,
    _z: 0,
    _w: 0,
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
    copy: function(quaternion) {
        return this._x = quaternion.x, this._y = quaternion.y, this._z = quaternion.z, this._w = quaternion.w, 
        this.onChangeCallback(), this;
    },
    setFromEuler: function(euler, update) {
        if (euler instanceof THREE.Euler == !1) throw new Error("THREE.Quaternion: .setFromEuler() now expects a Euler rotation rather than a Vector3 and order.");
        var c1 = Math.cos(euler._x / 2), c2 = Math.cos(euler._y / 2), c3 = Math.cos(euler._z / 2), s1 = Math.sin(euler._x / 2), s2 = Math.sin(euler._y / 2), s3 = Math.sin(euler._z / 2);
        return "XYZ" === euler.order ? (this._x = s1 * c2 * c3 + c1 * s2 * s3, this._y = c1 * s2 * c3 - s1 * c2 * s3, 
        this._z = c1 * c2 * s3 + s1 * s2 * c3, this._w = c1 * c2 * c3 - s1 * s2 * s3) : "YXZ" === euler.order ? (this._x = s1 * c2 * c3 + c1 * s2 * s3, 
        this._y = c1 * s2 * c3 - s1 * c2 * s3, this._z = c1 * c2 * s3 - s1 * s2 * c3, this._w = c1 * c2 * c3 + s1 * s2 * s3) : "ZXY" === euler.order ? (this._x = s1 * c2 * c3 - c1 * s2 * s3, 
        this._y = c1 * s2 * c3 + s1 * c2 * s3, this._z = c1 * c2 * s3 + s1 * s2 * c3, this._w = c1 * c2 * c3 - s1 * s2 * s3) : "ZYX" === euler.order ? (this._x = s1 * c2 * c3 - c1 * s2 * s3, 
        this._y = c1 * s2 * c3 + s1 * c2 * s3, this._z = c1 * c2 * s3 - s1 * s2 * c3, this._w = c1 * c2 * c3 + s1 * s2 * s3) : "YZX" === euler.order ? (this._x = s1 * c2 * c3 + c1 * s2 * s3, 
        this._y = c1 * s2 * c3 + s1 * c2 * s3, this._z = c1 * c2 * s3 - s1 * s2 * c3, this._w = c1 * c2 * c3 - s1 * s2 * s3) : "XZY" === euler.order && (this._x = s1 * c2 * c3 - c1 * s2 * s3, 
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
        return void 0 !== p ? (THREE.warn("THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead."), 
        this.multiplyQuaternions(q, p)) : this.multiplyQuaternions(this, q);
    },
    multiplyQuaternions: function(a, b) {
        var qax = a._x, qay = a._y, qaz = a._z, qaw = a._w, qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;
        return this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby, this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz, 
        this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx, this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz, 
        this.onChangeCallback(), this;
    },
    multiplyVector3: function(vector) {
        return THREE.warn("THREE.Quaternion: .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead."), 
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
    onChangeCallback: function() {},
    clone: function() {
        return new THREE.Quaternion(this._x, this._y, this._z, this._w);
    }
}, THREE.Quaternion.slerp = function(qa, qb, qm, t) {
    return qm.copy(qa).slerp(qb, t);
}, THREE.Vector2 = function(x, y) {
    this.x = x || 0, this.y = y || 0;
}, THREE.Vector2.prototype = {
    constructor: THREE.Vector2,
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
    copy: function(v) {
        return this.x = v.x, this.y = v.y, this;
    },
    add: function(v, w) {
        return void 0 !== w ? (THREE.warn("THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead."), 
        this.addVectors(v, w)) : (this.x += v.x, this.y += v.y, this);
    },
    addScalar: function(s) {
        return this.x += s, this.y += s, this;
    },
    addVectors: function(a, b) {
        return this.x = a.x + b.x, this.y = a.y + b.y, this;
    },
    sub: function(v, w) {
        return void 0 !== w ? (THREE.warn("THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."), 
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
    multiplyScalar: function(s) {
        return this.x *= s, this.y *= s, this;
    },
    divide: function(v) {
        return this.x /= v.x, this.y /= v.y, this;
    },
    divideScalar: function(scalar) {
        if (0 !== scalar) {
            var invScalar = 1 / scalar;
            this.x *= invScalar, this.y *= invScalar;
        } else this.x = 0, this.y = 0;
        return this;
    },
    min: function(v) {
        return this.x > v.x && (this.x = v.x), this.y > v.y && (this.y = v.y), this;
    },
    max: function(v) {
        return this.x < v.x && (this.x = v.x), this.y < v.y && (this.y = v.y), this;
    },
    clamp: function(min, max) {
        return this.x < min.x ? this.x = min.x : this.x > max.x && (this.x = max.x), this.y < min.y ? this.y = min.y : this.y > max.y && (this.y = max.y), 
        this;
    },
    clampScalar: function() {
        var min, max;
        return function(minVal, maxVal) {
            return void 0 === min && (min = new THREE.Vector2(), max = new THREE.Vector2()), 
            min.set(minVal, minVal), max.set(maxVal, maxVal), this.clamp(min, max);
        };
    }(),
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
    setLength: function(l) {
        var oldLength = this.length();
        return 0 !== oldLength && l !== oldLength && this.multiplyScalar(l / oldLength), 
        this;
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
    clone: function() {
        return new THREE.Vector2(this.x, this.y);
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
    copy: function(v) {
        return this.x = v.x, this.y = v.y, this.z = v.z, this;
    },
    add: function(v, w) {
        return void 0 !== w ? (THREE.warn("THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead."), 
        this.addVectors(v, w)) : (this.x += v.x, this.y += v.y, this.z += v.z, this);
    },
    addScalar: function(s) {
        return this.x += s, this.y += s, this.z += s, this;
    },
    addVectors: function(a, b) {
        return this.x = a.x + b.x, this.y = a.y + b.y, this.z = a.z + b.z, this;
    },
    sub: function(v, w) {
        return void 0 !== w ? (THREE.warn("THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."), 
        this.subVectors(v, w)) : (this.x -= v.x, this.y -= v.y, this.z -= v.z, this);
    },
    subScalar: function(s) {
        return this.x -= s, this.y -= s, this.z -= s, this;
    },
    subVectors: function(a, b) {
        return this.x = a.x - b.x, this.y = a.y - b.y, this.z = a.z - b.z, this;
    },
    multiply: function(v, w) {
        return void 0 !== w ? (THREE.warn("THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead."), 
        this.multiplyVectors(v, w)) : (this.x *= v.x, this.y *= v.y, this.z *= v.z, this);
    },
    multiplyScalar: function(scalar) {
        return this.x *= scalar, this.y *= scalar, this.z *= scalar, this;
    },
    multiplyVectors: function(a, b) {
        return this.x = a.x * b.x, this.y = a.y * b.y, this.z = a.z * b.z, this;
    },
    applyEuler: function() {
        var quaternion;
        return function(euler) {
            return euler instanceof THREE.Euler == !1 && THREE.error("THREE.Vector3: .applyEuler() now expects a Euler rotation rather than a Vector3 and order."), 
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
        if (0 !== scalar) {
            var invScalar = 1 / scalar;
            this.x *= invScalar, this.y *= invScalar, this.z *= invScalar;
        } else this.x = 0, this.y = 0, this.z = 0;
        return this;
    },
    min: function(v) {
        return this.x > v.x && (this.x = v.x), this.y > v.y && (this.y = v.y), this.z > v.z && (this.z = v.z), 
        this;
    },
    max: function(v) {
        return this.x < v.x && (this.x = v.x), this.y < v.y && (this.y = v.y), this.z < v.z && (this.z = v.z), 
        this;
    },
    clamp: function(min, max) {
        return this.x < min.x ? this.x = min.x : this.x > max.x && (this.x = max.x), this.y < min.y ? this.y = min.y : this.y > max.y && (this.y = max.y), 
        this.z < min.z ? this.z = min.z : this.z > max.z && (this.z = max.z), this;
    },
    clampScalar: function() {
        var min, max;
        return function(minVal, maxVal) {
            return void 0 === min && (min = new THREE.Vector3(), max = new THREE.Vector3()), 
            min.set(minVal, minVal, minVal), max.set(maxVal, maxVal, maxVal), this.clamp(min, max);
        };
    }(),
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
    setLength: function(l) {
        var oldLength = this.length();
        return 0 !== oldLength && l !== oldLength && this.multiplyScalar(l / oldLength), 
        this;
    },
    lerp: function(v, alpha) {
        return this.x += (v.x - this.x) * alpha, this.y += (v.y - this.y) * alpha, this.z += (v.z - this.z) * alpha, 
        this;
    },
    lerpVectors: function(v1, v2, alpha) {
        return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1), this;
    },
    cross: function(v, w) {
        if (void 0 !== w) return THREE.warn("THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead."), 
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
        THREE.error("THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.");
    },
    setEulerFromQuaternion: function(q, order) {
        THREE.error("THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.");
    },
    getPositionFromMatrix: function(m) {
        return THREE.warn("THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition()."), 
        this.setFromMatrixPosition(m);
    },
    getScaleFromMatrix: function(m) {
        return THREE.warn("THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale()."), 
        this.setFromMatrixScale(m);
    },
    getColumnFromMatrix: function(index, matrix) {
        return THREE.warn("THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn()."), 
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
    },
    clone: function() {
        return new THREE.Vector3(this.x, this.y, this.z);
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
    copy: function(v) {
        return this.x = v.x, this.y = v.y, this.z = v.z, this.w = void 0 !== v.w ? v.w : 1, 
        this;
    },
    add: function(v, w) {
        return void 0 !== w ? (THREE.warn("THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead."), 
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
    sub: function(v, w) {
        return void 0 !== w ? (THREE.warn("THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."), 
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
        return this.x *= scalar, this.y *= scalar, this.z *= scalar, this.w *= scalar, this;
    },
    applyMatrix4: function(m) {
        var x = this.x, y = this.y, z = this.z, w = this.w, e = m.elements;
        return this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w, this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w, 
        this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w, this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w, 
        this;
    },
    divideScalar: function(scalar) {
        if (0 !== scalar) {
            var invScalar = 1 / scalar;
            this.x *= invScalar, this.y *= invScalar, this.z *= invScalar, this.w *= invScalar;
        } else this.x = 0, this.y = 0, this.z = 0, this.w = 1;
        return this;
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
        return this.x > v.x && (this.x = v.x), this.y > v.y && (this.y = v.y), this.z > v.z && (this.z = v.z), 
        this.w > v.w && (this.w = v.w), this;
    },
    max: function(v) {
        return this.x < v.x && (this.x = v.x), this.y < v.y && (this.y = v.y), this.z < v.z && (this.z = v.z), 
        this.w < v.w && (this.w = v.w), this;
    },
    clamp: function(min, max) {
        return this.x < min.x ? this.x = min.x : this.x > max.x && (this.x = max.x), this.y < min.y ? this.y = min.y : this.y > max.y && (this.y = max.y), 
        this.z < min.z ? this.z = min.z : this.z > max.z && (this.z = max.z), this.w < min.w ? this.w = min.w : this.w > max.w && (this.w = max.w), 
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
    setLength: function(l) {
        var oldLength = this.length();
        return 0 !== oldLength && l !== oldLength && this.multiplyScalar(l / oldLength), 
        this;
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
    },
    clone: function() {
        return new THREE.Vector4(this.x, this.y, this.z, this.w);
    }
}, THREE.Euler = function(x, y, z, order) {
    this._x = x || 0, this._y = y || 0, this._z = z || 0, this._order = order || THREE.Euler.DefaultOrder;
}, THREE.Euler.RotationOrders = [ "XYZ", "YZX", "ZXY", "XZY", "YXZ", "ZYX" ], THREE.Euler.DefaultOrder = "XYZ", 
THREE.Euler.prototype = {
    constructor: THREE.Euler,
    _x: 0,
    _y: 0,
    _z: 0,
    _order: THREE.Euler.DefaultOrder,
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
        this._y = 0)) : THREE.warn("THREE.Euler: .setFromRotationMatrix() given unsupported order: " + order), 
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
    onChangeCallback: function() {},
    clone: function() {
        return new THREE.Euler(this._x, this._y, this._z, this._order);
    }
}, THREE.Line3 = function(start, end) {
    this.start = void 0 !== start ? start : new THREE.Vector3(), this.end = void 0 !== end ? end : new THREE.Vector3();
}, THREE.Line3.prototype = {
    constructor: THREE.Line3,
    set: function(start, end) {
        return this.start.copy(start), this.end.copy(end), this;
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
    },
    clone: function() {
        return new THREE.Line3().copy(this);
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
    },
    clone: function() {
        return new THREE.Box2().copy(this);
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
    },
    clone: function() {
        return new THREE.Box3().copy(this);
    }
}, THREE.Matrix3 = function() {
    this.elements = new Float32Array([ 1, 0, 0, 0, 1, 0, 0, 0, 1 ]), arguments.length > 0 && THREE.error("THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.");
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
    copy: function(m) {
        var me = m.elements;
        return this.set(me[0], me[3], me[6], me[1], me[4], me[7], me[2], me[5], me[8]), 
        this;
    },
    multiplyVector3: function(vector) {
        return THREE.warn("THREE.Matrix3: .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead."), 
        vector.applyMatrix3(this);
    },
    multiplyVector3Array: function(a) {
        return THREE.warn("THREE.Matrix3: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead."), 
        this.applyToVector3Array(a);
    },
    applyToVector3Array: function() {
        var v1 = new THREE.Vector3();
        return function(array, offset, length) {
            void 0 === offset && (offset = 0), void 0 === length && (length = array.length);
            for (var i = 0, j = offset; length > i; i += 3, j += 3) v1.x = array[j], v1.y = array[j + 1], 
            v1.z = array[j + 2], v1.applyMatrix3(this), array[j] = v1.x, array[j + 1] = v1.y, 
            array[j + 2] = v1.z;
            return array;
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
            return THREE.warn(msg), this.identity(), this;
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
    },
    clone: function() {
        return new THREE.Matrix3().fromArray(this.elements);
    }
}, THREE.Matrix4 = function() {
    this.elements = new Float32Array([ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ]), 
    arguments.length > 0 && THREE.error("THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.");
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
    copy: function(m) {
        return this.elements.set(m.elements), this;
    },
    extractPosition: function(m) {
        return THREE.warn("THREE.Matrix4: .extractPosition() has been renamed to .copyPosition()."), 
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
        var v1 = new THREE.Vector3();
        return function(m) {
            var te = this.elements, me = m.elements, scaleX = 1 / v1.set(me[0], me[1], me[2]).length(), scaleY = 1 / v1.set(me[4], me[5], me[6]).length(), scaleZ = 1 / v1.set(me[8], me[9], me[10]).length();
            return te[0] = me[0] * scaleX, te[1] = me[1] * scaleX, te[2] = me[2] * scaleX, te[4] = me[4] * scaleY, 
            te[5] = me[5] * scaleY, te[6] = me[6] * scaleY, te[8] = me[8] * scaleZ, te[9] = me[9] * scaleZ, 
            te[10] = me[10] * scaleZ, this;
        };
    }(),
    makeRotationFromEuler: function(euler) {
        euler instanceof THREE.Euler == !1 && THREE.error("THREE.Matrix: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.");
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
        return THREE.warn("THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion()."), 
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
        var x = new THREE.Vector3(), y = new THREE.Vector3(), z = new THREE.Vector3();
        return function(eye, target, up) {
            var te = this.elements;
            return z.subVectors(eye, target).normalize(), 0 === z.length() && (z.z = 1), x.crossVectors(up, z).normalize(), 
            0 === x.length() && (z.x += 1e-4, x.crossVectors(up, z).normalize()), y.crossVectors(z, x), 
            te[0] = x.x, te[4] = y.x, te[8] = z.x, te[1] = x.y, te[5] = y.y, te[9] = z.y, te[2] = x.z, 
            te[6] = y.z, te[10] = z.z, this;
        };
    }(),
    multiply: function(m, n) {
        return void 0 !== n ? (THREE.warn("THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead."), 
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
        return THREE.warn("THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) or vector.applyProjection( matrix ) instead."), 
        vector.applyProjection(this);
    },
    multiplyVector4: function(vector) {
        return THREE.warn("THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead."), 
        vector.applyMatrix4(this);
    },
    multiplyVector3Array: function(a) {
        return THREE.warn("THREE.Matrix4: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead."), 
        this.applyToVector3Array(a);
    },
    applyToVector3Array: function() {
        var v1 = new THREE.Vector3();
        return function(array, offset, length) {
            void 0 === offset && (offset = 0), void 0 === length && (length = array.length);
            for (var i = 0, j = offset; length > i; i += 3, j += 3) v1.x = array[j], v1.y = array[j + 1], 
            v1.z = array[j + 2], v1.applyMatrix4(this), array[j] = v1.x, array[j + 1] = v1.y, 
            array[j + 2] = v1.z;
            return array;
        };
    }(),
    rotateAxis: function(v) {
        THREE.warn("THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead."), 
        v.transformDirection(this);
    },
    crossVector: function(vector) {
        return THREE.warn("THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead."), 
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
        var v1 = new THREE.Vector3();
        return function() {
            THREE.warn("THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead.");
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
        if (0 == det) {
            var msg = "THREE.Matrix4.getInverse(): can't invert matrix, determinant is 0";
            if (throwOnInvertible) throw new Error(msg);
            return THREE.warn(msg), this.identity(), this;
        }
        return this.multiplyScalar(1 / det), this;
    },
    translate: function(v) {
        THREE.error("THREE.Matrix4: .translate() has been removed.");
    },
    rotateX: function(angle) {
        THREE.error("THREE.Matrix4: .rotateX() has been removed.");
    },
    rotateY: function(angle) {
        THREE.error("THREE.Matrix4: .rotateY() has been removed.");
    },
    rotateZ: function(angle) {
        THREE.error("THREE.Matrix4: .rotateZ() has been removed.");
    },
    rotateByAxis: function(axis, angle) {
        THREE.error("THREE.Matrix4: .rotateByAxis() has been removed.");
    },
    scale: function(v) {
        var te = this.elements, x = v.x, y = v.y, z = v.z;
        return te[0] *= x, te[4] *= y, te[8] *= z, te[1] *= x, te[5] *= y, te[9] *= z, te[2] *= x, 
        te[6] *= y, te[10] *= z, te[3] *= x, te[7] *= y, te[11] *= z, this;
    },
    getMaxScaleOnAxis: function() {
        var te = this.elements, scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2], scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6], scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];
        return Math.sqrt(Math.max(scaleXSq, Math.max(scaleYSq, scaleZSq)));
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
        var vector = new THREE.Vector3(), matrix = new THREE.Matrix4();
        return function(position, quaternion, scale) {
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
    fromArray: function(array) {
        return this.elements.set(array), this;
    },
    toArray: function() {
        var te = this.elements;
        return [ te[0], te[1], te[2], te[3], te[4], te[5], te[6], te[7], te[8], te[9], te[10], te[11], te[12], te[13], te[14], te[15] ];
    },
    clone: function() {
        return new THREE.Matrix4().fromArray(this.elements);
    }
}, THREE.Ray = function(origin, direction) {
    this.origin = void 0 !== origin ? origin : new THREE.Vector3(), this.direction = void 0 !== direction ? direction : new THREE.Vector3();
}, THREE.Ray.prototype = {
    constructor: THREE.Ray,
    set: function(origin, direction) {
        return this.origin.copy(origin), this.direction.copy(direction), this;
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
    distanceToPoint: function() {
        var v1 = new THREE.Vector3();
        return function(point) {
            var directionDistance = v1.subVectors(point, this.origin).dot(this.direction);
            return 0 > directionDistance ? this.origin.distanceTo(point) : (v1.copy(this.direction).multiplyScalar(directionDistance).add(this.origin), 
            v1.distanceTo(point));
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
        if (0 == denominator) return 0 == plane.distanceToPoint(this.origin) ? 0 : null;
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
    },
    clone: function() {
        return new THREE.Ray().copy(this);
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
    },
    clone: function() {
        return new THREE.Sphere().copy(this);
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
    },
    clone: function() {
        return new THREE.Frustum().copy(this);
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
            if (0 == denominator) return 0 == this.distanceToPoint(line.start) ? result.copy(line.start) : void 0;
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
        return plane.normal.equals(this.normal) && plane.constant == this.constant;
    },
    clone: function() {
        return new THREE.Plane().copy(this);
    }
}, THREE.Math = {
    generateUUID: function() {
        var r, chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""), uuid = new Array(36), rnd = 0;
        return function() {
            for (var i = 0; 36 > i; i++) 8 == i || 13 == i || 18 == i || 23 == i ? uuid[i] = "-" : 14 == i ? uuid[i] = "4" : (2 >= rnd && (rnd = 33554432 + 16777216 * Math.random() | 0), 
            r = 15 & rnd, rnd >>= 4, uuid[i] = chars[19 == i ? 3 & r | 8 : r]);
            return uuid.join("");
        };
    }(),
    clamp: function(x, a, b) {
        return a > x ? a : x > b ? b : x;
    },
    clampBottom: function(x, a) {
        return a > x ? a : x;
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
        return Math.floor(this.randFloat(low, high));
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
        intPoint != oldIntPoint && (chunkLengths[intPoint] = totalLength, oldIntPoint = intPoint);
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
        if (0 == denom) return result.set(-2, -1, -1);
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
    },
    clone: function() {
        return new THREE.Triangle().copy(this);
    }
}, THREE.Clock = function(autoStart) {
    this.autoStart = void 0 !== autoStart ? autoStart : !0, this.startTime = 0, this.oldTime = 0, 
    this.elapsedTime = 0, this.running = !1;
}, THREE.Clock.prototype = {
    constructor: THREE.Clock,
    start: function() {
        this.startTime = void 0 !== self.performance && void 0 !== self.performance.now ? self.performance.now() : Date.now(), 
        this.oldTime = this.startTime, this.running = !0;
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
            var newTime = void 0 !== self.performance && void 0 !== self.performance.now ? self.performance.now() : Date.now();
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
    THREE.Raycaster = function(origin, direction, near, far) {
        this.ray = new THREE.Ray(origin, direction), this.near = near || 0, this.far = far || 1 / 0, 
        this.params = {
            Sprite: {},
            Mesh: {},
            PointCloud: {
                threshold: 1
            },
            LOD: {},
            Line: {}
        };
    };
    var descSort = function(a, b) {
        return a.distance - b.distance;
    }, intersectObject = function(object, raycaster, intersects, recursive) {
        if (object.raycast(raycaster, intersects), recursive === !0) for (var children = object.children, i = 0, l = children.length; l > i; i++) intersectObject(children[i], raycaster, intersects, !0);
    };
    THREE.Raycaster.prototype = {
        constructor: THREE.Raycaster,
        precision: 1e-4,
        linePrecision: 1,
        set: function(origin, direction) {
            this.ray.set(origin, direction);
        },
        setFromCamera: function(coords, camera) {
            camera instanceof THREE.PerspectiveCamera ? (this.ray.origin.copy(camera.position), 
            this.ray.direction.set(coords.x, coords.y, .5).unproject(camera).sub(camera.position).normalize()) : camera instanceof THREE.OrthographicCamera ? (this.ray.origin.set(coords.x, coords.y, -1).unproject(camera), 
            this.ray.direction.set(0, 0, -1).transformDirection(camera.matrixWorld)) : THREE.error("THREE.Raycaster: Unsupported camera type.");
        },
        intersectObject: function(object, recursive) {
            var intersects = [];
            return intersectObject(object, this, intersects, recursive), intersects.sort(descSort), 
            intersects;
        },
        intersectObjects: function(objects, recursive) {
            var intersects = [];
            if (objects instanceof Array == !1) return THREE.warn("THREE.Raycaster.intersectObjects: objects is not an Array."), 
            intersects;
            for (var i = 0, l = objects.length; l > i; i++) intersectObject(objects[i], this, intersects, recursive);
            return intersects.sort(descSort), intersects;
        }
    };
}(THREE), THREE.Object3D = function() {
    Object.defineProperty(this, "id", {
        value: THREE.Object3DIdCount++
    }), this.uuid = THREE.Math.generateUUID(), this.name = "", this.type = "Object3D", 
    this.parent = void 0, this.children = [], this.up = THREE.Object3D.DefaultUp.clone();
    var position = new THREE.Vector3(), rotation = new THREE.Euler(), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3(1, 1, 1), onRotationChange = function() {
        quaternion.setFromEuler(rotation, !1);
    }, onQuaternionChange = function() {
        rotation.setFromQuaternion(quaternion, void 0, !1);
    };
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
        }
    }), this.rotationAutoUpdate = !0, this.matrix = new THREE.Matrix4(), this.matrixWorld = new THREE.Matrix4(), 
    this.matrixAutoUpdate = !0, this.matrixWorldNeedsUpdate = !1, this.visible = !0, 
    this.castShadow = !1, this.receiveShadow = !1, this.frustumCulled = !0, this.renderOrder = 0, 
    this.userData = {};
}, THREE.Object3D.DefaultUp = new THREE.Vector3(0, 1, 0), THREE.Object3D.prototype = {
    constructor: THREE.Object3D,
    get eulerOrder() {
        return THREE.warn("THREE.Object3D: .eulerOrder has been moved to .rotation.order."), 
        this.rotation.order;
    },
    set eulerOrder(value) {
        THREE.warn("THREE.Object3D: .eulerOrder has been moved to .rotation.order."), this.rotation.order = value;
    },
    get useQuaternion() {
        THREE.warn("THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.");
    },
    set useQuaternion(value) {
        THREE.warn("THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.");
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
        return THREE.warn("THREE.Object3D: .translate() has been removed. Use .translateOnAxis( axis, distance ) instead."), 
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
        return object === this ? (THREE.error("THREE.Object3D.add: object can't be added as a child of itself.", object), 
        this) : (object instanceof THREE.Object3D ? (void 0 !== object.parent && object.parent.remove(object), 
        object.parent = this, object.dispatchEvent({
            type: "added"
        }), this.children.push(object)) : THREE.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", object), 
        this);
    },
    remove: function(object) {
        if (arguments.length > 1) for (var i = 0; i < arguments.length; i++) this.remove(arguments[i]);
        var index = this.children.indexOf(object);
        -1 !== index && (object.parent = void 0, object.dispatchEvent({
            type: "removed"
        }), this.children.splice(index, 1));
    },
    getChildByName: function(name) {
        return THREE.warn("THREE.Object3D: .getChildByName() has been renamed to .getObjectByName()."), 
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
        for (var i = 0, l = this.children.length; l > i; i++) this.children[i].traverse(callback);
    },
    traverseVisible: function(callback) {
        if (this.visible !== !1) {
            callback(this);
            for (var i = 0, l = this.children.length; l > i; i++) this.children[i].traverseVisible(callback);
        }
    },
    traverseAncestors: function(callback) {
        this.parent && (callback(this.parent), this.parent.traverseAncestors(callback));
    },
    updateMatrix: function() {
        this.matrix.compose(this.position, this.quaternion, this.scale), this.matrixWorldNeedsUpdate = !0;
    },
    updateMatrixWorld: function(force) {
        this.matrixAutoUpdate === !0 && this.updateMatrix(), (this.matrixWorldNeedsUpdate === !0 || force === !0) && (void 0 === this.parent ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix), 
        this.matrixWorldNeedsUpdate = !1, force = !0);
        for (var i = 0, l = this.children.length; l > i; i++) this.children[i].updateMatrixWorld(force);
    },
    toJSON: function() {
        var output = {
            metadata: {
                version: 4.3,
                type: "Object",
                generator: "ObjectExporter"
            }
        }, geometries = {}, parseGeometry = function(geometry) {
            if (void 0 === output.geometries && (output.geometries = []), void 0 === geometries[geometry.uuid]) {
                var json = geometry.toJSON();
                delete json.metadata, geometries[geometry.uuid] = json, output.geometries.push(json);
            }
            return geometry.uuid;
        }, materials = {}, parseMaterial = function(material) {
            if (void 0 === output.materials && (output.materials = []), void 0 === materials[material.uuid]) {
                var json = material.toJSON();
                delete json.metadata, materials[material.uuid] = json, output.materials.push(json);
            }
            return material.uuid;
        }, parseObject = function(object) {
            var data = {};
            if (data.uuid = object.uuid, data.type = object.type, "" !== object.name && (data.name = object.name), 
            "{}" !== JSON.stringify(object.userData) && (data.userData = object.userData), object.visible !== !0 && (data.visible = object.visible), 
            object instanceof THREE.PerspectiveCamera ? (data.fov = object.fov, data.aspect = object.aspect, 
            data.near = object.near, data.far = object.far) : object instanceof THREE.OrthographicCamera ? (data.left = object.left, 
            data.right = object.right, data.top = object.top, data.bottom = object.bottom, data.near = object.near, 
            data.far = object.far) : object instanceof THREE.AmbientLight ? data.color = object.color.getHex() : object instanceof THREE.DirectionalLight ? (data.color = object.color.getHex(), 
            data.intensity = object.intensity) : object instanceof THREE.PointLight ? (data.color = object.color.getHex(), 
            data.intensity = object.intensity, data.distance = object.distance, data.decay = object.decay) : object instanceof THREE.SpotLight ? (data.color = object.color.getHex(), 
            data.intensity = object.intensity, data.distance = object.distance, data.angle = object.angle, 
            data.exponent = object.exponent, data.decay = object.decay) : object instanceof THREE.HemisphereLight ? (data.color = object.color.getHex(), 
            data.groundColor = object.groundColor.getHex()) : object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.PointCloud ? (data.geometry = parseGeometry(object.geometry), 
            data.material = parseMaterial(object.material), object instanceof THREE.Line && (data.mode = object.mode)) : object instanceof THREE.Sprite && (data.material = parseMaterial(object.material)), 
            data.matrix = object.matrix.toArray(), object.children.length > 0) {
                data.children = [];
                for (var i = 0; i < object.children.length; i++) data.children.push(parseObject(object.children[i]));
            }
            return data;
        };
        return output.object = parseObject(this), output;
    },
    clone: function(object, recursive) {
        if (void 0 === object && (object = new THREE.Object3D()), void 0 === recursive && (recursive = !0), 
        object.name = this.name, object.up.copy(this.up), object.position.copy(this.position), 
        object.quaternion.copy(this.quaternion), object.scale.copy(this.scale), object.rotationAutoUpdate = this.rotationAutoUpdate, 
        object.matrix.copy(this.matrix), object.matrixWorld.copy(this.matrixWorld), object.matrixAutoUpdate = this.matrixAutoUpdate, 
        object.matrixWorldNeedsUpdate = this.matrixWorldNeedsUpdate, object.visible = this.visible, 
        object.castShadow = this.castShadow, object.receiveShadow = this.receiveShadow, 
        object.frustumCulled = this.frustumCulled, object.userData = JSON.parse(JSON.stringify(this.userData)), 
        recursive === !0) for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            object.add(child.clone());
        }
        return object;
    }
}, THREE.EventDispatcher.prototype.apply(THREE.Object3D.prototype), THREE.Object3DIdCount = 0, 
THREE.Face3 = function(a, b, c, normal, color, materialIndex) {
    this.a = a, this.b = b, this.c = c, this.normal = normal instanceof THREE.Vector3 ? normal : new THREE.Vector3(), 
    this.vertexNormals = normal instanceof Array ? normal : [], this.color = color instanceof THREE.Color ? color : new THREE.Color(), 
    this.vertexColors = color instanceof Array ? color : [], this.vertexTangents = [], 
    this.materialIndex = void 0 !== materialIndex ? materialIndex : 0;
}, THREE.Face3.prototype = {
    constructor: THREE.Face3,
    clone: function() {
        var face = new THREE.Face3(this.a, this.b, this.c);
        face.normal.copy(this.normal), face.color.copy(this.color), face.materialIndex = this.materialIndex;
        for (var i = 0, il = this.vertexNormals.length; il > i; i++) face.vertexNormals[i] = this.vertexNormals[i].clone();
        for (var i = 0, il = this.vertexColors.length; il > i; i++) face.vertexColors[i] = this.vertexColors[i].clone();
        for (var i = 0, il = this.vertexTangents.length; il > i; i++) face.vertexTangents[i] = this.vertexTangents[i].clone();
        return face;
    }
}, THREE.Face4 = function(a, b, c, d, normal, color, materialIndex) {
    return THREE.warn("THREE.Face4 has been removed. A THREE.Face3 will be created instead."), 
    new THREE.Face3(a, b, c, normal, color, materialIndex);
}, THREE.BufferAttribute = function(array, itemSize) {
    this.array = array, this.itemSize = itemSize, this.needsUpdate = !1;
}, THREE.BufferAttribute.prototype = {
    constructor: THREE.BufferAttribute,
    get length() {
        return this.array.length;
    },
    copyAt: function(index1, attribute, index2) {
        index1 *= this.itemSize, index2 *= attribute.itemSize;
        for (var i = 0, l = this.itemSize; l > i; i++) this.array[index1 + i] = attribute.array[index2 + i];
        return this;
    },
    set: function(value, offset) {
        return void 0 === offset && (offset = 0), this.array.set(value, offset), this;
    },
    setX: function(index, x) {
        return this.array[index * this.itemSize] = x, this;
    },
    setY: function(index, y) {
        return this.array[index * this.itemSize + 1] = y, this;
    },
    setZ: function(index, z) {
        return this.array[index * this.itemSize + 2] = z, this;
    },
    setXY: function(index, x, y) {
        return index *= this.itemSize, this.array[index] = x, this.array[index + 1] = y, 
        this;
    },
    setXYZ: function(index, x, y, z) {
        return index *= this.itemSize, this.array[index] = x, this.array[index + 1] = y, 
        this.array[index + 2] = z, this;
    },
    setXYZW: function(index, x, y, z, w) {
        return index *= this.itemSize, this.array[index] = x, this.array[index + 1] = y, 
        this.array[index + 2] = z, this.array[index + 3] = w, this;
    },
    clone: function() {
        return new THREE.BufferAttribute(new this.array.constructor(this.array), this.itemSize);
    }
}, THREE.Int8Attribute = function(data, itemSize) {
    return THREE.warn("THREE.Int8Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), 
    new THREE.BufferAttribute(data, itemSize);
}, THREE.Uint8Attribute = function(data, itemSize) {
    return THREE.warn("THREE.Uint8Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), 
    new THREE.BufferAttribute(data, itemSize);
}, THREE.Uint8ClampedAttribute = function(data, itemSize) {
    return THREE.warn("THREE.Uint8ClampedAttribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), 
    new THREE.BufferAttribute(data, itemSize);
}, THREE.Int16Attribute = function(data, itemSize) {
    return THREE.warn("THREE.Int16Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), 
    new THREE.BufferAttribute(data, itemSize);
}, THREE.Uint16Attribute = function(data, itemSize) {
    return THREE.warn("THREE.Uint16Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), 
    new THREE.BufferAttribute(data, itemSize);
}, THREE.Int32Attribute = function(data, itemSize) {
    return THREE.warn("THREE.Int32Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), 
    new THREE.BufferAttribute(data, itemSize);
}, THREE.Uint32Attribute = function(data, itemSize) {
    return THREE.warn("THREE.Uint32Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), 
    new THREE.BufferAttribute(data, itemSize);
}, THREE.Float32Attribute = function(data, itemSize) {
    return THREE.warn("THREE.Float32Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), 
    new THREE.BufferAttribute(data, itemSize);
}, THREE.Float64Attribute = function(data, itemSize) {
    return THREE.warn("THREE.Float64Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), 
    new THREE.BufferAttribute(data, itemSize);
}, THREE.DynamicBufferAttribute = function(array, itemSize) {
    THREE.BufferAttribute.call(this, array, itemSize), this.updateRange = {
        offset: 0,
        count: -1
    };
}, THREE.DynamicBufferAttribute.prototype = Object.create(THREE.BufferAttribute.prototype), 
THREE.DynamicBufferAttribute.prototype.constructor = THREE.DynamicBufferAttribute, 
THREE.DynamicBufferAttribute.prototype.clone = function() {
    return new THREE.DynamicBufferAttribute(new this.array.constructor(this.array), this.itemSize);
}, THREE.BufferGeometry = function() {
    Object.defineProperty(this, "id", {
        value: THREE.GeometryIdCount++
    }), this.uuid = THREE.Math.generateUUID(), this.name = "", this.type = "BufferGeometry", 
    this.attributes = {}, this.attributesKeys = [], this.drawcalls = [], this.offsets = this.drawcalls, 
    this.boundingBox = null, this.boundingSphere = null;
}, THREE.BufferGeometry.prototype = {
    constructor: THREE.BufferGeometry,
    addAttribute: function(name, attribute) {
        return attribute instanceof THREE.BufferAttribute == !1 ? (THREE.warn("THREE.BufferGeometry: .addAttribute() now expects ( name, attribute )."), 
        void (this.attributes[name] = {
            array: arguments[1],
            itemSize: arguments[2]
        })) : (this.attributes[name] = attribute, void (this.attributesKeys = Object.keys(this.attributes)));
    },
    getAttribute: function(name) {
        return this.attributes[name];
    },
    addDrawCall: function(start, count, indexOffset) {
        this.drawcalls.push({
            start: start,
            count: count,
            index: void 0 !== indexOffset ? indexOffset : 0
        });
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
    center: function() {
        this.computeBoundingBox();
        var offset = this.boundingBox.center().negate();
        return this.applyMatrix(new THREE.Matrix4().setPosition(offset)), offset;
    },
    fromGeometry: function(geometry, settings) {
        settings = settings || {
            vertexColors: THREE.NoColors
        };
        var vertices = geometry.vertices, faces = geometry.faces, faceVertexUvs = geometry.faceVertexUvs, vertexColors = settings.vertexColors, hasFaceVertexUv = faceVertexUvs[0].length > 0, hasFaceVertexNormals = 3 == faces[0].vertexNormals.length, positions = new Float32Array(3 * faces.length * 3);
        this.addAttribute("position", new THREE.BufferAttribute(positions, 3));
        var normals = new Float32Array(3 * faces.length * 3);
        if (this.addAttribute("normal", new THREE.BufferAttribute(normals, 3)), vertexColors !== THREE.NoColors) {
            var colors = new Float32Array(3 * faces.length * 3);
            this.addAttribute("color", new THREE.BufferAttribute(colors, 3));
        }
        if (hasFaceVertexUv === !0) {
            var uvs = new Float32Array(3 * faces.length * 2);
            this.addAttribute("uv", new THREE.BufferAttribute(uvs, 2));
        }
        for (var i = 0, i2 = 0, i3 = 0; i < faces.length; i++, i2 += 6, i3 += 9) {
            var face = faces[i], a = vertices[face.a], b = vertices[face.b], c = vertices[face.c];
            if (positions[i3] = a.x, positions[i3 + 1] = a.y, positions[i3 + 2] = a.z, positions[i3 + 3] = b.x, 
            positions[i3 + 4] = b.y, positions[i3 + 5] = b.z, positions[i3 + 6] = c.x, positions[i3 + 7] = c.y, 
            positions[i3 + 8] = c.z, hasFaceVertexNormals === !0) {
                var na = face.vertexNormals[0], nb = face.vertexNormals[1], nc = face.vertexNormals[2];
                normals[i3] = na.x, normals[i3 + 1] = na.y, normals[i3 + 2] = na.z, normals[i3 + 3] = nb.x, 
                normals[i3 + 4] = nb.y, normals[i3 + 5] = nb.z, normals[i3 + 6] = nc.x, normals[i3 + 7] = nc.y, 
                normals[i3 + 8] = nc.z;
            } else {
                var n = face.normal;
                normals[i3] = n.x, normals[i3 + 1] = n.y, normals[i3 + 2] = n.z, normals[i3 + 3] = n.x, 
                normals[i3 + 4] = n.y, normals[i3 + 5] = n.z, normals[i3 + 6] = n.x, normals[i3 + 7] = n.y, 
                normals[i3 + 8] = n.z;
            }
            if (vertexColors === THREE.FaceColors) {
                var fc = face.color;
                colors[i3] = fc.r, colors[i3 + 1] = fc.g, colors[i3 + 2] = fc.b, colors[i3 + 3] = fc.r, 
                colors[i3 + 4] = fc.g, colors[i3 + 5] = fc.b, colors[i3 + 6] = fc.r, colors[i3 + 7] = fc.g, 
                colors[i3 + 8] = fc.b;
            } else if (vertexColors === THREE.VertexColors) {
                var vca = face.vertexColors[0], vcb = face.vertexColors[1], vcc = face.vertexColors[2];
                colors[i3] = vca.r, colors[i3 + 1] = vca.g, colors[i3 + 2] = vca.b, colors[i3 + 3] = vcb.r, 
                colors[i3 + 4] = vcb.g, colors[i3 + 5] = vcb.b, colors[i3 + 6] = vcc.r, colors[i3 + 7] = vcc.g, 
                colors[i3 + 8] = vcc.b;
            }
            if (hasFaceVertexUv === !0) {
                var uva = faceVertexUvs[0][i][0], uvb = faceVertexUvs[0][i][1], uvc = faceVertexUvs[0][i][2];
                uvs[i2] = uva.x, uvs[i2 + 1] = uva.y, uvs[i2 + 2] = uvb.x, uvs[i2 + 3] = uvb.y, 
                uvs[i2 + 4] = uvc.x, uvs[i2 + 5] = uvc.y;
            }
        }
        return this.computeBoundingSphere(), this;
    },
    computeBoundingBox: function() {
        var vector = new THREE.Vector3();
        return function() {
            null === this.boundingBox && (this.boundingBox = new THREE.Box3());
            var positions = this.attributes.position.array;
            if (positions) {
                var bb = this.boundingBox;
                bb.makeEmpty();
                for (var i = 0, il = positions.length; il > i; i += 3) vector.set(positions[i], positions[i + 1], positions[i + 2]), 
                bb.expandByPoint(vector);
            }
            (void 0 === positions || 0 === positions.length) && (this.boundingBox.min.set(0, 0, 0), 
            this.boundingBox.max.set(0, 0, 0)), (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && THREE.error('THREE.BufferGeometry.computeBoundingBox: Computed min/max have NaN values. The "position" attribute is likely to have NaN values.');
        };
    }(),
    computeBoundingSphere: function() {
        var box = new THREE.Box3(), vector = new THREE.Vector3();
        return function() {
            null === this.boundingSphere && (this.boundingSphere = new THREE.Sphere());
            var positions = this.attributes.position.array;
            if (positions) {
                box.makeEmpty();
                for (var center = this.boundingSphere.center, i = 0, il = positions.length; il > i; i += 3) vector.set(positions[i], positions[i + 1], positions[i + 2]), 
                box.expandByPoint(vector);
                box.center(center);
                for (var maxRadiusSq = 0, i = 0, il = positions.length; il > i; i += 3) vector.set(positions[i], positions[i + 1], positions[i + 2]), 
                maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(vector));
                this.boundingSphere.radius = Math.sqrt(maxRadiusSq), isNaN(this.boundingSphere.radius) && THREE.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.');
            }
        };
    }(),
    computeFaceNormals: function() {},
    computeVertexNormals: function() {
        var attributes = this.attributes;
        if (attributes.position) {
            var positions = attributes.position.array;
            if (void 0 === attributes.normal) this.addAttribute("normal", new THREE.BufferAttribute(new Float32Array(positions.length), 3)); else for (var normals = attributes.normal.array, i = 0, il = normals.length; il > i; i++) normals[i] = 0;
            var vA, vB, vC, normals = attributes.normal.array, pA = new THREE.Vector3(), pB = new THREE.Vector3(), pC = new THREE.Vector3(), cb = new THREE.Vector3(), ab = new THREE.Vector3();
            if (attributes.index) for (var indices = attributes.index.array, offsets = this.offsets.length > 0 ? this.offsets : [ {
                start: 0,
                count: indices.length,
                index: 0
            } ], j = 0, jl = offsets.length; jl > j; ++j) for (var start = offsets[j].start, count = offsets[j].count, index = offsets[j].index, i = start, il = start + count; il > i; i += 3) vA = 3 * (index + indices[i]), 
            vB = 3 * (index + indices[i + 1]), vC = 3 * (index + indices[i + 2]), pA.fromArray(positions, vA), 
            pB.fromArray(positions, vB), pC.fromArray(positions, vC), cb.subVectors(pC, pB), 
            ab.subVectors(pA, pB), cb.cross(ab), normals[vA] += cb.x, normals[vA + 1] += cb.y, 
            normals[vA + 2] += cb.z, normals[vB] += cb.x, normals[vB + 1] += cb.y, normals[vB + 2] += cb.z, 
            normals[vC] += cb.x, normals[vC + 1] += cb.y, normals[vC + 2] += cb.z; else for (var i = 0, il = positions.length; il > i; i += 9) pA.fromArray(positions, i), 
            pB.fromArray(positions, i + 3), pC.fromArray(positions, i + 6), cb.subVectors(pC, pB), 
            ab.subVectors(pA, pB), cb.cross(ab), normals[i] = cb.x, normals[i + 1] = cb.y, normals[i + 2] = cb.z, 
            normals[i + 3] = cb.x, normals[i + 4] = cb.y, normals[i + 5] = cb.z, normals[i + 6] = cb.x, 
            normals[i + 7] = cb.y, normals[i + 8] = cb.z;
            this.normalizeNormals(), attributes.normal.needsUpdate = !0;
        }
    },
    computeTangents: function() {
        function handleTriangle(a, b, c) {
            vA.fromArray(positions, 3 * a), vB.fromArray(positions, 3 * b), vC.fromArray(positions, 3 * c), 
            uvA.fromArray(uvs, 2 * a), uvB.fromArray(uvs, 2 * b), uvC.fromArray(uvs, 2 * c), 
            x1 = vB.x - vA.x, x2 = vC.x - vA.x, y1 = vB.y - vA.y, y2 = vC.y - vA.y, z1 = vB.z - vA.z, 
            z2 = vC.z - vA.z, s1 = uvB.x - uvA.x, s2 = uvC.x - uvA.x, t1 = uvB.y - uvA.y, t2 = uvC.y - uvA.y, 
            r = 1 / (s1 * t2 - s2 * t1), sdir.set((t2 * x1 - t1 * x2) * r, (t2 * y1 - t1 * y2) * r, (t2 * z1 - t1 * z2) * r), 
            tdir.set((s1 * x2 - s2 * x1) * r, (s1 * y2 - s2 * y1) * r, (s1 * z2 - s2 * z1) * r), 
            tan1[a].add(sdir), tan1[b].add(sdir), tan1[c].add(sdir), tan2[a].add(tdir), tan2[b].add(tdir), 
            tan2[c].add(tdir);
        }
        function handleVertex(v) {
            n.fromArray(normals, 3 * v), n2.copy(n), t = tan1[v], tmp.copy(t), tmp.sub(n.multiplyScalar(n.dot(t))).normalize(), 
            tmp2.crossVectors(n2, t), test = tmp2.dot(tan2[v]), w = 0 > test ? -1 : 1, tangents[4 * v] = tmp.x, 
            tangents[4 * v + 1] = tmp.y, tangents[4 * v + 2] = tmp.z, tangents[4 * v + 3] = w;
        }
        if (void 0 === this.attributes.index || void 0 === this.attributes.position || void 0 === this.attributes.normal || void 0 === this.attributes.uv) return void THREE.warn("THREE.BufferGeometry: Missing required attributes (index, position, normal or uv) in BufferGeometry.computeTangents()");
        var indices = this.attributes.index.array, positions = this.attributes.position.array, normals = this.attributes.normal.array, uvs = this.attributes.uv.array, nVertices = positions.length / 3;
        void 0 === this.attributes.tangent && this.addAttribute("tangent", new THREE.BufferAttribute(new Float32Array(4 * nVertices), 4));
        for (var tangents = this.attributes.tangent.array, tan1 = [], tan2 = [], k = 0; nVertices > k; k++) tan1[k] = new THREE.Vector3(), 
        tan2[k] = new THREE.Vector3();
        var x1, x2, y1, y2, z1, z2, s1, s2, t1, t2, r, i, il, j, jl, iA, iB, iC, vA = new THREE.Vector3(), vB = new THREE.Vector3(), vC = new THREE.Vector3(), uvA = new THREE.Vector2(), uvB = new THREE.Vector2(), uvC = new THREE.Vector2(), sdir = new THREE.Vector3(), tdir = new THREE.Vector3();
        0 === this.drawcalls.length && this.addDrawCall(0, indices.length, 0);
        var drawcalls = this.drawcalls;
        for (j = 0, jl = drawcalls.length; jl > j; ++j) {
            var start = drawcalls[j].start, count = drawcalls[j].count, index = drawcalls[j].index;
            for (i = start, il = start + count; il > i; i += 3) iA = index + indices[i], iB = index + indices[i + 1], 
            iC = index + indices[i + 2], handleTriangle(iA, iB, iC);
        }
        var w, t, test, tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3(), n = new THREE.Vector3(), n2 = new THREE.Vector3();
        for (j = 0, jl = drawcalls.length; jl > j; ++j) {
            var start = drawcalls[j].start, count = drawcalls[j].count, index = drawcalls[j].index;
            for (i = start, il = start + count; il > i; i += 3) iA = index + indices[i], iB = index + indices[i + 1], 
            iC = index + indices[i + 2], handleVertex(iA), handleVertex(iB), handleVertex(iC);
        }
    },
    computeOffsets: function(size) {
        void 0 === size && (size = 65535);
        for (var indices = this.attributes.index.array, vertices = this.attributes.position.array, facesCount = indices.length / 3, sortedIndices = new Uint16Array(indices.length), indexPtr = 0, vertexPtr = 0, offsets = [ {
            start: 0,
            count: 0,
            index: 0
        } ], offset = offsets[0], duplicatedVertices = 0, newVerticeMaps = 0, faceVertices = new Int32Array(6), vertexMap = new Int32Array(vertices.length), revVertexMap = new Int32Array(vertices.length), j = 0; j < vertices.length; j++) vertexMap[j] = -1, 
        revVertexMap[j] = -1;
        for (var findex = 0; facesCount > findex; findex++) {
            newVerticeMaps = 0;
            for (var vo = 0; 3 > vo; vo++) {
                var vid = indices[3 * findex + vo];
                -1 == vertexMap[vid] ? (faceVertices[2 * vo] = vid, faceVertices[2 * vo + 1] = -1, 
                newVerticeMaps++) : vertexMap[vid] < offset.index ? (faceVertices[2 * vo] = vid, 
                faceVertices[2 * vo + 1] = -1, duplicatedVertices++) : (faceVertices[2 * vo] = vid, 
                faceVertices[2 * vo + 1] = vertexMap[vid]);
            }
            var faceMax = vertexPtr + newVerticeMaps;
            if (faceMax > offset.index + size) {
                var new_offset = {
                    start: indexPtr,
                    count: 0,
                    index: vertexPtr
                };
                offsets.push(new_offset), offset = new_offset;
                for (var v = 0; 6 > v; v += 2) {
                    var new_vid = faceVertices[v + 1];
                    new_vid > -1 && new_vid < offset.index && (faceVertices[v + 1] = -1);
                }
            }
            for (var v = 0; 6 > v; v += 2) {
                var vid = faceVertices[v], new_vid = faceVertices[v + 1];
                -1 === new_vid && (new_vid = vertexPtr++), vertexMap[vid] = new_vid, revVertexMap[new_vid] = vid, 
                sortedIndices[indexPtr++] = new_vid - offset.index, offset.count++;
            }
        }
        return this.reorderBuffers(sortedIndices, revVertexMap, vertexPtr), this.offsets = offsets, 
        this.drawcalls = offsets, offsets;
    },
    merge: function(geometry, offset) {
        if (geometry instanceof THREE.BufferGeometry == !1) return void THREE.error("THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.", geometry);
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
    reorderBuffers: function(indexBuffer, indexMap, vertexCount) {
        var sortedAttributes = {};
        for (var attr in this.attributes) if ("index" != attr) {
            var sourceArray = this.attributes[attr].array;
            sortedAttributes[attr] = new sourceArray.constructor(this.attributes[attr].itemSize * vertexCount);
        }
        for (var new_vid = 0; vertexCount > new_vid; new_vid++) {
            var vid = indexMap[new_vid];
            for (var attr in this.attributes) if ("index" != attr) for (var attrArray = this.attributes[attr].array, attrSize = this.attributes[attr].itemSize, sortedAttr = sortedAttributes[attr], k = 0; attrSize > k; k++) sortedAttr[new_vid * attrSize + k] = attrArray[vid * attrSize + k];
        }
        this.attributes.index.array = indexBuffer;
        for (var attr in this.attributes) "index" != attr && (this.attributes[attr].array = sortedAttributes[attr], 
        this.attributes[attr].numItems = this.attributes[attr].itemSize * vertexCount);
    },
    toJSON: function() {
        var output = {
            metadata: {
                version: 4,
                type: "BufferGeometry",
                generator: "BufferGeometryExporter"
            },
            uuid: this.uuid,
            type: this.type,
            data: {
                attributes: {}
            }
        }, attributes = this.attributes, offsets = this.offsets, boundingSphere = this.boundingSphere;
        for (var key in attributes) {
            var attribute = attributes[key], array = Array.prototype.slice.call(attribute.array);
            output.data.attributes[key] = {
                itemSize: attribute.itemSize,
                type: attribute.array.constructor.name,
                array: array
            };
        }
        return offsets.length > 0 && (output.data.offsets = JSON.parse(JSON.stringify(offsets))), 
        null !== boundingSphere && (output.data.boundingSphere = {
            center: boundingSphere.center.toArray(),
            radius: boundingSphere.radius
        }), output;
    },
    clone: function() {
        var geometry = new THREE.BufferGeometry();
        for (var attr in this.attributes) {
            var sourceAttr = this.attributes[attr];
            geometry.addAttribute(attr, sourceAttr.clone());
        }
        for (var i = 0, il = this.offsets.length; il > i; i++) {
            var offset = this.offsets[i];
            geometry.offsets.push({
                start: offset.start,
                index: offset.index,
                count: offset.count
            });
        }
        return geometry;
    },
    dispose: function() {
        this.dispatchEvent({
            type: "dispose"
        });
    }
}, THREE.EventDispatcher.prototype.apply(THREE.BufferGeometry.prototype), THREE.Geometry = function() {
    Object.defineProperty(this, "id", {
        value: THREE.GeometryIdCount++
    }), this.uuid = THREE.Math.generateUUID(), this.name = "", this.type = "Geometry", 
    this.vertices = [], this.colors = [], this.faces = [], this.faceVertexUvs = [ [] ], 
    this.morphTargets = [], this.morphColors = [], this.morphNormals = [], this.skinWeights = [], 
    this.skinIndices = [], this.lineDistances = [], this.boundingBox = null, this.boundingSphere = null, 
    this.hasTangents = !1, this.dynamic = !0, this.verticesNeedUpdate = !1, this.elementsNeedUpdate = !1, 
    this.uvsNeedUpdate = !1, this.normalsNeedUpdate = !1, this.tangentsNeedUpdate = !1, 
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
    fromBufferGeometry: function(geometry) {
        for (var scope = this, attributes = geometry.attributes, vertices = attributes.position.array, indices = void 0 !== attributes.index ? attributes.index.array : void 0, normals = void 0 !== attributes.normal ? attributes.normal.array : void 0, colors = void 0 !== attributes.color ? attributes.color.array : void 0, uvs = void 0 !== attributes.uv ? attributes.uv.array : void 0, tempNormals = [], tempUVs = [], i = 0, j = 0; i < vertices.length; i += 3, 
        j += 2) scope.vertices.push(new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2])), 
        void 0 !== normals && tempNormals.push(new THREE.Vector3(normals[i], normals[i + 1], normals[i + 2])), 
        void 0 !== colors && scope.colors.push(new THREE.Color(colors[i], colors[i + 1], colors[i + 2])), 
        void 0 !== uvs && tempUVs.push(new THREE.Vector2(uvs[j], uvs[j + 1]));
        var addFace = function(a, b, c) {
            var vertexNormals = void 0 !== normals ? [ tempNormals[a].clone(), tempNormals[b].clone(), tempNormals[c].clone() ] : [], vertexColors = void 0 !== colors ? [ scope.colors[a].clone(), scope.colors[b].clone(), scope.colors[c].clone() ] : [];
            scope.faces.push(new THREE.Face3(a, b, c, vertexNormals, vertexColors)), void 0 !== uvs && scope.faceVertexUvs[0].push([ tempUVs[a].clone(), tempUVs[b].clone(), tempUVs[c].clone() ]);
        };
        if (void 0 !== indices) {
            var drawcalls = geometry.drawcalls;
            if (drawcalls.length > 0) for (var i = 0; i < drawcalls.length; i++) for (var drawcall = drawcalls[i], start = drawcall.start, count = drawcall.count, index = drawcall.index, j = start, jl = start + count; jl > j; j += 3) addFace(index + indices[j], index + indices[j + 1], index + indices[j + 2]); else for (var i = 0; i < indices.length; i += 3) addFace(indices[i], indices[i + 1], indices[i + 2]);
        } else for (var i = 0; i < vertices.length / 3; i += 3) addFace(i, i + 1, i + 2);
        return this.computeFaceNormals(), null !== geometry.boundingBox && (this.boundingBox = geometry.boundingBox.clone()), 
        null !== geometry.boundingSphere && (this.boundingSphere = geometry.boundingSphere.clone()), 
        this;
    },
    center: function() {
        this.computeBoundingBox();
        var offset = this.boundingBox.center().negate();
        return this.applyMatrix(new THREE.Matrix4().setPosition(offset)), offset;
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
        for (f = 0, fl = this.faces.length; fl > f; f++) face = this.faces[f], face.vertexNormals[0] = vertices[face.a].clone(), 
        face.vertexNormals[1] = vertices[face.b].clone(), face.vertexNormals[2] = vertices[face.c].clone();
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
        function handleTriangle(context, a, b, c, ua, ub, uc) {
            vA = context.vertices[a], vB = context.vertices[b], vC = context.vertices[c], uvA = uv[ua], 
            uvB = uv[ub], uvC = uv[uc], x1 = vB.x - vA.x, x2 = vC.x - vA.x, y1 = vB.y - vA.y, 
            y2 = vC.y - vA.y, z1 = vB.z - vA.z, z2 = vC.z - vA.z, s1 = uvB.x - uvA.x, s2 = uvC.x - uvA.x, 
            t1 = uvB.y - uvA.y, t2 = uvC.y - uvA.y, r = 1 / (s1 * t2 - s2 * t1), sdir.set((t2 * x1 - t1 * x2) * r, (t2 * y1 - t1 * y2) * r, (t2 * z1 - t1 * z2) * r), 
            tdir.set((s1 * x2 - s2 * x1) * r, (s1 * y2 - s2 * y1) * r, (s1 * z2 - s2 * z1) * r), 
            tan1[a].add(sdir), tan1[b].add(sdir), tan1[c].add(sdir), tan2[a].add(tdir), tan2[b].add(tdir), 
            tan2[c].add(tdir);
        }
        var f, fl, v, vl, i, vertexIndex, face, uv, vA, vB, vC, uvA, uvB, uvC, x1, x2, y1, y2, z1, z2, s1, s2, t1, t2, r, t, test, w, tan1 = [], tan2 = [], sdir = new THREE.Vector3(), tdir = new THREE.Vector3(), tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3(), n = new THREE.Vector3();
        for (v = 0, vl = this.vertices.length; vl > v; v++) tan1[v] = new THREE.Vector3(), 
        tan2[v] = new THREE.Vector3();
        for (f = 0, fl = this.faces.length; fl > f; f++) face = this.faces[f], uv = this.faceVertexUvs[0][f], 
        handleTriangle(this, face.a, face.b, face.c, 0, 1, 2);
        var faceIndex = [ "a", "b", "c", "d" ];
        for (f = 0, fl = this.faces.length; fl > f; f++) for (face = this.faces[f], i = 0; i < Math.min(face.vertexNormals.length, 3); i++) n.copy(face.vertexNormals[i]), 
        vertexIndex = face[faceIndex[i]], t = tan1[vertexIndex], tmp.copy(t), tmp.sub(n.multiplyScalar(n.dot(t))).normalize(), 
        tmp2.crossVectors(face.vertexNormals[i], t), test = tmp2.dot(tan2[vertexIndex]), 
        w = 0 > test ? -1 : 1, face.vertexTangents[i] = new THREE.Vector4(tmp.x, tmp.y, tmp.z, w);
        this.hasTangents = !0;
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
        if (geometry instanceof THREE.Geometry == !1) return void THREE.error("THREE.Geometry.merge(): geometry not an instance of THREE.Geometry.", geometry);
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
        return mesh instanceof THREE.Mesh == !1 ? void THREE.error("THREE.Geometry.mergeMesh(): mesh not an instance of THREE.Mesh.", mesh) : (mesh.matrixAutoUpdate && mesh.updateMatrix(), 
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
            for (var dupIndex = -1, n = 0; 3 > n; n++) if (indices[n] == indices[(n + 1) % 3]) {
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
        var output = {
            metadata: {
                version: 4,
                type: "BufferGeometry",
                generator: "BufferGeometryExporter"
            },
            uuid: this.uuid,
            type: this.type
        };
        if ("" !== this.name && (output.name = this.name), void 0 !== this.parameters) {
            var parameters = this.parameters;
            for (var key in parameters) void 0 !== parameters[key] && (output[key] = parameters[key]);
            return output;
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
        return output.data = {}, output.data.vertices = vertices, output.data.normals = normals, 
        colors.length > 0 && (output.data.colors = colors), uvs.length > 0 && (output.data.uvs = [ uvs ]), 
        output.data.faces = faces, output;
    },
    clone: function() {
        for (var geometry = new THREE.Geometry(), vertices = this.vertices, i = 0, il = vertices.length; il > i; i++) geometry.vertices.push(vertices[i].clone());
        for (var faces = this.faces, i = 0, il = faces.length; il > i; i++) geometry.faces.push(faces[i].clone());
        for (var i = 0, il = this.faceVertexUvs.length; il > i; i++) {
            var faceVertexUvs = this.faceVertexUvs[i];
            void 0 === geometry.faceVertexUvs[i] && (geometry.faceVertexUvs[i] = []);
            for (var j = 0, jl = faceVertexUvs.length; jl > j; j++) {
                for (var uvs = faceVertexUvs[j], uvsCopy = [], k = 0, kl = uvs.length; kl > k; k++) {
                    var uv = uvs[k];
                    uvsCopy.push(uv.clone());
                }
                geometry.faceVertexUvs[i].push(uvsCopy);
            }
        }
        return geometry;
    },
    dispose: function() {
        this.dispatchEvent({
            type: "dispose"
        });
    }
}, THREE.EventDispatcher.prototype.apply(THREE.Geometry.prototype), THREE.GeometryIdCount = 0, 
THREE.Camera = function() {
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
}(), THREE.Camera.prototype.clone = function(camera) {
    return void 0 === camera && (camera = new THREE.Camera()), THREE.Object3D.prototype.clone.call(this, camera), 
    camera.matrixWorldInverse.copy(this.matrixWorldInverse), camera.projectionMatrix.copy(this.projectionMatrix), 
    camera;
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
        var renderTarget = this.renderTarget, generateMipmaps = renderTarget.generateMipmaps;
        renderTarget.generateMipmaps = !1, renderTarget.activeCubeFace = 0, renderer.render(scene, cameraPX, renderTarget), 
        renderTarget.activeCubeFace = 1, renderer.render(scene, cameraNX, renderTarget), 
        renderTarget.activeCubeFace = 2, renderer.render(scene, cameraPY, renderTarget), 
        renderTarget.activeCubeFace = 3, renderer.render(scene, cameraNY, renderTarget), 
        renderTarget.activeCubeFace = 4, renderer.render(scene, cameraPZ, renderTarget), 
        renderTarget.generateMipmaps = generateMipmaps, renderTarget.activeCubeFace = 5, 
        renderer.render(scene, cameraNZ, renderTarget);
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
}, THREE.OrthographicCamera.prototype.clone = function() {
    var camera = new THREE.OrthographicCamera();
    return THREE.Camera.prototype.clone.call(this, camera), camera.zoom = this.zoom, 
    camera.left = this.left, camera.right = this.right, camera.top = this.top, camera.bottom = this.bottom, 
    camera.near = this.near, camera.far = this.far, camera.projectionMatrix.copy(this.projectionMatrix), 
    camera;
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
}, THREE.PerspectiveCamera.prototype.clone = function() {
    var camera = new THREE.PerspectiveCamera();
    return THREE.Camera.prototype.clone.call(this, camera), camera.zoom = this.zoom, 
    camera.fov = this.fov, camera.aspect = this.aspect, camera.near = this.near, camera.far = this.far, 
    camera.projectionMatrix.copy(this.projectionMatrix), camera;
}, THREE.Light = function(color) {
    THREE.Object3D.call(this), this.type = "Light", this.color = new THREE.Color(color);
}, THREE.Light.prototype = Object.create(THREE.Object3D.prototype), THREE.Light.prototype.constructor = THREE.Light, 
THREE.Light.prototype.clone = function(light) {
    return void 0 === light && (light = new THREE.Light()), THREE.Object3D.prototype.clone.call(this, light), 
    light.color.copy(this.color), light;
}, THREE.AmbientLight = function(color) {
    THREE.Light.call(this, color), this.type = "AmbientLight";
}, THREE.AmbientLight.prototype = Object.create(THREE.Light.prototype), THREE.AmbientLight.prototype.constructor = THREE.AmbientLight, 
THREE.AmbientLight.prototype.clone = function() {
    var light = new THREE.AmbientLight();
    return THREE.Light.prototype.clone.call(this, light), light;
}, THREE.AreaLight = function(color, intensity) {
    THREE.Light.call(this, color), this.type = "AreaLight", this.normal = new THREE.Vector3(0, -1, 0), 
    this.right = new THREE.Vector3(1, 0, 0), this.intensity = void 0 !== intensity ? intensity : 1, 
    this.width = 1, this.height = 1, this.constantAttenuation = 1.5, this.linearAttenuation = .5, 
    this.quadraticAttenuation = .1;
}, THREE.AreaLight.prototype = Object.create(THREE.Light.prototype), THREE.AreaLight.prototype.constructor = THREE.AreaLight, 
THREE.DirectionalLight = function(color, intensity) {
    THREE.Light.call(this, color), this.type = "DirectionalLight", this.position.set(0, 1, 0), 
    this.target = new THREE.Object3D(), this.intensity = void 0 !== intensity ? intensity : 1, 
    this.castShadow = !1, this.onlyShadow = !1, this.shadowCameraNear = 50, this.shadowCameraFar = 5e3, 
    this.shadowCameraLeft = -500, this.shadowCameraRight = 500, this.shadowCameraTop = 500, 
    this.shadowCameraBottom = -500, this.shadowCameraVisible = !1, this.shadowBias = 0, 
    this.shadowDarkness = .5, this.shadowMapWidth = 512, this.shadowMapHeight = 512, 
    this.shadowCascade = !1, this.shadowCascadeOffset = new THREE.Vector3(0, 0, -1e3), 
    this.shadowCascadeCount = 2, this.shadowCascadeBias = [ 0, 0, 0 ], this.shadowCascadeWidth = [ 512, 512, 512 ], 
    this.shadowCascadeHeight = [ 512, 512, 512 ], this.shadowCascadeNearZ = [ -1, .99, .998 ], 
    this.shadowCascadeFarZ = [ .99, .998, 1 ], this.shadowCascadeArray = [], this.shadowMap = null, 
    this.shadowMapSize = null, this.shadowCamera = null, this.shadowMatrix = null;
}, THREE.DirectionalLight.prototype = Object.create(THREE.Light.prototype), THREE.DirectionalLight.prototype.constructor = THREE.DirectionalLight, 
THREE.DirectionalLight.prototype.clone = function() {
    var light = new THREE.DirectionalLight();
    return THREE.Light.prototype.clone.call(this, light), light.target = this.target.clone(), 
    light.intensity = this.intensity, light.castShadow = this.castShadow, light.onlyShadow = this.onlyShadow, 
    light.shadowCameraNear = this.shadowCameraNear, light.shadowCameraFar = this.shadowCameraFar, 
    light.shadowCameraLeft = this.shadowCameraLeft, light.shadowCameraRight = this.shadowCameraRight, 
    light.shadowCameraTop = this.shadowCameraTop, light.shadowCameraBottom = this.shadowCameraBottom, 
    light.shadowCameraVisible = this.shadowCameraVisible, light.shadowBias = this.shadowBias, 
    light.shadowDarkness = this.shadowDarkness, light.shadowMapWidth = this.shadowMapWidth, 
    light.shadowMapHeight = this.shadowMapHeight, light.shadowCascade = this.shadowCascade, 
    light.shadowCascadeOffset.copy(this.shadowCascadeOffset), light.shadowCascadeCount = this.shadowCascadeCount, 
    light.shadowCascadeBias = this.shadowCascadeBias.slice(0), light.shadowCascadeWidth = this.shadowCascadeWidth.slice(0), 
    light.shadowCascadeHeight = this.shadowCascadeHeight.slice(0), light.shadowCascadeNearZ = this.shadowCascadeNearZ.slice(0), 
    light.shadowCascadeFarZ = this.shadowCascadeFarZ.slice(0), light;
}, THREE.HemisphereLight = function(skyColor, groundColor, intensity) {
    THREE.Light.call(this, skyColor), this.type = "HemisphereLight", this.position.set(0, 100, 0), 
    this.groundColor = new THREE.Color(groundColor), this.intensity = void 0 !== intensity ? intensity : 1;
}, THREE.HemisphereLight.prototype = Object.create(THREE.Light.prototype), THREE.HemisphereLight.prototype.constructor = THREE.HemisphereLight, 
THREE.HemisphereLight.prototype.clone = function() {
    var light = new THREE.HemisphereLight();
    return THREE.Light.prototype.clone.call(this, light), light.groundColor.copy(this.groundColor), 
    light.intensity = this.intensity, light;
}, THREE.PointLight = function(color, intensity, distance, decay) {
    THREE.Light.call(this, color), this.type = "PointLight", this.intensity = void 0 !== intensity ? intensity : 1, 
    this.distance = void 0 !== distance ? distance : 0, this.decay = void 0 !== decay ? decay : 1;
}, THREE.PointLight.prototype = Object.create(THREE.Light.prototype), THREE.PointLight.prototype.constructor = THREE.PointLight, 
THREE.PointLight.prototype.clone = function() {
    var light = new THREE.PointLight();
    return THREE.Light.prototype.clone.call(this, light), light.intensity = this.intensity, 
    light.distance = this.distance, light.decay = this.decay, light;
}, THREE.SpotLight = function(color, intensity, distance, angle, exponent, decay) {
    THREE.Light.call(this, color), this.type = "SpotLight", this.position.set(0, 1, 0), 
    this.target = new THREE.Object3D(), this.intensity = void 0 !== intensity ? intensity : 1, 
    this.distance = void 0 !== distance ? distance : 0, this.angle = void 0 !== angle ? angle : Math.PI / 3, 
    this.exponent = void 0 !== exponent ? exponent : 10, this.decay = void 0 !== decay ? decay : 1, 
    this.castShadow = !1, this.onlyShadow = !1, this.shadowCameraNear = 50, this.shadowCameraFar = 5e3, 
    this.shadowCameraFov = 50, this.shadowCameraVisible = !1, this.shadowBias = 0, this.shadowDarkness = .5, 
    this.shadowMapWidth = 512, this.shadowMapHeight = 512, this.shadowMap = null, this.shadowMapSize = null, 
    this.shadowCamera = null, this.shadowMatrix = null;
}, THREE.SpotLight.prototype = Object.create(THREE.Light.prototype), THREE.SpotLight.prototype.constructor = THREE.SpotLight, 
THREE.SpotLight.prototype.clone = function() {
    var light = new THREE.SpotLight();
    return THREE.Light.prototype.clone.call(this, light), light.target = this.target.clone(), 
    light.intensity = this.intensity, light.distance = this.distance, light.angle = this.angle, 
    light.exponent = this.exponent, light.decay = this.decay, light.castShadow = this.castShadow, 
    light.onlyShadow = this.onlyShadow, light.shadowCameraNear = this.shadowCameraNear, 
    light.shadowCameraFar = this.shadowCameraFar, light.shadowCameraFov = this.shadowCameraFov, 
    light.shadowCameraVisible = this.shadowCameraVisible, light.shadowBias = this.shadowBias, 
    light.shadowDarkness = this.shadowDarkness, light.shadowMapWidth = this.shadowMapWidth, 
    light.shadowMapHeight = this.shadowMapHeight, light;
}, THREE.Cache = {
    files: {},
    add: function(key, file) {
        this.files[key] = file;
    },
    get: function(key) {
        return this.files[key];
    },
    remove: function(key) {
        delete this.files[key];
    },
    clear: function() {
        this.files = {};
    }
}, THREE.Loader = function(showStatus) {
    this.showStatus = showStatus, this.statusDomElement = showStatus ? THREE.Loader.prototype.addStatusElement() : null, 
    this.imageLoader = new THREE.ImageLoader(), this.onLoadStart = function() {}, this.onLoadProgress = function() {}, 
    this.onLoadComplete = function() {};
}, THREE.Loader.prototype = {
    constructor: THREE.Loader,
    crossOrigin: void 0,
    addStatusElement: function() {
        var e = document.createElement("div");
        return e.style.position = "absolute", e.style.right = "0px", e.style.top = "0px", 
        e.style.fontSize = "0.8em", e.style.textAlign = "left", e.style.background = "rgba(0,0,0,0.25)", 
        e.style.color = "#fff", e.style.width = "120px", e.style.padding = "0.5em 0.5em 0.5em 0.5em", 
        e.style.zIndex = 1e3, e.innerHTML = "Loading ...", e;
    },
    updateProgress: function(progress) {
        var message = "Loaded ";
        message += progress.total ? (100 * progress.loaded / progress.total).toFixed(0) + "%" : (progress.loaded / 1024).toFixed(2) + " KB", 
        this.statusDomElement.innerHTML = message;
    },
    extractUrlBase: function(url) {
        var parts = url.split("/");
        return 1 === parts.length ? "./" : (parts.pop(), parts.join("/") + "/");
    },
    initMaterials: function(materials, texturePath) {
        for (var array = [], i = 0; i < materials.length; ++i) array[i] = this.createMaterial(materials[i], texturePath);
        return array;
    },
    needsTangents: function(materials) {
        for (var i = 0, il = materials.length; il > i; i++) {
            var m = materials[i];
            if (m instanceof THREE.ShaderMaterial) return !0;
        }
        return !1;
    },
    createMaterial: function(m, texturePath) {
        function nearest_pow2(n) {
            var l = Math.log(n) / Math.LN2;
            return Math.pow(2, Math.round(l));
        }
        function create_texture(where, name, sourceFile, repeat, offset, wrap, anisotropy) {
            var texture, fullPath = texturePath + sourceFile, loader = THREE.Loader.Handlers.get(fullPath);
            if (null !== loader ? texture = loader.load(fullPath) : (texture = new THREE.Texture(), 
            loader = scope.imageLoader, loader.crossOrigin = scope.crossOrigin, loader.load(fullPath, function(image) {
                if (THREE.Math.isPowerOfTwo(image.width) === !1 || THREE.Math.isPowerOfTwo(image.height) === !1) {
                    var width = nearest_pow2(image.width), height = nearest_pow2(image.height), canvas = document.createElement("canvas");
                    canvas.width = width, canvas.height = height;
                    var context = canvas.getContext("2d");
                    context.drawImage(image, 0, 0, width, height), texture.image = canvas;
                } else texture.image = image;
                texture.needsUpdate = !0;
            })), texture.sourceFile = sourceFile, repeat && (texture.repeat.set(repeat[0], repeat[1]), 
            1 !== repeat[0] && (texture.wrapS = THREE.RepeatWrapping), 1 !== repeat[1] && (texture.wrapT = THREE.RepeatWrapping)), 
            offset && texture.offset.set(offset[0], offset[1]), wrap) {
                var wrapMap = {
                    repeat: THREE.RepeatWrapping,
                    mirror: THREE.MirroredRepeatWrapping
                };
                void 0 !== wrapMap[wrap[0]] && (texture.wrapS = wrapMap[wrap[0]]), void 0 !== wrapMap[wrap[1]] && (texture.wrapT = wrapMap[wrap[1]]);
            }
            anisotropy && (texture.anisotropy = anisotropy), where[name] = texture;
        }
        function rgb2hex(rgb) {
            return (255 * rgb[0] << 16) + (255 * rgb[1] << 8) + 255 * rgb[2];
        }
        var scope = this, mtype = "MeshLambertMaterial", mpars = {
            color: 15658734,
            opacity: 1,
            map: null,
            lightMap: null,
            normalMap: null,
            bumpMap: null,
            wireframe: !1
        };
        if (m.shading) {
            var shading = m.shading.toLowerCase();
            "phong" === shading ? mtype = "MeshPhongMaterial" : "basic" === shading && (mtype = "MeshBasicMaterial");
        }
        void 0 !== m.blending && void 0 !== THREE[m.blending] && (mpars.blending = THREE[m.blending]), 
        void 0 !== m.transparent && (mpars.transparent = m.transparent), void 0 !== m.opacity && m.opacity < 1 && (mpars.transparent = !0), 
        void 0 !== m.depthTest && (mpars.depthTest = m.depthTest), void 0 !== m.depthWrite && (mpars.depthWrite = m.depthWrite), 
        void 0 !== m.visible && (mpars.visible = m.visible), void 0 !== m.flipSided && (mpars.side = THREE.BackSide), 
        void 0 !== m.doubleSided && (mpars.side = THREE.DoubleSide), void 0 !== m.wireframe && (mpars.wireframe = m.wireframe), 
        void 0 !== m.vertexColors && ("face" === m.vertexColors ? mpars.vertexColors = THREE.FaceColors : m.vertexColors && (mpars.vertexColors = THREE.VertexColors)), 
        m.colorDiffuse ? mpars.color = rgb2hex(m.colorDiffuse) : m.DbgColor && (mpars.color = m.DbgColor), 
        m.colorSpecular && (mpars.specular = rgb2hex(m.colorSpecular)), m.colorEmissive && (mpars.emissive = rgb2hex(m.colorEmissive)), 
        void 0 !== m.transparency && (console.warn("THREE.Loader: transparency has been renamed to opacity"), 
        m.opacity = m.transparency), void 0 !== m.opacity && (mpars.opacity = m.opacity), 
        m.specularCoef && (mpars.shininess = m.specularCoef), m.mapDiffuse && texturePath && create_texture(mpars, "map", m.mapDiffuse, m.mapDiffuseRepeat, m.mapDiffuseOffset, m.mapDiffuseWrap, m.mapDiffuseAnisotropy), 
        m.mapLight && texturePath && create_texture(mpars, "lightMap", m.mapLight, m.mapLightRepeat, m.mapLightOffset, m.mapLightWrap, m.mapLightAnisotropy), 
        m.mapBump && texturePath && create_texture(mpars, "bumpMap", m.mapBump, m.mapBumpRepeat, m.mapBumpOffset, m.mapBumpWrap, m.mapBumpAnisotropy), 
        m.mapNormal && texturePath && create_texture(mpars, "normalMap", m.mapNormal, m.mapNormalRepeat, m.mapNormalOffset, m.mapNormalWrap, m.mapNormalAnisotropy), 
        m.mapSpecular && texturePath && create_texture(mpars, "specularMap", m.mapSpecular, m.mapSpecularRepeat, m.mapSpecularOffset, m.mapSpecularWrap, m.mapSpecularAnisotropy), 
        m.mapAlpha && texturePath && create_texture(mpars, "alphaMap", m.mapAlpha, m.mapAlphaRepeat, m.mapAlphaOffset, m.mapAlphaWrap, m.mapAlphaAnisotropy), 
        m.mapBumpScale && (mpars.bumpScale = m.mapBumpScale), m.mapNormalFactor && (mpars.normalScale = new THREE.Vector2(m.mapNormalFactor, m.mapNormalFactor));
        var material = new THREE[mtype](mpars);
        return void 0 !== m.DbgName && (material.name = m.DbgName), material;
    }
}, THREE.Loader.Handlers = {
    handlers: [],
    add: function(regex, loader) {
        this.handlers.push(regex, loader);
    },
    get: function(file) {
        for (var i = 0, l = this.handlers.length; l > i; i += 2) {
            var regex = this.handlers[i], loader = this.handlers[i + 1];
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
        if (void 0 !== cached) return void (onLoad && onLoad(cached));
        var request = new XMLHttpRequest();
        request.open("GET", url, !0), request.addEventListener("load", function(event) {
            THREE.Cache.add(url, this.response), onLoad && onLoad(this.response), scope.manager.itemEnd(url);
        }, !1), void 0 !== onProgress && request.addEventListener("progress", function(event) {
            onProgress(event);
        }, !1), void 0 !== onError && request.addEventListener("error", function(event) {
            onError(event);
        }, !1), void 0 !== this.crossOrigin && (request.crossOrigin = this.crossOrigin), 
        void 0 !== this.responseType && (request.responseType = this.responseType), request.send(null), 
        scope.manager.itemStart(url);
    },
    setResponseType: function(value) {
        this.responseType = value;
    },
    setCrossOrigin: function(value) {
        this.crossOrigin = value;
    }
}, THREE.ImageLoader = function(manager) {
    this.manager = void 0 !== manager ? manager : THREE.DefaultLoadingManager;
}, THREE.ImageLoader.prototype = {
    constructor: THREE.ImageLoader,
    load: function(url, onLoad, onProgress, onError) {
        var scope = this, cached = THREE.Cache.get(url);
        if (void 0 !== cached) return void onLoad(cached);
        var image = document.createElement("img");
        return image.addEventListener("load", function(event) {
            THREE.Cache.add(url, this), onLoad && onLoad(this), scope.manager.itemEnd(url);
        }, !1), void 0 !== onProgress && image.addEventListener("progress", function(event) {
            onProgress(event);
        }, !1), void 0 !== onError && image.addEventListener("error", function(event) {
            onError(event);
        }, !1), void 0 !== this.crossOrigin && (image.crossOrigin = this.crossOrigin), image.src = url, 
        scope.manager.itemStart(url), image;
    },
    setCrossOrigin: function(value) {
        this.crossOrigin = value;
    }
}, THREE.JSONLoader = function(showStatus) {
    THREE.Loader.call(this, showStatus), this.withCredentials = !1;
}, THREE.JSONLoader.prototype = Object.create(THREE.Loader.prototype), THREE.JSONLoader.prototype.constructor = THREE.JSONLoader, 
THREE.JSONLoader.prototype.load = function(url, callback, texturePath) {
    texturePath = texturePath && "string" == typeof texturePath ? texturePath : this.extractUrlBase(url), 
    this.onLoadStart(), this.loadAjaxJSON(this, url, callback, texturePath);
}, THREE.JSONLoader.prototype.loadAjaxJSON = function(context, url, callback, texturePath, callbackProgress) {
    var xhr = new XMLHttpRequest(), length = 0;
    xhr.onreadystatechange = function() {
        if (xhr.readyState === xhr.DONE) if (200 === xhr.status || 0 === xhr.status) {
            if (xhr.responseText) {
                var json = JSON.parse(xhr.responseText), metadata = json.metadata;
                if (void 0 !== metadata) {
                    if ("object" === metadata.type) return void THREE.error("THREE.JSONLoader: " + url + " should be loaded with THREE.ObjectLoader instead.");
                    if ("scene" === metadata.type) return void THREE.error("THREE.JSONLoader: " + url + " seems to be a Scene. Use THREE.SceneLoader instead.");
                }
                var result = context.parse(json, texturePath);
                callback(result.geometry, result.materials);
            } else THREE.error("THREE.JSONLoader: " + url + " seems to be unreachable or the file is empty.");
            context.onLoadComplete();
        } else THREE.error("THREE.JSONLoader: Couldn't load " + url + " (" + xhr.status + ")"); else xhr.readyState === xhr.LOADING ? callbackProgress && (0 === length && (length = xhr.getResponseHeader("Content-Length")), 
        callbackProgress({
            total: length,
            loaded: xhr.responseText.length
        })) : xhr.readyState === xhr.HEADERS_RECEIVED && void 0 !== callbackProgress && (length = xhr.getResponseHeader("Content-Length"));
    }, xhr.open("GET", url, !0), xhr.withCredentials = this.withCredentials, xhr.send(null);
}, THREE.JSONLoader.prototype.parse = function(json, texturePath) {
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
        geometry.bones = json.bones, geometry.bones && geometry.bones.length > 0 && (geometry.skinWeights.length !== geometry.skinIndices.length || geometry.skinIndices.length !== geometry.vertices.length) && THREE.warn("THREE.JSONLoader: When skinning, number of vertices (" + geometry.vertices.length + "), skinIndices (" + geometry.skinIndices.length + "), and skinWeights (" + geometry.skinWeights.length + ") should match."), 
        geometry.animation = json.animation, geometry.animations = json.animations;
    }
    function parseMorphing(scale) {
        if (void 0 !== json.morphTargets) {
            var i, l, v, vl, dstVertices, srcVertices;
            for (i = 0, l = json.morphTargets.length; l > i; i++) for (geometry.morphTargets[i] = {}, 
            geometry.morphTargets[i].name = json.morphTargets[i].name, geometry.morphTargets[i].vertices = [], 
            dstVertices = geometry.morphTargets[i].vertices, srcVertices = json.morphTargets[i].vertices, 
            v = 0, vl = srcVertices.length; vl > v; v += 3) {
                var vertex = new THREE.Vector3();
                vertex.x = srcVertices[v] * scale, vertex.y = srcVertices[v + 1] * scale, vertex.z = srcVertices[v + 2] * scale, 
                dstVertices.push(vertex);
            }
        }
        if (void 0 !== json.morphColors) {
            var i, l, c, cl, dstColors, srcColors, color;
            for (i = 0, l = json.morphColors.length; l > i; i++) for (geometry.morphColors[i] = {}, 
            geometry.morphColors[i].name = json.morphColors[i].name, geometry.morphColors[i].colors = [], 
            dstColors = geometry.morphColors[i].colors, srcColors = json.morphColors[i].colors, 
            c = 0, cl = srcColors.length; cl > c; c += 3) color = new THREE.Color(16755200), 
            color.setRGB(srcColors[c], srcColors[c + 1], srcColors[c + 2]), dstColors.push(color);
        }
    }
    var geometry = new THREE.Geometry(), scale = void 0 !== json.scale ? 1 / json.scale : 1;
    if (parseModel(scale), parseSkin(), parseMorphing(scale), geometry.computeFaceNormals(), 
    geometry.computeBoundingSphere(), void 0 === json.materials || 0 === json.materials.length) return {
        geometry: geometry
    };
    var materials = this.initMaterials(json.materials, texturePath);
    return this.needsTangents(materials) && geometry.computeTangents(), {
        geometry: geometry,
        materials: materials
    };
}, THREE.LoadingManager = function(onLoad, onProgress, onError) {
    var scope = this, loaded = 0, total = 0;
    this.onLoad = onLoad, this.onProgress = onProgress, this.onError = onError, this.itemStart = function(url) {
        total++;
    }, this.itemEnd = function(url) {
        loaded++, void 0 !== scope.onProgress && scope.onProgress(url, loaded, total), loaded === total && void 0 !== scope.onLoad && scope.onLoad();
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
        var geometry = new THREE.BufferGeometry(), attributes = json.data.attributes;
        for (var key in attributes) {
            var attribute = attributes[key], typedArray = new self[attribute.type](attribute.array);
            geometry.addAttribute(key, new THREE.BufferAttribute(typedArray, attribute.itemSize));
        }
        var offsets = json.data.offsets;
        void 0 !== offsets && (geometry.offsets = JSON.parse(JSON.stringify(offsets)));
        var boundingSphere = json.data.boundingSphere;
        if (void 0 !== boundingSphere) {
            var center = new THREE.Vector3();
            void 0 !== boundingSphere.center && center.fromArray(boundingSphere.center), geometry.boundingSphere = new THREE.Sphere(center, boundingSphere.radius);
        }
        return geometry;
    }
}, THREE.MaterialLoader = function(manager) {
    this.manager = void 0 !== manager ? manager : THREE.DefaultLoadingManager;
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
    parse: function(json) {
        var material = new THREE[json.type]();
        if (void 0 !== json.color && material.color.setHex(json.color), void 0 !== json.emissive && material.emissive.setHex(json.emissive), 
        void 0 !== json.specular && material.specular.setHex(json.specular), void 0 !== json.shininess && (material.shininess = json.shininess), 
        void 0 !== json.uniforms && (material.uniforms = json.uniforms), void 0 !== json.vertexShader && (material.vertexShader = json.vertexShader), 
        void 0 !== json.fragmentShader && (material.fragmentShader = json.fragmentShader), 
        void 0 !== json.vertexColors && (material.vertexColors = json.vertexColors), void 0 !== json.shading && (material.shading = json.shading), 
        void 0 !== json.blending && (material.blending = json.blending), void 0 !== json.side && (material.side = json.side), 
        void 0 !== json.opacity && (material.opacity = json.opacity), void 0 !== json.transparent && (material.transparent = json.transparent), 
        void 0 !== json.wireframe && (material.wireframe = json.wireframe), void 0 !== json.size && (material.size = json.size), 
        void 0 !== json.sizeAttenuation && (material.sizeAttenuation = json.sizeAttenuation), 
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
        return (void 0 === json.images || 0 === json.images.length) && void 0 !== onLoad && onLoad(object), 
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

              case "CircleGeometry":
                geometry = new THREE.CircleGeometry(data.radius, data.segments);
                break;

              case "CylinderGeometry":
                geometry = new THREE.CylinderGeometry(data.radiusTop, data.radiusBottom, data.height, data.radialSegments, data.heightSegments, data.openEnded);
                break;

              case "SphereGeometry":
                geometry = new THREE.SphereGeometry(data.radius, data.widthSegments, data.heightSegments, data.phiStart, data.phiLength, data.thetaStart, data.thetaLength);
                break;

              case "IcosahedronGeometry":
                geometry = new THREE.IcosahedronGeometry(data.radius, data.detail);
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
                geometry = geometryLoader.parse(data.data).geometry;
            }
            geometry.uuid = data.uuid, void 0 !== data.name && (geometry.name = data.name), 
            geometries[data.uuid] = geometry;
        }
        return geometries;
    },
    parseMaterials: function(json, textures) {
        var materials = {};
        if (void 0 !== json) for (var getTexture = function(name) {
            return void 0 === textures[name] && THREE.warn("THREE.ObjectLoader: Undefined texture", name), 
            textures[name];
        }, loader = new THREE.MaterialLoader(), i = 0, l = json.length; l > i; i++) {
            var data = json[i], material = loader.parse(data);
            material.uuid = data.uuid, void 0 !== data.name && (material.name = data.name), 
            void 0 !== data.map && (material.map = getTexture(data.map)), void 0 !== data.bumpMap && (material.bumpMap = getTexture(data.bumpMap), 
            data.bumpScale && (material.bumpScale = new THREE.Vector2(data.bumpScale, data.bumpScale))), 
            void 0 !== data.alphaMap && (material.alphaMap = getTexture(data.alphaMap)), void 0 !== data.envMap && (material.envMap = getTexture(data.envMap)), 
            void 0 !== data.normalMap && (material.normalMap = getTexture(data.normalMap), data.normalScale && (material.normalScale = new THREE.Vector2(data.normalScale, data.normalScale))), 
            void 0 !== data.lightMap && (material.lightMap = getTexture(data.lightMap)), void 0 !== data.specularMap && (material.specularMap = getTexture(data.specularMap)), 
            materials[data.uuid] = material;
        }
        return materials;
    },
    parseImages: function(json, onLoad) {
        var scope = this, images = {};
        if (void 0 !== json && json.length > 0) {
            var manager = new THREE.LoadingManager(onLoad), loader = new THREE.ImageLoader(manager);
            loader.setCrossOrigin(this.crossOrigin);
            for (var loadImage = function(url) {
                return scope.manager.itemStart(url), loader.load(url, function() {
                    scope.manager.itemEnd(url);
                });
            }, i = 0, l = json.length; l > i; i++) {
                var image = json[i], path = /^(\/\/)|([a-z]+:(\/\/)?)/i.test(image.url) ? image.url : scope.texturePath + image.url;
                images[image.uuid] = loadImage(path);
            }
        }
        return images;
    },
    parseTextures: function(json, images) {
        var textures = {};
        if (void 0 !== json) for (var i = 0, l = json.length; l > i; i++) {
            var data = json[i];
            void 0 === data.image && THREE.warn('THREE.ObjectLoader: No "image" speficied for', data.uuid), 
            void 0 === images[data.image] && THREE.warn("THREE.ObjectLoader: Undefined image", data.image);
            var texture = new THREE.Texture(images[data.image]);
            texture.needsUpdate = !0, texture.uuid = data.uuid, void 0 !== data.name && (texture.name = data.name), 
            void 0 !== data.repeat && (texture.repeat = new THREE.Vector2(data.repeat[0], data.repeat[1])), 
            void 0 !== data.minFilter && (texture.minFilter = THREE[data.minFilter]), void 0 !== data.magFilter && (texture.magFilter = THREE[data.magFilter]), 
            void 0 !== data.anisotropy && (texture.anisotropy = data.anisotropy), data.wrap instanceof Array && (texture.wrapS = THREE[data.wrap[0]], 
            texture.wrapT = THREE[data.wrap[1]]), textures[data.uuid] = texture;
        }
        return textures;
    },
    parseObject: function() {
        var matrix = new THREE.Matrix4();
        return function(data, geometries, materials) {
            var object, getGeometry = function(name) {
                return void 0 === geometries[name] && THREE.warn("THREE.ObjectLoader: Undefined geometry", name), 
                geometries[name];
            }, getMaterial = function(name) {
                return void 0 === materials[name] && THREE.warn("THREE.ObjectLoader: Undefined material", name), 
                materials[name];
            };
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

              case "Line":
                object = new THREE.Line(getGeometry(data.geometry), getMaterial(data.material), data.mode);
                break;

              case "PointCloud":
                object = new THREE.PointCloud(getGeometry(data.geometry), getMaterial(data.material));
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
            void 0 !== data.visible && (object.visible = data.visible), void 0 !== data.userData && (object.userData = data.userData), 
            void 0 !== data.children) for (var child in data.children) object.add(this.parseObject(data.children[child], geometries, materials));
            return object;
        };
    }()
}, THREE.TextureLoader = function(manager) {
    this.manager = void 0 !== manager ? manager : THREE.DefaultLoadingManager;
}, THREE.TextureLoader.prototype = {
    constructor: THREE.TextureLoader,
    load: function(url, onLoad, onProgress, onError) {
        var scope = this, loader = new THREE.ImageLoader(scope.manager);
        loader.setCrossOrigin(this.crossOrigin), loader.load(url, function(image) {
            var texture = new THREE.Texture(image);
            texture.needsUpdate = !0, void 0 !== onLoad && onLoad(texture);
        }, onProgress, onError);
    },
    setCrossOrigin: function(value) {
        this.crossOrigin = value;
    }
}, THREE.DataTextureLoader = THREE.BinaryTextureLoader = function() {
    this._parser = null;
}, THREE.BinaryTextureLoader.prototype = {
    constructor: THREE.BinaryTextureLoader,
    load: function(url, onLoad, onProgress, onError) {
        var scope = this, texture = new THREE.DataTexture(), loader = new THREE.XHRLoader();
        return loader.setResponseType("arraybuffer"), loader.load(url, function(buffer) {
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
    }
}, THREE.CompressedTextureLoader = function() {
    this._parser = null;
}, THREE.CompressedTextureLoader.prototype = {
    constructor: THREE.CompressedTextureLoader,
    load: function(url, onLoad, onError) {
        var scope = this, images = [], texture = new THREE.CompressedTexture();
        texture.image = images;
        var loader = new THREE.XHRLoader();
        if (loader.setResponseType("arraybuffer"), url instanceof Array) for (var loaded = 0, loadTexture = function(i) {
            loader.load(url[i], function(buffer) {
                var texDatas = scope._parser(buffer, !0);
                images[i] = {
                    width: texDatas.width,
                    height: texDatas.height,
                    format: texDatas.format,
                    mipmaps: texDatas.mipmaps
                }, loaded += 1, 6 === loaded && (1 == texDatas.mipmapCount && (texture.minFilter = THREE.LinearFilter), 
                texture.format = texDatas.format, texture.needsUpdate = !0, onLoad && onLoad(texture));
            });
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
        });
        return texture;
    }
}, THREE.Material = function() {
    Object.defineProperty(this, "id", {
        value: THREE.MaterialIdCount++
    }), this.uuid = THREE.Math.generateUUID(), this.name = "", this.type = "Material", 
    this.side = THREE.FrontSide, this.opacity = 1, this.transparent = !1, this.blending = THREE.NormalBlending, 
    this.blendSrc = THREE.SrcAlphaFactor, this.blendDst = THREE.OneMinusSrcAlphaFactor, 
    this.blendEquation = THREE.AddEquation, this.blendSrcAlpha = null, this.blendDstAlpha = null, 
    this.blendEquationAlpha = null, this.depthTest = !0, this.depthWrite = !0, this.colorWrite = !0, 
    this.polygonOffset = !1, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, 
    this.alphaTest = 0, this.overdraw = 0, this.visible = !0, this._needsUpdate = !0;
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
                if (key in this) {
                    var currentValue = this[key];
                    currentValue instanceof THREE.Color ? currentValue.set(newValue) : currentValue instanceof THREE.Vector3 && newValue instanceof THREE.Vector3 ? currentValue.copy(newValue) : "overdraw" == key ? this[key] = Number(newValue) : this[key] = newValue;
                }
            } else THREE.warn("THREE.Material: '" + key + "' parameter is undefined.");
        }
    },
    toJSON: function() {
        var output = {
            metadata: {
                version: 4.2,
                type: "material",
                generator: "MaterialExporter"
            },
            uuid: this.uuid,
            type: this.type
        };
        return "" !== this.name && (output.name = this.name), this instanceof THREE.MeshBasicMaterial ? (output.color = this.color.getHex(), 
        this.vertexColors !== THREE.NoColors && (output.vertexColors = this.vertexColors), 
        this.blending !== THREE.NormalBlending && (output.blending = this.blending), this.side !== THREE.FrontSide && (output.side = this.side)) : this instanceof THREE.MeshLambertMaterial ? (output.color = this.color.getHex(), 
        output.emissive = this.emissive.getHex(), this.vertexColors !== THREE.NoColors && (output.vertexColors = this.vertexColors), 
        this.shading !== THREE.SmoothShading && (output.shading = this.shading), this.blending !== THREE.NormalBlending && (output.blending = this.blending), 
        this.side !== THREE.FrontSide && (output.side = this.side)) : this instanceof THREE.MeshPhongMaterial ? (output.color = this.color.getHex(), 
        output.emissive = this.emissive.getHex(), output.specular = this.specular.getHex(), 
        output.shininess = this.shininess, this.vertexColors !== THREE.NoColors && (output.vertexColors = this.vertexColors), 
        this.shading !== THREE.SmoothShading && (output.shading = this.shading), this.blending !== THREE.NormalBlending && (output.blending = this.blending), 
        this.side !== THREE.FrontSide && (output.side = this.side)) : this instanceof THREE.MeshNormalMaterial ? (this.blending !== THREE.NormalBlending && (output.blending = this.blending), 
        this.side !== THREE.FrontSide && (output.side = this.side)) : this instanceof THREE.MeshDepthMaterial ? (this.blending !== THREE.NormalBlending && (output.blending = this.blending), 
        this.side !== THREE.FrontSide && (output.side = this.side)) : this instanceof THREE.PointCloudMaterial ? (output.size = this.size, 
        output.sizeAttenuation = this.sizeAttenuation, output.color = this.color.getHex(), 
        this.vertexColors !== THREE.NoColors && (output.vertexColors = this.vertexColors), 
        this.blending !== THREE.NormalBlending && (output.blending = this.blending)) : this instanceof THREE.ShaderMaterial ? (output.uniforms = this.uniforms, 
        output.vertexShader = this.vertexShader, output.fragmentShader = this.fragmentShader) : this instanceof THREE.SpriteMaterial && (output.color = this.color.getHex()), 
        this.opacity < 1 && (output.opacity = this.opacity), this.transparent !== !1 && (output.transparent = this.transparent), 
        this.wireframe !== !1 && (output.wireframe = this.wireframe), output;
    },
    clone: function(material) {
        return void 0 === material && (material = new THREE.Material()), material.name = this.name, 
        material.side = this.side, material.opacity = this.opacity, material.transparent = this.transparent, 
        material.blending = this.blending, material.blendSrc = this.blendSrc, material.blendDst = this.blendDst, 
        material.blendEquation = this.blendEquation, material.blendSrcAlpha = this.blendSrcAlpha, 
        material.blendDstAlpha = this.blendDstAlpha, material.blendEquationAlpha = this.blendEquationAlpha, 
        material.depthTest = this.depthTest, material.depthWrite = this.depthWrite, material.polygonOffset = this.polygonOffset, 
        material.polygonOffsetFactor = this.polygonOffsetFactor, material.polygonOffsetUnits = this.polygonOffsetUnits, 
        material.alphaTest = this.alphaTest, material.overdraw = this.overdraw, material.visible = this.visible, 
        material;
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
    }
}, THREE.EventDispatcher.prototype.apply(THREE.Material.prototype), THREE.MaterialIdCount = 0, 
THREE.LineBasicMaterial = function(parameters) {
    THREE.Material.call(this), this.type = "LineBasicMaterial", this.color = new THREE.Color(16777215), 
    this.linewidth = 1, this.linecap = "round", this.linejoin = "round", this.vertexColors = THREE.NoColors, 
    this.fog = !0, this.setValues(parameters);
}, THREE.LineBasicMaterial.prototype = Object.create(THREE.Material.prototype), 
THREE.LineBasicMaterial.prototype.constructor = THREE.LineBasicMaterial, THREE.LineBasicMaterial.prototype.clone = function() {
    var material = new THREE.LineBasicMaterial();
    return THREE.Material.prototype.clone.call(this, material), material.color.copy(this.color), 
    material.linewidth = this.linewidth, material.linecap = this.linecap, material.linejoin = this.linejoin, 
    material.vertexColors = this.vertexColors, material.fog = this.fog, material;
}, THREE.LineDashedMaterial = function(parameters) {
    THREE.Material.call(this), this.type = "LineDashedMaterial", this.color = new THREE.Color(16777215), 
    this.linewidth = 1, this.scale = 1, this.dashSize = 3, this.gapSize = 1, this.vertexColors = !1, 
    this.fog = !0, this.setValues(parameters);
}, THREE.LineDashedMaterial.prototype = Object.create(THREE.Material.prototype), 
THREE.LineDashedMaterial.prototype.constructor = THREE.LineDashedMaterial, THREE.LineDashedMaterial.prototype.clone = function() {
    var material = new THREE.LineDashedMaterial();
    return THREE.Material.prototype.clone.call(this, material), material.color.copy(this.color), 
    material.linewidth = this.linewidth, material.scale = this.scale, material.dashSize = this.dashSize, 
    material.gapSize = this.gapSize, material.vertexColors = this.vertexColors, material.fog = this.fog, 
    material;
}, THREE.MeshBasicMaterial = function(parameters) {
    THREE.Material.call(this), this.type = "MeshBasicMaterial", this.color = new THREE.Color(16777215), 
    this.map = null, this.lightMap = null, this.specularMap = null, this.alphaMap = null, 
    this.envMap = null, this.combine = THREE.MultiplyOperation, this.reflectivity = 1, 
    this.refractionRatio = .98, this.fog = !0, this.shading = THREE.SmoothShading, this.wireframe = !1, 
    this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", 
    this.vertexColors = THREE.NoColors, this.skinning = !1, this.morphTargets = !1, 
    this.setValues(parameters);
}, THREE.MeshBasicMaterial.prototype = Object.create(THREE.Material.prototype), 
THREE.MeshBasicMaterial.prototype.constructor = THREE.MeshBasicMaterial, THREE.MeshBasicMaterial.prototype.clone = function() {
    var material = new THREE.MeshBasicMaterial();
    return THREE.Material.prototype.clone.call(this, material), material.color.copy(this.color), 
    material.map = this.map, material.lightMap = this.lightMap, material.specularMap = this.specularMap, 
    material.alphaMap = this.alphaMap, material.envMap = this.envMap, material.combine = this.combine, 
    material.reflectivity = this.reflectivity, material.refractionRatio = this.refractionRatio, 
    material.fog = this.fog, material.shading = this.shading, material.wireframe = this.wireframe, 
    material.wireframeLinewidth = this.wireframeLinewidth, material.wireframeLinecap = this.wireframeLinecap, 
    material.wireframeLinejoin = this.wireframeLinejoin, material.vertexColors = this.vertexColors, 
    material.skinning = this.skinning, material.morphTargets = this.morphTargets, material;
}, THREE.MeshLambertMaterial = function(parameters) {
    THREE.Material.call(this), this.type = "MeshLambertMaterial", this.color = new THREE.Color(16777215), 
    this.emissive = new THREE.Color(0), this.wrapAround = !1, this.wrapRGB = new THREE.Vector3(1, 1, 1), 
    this.map = null, this.lightMap = null, this.specularMap = null, this.alphaMap = null, 
    this.envMap = null, this.combine = THREE.MultiplyOperation, this.reflectivity = 1, 
    this.refractionRatio = .98, this.fog = !0, this.shading = THREE.SmoothShading, this.wireframe = !1, 
    this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", 
    this.vertexColors = THREE.NoColors, this.skinning = !1, this.morphTargets = !1, 
    this.morphNormals = !1, this.setValues(parameters);
}, THREE.MeshLambertMaterial.prototype = Object.create(THREE.Material.prototype), 
THREE.MeshLambertMaterial.prototype.constructor = THREE.MeshLambertMaterial, THREE.MeshLambertMaterial.prototype.clone = function() {
    var material = new THREE.MeshLambertMaterial();
    return THREE.Material.prototype.clone.call(this, material), material.color.copy(this.color), 
    material.emissive.copy(this.emissive), material.wrapAround = this.wrapAround, material.wrapRGB.copy(this.wrapRGB), 
    material.map = this.map, material.lightMap = this.lightMap, material.specularMap = this.specularMap, 
    material.alphaMap = this.alphaMap, material.envMap = this.envMap, material.combine = this.combine, 
    material.reflectivity = this.reflectivity, material.refractionRatio = this.refractionRatio, 
    material.fog = this.fog, material.shading = this.shading, material.wireframe = this.wireframe, 
    material.wireframeLinewidth = this.wireframeLinewidth, material.wireframeLinecap = this.wireframeLinecap, 
    material.wireframeLinejoin = this.wireframeLinejoin, material.vertexColors = this.vertexColors, 
    material.skinning = this.skinning, material.morphTargets = this.morphTargets, material.morphNormals = this.morphNormals, 
    material;
}, THREE.MeshPhongMaterial = function(parameters) {
    THREE.Material.call(this), this.type = "MeshPhongMaterial", this.color = new THREE.Color(16777215), 
    this.emissive = new THREE.Color(0), this.specular = new THREE.Color(1118481), this.shininess = 30, 
    this.metal = !1, this.wrapAround = !1, this.wrapRGB = new THREE.Vector3(1, 1, 1), 
    this.map = null, this.lightMap = null, this.bumpMap = null, this.bumpScale = 1, 
    this.normalMap = null, this.normalScale = new THREE.Vector2(1, 1), this.specularMap = null, 
    this.alphaMap = null, this.envMap = null, this.combine = THREE.MultiplyOperation, 
    this.reflectivity = 1, this.refractionRatio = .98, this.fog = !0, this.shading = THREE.SmoothShading, 
    this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", 
    this.wireframeLinejoin = "round", this.vertexColors = THREE.NoColors, this.skinning = !1, 
    this.morphTargets = !1, this.morphNormals = !1, this.setValues(parameters);
}, THREE.MeshPhongMaterial.prototype = Object.create(THREE.Material.prototype), 
THREE.MeshPhongMaterial.prototype.constructor = THREE.MeshPhongMaterial, THREE.MeshPhongMaterial.prototype.clone = function() {
    var material = new THREE.MeshPhongMaterial();
    return THREE.Material.prototype.clone.call(this, material), material.color.copy(this.color), 
    material.emissive.copy(this.emissive), material.specular.copy(this.specular), material.shininess = this.shininess, 
    material.metal = this.metal, material.wrapAround = this.wrapAround, material.wrapRGB.copy(this.wrapRGB), 
    material.map = this.map, material.lightMap = this.lightMap, material.bumpMap = this.bumpMap, 
    material.bumpScale = this.bumpScale, material.normalMap = this.normalMap, material.normalScale.copy(this.normalScale), 
    material.specularMap = this.specularMap, material.alphaMap = this.alphaMap, material.envMap = this.envMap, 
    material.combine = this.combine, material.reflectivity = this.reflectivity, material.refractionRatio = this.refractionRatio, 
    material.fog = this.fog, material.shading = this.shading, material.wireframe = this.wireframe, 
    material.wireframeLinewidth = this.wireframeLinewidth, material.wireframeLinecap = this.wireframeLinecap, 
    material.wireframeLinejoin = this.wireframeLinejoin, material.vertexColors = this.vertexColors, 
    material.skinning = this.skinning, material.morphTargets = this.morphTargets, material.morphNormals = this.morphNormals, 
    material;
}, THREE.MeshDepthMaterial = function(parameters) {
    THREE.Material.call(this), this.type = "MeshDepthMaterial", this.morphTargets = !1, 
    this.wireframe = !1, this.wireframeLinewidth = 1, this.setValues(parameters);
}, THREE.MeshDepthMaterial.prototype = Object.create(THREE.Material.prototype), 
THREE.MeshDepthMaterial.prototype.constructor = THREE.MeshDepthMaterial, THREE.MeshDepthMaterial.prototype.clone = function() {
    var material = new THREE.MeshDepthMaterial();
    return THREE.Material.prototype.clone.call(this, material), material.wireframe = this.wireframe, 
    material.wireframeLinewidth = this.wireframeLinewidth, material;
}, THREE.MeshNormalMaterial = function(parameters) {
    THREE.Material.call(this, parameters), this.type = "MeshNormalMaterial", this.wireframe = !1, 
    this.wireframeLinewidth = 1, this.morphTargets = !1, this.setValues(parameters);
}, THREE.MeshNormalMaterial.prototype = Object.create(THREE.Material.prototype), 
THREE.MeshNormalMaterial.prototype.constructor = THREE.MeshNormalMaterial, THREE.MeshNormalMaterial.prototype.clone = function() {
    var material = new THREE.MeshNormalMaterial();
    return THREE.Material.prototype.clone.call(this, material), material.wireframe = this.wireframe, 
    material.wireframeLinewidth = this.wireframeLinewidth, material;
}, THREE.MeshFaceMaterial = function(materials) {
    this.uuid = THREE.Math.generateUUID(), this.type = "MeshFaceMaterial", this.materials = materials instanceof Array ? materials : [];
}, THREE.MeshFaceMaterial.prototype = {
    constructor: THREE.MeshFaceMaterial,
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
        return output;
    },
    clone: function() {
        for (var material = new THREE.MeshFaceMaterial(), i = 0; i < this.materials.length; i++) material.materials.push(this.materials[i].clone());
        return material;
    }
}, THREE.PointCloudMaterial = function(parameters) {
    THREE.Material.call(this), this.type = "PointCloudMaterial", this.color = new THREE.Color(16777215), 
    this.map = null, this.size = 1, this.sizeAttenuation = !0, this.vertexColors = THREE.NoColors, 
    this.fog = !0, this.setValues(parameters);
}, THREE.PointCloudMaterial.prototype = Object.create(THREE.Material.prototype), 
THREE.PointCloudMaterial.prototype.constructor = THREE.PointCloudMaterial, THREE.PointCloudMaterial.prototype.clone = function() {
    var material = new THREE.PointCloudMaterial();
    return THREE.Material.prototype.clone.call(this, material), material.color.copy(this.color), 
    material.map = this.map, material.size = this.size, material.sizeAttenuation = this.sizeAttenuation, 
    material.vertexColors = this.vertexColors, material.fog = this.fog, material;
}, THREE.ParticleBasicMaterial = function(parameters) {
    return THREE.warn("THREE.ParticleBasicMaterial has been renamed to THREE.PointCloudMaterial."), 
    new THREE.PointCloudMaterial(parameters);
}, THREE.ParticleSystemMaterial = function(parameters) {
    return THREE.warn("THREE.ParticleSystemMaterial has been renamed to THREE.PointCloudMaterial."), 
    new THREE.PointCloudMaterial(parameters);
}, THREE.ShaderMaterial = function(parameters) {
    THREE.Material.call(this), this.type = "ShaderMaterial", this.defines = {}, this.uniforms = {}, 
    this.attributes = null, this.vertexShader = "void main() {\n	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}", 
    this.fragmentShader = "void main() {\n	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}", 
    this.shading = THREE.SmoothShading, this.linewidth = 1, this.wireframe = !1, this.wireframeLinewidth = 1, 
    this.fog = !1, this.lights = !1, this.vertexColors = THREE.NoColors, this.skinning = !1, 
    this.morphTargets = !1, this.morphNormals = !1, this.defaultAttributeValues = {
        color: [ 1, 1, 1 ],
        uv: [ 0, 0 ],
        uv2: [ 0, 0 ]
    }, this.index0AttributeName = void 0, this.setValues(parameters);
}, THREE.ShaderMaterial.prototype = Object.create(THREE.Material.prototype), THREE.ShaderMaterial.prototype.constructor = THREE.ShaderMaterial, 
THREE.ShaderMaterial.prototype.clone = function() {
    var material = new THREE.ShaderMaterial();
    return THREE.Material.prototype.clone.call(this, material), material.fragmentShader = this.fragmentShader, 
    material.vertexShader = this.vertexShader, material.uniforms = THREE.UniformsUtils.clone(this.uniforms), 
    material.attributes = this.attributes, material.defines = this.defines, material.shading = this.shading, 
    material.wireframe = this.wireframe, material.wireframeLinewidth = this.wireframeLinewidth, 
    material.fog = this.fog, material.lights = this.lights, material.vertexColors = this.vertexColors, 
    material.skinning = this.skinning, material.morphTargets = this.morphTargets, material.morphNormals = this.morphNormals, 
    material;
}, THREE.RawShaderMaterial = function(parameters) {
    THREE.ShaderMaterial.call(this, parameters), this.type = "RawShaderMaterial";
}, THREE.RawShaderMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype), 
THREE.RawShaderMaterial.prototype.constructor = THREE.RawShaderMaterial, THREE.RawShaderMaterial.prototype.clone = function() {
    var material = new THREE.RawShaderMaterial();
    return THREE.ShaderMaterial.prototype.clone.call(this, material), material;
}, THREE.SpriteMaterial = function(parameters) {
    THREE.Material.call(this), this.type = "SpriteMaterial", this.color = new THREE.Color(16777215), 
    this.map = null, this.rotation = 0, this.fog = !1, this.setValues(parameters);
}, THREE.SpriteMaterial.prototype = Object.create(THREE.Material.prototype), THREE.SpriteMaterial.prototype.constructor = THREE.SpriteMaterial, 
THREE.SpriteMaterial.prototype.clone = function() {
    var material = new THREE.SpriteMaterial();
    return THREE.Material.prototype.clone.call(this, material), material.color.copy(this.color), 
    material.map = this.map, material.rotation = this.rotation, material.fog = this.fog, 
    material;
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
    this.flipY = !0, this.unpackAlignment = 4, this._needsUpdate = !1, this.onUpdate = null;
}, THREE.Texture.DEFAULT_IMAGE = void 0, THREE.Texture.DEFAULT_MAPPING = THREE.UVMapping, 
THREE.Texture.prototype = {
    constructor: THREE.Texture,
    get needsUpdate() {
        return this._needsUpdate;
    },
    set needsUpdate(value) {
        value === !0 && this.update(), this._needsUpdate = value;
    },
    clone: function(texture) {
        return void 0 === texture && (texture = new THREE.Texture()), texture.image = this.image, 
        texture.mipmaps = this.mipmaps.slice(0), texture.mapping = this.mapping, texture.wrapS = this.wrapS, 
        texture.wrapT = this.wrapT, texture.magFilter = this.magFilter, texture.minFilter = this.minFilter, 
        texture.anisotropy = this.anisotropy, texture.format = this.format, texture.type = this.type, 
        texture.offset.copy(this.offset), texture.repeat.copy(this.repeat), texture.generateMipmaps = this.generateMipmaps, 
        texture.premultiplyAlpha = this.premultiplyAlpha, texture.flipY = this.flipY, texture.unpackAlignment = this.unpackAlignment, 
        texture;
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
    }
}, THREE.EventDispatcher.prototype.apply(THREE.Texture.prototype), THREE.TextureIdCount = 0, 
THREE.CubeTexture = function(images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy) {
    mapping = void 0 !== mapping ? mapping : THREE.CubeReflectionMapping, THREE.Texture.call(this, images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy), 
    this.images = images;
}, THREE.CubeTexture.prototype = Object.create(THREE.Texture.prototype), THREE.CubeTexture.prototype.constructor = THREE.CubeTexture, 
THREE.CubeTexture.clone = function(texture) {
    return void 0 === texture && (texture = new THREE.CubeTexture()), THREE.Texture.prototype.clone.call(this, texture), 
    texture.images = this.images, texture;
}, THREE.CompressedTexture = function(mipmaps, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy) {
    THREE.Texture.call(this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy), 
    this.image = {
        width: width,
        height: height
    }, this.mipmaps = mipmaps, this.flipY = !1, this.generateMipmaps = !1;
}, THREE.CompressedTexture.prototype = Object.create(THREE.Texture.prototype), THREE.CompressedTexture.prototype.constructor = THREE.CompressedTexture, 
THREE.CompressedTexture.prototype.clone = function() {
    var texture = new THREE.CompressedTexture();
    return THREE.Texture.prototype.clone.call(this, texture), texture;
}, THREE.DataTexture = function(data, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy) {
    THREE.Texture.call(this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy), 
    this.image = {
        data: data,
        width: width,
        height: height
    };
}, THREE.DataTexture.prototype = Object.create(THREE.Texture.prototype), THREE.DataTexture.prototype.constructor = THREE.DataTexture, 
THREE.DataTexture.prototype.clone = function() {
    var texture = new THREE.DataTexture();
    return THREE.Texture.prototype.clone.call(this, texture), texture;
}, THREE.VideoTexture = function(video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy) {
    THREE.Texture.call(this, video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy), 
    this.generateMipmaps = !1;
    var scope = this, update = function() {
        requestAnimationFrame(update), video.readyState === video.HAVE_ENOUGH_DATA && (scope.needsUpdate = !0);
    };
    update();
}, THREE.VideoTexture.prototype = Object.create(THREE.Texture.prototype), THREE.VideoTexture.prototype.constructor = THREE.VideoTexture, 
THREE.Group = function() {
    THREE.Object3D.call(this), this.type = "Group";
}, THREE.Group.prototype = Object.create(THREE.Object3D.prototype), THREE.Group.prototype.constructor = THREE.Group, 
THREE.PointCloud = function(geometry, material) {
    THREE.Object3D.call(this), this.type = "PointCloud", this.geometry = void 0 !== geometry ? geometry : new THREE.Geometry(), 
    this.material = void 0 !== material ? material : new THREE.PointCloudMaterial({
        color: 16777215 * Math.random()
    });
}, THREE.PointCloud.prototype = Object.create(THREE.Object3D.prototype), THREE.PointCloud.prototype.constructor = THREE.PointCloud, 
THREE.PointCloud.prototype.raycast = function() {
    var inverseMatrix = new THREE.Matrix4(), ray = new THREE.Ray();
    return function(raycaster, intersects) {
        var object = this, geometry = object.geometry, threshold = raycaster.params.PointCloud.threshold;
        if (inverseMatrix.getInverse(this.matrixWorld), ray.copy(raycaster.ray).applyMatrix4(inverseMatrix), 
        null === geometry.boundingBox || ray.isIntersectionBox(geometry.boundingBox) !== !1) {
            var localThreshold = threshold / ((this.scale.x + this.scale.y + this.scale.z) / 3), position = new THREE.Vector3(), testPoint = function(point, index) {
                var rayPointDistance = ray.distanceToPoint(point);
                if (localThreshold > rayPointDistance) {
                    var intersectPoint = ray.closestPointToPoint(point);
                    intersectPoint.applyMatrix4(object.matrixWorld);
                    var distance = raycaster.ray.origin.distanceTo(intersectPoint);
                    intersects.push({
                        distance: distance,
                        distanceToRay: rayPointDistance,
                        point: intersectPoint.clone(),
                        index: index,
                        face: null,
                        object: object
                    });
                }
            };
            if (geometry instanceof THREE.BufferGeometry) {
                var attributes = geometry.attributes, positions = attributes.position.array;
                if (void 0 !== attributes.index) {
                    var indices = attributes.index.array, offsets = geometry.offsets;
                    if (0 === offsets.length) {
                        var offset = {
                            start: 0,
                            count: indices.length,
                            index: 0
                        };
                        offsets = [ offset ];
                    }
                    for (var oi = 0, ol = offsets.length; ol > oi; ++oi) for (var start = offsets[oi].start, count = offsets[oi].count, index = offsets[oi].index, i = start, il = start + count; il > i; i++) {
                        var a = index + indices[i];
                        position.fromArray(positions, 3 * a), testPoint(position, a);
                    }
                } else for (var pointCount = positions.length / 3, i = 0; pointCount > i; i++) position.set(positions[3 * i], positions[3 * i + 1], positions[3 * i + 2]), 
                testPoint(position, i);
            } else for (var vertices = this.geometry.vertices, i = 0; i < vertices.length; i++) testPoint(vertices[i], i);
        }
    };
}(), THREE.PointCloud.prototype.clone = function(object) {
    return void 0 === object && (object = new THREE.PointCloud(this.geometry, this.material)), 
    THREE.Object3D.prototype.clone.call(this, object), object;
}, THREE.ParticleSystem = function(geometry, material) {
    return THREE.warn("THREE.ParticleSystem has been renamed to THREE.PointCloud."), 
    new THREE.PointCloud(geometry, material);
}, THREE.Line = function(geometry, material, mode) {
    THREE.Object3D.call(this), this.type = "Line", this.geometry = void 0 !== geometry ? geometry : new THREE.Geometry(), 
    this.material = void 0 !== material ? material : new THREE.LineBasicMaterial({
        color: 16777215 * Math.random()
    }), this.mode = void 0 !== mode ? mode : THREE.LineStrip;
}, THREE.LineStrip = 0, THREE.LinePieces = 1, THREE.Line.prototype = Object.create(THREE.Object3D.prototype), 
THREE.Line.prototype.constructor = THREE.Line, THREE.Line.prototype.raycast = function() {
    var inverseMatrix = new THREE.Matrix4(), ray = new THREE.Ray(), sphere = new THREE.Sphere();
    return function(raycaster, intersects) {
        var precision = raycaster.linePrecision, precisionSq = precision * precision, geometry = this.geometry;
        if (null === geometry.boundingSphere && geometry.computeBoundingSphere(), sphere.copy(geometry.boundingSphere), 
        sphere.applyMatrix4(this.matrixWorld), raycaster.ray.isIntersectionSphere(sphere) !== !1) {
            inverseMatrix.getInverse(this.matrixWorld), ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);
            var vStart = new THREE.Vector3(), vEnd = new THREE.Vector3(), interSegment = new THREE.Vector3(), interRay = new THREE.Vector3(), step = this.mode === THREE.LineStrip ? 1 : 2;
            if (geometry instanceof THREE.BufferGeometry) {
                var attributes = geometry.attributes;
                if (void 0 !== attributes.index) {
                    var indices = attributes.index.array, positions = attributes.position.array, offsets = geometry.offsets;
                    0 === offsets.length && (offsets = [ {
                        start: 0,
                        count: indices.length,
                        index: 0
                    } ]);
                    for (var oi = 0; oi < offsets.length; oi++) for (var start = offsets[oi].start, count = offsets[oi].count, index = offsets[oi].index, i = start; start + count - 1 > i; i += step) {
                        var a = index + indices[i], b = index + indices[i + 1];
                        vStart.fromArray(positions, 3 * a), vEnd.fromArray(positions, 3 * b);
                        var distSq = ray.distanceSqToSegment(vStart, vEnd, interRay, interSegment);
                        if (!(distSq > precisionSq)) {
                            var distance = ray.origin.distanceTo(interRay);
                            distance < raycaster.near || distance > raycaster.far || intersects.push({
                                distance: distance,
                                point: interSegment.clone().applyMatrix4(this.matrixWorld),
                                index: i,
                                offsetIndex: oi,
                                face: null,
                                faceIndex: null,
                                object: this
                            });
                        }
                    }
                } else for (var positions = attributes.position.array, i = 0; i < positions.length / 3 - 1; i += step) {
                    vStart.fromArray(positions, 3 * i), vEnd.fromArray(positions, 3 * i + 3);
                    var distSq = ray.distanceSqToSegment(vStart, vEnd, interRay, interSegment);
                    if (!(distSq > precisionSq)) {
                        var distance = ray.origin.distanceTo(interRay);
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
                    var distance = ray.origin.distanceTo(interRay);
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
}(), THREE.Line.prototype.clone = function(object) {
    return void 0 === object && (object = new THREE.Line(this.geometry, this.material, this.mode)), 
    THREE.Object3D.prototype.clone.call(this, object), object;
}, THREE.Mesh = function(geometry, material) {
    THREE.Object3D.call(this), this.type = "Mesh", this.geometry = void 0 !== geometry ? geometry : new THREE.Geometry(), 
    this.material = void 0 !== material ? material : new THREE.MeshBasicMaterial({
        color: 16777215 * Math.random()
    }), this.updateMorphTargets();
}, THREE.Mesh.prototype = Object.create(THREE.Object3D.prototype), THREE.Mesh.prototype.constructor = THREE.Mesh, 
THREE.Mesh.prototype.updateMorphTargets = function() {
    if (void 0 !== this.geometry.morphTargets && this.geometry.morphTargets.length > 0) {
        this.morphTargetBase = -1, this.morphTargetForcedOrder = [], this.morphTargetInfluences = [], 
        this.morphTargetDictionary = {};
        for (var m = 0, ml = this.geometry.morphTargets.length; ml > m; m++) this.morphTargetInfluences.push(0), 
        this.morphTargetDictionary[this.geometry.morphTargets[m].name] = m;
    }
}, THREE.Mesh.prototype.getMorphTargetIndexByName = function(name) {
    return void 0 !== this.morphTargetDictionary[name] ? this.morphTargetDictionary[name] : (THREE.warn("THREE.Mesh.getMorphTargetIndexByName: morph target " + name + " does not exist. Returning 0."), 
    0);
}, THREE.Mesh.prototype.raycast = function() {
    var inverseMatrix = new THREE.Matrix4(), ray = new THREE.Ray(), sphere = new THREE.Sphere(), vA = new THREE.Vector3(), vB = new THREE.Vector3(), vC = new THREE.Vector3();
    return function(raycaster, intersects) {
        var geometry = this.geometry;
        if (null === geometry.boundingSphere && geometry.computeBoundingSphere(), sphere.copy(geometry.boundingSphere), 
        sphere.applyMatrix4(this.matrixWorld), raycaster.ray.isIntersectionSphere(sphere) !== !1 && (inverseMatrix.getInverse(this.matrixWorld), 
        ray.copy(raycaster.ray).applyMatrix4(inverseMatrix), null === geometry.boundingBox || ray.isIntersectionBox(geometry.boundingBox) !== !1)) if (geometry instanceof THREE.BufferGeometry) {
            var material = this.material;
            if (void 0 === material) return;
            var a, b, c, attributes = geometry.attributes, precision = raycaster.precision;
            if (void 0 !== attributes.index) {
                var indices = attributes.index.array, positions = attributes.position.array, offsets = geometry.offsets;
                0 === offsets.length && (offsets = [ {
                    start: 0,
                    count: indices.length,
                    index: 0
                } ]);
                for (var oi = 0, ol = offsets.length; ol > oi; ++oi) for (var start = offsets[oi].start, count = offsets[oi].count, index = offsets[oi].index, i = start, il = start + count; il > i; i += 3) {
                    if (a = index + indices[i], b = index + indices[i + 1], c = index + indices[i + 2], 
                    vA.fromArray(positions, 3 * a), vB.fromArray(positions, 3 * b), vC.fromArray(positions, 3 * c), 
                    material.side === THREE.BackSide) var intersectionPoint = ray.intersectTriangle(vC, vB, vA, !0); else var intersectionPoint = ray.intersectTriangle(vA, vB, vC, material.side !== THREE.DoubleSide);
                    if (null !== intersectionPoint) {
                        intersectionPoint.applyMatrix4(this.matrixWorld);
                        var distance = raycaster.ray.origin.distanceTo(intersectionPoint);
                        precision > distance || distance < raycaster.near || distance > raycaster.far || intersects.push({
                            distance: distance,
                            point: intersectionPoint,
                            face: new THREE.Face3(a, b, c, THREE.Triangle.normal(vA, vB, vC)),
                            faceIndex: null,
                            object: this
                        });
                    }
                }
            } else for (var positions = attributes.position.array, i = 0, j = 0, il = positions.length; il > i; i += 3, 
            j += 9) {
                if (a = i, b = i + 1, c = i + 2, vA.fromArray(positions, j), vB.fromArray(positions, j + 3), 
                vC.fromArray(positions, j + 6), material.side === THREE.BackSide) var intersectionPoint = ray.intersectTriangle(vC, vB, vA, !0); else var intersectionPoint = ray.intersectTriangle(vA, vB, vC, material.side !== THREE.DoubleSide);
                if (null !== intersectionPoint) {
                    intersectionPoint.applyMatrix4(this.matrixWorld);
                    var distance = raycaster.ray.origin.distanceTo(intersectionPoint);
                    precision > distance || distance < raycaster.near || distance > raycaster.far || intersects.push({
                        distance: distance,
                        point: intersectionPoint,
                        face: new THREE.Face3(a, b, c, THREE.Triangle.normal(vA, vB, vC)),
                        faceIndex: null,
                        object: this
                    });
                }
            }
        } else if (geometry instanceof THREE.Geometry) for (var a, b, c, isFaceMaterial = this.material instanceof THREE.MeshFaceMaterial, objectMaterials = isFaceMaterial === !0 ? this.material.materials : null, precision = raycaster.precision, vertices = geometry.vertices, f = 0, fl = geometry.faces.length; fl > f; f++) {
            var face = geometry.faces[f], material = isFaceMaterial === !0 ? objectMaterials[face.materialIndex] : this.material;
            if (void 0 !== material) {
                if (a = vertices[face.a], b = vertices[face.b], c = vertices[face.c], material.morphTargets === !0) {
                    var morphTargets = geometry.morphTargets, morphInfluences = this.morphTargetInfluences;
                    vA.set(0, 0, 0), vB.set(0, 0, 0), vC.set(0, 0, 0);
                    for (var t = 0, tl = morphTargets.length; tl > t; t++) {
                        var influence = morphInfluences[t];
                        if (0 !== influence) {
                            var targets = morphTargets[t].vertices;
                            vA.x += (targets[face.a].x - a.x) * influence, vA.y += (targets[face.a].y - a.y) * influence, 
                            vA.z += (targets[face.a].z - a.z) * influence, vB.x += (targets[face.b].x - b.x) * influence, 
                            vB.y += (targets[face.b].y - b.y) * influence, vB.z += (targets[face.b].z - b.z) * influence, 
                            vC.x += (targets[face.c].x - c.x) * influence, vC.y += (targets[face.c].y - c.y) * influence, 
                            vC.z += (targets[face.c].z - c.z) * influence;
                        }
                    }
                    vA.add(a), vB.add(b), vC.add(c), a = vA, b = vB, c = vC;
                }
                if (material.side === THREE.BackSide) var intersectionPoint = ray.intersectTriangle(c, b, a, !0); else var intersectionPoint = ray.intersectTriangle(a, b, c, material.side !== THREE.DoubleSide);
                if (null !== intersectionPoint) {
                    intersectionPoint.applyMatrix4(this.matrixWorld);
                    var distance = raycaster.ray.origin.distanceTo(intersectionPoint);
                    precision > distance || distance < raycaster.near || distance > raycaster.far || intersects.push({
                        distance: distance,
                        point: intersectionPoint,
                        face: face,
                        faceIndex: f,
                        object: this
                    });
                }
            }
        }
    };
}(), THREE.Mesh.prototype.clone = function(object, recursive) {
    return void 0 === object && (object = new THREE.Mesh(this.geometry, this.material)), 
    THREE.Object3D.prototype.clone.call(this, object, recursive), object;
}, THREE.Bone = function(skin) {
    THREE.Object3D.call(this), this.type = "Bone", this.skin = skin;
}, THREE.Bone.prototype = Object.create(THREE.Object3D.prototype), THREE.Bone.prototype.constructor = THREE.Bone, 
THREE.Skeleton = function(bones, boneInverses, useVertexTexture) {
    if (this.useVertexTexture = void 0 !== useVertexTexture ? useVertexTexture : !0, 
    this.identityMatrix = new THREE.Matrix4(), bones = bones || [], this.bones = bones.slice(0), 
    this.useVertexTexture) {
        var size;
        size = this.bones.length > 256 ? 64 : this.bones.length > 64 ? 32 : this.bones.length > 16 ? 16 : 8, 
        this.boneTextureWidth = size, this.boneTextureHeight = size, this.boneMatrices = new Float32Array(this.boneTextureWidth * this.boneTextureHeight * 4), 
        this.boneTexture = new THREE.DataTexture(this.boneMatrices, this.boneTextureWidth, this.boneTextureHeight, THREE.RGBAFormat, THREE.FloatType), 
        this.boneTexture.minFilter = THREE.NearestFilter, this.boneTexture.magFilter = THREE.NearestFilter, 
        this.boneTexture.generateMipmaps = !1, this.boneTexture.flipY = !1;
    } else this.boneMatrices = new Float32Array(16 * this.bones.length);
    if (void 0 === boneInverses) this.calculateInverses(); else if (this.bones.length === boneInverses.length) this.boneInverses = boneInverses.slice(0); else {
        THREE.warn("THREE.Skeleton bonInverses is the wrong length."), this.boneInverses = [];
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
}(), THREE.SkinnedMesh = function(geometry, material, useVertexTexture) {
    THREE.Mesh.call(this, geometry, material), this.type = "SkinnedMesh", this.bindMode = "attached", 
    this.bindMatrix = new THREE.Matrix4(), this.bindMatrixInverse = new THREE.Matrix4();
    var bones = [];
    if (this.geometry && void 0 !== this.geometry.bones) {
        for (var bone, gbone, p, q, s, b = 0, bl = this.geometry.bones.length; bl > b; ++b) gbone = this.geometry.bones[b], 
        p = gbone.pos, q = gbone.rotq, s = gbone.scl, bone = new THREE.Bone(this), bones.push(bone), 
        bone.name = gbone.name, bone.position.set(p[0], p[1], p[2]), bone.quaternion.set(q[0], q[1], q[2], q[3]), 
        void 0 !== s ? bone.scale.set(s[0], s[1], s[2]) : bone.scale.set(1, 1, 1);
        for (var b = 0, bl = this.geometry.bones.length; bl > b; ++b) gbone = this.geometry.bones[b], 
        -1 !== gbone.parent ? bones[gbone.parent].add(bones[b]) : this.add(bones[b]);
    }
    this.normalizeSkinWeights(), this.updateMatrixWorld(!0), this.bind(new THREE.Skeleton(bones, void 0, useVertexTexture));
}, THREE.SkinnedMesh.prototype = Object.create(THREE.Mesh.prototype), THREE.SkinnedMesh.prototype.constructor = THREE.SkinnedMesh, 
THREE.SkinnedMesh.prototype.bind = function(skeleton, bindMatrix) {
    this.skeleton = skeleton, void 0 === bindMatrix && (this.updateMatrixWorld(!0), 
    bindMatrix = this.matrixWorld), this.bindMatrix.copy(bindMatrix), this.bindMatrixInverse.getInverse(bindMatrix);
}, THREE.SkinnedMesh.prototype.pose = function() {
    this.skeleton.pose();
}, THREE.SkinnedMesh.prototype.normalizeSkinWeights = function() {
    if (this.geometry instanceof THREE.Geometry) for (var i = 0; i < this.geometry.skinIndices.length; i++) {
        var sw = this.geometry.skinWeights[i], scale = 1 / sw.lengthManhattan();
        scale !== 1 / 0 ? sw.multiplyScalar(scale) : sw.set(1);
    }
}, THREE.SkinnedMesh.prototype.updateMatrixWorld = function(force) {
    THREE.Mesh.prototype.updateMatrixWorld.call(this, !0), "attached" === this.bindMode ? this.bindMatrixInverse.getInverse(this.matrixWorld) : "detached" === this.bindMode ? this.bindMatrixInverse.getInverse(this.bindMatrix) : THREE.warn("THREE.SkinnedMesh unreckognized bindMode: " + this.bindMode);
}, THREE.SkinnedMesh.prototype.clone = function(object) {
    return void 0 === object && (object = new THREE.SkinnedMesh(this.geometry, this.material, this.useVertexTexture)), 
    THREE.Mesh.prototype.clone.call(this, object), object;
}, THREE.MorphAnimMesh = function(geometry, material) {
    THREE.Mesh.call(this, geometry, material), this.type = "MorphAnimMesh", this.duration = 1e3, 
    this.mirroredLoop = !1, this.time = 0, this.lastKeyframe = 0, this.currentKeyframe = 0, 
    this.direction = 1, this.directionBackwards = !1, this.setFrameRange(0, this.geometry.morphTargets.length - 1);
}, THREE.MorphAnimMesh.prototype = Object.create(THREE.Mesh.prototype), THREE.MorphAnimMesh.prototype.constructor = THREE.MorphAnimMesh, 
THREE.MorphAnimMesh.prototype.setFrameRange = function(start, end) {
    this.startKeyframe = start, this.endKeyframe = end, this.length = this.endKeyframe - this.startKeyframe + 1;
}, THREE.MorphAnimMesh.prototype.setDirectionForward = function() {
    this.direction = 1, this.directionBackwards = !1;
}, THREE.MorphAnimMesh.prototype.setDirectionBackward = function() {
    this.direction = -1, this.directionBackwards = !0;
}, THREE.MorphAnimMesh.prototype.parseAnimations = function() {
    var geometry = this.geometry;
    geometry.animations || (geometry.animations = {});
    for (var firstAnimation, animations = geometry.animations, pattern = /([a-z]+)_?(\d+)/, i = 0, il = geometry.morphTargets.length; il > i; i++) {
        var morph = geometry.morphTargets[i], parts = morph.name.match(pattern);
        if (parts && parts.length > 1) {
            var label = parts[1];
            animations[label] || (animations[label] = {
                start: 1 / 0,
                end: -(1 / 0)
            });
            var animation = animations[label];
            i < animation.start && (animation.start = i), i > animation.end && (animation.end = i), 
            firstAnimation || (firstAnimation = label);
        }
    }
    geometry.firstAnimation = firstAnimation;
}, THREE.MorphAnimMesh.prototype.setAnimationLabel = function(label, start, end) {
    this.geometry.animations || (this.geometry.animations = {}), this.geometry.animations[label] = {
        start: start,
        end: end
    };
}, THREE.MorphAnimMesh.prototype.playAnimation = function(label, fps) {
    var animation = this.geometry.animations[label];
    animation ? (this.setFrameRange(animation.start, animation.end), this.duration = 1e3 * ((animation.end - animation.start) / fps), 
    this.time = 0) : THREE.warn("THREE.MorphAnimMesh: animation[" + label + "] undefined in .playAnimation()");
}, THREE.MorphAnimMesh.prototype.updateAnimation = function(delta) {
    var frameTime = this.duration / this.length;
    this.time += this.direction * delta, this.mirroredLoop ? (this.time > this.duration || this.time < 0) && (this.direction *= -1, 
    this.time > this.duration && (this.time = this.duration, this.directionBackwards = !0), 
    this.time < 0 && (this.time = 0, this.directionBackwards = !1)) : (this.time = this.time % this.duration, 
    this.time < 0 && (this.time += this.duration));
    var keyframe = this.startKeyframe + THREE.Math.clamp(Math.floor(this.time / frameTime), 0, this.length - 1);
    keyframe !== this.currentKeyframe && (this.morphTargetInfluences[this.lastKeyframe] = 0, 
    this.morphTargetInfluences[this.currentKeyframe] = 1, this.morphTargetInfluences[keyframe] = 0, 
    this.lastKeyframe = this.currentKeyframe, this.currentKeyframe = keyframe);
    var mix = this.time % frameTime / frameTime;
    this.directionBackwards && (mix = 1 - mix), this.morphTargetInfluences[this.currentKeyframe] = mix, 
    this.morphTargetInfluences[this.lastKeyframe] = 1 - mix;
}, THREE.MorphAnimMesh.prototype.interpolateTargets = function(a, b, t) {
    for (var influences = this.morphTargetInfluences, i = 0, l = influences.length; l > i; i++) influences[i] = 0;
    a > -1 && (influences[a] = 1 - t), b > -1 && (influences[b] = t);
}, THREE.MorphAnimMesh.prototype.clone = function(object) {
    return void 0 === object && (object = new THREE.MorphAnimMesh(this.geometry, this.material)), 
    object.duration = this.duration, object.mirroredLoop = this.mirroredLoop, object.time = this.time, 
    object.lastKeyframe = this.lastKeyframe, object.currentKeyframe = this.currentKeyframe, 
    object.direction = this.direction, object.directionBackwards = this.directionBackwards, 
    THREE.Mesh.prototype.clone.call(this, object), object;
}, THREE.LOD = function() {
    THREE.Object3D.call(this), this.objects = [];
}, THREE.LOD.prototype = Object.create(THREE.Object3D.prototype), THREE.LOD.prototype.constructor = THREE.LOD, 
THREE.LOD.prototype.addLevel = function(object, distance) {
    void 0 === distance && (distance = 0), distance = Math.abs(distance);
    for (var l = 0; l < this.objects.length && !(distance < this.objects[l].distance); l++) ;
    this.objects.splice(l, 0, {
        distance: distance,
        object: object
    }), this.add(object);
}, THREE.LOD.prototype.getObjectForDistance = function(distance) {
    for (var i = 1, l = this.objects.length; l > i && !(distance < this.objects[i].distance); i++) ;
    return this.objects[i - 1].object;
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
        if (this.objects.length > 1) {
            v1.setFromMatrixPosition(camera.matrixWorld), v2.setFromMatrixPosition(this.matrixWorld);
            var distance = v1.distanceTo(v2);
            this.objects[0].object.visible = !0;
            for (var i = 1, l = this.objects.length; l > i && distance >= this.objects[i].distance; i++) this.objects[i - 1].object.visible = !1, 
            this.objects[i].object.visible = !0;
            for (;l > i; i++) this.objects[i].object.visible = !1;
        }
    };
}(), THREE.LOD.prototype.clone = function(object) {
    void 0 === object && (object = new THREE.LOD()), THREE.Object3D.prototype.clone.call(this, object);
    for (var i = 0, l = this.objects.length; l > i; i++) {
        var x = this.objects[i].object.clone();
        x.visible = 0 === i, object.addLevel(x, this.objects[i].distance);
    }
    return object;
}, THREE.Sprite = function() {
    var indices = new Uint16Array([ 0, 1, 2, 0, 2, 3 ]), vertices = new Float32Array([ -.5, -.5, 0, .5, -.5, 0, .5, .5, 0, -.5, .5, 0 ]), uvs = new Float32Array([ 0, 0, 1, 0, 1, 1, 0, 1 ]), geometry = new THREE.BufferGeometry();
    return geometry.addAttribute("index", new THREE.BufferAttribute(indices, 1)), geometry.addAttribute("position", new THREE.BufferAttribute(vertices, 3)), 
    geometry.addAttribute("uv", new THREE.BufferAttribute(uvs, 2)), function(material) {
        THREE.Object3D.call(this), this.type = "Sprite", this.geometry = geometry, this.material = void 0 !== material ? material : new THREE.SpriteMaterial();
    };
}(), THREE.Sprite.prototype = Object.create(THREE.Object3D.prototype), THREE.Sprite.prototype.constructor = THREE.Sprite, 
THREE.Sprite.prototype.raycast = function() {
    var matrixPosition = new THREE.Vector3();
    return function(raycaster, intersects) {
        matrixPosition.setFromMatrixPosition(this.matrixWorld);
        var distance = raycaster.ray.distanceToPoint(matrixPosition);
        distance > this.scale.x || intersects.push({
            distance: distance,
            point: this.position,
            face: null,
            object: this
        });
    };
}(), THREE.Sprite.prototype.clone = function(object) {
    return void 0 === object && (object = new THREE.Sprite(this.material)), THREE.Object3D.prototype.clone.call(this, object), 
    object;
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
        rotation: 1,
        opacity: opacity,
        color: color,
        blending: blending
    });
}, THREE.LensFlare.prototype.updateLensFlares = function() {
    var f, flare, fl = this.lensFlares.length, vecX = 2 * -this.positionScreen.x, vecY = 2 * -this.positionScreen.y;
    for (f = 0; fl > f; f++) flare = this.lensFlares[f], flare.x = this.positionScreen.x + vecX * flare.distance, 
    flare.y = this.positionScreen.y + vecY * flare.distance, flare.wantedRotation = flare.x * Math.PI * .25, 
    flare.rotation += .25 * (flare.wantedRotation - flare.rotation);
}, THREE.Scene = function() {
    THREE.Object3D.call(this), this.type = "Scene", this.fog = null, this.overrideMaterial = null, 
    this.autoUpdate = !0;
}, THREE.Scene.prototype = Object.create(THREE.Object3D.prototype), THREE.Scene.prototype.constructor = THREE.Scene, 
THREE.Scene.prototype.clone = function(object) {
    return void 0 === object && (object = new THREE.Scene()), THREE.Object3D.prototype.clone.call(this, object), 
    null !== this.fog && (object.fog = this.fog.clone()), null !== this.overrideMaterial && (object.overrideMaterial = this.overrideMaterial.clone()), 
    object.autoUpdate = this.autoUpdate, object.matrixAutoUpdate = this.matrixAutoUpdate, 
    object;
}, THREE.Fog = function(color, near, far) {
    this.name = "", this.color = new THREE.Color(color), this.near = void 0 !== near ? near : 1, 
    this.far = void 0 !== far ? far : 1e3;
}, THREE.Fog.prototype.clone = function() {
    return new THREE.Fog(this.color.getHex(), this.near, this.far);
}, THREE.FogExp2 = function(color, density) {
    this.name = "", this.color = new THREE.Color(color), this.density = void 0 !== density ? density : 25e-5;
}, THREE.FogExp2.prototype.clone = function() {
    return new THREE.FogExp2(this.color.getHex(), this.density);
}, THREE.ShaderChunk = {}, THREE.ShaderChunk.common = "#define PI 3.14159\n#define PI2 6.28318\n#define RECIPROCAL_PI2 0.15915494\n#define LOG2 1.442695\n#define EPSILON 1e-6\n\nfloat square( in float a ) { return a*a; }\nvec2  square( in vec2 a )  { return vec2( a.x*a.x, a.y*a.y ); }\nvec3  square( in vec3 a )  { return vec3( a.x*a.x, a.y*a.y, a.z*a.z ); }\nvec4  square( in vec4 a )  { return vec4( a.x*a.x, a.y*a.y, a.z*a.z, a.w*a.w ); }\nfloat saturate( in float a ) { return clamp( a, 0.0, 1.0 ); }\nvec2  saturate( in vec2 a )  { return clamp( a, 0.0, 1.0 ); }\nvec3  saturate( in vec3 a )  { return clamp( a, 0.0, 1.0 ); }\nvec4  saturate( in vec4 a )  { return clamp( a, 0.0, 1.0 ); }\nfloat average( in float a ) { return a; }\nfloat average( in vec2 a )  { return ( a.x + a.y) * 0.5; }\nfloat average( in vec3 a )  { return ( a.x + a.y + a.z) / 3.0; }\nfloat average( in vec4 a )  { return ( a.x + a.y + a.z + a.w) * 0.25; }\nfloat whiteCompliment( in float a ) { return saturate( 1.0 - a ); }\nvec2  whiteCompliment( in vec2 a )  { return saturate( vec2(1.0) - a ); }\nvec3  whiteCompliment( in vec3 a )  { return saturate( vec3(1.0) - a ); }\nvec4  whiteCompliment( in vec4 a )  { return saturate( vec4(1.0) - a ); }\nvec3 transformDirection( in vec3 normal, in mat4 matrix ) {\n	return normalize( ( matrix * vec4( normal, 0.0 ) ).xyz );\n}\n// http://en.wikibooks.org/wiki/GLSL_Programming/Applying_Matrix_Transformations\nvec3 inverseTransformDirection( in vec3 normal, in mat4 matrix ) {\n	return normalize( ( vec4( normal, 0.0 ) * matrix ).xyz );\n}\nvec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal) {\n	float distance = dot( planeNormal, point-pointOnPlane );\n	return point - distance * planeNormal;\n}\nfloat sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n	return sign( dot( point - pointOnPlane, planeNormal ) );\n}\nvec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {\n	return pointOnLine + lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) );\n}\nfloat calcLightAttenuation( float lightDistance, float cutoffDistance, float decayExponent ) {\n	if ( decayExponent > 0.0 ) {\n	  return pow( saturate( 1.0 - lightDistance / cutoffDistance ), decayExponent );\n	}\n	return 1.0;\n}\n\nvec3 inputToLinear( in vec3 a ) {\n#ifdef GAMMA_INPUT\n	return pow( a, vec3( float( GAMMA_FACTOR ) ) );\n#else\n	return a;\n#endif\n}\nvec3 linearToOutput( in vec3 a ) {\n#ifdef GAMMA_OUTPUT\n	return pow( a, vec3( 1.0 / float( GAMMA_FACTOR ) ) );\n#else\n	return a;\n#endif\n}\n", 
THREE.ShaderChunk.alphatest_fragment = "#ifdef ALPHATEST\n\n	if ( diffuseColor.a < ALPHATEST ) discard;\n\n#endif\n", 
THREE.ShaderChunk.lights_lambert_vertex = "vLightFront = vec3( 0.0 );\n\n#ifdef DOUBLE_SIDED\n\n	vLightBack = vec3( 0.0 );\n\n#endif\n\ntransformedNormal = normalize( transformedNormal );\n\n#if MAX_DIR_LIGHTS > 0\n\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\n\n	vec3 dirVector = transformDirection( directionalLightDirection[ i ], viewMatrix );\n\n	float dotProduct = dot( transformedNormal, dirVector );\n	vec3 directionalLightWeighting = vec3( max( dotProduct, 0.0 ) );\n\n	#ifdef DOUBLE_SIDED\n\n		vec3 directionalLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n\n		#ifdef WRAP_AROUND\n\n			vec3 directionalLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n\n		#endif\n\n	#endif\n\n	#ifdef WRAP_AROUND\n\n		vec3 directionalLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\n		directionalLightWeighting = mix( directionalLightWeighting, directionalLightWeightingHalf, wrapRGB );\n\n		#ifdef DOUBLE_SIDED\n\n			directionalLightWeightingBack = mix( directionalLightWeightingBack, directionalLightWeightingHalfBack, wrapRGB );\n\n		#endif\n\n	#endif\n\n	vLightFront += directionalLightColor[ i ] * directionalLightWeighting;\n\n	#ifdef DOUBLE_SIDED\n\n		vLightBack += directionalLightColor[ i ] * directionalLightWeightingBack;\n\n	#endif\n\n}\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	for( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n\n		vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz - mvPosition.xyz;\n\n		float attenuation = calcLightAttenuation( length( lVector ), pointLightDistance[ i ], pointLightDecay[ i ] );\n\n		lVector = normalize( lVector );\n		float dotProduct = dot( transformedNormal, lVector );\n\n		vec3 pointLightWeighting = vec3( max( dotProduct, 0.0 ) );\n\n		#ifdef DOUBLE_SIDED\n\n			vec3 pointLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n\n			#ifdef WRAP_AROUND\n\n				vec3 pointLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n\n			#endif\n\n		#endif\n\n		#ifdef WRAP_AROUND\n\n			vec3 pointLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\n			pointLightWeighting = mix( pointLightWeighting, pointLightWeightingHalf, wrapRGB );\n\n			#ifdef DOUBLE_SIDED\n\n				pointLightWeightingBack = mix( pointLightWeightingBack, pointLightWeightingHalfBack, wrapRGB );\n\n			#endif\n\n		#endif\n\n		vLightFront += pointLightColor[ i ] * pointLightWeighting * attenuation;\n\n		#ifdef DOUBLE_SIDED\n\n			vLightBack += pointLightColor[ i ] * pointLightWeightingBack * attenuation;\n\n		#endif\n\n	}\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	for( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n\n		vec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz - mvPosition.xyz;\n\n		float spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - worldPosition.xyz ) );\n\n		if ( spotEffect > spotLightAngleCos[ i ] ) {\n\n			spotEffect = max( pow( max( spotEffect, 0.0 ), spotLightExponent[ i ] ), 0.0 );\n\n			float attenuation = calcLightAttenuation( length( lVector ), spotLightDistance[ i ], spotLightDecay[ i ] );\n\n			lVector = normalize( lVector );\n\n			float dotProduct = dot( transformedNormal, lVector );\n			vec3 spotLightWeighting = vec3( max( dotProduct, 0.0 ) );\n\n			#ifdef DOUBLE_SIDED\n\n				vec3 spotLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n\n				#ifdef WRAP_AROUND\n\n					vec3 spotLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n\n				#endif\n\n			#endif\n\n			#ifdef WRAP_AROUND\n\n				vec3 spotLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\n				spotLightWeighting = mix( spotLightWeighting, spotLightWeightingHalf, wrapRGB );\n\n				#ifdef DOUBLE_SIDED\n\n					spotLightWeightingBack = mix( spotLightWeightingBack, spotLightWeightingHalfBack, wrapRGB );\n\n				#endif\n\n			#endif\n\n			vLightFront += spotLightColor[ i ] * spotLightWeighting * attenuation * spotEffect;\n\n			#ifdef DOUBLE_SIDED\n\n				vLightBack += spotLightColor[ i ] * spotLightWeightingBack * attenuation * spotEffect;\n\n			#endif\n\n		}\n\n	}\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	for( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\n\n		vec3 lVector = transformDirection( hemisphereLightDirection[ i ], viewMatrix );\n\n		float dotProduct = dot( transformedNormal, lVector );\n\n		float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\n		float hemiDiffuseWeightBack = -0.5 * dotProduct + 0.5;\n\n		vLightFront += mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\n\n		#ifdef DOUBLE_SIDED\n\n			vLightBack += mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeightBack );\n\n		#endif\n\n	}\n\n#endif\n\nvLightFront += ambientLightColor;\n\n#ifdef DOUBLE_SIDED\n\n	vLightBack += ambientLightColor;\n\n#endif\n", 
THREE.ShaderChunk.map_particle_pars_fragment = "#ifdef USE_MAP\n\n	uniform vec4 offsetRepeat;\n	uniform sampler2D map;\n\n#endif\n", 
THREE.ShaderChunk.default_vertex = "#ifdef USE_SKINNING\n\n	vec4 mvPosition = modelViewMatrix * skinned;\n\n#elif defined( USE_MORPHTARGETS )\n\n	vec4 mvPosition = modelViewMatrix * vec4( morphed, 1.0 );\n\n#else\n\n	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n\n#endif\n\ngl_Position = projectionMatrix * mvPosition;\n", 
THREE.ShaderChunk.map_pars_fragment = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP )\n\n	varying vec2 vUv;\n\n#endif\n\n#ifdef USE_MAP\n\n	uniform sampler2D map;\n\n#endif", 
THREE.ShaderChunk.skinnormal_vertex = "#ifdef USE_SKINNING\n\n	mat4 skinMatrix = mat4( 0.0 );\n	skinMatrix += skinWeight.x * boneMatX;\n	skinMatrix += skinWeight.y * boneMatY;\n	skinMatrix += skinWeight.z * boneMatZ;\n	skinMatrix += skinWeight.w * boneMatW;\n	skinMatrix  = bindMatrixInverse * skinMatrix * bindMatrix;\n\n	#ifdef USE_MORPHNORMALS\n\n	vec4 skinnedNormal = skinMatrix * vec4( morphedNormal, 0.0 );\n\n	#else\n\n	vec4 skinnedNormal = skinMatrix * vec4( normal, 0.0 );\n\n	#endif\n\n#endif\n", 
THREE.ShaderChunk.logdepthbuf_pars_vertex = "#ifdef USE_LOGDEPTHBUF\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		varying float vFragDepth;\n\n	#endif\n\n	uniform float logDepthBufFC;\n\n#endif", 
THREE.ShaderChunk.lightmap_pars_vertex = "#ifdef USE_LIGHTMAP\n\n	varying vec2 vUv2;\n\n#endif", 
THREE.ShaderChunk.lights_phong_fragment = "#ifndef FLAT_SHADED\n\n	vec3 normal = normalize( vNormal );\n\n	#ifdef DOUBLE_SIDED\n\n		normal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n\n	#endif\n\n#else\n\n	vec3 fdx = dFdx( vViewPosition );\n	vec3 fdy = dFdy( vViewPosition );\n	vec3 normal = normalize( cross( fdx, fdy ) );\n\n#endif\n\nvec3 viewPosition = normalize( vViewPosition );\n\n#ifdef USE_NORMALMAP\n\n	normal = perturbNormal2Arb( -vViewPosition, normal );\n\n#elif defined( USE_BUMPMAP )\n\n	normal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );\n\n#endif\n\nvec3 totalDiffuseLight = vec3( 0.0 );\nvec3 totalSpecularLight = vec3( 0.0 );\n\n#if MAX_POINT_LIGHTS > 0\n\n	for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n\n		vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz + vViewPosition.xyz;\n\n		float attenuation = calcLightAttenuation( length( lVector ), pointLightDistance[ i ], pointLightDecay[ i ] );\n\n		lVector = normalize( lVector );\n\n		// diffuse\n\n		float dotProduct = dot( normal, lVector );\n\n		#ifdef WRAP_AROUND\n\n			float pointDiffuseWeightFull = max( dotProduct, 0.0 );\n			float pointDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\n\n			vec3 pointDiffuseWeight = mix( vec3( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n\n		#else\n\n			float pointDiffuseWeight = max( dotProduct, 0.0 );\n\n		#endif\n\n		totalDiffuseLight += pointLightColor[ i ] * pointDiffuseWeight * attenuation;\n\n				// specular\n\n		vec3 pointHalfVector = normalize( lVector + viewPosition );\n		float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );\n		float pointSpecularWeight = specularStrength * max( pow( pointDotNormalHalf, shininess ), 0.0 );\n\n		float specularNormalization = ( shininess + 2.0 ) / 8.0;\n\n		vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, pointHalfVector ), 0.0 ), 5.0 );\n		totalSpecularLight += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * attenuation * specularNormalization;\n\n	}\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	for ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n\n		vec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz + vViewPosition.xyz;\n\n		float attenuation = calcLightAttenuation( length( lVector ), spotLightDistance[ i ], spotLightDecay[ i ] );\n\n		lVector = normalize( lVector );\n\n		float spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );\n\n		if ( spotEffect > spotLightAngleCos[ i ] ) {\n\n			spotEffect = max( pow( max( spotEffect, 0.0 ), spotLightExponent[ i ] ), 0.0 );\n\n			// diffuse\n\n			float dotProduct = dot( normal, lVector );\n\n			#ifdef WRAP_AROUND\n\n				float spotDiffuseWeightFull = max( dotProduct, 0.0 );\n				float spotDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\n\n				vec3 spotDiffuseWeight = mix( vec3( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );\n\n			#else\n\n				float spotDiffuseWeight = max( dotProduct, 0.0 );\n\n			#endif\n\n			totalDiffuseLight += spotLightColor[ i ] * spotDiffuseWeight * attenuation * spotEffect;\n\n			// specular\n\n			vec3 spotHalfVector = normalize( lVector + viewPosition );\n			float spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );\n			float spotSpecularWeight = specularStrength * max( pow( spotDotNormalHalf, shininess ), 0.0 );\n\n			float specularNormalization = ( shininess + 2.0 ) / 8.0;\n\n			vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, spotHalfVector ), 0.0 ), 5.0 );\n			totalSpecularLight += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * attenuation * specularNormalization * spotEffect;\n\n		}\n\n	}\n\n#endif\n\n#if MAX_DIR_LIGHTS > 0\n\n	for( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\n\n		vec3 dirVector = transformDirection( directionalLightDirection[ i ], viewMatrix );\n\n		// diffuse\n\n		float dotProduct = dot( normal, dirVector );\n\n		#ifdef WRAP_AROUND\n\n			float dirDiffuseWeightFull = max( dotProduct, 0.0 );\n			float dirDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\n\n			vec3 dirDiffuseWeight = mix( vec3( dirDiffuseWeightFull ), vec3( dirDiffuseWeightHalf ), wrapRGB );\n\n		#else\n\n			float dirDiffuseWeight = max( dotProduct, 0.0 );\n\n		#endif\n\n		totalDiffuseLight += directionalLightColor[ i ] * dirDiffuseWeight;\n\n		// specular\n\n		vec3 dirHalfVector = normalize( dirVector + viewPosition );\n		float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );\n		float dirSpecularWeight = specularStrength * max( pow( dirDotNormalHalf, shininess ), 0.0 );\n\n		/*\n		// fresnel term from skin shader\n		const float F0 = 0.128;\n\n		float base = 1.0 - dot( viewPosition, dirHalfVector );\n		float exponential = pow( base, 5.0 );\n\n		float fresnel = exponential + F0 * ( 1.0 - exponential );\n		*/\n\n		/*\n		// fresnel term from fresnel shader\n		const float mFresnelBias = 0.08;\n		const float mFresnelScale = 0.3;\n		const float mFresnelPower = 5.0;\n\n		float fresnel = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( -viewPosition ), normal ), mFresnelPower );\n		*/\n\n		float specularNormalization = ( shininess + 2.0 ) / 8.0;\n\n		// 		dirSpecular += specular * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization * fresnel;\n\n		vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( dirVector, dirHalfVector ), 0.0 ), 5.0 );\n		totalSpecularLight += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n\n\n	}\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	for( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\n\n		vec3 lVector = transformDirection( hemisphereLightDirection[ i ], viewMatrix );\n\n		// diffuse\n\n		float dotProduct = dot( normal, lVector );\n		float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\n\n		vec3 hemiColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\n\n		totalDiffuseLight += hemiColor;\n\n		// specular (sky light)\n\n		vec3 hemiHalfVectorSky = normalize( lVector + viewPosition );\n		float hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;\n		float hemiSpecularWeightSky = specularStrength * max( pow( max( hemiDotNormalHalfSky, 0.0 ), shininess ), 0.0 );\n\n		// specular (ground light)\n\n		vec3 lVectorGround = -lVector;\n\n		vec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );\n		float hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;\n		float hemiSpecularWeightGround = specularStrength * max( pow( max( hemiDotNormalHalfGround, 0.0 ), shininess ), 0.0 );\n\n		float dotProductGround = dot( normal, lVectorGround );\n\n		float specularNormalization = ( shininess + 2.0 ) / 8.0;\n\n		vec3 schlickSky = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, hemiHalfVectorSky ), 0.0 ), 5.0 );\n		vec3 schlickGround = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVectorGround, hemiHalfVectorGround ), 0.0 ), 5.0 );\n		totalSpecularLight += hemiColor * specularNormalization * ( schlickSky * hemiSpecularWeightSky * max( dotProduct, 0.0 ) + schlickGround * hemiSpecularWeightGround * max( dotProductGround, 0.0 ) );\n\n	}\n\n#endif\n\n#ifdef METAL\n\n	outgoingLight += diffuseColor.rgb * ( totalDiffuseLight + ambientLightColor ) * specular + totalSpecularLight + emissive;\n\n#else\n\n	outgoingLight += diffuseColor.rgb * ( totalDiffuseLight + ambientLightColor ) + totalSpecularLight + emissive;\n\n#endif\n", 
THREE.ShaderChunk.fog_pars_fragment = "#ifdef USE_FOG\n\n	uniform vec3 fogColor;\n\n	#ifdef FOG_EXP2\n\n		uniform float fogDensity;\n\n	#else\n\n		uniform float fogNear;\n		uniform float fogFar;\n	#endif\n\n#endif", 
THREE.ShaderChunk.morphnormal_vertex = "#ifdef USE_MORPHNORMALS\n\n	vec3 morphedNormal = vec3( 0.0 );\n\n	morphedNormal += ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];\n	morphedNormal += ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];\n	morphedNormal += ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];\n	morphedNormal += ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];\n\n	morphedNormal += normal;\n\n#endif", 
THREE.ShaderChunk.envmap_pars_fragment = "#ifdef USE_ENVMAP\n\n	uniform float reflectivity;\n	#ifdef ENVMAP_TYPE_CUBE\n		uniform samplerCube envMap;\n	#else\n		uniform sampler2D envMap;\n	#endif\n	uniform float flipEnvMap;\n\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n\n		uniform float refractionRatio;\n\n	#else\n\n		varying vec3 vReflect;\n\n	#endif\n\n#endif\n", 
THREE.ShaderChunk.logdepthbuf_fragment = "#if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)\n\n	gl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;\n\n#endif", 
THREE.ShaderChunk.normalmap_pars_fragment = "#ifdef USE_NORMALMAP\n\n	uniform sampler2D normalMap;\n	uniform vec2 normalScale;\n\n	// Per-Pixel Tangent Space Normal Mapping\n	// http://hacksoflife.blogspot.ch/2009/11/per-pixel-tangent-space-normal-mapping.html\n\n	vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {\n\n		vec3 q0 = dFdx( eye_pos.xyz );\n		vec3 q1 = dFdy( eye_pos.xyz );\n		vec2 st0 = dFdx( vUv.st );\n		vec2 st1 = dFdy( vUv.st );\n\n		vec3 S = normalize( q0 * st1.t - q1 * st0.t );\n		vec3 T = normalize( -q0 * st1.s + q1 * st0.s );\n		vec3 N = normalize( surf_norm );\n\n		vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;\n		mapN.xy = normalScale * mapN.xy;\n		mat3 tsn = mat3( S, T, N );\n		return normalize( tsn * mapN );\n\n	}\n\n#endif\n", 
THREE.ShaderChunk.lights_phong_pars_vertex = "#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined( USE_ENVMAP )\n\n	varying vec3 vWorldPosition;\n\n#endif\n", 
THREE.ShaderChunk.lightmap_pars_fragment = "#ifdef USE_LIGHTMAP\n\n	varying vec2 vUv2;\n	uniform sampler2D lightMap;\n\n#endif", 
THREE.ShaderChunk.shadowmap_vertex = "#ifdef USE_SHADOWMAP\n\n	for( int i = 0; i < MAX_SHADOWS; i ++ ) {\n\n		vShadowCoord[ i ] = shadowMatrix[ i ] * worldPosition;\n\n	}\n\n#endif", 
THREE.ShaderChunk.lights_phong_vertex = "#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined( USE_ENVMAP )\n\n	vWorldPosition = worldPosition.xyz;\n\n#endif", 
THREE.ShaderChunk.map_fragment = "#ifdef USE_MAP\n\n	vec4 texelColor = texture2D( map, vUv );\n\n	texelColor.xyz = inputToLinear( texelColor.xyz );\n\n	diffuseColor *= texelColor;\n\n#endif", 
THREE.ShaderChunk.lightmap_vertex = "#ifdef USE_LIGHTMAP\n\n	vUv2 = uv2;\n\n#endif", 
THREE.ShaderChunk.map_particle_fragment = "#ifdef USE_MAP\n\n	diffuseColor *= texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) * offsetRepeat.zw + offsetRepeat.xy );\n\n#endif\n", 
THREE.ShaderChunk.color_pars_fragment = "#ifdef USE_COLOR\n\n	varying vec3 vColor;\n\n#endif\n", 
THREE.ShaderChunk.color_vertex = "#ifdef USE_COLOR\n\n	vColor.xyz = inputToLinear( color.xyz );\n\n#endif", 
THREE.ShaderChunk.skinning_vertex = "#ifdef USE_SKINNING\n\n	#ifdef USE_MORPHTARGETS\n\n	vec4 skinVertex = bindMatrix * vec4( morphed, 1.0 );\n\n	#else\n\n	vec4 skinVertex = bindMatrix * vec4( position, 1.0 );\n\n	#endif\n\n	vec4 skinned = vec4( 0.0 );\n	skinned += boneMatX * skinVertex * skinWeight.x;\n	skinned += boneMatY * skinVertex * skinWeight.y;\n	skinned += boneMatZ * skinVertex * skinWeight.z;\n	skinned += boneMatW * skinVertex * skinWeight.w;\n	skinned  = bindMatrixInverse * skinned;\n\n#endif\n", 
THREE.ShaderChunk.envmap_pars_vertex = "#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP ) && ! defined( PHONG )\n\n	varying vec3 vReflect;\n\n	uniform float refractionRatio;\n\n#endif\n", 
THREE.ShaderChunk.linear_to_gamma_fragment = "\n	outgoingLight = linearToOutput( outgoingLight );\n", 
THREE.ShaderChunk.color_pars_vertex = "#ifdef USE_COLOR\n\n	varying vec3 vColor;\n\n#endif", 
THREE.ShaderChunk.lights_lambert_pars_vertex = "uniform vec3 ambientLightColor;\n\n#if MAX_DIR_LIGHTS > 0\n\n	uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\n	uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	uniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n	uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDecay[ MAX_POINT_LIGHTS ];\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	uniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightDecay[ MAX_SPOT_LIGHTS ];\n\n#endif\n\n#ifdef WRAP_AROUND\n\n	uniform vec3 wrapRGB;\n\n#endif\n", 
THREE.ShaderChunk.map_pars_vertex = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP )\n\n	varying vec2 vUv;\n	uniform vec4 offsetRepeat;\n\n#endif\n", 
THREE.ShaderChunk.envmap_fragment = "#ifdef USE_ENVMAP\n\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n\n		vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );\n\n		// Transforming Normal Vectors with the Inverse Transformation\n		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );\n\n		#ifdef ENVMAP_MODE_REFLECTION\n\n			vec3 reflectVec = reflect( cameraToVertex, worldNormal );\n\n		#else\n\n			vec3 reflectVec = refract( cameraToVertex, worldNormal, refractionRatio );\n\n		#endif\n\n	#else\n\n		vec3 reflectVec = vReflect;\n\n	#endif\n\n	#ifdef DOUBLE_SIDED\n		float flipNormal = ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n	#else\n		float flipNormal = 1.0;\n	#endif\n\n	#ifdef ENVMAP_TYPE_CUBE\n		vec4 envColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n\n	#elif defined( ENVMAP_TYPE_EQUIREC )\n		vec2 sampleUV;\n		sampleUV.y = saturate( flipNormal * reflectVec.y * 0.5 + 0.5 );\n		sampleUV.x = atan( flipNormal * reflectVec.z, flipNormal * reflectVec.x ) * RECIPROCAL_PI2 + 0.5;\n		vec4 envColor = texture2D( envMap, sampleUV );\n\n	#elif defined( ENVMAP_TYPE_SPHERE )\n		vec3 reflectView = flipNormal * normalize((viewMatrix * vec4( reflectVec, 0.0 )).xyz + vec3(0.0,0.0,1.0));\n		vec4 envColor = texture2D( envMap, reflectView.xy * 0.5 + 0.5 );\n	#endif\n\n	envColor.xyz = inputToLinear( envColor.xyz );\n\n	#ifdef ENVMAP_BLENDING_MULTIPLY\n\n		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );\n\n	#elif defined( ENVMAP_BLENDING_MIX )\n\n		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );\n\n	#elif defined( ENVMAP_BLENDING_ADD )\n\n		outgoingLight += envColor.xyz * specularStrength * reflectivity;\n\n	#endif\n\n#endif\n", 
THREE.ShaderChunk.specularmap_pars_fragment = "#ifdef USE_SPECULARMAP\n\n	uniform sampler2D specularMap;\n\n#endif", 
THREE.ShaderChunk.logdepthbuf_vertex = "#ifdef USE_LOGDEPTHBUF\n\n	gl_Position.z = log2(max( EPSILON, gl_Position.w + 1.0 )) * logDepthBufFC;\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		vFragDepth = 1.0 + gl_Position.w;\n\n#else\n\n		gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;\n\n	#endif\n\n#endif", 
THREE.ShaderChunk.morphtarget_pars_vertex = "#ifdef USE_MORPHTARGETS\n\n	#ifndef USE_MORPHNORMALS\n\n	uniform float morphTargetInfluences[ 8 ];\n\n	#else\n\n	uniform float morphTargetInfluences[ 4 ];\n\n	#endif\n\n#endif", 
THREE.ShaderChunk.specularmap_fragment = "float specularStrength;\n\n#ifdef USE_SPECULARMAP\n\n	vec4 texelSpecular = texture2D( specularMap, vUv );\n	specularStrength = texelSpecular.r;\n\n#else\n\n	specularStrength = 1.0;\n\n#endif", 
THREE.ShaderChunk.fog_fragment = "#ifdef USE_FOG\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		float depth = gl_FragDepthEXT / gl_FragCoord.w;\n\n	#else\n\n		float depth = gl_FragCoord.z / gl_FragCoord.w;\n\n	#endif\n\n	#ifdef FOG_EXP2\n\n		float fogFactor = exp2( - square( fogDensity ) * square( depth ) * LOG2 );\n		fogFactor = whiteCompliment( fogFactor );\n\n	#else\n\n		float fogFactor = smoothstep( fogNear, fogFar, depth );\n\n	#endif\n	\n	outgoingLight = mix( outgoingLight, fogColor, fogFactor );\n\n#endif", 
THREE.ShaderChunk.bumpmap_pars_fragment = "#ifdef USE_BUMPMAP\n\n	uniform sampler2D bumpMap;\n	uniform float bumpScale;\n\n	// Derivative maps - bump mapping unparametrized surfaces by Morten Mikkelsen\n	// http://mmikkelsen3d.blogspot.sk/2011/07/derivative-maps.html\n\n	// Evaluate the derivative of the height w.r.t. screen-space using forward differencing (listing 2)\n\n	vec2 dHdxy_fwd() {\n\n		vec2 dSTdx = dFdx( vUv );\n		vec2 dSTdy = dFdy( vUv );\n\n		float Hll = bumpScale * texture2D( bumpMap, vUv ).x;\n		float dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;\n		float dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;\n\n		return vec2( dBx, dBy );\n\n	}\n\n	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {\n\n		vec3 vSigmaX = dFdx( surf_pos );\n		vec3 vSigmaY = dFdy( surf_pos );\n		vec3 vN = surf_norm;		// normalized\n\n		vec3 R1 = cross( vSigmaY, vN );\n		vec3 R2 = cross( vN, vSigmaX );\n\n		float fDet = dot( vSigmaX, R1 );\n\n		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n		return normalize( abs( fDet ) * surf_norm - vGrad );\n\n	}\n\n#endif\n", 
THREE.ShaderChunk.defaultnormal_vertex = "#ifdef USE_SKINNING\n\n	vec3 objectNormal = skinnedNormal.xyz;\n\n#elif defined( USE_MORPHNORMALS )\n\n	vec3 objectNormal = morphedNormal;\n\n#else\n\n	vec3 objectNormal = normal;\n\n#endif\n\n#ifdef FLIP_SIDED\n\n	objectNormal = -objectNormal;\n\n#endif\n\nvec3 transformedNormal = normalMatrix * objectNormal;\n", 
THREE.ShaderChunk.lights_phong_pars_fragment = "uniform vec3 ambientLightColor;\n\n#if MAX_DIR_LIGHTS > 0\n\n	uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\n	uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	uniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n\n	uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDecay[ MAX_POINT_LIGHTS ];\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	uniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightDecay[ MAX_SPOT_LIGHTS ];\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined( USE_ENVMAP )\n\n	varying vec3 vWorldPosition;\n\n#endif\n\n#ifdef WRAP_AROUND\n\n	uniform vec3 wrapRGB;\n\n#endif\n\nvarying vec3 vViewPosition;\n\n#ifndef FLAT_SHADED\n\n	varying vec3 vNormal;\n\n#endif\n", 
THREE.ShaderChunk.skinbase_vertex = "#ifdef USE_SKINNING\n\n	mat4 boneMatX = getBoneMatrix( skinIndex.x );\n	mat4 boneMatY = getBoneMatrix( skinIndex.y );\n	mat4 boneMatZ = getBoneMatrix( skinIndex.z );\n	mat4 boneMatW = getBoneMatrix( skinIndex.w );\n\n#endif", 
THREE.ShaderChunk.map_vertex = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP )\n\n	vUv = uv * offsetRepeat.zw + offsetRepeat.xy;\n\n#endif", 
THREE.ShaderChunk.lightmap_fragment = "#ifdef USE_LIGHTMAP\n\n	outgoingLight *= diffuseColor.xyz * texture2D( lightMap, vUv2 ).xyz;\n\n#endif", 
THREE.ShaderChunk.shadowmap_pars_vertex = "#ifdef USE_SHADOWMAP\n\n	varying vec4 vShadowCoord[ MAX_SHADOWS ];\n	uniform mat4 shadowMatrix[ MAX_SHADOWS ];\n\n#endif", 
THREE.ShaderChunk.color_fragment = "#ifdef USE_COLOR\n\n	diffuseColor.rgb *= vColor;\n\n#endif", 
THREE.ShaderChunk.morphtarget_vertex = "#ifdef USE_MORPHTARGETS\n\n	vec3 morphed = vec3( 0.0 );\n	morphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];\n	morphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];\n	morphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];\n	morphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\n\n	#ifndef USE_MORPHNORMALS\n\n	morphed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];\n	morphed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];\n	morphed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];\n	morphed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\n\n	#endif\n\n	morphed += position;\n\n#endif", 
THREE.ShaderChunk.envmap_vertex = "#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP ) && ! defined( PHONG )\n\n	vec3 worldNormal = transformDirection( objectNormal, modelMatrix );\n\n	vec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );\n\n	#ifdef ENVMAP_MODE_REFLECTION\n\n		vReflect = reflect( cameraToVertex, worldNormal );\n\n	#else\n\n		vReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n\n	#endif\n\n#endif\n", 
THREE.ShaderChunk.shadowmap_fragment = "#ifdef USE_SHADOWMAP\n\n	#ifdef SHADOWMAP_DEBUG\n\n		vec3 frustumColors[3];\n		frustumColors[0] = vec3( 1.0, 0.5, 0.0 );\n		frustumColors[1] = vec3( 0.0, 1.0, 0.8 );\n		frustumColors[2] = vec3( 0.0, 0.5, 1.0 );\n\n	#endif\n\n	#ifdef SHADOWMAP_CASCADE\n\n		int inFrustumCount = 0;\n\n	#endif\n\n	float fDepth;\n	vec3 shadowColor = vec3( 1.0 );\n\n	for( int i = 0; i < MAX_SHADOWS; i ++ ) {\n\n		vec3 shadowCoord = vShadowCoord[ i ].xyz / vShadowCoord[ i ].w;\n\n				// if ( something && something ) breaks ATI OpenGL shader compiler\n				// if ( all( something, something ) ) using this instead\n\n		bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n		bool inFrustum = all( inFrustumVec );\n\n				// don't shadow pixels outside of light frustum\n				// use just first frustum (for cascades)\n				// don't shadow pixels behind far plane of light frustum\n\n		#ifdef SHADOWMAP_CASCADE\n\n			inFrustumCount += int( inFrustum );\n			bvec3 frustumTestVec = bvec3( inFrustum, inFrustumCount == 1, shadowCoord.z <= 1.0 );\n\n		#else\n\n			bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n\n		#endif\n\n		bool frustumTest = all( frustumTestVec );\n\n		if ( frustumTest ) {\n\n			shadowCoord.z += shadowBias[ i ];\n\n			#if defined( SHADOWMAP_TYPE_PCF )\n\n						// Percentage-close filtering\n						// (9 pixel kernel)\n						// http://fabiensanglard.net/shadowmappingPCF/\n\n				float shadow = 0.0;\n\n		/*\n						// nested loops breaks shader compiler / validator on some ATI cards when using OpenGL\n						// must enroll loop manually\n\n				for ( float y = -1.25; y <= 1.25; y += 1.25 )\n					for ( float x = -1.25; x <= 1.25; x += 1.25 ) {\n\n						vec4 rgbaDepth = texture2D( shadowMap[ i ], vec2( x * xPixelOffset, y * yPixelOffset ) + shadowCoord.xy );\n\n								// doesn't seem to produce any noticeable visual difference compared to simple texture2D lookup\n								//vec4 rgbaDepth = texture2DProj( shadowMap[ i ], vec4( vShadowCoord[ i ].w * ( vec2( x * xPixelOffset, y * yPixelOffset ) + shadowCoord.xy ), 0.05, vShadowCoord[ i ].w ) );\n\n						float fDepth = unpackDepth( rgbaDepth );\n\n						if ( fDepth < shadowCoord.z )\n							shadow += 1.0;\n\n				}\n\n				shadow /= 9.0;\n\n		*/\n\n				const float shadowDelta = 1.0 / 9.0;\n\n				float xPixelOffset = 1.0 / shadowMapSize[ i ].x;\n				float yPixelOffset = 1.0 / shadowMapSize[ i ].y;\n\n				float dx0 = -1.25 * xPixelOffset;\n				float dy0 = -1.25 * yPixelOffset;\n				float dx1 = 1.25 * xPixelOffset;\n				float dy1 = 1.25 * yPixelOffset;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				shadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness[ i ] * shadow ) );\n\n			#elif defined( SHADOWMAP_TYPE_PCF_SOFT )\n\n						// Percentage-close filtering\n						// (9 pixel kernel)\n						// http://fabiensanglard.net/shadowmappingPCF/\n\n				float shadow = 0.0;\n\n				float xPixelOffset = 1.0 / shadowMapSize[ i ].x;\n				float yPixelOffset = 1.0 / shadowMapSize[ i ].y;\n\n				float dx0 = -1.0 * xPixelOffset;\n				float dy0 = -1.0 * yPixelOffset;\n				float dx1 = 1.0 * xPixelOffset;\n				float dy1 = 1.0 * yPixelOffset;\n\n				mat3 shadowKernel;\n				mat3 depthKernel;\n\n				depthKernel[0][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\n				depthKernel[0][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\n				depthKernel[0][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\n				depthKernel[1][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\n				depthKernel[1][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\n				depthKernel[1][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\n				depthKernel[2][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\n				depthKernel[2][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\n				depthKernel[2][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\n\n				vec3 shadowZ = vec3( shadowCoord.z );\n				shadowKernel[0] = vec3(lessThan(depthKernel[0], shadowZ ));\n				shadowKernel[0] *= vec3(0.25);\n\n				shadowKernel[1] = vec3(lessThan(depthKernel[1], shadowZ ));\n				shadowKernel[1] *= vec3(0.25);\n\n				shadowKernel[2] = vec3(lessThan(depthKernel[2], shadowZ ));\n				shadowKernel[2] *= vec3(0.25);\n\n				vec2 fractionalCoord = 1.0 - fract( shadowCoord.xy * shadowMapSize[i].xy );\n\n				shadowKernel[0] = mix( shadowKernel[1], shadowKernel[0], fractionalCoord.x );\n				shadowKernel[1] = mix( shadowKernel[2], shadowKernel[1], fractionalCoord.x );\n\n				vec4 shadowValues;\n				shadowValues.x = mix( shadowKernel[0][1], shadowKernel[0][0], fractionalCoord.y );\n				shadowValues.y = mix( shadowKernel[0][2], shadowKernel[0][1], fractionalCoord.y );\n				shadowValues.z = mix( shadowKernel[1][1], shadowKernel[1][0], fractionalCoord.y );\n				shadowValues.w = mix( shadowKernel[1][2], shadowKernel[1][1], fractionalCoord.y );\n\n				shadow = dot( shadowValues, vec4( 1.0 ) );\n\n				shadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness[ i ] * shadow ) );\n\n			#else\n\n				vec4 rgbaDepth = texture2D( shadowMap[ i ], shadowCoord.xy );\n				float fDepth = unpackDepth( rgbaDepth );\n\n				if ( fDepth < shadowCoord.z )\n\n		// spot with multiple shadows is darker\n\n					shadowColor = shadowColor * vec3( 1.0 - shadowDarkness[ i ] );\n\n		// spot with multiple shadows has the same color as single shadow spot\n\n		// 					shadowColor = min( shadowColor, vec3( shadowDarkness[ i ] ) );\n\n			#endif\n\n		}\n\n\n		#ifdef SHADOWMAP_DEBUG\n\n			#ifdef SHADOWMAP_CASCADE\n\n				if ( inFrustum && inFrustumCount == 1 ) outgoingLight *= frustumColors[ i ];\n\n			#else\n\n				if ( inFrustum ) outgoingLight *= frustumColors[ i ];\n\n			#endif\n\n		#endif\n\n	}\n\n	// NOTE: I am unsure if this is correct in linear space.  -bhouston, Dec 29, 2014\n	shadowColor = inputToLinear( shadowColor );\n\n	outgoingLight = outgoingLight * shadowColor;\n\n#endif\n", 
THREE.ShaderChunk.worldpos_vertex = "#if defined( USE_ENVMAP ) || defined( PHONG ) || defined( LAMBERT ) || defined ( USE_SHADOWMAP )\n\n	#ifdef USE_SKINNING\n\n		vec4 worldPosition = modelMatrix * skinned;\n\n	#elif defined( USE_MORPHTARGETS )\n\n		vec4 worldPosition = modelMatrix * vec4( morphed, 1.0 );\n\n	#else\n\n		vec4 worldPosition = modelMatrix * vec4( position, 1.0 );\n\n	#endif\n\n#endif\n", 
THREE.ShaderChunk.shadowmap_pars_fragment = "#ifdef USE_SHADOWMAP\n\n	uniform sampler2D shadowMap[ MAX_SHADOWS ];\n	uniform vec2 shadowMapSize[ MAX_SHADOWS ];\n\n	uniform float shadowDarkness[ MAX_SHADOWS ];\n	uniform float shadowBias[ MAX_SHADOWS ];\n\n	varying vec4 vShadowCoord[ MAX_SHADOWS ];\n\n	float unpackDepth( const in vec4 rgba_depth ) {\n\n		const vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );\n		float depth = dot( rgba_depth, bit_shift );\n		return depth;\n\n	}\n\n#endif", 
THREE.ShaderChunk.skinning_pars_vertex = "#ifdef USE_SKINNING\n\n	uniform mat4 bindMatrix;\n	uniform mat4 bindMatrixInverse;\n\n	#ifdef BONE_TEXTURE\n\n		uniform sampler2D boneTexture;\n		uniform int boneTextureWidth;\n		uniform int boneTextureHeight;\n\n		mat4 getBoneMatrix( const in float i ) {\n\n			float j = i * 4.0;\n			float x = mod( j, float( boneTextureWidth ) );\n			float y = floor( j / float( boneTextureWidth ) );\n\n			float dx = 1.0 / float( boneTextureWidth );\n			float dy = 1.0 / float( boneTextureHeight );\n\n			y = dy * ( y + 0.5 );\n\n			vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\n			vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\n			vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\n			vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\n\n			mat4 bone = mat4( v1, v2, v3, v4 );\n\n			return bone;\n\n		}\n\n	#else\n\n		uniform mat4 boneGlobalMatrices[ MAX_BONES ];\n\n		mat4 getBoneMatrix( const in float i ) {\n\n			mat4 bone = boneGlobalMatrices[ int(i) ];\n			return bone;\n\n		}\n\n	#endif\n\n#endif\n", 
THREE.ShaderChunk.logdepthbuf_pars_fragment = "#ifdef USE_LOGDEPTHBUF\n\n	uniform float logDepthBufFC;\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		#extension GL_EXT_frag_depth : enable\n		varying float vFragDepth;\n\n	#endif\n\n#endif", 
THREE.ShaderChunk.alphamap_fragment = "#ifdef USE_ALPHAMAP\n\n	diffuseColor.a *= texture2D( alphaMap, vUv ).g;\n\n#endif\n", 
THREE.ShaderChunk.alphamap_pars_fragment = "#ifdef USE_ALPHAMAP\n\n	uniform sampler2D alphaMap;\n\n#endif\n", 
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
                parameter_src instanceof THREE.Color || parameter_src instanceof THREE.Vector2 || parameter_src instanceof THREE.Vector3 || parameter_src instanceof THREE.Vector4 || parameter_src instanceof THREE.Matrix4 || parameter_src instanceof THREE.Texture ? uniforms_dst[u][p] = parameter_src.clone() : parameter_src instanceof Array ? uniforms_dst[u][p] = parameter_src.slice() : uniforms_dst[u][p] = parameter_src;
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
        lightMap: {
            type: "t",
            value: null
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
        },
        morphTargetInfluences: {
            type: "f",
            value: 0
        }
    },
    bump: {
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
    particle: {
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
        uniforms: THREE.UniformsUtils.merge([ THREE.UniformsLib.common, THREE.UniformsLib.fog, THREE.UniformsLib.shadowmap ]),
        vertexShader: [ THREE.ShaderChunk.common, THREE.ShaderChunk.map_pars_vertex, THREE.ShaderChunk.lightmap_pars_vertex, THREE.ShaderChunk.envmap_pars_vertex, THREE.ShaderChunk.color_pars_vertex, THREE.ShaderChunk.morphtarget_pars_vertex, THREE.ShaderChunk.skinning_pars_vertex, THREE.ShaderChunk.shadowmap_pars_vertex, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", THREE.ShaderChunk.map_vertex, THREE.ShaderChunk.lightmap_vertex, THREE.ShaderChunk.color_vertex, THREE.ShaderChunk.skinbase_vertex, "	#ifdef USE_ENVMAP", THREE.ShaderChunk.morphnormal_vertex, THREE.ShaderChunk.skinnormal_vertex, THREE.ShaderChunk.defaultnormal_vertex, "	#endif", THREE.ShaderChunk.morphtarget_vertex, THREE.ShaderChunk.skinning_vertex, THREE.ShaderChunk.default_vertex, THREE.ShaderChunk.logdepthbuf_vertex, THREE.ShaderChunk.worldpos_vertex, THREE.ShaderChunk.envmap_vertex, THREE.ShaderChunk.shadowmap_vertex, "}" ].join("\n"),
        fragmentShader: [ "uniform vec3 diffuse;", "uniform float opacity;", THREE.ShaderChunk.common, THREE.ShaderChunk.color_pars_fragment, THREE.ShaderChunk.map_pars_fragment, THREE.ShaderChunk.alphamap_pars_fragment, THREE.ShaderChunk.lightmap_pars_fragment, THREE.ShaderChunk.envmap_pars_fragment, THREE.ShaderChunk.fog_pars_fragment, THREE.ShaderChunk.shadowmap_pars_fragment, THREE.ShaderChunk.specularmap_pars_fragment, THREE.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	vec3 outgoingLight = vec3( 0.0 );", "	vec4 diffuseColor = vec4( diffuse, opacity );", THREE.ShaderChunk.logdepthbuf_fragment, THREE.ShaderChunk.map_fragment, THREE.ShaderChunk.color_fragment, THREE.ShaderChunk.alphamap_fragment, THREE.ShaderChunk.alphatest_fragment, THREE.ShaderChunk.specularmap_fragment, "	outgoingLight = diffuseColor.rgb;", THREE.ShaderChunk.lightmap_fragment, THREE.ShaderChunk.envmap_fragment, THREE.ShaderChunk.shadowmap_fragment, THREE.ShaderChunk.linear_to_gamma_fragment, THREE.ShaderChunk.fog_fragment, "	gl_FragColor = vec4( outgoingLight, diffuseColor.a );", "}" ].join("\n")
    },
    lambert: {
        uniforms: THREE.UniformsUtils.merge([ THREE.UniformsLib.common, THREE.UniformsLib.fog, THREE.UniformsLib.lights, THREE.UniformsLib.shadowmap, {
            emissive: {
                type: "c",
                value: new THREE.Color(0)
            },
            wrapRGB: {
                type: "v3",
                value: new THREE.Vector3(1, 1, 1)
            }
        } ]),
        vertexShader: [ "#define LAMBERT", "varying vec3 vLightFront;", "#ifdef DOUBLE_SIDED", "	varying vec3 vLightBack;", "#endif", THREE.ShaderChunk.common, THREE.ShaderChunk.map_pars_vertex, THREE.ShaderChunk.lightmap_pars_vertex, THREE.ShaderChunk.envmap_pars_vertex, THREE.ShaderChunk.lights_lambert_pars_vertex, THREE.ShaderChunk.color_pars_vertex, THREE.ShaderChunk.morphtarget_pars_vertex, THREE.ShaderChunk.skinning_pars_vertex, THREE.ShaderChunk.shadowmap_pars_vertex, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", THREE.ShaderChunk.map_vertex, THREE.ShaderChunk.lightmap_vertex, THREE.ShaderChunk.color_vertex, THREE.ShaderChunk.morphnormal_vertex, THREE.ShaderChunk.skinbase_vertex, THREE.ShaderChunk.skinnormal_vertex, THREE.ShaderChunk.defaultnormal_vertex, THREE.ShaderChunk.morphtarget_vertex, THREE.ShaderChunk.skinning_vertex, THREE.ShaderChunk.default_vertex, THREE.ShaderChunk.logdepthbuf_vertex, THREE.ShaderChunk.worldpos_vertex, THREE.ShaderChunk.envmap_vertex, THREE.ShaderChunk.lights_lambert_vertex, THREE.ShaderChunk.shadowmap_vertex, "}" ].join("\n"),
        fragmentShader: [ "uniform vec3 diffuse;", "uniform vec3 emissive;", "uniform float opacity;", "varying vec3 vLightFront;", "#ifdef DOUBLE_SIDED", "	varying vec3 vLightBack;", "#endif", THREE.ShaderChunk.common, THREE.ShaderChunk.color_pars_fragment, THREE.ShaderChunk.map_pars_fragment, THREE.ShaderChunk.alphamap_pars_fragment, THREE.ShaderChunk.lightmap_pars_fragment, THREE.ShaderChunk.envmap_pars_fragment, THREE.ShaderChunk.fog_pars_fragment, THREE.ShaderChunk.shadowmap_pars_fragment, THREE.ShaderChunk.specularmap_pars_fragment, THREE.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	vec3 outgoingLight = vec3( 0.0 );", "	vec4 diffuseColor = vec4( diffuse, opacity );", THREE.ShaderChunk.logdepthbuf_fragment, THREE.ShaderChunk.map_fragment, THREE.ShaderChunk.color_fragment, THREE.ShaderChunk.alphamap_fragment, THREE.ShaderChunk.alphatest_fragment, THREE.ShaderChunk.specularmap_fragment, "	#ifdef DOUBLE_SIDED", "		if ( gl_FrontFacing )", "			outgoingLight += diffuseColor.rgb * vLightFront + emissive;", "		else", "			outgoingLight += diffuseColor.rgb * vLightBack + emissive;", "	#else", "		outgoingLight += diffuseColor.rgb * vLightFront + emissive;", "	#endif", THREE.ShaderChunk.lightmap_fragment, THREE.ShaderChunk.envmap_fragment, THREE.ShaderChunk.shadowmap_fragment, THREE.ShaderChunk.linear_to_gamma_fragment, THREE.ShaderChunk.fog_fragment, "	gl_FragColor = vec4( outgoingLight, diffuseColor.a );", "}" ].join("\n")
    },
    phong: {
        uniforms: THREE.UniformsUtils.merge([ THREE.UniformsLib.common, THREE.UniformsLib.bump, THREE.UniformsLib.normalmap, THREE.UniformsLib.fog, THREE.UniformsLib.lights, THREE.UniformsLib.shadowmap, {
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
            },
            wrapRGB: {
                type: "v3",
                value: new THREE.Vector3(1, 1, 1)
            }
        } ]),
        vertexShader: [ "#define PHONG", "varying vec3 vViewPosition;", "#ifndef FLAT_SHADED", "	varying vec3 vNormal;", "#endif", THREE.ShaderChunk.common, THREE.ShaderChunk.map_pars_vertex, THREE.ShaderChunk.lightmap_pars_vertex, THREE.ShaderChunk.envmap_pars_vertex, THREE.ShaderChunk.lights_phong_pars_vertex, THREE.ShaderChunk.color_pars_vertex, THREE.ShaderChunk.morphtarget_pars_vertex, THREE.ShaderChunk.skinning_pars_vertex, THREE.ShaderChunk.shadowmap_pars_vertex, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", THREE.ShaderChunk.map_vertex, THREE.ShaderChunk.lightmap_vertex, THREE.ShaderChunk.color_vertex, THREE.ShaderChunk.morphnormal_vertex, THREE.ShaderChunk.skinbase_vertex, THREE.ShaderChunk.skinnormal_vertex, THREE.ShaderChunk.defaultnormal_vertex, "#ifndef FLAT_SHADED", "	vNormal = normalize( transformedNormal );", "#endif", THREE.ShaderChunk.morphtarget_vertex, THREE.ShaderChunk.skinning_vertex, THREE.ShaderChunk.default_vertex, THREE.ShaderChunk.logdepthbuf_vertex, "	vViewPosition = -mvPosition.xyz;", THREE.ShaderChunk.worldpos_vertex, THREE.ShaderChunk.envmap_vertex, THREE.ShaderChunk.lights_phong_vertex, THREE.ShaderChunk.shadowmap_vertex, "}" ].join("\n"),
        fragmentShader: [ "#define PHONG", "uniform vec3 diffuse;", "uniform vec3 emissive;", "uniform vec3 specular;", "uniform float shininess;", "uniform float opacity;", THREE.ShaderChunk.common, THREE.ShaderChunk.color_pars_fragment, THREE.ShaderChunk.map_pars_fragment, THREE.ShaderChunk.alphamap_pars_fragment, THREE.ShaderChunk.lightmap_pars_fragment, THREE.ShaderChunk.envmap_pars_fragment, THREE.ShaderChunk.fog_pars_fragment, THREE.ShaderChunk.lights_phong_pars_fragment, THREE.ShaderChunk.shadowmap_pars_fragment, THREE.ShaderChunk.bumpmap_pars_fragment, THREE.ShaderChunk.normalmap_pars_fragment, THREE.ShaderChunk.specularmap_pars_fragment, THREE.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	vec3 outgoingLight = vec3( 0.0 );", "	vec4 diffuseColor = vec4( diffuse, opacity );", THREE.ShaderChunk.logdepthbuf_fragment, THREE.ShaderChunk.map_fragment, THREE.ShaderChunk.color_fragment, THREE.ShaderChunk.alphamap_fragment, THREE.ShaderChunk.alphatest_fragment, THREE.ShaderChunk.specularmap_fragment, THREE.ShaderChunk.lights_phong_fragment, THREE.ShaderChunk.lightmap_fragment, THREE.ShaderChunk.envmap_fragment, THREE.ShaderChunk.shadowmap_fragment, THREE.ShaderChunk.linear_to_gamma_fragment, THREE.ShaderChunk.fog_fragment, "	gl_FragColor = vec4( outgoingLight, diffuseColor.a );", "}" ].join("\n")
    },
    particle_basic: {
        uniforms: THREE.UniformsUtils.merge([ THREE.UniformsLib.particle, THREE.UniformsLib.shadowmap ]),
        vertexShader: [ "uniform float size;", "uniform float scale;", THREE.ShaderChunk.common, THREE.ShaderChunk.color_pars_vertex, THREE.ShaderChunk.shadowmap_pars_vertex, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", THREE.ShaderChunk.color_vertex, "	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );", "	#ifdef USE_SIZEATTENUATION", "		gl_PointSize = size * ( scale / length( mvPosition.xyz ) );", "	#else", "		gl_PointSize = size;", "	#endif", "	gl_Position = projectionMatrix * mvPosition;", THREE.ShaderChunk.logdepthbuf_vertex, THREE.ShaderChunk.worldpos_vertex, THREE.ShaderChunk.shadowmap_vertex, "}" ].join("\n"),
        fragmentShader: [ "uniform vec3 psColor;", "uniform float opacity;", THREE.ShaderChunk.common, THREE.ShaderChunk.color_pars_fragment, THREE.ShaderChunk.map_particle_pars_fragment, THREE.ShaderChunk.fog_pars_fragment, THREE.ShaderChunk.shadowmap_pars_fragment, THREE.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	vec3 outgoingLight = vec3( 0.0 );", "	vec4 diffuseColor = vec4( psColor, opacity );", THREE.ShaderChunk.logdepthbuf_fragment, THREE.ShaderChunk.map_particle_fragment, THREE.ShaderChunk.color_fragment, THREE.ShaderChunk.alphatest_fragment, "	outgoingLight = diffuseColor.rgb;", THREE.ShaderChunk.shadowmap_fragment, THREE.ShaderChunk.fog_fragment, "	gl_FragColor = vec4( outgoingLight, diffuseColor.a );", "}" ].join("\n")
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
        vertexShader: [ THREE.ShaderChunk.common, THREE.ShaderChunk.morphtarget_pars_vertex, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", THREE.ShaderChunk.morphtarget_vertex, THREE.ShaderChunk.default_vertex, THREE.ShaderChunk.logdepthbuf_vertex, "}" ].join("\n"),
        fragmentShader: [ "uniform float mNear;", "uniform float mFar;", "uniform float opacity;", THREE.ShaderChunk.common, THREE.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", THREE.ShaderChunk.logdepthbuf_fragment, "	#ifdef USE_LOGDEPTHBUF_EXT", "		float depth = gl_FragDepthEXT / gl_FragCoord.w;", "	#else", "		float depth = gl_FragCoord.z / gl_FragCoord.w;", "	#endif", "	float color = 1.0 - smoothstep( mNear, mFar, depth );", "	gl_FragColor = vec4( vec3( color ), opacity );", "}" ].join("\n")
    },
    normal: {
        uniforms: {
            opacity: {
                type: "f",
                value: 1
            }
        },
        vertexShader: [ "varying vec3 vNormal;", THREE.ShaderChunk.common, THREE.ShaderChunk.morphtarget_pars_vertex, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", "	vNormal = normalize( normalMatrix * normal );", THREE.ShaderChunk.morphtarget_vertex, THREE.ShaderChunk.default_vertex, THREE.ShaderChunk.logdepthbuf_vertex, "}" ].join("\n"),
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
        vertexShader: [ THREE.ShaderChunk.common, THREE.ShaderChunk.morphtarget_pars_vertex, THREE.ShaderChunk.skinning_pars_vertex, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", THREE.ShaderChunk.skinbase_vertex, THREE.ShaderChunk.morphtarget_vertex, THREE.ShaderChunk.skinning_vertex, THREE.ShaderChunk.default_vertex, THREE.ShaderChunk.logdepthbuf_vertex, "}" ].join("\n"),
        fragmentShader: [ THREE.ShaderChunk.common, THREE.ShaderChunk.logdepthbuf_pars_fragment, "vec4 pack_depth( const in float depth ) {", "	const vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );", "	const vec4 bit_mask = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );", "	vec4 res = mod( depth * bit_shift * vec4( 255 ), vec4( 256 ) ) / vec4( 255 );", "	res -= res.xxyz * bit_mask;", "	return res;", "}", "void main() {", THREE.ShaderChunk.logdepthbuf_fragment, "	#ifdef USE_LOGDEPTHBUF_EXT", "		gl_FragData[ 0 ] = pack_depth( gl_FragDepthEXT );", "	#else", "		gl_FragData[ 0 ] = pack_depth( gl_FragCoord.z );", "	#endif", "}" ].join("\n")
    }
}, THREE.WebGLRenderer = function(parameters) {
    function createParticleBuffers(geometry) {
        geometry.__webglVertexBuffer = _gl.createBuffer(), geometry.__webglColorBuffer = _gl.createBuffer(), 
        _this.info.memory.geometries++;
    }
    function createLineBuffers(geometry) {
        geometry.__webglVertexBuffer = _gl.createBuffer(), geometry.__webglColorBuffer = _gl.createBuffer(), 
        geometry.__webglLineDistanceBuffer = _gl.createBuffer(), _this.info.memory.geometries++;
    }
    function createMeshBuffers(geometryGroup) {
        geometryGroup.__webglVertexBuffer = _gl.createBuffer(), geometryGroup.__webglNormalBuffer = _gl.createBuffer(), 
        geometryGroup.__webglTangentBuffer = _gl.createBuffer(), geometryGroup.__webglColorBuffer = _gl.createBuffer(), 
        geometryGroup.__webglUVBuffer = _gl.createBuffer(), geometryGroup.__webglUV2Buffer = _gl.createBuffer(), 
        geometryGroup.__webglSkinIndicesBuffer = _gl.createBuffer(), geometryGroup.__webglSkinWeightsBuffer = _gl.createBuffer(), 
        geometryGroup.__webglFaceBuffer = _gl.createBuffer(), geometryGroup.__webglLineBuffer = _gl.createBuffer();
        var numMorphTargets = geometryGroup.numMorphTargets;
        if (numMorphTargets) {
            geometryGroup.__webglMorphTargetsBuffers = [];
            for (var m = 0, ml = numMorphTargets; ml > m; m++) geometryGroup.__webglMorphTargetsBuffers.push(_gl.createBuffer());
        }
        var numMorphNormals = geometryGroup.numMorphNormals;
        if (numMorphNormals) {
            geometryGroup.__webglMorphNormalsBuffers = [];
            for (var m = 0, ml = numMorphNormals; ml > m; m++) geometryGroup.__webglMorphNormalsBuffers.push(_gl.createBuffer());
        }
        _this.info.memory.geometries++;
    }
    function initCustomAttributes(object) {
        var geometry = object.geometry, material = object.material, nvertices = geometry.vertices.length;
        if (material.attributes) {
            void 0 === geometry.__webglCustomAttributesList && (geometry.__webglCustomAttributesList = []);
            for (var name in material.attributes) {
                var attribute = material.attributes[name];
                if (!attribute.__webglInitialized || attribute.createUniqueBuffers) {
                    attribute.__webglInitialized = !0;
                    var size = 1;
                    "v2" === attribute.type ? size = 2 : "v3" === attribute.type ? size = 3 : "v4" === attribute.type ? size = 4 : "c" === attribute.type && (size = 3), 
                    attribute.size = size, attribute.array = new Float32Array(nvertices * size), attribute.buffer = _gl.createBuffer(), 
                    attribute.buffer.belongsToAttribute = name, attribute.needsUpdate = !0;
                }
                geometry.__webglCustomAttributesList.push(attribute);
            }
        }
    }
    function initParticleBuffers(geometry, object) {
        var nvertices = geometry.vertices.length;
        geometry.__vertexArray = new Float32Array(3 * nvertices), geometry.__colorArray = new Float32Array(3 * nvertices), 
        geometry.__webglParticleCount = nvertices, initCustomAttributes(object);
    }
    function initLineBuffers(geometry, object) {
        var nvertices = geometry.vertices.length;
        geometry.__vertexArray = new Float32Array(3 * nvertices), geometry.__colorArray = new Float32Array(3 * nvertices), 
        geometry.__lineDistanceArray = new Float32Array(1 * nvertices), geometry.__webglLineCount = nvertices, 
        initCustomAttributes(object);
    }
    function initMeshBuffers(geometryGroup, object) {
        var geometry = object.geometry, faces3 = geometryGroup.faces3, nvertices = 3 * faces3.length, ntris = 1 * faces3.length, nlines = 3 * faces3.length, material = getBufferMaterial(object, geometryGroup);
        geometryGroup.__vertexArray = new Float32Array(3 * nvertices), geometryGroup.__normalArray = new Float32Array(3 * nvertices), 
        geometryGroup.__colorArray = new Float32Array(3 * nvertices), geometryGroup.__uvArray = new Float32Array(2 * nvertices), 
        geometry.faceVertexUvs.length > 1 && (geometryGroup.__uv2Array = new Float32Array(2 * nvertices)), 
        geometry.hasTangents && (geometryGroup.__tangentArray = new Float32Array(4 * nvertices)), 
        object.geometry.skinWeights.length && object.geometry.skinIndices.length && (geometryGroup.__skinIndexArray = new Float32Array(4 * nvertices), 
        geometryGroup.__skinWeightArray = new Float32Array(4 * nvertices));
        var UintArray = null !== extensions.get("OES_element_index_uint") && ntris > 21845 ? Uint32Array : Uint16Array;
        geometryGroup.__typeArray = UintArray, geometryGroup.__faceArray = new UintArray(3 * ntris), 
        geometryGroup.__lineArray = new UintArray(2 * nlines);
        var numMorphTargets = geometryGroup.numMorphTargets;
        if (numMorphTargets) {
            geometryGroup.__morphTargetsArrays = [];
            for (var m = 0, ml = numMorphTargets; ml > m; m++) geometryGroup.__morphTargetsArrays.push(new Float32Array(3 * nvertices));
        }
        var numMorphNormals = geometryGroup.numMorphNormals;
        if (numMorphNormals) {
            geometryGroup.__morphNormalsArrays = [];
            for (var m = 0, ml = numMorphNormals; ml > m; m++) geometryGroup.__morphNormalsArrays.push(new Float32Array(3 * nvertices));
        }
        if (geometryGroup.__webglFaceCount = 3 * ntris, geometryGroup.__webglLineCount = 2 * nlines, 
        material.attributes) {
            void 0 === geometryGroup.__webglCustomAttributesList && (geometryGroup.__webglCustomAttributesList = []);
            for (var name in material.attributes) {
                var originalAttribute = material.attributes[name], attribute = {};
                for (var property in originalAttribute) attribute[property] = originalAttribute[property];
                if (!attribute.__webglInitialized || attribute.createUniqueBuffers) {
                    attribute.__webglInitialized = !0;
                    var size = 1;
                    "v2" === attribute.type ? size = 2 : "v3" === attribute.type ? size = 3 : "v4" === attribute.type ? size = 4 : "c" === attribute.type && (size = 3), 
                    attribute.size = size, attribute.array = new Float32Array(nvertices * size), attribute.buffer = _gl.createBuffer(), 
                    attribute.buffer.belongsToAttribute = name, originalAttribute.needsUpdate = !0, 
                    attribute.__original = originalAttribute;
                }
                geometryGroup.__webglCustomAttributesList.push(attribute);
            }
        }
        geometryGroup.__inittedArrays = !0;
    }
    function getBufferMaterial(object, geometryGroup) {
        return object.material instanceof THREE.MeshFaceMaterial ? object.material.materials[geometryGroup.materialIndex] : object.material;
    }
    function materialNeedsFaceNormals(material) {
        return material instanceof THREE.MeshPhongMaterial == !1 && material.shading === THREE.FlatShading;
    }
    function setParticleBuffers(geometry, hint, object) {
        var v, c, vertex, offset, color, i, il, ca, cal, value, customAttribute, vertices = geometry.vertices, vl = vertices.length, colors = geometry.colors, cl = colors.length, vertexArray = geometry.__vertexArray, colorArray = geometry.__colorArray, dirtyVertices = geometry.verticesNeedUpdate, dirtyColors = geometry.colorsNeedUpdate, customAttributes = geometry.__webglCustomAttributesList;
        if (dirtyVertices) {
            for (v = 0; vl > v; v++) vertex = vertices[v], offset = 3 * v, vertexArray[offset] = vertex.x, 
            vertexArray[offset + 1] = vertex.y, vertexArray[offset + 2] = vertex.z;
            _gl.bindBuffer(_gl.ARRAY_BUFFER, geometry.__webglVertexBuffer), _gl.bufferData(_gl.ARRAY_BUFFER, vertexArray, hint);
        }
        if (dirtyColors) {
            for (c = 0; cl > c; c++) color = colors[c], offset = 3 * c, colorArray[offset] = color.r, 
            colorArray[offset + 1] = color.g, colorArray[offset + 2] = color.b;
            _gl.bindBuffer(_gl.ARRAY_BUFFER, geometry.__webglColorBuffer), _gl.bufferData(_gl.ARRAY_BUFFER, colorArray, hint);
        }
        if (customAttributes) for (i = 0, il = customAttributes.length; il > i; i++) {
            if (customAttribute = customAttributes[i], customAttribute.needsUpdate && (void 0 === customAttribute.boundTo || "vertices" === customAttribute.boundTo)) if (cal = customAttribute.value.length, 
            offset = 0, 1 === customAttribute.size) for (ca = 0; cal > ca; ca++) customAttribute.array[ca] = customAttribute.value[ca]; else if (2 === customAttribute.size) for (ca = 0; cal > ca; ca++) value = customAttribute.value[ca], 
            customAttribute.array[offset] = value.x, customAttribute.array[offset + 1] = value.y, 
            offset += 2; else if (3 === customAttribute.size) if ("c" === customAttribute.type) for (ca = 0; cal > ca; ca++) value = customAttribute.value[ca], 
            customAttribute.array[offset] = value.r, customAttribute.array[offset + 1] = value.g, 
            customAttribute.array[offset + 2] = value.b, offset += 3; else for (ca = 0; cal > ca; ca++) value = customAttribute.value[ca], 
            customAttribute.array[offset] = value.x, customAttribute.array[offset + 1] = value.y, 
            customAttribute.array[offset + 2] = value.z, offset += 3; else if (4 === customAttribute.size) for (ca = 0; cal > ca; ca++) value = customAttribute.value[ca], 
            customAttribute.array[offset] = value.x, customAttribute.array[offset + 1] = value.y, 
            customAttribute.array[offset + 2] = value.z, customAttribute.array[offset + 3] = value.w, 
            offset += 4;
            _gl.bindBuffer(_gl.ARRAY_BUFFER, customAttribute.buffer), _gl.bufferData(_gl.ARRAY_BUFFER, customAttribute.array, hint), 
            customAttribute.needsUpdate = !1;
        }
    }
    function setLineBuffers(geometry, hint) {
        var v, c, d, vertex, offset, color, i, il, ca, cal, value, customAttribute, vertices = geometry.vertices, colors = geometry.colors, lineDistances = geometry.lineDistances, vl = vertices.length, cl = colors.length, dl = lineDistances.length, vertexArray = geometry.__vertexArray, colorArray = geometry.__colorArray, lineDistanceArray = geometry.__lineDistanceArray, dirtyVertices = geometry.verticesNeedUpdate, dirtyColors = geometry.colorsNeedUpdate, dirtyLineDistances = geometry.lineDistancesNeedUpdate, customAttributes = geometry.__webglCustomAttributesList;
        if (dirtyVertices) {
            for (v = 0; vl > v; v++) vertex = vertices[v], offset = 3 * v, vertexArray[offset] = vertex.x, 
            vertexArray[offset + 1] = vertex.y, vertexArray[offset + 2] = vertex.z;
            _gl.bindBuffer(_gl.ARRAY_BUFFER, geometry.__webglVertexBuffer), _gl.bufferData(_gl.ARRAY_BUFFER, vertexArray, hint);
        }
        if (dirtyColors) {
            for (c = 0; cl > c; c++) color = colors[c], offset = 3 * c, colorArray[offset] = color.r, 
            colorArray[offset + 1] = color.g, colorArray[offset + 2] = color.b;
            _gl.bindBuffer(_gl.ARRAY_BUFFER, geometry.__webglColorBuffer), _gl.bufferData(_gl.ARRAY_BUFFER, colorArray, hint);
        }
        if (dirtyLineDistances) {
            for (d = 0; dl > d; d++) lineDistanceArray[d] = lineDistances[d];
            _gl.bindBuffer(_gl.ARRAY_BUFFER, geometry.__webglLineDistanceBuffer), _gl.bufferData(_gl.ARRAY_BUFFER, lineDistanceArray, hint);
        }
        if (customAttributes) for (i = 0, il = customAttributes.length; il > i; i++) if (customAttribute = customAttributes[i], 
        customAttribute.needsUpdate && (void 0 === customAttribute.boundTo || "vertices" === customAttribute.boundTo)) {
            if (offset = 0, cal = customAttribute.value.length, 1 === customAttribute.size) for (ca = 0; cal > ca; ca++) customAttribute.array[ca] = customAttribute.value[ca]; else if (2 === customAttribute.size) for (ca = 0; cal > ca; ca++) value = customAttribute.value[ca], 
            customAttribute.array[offset] = value.x, customAttribute.array[offset + 1] = value.y, 
            offset += 2; else if (3 === customAttribute.size) if ("c" === customAttribute.type) for (ca = 0; cal > ca; ca++) value = customAttribute.value[ca], 
            customAttribute.array[offset] = value.r, customAttribute.array[offset + 1] = value.g, 
            customAttribute.array[offset + 2] = value.b, offset += 3; else for (ca = 0; cal > ca; ca++) value = customAttribute.value[ca], 
            customAttribute.array[offset] = value.x, customAttribute.array[offset + 1] = value.y, 
            customAttribute.array[offset + 2] = value.z, offset += 3; else if (4 === customAttribute.size) for (ca = 0; cal > ca; ca++) value = customAttribute.value[ca], 
            customAttribute.array[offset] = value.x, customAttribute.array[offset + 1] = value.y, 
            customAttribute.array[offset + 2] = value.z, customAttribute.array[offset + 3] = value.w, 
            offset += 4;
            _gl.bindBuffer(_gl.ARRAY_BUFFER, customAttribute.buffer), _gl.bufferData(_gl.ARRAY_BUFFER, customAttribute.array, hint), 
            customAttribute.needsUpdate = !1;
        }
    }
    function setMeshBuffers(geometryGroup, object, hint, dispose, material) {
        if (geometryGroup.__inittedArrays) {
            var f, fl, fi, face, vertexNormals, faceNormal, vertexColors, faceColor, vertexTangents, uv, uv2, v1, v2, v3, t1, t2, t3, n1, n2, n3, c1, c2, c3, sw1, sw2, sw3, si1, si2, si3, i, il, vn, uvi, uv2i, vk, vkl, vka, nka, chf, faceVertexNormals, value, customAttribute, needsFaceNormals = materialNeedsFaceNormals(material), vertexIndex = 0, offset = 0, offset_uv = 0, offset_uv2 = 0, offset_face = 0, offset_normal = 0, offset_tangent = 0, offset_line = 0, offset_color = 0, offset_skin = 0, offset_morphTarget = 0, offset_custom = 0, vertexArray = geometryGroup.__vertexArray, uvArray = geometryGroup.__uvArray, uv2Array = geometryGroup.__uv2Array, normalArray = geometryGroup.__normalArray, tangentArray = geometryGroup.__tangentArray, colorArray = geometryGroup.__colorArray, skinIndexArray = geometryGroup.__skinIndexArray, skinWeightArray = geometryGroup.__skinWeightArray, morphTargetsArrays = geometryGroup.__morphTargetsArrays, morphNormalsArrays = geometryGroup.__morphNormalsArrays, customAttributes = geometryGroup.__webglCustomAttributesList, faceArray = geometryGroup.__faceArray, lineArray = geometryGroup.__lineArray, geometry = object.geometry, dirtyVertices = geometry.verticesNeedUpdate, dirtyElements = geometry.elementsNeedUpdate, dirtyUvs = geometry.uvsNeedUpdate, dirtyNormals = geometry.normalsNeedUpdate, dirtyTangents = geometry.tangentsNeedUpdate, dirtyColors = geometry.colorsNeedUpdate, dirtyMorphTargets = geometry.morphTargetsNeedUpdate, vertices = geometry.vertices, chunk_faces3 = geometryGroup.faces3, obj_faces = geometry.faces, obj_uvs = geometry.faceVertexUvs[0], obj_uvs2 = geometry.faceVertexUvs[1], obj_skinIndices = geometry.skinIndices, obj_skinWeights = geometry.skinWeights, morphTargets = geometry.morphTargets, morphNormals = geometry.morphNormals;
            if (dirtyVertices) {
                for (f = 0, fl = chunk_faces3.length; fl > f; f++) face = obj_faces[chunk_faces3[f]], 
                v1 = vertices[face.a], v2 = vertices[face.b], v3 = vertices[face.c], vertexArray[offset] = v1.x, 
                vertexArray[offset + 1] = v1.y, vertexArray[offset + 2] = v1.z, vertexArray[offset + 3] = v2.x, 
                vertexArray[offset + 4] = v2.y, vertexArray[offset + 5] = v2.z, vertexArray[offset + 6] = v3.x, 
                vertexArray[offset + 7] = v3.y, vertexArray[offset + 8] = v3.z, offset += 9;
                _gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglVertexBuffer), _gl.bufferData(_gl.ARRAY_BUFFER, vertexArray, hint);
            }
            if (dirtyMorphTargets) for (vk = 0, vkl = morphTargets.length; vkl > vk; vk++) {
                for (offset_morphTarget = 0, f = 0, fl = chunk_faces3.length; fl > f; f++) chf = chunk_faces3[f], 
                face = obj_faces[chf], v1 = morphTargets[vk].vertices[face.a], v2 = morphTargets[vk].vertices[face.b], 
                v3 = morphTargets[vk].vertices[face.c], vka = morphTargetsArrays[vk], vka[offset_morphTarget] = v1.x, 
                vka[offset_morphTarget + 1] = v1.y, vka[offset_morphTarget + 2] = v1.z, vka[offset_morphTarget + 3] = v2.x, 
                vka[offset_morphTarget + 4] = v2.y, vka[offset_morphTarget + 5] = v2.z, vka[offset_morphTarget + 6] = v3.x, 
                vka[offset_morphTarget + 7] = v3.y, vka[offset_morphTarget + 8] = v3.z, material.morphNormals && (needsFaceNormals ? (n1 = morphNormals[vk].faceNormals[chf], 
                n2 = n1, n3 = n1) : (faceVertexNormals = morphNormals[vk].vertexNormals[chf], n1 = faceVertexNormals.a, 
                n2 = faceVertexNormals.b, n3 = faceVertexNormals.c), nka = morphNormalsArrays[vk], 
                nka[offset_morphTarget] = n1.x, nka[offset_morphTarget + 1] = n1.y, nka[offset_morphTarget + 2] = n1.z, 
                nka[offset_morphTarget + 3] = n2.x, nka[offset_morphTarget + 4] = n2.y, nka[offset_morphTarget + 5] = n2.z, 
                nka[offset_morphTarget + 6] = n3.x, nka[offset_morphTarget + 7] = n3.y, nka[offset_morphTarget + 8] = n3.z), 
                offset_morphTarget += 9;
                _gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglMorphTargetsBuffers[vk]), 
                _gl.bufferData(_gl.ARRAY_BUFFER, morphTargetsArrays[vk], hint), material.morphNormals && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglMorphNormalsBuffers[vk]), 
                _gl.bufferData(_gl.ARRAY_BUFFER, morphNormalsArrays[vk], hint));
            }
            if (obj_skinWeights.length) {
                for (f = 0, fl = chunk_faces3.length; fl > f; f++) face = obj_faces[chunk_faces3[f]], 
                sw1 = obj_skinWeights[face.a], sw2 = obj_skinWeights[face.b], sw3 = obj_skinWeights[face.c], 
                skinWeightArray[offset_skin] = sw1.x, skinWeightArray[offset_skin + 1] = sw1.y, 
                skinWeightArray[offset_skin + 2] = sw1.z, skinWeightArray[offset_skin + 3] = sw1.w, 
                skinWeightArray[offset_skin + 4] = sw2.x, skinWeightArray[offset_skin + 5] = sw2.y, 
                skinWeightArray[offset_skin + 6] = sw2.z, skinWeightArray[offset_skin + 7] = sw2.w, 
                skinWeightArray[offset_skin + 8] = sw3.x, skinWeightArray[offset_skin + 9] = sw3.y, 
                skinWeightArray[offset_skin + 10] = sw3.z, skinWeightArray[offset_skin + 11] = sw3.w, 
                si1 = obj_skinIndices[face.a], si2 = obj_skinIndices[face.b], si3 = obj_skinIndices[face.c], 
                skinIndexArray[offset_skin] = si1.x, skinIndexArray[offset_skin + 1] = si1.y, skinIndexArray[offset_skin + 2] = si1.z, 
                skinIndexArray[offset_skin + 3] = si1.w, skinIndexArray[offset_skin + 4] = si2.x, 
                skinIndexArray[offset_skin + 5] = si2.y, skinIndexArray[offset_skin + 6] = si2.z, 
                skinIndexArray[offset_skin + 7] = si2.w, skinIndexArray[offset_skin + 8] = si3.x, 
                skinIndexArray[offset_skin + 9] = si3.y, skinIndexArray[offset_skin + 10] = si3.z, 
                skinIndexArray[offset_skin + 11] = si3.w, offset_skin += 12;
                offset_skin > 0 && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglSkinIndicesBuffer), 
                _gl.bufferData(_gl.ARRAY_BUFFER, skinIndexArray, hint), _gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglSkinWeightsBuffer), 
                _gl.bufferData(_gl.ARRAY_BUFFER, skinWeightArray, hint));
            }
            if (dirtyColors) {
                for (f = 0, fl = chunk_faces3.length; fl > f; f++) face = obj_faces[chunk_faces3[f]], 
                vertexColors = face.vertexColors, faceColor = face.color, 3 === vertexColors.length && material.vertexColors === THREE.VertexColors ? (c1 = vertexColors[0], 
                c2 = vertexColors[1], c3 = vertexColors[2]) : (c1 = faceColor, c2 = faceColor, c3 = faceColor), 
                colorArray[offset_color] = c1.r, colorArray[offset_color + 1] = c1.g, colorArray[offset_color + 2] = c1.b, 
                colorArray[offset_color + 3] = c2.r, colorArray[offset_color + 4] = c2.g, colorArray[offset_color + 5] = c2.b, 
                colorArray[offset_color + 6] = c3.r, colorArray[offset_color + 7] = c3.g, colorArray[offset_color + 8] = c3.b, 
                offset_color += 9;
                offset_color > 0 && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglColorBuffer), 
                _gl.bufferData(_gl.ARRAY_BUFFER, colorArray, hint));
            }
            if (dirtyTangents && geometry.hasTangents) {
                for (f = 0, fl = chunk_faces3.length; fl > f; f++) face = obj_faces[chunk_faces3[f]], 
                vertexTangents = face.vertexTangents, t1 = vertexTangents[0], t2 = vertexTangents[1], 
                t3 = vertexTangents[2], tangentArray[offset_tangent] = t1.x, tangentArray[offset_tangent + 1] = t1.y, 
                tangentArray[offset_tangent + 2] = t1.z, tangentArray[offset_tangent + 3] = t1.w, 
                tangentArray[offset_tangent + 4] = t2.x, tangentArray[offset_tangent + 5] = t2.y, 
                tangentArray[offset_tangent + 6] = t2.z, tangentArray[offset_tangent + 7] = t2.w, 
                tangentArray[offset_tangent + 8] = t3.x, tangentArray[offset_tangent + 9] = t3.y, 
                tangentArray[offset_tangent + 10] = t3.z, tangentArray[offset_tangent + 11] = t3.w, 
                offset_tangent += 12;
                _gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglTangentBuffer), _gl.bufferData(_gl.ARRAY_BUFFER, tangentArray, hint);
            }
            if (dirtyNormals) {
                for (f = 0, fl = chunk_faces3.length; fl > f; f++) if (face = obj_faces[chunk_faces3[f]], 
                vertexNormals = face.vertexNormals, faceNormal = face.normal, 3 === vertexNormals.length && needsFaceNormals === !1) for (i = 0; 3 > i; i++) vn = vertexNormals[i], 
                normalArray[offset_normal] = vn.x, normalArray[offset_normal + 1] = vn.y, normalArray[offset_normal + 2] = vn.z, 
                offset_normal += 3; else for (i = 0; 3 > i; i++) normalArray[offset_normal] = faceNormal.x, 
                normalArray[offset_normal + 1] = faceNormal.y, normalArray[offset_normal + 2] = faceNormal.z, 
                offset_normal += 3;
                _gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglNormalBuffer), _gl.bufferData(_gl.ARRAY_BUFFER, normalArray, hint);
            }
            if (dirtyUvs && obj_uvs) {
                for (f = 0, fl = chunk_faces3.length; fl > f; f++) if (fi = chunk_faces3[f], uv = obj_uvs[fi], 
                void 0 !== uv) for (i = 0; 3 > i; i++) uvi = uv[i], uvArray[offset_uv] = uvi.x, 
                uvArray[offset_uv + 1] = uvi.y, offset_uv += 2;
                offset_uv > 0 && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglUVBuffer), 
                _gl.bufferData(_gl.ARRAY_BUFFER, uvArray, hint));
            }
            if (dirtyUvs && obj_uvs2) {
                for (f = 0, fl = chunk_faces3.length; fl > f; f++) if (fi = chunk_faces3[f], uv2 = obj_uvs2[fi], 
                void 0 !== uv2) for (i = 0; 3 > i; i++) uv2i = uv2[i], uv2Array[offset_uv2] = uv2i.x, 
                uv2Array[offset_uv2 + 1] = uv2i.y, offset_uv2 += 2;
                offset_uv2 > 0 && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglUV2Buffer), 
                _gl.bufferData(_gl.ARRAY_BUFFER, uv2Array, hint));
            }
            if (dirtyElements) {
                for (f = 0, fl = chunk_faces3.length; fl > f; f++) faceArray[offset_face] = vertexIndex, 
                faceArray[offset_face + 1] = vertexIndex + 1, faceArray[offset_face + 2] = vertexIndex + 2, 
                offset_face += 3, lineArray[offset_line] = vertexIndex, lineArray[offset_line + 1] = vertexIndex + 1, 
                lineArray[offset_line + 2] = vertexIndex, lineArray[offset_line + 3] = vertexIndex + 2, 
                lineArray[offset_line + 4] = vertexIndex + 1, lineArray[offset_line + 5] = vertexIndex + 2, 
                offset_line += 6, vertexIndex += 3;
                _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, geometryGroup.__webglFaceBuffer), _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, faceArray, hint), 
                _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, geometryGroup.__webglLineBuffer), _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, lineArray, hint);
            }
            if (customAttributes) for (i = 0, il = customAttributes.length; il > i; i++) if (customAttribute = customAttributes[i], 
            customAttribute.__original.needsUpdate) {
                if (offset_custom = 0, 1 === customAttribute.size) {
                    if (void 0 === customAttribute.boundTo || "vertices" === customAttribute.boundTo) for (f = 0, 
                    fl = chunk_faces3.length; fl > f; f++) face = obj_faces[chunk_faces3[f]], customAttribute.array[offset_custom] = customAttribute.value[face.a], 
                    customAttribute.array[offset_custom + 1] = customAttribute.value[face.b], customAttribute.array[offset_custom + 2] = customAttribute.value[face.c], 
                    offset_custom += 3; else if ("faces" === customAttribute.boundTo) for (f = 0, fl = chunk_faces3.length; fl > f; f++) value = customAttribute.value[chunk_faces3[f]], 
                    customAttribute.array[offset_custom] = value, customAttribute.array[offset_custom + 1] = value, 
                    customAttribute.array[offset_custom + 2] = value, offset_custom += 3;
                } else if (2 === customAttribute.size) {
                    if (void 0 === customAttribute.boundTo || "vertices" === customAttribute.boundTo) for (f = 0, 
                    fl = chunk_faces3.length; fl > f; f++) face = obj_faces[chunk_faces3[f]], v1 = customAttribute.value[face.a], 
                    v2 = customAttribute.value[face.b], v3 = customAttribute.value[face.c], customAttribute.array[offset_custom] = v1.x, 
                    customAttribute.array[offset_custom + 1] = v1.y, customAttribute.array[offset_custom + 2] = v2.x, 
                    customAttribute.array[offset_custom + 3] = v2.y, customAttribute.array[offset_custom + 4] = v3.x, 
                    customAttribute.array[offset_custom + 5] = v3.y, offset_custom += 6; else if ("faces" === customAttribute.boundTo) for (f = 0, 
                    fl = chunk_faces3.length; fl > f; f++) value = customAttribute.value[chunk_faces3[f]], 
                    v1 = value, v2 = value, v3 = value, customAttribute.array[offset_custom] = v1.x, 
                    customAttribute.array[offset_custom + 1] = v1.y, customAttribute.array[offset_custom + 2] = v2.x, 
                    customAttribute.array[offset_custom + 3] = v2.y, customAttribute.array[offset_custom + 4] = v3.x, 
                    customAttribute.array[offset_custom + 5] = v3.y, offset_custom += 6;
                } else if (3 === customAttribute.size) {
                    var pp;
                    if (pp = "c" === customAttribute.type ? [ "r", "g", "b" ] : [ "x", "y", "z" ], void 0 === customAttribute.boundTo || "vertices" === customAttribute.boundTo) for (f = 0, 
                    fl = chunk_faces3.length; fl > f; f++) face = obj_faces[chunk_faces3[f]], v1 = customAttribute.value[face.a], 
                    v2 = customAttribute.value[face.b], v3 = customAttribute.value[face.c], customAttribute.array[offset_custom] = v1[pp[0]], 
                    customAttribute.array[offset_custom + 1] = v1[pp[1]], customAttribute.array[offset_custom + 2] = v1[pp[2]], 
                    customAttribute.array[offset_custom + 3] = v2[pp[0]], customAttribute.array[offset_custom + 4] = v2[pp[1]], 
                    customAttribute.array[offset_custom + 5] = v2[pp[2]], customAttribute.array[offset_custom + 6] = v3[pp[0]], 
                    customAttribute.array[offset_custom + 7] = v3[pp[1]], customAttribute.array[offset_custom + 8] = v3[pp[2]], 
                    offset_custom += 9; else if ("faces" === customAttribute.boundTo) for (f = 0, fl = chunk_faces3.length; fl > f; f++) value = customAttribute.value[chunk_faces3[f]], 
                    v1 = value, v2 = value, v3 = value, customAttribute.array[offset_custom] = v1[pp[0]], 
                    customAttribute.array[offset_custom + 1] = v1[pp[1]], customAttribute.array[offset_custom + 2] = v1[pp[2]], 
                    customAttribute.array[offset_custom + 3] = v2[pp[0]], customAttribute.array[offset_custom + 4] = v2[pp[1]], 
                    customAttribute.array[offset_custom + 5] = v2[pp[2]], customAttribute.array[offset_custom + 6] = v3[pp[0]], 
                    customAttribute.array[offset_custom + 7] = v3[pp[1]], customAttribute.array[offset_custom + 8] = v3[pp[2]], 
                    offset_custom += 9; else if ("faceVertices" === customAttribute.boundTo) for (f = 0, 
                    fl = chunk_faces3.length; fl > f; f++) value = customAttribute.value[chunk_faces3[f]], 
                    v1 = value[0], v2 = value[1], v3 = value[2], customAttribute.array[offset_custom] = v1[pp[0]], 
                    customAttribute.array[offset_custom + 1] = v1[pp[1]], customAttribute.array[offset_custom + 2] = v1[pp[2]], 
                    customAttribute.array[offset_custom + 3] = v2[pp[0]], customAttribute.array[offset_custom + 4] = v2[pp[1]], 
                    customAttribute.array[offset_custom + 5] = v2[pp[2]], customAttribute.array[offset_custom + 6] = v3[pp[0]], 
                    customAttribute.array[offset_custom + 7] = v3[pp[1]], customAttribute.array[offset_custom + 8] = v3[pp[2]], 
                    offset_custom += 9;
                } else if (4 === customAttribute.size) if (void 0 === customAttribute.boundTo || "vertices" === customAttribute.boundTo) for (f = 0, 
                fl = chunk_faces3.length; fl > f; f++) face = obj_faces[chunk_faces3[f]], v1 = customAttribute.value[face.a], 
                v2 = customAttribute.value[face.b], v3 = customAttribute.value[face.c], customAttribute.array[offset_custom] = v1.x, 
                customAttribute.array[offset_custom + 1] = v1.y, customAttribute.array[offset_custom + 2] = v1.z, 
                customAttribute.array[offset_custom + 3] = v1.w, customAttribute.array[offset_custom + 4] = v2.x, 
                customAttribute.array[offset_custom + 5] = v2.y, customAttribute.array[offset_custom + 6] = v2.z, 
                customAttribute.array[offset_custom + 7] = v2.w, customAttribute.array[offset_custom + 8] = v3.x, 
                customAttribute.array[offset_custom + 9] = v3.y, customAttribute.array[offset_custom + 10] = v3.z, 
                customAttribute.array[offset_custom + 11] = v3.w, offset_custom += 12; else if ("faces" === customAttribute.boundTo) for (f = 0, 
                fl = chunk_faces3.length; fl > f; f++) value = customAttribute.value[chunk_faces3[f]], 
                v1 = value, v2 = value, v3 = value, customAttribute.array[offset_custom] = v1.x, 
                customAttribute.array[offset_custom + 1] = v1.y, customAttribute.array[offset_custom + 2] = v1.z, 
                customAttribute.array[offset_custom + 3] = v1.w, customAttribute.array[offset_custom + 4] = v2.x, 
                customAttribute.array[offset_custom + 5] = v2.y, customAttribute.array[offset_custom + 6] = v2.z, 
                customAttribute.array[offset_custom + 7] = v2.w, customAttribute.array[offset_custom + 8] = v3.x, 
                customAttribute.array[offset_custom + 9] = v3.y, customAttribute.array[offset_custom + 10] = v3.z, 
                customAttribute.array[offset_custom + 11] = v3.w, offset_custom += 12; else if ("faceVertices" === customAttribute.boundTo) for (f = 0, 
                fl = chunk_faces3.length; fl > f; f++) value = customAttribute.value[chunk_faces3[f]], 
                v1 = value[0], v2 = value[1], v3 = value[2], customAttribute.array[offset_custom] = v1.x, 
                customAttribute.array[offset_custom + 1] = v1.y, customAttribute.array[offset_custom + 2] = v1.z, 
                customAttribute.array[offset_custom + 3] = v1.w, customAttribute.array[offset_custom + 4] = v2.x, 
                customAttribute.array[offset_custom + 5] = v2.y, customAttribute.array[offset_custom + 6] = v2.z, 
                customAttribute.array[offset_custom + 7] = v2.w, customAttribute.array[offset_custom + 8] = v3.x, 
                customAttribute.array[offset_custom + 9] = v3.y, customAttribute.array[offset_custom + 10] = v3.z, 
                customAttribute.array[offset_custom + 11] = v3.w, offset_custom += 12;
                _gl.bindBuffer(_gl.ARRAY_BUFFER, customAttribute.buffer), _gl.bufferData(_gl.ARRAY_BUFFER, customAttribute.array, hint);
            }
            dispose && (delete geometryGroup.__inittedArrays, delete geometryGroup.__colorArray, 
            delete geometryGroup.__normalArray, delete geometryGroup.__tangentArray, delete geometryGroup.__uvArray, 
            delete geometryGroup.__uv2Array, delete geometryGroup.__faceArray, delete geometryGroup.__vertexArray, 
            delete geometryGroup.__lineArray, delete geometryGroup.__skinIndexArray, delete geometryGroup.__skinWeightArray);
        }
    }
    function setupVertexAttributes(material, program, geometry, startIndex) {
        for (var geometryAttributes = geometry.attributes, programAttributes = program.attributes, programAttributesKeys = program.attributesKeys, i = 0, l = programAttributesKeys.length; l > i; i++) {
            var key = programAttributesKeys[i], programAttribute = programAttributes[key];
            if (programAttribute >= 0) {
                var geometryAttribute = geometryAttributes[key];
                if (void 0 !== geometryAttribute) {
                    var size = geometryAttribute.itemSize;
                    _gl.bindBuffer(_gl.ARRAY_BUFFER, geometryAttribute.buffer), state.enableAttribute(programAttribute), 
                    _gl.vertexAttribPointer(programAttribute, size, _gl.FLOAT, !1, 0, startIndex * size * 4);
                } else void 0 !== material.defaultAttributeValues && (2 === material.defaultAttributeValues[key].length ? _gl.vertexAttrib2fv(programAttribute, material.defaultAttributeValues[key]) : 3 === material.defaultAttributeValues[key].length && _gl.vertexAttrib3fv(programAttribute, material.defaultAttributeValues[key]));
            }
        }
        state.disableUnusedAttributes();
    }
    function setupMorphTargets(material, geometryGroup, object) {
        var attributes = material.program.attributes;
        if (-1 !== object.morphTargetBase && attributes.position >= 0 ? (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglMorphTargetsBuffers[object.morphTargetBase]), 
        state.enableAttribute(attributes.position), _gl.vertexAttribPointer(attributes.position, 3, _gl.FLOAT, !1, 0, 0)) : attributes.position >= 0 && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglVertexBuffer), 
        state.enableAttribute(attributes.position), _gl.vertexAttribPointer(attributes.position, 3, _gl.FLOAT, !1, 0, 0)), 
        object.morphTargetForcedOrder.length) for (var attribute, m = 0, order = object.morphTargetForcedOrder, influences = object.morphTargetInfluences; m < material.numSupportedMorphTargets && m < order.length; ) attribute = attributes["morphTarget" + m], 
        attribute >= 0 && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglMorphTargetsBuffers[order[m]]), 
        state.enableAttribute(attribute), _gl.vertexAttribPointer(attribute, 3, _gl.FLOAT, !1, 0, 0)), 
        attribute = attributes["morphNormal" + m], attribute >= 0 && material.morphNormals && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglMorphNormalsBuffers[order[m]]), 
        state.enableAttribute(attribute), _gl.vertexAttribPointer(attribute, 3, _gl.FLOAT, !1, 0, 0)), 
        object.__webglMorphTargetInfluences[m] = influences[order[m]], m++; else {
            var activeInfluenceIndices = [], influences = object.morphTargetInfluences, morphTargets = object.geometry.morphTargets;
            influences.length > morphTargets.length && (console.warn("THREE.WebGLRenderer: Influences array is bigger than morphTargets array."), 
            influences.length = morphTargets.length);
            for (var i = 0, il = influences.length; il > i; i++) {
                var influence = influences[i];
                activeInfluenceIndices.push([ influence, i ]);
            }
            activeInfluenceIndices.length > material.numSupportedMorphTargets ? (activeInfluenceIndices.sort(numericalSort), 
            activeInfluenceIndices.length = material.numSupportedMorphTargets) : activeInfluenceIndices.length > material.numSupportedMorphNormals ? activeInfluenceIndices.sort(numericalSort) : 0 === activeInfluenceIndices.length && activeInfluenceIndices.push([ 0, 0 ]);
            for (var attribute, m = 0, ml = material.numSupportedMorphTargets; ml > m; m++) if (activeInfluenceIndices[m]) {
                var influenceIndex = activeInfluenceIndices[m][1];
                attribute = attributes["morphTarget" + m], attribute >= 0 && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglMorphTargetsBuffers[influenceIndex]), 
                state.enableAttribute(attribute), _gl.vertexAttribPointer(attribute, 3, _gl.FLOAT, !1, 0, 0)), 
                attribute = attributes["morphNormal" + m], attribute >= 0 && material.morphNormals && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglMorphNormalsBuffers[influenceIndex]), 
                state.enableAttribute(attribute), _gl.vertexAttribPointer(attribute, 3, _gl.FLOAT, !1, 0, 0)), 
                object.__webglMorphTargetInfluences[m] = influences[influenceIndex];
            } else object.__webglMorphTargetInfluences[m] = 0;
        }
        null !== material.program.uniforms.morphTargetInfluences && _gl.uniform1fv(material.program.uniforms.morphTargetInfluences, object.__webglMorphTargetInfluences);
    }
    function painterSortStable(a, b) {
        return a.object.renderOrder !== b.object.renderOrder ? a.object.renderOrder - b.object.renderOrder : a.material.id !== b.material.id ? a.material.id - b.material.id : a.z !== b.z ? a.z - b.z : a.id - b.id;
    }
    function reversePainterSortStable(a, b) {
        return a.object.renderOrder !== b.object.renderOrder ? a.object.renderOrder - b.object.renderOrder : a.z !== b.z ? b.z - a.z : a.id - b.id;
    }
    function numericalSort(a, b) {
        return b[0] - a[0];
    }
    function projectObject(object) {
        if (object.visible !== !1) {
            if (object instanceof THREE.Scene || object instanceof THREE.Group) ; else if (initObject(object), 
            object instanceof THREE.Light) lights.push(object); else if (object instanceof THREE.Sprite) sprites.push(object); else if (object instanceof THREE.LensFlare) lensFlares.push(object); else {
                var webglObjects = _webglObjects[object.id];
                if (webglObjects && (object.frustumCulled === !1 || _frustum.intersectsObject(object) === !0)) for (var i = 0, l = webglObjects.length; l > i; i++) {
                    var webglObject = webglObjects[i];
                    unrollBufferMaterial(webglObject), webglObject.render = !0, _this.sortObjects === !0 && (_vector3.setFromMatrixPosition(object.matrixWorld), 
                    _vector3.applyProjection(_projScreenMatrix), webglObject.z = _vector3.z);
                }
            }
            for (var i = 0, l = object.children.length; l > i; i++) projectObject(object.children[i]);
        }
    }
    function renderObjects(renderList, camera, lights, fog, overrideMaterial) {
        for (var material, i = 0, l = renderList.length; l > i; i++) {
            var webglObject = renderList[i], object = webglObject.object, buffer = webglObject.buffer;
            if (setupMatrices(object, camera), overrideMaterial) material = overrideMaterial; else {
                if (material = webglObject.material, !material) continue;
                setMaterial(material);
            }
            _this.setMaterialFaces(material), buffer instanceof THREE.BufferGeometry ? _this.renderBufferDirect(camera, lights, fog, material, buffer, object) : _this.renderBuffer(camera, lights, fog, material, buffer, object);
        }
    }
    function renderObjectsImmediate(renderList, materialType, camera, lights, fog, overrideMaterial) {
        for (var material, i = 0, l = renderList.length; l > i; i++) {
            var webglObject = renderList[i], object = webglObject.object;
            if (object.visible) {
                if (overrideMaterial) material = overrideMaterial; else {
                    if (material = webglObject[materialType], !material) continue;
                    setMaterial(material);
                }
                _this.renderImmediateObject(camera, lights, fog, material, object);
            }
        }
    }
    function unrollImmediateBufferMaterial(globject) {
        var object = globject.object, material = object.material;
        material.transparent ? (globject.transparent = material, globject.opaque = null) : (globject.opaque = material, 
        globject.transparent = null);
    }
    function unrollBufferMaterial(globject) {
        var object = globject.object, buffer = globject.buffer, geometry = object.geometry, material = object.material;
        if (material instanceof THREE.MeshFaceMaterial) {
            var materialIndex = geometry instanceof THREE.BufferGeometry ? 0 : buffer.materialIndex;
            material = material.materials[materialIndex], globject.material = material, material.transparent ? transparentObjects.push(globject) : opaqueObjects.push(globject);
        } else material && (globject.material = material, material.transparent ? transparentObjects.push(globject) : opaqueObjects.push(globject));
    }
    function initObject(object) {
        void 0 === object.__webglInit && (object.__webglInit = !0, object._modelViewMatrix = new THREE.Matrix4(), 
        object._normalMatrix = new THREE.Matrix3(), object.addEventListener("removed", onObjectRemoved));
        var geometry = object.geometry;
        if (void 0 === geometry || void 0 === geometry.__webglInit && (geometry.__webglInit = !0, 
        geometry.addEventListener("dispose", onGeometryDispose), geometry instanceof THREE.BufferGeometry ? _this.info.memory.geometries++ : object instanceof THREE.Mesh ? initGeometryGroups(object, geometry) : object instanceof THREE.Line ? void 0 === geometry.__webglVertexBuffer && (createLineBuffers(geometry), 
        initLineBuffers(geometry, object), geometry.verticesNeedUpdate = !0, geometry.colorsNeedUpdate = !0, 
        geometry.lineDistancesNeedUpdate = !0) : object instanceof THREE.PointCloud && void 0 === geometry.__webglVertexBuffer && (createParticleBuffers(geometry), 
        initParticleBuffers(geometry, object), geometry.verticesNeedUpdate = !0, geometry.colorsNeedUpdate = !0)), 
        void 0 === object.__webglActive) if (object.__webglActive = !0, object instanceof THREE.Mesh) {
            if (geometry instanceof THREE.BufferGeometry) addBuffer(_webglObjects, geometry, object); else if (geometry instanceof THREE.Geometry) for (var geometryGroupsList = geometryGroups[geometry.id], i = 0, l = geometryGroupsList.length; l > i; i++) addBuffer(_webglObjects, geometryGroupsList[i], object);
        } else object instanceof THREE.Line || object instanceof THREE.PointCloud ? addBuffer(_webglObjects, geometry, object) : (object instanceof THREE.ImmediateRenderObject || object.immediateRenderCallback) && addBufferImmediate(_webglObjectsImmediate, object);
    }
    function makeGroups(geometry, usesFaceMaterial) {
        for (var groupHash, group, maxVerticesInGroup = extensions.get("OES_element_index_uint") ? 4294967296 : 65535, hash_map = {}, numMorphTargets = geometry.morphTargets.length, numMorphNormals = geometry.morphNormals.length, groups = {}, groupsList = [], f = 0, fl = geometry.faces.length; fl > f; f++) {
            var face = geometry.faces[f], materialIndex = usesFaceMaterial ? face.materialIndex : 0;
            materialIndex in hash_map || (hash_map[materialIndex] = {
                hash: materialIndex,
                counter: 0
            }), groupHash = hash_map[materialIndex].hash + "_" + hash_map[materialIndex].counter, 
            groupHash in groups || (group = {
                id: geometryGroupCounter++,
                faces3: [],
                materialIndex: materialIndex,
                vertices: 0,
                numMorphTargets: numMorphTargets,
                numMorphNormals: numMorphNormals
            }, groups[groupHash] = group, groupsList.push(group)), groups[groupHash].vertices + 3 > maxVerticesInGroup && (hash_map[materialIndex].counter += 1, 
            groupHash = hash_map[materialIndex].hash + "_" + hash_map[materialIndex].counter, 
            groupHash in groups || (group = {
                id: geometryGroupCounter++,
                faces3: [],
                materialIndex: materialIndex,
                vertices: 0,
                numMorphTargets: numMorphTargets,
                numMorphNormals: numMorphNormals
            }, groups[groupHash] = group, groupsList.push(group))), groups[groupHash].faces3.push(f), 
            groups[groupHash].vertices += 3;
        }
        return groupsList;
    }
    function initGeometryGroups(object, geometry) {
        var material = object.material, addBuffers = !1;
        (void 0 === geometryGroups[geometry.id] || geometry.groupsNeedUpdate === !0) && (delete _webglObjects[object.id], 
        geometryGroups[geometry.id] = makeGroups(geometry, material instanceof THREE.MeshFaceMaterial), 
        geometry.groupsNeedUpdate = !1);
        for (var geometryGroupsList = geometryGroups[geometry.id], i = 0, il = geometryGroupsList.length; il > i; i++) {
            var geometryGroup = geometryGroupsList[i];
            void 0 === geometryGroup.__webglVertexBuffer ? (createMeshBuffers(geometryGroup), 
            initMeshBuffers(geometryGroup, object), geometry.verticesNeedUpdate = !0, geometry.morphTargetsNeedUpdate = !0, 
            geometry.elementsNeedUpdate = !0, geometry.uvsNeedUpdate = !0, geometry.normalsNeedUpdate = !0, 
            geometry.tangentsNeedUpdate = !0, geometry.colorsNeedUpdate = !0, addBuffers = !0) : addBuffers = !1, 
            (addBuffers || void 0 === object.__webglActive) && addBuffer(_webglObjects, geometryGroup, object);
        }
        object.__webglActive = !0;
    }
    function addBuffer(objlist, buffer, object) {
        var id = object.id;
        objlist[id] = objlist[id] || [], objlist[id].push({
            id: id,
            buffer: buffer,
            object: object,
            material: null,
            z: 0
        });
    }
    function addBufferImmediate(objlist, object) {
        objlist.push({
            id: null,
            object: object,
            opaque: null,
            transparent: null,
            z: 0
        });
    }
    function updateObject(object) {
        var geometry = object.geometry;
        if (geometry instanceof THREE.BufferGeometry) for (var attributes = geometry.attributes, attributesKeys = geometry.attributesKeys, i = 0, l = attributesKeys.length; l > i; i++) {
            var key = attributesKeys[i], attribute = attributes[key], bufferType = "index" === key ? _gl.ELEMENT_ARRAY_BUFFER : _gl.ARRAY_BUFFER;
            void 0 === attribute.buffer ? (attribute.buffer = _gl.createBuffer(), _gl.bindBuffer(bufferType, attribute.buffer), 
            _gl.bufferData(bufferType, attribute.array, attribute instanceof THREE.DynamicBufferAttribute ? _gl.DYNAMIC_DRAW : _gl.STATIC_DRAW), 
            attribute.needsUpdate = !1) : attribute.needsUpdate === !0 && (_gl.bindBuffer(bufferType, attribute.buffer), 
            void 0 === attribute.updateRange || -1 === attribute.updateRange.count ? _gl.bufferSubData(bufferType, 0, attribute.array) : 0 === attribute.updateRange.count ? console.error("THREE.WebGLRenderer.updateObject: using updateRange for THREE.DynamicBufferAttribute and marked as needsUpdate but count is 0, ensure you are using set methods or updating manually.") : (_gl.bufferSubData(bufferType, attribute.updateRange.offset * attribute.array.BYTES_PER_ELEMENT, attribute.array.subarray(attribute.updateRange.offset, attribute.updateRange.offset + attribute.updateRange.count)), 
            attribute.updateRange.count = 0), attribute.needsUpdate = !1);
        } else if (object instanceof THREE.Mesh) {
            geometry.groupsNeedUpdate === !0 && initGeometryGroups(object, geometry);
            for (var geometryGroupsList = geometryGroups[geometry.id], i = 0, il = geometryGroupsList.length; il > i; i++) {
                var geometryGroup = geometryGroupsList[i], material = getBufferMaterial(object, geometryGroup), customAttributesDirty = material.attributes && areCustomAttributesDirty(material);
                (geometry.verticesNeedUpdate || geometry.morphTargetsNeedUpdate || geometry.elementsNeedUpdate || geometry.uvsNeedUpdate || geometry.normalsNeedUpdate || geometry.colorsNeedUpdate || geometry.tangentsNeedUpdate || customAttributesDirty) && setMeshBuffers(geometryGroup, object, _gl.DYNAMIC_DRAW, !geometry.dynamic, material);
            }
            geometry.verticesNeedUpdate = !1, geometry.morphTargetsNeedUpdate = !1, geometry.elementsNeedUpdate = !1, 
            geometry.uvsNeedUpdate = !1, geometry.normalsNeedUpdate = !1, geometry.colorsNeedUpdate = !1, 
            geometry.tangentsNeedUpdate = !1, material.attributes && clearCustomAttributes(material);
        } else if (object instanceof THREE.Line) {
            var material = getBufferMaterial(object, geometry), customAttributesDirty = material.attributes && areCustomAttributesDirty(material);
            (geometry.verticesNeedUpdate || geometry.colorsNeedUpdate || geometry.lineDistancesNeedUpdate || customAttributesDirty) && setLineBuffers(geometry, _gl.DYNAMIC_DRAW), 
            geometry.verticesNeedUpdate = !1, geometry.colorsNeedUpdate = !1, geometry.lineDistancesNeedUpdate = !1, 
            material.attributes && clearCustomAttributes(material);
        } else if (object instanceof THREE.PointCloud) {
            var material = getBufferMaterial(object, geometry), customAttributesDirty = material.attributes && areCustomAttributesDirty(material);
            (geometry.verticesNeedUpdate || geometry.colorsNeedUpdate || customAttributesDirty) && setParticleBuffers(geometry, _gl.DYNAMIC_DRAW, object), 
            geometry.verticesNeedUpdate = !1, geometry.colorsNeedUpdate = !1, material.attributes && clearCustomAttributes(material);
        }
    }
    function areCustomAttributesDirty(material) {
        for (var name in material.attributes) if (material.attributes[name].needsUpdate) return !0;
        return !1;
    }
    function clearCustomAttributes(material) {
        for (var name in material.attributes) material.attributes[name].needsUpdate = !1;
    }
    function removeObject(object) {
        object instanceof THREE.Mesh || object instanceof THREE.PointCloud || object instanceof THREE.Line ? delete _webglObjects[object.id] : (object instanceof THREE.ImmediateRenderObject || object.immediateRenderCallback) && removeInstances(_webglObjectsImmediate, object), 
        delete object.__webglInit, delete object._modelViewMatrix, delete object._normalMatrix, 
        delete object.__webglActive;
    }
    function removeInstances(objlist, object) {
        for (var o = objlist.length - 1; o >= 0; o--) objlist[o].object === object && objlist.splice(o, 1);
    }
    function initMaterial(material, lights, fog, object) {
        material.addEventListener("dispose", onMaterialDispose);
        var shaderID = shaderIDs[material.type];
        if (shaderID) {
            var shader = THREE.ShaderLib[shaderID];
            material.__webglShader = {
                uniforms: THREE.UniformsUtils.clone(shader.uniforms),
                vertexShader: shader.vertexShader,
                fragmentShader: shader.fragmentShader
            };
        } else material.__webglShader = {
            uniforms: material.uniforms,
            vertexShader: material.vertexShader,
            fragmentShader: material.fragmentShader
        };
        var maxLightCount = allocateLights(lights), maxShadows = allocateShadows(lights), maxBones = allocateBones(object), parameters = {
            precision: _precision,
            supportsVertexTextures: _supportsVertexTextures,
            map: !!material.map,
            envMap: !!material.envMap,
            envMapMode: material.envMap && material.envMap.mapping,
            lightMap: !!material.lightMap,
            bumpMap: !!material.bumpMap,
            normalMap: !!material.normalMap,
            specularMap: !!material.specularMap,
            alphaMap: !!material.alphaMap,
            combine: material.combine,
            vertexColors: material.vertexColors,
            fog: fog,
            useFog: material.fog,
            fogExp: fog instanceof THREE.FogExp2,
            flatShading: material.shading === THREE.FlatShading,
            sizeAttenuation: material.sizeAttenuation,
            logarithmicDepthBuffer: _logarithmicDepthBuffer,
            skinning: material.skinning,
            maxBones: maxBones,
            useVertexTexture: _supportsBoneTextures && object && object.skeleton && object.skeleton.useVertexTexture,
            morphTargets: material.morphTargets,
            morphNormals: material.morphNormals,
            maxMorphTargets: _this.maxMorphTargets,
            maxMorphNormals: _this.maxMorphNormals,
            maxDirLights: maxLightCount.directional,
            maxPointLights: maxLightCount.point,
            maxSpotLights: maxLightCount.spot,
            maxHemiLights: maxLightCount.hemi,
            maxShadows: maxShadows,
            shadowMapEnabled: _this.shadowMapEnabled && object.receiveShadow && maxShadows > 0,
            shadowMapType: _this.shadowMapType,
            shadowMapDebug: _this.shadowMapDebug,
            shadowMapCascade: _this.shadowMapCascade,
            alphaTest: material.alphaTest,
            metal: material.metal,
            wrapAround: material.wrapAround,
            doubleSided: material.side === THREE.DoubleSide,
            flipSided: material.side === THREE.BackSide
        }, chunks = [];
        if (shaderID ? chunks.push(shaderID) : (chunks.push(material.fragmentShader), chunks.push(material.vertexShader)), 
        void 0 !== material.defines) for (var name in material.defines) chunks.push(name), 
        chunks.push(material.defines[name]);
        for (var name in parameters) chunks.push(name), chunks.push(parameters[name]);
        for (var program, code = chunks.join(), p = 0, pl = _programs.length; pl > p; p++) {
            var programInfo = _programs[p];
            if (programInfo.code === code) {
                program = programInfo, program.usedTimes++;
                break;
            }
        }
        void 0 === program && (program = new THREE.WebGLProgram(_this, code, material, parameters), 
        _programs.push(program), _this.info.memory.programs = _programs.length), material.program = program;
        var attributes = program.attributes;
        if (material.morphTargets) {
            material.numSupportedMorphTargets = 0;
            for (var id, base = "morphTarget", i = 0; i < _this.maxMorphTargets; i++) id = base + i, 
            attributes[id] >= 0 && material.numSupportedMorphTargets++;
        }
        if (material.morphNormals) {
            material.numSupportedMorphNormals = 0;
            var id, base = "morphNormal";
            for (i = 0; i < _this.maxMorphNormals; i++) id = base + i, attributes[id] >= 0 && material.numSupportedMorphNormals++;
        }
        material.uniformsList = [];
        for (var u in material.__webglShader.uniforms) {
            var location = material.program.uniforms[u];
            location && material.uniformsList.push([ material.__webglShader.uniforms[u], location ]);
        }
    }
    function setMaterial(material) {
        material.transparent === !0 ? state.setBlending(material.blending, material.blendEquation, material.blendSrc, material.blendDst, material.blendEquationAlpha, material.blendSrcAlpha, material.blendDstAlpha) : state.setBlending(THREE.NoBlending), 
        state.setDepthTest(material.depthTest), state.setDepthWrite(material.depthWrite), 
        state.setColorWrite(material.colorWrite), state.setPolygonOffset(material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits);
    }
    function setProgram(camera, lights, fog, material, object) {
        _usedTextureUnits = 0, material.needsUpdate && (material.program && deallocateMaterial(material), 
        initMaterial(material, lights, fog, object), material.needsUpdate = !1), material.morphTargets && (object.__webglMorphTargetInfluences || (object.__webglMorphTargetInfluences = new Float32Array(_this.maxMorphTargets)));
        var refreshProgram = !1, refreshMaterial = !1, refreshLights = !1, program = material.program, p_uniforms = program.uniforms, m_uniforms = material.__webglShader.uniforms;
        if (program.id !== _currentProgram && (_gl.useProgram(program.program), _currentProgram = program.id, 
        refreshProgram = !0, refreshMaterial = !0, refreshLights = !0), material.id !== _currentMaterialId && (-1 === _currentMaterialId && (refreshLights = !0), 
        _currentMaterialId = material.id, refreshMaterial = !0), (refreshProgram || camera !== _currentCamera) && (_gl.uniformMatrix4fv(p_uniforms.projectionMatrix, !1, camera.projectionMatrix.elements), 
        _logarithmicDepthBuffer && _gl.uniform1f(p_uniforms.logDepthBufFC, 2 / (Math.log(camera.far + 1) / Math.LN2)), 
        camera !== _currentCamera && (_currentCamera = camera), (material instanceof THREE.ShaderMaterial || material instanceof THREE.MeshPhongMaterial || material.envMap) && null !== p_uniforms.cameraPosition && (_vector3.setFromMatrixPosition(camera.matrixWorld), 
        _gl.uniform3f(p_uniforms.cameraPosition, _vector3.x, _vector3.y, _vector3.z)), (material instanceof THREE.MeshPhongMaterial || material instanceof THREE.MeshLambertMaterial || material instanceof THREE.MeshBasicMaterial || material instanceof THREE.ShaderMaterial || material.skinning) && null !== p_uniforms.viewMatrix && _gl.uniformMatrix4fv(p_uniforms.viewMatrix, !1, camera.matrixWorldInverse.elements)), 
        material.skinning) if (object.bindMatrix && null !== p_uniforms.bindMatrix && _gl.uniformMatrix4fv(p_uniforms.bindMatrix, !1, object.bindMatrix.elements), 
        object.bindMatrixInverse && null !== p_uniforms.bindMatrixInverse && _gl.uniformMatrix4fv(p_uniforms.bindMatrixInverse, !1, object.bindMatrixInverse.elements), 
        _supportsBoneTextures && object.skeleton && object.skeleton.useVertexTexture) {
            if (null !== p_uniforms.boneTexture) {
                var textureUnit = getTextureUnit();
                _gl.uniform1i(p_uniforms.boneTexture, textureUnit), _this.setTexture(object.skeleton.boneTexture, textureUnit);
            }
            null !== p_uniforms.boneTextureWidth && _gl.uniform1i(p_uniforms.boneTextureWidth, object.skeleton.boneTextureWidth), 
            null !== p_uniforms.boneTextureHeight && _gl.uniform1i(p_uniforms.boneTextureHeight, object.skeleton.boneTextureHeight);
        } else object.skeleton && object.skeleton.boneMatrices && null !== p_uniforms.boneGlobalMatrices && _gl.uniformMatrix4fv(p_uniforms.boneGlobalMatrices, !1, object.skeleton.boneMatrices);
        return refreshMaterial && (fog && material.fog && refreshUniformsFog(m_uniforms, fog), 
        (material instanceof THREE.MeshPhongMaterial || material instanceof THREE.MeshLambertMaterial || material.lights) && (_lightsNeedUpdate && (refreshLights = !0, 
        setupLights(lights), _lightsNeedUpdate = !1), refreshLights ? (refreshUniformsLights(m_uniforms, _lights), 
        markUniformsLightsNeedsUpdate(m_uniforms, !0)) : markUniformsLightsNeedsUpdate(m_uniforms, !1)), 
        (material instanceof THREE.MeshBasicMaterial || material instanceof THREE.MeshLambertMaterial || material instanceof THREE.MeshPhongMaterial) && refreshUniformsCommon(m_uniforms, material), 
        material instanceof THREE.LineBasicMaterial ? refreshUniformsLine(m_uniforms, material) : material instanceof THREE.LineDashedMaterial ? (refreshUniformsLine(m_uniforms, material), 
        refreshUniformsDash(m_uniforms, material)) : material instanceof THREE.PointCloudMaterial ? refreshUniformsParticle(m_uniforms, material) : material instanceof THREE.MeshPhongMaterial ? refreshUniformsPhong(m_uniforms, material) : material instanceof THREE.MeshLambertMaterial ? refreshUniformsLambert(m_uniforms, material) : material instanceof THREE.MeshDepthMaterial ? (m_uniforms.mNear.value = camera.near, 
        m_uniforms.mFar.value = camera.far, m_uniforms.opacity.value = material.opacity) : material instanceof THREE.MeshNormalMaterial && (m_uniforms.opacity.value = material.opacity), 
        object.receiveShadow && !material._shadowPass && refreshUniformsShadow(m_uniforms, lights), 
        loadUniformsGeneric(material.uniformsList)), loadUniformsMatrices(p_uniforms, object), 
        null !== p_uniforms.modelMatrix && _gl.uniformMatrix4fv(p_uniforms.modelMatrix, !1, object.matrixWorld.elements), 
        program;
    }
    function refreshUniformsCommon(uniforms, material) {
        uniforms.opacity.value = material.opacity, uniforms.diffuse.value = material.color, 
        uniforms.map.value = material.map, uniforms.lightMap.value = material.lightMap, 
        uniforms.specularMap.value = material.specularMap, uniforms.alphaMap.value = material.alphaMap, 
        material.bumpMap && (uniforms.bumpMap.value = material.bumpMap, uniforms.bumpScale.value = material.bumpScale), 
        material.normalMap && (uniforms.normalMap.value = material.normalMap, uniforms.normalScale.value.copy(material.normalScale));
        var uvScaleMap;
        if (material.map ? uvScaleMap = material.map : material.specularMap ? uvScaleMap = material.specularMap : material.normalMap ? uvScaleMap = material.normalMap : material.bumpMap ? uvScaleMap = material.bumpMap : material.alphaMap && (uvScaleMap = material.alphaMap), 
        void 0 !== uvScaleMap) {
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
        uniforms.shininess.value = material.shininess, uniforms.emissive.value = material.emissive, 
        uniforms.specular.value = material.specular, material.wrapAround && uniforms.wrapRGB.value.copy(material.wrapRGB);
    }
    function refreshUniformsLambert(uniforms, material) {
        uniforms.emissive.value = material.emissive, material.wrapAround && uniforms.wrapRGB.value.copy(material.wrapRGB);
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
    function refreshUniformsShadow(uniforms, lights) {
        if (uniforms.shadowMatrix) for (var j = 0, i = 0, il = lights.length; il > i; i++) {
            var light = lights[i];
            light.castShadow && (light instanceof THREE.SpotLight || light instanceof THREE.DirectionalLight && !light.shadowCascade) && (uniforms.shadowMap.value[j] = light.shadowMap, 
            uniforms.shadowMapSize.value[j] = light.shadowMapSize, uniforms.shadowMatrix.value[j] = light.shadowMatrix, 
            uniforms.shadowDarkness.value[j] = light.shadowDarkness, uniforms.shadowBias.value[j] = light.shadowBias, 
            j++);
        }
    }
    function loadUniformsMatrices(uniforms, object) {
        _gl.uniformMatrix4fv(uniforms.modelViewMatrix, !1, object._modelViewMatrix.elements), 
        uniforms.normalMatrix && _gl.uniformMatrix3fv(uniforms.normalMatrix, !1, object._normalMatrix.elements);
    }
    function getTextureUnit() {
        var textureUnit = _usedTextureUnits;
        return textureUnit >= _maxTextures && THREE.warn("WebGLRenderer: trying to use " + textureUnit + " texture units while this GPU supports only " + _maxTextures), 
        _usedTextureUnits += 1, textureUnit;
    }
    function loadUniformsGeneric(uniforms) {
        for (var texture, textureUnit, offset, j = 0, jl = uniforms.length; jl > j; j++) {
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
                    for (var i = 0, il = value.length; il > i; i++) offset = 2 * i, uniform._array[offset] = value[i].x, 
                    uniform._array[offset + 1] = value[i].y;
                    _gl.uniform2fv(location, uniform._array);
                    break;

                  case "v3v":
                    void 0 === uniform._array && (uniform._array = new Float32Array(3 * value.length));
                    for (var i = 0, il = value.length; il > i; i++) offset = 3 * i, uniform._array[offset] = value[i].x, 
                    uniform._array[offset + 1] = value[i].y, uniform._array[offset + 2] = value[i].z;
                    _gl.uniform3fv(location, uniform._array);
                    break;

                  case "v4v":
                    void 0 === uniform._array && (uniform._array = new Float32Array(4 * value.length));
                    for (var i = 0, il = value.length; il > i; i++) offset = 4 * i, uniform._array[offset] = value[i].x, 
                    uniform._array[offset + 1] = value[i].y, uniform._array[offset + 2] = value[i].z, 
                    uniform._array[offset + 3] = value[i].w;
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
                    texture instanceof THREE.CubeTexture || texture.image instanceof Array && 6 === texture.image.length ? setCubeTexture(texture, textureUnit) : texture instanceof THREE.WebGLRenderTargetCube ? setCubeTextureDynamic(texture, textureUnit) : _this.setTexture(texture, textureUnit);
                    break;

                  case "tv":
                    void 0 === uniform._array && (uniform._array = []);
                    for (var i = 0, il = uniform.value.length; il > i; i++) uniform._array[i] = getTextureUnit();
                    _gl.uniform1iv(location, uniform._array);
                    for (var i = 0, il = uniform.value.length; il > i; i++) texture = uniform.value[i], 
                    textureUnit = uniform._array[i], texture && _this.setTexture(texture, textureUnit);
                    break;

                  default:
                    THREE.warn("THREE.WebGLRenderer: Unknown uniform type: " + type);
                }
            }
        }
    }
    function setupMatrices(object, camera) {
        object._modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, object.matrixWorld), 
        object._normalMatrix.getNormalMatrix(object._modelViewMatrix);
    }
    function setColorLinear(array, offset, color, intensity) {
        array[offset] = color.r * intensity, array[offset + 1] = color.g * intensity, array[offset + 2] = color.b * intensity;
    }
    function setupLights(lights) {
        var l, ll, light, color, skyColor, groundColor, intensity, distance, r = 0, g = 0, b = 0, zlights = _lights, dirColors = zlights.directional.colors, dirPositions = zlights.directional.positions, pointColors = zlights.point.colors, pointPositions = zlights.point.positions, pointDistances = zlights.point.distances, pointDecays = zlights.point.decays, spotColors = zlights.spot.colors, spotPositions = zlights.spot.positions, spotDistances = zlights.spot.distances, spotDirections = zlights.spot.directions, spotAnglesCos = zlights.spot.anglesCos, spotExponents = zlights.spot.exponents, spotDecays = zlights.spot.decays, hemiSkyColors = zlights.hemi.skyColors, hemiGroundColors = zlights.hemi.groundColors, hemiPositions = zlights.hemi.positions, dirLength = 0, pointLength = 0, spotLength = 0, hemiLength = 0, dirCount = 0, pointCount = 0, spotCount = 0, hemiCount = 0, dirOffset = 0, pointOffset = 0, spotOffset = 0, hemiOffset = 0;
        for (l = 0, ll = lights.length; ll > l; l++) if (light = lights[l], !light.onlyShadow) if (color = light.color, 
        intensity = light.intensity, distance = light.distance, light instanceof THREE.AmbientLight) {
            if (!light.visible) continue;
            r += color.r, g += color.g, b += color.b;
        } else if (light instanceof THREE.DirectionalLight) {
            if (dirCount += 1, !light.visible) continue;
            _direction.setFromMatrixPosition(light.matrixWorld), _vector3.setFromMatrixPosition(light.target.matrixWorld), 
            _direction.sub(_vector3), _direction.normalize(), dirOffset = 3 * dirLength, dirPositions[dirOffset] = _direction.x, 
            dirPositions[dirOffset + 1] = _direction.y, dirPositions[dirOffset + 2] = _direction.z, 
            setColorLinear(dirColors, dirOffset, color, intensity), dirLength += 1;
        } else if (light instanceof THREE.PointLight) {
            if (pointCount += 1, !light.visible) continue;
            pointOffset = 3 * pointLength, setColorLinear(pointColors, pointOffset, color, intensity), 
            _vector3.setFromMatrixPosition(light.matrixWorld), pointPositions[pointOffset] = _vector3.x, 
            pointPositions[pointOffset + 1] = _vector3.y, pointPositions[pointOffset + 2] = _vector3.z, 
            pointDistances[pointLength] = distance, pointDecays[pointLength] = 0 === light.distance ? 0 : light.decay, 
            pointLength += 1;
        } else if (light instanceof THREE.SpotLight) {
            if (spotCount += 1, !light.visible) continue;
            spotOffset = 3 * spotLength, setColorLinear(spotColors, spotOffset, color, intensity), 
            _direction.setFromMatrixPosition(light.matrixWorld), spotPositions[spotOffset] = _direction.x, 
            spotPositions[spotOffset + 1] = _direction.y, spotPositions[spotOffset + 2] = _direction.z, 
            spotDistances[spotLength] = distance, _vector3.setFromMatrixPosition(light.target.matrixWorld), 
            _direction.sub(_vector3), _direction.normalize(), spotDirections[spotOffset] = _direction.x, 
            spotDirections[spotOffset + 1] = _direction.y, spotDirections[spotOffset + 2] = _direction.z, 
            spotAnglesCos[spotLength] = Math.cos(light.angle), spotExponents[spotLength] = light.exponent, 
            spotDecays[spotLength] = 0 === light.distance ? 0 : light.decay, spotLength += 1;
        } else if (light instanceof THREE.HemisphereLight) {
            if (hemiCount += 1, !light.visible) continue;
            _direction.setFromMatrixPosition(light.matrixWorld), _direction.normalize(), hemiOffset = 3 * hemiLength, 
            hemiPositions[hemiOffset] = _direction.x, hemiPositions[hemiOffset + 1] = _direction.y, 
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
        isImagePowerOfTwo ? (_gl.texParameteri(textureType, _gl.TEXTURE_WRAP_S, paramThreeToGL(texture.wrapS)), 
        _gl.texParameteri(textureType, _gl.TEXTURE_WRAP_T, paramThreeToGL(texture.wrapT)), 
        _gl.texParameteri(textureType, _gl.TEXTURE_MAG_FILTER, paramThreeToGL(texture.magFilter)), 
        _gl.texParameteri(textureType, _gl.TEXTURE_MIN_FILTER, paramThreeToGL(texture.minFilter))) : (_gl.texParameteri(textureType, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE), 
        _gl.texParameteri(textureType, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE), (texture.wrapS !== THREE.ClampToEdgeWrapping || texture.wrapT !== THREE.ClampToEdgeWrapping) && THREE.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping. ( " + texture.sourceFile + " )"), 
        _gl.texParameteri(textureType, _gl.TEXTURE_MAG_FILTER, filterFallback(texture.magFilter)), 
        _gl.texParameteri(textureType, _gl.TEXTURE_MIN_FILTER, filterFallback(texture.minFilter)), 
        texture.minFilter !== THREE.NearestFilter && texture.minFilter !== THREE.LinearFilter && THREE.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter. ( " + texture.sourceFile + " )")), 
        extension = extensions.get("EXT_texture_filter_anisotropic"), extension && texture.type !== THREE.FloatType && texture.type !== THREE.HalfFloatType && (texture.anisotropy > 1 || texture.__currentAnisotropy) && (_gl.texParameterf(textureType, extension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(texture.anisotropy, _this.getMaxAnisotropy())), 
        texture.__currentAnisotropy = texture.anisotropy);
    }
    function clampToMaxSize(image, maxSize) {
        if (image.width > maxSize || image.height > maxSize) {
            var scale = maxSize / Math.max(image.width, image.height), canvas = document.createElement("canvas");
            canvas.width = Math.floor(image.width * scale), canvas.height = Math.floor(image.height * scale);
            var context = canvas.getContext("2d");
            return context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height), 
            THREE.warn("THREE.WebGLRenderer: image is too big (" + image.width + "x" + image.height + "). Resized to " + canvas.width + "x" + canvas.height, image), 
            canvas;
        }
        return image;
    }
    function setCubeTexture(texture, slot) {
        if (6 === texture.image.length) if (texture.needsUpdate) {
            texture.image.__webglTextureCube || (texture.addEventListener("dispose", onTextureDispose), 
            texture.image.__webglTextureCube = _gl.createTexture(), _this.info.memory.textures++), 
            _gl.activeTexture(_gl.TEXTURE0 + slot), _gl.bindTexture(_gl.TEXTURE_CUBE_MAP, texture.image.__webglTextureCube), 
            _gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);
            for (var isCompressed = texture instanceof THREE.CompressedTexture, isDataTexture = texture.image[0] instanceof THREE.DataTexture, cubeImage = [], i = 0; 6 > i; i++) !_this.autoScaleCubemaps || isCompressed || isDataTexture ? cubeImage[i] = isDataTexture ? texture.image[i].image : texture.image[i] : cubeImage[i] = clampToMaxSize(texture.image[i], _maxCubemapSize);
            var image = cubeImage[0], isImagePowerOfTwo = THREE.Math.isPowerOfTwo(image.width) && THREE.Math.isPowerOfTwo(image.height), glFormat = paramThreeToGL(texture.format), glType = paramThreeToGL(texture.type);
            setTextureParameters(_gl.TEXTURE_CUBE_MAP, texture, isImagePowerOfTwo);
            for (var i = 0; 6 > i; i++) if (isCompressed) for (var mipmap, mipmaps = cubeImage[i].mipmaps, j = 0, jl = mipmaps.length; jl > j; j++) mipmap = mipmaps[j], 
            texture.format !== THREE.RGBAFormat && texture.format !== THREE.RGBFormat ? getCompressedTextureFormats().indexOf(glFormat) > -1 ? _gl.compressedTexImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, mipmap.data) : THREE.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setCubeTexture()") : _gl.texImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data); else isDataTexture ? _gl.texImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, cubeImage[i].width, cubeImage[i].height, 0, glFormat, glType, cubeImage[i].data) : _gl.texImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, glFormat, glType, cubeImage[i]);
            texture.generateMipmaps && isImagePowerOfTwo && _gl.generateMipmap(_gl.TEXTURE_CUBE_MAP), 
            texture.needsUpdate = !1, texture.onUpdate && texture.onUpdate();
        } else _gl.activeTexture(_gl.TEXTURE0 + slot), _gl.bindTexture(_gl.TEXTURE_CUBE_MAP, texture.image.__webglTextureCube);
    }
    function setCubeTextureDynamic(texture, slot) {
        _gl.activeTexture(_gl.TEXTURE0 + slot), _gl.bindTexture(_gl.TEXTURE_CUBE_MAP, texture.__webglTexture);
    }
    function setupFrameBuffer(framebuffer, renderTarget, textureTarget) {
        _gl.bindFramebuffer(_gl.FRAMEBUFFER, framebuffer), _gl.framebufferTexture2D(_gl.FRAMEBUFFER, _gl.COLOR_ATTACHMENT0, textureTarget, renderTarget.__webglTexture, 0);
    }
    function setupRenderBuffer(renderbuffer, renderTarget) {
        _gl.bindRenderbuffer(_gl.RENDERBUFFER, renderbuffer), renderTarget.depthBuffer && !renderTarget.stencilBuffer ? (_gl.renderbufferStorage(_gl.RENDERBUFFER, _gl.DEPTH_COMPONENT16, renderTarget.width, renderTarget.height), 
        _gl.framebufferRenderbuffer(_gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer)) : renderTarget.depthBuffer && renderTarget.stencilBuffer ? (_gl.renderbufferStorage(_gl.RENDERBUFFER, _gl.DEPTH_STENCIL, renderTarget.width, renderTarget.height), 
        _gl.framebufferRenderbuffer(_gl.FRAMEBUFFER, _gl.DEPTH_STENCIL_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer)) : _gl.renderbufferStorage(_gl.RENDERBUFFER, _gl.RGBA4, renderTarget.width, renderTarget.height);
    }
    function updateRenderTargetMipmap(renderTarget) {
        renderTarget instanceof THREE.WebGLRenderTargetCube ? (_gl.bindTexture(_gl.TEXTURE_CUBE_MAP, renderTarget.__webglTexture), 
        _gl.generateMipmap(_gl.TEXTURE_CUBE_MAP), _gl.bindTexture(_gl.TEXTURE_CUBE_MAP, null)) : (_gl.bindTexture(_gl.TEXTURE_2D, renderTarget.__webglTexture), 
        _gl.generateMipmap(_gl.TEXTURE_2D), _gl.bindTexture(_gl.TEXTURE_2D, null));
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
    function allocateBones(object) {
        if (_supportsBoneTextures && object && object.skeleton && object.skeleton.useVertexTexture) return 1024;
        var nVertexUniforms = _gl.getParameter(_gl.MAX_VERTEX_UNIFORM_VECTORS), nVertexMatrices = Math.floor((nVertexUniforms - 20) / 4), maxBones = nVertexMatrices;
        return void 0 !== object && object instanceof THREE.SkinnedMesh && (maxBones = Math.min(object.skeleton.bones.length, maxBones), 
        maxBones < object.skeleton.bones.length && THREE.warn("WebGLRenderer: too many bones - " + object.skeleton.bones.length + ", this GPU supports just " + maxBones + " (try OpenGL instead of ANGLE)")), 
        maxBones;
    }
    function allocateLights(lights) {
        for (var dirLights = 0, pointLights = 0, spotLights = 0, hemiLights = 0, l = 0, ll = lights.length; ll > l; l++) {
            var light = lights[l];
            light.onlyShadow || light.visible === !1 || (light instanceof THREE.DirectionalLight && dirLights++, 
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
        for (var maxShadows = 0, l = 0, ll = lights.length; ll > l; l++) {
            var light = lights[l];
            light.castShadow && (light instanceof THREE.SpotLight && maxShadows++, light instanceof THREE.DirectionalLight && !light.shadowCascade && maxShadows++);
        }
        return maxShadows;
    }
    console.log("THREE.WebGLRenderer", THREE.REVISION), parameters = parameters || {};
    var _canvas = void 0 !== parameters.canvas ? parameters.canvas : document.createElement("canvas"), _context = void 0 !== parameters.context ? parameters.context : null, pixelRatio = 1, _precision = void 0 !== parameters.precision ? parameters.precision : "highp", _alpha = void 0 !== parameters.alpha ? parameters.alpha : !1, _depth = void 0 !== parameters.depth ? parameters.depth : !0, _stencil = void 0 !== parameters.stencil ? parameters.stencil : !0, _antialias = void 0 !== parameters.antialias ? parameters.antialias : !1, _premultipliedAlpha = void 0 !== parameters.premultipliedAlpha ? parameters.premultipliedAlpha : !0, _preserveDrawingBuffer = void 0 !== parameters.preserveDrawingBuffer ? parameters.preserveDrawingBuffer : !1, _logarithmicDepthBuffer = void 0 !== parameters.logarithmicDepthBuffer ? parameters.logarithmicDepthBuffer : !1, _clearColor = new THREE.Color(0), _clearAlpha = 0, lights = [], _webglObjects = {}, _webglObjectsImmediate = [], opaqueObjects = [], transparentObjects = [], sprites = [], lensFlares = [];
    this.domElement = _canvas, this.context = null, this.autoClear = !0, this.autoClearColor = !0, 
    this.autoClearDepth = !0, this.autoClearStencil = !0, this.sortObjects = !0, this.gammaFactor = 2, 
    this.gammaInput = !1, this.gammaOutput = !1, this.shadowMapEnabled = !1, this.shadowMapType = THREE.PCFShadowMap, 
    this.shadowMapCullFace = THREE.CullFaceFront, this.shadowMapDebug = !1, this.shadowMapCascade = !1, 
    this.maxMorphTargets = 8, this.maxMorphNormals = 4, this.autoScaleCubemaps = !0, 
    this.info = {
        memory: {
            programs: 0,
            geometries: 0,
            textures: 0
        },
        render: {
            calls: 0,
            vertices: 0,
            faces: 0,
            points: 0
        }
    };
    var _gl, _this = this, _programs = [], _currentProgram = null, _currentFramebuffer = null, _currentMaterialId = -1, _currentGeometryProgram = "", _currentCamera = null, _usedTextureUnits = 0, _viewportX = 0, _viewportY = 0, _viewportWidth = _canvas.width, _viewportHeight = _canvas.height, _currentWidth = 0, _currentHeight = 0, _frustum = new THREE.Frustum(), _projScreenMatrix = new THREE.Matrix4(), _vector3 = new THREE.Vector3(), _direction = new THREE.Vector3(), _lightsNeedUpdate = !0, _lights = {
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
    };
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
        _canvas.addEventListener("webglcontextlost", function(event) {
            event.preventDefault(), resetGLState(), setDefaultGLState(), _webglObjects = {};
        }, !1);
    } catch (error) {
        THREE.error("THREE.WebGLRenderer: " + error);
    }
    var state = new THREE.WebGLState(_gl, paramThreeToGL);
    void 0 === _gl.getShaderPrecisionFormat && (_gl.getShaderPrecisionFormat = function() {
        return {
            rangeMin: 1,
            rangeMax: 1,
            precision: 1
        };
    });
    var extensions = new THREE.WebGLExtensions(_gl);
    extensions.get("OES_texture_float"), extensions.get("OES_texture_float_linear"), 
    extensions.get("OES_texture_half_float"), extensions.get("OES_texture_half_float_linear"), 
    extensions.get("OES_standard_derivatives"), _logarithmicDepthBuffer && extensions.get("EXT_frag_depth");
    var glClearColor = function(r, g, b, a) {
        _premultipliedAlpha === !0 && (r *= a, g *= a, b *= a), _gl.clearColor(r, g, b, a);
    }, setDefaultGLState = function() {
        _gl.clearColor(0, 0, 0, 1), _gl.clearDepth(1), _gl.clearStencil(0), _gl.enable(_gl.DEPTH_TEST), 
        _gl.depthFunc(_gl.LEQUAL), _gl.frontFace(_gl.CCW), _gl.cullFace(_gl.BACK), _gl.enable(_gl.CULL_FACE), 
        _gl.enable(_gl.BLEND), _gl.blendEquation(_gl.FUNC_ADD), _gl.blendFunc(_gl.SRC_ALPHA, _gl.ONE_MINUS_SRC_ALPHA), 
        _gl.viewport(_viewportX, _viewportY, _viewportWidth, _viewportHeight), glClearColor(_clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha);
    }, resetGLState = function() {
        _currentProgram = null, _currentCamera = null, _currentGeometryProgram = "", _currentMaterialId = -1, 
        _lightsNeedUpdate = !0, state.reset();
    };
    setDefaultGLState(), this.context = _gl, this.state = state;
    var _maxTextures = _gl.getParameter(_gl.MAX_TEXTURE_IMAGE_UNITS), _maxVertexTextures = _gl.getParameter(_gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS), _maxTextureSize = _gl.getParameter(_gl.MAX_TEXTURE_SIZE), _maxCubemapSize = _gl.getParameter(_gl.MAX_CUBE_MAP_TEXTURE_SIZE), _supportsVertexTextures = _maxVertexTextures > 0, _supportsBoneTextures = _supportsVertexTextures && extensions.get("OES_texture_float"), _vertexShaderPrecisionHighpFloat = _gl.getShaderPrecisionFormat(_gl.VERTEX_SHADER, _gl.HIGH_FLOAT), _vertexShaderPrecisionMediumpFloat = _gl.getShaderPrecisionFormat(_gl.VERTEX_SHADER, _gl.MEDIUM_FLOAT), _fragmentShaderPrecisionHighpFloat = _gl.getShaderPrecisionFormat(_gl.FRAGMENT_SHADER, _gl.HIGH_FLOAT), _fragmentShaderPrecisionMediumpFloat = _gl.getShaderPrecisionFormat(_gl.FRAGMENT_SHADER, _gl.MEDIUM_FLOAT), getCompressedTextureFormats = function() {
        var array;
        return function() {
            if (void 0 !== array) return array;
            if (array = [], extensions.get("WEBGL_compressed_texture_pvrtc") || extensions.get("WEBGL_compressed_texture_s3tc")) for (var formats = _gl.getParameter(_gl.COMPRESSED_TEXTURE_FORMATS), i = 0; i < formats.length; i++) array.push(formats[i]);
            return array;
        };
    }(), highpAvailable = _vertexShaderPrecisionHighpFloat.precision > 0 && _fragmentShaderPrecisionHighpFloat.precision > 0, mediumpAvailable = _vertexShaderPrecisionMediumpFloat.precision > 0 && _fragmentShaderPrecisionMediumpFloat.precision > 0;
    "highp" !== _precision || highpAvailable || (mediumpAvailable ? (_precision = "mediump", 
    THREE.warn("THREE.WebGLRenderer: highp not supported, using mediump.")) : (_precision = "lowp", 
    THREE.warn("THREE.WebGLRenderer: highp and mediump not supported, using lowp."))), 
    "mediump" !== _precision || mediumpAvailable || (_precision = "lowp", THREE.warn("THREE.WebGLRenderer: mediump not supported, using lowp."));
    var shadowMapPlugin = new THREE.ShadowMapPlugin(this, lights, _webglObjects, _webglObjectsImmediate), spritePlugin = new THREE.SpritePlugin(this, sprites), lensFlarePlugin = new THREE.LensFlarePlugin(this, lensFlares);
    this.getContext = function() {
        return _gl;
    }, this.forceContextLoss = function() {
        extensions.get("WEBGL_lose_context").loseContext();
    }, this.supportsVertexTextures = function() {
        return _supportsVertexTextures;
    }, this.supportsFloatTextures = function() {
        return extensions.get("OES_texture_float");
    }, this.supportsHalfFloatTextures = function() {
        return extensions.get("OES_texture_half_float");
    }, this.supportsStandardDerivatives = function() {
        return extensions.get("OES_standard_derivatives");
    }, this.supportsCompressedTextureS3TC = function() {
        return extensions.get("WEBGL_compressed_texture_s3tc");
    }, this.supportsCompressedTexturePVRTC = function() {
        return extensions.get("WEBGL_compressed_texture_pvrtc");
    }, this.supportsBlendMinMax = function() {
        return extensions.get("EXT_blend_minmax");
    }, this.getMaxAnisotropy = function() {
        var value;
        return function() {
            if (void 0 !== value) return value;
            var extension = extensions.get("EXT_texture_filter_anisotropic");
            return value = null !== extension ? _gl.getParameter(extension.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0;
        };
    }(), this.getPrecision = function() {
        return _precision;
    }, this.getPixelRatio = function() {
        return pixelRatio;
    }, this.setPixelRatio = function(value) {
        pixelRatio = value;
    }, this.setSize = function(width, height, updateStyle) {
        _canvas.width = width * pixelRatio, _canvas.height = height * pixelRatio, updateStyle !== !1 && (_canvas.style.width = width + "px", 
        _canvas.style.height = height + "px"), this.setViewport(0, 0, width, height);
    }, this.setViewport = function(x, y, width, height) {
        _viewportX = x * pixelRatio, _viewportY = y * pixelRatio, _viewportWidth = width * pixelRatio, 
        _viewportHeight = height * pixelRatio, _gl.viewport(_viewportX, _viewportY, _viewportWidth, _viewportHeight);
    }, this.setScissor = function(x, y, width, height) {
        _gl.scissor(x * pixelRatio, y * pixelRatio, width * pixelRatio, height * pixelRatio);
    }, this.enableScissorTest = function(enable) {
        enable ? _gl.enable(_gl.SCISSOR_TEST) : _gl.disable(_gl.SCISSOR_TEST);
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
    }, this.resetGLState = resetGLState;
    var onObjectRemoved = function(event) {
        var object = event.target;
        object.traverse(function(child) {
            child.removeEventListener("remove", onObjectRemoved), removeObject(child);
        });
    }, onGeometryDispose = function(event) {
        var geometry = event.target;
        geometry.removeEventListener("dispose", onGeometryDispose), deallocateGeometry(geometry);
    }, onTextureDispose = function(event) {
        var texture = event.target;
        texture.removeEventListener("dispose", onTextureDispose), deallocateTexture(texture), 
        _this.info.memory.textures--;
    }, onRenderTargetDispose = function(event) {
        var renderTarget = event.target;
        renderTarget.removeEventListener("dispose", onRenderTargetDispose), deallocateRenderTarget(renderTarget), 
        _this.info.memory.textures--;
    }, onMaterialDispose = function(event) {
        var material = event.target;
        material.removeEventListener("dispose", onMaterialDispose), deallocateMaterial(material);
    }, deleteBuffers = function(geometry) {
        for (var buffers = [ "__webglVertexBuffer", "__webglNormalBuffer", "__webglTangentBuffer", "__webglColorBuffer", "__webglUVBuffer", "__webglUV2Buffer", "__webglSkinIndicesBuffer", "__webglSkinWeightsBuffer", "__webglFaceBuffer", "__webglLineBuffer", "__webglLineDistanceBuffer" ], i = 0, l = buffers.length; l > i; i++) {
            var name = buffers[i];
            void 0 !== geometry[name] && (_gl.deleteBuffer(geometry[name]), delete geometry[name]);
        }
        if (void 0 !== geometry.__webglCustomAttributesList) {
            for (var name in geometry.__webglCustomAttributesList) _gl.deleteBuffer(geometry.__webglCustomAttributesList[name].buffer);
            delete geometry.__webglCustomAttributesList;
        }
        _this.info.memory.geometries--;
    }, deallocateGeometry = function(geometry) {
        if (delete geometry.__webglInit, geometry instanceof THREE.BufferGeometry) {
            for (var name in geometry.attributes) {
                var attribute = geometry.attributes[name];
                void 0 !== attribute.buffer && (_gl.deleteBuffer(attribute.buffer), delete attribute.buffer);
            }
            _this.info.memory.geometries--;
        } else {
            var geometryGroupsList = geometryGroups[geometry.id];
            if (void 0 !== geometryGroupsList) {
                for (var i = 0, l = geometryGroupsList.length; l > i; i++) {
                    var geometryGroup = geometryGroupsList[i];
                    if (void 0 !== geometryGroup.numMorphTargets) {
                        for (var m = 0, ml = geometryGroup.numMorphTargets; ml > m; m++) _gl.deleteBuffer(geometryGroup.__webglMorphTargetsBuffers[m]);
                        delete geometryGroup.__webglMorphTargetsBuffers;
                    }
                    if (void 0 !== geometryGroup.numMorphNormals) {
                        for (var m = 0, ml = geometryGroup.numMorphNormals; ml > m; m++) _gl.deleteBuffer(geometryGroup.__webglMorphNormalsBuffers[m]);
                        delete geometryGroup.__webglMorphNormalsBuffers;
                    }
                    deleteBuffers(geometryGroup);
                }
                delete geometryGroups[geometry.id];
            } else deleteBuffers(geometry);
        }
        _currentGeometryProgram = "";
    }, deallocateTexture = function(texture) {
        if (texture.image && texture.image.__webglTextureCube) _gl.deleteTexture(texture.image.__webglTextureCube), 
        delete texture.image.__webglTextureCube; else {
            if (void 0 === texture.__webglInit) return;
            _gl.deleteTexture(texture.__webglTexture), delete texture.__webglTexture, delete texture.__webglInit;
        }
    }, deallocateRenderTarget = function(renderTarget) {
        if (renderTarget && void 0 !== renderTarget.__webglTexture) {
            if (_gl.deleteTexture(renderTarget.__webglTexture), delete renderTarget.__webglTexture, 
            renderTarget instanceof THREE.WebGLRenderTargetCube) for (var i = 0; 6 > i; i++) _gl.deleteFramebuffer(renderTarget.__webglFramebuffer[i]), 
            _gl.deleteRenderbuffer(renderTarget.__webglRenderbuffer[i]); else _gl.deleteFramebuffer(renderTarget.__webglFramebuffer), 
            _gl.deleteRenderbuffer(renderTarget.__webglRenderbuffer);
            delete renderTarget.__webglFramebuffer, delete renderTarget.__webglRenderbuffer;
        }
    }, deallocateMaterial = function(material) {
        var program = material.program.program;
        if (void 0 !== program) {
            material.program = void 0;
            var i, il, programInfo, deleteProgram = !1;
            for (i = 0, il = _programs.length; il > i; i++) if (programInfo = _programs[i], 
            programInfo.program === program) {
                programInfo.usedTimes--, 0 === programInfo.usedTimes && (deleteProgram = !0);
                break;
            }
            if (deleteProgram === !0) {
                var newPrograms = [];
                for (i = 0, il = _programs.length; il > i; i++) programInfo = _programs[i], programInfo.program !== program && newPrograms.push(programInfo);
                _programs = newPrograms, _gl.deleteProgram(program), _this.info.memory.programs--;
            }
        }
    };
    this.renderBufferImmediate = function(object, program, material) {
        if (state.initAttributes(), object.hasPositions && !object.__webglVertexBuffer && (object.__webglVertexBuffer = _gl.createBuffer()), 
        object.hasNormals && !object.__webglNormalBuffer && (object.__webglNormalBuffer = _gl.createBuffer()), 
        object.hasUvs && !object.__webglUvBuffer && (object.__webglUvBuffer = _gl.createBuffer()), 
        object.hasColors && !object.__webglColorBuffer && (object.__webglColorBuffer = _gl.createBuffer()), 
        object.hasPositions && (_gl.bindBuffer(_gl.ARRAY_BUFFER, object.__webglVertexBuffer), 
        _gl.bufferData(_gl.ARRAY_BUFFER, object.positionArray, _gl.DYNAMIC_DRAW), state.enableAttribute(program.attributes.position), 
        _gl.vertexAttribPointer(program.attributes.position, 3, _gl.FLOAT, !1, 0, 0)), object.hasNormals) {
            if (_gl.bindBuffer(_gl.ARRAY_BUFFER, object.__webglNormalBuffer), material instanceof THREE.MeshPhongMaterial == !1 && material.shading === THREE.FlatShading) {
                var nx, ny, nz, nax, nbx, ncx, nay, nby, ncy, naz, nbz, ncz, normalArray, i, il = 3 * object.count;
                for (i = 0; il > i; i += 9) normalArray = object.normalArray, nax = normalArray[i], 
                nay = normalArray[i + 1], naz = normalArray[i + 2], nbx = normalArray[i + 3], nby = normalArray[i + 4], 
                nbz = normalArray[i + 5], ncx = normalArray[i + 6], ncy = normalArray[i + 7], ncz = normalArray[i + 8], 
                nx = (nax + nbx + ncx) / 3, ny = (nay + nby + ncy) / 3, nz = (naz + nbz + ncz) / 3, 
                normalArray[i] = nx, normalArray[i + 1] = ny, normalArray[i + 2] = nz, normalArray[i + 3] = nx, 
                normalArray[i + 4] = ny, normalArray[i + 5] = nz, normalArray[i + 6] = nx, normalArray[i + 7] = ny, 
                normalArray[i + 8] = nz;
            }
            _gl.bufferData(_gl.ARRAY_BUFFER, object.normalArray, _gl.DYNAMIC_DRAW), state.enableAttribute(program.attributes.normal), 
            _gl.vertexAttribPointer(program.attributes.normal, 3, _gl.FLOAT, !1, 0, 0);
        }
        object.hasUvs && material.map && (_gl.bindBuffer(_gl.ARRAY_BUFFER, object.__webglUvBuffer), 
        _gl.bufferData(_gl.ARRAY_BUFFER, object.uvArray, _gl.DYNAMIC_DRAW), state.enableAttribute(program.attributes.uv), 
        _gl.vertexAttribPointer(program.attributes.uv, 2, _gl.FLOAT, !1, 0, 0)), object.hasColors && material.vertexColors !== THREE.NoColors && (_gl.bindBuffer(_gl.ARRAY_BUFFER, object.__webglColorBuffer), 
        _gl.bufferData(_gl.ARRAY_BUFFER, object.colorArray, _gl.DYNAMIC_DRAW), state.enableAttribute(program.attributes.color), 
        _gl.vertexAttribPointer(program.attributes.color, 3, _gl.FLOAT, !1, 0, 0)), state.disableUnusedAttributes(), 
        _gl.drawArrays(_gl.TRIANGLES, 0, object.count), object.count = 0;
    }, this.renderBufferDirect = function(camera, lights, fog, material, geometry, object) {
        if (material.visible !== !1) {
            updateObject(object);
            var program = setProgram(camera, lights, fog, material, object), updateBuffers = !1, wireframeBit = material.wireframe ? 1 : 0, geometryProgram = "direct_" + geometry.id + "_" + program.id + "_" + wireframeBit;
            if (geometryProgram !== _currentGeometryProgram && (_currentGeometryProgram = geometryProgram, 
            updateBuffers = !0), updateBuffers && state.initAttributes(), object instanceof THREE.Mesh) {
                var mode = material.wireframe === !0 ? _gl.LINES : _gl.TRIANGLES, index = geometry.attributes.index;
                if (index) {
                    var type, size;
                    index.array instanceof Uint32Array && extensions.get("OES_element_index_uint") ? (type = _gl.UNSIGNED_INT, 
                    size = 4) : (type = _gl.UNSIGNED_SHORT, size = 2);
                    var offsets = geometry.offsets;
                    if (0 === offsets.length) updateBuffers && (setupVertexAttributes(material, program, geometry, 0), 
                    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, index.buffer)), _gl.drawElements(mode, index.array.length, type, 0), 
                    _this.info.render.calls++, _this.info.render.vertices += index.array.length, _this.info.render.faces += index.array.length / 3; else {
                        updateBuffers = !0;
                        for (var i = 0, il = offsets.length; il > i; i++) {
                            var startIndex = offsets[i].index;
                            updateBuffers && (setupVertexAttributes(material, program, geometry, startIndex), 
                            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, index.buffer)), _gl.drawElements(mode, offsets[i].count, type, offsets[i].start * size), 
                            _this.info.render.calls++, _this.info.render.vertices += offsets[i].count, _this.info.render.faces += offsets[i].count / 3;
                        }
                    }
                } else {
                    updateBuffers && setupVertexAttributes(material, program, geometry, 0);
                    var position = geometry.attributes.position;
                    _gl.drawArrays(mode, 0, position.array.length / position.itemSize), _this.info.render.calls++, 
                    _this.info.render.vertices += position.array.length / position.itemSize, _this.info.render.faces += position.array.length / (3 * position.itemSize);
                }
            } else if (object instanceof THREE.PointCloud) {
                var mode = _gl.POINTS, index = geometry.attributes.index;
                if (index) {
                    var type, size;
                    index.array instanceof Uint32Array && extensions.get("OES_element_index_uint") ? (type = _gl.UNSIGNED_INT, 
                    size = 4) : (type = _gl.UNSIGNED_SHORT, size = 2);
                    var offsets = geometry.offsets;
                    if (0 === offsets.length) updateBuffers && (setupVertexAttributes(material, program, geometry, 0), 
                    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, index.buffer)), _gl.drawElements(mode, index.array.length, type, 0), 
                    _this.info.render.calls++, _this.info.render.points += index.array.length; else {
                        offsets.length > 1 && (updateBuffers = !0);
                        for (var i = 0, il = offsets.length; il > i; i++) {
                            var startIndex = offsets[i].index;
                            updateBuffers && (setupVertexAttributes(material, program, geometry, startIndex), 
                            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, index.buffer)), _gl.drawElements(mode, offsets[i].count, type, offsets[i].start * size), 
                            _this.info.render.calls++, _this.info.render.points += offsets[i].count;
                        }
                    }
                } else {
                    updateBuffers && setupVertexAttributes(material, program, geometry, 0);
                    var position = geometry.attributes.position, offsets = geometry.offsets;
                    if (0 === offsets.length) _gl.drawArrays(mode, 0, position.array.length / 3), _this.info.render.calls++, 
                    _this.info.render.points += position.array.length / 3; else for (var i = 0, il = offsets.length; il > i; i++) _gl.drawArrays(mode, offsets[i].index, offsets[i].count), 
                    _this.info.render.calls++, _this.info.render.points += offsets[i].count;
                }
            } else if (object instanceof THREE.Line) {
                var mode = object.mode === THREE.LineStrip ? _gl.LINE_STRIP : _gl.LINES;
                state.setLineWidth(material.linewidth * pixelRatio);
                var index = geometry.attributes.index;
                if (index) {
                    var type, size;
                    index.array instanceof Uint32Array ? (type = _gl.UNSIGNED_INT, size = 4) : (type = _gl.UNSIGNED_SHORT, 
                    size = 2);
                    var offsets = geometry.offsets;
                    if (0 === offsets.length) updateBuffers && (setupVertexAttributes(material, program, geometry, 0), 
                    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, index.buffer)), _gl.drawElements(mode, index.array.length, type, 0), 
                    _this.info.render.calls++, _this.info.render.vertices += index.array.length; else {
                        offsets.length > 1 && (updateBuffers = !0);
                        for (var i = 0, il = offsets.length; il > i; i++) {
                            var startIndex = offsets[i].index;
                            updateBuffers && (setupVertexAttributes(material, program, geometry, startIndex), 
                            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, index.buffer)), _gl.drawElements(mode, offsets[i].count, type, offsets[i].start * size), 
                            _this.info.render.calls++, _this.info.render.vertices += offsets[i].count;
                        }
                    }
                } else {
                    updateBuffers && setupVertexAttributes(material, program, geometry, 0);
                    var position = geometry.attributes.position, offsets = geometry.offsets;
                    if (0 === offsets.length) _gl.drawArrays(mode, 0, position.array.length / 3), _this.info.render.calls++, 
                    _this.info.render.vertices += position.array.length / 3; else for (var i = 0, il = offsets.length; il > i; i++) _gl.drawArrays(mode, offsets[i].index, offsets[i].count), 
                    _this.info.render.calls++, _this.info.render.vertices += offsets[i].count;
                }
            }
        }
    }, this.renderBuffer = function(camera, lights, fog, material, geometryGroup, object) {
        if (material.visible !== !1) {
            updateObject(object);
            var program = setProgram(camera, lights, fog, material, object), attributes = program.attributes, updateBuffers = !1, wireframeBit = material.wireframe ? 1 : 0, geometryProgram = geometryGroup.id + "_" + program.id + "_" + wireframeBit;
            if (geometryProgram !== _currentGeometryProgram && (_currentGeometryProgram = geometryProgram, 
            updateBuffers = !0), updateBuffers && state.initAttributes(), !material.morphTargets && attributes.position >= 0 ? updateBuffers && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglVertexBuffer), 
            state.enableAttribute(attributes.position), _gl.vertexAttribPointer(attributes.position, 3, _gl.FLOAT, !1, 0, 0)) : object.morphTargetBase && setupMorphTargets(material, geometryGroup, object), 
            updateBuffers) {
                if (geometryGroup.__webglCustomAttributesList) for (var i = 0, il = geometryGroup.__webglCustomAttributesList.length; il > i; i++) {
                    var attribute = geometryGroup.__webglCustomAttributesList[i];
                    attributes[attribute.buffer.belongsToAttribute] >= 0 && (_gl.bindBuffer(_gl.ARRAY_BUFFER, attribute.buffer), 
                    state.enableAttribute(attributes[attribute.buffer.belongsToAttribute]), _gl.vertexAttribPointer(attributes[attribute.buffer.belongsToAttribute], attribute.size, _gl.FLOAT, !1, 0, 0));
                }
                attributes.color >= 0 && (object.geometry.colors.length > 0 || object.geometry.faces.length > 0 ? (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglColorBuffer), 
                state.enableAttribute(attributes.color), _gl.vertexAttribPointer(attributes.color, 3, _gl.FLOAT, !1, 0, 0)) : void 0 !== material.defaultAttributeValues && _gl.vertexAttrib3fv(attributes.color, material.defaultAttributeValues.color)), 
                attributes.normal >= 0 && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglNormalBuffer), 
                state.enableAttribute(attributes.normal), _gl.vertexAttribPointer(attributes.normal, 3, _gl.FLOAT, !1, 0, 0)), 
                attributes.tangent >= 0 && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglTangentBuffer), 
                state.enableAttribute(attributes.tangent), _gl.vertexAttribPointer(attributes.tangent, 4, _gl.FLOAT, !1, 0, 0)), 
                attributes.uv >= 0 && (object.geometry.faceVertexUvs[0] ? (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglUVBuffer), 
                state.enableAttribute(attributes.uv), _gl.vertexAttribPointer(attributes.uv, 2, _gl.FLOAT, !1, 0, 0)) : void 0 !== material.defaultAttributeValues && _gl.vertexAttrib2fv(attributes.uv, material.defaultAttributeValues.uv)), 
                attributes.uv2 >= 0 && (object.geometry.faceVertexUvs[1] ? (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglUV2Buffer), 
                state.enableAttribute(attributes.uv2), _gl.vertexAttribPointer(attributes.uv2, 2, _gl.FLOAT, !1, 0, 0)) : void 0 !== material.defaultAttributeValues && _gl.vertexAttrib2fv(attributes.uv2, material.defaultAttributeValues.uv2)), 
                material.skinning && attributes.skinIndex >= 0 && attributes.skinWeight >= 0 && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglSkinIndicesBuffer), 
                state.enableAttribute(attributes.skinIndex), _gl.vertexAttribPointer(attributes.skinIndex, 4, _gl.FLOAT, !1, 0, 0), 
                _gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglSkinWeightsBuffer), state.enableAttribute(attributes.skinWeight), 
                _gl.vertexAttribPointer(attributes.skinWeight, 4, _gl.FLOAT, !1, 0, 0)), attributes.lineDistance >= 0 && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglLineDistanceBuffer), 
                state.enableAttribute(attributes.lineDistance), _gl.vertexAttribPointer(attributes.lineDistance, 1, _gl.FLOAT, !1, 0, 0));
            }
            if (state.disableUnusedAttributes(), object instanceof THREE.Mesh) {
                var type = geometryGroup.__typeArray === Uint32Array ? _gl.UNSIGNED_INT : _gl.UNSIGNED_SHORT;
                material.wireframe ? (state.setLineWidth(material.wireframeLinewidth * pixelRatio), 
                updateBuffers && _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, geometryGroup.__webglLineBuffer), 
                _gl.drawElements(_gl.LINES, geometryGroup.__webglLineCount, type, 0)) : (updateBuffers && _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, geometryGroup.__webglFaceBuffer), 
                _gl.drawElements(_gl.TRIANGLES, geometryGroup.__webglFaceCount, type, 0)), _this.info.render.calls++, 
                _this.info.render.vertices += geometryGroup.__webglFaceCount, _this.info.render.faces += geometryGroup.__webglFaceCount / 3;
            } else if (object instanceof THREE.Line) {
                var mode = object.mode === THREE.LineStrip ? _gl.LINE_STRIP : _gl.LINES;
                state.setLineWidth(material.linewidth * pixelRatio), _gl.drawArrays(mode, 0, geometryGroup.__webglLineCount), 
                _this.info.render.calls++;
            } else object instanceof THREE.PointCloud && (_gl.drawArrays(_gl.POINTS, 0, geometryGroup.__webglParticleCount), 
            _this.info.render.calls++, _this.info.render.points += geometryGroup.__webglParticleCount);
        }
    }, this.render = function(scene, camera, renderTarget, forceClear) {
        if (camera instanceof THREE.Camera == !1) return void THREE.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");
        var fog = scene.fog;
        _currentGeometryProgram = "", _currentMaterialId = -1, _currentCamera = null, _lightsNeedUpdate = !0, 
        scene.autoUpdate === !0 && scene.updateMatrixWorld(), void 0 === camera.parent && camera.updateMatrixWorld(), 
        scene.traverse(function(object) {
            object instanceof THREE.SkinnedMesh && object.skeleton.update();
        }), camera.matrixWorldInverse.getInverse(camera.matrixWorld), _projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse), 
        _frustum.setFromMatrix(_projScreenMatrix), lights.length = 0, opaqueObjects.length = 0, 
        transparentObjects.length = 0, sprites.length = 0, lensFlares.length = 0, projectObject(scene), 
        _this.sortObjects === !0 && (opaqueObjects.sort(painterSortStable), transparentObjects.sort(reversePainterSortStable)), 
        shadowMapPlugin.render(scene, camera), _this.info.render.calls = 0, _this.info.render.vertices = 0, 
        _this.info.render.faces = 0, _this.info.render.points = 0, this.setRenderTarget(renderTarget), 
        (this.autoClear || forceClear) && this.clear(this.autoClearColor, this.autoClearDepth, this.autoClearStencil);
        for (var i = 0, il = _webglObjectsImmediate.length; il > i; i++) {
            var webglObject = _webglObjectsImmediate[i], object = webglObject.object;
            object.visible && (setupMatrices(object, camera), unrollImmediateBufferMaterial(webglObject));
        }
        if (scene.overrideMaterial) {
            var overrideMaterial = scene.overrideMaterial;
            setMaterial(overrideMaterial), renderObjects(opaqueObjects, camera, lights, fog, overrideMaterial), 
            renderObjects(transparentObjects, camera, lights, fog, overrideMaterial), renderObjectsImmediate(_webglObjectsImmediate, "", camera, lights, fog, overrideMaterial);
        } else state.setBlending(THREE.NoBlending), renderObjects(opaqueObjects, camera, lights, fog, null), 
        renderObjectsImmediate(_webglObjectsImmediate, "opaque", camera, lights, fog, null), 
        renderObjects(transparentObjects, camera, lights, fog, null), renderObjectsImmediate(_webglObjectsImmediate, "transparent", camera, lights, fog, null);
        spritePlugin.render(scene, camera), lensFlarePlugin.render(scene, camera, _currentWidth, _currentHeight), 
        renderTarget && renderTarget.generateMipmaps && renderTarget.minFilter !== THREE.NearestFilter && renderTarget.minFilter !== THREE.LinearFilter && updateRenderTargetMipmap(renderTarget), 
        state.setDepthTest(!0), state.setDepthWrite(!0), state.setColorWrite(!0);
    }, this.renderImmediateObject = function(camera, lights, fog, material, object) {
        var program = setProgram(camera, lights, fog, material, object);
        _currentGeometryProgram = "", _this.setMaterialFaces(material), object.immediateRenderCallback ? object.immediateRenderCallback(program, _gl, _frustum) : object.render(function(object) {
            _this.renderBufferImmediate(object, program, material);
        });
    };
    var geometryGroups = {}, geometryGroupCounter = 0, shaderIDs = {
        MeshDepthMaterial: "depth",
        MeshNormalMaterial: "normal",
        MeshBasicMaterial: "basic",
        MeshLambertMaterial: "lambert",
        MeshPhongMaterial: "phong",
        LineBasicMaterial: "basic",
        LineDashedMaterial: "dashed",
        PointCloudMaterial: "particle_basic"
    };
    this.setFaceCulling = function(cullFace, frontFaceDirection) {
        cullFace === THREE.CullFaceNone ? _gl.disable(_gl.CULL_FACE) : (frontFaceDirection === THREE.FrontFaceDirectionCW ? _gl.frontFace(_gl.CW) : _gl.frontFace(_gl.CCW), 
        cullFace === THREE.CullFaceBack ? _gl.cullFace(_gl.BACK) : cullFace === THREE.CullFaceFront ? _gl.cullFace(_gl.FRONT) : _gl.cullFace(_gl.FRONT_AND_BACK), 
        _gl.enable(_gl.CULL_FACE));
    }, this.setMaterialFaces = function(material) {
        state.setDoubleSided(material.side === THREE.DoubleSide), state.setFlipSided(material.side === THREE.BackSide);
    }, this.uploadTexture = function(texture) {
        void 0 === texture.__webglInit && (texture.__webglInit = !0, texture.addEventListener("dispose", onTextureDispose), 
        texture.__webglTexture = _gl.createTexture(), _this.info.memory.textures++), _gl.bindTexture(_gl.TEXTURE_2D, texture.__webglTexture), 
        _gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, texture.flipY), _gl.pixelStorei(_gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultiplyAlpha), 
        _gl.pixelStorei(_gl.UNPACK_ALIGNMENT, texture.unpackAlignment), texture.image = clampToMaxSize(texture.image, _maxTextureSize);
        var image = texture.image, isImagePowerOfTwo = THREE.Math.isPowerOfTwo(image.width) && THREE.Math.isPowerOfTwo(image.height), glFormat = paramThreeToGL(texture.format), glType = paramThreeToGL(texture.type);
        setTextureParameters(_gl.TEXTURE_2D, texture, isImagePowerOfTwo);
        var mipmap, mipmaps = texture.mipmaps;
        if (texture instanceof THREE.DataTexture) if (mipmaps.length > 0 && isImagePowerOfTwo) {
            for (var i = 0, il = mipmaps.length; il > i; i++) mipmap = mipmaps[i], _gl.texImage2D(_gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data);
            texture.generateMipmaps = !1;
        } else _gl.texImage2D(_gl.TEXTURE_2D, 0, glFormat, image.width, image.height, 0, glFormat, glType, image.data); else if (texture instanceof THREE.CompressedTexture) for (var i = 0, il = mipmaps.length; il > i; i++) mipmap = mipmaps[i], 
        texture.format !== THREE.RGBAFormat && texture.format !== THREE.RGBFormat ? getCompressedTextureFormats().indexOf(glFormat) > -1 ? _gl.compressedTexImage2D(_gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, mipmap.data) : THREE.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : _gl.texImage2D(_gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data); else if (mipmaps.length > 0 && isImagePowerOfTwo) {
            for (var i = 0, il = mipmaps.length; il > i; i++) mipmap = mipmaps[i], _gl.texImage2D(_gl.TEXTURE_2D, i, glFormat, glFormat, glType, mipmap);
            texture.generateMipmaps = !1;
        } else _gl.texImage2D(_gl.TEXTURE_2D, 0, glFormat, glFormat, glType, texture.image);
        texture.generateMipmaps && isImagePowerOfTwo && _gl.generateMipmap(_gl.TEXTURE_2D), 
        texture.needsUpdate = !1, texture.onUpdate && texture.onUpdate();
    }, this.setTexture = function(texture, slot) {
        _gl.activeTexture(_gl.TEXTURE0 + slot), texture.needsUpdate ? _this.uploadTexture(texture) : _gl.bindTexture(_gl.TEXTURE_2D, texture.__webglTexture);
    }, this.setRenderTarget = function(renderTarget) {
        var isCube = renderTarget instanceof THREE.WebGLRenderTargetCube;
        if (renderTarget && void 0 === renderTarget.__webglFramebuffer) {
            void 0 === renderTarget.depthBuffer && (renderTarget.depthBuffer = !0), void 0 === renderTarget.stencilBuffer && (renderTarget.stencilBuffer = !0), 
            renderTarget.addEventListener("dispose", onRenderTargetDispose), renderTarget.__webglTexture = _gl.createTexture(), 
            _this.info.memory.textures++;
            var isTargetPowerOfTwo = THREE.Math.isPowerOfTwo(renderTarget.width) && THREE.Math.isPowerOfTwo(renderTarget.height), glFormat = paramThreeToGL(renderTarget.format), glType = paramThreeToGL(renderTarget.type);
            if (isCube) {
                renderTarget.__webglFramebuffer = [], renderTarget.__webglRenderbuffer = [], _gl.bindTexture(_gl.TEXTURE_CUBE_MAP, renderTarget.__webglTexture), 
                setTextureParameters(_gl.TEXTURE_CUBE_MAP, renderTarget, isTargetPowerOfTwo);
                for (var i = 0; 6 > i; i++) renderTarget.__webglFramebuffer[i] = _gl.createFramebuffer(), 
                renderTarget.__webglRenderbuffer[i] = _gl.createRenderbuffer(), _gl.texImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, renderTarget.width, renderTarget.height, 0, glFormat, glType, null), 
                setupFrameBuffer(renderTarget.__webglFramebuffer[i], renderTarget, _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i), 
                setupRenderBuffer(renderTarget.__webglRenderbuffer[i], renderTarget);
                isTargetPowerOfTwo && _gl.generateMipmap(_gl.TEXTURE_CUBE_MAP);
            } else renderTarget.__webglFramebuffer = _gl.createFramebuffer(), renderTarget.shareDepthFrom ? renderTarget.__webglRenderbuffer = renderTarget.shareDepthFrom.__webglRenderbuffer : renderTarget.__webglRenderbuffer = _gl.createRenderbuffer(), 
            _gl.bindTexture(_gl.TEXTURE_2D, renderTarget.__webglTexture), setTextureParameters(_gl.TEXTURE_2D, renderTarget, isTargetPowerOfTwo), 
            _gl.texImage2D(_gl.TEXTURE_2D, 0, glFormat, renderTarget.width, renderTarget.height, 0, glFormat, glType, null), 
            setupFrameBuffer(renderTarget.__webglFramebuffer, renderTarget, _gl.TEXTURE_2D), 
            renderTarget.shareDepthFrom ? renderTarget.depthBuffer && !renderTarget.stencilBuffer ? _gl.framebufferRenderbuffer(_gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, renderTarget.__webglRenderbuffer) : renderTarget.depthBuffer && renderTarget.stencilBuffer && _gl.framebufferRenderbuffer(_gl.FRAMEBUFFER, _gl.DEPTH_STENCIL_ATTACHMENT, _gl.RENDERBUFFER, renderTarget.__webglRenderbuffer) : setupRenderBuffer(renderTarget.__webglRenderbuffer, renderTarget), 
            isTargetPowerOfTwo && _gl.generateMipmap(_gl.TEXTURE_2D);
            isCube ? _gl.bindTexture(_gl.TEXTURE_CUBE_MAP, null) : _gl.bindTexture(_gl.TEXTURE_2D, null), 
            _gl.bindRenderbuffer(_gl.RENDERBUFFER, null), _gl.bindFramebuffer(_gl.FRAMEBUFFER, null);
        }
        var framebuffer, width, height, vx, vy;
        renderTarget ? (framebuffer = isCube ? renderTarget.__webglFramebuffer[renderTarget.activeCubeFace] : renderTarget.__webglFramebuffer, 
        width = renderTarget.width, height = renderTarget.height, vx = 0, vy = 0) : (framebuffer = null, 
        width = _viewportWidth, height = _viewportHeight, vx = _viewportX, vy = _viewportY), 
        framebuffer !== _currentFramebuffer && (_gl.bindFramebuffer(_gl.FRAMEBUFFER, framebuffer), 
        _gl.viewport(vx, vy, width, height), _currentFramebuffer = framebuffer), _currentWidth = width, 
        _currentHeight = height;
    }, this.readRenderTargetPixels = function(renderTarget, x, y, width, height, buffer) {
        if (!(renderTarget instanceof THREE.WebGLRenderTarget)) return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
        if (renderTarget.__webglFramebuffer) {
            if (renderTarget.format !== THREE.RGBAFormat) return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA format. readPixels can read only RGBA format.");
            var restore = !1;
            renderTarget.__webglFramebuffer !== _currentFramebuffer && (_gl.bindFramebuffer(_gl.FRAMEBUFFER, renderTarget.__webglFramebuffer), 
            restore = !0), _gl.checkFramebufferStatus(_gl.FRAMEBUFFER) === _gl.FRAMEBUFFER_COMPLETE ? _gl.readPixels(x, y, width, height, _gl.RGBA, _gl.UNSIGNED_BYTE, buffer) : console.error("THREE.WebGLRenderer.readRenderTargetPixels: readPixels from renderTarget failed. Framebuffer not complete."), 
            restore && _gl.bindFramebuffer(_gl.FRAMEBUFFER, _currentFramebuffer);
        }
    }, this.initMaterial = function() {
        THREE.warn("THREE.WebGLRenderer: .initMaterial() has been removed.");
    }, this.addPrePlugin = function() {
        THREE.warn("THREE.WebGLRenderer: .addPrePlugin() has been removed.");
    }, this.addPostPlugin = function() {
        THREE.warn("THREE.WebGLRenderer: .addPostPlugin() has been removed.");
    }, this.updateShadowMap = function() {
        THREE.warn("THREE.WebGLRenderer: .updateShadowMap() has been removed.");
    };
}, THREE.WebGLRenderTarget = function(width, height, options) {
    this.width = width, this.height = height, options = options || {}, this.wrapS = void 0 !== options.wrapS ? options.wrapS : THREE.ClampToEdgeWrapping, 
    this.wrapT = void 0 !== options.wrapT ? options.wrapT : THREE.ClampToEdgeWrapping, 
    this.magFilter = void 0 !== options.magFilter ? options.magFilter : THREE.LinearFilter, 
    this.minFilter = void 0 !== options.minFilter ? options.minFilter : THREE.LinearMipMapLinearFilter, 
    this.anisotropy = void 0 !== options.anisotropy ? options.anisotropy : 1, this.offset = new THREE.Vector2(0, 0), 
    this.repeat = new THREE.Vector2(1, 1), this.format = void 0 !== options.format ? options.format : THREE.RGBAFormat, 
    this.type = void 0 !== options.type ? options.type : THREE.UnsignedByteType, this.depthBuffer = void 0 !== options.depthBuffer ? options.depthBuffer : !0, 
    this.stencilBuffer = void 0 !== options.stencilBuffer ? options.stencilBuffer : !0, 
    this.generateMipmaps = !0, this.shareDepthFrom = void 0 !== options.shareDepthFrom ? options.shareDepthFrom : null;
}, THREE.WebGLRenderTarget.prototype = {
    constructor: THREE.WebGLRenderTarget,
    setSize: function(width, height) {
        this.width = width, this.height = height;
    },
    clone: function() {
        var tmp = new THREE.WebGLRenderTarget(this.width, this.height);
        return tmp.wrapS = this.wrapS, tmp.wrapT = this.wrapT, tmp.magFilter = this.magFilter, 
        tmp.minFilter = this.minFilter, tmp.anisotropy = this.anisotropy, tmp.offset.copy(this.offset), 
        tmp.repeat.copy(this.repeat), tmp.format = this.format, tmp.type = this.type, tmp.depthBuffer = this.depthBuffer, 
        tmp.stencilBuffer = this.stencilBuffer, tmp.generateMipmaps = this.generateMipmaps, 
        tmp.shareDepthFrom = this.shareDepthFrom, tmp;
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
THREE.WebGLExtensions = function(gl) {
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
        return null === extension && THREE.warn("THREE.WebGLRenderer: " + name + " extension not supported."), 
        extensions[name] = extension, extension;
    };
}, THREE.WebGLProgram = function() {
    var programIdCount = 0, generateDefines = function(defines) {
        var value, chunk, chunks = [];
        for (var d in defines) value = defines[d], value !== !1 && (chunk = "#define " + d + " " + value, 
        chunks.push(chunk));
        return chunks.join("\n");
    }, cacheUniformLocations = function(gl, program, identifiers) {
        for (var uniforms = {}, i = 0, l = identifiers.length; l > i; i++) {
            var id = identifiers[i];
            uniforms[id] = gl.getUniformLocation(program, id);
        }
        return uniforms;
    }, cacheAttributeLocations = function(gl, program, identifiers) {
        for (var attributes = {}, i = 0, l = identifiers.length; l > i; i++) {
            var id = identifiers[i];
            attributes[id] = gl.getAttribLocation(program, id);
        }
        return attributes;
    };
    return function(renderer, code, material, parameters) {
        var _this = renderer, _gl = _this.context, defines = material.defines, uniforms = material.__webglShader.uniforms, attributes = material.attributes, vertexShader = material.__webglShader.vertexShader, fragmentShader = material.__webglShader.fragmentShader, index0AttributeName = material.index0AttributeName;
        void 0 === index0AttributeName && parameters.morphTargets === !0 && (index0AttributeName = "position");
        var shadowMapTypeDefine = "SHADOWMAP_TYPE_BASIC";
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
        var prefix_vertex, prefix_fragment, gammaFactorDefine = renderer.gammaFactor > 0 ? renderer.gammaFactor : 1, customDefines = generateDefines(defines), program = _gl.createProgram();
        material instanceof THREE.RawShaderMaterial ? (prefix_vertex = "", prefix_fragment = "") : (prefix_vertex = [ "precision " + parameters.precision + " float;", "precision " + parameters.precision + " int;", customDefines, parameters.supportsVertexTextures ? "#define VERTEX_TEXTURES" : "", _this.gammaInput ? "#define GAMMA_INPUT" : "", _this.gammaOutput ? "#define GAMMA_OUTPUT" : "", "#define GAMMA_FACTOR " + gammaFactorDefine, "#define MAX_DIR_LIGHTS " + parameters.maxDirLights, "#define MAX_POINT_LIGHTS " + parameters.maxPointLights, "#define MAX_SPOT_LIGHTS " + parameters.maxSpotLights, "#define MAX_HEMI_LIGHTS " + parameters.maxHemiLights, "#define MAX_SHADOWS " + parameters.maxShadows, "#define MAX_BONES " + parameters.maxBones, parameters.map ? "#define USE_MAP" : "", parameters.envMap ? "#define USE_ENVMAP" : "", parameters.envMap ? "#define " + envMapModeDefine : "", parameters.lightMap ? "#define USE_LIGHTMAP" : "", parameters.bumpMap ? "#define USE_BUMPMAP" : "", parameters.normalMap ? "#define USE_NORMALMAP" : "", parameters.specularMap ? "#define USE_SPECULARMAP" : "", parameters.alphaMap ? "#define USE_ALPHAMAP" : "", parameters.vertexColors ? "#define USE_COLOR" : "", parameters.flatShading ? "#define FLAT_SHADED" : "", parameters.skinning ? "#define USE_SKINNING" : "", parameters.useVertexTexture ? "#define BONE_TEXTURE" : "", parameters.morphTargets ? "#define USE_MORPHTARGETS" : "", parameters.morphNormals ? "#define USE_MORPHNORMALS" : "", parameters.wrapAround ? "#define WRAP_AROUND" : "", parameters.doubleSided ? "#define DOUBLE_SIDED" : "", parameters.flipSided ? "#define FLIP_SIDED" : "", parameters.shadowMapEnabled ? "#define USE_SHADOWMAP" : "", parameters.shadowMapEnabled ? "#define " + shadowMapTypeDefine : "", parameters.shadowMapDebug ? "#define SHADOWMAP_DEBUG" : "", parameters.shadowMapCascade ? "#define SHADOWMAP_CASCADE" : "", parameters.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "", parameters.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "", "uniform mat4 modelMatrix;", "uniform mat4 modelViewMatrix;", "uniform mat4 projectionMatrix;", "uniform mat4 viewMatrix;", "uniform mat3 normalMatrix;", "uniform vec3 cameraPosition;", "attribute vec3 position;", "attribute vec3 normal;", "attribute vec2 uv;", "attribute vec2 uv2;", "#ifdef USE_COLOR", "	attribute vec3 color;", "#endif", "#ifdef USE_MORPHTARGETS", "	attribute vec3 morphTarget0;", "	attribute vec3 morphTarget1;", "	attribute vec3 morphTarget2;", "	attribute vec3 morphTarget3;", "	#ifdef USE_MORPHNORMALS", "		attribute vec3 morphNormal0;", "		attribute vec3 morphNormal1;", "		attribute vec3 morphNormal2;", "		attribute vec3 morphNormal3;", "	#else", "		attribute vec3 morphTarget4;", "		attribute vec3 morphTarget5;", "		attribute vec3 morphTarget6;", "		attribute vec3 morphTarget7;", "	#endif", "#endif", "#ifdef USE_SKINNING", "	attribute vec4 skinIndex;", "	attribute vec4 skinWeight;", "#endif", "" ].join("\n"), 
        prefix_fragment = [ "precision " + parameters.precision + " float;", "precision " + parameters.precision + " int;", parameters.bumpMap || parameters.normalMap || parameters.flatShading ? "#extension GL_OES_standard_derivatives : enable" : "", customDefines, "#define MAX_DIR_LIGHTS " + parameters.maxDirLights, "#define MAX_POINT_LIGHTS " + parameters.maxPointLights, "#define MAX_SPOT_LIGHTS " + parameters.maxSpotLights, "#define MAX_HEMI_LIGHTS " + parameters.maxHemiLights, "#define MAX_SHADOWS " + parameters.maxShadows, parameters.alphaTest ? "#define ALPHATEST " + parameters.alphaTest : "", _this.gammaInput ? "#define GAMMA_INPUT" : "", _this.gammaOutput ? "#define GAMMA_OUTPUT" : "", "#define GAMMA_FACTOR " + gammaFactorDefine, parameters.useFog && parameters.fog ? "#define USE_FOG" : "", parameters.useFog && parameters.fogExp ? "#define FOG_EXP2" : "", parameters.map ? "#define USE_MAP" : "", parameters.envMap ? "#define USE_ENVMAP" : "", parameters.envMap ? "#define " + envMapTypeDefine : "", parameters.envMap ? "#define " + envMapModeDefine : "", parameters.envMap ? "#define " + envMapBlendingDefine : "", parameters.lightMap ? "#define USE_LIGHTMAP" : "", parameters.bumpMap ? "#define USE_BUMPMAP" : "", parameters.normalMap ? "#define USE_NORMALMAP" : "", parameters.specularMap ? "#define USE_SPECULARMAP" : "", parameters.alphaMap ? "#define USE_ALPHAMAP" : "", parameters.vertexColors ? "#define USE_COLOR" : "", parameters.flatShading ? "#define FLAT_SHADED" : "", parameters.metal ? "#define METAL" : "", parameters.wrapAround ? "#define WRAP_AROUND" : "", parameters.doubleSided ? "#define DOUBLE_SIDED" : "", parameters.flipSided ? "#define FLIP_SIDED" : "", parameters.shadowMapEnabled ? "#define USE_SHADOWMAP" : "", parameters.shadowMapEnabled ? "#define " + shadowMapTypeDefine : "", parameters.shadowMapDebug ? "#define SHADOWMAP_DEBUG" : "", parameters.shadowMapCascade ? "#define SHADOWMAP_CASCADE" : "", parameters.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "", "uniform mat4 viewMatrix;", "uniform vec3 cameraPosition;", "" ].join("\n"));
        var glVertexShader = new THREE.WebGLShader(_gl, _gl.VERTEX_SHADER, prefix_vertex + vertexShader), glFragmentShader = new THREE.WebGLShader(_gl, _gl.FRAGMENT_SHADER, prefix_fragment + fragmentShader);
        _gl.attachShader(program, glVertexShader), _gl.attachShader(program, glFragmentShader), 
        void 0 !== index0AttributeName && _gl.bindAttribLocation(program, 0, index0AttributeName), 
        _gl.linkProgram(program);
        var programLogInfo = _gl.getProgramInfoLog(program);
        _gl.getProgramParameter(program, _gl.LINK_STATUS) === !1 && THREE.error("THREE.WebGLProgram: shader error: " + _gl.getError(), "gl.VALIDATE_STATUS", _gl.getProgramParameter(program, _gl.VALIDATE_STATUS), "gl.getPRogramInfoLog", programLogInfo), 
        "" !== programLogInfo && THREE.warn("THREE.WebGLProgram: gl.getProgramInfoLog()" + programLogInfo), 
        _gl.deleteShader(glVertexShader), _gl.deleteShader(glFragmentShader);
        var identifiers = [ "viewMatrix", "modelViewMatrix", "projectionMatrix", "normalMatrix", "modelMatrix", "cameraPosition", "morphTargetInfluences", "bindMatrix", "bindMatrixInverse" ];
        parameters.useVertexTexture ? (identifiers.push("boneTexture"), identifiers.push("boneTextureWidth"), 
        identifiers.push("boneTextureHeight")) : identifiers.push("boneGlobalMatrices"), 
        parameters.logarithmicDepthBuffer && identifiers.push("logDepthBufFC");
        for (var u in uniforms) identifiers.push(u);
        this.uniforms = cacheUniformLocations(_gl, program, identifiers), identifiers = [ "position", "normal", "uv", "uv2", "tangent", "color", "skinIndex", "skinWeight", "lineDistance" ];
        for (var i = 0; i < parameters.maxMorphTargets; i++) identifiers.push("morphTarget" + i);
        for (var i = 0; i < parameters.maxMorphNormals; i++) identifiers.push("morphNormal" + i);
        for (var a in attributes) identifiers.push(a);
        return this.attributes = cacheAttributeLocations(_gl, program, identifiers), this.attributesKeys = Object.keys(this.attributes), 
        this.id = programIdCount++, this.code = code, this.usedTimes = 1, this.program = program, 
        this.vertexShader = glVertexShader, this.fragmentShader = glFragmentShader, this;
    };
}(), THREE.WebGLShader = function() {
    var addLineNumbers = function(string) {
        for (var lines = string.split("\n"), i = 0; i < lines.length; i++) lines[i] = i + 1 + ": " + lines[i];
        return lines.join("\n");
    };
    return function(gl, type, string) {
        var shader = gl.createShader(type);
        return gl.shaderSource(shader, string), gl.compileShader(shader), gl.getShaderParameter(shader, gl.COMPILE_STATUS) === !1 && THREE.error("THREE.WebGLShader: Shader couldn't compile."), 
        "" !== gl.getShaderInfoLog(shader) && THREE.warn("THREE.WebGLShader: gl.getShaderInfoLog()", gl.getShaderInfoLog(shader), addLineNumbers(string)), 
        shader;
    };
}(), THREE.WebGLState = function(gl, paramThreeToGL) {
    var newAttributes = new Uint8Array(16), enabledAttributes = new Uint8Array(16), currentBlending = null, currentBlendEquation = null, currentBlendSrc = null, currentBlendDst = null, currentBlendEquationAlpha = null, currentBlendSrcAlpha = null, currentBlendDstAlpha = null, currentDepthTest = null, currentDepthWrite = null, currentColorWrite = null, currentDoubleSided = null, currentFlipSided = null, currentLineWidth = null, currentPolygonOffset = null, currentPolygonOffsetFactor = null, currentPolygonOffsetUnits = null;
    this.initAttributes = function() {
        for (var i = 0, l = newAttributes.length; l > i; i++) newAttributes[i] = 0;
    }, this.enableAttribute = function(attribute) {
        newAttributes[attribute] = 1, 0 === enabledAttributes[attribute] && (gl.enableVertexAttribArray(attribute), 
        enabledAttributes[attribute] = 1);
    }, this.disableUnusedAttributes = function() {
        for (var i = 0, l = enabledAttributes.length; l > i; i++) enabledAttributes[i] !== newAttributes[i] && (gl.disableVertexAttribArray(i), 
        enabledAttributes[i] = 0);
    }, this.setBlending = function(blending, blendEquation, blendSrc, blendDst, blendEquationAlpha, blendSrcAlpha, blendDstAlpha) {
        blending !== currentBlending && (blending === THREE.NoBlending ? gl.disable(gl.BLEND) : blending === THREE.AdditiveBlending ? (gl.enable(gl.BLEND), 
        gl.blendEquation(gl.FUNC_ADD), gl.blendFunc(gl.SRC_ALPHA, gl.ONE)) : blending === THREE.SubtractiveBlending ? (gl.enable(gl.BLEND), 
        gl.blendEquation(gl.FUNC_ADD), gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_COLOR)) : blending === THREE.MultiplyBlending ? (gl.enable(gl.BLEND), 
        gl.blendEquation(gl.FUNC_ADD), gl.blendFunc(gl.ZERO, gl.SRC_COLOR)) : blending === THREE.CustomBlending ? gl.enable(gl.BLEND) : (gl.enable(gl.BLEND), 
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
    }, this.setDepthTest = function(depthTest) {
        currentDepthTest !== depthTest && (depthTest ? gl.enable(gl.DEPTH_TEST) : gl.disable(gl.DEPTH_TEST), 
        currentDepthTest = depthTest);
    }, this.setDepthWrite = function(depthWrite) {
        currentDepthWrite !== depthWrite && (gl.depthMask(depthWrite), currentDepthWrite = depthWrite);
    }, this.setColorWrite = function(colorWrite) {
        currentColorWrite !== colorWrite && (gl.colorMask(colorWrite, colorWrite, colorWrite, colorWrite), 
        currentColorWrite = colorWrite);
    }, this.setDoubleSided = function(doubleSided) {
        currentDoubleSided !== doubleSided && (doubleSided ? gl.disable(gl.CULL_FACE) : gl.enable(gl.CULL_FACE), 
        currentDoubleSided = doubleSided);
    }, this.setFlipSided = function(flipSided) {
        currentFlipSided !== flipSided && (flipSided ? gl.frontFace(gl.CW) : gl.frontFace(gl.CCW), 
        currentFlipSided = flipSided);
    }, this.setLineWidth = function(width) {
        width !== currentLineWidth && (gl.lineWidth(width), currentLineWidth = width);
    }, this.setPolygonOffset = function(polygonoffset, factor, units) {
        currentPolygonOffset !== polygonoffset && (polygonoffset ? gl.enable(gl.POLYGON_OFFSET_FILL) : gl.disable(gl.POLYGON_OFFSET_FILL), 
        currentPolygonOffset = polygonoffset), !polygonoffset || currentPolygonOffsetFactor === factor && currentPolygonOffsetUnits === units || (gl.polygonOffset(factor, units), 
        currentPolygonOffsetFactor = factor, currentPolygonOffsetUnits = units);
    }, this.reset = function() {
        for (var i = 0; i < enabledAttributes.length; i++) enabledAttributes[i] = 0;
        currentBlending = null, currentDepthTest = null, currentDepthWrite = null, currentColorWrite = null, 
        currentDoubleSided = null, currentFlipSided = null;
    };
}, THREE.LensFlarePlugin = function(renderer, flares) {
    function createProgram(shader) {
        var program = gl.createProgram(), fragmentShader = gl.createShader(gl.FRAGMENT_SHADER), vertexShader = gl.createShader(gl.VERTEX_SHADER), prefix = "precision " + renderer.getPrecision() + " float;\n";
        return gl.shaderSource(fragmentShader, prefix + shader.fragmentShader), gl.shaderSource(vertexShader, prefix + shader.vertexShader), 
        gl.compileShader(fragmentShader), gl.compileShader(vertexShader), gl.attachShader(program, fragmentShader), 
        gl.attachShader(program, vertexShader), gl.linkProgram(program), program;
    }
    var vertexBuffer, elementBuffer, program, attributes, uniforms, hasVertexTexture, tempTexture, occlusionTexture, gl = renderer.context, init = function() {
        var vertices = new Float32Array([ -1, -1, 0, 0, 1, -1, 1, 0, 1, 1, 1, 1, -1, 1, 0, 1 ]), faces = new Uint16Array([ 0, 1, 2, 0, 2, 3 ]);
        vertexBuffer = gl.createBuffer(), elementBuffer = gl.createBuffer(), gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer), 
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW), gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer), 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW), tempTexture = gl.createTexture(), 
        occlusionTexture = gl.createTexture(), gl.bindTexture(gl.TEXTURE_2D, tempTexture), 
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 16, 16, 0, gl.RGB, gl.UNSIGNED_BYTE, null), 
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE), 
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST), 
        gl.bindTexture(gl.TEXTURE_2D, occlusionTexture), gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 16, 16, 0, gl.RGBA, gl.UNSIGNED_BYTE, null), 
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE), 
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST), 
        hasVertexTexture = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) > 0;
        var shader;
        shader = hasVertexTexture ? {
            vertexShader: [ "uniform lowp int renderType;", "uniform vec3 screenPosition;", "uniform vec2 scale;", "uniform float rotation;", "uniform sampler2D occlusionMap;", "attribute vec2 position;", "attribute vec2 uv;", "varying vec2 vUV;", "varying float vVisibility;", "void main() {", "vUV = uv;", "vec2 pos = position;", "if( renderType == 2 ) {", "vec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) );", "visibility += texture2D( occlusionMap, vec2( 0.5, 0.1 ) );", "visibility += texture2D( occlusionMap, vec2( 0.9, 0.1 ) );", "visibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) );", "visibility += texture2D( occlusionMap, vec2( 0.9, 0.9 ) );", "visibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) );", "visibility += texture2D( occlusionMap, vec2( 0.1, 0.9 ) );", "visibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) );", "visibility += texture2D( occlusionMap, vec2( 0.5, 0.5 ) );", "vVisibility =        visibility.r / 9.0;", "vVisibility *= 1.0 - visibility.g / 9.0;", "vVisibility *=       visibility.b / 9.0;", "vVisibility *= 1.0 - visibility.a / 9.0;", "pos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;", "pos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;", "}", "gl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );", "}" ].join("\n"),
            fragmentShader: [ "uniform lowp int renderType;", "uniform sampler2D map;", "uniform float opacity;", "uniform vec3 color;", "varying vec2 vUV;", "varying float vVisibility;", "void main() {", "if( renderType == 0 ) {", "gl_FragColor = vec4( 1.0, 0.0, 1.0, 0.0 );", "} else if( renderType == 1 ) {", "gl_FragColor = texture2D( map, vUV );", "} else {", "vec4 texture = texture2D( map, vUV );", "texture.a *= opacity * vVisibility;", "gl_FragColor = texture;", "gl_FragColor.rgb *= color;", "}", "}" ].join("\n")
        } : {
            vertexShader: [ "uniform lowp int renderType;", "uniform vec3 screenPosition;", "uniform vec2 scale;", "uniform float rotation;", "attribute vec2 position;", "attribute vec2 uv;", "varying vec2 vUV;", "void main() {", "vUV = uv;", "vec2 pos = position;", "if( renderType == 2 ) {", "pos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;", "pos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;", "}", "gl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );", "}" ].join("\n"),
            fragmentShader: [ "precision mediump float;", "uniform lowp int renderType;", "uniform sampler2D map;", "uniform sampler2D occlusionMap;", "uniform float opacity;", "uniform vec3 color;", "varying vec2 vUV;", "void main() {", "if( renderType == 0 ) {", "gl_FragColor = vec4( texture2D( map, vUV ).rgb, 0.0 );", "} else if( renderType == 1 ) {", "gl_FragColor = texture2D( map, vUV );", "} else {", "float visibility = texture2D( occlusionMap, vec2( 0.5, 0.1 ) ).a;", "visibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) ).a;", "visibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) ).a;", "visibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) ).a;", "visibility = ( 1.0 - visibility / 4.0 );", "vec4 texture = texture2D( map, vUV );", "texture.a *= opacity * visibility;", "gl_FragColor = texture;", "gl_FragColor.rgb *= color;", "}", "}" ].join("\n")
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
    };
    this.render = function(scene, camera, viewportWidth, viewportHeight) {
        if (0 !== flares.length) {
            var tempPosition = new THREE.Vector3(), invAspect = viewportHeight / viewportWidth, halfViewportWidth = .5 * viewportWidth, halfViewportHeight = .5 * viewportHeight, size = 16 / viewportHeight, scale = new THREE.Vector2(size * invAspect, size), screenPosition = new THREE.Vector3(1, 1, 0), screenPositionPixels = new THREE.Vector2(1, 1);
            void 0 === program && init(), gl.useProgram(program), gl.enableVertexAttribArray(attributes.vertex), 
            gl.enableVertexAttribArray(attributes.uv), gl.uniform1i(uniforms.occlusionMap, 0), 
            gl.uniform1i(uniforms.map, 1), gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer), gl.vertexAttribPointer(attributes.vertex, 2, gl.FLOAT, !1, 16, 0), 
            gl.vertexAttribPointer(attributes.uv, 2, gl.FLOAT, !1, 16, 8), gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer), 
            gl.disable(gl.CULL_FACE), gl.depthMask(!1);
            for (var i = 0, l = flares.length; l > i; i++) {
                size = 16 / viewportHeight, scale.set(size * invAspect, size);
                var flare = flares[i];
                if (tempPosition.set(flare.matrixWorld.elements[12], flare.matrixWorld.elements[13], flare.matrixWorld.elements[14]), 
                tempPosition.applyMatrix4(camera.matrixWorldInverse), tempPosition.applyProjection(camera.projectionMatrix), 
                screenPosition.copy(tempPosition), screenPositionPixels.x = screenPosition.x * halfViewportWidth + halfViewportWidth, 
                screenPositionPixels.y = screenPosition.y * halfViewportHeight + halfViewportHeight, 
                hasVertexTexture || screenPositionPixels.x > 0 && screenPositionPixels.x < viewportWidth && screenPositionPixels.y > 0 && screenPositionPixels.y < viewportHeight) {
                    gl.activeTexture(gl.TEXTURE1), gl.bindTexture(gl.TEXTURE_2D, tempTexture), gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGB, screenPositionPixels.x - 8, screenPositionPixels.y - 8, 16, 16, 0), 
                    gl.uniform1i(uniforms.renderType, 0), gl.uniform2f(uniforms.scale, scale.x, scale.y), 
                    gl.uniform3f(uniforms.screenPosition, screenPosition.x, screenPosition.y, screenPosition.z), 
                    gl.disable(gl.BLEND), gl.enable(gl.DEPTH_TEST), gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0), 
                    gl.activeTexture(gl.TEXTURE0), gl.bindTexture(gl.TEXTURE_2D, occlusionTexture), 
                    gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, screenPositionPixels.x - 8, screenPositionPixels.y - 8, 16, 16, 0), 
                    gl.uniform1i(uniforms.renderType, 1), gl.disable(gl.DEPTH_TEST), gl.activeTexture(gl.TEXTURE1), 
                    gl.bindTexture(gl.TEXTURE_2D, tempTexture), gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0), 
                    flare.positionScreen.copy(screenPosition), flare.customUpdateCallback ? flare.customUpdateCallback(flare) : flare.updateLensFlares(), 
                    gl.uniform1i(uniforms.renderType, 2), gl.enable(gl.BLEND);
                    for (var j = 0, jl = flare.lensFlares.length; jl > j; j++) {
                        var sprite = flare.lensFlares[j];
                        sprite.opacity > .001 && sprite.scale > .001 && (screenPosition.x = sprite.x, screenPosition.y = sprite.y, 
                        screenPosition.z = sprite.z, size = sprite.size * sprite.scale / viewportHeight, 
                        scale.x = size * invAspect, scale.y = size, gl.uniform3f(uniforms.screenPosition, screenPosition.x, screenPosition.y, screenPosition.z), 
                        gl.uniform2f(uniforms.scale, scale.x, scale.y), gl.uniform1f(uniforms.rotation, sprite.rotation), 
                        gl.uniform1f(uniforms.opacity, sprite.opacity), gl.uniform3f(uniforms.color, sprite.color.r, sprite.color.g, sprite.color.b), 
                        renderer.state.setBlending(sprite.blending, sprite.blendEquation, sprite.blendSrc, sprite.blendDst), 
                        renderer.setTexture(sprite.texture, 1), gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0));
                    }
                }
            }
            gl.enable(gl.CULL_FACE), gl.enable(gl.DEPTH_TEST), gl.depthMask(!0), renderer.resetGLState();
        }
    };
}, THREE.ShadowMapPlugin = function(_renderer, _lights, _webglObjects, _webglObjectsImmediate) {
    function projectObject(scene, object, shadowCamera) {
        if (object.visible) {
            var webglObjects = _webglObjects[object.id];
            if (webglObjects && object.castShadow && (object.frustumCulled === !1 || _frustum.intersectsObject(object) === !0)) for (var i = 0, l = webglObjects.length; l > i; i++) {
                var webglObject = webglObjects[i];
                object._modelViewMatrix.multiplyMatrices(shadowCamera.matrixWorldInverse, object.matrixWorld), 
                _renderList.push(webglObject);
            }
            for (var i = 0, l = object.children.length; l > i; i++) projectObject(scene, object.children[i], shadowCamera);
        }
    }
    function createVirtualLight(light, cascade) {
        var virtualLight = new THREE.DirectionalLight();
        virtualLight.isVirtual = !0, virtualLight.onlyShadow = !0, virtualLight.castShadow = !0, 
        virtualLight.shadowCameraNear = light.shadowCameraNear, virtualLight.shadowCameraFar = light.shadowCameraFar, 
        virtualLight.shadowCameraLeft = light.shadowCameraLeft, virtualLight.shadowCameraRight = light.shadowCameraRight, 
        virtualLight.shadowCameraBottom = light.shadowCameraBottom, virtualLight.shadowCameraTop = light.shadowCameraTop, 
        virtualLight.shadowCameraVisible = light.shadowCameraVisible, virtualLight.shadowDarkness = light.shadowDarkness, 
        virtualLight.shadowBias = light.shadowCascadeBias[cascade], virtualLight.shadowMapWidth = light.shadowCascadeWidth[cascade], 
        virtualLight.shadowMapHeight = light.shadowCascadeHeight[cascade], virtualLight.pointsWorld = [], 
        virtualLight.pointsFrustum = [];
        for (var pointsWorld = virtualLight.pointsWorld, pointsFrustum = virtualLight.pointsFrustum, i = 0; 8 > i; i++) pointsWorld[i] = new THREE.Vector3(), 
        pointsFrustum[i] = new THREE.Vector3();
        var nearZ = light.shadowCascadeNearZ[cascade], farZ = light.shadowCascadeFarZ[cascade];
        return pointsFrustum[0].set(-1, -1, nearZ), pointsFrustum[1].set(1, -1, nearZ), 
        pointsFrustum[2].set(-1, 1, nearZ), pointsFrustum[3].set(1, 1, nearZ), pointsFrustum[4].set(-1, -1, farZ), 
        pointsFrustum[5].set(1, -1, farZ), pointsFrustum[6].set(-1, 1, farZ), pointsFrustum[7].set(1, 1, farZ), 
        virtualLight;
    }
    function updateVirtualLight(light, cascade) {
        var virtualLight = light.shadowCascadeArray[cascade];
        virtualLight.position.copy(light.position), virtualLight.target.position.copy(light.target.position), 
        virtualLight.lookAt(virtualLight.target), virtualLight.shadowCameraVisible = light.shadowCameraVisible, 
        virtualLight.shadowDarkness = light.shadowDarkness, virtualLight.shadowBias = light.shadowCascadeBias[cascade];
        var nearZ = light.shadowCascadeNearZ[cascade], farZ = light.shadowCascadeFarZ[cascade], pointsFrustum = virtualLight.pointsFrustum;
        pointsFrustum[0].z = nearZ, pointsFrustum[1].z = nearZ, pointsFrustum[2].z = nearZ, 
        pointsFrustum[3].z = nearZ, pointsFrustum[4].z = farZ, pointsFrustum[5].z = farZ, 
        pointsFrustum[6].z = farZ, pointsFrustum[7].z = farZ;
    }
    function updateShadowCamera(camera, light) {
        var shadowCamera = light.shadowCamera, pointsFrustum = light.pointsFrustum, pointsWorld = light.pointsWorld;
        _min.set(1 / 0, 1 / 0, 1 / 0), _max.set(-(1 / 0), -(1 / 0), -(1 / 0));
        for (var i = 0; 8 > i; i++) {
            var p = pointsWorld[i];
            p.copy(pointsFrustum[i]), p.unproject(camera), p.applyMatrix4(shadowCamera.matrixWorldInverse), 
            p.x < _min.x && (_min.x = p.x), p.x > _max.x && (_max.x = p.x), p.y < _min.y && (_min.y = p.y), 
            p.y > _max.y && (_max.y = p.y), p.z < _min.z && (_min.z = p.z), p.z > _max.z && (_max.z = p.z);
        }
        shadowCamera.left = _min.x, shadowCamera.right = _max.x, shadowCamera.top = _max.y, 
        shadowCamera.bottom = _min.y, shadowCamera.updateProjectionMatrix();
    }
    function getObjectMaterial(object) {
        return object.material instanceof THREE.MeshFaceMaterial ? object.material.materials[0] : object.material;
    }
    var _depthMaterial, _depthMaterialMorph, _depthMaterialSkin, _depthMaterialMorphSkin, _gl = _renderer.context, _frustum = new THREE.Frustum(), _projScreenMatrix = new THREE.Matrix4(), _min = new THREE.Vector3(), _max = new THREE.Vector3(), _matrixPosition = new THREE.Vector3(), _renderList = [], depthShader = THREE.ShaderLib.depthRGBA, depthUniforms = THREE.UniformsUtils.clone(depthShader.uniforms);
    _depthMaterial = new THREE.ShaderMaterial({
        uniforms: depthUniforms,
        vertexShader: depthShader.vertexShader,
        fragmentShader: depthShader.fragmentShader
    }), _depthMaterialMorph = new THREE.ShaderMaterial({
        uniforms: depthUniforms,
        vertexShader: depthShader.vertexShader,
        fragmentShader: depthShader.fragmentShader,
        morphTargets: !0
    }), _depthMaterialSkin = new THREE.ShaderMaterial({
        uniforms: depthUniforms,
        vertexShader: depthShader.vertexShader,
        fragmentShader: depthShader.fragmentShader,
        skinning: !0
    }), _depthMaterialMorphSkin = new THREE.ShaderMaterial({
        uniforms: depthUniforms,
        vertexShader: depthShader.vertexShader,
        fragmentShader: depthShader.fragmentShader,
        morphTargets: !0,
        skinning: !0
    }), _depthMaterial._shadowPass = !0, _depthMaterialMorph._shadowPass = !0, _depthMaterialSkin._shadowPass = !0, 
    _depthMaterialMorphSkin._shadowPass = !0, this.render = function(scene, camera) {
        if (_renderer.shadowMapEnabled !== !1) {
            var i, il, j, jl, n, shadowMap, shadowMatrix, shadowCamera, buffer, material, webglObject, object, light, lights = [], k = 0, fog = null;
            for (_gl.clearColor(1, 1, 1, 1), _gl.disable(_gl.BLEND), _gl.enable(_gl.CULL_FACE), 
            _gl.frontFace(_gl.CCW), _renderer.shadowMapCullFace === THREE.CullFaceFront ? _gl.cullFace(_gl.FRONT) : _gl.cullFace(_gl.BACK), 
            _renderer.state.setDepthTest(!0), i = 0, il = _lights.length; il > i; i++) if (light = _lights[i], 
            light.castShadow) if (light instanceof THREE.DirectionalLight && light.shadowCascade) for (n = 0; n < light.shadowCascadeCount; n++) {
                var virtualLight;
                if (light.shadowCascadeArray[n]) virtualLight = light.shadowCascadeArray[n]; else {
                    virtualLight = createVirtualLight(light, n), virtualLight.originalCamera = camera;
                    var gyro = new THREE.Gyroscope();
                    gyro.position.copy(light.shadowCascadeOffset), gyro.add(virtualLight), gyro.add(virtualLight.target), 
                    camera.add(gyro), light.shadowCascadeArray[n] = virtualLight;
                }
                updateVirtualLight(light, n), lights[k] = virtualLight, k++;
            } else lights[k] = light, k++;
            for (i = 0, il = lights.length; il > i; i++) {
                if (light = lights[i], !light.shadowMap) {
                    var shadowFilter = THREE.LinearFilter;
                    _renderer.shadowMapType === THREE.PCFSoftShadowMap && (shadowFilter = THREE.NearestFilter);
                    var pars = {
                        minFilter: shadowFilter,
                        magFilter: shadowFilter,
                        format: THREE.RGBAFormat
                    };
                    light.shadowMap = new THREE.WebGLRenderTarget(light.shadowMapWidth, light.shadowMapHeight, pars), 
                    light.shadowMapSize = new THREE.Vector2(light.shadowMapWidth, light.shadowMapHeight), 
                    light.shadowMatrix = new THREE.Matrix4();
                }
                if (!light.shadowCamera) {
                    if (light instanceof THREE.SpotLight) light.shadowCamera = new THREE.PerspectiveCamera(light.shadowCameraFov, light.shadowMapWidth / light.shadowMapHeight, light.shadowCameraNear, light.shadowCameraFar); else {
                        if (!(light instanceof THREE.DirectionalLight)) {
                            THREE.error("THREE.ShadowMapPlugin: Unsupported light type for shadow", light);
                            continue;
                        }
                        light.shadowCamera = new THREE.OrthographicCamera(light.shadowCameraLeft, light.shadowCameraRight, light.shadowCameraTop, light.shadowCameraBottom, light.shadowCameraNear, light.shadowCameraFar);
                    }
                    scene.add(light.shadowCamera), scene.autoUpdate === !0 && scene.updateMatrixWorld();
                }
                light.shadowCameraVisible && !light.cameraHelper && (light.cameraHelper = new THREE.CameraHelper(light.shadowCamera), 
                scene.add(light.cameraHelper)), light.isVirtual && virtualLight.originalCamera == camera && updateShadowCamera(camera, light), 
                shadowMap = light.shadowMap, shadowMatrix = light.shadowMatrix, shadowCamera = light.shadowCamera, 
                shadowCamera.position.setFromMatrixPosition(light.matrixWorld), _matrixPosition.setFromMatrixPosition(light.target.matrixWorld), 
                shadowCamera.lookAt(_matrixPosition), shadowCamera.updateMatrixWorld(), shadowCamera.matrixWorldInverse.getInverse(shadowCamera.matrixWorld), 
                light.cameraHelper && (light.cameraHelper.visible = light.shadowCameraVisible), 
                light.shadowCameraVisible && light.cameraHelper.update(), shadowMatrix.set(.5, 0, 0, .5, 0, .5, 0, .5, 0, 0, .5, .5, 0, 0, 0, 1), 
                shadowMatrix.multiply(shadowCamera.projectionMatrix), shadowMatrix.multiply(shadowCamera.matrixWorldInverse), 
                _projScreenMatrix.multiplyMatrices(shadowCamera.projectionMatrix, shadowCamera.matrixWorldInverse), 
                _frustum.setFromMatrix(_projScreenMatrix), _renderer.setRenderTarget(shadowMap), 
                _renderer.clear(), _renderList.length = 0, projectObject(scene, scene, shadowCamera);
                var objectMaterial, useMorphing, useSkinning;
                for (j = 0, jl = _renderList.length; jl > j; j++) webglObject = _renderList[j], 
                object = webglObject.object, buffer = webglObject.buffer, objectMaterial = getObjectMaterial(object), 
                useMorphing = void 0 !== object.geometry.morphTargets && object.geometry.morphTargets.length > 0 && objectMaterial.morphTargets, 
                useSkinning = object instanceof THREE.SkinnedMesh && objectMaterial.skinning, material = object.customDepthMaterial ? object.customDepthMaterial : useSkinning ? useMorphing ? _depthMaterialMorphSkin : _depthMaterialSkin : useMorphing ? _depthMaterialMorph : _depthMaterial, 
                _renderer.setMaterialFaces(objectMaterial), buffer instanceof THREE.BufferGeometry ? _renderer.renderBufferDirect(shadowCamera, _lights, fog, material, buffer, object) : _renderer.renderBuffer(shadowCamera, _lights, fog, material, buffer, object);
                for (j = 0, jl = _webglObjectsImmediate.length; jl > j; j++) webglObject = _webglObjectsImmediate[j], 
                object = webglObject.object, object.visible && object.castShadow && (object._modelViewMatrix.multiplyMatrices(shadowCamera.matrixWorldInverse, object.matrixWorld), 
                _renderer.renderImmediateObject(shadowCamera, _lights, fog, _depthMaterial, object));
            }
            var clearColor = _renderer.getClearColor(), clearAlpha = _renderer.getClearAlpha();
            _gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearAlpha), _gl.enable(_gl.BLEND), 
            _renderer.shadowMapCullFace === THREE.CullFaceFront && _gl.cullFace(_gl.BACK), _renderer.resetGLState();
        }
    };
}, THREE.SpritePlugin = function(renderer, sprites) {
    function createProgram() {
        var program = gl.createProgram(), vertexShader = gl.createShader(gl.VERTEX_SHADER), fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        return gl.shaderSource(vertexShader, [ "precision " + renderer.getPrecision() + " float;", "uniform mat4 modelViewMatrix;", "uniform mat4 projectionMatrix;", "uniform float rotation;", "uniform vec2 scale;", "uniform vec2 uvOffset;", "uniform vec2 uvScale;", "attribute vec2 position;", "attribute vec2 uv;", "varying vec2 vUV;", "void main() {", "vUV = uvOffset + uv * uvScale;", "vec2 alignedPosition = position * scale;", "vec2 rotatedPosition;", "rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;", "rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;", "vec4 finalPosition;", "finalPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );", "finalPosition.xy += rotatedPosition;", "finalPosition = projectionMatrix * finalPosition;", "gl_Position = finalPosition;", "}" ].join("\n")), 
        gl.shaderSource(fragmentShader, [ "precision " + renderer.getPrecision() + " float;", "uniform vec3 color;", "uniform sampler2D map;", "uniform float opacity;", "uniform int fogType;", "uniform vec3 fogColor;", "uniform float fogDensity;", "uniform float fogNear;", "uniform float fogFar;", "uniform float alphaTest;", "varying vec2 vUV;", "void main() {", "vec4 texture = texture2D( map, vUV );", "if ( texture.a < alphaTest ) discard;", "gl_FragColor = vec4( color * texture.xyz, texture.a * opacity );", "if ( fogType > 0 ) {", "float depth = gl_FragCoord.z / gl_FragCoord.w;", "float fogFactor = 0.0;", "if ( fogType == 1 ) {", "fogFactor = smoothstep( fogNear, fogFar, depth );", "} else {", "const float LOG2 = 1.442695;", "float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );", "fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );", "}", "gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );", "}", "}" ].join("\n")), 
        gl.compileShader(vertexShader), gl.compileShader(fragmentShader), gl.attachShader(program, vertexShader), 
        gl.attachShader(program, fragmentShader), gl.linkProgram(program), program;
    }
    function painterSortStable(a, b) {
        return a.z !== b.z ? b.z - a.z : b.id - a.id;
    }
    var vertexBuffer, elementBuffer, program, attributes, uniforms, texture, gl = renderer.context, spritePosition = new THREE.Vector3(), spriteRotation = new THREE.Quaternion(), spriteScale = new THREE.Vector3(), init = function() {
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
    };
    this.render = function(scene, camera) {
        if (0 !== sprites.length) {
            void 0 === program && init(), gl.useProgram(program), gl.enableVertexAttribArray(attributes.position), 
            gl.enableVertexAttribArray(attributes.uv), gl.disable(gl.CULL_FACE), gl.enable(gl.BLEND), 
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer), gl.vertexAttribPointer(attributes.position, 2, gl.FLOAT, !1, 16, 0), 
            gl.vertexAttribPointer(attributes.uv, 2, gl.FLOAT, !1, 16, 8), gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer), 
            gl.uniformMatrix4fv(uniforms.projectionMatrix, !1, camera.projectionMatrix.elements), 
            gl.activeTexture(gl.TEXTURE0), gl.uniform1i(uniforms.map, 0);
            var oldFogType = 0, sceneFogType = 0, fog = scene.fog;
            fog ? (gl.uniform3f(uniforms.fogColor, fog.color.r, fog.color.g, fog.color.b), fog instanceof THREE.Fog ? (gl.uniform1f(uniforms.fogNear, fog.near), 
            gl.uniform1f(uniforms.fogFar, fog.far), gl.uniform1i(uniforms.fogType, 1), oldFogType = 1, 
            sceneFogType = 1) : fog instanceof THREE.FogExp2 && (gl.uniform1f(uniforms.fogDensity, fog.density), 
            gl.uniform1i(uniforms.fogType, 2), oldFogType = 2, sceneFogType = 2)) : (gl.uniform1i(uniforms.fogType, 0), 
            oldFogType = 0, sceneFogType = 0);
            for (var i = 0, l = sprites.length; l > i; i++) {
                var sprite = sprites[i];
                sprite._modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, sprite.matrixWorld), 
                sprite.z = -sprite._modelViewMatrix.elements[14];
            }
            sprites.sort(painterSortStable);
            for (var scale = [], i = 0, l = sprites.length; l > i; i++) {
                var sprite = sprites[i], material = sprite.material;
                gl.uniform1f(uniforms.alphaTest, material.alphaTest), gl.uniformMatrix4fv(uniforms.modelViewMatrix, !1, sprite._modelViewMatrix.elements), 
                sprite.matrixWorld.decompose(spritePosition, spriteRotation, spriteScale), scale[0] = spriteScale.x, 
                scale[1] = spriteScale.y;
                var fogType = 0;
                scene.fog && material.fog && (fogType = sceneFogType), oldFogType !== fogType && (gl.uniform1i(uniforms.fogType, fogType), 
                oldFogType = fogType), null !== material.map ? (gl.uniform2f(uniforms.uvOffset, material.map.offset.x, material.map.offset.y), 
                gl.uniform2f(uniforms.uvScale, material.map.repeat.x, material.map.repeat.y)) : (gl.uniform2f(uniforms.uvOffset, 0, 0), 
                gl.uniform2f(uniforms.uvScale, 1, 1)), gl.uniform1f(uniforms.opacity, material.opacity), 
                gl.uniform3f(uniforms.color, material.color.r, material.color.g, material.color.b), 
                gl.uniform1f(uniforms.rotation, material.rotation), gl.uniform2fv(uniforms.scale, scale), 
                renderer.state.setBlending(material.blending, material.blendEquation, material.blendSrc, material.blendDst), 
                renderer.state.setDepthTest(material.depthTest), renderer.state.setDepthWrite(material.depthWrite), 
                material.map && material.map.image && material.map.image.width ? renderer.setTexture(material.map, 0) : renderer.setTexture(texture, 0), 
                gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
            }
            gl.enable(gl.CULL_FACE), renderer.resetGLState();
        }
    };
}, THREE.GeometryUtils = {
    merge: function(geometry1, geometry2, materialIndexOffset) {
        THREE.warn("THREE.GeometryUtils: .merge() has been moved to Geometry. Use geometry.merge( geometry2, matrix, materialIndexOffset ) instead.");
        var matrix;
        geometry2 instanceof THREE.Mesh && (geometry2.matrixAutoUpdate && geometry2.updateMatrix(), 
        matrix = geometry2.matrix, geometry2 = geometry2.geometry), geometry1.merge(geometry2, matrix, materialIndexOffset);
    },
    center: function(geometry) {
        return THREE.warn("THREE.GeometryUtils: .center() has been moved to Geometry. Use geometry.center() instead."), 
        geometry.center();
    }
}, THREE.ImageUtils = {
    crossOrigin: void 0,
    loadTexture: function(url, mapping, onLoad, onError) {
        var loader = new THREE.ImageLoader();
        loader.crossOrigin = this.crossOrigin;
        var texture = new THREE.Texture(void 0, mapping);
        return loader.load(url, function(image) {
            texture.image = image, texture.needsUpdate = !0, onLoad && onLoad(texture);
        }, void 0, function(event) {
            onError && onError(event);
        }), texture.sourceFile = url, texture;
    },
    loadTextureCube: function(array, mapping, onLoad, onError) {
        var images = [], loader = new THREE.ImageLoader();
        loader.crossOrigin = this.crossOrigin;
        var texture = new THREE.CubeTexture(images, mapping);
        texture.flipY = !1;
        for (var loaded = 0, loadTexture = function(i) {
            loader.load(array[i], function(image) {
                texture.images[i] = image, loaded += 1, 6 === loaded && (texture.needsUpdate = !0, 
                onLoad && onLoad(texture));
            }, void 0, onError);
        }, i = 0, il = array.length; il > i; ++i) loadTexture(i);
        return texture;
    },
    loadCompressedTexture: function() {
        THREE.error("THREE.ImageUtils.loadCompressedTexture has been removed. Use THREE.DDSLoader instead.");
    },
    loadCompressedTextureCube: function() {
        THREE.error("THREE.ImageUtils.loadCompressedTextureCube has been removed. Use THREE.DDSLoader instead.");
    },
    getNormalMap: function(image, depth) {
        var cross = function(a, b) {
            return [ a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0] ];
        }, subtract = function(a, b) {
            return [ a[0] - b[0], a[1] - b[1], a[2] - b[2] ];
        }, normalize = function(a) {
            var l = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
            return [ a[0] / l, a[1] / l, a[2] / l ];
        };
        depth = 1 | depth;
        var width = image.width, height = image.height, canvas = document.createElement("canvas");
        canvas.width = width, canvas.height = height;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);
        for (var data = context.getImageData(0, 0, width, height).data, imageData = context.createImageData(width, height), output = imageData.data, x = 0; width > x; x++) for (var y = 0; height > y; y++) {
            var ly = 0 > y - 1 ? 0 : y - 1, uy = y + 1 > height - 1 ? height - 1 : y + 1, lx = 0 > x - 1 ? 0 : x - 1, ux = x + 1 > width - 1 ? width - 1 : x + 1, points = [], origin = [ 0, 0, data[4 * (y * width + x)] / 255 * depth ];
            points.push([ -1, 0, data[4 * (y * width + lx)] / 255 * depth ]), points.push([ -1, -1, data[4 * (ly * width + lx)] / 255 * depth ]), 
            points.push([ 0, -1, data[4 * (ly * width + x)] / 255 * depth ]), points.push([ 1, -1, data[4 * (ly * width + ux)] / 255 * depth ]), 
            points.push([ 1, 0, data[4 * (y * width + ux)] / 255 * depth ]), points.push([ 1, 1, data[4 * (uy * width + ux)] / 255 * depth ]), 
            points.push([ 0, 1, data[4 * (uy * width + x)] / 255 * depth ]), points.push([ -1, 1, data[4 * (uy * width + lx)] / 255 * depth ]);
            for (var normals = [], num_points = points.length, i = 0; num_points > i; i++) {
                var v1 = points[i], v2 = points[(i + 1) % num_points];
                v1 = subtract(v1, origin), v2 = subtract(v2, origin), normals.push(normalize(cross(v1, v2)));
            }
            for (var normal = [ 0, 0, 0 ], i = 0; i < normals.length; i++) normal[0] += normals[i][0], 
            normal[1] += normals[i][1], normal[2] += normals[i][2];
            normal[0] /= normals.length, normal[1] /= normals.length, normal[2] /= normals.length;
            var idx = 4 * (y * width + x);
            output[idx] = (normal[0] + 1) / 2 * 255 | 0, output[idx + 1] = (normal[1] + 1) / 2 * 255 | 0, 
            output[idx + 2] = 255 * normal[2] | 0, output[idx + 3] = 255;
        }
        return context.putImageData(imageData, 0, 0), canvas;
    },
    generateDataTexture: function(width, height, color) {
        for (var size = width * height, data = new Uint8Array(3 * size), r = Math.floor(255 * color.r), g = Math.floor(255 * color.g), b = Math.floor(255 * color.b), i = 0; size > i; i++) data[3 * i] = r, 
        data[3 * i + 1] = g, data[3 * i + 2] = b;
        var texture = new THREE.DataTexture(data, width, height, THREE.RGBFormat);
        return texture.needsUpdate = !0, texture;
    }
}, THREE.SceneUtils = {
    createMultiMaterialObject: function(geometry, materials) {
        for (var group = new THREE.Object3D(), i = 0, l = materials.length; l > i; i++) group.add(new THREE.Mesh(geometry, materials[i]));
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
}, THREE.FontUtils = {
    faces: {},
    face: "helvetiker",
    weight: "normal",
    style: "normal",
    size: 150,
    divisions: 10,
    getFace: function() {
        try {
            return this.faces[this.face][this.weight][this.style];
        } catch (e) {
            throw "The font " + this.face + " with " + this.weight + " weight and " + this.style + " style is missing.";
        }
    },
    loadFace: function(data) {
        var family = data.familyName.toLowerCase(), ThreeFont = this;
        return ThreeFont.faces[family] = ThreeFont.faces[family] || {}, ThreeFont.faces[family][data.cssFontWeight] = ThreeFont.faces[family][data.cssFontWeight] || {}, 
        ThreeFont.faces[family][data.cssFontWeight][data.cssFontStyle] = data, ThreeFont.faces[family][data.cssFontWeight][data.cssFontStyle] = data, 
        data;
    },
    drawText: function(text) {
        var i, face = this.getFace(), scale = this.size / face.resolution, offset = 0, chars = String(text).split(""), length = chars.length, fontPaths = [];
        for (i = 0; length > i; i++) {
            var path = new THREE.Path(), ret = this.extractGlyphPoints(chars[i], face, scale, offset, path);
            offset += ret.offset, fontPaths.push(ret.path);
        }
        var width = offset / 2;
        return {
            paths: fontPaths,
            offset: width
        };
    },
    extractGlyphPoints: function(c, face, scale, offset, path) {
        var i, i2, divisions, outline, action, length, scaleX, scaleY, x, y, cpx, cpy, cpx0, cpy0, cpx1, cpy1, cpx2, cpy2, laste, pts = [], glyph = face.glyphs[c] || face.glyphs["?"];
        if (glyph) {
            if (glyph.o) for (outline = glyph._cachedOutline || (glyph._cachedOutline = glyph.o.split(" ")), 
            length = outline.length, scaleX = scale, scaleY = scale, i = 0; length > i; ) switch (action = outline[i++]) {
              case "m":
                x = outline[i++] * scaleX + offset, y = outline[i++] * scaleY, path.moveTo(x, y);
                break;

              case "l":
                x = outline[i++] * scaleX + offset, y = outline[i++] * scaleY, path.lineTo(x, y);
                break;

              case "q":
                if (cpx = outline[i++] * scaleX + offset, cpy = outline[i++] * scaleY, cpx1 = outline[i++] * scaleX + offset, 
                cpy1 = outline[i++] * scaleY, path.quadraticCurveTo(cpx1, cpy1, cpx, cpy), laste = pts[pts.length - 1]) for (cpx0 = laste.x, 
                cpy0 = laste.y, i2 = 1, divisions = this.divisions; divisions >= i2; i2++) {
                    var t = i2 / divisions;
                    THREE.Shape.Utils.b2(t, cpx0, cpx1, cpx), THREE.Shape.Utils.b2(t, cpy0, cpy1, cpy);
                }
                break;

              case "b":
                if (cpx = outline[i++] * scaleX + offset, cpy = outline[i++] * scaleY, cpx1 = outline[i++] * scaleX + offset, 
                cpy1 = outline[i++] * scaleY, cpx2 = outline[i++] * scaleX + offset, cpy2 = outline[i++] * scaleY, 
                path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, cpx, cpy), laste = pts[pts.length - 1]) for (cpx0 = laste.x, 
                cpy0 = laste.y, i2 = 1, divisions = this.divisions; divisions >= i2; i2++) {
                    var t = i2 / divisions;
                    THREE.Shape.Utils.b3(t, cpx0, cpx1, cpx2, cpx), THREE.Shape.Utils.b3(t, cpy0, cpy1, cpy2, cpy);
                }
            }
            return {
                offset: glyph.ha * scale,
                path: path
            };
        }
    }
}, THREE.FontUtils.generateShapes = function(text, parameters) {
    parameters = parameters || {};
    var size = void 0 !== parameters.size ? parameters.size : 100, curveSegments = void 0 !== parameters.curveSegments ? parameters.curveSegments : 4, font = void 0 !== parameters.font ? parameters.font : "helvetiker", weight = void 0 !== parameters.weight ? parameters.weight : "normal", style = void 0 !== parameters.style ? parameters.style : "normal";
    THREE.FontUtils.size = size, THREE.FontUtils.divisions = curveSegments, THREE.FontUtils.face = font, 
    THREE.FontUtils.weight = weight, THREE.FontUtils.style = style;
    for (var data = THREE.FontUtils.drawText(text), paths = data.paths, shapes = [], p = 0, pl = paths.length; pl > p; p++) Array.prototype.push.apply(shapes, paths[p].toShapes());
    return shapes;
}, function(namespace) {
    var EPSILON = 1e-10, process = function(contour, indices) {
        var n = contour.length;
        if (3 > n) return null;
        var u, v, w, result = [], verts = [], vertIndices = [];
        if (area(contour) > 0) for (v = 0; n > v; v++) verts[v] = v; else for (v = 0; n > v; v++) verts[v] = n - 1 - v;
        var nv = n, count = 2 * nv;
        for (v = nv - 1; nv > 2; ) {
            if (count-- <= 0) return THREE.warn("THREE.FontUtils: Warning, unable to triangulate polygon! in Triangulate.process()"), 
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
    }, area = function(contour) {
        for (var n = contour.length, a = 0, p = n - 1, q = 0; n > q; p = q++) a += contour[p].x * contour[q].y - contour[q].x * contour[p].y;
        return .5 * a;
    }, snip = function(contour, u, v, w, n, verts) {
        var p, ax, ay, bx, by, cx, cy, px, py;
        if (ax = contour[verts[u]].x, ay = contour[verts[u]].y, bx = contour[verts[v]].x, 
        by = contour[verts[v]].y, cx = contour[verts[w]].x, cy = contour[verts[w]].y, EPSILON > (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)) return !1;
        var aX, aY, bX, bY, cX, cY, apx, apy, bpx, bpy, cpx, cpy, cCROSSap, bCROSScp, aCROSSbp;
        for (aX = cx - bx, aY = cy - by, bX = ax - cx, bY = ay - cy, cX = bx - ax, cY = by - ay, 
        p = 0; n > p; p++) if (px = contour[verts[p]].x, py = contour[verts[p]].y, !(px === ax && py === ay || px === bx && py === by || px === cx && py === cy) && (apx = px - ax, 
        apy = py - ay, bpx = px - bx, bpy = py - by, cpx = px - cx, cpy = py - cy, aCROSSbp = aX * bpy - aY * bpx, 
        cCROSSap = cX * apy - cY * apx, bCROSScp = bX * cpy - bY * cpx, aCROSSbp >= -EPSILON && bCROSScp >= -EPSILON && cCROSSap >= -EPSILON)) return !1;
        return !0;
    };
    return namespace.Triangulate = process, namespace.Triangulate.area = area, namespace;
}(THREE.FontUtils), self._typeface_js = {
    faces: THREE.FontUtils.faces,
    loadFace: THREE.FontUtils.loadFace
}, THREE.typeface_js = self._typeface_js, THREE.Audio = function(listener) {
    THREE.Object3D.call(this), this.type = "Audio", this.context = listener.context, 
    this.source = this.context.createBufferSource(), this.source.onended = this.onEnded.bind(this), 
    this.gain = this.context.createGain(), this.gain.connect(this.context.destination), 
    this.panner = this.context.createPanner(), this.panner.connect(this.gain), this.autoplay = !1, 
    this.startTime = 0, this.isPlaying = !1;
}, THREE.Audio.prototype = Object.create(THREE.Object3D.prototype), THREE.Audio.prototype.constructor = THREE.Audio, 
THREE.Audio.prototype.load = function(file) {
    var scope = this, request = new XMLHttpRequest();
    return request.open("GET", file, !0), request.responseType = "arraybuffer", request.onload = function(e) {
        scope.context.decodeAudioData(this.response, function(buffer) {
            scope.source.buffer = buffer, scope.autoplay && scope.play();
        });
    }, request.send(), this;
}, THREE.Audio.prototype.play = function() {
    if (this.isPlaying === !0) return void THREE.warn("THREE.Audio: Audio is already playing.");
    var source = this.context.createBufferSource();
    source.buffer = this.source.buffer, source.loop = this.source.loop, source.onended = this.source.onended, 
    source.connect(this.panner), source.start(0, this.startTime), this.isPlaying = !0, 
    this.source = source;
}, THREE.Audio.prototype.pause = function() {
    this.source.stop(), this.startTime = this.context.currentTime;
}, THREE.Audio.prototype.stop = function() {
    this.source.stop(), this.startTime = 0;
}, THREE.Audio.prototype.onEnded = function() {
    this.isPlaying = !1;
}, THREE.Audio.prototype.setLoop = function(value) {
    this.source.loop = value;
}, THREE.Audio.prototype.setRefDistance = function(value) {
    this.panner.refDistance = value;
}, THREE.Audio.prototype.setRolloffFactor = function(value) {
    this.panner.rolloffFactor = value;
}, THREE.Audio.prototype.setVolume = function(value) {
    this.gain.gain.value = value;
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
    var position = new THREE.Vector3(), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3(), orientation = new THREE.Vector3(), velocity = new THREE.Vector3(), positionPrev = new THREE.Vector3();
    return function(force) {
        THREE.Object3D.prototype.updateMatrixWorld.call(this, force);
        var listener = this.context.listener, up = this.up;
        this.matrixWorld.decompose(position, quaternion, scale), orientation.set(0, 0, -1).applyQuaternion(quaternion), 
        velocity.subVectors(position, positionPrev), listener.setPosition(position.x, position.y, position.z), 
        listener.setOrientation(orientation.x, orientation.y, orientation.z, up.x, up.y, up.z), 
        listener.setVelocity(velocity.x, velocity.y, velocity.z), positionPrev.copy(position);
    };
}(), THREE.Curve = function() {}, THREE.Curve.prototype.getPoint = function(t) {
    return THREE.warn("THREE.Curve: Warning, getPoint() not implemented!"), null;
}, THREE.Curve.prototype.getPointAt = function(u) {
    var t = this.getUtoTmapping(u);
    return this.getPoint(t);
}, THREE.Curve.prototype.getPoints = function(divisions) {
    divisions || (divisions = 5);
    var d, pts = [];
    for (d = 0; divisions >= d; d++) pts.push(this.getPoint(d / divisions));
    return pts;
}, THREE.Curve.prototype.getSpacedPoints = function(divisions) {
    divisions || (divisions = 5);
    var d, pts = [];
    for (d = 0; divisions >= d; d++) pts.push(this.getPointAt(d / divisions));
    return pts;
}, THREE.Curve.prototype.getLength = function() {
    var lengths = this.getLengths();
    return lengths[lengths.length - 1];
}, THREE.Curve.prototype.getLengths = function(divisions) {
    if (divisions || (divisions = this.__arcLengthDivisions ? this.__arcLengthDivisions : 200), 
    this.cacheArcLengths && this.cacheArcLengths.length == divisions + 1 && !this.needsUpdate) return this.cacheArcLengths;
    this.needsUpdate = !1;
    var current, p, cache = [], last = this.getPoint(0), sum = 0;
    for (cache.push(0), p = 1; divisions >= p; p++) current = this.getPoint(p / divisions), 
    sum += current.distanceTo(last), cache.push(sum), last = current;
    return this.cacheArcLengths = cache, cache;
}, THREE.Curve.prototype.updateArcLengths = function() {
    this.needsUpdate = !0, this.getLengths();
}, THREE.Curve.prototype.getUtoTmapping = function(u, distance) {
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
    if (i = high, arcLengths[i] == targetArcLength) {
        var t = i / (il - 1);
        return t;
    }
    var lengthBefore = arcLengths[i], lengthAfter = arcLengths[i + 1], segmentLength = lengthAfter - lengthBefore, segmentFraction = (targetArcLength - lengthBefore) / segmentLength, t = (i + segmentFraction) / (il - 1);
    return t;
}, THREE.Curve.prototype.getTangent = function(t) {
    var delta = 1e-4, t1 = t - delta, t2 = t + delta;
    0 > t1 && (t1 = 0), t2 > 1 && (t2 = 1);
    var pt1 = this.getPoint(t1), pt2 = this.getPoint(t2), vec = pt2.clone().sub(pt1);
    return vec.normalize();
}, THREE.Curve.prototype.getTangentAt = function(u) {
    var t = this.getUtoTmapping(u);
    return this.getTangent(t);
}, THREE.Curve.Utils = {
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
}, THREE.Curve.create = function(constructor, getPointFunc) {
    return constructor.prototype = Object.create(THREE.Curve.prototype), constructor.prototype.constructor = constructor, 
    constructor.prototype.getPoint = getPointFunc, constructor;
}, THREE.CurvePath = function() {
    this.curves = [], this.bends = [], this.autoClose = !1;
}, THREE.CurvePath.prototype = Object.create(THREE.Curve.prototype), THREE.CurvePath.prototype.constructor = THREE.CurvePath, 
THREE.CurvePath.prototype.add = function(curve) {
    this.curves.push(curve);
}, THREE.CurvePath.prototype.checkConnection = function() {}, THREE.CurvePath.prototype.closePath = function() {
    var startPoint = this.curves[0].getPoint(0), endPoint = this.curves[this.curves.length - 1].getPoint(1);
    startPoint.equals(endPoint) || this.curves.push(new THREE.LineCurve(endPoint, startPoint));
}, THREE.CurvePath.prototype.getPoint = function(t) {
    for (var diff, curve, d = t * this.getLength(), curveLengths = this.getCurveLengths(), i = 0; i < curveLengths.length; ) {
        if (curveLengths[i] >= d) {
            diff = curveLengths[i] - d, curve = this.curves[i];
            var u = 1 - diff / curve.getLength();
            return curve.getPointAt(u);
        }
        i++;
    }
    return null;
}, THREE.CurvePath.prototype.getLength = function() {
    var lens = this.getCurveLengths();
    return lens[lens.length - 1];
}, THREE.CurvePath.prototype.getCurveLengths = function() {
    if (this.cacheLengths && this.cacheLengths.length == this.curves.length) return this.cacheLengths;
    var i, lengths = [], sums = 0, il = this.curves.length;
    for (i = 0; il > i; i++) sums += this.curves[i].getLength(), lengths.push(sums);
    return this.cacheLengths = lengths, lengths;
}, THREE.CurvePath.prototype.getBoundingBox = function() {
    var maxX, maxY, maxZ, minX, minY, minZ, points = this.getPoints();
    maxX = maxY = Number.NEGATIVE_INFINITY, minX = minY = Number.POSITIVE_INFINITY;
    var p, i, il, sum, v3 = points[0] instanceof THREE.Vector3;
    for (sum = v3 ? new THREE.Vector3() : new THREE.Vector2(), i = 0, il = points.length; il > i; i++) p = points[i], 
    p.x > maxX ? maxX = p.x : p.x < minX && (minX = p.x), p.y > maxY ? maxY = p.y : p.y < minY && (minY = p.y), 
    v3 && (p.z > maxZ ? maxZ = p.z : p.z < minZ && (minZ = p.z)), sum.add(p);
    var ret = {
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY
    };
    return v3 && (ret.maxZ = maxZ, ret.minZ = minZ), ret;
}, THREE.CurvePath.prototype.createPointsGeometry = function(divisions) {
    var pts = this.getPoints(divisions, !0);
    return this.createGeometry(pts);
}, THREE.CurvePath.prototype.createSpacedPointsGeometry = function(divisions) {
    var pts = this.getSpacedPoints(divisions, !0);
    return this.createGeometry(pts);
}, THREE.CurvePath.prototype.createGeometry = function(points) {
    for (var geometry = new THREE.Geometry(), i = 0; i < points.length; i++) geometry.vertices.push(new THREE.Vector3(points[i].x, points[i].y, points[i].z || 0));
    return geometry;
}, THREE.CurvePath.prototype.addWrapPath = function(bendpath) {
    this.bends.push(bendpath);
}, THREE.CurvePath.prototype.getTransformedPoints = function(segments, bends) {
    var i, il, oldPts = this.getPoints(segments);
    for (bends || (bends = this.bends), i = 0, il = bends.length; il > i; i++) oldPts = this.getWrapPoints(oldPts, bends[i]);
    return oldPts;
}, THREE.CurvePath.prototype.getTransformedSpacedPoints = function(segments, bends) {
    var i, il, oldPts = this.getSpacedPoints(segments);
    for (bends || (bends = this.bends), i = 0, il = bends.length; il > i; i++) oldPts = this.getWrapPoints(oldPts, bends[i]);
    return oldPts;
}, THREE.CurvePath.prototype.getWrapPoints = function(oldPts, path) {
    var i, il, p, oldX, oldY, xNorm, bounds = this.getBoundingBox();
    for (i = 0, il = oldPts.length; il > i; i++) {
        p = oldPts[i], oldX = p.x, oldY = p.y, xNorm = oldX / bounds.maxX, xNorm = path.getUtoTmapping(xNorm, oldX);
        var pathPt = path.getPoint(xNorm), normal = path.getTangent(xNorm);
        normal.set(-normal.y, normal.x).multiplyScalar(oldY), p.x = pathPt.x + normal.x, 
        p.y = pathPt.y + normal.y;
    }
    return oldPts;
}, THREE.Gyroscope = function() {
    THREE.Object3D.call(this);
}, THREE.Gyroscope.prototype = Object.create(THREE.Object3D.prototype), THREE.Gyroscope.prototype.constructor = THREE.Gyroscope, 
THREE.Gyroscope.prototype.updateMatrixWorld = function() {
    var translationObject = new THREE.Vector3(), quaternionObject = new THREE.Quaternion(), scaleObject = new THREE.Vector3(), translationWorld = new THREE.Vector3(), quaternionWorld = new THREE.Quaternion(), scaleWorld = new THREE.Vector3();
    return function(force) {
        this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || force) && (this.parent ? (this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix), 
        this.matrixWorld.decompose(translationWorld, quaternionWorld, scaleWorld), this.matrix.decompose(translationObject, quaternionObject, scaleObject), 
        this.matrixWorld.compose(translationWorld, quaternionObject, scaleWorld)) : this.matrixWorld.copy(this.matrix), 
        this.matrixWorldNeedsUpdate = !1, force = !0);
        for (var i = 0, l = this.children.length; l > i; i++) this.children[i].updateMatrixWorld(force);
    };
}(), THREE.Path = function(points) {
    THREE.CurvePath.call(this), this.actions = [], points && this.fromPoints(points);
}, THREE.Path.prototype = Object.create(THREE.CurvePath.prototype), THREE.Path.prototype.constructor = THREE.Path, 
THREE.PathActions = {
    MOVE_TO: "moveTo",
    LINE_TO: "lineTo",
    QUADRATIC_CURVE_TO: "quadraticCurveTo",
    BEZIER_CURVE_TO: "bezierCurveTo",
    CSPLINE_THRU: "splineThru",
    ARC: "arc",
    ELLIPSE: "ellipse"
}, THREE.Path.prototype.fromPoints = function(vectors) {
    this.moveTo(vectors[0].x, vectors[0].y);
    for (var v = 1, vlen = vectors.length; vlen > v; v++) this.lineTo(vectors[v].x, vectors[v].y);
}, THREE.Path.prototype.moveTo = function(x, y) {
    var args = Array.prototype.slice.call(arguments);
    this.actions.push({
        action: THREE.PathActions.MOVE_TO,
        args: args
    });
}, THREE.Path.prototype.lineTo = function(x, y) {
    var args = Array.prototype.slice.call(arguments), lastargs = this.actions[this.actions.length - 1].args, x0 = lastargs[lastargs.length - 2], y0 = lastargs[lastargs.length - 1], curve = new THREE.LineCurve(new THREE.Vector2(x0, y0), new THREE.Vector2(x, y));
    this.curves.push(curve), this.actions.push({
        action: THREE.PathActions.LINE_TO,
        args: args
    });
}, THREE.Path.prototype.quadraticCurveTo = function(aCPx, aCPy, aX, aY) {
    var args = Array.prototype.slice.call(arguments), lastargs = this.actions[this.actions.length - 1].args, x0 = lastargs[lastargs.length - 2], y0 = lastargs[lastargs.length - 1], curve = new THREE.QuadraticBezierCurve(new THREE.Vector2(x0, y0), new THREE.Vector2(aCPx, aCPy), new THREE.Vector2(aX, aY));
    this.curves.push(curve), this.actions.push({
        action: THREE.PathActions.QUADRATIC_CURVE_TO,
        args: args
    });
}, THREE.Path.prototype.bezierCurveTo = function(aCP1x, aCP1y, aCP2x, aCP2y, aX, aY) {
    var args = Array.prototype.slice.call(arguments), lastargs = this.actions[this.actions.length - 1].args, x0 = lastargs[lastargs.length - 2], y0 = lastargs[lastargs.length - 1], curve = new THREE.CubicBezierCurve(new THREE.Vector2(x0, y0), new THREE.Vector2(aCP1x, aCP1y), new THREE.Vector2(aCP2x, aCP2y), new THREE.Vector2(aX, aY));
    this.curves.push(curve), this.actions.push({
        action: THREE.PathActions.BEZIER_CURVE_TO,
        args: args
    });
}, THREE.Path.prototype.splineThru = function(pts) {
    var args = Array.prototype.slice.call(arguments), lastargs = this.actions[this.actions.length - 1].args, x0 = lastargs[lastargs.length - 2], y0 = lastargs[lastargs.length - 1], npts = [ new THREE.Vector2(x0, y0) ];
    Array.prototype.push.apply(npts, pts);
    var curve = new THREE.SplineCurve(npts);
    this.curves.push(curve), this.actions.push({
        action: THREE.PathActions.CSPLINE_THRU,
        args: args
    });
}, THREE.Path.prototype.arc = function(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
    var lastargs = this.actions[this.actions.length - 1].args, x0 = lastargs[lastargs.length - 2], y0 = lastargs[lastargs.length - 1];
    this.absarc(aX + x0, aY + y0, aRadius, aStartAngle, aEndAngle, aClockwise);
}, THREE.Path.prototype.absarc = function(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
    this.absellipse(aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise);
}, THREE.Path.prototype.ellipse = function(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise) {
    var lastargs = this.actions[this.actions.length - 1].args, x0 = lastargs[lastargs.length - 2], y0 = lastargs[lastargs.length - 1];
    this.absellipse(aX + x0, aY + y0, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise);
}, THREE.Path.prototype.absellipse = function(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise) {
    var args = Array.prototype.slice.call(arguments), curve = new THREE.EllipseCurve(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise);
    this.curves.push(curve);
    var lastPoint = curve.getPoint(1);
    args.push(lastPoint.x), args.push(lastPoint.y), this.actions.push({
        action: THREE.PathActions.ELLIPSE,
        args: args
    });
}, THREE.Path.prototype.getSpacedPoints = function(divisions, closedPath) {
    divisions || (divisions = 40);
    for (var points = [], i = 0; divisions > i; i++) points.push(this.getPoint(i / divisions));
    return points;
}, THREE.Path.prototype.getPoints = function(divisions, closedPath) {
    if (this.useSpacedPoints) return console.log("tata"), this.getSpacedPoints(divisions, closedPath);
    divisions = divisions || 12;
    var i, il, item, action, args, cpx, cpy, cpx2, cpy2, cpx1, cpy1, cpx0, cpy0, laste, j, t, tx, ty, points = [];
    for (i = 0, il = this.actions.length; il > i; i++) switch (item = this.actions[i], 
    action = item.action, args = item.args, action) {
      case THREE.PathActions.MOVE_TO:
        points.push(new THREE.Vector2(args[0], args[1]));
        break;

      case THREE.PathActions.LINE_TO:
        points.push(new THREE.Vector2(args[0], args[1]));
        break;

      case THREE.PathActions.QUADRATIC_CURVE_TO:
        for (cpx = args[2], cpy = args[3], cpx1 = args[0], cpy1 = args[1], points.length > 0 ? (laste = points[points.length - 1], 
        cpx0 = laste.x, cpy0 = laste.y) : (laste = this.actions[i - 1].args, cpx0 = laste[laste.length - 2], 
        cpy0 = laste[laste.length - 1]), j = 1; divisions >= j; j++) t = j / divisions, 
        tx = THREE.Shape.Utils.b2(t, cpx0, cpx1, cpx), ty = THREE.Shape.Utils.b2(t, cpy0, cpy1, cpy), 
        points.push(new THREE.Vector2(tx, ty));
        break;

      case THREE.PathActions.BEZIER_CURVE_TO:
        for (cpx = args[4], cpy = args[5], cpx1 = args[0], cpy1 = args[1], cpx2 = args[2], 
        cpy2 = args[3], points.length > 0 ? (laste = points[points.length - 1], cpx0 = laste.x, 
        cpy0 = laste.y) : (laste = this.actions[i - 1].args, cpx0 = laste[laste.length - 2], 
        cpy0 = laste[laste.length - 1]), j = 1; divisions >= j; j++) t = j / divisions, 
        tx = THREE.Shape.Utils.b3(t, cpx0, cpx1, cpx2, cpx), ty = THREE.Shape.Utils.b3(t, cpy0, cpy1, cpy2, cpy), 
        points.push(new THREE.Vector2(tx, ty));
        break;

      case THREE.PathActions.CSPLINE_THRU:
        laste = this.actions[i - 1].args;
        var last = new THREE.Vector2(laste[laste.length - 2], laste[laste.length - 1]), spts = [ last ], n = divisions * args[0].length;
        spts = spts.concat(args[0]);
        var spline = new THREE.SplineCurve(spts);
        for (j = 1; n >= j; j++) points.push(spline.getPointAt(j / n));
        break;

      case THREE.PathActions.ARC:
        var angle, aX = args[0], aY = args[1], aRadius = args[2], aStartAngle = args[3], aEndAngle = args[4], aClockwise = !!args[5], deltaAngle = aEndAngle - aStartAngle, tdivisions = 2 * divisions;
        for (j = 1; tdivisions >= j; j++) t = j / tdivisions, aClockwise || (t = 1 - t), 
        angle = aStartAngle + t * deltaAngle, tx = aX + aRadius * Math.cos(angle), ty = aY + aRadius * Math.sin(angle), 
        points.push(new THREE.Vector2(tx, ty));
        break;

      case THREE.PathActions.ELLIPSE:
        var angle, aX = args[0], aY = args[1], xRadius = args[2], yRadius = args[3], aStartAngle = args[4], aEndAngle = args[5], aClockwise = !!args[6], deltaAngle = aEndAngle - aStartAngle, tdivisions = 2 * divisions;
        for (j = 1; tdivisions >= j; j++) t = j / tdivisions, aClockwise || (t = 1 - t), 
        angle = aStartAngle + t * deltaAngle, tx = aX + xRadius * Math.cos(angle), ty = aY + yRadius * Math.sin(angle), 
        points.push(new THREE.Vector2(tx, ty));
    }
    var lastPoint = points[points.length - 1], EPSILON = 1e-10;
    return Math.abs(lastPoint.x - points[0].x) < EPSILON && Math.abs(lastPoint.y - points[0].y) < EPSILON && points.splice(points.length - 1, 1), 
    closedPath && points.push(points[0]), points;
}, THREE.Path.prototype.toShapes = function(isCCW, noHoles) {
    function extractSubpaths(inActions) {
        var i, il, item, action, args, subPaths = [], lastPath = new THREE.Path();
        for (i = 0, il = inActions.length; il > i; i++) item = inActions[i], args = item.args, 
        action = item.action, action == THREE.PathActions.MOVE_TO && 0 != lastPath.actions.length && (subPaths.push(lastPath), 
        lastPath = new THREE.Path()), lastPath[action].apply(lastPath, args);
        return 0 != lastPath.actions.length && subPaths.push(lastPath), subPaths;
    }
    function toShapesNoHoles(inSubpaths) {
        for (var shapes = [], i = 0, il = inSubpaths.length; il > i; i++) {
            var tmpPath = inSubpaths[i], tmpShape = new THREE.Shape();
            tmpShape.actions = tmpPath.actions, tmpShape.curves = tmpPath.curves, shapes.push(tmpShape);
        }
        return shapes;
    }
    function isPointInsidePolygon(inPt, inPolygon) {
        for (var EPSILON = 1e-10, polyLen = inPolygon.length, inside = !1, p = polyLen - 1, q = 0; polyLen > q; p = q++) {
            var edgeLowPt = inPolygon[p], edgeHighPt = inPolygon[q], edgeDx = edgeHighPt.x - edgeLowPt.x, edgeDy = edgeHighPt.y - edgeLowPt.y;
            if (Math.abs(edgeDy) > EPSILON) {
                if (0 > edgeDy && (edgeLowPt = inPolygon[q], edgeDx = -edgeDx, edgeHighPt = inPolygon[p], 
                edgeDy = -edgeDy), inPt.y < edgeLowPt.y || inPt.y > edgeHighPt.y) continue;
                if (inPt.y == edgeLowPt.y) {
                    if (inPt.x == edgeLowPt.x) return !0;
                } else {
                    var perpEdge = edgeDy * (inPt.x - edgeLowPt.x) - edgeDx * (inPt.y - edgeLowPt.y);
                    if (0 == perpEdge) return !0;
                    if (0 > perpEdge) continue;
                    inside = !inside;
                }
            } else {
                if (inPt.y != edgeLowPt.y) continue;
                if (edgeHighPt.x <= inPt.x && inPt.x <= edgeLowPt.x || edgeLowPt.x <= inPt.x && inPt.x <= edgeHighPt.x) return !0;
            }
        }
        return inside;
    }
    var subPaths = extractSubpaths(this.actions);
    if (0 == subPaths.length) return [];
    if (noHoles === !0) return toShapesNoHoles(subPaths);
    var solid, tmpPath, tmpShape, shapes = [];
    if (1 == subPaths.length) return tmpPath = subPaths[0], tmpShape = new THREE.Shape(), 
    tmpShape.actions = tmpPath.actions, tmpShape.curves = tmpPath.curves, shapes.push(tmpShape), 
    shapes;
    var holesFirst = !THREE.Shape.Utils.isClockWise(subPaths[0].getPoints());
    holesFirst = isCCW ? !holesFirst : holesFirst;
    var tmpPoints, betterShapeHoles = [], newShapes = [], newShapeHoles = [], mainIdx = 0;
    newShapes[mainIdx] = void 0, newShapeHoles[mainIdx] = [];
    var i, il;
    for (i = 0, il = subPaths.length; il > i; i++) tmpPath = subPaths[i], tmpPoints = tmpPath.getPoints(), 
    solid = THREE.Shape.Utils.isClockWise(tmpPoints), solid = isCCW ? !solid : solid, 
    solid ? (!holesFirst && newShapes[mainIdx] && mainIdx++, newShapes[mainIdx] = {
        s: new THREE.Shape(),
        p: tmpPoints
    }, newShapes[mainIdx].s.actions = tmpPath.actions, newShapes[mainIdx].s.curves = tmpPath.curves, 
    holesFirst && mainIdx++, newShapeHoles[mainIdx] = []) : newShapeHoles[mainIdx].push({
        h: tmpPath,
        p: tmpPoints[0]
    });
    if (!newShapes[0]) return toShapesNoHoles(subPaths);
    if (newShapes.length > 1) {
        for (var ambigious = !1, toChange = [], sIdx = 0, sLen = newShapes.length; sLen > sIdx; sIdx++) betterShapeHoles[sIdx] = [];
        for (var sIdx = 0, sLen = newShapes.length; sLen > sIdx; sIdx++) for (var sho = newShapeHoles[sIdx], hIdx = 0; hIdx < sho.length; hIdx++) {
            for (var ho = sho[hIdx], hole_unassigned = !0, s2Idx = 0; s2Idx < newShapes.length; s2Idx++) isPointInsidePolygon(ho.p, newShapes[s2Idx].p) && (sIdx != s2Idx && toChange.push({
                froms: sIdx,
                tos: s2Idx,
                hole: hIdx
            }), hole_unassigned ? (hole_unassigned = !1, betterShapeHoles[s2Idx].push(ho)) : ambigious = !0);
            hole_unassigned && betterShapeHoles[sIdx].push(ho);
        }
        toChange.length > 0 && (ambigious || (newShapeHoles = betterShapeHoles));
    }
    var tmpHoles, j, jl;
    for (i = 0, il = newShapes.length; il > i; i++) for (tmpShape = newShapes[i].s, 
    shapes.push(tmpShape), tmpHoles = newShapeHoles[i], j = 0, jl = tmpHoles.length; jl > j; j++) tmpShape.holes.push(tmpHoles[j].h);
    return shapes;
}, THREE.Shape = function() {
    THREE.Path.apply(this, arguments), this.holes = [];
}, THREE.Shape.prototype = Object.create(THREE.Path.prototype), THREE.Shape.prototype.constructor = THREE.Shape, 
THREE.Shape.prototype.extrude = function(options) {
    var extruded = new THREE.ExtrudeGeometry(this, options);
    return extruded;
}, THREE.Shape.prototype.makeGeometry = function(options) {
    var geometry = new THREE.ShapeGeometry(this, options);
    return geometry;
}, THREE.Shape.prototype.getPointsHoles = function(divisions) {
    var i, il = this.holes.length, holesPts = [];
    for (i = 0; il > i; i++) holesPts[i] = this.holes[i].getTransformedPoints(divisions, this.bends);
    return holesPts;
}, THREE.Shape.prototype.getSpacedPointsHoles = function(divisions) {
    var i, il = this.holes.length, holesPts = [];
    for (i = 0; il > i; i++) holesPts[i] = this.holes[i].getTransformedSpacedPoints(divisions, this.bends);
    return holesPts;
}, THREE.Shape.prototype.extractAllPoints = function(divisions) {
    return {
        shape: this.getTransformedPoints(divisions),
        holes: this.getPointsHoles(divisions)
    };
}, THREE.Shape.prototype.extractPoints = function(divisions) {
    return this.useSpacedPoints ? this.extractAllSpacedPoints(divisions) : this.extractAllPoints(divisions);
}, THREE.Shape.prototype.extractAllSpacedPoints = function(divisions) {
    return {
        shape: this.getTransformedSpacedPoints(divisions),
        holes: this.getSpacedPointsHoles(divisions)
    };
}, THREE.Shape.Utils = {
    triangulateShape: function(contour, holes) {
        function point_in_segment_2D_colin(inSegPt1, inSegPt2, inOtherPt) {
            return inSegPt1.x != inSegPt2.x ? inSegPt1.x < inSegPt2.x ? inSegPt1.x <= inOtherPt.x && inOtherPt.x <= inSegPt2.x : inSegPt2.x <= inOtherPt.x && inOtherPt.x <= inSegPt1.x : inSegPt1.y < inSegPt2.y ? inSegPt1.y <= inOtherPt.y && inOtherPt.y <= inSegPt2.y : inSegPt2.y <= inOtherPt.y && inOtherPt.y <= inSegPt1.y;
        }
        function intersect_segments_2D(inSeg1Pt1, inSeg1Pt2, inSeg2Pt1, inSeg2Pt2, inExcludeAdjacentSegs) {
            var EPSILON = 1e-10, seg1dx = inSeg1Pt2.x - inSeg1Pt1.x, seg1dy = inSeg1Pt2.y - inSeg1Pt1.y, seg2dx = inSeg2Pt2.x - inSeg2Pt1.x, seg2dy = inSeg2Pt2.y - inSeg2Pt1.y, seg1seg2dx = inSeg1Pt1.x - inSeg2Pt1.x, seg1seg2dy = inSeg1Pt1.y - inSeg2Pt1.y, limit = seg1dy * seg2dx - seg1dx * seg2dy, perpSeg1 = seg1dy * seg1seg2dx - seg1dx * seg1seg2dy;
            if (Math.abs(limit) > EPSILON) {
                var perpSeg2;
                if (limit > 0) {
                    if (0 > perpSeg1 || perpSeg1 > limit) return [];
                    if (perpSeg2 = seg2dy * seg1seg2dx - seg2dx * seg1seg2dy, 0 > perpSeg2 || perpSeg2 > limit) return [];
                } else {
                    if (perpSeg1 > 0 || limit > perpSeg1) return [];
                    if (perpSeg2 = seg2dy * seg1seg2dx - seg2dx * seg1seg2dy, perpSeg2 > 0 || limit > perpSeg2) return [];
                }
                if (0 == perpSeg2) return !inExcludeAdjacentSegs || 0 != perpSeg1 && perpSeg1 != limit ? [ inSeg1Pt1 ] : [];
                if (perpSeg2 == limit) return !inExcludeAdjacentSegs || 0 != perpSeg1 && perpSeg1 != limit ? [ inSeg1Pt2 ] : [];
                if (0 == perpSeg1) return [ inSeg2Pt1 ];
                if (perpSeg1 == limit) return [ inSeg2Pt2 ];
                var factorSeg1 = perpSeg2 / limit;
                return [ {
                    x: inSeg1Pt1.x + factorSeg1 * seg1dx,
                    y: inSeg1Pt1.y + factorSeg1 * seg1dy
                } ];
            }
            if (0 != perpSeg1 || seg2dy * seg1seg2dx != seg2dx * seg1seg2dy) return [];
            var seg1Pt = 0 == seg1dx && 0 == seg1dy, seg2Pt = 0 == seg2dx && 0 == seg2dy;
            if (seg1Pt && seg2Pt) return inSeg1Pt1.x != inSeg2Pt1.x || inSeg1Pt1.y != inSeg2Pt1.y ? [] : [ inSeg1Pt1 ];
            if (seg1Pt) return point_in_segment_2D_colin(inSeg2Pt1, inSeg2Pt2, inSeg1Pt1) ? [ inSeg1Pt1 ] : [];
            if (seg2Pt) return point_in_segment_2D_colin(inSeg1Pt1, inSeg1Pt2, inSeg2Pt1) ? [ inSeg2Pt1 ] : [];
            var seg1min, seg1max, seg1minVal, seg1maxVal, seg2min, seg2max, seg2minVal, seg2maxVal;
            return 0 != seg1dx ? (inSeg1Pt1.x < inSeg1Pt2.x ? (seg1min = inSeg1Pt1, seg1minVal = inSeg1Pt1.x, 
            seg1max = inSeg1Pt2, seg1maxVal = inSeg1Pt2.x) : (seg1min = inSeg1Pt2, seg1minVal = inSeg1Pt2.x, 
            seg1max = inSeg1Pt1, seg1maxVal = inSeg1Pt1.x), inSeg2Pt1.x < inSeg2Pt2.x ? (seg2min = inSeg2Pt1, 
            seg2minVal = inSeg2Pt1.x, seg2max = inSeg2Pt2, seg2maxVal = inSeg2Pt2.x) : (seg2min = inSeg2Pt2, 
            seg2minVal = inSeg2Pt2.x, seg2max = inSeg2Pt1, seg2maxVal = inSeg2Pt1.x)) : (inSeg1Pt1.y < inSeg1Pt2.y ? (seg1min = inSeg1Pt1, 
            seg1minVal = inSeg1Pt1.y, seg1max = inSeg1Pt2, seg1maxVal = inSeg1Pt2.y) : (seg1min = inSeg1Pt2, 
            seg1minVal = inSeg1Pt2.y, seg1max = inSeg1Pt1, seg1maxVal = inSeg1Pt1.y), inSeg2Pt1.y < inSeg2Pt2.y ? (seg2min = inSeg2Pt1, 
            seg2minVal = inSeg2Pt1.y, seg2max = inSeg2Pt2, seg2maxVal = inSeg2Pt2.y) : (seg2min = inSeg2Pt2, 
            seg2minVal = inSeg2Pt2.y, seg2max = inSeg2Pt1, seg2maxVal = inSeg2Pt1.y)), seg2minVal >= seg1minVal ? seg2minVal > seg1maxVal ? [] : seg1maxVal == seg2minVal ? inExcludeAdjacentSegs ? [] : [ seg2min ] : seg2maxVal >= seg1maxVal ? [ seg2min, seg1max ] : [ seg2min, seg2max ] : seg1minVal > seg2maxVal ? [] : seg1minVal == seg2maxVal ? inExcludeAdjacentSegs ? [] : [ seg1min ] : seg2maxVal >= seg1maxVal ? [ seg1min, seg1max ] : [ seg1min, seg2max ];
        }
        function isPointInsideAngle(inVertex, inLegFromPt, inLegToPt, inOtherPt) {
            var EPSILON = 1e-10, legFromPtX = inLegFromPt.x - inVertex.x, legFromPtY = inLegFromPt.y - inVertex.y, legToPtX = inLegToPt.x - inVertex.x, legToPtY = inLegToPt.y - inVertex.y, otherPtX = inOtherPt.x - inVertex.x, otherPtY = inOtherPt.y - inVertex.y, from2toAngle = legFromPtX * legToPtY - legFromPtY * legToPtX, from2otherAngle = legFromPtX * otherPtY - legFromPtY * otherPtX;
            if (Math.abs(from2toAngle) > EPSILON) {
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
        void 0 !== allPointsMap[key] && THREE.warn("THREE.Shape: Duplicate point", key), 
        allPointsMap[key] = i;
        var shapeWithoutHoles = removeHoles(contour, holes), triangles = THREE.FontUtils.Triangulate(shapeWithoutHoles, !1);
        for (i = 0, il = triangles.length; il > i; i++) for (face = triangles[i], f = 0; 3 > f; f++) key = face[f].x + ":" + face[f].y, 
        index = allPointsMap[key], void 0 !== index && (face[f] = index);
        return triangles.concat();
    },
    isClockWise: function(pts) {
        return THREE.FontUtils.Triangulate.area(pts) < 0;
    },
    b2p0: function(t, p) {
        var k = 1 - t;
        return k * k * p;
    },
    b2p1: function(t, p) {
        return 2 * (1 - t) * t * p;
    },
    b2p2: function(t, p) {
        return t * t * p;
    },
    b2: function(t, p0, p1, p2) {
        return this.b2p0(t, p0) + this.b2p1(t, p1) + this.b2p2(t, p2);
    },
    b3p0: function(t, p) {
        var k = 1 - t;
        return k * k * k * p;
    },
    b3p1: function(t, p) {
        var k = 1 - t;
        return 3 * k * k * t * p;
    },
    b3p2: function(t, p) {
        var k = 1 - t;
        return 3 * k * t * t * p;
    },
    b3p3: function(t, p) {
        return t * t * t * p;
    },
    b3: function(t, p0, p1, p2, p3) {
        return this.b3p0(t, p0) + this.b3p1(t, p1) + this.b3p2(t, p2) + this.b3p3(t, p3);
    }
}, THREE.LineCurve = function(v1, v2) {
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
    var vector = new THREE.Vector2();
    return vector.x = THREE.Shape.Utils.b2(t, this.v0.x, this.v1.x, this.v2.x), vector.y = THREE.Shape.Utils.b2(t, this.v0.y, this.v1.y, this.v2.y), 
    vector;
}, THREE.QuadraticBezierCurve.prototype.getTangent = function(t) {
    var vector = new THREE.Vector2();
    return vector.x = THREE.Curve.Utils.tangentQuadraticBezier(t, this.v0.x, this.v1.x, this.v2.x), 
    vector.y = THREE.Curve.Utils.tangentQuadraticBezier(t, this.v0.y, this.v1.y, this.v2.y), 
    vector.normalize();
}, THREE.CubicBezierCurve = function(v0, v1, v2, v3) {
    this.v0 = v0, this.v1 = v1, this.v2 = v2, this.v3 = v3;
}, THREE.CubicBezierCurve.prototype = Object.create(THREE.Curve.prototype), THREE.CubicBezierCurve.prototype.constructor = THREE.CubicBezierCurve, 
THREE.CubicBezierCurve.prototype.getPoint = function(t) {
    var tx, ty;
    return tx = THREE.Shape.Utils.b3(t, this.v0.x, this.v1.x, this.v2.x, this.v3.x), 
    ty = THREE.Shape.Utils.b3(t, this.v0.y, this.v1.y, this.v2.y, this.v3.y), new THREE.Vector2(tx, ty);
}, THREE.CubicBezierCurve.prototype.getTangent = function(t) {
    var tx, ty;
    tx = THREE.Curve.Utils.tangentCubicBezier(t, this.v0.x, this.v1.x, this.v2.x, this.v3.x), 
    ty = THREE.Curve.Utils.tangentCubicBezier(t, this.v0.y, this.v1.y, this.v2.y, this.v3.y);
    var tangent = new THREE.Vector2(tx, ty);
    return tangent.normalize(), tangent;
}, THREE.SplineCurve = function(points) {
    this.points = void 0 == points ? [] : points;
}, THREE.SplineCurve.prototype = Object.create(THREE.Curve.prototype), THREE.SplineCurve.prototype.constructor = THREE.SplineCurve, 
THREE.SplineCurve.prototype.getPoint = function(t) {
    var points = this.points, point = (points.length - 1) * t, intPoint = Math.floor(point), weight = point - intPoint, point0 = points[0 == intPoint ? intPoint : intPoint - 1], point1 = points[intPoint], point2 = points[intPoint > points.length - 2 ? points.length - 1 : intPoint + 1], point3 = points[intPoint > points.length - 3 ? points.length - 1 : intPoint + 2], vector = new THREE.Vector2();
    return vector.x = THREE.Curve.Utils.interpolate(point0.x, point1.x, point2.x, point3.x, weight), 
    vector.y = THREE.Curve.Utils.interpolate(point0.y, point1.y, point2.y, point3.y, weight), 
    vector;
}, THREE.EllipseCurve = function(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise) {
    this.aX = aX, this.aY = aY, this.xRadius = xRadius, this.yRadius = yRadius, this.aStartAngle = aStartAngle, 
    this.aEndAngle = aEndAngle, this.aClockwise = aClockwise;
}, THREE.EllipseCurve.prototype = Object.create(THREE.Curve.prototype), THREE.EllipseCurve.prototype.constructor = THREE.EllipseCurve, 
THREE.EllipseCurve.prototype.getPoint = function(t) {
    var deltaAngle = this.aEndAngle - this.aStartAngle;
    0 > deltaAngle && (deltaAngle += 2 * Math.PI), deltaAngle > 2 * Math.PI && (deltaAngle -= 2 * Math.PI);
    var angle;
    angle = this.aClockwise === !0 ? this.aEndAngle + (1 - t) * (2 * Math.PI - deltaAngle) : this.aStartAngle + t * deltaAngle;
    var vector = new THREE.Vector2();
    return vector.x = this.aX + this.xRadius * Math.cos(angle), vector.y = this.aY + this.yRadius * Math.sin(angle), 
    vector;
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
    var vector = new THREE.Vector3();
    return vector.x = THREE.Shape.Utils.b2(t, this.v0.x, this.v1.x, this.v2.x), vector.y = THREE.Shape.Utils.b2(t, this.v0.y, this.v1.y, this.v2.y), 
    vector.z = THREE.Shape.Utils.b2(t, this.v0.z, this.v1.z, this.v2.z), vector;
}), THREE.CubicBezierCurve3 = THREE.Curve.create(function(v0, v1, v2, v3) {
    this.v0 = v0, this.v1 = v1, this.v2 = v2, this.v3 = v3;
}, function(t) {
    var vector = new THREE.Vector3();
    return vector.x = THREE.Shape.Utils.b3(t, this.v0.x, this.v1.x, this.v2.x, this.v3.x), 
    vector.y = THREE.Shape.Utils.b3(t, this.v0.y, this.v1.y, this.v2.y, this.v3.y), 
    vector.z = THREE.Shape.Utils.b3(t, this.v0.z, this.v1.z, this.v2.z, this.v3.z), 
    vector;
}), THREE.SplineCurve3 = THREE.Curve.create(function(points) {
    this.points = void 0 == points ? [] : points;
}, function(t) {
    var points = this.points, point = (points.length - 1) * t, intPoint = Math.floor(point), weight = point - intPoint, point0 = points[0 == intPoint ? intPoint : intPoint - 1], point1 = points[intPoint], point2 = points[intPoint > points.length - 2 ? points.length - 1 : intPoint + 1], point3 = points[intPoint > points.length - 3 ? points.length - 1 : intPoint + 2], vector = new THREE.Vector3();
    return vector.x = THREE.Curve.Utils.interpolate(point0.x, point1.x, point2.x, point3.x, weight), 
    vector.y = THREE.Curve.Utils.interpolate(point0.y, point1.y, point2.y, point3.y, weight), 
    vector.z = THREE.Curve.Utils.interpolate(point0.z, point1.z, point2.z, point3.z, weight), 
    vector;
}), THREE.ClosedSplineCurve3 = THREE.Curve.create(function(points) {
    this.points = void 0 == points ? [] : points;
}, function(t) {
    var points = this.points, point = (points.length - 0) * t, intPoint = Math.floor(point), weight = point - intPoint;
    intPoint += intPoint > 0 ? 0 : (Math.floor(Math.abs(intPoint) / points.length) + 1) * points.length;
    var point0 = points[(intPoint - 1) % points.length], point1 = points[intPoint % points.length], point2 = points[(intPoint + 1) % points.length], point3 = points[(intPoint + 2) % points.length], vector = new THREE.Vector3();
    return vector.x = THREE.Curve.Utils.interpolate(point0.x, point1.x, point2.x, point3.x, weight), 
    vector.y = THREE.Curve.Utils.interpolate(point0.y, point1.y, point2.y, point3.y, weight), 
    vector.z = THREE.Curve.Utils.interpolate(point0.z, point1.z, point2.z, point3.z, weight), 
    vector;
}), THREE.AnimationHandler = {
    LINEAR: 0,
    CATMULLROM: 1,
    CATMULLROM_FORWARD: 2,
    add: function() {
        THREE.warn("THREE.AnimationHandler.add() has been deprecated.");
    },
    get: function() {
        THREE.warn("THREE.AnimationHandler.get() has been deprecated.");
    },
    remove: function() {
        THREE.warn("THREE.AnimationHandler.remove() has been deprecated.");
    },
    animations: [],
    init: function(data) {
        if (data.initialized === !0) return data;
        for (var h = 0; h < data.hierarchy.length; h++) {
            for (var k = 0; k < data.hierarchy[h].keys.length; k++) if (data.hierarchy[h].keys[k].time < 0 && (data.hierarchy[h].keys[k].time = 0), 
            void 0 !== data.hierarchy[h].keys[k].rot && !(data.hierarchy[h].keys[k].rot instanceof THREE.Quaternion)) {
                var quat = data.hierarchy[h].keys[k].rot;
                data.hierarchy[h].keys[k].rot = new THREE.Quaternion().fromArray(quat);
            }
            if (data.hierarchy[h].keys.length && void 0 !== data.hierarchy[h].keys[0].morphTargets) {
                for (var usedMorphTargets = {}, k = 0; k < data.hierarchy[h].keys.length; k++) for (var m = 0; m < data.hierarchy[h].keys[k].morphTargets.length; m++) {
                    var morphTargetName = data.hierarchy[h].keys[k].morphTargets[m];
                    usedMorphTargets[morphTargetName] = -1;
                }
                data.hierarchy[h].usedMorphTargets = usedMorphTargets;
                for (var k = 0; k < data.hierarchy[h].keys.length; k++) {
                    var influences = {};
                    for (var morphTargetName in usedMorphTargets) {
                        for (var m = 0; m < data.hierarchy[h].keys[k].morphTargets.length; m++) if (data.hierarchy[h].keys[k].morphTargets[m] === morphTargetName) {
                            influences[morphTargetName] = data.hierarchy[h].keys[k].morphTargetsInfluences[m];
                            break;
                        }
                        m === data.hierarchy[h].keys[k].morphTargets.length && (influences[morphTargetName] = 0);
                    }
                    data.hierarchy[h].keys[k].morphTargetsInfluences = influences;
                }
            }
            for (var k = 1; k < data.hierarchy[h].keys.length; k++) data.hierarchy[h].keys[k].time === data.hierarchy[h].keys[k - 1].time && (data.hierarchy[h].keys.splice(k, 1), 
            k--);
            for (var k = 0; k < data.hierarchy[h].keys.length; k++) data.hierarchy[h].keys[k].index = k;
        }
        return data.initialized = !0, data;
    },
    parse: function(root) {
        var parseRecurseHierarchy = function(root, hierarchy) {
            hierarchy.push(root);
            for (var c = 0; c < root.children.length; c++) parseRecurseHierarchy(root.children[c], hierarchy);
        }, hierarchy = [];
        if (root instanceof THREE.SkinnedMesh) for (var b = 0; b < root.skeleton.bones.length; b++) hierarchy.push(root.skeleton.bones[b]); else parseRecurseHierarchy(root, hierarchy);
        return hierarchy;
    },
    play: function(animation) {
        -1 === this.animations.indexOf(animation) && this.animations.push(animation);
    },
    stop: function(animation) {
        var index = this.animations.indexOf(animation);
        -1 !== index && this.animations.splice(index, 1);
    },
    update: function(deltaTimeMS) {
        for (var i = 0; i < this.animations.length; i++) this.animations[i].resetBlendWeights();
        for (var i = 0; i < this.animations.length; i++) this.animations[i].update(deltaTimeMS);
    }
}, THREE.Animation = function(root, data) {
    this.root = root, this.data = THREE.AnimationHandler.init(data), this.hierarchy = THREE.AnimationHandler.parse(root), 
    this.currentTime = 0, this.timeScale = 1, this.isPlaying = !1, this.loop = !0, this.weight = 0, 
    this.interpolationType = THREE.AnimationHandler.LINEAR;
}, THREE.Animation.prototype = {
    constructor: THREE.Animation,
    keyTypes: [ "pos", "rot", "scl" ],
    play: function(startTime, weight) {
        this.currentTime = void 0 !== startTime ? startTime : 0, this.weight = void 0 !== weight ? weight : 1, 
        this.isPlaying = !0, this.reset(), THREE.AnimationHandler.play(this);
    },
    stop: function() {
        this.isPlaying = !1, THREE.AnimationHandler.stop(this);
    },
    reset: function() {
        for (var h = 0, hl = this.hierarchy.length; hl > h; h++) {
            var object = this.hierarchy[h];
            void 0 === object.animationCache && (object.animationCache = {
                animations: {},
                blending: {
                    positionWeight: 0,
                    quaternionWeight: 0,
                    scaleWeight: 0
                }
            });
            var name = this.data.name, animations = object.animationCache.animations, animationCache = animations[name];
            void 0 === animationCache && (animationCache = {
                prevKey: {
                    pos: 0,
                    rot: 0,
                    scl: 0
                },
                nextKey: {
                    pos: 0,
                    rot: 0,
                    scl: 0
                },
                originalMatrix: object.matrix
            }, animations[name] = animationCache);
            for (var t = 0; 3 > t; t++) {
                for (var type = this.keyTypes[t], prevKey = this.data.hierarchy[h].keys[0], nextKey = this.getNextKeyWith(type, h, 1); nextKey.time < this.currentTime && nextKey.index > prevKey.index; ) prevKey = nextKey, 
                nextKey = this.getNextKeyWith(type, h, nextKey.index + 1);
                animationCache.prevKey[type] = prevKey, animationCache.nextKey[type] = nextKey;
            }
        }
    },
    resetBlendWeights: function() {
        for (var h = 0, hl = this.hierarchy.length; hl > h; h++) {
            var object = this.hierarchy[h], animationCache = object.animationCache;
            if (void 0 !== animationCache) {
                var blending = animationCache.blending;
                blending.positionWeight = 0, blending.quaternionWeight = 0, blending.scaleWeight = 0;
            }
        }
    },
    update: function() {
        var points = [], target = new THREE.Vector3(), newVector = new THREE.Vector3(), newQuat = new THREE.Quaternion(), interpolateCatmullRom = function(points, scale) {
            var point, intPoint, weight, w2, w3, pa, pb, pc, pd, c = [], v3 = [];
            return point = (points.length - 1) * scale, intPoint = Math.floor(point), weight = point - intPoint, 
            c[0] = 0 === intPoint ? intPoint : intPoint - 1, c[1] = intPoint, c[2] = intPoint > points.length - 2 ? intPoint : intPoint + 1, 
            c[3] = intPoint > points.length - 3 ? intPoint : intPoint + 2, pa = points[c[0]], 
            pb = points[c[1]], pc = points[c[2]], pd = points[c[3]], w2 = weight * weight, w3 = weight * w2, 
            v3[0] = interpolate(pa[0], pb[0], pc[0], pd[0], weight, w2, w3), v3[1] = interpolate(pa[1], pb[1], pc[1], pd[1], weight, w2, w3), 
            v3[2] = interpolate(pa[2], pb[2], pc[2], pd[2], weight, w2, w3), v3;
        }, interpolate = function(p0, p1, p2, p3, t, t2, t3) {
            var v0 = .5 * (p2 - p0), v1 = .5 * (p3 - p1);
            return (2 * (p1 - p2) + v0 + v1) * t3 + (-3 * (p1 - p2) - 2 * v0 - v1) * t2 + v0 * t + p1;
        };
        return function(delta) {
            if (this.isPlaying !== !1 && (this.currentTime += delta * this.timeScale, 0 !== this.weight)) {
                var duration = this.data.length;
                (this.currentTime > duration || this.currentTime < 0) && (this.loop ? (this.currentTime %= duration, 
                this.currentTime < 0 && (this.currentTime += duration), this.reset()) : this.stop());
                for (var h = 0, hl = this.hierarchy.length; hl > h; h++) for (var object = this.hierarchy[h], animationCache = object.animationCache.animations[this.data.name], blending = object.animationCache.blending, t = 0; 3 > t; t++) {
                    var type = this.keyTypes[t], prevKey = animationCache.prevKey[type], nextKey = animationCache.nextKey[type];
                    if (this.timeScale > 0 && nextKey.time <= this.currentTime || this.timeScale < 0 && prevKey.time >= this.currentTime) {
                        for (prevKey = this.data.hierarchy[h].keys[0], nextKey = this.getNextKeyWith(type, h, 1); nextKey.time < this.currentTime && nextKey.index > prevKey.index; ) prevKey = nextKey, 
                        nextKey = this.getNextKeyWith(type, h, nextKey.index + 1);
                        animationCache.prevKey[type] = prevKey, animationCache.nextKey[type] = nextKey;
                    }
                    var scale = (this.currentTime - prevKey.time) / (nextKey.time - prevKey.time), prevXYZ = prevKey[type], nextXYZ = nextKey[type];
                    if (0 > scale && (scale = 0), scale > 1 && (scale = 1), "pos" === type) {
                        if (this.interpolationType === THREE.AnimationHandler.LINEAR) {
                            newVector.x = prevXYZ[0] + (nextXYZ[0] - prevXYZ[0]) * scale, newVector.y = prevXYZ[1] + (nextXYZ[1] - prevXYZ[1]) * scale, 
                            newVector.z = prevXYZ[2] + (nextXYZ[2] - prevXYZ[2]) * scale;
                            var proportionalWeight = this.weight / (this.weight + blending.positionWeight);
                            object.position.lerp(newVector, proportionalWeight), blending.positionWeight += this.weight;
                        } else if (this.interpolationType === THREE.AnimationHandler.CATMULLROM || this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD) {
                            points[0] = this.getPrevKeyWith("pos", h, prevKey.index - 1).pos, points[1] = prevXYZ, 
                            points[2] = nextXYZ, points[3] = this.getNextKeyWith("pos", h, nextKey.index + 1).pos, 
                            scale = .33 * scale + .33;
                            var currentPoint = interpolateCatmullRom(points, scale), proportionalWeight = this.weight / (this.weight + blending.positionWeight);
                            blending.positionWeight += this.weight;
                            var vector = object.position;
                            if (vector.x = vector.x + (currentPoint[0] - vector.x) * proportionalWeight, vector.y = vector.y + (currentPoint[1] - vector.y) * proportionalWeight, 
                            vector.z = vector.z + (currentPoint[2] - vector.z) * proportionalWeight, this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD) {
                                var forwardPoint = interpolateCatmullRom(points, 1.01 * scale);
                                target.set(forwardPoint[0], forwardPoint[1], forwardPoint[2]), target.sub(vector), 
                                target.y = 0, target.normalize();
                                var angle = Math.atan2(target.x, target.z);
                                object.rotation.set(0, angle, 0);
                            }
                        }
                    } else if ("rot" === type) if (THREE.Quaternion.slerp(prevXYZ, nextXYZ, newQuat, scale), 
                    0 === blending.quaternionWeight) object.quaternion.copy(newQuat), blending.quaternionWeight = this.weight; else {
                        var proportionalWeight = this.weight / (this.weight + blending.quaternionWeight);
                        THREE.Quaternion.slerp(object.quaternion, newQuat, object.quaternion, proportionalWeight), 
                        blending.quaternionWeight += this.weight;
                    } else if ("scl" === type) {
                        newVector.x = prevXYZ[0] + (nextXYZ[0] - prevXYZ[0]) * scale, newVector.y = prevXYZ[1] + (nextXYZ[1] - prevXYZ[1]) * scale, 
                        newVector.z = prevXYZ[2] + (nextXYZ[2] - prevXYZ[2]) * scale;
                        var proportionalWeight = this.weight / (this.weight + blending.scaleWeight);
                        object.scale.lerp(newVector, proportionalWeight), blending.scaleWeight += this.weight;
                    }
                }
                return !0;
            }
        };
    }(),
    getNextKeyWith: function(type, h, key) {
        var keys = this.data.hierarchy[h].keys;
        for (this.interpolationType === THREE.AnimationHandler.CATMULLROM || this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ? key = key < keys.length - 1 ? key : keys.length - 1 : key %= keys.length; key < keys.length; key++) if (void 0 !== keys[key][type]) return keys[key];
        return this.data.hierarchy[h].keys[0];
    },
    getPrevKeyWith: function(type, h, key) {
        var keys = this.data.hierarchy[h].keys;
        for (key = this.interpolationType === THREE.AnimationHandler.CATMULLROM || this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ? key > 0 ? key : 0 : key >= 0 ? key : key + keys.length; key >= 0; key--) if (void 0 !== keys[key][type]) return keys[key];
        return this.data.hierarchy[h].keys[keys.length - 1];
    }
}, THREE.KeyFrameAnimation = function(data) {
    this.root = data.node, this.data = THREE.AnimationHandler.init(data), this.hierarchy = THREE.AnimationHandler.parse(this.root), 
    this.currentTime = 0, this.timeScale = .001, this.isPlaying = !1, this.isPaused = !0, 
    this.loop = !0;
    for (var h = 0, hl = this.hierarchy.length; hl > h; h++) {
        var keys = this.data.hierarchy[h].keys, sids = this.data.hierarchy[h].sids, obj = this.hierarchy[h];
        if (keys.length && sids) {
            for (var s = 0; s < sids.length; s++) {
                var sid = sids[s], next = this.getNextKeyWith(sid, h, 0);
                next && next.apply(sid);
            }
            obj.matrixAutoUpdate = !1, this.data.hierarchy[h].node.updateMatrix(), obj.matrixWorldNeedsUpdate = !0;
        }
    }
}, THREE.KeyFrameAnimation.prototype = {
    constructor: THREE.KeyFrameAnimation,
    play: function(startTime) {
        if (this.currentTime = void 0 !== startTime ? startTime : 0, this.isPlaying === !1) {
            this.isPlaying = !0;
            var h, object, node, hl = this.hierarchy.length;
            for (h = 0; hl > h; h++) {
                object = this.hierarchy[h], node = this.data.hierarchy[h], void 0 === node.animationCache && (node.animationCache = {}, 
                node.animationCache.prevKey = null, node.animationCache.nextKey = null, node.animationCache.originalMatrix = object.matrix);
                var keys = this.data.hierarchy[h].keys;
                keys.length && (node.animationCache.prevKey = keys[0], node.animationCache.nextKey = keys[1], 
                this.startTime = Math.min(keys[0].time, this.startTime), this.endTime = Math.max(keys[keys.length - 1].time, this.endTime));
            }
            this.update(0);
        }
        this.isPaused = !1, THREE.AnimationHandler.play(this);
    },
    stop: function() {
        this.isPlaying = !1, this.isPaused = !1, THREE.AnimationHandler.stop(this);
        for (var h = 0; h < this.data.hierarchy.length; h++) {
            var obj = this.hierarchy[h], node = this.data.hierarchy[h];
            if (void 0 !== node.animationCache) {
                var original = node.animationCache.originalMatrix;
                original.copy(obj.matrix), obj.matrix = original, delete node.animationCache;
            }
        }
    },
    update: function(delta) {
        if (this.isPlaying !== !1) {
            this.currentTime += delta * this.timeScale;
            var duration = this.data.length;
            this.loop === !0 && this.currentTime > duration && (this.currentTime %= duration), 
            this.currentTime = Math.min(this.currentTime, duration);
            for (var h = 0, hl = this.hierarchy.length; hl > h; h++) {
                var object = this.hierarchy[h], node = this.data.hierarchy[h], keys = node.keys, animationCache = node.animationCache;
                if (keys.length) {
                    var prevKey = animationCache.prevKey, nextKey = animationCache.nextKey;
                    if (nextKey.time <= this.currentTime) {
                        for (;nextKey.time < this.currentTime && nextKey.index > prevKey.index; ) prevKey = nextKey, 
                        nextKey = keys[prevKey.index + 1];
                        animationCache.prevKey = prevKey, animationCache.nextKey = nextKey;
                    }
                    nextKey.time >= this.currentTime ? prevKey.interpolate(nextKey, this.currentTime) : prevKey.interpolate(nextKey, nextKey.time), 
                    this.data.hierarchy[h].node.updateMatrix(), object.matrixWorldNeedsUpdate = !0;
                }
            }
        }
    },
    getNextKeyWith: function(sid, h, key) {
        var keys = this.data.hierarchy[h].keys;
        for (key %= keys.length; key < keys.length; key++) if (keys[key].hasTarget(sid)) return keys[key];
        return keys[0];
    },
    getPrevKeyWith: function(sid, h, key) {
        var keys = this.data.hierarchy[h].keys;
        for (key = key >= 0 ? key : key + keys.length; key >= 0; key--) if (keys[key].hasTarget(sid)) return keys[key];
        return keys[keys.length - 1];
    }
}, THREE.MorphAnimation = function(mesh) {
    this.mesh = mesh, this.frames = mesh.morphTargetInfluences.length, this.currentTime = 0, 
    this.duration = 1e3, this.loop = !0, this.lastFrame = 0, this.currentFrame = 0, 
    this.isPlaying = !1;
}, THREE.MorphAnimation.prototype = {
    constructor: THREE.MorphAnimation,
    play: function() {
        this.isPlaying = !0;
    },
    pause: function() {
        this.isPlaying = !1;
    },
    update: function(delta) {
        if (this.isPlaying !== !1) {
            this.currentTime += delta, this.loop === !0 && this.currentTime > this.duration && (this.currentTime %= this.duration), 
            this.currentTime = Math.min(this.currentTime, this.duration);
            var interpolation = this.duration / this.frames, frame = Math.floor(this.currentTime / interpolation), influences = this.mesh.morphTargetInfluences;
            frame != this.currentFrame && (influences[this.lastFrame] = 0, influences[this.currentFrame] = 1, 
            influences[frame] = 0, this.lastFrame = this.currentFrame, this.currentFrame = frame), 
            influences[frame] = this.currentTime % interpolation / interpolation, influences[this.lastFrame] = 1 - influences[frame];
        }
    }
}, THREE.BoxGeometry = function(width, height, depth, widthSegments, heightSegments, depthSegments) {
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
THREE.CircleGeometry = function(radius, segments, thetaStart, thetaLength) {
    THREE.Geometry.call(this), this.type = "CircleGeometry", this.parameters = {
        radius: radius,
        segments: segments,
        thetaStart: thetaStart,
        thetaLength: thetaLength
    }, radius = radius || 50, segments = void 0 !== segments ? Math.max(3, segments) : 8, 
    thetaStart = void 0 !== thetaStart ? thetaStart : 0, thetaLength = void 0 !== thetaLength ? thetaLength : 2 * Math.PI;
    var i, uvs = [], center = new THREE.Vector3(), centerUV = new THREE.Vector2(.5, .5);
    for (this.vertices.push(center), uvs.push(centerUV), i = 0; segments >= i; i++) {
        var vertex = new THREE.Vector3(), segment = thetaStart + i / segments * thetaLength;
        vertex.x = radius * Math.cos(segment), vertex.y = radius * Math.sin(segment), this.vertices.push(vertex), 
        uvs.push(new THREE.Vector2((vertex.x / radius + 1) / 2, (vertex.y / radius + 1) / 2));
    }
    var n = new THREE.Vector3(0, 0, 1);
    for (i = 1; segments >= i; i++) this.faces.push(new THREE.Face3(i, i + 1, 0, [ n.clone(), n.clone(), n.clone() ])), 
    this.faceVertexUvs[0].push([ uvs[i].clone(), uvs[i + 1].clone(), centerUV.clone() ]);
    this.computeFaceNormals(), this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);
}, THREE.CircleGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.CircleGeometry.prototype.constructor = THREE.CircleGeometry, 
THREE.CubeGeometry = function(width, height, depth, widthSegments, heightSegments, depthSegments) {
    return THREE.warn("THREE.CubeGeometry has been renamed to THREE.BoxGeometry."), 
    new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments);
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
        this.faces.push(new THREE.Face3(v1, v2, v3, [ n1, n2, n3 ])), this.faceVertexUvs[0].push([ uv1, uv2, uv3 ]);
    }
    if (openEnded === !1 && radiusBottom > 0) for (this.vertices.push(new THREE.Vector3(0, -heightHalf, 0)), 
    x = 0; radialSegments > x; x++) {
        var v1 = vertices[heightSegments][x + 1], v2 = vertices[heightSegments][x], v3 = this.vertices.length - 1, n1 = new THREE.Vector3(0, -1, 0), n2 = new THREE.Vector3(0, -1, 0), n3 = new THREE.Vector3(0, -1, 0), uv1 = uvs[heightSegments][x + 1].clone(), uv2 = uvs[heightSegments][x].clone(), uv3 = new THREE.Vector2(uv2.x, 1);
        this.faces.push(new THREE.Face3(v1, v2, v3, [ n1, n2, n3 ])), this.faceVertexUvs[0].push([ uv1, uv2, uv3 ]);
    }
    this.computeFaceNormals();
}, THREE.CylinderGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.CylinderGeometry.prototype.constructor = THREE.CylinderGeometry, 
THREE.ExtrudeGeometry = function(shapes, options) {
    return "undefined" == typeof shapes ? void (shapes = []) : (THREE.Geometry.call(this), 
    this.type = "ExtrudeGeometry", shapes = shapes instanceof Array ? shapes : [ shapes ], 
    this.addShapeList(shapes, options), void this.computeFaceNormals());
}, THREE.ExtrudeGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.ExtrudeGeometry.prototype.constructor = THREE.ExtrudeGeometry, 
THREE.ExtrudeGeometry.prototype.addShapeList = function(shapes, options) {
    for (var sl = shapes.length, s = 0; sl > s; s++) {
        var shape = shapes[s];
        this.addShape(shape, options);
    }
}, THREE.ExtrudeGeometry.prototype.addShape = function(shape, options) {
    function scalePt2(pt, vec, size) {
        return vec || THREE.error("THREE.ExtrudeGeometry: vec does not exist"), vec.clone().multiplyScalar(size).add(pt);
    }
    function getBevelVec(inPt, inPrev, inNext) {
        var v_trans_x, v_trans_y, EPSILON = 1e-10, shrink_by = 1, v_prev_x = inPt.x - inPrev.x, v_prev_y = inPt.y - inPrev.y, v_next_x = inNext.x - inPt.x, v_next_y = inNext.y - inPt.y, v_prev_lensq = v_prev_x * v_prev_x + v_prev_y * v_prev_y, colinear0 = v_prev_x * v_next_y - v_prev_y * v_next_x;
        if (Math.abs(colinear0) > EPSILON) {
            var v_prev_len = Math.sqrt(v_prev_lensq), v_next_len = Math.sqrt(v_next_x * v_next_x + v_next_y * v_next_y), ptPrevShift_x = inPrev.x - v_prev_y / v_prev_len, ptPrevShift_y = inPrev.y + v_prev_x / v_prev_len, ptNextShift_x = inNext.x - v_next_y / v_next_len, ptNextShift_y = inNext.y + v_next_x / v_next_len, sf = ((ptNextShift_x - ptPrevShift_x) * v_next_y - (ptNextShift_y - ptPrevShift_y) * v_next_x) / (v_prev_x * v_next_y - v_prev_y * v_next_x);
            v_trans_x = ptPrevShift_x + v_prev_x * sf - inPt.x, v_trans_y = ptPrevShift_y + v_prev_y * sf - inPt.y;
            var v_trans_lensq = v_trans_x * v_trans_x + v_trans_y * v_trans_y;
            if (2 >= v_trans_lensq) return new THREE.Vector2(v_trans_x, v_trans_y);
            shrink_by = Math.sqrt(v_trans_lensq / 2);
        } else {
            var direction_eq = !1;
            v_prev_x > EPSILON ? v_next_x > EPSILON && (direction_eq = !0) : -EPSILON > v_prev_x ? -EPSILON > v_next_x && (direction_eq = !0) : Math.sign(v_prev_y) == Math.sign(v_next_y) && (direction_eq = !0), 
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
        a += shapesOffset, b += shapesOffset, c += shapesOffset, scope.faces.push(new THREE.Face3(a, b, c, null, null, material));
        var uvs = uvgen.generateTopUV(scope, a, b, c);
        scope.faceVertexUvs[0].push(uvs);
    }
    function f4(a, b, c, d, wallContour, stepIndex, stepsLength, contourIndex1, contourIndex2) {
        a += shapesOffset, b += shapesOffset, c += shapesOffset, d += shapesOffset, scope.faces.push(new THREE.Face3(a, b, d, null, null, extrudeMaterial)), 
        scope.faces.push(new THREE.Face3(b, c, d, null, null, extrudeMaterial));
        var uvs = uvgen.generateSideWallUV(scope, a, b, c, d);
        scope.faceVertexUvs[0].push([ uvs[0], uvs[1], uvs[3] ]), scope.faceVertexUvs[0].push([ uvs[1], uvs[2], uvs[3] ]);
    }
    var extrudePts, splineTube, binormal, normal, position2, amount = void 0 !== options.amount ? options.amount : 100, bevelThickness = void 0 !== options.bevelThickness ? options.bevelThickness : 6, bevelSize = void 0 !== options.bevelSize ? options.bevelSize : bevelThickness - 2, bevelSegments = void 0 !== options.bevelSegments ? options.bevelSegments : 3, bevelEnabled = void 0 !== options.bevelEnabled ? options.bevelEnabled : !0, curveSegments = void 0 !== options.curveSegments ? options.curveSegments : 12, steps = void 0 !== options.steps ? options.steps : 1, extrudePath = options.extrudePath, extrudeByPath = !1, material = options.material, extrudeMaterial = options.extrudeMaterial, uvgen = void 0 !== options.UVGenerator ? options.UVGenerator : THREE.ExtrudeGeometry.WorldUVGenerator;
    extrudePath && (extrudePts = extrudePath.getSpacedPoints(steps), extrudeByPath = !0, 
    bevelEnabled = !1, splineTube = void 0 !== options.frames ? options.frames : new THREE.TubeGeometry.FrenetFrames(extrudePath, steps, !1), 
    binormal = new THREE.Vector3(), normal = new THREE.Vector3(), position2 = new THREE.Vector3()), 
    bevelEnabled || (bevelSegments = 0, bevelThickness = 0, bevelSize = 0);
    var ahole, h, hl, scope = this, shapesOffset = this.vertices.length, shapePoints = shape.extractPoints(curveSegments), vertices = shapePoints.shape, holes = shapePoints.holes, reverse = !THREE.Shape.Utils.isClockWise(vertices);
    if (reverse) {
        for (vertices = vertices.reverse(), h = 0, hl = holes.length; hl > h; h++) ahole = holes[h], 
        THREE.Shape.Utils.isClockWise(ahole) && (holes[h] = ahole.reverse());
        reverse = !1;
    }
    var faces = THREE.Shape.Utils.triangulateShape(vertices, holes), contour = vertices;
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
    THREE.Geometry.call(this), this.type = "ShapeGeometry", shapes instanceof Array == !1 && (shapes = [ shapes ]), 
    this.addShapeList(shapes, options), this.computeFaceNormals();
}, THREE.ShapeGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.ShapeGeometry.prototype.constructor = THREE.ShapeGeometry, 
THREE.ShapeGeometry.prototype.addShapeList = function(shapes, options) {
    for (var i = 0, l = shapes.length; l > i; i++) this.addShape(shapes[i], options);
    return this;
}, THREE.ShapeGeometry.prototype.addShape = function(shape, options) {
    void 0 === options && (options = {});
    var i, l, hole, curveSegments = void 0 !== options.curveSegments ? options.curveSegments : 12, material = options.material, uvgen = void 0 === options.UVGenerator ? THREE.ExtrudeGeometry.WorldUVGenerator : options.UVGenerator, shapesOffset = this.vertices.length, shapePoints = shape.extractPoints(curveSegments), vertices = shapePoints.shape, holes = shapePoints.holes, reverse = !THREE.Shape.Utils.isClockWise(vertices);
    if (reverse) {
        for (vertices = vertices.reverse(), i = 0, l = holes.length; l > i; i++) hole = holes[i], 
        THREE.Shape.Utils.isClockWise(hole) && (holes[i] = hole.reverse());
        reverse = !1;
    }
    var faces = THREE.Shape.Utils.triangulateShape(vertices, holes);
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
    console.info("THREE.PlaneGeometry: Consider using THREE.PlaneBufferGeometry for lower memory footprint."), 
    THREE.Geometry.call(this), this.type = "PlaneGeometry", this.parameters = {
        width: width,
        height: height,
        widthSegments: widthSegments,
        heightSegments: heightSegments
    }, this.fromBufferGeometry(new THREE.PlaneBufferGeometry(width, height, widthSegments, heightSegments));
}, THREE.PlaneGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.PlaneGeometry.prototype.constructor = THREE.PlaneGeometry, 
THREE.PlaneBufferGeometry = function(width, height, widthSegments, heightSegments) {
    THREE.BufferGeometry.call(this), this.type = "PlaneBufferGeometry", this.parameters = {
        width: width,
        height: height,
        widthSegments: widthSegments,
        heightSegments: heightSegments
    };
    for (var width_half = width / 2, height_half = height / 2, gridX = widthSegments || 1, gridY = heightSegments || 1, gridX1 = gridX + 1, gridY1 = gridY + 1, segment_width = width / gridX, segment_height = height / gridY, vertices = new Float32Array(gridX1 * gridY1 * 3), normals = new Float32Array(gridX1 * gridY1 * 3), uvs = new Float32Array(gridX1 * gridY1 * 2), offset = 0, offset2 = 0, iy = 0; gridY1 > iy; iy++) for (var y = iy * segment_height - height_half, ix = 0; gridX1 > ix; ix++) {
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
    this.addAttribute("index", new THREE.BufferAttribute(indices, 1)), this.addAttribute("position", new THREE.BufferAttribute(vertices, 3)), 
    this.addAttribute("normal", new THREE.BufferAttribute(normals, 3)), this.addAttribute("uv", new THREE.BufferAttribute(uvs, 2));
}, THREE.PlaneBufferGeometry.prototype = Object.create(THREE.BufferGeometry.prototype), 
THREE.PlaneBufferGeometry.prototype.constructor = THREE.PlaneBufferGeometry, THREE.RingGeometry = function(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength) {
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
THREE.SphereGeometry = function(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
    THREE.Geometry.call(this), this.type = "SphereGeometry", this.parameters = {
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
    var x, y, vertices = [], uvs = [];
    for (y = 0; heightSegments >= y; y++) {
        var verticesRow = [], uvsRow = [];
        for (x = 0; widthSegments >= x; x++) {
            var u = x / widthSegments, v = y / heightSegments, vertex = new THREE.Vector3();
            vertex.x = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength), 
            vertex.y = radius * Math.cos(thetaStart + v * thetaLength), vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength), 
            this.vertices.push(vertex), verticesRow.push(this.vertices.length - 1), uvsRow.push(new THREE.Vector2(u, 1 - v));
        }
        vertices.push(verticesRow), uvs.push(uvsRow);
    }
    for (y = 0; heightSegments > y; y++) for (x = 0; widthSegments > x; x++) {
        var v1 = vertices[y][x + 1], v2 = vertices[y][x], v3 = vertices[y + 1][x], v4 = vertices[y + 1][x + 1], n1 = this.vertices[v1].clone().normalize(), n2 = this.vertices[v2].clone().normalize(), n3 = this.vertices[v3].clone().normalize(), n4 = this.vertices[v4].clone().normalize(), uv1 = uvs[y][x + 1].clone(), uv2 = uvs[y][x].clone(), uv3 = uvs[y + 1][x].clone(), uv4 = uvs[y + 1][x + 1].clone();
        Math.abs(this.vertices[v1].y) === radius ? (uv1.x = (uv1.x + uv2.x) / 2, this.faces.push(new THREE.Face3(v1, v3, v4, [ n1, n3, n4 ])), 
        this.faceVertexUvs[0].push([ uv1, uv3, uv4 ])) : Math.abs(this.vertices[v3].y) === radius ? (uv3.x = (uv3.x + uv4.x) / 2, 
        this.faces.push(new THREE.Face3(v1, v2, v3, [ n1, n2, n3 ])), this.faceVertexUvs[0].push([ uv1, uv2, uv3 ])) : (this.faces.push(new THREE.Face3(v1, v2, v4, [ n1, n2, n4 ])), 
        this.faceVertexUvs[0].push([ uv1, uv2, uv4 ]), this.faces.push(new THREE.Face3(v2, v3, v4, [ n2.clone(), n3, n4.clone() ])), 
        this.faceVertexUvs[0].push([ uv2.clone(), uv3, uv4.clone() ]));
    }
    this.computeFaceNormals(), this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);
}, THREE.SphereGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.SphereGeometry.prototype.constructor = THREE.SphereGeometry, 
THREE.TextGeometry = function(text, parameters) {
    parameters = parameters || {};
    var textShapes = THREE.FontUtils.generateShapes(text, parameters);
    parameters.amount = void 0 !== parameters.height ? parameters.height : 50, void 0 === parameters.bevelThickness && (parameters.bevelThickness = 10), 
    void 0 === parameters.bevelSize && (parameters.bevelSize = 8), void 0 === parameters.bevelEnabled && (parameters.bevelEnabled = !1), 
    THREE.ExtrudeGeometry.call(this, textShapes, parameters), this.type = "TextGeometry";
}, THREE.TextGeometry.prototype = Object.create(THREE.ExtrudeGeometry.prototype), 
THREE.TextGeometry.prototype.constructor = THREE.TextGeometry, THREE.TorusGeometry = function(radius, tube, radialSegments, tubularSegments, arc) {
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
THREE.TorusKnotGeometry = function(radius, tube, radialSegments, tubularSegments, p, q, heightScale) {
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
THREE.TorusKnotGeometry.prototype.constructor = THREE.TorusKnotGeometry, THREE.TubeGeometry = function(path, segments, radius, radialSegments, closed, taper) {
    function vert(x, y, z) {
        return scope.vertices.push(new THREE.Vector3(x, y, z)) - 1;
    }
    THREE.Geometry.call(this), this.type = "TubeGeometry", this.parameters = {
        path: path,
        segments: segments,
        radius: radius,
        radialSegments: radialSegments,
        closed: closed
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
THREE.TubeGeometry.NoTaper = function(u) {
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
    var theta, smallest, tx, ty, tz, i, u, normal = new THREE.Vector3(), tangents = [], normals = [], binormals = [], vec = new THREE.Vector3(), mat = new THREE.Matrix4(), numpoints = segments + 1, epsilon = 1e-4;
    for (this.tangents = tangents, this.normals = normals, this.binormals = binormals, 
    i = 0; numpoints > i; i++) u = i / (numpoints - 1), tangents[i] = path.getTangentAt(u), 
    tangents[i].normalize();
    for (initialNormal3(), i = 1; numpoints > i; i++) normals[i] = normals[i - 1].clone(), 
    binormals[i] = binormals[i - 1].clone(), vec.crossVectors(tangents[i - 1], tangents[i]), 
    vec.length() > epsilon && (vec.normalize(), theta = Math.acos(THREE.Math.clamp(tangents[i - 1].dot(tangents[i]), -1, 1)), 
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
    function make(v1, v2, v3) {
        var face = new THREE.Face3(v1.index, v2.index, v3.index, [ v1.clone(), v2.clone(), v3.clone() ]);
        that.faces.push(face), centroid.copy(v1).add(v2).add(v3).divideScalar(3);
        var azi = azimuth(centroid);
        that.faceVertexUvs[0].push([ correctUV(v1.uv, v1, azi), correctUV(v2.uv, v2, azi), correctUV(v3.uv, v3, azi) ]);
    }
    function subdivide(face, detail) {
        for (var cols = Math.pow(2, detail), a = prepare(that.vertices[face.a]), b = prepare(that.vertices[face.b]), c = prepare(that.vertices[face.c]), v = [], i = 0; cols >= i; i++) {
            v[i] = [];
            for (var aj = prepare(a.clone().lerp(c, i / cols)), bj = prepare(b.clone().lerp(c, i / cols)), rows = cols - i, j = 0; rows >= j; j++) 0 == j && i == cols ? v[i][j] = aj : v[i][j] = prepare(aj.clone().lerp(bj, j / rows));
        }
        for (var i = 0; cols > i; i++) for (var j = 0; 2 * (cols - i) - 1 > j; j++) {
            var k = Math.floor(j / 2);
            j % 2 == 0 ? make(v[i][k + 1], v[i + 1][k], v[i][k]) : make(v[i][k + 1], v[i + 1][k + 1], v[i + 1][k]);
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
        faces[j] = new THREE.Face3(v1.index, v2.index, v3.index, [ v1.clone(), v2.clone(), v3.clone() ]);
    }
    for (var centroid = new THREE.Vector3(), i = 0, l = faces.length; l > i; i++) subdivide(faces[i], detail);
    for (var i = 0, l = this.faceVertexUvs[0].length; l > i; i++) {
        var uvs = this.faceVertexUvs[0][i], x0 = uvs[0].x, x1 = uvs[1].x, x2 = uvs[2].x, max = Math.max(x0, Math.max(x1, x2)), min = Math.min(x0, Math.min(x1, x2));
        max > .9 && .1 > min && (.2 > x0 && (uvs[0].x += 1), .2 > x1 && (uvs[1].x += 1), 
        .2 > x2 && (uvs[2].x += 1));
    }
    for (var i = 0, l = this.vertices.length; l > i; i++) this.vertices[i].multiplyScalar(radius);
    this.mergeVertices(), this.computeFaceNormals(), this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);
}, THREE.PolyhedronGeometry.prototype = Object.create(THREE.Geometry.prototype), 
THREE.PolyhedronGeometry.prototype.constructor = THREE.PolyhedronGeometry, THREE.DodecahedronGeometry = function(radius, detail) {
    this.parameters = {
        radius: radius,
        detail: detail
    };
    var t = (1 + Math.sqrt(5)) / 2, r = 1 / t, vertices = [ -1, -1, -1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, -1, -1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0, -r, -t, 0, -r, t, 0, r, -t, 0, r, t, -r, -t, 0, -r, t, 0, r, -t, 0, r, t, 0, -t, 0, -r, t, 0, -r, -t, 0, r, t, 0, r ], indices = [ 3, 11, 7, 3, 7, 15, 3, 15, 13, 7, 19, 17, 7, 17, 6, 7, 6, 15, 17, 4, 8, 17, 8, 10, 17, 10, 6, 8, 0, 16, 8, 16, 2, 8, 2, 10, 0, 12, 1, 0, 1, 18, 0, 18, 16, 6, 10, 2, 6, 2, 13, 6, 13, 15, 2, 16, 18, 2, 18, 3, 2, 3, 13, 18, 1, 9, 18, 9, 11, 18, 11, 3, 4, 14, 12, 4, 12, 0, 4, 0, 8, 11, 9, 5, 11, 5, 19, 11, 19, 7, 19, 5, 14, 19, 14, 4, 19, 4, 17, 1, 12, 14, 1, 14, 5, 1, 5, 9 ];
    THREE.PolyhedronGeometry.call(this, vertices, indices, radius, detail);
}, THREE.DodecahedronGeometry.prototype = Object.create(THREE.Geometry.prototype), 
THREE.DodecahedronGeometry.prototype.constructor = THREE.DodecahedronGeometry, THREE.IcosahedronGeometry = function(radius, detail) {
    var t = (1 + Math.sqrt(5)) / 2, vertices = [ -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, 0, 0, -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, t, 0, -1, t, 0, 1, -t, 0, -1, -t, 0, 1 ], indices = [ 0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1 ];
    THREE.PolyhedronGeometry.call(this, vertices, indices, radius, detail), this.type = "IcosahedronGeometry", 
    this.parameters = {
        radius: radius,
        detail: detail
    };
}, THREE.IcosahedronGeometry.prototype = Object.create(THREE.Geometry.prototype), 
THREE.IcosahedronGeometry.prototype.constructor = THREE.IcosahedronGeometry, THREE.OctahedronGeometry = function(radius, detail) {
    this.parameters = {
        radius: radius,
        detail: detail
    };
    var vertices = [ 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1 ], indices = [ 0, 2, 4, 0, 4, 3, 0, 3, 5, 0, 5, 2, 1, 2, 5, 1, 5, 3, 1, 3, 4, 1, 4, 2 ];
    THREE.PolyhedronGeometry.call(this, vertices, indices, radius, detail), this.type = "OctahedronGeometry", 
    this.parameters = {
        radius: radius,
        detail: detail
    };
}, THREE.OctahedronGeometry.prototype = Object.create(THREE.Geometry.prototype), 
THREE.OctahedronGeometry.prototype.constructor = THREE.OctahedronGeometry, THREE.TetrahedronGeometry = function(radius, detail) {
    var vertices = [ 1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1 ], indices = [ 2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1 ];
    THREE.PolyhedronGeometry.call(this, vertices, indices, radius, detail), this.type = "TetrahedronGeometry", 
    this.parameters = {
        radius: radius,
        detail: detail
    };
}, THREE.TetrahedronGeometry.prototype = Object.create(THREE.Geometry.prototype), 
THREE.TetrahedronGeometry.prototype.constructor = THREE.TetrahedronGeometry, THREE.ParametricGeometry = function(func, slices, stacks) {
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
THREE.ParametricGeometry.prototype.constructor = THREE.ParametricGeometry, THREE.AxisHelper = function(size) {
    size = size || 1;
    var vertices = new Float32Array([ 0, 0, 0, size, 0, 0, 0, 0, 0, 0, size, 0, 0, 0, 0, 0, 0, size ]), colors = new Float32Array([ 1, 0, 0, 1, .6, 0, 0, 1, 0, .6, 1, 0, 0, 0, 1, 0, .6, 1 ]), geometry = new THREE.BufferGeometry();
    geometry.addAttribute("position", new THREE.BufferAttribute(vertices, 3)), geometry.addAttribute("color", new THREE.BufferAttribute(colors, 3));
    var material = new THREE.LineBasicMaterial({
        vertexColors: THREE.VertexColors
    });
    THREE.Line.call(this, geometry, material, THREE.LinePieces);
}, THREE.AxisHelper.prototype = Object.create(THREE.Line.prototype), THREE.AxisHelper.prototype.constructor = THREE.AxisHelper, 
THREE.ArrowHelper = function() {
    var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
    var coneGeometry = new THREE.CylinderGeometry(0, .5, 1, 5, 1);
    return coneGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -.5, 0)), 
    function(dir, origin, length, color, headLength, headWidth) {
        THREE.Object3D.call(this), void 0 === color && (color = 16776960), void 0 === length && (length = 1), 
        void 0 === headLength && (headLength = .2 * length), void 0 === headWidth && (headWidth = .2 * headLength), 
        this.position.copy(origin), this.line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({
            color: color
        })), this.line.matrixAutoUpdate = !1, this.add(this.line), this.cone = new THREE.Mesh(coneGeometry, new THREE.MeshBasicMaterial({
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
    this.line.scale.set(1, length - headLength, 1), this.line.updateMatrix(), this.cone.scale.set(headWidth, headLength, headWidth), 
    this.cone.position.y = length, this.cone.updateMatrix();
}, THREE.ArrowHelper.prototype.setColor = function(color) {
    this.line.material.color.set(color), this.cone.material.color.set(color);
}, THREE.BoxHelper = function(object) {
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute("position", new THREE.BufferAttribute(new Float32Array(72), 3)), 
    THREE.Line.call(this, geometry, new THREE.LineBasicMaterial({
        color: 16776960
    }), THREE.LinePieces), void 0 !== object && this.update(object);
}, THREE.BoxHelper.prototype = Object.create(THREE.Line.prototype), THREE.BoxHelper.prototype.constructor = THREE.BoxHelper, 
THREE.BoxHelper.prototype.update = function(object) {
    var geometry = object.geometry;
    null === geometry.boundingBox && geometry.computeBoundingBox();
    var min = geometry.boundingBox.min, max = geometry.boundingBox.max, vertices = this.geometry.attributes.position.array;
    vertices[0] = max.x, vertices[1] = max.y, vertices[2] = max.z, vertices[3] = min.x, 
    vertices[4] = max.y, vertices[5] = max.z, vertices[6] = min.x, vertices[7] = max.y, 
    vertices[8] = max.z, vertices[9] = min.x, vertices[10] = min.y, vertices[11] = max.z, 
    vertices[12] = min.x, vertices[13] = min.y, vertices[14] = max.z, vertices[15] = max.x, 
    vertices[16] = min.y, vertices[17] = max.z, vertices[18] = max.x, vertices[19] = min.y, 
    vertices[20] = max.z, vertices[21] = max.x, vertices[22] = max.y, vertices[23] = max.z, 
    vertices[24] = max.x, vertices[25] = max.y, vertices[26] = min.z, vertices[27] = min.x, 
    vertices[28] = max.y, vertices[29] = min.z, vertices[30] = min.x, vertices[31] = max.y, 
    vertices[32] = min.z, vertices[33] = min.x, vertices[34] = min.y, vertices[35] = min.z, 
    vertices[36] = min.x, vertices[37] = min.y, vertices[38] = min.z, vertices[39] = max.x, 
    vertices[40] = min.y, vertices[41] = min.z, vertices[42] = max.x, vertices[43] = min.y, 
    vertices[44] = min.z, vertices[45] = max.x, vertices[46] = max.y, vertices[47] = min.z, 
    vertices[48] = max.x, vertices[49] = max.y, vertices[50] = max.z, vertices[51] = max.x, 
    vertices[52] = max.y, vertices[53] = min.z, vertices[54] = min.x, vertices[55] = max.y, 
    vertices[56] = max.z, vertices[57] = min.x, vertices[58] = max.y, vertices[59] = min.z, 
    vertices[60] = min.x, vertices[61] = min.y, vertices[62] = max.z, vertices[63] = min.x, 
    vertices[64] = min.y, vertices[65] = min.z, vertices[66] = max.x, vertices[67] = min.y, 
    vertices[68] = max.z, vertices[69] = max.x, vertices[70] = min.y, vertices[71] = min.z, 
    this.geometry.attributes.position.needsUpdate = !0, this.geometry.computeBoundingSphere(), 
    this.matrix = object.matrixWorld, this.matrixAutoUpdate = !1;
}, THREE.BoundingBoxHelper = function(object, hex) {
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
    addLine("cf3", "cf4", hexCross), THREE.Line.call(this, geometry, material, THREE.LinePieces), 
    this.camera = camera, this.matrix = camera.matrixWorld, this.matrixAutoUpdate = !1, 
    this.pointMap = pointMap, this.update();
}, THREE.CameraHelper.prototype = Object.create(THREE.Line.prototype), THREE.CameraHelper.prototype.constructor = THREE.CameraHelper, 
THREE.CameraHelper.prototype.update = function() {
    var geometry, pointMap, vector = new THREE.Vector3(), camera = new THREE.Camera(), setPoint = function(point, x, y, z) {
        vector.set(x, y, z).unproject(camera);
        var points = pointMap[point];
        if (void 0 !== points) for (var i = 0, il = points.length; il > i; i++) geometry.vertices[points[i]].copy(vector);
    };
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
    thresholdAngle = void 0 !== thresholdAngle ? thresholdAngle : 1;
    var geometry2, thresholdDot = Math.cos(THREE.Math.degToRad(thresholdAngle)), edge = [ 0, 0 ], hash = {}, sortFunction = function(a, b) {
        return a - b;
    }, keys = [ "a", "b", "c" ], geometry = new THREE.BufferGeometry();
    object.geometry instanceof THREE.BufferGeometry ? (geometry2 = new THREE.Geometry(), 
    geometry2.fromBufferGeometry(object.geometry)) : geometry2 = object.geometry.clone(), 
    geometry2.mergeVertices(), geometry2.computeFaceNormals();
    for (var vertices = geometry2.vertices, faces = geometry2.faces, numEdges = 0, i = 0, l = faces.length; l > i; i++) for (var face = faces[i], j = 0; 3 > j; j++) {
        edge[0] = face[keys[j]], edge[1] = face[keys[(j + 1) % 3]], edge.sort(sortFunction);
        var key = edge.toString();
        void 0 === hash[key] ? (hash[key] = {
            vert1: edge[0],
            vert2: edge[1],
            face1: i,
            face2: void 0
        }, numEdges++) : hash[key].face2 = i;
    }
    var coords = new Float32Array(2 * numEdges * 3), index = 0;
    for (var key in hash) {
        var h = hash[key];
        if (void 0 === h.face2 || faces[h.face1].normal.dot(faces[h.face2].normal) <= thresholdDot) {
            var vertex = vertices[h.vert1];
            coords[index++] = vertex.x, coords[index++] = vertex.y, coords[index++] = vertex.z, 
            vertex = vertices[h.vert2], coords[index++] = vertex.x, coords[index++] = vertex.y, 
            coords[index++] = vertex.z;
        }
    }
    geometry.addAttribute("position", new THREE.BufferAttribute(coords, 3)), THREE.Line.call(this, geometry, new THREE.LineBasicMaterial({
        color: color
    }), THREE.LinePieces), this.matrix = object.matrixWorld, this.matrixAutoUpdate = !1;
}, THREE.EdgesHelper.prototype = Object.create(THREE.Line.prototype), THREE.EdgesHelper.prototype.constructor = THREE.EdgesHelper, 
THREE.FaceNormalsHelper = function(object, size, hex, linewidth) {
    this.object = object, this.size = void 0 !== size ? size : 1;
    for (var color = void 0 !== hex ? hex : 16776960, width = void 0 !== linewidth ? linewidth : 1, geometry = new THREE.Geometry(), faces = this.object.geometry.faces, i = 0, l = faces.length; l > i; i++) geometry.vertices.push(new THREE.Vector3(), new THREE.Vector3());
    THREE.Line.call(this, geometry, new THREE.LineBasicMaterial({
        color: color,
        linewidth: width
    }), THREE.LinePieces), this.matrixAutoUpdate = !1, this.normalMatrix = new THREE.Matrix3(), 
    this.update();
}, THREE.FaceNormalsHelper.prototype = Object.create(THREE.Line.prototype), THREE.FaceNormalsHelper.prototype.constructor = THREE.FaceNormalsHelper, 
THREE.FaceNormalsHelper.prototype.update = function() {
    var vertices = this.geometry.vertices, object = this.object, objectVertices = object.geometry.vertices, objectFaces = object.geometry.faces, objectWorldMatrix = object.matrixWorld;
    object.updateMatrixWorld(!0), this.normalMatrix.getNormalMatrix(objectWorldMatrix);
    for (var i = 0, i2 = 0, l = objectFaces.length; l > i; i++, i2 += 2) {
        var face = objectFaces[i];
        vertices[i2].copy(objectVertices[face.a]).add(objectVertices[face.b]).add(objectVertices[face.c]).divideScalar(3).applyMatrix4(objectWorldMatrix), 
        vertices[i2 + 1].copy(face.normal).applyMatrix3(this.normalMatrix).normalize().multiplyScalar(this.size).add(vertices[i2]);
    }
    return this.geometry.verticesNeedUpdate = !0, this;
}, THREE.GridHelper = function(size, step) {
    var geometry = new THREE.Geometry(), material = new THREE.LineBasicMaterial({
        vertexColors: THREE.VertexColors
    });
    this.color1 = new THREE.Color(4473924), this.color2 = new THREE.Color(8947848);
    for (var i = -size; size >= i; i += step) {
        geometry.vertices.push(new THREE.Vector3(-size, 0, i), new THREE.Vector3(size, 0, i), new THREE.Vector3(i, 0, -size), new THREE.Vector3(i, 0, size));
        var color = 0 === i ? this.color1 : this.color2;
        geometry.colors.push(color, color, color, color);
    }
    THREE.Line.call(this, geometry, material, THREE.LinePieces);
}, THREE.GridHelper.prototype = Object.create(THREE.Line.prototype), THREE.GridHelper.prototype.constructor = THREE.GridHelper, 
THREE.GridHelper.prototype.setColors = function(colorCenterLine, colorGrid) {
    this.color1.set(colorCenterLine), this.color2.set(colorGrid), this.geometry.colorsNeedUpdate = !0;
}, THREE.HemisphereLightHelper = function(light, sphereSize) {
    THREE.Object3D.call(this), this.light = light, this.light.updateMatrixWorld(), this.matrix = light.matrixWorld, 
    this.matrixAutoUpdate = !1, this.colors = [ new THREE.Color(), new THREE.Color() ];
    var geometry = new THREE.SphereGeometry(sphereSize, 4, 2);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
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
    var material = new THREE.LineBasicMaterial({
        vertexColors: THREE.VertexColors,
        depthTest: !1,
        depthWrite: !1,
        transparent: !0
    });
    THREE.Line.call(this, geometry, material, THREE.LinePieces), this.root = object, 
    this.matrix = object.matrixWorld, this.matrixAutoUpdate = !1, this.update();
}, THREE.SkeletonHelper.prototype = Object.create(THREE.Line.prototype), THREE.SkeletonHelper.prototype.constructor = THREE.SkeletonHelper, 
THREE.SkeletonHelper.prototype.getBoneList = function(object) {
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
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -.5, 0)), geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
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
    for (var color = void 0 !== hex ? hex : 16711680, width = void 0 !== linewidth ? linewidth : 1, geometry = new THREE.Geometry(), faces = object.geometry.faces, i = 0, l = faces.length; l > i; i++) for (var face = faces[i], j = 0, jl = face.vertexNormals.length; jl > j; j++) geometry.vertices.push(new THREE.Vector3(), new THREE.Vector3());
    THREE.Line.call(this, geometry, new THREE.LineBasicMaterial({
        color: color,
        linewidth: width
    }), THREE.LinePieces), this.matrixAutoUpdate = !1, this.normalMatrix = new THREE.Matrix3(), 
    this.update();
}, THREE.VertexNormalsHelper.prototype = Object.create(THREE.Line.prototype), THREE.VertexNormalsHelper.prototype.constructor = THREE.VertexNormalsHelper, 
THREE.VertexNormalsHelper.prototype.update = function(object) {
    var v1 = new THREE.Vector3();
    return function(object) {
        var keys = [ "a", "b", "c", "d" ];
        this.object.updateMatrixWorld(!0), this.normalMatrix.getNormalMatrix(this.object.matrixWorld);
        for (var vertices = this.geometry.vertices, verts = this.object.geometry.vertices, faces = this.object.geometry.faces, worldMatrix = this.object.matrixWorld, idx = 0, i = 0, l = faces.length; l > i; i++) for (var face = faces[i], j = 0, jl = face.vertexNormals.length; jl > j; j++) {
            var vertexId = face[keys[j]], vertex = verts[vertexId], normal = face.vertexNormals[j];
            vertices[idx].copy(vertex).applyMatrix4(worldMatrix), v1.copy(normal).applyMatrix3(this.normalMatrix).normalize().multiplyScalar(this.size), 
            v1.add(vertices[idx]), idx += 1, vertices[idx].copy(v1), idx += 1;
        }
        return this.geometry.verticesNeedUpdate = !0, this;
    };
}(), THREE.VertexTangentsHelper = function(object, size, hex, linewidth) {
    this.object = object, this.size = void 0 !== size ? size : 1;
    for (var color = void 0 !== hex ? hex : 255, width = void 0 !== linewidth ? linewidth : 1, geometry = new THREE.Geometry(), faces = object.geometry.faces, i = 0, l = faces.length; l > i; i++) for (var face = faces[i], j = 0, jl = face.vertexTangents.length; jl > j; j++) geometry.vertices.push(new THREE.Vector3()), 
    geometry.vertices.push(new THREE.Vector3());
    THREE.Line.call(this, geometry, new THREE.LineBasicMaterial({
        color: color,
        linewidth: width
    }), THREE.LinePieces), this.matrixAutoUpdate = !1, this.update();
}, THREE.VertexTangentsHelper.prototype = Object.create(THREE.Line.prototype), THREE.VertexTangentsHelper.prototype.constructor = THREE.VertexTangentsHelper, 
THREE.VertexTangentsHelper.prototype.update = function(object) {
    var v1 = new THREE.Vector3();
    return function(object) {
        var keys = [ "a", "b", "c", "d" ];
        this.object.updateMatrixWorld(!0);
        for (var vertices = this.geometry.vertices, verts = this.object.geometry.vertices, faces = this.object.geometry.faces, worldMatrix = this.object.matrixWorld, idx = 0, i = 0, l = faces.length; l > i; i++) for (var face = faces[i], j = 0, jl = face.vertexTangents.length; jl > j; j++) {
            var vertexId = face[keys[j]], vertex = verts[vertexId], tangent = face.vertexTangents[j];
            vertices[idx].copy(vertex).applyMatrix4(worldMatrix), v1.copy(tangent).transformDirection(worldMatrix).multiplyScalar(this.size), 
            v1.add(vertices[idx]), idx += 1, vertices[idx].copy(v1), idx += 1;
        }
        return this.geometry.verticesNeedUpdate = !0, this;
    };
}(), THREE.WireframeHelper = function(object, hex) {
    var color = void 0 !== hex ? hex : 16777215, edge = [ 0, 0 ], hash = {}, sortFunction = function(a, b) {
        return a - b;
    }, keys = [ "a", "b", "c" ], geometry = new THREE.BufferGeometry();
    if (object.geometry instanceof THREE.Geometry) {
        for (var vertices = object.geometry.vertices, faces = object.geometry.faces, numEdges = 0, edges = new Uint32Array(6 * faces.length), i = 0, l = faces.length; l > i; i++) for (var face = faces[i], j = 0; 3 > j; j++) {
            edge[0] = face[keys[j]], edge[1] = face[keys[(j + 1) % 3]], edge.sort(sortFunction);
            var key = edge.toString();
            void 0 === hash[key] && (edges[2 * numEdges] = edge[0], edges[2 * numEdges + 1] = edge[1], 
            hash[key] = !0, numEdges++);
        }
        for (var coords = new Float32Array(2 * numEdges * 3), i = 0, l = numEdges; l > i; i++) for (var j = 0; 2 > j; j++) {
            var vertex = vertices[edges[2 * i + j]], index = 6 * i + 3 * j;
            coords[index + 0] = vertex.x, coords[index + 1] = vertex.y, coords[index + 2] = vertex.z;
        }
        geometry.addAttribute("position", new THREE.BufferAttribute(coords, 3));
    } else if (object.geometry instanceof THREE.BufferGeometry) if (void 0 !== object.geometry.attributes.index) {
        var vertices = object.geometry.attributes.position.array, indices = object.geometry.attributes.index.array, drawcalls = object.geometry.drawcalls, numEdges = 0;
        0 === drawcalls.length && (drawcalls = [ {
            count: indices.length,
            index: 0,
            start: 0
        } ]);
        for (var edges = new Uint32Array(2 * indices.length), o = 0, ol = drawcalls.length; ol > o; ++o) for (var start = drawcalls[o].start, count = drawcalls[o].count, index = drawcalls[o].index, i = start, il = start + count; il > i; i += 3) for (var j = 0; 3 > j; j++) {
            edge[0] = index + indices[i + j], edge[1] = index + indices[i + (j + 1) % 3], edge.sort(sortFunction);
            var key = edge.toString();
            void 0 === hash[key] && (edges[2 * numEdges] = edge[0], edges[2 * numEdges + 1] = edge[1], 
            hash[key] = !0, numEdges++);
        }
        for (var coords = new Float32Array(2 * numEdges * 3), i = 0, l = numEdges; l > i; i++) for (var j = 0; 2 > j; j++) {
            var index = 6 * i + 3 * j, index2 = 3 * edges[2 * i + j];
            coords[index + 0] = vertices[index2], coords[index + 1] = vertices[index2 + 1], 
            coords[index + 2] = vertices[index2 + 2];
        }
        geometry.addAttribute("position", new THREE.BufferAttribute(coords, 3));
    } else {
        for (var vertices = object.geometry.attributes.position.array, numEdges = vertices.length / 3, numTris = numEdges / 3, coords = new Float32Array(2 * numEdges * 3), i = 0, l = numTris; l > i; i++) for (var j = 0; 3 > j; j++) {
            var index = 18 * i + 6 * j, index1 = 9 * i + 3 * j;
            coords[index + 0] = vertices[index1], coords[index + 1] = vertices[index1 + 1], 
            coords[index + 2] = vertices[index1 + 2];
            var index2 = 9 * i + 3 * ((j + 1) % 3);
            coords[index + 3] = vertices[index2], coords[index + 4] = vertices[index2 + 1], 
            coords[index + 5] = vertices[index2 + 2];
        }
        geometry.addAttribute("position", new THREE.BufferAttribute(coords, 3));
    }
    THREE.Line.call(this, geometry, new THREE.LineBasicMaterial({
        color: color
    }), THREE.LinePieces), this.matrix = object.matrixWorld, this.matrixAutoUpdate = !1;
}, THREE.WireframeHelper.prototype = Object.create(THREE.Line.prototype), THREE.WireframeHelper.prototype.constructor = THREE.WireframeHelper, 
THREE.ImmediateRenderObject = function() {
    THREE.Object3D.call(this), this.render = function(renderCallback) {};
}, THREE.ImmediateRenderObject.prototype = Object.create(THREE.Object3D.prototype), 
THREE.ImmediateRenderObject.prototype.constructor = THREE.ImmediateRenderObject, 
THREE.MorphBlendMesh = function(geometry, material) {
    THREE.Mesh.call(this, geometry, material), this.animationsMap = {}, this.animationsList = [];
    var numFrames = this.geometry.morphTargets.length, name = "__default", startFrame = 0, endFrame = numFrames - 1, fps = numFrames / 1;
    this.createAnimation(name, startFrame, endFrame, fps), this.setAnimationWeight(name, 1);
}, THREE.MorphBlendMesh.prototype = Object.create(THREE.Mesh.prototype), THREE.MorphBlendMesh.prototype.constructor = THREE.MorphBlendMesh, 
THREE.MorphBlendMesh.prototype.createAnimation = function(name, start, end, fps) {
    var animation = {
        startFrame: start,
        endFrame: end,
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
    animation ? (animation.time = 0, animation.active = !0) : THREE.warn("THREE.MorphBlendMesh: animation[" + name + "] undefined in .playAnimation()");
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
            var keyframe = animation.startFrame + THREE.Math.clamp(Math.floor(animation.time / frameTime), 0, animation.length - 1), weight = animation.weight;
            keyframe !== animation.currentFrame && (this.morphTargetInfluences[animation.lastFrame] = 0, 
            this.morphTargetInfluences[animation.currentFrame] = 1 * weight, this.morphTargetInfluences[keyframe] = 0, 
            animation.lastFrame = animation.currentFrame, animation.currentFrame = keyframe);
            var mix = animation.time % frameTime / frameTime;
            animation.directionBackwards && (mix = 1 - mix), this.morphTargetInfluences[animation.currentFrame] = mix * weight, 
            this.morphTargetInfluences[animation.lastFrame] = (1 - mix) * weight;
        }
    }
}, THREE.AnaglyphEffect = function(renderer, width, height) {
    var _aspect, _near, _far, _fov, eyeRight = new THREE.Matrix4(), eyeLeft = new THREE.Matrix4(), focalLength = 125, _cameraL = new THREE.PerspectiveCamera();
    _cameraL.matrixAutoUpdate = !1;
    var _cameraR = new THREE.PerspectiveCamera();
    _cameraR.matrixAutoUpdate = !1;
    var _camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), _scene = new THREE.Scene(), _params = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat
    };
    void 0 === width && (width = 512), void 0 === height && (height = 512);
    var _renderTargetL = new THREE.WebGLRenderTarget(width, height, _params), _renderTargetR = new THREE.WebGLRenderTarget(width, height, _params), _material = new THREE.ShaderMaterial({
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
    }), mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), _material);
    _scene.add(mesh), this.setSize = function(width, height) {
        _renderTargetL && _renderTargetL.dispose(), _renderTargetR && _renderTargetR.dispose(), 
        _renderTargetL = new THREE.WebGLRenderTarget(width, height, _params), _renderTargetR = new THREE.WebGLRenderTarget(width, height, _params), 
        _material.uniforms.mapLeft.value = _renderTargetL, _material.uniforms.mapRight.value = _renderTargetR, 
        renderer.setSize(width, height);
    }, this.render = function(scene, camera) {
        scene.updateMatrixWorld(), void 0 === camera.parent && camera.updateMatrixWorld();
        var hasCameraChanged = _aspect !== camera.aspect || _near !== camera.near || _far !== camera.far || _fov !== camera.fov;
        if (hasCameraChanged) {
            _aspect = camera.aspect, _near = camera.near, _far = camera.far, _fov = camera.fov;
            var xmin, xmax, projectionMatrix = camera.projectionMatrix.clone(), eyeSep = focalLength / 30 * .5, eyeSepOnProjection = eyeSep * _near / focalLength, ymax = _near * Math.tan(THREE.Math.degToRad(.5 * _fov));
            eyeRight.elements[12] = eyeSep, eyeLeft.elements[12] = -eyeSep, xmin = -ymax * _aspect + eyeSepOnProjection, 
            xmax = ymax * _aspect + eyeSepOnProjection, projectionMatrix.elements[0] = 2 * _near / (xmax - xmin), 
            projectionMatrix.elements[8] = (xmax + xmin) / (xmax - xmin), _cameraL.projectionMatrix.copy(projectionMatrix), 
            xmin = -ymax * _aspect - eyeSepOnProjection, xmax = ymax * _aspect - eyeSepOnProjection, 
            projectionMatrix.elements[0] = 2 * _near / (xmax - xmin), projectionMatrix.elements[8] = (xmax + xmin) / (xmax - xmin), 
            _cameraR.projectionMatrix.copy(projectionMatrix);
        }
        _cameraL.matrixWorld.copy(camera.matrixWorld).multiply(eyeLeft), _cameraL.position.copy(camera.position), 
        _cameraL.near = camera.near, _cameraL.far = camera.far, renderer.render(scene, _cameraL, _renderTargetL, !0), 
        _cameraR.matrixWorld.copy(camera.matrixWorld).multiply(eyeRight), _cameraR.position.copy(camera.position), 
        _cameraR.near = camera.near, _cameraR.far = camera.far, renderer.render(scene, _cameraR, _renderTargetR, !0), 
        renderer.render(_scene, _camera);
    }, this.dispose = function() {
        _renderTargetL && _renderTargetL.dispose(), _renderTargetR && _renderTargetR.dispose();
    };
}, THREE.OrbitControls = function(object, domElement) {
    function getAutoRotationAngle() {
        return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
    }
    function getZoomScale() {
        return Math.pow(.95, scope.zoomSpeed);
    }
    function onMouseDown(event) {
        if (scope.enabled !== !1) {
            if (event.preventDefault(), event.button === scope.mouseButtons.ORBIT) {
                if (scope.noRotate === !0) return;
                state = STATE.ROTATE, rotateStart.set(event.clientX, event.clientY);
            } else if (event.button === scope.mouseButtons.ZOOM) {
                if (scope.noZoom === !0) return;
                state = STATE.DOLLY, dollyStart.set(event.clientX, event.clientY);
            } else if (event.button === scope.mouseButtons.PAN) {
                if (scope.noPan === !0) return;
                state = STATE.PAN, panStart.set(event.clientX, event.clientY);
            }
            state !== STATE.NONE && (document.addEventListener("mousemove", onMouseMove, !1), 
            document.addEventListener("mouseup", onMouseUp, !1), scope.dispatchEvent(startEvent));
        }
    }
    function onMouseMove(event) {
        if (scope.enabled !== !1) {
            event.preventDefault();
            var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
            if (state === STATE.ROTATE) {
                if (scope.noRotate === !0) return;
                rotateEnd.set(event.clientX, event.clientY), rotateDelta.subVectors(rotateEnd, rotateStart), 
                scope.rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed), 
                scope.rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed), 
                rotateStart.copy(rotateEnd);
            } else if (state === STATE.DOLLY) {
                if (scope.noZoom === !0) return;
                dollyEnd.set(event.clientX, event.clientY), dollyDelta.subVectors(dollyEnd, dollyStart), 
                dollyDelta.y > 0 ? scope.dollyIn() : dollyDelta.y < 0 && scope.dollyOut(), dollyStart.copy(dollyEnd);
            } else if (state === STATE.PAN) {
                if (scope.noPan === !0) return;
                panEnd.set(event.clientX, event.clientY), panDelta.subVectors(panEnd, panStart), 
                scope.pan(panDelta.x, panDelta.y), panStart.copy(panEnd);
            }
            state !== STATE.NONE && scope.update();
        }
    }
    function onMouseUp() {
        scope.enabled !== !1 && (document.removeEventListener("mousemove", onMouseMove, !1), 
        document.removeEventListener("mouseup", onMouseUp, !1), scope.dispatchEvent(endEvent), 
        state = STATE.NONE);
    }
    function onMouseWheel(event) {
        if (scope.enabled !== !1 && scope.noZoom !== !0 && state === STATE.NONE) {
            event.preventDefault(), event.stopPropagation();
            var delta = 0;
            void 0 !== event.wheelDelta ? delta = event.wheelDelta : void 0 !== event.detail && (delta = -event.detail), 
            delta > 0 ? scope.dollyOut() : 0 > delta && scope.dollyIn(), scope.update(), scope.dispatchEvent(startEvent), 
            scope.dispatchEvent(endEvent);
        }
    }
    function onKeyDown(event) {
        if (scope.enabled !== !1 && scope.noKeys !== !0 && scope.noPan !== !0) switch (event.keyCode) {
          case scope.keys.UP:
            scope.pan(0, scope.keyPanSpeed), scope.update();
            break;

          case scope.keys.BOTTOM:
            scope.pan(0, -scope.keyPanSpeed), scope.update();
            break;

          case scope.keys.LEFT:
            scope.pan(scope.keyPanSpeed, 0), scope.update();
            break;

          case scope.keys.RIGHT:
            scope.pan(-scope.keyPanSpeed, 0), scope.update();
        }
    }
    function touchstart(event) {
        if (scope.enabled !== !1) {
            switch (event.touches.length) {
              case 1:
                if (scope.noRotate === !0) return;
                state = STATE.TOUCH_ROTATE, rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);
                break;

              case 2:
                if (scope.noZoom === !0) return;
                state = STATE.TOUCH_DOLLY;
                var dx = event.touches[0].pageX - event.touches[1].pageX, dy = event.touches[0].pageY - event.touches[1].pageY, distance = Math.sqrt(dx * dx + dy * dy);
                dollyStart.set(0, distance);
                break;

              case 3:
                if (scope.noPan === !0) return;
                state = STATE.TOUCH_PAN, panStart.set(event.touches[0].pageX, event.touches[0].pageY);
                break;

              default:
                state = STATE.NONE;
            }
            state !== STATE.NONE && scope.dispatchEvent(startEvent);
        }
    }
    function touchmove(event) {
        if (scope.enabled !== !1) {
            event.preventDefault(), event.stopPropagation();
            var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
            switch (event.touches.length) {
              case 1:
                if (scope.noRotate === !0) return;
                if (state !== STATE.TOUCH_ROTATE) return;
                rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY), rotateDelta.subVectors(rotateEnd, rotateStart), 
                scope.rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed), 
                scope.rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed), 
                rotateStart.copy(rotateEnd), scope.update();
                break;

              case 2:
                if (scope.noZoom === !0) return;
                if (state !== STATE.TOUCH_DOLLY) return;
                var dx = event.touches[0].pageX - event.touches[1].pageX, dy = event.touches[0].pageY - event.touches[1].pageY, distance = Math.sqrt(dx * dx + dy * dy);
                dollyEnd.set(0, distance), dollyDelta.subVectors(dollyEnd, dollyStart), dollyDelta.y > 0 ? scope.dollyOut() : dollyDelta.y < 0 && scope.dollyIn(), 
                dollyStart.copy(dollyEnd), scope.update();
                break;

              case 3:
                if (scope.noPan === !0) return;
                if (state !== STATE.TOUCH_PAN) return;
                panEnd.set(event.touches[0].pageX, event.touches[0].pageY), panDelta.subVectors(panEnd, panStart), 
                scope.pan(panDelta.x, panDelta.y), panStart.copy(panEnd), scope.update();
                break;

              default:
                state = STATE.NONE;
            }
        }
    }
    function touchend() {
        scope.enabled !== !1 && (scope.dispatchEvent(endEvent), state = STATE.NONE);
    }
    this.object = object, this.domElement = void 0 !== domElement ? domElement : document, 
    this.enabled = !0, this.target = new THREE.Vector3(), this.center = this.target, 
    this.noZoom = !1, this.zoomSpeed = 1, this.minDistance = 0, this.maxDistance = 1 / 0, 
    this.minZoom = 0, this.maxZoom = 1 / 0, this.noRotate = !1, this.rotateSpeed = 1, 
    this.noPan = !1, this.keyPanSpeed = 7, this.autoRotate = !1, this.autoRotateSpeed = 2, 
    this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -(1 / 0), 
    this.maxAzimuthAngle = 1 / 0, this.noKeys = !1, this.keys = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        BOTTOM: 40
    }, this.mouseButtons = {
        ORBIT: THREE.MOUSE.LEFT,
        ZOOM: THREE.MOUSE.MIDDLE,
        PAN: THREE.MOUSE.RIGHT
    };
    var theta, phi, scope = this, EPS = 1e-6, rotateStart = new THREE.Vector2(), rotateEnd = new THREE.Vector2(), rotateDelta = new THREE.Vector2(), panStart = new THREE.Vector2(), panEnd = new THREE.Vector2(), panDelta = new THREE.Vector2(), panOffset = new THREE.Vector3(), offset = new THREE.Vector3(), dollyStart = new THREE.Vector2(), dollyEnd = new THREE.Vector2(), dollyDelta = new THREE.Vector2(), phiDelta = 0, thetaDelta = 0, scale = 1, pan = new THREE.Vector3(), lastPosition = new THREE.Vector3(), lastQuaternion = new THREE.Quaternion(), STATE = {
        NONE: -1,
        ROTATE: 0,
        DOLLY: 1,
        PAN: 2,
        TOUCH_ROTATE: 3,
        TOUCH_DOLLY: 4,
        TOUCH_PAN: 5
    }, state = STATE.NONE;
    this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), 
    this.zoom0 = this.object.zoom;
    var quat = new THREE.Quaternion().setFromUnitVectors(object.up, new THREE.Vector3(0, 1, 0)), quatInverse = quat.clone().inverse(), changeEvent = {
        type: "change"
    }, startEvent = {
        type: "start"
    }, endEvent = {
        type: "end"
    };
    this.rotateLeft = function(angle) {
        void 0 === angle && (angle = getAutoRotationAngle()), thetaDelta -= angle;
    }, this.rotateUp = function(angle) {
        void 0 === angle && (angle = getAutoRotationAngle()), phiDelta -= angle;
    }, this.panLeft = function(distance) {
        var te = this.object.matrix.elements;
        panOffset.set(te[0], te[1], te[2]), panOffset.multiplyScalar(-distance), pan.add(panOffset);
    }, this.panUp = function(distance) {
        var te = this.object.matrix.elements;
        panOffset.set(te[4], te[5], te[6]), panOffset.multiplyScalar(distance), pan.add(panOffset);
    }, this.pan = function(deltaX, deltaY) {
        var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
        if (scope.object instanceof THREE.PerspectiveCamera) {
            var position = scope.object.position, offset = position.clone().sub(scope.target), targetDistance = offset.length();
            targetDistance *= Math.tan(scope.object.fov / 2 * Math.PI / 180), scope.panLeft(2 * deltaX * targetDistance / element.clientHeight), 
            scope.panUp(2 * deltaY * targetDistance / element.clientHeight);
        } else scope.object instanceof THREE.OrthographicCamera ? (scope.panLeft(deltaX * (scope.object.right - scope.object.left) / element.clientWidth), 
        scope.panUp(deltaY * (scope.object.top - scope.object.bottom) / element.clientHeight)) : console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.");
    }, this.dollyIn = function(dollyScale) {
        void 0 === dollyScale && (dollyScale = getZoomScale()), scope.object instanceof THREE.PerspectiveCamera ? scale /= dollyScale : scope.object instanceof THREE.OrthographicCamera ? (scope.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom * dollyScale)), 
        scope.object.updateProjectionMatrix(), scope.dispatchEvent(changeEvent)) : console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.");
    }, this.dollyOut = function(dollyScale) {
        void 0 === dollyScale && (dollyScale = getZoomScale()), scope.object instanceof THREE.PerspectiveCamera ? scale *= dollyScale : scope.object instanceof THREE.OrthographicCamera ? (scope.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / dollyScale)), 
        scope.object.updateProjectionMatrix(), scope.dispatchEvent(changeEvent)) : console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.");
    }, this.update = function() {
        var position = this.object.position;
        offset.copy(position).sub(this.target), offset.applyQuaternion(quat), theta = Math.atan2(offset.x, offset.z), 
        phi = Math.atan2(Math.sqrt(offset.x * offset.x + offset.z * offset.z), offset.y), 
        this.autoRotate && state === STATE.NONE && this.rotateLeft(getAutoRotationAngle()), 
        theta += thetaDelta, phi += phiDelta, theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, theta)), 
        phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, phi)), phi = Math.max(EPS, Math.min(Math.PI - EPS, phi));
        var radius = offset.length() * scale;
        radius = Math.max(this.minDistance, Math.min(this.maxDistance, radius)), this.target.add(pan), 
        offset.x = radius * Math.sin(phi) * Math.sin(theta), offset.y = radius * Math.cos(phi), 
        offset.z = radius * Math.sin(phi) * Math.cos(theta), offset.applyQuaternion(quatInverse), 
        position.copy(this.target).add(offset), this.object.lookAt(this.target), thetaDelta = 0, 
        phiDelta = 0, scale = 1, pan.set(0, 0, 0), (lastPosition.distanceToSquared(this.object.position) > EPS || 8 * (1 - lastQuaternion.dot(this.object.quaternion)) > EPS) && (this.dispatchEvent(changeEvent), 
        lastPosition.copy(this.object.position), lastQuaternion.copy(this.object.quaternion));
    }, this.reset = function() {
        state = STATE.NONE, this.target.copy(this.target0), this.object.position.copy(this.position0), 
        this.object.zoom = this.zoom0, this.object.updateProjectionMatrix(), this.dispatchEvent(changeEvent), 
        this.update();
    }, this.getPolarAngle = function() {
        return phi;
    }, this.getAzimuthalAngle = function() {
        return theta;
    }, this.domElement.addEventListener("contextmenu", function(event) {
        event.preventDefault();
    }, !1), this.domElement.addEventListener("mousedown", onMouseDown, !1), this.domElement.addEventListener("mousewheel", onMouseWheel, !1), 
    this.domElement.addEventListener("DOMMouseScroll", onMouseWheel, !1), this.domElement.addEventListener("touchstart", touchstart, !1), 
    this.domElement.addEventListener("touchend", touchend, !1), this.domElement.addEventListener("touchmove", touchmove, !1), 
    window.addEventListener("keydown", onKeyDown, !1), this.update();
}, THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype), 
THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;

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

var THREEx = THREEx || {};

THREEx.KeyboardState = function(domElement) {
    this.domElement = domElement || document, this.keyCodes = {}, this.modifiers = {};
    var _this = this;
    this._onKeyDown = function(event) {
        _this._onKeyChange(event);
    }, this._onKeyUp = function(event) {
        _this._onKeyChange(event);
    }, this.domElement.addEventListener("keydown", this._onKeyDown, !1), this.domElement.addEventListener("keyup", this._onKeyUp, !1), 
    this._onBlur = function() {
        for (var prop in _this.keyCodes) _this.keyCodes[prop] = !1;
        for (var prop in _this.modifiers) _this.modifiers[prop] = !1;
    }, window.addEventListener("blur", this._onBlur, !1);
}, THREEx.KeyboardState.prototype.destroy = function() {
    this.domElement.removeEventListener("keydown", this._onKeyDown, !1), this.domElement.removeEventListener("keyup", this._onKeyUp, !1), 
    window.removeEventListener("blur", this._onBlur, !1);
}, THREEx.KeyboardState.MODIFIERS = [ "shift", "ctrl", "alt", "meta" ], THREEx.KeyboardState.ALIAS = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    space: 32,
    pageup: 33,
    pagedown: 34,
    tab: 9,
    escape: 27
}, THREEx.KeyboardState.prototype._onKeyChange = function(event) {
    var keyCode = event.keyCode, pressed = "keydown" === event.type ? !0 : !1;
    this.keyCodes[keyCode] = pressed, this.modifiers.shift = event.shiftKey, this.modifiers.ctrl = event.ctrlKey, 
    this.modifiers.alt = event.altKey, this.modifiers.meta = event.metaKey;
}, THREEx.KeyboardState.prototype.pressed = function(keyDesc) {
    for (var keys = keyDesc.split("+"), i = 0; i < keys.length; i++) {
        var key = keys[i], pressed = !1;
        if (pressed = -1 !== THREEx.KeyboardState.MODIFIERS.indexOf(key) ? this.modifiers[key] : -1 != Object.keys(THREEx.KeyboardState.ALIAS).indexOf(key) ? this.keyCodes[THREEx.KeyboardState.ALIAS[key]] : this.keyCodes[key.toUpperCase().charCodeAt(0)], 
        !pressed) return !1;
    }
    return !0;
}, THREEx.KeyboardState.prototype.eventMatches = function(event, keyDesc) {
    for (var aliases = THREEx.KeyboardState.ALIAS, aliasKeys = Object.keys(aliases), keys = keyDesc.split("+"), i = 0; i < keys.length; i++) {
        var key = keys[i], pressed = !1;
        if ("shift" === key ? pressed = event.shiftKey ? !0 : !1 : "ctrl" === key ? pressed = event.ctrlKey ? !0 : !1 : "alt" === key ? pressed = event.altKey ? !0 : !1 : "meta" === key ? pressed = event.metaKey ? !0 : !1 : -1 !== aliasKeys.indexOf(key) ? pressed = event.keyCode === aliases[key] ? !0 : !1 : event.keyCode === key.toUpperCase().charCodeAt(0) && (pressed = !0), 
        !pressed) return !1;
    }
    return !0;
};

var THREEx = THREEx || {};

THREEx.VolumetricSpotLightMaterial = function() {
    var vertexShader = [ "varying vec3 vNormal;", "varying vec3 vWorldPosition;", "void main(){", "// compute intensity", "vNormal		= normalize( normalMatrix * normal );", "vec4 worldPosition	= modelMatrix * vec4( position, 1.0 );", "vWorldPosition		= worldPosition.xyz;", "// set gl_Position", "gl_Position	= projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}" ].join("\n"), fragmentShader = [ "varying vec3		vNormal;", "varying vec3		vWorldPosition;", "uniform vec3		lightColor;", "uniform vec3		spotPosition;", "uniform float		attenuation;", "uniform float		anglePower;", "void main(){", "float intensity;", "intensity	= distance(vWorldPosition, spotPosition)/attenuation;", "intensity	= 1.0 - clamp(intensity, 0.0, 1.0);", "vec3 normal	= vec3(vNormal.x, vNormal.y, abs(vNormal.z));", "float angleIntensity	= pow( dot(normal, vec3(0.0, 0.0, 1.0)), anglePower );", "intensity	= intensity * angleIntensity;", "gl_FragColor	= vec4( lightColor, intensity);", "}" ].join("\n"), material = new THREE.ShaderMaterial({
        uniforms: {
            attenuation: {
                type: "f",
                value: 5
            },
            anglePower: {
                type: "f",
                value: 1.2
            },
            spotPosition: {
                type: "v3",
                value: new THREE.Vector3(0, 0, 0)
            },
            lightColor: {
                type: "c",
                value: new THREE.Color("cyan")
            }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: !0,
        depthWrite: !1
    });
    return material;
}, THREE.ShaderLib.water = {
    uniforms: THREE.UniformsUtils.merge([ THREE.UniformsLib.fog, {
        normalSampler: {
            type: "t",
            value: null
        },
        mirrorSampler: {
            type: "t",
            value: null
        },
        alpha: {
            type: "f",
            value: 1
        },
        time: {
            type: "f",
            value: 0
        },
        distortionScale: {
            type: "f",
            value: 20
        },
        noiseScale: {
            type: "f",
            value: 1
        },
        textureMatrix: {
            type: "m4",
            value: new THREE.Matrix4()
        },
        sunColor: {
            type: "c",
            value: new THREE.Color(8355711)
        },
        sunDirection: {
            type: "v3",
            value: new THREE.Vector3(.70707, .70707, 0)
        },
        eye: {
            type: "v3",
            value: new THREE.Vector3(0, 0, 0)
        },
        waterColor: {
            type: "c",
            value: new THREE.Color(5592405)
        }
    } ]),
    vertexShader: [ "uniform mat4 textureMatrix;", "uniform float time;", "varying vec4 mirrorCoord;", "varying vec3 worldPosition;", "varying vec3 modelPosition;", "varying vec3 surfaceX;", "varying vec3 surfaceY;", "varying vec3 surfaceZ;", "void main()", "{", "  mirrorCoord = modelMatrix * vec4(position, 1.0);", "  worldPosition = mirrorCoord.xyz;", "  modelPosition = position;", "  surfaceX = vec3( modelMatrix[0][0], modelMatrix[0][1], modelMatrix[0][2]);", "  surfaceY = vec3( modelMatrix[1][0], modelMatrix[1][1], modelMatrix[1][2]);", "  surfaceZ = vec3( modelMatrix[2][0], modelMatrix[2][1], modelMatrix[2][2]);", "  mirrorCoord = textureMatrix * mirrorCoord;", "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);", "}" ].join("\n"),
    fragmentShader: [ "uniform sampler2D mirrorSampler;", "uniform float alpha;", "uniform float time;", "uniform float distortionScale;", "uniform float noiseScale;", "uniform sampler2D normalSampler;", "uniform vec3 sunColor;", "uniform vec3 sunDirection;", "uniform vec3 eye;", "uniform vec3 waterColor;", "varying vec4 mirrorCoord;", "varying vec3 worldPosition;", "varying vec3 modelPosition;", "varying vec3 surfaceX;", "varying vec3 surfaceY;", "varying vec3 surfaceZ;", "void sunLight(const vec3 surfaceNormal, const vec3 eyeDirection, in float shiny, in float spec, in float diffuse, inout vec3 diffuseColor, inout vec3 specularColor)", "{", "  vec3 reflection = normalize(reflect(-sunDirection, surfaceNormal));", "  float direction = max(0.0, dot(eyeDirection, reflection));", "  specularColor += pow(direction, shiny) * sunColor * spec;", "  diffuseColor += max(dot(sunDirection, surfaceNormal), 0.0) * sunColor * diffuse;", "}", "vec3 getNoise(in vec2 uv)", "{", "  vec2 uv0 = uv / (103.0 * noiseScale) + vec2(time / 17.0, time / 29.0);", "  vec2 uv1 = uv / (107.0 * noiseScale) - vec2(time / -19.0, time / 31.0);", "  vec2 uv2 = uv / (vec2(8907.0, 9803.0) * noiseScale) + vec2(time / 101.0, time /   97.0);", "  vec2 uv3 = uv / (vec2(1091.0, 1027.0) * noiseScale) - vec2(time / 109.0, time / -113.0);", "  vec4 noise = texture2D(normalSampler, uv0) +", "    texture2D(normalSampler, uv1) +", "    texture2D(normalSampler, uv2) +", "    texture2D(normalSampler, uv3);", "  return noise.xyz * 0.5 - 1.0;", "}", THREE.ShaderChunk.common, THREE.ShaderChunk.fog_pars_fragment, "void main()", "{", "  vec3 worldToEye = eye - worldPosition;", "  vec3 eyeDirection = normalize(worldToEye);", "  vec3 noise = getNoise(modelPosition.xy * 1.0);", "  vec3 distordCoord = noise.x * surfaceX + noise.y * surfaceY;", "  vec3 distordNormal = distordCoord + surfaceZ;", "  if(dot(eyeDirection, surfaceZ) < 0.0)", "    distordNormal = distordNormal * -1.0;", "  vec3 diffuseLight = vec3(0.0);", "  vec3 specularLight = vec3(0.0);", "  sunLight(distordNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight);", "  float distance = length(worldToEye);", "  vec2 distortion = distordCoord.xy * distortionScale * sqrt(distance) * 0.07;", " vec3 mirrorDistord = mirrorCoord.xyz + vec3(distortion.x, distortion.y, 1.0);", " vec3 reflectionSample = texture2DProj(mirrorSampler, mirrorDistord).xyz;", "  float theta = max(dot(eyeDirection, distordNormal), 0.0);", "  float reflectance = 0.3 + (1.0 - 0.3) * pow((1.0 - theta), 3.0);", "  vec3 scatter = max(0.0, dot(distordNormal, eyeDirection)) * waterColor;", "  vec3 albedo = mix(sunColor * diffuseLight * 0.3 + scatter, (vec3(0.1) + reflectionSample * 0.9 + reflectionSample * specularLight), reflectance);", " vec3 outgoingLight = albedo;", THREE.ShaderChunk.fog_fragment, " gl_FragColor = vec4( outgoingLight, alpha );", "}" ].join("\n")
}, THREE.Water = function(renderer, camera, scene, options) {
    function optionalParameter(value, defaultValue) {
        return void 0 !== value ? value : defaultValue;
    }
    THREE.Object3D.call(this), this.name = "water_" + this.id, options = options || {}, 
    this.matrixNeedsUpdate = !0;
    var width = optionalParameter(options.textureWidth, 512), height = optionalParameter(options.textureHeight, 512);
    this.clipBias = optionalParameter(options.clipBias, -1e-4), this.alpha = optionalParameter(options.alpha, 1), 
    this.time = optionalParameter(options.time, 0), this.normalSampler = optionalParameter(options.waterNormals, null), 
    this.sunDirection = optionalParameter(options.sunDirection, new THREE.Vector3(.70707, .70707, 0)), 
    this.sunColor = new THREE.Color(optionalParameter(options.sunColor, 16777215)), 
    this.waterColor = new THREE.Color(optionalParameter(options.waterColor, 8355711)), 
    this.eye = optionalParameter(options.eye, new THREE.Vector3(0, 0, 0)), this.distortionScale = optionalParameter(options.distortionScale, 20), 
    this.noiseScale = optionalParameter(options.noiseScale, 1), this.side = optionalParameter(options.side, THREE.FrontSide), 
    this.fog = optionalParameter(options.fog, !1), this.renderer = renderer, this.scene = scene, 
    this.mirrorPlane = new THREE.Plane(), this.normal = new THREE.Vector3(0, 0, 1), 
    this.cameraWorldPosition = new THREE.Vector3(), this.rotationMatrix = new THREE.Matrix4(), 
    this.lookAtPosition = new THREE.Vector3(0, 0, -1), this.clipPlane = new THREE.Vector4(), 
    camera instanceof THREE.PerspectiveCamera ? this.camera = camera : (this.camera = new THREE.PerspectiveCamera(), 
    console.log(this.name + ": camera is not a Perspective Camera!")), this.textureMatrix = new THREE.Matrix4(), 
    this.mirrorCamera = this.camera.clone(), this.texture = new THREE.WebGLRenderTarget(width, height), 
    this.tempTexture = new THREE.WebGLRenderTarget(width, height);
    var mirrorShader = THREE.ShaderLib.water, mirrorUniforms = THREE.UniformsUtils.clone(mirrorShader.uniforms);
    this.material = new THREE.ShaderMaterial({
        fragmentShader: mirrorShader.fragmentShader,
        vertexShader: mirrorShader.vertexShader,
        uniforms: mirrorUniforms,
        transparent: !0,
        side: this.side,
        fog: this.fog
    }), this.mesh = new THREE.Object3D(), this.material.uniforms.mirrorSampler.value = this.texture, 
    this.material.uniforms.textureMatrix.value = this.textureMatrix, this.material.uniforms.alpha.value = this.alpha, 
    this.material.uniforms.time.value = this.time, this.material.uniforms.normalSampler.value = this.normalSampler, 
    this.material.uniforms.sunColor.value = this.sunColor, this.material.uniforms.waterColor.value = this.waterColor, 
    this.material.uniforms.sunDirection.value = this.sunDirection, this.material.uniforms.distortionScale.value = this.distortionScale, 
    this.material.uniforms.noiseScale.value = this.noiseScale, this.material.uniforms.eye.value = this.eye, 
    THREE.Math.isPowerOfTwo(width) && THREE.Math.isPowerOfTwo(height) || (this.texture.generateMipmaps = !1, 
    this.tempTexture.generateMipmaps = !1);
}, THREE.Water.prototype = Object.create(THREE.Object3D.prototype), THREE.Water.prototype.renderWithMirror = function(otherMirror) {
    this.updateTextureMatrix(), this.matrixNeedsUpdate = !1;
    var tempCamera = otherMirror.camera;
    otherMirror.camera = this.mirrorCamera, otherMirror.render(!0), this.render(), this.matrixNeedsUpdate = !0, 
    otherMirror.camera = tempCamera, otherMirror.updateTextureMatrix();
}, THREE.Water.prototype.updateTextureMatrix = function() {
    function sign(x) {
        return x ? 0 > x ? -1 : 1 : 0;
    }
    void 0 !== this.parent && (this.mesh = this.parent), this.updateMatrixWorld(), this.camera.updateMatrixWorld(), 
    this.cameraWorldPosition.setFromMatrixPosition(this.camera.matrixWorld), this.rotationMatrix.extractRotation(this.matrixWorld), 
    this.normal = new THREE.Vector3(0, 0, 1).applyEuler(this.mesh.rotation);
    var cameraPosition = this.camera.position.clone().sub(this.mesh.position);
    if (this.normal.dot(cameraPosition) < 0) {
        var meshNormal = new THREE.Vector3(0, 0, 1).applyEuler(this.mesh.rotation);
        this.normal.reflect(meshNormal);
    }
    var view = this.mesh.position.clone().sub(this.cameraWorldPosition);
    view.reflect(this.normal).negate(), view.add(this.mesh.position), this.rotationMatrix.extractRotation(this.camera.matrixWorld), 
    this.lookAtPosition.set(0, 0, -1), this.lookAtPosition.applyMatrix4(this.rotationMatrix), 
    this.lookAtPosition.add(this.cameraWorldPosition);
    var target = this.mesh.position.clone().sub(this.lookAtPosition);
    target.reflect(this.normal).negate(), target.add(this.mesh.position), this.up.set(0, -1, 0), 
    this.up.applyMatrix4(this.rotationMatrix), this.up.reflect(this.normal).negate(), 
    this.mirrorCamera.position.copy(view), this.mirrorCamera.up = this.up, this.mirrorCamera.lookAt(target), 
    this.mirrorCamera.aspect = this.camera.aspect, this.mirrorCamera.updateProjectionMatrix(), 
    this.mirrorCamera.updateMatrixWorld(), this.mirrorCamera.matrixWorldInverse.getInverse(this.mirrorCamera.matrixWorld), 
    this.textureMatrix.set(.5, 0, 0, .5, 0, .5, 0, .5, 0, 0, .5, .5, 0, 0, 0, 1), this.textureMatrix.multiply(this.mirrorCamera.projectionMatrix), 
    this.textureMatrix.multiply(this.mirrorCamera.matrixWorldInverse), this.mirrorPlane.setFromNormalAndCoplanarPoint(this.normal, this.mesh.position), 
    this.mirrorPlane.applyMatrix4(this.mirrorCamera.matrixWorldInverse), this.clipPlane.set(this.mirrorPlane.normal.x, this.mirrorPlane.normal.y, this.mirrorPlane.normal.z, this.mirrorPlane.constant);
    var q = new THREE.Vector4(), projectionMatrix = this.mirrorCamera.projectionMatrix;
    q.x = (sign(this.clipPlane.x) + projectionMatrix.elements[8]) / projectionMatrix.elements[0], 
    q.y = (sign(this.clipPlane.y) + projectionMatrix.elements[9]) / projectionMatrix.elements[5], 
    q.z = -1, q.w = (1 + projectionMatrix.elements[10]) / projectionMatrix.elements[14];
    var c = new THREE.Vector4();
    c = this.clipPlane.multiplyScalar(2 / this.clipPlane.dot(q)), projectionMatrix.elements[2] = c.x, 
    projectionMatrix.elements[6] = c.y, projectionMatrix.elements[10] = c.z + 1 - this.clipBias, 
    projectionMatrix.elements[14] = c.w;
    var worldCoordinates = new THREE.Vector3();
    worldCoordinates.setFromMatrixPosition(this.camera.matrixWorld), this.eye = worldCoordinates, 
    this.material.uniforms.eye.value = this.eye;
}, THREE.Water.prototype.render = function(isTempTexture) {
    if (this.matrixNeedsUpdate && this.updateTextureMatrix(), this.matrixNeedsUpdate = !0, 
    void 0 !== this.scene && this.scene instanceof THREE.Scene) {
        this.material.visible = !1;
        var renderTexture = void 0 !== isTempTexture && isTempTexture ? this.tempTexture : this.texture;
        this.renderer.render(this.scene, this.mirrorCamera, renderTexture, !0), this.material.visible = !0, 
        this.material.uniforms.mirrorSampler.value = renderTexture;
    }
};

var SPE = SPE || {};

SPE.utils = {
    randomVector3: function(base, spread) {
        var v = new THREE.Vector3();
        return this.randomizeExistingVector3(v, base, spread), v;
    },
    randomColor: function(base, spread) {
        var v = new THREE.Color();
        return this.randomizeExistingColor(v, base, spread), v;
    },
    randomFloat: function(base, spread) {
        return base + spread * (Math.random() - .5);
    },
    randomVector3OnSphere: function(base, radius, radiusSpread, radiusScale, radiusSpreadClamp) {
        var v = new THREE.Vector3();
        return this.randomizeExistingVector3OnSphere(v, base, radius, radiusSpread, radiusScale, radiusSpreadClamp), 
        v;
    },
    randomVector3OnDisk: function(base, radius, radiusSpread, radiusScale, radiusSpreadClamp) {
        var v = new THREE.Vector3();
        return this.randomizeExistingVector3OnDisk(v, base, radius, radiusSpread, radiusScale, radiusSpreadClamp), 
        v;
    },
    randomVelocityVector3OnSphere: function(base, position, speed, speedSpread, scale) {
        var direction = new THREE.Vector3();
        return this.randomizeExistingVelocityVector3OnSphere(direction, base, position, speed, speedSpread), 
        scale && direction.multiply(scale), direction;
    },
    randomizeExistingVector3: function(v, base, spread) {
        v.copy(base), v.x += Math.random() * spread.x - spread.x / 2, v.y += Math.random() * spread.y - spread.y / 2, 
        v.z += Math.random() * spread.z - spread.z / 2;
    },
    randomizeExistingColor: function(v, base, spread) {
        v.copy(base), v.r += Math.random() * spread.x - spread.x / 2, v.g += Math.random() * spread.y - spread.y / 2, 
        v.b += Math.random() * spread.z - spread.z / 2, v.r = Math.max(0, Math.min(v.r, 1)), 
        v.g = Math.max(0, Math.min(v.g, 1)), v.b = Math.max(0, Math.min(v.b, 1));
    },
    randomizeExistingVector3OnSphere: function(v, base, radius, radiusSpread, radiusScale, radiusSpreadClamp) {
        var z = 2 * Math.random() - 1, t = 6.2832 * Math.random(), r = Math.sqrt(1 - z * z), rand = this.randomFloat(radius, radiusSpread);
        radiusSpreadClamp && (rand = Math.round(rand / radiusSpreadClamp) * radiusSpreadClamp), 
        v.set(r * Math.cos(t) * rand, r * Math.sin(t) * rand, z * rand).multiply(radiusScale), 
        v.add(base);
    },
    randomizeExistingVector3OnDisk: function(v, base, radius, radiusSpread, radiusScale, radiusSpreadClamp) {
        var t = 6.2832 * Math.random(), rand = Math.abs(this.randomFloat(radius, radiusSpread));
        radiusSpreadClamp && (rand = Math.round(rand / radiusSpreadClamp) * radiusSpreadClamp), 
        v.set(Math.cos(t), Math.sin(t), 0).multiplyScalar(rand), radiusScale && v.multiply(radiusScale), 
        v.add(base);
    },
    randomizeExistingVelocityVector3OnSphere: function(v, base, position, speed, speedSpread) {
        v.copy(position).sub(base).normalize().multiplyScalar(Math.abs(this.randomFloat(speed, speedSpread)));
    },
    generateID: function() {
        var str = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
        return str = str.replace(/[xy]/g, function(c) {
            var rand = Math.random(), r = 16 * rand | 0, v = "x" === c ? r : 3 & r | 8;
            return v.toString(16);
        });
    }
};

var SPE = SPE || {};

SPE.Group = function(options) {
    var that = this;
    that.fixedTimeStep = parseFloat("number" == typeof options.fixedTimeStep ? options.fixedTimeStep : .016), 
    that.maxAge = parseFloat(options.maxAge || 3), that.texture = options.texture || null, 
    that.hasPerspective = "boolean" == typeof options.hasPerspective ? options.hasPerspective : "number" == typeof options.hasPerspective ? !!options.hasPerspective : !0, 
    that.colorize = "boolean" == typeof options.colorize ? options.colorize : "number" == typeof options.colorize ? !!options.colorize : !0, 
    that.blending = "number" == typeof options.blending ? options.blending : THREE.AdditiveBlending, 
    that.transparent = "boolean" == typeof options.transparent ? options.transparent : !0, 
    that.alphaTest = "number" == typeof options.alphaTest ? options.alphaTest : .5, 
    that.depthWrite = "boolean" == typeof options.depthWrite ? options.depthWrite : !1, 
    that.depthTest = "boolean" == typeof options.depthTest ? options.depthTest : !0, 
    that.fog = "boolean" == typeof options.fog ? options.fog : !0, that.uniforms = {
        duration: {
            type: "f",
            value: that.maxAge
        },
        texture: {
            type: "t",
            value: that.texture
        },
        fogColor: {
            type: "c",
            value: new THREE.Color()
        },
        fogNear: {
            type: "f",
            value: 10
        },
        fogFar: {
            type: "f",
            value: 200
        },
        fogDensity: {
            type: "f",
            value: .5
        }
    }, that.attributes = {
        acceleration: {
            type: "v3",
            value: []
        },
        velocity: {
            type: "v3",
            value: []
        },
        alive: {
            type: "f",
            value: []
        },
        age: {
            type: "f",
            value: []
        },
        size: {
            type: "v3",
            value: []
        },
        angle: {
            type: "v4",
            value: []
        },
        colorStart: {
            type: "c",
            value: []
        },
        colorMiddle: {
            type: "c",
            value: []
        },
        colorEnd: {
            type: "c",
            value: []
        },
        opacity: {
            type: "v3",
            value: []
        },
        pos: {
            type: "v3",
            value: []
        }
    }, that.defines = {
        HAS_PERSPECTIVE: that.hasPerspective,
        COLORIZE: that.colorize
    }, that.emitters = [], that._pool = [], that._poolCreationSettings = null, that._createNewWhenPoolEmpty = 0, 
    that.maxAgeMilliseconds = 1e3 * that.maxAge, that.geometry = new THREE.Geometry(), 
    that.material = new THREE.ShaderMaterial({
        uniforms: that.uniforms,
        attributes: that.attributes,
        vertexShader: SPE.shaders.vertex,
        fragmentShader: SPE.shaders.fragment,
        blending: that.blending,
        transparent: that.transparent,
        alphaTest: that.alphaTest,
        depthWrite: that.depthWrite,
        depthTest: that.depthTest,
        defines: that.defines,
        fog: that.fog
    }), that.mesh = new THREE.PointCloud(that.geometry, that.material), that.mesh.dynamic = !0;
}, SPE.Group.prototype = {
    _flagUpdate: function() {
        var that = this;
        return that.attributes.age.needsUpdate = !0, that.attributes.alive.needsUpdate = !0, 
        that.attributes.pos.needsUpdate = !0, that;
    },
    addEmitter: function(emitter) {
        var that = this;
        emitter.duration ? emitter.particlesPerSecond = emitter.particleCount / (that.maxAge < emitter.duration ? that.maxAge : emitter.duration) | 0 : emitter.particlesPerSecond = emitter.particleCount / that.maxAge | 0;
        var vertices = that.geometry.vertices, start = vertices.length, end = emitter.particleCount + start, a = that.attributes, acceleration = a.acceleration.value, velocity = a.velocity.value, alive = a.alive.value, age = a.age.value, size = a.size.value, angle = a.angle.value, colorStart = a.colorStart.value, colorMiddle = a.colorMiddle.value, colorEnd = a.colorEnd.value, opacity = a.opacity.value, pos = a.pos.value, basePos = new THREE.Vector3();
        emitter.particleIndex = parseFloat(start);
        for (var i = start; end > i; ++i) "sphere" === emitter.type ? (vertices[i] = basePos, 
        pos[i] = that.randomVector3OnSphere(emitter._position, emitter._radius, emitter._radiusSpread, emitter._radiusScale, emitter._radiusSpreadClamp), 
        velocity[i] = that.randomVelocityVector3OnSphere(pos[i], emitter._position, emitter._speed, emitter._speedSpread)) : "disk" === emitter.type ? (vertices[i] = basePos, 
        pos[i] = that.randomVector3OnDisk(emitter._position, emitter._radius, emitter._radiusSpread, emitter._radiusScale, emitter._radiusSpreadClamp), 
        velocity[i] = that.randomVelocityVector3OnSphere(pos[i], emitter._position, emitter._speed, emitter._speedSpread)) : (vertices[i] = basePos, 
        pos[i] = that.randomVector3(emitter._position, emitter._positionSpread), velocity[i] = that.randomVector3(emitter._velocity, emitter._velocitySpread)), 
        acceleration[i] = that.randomVector3(emitter._acceleration, emitter._accelerationSpread), 
        size[i] = new THREE.Vector3(Math.abs(that.randomFloat(emitter._sizeStart, emitter._sizeStartSpread)), Math.abs(that.randomFloat(emitter._sizeMiddle, emitter._sizeMiddleSpread)), Math.abs(that.randomFloat(emitter._sizeEnd, emitter._sizeEndSpread))), 
        angle[i] = new THREE.Vector4(that.randomFloat(emitter._angleStart, emitter._angleStartSpread), that.randomFloat(emitter._angleMiddle, emitter._angleMiddleSpread), that.randomFloat(emitter._angleEnd, emitter._angleEndSpread), emitter.angleAlignVelocity ? 1 : 0), 
        age[i] = 0, alive[i] = emitter.isStatic ? 1 : 0, colorStart[i] = that.randomColor(emitter._colorStart, emitter._colorStartSpread), 
        colorMiddle[i] = that.randomColor(emitter._colorMiddle, emitter._colorMiddleSpread), 
        colorEnd[i] = that.randomColor(emitter._colorEnd, emitter._colorEndSpread), opacity[i] = new THREE.Vector3(Math.abs(that.randomFloat(emitter._opacityStart, emitter._opacityStartSpread)), Math.abs(that.randomFloat(emitter._opacityMiddle, emitter._opacityMiddleSpread)), Math.abs(that.randomFloat(emitter._opacityEnd, emitter._opacityEndSpread)));
        return emitter.verticesIndex = parseFloat(start), emitter.attributes = a, emitter.vertices = that.geometry.vertices, 
        emitter.geometry = that.geometry, emitter.maxAge = that.maxAge, emitter.__id = that.generateID(), 
        emitter.isStatic || that.emitters.push(emitter), that;
    },
    removeEmitter: function(emitter) {
        var id, emitters = this.emitters;
        if (emitter instanceof SPE.Emitter) id = emitter.__id; else {
            if ("string" != typeof emitter) return void console.warn("Invalid emitter or emitter ID passed to SPE.Group#removeEmitter.");
            id = emitter;
        }
        for (var i = 0, il = emitters.length; il > i; ++i) if (emitters[i].__id === id) {
            emitters.splice(i, 1);
            break;
        }
    },
    tick: function(dt) {
        var that = this, emitters = that.emitters, numEmitters = emitters.length;
        if (dt = dt || that.fixedTimeStep, 0 !== numEmitters) {
            for (var i = 0; numEmitters > i; ++i) emitters[i].tick(dt);
            return that._flagUpdate(), that;
        }
    },
    getFromPool: function() {
        var that = this, pool = that._pool, createNew = that._createNewWhenPoolEmpty;
        return pool.length ? pool.pop() : createNew ? new SPE.Emitter(that._poolCreationSettings) : null;
    },
    releaseIntoPool: function(emitter) {
        return emitter instanceof SPE.Emitter ? (emitter.reset(), this._pool.unshift(emitter), 
        this) : void console.error("Will not add non-emitter to particle group pool:", emitter);
    },
    getPool: function() {
        return this._pool;
    },
    addPool: function(numEmitters, emitterSettings, createNew) {
        var emitter, that = this;
        that._poolCreationSettings = emitterSettings, that._createNewWhenPoolEmpty = !!createNew;
        for (var i = 0; numEmitters > i; ++i) emitter = new SPE.Emitter(emitterSettings), 
        that.addEmitter(emitter), that.releaseIntoPool(emitter);
        return that;
    },
    _triggerSingleEmitter: function(pos) {
        var that = this, emitter = that.getFromPool();
        return null === emitter ? void console.log("SPE.Group pool ran out.") : (pos instanceof THREE.Vector3 && emitter._position.copy(pos), 
        emitter.enable(), setTimeout(function() {
            emitter.disable(), that.releaseIntoPool(emitter);
        }, that.maxAgeMilliseconds), that);
    },
    triggerPoolEmitter: function(numEmitters, position) {
        var that = this;
        if ("number" == typeof numEmitters && numEmitters > 1) for (var i = 0; numEmitters > i; ++i) that._triggerSingleEmitter(position); else that._triggerSingleEmitter(position);
        return that;
    }
};

for (var i in SPE.utils) SPE.Group.prototype[i] = SPE.utils[i];

SPE.shaders = {
    vertex: [ "uniform float duration;", "uniform float scale;", "attribute vec3 colorStart;", "attribute vec3 colorMiddle;", "attribute vec3 colorEnd;", "attribute vec3 opacity;", "attribute vec3 acceleration;", "attribute vec3 velocity;", "attribute float alive;", "attribute float age;", "attribute vec3 size;", "attribute vec4 angle;", "attribute vec3 pos;", "varying vec4 vColor;", "varying float vAngle;", THREE.ShaderChunk.common, THREE.ShaderChunk.logdepthbuf_pars_vertex, "vec4 GetPos() {", "   vec3 newPos = vec3( pos );", "   vec3 a = acceleration * age;", "   vec3 v = velocity * age;", "   v = v + (a * age);", "   newPos = newPos + v;", "   vec4 mvPosition = modelViewMatrix * vec4( newPos, 1.0 );", "   return mvPosition;", "}", "void main() {", "   float positionInTime = (age / duration);", "   float halfDuration = 0.5 * duration;", "   float lerpAmount = 0.0;", "   float pointSize = 0.0;", "   float deadPos = 1000000000.0;", "   vAngle = 0.0;", "   if( alive == 1.0 ) {", "       vec4 currentPos = GetPos();", "       if( positionInTime < 0.5 ) {", "           lerpAmount = age / halfDuration;", "           vColor = vec4( mix( colorStart, colorMiddle, lerpAmount ), mix( opacity.x, opacity.y, lerpAmount ) );", "           pointSize = mix( size.x, size.y, lerpAmount );", "           vAngle = mix( angle.x, angle.y, lerpAmount );", "       }", "       else {", "           lerpAmount = ( age - halfDuration ) / halfDuration;", "           vColor = vec4( mix( colorMiddle, colorEnd, lerpAmount ), mix( opacity.y, opacity.z, lerpAmount ) );", "           pointSize = mix( size.y, size.z, lerpAmount );", "           vAngle = mix( angle.y, angle.z, lerpAmount );", "       }", "       if( angle.w == 1.0 ) {", "           vAngle = -atan( currentPos.y, currentPos.x );", "       }", "       #ifdef HAS_PERSPECTIVE", "           pointSize = pointSize * ( 300.0 / length( currentPos.xyz ) );", "       #endif", "       gl_PointSize = pointSize;", "       gl_Position = projectionMatrix * currentPos;", "   }", "   else {", "       vColor = vec4( 0.0 );", "       gl_Position = vec4( deadPos, deadPos, deadPos, 0.0 );", "   }", THREE.ShaderChunk.logdepthbuf_vertex, "}" ].join("\n"),
    fragment: [ "uniform sampler2D texture;", THREE.ShaderChunk.common, THREE.ShaderChunk.fog_pars_fragment, THREE.ShaderChunk.logdepthbuf_pars_fragment, "varying vec4 vColor;", "varying float vAngle;", "void main() {", "   vec3 outgoingLight = vColor.xyz;", "   float c = cos( vAngle );", "   float s = sin( vAngle );", "   float x = gl_PointCoord.x - 0.5;", "   float y = gl_PointCoord.y - 0.5;", "   vec2 rotatedUV = vec2( c * x + s * y + 0.5, c * y - s * x + 0.5 );", "   vec4 rotatedTexture = texture2D( texture, rotatedUV );", THREE.ShaderChunk.logdepthbuf_fragment, "   #ifdef COLORIZE", "      outgoingLight = vColor.xyz * rotatedTexture.xyz;", "   #else", "      outgoingLight = vec3( rotatedTexture.xyz );", "   #endif", THREE.ShaderChunk.fog_fragment, "   gl_FragColor = vec4( outgoingLight.xyz, rotatedTexture.w * vColor.w );", "}" ].join("\n")
};

var SPE = SPE || {};

SPE.Emitter = function(options) {
    options = options || {};
    var that = this;
    that._updateFlags = {}, that._updateCounts = {}, that._particleCount = 100, that._type = "cube", 
    that._position = new THREE.Vector3(), that._positionSpread = new THREE.Vector3(), 
    that._radius = 10, that._radiusSpread = 0, that._radiusScale = new THREE.Vector3(1, 1, 1), 
    that._radiusSpreadClamp = 0, that._acceleration = new THREE.Vector3(), that._accelerationSpread = new THREE.Vector3(), 
    that._velocity = new THREE.Vector3(), that._velocitySpread = new THREE.Vector3(), 
    that._speed = 0, that._speedSpread = 0, that._sizeStart = 1, that._sizeStartSpread = 0, 
    that._sizeEnd = 1, that._sizeEndSpread = 0, that._sizeMiddle = Math.abs(that._sizeEnd + that._sizeStart) / 2, 
    that._sizeMiddleSpread = 0, that._angleStart = 0, that._angleStartSpread = 0, that._angleMiddle = 0, 
    that._angleMiddleSpread = 0, that._angleEnd = 0, that._angleEndSpread = 0, that._angleAlignVelocity = !1, 
    that._colorStart = new THREE.Color("white"), that._colorStartSpread = new THREE.Vector3(), 
    that._colorEnd = that._colorStart.clone(), that._colorEndSpread = new THREE.Vector3(), 
    that._colorMiddle = new THREE.Color().addColors(that._colorStart, that._colorEnd).multiplyScalar(.5), 
    that._colorMiddleSpread = new THREE.Vector3(), that._opacityStart = 1, that._opacityStartSpread = 0, 
    that._opacityEnd = 0, that._opacityEndSpread = 0, that._opacityMiddle = Math.abs(that._opacityEnd + that._opacityStart) / 2, 
    that._opacityMiddleSpread = 0;
    var optionKeys = Object.keys(options), hasSizeMiddle = !!~optionKeys.indexOf("sizeMiddle"), hasAngleMiddle = !!~optionKeys.indexOf("angleMiddle"), hasColorMiddle = !!~optionKeys.indexOf("colorMiddle"), hasOpacityMiddle = !!~optionKeys.indexOf("opacityMiddle");
    for (var i in options) that.hasOwnProperty("_" + i) && (that[i] = options[i]);
    hasSizeMiddle || (that.sizeMiddle = Math.abs(that._sizeEnd + that._sizeStart) / 2), 
    hasAngleMiddle || (that.angleMiddle = Math.abs(that._angleEnd + that._angleStart) / 2), 
    hasColorMiddle || (that.colorMiddle = Math.abs(that._colorEnd + that._colorStart) / 2), 
    hasOpacityMiddle || (that.opacityMiddle = Math.abs(that._opacityEnd + that._opacityStart) / 2), 
    that.duration = "number" == typeof options.duration ? options.duration : null, that.alive = parseFloat("number" == typeof options.alive ? options.alive : 1), 
    that.isStatic = "number" == typeof options.isStatic ? !!options.isStatic : "boolean" == typeof options.isStatic ? options.isStatic : !1, 
    that.onParticleSpawn = "function" == typeof options.onParticleSpawn ? options.onParticleSpawn : null, 
    that.particlesPerSecond = 0, that.attributes = null, that.vertices = null, that.verticesIndex = 0, 
    that.age = 0, that.maxAge = 0, that.particleIndex = 0, that.hasRendered = !1, that.attributesNeedUpdate = !1, 
    that.__id = null, that.userData = {};
}, SPE.Emitter.prototype = {
    _resetParticle: function(i) {
        var that = this, type = that._type, spread = that.positionSpread, a = that.attributes, particlePosition = a.pos.value[i], particleVelocity = a.velocity.value[i], particleAcceleration = a.acceleration.value[i], vSpread = that.velocitySpread, aSpread = that.accelerationSpread;
        "cube" === type && 0 === spread.x && 0 === spread.y && 0 === spread.z || "sphere" === type && 0 === that.radius || "disk" === type && 0 === that.radius ? (particlePosition.copy(that._position), 
        that.randomizeExistingVector3(particleVelocity, that._velocity, vSpread), a.velocity.needsUpdate = !0, 
        "cube" === type && (that.randomizeExistingVector3(particleAcceleration, that.acceleration, aSpread), 
        a.acceleration.needsUpdate = !0)) : "cube" === type ? (that.randomizeExistingVector3(particlePosition, that._position, spread), 
        that.randomizeExistingVector3(particleVelocity, that._velocity, vSpread), that.randomizeExistingVector3(particleAcceleration, that.acceleration, aSpread), 
        a.velocity.needsUpdate = !0, a.acceleration.needsUpdate = !0) : "sphere" === type ? (that.randomizeExistingVector3OnSphere(particlePosition, that._position, that._radius, that._radiusSpread, that._radiusScale, that._radiusSpreadClamp), 
        that.randomizeExistingVelocityVector3OnSphere(particleVelocity, that._position, particlePosition, that._speed, that._speedSpread), 
        that.randomizeExistingVector3(particleAcceleration, that.acceleration, aSpread), 
        a.velocity.needsUpdate = !0, a.acceleration.needsUpdate = !0) : "disk" === type && (that.randomizeExistingVector3OnDisk(particlePosition, that._position, that._radius, that._radiusSpread, that._radiusScale, that._radiusSpreadClamp), 
        that.randomizeExistingVelocityVector3OnSphere(particleVelocity, that.position, particlePosition, that._speed, that._speedSpread), 
        that.randomizeExistingVector3(particleAcceleration, that.acceleration, aSpread), 
        a.velocity.needsUpdate = !0, a.acceleration.needsUpdate = !0), that._updateParticlesFromFlags(i), 
        "function" == typeof that.onParticleSpawn && that.onParticleSpawn(a, i);
    },
    _updateParticlesFromFlags: function(particleIndex) {
        if (this.hasRendered) {
            var that = this, flags = that._updateFlags, counts = that._updateCounts, numParticles = that._particleCount, attributes = that.attributes, needsUpdate = that.attributesNeedUpdate, start = that.verticesIndex, end = start + numParticles, pos = attributes.pos.value, type = that.type;
            if (flags.position === !0 && needsUpdate === !0) {
                if ("cube" === type && 0 === that._positionSpread.x && 0 === that._positionSpread.y && 0 === that._positionSpread.z || "sphere" === type && 0 === that._radius || "disk" === type && 0 === that._radius) for (var i = start, p = that.position; end > i; ++i) pos[i].copy(p); else if ("cube" === type) for (var i = start, p = that._position; end > i; ++i) that.randomizeExistingVector3(pos[i], p, that._positionSpread); else if ("sphere" === type) for (var i = start, p = that._position; end > i; ++i) that.randomizeExistingVector3OnSphere(pos[i], that._position, that._radius, that._radiusSpread, that._radiusScale, that._radiusSpreadClamp); else if ("disk" === type) for (var i = start, p = that._position; end > i; ++i) that.randomizeExistingVector3OnDisk(pos[i], that._position, that._radius, that._radiusSpread, that._radiusScale, that._radiusSpreadClamp);
                flags.position = !1;
            }
            if (flags.velocity === !0 && needsUpdate === !0) {
                if ("cube" === type) for (var i = start; end > i; ++i) that.randomizeExistingVector3(attributes.velocity.value[i], that._velocity, that._velocitySpread); else if ("sphere" === type || "disk" === type) for (var i = start, p = that.position; end > i; ++i) that.randomizeExistingVelocityVector3OnSphere(attributes.velocity.value[i], p, pos[i], that._speed, that._speedSpread);
                attributes.velocity.needsUpdate = !0, flags.velocity = !1;
            }
            if (flags.acceleration === !0 && needsUpdate === !0 && "cube" === type) {
                for (var i = start, a = attributes.acceleration.value; end > i; ++i) that.randomizeExistingVector3(a[i], that._acceleration, that._accelerationSpread);
                attributes.acceleration.needsUpdate = !0, flags.acceleration = !1;
            }
            if (flags.sizeStart === !0) {
                if (needsUpdate === !0) for (var i = start, v = attributes.size.value; end > i; ++i) v[i].x = Math.abs(that.randomFloat(that._sizeStart, that._sizeStartSpread)); else attributes.size.value[particleIndex].x = Math.abs(that.randomFloat(that._sizeStart, that._sizeStartSpread));
                attributes.size.needsUpdate = !0, ++counts.sizeStart === numParticles && (counts.sizeStart = 0, 
                flags.sizeStart = !1);
            }
            if (flags.sizeMiddle === !0) {
                if (needsUpdate === !0) for (var i = start, v = attributes.size.value; end > i; ++i) v[i].y = Math.abs(that.randomFloat(that._sizeMiddle, that._sizeMiddleSpread)); else attributes.size.value[particleIndex].y = Math.abs(that.randomFloat(that._sizeMiddle, that._sizeMiddleSpread));
                attributes.size.needsUpdate = !0, ++counts.sizeMiddle === numParticles && (counts.sizeMiddle = 0, 
                flags.sizeMiddle = !1);
            }
            if (flags.sizeEnd === !0) {
                if (needsUpdate === !0) for (var i = start, v = attributes.size.value; end > i; ++i) v[i].z = Math.abs(that.randomFloat(that._sizeEnd, that._sizeEndSpread)); else attributes.size.value[particleIndex].z = Math.abs(that.randomFloat(that._sizeEnd, that._sizeEndSpread));
                attributes.size.needsUpdate = !0, ++counts.sizeEnd === numParticles && (counts.sizeEnd = 0, 
                flags.sizeEnd = !1);
            }
            if (flags.colorStart === !0) {
                if (needsUpdate === !0) for (var i = start, v = attributes.colorStart.value; end > i; ++i) that.randomizeExistingColor(v[i], that._colorStart, that._colorStartSpread); else that.randomizeExistingColor(attributes.colorStart.value[particleIndex], that._colorStart, that._colorStartSpread);
                attributes.colorStart.needsUpdate = !0, ++counts.colorStart === numParticles && (counts.colorStart = 0, 
                flags.colorStart = !1);
            }
            if (flags.colorMiddle === !0) {
                if (needsUpdate === !0) for (var i = start, v = attributes.colorMiddle.value; end > i; ++i) that.randomizeExistingColor(v[i], that._colorMiddle, that._colorMiddleSpread); else that.randomizeExistingColor(attributes.colorMiddle.value[particleIndex], that._colorMiddle, that._colorMiddleSpread);
                attributes.colorMiddle.needsUpdate = !0, ++counts.colorMiddle === numParticles && (counts.colorMiddle = 0, 
                flags.colorMiddle = !1);
            }
            if (flags.colorEnd === !0) {
                if (needsUpdate === !0) for (var i = start, v = attributes.colorEnd.value; end > i; ++i) that.randomizeExistingColor(v[i], that._colorEnd, that._colorEndSpread); else that.randomizeExistingColor(attributes.colorEnd.value[particleIndex], that._colorEnd, that._colorEndSpread);
                attributes.colorEnd.needsUpdate = !0, ++counts.colorEnd === numParticles && (counts.colorEnd = 0, 
                flags.colorEnd = !1);
            }
            if (flags.opacityStart === !0) {
                if (needsUpdate === !0) for (var i = start, v = attributes.opacity.value; end > i; ++i) v[i].x = Math.abs(that.randomFloat(that._opacityStart, that._opacityStartSpread)); else attributes.opacity.value[particleIndex].x = Math.abs(that.randomFloat(that._opacityStart, that._opacityStartSpread));
                attributes.opacity.needsUpdate = !0, ++counts.opacityStart === numParticles && (counts.opacityStart = 0, 
                flags.opacityStart = !1);
            }
            if (flags.opacityMiddle === !0) {
                if (needsUpdate === !0) for (var i = start, v = attributes.opacity.value; end > i; ++i) v[i].y = Math.abs(that.randomFloat(that._opacityMiddle, that._opacityMiddleSpread)); else attributes.opacity.value[particleIndex].y = Math.abs(that.randomFloat(that._opacityMiddle, that._opacityMiddleSpread));
                attributes.opacity.needsUpdate = !0, ++counts.opacityMiddle === numParticles && (counts.opacityMiddle = 0, 
                flags.opacityMiddle = !1);
            }
            if (flags.opacityEnd === !0) {
                if (needsUpdate === !0) for (var i = start, v = attributes.opacity.value; end > i; ++i) v[i].z = Math.abs(that.randomFloat(that._opacityEnd, that._opacityEndSpread)); else attributes.opacity.value[particleIndex].z = Math.abs(that.randomFloat(that._opacityEnd, that._opacityEndSpread));
                attributes.opacity.needsUpdate = !0, ++counts.opacityEnd === numParticles && (counts.opacityEnd = 0, 
                flags.opacityEnd = !1);
            }
            if (flags.angleStart === !0) {
                if (needsUpdate === !0) for (var i = start, v = attributes.angle.value; end > i; ++i) v[i].x = Math.abs(that.randomFloat(that._angleStart, that._angleStartSpread)); else attributes.angle.value[particleIndex].x = Math.abs(that.randomFloat(that._angleStart, that._angleStartSpread));
                attributes.angle.needsUpdate = !0, ++counts.angleStart === numParticles && (counts.angleStart = 0, 
                flags.angleStart = !1);
            }
            if (flags.angleMiddle === !0) {
                if (needsUpdate === !0) for (var i = start, v = attributes.angle.value; end > i; ++i) v[i].y = Math.abs(that.randomFloat(that._angleMiddle, that._angleMiddleSpread)); else attributes.angle.value[particleIndex].y = Math.abs(that.randomFloat(that._angleMiddle, that._angleMiddleSpread));
                attributes.angle.needsUpdate = !0, ++counts.angleMiddle === numParticles && (counts.angleMiddle = 0, 
                flags.angleMiddle = !1);
            }
            if (flags.angleEnd === !0) {
                if (needsUpdate === !0) for (var i = start, v = attributes.angle.value; end > i; ++i) v[i].z = Math.abs(that.randomFloat(that._angleEnd, that._angleEndSpread)); else attributes.angle.value[particleIndex].z = Math.abs(that.randomFloat(that._angleEnd, that._angleEndSpread));
                attributes.angle.needsUpdate = !0, ++counts.angleEnd === numParticles && (counts.angleEnd = 0, 
                flags.angleEnd = !1);
            }
            that.attributesNeedUpdate = !1;
        }
    },
    tick: function(dt) {
        if (this.hasRendered = !0, this.isStatic !== !0) {
            for (var that = this, a = that.attributes, alive = a.alive.value, age = a.age.value, start = that.verticesIndex, particleCount = that._particleCount, end = start + particleCount, pps = that.particlesPerSecond * that.alive, ppsdt = pps * dt, m = that.maxAge, emitterAge = that.age, duration = that.duration, pIndex = that.particleIndex, i = start; end > i; ++i) 1 === alive[i] && (age[i] += dt), 
            age[i] >= m && (age[i] = 0, alive[i] = 0);
            if (0 === that.alive) return void (that.age = 0);
            if ("number" == typeof duration && emitterAge > duration) return that.alive = 0, 
            void (that.age = 0);
            var dtInc, n = Math.max(Math.min(end, pIndex + ppsdt), 0), count = 0, index = 0, pIndexFloor = 0 | pIndex;
            for (i = pIndexFloor; n > i; ++i) 1 !== alive[i] && ++count;
            if (0 !== count) for (dtInc = dt / count, i = pIndexFloor; n > i; ++i, ++index) 1 !== alive[i] && (alive[i] = 1, 
            age[i] = dtInc * index, that._resetParticle(i));
            that.particleIndex += ppsdt, that.particleIndex < 0 && (that.particleIndex = 0), 
            pIndex >= start + particleCount && (that.particleIndex = parseFloat(start)), that.age += dt, 
            that.age < 0 && (that.age = 0);
        }
    },
    reset: function(force) {
        var that = this;
        if (that.age = 0, that.alive = 0, force) for (var start = that.verticesIndex, end = that.verticesIndex + that._particleCount, a = that.attributes, alive = a.alive.value, age = a.age.value, i = start; end > i; ++i) alive[i] = 0, 
        age[i] = 0;
        return that;
    },
    enable: function() {
        this.alive = 1;
    },
    disable: function() {
        this.alive = 0;
    }
}, Object.defineProperty(SPE.Emitter.prototype, "type", {
    get: function() {
        return this._type;
    },
    set: function(value) {
        "cube" === value || "sphere" === value || "disk" === value ? (this._type = value, 
        this._updateFlags.type = !0) : console.warn("Invalid emitter type: " + value + '. Emitter type not changed from "' + this._type + '"');
    }
}), Object.defineProperty(SPE.Emitter.prototype, "particleCount", {
    get: function() {
        return this._particleCount;
    },
    set: function(value) {
        "number" == typeof value && value >= 1 ? this._particleCount = Math.round(value) : console.warn("Invalid particleCount specified: " + value + ". Must be a number >= 1. ParticleCount remains at: " + this._particleCount);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "position", {
    get: function() {
        return this._position;
    },
    set: function(value) {
        value instanceof THREE.Vector3 ? (this._position = value, this._updateFlags.position = !0) : console.warn("Invalid position specified. Must be instance of THREE.Vector3.");
    }
}), Object.defineProperty(SPE.Emitter.prototype, "positionSpread", {
    get: function() {
        return this._positionSpread;
    },
    set: function(value) {
        value instanceof THREE.Vector3 ? (this._positionSpread = value, this._updateFlags.position = !0) : console.warn("Invalid positionSpread specified. Must be instance of THREE.Vector3.");
    }
}), Object.defineProperty(SPE.Emitter.prototype, "radius", {
    get: function() {
        return this._radius;
    },
    set: function(value) {
        "number" == typeof value ? (this._radius = value, this._updateFlags.position = !0) : console.warn("Invalid radius specified: " + value + ". Must be a number. radius remains at: " + this._radius);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "radiusSpread", {
    get: function() {
        return this._radiusSpread;
    },
    set: function(value) {
        "number" == typeof value ? (this._radiusSpread = value, this._updateFlags.position = !0) : console.warn("Invalid radiusSpread specified: " + value + ". Must be a number. radiusSpread remains at: " + this._radiusSpread);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "radiusScale", {
    get: function() {
        return this._radiusScale;
    },
    set: function(value) {
        value instanceof THREE.Vector3 ? (this._radiusScale = value, this._updateFlags.position = !0) : console.warn("Invalid radiusScale specified. Must be instance of THREE.Vector3.");
    }
}), Object.defineProperty(SPE.Emitter.prototype, "radiusSpreadClamp", {
    get: function() {
        return this._radiusSpreadClamp;
    },
    set: function(value) {
        "number" == typeof value ? (this._radiusSpreadClamp = value, this._updateFlags.position = !0) : console.warn("Invalid radiusSpreadClamp specified: " + value + ". Must be a number. radiusSpreadClamp remains at: " + this._radiusSpreadClamp);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "acceleration", {
    get: function() {
        return this._acceleration;
    },
    set: function(value) {
        value instanceof THREE.Vector3 ? (this._acceleration = value, this._updateFlags.acceleration = !0) : console.warn("Invalid acceleration specified. Must be instance of THREE.Vector3.");
    }
}), Object.defineProperty(SPE.Emitter.prototype, "accelerationSpread", {
    get: function() {
        return this._accelerationSpread;
    },
    set: function(value) {
        value instanceof THREE.Vector3 ? (this._accelerationSpread = value, this._updateFlags.acceleration = !0) : console.warn("Invalid accelerationSpread specified. Must be instance of THREE.Vector3.");
    }
}), Object.defineProperty(SPE.Emitter.prototype, "velocity", {
    get: function() {
        return this._velocity;
    },
    set: function(value) {
        value instanceof THREE.Vector3 ? (this._velocity = value, this._updateFlags.velocity = !0) : console.warn("Invalid velocity specified. Must be instance of THREE.Vector3.");
    }
}), Object.defineProperty(SPE.Emitter.prototype, "velocitySpread", {
    get: function() {
        return this._velocitySpread;
    },
    set: function(value) {
        value instanceof THREE.Vector3 ? (this._velocitySpread = value, this._updateFlags.velocity = !0) : console.warn("Invalid velocitySpread specified. Must be instance of THREE.Vector3.");
    }
}), Object.defineProperty(SPE.Emitter.prototype, "speed", {
    get: function() {
        return this._speed;
    },
    set: function(value) {
        "number" == typeof value ? (this._speed = value, this._updateFlags.velocity = !0) : console.warn("Invalid speed specified: " + value + ". Must be a number. speed remains at: " + this._speed);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "speedSpread", {
    get: function() {
        return this._speedSpread;
    },
    set: function(value) {
        "number" == typeof value ? (this._speedSpread = value, this._updateFlags.velocity = !0) : console.warn("Invalid speedSpread specified: " + value + ". Must be a number. speedSpread remains at: " + this._speedSpread);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "sizeStart", {
    get: function() {
        return this._sizeStart;
    },
    set: function(value) {
        "number" == typeof value ? (this._sizeStart = value, this._updateFlags.sizeStart = !0, 
        this._updateCounts.sizeStart = 0) : console.warn("Invalid sizeStart specified: " + value + ". Must be a number. sizeStart remains at: " + this._sizeStart);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "sizeStartSpread", {
    get: function() {
        return this._sizeStartSpread;
    },
    set: function(value) {
        "number" == typeof value ? (this._sizeStartSpread = value, this._updateFlags.sizeStart = !0, 
        this._updateCounts.sizeStart = 0) : console.warn("Invalid sizeStartSpread specified: " + value + ". Must be a number. sizeStartSpread remains at: " + this._sizeStartSpread);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "sizeMiddle", {
    get: function() {
        return this._sizeMiddle;
    },
    set: function(value) {
        "number" == typeof value ? this._sizeMiddle = value : this._sizeMiddle = Math.abs(this._sizeEnd + this._sizeStart), 
        this._updateFlags.sizeMiddle = !0, this._updateCounts.sizeMiddle = 0;
    }
}), Object.defineProperty(SPE.Emitter.prototype, "sizeMiddleSpread", {
    get: function() {
        return this._sizeMiddleSpread;
    },
    set: function(value) {
        "number" == typeof value ? (this._sizeMiddleSpread = value, this._updateFlags.sizeMiddle = !0, 
        this._updateCounts.sizeMiddle = 0) : console.warn("Invalid sizeMiddleSpread specified: " + value + ". Must be a number. sizeMiddleSpread remains at: " + this._sizeMiddleSpread);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "sizeEnd", {
    get: function() {
        return this._sizeEnd;
    },
    set: function(value) {
        "number" == typeof value ? (this._sizeEnd = value, this._updateFlags.sizeEnd = !0, 
        this._updateCounts.sizeEnd = 0) : console.warn("Invalid sizeEnd specified: " + value + ". Must be a number. sizeEnd remains at: " + this._sizeEnd);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "sizeEndSpread", {
    get: function() {
        return this._sizeEndSpread;
    },
    set: function(value) {
        "number" == typeof value ? (this._sizeEndSpread = value, this._updateFlags.sizeEnd = !0, 
        this._updateCounts.sizeEnd = 0) : console.warn("Invalid sizeEndSpread specified: " + value + ". Must be a number. sizeEndSpread remains at: " + this._sizeEndSpread);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "colorStart", {
    get: function() {
        return this._colorStart;
    },
    set: function(value) {
        value instanceof THREE.Color ? (this._colorStart = value, this._updateFlags.colorStart = !0, 
        this._updateCounts.colorStart = 0) : console.warn("Invalid colorStart specified: " + value + ". Must be instance of THREE.Color. colorStart remains at: " + this._colorStart);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "colorStartSpread", {
    get: function() {
        return this._colorStartSpread;
    },
    set: function(value) {
        value instanceof THREE.Vector3 ? (this._colorStartSpread = value, this._updateFlags.colorStart = !0, 
        this._updateCounts.colorStart = 0) : console.warn("Invalid colorStartSpread specified: " + value + ". Must be instance of THREE.Vector3. colorStartSpread remains at: " + this._colorStartSpread);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "colorMiddle", {
    get: function() {
        return this._colorMiddle;
    },
    set: function(value) {
        value instanceof THREE.Color == !1 ? value = this._colorMiddle.addColors(this._colorStart, this._colorEnd).multiplyScalar(.5) : value instanceof THREE.Color && (this._colorMiddle = value), 
        this._updateFlags.colorMiddle = !0, this._updateCounts.colorMiddle = 0;
    }
}), Object.defineProperty(SPE.Emitter.prototype, "colorMiddleSpread", {
    get: function() {
        return this._colorMiddleSpread;
    },
    set: function(value) {
        value instanceof THREE.Vector3 ? (this._colorMiddleSpread = value, this._updateFlags.colorMiddle = !0, 
        this._updateCounts.colorMiddle = 0) : console.warn("Invalid colorMiddleSpread specified: " + value + ". Must be a number. colorMiddleSpread remains at: " + this._colorMiddleSpread);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "colorEnd", {
    get: function() {
        return this._colorEnd;
    },
    set: function(value) {
        value instanceof THREE.Color ? (this._colorEnd = value, this._updateFlags.colorEnd = !0, 
        this._updateCounts.colorEnd = 0) : console.warn("Invalid colorEnd specified: " + value + ". Must be instance of THREE.Color. colorEnd remains at: " + this._colorEnd);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "colorEndSpread", {
    get: function() {
        return this._colorEndSpread;
    },
    set: function(value) {
        value instanceof THREE.Vector3 ? (this._colorEndSpread = value, this._updateFlags.colorEnd = !0, 
        this._updateCounts.colorEnd = 0) : console.warn("Invalid colorEndSpread specified: " + value + ". Must be instance of THREE.Vector3. colorEndSpread remains at: " + this._colorEndSpread);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "opacityStart", {
    get: function() {
        return this._opacityStart;
    },
    set: function(value) {
        "number" == typeof value ? (this._opacityStart = value, this._updateFlags.opacityStart = !0, 
        this._updateCounts.opacityStart = 0) : console.warn("Invalid opacityStart specified: " + value + ". Must be a number. opacityStart remains at: " + this._opacityStart);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "opacityStartSpread", {
    get: function() {
        return this._opacityStartSpread;
    },
    set: function(value) {
        "number" == typeof value ? (this._opacityStartSpread = value, this._updateFlags.opacityStart = !0, 
        this._updateCounts.opacityStart = 0) : console.warn("Invalid opacityStartSpread specified: " + value + ". Must be a number. opacityStartSpread remains at: " + this._opacityStartSpread);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "opacityMiddle", {
    get: function() {
        return this._opacityMiddle;
    },
    set: function(value) {
        "number" == typeof value ? this._opacityMiddle = value : this._opacityMiddle = Math.abs(this._opacityEnd + this._opacityStart), 
        this._updateFlags.opacityMiddle = !0, this._updateCounts.opacityMiddle = 0;
    }
}), Object.defineProperty(SPE.Emitter.prototype, "opacityMiddleSpread", {
    get: function() {
        return this._opacityMiddleSpread;
    },
    set: function(value) {
        "number" == typeof value ? (this._opacityMiddleSpread = value, this._updateFlags.opacityMiddle = !0, 
        this._updateCounts.opacityMiddle = 0) : console.warn("Invalid opacityMiddleSpread specified: " + value + ". Must be a number. opacityMiddleSpread remains at: " + this._opacityMiddleSpread);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "opacityEnd", {
    get: function() {
        return this._opacityEnd;
    },
    set: function(value) {
        "number" == typeof value ? (this._opacityEnd = value, this._updateFlags.opacityEnd = !0, 
        this._updateCounts.opacityEnd = 0) : console.warn("Invalid opacityEnd specified: " + value + ". Must be a number. opacityEnd remains at: " + this._opacityEnd);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "opacityEndSpread", {
    get: function() {
        return this._opacityEndSpread;
    },
    set: function(value) {
        "number" == typeof value ? (this._opacityEndSpread = value, this._updateFlags.opacityEnd = !0, 
        this._updateCounts.opacityEnd = 0) : console.warn("Invalid opacityEndSpread specified: " + value + ". Must be a number. opacityEndSpread remains at: " + this._opacityEndSpread);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "angleStart", {
    get: function() {
        return this._angleStart;
    },
    set: function(value) {
        "number" == typeof value ? (this._angleStart = value, this._updateFlags.angleStart = !0, 
        this._updateCounts.angleStart = 0) : console.warn("Invalid angleStart specified: " + value + ". Must be a number. angleStart remains at: " + this._angleStart);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "angleStartSpread", {
    get: function() {
        return this._angleStartSpread;
    },
    set: function(value) {
        "number" == typeof value ? (this._angleStartSpread = value, this._updateFlags.angleStart = !0, 
        this._updateCounts.angleStart = 0) : console.warn("Invalid angleStartSpread specified: " + value + ". Must be a number. angleStartSpread remains at: " + this._angleStartSpread);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "angleMiddle", {
    get: function() {
        return this._angleMiddle;
    },
    set: function(value) {
        "number" == typeof value ? this._angleMiddle = value : this._angleMiddle = Math.abs(this._angleEnd + this._angleStart), 
        this._updateFlags.angleMiddle = !0, this._updateCounts.angleMiddle = 0;
    }
}), Object.defineProperty(SPE.Emitter.prototype, "angleMiddleSpread", {
    get: function() {
        return this._angleMiddleSpread;
    },
    set: function(value) {
        "number" == typeof value ? (this._angleMiddleSpread = value, this._updateFlags.angleMiddle = !0, 
        this._updateCounts.angleMiddle = 0) : console.warn("Invalid angleMiddleSpread specified: " + value + ". Must be a number. angleMiddleSpread remains at: " + this._angleMiddleSpread);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "angleEnd", {
    get: function() {
        return this._angleEnd;
    },
    set: function(value) {
        "number" == typeof value ? (this._angleEnd = value, this._updateFlags.angleEnd = !0, 
        this._updateCounts.angleEnd = 0) : console.warn("Invalid angleEnd specified: " + value + ". Must be a number. angleEnd remains at: " + this._angleEnd);
    }
}), Object.defineProperty(SPE.Emitter.prototype, "angleEndSpread", {
    get: function() {
        return this._angleEndSpread;
    },
    set: function(value) {
        "number" == typeof value ? (this._angleEndSpread = value, this._updateFlags.angleEndSpread = !0, 
        this._updateCounts.angleEndSpread = 0) : console.warn("Invalid angleEndSpread specified: " + value + ". Must be a number. angleEndSpread remains at: " + this._angleEndSpread);
    }
});

for (var i in SPE.utils) SPE.Emitter.prototype[i] = SPE.utils[i];

var THREEx = THREEx || {};

THREEx.DynamicTexture = function(width, height) {
    var canvas = document.createElement("canvas");
    canvas.width = width, canvas.height = height, this.canvas = canvas;
    var context = canvas.getContext("2d");
    this.context = context;
    var texture = new THREE.Texture(canvas);
    this.texture = texture;
}, THREEx.DynamicTexture.prototype.clear = function(fillStyle) {
    return void 0 !== fillStyle ? (this.context.fillStyle = fillStyle, this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)) : this.context.clearRect(0, 0, this.canvas.width, this.canvas.height), 
    this.texture.needsUpdate = !0, this;
}, THREEx.DynamicTexture.prototype.drawText = function(text, x, y, fillStyle, contextFont) {
    if (void 0 !== contextFont && (this.context.font = contextFont), void 0 === x || null === x) {
        var textSize = this.context.measureText(text);
        x = (this.canvas.width - textSize.width) / 2;
    }
    return this.context.fillStyle = fillStyle, this.context.fillText(text, x, y), this.texture.needsUpdate = !0, 
    this;
}, THREEx.DynamicTexture.prototype.drawTextCooked = function(options) {
    function computeMaxTextLength(text) {
        for (var maxText = "", maxWidth = (1 - 2 * params.margin) * canvas.width; maxText.length !== text.length; ) {
            var textSize = context.measureText(maxText);
            if (textSize.width > maxWidth) break;
            maxText += text.substr(maxText.length, 1);
        }
        return maxText;
    }
    var context = this.context, canvas = this.canvas;
    options = options || {};
    var text = options.text, params = {
        margin: void 0 !== options.margin ? options.margin : .1,
        lineHeight: void 0 !== options.lineHeight ? options.lineHeight : .1,
        align: void 0 !== options.align ? options.align : "left",
        fillStyle: void 0 !== options.fillStyle ? options.fillStyle : "black",
        font: void 0 !== options.font ? options.font : "bold 102.4px Arial"
    };
    console.assert("string" == typeof text), context.save(), context.fillStyle = params.fillStyle, 
    context.font = params.font;
    for (var y = (params.lineHeight + params.margin) * canvas.height; text.length > 0; ) {
        var maxText = computeMaxTextLength(text);
        text = text.substr(maxText.length);
        var textSize = context.measureText(maxText);
        if ("left" === params.align) var x = params.margin * canvas.width; else if ("right" === params.align) var x = (1 - params.margin) * canvas.width - textSize.width; else if ("center" === params.align) var x = (canvas.width - textSize.width) / 2; else console.assert(!1);
        this.context.fillText(maxText, x, y), y += params.lineHeight * canvas.height;
    }
    return context.restore(), this.texture.needsUpdate = !0, this;
}, THREEx.DynamicTexture.prototype.drawImage = function() {
    return this.context.drawImage.apply(this.context, arguments), this.texture.needsUpdate = !0, 
    this;
};

var Singleton, exports;

exports = void 0, ("undefined" == typeof exports || null === exports) && (exports = {}), 
Singleton = function() {
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
            if (void 0 === this.currentSceneIndex) throw "SceneManager.setScene not called";
            if (0 === this.scenes.length) throw "Requires at least one scene";
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
            return i = this.scenes.indexOf(scene), this.setSceneByIndex(i), this.currentScene();
        }, SceneManager.prototype.setSceneByIndex = function(i) {
            return !this.isEmpty() && this.isValidIndex(i) && (this.currentSceneIndex = i), 
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

var NetworkManager;

NetworkManager = function() {
    function NetworkManager() {}
    var instance;
    return instance = null, Singleton.NetworkManager = function() {
        function NetworkManager() {}
        return NetworkManager.prototype.socket = void 0, NetworkManager.prototype.connect = function(namespace) {
            return null == namespace && (namespace = "/"), this.socket = io.connect(namespace), 
            this.socket.on("error", function(err) {
                return console.error(err);
            }), this.socket.on("message", function(msg) {
                return console.log(msg);
            });
        }, NetworkManager.prototype.emit = function(event, params) {
            return params.timestamp = new Date().getTime(), this.socket.emit(event, params);
        }, NetworkManager;
    }(), NetworkManager.get = function() {
        return null != instance ? instance : instance = new Singleton.NetworkManager();
    }, NetworkManager;
}();

var StatsManager;

StatsManager = function() {
    function StatsManager() {}
    var instance;
    return instance = null, Singleton.StatsManager = function() {
        function StatsManager() {
            this.stats = new Stats(), this.stats.domElement.style.position = "absolute", this.stats.domElement.style.top = "0px", 
            this.rendererStats = new THREEx.RendererStats(), this.rendererStats.domElement.style.position = "absolute", 
            this.rendererStats.domElement.style.left = "0px", this.rendererStats.domElement.style.bottom = "0px";
        }
        return StatsManager.prototype.statsVisible = !1, StatsManager.prototype.toggle = function() {
            return this.statsVisible = !this.statsVisible, this.statsVisible ? (document.body.appendChild(this.stats.domElement), 
            document.body.appendChild(this.rendererStats.domElement)) : (document.body.removeChild(this.stats.domElement), 
            document.body.removeChild(this.rendererStats.domElement)), this.statsVisible;
        }, StatsManager.prototype.update = function(renderer) {
            return this.stats.update(), this.rendererStats.update(renderer);
        }, StatsManager;
    }(), StatsManager.get = function() {
        return null != instance ? instance : instance = new Singleton.StatsManager();
    }, StatsManager;
}();

var SoundManager;

SoundManager = function() {
    function SoundManager() {}
    var instance;
    return instance = null, Singleton.SoundManager = function() {
        function SoundManager() {}
        return SoundManager.prototype.sounds = {}, SoundManager.prototype.add = function(key, url) {
            var audio, source;
            return audio = document.createElement("audio"), source = document.createElement("source"), 
            source.src = url, audio.appendChild(source), audio.playbackRate = 1, this.sounds[key] = audio;
        }, SoundManager.prototype.play = function(key) {
            return key in this.sounds ? this.sounds[key].play() : console.log("Sound with key: " + key + " not found!");
        }, SoundManager.prototype.updateGlobalVolume = function(i) {
            var key;
            0 > i && (i = 0), i > 1 && (i = 1);
            for (key in this.sounds) this.sounds[key].volume = i;
            return i;
        }, SoundManager;
    }(), SoundManager.get = function() {
        return null != instance ? instance : instance = new Singleton.SoundManager();
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
    }, EngineUtils.setCursor = function(url) {
        return document.body.style.cursor = "url('" + url + "'), auto";
    }, EngineUtils;
}();

var JsonModelManager;

JsonModelManager = function() {
    function JsonModelManager() {}
    var instance;
    return instance = null, Singleton.JsonModelManager = function() {
        function JsonModelManager() {}
        return JsonModelManager.prototype.loader = new THREE.JSONLoader(), JsonModelManager.prototype.models = {}, 
        JsonModelManager.prototype.loadCount = 0, JsonModelManager.prototype.load = function(key, url, callback) {
            return this.loadCount += 1, this.loader.load(url, function(geometry, materials) {
                var anim, animation, i, j, len, mat, material, mesh, ref;
                for (mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials)), 
                material = mesh.material.materials, i = 0; i < materials.length; ) mat = materials[i], 
                mat.skinning = !0, i++;
                if (null != mesh.animations) throw "mesh already has animations. not overwriting default behaviour";
                if (mesh.animations = [], null != mesh.geometry.animations) for (ref = mesh.geometry.animations, 
                j = 0, len = ref.length; len > j; j++) anim = ref[j], animation = new THREE.Animation(mesh, anim, THREE.AnimationHandler.CATMULLROM), 
                mesh.animations.push(animation);
                return window.JsonModelManager.get().models[key] = mesh, callback(mesh);
            });
        }, JsonModelManager.prototype.hasFinishedLoading = function() {
            return this.loadCount === Object.keys(this.models).size();
        }, JsonModelManager;
    }(), JsonModelManager.get = function() {
        return null != instance ? instance : instance = new Singleton.JsonModelManager();
    }, JsonModelManager;
}(), exports.JsonModelManager = JsonModelManager;

var ResourceManager;

ResourceManager = function() {
    function ResourceManager() {}
    var instance;
    return instance = null, Singleton.ResourceManager = function() {
        function ResourceManager() {}
        return ResourceManager.prototype.loadedTexturesCount = 0, ResourceManager.prototype.textures = {}, 
        ResourceManager.prototype.addTexture = function(key, url) {
            var texture;
            return texture = THREE.ImageUtils.loadTexture(url, {}, this._inc), this.textures[key] = texture, 
            this;
        }, ResourceManager.prototype.texture = function(key) {
            return this.textures[key];
        }, ResourceManager.prototype.hasFinishedLoading = function() {
            return this.loadedTexturesCount === Object.keys(textures).length;
        }, ResourceManager.prototype._inc = function() {
            return ResourceManager.get().loadedTexturesCount += 1;
        }, ResourceManager;
    }(), ResourceManager.get = function() {
        return null != instance ? instance : instance = new Singleton.ResourceManager();
    }, ResourceManager;
}();

var BaseScene;

BaseScene = function() {
    function BaseScene() {}
    return BaseScene.prototype.scene = new THREE.Scene(), BaseScene.prototype.lastMousePosition = void 0, 
    BaseScene.prototype.keyboard = new THREEx.KeyboardState(), BaseScene.prototype.loaded = !1, 
    BaseScene.prototype.uptime = 0, BaseScene.prototype.fullTick = function(tpf) {
        return this.uptime += tpf, this.tick(tpf);
    }, BaseScene.prototype.tick = function(tpf) {
        throw "scene.tick not implemented";
    }, BaseScene.prototype.doMouseEvent = function(event, raycaster) {
        throw "scene.doMouseEvent not implemented";
    }, BaseScene.prototype.doKeyboardEvent = function(event) {
        throw "scene.doKeyboardEvent not implemented";
    }, BaseScene.prototype.tweenLookAt = function(object, camera, duration, easing) {
        var endRotation, startRotation, tween;
        return null == duration && (duration = 1e3), null == easing && (easing = TWEEN.Easing.Cubic.InOut), 
        startRotation = camera.rotation.clone(), camera.lookAt(object.position), endRotation = camera.rotation.clone(), 
        camera.rotation.set(startRotation.x, startRotation.y, startRotation.z), tween = new TWEEN.Tween(startRotation).to(endRotation, duration).onUpdate(function() {
            camera.rotation.set(this.x, this.y, this.z);
        }).easing(easing).start();
    }, BaseScene.prototype.tweenMoveTo = function(object, camera, duration, easing) {
        var endPosition, startPosition, tween;
        return null == duration && (duration = 1e3), null == easing && (easing = TWEEN.Easing.Cubic.InOut), 
        startPosition = camera.position.clone(), endPosition = object.position.clone(), 
        tween = new TWEEN.Tween(camera.position).to(endPosition, duration).onUpdate(function() {
            camera.position.set(this.x, this.y, this.z);
        }).easing(easing).start();
    }, BaseScene;
}();

var BaseModel;

BaseModel = function() {
    function BaseModel() {}
    return BaseModel.prototype.visible = !0, BaseModel.prototype.mesh = void 0, BaseModel.prototype.setScale = function(i) {
        return this.mesh.scale.set(i, i, i);
    }, BaseModel.prototype.setVisible = function(value) {
        return this.mesh.traverse(function(object) {
            return object.visible = value;
        }), this.visible = value;
    }, BaseModel.prototype.toggleWireframe = function() {
        return null != this.mesh || null != this.mesh.material ? this.mesh.material.wireframe = !this.mesh.material.wireframe : void 0;
    }, BaseModel.prototype.isHovered = function(raycaster) {
        return raycaster.intersectObject(this.mesh).length > 0;
    }, BaseModel;
}();

var BaseParticle, extend = function(child, parent) {
    function ctor() {
        this.constructor = child;
    }
    for (var key in parent) hasProp.call(parent, key) && (child[key] = parent[key]);
    return ctor.prototype = parent.prototype, child.prototype = new ctor(), child.__super__ = parent.prototype, 
    child;
}, hasProp = {}.hasOwnProperty;

BaseParticle = function(superClass) {
    function BaseParticle(texturePath) {
        this.particleGroup = new SPE.Group({
            texture: THREE.ImageUtils.loadTexture(texturePath),
            maxAge: .2,
            hasPerspective: !0,
            colorize: !0
        }), this.emitter = new SPE.Emitter({
            position: new THREE.Vector3(0, 0, 0),
            positionSpread: new THREE.Vector3(0, 0, 0),
            acceleration: new THREE.Vector3(0, -10, 0),
            accelerationSpread: new THREE.Vector3(10, 0, 10),
            velocity: new THREE.Vector3(0, 25, 0),
            velocitySpread: new THREE.Vector3(10, 7.5, 10),
            colorStart: new THREE.Color("white"),
            colorEnd: new THREE.Color("red"),
            sizeStart: 1,
            sizeEnd: 1,
            particleCount: 2e3
        }), this.particleGroup.addEmitter(this.emitter), this.mesh = this.particleGroup.mesh;
    }
    return extend(BaseParticle, superClass), BaseParticle.prototype.tick = function(tpf) {
        return this.particleGroup.tick(tpf);
    }, BaseParticle;
}(BaseModel);

var Config;

Config = function() {
    function Config() {}
    var instance;
    return instance = null, Singleton.Config = function() {
        function Config() {}
        return Config.prototype.showStatsOnLoad = !1, Config.prototype.contextMenuDisabled = !0, 
        Config.prototype.antialias = !0, Config.prototype.anaglyph = !1, Config.prototype.resize = !1, 
        Config.prototype.width = 1280, Config.prototype.height = 1024, Config.prototype.soundEnabled = !1, 
        Config.prototype.debug = !1, Config.prototype.preventDefaultMouseEvents = !0, Config.prototype.animate = !0, 
        Config.prototype.transparentBackground = !1, Config.prototype.fillWindow = function() {
            return this.resize = !0, this.width = window.innerWidth, this.height = window.innerHeight;
        }, Config.prototype.toggleAnaglyph = function() {
            return this.anaglyph = !this.anaglyph;
        }, Config.prototype.toggleStats = function() {
            return StatsManager.get().toggle();
        }, Config.prototype.toggleSound = function() {
            return this.soundEnabled = !this.soundEnabled;
        }, Config.prototype.toggleDebug = function() {
            return this.debug = !this.debug;
        }, Config.prototype.toggleFullScreen = function() {
            return EngineUtils.toggleFullScreen();
        }, Config;
    }(), Config.get = function() {
        return null != instance ? instance : instance = new Singleton.Config();
    }, Config;
}(), exports.Config = Config;

var Helper;

Helper = function() {
    function Helper() {}
    return Helper.zero = new THREE.Vector3(0, 0, 0), Helper.one = new THREE.Vector3(1, 1, 1), 
    Helper.camera = function(options) {
        var config;
        return null == options && (options = {}), config = Config.get(), null == options.view_angle && (options.view_angle = 45), 
        null == options.aspect && (options.aspect = config.width / config.height), null == options.near && (options.near = 1), 
        null == options.far && (options.far = 1e4), options.type || (options.type = "PerspectiveCamera"), 
        new THREE[options.type](options.view_angle, options.aspect, options.near, options.far);
    }, Helper.light = function() {
        var light;
        return light = new THREE.DirectionalLight(16777215), light.position.set(0, 100, 60), 
        light.castShadow = !0, light.shadowCameraLeft = -60, light.shadowCameraTop = -60, 
        light.shadowCameraRight = 60, light.shadowCameraBottom = 60, light.shadowCameraNear = 1, 
        light.shadowCameraFar = 1e3, light.shadowBias = -1e-4, light.shadowMapWidth = light.shadowMapHeight = 1024, 
        light.shadowDarkness = .7, light;
    }, Helper.ambientLight = function() {
        return new THREE.AmbientLight(4210752);
    }, Helper.cube = function(size) {
        var box, mat;
        return box = new THREE.BoxGeometry(size, size, size), mat = new THREE.MeshLambertMaterial({
            color: 16711680
        }), new THREE.Mesh(box, mat);
    }, Helper.fancyShadows = function(renderer) {
        return renderer.shadowMapEnabled = !0, renderer.shadowMapSoft = !0, renderer.shadowMapType = THREE.PCFShadowMap, 
        renderer.shadowMapAutoUpdate = !0;
    }, Helper.skySphere = function(imgUrl, radius, segments) {
        var geom, mat;
        return null == radius && (radius = 45e4), null == segments && (segments = 64), geom = new THREE.SphereGeometry(radius, segments, segments), 
        mat = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(imgUrl),
            side: THREE.BackSide
        }), new THREE.Mesh(geom, mat);
    }, Helper.skyBox = function(imgUrls, size) {
        var aCubeMap, aShader, aSkyBoxMaterial;
        return null == size && (size = 9e5), aCubeMap = THREE.ImageUtils.loadTextureCube(imgUrls), 
        aCubeMap.format = THREE.RGBFormat, aShader = THREE.ShaderLib.cube, aShader.uniforms.tCube.value = aCubeMap, 
        aSkyBoxMaterial = new THREE.ShaderMaterial({
            fragmentShader: aShader.fragmentShader,
            vertexShader: aShader.vertexShader,
            uniforms: aShader.uniforms,
            depthWrite: !1,
            side: THREE.BackSide
        }), new THREE.Mesh(new THREE.BoxGeometry(size, size, size), aSkyBoxMaterial);
    }, Helper;
}();

var Water, extend = function(child, parent) {
    function ctor() {
        this.constructor = child;
    }
    for (var key in parent) hasProp.call(parent, key) && (child[key] = parent[key]);
    return ctor.prototype = parent.prototype, child.prototype = new ctor(), child.__super__ = parent.prototype, 
    child;
}, hasProp = {}.hasOwnProperty;

Water = function(superClass) {
    function Water(waterNormalsUrl, engine, scene, size, segments) {
        var waterNormals;
        waterNormals = new THREE.ImageUtils.loadTexture("/bower_components/ocean/assets/img/waternormals.jpg"), 
        waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping, this.water = new THREE.Water(engine.renderer, engine.camera, scene, {
            textureWidth: 256,
            textureHeight: 256,
            waterNormals: waterNormals,
            alpha: 1,
            sunColor: 16777215,
            waterColor: 7695,
            betaVersion: 0,
            side: THREE.DoubleSide
        }), this.mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(size, size, segments, segments), this.water.material), 
        this.mesh.add(this.water), this.mesh.rotation.x = .5 * -Math.PI, this.speed = 1;
    }
    return extend(Water, superClass), Water.prototype.tick = function(tpf) {
        return this.water.material.uniforms.time.value += tpf * this.speed, this.water.render();
    }, Water;
}(BaseModel);

var Terrain, extend = function(child, parent) {
    function ctor() {
        this.constructor = child;
    }
    for (var key in parent) hasProp.call(parent, key) && (child[key] = parent[key]);
    return ctor.prototype = parent.prototype, child.prototype = new ctor(), child.__super__ = parent.prototype, 
    child;
}, hasProp = {}.hasOwnProperty;

Terrain = function(superClass) {
    function Terrain(textureUrl, width, height, wSegments, hSegments) {
        var geom, mat;
        mat = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture(textureUrl)
        }), geom = new THREE.PlaneGeometry(width, height, wSegments, hSegments), this.mesh = new THREE.Mesh(geom, mat), 
        this.mesh.rotation.x -= Math.PI / 2;
    }
    return extend(Terrain, superClass), Terrain.prototype.applyHeightmap = function(imageData) {
        var i, k, len, ref, results, vertice;
        for (i = 0, ref = this.mesh.geometry.vertices, results = [], k = 0, len = ref.length; len > k; k++) vertice = ref[k], 
        vertice.z = imageData[i], results.push(i++);
        return results;
    }, Terrain.heightmap = function(textureUrl, heightmapUrl, width, height, wSegments, hSegments, scale, scene) {
        var hm;
        return null == scale && (scale = 1), hm = THREE.ImageUtils.loadTexture(heightmapUrl, THREE.UVMapping, function(_this) {
            return function() {
                var terrain;
                return hm.heightData = Terrain.getHeightData(hm.image, scale), terrain = new Terrain(textureUrl, width, height, wSegments, hSegments), 
                terrain.applyHeightmap(hm.heightData), null == scene && (scene = SceneManager.get().currentScene()), 
                scene.terrain = terrain, scene.scene.add(terrain.mesh);
            };
        }(this));
    }, Terrain.heightmap_blocking = function(options) {
        var hm, scene, terrain;
        return hm = THREE.ImageUtils.loadTexture(options.heightmapUrl), hm.heightData = Terrain.getHeightData(hm.image, options.scale), 
        terrain = new Terrain(options.textureUrl, options.width, options.height, options.wSegments, options.hSegments), 
        terrain.applyHeightmap(hm.heightData), ("undefined" == typeof scene || null === scene) && (scene = SceneManager.get().currentScene()), 
        scene.terrain = terrain, scene.scene.add(terrain.mesh);
    }, Terrain.getHeightData = function(img, scale) {
        var all, canvas, context, data, i, imgd, j, pix, size;
        for (null == scale && (scale = 1), canvas = document.createElement("canvas"), canvas.width = img.width, 
        canvas.height = img.height, context = canvas.getContext("2d"), size = img.width * img.height, 
        data = new Float32Array(size), context.drawImage(img, 0, 0), i = 0; size > i; ) data[i] = 0, 
        i++;
        for (imgd = context.getImageData(0, 0, img.width, img.height), pix = imgd.data, 
        j = 0, i = 0; i < pix.length; ) all = pix[i] + pix[i + 1] + pix[i + 2], data[j++] = all / (12 * scale), 
        i += 4;
        return data;
    }, Terrain;
}(BaseModel);

var SpotLight, extend = function(child, parent) {
    function ctor() {
        this.constructor = child;
    }
    for (var key in parent) hasProp.call(parent, key) && (child[key] = parent[key]);
    return ctor.prototype = parent.prototype, child.prototype = new ctor(), child.__super__ = parent.prototype, 
    child;
}, hasProp = {}.hasOwnProperty;

SpotLight = function(superClass) {
    function SpotLight(x, y, z) {
        var geometry;
        geometry = new THREE.CylinderGeometry(.1, 2.5, 5, 64, 40, !0), geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -geometry.parameters.height / 2, 0)), 
        geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2)), this.material = new THREEx.VolumetricSpotLightMaterial(), 
        this.mesh = new THREE.Mesh(geometry, this.material), this.mesh.position.set(x, y, z), 
        this.mesh.lookAt(new THREE.Vector3(0, 0, 0)), this.setColor("white"), this.material.uniforms.spotPosition.value = this.mesh.position, 
        this.spotLight = new THREE.SpotLight(), this.spotLight.position.copy(this.mesh.position), 
        this.spotLight.color = this.mesh.material.uniforms.lightColor.value, this.spotLight.exponent = 30, 
        this.spotLight.angle = Math.PI / 3, this.spotLight.intensity = 3, this.spotLight.castShadow = !0, 
        this.spotLight.shadowCameraNear = .01, this.spotLight.shadowCameraFar = 100, this.spotLight.shadowCameraFov = 45, 
        this.spotLight.shadowCameraLeft = -8, this.spotLight.shadowCameraRight = 8, this.spotLight.shadowCameraTop = 8, 
        this.spotLight.shadowCameraBottom = -8, this.spotLight.shadowBias = 0, this.spotLight.shadowDarkness = .5, 
        this.spotLight.shadowMapWidth = 1024, this.spotLight.shadowMapHeight = 1024, this.direction = new THREE.Vector3(0, 0, 0), 
        this.lastDir = 0;
    }
    return extend(SpotLight, superClass), SpotLight.prototype.lookAt = function(node) {
        var target;
        return target = node.position, this.mesh.lookAt(target), this.spotLight.target.position.copy(target);
    }, SpotLight.prototype.addToScene = function(scene) {
        return scene.add(this.mesh), scene.add(this.spotLight), scene.add(this.spotLight.target);
    }, SpotLight.prototype.setColor = function(color) {
        return this.material.uniforms.lightColor.value.set(color);
    }, SpotLight;
}(BaseModel);

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
        this.width = this.config.width, this.height = this.config.height, this.renderer = new THREE.WebGLRenderer({
            antialias: this.config.antialias,
            alpha: this.config.transparentBackground
        }), this.renderer.setSize(this.width, this.height), document.body.appendChild(this.renderer.domElement), 
        camera = new THREE.PerspectiveCamera(45, this.width / this.height, .5, 1e6), this.setCamera(camera), 
        this.camera.position.z = 10, this.anaglyphEffect = new THREE.AnaglyphEffect(this.renderer), 
        this.anaglyphEffect.setSize(this.width, this.height), this.sceneManager = SceneManager.get(), 
        document.addEventListener("mouseup", this.onDocumentMouseEvent, !1), document.addEventListener("mousedown", this.onDocumentMouseEvent, !1), 
        document.addEventListener("mousemove", this.onDocumentMouseEvent, !1), document.addEventListener("keydown", this.onDocumentKeyboardEvent, !1), 
        document.addEventListener("keyup", this.onDocumentKeyboardEvent, !1), this.config.contextMenuDisabled && document.addEventListener("contextmenu", function(e) {
            return e.preventDefault();
        }, !1), this.statsManager = StatsManager.get(), this.config.showStatsOnLoad && this.statsManager.toggle();
    }
    return Engine3D.prototype.time = void 0, Engine3D.prototype.uptime = 0, Engine3D.prototype.config = Config.get(), 
    Engine3D.prototype.onDocumentMouseEvent = function(event) {
        var raycaster;
        return raycaster = this._parseMouseEvent(event), null != raycaster ? this.sceneManager.currentScene().doMouseEvent(event, raycaster) : void 0;
    }, Engine3D.prototype.onDocumentKeyboardEvent = function(event) {
        return this.sceneManager.currentScene().doKeyboardEvent(event);
    }, Engine3D.prototype.setCamera = function(camera) {
        return this.camera = camera, this.config.resize ? this.winResize = new THREEx.WindowResize(this.renderer, this.camera) : void 0;
    }, Engine3D.prototype.setClearColor = function(color, alpha) {
        return this.renderer.setClearColor(color, alpha);
    }, Engine3D.prototype.addScene = function(scene) {
        return this.sceneManager.addScene(scene), null == this.sceneManager.currentSceneIndex ? this.sceneManager.setScene(scene) : void 0;
    }, Engine3D.prototype.removeScene = function(scene) {
        return this.sceneManager.removeScene(scene);
    }, Engine3D.prototype.render = function() {
        var now, tpf;
        return requestAnimationFrame(this.render), this.width = window.innerWidth, this.height = window.innerHeight, 
        now = new Date().getTime(), tpf = (now - (this.time || now)) / 1e3, this.time = now, 
        this.uptime += tpf, this.sceneManager.tick(tpf), this.config.animate && THREE.AnimationHandler.update(tpf), 
        this.statsManager.update(this.renderer), TWEEN.update(), this.renderer.render(this.sceneManager.currentScene().scene, this.camera), 
        this.config.anaglyph ? this.anaglyphEffect.render(this.sceneManager.currentScene().scene, this.camera) : void 0;
    }, Engine3D.prototype._parseMouseEvent = function(event) {
        var mouseX, mouseY, vector;
        return this.config.preventDefaultMouseEvents && event.preventDefault(), event.target === this.renderer.domElement ? (mouseX = event.layerX / this.width * 2 - 1, 
        mouseY = 2 * -(event.layerY / this.height) + 1, vector = new THREE.Vector3(mouseX, mouseY, .5), 
        vector.unproject(this.camera), new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize())) : void 0;
    }, Engine3D;
}(), Array.prototype.isEmpty = function() {
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
}, String.prototype.isEmpty = function() {
    return 0 === this.size();
}, String.prototype.contains = function(s) {
    return -1 !== this.indexOf(s);
}, String.prototype.isPresent = function() {
    return "undefined" != typeof this && null !== this && !this.isEmpty();
}, String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};