const fs = require('fs'),
    vm = require('vm');

const GameEngine = function (configs) {
    this.configs = this.buildConfigs(configs);
    this.board = require("./lib/game_classes/Board.js");
    this.diamondMine = require("./lib/game_classes/DiamondMine.js");
    this.game = require("./lib/game_classes/Game.js");
    this.healthWell = require("./lib/game_classes/HealthWell.js");
    this.hero = require("./lib/game_classes/Hero.js");
    this.impassable = require("./lib/game_classes/Impassable.js");
    this.unoccupied = require("./lib/game_classes/Unoccupied.js");
};

GameEngine.prototype.buildConfigs = function (configs) {
    let config,
        calculatedConfigs;

    calculatedConfigs = {
        boardSize: 12,
        maxUsersPerTeam: 12,
        maxTurns: 1250
    };

    for (config in configs) {
        if (configs.hasOwnProperty(config)) {
            calculatedConfigs[config] = configs[config];
        }
    }

    return  calculatedConfigs;
};

GameEngine.prototype.getBoard = function () {
    return this.board;
};

GameEngine.prototype.getDiamondMine = function () {
    return this.diamondMine;
};

GameEngine.prototype.getGame = function () {
    return this.game;
};

GameEngine.prototype.getHealthWell = function () {
    return this.healthWell;
};

GameEngine.prototype.getHero = function () {
    return this.hero;
};

GameEngine.prototype.getImpassable = function () {
    return this.impassable;
};

GameEngine.prototype.getUnoccupied = function () {
    return this.unoccupied;
};

// Creates a board from the map in the given file path
GameEngine.prototype.createGameFromMap = function (mapFilePath){
    const buffer = fs.readFileSync(mapFilePath),
        Game = this.getGame(),
        game;
    let map = buffer.toString('utf8');
    map = map.split('\n');
    for (let i = 0; i < map.length; i++){
        map[i] = map[i].split('|');
    }
    game = new Game(map.length);
    for (let j = 0; j < map.length; j++){
        for (let k = 0; k < map.length; k++){
            if (map[j][k] === 'DM'){
                game.addDiamondMine(j,k);
            } else if (map[j][k] === 'HW'){
                game.addHealthWell(j,k);
            } else if (map[j][k] === 'IM'){
                game.addImpassable(j,k);
            }
        }
    }
    return game;
};

/**
 * Synchronous, returns an array of all games that need
 * to be run and a lookup for finding user info
 * @param  {Object} originalUsers value is spliced upon creation
 * @return {Object}               Containing the games and userLookup
 */
GameEngine.prototype.planAllGames = function (originalUsers) {

    console.log('Planning games for ' + originalUsers.length + ' users.');

    let me = this,
        users = originalUsers.slice(),
        maxUsersPerTeam = me.configs.maxUsersPerTeam,
        boardSize = me.configs.boardSize,
        userLookup = {},
        games = [],
        numberOfGames = 0,
        alternateTeams = [],
        gameIndex = 0,
        map,
        game,
        currentGameIndex = 0,
        thisGame,
        thisTeam,
        nextUserIndex,
        nextUser;

    // Calculate number of games needed
    numberOfGames = Math.ceil(users.length / maxUsersPerTeam / 2);

    alternateTeams = [];

    // Create games
    for (gameIndex; gameIndex<numberOfGames; gameIndex++) {
        map = me.pickMap();
        game = me.createGameFromMap( __dirname + '/lib/maps/' + map );
        game.maxTurn = me.configs.maxTurns;
        games.push(game);

        // Keeps track of which team to add the
        // next hero to for each game
        // (Used below)
        alternateTeams.push(0);
    }


    // Add users to each game (one user to first game,
    // then move to next game and add a user, and so on
    // until all users have been added)

    while (users.length > 0) {
        thisGame = games[currentGameIndex];
        thisTeam = alternateTeams[currentGameIndex];

        // Next hero added to this game will be on the other team
        if (thisTeam === 0) {
            alternateTeams[currentGameIndex] = 1;
        } else {
            alternateTeams[currentGameIndex] = 0;
        }

        // Get a random user from the user list
        nextUserIndex = this.randomIndex(users.length);
        nextUser = users.splice(nextUserIndex, 1)[0];

        // Save the user (be able to get the hero port, etc later)
        let githubHandle = nextUser.github_login;
        userLookup[githubHandle] = nextUser;

        console.log('Adding user: ' + githubHandle + ' to game ' + currentGameIndex + ', team ' + thisTeam);

        // Loops through each game
        if (currentGameIndex < games.length - 1) {
            currentGameIndex++;
        } else {
            currentGameIndex = 0;
        }

        // Put hero at random location in the current game
        while (!thisGame.addHero(this.randomIndex(boardSize), this.randomIndex(boardSize), githubHandle, thisTeam)) {
          // Keep looping until the hero is successfully added
          // (Since we are choosing random locations, heroes that are added
          // onto occupied squares do nothing and return false, hence the loop)
        }
    }

    return {
        games: games,
        userLookup: userLookup
    };
};

// util methods

/**
 * Helper function for generating random indices
 * @param  {Number} maxExcl Max random number (exclusive)
 * @return {Number}         random number from 0 to max-1
 */
GameEngine.prototype.randomIndex = function (maxExcl) {
    return Math.floor(Math.random(Date.now()) * maxExcl);
};

GameEngine.prototype.pickMap = function () {
    let dir = __dirname + "/lib/maps/",
        maps = [];

    maps = fs.readdirSync(dir);

    if (Array.isArray(maps)) {
        let map = maps[this.randomIndex(maps.length)];
        return map;
    } else {
        return maps;
    }
};


module.exports = GameEngine;
