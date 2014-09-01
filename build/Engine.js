// Generated by CoffeeScript 1.4.0
var Engine,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Engine = (function() {

  function Engine() {
    this.render = __bind(this.render, this);

    this.onDocumentMouseDown = __bind(this.onDocumentMouseDown, this);

    this.onDocumentMouseMove = __bind(this.onDocumentMouseMove, this);
    this.config = Config.get();
    this.width = this.config.width;
    this.height = this.config.height;
    this.time = void 0;
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    this.camera.position.z = 10;
    this.renderer = new THREE.WebGLRenderer({
      antialias: this.config.antialias
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xc2ba9d, 1);
    document.body.appendChild(this.renderer.domElement);
    if (this.config.resize) {
      this.winResize = new THREEx.WindowResize(this.renderer, this.camera);
    }
    this.anaglyphEffect = new THREE.AnaglyphEffect(this.renderer);
    this.anaglyphEffect.setSize(this.width, this.height);
    this.anaglyphEffect.setDistanceBetweenGlyphs(this.config.anaglyphDistance);
    this.projector = new THREE.Projector();
    this.sceneManager = SceneManager.get();
    document.addEventListener("mousedown", this.onDocumentMouseDown, false);
    document.addEventListener("mousemove", this.onDocumentMouseMove, false);
    if (this.config.contextMenuDisabled) {
      document.addEventListener("contextmenu", function(e) {
        return e.preventDefault();
      }, false);
    }
    this.statsManager = StatsManager.get();
    if (this.config.showStatsOnLoad) {
      this.statsManager.toggle();
    }
  }

  Engine.prototype.onDocumentMouseMove = function(event) {
    var raycaster;
    raycaster = this._parseMouseEvent(event);
    if (raycaster != null) {
      return this.sceneManager.currentScene().doMouseMove(raycaster);
    }
  };

  Engine.prototype.onDocumentMouseDown = function(event) {
    var raycaster;
    raycaster = this._parseMouseEvent(event);
    if (raycaster != null) {
      return this.sceneManager.currentScene().doMouseDown(raycaster);
    }
  };

  Engine.prototype.setCursor = function(url) {
    return document.body.style.cursor = "url('" + url + "'), auto";
  };

  Engine.prototype.addScene = function(scene) {
    if (this.sceneManager.isEmpty()) {
      this.sceneManager.setScene(0);
    }
    return this.sceneManager.addScene(scene);
  };

  Engine.prototype.removeScene = function(scene) {
    return this.sceneManager.removeScene(scene);
  };

  Engine.prototype.render = function() {
    var now, tpf;
    requestAnimationFrame(this.render);
    now = new Date().getTime();
    tpf = (now - (this.time || now)) / 1000;
    this.time = now;
    this.sceneManager.tick(tpf);
    this.statsManager.update(this.renderer);
    TWEEN.update();
    this.renderer.render(this.sceneManager.currentScene().scene, this.camera);
    if (this.config.anaglyph) {
      return this.anaglyphEffect.render(this.sceneManager.currentScene().scene, this.camera);
    }
  };

  Engine.prototype._parseMouseEvent = function(event) {
    var mouseX, mouseY, vector;
    event.preventDefault();
    if (event.target === this.renderer.domElement) {
      mouseX = (event.layerX / this.width) * 2 - 1;
      mouseY = -(event.layerY / this.height) * 2 + 1;
      vector = new THREE.Vector3(mouseX, mouseY, 0.5);
      this.projector.unprojectVector(vector, this.camera);
      return new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
    }
  };

  return Engine;

})();
