// TODO Session timeout modal
// perfect pause functionality
// work on strict mode and free mode

/****************NAV ELEMENTS************************/
const screenFade = document.querySelector(".screen-fade");
const navLoginBtn = document.querySelector("#nav-login-btn");
const navSignupBtn = document.querySelector("#nav-signup-btn");
const navLogoutBtn = document.querySelector("#nav-logout-btn");

const helpIcon = document.querySelector("#help-icon");
const notificationIcon = document.querySelector("#notification-icon");
const settingsIcon = document.querySelector("#settings-icon");
const userIcon = document.querySelector("#user-icon");

const closeMobileModal = document.querySelector(".mobile-cancel");
const mobileModal = document.querySelector(".mobile-modal");

(function() {   
    let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
    if (isMobile) {
        document.querySelector(".origin-text-div").style.height = "";
        mobileModal.classList.remove("hide");
        screenFade.classList.remove("hide");
    }
 }());

closeMobileModal.addEventListener("click", function(){
    mobileModal.classList.add("hide");
    screenFade.classList.add("hide");
}, false)



// Auth status
let config = {};
function getConfig() {
    const TOKEN = localStorage.FBIdToken;
    // console.log(`Current Token is ${TOKEN}`)
    if(TOKEN) {
        console.log("there is a token")
        const decodedToken = jwt_decode(TOKEN);
        if(decodedToken && (decodedToken.exp * 1000 < Date.now())){ //if TOKEN is expired
            logout();
        } else {
          config = {
            headers: { Authorization: `${TOKEN}` }
          };
          console.log("Using token for authorization")
        }
      } else {
        config = {
          headers: { Authorization: null}
        }
        console.log("NOT using token for authorization")
      }

    console.log(config);
}



// colors
const mainGrey= "#564a59";
const lightGrey= "#a99bab";
const paleGrey= "#ece7ee";
const tealBlue= "#5490A0";
const lightTealBlue= "#69A4B5";
const blue = "#00a1e0ff";
const lightBlue= "#45bdedff";
const paleBlue= "#ebf9ff";
const red = "#CC2836";
const lightRed= "#DA4450";
const paleRed= "#FDD8E3";
const green= "#04b439";
const lighGreen= "#54cc78";

// Preferences
const sentenceChoiceLength = document.querySelectorAll(".choice");
const customTextInput = document.querySelector(".custom-text-input");
const savePreference = document.querySelector(".settings-save");
const settingsError = document.querySelector(".settings-error");

const modalInput = document.querySelectorAll(".modal-input");


function updatePreference() {
    let preference;

    if (customTextInput.value.trim() !== '') {
        preference = customTextInput.value;
    } else {
        for (let i = 0; i < sentenceChoiceLength.length; i++) {
            if (sentenceChoiceLength[i].checked) {
                preference = sentenceChoiceLength[i].value
                console.log(sentenceChoiceLength[i].value);
            }
        }
    }



    axios.post(
        'https://us-central1-typing-app-35c2f.cloudfunctions.net/api/setpreference',
        {
            "preference": preference
        },
        config
        )
        .then(function (response) {

            settingsModal.classList.add("hide");
            screenFade.classList.add("hide");

            localStorage.setItem('currentUser', JSON.stringify(response.data.userData[0]));

            let currentUser = localStorage.currentUser;
            
            let userData = JSON.parse(currentUser);

            console.log(userData);
            if (userData.preference !== null && userData.preference !== "sentence" && userData.preference !== "paragraph") {

                // console.log(generateInputText)
                // userData = Object.assign({}, userData, {preference: preference});
                // currentUser = localStorage.setItem('currentUser', JSON.stringify(userData))

                generateInputText.classList.add("hide");

                console.log(userData);
                console.log(userData.preference)
                customTextInput.value = userData.preference;
                originTextElement.innerHTML = userData.preference;
            }


            console.log(response.data.userData)

            window.location.href = '/';

        })
        .catch(function (error) {
            if(error.response.data.error == "Unauthorized") {
                settingsError.innerHTML = "Please login to use this feature";
            }
        })
}


savePreference.addEventListener("click", updatePreference ,false);



let originTextElement = document.querySelector(".origin-text p");
let originText;

function generateText() {
    getConfig();
    axios.post(
        'https://us-central1-typing-app-35c2f.cloudfunctions.net/api/generatetext',
        {
        },
        config
        )
        .then(function (response) {
            console.log(response.data)
            originTextElement.innerHTML = response.data.result;
            console.log(originTextElement);
            originText = originTextElement.innerHTML

            // window.location.href = '/';

        })
        .catch(function (error) {
            console.log(error.response)
        })
}
generateText();

// const originText = document.querySelector(".origin-text p").innerHTML;
const inputText = document.querySelector(".input-text");
const inputTextDiv = document.querySelector(".input-text-div");
const persistentInput = document.querySelector(".persistent-placeholder");
const timer = document.querySelector(".timer");
const resetTimer = document.querySelector(".reset");
const backspace = document.querySelector(".backspace");

const generateInputText = document.querySelector(".generate-new-input");

generateInputText.addEventListener("click", generateText, false)

const inputTextError = document.querySelector(".input-text-error");

persistentInput.innerHTML = originText;




let counter = [0,0,0,0]
let interval;
let timerRunning = false;
let extraCharacterCount = 0;
let backspaceCount = 0


function leadingZero(time) {
    if (time <= 9) {
        time = "0" + time;
    }
    return time;
}

function runTimer() {
    let currentTime = leadingZero(counter[0]) + ":" + leadingZero(counter[1]) + ":" + leadingZero(counter[2]);
    timer.innerHTML = currentTime;
    counter[3]++;

    counter[0] = Math.floor((counter[3]/100)/60);
    counter[1] = Math.floor((counter[3]/100) - (counter[0] * 60));
    counter[2] = Math.floor(counter[3] - (counter[1] * 100) - (counter[0] * 6000));


    let totalTimeInMinutes = counter[0] + counter[1]/60 + counter[2]/6000

    let textEntered = inputText.value;
    let textCharacters = textEntered.length;

    // console.log(textEntered, textCharacters);

    let charactersPerMinute;

    charactersPerMinute = textCharacters/totalTimeInMinutes

    // console.log(charactersPerMinute)
    // console.log(totalTimeInMinutes)
}


// function disableKeyboard() {
//     document.onkeydown = function (event) {
//         if (event.keyCode !== 8) {
//             return false;
//         }
//     }
// }


// function enableKeyboard() {
//     document.onkeydown = function (e) {
//         return true;
//     }
// }

function disableKeyboard() {
    inputTextError.classList.remove("hide");
    document.onkeydown = function (event) {
        if (event.keyCode !== 8) {
            inputText.readOnly = true;
        } else {
            backspaceCount++;
            inputText.readOnly = false;
        }
    }
}



function enableKeyboard() {
    inputTextError.classList.add("hide");
    document.onkeydown = function (e) {
        inputText.readOnly = false;
    }
}


let matches;
let characterCount;
function countWords(str) {
    matches = str.match(/[\w\d\’\'-]+/gi);
    wordCount = matches.length;
    return matches ? matches.length : 0;
  }


function spellCheck() {

    // originText = originText.replace(/\n/g, " ");

    characterCount = originText.length
    console.log("characterCount", characterCount)

    countWords(originText);
    console.log("wordCount", wordCount);


    let textEntered = inputText.value;
    console.log(textEntered)
    console.log(originText.substring(0, textEntered.length))

    let originTextMatch = originText.substring(0, textEntered.length);

    if (textEntered == originText) {
        clearInterval(interval);
        inputText.style.border = "2px solid green";
        inputText.style.backgroundColor = "var(--pale-green)";

        getResults();
        reset();
    } else {
        if (textEntered == originTextMatch) {
            console.log(counter[0], counter[1], counter[2])
            inputText.classList.remove("caret-red");
            inputText.style.border = "2px solid var(--blue)";
            inputText.style.backgroundColor = "white";
            if(event.keyCode) {
                event.returnValue = true;
                console.log(event.keyCode)
            }
            enableKeyboard();
        } else {
            extraCharacterCount++;
            console.log("extraCharacterCount", extraCharacterCount);
            disableKeyboard();
            console.log(counter[0], counter[1], counter[2])
            inputText.classList.add("caret-red");
            inputText.style.border = `2px solid var(--red)`;
            inputText.style.backgroundColor = "var(--pale-red)";
        }
    }

}

// function startTimer() {
//     let textEnterdLength = inputText.value.length;
//     if (textEnterdLength === 0 && !timerRunning) {
//         timerRunning = true;
//         interval = setInterval(runTimer, 10);
//     }
//     console.log(textEnterdLength);
// }

function startTimer() {
    if (!timerRunning) {
        document.querySelector(".pause-timer").classList.remove("hide");
        document.querySelector(".pause-timer").innerHTML = "Pause"
        timerRunning = true;
        interval = setInterval(runTimer, 10);
    }
    // console.log(textEnterdLength);
}

function pauseTimer() {
    let textEntered = inputText.value;
    let textEnterdLength = inputText.value.length;
    let originTextMatch = originText.substring(0, textEntered.length);
    console.log(textEnterdLength)
    if(timerRunning) {
        document.querySelector(".pause-timer").innerHTML = "Continue"
        clearInterval(interval);
        timerRunning = false;
        console.log(timerRunning)
    // } else if (!timerRunning && textEnterdLength !== 0 && textEntered !== originText) {
    } else if (!timerRunning) {
        inputText.addEventListener("keypress", function(){
            if(timerRunning) {
                clearInterval(interval);
                timerRunning = false;
                document.querySelector(".pause-timer").innerHTML = "Pause"
            }
            timerRunning = true
            interval = setInterval(runTimer, 10);
        }, false);
        document.querySelector(".pause-timer").innerHTML = "Pause"
        timerRunning = true
        interval = setInterval(runTimer, 10);
        console.log(timerRunning)
    }
}

document.querySelector(".pause-timer").addEventListener("click", function(){
    pauseTimer();
} ,false)

function reset() {
    backspaceCount = 0;
    extraCharacterCount = 0;
    clearInterval(interval);
    interval = null;
    counter = [0,0,0,0];
    timerRunning = false;

    document.querySelector(".pause-timer").classList.add("hide");
    document.querySelector(".pause-timer").innerHTML = "Start"

    inputText.value = "";
    timer.innerHTML = "00:00:00";
    inputTextDiv.style.borderColor = "grey";

    inputText.style.backgroundColor = "white";
    inputText.style.border = "2px solid var(--pale-grey)";
}

const resultModal = document.querySelector(".results-modal");
const closeResultModal = document.querySelectorAll(".results-cancel");

function getResults() {

    const resultHeader = document.querySelector(".result-header");

    const timeElapsedElement = document.querySelector(".time-elapsed");
    const sampleCharsElement = document.querySelector(".sample-characters");
    const userCharsElement = document.querySelector(".user-characters");
    const cpmElement = document.querySelector(".cpm");
    const sampleWordsElement = document.querySelector(".sample-words");
    const wpmElement = document.querySelector(".wpm");
    const errorRateElement = document.querySelector(".error-rate");

    const charsInSampleText = document.querySelectorAll(".chars-in-sample-text");
    const incorrectlyTypedChars = document.querySelector(".incorectly-typed-chars");
    const backspaces = document.querySelector(".backspaces");
    const timeElapsedCalc = document.querySelectorAll(".time-elapsed-calc");
    const wordsInSampleText = document.querySelector(".words-in-sample-text");
    const errorCalcUpper = document.querySelector(".error-calc-upper");

    let possibleHeaders = [
        "Sensational!",
        "Good work!",
        "Well done!",
        "Way to go!",
        "Good Job!",
        "Bravo!",
        "Nice!!!"
    ]

    resultHeader.innerHTML = possibleHeaders[Math.floor(Math.random() * possibleHeaders.length)] + " Here is how you performed";



    characterCount = originText.length
    console.log("characterCount", characterCount)
    countWords(originText);
    console.log("wordCount", wordCount);
    console.log("backspaceCount", backspaceCount);
    console.log("extraCharacterCount", extraCharacterCount)
    console.log(counter)

    timeElaped = (counter[0] + counter[1]/60 + counter[2]/6000).toFixed(2);
    userChars = (characterCount + backspaceCount + extraCharacterCount)

    timeElapsedElement.innerHTML = timeElaped + " mins";
    sampleCharsElement.innerHTML = characterCount;
    userCharsElement.innerHTML = userChars;
    cpmElement.innerHTML = (characterCount/timeElaped).toFixed(2);
    sampleWordsElement.innerHTML = wordCount;
    wpmElement.innerHTML = (wordCount/timeElaped).toFixed(2);
    errorRateElement.innerHTML = (100 - (((userChars - characterCount)/characterCount) * 100)).toFixed(2) + "%";

    charsInSampleText.forEach((element) => {
        element.innerHTML = `<span class="res-number">${characterCount}</span> characters in sample text`;
    })
    incorrectlyTypedChars.innerHTML = `<span class="res-number">${extraCharacterCount}</span> incorrectly typed characters`;
    backspaces.innerHTML = `<span class="res-number red">${backspaceCount}</span> backspaces`;
    timeElapsedCalc.forEach((element) => {
        element.innerHTML = `<span class="res-number">${timeElaped}</span> minutes`;
    })
    wordsInSampleText.innerHTML = `<span class="res-number">${wordCount}</span> words in sample text`
    errorCalcUpper.innerHTML = `<span class="res-number">${userChars}</span> characters types - <span class="res-number">${characterCount}</span> characters in sample text`;

    resultModal.classList.remove("hide");
    screenFade.classList.remove("hide");
}

closeResultModal.forEach((element) => {
    element.addEventListener("click", function(){
        resultModal.classList.add("hide");
        screenFade.classList.add("hide");
    }, false)
})


inputText.addEventListener("keypress", startTimer, false);
inputText.addEventListener("keyup", spellCheck, false);
resetTimer.addEventListener("click", reset, false);


const setAuthorizationHeader = (token) => {
    const FBIdToken = `Bearer ${token}`;
    localStorage.setItem('FBIdToken', FBIdToken);
    axios.defaults.headers.common['Authorization'] = FBIdToken;
}

const setCurrentUser = (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

const retrieveCurrentUser = (user) => {
    const currentUser = JSON.parse(localStorage.getItem(user));
    return currentUser;
}





const loginLink = document.querySelectorAll(".login-link");
const signupLink = document.querySelectorAll(".signup-link");
const loaderLogin = document.querySelector(".loader-login");
const loaderSignup = document.querySelector(".loader-signup");


/****************MODALS************************/
const loginModal = document.querySelector(".login-modal");
const signupModal = document.querySelector(".signup-modal");
const settingsModal = document.querySelector(".settings-modal");

loginLink.forEach((link) => {
    link.addEventListener("click", function(){
        screenFade.classList.remove("hide");
        loginModal.classList.remove("hide");
        signupModal.classList.add("hide");
    } ,false)
})

signupLink.forEach((link) => {
    link.addEventListener("click", function(){
        screenFade.classList.remove("hide");
        signupModal.classList.remove("hide");
        loginModal.classList.add("hide");
    } ,false)
})


settingsIcon.addEventListener("click", function(){
    
    let currentUser;
    let userData;

    currentUser = localStorage.currentUser

    if (currentUser !== undefined) {
        userData = JSON.parse(currentUser);
        if (userData.preference !== "paragraph" && userData.preference !== "sentence") {
            customTextInput.value = userData.preference;
        }
    }

    settingsModal.classList.remove("hide");
    screenFade.classList.remove("hide");
    loginModal.classList.add("hide");
    signupModal.classList.add("hide");
}, false)



settingsCancel = document.querySelectorAll(".settings-cancel");

settingsCancel.forEach((cancel) => {
    cancel.addEventListener("click", function(){
        settingsError.innerHTML = "";
        modalInput.forEach((input) => {
            input.value = ""
        })
        // customTextInput.value = "";
        settingsModal.classList.add("hide");
        screenFade.classList.add("hide");
    } , false)
})


// Help modal
const helpModal = document.querySelector(".help-modal");
const closeHelpModal = document.querySelector(".help-cancel");

helpIcon.addEventListener("click", function(){
    screenFade.classList.remove("hide");
    helpModal.classList.remove("hide");
}, false)

closeHelpModal.addEventListener("click", function(){
    screenFade.classList.add("hide");
    helpModal.classList.add("hide");
}, false)
console.log("hey")



/****************LOG IN************************/
const closeLoginModal = document.querySelector(".login-cancel");
closeLoginModal.addEventListener("click", function(){
    modalInput.forEach((input) => {
        input.value = ""
    })
    loginModal.classList.add("hide");
    screenFade.classList.add("hide");
} ,false)

const loginEmail = document.querySelector(".email-login");
const loginPassword = document.querySelector(".password-login");
const modalLoginBtn = document.querySelector(".modal-login-btn");

const loginEmailError = document.querySelector(".login-email-error");
const loginPasswordError = document.querySelector(".login-password-error");

function login() {

    modalLoginBtn.style.width = "110px";
    loaderLogin.classList.remove("hide");

    axios.post(
        'https://us-central1-typing-app-35c2f.cloudfunctions.net/api/login',
        {
            "email": loginEmail.value,
            "password": loginPassword.value
        }
        )
        .then(function (response) {
            modalInput.forEach((input) => {
                input.value = ""
            });

            modalLoginBtn.style.width = "";
            loaderLogin.classList.add("hide");

            let token = response.data.loginResponse.token;
            let userData = response.data.loginResponse.userData;
            // console.log(userData)

            console.log(userData.preference)
            console.log(customTextInput.value)
            if (userData.preference !== null && userData.preference !== "sentence" && userData.preference !== "paragraph") {
                console.log(generateInputText)
                generateInputText.classList.add("hide");
                // customTextInput.value = userData.preference;
                // originTextElement.innerHTML = userData.preference;
            }

            setAuthorizationHeader(token);
            setCurrentUser(userData);

            loginModal.classList.add("hide");
            navLoginBtn.classList.add("hide");
            navSignupBtn.classList.add("hide");
            navLogoutBtn.classList.remove("hide");
            screenFade.classList.add("hide");
            userIcon.classList.remove("hide");
            notificationIcon.classList.remove("hide");

            window.location.href = '/';

        })
        .catch(function (error) {
            modalLoginBtn.style.width = "";
            loaderLogin.classList.add("hide");

            console.log(error.response)
            // console.log(error.response.data)
            let responseError = error.response.data;

            if (responseError.email !== undefined) {
               loginEmailError.innerHTML = responseError.email;
            } else {
                loginEmailError.innerHTML = "";
            }

            if (responseError.password !== undefined) {
                loginPasswordError.innerHTML = responseError.password;
             } else {
                 loginPasswordError.innerHTML = "";
             }
           


        })
}

modalLoginBtn.addEventListener("click", login , false);





// SIGN UP

const closeSignupModal = document.querySelector(".signup-cancel");
closeSignupModal.addEventListener("click", function(){
    modalInput.forEach((input) => {
        input.value = ""
    })
    signupModal.classList.add("hide");
    screenFade.classList.add("hide");
} ,false)

const signupName = document.querySelector(".name-signup");
const signupEmail = document.querySelector(".email-signup");
const signupPassword = document.querySelector(".password-signup");
const signupConfirmPassword = document.querySelector(".confirm-password-signup");
const modalSignupBtn = document.querySelector(".modal-signup-btn");

const signupNameError = document.querySelector(".signup-name-error");
const signupEmailError = document.querySelector(".signup-email-error");
const signupPasswordError = document.querySelector(".signup-password-error");
const signupConfirmPasswordError = document.querySelector(".signup-confirm-password-error");

function signup() {
    modalSignupBtn.style.width = "110px";
    loaderSignup.classList.remove("hide");
    axios.post(
        'https://us-central1-typing-app-35c2f.cloudfunctions.net/api/signup',
        {
            "name": signupName.value,
            "email": signupEmail.value,
            "password": signupPassword.value,
            "confirmPassword": signupConfirmPassword.value
        }
        )
        .then(function (response) {
            modalInput.forEach((input) => {
                input.value = ""
            });
            modalSignupBtn.style.width = "";
            loaderSignup.classList.add("hide");

            console.log(response.data);
            let token = response.data.token;
            let userData = response.data.userCredentials;

            setAuthorizationHeader(token);
            setCurrentUser(userData);

            signupModal.classList.add("hide");
            navLoginBtn.classList.add("hide");
            navSignupBtn.classList.add("hide");
            navLogoutBtn.classList.remove("hide");
            screenFade.classList.add("hide");
            userIcon.classList.remove("hide");
            notificationIcon.classList.remove("hide");

            window.location.href = '/';

        })
        .catch(function (error) {
            modalSignupBtn.style.width = "";
            loaderSignup.classList.add("hide");

            console.log(error.response)
            let responseError = error.response.data;

            if (responseError.name !== undefined) {
                signupNameError.innerHTML = responseError.name;
             } else {
                 signupNameError.innerHTML = "";
             }

            if (responseError.email !== undefined) {
               signupEmailError.innerHTML = responseError.email;
            } else {
                signupEmailError.innerHTML = "";
            }

            if (responseError.password !== undefined) {
                signupPasswordError.innerHTML = responseError.password;
             } else {
                 signupPasswordError.innerHTML = "";
             }

             if (responseError.confirmPassword !== undefined) {
                signupConfirmPasswordError.innerHTML = responseError.confirmPassword;
             } else {
                 signupConfirmPasswordError.innerHTML = "";
             }
           


        })
}

modalSignupBtn.addEventListener("click", signup , false);


const nameInput = document.querySelectorAll(".name-input");
const emailInput = document.querySelectorAll(".email-input");
const passwordInput = document.querySelectorAll(".password-input");

const nameError = document.querySelectorAll(".name-error");
const emailError = document.querySelectorAll(".email-error");
const passwordError = document.querySelectorAll(".password-error");

const messageInput = document.querySelector(".message-input");
const sendMessageBtn = document.querySelector(".send-message-btn");
const messageError = document.querySelector(".message-error");


nameInput.forEach((input) => {
    input.addEventListener("keyup", function(){
        nameError.forEach((element) => {
            element.innerHTML = "";
            messageError.innerHTML = "";
        })
    } , false)
})

emailInput.forEach((input) => {
    input.addEventListener("keyup", function(){
        emailError.forEach((element) => {
            messageError.innerHTML = "";
            element.innerHTML = "";
        })
    } , false)
})

passwordInput.forEach((input) => {
    input.addEventListener("keyup", function(){
        passwordError.forEach((element) => {
            messageError.innerHTML = "";
            element.innerHTML = "";
        })
    } , false)
})





function logout () {
    console.log("I am here")
    navLogoutBtn.classList.add("hide");
    navLoginBtn.classList.remove("hide");
    navSignupBtn.classList.remove("hide");
    userIcon.classList.add("hide");

    localStorage.removeItem('currentUser');
    localStorage.removeItem('FBIdToken');
    delete axios.defaults.headers.common['Authorization'];
    window.location.href = '/';

}

navLogoutBtn.addEventListener("click", logout, false);




// Check token status

function checkTokenStatus() {
    let currentUser = localStorage.currentUser
    const TOKEN = localStorage.FBIdToken;

    if(TOKEN) {
        const decodedToken = jwt_decode(TOKEN);
        console.log(decodedToken.exp * 1000);
        console.log(Date.now())
        if(decodedToken.exp * 1000 < Date.now()){ //if TOKEN is expired
            logout();
        }
    } else if (!TOKEN) {
        localStorage.removeItem('currentUser');    
    }
    if (currentUser) {
        // CURRENT_USER.innerHTML = `Hello, ${currentUser}`

        navLoginBtn.classList.add("hide");
        navSignupBtn.classList.add("hide");
        navLogoutBtn.classList.remove("hide");
        userIcon.classList.remove("hide");
        notificationIcon.classList.remove("hide");
        
        let userData = JSON.parse(currentUser);
        console.log(userData);
        if (userData.preference !== null && userData.preference !== "sentence" && userData.preference !== "paragraph") {
            console.log(generateInputText)
            generateInputText.classList.add("hide");
        }
    }
};

checkTokenStatus();

document.addEventListener("mouseup", checkTokenStatus, false);

function getAllChats() {

    const TOKEN = localStorage.FBIdToken;
    config = {
        headers: { Authorization: `${TOKEN}` }
      };
    // getConfig();
    axios.post(
        'https://us-central1-typing-app-35c2f.cloudfunctions.net/api/getchats',
        {},
        config
        )
        .then(function (response) {
            let currentUser = JSON.parse(localStorage.currentUser)
            let loggedinUser = currentUser.name;

            const allChatsDiv = document.querySelector(".all-chats-div");
            console.log(allChatsDiv.innerHTML);
            allChatsDiv.innerHTML = "";

            let allChats = response.data.allChats;

            for (let i = 0; i < allChats.length; i++) {
                // console.log(allChats[i])
                let chat = allChats[i];


                const chatDiv = document.createElement("div");
                chatDiv.classList.add("chat-div");


                if (loggedinUser === chat.name) {
                    chatDiv.classList.add("owner");
                }

                const chatUser = document.createElement("p");
                chatUser.classList.add("chat-user");
                chatUser.innerHTML = chat.name;

                const chatMessage = document.createElement("p");
                chatMessage.classList.add("chat-message");
                chatMessage.innerHTML = chat.message;

                const chatTime = document.createElement("p");
                chatTime.classList.add("chat-time");
                chatTime.innerHTML = chat.createdAt;

                chatDiv.append(chatUser, chatMessage, chatTime);
                allChatsDiv.append(chatDiv);

                // chatColumnDiv.insertBefore(chatDiv, messageInputAndSendDiv)



            }


            

        })
        .catch(function (error) {
            console.log(error.response.data.error)
           
        })
    // setTimeout( getAllChats, 2000);
}

getAllChats();

// setTimeout( getAllChats, 2000);



function sendMessage() {
    getConfig();
    axios.post(
        'https://us-central1-typing-app-35c2f.cloudfunctions.net/api/postchat',
        {
            "message": messageInput.value
        },
        config
        )
        .then(function (response) {

            messageInput.value = "";
            console.log(messageInput)

            let currentUser = JSON.parse(localStorage.currentUser)
            let loggedinUser = currentUser.name;
            console.log(loggedinUser);

            let chat = response.data.chat
            console.log(chat);

            const allChatsDiv = document.querySelector(".all-chats-div");
            const firstChild = document.querySelector(".first-child")


            const chatDiv = document.createElement("div");
            chatDiv.classList.add("chat-div");

            if (loggedinUser === chat.name) {
                chatDiv.classList.add("owner");
            }

            const chatUser = document.createElement("p");
            chatUser.classList.add("chat-user");
            chatUser.innerHTML = chat.name;

            const chatMessage = document.createElement("p");
            chatMessage.classList.add("chat-message");
            chatMessage.innerHTML = chat.message;

            const chatTime = document.createElement("p");
            chatTime.classList.add("chat-time");
            chatTime.innerHTML = chat.createdAt;

            chatDiv.append(chatUser, chatMessage, chatTime);
            // allChatsDiv.append(chatDiv);
            allChatsDiv.insertBefore(chatDiv, allChatsDiv.firstChild);

        })
        .catch(function (error) {
            console.log(error);
            console.log(error.response)
            console.log(error.response.data.error)
            messageInput.value = "";
            let responseError = error.response.data;

            if (responseError.error !== undefined) {
                if (responseError.error === "Unauthorized") {
                    messageError.innerHTML = "Please login to use the message board"
                } else if (responseError.error === "Please enter a message") {
                    messageError.innerHTML = "Please enter a message"
                }
             } else {
                 messageError.innerHTML = "";
             }
           
        })
}


sendMessageBtn.addEventListener("click", sendMessage , false);

messageInput.addEventListener("keyup", function(){
    messageError.innerHTML = "";
} , false)