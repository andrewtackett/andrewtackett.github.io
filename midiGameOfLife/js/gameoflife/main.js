var soundOnClick = true;
var logging = false;
var timeout = null;
var trackerTimeout = null;
var timeBetweenColumns = 250; //Milliseconds
var timeBetweenFullPlay = (88+1) * timeBetweenColumns; //88 Notes

//Constants
var firstGameRow = 1;
var lastGameRow = 27;
var firstNote = 21;
var lastNote = 108;
var rowSpacerNum = 1000;

var initialize = function(){
  MIDI.loadPlugin({
    soundfontUrl: "./soundfont/",
    instrument: "acoustic_grand_piano",
    onprogress: function(state, progress) {
      console.log(state, progress);
    },
    onsuccess: function() {
      // var delay = 0; // play one note every quarter second
      // var note = 50; // the MIDI note
      // var velocity = 127; // how hard the note hits
      // play the note
      MIDI.setVolume(0, 127);
      // MIDI.noteOn(0, note, velocity, delay);
      // MIDI.noteOff(0, note, delay + 0.75);
    }
  });

  createUI();
}

var createUI = function(){
  console.log("creating tables");
  $("#tracker").append("<tr>");
  for(var num=firstNote; num<=lastNote;num++){
    $("#tracker").append("<td id='" + num + "' width='20px' height='20px'></td>")
  }
  $("#tracker").append("</tr>");

  for(var numRows=firstGameRow;numRows<lastGameRow;numRows++){
    $("#squares").append("<tr>");
    for(var num=firstNote;num<=lastNote;num++){
      var cellID = (num + numRows * rowSpacerNum);
      $("#squares").append("<td id=" +  cellID + " onclick='cellClick(\""+  num + "\",\"" + cellID + "\")' width='20px' height='20px'></td>");
    }
    $("#squares").append("</tr>");
  }
}

var cellClick = function(noteName,cellID){
  var note = parseInt(noteName);
  console.log("Note: " + note + ", cellID: " + cellID);
  if(soundOnClick){
    playNote(note);
  }
  toggleCellColor(cellID);
}

var playNote = function(note){
  console.log(note);
  var delay = 0; // play one note every quarter second
  //var note = 50; // the MIDI note
  var velocity = 127; // how hard the note hits
  // play the note
  MIDI.noteOn(0, note, velocity, delay);
  MIDI.noteOff(0, note, delay + 0.9);
}

var toggleCellColor = function(cellID){
  console.log("toggle cell color: " + cellID);
  var curColor = $("#" + cellID).css("background-color");
  if(curColor == "rgb(0, 0, 0)"){
    $("#" + cellID).css("background-color", "rgb(255, 255, 255)");
  }else{
    $("#" + cellID).css("background-color", "rgb(0, 0, 0)");
  }
}

var incrementGameState = function(){
  console.log("increment game state");
  var futureGameState = calcFutureGameState();
  applyFutureGameState(futureGameState);
}

var calcFutureGameState = function(){
  var futureGameState = {};
  for(var numRows=firstGameRow;numRows<lastGameRow;numRows++){
    for(var num=firstNote;num<=lastNote;num++){
      var futureCellState = false; //DEAD
      var cellID = (num + numRows * rowSpacerNum);
      var cellNeighbors = [cellID + 1, cellID -1, cellID + 1000, cellID - 1000, cellID + 1001, cellID - 1001, cellID + 999, cellID - 999];
      var numAliveNeighbors = checkNumAliveNeighbors(cellNeighbors);
      if(numAliveNeighbors < 2 || numAliveNeighbors > 3){
        futureCellState = false; //DEAD due to under/over population
      }else if(numAliveNeighbors == 2 || numAliveNeighbors == 3){
        if(cellAlive(cellID)){
          futureCellState = true; //live to next generation
        }else if(numAliveNeighbors == 3){ //DEAD and 3 neighbors
            futureCellState = true; //Reproduce
        }
      }
      futureGameState[cellID] = futureCellState;
    }
  }

  return futureGameState;
}

var checkNumAliveNeighbors = function(cellNeighbors){
  var numAliveNeighbors = 0;
  for(var index in cellNeighbors){
    var cellID = cellNeighbors[index];
    //Handle boundary conditions
    if(cellID < (firstGameRow * rowSpacerNum) || cellID > (lastGameRow * rowSpacerNum) || cellID%rowSpacerNum < firstNote || cellID%rowSpacerNum > lastNote){
      continue;
    }else{
      if(cellAlive(cellID)){
        numAliveNeighbors += 1;
      }
    }
  }

  return numAliveNeighbors;
}

var cellAlive = function(cellID){
  return $("#" + cellID).css("background-color") == "rgb(0, 0, 0)";
}

var applyFutureGameState = function(futureGameState){
  console.log("applyFutureGameState");
  for(var cellID in futureGameState){
    if(futureGameState[cellID]){
      reviveCell(cellID);
    }else{
      killCell(cellID);
    }
  }

  playMIDINotes(firstNote); //Start point is first note
}

var killCell = function(cellID){
  $("#" + cellID).css("background-color","rgb(255, 255, 255)");
}

var reviveCell = function(cellID){
  $("#" + cellID).css("background-color","rgb(0, 0, 0)");
}

var playMIDINotes = function(curNum){
  console.log("playing notes: " + curNum);
  if(curNum > lastNote){
    console.log("killing all tracker row");
    for(var num=firstNote;num<=lastNote;num++){
      $("#" + num).css('background-color',"rgb(255,255,255)");
    }
  }else{
    $("#" + curNum).css('background-color',"rgb(0, 0, 0)");
    if(checkIfColumnHasAlive(curNum)){
      playNote(curNum);
    }
    trackerTimeout = setTimeout(function(){
      playMIDINotes(curNum+1);
    },timeBetweenColumns);
  }
}

var checkIfColumnHasAlive = function(columnID){
  for(var row=firstGameRow;row<lastGameRow;row++){
    var cellID = columnID + row * rowSpacerNum;
    if(cellAlive(cellID)){
      return true;
    }
  }
  return false;
}

var startGoL = function(){
  console.log("start game");
  incrementGameState();
  timeout = setInterval(function(){
    incrementGameState();
  },timeBetweenFullPlay);
}

var incrementGoL = function(){
  incrementGameState();
}

var stopGoL = function(){

  clearInterval(timeout);
  clearInterval(trackerTimeout);//TODO: reinitialize from there if restarted?
}

var resetGoL = function(){
  console.log("resetting");
  stopGoL();

  for(var numRows=0;numRows<lastGameRow;numRows++){
    for(var num=firstNote;num<=lastNote;num++){
      var cellID = (num + numRows * rowSpacerNum);
      $("#" + cellID).css("background-color","rgb(255,255,255)");
    }
  }
}

var toggleSoundOnClick = function(){
  if(soundOnClick){
    console.log("Play Sound on Click");
    $("#toggleSoundBtn").text("Play Sound on Click");
  }else{
    console.log("Don't Play Sound on Click");
    $("#toggleSoundBtn").text("Don't Play Sound on Click");
  }
  soundOnClick = !soundOnClick;
  console.log("toggleSoundOnClick: " + soundOnClick);
}
