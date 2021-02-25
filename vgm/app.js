const compareAgainst = ['Hotline Miami 2','Hotline Miami 2: Wrong Number'];

const searchOptions = {
    includeScore: true,
    threshold: 0.15
}



function checkAnswer(boxValue) {
    const inputField = document.querySelector(`#input-${boxValue}`);
    score = compareString(inputField.value, compareAgainst)
    if (score < 0.1){
        inputField.style.color = "rgb(0,240,0)";
        inputField.style.textAlign = "center";
        inputField.disabled = "true";
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
        const lengthScore = (Math.abs(inputString.length - fuseSearch['item'].length)/fuseSearch['item'].length);
        score = (fuseScore + lengthScore)/2;
    }
    console.log(`Score: ${score}`);
    return score;
}