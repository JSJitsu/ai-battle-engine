/* global projects, describe, it, expect, should */
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const spies = require('chai-spies');
const Board = require('../lib/game_classes/Board.js');
const DiamondMine = require('../lib/game_classes/DiamondMine.js');
const Game = require('../lib/game_classes/Game.js');
const HealthWell = require('../lib/game_classes/HealthWell.js');
const Hero = require('../lib/game_classes/Hero.js');
const Impassable = require('../lib/game_classes/Impassable.js');
const Unoccupied = require('../lib/game_classes/Unoccupied.js');
chai.use(spies);

describe('Game dependencies exist.', () => {
    'use strict';

    it('Board.js exists', () => {
        let board = new Board(5);
        expect(board).to.be.a('object');
    });

    it('DiamondMine.js exists', () => {
        let diamondMine = new DiamondMine(0, 0);
        expect(diamondMine).to.be.a('object');
    });

    it('Game.js exists', () => {
        let game = new Game(5);
        expect(game).to.be.a('object');
    });

    it('HealthWell.js exists', () => {
        let healthWell = new HealthWell(0, 0);
        expect(healthWell).to.be.a('object');
    });

    it('Hero.js exists', () => {
        let hero = new Hero(0, 0);
        expect(hero).to.be.a('object');
    });

    it('Impassable.js exists', () => {
        let impassable = new Impassable(0, 0);
        expect(impassable).to.be.a('object');
    });

    it('Unoccupied.js exists', () => {
        let unoccupied = new Unoccupied(0, 0);
        expect(unoccupied).to.be.a('object');
    });

});

describe('Board.js', () => {

    it('Should have a tiles property.', () => {
        let board = new Board(5);
        expect(board.tiles).to.be.a('array');
    });

    it('Should have a length of side property.', () => {
        let board = new Board(5);
        expect(board.lengthOfSide).to.equal(5);
    });

    it('Should have an initialize board method.', () => {
        let board = new Board(5);
        expect(board.initializeBoard).to.be.a('function');
    });

    it('Should have an inspect method.', () => {
        let board = new Board(5);
        expect(board.inspect).to.be.a('function');
    });

    it('Should have a valid coordinates method.', () => {
        let board = new Board(5);
        expect(board.validCoordinates).to.be.a('function');
    });

    it('Should have a get tiles nearby method.', () => {
        let board = new Board(5);
        expect(board.getTileNearby).to.be.a('function');
    });

});

describe('Board methods.', () => {

    describe('Initialize board method.', () => {

        it('Initalize a board of a given length.', () => {
            let board = new Board(5);
            expect(board.lengthOfSide).to.equal(5);
        });

        it('Should handle negative lengths.', () => {
            let fn = () => {
                let board = new Board(-5);
            };
            expect(fn).to.throw(ReferenceError, 'Instantiate board with a positive integer only.');
        });

        it('Should handle decimal lengths.', () => {
            let fn = () => {
                let board = new Board(1.5);
            };
            expect(fn).to.throw(ReferenceError, 'Instantiate board with a positive integer only.');
        });

        it('Board tiles should initially be unoccupied.', () => {
            let board = new Board(2);
            for (let i = 0; i < board.tiles.length; i++) {
                for (let j = 0; j < board.tiles[i].length; j++) {
                    expect(board.tiles[i][j].type).to.equal('Unoccupied');
                }
            }
        });

    });

    describe('ValidCoordinates board method.', () => {

        it('Should take an X and Y coordinate.', () => {
            let fn = () => {
                let board = new Board(4);
                board.validCoordinates(5);
            };
            expect(fn).to.throw('Enter 2 parameters (X,Y).');
        });

        it('Should return false if given invalid coordinates.', () => {
            let board = new Board(4);
            expect(board.validCoordinates(5, 5)).to.equal(false);
        });

        it('Should return true if given valid coordinates.', () => {
            let board = new Board(4);
            expect(board.validCoordinates(3, 3)).to.equal(true);
        });

    });

    describe('Get tile nearby board method.', () => {

        it('Should take an X and Y coordinate.', () => {
            let fn = () => {
                let board = new Board(4);
                board.getTileNearby(5);
            };
            expect(fn).to.throw('Enter 2 parameters (X,Y) and direction.');
        });

        it('Should return a tile when given valid coordinates and direction (West).', () => {
            let board = new Board(4);
            let west = board.getTileNearby(0, 3, 'West');
            expect(!!west).to.equal(true);
        });

        it('Should return a tile when given valid coordinates and direction (South).', () => {
            let board = new Board(4);
            let south = board.getTileNearby(0, 0, 'South');
            expect(!!south).to.equal(true);
        });

        it('Should return a tile when given valid coordinates and direction (North).', () => {
            let board = new Board(4);
            let north = board.getTileNearby(3, 0, 'North');
            expect(!!north).to.equal(true);
        });

        it('Should return a tile when given valid coordinates and direction (East).', () => {
            let board = new Board(4);
            let east = board.getTileNearby(0, 0, 'East');
            expect(!!east).to.equal(true);
        });

        it('Should return a tile when given valid coordinates and direction (East).', () => {
            let board = new Board(4);
            let east = board.getTileNearby(0, 3, 'East');
            expect(east).to.equal(false);
        });

        it('Should return a tile when given valid coordinates and direction (North).', () => {
            let board = new Board(4);
            let north = board.getTileNearby(0, 0, 'North');
            expect(north).to.equal(false);
        });

        it('Should return a tile when given valid coordinates and direction (South).', () => {
            let board = new Board(4);
            let south = board.getTileNearby(3, 3, 'South');
            expect(south).to.equal(false);
        });

        it('Should return a tile when given valid coordinates and direction (West).', () => {
            let board = new Board(4);
            let west = board.getTileNearby(0, 0, 'West');
            expect(west).to.equal(false);
        });

    });

    describe('DiamondMine.js', () => {

        it('Should make a DiamondMine object.', () => {
            let d = new DiamondMine(2, 2);
            expect(d).to.be.a('object');
        });

        it('Should have no owner on instantiation.', () => {
            let d = new DiamondMine(2, 2);
            expect(d.owner).to.equal(undefined);
        });

        it('Should have no id on instantiation.', () => {
            let d = new DiamondMine(2, 2);
            expect(d.id).to.equal(undefined);
        });

    });

    describe('HealthWell.js', () => {

        it('Should make a HealthWell object.', () => {
            let hw = new HealthWell(2, 2);
            expect(hw).to.be.a('object');
        });

        it('Should have the type "HealthWell".', () => {
            let hw = new HealthWell(2, 2);
            expect(hw.type).to.equal('HealthWell');
        });

    });

    describe('Hero.js', () => {

        describe('Hero properties.', () => {

            it('Should have no mines and no kills on instantiation.', () => {
                let hero = new Hero(0, 0);
                expect(hero.mineCount).to.equal(0);
                expect(Object.keys(hero.minesOwned).length).to.equal(0);
                expect(hero.heroesKilled.length).to.equal(0);
            });

            it('Should be of the hero type.', () => {
                let hero = new Hero(0, 0);
                expect(hero.type).to.equal('Hero');
            });

            it('Should have health of 100 on instantiation.', () => {
                let hero = new Hero(0, 0);
                expect(hero.health).to.equal(100);
            });

            it('Should not be dead on instantiation.', () => {
                let hero = new Hero(0, 0);
                expect(hero.dead).to.equal(false);
            });

            it('Should have no diamonds on instantiation.', () => {
                let hero = new Hero(0, 0);
                expect(hero.diamondsEarned).to.equal(0);
            });

            it('Should have no damage done on instantiation.', () => {
                let hero = new Hero(0, 0);
                expect(hero.damageDone).to.equal(0);
            });

        });

        describe('Hero methods.', () => {

            it('Should be able to kill other heros.', () => {
                let hero1 = new Hero(0, 0);
                let hero2 = new Hero(0, 1);
                hero1.killedHero(hero2);
                expect(hero1.heroesKilled).to.have.length(1);
            });

            it('Should be able to take damage and not be killed.', () => {
                let hero1 = new Hero(0, 0);
                hero1.takeDamage(99);
                expect(hero1.dead).to.equal(false);
            });

            it('Should be able to take damage and be killed.', () => {
                let hero1 = new Hero(0, 0);
                hero1.takeDamage(100);
                expect(hero1.dead).to.equal(true);
            });

            it('Only return the damage actually needed to kill this hero.', () => {
                let hero = new Hero(0, 0);
                hero.takeDamage(90);
                expect(hero.takeDamage(20)).to.equal(10);
            });

            it('Should be able to heal.', () => {
                let hero = new Hero(0, 0);
                hero.takeDamage(25);
                hero.healDamage(25);
                expect(hero.health).to.equal(100);
            });

            it('Should not be able to heal beyond 100 health.', () => {
                let hero = new Hero(0, 0);
                hero.takeDamage(5);
                hero.healDamage(25);
                expect(hero.health).to.equal(100);
            });

            it('Should be able to capture mines.', () => {
                let hero = new Hero(0, 0);
                let d = new DiamondMine(0, 1);
                d.id = 1;
                hero.captureMine(d, 10);
                expect(hero.mineCount).to.equal(1);
            });

            it('Should take damage when capturing a mine.', () => {
                let hero = new Hero(0, 0);
                let d = new DiamondMine(0, 1);
                d.id = 1;
                hero.captureMine(d, 10);
                expect(hero.health).to.equal(90);
            });

            it('Should be able to lose control of a mine.', () => {
                let hero = new Hero(0, 0);
                let d = new DiamondMine(0, 1);
                d.id = 1;
                hero.captureMine(d, 10);
                hero.loseMine(d);
                expect(hero.mineCount).to.equal(0);
            });

        });

    });

    describe('Impassable.js', () => {

        it('Should take X and Y coordinates.', () => {
            let rock = new Impassable(0, 0);
            expect(rock.distanceFromTop).to.equal(0);
            expect(rock.distanceFromLeft).to.equal(0);
        });

        it('Should have the type of "Impassable".', () => {
            let rock = new Impassable(0, 0);
            expect(rock.type).to.equal('Impassable');
        });

        it('Should not have an initial ID.', () => {
            let rock = new Impassable(0, 0);
            expect(rock.id).to.equal(undefined);
        });

    });

    describe('Unoccupied.js', () => {

        it('Should take X and Y coordinates.', () => {
            let rock = new Impassable(0, 0);
            expect(rock.distanceFromTop).to.equal(0);
            expect(rock.distanceFromLeft).to.equal(0);
        });

        it('Should have the type of "Unoccupied".', () => {
            let u = new Unoccupied(0, 0);
            expect(u.type).to.equal('Unoccupied');
        });

    });

    describe('Game.js', () => {

        describe('Game object properties', () => {
            it('Should not take any arguments.', () => {
                let funct = () => {
                    let game = new Game(0, 0);
                };
                expect(funct).to.throw(ReferenceError, 'Instantiate game with a positive integer only.');
            });

            it('Should instantiate a board.', () => {
                let game = new Game(5);
                expect(!!game.board).to.equal(true);
            });

            it('Should have intial properties.', () => {
                let game = new Game(5);
                expect(game.heroes).to.have.length(0);
                expect(game.diamondMines).to.have.length(0);
                expect(game.healthWells).to.have.length(0);
                expect(game.impassables).to.have.length(0);
            });

            it('Should start a game at turn 0.', () => {
                let game = new Game(5);
                expect(game.turn).to.equal(0);
            });

            it('Should not start immediately.', () => {
                let game = new Game(5);
                expect(game.hasStarted).to.equal(false);
            });

        });

        describe('Game object methods', () => {

            it('Should add a hero to the game.', () => {
                let game = new Game(5);
                game.addHero(0, 0, "David", 0, 0);
                expect(game.heroes).to.have.length(1);
            });

            it('Should place a hero on the game board.', () => {
                let game = new Game(5);
                game.addHero(0, 0, "David", 0, 0);
                expect(game.board.tiles[0][0]).to.have.property('health');
            });

            it('Should add a diamond mine to the game.', () => {
                let game = new Game(5);
                let d = game.addDiamondMine(0, 0);
                expect(game.diamondMines).to.have.length(1);
            });

            it('Should place a diamond mine on the game board.', () => {
                let game = new Game(5);
                let d = game.addDiamondMine(0, 0);
                expect(game.board.tiles[0][0]).to.have.property('type').that.deep.equals('DiamondMine');
            });

            it('Should add a health well to the game.', () => {
                let game = new Game(5);
                let hw = game.addHealthWell(0, 0);
                expect(game.healthWells).to.have.length(1);
            });

            it('Should place a health well on the game board.', () => {
                let game = new Game(5);
                let hw = game.addHealthWell(0, 0);
                expect(game.board.tiles[0][0]).to.have.property('type').that.deep.equals('HealthWell');
            });

            it('Should add an impassable object to the game.', () => {
                let game = new Game(5);
                let i = game.addImpassable(0, 0);
                expect(game.impassables).to.have.length(1);
            });

            it('Should place an impassable object on the game board.', () => {
                let game = new Game(5);
                let i = game.addImpassable(0, 0);
                expect(game.board.tiles[0][0]).to.have.property('type').that.deep.equals('Impassable');
            });

            describe('handleHeroTurn method', () => {

                it('Should move the hero.', () => {
                    let game = new Game(5);
                    game.addHero(0, 0, "David", 0, 0);
                    game.addHero(3, 3, "Steven", 1, 1);
                    game.handleHeroTurn('South');
                    expect(game.heroes[0].distanceFromTop).to.equal(1);
                });

                it('Should not move the hero, if the hero is dead.', () => {
                    let game = new Game(5);
                    game.addHero(0, 0, "David", 0, 0);
                    game.addHero(3, 3, "Steven", 1, 1);
                    game.heroes[0].dead = true;
                    let funct = () => {
                        game.handleHeroTurn('South');
                    };
                    expect(funct).to.throw(Error, 'Dead heroes should never even have turns!');
                });

                it('Should call the hero earnings method.', () => {
                    let game = new Game(5);
                    game.addHero(0, 0, "David", 0, 0);
                    game.addHero(3, 3, "Steven", 1, 1);
                    game.heroes[0].mineCount = 1;
                    game.handleHeroTurn('South');
                    expect(game.heroes[0].diamondsEarned).to.equal(1);
                });

                it('Should call the hero attack method.', () => {
                    let game = new Game(5);
                    game.addHero(0, 0, "David", 0, 0);
                    game.addHero(2, 0, "Steven", 1, 1);
                    game.heroes[1].takeDamage(90);
                    game.handleHeroTurn('South');
                    expect(game.heroes[1].dead).to.equal(true);
                });

                it('Should increment the turn.', () => {
                    let game = new Game(5);
                    game.addHero(0, 0, "David", 0, 0);
                    game.addHero(3, 3, "Steven", 1, 1);
                    game.handleHeroTurn('South');
                    game.handleHeroTurn('South');
                    game.handleHeroTurn('South');
                    expect(game.turn).to.equal(3);
                });

                it('Should know what hero\'s turn it is.', () => {
                    let game = new Game(5);
                    game.addHero(0, 0, "David", 0, 0);
                    game.addHero(1, 1, "Steven", 1, 1);
                    game.handleHeroTurn('South');
                    expect(game.activeHero).to.deep.equal(game.heroes[1]);
                    game.handleHeroTurn('South');
                    expect(game.activeHero).to.deep.equal(game.heroes[0]);
                });

            });

            describe('Handle hero move', () => {

                it('Should not let the hero move off of the board.', () => {
                    let game = new Game(5);
                    game.addHero(0, 0, "David", 0, 0);
                    game._handleHeroMove(game.activeHero, 'North');
                    expect(game.heroes[0].distanceFromTop).to.equal(0);
                });

                // This is kind of an ugly test, but ¯\_(ツ)_/¯
                it('Should move the hero in the right direction.', () => {
                    let game = new Game(10);
                    game.addHero(0, 0, "David", 0, 0);
                    game._handleHeroMove(game.activeHero, 'South');
                    game._handleHeroMove(game.activeHero, 'East');
                    game._handleHeroMove(game.activeHero, 'South');
                    game._handleHeroMove(game.activeHero, 'East');
                    game._handleHeroMove(game.activeHero, 'North');
                    game._handleHeroMove(game.activeHero, 'West');
                    expect(game.heroes[0].distanceFromTop).to.equal(1);
                    expect(game.heroes[0].distanceFromLeft).to.equal(1);
                });

                it('Should leave the previous tile unoccupied.', () => {
                    let game = new Game(5);
                    game.addHero(0, 0, "David", 0, 0);
                    game._handleHeroMove(game.activeHero, 'South');
                    expect(game.board.tiles[0][0].type).to.equal('Unoccupied');
                    expect(game.board.tiles[0][0].subType).to.equal('Unoccupied');
                });

            });

            describe('handleHeroEarnings method', () => {

                it('Should increase diamondsEarned based on mineCount.', () => {
                    let game = new Game(5);
                    game.addHero(0, 0, "David", 0, 0);
                    game.addHero(3, 3, "Steven", 1, 1);
                    game.heroes[0].mineCount = 3;
                    game._handleHeroEarnings(game.heroes[0]);
                    expect(game.heroes[0].diamondsEarned).to.equal(3);
                });

                it('Should not change diamondsEarned if mineCount does not increase.', () => {
                    let game = new Game(5);
                    game.addHero(0, 0, "David", 0, 0);
                    game.addHero(3, 3, "Steven", 1, 1);
                    game._handleHeroEarnings(game.heroes[0]);
                    expect(game.heroes[0].diamondsEarned).to.equal(0);
                });

            });

            describe('handleHeroMove method', () => {

                it('Returns undefined if trying to move off the board.', () => {
                    let game = new Game(5);
                    game.addHero(0, 0, "David", 0, 0);
                    let moveOffBoard = game._handleHeroMove(game.heroes[0], 'North');
                    expect(moveOffBoard).to.equal(undefined);
                    moveOffBoard = game._handleHeroMove(game.heroes[0], 'West');
                    expect(moveOffBoard).to.equal(undefined);
                });

                it('Makes soon-to-be vacated tile "unoccupied".', () => {
                    let game = new Game(5);
                    game.addHero(0, 0, "David", 0, 0);
                    game._handleHeroMove(game.heroes[0], 'South');
                    expect(game.board.tiles[0][0].type).to.equal("Unoccupied");
                });

                it('Updates hero\'s location (in hero)', () => {
                    let game = new Game(5);
                    game.addHero(0, 0, "David", 0, 0);
                    game._handleHeroMove(game.heroes[0], 'South');
                    expect(game.heroes[0].distanceFromTop).to.equal(1);
                    expect(game.heroes[0].distanceFromLeft).to.equal(0);
                });

                it('Updates hero\'s location (on board)', () => {
                    let game = new Game(5);
                    game.addHero(0, 0, "David", 0, 0);
                    game._handleHeroMove(game.heroes[0], 'South');
                    expect(game.board.tiles[1][0]).to.equal(game.heroes[0]);
                });

                it('If hero tries to move on diamond mine he does not move.', () => {
                    let game = new Game(5);
                    game.addHero(0, 0, "David", 0, 0);
                    game.addDiamondMine(1, 0);
                    game._handleHeroMove(game.heroes[0], 'South');
                    expect(game.heroes[0].distanceFromTop).to.equal(0);
                    expect(game.heroes[0].distanceFromLeft).to.equal(0);
                });

                it('If hero captures mine with enough health he doesn\'t die and is owner of the mine.', () => {
                    let game = new Game(5);
                    game.addHero(0, 0, "David", 0, 0);
                    game.addDiamondMine(1, 0);
                    game._handleHeroMove(game.heroes[0], 'South');
                    expect(game.heroes[0].dead).to.equal(false);
                    expect(game.diamondMines[0].owner).to.equal(game.heroes[0]);
                });

                it('If hero captures mine with minimal health he dies.', () => {
                    let game = new Game(5);
                    game.addHero(0, 0, "David", 0, 0);
                    game.heroes[0].health = 10;
                    game.addDiamondMine(1, 0);
                    game._handleHeroMove(game.heroes[0], 'South');
                    expect(game.heroes[0].dead).to.equal(true);
                });

                it('If hero tries to move over a healthwell he will get health and not move.', () => {
                    let game = new Game(5);
                    game.addHero(0, 0, "David", 0, 0);
                    game.heroes[0].health = 10;
                    game.addHealthWell(1, 0);
                    game._handleHeroMove(game.heroes[0], 'South');
                    expect(game.heroes[0].health).to.equal(40); // 10 hp + 30 healthwell = 40
                    expect(game.heroes[0].distanceFromTop).to.equal(0);
                    expect(game.heroes[0].distanceFromLeft).to.equal(0);
                });

            });

            describe('resolveHeroAttacks method', () => {

                it('one hero attacks another if in range', () => {
                    let game = new Game(5);
                    game.addHero(0, 0, "David", 0, 0);
                    game.addHero(1, 0, "Steven", 1, 1);
                    game._resolveHeroAttacks(game.heroes[0]);
                    expect(game.heroes[1].health).to.equal(80); // 100 hp - 20 dmg = 80 hp
                });

                it('remove hero from board if dead', () => {
                    let game = new Game(5);
                    game.addHero(0, 0, "David", 0, 0);
                    game.addHero(1, 0, "Steven", 1, 1);
                    game.heroes[1].health = 1;
                    game._resolveHeroAttacks(game.heroes[0]);
                    expect(game.board.tiles[1][0].type).to.equal('Unoccupied');
                });

                it('tell hero he killed someone', () => {
                    let game = new Game(5);
                    game.addHero(0, 0, "David", 0, 0);
                    game.addHero(1, 0, "Steven", 1, 1);
                    game.heroes[1].health = 1;
                    game._resolveHeroAttacks(game.heroes[0]);
                    expect(game.heroes[0].heroesKilled).to.have.length(1);
                });

            });

            describe('heroDied method', () => {

                it('removes dead hero from board', () => {
                    let game = new Game(5);
                    game.addHero(0, 0, "David", 0, 0);
                    game.heroDied(game.heroes[0]);
                    expect(game.board.tiles[0][0].type).to.equal('Unoccupied');
                });

            });

        });

    });

    describe('When the maximum turns have been reached', () => {

        it('The game should end', () => {
            let game = new Game(5);

            game.maxTurn = 2;

            game.addHero(0, 0, 'Blue Guy', 0);
            game.addHero(0, 1, 'Red Guy', 1);

            game.handleHeroTurn('South');
            game.handleHeroTurn('South');
            game.handleHeroTurn('South');

            expect(game.ended).to.equal(true);
        });

    });

    describe('Team 0 should win', () => {

        it('When team 1 has been killed', () => {
            let game = new Game(5);

            game.addHero(0, 0, 'Blue Guy', 0);
            game.addHero(0, 1, 'Red Guy', 1);

            game.heroes[1].takeDamage(100);

            game.handleHeroTurn('South');

            expect(game.ended).to.equal(true);
            expect(game.winningTeam).to.equal(0);
        });

        it('When they have the most diamonds at game end', () => {
            let game = new Game(5);

            game.addHero(0, 0, 'Blue Guy', 0);
            game.addHero(0, 1, 'Red Guy', 1);

            game.addDiamondMine(1, 0);

            game.maxTurn = 4;

            game.handleHeroTurn('South');
            game.handleHeroTurn('South');
            game.handleHeroTurn('South');
            game.handleHeroTurn('South');

            expect(game.ended).to.equal(true);
            expect(game.winningTeam).to.equal(0);
        });

    });

    describe('Team 1 should win', () => {

        let game = new Game(5);

        it('When team 0 has been killed', () => {

            game.addHero(0, 0, 'Blue Guy', 0);
            game.addHero(0, 1, 'Red Guy', 1);

            game.handleHeroTurn('South');

            game.heroes[0].takeDamage(100);

            game.handleHeroTurn('South');

            expect(game.ended).to.equal(true);
            expect(game.winningTeam).to.equal(1);
        });

        it('When they have the most diamonds at game end', () => {
            let game = new Game(5);

            game.addHero(0, 0, 'Blue Guy', 0);
            game.addHero(0, 1, 'Red Guy', 1);

            game.addDiamondMine(1, 1);

            game.maxTurn = 4;

            game.handleHeroTurn('South');
            game.handleHeroTurn('South');
            game.handleHeroTurn('South');
            game.handleHeroTurn('South');

            expect(game.ended).to.equal(true);
            expect(game.winningTeam).to.equal(1);
        });

    });

    describe('When neither team has diamonds', () => {

        it('The team with the most living players should win, test A', () => {
            let game = new Game(5);

            game.addHero(0, 0, 'Blue Guy', 0);
            game.addHero(0, 2, 'Red Guy', 1);
            game.addHero(0, 4, 'Red Gal', 1);

            game.maxTurn = 3;

            game.handleHeroTurn('South');
            game.handleHeroTurn('South');
            game.handleHeroTurn('South');

            expect(game.ended).to.equal(true);
            expect(game.winningTeam).to.equal(1);
        });

        it('The team with the most living players should win, test B', () => {
            let game = new Game(5);

            game.addHero(4, 0, 'Blue Guy', 0);
            game.addHero(4, 2, 'Blue Gal', 0);
            game.addHero(4, 4, 'Blue Gorilla', 0);
            game.addHero(0, 2, 'Red Guy', 1);
            game.addHero(0, 4, 'Red Gal', 1);

            game.maxTurn = 5;

            game.handleHeroTurn('South');
            game.handleHeroTurn('South');
            game.handleHeroTurn('South');
            game.handleHeroTurn('South');
            game.handleHeroTurn('South');

            expect(game.ended).to.equal(true);
            expect(game.winningTeam).to.equal(0);
        });

    });

});