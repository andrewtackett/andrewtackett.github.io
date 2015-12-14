var validWordList = [];
var map = [];

function start(){
	document.getElementById('progress').innerHTML = "Working...";
	
	if(document.getElementById('words').value == ""){
		alert("You didn't enter anything");
		document.getElementById('progress').innerHTML = "Done";
		return;
	}
	
	document.getElementById('start').disabled = true;
	var wordList = document.getElementById('words').value.split(/[\n|\r|\r\n]+/);
	var length = wordList[0].length;
	for(var i=0;i<wordList.length;i++){
		if(wordList[i].length != length){
			alert("Words not all the same length.  Did you make a typo?");
			return;
		}
		validWordList[i] = wordList[i];
		map[validWordList[i]] = {};
	}
	
	computeInverseHammingDistance();
	
	updateResultsTable();
	
	document.getElementById('progress').innerHTML = "Done";
	
	//alert(map);
}

function reset(){
	document.getElementById('workspace').innerHTML = "<textarea id='words' rows='20' cols='80'></textarea>";
	document.getElementById('progress').innerHTML = "&nbsp";
	map = [];
	validWordList = [];
	document.getElementById('start').disabled = false;
}

function computeInverseHammingDistance(){
	for(var i=0;i<validWordList.length-1;i++){
		for(var j=i+1;j<validWordList.length;j++){
			var dist = inverseHammDist(validWordList[i],validWordList[j]);
			map[validWordList[i]][validWordList[j]] = dist;
			map[validWordList[j]][validWordList[i]] = dist;
		}
	}
}

function inverseHammDist(word1, word2){
	var dist = 0;
	if(word1.length != word2.length)
		return -1;
	for(var i=0;i<word1.length;i++){
		if(word1[i] == word2[i])
			dist++;
	}
	
	return dist;
}

function updateResultsTable(){
	var optimalWord = optimalChoice();
	var newWorkspace = "<table>";
	for(var key in map){
		newWorkspace += "<tr>";
		if(key == optimalWord)
			newWorkspace += "<td><b>" + key + "</b></td>";
		else
			newWorkspace += "<td>" + key + "</td>";
		for(var subkey in map[key]){
			console.log(key + ", " + subkey + ": " + map[key][subkey]);
			newWorkspace += "<td>" + map[key][subkey] + "</td>";
		}
		newWorkspace += "</tr>"
	}
	
	newWorkspace += "</table>";
	document.getElementById('workspace').innerHTML = newWorkspace;
	console.log("finish update results table");
}

function optimalChoice(){
	var uniqueCount = {};
	var sum = {};
	for(var word in map){
		var unique = {};
		for(var subkey in map[word]){
			sum[word] += map[word][subkey];
			unique[map[word][subkey]] = 1; //1 doesn't mean anything, we're just using the map to find unique values
		}
		uniqueCount[word] = Object.keys(unique).length;
	}
	
	var highestUnique = 0;
	var bestChoice;
	
	for(var word in uniqueCount){
		if(uniqueCount[word] > highestUnique)
		{
			highestUnique = uniqueCount[word];
			bestChoice = word;
		}else if(uniqueCount[word] == highestUnique){
			if(sum[word]>sum[bestChoice]){
				bestChoice = word;
			}
		}
	}
	
	console.log("optimal choice: " + bestChoice);
	
	return bestChoice;
}