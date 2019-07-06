// For use with Pokemon Showdown

// 'use strict';


/********************************************************************/
/*                       Vector Structure                           */
/********************************************************************/

// // ally pokemon, values are always known
// mypokemon1 level
// mypokemon1 male
// mypokemon1 female
// mypokemon1 hp (real value)
// mypokemon1 max hp
// mypokemon1 atk
// mypokemon1 def
// mypokemon1 spa
// mypokemon1 spd
// mypokemon1 spe
// mypokemon1 id
// mypokemon1 item
// mypokemon1 ability
// mypokemon1 moves (one entry for each unique move in the game)
// 		(value = pp the move has)
// mypokemon1 status (permanent status like poison, faint)


// // status effects for my side
// mypokemon1 atk boost
// mypokemon1 def boost
// mypokemon1 spa boost
// mypokemon1 spd boost
// mypokemon1 spe boost
// mypokemon1 accuracy boost
// mypokemon1 evasion boost
// mypokemon1 hasType (true or false for every type)
// mypokemon1 current ability
// mypokemon1 aqua ring
// mypokemon1 bound
// mypokemon1 can switch
// mypokemon1 curse
// mypokemon1 defense curl
// mypokemon1 embargo
// mypokemon1 encore
// mypokemon1 focus energy
// mypokemon1 foresight
// mypokemon1 gastro acid
// mypokemon1 heal block
// mypokemon1 imprison
// mypokemon1 infatuated
// mypokemon1 ingrain
// mypokemon1 laser focus
// mypokemon1 leech seed
// mypokemon1 lock on
// mypokemon1 magnet rise
// mypokemon1 miracle eye
// mypokemon1 mustrecharge
// mypokemon1 nightmare
// mypokemon1 perish song
// mypokemon1 power trick
// mypokemon1 taunt
// mypokemon1 telekinesis
// mypokemon1 torment
// mypokemon1 yawn
// mypokemon1 confusion
// mypokemon1 stockpile
// mypokemon1 substitute


// // foe pokemon, begin as -1 = not known, changed to known from battle stack
// foepokemon1 level (always known)
// foepokemon1 male (always known)
// foepokemon1 female (always known)
// foepokemon1 hp (always known as % of full)
// foepokemon1 id (always known)
// foepokemon1 item
// foepokemon1 ability
// foepokemon1 moves
// foepokemon1 status (permanent status like poison, faint)


// // status effects for enemy side
// foepokemon1 atk boost
// foepokemon1 def boost
// foepokemon1 spa boost
// foepokemon1 spd boost
// foepokemon1 spe boost
// foepokemon1 accuracy boost
// foepokemon1 evasion boost
// foepokemon1 hasType (true or false for every type)
// foepokemon1 current ability (once learned)


// // stage battle effects
// value 0 = not in effect
// value = number of turns left
// rain
// sun
// hail
// sandstorm
// electric terrain
// grassy terrain
// misty terrain
// psychic terrain
// trick room
// wonder room
// magic room
// gravity
// mud sport
// water sport


// // last moves
// mypokemon1 lastmove
// foepokemon1 lastmove


// // game state
// win
// loss
// move request
// switch request
// choosepokemon
// failed choice



/*
// TODO:
// WIP
!!	weather
!!	terrain
	trick room
	wonder room
	magic room
	gravity
	water sport
	mud sport
	side aurora veil
	side canMegaEvolve
	side canZmove
	side heal block
	side light screen
	side lucky chant
	side mist
	side reflect
	side safeguard
	side spikes
	side stealth rock
	side sticky web
	side tailwind
	side toxic spikes
	side wish


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
		/** @type {int} */
		this.allyLastMove = 0;
		/** @type {int} */
		this.foeLastMove = 0;
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

		// binary volatiles - they are active or not i.e. 1 or 0
		/** @type {array[int]} */
		this.binaryVolatiles = [];
		this.binaryVolatiles[0] = "aquaring";
		this.binaryVolatiles[1] = "attract";
		this.binaryVolatiles[2] = "curse";
		this.binaryVolatiles[3] = "defensecurl";
		this.binaryVolatiles[4] = "focusenergy";
		this.binaryVolatiles[5] = "foresight";
		this.binaryVolatiles[6] = "gastroacid";
		this.binaryVolatiles[7] = "imprison";
		this.binaryVolatiles[8] = "ingrain";
		this.binaryVolatiles[9] = "laserfocus";
		this.binaryVolatiles[10] = "leechseed";
		this.binaryVolatiles[11] = "lockon";
		this.binaryVolatiles[12] = "miracleeye";
		this.binaryVolatiles[13] = "mustrecharge";
		this.binaryVolatiles[14] = "nightmare";
		this.binaryVolatiles[15] = "powertrick";
		this.binaryVolatiles[16] = "torment";
		this.binaryVolatiles[17] = "trapped";
		this.binaryVolatiles[18] = "yawn";

		// duration volatiles - last for a variable number of turns
		/** @type {array[int]} */
		this.durationVolatiles = [];
		this.durationVolatiles[0] = "embargo";
		this.durationVolatiles[1] = "encore";
		this.durationVolatiles[2] = "healblock";
		this.durationVolatiles[3] = "magnetrise";
		this.durationVolatiles[4] = "partiallytrapped";
		this.durationVolatiles[5] = "perishsong";
		this.durationVolatiles[6] = "taunt";
		this.durationVolatiles[7] = "telekinesis";

	}

	/**
	 * @return {array}
	 */
	getGameState() {
		// called for every request
		// returns input string to be parsed by python

		var state = "";


		// look at log from the last turn

		// determine the moves taken in the last turn
		var myMoveRegex = new RegExp('^\\|move\\|'.concat(this.side.id,"[abc]"));
		var foeMoveRegex = new RegExp("^\\|move\\|".concat(this.side.foe.id,"[abc]"));
		var moveRegex = /^\|move\|.*\|(.*)\|/;
		// if no moves, move number should be -1
		// TODO
		// var moveOrderIndex = 0;
		this.allyLastMove = -1;
		this.foeLastMove = -1;
		// determine if enemy items were revealed
		var fromItemRegex = new RegExp(this.side.foe.id + '.*\\[from\\] item: (.*)$');
		var itemRegex = new RegExp('^\\|-.{0,3}item\\|'+this.side.foe.id);
		// determine if enemy abilities were revealed
		var fromAbilityRegex = new RegExp(this.side.foe.id + '.*\\[from\\] ability: (.*)$');
		var fromFoeAbilityRegex = new RegExp('.*\\[from\\] ability: (.*)\|[of]' + this.side.foe.id);
		var abilityRegex = new RegExp('^\\|-.{0,3}ability\\|'+this.side.foe.id);

		var lastLog = this.side.battle.log.slice(this.side.battle.sentLogPos);
		for (var line in lastLog) {
			if (lastLog[line].match(myMoveRegex)) {
				// my last move
				this.allyLastMove = this.getMoveNumber(lastLog[line].match(moveRegex)[1]);
			} else if (lastLog[line].match(foeMoveRegex)) {
				// foe last move
				var moveName = lastLog[line].match(moveRegex)[1];
				this.foeLastMove = this.getMoveNumber(moveName);
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


		// construct the state string

		// first, your six pokemon
		for (var i = 0; i<this.side.pokemon.length; i++) {
			state += this.getPokemonVector(this.side.pokemon[i], true);
		}

		// my pokemon status
		state += this.getPokemonStatus(this.side.active[0], true);

		// then, their six pokemon
		for (var i = this.side.foe.pokemon.length - 1; i >= 0; i--) {
			state += this.getPokemonVector(this.side.foe.pokemon[i], false);
		}

		// foe pokemon status
		state += this.getPokemonStatus(this.side.foe.active[0], false);


		
		// TODO 
		// determine the request
		switch (this.side.currentRequest) {
			// pokemon choice & win/loss never reaches here
			case "teampreview":
				state += "(4/6)";
				break;
			case "switch":
				state += "(3/6)";
				break;
			case "move":
				state += "(2/6)";
				break;
		}

		// take off the last comma?
		return state;
	}

	/**
	 * @param {Pokemon} pokemon
	 * @param {boolean} ally
	 */
	getPokemonVector(pokemon, ally) {
		var pokemonState = "";

		// pokemon level
		pokemonState += pokemon.level + ",";
		// pokemon male
		pokemonState += (pokemon.gender == "M" ? 1 : 0) + ",";
		// pokemon female
		pokemonState += (pokemon.gender == "F" ? 1 : 0) + ",";
		if (ally) {
			// pokemon hp (real value)
			pokemonState += pokemon.hp + ",";
			// pokemon max hp
			pokemonState += pokemon.maxhp + ",";
			// pokemon atk
			pokemonState += pokemon.stats.atk + ",";
			// pokemon def
			pokemonState += pokemon.stats.def + ",";
			// pokemon spa
			pokemonState += pokemon.stats.spa + ",";
			// pokemon spd
			pokemonState += pokemon.stats.spd + ",";
			// pokemon spe
			pokemonState += pokemon.stats.spe + ",";
		} else {
			pokemonState += Math.ceil(pokemon.hp / pokemon.maxhp * 100) == 100 && 
				pokemon.hp < pokemon.maxhp ? 99 : Math.ceil(pokemon.hp / pokemon.maxhp * 100);
			pokemonState += ",";
		}
		// pokemon id
		pokemonState += "(";
		pokemonState += this.getPokemonNumber(pokemon);
		pokemonState += "/" + Object.keys(this.pokedex).length + "),";
		// pokemon item
		pokemonState += "(";
		if (pokemon.item != "" && pokemon.item != null) {
			pokemonState += this.itemdex[pokemon.item];
		}
		pokemonState += "/" + Object.keys(this.itemdex).length + "),";
		// pokemon ability
		pokemonState += "(";
		if (ally || pokemon.revealAbility) {
			pokemonState += this.abilitydex[pokemon.baseAbility];
		}
		pokemonState += "/" + Object.keys(this.abilitydex).length + "),";
		// pokemon moves (one entry for each unique move in the game)
		for (var i = pokemon.moveSlots.length - 1; i >= 0; i--) {
			pokemonState += "(";
			if (ally || pokemon.moveSlots[i].used) {
				pokemonState += this.getMoveNumber(pokemon.moveSlots[i].id, ally);
			}
			pokemonState += "/" + Object.keys(ally ? this.allyMovedex : 
				this.foeMovedex).length + "),";
			if (ally || pokemon.moveSlots[i].used) {
				if (pokemon.moveSlots[i].disabled) {
					// disabled moves have pp value of -duration of disable
					if ("disable" in pokemon.volatiles) {
						pokemonState += "-" + pokemon.volatiles.disable.duration + ",";
					} else if ("taunt" in pokemon.volatiles) {
						pokemonState += "-" + pokemon.volatiles.taunt.duration + ",";
					} else {
						pokemonState += "-1,";
					}
				} else {
					pokemonState += pokemon.moveSlots[i].pp + ",";
				}
			} else {
				pokemonState += "0,";
			}
		}
		// if the pokemon knows less than 4 moves, insert blank moves
		for (var i = 4 - pokemon.moveSlots.length - 1; i >= 0; i--) {
			pokemonState += "(/" + Object.keys(ally ? this.allyMovedex : 
				this.foeMovedex).length + "),";
			pokemonState += "0,";
		}
		// pokemon status (permanent status like poison, faint)
		pokemonState += "(";
		if (pokemon.status != "" && this.statusdex[pokemon.status] != null) {
			pokemonState += this.statusdex[pokemon.status];
		}
		pokemonState += "/" + Object.keys(this.statusdex).length + "),";

		return pokemonState;
	}

	/**
	 * @param {Pokemon} pokemon
	 * @param {boolean} revealAbility
	 */
	getPokemonStatus(pokemon, revealAbility) {
		var pokemonStatus = "";

		// check to see if pokemon is null
		if (pokemon == null) {
			var statusLength = 7 + Object.keys(this.types).length;
			statusLength += Object.keys(this.abilitydex).length;
			return "(/" + statusLength + "),";
		}


		// pokemon atk boost
		pokemonStatus += pokemon.boosts.atk + ",";
		// pokemon def boost
		pokemonStatus += pokemon.boosts.def + ",";
		// pokemon spa boost
		pokemonStatus += pokemon.boosts.spa + ",";
		// pokemon spd boost
		pokemonStatus += pokemon.boosts.spd + ",";
		// pokemon spe boost
		pokemonStatus += pokemon.boosts.spe + ",";
		// pokemon accuracy boost
		pokemonStatus += pokemon.boosts.accuracy + ",";
		// pokemon evasion boost
		pokemonStatus += pokemon.boosts.evasion + ",";
		// pokemon hasType (true or false for every type)
		pokemonStatus += "(" + this.types;
		pokemonStatus += "/" + Object.keys(this.types).length + "),";
		// pokemon current ability
		pokemonStatus += "(";
		if (revealAbility || pokemon.revealAbility) {
			pokemonStatus += this.abilitydex[pokemon.ability];
		}
		pokemonStatus += "/" + Object.keys(this.abilitydex).length + "),";



		// --- VOLATILES ---

		for (var i = 0; i < Object.keys(this.binaryVolatiles).length; i++) {
			pokemonStatus += (this.binaryVolatiles[i] in pokemon.volatiles) ? "1," : "0,";
		}

		for (var i = 0; i < Object.keys(this.durationVolatiles).length; i++) {
			if (this.durationVolatiles[i] in pokemon.volatiles) {
				pokemonStatus += pokemon.volatiles[this.durationVolatiles[i]].duration + ",";
			} else {
				pokemonStatus += "0,";
			}
		}


		// confusion
		if ("confusion" in pokemon.volatiles) {
			pokemonStatus += pokemon.volatiles.confusion.time + ",";
		} else {
			pokemonStatus += "0,";
		}
		// stockpile
		if ("stockpile" in pokemon.volatiles) {
			pokemonStatus += pokemon.volatiles.stockpile.layers + ",";
		} else {
			pokemonStatus += "0,";
		}
		// substitute
		if ("substitute" in pokemon.volatiles) {
			pokemonStatus += pokemon.volatiles.substitute.hp + ",";
		} else {
			pokemonStatus += "0,";
		}

		return pokemonStatus;
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