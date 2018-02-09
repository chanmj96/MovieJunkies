/**
 * Browse functions: get movie genres, 
 */
function getBaseURL(){
	return [location.protocol, '//', location.host, location.pathname].join('');
}
function getFullURL(){
	return window.location.href;
}

$(document).ready(function(){
	var letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','other'];
	for(var i = 0; i < letters.length; i++)
		$("#put-letters").append('<button onclick="button_links(this)" class="myLetters">'+letters[i]+'</button>');
});

$(document).ready(function(){
	$.get("Genres", function(data,status){ 
		for(var i=0; i < data.length; i++)
			$("#put-genres").append('<button onclick="button_links(this)" class="myGenres">' +data[i]["name"]+'</button>')  } );
	
	jQuery("#search_result").css('display', 'none');
});

function showResult(result){
	console.log("Handling search result.");	
	
	// Hide Search Functionality
	jQuery("#search_form").hide();
	
	// Show Table Header
	jQuery("#search_result_head").css('display', 'table-header-group');
	
	// Populate table
	$("#search_result_body").empty();
	var element_body = jQuery("#search_result_body");
	for(var i = 0; i < result.length; ++i){
		var row = "";
		row += "<tr>";
		
		// Movie Title
		row += "<th><a class=\"title\" value=\"" + result[i]["id"] 
			+ "\" href=\"#\">" + result[i]["title"] + "</a></th>";
		
		// Movie Year
		row += "<th>" + result[i]["year"] + "</th>";
		
		// Movie Director
		row += "<th>" + result[i]["director"] + "</th>";

		// Movie Genres
		row += "<th>";
		for(var j = 0; j < result[i]["genres"].length; ++j){
			row += result[i]["genres"][j] + "<br>";
		}
		row += "</th>"
		
		// Movie Cast
		row += "<th>";
		for(var j = 0; j < result[i]["cast"].length; ++j){
			var cast_list = result[i]["cast"][j].split(",");
			var row_str = "";
			for(var k = 0; k < cast_list.length; ++k){
				var person = cast_list[k].split(':');
				row_str += "<a class=\"castmember\" value=\"" + person[1]
						+ "\" href=\"#\">" + person[0] + "</a><br>";
			}
			row += row_str + "<br>";
		}
		row += "</th>"; 
		
		// Purchase button
		row += "<th>";
		row += "<button type=\"button\" class=\"cart\"> ADD TO CART </button>"; 
		row += "</th>";
		row += "</tr>";
		element_body.append(row);
	}
	
	$("#search_result_body a.title").click(function(event){
		event.preventDefault();
		window.location.href = "movie.html?id=" + $(this).attr("value");
	});	
	$("#search_result_body a.castmember").click(function(event){
		event.preventDefault();
		window.location.href = "star.html?starid=" + $(this).attr("value");
	});
}

function paginate(result, params){
	var page = parseInt(params.split("page=").pop());
	var display = parseInt(params.split("display=").pop().substring(0,2));
	if(page >= Math.ceil(result / display)){
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
	$.get("ShowSearch", params, (data) => showResult(data));
	$.get("Count", params, (data) => paginate(data, params));
});

function button_links(elem) {
	var text = elem.textContent || elem.innerText;
	
	var url = getBaseURL();
	var params = "";
	
	
	if(text.length == 1)
	{
		if(url.indexOf("letter=") == -1){params += ("letter="+text)};
	}
	else
	{
		if(url.indexOf("genre=") == -1){params += ("genre="+text)};
	}
	
	if(url.indexOf("&display=") == -1){params += "&display=10"};
	if(url.indexOf("&sort=") == -1){params += "&sort=ASC"};
	if(url.indexOf("&sortby=") == -1){params += "&sortby=title"};
	if(url.indexOf("&page=") == -1){params += "&page=1"};
	
	url = getBaseURL() + "?" + params;
	window.history.pushState(null, null, url);
	
	$("#search-wrap .pagination").css('display', 'inline-block');
		
	$.get("ShowSearch", params, (data) => showResult(data));
	$.get("Count", params, (data) => paginate(data, params));
}


