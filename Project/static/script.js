const audioPlayer = document.getElementById('audio-player');
const shuffleButton = document.getElementById('shuffle-button');
const queueButton = document.getElementById('queue-button');
const nextButton = document.getElementById('next-button');
const prevButton = document.getElementById('prev-button');
const listOfSongs = document.getElementById('list-of-songs');
const currentSongElement = document.getElementById('current-song'); // Add this line

let shuffledSongs = [];
let currentSongIndex = 0;

shuffleButton.addEventListener('click', function () {
  fetchAndPlay('/shuffle');
});

queueButton.addEventListener('click', function () {
  fetchAndPlay('/queue');
});

nextButton.addEventListener('click', playNextSong);
prevButton.addEventListener('click', playPrevSong);

// Initially, load and play the first song
fetchAndPlay('/shuffle');

// Fetch and display the sorted list of songs
fetch('/song-list')
  .then(response => response.json())
  .then(data => {
    shuffledSongs = [...data.songs];
    displaySongList(shuffledSongs);
  })
  .catch(error => console.error('Error:', error));

function fetchAndPlay(endpoint) {
  fetch(endpoint)
    .then(response => response.json())
    .then(data => {
      const songPath = `audio/${data.song}`;
      audioPlayer.src = songPath;
      audioPlayer.play();
      updateCurrentSongIndex(data.song);

      // Update the displayed current song name
      const currentSongName = data.song.replace(/\.mp3$/, '');
      currentSongElement.textContent = `Now Playing: ${currentSongName}`;
    })
    .catch(error => console.error('Error:', error));
}

function displaySongList(songs) {
  if (listOfSongs) {
    listOfSongs.innerHTML = ''; // Clear the existing list
    const sortedSongs = songs.slice().sort(); // Create a sorted copy of the array

    sortedSongs.forEach(song => {
      const songName = song.replace(/\.mp3$/, '');
      const listItem = document.createElement('li');
      listItem.textContent = songName;
      listOfSongs.appendChild(listItem);
    });
  } else {
    console.error('Element "list-of-songs" not found.');
  }
}

function playNextSong() {
  currentSongIndex = (currentSongIndex + 1) % shuffledSongs.length;
  const nextSong = shuffledSongs[currentSongIndex];
  const songPath = `audio/${nextSong}`;
  audioPlayer.src = songPath;
  audioPlayer.play();

  // Update the displayed current song name
  const nextSongName = nextSong.replace(/\.mp3$/, '');
  currentSongElement.textContent = `Now Playing: ${nextSongName}`;
}

function playPrevSong() {
  currentSongIndex = (currentSongIndex - 1 + shuffledSongs.length) % shuffledSongs.length;
  const prevSong = shuffledSongs[currentSongIndex];
  const songPath = `audio/${prevSong}`;
  audioPlayer.src = songPath;
  audioPlayer.play();

  // Update the displayed current song name
  const prevSongName = prevSong.replace(/\.mp3$/, '');
  currentSongElement.textContent = `Now Playing: ${prevSongName}`;
}

function updateCurrentSongIndex(song) {
  currentSongIndex = shuffledSongs.indexOf(song);
}
