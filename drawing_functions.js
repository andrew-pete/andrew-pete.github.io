// The array that keeps track of the selected players in the second step.
var panel_lst = [];

// The json object that keeps track of the condition of the WITH button associated with each player
// True if it is clicked, false if no click is made
var clicked_with = {	"3":false,"10":false,"12":false,"14":false,
						"15":false,"17":false,"19":false,"20":false,
						"21":false,"22":false,"23":false,"24":false,
						"25":false,"28":false,"32":false,"36":false,
						"40":false,"47":false,"52":false,"53":false,
						"55":false,"58":false,"76":false,"78":false,
						"82":false,"89":false,"93":false};

// The json object that keeps track of the condition of the WITHOUT button associated with each player
// True if it is clicked, false if no click is made
var clicked_without = {	"3":false,"10":false,"12":false,"14":false,
						"15":false,"17":false,"19":false,"20":false,
						"21":false,"22":false,"23":false,"24":false,
						"25":false,"28":false,"32":false,"36":false,
						"40":false,"47":false,"52":false,"53":false,
						"55":false,"58":false,"76":false,"78":false,
						"82":false,"89":false,"93":false};

// The json object that keeps track of the condition of the player selection buttons
var wowy_active = {		"3":false,"10":false,"12":false,"14":false,
						"15":false,"17":false,"19":false,"20":false,
						"21":false,"22":false,"23":false,"24":false,
						"25":false,"28":false,"32":false,"36":false,
						"40":false,"47":false,"52":false,"53":false,
						"55":false,"58":false,"76":false,"78":false,
						"82":false,"89":false,"93":false};
var tooltip = {
	show: function (player, isExp) {
		var func = (isExp) ? performance : actual_performance;
		if (!tooltip.self) tooltip.self = d3.select(".tooltip");
		tooltip.self.html(((isExp) ? "NZ " : "") +  "F%: " + Math.round((func(player, player.number, true).percentage || 0) * 10000)/100 + "%")
			.style({
				left: d3.event.pageX,
				top: d3.event.pageY - 20,
				opacity: 0.9,
			});
	},
	hide: function () {
		tooltip.self.style("opacity", 0);
	}
};
/* Draws in a button a given player for the Player Selection Panels*/
function draw_button(d,i){
	var right_x = right.attr("x");
	var right_y = right.attr("y");
	var rect_color = "#5E4CFF";

	//Left panel
	if (d < 28) {
		//Add Name of player
		main_svg.append("text").attr("class", "leftpaneltext"+d+" leftpaneltext")
		.attr("x", +85)
		.attr("y", +i*35 + +25)
		.attr("text-anchor","middle")
		.attr("alignment-baseline","middle")
		.style({
			fill: "rgba(0,0,0,0.85)",
			"font-size": 13
		})
		.text(players[d].name);

		//Add transparent button rectangle over the text element
		main_svg.append("rect").attr("class", "leftpanel"+d+" leftpanel")
		.attr("x", +20).attr("y", i*35 + +10).attr("width",130).attr("height", 25)
		.attr("rx",5).attr("ry",5).style("fill",rect_color).style("opacity",0.5)
		.on("click", function () {
			firstplayer_selected(players[d],d);
		})
		.on("mouseover", function () { mouseover(true,d) })
		.on("mouseout", function () { mouseout(true,d)});
	}
	//Right Panel
	else {
		//Add Name of player
		main_svg.append("text").attr("class", "rightpaneltext"+d+" rightpaneltext")
		.attr("x", +85 + +right_x)
		.attr("y", +(i%14)*35 + +25 + +right_y)
		.attr("text-anchor","middle")
		.attr("alignment-baseline","middle")
		.style({
			fill: "rgba(0,0,0,0.85)",
			"font-size": 13
		})
		.text(players[d].name);

		//Add transparent button rectangle over the text element
		main_svg.append("rect").attr("class","rightpanel"+d+" rightpanel")
		.attr("x", +20 + +right_x)
		.attr("y", +(i%14)*35 + +right_y + +10)
		.attr("width",130)
		.attr("height", 25)
		.attr("rx",5)
		.attr("ry",5)
		.style("fill",rect_color)
		.style("opacity",0.5)
		.on("click", function () {
			firstplayer_selected(players[d],d);
		})
		.on("mouseover", function () { mouseover(false,d)})
		.on("mouseout", function () { mouseout(false,d)});
	}

	// The function that is triggered on mouseover event
	function mouseover(leftpanel, player_id) {
		var rect;
		var txt;
		if (leftpanel) {
			rect = main_svg.select(".leftpanel"+player_id);
			txt = main_svg.select(".leftpaneltext"+player_id);

		}
		else {
			rect = main_svg.select(".rightpanel"+player_id);
			txt = main_svg.select(".rightpaneltext"+player_id);
		}

		rect.style("fill","blue");
		add_to_ice(main_svg,rink,players[player_id],"on_ice1");
		txt.style("font-weight","bold");
		var self = lower_svg.selectAll(".self"+player_id);
		var actual_self = lower_svg.selectAll(".actual_self"+player_id);
		self.attr("r",15);
		actual_self.attr("r",15);
		make_player_card(player_info_box1, player_id, "pinfo1", false);
	}

	// The function that is triggered on mouseout event
	function mouseout(leftpanel, player_id) {
		var rect;
		var txt;
		if(leftpanel) {
			rect = main_svg.select(".leftpanel"+d);
    		txt = main_svg.select(".leftpaneltext"+d);

		}
		else {
			rect = main_svg.select(".rightpanel"+d);
    		txt = main_svg.select(".rightpaneltext"+d);
		}
		rect.style("fill",rect_color);
		txt.style("font-weight","");
		d3.selectAll(".on_ice1").remove();
		var self = lower_svg.selectAll(".self"+d);
		var actual_self = lower_svg.selectAll(".actual_self"+d);
		self.attr("r",10);
		actual_self.attr("r",10);
		d3.selectAll("g.pinfo1").remove();
		d3.selectAll("text.pinfo1").remove();
	}
}

/* Initialize the wowy graphs, the selecion panels to the default
  setting*/
function initialize(team,players){

	// Remove existings elements from all svg.
	main_svg.selectAll(".rightpanel").remove();
	main_svg.selectAll(".rightpaneltext").remove();

	main_svg.selectAll(".leftpanel").remove();
	main_svg.selectAll(".leftpaneltext").remove();

	main_svg.selectAll(".wwo").remove();
	main_svg.selectAll(".woo").remove();

	lower_svg.selectAll(".with").remove();
	lower_svg.selectAll(".self").remove();
	lower_svg.selectAll(".selflabel").remove();

	d3.selectAll(".pairs").remove();
	d3.selectAll(".on_ice1").remove();
	d3.selectAll(".on_ice2").remove();
	more_info_text.text("Select a player");

	panel_lst = [];
	// Selection Sections (Add Left/Add Right)
	num.forEach(function (d,i) {
			draw_button(d,i);
			// Set the variable to default value
			wowy_active[d] = false;
			clicked_with[d] = false;
			clicked_without[d] = false;
	});


	text = lower_svg.selectAll(".selflabel").data(team);
	text_actual = lower_svg.selectAll(".selflabel").data(team);

 	// Add the default data points for each player to both the expected graph and
 	// the actual graph

 	// Add the players' number to the expected graph

	text.enter().append("text")
	.attr("class", function(d) {return "selflabel"+" self"+d.number})
	.attr("x", function(d) { return xScale(ExpShots_self(d)); })
	.attr("y", function(d) { return yScale(ExpShots_self_against(d));})
	.style("fill","black")
	.attr("text-anchor","middle")
    .attr("alignment-baseline","middle")
	.text(function (d) {return d.number});

	//Append text to Actual WoWY
	text_actual.enter().append("text")
	.attr("class", function(d) {return "selflabel"+" actual_self"+d.number})
	.attr("x", function(d) { return 500+xScale(d.for_fenwick_with[d.number]); })
	.attr("y", function(d) { return yScale(d.against_fenwick_with[d.number]); })
	.style("fill","black")
	.attr("text-anchor","middle")
    .attr("alignment-baseline","middle")
	.text(function (d) {return d.number});

	initial = lower_svg.selectAll(".self").data(team);
	ini_actual = lower_svg.selectAll(".self").data(team);


	//Append circle to Expected WoWY
	initial.enter().append("circle")
	.attr("class", function (d) {return "self"+ " self"+d.number})
	.attr("cx", function(d) { return xScale(ExpShots_self(d)); })
	.attr("cy", function(d) { return yScale(ExpShots_self_against(d)); })
	.attr("r",10)
	.style("fill","blue")
	.style("opacity",0.5)
	.on("mouseover", function (d) {
		make_player_card(player_info_box1, d, "pinfo1", true);
		tooltip.show(d, true);
	})
	.on("mouseout", function () {
		tooltip.hide();
		d3.selectAll("g.pinfo1").remove();
		d3.selectAll("text.pinfo1").remove()});

	//Append circle to Actual WoWY
	ini_actual.enter().append("circle")
	.attr("class", function (d) {return "self"+" actual_self"+d.number})
	.attr("cx", function(d) { return 500+xScale(d.for_fenwick_with[d.number]); })
	.attr("cy", function(d) { return yScale(d.against_fenwick_with[d.number]); })
	.attr("r",10)
	.style("fill","blue")
	.style("opacity",0.5)
	.on("mouseover", function (d) {
		make_player_card(player_info_box1, d, "pinfo1", true);
		tooltip.show(d, false)
	})
	.on("mouseout", function () {
		tooltip.hide();
		d3.selectAll("g.pinfo1").remove();
		d3.selectAll("text.pinfo1").remove()});
	//Hide description of bottom graph
	$('.bottom_description').hide(400);

}


/*	After the first player is selected, choose the other players to
	see the data. */
function firstplayer_selected(player,id) {
		//Refresh the board to after a first player is selected
		more_info_text.text("Select another player");
		$('.bottom_description').show(400);
		d3.selectAll(".pairs").attr("visibility","");
		createCumulative(player);
		createBars(player, id, 1);

		//Non selected rectangle color
		var rect_color = "#5E4CFF";

		//removes 	-	All previous information on main and lower panels
		main_svg.selectAll(".rightpanel").remove();
		main_svg.selectAll(".leftpanel").remove();

		lower_svg.selectAll(".selflabel").remove();
		lower_svg.selectAll(".self").remove();

		//appends 	-	A Circle and Player Number to Expected WoWY for player 1
		lower_svg.append("text").attr("class", "selflabel")
		.attr("x", xScale(ExpShots_self(player))).attr("y", yScale(ExpShots_self_against(player)))
		.style("fill","black").attr("text-anchor","middle").attr("alignment-baseline","middle").text(id);

		lower_svg.append("circle").attr("class", "self")
		.attr("cx", xScale(ExpShots_self(player))).attr("cy", yScale(ExpShots_self_against(player)))
		.attr("r",10).style("fill","blue").style("opacity",0.5)
		.on("mouseover", function () {
			tooltip.show(player, true);
		})
		.on("mouseout", function () {
			tooltip.hide();
		});

		//appends 	-	A Circle and Player Number to Actual WoWY for player 1
		lower_svg.append("text").attr("class", "selflabel")
		.attr("x", 500+xScale(player.for_fenwick_with[id])).attr("y", yScale(player.against_fenwick_with[id]))
		.style("fill","black").attr("text-anchor","middle").attr("alignment-baseline","middle").text(id);

		lower_svg.append("circle").attr("class", "self")
		.attr("cx", 500+xScale(player.for_fenwick_with[id])).attr("cy", yScale(player.against_fenwick_with[id]))
		.attr("r",10).style("fill","blue").style("opacity",0.6)
		.on("mouseover", function () {
			tooltip.show(player, false);
		})
		.on("mouseout", function () {
			tooltip.hide();
		});

		//appends 	-	Best NZ Pairs & Best Actual Pairs Buttons
		main_svg.append("text").attr("class", "pairs").text("Best NZ Pair").attr("x",293).attr("y",305)
		.style("text-anchor","middle").style("alignment-baseline","middle");
		var nz=main_svg.append("rect").attr("class", "pairs").attr("x",235.5).attr("y",291.5).attr("width",115).attr("height",25)
		.style("fill", "red").style("opacity",.5).style("stroke","#d77d00").style("stroke-width","4")
		.on("click",function(){
			//Finds the best expected pair for the First player
			var best_num = best_NZ(player);
			var panl = (best_num < 28)? ".leftpanel":".rightpanel";
			var org_color = main_svg.select(panl+best_num).style("fill");
			var blink_color = (org_color=="rgb(0, 0, 255)")? "#5E4CFF":"blue";
			main_svg.select(panl+best_num).transition().duration(200).style("fill",blink_color)
			.transition().duration(200).style("fill",org_color).transition().duration(200).style("fill",blink_color)
			.transition().duration(200).style("fill",org_color);
		});

		main_svg.append("text").attr("class", "pairs").text("Best Actual Pair")
		.attr("x",707).attr("y",305).style("text-anchor","middle").style("alignment-baseline","middle");
		var actl=main_svg.append("rect").attr("class", "pairs").attr("x",649.5).attr("y",291.5).attr("width",115).attr("height",25)
		.style("fill", "red").style("opacity",.5).style("stroke","#d77d00").style("stroke-width","4")
		.on("click",function(){
			//Finds the best actual pair for the First player
			var best_num = best_actual(player);
			var panl = (best_num < 28)? ".leftpanel":".rightpanel";
			var org_color = main_svg.select(panl+best_num).style("fill");
			var blink_color = (org_color=="rgb(0, 0, 255)")? "#5E4CFF":"blue";
			main_svg.select(panl+best_num).transition().duration(200).style("fill",blink_color)
			.transition().duration(200).style("fill",org_color).transition().duration(200).style("fill",blink_color)
			.transition().duration(200).style("fill",org_color);
		});

		// Create the player selection panels
		num.forEach(function (d, i) {
			var right_x = right.attr("x");
			var right_y = right.attr("y");

			// Left Panel - rewrite it ready to select second player
			if (d < 28) {
				main_svg.append("rect").attr("class","leftpanel"+d+" leftpanel"+" player_panel")
				.attr("x", +20)
				.attr("y", i*35 + +10)
				.attr("width",130)
				.attr("height", 25)
				.attr("rx",5)
				.attr("ry",5)
				.style("fill",rect_color)
				.style("opacity",0.5)
				.on("click", function () {
					d3.select(".bar1").remove();
					if (!wowy_active[d]) {
						if (panel_lst.length > 0) {
							// Check if any with/without selection is made on previous selected player
							noclick_wowy();
						}
						wowy_active[d] = true;
						panel_lst.push(d);
						pair_selected(player,d)
				}
					else {
						panel_lst.splice(panel_lst.indexOf(d),1);
						unselect_panel(player,d,panel_lst);
						wowy_active[d] = false;
					}
				})
				.on("mouseover", function() {
					//Expand rectangle, remove old player card - add new, put the player on ice
					var rect = main_svg.select(".leftpanel"+d);
					rect.attr("width",140).attr("height",30).attr("x",+rect.attr("x") - +5).attr("y",+rect.attr("y") - +2.5);
					d3.selectAll("g.pinfo2").remove();
					d3.selectAll("text.pinfo2").remove();
					make_player_card(player_info_box2, d, "pinfo2", false);
					add_to_ice(main_svg,rink,players[d],"on_ice2");
				}).on("mouseout", function () {
					//Return rectangle to normal size, return player card to previous, take player off ice
					var rect = main_svg.select(".leftpanel"+d);
					rect.attr("width",130).attr("height",25).attr("x",+rect.attr("x") + +5).attr("y",+rect.attr("y") + +2.5);
					var last_clicked = panel_lst[panel_lst.length-1];
					d3.selectAll(".on_ice2").transition()
				    .duration(100).style("opacity", 1e-6).remove();
					if (last_clicked != d) {
						d3.selectAll("g.pinfo2").remove();
						d3.selectAll("text.pinfo2").remove();
					}
					if (panel_lst.length > 0) {
						make_player_card(player_info_box2, last_clicked, "pinfo2", false);
						add_to_ice(main_svg,rink,players[last_clicked],"on_ice2");
					}
				});
			}


			// Right Panel - rewrite it ready to select second player
			else {
				main_svg.append("rect").attr("class","rightpanel"+d+" rightpanel"+" player_panel")
				.attr("x", +20 + +right_x)
				.attr("y", +(i%14)*35 + +right_y + +10)
				.attr("width",130)
				.attr("height", 25)
				.attr("rx",5)
				.attr("ry",5)
				.style("fill",rect_color)
				.style("opacity",0.5)
				.on("click", function () {
					d3.select(".bar1").remove();
					if (!wowy_active[d]) {
						if (panel_lst.length > 0) {
							noclick_wowy();
						}
						wowy_active[d] = true;
						panel_lst.push(d);
						pair_selected(player, d)
				}
					else {
						panel_lst.splice(panel_lst.indexOf(d),1);
						unselect_panel(player,d,panel_lst);
						wowy_active[d] = false;
					}
				})
				.on("mouseover", function() {
					//Expand rectangle, remove old player card - add new, put the player on ice
					var rect = main_svg.select(".rightpanel"+d);
					d3.selectAll("g.pinfo2").remove();
					d3.selectAll("text.pinfo2").remove();
					rect.attr("width",140).attr("height",30).attr("x",+rect.attr("x") - +2.5).attr("y",+rect.attr("y") - +2.5);
					make_player_card(player_info_box2, d, "pinfo2", false);
					add_to_ice(main_svg,rink,players[d],"on_ice2");
				}).on("mouseout", function () {
					//Return rectangle to normal size, return player card to previous, take player off ice
					var rect = main_svg.select(".rightpanel"+d);
					rect.attr("width",130).attr("height",25).attr("x",+rect.attr("x") + +2.5).attr("y",+rect.attr("y") + +2.5);
					var last_clicked = panel_lst[panel_lst.length-1];
					d3.selectAll(".on_ice2").transition()
				    .duration(100).style("opacity", 1e-6).remove();
					if (last_clicked != d) {
						d3.selectAll("g.pinfo2").remove();
						d3.selectAll("text.pinfo2").remove();
					}
					if (panel_lst.length > 0) {
						make_player_card(player_info_box2, last_clicked, "pinfo2", false);
						add_to_ice(main_svg,rink,players[last_clicked],"on_ice2");
					}
				});
			}
		});
		var rect;
		if (id < 28) {
			rect = main_svg.select(".leftpanel"+id);
		}
			else {
			rect = main_svg.select(".rightpanel"+id);
		}

		rect.style("fill","blue").style("stroke","#962424")
		.style("stroke-width",5).on("mouseover",null)
		.on("mouseout",null).on("click", function() {
			d3.select("#cumulative-graph").remove();
			removeBars();
			initialize(team,players,player_info_box1);
			d3.selectAll("g.pinfo2").remove();
			d3.selectAll("text.pinfo2").remove();
		});

		// Check if any with/without selection is made on previous selected player
		function noclick_wowy() {
			var rect;
			// The previous selected player
			var unclicked_id= panel_lst[panel_lst.length-1];

			if (unclicked_id < 28)
				rect = main_svg.select(".leftpanel"+ unclicked_id);
			else
				rect = main_svg.select(".rightpanel"+unclicked_id);

			// When no selection is made, unselect the play and remove the associated with/without seleciton panel
			if (!clicked_with[unclicked_id] && !clicked_without[unclicked_id])
			 {
			 	// Unselect the player by setting the button color to default
			 	rect.style("fill","#5E4CFF");
			 	wowy_active[unclicked_id] = false;
			 	// Remove it from the array of selected players
				panel_lst.pop();
				// Remove the associated with/without selection panel
				main_svg.selectAll(".wowy1"+unclicked_id).remove();
				main_svg.selectAll(".wowy0"+unclicked_id).remove();
				main_svg.selectAll(".wowy1tx"+unclicked_id).remove();
				main_svg.selectAll(".wowy0tx"+unclicked_id).remove();
			}
		}

	}

/*
	When the second selected player is unselected, remove the
	associate data point from th graphs.*/
function unselect_panel(player, sec_num,panel_lst) {
	var rect;
	more_info_text.text("Select another player");
	if (sec_num < 28) rect = main_svg.select(".leftpanel"+sec_num);
	else rect = main_svg.select(".rightpanel"+sec_num);
	// Remove the associated data points from the WoWY graphs
	removepoint(player, sec_num, 0);
	removepoint(player, sec_num, 1);
	// Set the color of the button back to the default color
	rect.style("fill","#5E4CFF").style("stroke","none");

	// Remove the with/without buttons
	main_svg.selectAll(".wowy1"+sec_num).remove();
	main_svg.selectAll(".wowy0"+sec_num).remove();
	main_svg.selectAll(".wowy1tx"+sec_num).remove();
	main_svg.selectAll(".wowy0tx"+sec_num).remove();

	// The with/without selection of the player that you last selected
	// will be displayed.
	var last_clicked = panel_lst[panel_lst.length-1];
	var w = main_svg.selectAll(".wowy1"+last_clicked);
	var wo = main_svg.selectAll(".wowy0"+last_clicked);
	var w_tx = main_svg.selectAll(".wowy1tx"+last_clicked);
	var wo_tx = main_svg.selectAll(".wowy0tx"+last_clicked);
	w[0].forEach(function (d) { d.setAttribute("visibility","visible")});
	wo[0].forEach(function (d) { d.setAttribute("visibility","visible")});
	w_tx[0].forEach(function (d) { d.setAttribute("visibility","visible")});
	wo_tx[0].forEach(function (d) { d.setAttribute("visibility","visible")});
	var last_clicked_rect;
	if (last_clicked < 28)
		last_clicked_rect = main_svg.select(".leftpanel"+last_clicked);
	else
		last_clicked_rect = main_svg.select(".rightpanel" + last_clicked);
	last_clicked_rect.style("stroke","#962424").style("stroke-width",3);
}

/*	After the second selection is made, the with/without selection
	is generated. */
function pair_selected(player_fst, sec_num) {

	more_info_text.text("Select With or Without");

	var rect;
	if (sec_num < 28) rect = main_svg.select(".leftpanel"+sec_num);
	else rect = main_svg.select(".rightpanel"+sec_num);
	main_svg.selectAll(".player_panel").style("stroke","none");
	if (player_fst.number < 28){
		main_svg.select(".leftpanel"+player_fst.number).style("stroke","#962424").style("stroke-width",5);
	}
	else {
		main_svg.select(".rightpanel"+player_fst.number).style("stroke","#962424").style("stroke-width",5);
	}

	rect.style("fill","blue").style("stroke","#962424").style("stroke-width",3);

	var withyou;
	var withoutyou;

  	// Hide the with/without selection panels of other players
	var panel= main_svg.selectAll(".wwo");
	panel[0].forEach(function (d) { d.setAttribute("visibility","hidden")});

	//"With" between player cards
	main_svg.append("text")
	.attr("class","wowy1tx"+sec_num+" wwo")
	.attr("x",500)
	.attr("y",390)
	.style("fill","white")
	.attr("text-anchor","middle")
    .attr("alignment-baseline","middle")
	.text("With")
	.style("font-size","14");

	main_svg.append("rect")
	.attr("class","wowy1"+sec_num+" wwo")
	.attr("x",475)
	.attr("y",377.5)
	.attr("rx",5)
 	.attr("ry",5)
	.attr("width",50)
	.attr("height",20)
	.style("fill","green")
	.style("opacity",0.5);

	//"Without" between player cards
	main_svg.append("text")
	.attr("class","wowy0tx"+sec_num+" wwo")
	.attr("x",500)
	.attr("y",420)
	.style("fill","white")
	.attr("text-anchor","middle")
    .attr("alignment-baseline","middle")
	.text("Without")
	.style("font-size","14");

	main_svg.append("rect")
	.attr("class","wowy0"+sec_num+" wwo")
	.attr("x",475)
	.attr("y",407.5)
	.attr("rx",5)
	.attr("ry",5)
	.attr("width",50)
	.attr("height",20)
	.style("fill","red")
	.style("opacity",0.5);

	clicked_with[sec_num] = false;
	clicked_without[sec_num] = false;
	var active = false;
	withyou = main_svg.select(".wowy1"+sec_num);
	withoutyou = main_svg.select(".wowy0"+sec_num);
	withyou.style("opacity",0.5)
	.on("mouseover", function () {
		withyou.style("opacity",0.7);
	})
	.on("mouseout", function () {
		if(!active)
		withyou.style("opacity",0.5);
	})
	.on("click", function () {
		if (!active) {
			more_info_text.text("See Below");
			addpoint(player_fst, sec_num, 1);
			active = true;
			clicked_with[sec_num] = true;

		}
		else {
			removepoint(player_fst, sec_num, 1);
			active = false;
			clicked_with[sec_num] = false;
		}
	});

	var active2 = false;
	withoutyou.style("opacity",0.5)
	.on("mouseover", function () {
		withoutyou.style("opacity",0.7);
	})
	.on("mouseout", function () {
		if(!active2)
		withoutyou.style("opacity",0.5);
	})
	.on("click", function () {
		if (!active2) {
			more_info_text.text("See Below");
			addpoint(player_fst, sec_num, 0);
			active2 = true;
			clicked_without[sec_num] = true;
		}
		else {
			removepoint(player_fst, sec_num, 0);
			active2 = false;
			clicked_without[sec_num] = false;
		}
	});
}

/* Add the corresponding with/without player sec_num data to the
	graph given current selected player.*/
function addpoint(player, sec_num, with_player) {
	d3.selectAll(".bar"+sec_num).remove();
	var expshots_for = 0;
	var expshots_against = 0;
	var actualshots_for = 0;
	var actualshots_against = 0;
	var color = "green";
	var button;
	createBars(player,sec_num, with_player);

	// when the WITH button is clicked
	if (with_player == 1) {
		expshots_for = ExpShots_for_with(player,sec_num);
		expshots_against = ExpShots_against_with(player,sec_num);
		actualshots_for = player.for_fenwick_with[sec_num];
		actualshots_against = player.against_fenwick_with[sec_num];
		button = main_svg.select(".wowy1"+sec_num);
	}
	// when the WITHOUT button is clicked
	else {
		expshots_for = ExpShots_for_wo(player, sec_num);
		expshots_against = ExpShots_against_wo(player, sec_num);
		actualshots_for = player.for_fenwick_without[sec_num];
		actualshots_against = player.against_fenwick_without[sec_num];
		color = "red";
		button= main_svg.select(".wowy0"+sec_num);
	}

	// Upadate the opacity of the button to indicate selection
	button.style("opacity",0.7);

	// Add the line between the pair to the expected WoWY
	lower_svg.append("line")
	.attr("class","player" + sec_num + with_player+" with")
	.attr("x1",xScale(ExpShots_self(player)))
	.attr("y1",yScale(ExpShots_self_against(player)))
	.attr("x2",xScale(ExpShots_self(player)))
	.attr("y2",yScale(ExpShots_self_against(player)))
	.style("stroke", "rgba(0,0,0, 0.15)")
	.transition().duration(2000)
	.attr("x2",xScale(expshots_for))
	.attr("y2",yScale(expshots_against));

	// Add the player's number to the expected WoWY
	lower_svg.append("text")
	.attr("class", "player" + sec_num + with_player+" with")
	.attr("x", xScale(ExpShots_self(player)))
	.attr("y", yScale(ExpShots_self_against(player)))
	.attr("text-anchor","middle")
    .attr("alignment-baseline","middle")
	.style("fill", "black")
	.text(sec_num)
	.transition().duration(2000)
	.attr("x", xScale(expshots_for))
	.attr("y", yScale(expshots_against));

	// Add the data point to the expected WoWY
	lower_svg.append("circle")
	.attr("class", "player"+sec_num + with_player+ " with"+" cir"+sec_num + with_player)
	.attr("cx", xScale(ExpShots_self(player)))
	.attr("cy", yScale(ExpShots_self_against(player)))
	.attr("r",10)
	.style("fill",color)
	.style("opacity",0.5)
	.transition().duration(2000)
	.attr("cx", xScale(expshots_for))
	.attr("cy", yScale(expshots_against));

	// Add the line between pair to the actual WoWY
	lower_svg.append("line")
	.attr("class","playeractual" + sec_num + with_player+" with")
	.attr("x1",500+xScale(player.for_fenwick_with[player.number]))
	.attr("y1",yScale(player.against_fenwick_with[player.number]))
	.attr("x2",500+xScale(player.for_fenwick_with[player.number]))
	.attr("y2",yScale(player.against_fenwick_with[player.number]))
	.style("stroke", "rgba(0,0,0, 0.15)")
	.transition().duration(2000)
	.attr("x2", 500+xScale(actualshots_for))
	.attr("y2",yScale(actualshots_against));

	// Add the player's number to the actual WoWY
	lower_svg.append("text")
	.attr("class", "playeractual" + sec_num + with_player+" with")
	.attr("x", 500+xScale(player.for_fenwick_with[player.number]))
	.attr("y", yScale(player.against_fenwick_with[player.number]))
	.attr("text-anchor","middle")
    .attr("alignment-baseline","middle")
	.style("fill", "black")
	.text(sec_num)
	.transition().duration(2000)
	.attr("x", 500+xScale(actualshots_for))
	.attr("y", yScale(actualshots_against));

	// Add the data point to the actual WoWY
	lower_svg.append("circle")
	.attr("class", "playeractual"+ sec_num + with_player+ " with"+" ciract"+sec_num+with_player)
	.attr("cx", 500+xScale(player.for_fenwick_with[player.number]))
	.attr("cy", yScale(player.against_fenwick_with[player.number]))
	.attr("r",10)
	.style("fill",color)
	.style("opacity",0.5)
	.transition().duration(2000)
	.attr("cx", 500+xScale(actualshots_for))
	.attr("cy", yScale(actualshots_against));

 	// Add the tooltip
	var cir_exp = lower_svg.select(".cir"+sec_num+with_player);
	var cir_act = lower_svg.select(".ciract"+sec_num+with_player);

	var percentObject = performance(player,sec_num, with_player);
	var fenwick_percent = d3.round(percentObject.percentage * 100,2);
	var dif = percentObject.difference;

	var actualPercent = actual_performance(player,sec_num, with_player);
	var fenwick_actual_percent = d3.round(actualPercent.percentage*100,2);
	var actual_dif = actualPercent.difference;

	if (dif > 0) colorPerc = 'green';
	else colorPerc = 'red';
	if (actual_dif>0) colorActual = 'green';
	else colorActual = 'red';

	dif = dif > 0 ? ("+"+d3.round(dif*100,2)+"%") : (d3.round(dif*100,2)+"%");
	actual_dif = actual_dif > 0 ? ("+"+d3.round(actual_dif*100,2)+"%") : (d3.round(actual_dif*100,2)+"%");


	var text = 'NZ F%: ' + fenwick_percent + '% <span class = ' + colorPerc +' >(' +dif +')</span>';
	var text_actual = 'F%: ' + fenwick_actual_percent + '% <span class = ' + colorActual +' >(' +actual_dif +')</span>';

	// Trigger the tooltip on mouse hovering and hide the tip on mouse out
	cir_exp.on("mouseover", function () {
		var tip = d3.select(".tooltip");
		tip.style("opacity",0.9);
		tip.html(text)
			.style("left",d3.event.pageX + 10 + "px")
			.style("top",d3.event.pageY - 30 + "px");
	}).on("mouseout", function () {
		var tip = d3.select(".tooltip");
		tip.style("opacity",0);
	})

	cir_act.on("mouseover", function() {
		var tip = d3.select(".tooltip");
		tip.style("opacity",0.9)
			.html(text_actual)
			.style("left",d3.event.pageX + 10 + "px")
			.style("top",d3.event.pageY - 30 + "px");
	}).on("mouseout", function () {
		var tip = d3.select(".tooltip");
		tip.style("opacity",0);
	});
}

/*  Remove the data point with/without player sec_num from the
	expected wowy graph and the actual wowy graph given the
	current player.*/
function removepoint(player, sec_num, with_player) {
	var button;
	if (with_player == 1) {
		button = main_svg.select(".wowy1"+sec_num);
	}
	else {
		button = main_svg.select(".wowy0"+sec_num);
	}

	button.style("opacity",0.5);

	d3.selectAll('.bar'+sec_num).remove();

	// Remove the data point from the expected WoWY
	lower_svg.selectAll(".player"+ sec_num+ with_player)
	.transition().duration(2000)
	.attr("cx", xScale(ExpShots_self(player)))
	.attr("cy", yScale(ExpShots_self_against(player)))
	.attr("x", xScale(ExpShots_self(player)))
	.attr("y", yScale(ExpShots_self_against(player)))
	.attr("x2",xScale(ExpShots_self(player)))
	.attr("y2",yScale(ExpShots_self_against(player)))
	.remove();

	// Remove the data point from the actual WoWY
	lower_svg.selectAll(".playeractual"+sec_num+ with_player)
	.transition().duration(2000)
	.attr("cx", 500+xScale(player.for_fenwick_with[player.number]))
	.attr("cy", yScale(player.against_fenwick_with[player.number]))
	.attr("x", 500+xScale(player.for_fenwick_with[player.number]))
	.attr("y", yScale(player.against_fenwick_with[player.number]))
	.attr("x2", 500+xScale(player.for_fenwick_with[player.number]))
	.attr("y2", yScale(player.against_fenwick_with[player.number]))
	.remove();
}

/*	svg_name = name of the svg that you want to append the player card to
	player = player object (if bool = true) or player number (if bool = false) that you are making the player card for
	handle = name of the class that you want to hold the player card with
	bool = flag if you are using a player object (true) or a player number (false)   */
function make_player_card(svg_name, player, handle, bool){
	var player_val = (bool ? player.number : player);

	var card_x = svg_name.attr("x");
	var card_y = svg_name.attr("y");

	var g = main_svg.append("g")
			.attr("class",handle);

	g.append("svg:image")
	    .attr("xlink:href", "src/overlays/flyers.png")
	    .attr("width", 40)
	    .attr("height", 40)
	    .attr("x", +45 + +card_x)
	    .attr("y",+40 + +card_y);

	g.append("svg:image")
	    .attr("xlink:href", "src/player_faces/" + player_val + ".png")
	    .attr("width", 150)
	    .attr("height", 150)
	    .attr("x", +25 + +card_x)
	    .attr("y", +0 + +card_y);

	// Name
	main_svg.append("text")
		.text(players[player_val].name)
		.attr("x",+150 + + card_x)
		.attr("y",+25 + +card_y)
		.attr("class", handle)
		.style("fill","white");

	// Number and Position
	main_svg.append("text")
		.text("#" + player_val + " " + players[player_val].position)
		.attr("x",+150 + +card_x)
		.attr("y",+50 + +card_y)
		.attr("class", handle)
		.style("fill","white");
}

//Creates a graph of the players Cumulative Fenwicks, NZ and actual
function createCumulative(player) {

	//Set height, width margins and axes
	var getWidth = parseInt($('#bottom_panel').css("width"));
	var getHeight = 400;

	var margin = {top: 60, right: 160, bottom: 30, left: 50},
	    width = getWidth - margin.left - margin.right,
	    height = getHeight - margin.top - margin.bottom;

	var xScale = d3.scale.linear().range([0, width]).domain([0,82]);
	var yScale = d3.scale.linear().range([height, 0]).domain([-100,100]);

	var xAxis = d3.svg.axis().scale(xScale)
	    .orient("bottom").ticks(0);

	var yAxis = d3.svg.axis().scale(yScale)
	    .orient("left").ticks(5);

	// Create a line for expected and actual Fenwicks. Interpolate between points
	var toLine = d3.svg.line()
	    .interpolate("basis")
	    .x(function(d) { return xScale(d.gameNumber); })
	    .y(function(d) { return yScale(d.y1); });

	var toLineFenwick = d3.svg.line()
	    .interpolate("basis")
	    .x(function(d) { return xScale(d.gameNumber); })
	    .y(function(d) { return yScale(d.y2); });

	var svg = d3.select("#bottom_panel")
			.append("svg")
			.attr("id","cumulative-graph")
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom)
	    	.append("g")
	        .attr("transform",
	              "translate(" + margin.left + "," + margin.top + ")");

	//Create bisector
	bisectX = d3.bisector(function(d) { return d.gameNumber; }).left;
	var dataPlayer = player.gameCumulative;
	xScale.domain([0,d3.max(dataPlayer, function (d) {
		return d.gameNumber;
	})]);
	var maxY = d3.max(dataPlayer, function (d) {
	return d3.max([Math.abs(d.y1),Math.abs(d.y2)])
	});
	yScale.domain([-maxY,maxY]);

	svg.append("path")
		.attr("class","line1")
		.attr("d", toLine(dataPlayer));

	svg.append("path")
			.attr("class","line2")
			.attr("d", toLineFenwick(dataPlayer));

	svg.append("text")
		.text("Cumulative Shot Differential - " + player.name + " (#" + player.number +")")
		.style("fill","black")
  		.style("font-size", "1.25em")
  		.style("text-anchor", "middle")
  		.attr("x",width/2)
  		.attr("y", 0);


	// Add the X Axis
    svg.append("g")
        .attr("class", "x axis3")
        .attr("transform", "translate(0," + height/2 + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis3")
        .call(yAxis);

    svg.append("text")
    	.text("Season Progress")
  		.style("text-anchor", "end")
  		.style("fill","grey")
  		.style("font-size", "0.60em")
  		.style("opacity", "0.70")
  		.attr("x",width-2)
  		.attr("y",yScale(0))
  		.attr("dy",-4);

  	// Appends circles line where mouse will be hovering over - x axis
    var focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

    var focusEx = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

  	focus.append("circle")
      .attr("r", 4.5);

	focus.append("text")
	      .attr("x", 9)
	      .attr("dy", ".35em");
	focus.append("line")
			.attr("x1",0)
			.attr("y1",0)
			.attr("x2",0)
			.attr("y2",0)
			.style("stroke","#c8c8c8");

	focusEx.append("circle")
      .attr("r", 4.5);

	focusEx.append("text")
	      .attr("x", 9)
	      .attr("dy", ".35em");

	svg.append("rect")
	      .attr("class", "overlay")
	      .attr("width", width)
	      .attr("height", height)
	      .on("mouseover", function() { focus.style("display", null);
	      								focusEx.style("display",null); })
	      .on("mouseout", function() { focus.style("display", "none");
	  								   focusEx.style("display","none");})
	      .on("mousemove", mousemove);

	//Legends
	var legend = svg.selectAll(".legend")
      .data([{color: "lightblue", category: "NZ Fenwick"},{color: "green", category: "Fenwick"}])
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width + margin.right - 12)
      .attr("width", 12)
      .attr("height", 12)
      .style("fill", function (d) {return d.color});

  legend.append("text")
      .attr("x", width + margin.right - 16)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("font-size", "0.65em")
      .style("text-anchor", "end")
      .text(function(d) { return d.category; });

    //Actual movements - combine parts of setup above
	function mousemove() {
    var x0 = xScale.invert(d3.mouse(this)[0]),
        i = bisectX(dataPlayer, x0, 1),
        d0 = dataPlayer[i - 1],
        d1 = dataPlayer[i],
        d = x0 - d0.gameNumber > d1.gameNumber - x0 ? d1 : d0;
    focusEx.attr("transform", "translate(" + xScale(d.gameNumber) + "," + yScale(d.y1) + ")");
    focusEx.select("text").text(d3.round(d.y1,3)).style("fill","#3182bd");
    focus.attr("transform", "translate(" + xScale(d.gameNumber) + "," + yScale(d.y2) + ")");
    focus.select("text").text(d3.round(d.y2,3)).style("fill","#1bd34f");
    focus.select("line")
    	.attr("y2", yScale((d.y1-d.y2))-yScale(0));
		}
}


/* Creates the bar graphs for each player and player combination
For an individual player bar graph =>
	player 		-	player
	playerWith	-	player (SAME AS ABOVE)
For multiple players bar graph
	player 		-	the first player
	playerWith 	-	the second player

For both, with_player:
	1 = With
	0 = Without
*/
function createBars(player, playerWith, with_player) {
	//Setup
	var getWidth = 220;
	var getHeight = 100;
	var playerTest = player;
	var data;
	var title_text;
	var x_pos = 270;
	var y_pos = 390;
	var class_name = "";
	if (player.number === playerWith) {
		title_text = ' Entry Breakdown';
		data = [{Zone: "Against", Controlled: playerTest.controlled_entry_with_against[playerWith], Uncontrolled: playerTest.uncontrolled_entry_with_against[playerWith]},{Zone: "For", Controlled: playerTest.controlled_entry_with[playerWith], Uncontrolled: playerTest.uncontrolled_entry_with[playerWith]}];
	}
	else if (with_player == 1) {
		title_text = player.number + ' + ' + playerWith + ' Entry Breakdown';
		data = [{Zone: "Against", Controlled: playerTest.controlled_entry_with_against[playerWith], Uncontrolled: playerTest.uncontrolled_entry_with_against[playerWith]},{Zone: "For", Controlled: playerTest.controlled_entry_with[playerWith], Uncontrolled: playerTest.uncontrolled_entry_with[playerWith]}];
		x_pos = 595;
		var class_name = "1";
	}
	else {
		title_text = player.number + ' - ' + playerWith + ' Entry Breakdown';
		data = [{Zone: "Against", Controlled: playerTest.controlled_entry_without_against[playerWith], Uncontrolled: playerTest.uncontrolled_entry_without_against[playerWith]},{Zone: "For", Controlled: playerTest.controlled_entry_without[playerWith], Uncontrolled: playerTest.uncontrolled_entry_without[playerWith]} ];
		x_pos = 595;
		var class_name = "1";
	}
	var margin = {top: 30, right: 80, bottom: 30, left: 75},
    width = getWidth - margin.left - margin.right,
    height = getHeight - margin.top - margin.bottom;

    // Scales
    var y = d3.scale.ordinal()
    .rangeRoundBands([height, 0], .30);

	var x = d3.scale.linear()
    	.rangeRound([0, width]);
    var color = d3.scale.ordinal()
    	.range(["#98abc5", "#6b486b"]);
    // Axes
    var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .ticks(2)
	    .outerTickSize(0)
	    .orient("bottom");

	//Setup Popup to detail info
	var tip = d3.tip()
		  .attr('class', 'd3-tip')
		  .offset([-10, 0])
		  .html(function(d) {
		    return "<strong>Entries:</strong> <span style='color:turquoise'>" + (d.y1-d.y0) + "</span>";
		  });

	var svg = main_svg.append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .attr("x", x_pos)
	    .attr("y", y_pos)
	  	.append("g")
	  	.attr("class","bars"+ " bar"+ playerWith+" bar"+class_name)
	    .attr("transform", "translate(" + margin.left  + "," + margin.top + ")");

	svg.call(tip);

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Zone"; }));
    data.forEach( function (d) {
    	var y0 = 0;
    	d.entries = color.domain().map(function(name) { return {entry_type: name, y0: y0, y1: y0 += +d[name]}; });
    	d.total = d.entries[d.entries.length - 1].y1;
    });

    y.domain(data.map(function(d) { return d.Zone; }));
    x.domain([0,d3.max(data, function (d) {return d.total})]);

    svg.append("g")
		      .attr("class", "x barAxis axis3")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis);

	  svg.append("g")
	      .attr("class", "yBar barAxis axis3")
	      .call(yAxis);

	  var zone = svg.selectAll(".zone")
	      .data(data)
	      .enter().append("g")
	      .attr("class", "g")
	      .attr("transform", function(d) { return "translate(0," + y(d.Zone) + ")"; });

	  //Start bars
	  zone.selectAll("rect")
	      .data(function(d) { return d.entries; })
	      .enter().append("rect")
	      .attr("height", y.rangeBand())
	      .attr("width", 0)
	      .style("fill", function(d) { return color(d.entry_type); })
	      .on('mouseover', tip.show)
			  .on('mouseout', tip.hide)
	      .transition()
			  .delay(function (d, i) { return (i+1)*300; })
			  .duration(800)
	      .attr("x", function(d) { return x(d.y0); })
	      .attr("width", function(d) { return x(d.y1) - x(d.y0); });


	  zone.selectAll(".barline")
	  		.data(function(d) { return [d.entries[0]]; })
	  		.enter().append("line")
	  		.attr("class","barline")
	  		.style("stroke","lightblue")
	  		.attr("y1", 0)
	  		.attr("y2", 0)
	  		.attr("x1", function(d) {return x(d.y1)})
	  		.attr("x2", function(d) {return x(d.y1)})
	  		.transition()
	   		 .delay(function (d, i) { return (i+2)*300; })
	   		 .duration(800)
	  		.attr("y2",  function(d) { return y.rangeBand(); });

	  svg.append("text")
	  		.attr('class','bar_title')
	  		.attr('x', 0)
	  		.attr('y',0)
	  		.text(title_text)
	  		.style('text-anchor', 'left')

	 // LEGEND
	  var legend = svg.selectAll(".legend")
	      .data(color.domain().reverse())
	    .enter().append("g")
	      .attr("class", "legend")
	      .attr("transform", function(d, i) { return "translate(0," + (i * 20 + 10) + ")"; });

	  legend.append("rect")
	      .attr("x", width + margin.right - 12)
	      .attr("width", 12)
	      .attr("height", 12)
	      .style("fill", color);

	  legend.append("text")
	      .attr("x", width + margin.right - 16)
	      .attr("y", 9)
	      .attr("dy", ".35em")
	      .style("font-size", "0.65em")
	      .style("text-anchor", "end")
	      .text(function(d) { return d; });
}

/*
This function is called whenever a player needs to be added to the ice_rink
svg_name = svg to append to
panel_name = class of rect to append to
class_name = class of the player that you want to append
*/
function add_to_ice(svg_name,panel_name,player,class_name){
	//Setup
	var width = panel_name.attr("width");
	var height = panel_name.attr("height");
	var start_x = panel_name.attr("x");
	var start_y = panel_name.attr("y");
	var radius = 75;
	var	rink_padding = 25;

	var rink_width = width-2*rink_padding,
		rink_height = rink_width/2,
		radius2goal = radius-11/200*rink_width;

	// Whether first player selected or not
	var diff = (class_name=="on_ice2") ? 10:-10;

	// Default values for positions
	positions={
		"LW":{"x":(90/200*rink_width + +rink_padding + +start_x), "y":(+rink_padding + +rink_height/4 + +start_y + +diff)},
		"RW":{"x":(90/200*rink_width + +rink_padding + +start_x), "y":(+rink_padding + +3*rink_height/4 + +start_y + +diff)},
		"C":{"x":(90/200*rink_width + +rink_padding + +start_x), "y":(+rink_padding + +rink_height/2 + +start_y + +diff)},
		"D":{"x":(75/200*rink_width + +rink_padding + +start_x), "y":(+rink_padding + +rink_height/2 + +start_y + +diff)}
	}

	// Append Circle
	svg_name.append("circle")
		.attr("class",class_name)
		.attr("cx",positions[player.position].x)
		.attr("cy",positions[player.position].y)
		.attr("r",3.5/200*rink_width)
		.attr("fill","orange");

	// Append player's number
	svg_name.append("text")
		.attr("class",class_name)
		.attr("x",positions[player.position].x)
		.attr("y",positions[player.position].y)
		.attr("alignment-baseline","middle")
		.attr("text-anchor","middle")
		.text(player.number);

}

//Removes all bar graphs
function removeBars() {
	d3.selectAll('.bars').remove();
}

/*  Appends an ice rink to svg_name
	onto the rect with class panel_name 	*/
function draw_rink(svg_name,panel_name){
	var width = panel_name.attr("width");
	var height = panel_name.attr("height");
	var start_x = panel_name.attr("x");
	var start_y = panel_name.attr("y");
	var radius = 75;
	var	rink_padding = 25;

	var rink_width = width-2*rink_padding,
		rink_height = rink_width/2,
		radius2goal = radius-11/200*rink_width;
		goal_height = Math.sqrt(Math.pow(radius,2)-Math.pow(radius2goal,2)),
		goal_diff = radius - goal_height;

	//create outer rink
	svg_name.append("rect")
		.attr("x",+rink_padding + +start_x)
		.attr("y",+rink_padding + +start_y)
		.attr("width",rink_width)
		.attr("height",rink_height)
		.attr("rx",radius)
		.attr("ry",radius)
		.attr("fill","white")
		.attr("stroke","black")
		.attr("stroke-width","2");

	//Left goal
	svg_name.append("line")
		.attr("x1",11/200*rink_width + +rink_padding + +start_x)
		.attr("x2",11/200*rink_width + +rink_padding + +start_x)
		.attr("y1",+rink_padding + +goal_diff + +start_y)
		.attr("y2",+rink_padding + +rink_height - +goal_diff + start_y)
		.attr("stroke","red")
		.attr("stroke-width",2);

	//Left defensive line
	svg_name.append("line")
		.attr("x1",75/200*rink_width + +rink_padding + +start_x)
		.attr("x2",75/200*rink_width + +rink_padding + +start_x)
		.attr("y1",+rink_padding + +start_y)
		.attr("y2",+rink_padding + +rink_height + +start_y)
		.attr("stroke","blue")
		.attr("stroke-width",3);

	//Center Circle
	svg_name.append("circle")
		.attr("cx",+rink_width/2 + +start_x + +rink_padding)
		.attr("cy",+rink_height/2 + +start_y + +rink_padding)
		.attr("r",15/200*rink_width)
		.attr("fill","white")
		.attr("stroke","blue")
		.attr("stroke-width",1);

	//Midline
	svg_name.append("line")
		.attr("x1",100/200*rink_width + +rink_padding + +start_x)
		.attr("x2",100/200*rink_width + +rink_padding + +start_x)
		.attr("y1",+rink_padding + +start_y)
		.attr("y2",+rink_padding + +rink_height + +start_y)
		.attr("stroke","red")
		.attr("stroke-width",3);

	//Right defensive line
	svg_name.append("line")
		.attr("x1",125/200*rink_width + +rink_padding + +start_x)
		.attr("x2",125/200*rink_width + +rink_padding + +start_x)
		.attr("y1",+rink_padding + +start_y)
		.attr("y2",+rink_padding + +rink_height + +start_y)
		.attr("stroke","blue")
		.attr("stroke-width",3);

	//Right goal
	svg_name.append("line")
		.attr("x1",189/200*rink_width + +rink_padding + +start_x)
		.attr("x2",189/200*rink_width + +rink_padding + +start_x)
		.attr("y1",+rink_padding + +goal_diff+start_y)
		.attr("y2",+rink_padding + +rink_height - +goal_diff + +start_y)
		.attr("stroke","red")
		.attr("stroke-width",2);

	//Top Left Circle
	svg_name.append("circle")
		.attr("cx",31/200*rink_width + +rink_padding + +start_x)
		.attr("cy",28/100*rink_height + +rink_padding + +start_y)
		.attr("r",15/200*rink_width)
		.attr("fill","white")
		.attr("stroke","red")
		.attr("stroke-width",1);

	svg_name.append("circle")
		.attr("cx",31/200*rink_width + +rink_padding + +start_x)
		.attr("cy",28/100*rink_height + +rink_padding + +start_y)
		.attr("r",1/200*rink_width)
		.attr("fill","red");

	//Bottom Left Circle
	svg_name.append("circle")
		.attr("cx",31/200*rink_width + +rink_padding + +start_x)
		.attr("cy",72/100*rink_height + +rink_padding + +start_y)
		.attr("r",15/200*rink_width)
		.attr("fill","white")
		.attr("stroke","red")
		.attr("stroke-width",1);

	svg_name.append("circle")
		.attr("cx",31/200*rink_width + +rink_padding + +start_x)
		.attr("cy",72/100*rink_height + +rink_padding + +start_y)
		.attr("r",1/200*rink_width)
		.attr("fill","red");

	//Top Right Circle
	svg_name.append("circle")
		.attr("cx",169/200*rink_width + +rink_padding + +start_x)
		.attr("cy",28/100*rink_height + +rink_padding + +start_y)
		.attr("r",15/200*rink_width)
		.attr("fill","white")
		.attr("stroke","red")
		.attr("stroke-width",1);

	svg_name.append("circle")
		.attr("cx",169/200*rink_width + +rink_padding + +start_x)
		.attr("cy",28/100*rink_height + +rink_padding + +start_y)
		.attr("r",1/200*rink_width)
		.attr("fill","red");

	//Bottom Right Circle
	svg_name.append("circle")
		.attr("cx",169/200*rink_width + +rink_padding + +start_x)
		.attr("cy",72/100*rink_height + +rink_padding + +start_y)
		.attr("r",15/200*rink_width)
		.attr("fill","white")
		.attr("stroke","red")
		.attr("stroke-width",1);

	svg_name.append("circle")
		.attr("cx",169/200*rink_width + +rink_padding + +start_x)
		.attr("cy",72/100*rink_height + +rink_padding + +start_y)
		.attr("r",1/200*rink_width)
		.attr("fill","red");
}
