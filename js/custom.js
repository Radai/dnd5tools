$(document).ready(function() {
	//Main Bootstrap/jQuery custom code

	$.each(race_data, function(key, val){
		if(val.subraces){
			$.each(val.subraces, function(k, v){
				dothing(k,v);
			})
		} else {
			dothing(key,val);
		}
	});
});

dothing = function(k, v){
	$("#main").append(v.name + "<br />");
}