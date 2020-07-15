
<input id='transcript-select' type='file' hidden/>
<script>
firebase.auth().onAuthStateChanged(function(user) {
	var assessmentIncomplete = document.getElementById("assessment-incomplete")
  var assessmentComplete = document.getElementById("assessment-complete")
	var interviewIncomplete = document.getElementById("interview-incomplete")
	var interviewComplete = document.getElementById("interview-complete")
	var transcriptIncomplete = document.getElementById("transcript-incomplete")
	var transcriptComplete = document.getElementById("transcript-complete")
	var facultyIncomplete = document.getElementById("faculty-incomplete")
	var facultyComplete = document.getElementById("faculty-complete")

  if (user) {
  	var userDB = firebase.firestore()
		var userID = user.uid
    console.log("user is signed in with uid: " + userID)

    userDB.collection("users").doc(userID)
    .onSnapshot(function(doc) {
    
    		//Assessment completion view
    		if (doc.get("preInterview") == false) {
        		assessmentIncomplete.style.display = "block"
            assessmentComplete.style.display = "none"
            
						document.getElementById("onboarding-assessment")
        			.setAttribute('onClick', 'assessmentForm("'+userID+'")')                
        } else {
        		assessmentIncomplete.style.display = "none"
            assessmentComplete.style.display = "block"
        } 
        //Interview completion view
        if (doc.get("interview") == false) {
        		interviewIncomplete.style.display = "block"
            interviewComplete.style.display = "none"
        } else {
        		interviewIncomplete.style.display = "none"
            interviewComplete.style.display = "block"        
        }
        document.getElementById("schedule-interview")
            		.setAttribute('onClick', 'scheduleInterview()')
    });
    storageRef = storageService.ref()
    
    var hiddenFileButton = document.getElementById("transcript-select")
    hiddenFileButton.addEventListener('change', handleTranscriptUploadChange);
    var uploadTranscript = document.getElementById("upload-transcript")
    uploadTranscript.addEventListener('click', openDialog)

    function openDialog() {
      hiddenFileButton.click();
    }

    var selectedTranscriptFile;
    function handleTranscriptUploadChange(e) {
      selectedTranscriptFile = e.target.files[0];
      handleTranscriptUpload()
    }

    async function handleTranscriptUpload() {
        const uploadTask = await storageRef.child(`transcripts/${selectedTranscriptFile.name}`).put(selectedTranscriptFile);
        uploadAndUpdateFirebase()
    }

    //Final Submit Button and Update Firebase
    async function uploadAndUpdateFirebase() {
        var transcriptFileURL = ""
        await storageRef.child('/transcripts/'+selectedTranscriptFile.name).getDownloadURL().then(function(url) {
            transcriptFileURL = url.toString()
        })
        //dataRef.child(userId).update({"/profileURL/" : photoFileURL})
        userDB.collection("users").doc(userID).update( {"transcriptFile" : transcriptFileURL})
    }
  } else {
    location.href = "https://www.jointutortree.com"
  }
});


//Pre-interview functions
var isFormShowing = false
function assessmentForm(userID) {
    if (isFormShowing) {
        console.log(isFormShowing)
        document.getElementById("assessment-form-block")
        .style.display = "none"
        isFormShowing = false
    } else {
        console.log(isFormShowing)
        document.getElementById("assessment-form-block")
        .style.display = "block"
        isFormShowing = true
    }

    document.getElementById("submit-assessment")
        .setAttribute('onClick', 'submitAssessment("'+userID+'")')
}

function submitAssessment(userID) {
		var userDB = firebase.firestore()

		userDB.collection("users").doc(userID).get().then(function(doc) {
    
        var firstName = doc.get("firstName")
        var lastName = doc.get("lastName")
        var major = document.getElementById("major")
        var year = document.getElementById("year")
        var email = document.getElementById("email")
        var hours = document.getElementById("hours")
        var school = doc.get("school")
        var courses = document.getElementById("courses")
        var experience = document.getElementById("experience")
        var qualities = document.getElementById("qualities")
        var whyTutor = document.getElementById("whyTutor")
        var groups = document.getElementById("groups")

        var timeSubmitted = new Date()

        var preInterviewData = {
            "metadata" : {
                "timeSubmitted" : timeSubmitted,
                "approved" : false
            },
            "firstName" : firstName,
            "lastName" : lastName,
            "major" : major.value,
            "year" : year.value,
            "email" : email.value,
            "hours" : hours.value,
            "school" : school,
            "courses" : courses.value,
            "experience" : experience.value,
            "qualities" : qualities.value,
            "whyTutor" : whyTutor.value,
            "groups" : groups.value,            
        }
        userDB.collection("users").doc(userID).update( {"assessment" : preInterviewData} )
        .then(function() {
            console.log("sent")
        });
        //https://script.google.com/macros/s/AKfycbyn1b2w9_CFJ3zOFT-fapH2WMdOQVC1DfRjLy6REiM5jl1MQMY/exec
		})
}


//Schedule Interview Functions
function scheduleInterview() {
		var userDB = firebase.firestore()
    userDB.collection("users").doc(userID).get().then(function(doc) {
    		var hasSubmittedAssessment = doc.get("preInterview")
				var isApproved = doc.get("interview")
        
        if (hasSubmittedAssessment) {
        		alert("Thanks! You'll be notified at your preferred email with a referral code when your campus becomes available.")
        } else {
        		alert("Please complete your Pre-Interview Assessment before scheduling an interview")
        }
    })
}

//Upload Unofficial Transcript
function uploadTranscript() {


}


</script>
