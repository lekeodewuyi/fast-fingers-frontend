import "../css/reset.css";
import "../css/main.css";

import jwt_decode from 'jwt-decode';
import axios from 'axios';
import DOMPurify from 'dompurify';




let body = document.querySelector("body");

const pageLoaderDiv = document.querySelector(".page-loader-div");

window.addEventListener("load", function() {
    pageLoaderDiv.classList.add("hide");
})

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
const showMobileModal = document.querySelector("#dont-show-modal");

(function() {   
    let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
    if (isMobile) {
        document.querySelector(".input-text").style.height = "11em";
        document.querySelector(".origin-text-div").style.height = "";

        let showPrompt = localStorage.getItem("dontShowMobileModal");

        console.log(showPrompt);
        if(showPrompt === "true") {
            mobileModal.classList.add("hide");
            screenFade.classList.add("hide");
        } else {
            mobileModal.classList.remove("hide");
            screenFade.classList.remove("hide");
        }
    }
 }());

closeMobileModal.addEventListener("click", function(){
    if (showMobileModal.checked) {
        localStorage.setItem("dontShowMobileModal", "true")
    } else {
        localStorage.setItem("dontShowMobileModal", "false")
    }
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
            sessionOverModal.classList.remove("hide");
            screenFade.classList.remove("hide");
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
                originTextElement.innerText = userData.preference;
            }


            console.log(response.data.userData)

            window.location.href = '/';

        })
        .catch(function (error) {
            if(error.response.data.error == "Unauthorized") {
                settingsError.innerText = "Please login to use this feature";
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
            originTextElement.innerText = response.data.result;
            console.log(originTextElement);
            originText = originTextElement.innerText

            // window.location.href = '/';

        })
        .catch(function (error) {
            console.log(error.response)
        })
}
generateText();

// const originText = document.querySelector(".origin-text p").innerText;
let inputText = document.querySelector(".input-text");
const inputTextDiv = document.querySelector(".input-text-div");
const persistentInput = document.querySelector(".persistent-placeholder");
const timer = document.querySelector(".timer");
const resetTimer = document.querySelector(".reset");
const backspace = document.querySelector(".backspace");

const generateInputText = document.querySelector(".generate-new-input");

generateInputText.addEventListener("click", generateText, false)

const inputTextError = document.querySelector(".input-text-error");

persistentInput.innerText = originText;




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
    if (originTextElement.innerText === "Please don't copy and paste. Use the reset button to start over.") {
        return;
    }


    let currentTime = leadingZero(counter[0]) + ":" + leadingZero(counter[1]) + ":" + leadingZero(counter[2]);
    timer.innerText = currentTime;
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
let wordCount;
let characterCount;
function countWords(str) {
    matches = str.match(/[\w\d\’\'-]+/gi);
    wordCount = matches.length;
    return matches ? matches.length : 0;
  }


function spellCheck() {

    if (originTextElement.innerText === "Please don't copy and paste. Use the reset button to start over.") {
        return;
    }


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
        // generateText();
    } else {
        if (textEntered == originTextMatch) {
            console.log(counter[0], counter[1], counter[2])
            inputText.classList.remove("caret-red");
            inputText.style.border = "2px solid var(--blue)";
            inputText.style.border = "2px solid var(--light-green)";
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
        document.querySelector(".pause-timer").innerText = "Pause"
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
        document.querySelector(".pause-timer").innerText = "Continue"
        clearInterval(interval);
        timerRunning = false;
        console.log(timerRunning)
    // } else if (!timerRunning && textEnterdLength !== 0 && textEntered !== originText) {
    } else if (!timerRunning) {
        inputText.addEventListener("keypress", function(){
            if(timerRunning) {
                clearInterval(interval);
                timerRunning = false;
                document.querySelector(".pause-timer").innerText = "Pause"
            }
            timerRunning = true
            interval = setInterval(runTimer, 10);
        }, false);
        document.querySelector(".pause-timer").innerText = "Pause"
        timerRunning = true
        interval = setInterval(runTimer, 10);
        console.log(timerRunning)
    }
}

document.querySelector(".pause-timer").addEventListener("click", function(){
    pauseTimer();
} ,false)

function reset() {
    inputText = document.querySelector(".input-text");

    backspaceCount = 0;
    extraCharacterCount = 0;
    clearInterval(interval);
    interval = null;
    counter = [0,0,0,0];
    timerRunning = false;

    document.querySelector(".pause-timer").classList.add("hide");
    document.querySelector(".pause-timer").innerText = "Start"

    inputText.value = "";
    inputText.classList.remove("caret-red");
    inputTextError.classList.add("hide");

    timer.innerText = "00:00:00";
    inputTextDiv.style.borderColor = "grey";

    inputText.style.backgroundColor = "white";
    inputText.style.border = "2px solid var(--pale-blue)";
}

resetTimer.addEventListener("click", function(){
    if (originTextElement.innerText === "Please don't copy and paste. Use the reset button to start over." || originTextElement.innerText === "Your stats are a little unrealistic, please use the reset button to start over") {
        generateText();
    }
}, false)



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
    const sessionScore = document.querySelector(".session-score");

    let possibleHeaders = [
        "Sensational!",
        "Good work!",
        "Well done!",
        "Way to go!",
        "Good Job!",
        "Bravo!",
        "Nice!!!"
    ]

    resultHeader.innerText = possibleHeaders[Math.floor(Math.random() * possibleHeaders.length)] + " Here is how you performed";



    characterCount = originText.length
    console.log("characterCount", characterCount)
    countWords(originText);
    console.log("wordCount", wordCount);
    console.log("backspaceCount", backspaceCount);
    console.log("extraCharacterCount", extraCharacterCount)
    console.log(counter)

    let timeElapsed = (counter[0] + counter[1]/60 + counter[2]/6000).toFixed(2);
    let userChars = (characterCount + backspaceCount + extraCharacterCount);

    let wpmCheck = Number(Math.floor(wordCount/timeElapsed));

    if (wpmCheck > 160) {
        originTextElement.innerText = "Your stats are a little unrealistic, please use the reset button to start over"
        return;
    }
    timeElapsedElement.innerText = timeElapsed + " mins";
    sampleCharsElement.innerText = characterCount;
    userCharsElement.innerText = userChars;
    cpmElement.innerText = Math.floor(characterCount/timeElapsed);
    sampleWordsElement.innerText= wordCount;
    wpmElement.innerText = Math.floor(wordCount/timeElapsed);
    errorRateElement.innerText = (100 - (((userChars - characterCount)/characterCount) * 100)).toFixed(2) + "%";

    charsInSampleText.forEach((element) => {
        element.innerHTML = DOMPurify.sanitize(`<span class="res-number">${characterCount}</span> characters in sample text`);
    })
    incorrectlyTypedChars.innerHTML = DOMPurify.sanitize(`<span class="res-number">${extraCharacterCount}</span> incorrectly typed characters`);
    backspaces.innerHTML = DOMPurify.sanitize(`<span class="res-number red">${backspaceCount}</span> backspaces`);
    timeElapsedCalc.forEach((element) => {
        element.innerHTML = DOMPurify.sanitize(`<span class="res-number">${timeElapsed}</span> minutes`);
    })
    wordsInSampleText.innerHTML = DOMPurify.sanitize(`<span class="res-number">${wordCount}</span> words in sample text`)
    errorCalcUpper.innerHTML = DOMPurify.sanitize(`<span class="res-number">${userChars}</span> characters types - <span class="res-number">${characterCount}</span> characters in sample text`);

    resultModal.classList.remove("hide");
    screenFade.classList.remove("hide");


    let score;
    let counts = {};
    let ch, index, count;
    let repeatedChars = 0;
    let easyChars = 0;
    let upperCaseChars = (originText.match(/[A-Z]/g) || []).length;
    for (let i = 0; i < originText.length; ++i) {
        ch = originText.charAt(i);
        if (originText.charAt(i) === originText.charAt(i + 1)) {
            repeatedChars++
        }
        if (ch === " " || ch === "n"  || ch === "o" || ch === "p" || ch === "v" || ch === "a" || ch === "r" || ch === "i" || ch === "w" || ch === "g" || ch === "y" || ch === "|" || ch === "k" || ch === "u" || ch === "r" || ch === ";" || ch === "s" || ch === "d" || ch === "f" || ch === "l" || ch === "k" || ch === "j" || ch === "h") {
            easyChars++
        }
        count = counts[ch];
        counts[ch] = count ? count + 1 : 1;
    }

    let uniqueChars = Object.keys([...originText].reduce((res, char) => (res[char] = (res[char] || 0) + 1, res), {})).length
    let accuracy = Number((100 - (((userChars - characterCount)/characterCount) * 100)).toFixed(2));
    let cpm = Number(cpmElement.innerText);
    let wpm = Number(wpmElement.innerText);


    score = Number(1000 + (uniqueChars * 20) + (upperCaseChars * 10) + (characterCount * 10) + (accuracy * 10) + (cpm * 10) - (repeatedChars * 20) - ((backspaceCount + extraCharacterCount) * 20) - (easyChars * 10))

    console.log(uniqueChars, upperCaseChars, characterCount, accuracy, cpm, repeatedChars, backspaceCount, easyChars)
    score = Math.floor(score);
    console.log("score", score);

    sessionScore.innerHTML = DOMPurify.sanitize(`SESSION SCORE: <span class="color-blue">${appendCommas(score)} POINTS</span>`)
    generateText();
    updateUserStats(score, cpm, wpm, accuracy)
}

closeResultModal.forEach((element) => {
    element.addEventListener("click", function(){
        resultModal.classList.add("hide");
        screenFade.classList.add("hide");
    }, false)
})

originTextElement.oncopy = function(){
    inputText = inputText.cloneNode(true);
    originTextElement.innerText = "Please don't copy and paste. Use the reset button to start over."
    return false;
}

inputText.onpaste = function(){
    inputText = inputText.cloneNode(true);
    originTextElement.innerText = "Please don't copy and paste. Use the reset button to start over."
    return false;
}

originTextElement.oncut = function(){
    inputText = inputText.cloneNode(true);
    originTextElement.innerText = "Please don't copy and paste. Use the reset button to start over."
    return false;
}

inputText.addEventListener("keypress", startTimer, false);
inputText.addEventListener("keyup", spellCheck, false);
resetTimer.addEventListener("click", reset, false);


const setAuthorizationHeader = (token) => {
    const FBIdToken = `Bearer ${token}`;
    localStorage.setItem('FBIdToken', FBIdToken);
    axios.defaults.headers.common['Authorization'] = FBIdToken;
}

const userModal = document.querySelector(".user-profile-modal");
const closeUserModal = document.querySelector(".user-profile-cancel");
const userName = document.querySelector(".user-name");
const userTopStats = document.querySelector(".user-stats");

const userTopSpeed = document.querySelector(".user-top-speed");
const userAveSpeed = document.querySelector(".user-ave-speed");

const userTopAccuracy = document.querySelector(".user-top-accuracy");
const userAveAccuracy = document.querySelector(".user-ave-accuracy");

const userTopScore = document.querySelector(".user-top-score");
const userAveScore = document.querySelector(".user-ave-score");
const userCumScore = document.querySelector(".user-cum-score");

const userSummary = document.querySelector(".user-summary");


userIcon.addEventListener("click", function(){
    userModal.classList.toggle("hide");
    document.querySelector(".user-up-arrow").classList.toggle("hide");
    document.querySelector(".user-down-arrow").classList.toggle("hide");
}, true);

closeUserModal.addEventListener("click", function(){
    userModal.classList.add("hide");
    document.querySelector(".user-up-arrow").classList.toggle("hide");
    document.querySelector(".user-down-arrow").classList.toggle("hide");
}, false)

// function appendCommas(x) {
//     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
// }

function appendCommas(x) {
    return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
}

const setCurrentUser = (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));

    userName.innerHTML = DOMPurify.sanitize(`Hey, <span class="color-blue name">${user.name}</span>`)
    userIcon.classList.add("color-blue");

    if(user.stats) {
        userSummary.classList.remove("hide");
        userTopStats.innerHTML = DOMPurify.sanitize(`<span class="bold">YOUR STATS: </span>`);
        userTopSpeed.innerHTML = DOMPurify.sanitize(`Top speed: <span class="bold"> ${user.cpm}  cpm</span>, <span class="bold"> ${user.wpm} wpm</span>`);
        userAveSpeed.innerHTML = DOMPurify.sanitize(`Average speed: <span class="bold"> ${user.aveCpm}  cpm</span>, <span class="bold"> ${user.aveWpm} wpm</span>`);
        userTopAccuracy.innerHTML = DOMPurify.sanitize(`Top accuracy: <span class="bold"> ${user.accuracy}%</span>`);
        userAveAccuracy.innerHTML = DOMPurify.sanitize(`Average accuracy:<span class="bold"> ${user.aveAccuracy}%</span>`);
        userTopScore.innerHTML = DOMPurify.sanitize(`Top score: <span class="bold"> <span class="bold">${appendCommas(user.topScore)}</span> points </span>`);
        userAveScore.innerHTML = DOMPurify.sanitize(`Average score: <span class="bold"> <span class="bold">${appendCommas(user.aveScore)}</span> points </span>`);
        userCumScore.innerHTML = DOMPurify.sanitize(`Cummulative score: <span class="bold"> <span class="bold">${appendCommas(user.score)}</span> points </span>`)
    }
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



const settingsCancel = document.querySelectorAll(".settings-cancel");

settingsCancel.forEach((cancel) => {
    cancel.addEventListener("click", function(){
        settingsError.innerText = "";
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
                // originTextElement.innerText = userData.preference;
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
               loginEmailError.innerText = responseError.email;
            } else {
                loginEmailError.innerText = "";
            }

            if (responseError.password !== undefined) {
                loginPasswordError.innerText = responseError.password;
             } else {
                 loginPasswordError.innerText = "";
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
                signupNameError.innerText = responseError.name;
             } else {
                 signupNameError.innerText = "";
             }

            if (responseError.email !== undefined) {
               signupEmailError.innerText = responseError.email;
            } else {
                signupEmailError.innerText = "";
            }

            if (responseError.password !== undefined) {
                signupPasswordError.innerText = responseError.password;
             } else {
                 signupPasswordError.innerText = "";
             }

             if (responseError.confirmPassword !== undefined) {
                signupConfirmPasswordError.innerText = responseError.confirmPassword;
             } else {
                 signupConfirmPasswordError.innerText = "";
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
            element.innerText = "";
            messageError.innerText = "";
        })
    } , false)
})

emailInput.forEach((input) => {
    input.addEventListener("keyup", function(){
        emailError.forEach((element) => {
            messageError.innerText = "";
            element.innerText = "";
        })
    } , false)
})

passwordInput.forEach((input) => {
    input.addEventListener("keyup", function(){
        passwordError.forEach((element) => {
            messageError.innerText = "";
            element.innerText = "";
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

const sessionOverModal = document.querySelector(".session-over-modal");
const closeSessionOverModal = document.querySelector(".session-over-cancel");

closeSessionOverModal.addEventListener("click", function(){
    sessionOverModal.classList.add("hide");
    screenFade.classList.add("hide");
    logout();
}, false)

document.addEventListener("click", checkTokenStatus, false)

function checkTokenStatus() {
    let currentUser = localStorage.currentUser
    const TOKEN = localStorage.FBIdToken;

    if(TOKEN) {
        console.log("heyyyy")
        const decodedToken = jwt_decode(TOKEN);
        console.log(decodedToken.exp * 1000);
        console.log(Date.now())
        if(decodedToken.exp * 1000 < Date.now()){ //if TOKEN is expired
            sessionOverModal.classList.remove("hide");
            screenFade.classList.remove("hide");
        }
    } else if (!TOKEN) {
        console.log("hi")
        localStorage.removeItem('currentUser');    
    }
    if (currentUser) {
        // CURRENT_USER.innerHTML = DOMPurify.sanitize(`Hello, ${currentUser}`)

        userModal.appendChild(navLogoutBtn);
        navLoginBtn.classList.add("hide");
        navSignupBtn.classList.add("hide");
        navLogoutBtn.classList.remove("hide");
        userIcon.classList.remove("hide");
        notificationIcon.classList.remove("hide");
        
        let user = JSON.parse(currentUser);

        userName.innerHTML = DOMPurify.sanitize(`Hey, <span class="color-blue name">${user.name}</span>`);
        userIcon.classList.add("color-blue");

        console.log(user);
        if (user.preference !== null && user.preference !== "sentence" && user.preference !== "paragraph") {
            console.log(generateInputText)
            generateInputText.classList.add("hide");
        }

        if(user.stats) {
            userSummary.classList.remove("hide");
            userTopStats.innerHTML = DOMPurify.sanitize(`<span class="bold">YOUR STATS: </span>`);
            userTopSpeed.innerHTML = DOMPurify.sanitize(`Top speed: <span class="bold"> ${user.cpm}  cpm</span>, <span class="bold"> ${user.wpm} wpm</span>`);
            userAveSpeed.innerHTML = DOMPurify.sanitize(`Average speed: <span class="bold"> ${user.aveCpm}  cpm</span>, <span class="bold"> ${user.aveWpm} wpm</span>`);
            userTopAccuracy.innerHTML = DOMPurify.sanitize(`Top accuracy: <span class="bold"> ${user.accuracy}%</span>`);
            userAveAccuracy.innerHTML = DOMPurify.sanitize(`Average accuracy:<span class="bold"> ${user.aveAccuracy}%</span>`);
            userTopScore.innerHTML = DOMPurify.sanitize(`Top score: <span class="bold"> <span class="bold">${appendCommas(user.topScore)}</span> points </span>`);
            userAveScore.innerHTML = DOMPurify.sanitize(`Average score: <span class="bold"> <span class="bold">${appendCommas(user.aveScore)}</span> points </span>`);
            userCumScore.innerHTML = DOMPurify.sanitize(`Cummulative score: <span class="bold"> <span class="bold">${appendCommas(user.score)}</span> points </span>`);
        }
    }
};

checkTokenStatus();

function updateUserStats(score, cpm, wpm, accuracy){
    getConfig();
    axios.post(
        'https://us-central1-typing-app-35c2f.cloudfunctions.net/api/stats/user/update',
        {
            "score": score,
            "cpm": cpm,
            "wpm": wpm,
            "accuracy": accuracy
        },
        config
        )
        .then(function (response) {
            console.log(response.data)
            setCurrentUser(response.data.userDetails);

        })
        .catch(function (error) {
            console.log(error);
            console.log(error.response)
        })
}

function getLeaderBoard(){
    axios.post(
        'https://us-central1-typing-app-35c2f.cloudfunctions.net/api/leaderboard/retrieve'
        )
        .then(function (response) {
            console.log(response.data);
            appendLeaderBoard(response.data.leaderboard)


        })
        .catch(function (error) {
            console.log(error);
            console.log(error.response)
        })
}

const tableBody = document.querySelector(".leaderboard-table tbody");
console.log("hey")
console.log(tableBody)

function appendLeaderBoard(results){
    let user = localStorage.currentUser;
    let identifier = "";
    if(user) {
        user = JSON.parse(user);
        identifier = user.identifier;
    }
    tableBody.innerHTML = DOMPurify.sanitize("");
    for (let i = 0; i < results.length; i++) {
        let tRow = document.createElement("tr");
        if (identifier === results[i].identifier) {
            console.log("yaaaaay")
            console.log(identifier)
            tRow.style.backgroundColor = paleBlue;
        }

        let tPosition = document.createElement("td");
        tPosition.classList.add("leaderboard-position-col");
        tPosition.innerText = i + 1;

        let tUser = document.createElement("td");
        tUser.classList.add("leaderboard-user-col");
        tUser.innerHTML = DOMPurify.sanitize(results[i].name);

        let tScore = document.createElement("td");
        tScore.classList.add("leaderboard-user-col");
        tScore.innerText = appendCommas(results[i].score) + " pts";

        let tStats = document.createElement("td");
        tStats.classList.add("leaderboard-stats-col");
        tStats.innerHTML = DOMPurify.sanitize(`${results[i].wpm} wpm<span class="leaderboard-extra"><span class="leaderboard-cpm">, ${results[i].cpm} cpm</span> / ${results[i].accuracy}%</span>`);

        tRow.append(tPosition, tUser, tScore, tStats)
        tableBody.appendChild(tRow);
    }
}



const leaderboardBtn = document.querySelector(".leaderboard-btn");
const leaderboardModal = document.querySelector(".leaderboard-modal");
const leaderboardClose = document.querySelector(".leaderboard-cancel");

leaderboardBtn.addEventListener("click", function(){
    leaderboardModal.classList.remove("hide");
    getLeaderBoard();
}, false)

leaderboardClose.addEventListener("click", function(){
    leaderboardModal.classList.add("hide");
}, false);




// element.dispatchEvent(new KeyboardEvent('keypress',{'key':'a'}));