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
            -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin(2 * (k - s) * Math.PI / p)));
        },
        Out: function(k) {
            var s, a = .1, p = .4;
            return 0 === k ? 0 : 1 === k ? 1 : (!a || 1 > a ? (a = 1, s = p / 4) : s = p * Math.asin(1 / a) / (2 * Math.PI), 
            a * Math.pow(2, -10 * k) * Math.sin(2 * (k - s) * Math.PI / p) + 1);
        },
        InOut: function(k) {
            var s, a = .1, p = .4;
            return 0 === k ? 0 : 1 === k ? 1 : (!a || 1 > a ? (a = 1, s = p / 4) : s = p * Math.asin(1 / a) / (2 * Math.PI), 
            (k *= 2) < 1 ? -.5 * a * Math.pow(2, 10 * (k -= 1)) * Math.sin(2 * (k - s) * Math.PI / p) : a * Math.pow(2, -10 * (k -= 1)) * Math.sin(2 * (k - s) * Math.PI / p) * .5 + 1);
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
            return (k *= 2) < 1 ? .5 * k * k * ((s + 1) * k - s) : .5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
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
    REVISION: "68"
};

"object" == typeof module && (module.exports = THREE), THREE.CullFaceNone = 0, THREE.CullFaceBack = 1, 
THREE.CullFaceFront = 2, THREE.CullFaceFrontBack = 3, THREE.FrontFaceDirectionCW = 0, 
THREE.FrontFaceDirectionCCW = 1, THREE.BasicShadowMap = 0, THREE.PCFShadowMap = 1, 
THREE.PCFSoftShadowMap = 2, THREE.FrontSide = 0, THREE.BackSide = 1, THREE.DoubleSide = 2, 
THREE.NoShading = 0, THREE.FlatShading = 1, THREE.SmoothShading = 2, THREE.NoColors = 0, 
THREE.FaceColors = 1, THREE.VertexColors = 2, THREE.NoBlending = 0, THREE.NormalBlending = 1, 
THREE.AdditiveBlending = 2, THREE.SubtractiveBlending = 3, THREE.MultiplyBlending = 4, 
THREE.CustomBlending = 5, THREE.AddEquation = 100, THREE.SubtractEquation = 101, 
THREE.ReverseSubtractEquation = 102, THREE.ZeroFactor = 200, THREE.OneFactor = 201, 
THREE.SrcColorFactor = 202, THREE.OneMinusSrcColorFactor = 203, THREE.SrcAlphaFactor = 204, 
THREE.OneMinusSrcAlphaFactor = 205, THREE.DstAlphaFactor = 206, THREE.OneMinusDstAlphaFactor = 207, 
THREE.DstColorFactor = 208, THREE.OneMinusDstColorFactor = 209, THREE.SrcAlphaSaturateFactor = 210, 
THREE.MultiplyOperation = 0, THREE.MixOperation = 1, THREE.AddOperation = 2, THREE.UVMapping = function() {}, 
THREE.CubeReflectionMapping = function() {}, THREE.CubeRefractionMapping = function() {}, 
THREE.SphericalReflectionMapping = function() {}, THREE.SphericalRefractionMapping = function() {}, 
THREE.RepeatWrapping = 1e3, THREE.ClampToEdgeWrapping = 1001, THREE.MirroredRepeatWrapping = 1002, 
THREE.NearestFilter = 1003, THREE.NearestMipMapNearestFilter = 1004, THREE.NearestMipMapLinearFilter = 1005, 
THREE.LinearFilter = 1006, THREE.LinearMipMapNearestFilter = 1007, THREE.LinearMipMapLinearFilter = 1008, 
THREE.UnsignedByteType = 1009, THREE.ByteType = 1010, THREE.ShortType = 1011, THREE.UnsignedShortType = 1012, 
THREE.IntType = 1013, THREE.UnsignedIntType = 1014, THREE.FloatType = 1015, THREE.UnsignedShort4444Type = 1016, 
THREE.UnsignedShort5551Type = 1017, THREE.UnsignedShort565Type = 1018, THREE.AlphaFormat = 1019, 
THREE.RGBFormat = 1020, THREE.RGBAFormat = 1021, THREE.LuminanceFormat = 1022, THREE.LuminanceAlphaFormat = 1023, 
THREE.RGB_S3TC_DXT1_Format = 2001, THREE.RGBA_S3TC_DXT1_Format = 2002, THREE.RGBA_S3TC_DXT3_Format = 2003, 
THREE.RGBA_S3TC_DXT5_Format = 2004, THREE.Color = function(color) {
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
    copyGammaToLinear: function(color) {
        return this.r = color.r * color.r, this.g = color.g * color.g, this.b = color.b * color.b, 
        this;
    },
    copyLinearToGamma: function(color) {
        return this.r = Math.sqrt(color.r), this.g = Math.sqrt(color.g), this.b = Math.sqrt(color.b), 
        this;
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
    toArray: function() {
        return [ this.r, this.g, this.b ];
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
    fromArray: function(array) {
        return this._x = array[0], this._y = array[1], this._z = array[2], this._w = array[3], 
        this.onChangeCallback(), this;
    },
    toArray: function() {
        return [ this._x, this._y, this._z, this._w ];
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
        return void 0 !== w ? (console.warn("THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead."), 
        this.addVectors(v, w)) : (this.x += v.x, this.y += v.y, this);
    },
    addVectors: function(a, b) {
        return this.x = a.x + b.x, this.y = a.y + b.y, this;
    },
    addScalar: function(s) {
        return this.x += s, this.y += s, this;
    },
    sub: function(v, w) {
        return void 0 !== w ? (console.warn("THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."), 
        this.subVectors(v, w)) : (this.x -= v.x, this.y -= v.y, this);
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
    equals: function(v) {
        return v.x === this.x && v.y === this.y;
    },
    fromArray: function(array) {
        return this.x = array[0], this.y = array[1], this;
    },
    toArray: function() {
        return [ this.x, this.y ];
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
        return void 0 !== w ? (console.warn("THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead."), 
        this.addVectors(v, w)) : (this.x += v.x, this.y += v.y, this.z += v.z, this);
    },
    addScalar: function(s) {
        return this.x += s, this.y += s, this.z += s, this;
    },
    addVectors: function(a, b) {
        return this.x = a.x + b.x, this.y = a.y + b.y, this.z = a.z + b.z, this;
    },
    sub: function(v, w) {
        return void 0 !== w ? (console.warn("THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."), 
        this.subVectors(v, w)) : (this.x -= v.x, this.y -= v.y, this.z -= v.z, this);
    },
    subVectors: function(a, b) {
        return this.x = a.x - b.x, this.y = a.y - b.y, this.z = a.z - b.z, this;
    },
    multiply: function(v, w) {
        return void 0 !== w ? (console.warn("THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead."), 
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
    setEulerFromRotationMatrix: function() {
        console.error("THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.");
    },
    setEulerFromQuaternion: function() {
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
    fromArray: function(array) {
        return this.x = array[0], this.y = array[1], this.z = array[2], this;
    },
    toArray: function() {
        return [ this.x, this.y, this.z ];
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
    sub: function(v, w) {
        return void 0 !== w ? (console.warn("THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."), 
        this.subVectors(v, w)) : (this.x -= v.x, this.y -= v.y, this.z -= v.z, this.w -= v.w, 
        this);
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
    equals: function(v) {
        return v.x === this.x && v.y === this.y && v.z === this.z && v.w === this.w;
    },
    fromArray: function(array) {
        return this.x = array[0], this.y = array[1], this.z = array[2], this.w = array[3], 
        this;
    },
    toArray: function() {
        return [ this.x, this.y, this.z, this.w ];
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
    setFromRotationMatrix: function(m, order) {
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
        this._order = order, this.onChangeCallback(), this;
    },
    setFromQuaternion: function(q, order, update) {
        var clamp = THREE.Math.clamp, sqx = q.x * q.x, sqy = q.y * q.y, sqz = q.z * q.z, sqw = q.w * q.w;
        return order = order || this._order, "XYZ" === order ? (this._x = Math.atan2(2 * (q.x * q.w - q.y * q.z), sqw - sqx - sqy + sqz), 
        this._y = Math.asin(clamp(2 * (q.x * q.z + q.y * q.w), -1, 1)), this._z = Math.atan2(2 * (q.z * q.w - q.x * q.y), sqw + sqx - sqy - sqz)) : "YXZ" === order ? (this._x = Math.asin(clamp(2 * (q.x * q.w - q.y * q.z), -1, 1)), 
        this._y = Math.atan2(2 * (q.x * q.z + q.y * q.w), sqw - sqx - sqy + sqz), this._z = Math.atan2(2 * (q.x * q.y + q.z * q.w), sqw - sqx + sqy - sqz)) : "ZXY" === order ? (this._x = Math.asin(clamp(2 * (q.x * q.w + q.y * q.z), -1, 1)), 
        this._y = Math.atan2(2 * (q.y * q.w - q.z * q.x), sqw - sqx - sqy + sqz), this._z = Math.atan2(2 * (q.z * q.w - q.x * q.y), sqw - sqx + sqy - sqz)) : "ZYX" === order ? (this._x = Math.atan2(2 * (q.x * q.w + q.z * q.y), sqw - sqx - sqy + sqz), 
        this._y = Math.asin(clamp(2 * (q.y * q.w - q.x * q.z), -1, 1)), this._z = Math.atan2(2 * (q.x * q.y + q.z * q.w), sqw + sqx - sqy - sqz)) : "YZX" === order ? (this._x = Math.atan2(2 * (q.x * q.w - q.z * q.y), sqw - sqx + sqy - sqz), 
        this._y = Math.atan2(2 * (q.y * q.w - q.x * q.z), sqw + sqx - sqy - sqz), this._z = Math.asin(clamp(2 * (q.x * q.y + q.z * q.w), -1, 1))) : "XZY" === order ? (this._x = Math.atan2(2 * (q.x * q.w + q.y * q.z), sqw - sqx + sqy - sqz), 
        this._y = Math.atan2(2 * (q.x * q.z + q.y * q.w), sqw + sqx - sqy - sqz), this._z = Math.asin(clamp(2 * (q.z * q.w - q.x * q.y), -1, 1))) : console.warn("THREE.Euler: .setFromQuaternion() given unsupported order: " + order), 
        this._order = order, update !== !1 && this.onChangeCallback(), this;
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
    toArray: function() {
        return [ this._x, this._y, this._z, this._order ];
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
                if (void 0 !== node.geometry && void 0 !== node.geometry.vertices) for (var vertices = node.geometry.vertices, i = 0, il = vertices.length; il > i; i++) v1.copy(vertices[i]), 
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
}, THREE.Matrix3 = function(n11, n12, n13, n21, n22, n23, n31, n32, n33) {
    this.elements = new Float32Array(9);
    var te = this.elements;
    te[0] = void 0 !== n11 ? n11 : 1, te[3] = n12 || 0, te[6] = n13 || 0, te[1] = n21 || 0, 
    te[4] = void 0 !== n22 ? n22 : 1, te[7] = n23 || 0, te[2] = n31 || 0, te[5] = n32 || 0, 
    te[8] = void 0 !== n33 ? n33 : 1;
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
        return console.warn("THREE.Matrix3: .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead."), 
        vector.applyMatrix3(this);
    },
    multiplyVector3Array: function(a) {
        return console.warn("THREE.Matrix3: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead."), 
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
    },
    clone: function() {
        var te = this.elements;
        return new THREE.Matrix3(te[0], te[3], te[6], te[1], te[4], te[7], te[2], te[5], te[8]);
    }
}, THREE.Matrix4 = function(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
    this.elements = new Float32Array(16);
    var te = this.elements;
    te[0] = void 0 !== n11 ? n11 : 1, te[4] = n12 || 0, te[8] = n13 || 0, te[12] = n14 || 0, 
    te[1] = n21 || 0, te[5] = void 0 !== n22 ? n22 : 1, te[9] = n23 || 0, te[13] = n24 || 0, 
    te[2] = n31 || 0, te[6] = n32 || 0, te[10] = void 0 !== n33 ? n33 : 1, te[14] = n34 || 0, 
    te[3] = n41 || 0, te[7] = n42 || 0, te[11] = n43 || 0, te[15] = void 0 !== n44 ? n44 : 1;
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
        return console.warn("THREEMatrix4: .extractPosition() has been renamed to .copyPosition()."), 
        this.copyPosition(m);
    },
    copyPosition: function(m) {
        var te = this.elements, me = m.elements;
        return te[12] = me[12], te[13] = me[13], te[14] = me[14], this;
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
        var v1 = new THREE.Vector3();
        return function() {
            console.warn("THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead.");
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
            var msg = "Matrix4.getInverse(): can't invert matrix, determinant is 0";
            if (throwOnInvertible) throw new Error(msg);
            return console.warn(msg), this.identity(), this;
        }
        return this.multiplyScalar(1 / det), this;
    },
    translate: function() {
        console.warn("THREE.Matrix4: .translate() has been removed.");
    },
    rotateX: function() {
        console.warn("THREE.Matrix4: .rotateX() has been removed.");
    },
    rotateY: function() {
        console.warn("THREE.Matrix4: .rotateY() has been removed.");
    },
    rotateZ: function() {
        console.warn("THREE.Matrix4: .rotateZ() has been removed.");
    },
    rotateByAxis: function() {
        console.warn("THREE.Matrix4: .rotateByAxis() has been removed.");
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
        var te = this.elements;
        return new THREE.Matrix4(te[0], te[4], te[8], te[12], te[1], te[5], te[9], te[13], te[2], te[6], te[10], te[14], te[3], te[7], te[11], te[15]);
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
    distanceSqToSegment: function(v0, v1, optionalPointOnRay, optionalPointOnSegment) {
        var s0, s1, sqrDist, extDet, segCenter = v0.clone().add(v1).multiplyScalar(.5), segDir = v1.clone().sub(v0).normalize(), segExtent = .5 * v0.distanceTo(v1), diff = this.origin.clone().sub(segCenter), a01 = -this.direction.dot(segDir), b0 = diff.dot(this.direction), b1 = -diff.dot(segDir), c = diff.lengthSq(), det = Math.abs(1 - a01 * a01);
        if (det >= 0) if (s0 = a01 * b1 - b0, s1 = a01 * b0 - b1, extDet = segExtent * det, 
        s0 >= 0) if (s1 >= -extDet) if (extDet >= s1) {
            var invDet = 1 / det;
            s0 *= invDet, s1 *= invDet, sqrDist = s0 * (s0 + a01 * s1 + 2 * b0) + s1 * (a01 * s0 + s1 + 2 * b1) + c;
        } else s1 = segExtent, s0 = Math.max(0, -(a01 * s1 + b0)), sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c; else s1 = -segExtent, 
        s0 = Math.max(0, -(a01 * s1 + b0)), sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c; else -extDet >= s1 ? (s0 = Math.max(0, -(-a01 * segExtent + b0)), 
        s1 = s0 > 0 ? -segExtent : Math.min(Math.max(-segExtent, -b1), segExtent), sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c) : extDet >= s1 ? (s0 = 0, 
        s1 = Math.min(Math.max(-segExtent, -b1), segExtent), sqrDist = s1 * (s1 + 2 * b1) + c) : (s0 = Math.max(0, -(a01 * segExtent + b0)), 
        s1 = s0 > 0 ? segExtent : Math.min(Math.max(-segExtent, -b1), segExtent), sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c); else s1 = a01 > 0 ? -segExtent : segExtent, 
        s0 = Math.max(0, -(a01 * s1 + b0)), sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
        return optionalPointOnRay && optionalPointOnRay.copy(this.direction.clone().multiplyScalar(s0).add(this.origin)), 
        optionalPointOnSegment && optionalPointOnSegment.copy(segDir.clone().multiplyScalar(s1).add(segCenter)), 
        sqrDist;
    },
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
        return low + Math.floor(Math.random() * (high - low + 1));
    },
    randFloat: function(low, high) {
        return low + Math.random() * (high - low);
    },
    randFloatSpread: function(range) {
        return range * (.5 - Math.random());
    },
    sign: function(x) {
        return 0 > x ? -1 : x > 0 ? 1 : 0;
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
        intersectObject: function(object, recursive) {
            var intersects = [];
            return intersectObject(object, this, intersects, recursive), intersects.sort(descSort), 
            intersects;
        },
        intersectObjects: function(objects, recursive) {
            for (var intersects = [], i = 0, l = objects.length; l > i; i++) intersectObject(objects[i], this, intersects, recursive);
            return intersects.sort(descSort), intersects;
        }
    };
}(THREE), THREE.Object3D = function() {
    this.id = THREE.Object3DIdCount++, this.uuid = THREE.Math.generateUUID(), this.name = "", 
    this.parent = void 0, this.children = [], this.up = THREE.Object3D.DefaultUp.clone();
    var position = new THREE.Vector3(), rotation = new THREE.Euler(), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3(1, 1, 1);
    rotation.onChange(function() {
        quaternion.setFromEuler(rotation, !1);
    }), quaternion.onChange(function() {
        rotation.setFromQuaternion(quaternion, void 0, !1);
    }), Object.defineProperties(this, {
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
    }), this.renderDepth = null, this.rotationAutoUpdate = !0, this.matrix = new THREE.Matrix4(), 
    this.matrixWorld = new THREE.Matrix4(), this.matrixAutoUpdate = !0, this.matrixWorldNeedsUpdate = !1, 
    this.visible = !0, this.castShadow = !1, this.receiveShadow = !1, this.frustumCulled = !0, 
    this.userData = {};
}, THREE.Object3D.DefaultUp = new THREE.Vector3(0, 1, 0), THREE.Object3D.prototype = {
    constructor: THREE.Object3D,
    get eulerOrder() {
        return console.warn("THREE.Object3D: .eulerOrder has been moved to .rotation.order."), 
        this.rotation.order;
    },
    set eulerOrder(value) {
        console.warn("THREE.Object3D: .eulerOrder has been moved to .rotation.order."), 
        this.rotation.order = value;
    },
    get useQuaternion() {
        console.warn("THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.");
    },
    set useQuaternion(value) {
        console.warn("THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.");
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
        if (object === this) return console.error("THREE.Object3D.add:", object, "can't be added as a child of itself."), 
        this;
        if (object instanceof THREE.Object3D) {
            void 0 !== object.parent && object.parent.remove(object), object.parent = this, 
            object.dispatchEvent({
                type: "added"
            }), this.children.push(object);
            for (var scene = this; void 0 !== scene.parent; ) scene = scene.parent;
            void 0 !== scene && scene instanceof THREE.Scene && scene.__addObject(object);
        } else console.error("THREE.Object3D.add:", object, "is not an instance of THREE.Object3D.");
        return this;
    },
    remove: function(object) {
        if (arguments.length > 1) for (var i = 0; i < arguments.length; i++) this.remove(arguments[i]);
        var index = this.children.indexOf(object);
        if (-1 !== index) {
            object.parent = void 0, object.dispatchEvent({
                type: "removed"
            }), this.children.splice(index, 1);
            for (var scene = this; void 0 !== scene.parent; ) scene = scene.parent;
            void 0 !== scene && scene instanceof THREE.Scene && scene.__removeObject(object);
        }
    },
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
    getObjectById: function(id, recursive) {
        for (var i = 0, l = this.children.length; l > i; i++) {
            var child = this.children[i];
            if (child.id === id) return child;
            if (recursive === !0 && (child = child.getObjectById(id, recursive), void 0 !== child)) return child;
        }
        return void 0;
    },
    getObjectByName: function(name, recursive) {
        for (var i = 0, l = this.children.length; l > i; i++) {
            var child = this.children[i];
            if (child.name === name) return child;
            if (recursive === !0 && (child = child.getObjectByName(name, recursive), void 0 !== child)) return child;
        }
        return void 0;
    },
    getChildByName: function(name, recursive) {
        return console.warn("THREE.Object3D: .getChildByName() has been renamed to .getObjectByName()."), 
        this.getObjectByName(name, recursive);
    },
    updateMatrix: function() {
        this.matrix.compose(this.position, this.quaternion, this.scale), this.matrixWorldNeedsUpdate = !0;
    },
    updateMatrixWorld: function(force) {
        this.matrixAutoUpdate === !0 && this.updateMatrix(), (this.matrixWorldNeedsUpdate === !0 || force === !0) && (void 0 === this.parent ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix), 
        this.matrixWorldNeedsUpdate = !1, force = !0);
        for (var i = 0, l = this.children.length; l > i; i++) this.children[i].updateMatrixWorld(force);
    },
    clone: function(object, recursive) {
        if (void 0 === object && (object = new THREE.Object3D()), void 0 === recursive && (recursive = !0), 
        object.name = this.name, object.up.copy(this.up), object.position.copy(this.position), 
        object.quaternion.copy(this.quaternion), object.scale.copy(this.scale), object.renderDepth = this.renderDepth, 
        object.rotationAutoUpdate = this.rotationAutoUpdate, object.matrix.copy(this.matrix), 
        object.matrixWorld.copy(this.matrixWorld), object.matrixAutoUpdate = this.matrixAutoUpdate, 
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
THREE.Projector = function() {
    function getNextObjectInPool() {
        if (_objectCount === _objectPoolLength) {
            var object = new THREE.RenderableObject();
            return _objectPool.push(object), _objectPoolLength++, _objectCount++, object;
        }
        return _objectPool[_objectCount++];
    }
    function getNextVertexInPool() {
        if (_vertexCount === _vertexPoolLength) {
            var vertex = new THREE.RenderableVertex();
            return _vertexPool.push(vertex), _vertexPoolLength++, _vertexCount++, vertex;
        }
        return _vertexPool[_vertexCount++];
    }
    function getNextFaceInPool() {
        if (_faceCount === _facePoolLength) {
            var face = new THREE.RenderableFace();
            return _facePool.push(face), _facePoolLength++, _faceCount++, face;
        }
        return _facePool[_faceCount++];
    }
    function getNextLineInPool() {
        if (_lineCount === _linePoolLength) {
            var line = new THREE.RenderableLine();
            return _linePool.push(line), _linePoolLength++, _lineCount++, line;
        }
        return _linePool[_lineCount++];
    }
    function getNextSpriteInPool() {
        if (_spriteCount === _spritePoolLength) {
            var sprite = new THREE.RenderableSprite();
            return _spritePool.push(sprite), _spritePoolLength++, _spriteCount++, sprite;
        }
        return _spritePool[_spriteCount++];
    }
    function painterSort(a, b) {
        return a.z !== b.z ? b.z - a.z : a.id !== b.id ? a.id - b.id : 0;
    }
    function clipLine(s1, s2) {
        var alpha1 = 0, alpha2 = 1, bc1near = s1.z + s1.w, bc2near = s2.z + s2.w, bc1far = -s1.z + s1.w, bc2far = -s2.z + s2.w;
        return bc1near >= 0 && bc2near >= 0 && bc1far >= 0 && bc2far >= 0 ? !0 : 0 > bc1near && 0 > bc2near || 0 > bc1far && 0 > bc2far ? !1 : (0 > bc1near ? alpha1 = Math.max(alpha1, bc1near / (bc1near - bc2near)) : 0 > bc2near && (alpha2 = Math.min(alpha2, bc1near / (bc1near - bc2near))), 
        0 > bc1far ? alpha1 = Math.max(alpha1, bc1far / (bc1far - bc2far)) : 0 > bc2far && (alpha2 = Math.min(alpha2, bc1far / (bc1far - bc2far))), 
        alpha1 > alpha2 ? !1 : (s1.lerp(s2, alpha1), s2.lerp(s1, 1 - alpha2), !0));
    }
    var _object, _objectCount, _vertex, _vertexCount, _face, _faceCount, _line, _lineCount, _sprite, _spriteCount, _modelMatrix, _objectPool = [], _objectPoolLength = 0, _vertexPool = [], _vertexPoolLength = 0, _facePool = [], _facePoolLength = 0, _linePool = [], _linePoolLength = 0, _spritePool = [], _spritePoolLength = 0, _renderData = {
        objects: [],
        lights: [],
        elements: []
    }, _vA = new THREE.Vector3(), _vB = new THREE.Vector3(), _vC = new THREE.Vector3(), _vector3 = new THREE.Vector3(), _vector4 = new THREE.Vector4(), _clipBox = new THREE.Box3(new THREE.Vector3(-1, -1, -1), new THREE.Vector3(1, 1, 1)), _boundingBox = new THREE.Box3(), _points3 = new Array(3), _viewMatrix = (new Array(4), 
    new THREE.Matrix4()), _viewProjectionMatrix = new THREE.Matrix4(), _modelViewProjectionMatrix = new THREE.Matrix4(), _normalMatrix = new THREE.Matrix3(), _frustum = new THREE.Frustum(), _clippedVertex1PositionScreen = new THREE.Vector4(), _clippedVertex2PositionScreen = new THREE.Vector4();
    this.projectVector = function(vector, camera) {
        return camera.matrixWorldInverse.getInverse(camera.matrixWorld), _viewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse), 
        vector.applyProjection(_viewProjectionMatrix);
    }, this.unprojectVector = function() {
        var projectionMatrixInverse = new THREE.Matrix4();
        return function(vector, camera) {
            return projectionMatrixInverse.getInverse(camera.projectionMatrix), _viewProjectionMatrix.multiplyMatrices(camera.matrixWorld, projectionMatrixInverse), 
            vector.applyProjection(_viewProjectionMatrix);
        };
    }(), this.pickingRay = function(vector, camera) {
        vector.z = -1;
        var end = new THREE.Vector3(vector.x, vector.y, 1);
        return this.unprojectVector(vector, camera), this.unprojectVector(end, camera), 
        end.sub(vector).normalize(), new THREE.Raycaster(vector, end);
    };
    var RenderList = function() {
        var normals = [], uvs = [], object = null, material = null, normalMatrix = new THREE.Matrix3(), setObject = function(value) {
            object = value, material = object.material, normalMatrix.getNormalMatrix(object.matrixWorld), 
            normals.length = 0, uvs.length = 0;
        }, projectVertex = function(vertex) {
            var position = vertex.position, positionWorld = vertex.positionWorld, positionScreen = vertex.positionScreen;
            positionWorld.copy(position).applyMatrix4(_modelMatrix), positionScreen.copy(positionWorld).applyMatrix4(_viewProjectionMatrix);
            var invW = 1 / positionScreen.w;
            positionScreen.x *= invW, positionScreen.y *= invW, positionScreen.z *= invW, vertex.visible = positionScreen.x >= -1 && positionScreen.x <= 1 && positionScreen.y >= -1 && positionScreen.y <= 1 && positionScreen.z >= -1 && positionScreen.z <= 1;
        }, pushVertex = function(x, y, z) {
            _vertex = getNextVertexInPool(), _vertex.position.set(x, y, z), projectVertex(_vertex);
        }, pushNormal = function(x, y, z) {
            normals.push(x, y, z);
        }, pushUv = function(x, y) {
            uvs.push(x, y);
        }, checkTriangleVisibility = function(v1, v2, v3) {
            return v1.visible === !0 || v2.visible === !0 || v3.visible === !0 ? !0 : (_points3[0] = v1.positionScreen, 
            _points3[1] = v2.positionScreen, _points3[2] = v3.positionScreen, _clipBox.isIntersectionBox(_boundingBox.setFromPoints(_points3)));
        }, checkBackfaceCulling = function(v1, v2, v3) {
            return (v3.positionScreen.x - v1.positionScreen.x) * (v2.positionScreen.y - v1.positionScreen.y) - (v3.positionScreen.y - v1.positionScreen.y) * (v2.positionScreen.x - v1.positionScreen.x) < 0;
        }, pushLine = function(a, b) {
            var v1 = _vertexPool[a], v2 = _vertexPool[b];
            _line = getNextLineInPool(), _line.id = object.id, _line.v1.copy(v1), _line.v2.copy(v2), 
            _line.z = (v1.positionScreen.z + v2.positionScreen.z) / 2, _line.material = object.material, 
            _renderData.elements.push(_line);
        }, pushTriangle = function(a, b, c) {
            var v1 = _vertexPool[a], v2 = _vertexPool[b], v3 = _vertexPool[c];
            if (checkTriangleVisibility(v1, v2, v3) !== !1 && (material.side === THREE.DoubleSide || checkBackfaceCulling(v1, v2, v3) === !0)) {
                _face = getNextFaceInPool(), _face.id = object.id, _face.v1.copy(v1), _face.v2.copy(v2), 
                _face.v3.copy(v3), _face.z = (v1.positionScreen.z + v2.positionScreen.z + v3.positionScreen.z) / 3;
                for (var i = 0; 3 > i; i++) {
                    var offset = 3 * arguments[i], normal = _face.vertexNormalsModel[i];
                    normal.set(normals[offset], normals[offset + 1], normals[offset + 2]), normal.applyMatrix3(normalMatrix).normalize();
                    var offset2 = 2 * arguments[i], uv = _face.uvs[i];
                    uv.set(uvs[offset2], uvs[offset2 + 1]);
                }
                _face.vertexNormalsLength = 3, _face.material = object.material, _renderData.elements.push(_face);
            }
        };
        return {
            setObject: setObject,
            projectVertex: projectVertex,
            checkTriangleVisibility: checkTriangleVisibility,
            checkBackfaceCulling: checkBackfaceCulling,
            pushVertex: pushVertex,
            pushNormal: pushNormal,
            pushUv: pushUv,
            pushLine: pushLine,
            pushTriangle: pushTriangle
        };
    }, renderList = new RenderList();
    this.projectScene = function(scene, camera, sortObjects, sortElements) {
        _faceCount = 0, _lineCount = 0, _spriteCount = 0, _renderData.elements.length = 0, 
        scene.autoUpdate === !0 && scene.updateMatrixWorld(), void 0 === camera.parent && camera.updateMatrixWorld(), 
        _viewMatrix.copy(camera.matrixWorldInverse.getInverse(camera.matrixWorld)), _viewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, _viewMatrix), 
        _frustum.setFromMatrix(_viewProjectionMatrix), _objectCount = 0, _renderData.objects.length = 0, 
        _renderData.lights.length = 0, scene.traverseVisible(function(object) {
            object instanceof THREE.Light ? _renderData.lights.push(object) : (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Sprite) && (object.frustumCulled === !1 || _frustum.intersectsObject(object) === !0) && (_object = getNextObjectInPool(), 
            _object.id = object.id, _object.object = object, null !== object.renderDepth ? _object.z = object.renderDepth : (_vector3.setFromMatrixPosition(object.matrixWorld), 
            _vector3.applyProjection(_viewProjectionMatrix), _object.z = _vector3.z), _renderData.objects.push(_object));
        }), sortObjects === !0 && _renderData.objects.sort(painterSort);
        for (var o = 0, ol = _renderData.objects.length; ol > o; o++) {
            var object = _renderData.objects[o].object, geometry = object.geometry;
            if (renderList.setObject(object), _modelMatrix = object.matrixWorld, _vertexCount = 0, 
            object instanceof THREE.Mesh) {
                if (geometry instanceof THREE.BufferGeometry) {
                    var attributes = geometry.attributes, offsets = geometry.offsets;
                    if (void 0 === attributes.position) continue;
                    for (var positions = attributes.position.array, i = 0, l = positions.length; l > i; i += 3) renderList.pushVertex(positions[i], positions[i + 1], positions[i + 2]);
                    if (void 0 !== attributes.normal) for (var normals = attributes.normal.array, i = 0, l = normals.length; l > i; i += 3) renderList.pushNormal(normals[i], normals[i + 1], normals[i + 2]);
                    if (void 0 !== attributes.uv) for (var uvs = attributes.uv.array, i = 0, l = uvs.length; l > i; i += 2) renderList.pushUv(uvs[i], uvs[i + 1]);
                    if (void 0 !== attributes.index) {
                        var indices = attributes.index.array;
                        if (offsets.length > 0) for (var o = 0; o < offsets.length; o++) for (var offset = offsets[o], index = offset.index, i = offset.start, l = offset.start + offset.count; l > i; i += 3) renderList.pushTriangle(indices[i] + index, indices[i + 1] + index, indices[i + 2] + index); else for (var i = 0, l = indices.length; l > i; i += 3) renderList.pushTriangle(indices[i], indices[i + 1], indices[i + 2]);
                    } else for (var i = 0, l = positions.length / 3; l > i; i += 3) renderList.pushTriangle(i, i + 1, i + 2);
                } else if (geometry instanceof THREE.Geometry) {
                    var vertices = geometry.vertices, faces = geometry.faces, faceVertexUvs = geometry.faceVertexUvs[0];
                    _normalMatrix.getNormalMatrix(_modelMatrix);
                    for (var isFaceMaterial = object.material instanceof THREE.MeshFaceMaterial, objectMaterials = isFaceMaterial === !0 ? object.material : null, v = 0, vl = vertices.length; vl > v; v++) {
                        var vertex = vertices[v];
                        renderList.pushVertex(vertex.x, vertex.y, vertex.z);
                    }
                    for (var f = 0, fl = faces.length; fl > f; f++) {
                        var face = faces[f], material = isFaceMaterial === !0 ? objectMaterials.materials[face.materialIndex] : object.material;
                        if (void 0 !== material) {
                            var side = material.side, v1 = _vertexPool[face.a], v2 = _vertexPool[face.b], v3 = _vertexPool[face.c];
                            if (material.morphTargets === !0) {
                                var morphTargets = geometry.morphTargets, morphInfluences = object.morphTargetInfluences, v1p = v1.position, v2p = v2.position, v3p = v3.position;
                                _vA.set(0, 0, 0), _vB.set(0, 0, 0), _vC.set(0, 0, 0);
                                for (var t = 0, tl = morphTargets.length; tl > t; t++) {
                                    var influence = morphInfluences[t];
                                    if (0 !== influence) {
                                        var targets = morphTargets[t].vertices;
                                        _vA.x += (targets[face.a].x - v1p.x) * influence, _vA.y += (targets[face.a].y - v1p.y) * influence, 
                                        _vA.z += (targets[face.a].z - v1p.z) * influence, _vB.x += (targets[face.b].x - v2p.x) * influence, 
                                        _vB.y += (targets[face.b].y - v2p.y) * influence, _vB.z += (targets[face.b].z - v2p.z) * influence, 
                                        _vC.x += (targets[face.c].x - v3p.x) * influence, _vC.y += (targets[face.c].y - v3p.y) * influence, 
                                        _vC.z += (targets[face.c].z - v3p.z) * influence;
                                    }
                                }
                                v1.position.add(_vA), v2.position.add(_vB), v3.position.add(_vC), renderList.projectVertex(v1), 
                                renderList.projectVertex(v2), renderList.projectVertex(v3);
                            }
                            if (renderList.checkTriangleVisibility(v1, v2, v3) !== !1) {
                                var visible = renderList.checkBackfaceCulling(v1, v2, v3);
                                if (side !== THREE.DoubleSide) {
                                    if (side === THREE.FrontSide && visible === !1) continue;
                                    if (side === THREE.BackSide && visible === !0) continue;
                                }
                                _face = getNextFaceInPool(), _face.id = object.id, _face.v1.copy(v1), _face.v2.copy(v2), 
                                _face.v3.copy(v3), _face.normalModel.copy(face.normal), visible !== !1 || side !== THREE.BackSide && side !== THREE.DoubleSide || _face.normalModel.negate(), 
                                _face.normalModel.applyMatrix3(_normalMatrix).normalize();
                                for (var faceVertexNormals = face.vertexNormals, n = 0, nl = Math.min(faceVertexNormals.length, 3); nl > n; n++) {
                                    var normalModel = _face.vertexNormalsModel[n];
                                    normalModel.copy(faceVertexNormals[n]), visible !== !1 || side !== THREE.BackSide && side !== THREE.DoubleSide || normalModel.negate(), 
                                    normalModel.applyMatrix3(_normalMatrix).normalize();
                                }
                                _face.vertexNormalsLength = faceVertexNormals.length;
                                var vertexUvs = faceVertexUvs[f];
                                if (void 0 !== vertexUvs) for (var u = 0; 3 > u; u++) _face.uvs[u].copy(vertexUvs[u]);
                                _face.color = face.color, _face.material = material, _face.z = (v1.positionScreen.z + v2.positionScreen.z + v3.positionScreen.z) / 3, 
                                _renderData.elements.push(_face);
                            }
                        }
                    }
                }
            } else if (object instanceof THREE.Line) {
                if (geometry instanceof THREE.BufferGeometry) {
                    var attributes = geometry.attributes;
                    if (void 0 !== attributes.position) {
                        for (var positions = attributes.position.array, i = 0, l = positions.length; l > i; i += 3) renderList.pushVertex(positions[i], positions[i + 1], positions[i + 2]);
                        if (void 0 !== attributes.index) for (var indices = attributes.index.array, i = 0, l = indices.length; l > i; i += 2) renderList.pushLine(indices[i], indices[i + 1]); else for (var step = object.type === THREE.LinePieces ? 2 : 1, i = 0, l = positions.length / 3 - 1; l > i; i += step) renderList.pushLine(i, i + 1);
                    }
                } else if (geometry instanceof THREE.Geometry) {
                    _modelViewProjectionMatrix.multiplyMatrices(_viewProjectionMatrix, _modelMatrix);
                    var vertices = object.geometry.vertices;
                    if (0 === vertices.length) continue;
                    v1 = getNextVertexInPool(), v1.positionScreen.copy(vertices[0]).applyMatrix4(_modelViewProjectionMatrix);
                    for (var step = object.type === THREE.LinePieces ? 2 : 1, v = 1, vl = vertices.length; vl > v; v++) v1 = getNextVertexInPool(), 
                    v1.positionScreen.copy(vertices[v]).applyMatrix4(_modelViewProjectionMatrix), (v + 1) % step > 0 || (v2 = _vertexPool[_vertexCount - 2], 
                    _clippedVertex1PositionScreen.copy(v1.positionScreen), _clippedVertex2PositionScreen.copy(v2.positionScreen), 
                    clipLine(_clippedVertex1PositionScreen, _clippedVertex2PositionScreen) === !0 && (_clippedVertex1PositionScreen.multiplyScalar(1 / _clippedVertex1PositionScreen.w), 
                    _clippedVertex2PositionScreen.multiplyScalar(1 / _clippedVertex2PositionScreen.w), 
                    _line = getNextLineInPool(), _line.id = object.id, _line.v1.positionScreen.copy(_clippedVertex1PositionScreen), 
                    _line.v2.positionScreen.copy(_clippedVertex2PositionScreen), _line.z = Math.max(_clippedVertex1PositionScreen.z, _clippedVertex2PositionScreen.z), 
                    _line.material = object.material, object.material.vertexColors === THREE.VertexColors && (_line.vertexColors[0].copy(object.geometry.colors[v]), 
                    _line.vertexColors[1].copy(object.geometry.colors[v - 1])), _renderData.elements.push(_line)));
                }
            } else if (object instanceof THREE.Sprite) {
                _vector4.set(_modelMatrix.elements[12], _modelMatrix.elements[13], _modelMatrix.elements[14], 1), 
                _vector4.applyMatrix4(_viewProjectionMatrix);
                var invW = 1 / _vector4.w;
                _vector4.z *= invW, _vector4.z >= -1 && _vector4.z <= 1 && (_sprite = getNextSpriteInPool(), 
                _sprite.id = object.id, _sprite.x = _vector4.x * invW, _sprite.y = _vector4.y * invW, 
                _sprite.z = _vector4.z, _sprite.object = object, _sprite.rotation = object.rotation, 
                _sprite.scale.x = object.scale.x * Math.abs(_sprite.x - (_vector4.x + camera.projectionMatrix.elements[0]) / (_vector4.w + camera.projectionMatrix.elements[12])), 
                _sprite.scale.y = object.scale.y * Math.abs(_sprite.y - (_vector4.y + camera.projectionMatrix.elements[5]) / (_vector4.w + camera.projectionMatrix.elements[13])), 
                _sprite.material = object.material, _renderData.elements.push(_sprite));
            }
        }
        return sortElements === !0 && _renderData.elements.sort(painterSort), _renderData;
    };
}, THREE.Face3 = function(a, b, c, normal, color, materialIndex) {
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
    return console.warn("THREE.Face4 has been removed. A THREE.Face3 will be created instead."), 
    new THREE.Face3(a, b, c, normal, color, materialIndex);
}, THREE.BufferAttribute = function(array, itemSize) {
    this.array = array, this.itemSize = itemSize;
}, THREE.BufferAttribute.prototype = {
    constructor: THREE.BufferAttribute,
    get length() {
        return this.array.length;
    },
    set: function(value) {
        return this.array.set(value), this;
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
    }
}, THREE.Int8Attribute = function(data, itemSize) {
    return console.warn("THREE.Int8Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), 
    new THREE.BufferAttribute(data, itemSize);
}, THREE.Uint8Attribute = function(data, itemSize) {
    return console.warn("THREE.Uint8Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), 
    new THREE.BufferAttribute(data, itemSize);
}, THREE.Uint8ClampedAttribute = function(data, itemSize) {
    return console.warn("THREE.Uint8ClampedAttribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), 
    new THREE.BufferAttribute(data, itemSize);
}, THREE.Int16Attribute = function(data, itemSize) {
    return console.warn("THREE.Int16Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), 
    new THREE.BufferAttribute(data, itemSize);
}, THREE.Uint16Attribute = function(data, itemSize) {
    return console.warn("THREE.Uint16Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), 
    new THREE.BufferAttribute(data, itemSize);
}, THREE.Int32Attribute = function(data, itemSize) {
    return console.warn("THREE.Int32Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), 
    new THREE.BufferAttribute(data, itemSize);
}, THREE.Uint32Attribute = function(data, itemSize) {
    return console.warn("THREE.Uint32Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), 
    new THREE.BufferAttribute(data, itemSize);
}, THREE.Float32Attribute = function(data, itemSize) {
    return console.warn("THREE.Float32Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), 
    new THREE.BufferAttribute(data, itemSize);
}, THREE.Float64Attribute = function(data, itemSize) {
    return console.warn("THREE.Float64Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead."), 
    new THREE.BufferAttribute(data, itemSize);
}, THREE.BufferGeometry = function() {
    this.id = THREE.GeometryIdCount++, this.uuid = THREE.Math.generateUUID(), this.name = "", 
    this.attributes = {}, this.drawcalls = [], this.offsets = this.drawcalls, this.boundingBox = null, 
    this.boundingSphere = null;
}, THREE.BufferGeometry.prototype = {
    constructor: THREE.BufferGeometry,
    addAttribute: function(name, attribute) {
        return attribute instanceof THREE.BufferAttribute == !1 ? (console.warn("THREE.BufferGeometry: .addAttribute() now expects ( name, attribute )."), 
        void (this.attributes[name] = {
            array: arguments[1],
            itemSize: arguments[2]
        })) : void (this.attributes[name] = attribute);
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
            this.addAttribute("uvs", new THREE.BufferAttribute(uvs, 2));
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
        null === this.boundingBox && (this.boundingBox = new THREE.Box3());
        var positions = this.attributes.position.array;
        if (positions) {
            var bb = this.boundingBox;
            positions.length >= 3 && (bb.min.x = bb.max.x = positions[0], bb.min.y = bb.max.y = positions[1], 
            bb.min.z = bb.max.z = positions[2]);
            for (var i = 3, il = positions.length; il > i; i += 3) {
                var x = positions[i], y = positions[i + 1], z = positions[i + 2];
                x < bb.min.x ? bb.min.x = x : x > bb.max.x && (bb.max.x = x), y < bb.min.y ? bb.min.y = y : y > bb.max.y && (bb.max.y = y), 
                z < bb.min.z ? bb.min.z = z : z > bb.max.z && (bb.max.z = z);
            }
        }
        (void 0 === positions || 0 === positions.length) && (this.boundingBox.min.set(0, 0, 0), 
        this.boundingBox.max.set(0, 0, 0)), (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && console.error('THREE.BufferGeometry.computeBoundingBox: Computed min/max have NaN values. The "position" attribute is likely to have NaN values.');
    },
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
                this.boundingSphere.radius = Math.sqrt(maxRadiusSq), isNaN(this.boundingSphere.radius) && console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.');
            }
        };
    }(),
    computeFaceNormals: function() {},
    computeVertexNormals: function() {
        if (this.attributes.position) {
            var i, il, j, jl, nVertexElements = this.attributes.position.array.length;
            if (void 0 === this.attributes.normal) this.attributes.normal = {
                itemSize: 3,
                array: new Float32Array(nVertexElements)
            }; else for (i = 0, il = this.attributes.normal.array.length; il > i; i++) this.attributes.normal.array[i] = 0;
            var vA, vB, vC, x, y, z, positions = this.attributes.position.array, normals = this.attributes.normal.array, pA = new THREE.Vector3(), pB = new THREE.Vector3(), pC = new THREE.Vector3(), cb = new THREE.Vector3(), ab = new THREE.Vector3();
            if (this.attributes.index) {
                var indices = this.attributes.index.array, offsets = this.offsets.length > 0 ? this.offsets : [ {
                    start: 0,
                    count: indices.length,
                    index: 0
                } ];
                for (j = 0, jl = offsets.length; jl > j; ++j) {
                    var start = offsets[j].start, count = offsets[j].count, index = offsets[j].index;
                    for (i = start, il = start + count; il > i; i += 3) vA = index + indices[i], vB = index + indices[i + 1], 
                    vC = index + indices[i + 2], x = positions[3 * vA], y = positions[3 * vA + 1], z = positions[3 * vA + 2], 
                    pA.set(x, y, z), x = positions[3 * vB], y = positions[3 * vB + 1], z = positions[3 * vB + 2], 
                    pB.set(x, y, z), x = positions[3 * vC], y = positions[3 * vC + 1], z = positions[3 * vC + 2], 
                    pC.set(x, y, z), cb.subVectors(pC, pB), ab.subVectors(pA, pB), cb.cross(ab), normals[3 * vA] += cb.x, 
                    normals[3 * vA + 1] += cb.y, normals[3 * vA + 2] += cb.z, normals[3 * vB] += cb.x, 
                    normals[3 * vB + 1] += cb.y, normals[3 * vB + 2] += cb.z, normals[3 * vC] += cb.x, 
                    normals[3 * vC + 1] += cb.y, normals[3 * vC + 2] += cb.z;
                }
            } else for (i = 0, il = positions.length; il > i; i += 9) x = positions[i], y = positions[i + 1], 
            z = positions[i + 2], pA.set(x, y, z), x = positions[i + 3], y = positions[i + 4], 
            z = positions[i + 5], pB.set(x, y, z), x = positions[i + 6], y = positions[i + 7], 
            z = positions[i + 8], pC.set(x, y, z), cb.subVectors(pC, pB), ab.subVectors(pA, pB), 
            cb.cross(ab), normals[i] = cb.x, normals[i + 1] = cb.y, normals[i + 2] = cb.z, normals[i + 3] = cb.x, 
            normals[i + 4] = cb.y, normals[i + 5] = cb.z, normals[i + 6] = cb.x, normals[i + 7] = cb.y, 
            normals[i + 8] = cb.z;
            this.normalizeNormals(), this.normalsNeedUpdate = !0;
        }
    },
    computeTangents: function() {
        function handleTriangle(a, b, c) {
            xA = positions[3 * a], yA = positions[3 * a + 1], zA = positions[3 * a + 2], xB = positions[3 * b], 
            yB = positions[3 * b + 1], zB = positions[3 * b + 2], xC = positions[3 * c], yC = positions[3 * c + 1], 
            zC = positions[3 * c + 2], uA = uvs[2 * a], vA = uvs[2 * a + 1], uB = uvs[2 * b], 
            vB = uvs[2 * b + 1], uC = uvs[2 * c], vC = uvs[2 * c + 1], x1 = xB - xA, x2 = xC - xA, 
            y1 = yB - yA, y2 = yC - yA, z1 = zB - zA, z2 = zC - zA, s1 = uB - uA, s2 = uC - uA, 
            t1 = vB - vA, t2 = vC - vA, r = 1 / (s1 * t2 - s2 * t1), sdir.set((t2 * x1 - t1 * x2) * r, (t2 * y1 - t1 * y2) * r, (t2 * z1 - t1 * z2) * r), 
            tdir.set((s1 * x2 - s2 * x1) * r, (s1 * y2 - s2 * y1) * r, (s1 * z2 - s2 * z1) * r), 
            tan1[a].add(sdir), tan1[b].add(sdir), tan1[c].add(sdir), tan2[a].add(tdir), tan2[b].add(tdir), 
            tan2[c].add(tdir);
        }
        function handleVertex(v) {
            n.x = normals[3 * v], n.y = normals[3 * v + 1], n.z = normals[3 * v + 2], n2.copy(n), 
            t = tan1[v], tmp.copy(t), tmp.sub(n.multiplyScalar(n.dot(t))).normalize(), tmp2.crossVectors(n2, t), 
            test = tmp2.dot(tan2[v]), w = 0 > test ? -1 : 1, tangents[4 * v] = tmp.x, tangents[4 * v + 1] = tmp.y, 
            tangents[4 * v + 2] = tmp.z, tangents[4 * v + 3] = w;
        }
        if (void 0 === this.attributes.index || void 0 === this.attributes.position || void 0 === this.attributes.normal || void 0 === this.attributes.uv) return void console.warn("Missing required attributes (index, position, normal or uv) in BufferGeometry.computeTangents()");
        var indices = this.attributes.index.array, positions = this.attributes.position.array, normals = this.attributes.normal.array, uvs = this.attributes.uv.array, nVertices = positions.length / 3;
        if (void 0 === this.attributes.tangent) {
            var nTangentElements = 4 * nVertices;
            this.attributes.tangent = {
                itemSize: 4,
                array: new Float32Array(nTangentElements)
            };
        }
        for (var tangents = this.attributes.tangent.array, tan1 = [], tan2 = [], k = 0; nVertices > k; k++) tan1[k] = new THREE.Vector3(), 
        tan2[k] = new THREE.Vector3();
        var xA, yA, zA, xB, yB, zB, xC, yC, zC, uA, vA, uB, vB, uC, vC, x1, x2, y1, y2, z1, z2, s1, s2, t1, t2, r, i, il, j, jl, iA, iB, iC, sdir = new THREE.Vector3(), tdir = new THREE.Vector3(), offsets = this.offsets;
        for (j = 0, jl = offsets.length; jl > j; ++j) {
            var start = offsets[j].start, count = offsets[j].count, index = offsets[j].index;
            for (i = start, il = start + count; il > i; i += 3) iA = index + indices[i], iB = index + indices[i + 1], 
            iC = index + indices[i + 2], handleTriangle(iA, iB, iC);
        }
        var w, t, test, tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3(), n = new THREE.Vector3(), n2 = new THREE.Vector3();
        for (j = 0, jl = offsets.length; jl > j; ++j) {
            var start = offsets[j].start, count = offsets[j].count, index = offsets[j].index;
            for (i = start, il = start + count; il > i; i += 3) iA = index + indices[i], iB = index + indices[i + 1], 
            iC = index + indices[i + 2], handleVertex(iA), handleVertex(iB), handleVertex(iC);
        }
    },
    computeOffsets: function(indexBufferSize) {
        var size = indexBufferSize;
        void 0 === indexBufferSize && (size = 65535);
        for (var indices = (Date.now(), this.attributes.index.array), vertices = this.attributes.position.array, facesCount = (vertices.length / 3, 
        indices.length / 3), sortedIndices = new Uint16Array(indices.length), indexPtr = 0, vertexPtr = 0, offsets = [ {
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
        offsets;
    },
    merge: function() {
        console.log("BufferGeometry.merge(): TODO");
    },
    normalizeNormals: function() {
        for (var x, y, z, n, normals = this.attributes.normal.array, i = 0, il = normals.length; il > i; i += 3) x = normals[i], 
        y = normals[i + 1], z = normals[i + 2], n = 1 / Math.sqrt(x * x + y * y + z * z), 
        normals[i] *= n, normals[i + 1] *= n, normals[i + 2] *= n;
    },
    reorderBuffers: function(indexBuffer, indexMap, vertexCount) {
        var sortedAttributes = {}, types = [ Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array ];
        for (var attr in this.attributes) if ("index" != attr) for (var sourceArray = this.attributes[attr].array, i = 0, il = types.length; il > i; i++) {
            var type = types[i];
            if (sourceArray instanceof type) {
                sortedAttributes[attr] = new type(this.attributes[attr].itemSize * vertexCount);
                break;
            }
        }
        for (var new_vid = 0; vertexCount > new_vid; new_vid++) {
            var vid = indexMap[new_vid];
            for (var attr in this.attributes) if ("index" != attr) for (var attrArray = this.attributes[attr].array, attrSize = this.attributes[attr].itemSize, sortedAttr = sortedAttributes[attr], k = 0; attrSize > k; k++) sortedAttr[new_vid * attrSize + k] = attrArray[vid * attrSize + k];
        }
        this.attributes.index.array = indexBuffer;
        for (var attr in this.attributes) "index" != attr && (this.attributes[attr].array = sortedAttributes[attr], 
        this.attributes[attr].numItems = this.attributes[attr].itemSize * vertexCount);
    },
    clone: function() {
        var geometry = new THREE.BufferGeometry(), types = [ Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array ];
        for (var attr in this.attributes) {
            for (var sourceAttr = this.attributes[attr], sourceArray = sourceAttr.array, attribute = {
                itemSize: sourceAttr.itemSize,
                array: null
            }, i = 0, il = types.length; il > i; i++) {
                var type = types[i];
                if (sourceArray instanceof type) {
                    attribute.array = new type(sourceArray);
                    break;
                }
            }
            geometry.attributes[attr] = attribute;
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
    this.id = THREE.GeometryIdCount++, this.uuid = THREE.Math.generateUUID(), this.name = "", 
    this.vertices = [], this.colors = [], this.faces = [], this.faceVertexUvs = [ [] ], 
    this.morphTargets = [], this.morphColors = [], this.morphNormals = [], this.skinWeights = [], 
    this.skinIndices = [], this.lineDistances = [], this.boundingBox = null, this.boundingSphere = null, 
    this.hasTangents = !1, this.dynamic = !0, this.verticesNeedUpdate = !1, this.elementsNeedUpdate = !1, 
    this.uvsNeedUpdate = !1, this.normalsNeedUpdate = !1, this.tangentsNeedUpdate = !1, 
    this.colorsNeedUpdate = !1, this.lineDistancesNeedUpdate = !1, this.buffersNeedUpdate = !1, 
    this.groupsNeedUpdate = !1;
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
        this.boundingBox instanceof THREE.Box3 && this.computeBoundingBox(), this.boundingSphere instanceof THREE.Sphere && this.computeBoundingSphere();
    },
    center: function() {
        this.computeBoundingBox();
        var offset = new THREE.Vector3();
        return offset.addVectors(this.boundingBox.min, this.boundingBox.max), offset.multiplyScalar(-.5), 
        this.applyMatrix(new THREE.Matrix4().makeTranslation(offset.x, offset.y, offset.z)), 
        this.computeBoundingBox(), offset;
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
            {
                var vA, vB, vC, cb = new THREE.Vector3(), ab = new THREE.Vector3();
                new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3();
            }
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
        if (geometry instanceof THREE.Geometry == !1) return void console.error("THREE.Geometry.merge(): geometry not an instance of THREE.Geometry.", geometry);
        var normalMatrix, vertexOffset = this.vertices.length, vertices1 = (this.faceVertexUvs[0].length, 
        this.vertices), vertices2 = geometry.vertices, faces1 = this.faces, faces2 = geometry.faces, uvs1 = this.faceVertexUvs[0], uvs2 = geometry.faceVertexUvs[0];
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
                for (var j = 0, jl = uv.length; jl > j; j++) uvCopy.push(new THREE.Vector2(uv[j].x, uv[j].y));
                uvs1.push(uvCopy);
            }
        }
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
    makeGroups: function() {
        var geometryGroupCounter = 0;
        return function(usesFaceMaterial, maxVerticesInGroup) {
            var f, fl, face, materialIndex, groupHash, geometryGroup, hash_map = {}, numMorphTargets = this.morphTargets.length, numMorphNormals = this.morphNormals.length;
            for (this.geometryGroups = {}, this.geometryGroupsList = [], f = 0, fl = this.faces.length; fl > f; f++) face = this.faces[f], 
            materialIndex = usesFaceMaterial ? face.materialIndex : 0, materialIndex in hash_map || (hash_map[materialIndex] = {
                hash: materialIndex,
                counter: 0
            }), groupHash = hash_map[materialIndex].hash + "_" + hash_map[materialIndex].counter, 
            groupHash in this.geometryGroups || (geometryGroup = {
                id: geometryGroupCounter++,
                faces3: [],
                materialIndex: materialIndex,
                vertices: 0,
                numMorphTargets: numMorphTargets,
                numMorphNormals: numMorphNormals
            }, this.geometryGroups[groupHash] = geometryGroup, this.geometryGroupsList.push(geometryGroup)), 
            this.geometryGroups[groupHash].vertices + 3 > maxVerticesInGroup && (hash_map[materialIndex].counter += 1, 
            groupHash = hash_map[materialIndex].hash + "_" + hash_map[materialIndex].counter, 
            groupHash in this.geometryGroups || (geometryGroup = {
                id: geometryGroupCounter++,
                faces3: [],
                materialIndex: materialIndex,
                vertices: 0,
                numMorphTargets: numMorphTargets,
                numMorphNormals: numMorphNormals
            }, this.geometryGroups[groupHash] = geometryGroup, this.geometryGroupsList.push(geometryGroup))), 
            this.geometryGroups[groupHash].faces3.push(f), this.geometryGroups[groupHash].vertices += 3;
        };
    }(),
    clone: function() {
        for (var geometry = new THREE.Geometry(), vertices = this.vertices, i = 0, il = vertices.length; il > i; i++) geometry.vertices.push(vertices[i].clone());
        for (var faces = this.faces, i = 0, il = faces.length; il > i; i++) geometry.faces.push(faces[i].clone());
        for (var uvs = this.faceVertexUvs[0], i = 0, il = uvs.length; il > i; i++) {
            for (var uv = uvs[i], uvCopy = [], j = 0, jl = uv.length; jl > j; j++) uvCopy.push(new THREE.Vector2(uv[j].x, uv[j].y));
            geometry.faceVertexUvs[0].push(uvCopy);
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
    THREE.Object3D.call(this), this.matrixWorldInverse = new THREE.Matrix4(), this.projectionMatrix = new THREE.Matrix4();
}, THREE.Camera.prototype = Object.create(THREE.Object3D.prototype), THREE.Camera.prototype.lookAt = function() {
    var m1 = new THREE.Matrix4();
    return function(vector) {
        m1.lookAt(this.position, vector, this.up), this.quaternion.setFromRotationMatrix(m1);
    };
}(), THREE.Camera.prototype.clone = function(camera) {
    return void 0 === camera && (camera = new THREE.Camera()), THREE.Object3D.prototype.clone.call(this, camera), 
    camera.matrixWorldInverse.copy(this.matrixWorldInverse), camera.projectionMatrix.copy(this.projectionMatrix), 
    camera;
}, THREE.CubeCamera = function(near, far, cubeResolution) {
    THREE.Object3D.call(this);
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
}, THREE.CubeCamera.prototype = Object.create(THREE.Object3D.prototype), THREE.OrthographicCamera = function(left, right, top, bottom, near, far) {
    THREE.Camera.call(this), this.left = left, this.right = right, this.top = top, this.bottom = bottom, 
    this.near = void 0 !== near ? near : .1, this.far = void 0 !== far ? far : 2e3, 
    this.updateProjectionMatrix();
}, THREE.OrthographicCamera.prototype = Object.create(THREE.Camera.prototype), THREE.OrthographicCamera.prototype.updateProjectionMatrix = function() {
    this.projectionMatrix.makeOrthographic(this.left, this.right, this.top, this.bottom, this.near, this.far);
}, THREE.OrthographicCamera.prototype.clone = function() {
    var camera = new THREE.OrthographicCamera();
    return THREE.Camera.prototype.clone.call(this, camera), camera.left = this.left, 
    camera.right = this.right, camera.top = this.top, camera.bottom = this.bottom, camera.near = this.near, 
    camera.far = this.far, camera;
}, THREE.PerspectiveCamera = function(fov, aspect, near, far) {
    THREE.Camera.call(this), this.fov = void 0 !== fov ? fov : 50, this.aspect = void 0 !== aspect ? aspect : 1, 
    this.near = void 0 !== near ? near : .1, this.far = void 0 !== far ? far : 2e3, 
    this.updateProjectionMatrix();
}, THREE.PerspectiveCamera.prototype = Object.create(THREE.Camera.prototype), THREE.PerspectiveCamera.prototype.setLens = function(focalLength, frameHeight) {
    void 0 === frameHeight && (frameHeight = 24), this.fov = 2 * THREE.Math.radToDeg(Math.atan(frameHeight / (2 * focalLength))), 
    this.updateProjectionMatrix();
}, THREE.PerspectiveCamera.prototype.setViewOffset = function(fullWidth, fullHeight, x, y, width, height) {
    this.fullWidth = fullWidth, this.fullHeight = fullHeight, this.x = x, this.y = y, 
    this.width = width, this.height = height, this.updateProjectionMatrix();
}, THREE.PerspectiveCamera.prototype.updateProjectionMatrix = function() {
    if (this.fullWidth) {
        var aspect = this.fullWidth / this.fullHeight, top = Math.tan(THREE.Math.degToRad(.5 * this.fov)) * this.near, bottom = -top, left = aspect * bottom, right = aspect * top, width = Math.abs(right - left), height = Math.abs(top - bottom);
        this.projectionMatrix.makeFrustum(left + this.x * width / this.fullWidth, left + (this.x + this.width) * width / this.fullWidth, top - (this.y + this.height) * height / this.fullHeight, top - this.y * height / this.fullHeight, this.near, this.far);
    } else this.projectionMatrix.makePerspective(this.fov, this.aspect, this.near, this.far);
}, THREE.PerspectiveCamera.prototype.clone = function() {
    var camera = new THREE.PerspectiveCamera();
    return THREE.Camera.prototype.clone.call(this, camera), camera.fov = this.fov, camera.aspect = this.aspect, 
    camera.near = this.near, camera.far = this.far, camera;
}, THREE.Light = function(color) {
    THREE.Object3D.call(this), this.color = new THREE.Color(color);
}, THREE.Light.prototype = Object.create(THREE.Object3D.prototype), THREE.Light.prototype.clone = function(light) {
    return void 0 === light && (light = new THREE.Light()), THREE.Object3D.prototype.clone.call(this, light), 
    light.color.copy(this.color), light;
}, THREE.AmbientLight = function(color) {
    THREE.Light.call(this, color);
}, THREE.AmbientLight.prototype = Object.create(THREE.Light.prototype), THREE.AmbientLight.prototype.clone = function() {
    var light = new THREE.AmbientLight();
    return THREE.Light.prototype.clone.call(this, light), light;
}, THREE.AreaLight = function(color, intensity) {
    THREE.Light.call(this, color), this.normal = new THREE.Vector3(0, -1, 0), this.right = new THREE.Vector3(1, 0, 0), 
    this.intensity = void 0 !== intensity ? intensity : 1, this.width = 1, this.height = 1, 
    this.constantAttenuation = 1.5, this.linearAttenuation = .5, this.quadraticAttenuation = .1;
}, THREE.AreaLight.prototype = Object.create(THREE.Light.prototype), THREE.DirectionalLight = function(color, intensity) {
    THREE.Light.call(this, color), this.position.set(0, 1, 0), this.target = new THREE.Object3D(), 
    this.intensity = void 0 !== intensity ? intensity : 1, this.castShadow = !1, this.onlyShadow = !1, 
    this.shadowCameraNear = 50, this.shadowCameraFar = 5e3, this.shadowCameraLeft = -500, 
    this.shadowCameraRight = 500, this.shadowCameraTop = 500, this.shadowCameraBottom = -500, 
    this.shadowCameraVisible = !1, this.shadowBias = 0, this.shadowDarkness = .5, this.shadowMapWidth = 512, 
    this.shadowMapHeight = 512, this.shadowCascade = !1, this.shadowCascadeOffset = new THREE.Vector3(0, 0, -1e3), 
    this.shadowCascadeCount = 2, this.shadowCascadeBias = [ 0, 0, 0 ], this.shadowCascadeWidth = [ 512, 512, 512 ], 
    this.shadowCascadeHeight = [ 512, 512, 512 ], this.shadowCascadeNearZ = [ -1, .99, .998 ], 
    this.shadowCascadeFarZ = [ .99, .998, 1 ], this.shadowCascadeArray = [], this.shadowMap = null, 
    this.shadowMapSize = null, this.shadowCamera = null, this.shadowMatrix = null;
}, THREE.DirectionalLight.prototype = Object.create(THREE.Light.prototype), THREE.DirectionalLight.prototype.clone = function() {
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
    THREE.Light.call(this, skyColor), this.position.set(0, 100, 0), this.groundColor = new THREE.Color(groundColor), 
    this.intensity = void 0 !== intensity ? intensity : 1;
}, THREE.HemisphereLight.prototype = Object.create(THREE.Light.prototype), THREE.HemisphereLight.prototype.clone = function() {
    var light = new THREE.HemisphereLight();
    return THREE.Light.prototype.clone.call(this, light), light.groundColor.copy(this.groundColor), 
    light.intensity = this.intensity, light;
}, THREE.PointLight = function(color, intensity, distance) {
    THREE.Light.call(this, color), this.intensity = void 0 !== intensity ? intensity : 1, 
    this.distance = void 0 !== distance ? distance : 0;
}, THREE.PointLight.prototype = Object.create(THREE.Light.prototype), THREE.PointLight.prototype.clone = function() {
    var light = new THREE.PointLight();
    return THREE.Light.prototype.clone.call(this, light), light.intensity = this.intensity, 
    light.distance = this.distance, light;
}, THREE.SpotLight = function(color, intensity, distance, angle, exponent) {
    THREE.Light.call(this, color), this.position.set(0, 1, 0), this.target = new THREE.Object3D(), 
    this.intensity = void 0 !== intensity ? intensity : 1, this.distance = void 0 !== distance ? distance : 0, 
    this.angle = void 0 !== angle ? angle : Math.PI / 3, this.exponent = void 0 !== exponent ? exponent : 10, 
    this.castShadow = !1, this.onlyShadow = !1, this.shadowCameraNear = 50, this.shadowCameraFar = 5e3, 
    this.shadowCameraFov = 50, this.shadowCameraVisible = !1, this.shadowBias = 0, this.shadowDarkness = .5, 
    this.shadowMapWidth = 512, this.shadowMapHeight = 512, this.shadowMap = null, this.shadowMapSize = null, 
    this.shadowCamera = null, this.shadowMatrix = null;
}, THREE.SpotLight.prototype = Object.create(THREE.Light.prototype), THREE.SpotLight.prototype.clone = function() {
    var light = new THREE.SpotLight();
    return THREE.Light.prototype.clone.call(this, light), light.target = this.target.clone(), 
    light.intensity = this.intensity, light.distance = this.distance, light.angle = this.angle, 
    light.exponent = this.exponent, light.castShadow = this.castShadow, light.onlyShadow = this.onlyShadow, 
    light.shadowCameraNear = this.shadowCameraNear, light.shadowCameraFar = this.shadowCameraFar, 
    light.shadowCameraFov = this.shadowCameraFov, light.shadowCameraVisible = this.shadowCameraVisible, 
    light.shadowBias = this.shadowBias, light.shadowDarkness = this.shadowDarkness, 
    light.shadowMapWidth = this.shadowMapWidth, light.shadowMapHeight = this.shadowMapHeight, 
    light;
}, THREE.Cache = function() {
    this.files = {};
}, THREE.Cache.prototype = {
    constructor: THREE.Cache,
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
        if (void 0 !== m.blending && void 0 !== THREE[m.blending] && (mpars.blending = THREE[m.blending]), 
        (void 0 !== m.transparent || m.opacity < 1) && (mpars.transparent = m.transparent), 
        void 0 !== m.depthTest && (mpars.depthTest = m.depthTest), void 0 !== m.depthWrite && (mpars.depthWrite = m.depthWrite), 
        void 0 !== m.visible && (mpars.visible = m.visible), void 0 !== m.flipSided && (mpars.side = THREE.BackSide), 
        void 0 !== m.doubleSided && (mpars.side = THREE.DoubleSide), void 0 !== m.wireframe && (mpars.wireframe = m.wireframe), 
        void 0 !== m.vertexColors && ("face" === m.vertexColors ? mpars.vertexColors = THREE.FaceColors : m.vertexColors && (mpars.vertexColors = THREE.VertexColors)), 
        m.colorDiffuse ? mpars.color = rgb2hex(m.colorDiffuse) : m.DbgColor && (mpars.color = m.DbgColor), 
        m.colorSpecular && (mpars.specular = rgb2hex(m.colorSpecular)), m.colorAmbient && (mpars.ambient = rgb2hex(m.colorAmbient)), 
        m.colorEmissive && (mpars.emissive = rgb2hex(m.colorEmissive)), m.transparency && (mpars.opacity = m.transparency), 
        m.specularCoef && (mpars.shininess = m.specularCoef), m.mapDiffuse && texturePath && create_texture(mpars, "map", m.mapDiffuse, m.mapDiffuseRepeat, m.mapDiffuseOffset, m.mapDiffuseWrap, m.mapDiffuseAnisotropy), 
        m.mapLight && texturePath && create_texture(mpars, "lightMap", m.mapLight, m.mapLightRepeat, m.mapLightOffset, m.mapLightWrap, m.mapLightAnisotropy), 
        m.mapBump && texturePath && create_texture(mpars, "bumpMap", m.mapBump, m.mapBumpRepeat, m.mapBumpOffset, m.mapBumpWrap, m.mapBumpAnisotropy), 
        m.mapNormal && texturePath && create_texture(mpars, "normalMap", m.mapNormal, m.mapNormalRepeat, m.mapNormalOffset, m.mapNormalWrap, m.mapNormalAnisotropy), 
        m.mapSpecular && texturePath && create_texture(mpars, "specularMap", m.mapSpecular, m.mapSpecularRepeat, m.mapSpecularOffset, m.mapSpecularWrap, m.mapSpecularAnisotropy), 
        m.mapAlpha && texturePath && create_texture(mpars, "alphaMap", m.mapAlpha, m.mapAlphaRepeat, m.mapAlphaOffset, m.mapAlphaWrap, m.mapAlphaAnisotropy), 
        m.mapBumpScale && (mpars.bumpScale = m.mapBumpScale), m.mapNormal) {
            var shader = THREE.ShaderLib.normalmap, uniforms = THREE.UniformsUtils.clone(shader.uniforms);
            uniforms.tNormal.value = mpars.normalMap, m.mapNormalFactor && uniforms.uNormalScale.value.set(m.mapNormalFactor, m.mapNormalFactor), 
            mpars.map && (uniforms.tDiffuse.value = mpars.map, uniforms.enableDiffuse.value = !0), 
            mpars.specularMap && (uniforms.tSpecular.value = mpars.specularMap, uniforms.enableSpecular.value = !0), 
            mpars.lightMap && (uniforms.tAO.value = mpars.lightMap, uniforms.enableAO.value = !0), 
            uniforms.diffuse.value.setHex(mpars.color), uniforms.specular.value.setHex(mpars.specular), 
            uniforms.ambient.value.setHex(mpars.ambient), uniforms.shininess.value = mpars.shininess, 
            void 0 !== mpars.opacity && (uniforms.opacity.value = mpars.opacity);
            var parameters = {
                fragmentShader: shader.fragmentShader,
                vertexShader: shader.vertexShader,
                uniforms: uniforms,
                lights: !0,
                fog: !0
            }, material = new THREE.ShaderMaterial(parameters);
            mpars.transparent && (material.transparent = !0);
        } else var material = new THREE[mtype](mpars);
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
    this.cache = new THREE.Cache(), this.manager = void 0 !== manager ? manager : THREE.DefaultLoadingManager;
}, THREE.XHRLoader.prototype = {
    constructor: THREE.XHRLoader,
    load: function(url, onLoad, onProgress, onError) {
        var scope = this, cached = scope.cache.get(url);
        if (void 0 !== cached) return void (onLoad && onLoad(cached));
        var request = new XMLHttpRequest();
        request.open("GET", url, !0), request.addEventListener("load", function() {
            scope.cache.add(url, this.response), onLoad && onLoad(this.response), scope.manager.itemEnd(url);
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
    this.cache = new THREE.Cache(), this.manager = void 0 !== manager ? manager : THREE.DefaultLoadingManager;
}, THREE.ImageLoader.prototype = {
    constructor: THREE.ImageLoader,
    load: function(url, onLoad, onProgress, onError) {
        var scope = this, cached = scope.cache.get(url);
        if (void 0 !== cached) return void onLoad(cached);
        var image = document.createElement("img");
        return void 0 !== onLoad && image.addEventListener("load", function() {
            scope.cache.add(url, this), onLoad(this), scope.manager.itemEnd(url);
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
}, THREE.JSONLoader.prototype = Object.create(THREE.Loader.prototype), THREE.JSONLoader.prototype.load = function(url, callback, texturePath) {
    texturePath = texturePath && "string" == typeof texturePath ? texturePath : this.extractUrlBase(url), 
    this.onLoadStart(), this.loadAjaxJSON(this, url, callback, texturePath);
}, THREE.JSONLoader.prototype.loadAjaxJSON = function(context, url, callback, texturePath, callbackProgress) {
    var xhr = new XMLHttpRequest(), length = 0;
    xhr.onreadystatechange = function() {
        if (xhr.readyState === xhr.DONE) if (200 === xhr.status || 0 === xhr.status) {
            if (xhr.responseText) {
                var json = JSON.parse(xhr.responseText);
                if (void 0 !== json.metadata && "scene" === json.metadata.type) return void console.error('THREE.JSONLoader: "' + url + '" seems to be a Scene. Use THREE.SceneLoader instead.');
                var result = context.parse(json, texturePath);
                callback(result.geometry, result.materials);
            } else console.error('THREE.JSONLoader: "' + url + '" seems to be unreachable or the file is empty.');
            context.onLoadComplete();
        } else console.error("THREE.JSONLoader: Couldn't load \"" + url + '" (' + xhr.status + ")"); else xhr.readyState === xhr.LOADING ? callbackProgress && (0 === length && (length = xhr.getResponseHeader("Content-Length")), 
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
        geometry.bones = json.bones, geometry.bones && geometry.bones.length > 0 && (geometry.skinWeights.length !== geometry.skinIndices.length || geometry.skinIndices.length !== geometry.vertices.length) && console.warn("When skinning, number of vertices (" + geometry.vertices.length + "), skinIndices (" + geometry.skinIndices.length + "), and skinWeights (" + geometry.skinWeights.length + ") should match."), 
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
    this.onLoad = onLoad, this.onProgress = onProgress, this.onError = onError, this.itemStart = function() {
        total++;
    }, this.itemEnd = function(url) {
        loaded++, void 0 !== scope.onProgress && scope.onProgress(url, loaded, total), loaded === total && void 0 !== scope.onLoad && scope.onLoad();
    };
}, THREE.DefaultLoadingManager = new THREE.LoadingManager(), THREE.BufferGeometryLoader = function(manager) {
    this.manager = void 0 !== manager ? manager : THREE.DefaultLoadingManager;
}, THREE.BufferGeometryLoader.prototype = {
    constructor: THREE.BufferGeometryLoader,
    load: function(url, onLoad, onProgress, onError) {
        var scope = this, loader = new THREE.XHRLoader();
        loader.setCrossOrigin(this.crossOrigin), loader.load(url, function(text) {
            onLoad(scope.parse(JSON.parse(text)));
        }, onProgress, onError);
    },
    setCrossOrigin: function(value) {
        this.crossOrigin = value;
    },
    parse: function(json) {
        var geometry = new THREE.BufferGeometry(), attributes = json.attributes;
        for (var key in attributes) {
            var attribute = attributes[key];
            geometry.attributes[key] = {
                itemSize: attribute.itemSize,
                array: new self[attribute.type](attribute.array)
            };
        }
        var offsets = json.offsets;
        void 0 !== offsets && (geometry.offsets = JSON.parse(JSON.stringify(offsets)));
        var boundingSphere = json.boundingSphere;
        return void 0 !== boundingSphere && (geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3().fromArray(void 0 !== boundingSphere.center ? boundingSphere.center : [ 0, 0, 0 ]), boundingSphere.radius)), 
        geometry;
    }
}, THREE.MaterialLoader = function(manager) {
    this.manager = void 0 !== manager ? manager : THREE.DefaultLoadingManager;
}, THREE.MaterialLoader.prototype = {
    constructor: THREE.MaterialLoader,
    load: function(url, onLoad, onProgress, onError) {
        var scope = this, loader = new THREE.XHRLoader();
        loader.setCrossOrigin(this.crossOrigin), loader.load(url, function(text) {
            onLoad(scope.parse(JSON.parse(text)));
        }, onProgress, onError);
    },
    setCrossOrigin: function(value) {
        this.crossOrigin = value;
    },
    parse: function(json) {
        var material = new THREE[json.type]();
        if (void 0 !== json.color && material.color.setHex(json.color), void 0 !== json.ambient && material.ambient.setHex(json.ambient), 
        void 0 !== json.emissive && material.emissive.setHex(json.emissive), void 0 !== json.specular && material.specular.setHex(json.specular), 
        void 0 !== json.shininess && (material.shininess = json.shininess), void 0 !== json.uniforms && (material.uniforms = json.uniforms), 
        void 0 !== json.vertexShader && (material.vertexShader = json.vertexShader), void 0 !== json.fragmentShader && (material.fragmentShader = json.fragmentShader), 
        void 0 !== json.vertexColors && (material.vertexColors = json.vertexColors), void 0 !== json.blending && (material.blending = json.blending), 
        void 0 !== json.side && (material.side = json.side), void 0 !== json.opacity && (material.opacity = json.opacity), 
        void 0 !== json.transparent && (material.transparent = json.transparent), void 0 !== json.wireframe && (material.wireframe = json.wireframe), 
        void 0 !== json.materials) for (var i = 0, l = json.materials.length; l > i; i++) material.materials.push(this.parse(json.materials[i]));
        return material;
    }
}, THREE.ObjectLoader = function(manager) {
    this.manager = void 0 !== manager ? manager : THREE.DefaultLoadingManager;
}, THREE.ObjectLoader.prototype = {
    constructor: THREE.ObjectLoader,
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
        var geometries = this.parseGeometries(json.geometries), materials = this.parseMaterials(json.materials), object = this.parseObject(json.object, geometries, materials);
        return object;
    },
    parseGeometries: function(json) {
        var geometries = {};
        if (void 0 !== json) for (var geometryLoader = new THREE.JSONLoader(), bufferGeometryLoader = new THREE.BufferGeometryLoader(), i = 0, l = json.length; l > i; i++) {
            var geometry, data = json[i];
            switch (data.type) {
              case "PlaneGeometry":
                geometry = new THREE.PlaneGeometry(data.width, data.height, data.widthSegments, data.heightSegments);
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
                geometry = bufferGeometryLoader.parse(data.data);
                break;

              case "Geometry":
                geometry = geometryLoader.parse(data.data).geometry;
            }
            geometry.uuid = data.uuid, void 0 !== data.name && (geometry.name = data.name), 
            geometries[data.uuid] = geometry;
        }
        return geometries;
    },
    parseMaterials: function(json) {
        var materials = {};
        if (void 0 !== json) for (var loader = new THREE.MaterialLoader(), i = 0, l = json.length; l > i; i++) {
            var data = json[i], material = loader.parse(data);
            material.uuid = data.uuid, void 0 !== data.name && (material.name = data.name), 
            materials[data.uuid] = material;
        }
        return materials;
    },
    parseObject: function() {
        var matrix = new THREE.Matrix4();
        return function(data, geometries, materials) {
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
                object = new THREE.PointLight(data.color, data.intensity, data.distance);
                break;

              case "SpotLight":
                object = new THREE.SpotLight(data.color, data.intensity, data.distance, data.angle, data.exponent);
                break;

              case "HemisphereLight":
                object = new THREE.HemisphereLight(data.color, data.groundColor, data.intensity);
                break;

              case "Mesh":
                var geometry = geometries[data.geometry], material = materials[data.material];
                void 0 === geometry && console.error("THREE.ObjectLoader: Undefined geometry " + data.geometry), 
                void 0 === material && console.error("THREE.ObjectLoader: Undefined material " + data.material), 
                object = new THREE.Mesh(geometry, material);
                break;

              case "Sprite":
                var material = materials[data.material];
                void 0 === material && console.error("THREE.ObjectLoader: Undefined material " + data.material), 
                object = new THREE.Sprite(material);
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
}, THREE.Material = function() {
    this.id = THREE.MaterialIdCount++, this.uuid = THREE.Math.generateUUID(), this.name = "", 
    this.side = THREE.FrontSide, this.opacity = 1, this.transparent = !1, this.blending = THREE.NormalBlending, 
    this.blendSrc = THREE.SrcAlphaFactor, this.blendDst = THREE.OneMinusSrcAlphaFactor, 
    this.blendEquation = THREE.AddEquation, this.depthTest = !0, this.depthWrite = !0, 
    this.polygonOffset = !1, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, 
    this.alphaTest = 0, this.overdraw = 0, this.visible = !0, this.needsUpdate = !0;
}, THREE.Material.prototype = {
    constructor: THREE.Material,
    setValues: function(values) {
        if (void 0 !== values) for (var key in values) {
            var newValue = values[key];
            if (void 0 !== newValue) {
                if (key in this) {
                    var currentValue = this[key];
                    currentValue instanceof THREE.Color ? currentValue.set(newValue) : currentValue instanceof THREE.Vector3 && newValue instanceof THREE.Vector3 ? currentValue.copy(newValue) : this[key] = "overdraw" == key ? Number(newValue) : newValue;
                }
            } else console.warn("THREE.Material: '" + key + "' parameter is undefined.");
        }
    },
    clone: function(material) {
        return void 0 === material && (material = new THREE.Material()), material.name = this.name, 
        material.side = this.side, material.opacity = this.opacity, material.transparent = this.transparent, 
        material.blending = this.blending, material.blendSrc = this.blendSrc, material.blendDst = this.blendDst, 
        material.blendEquation = this.blendEquation, material.depthTest = this.depthTest, 
        material.depthWrite = this.depthWrite, material.polygonOffset = this.polygonOffset, 
        material.polygonOffsetFactor = this.polygonOffsetFactor, material.polygonOffsetUnits = this.polygonOffsetUnits, 
        material.alphaTest = this.alphaTest, material.overdraw = this.overdraw, material.visible = this.visible, 
        material;
    },
    dispose: function() {
        this.dispatchEvent({
            type: "dispose"
        });
    }
}, THREE.EventDispatcher.prototype.apply(THREE.Material.prototype), THREE.MaterialIdCount = 0, 
THREE.LineBasicMaterial = function(parameters) {
    THREE.Material.call(this), this.color = new THREE.Color(16777215), this.linewidth = 1, 
    this.linecap = "round", this.linejoin = "round", this.vertexColors = THREE.NoColors, 
    this.fog = !0, this.setValues(parameters);
}, THREE.LineBasicMaterial.prototype = Object.create(THREE.Material.prototype), 
THREE.LineBasicMaterial.prototype.clone = function() {
    var material = new THREE.LineBasicMaterial();
    return THREE.Material.prototype.clone.call(this, material), material.color.copy(this.color), 
    material.linewidth = this.linewidth, material.linecap = this.linecap, material.linejoin = this.linejoin, 
    material.vertexColors = this.vertexColors, material.fog = this.fog, material;
}, THREE.LineDashedMaterial = function(parameters) {
    THREE.Material.call(this), this.color = new THREE.Color(16777215), this.linewidth = 1, 
    this.scale = 1, this.dashSize = 3, this.gapSize = 1, this.vertexColors = !1, this.fog = !0, 
    this.setValues(parameters);
}, THREE.LineDashedMaterial.prototype = Object.create(THREE.Material.prototype), 
THREE.LineDashedMaterial.prototype.clone = function() {
    var material = new THREE.LineDashedMaterial();
    return THREE.Material.prototype.clone.call(this, material), material.color.copy(this.color), 
    material.linewidth = this.linewidth, material.scale = this.scale, material.dashSize = this.dashSize, 
    material.gapSize = this.gapSize, material.vertexColors = this.vertexColors, material.fog = this.fog, 
    material;
}, THREE.MeshBasicMaterial = function(parameters) {
    THREE.Material.call(this), this.color = new THREE.Color(16777215), this.map = null, 
    this.lightMap = null, this.specularMap = null, this.alphaMap = null, this.envMap = null, 
    this.combine = THREE.MultiplyOperation, this.reflectivity = 1, this.refractionRatio = .98, 
    this.fog = !0, this.shading = THREE.SmoothShading, this.wireframe = !1, this.wireframeLinewidth = 1, 
    this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.vertexColors = THREE.NoColors, 
    this.skinning = !1, this.morphTargets = !1, this.setValues(parameters);
}, THREE.MeshBasicMaterial.prototype = Object.create(THREE.Material.prototype), 
THREE.MeshBasicMaterial.prototype.clone = function() {
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
    THREE.Material.call(this), this.color = new THREE.Color(16777215), this.ambient = new THREE.Color(16777215), 
    this.emissive = new THREE.Color(0), this.wrapAround = !1, this.wrapRGB = new THREE.Vector3(1, 1, 1), 
    this.map = null, this.lightMap = null, this.specularMap = null, this.alphaMap = null, 
    this.envMap = null, this.combine = THREE.MultiplyOperation, this.reflectivity = 1, 
    this.refractionRatio = .98, this.fog = !0, this.shading = THREE.SmoothShading, this.wireframe = !1, 
    this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", 
    this.vertexColors = THREE.NoColors, this.skinning = !1, this.morphTargets = !1, 
    this.morphNormals = !1, this.setValues(parameters);
}, THREE.MeshLambertMaterial.prototype = Object.create(THREE.Material.prototype), 
THREE.MeshLambertMaterial.prototype.clone = function() {
    var material = new THREE.MeshLambertMaterial();
    return THREE.Material.prototype.clone.call(this, material), material.color.copy(this.color), 
    material.ambient.copy(this.ambient), material.emissive.copy(this.emissive), material.wrapAround = this.wrapAround, 
    material.wrapRGB.copy(this.wrapRGB), material.map = this.map, material.lightMap = this.lightMap, 
    material.specularMap = this.specularMap, material.alphaMap = this.alphaMap, material.envMap = this.envMap, 
    material.combine = this.combine, material.reflectivity = this.reflectivity, material.refractionRatio = this.refractionRatio, 
    material.fog = this.fog, material.shading = this.shading, material.wireframe = this.wireframe, 
    material.wireframeLinewidth = this.wireframeLinewidth, material.wireframeLinecap = this.wireframeLinecap, 
    material.wireframeLinejoin = this.wireframeLinejoin, material.vertexColors = this.vertexColors, 
    material.skinning = this.skinning, material.morphTargets = this.morphTargets, material.morphNormals = this.morphNormals, 
    material;
}, THREE.MeshPhongMaterial = function(parameters) {
    THREE.Material.call(this), this.color = new THREE.Color(16777215), this.ambient = new THREE.Color(16777215), 
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
THREE.MeshPhongMaterial.prototype.clone = function() {
    var material = new THREE.MeshPhongMaterial();
    return THREE.Material.prototype.clone.call(this, material), material.color.copy(this.color), 
    material.ambient.copy(this.ambient), material.emissive.copy(this.emissive), material.specular.copy(this.specular), 
    material.shininess = this.shininess, material.metal = this.metal, material.wrapAround = this.wrapAround, 
    material.wrapRGB.copy(this.wrapRGB), material.map = this.map, material.lightMap = this.lightMap, 
    material.bumpMap = this.bumpMap, material.bumpScale = this.bumpScale, material.normalMap = this.normalMap, 
    material.normalScale.copy(this.normalScale), material.specularMap = this.specularMap, 
    material.alphaMap = this.alphaMap, material.envMap = this.envMap, material.combine = this.combine, 
    material.reflectivity = this.reflectivity, material.refractionRatio = this.refractionRatio, 
    material.fog = this.fog, material.shading = this.shading, material.wireframe = this.wireframe, 
    material.wireframeLinewidth = this.wireframeLinewidth, material.wireframeLinecap = this.wireframeLinecap, 
    material.wireframeLinejoin = this.wireframeLinejoin, material.vertexColors = this.vertexColors, 
    material.skinning = this.skinning, material.morphTargets = this.morphTargets, material.morphNormals = this.morphNormals, 
    material;
}, THREE.MeshDepthMaterial = function(parameters) {
    THREE.Material.call(this), this.morphTargets = !1, this.wireframe = !1, this.wireframeLinewidth = 1, 
    this.setValues(parameters);
}, THREE.MeshDepthMaterial.prototype = Object.create(THREE.Material.prototype), 
THREE.MeshDepthMaterial.prototype.clone = function() {
    var material = new THREE.MeshDepthMaterial();
    return THREE.Material.prototype.clone.call(this, material), material.wireframe = this.wireframe, 
    material.wireframeLinewidth = this.wireframeLinewidth, material;
}, THREE.MeshNormalMaterial = function(parameters) {
    THREE.Material.call(this, parameters), this.shading = THREE.FlatShading, this.wireframe = !1, 
    this.wireframeLinewidth = 1, this.morphTargets = !1, this.setValues(parameters);
}, THREE.MeshNormalMaterial.prototype = Object.create(THREE.Material.prototype), 
THREE.MeshNormalMaterial.prototype.clone = function() {
    var material = new THREE.MeshNormalMaterial();
    return THREE.Material.prototype.clone.call(this, material), material.shading = this.shading, 
    material.wireframe = this.wireframe, material.wireframeLinewidth = this.wireframeLinewidth, 
    material;
}, THREE.MeshFaceMaterial = function(materials) {
    this.materials = materials instanceof Array ? materials : [];
}, THREE.MeshFaceMaterial.prototype.clone = function() {
    for (var material = new THREE.MeshFaceMaterial(), i = 0; i < this.materials.length; i++) material.materials.push(this.materials[i].clone());
    return material;
}, THREE.PointCloudMaterial = function(parameters) {
    THREE.Material.call(this), this.color = new THREE.Color(16777215), this.map = null, 
    this.size = 1, this.sizeAttenuation = !0, this.vertexColors = THREE.NoColors, this.fog = !0, 
    this.setValues(parameters);
}, THREE.PointCloudMaterial.prototype = Object.create(THREE.Material.prototype), 
THREE.PointCloudMaterial.prototype.clone = function() {
    var material = new THREE.PointCloudMaterial();
    return THREE.Material.prototype.clone.call(this, material), material.color.copy(this.color), 
    material.map = this.map, material.size = this.size, material.sizeAttenuation = this.sizeAttenuation, 
    material.vertexColors = this.vertexColors, material.fog = this.fog, material;
}, THREE.ParticleBasicMaterial = function(parameters) {
    return console.warn("THREE.ParticleBasicMaterial has been renamed to THREE.PointCloudMaterial."), 
    new THREE.PointCloudMaterial(parameters);
}, THREE.ParticleSystemMaterial = function(parameters) {
    return console.warn("THREE.ParticleSystemMaterial has been renamed to THREE.PointCloudMaterial."), 
    new THREE.PointCloudMaterial(parameters);
}, THREE.ShaderMaterial = function(parameters) {
    THREE.Material.call(this), this.defines = {}, this.uniforms = {}, this.attributes = null, 
    this.vertexShader = "void main() {\n	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}", 
    this.fragmentShader = "void main() {\n	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}", 
    this.shading = THREE.SmoothShading, this.linewidth = 1, this.wireframe = !1, this.wireframeLinewidth = 1, 
    this.fog = !1, this.lights = !1, this.vertexColors = THREE.NoColors, this.skinning = !1, 
    this.morphTargets = !1, this.morphNormals = !1, this.defaultAttributeValues = {
        color: [ 1, 1, 1 ],
        uv: [ 0, 0 ],
        uv2: [ 0, 0 ]
    }, this.index0AttributeName = void 0, this.setValues(parameters);
}, THREE.ShaderMaterial.prototype = Object.create(THREE.Material.prototype), THREE.ShaderMaterial.prototype.clone = function() {
    var material = new THREE.ShaderMaterial();
    return THREE.Material.prototype.clone.call(this, material), material.fragmentShader = this.fragmentShader, 
    material.vertexShader = this.vertexShader, material.uniforms = THREE.UniformsUtils.clone(this.uniforms), 
    material.attributes = this.attributes, material.defines = this.defines, material.shading = this.shading, 
    material.wireframe = this.wireframe, material.wireframeLinewidth = this.wireframeLinewidth, 
    material.fog = this.fog, material.lights = this.lights, material.vertexColors = this.vertexColors, 
    material.skinning = this.skinning, material.morphTargets = this.morphTargets, material.morphNormals = this.morphNormals, 
    material;
}, THREE.RawShaderMaterial = function(parameters) {
    THREE.ShaderMaterial.call(this, parameters);
}, THREE.RawShaderMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype), 
THREE.RawShaderMaterial.prototype.clone = function() {
    var material = new THREE.RawShaderMaterial();
    return THREE.ShaderMaterial.prototype.clone.call(this, material), material;
}, THREE.SpriteMaterial = function(parameters) {
    THREE.Material.call(this), this.color = new THREE.Color(16777215), this.map = null, 
    this.rotation = 0, this.fog = !1, this.setValues(parameters);
}, THREE.SpriteMaterial.prototype = Object.create(THREE.Material.prototype), THREE.SpriteMaterial.prototype.clone = function() {
    var material = new THREE.SpriteMaterial();
    return THREE.Material.prototype.clone.call(this, material), material.color.copy(this.color), 
    material.map = this.map, material.rotation = this.rotation, material.fog = this.fog, 
    material;
}, THREE.SpriteCanvasMaterial = function(parameters) {
    THREE.Material.call(this), this.color = new THREE.Color(16777215), this.program = function() {}, 
    this.setValues(parameters);
}, THREE.SpriteCanvasMaterial.prototype = Object.create(THREE.Material.prototype), 
THREE.SpriteCanvasMaterial.prototype.clone = function() {
    var material = new THREE.SpriteCanvasMaterial();
    return THREE.Material.prototype.clone.call(this, material), material.color.copy(this.color), 
    material.program = this.program, material;
}, THREE.ParticleCanvasMaterial = THREE.SpriteCanvasMaterial, THREE.Texture = function(image, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy) {
    this.id = THREE.TextureIdCount++, this.uuid = THREE.Math.generateUUID(), this.name = "", 
    this.image = void 0 !== image ? image : THREE.Texture.DEFAULT_IMAGE, this.mipmaps = [], 
    this.mapping = void 0 !== mapping ? mapping : THREE.Texture.DEFAULT_MAPPING, this.wrapS = void 0 !== wrapS ? wrapS : THREE.ClampToEdgeWrapping, 
    this.wrapT = void 0 !== wrapT ? wrapT : THREE.ClampToEdgeWrapping, this.magFilter = void 0 !== magFilter ? magFilter : THREE.LinearFilter, 
    this.minFilter = void 0 !== minFilter ? minFilter : THREE.LinearMipMapLinearFilter, 
    this.anisotropy = void 0 !== anisotropy ? anisotropy : 1, this.format = void 0 !== format ? format : THREE.RGBAFormat, 
    this.type = void 0 !== type ? type : THREE.UnsignedByteType, this.offset = new THREE.Vector2(0, 0), 
    this.repeat = new THREE.Vector2(1, 1), this.generateMipmaps = !0, this.premultiplyAlpha = !1, 
    this.flipY = !0, this.unpackAlignment = 4, this._needsUpdate = !1, this.onUpdate = null;
}, THREE.Texture.DEFAULT_IMAGE = void 0, THREE.Texture.DEFAULT_MAPPING = new THREE.UVMapping(), 
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
    THREE.Texture.call(this, images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy), 
    this.images = images;
}, THREE.CubeTexture.prototype = Object.create(THREE.Texture.prototype), THREE.CubeTexture.clone = function(texture) {
    return void 0 === texture && (texture = new THREE.CubeTexture()), THREE.Texture.prototype.clone.call(this, texture), 
    texture.images = this.images, texture;
}, THREE.CompressedTexture = function(mipmaps, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy) {
    THREE.Texture.call(this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy), 
    this.image = {
        width: width,
        height: height
    }, this.mipmaps = mipmaps, this.generateMipmaps = !1;
}, THREE.CompressedTexture.prototype = Object.create(THREE.Texture.prototype), THREE.CompressedTexture.prototype.clone = function() {
    var texture = new THREE.CompressedTexture();
    return THREE.Texture.prototype.clone.call(this, texture), texture;
}, THREE.DataTexture = function(data, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy) {
    THREE.Texture.call(this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy), 
    this.image = {
        data: data,
        width: width,
        height: height
    };
}, THREE.DataTexture.prototype = Object.create(THREE.Texture.prototype), THREE.DataTexture.prototype.clone = function() {
    var texture = new THREE.DataTexture();
    return THREE.Texture.prototype.clone.call(this, texture), texture;
}, THREE.PointCloud = function(geometry, material) {
    THREE.Object3D.call(this), this.geometry = void 0 !== geometry ? geometry : new THREE.Geometry(), 
    this.material = void 0 !== material ? material : new THREE.PointCloudMaterial({
        color: 16777215 * Math.random()
    }), this.sortParticles = !1;
}, THREE.PointCloud.prototype = Object.create(THREE.Object3D.prototype), THREE.PointCloud.prototype.raycast = function() {
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
                        position.set(positions[3 * a], positions[3 * a + 1], positions[3 * a + 2]), testPoint(position, a);
                    }
                } else for (var pointCount = positions.length / 3, i = 0; pointCount > i; i++) position.set(positions[3 * i], positions[3 * i + 1], positions[3 * i + 2]), 
                testPoint(position, i);
            } else for (var vertices = this.geometry.vertices, i = 0; i < vertices.length; i++) testPoint(vertices[i], i);
        }
    };
}(), THREE.PointCloud.prototype.clone = function(object) {
    return void 0 === object && (object = new THREE.PointCloud(this.geometry, this.material)), 
    object.sortParticles = this.sortParticles, THREE.Object3D.prototype.clone.call(this, object), 
    object;
}, THREE.ParticleSystem = function(geometry, material) {
    return console.warn("THREE.ParticleSystem has been renamed to THREE.PointCloud."), 
    new THREE.PointCloud(geometry, material);
}, THREE.Line = function(geometry, material, type) {
    THREE.Object3D.call(this), this.geometry = void 0 !== geometry ? geometry : new THREE.Geometry(), 
    this.material = void 0 !== material ? material : new THREE.LineBasicMaterial({
        color: 16777215 * Math.random()
    }), this.type = void 0 !== type ? type : THREE.LineStrip;
}, THREE.LineStrip = 0, THREE.LinePieces = 1, THREE.Line.prototype = Object.create(THREE.Object3D.prototype), 
THREE.Line.prototype.raycast = function() {
    var inverseMatrix = new THREE.Matrix4(), ray = new THREE.Ray(), sphere = new THREE.Sphere();
    return function(raycaster, intersects) {
        var precision = raycaster.linePrecision, precisionSq = precision * precision, geometry = this.geometry;
        if (null === geometry.boundingSphere && geometry.computeBoundingSphere(), sphere.copy(geometry.boundingSphere), 
        sphere.applyMatrix4(this.matrixWorld), raycaster.ray.isIntersectionSphere(sphere) !== !1 && (inverseMatrix.getInverse(this.matrixWorld), 
        ray.copy(raycaster.ray).applyMatrix4(inverseMatrix), geometry instanceof THREE.Geometry)) for (var vertices = geometry.vertices, nbVertices = vertices.length, interSegment = new THREE.Vector3(), interRay = new THREE.Vector3(), step = this.type === THREE.LineStrip ? 1 : 2, i = 0; nbVertices - 1 > i; i += step) {
            var distSq = ray.distanceSqToSegment(vertices[i], vertices[i + 1], interRay, interSegment);
            if (!(distSq > precisionSq)) {
                var distance = ray.origin.distanceTo(interRay);
                distance < raycaster.near || distance > raycaster.far || intersects.push({
                    distance: distance,
                    point: interSegment.clone().applyMatrix4(this.matrixWorld),
                    face: null,
                    faceIndex: null,
                    object: this
                });
            }
        }
    };
}(), THREE.Line.prototype.clone = function(object) {
    return void 0 === object && (object = new THREE.Line(this.geometry, this.material, this.type)), 
    THREE.Object3D.prototype.clone.call(this, object), object;
}, THREE.Mesh = function(geometry, material) {
    THREE.Object3D.call(this), this.geometry = void 0 !== geometry ? geometry : new THREE.Geometry(), 
    this.material = void 0 !== material ? material : new THREE.MeshBasicMaterial({
        color: 16777215 * Math.random()
    }), this.updateMorphTargets();
}, THREE.Mesh.prototype = Object.create(THREE.Object3D.prototype), THREE.Mesh.prototype.updateMorphTargets = function() {
    if (void 0 !== this.geometry.morphTargets && this.geometry.morphTargets.length > 0) {
        this.morphTargetBase = -1, this.morphTargetForcedOrder = [], this.morphTargetInfluences = [], 
        this.morphTargetDictionary = {};
        for (var m = 0, ml = this.geometry.morphTargets.length; ml > m; m++) this.morphTargetInfluences.push(0), 
        this.morphTargetDictionary[this.geometry.morphTargets[m].name] = m;
    }
}, THREE.Mesh.prototype.getMorphTargetIndexByName = function(name) {
    return void 0 !== this.morphTargetDictionary[name] ? this.morphTargetDictionary[name] : (console.log("THREE.Mesh.getMorphTargetIndexByName: morph target " + name + " does not exist. Returning 0."), 
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
                    vA.set(positions[3 * a], positions[3 * a + 1], positions[3 * a + 2]), vB.set(positions[3 * b], positions[3 * b + 1], positions[3 * b + 2]), 
                    vC.set(positions[3 * c], positions[3 * c + 1], positions[3 * c + 2]), material.side === THREE.BackSide) var intersectionPoint = ray.intersectTriangle(vC, vB, vA, !0); else var intersectionPoint = ray.intersectTriangle(vA, vB, vC, material.side !== THREE.DoubleSide);
                    if (null !== intersectionPoint) {
                        intersectionPoint.applyMatrix4(this.matrixWorld);
                        var distance = raycaster.ray.origin.distanceTo(intersectionPoint);
                        precision > distance || distance < raycaster.near || distance > raycaster.far || intersects.push({
                            distance: distance,
                            point: intersectionPoint,
                            indices: [ a, b, c ],
                            face: null,
                            faceIndex: null,
                            object: this
                        });
                    }
                }
            } else for (var positions = attributes.position.array, i = 0, j = 0, il = positions.length; il > i; i += 3, 
            j += 9) {
                if (a = i, b = i + 1, c = i + 2, vA.set(positions[j], positions[j + 1], positions[j + 2]), 
                vB.set(positions[j + 3], positions[j + 4], positions[j + 5]), vC.set(positions[j + 6], positions[j + 7], positions[j + 8]), 
                material.side === THREE.BackSide) var intersectionPoint = ray.intersectTriangle(vC, vB, vA, !0); else var intersectionPoint = ray.intersectTriangle(vA, vB, vC, material.side !== THREE.DoubleSide);
                if (null !== intersectionPoint) {
                    intersectionPoint.applyMatrix4(this.matrixWorld);
                    var distance = raycaster.ray.origin.distanceTo(intersectionPoint);
                    precision > distance || distance < raycaster.near || distance > raycaster.far || intersects.push({
                        distance: distance,
                        point: intersectionPoint,
                        indices: [ a, b, c ],
                        face: null,
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
}, THREE.Bone = function(belongsToSkin) {
    THREE.Object3D.call(this), this.skin = belongsToSkin, this.accumulatedRotWeight = 0, 
    this.accumulatedPosWeight = 0, this.accumulatedSclWeight = 0;
}, THREE.Bone.prototype = Object.create(THREE.Object3D.prototype), THREE.Bone.prototype.updateMatrixWorld = function(force) {
    THREE.Object3D.prototype.updateMatrixWorld.call(this, force), this.accumulatedRotWeight = 0, 
    this.accumulatedPosWeight = 0, this.accumulatedSclWeight = 0;
}, THREE.Skeleton = function(bones, boneInverses, useVertexTexture) {
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
    for (var offsetMatrix = new THREE.Matrix4(), b = 0, bl = this.bones.length; bl > b; b++) {
        var matrix = this.bones[b] ? this.bones[b].matrixWorld : this.identityMatrix;
        offsetMatrix.multiplyMatrices(matrix, this.boneInverses[b]), offsetMatrix.flattenToArrayOffset(this.boneMatrices, 16 * b);
    }
    this.useVertexTexture && (this.boneTexture.needsUpdate = !0);
}, THREE.SkinnedMesh = function(geometry, material, useVertexTexture) {
    THREE.Mesh.call(this, geometry, material), this.bindMode = "attached", this.bindMatrix = new THREE.Matrix4(), 
    this.bindMatrixInverse = new THREE.Matrix4();
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
}, THREE.SkinnedMesh.prototype = Object.create(THREE.Mesh.prototype), THREE.SkinnedMesh.prototype.bind = function(skeleton, bindMatrix) {
    this.skeleton = skeleton, void 0 === bindMatrix && (this.updateMatrixWorld(!0), 
    bindMatrix = this.matrixWorld), this.bindMatrix.copy(bindMatrix), this.bindMatrixInverse.getInverse(bindMatrix);
}, THREE.SkinnedMesh.prototype.pose = function() {
    this.skeleton.pose();
}, THREE.SkinnedMesh.prototype.normalizeSkinWeights = function() {
    if (this.geometry instanceof THREE.Geometry) for (var i = 0; i < this.geometry.skinIndices.length; i++) {
        var sw = this.geometry.skinWeights[i], scale = 1 / sw.lengthManhattan();
        scale !== 1 / 0 ? sw.multiplyScalar(scale) : sw.set(1);
    }
}, THREE.SkinnedMesh.prototype.updateMatrixWorld = function() {
    THREE.Mesh.prototype.updateMatrixWorld.call(this, !0), "attached" === this.bindMode ? this.bindMatrixInverse.getInverse(this.matrixWorld) : "detached" === this.bindMode ? this.bindMatrixInverse.getInverse(this.bindMatrix) : console.warn("THREE.SkinnedMesh unreckognized bindMode: " + this.bindMode);
}, THREE.SkinnedMesh.prototype.clone = function(object) {
    return void 0 === object && (object = new THREE.SkinnedMesh(this.geometry, this.material, this.useVertexTexture)), 
    THREE.Mesh.prototype.clone.call(this, object), object;
}, THREE.MorphAnimMesh = function(geometry, material) {
    THREE.Mesh.call(this, geometry, material), this.duration = 1e3, this.mirroredLoop = !1, 
    this.time = 0, this.lastKeyframe = 0, this.currentKeyframe = 0, this.direction = 1, 
    this.directionBackwards = !1, this.setFrameRange(0, this.geometry.morphTargets.length - 1);
}, THREE.MorphAnimMesh.prototype = Object.create(THREE.Mesh.prototype), THREE.MorphAnimMesh.prototype.setFrameRange = function(start, end) {
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
            {
                var label = parts[1];
                parts[2];
            }
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
    this.time = 0) : console.warn("animation[" + label + "] undefined");
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
}, THREE.LOD.prototype = Object.create(THREE.Object3D.prototype), THREE.LOD.prototype.addLevel = function(object, distance) {
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
    var vertices = new Float32Array([ -.5, -.5, 0, .5, -.5, 0, .5, .5, 0 ]), geometry = new THREE.BufferGeometry();
    return geometry.addAttribute("position", new THREE.BufferAttribute(vertices, 3)), 
    function(material) {
        THREE.Object3D.call(this), this.geometry = geometry, this.material = void 0 !== material ? material : new THREE.SpriteMaterial();
    };
}(), THREE.Sprite.prototype = Object.create(THREE.Object3D.prototype), THREE.Sprite.prototype.raycast = function() {
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
}(), THREE.Sprite.prototype.updateMatrix = function() {
    this.matrix.compose(this.position, this.quaternion, this.scale), this.matrixWorldNeedsUpdate = !0;
}, THREE.Sprite.prototype.clone = function(object) {
    return void 0 === object && (object = new THREE.Sprite(this.material)), THREE.Object3D.prototype.clone.call(this, object), 
    object;
}, THREE.Particle = THREE.Sprite, THREE.Scene = function() {
    THREE.Object3D.call(this), this.fog = null, this.overrideMaterial = null, this.autoUpdate = !0, 
    this.matrixAutoUpdate = !1, this.__lights = [], this.__objectsAdded = [], this.__objectsRemoved = [];
}, THREE.Scene.prototype = Object.create(THREE.Object3D.prototype), THREE.Scene.prototype.__addObject = function(object) {
    if (object instanceof THREE.Light) -1 === this.__lights.indexOf(object) && this.__lights.push(object), 
    object.target && void 0 === object.target.parent && this.add(object.target); else if (!(object instanceof THREE.Camera || object instanceof THREE.Bone)) {
        this.__objectsAdded.push(object);
        var i = this.__objectsRemoved.indexOf(object);
        -1 !== i && this.__objectsRemoved.splice(i, 1);
    }
    this.dispatchEvent({
        type: "objectAdded",
        object: object
    }), object.dispatchEvent({
        type: "addedToScene",
        scene: this
    });
    for (var c = 0; c < object.children.length; c++) this.__addObject(object.children[c]);
}, THREE.Scene.prototype.__removeObject = function(object) {
    if (object instanceof THREE.Light) {
        var i = this.__lights.indexOf(object);
        if (-1 !== i && this.__lights.splice(i, 1), object.shadowCascadeArray) for (var x = 0; x < object.shadowCascadeArray.length; x++) this.__removeObject(object.shadowCascadeArray[x]);
    } else if (!(object instanceof THREE.Camera)) {
        this.__objectsRemoved.push(object);
        var i = this.__objectsAdded.indexOf(object);
        -1 !== i && this.__objectsAdded.splice(i, 1);
    }
    this.dispatchEvent({
        type: "objectRemoved",
        object: object
    }), object.dispatchEvent({
        type: "removedFromScene",
        scene: this
    });
    for (var c = 0; c < object.children.length; c++) this.__removeObject(object.children[c]);
}, THREE.Scene.prototype.clone = function(object) {
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
}, THREE.CanvasRenderer = function(parameters) {
    function calculateLights() {
        _ambientLight.setRGB(0, 0, 0), _directionalLights.setRGB(0, 0, 0), _pointLights.setRGB(0, 0, 0);
        for (var l = 0, ll = _lights.length; ll > l; l++) {
            var light = _lights[l], lightColor = light.color;
            light instanceof THREE.AmbientLight ? _ambientLight.add(lightColor) : light instanceof THREE.DirectionalLight ? _directionalLights.add(lightColor) : light instanceof THREE.PointLight && _pointLights.add(lightColor);
        }
    }
    function calculateLight(position, normal, color) {
        for (var l = 0, ll = _lights.length; ll > l; l++) {
            var light = _lights[l];
            if (_lightColor.copy(light.color), light instanceof THREE.DirectionalLight) {
                var lightPosition = _vector3.setFromMatrixPosition(light.matrixWorld).normalize(), amount = normal.dot(lightPosition);
                if (0 >= amount) continue;
                amount *= light.intensity, color.add(_lightColor.multiplyScalar(amount));
            } else if (light instanceof THREE.PointLight) {
                var lightPosition = _vector3.setFromMatrixPosition(light.matrixWorld), amount = normal.dot(_vector3.subVectors(lightPosition, position).normalize());
                if (0 >= amount) continue;
                if (amount *= 0 == light.distance ? 1 : 1 - Math.min(position.distanceTo(lightPosition) / light.distance, 1), 
                0 == amount) continue;
                amount *= light.intensity, color.add(_lightColor.multiplyScalar(amount));
            }
        }
    }
    function renderSprite(v1, element, material) {
        setOpacity(material.opacity), setBlending(material.blending);
        var scaleX = element.scale.x * _canvasWidthHalf, scaleY = element.scale.y * _canvasHeightHalf, dist = .5 * Math.sqrt(scaleX * scaleX + scaleY * scaleY);
        if (_elemBox.min.set(v1.x - dist, v1.y - dist), _elemBox.max.set(v1.x + dist, v1.y + dist), 
        material instanceof THREE.SpriteMaterial) {
            var texture = material.map;
            if (null !== texture && void 0 !== texture.image) {
                texture.hasEventListener("update", onTextureUpdate) === !1 && (texture.image.width > 0 && textureToPattern(texture), 
                texture.addEventListener("update", onTextureUpdate));
                var pattern = _patterns[texture.id];
                setFillStyle(void 0 !== pattern ? pattern : "rgba( 0, 0, 0, 1 )");
                var bitmap = texture.image, ox = bitmap.width * texture.offset.x, oy = bitmap.height * texture.offset.y, sx = bitmap.width * texture.repeat.x, sy = bitmap.height * texture.repeat.y, cx = scaleX / sx, cy = scaleY / sy;
                _context.save(), _context.translate(v1.x, v1.y), 0 !== material.rotation && _context.rotate(material.rotation), 
                _context.translate(-scaleX / 2, -scaleY / 2), _context.scale(cx, cy), _context.translate(-ox, -oy), 
                _context.fillRect(ox, oy, sx, sy), _context.restore();
            } else setFillStyle(material.color.getStyle()), _context.save(), _context.translate(v1.x, v1.y), 
            0 !== material.rotation && _context.rotate(material.rotation), _context.scale(scaleX, -scaleY), 
            _context.fillRect(-.5, -.5, 1, 1), _context.restore();
        } else material instanceof THREE.SpriteCanvasMaterial && (setStrokeStyle(material.color.getStyle()), 
        setFillStyle(material.color.getStyle()), _context.save(), _context.translate(v1.x, v1.y), 
        0 !== material.rotation && _context.rotate(material.rotation), _context.scale(scaleX, scaleY), 
        material.program(_context), _context.restore());
    }
    function renderLine(v1, v2, element, material) {
        if (setOpacity(material.opacity), setBlending(material.blending), _context.beginPath(), 
        _context.moveTo(v1.positionScreen.x, v1.positionScreen.y), _context.lineTo(v2.positionScreen.x, v2.positionScreen.y), 
        material instanceof THREE.LineBasicMaterial) {
            if (setLineWidth(material.linewidth), setLineCap(material.linecap), setLineJoin(material.linejoin), 
            material.vertexColors !== THREE.VertexColors) setStrokeStyle(material.color.getStyle()); else {
                var colorStyle1 = element.vertexColors[0].getStyle(), colorStyle2 = element.vertexColors[1].getStyle();
                if (colorStyle1 === colorStyle2) setStrokeStyle(colorStyle1); else {
                    try {
                        var grad = _context.createLinearGradient(v1.positionScreen.x, v1.positionScreen.y, v2.positionScreen.x, v2.positionScreen.y);
                        grad.addColorStop(0, colorStyle1), grad.addColorStop(1, colorStyle2);
                    } catch (exception) {
                        grad = colorStyle1;
                    }
                    setStrokeStyle(grad);
                }
            }
            _context.stroke(), _elemBox.expandByScalar(2 * material.linewidth);
        } else material instanceof THREE.LineDashedMaterial && (setLineWidth(material.linewidth), 
        setLineCap(material.linecap), setLineJoin(material.linejoin), setStrokeStyle(material.color.getStyle()), 
        setLineDash([ material.dashSize, material.gapSize ]), _context.stroke(), _elemBox.expandByScalar(2 * material.linewidth), 
        setLineDash([]));
    }
    function renderFace3(v1, v2, v3, uv1, uv2, uv3, element, material) {
        _this.info.render.vertices += 3, _this.info.render.faces++, setOpacity(material.opacity), 
        setBlending(material.blending), _v1x = v1.positionScreen.x, _v1y = v1.positionScreen.y, 
        _v2x = v2.positionScreen.x, _v2y = v2.positionScreen.y, _v3x = v3.positionScreen.x, 
        _v3y = v3.positionScreen.y, drawTriangle(_v1x, _v1y, _v2x, _v2y, _v3x, _v3y), (material instanceof THREE.MeshLambertMaterial || material instanceof THREE.MeshPhongMaterial) && null === material.map ? (_diffuseColor.copy(material.color), 
        _emissiveColor.copy(material.emissive), material.vertexColors === THREE.FaceColors && _diffuseColor.multiply(element.color), 
        _color.copy(_ambientLight), _centroid.copy(v1.positionWorld).add(v2.positionWorld).add(v3.positionWorld).divideScalar(3), 
        calculateLight(_centroid, element.normalModel, _color), _color.multiply(_diffuseColor).add(_emissiveColor), 
        material.wireframe === !0 ? strokePath(_color, material.wireframeLinewidth, material.wireframeLinecap, material.wireframeLinejoin) : fillPath(_color)) : material instanceof THREE.MeshBasicMaterial || material instanceof THREE.MeshLambertMaterial || material instanceof THREE.MeshPhongMaterial ? null !== material.map ? material.map.mapping instanceof THREE.UVMapping && (_uvs = element.uvs, 
        patternPath(_v1x, _v1y, _v2x, _v2y, _v3x, _v3y, _uvs[uv1].x, _uvs[uv1].y, _uvs[uv2].x, _uvs[uv2].y, _uvs[uv3].x, _uvs[uv3].y, material.map)) : null !== material.envMap ? material.envMap.mapping instanceof THREE.SphericalReflectionMapping ? (_normal.copy(element.vertexNormalsModel[uv1]).applyMatrix3(_normalViewMatrix), 
        _uv1x = .5 * _normal.x + .5, _uv1y = .5 * _normal.y + .5, _normal.copy(element.vertexNormalsModel[uv2]).applyMatrix3(_normalViewMatrix), 
        _uv2x = .5 * _normal.x + .5, _uv2y = .5 * _normal.y + .5, _normal.copy(element.vertexNormalsModel[uv3]).applyMatrix3(_normalViewMatrix), 
        _uv3x = .5 * _normal.x + .5, _uv3y = .5 * _normal.y + .5, patternPath(_v1x, _v1y, _v2x, _v2y, _v3x, _v3y, _uv1x, _uv1y, _uv2x, _uv2y, _uv3x, _uv3y, material.envMap)) : material.envMap.mapping instanceof THREE.SphericalRefractionMapping && (_normal.copy(element.vertexNormalsModel[uv1]).applyMatrix3(_normalViewMatrix), 
        _uv1x = -.5 * _normal.x + .5, _uv1y = -.5 * _normal.y + .5, _normal.copy(element.vertexNormalsModel[uv2]).applyMatrix3(_normalViewMatrix), 
        _uv2x = -.5 * _normal.x + .5, _uv2y = -.5 * _normal.y + .5, _normal.copy(element.vertexNormalsModel[uv3]).applyMatrix3(_normalViewMatrix), 
        _uv3x = -.5 * _normal.x + .5, _uv3y = -.5 * _normal.y + .5, patternPath(_v1x, _v1y, _v2x, _v2y, _v3x, _v3y, _uv1x, _uv1y, _uv2x, _uv2y, _uv3x, _uv3y, material.envMap)) : (_color.copy(material.color), 
        material.vertexColors === THREE.FaceColors && _color.multiply(element.color), material.wireframe === !0 ? strokePath(_color, material.wireframeLinewidth, material.wireframeLinecap, material.wireframeLinejoin) : fillPath(_color)) : material instanceof THREE.MeshDepthMaterial ? (_color.r = _color.g = _color.b = 1 - smoothstep(v1.positionScreen.z * v1.positionScreen.w, _camera.near, _camera.far), 
        material.wireframe === !0 ? strokePath(_color, material.wireframeLinewidth, material.wireframeLinecap, material.wireframeLinejoin) : fillPath(_color)) : material instanceof THREE.MeshNormalMaterial ? (_normal.copy(element.normalModel).applyMatrix3(_normalViewMatrix), 
        _color.setRGB(_normal.x, _normal.y, _normal.z).multiplyScalar(.5).addScalar(.5), 
        material.wireframe === !0 ? strokePath(_color, material.wireframeLinewidth, material.wireframeLinecap, material.wireframeLinejoin) : fillPath(_color)) : (_color.setRGB(1, 1, 1), 
        material.wireframe === !0 ? strokePath(_color, material.wireframeLinewidth, material.wireframeLinecap, material.wireframeLinejoin) : fillPath(_color));
    }
    function drawTriangle(x0, y0, x1, y1, x2, y2) {
        _context.beginPath(), _context.moveTo(x0, y0), _context.lineTo(x1, y1), _context.lineTo(x2, y2), 
        _context.closePath();
    }
    function strokePath(color, linewidth, linecap, linejoin) {
        setLineWidth(linewidth), setLineCap(linecap), setLineJoin(linejoin), setStrokeStyle(color.getStyle()), 
        _context.stroke(), _elemBox.expandByScalar(2 * linewidth);
    }
    function fillPath(color) {
        setFillStyle(color.getStyle()), _context.fill();
    }
    function onTextureUpdate(event) {
        textureToPattern(event.target);
    }
    function textureToPattern(texture) {
        if (!(texture instanceof THREE.CompressedTexture)) {
            var repeatX = texture.wrapS === THREE.RepeatWrapping, repeatY = texture.wrapT === THREE.RepeatWrapping, image = texture.image, canvas = document.createElement("canvas");
            canvas.width = image.width, canvas.height = image.height;
            var context = canvas.getContext("2d");
            context.setTransform(1, 0, 0, -1, 0, image.height), context.drawImage(image, 0, 0), 
            _patterns[texture.id] = _context.createPattern(canvas, repeatX === !0 && repeatY === !0 ? "repeat" : repeatX === !0 && repeatY === !1 ? "repeat-x" : repeatX === !1 && repeatY === !0 ? "repeat-y" : "no-repeat");
        }
    }
    function patternPath(x0, y0, x1, y1, x2, y2, u0, v0, u1, v1, u2, v2, texture) {
        if (!(texture instanceof THREE.DataTexture)) {
            texture.hasEventListener("update", onTextureUpdate) === !1 && (void 0 !== texture.image && texture.image.width > 0 && textureToPattern(texture), 
            texture.addEventListener("update", onTextureUpdate));
            var pattern = _patterns[texture.id];
            if (void 0 === pattern) return setFillStyle("rgba(0,0,0,1)"), void _context.fill();
            setFillStyle(pattern);
            var a, b, c, d, e, f, det, idet, offsetX = texture.offset.x / texture.repeat.x, offsetY = texture.offset.y / texture.repeat.y, width = texture.image.width * texture.repeat.x, height = texture.image.height * texture.repeat.y;
            u0 = (u0 + offsetX) * width, v0 = (v0 + offsetY) * height, u1 = (u1 + offsetX) * width, 
            v1 = (v1 + offsetY) * height, u2 = (u2 + offsetX) * width, v2 = (v2 + offsetY) * height, 
            x1 -= x0, y1 -= y0, x2 -= x0, y2 -= y0, u1 -= u0, v1 -= v0, u2 -= u0, v2 -= v0, 
            det = u1 * v2 - u2 * v1, 0 !== det && (idet = 1 / det, a = (v2 * x1 - v1 * x2) * idet, 
            b = (v2 * y1 - v1 * y2) * idet, c = (u1 * x2 - u2 * x1) * idet, d = (u1 * y2 - u2 * y1) * idet, 
            e = x0 - a * u0 - c * v0, f = y0 - b * u0 - d * v0, _context.save(), _context.transform(a, b, c, d, e, f), 
            _context.fill(), _context.restore());
        }
    }
    function expand(v1, v2, pixels) {
        var idet, x = v2.x - v1.x, y = v2.y - v1.y, det = x * x + y * y;
        0 !== det && (idet = pixels / Math.sqrt(det), x *= idet, y *= idet, v2.x += x, v2.y += y, 
        v1.x -= x, v1.y -= y);
    }
    function setOpacity(value) {
        _contextGlobalAlpha !== value && (_context.globalAlpha = value, _contextGlobalAlpha = value);
    }
    function setBlending(value) {
        _contextGlobalCompositeOperation !== value && (value === THREE.NormalBlending ? _context.globalCompositeOperation = "source-over" : value === THREE.AdditiveBlending ? _context.globalCompositeOperation = "lighter" : value === THREE.SubtractiveBlending && (_context.globalCompositeOperation = "darker"), 
        _contextGlobalCompositeOperation = value);
    }
    function setLineWidth(value) {
        _contextLineWidth !== value && (_context.lineWidth = value, _contextLineWidth = value);
    }
    function setLineCap(value) {
        _contextLineCap !== value && (_context.lineCap = value, _contextLineCap = value);
    }
    function setLineJoin(value) {
        _contextLineJoin !== value && (_context.lineJoin = value, _contextLineJoin = value);
    }
    function setStrokeStyle(value) {
        _contextStrokeStyle !== value && (_context.strokeStyle = value, _contextStrokeStyle = value);
    }
    function setFillStyle(value) {
        _contextFillStyle !== value && (_context.fillStyle = value, _contextFillStyle = value);
    }
    function setLineDash(value) {
        _contextLineDash.length !== value.length && (_context.setLineDash(value), _contextLineDash = value);
    }
    console.log("THREE.CanvasRenderer", THREE.REVISION);
    var smoothstep = THREE.Math.smoothstep;
    parameters = parameters || {};
    var _renderData, _elements, _lights, _camera, _v1, _v2, _v3, _v1x, _v1y, _v2x, _v2y, _v3x, _v3y, _uvs, _uv1x, _uv1y, _uv2x, _uv2y, _uv3x, _uv3y, _this = this, _projector = new THREE.Projector(), _canvas = void 0 !== parameters.canvas ? parameters.canvas : document.createElement("canvas"), _canvasWidth = _canvas.width, _canvasHeight = _canvas.height, _canvasWidthHalf = Math.floor(_canvasWidth / 2), _canvasHeightHalf = Math.floor(_canvasHeight / 2), _viewportX = 0, _viewportY = 0, _viewportWidth = _canvasWidth, _viewportHeight = _canvasHeight, _context = _canvas.getContext("2d", {
        alpha: parameters.alpha === !0
    }), _clearColor = new THREE.Color(0), _clearAlpha = 0, _contextGlobalAlpha = 1, _contextGlobalCompositeOperation = 0, _contextStrokeStyle = null, _contextFillStyle = null, _contextLineWidth = null, _contextLineCap = null, _contextLineJoin = null, _contextLineDash = [], _color = (new THREE.RenderableVertex(), 
    new THREE.RenderableVertex(), new THREE.Color()), _diffuseColor = (new THREE.Color(), 
    new THREE.Color(), new THREE.Color(), new THREE.Color(), new THREE.Color()), _emissiveColor = new THREE.Color(), _lightColor = new THREE.Color(), _patterns = {}, _clipBox = new THREE.Box2(), _clearBox = new THREE.Box2(), _elemBox = new THREE.Box2(), _ambientLight = new THREE.Color(), _directionalLights = new THREE.Color(), _pointLights = new THREE.Color(), _vector3 = new THREE.Vector3(), _centroid = new THREE.Vector3(), _normal = new THREE.Vector3(), _normalViewMatrix = new THREE.Matrix3();
    void 0 === _context.setLineDash && (_context.setLineDash = function() {}), this.domElement = _canvas, 
    this.devicePixelRatio = void 0 !== parameters.devicePixelRatio ? parameters.devicePixelRatio : void 0 !== self.devicePixelRatio ? self.devicePixelRatio : 1, 
    this.autoClear = !0, this.sortObjects = !0, this.sortElements = !0, this.info = {
        render: {
            vertices: 0,
            faces: 0
        }
    }, this.supportsVertexTextures = function() {}, this.setFaceCulling = function() {}, 
    this.setSize = function(width, height, updateStyle) {
        _canvasWidth = width * this.devicePixelRatio, _canvasHeight = height * this.devicePixelRatio, 
        _canvas.width = _canvasWidth, _canvas.height = _canvasHeight, _canvasWidthHalf = Math.floor(_canvasWidth / 2), 
        _canvasHeightHalf = Math.floor(_canvasHeight / 2), updateStyle !== !1 && (_canvas.style.width = width + "px", 
        _canvas.style.height = height + "px"), _clipBox.min.set(-_canvasWidthHalf, -_canvasHeightHalf), 
        _clipBox.max.set(_canvasWidthHalf, _canvasHeightHalf), _clearBox.min.set(-_canvasWidthHalf, -_canvasHeightHalf), 
        _clearBox.max.set(_canvasWidthHalf, _canvasHeightHalf), _contextGlobalAlpha = 1, 
        _contextGlobalCompositeOperation = 0, _contextStrokeStyle = null, _contextFillStyle = null, 
        _contextLineWidth = null, _contextLineCap = null, _contextLineJoin = null, this.setViewport(0, 0, width, height);
    }, this.setViewport = function(x, y, width, height) {
        _viewportX = x * this.devicePixelRatio, _viewportY = y * this.devicePixelRatio, 
        _viewportWidth = width * this.devicePixelRatio, _viewportHeight = height * this.devicePixelRatio;
    }, this.setScissor = function() {}, this.enableScissorTest = function() {}, this.setClearColor = function(color, alpha) {
        _clearColor.set(color), _clearAlpha = void 0 !== alpha ? alpha : 1, _clearBox.min.set(-_canvasWidthHalf, -_canvasHeightHalf), 
        _clearBox.max.set(_canvasWidthHalf, _canvasHeightHalf);
    }, this.setClearColorHex = function(hex, alpha) {
        console.warn("THREE.CanvasRenderer: .setClearColorHex() is being removed. Use .setClearColor() instead."), 
        this.setClearColor(hex, alpha);
    }, this.getClearColor = function() {
        return _clearColor;
    }, this.getClearAlpha = function() {
        return _clearAlpha;
    }, this.getMaxAnisotropy = function() {
        return 0;
    }, this.clear = function() {
        _clearBox.empty() === !1 && (_clearBox.intersect(_clipBox), _clearBox.expandByScalar(2), 
        _clearBox.min.x = _clearBox.min.x + _canvasWidthHalf, _clearBox.min.y = -_clearBox.min.y + _canvasHeightHalf, 
        _clearBox.max.x = _clearBox.max.x + _canvasWidthHalf, _clearBox.max.y = -_clearBox.max.y + _canvasHeightHalf, 
        1 > _clearAlpha && _context.clearRect(0 | _clearBox.min.x, 0 | _clearBox.min.y, _clearBox.max.x - _clearBox.min.x | 0, _clearBox.max.y - _clearBox.min.y | 0), 
        _clearAlpha > 0 && (setBlending(THREE.NormalBlending), setOpacity(1), setFillStyle("rgba(" + Math.floor(255 * _clearColor.r) + "," + Math.floor(255 * _clearColor.g) + "," + Math.floor(255 * _clearColor.b) + "," + _clearAlpha + ")"), 
        _context.fillRect(0 | _clearBox.min.x, 0 | _clearBox.min.y, _clearBox.max.x - _clearBox.min.x | 0, _clearBox.max.y - _clearBox.min.y | 0)), 
        _clearBox.makeEmpty());
    }, this.clearColor = function() {}, this.clearDepth = function() {}, this.clearStencil = function() {}, 
    this.render = function(scene, camera) {
        if (camera instanceof THREE.Camera == !1) return void console.error("THREE.CanvasRenderer.render: camera is not an instance of THREE.Camera.");
        this.autoClear === !0 && this.clear(), _this.info.render.vertices = 0, _this.info.render.faces = 0, 
        _context.setTransform(_viewportWidth / _canvasWidth, 0, 0, -_viewportHeight / _canvasHeight, _viewportX, _canvasHeight - _viewportY), 
        _context.translate(_canvasWidthHalf, _canvasHeightHalf), _renderData = _projector.projectScene(scene, camera, this.sortObjects, this.sortElements), 
        _elements = _renderData.elements, _lights = _renderData.lights, _camera = camera, 
        _normalViewMatrix.getNormalMatrix(camera.matrixWorldInverse), calculateLights();
        for (var e = 0, el = _elements.length; el > e; e++) {
            var element = _elements[e], material = element.material;
            if (void 0 !== material && 0 !== material.opacity) {
                if (_elemBox.makeEmpty(), element instanceof THREE.RenderableSprite) _v1 = element, 
                _v1.x *= _canvasWidthHalf, _v1.y *= _canvasHeightHalf, renderSprite(_v1, element, material); else if (element instanceof THREE.RenderableLine) _v1 = element.v1, 
                _v2 = element.v2, _v1.positionScreen.x *= _canvasWidthHalf, _v1.positionScreen.y *= _canvasHeightHalf, 
                _v2.positionScreen.x *= _canvasWidthHalf, _v2.positionScreen.y *= _canvasHeightHalf, 
                _elemBox.setFromPoints([ _v1.positionScreen, _v2.positionScreen ]), _clipBox.isIntersectionBox(_elemBox) === !0 && renderLine(_v1, _v2, element, material); else if (element instanceof THREE.RenderableFace) {
                    if (_v1 = element.v1, _v2 = element.v2, _v3 = element.v3, _v1.positionScreen.z < -1 || _v1.positionScreen.z > 1) continue;
                    if (_v2.positionScreen.z < -1 || _v2.positionScreen.z > 1) continue;
                    if (_v3.positionScreen.z < -1 || _v3.positionScreen.z > 1) continue;
                    _v1.positionScreen.x *= _canvasWidthHalf, _v1.positionScreen.y *= _canvasHeightHalf, 
                    _v2.positionScreen.x *= _canvasWidthHalf, _v2.positionScreen.y *= _canvasHeightHalf, 
                    _v3.positionScreen.x *= _canvasWidthHalf, _v3.positionScreen.y *= _canvasHeightHalf, 
                    material.overdraw > 0 && (expand(_v1.positionScreen, _v2.positionScreen, material.overdraw), 
                    expand(_v2.positionScreen, _v3.positionScreen, material.overdraw), expand(_v3.positionScreen, _v1.positionScreen, material.overdraw)), 
                    _elemBox.setFromPoints([ _v1.positionScreen, _v2.positionScreen, _v3.positionScreen ]), 
                    _clipBox.isIntersectionBox(_elemBox) === !0 && renderFace3(_v1, _v2, _v3, 0, 1, 2, element, material);
                }
                _clearBox.union(_elemBox);
            }
        }
        _context.setTransform(1, 0, 0, 1, 0, 0);
    };
}, THREE.ShaderChunk = {}, THREE.ShaderChunk.alphatest_fragment = "#ifdef ALPHATEST\n\n	if ( gl_FragColor.a < ALPHATEST ) discard;\n\n#endif\n", 
THREE.ShaderChunk.lights_lambert_vertex = "vLightFront = vec3( 0.0 );\n\n#ifdef DOUBLE_SIDED\n\n	vLightBack = vec3( 0.0 );\n\n#endif\n\ntransformedNormal = normalize( transformedNormal );\n\n#if MAX_DIR_LIGHTS > 0\n\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\n\n	vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\n	vec3 dirVector = normalize( lDirection.xyz );\n\n	float dotProduct = dot( transformedNormal, dirVector );\n	vec3 directionalLightWeighting = vec3( max( dotProduct, 0.0 ) );\n\n	#ifdef DOUBLE_SIDED\n\n		vec3 directionalLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n\n		#ifdef WRAP_AROUND\n\n			vec3 directionalLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n\n		#endif\n\n	#endif\n\n	#ifdef WRAP_AROUND\n\n		vec3 directionalLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\n		directionalLightWeighting = mix( directionalLightWeighting, directionalLightWeightingHalf, wrapRGB );\n\n		#ifdef DOUBLE_SIDED\n\n			directionalLightWeightingBack = mix( directionalLightWeightingBack, directionalLightWeightingHalfBack, wrapRGB );\n\n		#endif\n\n	#endif\n\n	vLightFront += directionalLightColor[ i ] * directionalLightWeighting;\n\n	#ifdef DOUBLE_SIDED\n\n		vLightBack += directionalLightColor[ i ] * directionalLightWeightingBack;\n\n	#endif\n\n}\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	for( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n\n		vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz - mvPosition.xyz;\n\n		float lDistance = 1.0;\n		if ( pointLightDistance[ i ] > 0.0 )\n			lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\n\n		lVector = normalize( lVector );\n		float dotProduct = dot( transformedNormal, lVector );\n\n		vec3 pointLightWeighting = vec3( max( dotProduct, 0.0 ) );\n\n		#ifdef DOUBLE_SIDED\n\n			vec3 pointLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n\n			#ifdef WRAP_AROUND\n\n				vec3 pointLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n\n			#endif\n\n		#endif\n\n		#ifdef WRAP_AROUND\n\n			vec3 pointLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\n			pointLightWeighting = mix( pointLightWeighting, pointLightWeightingHalf, wrapRGB );\n\n			#ifdef DOUBLE_SIDED\n\n				pointLightWeightingBack = mix( pointLightWeightingBack, pointLightWeightingHalfBack, wrapRGB );\n\n			#endif\n\n		#endif\n\n		vLightFront += pointLightColor[ i ] * pointLightWeighting * lDistance;\n\n		#ifdef DOUBLE_SIDED\n\n			vLightBack += pointLightColor[ i ] * pointLightWeightingBack * lDistance;\n\n		#endif\n\n	}\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	for( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n\n		vec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz - mvPosition.xyz;\n\n		float spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - worldPosition.xyz ) );\n\n		if ( spotEffect > spotLightAngleCos[ i ] ) {\n\n			spotEffect = max( pow( max( spotEffect, 0.0 ), spotLightExponent[ i ] ), 0.0 );\n\n			float lDistance = 1.0;\n			if ( spotLightDistance[ i ] > 0.0 )\n				lDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\n\n			lVector = normalize( lVector );\n\n			float dotProduct = dot( transformedNormal, lVector );\n			vec3 spotLightWeighting = vec3( max( dotProduct, 0.0 ) );\n\n			#ifdef DOUBLE_SIDED\n\n				vec3 spotLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n\n				#ifdef WRAP_AROUND\n\n					vec3 spotLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n\n				#endif\n\n			#endif\n\n			#ifdef WRAP_AROUND\n\n				vec3 spotLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\n				spotLightWeighting = mix( spotLightWeighting, spotLightWeightingHalf, wrapRGB );\n\n				#ifdef DOUBLE_SIDED\n\n					spotLightWeightingBack = mix( spotLightWeightingBack, spotLightWeightingHalfBack, wrapRGB );\n\n				#endif\n\n			#endif\n\n			vLightFront += spotLightColor[ i ] * spotLightWeighting * lDistance * spotEffect;\n\n			#ifdef DOUBLE_SIDED\n\n				vLightBack += spotLightColor[ i ] * spotLightWeightingBack * lDistance * spotEffect;\n\n			#endif\n\n		}\n\n	}\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	for( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\n\n		vec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );\n		vec3 lVector = normalize( lDirection.xyz );\n\n		float dotProduct = dot( transformedNormal, lVector );\n\n		float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\n		float hemiDiffuseWeightBack = -0.5 * dotProduct + 0.5;\n\n		vLightFront += mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\n\n		#ifdef DOUBLE_SIDED\n\n			vLightBack += mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeightBack );\n\n		#endif\n\n	}\n\n#endif\n\nvLightFront = vLightFront * diffuse + ambient * ambientLightColor + emissive;\n\n#ifdef DOUBLE_SIDED\n\n	vLightBack = vLightBack * diffuse + ambient * ambientLightColor + emissive;\n\n#endif", 
THREE.ShaderChunk.map_particle_pars_fragment = "#ifdef USE_MAP\n\n	uniform sampler2D map;\n\n#endif", 
THREE.ShaderChunk.default_vertex = "vec4 mvPosition;\n\n#ifdef USE_SKINNING\n\n	mvPosition = modelViewMatrix * skinned;\n\n#endif\n\n#if !defined( USE_SKINNING ) && defined( USE_MORPHTARGETS )\n\n	mvPosition = modelViewMatrix * vec4( morphed, 1.0 );\n\n#endif\n\n#if !defined( USE_SKINNING ) && ! defined( USE_MORPHTARGETS )\n\n	mvPosition = modelViewMatrix * vec4( position, 1.0 );\n\n#endif\n\ngl_Position = projectionMatrix * mvPosition;", 
THREE.ShaderChunk.map_pars_fragment = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP )\n\n	varying vec2 vUv;\n\n#endif\n\n#ifdef USE_MAP\n\n	uniform sampler2D map;\n\n#endif", 
THREE.ShaderChunk.skinnormal_vertex = "#ifdef USE_SKINNING\n\n	mat4 skinMatrix = mat4( 0.0 );\n	skinMatrix += skinWeight.x * boneMatX;\n	skinMatrix += skinWeight.y * boneMatY;\n	skinMatrix += skinWeight.z * boneMatZ;\n	skinMatrix += skinWeight.w * boneMatW;\n	skinMatrix  = bindMatrixInverse * skinMatrix * bindMatrix;\n\n	#ifdef USE_MORPHNORMALS\n\n	vec4 skinnedNormal = skinMatrix * vec4( morphedNormal, 0.0 );\n\n	#else\n\n	vec4 skinnedNormal = skinMatrix * vec4( normal, 0.0 );\n\n	#endif\n\n#endif\n", 
THREE.ShaderChunk.logdepthbuf_pars_vertex = "#ifdef USE_LOGDEPTHBUF\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		varying float vFragDepth;\n\n	#endif\n\n	uniform float logDepthBufFC;\n\n#endif", 
THREE.ShaderChunk.lightmap_pars_vertex = "#ifdef USE_LIGHTMAP\n\n	varying vec2 vUv2;\n\n#endif", 
THREE.ShaderChunk.lights_phong_fragment = "vec3 normal = normalize( vNormal );\nvec3 viewPosition = normalize( vViewPosition );\n\n#ifdef DOUBLE_SIDED\n\n	normal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n\n#endif\n\n#ifdef USE_NORMALMAP\n\n	normal = perturbNormal2Arb( -vViewPosition, normal );\n\n#elif defined( USE_BUMPMAP )\n\n	normal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	vec3 pointDiffuse = vec3( 0.0 );\n	vec3 pointSpecular = vec3( 0.0 );\n\n	for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n\n		vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz + vViewPosition.xyz;\n\n		float lDistance = 1.0;\n		if ( pointLightDistance[ i ] > 0.0 )\n			lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\n\n		lVector = normalize( lVector );\n\n				// diffuse\n\n		float dotProduct = dot( normal, lVector );\n\n		#ifdef WRAP_AROUND\n\n			float pointDiffuseWeightFull = max( dotProduct, 0.0 );\n			float pointDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\n\n			vec3 pointDiffuseWeight = mix( vec3( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n\n		#else\n\n			float pointDiffuseWeight = max( dotProduct, 0.0 );\n\n		#endif\n\n		pointDiffuse += diffuse * pointLightColor[ i ] * pointDiffuseWeight * lDistance;\n\n				// specular\n\n		vec3 pointHalfVector = normalize( lVector + viewPosition );\n		float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );\n		float pointSpecularWeight = specularStrength * max( pow( pointDotNormalHalf, shininess ), 0.0 );\n\n		float specularNormalization = ( shininess + 2.0 ) / 8.0;\n\n		vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, pointHalfVector ), 0.0 ), 5.0 );\n		pointSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance * specularNormalization;\n\n	}\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	vec3 spotDiffuse = vec3( 0.0 );\n	vec3 spotSpecular = vec3( 0.0 );\n\n	for ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n\n		vec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz + vViewPosition.xyz;\n\n		float lDistance = 1.0;\n		if ( spotLightDistance[ i ] > 0.0 )\n			lDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\n\n		lVector = normalize( lVector );\n\n		float spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );\n\n		if ( spotEffect > spotLightAngleCos[ i ] ) {\n\n			spotEffect = max( pow( max( spotEffect, 0.0 ), spotLightExponent[ i ] ), 0.0 );\n\n					// diffuse\n\n			float dotProduct = dot( normal, lVector );\n\n			#ifdef WRAP_AROUND\n\n				float spotDiffuseWeightFull = max( dotProduct, 0.0 );\n				float spotDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\n\n				vec3 spotDiffuseWeight = mix( vec3( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );\n\n			#else\n\n				float spotDiffuseWeight = max( dotProduct, 0.0 );\n\n			#endif\n\n			spotDiffuse += diffuse * spotLightColor[ i ] * spotDiffuseWeight * lDistance * spotEffect;\n\n					// specular\n\n			vec3 spotHalfVector = normalize( lVector + viewPosition );\n			float spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );\n			float spotSpecularWeight = specularStrength * max( pow( spotDotNormalHalf, shininess ), 0.0 );\n\n			float specularNormalization = ( shininess + 2.0 ) / 8.0;\n\n			vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, spotHalfVector ), 0.0 ), 5.0 );\n			spotSpecular += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * specularNormalization * spotEffect;\n\n		}\n\n	}\n\n#endif\n\n#if MAX_DIR_LIGHTS > 0\n\n	vec3 dirDiffuse = vec3( 0.0 );\n	vec3 dirSpecular = vec3( 0.0 );\n\n	for( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\n\n		vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\n		vec3 dirVector = normalize( lDirection.xyz );\n\n				// diffuse\n\n		float dotProduct = dot( normal, dirVector );\n\n		#ifdef WRAP_AROUND\n\n			float dirDiffuseWeightFull = max( dotProduct, 0.0 );\n			float dirDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\n\n			vec3 dirDiffuseWeight = mix( vec3( dirDiffuseWeightFull ), vec3( dirDiffuseWeightHalf ), wrapRGB );\n\n		#else\n\n			float dirDiffuseWeight = max( dotProduct, 0.0 );\n\n		#endif\n\n		dirDiffuse += diffuse * directionalLightColor[ i ] * dirDiffuseWeight;\n\n		// specular\n\n		vec3 dirHalfVector = normalize( dirVector + viewPosition );\n		float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );\n		float dirSpecularWeight = specularStrength * max( pow( dirDotNormalHalf, shininess ), 0.0 );\n\n		/*\n		// fresnel term from skin shader\n		const float F0 = 0.128;\n\n		float base = 1.0 - dot( viewPosition, dirHalfVector );\n		float exponential = pow( base, 5.0 );\n\n		float fresnel = exponential + F0 * ( 1.0 - exponential );\n		*/\n\n		/*\n		// fresnel term from fresnel shader\n		const float mFresnelBias = 0.08;\n		const float mFresnelScale = 0.3;\n		const float mFresnelPower = 5.0;\n\n		float fresnel = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( -viewPosition ), normal ), mFresnelPower );\n		*/\n\n		float specularNormalization = ( shininess + 2.0 ) / 8.0;\n\n		// 		dirSpecular += specular * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization * fresnel;\n\n		vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( dirVector, dirHalfVector ), 0.0 ), 5.0 );\n		dirSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n\n\n	}\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	vec3 hemiDiffuse = vec3( 0.0 );\n	vec3 hemiSpecular = vec3( 0.0 );\n\n	for( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\n\n		vec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );\n		vec3 lVector = normalize( lDirection.xyz );\n\n		// diffuse\n\n		float dotProduct = dot( normal, lVector );\n		float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\n\n		vec3 hemiColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\n\n		hemiDiffuse += diffuse * hemiColor;\n\n		// specular (sky light)\n\n		vec3 hemiHalfVectorSky = normalize( lVector + viewPosition );\n		float hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;\n		float hemiSpecularWeightSky = specularStrength * max( pow( max( hemiDotNormalHalfSky, 0.0 ), shininess ), 0.0 );\n\n		// specular (ground light)\n\n		vec3 lVectorGround = -lVector;\n\n		vec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );\n		float hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;\n		float hemiSpecularWeightGround = specularStrength * max( pow( max( hemiDotNormalHalfGround, 0.0 ), shininess ), 0.0 );\n\n		float dotProductGround = dot( normal, lVectorGround );\n\n		float specularNormalization = ( shininess + 2.0 ) / 8.0;\n\n		vec3 schlickSky = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, hemiHalfVectorSky ), 0.0 ), 5.0 );\n		vec3 schlickGround = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVectorGround, hemiHalfVectorGround ), 0.0 ), 5.0 );\n		hemiSpecular += hemiColor * specularNormalization * ( schlickSky * hemiSpecularWeightSky * max( dotProduct, 0.0 ) + schlickGround * hemiSpecularWeightGround * max( dotProductGround, 0.0 ) );\n\n	}\n\n#endif\n\nvec3 totalDiffuse = vec3( 0.0 );\nvec3 totalSpecular = vec3( 0.0 );\n\n#if MAX_DIR_LIGHTS > 0\n\n	totalDiffuse += dirDiffuse;\n	totalSpecular += dirSpecular;\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	totalDiffuse += hemiDiffuse;\n	totalSpecular += hemiSpecular;\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	totalDiffuse += pointDiffuse;\n	totalSpecular += pointSpecular;\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	totalDiffuse += spotDiffuse;\n	totalSpecular += spotSpecular;\n\n#endif\n\n#ifdef METAL\n\n	gl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient + totalSpecular );\n\n#else\n\n	gl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient ) + totalSpecular;\n\n#endif", 
THREE.ShaderChunk.fog_pars_fragment = "#ifdef USE_FOG\n\n	uniform vec3 fogColor;\n\n	#ifdef FOG_EXP2\n\n		uniform float fogDensity;\n\n	#else\n\n		uniform float fogNear;\n		uniform float fogFar;\n	#endif\n\n#endif", 
THREE.ShaderChunk.morphnormal_vertex = "#ifdef USE_MORPHNORMALS\n\n	vec3 morphedNormal = vec3( 0.0 );\n\n	morphedNormal += ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];\n	morphedNormal += ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];\n	morphedNormal += ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];\n	morphedNormal += ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];\n\n	morphedNormal += normal;\n\n#endif", 
THREE.ShaderChunk.envmap_pars_fragment = "#ifdef USE_ENVMAP\n\n	uniform float reflectivity;\n	uniform samplerCube envMap;\n	uniform float flipEnvMap;\n	uniform int combine;\n\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP )\n\n		uniform bool useRefract;\n		uniform float refractionRatio;\n\n	#else\n\n		varying vec3 vReflect;\n\n	#endif\n\n#endif", 
THREE.ShaderChunk.logdepthbuf_fragment = "#if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)\n\n	gl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;\n\n#endif", 
THREE.ShaderChunk.normalmap_pars_fragment = "#ifdef USE_NORMALMAP\n\n	uniform sampler2D normalMap;\n	uniform vec2 normalScale;\n\n			// Per-Pixel Tangent Space Normal Mapping\n			// http://hacksoflife.blogspot.ch/2009/11/per-pixel-tangent-space-normal-mapping.html\n\n	vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {\n\n		vec3 q0 = dFdx( eye_pos.xyz );\n		vec3 q1 = dFdy( eye_pos.xyz );\n		vec2 st0 = dFdx( vUv.st );\n		vec2 st1 = dFdy( vUv.st );\n\n		vec3 S = normalize( q0 * st1.t - q1 * st0.t );\n		vec3 T = normalize( -q0 * st1.s + q1 * st0.s );\n		vec3 N = normalize( surf_norm );\n\n		vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;\n		mapN.xy = normalScale * mapN.xy;\n		mat3 tsn = mat3( S, T, N );\n		return normalize( tsn * mapN );\n\n	}\n\n#endif\n", 
THREE.ShaderChunk.lights_phong_pars_vertex = "#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined( USE_ENVMAP )\n\n	varying vec3 vWorldPosition;\n\n#endif\n", 
THREE.ShaderChunk.lightmap_pars_fragment = "#ifdef USE_LIGHTMAP\n\n	varying vec2 vUv2;\n	uniform sampler2D lightMap;\n\n#endif", 
THREE.ShaderChunk.shadowmap_vertex = "#ifdef USE_SHADOWMAP\n\n	for( int i = 0; i < MAX_SHADOWS; i ++ ) {\n\n		vShadowCoord[ i ] = shadowMatrix[ i ] * worldPosition;\n\n	}\n\n#endif", 
THREE.ShaderChunk.lights_phong_vertex = "#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined( USE_ENVMAP )\n\n	vWorldPosition = worldPosition.xyz;\n\n#endif", 
THREE.ShaderChunk.map_fragment = "#ifdef USE_MAP\n\n	vec4 texelColor = texture2D( map, vUv );\n\n	#ifdef GAMMA_INPUT\n\n		texelColor.xyz *= texelColor.xyz;\n\n	#endif\n\n	gl_FragColor = gl_FragColor * texelColor;\n\n#endif", 
THREE.ShaderChunk.lightmap_vertex = "#ifdef USE_LIGHTMAP\n\n	vUv2 = uv2;\n\n#endif", 
THREE.ShaderChunk.map_particle_fragment = "#ifdef USE_MAP\n\n	gl_FragColor = gl_FragColor * texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) );\n\n#endif", 
THREE.ShaderChunk.color_pars_fragment = "#ifdef USE_COLOR\n\n	varying vec3 vColor;\n\n#endif\n", 
THREE.ShaderChunk.color_vertex = "#ifdef USE_COLOR\n\n	#ifdef GAMMA_INPUT\n\n		vColor = color * color;\n\n	#else\n\n		vColor = color;\n\n	#endif\n\n#endif", 
THREE.ShaderChunk.skinning_vertex = "#ifdef USE_SKINNING\n\n	#ifdef USE_MORPHTARGETS\n\n	vec4 skinVertex = bindMatrix * vec4( morphed, 1.0 );\n\n	#else\n\n	vec4 skinVertex = bindMatrix * vec4( position, 1.0 );\n\n	#endif\n\n	vec4 skinned = vec4( 0.0 );\n	skinned += boneMatX * skinVertex * skinWeight.x;\n	skinned += boneMatY * skinVertex * skinWeight.y;\n	skinned += boneMatZ * skinVertex * skinWeight.z;\n	skinned += boneMatW * skinVertex * skinWeight.w;\n	skinned  = bindMatrixInverse * skinned;\n\n#endif\n", 
THREE.ShaderChunk.envmap_pars_vertex = "#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP )\n\n	varying vec3 vReflect;\n\n	uniform float refractionRatio;\n	uniform bool useRefract;\n\n#endif\n", 
THREE.ShaderChunk.linear_to_gamma_fragment = "#ifdef GAMMA_OUTPUT\n\n	gl_FragColor.xyz = sqrt( gl_FragColor.xyz );\n\n#endif", 
THREE.ShaderChunk.color_pars_vertex = "#ifdef USE_COLOR\n\n	varying vec3 vColor;\n\n#endif", 
THREE.ShaderChunk.lights_lambert_pars_vertex = "uniform vec3 ambient;\nuniform vec3 diffuse;\nuniform vec3 emissive;\n\nuniform vec3 ambientLightColor;\n\n#if MAX_DIR_LIGHTS > 0\n\n	uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\n	uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	uniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n	uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	uniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n\n#endif\n\n#ifdef WRAP_AROUND\n\n	uniform vec3 wrapRGB;\n\n#endif\n", 
THREE.ShaderChunk.map_pars_vertex = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP )\n\n	varying vec2 vUv;\n	uniform vec4 offsetRepeat;\n\n#endif\n", 
THREE.ShaderChunk.envmap_fragment = "#ifdef USE_ENVMAP\n\n	vec3 reflectVec;\n\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP )\n\n		vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );\n\n		// http://en.wikibooks.org/wiki/GLSL_Programming/Applying_Matrix_Transformations\n		// Transforming Normal Vectors with the Inverse Transformation\n\n		vec3 worldNormal = normalize( vec3( vec4( normal, 0.0 ) * viewMatrix ) );\n\n		if ( useRefract ) {\n\n			reflectVec = refract( cameraToVertex, worldNormal, refractionRatio );\n\n		} else { \n\n			reflectVec = reflect( cameraToVertex, worldNormal );\n\n		}\n\n	#else\n\n		reflectVec = vReflect;\n\n	#endif\n\n	#ifdef DOUBLE_SIDED\n\n		float flipNormal = ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n		vec4 cubeColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n\n	#else\n\n		vec4 cubeColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n\n	#endif\n\n	#ifdef GAMMA_INPUT\n\n		cubeColor.xyz *= cubeColor.xyz;\n\n	#endif\n\n	if ( combine == 1 ) {\n\n		gl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, specularStrength * reflectivity );\n\n	} else if ( combine == 2 ) {\n\n		gl_FragColor.xyz += cubeColor.xyz * specularStrength * reflectivity;\n\n	} else {\n\n		gl_FragColor.xyz = mix( gl_FragColor.xyz, gl_FragColor.xyz * cubeColor.xyz, specularStrength * reflectivity );\n\n	}\n\n#endif", 
THREE.ShaderChunk.specularmap_pars_fragment = "#ifdef USE_SPECULARMAP\n\n	uniform sampler2D specularMap;\n\n#endif", 
THREE.ShaderChunk.logdepthbuf_vertex = "#ifdef USE_LOGDEPTHBUF\n\n	gl_Position.z = log2(max(1e-6, gl_Position.w + 1.0)) * logDepthBufFC;\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		vFragDepth = 1.0 + gl_Position.w;\n\n#else\n\n		gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;\n\n	#endif\n\n#endif", 
THREE.ShaderChunk.morphtarget_pars_vertex = "#ifdef USE_MORPHTARGETS\n\n	#ifndef USE_MORPHNORMALS\n\n	uniform float morphTargetInfluences[ 8 ];\n\n	#else\n\n	uniform float morphTargetInfluences[ 4 ];\n\n	#endif\n\n#endif", 
THREE.ShaderChunk.specularmap_fragment = "float specularStrength;\n\n#ifdef USE_SPECULARMAP\n\n	vec4 texelSpecular = texture2D( specularMap, vUv );\n	specularStrength = texelSpecular.r;\n\n#else\n\n	specularStrength = 1.0;\n\n#endif", 
THREE.ShaderChunk.fog_fragment = "#ifdef USE_FOG\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		float depth = gl_FragDepthEXT / gl_FragCoord.w;\n\n	#else\n\n		float depth = gl_FragCoord.z / gl_FragCoord.w;\n\n	#endif\n\n	#ifdef FOG_EXP2\n\n		const float LOG2 = 1.442695;\n		float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\n		fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n\n	#else\n\n		float fogFactor = smoothstep( fogNear, fogFar, depth );\n\n	#endif\n	\n	gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n\n#endif", 
THREE.ShaderChunk.bumpmap_pars_fragment = "#ifdef USE_BUMPMAP\n\n	uniform sampler2D bumpMap;\n	uniform float bumpScale;\n\n			// Derivative maps - bump mapping unparametrized surfaces by Morten Mikkelsen\n			//	http://mmikkelsen3d.blogspot.sk/2011/07/derivative-maps.html\n\n			// Evaluate the derivative of the height w.r.t. screen-space using forward differencing (listing 2)\n\n	vec2 dHdxy_fwd() {\n\n		vec2 dSTdx = dFdx( vUv );\n		vec2 dSTdy = dFdy( vUv );\n\n		float Hll = bumpScale * texture2D( bumpMap, vUv ).x;\n		float dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;\n		float dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;\n\n		return vec2( dBx, dBy );\n\n	}\n\n	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {\n\n		vec3 vSigmaX = dFdx( surf_pos );\n		vec3 vSigmaY = dFdy( surf_pos );\n		vec3 vN = surf_norm;		// normalized\n\n		vec3 R1 = cross( vSigmaY, vN );\n		vec3 R2 = cross( vN, vSigmaX );\n\n		float fDet = dot( vSigmaX, R1 );\n\n		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n		return normalize( abs( fDet ) * surf_norm - vGrad );\n\n	}\n\n#endif", 
THREE.ShaderChunk.defaultnormal_vertex = "vec3 objectNormal;\n\n#ifdef USE_SKINNING\n\n	objectNormal = skinnedNormal.xyz;\n\n#endif\n\n#if !defined( USE_SKINNING ) && defined( USE_MORPHNORMALS )\n\n	objectNormal = morphedNormal;\n\n#endif\n\n#if !defined( USE_SKINNING ) && ! defined( USE_MORPHNORMALS )\n\n	objectNormal = normal;\n\n#endif\n\n#ifdef FLIP_SIDED\n\n	objectNormal = -objectNormal;\n\n#endif\n\nvec3 transformedNormal = normalMatrix * objectNormal;", 
THREE.ShaderChunk.lights_phong_pars_fragment = "uniform vec3 ambientLightColor;\n\n#if MAX_DIR_LIGHTS > 0\n\n	uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\n	uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	uniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n\n	uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	uniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n\n	uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined( USE_ENVMAP )\n\n	varying vec3 vWorldPosition;\n\n#endif\n\n#ifdef WRAP_AROUND\n\n	uniform vec3 wrapRGB;\n\n#endif\n\nvarying vec3 vViewPosition;\nvarying vec3 vNormal;", 
THREE.ShaderChunk.skinbase_vertex = "#ifdef USE_SKINNING\n\n	mat4 boneMatX = getBoneMatrix( skinIndex.x );\n	mat4 boneMatY = getBoneMatrix( skinIndex.y );\n	mat4 boneMatZ = getBoneMatrix( skinIndex.z );\n	mat4 boneMatW = getBoneMatrix( skinIndex.w );\n\n#endif", 
THREE.ShaderChunk.map_vertex = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP )\n\n	vUv = uv * offsetRepeat.zw + offsetRepeat.xy;\n\n#endif", 
THREE.ShaderChunk.lightmap_fragment = "#ifdef USE_LIGHTMAP\n\n	gl_FragColor = gl_FragColor * texture2D( lightMap, vUv2 );\n\n#endif", 
THREE.ShaderChunk.shadowmap_pars_vertex = "#ifdef USE_SHADOWMAP\n\n	varying vec4 vShadowCoord[ MAX_SHADOWS ];\n	uniform mat4 shadowMatrix[ MAX_SHADOWS ];\n\n#endif", 
THREE.ShaderChunk.color_fragment = "#ifdef USE_COLOR\n\n	gl_FragColor = gl_FragColor * vec4( vColor, 1.0 );\n\n#endif", 
THREE.ShaderChunk.morphtarget_vertex = "#ifdef USE_MORPHTARGETS\n\n	vec3 morphed = vec3( 0.0 );\n	morphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];\n	morphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];\n	morphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];\n	morphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\n\n	#ifndef USE_MORPHNORMALS\n\n	morphed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];\n	morphed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];\n	morphed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];\n	morphed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\n\n	#endif\n\n	morphed += position;\n\n#endif", 
THREE.ShaderChunk.envmap_vertex = "#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP )\n\n	vec3 worldNormal = mat3( modelMatrix[ 0 ].xyz, modelMatrix[ 1 ].xyz, modelMatrix[ 2 ].xyz ) * objectNormal;\n	worldNormal = normalize( worldNormal );\n\n	vec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );\n\n	if ( useRefract ) {\n\n		vReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n\n	} else {\n\n		vReflect = reflect( cameraToVertex, worldNormal );\n\n	}\n\n#endif", 
THREE.ShaderChunk.shadowmap_fragment = "#ifdef USE_SHADOWMAP\n\n	#ifdef SHADOWMAP_DEBUG\n\n		vec3 frustumColors[3];\n		frustumColors[0] = vec3( 1.0, 0.5, 0.0 );\n		frustumColors[1] = vec3( 0.0, 1.0, 0.8 );\n		frustumColors[2] = vec3( 0.0, 0.5, 1.0 );\n\n	#endif\n\n	#ifdef SHADOWMAP_CASCADE\n\n		int inFrustumCount = 0;\n\n	#endif\n\n	float fDepth;\n	vec3 shadowColor = vec3( 1.0 );\n\n	for( int i = 0; i < MAX_SHADOWS; i ++ ) {\n\n		vec3 shadowCoord = vShadowCoord[ i ].xyz / vShadowCoord[ i ].w;\n\n				// if ( something && something ) breaks ATI OpenGL shader compiler\n				// if ( all( something, something ) ) using this instead\n\n		bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n		bool inFrustum = all( inFrustumVec );\n\n				// don't shadow pixels outside of light frustum\n				// use just first frustum (for cascades)\n				// don't shadow pixels behind far plane of light frustum\n\n		#ifdef SHADOWMAP_CASCADE\n\n			inFrustumCount += int( inFrustum );\n			bvec3 frustumTestVec = bvec3( inFrustum, inFrustumCount == 1, shadowCoord.z <= 1.0 );\n\n		#else\n\n			bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n\n		#endif\n\n		bool frustumTest = all( frustumTestVec );\n\n		if ( frustumTest ) {\n\n			shadowCoord.z += shadowBias[ i ];\n\n			#if defined( SHADOWMAP_TYPE_PCF )\n\n						// Percentage-close filtering\n						// (9 pixel kernel)\n						// http://fabiensanglard.net/shadowmappingPCF/\n\n				float shadow = 0.0;\n\n		/*\n						// nested loops breaks shader compiler / validator on some ATI cards when using OpenGL\n						// must enroll loop manually\n\n				for ( float y = -1.25; y <= 1.25; y += 1.25 )\n					for ( float x = -1.25; x <= 1.25; x += 1.25 ) {\n\n						vec4 rgbaDepth = texture2D( shadowMap[ i ], vec2( x * xPixelOffset, y * yPixelOffset ) + shadowCoord.xy );\n\n								// doesn't seem to produce any noticeable visual difference compared to simple texture2D lookup\n								//vec4 rgbaDepth = texture2DProj( shadowMap[ i ], vec4( vShadowCoord[ i ].w * ( vec2( x * xPixelOffset, y * yPixelOffset ) + shadowCoord.xy ), 0.05, vShadowCoord[ i ].w ) );\n\n						float fDepth = unpackDepth( rgbaDepth );\n\n						if ( fDepth < shadowCoord.z )\n							shadow += 1.0;\n\n				}\n\n				shadow /= 9.0;\n\n		*/\n\n				const float shadowDelta = 1.0 / 9.0;\n\n				float xPixelOffset = 1.0 / shadowMapSize[ i ].x;\n				float yPixelOffset = 1.0 / shadowMapSize[ i ].y;\n\n				float dx0 = -1.25 * xPixelOffset;\n				float dy0 = -1.25 * yPixelOffset;\n				float dx1 = 1.25 * xPixelOffset;\n				float dy1 = 1.25 * yPixelOffset;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				shadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness[ i ] * shadow ) );\n\n			#elif defined( SHADOWMAP_TYPE_PCF_SOFT )\n\n						// Percentage-close filtering\n						// (9 pixel kernel)\n						// http://fabiensanglard.net/shadowmappingPCF/\n\n				float shadow = 0.0;\n\n				float xPixelOffset = 1.0 / shadowMapSize[ i ].x;\n				float yPixelOffset = 1.0 / shadowMapSize[ i ].y;\n\n				float dx0 = -1.0 * xPixelOffset;\n				float dy0 = -1.0 * yPixelOffset;\n				float dx1 = 1.0 * xPixelOffset;\n				float dy1 = 1.0 * yPixelOffset;\n\n				mat3 shadowKernel;\n				mat3 depthKernel;\n\n				depthKernel[0][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\n				depthKernel[0][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\n				depthKernel[0][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\n				depthKernel[1][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\n				depthKernel[1][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\n				depthKernel[1][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\n				depthKernel[2][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\n				depthKernel[2][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\n				depthKernel[2][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\n\n				vec3 shadowZ = vec3( shadowCoord.z );\n				shadowKernel[0] = vec3(lessThan(depthKernel[0], shadowZ ));\n				shadowKernel[0] *= vec3(0.25);\n\n				shadowKernel[1] = vec3(lessThan(depthKernel[1], shadowZ ));\n				shadowKernel[1] *= vec3(0.25);\n\n				shadowKernel[2] = vec3(lessThan(depthKernel[2], shadowZ ));\n				shadowKernel[2] *= vec3(0.25);\n\n				vec2 fractionalCoord = 1.0 - fract( shadowCoord.xy * shadowMapSize[i].xy );\n\n				shadowKernel[0] = mix( shadowKernel[1], shadowKernel[0], fractionalCoord.x );\n				shadowKernel[1] = mix( shadowKernel[2], shadowKernel[1], fractionalCoord.x );\n\n				vec4 shadowValues;\n				shadowValues.x = mix( shadowKernel[0][1], shadowKernel[0][0], fractionalCoord.y );\n				shadowValues.y = mix( shadowKernel[0][2], shadowKernel[0][1], fractionalCoord.y );\n				shadowValues.z = mix( shadowKernel[1][1], shadowKernel[1][0], fractionalCoord.y );\n				shadowValues.w = mix( shadowKernel[1][2], shadowKernel[1][1], fractionalCoord.y );\n\n				shadow = dot( shadowValues, vec4( 1.0 ) );\n\n				shadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness[ i ] * shadow ) );\n\n			#else\n\n				vec4 rgbaDepth = texture2D( shadowMap[ i ], shadowCoord.xy );\n				float fDepth = unpackDepth( rgbaDepth );\n\n				if ( fDepth < shadowCoord.z )\n\n		// spot with multiple shadows is darker\n\n					shadowColor = shadowColor * vec3( 1.0 - shadowDarkness[ i ] );\n\n		// spot with multiple shadows has the same color as single shadow spot\n\n		// 					shadowColor = min( shadowColor, vec3( shadowDarkness[ i ] ) );\n\n			#endif\n\n		}\n\n\n		#ifdef SHADOWMAP_DEBUG\n\n			#ifdef SHADOWMAP_CASCADE\n\n				if ( inFrustum && inFrustumCount == 1 ) gl_FragColor.xyz *= frustumColors[ i ];\n\n			#else\n\n				if ( inFrustum ) gl_FragColor.xyz *= frustumColors[ i ];\n\n			#endif\n\n		#endif\n\n	}\n\n	#ifdef GAMMA_OUTPUT\n\n		shadowColor *= shadowColor;\n\n	#endif\n\n	gl_FragColor.xyz = gl_FragColor.xyz * shadowColor;\n\n#endif\n", 
THREE.ShaderChunk.worldpos_vertex = "#if defined( USE_ENVMAP ) || defined( PHONG ) || defined( LAMBERT ) || defined ( USE_SHADOWMAP )\n\n	#ifdef USE_SKINNING\n\n		vec4 worldPosition = modelMatrix * skinned;\n\n	#endif\n\n	#if defined( USE_MORPHTARGETS ) && ! defined( USE_SKINNING )\n\n		vec4 worldPosition = modelMatrix * vec4( morphed, 1.0 );\n\n	#endif\n\n	#if ! defined( USE_MORPHTARGETS ) && ! defined( USE_SKINNING )\n\n		vec4 worldPosition = modelMatrix * vec4( position, 1.0 );\n\n	#endif\n\n#endif", 
THREE.ShaderChunk.shadowmap_pars_fragment = "#ifdef USE_SHADOWMAP\n\n	uniform sampler2D shadowMap[ MAX_SHADOWS ];\n	uniform vec2 shadowMapSize[ MAX_SHADOWS ];\n\n	uniform float shadowDarkness[ MAX_SHADOWS ];\n	uniform float shadowBias[ MAX_SHADOWS ];\n\n	varying vec4 vShadowCoord[ MAX_SHADOWS ];\n\n	float unpackDepth( const in vec4 rgba_depth ) {\n\n		const vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );\n		float depth = dot( rgba_depth, bit_shift );\n		return depth;\n\n	}\n\n#endif", 
THREE.ShaderChunk.skinning_pars_vertex = "#ifdef USE_SKINNING\n\n	uniform mat4 bindMatrix;\n	uniform mat4 bindMatrixInverse;\n\n	#ifdef BONE_TEXTURE\n\n		uniform sampler2D boneTexture;\n		uniform int boneTextureWidth;\n		uniform int boneTextureHeight;\n\n		mat4 getBoneMatrix( const in float i ) {\n\n			float j = i * 4.0;\n			float x = mod( j, float( boneTextureWidth ) );\n			float y = floor( j / float( boneTextureWidth ) );\n\n			float dx = 1.0 / float( boneTextureWidth );\n			float dy = 1.0 / float( boneTextureHeight );\n\n			y = dy * ( y + 0.5 );\n\n			vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\n			vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\n			vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\n			vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\n\n			mat4 bone = mat4( v1, v2, v3, v4 );\n\n			return bone;\n\n		}\n\n	#else\n\n		uniform mat4 boneGlobalMatrices[ MAX_BONES ];\n\n		mat4 getBoneMatrix( const in float i ) {\n\n			mat4 bone = boneGlobalMatrices[ int(i) ];\n			return bone;\n\n		}\n\n	#endif\n\n#endif\n", 
THREE.ShaderChunk.logdepthbuf_pars_fragment = "#ifdef USE_LOGDEPTHBUF\n\n	uniform float logDepthBufFC;\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		#extension GL_EXT_frag_depth : enable\n		varying float vFragDepth;\n\n	#endif\n\n#endif", 
THREE.ShaderChunk.alphamap_fragment = "#ifdef USE_ALPHAMAP\n\n	gl_FragColor.a *= texture2D( alphaMap, vUv ).g;\n\n#endif\n", 
THREE.ShaderChunk.alphamap_pars_fragment = "#ifdef USE_ALPHAMAP\n\n	uniform sampler2D alphaMap;\n\n#endif\n", 
THREE.UniformsUtils = {
    merge: function(uniforms) {
        var u, p, tmp, merged = {};
        for (u = 0; u < uniforms.length; u++) {
            tmp = this.clone(uniforms[u]);
            for (p in tmp) merged[p] = tmp[p];
        }
        return merged;
    },
    clone: function(uniforms_src) {
        var u, p, parameter_src, uniforms_dst = {};
        for (u in uniforms_src) {
            uniforms_dst[u] = {};
            for (p in uniforms_src[u]) parameter_src = uniforms_src[u][p], uniforms_dst[u][p] = parameter_src instanceof THREE.Color || parameter_src instanceof THREE.Vector2 || parameter_src instanceof THREE.Vector3 || parameter_src instanceof THREE.Vector4 || parameter_src instanceof THREE.Matrix4 || parameter_src instanceof THREE.Texture ? parameter_src.clone() : parameter_src instanceof Array ? parameter_src.slice() : parameter_src;
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
        useRefract: {
            type: "i",
            value: 0
        },
        reflectivity: {
            type: "f",
            value: 1
        },
        refractionRatio: {
            type: "f",
            value: .98
        },
        combine: {
            type: "i",
            value: 0
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
        vertexShader: [ THREE.ShaderChunk.map_pars_vertex, THREE.ShaderChunk.lightmap_pars_vertex, THREE.ShaderChunk.envmap_pars_vertex, THREE.ShaderChunk.color_pars_vertex, THREE.ShaderChunk.morphtarget_pars_vertex, THREE.ShaderChunk.skinning_pars_vertex, THREE.ShaderChunk.shadowmap_pars_vertex, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", THREE.ShaderChunk.map_vertex, THREE.ShaderChunk.lightmap_vertex, THREE.ShaderChunk.color_vertex, THREE.ShaderChunk.skinbase_vertex, "	#ifdef USE_ENVMAP", THREE.ShaderChunk.morphnormal_vertex, THREE.ShaderChunk.skinnormal_vertex, THREE.ShaderChunk.defaultnormal_vertex, "	#endif", THREE.ShaderChunk.morphtarget_vertex, THREE.ShaderChunk.skinning_vertex, THREE.ShaderChunk.default_vertex, THREE.ShaderChunk.logdepthbuf_vertex, THREE.ShaderChunk.worldpos_vertex, THREE.ShaderChunk.envmap_vertex, THREE.ShaderChunk.shadowmap_vertex, "}" ].join("\n"),
        fragmentShader: [ "uniform vec3 diffuse;", "uniform float opacity;", THREE.ShaderChunk.color_pars_fragment, THREE.ShaderChunk.map_pars_fragment, THREE.ShaderChunk.alphamap_pars_fragment, THREE.ShaderChunk.lightmap_pars_fragment, THREE.ShaderChunk.envmap_pars_fragment, THREE.ShaderChunk.fog_pars_fragment, THREE.ShaderChunk.shadowmap_pars_fragment, THREE.ShaderChunk.specularmap_pars_fragment, THREE.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	gl_FragColor = vec4( diffuse, opacity );", THREE.ShaderChunk.logdepthbuf_fragment, THREE.ShaderChunk.map_fragment, THREE.ShaderChunk.alphamap_fragment, THREE.ShaderChunk.alphatest_fragment, THREE.ShaderChunk.specularmap_fragment, THREE.ShaderChunk.lightmap_fragment, THREE.ShaderChunk.color_fragment, THREE.ShaderChunk.envmap_fragment, THREE.ShaderChunk.shadowmap_fragment, THREE.ShaderChunk.linear_to_gamma_fragment, THREE.ShaderChunk.fog_fragment, "}" ].join("\n")
    },
    lambert: {
        uniforms: THREE.UniformsUtils.merge([ THREE.UniformsLib.common, THREE.UniformsLib.fog, THREE.UniformsLib.lights, THREE.UniformsLib.shadowmap, {
            ambient: {
                type: "c",
                value: new THREE.Color(16777215)
            },
            emissive: {
                type: "c",
                value: new THREE.Color(0)
            },
            wrapRGB: {
                type: "v3",
                value: new THREE.Vector3(1, 1, 1)
            }
        } ]),
        vertexShader: [ "#define LAMBERT", "varying vec3 vLightFront;", "#ifdef DOUBLE_SIDED", "	varying vec3 vLightBack;", "#endif", THREE.ShaderChunk.map_pars_vertex, THREE.ShaderChunk.lightmap_pars_vertex, THREE.ShaderChunk.envmap_pars_vertex, THREE.ShaderChunk.lights_lambert_pars_vertex, THREE.ShaderChunk.color_pars_vertex, THREE.ShaderChunk.morphtarget_pars_vertex, THREE.ShaderChunk.skinning_pars_vertex, THREE.ShaderChunk.shadowmap_pars_vertex, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", THREE.ShaderChunk.map_vertex, THREE.ShaderChunk.lightmap_vertex, THREE.ShaderChunk.color_vertex, THREE.ShaderChunk.morphnormal_vertex, THREE.ShaderChunk.skinbase_vertex, THREE.ShaderChunk.skinnormal_vertex, THREE.ShaderChunk.defaultnormal_vertex, THREE.ShaderChunk.morphtarget_vertex, THREE.ShaderChunk.skinning_vertex, THREE.ShaderChunk.default_vertex, THREE.ShaderChunk.logdepthbuf_vertex, THREE.ShaderChunk.worldpos_vertex, THREE.ShaderChunk.envmap_vertex, THREE.ShaderChunk.lights_lambert_vertex, THREE.ShaderChunk.shadowmap_vertex, "}" ].join("\n"),
        fragmentShader: [ "uniform float opacity;", "varying vec3 vLightFront;", "#ifdef DOUBLE_SIDED", "	varying vec3 vLightBack;", "#endif", THREE.ShaderChunk.color_pars_fragment, THREE.ShaderChunk.map_pars_fragment, THREE.ShaderChunk.alphamap_pars_fragment, THREE.ShaderChunk.lightmap_pars_fragment, THREE.ShaderChunk.envmap_pars_fragment, THREE.ShaderChunk.fog_pars_fragment, THREE.ShaderChunk.shadowmap_pars_fragment, THREE.ShaderChunk.specularmap_pars_fragment, THREE.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	gl_FragColor = vec4( vec3( 1.0 ), opacity );", THREE.ShaderChunk.logdepthbuf_fragment, THREE.ShaderChunk.map_fragment, THREE.ShaderChunk.alphamap_fragment, THREE.ShaderChunk.alphatest_fragment, THREE.ShaderChunk.specularmap_fragment, "	#ifdef DOUBLE_SIDED", "		if ( gl_FrontFacing )", "			gl_FragColor.xyz *= vLightFront;", "		else", "			gl_FragColor.xyz *= vLightBack;", "	#else", "		gl_FragColor.xyz *= vLightFront;", "	#endif", THREE.ShaderChunk.lightmap_fragment, THREE.ShaderChunk.color_fragment, THREE.ShaderChunk.envmap_fragment, THREE.ShaderChunk.shadowmap_fragment, THREE.ShaderChunk.linear_to_gamma_fragment, THREE.ShaderChunk.fog_fragment, "}" ].join("\n")
    },
    phong: {
        uniforms: THREE.UniformsUtils.merge([ THREE.UniformsLib.common, THREE.UniformsLib.bump, THREE.UniformsLib.normalmap, THREE.UniformsLib.fog, THREE.UniformsLib.lights, THREE.UniformsLib.shadowmap, {
            ambient: {
                type: "c",
                value: new THREE.Color(16777215)
            },
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
        vertexShader: [ "#define PHONG", "varying vec3 vViewPosition;", "varying vec3 vNormal;", THREE.ShaderChunk.map_pars_vertex, THREE.ShaderChunk.lightmap_pars_vertex, THREE.ShaderChunk.envmap_pars_vertex, THREE.ShaderChunk.lights_phong_pars_vertex, THREE.ShaderChunk.color_pars_vertex, THREE.ShaderChunk.morphtarget_pars_vertex, THREE.ShaderChunk.skinning_pars_vertex, THREE.ShaderChunk.shadowmap_pars_vertex, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", THREE.ShaderChunk.map_vertex, THREE.ShaderChunk.lightmap_vertex, THREE.ShaderChunk.color_vertex, THREE.ShaderChunk.morphnormal_vertex, THREE.ShaderChunk.skinbase_vertex, THREE.ShaderChunk.skinnormal_vertex, THREE.ShaderChunk.defaultnormal_vertex, "	vNormal = normalize( transformedNormal );", THREE.ShaderChunk.morphtarget_vertex, THREE.ShaderChunk.skinning_vertex, THREE.ShaderChunk.default_vertex, THREE.ShaderChunk.logdepthbuf_vertex, "	vViewPosition = -mvPosition.xyz;", THREE.ShaderChunk.worldpos_vertex, THREE.ShaderChunk.envmap_vertex, THREE.ShaderChunk.lights_phong_vertex, THREE.ShaderChunk.shadowmap_vertex, "}" ].join("\n"),
        fragmentShader: [ "uniform vec3 diffuse;", "uniform float opacity;", "uniform vec3 ambient;", "uniform vec3 emissive;", "uniform vec3 specular;", "uniform float shininess;", THREE.ShaderChunk.color_pars_fragment, THREE.ShaderChunk.map_pars_fragment, THREE.ShaderChunk.alphamap_pars_fragment, THREE.ShaderChunk.lightmap_pars_fragment, THREE.ShaderChunk.envmap_pars_fragment, THREE.ShaderChunk.fog_pars_fragment, THREE.ShaderChunk.lights_phong_pars_fragment, THREE.ShaderChunk.shadowmap_pars_fragment, THREE.ShaderChunk.bumpmap_pars_fragment, THREE.ShaderChunk.normalmap_pars_fragment, THREE.ShaderChunk.specularmap_pars_fragment, THREE.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	gl_FragColor = vec4( vec3( 1.0 ), opacity );", THREE.ShaderChunk.logdepthbuf_fragment, THREE.ShaderChunk.map_fragment, THREE.ShaderChunk.alphamap_fragment, THREE.ShaderChunk.alphatest_fragment, THREE.ShaderChunk.specularmap_fragment, THREE.ShaderChunk.lights_phong_fragment, THREE.ShaderChunk.lightmap_fragment, THREE.ShaderChunk.color_fragment, THREE.ShaderChunk.envmap_fragment, THREE.ShaderChunk.shadowmap_fragment, THREE.ShaderChunk.linear_to_gamma_fragment, THREE.ShaderChunk.fog_fragment, "}" ].join("\n")
    },
    particle_basic: {
        uniforms: THREE.UniformsUtils.merge([ THREE.UniformsLib.particle, THREE.UniformsLib.shadowmap ]),
        vertexShader: [ "uniform float size;", "uniform float scale;", THREE.ShaderChunk.color_pars_vertex, THREE.ShaderChunk.shadowmap_pars_vertex, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", THREE.ShaderChunk.color_vertex, "	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );", "	#ifdef USE_SIZEATTENUATION", "		gl_PointSize = size * ( scale / length( mvPosition.xyz ) );", "	#else", "		gl_PointSize = size;", "	#endif", "	gl_Position = projectionMatrix * mvPosition;", THREE.ShaderChunk.logdepthbuf_vertex, THREE.ShaderChunk.worldpos_vertex, THREE.ShaderChunk.shadowmap_vertex, "}" ].join("\n"),
        fragmentShader: [ "uniform vec3 psColor;", "uniform float opacity;", THREE.ShaderChunk.color_pars_fragment, THREE.ShaderChunk.map_particle_pars_fragment, THREE.ShaderChunk.fog_pars_fragment, THREE.ShaderChunk.shadowmap_pars_fragment, THREE.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	gl_FragColor = vec4( psColor, opacity );", THREE.ShaderChunk.logdepthbuf_fragment, THREE.ShaderChunk.map_particle_fragment, THREE.ShaderChunk.alphatest_fragment, THREE.ShaderChunk.color_fragment, THREE.ShaderChunk.shadowmap_fragment, THREE.ShaderChunk.fog_fragment, "}" ].join("\n")
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
        vertexShader: [ "uniform float scale;", "attribute float lineDistance;", "varying float vLineDistance;", THREE.ShaderChunk.color_pars_vertex, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", THREE.ShaderChunk.color_vertex, "	vLineDistance = scale * lineDistance;", "	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );", "	gl_Position = projectionMatrix * mvPosition;", THREE.ShaderChunk.logdepthbuf_vertex, "}" ].join("\n"),
        fragmentShader: [ "uniform vec3 diffuse;", "uniform float opacity;", "uniform float dashSize;", "uniform float totalSize;", "varying float vLineDistance;", THREE.ShaderChunk.color_pars_fragment, THREE.ShaderChunk.fog_pars_fragment, THREE.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	if ( mod( vLineDistance, totalSize ) > dashSize ) {", "		discard;", "	}", "	gl_FragColor = vec4( diffuse, opacity );", THREE.ShaderChunk.logdepthbuf_fragment, THREE.ShaderChunk.color_fragment, THREE.ShaderChunk.fog_fragment, "}" ].join("\n")
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
        vertexShader: [ THREE.ShaderChunk.morphtarget_pars_vertex, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", THREE.ShaderChunk.morphtarget_vertex, THREE.ShaderChunk.default_vertex, THREE.ShaderChunk.logdepthbuf_vertex, "}" ].join("\n"),
        fragmentShader: [ "uniform float mNear;", "uniform float mFar;", "uniform float opacity;", THREE.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", THREE.ShaderChunk.logdepthbuf_fragment, "	#ifdef USE_LOGDEPTHBUF_EXT", "		float depth = gl_FragDepthEXT / gl_FragCoord.w;", "	#else", "		float depth = gl_FragCoord.z / gl_FragCoord.w;", "	#endif", "	float color = 1.0 - smoothstep( mNear, mFar, depth );", "	gl_FragColor = vec4( vec3( color ), opacity );", "}" ].join("\n")
    },
    normal: {
        uniforms: {
            opacity: {
                type: "f",
                value: 1
            }
        },
        vertexShader: [ "varying vec3 vNormal;", THREE.ShaderChunk.morphtarget_pars_vertex, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", "	vNormal = normalize( normalMatrix * normal );", THREE.ShaderChunk.morphtarget_vertex, THREE.ShaderChunk.default_vertex, THREE.ShaderChunk.logdepthbuf_vertex, "}" ].join("\n"),
        fragmentShader: [ "uniform float opacity;", "varying vec3 vNormal;", THREE.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	gl_FragColor = vec4( 0.5 * normalize( vNormal ) + 0.5, opacity );", THREE.ShaderChunk.logdepthbuf_fragment, "}" ].join("\n")
    },
    normalmap: {
        uniforms: THREE.UniformsUtils.merge([ THREE.UniformsLib.fog, THREE.UniformsLib.lights, THREE.UniformsLib.shadowmap, {
            enableAO: {
                type: "i",
                value: 0
            },
            enableDiffuse: {
                type: "i",
                value: 0
            },
            enableSpecular: {
                type: "i",
                value: 0
            },
            enableReflection: {
                type: "i",
                value: 0
            },
            enableDisplacement: {
                type: "i",
                value: 0
            },
            tDisplacement: {
                type: "t",
                value: null
            },
            tDiffuse: {
                type: "t",
                value: null
            },
            tCube: {
                type: "t",
                value: null
            },
            tNormal: {
                type: "t",
                value: null
            },
            tSpecular: {
                type: "t",
                value: null
            },
            tAO: {
                type: "t",
                value: null
            },
            uNormalScale: {
                type: "v2",
                value: new THREE.Vector2(1, 1)
            },
            uDisplacementBias: {
                type: "f",
                value: 0
            },
            uDisplacementScale: {
                type: "f",
                value: 1
            },
            diffuse: {
                type: "c",
                value: new THREE.Color(16777215)
            },
            specular: {
                type: "c",
                value: new THREE.Color(1118481)
            },
            ambient: {
                type: "c",
                value: new THREE.Color(16777215)
            },
            shininess: {
                type: "f",
                value: 30
            },
            opacity: {
                type: "f",
                value: 1
            },
            useRefract: {
                type: "i",
                value: 0
            },
            refractionRatio: {
                type: "f",
                value: .98
            },
            reflectivity: {
                type: "f",
                value: .5
            },
            uOffset: {
                type: "v2",
                value: new THREE.Vector2(0, 0)
            },
            uRepeat: {
                type: "v2",
                value: new THREE.Vector2(1, 1)
            },
            wrapRGB: {
                type: "v3",
                value: new THREE.Vector3(1, 1, 1)
            }
        } ]),
        fragmentShader: [ "uniform vec3 ambient;", "uniform vec3 diffuse;", "uniform vec3 specular;", "uniform float shininess;", "uniform float opacity;", "uniform bool enableDiffuse;", "uniform bool enableSpecular;", "uniform bool enableAO;", "uniform bool enableReflection;", "uniform sampler2D tDiffuse;", "uniform sampler2D tNormal;", "uniform sampler2D tSpecular;", "uniform sampler2D tAO;", "uniform samplerCube tCube;", "uniform vec2 uNormalScale;", "uniform bool useRefract;", "uniform float refractionRatio;", "uniform float reflectivity;", "varying vec3 vTangent;", "varying vec3 vBinormal;", "varying vec3 vNormal;", "varying vec2 vUv;", "uniform vec3 ambientLightColor;", "#if MAX_DIR_LIGHTS > 0", "	uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];", "	uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];", "#endif", "#if MAX_HEMI_LIGHTS > 0", "	uniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];", "	uniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];", "	uniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];", "#endif", "#if MAX_POINT_LIGHTS > 0", "	uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];", "	uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];", "	uniform float pointLightDistance[ MAX_POINT_LIGHTS ];", "#endif", "#if MAX_SPOT_LIGHTS > 0", "	uniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];", "	uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];", "	uniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];", "	uniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];", "	uniform float spotLightExponent[ MAX_SPOT_LIGHTS ];", "	uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];", "#endif", "#ifdef WRAP_AROUND", "	uniform vec3 wrapRGB;", "#endif", "varying vec3 vWorldPosition;", "varying vec3 vViewPosition;", THREE.ShaderChunk.shadowmap_pars_fragment, THREE.ShaderChunk.fog_pars_fragment, THREE.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", THREE.ShaderChunk.logdepthbuf_fragment, "	gl_FragColor = vec4( vec3( 1.0 ), opacity );", "	vec3 specularTex = vec3( 1.0 );", "	vec3 normalTex = texture2D( tNormal, vUv ).xyz * 2.0 - 1.0;", "	normalTex.xy *= uNormalScale;", "	normalTex = normalize( normalTex );", "	if( enableDiffuse ) {", "		#ifdef GAMMA_INPUT", "			vec4 texelColor = texture2D( tDiffuse, vUv );", "			texelColor.xyz *= texelColor.xyz;", "			gl_FragColor = gl_FragColor * texelColor;", "		#else", "			gl_FragColor = gl_FragColor * texture2D( tDiffuse, vUv );", "		#endif", "	}", "	if( enableAO ) {", "		#ifdef GAMMA_INPUT", "			vec4 aoColor = texture2D( tAO, vUv );", "			aoColor.xyz *= aoColor.xyz;", "			gl_FragColor.xyz = gl_FragColor.xyz * aoColor.xyz;", "		#else", "			gl_FragColor.xyz = gl_FragColor.xyz * texture2D( tAO, vUv ).xyz;", "		#endif", "	}", THREE.ShaderChunk.alphatest_fragment, "	if( enableSpecular )", "		specularTex = texture2D( tSpecular, vUv ).xyz;", "	mat3 tsb = mat3( normalize( vTangent ), normalize( vBinormal ), normalize( vNormal ) );", "	vec3 finalNormal = tsb * normalTex;", "	#ifdef FLIP_SIDED", "		finalNormal = -finalNormal;", "	#endif", "	vec3 normal = normalize( finalNormal );", "	vec3 viewPosition = normalize( vViewPosition );", "	#if MAX_POINT_LIGHTS > 0", "		vec3 pointDiffuse = vec3( 0.0 );", "		vec3 pointSpecular = vec3( 0.0 );", "		for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {", "			vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );", "			vec3 pointVector = lPosition.xyz + vViewPosition.xyz;", "			float pointDistance = 1.0;", "			if ( pointLightDistance[ i ] > 0.0 )", "				pointDistance = 1.0 - min( ( length( pointVector ) / pointLightDistance[ i ] ), 1.0 );", "			pointVector = normalize( pointVector );", "			#ifdef WRAP_AROUND", "				float pointDiffuseWeightFull = max( dot( normal, pointVector ), 0.0 );", "				float pointDiffuseWeightHalf = max( 0.5 * dot( normal, pointVector ) + 0.5, 0.0 );", "				vec3 pointDiffuseWeight = mix( vec3( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );", "			#else", "				float pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );", "			#endif", "			pointDiffuse += pointDistance * pointLightColor[ i ] * diffuse * pointDiffuseWeight;", "			vec3 pointHalfVector = normalize( pointVector + viewPosition );", "			float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );", "			float pointSpecularWeight = specularTex.r * max( pow( pointDotNormalHalf, shininess ), 0.0 );", "			float specularNormalization = ( shininess + 2.0 ) / 8.0;", "			vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( pointVector, pointHalfVector ), 0.0 ), 5.0 );", "			pointSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * pointDistance * specularNormalization;", "		}", "	#endif", "	#if MAX_SPOT_LIGHTS > 0", "		vec3 spotDiffuse = vec3( 0.0 );", "		vec3 spotSpecular = vec3( 0.0 );", "		for ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {", "			vec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );", "			vec3 spotVector = lPosition.xyz + vViewPosition.xyz;", "			float spotDistance = 1.0;", "			if ( spotLightDistance[ i ] > 0.0 )", "				spotDistance = 1.0 - min( ( length( spotVector ) / spotLightDistance[ i ] ), 1.0 );", "			spotVector = normalize( spotVector );", "			float spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );", "			if ( spotEffect > spotLightAngleCos[ i ] ) {", "				spotEffect = max( pow( max( spotEffect, 0.0 ), spotLightExponent[ i ] ), 0.0 );", "				#ifdef WRAP_AROUND", "					float spotDiffuseWeightFull = max( dot( normal, spotVector ), 0.0 );", "					float spotDiffuseWeightHalf = max( 0.5 * dot( normal, spotVector ) + 0.5, 0.0 );", "					vec3 spotDiffuseWeight = mix( vec3( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );", "				#else", "					float spotDiffuseWeight = max( dot( normal, spotVector ), 0.0 );", "				#endif", "				spotDiffuse += spotDistance * spotLightColor[ i ] * diffuse * spotDiffuseWeight * spotEffect;", "				vec3 spotHalfVector = normalize( spotVector + viewPosition );", "				float spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );", "				float spotSpecularWeight = specularTex.r * max( pow( spotDotNormalHalf, shininess ), 0.0 );", "				float specularNormalization = ( shininess + 2.0 ) / 8.0;", "				vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( spotVector, spotHalfVector ), 0.0 ), 5.0 );", "				spotSpecular += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * spotDistance * specularNormalization * spotEffect;", "			}", "		}", "	#endif", "	#if MAX_DIR_LIGHTS > 0", "		vec3 dirDiffuse = vec3( 0.0 );", "		vec3 dirSpecular = vec3( 0.0 );", "		for( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {", "			vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );", "			vec3 dirVector = normalize( lDirection.xyz );", "			#ifdef WRAP_AROUND", "				float directionalLightWeightingFull = max( dot( normal, dirVector ), 0.0 );", "				float directionalLightWeightingHalf = max( 0.5 * dot( normal, dirVector ) + 0.5, 0.0 );", "				vec3 dirDiffuseWeight = mix( vec3( directionalLightWeightingFull ), vec3( directionalLightWeightingHalf ), wrapRGB );", "			#else", "				float dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );", "			#endif", "			dirDiffuse += directionalLightColor[ i ] * diffuse * dirDiffuseWeight;", "			vec3 dirHalfVector = normalize( dirVector + viewPosition );", "			float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );", "			float dirSpecularWeight = specularTex.r * max( pow( dirDotNormalHalf, shininess ), 0.0 );", "			float specularNormalization = ( shininess + 2.0 ) / 8.0;", "			vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( dirVector, dirHalfVector ), 0.0 ), 5.0 );", "			dirSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;", "		}", "	#endif", "	#if MAX_HEMI_LIGHTS > 0", "		vec3 hemiDiffuse = vec3( 0.0 );", "		vec3 hemiSpecular = vec3( 0.0 );", "		for( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {", "			vec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );", "			vec3 lVector = normalize( lDirection.xyz );", "			float dotProduct = dot( normal, lVector );", "			float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;", "			vec3 hemiColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );", "			hemiDiffuse += diffuse * hemiColor;", "			vec3 hemiHalfVectorSky = normalize( lVector + viewPosition );", "			float hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;", "			float hemiSpecularWeightSky = specularTex.r * max( pow( max( hemiDotNormalHalfSky, 0.0 ), shininess ), 0.0 );", "			vec3 lVectorGround = -lVector;", "			vec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );", "			float hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;", "			float hemiSpecularWeightGround = specularTex.r * max( pow( max( hemiDotNormalHalfGround, 0.0 ), shininess ), 0.0 );", "			float dotProductGround = dot( normal, lVectorGround );", "			float specularNormalization = ( shininess + 2.0 ) / 8.0;", "			vec3 schlickSky = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, hemiHalfVectorSky ), 0.0 ), 5.0 );", "			vec3 schlickGround = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVectorGround, hemiHalfVectorGround ), 0.0 ), 5.0 );", "			hemiSpecular += hemiColor * specularNormalization * ( schlickSky * hemiSpecularWeightSky * max( dotProduct, 0.0 ) + schlickGround * hemiSpecularWeightGround * max( dotProductGround, 0.0 ) );", "		}", "	#endif", "	vec3 totalDiffuse = vec3( 0.0 );", "	vec3 totalSpecular = vec3( 0.0 );", "	#if MAX_DIR_LIGHTS > 0", "		totalDiffuse += dirDiffuse;", "		totalSpecular += dirSpecular;", "	#endif", "	#if MAX_HEMI_LIGHTS > 0", "		totalDiffuse += hemiDiffuse;", "		totalSpecular += hemiSpecular;", "	#endif", "	#if MAX_POINT_LIGHTS > 0", "		totalDiffuse += pointDiffuse;", "		totalSpecular += pointSpecular;", "	#endif", "	#if MAX_SPOT_LIGHTS > 0", "		totalDiffuse += spotDiffuse;", "		totalSpecular += spotSpecular;", "	#endif", "	#ifdef METAL", "		gl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * ambient + totalSpecular );", "	#else", "		gl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * ambient ) + totalSpecular;", "	#endif", "	if ( enableReflection ) {", "		vec3 vReflect;", "		vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );", "		if ( useRefract ) {", "			vReflect = refract( cameraToVertex, normal, refractionRatio );", "		} else {", "			vReflect = reflect( cameraToVertex, normal );", "		}", "		vec4 cubeColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );", "		#ifdef GAMMA_INPUT", "			cubeColor.xyz *= cubeColor.xyz;", "		#endif", "		gl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, specularTex.r * reflectivity );", "	}", THREE.ShaderChunk.shadowmap_fragment, THREE.ShaderChunk.linear_to_gamma_fragment, THREE.ShaderChunk.fog_fragment, "}" ].join("\n"),
        vertexShader: [ "attribute vec4 tangent;", "uniform vec2 uOffset;", "uniform vec2 uRepeat;", "uniform bool enableDisplacement;", "#ifdef VERTEX_TEXTURES", "	uniform sampler2D tDisplacement;", "	uniform float uDisplacementScale;", "	uniform float uDisplacementBias;", "#endif", "varying vec3 vTangent;", "varying vec3 vBinormal;", "varying vec3 vNormal;", "varying vec2 vUv;", "varying vec3 vWorldPosition;", "varying vec3 vViewPosition;", THREE.ShaderChunk.skinning_pars_vertex, THREE.ShaderChunk.shadowmap_pars_vertex, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", THREE.ShaderChunk.skinbase_vertex, THREE.ShaderChunk.skinnormal_vertex, "	#ifdef USE_SKINNING", "		vNormal = normalize( normalMatrix * skinnedNormal.xyz );", "		vec4 skinnedTangent = skinMatrix * vec4( tangent.xyz, 0.0 );", "		vTangent = normalize( normalMatrix * skinnedTangent.xyz );", "	#else", "		vNormal = normalize( normalMatrix * normal );", "		vTangent = normalize( normalMatrix * tangent.xyz );", "	#endif", "	vBinormal = normalize( cross( vNormal, vTangent ) * tangent.w );", "	vUv = uv * uRepeat + uOffset;", "	vec3 displacedPosition;", "	#ifdef VERTEX_TEXTURES", "		if ( enableDisplacement ) {", "			vec3 dv = texture2D( tDisplacement, uv ).xyz;", "			float df = uDisplacementScale * dv.x + uDisplacementBias;", "			displacedPosition = position + normalize( normal ) * df;", "		} else {", "			#ifdef USE_SKINNING", "				vec4 skinVertex = bindMatrix * vec4( position, 1.0 );", "				vec4 skinned = vec4( 0.0 );", "				skinned += boneMatX * skinVertex * skinWeight.x;", "				skinned += boneMatY * skinVertex * skinWeight.y;", "				skinned += boneMatZ * skinVertex * skinWeight.z;", "				skinned += boneMatW * skinVertex * skinWeight.w;", "				skinned  = bindMatrixInverse * skinned;", "				displacedPosition = skinned.xyz;", "			#else", "				displacedPosition = position;", "			#endif", "		}", "	#else", "		#ifdef USE_SKINNING", "			vec4 skinVertex = bindMatrix * vec4( position, 1.0 );", "			vec4 skinned = vec4( 0.0 );", "			skinned += boneMatX * skinVertex * skinWeight.x;", "			skinned += boneMatY * skinVertex * skinWeight.y;", "			skinned += boneMatZ * skinVertex * skinWeight.z;", "			skinned += boneMatW * skinVertex * skinWeight.w;", "			skinned  = bindMatrixInverse * skinned;", "			displacedPosition = skinned.xyz;", "		#else", "			displacedPosition = position;", "		#endif", "	#endif", "	vec4 mvPosition = modelViewMatrix * vec4( displacedPosition, 1.0 );", "	vec4 worldPosition = modelMatrix * vec4( displacedPosition, 1.0 );", "	gl_Position = projectionMatrix * mvPosition;", THREE.ShaderChunk.logdepthbuf_vertex, "	vWorldPosition = worldPosition.xyz;", "	vViewPosition = -mvPosition.xyz;", "	#ifdef USE_SHADOWMAP", "		for( int i = 0; i < MAX_SHADOWS; i ++ ) {", "			vShadowCoord[ i ] = shadowMatrix[ i ] * worldPosition;", "		}", "	#endif", "}" ].join("\n")
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
        vertexShader: [ "varying vec3 vWorldPosition;", THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", "	vec4 worldPosition = modelMatrix * vec4( position, 1.0 );", "	vWorldPosition = worldPosition.xyz;", "	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", THREE.ShaderChunk.logdepthbuf_vertex, "}" ].join("\n"),
        fragmentShader: [ "uniform samplerCube tCube;", "uniform float tFlip;", "varying vec3 vWorldPosition;", THREE.ShaderChunk.logdepthbuf_pars_fragment, "void main() {", "	gl_FragColor = textureCube( tCube, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) );", THREE.ShaderChunk.logdepthbuf_fragment, "}" ].join("\n")
    },
    depthRGBA: {
        uniforms: {},
        vertexShader: [ THREE.ShaderChunk.morphtarget_pars_vertex, THREE.ShaderChunk.skinning_pars_vertex, THREE.ShaderChunk.logdepthbuf_pars_vertex, "void main() {", THREE.ShaderChunk.skinbase_vertex, THREE.ShaderChunk.morphtarget_vertex, THREE.ShaderChunk.skinning_vertex, THREE.ShaderChunk.default_vertex, THREE.ShaderChunk.logdepthbuf_vertex, "}" ].join("\n"),
        fragmentShader: [ THREE.ShaderChunk.logdepthbuf_pars_fragment, "vec4 pack_depth( const in float depth ) {", "	const vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );", "	const vec4 bit_mask = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );", "	vec4 res = mod( depth * bit_shift * vec4( 255 ), vec4( 256 ) ) / vec4( 255 );", "	res -= res.xxyz * bit_mask;", "	return res;", "}", "void main() {", THREE.ShaderChunk.logdepthbuf_fragment, "	#ifdef USE_LOGDEPTHBUF_EXT", "		gl_FragData[ 0 ] = pack_depth( gl_FragDepthEXT );", "	#else", "		gl_FragData[ 0 ] = pack_depth( gl_FragCoord.z );", "	#endif", "}" ].join("\n")
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
        var m, ml;
        if (geometryGroup.numMorphTargets) for (geometryGroup.__webglMorphTargetsBuffers = [], 
        m = 0, ml = geometryGroup.numMorphTargets; ml > m; m++) geometryGroup.__webglMorphTargetsBuffers.push(_gl.createBuffer());
        if (geometryGroup.numMorphNormals) for (geometryGroup.__webglMorphNormalsBuffers = [], 
        m = 0, ml = geometryGroup.numMorphNormals; ml > m; m++) geometryGroup.__webglMorphNormalsBuffers.push(_gl.createBuffer());
        _this.info.memory.geometries++;
    }
    function initCustomAttributes(geometry, object) {
        var nvertices = geometry.vertices.length, material = object.material;
        if (material.attributes) {
            void 0 === geometry.__webglCustomAttributesList && (geometry.__webglCustomAttributesList = []);
            for (var a in material.attributes) {
                var attribute = material.attributes[a];
                if (!attribute.__webglInitialized || attribute.createUniqueBuffers) {
                    attribute.__webglInitialized = !0;
                    var size = 1;
                    "v2" === attribute.type ? size = 2 : "v3" === attribute.type ? size = 3 : "v4" === attribute.type ? size = 4 : "c" === attribute.type && (size = 3), 
                    attribute.size = size, attribute.array = new Float32Array(nvertices * size), attribute.buffer = _gl.createBuffer(), 
                    attribute.buffer.belongsToAttribute = a, attribute.needsUpdate = !0;
                }
                geometry.__webglCustomAttributesList.push(attribute);
            }
        }
    }
    function initParticleBuffers(geometry, object) {
        var nvertices = geometry.vertices.length;
        geometry.__vertexArray = new Float32Array(3 * nvertices), geometry.__colorArray = new Float32Array(3 * nvertices), 
        geometry.__sortArray = [], geometry.__webglParticleCount = nvertices, initCustomAttributes(geometry, object);
    }
    function initLineBuffers(geometry, object) {
        var nvertices = geometry.vertices.length;
        geometry.__vertexArray = new Float32Array(3 * nvertices), geometry.__colorArray = new Float32Array(3 * nvertices), 
        geometry.__lineDistanceArray = new Float32Array(1 * nvertices), geometry.__webglLineCount = nvertices, 
        initCustomAttributes(geometry, object);
    }
    function initMeshBuffers(geometryGroup, object) {
        var geometry = object.geometry, faces3 = geometryGroup.faces3, nvertices = 3 * faces3.length, ntris = 1 * faces3.length, nlines = 3 * faces3.length, material = getBufferMaterial(object, geometryGroup), uvType = bufferGuessUVType(material), normalType = bufferGuessNormalType(material), vertexColorType = bufferGuessVertexColorType(material);
        geometryGroup.__vertexArray = new Float32Array(3 * nvertices), normalType && (geometryGroup.__normalArray = new Float32Array(3 * nvertices)), 
        geometry.hasTangents && (geometryGroup.__tangentArray = new Float32Array(4 * nvertices)), 
        vertexColorType && (geometryGroup.__colorArray = new Float32Array(3 * nvertices)), 
        uvType && (geometry.faceVertexUvs.length > 0 && (geometryGroup.__uvArray = new Float32Array(2 * nvertices)), 
        geometry.faceVertexUvs.length > 1 && (geometryGroup.__uv2Array = new Float32Array(2 * nvertices))), 
        object.geometry.skinWeights.length && object.geometry.skinIndices.length && (geometryGroup.__skinIndexArray = new Float32Array(4 * nvertices), 
        geometryGroup.__skinWeightArray = new Float32Array(4 * nvertices));
        var UintArray = null !== _glExtensionElementIndexUint && ntris > 21845 ? Uint32Array : Uint16Array;
        geometryGroup.__typeArray = UintArray, geometryGroup.__faceArray = new UintArray(3 * ntris), 
        geometryGroup.__lineArray = new UintArray(2 * nlines);
        var m, ml;
        if (geometryGroup.numMorphTargets) for (geometryGroup.__morphTargetsArrays = [], 
        m = 0, ml = geometryGroup.numMorphTargets; ml > m; m++) geometryGroup.__morphTargetsArrays.push(new Float32Array(3 * nvertices));
        if (geometryGroup.numMorphNormals) for (geometryGroup.__morphNormalsArrays = [], 
        m = 0, ml = geometryGroup.numMorphNormals; ml > m; m++) geometryGroup.__morphNormalsArrays.push(new Float32Array(3 * nvertices));
        if (geometryGroup.__webglFaceCount = 3 * ntris, geometryGroup.__webglLineCount = 2 * nlines, 
        material.attributes) {
            void 0 === geometryGroup.__webglCustomAttributesList && (geometryGroup.__webglCustomAttributesList = []);
            for (var a in material.attributes) {
                var originalAttribute = material.attributes[a], attribute = {};
                for (var property in originalAttribute) attribute[property] = originalAttribute[property];
                if (!attribute.__webglInitialized || attribute.createUniqueBuffers) {
                    attribute.__webglInitialized = !0;
                    var size = 1;
                    "v2" === attribute.type ? size = 2 : "v3" === attribute.type ? size = 3 : "v4" === attribute.type ? size = 4 : "c" === attribute.type && (size = 3), 
                    attribute.size = size, attribute.array = new Float32Array(nvertices * size), attribute.buffer = _gl.createBuffer(), 
                    attribute.buffer.belongsToAttribute = a, originalAttribute.needsUpdate = !0, attribute.__original = originalAttribute;
                }
                geometryGroup.__webglCustomAttributesList.push(attribute);
            }
        }
        geometryGroup.__inittedArrays = !0;
    }
    function getBufferMaterial(object, geometryGroup) {
        return object.material instanceof THREE.MeshFaceMaterial ? object.material.materials[geometryGroup.materialIndex] : object.material;
    }
    function materialNeedsSmoothNormals(material) {
        return material && void 0 !== material.shading && material.shading === THREE.SmoothShading;
    }
    function bufferGuessNormalType(material) {
        return material instanceof THREE.MeshBasicMaterial && !material.envMap || material instanceof THREE.MeshDepthMaterial ? !1 : materialNeedsSmoothNormals(material) ? THREE.SmoothShading : THREE.FlatShading;
    }
    function bufferGuessVertexColorType(material) {
        return material.vertexColors ? material.vertexColors : !1;
    }
    function bufferGuessUVType(material) {
        return material.map || material.lightMap || material.bumpMap || material.normalMap || material.specularMap || material.alphaMap || material instanceof THREE.ShaderMaterial ? !0 : !1;
    }
    function initDirectBuffers(geometry) {
        for (var name in geometry.attributes) {
            var bufferType = "index" === name ? _gl.ELEMENT_ARRAY_BUFFER : _gl.ARRAY_BUFFER, attribute = geometry.attributes[name];
            attribute.buffer = _gl.createBuffer(), _gl.bindBuffer(bufferType, attribute.buffer), 
            _gl.bufferData(bufferType, attribute.array, _gl.STATIC_DRAW);
        }
    }
    function setParticleBuffers(geometry, hint, object) {
        var v, c, vertex, offset, index, color, i, il, ca, cal, value, customAttribute, vertices = geometry.vertices, vl = vertices.length, colors = geometry.colors, cl = colors.length, vertexArray = geometry.__vertexArray, colorArray = geometry.__colorArray, sortArray = geometry.__sortArray, dirtyVertices = geometry.verticesNeedUpdate, dirtyColors = (geometry.elementsNeedUpdate, 
        geometry.colorsNeedUpdate), customAttributes = geometry.__webglCustomAttributesList;
        if (object.sortParticles) {
            for (_projScreenMatrixPS.copy(_projScreenMatrix), _projScreenMatrixPS.multiply(object.matrixWorld), 
            v = 0; vl > v; v++) vertex = vertices[v], _vector3.copy(vertex), _vector3.applyProjection(_projScreenMatrixPS), 
            sortArray[v] = [ _vector3.z, v ];
            for (sortArray.sort(numericalSort), v = 0; vl > v; v++) vertex = vertices[sortArray[v][1]], 
            offset = 3 * v, vertexArray[offset] = vertex.x, vertexArray[offset + 1] = vertex.y, 
            vertexArray[offset + 2] = vertex.z;
            for (c = 0; cl > c; c++) offset = 3 * c, color = colors[sortArray[c][1]], colorArray[offset] = color.r, 
            colorArray[offset + 1] = color.g, colorArray[offset + 2] = color.b;
            if (customAttributes) for (i = 0, il = customAttributes.length; il > i; i++) if (customAttribute = customAttributes[i], 
            void 0 === customAttribute.boundTo || "vertices" === customAttribute.boundTo) if (offset = 0, 
            cal = customAttribute.value.length, 1 === customAttribute.size) for (ca = 0; cal > ca; ca++) index = sortArray[ca][1], 
            customAttribute.array[ca] = customAttribute.value[index]; else if (2 === customAttribute.size) for (ca = 0; cal > ca; ca++) index = sortArray[ca][1], 
            value = customAttribute.value[index], customAttribute.array[offset] = value.x, customAttribute.array[offset + 1] = value.y, 
            offset += 2; else if (3 === customAttribute.size) if ("c" === customAttribute.type) for (ca = 0; cal > ca; ca++) index = sortArray[ca][1], 
            value = customAttribute.value[index], customAttribute.array[offset] = value.r, customAttribute.array[offset + 1] = value.g, 
            customAttribute.array[offset + 2] = value.b, offset += 3; else for (ca = 0; cal > ca; ca++) index = sortArray[ca][1], 
            value = customAttribute.value[index], customAttribute.array[offset] = value.x, customAttribute.array[offset + 1] = value.y, 
            customAttribute.array[offset + 2] = value.z, offset += 3; else if (4 === customAttribute.size) for (ca = 0; cal > ca; ca++) index = sortArray[ca][1], 
            value = customAttribute.value[index], customAttribute.array[offset] = value.x, customAttribute.array[offset + 1] = value.y, 
            customAttribute.array[offset + 2] = value.z, customAttribute.array[offset + 3] = value.w, 
            offset += 4;
        } else {
            if (dirtyVertices) for (v = 0; vl > v; v++) vertex = vertices[v], offset = 3 * v, 
            vertexArray[offset] = vertex.x, vertexArray[offset + 1] = vertex.y, vertexArray[offset + 2] = vertex.z;
            if (dirtyColors) for (c = 0; cl > c; c++) color = colors[c], offset = 3 * c, colorArray[offset] = color.r, 
            colorArray[offset + 1] = color.g, colorArray[offset + 2] = color.b;
            if (customAttributes) for (i = 0, il = customAttributes.length; il > i; i++) if (customAttribute = customAttributes[i], 
            customAttribute.needsUpdate && (void 0 === customAttribute.boundTo || "vertices" === customAttribute.boundTo)) if (cal = customAttribute.value.length, 
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
        }
        if ((dirtyVertices || object.sortParticles) && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometry.__webglVertexBuffer), 
        _gl.bufferData(_gl.ARRAY_BUFFER, vertexArray, hint)), (dirtyColors || object.sortParticles) && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometry.__webglColorBuffer), 
        _gl.bufferData(_gl.ARRAY_BUFFER, colorArray, hint)), customAttributes) for (i = 0, 
        il = customAttributes.length; il > i; i++) customAttribute = customAttributes[i], 
        (customAttribute.needsUpdate || object.sortParticles) && (_gl.bindBuffer(_gl.ARRAY_BUFFER, customAttribute.buffer), 
        _gl.bufferData(_gl.ARRAY_BUFFER, customAttribute.array, hint));
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
            _gl.bindBuffer(_gl.ARRAY_BUFFER, customAttribute.buffer), _gl.bufferData(_gl.ARRAY_BUFFER, customAttribute.array, hint);
        }
    }
    function setMeshBuffers(geometryGroup, object, hint, dispose, material) {
        if (geometryGroup.__inittedArrays) {
            var f, fl, fi, face, vertexNormals, faceNormal, vertexColors, faceColor, vertexTangents, uv, uv2, v1, v2, v3, t1, t2, t3, n1, n2, n3, c1, c2, c3, sw1, sw2, sw3, si1, si2, si3, i, il, vn, uvi, uv2i, vk, vkl, vka, nka, chf, faceVertexNormals, value, customAttribute, normalType = bufferGuessNormalType(material), vertexColorType = bufferGuessVertexColorType(material), uvType = bufferGuessUVType(material), needsSmoothNormals = normalType === THREE.SmoothShading, vertexIndex = 0, offset = 0, offset_uv = 0, offset_uv2 = 0, offset_face = 0, offset_normal = 0, offset_tangent = 0, offset_line = 0, offset_color = 0, offset_skin = 0, offset_morphTarget = 0, offset_custom = 0, offset_customSrc = 0, vertexArray = geometryGroup.__vertexArray, uvArray = geometryGroup.__uvArray, uv2Array = geometryGroup.__uv2Array, normalArray = geometryGroup.__normalArray, tangentArray = geometryGroup.__tangentArray, colorArray = geometryGroup.__colorArray, skinIndexArray = geometryGroup.__skinIndexArray, skinWeightArray = geometryGroup.__skinWeightArray, morphTargetsArrays = geometryGroup.__morphTargetsArrays, morphNormalsArrays = geometryGroup.__morphNormalsArrays, customAttributes = geometryGroup.__webglCustomAttributesList, faceArray = geometryGroup.__faceArray, lineArray = geometryGroup.__lineArray, geometry = object.geometry, dirtyVertices = geometry.verticesNeedUpdate, dirtyElements = geometry.elementsNeedUpdate, dirtyUvs = geometry.uvsNeedUpdate, dirtyNormals = geometry.normalsNeedUpdate, dirtyTangents = geometry.tangentsNeedUpdate, dirtyColors = geometry.colorsNeedUpdate, dirtyMorphTargets = geometry.morphTargetsNeedUpdate, vertices = geometry.vertices, chunk_faces3 = geometryGroup.faces3, obj_faces = geometry.faces, obj_uvs = geometry.faceVertexUvs[0], obj_uvs2 = geometry.faceVertexUvs[1], obj_skinIndices = (geometry.colors, 
            geometry.skinIndices), obj_skinWeights = geometry.skinWeights, morphTargets = geometry.morphTargets, morphNormals = geometry.morphNormals;
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
                vka[offset_morphTarget + 7] = v3.y, vka[offset_morphTarget + 8] = v3.z, material.morphNormals && (needsSmoothNormals ? (faceVertexNormals = morphNormals[vk].vertexNormals[chf], 
                n1 = faceVertexNormals.a, n2 = faceVertexNormals.b, n3 = faceVertexNormals.c) : (n1 = morphNormals[vk].faceNormals[chf], 
                n2 = n1, n3 = n1), nka = morphNormalsArrays[vk], nka[offset_morphTarget] = n1.x, 
                nka[offset_morphTarget + 1] = n1.y, nka[offset_morphTarget + 2] = n1.z, nka[offset_morphTarget + 3] = n2.x, 
                nka[offset_morphTarget + 4] = n2.y, nka[offset_morphTarget + 5] = n2.z, nka[offset_morphTarget + 6] = n3.x, 
                nka[offset_morphTarget + 7] = n3.y, nka[offset_morphTarget + 8] = n3.z), offset_morphTarget += 9;
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
            if (dirtyColors && vertexColorType) {
                for (f = 0, fl = chunk_faces3.length; fl > f; f++) face = obj_faces[chunk_faces3[f]], 
                vertexColors = face.vertexColors, faceColor = face.color, 3 === vertexColors.length && vertexColorType === THREE.VertexColors ? (c1 = vertexColors[0], 
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
            if (dirtyNormals && normalType) {
                for (f = 0, fl = chunk_faces3.length; fl > f; f++) if (face = obj_faces[chunk_faces3[f]], 
                vertexNormals = face.vertexNormals, faceNormal = face.normal, 3 === vertexNormals.length && needsSmoothNormals) for (i = 0; 3 > i; i++) vn = vertexNormals[i], 
                normalArray[offset_normal] = vn.x, normalArray[offset_normal + 1] = vn.y, normalArray[offset_normal + 2] = vn.z, 
                offset_normal += 3; else for (i = 0; 3 > i; i++) normalArray[offset_normal] = faceNormal.x, 
                normalArray[offset_normal + 1] = faceNormal.y, normalArray[offset_normal + 2] = faceNormal.z, 
                offset_normal += 3;
                _gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglNormalBuffer), _gl.bufferData(_gl.ARRAY_BUFFER, normalArray, hint);
            }
            if (dirtyUvs && obj_uvs && uvType) {
                for (f = 0, fl = chunk_faces3.length; fl > f; f++) if (fi = chunk_faces3[f], uv = obj_uvs[fi], 
                void 0 !== uv) for (i = 0; 3 > i; i++) uvi = uv[i], uvArray[offset_uv] = uvi.x, 
                uvArray[offset_uv + 1] = uvi.y, offset_uv += 2;
                offset_uv > 0 && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglUVBuffer), 
                _gl.bufferData(_gl.ARRAY_BUFFER, uvArray, hint));
            }
            if (dirtyUvs && obj_uvs2 && uvType) {
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
                if (offset_custom = 0, offset_customSrc = 0, 1 === customAttribute.size) {
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
    function setDirectBuffers(geometry, hint) {
        var attributeName, attributeItem, attributes = geometry.attributes;
        for (attributeName in attributes) attributeItem = attributes[attributeName], attributeItem.needsUpdate && ("index" === attributeName ? (_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, attributeItem.buffer), 
        _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, attributeItem.array, hint)) : (_gl.bindBuffer(_gl.ARRAY_BUFFER, attributeItem.buffer), 
        _gl.bufferData(_gl.ARRAY_BUFFER, attributeItem.array, hint)), attributeItem.needsUpdate = !1);
    }
    function setupVertexAttributes(material, programAttributes, geometryAttributes, startIndex) {
        for (var attributeName in programAttributes) {
            var attributePointer = programAttributes[attributeName], attributeItem = geometryAttributes[attributeName];
            if (attributePointer >= 0) if (attributeItem) {
                var attributeSize = attributeItem.itemSize;
                _gl.bindBuffer(_gl.ARRAY_BUFFER, attributeItem.buffer), enableAttribute(attributePointer), 
                _gl.vertexAttribPointer(attributePointer, attributeSize, _gl.FLOAT, !1, 0, startIndex * attributeSize * 4);
            } else material.defaultAttributeValues && (2 === material.defaultAttributeValues[attributeName].length ? _gl.vertexAttrib2fv(attributePointer, material.defaultAttributeValues[attributeName]) : 3 === material.defaultAttributeValues[attributeName].length && _gl.vertexAttrib3fv(attributePointer, material.defaultAttributeValues[attributeName]));
        }
        disableUnusedAttributes();
    }
    function initAttributes() {
        for (var i = 0, l = _newAttributes.length; l > i; i++) _newAttributes[i] = 0;
    }
    function enableAttribute(attribute) {
        _newAttributes[attribute] = 1, 0 === _enabledAttributes[attribute] && (_gl.enableVertexAttribArray(attribute), 
        _enabledAttributes[attribute] = 1);
    }
    function disableUnusedAttributes() {
        for (var i = 0, l = _enabledAttributes.length; l > i; i++) _enabledAttributes[i] !== _newAttributes[i] && (_gl.disableVertexAttribArray(i), 
        _enabledAttributes[i] = 0);
    }
    function setupMorphTargets(material, geometryGroup, object) {
        var attributes = material.program.attributes;
        if (-1 !== object.morphTargetBase && attributes.position >= 0 ? (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglMorphTargetsBuffers[object.morphTargetBase]), 
        enableAttribute(attributes.position), _gl.vertexAttribPointer(attributes.position, 3, _gl.FLOAT, !1, 0, 0)) : attributes.position >= 0 && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglVertexBuffer), 
        enableAttribute(attributes.position), _gl.vertexAttribPointer(attributes.position, 3, _gl.FLOAT, !1, 0, 0)), 
        object.morphTargetForcedOrder.length) for (var m = 0, order = object.morphTargetForcedOrder, influences = object.morphTargetInfluences; m < material.numSupportedMorphTargets && m < order.length; ) attributes["morphTarget" + m] >= 0 && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglMorphTargetsBuffers[order[m]]), 
        enableAttribute(attributes["morphTarget" + m]), _gl.vertexAttribPointer(attributes["morphTarget" + m], 3, _gl.FLOAT, !1, 0, 0)), 
        attributes["morphNormal" + m] >= 0 && material.morphNormals && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglMorphNormalsBuffers[order[m]]), 
        enableAttribute(attributes["morphNormal" + m]), _gl.vertexAttribPointer(attributes["morphNormal" + m], 3, _gl.FLOAT, !1, 0, 0)), 
        object.__webglMorphTargetInfluences[m] = influences[order[m]], m++; else {
            var influence, i, activeInfluenceIndices = [], influences = object.morphTargetInfluences, il = influences.length;
            for (i = 0; il > i; i++) influence = influences[i], influence > 0 && activeInfluenceIndices.push([ influence, i ]);
            activeInfluenceIndices.length > material.numSupportedMorphTargets ? (activeInfluenceIndices.sort(numericalSort), 
            activeInfluenceIndices.length = material.numSupportedMorphTargets) : activeInfluenceIndices.length > material.numSupportedMorphNormals ? activeInfluenceIndices.sort(numericalSort) : 0 === activeInfluenceIndices.length && activeInfluenceIndices.push([ 0, 0 ]);
            for (var influenceIndex, m = 0; m < material.numSupportedMorphTargets; ) activeInfluenceIndices[m] ? (influenceIndex = activeInfluenceIndices[m][1], 
            attributes["morphTarget" + m] >= 0 && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglMorphTargetsBuffers[influenceIndex]), 
            enableAttribute(attributes["morphTarget" + m]), _gl.vertexAttribPointer(attributes["morphTarget" + m], 3, _gl.FLOAT, !1, 0, 0)), 
            attributes["morphNormal" + m] >= 0 && material.morphNormals && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglMorphNormalsBuffers[influenceIndex]), 
            enableAttribute(attributes["morphNormal" + m]), _gl.vertexAttribPointer(attributes["morphNormal" + m], 3, _gl.FLOAT, !1, 0, 0)), 
            object.__webglMorphTargetInfluences[m] = influences[influenceIndex]) : object.__webglMorphTargetInfluences[m] = 0, 
            m++;
        }
        null !== material.program.uniforms.morphTargetInfluences && _gl.uniform1fv(material.program.uniforms.morphTargetInfluences, object.__webglMorphTargetInfluences);
    }
    function painterSortStable(a, b) {
        return a.z !== b.z ? b.z - a.z : a.id - b.id;
    }
    function reversePainterSortStable(a, b) {
        return a.z !== b.z ? a.z - b.z : a.id - b.id;
    }
    function numericalSort(a, b) {
        return b[0] - a[0];
    }
    function projectObject(scene, object, camera) {
        if (object.visible !== !1) {
            var webglObjects = scene.__webglObjects[object.id];
            if (webglObjects && (object.frustumCulled === !1 || _frustum.intersectsObject(object) === !0)) {
                updateObject(scene, object);
                for (var i = 0, l = webglObjects.length; l > i; i++) {
                    var webglObject = webglObjects[i];
                    unrollBufferMaterial(webglObject), webglObject.render = !0, _this.sortObjects === !0 && (null !== object.renderDepth ? webglObject.z = object.renderDepth : (_vector3.setFromMatrixPosition(object.matrixWorld), 
                    _vector3.applyProjection(_projScreenMatrix), webglObject.z = _vector3.z));
                }
            }
            for (var i = 0, l = object.children.length; l > i; i++) projectObject(scene, object.children[i], camera);
        }
    }
    function renderPlugins(plugins, scene, camera) {
        if (0 !== plugins.length) for (var i = 0, il = plugins.length; il > i; i++) _currentProgram = null, 
        _currentCamera = null, _oldBlending = -1, _oldDepthTest = -1, _oldDepthWrite = -1, 
        _oldDoubleSided = -1, _oldFlipSided = -1, _currentGeometryGroupHash = -1, _currentMaterialId = -1, 
        _lightsNeedUpdate = !0, plugins[i].render(scene, camera, _currentWidth, _currentHeight), 
        _currentProgram = null, _currentCamera = null, _oldBlending = -1, _oldDepthTest = -1, 
        _oldDepthWrite = -1, _oldDoubleSided = -1, _oldFlipSided = -1, _currentGeometryGroupHash = -1, 
        _currentMaterialId = -1, _lightsNeedUpdate = !0;
    }
    function renderObjects(renderList, camera, lights, fog, useBlending, overrideMaterial) {
        for (var webglObject, object, buffer, material, i = renderList.length - 1; -1 !== i; i--) {
            if (webglObject = renderList[i], object = webglObject.object, buffer = webglObject.buffer, 
            setupMatrices(object, camera), overrideMaterial) material = overrideMaterial; else {
                if (material = webglObject.material, !material) continue;
                useBlending && _this.setBlending(material.blending, material.blendEquation, material.blendSrc, material.blendDst), 
                _this.setDepthTest(material.depthTest), _this.setDepthWrite(material.depthWrite), 
                setPolygonOffset(material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits);
            }
            _this.setMaterialFaces(material), buffer instanceof THREE.BufferGeometry ? _this.renderBufferDirect(camera, lights, fog, material, buffer, object) : _this.renderBuffer(camera, lights, fog, material, buffer, object);
        }
    }
    function renderObjectsImmediate(renderList, materialType, camera, lights, fog, useBlending, overrideMaterial) {
        for (var webglObject, object, material, i = 0, il = renderList.length; il > i; i++) if (webglObject = renderList[i], 
        object = webglObject.object, object.visible) {
            if (overrideMaterial) material = overrideMaterial; else {
                if (material = webglObject[materialType], !material) continue;
                useBlending && _this.setBlending(material.blending, material.blendEquation, material.blendSrc, material.blendDst), 
                _this.setDepthTest(material.depthTest), _this.setDepthWrite(material.depthWrite), 
                setPolygonOffset(material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits);
            }
            _this.renderImmediateObject(camera, lights, fog, material, object);
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
            material = material.materials[materialIndex], material.transparent ? (globject.material = material, 
            transparentObjects.push(globject)) : (globject.material = material, opaqueObjects.push(globject));
        } else material && (material.transparent ? (globject.material = material, transparentObjects.push(globject)) : (globject.material = material, 
        opaqueObjects.push(globject)));
    }
    function addObject(object, scene) {
        var geometry, geometryGroup;
        if (void 0 === object.__webglInit && (object.__webglInit = !0, object._modelViewMatrix = new THREE.Matrix4(), 
        object._normalMatrix = new THREE.Matrix3()), geometry = object.geometry, void 0 === geometry || void 0 === geometry.__webglInit && (geometry.__webglInit = !0, 
        geometry.addEventListener("dispose", onGeometryDispose), geometry instanceof THREE.BufferGeometry ? initDirectBuffers(geometry) : object instanceof THREE.Mesh ? (void 0 !== object.__webglActive && removeObject(object, scene), 
        initGeometryGroups(scene, object, geometry)) : object instanceof THREE.Line ? geometry.__webglVertexBuffer || (createLineBuffers(geometry), 
        initLineBuffers(geometry, object), geometry.verticesNeedUpdate = !0, geometry.colorsNeedUpdate = !0, 
        geometry.lineDistancesNeedUpdate = !0) : object instanceof THREE.PointCloud && (geometry.__webglVertexBuffer || (createParticleBuffers(geometry), 
        initParticleBuffers(geometry, object), geometry.verticesNeedUpdate = !0, geometry.colorsNeedUpdate = !0))), 
        void 0 === object.__webglActive) {
            if (object instanceof THREE.Mesh) {
                if (geometry = object.geometry, geometry instanceof THREE.BufferGeometry) addBuffer(scene.__webglObjects, geometry, object); else if (geometry instanceof THREE.Geometry) for (var i = 0, l = geometry.geometryGroupsList.length; l > i; i++) geometryGroup = geometry.geometryGroupsList[i], 
                addBuffer(scene.__webglObjects, geometryGroup, object);
            } else object instanceof THREE.Line || object instanceof THREE.PointCloud ? (geometry = object.geometry, 
            addBuffer(scene.__webglObjects, geometry, object)) : (object instanceof THREE.ImmediateRenderObject || object.immediateRenderCallback) && addBufferImmediate(scene.__webglObjectsImmediate, object);
            object.__webglActive = !0;
        }
    }
    function initGeometryGroups(scene, object, geometry) {
        var geometryGroup, material, addBuffers = !1;
        material = object.material, (void 0 === geometry.geometryGroups || geometry.groupsNeedUpdate) && (delete scene.__webglObjects[object.id], 
        geometry.makeGroups(material instanceof THREE.MeshFaceMaterial, _glExtensionElementIndexUint ? 4294967296 : 65535), 
        geometry.groupsNeedUpdate = !1);
        for (var i = 0, il = geometry.geometryGroupsList.length; il > i; i++) geometryGroup = geometry.geometryGroupsList[i], 
        geometryGroup.__webglVertexBuffer ? addBuffers = !1 : (createMeshBuffers(geometryGroup), 
        initMeshBuffers(geometryGroup, object), geometry.verticesNeedUpdate = !0, geometry.morphTargetsNeedUpdate = !0, 
        geometry.elementsNeedUpdate = !0, geometry.uvsNeedUpdate = !0, geometry.normalsNeedUpdate = !0, 
        geometry.tangentsNeedUpdate = !0, geometry.colorsNeedUpdate = !0, addBuffers = !0), 
        (addBuffers || void 0 === object.__webglActive) && addBuffer(scene.__webglObjects, geometryGroup, object);
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
    function updateObject(scene, object) {
        var geometryGroup, customAttributesDirty, material, geometry = object.geometry;
        if (geometry instanceof THREE.BufferGeometry) setDirectBuffers(geometry, _gl.DYNAMIC_DRAW); else if (object instanceof THREE.Mesh) {
            (geometry.buffersNeedUpdate || geometry.groupsNeedUpdate) && (geometry instanceof THREE.BufferGeometry ? initDirectBuffers(geometry) : object instanceof THREE.Mesh && initGeometryGroups(scene, object, geometry));
            for (var i = 0, il = geometry.geometryGroupsList.length; il > i; i++) geometryGroup = geometry.geometryGroupsList[i], 
            material = getBufferMaterial(object, geometryGroup), (geometry.buffersNeedUpdate || geometry.groupsNeedUpdate) && initMeshBuffers(geometryGroup, object), 
            customAttributesDirty = material.attributes && areCustomAttributesDirty(material), 
            (geometry.verticesNeedUpdate || geometry.morphTargetsNeedUpdate || geometry.elementsNeedUpdate || geometry.uvsNeedUpdate || geometry.normalsNeedUpdate || geometry.colorsNeedUpdate || geometry.tangentsNeedUpdate || customAttributesDirty) && setMeshBuffers(geometryGroup, object, _gl.DYNAMIC_DRAW, !geometry.dynamic, material);
            geometry.verticesNeedUpdate = !1, geometry.morphTargetsNeedUpdate = !1, geometry.elementsNeedUpdate = !1, 
            geometry.uvsNeedUpdate = !1, geometry.normalsNeedUpdate = !1, geometry.colorsNeedUpdate = !1, 
            geometry.tangentsNeedUpdate = !1, geometry.buffersNeedUpdate = !1, material.attributes && clearCustomAttributes(material);
        } else object instanceof THREE.Line ? (material = getBufferMaterial(object, geometry), 
        customAttributesDirty = material.attributes && areCustomAttributesDirty(material), 
        (geometry.verticesNeedUpdate || geometry.colorsNeedUpdate || geometry.lineDistancesNeedUpdate || customAttributesDirty) && setLineBuffers(geometry, _gl.DYNAMIC_DRAW), 
        geometry.verticesNeedUpdate = !1, geometry.colorsNeedUpdate = !1, geometry.lineDistancesNeedUpdate = !1, 
        material.attributes && clearCustomAttributes(material)) : object instanceof THREE.PointCloud && (material = getBufferMaterial(object, geometry), 
        customAttributesDirty = material.attributes && areCustomAttributesDirty(material), 
        (geometry.verticesNeedUpdate || geometry.colorsNeedUpdate || object.sortParticles || customAttributesDirty) && setParticleBuffers(geometry, _gl.DYNAMIC_DRAW, object), 
        geometry.verticesNeedUpdate = !1, geometry.colorsNeedUpdate = !1, material.attributes && clearCustomAttributes(material));
    }
    function areCustomAttributesDirty(material) {
        for (var a in material.attributes) if (material.attributes[a].needsUpdate) return !0;
        return !1;
    }
    function clearCustomAttributes(material) {
        for (var a in material.attributes) material.attributes[a].needsUpdate = !1;
    }
    function removeObject(object, scene) {
        object instanceof THREE.Mesh || object instanceof THREE.PointCloud || object instanceof THREE.Line ? removeInstancesWebglObjects(scene.__webglObjects, object) : (object instanceof THREE.ImmediateRenderObject || object.immediateRenderCallback) && removeInstances(scene.__webglObjectsImmediate, object), 
        delete object.__webglActive;
    }
    function removeInstancesWebglObjects(objlist, object) {
        delete objlist[object.id];
    }
    function removeInstances(objlist, object) {
        for (var o = objlist.length - 1; o >= 0; o--) objlist[o].object === object && objlist.splice(o, 1);
    }
    function setProgram(camera, lights, fog, material, object) {
        _usedTextureUnits = 0, material.needsUpdate && (material.program && deallocateMaterial(material), 
        _this.initMaterial(material, lights, fog, object), material.needsUpdate = !1), material.morphTargets && (object.__webglMorphTargetInfluences || (object.__webglMorphTargetInfluences = new Float32Array(_this.maxMorphTargets)));
        var refreshProgram = !1, refreshMaterial = !1, refreshLights = !1, program = material.program, p_uniforms = program.uniforms, m_uniforms = material.__webglShader.uniforms;
        if (program.id !== _currentProgram && (_gl.useProgram(program.program), _currentProgram = program.id, 
        refreshProgram = !0, refreshMaterial = !0, refreshLights = !0), material.id !== _currentMaterialId && (-1 === _currentMaterialId && (refreshLights = !0), 
        _currentMaterialId = material.id, refreshMaterial = !0), (refreshProgram || camera !== _currentCamera) && (_gl.uniformMatrix4fv(p_uniforms.projectionMatrix, !1, camera.projectionMatrix.elements), 
        _logarithmicDepthBuffer && _gl.uniform1f(p_uniforms.logDepthBufFC, 2 / (Math.log(camera.far + 1) / Math.LN2)), 
        camera !== _currentCamera && (_currentCamera = camera), (material instanceof THREE.ShaderMaterial || material instanceof THREE.MeshPhongMaterial || material.envMap) && null !== p_uniforms.cameraPosition && (_vector3.setFromMatrixPosition(camera.matrixWorld), 
        _gl.uniform3f(p_uniforms.cameraPosition, _vector3.x, _vector3.y, _vector3.z)), (material instanceof THREE.MeshPhongMaterial || material instanceof THREE.MeshLambertMaterial || material instanceof THREE.ShaderMaterial || material.skinning) && null !== p_uniforms.viewMatrix && _gl.uniformMatrix4fv(p_uniforms.viewMatrix, !1, camera.matrixWorldInverse.elements)), 
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
        uniforms.opacity.value = material.opacity, _this.gammaInput ? uniforms.diffuse.value.copyGammaToLinear(material.color) : uniforms.diffuse.value = material.color, 
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
        uniforms.reflectivity.value = _this.gammaInput ? material.reflectivity : material.reflectivity, 
        uniforms.refractionRatio.value = material.refractionRatio, uniforms.combine.value = material.combine, 
        uniforms.useRefract.value = material.envMap && material.envMap.mapping instanceof THREE.CubeRefractionMapping;
    }
    function refreshUniformsLine(uniforms, material) {
        uniforms.diffuse.value = material.color, uniforms.opacity.value = material.opacity;
    }
    function refreshUniformsDash(uniforms, material) {
        uniforms.dashSize.value = material.dashSize, uniforms.totalSize.value = material.dashSize + material.gapSize, 
        uniforms.scale.value = material.scale;
    }
    function refreshUniformsParticle(uniforms, material) {
        uniforms.psColor.value = material.color, uniforms.opacity.value = material.opacity, 
        uniforms.size.value = material.size, uniforms.scale.value = _canvas.height / 2, 
        uniforms.map.value = material.map;
    }
    function refreshUniformsFog(uniforms, fog) {
        uniforms.fogColor.value = fog.color, fog instanceof THREE.Fog ? (uniforms.fogNear.value = fog.near, 
        uniforms.fogFar.value = fog.far) : fog instanceof THREE.FogExp2 && (uniforms.fogDensity.value = fog.density);
    }
    function refreshUniformsPhong(uniforms, material) {
        uniforms.shininess.value = material.shininess, _this.gammaInput ? (uniforms.ambient.value.copyGammaToLinear(material.ambient), 
        uniforms.emissive.value.copyGammaToLinear(material.emissive), uniforms.specular.value.copyGammaToLinear(material.specular)) : (uniforms.ambient.value = material.ambient, 
        uniforms.emissive.value = material.emissive, uniforms.specular.value = material.specular), 
        material.wrapAround && uniforms.wrapRGB.value.copy(material.wrapRGB);
    }
    function refreshUniformsLambert(uniforms, material) {
        _this.gammaInput ? (uniforms.ambient.value.copyGammaToLinear(material.ambient), 
        uniforms.emissive.value.copyGammaToLinear(material.emissive)) : (uniforms.ambient.value = material.ambient, 
        uniforms.emissive.value = material.emissive), material.wrapAround && uniforms.wrapRGB.value.copy(material.wrapRGB);
    }
    function refreshUniformsLights(uniforms, lights) {
        uniforms.ambientLightColor.value = lights.ambient, uniforms.directionalLightColor.value = lights.directional.colors, 
        uniforms.directionalLightDirection.value = lights.directional.positions, uniforms.pointLightColor.value = lights.point.colors, 
        uniforms.pointLightPosition.value = lights.point.positions, uniforms.pointLightDistance.value = lights.point.distances, 
        uniforms.spotLightColor.value = lights.spot.colors, uniforms.spotLightPosition.value = lights.spot.positions, 
        uniforms.spotLightDistance.value = lights.spot.distances, uniforms.spotLightDirection.value = lights.spot.directions, 
        uniforms.spotLightAngleCos.value = lights.spot.anglesCos, uniforms.spotLightExponent.value = lights.spot.exponents, 
        uniforms.hemisphereLightSkyColor.value = lights.hemi.skyColors, uniforms.hemisphereLightGroundColor.value = lights.hemi.groundColors, 
        uniforms.hemisphereLightDirection.value = lights.hemi.positions;
    }
    function markUniformsLightsNeedsUpdate(uniforms, boolean) {
        uniforms.ambientLightColor.needsUpdate = boolean, uniforms.directionalLightColor.needsUpdate = boolean, 
        uniforms.directionalLightDirection.needsUpdate = boolean, uniforms.pointLightColor.needsUpdate = boolean, 
        uniforms.pointLightPosition.needsUpdate = boolean, uniforms.pointLightDistance.needsUpdate = boolean, 
        uniforms.spotLightColor.needsUpdate = boolean, uniforms.spotLightPosition.needsUpdate = boolean, 
        uniforms.spotLightDistance.needsUpdate = boolean, uniforms.spotLightDirection.needsUpdate = boolean, 
        uniforms.spotLightAngleCos.needsUpdate = boolean, uniforms.spotLightExponent.needsUpdate = boolean, 
        uniforms.hemisphereLightSkyColor.needsUpdate = boolean, uniforms.hemisphereLightGroundColor.needsUpdate = boolean, 
        uniforms.hemisphereLightDirection.needsUpdate = boolean;
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
        return textureUnit >= _maxTextures && console.warn("WebGLRenderer: trying to use " + textureUnit + " texture units while this GPU supports only " + _maxTextures), 
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
                    console.warn("THREE.WebGLRenderer: Unknown uniform type: " + type);
                }
            }
        }
    }
    function setupMatrices(object, camera) {
        object._modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, object.matrixWorld), 
        object._normalMatrix.getNormalMatrix(object._modelViewMatrix);
    }
    function setColorGamma(array, offset, color, intensitySq) {
        array[offset] = color.r * color.r * intensitySq, array[offset + 1] = color.g * color.g * intensitySq, 
        array[offset + 2] = color.b * color.b * intensitySq;
    }
    function setColorLinear(array, offset, color, intensity) {
        array[offset] = color.r * intensity, array[offset + 1] = color.g * intensity, array[offset + 2] = color.b * intensity;
    }
    function setupLights(lights) {
        var l, ll, light, color, skyColor, groundColor, intensity, intensitySq, distance, r = 0, g = 0, b = 0, zlights = _lights, dirColors = zlights.directional.colors, dirPositions = zlights.directional.positions, pointColors = zlights.point.colors, pointPositions = zlights.point.positions, pointDistances = zlights.point.distances, spotColors = zlights.spot.colors, spotPositions = zlights.spot.positions, spotDistances = zlights.spot.distances, spotDirections = zlights.spot.directions, spotAnglesCos = zlights.spot.anglesCos, spotExponents = zlights.spot.exponents, hemiSkyColors = zlights.hemi.skyColors, hemiGroundColors = zlights.hemi.groundColors, hemiPositions = zlights.hemi.positions, dirLength = 0, pointLength = 0, spotLength = 0, hemiLength = 0, dirCount = 0, pointCount = 0, spotCount = 0, hemiCount = 0, dirOffset = 0, pointOffset = 0, spotOffset = 0, hemiOffset = 0;
        for (l = 0, ll = lights.length; ll > l; l++) if (light = lights[l], !light.onlyShadow) if (color = light.color, 
        intensity = light.intensity, distance = light.distance, light instanceof THREE.AmbientLight) {
            if (!light.visible) continue;
            _this.gammaInput ? (r += color.r * color.r, g += color.g * color.g, b += color.b * color.b) : (r += color.r, 
            g += color.g, b += color.b);
        } else if (light instanceof THREE.DirectionalLight) {
            if (dirCount += 1, !light.visible) continue;
            _direction.setFromMatrixPosition(light.matrixWorld), _vector3.setFromMatrixPosition(light.target.matrixWorld), 
            _direction.sub(_vector3), _direction.normalize(), dirOffset = 3 * dirLength, dirPositions[dirOffset] = _direction.x, 
            dirPositions[dirOffset + 1] = _direction.y, dirPositions[dirOffset + 2] = _direction.z, 
            _this.gammaInput ? setColorGamma(dirColors, dirOffset, color, intensity * intensity) : setColorLinear(dirColors, dirOffset, color, intensity), 
            dirLength += 1;
        } else if (light instanceof THREE.PointLight) {
            if (pointCount += 1, !light.visible) continue;
            pointOffset = 3 * pointLength, _this.gammaInput ? setColorGamma(pointColors, pointOffset, color, intensity * intensity) : setColorLinear(pointColors, pointOffset, color, intensity), 
            _vector3.setFromMatrixPosition(light.matrixWorld), pointPositions[pointOffset] = _vector3.x, 
            pointPositions[pointOffset + 1] = _vector3.y, pointPositions[pointOffset + 2] = _vector3.z, 
            pointDistances[pointLength] = distance, pointLength += 1;
        } else if (light instanceof THREE.SpotLight) {
            if (spotCount += 1, !light.visible) continue;
            spotOffset = 3 * spotLength, _this.gammaInput ? setColorGamma(spotColors, spotOffset, color, intensity * intensity) : setColorLinear(spotColors, spotOffset, color, intensity), 
            _vector3.setFromMatrixPosition(light.matrixWorld), spotPositions[spotOffset] = _vector3.x, 
            spotPositions[spotOffset + 1] = _vector3.y, spotPositions[spotOffset + 2] = _vector3.z, 
            spotDistances[spotLength] = distance, _direction.copy(_vector3), _vector3.setFromMatrixPosition(light.target.matrixWorld), 
            _direction.sub(_vector3), _direction.normalize(), spotDirections[spotOffset] = _direction.x, 
            spotDirections[spotOffset + 1] = _direction.y, spotDirections[spotOffset + 2] = _direction.z, 
            spotAnglesCos[spotLength] = Math.cos(light.angle), spotExponents[spotLength] = light.exponent, 
            spotLength += 1;
        } else if (light instanceof THREE.HemisphereLight) {
            if (hemiCount += 1, !light.visible) continue;
            _direction.setFromMatrixPosition(light.matrixWorld), _direction.normalize(), hemiOffset = 3 * hemiLength, 
            hemiPositions[hemiOffset] = _direction.x, hemiPositions[hemiOffset + 1] = _direction.y, 
            hemiPositions[hemiOffset + 2] = _direction.z, skyColor = light.color, groundColor = light.groundColor, 
            _this.gammaInput ? (intensitySq = intensity * intensity, setColorGamma(hemiSkyColors, hemiOffset, skyColor, intensitySq), 
            setColorGamma(hemiGroundColors, hemiOffset, groundColor, intensitySq)) : (setColorLinear(hemiSkyColors, hemiOffset, skyColor, intensity), 
            setColorLinear(hemiGroundColors, hemiOffset, groundColor, intensity)), hemiLength += 1;
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
    function setLineWidth(width) {
        width !== _oldLineWidth && (_gl.lineWidth(width), _oldLineWidth = width);
    }
    function setPolygonOffset(polygonoffset, factor, units) {
        _oldPolygonOffset !== polygonoffset && (polygonoffset ? _gl.enable(_gl.POLYGON_OFFSET_FILL) : _gl.disable(_gl.POLYGON_OFFSET_FILL), 
        _oldPolygonOffset = polygonoffset), !polygonoffset || _oldPolygonOffsetFactor === factor && _oldPolygonOffsetUnits === units || (_gl.polygonOffset(factor, units), 
        _oldPolygonOffsetFactor = factor, _oldPolygonOffsetUnits = units);
    }
    function setTextureParameters(textureType, texture, isImagePowerOfTwo) {
        isImagePowerOfTwo ? (_gl.texParameteri(textureType, _gl.TEXTURE_WRAP_S, paramThreeToGL(texture.wrapS)), 
        _gl.texParameteri(textureType, _gl.TEXTURE_WRAP_T, paramThreeToGL(texture.wrapT)), 
        _gl.texParameteri(textureType, _gl.TEXTURE_MAG_FILTER, paramThreeToGL(texture.magFilter)), 
        _gl.texParameteri(textureType, _gl.TEXTURE_MIN_FILTER, paramThreeToGL(texture.minFilter))) : (_gl.texParameteri(textureType, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE), 
        _gl.texParameteri(textureType, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE), _gl.texParameteri(textureType, _gl.TEXTURE_MAG_FILTER, filterFallback(texture.magFilter)), 
        _gl.texParameteri(textureType, _gl.TEXTURE_MIN_FILTER, filterFallback(texture.minFilter))), 
        _glExtensionTextureFilterAnisotropic && texture.type !== THREE.FloatType && (texture.anisotropy > 1 || texture.__oldAnisotropy) && (_gl.texParameterf(textureType, _glExtensionTextureFilterAnisotropic.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(texture.anisotropy, _maxAnisotropy)), 
        texture.__oldAnisotropy = texture.anisotropy);
    }
    function clampToMaxSize(image, maxSize) {
        if (image.width <= maxSize && image.height <= maxSize) return image;
        var maxDimension = Math.max(image.width, image.height), newWidth = Math.floor(image.width * maxSize / maxDimension), newHeight = Math.floor(image.height * maxSize / maxDimension), canvas = document.createElement("canvas");
        canvas.width = newWidth, canvas.height = newHeight;
        var ctx = canvas.getContext("2d");
        return ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, newWidth, newHeight), 
        canvas;
    }
    function setCubeTexture(texture, slot) {
        if (6 === texture.image.length) if (texture.needsUpdate) {
            texture.image.__webglTextureCube || (texture.addEventListener("dispose", onTextureDispose), 
            texture.image.__webglTextureCube = _gl.createTexture(), _this.info.memory.textures++), 
            _gl.activeTexture(_gl.TEXTURE0 + slot), _gl.bindTexture(_gl.TEXTURE_CUBE_MAP, texture.image.__webglTextureCube), 
            _gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);
            for (var isCompressed = texture instanceof THREE.CompressedTexture, cubeImage = [], i = 0; 6 > i; i++) cubeImage[i] = _this.autoScaleCubemaps && !isCompressed ? clampToMaxSize(texture.image[i], _maxCubemapSize) : texture.image[i];
            var image = cubeImage[0], isImagePowerOfTwo = THREE.Math.isPowerOfTwo(image.width) && THREE.Math.isPowerOfTwo(image.height), glFormat = paramThreeToGL(texture.format), glType = paramThreeToGL(texture.type);
            setTextureParameters(_gl.TEXTURE_CUBE_MAP, texture, isImagePowerOfTwo);
            for (var i = 0; 6 > i; i++) if (isCompressed) for (var mipmap, mipmaps = cubeImage[i].mipmaps, j = 0, jl = mipmaps.length; jl > j; j++) mipmap = mipmaps[j], 
            texture.format !== THREE.RGBAFormat ? _gl.compressedTexImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, mipmap.data) : _gl.texImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data); else _gl.texImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, glFormat, glType, cubeImage[i]);
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
        if (void 0 !== _glExtensionCompressedTextureS3TC) {
            if (p === THREE.RGB_S3TC_DXT1_Format) return _glExtensionCompressedTextureS3TC.COMPRESSED_RGB_S3TC_DXT1_EXT;
            if (p === THREE.RGBA_S3TC_DXT1_Format) return _glExtensionCompressedTextureS3TC.COMPRESSED_RGBA_S3TC_DXT1_EXT;
            if (p === THREE.RGBA_S3TC_DXT3_Format) return _glExtensionCompressedTextureS3TC.COMPRESSED_RGBA_S3TC_DXT3_EXT;
            if (p === THREE.RGBA_S3TC_DXT5_Format) return _glExtensionCompressedTextureS3TC.COMPRESSED_RGBA_S3TC_DXT5_EXT;
        }
        return 0;
    }
    function allocateBones(object) {
        if (_supportsBoneTextures && object && object.skeleton && object.skeleton.useVertexTexture) return 1024;
        var nVertexUniforms = _gl.getParameter(_gl.MAX_VERTEX_UNIFORM_VECTORS), nVertexMatrices = Math.floor((nVertexUniforms - 20) / 4), maxBones = nVertexMatrices;
        return void 0 !== object && object instanceof THREE.SkinnedMesh && (maxBones = Math.min(object.skeleton.bones.length, maxBones), 
        maxBones < object.skeleton.bones.length && console.warn("WebGLRenderer: too many bones - " + object.skeleton.bones.length + ", this GPU supports just " + maxBones + " (try OpenGL instead of ANGLE)")), 
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
    function initGL() {
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
            null === _gl) throw "Error creating WebGL context.";
        } catch (error) {
            console.error(error);
        }
        _glExtensionTextureFloat = _gl.getExtension("OES_texture_float"), _glExtensionTextureFloatLinear = _gl.getExtension("OES_texture_float_linear"), 
        _glExtensionStandardDerivatives = _gl.getExtension("OES_standard_derivatives"), 
        _glExtensionTextureFilterAnisotropic = _gl.getExtension("EXT_texture_filter_anisotropic") || _gl.getExtension("MOZ_EXT_texture_filter_anisotropic") || _gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic"), 
        _glExtensionCompressedTextureS3TC = _gl.getExtension("WEBGL_compressed_texture_s3tc") || _gl.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || _gl.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc"), 
        _glExtensionElementIndexUint = _gl.getExtension("OES_element_index_uint"), null === _glExtensionTextureFloat && console.log("THREE.WebGLRenderer: Float textures not supported."), 
        null === _glExtensionStandardDerivatives && console.log("THREE.WebGLRenderer: Standard derivatives not supported."), 
        null === _glExtensionTextureFilterAnisotropic && console.log("THREE.WebGLRenderer: Anisotropic texture filtering not supported."), 
        null === _glExtensionCompressedTextureS3TC && console.log("THREE.WebGLRenderer: S3TC compressed textures not supported."), 
        null === _glExtensionElementIndexUint && console.log("THREE.WebGLRenderer: elementindex as unsigned integer not supported."), 
        void 0 === _gl.getShaderPrecisionFormat && (_gl.getShaderPrecisionFormat = function() {
            return {
                rangeMin: 1,
                rangeMax: 1,
                precision: 1
            };
        }), _logarithmicDepthBuffer && (_glExtensionFragDepth = _gl.getExtension("EXT_frag_depth"));
    }
    function setDefaultGLState() {
        _gl.clearColor(0, 0, 0, 1), _gl.clearDepth(1), _gl.clearStencil(0), _gl.enable(_gl.DEPTH_TEST), 
        _gl.depthFunc(_gl.LEQUAL), _gl.frontFace(_gl.CCW), _gl.cullFace(_gl.BACK), _gl.enable(_gl.CULL_FACE), 
        _gl.enable(_gl.BLEND), _gl.blendEquation(_gl.FUNC_ADD), _gl.blendFunc(_gl.SRC_ALPHA, _gl.ONE_MINUS_SRC_ALPHA), 
        _gl.viewport(_viewportX, _viewportY, _viewportWidth, _viewportHeight), _gl.clearColor(_clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha);
    }
    console.log("THREE.WebGLRenderer", THREE.REVISION), parameters = parameters || {};
    var _canvas = void 0 !== parameters.canvas ? parameters.canvas : document.createElement("canvas"), _context = void 0 !== parameters.context ? parameters.context : null, _precision = void 0 !== parameters.precision ? parameters.precision : "highp", _alpha = void 0 !== parameters.alpha ? parameters.alpha : !1, _depth = void 0 !== parameters.depth ? parameters.depth : !0, _stencil = void 0 !== parameters.stencil ? parameters.stencil : !0, _antialias = void 0 !== parameters.antialias ? parameters.antialias : !1, _premultipliedAlpha = void 0 !== parameters.premultipliedAlpha ? parameters.premultipliedAlpha : !0, _preserveDrawingBuffer = void 0 !== parameters.preserveDrawingBuffer ? parameters.preserveDrawingBuffer : !1, _logarithmicDepthBuffer = void 0 !== parameters.logarithmicDepthBuffer ? parameters.logarithmicDepthBuffer : !1, _clearColor = new THREE.Color(0), _clearAlpha = 0, opaqueObjects = [], transparentObjects = [];
    this.domElement = _canvas, this.context = null, this.devicePixelRatio = void 0 !== parameters.devicePixelRatio ? parameters.devicePixelRatio : void 0 !== self.devicePixelRatio ? self.devicePixelRatio : 1, 
    this.autoClear = !0, this.autoClearColor = !0, this.autoClearDepth = !0, this.autoClearStencil = !0, 
    this.sortObjects = !0, this.gammaInput = !1, this.gammaOutput = !1, this.shadowMapEnabled = !1, 
    this.shadowMapAutoUpdate = !0, this.shadowMapType = THREE.PCFShadowMap, this.shadowMapCullFace = THREE.CullFaceFront, 
    this.shadowMapDebug = !1, this.shadowMapCascade = !1, this.maxMorphTargets = 8, 
    this.maxMorphNormals = 4, this.autoScaleCubemaps = !0, this.renderPluginsPre = [], 
    this.renderPluginsPost = [], this.info = {
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
    var _gl, _glExtensionTextureFloat, _glExtensionTextureFloatLinear, _glExtensionStandardDerivatives, _glExtensionTextureFilterAnisotropic, _glExtensionCompressedTextureS3TC, _glExtensionElementIndexUint, _glExtensionFragDepth, _this = this, _programs = [], _currentProgram = null, _currentFramebuffer = null, _currentMaterialId = -1, _currentGeometryGroupHash = null, _currentCamera = null, _usedTextureUnits = 0, _oldDoubleSided = -1, _oldFlipSided = -1, _oldBlending = -1, _oldBlendEquation = -1, _oldBlendSrc = -1, _oldBlendDst = -1, _oldDepthTest = -1, _oldDepthWrite = -1, _oldPolygonOffset = null, _oldPolygonOffsetFactor = null, _oldPolygonOffsetUnits = null, _oldLineWidth = null, _viewportX = 0, _viewportY = 0, _viewportWidth = _canvas.width, _viewportHeight = _canvas.height, _currentWidth = 0, _currentHeight = 0, _newAttributes = new Uint8Array(16), _enabledAttributes = new Uint8Array(16), _frustum = new THREE.Frustum(), _projScreenMatrix = new THREE.Matrix4(), _projScreenMatrixPS = new THREE.Matrix4(), _vector3 = new THREE.Vector3(), _direction = new THREE.Vector3(), _lightsNeedUpdate = !0, _lights = {
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
            distances: []
        },
        spot: {
            length: 0,
            colors: [],
            positions: [],
            distances: [],
            directions: [],
            anglesCos: [],
            exponents: []
        },
        hemi: {
            length: 0,
            skyColors: [],
            groundColors: [],
            positions: []
        }
    };
    initGL(), setDefaultGLState(), this.context = _gl;
    var _maxTextures = _gl.getParameter(_gl.MAX_TEXTURE_IMAGE_UNITS), _maxVertexTextures = _gl.getParameter(_gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS), _maxCubemapSize = (_gl.getParameter(_gl.MAX_TEXTURE_SIZE), 
    _gl.getParameter(_gl.MAX_CUBE_MAP_TEXTURE_SIZE)), _maxAnisotropy = _glExtensionTextureFilterAnisotropic ? _gl.getParameter(_glExtensionTextureFilterAnisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0, _supportsVertexTextures = _maxVertexTextures > 0, _supportsBoneTextures = _supportsVertexTextures && _glExtensionTextureFloat, _vertexShaderPrecisionHighpFloat = (_glExtensionCompressedTextureS3TC ? _gl.getParameter(_gl.COMPRESSED_TEXTURE_FORMATS) : [], 
    _gl.getShaderPrecisionFormat(_gl.VERTEX_SHADER, _gl.HIGH_FLOAT)), _vertexShaderPrecisionMediumpFloat = _gl.getShaderPrecisionFormat(_gl.VERTEX_SHADER, _gl.MEDIUM_FLOAT), _fragmentShaderPrecisionHighpFloat = (_gl.getShaderPrecisionFormat(_gl.VERTEX_SHADER, _gl.LOW_FLOAT), 
    _gl.getShaderPrecisionFormat(_gl.FRAGMENT_SHADER, _gl.HIGH_FLOAT)), _fragmentShaderPrecisionMediumpFloat = _gl.getShaderPrecisionFormat(_gl.FRAGMENT_SHADER, _gl.MEDIUM_FLOAT), highpAvailable = (_gl.getShaderPrecisionFormat(_gl.FRAGMENT_SHADER, _gl.LOW_FLOAT), 
    _vertexShaderPrecisionHighpFloat.precision > 0 && _fragmentShaderPrecisionHighpFloat.precision > 0), mediumpAvailable = _vertexShaderPrecisionMediumpFloat.precision > 0 && _fragmentShaderPrecisionMediumpFloat.precision > 0;
    "highp" !== _precision || highpAvailable || (mediumpAvailable ? (_precision = "mediump", 
    console.warn("THREE.WebGLRenderer: highp not supported, using mediump.")) : (_precision = "lowp", 
    console.warn("THREE.WebGLRenderer: highp and mediump not supported, using lowp."))), 
    "mediump" !== _precision || mediumpAvailable || (_precision = "lowp", console.warn("THREE.WebGLRenderer: mediump not supported, using lowp.")), 
    this.getContext = function() {
        return _gl;
    }, this.supportsVertexTextures = function() {
        return _supportsVertexTextures;
    }, this.supportsFloatTextures = function() {
        return _glExtensionTextureFloat;
    }, this.supportsStandardDerivatives = function() {
        return _glExtensionStandardDerivatives;
    }, this.supportsCompressedTextureS3TC = function() {
        return _glExtensionCompressedTextureS3TC;
    }, this.getMaxAnisotropy = function() {
        return _maxAnisotropy;
    }, this.getPrecision = function() {
        return _precision;
    }, this.setSize = function(width, height, updateStyle) {
        _canvas.width = width * this.devicePixelRatio, _canvas.height = height * this.devicePixelRatio, 
        updateStyle !== !1 && (_canvas.style.width = width + "px", _canvas.style.height = height + "px"), 
        this.setViewport(0, 0, width, height);
    }, this.setViewport = function(x, y, width, height) {
        _viewportX = x * this.devicePixelRatio, _viewportY = y * this.devicePixelRatio, 
        _viewportWidth = width * this.devicePixelRatio, _viewportHeight = height * this.devicePixelRatio, 
        _gl.viewport(_viewportX, _viewportY, _viewportWidth, _viewportHeight);
    }, this.setScissor = function(x, y, width, height) {
        _gl.scissor(x * this.devicePixelRatio, y * this.devicePixelRatio, width * this.devicePixelRatio, height * this.devicePixelRatio);
    }, this.enableScissorTest = function(enable) {
        enable ? _gl.enable(_gl.SCISSOR_TEST) : _gl.disable(_gl.SCISSOR_TEST);
    }, this.setClearColor = function(color, alpha) {
        _clearColor.set(color), _clearAlpha = void 0 !== alpha ? alpha : 1, _gl.clearColor(_clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha);
    }, this.setClearColorHex = function(hex, alpha) {
        console.warn("THREE.WebGLRenderer: .setClearColorHex() is being removed. Use .setClearColor() instead."), 
        this.setClearColor(hex, alpha);
    }, this.getClearColor = function() {
        return _clearColor;
    }, this.getClearAlpha = function() {
        return _clearAlpha;
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
    }, this.addPostPlugin = function(plugin) {
        plugin.init(this), this.renderPluginsPost.push(plugin);
    }, this.addPrePlugin = function(plugin) {
        plugin.init(this), this.renderPluginsPre.push(plugin);
    }, this.updateShadowMap = function(scene, camera) {
        _currentProgram = null, _oldBlending = -1, _oldDepthTest = -1, _oldDepthWrite = -1, 
        _currentGeometryGroupHash = -1, _currentMaterialId = -1, _lightsNeedUpdate = !0, 
        _oldDoubleSided = -1, _oldFlipSided = -1, initObjects(scene), this.shadowMapPlugin.update(scene, camera);
    };
    var onGeometryDispose = function(event) {
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
        if (void 0 !== geometry.__webglVertexBuffer && _gl.deleteBuffer(geometry.__webglVertexBuffer), 
        void 0 !== geometry.__webglNormalBuffer && _gl.deleteBuffer(geometry.__webglNormalBuffer), 
        void 0 !== geometry.__webglTangentBuffer && _gl.deleteBuffer(geometry.__webglTangentBuffer), 
        void 0 !== geometry.__webglColorBuffer && _gl.deleteBuffer(geometry.__webglColorBuffer), 
        void 0 !== geometry.__webglUVBuffer && _gl.deleteBuffer(geometry.__webglUVBuffer), 
        void 0 !== geometry.__webglUV2Buffer && _gl.deleteBuffer(geometry.__webglUV2Buffer), 
        void 0 !== geometry.__webglSkinIndicesBuffer && _gl.deleteBuffer(geometry.__webglSkinIndicesBuffer), 
        void 0 !== geometry.__webglSkinWeightsBuffer && _gl.deleteBuffer(geometry.__webglSkinWeightsBuffer), 
        void 0 !== geometry.__webglFaceBuffer && _gl.deleteBuffer(geometry.__webglFaceBuffer), 
        void 0 !== geometry.__webglLineBuffer && _gl.deleteBuffer(geometry.__webglLineBuffer), 
        void 0 !== geometry.__webglLineDistanceBuffer && _gl.deleteBuffer(geometry.__webglLineDistanceBuffer), 
        void 0 !== geometry.__webglCustomAttributesList) for (var id in geometry.__webglCustomAttributesList) _gl.deleteBuffer(geometry.__webglCustomAttributesList[id].buffer);
        _this.info.memory.geometries--;
    }, deallocateGeometry = function(geometry) {
        if (geometry.__webglInit = void 0, geometry instanceof THREE.BufferGeometry) {
            var attributes = geometry.attributes;
            for (var key in attributes) void 0 !== attributes[key].buffer && _gl.deleteBuffer(attributes[key].buffer);
            _this.info.memory.geometries--;
        } else if (void 0 !== geometry.geometryGroups) for (var i = 0, l = geometry.geometryGroupsList.length; l > i; i++) {
            var geometryGroup = geometry.geometryGroupsList[i];
            if (void 0 !== geometryGroup.numMorphTargets) for (var m = 0, ml = geometryGroup.numMorphTargets; ml > m; m++) _gl.deleteBuffer(geometryGroup.__webglMorphTargetsBuffers[m]);
            if (void 0 !== geometryGroup.numMorphNormals) for (var m = 0, ml = geometryGroup.numMorphNormals; ml > m; m++) _gl.deleteBuffer(geometryGroup.__webglMorphNormalsBuffers[m]);
            deleteBuffers(geometryGroup);
        } else deleteBuffers(geometry);
    }, deallocateTexture = function(texture) {
        if (texture.image && texture.image.__webglTextureCube) _gl.deleteTexture(texture.image.__webglTextureCube); else {
            if (!texture.__webglInit) return;
            texture.__webglInit = !1, _gl.deleteTexture(texture.__webglTexture);
        }
    }, deallocateRenderTarget = function(renderTarget) {
        if (renderTarget && renderTarget.__webglTexture) if (_gl.deleteTexture(renderTarget.__webglTexture), 
        renderTarget instanceof THREE.WebGLRenderTargetCube) for (var i = 0; 6 > i; i++) _gl.deleteFramebuffer(renderTarget.__webglFramebuffer[i]), 
        _gl.deleteRenderbuffer(renderTarget.__webglRenderbuffer[i]); else _gl.deleteFramebuffer(renderTarget.__webglFramebuffer), 
        _gl.deleteRenderbuffer(renderTarget.__webglRenderbuffer);
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
        if (initAttributes(), object.hasPositions && !object.__webglVertexBuffer && (object.__webglVertexBuffer = _gl.createBuffer()), 
        object.hasNormals && !object.__webglNormalBuffer && (object.__webglNormalBuffer = _gl.createBuffer()), 
        object.hasUvs && !object.__webglUvBuffer && (object.__webglUvBuffer = _gl.createBuffer()), 
        object.hasColors && !object.__webglColorBuffer && (object.__webglColorBuffer = _gl.createBuffer()), 
        object.hasPositions && (_gl.bindBuffer(_gl.ARRAY_BUFFER, object.__webglVertexBuffer), 
        _gl.bufferData(_gl.ARRAY_BUFFER, object.positionArray, _gl.DYNAMIC_DRAW), enableAttribute(program.attributes.position), 
        _gl.vertexAttribPointer(program.attributes.position, 3, _gl.FLOAT, !1, 0, 0)), object.hasNormals) {
            if (_gl.bindBuffer(_gl.ARRAY_BUFFER, object.__webglNormalBuffer), material.shading === THREE.FlatShading) {
                var nx, ny, nz, nax, nbx, ncx, nay, nby, ncy, naz, nbz, ncz, normalArray, i, il = 3 * object.count;
                for (i = 0; il > i; i += 9) normalArray = object.normalArray, nax = normalArray[i], 
                nay = normalArray[i + 1], naz = normalArray[i + 2], nbx = normalArray[i + 3], nby = normalArray[i + 4], 
                nbz = normalArray[i + 5], ncx = normalArray[i + 6], ncy = normalArray[i + 7], ncz = normalArray[i + 8], 
                nx = (nax + nbx + ncx) / 3, ny = (nay + nby + ncy) / 3, nz = (naz + nbz + ncz) / 3, 
                normalArray[i] = nx, normalArray[i + 1] = ny, normalArray[i + 2] = nz, normalArray[i + 3] = nx, 
                normalArray[i + 4] = ny, normalArray[i + 5] = nz, normalArray[i + 6] = nx, normalArray[i + 7] = ny, 
                normalArray[i + 8] = nz;
            }
            _gl.bufferData(_gl.ARRAY_BUFFER, object.normalArray, _gl.DYNAMIC_DRAW), enableAttribute(program.attributes.normal), 
            _gl.vertexAttribPointer(program.attributes.normal, 3, _gl.FLOAT, !1, 0, 0);
        }
        object.hasUvs && material.map && (_gl.bindBuffer(_gl.ARRAY_BUFFER, object.__webglUvBuffer), 
        _gl.bufferData(_gl.ARRAY_BUFFER, object.uvArray, _gl.DYNAMIC_DRAW), enableAttribute(program.attributes.uv), 
        _gl.vertexAttribPointer(program.attributes.uv, 2, _gl.FLOAT, !1, 0, 0)), object.hasColors && material.vertexColors !== THREE.NoColors && (_gl.bindBuffer(_gl.ARRAY_BUFFER, object.__webglColorBuffer), 
        _gl.bufferData(_gl.ARRAY_BUFFER, object.colorArray, _gl.DYNAMIC_DRAW), enableAttribute(program.attributes.color), 
        _gl.vertexAttribPointer(program.attributes.color, 3, _gl.FLOAT, !1, 0, 0)), disableUnusedAttributes(), 
        _gl.drawArrays(_gl.TRIANGLES, 0, object.count), object.count = 0;
    }, this.renderBufferDirect = function(camera, lights, fog, material, geometry, object) {
        if (material.visible !== !1) {
            var program = setProgram(camera, lights, fog, material, object), programAttributes = program.attributes, geometryAttributes = geometry.attributes, updateBuffers = !1, wireframeBit = material.wireframe ? 1 : 0, geometryHash = 16777215 * geometry.id + 2 * program.id + wireframeBit;
            if (geometryHash !== _currentGeometryGroupHash && (_currentGeometryGroupHash = geometryHash, 
            updateBuffers = !0), updateBuffers && initAttributes(), object instanceof THREE.Mesh) {
                var index = geometryAttributes.index;
                if (index) {
                    var type, size;
                    index.array instanceof Uint32Array ? (type = _gl.UNSIGNED_INT, size = 4) : (type = _gl.UNSIGNED_SHORT, 
                    size = 2);
                    var offsets = geometry.offsets;
                    if (0 === offsets.length) updateBuffers && (setupVertexAttributes(material, programAttributes, geometryAttributes, 0), 
                    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, index.buffer)), _gl.drawElements(_gl.TRIANGLES, index.array.length, type, 0), 
                    _this.info.render.calls++, _this.info.render.vertices += index.array.length, _this.info.render.faces += index.array.length / 3; else {
                        updateBuffers = !0;
                        for (var i = 0, il = offsets.length; il > i; i++) {
                            var startIndex = offsets[i].index;
                            updateBuffers && (setupVertexAttributes(material, programAttributes, geometryAttributes, startIndex), 
                            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, index.buffer)), _gl.drawElements(_gl.TRIANGLES, offsets[i].count, type, offsets[i].start * size), 
                            _this.info.render.calls++, _this.info.render.vertices += offsets[i].count, _this.info.render.faces += offsets[i].count / 3;
                        }
                    }
                } else {
                    updateBuffers && setupVertexAttributes(material, programAttributes, geometryAttributes, 0);
                    var position = geometry.attributes.position;
                    _gl.drawArrays(_gl.TRIANGLES, 0, position.array.length / 3), _this.info.render.calls++, 
                    _this.info.render.vertices += position.array.length / 3, _this.info.render.faces += position.array.length / 9;
                }
            } else if (object instanceof THREE.PointCloud) {
                updateBuffers && setupVertexAttributes(material, programAttributes, geometryAttributes, 0);
                var position = geometryAttributes.position;
                _gl.drawArrays(_gl.POINTS, 0, position.array.length / 3), _this.info.render.calls++, 
                _this.info.render.points += position.array.length / 3;
            } else if (object instanceof THREE.Line) {
                var mode = object.type === THREE.LineStrip ? _gl.LINE_STRIP : _gl.LINES;
                setLineWidth(material.linewidth);
                var index = geometryAttributes.index;
                if (index) {
                    var type, size;
                    index.array instanceof Uint32Array ? (type = _gl.UNSIGNED_INT, size = 4) : (type = _gl.UNSIGNED_SHORT, 
                    size = 2);
                    var offsets = geometry.offsets;
                    if (0 === offsets.length) updateBuffers && (setupVertexAttributes(material, programAttributes, geometryAttributes, 0), 
                    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, index.buffer)), _gl.drawElements(mode, index.array.length, type, 0), 
                    _this.info.render.calls++, _this.info.render.vertices += index.array.length; else {
                        offsets.length > 1 && (updateBuffers = !0);
                        for (var i = 0, il = offsets.length; il > i; i++) {
                            var startIndex = offsets[i].index;
                            updateBuffers && (setupVertexAttributes(material, programAttributes, geometryAttributes, startIndex), 
                            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, index.buffer)), _gl.drawElements(mode, offsets[i].count, type, offsets[i].start * size), 
                            _this.info.render.calls++, _this.info.render.vertices += offsets[i].count;
                        }
                    }
                } else {
                    updateBuffers && setupVertexAttributes(material, programAttributes, geometryAttributes, 0);
                    var position = geometryAttributes.position;
                    _gl.drawArrays(mode, 0, position.array.length / 3), _this.info.render.calls++, _this.info.render.points += position.array.length / 3;
                }
            }
        }
    }, this.renderBuffer = function(camera, lights, fog, material, geometryGroup, object) {
        if (material.visible !== !1) {
            var attribute, i, il, program = setProgram(camera, lights, fog, material, object), attributes = program.attributes, updateBuffers = !1, wireframeBit = material.wireframe ? 1 : 0, geometryGroupHash = 16777215 * geometryGroup.id + 2 * program.id + wireframeBit;
            if (geometryGroupHash !== _currentGeometryGroupHash && (_currentGeometryGroupHash = geometryGroupHash, 
            updateBuffers = !0), updateBuffers && initAttributes(), !material.morphTargets && attributes.position >= 0 ? updateBuffers && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglVertexBuffer), 
            enableAttribute(attributes.position), _gl.vertexAttribPointer(attributes.position, 3, _gl.FLOAT, !1, 0, 0)) : object.morphTargetBase && setupMorphTargets(material, geometryGroup, object), 
            updateBuffers) {
                if (geometryGroup.__webglCustomAttributesList) for (i = 0, il = geometryGroup.__webglCustomAttributesList.length; il > i; i++) attribute = geometryGroup.__webglCustomAttributesList[i], 
                attributes[attribute.buffer.belongsToAttribute] >= 0 && (_gl.bindBuffer(_gl.ARRAY_BUFFER, attribute.buffer), 
                enableAttribute(attributes[attribute.buffer.belongsToAttribute]), _gl.vertexAttribPointer(attributes[attribute.buffer.belongsToAttribute], attribute.size, _gl.FLOAT, !1, 0, 0));
                attributes.color >= 0 && (object.geometry.colors.length > 0 || object.geometry.faces.length > 0 ? (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglColorBuffer), 
                enableAttribute(attributes.color), _gl.vertexAttribPointer(attributes.color, 3, _gl.FLOAT, !1, 0, 0)) : material.defaultAttributeValues && _gl.vertexAttrib3fv(attributes.color, material.defaultAttributeValues.color)), 
                attributes.normal >= 0 && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglNormalBuffer), 
                enableAttribute(attributes.normal), _gl.vertexAttribPointer(attributes.normal, 3, _gl.FLOAT, !1, 0, 0)), 
                attributes.tangent >= 0 && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglTangentBuffer), 
                enableAttribute(attributes.tangent), _gl.vertexAttribPointer(attributes.tangent, 4, _gl.FLOAT, !1, 0, 0)), 
                attributes.uv >= 0 && (object.geometry.faceVertexUvs[0] ? (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglUVBuffer), 
                enableAttribute(attributes.uv), _gl.vertexAttribPointer(attributes.uv, 2, _gl.FLOAT, !1, 0, 0)) : material.defaultAttributeValues && _gl.vertexAttrib2fv(attributes.uv, material.defaultAttributeValues.uv)), 
                attributes.uv2 >= 0 && (object.geometry.faceVertexUvs[1] ? (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglUV2Buffer), 
                enableAttribute(attributes.uv2), _gl.vertexAttribPointer(attributes.uv2, 2, _gl.FLOAT, !1, 0, 0)) : material.defaultAttributeValues && _gl.vertexAttrib2fv(attributes.uv2, material.defaultAttributeValues.uv2)), 
                material.skinning && attributes.skinIndex >= 0 && attributes.skinWeight >= 0 && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglSkinIndicesBuffer), 
                enableAttribute(attributes.skinIndex), _gl.vertexAttribPointer(attributes.skinIndex, 4, _gl.FLOAT, !1, 0, 0), 
                _gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglSkinWeightsBuffer), enableAttribute(attributes.skinWeight), 
                _gl.vertexAttribPointer(attributes.skinWeight, 4, _gl.FLOAT, !1, 0, 0)), attributes.lineDistance >= 0 && (_gl.bindBuffer(_gl.ARRAY_BUFFER, geometryGroup.__webglLineDistanceBuffer), 
                enableAttribute(attributes.lineDistance), _gl.vertexAttribPointer(attributes.lineDistance, 1, _gl.FLOAT, !1, 0, 0));
            }
            if (disableUnusedAttributes(), object instanceof THREE.Mesh) {
                var type = geometryGroup.__typeArray === Uint32Array ? _gl.UNSIGNED_INT : _gl.UNSIGNED_SHORT;
                material.wireframe ? (setLineWidth(material.wireframeLinewidth), updateBuffers && _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, geometryGroup.__webglLineBuffer), 
                _gl.drawElements(_gl.LINES, geometryGroup.__webglLineCount, type, 0)) : (updateBuffers && _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, geometryGroup.__webglFaceBuffer), 
                _gl.drawElements(_gl.TRIANGLES, geometryGroup.__webglFaceCount, type, 0)), _this.info.render.calls++, 
                _this.info.render.vertices += geometryGroup.__webglFaceCount, _this.info.render.faces += geometryGroup.__webglFaceCount / 3;
            } else if (object instanceof THREE.Line) {
                var mode = object.type === THREE.LineStrip ? _gl.LINE_STRIP : _gl.LINES;
                setLineWidth(material.linewidth), _gl.drawArrays(mode, 0, geometryGroup.__webglLineCount), 
                _this.info.render.calls++;
            } else object instanceof THREE.PointCloud && (_gl.drawArrays(_gl.POINTS, 0, geometryGroup.__webglParticleCount), 
            _this.info.render.calls++, _this.info.render.points += geometryGroup.__webglParticleCount);
        }
    }, this.render = function(scene, camera, renderTarget, forceClear) {
        function updateSkeletons(object) {
            object instanceof THREE.SkinnedMesh && object.skeleton.update();
            for (var i = 0, l = object.children.length; l > i; i++) updateSkeletons(object.children[i]);
        }
        if (camera instanceof THREE.Camera == !1) return void console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");
        var i, il, webglObject, object, renderList, lights = scene.__lights, fog = scene.fog;
        for (_currentMaterialId = -1, _currentCamera = null, _lightsNeedUpdate = !0, scene.autoUpdate === !0 && scene.updateMatrixWorld(), 
        void 0 === camera.parent && camera.updateMatrixWorld(), updateSkeletons(scene), 
        camera.matrixWorldInverse.getInverse(camera.matrixWorld), _projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse), 
        _frustum.setFromMatrix(_projScreenMatrix), initObjects(scene), opaqueObjects.length = 0, 
        transparentObjects.length = 0, projectObject(scene, scene, camera), _this.sortObjects === !0 && (opaqueObjects.sort(painterSortStable), 
        transparentObjects.sort(reversePainterSortStable)), renderPlugins(this.renderPluginsPre, scene, camera), 
        _this.info.render.calls = 0, _this.info.render.vertices = 0, _this.info.render.faces = 0, 
        _this.info.render.points = 0, this.setRenderTarget(renderTarget), (this.autoClear || forceClear) && this.clear(this.autoClearColor, this.autoClearDepth, this.autoClearStencil), 
        renderList = scene.__webglObjectsImmediate, i = 0, il = renderList.length; il > i; i++) webglObject = renderList[i], 
        object = webglObject.object, object.visible && (setupMatrices(object, camera), unrollImmediateBufferMaterial(webglObject));
        if (scene.overrideMaterial) {
            var material = scene.overrideMaterial;
            this.setBlending(material.blending, material.blendEquation, material.blendSrc, material.blendDst), 
            this.setDepthTest(material.depthTest), this.setDepthWrite(material.depthWrite), 
            setPolygonOffset(material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits), 
            renderObjects(opaqueObjects, camera, lights, fog, !0, material), renderObjects(transparentObjects, camera, lights, fog, !0, material), 
            renderObjectsImmediate(scene.__webglObjectsImmediate, "", camera, lights, fog, !1, material);
        } else {
            var material = null;
            this.setBlending(THREE.NoBlending), renderObjects(opaqueObjects, camera, lights, fog, !1, material), 
            renderObjectsImmediate(scene.__webglObjectsImmediate, "opaque", camera, lights, fog, !1, material), 
            renderObjects(transparentObjects, camera, lights, fog, !0, material), renderObjectsImmediate(scene.__webglObjectsImmediate, "transparent", camera, lights, fog, !0, material);
        }
        renderPlugins(this.renderPluginsPost, scene, camera), renderTarget && renderTarget.generateMipmaps && renderTarget.minFilter !== THREE.NearestFilter && renderTarget.minFilter !== THREE.LinearFilter && updateRenderTargetMipmap(renderTarget), 
        this.setDepthTest(!0), this.setDepthWrite(!0);
    }, this.renderImmediateObject = function(camera, lights, fog, material, object) {
        var program = setProgram(camera, lights, fog, material, object);
        _currentGeometryGroupHash = -1, _this.setMaterialFaces(material), object.immediateRenderCallback ? object.immediateRenderCallback(program, _gl, _frustum) : object.render(function(object) {
            _this.renderBufferImmediate(object, program, material);
        });
    };
    var initObjects = function(scene) {
        for (scene.__webglObjects || (scene.__webglObjects = {}, scene.__webglObjectsImmediate = []); scene.__objectsAdded.length; ) addObject(scene.__objectsAdded[0], scene), 
        scene.__objectsAdded.splice(0, 1);
        for (;scene.__objectsRemoved.length; ) removeObject(scene.__objectsRemoved[0], scene), 
        scene.__objectsRemoved.splice(0, 1);
    };
    this.initMaterial = function(material, lights, fog, object) {
        material.addEventListener("dispose", onMaterialDispose);
        var u, i, parameters, maxLightCount, maxBones, maxShadows, shaderID;
        if (material instanceof THREE.MeshDepthMaterial ? shaderID = "depth" : material instanceof THREE.MeshNormalMaterial ? shaderID = "normal" : material instanceof THREE.MeshBasicMaterial ? shaderID = "basic" : material instanceof THREE.MeshLambertMaterial ? shaderID = "lambert" : material instanceof THREE.MeshPhongMaterial ? shaderID = "phong" : material instanceof THREE.LineBasicMaterial ? shaderID = "basic" : material instanceof THREE.LineDashedMaterial ? shaderID = "dashed" : material instanceof THREE.PointCloudMaterial && (shaderID = "particle_basic"), 
        shaderID) {
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
        maxLightCount = allocateLights(lights), maxShadows = allocateShadows(lights), maxBones = allocateBones(object), 
        parameters = {
            precision: _precision,
            supportsVertexTextures: _supportsVertexTextures,
            map: !!material.map,
            envMap: !!material.envMap,
            lightMap: !!material.lightMap,
            bumpMap: !!material.bumpMap,
            normalMap: !!material.normalMap,
            specularMap: !!material.specularMap,
            alphaMap: !!material.alphaMap,
            vertexColors: material.vertexColors,
            fog: fog,
            useFog: material.fog,
            fogExp: fog instanceof THREE.FogExp2,
            sizeAttenuation: material.sizeAttenuation,
            logarithmicDepthBuffer: _logarithmicDepthBuffer,
            skinning: material.skinning,
            maxBones: maxBones,
            useVertexTexture: _supportsBoneTextures && object && object.skeleton && object.skeleton.useVertexTexture,
            morphTargets: material.morphTargets,
            morphNormals: material.morphNormals,
            maxMorphTargets: this.maxMorphTargets,
            maxMorphNormals: this.maxMorphNormals,
            maxDirLights: maxLightCount.directional,
            maxPointLights: maxLightCount.point,
            maxSpotLights: maxLightCount.spot,
            maxHemiLights: maxLightCount.hemi,
            maxShadows: maxShadows,
            shadowMapEnabled: this.shadowMapEnabled && object.receiveShadow && maxShadows > 0,
            shadowMapType: this.shadowMapType,
            shadowMapDebug: this.shadowMapDebug,
            shadowMapCascade: this.shadowMapCascade,
            alphaTest: material.alphaTest,
            metal: material.metal,
            wrapAround: material.wrapAround,
            doubleSided: material.side === THREE.DoubleSide,
            flipSided: material.side === THREE.BackSide
        };
        var chunks = [];
        shaderID ? chunks.push(shaderID) : (chunks.push(material.fragmentShader), chunks.push(material.vertexShader));
        for (var d in material.defines) chunks.push(d), chunks.push(material.defines[d]);
        for (var p in parameters) chunks.push(p), chunks.push(parameters[p]);
        for (var program, code = chunks.join(), p = 0, pl = _programs.length; pl > p; p++) {
            var programInfo = _programs[p];
            if (programInfo.code === code) {
                program = programInfo, program.usedTimes++;
                break;
            }
        }
        void 0 === program && (program = new THREE.WebGLProgram(this, code, material, parameters), 
        _programs.push(program), _this.info.memory.programs = _programs.length), material.program = program;
        var attributes = material.program.attributes;
        if (material.morphTargets) {
            material.numSupportedMorphTargets = 0;
            var id, base = "morphTarget";
            for (i = 0; i < this.maxMorphTargets; i++) id = base + i, attributes[id] >= 0 && material.numSupportedMorphTargets++;
        }
        if (material.morphNormals) {
            material.numSupportedMorphNormals = 0;
            var id, base = "morphNormal";
            for (i = 0; i < this.maxMorphNormals; i++) id = base + i, attributes[id] >= 0 && material.numSupportedMorphNormals++;
        }
        material.uniformsList = [];
        for (u in material.__webglShader.uniforms) {
            var location = material.program.uniforms[u];
            location && material.uniformsList.push([ material.__webglShader.uniforms[u], location ]);
        }
    }, this.setFaceCulling = function(cullFace, frontFaceDirection) {
        cullFace === THREE.CullFaceNone ? _gl.disable(_gl.CULL_FACE) : (_gl.frontFace(frontFaceDirection === THREE.FrontFaceDirectionCW ? _gl.CW : _gl.CCW), 
        _gl.cullFace(cullFace === THREE.CullFaceBack ? _gl.BACK : cullFace === THREE.CullFaceFront ? _gl.FRONT : _gl.FRONT_AND_BACK), 
        _gl.enable(_gl.CULL_FACE));
    }, this.setMaterialFaces = function(material) {
        var doubleSided = material.side === THREE.DoubleSide, flipSided = material.side === THREE.BackSide;
        _oldDoubleSided !== doubleSided && (doubleSided ? _gl.disable(_gl.CULL_FACE) : _gl.enable(_gl.CULL_FACE), 
        _oldDoubleSided = doubleSided), _oldFlipSided !== flipSided && (_gl.frontFace(flipSided ? _gl.CW : _gl.CCW), 
        _oldFlipSided = flipSided);
    }, this.setDepthTest = function(depthTest) {
        _oldDepthTest !== depthTest && (depthTest ? _gl.enable(_gl.DEPTH_TEST) : _gl.disable(_gl.DEPTH_TEST), 
        _oldDepthTest = depthTest);
    }, this.setDepthWrite = function(depthWrite) {
        _oldDepthWrite !== depthWrite && (_gl.depthMask(depthWrite), _oldDepthWrite = depthWrite);
    }, this.setBlending = function(blending, blendEquation, blendSrc, blendDst) {
        blending !== _oldBlending && (blending === THREE.NoBlending ? _gl.disable(_gl.BLEND) : blending === THREE.AdditiveBlending ? (_gl.enable(_gl.BLEND), 
        _gl.blendEquation(_gl.FUNC_ADD), _gl.blendFunc(_gl.SRC_ALPHA, _gl.ONE)) : blending === THREE.SubtractiveBlending ? (_gl.enable(_gl.BLEND), 
        _gl.blendEquation(_gl.FUNC_ADD), _gl.blendFunc(_gl.ZERO, _gl.ONE_MINUS_SRC_COLOR)) : blending === THREE.MultiplyBlending ? (_gl.enable(_gl.BLEND), 
        _gl.blendEquation(_gl.FUNC_ADD), _gl.blendFunc(_gl.ZERO, _gl.SRC_COLOR)) : blending === THREE.CustomBlending ? _gl.enable(_gl.BLEND) : (_gl.enable(_gl.BLEND), 
        _gl.blendEquationSeparate(_gl.FUNC_ADD, _gl.FUNC_ADD), _gl.blendFuncSeparate(_gl.SRC_ALPHA, _gl.ONE_MINUS_SRC_ALPHA, _gl.ONE, _gl.ONE_MINUS_SRC_ALPHA)), 
        _oldBlending = blending), blending === THREE.CustomBlending ? (blendEquation !== _oldBlendEquation && (_gl.blendEquation(paramThreeToGL(blendEquation)), 
        _oldBlendEquation = blendEquation), (blendSrc !== _oldBlendSrc || blendDst !== _oldBlendDst) && (_gl.blendFunc(paramThreeToGL(blendSrc), paramThreeToGL(blendDst)), 
        _oldBlendSrc = blendSrc, _oldBlendDst = blendDst)) : (_oldBlendEquation = null, 
        _oldBlendSrc = null, _oldBlendDst = null);
    }, this.setTexture = function(texture, slot) {
        if (texture.needsUpdate) {
            texture.__webglInit || (texture.__webglInit = !0, texture.addEventListener("dispose", onTextureDispose), 
            texture.__webglTexture = _gl.createTexture(), _this.info.memory.textures++), _gl.activeTexture(_gl.TEXTURE0 + slot), 
            _gl.bindTexture(_gl.TEXTURE_2D, texture.__webglTexture), _gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, texture.flipY), 
            _gl.pixelStorei(_gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultiplyAlpha), _gl.pixelStorei(_gl.UNPACK_ALIGNMENT, texture.unpackAlignment);
            var image = texture.image, isImagePowerOfTwo = THREE.Math.isPowerOfTwo(image.width) && THREE.Math.isPowerOfTwo(image.height), glFormat = paramThreeToGL(texture.format), glType = paramThreeToGL(texture.type);
            setTextureParameters(_gl.TEXTURE_2D, texture, isImagePowerOfTwo);
            var mipmap, mipmaps = texture.mipmaps;
            if (texture instanceof THREE.DataTexture) if (mipmaps.length > 0 && isImagePowerOfTwo) {
                for (var i = 0, il = mipmaps.length; il > i; i++) mipmap = mipmaps[i], _gl.texImage2D(_gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data);
                texture.generateMipmaps = !1;
            } else _gl.texImage2D(_gl.TEXTURE_2D, 0, glFormat, image.width, image.height, 0, glFormat, glType, image.data); else if (texture instanceof THREE.CompressedTexture) for (var i = 0, il = mipmaps.length; il > i; i++) mipmap = mipmaps[i], 
            texture.format !== THREE.RGBAFormat ? _gl.compressedTexImage2D(_gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, mipmap.data) : _gl.texImage2D(_gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data); else if (mipmaps.length > 0 && isImagePowerOfTwo) {
                for (var i = 0, il = mipmaps.length; il > i; i++) mipmap = mipmaps[i], _gl.texImage2D(_gl.TEXTURE_2D, i, glFormat, glFormat, glType, mipmap);
                texture.generateMipmaps = !1;
            } else _gl.texImage2D(_gl.TEXTURE_2D, 0, glFormat, glFormat, glType, texture.image);
            texture.generateMipmaps && isImagePowerOfTwo && _gl.generateMipmap(_gl.TEXTURE_2D), 
            texture.needsUpdate = !1, texture.onUpdate && texture.onUpdate();
        } else _gl.activeTexture(_gl.TEXTURE0 + slot), _gl.bindTexture(_gl.TEXTURE_2D, texture.__webglTexture);
    }, this.setRenderTarget = function(renderTarget) {
        var isCube = renderTarget instanceof THREE.WebGLRenderTargetCube;
        if (renderTarget && !renderTarget.__webglFramebuffer) {
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
            } else renderTarget.__webglFramebuffer = _gl.createFramebuffer(), renderTarget.__webglRenderbuffer = renderTarget.shareDepthFrom ? renderTarget.shareDepthFrom.__webglRenderbuffer : _gl.createRenderbuffer(), 
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
    }, this.shadowMapPlugin = new THREE.ShadowMapPlugin(), this.addPrePlugin(this.shadowMapPlugin), 
    this.addPostPlugin(new THREE.SpritePlugin()), this.addPostPlugin(new THREE.LensFlarePlugin());
}, THREE.WebGLRenderTarget = function(width, height, options) {
    this.width = width, this.height = height, options = options || {}, this.wrapS = void 0 !== options.wrapS ? options.wrapS : THREE.ClampToEdgeWrapping, 
    this.wrapT = void 0 !== options.wrapT ? options.wrapT : THREE.ClampToEdgeWrapping, 
    this.magFilter = void 0 !== options.magFilter ? options.magFilter : THREE.LinearFilter, 
    this.minFilter = void 0 !== options.minFilter ? options.minFilter : THREE.LinearMipMapLinearFilter, 
    this.anisotropy = void 0 !== options.anisotropy ? options.anisotropy : 1, this.offset = new THREE.Vector2(0, 0), 
    this.repeat = new THREE.Vector2(1, 1), this.format = void 0 !== options.format ? options.format : THREE.RGBAFormat, 
    this.type = void 0 !== options.type ? options.type : THREE.UnsignedByteType, this.depthBuffer = void 0 !== options.depthBuffer ? options.depthBuffer : !0, 
    this.stencilBuffer = void 0 !== options.stencilBuffer ? options.stencilBuffer : !0, 
    this.generateMipmaps = !0, this.shareDepthFrom = null;
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
THREE.WebGLProgram = function() {
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
        var prefix_vertex, prefix_fragment, customDefines = generateDefines(defines), program = _gl.createProgram();
        material instanceof THREE.RawShaderMaterial ? (prefix_vertex = "", prefix_fragment = "") : (prefix_vertex = [ "precision " + parameters.precision + " float;", "precision " + parameters.precision + " int;", customDefines, parameters.supportsVertexTextures ? "#define VERTEX_TEXTURES" : "", _this.gammaInput ? "#define GAMMA_INPUT" : "", _this.gammaOutput ? "#define GAMMA_OUTPUT" : "", "#define MAX_DIR_LIGHTS " + parameters.maxDirLights, "#define MAX_POINT_LIGHTS " + parameters.maxPointLights, "#define MAX_SPOT_LIGHTS " + parameters.maxSpotLights, "#define MAX_HEMI_LIGHTS " + parameters.maxHemiLights, "#define MAX_SHADOWS " + parameters.maxShadows, "#define MAX_BONES " + parameters.maxBones, parameters.map ? "#define USE_MAP" : "", parameters.envMap ? "#define USE_ENVMAP" : "", parameters.lightMap ? "#define USE_LIGHTMAP" : "", parameters.bumpMap ? "#define USE_BUMPMAP" : "", parameters.normalMap ? "#define USE_NORMALMAP" : "", parameters.specularMap ? "#define USE_SPECULARMAP" : "", parameters.alphaMap ? "#define USE_ALPHAMAP" : "", parameters.vertexColors ? "#define USE_COLOR" : "", parameters.skinning ? "#define USE_SKINNING" : "", parameters.useVertexTexture ? "#define BONE_TEXTURE" : "", parameters.morphTargets ? "#define USE_MORPHTARGETS" : "", parameters.morphNormals ? "#define USE_MORPHNORMALS" : "", parameters.wrapAround ? "#define WRAP_AROUND" : "", parameters.doubleSided ? "#define DOUBLE_SIDED" : "", parameters.flipSided ? "#define FLIP_SIDED" : "", parameters.shadowMapEnabled ? "#define USE_SHADOWMAP" : "", parameters.shadowMapEnabled ? "#define " + shadowMapTypeDefine : "", parameters.shadowMapDebug ? "#define SHADOWMAP_DEBUG" : "", parameters.shadowMapCascade ? "#define SHADOWMAP_CASCADE" : "", parameters.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "", parameters.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "", "uniform mat4 modelMatrix;", "uniform mat4 modelViewMatrix;", "uniform mat4 projectionMatrix;", "uniform mat4 viewMatrix;", "uniform mat3 normalMatrix;", "uniform vec3 cameraPosition;", "attribute vec3 position;", "attribute vec3 normal;", "attribute vec2 uv;", "attribute vec2 uv2;", "#ifdef USE_COLOR", "	attribute vec3 color;", "#endif", "#ifdef USE_MORPHTARGETS", "	attribute vec3 morphTarget0;", "	attribute vec3 morphTarget1;", "	attribute vec3 morphTarget2;", "	attribute vec3 morphTarget3;", "	#ifdef USE_MORPHNORMALS", "		attribute vec3 morphNormal0;", "		attribute vec3 morphNormal1;", "		attribute vec3 morphNormal2;", "		attribute vec3 morphNormal3;", "	#else", "		attribute vec3 morphTarget4;", "		attribute vec3 morphTarget5;", "		attribute vec3 morphTarget6;", "		attribute vec3 morphTarget7;", "	#endif", "#endif", "#ifdef USE_SKINNING", "	attribute vec4 skinIndex;", "	attribute vec4 skinWeight;", "#endif", "" ].join("\n"), 
        prefix_fragment = [ "precision " + parameters.precision + " float;", "precision " + parameters.precision + " int;", parameters.bumpMap || parameters.normalMap ? "#extension GL_OES_standard_derivatives : enable" : "", customDefines, "#define MAX_DIR_LIGHTS " + parameters.maxDirLights, "#define MAX_POINT_LIGHTS " + parameters.maxPointLights, "#define MAX_SPOT_LIGHTS " + parameters.maxSpotLights, "#define MAX_HEMI_LIGHTS " + parameters.maxHemiLights, "#define MAX_SHADOWS " + parameters.maxShadows, parameters.alphaTest ? "#define ALPHATEST " + parameters.alphaTest : "", _this.gammaInput ? "#define GAMMA_INPUT" : "", _this.gammaOutput ? "#define GAMMA_OUTPUT" : "", parameters.useFog && parameters.fog ? "#define USE_FOG" : "", parameters.useFog && parameters.fogExp ? "#define FOG_EXP2" : "", parameters.map ? "#define USE_MAP" : "", parameters.envMap ? "#define USE_ENVMAP" : "", parameters.lightMap ? "#define USE_LIGHTMAP" : "", parameters.bumpMap ? "#define USE_BUMPMAP" : "", parameters.normalMap ? "#define USE_NORMALMAP" : "", parameters.specularMap ? "#define USE_SPECULARMAP" : "", parameters.alphaMap ? "#define USE_ALPHAMAP" : "", parameters.vertexColors ? "#define USE_COLOR" : "", parameters.metal ? "#define METAL" : "", parameters.wrapAround ? "#define WRAP_AROUND" : "", parameters.doubleSided ? "#define DOUBLE_SIDED" : "", parameters.flipSided ? "#define FLIP_SIDED" : "", parameters.shadowMapEnabled ? "#define USE_SHADOWMAP" : "", parameters.shadowMapEnabled ? "#define " + shadowMapTypeDefine : "", parameters.shadowMapDebug ? "#define SHADOWMAP_DEBUG" : "", parameters.shadowMapCascade ? "#define SHADOWMAP_CASCADE" : "", parameters.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "", "uniform mat4 viewMatrix;", "uniform vec3 cameraPosition;", "" ].join("\n"));
        var glVertexShader = new THREE.WebGLShader(_gl, _gl.VERTEX_SHADER, prefix_vertex + vertexShader), glFragmentShader = new THREE.WebGLShader(_gl, _gl.FRAGMENT_SHADER, prefix_fragment + fragmentShader);
        _gl.attachShader(program, glVertexShader), _gl.attachShader(program, glFragmentShader), 
        void 0 !== index0AttributeName && _gl.bindAttribLocation(program, 0, index0AttributeName), 
        _gl.linkProgram(program), _gl.getProgramParameter(program, _gl.LINK_STATUS) === !1 && (console.error("THREE.WebGLProgram: Could not initialise shader."), 
        console.error("gl.VALIDATE_STATUS", _gl.getProgramParameter(program, _gl.VALIDATE_STATUS)), 
        console.error("gl.getError()", _gl.getError())), "" !== _gl.getProgramInfoLog(program) && console.warn("THREE.WebGLProgram: gl.getProgramInfoLog()", _gl.getProgramInfoLog(program)), 
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
        return this.attributes = cacheAttributeLocations(_gl, program, identifiers), this.id = programIdCount++, 
        this.code = code, this.usedTimes = 1, this.program = program, this.vertexShader = glVertexShader, 
        this.fragmentShader = glFragmentShader, this;
    };
}(), THREE.WebGLShader = function() {
    var addLineNumbers = function(string) {
        for (var lines = string.split("\n"), i = 0; i < lines.length; i++) lines[i] = i + 1 + ": " + lines[i];
        return lines.join("\n");
    };
    return function(gl, type, string) {
        var shader = gl.createShader(type);
        return gl.shaderSource(shader, string), gl.compileShader(shader), gl.getShaderParameter(shader, gl.COMPILE_STATUS) === !1 && console.error("THREE.WebGLShader: Shader couldn't compile."), 
        "" !== gl.getShaderInfoLog(shader) && (console.warn("THREE.WebGLShader: gl.getShaderInfoLog()", gl.getShaderInfoLog(shader)), 
        console.warn(addLineNumbers(string))), shader;
    };
}(), THREE.RenderableVertex = function() {
    this.position = new THREE.Vector3(), this.positionWorld = new THREE.Vector3(), this.positionScreen = new THREE.Vector4(), 
    this.visible = !0;
}, THREE.RenderableVertex.prototype.copy = function(vertex) {
    this.positionWorld.copy(vertex.positionWorld), this.positionScreen.copy(vertex.positionScreen);
}, THREE.RenderableFace = function() {
    this.id = 0, this.v1 = new THREE.RenderableVertex(), this.v2 = new THREE.RenderableVertex(), 
    this.v3 = new THREE.RenderableVertex(), this.normalModel = new THREE.Vector3(), 
    this.vertexNormalsModel = [ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ], 
    this.vertexNormalsLength = 0, this.color = new THREE.Color(), this.material = null, 
    this.uvs = [ new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2() ], this.z = 0;
}, THREE.RenderableObject = function() {
    this.id = 0, this.object = null, this.z = 0;
}, THREE.RenderableSprite = function() {
    this.id = 0, this.object = null, this.x = 0, this.y = 0, this.z = 0, this.rotation = 0, 
    this.scale = new THREE.Vector2(), this.material = null;
}, THREE.RenderableLine = function() {
    this.id = 0, this.v1 = new THREE.RenderableVertex(), this.v2 = new THREE.RenderableVertex(), 
    this.vertexColors = [ new THREE.Color(), new THREE.Color() ], this.material = null, 
    this.z = 0;
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
        var loader = new THREE.ImageLoader();
        loader.crossOrigin = this.crossOrigin;
        var texture = new THREE.Texture(void 0, mapping);
        return loader.load(url, function(image) {
            texture.image = image, texture.needsUpdate = !0, onLoad && onLoad(texture);
        }, void 0, function(event) {
            onError && onError(event);
        }), texture.sourceFile = url, texture;
    },
    loadTextureCube: function(array, mapping, onLoad) {
        var images = [], loader = new THREE.ImageLoader();
        loader.crossOrigin = this.crossOrigin;
        var texture = new THREE.CubeTexture(images, mapping);
        texture.flipY = !1;
        for (var loaded = 0, loadTexture = function(i) {
            loader.load(array[i], function(image) {
                texture.images[i] = image, loaded += 1, 6 === loaded && (texture.needsUpdate = !0, 
                onLoad && onLoad(texture));
            });
        }, i = 0, il = array.length; il > i; ++i) loadTexture(i);
        return texture;
    },
    loadCompressedTexture: function() {
        console.error("THREE.ImageUtils.loadCompressedTexture has been removed. Use THREE.DDSLoader instead.");
    },
    loadCompressedTextureCube: function() {
        console.error("THREE.ImageUtils.loadCompressedTextureCube has been removed. Use THREE.DDSLoader instead.");
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
        ThreeFont.faces[family] = ThreeFont.faces[family] || {}, ThreeFont.faces[family][data.cssFontWeight] = ThreeFont.faces[family][data.cssFontWeight] || {}, 
        ThreeFont.faces[family][data.cssFontWeight][data.cssFontStyle] = data;
        ThreeFont.faces[family][data.cssFontWeight][data.cssFontStyle] = data;
        return data;
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
            if (count-- <= 0) return console.log("Warning, unable to triangulate polygon!"), 
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
}, THREE.typeface_js = self._typeface_js, THREE.Curve = function() {}, THREE.Curve.prototype.getPoint = function() {
    return console.log("Warning, getPoint() not implemented!"), null;
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
    tangentSpline: function(t) {
        var h00 = 6 * t * t - 6 * t, h10 = 3 * t * t - 4 * t + 1, h01 = -6 * t * t + 6 * t, h11 = 3 * t * t - 2 * t;
        return h00 + h10 + h01 + h11;
    },
    interpolate: function(p0, p1, p2, p3, t) {
        var v0 = .5 * (p2 - p0), v1 = .5 * (p3 - p1), t2 = t * t, t3 = t * t2;
        return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
    }
}, THREE.Curve.create = function(constructor, getPointFunc) {
    return constructor.prototype = Object.create(THREE.Curve.prototype), constructor.prototype.getPoint = getPointFunc, 
    constructor;
}, THREE.CurvePath = function() {
    this.curves = [], this.bends = [], this.autoClose = !1;
}, THREE.CurvePath.prototype = Object.create(THREE.Curve.prototype), THREE.CurvePath.prototype.add = function(curve) {
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
}, THREE.Gyroscope.prototype = Object.create(THREE.Object3D.prototype), THREE.Gyroscope.prototype.updateMatrixWorld = function(force) {
    this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || force) && (this.parent ? (this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix), 
    this.matrixWorld.decompose(this.translationWorld, this.quaternionWorld, this.scaleWorld), 
    this.matrix.decompose(this.translationObject, this.quaternionObject, this.scaleObject), 
    this.matrixWorld.compose(this.translationWorld, this.quaternionObject, this.scaleWorld)) : this.matrixWorld.copy(this.matrix), 
    this.matrixWorldNeedsUpdate = !1, force = !0);
    for (var i = 0, l = this.children.length; l > i; i++) this.children[i].updateMatrixWorld(force);
}, THREE.Gyroscope.prototype.translationWorld = new THREE.Vector3(), THREE.Gyroscope.prototype.translationObject = new THREE.Vector3(), 
THREE.Gyroscope.prototype.quaternionWorld = new THREE.Quaternion(), THREE.Gyroscope.prototype.quaternionObject = new THREE.Quaternion(), 
THREE.Gyroscope.prototype.scaleWorld = new THREE.Vector3(), THREE.Gyroscope.prototype.scaleObject = new THREE.Vector3(), 
THREE.Path = function(points) {
    THREE.CurvePath.call(this), this.actions = [], points && this.fromPoints(points);
}, THREE.Path.prototype = Object.create(THREE.CurvePath.prototype), THREE.PathActions = {
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
}, THREE.Path.prototype.moveTo = function() {
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
}, THREE.Path.prototype.getSpacedPoints = function(divisions) {
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
        for (var sIdx = 0, sLen = newShapes.length; sLen > sIdx; sIdx++) for (var sho = (newShapes[sIdx], 
        newShapeHoles[sIdx]), hIdx = 0; hIdx < sho.length; hIdx++) {
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
}, THREE.Shape.prototype = Object.create(THREE.Path.prototype), THREE.Shape.prototype.extrude = function(options) {
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
        void 0 !== allPointsMap[key] && console.log("Duplicate point", key), allPointsMap[key] = i;
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
}, THREE.LineCurve.prototype = Object.create(THREE.Curve.prototype), THREE.LineCurve.prototype.getPoint = function(t) {
    var point = this.v2.clone().sub(this.v1);
    return point.multiplyScalar(t).add(this.v1), point;
}, THREE.LineCurve.prototype.getPointAt = function(u) {
    return this.getPoint(u);
}, THREE.LineCurve.prototype.getTangent = function() {
    var tangent = this.v2.clone().sub(this.v1);
    return tangent.normalize();
}, THREE.QuadraticBezierCurve = function(v0, v1, v2) {
    this.v0 = v0, this.v1 = v1, this.v2 = v2;
}, THREE.QuadraticBezierCurve.prototype = Object.create(THREE.Curve.prototype), 
THREE.QuadraticBezierCurve.prototype.getPoint = function(t) {
    var tx, ty;
    return tx = THREE.Shape.Utils.b2(t, this.v0.x, this.v1.x, this.v2.x), ty = THREE.Shape.Utils.b2(t, this.v0.y, this.v1.y, this.v2.y), 
    new THREE.Vector2(tx, ty);
}, THREE.QuadraticBezierCurve.prototype.getTangent = function(t) {
    var tx, ty;
    tx = THREE.Curve.Utils.tangentQuadraticBezier(t, this.v0.x, this.v1.x, this.v2.x), 
    ty = THREE.Curve.Utils.tangentQuadraticBezier(t, this.v0.y, this.v1.y, this.v2.y);
    var tangent = new THREE.Vector2(tx, ty);
    return tangent.normalize(), tangent;
}, THREE.CubicBezierCurve = function(v0, v1, v2, v3) {
    this.v0 = v0, this.v1 = v1, this.v2 = v2, this.v3 = v3;
}, THREE.CubicBezierCurve.prototype = Object.create(THREE.Curve.prototype), THREE.CubicBezierCurve.prototype.getPoint = function(t) {
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
}, THREE.SplineCurve.prototype = Object.create(THREE.Curve.prototype), THREE.SplineCurve.prototype.getPoint = function(t) {
    var point, intPoint, weight, v = new THREE.Vector2(), c = [], points = this.points;
    return point = (points.length - 1) * t, intPoint = Math.floor(point), weight = point - intPoint, 
    c[0] = 0 == intPoint ? intPoint : intPoint - 1, c[1] = intPoint, c[2] = intPoint > points.length - 2 ? points.length - 1 : intPoint + 1, 
    c[3] = intPoint > points.length - 3 ? points.length - 1 : intPoint + 2, v.x = THREE.Curve.Utils.interpolate(points[c[0]].x, points[c[1]].x, points[c[2]].x, points[c[3]].x, weight), 
    v.y = THREE.Curve.Utils.interpolate(points[c[0]].y, points[c[1]].y, points[c[2]].y, points[c[3]].y, weight), 
    v;
}, THREE.EllipseCurve = function(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise) {
    this.aX = aX, this.aY = aY, this.xRadius = xRadius, this.yRadius = yRadius, this.aStartAngle = aStartAngle, 
    this.aEndAngle = aEndAngle, this.aClockwise = aClockwise;
}, THREE.EllipseCurve.prototype = Object.create(THREE.Curve.prototype), THREE.EllipseCurve.prototype.getPoint = function(t) {
    var angle, deltaAngle = this.aEndAngle - this.aStartAngle;
    0 > deltaAngle && (deltaAngle += 2 * Math.PI), deltaAngle > 2 * Math.PI && (deltaAngle -= 2 * Math.PI), 
    angle = this.aClockwise === !0 ? this.aEndAngle + (1 - t) * (2 * Math.PI - deltaAngle) : this.aStartAngle + t * deltaAngle;
    var tx = this.aX + this.xRadius * Math.cos(angle), ty = this.aY + this.yRadius * Math.sin(angle);
    return new THREE.Vector2(tx, ty);
}, THREE.ArcCurve = function(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
    THREE.EllipseCurve.call(this, aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise);
}, THREE.ArcCurve.prototype = Object.create(THREE.EllipseCurve.prototype), THREE.LineCurve3 = THREE.Curve.create(function(v1, v2) {
    this.v1 = v1, this.v2 = v2;
}, function(t) {
    var r = new THREE.Vector3();
    return r.subVectors(this.v2, this.v1), r.multiplyScalar(t), r.add(this.v1), r;
}), THREE.QuadraticBezierCurve3 = THREE.Curve.create(function(v0, v1, v2) {
    this.v0 = v0, this.v1 = v1, this.v2 = v2;
}, function(t) {
    var tx, ty, tz;
    return tx = THREE.Shape.Utils.b2(t, this.v0.x, this.v1.x, this.v2.x), ty = THREE.Shape.Utils.b2(t, this.v0.y, this.v1.y, this.v2.y), 
    tz = THREE.Shape.Utils.b2(t, this.v0.z, this.v1.z, this.v2.z), new THREE.Vector3(tx, ty, tz);
}), THREE.CubicBezierCurve3 = THREE.Curve.create(function(v0, v1, v2, v3) {
    this.v0 = v0, this.v1 = v1, this.v2 = v2, this.v3 = v3;
}, function(t) {
    var tx, ty, tz;
    return tx = THREE.Shape.Utils.b3(t, this.v0.x, this.v1.x, this.v2.x, this.v3.x), 
    ty = THREE.Shape.Utils.b3(t, this.v0.y, this.v1.y, this.v2.y, this.v3.y), tz = THREE.Shape.Utils.b3(t, this.v0.z, this.v1.z, this.v2.z, this.v3.z), 
    new THREE.Vector3(tx, ty, tz);
}), THREE.SplineCurve3 = THREE.Curve.create(function(points) {
    this.points = void 0 == points ? [] : points;
}, function(t) {
    var point, intPoint, weight, v = new THREE.Vector3(), c = [], points = this.points;
    point = (points.length - 1) * t, intPoint = Math.floor(point), weight = point - intPoint, 
    c[0] = 0 == intPoint ? intPoint : intPoint - 1, c[1] = intPoint, c[2] = intPoint > points.length - 2 ? points.length - 1 : intPoint + 1, 
    c[3] = intPoint > points.length - 3 ? points.length - 1 : intPoint + 2;
    var pt0 = points[c[0]], pt1 = points[c[1]], pt2 = points[c[2]], pt3 = points[c[3]];
    return v.x = THREE.Curve.Utils.interpolate(pt0.x, pt1.x, pt2.x, pt3.x, weight), 
    v.y = THREE.Curve.Utils.interpolate(pt0.y, pt1.y, pt2.y, pt3.y, weight), v.z = THREE.Curve.Utils.interpolate(pt0.z, pt1.z, pt2.z, pt3.z, weight), 
    v;
}), THREE.ClosedSplineCurve3 = THREE.Curve.create(function(points) {
    this.points = void 0 == points ? [] : points;
}, function(t) {
    var point, intPoint, weight, v = new THREE.Vector3(), c = [], points = this.points;
    return point = (points.length - 0) * t, intPoint = Math.floor(point), weight = point - intPoint, 
    intPoint += intPoint > 0 ? 0 : (Math.floor(Math.abs(intPoint) / points.length) + 1) * points.length, 
    c[0] = (intPoint - 1) % points.length, c[1] = intPoint % points.length, c[2] = (intPoint + 1) % points.length, 
    c[3] = (intPoint + 2) % points.length, v.x = THREE.Curve.Utils.interpolate(points[c[0]].x, points[c[1]].x, points[c[2]].x, points[c[3]].x, weight), 
    v.y = THREE.Curve.Utils.interpolate(points[c[0]].y, points[c[1]].y, points[c[2]].y, points[c[3]].y, weight), 
    v.z = THREE.Curve.Utils.interpolate(points[c[0]].z, points[c[1]].z, points[c[2]].z, points[c[3]].z, weight), 
    v;
}), THREE.AnimationHandler = {
    LINEAR: 0,
    CATMULLROM: 1,
    CATMULLROM_FORWARD: 2,
    add: function() {
        console.warn("THREE.AnimationHandler.add() has been deprecated.");
    },
    get: function() {
        console.warn("THREE.AnimationHandler.get() has been deprecated.");
    },
    remove: function() {
        console.warn("THREE.AnimationHandler.remove() has been deprecated.");
    },
    animations: [],
    init: function(data) {
        if (data.initialized !== !0) {
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
        }
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
        for (var i = 0; i < this.animations.length; i++) this.animations[i].update(deltaTimeMS);
    }
}, THREE.Animation = function(root, data) {
    this.root = root, this.data = THREE.AnimationHandler.init(data), this.hierarchy = THREE.AnimationHandler.parse(root), 
    this.currentTime = 0, this.timeScale = 1, this.isPlaying = !1, this.loop = !0, this.weight = 0, 
    this.interpolationType = THREE.AnimationHandler.LINEAR;
}, THREE.Animation.prototype.keyTypes = [ "pos", "rot", "scl" ], THREE.Animation.prototype.play = function(startTime, weight) {
    this.currentTime = void 0 !== startTime ? startTime : 0, this.weight = void 0 !== weight ? weight : 1, 
    this.isPlaying = !0, this.reset(), THREE.AnimationHandler.play(this);
}, THREE.Animation.prototype.stop = function() {
    this.isPlaying = !1, THREE.AnimationHandler.stop(this);
}, THREE.Animation.prototype.reset = function() {
    for (var h = 0, hl = this.hierarchy.length; hl > h; h++) {
        var object = this.hierarchy[h];
        object.matrixAutoUpdate = !0, void 0 === object.animationCache && (object.animationCache = {}), 
        void 0 === object.animationCache[this.data.name] && (object.animationCache[this.data.name] = {}, 
        object.animationCache[this.data.name].prevKey = {
            pos: 0,
            rot: 0,
            scl: 0
        }, object.animationCache[this.data.name].nextKey = {
            pos: 0,
            rot: 0,
            scl: 0
        }, object.animationCache[this.data.name].originalMatrix = object.matrix);
        for (var animationCache = object.animationCache[this.data.name], t = 0; 3 > t; t++) {
            for (var type = this.keyTypes[t], prevKey = this.data.hierarchy[h].keys[0], nextKey = this.getNextKeyWith(type, h, 1); nextKey.time < this.currentTime && nextKey.index > prevKey.index; ) prevKey = nextKey, 
            nextKey = this.getNextKeyWith(type, h, nextKey.index + 1);
            animationCache.prevKey[type] = prevKey, animationCache.nextKey[type] = nextKey;
        }
    }
}, THREE.Animation.prototype.update = function() {
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
            if (this.loop === !0 && this.currentTime > duration) this.currentTime %= duration, 
            this.reset(); else if (this.loop === !1 && this.currentTime > duration) return void this.stop();
            for (var h = 0, hl = this.hierarchy.length; hl > h; h++) for (var object = this.hierarchy[h], animationCache = object.animationCache[this.data.name], t = 0; 3 > t; t++) {
                var type = this.keyTypes[t], prevKey = animationCache.prevKey[type], nextKey = animationCache.nextKey[type];
                if (nextKey.time <= this.currentTime) {
                    for (prevKey = this.data.hierarchy[h].keys[0], nextKey = this.getNextKeyWith(type, h, 1); nextKey.time < this.currentTime && nextKey.index > prevKey.index; ) prevKey = nextKey, 
                    nextKey = this.getNextKeyWith(type, h, nextKey.index + 1);
                    animationCache.prevKey[type] = prevKey, animationCache.nextKey[type] = nextKey;
                }
                object.matrixAutoUpdate = !0, object.matrixWorldNeedsUpdate = !0;
                var scale = (this.currentTime - prevKey.time) / (nextKey.time - prevKey.time), prevXYZ = prevKey[type], nextXYZ = nextKey[type];
                if (0 > scale && (scale = 0), scale > 1 && (scale = 1), "pos" === type) {
                    if (this.interpolationType === THREE.AnimationHandler.LINEAR) if (newVector.x = prevXYZ[0] + (nextXYZ[0] - prevXYZ[0]) * scale, 
                    newVector.y = prevXYZ[1] + (nextXYZ[1] - prevXYZ[1]) * scale, newVector.z = prevXYZ[2] + (nextXYZ[2] - prevXYZ[2]) * scale, 
                    object instanceof THREE.Bone) {
                        var proportionalWeight = this.weight / (this.weight + object.accumulatedPosWeight);
                        object.position.lerp(newVector, proportionalWeight), object.accumulatedPosWeight += this.weight;
                    } else object.position.copy(newVector); else if (this.interpolationType === THREE.AnimationHandler.CATMULLROM || this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD) {
                        points[0] = this.getPrevKeyWith("pos", h, prevKey.index - 1).pos, points[1] = prevXYZ, 
                        points[2] = nextXYZ, points[3] = this.getNextKeyWith("pos", h, nextKey.index + 1).pos, 
                        scale = .33 * scale + .33;
                        var currentPoint = interpolateCatmullRom(points, scale), proportionalWeight = 1;
                        object instanceof THREE.Bone && (proportionalWeight = this.weight / (this.weight + object.accumulatedPosWeight), 
                        object.accumulatedPosWeight += this.weight);
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
                object instanceof THREE.Bone) if (0 === object.accumulatedRotWeight) object.quaternion.copy(newQuat), 
                object.accumulatedRotWeight = this.weight; else {
                    var proportionalWeight = this.weight / (this.weight + object.accumulatedRotWeight);
                    THREE.Quaternion.slerp(object.quaternion, newQuat, object.quaternion, proportionalWeight), 
                    object.accumulatedRotWeight += this.weight;
                } else object.quaternion.copy(newQuat); else if ("scl" === type) if (newVector.x = prevXYZ[0] + (nextXYZ[0] - prevXYZ[0]) * scale, 
                newVector.y = prevXYZ[1] + (nextXYZ[1] - prevXYZ[1]) * scale, newVector.z = prevXYZ[2] + (nextXYZ[2] - prevXYZ[2]) * scale, 
                object instanceof THREE.Bone) {
                    var proportionalWeight = this.weight / (this.weight + object.accumulatedSclWeight);
                    object.scale.lerp(newVector, proportionalWeight), object.accumulatedSclWeight += this.weight;
                } else object.scale.copy(newVector);
            }
            return !0;
        }
    };
}(), THREE.Animation.prototype.getNextKeyWith = function(type, h, key) {
    var keys = this.data.hierarchy[h].keys;
    for (this.interpolationType === THREE.AnimationHandler.CATMULLROM || this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ? key = key < keys.length - 1 ? key : keys.length - 1 : key %= keys.length; key < keys.length; key++) if (void 0 !== keys[key][type]) return keys[key];
    return this.data.hierarchy[h].keys[0];
}, THREE.Animation.prototype.getPrevKeyWith = function(type, h, key) {
    var keys = this.data.hierarchy[h].keys;
    for (key = this.interpolationType === THREE.AnimationHandler.CATMULLROM || this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ? key > 0 ? key : 0 : key >= 0 ? key : key + keys.length; key >= 0; key--) if (void 0 !== keys[key][type]) return keys[key];
    return this.data.hierarchy[h].keys[keys.length - 1];
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
}, THREE.KeyFrameAnimation.prototype.play = function(startTime) {
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
}, THREE.KeyFrameAnimation.prototype.stop = function() {
    this.isPlaying = !1, this.isPaused = !1, THREE.AnimationHandler.stop(this);
    for (var h = 0; h < this.data.hierarchy.length; h++) {
        var obj = this.hierarchy[h], node = this.data.hierarchy[h];
        if (void 0 !== node.animationCache) {
            var original = node.animationCache.originalMatrix;
            original.copy(obj.matrix), obj.matrix = original, delete node.animationCache;
        }
    }
}, THREE.KeyFrameAnimation.prototype.update = function(delta) {
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
}, THREE.KeyFrameAnimation.prototype.getNextKeyWith = function(sid, h, key) {
    var keys = this.data.hierarchy[h].keys;
    for (key %= keys.length; key < keys.length; key++) if (keys[key].hasTarget(sid)) return keys[key];
    return keys[0];
}, THREE.KeyFrameAnimation.prototype.getPrevKeyWith = function(sid, h, key) {
    var keys = this.data.hierarchy[h].keys;
    for (key = key >= 0 ? key : key + keys.length; key >= 0; key--) if (keys[key].hasTarget(sid)) return keys[key];
    return keys[keys.length - 1];
}, THREE.MorphAnimation = function(mesh) {
    this.mesh = mesh, this.frames = mesh.morphTargetInfluences.length, this.currentTime = 0, 
    this.duration = 1e3, this.loop = !0, this.isPlaying = !1;
}, THREE.MorphAnimation.prototype = {
    play: function() {
        this.isPlaying = !0;
    },
    pause: function() {
        this.isPlaying = !1;
    },
    update: function() {
        var lastFrame = 0, currentFrame = 0;
        return function(delta) {
            if (this.isPlaying !== !1) {
                this.currentTime += delta, this.loop === !0 && this.currentTime > this.duration && (this.currentTime %= this.duration), 
                this.currentTime = Math.min(this.currentTime, this.duration);
                var interpolation = this.duration / this.frames, frame = Math.floor(this.currentTime / interpolation);
                frame != currentFrame && (this.mesh.morphTargetInfluences[lastFrame] = 0, this.mesh.morphTargetInfluences[currentFrame] = 1, 
                this.mesh.morphTargetInfluences[frame] = 0, lastFrame = currentFrame, currentFrame = frame), 
                this.mesh.morphTargetInfluences[frame] = this.currentTime % interpolation / interpolation, 
                this.mesh.morphTargetInfluences[lastFrame] = 1 - this.mesh.morphTargetInfluences[frame];
            }
        };
    }()
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
    THREE.Geometry.call(this), this.parameters = {
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
}, THREE.BoxGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.CircleGeometry = function(radius, segments, thetaStart, thetaLength) {
    THREE.Geometry.call(this), this.parameters = {
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
}, THREE.CircleGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.CubeGeometry = function(width, height, depth, widthSegments, heightSegments, depthSegments) {
    return console.warn("THEE.CubeGeometry has been renamed to THREE.BoxGeometry."), 
    new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments);
}, THREE.CylinderGeometry = function(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded) {
    THREE.Geometry.call(this), this.parameters = {
        radiusTop: radiusTop,
        radiusBottom: radiusBottom,
        height: height,
        radialSegments: radialSegments,
        heightSegments: heightSegments,
        openEnded: openEnded
    }, radiusTop = void 0 !== radiusTop ? radiusTop : 20, radiusBottom = void 0 !== radiusBottom ? radiusBottom : 20, 
    height = void 0 !== height ? height : 100, radialSegments = radialSegments || 8, 
    heightSegments = heightSegments || 1, openEnded = void 0 !== openEnded ? openEnded : !1;
    var x, y, heightHalf = height / 2, vertices = [], uvs = [];
    for (y = 0; heightSegments >= y; y++) {
        var verticesRow = [], uvsRow = [], v = y / heightSegments, radius = v * (radiusBottom - radiusTop) + radiusTop;
        for (x = 0; radialSegments >= x; x++) {
            var u = x / radialSegments, vertex = new THREE.Vector3();
            vertex.x = radius * Math.sin(u * Math.PI * 2), vertex.y = -v * height + heightHalf, 
            vertex.z = radius * Math.cos(u * Math.PI * 2), this.vertices.push(vertex), verticesRow.push(this.vertices.length - 1), 
            uvsRow.push(new THREE.Vector2(u, 1 - v));
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
        var v1 = vertices[y][x + 1], v2 = vertices[y][x], v3 = this.vertices.length - 1, n1 = new THREE.Vector3(0, -1, 0), n2 = new THREE.Vector3(0, -1, 0), n3 = new THREE.Vector3(0, -1, 0), uv1 = uvs[y][x + 1].clone(), uv2 = uvs[y][x].clone(), uv3 = new THREE.Vector2(uv2.x, 1);
        this.faces.push(new THREE.Face3(v1, v2, v3, [ n1, n2, n3 ])), this.faceVertexUvs[0].push([ uv1, uv2, uv3 ]);
    }
    this.computeFaceNormals();
}, THREE.CylinderGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.ExtrudeGeometry = function(shapes, options) {
    return "undefined" == typeof shapes ? void (shapes = []) : (THREE.Geometry.call(this), 
    shapes = shapes instanceof Array ? shapes : [ shapes ], this.addShapeList(shapes, options), 
    void this.computeFaceNormals());
}, THREE.ExtrudeGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.ExtrudeGeometry.prototype.addShapeList = function(shapes, options) {
    for (var sl = shapes.length, s = 0; sl > s; s++) {
        var shape = shapes[s];
        this.addShape(shape, options);
    }
}, THREE.ExtrudeGeometry.prototype.addShape = function(shape, options) {
    function scalePt2(pt, vec, size) {
        return vec || console.log("die"), vec.clone().multiplyScalar(size).add(pt);
    }
    function getBevelVec(inPt, inPrev, inNext) {
        var v_trans_x, v_trans_y, EPSILON = 1e-10, sign = THREE.Math.sign, shrink_by = 1, v_prev_x = inPt.x - inPrev.x, v_prev_y = inPt.y - inPrev.y, v_next_x = inNext.x - inPt.x, v_next_y = inNext.y - inPt.y, v_prev_lensq = v_prev_x * v_prev_x + v_prev_y * v_prev_y, colinear0 = v_prev_x * v_next_y - v_prev_y * v_next_x;
        if (Math.abs(colinear0) > EPSILON) {
            var v_prev_len = Math.sqrt(v_prev_lensq), v_next_len = Math.sqrt(v_next_x * v_next_x + v_next_y * v_next_y), ptPrevShift_x = inPrev.x - v_prev_y / v_prev_len, ptPrevShift_y = inPrev.y + v_prev_x / v_prev_len, ptNextShift_x = inNext.x - v_next_y / v_next_len, ptNextShift_y = inNext.y + v_next_x / v_next_len, sf = ((ptNextShift_x - ptPrevShift_x) * v_next_y - (ptNextShift_y - ptPrevShift_y) * v_next_x) / (v_prev_x * v_next_y - v_prev_y * v_next_x);
            v_trans_x = ptPrevShift_x + v_prev_x * sf - inPt.x, v_trans_y = ptPrevShift_y + v_prev_y * sf - inPt.y;
            var v_trans_lensq = v_trans_x * v_trans_x + v_trans_y * v_trans_y;
            if (2 >= v_trans_lensq) return new THREE.Vector2(v_trans_x, v_trans_y);
            shrink_by = Math.sqrt(v_trans_lensq / 2);
        } else {
            var direction_eq = !1;
            v_prev_x > EPSILON ? v_next_x > EPSILON && (direction_eq = !0) : -EPSILON > v_prev_x ? -EPSILON > v_next_x && (direction_eq = !0) : sign(v_prev_y) == sign(v_next_y) && (direction_eq = !0), 
            direction_eq ? (v_trans_x = -v_prev_y, v_trans_y = v_prev_x, shrink_by = Math.sqrt(v_prev_lensq)) : (v_trans_x = v_prev_x, 
            v_trans_y = v_prev_y, shrink_by = Math.sqrt(v_prev_lensq / 2));
        }
        return new THREE.Vector2(v_trans_x / shrink_by, v_trans_y / shrink_by);
    }
    function buildLidFaces() {
        if (bevelEnabled) {
            var layer = 0, offset = vlen * layer;
            for (i = 0; flen > i; i++) face = faces[i], f3(face[2] + offset, face[1] + offset, face[0] + offset, !0);
            for (layer = steps + 2 * bevelSegments, offset = vlen * layer, i = 0; flen > i; i++) face = faces[i], 
            f3(face[0] + offset, face[1] + offset, face[2] + offset, !1);
        } else {
            for (i = 0; flen > i; i++) face = faces[i], f3(face[2], face[1], face[0], !0);
            for (i = 0; flen > i; i++) face = faces[i], f3(face[0] + vlen * steps, face[1] + vlen * steps, face[2] + vlen * steps, !1);
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
    function f3(a, b, c, isBottom) {
        a += shapesOffset, b += shapesOffset, c += shapesOffset, scope.faces.push(new THREE.Face3(a, b, c, null, null, material));
        var uvs = isBottom ? uvgen.generateBottomUV(scope, shape, options, a, b, c) : uvgen.generateTopUV(scope, shape, options, a, b, c);
        scope.faceVertexUvs[0].push(uvs);
    }
    function f4(a, b, c, d, wallContour, stepIndex, stepsLength, contourIndex1, contourIndex2) {
        a += shapesOffset, b += shapesOffset, c += shapesOffset, d += shapesOffset, scope.faces.push(new THREE.Face3(a, b, d, null, null, extrudeMaterial)), 
        scope.faces.push(new THREE.Face3(b, c, d, null, null, extrudeMaterial));
        var uvs = uvgen.generateSideWallUV(scope, shape, wallContour, options, a, b, c, d, stepIndex, stepsLength, contourIndex1, contourIndex2);
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
    for (var b, bs, t, z, vert, face, vlen = vertices.length, flen = faces.length, contourMovements = (contour.length, 
    180 / Math.PI, []), i = 0, il = contour.length, j = il - 1, k = i + 1; il > i; i++, 
    j++, k++) {
        j === il && (j = 0), k === il && (k = 0);
        {
            contour[i], contour[j], contour[k];
        }
        contourMovements[i] = getBevelVec(contour[i], contour[j], contour[k]);
    }
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
    generateTopUV: function(geometry, extrudedShape, extrudeOptions, indexA, indexB, indexC) {
        var ax = geometry.vertices[indexA].x, ay = geometry.vertices[indexA].y, bx = geometry.vertices[indexB].x, by = geometry.vertices[indexB].y, cx = geometry.vertices[indexC].x, cy = geometry.vertices[indexC].y;
        return [ new THREE.Vector2(ax, ay), new THREE.Vector2(bx, by), new THREE.Vector2(cx, cy) ];
    },
    generateBottomUV: function(geometry, extrudedShape, extrudeOptions, indexA, indexB, indexC) {
        return this.generateTopUV(geometry, extrudedShape, extrudeOptions, indexA, indexB, indexC);
    },
    generateSideWallUV: function(geometry, extrudedShape, wallContour, extrudeOptions, indexA, indexB, indexC, indexD) {
        var ax = geometry.vertices[indexA].x, ay = geometry.vertices[indexA].y, az = geometry.vertices[indexA].z, bx = geometry.vertices[indexB].x, by = geometry.vertices[indexB].y, bz = geometry.vertices[indexB].z, cx = geometry.vertices[indexC].x, cy = geometry.vertices[indexC].y, cz = geometry.vertices[indexC].z, dx = geometry.vertices[indexD].x, dy = geometry.vertices[indexD].y, dz = geometry.vertices[indexD].z;
        return Math.abs(ay - by) < .01 ? [ new THREE.Vector2(ax, 1 - az), new THREE.Vector2(bx, 1 - bz), new THREE.Vector2(cx, 1 - cz), new THREE.Vector2(dx, 1 - dz) ] : [ new THREE.Vector2(ay, 1 - az), new THREE.Vector2(by, 1 - bz), new THREE.Vector2(cy, 1 - cz), new THREE.Vector2(dy, 1 - dz) ];
    }
}, THREE.ExtrudeGeometry.__v1 = new THREE.Vector2(), THREE.ExtrudeGeometry.__v2 = new THREE.Vector2(), 
THREE.ExtrudeGeometry.__v3 = new THREE.Vector2(), THREE.ExtrudeGeometry.__v4 = new THREE.Vector2(), 
THREE.ExtrudeGeometry.__v5 = new THREE.Vector2(), THREE.ExtrudeGeometry.__v6 = new THREE.Vector2(), 
THREE.ShapeGeometry = function(shapes, options) {
    THREE.Geometry.call(this), shapes instanceof Array == !1 && (shapes = [ shapes ]), 
    this.addShapeList(shapes, options), this.computeFaceNormals();
}, THREE.ShapeGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.ShapeGeometry.prototype.addShapeList = function(shapes, options) {
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
    var faces = THREE.Shape.Utils.triangulateShape(vertices, holes), contour = vertices;
    for (i = 0, l = holes.length; l > i; i++) hole = holes[i], vertices = vertices.concat(hole);
    {
        var vert, face, vlen = vertices.length, flen = faces.length;
        contour.length;
    }
    for (i = 0; vlen > i; i++) vert = vertices[i], this.vertices.push(new THREE.Vector3(vert.x, vert.y, 0));
    for (i = 0; flen > i; i++) {
        face = faces[i];
        var a = face[0] + shapesOffset, b = face[1] + shapesOffset, c = face[2] + shapesOffset;
        this.faces.push(new THREE.Face3(a, b, c, null, null, material)), this.faceVertexUvs[0].push(uvgen.generateBottomUV(this, shape, options, a, b, c));
    }
}, THREE.LatheGeometry = function(points, segments, phiStart, phiLength) {
    THREE.Geometry.call(this), segments = segments || 12, phiStart = phiStart || 0, 
    phiLength = phiLength || 2 * Math.PI;
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
}, THREE.LatheGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.PlaneGeometry = function(width, height, widthSegments, heightSegments) {
    THREE.Geometry.call(this), this.parameters = {
        width: width,
        height: height,
        widthSegments: widthSegments,
        heightSegments: heightSegments
    };
    var ix, iz, width_half = width / 2, height_half = height / 2, gridX = widthSegments || 1, gridZ = heightSegments || 1, gridX1 = gridX + 1, gridZ1 = gridZ + 1, segment_width = width / gridX, segment_height = height / gridZ, normal = new THREE.Vector3(0, 0, 1);
    for (iz = 0; gridZ1 > iz; iz++) {
        var y = iz * segment_height - height_half;
        for (ix = 0; gridX1 > ix; ix++) {
            var x = ix * segment_width - width_half;
            this.vertices.push(new THREE.Vector3(x, -y, 0));
        }
    }
    for (iz = 0; gridZ > iz; iz++) for (ix = 0; gridX > ix; ix++) {
        var a = ix + gridX1 * iz, b = ix + gridX1 * (iz + 1), c = ix + 1 + gridX1 * (iz + 1), d = ix + 1 + gridX1 * iz, uva = new THREE.Vector2(ix / gridX, 1 - iz / gridZ), uvb = new THREE.Vector2(ix / gridX, 1 - (iz + 1) / gridZ), uvc = new THREE.Vector2((ix + 1) / gridX, 1 - (iz + 1) / gridZ), uvd = new THREE.Vector2((ix + 1) / gridX, 1 - iz / gridZ), face = new THREE.Face3(a, b, d);
        face.normal.copy(normal), face.vertexNormals.push(normal.clone(), normal.clone(), normal.clone()), 
        this.faces.push(face), this.faceVertexUvs[0].push([ uva, uvb, uvd ]), face = new THREE.Face3(b, c, d), 
        face.normal.copy(normal), face.vertexNormals.push(normal.clone(), normal.clone(), normal.clone()), 
        this.faces.push(face), this.faceVertexUvs[0].push([ uvb.clone(), uvc, uvd.clone() ]);
    }
}, THREE.PlaneGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.RingGeometry = function(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength) {
    THREE.Geometry.call(this), innerRadius = innerRadius || 0, outerRadius = outerRadius || 50, 
    thetaStart = void 0 !== thetaStart ? thetaStart : 0, thetaLength = void 0 !== thetaLength ? thetaLength : 2 * Math.PI, 
    thetaSegments = void 0 !== thetaSegments ? Math.max(3, thetaSegments) : 8, phiSegments = void 0 !== phiSegments ? Math.max(1, phiSegments) : 8;
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
}, THREE.RingGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.SphereGeometry = function(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
    THREE.Geometry.call(this), this.parameters = {
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
}, THREE.SphereGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.TextGeometry = function(text, parameters) {
    parameters = parameters || {};
    var textShapes = THREE.FontUtils.generateShapes(text, parameters);
    parameters.amount = void 0 !== parameters.height ? parameters.height : 50, void 0 === parameters.bevelThickness && (parameters.bevelThickness = 10), 
    void 0 === parameters.bevelSize && (parameters.bevelSize = 8), void 0 === parameters.bevelEnabled && (parameters.bevelEnabled = !1), 
    THREE.ExtrudeGeometry.call(this, textShapes, parameters);
}, THREE.TextGeometry.prototype = Object.create(THREE.ExtrudeGeometry.prototype), 
THREE.TorusGeometry = function(radius, tube, radialSegments, tubularSegments, arc) {
    THREE.Geometry.call(this), this.parameters = {
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
}, THREE.TorusGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.TorusKnotGeometry = function(radius, tube, radialSegments, tubularSegments, p, q, heightScale) {
    function getPos(u, in_q, in_p, radius, heightScale) {
        var cu = Math.cos(u), su = Math.sin(u), quOverP = in_q / in_p * u, cs = Math.cos(quOverP), tx = radius * (2 + cs) * .5 * cu, ty = radius * (2 + cs) * su * .5, tz = heightScale * radius * Math.sin(quOverP) * .5;
        return new THREE.Vector3(tx, ty, tz);
    }
    THREE.Geometry.call(this), this.parameters = {
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
THREE.TubeGeometry = function(path, segments, radius, radialSegments, closed) {
    function vert(x, y, z) {
        return scope.vertices.push(new THREE.Vector3(x, y, z)) - 1;
    }
    THREE.Geometry.call(this), this.parameters = {
        path: path,
        segments: segments,
        radius: radius,
        radialSegments: radialSegments,
        closed: closed
    }, segments = segments || 64, radius = radius || 1, radialSegments = radialSegments || 8, 
    closed = closed || !1;
    var tangent, normal, binormal, u, v, cx, cy, pos, i, j, ip, jp, a, b, c, d, uva, uvb, uvc, uvd, grid = [], scope = this, numpoints = segments + 1, pos2 = new THREE.Vector3(), frames = new THREE.TubeGeometry.FrenetFrames(path, segments, closed), tangents = frames.tangents, normals = frames.normals, binormals = frames.binormals;
    for (this.tangents = tangents, this.normals = normals, this.binormals = binormals, 
    i = 0; numpoints > i; i++) for (grid[i] = [], u = i / (numpoints - 1), pos = path.getPointAt(u), 
    tangent = tangents[i], normal = normals[i], binormal = binormals[i], j = 0; radialSegments > j; j++) v = j / radialSegments * 2 * Math.PI, 
    cx = -radius * Math.cos(v), cy = radius * Math.sin(v), pos2.copy(pos), pos2.x += cx * normal.x + cy * binormal.x, 
    pos2.y += cx * normal.y + cy * binormal.y, pos2.z += cx * normal.z + cy * binormal.z, 
    grid[i][j] = vert(pos2.x, pos2.y, pos2.z);
    for (i = 0; segments > i; i++) for (j = 0; radialSegments > j; j++) ip = closed ? (i + 1) % segments : i + 1, 
    jp = (j + 1) % radialSegments, a = grid[i][j], b = grid[ip][j], c = grid[ip][jp], 
    d = grid[i][jp], uva = new THREE.Vector2(i / segments, j / radialSegments), uvb = new THREE.Vector2((i + 1) / segments, j / radialSegments), 
    uvc = new THREE.Vector2((i + 1) / segments, (j + 1) / radialSegments), uvd = new THREE.Vector2(i / segments, (j + 1) / radialSegments), 
    this.faces.push(new THREE.Face3(a, b, d)), this.faceVertexUvs[0].push([ uva, uvb, uvd ]), 
    this.faces.push(new THREE.Face3(b, c, d)), this.faceVertexUvs[0].push([ uvb.clone(), uvc, uvd.clone() ]);
    this.computeFaceNormals(), this.computeVertexNormals();
}, THREE.TubeGeometry.prototype = Object.create(THREE.Geometry.prototype), THREE.TubeGeometry.FrenetFrames = function(path, segments, closed) {
    function initialNormal3() {
        normals[0] = new THREE.Vector3(), binormals[0] = new THREE.Vector3(), smallest = Number.MAX_VALUE, 
        tx = Math.abs(tangents[0].x), ty = Math.abs(tangents[0].y), tz = Math.abs(tangents[0].z), 
        smallest >= tx && (smallest = tx, normal.set(1, 0, 0)), smallest >= ty && (smallest = ty, 
        normal.set(0, 1, 0)), smallest >= tz && normal.set(0, 0, 1), vec.crossVectors(tangents[0], normal).normalize(), 
        normals[0].crossVectors(tangents[0], vec), binormals[0].crossVectors(tangents[0], normals[0]);
    }
    var theta, smallest, tx, ty, tz, i, u, normal = (new THREE.Vector3(), new THREE.Vector3()), tangents = (new THREE.Vector3(), 
    []), normals = [], binormals = [], vec = new THREE.Vector3(), mat = new THREE.Matrix4(), numpoints = segments + 1, epsilon = 1e-4;
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
        for (var cols = Math.pow(2, detail), a = (Math.pow(4, detail), prepare(that.vertices[face.a])), b = prepare(that.vertices[face.b]), c = prepare(that.vertices[face.c]), v = [], i = 0; cols >= i; i++) {
            v[i] = [];
            for (var aj = prepare(a.clone().lerp(c, i / cols)), bj = prepare(b.clone().lerp(c, i / cols)), rows = cols - i, j = 0; rows >= j; j++) v[i][j] = 0 == j && i == cols ? aj : prepare(aj.clone().lerp(bj, j / rows));
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
    THREE.Geometry.call(this), radius = radius || 1, detail = detail || 0;
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
THREE.IcosahedronGeometry = function(radius, detail) {
    this.parameters = {
        radius: radius,
        detail: detail
    };
    var t = (1 + Math.sqrt(5)) / 2, vertices = [ -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, 0, 0, -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, t, 0, -1, t, 0, 1, -t, 0, -1, -t, 0, 1 ], indices = [ 0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1 ];
    THREE.PolyhedronGeometry.call(this, vertices, indices, radius, detail);
}, THREE.IcosahedronGeometry.prototype = Object.create(THREE.Geometry.prototype), 
THREE.OctahedronGeometry = function(radius, detail) {
    this.parameters = {
        radius: radius,
        detail: detail
    };
    var vertices = [ 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1 ], indices = [ 0, 2, 4, 0, 4, 3, 0, 3, 5, 0, 5, 2, 1, 2, 5, 1, 5, 3, 1, 3, 4, 1, 4, 2 ];
    THREE.PolyhedronGeometry.call(this, vertices, indices, radius, detail);
}, THREE.OctahedronGeometry.prototype = Object.create(THREE.Geometry.prototype), 
THREE.TetrahedronGeometry = function(radius, detail) {
    var vertices = [ 1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1 ], indices = [ 2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1 ];
    THREE.PolyhedronGeometry.call(this, vertices, indices, radius, detail);
}, THREE.TetrahedronGeometry.prototype = Object.create(THREE.Geometry.prototype), 
THREE.ParametricGeometry = function(func, slices, stacks) {
    THREE.Geometry.call(this);
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
THREE.AxisHelper = function(size) {
    size = size || 1;
    var vertices = new Float32Array([ 0, 0, 0, size, 0, 0, 0, 0, 0, 0, size, 0, 0, 0, 0, 0, 0, size ]), colors = new Float32Array([ 1, 0, 0, 1, .6, 0, 0, 1, 0, .6, 1, 0, 0, 0, 1, 0, .6, 1 ]), geometry = new THREE.BufferGeometry();
    geometry.addAttribute("position", new THREE.BufferAttribute(vertices, 3)), geometry.addAttribute("color", new THREE.BufferAttribute(colors, 3));
    var material = new THREE.LineBasicMaterial({
        vertexColors: THREE.VertexColors
    });
    THREE.Line.call(this, geometry, material, THREE.LinePieces);
}, THREE.AxisHelper.prototype = Object.create(THREE.Line.prototype), THREE.ArrowHelper = function() {
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
}(), THREE.ArrowHelper.prototype = Object.create(THREE.Object3D.prototype), THREE.ArrowHelper.prototype.setDirection = function() {
    var radians, axis = new THREE.Vector3();
    return function(dir) {
        dir.y > .99999 ? this.quaternion.set(0, 0, 0, 1) : dir.y < -.99999 ? this.quaternion.set(1, 0, 0, 0) : (axis.set(dir.z, 0, -dir.x).normalize(), 
        radians = Math.acos(dir.y), this.quaternion.setFromAxisAngle(axis, radians));
    };
}(), THREE.ArrowHelper.prototype.setLength = function(length, headLength, headWidth) {
    void 0 === headLength && (headLength = .2 * length), void 0 === headWidth && (headWidth = .2 * headLength), 
    this.line.scale.set(1, length, 1), this.line.updateMatrix(), this.cone.scale.set(headWidth, headLength, headWidth), 
    this.cone.position.y = length, this.cone.updateMatrix();
}, THREE.ArrowHelper.prototype.setColor = function(color) {
    this.line.material.color.set(color), this.cone.material.color.set(color);
}, THREE.BoxHelper = function(object) {
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute("position", new THREE.BufferAttribute(new Float32Array(72), 3)), 
    THREE.Line.call(this, geometry, new THREE.LineBasicMaterial({
        color: 16776960
    }), THREE.LinePieces), void 0 !== object && this.update(object);
}, THREE.BoxHelper.prototype = Object.create(THREE.Line.prototype), THREE.BoxHelper.prototype.update = function(object) {
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
    this.matrixAutoUpdate = !1, this.matrixWorld = object.matrixWorld;
}, THREE.BoundingBoxHelper = function(object, hex) {
    var color = void 0 !== hex ? hex : 8947848;
    this.object = object, this.box = new THREE.Box3(), THREE.Mesh.call(this, new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({
        color: color,
        wireframe: !0
    }));
}, THREE.BoundingBoxHelper.prototype = Object.create(THREE.Mesh.prototype), THREE.BoundingBoxHelper.prototype.update = function() {
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
    this.camera = camera, this.matrixWorld = camera.matrixWorld, this.matrixAutoUpdate = !1, 
    this.pointMap = pointMap, this.update();
}, THREE.CameraHelper.prototype = Object.create(THREE.Line.prototype), THREE.CameraHelper.prototype.update = function() {
    var vector = new THREE.Vector3(), camera = new THREE.Camera(), projector = new THREE.Projector();
    return function() {
        function setPoint(point, x, y, z) {
            vector.set(x, y, z), projector.unprojectVector(vector, camera);
            var points = scope.pointMap[point];
            if (void 0 !== points) for (var i = 0, il = points.length; il > i; i++) scope.geometry.vertices[points[i]].copy(vector);
        }
        var scope = this, w = 1, h = 1;
        camera.projectionMatrix.copy(this.camera.projectionMatrix), setPoint("c", 0, 0, -1), 
        setPoint("t", 0, 0, 1), setPoint("n1", -w, -h, -1), setPoint("n2", w, -h, -1), setPoint("n3", -w, h, -1), 
        setPoint("n4", w, h, -1), setPoint("f1", -w, -h, 1), setPoint("f2", w, -h, 1), setPoint("f3", -w, h, 1), 
        setPoint("f4", w, h, 1), setPoint("u1", .7 * w, 1.1 * h, -1), setPoint("u2", .7 * -w, 1.1 * h, -1), 
        setPoint("u3", 0, 2 * h, -1), setPoint("cf1", -w, 0, 1), setPoint("cf2", w, 0, 1), 
        setPoint("cf3", 0, -h, 1), setPoint("cf4", 0, h, 1), setPoint("cn1", -w, 0, -1), 
        setPoint("cn2", w, 0, -1), setPoint("cn3", 0, -h, -1), setPoint("cn4", 0, h, -1), 
        this.geometry.verticesNeedUpdate = !0;
    };
}(), THREE.DirectionalLightHelper = function(light, size) {
    THREE.Object3D.call(this), this.light = light, this.light.updateMatrixWorld(), this.matrixWorld = light.matrixWorld, 
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
}(), THREE.EdgesHelper = function(object, hex) {
    var color = void 0 !== hex ? hex : 16777215, edge = [ 0, 0 ], hash = {}, sortFunction = function(a, b) {
        return a - b;
    }, keys = [ "a", "b", "c" ], geometry = new THREE.BufferGeometry(), geometry2 = object.geometry.clone();
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
    geometry.addAttribute("position", new THREE.Float32Attribute(2 * numEdges * 3, 3));
    var coords = geometry.attributes.position.array, index = 0;
    for (var key in hash) {
        var h = hash[key];
        if (void 0 === h.face2 || faces[h.face1].normal.dot(faces[h.face2].normal) < .9999) {
            var vertex = vertices[h.vert1];
            coords[index++] = vertex.x, coords[index++] = vertex.y, coords[index++] = vertex.z, 
            vertex = vertices[h.vert2], coords[index++] = vertex.x, coords[index++] = vertex.y, 
            coords[index++] = vertex.z;
        }
    }
    THREE.Line.call(this, geometry, new THREE.LineBasicMaterial({
        color: color
    }), THREE.LinePieces), this.matrixAutoUpdate = !1, this.matrixWorld = object.matrixWorld;
}, THREE.EdgesHelper.prototype = Object.create(THREE.Line.prototype), THREE.FaceNormalsHelper = function(object, size, hex, linewidth) {
    this.object = object, this.size = void 0 !== size ? size : 1;
    for (var color = void 0 !== hex ? hex : 16776960, width = void 0 !== linewidth ? linewidth : 1, geometry = new THREE.Geometry(), faces = this.object.geometry.faces, i = 0, l = faces.length; l > i; i++) geometry.vertices.push(new THREE.Vector3(), new THREE.Vector3());
    THREE.Line.call(this, geometry, new THREE.LineBasicMaterial({
        color: color,
        linewidth: width
    }), THREE.LinePieces), this.matrixAutoUpdate = !1, this.normalMatrix = new THREE.Matrix3(), 
    this.update();
}, THREE.FaceNormalsHelper.prototype = Object.create(THREE.Line.prototype), THREE.FaceNormalsHelper.prototype.update = function() {
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
}, THREE.GridHelper.prototype = Object.create(THREE.Line.prototype), THREE.GridHelper.prototype.setColors = function(colorCenterLine, colorGrid) {
    this.color1.set(colorCenterLine), this.color2.set(colorGrid), this.geometry.colorsNeedUpdate = !0;
}, THREE.HemisphereLightHelper = function(light, sphereSize) {
    THREE.Object3D.call(this), this.light = light, this.light.updateMatrixWorld(), this.matrixWorld = light.matrixWorld, 
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
    this.matrixWorld = this.light.matrixWorld, this.matrixAutoUpdate = !1;
}, THREE.PointLightHelper.prototype = Object.create(THREE.Mesh.prototype), THREE.PointLightHelper.prototype.dispose = function() {
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
    this.matrixWorld = object.matrixWorld, this.matrixAutoUpdate = !1, this.update();
}, THREE.SkeletonHelper.prototype = Object.create(THREE.Line.prototype), THREE.SkeletonHelper.prototype.getBoneList = function(object) {
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
    THREE.Object3D.call(this), this.light = light, this.light.updateMatrixWorld(), this.matrixWorld = light.matrixWorld, 
    this.matrixAutoUpdate = !1;
    var geometry = new THREE.CylinderGeometry(0, 1, 1, 8, 1, !0);
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -.5, 0)), geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    var material = new THREE.MeshBasicMaterial({
        wireframe: !0,
        fog: !1
    });
    this.cone = new THREE.Mesh(geometry, material), this.add(this.cone), this.update();
}, THREE.SpotLightHelper.prototype = Object.create(THREE.Object3D.prototype), THREE.SpotLightHelper.prototype.dispose = function() {
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
    for (var color = void 0 !== hex ? hex : 16711680, width = void 0 !== linewidth ? linewidth : 1, geometry = new THREE.Geometry(), faces = (object.geometry.vertices, 
    object.geometry.faces), i = 0, l = faces.length; l > i; i++) for (var face = faces[i], j = 0, jl = face.vertexNormals.length; jl > j; j++) geometry.vertices.push(new THREE.Vector3(), new THREE.Vector3());
    THREE.Line.call(this, geometry, new THREE.LineBasicMaterial({
        color: color,
        linewidth: width
    }), THREE.LinePieces), this.matrixAutoUpdate = !1, this.normalMatrix = new THREE.Matrix3(), 
    this.update();
}, THREE.VertexNormalsHelper.prototype = Object.create(THREE.Line.prototype), THREE.VertexNormalsHelper.prototype.update = function() {
    var v1 = new THREE.Vector3();
    return function() {
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
    for (var color = void 0 !== hex ? hex : 255, width = void 0 !== linewidth ? linewidth : 1, geometry = new THREE.Geometry(), faces = (object.geometry.vertices, 
    object.geometry.faces), i = 0, l = faces.length; l > i; i++) for (var face = faces[i], j = 0, jl = face.vertexTangents.length; jl > j; j++) geometry.vertices.push(new THREE.Vector3()), 
    geometry.vertices.push(new THREE.Vector3());
    THREE.Line.call(this, geometry, new THREE.LineBasicMaterial({
        color: color,
        linewidth: width
    }), THREE.LinePieces), this.matrixAutoUpdate = !1, this.update();
}, THREE.VertexTangentsHelper.prototype = Object.create(THREE.Line.prototype), THREE.VertexTangentsHelper.prototype.update = function() {
    var v1 = new THREE.Vector3();
    return function() {
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
        for (var vertices = object.geometry.attributes.position.array, indices = object.geometry.attributes.index.array, offsets = object.geometry.offsets, numEdges = 0, edges = new Uint32Array(2 * indices.length), o = 0, ol = offsets.length; ol > o; ++o) for (var start = offsets[o].start, count = offsets[o].count, index = offsets[o].index, i = start, il = start + count; il > i; i += 3) for (var j = 0; 3 > j; j++) {
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
    }), THREE.LinePieces), this.matrixAutoUpdate = !1, this.matrixWorld = object.matrixWorld;
}, THREE.WireframeHelper.prototype = Object.create(THREE.Line.prototype), THREE.ImmediateRenderObject = function() {
    THREE.Object3D.call(this), this.render = function() {};
}, THREE.ImmediateRenderObject.prototype = Object.create(THREE.Object3D.prototype), 
THREE.LensFlare = function(texture, size, distance, blending, color) {
    THREE.Object3D.call(this), this.lensFlares = [], this.positionScreen = new THREE.Vector3(), 
    this.customUpdateCallback = void 0, void 0 !== texture && this.add(texture, size, distance, blending, color);
}, THREE.LensFlare.prototype = Object.create(THREE.Object3D.prototype), THREE.LensFlare.prototype.add = function(texture, size, distance, blending, color, opacity) {
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
}, THREE.MorphBlendMesh = function(geometry, material) {
    THREE.Mesh.call(this, geometry, material), this.animationsMap = {}, this.animationsList = [];
    var numFrames = this.geometry.morphTargets.length, name = "__default", startFrame = 0, endFrame = numFrames - 1, fps = numFrames / 1;
    this.createAnimation(name, startFrame, endFrame, fps), this.setAnimationWeight(name, 1);
}, THREE.MorphBlendMesh.prototype = Object.create(THREE.Mesh.prototype), THREE.MorphBlendMesh.prototype.createAnimation = function(name, start, end, fps) {
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
            {
                var name = chunks[1];
                chunks[2];
            }
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
    animation ? (animation.time = 0, animation.active = !0) : console.warn("animation[" + name + "] undefined");
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
}, THREE.LensFlarePlugin = function() {
    function createProgram(shader, precision) {
        var program = _gl.createProgram(), fragmentShader = _gl.createShader(_gl.FRAGMENT_SHADER), vertexShader = _gl.createShader(_gl.VERTEX_SHADER), prefix = "precision " + precision + " float;\n";
        return _gl.shaderSource(fragmentShader, prefix + shader.fragmentShader), _gl.shaderSource(vertexShader, prefix + shader.vertexShader), 
        _gl.compileShader(fragmentShader), _gl.compileShader(vertexShader), _gl.attachShader(program, fragmentShader), 
        _gl.attachShader(program, vertexShader), _gl.linkProgram(program), program;
    }
    var _gl, _renderer, _precision, flares = [], _lensFlare = {};
    this.init = function(renderer) {
        _gl = renderer.context, _renderer = renderer, _precision = renderer.getPrecision(), 
        _lensFlare.vertices = new Float32Array(16), _lensFlare.faces = new Uint16Array(6);
        var i = 0;
        _lensFlare.vertices[i++] = -1, _lensFlare.vertices[i++] = -1, _lensFlare.vertices[i++] = 0, 
        _lensFlare.vertices[i++] = 0, _lensFlare.vertices[i++] = 1, _lensFlare.vertices[i++] = -1, 
        _lensFlare.vertices[i++] = 1, _lensFlare.vertices[i++] = 0, _lensFlare.vertices[i++] = 1, 
        _lensFlare.vertices[i++] = 1, _lensFlare.vertices[i++] = 1, _lensFlare.vertices[i++] = 1, 
        _lensFlare.vertices[i++] = -1, _lensFlare.vertices[i++] = 1, _lensFlare.vertices[i++] = 0, 
        _lensFlare.vertices[i++] = 1, i = 0, _lensFlare.faces[i++] = 0, _lensFlare.faces[i++] = 1, 
        _lensFlare.faces[i++] = 2, _lensFlare.faces[i++] = 0, _lensFlare.faces[i++] = 2, 
        _lensFlare.faces[i++] = 3, _lensFlare.vertexBuffer = _gl.createBuffer(), _lensFlare.elementBuffer = _gl.createBuffer(), 
        _gl.bindBuffer(_gl.ARRAY_BUFFER, _lensFlare.vertexBuffer), _gl.bufferData(_gl.ARRAY_BUFFER, _lensFlare.vertices, _gl.STATIC_DRAW), 
        _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, _lensFlare.elementBuffer), _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, _lensFlare.faces, _gl.STATIC_DRAW), 
        _lensFlare.tempTexture = _gl.createTexture(), _lensFlare.occlusionTexture = _gl.createTexture(), 
        _gl.bindTexture(_gl.TEXTURE_2D, _lensFlare.tempTexture), _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGB, 16, 16, 0, _gl.RGB, _gl.UNSIGNED_BYTE, null), 
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE), _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE), 
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.NEAREST), _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.NEAREST), 
        _gl.bindTexture(_gl.TEXTURE_2D, _lensFlare.occlusionTexture), _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, 16, 16, 0, _gl.RGBA, _gl.UNSIGNED_BYTE, null), 
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE), _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE), 
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.NEAREST), _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.NEAREST), 
        _gl.getParameter(_gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) <= 0 ? (_lensFlare.hasVertexTexture = !1, 
        _lensFlare.program = createProgram(THREE.ShaderFlares.lensFlare, _precision)) : (_lensFlare.hasVertexTexture = !0, 
        _lensFlare.program = createProgram(THREE.ShaderFlares.lensFlareVertexTexture, _precision)), 
        _lensFlare.attributes = {}, _lensFlare.uniforms = {}, _lensFlare.attributes.vertex = _gl.getAttribLocation(_lensFlare.program, "position"), 
        _lensFlare.attributes.uv = _gl.getAttribLocation(_lensFlare.program, "uv"), _lensFlare.uniforms.renderType = _gl.getUniformLocation(_lensFlare.program, "renderType"), 
        _lensFlare.uniforms.map = _gl.getUniformLocation(_lensFlare.program, "map"), _lensFlare.uniforms.occlusionMap = _gl.getUniformLocation(_lensFlare.program, "occlusionMap"), 
        _lensFlare.uniforms.opacity = _gl.getUniformLocation(_lensFlare.program, "opacity"), 
        _lensFlare.uniforms.color = _gl.getUniformLocation(_lensFlare.program, "color"), 
        _lensFlare.uniforms.scale = _gl.getUniformLocation(_lensFlare.program, "scale"), 
        _lensFlare.uniforms.rotation = _gl.getUniformLocation(_lensFlare.program, "rotation"), 
        _lensFlare.uniforms.screenPosition = _gl.getUniformLocation(_lensFlare.program, "screenPosition");
    }, this.render = function(scene, camera, viewportWidth, viewportHeight) {
        if (flares.length = 0, scene.traverseVisible(function(child) {
            child instanceof THREE.LensFlare && flares.push(child);
        }), 0 !== flares.length) {
            var tempPosition = new THREE.Vector3(), invAspect = viewportHeight / viewportWidth, halfViewportWidth = .5 * viewportWidth, halfViewportHeight = .5 * viewportHeight, size = 16 / viewportHeight, scale = new THREE.Vector2(size * invAspect, size), screenPosition = new THREE.Vector3(1, 1, 0), screenPositionPixels = new THREE.Vector2(1, 1), uniforms = _lensFlare.uniforms, attributes = _lensFlare.attributes;
            _gl.useProgram(_lensFlare.program), _gl.enableVertexAttribArray(_lensFlare.attributes.vertex), 
            _gl.enableVertexAttribArray(_lensFlare.attributes.uv), _gl.uniform1i(uniforms.occlusionMap, 0), 
            _gl.uniform1i(uniforms.map, 1), _gl.bindBuffer(_gl.ARRAY_BUFFER, _lensFlare.vertexBuffer), 
            _gl.vertexAttribPointer(attributes.vertex, 2, _gl.FLOAT, !1, 16, 0), _gl.vertexAttribPointer(attributes.uv, 2, _gl.FLOAT, !1, 16, 8), 
            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, _lensFlare.elementBuffer), _gl.disable(_gl.CULL_FACE), 
            _gl.depthMask(!1);
            for (var i = 0, l = flares.length; l > i; i++) {
                size = 16 / viewportHeight, scale.set(size * invAspect, size);
                var flare = flares[i];
                if (tempPosition.set(flare.matrixWorld.elements[12], flare.matrixWorld.elements[13], flare.matrixWorld.elements[14]), 
                tempPosition.applyMatrix4(camera.matrixWorldInverse), tempPosition.applyProjection(camera.projectionMatrix), 
                screenPosition.copy(tempPosition), screenPositionPixels.x = screenPosition.x * halfViewportWidth + halfViewportWidth, 
                screenPositionPixels.y = screenPosition.y * halfViewportHeight + halfViewportHeight, 
                _lensFlare.hasVertexTexture || screenPositionPixels.x > 0 && screenPositionPixels.x < viewportWidth && screenPositionPixels.y > 0 && screenPositionPixels.y < viewportHeight) {
                    _gl.activeTexture(_gl.TEXTURE1), _gl.bindTexture(_gl.TEXTURE_2D, _lensFlare.tempTexture), 
                    _gl.copyTexImage2D(_gl.TEXTURE_2D, 0, _gl.RGB, screenPositionPixels.x - 8, screenPositionPixels.y - 8, 16, 16, 0), 
                    _gl.uniform1i(uniforms.renderType, 0), _gl.uniform2f(uniforms.scale, scale.x, scale.y), 
                    _gl.uniform3f(uniforms.screenPosition, screenPosition.x, screenPosition.y, screenPosition.z), 
                    _gl.disable(_gl.BLEND), _gl.enable(_gl.DEPTH_TEST), _gl.drawElements(_gl.TRIANGLES, 6, _gl.UNSIGNED_SHORT, 0), 
                    _gl.activeTexture(_gl.TEXTURE0), _gl.bindTexture(_gl.TEXTURE_2D, _lensFlare.occlusionTexture), 
                    _gl.copyTexImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, screenPositionPixels.x - 8, screenPositionPixels.y - 8, 16, 16, 0), 
                    _gl.uniform1i(uniforms.renderType, 1), _gl.disable(_gl.DEPTH_TEST), _gl.activeTexture(_gl.TEXTURE1), 
                    _gl.bindTexture(_gl.TEXTURE_2D, _lensFlare.tempTexture), _gl.drawElements(_gl.TRIANGLES, 6, _gl.UNSIGNED_SHORT, 0), 
                    flare.positionScreen.copy(screenPosition), flare.customUpdateCallback ? flare.customUpdateCallback(flare) : flare.updateLensFlares(), 
                    _gl.uniform1i(uniforms.renderType, 2), _gl.enable(_gl.BLEND);
                    for (var j = 0, jl = flare.lensFlares.length; jl > j; j++) {
                        var sprite = flare.lensFlares[j];
                        sprite.opacity > .001 && sprite.scale > .001 && (screenPosition.x = sprite.x, screenPosition.y = sprite.y, 
                        screenPosition.z = sprite.z, size = sprite.size * sprite.scale / viewportHeight, 
                        scale.x = size * invAspect, scale.y = size, _gl.uniform3f(uniforms.screenPosition, screenPosition.x, screenPosition.y, screenPosition.z), 
                        _gl.uniform2f(uniforms.scale, scale.x, scale.y), _gl.uniform1f(uniforms.rotation, sprite.rotation), 
                        _gl.uniform1f(uniforms.opacity, sprite.opacity), _gl.uniform3f(uniforms.color, sprite.color.r, sprite.color.g, sprite.color.b), 
                        _renderer.setBlending(sprite.blending, sprite.blendEquation, sprite.blendSrc, sprite.blendDst), 
                        _renderer.setTexture(sprite.texture, 1), _gl.drawElements(_gl.TRIANGLES, 6, _gl.UNSIGNED_SHORT, 0));
                    }
                }
            }
            _gl.enable(_gl.CULL_FACE), _gl.enable(_gl.DEPTH_TEST), _gl.depthMask(!0);
        }
    };
}, THREE.ShadowMapPlugin = function() {
    function projectObject(scene, object, shadowCamera) {
        if (object.visible) {
            var webglObjects = scene.__webglObjects[object.id];
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
            p.copy(pointsFrustum[i]), THREE.ShadowMapPlugin.__projector.unprojectVector(p, camera), 
            p.applyMatrix4(shadowCamera.matrixWorldInverse), p.x < _min.x && (_min.x = p.x), 
            p.x > _max.x && (_max.x = p.x), p.y < _min.y && (_min.y = p.y), p.y > _max.y && (_max.y = p.y), 
            p.z < _min.z && (_min.z = p.z), p.z > _max.z && (_max.z = p.z);
        }
        shadowCamera.left = _min.x, shadowCamera.right = _max.x, shadowCamera.top = _max.y, 
        shadowCamera.bottom = _min.y, shadowCamera.updateProjectionMatrix();
    }
    function getObjectMaterial(object) {
        return object.material instanceof THREE.MeshFaceMaterial ? object.material.materials[0] : object.material;
    }
    var _gl, _renderer, _depthMaterial, _depthMaterialMorph, _depthMaterialSkin, _depthMaterialMorphSkin, _frustum = new THREE.Frustum(), _projScreenMatrix = new THREE.Matrix4(), _min = new THREE.Vector3(), _max = new THREE.Vector3(), _matrixPosition = new THREE.Vector3(), _renderList = [];
    this.init = function(renderer) {
        _gl = renderer.context, _renderer = renderer;
        var depthShader = THREE.ShaderLib.depthRGBA, depthUniforms = THREE.UniformsUtils.clone(depthShader.uniforms);
        _depthMaterial = new THREE.ShaderMaterial({
            fragmentShader: depthShader.fragmentShader,
            vertexShader: depthShader.vertexShader,
            uniforms: depthUniforms
        }), _depthMaterialMorph = new THREE.ShaderMaterial({
            fragmentShader: depthShader.fragmentShader,
            vertexShader: depthShader.vertexShader,
            uniforms: depthUniforms,
            morphTargets: !0
        }), _depthMaterialSkin = new THREE.ShaderMaterial({
            fragmentShader: depthShader.fragmentShader,
            vertexShader: depthShader.vertexShader,
            uniforms: depthUniforms,
            skinning: !0
        }), _depthMaterialMorphSkin = new THREE.ShaderMaterial({
            fragmentShader: depthShader.fragmentShader,
            vertexShader: depthShader.vertexShader,
            uniforms: depthUniforms,
            morphTargets: !0,
            skinning: !0
        }), _depthMaterial._shadowPass = !0, _depthMaterialMorph._shadowPass = !0, _depthMaterialSkin._shadowPass = !0, 
        _depthMaterialMorphSkin._shadowPass = !0;
    }, this.render = function(scene, camera) {
        _renderer.shadowMapEnabled && _renderer.shadowMapAutoUpdate && this.update(scene, camera);
    }, this.update = function(scene, camera) {
        var i, il, j, jl, n, shadowMap, shadowMatrix, shadowCamera, buffer, material, webglObject, object, light, lights = [], k = 0, fog = null;
        for (_gl.clearColor(1, 1, 1, 1), _gl.disable(_gl.BLEND), _gl.enable(_gl.CULL_FACE), 
        _gl.frontFace(_gl.CCW), _gl.cullFace(_renderer.shadowMapCullFace === THREE.CullFaceFront ? _gl.FRONT : _gl.BACK), 
        _renderer.setDepthTest(!0), i = 0, il = scene.__lights.length; il > i; i++) if (light = scene.__lights[i], 
        light.castShadow) if (light instanceof THREE.DirectionalLight && light.shadowCascade) for (n = 0; n < light.shadowCascadeCount; n++) {
            var virtualLight;
            if (light.shadowCascadeArray[n]) virtualLight = light.shadowCascadeArray[n]; else {
                virtualLight = createVirtualLight(light, n), virtualLight.originalCamera = camera;
                var gyro = new THREE.Gyroscope();
                gyro.position.copy(light.shadowCascadeOffset), gyro.add(virtualLight), gyro.add(virtualLight.target), 
                camera.add(gyro), light.shadowCascadeArray[n] = virtualLight, console.log("Created virtualLight", virtualLight);
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
                        console.error("Unsupported light type for shadow");
                        continue;
                    }
                    light.shadowCamera = new THREE.OrthographicCamera(light.shadowCameraLeft, light.shadowCameraRight, light.shadowCameraTop, light.shadowCameraBottom, light.shadowCameraNear, light.shadowCameraFar);
                }
                scene.add(light.shadowCamera), scene.autoUpdate === !0 && scene.updateMatrixWorld();
            }
            light.shadowCameraVisible && !light.cameraHelper && (light.cameraHelper = new THREE.CameraHelper(light.shadowCamera), 
            light.shadowCamera.add(light.cameraHelper)), light.isVirtual && virtualLight.originalCamera == camera && updateShadowCamera(camera, light), 
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
            _renderer.setMaterialFaces(objectMaterial), buffer instanceof THREE.BufferGeometry ? _renderer.renderBufferDirect(shadowCamera, scene.__lights, fog, material, buffer, object) : _renderer.renderBuffer(shadowCamera, scene.__lights, fog, material, buffer, object);
            var renderList = scene.__webglObjectsImmediate;
            for (j = 0, jl = renderList.length; jl > j; j++) webglObject = renderList[j], object = webglObject.object, 
            object.visible && object.castShadow && (object._modelViewMatrix.multiplyMatrices(shadowCamera.matrixWorldInverse, object.matrixWorld), 
            _renderer.renderImmediateObject(shadowCamera, scene.__lights, fog, _depthMaterial, object));
        }
        var clearColor = _renderer.getClearColor(), clearAlpha = _renderer.getClearAlpha();
        _gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearAlpha), _gl.enable(_gl.BLEND), 
        _renderer.shadowMapCullFace === THREE.CullFaceFront && _gl.cullFace(_gl.BACK);
    };
}, THREE.ShadowMapPlugin.__projector = new THREE.Projector(), THREE.SpritePlugin = function() {
    function createProgram() {
        var program = _gl.createProgram(), vertexShader = _gl.createShader(_gl.VERTEX_SHADER), fragmentShader = _gl.createShader(_gl.FRAGMENT_SHADER);
        return _gl.shaderSource(vertexShader, [ "precision " + _renderer.getPrecision() + " float;", "uniform mat4 modelViewMatrix;", "uniform mat4 projectionMatrix;", "uniform float rotation;", "uniform vec2 scale;", "uniform vec2 uvOffset;", "uniform vec2 uvScale;", "attribute vec2 position;", "attribute vec2 uv;", "varying vec2 vUV;", "void main() {", "vUV = uvOffset + uv * uvScale;", "vec2 alignedPosition = position * scale;", "vec2 rotatedPosition;", "rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;", "rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;", "vec4 finalPosition;", "finalPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );", "finalPosition.xy += rotatedPosition;", "finalPosition = projectionMatrix * finalPosition;", "gl_Position = finalPosition;", "}" ].join("\n")), 
        _gl.shaderSource(fragmentShader, [ "precision " + _renderer.getPrecision() + " float;", "uniform vec3 color;", "uniform sampler2D map;", "uniform float opacity;", "uniform int fogType;", "uniform vec3 fogColor;", "uniform float fogDensity;", "uniform float fogNear;", "uniform float fogFar;", "uniform float alphaTest;", "varying vec2 vUV;", "void main() {", "vec4 texture = texture2D( map, vUV );", "if ( texture.a < alphaTest ) discard;", "gl_FragColor = vec4( color * texture.xyz, texture.a * opacity );", "if ( fogType > 0 ) {", "float depth = gl_FragCoord.z / gl_FragCoord.w;", "float fogFactor = 0.0;", "if ( fogType == 1 ) {", "fogFactor = smoothstep( fogNear, fogFar, depth );", "} else {", "const float LOG2 = 1.442695;", "float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );", "fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );", "}", "gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );", "}", "}" ].join("\n")), 
        _gl.compileShader(vertexShader), _gl.compileShader(fragmentShader), _gl.attachShader(program, vertexShader), 
        _gl.attachShader(program, fragmentShader), _gl.linkProgram(program), program;
    }
    function painterSortStable(a, b) {
        return a.z !== b.z ? b.z - a.z : b.id - a.id;
    }
    var _gl, _renderer, _texture, vertices, faces, vertexBuffer, elementBuffer, program, attributes, uniforms, sprites = [];
    this.init = function(renderer) {
        _gl = renderer.context, _renderer = renderer, vertices = new Float32Array([ -.5, -.5, 0, 0, .5, -.5, 1, 0, .5, .5, 1, 1, -.5, .5, 0, 1 ]), 
        faces = new Uint16Array([ 0, 1, 2, 0, 2, 3 ]), vertexBuffer = _gl.createBuffer(), 
        elementBuffer = _gl.createBuffer(), _gl.bindBuffer(_gl.ARRAY_BUFFER, vertexBuffer), 
        _gl.bufferData(_gl.ARRAY_BUFFER, vertices, _gl.STATIC_DRAW), _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, elementBuffer), 
        _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, faces, _gl.STATIC_DRAW), program = createProgram(), 
        attributes = {
            position: _gl.getAttribLocation(program, "position"),
            uv: _gl.getAttribLocation(program, "uv")
        }, uniforms = {
            uvOffset: _gl.getUniformLocation(program, "uvOffset"),
            uvScale: _gl.getUniformLocation(program, "uvScale"),
            rotation: _gl.getUniformLocation(program, "rotation"),
            scale: _gl.getUniformLocation(program, "scale"),
            color: _gl.getUniformLocation(program, "color"),
            map: _gl.getUniformLocation(program, "map"),
            opacity: _gl.getUniformLocation(program, "opacity"),
            modelViewMatrix: _gl.getUniformLocation(program, "modelViewMatrix"),
            projectionMatrix: _gl.getUniformLocation(program, "projectionMatrix"),
            fogType: _gl.getUniformLocation(program, "fogType"),
            fogDensity: _gl.getUniformLocation(program, "fogDensity"),
            fogNear: _gl.getUniformLocation(program, "fogNear"),
            fogFar: _gl.getUniformLocation(program, "fogFar"),
            fogColor: _gl.getUniformLocation(program, "fogColor"),
            alphaTest: _gl.getUniformLocation(program, "alphaTest")
        };
        var canvas = document.createElement("canvas");
        canvas.width = 8, canvas.height = 8;
        var context = canvas.getContext("2d");
        context.fillStyle = "white", context.fillRect(0, 0, 8, 8), _texture = new THREE.Texture(canvas), 
        _texture.needsUpdate = !0;
    }, this.render = function(scene, camera) {
        if (sprites.length = 0, scene.traverseVisible(function(child) {
            child instanceof THREE.Sprite && sprites.push(child);
        }), 0 !== sprites.length) {
            _gl.useProgram(program), _gl.enableVertexAttribArray(attributes.position), _gl.enableVertexAttribArray(attributes.uv), 
            _gl.disable(_gl.CULL_FACE), _gl.enable(_gl.BLEND), _gl.bindBuffer(_gl.ARRAY_BUFFER, vertexBuffer), 
            _gl.vertexAttribPointer(attributes.position, 2, _gl.FLOAT, !1, 16, 0), _gl.vertexAttribPointer(attributes.uv, 2, _gl.FLOAT, !1, 16, 8), 
            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, elementBuffer), _gl.uniformMatrix4fv(uniforms.projectionMatrix, !1, camera.projectionMatrix.elements), 
            _gl.activeTexture(_gl.TEXTURE0), _gl.uniform1i(uniforms.map, 0);
            var oldFogType = 0, sceneFogType = 0, fog = scene.fog;
            fog ? (_gl.uniform3f(uniforms.fogColor, fog.color.r, fog.color.g, fog.color.b), 
            fog instanceof THREE.Fog ? (_gl.uniform1f(uniforms.fogNear, fog.near), _gl.uniform1f(uniforms.fogFar, fog.far), 
            _gl.uniform1i(uniforms.fogType, 1), oldFogType = 1, sceneFogType = 1) : fog instanceof THREE.FogExp2 && (_gl.uniform1f(uniforms.fogDensity, fog.density), 
            _gl.uniform1i(uniforms.fogType, 2), oldFogType = 2, sceneFogType = 2)) : (_gl.uniform1i(uniforms.fogType, 0), 
            oldFogType = 0, sceneFogType = 0);
            for (var i = 0, l = sprites.length; l > i; i++) {
                var sprite = sprites[i], material = sprite.material;
                sprite._modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, sprite.matrixWorld), 
                sprite.z = -sprite._modelViewMatrix.elements[14];
            }
            sprites.sort(painterSortStable);
            for (var scale = [], i = 0, l = sprites.length; l > i; i++) {
                var sprite = sprites[i], material = sprite.material;
                _gl.uniform1f(uniforms.alphaTest, material.alphaTest), _gl.uniformMatrix4fv(uniforms.modelViewMatrix, !1, sprite._modelViewMatrix.elements), 
                scale[0] = sprite.scale.x, scale[1] = sprite.scale.y;
                var fogType = 0;
                scene.fog && material.fog && (fogType = sceneFogType), oldFogType !== fogType && (_gl.uniform1i(uniforms.fogType, fogType), 
                oldFogType = fogType), null !== material.map ? (_gl.uniform2f(uniforms.uvOffset, material.map.offset.x, material.map.offset.y), 
                _gl.uniform2f(uniforms.uvScale, material.map.repeat.x, material.map.repeat.y)) : (_gl.uniform2f(uniforms.uvOffset, 0, 0), 
                _gl.uniform2f(uniforms.uvScale, 1, 1)), _gl.uniform1f(uniforms.opacity, material.opacity), 
                _gl.uniform3f(uniforms.color, material.color.r, material.color.g, material.color.b), 
                _gl.uniform1f(uniforms.rotation, material.rotation), _gl.uniform2fv(uniforms.scale, scale), 
                _renderer.setBlending(material.blending, material.blendEquation, material.blendSrc, material.blendDst), 
                _renderer.setDepthTest(material.depthTest), _renderer.setDepthWrite(material.depthWrite), 
                material.map && material.map.image && material.map.image.width ? _renderer.setTexture(material.map, 0) : _renderer.setTexture(_texture, 0), 
                _gl.drawElements(_gl.TRIANGLES, 6, _gl.UNSIGNED_SHORT, 0);
            }
            _gl.enable(_gl.CULL_FACE);
        }
    };
}, THREE.DepthPassPlugin = function() {
    function projectObject(scene, object, camera) {
        if (object.visible) {
            var webglObjects = scene.__webglObjects[object.id];
            if (webglObjects && (object.frustumCulled === !1 || _frustum.intersectsObject(object) === !0)) for (var i = 0, l = webglObjects.length; l > i; i++) {
                var webglObject = webglObjects[i];
                object._modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, object.matrixWorld), 
                _renderList.push(webglObject);
            }
            for (var i = 0, l = object.children.length; l > i; i++) projectObject(scene, object.children[i], camera);
        }
    }
    function getObjectMaterial(object) {
        return object.material instanceof THREE.MeshFaceMaterial ? object.material.materials[0] : object.material;
    }
    this.enabled = !1, this.renderTarget = null;
    var _gl, _renderer, _depthMaterial, _depthMaterialMorph, _depthMaterialSkin, _depthMaterialMorphSkin, _frustum = new THREE.Frustum(), _projScreenMatrix = new THREE.Matrix4(), _renderList = [];
    this.init = function(renderer) {
        _gl = renderer.context, _renderer = renderer;
        var depthShader = THREE.ShaderLib.depthRGBA, depthUniforms = THREE.UniformsUtils.clone(depthShader.uniforms);
        _depthMaterial = new THREE.ShaderMaterial({
            fragmentShader: depthShader.fragmentShader,
            vertexShader: depthShader.vertexShader,
            uniforms: depthUniforms
        }), _depthMaterialMorph = new THREE.ShaderMaterial({
            fragmentShader: depthShader.fragmentShader,
            vertexShader: depthShader.vertexShader,
            uniforms: depthUniforms,
            morphTargets: !0
        }), _depthMaterialSkin = new THREE.ShaderMaterial({
            fragmentShader: depthShader.fragmentShader,
            vertexShader: depthShader.vertexShader,
            uniforms: depthUniforms,
            skinning: !0
        }), _depthMaterialMorphSkin = new THREE.ShaderMaterial({
            fragmentShader: depthShader.fragmentShader,
            vertexShader: depthShader.vertexShader,
            uniforms: depthUniforms,
            morphTargets: !0,
            skinning: !0
        }), _depthMaterial._shadowPass = !0, _depthMaterialMorph._shadowPass = !0, _depthMaterialSkin._shadowPass = !0, 
        _depthMaterialMorphSkin._shadowPass = !0;
    }, this.render = function(scene, camera) {
        this.enabled && this.update(scene, camera);
    }, this.update = function(scene, camera) {
        var j, jl, buffer, material, webglObject, object, renderList, fog = null;
        _gl.clearColor(1, 1, 1, 1), _gl.disable(_gl.BLEND), _renderer.setDepthTest(!0), 
        scene.autoUpdate === !0 && scene.updateMatrixWorld(), camera.matrixWorldInverse.getInverse(camera.matrixWorld), 
        _projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse), 
        _frustum.setFromMatrix(_projScreenMatrix), _renderer.setRenderTarget(this.renderTarget), 
        _renderer.clear(), _renderList.length = 0, projectObject(scene, scene, camera);
        var objectMaterial, useMorphing, useSkinning;
        for (j = 0, jl = _renderList.length; jl > j; j++) webglObject = _renderList[j], 
        object = webglObject.object, buffer = webglObject.buffer, object instanceof THREE.PointCloud && !object.customDepthMaterial || (objectMaterial = getObjectMaterial(object), 
        objectMaterial && _renderer.setMaterialFaces(object.material), useMorphing = void 0 !== object.geometry.morphTargets && object.geometry.morphTargets.length > 0 && objectMaterial.morphTargets, 
        useSkinning = object instanceof THREE.SkinnedMesh && objectMaterial.skinning, material = object.customDepthMaterial ? object.customDepthMaterial : useSkinning ? useMorphing ? _depthMaterialMorphSkin : _depthMaterialSkin : useMorphing ? _depthMaterialMorph : _depthMaterial, 
        buffer instanceof THREE.BufferGeometry ? _renderer.renderBufferDirect(camera, scene.__lights, fog, material, buffer, object) : _renderer.renderBuffer(camera, scene.__lights, fog, material, buffer, object));
        for (renderList = scene.__webglObjectsImmediate, j = 0, jl = renderList.length; jl > j; j++) webglObject = renderList[j], 
        object = webglObject.object, object.visible && (object._modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, object.matrixWorld), 
        _renderer.renderImmediateObject(camera, scene.__lights, fog, _depthMaterial, object));
        var clearColor = _renderer.getClearColor(), clearAlpha = _renderer.getClearAlpha();
        _gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearAlpha), _gl.enable(_gl.BLEND);
    };
}, THREE.ShaderFlares = {
    lensFlareVertexTexture: {
        vertexShader: [ "uniform lowp int renderType;", "uniform vec3 screenPosition;", "uniform vec2 scale;", "uniform float rotation;", "uniform sampler2D occlusionMap;", "attribute vec2 position;", "attribute vec2 uv;", "varying vec2 vUV;", "varying float vVisibility;", "void main() {", "vUV = uv;", "vec2 pos = position;", "if( renderType == 2 ) {", "vec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) );", "visibility += texture2D( occlusionMap, vec2( 0.5, 0.1 ) );", "visibility += texture2D( occlusionMap, vec2( 0.9, 0.1 ) );", "visibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) );", "visibility += texture2D( occlusionMap, vec2( 0.9, 0.9 ) );", "visibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) );", "visibility += texture2D( occlusionMap, vec2( 0.1, 0.9 ) );", "visibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) );", "visibility += texture2D( occlusionMap, vec2( 0.5, 0.5 ) );", "vVisibility =        visibility.r / 9.0;", "vVisibility *= 1.0 - visibility.g / 9.0;", "vVisibility *=       visibility.b / 9.0;", "vVisibility *= 1.0 - visibility.a / 9.0;", "pos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;", "pos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;", "}", "gl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );", "}" ].join("\n"),
        fragmentShader: [ "uniform lowp int renderType;", "uniform sampler2D map;", "uniform float opacity;", "uniform vec3 color;", "varying vec2 vUV;", "varying float vVisibility;", "void main() {", "if( renderType == 0 ) {", "gl_FragColor = vec4( 1.0, 0.0, 1.0, 0.0 );", "} else if( renderType == 1 ) {", "gl_FragColor = texture2D( map, vUV );", "} else {", "vec4 texture = texture2D( map, vUV );", "texture.a *= opacity * vVisibility;", "gl_FragColor = texture;", "gl_FragColor.rgb *= color;", "}", "}" ].join("\n")
    },
    lensFlare: {
        vertexShader: [ "uniform lowp int renderType;", "uniform vec3 screenPosition;", "uniform vec2 scale;", "uniform float rotation;", "attribute vec2 position;", "attribute vec2 uv;", "varying vec2 vUV;", "void main() {", "vUV = uv;", "vec2 pos = position;", "if( renderType == 2 ) {", "pos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;", "pos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;", "}", "gl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );", "}" ].join("\n"),
        fragmentShader: [ "precision mediump float;", "uniform lowp int renderType;", "uniform sampler2D map;", "uniform sampler2D occlusionMap;", "uniform float opacity;", "uniform vec3 color;", "varying vec2 vUV;", "void main() {", "if( renderType == 0 ) {", "gl_FragColor = vec4( texture2D( map, vUV ).rgb, 0.0 );", "} else if( renderType == 1 ) {", "gl_FragColor = texture2D( map, vUV );", "} else {", "float visibility = texture2D( occlusionMap, vec2( 0.5, 0.1 ) ).a;", "visibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) ).a;", "visibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) ).a;", "visibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) ).a;", "visibility = ( 1.0 - visibility / 4.0 );", "vec4 texture = texture2D( map, vUV );", "texture.a *= opacity * visibility;", "gl_FragColor = texture;", "gl_FragColor.rgb *= color;", "}", "}" ].join("\n")
    }
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
    }, EngineUtils;
}(), THREE.AnaglyphEffect = function(renderer, width, height) {
    var distanceBetweenGlyhs, eyeLeft, eyeRight, focalLength, mesh, _aspect, _camera, _cameraL, _cameraR, _far, _fov, _material, _near, _params, _renderTargetL, _renderTargetR, _scene;
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
    }), mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), _material), _scene.add(mesh), 
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
        this.scene = new THREE.Scene(), this.lastMousePosition = void 0;
    }
    return BaseScene.prototype.tick = function() {
        throw "scene.tick not implemented";
    }, BaseScene.prototype.doMouseEvent = function() {
        throw "scene.doMouseEvent not implemented";
    }, BaseScene.prototype.doKeyboardEvent = function() {
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
            this.soundEnabled = !1, this.debug = !1;
        }
        return PrivateClass.prototype.toggleAnaglyph = function() {
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

var Engine3D, __bind = function(fn, me) {
    return function() {
        return fn.apply(me, arguments);
    };
};

Engine3D = function() {
    function Engine3D() {
        this.render = __bind(this.render, this), this.onDocumentKeyboardEvent = __bind(this.onDocumentKeyboardEvent, this), 
        this.onDocumentMouseEvent = __bind(this.onDocumentMouseEvent, this), this.config = Config.get(), 
        this.width = this.config.width, this.height = this.config.height, this.time = void 0, 
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, .1, 1e3), 
        this.camera.position.z = 10, this.renderer = new THREE.WebGLRenderer({
            antialias: this.config.antialias
        }), this.renderer.setSize(this.width, this.height), this.renderer.setClearColor(12761757, 1), 
        document.body.appendChild(this.renderer.domElement), this.config.resize && (this.winResize = new THREEx.WindowResize(this.renderer, this.camera)), 
        this.anaglyphEffect = new THREE.AnaglyphEffect(this.renderer), this.anaglyphEffect.setSize(this.width, this.height), 
        this.anaglyphEffect.setDistanceBetweenGlyphs(this.config.anaglyphDistance), this.projector = new THREE.Projector(), 
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
    }, Engine3D.prototype.addScene = function(scene) {
        return this.sceneManager.addScene(scene), null == this.sceneManager.currentSceneIndex ? this.sceneManager.setScene(scene) : void 0;
    }, Engine3D.prototype.removeScene = function(scene) {
        return this.sceneManager.removeScene(scene);
    }, Engine3D.prototype.render = function() {
        var now, tpf;
        return requestAnimationFrame(this.render), this.width = window.innerWidth, this.height = window.innerHeight, 
        now = new Date().getTime(), tpf = (now - (this.time || now)) / 1e3, this.time = now, 
        this.sceneManager.tick(tpf), this.statsManager.update(this.renderer), TWEEN.update(), 
        this.renderer.render(this.sceneManager.currentScene().scene, this.camera), this.config.anaglyph ? this.anaglyphEffect.render(this.sceneManager.currentScene().scene, this.camera) : void 0;
    }, Engine3D.prototype._parseMouseEvent = function(event) {
        var mouseX, mouseY, vector;
        return event.preventDefault(), event.target === this.renderer.domElement ? (mouseX = event.layerX / this.width * 2 - 1, 
        mouseY = 2 * -(event.layerY / this.height) + 1, vector = new THREE.Vector3(mouseX, mouseY, .5), 
        this.projector.unprojectVector(vector, this.camera), new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize())) : void 0;
    }, Engine3D;
}();