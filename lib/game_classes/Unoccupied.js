class Unoccupied {
    constructor (distanceFromTop, distanceFromLeft) {
        this.type = "Unoccupied";
        this.subType = "Unoccupied";
        this.distanceFromTop = distanceFromTop;
        this.distanceFromLeft = distanceFromLeft;
    }

    getCode () {
        return '   ';
    }
}

module.exports = Unoccupied;
