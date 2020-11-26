// Initialize Firebase
 var config = {
     apiKey: "AIzaSyDA_mCupLdnUFYKFZXrHrV759tr2qZyPgk",
     authDomain: "azax-5de4d.firebaseapp.com",
     databaseURL: "https://azax-5de4d.firebaseio.com",
     projectId: "azax-5de4d",
     storageBucket: "",
     messagingSenderId: "778099817545",
     appId: "1:778099817545:web:2150c53eba9bf567419398",
     measurementId: "G-HJ8CCMS73X"
 };
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

// Reference phone collection
var leadRef = firebase.database().ref('lead');

//Listen for form submit
document.getElementById('contactForm').addEventListener('submit', submitForm);

//Submit Form
function submitForm(e){
  e.preventDefault();
  //Get values
  var name = getInputVal('name');
  var phone = getInputVal('phone');
  var email = getInputVal('email');
  var message = getInputVal('message')
    var whatsapp = document.getElementById("whatsapp").checked
  var date = Date(Date.now());
if (phone == '' || email == '' || name == '') {
    console.log("no data")
} else {

    //SaveLead/
    saveLead(name, phone, email, message, date, whatsapp);

    //Show Alert
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('success').removeAttribute("hidden");

    //Hide alert after 100 seconds
    setTimeout(function () {
        document.querySelector('.alert').style.display = 'none';
    }, 10000);

    //Clear Form
    document.getElementById('contactForm').reset();
    //window.location.href = "index.html";
}
}

// Function to get get form values
function getInputVal(id){
  return document.getElementById(id).value;

}

// Function to save lead to Firebase
function saveLead(name, phone, email,message, date, whatsapp){
  var newLeadRef = leadRef.push();
  newLeadRef.set({
    name: name,
    phone: phone,
    email: email,
    date: date,
      message: message,
      whatsapp: whatsapp
  });
}

// Function to send lead conversion
document.getElementById('contactForm').addEventListener('submit', gtag_report_conversion);


function gtag_report_conversion(e) {
  e.preventDefault();

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'AW-803288281');
  gtag('config', 'UA-141668926-3');

   var callback = function () {
    if (typeof(url) != 'undefined') {
    window.location = url;
        }
      };
    gtag('event', 'conversion', {
         'send_to': 'AW-803288281/pSwSCIqWnaUBENnphP8C',
         'event_callback': callback
      });
      return false;
    }
    


