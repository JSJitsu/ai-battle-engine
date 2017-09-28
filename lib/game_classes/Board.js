const Unoccupied = require('./Unoccupied.js');

const Board = function (lengthOfSide) {
    if (lengthOfSide < 0 || !Number.isInteger(lengthOfSide)) {
        throw new ReferenceError('Instantiate board with a positive integer only.');
    }
    this.tiles = [];
    this.lengthOfSide = lengthOfSide;
    this.initializeBoard();
};

Board.prototype.inspect = function () {
    let horizontalDivide = '|';
    for (let i=0; i<this.lengthOfSide; i++) {
        let line = '|';
        for (let j=0; j<this.lengthOfSide; j++) {
            line += this.tiles[i][j].getCode() + '|';
            if (i === 0) {
                horizontalDivide += '---|';
            }
        }
        if (i === 0) {
            console.log(horizontalDivide);
        }
        console.log(line);
        console.log(horizontalDivide);
    }
    console.log('********');
};

Board.prototype.initializeBoard = function () {
    for (let i=0; i<this.lengthOfSide; i++) {
        this.tiles.push([]);
        for (let j=0; j<this.lengthOfSide; j++) {
            this.tiles[i].push(new Unoccupied(i, j));
        }
    }
};

// Returns false if the given coordinates are out of range
Board.prototype.validCoordinates = function (distanceFromTop, distanceFromLeft) {
    if (distanceFromTop === undefined
      || distanceFromLeft === undefined) { // if any parameters are missing, throw
        throw Error('Enter 2 parameters (X,Y).');
    }
    return (!(distanceFromTop < 0 || distanceFromLeft < 0 ||
        distanceFromTop > this.lengthOfSide - 1 || distanceFromLeft > this.lengthOfSide - 1));
};

// Returns the tile [direction] (North, South, East, or West) of the given X/Y coordinate
Board.prototype.getTileNearby = function (distanceFromTop, distanceFromLeft, direction) {
    if (distanceFromTop === undefined || distanceFromLeft === undefined) {
        // if any parameters are missing, throw
        throw Error('Enter 2 parameters (X,Y) and direction.');
    }

    let fromTopNew = distanceFromTop;
    let fromLeftNew = distanceFromLeft;
    if (direction === 'North') {
        fromTopNew -= 1;
    } else if (direction === 'East') {
        fromLeftNew += 1;
    } else if (direction === 'South') {
        fromTopNew += 1;
    } else if (direction === 'West') {
        fromLeftNew -= 1;
    } else {
        return false;
    }

    if (this.validCoordinates(fromTopNew, fromLeftNew)) {
        return this.tiles[fromTopNew][fromLeftNew];
    } else {
        return false;
    }
};

module.exports = Board;
