document.addEventListener("DOMContentLoaded", function () {
	const textArea = document.getElementById("text-area");
	const inputArea = document.querySelector(".input-area");
	const tryAgainButton = document.getElementById("try-again-button");
	const totalChars = [];
	let currentChar = 0;
	let startTime, endTime, totalTime;
	let mistakes = 0;

	function fetchSentences() {
		fetch("sentences.json")
			.then((response) => response.json())
			.then((data) => {
				initializeGame(data.sentences);
			})
			.catch((error) => {
				console.error("Error fetching sentences:", error);
			});
	}

	function initializeGame(sentences) {
		const randomIndex = Math.floor(Math.random() * sentences.length);
		const randomSentence = Array.from(sentences[randomIndex]);
		randomSentence.forEach((e) => {
			let ch = document.createElement("span");
			ch.textContent = e;
			textArea.appendChild(ch);
			totalChars.push(ch);
		});
		totalChars[0].classList.add("active");
	}

	function handleKeyDown(e) {
		if (e.key === "Backspace" && currentChar > 0) {
			currentChar--;
			totalChars[currentChar].classList = [];
		} else if (e.key.length === 1 && !startTime) {
			startTime = Date.now();
		}
	}

	function handleInput(e) {
		const typedChar = e.data;
		const expectedChar = totalChars[currentChar].textContent;

		if (typedChar) {
			if (typedChar === expectedChar) {
				totalChars[currentChar].classList.add("correct");
			} else {
				totalChars[currentChar].classList.add("wrong");
				mistakes++;
			}
			currentChar++;
		}

		updateCharClass();

		if (currentChar === totalChars.length) {
			endGame();
		}
	}

	function updateCharClass() {
		totalChars.forEach((char, index) => {
			char.classList.toggle("active", index === currentChar);
		});
	}

	function endGame() {
		endTime = Date.now();
		totalTime = (endTime - startTime) / 1000;
		const totalWords = totalChars.length / 5;
		const wpm = Math.round(totalWords / (totalTime / 60));
		const accuracy = ((totalChars.length - mistakes) / totalChars.length) * 100;
		const minutes = Math.floor(totalTime / 60);
		const seconds = Math.floor(totalTime % 60);

		document.getElementById("wpm").textContent = wpm;
		document.getElementById("time").textContent = `${minutes}:${
			seconds < 10 ? "0" : ""
		}${seconds}`;
		document.getElementById("accuracy").textContent = accuracy.toFixed(1);
		inputArea.remove();
	}

	function restartGame() {
		location.reload(); // Reload the page to start again
	}

	inputArea.addEventListener("keydown", handleKeyDown);
	inputArea.addEventListener("input", handleInput);
	tryAgainButton.addEventListener("click", restartGame);

	textArea.onclick = function () {
		inputArea.focus();
	};

	fetchSentences();
});
