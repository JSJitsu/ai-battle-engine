class HealthWell {
    constructor (distanceFromTop, distanceFromLeft) {
        this.distanceFromTop = distanceFromTop;
        this.distanceFromLeft = distanceFromLeft;
        this.type = 'HealthWell';
        this.subType = 'HealthWell';
    }
    getCode () {
        return 'WWW';
    }
}


module.exports = HealthWell;
