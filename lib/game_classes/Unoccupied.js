class Unoccupied {
    constructor (distanceFromTop, distanceFromLeft, sp) {
        this.type = "Unoccupied";
        if (sp) {
            this.subType = "SpawnPoint";
            this.spawnValue = sp;
        } else {
            this.subType = "Unoccupied";        
        }
        this.distanceFromTop = distanceFromTop;
        this.distanceFromLeft = distanceFromLeft;
    }

    getCode () {
        return '   ';
    }
}

module.exports = Unoccupied;
