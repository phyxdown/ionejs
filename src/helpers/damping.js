var Linear  = function(totalTime, fps) {
    this.left = this.total = totalTime;
    this.fps = fps || 60;
};

var Curve = function(totalTime, deviation, fps) {
    this.left = this.total = totalTime;
    this.deviation = this.deviation || 0.01;
    this.fps = fps || 60;
};

function damping() {
    if(!this.active) { 
        this.active = false;
        return;
    }
    if(this.object[this.key] == this.targetValue) {
        this.active = false;
        return;
    }

    var O = this.options;

    if(O instanceof Linear) {
        var interval = 1000/O.fps;
        this.object[this.key] += (this.targetValue - this.object[this.key])/O.left * interval;
        O.left -= interval;
        if(O.left > 0)
            setTimeout(damping.bind(this), interval);
        else {
            this.object[this.key] = this.targetValue;
            this.active = false;
        }
    }

    if(O instanceof Curve) {
        var interval = 1000/O.fps;
        var nth = O.left/interval;
        var k = Math.pow(O.deviation/(this.targetValue-this.object[this.key]), 1/nth);
        this.object[this.key] = this.targetValue * (1 - k) + this.object[this.key] * k;
        O.left -= interval;
        if(O.left > 0)
            setTimeout(damping.bind(this), interval);
        else {
            this.object[this.key] = this.targetValue;
            this.active = false;
        }
    }
}

var Damping = function() {
    this.states = {};
};

var p = Damping.prototype;

p.chase = function(object, key, targetValue, options) {
    var _this = this;
    if(!object) return;
    if(object[key] == undefined) return;
    _this.states[object] = _this.states[object] || {};
    var state = _this.states[object][key]; 
    if(state == undefined) {
        state = _this.states[object][key] = {
            object: object,
            key: key,
            targetValue: targetValue,
            options: options,
            active: true
        };
        setTimeout(damping.bind(state), 1);
    }
    else {
        state.targetValue = targetValue;
        state.options = options;
        if(state.active == false) {
            state.active = true;
            setTimeout(damping.bind(state), 1);
        }
    };
}

module.exports = new Damping();
module.exports.Linear = Linear;
module.exports.Curve = Curve;
