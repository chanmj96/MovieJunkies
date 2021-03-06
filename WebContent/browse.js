/**
 * Browse functions: get movie genres, 
 */
function getBaseURL(){
	return [location.protocol, '//', location.host, location.pathname].join('');
}
function getFullURL(){
	return window.location.href;
}

$("#search_result_table").hide();
$(".pagination").hide();

$(document).ready(function(){
	var letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q',
		'R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','other'];
	for(var i = 0; i < letters.length; i++)
		$("#put-letters").append('<a href="#" onclick="button_links(this);"> '+letters[i]+' </a>');
});

$(document).ready(function(){
	$.get("Genres", function(data,status){ 
		for(var i=0; i < data.length; i++)
			$("#put-genres").append('<a href="#" onclick="button_links(this);"> ' +data[i]["name"]+' </a>')  } );
});

function back(){
	window.location.replace("index.html");
}
function cart(){
	window.location.replace("shoppingcart.html");
}
function showResult(result){
	console.log("Handling search result.");	
	
	$("#search_result_table").show();
	$(".pagination").show();
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
		
		// Purchase buttons
		row += "<th>";
		row += '<input type="text" value="1" name="count_input" id=input-'+result[i]["id"]+'><br>';
		row += '<button onclick="cart_add(this)" class="cart_add" value="'+result[i]["id"]+'"> ADD TO CART </button>';
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


$("#search_result_head .sort_by").click(function(event){
	event.preventDefault();
	var value = $(this).attr("value");
	var sort = $(this).attr("sort");
	var url = getFullURL();
	
	if(sort == "ASC"){
		$(this).attr("sort", "DESC");
		url = url.replace(/(?:sort)(=.*?)[^&]*/, "sort=DESC");
	} else {
		$(this).attr("sort", "ASC");
		url = url.replace(/(?:sort)(=.*?)[^&]*/, "sort=ASC");
	}
	url = url.replace(/(?:sortby)(=.*?)[^&]*/, "sortby=" + value);
	url = url.replace(/(?:page)(=.*?)[^&]*/, "page=1");
	
	window.history.pushState(null, null, url);
	
	var params = url.split("?").pop();
	$.get("ShowSearch", params, (data) => showResult(data));
	$.get("Count", params, (data) => paginate(data, params));	
});	


function cart_add(elem) {
	var text = elem.value;
	var count = document.getElementById("input-"+text).value;
	
	if(setCookie(text,count))
		alert("Cart has been updated with Movie " + text + ".");
	else
		alert("Enter a valid number of Movies.");
}

function button_links(elem) {
	var text = elem.textContent || elem.innerText;
	text = text.trim();
	var url = getBaseURL();
	var params = "";
	
	if(text.length == 1 || text.valueOf() == new String("other").valueOf())
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


if(window.location.href.indexOf("?") != -1){
	var url = getFullURL();
	var params = url.split("?").pop();
	if(url.indexOf("&display=") == -1){params += "&display=10"};
	if(url.indexOf("&sort=") == -1){params += "&sort="};
	if(url.indexOf("&sortby=") == -1){params += "&sortby="};
	if(url.indexOf("&page=") == -1){params += "&page=1"};
	
	url = getBaseURL() + "?" + params;
	window.history.pushState(null, null, url);
	
	$("#search-wrap .pagination").css('display', 'inline-block');
		
	$.get("ShowSearch", params, (data) => showResult(data));
	$.get("Count", params, (data) => paginate(data, params));
}
