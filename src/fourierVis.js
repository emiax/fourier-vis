FourierVis = {

	//convolution
	conv: function(f, g) {
		var n, N, i, I;
		y = [];
		N = f.length;
		I = g.length;
		N = Math.min(N, I);
		for (n = 0; n < N; n++) {
			y[n] = 0;
			for(i = 0; i < I && n - i > 0; i++) {
				y[n] += f[i]*g[n-i];
			}
		}
		return y;
	},


	fft: function(x) {
		var pi = Math.PI, sin = Math.sin, cos = Math.cos;
		var k, N = x.length, reX = [], imX = [];
		for (k = 0; k < N; k++) {
			reX[k] = 0;
			imX[k] = 0;
			for (n = 0; n < N; n++) {
				reX[k] += x[n]*cos(2*pi*k*n/N);
				imX[k] += x[n]*sin(2*pi*k*n/N);
			}
		}
		return [imX, reX];
	},

	ifft: function(X) {
		var pi = Math.PI, sin = Math.sin, cos = Math.cos;
		var k, N = X[0].length, reX = X[0], imX = X[1], x = [];
		for (k = 0; k < N; k++) {
			x[k] = 0;
			for (n = 0; n < N; n++) {
				x[k] += reX[n]*cos(2*pi*k*n/N) - imX[n]*sin(2*pi*k*n/N);
			}
			x[k] /= pi;
		}
		return x;
	},

	toPolar: function(X) {
		var k, N, r = [], theta = [], sqrt = Math.sqrt, atan2 = Math.atan2, re, im;
		for (k = 0, N = X[0].length; k < N; k++) {
			re = X[0][k];
			im = X[1][k];
			r[k] = sqrt(re*re + im*im);
			theta[k] = atan2(im, re);
		}
		return [r, theta];
	},

	toCartesian: function(X) {
		var k, N, reX = [], imX = [], cos = Math.cos, sin = Math.sin, r, theta;
		for (k = 0, N = X[0].length; k < N; k++) {
			r = X[0][k];
			theta = X[1][k];
			reX[k] = r*cos(theta);
			imX[k] = r*sin(theta);
		}
		return [reX, imX];
	},
};