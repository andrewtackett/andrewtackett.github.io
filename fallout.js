var initialWordList = [];
var curWordList = [];
var hammMap = [];
var distinctMap = [];

function start(){
	document.getElementById('progress').innerHTML = "Working...";
	
	if(document.getElementById('words').value == ""){
		alert("You didn't enter anything");
		document.getElementById('progress').innerHTML = "Done";
		return;
	}
	
	document.getElementById('start').disabled = true;
	initialWordList = document.getElementById('words').value;
	var wordList = document.getElementById('words').value.split(/[\n|\r|\r\n]+/);
	var length = wordList[0].length;
	for(var i=0;i<wordList.length;i++){
		if(wordList[i].length != length){
			alert("Words not all the same length.  Did you make a typo?");
			return;
		}
		curWordList[i] = wordList[i];
		hammMap[curWordList[i]] = {};
	}
	
	computeInverseHammingDistance();
	
	updateResultsTable();
	
	document.getElementById('progress').innerHTML = "Done";
}

function reset(){
	document.getElementById('workspace').innerHTML = "<textarea id='words' rows='15' cols='60' style='font-size:x-large'>" + initialWordList + "</textarea>";
	document.getElementById('progress').innerHTML = "&nbsp";
	hammMap = [];
	curWordList = [];
	document.getElementById('start').disabled = false;
}

function computeInverseHammingDistance(){
	for(var i=0;i<curWordList.length-1;i++){
		for(var j=i+1;j<curWordList.length;j++){
			var dist = inverseHammDist(curWordList[i],curWordList[j]);
			hammMap[curWordList[i]][curWordList[j]] = dist;
			hammMap[curWordList[j]][curWordList[i]] = dist;
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
	for(var key in distinctMap){
		newWorkspace += "<tr>";
		if(key == optimalWord)
			newWorkspace += "<td><b>" + key + "</b></td>";
		else
			newWorkspace += "<td>" + key + "</td>";
		for(var subkey in distinctMap[key]){
			console.log(key + ", " + subkey + ": " + distinctMap[key][subkey]);
			newWorkspace += "<td onclick=\"selectWord('" + 
			key + 
			"'," + subkey + ")\">" + subkey + "</td>";
		}
		newWorkspace += "</tr>"
	}
	
	newWorkspace += "</table>";
	document.getElementById('workspace').innerHTML = newWorkspace;
	console.log("finish update results table");
}

function optimalChoice(){
	var distinctCount = {};
	var sum = {};
	for(var word in hammMap){
		var distinct = {};
		for(var subkey in hammMap[word]){
			sum[word] += hammMap[word][subkey];
			distinct[hammMap[word][subkey]] = 1; //1 doesn't mean anything, we're just using the map to find distinct values
		}
		distinctCount[word] = Object.keys(distinct).length;
		distinctMap[word] = distinct;
	}
	
	var highestdistinct = 0;
	var bestChoice;
	
	for(var word in distinctCount){
		if(distinctCount[word] > highestdistinct)
		{
			highestdistinct = distinctCount[word];
			bestChoice = word;
		}else if(distinctCount[word] == highestdistinct){
			if(sum[word]>sum[bestChoice]){
				bestChoice = word;
			}
		}
	}
	
	console.log("optimal choice: " + bestChoice);
	
	return bestChoice;
}

function selectWord(word, numCorrectLetters){
	console.log("word: " + word + ", numCorrect: " + numCorrectLetters);
}