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

function requestTemplate({ featureTitle, description, createdAt, votes = {} }) {
  const upVotes = votes.up || 0;
  const downVotes = votes.down || 0;

  var createdAtFormatted = new Date(createdAt);
  var trimmedDate = createdAtFormatted.toString().split('G')[0];

  return `
    <div class="card feature-card z-depth-1">
      <div class="card-content" style="position: relative;">
        <div style="position: absolute; top: 10px; right: 10px;">
          <i class="material-icons edit" style="cursor:pointer;">edit</i>
          <i class="material-icons delete" style="cursor:pointer; margin-left:10px;">delete</i>
        </div>

        <h5 class="title" style="font-weight: 600; margin-bottom: 10px;">${featureTitle}</h5>

        <label style="font-weight: 500;">Description:</label>
        <div class="description" style="white-space: pre-line; margin-bottom: 12px;">${description}</div>

        <div class="votes" style="margin-top: 10px;">
          <i class="material-icons thumb_up" style="cursor:pointer; vertical-align: middle;">thumb_up</i> 
          <span>${upVotes}</span>

          <i class="material-icons thumb_down" style="cursor:pointer; margin-left:15px; vertical-align: middle;">thumb_down</i> 
          <span>${downVotes}</span>
        </div>

        <br>

        <label style="font-weight: 500;">Created at:</label>
        <div class="createdAt">${trimmedDate}</div>
      </div>
    </div>
  `
}


function handleVote(e) {
  const isUpvote = e.target.classList.contains("thumb_up");
  const isDownvote = e.target.classList.contains("thumb_down");

  if (!isUpvote && !isDownvote) return;

  const featureCard = e.target.closest(".card");
  const requestId = featureCard.id;

  const voteType = isUpvote ? "up" : "down";
  const localVoteKey = `voted_${requestId}`;

  // prevent multiple votes from same user (basic)
  const previousVote = localStorage.getItem(localVoteKey);
  if (previousVote === voteType) {
    return alert("You already voted.");
  }

  const voteRef = db.ref(`requests/${requestId}/votes/${voteType}`);

  voteRef.transaction(current => (current || 0) + 1)
    .then(() => {
      localStorage.setItem(localVoteKey, voteType);
    });
}

// Attach voting handler
featureList.addEventListener("click", handleVote);




