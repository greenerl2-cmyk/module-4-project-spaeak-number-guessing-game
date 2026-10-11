const msgEl = document.getElementById('msg');

// Generate a random number between 1 and 100
function getRandomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

const randomNum = getRandomNumber();
console.log('Number:', randomNum);

// Convert speech-recognition words into numbers
const wordToNumber = {
  one: 1,
  won: 1,
  two: 2,
  to: 2,
  too: 2,
  three: 3,
  four: 4,
  for: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  ate: 8,
  nine: 9,
  ten: 10
};

// Set up speech recognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  msgEl.textContent =
    'Speech recognition is not supported in this browser. Try Chrome.';
} else {
  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = false;

  // Start listening
  recognition.start();

  // Process what the player says
  function onSpeak(event) {
    const msg = event.results[event.results.length - 1][0]
      .transcript.trim().toLowerCase();

    console.log('You said:', msg);

    writeMessage(msg);
    checkNumber(msg);
  }

  recognition.addEventListener('result', onSpeak);

  // Restart listening if recognition stops before the game ends
  recognition.addEventListener('end', () => {
    if (!document.getElementById('play-again')) {
      try {
        recognition.start();
      } catch (error) {
        console.log('Recognition could not restart:', error);
      }
    }
  });
}

// Display what the player said
function writeMessage(msg) {
  msgEl.replaceChildren();

  const div = document.createElement('div');
  div.textContent = 'You said: ';

  const span = document.createElement('span');
  span.classList.add('box');
  span.textContent = msg;

  msgEl.append(div, span);
}

// Check whether the spoken guess is valid
function checkNumber(msg) {
  const normalizedMsg = msg.trim().toLowerCase();

  // Convert recognized number words into numbers
  const adjustedMsg = Object.prototype.hasOwnProperty.call(
    wordToNumber,
    normalizedMsg
  )
    ? wordToNumber[normalizedMsg]
    : normalizedMsg;

  const num = Number(adjustedMsg);

  if (normalizedMsg === '' || !Number.isFinite(num)) {
    showFeedback('That is not a valid number');
    return;
  }

  if (!Number.isInteger(num)) {
    showFeedback('Please say a whole number');
    return;
  }

  if (num < 1 || num > 100) {
    showFeedback('Number must be between 1 and 100');
    return;
  }

  if (num === randomNum) {
    const h2 = document.createElement('h2');
    h2.textContent =
      `Congrats! You have guessed the number! It was ${num}`;

    const button = document.createElement('button');
    button.classList.add('play-again');
    button.id = 'play-again';
    button.textContent = 'Play Again';

    button.addEventListener('click', () => {
      window.location.reload();
    });

    msgEl.append(h2, button);

  } else if (num > randomNum) {
    showFeedback('GO LOWER');
  } else {
    showFeedback('GO HIGHER');
  }
}

// Display feedback without inserting untrusted HTML
function showFeedback(message) {
  const div = document.createElement('div');
  div.textContent = message;
  msgEl.append(div);
}