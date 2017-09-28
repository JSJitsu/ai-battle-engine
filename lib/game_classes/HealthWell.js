let HealthWell = (distanceFromTop, distanceFromLeft) => {
    this.distanceFromTop = distanceFromTop;
    this.distanceFromLeft = distanceFromLeft;

    this.type = 'HealthWell';
    this.subType = 'HealthWell';

};

HealthWell.prototype.getCode = () => {
    return 'WWW';
};

module.exports = HealthWell;
