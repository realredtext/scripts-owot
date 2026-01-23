//not all related to owot
function IntRange(min, max) {
    if(min > max) throw new RangeError("Minimun is greater than maximum!");
    
    let list = [];
    
    for(let i = min; i <= max; i++) {
        list.push(i);
    };

    return list;
};

function average(...members) {
    return (members.reduce((a, b) => a+b)/members.length);
};

const onmouseswipe = (elmnt, mouseover, mouseleave) => {
    elmnt.onmouseover = mouseover;
    elmnt.onmouseleave = mouseleave;
};

function bound(value, min, max) {
    if(!["number", "bigint"].includes(typeof min)) throw new TypeError();
    if(!["number", "bigint"].includes(typeof max)) throw new TypeError();
    if(!["number", "bigint"].includes(typeof value)) throw new TypeError();
    if(min > max) [min, max] = [max, min];
    if(min === max) return;

    if(value > max) value = max;
    if(value < min) value = min;

    return value;
};
