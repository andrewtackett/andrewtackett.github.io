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
var selectedElectrolyte;
//var human = new Human({ name: "Thomas", age: 67, child: 'Ryan'});
/*app.Cell = Backbone.View.extend({
	defaults: {
	    type: 'sulfurousAcid'
	 },
	tagname: 'td',
	template: _.template($('#cell-template').html()),
	render : function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

app.CellList = Backbone.Collection.extend({
  model: app.Cell
});

// instance of the Collection
app.cellList = new app.CellList();*/

function selectElectrolyte(selected){
	$('#sulfurousAcid').class = 'electrolyte';
	$('#resonantEnder').class = 'electrolyte';
	$('#destabilizedRedstone').class = 'electrolyte';
	
	if(selected=='sulfurousAcid'){
		selectedElectrolyte = selected;
		$(selected).class = 'electrolyteSelected';
	}else if(selected=='resonantEnder'){
		selectedElectrolyte = selected;
		$(selected).class = 'electrolyteSelected';
	}else{
		selectedElectrolyte = selected;
		$(selected).class = 'electrolyteSelected';
	}
	console.log(selected);
}

function initializeBattery(){
	var length = $('#Length').val();
	var width = $('#Width').val();
	var height = $('#Height').val();
	
	alert("Length:" + length + ",width:" + width + ",height:" + height);
}

function reset(){
	
}
