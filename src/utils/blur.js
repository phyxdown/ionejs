export var blur = function(object1, p1, value, param){
    object1[p1] = object1[p1] == value ? 
        object1[p1] : object1[p1]*(1-param) + value*param;
};
