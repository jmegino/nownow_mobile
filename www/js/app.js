
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
                var regNewID = $('#nickname').val();
                var userRef = firebase.database().ref().child('users').orderByChild('nickname').equalTo(regNewID);
                userRef.once("value")
                    .then(function (snapshot) {
                        var userData = snapshot.val();
                        if (userData) {
                            ons.notification.alert('Nickname already exists!');
                        } else {
                            document.querySelector('#myNavigator').pushPage('registration-age.html');

                        }
                    });

                return false;
                // var userID = lastIndex+1;

                // input data (start)


                // Reassign lastID value
                // lastIndex = userID;
                // $("#addUser input").val("");
                // input data (end)

            }
        }
    } else if (page.id === 'registration-age') {
        page.querySelector('#btn-nextBirthday').onclick = function () {
            if ($('#birthday').val() == '') {
                ons.notification.alert("Please enter your birthday!");
            } else {
                var validAge = $('#birthday').val();
                validAge = new Date(validAge);
                var today = new Date();

                var age = Math.floor((today - validAge) / (365.25 * 24 * 60 * 60 * 1000));
                if (age >= 18) {
                    document.querySelector('#myNavigator').pushPage('registration-gender.html');
                } else {
                    ons.notification.alert('Minors are not allowed!');
                }


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

            $("#avatar").attr("src", "images/icons/defaultMale.png");
        } else {
            $("#avatar").attr("src", "images/icons/defaultFemale.png");
        }


        $('#file-input').on('change', function (event) {
            document.getElementById('avatar').src = window.URL.createObjectURL(this.files[0]);
            selectedFile = event.target.files[0];
            console.log(selectedFile);
            // onchange="document.getElementById('avatar').src = window.URL.createObjectURL(this.files[0]); selectedFile = event.target.files[0];"
        });

        page.querySelector('#btn-nextComplete').onclick = function () {

            // document.querySelector('#myNavigator').pushPage('registration-complete.html');

            var database = firebase.database().ref();
            var userRef = database.child('users');

            var desc = $('textarea#aboutMe').val();

            var newuserID = userRef.push();
            var userID = newuserID.key;

            if ($('#file-input')[0].files.length == 0) {
                if (gender == 'Male') {
                    var storageRef = firebase.storage().ref('/profileImages/defaultMale.png');
                } else {
                    var storageRef = firebase.storage().ref('/profileImages/defaultFemale.png');
                }
                storageRef.getDownloadURL().then(function (downloadURL) {
                    newuserID.set({
                        nickname: nickname,
                        birthday: birthday,
                        gender: gender,
                        desc: desc,
                        area: area,
                        url: downloadURL,
                        regTime: moment().format('LT'),
                        regDate: moment().format('LL')
                    });
                });
            } else {
                console.log('picture present');
                //Create a root reference in pictures
                var filename = selectedFile.name;
                var storageRef = firebase.storage().ref('/profileImages/' + filename);
                var uploadTask = storageRef.put(selectedFile);

                // Register three observers:
                // 1. 'state_changed' observer, called any time the state changes
                // 2. Error observer, called on failure
                // 3. Completion observer, called on successful completion
                uploadTask.on('state_changed', function (snapshot) {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running');
                            break;
                    }
                }, function (error) {
                    // Handle unsuccessful uploads
                }, function () {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                        // console.log('File available at', downloadURL);

                        newuserID.set({
                            nickname: nickname,
                            birthday: birthday,
                            gender: gender,
                            desc: desc,
                            area: area,
                            url: downloadURL,
                            regTime: moment().format('LT'),
                            regDate: moment().format('LL')
                        });
                    });
                });

            }
            document.querySelector('#myNavigator').pushPage('registration-complete.html');
            // var database = firebase.database().ref();
            // var userRef = database.child('users');

            // var desc = $('textarea#aboutMe').val();

            // var newuserID = userRef.push();
            // var userID = newuserID.key;

            // firebase.database().ref('users/' + userID).set({
            //   nickname: nickname,
            //   birthday: birthday,
            //   gender: gender,
            //   area: area,
            //   desc: desc,
            // });

            // newuserID.set({
            //     nickname: nickname,
            //     birthday: birthday,
            //     gender: gender,
            //     desc: desc,
            //     area: area,
            //     url: downloadURL
            // });

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

// document.addEventListener('show', function (event) {
document.addEventListener('init', function (event) {

    var page = event.target;
    var titleElement = document.querySelector('.toolbar-title');


    if (page.id === 'first-page') {
        titleElement.innerHTML = 'Search';
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
            // var specifictransID = specificnewtransID.key;
            // var specifictransID = specifictransID.getKey;


            if (maxAge < minAge || maxAge == minAge) {
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

                document.querySelector('#myNavigator').pushPage('toGPS-page.html');
            }
            // Reassign lastID value
            // lastIndex = userID;
            // $("#addUser input").val("");

            // document.querySelector('#myNavigator').pushPage('registration-complete.html');
        }
    }
    else if (page.id === 'second-page') {
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
                // document.querySelector('#myNavigator').getPages()[0].destroy();

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

    document.querySelector('#myNavigator').addEventListener('postpush', function (event) {

        // var transmissionListings = $('div.details').children();
        // for(var i = 0; i< transmissionListings.length; i++){
        //     if(transmissionListings.length > 1){
        //         console.log(transmissionListings.length);
        //     }
        //     // transmissionListings[i].remove();
        //     // console.log(transmissionListings);
        // }

        var ref = firebase.database().ref('transmissions');
        // specifictransID = "-LHX--CDpzSUJRJmykOc";
        // ref.once('value')
        ref.once('value')
            .then(function (snapshot) {
                var date = snapshot.child(specifictransID + '/date').val();
                var time = snapshot.child(specifictransID + '/time').val();
                var message = snapshot.child(specifictransID + '/message').val();
                var gender = snapshot.child(specifictransID + '/gender').val();
                var minAge = snapshot.child(specifictransID + '/minAge').val();
                var maxAge = snapshot.child(specifictransID + '/maxAge').val();
                var radius = snapshot.child(specifictransID + '/radius').val();

                console.log(snapshotToArray(snapshot));

                $('#details-date').append('<h5  class="text-center text-primary" style="line-height: 20%;">' + date + '</h5>');
                $('#details-time').append('<h5 class="text-center text-primary" style="line-height: 20%;">' + time + '</h5>');
                $('#details-gender').append('<h5 class="text-center text-primary" style="line-height: 20%;">' + gender + '</h5>');
                $('#details-age').append('<h5 class="text-center text-primary" style="line-height: 20%;">' + minAge + ' - ' + maxAge + '</h5>');
                $('#details-radius').append('<h5 class="text-center text-primary" style="line-height: 20%;">' + radius + '</h5>');
                $('#details-message').append('<h5 class="text-center" style="line-height: 30%; margin-top: 10%">' + message + '</h5>');

                document.querySelector('#myNavigator').addEventListener('prepop', function (event) {
                    specifictransID = {}; //Shows individual messages but multiple errors in console
                    // console.log(snapshotToArray(snapshot));
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

