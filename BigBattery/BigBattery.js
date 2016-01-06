function parseURLParams(){
	var queryDict = {};
	location.search.substr(1).split("&").forEach(function(item){
		queryDict[item.split("=")[0]] = item.split("=")[1]
	});
	return queryDict;
}

function updateURLParams(){
	//window.history.replaceState()
	console.log("update params");
	var dict = parseURLParams();
	var text = $.param(dict);
	console.log("dict:" + JSON.stringify(dict));
	console.log("text:" + text);
}

var app = {};
app.SimCell = Backbone.View.extend({
	tagname: 'td',
	template: _.template($('#cell-template').html()),
	render : function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
})