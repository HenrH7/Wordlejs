

var isAlpha = function(ch){
  if (ch >= "a" && ch <= "z"){
      return true;
  }
}


async function checkWord(word) {
  let isAWord = false;
  const result = await isRealWord(word);
  isAWord = result;
  console.log(isAWord)

  if (word.length == 5 && isAWord) {
    return true;
  } else {
    return false;
  }
}

function getRandomWord() {
  return new Promise((resolve, reject) => {
    fetch('https://random-word-api.herokuapp.com/word?number=1&length=5')
  .then(response => response.json())
  .then(data => {
      resolve(data[0]);
    })
  .catch(error => reject(error));
  });
}

function isRealWord(word) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.datamuse.com/words?sp=${word}`)
  .then(response => response.json())
  .then(data => {
    if (data[0].word == word) {
      resolve(true);
    } else {
      resolve(false);
    }
   })
  .catch(error => reject(error));
  });

}




function updateCurrentWord(guessNum) {
  var word = '';
  for (let i = 0; i < 5; i++) {
    var letter = document.getElementById('guess'.concat(guessNum, i)).value;
    word = word.concat(letter);
  }
  return word;
}

function updateRow(guessNum,currentWord) {
  var currentRow = document.getElementById(String(guessNum)).querySelectorAll("input");

  if (currentWord == answer){
    alert("You win!!");
    currentRow.forEach((input, index) => {
      input.disabled = true;
      input.style = "background-color: rgb(0, 150, 0);";
    });
    return false;
  }

  if (guessNum !== 5){
    var nextRow = document.getElementById(String(guessNum+1)).querySelectorAll("input");

    nextRow.forEach((input, index) => {
      input.disabled = false;
      input.style = "background-color: rgb(94, 92, 92);"
      if (index == 0) {
        input.focus();
      }
    });
  }
 
  var letters = answer.split("");

  currentRow.forEach((input, index) => {
    input.disabled = true;
    if (input.value == answer[index]) {
      input.style = "background-color: rgb(0, 150, 0);";
      delete letters[index];
    } else {
      input.style = "background-color: rgb(50, 50, 50);";
    }
  });
  currentRow.forEach((input, index) => {
    if (answer.includes(input.value) && letters.includes(input.value)) {
      input.style = "background-color: rgb(192, 189, 10);";
      const ansIndex = letters.indexOf(input.value);
      delete letters[ansIndex];
      console.log(input.value.concat(" changed to yellow ", letters));
    } 
  });
  
  return true;
}


var game = true;
var answer;
var currentWord = '';
var guessNum = 0;
const letterBox = document.createElement("input");
const rows = document.getElementsByClassName("row");

//answer maker
getRandomWord().then(randomWord => {
  answer = randomWord;
  console.log(answer);
}).catch(error => console.error('Error:', error));

//create input boxes
for (let i = 0; i < rows.length; i++) {
  for (let box = 0; box < 5; box++) {
    let input = rows[i].appendChild(letterBox.cloneNode(true));
    input.setAttribute("MaxLength", "1");
    input.setAttribute("id", "guess".concat(i,box));
  
    if (i > 0) {
      input.setAttribute("disabled", "true");
      input.style = "background-color: rgb(50,50,50);"
    }
  }
}

const inputs = document.querySelectorAll('input');

//add in input events and type control
inputs.forEach((input, index) => {
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Backspace') {
      if (input.value == "") {
        inputs[index - 1].focus();
      }
    } else if (isAlpha(event.key)) {
      if (input.value !== "") {
        inputs[index + 1].focus();
      }
    } else {
      event.preventDefault();
    }
  });
});

//enter pressed
document.addEventListener('keydown', async (event) => {
  if (event.key === 'Enter' && game) {
    currentWord = updateCurrentWord(guessNum);
    if (await checkWord(currentWord)) {
      game = updateRow(guessNum, currentWord);
      guessNum++;
    }
    if (guessNum == 6) {
      game = false;
      alert("You lose! The correct word was ".concat(answer))
    }
  }
});


