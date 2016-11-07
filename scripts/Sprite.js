var mozart = require('mozart');

var Sprite = mozart(function(prototype, _, _protected, __, __private) {
	prototype.init = function(options) {
		__(this).frameIndex = 0,
		__(this).tickCount = 0,
		__(this).ticksPerFrame = options.ticksPerFrame || 0;
		__(this).numberOfFrames = options.numberOfFrames || 1;
		__(this).context = options.context;
		__(this).destwidth = options.destwidth;
		__(this).destheight = options.destheight;
		__(this).width = options.width;
		__(this).height = options.height;
		__(this).image = options.image;
		__(this).loop = options.loop;
		__(this).x = options.x - options.destwidth / 2;
		__(this).y = options.y - options.destheight / 2;
		__(this).hidden = options.hidden || true;
		elements.push(this); // remove this later
	};

	__private.render = function () {
			// universal frame index?? probably not
		var px = 0, py = 0;
		if(__(this).container){
			px = __(this).container.getX();
			py = __(this).container.getY();
		}
		__(this).context.drawImage(
		__(this).image,
		__(this).frameIndex * __(this).width / __(this).numberOfFrames,
		0,
		__(this).width / __(this).numberOfFrames,
		__(this).height,
		__(this).x + px,
		__(this).y + py,
		__(this).destwidth,
		__(this).destheight);
	};
	__private.update = function () {
		if(__(this).numberOfFrames == 1){return;}
			__(this).tickCount += 1;
		if (__(this).tickCount > __(this).ticksPerFrame) {
			__(this).tickCount = 0;
			if (__(this).frameIndex < __(this).numberOfFrames - 1) {
				__(this).frameIndex += 1;
			} else if (__(this).loop) {
				__(this).frameIndex = 0;
			}
		}
	};

	prototype.redraw = function(){
		__(this).update();
		__(this).render();
	}

	prototype.getParentX = function(){
		console.log(__(this).container.getX());
	};
	prototype.setParent = function(a){
		__(this).container = a;
	};
});

//sc = new SpriteContainer(3);

//sc.addSprites(sp);
//sc.setX(5);
//console.log(sc.getX());
//sp.getParentX();

