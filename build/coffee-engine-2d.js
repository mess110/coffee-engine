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

var Utils;

Utils = function() {
    function Utils() {}
    return Utils.rgbToHex = function(r, g, b) {
        if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
        return (r << 16 | g << 8 | b).toString(16);
    }, Utils;
}();

var BaseScene;

BaseScene = function() {
    function BaseScene(engine) {
        this.engine = engine, this.context = this.engine.context;
    }
    return BaseScene.prototype.tick = function() {
        throw "scene.tick not implemented";
    }, BaseScene.prototype.doMouseEvent = function() {
        throw "scene.doMouseEvent not implemented";
    }, BaseScene.prototype.doKeyboardEvent = function() {
        throw "scene.doKeyboardEvent not implemented";
    }, BaseScene.prototype.drawText = function(text) {
        return this.context.fillStyle = "blue", this.context.font = "bold 16px Arial", this.context.fillText(text, 10, 30);
    }, BaseScene.prototype.getHexData = function(x, y, w, h) {
        var p;
        return p = this.context.getImageData(x, y, w, h).data, "#" + ("000000" + Utils.rgbToHex(p[0], p[1], p[2])).slice(-6);
    }, BaseScene;
}();

var Engine2D, __bind = function(fn, me) {
    return function() {
        return fn.apply(me, arguments);
    };
};

Engine2D = function() {
    function Engine2D(canvasId, width, height) {
        this.render = __bind(this.render, this), this.onDocumentKeyboardEvent = __bind(this.onDocumentKeyboardEvent, this), 
        this.onDocumentMouseEvent = __bind(this.onDocumentMouseEvent, this), this.sceneManager = SceneManager.get(), 
        this.time = void 0, this.width = width, this.height = height, this.backgroundColor = "#FFFFFF", 
        this.canvasId = canvasId, document.addEventListener("mousedown", this.onDocumentMouseEvent, !1), 
        document.addEventListener("mouseup", this.onDocumentMouseEvent, !1), document.addEventListener("mousemove", this.onDocumentMouseEvent, !1), 
        document.addEventListener("keydown", this.onDocumentKeyboardEvent, !1), document.addEventListener("keyup", this.onDocumentKeyboardEvent, !1), 
        this.canvas = document.getElementById(this.canvasId), this.canvas.width = width, 
        this.canvas.height = height, this.context = this.canvas.getContext("2d");
    }
    return Engine2D.prototype.onDocumentMouseEvent = function(event) {
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