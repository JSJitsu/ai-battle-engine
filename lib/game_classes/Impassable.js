class Impassable {
    constructor (distanceFromTop, distanceFromLeft) {
        this.id = undefined;
        this.type = 'Impassable';
        this.subType = 'Tree';
        this.distanceFromTop = distanceFromTop;
        this.distanceFromLeft = distanceFromLeft;
    }

    getCode (){
        return 'III';
    }
}

module.exports = Impassable;
