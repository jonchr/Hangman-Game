

// VARIABLES
// ================================================================================

	//Array of alphabet letters to convert random number to letter
	var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

	//Array of the potential words to be guessed
	var wordBank = ["BIRD HIPPED", "BONES", "BRACHIOSAURUS", "CARNIVORE", "CLAWS", "COLOSSOL", "CRETACEOUS", "EGGS", "EXTINCT", "FEATHERS", "FOOTPRINT", "FOSSIL", "HEAVY", "HERBIVORE", "HORNS", "HUNTED", "JURASSIC", "LITTLE ARMS", "LIZARD HIPPED", "LONG NECK", "MESOZOIC", "NESTS", "PREDATOR", "PREHISTORIC", "PTERODACTYL", "REPTILE", "ROCKS", "SCARY", "SHARP", "SPIKES", "STEGOSAURUS", "TEETH", "TRIASSIC", "TRICERATOPS", "TYRANNOSAURUS", "VELOCIRAPTOR", "VOLCANO"];

	//Variable for the current word to be guessed
	var theWord;

	//Array used to record whether a letter from the word has been guessed
	//It starts out with length equal to the number of letters in the word, with values all of 1
	//As the user guesses the letters in the words, those letters are switched to 0
	//When the sum of spelling reaches 0, the user wins 
	var spelling = [];

	//Variables for the player's win and lose record since the page was loaded
	var wincounter = 0;
	var losscounter = 0;

	//Variable for the letter the player currently guessed
	var guessedLetter;

	//Array for holding letters the player has previously guessed
	var prevGuessedLetters = [];

	//Variable for the number of attempts a player has
	//Someone editing the number of attempts only needs to edit the number here below
	//Must be greater than 0;
	var maxAttempts = 9;

	//Variable for the number of incorrect attempts
	var wrongAttempts = 0;

	// Gets Link for Theme Song
	// Downloaded from https://www.youtube.com/watch?v=zuIVAV5VHIM
	// First 40 seconds cut off of song
  	var audioElement = document.createElement("audio");
  	audioElement.setAttribute("src", "./assets/JurassicParkTheme.mp3");

// FUNCTIONS
// ================================================================================

	//function for setting the page and functions up for a new game
	function newGame() {
		
		prevGuessedLetters = [];
		spelling = [];

		//Randomly picks a word from the bank to be guessed
		theWord = wordBank[Math.floor(Math.random() * wordBank.length)];
		
		//Splits the word into an array to track the correctly guessed letters
		for (var i = 0; i < theWord.length; i++) {
			spelling.push(1);	
		}

		//Logs the answer word (yes, you can cheat using console)
		console.log("The word is " + theWord);

		//Sets or updates the displayed win/loss record on the board
		updateWinLoss();

		//Resets the guess attempts for the new game
		wrongAttempts = 0;
		updateGuessesLeft(maxAttempts);
		
		//Clears the letters guessed for the new game
		updateLetters(" ");
	
	}

	function win() {

		console.log("Win!\n-----------");

		//Increases the number of wins recorded
		wincounter++;

		//Gives different messages based on how much you've won
		if (wincounter >= 5) {
			updateBoard("Wow! You're really good at this :) !");
		}
		else if (wincounter > 1) {
			updateBoard("You won again! Keep going?");
		}
		else {
			updateBoard("You won! Play again?");
		}

		newGame();
	}

	function lose() {

		console.log("Lose\n-----------")

		//Increases the number of losses recorded
		losscounter++;

		//Gives different messages based on how much you've won
		if (losscounter >= 5) {
			updateBoard("You better stop before you're extinct!");
		}
		else if (losscounter > 1) {
			updateBoard("You lost again! It was " + theWord + ". Keep at it?");
		}
		else {
			updateBoard("You lost :( But I already got a new word! " + "(For the record, it was " + theWord + ")");
		}

		newGame();
	}

	//Updates the message board; guessWasCorrect reflects if the guess was correct or not
	function update(guessWasCorrect) {

		updateGuessesLeft(maxAttempts - wrongAttempts);

		//If guess was correct, says so
		if (guessWasCorrect) {
			updateBoard("Nice job! " + guessedLetter + " is right!");
		}
		//If guess was incorrect and they have 1 attempt left, warns them
		else if (maxAttempts - wrongAttempts === 1) {
			updateBoard("You have one attempt left. Make the most of it!");
		}
		//Otherwise, just says their letter was incorrect
		else {
			updateBoard(guessedLetter + " is incorrect.");
		}

	}

	//Functions to update HTML text on the page
	function updateWinLoss () {
		document.getElementById("winloss").innerHTML = "Wins: " + wincounter + "\n" + "Losses: " + losscounter;
	}

	function updateGuessesLeft (numGuessLeft) {
		document.getElementById("numGuesses").innerHTML = "Guesses left: " + numGuessLeft;
	}

	function updateBoard (boardMessage) {
		document.getElementById("messages").innerHTML = boardMessage;
	}	

	//Color-Activates/deactivates the letters at the bottom of board
	function updateLetters (alpha) {
		//Reactivates all the letters when passed a space from newGame()
		if(alpha === " ") {
			for(var i = 0; i < alphabet.length; i++) {
				var allBoxes = document.querySelector(".letterBox" + alphabet[i]);
				allBoxes.style.color="black";
				allBoxes.style.borderColor="black";
				allBoxes.style.backgroundColor="white";
			}
			//change all letters to .letterBox
		}
		else {
			var offBox = document.querySelector(".letterBox" + alpha);
			offBox.style.color = "red";
			offBox.style.borderColor = "red";
			offBox.style.backgroundColor = "black";
		}
	}

	//Logical Functions

	function pressedALetter () {
		return alphabet.indexOf(guessedLetter) > -1;
	}

	function pressedANewLetter () {
		return prevGuessedLetters.indexOf(" " + guessedLetter) === -1;
	}


	//Function to update progress bar based on number of guesses
	function updateProgressBar() {

		//If there's only 1 attempt left, makes the bar red
		//If used half your attempts, makes the bar yellow
		if (maxAttempts - prevGuessedLetters.length === 1) {
			progressBar.style.backgroundColor = "red";
		}
		else if (prevGuessedLetters.length / maxAttempts > 0.5) {
			progressBar.style.backgroundColor = "orange";
		}
		//Updates the percent of the progress bar
		progressBar.style.width = (prevGuessedLetters.length / maxAttempts * 100) + "%";
	}

	//Creates the letter buttons at the bottom of the page
	function createLetters() {

		//Creates a button for each letter
		for(var i = 0; i < alphabet.length; i++) {
	      
	      //Creates a button equal to $("<div>");
	      var letterBoxes = $("<div>");

	      //Assigns the button classname "letterBox" plus its letter
	      letterBoxes.attr("class", "letterBox" + alphabet[i]);

	      //To figure out how to assign the clicks to each button

	      //Assigns each letterBox a data-attribute called "data-letter", with a value eqaual to "letters[i]"
	      letterBoxes.attr("data-letter", alphabet[i]);
	      
	      //Gives each letterBox a text equal to letters[i].
	      letterBoxes.text(alphabet[i]);

	      // Appends each letterBox to the #letters h4 in the well.
	      $("#letters").append(letterBoxes);

      	}
  	}

  	//Processes the letter in terms of progress in the game
  	function processLetter(alpha) {
  		for (var i = 0; i < spelling.length; i++) {
  			if(alpha === theWord[i]) {
  				spelling[i] = 0;
  				//Update line of letters[i];
  			}
  		}
  	}

  	//Returns the sum of all entries in an array
  	function sumArray(myArray) {
  		var sum = 0;
  		for (var i = 0; i < myArray.length; i++) {
  			sum += myArray[i];
  		}
  		return sum;
	}

// FUNCTION EXECUTION
// ================================================================================

	createLetters();
	newGame();

	//audioElement.play();

	document.onkeyup = function(event) {
		
		guessedLetter = event.key.toUpperCase();
	
		//Only activates if the key pressed is a letter
		if(pressedALetter()) {
			//Logs the guessed letter
			console.log("Guessed " + guessedLetter);

			//Only activates the function if the letter hasn't already been guessed      			
	      	if (pressedANewLetter()) {
				
				//Dims the letters available on the board
				updateLetters(guessedLetter);

				//Adds the guess to the registry of guessed letters
				prevGuessedLetters.push(" " + guessedLetter);

				//If the letter they guessed is in the word
				if (theWord.includes(guessedLetter)) {

					//Calls the method to reveal the correct guessed letters
					//Also updates the record of the remaining letters to be guessed
					processLetter(guessedLetter);		
					
					//If you've guessed the whole word, you win, otherwise, updates
					if(sumArray(spelling) <= 0) {
						win();
					}
					else {
						update(true);
					}
					
				}
				//If the guessed letter isn't in the word
				else {
					wrongAttempts++;
					//Lose if out of attempts
					if (wrongAttempts >= maxAttempts) {
						lose();
					}
					//Otherwise update and continue
					else {
						update(false);
					}
				}
			}
			else {
				//Adds snarky comment if letter was already guessed
				updateBoard("You already guessed " + guessedLetter + "!");
			}
		}
		else {
			//Adds snarky comment if button pressed isn't a letter
			updateBoard("Please press a letter...");
		}
	};