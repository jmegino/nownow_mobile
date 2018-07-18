
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDG4VV3dVvUT4njZroBLRTPlRr1pmnN1os",
    authDomain: "nownow-98a2f.firebaseapp.com",
    databaseURL: "https://nownow-98a2f.firebaseio.com",
    projectId: "nownow-98a2f",
    storageBucket: "nownow-98a2f.appspot.com",
    messagingSenderId: "902289067273"
};
firebase.initializeApp(config);

document.addEventListener('init', function (event) {

    /*       var firebaseIDRef = firebase.database().ref().child();
    
          firebaseIDRef.on('value', function(datasnapshot){
            var userID = datasnapshot.val();
            alert(userID);
    
          }); */

    var page = event.target;

    if (page.id === 'index') {
        page.querySelector('#push-button').onclick = function () {

            ons.notification.alert("This application uses GPS.<br> \
      Please turn on GPS function.");

            document.querySelector('#myNavigator').pushPage('registration-nickname.html');
        }
    } else if (page.id === 'registration-nickname') {
        page.querySelector('#push-form').onsubmit = function () {
            if ($('#nickname').val() == '') {
                ons.notification.alert("Please enter your nickname!");
                return false;
            } else {

                // var userID = lastIndex+1;

                // input data (start)


                // Reassign lastID value
                // lastIndex = userID;
                // $("#addUser input").val("");
                // input data (end)
                document.querySelector('#myNavigator').pushPage('registration-age.html');
                return false;
            }
        }
    } else if (page.id === 'registration-age') {
        page.querySelector('#btn-nextBirthday').onclick = function () {
            if ($('#birthday').val() == '') {
                ons.notification.alert("Please enter your birthday!");
            } else {

                document.querySelector('#myNavigator').pushPage('registration-gender.html');
            }
        }
    } else if (page.id === 'registration-gender') {
        page.querySelector('#btn-nextGender').onclick = function () {
            // var area = $('#registration-area').val();


            document.querySelector('#myNavigator').pushPage('registration-bio.html');

        }
    } else if (page.id === 'registration-bio') {

        // var userID = lastIndex + 1;
        var nickname = $('#nickname').val();
        var birthday = $('#birthday').val();
        var gender = $('input[name=gender]:checked').val();
        var area = $('#registration-area').val();


        if (gender == 'Male') {

            $('#avatar').addClass('backImageM');

        } else {
            $('#avatar').addClass('backImageF');
        }

        page.querySelector('#btn-nextComplete').onclick = function () {

            document.querySelector('#myNavigator').pushPage('registration-complete.html');

            var database = firebase.database().ref();
            var userRef = database.child('users');

            var desc = $('textarea#aboutMe').val();

            var newuserID = userRef.push();
            var userID = newuserID.key;

            // firebase.database().ref('users/' + userID).set({
            //   nickname: nickname,
            //   birthday: birthday,
            //   gender: gender,
            //   area: area,
            //   desc: desc,
            // });

            newuserID.set({
                nickname: nickname,
                birthday: birthday,
                gender: gender,
                desc: desc,
                area: area
            });

            // Reassign lastID value
            // lastIndex = userID;
            // $("#addUser input").val("");


        }
    }

});


/* ons.bootstrap()
.controller('UsersController', function($scope) {
  console.log('controller', $scope.myNavigator.topPage.data);

  this.init = function(e) {
    // Ensure the emitter is the current page, not a nested one
    if (e.target === e.currentTarget) {
      var page = e.target;
      // Safely access data
      console.log('init event', page.data);
    }
  };
}); */

/* ons.bootstrap().controller('UsersController', function(){
  this.nickname = '';

});
*/

// Validation script

function checkAgeLength() {
    // var countLength = $('#minAge').val().length;
    // alert(countLength);

    if ($('#minAge').val().length < 2) {
        $('#minAge').charLimit({ limit: 2 });
        // $('#minAge').inputmask("decimal", {min: 18, max: 100});
    }

    if ($('#maxAge').val().length < 3) {
        $('#maxAge').charLimit({ limit: 3 });
    }
}
// var maxChars = 2;
// if ($(this).val().length > maxChars) {
//         $(this).val() = $(this).val().slice(0, 2);

//     } 


function validateAges() {

    if ($('#minAge').val() < 18) {
        ons.notification.alert('Must be 18 and above!');
    }

    // return event.charCode >= 48 && event.charCode <= 57

    // $('#minAge').keyup(function () {
    //   //Hardcoded minimum and maximum ages
    //   var minNum = 18;
    //   if (parseInt($(this).val()) > minNum) {
    //     $(this).val('');
    //     ons.notification('Minimum age is 18 years old!');
    //   } else {

    //   }
    // });

    // $('#maxAge').keyup(function () {
    //   //Hardcoded minimum and maximum ages
    //   var maxNum = 100;
    //   if (parseInt($(this).val()) > maxNum) {
    //     $(this).val('');
    //     ons.notification('Maximum age is 100 years old!')
    //   } else {

    //   }
    // });
}



var rootRef = firebase.database().ref();
var userID = rootRef.child('users/').push().getKey();
function updateData() {


    nickname = $('#nickname').val();
    desc = $('#desc').val();
    data = { nickname, desc, userID }
    // rootRef.child('users/'+userID).update(data);
    console.log(data);
}

var rootRefForUsers = firebase.database().ref().child('users');

rootRefForUsers.on("child_added", snap => {
    var nickname = snap.child('nickname').val();
    var area = snap.child('area').val();
    var gender = snap.child('gender').val();

    if (gender === 'Male') {
        $("#friendlist-container").append('<div class="friendlist" style="width:100%; padding:2%; ">\n' +
            '            <div class="friend1 rounded-circle backImageM"></div>\n' +
            '            <h6 class="friend-details" style="margin-left:5%;">' + nickname + ' from ' + area + '</h6>\n' +
            '            </div>\n');
    } else {
        $("#friendlist-container").append('<div class="friendlist" style="width:100%; padding:2%; ">\n' +
            '            <div class="friend1 rounded-circle backImageF"></div>\n' +
            '            <h6 class="friend-details" style="margin-left:5%;">' + nickname + ' from ' + area + '</h6>\n' +
            '            </div>\n');
    }

});

var rootRefForMessages = firebase.database().ref().child('transmissions');

rootRefForMessages.on("child_added", snap => {
    var date = snap.child('date').val();
    var time = snap.child('time').val();
    var message = snap.child('message').val();
    var gender = snap.child('gender').val();
    var minAge = snap.child('minAge').val();
    var maxAge = snap.child('maxAge').val();
    var radius = snap.child('radius').val();


    $("#messages-container").append('<div class="historylist"\n' +
        '                     style="width:100%; height:8vh; line-height: 20%; padding:2%; margin-top:5%; display:inline-block; font-family:\'Courier New\', sans-serif;">\n' +
        '\n' +
        '                    <p class="history-details-date" style="float:left; margin-left:1%;font-weight:bold;">' + date + '</p>\n' +
        '                    <p class="history-details-time" style="float:left; margin-left:10%;font-weight:bold;">' + time + '</p>\n' +
        '                    <div style="width:70; overflow:hidden;float:left; padding:1.5%; ">\n' +
        '                        <p class="history-details-message">' + message + '</p>\n' +
        '                    </div>\n' +
        '                    <ons-button id="btn-tohistorylist"\n' +
        '                                class="text-center btn btn-block btn-info"\n' +
        '                                style="width: 20% !important; float:right;margin-right:.5%; margin-top:-6.5%;">View\n' +
        '                    </ons-button>\n' +
        '                </div>');

});

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    console.log(navigator.camera);

}

document.addEventListener('show', function (event) {

    var page = event.target;
    var titleElement = document.querySelector('.toolbar-title');

    if (page.matches('#first-page')) {
        titleElement.innerHTML = 'Search';
        if (page.id === 'first-page') {

            page.querySelector('#btn-toGPS').onclick = function () {

                var database = firebase.database().ref();
                var transRef = database.child('transmissions');

                // var specifictransID = lastIndex + 1;
                var rawTime = moment().format('LT');
                var rawDate = moment().format('LL');

                // var userID = lastIndex + 1;
                var gender = $('input[name=gender]:checked').val();
                var minAge = $('#minAge').val();
                var maxAge = $('#maxAge').val();
                var radius = $('#radius').val();
                var message = $('textarea#message').val();

                var specificnewtransID = transRef.push();
                var specifictransID = specificnewtransID.key;
                var specificspecifictransID = specifictransID.getKey;


                if (maxAge < minAge) {
                    ons.notification.alert('Invalid age range!');
                } else if (maxAge > 100) {
                    ons.notification.alert('Max age is 100!');
                } else if (minAge < 18) {
                    ons.notification.alert('Age must be 18 and above!');
                } else {
                    ons.notification.alert('oks');
                    specificnewtransID.set({
                        gender: gender,
                        minAge: minAge,
                        maxAge: maxAge,
                        radius: radius,
                        message: message,
                        date: rawDate,
                        time: rawTime
                    });

                    // firebase.database().ref('transmissions/' + specifictransID).set({
                    //   gender: gender,
                    //   minAge: minAge,
                    //   maxAge: maxAge,
                    //   radius: radius,
                    //   message: message,
                    //   date: rawDate,
                    //   time: rawTime,

                    // });

                    // lastIndex = specifictransID;

                    document.querySelector('#nav1').pushPage('toGPS-page.html');
                }
                // Reassign lastID value
                // lastIndex = userID;
                // $("#addUser input").val("");

                // document.querySelector('#myNavigator').pushPage('registration-complete.html');
            }
        }
    } else if (page.matches('#second-page')) {
        titleElement.innerHTML = 'Chat History';
        // $('div.historylist').click(function () {
        //     // console.log($(this).index() + 1);
        //     var element = $(this).index();
        // });

        // Testing
        firebase.database().ref().child('transmissions').on('value', function (snapshot) {
            $('div.historylist').click(function () {
                // console.log($(this).index() + 1);
                var element = $(this).index();

                var specifictransID = snapshotToArray(snapshot)[element].key;
                // console.log(snapshotToArray(snapshot)[0].key);
                console.log(specifictransID);
                document.querySelector('#myNavigator').pushPage('pushed-page.html');

                showTransmission(specifictransID);


            });

        });


        /*       var rootRef = firebase.database().ref().child('transmissions');
    
              rootRef.on("child_added", snap => {
                var name = snap.child
              }); */



    } else if (page.matches('#third-page')) {
        titleElement.innerHTML = 'Friend List';

    } else if (page.matches('#fourth-page')) {
        titleElement.innerHTML = 'Profile';
    }

});


document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    console.log(navigator.notification);
}

var showConfirm = function () {

    ons.notification.confirm('Your message has been successfully sent!', {
        buttonLabels: ['Home', 'Details'],
        title: 'NowNow Complete'

    })
        .then(function (answer) {
            if (answer == 0) {
                window.location.href = 'mainpage.html';
            }
            else if (answer == 1) {
                window.location.href = "myNavigator.pushPage('pushed-page.html')";


            }
        });

}

function showTransmission(specifictransID) {

    ons.ready(function () {
        document.querySelector('#myNavigator').addEventListener('postpush', function (event) {

            // var transmissionListings = $('div.details').children();
            // for(var i = 0; i< transmissionListings.length; i++){
            //     if(transmissionListings.length >= 1){
            //         console.log('sakto');
            //     }
            //     // transmissionListings[i].remove();
            //     // console.log(transmissionListings);
            // }

            // var rootRefForMessages = firebase.database().ref().child('transmissions/');
            // var rootRefForMessages = firebase.database().ref();


            // rootRefForMessages.child('transmissions/-LHTe8zUroEDB7zTAACm').on("child_added", snap => {
            //     var date = snap.child('date').val();
            //     var time = snap.child('time').val();
            //     var message = snap.child('message').val();
            //     var gender = snap.child('gender').val();
            //     var minAge = snap.child('minAge').val();
            //     var maxAge = snap.child('maxAge').val();
            //     var radius = snap.child('radius').val();
            //     $('#details-date').append('<h5  class="text-center text-primary" style="line-height: 20%;">' + date + '</h5>');
            //     $('#details-time').append('<h5 class="text-center text-primary" style="line-height: 20%;">' + time + '</h5>');
            //     $('#details-gender').append('<h5 class="text-center text-primary" style="line-height: 20%;">' + gender + '</h5>');
            //     $('#details-age').append('<h5 class="text-center text-primary" style="line-height: 20%;">' + minAge + ' - ' + maxAge + '</h5>');
            //     $('#details-radius').append('<h5 class="text-center text-primary" style="line-height: 20%;">' + radius + '</h5>');
            //     $('#details-message').append('<h5 class="text-center" style="line-height: 30%; margin-top: 10%">' + message + '</h5>');
            // });

            var ref = firebase.database().ref('transmissions');
            // specifictransID = "-LHX--CDpzSUJRJmykOc";
            ref.once('value')
                .then(function (snapshot) {
                    var date = snapshot.child(specifictransID + '/date').val();
                    var time = snapshot.child(specifictransID + '/time').val();
                    var message = snapshot.child(specifictransID + '/message').val();
                    var gender = snapshot.child(specifictransID + '/gender').val();
                    var minAge = snapshot.child(specifictransID + '/minAge').val();
                    var maxAge = snapshot.child(specifictransID + '/maxAge').val();
                    var radius = snapshot.child(specifictransID + '/radius').val();

                    $('#details-date').append('<h5  class="text-center text-primary" style="line-height: 20%;">' + date + '</h5>');
                    $('#details-time').append('<h5 class="text-center text-primary" style="line-height: 20%;">' + time + '</h5>');
                    $('#details-gender').append('<h5 class="text-center text-primary" style="line-height: 20%;">' + gender + '</h5>');
                    $('#details-age').append('<h5 class="text-center text-primary" style="line-height: 20%;">' + minAge + ' - ' + maxAge + '</h5>');
                    $('#details-radius').append('<h5 class="text-center text-primary" style="line-height: 20%;">' + radius + '</h5>');
                    $('#details-message').append('<h5 class="text-center" style="line-height: 30%; margin-top: 10%">' + message + '</h5>');

                });
        });
    });
}

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function (childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};

