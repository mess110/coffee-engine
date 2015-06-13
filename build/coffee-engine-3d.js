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
            this.soundEnabled = !1, this.debug = !1, this.preventDefaultMouseEvents = !0;
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
            antialias: this.config.antialias
        }), this.renderer.setSize(this.width, this.height), this.renderer.setClearColor(12761757, 1), 
        document.body.appendChild(this.renderer.domElement), camera = new THREE.PerspectiveCamera(75, this.width / this.height, .1, 1e3), 
        this.setCamera(camera), this.camera.position.z = 10, this.anaglyphEffect = new THREE.AnaglyphEffect(this.renderer), 
        this.anaglyphEffect.setSize(this.width, this.height), this.anaglyphEffect.setDistanceBetweenGlyphs(this.config.anaglyphDistance), 
        this.projector = new THREE.Projector(), this.sceneManager = SceneManager.get(), 
        document.addEventListener("mouseup", this.onDocumentMouseEvent, !1), document.addEventListener("mousedown", this.onDocumentMouseEvent, !1), 
        document.addEventListener("mousemove", this.onDocumentMouseEvent, !1), document.addEventListener("keydown", this.onDocumentKeyboardEvent, !1), 
        document.addEventListener("keyup", this.onDocumentKeyboardEvent, !1), this.config.contextMenuDisabled && document.addEventListener("contextmenu", function(e) {
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
        this.sceneManager.tick(tpf), this.statsManager.update(this.renderer), TWEEN.update(), 
        this.renderer.render(this.sceneManager.currentScene().scene, this.camera), this.config.anaglyph ? this.anaglyphEffect.render(this.sceneManager.currentScene().scene, this.camera) : void 0;
    }, Engine3D.prototype._parseMouseEvent = function(event) {
        var mouseX, mouseY, vector;
        return this.config.preventDefaultMouseEvents && event.preventDefault(), event.target === this.renderer.domElement ? (mouseX = event.layerX / this.width * 2 - 1, 
        mouseY = 2 * -(event.layerY / this.height) + 1, vector = new THREE.Vector3(mouseX, mouseY, .5), 
        this.projector.unprojectVector(vector, this.camera), new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize())) : void 0;
    }, Engine3D;
}();