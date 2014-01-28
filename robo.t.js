var RBT = {
	$: function(selector, el) {  
		if (!el) {el = document;}  
		return el.querySelector(selector);  
	},
	roundRect: function(context, x, y, w, h, r) {
		if (w < 2 * r) r = w / 2;
		if (h < 2 * r) r = h / 2;
		context.beginPath();
		context.moveTo(x+r, y);
		context.arcTo(x+w, y,   x+w, y+h, r);
		context.arcTo(x+w, y+h, x,   y+h, r);
		context.arcTo(x,   y+h, x,   y,   r);
		context.arcTo(x,   y,   x+w, y,   r);
		context.closePath();
		return context;
	},
	setCssVendorPrefixed: function(el, property, val) {
		var vendors = ['ms','moz','webkit','o'];
		for(var x = 0; x < vendors.length; ++x) {
			el.style["-"+vendors[x]+"-" + property] = val;
		}
	},
	init: function(o) {
		o.canvas = RBT.$("#" + o.canvasId);
		o.canvas.width = 400;
		o.canvas.height = 280;
		RBT.setCssVendorPrefixed(o.canvas, "transform", "scale(" + (o.scale || 1) + ")");
		o.context = o.canvas.getContext('2d');						
		RBT.robot.create(o).loop();
	}
};


RBT.robot = {
  create: function create(o) {
	// defaults
	var	defaultPalette = {background: "#eee",fill: "#6b6b6b", stroke: "#454343", eye_fill: ["#38282d", "#fc0", "f00"]},
	defaultComponents = [
		{type: "head", x: 150, y: 20, w: 100, h: 60, r: 5},
		{type: "eye", side: "L", x: 160, y: 30, w: 35, h: 35, r: 5},
		{type: "eye", side: "R", x: 205, y: 30, w: 35, h: 35, r: 5},
		{type: "neck", x: 190, y: 85, w: 20, h: 5, r: 5, pieces: 2},
		{type: "body", x: 140, y: 102, w: 120, h: 110, r: 5},
		{type: "arm", side: "L", x: 123, y: 112, w: 5, h: 20, r: 5, pieces: 2},
		{type: "arm", side: "R", x: 265, y: 112, w: 5, h: 20, r: 5, pieces: 2},
		{type: "hand", side: "L", x: 103, y: 114, w: 15, h: 15, r: 5},
		{type: "hand", side: "R", x: 282, y: 114, w: 15, h: 15, r: 5},
		{type: "leg", side: "L", x: 150, y: 217, w: 20, h: 5, r: 5, pieces: 2},
		{type: "leg", side: "R", x: 230, y: 217, w: 20, h: 5, r: 5, pieces: 2},
		{type: "foot", side: "L", x: 145, y: 234, w: 30, h: 15, r: 5},
		{type: "foot", side: "R", x: 225, y: 234, w: 30, h: 15, r: 5}
	],
	defaultRenderer = RBT.roundRect;
	
	// object creation
    var robot = Object.create(RBT.robot.prototype);
    
	// object properties
	robot.canvas = o.canvas;
	robot.context = o.context;
	robot.palette = o.palette || defaultPalette;
	robot.components = o.components || defaultComponents;
	robot.renderer = o.renderer || defaultRenderer;
	
	// return object
    return robot;
  },
  prototype: {
	loop: function loop() {
		// clean canvas
		this.context.fillStyle = "transparent";
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		// draw
		this.render();
		// loop
		var robot = this;
		setTimeout(function(){robot.loop();}, 1000/60);
		return robot;
	},
	renderComponent: function renderComponent(o) {
		this.context.fillStyle = o.fillStyle || this.palette.fill;
		this.context.strokeStyle = o.strokeStyle || this.palette.stroke;
		this.context.lineWidth = o.lineWidth || 5;
		var stroke = ("stroke" in o) ? o.stroke : true;		
		this.renderer(this.context, o.component.x, o.component.y, o.component.w, o.component.h, o.component.r).fill();
		if (stroke) this.context.stroke();	
	},
	render: function render() {
		var i, component;
		for (i = 0, n = this.components.length; i < n; i++) {
			component = this.components[i];
			if (component.type in this.draw) { 
				this.draw[component.type].call(this, component);
			}
			else {
				this.renderComponent({ component: component });
			}
		}
	},
	draw: {
		//head: function head(component) {},
		eye: function eye(component) {
			this.draw.eye.index = this.draw.eye.index || 0;
			this.draw.eye.frameCounter = this.draw.eye.frameCounter || 0;
			this.draw.eye.color = function() { 		
				if (this.draw.eye.frameCounter >= 1000/60) {
					this.draw.eye.frameCounter = 0;					
					if (this.draw.eye.index >= this.palette.eye_fill.length) {
						return this.draw.eye.index = 0;
					}
					else {
						return this.draw.eye.index += 1;
					}					
				}
				else {
					this.draw.eye.frameCounter++;
					return this.draw.eye.index;
				}
			};			
			this.renderComponent({
				component: component,
				fillStyle: this.palette.eye_fill[this.draw.eye.color.call(this)],
				stroke: true,
				strokeStyle: this.palette.stroke
			});	
		},
		neck: function neck(component) {
			for (var i = 0, n = component.pieces; i < n; i++) {
				component = {x: component.x, y: Math.floor((1*i*(component.h+component.h/2))+component.y), w: component.w, h: component.h, r: component.r, pieces: component.pieces};
				this.renderComponent({
					component: component,
					fillStyle: this.palette.stroke,
					stroke: false
				});		
			}
		},
		//body: function body(component) {},
		arm: function arm(component) {
			for (var i = 0, n = component.pieces; i < n; i++) {
				component =  {x: Math.floor((1*i*(component.w+component.w/2))+component.x), y: component.y, w: component.w, h: component.h, r: component.r};
				this.renderComponent({
					component: component,
					fillStyle: this.palette.stroke,
					stroke: false
				});						
			}
		},
		//hand: function hand(component) {},
		leg: function leg(component) {
			for (var i = 0, n = component.pieces; i < n; i++) {
				component = {x: component.x, y: Math.floor((1*i*(component.h+component.h/2))+component.y), w: component.w, h: component.h, r: component.r, pieces: component.pieces};
				this.renderComponent({
					component: component,
					fillStyle: this.palette.stroke,
					stroke: false
				});		
			}
		},
		//foot: function foot(component) {}
	}
  }
};


/*
RBT.robot = function(o) {
	var	defaultPalette = {background: "#eee",fill: "#6b6b6b", stroke: "#454343", eye_fill: ["#38282d", "#fc0", "f00"]},
		defaultComponents = [
			{type: "head", x: 150, y: 20, w: 100, h: 60, r: 5},
			{type: "eye", side: "L", x: 160, y: 30, w: 35, h: 35, r: 5},
			{type: "eye", side: "R", x: 205, y: 30, w: 35, h: 35, r: 5},
			{type: "neck", x: 190, y: 85, w: 20, h: 5, r: 5, pieces: 2},
			{type: "body", x: 140, y: 102, w: 120, h: 110, r: 5},
			{type: "arm", side: "L", x: 123, y: 112, w: 5, h: 20, r: 5, pieces: 2},
			{type: "arm", side: "R", x: 265, y: 112, w: 5, h: 20, r: 5, pieces: 2},
			{type: "hand", side: "L", x: 103, y: 114, w: 15, h: 15, r: 5},
			{type: "hand", side: "R", x: 282, y: 114, w: 15, h: 15, r: 5},
			{type: "leg", side: "L", x: 150, y: 217, w: 20, h: 5, r: 5, pieces: 2},
			{type: "leg", side: "R", x: 230, y: 217, w: 20, h: 5, r: 5, pieces: 2},
			{type: "foot", side: "L", x: 145, y: 234, w: 30, h: 15, r: 5},
			{type: "foot", side: "R", x: 225, y: 234, w: 30, h: 15, r: 5}
		],
		defaultRenderer = RBT.roundRect;
		
	this.canvas = o.canvas;
	this.context = o.context;
	this.palette = o.palette || defaultPalette;
	this.components = o.components || defaultComponents;
	this.renderer = o.renderer || defaultRenderer;
};
RBT.robot.prototype = {
	loop: function() {
		// clean canvas
		this.context.fillStyle = "transparent";
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		// draw
		this.render();
		// loop
		var robot = this;
		setTimeout(function(){robot.loop();}, 1000/60);
	},
	renderComponent: function(o) {
		this.context.fillStyle = o.fillStyle || this.palette.fill;
		this.context.strokeStyle = o.strokeStyle || this.palette.stroke;
		this.context.lineWidth = o.lineWidth || 5;
		var stroke = ("stroke" in o) ? o.stroke : true;		
		this.renderer(this.context, o.component.x, o.component.y, o.component.w, o.component.h, o.component.r).fill();
		if (stroke) this.context.stroke();	
	},
	render: function() {
		var i, component;
		for (i = 0, n = this.components.length; i < n; i++) {
			component = this.components[i];
			if (component.type in this.draw) { 
				this.draw[component.type].call(this, component);
			}
			else {
				this.renderComponent({ component: component });
			}
		}
	},
	draw: {
		//head: function(component) {},
		eye: function(component) {
			this.draw.eye.index = this.draw.eye.index || 0;
			this.draw.eye.frameCounter = this.draw.eye.frameCounter || 0;
			this.draw.eye.color = function() { 		
				if (this.draw.eye.frameCounter >= 1000/60) {
					this.draw.eye.frameCounter = 0;					
					if (this.draw.eye.index >= this.palette.eye_fill.length) {
						return this.draw.eye.index = 0;
					}
					else {
						return this.draw.eye.index += 1;
					}					
				}
				else {
					this.draw.eye.frameCounter++;
					return this.draw.eye.index;
				}
			};			
			this.renderComponent({
				component: component,
				fillStyle: this.palette.eye_fill[this.draw.eye.color.call(this)],
				stroke: true,
				strokeStyle: this.palette.stroke
			});	
		},
		neck: function(component) {
			for (var i = 0, n = component.pieces; i < n; i++) {
				component = {x: component.x, y: Math.floor((1*i*(component.h+component.h/2))+component.y), w: component.w, h: component.h, r: component.r, pieces: component.pieces};
				this.renderComponent({
					component: component,
					fillStyle: this.palette.stroke,
					stroke: false
				});		
			}
		},
		//body: function(component) {},
		arm: function(component) {
			for (var i = 0, n = component.pieces; i < n; i++) {
				component =  {x: Math.floor((1*i*(component.w+component.w/2))+component.x), y: component.y, w: component.w, h: component.h, r: component.r};
				this.renderComponent({
					component: component,
					fillStyle: this.palette.stroke,
					stroke: false
				});						
			}
		},
		//hand: function(component) {},
		leg: function(component) {
			for (var i = 0, n = component.pieces; i < n; i++) {
				component = {x: component.x, y: Math.floor((1*i*(component.h+component.h/2))+component.y), w: component.w, h: component.h, r: component.r, pieces: component.pieces};
				this.renderComponent({
					component: component,
					fillStyle: this.palette.stroke,
					stroke: false
				});		
			}
		},
		//foot: function(component) {}
	}
};
*/