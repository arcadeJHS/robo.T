robo.T
===========
A funny, pretty useless, simple tool to create robots (well... sort of)!

**Because we need more robots!**

How to use
-----------
1. Insert a "canvas" into your HTML:
```html
<canvas id="canvas"></canvas>
```

2. Include "robo.t.js" into your page:
```html
<script src="robo.t.js"></script>
```

3. Prepare parameters to init the robot:

    * **canvasId** (string): id of canvas element:   
    ```javascript
    var canvasId = "canvas"
    ```
    
    * [**palette** (object)]: an optional map of colors used to draw the robot:
    ```javascript
    var palette = {
        	background: "#eee",
        	fill: "#6b6b6b",
        	stroke: "#454343",
        	eye_fill: ["#38282d", "#fc0", "f00"]
    }
    ```
    
    * [**components** (array of objects)]: an optional array to define robot components:
    ```javascript
    var components = [
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
	]
    ```
    
    * [**renderer** (function)]: an optional function to render each component, something like the default function "roundRect":
    ```javascript
    var roundRect = function(context, x, y, w, h, r) {
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
	}
    ```
    
    * [**scale** (float)]: optionally scale robot dimensions:
    ```javascript
    var scale = 0.5
    ```

And finally Init the robot:
```
RBT.init(params);
```

Example
-----------
```javascript
var params = {
    canvasId: "canvas",
    palette: {
        background: "#eee",
        fill: "#6b6b6b", 
        stroke: "#454343", 
        eye_fill: ["#38282d", "#fc0", "f00"]
    },
    components: [
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
    scale: 0.5
};			
RBT.init(params);
```

License
-----------
Creative Commons Attribution - Share Alike 3.0 - Unported license (CC BY-SA 3.0)
