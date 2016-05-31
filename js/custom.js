$(document).ready(function() {
	//Main Bootstrap/jQuery custom code
	console.log(race_data);
	console.log(class_data);

	$(function(){
		$("#race-dropdown-menu li a").click(function(){
			var race_name = this.text.toLowerCase();
			$("#race-name").text(this.text);

			if(race_data[race_name] == undefined){ //check subraces
				var baserace = race_data[$($(this).parent().prevAll(".base-race").get(0)).text().trim().toLowerCase()];
				var subrace = baserace.subraces[race_name.substr(0, race_name.indexOf(' '))];
				console.log(subrace, baserace);
			}else{ //not a subrace
				var baserace = race_data[$(this).text().toLowerCase()];
				console.log(race_data[race_name]);
			}
		});

		$("#class-dropdown-menu li a").click(function(){
			$("#class-name").text(this.text);
		});
	});

	console.log("finished loading");
});

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}