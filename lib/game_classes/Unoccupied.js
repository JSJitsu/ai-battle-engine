var Unoccupied = function (distanceFromTop, distanceFromLeft, sp) {
    this.type = "Unoccupied";
    if (sp) {
        this.subType = "SpawnPoint";
        this.spawnValue = sp;
    } else {
        this.subType = "Unoccupied";        
    }
    this.distanceFromTop = distanceFromTop;
    this.distanceFromLeft = distanceFromLeft;
};

Unoccupied.prototype.getCode = function () {
    return '   ';
};

module.exports = Unoccupied;
