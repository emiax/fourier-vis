FourierVis.Canvas = function($canvas, editCallback) {
	this.$canvas = $canvas;
	this.canvas = $canvas[0];

	this.editCallback = editCallback ? function() { return editCallback(this.graph); } : null;

	this.g = this.canvas.getContext("2d");
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	this.fs = 0.0025;

	this.graph = [];
	var n = 0;
	for(n = 0; n < 1/this.fs; n++) {
		this.graph.push(0);
	}

	var x = 0, y = 0;

	this.matrix = $M([
		[this.width, 0, 0],
		[0, -this.height/2, this.height/2],
		[0, 0, 1],
	]);

	this.updateInverseMatrix();
	this.drawCoordinateSystem();
	this.drawGraph();

	var scope = this;
	var lastMousePosition = null;

	if (this.editCallback) {
		this.$canvas.mousedown(function(e) {
			var x = e.pageX - this.offsetLeft;
			var y = e.pageY - this.offsetTop;
			scope.editGraph($V([x, y]));
			lastMousePosition = $V([x, y]);
		});
		this.$canvas.mousemove(function(e) {
			if (lastMousePosition) {
				var x = e.pageX - this.offsetLeft;
				var y = e.pageY - this.offsetTop;

				scope.editGraph($V([x, y]), lastMousePosition);
				lastMousePosition = $V([x, y]);
			}
		});
		$(document).mouseup(function(e) {
			lastMousePosition = null;
		});
	}

};

FourierVis.Canvas.prototype = {
	clear: function() {
		this.g.clearRect(0, 0, this.width, this.height);
	},
	drawCoordinateSystem: function() {
		this.g.strokeStyle = "#999";
		this.g.beginPath();

		this.moveTo($V([-1000, 0]));
		this.lineTo($V([1000, 0]));
		this.moveTo($V([0, -1000]));
		this.lineTo($V([0, 1000]));
		this.stroke();
	},

	drawGraph: function() {
		var n, N;
		if (this.graph.length) {
			this.g.strokeStyle = "#fec";
			this.g.beginPath();
			this.moveTo($V([0, this.graph[0]]));
			for(n = 1, N = this.graph.length; n < N; n++) {
				this.lineTo($V([n*this.fs, this.graph[n]]));
			}
			this.stroke();
		}
	},

	update: function(graph) {
		if (graph) {
			this.graph = graph;
		}
		this.clear();
		this.drawCoordinateSystem();
		this.drawGraph();
	},

	editGraph: function(coords1, coords2) {
		var vector1 = this.invTransform(coords1),
			n1 = Math.round(vector1.e(1)/this.fs),
			vector2 = vector1,
			n2 = n1,
			t, n, k = 1,
			y1 = vector1.e(2);

		if (coords2) {
			vector2 = this.invTransform(coords2);
			n2 = Math.round(vector2.e(1)/this.fs);
			if (n1 != n2) {
				k = (vector2.e(2) - vector1.e(2))/(n2 - n1);
			}
		}
		if (n1 > n2) {
			t = n1;
			n1 = n2;
			n2 = t;
			y1 = vector2.e(2);
		}

		for (n = n1; n <= n2; n++) {
			this.graph[n] = y1 + k*(n - n1);
		}

		this.update();
		this.editCallback();

	},

	moveTo: function(vector) {
		var coords = this.transform(vector);
		return this.g.moveTo(coords.e(1), coords.e(2));
	},

	lineTo: function(vector) {
		var coords = this.transform(vector);
		return this.g.lineTo(coords.e(1), coords.e(2));
	},

	stroke: function() {
		return this.g.stroke();
	},

	transform: function(vector) {
		var homogenious = $V([vector.e(1), vector.e(2), 1]);
		var result = this.matrix.multiply(homogenious);
		return $V([result.e(1), result.e(2)]);
	},

	invTransform: function(vector) {
		var homogenious = $V([vector.e(1), vector.e(2), 1]);
		var result = this.invMatrix.multiply(homogenious);
		return $V([result.e(1), result.e(2)]);
	},

	updateInverseMatrix: function() {
		this.invMatrix = this.matrix.inverse();
	}	


};