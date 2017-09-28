let Unoccupied = (distanceFromTop, distanceFromLeft) => {
    this.type = "Unoccupied";
    this.subType = "Unoccupied";
    this.distanceFromTop = distanceFromTop;
    this.distanceFromLeft = distanceFromLeft;
};

Unoccupied.prototype.getCode = () => {
    return '   ';
};

module.exports = Unoccupied;
