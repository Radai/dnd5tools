$(document).ready(function() {
	//Main Bootstrap/jQuery custom code
	populate_races();
	populate_classes();

	$(function(){
		$(".dropdown-menu li a").click(function(){
			$(this).parents(".dropdown").find(".btn").html(toTitleCase($(this).text()) + " <span class='caret'></span>");
			var race = $(this).parents(".dropdown").find(".btn").val($(this).text());
			$("#subrace-dropdown-container").hide();
			if(race_data[race.val().toLowerCase()].subraces){
				$("#subrace-dropdown").html("Select Subrace <span class='caret'></span>")
				populate_subracees(race.val());
			}
		});
	});

	$("#subrace-dropdown-container").hide();
});

function populate_races(){
	$.each(race_data, function(key){
		$("#race-dropdown-menu").append("<li><a href='#'>"+toTitleCase(key)+"</a></li>");
	});
}

function populate_subracees(race){
	$("#subrace-dropdown-container").show();
	$("#subrace-dropdown-menu").empty();
	$.each(race_data[race.toLowerCase()].subraces, function(key){
		$("#subrace-dropdown-menu").append("<li><a href='#'>"+toTitleCase(key)+"</a></li>")
	})
	$(".dropdown-menu li a").click(function(){
		$(this).parents(".dropdown").find(".btn").html(toTitleCase($(this).text()) + " <span class='caret'></span>");
		$(this).parents(".dropdown").find(".btn").val($(this).text());
	});
}

function populate_classes(){
	$.each(class_data, function(key){
		$("#class-dropdown-menu").append("<li><a href='#'>"+toTitleCase(key)+"</li>");
	});
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}