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

populate_classes = function(){
	$.each(race_data, function(key){
		$("#class-dropdown").append("<li><a href='#'>"+key+"</a></li>")
	})
}

dothing = function(k, v){
	$("#main").append(v.name + "<br />");
}