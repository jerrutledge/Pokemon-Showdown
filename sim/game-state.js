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
// mypokemon1 volatiles

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
// foepokemon1 volatiles

// // stage battle effects
// value 0 = not in effect
// value = number of turns left
// weather
// terrain
// pseudo weather

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
side canMegaEvolve
side canZmove

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

		// terrain numbers
		/** @type {array[int]} */
		this.terrainNumbers = [];
		this.terrainNumbers['electricterrain'] = 0;
		this.terrainNumbers['grassyterrain'] = 1;
		this.terrainNumbers['mistyterrain'] = 2;
		this.terrainNumbers['psychicterrain'] = 3;

		// weather numbers
		/** @type {array[int]} */
		this.weatherNumbers = [];
		this.weatherNumbers['deltastream'] = 0;
		this.weatherNumbers['desolateland'] = 1;
		this.weatherNumbers['hail'] = 2;
		this.weatherNumbers['primordialsea'] = 3;
		this.weatherNumbers['raindance'] = 4;
		this.weatherNumbers['sandstorm'] = 5;
		this.weatherNumbers['sunnyday'] = 6;

		// pseudo weather numbers
		/** @type {array[int]} */
		this.pseudoWeatherNumbers = [];
		this.pseudoWeatherNumbers['fairylock'] = 0;
		this.pseudoWeatherNumbers['gravity'] = 1;
		this.pseudoWeatherNumbers['magicroom'] = 2;
		this.pseudoWeatherNumbers['mudsport'] = 3;
		this.pseudoWeatherNumbers['trickroom'] = 4;
		this.pseudoWeatherNumbers['watersport'] = 5;
		this.pseudoWeatherNumbers['wonderroom'] = 6;

		// side conditions
		/** @type {array[int]} */
		this.sideConditionNumbers = [];
		this.sideConditionNumbers['auroraveil'] = 0;
		this.sideConditionNumbers['healingwish'] = 1;
		this.sideConditionNumbers['lightscreen'] = 2;
		this.sideConditionNumbers['luckychant'] = 3;
		this.sideConditionNumbers['lunardance'] = 4;
		this.sideConditionNumbers['mist'] = 5;
		this.sideConditionNumbers['reflect'] = 6;
		this.sideConditionNumbers['safeguard'] = 7;
		this.sideConditionNumbers['spikes'] = 8;
		this.sideConditionNumbers['stealthrock'] = 9;
		this.sideConditionNumbers['stickyweb'] = 10;
		this.sideConditionNumbers['tailwind'] = 11;
		this.sideConditionNumbers['toxicspikes'] = 12;
		this.sideConditionNumbers['Wish'] = 13;
	}

	/**
	 * @return {array}
	 */
	getGameState() {
		// called for every request
		// returns input string to be parsed by python

		var state = "";


		// look at log from the last turn

		// determine if enemy items were revealed
		var fromItemRegex = new RegExp(this.side.foe.id + '.*\\[from\\] item: (.*)$');
		var itemRegex = new RegExp('^\\|-.{0,3}item\\|'+this.side.foe.id);
		// determine if enemy abilities were revealed
		var fromAbilityRegex = new RegExp(this.side.foe.id + '.*\\[from\\] ability: (.*)$');
		var fromFoeAbilityRegex = new RegExp('.*\\[from\\] ability: (.*)\|[of]' + this.side.foe.id);
		var abilityRegex = new RegExp('^\\|-.{0,3}ability\\|'+this.side.foe.id);

		var lastLog = this.side.battle.log.slice(this.side.battle.sentLogPos);
		for (var line in lastLog) {
			if (lastLog[line].match(fromItemRegex) || lastLog[line].match(itemRegex)) {
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
		// my side status
		state += this.getSideStatus(this.side);


		// then, their six pokemon
		for (var i = this.side.foe.pokemon.length - 1; i >= 0; i--) {
			state += this.getPokemonVector(this.side.foe.pokemon[i], false);
		}
		// foe pokemon status
		state += this.getPokemonStatus(this.side.foe.active[0], false);
		// foe side status
		state += this.getSideStatus(this.side.foe);


		// weather
		for (var condition in this.weatherNumbers) {
			if (this.side.battle.weather == condition) {
				if (!this.side.battle.weatherData.duration) {
					state += "10,";
				} else {
					state += this.side.battle.weatherData.duration + ",";
				}
			} else {
				state += "0,";
			}
		}
		// terrain
		for (var condition in this.terrainNumbers) {
			if (this.side.battle.terrain == condition) {
				state += this.side.battle.terrainData.duration + ",";
			} else {
				state += "0,";
			}
		}
		// pseudo weather
		for (var condition in this.pseudoWeatherNumbers) {
			if (condition in this.side.battle.pseudoWeather) {
				state += this.side.battle.pseudoWeather[condition].duration + ",";
			} else {
				state += "0,";
			}
		}
		
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
	 * @param {boolean} ally
	 */
	getPokemonStatus(pokemon, ally) {
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
		if (ally || pokemon.revealAbility) {
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

		// last move used by the pokemon
		pokemonStatus += "(";
		if (pokemon.lastMove) {
			pokemonStatus += this.getMoveNumber(pokemon.lastMove.id, ally);
		}
		pokemonStatus += "/" + Object.keys(ally ? this.allyMovedex : 
				this.foeMovedex).length + "),";

		return pokemonStatus;
	}

	/**
	 * @param {Side} side
	 */
	getSideStatus(side) {
		var state = "";

		for (var condition in this.sideConditionNumbers) {
			if (condition in side.sideConditions) {
				if (!side.sideConditions[condition].duration) {
					if (!side.sideConditions[condition].layers) {
						state += "1,";
					} else {
						state += side.sideConditions[condition].layers + ",";
					}
				} else {
					state += side.sideConditions[condition].duration + ",";
				}
			} else {
				state += "0,";
			}
		}

		// mega
		state += side.choice.mega ? "1," : "0,";
		// ultra
		state += side.choice.ultra ? "1," : "0,";
		// zmove
		state += side.choice.zMove ? "1," : "0,";

		return state;
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