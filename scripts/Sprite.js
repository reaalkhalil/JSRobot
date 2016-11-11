var mozart = require('mozart');

var Sprite = mozart(function(prototype, _, _protected, __, __private) {
	prototype.init = function(options) {
		__(this).frameIndex = 0;
		__(this).tickCount = 0;
		__(this).ticksPerFrame = options.ticksPerFrame || 0;
		__(this).numberOfFrames = options.numberOfFrames || 1;
		__(this).context = options.context;
		__(this).destwidth = options.destwidth;
		__(this).destheight = options.destheight;
		__(this).width = options.width;
		__(this).height = options.height;
		__(this).image = options.image;
		__(this).loop = options.loop;
		__(this).x = options.x;
		__(this).y = options.y;
		__(this).r = options.r || 0;
		__(this).visible = options.visible || true;
	};

	prototype.getInfo = function(){
		var info = {};
		info.x = __(this).x;
		info.y = __(this).y;
		info.w = __(this).destwidth;
		info.h = __(this).destheight;
		info.v = __(this).visible;
		return info;
	};

	__private.render = function () {
			// universal frame index?? probably not
		var px = 0, py = 0;
		if(__(this).container){
			px = __(this).container.getK().x;
			py = __(this).container.getK().y;
		}
		if(__(this).r!==0){
			__(this).context.save(); 
			__(this).context.translate(__(this).x + px, __(this).y + py); 
			__(this).context.rotate(__(this).r);
			px = -__(this).x ;
			py = -__(this).y ;
		}
		__(this).context.drawImage(
		__(this).image,
		__(this).frameIndex * __(this).width / __(this).numberOfFrames,
		0,
		__(this).width / __(this).numberOfFrames,
		__(this).height,
		__(this).x + px - __(this).destwidth/2,
		__(this).y + py - __(this).destheight/2,
		__(this).destwidth,
		__(this).destheight);
		if(__(this).r!==0){__(this).context.restore();}
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
	};

	prototype.getParentX = function(){
		console.log(__(this).container.getX());
	};
	// this should change:
	prototype.setParent = function(a){
		__(this).container = a;
	};
});

