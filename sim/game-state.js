// For use with Pokemon Showdown

// 'use strict';

/*
TODO:

// WIP
!!	weather
!!	terrain
!	trick room
	gravity
	magic room
	mud sport
	water sport
	wonder room
	side reflect
	side light screen
	side aurora veil
!!	side spikes
!!	side toxic spikes
!!	side stealth rock
!!	side sticky web
	side lucky chant
	side safeguard
	side tailwind
	side wish
	side canZmove
	side canMegaEvolve
!!	activePokemon confusion
	activePokemon infatuated
!	activePokemon leech seed
!	activePokemon ingrain
	activePokemon aqua ring
!	activePokemon can switch
!!	activePokemon substitute
	activePokemon surehit
	activePokemon curse
	activePokemon embargo
	activePokemon gastro acid
	activePokemon magnet rise
	activePokemon perish song
	activePokemon power trick
	activePokemon telekinesis
!	activePokemon move1 disabled
!	activePokemon move2 disabled
!	activePokemon move3 disabled
!	activePokemon move4 disabled
!	activePokemon encore
!!	activePokemon taunt
	activePokemon critratio
	activePokemon heal block
	activePokemon imprison
	activePokemon nightmare
	activePokemon miracle eye
	activePokemon odor sleuth
	activePokemon stockpile
	activePokemon yawn
	activePokemon trapped

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
		this.statusdex = [];
		this.statusdex["fnt"] = 0;
		this.statusdex["brn"] = 1;
		this.statusdex["par"] = 2;
		this.statusdex["slp"] = 3;
		this.statusdex["frz"] = 4;
		this.statusdex["psn"] = 5;
		this.statusdex["tox"] = 6;

		// type numbers
		/** @type {array[int]} */
		this.types = [];
		this.types["NORMAL"] = 1;
		this.types["Normal"] = 1;
		this.types["Fire"] = 2;
		this.types["Water"] = 3;
		this.types["Electric"] = 4;
		this.types["Grass"] = 5;
		this.types["Ice"] = 6;
		this.types["Fighting"] = 7;
		this.types["Poison"] = 8;
		this.types["Ground"] = 9;
		this.types["Flying"] = 10;
		this.types["Psychic"] = 11;
		this.types["Bug"] = 12;
		this.types["Rock"] = 13;
		this.types["Ghost"] = 14;
		this.types["Dragon"] = 15;
		this.types["Dark"] = 16;
		this.types["Steel"] = 17;
		this.types["Fairy"] = 18;
		


		/********************************************************************/
		/*                       Vector Structure                           */
		/********************************************************************/

		/** @type {array[int]} */
		this.state = [];

		// ally pokemon, contains actual values
		for (var j = 0; j < 6; j++) {
			// mypokemon1 level
			this.state = this.state.concat(0);
			// mypokemon1 male
			this.state = this.state.concat(0);
			// mypokemon1 female
			this.state = this.state.concat(0);
			// mypokemon1 hp (real value)
			this.state = this.state.concat(0);
			// mypokemon1 max hp
			this.state = this.state.concat(0);
			// mypokemon1 atk
			this.state = this.state.concat(0);
			// mypokemon1 def
			this.state = this.state.concat(0);
			// mypokemon1 spa
			this.state = this.state.concat(0);
			// mypokemon1 spd
			this.state = this.state.concat(0);
			// mypokemon1 spe
			this.state = this.state.concat(0);
			// mypokemon1 id
			for (var i = Object.keys(this.pokedex).length - 1; i >= 0; i--) {
				this.state = this.state.concat(0);
			}
			// mypokemon1 item
			for (var i = Object.keys(this.itemdex).length - 1; i >= 0; i--) {
				this.state = this.state.concat(0);
			}
			// mypokemon1 ability
			for (var i = Object.keys(this.abilitydex).length - 1; i >= 0; i--) {
				this.state = this.state.concat(0);
			}
			// mypokemon1 moves (one entry for each unique move in the game)
			// 		(value = pp the move has)
			for (var i = Object.keys(this.allyMovedex).length - 1; i >= 0; i--) {
				this.state = this.state.concat(0);
			}
			// mypokemon1 status (permanent status like poison, faint)
			for (var i = Object.keys(this.statusdex).length - 1; i >= 0; i--) {
				this.state = this.state.concat(0);
			}
		}
		/** @type {int} */
		this.myPokemonLength = 10 + Object.keys(this.pokedex).length + Object.keys(this.itemdex).length + 
			Object.keys(this.abilitydex).length + Object.keys(this.allyMovedex).length + Object.keys(this.statusdex).length;

		
		// status effects for my side
		/** @type {int} */
		this.myStatusIndex = Object.keys(this.state).length;
		// mypokemon1 hasType (true or false for every type)
		for (var i = Object.keys(this.types).length - 1; i >= 0; i--) {
			this.state = this.state.concat(0);
		}
		// mypokemon1 current ability
		for (var i = Object.keys(this.abilitydex).length - 1; i >= 0; i--) {
			this.state = this.state.concat(0);
		}
		// mypokemon1 atk boost
		this.state = this.state.concat(0);
		// mypokemon1 def boost
		this.state = this.state.concat(0);
		// mypokemon1 spa boost
		this.state = this.state.concat(0);
		// mypokemon1 spd boost
		this.state = this.state.concat(0);
		// mypokemon1 spe boost
		this.state = this.state.concat(0);
		// mypokemon1 accuracy boost
		this.state = this.state.concat(0);
		// mypokemon1 evasion boost
		this.state = this.state.concat(0);
		/** @type {int} */
		this.pokemonStatusLength = 7 + Object.keys(this.types).length + Object.keys(this.abilitydex).length;



		/** @type {int} */
		this.foePokemonIndex = Object.keys(this.state).length;
		// // foe pokemon, begin as -1 = not known, changed to known from battle stack
		for (var j = 0; j < 6; j++) {
			// foepokemon1 level (always known)
			this.state = this.state.concat(0);
			// foepokemon1 male (always known)
			this.state = this.state.concat(0);
			// foepokemon1 female (always known)
			this.state = this.state.concat(0);
			// foepokemon1 hp (always known as % of full)
			this.state = this.state.concat(0);
			// foepokemon1 id (always known)
			for (var i = Object.keys(this.pokedex).length - 1; i >= 0; i--) {
				this.state = this.state.concat(0);
			}
			// foepokemon1 item
			for (var i = Object.keys(this.itemdex).length - 1; i >= 0; i--) {
				this.state = this.state.concat(0);
			}
			// foepokemon1 ability
			for (var i = Object.keys(this.abilitydex).length - 1; i >= 0; i--) {
				this.state = this.state.concat(0);
			}
			// foepokemon1 moves
			for (var i = Object.keys(this.foeMovedex).length - 1; i >= 0; i--) {
				this.state = this.state.concat(-1);
			}
			// foepokemon1 status (permanent status like poison, faint)
			for (var i = Object.keys(this.statusdex).length - 1; i >= 0; i--) {
				this.state = this.state.concat(0);
			}
		}
		/** @type {int} */
		this.foePokemonLength = 4 + Object.keys(this.pokedex).length + Object.keys(this.itemdex).length + 
			Object.keys(this.abilitydex).length + Object.keys(this.foeMovedex).length + Object.keys(this.statusdex).length;

		// // status effects for enemy side
		/** @type {int} */
		this.foeStatusIndex = Object.keys(this.state).length;
		// foepokemon1 hasType (true or false for every type)
		for (var i = Object.keys(this.types).length - 1; i >= 0; i--) {
			this.state = this.state.concat(0);
		}
		// foepokemon1 current ability (once learned)
		for (var i = Object.keys(this.abilitydex).length - 1; i >= 0; i--) {
			this.state = this.state.concat(0);
		}
		// foepokemon1 atk boost
		this.state = this.state.concat(0);
		// foepokemon1 def boost
		this.state = this.state.concat(0);
		// foepokemon1 spa boost
		this.state = this.state.concat(0);
		// foepokemon1 spd boost
		this.state = this.state.concat(0);
		// foepokemon1 spe boost
		this.state = this.state.concat(0);
		// foepokemon1 accuracy boost
		this.state = this.state.concat(0);
		// foepokemon1 evasion boost
		this.state = this.state.concat(0);


		// stage battle effects
		// value 0 = not in effect
		// value = number of turns left
		/** @type {int} */
		this.globalStatusIndex = Object.keys(this.state).length;
		// rain
		this.state = this.state.concat(0);
		// sun
		this.state = this.state.concat(0);
		// hail
		this.state = this.state.concat(0);
		// sandstorm
		this.state = this.state.concat(0);
		// electric terrain
		this.state = this.state.concat(0);
		// grassy terrain
		this.state = this.state.concat(0);
		// misty terrain
		this.state = this.state.concat(0);
		// psychic terrain
		this.state = this.state.concat(0);
		// trick room
		this.state = this.state.concat(0);
		// gravity
		this.state = this.state.concat(0);
		// magic room
		this.state = this.state.concat(0);
		// mud sport
		this.state = this.state.concat(0);
		// water sport
		this.state = this.state.concat(0);
		// wonder room
		this.state = this.state.concat(0);

		/** @type {int} */
		this.lastMoveIndex = Object.keys(this.state).length;
		// mypokemon1 lastmove
		for (var i = Object.keys(this.allyMovedex).length - 1; i >= 0; i--) {
			this.state = this.state.concat(0);
		}
		// foepokemon1 lastmove 
		for (var i = Object.keys(this.foeMovedex).length - 1; i >= 0; i--) {
			this.state = this.state.concat(0);
		}

		// game state
		/** @type {int} */
		this.gameStateIndex = Object.keys(this.state).length;
		// win
		this.state = this.state.concat(0);
		// loss
		this.state = this.state.concat(0);
		// move request
		this.state = this.state.concat(0);
		// switch request
		this.state = this.state.concat(0);
		// choosepokemon
		this.state = this.state.concat(0);
		// failed choice
		this.state = this.state.concat(0);
	}

	/**
	 * @return {array}
	 */
	getGameState() {
		// called for every request
		// returns input vector for neural network

		// first, your six pokemon
		for (var i = 0; i<this.side.pokemon.length; i++) {
			args = [i*this.myPokemonLength,this.myPokemonLength];
			args = args.concat(this.getAllyPokemonVector(this.side.pokemon[i]));
			Array.prototype.splice.apply(this.state, args);
		}

		// determine the moves taken in the last turn
		var myMoveRegex = new RegExp('^\\|move\\|'.concat(this.side.id,"[abc]"));
		var foeMoveRegex = new RegExp("^\\|move\\|".concat(this.side.foe.id,"[abc]"));
		var moveRegex = /^\|move\|.*\|(.*)\|/;
		// if no move, vector should show 0
		for (var i = 0; i < Object.keys(this.allyMovedex).length + this.foeMovedex; i++) {
			this.state[this.lastMoveIndex + i] = 0;
		}
		// determine if enemy items were revealed
		var fromItemRegex = new RegExp(this.side.foe.id + '.*\\[from\\] item: (.*)$');
		var itemRegex = new RegExp('^\\|-.{0,3}item\\|'+this.side.foe.id);
		// determine if enemy abilities were revealed
		var fromAbilityRegex = new RegExp(this.side.foe.id + '.*\\[from\\] ability: (.*)$');
		var fromFoeAbilityRegex = new RegExp('.*\\[from\\] ability: (.*)\|[of]' + this.side.foe.id);
		var abilityRegex = new RegExp('^\\|-.{0,3}ability\\|'+this.side.foe.id);

		// look at log from the last turn
		var lastLog = this.side.battle.log.slice(this.side.battle.sentLogPos);
		for (var line in lastLog) {
			if (lastLog[line].match(myMoveRegex)) {
				// my last move
				this.state[this.lastMoveIndex + this.getMoveNumber(lastLog[line].match(moveRegex)[1])] = 1;
			} else if (lastLog[line].match(foeMoveRegex)) {
				// foe last move
				var moveName = lastLog[line].match(moveRegex)[1];
				this.state[this.lastMoveIndex + Object.keys(this.allyMovedex).length + this.getMoveNumber(moveName)] = 1;
				// if no match, must be a Z move, no need to record
			} else if (lastLog[line].match(fromItemRegex) || lastLog[line].match(itemRegex)) {
				this.side.foe.pokemon[0].revealItem = true;
			}
			if (lastLog[line].match(fromAbilityRegex) || 
					lastLog[line].match(abilityRegex) || 
					lastLog[line].match(fromFoeAbilityRegex) ) {
				this.side.foe.pokemon[0].revealAbility = true;
			}
		}

		// then, their six pokemon
		for (var i = this.side.foe.pokemon.length - 1; i >= 0; i--) {
			args = [this.foePokemonIndex+i*this.foePokemonLength,this.foePokemonLength];
			args = args.concat(this.getFoePokemonVector(this.side.foe.pokemon[i]))
			Array.prototype.splice.apply(this.state, args);
		}

		// my pokemon status
		if (!(this.side.active[0] == null)) {
			var args = [this.myStatusIndex, this.pokemonStatusLength];
			args = args.concat(this.getPokemonStatus(this.side.active[0], true));
			Array.prototype.splice.apply(this.state, args);
		}

		// foe pokemon status
		if (!(this.side.foe.active[0] == null)) {
			var args = [this.foeStatusIndex, this.pokemonStatusLength];
			args = args.concat(this.getPokemonStatus(this.side.foe.active[0], false));
			Array.prototype.splice.apply(this.state, args);
		}


		
		// determine the request
		// gamestate changes every round
		for (var i = 0; i < 6; i++) {
			this.state[this.gameStateIndex + i] = 0;
		}
		switch (this.side.currentRequest) {
			// pokemon choice & win/loss never reaches here
			case "teampreview":
				this.state[this.gameStateIndex + 4] = 1;
				break;
			case "switch":
				this.state[this.gameStateIndex + 3] = 1;
				break;
			case "move":
				this.state[this.gameStateIndex + 2] = 1;
				break;
		}

		return this.state;
	}

	/**
	 * @param {Pokemon} pokemon
	 */
	getAllyPokemonVector(pokemon) {
		var pokemonStateVector = [];
		for (var i = 0; i < this.myPokemonLength; i++) {
			pokemonStateVector = pokemonStateVector.concat(0);
		}

		// index variable, to keep track of position in array
		var index = 0;

		// pokemon status (permanent status like poison, faint)
		pokemonStateVector[14] = ((pokemon.status == "" || this.statusdex[pokemon.status] == null) ? 0 : this.statusdex[pokemon.status]);
		// pokemon level
		pokemonStateVector[index] = pokemon.level;
		index++;
		// pokemon male
		pokemonStateVector[index] = pokemon.gender == "M" ? 1 : 0;
		index++;
		// pokemon female
		pokemonStateVector[index] = pokemon.gender == "F" ? 1 : 0;
		index++;
		// pokemon hp (real value)
		pokemonStateVector[index] = pokemon.hp;
		index++;
		// pokemon max hp
		pokemonStateVector[index] = pokemon.maxhp;
		index++;
		// pokemon atk
		pokemonStateVector[index] = pokemon.stats.atk;
		index++;
		// pokemon def
		pokemonStateVector[index] = pokemon.stats.def;
		index++;
		// pokemon spa
		pokemonStateVector[index] = pokemon.stats.spa;
		index++;
		// pokemon spd
		pokemonStateVector[index] = pokemon.stats.spd;
		index++;
		// pokemon spe
		pokemonStateVector[index] = pokemon.stats.spe;
		index++;
		// pokemon id
		pokemonStateVector[index + this.getPokemonNumber(pokemon)] = 1;
		index += Object.keys(this.pokedex).length;
		// pokemon item
		if (pokemon.item != "" && pokemon.item != null) {
			pokemonStateVector[index + this.abilitydex[pokemon.baseAbility]] = 1;
		}
		index += Object.keys(this.itemdex).length;
		// pokemon ability
		pokemonStateVector[index + this.abilitydex[pokemon.baseAbility]] = 1;
		index += Object.keys(this.abilitydex).length;
		// pokemon moves (one entry for each unique move in the game)
		for (var i = pokemon.moveSlots.length - 1; i >= 0; i--) {
			var moveNumber = this.getMoveNumber(pokemon.moveSlots[i].id, true);
			pokemonStateVector[index + moveNumber] = pokemon.moveSlots[i].pp;
		}
		index += Object.keys(this.allyMovedex).length;
		// pokemon status (permanent status like poison, faint)
		if (pokemon.status != "" && this.statusdex[pokemon.status] != null) {
			pokemonStateVector[index + this.statusdex[pokemon.status]] = 1;
		}


		// sanity check
		for (var i = pokemonStateVector.length - 1; i >= 0; i--) {
			if (pokemonStateVector[i] == null) {
				pokemonStateVector[i] = 0;
			}
		}

		return pokemonStateVector;
	}

	/**
	 * @param {Pokemon} pokemon
	 */
	getFoePokemonVector(pokemon) {
		var pokemonStateVector = [];
		for (var i = 0; i < this.foePokemonLength; i++) {
			pokemonStateVector = pokemonStateVector.concat(0);
		}

		// index variable, to keep track of position in array
		var index = 0;

		// foepokemon1 level (always known)
		pokemonStateVector[index] = pokemon.level;
		index++;
		// foepokemon1 male (always known)
		pokemonStateVector[index] = pokemon.gender == "M" ? 1 : 0;
		index++;
		// foepokemon1 female (always known)
		pokemonStateVector[index] = pokemon.gender == "F" ? 1 : 0;
		index++;
		// foepokemon1 hp (always known as % of full)
		pokemonStateVector[index] = Math.ceil(pokemon.hp / pokemon.maxhp * 100) == 100 && 
			pokemon.hp < pokemon.maxhp ? 99 : Math.ceil(pokemon.hp / pokemon.maxhp * 100);
		index++;
		// foepokemon1 id (always known)
		pokemonStateVector[index + this.getPokemonNumber(pokemon)] = 1;
		index += Object.keys(this.pokedex).length;
		// foepokemon1 item (unknown initally)
		if (pokemon.revealItem) {
			pokemonStateVector[index + this.itemdex[pokemon.item]] = 1;
		} else {
			for (var i = 0; i < Object.keys(this.itemdex).length; i++) {
				pokemonStateVector[index + i] = -1;
			}
		}
		index += Object.keys(this.itemdex).length;
		// foepokemon1 ability
		if (pokemon.revealAbility) {
			pokemonStateVector[index + this.abilitydex[pokemon.baseAbility]] = 1;
		} else {
			for (var i = 0; i < Object.keys(this.abilitydex).length; i++) {
				pokemonStateVector[index + i] = -1;
			}
		}
		index += Object.keys(this.abilitydex).length;
		// foepokemon1 moves
		for (var i = 0; i < Object.keys(this.abilitydex).length; i++) {
			pokemonStateVector[index + i] = -1;
		}
		for (var i = pokemon.moveSlots.length - 1; i >= 0; i--) {
			if (pokemon.moveSlots[i].used == true) {
				var moveNumber = this.getMoveNumber(pokemon.moveSlots[i].id, true);
				pokemonStateVector[index + moveNumber] = pokemon.moveSlots[i].pp;
			}
		}
		index += Object.keys(this.foeMovedex).length;
		// foepokemon1 status (permanent status like poison, faint)
		if (!(pokemon.status == "" || this.statusdex[pokemon.status] == null)) {
			pokemonStateVector[index + this.statusdex[pokemon.status]] = 1;
		}

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
	 * @param {boolean} revealAbility
	 */
	getPokemonStatus(pokemon, revealAbility) {
		var pokemonStatusVector = [];
		for (var i = 0; i < this.pokemonStatusLength; i++) {
			pokemonStatusVector = pokemonStatusVector.concat(0);
		}

		var index = 0;

		// mypokemon1 hasType (true or false for every type)
		for (var i = 0; i < pokemon.types; i++) {
			pokemonStatusVector[this.types[pokemon.types[i]]] = 1;
		}
		index += Object.keys(this.types).length;
		// mypokemon1 current ability
		if (revealAbility || pokemon.revealAbility) {
			pokemonStatusVector[index + this.abilitydex[pokemon.ability]] = 1;
		}
		index += Object.keys(this.abilitydex).length;
		// mypokemon1 atk boost
		this.state[index] = pokemon.boosts.atk;
		index++;
		// mypokemon1 def boost
		this.state[index] = pokemon.boosts.def;
		index++;
		// mypokemon1 spa boost
		this.state[index] = pokemon.boosts.spa;
		index++;
		// mypokemon1 spd boost
		this.state[index] = pokemon.boosts.spd;
		index++;
		// mypokemon1 spe boost
		this.state[index] = pokemon.boosts.spe;
		index++;
		// mypokemon1 accuracy boost
		this.state[index] = pokemon.boosts.accuracy;
		index++;
		// mypokemon1 evasion boost
		this.state[index] = pokemon.boosts.evasion;
		index++;

		return pokemonStatusVector;
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
}

module.exports = GameState;