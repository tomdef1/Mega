		<script>
'use strict';

// DOM natives
var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

// Width and Height of Canvas / 8
var height = 40;
var width = 100;

// Globals for timing
// Time of frame start
var time = performance.now();
// Time of last frame start
var lastTime = time;
// Time game ended
var deadTime = time;
// Time current game mode started
var startTime = time;
// Difference between this frame and last frame
var frameDelta = 0;
// Difference between now and when game ended
var deadDelta = 0;
// Difference between now and when current game mode started
var startDelta = 0;

// Contains currently pressed keys as map of keycode -> true
var keys = {};
// Math.random calculated per frame
var frameRandom = 0;

// Switch for game mode to advance stages
var gameMode = 0;

// Colors
var skyBlue = '76f5fb';
var hotPink = 'fb3494';
var seaGreen = '3b9b9c';
var sandGold = 'fbd230';
var waterBlue = '58a3d5';
var palmGreen = '008800';
var palmBrown = 'b57c53';
var seaFoam = 'cef3fd';


// Draws an 8x8 pixel
var origFillStyle = ctx.fillStyle;
var drawPixel = function (x, y, color) {
	origFillStyle = ctx.fillStyle;
	ctx.fillStyle = '#' + color;
	x = x * 8;
	y = y * 8;
	ctx.fillRect(x, y, 8, 8);
	ctx.fillStyle = origFillStyle;
};

// Defines the shapes of letters in alphabet as 3x5 pixels
var pixelChars = {
	'a': [
		[0,0],[1,0],[2,0],
		[0,1],      [2,1],
		[0,2],[1,2],[2,2],
		[0,3],      [2,3],
		[0,4],      [2,4]
	],
	'b': [
		[0,0],[1,0],
		[0,1],      [2,1],
		[0,2],[1,2],[2,2],
		[0,3],      [2,3],
		[0,4],[1,4]
	],
	'c': [
		[0,0],[1,0],[2,0],
		[0,1],
		[0,2],
		[0,3],
		[0,4],[1,4],[2,4]
	],
	'd': [
		[0,0],[1,0],
		[0,1],      [2,1],
		[0,2],      [2,2],
		[0,3],      [2,3],
		[0,4],[1,4]
	],
	'e': [
		[0,0],[1,0],[2,0],
		[0,1],
		[0,2],[1,2],[2,2],
		[0,3],
		[0,4],[1,4],[2,4]
	],
	'f': [
		[0,0],[1,0],[2,0],
		[0,1],
		[0,2],[1,2],[2,2],
		[0,3],
		[0,4]
	],
	'g': [
		[0,0],[1,0],[2,0],
		[0,1],
		[0,2],
		[0,3],      [2,3],
		[0,4],[1,4],[2,4]
	],
	'h': [
		[0,0],      [2,0],
		[0,1],      [2,1],
		[0,2],[1,2],[2,2],
		[0,3],      [2,3],
		[0,4],      [2,4]
	],
	'i': [
		[0,0],[1,0],[2,0],
		      [1,1],
		      [1,2],
		      [1,3],
		[0,4],[1,4],[2,4]
	],
	'j': [
		[0,0],[1,0],[2,0],
		            [2,1],
		            [2,2],
		[0,3],      [2,3],
		      [1,4],[2,4]
	],
	'k': [
		[0,0],      [2,0],
		[0,1],      [2,1],
		[0,2],[1,2],
		[0,3],      [2,3],
		[0,4],      [2,4]
	],
	'l': [
		[0,0],
		[0,1],
		[0,2],
		[0,3],
		[0,4],[1,4],[2,4]
	],
	'm': [
		[0,0],      [2,0],
		[0,1],[1,1],[2,1],
		[0,2],[1,2],[2,2],
		[0,3],      [2,3],
		[0,4],      [2,4]
	],
	'n': [
		[0,0],      [2,0],
		[0,1],[1,1],[2,1],
		[0,2],      [2,2],
		[0,3],      [2,3],
		[0,4],      [2,4]
	],
	'o': [
		[0,0],[1,0],[2,0],
		[0,1],      [2,1],
		[0,2],      [2,2],
		[0,3],      [2,3],
		[0,4],[1,4],[2,4]
	],
	'p': [
		[0,0],[1,0],[2,0],
		[0,1],      [2,1],
		[0,2],[1,2],[2,2],
		[0,3],
		[0,4]
	],
	'q': [
		[0,0],[1,0],[2,0],
		[0,1],      [2,1],
		[0,2],      [2,2],
		[0,3],[1,3],
		            [2,4]
	],
	'r': [
		[0,0],[1,0],[2,0],
		[0,1],      [2,1],
		[0,2],      [2,2],
		[0,3],[1,3],
		[0,4],      [2,4]
	],
	's': [
		[0,0],[1,0],[2,0],
		[0,1],
		[0,2],[1,2],[2,2],
		            [2,3],
		[0,4],[1,4],[2,4]
	],
	't': [
		[0,0],[1,0],[2,0],
		      [1,1],
		      [1,2],
		      [1,3],
		      [1,4]
	],
	'u': [
		[0,0],      [2,0],
		[0,1],      [2,1],
		[0,2],      [2,2],
		[0,3],      [2,3],
		[0,4],[1,4],[2,4]
	],
	'v': [
		[0,0],      [2,0],
		[0,1],      [2,1],
		[0,2],      [2,2],
		[0,3],      [2,3],
		      [1,4]
	],
	'w': [
		[0,0],      [2,0],
		[0,1],      [2,1],
		[0,2],      [2,2],
		[0,3],[1,3],[2,3],
		[0,4],      [2,4]
	],
	'x': [
		[0,0],      [2,0],
		[0,1],      [2,1],
		      [1,2],
		[0,3],      [2,3],
		[0,4],      [2,4]
	],
	'y': [
		[0,0],      [2,0],
		[0,1],      [2,1],
		      [1,2],
		      [1,3],
		      [1,4]
	],
	'z': [
		[0,0],[1,0],[2,0],
		            [2,1],
		      [1,2],
		[0,3],
		[0,4],[1,4],[2,4]
	],
	'1': [
		[0,0],[1,0],
		      [1,1],
		      [1,2],
		      [1,3],
		[0,4],[1,4],[2,4]
	],
	'2': [
		[0,0],[1,0],[2,0],
		            [2,1],
		[0,2],[1,2],[2,2],
		[0,3],
		[0,4],[1,4],[2,4]
	],
	'3': [
		[0,0],[1,0],[2,0],
		            [2,1],
		[0,2],[1,2],[2,2],
		            [2,3],
		[0,4],[1,4],[2,4]
	],
	'4': [
		[0,0],      [2,0],
		[0,1],      [2,1],
		[0,2],[1,2],[2,2],
		            [2,3],
		            [2,4]
	],
	'6': [
		[0,0],[1,0],[2,0],
		[0,1],
		[0,2],[1,2],[2,2],
		[0,3],      [2,3],
		[0,4],[1,4],[2,4]
	],
	'7': [
		[0,0],[1,0],[2,0],
		            [2,1],
		            [2,2],
		            [2,3],
		            [2,4]
	],
	'8': [
		[0,0],[1,0],[2,0],
		[0,1],      [2,1],
		[0,2],[1,2],[2,2],
		[0,3],      [2,3],
		[0,4],[1,4],[2,4]
	],
	'9': [
		[0,0],[1,0],[2,0],
		[0,1],      [2,1],
		[0,2],[1,2],[2,2],
		            [2,3],
		            [2,4]
	],
	':': [
		[0,0],
		[0,1],

		[0,3],
		[0,4]
	],
	'!': [
		      [1,0],
		      [1,1],
		      [1,2],

		      [1,4]
	],
	'?': [
		[0,0],[1,0],
		            [2,1],
		      [1,2],

		      [1,4]
	],
	'.': [
		      [1,4]
	]
};
pixelChars['0'] = pixelChars.o;
pixelChars['5'] = pixelChars.s;

// Draws text
var drawText = function (x, y, text, color) {
	var chars = text.split('');
	var char = '';
	for (var i = 0; i < chars.length; i++) {
		if (chars[i].trim() !== '') {
			char = pixelChars[chars[i].toLowerCase()] || pixelChars['?'];
			for (var j = 0; j < char.length; j++) {
				drawPixel(
					x + char[j][0],
					y + char[j][1],
					color
				);
			}
		}
		x += 4;
	}
};

// Pixel map for wave shape
var wave = [
	[false, false, true,  true,  false, false, false, false],
	[false, false, false, true,  true,  true,  false, false],
	[false, false, false, true,  true,  true,  true,  false],
	[false, false, false, false, true,  true,  true,  false],
	[true,  true,  true,  true,  true,  true,  true,  true] ,
	[true,  true,  true,  true,  true,  true,  true,  true] ,
	[true,  true,  true,  true,  true,  true,  true,  true] ,
	[true,  true,  true,  true,  true,  true,  true,  true]
];

// Draws a wave with given offset - modify offset to loop wave animation
var drawWave = function (x, y, offset, color) {
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			var k = (i + offset) % 8;
			if (wave[j][k]) {
				drawPixel(x + i, y + j, color);
			}
		}
	}
};

var konami = false;
// Starts the game
var startGame = function () {
	startTime = time;
	gameMode = 1;
	keys = {};
};

// Ends the game
var endGame = function () {
	konami = false;
	deadTime = time;
	gameMode = 0;
};

// Shows death (game over) screen
var goToKillScreen = function () {
	deadTime = time;
	gameMode = 3;
};

// --- Countdown animation game mode
var getReady = function () {
	if (startDelta < 2000) {
		var k = startDelta < 1000 ? Math.floor(startDelta * (100 / 1000)) : 100;
		drawText(k, 16, 'GET READY!', '58a3d5');
		drawText(48, 24, (3 - Math.floor(startDelta / 1000)).toString(), 'fb3494');
	} else if (startDelta < 3000) {
		if (Math.floor(time / 250) % 2 === 0) {
			drawText(30, 16, 'SURFS UP!!!', 'fb3494');
		}
		drawText(48, 24, (3 - Math.floor(startDelta / 1000)).toString(), 'fb3494');
	} else {
		// Go to next game mode
		startTime = time;
		gameMode = 2;
	}

	var offset = Math.floor(time / 250) % 8;
	for (var i = 0; i < width; i += 8) {
		drawWave(i, height - 8, offset, 'cef3fd');
	}
};

// --- Jump shark game mode

var jumpGamePlayer = {};
var spawnJumpGamePlayer = function () {
	return {
		x: 10,
		y: 20,
		initialY: 20,
		velocity: 0,
		sprite: [
			                                             [3,0,'fbd230'],[4,0,'fbd230'],
			                                             [3,1,'fbd230'],[4,1,'ffd5aa'],
			               [1,2,'ffd5aa'],[2,2,'ffd5aa'],[3,2,'ffd5aa'],[4,2,'ffd5aa'],[5,2,'ffd5aa'],
			                                             [3,3,'ffd5aa'],[4,3,'ffd5aa'],               [6,3,'ffd5aa'],
			                                             [3,4,'00cc22'],[4,4,'00cc22'],
			                                             [3,5,'00cc22'],               [5,5,'00cc22'],
			                                             [3,6,'ffd5aa'],               [5,6,'ffd5aa'],
			[0,7,'444444'],[1,7,'444444'],[2,7,'444444'],[3,7,'ffd5aa'],[4,7,'444444'],[5,7,'ffd5aa'],[6,7,'444444'],[7,7,'444444'],
			               [1,8,'444444'],[2,8,'fb3494'],[3,8,'ffd5aa'],[4,8,'fb3494'],[5,8,'ffd5aa'],[6,8,'fb3494'],[7,8,'fb3494'],[8,8,'444444'],
			                              [2,9,'444444'],[3,9,'444444'],[4,9,'444444'],[5,9,'444444'],[6,9,'444444'],[7,9,'444444'],[8,9,'444444'],[9,9,'444444'],

		],
		// Move and return collision hull
		tick : function() {
			var newY = this.y;

			if (this.y >= this.initialY) {
				if (keys[38]) {
					this.velocity += 150;
				}
				this.velocity = Math.max(0, this.velocity);
			} else {
				this.velocity = this.velocity - (frameDelta / 1000) * 500;
			}

			if (this.velocity !== 0) {
				newY = this.y - (this.velocity * (frameDelta / 1000));
			}

			var collisionHull = [];
			// Collisions between ticks
			for (var i = 0; i < this.sprite.length; i++) {
				for (var j = 0; j <= this.y - newY; j++) {
					collisionHull.push(
						[this.sprite[i][0] + this.x, this.sprite[i][1] + Math.floor(this.y - j)]
					);
				}
			}

			this.y = this.initialY >= newY ? newY : this.initialY;

			return collisionHull;
		},
		draw: function () {
			drawSprite(this.x, this.y, this.sprite);
		}
	};
};

var spawnJumpGameShark = function () {
	return {
		x: width,
		y: 28,
		shape: [
			                                                      [9,0],[10,0],[11,0],
			                                                [8,1],[9,1],[10,1],[11,1],
			                                          [7,2],[8,2],[9,2],[10,2],[11,2],
			            [2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3],[11,3],[12,3],[13,3],[14,3],
			      [1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],[11,4],[12,4],[13,4],[14,4],[15,4],[16,4],[17,4]
		],
		velocity: frameRandom * 50 + 150,
		// Move and return collision hull
		tick : function () {

			if (this.y > 24) this.y--;

			var newX = this.x;
			if (this.velocity !== 0) {
				newX = this.x - (this.velocity * (frameDelta / 1000));
			}
			var collisionHull = [];
			for (var i = 0; i < this.shape.length; i++) {
				for (var j = 0; j <= this.x - newX; j++) {
					collisionHull.push(
						[this.shape[i][0] + Math.floor(this.x - j), this.shape[i][1] + this.y]
					);
				}
			}

			this.x = newX;
			if (this.x < 0) {
				jumpGameSharks.splice(jumpGameSharks.indexOf(this), 1);
			}
			return collisionHull;
		},
		draw: function () {
			for (var i = 0; i < this.shape.length; i++) {
				drawPixel(this.shape[i][0] + Math.floor(this.x), this.shape[i][1] + Math.floor(this.y), i === 15 ? '880000' : '888888');
			}
		}
	};
};



var palmTree = [
	                                [2,0,palmGreen],[3,0,palmGreen],
	                                                               [4,1,palmGreen],[5,1,palmGreen],[6,1,palmGreen],[7,1,palmGreen],
	                                               [3,2,palmGreen],[4,2,palmGreen],[5,2,palmGreen],                                [8,2,palmGreen],
	                [1,3,palmGreen],[2,3,palmGreen],               [4,3,palmBrown],[5,3,palmGreen],[6,3,palmGreen],
	[0,4,palmGreen],[1,4,palmGreen],                                               [5,4,palmBrown],[6,4,palmGreen],[7,4,palmGreen],
	                                                                               [5,5,palmBrown],                [7,5,palmGreen],
	                                                                                               [6,6,palmBrown],
	                                                                                               [6,7,palmBrown],
	                                                                                               [6,8,palmBrown],
	                                                                               [5,9,palmBrown],
	                                                                               [5,10,palmBrown],
	                                                                               [5,11,palmBrown]
];

var drawSprite = function (x, y, sprite) {
	for (var i = 0; i < sprite.length; i++) {
		drawPixel(sprite[i][0] + x, sprite[i][1] + y, sprite[i][2]);
	}
};

var drawPalmTree = function (x, y) {
	drawSprite(x, y, palmTree);
};

var drawIsland = function (x, y) {
	for (var i = x; i < width; i++) {
		drawPixel(i, y, sandGold);
	}

	if (width - x > 6) {
		for(var i = x + 6; i < width; i++) {
			drawPixel(i, y - 1, sandGold);
		}
	}

	if (width - x > 12) {
		for (var i = x + 12; i < width; i++) {
			drawPixel(i, y - 2, sandGold);
		}
	}

	if (width - x > 20) {
		drawPalmTree(x + 20, y - 14);
	}

	if (width - x > 40) {
		drawPalmTree(x + 40, y - 14);
	}
};

var surfWave = [
	[8,0,seaFoam],[9,0,seaFoam],
	[6,1,seaFoam],[7,1,seaGreen],[8,1,waterBlue],
	[5,2,seaFoam],[6,2,seaGreen],[7,2,waterBlue],
	[2,3,seaFoam],[3,3,seaFoam],[4,3,seaFoam],[5,3,seaGreen],[6,3,waterBlue],
	[0,4,seaGreen],[1,4,seaGreen],[2,4,seaGreen],[3,4,seaGreen],[4,4,seaGreen],[5,4,seaGreen],[6,4,waterBlue],
	[0,5,seaGreen],[1,5,seaGreen],[2,5,seaGreen],[3,5,seaGreen],[4,5,seaGreen],[5,5,seaGreen],[6,5,waterBlue],
	[0,6,seaGreen],[1,6,seaGreen],[2,6,seaGreen],[3,6,seaGreen],[4,6,seaGreen],[5,6,seaGreen],[6,6,seaGreen],[7,6,waterBlue],
	[0,7,seaGreen],[1,7,seaGreen],[2,7,seaGreen],[3,7,seaGreen],[4,7,seaGreen],[5,7,seaGreen],[6,7,seaGreen],[7,7,seaGreen],[8,7,waterBlue],[9,7,seaFoam],
	[0,8,seaGreen],[1,8,seaGreen],[2,8,seaGreen],[3,8,seaGreen],[4,8,seaGreen],[5,8,seaGreen],[6,8,seaGreen],[7,8,seaGreen],[8,8,seaGreen],[9,8,waterBlue],[10,8,seaFoam],
	[0,9,seaGreen],[1,9,seaGreen],[2,9,seaGreen],[3,9,seaGreen],[4,9,seaGreen],[5,9,seaGreen],[6,9,seaGreen],[7,9,seaGreen],[8,9,seaGreen],[9,9,seaGreen],[10,9,waterBlue],[11,9,seaFoam]
];

var jumpGameSharks = [];
var nextSharkTime = 0;
var jumpGame = function () {
	// Distance to shore
	var distance = 1800 - Math.floor(startDelta / 40);

	if (!jumpGamePlayer.tick) {
		jumpGamePlayer = spawnJumpGamePlayer();
	}

	if (time > nextSharkTime && distance > 50 && distance < 1750) {
		if (jumpGameSharks.length < 2) {
			jumpGameSharks.push(spawnJumpGameShark());
		}
		nextSharkTime = frameRandom < 0.25 ? (time + 200) : (time + frameRandom * 1000 + 700);
	}

	var playerCollisionHull = jumpGamePlayer.tick();

	if (distance < 900 && distance >= 600) {
		drawPixel(width - 1, 28, sandGold);
	}
	if (distance < 600) {
		var islandOffset = Math.floor(60 / Math.max((distance / 60), 1));
		drawIsland(width - islandOffset, 28);
	}

	for (var i = 12; i < width; i++) {
		drawPixel(i, 29, '58a3d5');
	}

	jumpGamePlayer.draw();

	// Intersect the collision hulls of the player and all current sharks for the last frame
	for (var i = 0; i < jumpGameSharks.length; i++) {
		var sharkCollisionHull = jumpGameSharks[i].tick();
		if (sharkCollisionHull.some(function (sharkCoordinate) {
			return playerCollisionHull.some(function (playerCoordinate) {
				return sharkCoordinate[0] === playerCoordinate[0] && sharkCoordinate[1] == playerCoordinate[1];
			});
		})) {
			// If any intersections took place the player is killed
			jumpGamePlayer = {};
			jumpGameSharks = [];
			goToKillScreen();
		}
	}
	for (var i = 0; i < jumpGameSharks.length; i++) {
		jumpGameSharks[i].draw();
	}

	// Draw Waves
	drawSprite(0, 20, surfWave);
	switch (Math.floor(time / 100) % 3) {
		case 0:
			drawPixel(6,24,seaGreen);
			drawPixel(6,25,seaFoam);
			break;
		case 1:
			drawPixel(6,24,seaFoam);
			drawPixel(8,28,seaFoam);
			break;
		case 2:
			drawPixel(6,26,seaFoam);
			drawPixel(7,27,seaFoam);
			break;
	}

	for (var i = 0; i < width; i++) {
		for (var m = 30; m < height; m++) {
			drawPixel(i,m,'3b9b9c');
		}
	}

	var m = Math.floor(time / (distance > 0 ? 10 : 40)) % 8;
	for (var i = 0; i < width; i += 8) {
		drawWave(i, height - 8, m, 'cef3fd');
	}

	if (distance > 0) {
		var distanceText = distance / 1000 >= 1 ? (distance / 1000).toString().substr(0, 3) + 'KM' : distance + 'M';
		drawText(54, 4, 'SHORE:' + distanceText, '78c29e');
	}

	if (distance < -100) {
		goToIslandDialogue();
	}
};

// --- Kill Screen (Game Over Dude!)

// Defines a skull as a series of on or off pixels that are wrapped at mod 7
var skull = [1,5,1,8,2,1,2,11,1,3,1,5,2,1,1,1,1,1,1];

var drawSkull = function (x, y, color) {
	var draw = false;
	var pixelTotal = 0;
	for (var i = 0; i < skull.length; i++) {
		for (var j = 0; j < skull[i]; j++) {
			if (draw) {
				drawPixel(x + pixelTotal % 7, y + Math.floor(pixelTotal / 7), color);
			}
			pixelTotal++;
		}
		draw = !draw;
	}
};

var killScreen = function () {

	ctx.fillStyle = '#' + seaGreen;
	ctx.fillRect(0, Math.floor(canvas.height * 0.4), canvas.width, Math.floor(canvas.height * 0.25));
	ctx.fillStyle = '#' + sandGold;
	ctx.fillRect(0, Math.floor(canvas.height * 0.65), canvas.width, Math.floor(canvas.height * 0.35));

	drawPalmTree(88, 15);

	for (var i = 1; i < 5; i++) {
		drawSkull(Math.floor(width * (i / 5)) - 3, 24, hotPink);
	}

	deadDelta = time - deadTime;
	var k = deadDelta < 4000 ? Math.floor(deadDelta *  (14 / 4000)) : 14;
	drawText(23, k, 'WHO ASKED?', hotPink);

	if (time - deadTime > 10000 || keys[27] || keys[13]) {
		endGame();
	}
};

// --- Island Dialogue

var drawFrameRight = function () {
	drawPixel(24, 7, '000000');
	for (var i = 7; i < 35; i++) {
		drawPixel(23, i, '000000');
	}
	for (var i = 23; i < 99; i++) {
		drawPixel(i, 35, '000000');
	}
};

var drawFrameLeft = function () {
	drawPixel(74, 7, '000000');
	for (var i = 7; i < 35; i++) {
		drawPixel(75, i, '000000');
	}
	for (var i = 1; i < 76; i++) {
		drawPixel(i, 35, '000000');
	}
};

var rastaBroFace = [
	[5,0,palmBrown],[6,0,palmBrown],[7,0,palmBrown],
	[1,1,palmBrown],[2,1,palmBrown],[3,1,palmBrown],[4,1,palmBrown],[5,1,palmBrown],[6,1,palmBrown],[7,1,palmBrown],[8,1,palmBrown],[9,1,palmBrown],[10,1,palmBrown],[11,1,palmBrown],
	[1,2,palmBrown],[3,2,palmBrown],[4,2,palmBrown],[5,2,palmBrown],[6,2,palmBrown],[7,2,palmBrown],[8,2,palmBrown],[9,2,palmBrown],[11,2,palmBrown],
	[0,3,palmBrown],[3,3,palmBrown],[4,3,seaGreen],[5,3,seaGreen],[6,3,seaGreen],[7,3,seaGreen],[8,3,seaGreen],[9,3,palmBrown],[12,3,palmBrown],
	[3,4,palmBrown],[4,4,'ffd5aa'],[5,4,'000000'],[6,4,'ffd5aa'],[7,4,'000000'],[8,4,'ffd5aa'],[9,4,palmBrown],
	[2,5,palmBrown],[4,5,'ffd5aa'],[5,5,'ffd5aa'],[6,5,'ffd5aa'],[7,5,'ffd5aa'],[8,5,'ffd5aa'],[10,5,palmBrown],
	[2,6,palmBrown],[4,6,'ffd5aa'],[5,6,'dfbcb6'],[6,6,'dfbcb6'],[7,6,'dfbcb6'],[8,6,'ffd5aa'],[10,6,palmBrown],
	[5,7,'ffd5aa'],[6,7,'ffd5aa'],[7,7,'ffd5aa']
];

var heroDudeFace = [
	[2,0,sandGold],[3,0,sandGold],[4,0,sandGold],
	[1,1,sandGold],[2,1,sandGold],[3,1,sandGold],[4,1,sandGold],[5,1,sandGold],
	[0,2,sandGold],[1,2,sandGold],[2,2,'dda366'],[3,2,'dda366'],[4,2,'dda366'],[5,2,sandGold],[6,2,sandGold],
	[0,3,sandGold],[1,3,'dda366'],[2,3,'000000'],[3,3,'dda366'],[4,3,'000000'],[5,3,'dda366'],[6,3,sandGold],
	[1,4,'dda366'],[2,4,'dda366'],[3,4,'dda366'],[4,4,'dda366'],[5,4,'dda366'],
	[1,5,'dda366'],[2,5,'dfbcb6'],[3,5,'dfbcb6'],[4,5,'dfbcb6'],[5,5,'dda366'],
	[2,6,'dda366'],[3,6,'dda366'],[4,6,'dda366']

];

var nextIslandDialogue = 0;
var nextIslandDialogueTime = time + 5000;
var dialogue = [
	(() => {
		drawText(26, 5, 'RASTA BRO:', seaGreen);
		drawText(26, 13, 'WOAH THOSE WERE', waterBlue);
		drawText(26, 21, 'SOME', waterBlue);
		drawText(46, 21, 'GNARL', hotPink);
		drawText(70, 21, 'MEGAS', waterBlue);
		drawText(26, 29, 'DUDE', waterBlue);
		drawFrameRight();
		drawSprite(5, 12, rastaBroFace);
	}),
	(() => {
		drawText(26, 5, 'RASTA BRO:', seaGreen);
		drawText(26, 13, 'GOOD THING YOU', waterBlue);
		drawText(26, 21, 'YOU HAVE SOME', waterBlue);
		drawText(26, 29, 'SICK SKILLZ', waterBlue);
		drawFrameRight();
		drawSprite(5, 12, rastaBroFace);
	}),
	(() => {
		drawText(2, 5, 'HERO DUDE:', sandGold);
		drawText(2, 13, 'I DONT THINK', waterBlue);
		drawText(2, 21, 'THOSE WERE', waterBlue);
		drawText(2, 29, 'REGULAR SHARKS BRO', waterBlue);
		drawFrameLeft();
		drawSprite(84, 13, heroDudeFace);
	}),
	(() => {
		drawText(2, 5, 'HERO DUDE:', sandGold);
		drawText(2, 13, 'I THINK THEY WERE', waterBlue);
		drawText(2, 21, 'SPACE MEGAS', hotPink);
		drawFrameLeft();
		drawSprite(84, 13, heroDudeFace);
	}),
	(() => {
		drawText(26, 5, 'RASTA BRO:', seaGreen);
		drawText(26, 13, 'WOAH THATS TOTALLY', waterBlue);
		drawText(26, 21, 'NOT CHILL!', waterBlue);
		drawText(26, 29, 'RONI NOT HAPPY', waterBlue);
		drawFrameRight();
		drawSprite(5, 12, rastaBroFace);
	}),
	(() => {
		drawText(26, 5, 'RASTA BRO:', seaGreen);
		drawText(26, 13, 'MEGA SHARKS', hotPink);
		drawText(26, 21, 'HERE IN NYC', waterBlue);
		drawText(26, 29, 'SINCE 89 DUDE!', waterBlue);
		drawFrameRight();
		drawSprite(5, 12, rastaBroFace);
	}),
	(() => {
		drawText(2, 5, 'HERO DUDE:', sandGold);
		drawText(2, 13, 'WHAT WOULD MAKE', waterBlue);
		drawText(2, 21, 'THEM COME BACK', waterBlue);
		drawText(2, 29, 'TO BALI NOW BRO?', waterBlue);
		drawFrameLeft();
		drawSprite(84, 13, heroDudeFace);
	}),
	(() => {
		drawText(26, 5, 'RASTA BRO:', seaGreen);
		drawText(26, 13, 'IM NOT SURE DUDE', waterBlue);
		drawText(26, 21, 'BUT I KNOW RONI', waterBlue);
		drawText(26, 29, 'MIGHT KNOW', waterBlue);
		drawFrameRight();
		drawSprite(5, 12, rastaBroFace);
	}),
	(() => {
		drawText(26, 5, 'RASTA BRO:', seaGreen);
		drawText(26, 13, 'YOU SHOULD TALK TO', waterBlue);
		drawText(26, 21, 'THE v RONIS', hotPink);
		drawFrameRight();
		drawSprite(5, 12, rastaBroFace);
	}),
	(() => {
		drawText(26, 5, 'RASTA BRO:', seaGreen);
		drawText(26, 13, 'THEYRE IN THE', waterBlue);
		drawText(26, 21, 'SECRET LAB', hotPink);
		drawText(26, 29, 'EATING POOP', waterBlue);
		drawFrameRight();
		drawSprite(5, 12, rastaBroFace);
	}),
	(() => {
		drawText(26, 5, 'RASTA BRO:', seaGreen);
		drawText(26, 13, 'LOOK OUT FOR', waterBlue);
		drawText(26, 21, 'THE RABID RONIS', hotPink);
		drawText(26, 29, 'ON THE WAY', waterBlue);
		drawFrameRight();
		drawSprite(5, 12, rastaBroFace);
	}),
	(() => {
		drawText(2, 5, 'HERO DUDE:', sandGold);
		drawText(2, 13, 'RIGHT ON BRO!', waterBlue);
		drawText(2, 21, 'ILL HEAD THERE', waterBlue);
		drawText(2, 29, 'RIGHT AWAY', waterBlue);
		drawFrameLeft();
		drawSprite(84, 13, heroDudeFace);
	})
];
var goToIslandDialogue = function () {
	startTime = time;
	nextIslandDialogue = 0;
	nextIslandDialogueTime = time + 5000;
	gameMode = 4;
};
var islandDialogue = function () {
	if (startDelta > 500) {
		if (keys[13]) {
			// If Enter pressed advance to next stage
			goToIslandMonkeys();
		} else if (keys[38]) {
			// If Up pressed skip to next dialogue
			nextIslandDialogueTime = time;
		}
	}

	// Draw Current Dialogue
	dialogue[nextIslandDialogue]();

	if (time > nextIslandDialogueTime) {
		nextIslandDialogue++;
		nextIslandDialogueTime = time + 5000;
	}

	// Advance to next stage
	if (!dialogue[nextIslandDialogue]) {
		goToIslandMonkeys();
	}
};

var monkeysCamera = {
	x: 0,
	marginLeft: 20,
	marginRight: 40
};

var monkeysPlayer = {
	health: 6,
	x: 10,
	y: 30,
	initialY: 30,
	velocityY: 0,
	direction: 0,
	width: 7,
	nextMoveTime: time,
	stillSprite: [
		                              [2,0,'fbd230'],[3,0,'fbd230'],[4,0,'fbd230'],
		                              [2,1,'ffd5aa'],[3,1,'ffd5aa'],[4,1,'ffd5aa'],
		               [1,2,'ffffff'],[2,2,'ffffff'],[3,2,'ffffff'],[4,2,'ffffff'],[5,2,'ffffff'],
		               [1,3,'ffd5aa'],[2,3,'ffffff'],[3,3,'ffffff'],[4,3,'ffffff'],[5,3,'ffd5aa'],
		                              [2,4,'00cc22'],[3,4,'00cc22'],[4,4,'00cc22'],
		                              [2,5,'ffd5aa'],               [4,5,'ffd5aa'],
		                              [2,6,'ffd5aa'],               [4,6,'ffd5aa']
	],
	leftSpriteA: [
		                              [2,0,'fbd230'],[3,0,'fbd230'],[4,0,'fbd230'],
		                              [2,1,'ffd5aa'],[3,1,'ffd5aa'],[4,1,'fbd230'],
		               [1,2,'ffffff'],[2,2,'ffffff'],[3,2,'ffffff'],[4,2,'ffffff'],[5,2,'ffffff'],
		               [1,3,'ffd5aa'],[2,3,'ffffff'],[3,3,'ffffff'],[4,3,'ffffff'],[5,3,'ffd5aa'],
		                              [2,4,'00cc22'],[3,4,'00cc22'],[4,4,'00cc22'],
		                              [2,5,'ffd5aa'],               [4,5,'ffd5aa'],
		                                                            [4,6,'ffd5aa']
	],
	leftSpriteB: [
		                              [2,0,'fbd230'],[3,0,'fbd230'],[4,0,'fbd230'],
		                              [2,1,'ffd5aa'],[3,1,'ffd5aa'],[4,1,'fbd230'],
		               [1,2,'ffffff'],[2,2,'ffffff'],[3,2,'ffffff'],[4,2,'ffffff'],[5,2,'ffffff'],
		               [1,3,'ffd5aa'],[2,3,'ffffff'],[3,3,'ffffff'],[4,3,'ffffff'],[5,3,'ffd5aa'],
		                              [2,4,'00cc22'],[3,4,'00cc22'],[4,4,'00cc22'],
		                              [2,5,'ffd5aa'],               [4,5,'ffd5aa'],
		                              [2,6,'ffd5aa']
	],
	rightSpriteA: [
		                              [2,0,'fbd230'],[3,0,'fbd230'],[4,0,'fbd230'],
		                              [2,1,'fbd230'],[3,1,'ffd5aa'],[4,1,'ffd5aa'],
		               [1,2,'ffffff'],[2,2,'ffffff'],[3,2,'ffffff'],[4,2,'ffffff'],[5,2,'ffffff'],
		               [1,3,'ffd5aa'],[2,3,'ffffff'],[3,3,'ffffff'],[4,3,'ffffff'],[5,3,'ffd5aa'],
		                              [2,4,'00cc22'],[3,4,'00cc22'],[4,4,'00cc22'],
		                              [2,5,'ffd5aa'],               [4,5,'ffd5aa'],
		                              [2,6,'ffd5aa']
	],
	rightSpriteB: [
		                              [2,0,'fbd230'],[3,0,'fbd230'],[4,0,'fbd230'],
		                              [2,1,'fbd230'],[3,1,'ffd5aa'],[4,1,'ffd5aa'],
		               [1,2,'ffffff'],[2,2,'ffffff'],[3,2,'ffffff'],[4,2,'ffffff'],[5,2,'ffffff'],
		               [1,3,'ffd5aa'],[2,3,'ffffff'],[3,3,'ffffff'],[4,3,'ffffff'],[5,3,'ffd5aa'],
		                              [2,4,'00cc22'],[3,4,'00cc22'],[4,4,'00cc22'],
		                              [2,5,'ffd5aa'],               [4,5,'ffd5aa'],
		                                                            [4,6,'ffd5aa']
	],
	tick: function () {
		// Get player input
		this.direction = 0;
		if (keys[37] && keys[39]) {
			// no-op
		} else if (keys[37]) {
			// Move left
			this.direction = -1;
		} else if (keys[39]) {
			// Move right
			this.direction = 1;
		}

		if (monkeysPlayer.y >= monkeysPlayer.initialY) {
			if (keys[38]) {
			// Jump if on ground
				monkeysPlayer.velocityY = 150;
			}
			// Stop down motion if already on ground
			monkeysPlayer.velocityY = Math.max(0, monkeysPlayer.velocityY);
	  } else {
			monkeysPlayer.velocityY = monkeysPlayer.velocityY - (frameDelta / 1000) * 500;
		}

		var collisionHull = this.getSprite().map((coord) => {
			return [
				this.x + coord[0], this.y + coord[1]
			];
		});

		if (this.nextMoveTime <= time) {
			this.nextMoveTime = time + 40;
			monkeysPlayer.x = Math.min(Math.max(monkeysPlayer.x + this.direction, 0), monkeysStageWidth - monkeysPlayer.width);
			if (monkeysPlayer.velocityY !== 0) {
				monkeysPlayer.y = Math.min(monkeysPlayer.initialY, Math.floor(monkeysPlayer.y - (monkeysPlayer.velocityY * (frameDelta / 1000))));
			}
		}

		return collisionHull;
	},
	getSprite: function () {
		switch(this.direction) {
			case -1:
				if (Math.floor(time / 100) % 2 === 0) {
					return this.leftSpriteA;
				} else {
					return this.leftSpriteB;
				}
				break;
			case 1:
				if (Math.floor(time / 100) % 2 === 0) {
					return this.rightSpriteA;
				} else {
					return this.rightSpriteB;
				}
				break;
			default:
				return this.stillSprite;
		}
	}
};

var cloudA = {
	width: 8,
	sprite: [
		                              [2,0,'ffffff'],                                             [6,0,'ffffff'],
		               [1,1,'ffffff'],[2,1,'ffffff'],[3,1,'ffffff'],               [5,1,'ffffff'],[6,1,'ffffff'],[7,1,'ffffff'],
		[0,2,'ffffff'],[1,2,'ffffff'],[2,2,'ffffff'],[3,2,'ffffff'],[4,2,'ffffff'],[5,2,'ffffff'],[6,2,'ffffff'],[7,2,'ffffff'],
		[0,3,'ffffff'],[1,3,'ffffff'],[2,3,'ffffff'],[3,3,'ffffff'],[4,3,'ffffff'],[5,3,'ffffff'],[6,3,'ffffff'],[7,3,'ffffff'],
		               [1,4,'ffffff'],[2,4,'ffffff'],               [4,4,'ffffff'],[5,4,'ffffff'],[6,4,'ffffff']
	]
};

var cloudB = {
	width: 4,
	sprite: [
		               [1,0,'ffffff'],[2,0,'ffffff'],
		[0,1,'ffffff'],[1,1,'ffffff'],[2,1,'ffffff'],[3,1,'ffffff'],
		               [1,2,'ffffff'],[2,2,'ffffff']
	]
};

var cloudC = {
	width: 8,
	sprite: [
		               [1,0,'ffffff'],[2,0,'ffffff'],[3,0,'ffffff'],               [5,0,'ffffff'],[6,0,'ffffff'],
		[0,1,'ffffff'],[1,1,'ffffff'],[2,1,'ffffff'],[3,1,'ffffff'],[4,1,'ffffff'],[5,1,'ffffff'],[6,1,'ffffff'],[7,1,'ffffff'],
		               [1,2,'ffffff'],[2,2,'ffffff'],[3,2,'ffffff'],               [5,2,'ffffff'],[6,2,'ffffff']
	]
};
var monkeyBrown = '721414';
var monkeyA = {
	width: 6,
	sprite: [
		                [1,0,monkeyBrown],[2,0,monkeyBrown],[3,0,monkeyBrown],             [5,0,monkeyBrown],
		                [1,1,'000000'],[2,1,monkeyBrown],[3,1,'000000'],               [5,1,monkeyBrown],
		[0,2,monkeyBrown],[1,2,'ffffff'],[2,2,'ffffff'],[3,2,'ffffff'],[4,2,monkeyBrown],
		[0,3,monkeyBrown],[1,3,monkeyBrown],[2,3,monkeyBrown],[3,3,monkeyBrown],[4,3,monkeyBrown],
		                [1,4,monkeyBrown],                [3,4,monkeyBrown]
	]
};

var monkeyB = {
	width: 7,
	leftSprite: [
		                  [1,0,monkeyBrown],[2,0,monkeyBrown],
		                  [1,1,'000000'],[2,1,monkeyBrown],[3,1,monkeyBrown],            [5,1,monkeyBrown],
		                  [1,2,'ffffff'],[2,2,monkeyBrown],[3,2,monkeyBrown],            [5,2,monkeyBrown],
		                  [1,3,monkeyBrown],[2,3,monkeyBrown],[3,3,monkeyBrown],[4,3,monkeyBrown],
		[0,4,monkeyBrown],[1,4,monkeyBrown],                  [3,4,monkeyBrown]
	],
	rightSprite: [
		                  [4,0,monkeyBrown],[3,0,monkeyBrown],
		                  [4,1,'000000'],[3,1,monkeyBrown],[2,1,monkeyBrown],            [0,1,monkeyBrown],
		                  [4,2,'ffffff'],[3,2,monkeyBrown],[2,2,monkeyBrown],            [0,2,monkeyBrown],
		                  [4,3,monkeyBrown],[3,3,monkeyBrown],[2,3,monkeyBrown],[1,3,monkeyBrown],
		[5,4,monkeyBrown],[4,4,monkeyBrown],                  [2,4,monkeyBrown]
	]
};

var heartFull = [
	               [1,0,'000000'],               [3,0,'000000'],
	[0,1,'000000'],[1,1,'ff0000'],[2,1,'000000'],[3,1,'ff0000'],[4,1,'000000'],
	[0,2,'000000'],[1,2,'ff0000'],[2,2,'ff0000'],[3,2,'ff0000'],[4,2,'000000'],
	               [1,3,'000000'],[2,3,'ff0000'],[3,3,'000000'],
	                              [2,4,'000000']
];

var heartHalf = [
	               [1,0,'000000'],               [3,0,'000000'],
	[0,1,'000000'],[1,1,'ff0000'],[2,1,'000000'],[3,1,'ffffff'],[4,1,'000000'],
	[0,2,'000000'],[1,2,'ff0000'],[2,2,'ffffff'],[3,2,'ffffff'],[4,2,'000000'],
	               [1,3,'000000'],[2,3,'ffffff'],[3,3,'000000'],
	                              [2,4,'000000']
];

var heartEmpty = [
	               [1,0,'000000'],               [3,0,'000000'],
	[0,1,'000000'],[1,1,'ffffff'],[2,1,'000000'],[3,1,'ffffff'],[4,1,'000000'],
	[0,2,'000000'],[1,2,'ffffff'],[2,2,'ffffff'],[3,2,'ffffff'],[4,2,'000000'],
	               [1,3,'000000'],[2,3,'ffffff'],[3,3,'000000'],
	                              [2,4,'000000']
];

var boardBackground = [
	               [1,0,'000000'],
	[0,1,'000000'],[1,1,hotPink],[2,1,'000000'],
	[0,2,'000000'],[1,2,hotPink],[2,2,'000000'],
	[0,3,'000000'],[1,3,hotPink],[2,3,'000000'],
	[0,4,'000000'],[1,4,hotPink],[2,4,'000000'],
	[0,5,'000000'],[1,5,hotPink],[2,5,'000000'],
	[0,6,'000000'],[1,6,hotPink],[2,6,'000000'],
];

var monkeys = [];

var spawnJumpMonkey = function (x, y, secondsBetweenJumps) {
	return {
		x: x,
		y: y,
		initialY: y,
		velocityY: 0,
		width: monkeyA.width,
		getSprite: function () {
			return monkeyA.sprite;
		},
		nextJumpTime: time + Math.random() * secondsBetweenJumps * 1000,
		jumpInterval: secondsBetweenJumps * 1000,
		tick: function () {
			if (this.y >= this.initialY) {
				if (time >= this.nextJumpTime) {
					this.nextJumpTime = time + this.jumpInterval;
					this.velocityY = 150;
				}
				this.velocityY = Math.max(0, this.velocityY);
			} else {
				this.velocityY = this.velocityY - (frameDelta / 1000) * 400;
			}

			var oldY = this.y;
			this.y = Math.min(this.initialY, Math.floor(this.y - (this.velocityY * (frameDelta / 1000))));

			var collisionHull = this.getSprite().map((coord) => {
				return [
					this.x + coord[0], this.y + coord[1]
				];
			})
			if (oldY !== this.y) {
				var i = oldY;
				while (i !== this.y) {
					i += this.y > i ? 1 : -1;
					collisionHull = collisionHull.concat(this.getSprite().map((coord) => {
						return [
							this.x + coord[0], i + coord[1]
						];
					}));
				}
			}

			return collisionHull;
		}
	};
};

var spawnRunMonkey = function (x, y, runDistance, secondsBetweenMoves) {
	return {
		x: x,
		y: y,
		minX: x,
		maxX: x + runDistance,
		facingLeft: false,
		width: monkeyB.width,
		getSprite: function () {
			return this.facingLeft ? monkeyB.leftSprite : monkeyB.rightSprite;
		},
		nextMoveTime: time + Math.random() * secondsBetweenMoves * 1000,
		moveInterval: secondsBetweenMoves * 1000,
		tick: function () {
			var collisionHull = this.getSprite().map((coord) => {
				return [
					this.x + coord[0], this.y + coord[1]
				];
			});

			if (time >= this.nextMoveTime) {
				this.nextMoveTime = time + this.moveInterval;
				var oldX = this.x;
				if (this.facingLeft) {
					this.x = this.x - 1;
				} else {
					this.x = this.x + 1;
				}

				if (this.x >= this.maxX) {
					this.facingLeft = true;
				} else if (this.x <= this.minX) {
					this.facingLeft = false;
				}

				if (oldX !== this.x) {
					var i = oldX;
					while (i !== this.x) {
						i += this.x > i ? 1 : -1;
						collisionHull = collisionHull.concat(this.getSprite().map((coord) => {
							return [
								i + coord[0], this.y + coord[1]
							];
						}));
					}
				}
			}
			return collisionHull;
		}
	};
};

var healthPickups = [];
var monkeysBackground = [];
var monkeysStageWidth = 1000;
var goToIslandMonkeys = function () {
	// Reset game state
	startTime = time;
	gameMode = 5;
	monkeysCamera.x = 100;
	monkeysPlayer.x = 10;
	monkeysPlayer.y = 30;
	monkeysPlayer.health = 6;
	monkeys = [];

	// Plants and bushes
	monkeysBackground = [
	{
		x: 6,
		y: 30,
		width: 3,
		sprite: boardBackground
	},
	{
		x: -3,
		y: 33,
		width: 12,
		sprite: surfWave
	},
	{
		x: -4,
		y: 30,
		width: 12,
		sprite: surfWave
	},
	{
		x: 30,
		y: 25,
		width: 8,
		sprite: palmTree
	},
	{
		x: 50,
		y: 33,
		width: 8,
		sprite: palmTree
	},
	{
		x: 110,
		y: 33,
		width: 8,
		sprite: palmTree
	},
	{
		x: 171,
		y: 25,
		width: 8,
		sprite: palmTree
	},
	{
		x: 180,
		y: 25,
		width: 8,
		sprite: palmTree
	},
	{
		x: 250,
		y: 25,
		width: 8,
		sprite: palmTree
	},
	{
		x: 370,
		y: 25,
		width: 8,
		sprite: palmTree
	},
	{
		x: 380,
		y: 25,
		width: 8,
		sprite: palmTree
	},
	{
		x: 384,
		y: 25,
		width: 8,
		sprite: palmTree
	},
	{
		x: 450,
		y: 33,
		width: 8,
		sprite: palmTree
	},
	{
		x: 505,
		y:25,
		width: 8,
		sprite: palmTree
	},
	{
		x: 508,
		y:27,
		width: 8,
		sprite: palmTree
	},
	{
		x: 512,
		y:25,
		width: 8,
		sprite: palmTree
	},
	{
		x: 560,
		y: 33,
		width: 8,
		sprite: palmTree
	},
	{
		x: 651,
		y: 34,
		width: 3,
		sprite: boardBackground
	},
	{
		x: 651,
		y: 25,
		width: 8,
		sprite: palmTree
	},
	{
		x: 650,
		y: 33,
		width: 8,
		sprite: palmTree
	},
	{
		x: 720,
		y: 33,
		width: 8,
		sprite: palmTree
	},
	{
		x: 800,
		y: 25,
		width: 8,
		sprite: palmTree
	},
	{
		x: 870,
		y:25,
		width: 8,
		sprite: palmTree
	},
	{
		x: 874,
		y:27,
		width: 8,
		sprite: palmTree
	},
	{
		x: 878,
		y:25,
		width: 8,
		sprite: palmTree
	},
	{
		x: 905,
		y:25,
		width: 8,
		sprite: palmTree
	},
	{
		x: 908,
		y:27,
		width: 8,
		sprite: palmTree
	},
	{
		x: 912,
		y:25,
		width: 8,
		sprite: palmTree
	},
	{
		x: 945,
		y:25,
		width: 8,
		sprite: palmTree
	},
	{
		x: 948,
		y:27,
		width: 8,
		sprite: palmTree
	},
	{
		x: 960,
		y:25,
		width: 8,
		sprite: palmTree
	}];

	healthPickups = [
		{
			x: 540,
			y: 31,
			width: 5,
			sprite: heartFull,
			active: true
		},
		{
			x: 550,
			y: 31,
			width: 5,
			sprite: heartFull,
			active: true
		}
	]

	// Dynamic Weather
	var numClouds = frameRandom * 20;
	for (var i = 0; i < numClouds; i++) {
		var cloud = {
			x: Math.floor(Math.random() * monkeysStageWidth),
			y: Math.floor(Math.random() * 15)
		};
		switch (Math.floor(Math.random() * 3)) {
			case 0:
				cloud.width = cloudA.width;
				cloud.sprite = cloudA.sprite;
				break;
			case 1:
				cloud.width = cloudB.width;
				cloud.sprite = cloudB.sprite;
				break;
			default:
				cloud.width = cloudC.width;
				cloud.sprite = cloudC.sprite;
				break;
		}
		monkeysBackground.push(cloud);
	}

	// Enemies
	monkeys.push(spawnRunMonkey(60, 32, 5, 0.2));
	monkeys.push(spawnRunMonkey(110, 32, 100, 0.05));
	monkeys.push(spawnRunMonkey(240, 32, 30, 0.1));
	monkeys.push(spawnRunMonkey(240, 32, 20, 0.05));
	monkeys.push(spawnRunMonkey(380, 32, 40, 0.2));
	monkeys.push(spawnRunMonkey(410, 32, 40, 0.15));
	monkeys.push(spawnRunMonkey(510, 32, 5, 0.2));
	monkeys.push(spawnRunMonkey(570, 32, 5, 0.1));
	monkeys.push(spawnRunMonkey(585, 32, 10, 0.2));
	monkeys.push(spawnRunMonkey(600, 32, 5, 0.3));
	monkeys.push(spawnRunMonkey(700, 32, 50, 0.05));
	monkeys.push(spawnJumpMonkey(120, 32, 2));
	monkeys.push(spawnJumpMonkey(180, 32, 1));
	monkeys.push(spawnJumpMonkey(321, 32, 1.5));
	monkeys.push(spawnJumpMonkey(310, 32, 2));
	monkeys.push(spawnJumpMonkey(405, 32, 1.6));
	monkeys.push(spawnJumpMonkey(805, 32, 1.6));
	monkeys.push(spawnJumpMonkey(825, 32, 1));
	monkeys.push(spawnJumpMonkey(845, 32, 1.4));
	monkeys.push(spawnJumpMonkey(865, 32, 1.1));
	monkeys.push(spawnJumpMonkey(885, 32, 0.9));

};

// --- Island Monkey Game Mode

var nextCollisionDetectTime = time;
var injuryBoxEndTime = time;
var islandMonkeys = function () {

	// Update world state
	var playerCollisionHull = monkeysPlayer.tick();

	for (var i = 0; i < healthPickups.length; i++) {
		if (healthPickups[i].active && monkeysPlayer.health < 6) {
			var healthCoords = healthPickups[i].sprite.map(function (coord) {
				return [
					healthPickups[i].x + coord[0], healthPickups[i].y + coord[1]
				]
			})
			if (healthCoords.some(function (healthCoord) {
				return playerCollisionHull.some(function (playerCoord) {
					return healthCoord[0] === playerCoord[0] && healthCoord[1] === playerCoord[1]
				})
			})) {
				healthPickups[i].active = false;
				monkeysPlayer.health = Math.min(6, monkeysPlayer.health + 2);
			}
		}
	}

	var monkeyCollisionHulls = []
	for (var i = 0; i < monkeys.length; i++) {
		monkeyCollisionHulls = monkeyCollisionHulls.concat(monkeys[i].tick());
	}

	// Collide player and monkeys every 250ms
	if (time >= nextCollisionDetectTime) {
		if (monkeyCollisionHulls.some(function (monkeyCoord) {
			return playerCollisionHull.some(function (playerCoord) {
				return monkeyCoord[0] === playerCoord[0] && monkeyCoord[1] == playerCoord[1];
			});
		})) {
			monkeysPlayer.health = monkeysPlayer.health - 1;
			nextCollisionDetectTime = time + 250;
			injuryBoxEndTime = time + 100;
		}
	}

	if (monkeysPlayer.health <= 0) {
		goToKillScreen();
	}

	// Finish stage
	if (monkeysPlayer.x >= monkeysStageWidth - monkeysPlayer.width) {
		// To Be Continued
		gameMode = 6;
	}

	// Move camera
	if (monkeysPlayer.x < (monkeysCamera.x + monkeysCamera.marginLeft)) {
		monkeysCamera.x = Math.max(monkeysCamera.x - 1, 0);
	} else if (monkeysPlayer.x + monkeysPlayer.width > (monkeysCamera.x + width - monkeysCamera.marginRight)) {
		monkeysCamera.x = Math.min(monkeysStageWidth - width, monkeysCamera.x + 1);
	}

	// Render world

	// Draw background objects
	for (var i = 0; i < monkeysBackground.length; i++) {
		if (monkeysBackground[i].x + monkeysBackground[i].width > monkeysCamera.x && monkeysBackground[i].x < monkeysCamera.x + width) {
			drawSprite(monkeysBackground[i].x - monkeysCamera.x, monkeysBackground[i].y, monkeysBackground[i].sprite);
		}
	}

	// Draw ground
	for (var i = 0; i < width; i++) {
		for(var j = 37; j < height; j++) {
			drawPixel(i, j, sandGold);
		}
	}

	// Draw monkeys
	for (var i = 0; i < monkeys.length; i++) {
		if (monkeys[i].x + monkeys[i].width > monkeysCamera.x && monkeys[i].x < monkeysCamera.x + width) {
			drawSprite(monkeys[i].x - monkeysCamera.x, monkeys[i].y, monkeys[i].getSprite());
		}
	}

	// Draw health pickups
	for (var i = 0; i < healthPickups.length; i++) {
		if (healthPickups[i].active && healthPickups[i].x + healthPickups[i].width > monkeysCamera.x && healthPickups[i].x < monkeysCamera.x + width) {
			drawSprite(healthPickups[i].x - monkeysCamera.x, healthPickups[i].y, healthPickups[i].sprite);
		}
	}

	// Draw player
	drawSprite(monkeysPlayer.x - monkeysCamera.x, monkeysPlayer.y, monkeysPlayer.getSprite());

	// Draw Health
	var heart1 = heartEmpty;
	var heart2 = heartEmpty;
	var heart3 = heartEmpty;
	if (monkeysPlayer.health >= 1) {
		heart1 = heartHalf;
	}
	if (monkeysPlayer.health >= 2) {
		heart1 = heartFull;
	}
	if (monkeysPlayer.health >= 3) {
		heart2 = heartHalf;
	}
	if (monkeysPlayer.health >= 4) {
		heart2 = heartFull;
	}
	if (monkeysPlayer.health >= 5) {
		heart3 = heartHalf;
	}
	if (monkeysPlayer.health >= 6) {
		heart3 = heartFull;
	}
	drawSprite(82, 1, heart1);
	drawSprite(88, 1, heart2);
	drawSprite(94, 1, heart3);

	// Draw injury warning box
	if (time <= injuryBoxEndTime) {
		for(var i = 0; i < width; i++) {
			drawPixel(i, 0, 'ff0000');
			drawPixel(i, height - 1, 'ff0000');
		}
		for(var i = 1; i < height - 1; i++) {
			drawPixel(0, i, 'ff0000');
			drawPixel(width - 1, i, 'ff0000');
		}
	}
};

// --- To be continued screen for WIP stages
var toBeContinued = function () {
	var colors = [sandGold, seaGreen, waterBlue, hotPink];
	var k = 0;
	for (var i = 2; i < width - 2; i += 8) {
		for (var j = 0; j < height; j += 8) {
			drawSkull(i, j, colors[(Math.floor(time / 100) + ++k) % colors.length]);
		}
	}
	for(var i = 19; i < 80; i++) {
		for(var j = 13; j < 20; j++) {
			drawPixel(i, j, '000000');
		}
	}
	drawText(20, 14, 'TO BE CONTINUED', hotPink);
};

var gameLoop = function () {

	// Get Delta Time
	time = performance.now();
	frameDelta = time  - lastTime;
	lastTime = time;
	frameRandom = Math.random();

	// Clear Canvas
	ctx.fillStyle = '#' + skyBlue;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	if (gameMode === 0) {
		deadDelta = time - deadTime;
		if (deadDelta > 500 && keys[13]) {
			if (konami) {
				goToIslandDialogue();
			} else {
				startGame();
			}
		}
		var k = deadDelta < 1000 ? Math.floor(deadDelta * (8 / 1000)) : 8;
		drawText(24, k, 'MEGALODON X', 'fb3494');
		drawText(23, k + 8, 'THE RONI QUEST', 'fb3494');

		if (deadDelta > 4000 && Math.floor(time / 500) % 2 === 0) {
			drawText(10, 24, 'PRESS ENTER TO START', '78c29e');
		}

		var m = Math.floor(time / 75) % 8;
		for (var l = 0; l < width; l += 8) {
			drawWave(l, height - 8, m, '58a3d5');
		}
		m = Math.floor(time / 100) % 8;
		for (var l = 0; l < width; l += 8) {
			drawWave(l, height - 10, m, 'cef3fd');
		}
		for (var l = 0; l < width; l += 8) {
			drawWave(l, height - 9, m, '58a3d5');
		}
		for (var l = 0; l < width; l += 8) {
			drawWave(l, height - 8, m, '3b9b9c');
		}
		m = Math.floor(time / 10) % 8;
		for (var l = 0; l < width; l += 8) {
			drawWave(l, height - 4, m, 'cef3fd');
		}
	} else {
		startDelta = time - startTime;
		if (keys[27]) {
			endGame();
		}

		switch (gameMode) {
			case 1:
				getReady();
				break; // Woah sick breaks dude
			case 2:
				jumpGame();
				break;
			case 3:
				killScreen();
				break;
			case 4:
				islandDialogue();
				break;
			case 5:
				islandMonkeys();
				break;
			case 6:
				toBeContinued();
				break;
			default:
				endGame();
		}
	}

	// Loop
	window.requestAnimationFrame(gameLoop);
};

var handleKeyDown = function (event) {
	keys[event.keyCode] = true;
	// Disable our game keys from moving the page around etc
	if ([27,13,37,38,39,40].indexOf(event.keyCode) >=0) {
		event.preventDefault();
	}
};

var konamiSequence = [38,38,40,40,37,39,37,39,66,65];
var codeEntered = [];
var handleKeyUp = function (event) {
	delete keys[event.keyCode];

	// Cheat Code
	if (gameMode === 0) {
		if (konamiSequence[codeEntered.length] === event.keyCode) {
			codeEntered.push(event.keyCode);
			if (codeEntered.length === konamiSequence.length) {
				for (var i = 0; i < codeEntered.length; i++) {
					if (codeEntered[i] !== konamiSequence[i]) {
						return;
					}
				}
				konami = true;
				codeEntered = [];
			}
		} else {
			codeEntered = [];
		}
	}
};

window.addEventListener('keydown', handleKeyDown, true);
window.addEventListener('keyup', handleKeyUp, true);

window.requestAnimationFrame(gameLoop);

		</script>
