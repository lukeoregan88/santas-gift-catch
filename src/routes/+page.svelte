<script>
	import { onMount, onDestroy } from 'svelte';

	let gameArea;
	let santa;
	let score = 0;
	let timeLeft = 60;
	let gameRunning = false;
	let gameInterval;
	let santaPosition = 350; // Initial position

	function startGame() {
		if (gameRunning) return;
		gameRunning = true;
		score = 0;
		timeLeft = 60;
		santaPosition = gameArea.offsetWidth / 2 - 40; // Center Santa
		gameInterval = setInterval(gameLoop, 20);
	}

	function gameLoop() {
		if (Math.random() < 0.02) {
			// Adjust this value to change gift spawn rate
			createGift();
		}
		timeLeft -= 0.02;
		if (timeLeft <= 0) {
			endGame();
		}
	}

	function createGift() {
		const gift = document.createElement('div');
		gift.classList.add('gift');
		gift.style.left = `${Math.random() * (gameArea.offsetWidth - 40)}px`;
		gift.style.top = '-40px';

		// Randomly select a gift from the 2x4 sprite sheet
		const column = Math.floor(Math.random() * 4);
		const row = Math.floor(Math.random() * 2);
		gift.style.backgroundPosition = `${column * -40}px ${row * -40}px`;

		gameArea.appendChild(gift);

		// Calculate fall speed based on remaining time
		const baseSpeed = 2;
		const speedIncreaseFactor = 3;
		const fallSpeed = baseSpeed + (speedIncreaseFactor * (60 - timeLeft)) / 60;

		const fallInterval = setInterval(() => {
			const topPosition = parseInt(gift.style.top);
			if (topPosition > gameArea.offsetHeight) {
				clearInterval(fallInterval);
				gameArea.removeChild(gift);
			} else {
				gift.style.top = `${topPosition + fallSpeed}px`;
				checkCollision(gift);
			}
		}, 20);
	}

	function checkCollision(gift) {
		const santaRect = santa.getBoundingClientRect();
		const giftRect = gift.getBoundingClientRect();

		if (
			santaRect.left < giftRect.right &&
			santaRect.right > giftRect.left &&
			santaRect.top < giftRect.bottom &&
			santaRect.bottom > giftRect.top
		) {
			score++;
			gameArea.removeChild(gift);
		}
	}

	function handleKeydown(event) {
		if (!gameRunning) {
			if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
				startGame();
			}
			return;
		}
		const step = 20;
		if (event.key === 'ArrowLeft') {
			santaPosition = Math.max(0, santaPosition - step);
		} else if (event.key === 'ArrowRight') {
			santaPosition = Math.min(gameArea.offsetWidth - 80, santaPosition + step);
		}
	}

	function destroyGifts() {
		const gifts = document.querySelectorAll('.gift');
		gifts.forEach((gift) => {
			gift.remove();
		});
	}

	function endGame() {
		clearInterval(gameInterval);
		gameRunning = false;
		destroyGifts();
		alert(`Game Over! Your score: ${score}`);
	}

	onMount(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('keydown', handleKeydown);
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', handleKeydown);
		}
		if (gameInterval) clearInterval(gameInterval);
	});
</script>

<main>
	<div id="game-info">
		<h1>Santa's Catch Game</h1>
		<p>
			Use the left and right arrow keys to move Santa to catch the presents. <br />
			Press any arrow key to start the game. <br />
			Game will end when time is up.
		</p>
	</div>
	<div id="game-container">
		<div id="score">Score: {score}</div>
		<div id="time">Time: {Math.ceil(timeLeft)}</div>
		<div id="game-area" bind:this={gameArea}>
			<div id="santa" bind:this={santa} style="left: {santaPosition}px"></div>
		</div>
	</div>
	<div id="game-copy">
		<p>
			Made with &#10084; by <a href="https://x.com/lukeoregan88" target="_blank">Luke O'Regan</a>
			<br />
			<a href="https://dda.co.uk" target="_blank">Direct Design Studio</a> &copy; 2024
		</p>
	</div>
</main>

<style>
	main {
		font-family: Arial, sans-serif;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background-color: #f7f7f7;
		min-height: 700px;
	}

	#game-info {
		font-size: 20px;
		color: #0c0c0c;
		text-shadow: 2px 2px 4px #0000000b;
		text-align: center;
	}

	#game-container {
		position: relative;
		width: 800px;
		height: 600px;
		border-bottom: 1px solid #333;
		overflow: hidden;
	}

	#game-area {
		width: 100%;
		height: 100%;
		position: relative;
		background-image: url('/background.png');
		background-size: cover;
		background-color: #f7f7f7;
	}

	#santa {
		position: absolute;
		bottom: 1px;
		width: 80px;
		height: 80px;
		background-image: url('/sanata.svg');
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center bottom;
		filter: grayscale(100%);
	}

	:global(.gift) {
		position: absolute;
		width: 40px;
		height: 40px;
		background-image: url('/prez.png');
		background-size: 160px 80px; /* 4 columns x 40px, 2 rows x 40px */
		background-repeat: no-repeat;
	}

	#score,
	#time {
		position: absolute;
		top: 10px;
		font-size: 20px;
		color: #919191;
		text-shadow: 2px 2px 4px #0000000b;
		z-index: 10;
	}

	#score {
		left: 10px;
	}

	#time {
		right: 10px;
	}

	#game-copy {
		text-align: center;
	}

	#game-copy a {
		color: #0c0c0c;
	}
</style>
