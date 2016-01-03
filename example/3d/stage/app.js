// Generated by CoffeeScript 1.10.0
var LoadingScene, camera, config, engine, loadingScene,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

config = Config.get();

config.fillWindow();

camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

engine = new Engine3D();

engine.setCamera(camera);

engine.camera.position.set(0, 20, 27);

engine.renderer.shadowMapEnabled = true;

LoadingScene = (function(superClass) {
  extend(LoadingScene, superClass);

  LoadingScene.prototype.spawnBunny = function() {
    return JsonModelManager.get().load('bunny', 'models/bunny_all.json', (function(_this) {
      return function(mesh) {
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        _this.bunny = mesh;
        _this.bunny.position.set((Math.random() - 0.5) * 40, 0, (Math.random() - 0.5) * 40);
        _this.bunny.scale.set(0.5, 0.5, 0.5);
        _this.bunny.animations[1].play();
        _this.bunny.speed = 3;
        _this.bunnies.push(_this.bunny);
        return _this.scene.add(_this.bunny);
      };
    })(this));
  };

  function LoadingScene() {
    var box, geometry, mat, material, texture;
    LoadingScene.__super__.constructor.call(this);
    this.ambientLights = [Helper.ambientLight(), Helper.ambientLight(), Helper.ambientLight(), Helper.ambientLight()];
    box = new THREE.BoxGeometry(1, 1, 1);
    mat = new THREE.MeshPhongMaterial({
      color: 0xff0000
    });
    this.controls = new THREE.OrbitControls(engine.camera);
    this.lightCtrl = new LightCtrl();
    this.lightCtrl.addAllToScene(this.scene);
    this.bunnies = [];
    this.spawnBunny();
    JsonModelManager.get().load('bear', 'models/bear_all.json', (function(_this) {
      return function(mesh) {
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        _this.bear = mesh;
        _this.bear.position.set(0, 0, 0);
        _this.bear.animations[0].play();
        _this.bear.speed = 5;
        _this.scene.add(_this.bear);
        if (_this.bear != null) {
          _this.lightCtrl.lookAt(_this.bear);
        }
        return JsonModelManager.get().load('shotgun', 'models/shotgun.json', function(mesh) {
          mesh.receiveShadow = true;
          mesh.castShadow = true;
          _this.shotgun = mesh;
          _this.shotgun.animations[1].loop = false;
          _this.shotgun.scale.set(0.3, 0.3, 0.3);
          _this.shotgun.position.set(0, 3, 2.5);
          return _this.bear.add(_this.shotgun);
        });
      };
    })(this));
    JsonModelManager.get().load('drapes', 'models/drapes.json', (function(_this) {
      return function(mesh) {
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        _this.drapesBg = mesh;
        _this.drapesBg.position.set(0, 0, -15);
        _this.drapesBg.scale.x = 3.5;
        return _this.scene.add(_this.drapesBg);
      };
    })(this));
    JsonModelManager.get().load('drapes', 'models/drapes2.json', (function(_this) {
      return function(mesh) {
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        _this.drapes = mesh;
        _this.drapes.opened = false;
        _this.drapes.position.set(0, 0, 15);
        _this.drapes.scale.x = 2;
        return _this.scene.add(_this.drapes);
      };
    })(this));
    JsonModelManager.get().load('mask', 'models/theater_mask.json', (function(_this) {
      return function(mesh) {
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        _this.mask = mesh;
        _this.mask.position.set(0, 16, 16);
        return _this.scene.add(_this.mask);
      };
    })(this));
    texture = THREE.ImageUtils.loadTexture('models/diffuse.png');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 6);
    mat = new THREE.MeshPhongMaterial({
      shininess: 0,
      map: texture,
      combine: THREE.MixOperation,
      reflectivity: 0.00
    });
    geometry = new THREE.PlaneBufferGeometry(80, 80, 32);
    material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide
    });
    this.plane = new THREE.Mesh(geometry, mat);
    this.plane.receiveShadow = true;
    this.plane.castShadow = true;
    this.plane.position.z = -20;
    this.plane.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
    this.scene.add(this.plane);
    this.raycaster = new THREE.Raycaster();
    this.loaded = true;
  }

  LoadingScene.prototype.toggleLights = function() {
    var action, i, len, light, ref;
    action = this.lights ? 'remove' : 'add';
    ref = this.ambientLights;
    for (i = 0, len = ref.length; i < len; i++) {
      light = ref[i];
      this.scene[action](light);
    }
    return this.lights = !this.lights;
  };

  LoadingScene.prototype.tick = function(tpf) {
    var asd, bar, bunny, direction, i, intersected, intersects, len, matrix, ref, results, tween;
    if (!this.loaded) {
      return;
    }
    if (this.mask && this.drapes) {
      this.mask.castShadow = !this.drapes.opened;
    }
    if ((this.bear != null) && (this.shotgun != null) && this.bunnies.any()) {
      this.moving = false;
      if (this.keyboard.pressed(' ') && !this.shotgun.animations[1].isPlaying) {
        this.shotgun.animations[1].play();
        matrix = new THREE.Matrix4;
        matrix.extractRotation(this.bear.matrix);
        direction = new THREE.Vector3(0, 0, 1);
        direction.applyMatrix4(matrix);
        this.raycaster.set(this.bear.position, direction);
        intersects = this.raycaster.intersectObjects(this.bunnies);
        if (intersects.any()) {
          intersected = intersects.first().object;
          asd = {
            x: (Math.random() - 0.5) * 40,
            y: 0,
            z: (Math.random() - 0.5) * 40
          };
          bar = {
            x: intersected.position.x,
            y: intersected.position.y,
            z: intersected.position.z
          };
          tween = new TWEEN.Tween(bar).to(asd, 1000).onUpdate(function() {
            intersected.position.set(this.x, this.y, this.z);
          }).easing(TWEEN.Easing.Cubic.InOut).start();
          this.spawnBunny();
        }
      }
      if (this.keyboard.pressed('w')) {
        this.moving = true;
        this.bear.translateZ(tpf * this.bear.speed);
      }
      if (this.keyboard.pressed('s')) {
        this.moving = true;
        this.bear.translateZ(-tpf * this.bear.speed);
      }
      if (this.keyboard.pressed('a')) {
        this.moving = true;
        this.bear.rotation.y += tpf * this.bear.speed / 2;
      }
      if (this.keyboard.pressed('d')) {
        this.moving = true;
        this.bear.rotation.y -= tpf * this.bear.speed / 2;
      }
      this.lightCtrl.lookAt(this.bear);
      if (this.bear.animations[0].isPlaying && this.moving) {
        this.bear.animations[1].play();
        this.bear.animations[0].stop();
      }
      if (this.bear.animations[1].isPlaying && !this.moving) {
        this.bear.animations[0].play();
        this.bear.animations[1].stop();
      }
      ref = this.bunnies;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        bunny = ref[i];
        bunny.lookAt(this.bear.position);
        if (this.moving) {
          bunny.translateZ(tpf * bunny.speed);
        }
        if (bunny.position.distanceTo(this.bear.position) < 3) {
          location.reload();
        }
        if (bunny.animations[0].isPlaying && this.moving) {
          bunny.animations[1].play();
          bunny.animations[0].stop();
        }
        if (bunny.animations[1].isPlaying && !this.moving) {
          bunny.animations[0].play();
          results.push(bunny.animations[1].stop());
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

  LoadingScene.prototype.doMouseEvent = function(event, raycaster) {
    var asd;
    if (event.type === 'mousemove') {
      asd = raycaster.intersectObject(this.plane);
      if (asd.length > 0) {
        return this.lastMousePosition = asd[0].point;
      }
    }
  };

  LoadingScene.prototype.doKeyboardEvent = function(event) {
    if (this.drapes == null) {
      return;
    }
    if (event.type === 'keyup' && event.which === 13) {
      if (this.drapes.animations[0].isPlaying) {
        return;
      }
      this.drapes.animations[0].play();
      setTimeout((function(_this) {
        return function() {
          return _this.drapes.opened = !_this.drapes.opened;
        };
      })(this), this.drapes.opened ? (this.drapes.animations[0].data.length * 1000 - 100) / 3 : (this.drapes.animations[0].data.length * 1000 - 100) / 4 * 3 - 150);
      return setTimeout((function(_this) {
        return function() {
          _this.drapes.animations[0].stop();
          return _this.drapes.animations[0].timeScale *= -1;
        };
      })(this), this.drapes.animations[0].data.length * 1000 - 100);
    }
  };

  return LoadingScene;

})(BaseScene);

loadingScene = new LoadingScene();

engine.addScene(loadingScene);

engine.render();
