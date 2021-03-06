var initialWordList = [];
var words = {};
var remainingWords = {};

function start(){
	if(document.getElementById('words').value == ""){
		alert("You didn't enter anything");
		return;
	}
	
	document.getElementById('start').disabled = true;
	document.getElementById('start').className = 'disabledbutton';
	document.getElementById('prompt').innerHTML = "For each guess click the number of correct letters beside the word:";
	initialWordList = document.getElementById('words').value;
	var wordList = document.getElementById('words').value.split(/[\n|\r|\r\n]+/);
	var length = wordList[0].length;
	for(var i=0;i<wordList.length;i++){
		if(wordList[i].length != length){
			alert("Words not all the same length.  Did you make a typo?");
			return;
		}
		words[wordList[i]] = {};
		words[wordList[i]]['hamm'] = {};
		words[wordList[i]]['distinct'] = {};
		words[wordList[i]]['eliminated'] = false;
		remainingWords[wordList[i]] = 1;
	}
	
	computeInverseHammingDistanceMatrix();
	
	updateResultsTable();
}

function reset(){
	document.getElementById('workspace').innerHTML = "<textarea id='words' rows='15' cols='60' style='font-size:x-large'>" + initialWordList + "</textarea>";
	words = {};
	remainingWords = {};
	initialWordList = [];
	document.getElementById('prompt').innerHTML = "Enter the words below:";
	document.getElementById('start').disabled = false;
	document.getElementById('start').className = 'enabled';
}

function computeInverseHammingDistanceMatrix(){
	var wordList = Object.keys(words);
	for(var i=0;i<wordList.length-1;i++){
		for(var j=i+1;j<wordList.length;j++){
			var dist = computeInverseHammDist(wordList[i],wordList[j]);
			words[wordList[i]]['hamm'][wordList[j]] = dist;
			words[wordList[j]]['hamm'][wordList[i]] = dist;
		}
	}
}

function computeInverseHammDist(word1, word2){
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
	var optimalWord = calculateOptimalChoice();
	var newWorkspace = "<table>";
	for(var word in words){
		newWorkspace += "<tr>";
		if(words[word]['eliminated']){
			newWorkspace += "<td class='eliminated'>" + word + "</td></tr>";
			continue;
		}
		else if(word == optimalWord){
			newWorkspace += "<td title='Optimal Choice' class='optimal'>" + word + "</td>"; 
			if(Object.keys(remainingWords).length == 1){
				newWorkspace += "</tr>"
				continue;
			}
		}
		else{
			newWorkspace += "<td>" + word + "</td>"; 
		}
		
		newWorkspace += "<td class='num' onclick=\"selectWord('" + word + "',-1)\">Dud</td>";
		
		for(var invHammDist in words[word]['distinct']){
			newWorkspace += "<td class='num' onclick=\"selectWord('" + word + "'," + invHammDist + ")\">" + invHammDist + "</td>";
		}
		newWorkspace += "</tr>"
	}
	
	newWorkspace += "</table>";
	document.getElementById('workspace').innerHTML = newWorkspace;
}

//We want the word with the most variance in inverse hamming distances then the word with the smallest sum of unique distances
function calculateOptimalChoice(){
	var distinctCount = {};
	var sum = {};
	
	for(var word in remainingWords){
		words[word]['distinct'] = {};
		sum[word] = 0;
		for(var comparedWord in words[word]['hamm']){
			if(!remainingWords.hasOwnProperty(comparedWord))
				continue;
			var invHammDist = words[word]['hamm'][comparedWord];
			words[word]['distinct'][invHammDist] = 1;//1 doesn't mean anything, we're just using the map to find distinct values
		}
		var distinctDists = Object.keys(words[word]['distinct']);
		for(var num in distinctDists){
			sum[word] += parseInt(num);
		}
		distinctCount[word] = distinctDists.length;
	}
	
	return findHighestVarianceLowestSumWord(distinctCount,sum);
}

function findHighestVarianceLowestSumWord(distinctCount,sum){
	var highestdistinct = -1;
	var bestChoice;
	
	for(var word in distinctCount){
		if(distinctCount[word] > highestdistinct)
		{
			highestdistinct = distinctCount[word];
			bestChoice = word;
		}else if(distinctCount[word] == highestdistinct){
			if(sum[word]<sum[bestChoice]){
				bestChoice = word;
			}
		}
	}
	
	return bestChoice;
}

function selectWord(word, numCorrectLetters){
	words[word]['eliminated'] = true;
	delete remainingWords[word];
	
	if(numCorrectLetters!=-1){
		for(var candidateWord in words[word]['hamm']){
			if(words[word]['hamm'][candidateWord]!=numCorrectLetters){
				delete remainingWords[candidateWord];
				words[candidateWord]['eliminated'] = true;
			}
		}
	}
	
	updateResultsTable();
}