// For use with Pokemon Showdown

'use strict';

/*vector structure

// ally pokemon, contains actual values
mypokemon1 id
mypokemon1 level
mypokemon1 gender
mypokemon1 item
mypokemon1 ability
mypokemon1 move1 (as determined by move iteration: actual hidden power types)
mypokemon1 move1pp
mypokemon1 move2
mypokemon1 move2pp
mypokemon1 move3
mypokemon1 move3pp
mypokemon1 move4
mypokemon1 move4pp
mypokemon1 hp (real value)
mypokemon1 status (permanent status like poison, faint)
mypokemon1 hp
mypokemon1 atk
mypokemon1 def
mypokemon1 spa
mypokemon1 spd
mypokemon1 spe
x6


// foe pokemon, begin as -1 = not known, changed to known from battle stack
foepokemon1 id (always known)
foepokemon1 level (always known)
foepokemon1 gender (always known)
foepokemon1 item
foepokemon1 ability
foepokemon1 move1 (as determined by value of "num": hidden power type unknown)
foepokemon1 move1pp
foepokemon1 move2
foepokemon1 move2pp
foepokemon1 move3
foepokemon1 move3pp
foepokemon1 move4
foepokemon1 move4pp
foepokemon1 hp (always known as % of full)
foepokemon1 status (permanent status like poison, faint)
x6

// active statuses (always accurate)
mypokemon1 current type
mypokemon1 current ability
mypokemon1 atk boost
mypokemon1 def boost
mypokemon1 spa boost
mypokemon1 spd boost
mypokemon1 spe boost
foepokemon1 current type
foepokemon1 current ability
foepokemon1 atk boost
foepokemon1 def boost
foepokemon1 spa boost
foepokemon1 spd boost
foepokemon1 spe boost

// battle record
win = 1, loss = 2, inbattle = 3, choosepokemon = 4
mypokemon1 lastmove
foepokemon1 lastmove



// edge cases ???????????????????????????????????
weather
terrain
trick room
gravity
magic room
mud sport
water sport
wonder room
my reflect
my light screen
my aurora veil
my spikes
my toxic spikes
my stealth rock
my sticky web
my lucky chant
my safeguard
my tailwind
my wish
mypokemon1 confusion
mypokemon1 infatuated
mypokemon1 leech seed
mypokemon1 ingrain
mypokemon1 aqua ring
mypokemon1 ingrain
mypokemon1 can switch
mypokemon1 substitute
mypokemon1 surehit
mypokemon1 curse
mypokemon1 embargo
mypokemon1 gastro acid
mypokemon1 magnet rise
mypokemon1 perish song
mypokemon1 power trick
mypokemon1 telekinesis
mypokemon1 move1 disabled
mypokemon1 move2 disabled
mypokemon1 move3 disabled
mypokemon1 move4 disabled
mypokemon1 encore
mypokemon1 taunt
mypokemon1 critratio
mypokemon1 heal block
mypokemon1 imprison
mypokemon1 nightmare
mypokemon1 miracle eye
mypokemon1 odor sleuth
mypokemon1 stockpile
mypokemon1 yawn
mypokemon1 choicelock


*/

// output a game state vector from game data 
// intended as input for a neural network
class GameState {
	constructor (side) {
		this.side = side;

		// generate unique pokemon ids
		this.pokedex = [];
		var i = 1;
		var object = this.side.battle.dataCache.Pokedex;
		for (var entry in object) {
			this.pokedex[entry.toString()] = i;
			i++;
		}
		// generate move ids for allied pokemon
		this.allyMovedex = [];
		// get move numbers for enemy pokemon
		this.foeMovedex = [];
		// translate from move's readable name to move id
		this.moveTranslation = [];
		var i = 1;
		var object = this.side.battle.dataCache.Movedex;
		for (var entry in object) {
			this.allyMovedex[entry.toString()] = i;
			this.foeMovedex[entry.toString()] = object[entry].num;
			this.moveTranslation[object[entry].name] = object[entry].num;
			i++;
		}
		// load item ids
		this.itemdex = [];
		var object = this.side.battle.dataCache.Items;
		for (var entry in object) {
			this.itemdex[entry.toString()] = object[entry].num;
		}
		// load ability ids
		this.abilitydex = [];
		var object = this.side.battle.dataCache.Abilities;
		for (var entry in object) {
			this.abilitydex[entry.toString()] = object[entry].num;
		}

		// status numbers
		this.statusConverter = [];
		this.statusConverter["fnt"] = 1;
		this.statusConverter["brn"] = 2;
		this.statusConverter["par"] = 3;
		this.statusConverter["slp"] = 4;
		this.statusConverter["frz"] = 5;
		this.statusConverter["psn"] = 6;
		this.statusConverter["tox"] = 7;
		

		this.state = [
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
			0, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
			0, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
			0, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
			0, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
			0, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
			0, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
			0, 0, 0, 0, 0, 0, 0, 
			0, 0, 0, 0, 0, 0, 0, 
			0, 0, 0];
	}

	/**
	 * @return {array}
	 */
	getGameState() {
		// called for every request
		// returns input vector for neural network

		// first, your six pokemon
		for (var i = 0; i<this.side.pokemon.length; i++) {
			Array.prototype.splice.apply(this.state, [i*21,21].concat(this.getAllyPokemonVector(this.side.pokemon[i])));
		}

		// determine the moves taken in the last turn
		var lastLog = this.side.battle.log.slice(this.side.battle.sentLogPos);
		var myMoveRegex = new RegExp('^\\|move\\|'.concat(this.side.id,"[abc]"));
		var foeMoveRegex = new RegExp("^\\|move\\|".concat(this.side.foe.id,"[abc]"));
		var moveRegex = /^\|move\|.*\|(.*)\|/;
		// if no move, vector should show 0
		this.state[231] = 0;
		this.state[232] = 0;
		for (var line in lastLog) {
			if (lastLog[line].match(myMoveRegex)) {
				// my last move
				this.state[231] = this.getMoveNumber(lastLog[line].match(moveRegex)[1]);
			} else if (lastLog[line].match(foeMoveRegex)) {
				// foe last move
				this.state[232] = this.getMoveNumber(lastLog[line].match(moveRegex)[1]);
			}
		}

		// example
		return this.state;
	}

	/**
	 * @param {Pokemon} pokemon
	 */
	getAllyPokemonVector(pokemon) {
		var pokemonStateVector = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		// pokemon id
		pokemonStateVector[0] = this.getPokemonNumber(pokemon);
		// pokemon level
		pokemonStateVector[1] = pokemon.level;
		// pokemon gender
		pokemonStateVector[2] = (pokemon.gender == "F" ? 1 : (pokemon.gender == "M" ? 2 : 0));
		// pokemon item
		pokemonStateVector[3] = pokemon.item == "" ? 0 : this.itemdex[pokemon.item];
		// pokemon base ability
		pokemonStateVector[4] = this.abilitydex[pokemon.baseAbility];
		// pokemon moves (as determined by move iteration: actual hidden power types)
		for (var i = pokemon.moveSlots.length - 1; i >= 0; i--) {
			pokemonStateVector[5 + 2*i] = this.getMoveNumber(pokemon.moveSlots[i].id, true);
			pokemonStateVector[6 + 2*i] = pokemon.moveSlots[i].pp;
		}
		// pokemon hp (real value)
		pokemonStateVector[13] = pokemon.hp;
		// pokemon status (permanent status like poison, faint)
		pokemonStateVector[14] = ((pokemon.status == "" || this.statusConverter[pokemon.status] == null) ? 0 : this.statusConverter[pokemon.status]);
		// pokemon hp
		pokemonStateVector[15] = pokemon.maxhp;
		// pokemon atk
		pokemonStateVector[16] = pokemon.stats.atk;
		// pokemon def
		pokemonStateVector[17] = pokemon.stats.def;
		// pokemon spa
		pokemonStateVector[18] = pokemon.stats.spa;
		// pokemon spd
		pokemonStateVector[19] = pokemon.stats.spd;
		// pokemon spe
		pokemonStateVector[20] = pokemon.stats.spe;

		// uh oh
		for (var i = pokemonStateVector.length - 1; i >= 0; i--) {
			if (pokemonStateVector[i] == null) {
				pokemonStateVector[i] = 0;
			}
		}

		return pokemonStateVector;
	}

	/**
	 * @param {string | Pokemon} pokemon
	 */
	getPokemonNumber(pokemon) {
		// number corresponding to a unique entry in pokedex.js
		if (typeof pokemon == 'string') {
			return this.pokedex[pokemon];
		}
		return this.pokedex[pokemon.baseTemplate.id];
	}

	/**
	 * @param {string} move
	 * @param {boolean} isAlly
	 */
	getMoveNumber(move, isAlly = false) {
		// returns num in move.js
		var moveNumber = isAlly ? this.allyMovedex[move] : this.foeMovedex[move];
		if (moveNumber == null) {
			// try to translate full name of move into move id, else return 0 for unknown
			moveNumber = this.moveTranslation[move] == null ? -1 : this.moveTranslation[move];
		}
		return moveNumber;
	}

	getTypeNumber(type) {
		// number corresponding to unique typing
	}
}

module.exports = GameState;