const originText = document.querySelector(".origin-text p").innerHTML;
const inputText = document.querySelector(".input-text");
const inputTextDiv = document.querySelector(".input-text-div");
const timer = document.querySelector(".timer");
const resetTimer = document.querySelector(".reset");
const backspace = document.querySelector(".backspace");

let counter = [0,0,0,0]
let interval;
let timerRunning = false;


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
}


function disableKeyboard() {
    document.onkeydown = function (event) {
        if (event.keyCode !== 8) {
            return false;
        }
    }
    
}


function enableKeyboard() {
    document.onkeydown = function (e) {
        return true;
    }
}



function spellCheck() {
    let textEntered = inputText.value;
    console.log(textEntered)
    console.log(originText.substring(0, textEntered.length))

    let originTextMatch = originText.substring(0, textEntered.length);

    if (textEntered == originText) {
        clearInterval(interval);
        inputText.style.border = "2px solid green";
    } else {
        if (textEntered == originTextMatch) {
            inputText.style.border = "2px solid blue";
            if(event.keyCode) {
                event.returnValue = true;
                console.log(event.keyCode)
            }
            enableKeyboard();
        } else {
            disableKeyboard();
            inputText.style.border = "2px solid red";
        }
    }

}

function startTimer() {
    let textEnterdLength = inputText.value.length;
    if (textEnterdLength === 0 && !timerRunning) {
        timerRunning = true;
        interval = setInterval(runTimer, 10);
    }
    console.log(textEnterdLength);
}

function reset() {
    clearInterval(interval);
    interval = null;
    counter = [0,0,0,0];
    timerRunning = false;

    inputText.value = "";
    timer.innerHTML = "00:00:00";
    inputTextDiv.style.borderColor = "grey";
}



inputText.addEventListener("keypress", startTimer, false);
inputText.addEventListener("keyup", spellCheck, false);
resetTimer.addEventListener("click", reset, false);