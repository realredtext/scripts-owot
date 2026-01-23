function parseBool(str) {
    str+="";
    str = str.toLowerCase();
    
    if(!(str in {"true":1,"false": 0})) throw new TypeError("Invalid string!");
    
    return str === "true";
};
