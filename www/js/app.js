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

//Initialize DOM
document.addEventListener('init', function (event) {

    var page = event.target;

    if (page.id === 'index') { //page.id is ons-page of every template in html
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
                var regNewID = $('#nickname').val(); //takes user input nickname
                var userRef = firebase.database().ref().child('users').orderByChild('nickname').equalTo(regNewID); //access firebase with the given input
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

            }
        }
    } else if (page.id === 'registration-age') {
        page.querySelector('#btn-nextBirthday').onclick = function () {
            if ($('#birthday').val() == '') {
                ons.notification.alert("Please enter your birthday!");
            } else {
                var validAge = $('#birthday').val();
                validAge = new Date(validAge); //assigns user date using Date class
                var today = new Date(); // assigns the date today

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

        //Assigning of variables must be in last page of inputting data
        var nickname = $('#nickname').val();
        var birthday = $('#birthday').val();
        var gender = $('input[name=gender]:checked').val();
        var area = $('#registration-area').val();

        //Show default avatar based on gender
        if (gender == 'Male') {
            $("#avatar").attr("src", "images/icons/defaultMale.png");
        } else {
            $("#avatar").attr("src", "images/icons/defaultFemale.png");
        }

        //If user decides to change avatar
        $('#file-input').on('change', function (event) {
            document.getElementById('avatar').src = window.URL.createObjectURL(this.files[0]);
            selectedFile = event.target.files[0];
                $('#file-input').ImageResize({
                    maxWidth: 300
                });
            console.log(selectedFile);
        });

        page.querySelector('#btn-nextComplete').onclick = function () {

            var database = firebase.database().ref();
            var userRef = database.child('users');

            var desc = $('textarea#aboutMe').val();

            var newuserID = userRef.push(); //assign a key to this user 
            // var userID = newuserID.key;


            //Checks if user decides to change avatar
            if ($('#file-input')[0].files.length == 0) { 
                if (gender == 'Male') {
                    var storageRef = firebase.storage().ref('/profileImages/defaultMale.png');
                } else {
                    var storageRef = firebase.storage().ref('/profileImages/defaultFemale.png');
                }
                storageRef.getDownloadURL().then(function (downloadURL) { //gets the download URL of the default avatar
                    newuserID.set({
                        nickname: nickname,
                        birthday: birthday,
                        gender: gender,
                        desc: desc,
                        area: area,
                        url: downloadURL,
                        regTime: moment().format('LT'),
                        regDate: moment().format('LL'),
                        approved: 0
                    });
                });
            } else { 
                //Create a root reference in pictures
                var filename = selectedFile.name;
                var storageRef = firebase.storage().ref('/profileImages/' + nickname + filename);
                // var storageRef = firebase.storage().ref('/profileImages/' + new Date().getTime() + filename);
                var uploadTask = storageRef.put(selectedFile);
                ons.notification.alert('Please wait for your picture to upload.');
                // Register three observers:
                // 1. 'state_changed' observer, called any time the state changes
                // 2. Error observer, called on failure
                // 3. Completion observer, called on successful completion
                uploadTask.on('state_changed', function (snapshot) {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    // ons.notification.alert('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            break;
                        // case firebase.storage.TaskState.SUCCESS:
                        // ons.notification.alert('Upload complete!');
                        // break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running');
                            break;

                    }
                }, function (error) {
                    // Handle unsuccessful uploads
                }, function () {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    ons.notification.alert('Upload complete!');
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
                            regDate: moment().format('LL'),
                            approved: 0

                        });
                    });
                });

            }
            document.querySelector('#myNavigator').pushPage('registration-complete.html');

        }
    }


});

// Testing
// Works outside init function
firebase.database().ref().child('transmissions').on('value', function (snapshot) {
    $('div.historylist').click(function () {
        var element = $(this).index();

        var specifictransID = snapshotToArray(snapshot)[element].key;
    
        console.log(specifictransID);
        document.querySelector('#myNavigator').pushPage('pushed-page.html');

        showTransmission(specifictransID);

    });

});

// Validation scripts

function checkAgeLength() {

    if ($('#minAge').val().length < 2) {
        $('#minAge').charLimit({ limit: 2 });
    }

    if ($('#maxAge').val().length < 3) {
        $('#maxAge').charLimit({ limit: 3 });
    }
}

function validateAges() {

    if ($('#minAge').val() < 18) {
        ons.notification.alert('Must be 18 and above!');
    }
}

//End Validation Scripts

var rootRefForUsers = firebase.database().ref().child('users');

rootRefForUsers.on("child_added", snap => { //shows all users 
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

rootRefForMessages.on("child_added", snap => { //shows all transmissions
    var date = snap.child('date').val();
    var time = snap.child('time').val();
    var message = snap.child('message').val();

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

document.addEventListener('show', function (event) { //initiates on showing individual pages
    // document.addEventListener('init', function (event) {


    var page = event.target;
    var titleElement = document.querySelector('.toolbar-title');

    if (page.matches('#first-page')) {

        var userNickname = $(document).getUrlParam('Nickname'); //method is from jquery plugin (getUrlParam)
        console.log(userNickname);

        firebase.database().ref().child('users').orderByChild('nickname').equalTo(userNickname).on('value', function (snapshot) {
            
            //assign variables from the specific nickname
            var imgSrc = snapshotToArray(snapshot)[0].url; 
            var userKey = snapshotToArray(snapshot)[0].key;

            window.setUserKey = function () {
                return userKey;
            }

            $("#avatar").attr("src", imgSrc); //overwrites src attribute 

        });

        // titleElement.innerHTML = 'Search';
        page.querySelector('#btn-toGPS').onclick = function () {

            var database = firebase.database().ref();
            var transRef = database.child('transmissions');

            //Takes user inputs in search module
            var gender = $('input[name=gender]:checked').val();
            var minAge = $('#minAge').val();
            var maxAge = $('#maxAge').val();
            var radius = $('#radius').val();
            var message = $('textarea#message').val();

            var specificnewtransID = transRef.push(); //generates new transmission ID

            // Validation for age range
            if (maxAge < minAge || maxAge == minAge) {
                ons.notification.alert('Invalid age range!');
            } else if (maxAge > 100) {
                ons.notification.alert('Max age is 100!');
            } else if (minAge < 18) {
                ons.notification.alert('Age must be 18 and above!');
            } else {
                specificnewtransID.set({ // inserts transmission data to Firebase
                    gender: gender,
                    minAge: minAge,
                    maxAge: maxAge,
                    radius: radius,
                    message: message,
                    date: moment().format('LT'),
                    time: moment().format('LL')
                });

                document.querySelector('#myNavigator').pushPage('toGPS-page.html');
            }

        }
    }
    else if (page.matches('#second-page')) {

    } else if (page.matches('#third-page')) {
        // titleElement.innerHTML = 'Friend List';

    } else if (page.matches('#fourth-page')) {
        // titleElement.innerHTML = 'Profile';
        var userKey = setUserKey(); //requires manual navigation to first-page for this function to work
        console.log(userKey);
        showProfile(userKey); 

        page.querySelector('#btnSubmit').onclick = function () {
            updateProfile(userKey);
        }

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

    document.querySelector('#myNavigator').addEventListener('postpush', function (event) { //occurs after navigating to pushed-page

        var ref = firebase.database().ref('transmissions');
        
        ref.once('value')
            .then(function (snapshot) { //shows individual details in messages
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

                document.querySelector('#myNavigator').addEventListener('prepop', function (event) {
                    specifictransID = {}; //Shows individual messages but multiple errors in console
                    // console.log(snapshotToArray(snapshot));
                });
            });
    });

}


// function updateProfile(userKey, imgSrc) {
function updateProfile(userKey) { //occurs when done button is clicked in edit profile

    if ($('#nickname').val() == '') {
        ons.notification.alert("Please enter a new nickname!");
        return false;
    } else {
        var regNewNickname = $('#nickname').val();
        var userRef = firebase.database().ref().child('users').orderByChild('nickname').equalTo(regNewNickname);
        userRef.once("value")
            .then(function (snapshot) {
                var userData = snapshot.val(); //gets specific nickname Object
                console.log();
                if (userData) {
                    ons.notification.alert('Nickname already exists!');
                } else {
                    nickname = $('#nickname').val();
                    desc = $('#desc').val();
                    data = { nickname, desc }
                    firebase.database().ref().child('users/' + userKey).update(data);
                    console.log(data);
                    userNickname = nickname;

                    }, 2000);

                }
            });

        return false;

    }

}

function showProfile(userKey) {
    firebase.database().ref('users').on('value', function(snapshot){ //shows current user data in Edit Profile
        var nickname = snapshot.child(userKey + '/nickname').val();
        var desc = snapshot.child(userKey + '/desc').val();

        $('#nickname').val(nickname);
        $('#desc').val(desc);
    
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

