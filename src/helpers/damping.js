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
    if(this.S[this.key] == this.targetValue) {
        this.active = false;
        return;
    }

    var O = this.options;

    if(O instanceof Linear) {
        var interval = 1000/O.fps;
        this.S[this.key] += (this.targetValue - this.S[this.key])/O.left * interval;
        O.left -= interval;
        if(O.left > 0)
            setTimeout(damping.bind(this), interval);
        else {
            this.S[this.key] = this.targetValue;
            this.active = false;
        }
    }

    if(O instanceof Curve) {
        var interval = 1000/O.fps;
        var nth = O.left/interval;
        var k = Math.pow(Math.abs(O.deviation/(this.targetValue-this.S[this.key])), 1/nth);
        this.S[this.key] = this.targetValue * (1 - k) + this.S[this.key] * k;
        O.left -= interval;
        if(O.left > 0)
            setTimeout(damping.bind(this), interval);
        else {
            this.S[this.key] = this.targetValue;
            this.active = false;
        }
    }
}

var Damping = function() {
    this.states = {};
};

var p = Damping.prototype;

p.chase = function(S, key, targetValue, options, restart) {
    var _this = this;
    if(!S) return;
    if(S[key] == undefined) return;
    if(!options) {
        S[key]  = targetValue;
        return;
    }
    _this.states[S._uniqueKey] = _this.states[S._uniqueKey] || {};
    var state = _this.states[S._uniqueKey][key]; 
    if(state == undefined) {
        state = _this.states[S._uniqueKey][key] = {
            S: S,
            key: key,
            targetValue: targetValue,
            options: options,
            active: true
        };
        setTimeout(damping.bind(state), 1);
    }
    else {
        state.targetValue = targetValue;
        if(state.active == false) {
            state.options = options;
            state.active = true;
            setTimeout(damping.bind(state), 1);
        } else if(restart) 
            state.options = options;
    };
}

module.exports = new Damping();
module.exports.Linear = Linear;
module.exports.Curve = Curve;
