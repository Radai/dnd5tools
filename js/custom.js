$(document).ready(function() {
	//Main Bootstrap/jQuery custom code
	populate_races();
	populate_classes();

	console.log(race_data);
	console.log(class_data);

	$(function(){
		$(".dropdown-menu li a").click(function(){
			var button = $(this).parents(".dropdown").find(".btn");

			button.html($(this).text());

			var buttonText = button.text().toLowerCase();

			if(button.is("#race-dropdown")){ // they clicked a race
				if(race_data[buttonText].subraces){ //has subraces
					populate_subraces(buttonText);
				}else{
					$("#subrace-dropdown-container").hide();
				}
				$("#race-name").text(buttonText);
			}else if(button.is("#class-dropdown")){ //they clicked a class
				$("#class-name").text(buttonText);
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

function populate_subraces(race){
	$("#subrace-dropdown-container").show();
	$("#subrace-dropdown-menu").empty();
	$("#subrace-dropdown").html("Select Subrace <span class='caret'></span>")

	$.each(race_data[race.toLowerCase()].subraces, function(key){
		$("#subrace-dropdown-menu").append("<li><a href='#'>"+toTitleCase(key)+"</a></li>")
	})

	$("#subrace-dropdown-menu li a").click(function(){
		var button = $("#subrace-dropdown");
		button.html($(this).text());

		$("#subrace-name").text(button.text()); //set subrace name text in summary
	})
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