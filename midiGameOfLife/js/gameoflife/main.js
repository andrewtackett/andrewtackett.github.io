var soundOnClick = true;
var logging = false;
var timeout = null;

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
  for(var num=21; num<109;num++){
    $("#tracker").append("<td id='" + num + "'></td>")
  }
  $("#tracker").append("</tr>");

  for(var numRows=1;numRows<27;numRows++){
    $("#squares").append("<tr>");
    for(var num=21;num<109;num++){
      var cellID = (num + numRows * 1000);
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
  for(var numRows=1;numRows<27;numRows++){
    for(var num=21;num<109;num++){
      var futureCellState = false; //DEAD
      var cellID = (num + numRows * 1000);
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
    if(cellID < 1000 || cellID > 27000 || cellID%1000 < 21 || cellID%1000 > 108){
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
  var notesToPlay = new Set();
  for(var cellID in futureGameState){
    if(futureGameState[cellID]){
      reviveCell(cellID);
      notesToPlay.add(cellID%1000);
    }else{
      killCell(cellID);
    }
  }

  console.log("playing notes?");
  notesToPlay.forEach(function callback(value1, value2, Set) {
    console.log("play note: " + value1);
    playNote(value1);
  })
}

var killCell = function(cellID){
  $("#" + cellID).css("background-color","rgb(255,255,255)");
}

var reviveCell = function(cellID){
  $("#" + cellID).css("background-color","rgb(0,0,0)");
}

var startGoL = function(){
  timeout = setInterval(function(){
    incrementGameState();
  },1000);
}

var incrementGoL = function(){
  incrementGameState();
}

var stopGoL = function(){
  clearInterval(timeout);
}

var resetGoL = function(){
  stopGoL();

  for(var numRows=1;numRows<27;numRows++){
    for(var num=21;num<109;num++){
      var cellID = (num + numRows * 1000);
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
