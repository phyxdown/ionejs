var Point = function(x, y) {
    this.x = x;
    this.y = y;
};

var p = Point.prototype;

p.distance = function(point){
	var dx = point.x - this.x;
	var dy = point.y - this.y;
	return Math.sqrt(Math.pow(dx, 2)+Math.pow(dy, 2));
};

p.transform = function(matrix){
    var r = matrix.append(1,0,0,1,this.x, this.y);
    this.x = r.x;
    this.y = r.y;
    return this;
};

p.retransform = function(matrix){
    var r = matrix.invert().append(1,0,0,1,this.x, this.y);
    this.x = r.x;
    this.y = r.y;
    return this;
};

p.clone = function(){
    return new Point(this.x, this.y);
};

module.exports = Point;
