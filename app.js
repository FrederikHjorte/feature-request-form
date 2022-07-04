const firebaseConfig = {
  apiKey: "AIzaSyBgKKXJAxckx8BskUtAgRUa8JR2GgMFZlk",
  authDomain: "featurerequestapp-a5380.firebaseapp.com",
  projectId: "featurerequestapp-a5380",
  storageBucket: "featurerequestapp-a5380.appspot.com",
  messagingSenderId: "670911181839",
  appId: "1:670911181839:web:2e90ac933960d01a669f7a",
  measurementId: "G-2BJZC2DSS4",
  databaseURL: "https://featurerequestapp-a5380-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// global variables for db
var db = firebase.database();
var featureRequests = document.getElementById('featureList');
var featureRequestsRef = db.ref("requests/");
var form = document.getElementById('featureSubmitForm');



// Submit button eventlistener
featureSubmitForm.addEventListener("submit", e => {

    e.preventDefault();

    var featureTitle = document.getElementById("featureTitle")
    var description = document.getElementById("description")
    var hiddenId = document.getElementById("hiddenId");

    var id = hiddenId.value || Date.now();

    db.ref("requests/" + id).set({
        featureTitle: featureTitle.value,
        description: description.value,
        createdAt: firebase.database.ServerValue.TIMESTAMP
    })
})



// Event handler for each added feature request
featureRequestsRef.on("child_added", data => {
  var li = document.createElement("li");
  li.id = data.key;
  li.innerHTML = requestTemplate(data.val())
  featureRequests.appendChild(li);

})



featureList.addEventListener("click", e => {
  updateFeatureRequest(e)
  deleteFeatureRequest(e)
})


featureRequestsRef.on("child_changed", data =>{

  var featureRequest = document.getElementById(data.key);
  featureRequest.innerHTML = requestTemplate(data.val())

})


// Update function

function updateFeatureRequest(e) {

  var featureRequest = e.target.parentNode;
  
  if(e.target.classList.contains("edit")){
    
    featureTitle.value = featureRequest.querySelector(".title").innerText;
    description.value = featureRequest.querySelector(".description").innerText;

  
    hiddenId.value = featureRequest.parentNode.id;
    Materialize.updateTextFields();
  }
}


// Delete function

function deleteFeatureRequest(e) {

  var featureRequest = e.target.parentNode;
  
  if(e.target.classList.contains("delete")){
    
    var id = featureRequest.parentNode.id;
    db.ref("requests/" + id).remove();
    clearForm();
  }
}


featureRequestsRef.on("child_removed", data =>{

  var featureRequest = document.getElementById(data.key);
  featureRequest.parentNode.removeChild(featureRequest);

})


function clearForm(){

  var featureTitle = document.getElementById("featureTitle");
  var description = document.getElementById("description");
  
  featureTitle.value = "";
  description.value = "";

}




// HTML template for each feature request item in the front end

function requestTemplate({featureTitle, description, createdAt}) {

  var createdAtFormatted = new Date(createdAt);

  return `
      <div style="text-align: left; margin-bottom: 30px; margin-top: 30px">
        <label>Title:</label>
        <span class="title"><strong>${ featureTitle }</strong></span>
        
        <br>

        
        <label>Description:</label>
        <span class="description"><strong>${ description }</strong></span>

        <br>

        <label>Created at:</label>
        <span class="createdAt"><strong>${ createdAtFormatted }</strong></span>
        
        <br>
        <br>

        <button name="data" class="waves-effect waves-light btn edit">Update</button>
        <button name="data" class="waves-effect waves-light btn delete">Delete</button>
      </div>
 

      <br>
      <hr>
  `
}




