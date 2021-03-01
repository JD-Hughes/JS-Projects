var answers = [];
var scoreTotal = 0;

const searchOptions = {
    includeScore: true,
    threshold: 0.15
}

function revealAnswers(){
    for (let i = 0; i < answers.length; i++) {
        const inputField = document.querySelector(`#input-${i}`);
        if (!inputField.disabled){
            inputField.disabled = "true";
            inputField.style.color = "rgba(24, 221, 241, 1)";
            inputField.style.textAlign = "center";
            inputField.value = answers[i][0];
        }
    }
}

function checkAnswer(boxValue) {
    const inputField = document.querySelector(`#input-${boxValue}`);
    score = compareString(inputField.value, answers[boxValue]);
    var musicPlayer = document.getElementById(`audio-${boxValue}`);
    if (score < 0.1) {
        inputField.style.color = "rgb(0,240,0)";
        inputField.style.textAlign = "center";
        inputField.disabled = "true";
        inputField.value = answers[boxValue][0];
        musicPlayer.pause();
        scoreTotal ++;
        document.getElementById(`scoreTotal`).innerText = `Score: ${scoreTotal}/${answers.length}`
    } else if (score < 0.25) {
        inputField.style.color = "Orange";
    } else {
        inputField.style.color = "Red";
    }
}

function compareString(inputString, comparisonList) {
    var score = 1;
    const fuse = new Fuse(comparisonList, searchOptions);
    const fuseSearch = fuse.search(inputString)[0];
    if (fuseSearch) {
        const fuseScore = fuseSearch['score']
        const lengthScore = (Math.abs(inputString.length - fuseSearch['item'].length) / fuseSearch['item'].length);
        score = (fuseScore + lengthScore) / 2;
    }
    console.log(`Score: ${score}`);
    return score;
}

function adjustVolume() {
    const volumeSlider = document.getElementById("volumeSlider");
    for (let i = 0; i < answers.length; i++) {
        const audioElement = document.querySelector(`#audio-${i}`);
        audioElement.volume = volumeSlider.value/100;
    }
}

function fetchJSON() {
    var idCounter = 0
    fetch('sounds.json').then(r => r.text()).then(data => {
        const jsonFile = JSON.parse(data)['levels'];
        for (let j = 0; j < jsonFile.length; j++) {
            var newDiv = document.createElement("div");
            newDiv.id = jsonFile[j]['difficulty'];
            newDiv.className = "grid-container";
            var newTitle = document.createElement("h2");
            var titleText = document.createTextNode(jsonFile[j]['difficulty']);
            newTitle.appendChild(titleText);
            for (let i = 0; i < jsonFile[j]['contents'].length; i++) {
                var newQuestion = document.createElement("div")
                newQuestion.className = "container";
                newQuestion.innerHTML = `<div class="cont"><h3>${idCounter+1}</h3><input type="text" class="answer-box" id="input-${idCounter}" onchange="checkAnswer(${idCounter})" oninput="style.color = 'white'"></div><audio preload="none" id="audio-${idCounter}"><source src="bin/${jsonFile[j]['contents'][i]['src']}"></audio>`
                newDiv.appendChild(newQuestion);

                var titleAnswers = [];
                titleAnswers.push(jsonFile[j]['contents'][i]['title']);
                if (jsonFile[j]['contents'][i]['alt']) {
                    for (let k = 0; k < jsonFile[j]['contents'][i]['alt'].length; k++) {
                        titleAnswers.push(jsonFile[j]['contents'][i]['alt'][k]);
                    }
                }
                answers.push(titleAnswers);
                idCounter++;
            }
            document.getElementById("main").appendChild(newTitle);
            document.getElementById("main").appendChild(newDiv);
            audiojs.events.ready(function () {
                var as = audiojs.createAll();
            });
        }
        var revealButton = document.createElement("h1");
        revealButton.className = "radial";
        revealButton.innerText = "REVEAL ANSWERS";
        revealButton.setAttribute("onclick", "revealAnswers()");
        document.getElementById("main").appendChild(revealButton);
    });
}
fetchJSON();