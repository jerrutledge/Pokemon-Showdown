// For use with Pokemon Showdown

'use strict';

// output a game state vector from game data 
// intended as input for a neural network
class GameState {
	constructor (side) {
		this.side = side;

		this.pokedex = [];
		var i = 1;
		var object = this.side.battle.dataCache.Pokedex;
		for (var entry in object) {
			this.pokedex[entry.toString()] = i;
			i++;
		}
		this.state = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	}

	getGameState() {
		// called for every request
		// returns input vector for neural network

		// first, your six pokemon, then their six
		var pokemonArray = this.state.slice(0,6);
		for (var i = 0; i<this.side.pokemon.length; i++) {
			pokemonArray[i] = this.getPokemonNumber(this.side.pokemon[i]);
		}
		Array.prototype.splice.apply(this.state, [0,6].concat(pokemonArray));

		// example
		return this.state;
	}

	getPokemonNumber(pokemon) {
		// number corresponding to a unique entry in pokedex.js
		return this.pokedex[pokemon.baseTemplate.id];
	}

	getAbilityNumber(ability) {

	}

	getMoveNumber(move) {
		// number corresponding to a unique entry in move.js
	}

	getTypeNumber(type) {
		// number corresponding to unique type
	}

	getNatureNumber(nature) {
		natures = {
			adamant:{name: "Adamant", number: 1},
			bashful:{name: "Bashful", number: 2},
			bold:{name: "Bold", number: 3},
			brave:{name: "Brave", number: 4},
			calm:{name: "Calm", number: 5},
			careful:{name: "Careful", number: 6},
			docile:{name: "Docile", number: 7},
			gentle:{name: "Gentle", number: 8},
			hardy:{name: "Hardy", number: 9},
			hasty: {name: "Hasty", number: 10},
			impish: {name: "Impish", number: 11},
			jolly: {name: "Jolly", number: 12},
			lax: {name: "Lax", number: 13},
			lonely: {name: "Lonely", number: 14},
			mild: {name: "Mild", number: 15},
			modest: {name: "Modest", number: 16},
			naive: {name: "Naive", number: 17},
			naughty: {name: "Naughty", number: 18},
			quiet: {name: "Quiet", number: 19},
			quirky: {name: "Quirky", number: 20},
			rash: {name: "Rash", number: 21},
			relaxed: {name: "Relaxed", number: 22},
			sassy: {name: "Sassy", number: 23},
			serious: {name: "Serious", number: 24},
			timid: {name: "Timid", number: 25},
		};
	}
}

module.exports = GameState;