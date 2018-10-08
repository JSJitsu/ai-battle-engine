class SpawnPoint {
    constructor (distanceFromTop, distanceFromLeft, team) {
        this.type = 'SpawnPoint';
        this.subType = `SpawnPoint-${team}`;
        this.spawnTeam = team;
        this.distanceFromTop = distanceFromTop;
        this.distanceFromLeft = distanceFromLeft;
    }

    getCode (){
        return `SP-${this.team}`;
    }
}

module.exports = SpawnPoint;
