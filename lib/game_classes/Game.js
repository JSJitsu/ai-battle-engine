const Board = require('./Board.js');
const Hero =require('./Hero.js');
const DiamondMine=require('./DiamondMine.js');
const Unoccupied=require('./Unoccupied.js');
const Impassable=require('./Impassable.js');
const HealthWell = require('./HealthWell.js');

const DIAMOND_MINE_CAPTURE_DAMAGE = 20;
const HERO_ATTACK_DAMAGE = 20;
const HERO_FOCUSED_ATTACK_DAMAGE = 10;
const HEALTH_WELL_HEAL_AMOUNT = 30;
const HERO_HEAL_AMOUNT = 40;

class Game {
    constructor (n) {
        if (arguments.length > 1) {
            throw new ReferenceError('Instantiate game with a positive integer only.');
        }
        this.board = new Board(n);

        this.heroes = [];
        this.heroTurnIndex = 0;
        this.activeHero = undefined;

        // Defaults to two teams currently
        this.teams = [[], []];
        this.totalTeamDiamonds = [0, 0];

        // General game object info
        this.diamondMines = [];
        this.healthWells = [];
        this.impassables = [];
        this.ended = false;

        // Results
        this.winningTeam = undefined;

        // Messages
        this.diamondMessage = '';
        this.moveMessage = 'Game is about to start';
        this.attackMessage = '';
        this.killMessage = '';

        // Default is 300, can be overwritten
        this.maxTurn = 300;
        this.turn = 0;

        // Prevents adding of new objects
        // after game has started
        this.hasStarted = false;

        // Used in database retrieval
        this.date;
        this.gameNumber;
    }

    // Adds a new hero to the board
    // but ONLY if the game has not yet
    // started
    addHero (distanceFromTop, distanceFromLeft, name, team, id) {
        if (this.hasStarted) {
            throw new Error('Cannot add heroes after the game has started!');
        }

        // Can only add a hero to unoccupied spaces
        if (this.board.tiles[distanceFromTop][distanceFromLeft].type === 'Unoccupied') {
            // Creates new hero object
            const hero = new Hero(distanceFromTop, distanceFromLeft, name, team);

            // First hero added is the active hero
            if (id === 0 || this.heroes.length === 0) {
                this.activeHero = hero;
            }

            // Saves hero id
            if (id === 0 || id > 0) {
                hero.id = id;
            } else {
                hero.id = this.heroes.length;
            }

            // Puts hero on board
            this.board.tiles[distanceFromTop][distanceFromLeft] = hero;

            // Adds hero to game data structure
            this.heroes.push(hero);

            // Assign hero to appropriate team
            this.teams[hero.team].push(hero);

            // Makes it clear adding the hero was a success
            return true;
        } else {
            return false;
        }
    }

    // Adds a diamond mine to the board
    addDiamondMine (distanceFromTop, distanceFromLeft) {
        if (this.hasStarted) {
            throw new Error('Cannot add diamond mines after the game has started!');
        }

        // Can only add a diamond mine to unoccupied spaces
        if (this.board.tiles[distanceFromTop][distanceFromLeft].type === 'Unoccupied') {
            // Creates new diamond mine object
            const diamondMine = new DiamondMine(distanceFromTop, distanceFromLeft);

            // Saves diamondMines id
            diamondMine.id = this.diamondMines.length;

            // Puts diamondMine on board
            this.board.tiles[distanceFromTop][distanceFromLeft] = diamondMine;

            // Adds diamondMine to game data structure
            this.diamondMines.push(diamondMine);
        }
    }

    // Adds a health well to the board
    addHealthWell (distanceFromTop, distanceFromLeft) {
        if (this.hasStarted) {
            throw new Error('Cannot add health wells after the game has started!');
        }

        // Can only add a health well to unoccupied spaces
        if (this.board.tiles[distanceFromTop][distanceFromLeft].type === 'Unoccupied') {
            // Creates new health well object
            const healthWell = new HealthWell(distanceFromTop, distanceFromLeft);

            // Puts healthWell on board
            this.board.tiles[distanceFromTop][distanceFromLeft] = healthWell;

            // Adds healthWell to game data structure
            this.healthWells.push(healthWell);
        }
    }

    // Adds an impassable (rock, tree, etc) to the board
    addImpassable (distanceFromTop, distanceFromLeft) {
        if (this.hasStarted) {
            throw new Error('Cannot add impassables after the game has started!');
        }
        // Can only add an impassable to unoccupied spaces
        if (this.board.tiles[distanceFromTop][distanceFromLeft].type === 'Unoccupied') {
            // Creates new impassable object
            const impassable = new Impassable(distanceFromTop, distanceFromLeft);

            // Puts impassable on board
            this.board.tiles[distanceFromTop][distanceFromLeft] = impassable;

            // Adds impassable to game data structure
            this.impassables.push(impassable);
        }
    }

    // Resolves the hero's turn:
    // 1) The active hero earns diamonds from each mine they own
    //    at the start of their turn
    // 2) Moves the active hero in the direction specified
    handleHeroTurn (direction) {
        if (this.ended) {
            return;
        }

        // Clear past messages
        this.diamondMessage = '';
        this.moveMessage = '';
        this.attackMessage = '';
        this.killMessage = '';

        this.hasStarted = true;

        let hero = this.activeHero;

        // Only resolves the turn if the hero is not dead
        if (!hero.dead) {
            // Used to determine which hero is "active" at each point in the game on the front-end
            hero.lastActiveTurn = this.turn;

            // Gives the hero diamonds for each owned mine
            this._handleHeroEarnings(hero);

            // Attempts to move the hero in the direction indicated
            this._handleHeroMove(hero, direction);

            // If hero died during this move phase...
            if (hero.dead) {
                // Remove hero from board
                this.heroDied(hero);

                // If hero is still alive after moving...
            } else {

                // Resolves all damage given and healing received at the
                // end of the hero's turn
                this._resolveHeroAttacks(hero);
            }
        } else {
            throw new Error('Dead heroes should never even have turns!');
        }

        // Increment the game turn and update the active hero
        this._incrementTurn();

        // Checks whether the game is over

        // Team 0 are all dead
        if (this._teamIsDead(this.teams[0])) {
            console.log('Game over. Team 0 is dead.');
            this.winningTeam = 1;
            this.maxTurn = this.turn;
            this.ended = true;

            // Team 1 are all dead
        } else if (this._teamIsDead(this.teams[1])) {
            console.log('Game over. Team 1 is dead.');
            this.winningTeam = 0;
            this.maxTurn = this.turn;
            this.ended = true;

            // Exceeded maximum turns
        } else if (this.turn >= this.maxTurn) {
            console.log('Game over. Maximum number of turns reached.');
            this.ended = true;
            const teamDiamonds0 = this._teamDiamonds(this.teams[0]);
            const teamDiamonds1 = this._teamDiamonds(this.teams[1]);

            this.winningTeam = teamDiamonds1 > teamDiamonds0 ? 1 : 0;

            if (teamDiamonds0 === teamDiamonds1) {
                this.winningTeam = this.getIdOfTeamWithMostLivingHeroes();
            }
        }

        // Save the win or loss directly on the hero objects
        if (this.ended) {
            for (let i = 0; i < this.heroes.length; i++) {
                hero = this.heroes[i];
                if (hero.team === this.winningTeam) {
                    hero.won = true;
                } else {
                    hero.won = false;
                }
            }
        }
    }

    filterOnlyLivingHeroes  (hero) {
        return hero.dead === false;
    }

    filterTeamHeroes (filterFn) {
        let filtered = [];

        this.teams.forEach((team, teamIndex) => {
            filtered[teamIndex] = team.filter(filterFn);
        });

        return filtered;
    }

    getIdOfTeamWithMostLivingHeroes () {
        let livingHeroesByTeam = this.filterTeamHeroes(this.filterOnlyLivingHeroes);
        let maxCount = -1;
        let id = -1;

        let counts = livingHeroesByTeam.map(team => team.length);

        counts.forEach((count, index) => {
            if (count > maxCount) {
                maxCount = count;
                id = index;
            }
        });

        return id;
    }

    // Resolve diamond mine earnings
    _handleHeroEarnings (hero) {
        if (hero.mineCount > 0) {
            this.diamondMessage = `${hero.name} got ${hero.mineCount} diamonds from his mines`;
        } else {
            this.diamondMessage = `${hero.name} owns no mines, and got no diamonds`;
        }
        this.totalTeamDiamonds[hero.team] += hero.mineCount;
        hero.diamondsEarned += hero.mineCount;
    }

    // Attempt to move hero in the direction indicated
    _handleHeroMove (hero, direction) {
        this.moveMessage = `${hero.name} walked ${direction}`;

        // Gets the tile at the location that the hero wants to go to
        const tile = this.board.getTileNearby(hero.distanceFromTop, hero.distanceFromLeft, direction);

        // If tile is not on the board (invalid coordinates), don't move
        if (tile === false) {
            this.moveMessage += '...and realized that wasn\'t possible';
            return;

            // If tile is unoccupied, move into that tile
        } else if (tile.type === 'Unoccupied') {

            // Make the soon-to-be vacated tile "unoccupied"
            this.board.tiles[hero.distanceFromTop][hero.distanceFromLeft] =
                new Unoccupied(hero.distanceFromTop, hero.distanceFromLeft);

            // Check whether the hero robbed a grave, if so give credit
            if (tile.subType === 'RedFainted' || tile.subType === 'BlueFainted') {
                hero.gravesRobbed++;
            }

            // Update hero location (in hero)
            hero.distanceFromTop = tile.distanceFromTop;
            hero.distanceFromLeft = tile.distanceFromLeft;

            // Update hero location (on board)
            this.board.tiles[hero.distanceFromTop][hero.distanceFromLeft] = hero;

            // If tile is a diamond mine, the mine is captured, but the hero stays put
        } else if (tile.type === 'DiamondMine') {
            const diamondMine = tile;

            // Hero attempts to capture mine
            hero.captureMine(diamondMine, DIAMOND_MINE_CAPTURE_DAMAGE);

            // If capturing the mine takes the hero to 0 HP, he dies
            if (hero.dead) {
                this.heroDied(hero);
                this.moveMessage += ', and died trying to capture a diamond mine.';
                return;

                // If he survives, he is now the owner of the mine
            } else {
                this.moveMessage += ' and is now the proud owner of diamond mine #' + diamondMine.id;
                diamondMine.owner = hero;
            }
            // Running into a health well will heal a certain amount of damage
        } else if (tile.type === 'HealthWell') {
            this.moveMessage += ', drank from a health well, and now feels MUCH better';
            hero.healDamage(HEALTH_WELL_HEAL_AMOUNT);

            // Running into another hero will either heal them (same team) or hurt them (opposing team)
        } else if (tile.type === 'Hero') {
            const otherHero = tile;

            // Running directly into an enemy hero will deal extra damage
            if (otherHero.team !== hero.team) {
                this.moveMessage += ', and stabbed ' + otherHero.name + ' for extra damage';
                hero.damageDone += otherHero.takeDamage(HERO_FOCUSED_ATTACK_DAMAGE);

                // Running directly into a friendly hero will give the friendly hero health
            } else {
                this.moveMessage += ', and healed ' + otherHero.name;
                hero.healthGiven += otherHero.healDamage(HERO_HEAL_AMOUNT);
            }
        }
        // console.log(this.moveMessage);
    }

    _resolveHeroAttacks (hero) {
        // Resolve Attacks and Healing (if any):
        const directions = [
            'North',
            'East',
            'South',
            'West',
        ];

        // Loop through all tiles around the hero
        for (let i = 0; i < directions.length; i++) {
            const tile = this.board.getTileNearby(hero.distanceFromTop, hero.distanceFromLeft, directions[i]);
            if (tile === false) {

                // Does nothing if the tile in the given direction
                // Is not on the board
            } else if (tile.type === 'Hero') {

                // from the check above, we know 'tile' points to a hero object
                const otherHero = tile;

                // Only damage heroes that are not on your team

                if (otherHero.team !== hero.team) {

                    // Update the attack message
                    if (this.attackMessage === '') {
                        this.attackMessage = hero.name + ' stabbed ' + otherHero.name;
                    } else {
                        this.attackMessage += ' and ' + otherHero.name;
                    }

                    // Our hero (whose turn it is) will auto-hit any heroes in range,
                    // so this other hero that is one space away will take damage
                    hero.damageDone += otherHero.takeDamage(HERO_ATTACK_DAMAGE);
                    if (otherHero.dead) {

                        // Remove dead hero from the board
                        this.heroDied(otherHero);

                        // Tell our hero he killed someone
                        hero.killedHero(otherHero);

                        this.killMessage = hero.name + ' killed ' + otherHero.name + '!';
                    }
                }
            }
        }
    }

    _teamDiamonds (teamArray) {
        let diamonds = 0;
        for (let i = 0; i < teamArray.length; i++) {
            diamonds += teamArray[i].diamondsEarned;
        }
        return diamonds;
    }

    _teamIsDead (teamArray) {
        for (let i = 0; i < teamArray.length; i++) {
            if (!teamArray[i].dead) {
                return false;
            }
        }
        return true;
    }

    _incrementTurn () {

        // Used to determine whose turn it is
        const incrementHeroTurnIndex = function () {
            this.heroTurnIndex++;

            // If you reach the end of the hero list, start again
            if (this.heroTurnIndex >= this.heroes.length) {
                this.heroTurnIndex = 0;
            }
        }.bind(this);

        // Goes to next hero
        incrementHeroTurnIndex();

        // Make sure the next active hero is alive
        while (this.heroes[this.heroTurnIndex].dead) {
            incrementHeroTurnIndex();
        }

        // Set the active hero (the hero whose turn is next)
        this.activeHero = this.heroes[this.heroTurnIndex];

        // Increment the turn
        this.turn++;
    }

    // Removes a dead hero from the board
    heroDied (hero) {
        const top = hero.distanceFromTop;
        const left = hero.distanceFromLeft;
        const bones = new Unoccupied(top, left);
        const teamName = (hero.team === 1) ? 'Red' : 'Blue';

        bones.subType = teamName + 'Fainted';
        bones.id = hero.id;

        this.board.tiles[top][left] = bones;
    }
}

module.exports = Game;
