function getBaseURL(){
	return [location.protocol, '//', location.host, location.pathname].join('');
}
function getFullURL(){
	return window.location.href;
}

function showResult(result){
	console.log("Handling search result.");	
	
	// Hide Search Functionality
	jQuery("#search_form").hide();
	
	// Create table column titles
	var element_head = jQuery("#search_result_head");
	var head = "";
	head += "<tr>";
	head += "<th><a href=title>Title</a></th>";
	head += "<th>Release Date</th>";
	head += "<th>Director</th>";
	head += "<th>Genres</th>";
	head += "<th>Cast</th>";
	head += "</th>";
	element_head.append(head);
	
	// Populate table
	$("#search_result_body").empty();
	var element_body = jQuery("#search_result_body");
	for(var i = 0; i < result.length; ++i){
		var row = "";
		row += "<tr>";
		row += "<th><a class=\"title\" value=\"" + result[i]["id"] 
			+ "\" href=\"#\">" + result[i]["title"] + "</a></th>";
		row += "<th>" + result[i]["year"] + "</th>";
		row += "<th>" + result[i]["director"] + "</th>";

		row += "<th>";
		for(var j = 0; j < result[i]["genres"].length; ++j){
			row += result[i]["genres"][j] + "<br>";
		}
		row += "</th>"
		
		row += "<th>";
		
		for(var j = 0; j < result[i]["cast"].length; ++j){
			var cast_list = result[i]["cast"][j].split(",");
			var row_str = "";
			for(var k = 0; k < cast_list.length; ++k){
				row_str += "<a class=\"castmember\" value=\"" + cast_list[k]
						+ "\" href=\"#\">" + cast_list[k] + "</a><br>";
			}
			row += row_str + "<br>";
		}
		row += "</th></tr>"
		element_body.append(row);
	}
	
	$("#search-wrap .pagination").css('display', 'inline-block');
	$("#search-wrap .pagination #next").css('display', 'inline');
	$("#search-wrap .pagination #previous").css('display', 'inline');
	
	$("#search_result_body a.title").click(function(event){
		event.preventDefault();
		console.log("This movie has ID: " + $(this).attr("value"));

	});
	$("#search_result_body a.castmember").click(function(event){
		event.preventDefault();
		console.log("This cast member's name is " + $(this).attr("value"));
	});

}
function nextResult(result){
	$("#search_result_body").empty();
	var element_body = $("#search_result_body");
	for(var i = 0; i < result.length; ++i){
		var row = "";
		row += "<tr>";
		row += "<th><a class=\"title\" value=\"" + result[i]["id"] 
			+ "\" href=\"#\">" + result[i]["title"] + "</a></th>";
		row += "<th>" + result[i]["year"] + "</th>";
		row += "<th>" + result[i]["director"] + "</th>";

		row += "<th>";
		for(var j = 0; j < result[i]["genres"].length; ++j){
			row += result[i]["genres"][j] + "<br>";
		}
		row += "</th>"
		
		row += "<th>";
		for(var j = 0; j < result[i]["cast"].length; ++j){
			var cast_list = result[i]["cast"][j].split(",");
			var row_str = "";
			for(var k = 0; k < cast_list.length; ++k){
				row_str += "<a class=\"castmember\" value=\"" + cast_list[k]
						+ "\" href=\"#\">" + cast_list[k] + "</a><br>";
			}
			row += row_str + "<br>";
		}
		row += "</th></tr>"
		element_body.append(row);
	}
	
	$("#search_result_body a.title").click(function(event){
		event.preventDefault();
		console.log("This movie has ID: " + $(this).attr("value"));

	});
	$("#search_result_body a.castmember").click(function(event){
		event.preventDefault();
		console.log("This cast member's name is " + $(this).attr("value"));
	});
}
function paginate(result, params){
	var page = parseInt(params.split("page=").pop());
	var display = parseInt(params.split("display=").pop().substring(0,2));
	if(page >= Math.floor(result / display)){
		$("#search-wrap .pagination #next").css('display', 'none');
	} else {
		$("#search-wrap .pagination #next").css('display', 'inline');
	}
	if(page <= 1){
		$("#search-wrap .pagination #previous").css('display', 'none');
	} else {
		$("#search-wrap .pagination #previous").css('display', 'inline');
	}
}
function submitSearchForm(formSubmitEvent){
	console.log("Search form submitted.");
	formSubmitEvent.preventDefault();

	var params = jQuery("#search_form").serialize();
	params += "&sort=";
	params += "&display=10"; // Need to eventually allow user to specify
	params += "&page=1";
	// look into HTML select tag
	
	// Attempt at supporting browser back function;
	var new_url = [location.protocol, '//', location.host, location.pathname].join('');
	new_url += "?" + params;
	window.history.pushState(null, null, new_url);
	
	jQuery.get("ShowSearch", params, (data)=>showResult(data));
	jQuery.get("Count", params, (data)=>paginate(data, params));
}

jQuery("#search_form").submit((event) => submitSearchForm(event));

$(".pagination a").click(function(event){
    event.preventDefault();
    var tag = $(this).attr("value");
    
	var url = getFullURL();
	var page_num = parseInt(url.split("page=").pop());
    if(tag == "next"){
    		url = url.replace(/page=.+/, "page=" + (page_num + 1));
    } else if (tag == "previous"){
		url = url.replace(/page=.+/, "page=" + (page_num - 1));
    }
	window.history.pushState(null, null, url);
	
	var params = url.split("?").pop();
	$.get("ShowSearch", params, (data) => nextResult(data));
	$.get("Count", params, (data) => paginate(data, params));
});