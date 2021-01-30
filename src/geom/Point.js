class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	sub(point) {
		if(!point) return new Point(0, 0);
		return new Point(this.x - point.x, this.y - point.y);	
	}

	distance(point) {
    	var dx = point.x - this.x;
    	var dy = point.y - this.y;
    	return Math.sqrt(Math.pow(dx, 2)+Math.pow(dy, 2));
	}

	transform(matrix) {
    	var r = matrix.append(1,0,0,1,this.x, this.y);
    	this.x = r.x;
    	this.y = r.y;
    	return this;
	}

	retransform(matrix) {
    	var r = matrix.invert().append(1,0,0,1,this.x, this.y);
    	this.x = r.x;
    	this.y = r.y;
    	return this;
	}

	clone() {
    	return new Point(this.x, this.y);
	}
}

export { Point }
