const playlist = [
    { 
        title: "Dora Chori Ka", 
        artist: "Guri Nimana ft. Kanika", 
        album: "DORA CHORI KA · 2023", 
        duration: "--:--", 
        coverText: "DC", 
        src: "music1.mp3" 
    },
    { 
        title: "Saiyara", 
        artist: "Faheem Abdullah", 
        album: "SAIYARA · 2023", 
        duration: "--:--", 
        coverText: "SY", 
        src: "music2.mp3" 
    },
    { 
        title: "Badlan Cho", 
        artist: "Simiran Kaur Dhadli & Gurlez Akhtar", 
        album: "BADLAN CHO · 2023", 
        duration: "--:--", 
        coverText: "BC", 
        src: "music3.mp3" 
    },
    { 
        title: "Baarishein", 
        artist: "Anuv Jain", 
        album: "BAARISHEIN · 2018", 
        duration: "--:--", 
        coverText: "BR", 
        src: "music4.mp3" 
    },
    { 
        title: "Haseen", 
        artist: "Talwiinder", 
        album: "HASEEN · 2023", 
        duration: "--:--", 
        coverText: "HN", 
        src: "music5.mp3" 
    }
];

let isPlaying = false;
let currentTrackIndex = 0;

const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const vinylDisc = document.getElementById('vinylDisc');

const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const songAlbum = document.getElementById('songAlbum');
const discText = document.querySelector('.inner-disc');

const timelineBar = document.getElementById('timelineBar');
const progressFill = document.getElementById('progressFill');
const progressHandle = document.getElementById('progressHandle');
const currentTimeDisplay = document.getElementById('currentTimeDisplay');
const totalTimeDisplay = document.getElementById('totalTimeDisplay');

const volumeBar = document.getElementById('volumeBar');
const volumeFill = document.getElementById('volumeFill');
const volumeHandle = document.getElementById('volumeHandle');
const volumeLevel = document.getElementById('volumeLevel');
const playlistContainer = document.getElementById('playlistContainer');

function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity || seconds <= 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function loadPlaylistDurations() {
    playlist.forEach((track, index) => {
        const tempAudio = new Audio();
        tempAudio.preload = "metadata";
        tempAudio.src = track.src;

        tempAudio.addEventListener('loadedmetadata', () => {
            const formattedDuration = formatTime(tempAudio.duration);
            track.duration = formattedDuration;

            const durationSpan = document.getElementById(`track-duration-${index}`);
            if (durationSpan) {
                durationSpan.textContent = formattedDuration;
            }

            if (index === currentTrackIndex) {
                totalTimeDisplay.textContent = formattedDuration;
            }
        });
    });
}

function renderPlaylist() {
    playlistContainer.innerHTML = '';
    playlist.forEach((track, i) => {
        const li = document.createElement('li');
        li.className = `track ${i === currentTrackIndex ? 'active' : ''}`;
        
        const noteSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`;
        const indexContent = i === currentTrackIndex ? noteSvg : (i + 1);

        li.innerHTML = `
            <span class="track-index">${indexContent}</span>
            <div class="track-meta">
                <h4>${track.title}</h4>
                <p>${track.artist}</p>
            </div>
            <span class="track-duration" id="track-duration-${i}">${track.duration}</span>
        `;

        li.addEventListener('click', () => {
            currentTrackIndex = i;
            loadTrack(currentTrackIndex);
            playAudio();
        });

        playlistContainer.appendChild(li);
    });
}

function loadTrack(index) {
    currentTrackIndex = index;
    const track = playlist[currentTrackIndex];

    audio.src = track.src;
    songTitle.textContent = track.title;
    songArtist.textContent = track.artist;
    songAlbum.textContent = track.album;
    discText.textContent = track.coverText;
    
    progressFill.style.width = '0%';
    progressHandle.style.left = '0%';
    currentTimeDisplay.textContent = "0:00";
    totalTimeDisplay.textContent = track.duration !== "--:--" ? track.duration : "0:00";

    renderPlaylist();
}

audio.addEventListener('loadedmetadata', () => {
    const formatted = formatTime(audio.duration);
    totalTimeDisplay.textContent = formatted;
    playlist[currentTrackIndex].duration = formatted;

    const currentItemDuration = document.getElementById(`track-duration-${currentTrackIndex}`);
    if (currentItemDuration) {
        currentItemDuration.textContent = formatted;
    }
});

function playAudio() {
    isPlaying = true;
    audio.play();
    playIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;
    vinylDisc.classList.add('spinning');
}

function pauseAudio() {
    isPlaying = false;
    audio.pause();
    playIcon.innerHTML = `<polygon points="7 4 20 12 7 20 7 4"></polygon>`;
    vinylDisc.classList.remove('spinning');
}

playBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseAudio();
    } else {
        playAudio();
    }
});

nextBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) playAudio();
});

prevBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) playAudio();
});

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const percentage = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${percentage}%`;
        progressHandle.style.left = `${percentage}%`;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
        totalTimeDisplay.textContent = formatTime(audio.duration);
    }
});

audio.addEventListener('ended', () => {
    nextBtn.click();
});

timelineBar.addEventListener('click', (e) => {
    const rect = timelineBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    if (audio.duration) {
        audio.currentTime = percentage * audio.duration;
    }
});

volumeBar.addEventListener('click', (e) => {
    const rect = volumeBar.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = clickX / rect.width;
    const volumeValue = Math.round(percentage * 100);

    audio.volume = percentage;
    volumeFill.style.width = `${volumeValue}%`;
    volumeHandle.style.left = `${volumeValue}%`;
    volumeLevel.textContent = volumeValue;
});

audio.volume = 0.7;
renderPlaylist();
loadTrack(0);
loadPlaylistDurations();