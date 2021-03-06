//-----------------------------------------------------------------------------
// Sprite_Collider

function Sprite_Collider() {
  this.initialize.apply(this, arguments);
}

(function() {
  Sprite_Collider.prototype = Object.create(Sprite.prototype);
  Sprite_Collider.prototype.constructor = Sprite_Collider;

  Sprite_Collider.prototype.initialize = function(collider, duration) {
    Sprite.prototype.initialize.call(this);
    this.z = 7;
    this._duration = duration || 0;
    this._cache = {};
    this.setupCollider(collider);
    this.checkChanges();
  };

  Sprite_Collider.prototype.setCache = function() {
    this._cache = {
      color: this._collider.color,
      width: this._collider.width,
      height: this._collider.height,
      radian: this._collider._radian
    }
  };

  Sprite_Collider.prototype.needsRedraw = function() {
    return this._cache.width !== this._collider.width ||
      this._cache.height !== this._collider.height ||
      this._cache.color !== this._collider.color ||
      this._cache.radian !== this._collider._radian
  };

  Sprite_Collider.prototype.setupCollider = function(collider) {
    this._collider = collider;
    var isNew = false;
    if (!this._colliderSprite) {
      this._colliderSprite = new PIXI.Graphics();
      isNew = true;
    }
    this.drawCollider();
    if (isNew) {
      this.addChild(this._colliderSprite);
    }
  };

  Sprite_Collider.prototype.drawCollider = function() {
    var collider = this._collider;
    this._colliderSprite.clear();
    var color = (collider.color || '#ff0000').replace('#', '');
    color = parseInt(color, 16);
    this._colliderSprite.beginFill(color);
    if (collider.isCircle()) {
      var radiusX = collider.radiusX;
      var radiusY = collider.radiusY;
      this._colliderSprite.drawEllipse(0, 0, radiusX, radiusY);
      this._colliderSprite.rotation = collider._radian;
    } else {
      this._colliderSprite.drawPolygon(collider._baseVertices);
    }
    this._colliderSprite.endFill();
  };

  Sprite_Collider.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.checkChanges();
    if (this._duration >= 0 || this._collider.kill) {
      this.updateDecay();
    }
  };

  Sprite_Collider.prototype.checkChanges = function() {
    this.visible = !this._collider._isHidden;
    this.x = this._collider.x + this._collider.ox;
    this.x -= $gameMap.displayX() * QMovement.tileSize;
    this.y = this._collider.y + this._collider.oy;
    this.y -= $gameMap.displayY() * QMovement.tileSize;
    if (this.x < -this._collider.width || this.x > Graphics.width) {
      if (this.y < -this._collider.height || this.y > Graphics.height) {
        this.visible = false;
      }
    }
    this._colliderSprite.z = this.z;
    this._colliderSprite.visible = this.visible;
    if (this.needsRedraw()) {
      this.drawCollider();
      this.setCache();
    }
  };

  Sprite_Collider.prototype.updateDecay = function() {
    this._duration--;
    if (this._duration <= 0 || this._collider.kill) {
      ColliderManager.removeSprite(this);
      this._collider = null;
    }
  };
})();
