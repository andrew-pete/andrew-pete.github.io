// Functions that calculate Expected shots For / Against
function ExpShots_self (obj) {
	return 0.66* (obj.controlled_entry_with[obj.number]) +
	0.29* (obj.uncontrolled_entry_with[obj.number]);
}

function ExpShots_self_against (obj) {
	return 0.66* (obj.controlled_entry_with_against[obj.number]) +
	0.29* (obj.uncontrolled_entry_with_against[obj.number]);
}

function ExpShots_for_with(obj, player_id) {
	return 0.66 *(obj.controlled_entry_with[player_id]) +
	0.29 * (obj.uncontrolled_entry_with[player_id]);
}

function ExpShots_against_with(obj, player_id) {
	return 0.66 *(obj.controlled_entry_with_against[player_id]) +
	0.29 * (obj.uncontrolled_entry_with_against[player_id]);
}

function ExpShots_for_wo(obj, player_id) {
	return 0.66 *(obj.controlled_entry_without[player_id]) +
	0.29 * (obj.uncontrolled_entry_without[player_id]);
}

function ExpShots_against_wo(obj, player_id) {
	return 0.66 *(obj.controlled_entry_without_against[player_id]) +
	0.29 * (obj.uncontrolled_entry_without_against[player_id]);
}

var adjustmentCoefficients = {
	"0": [1.000,1.000],
	"1": [1.057, 0.943],
	"2": [1.098, 0.902],
	"3": [1.142, 0.858],
	"-2": [0.902, 1.098],
	"-3": [0.858, 1.142],
	"-1": [0.943, 1.057]
};

var scoreAdjusted = function(args) {
	if (args.score > 3) args.score = 3;
	else if (args.score < -3) args.score = -3;

	return adjustmentCoefficients[args.score][ (args.isFor)? 0 : 1 ] * args.fenwick;
};


/* Returns JSON for actual improvement given a player and who he plays with
For an individual player bar graph => 				EXPECTED
	player 		-	player
	playerWith	-	player (SAME AS ABOVE)
For multiple players bar graph
	player 		-	the first player
	playerWith 	-	the second players

For either, with_player:
	1 = With
	0 = Without 						*/
function performance(player, player_with, isWith) {
	var self_for = ExpShots_self(player);
	var self_against = ExpShots_self_against(player);
	var self_percentage = self_for/(self_for+self_against);
	if (isWith == 1) {
		var with_for = ExpShots_for_with(player, player_with);
		var with_against = ExpShots_against_with(player, player_with);
		var percentage = with_for/(with_for+with_against);
		var dif = percentage - self_percentage;
	}
	else {
		var without_for = ExpShots_for_wo(player, player_with);
		var without_against = ExpShots_against_wo(player, player_with);
		var percentage = without_for/(without_for+without_against);
		var dif = percentage - self_percentage;
	}
	//dif = dif > 0 ? ("+"+dif*100+"%") : (dif*100+"%");
	return {percentage: percentage, difference: dif, with_events: with_for + with_against};
}

/* Returns JSON for actual improvement given a player and who he plays with
For an individual player bar graph => 				ACTUAL
	player 		-	player
	playerWith	-	player (SAME AS ABOVE)
For multiple players bar graph
	player 		-	the first player
	playerWith 	-	the second players

For either, with_player:
	1 = With
	0 = Without 						*/
function actual_performance(player, player_with, isWith) {
	var self_for = player.for_fenwick_with[player.number];
	var self_against = player.against_fenwick_with[player.number];
	var self_percentage = self_for/(self_for + self_against);
	if (isWith == 1) {
		var with_for = player.for_fenwick_with[player_with];
		var with_against = player.against_fenwick_with[player_with];
		var percentage = with_for/(with_for+with_against);
		var dif = percentage - self_percentage;
	}
	else {
		var without_for = player.for_fenwick_without[player_with];
		var without_against = player.against_fenwick_without[player_with];
		var percentage = without_for/(without_for+without_against);
		var dif = percentage - self_percentage;
	}
	return {percentage: percentage, difference: dif, with_events: with_for + with_against};
}

//Returns a list of players who play better with the given player - Expected
function best_NZ_pairs(player) {
	var positive_players = [];
	var numbers = [3,10,12,14,15,17,19,20,21,22,23,24,25,28,32,36,40,47,52,53,55,58,76,78,82,89,93];
	for(var i in numbers) {
		if (numbers[i] != player.number) {
			var player_performance = performance(player, numbers[i], 1);
			if (player_performance.difference > 0) {
				console.log(numbers[i]);
				positive_players.push(numbers[i]);
			}
		}
	}
	return positive_players;
}

//Returns a list of players who play better with the given player - Actual
function best_actual_pairs(player) {
	var positive_players = [];
	var numbers = [3,10,12,14,15,17,19,20,21,22,23,24,25,28,32,36,40,47,52,53,55,58,76,78,82,89,93];
	for(var i in numbers) {
		if (numbers[i] != player.number) {
			var player_performance = actual_performance(player, numbers[i], 1);
			if (player_performance.difference > 0) {
				positive_players.push(numbers[i]);
			}
		}
	}
	return positive_players;
}

// Returns the player who will result in best performance for this player - Expected
function best_NZ(player) {
	var best_player = Number.MIN_SAFE_INTEGER;
	var best_performance= {with_events: 0, difference: Number.MIN_SAFE_INTEGER};
	var numbers = [3,10,12,14,15,17,19,20,21,22,23,24,25,28,32,36,40,47,52,53,55,58,76,78,82,89,93];
	for(var i in numbers) {
		if (numbers[i] != player.number) {
			var player_performance = performance(player, numbers[i], 1);
			console.log(player_performance);

			if ( (player_performance.with_events > 50 || (player_performance.with_events > best_performance.with_events)) && player_performance.difference > best_performance.difference ) {
				best_player = numbers[i];
				best_performance = player_performance;
			}
		}
	}
	return best_player;
}

// Returns the player who will result in best performance for this player - Actual
function best_actual(player) {
	var best_player = Number.MIN_SAFE_INTEGER;
	var best_performance= {with_events: 0, difference: Number.MIN_SAFE_INTEGER};

	var numbers = [3,10,12,14,15,17,19,20,21,22,23,24,25,28,32,36,40,47,52,53,55,58,76,78,82,89,93];
	for(var i in numbers) {
		if (numbers[i] != player.number) {
			var player_performance = actual_performance(player, numbers[i], 1);
			console.log(player_performance);
			if ((player_performance.with_events > 50 || (player_performance.with_events > best_performance.with_events)) && player_performance.difference > best_performance.difference) {
				best_player = numbers[i];
				best_performance = player_performance;
			}
		}
	}
	return best_player;
}
