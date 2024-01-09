//! console.log("Let's write some javaScript");
let currentSong = new Audio();
let songs;
let currFolder;
function secondsToMinutesSeconds(seconds) {
	if (isNaN(seconds) || seconds < 0) {
		return "00:00";
	}

	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);

	const formattedMinutes = String(minutes).padStart(2, "0");
	const formattedSeconds = String(remainingSeconds).padStart(2, "0");

	return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
	let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
	currFolder = folder;
	let response = await a.text();
	let div = document.createElement("div");
	div.innerHTML = response;
	let as = div.getElementsByTagName("a"); // Access td tags within the div

	let songs = [];

	for (let index = 0; index < as.length; index++) {
		const element = as[index];
		if (element.href.endsWith(".mp3")) {
			songs.push(element.href.split(`/${folder}/`)[1]);
		}
	}

	return songs;
}

const playMusic = (track, pause = false) => {
	currentSong.src = `/${currFolder}/${track}`;
	if (!pause) {
		currentSong.play();
		play.src = "img/pause.svg";
	}
	document.querySelector(".songinfo").innerHTML = track;
	document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {
	//! get the list of all songs
	songs = await getSongs("songs/ncs");
	playMusic(songs[0], true);

	//! Show all the songs in the playlist
	let songUL = document
		.querySelector(".songList")
		.getElementsByTagName("ul")[0];
	songUL.innerHTML = "";
	for (const song of songs) {
		songUL.innerHTML =
			songUL.innerHTML +
			`<li><img class="invert" width="34" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Ananya Samanta</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div> </li>`;
	}

	//! Attach an event listener to each song
	Array.from(
		document.querySelector(".songList").getElementsByTagName("li")
	).forEach((e) => {
		// console.log(e);
		e.addEventListener("click", (element) => {
			// console.log(e.querySelector(".info").firstElementChild.innerHTML);
			playMusic(`${e.querySelector(".info").firstElementChild.innerHTML}`);
		});
	});

	//! Attach an Event Listener to play, next and Previous
	play.addEventListener("click", () => {
		if (currentSong.paused) {
			play.src = "img/pause.svg";
			currentSong.play();
		} else {
			play.src = "img/play.svg";
			currentSong.pause();
		}
	});

	//! Listen for time update event
	currentSong.addEventListener("timeupdate", () => {
		// console.log(currentSong.currentTime, currentSong.duration);
		document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
			currentSong.currentTime
		)}/${secondsToMinutesSeconds(currentSong.duration)}`;

		document.querySelector(".circle").style.left = `${
			(currentSong.currentTime / currentSong.duration) * 100
		}%`;
	});

	//! Add an event listener to seekbar
	document.querySelector(".seekbar").addEventListener("click", (e) => {
		let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
		document.querySelector(".circle").style.left = `${percent}%`;
		currentSong.currentTime = (currentSong.duration * percent) / 100;
	});

	//! Add an event listener for hamburger
	document.querySelector(".hamburger").addEventListener("click", () => {
		document.querySelector(".left").style.left = "0";
	});
	//! Add an event listener for close
	document.querySelector(".close").addEventListener("click", () => {
		document.querySelector(".left").style.left = "-100%";
	});

	//! Add an event listener to previous
	previous.addEventListener("click", () => {
		currentSong.pause();
		// console.log("Previous clicked");
		let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
		if (index - 1 >= 0) {
			playMusic(songs[index - 1]);
		}
	});

	//! Add an event listener to next
	next.addEventListener("click", () => {
		currentSong.pause();
		// console.log("Next clicked");

		let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
		if (index + 1 < songs.length) {
			playMusic(songs[index + 1]);
		}
	});

	//! Add an event listener to Volume
	document
		.querySelector(".range")
		.getElementsByTagName("input")[0]
		.addEventListener("change", (e) => {
			// console.log(e);
			currentSong.volume = parseInt(e.target.value) / 100;
		});
}

main();
