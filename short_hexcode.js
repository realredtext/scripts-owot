function intToShortHex(val) {
    if(typeof val !== "number") return;
    if(val > 4096) val = 4096;
    if(val < 0) val = 0;
    if(val % 1) val = Math.floor(val);
    return `#${val.toString(16).padStart(3, 0)}`
};
