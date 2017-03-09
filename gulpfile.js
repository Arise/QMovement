var gulp = require('gulp');
var concat = require('gulp-concat');

var files = [
  './src/Header1.js',
  './src/Header2.js',
  './src/Colliders.js',
  './src/ColliderManager.js',
  './src/Game_Temp.js',
  './src/Game_System.js',
  './src/Game_Map.js',
  './src/Game_CharacterBase.js',
  './src/Game_Character.js',
  './src/Game_Player.js',
  './src/Game_Event.js',
  './src/Scene_Map.js',
  './src/Sprite_Collider.js',
  './src/Sprite_Destination.js',
  './src/Spriteset_Map.js'
]


gulp.task('default', ['build']);

gulp.task('build', function() {
  return gulp.src(files)
    .pipe(concat('QMovement.js'))
    .pipe(gulp.dest('dist'));
})
