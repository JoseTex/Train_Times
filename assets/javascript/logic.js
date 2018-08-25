  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCEd0HSsQmGct0q9kFXdZ7GjjNYaEf_h18",
    authDomain: "trainhomework-497c8.firebaseapp.com",
    databaseURL: "https://trainhomework-497c8.firebaseio.com",
    projectId: "trainhomework-497c8",
    storageBucket: "trainhomework-497c8.appspot.com",
    messagingSenderId: "903024350432"
  };
  firebase.initializeApp(config);


var database = firebase.database();

//Start Code
setInterval(function(startTime) {
  $("#timer").html(moment().format('hh:mm a'))
}, 1000);


$("#add-train").on("click", function() {
  event.preventDefault();

 
  var train = $("#trainname-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var frequency = $("#frequency-input").val().trim();
  var firstTime = $("#firsttime-input").val().trim();
  

  var trainInfo = { 
    formtrain: train,
    formdestination: destination,
    formfrequency: frequency,
    formfirsttime: firstTime,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  };
  database.ref().push(trainInfo);

  $("#trainname-input").val("");
  $("#destination-input").val("");
  $("#frequency-input").val("");
  $("#firsttime-input").val("");

});


database.ref().on("child_added", function(childSnapshot, prevChildKey) {  
  var train = childSnapshot.val().formtrain;
  var destination = childSnapshot.val().formdestination;
  var frequency = childSnapshot.val().formfrequency;
  var firstTime = childSnapshot.val().formfirsttime;

  var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
  var currentTime = moment();

  $("#timer").text(currentTime.format("hh:mm a"));

  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  var tRemainder = diffTime % frequency;
  var minutesAway = frequency - tRemainder;
  var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");

  $("#train-table > tbody").append("<tr><td>" + '<i class="fa fa-trash" id="trashcan" aria-hidden="true"></i>' + "</td><td>" + train + "</td><td>" + destination + "</td><td>" +
  frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
});


$("body").on("click", ".fa-trash", function() {
  $(this).closest("tr").remove(); 
  alert("delete button clicked");
});


function timeUpdater() {

  $("#train-table > tbody").empty();
  
  database.ref().on("child_added", function(childSnapshot, prevChildKey) {  
  var train = childSnapshot.val().formtrain;
  var destination = childSnapshot.val().formdestination;
  var frequency = childSnapshot.val().formfrequency;
  var firstTime = childSnapshot.val().formfirsttime;


  var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
  var currentTime = moment();
  
  $("#timer").text(currentTime.format("hh:mm a"));

  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  var tRemainder = diffTime % frequency;
  var minutesAway = frequency - tRemainder;
  var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");

  $("#train-table > tbody").append("<tr><td>" + '<i class="fa fa-trash" aria-hidden="true"></i>' + "</td><td>" + train + "</td><td>" + destination + "</td><td>" +
  frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");

  })
};

setInterval(timeUpdater, 6000);

