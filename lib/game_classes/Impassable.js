let Impassable = (distanceFromTop, distanceFromLeft) => {
    this.id = undefined;
    this.type = 'Impassable';
    this.subType = 'Tree';
    this.distanceFromTop = distanceFromTop;
    this.distanceFromLeft = distanceFromLeft;
};

Impassable.prototype.getCode = () => {
    return 'III';
};

module.exports = Impassable;
