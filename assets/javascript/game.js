
/////////////
// VARIABLES
// ================================================================================

	//Array of alphabet letters to convert random number to letter
	var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

	//Array of the potential words to be guessed
	var wordBank = ["BIRD HIPPED", "BONES", "BRACHIOSAURUS", "CARNIVORE", "CLAWS", "COLOSSOL", "CRETACEOUS", "EGGS", "EXTINCT", "FEATHERS", "FOOTPRINT", "FOSSIL", "HEAVY", "HERBIVORE", "HORNS", "HUNTED", "JURASSIC", "LITTLE ARMS", "LIZARD HIPPED", "LONG NECK", "MESOZOIC", "NESTS", "PALEONTOLOGY", "PREDATOR", "PREHISTORIC", "PTERODACTYL", "REPTILE", "ROCKS", "SCARY", "SHARP", "SPIKES", "STEGOSAURUS", "TEETH", "TRIASSIC", "TRICERATOPS", "TYRANNOSAURUS", "VELOCIRAPTOR", "VOLCANO"];

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

	//Array for holding letters the player has previously guessed
	var prevGuessedLetters = [];

	//Variable for the number of attempts a player has
	//Someone editing the number of attempts only needs to edit the number here below
	//Must be greater than 0;
	var maxAttempts = 9;

	//Variable for the number of incorrect attempts
	var wrongAttempts = 0;

	//Variable for if music is playing
	var musicPlaying = true;

	// Gets Link for Theme Song
	// Downloaded from https://www.youtube.com/watch?v=zuIVAV5VHIM
	// First 40 seconds cut off of song
  	var audioElement = document.createElement("audio");
  	audioElement.setAttribute("src", "./assets/JurassicParkTheme.mp3");

/////////////
// FUNCTIONS
// ================================================================================

	//Creates the letter buttons at the bottom of the page
	function createLetters() {

		//Creates a button for each letter
		for(var i = 0; i < alphabet.length; i++) {
	      
	      //Creates a button equal to $("<div>");
	      var letterBoxes = $("<div>");

	      //Assigns the button classname "letterBox" plus its letter
	      letterBoxes.attr("class", "letterBox " + alphabet[i]);

	      //Assigns each letterBox a data-attribute called "data-letter", with a value eqaual to "letters[i]"
	      letterBoxes.attr("data-letter", alphabet[i]);
	      
	      //Gives each letterBox a text equal to letters[i].
	      letterBoxes.text(alphabet[i]);

	      // Appends each letterBox to the #letters h4 in the well.
	      $("#letters").append(letterBoxes);

	      // Assigns each button a function where it activates their letter when clicked
	      $("." + alphabet[i]).on("click", function() {
	      	controlCenter($(this).attr("data-letter"));
	      });
      	}
  	}

	//function for setting the page and functions up for a new game
	function newGame() {
		
		prevGuessedLetters = [];
		spelling = [];

		//Randomly picks a word from the bank to be guessed
		theWord = wordBank[Math.floor(Math.random() * wordBank.length)];
		
		//Splits the word into an array to track the correctly guessed letters
		for (var i = 0; i < theWord.length; i++) {
			//If there is a space, places 0 so the user doesn't need to guess it
			if(theWord[i] === " ") {
				spelling.push(0);
			}
			//Otherwise places 1 for all letters
			else {
				spelling.push(1);
			}
		}

		//Logs the answer word (yes, you can cheat using console)
		console.log("The word is " + theWord);

		//Resets the guess attempts for the new game
		wrongAttempts = 0;
		
		//Clears the letters guessed for the new game
		updateLetters(" ");

		//creates the new lines for the new word
		createLines();
	}

	//Function that creates lines for the word	
	function createLines() {

		console.log("Creating lines!");

		//Removes all previous lines from the lettersAndLines <div> box
		$("#lettersAndLines").empty();

		//Loops through theWord and creates a new HTML lettersAndLines element for each letter
		for(var i = 0; i < theWord.length; i++) {
			
			var letterLine = $("<div>");

			//Assigns the CSS class lettersAndLines to it so it's underlined
			letterLine.attr("class", "underlines");

			//Assigns a number attribute to the line equal to it's position in the word
			letterLine.attr("position", i);

			//If a space, gets rid of the underline
			if (theWord[i] === " ") {
				console.log("Hiding space: " + (theWord[i] === " "));
				letterLine.css("border-bottom-style", "hidden");
			}

			//Appends the line to the section lettersAndLines
			$("#lettersAndLines").append(letterLine);
		}
	}


  	// Starts/stops music on button press. Also inverse button colors
	$("#musicButton").on("click", function() {
		//Flips musicPlaying boolean
		musicPlaying = !musicPlaying;

		//Starts or pauses music as appropriate
		if(musicPlaying) {
			audioElement.play();
			$(this).css('color', 'black');
			$(this).css('backgroundColor', 'yellow');
			$(this).css('borderColor', 'red');
		}
		else {
			audioElement.pause();
			$(this).css('color', 'yellow');
			$(this).css('backgroundColor', 'black');
			$(this).css('borderColor', 'red');
		}
	});

	//Function that controls directs the game after a letter is guessed
	//Is activated either by key press or button press
	function controlCenter(alpha) {

		//Only activates if the key pressed is a letter		
		if(pressedALetter(alpha)) {

			//Logs the guessed letter
			console.log("Guessed " + alpha);

			//Only activates the function if the letter hasn't already been guessed      			
	      	if (pressedANewLetter(alpha)) {

				//Adds the guess to the registry of guessed letters
				prevGuessedLetters.push(" " + alpha);

				//If the letter they guessed is in the word
				if (theWord.includes(alpha)) {

					//Calls the method to reveal the correct guessed letters
					//Also updates the record of the remaining letters to be guessed
					processLetter(alpha);		
					
					//If you've guessed the whole word, you win, otherwise, updates
					if(sumArray(spelling) <= 0) {
						win();
					}
					else {
						update(true, alpha);
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
						update(false, alpha);
					}
				}
			}
			else {
				//Adds snarky comment if letter was already guessed
				updateBoard("You already guessed " + alpha + "!");
			}
		}
		else {
			//Adds snarky comment if button pressed isn't a letter
			updateBoard("Please press a letter...");
		}

	}

	// Processes a player's win
	function win() {

		console.log("Win!\n-----------");

		//Increases the number of wins recorded
		wincounter++;

		//Sets or updates the displayed win/loss record on the board
		updateWinLoss();

		//Gives different messages based on how much you've won
		if (wincounter >= 5) {
			updateBoard("This is becoming a walk in the park for you. You're quite the paleontologist!");
		}
		else if (wincounter > 1) {
			updateBoard("You've made it there and back again! How was it?");
		}
		else {
			updateBoard("You've managed to escape! If you're up for the thrill, why not go back once more?");
		}
		
		//Pauses for 5 seconds, then starts a new game
		setTimeout(function() {

			//Calls a new game
			newGame();
		}, 3000);
	}

	// Processes a player's loss
	function lose() {

		console.log("Lose\n-----------")

		//Increases the number of losses recorded
		losscounter++;

		//Sets or updates the displayed win/loss record on the board
		updateWinLoss();

		//Gives different messages based on how much you've won
		if (losscounter >= 5) {
			updateBoard("What's that shadow in the sky?...this might be it for you.");
		}
		else if (losscounter > 1) {
			updateBoard("Quick, shout + " + theWord + "! It could win you enough time to keep trying.");
		}
		else {
			updateBoard("The word was " + theWord + " but the portal's gone! Can you make it to the next one?");
		}
		//Calls a new game
		newGame();
	}

	//Updates the message board based on whether the guess was right or wrong
	//guessWasCorrect variable reflects if the guess was correct or not
	function update(guessWasCorrect, alpha) {

		//Dims the letters available on the board
		updateLetters(alpha);

		//If guess was correct, says so
		if (guessWasCorrect) {
			updateBoard("Nice job! " + alpha + " is right!");
		}
		//If guess was incorrect and they have 1 attempt left, warns them
		else if (maxAttempts - wrongAttempts === 1) {
			updateBoard("They're getting closer! This is your last shot!");
		}
		//Otherwise, just says their letter was incorrect
		else {
			updateBoard(alpha + " is incorrect.");
		}
	}

	//Processes the letter in terms of progress in the game
  	function processLetter(alpha) {
  		for (var i = 0; i < spelling.length; i++) {
  			if(alpha === theWord[i]) {
  				spelling[i] = 0;
  				$(".underlines").filter("[position=" + i + "]").text(alpha);
  			}
  		}
  	}

	//Color-Activates/deactivates the letters at the bottom of board
	function updateLetters (alpha) {
		//Reactivates all the letters when passed a space from newGame()
		if(alpha === " ") {
			for(var i = 0; i < alphabet.length; i++) {
				var allBoxes = document.querySelector("." + alphabet[i]);
				allBoxes.style.color="black";
				allBoxes.style.borderColor="black";
				allBoxes.style.backgroundColor="white";
			}
		}
		else {
			var offBox = document.querySelector("." + alpha);
			offBox.style.color = "red";
			offBox.style.borderColor = "red";
			offBox.style.backgroundColor = "black";
		}
	}

	///////////////////////////////////////////////
	// Functions to update HTML text on the page //
	///////////////////////////////////////////////

	function updateWinLoss () {
		document.getElementById("winloss").innerHTML = "Wins: " + wincounter + "\n" + "Losses: " + losscounter;
	}

	function updateBoard (boardMessage) {
		document.getElementById("messages").innerHTML = boardMessage;
	}	

	////////////////////////////
	// Math/Logical Functions //
	////////////////////////////

	//Returns 
	function pressedALetter (alpha) {
		return alphabet.indexOf(alpha) > -1;
	}

	function pressedANewLetter (alpha) {
		return prevGuessedLetters.indexOf(" " + alpha) === -1;
	}

  	//Returns the sum of all entries in an array
  	function sumArray(myArray) {
  		var sum = 0;
  		for (var i = 0; i < myArray.length; i++) {
  			sum += myArray[i];
  		}
  		return sum;
	}

//////////////////////
// FUNCTION EXECUTION
// ================================================================================
	
	createLetters();
	newGame();

	audioElement.play();
	document.onkeyup = function(event) {
		
		controlCenter(event.key.toUpperCase());
		
	};
