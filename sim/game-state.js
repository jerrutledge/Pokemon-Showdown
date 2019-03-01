// For use with Pokemon Showdown

// 'use strict';

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
mypokemon1 accuracy boost
mypokemon1 evasion boost
foepokemon1 current type
foepokemon1 current ability (once learned)
foepokemon1 atk boost
foepokemon1 def boost
foepokemon1 spa boost
foepokemon1 spd boost
foepokemon1 spe boost
foepokemon1 accuracy boost
foepokemon1 evasion boost

// battle record
win = 1, loss = 2, move request = 3, switch request = 4, teampreview = 5, choosepokemon = 6
mypokemon1 lastmove
foepokemon1 lastmove



// edge cases ???????????????????????????????????
!!  weather
!!  terrain
	trick room
	gravity
	magic room
	mud sport
	water sport
	wonder room
	my reflect
	my light screen
	my aurora veil
!!  my spikes
	my toxic spikes
	my stealth rock
	my sticky web
	my lucky chant
	my safeguard
	my tailwind
	my wish
!!  mypokemon1 confusion
	mypokemon1 infatuated
!!  mypokemon1 leech seed
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
!!  mypokemon1 taunt
	mypokemon1 critratio
	mypokemon1 heal block
	mypokemon1 imprison
	mypokemon1 nightmare
	mypokemon1 miracle eye
	mypokemon1 odor sleuth
	mypokemon1 stockpile
	mypokemon1 yawn
!!  mypokemon1 choicelock


*/

// output a game state vector from game data 
// intended as input for a neural network
/**
 * @param {Side} side
 */
class GameState {
	constructor (side) {
		this.side = side;

		// generate unique pokemon ids
		/** @type {array[]} */
		this.pokedex = [];
		var i = 1;
		var object = this.side.battle.dataCache.Pokedex;
		for (var entry in object) {
			this.pokedex[entry.toString()] = i;
			i++;
		}
		// generate move ids for allied pokemon
		/** @type {array[]} */
		this.allyMovedex = [];
		// get move numbers for enemy pokemon
		/** @type {array[]} */
		this.foeMovedex = [];
		// translate from move's readable name to move id
		/** @type {array[]} */
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
		/** @type {array[]} */
		this.itemdex = [];
		var object = this.side.battle.dataCache.Items;
		for (var entry in object) {
			this.itemdex[entry.toString()] = object[entry].num;
		}

		// load ability ids
		/** @type {array[]} */
		this.abilitydex = [];
		var object = this.side.battle.dataCache.Abilities;
		for (var entry in object) {
			this.abilitydex[entry.toString()] = object[entry].num;
		}

		// status numbers
		/** @type {array[String]} */
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
			0, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 
			0, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 
			0, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 
			0, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 
			0, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 
			0, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 
			0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, -1, 0, 0, 0, 0, 0, 0, 0,
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

		// determine if there has been a switch or a drag
		var switchRegex = new RegExp('^\\|switch\\|' + this.side.foe.id);
		//	DETERMINE IF DRAG !!!!!!!!!!!!!!!!!!!!
		// determine the moves taken in the last turn
		var myMoveRegex = new RegExp('^\\|move\\|'.concat(this.side.id,"[abc]"));
		var foeMoveRegex = new RegExp("^\\|move\\|".concat(this.side.foe.id,"[abc]"));
		var moveRegex = /^\|move\|.*\|(.*)\|/;
		// if no move, vector should show 0
		this.state[235] = 0;
		this.state[236] = 0;
		// determine enemy items
		var fromItemRegex = new RegExp(this.side.foe.id + '.*\\[from\\] item: (.*)$');
		var itemRegex = new RegExp('^\\|-.{0,3}item\\|'+this.side.foe.id);
		// determine enemy abilities
		var fromAbilityRegex = new RegExp(this.side.foe.id + '.*\\[from\\] ability: (.*)$');
		var fromFoeAbilityRegex = new RegExp('.*\\[from\\] ability: (.*)\|[of]' + this.side.foe.id);
		var abilityRegex = new RegExp('^\\|-.{0,3}ability\\|'+this.side.foe.id);

		// look at log from the last turn
		var lastLog = this.side.battle.log.slice(this.side.battle.sentLogPos);
		for (var line in lastLog) {
			if (lastLog[line].match(switchRegex)) {
				// switch the pokemon
				var inputs = this.side.battle.inputLog.slice(-2);
				var switchInput = ">"+this.side.foe.id+" switch";
				inputs = inputs[1].includes(switchInput) ? inputs[1] : 
					inputs[0].includes(switchInput) ? inputs[0] : null;
				if (inputs !== null) {
					var switchIndex = parseInt(inputs.substring(inputs.length - 1));
					// switch row switchIndex with row 1 of foe Pokemon
					var oldLeadVector = this.state.slice(126,141);
					Array.prototype.splice.apply(this.state, 
						[126,15].concat(this.state.slice(111+switchIndex*15,126+switchIndex*15)));
					Array.prototype.splice.apply(this.state, 
						[111+switchIndex*15,15].concat(oldLeadVector));
				}
			} else if (lastLog[line].match(myMoveRegex)) {
				// my last move
				this.state[235] = this.getMoveNumber(lastLog[line].match(moveRegex)[1]);
			} else if (lastLog[line].match(foeMoveRegex)) {
				// foe last move
				this.state[236] = this.getMoveNumber(lastLog[line].match(moveRegex)[1]);
				// this.state[]
			} else if (lastLog[line].match(fromItemRegex) || lastLog[line].match(itemRegex)) {
				var item = this.side.foe.pokemon[0].item;
				this.state[129] = item == "" ? 0 : this.itemdex[item];
			}
			if (lastLog[line].match(fromAbilityRegex) || 
					lastLog[line].match(abilityRegex) || 
					lastLog[line].match(fromFoeAbilityRegex) ) {
				var ability = this.side.foe.pokemon[0].baseAbility;
				this.state[130] = ability == "" ? 0 : this.abilitydex[ability];
			}
		}

		// then, their six pokemon
		for (var i = this.side.foe.pokemon.length - 1; i >= 0; i--) {
			Array.prototype.splice.apply(this.state, [126+i*15,15].concat(this.getFoePokemonVector(this.side.foe.pokemon[i], this.state.splice(126+i*15,141+i*15))));
		}

		// mypokemon1 current type
		this.state[216] = 0;
		// mypokemon1 current ability
		this.state[217] = 0;
		// mypokemon1 atk boost
		this.state[218] = this.side.active[0] == null ? 0 : this.side.active[0].boosts.atk;
		// mypokemon1 def boost
		this.state[219] = this.side.active[0] == null ? 0 : this.side.active[0].boosts.def;
		// mypokemon1 spa boost
		this.state[220] = this.side.active[0] == null ? 0 : this.side.active[0].boosts.spa;
		// mypokemon1 spd boost
		this.state[221] = this.side.active[0] == null ? 0 : this.side.active[0].boosts.spd;
		// mypokemon1 spe boost
		this.state[222] = this.side.active[0] == null ? 0 : this.side.active[0].boosts.spe;
		// mypokemon1 accuracy boost
		this.state[223] = this.side.active[0] == null ? 0 : this.side.active[0].boosts.accuracy;
		// mypokemon1 evasion boost
		this.state[224] = this.side.active[0] == null ? 0 : this.side.active[0].boosts.evasion;

		// foepokemon1 current type
		this.state[225] = 0;
		// foepokemon1 current ability
		this.state[226] = -1; // unknown
		// foepokemon1 atk boost
		this.state[227] = this.side.foe.active[0] == null ? 0 : this.side.foe.active[0].boosts.atk;
		// foepokemon1 def boost
		this.state[228] = this.side.foe.active[0] == null ? 0 : this.side.foe.active[0].boosts.def;
		// foepokemon1 spa boost
		this.state[229] = this.side.foe.active[0] == null ? 0 : this.side.foe.active[0].boosts.spa;
		// foepokemon1 spd boost
		this.state[230] = this.side.foe.active[0] == null ? 0 : this.side.foe.active[0].boosts.spd;
		// foepokemon1 spe boost
		this.state[231] = this.side.foe.active[0] == null ? 0 : this.side.foe.active[0].boosts.spe;
		// foepokemon1 accuracy boost
		this.state[232] = this.side.foe.active[0] == null ? 0 : this.side.foe.active[0].boosts.accuracy;
		// foepokemon1 evasion boost
		this.state[233] = this.side.foe.active[0] == null ? 0 : this.side.foe.active[0].boosts.evasion;

		// determine the request
		switch (this.side.currentRequest) {
			// pokemon choice & win/loss never reaches here
			case "teampreview":
				this.state[234] = 5;
				break;
			case "switch":
				this.state[234] = 4;
				break;
			case "move":
				this.state[234] = 3;
				break;
			default:
				// assume request = "" aka wait
				this.state[234] = 0;
		}

		// determine the moves taken in the last turn
		var lastLog = this.side.battle.log.slice(this.side.battle.sentLogPos);
		var myMoveRegex = new RegExp('^\\|move\\|'.concat(this.side.id,"[abc]"));
		var foeMoveRegex = new RegExp("^\\|move\\|".concat(this.side.foe.id,"[abc]"));
		var moveRegex = /^\|move\|.*\|(.*)\|/;
		// if no move, vector should show 0
		this.state[235] = 0;
		this.state[236] = 0;
		// determine enemy items
		var fromItemRegex = new RegExp(this.side.foe.id + '.*\\[from\\] item: (.*)$');
		var itemRegex = new RegExp('^\\|-.?.?.?item\\|'+this.side.foe.id);
		for (var line in lastLog) {
			if (lastLog[line].match(myMoveRegex)) {
				// my last move
				this.state[235] = this.getMoveNumber(lastLog[line].match(moveRegex)[1]);
			} else if (lastLog[line].match(foeMoveRegex)) {
				// foe last move
				this.state[236] = this.getMoveNumber(lastLog[line].match(moveRegex)[1]);
			} else if (lastLog[line].match(fromItemRegex) || lastLog[line].match(itemRegex)) {
				var item = this.side.foe.pokemon[0].item;
				this.state[129] = item == "" ? 0 : this.itemdex[item];
			}
		}

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
	 * @param {Pokemon} pokemon
	 * @param {array} oldVector
	 */
	getFoePokemonVector(pokemon, oldVector) {
		// the goal is not to change any "unknown" value if possible
		var pokemonStateVector = oldVector;

		// pokemon id
		pokemonStateVector[0] = this.getPokemonNumber(pokemon);
		// pokemon level
		pokemonStateVector[1] = pokemon.level;
		// pokemon gender
		pokemonStateVector[2] = (pokemon.gender == "F" ? 1 : (pokemon.gender == "M" ? 2 : 0));
		// pokemon item
		var item = pokemon.item == "" ? 0 : this.itemdex[pokemon.item];
		pokemonStateVector[3] = pokemonStateVector[3] == -1 ? -1 : item;
		// pokemon base ability
		var ability = this.abilitydex[pokemon.baseAbility];
		pokemonStateVector[4] = pokemonStateVector[4] == -1 ? -1 : ability;
		// // pokemon moves (as determined by move iteration: actual hidden power types)
		// for (var i = pokemon.moveSlots.length - 1; i >= 0; i--) {
		// 	pokemonStateVector[5 + 2*i] = this.getMoveNumber(pokemon.moveSlots[i].id, true);
		// 	pokemonStateVector[6 + 2*i] = pokemon.moveSlots[i].pp;
		// }
		// pokemon hp (percent)
		pokemonStateVector[13] = Math.ceil(pokemon.hp / pokemon.maxhp * 100) == 100 && 
			pokemon.hp < pokemon.maxhp ? 99 : Math.ceil(pokemon.hp / pokemon.maxhp * 100);
		// pokemon status (permanent status like poison, faint)
		pokemonStateVector[14] = ((pokemon.status == "" || 
			this.statusConverter[pokemon.status] == null) ? 0 : 
			this.statusConverter[pokemon.status]);

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