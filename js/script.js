/* Adding in my info to the webpage */
const studentId = "200647328";       
const studentName = "Rocco Minetola"; 
 
document.addEventListener("DOMContentLoaded", () => {
  const studentInfoEl = document.getElementById("student-info");
  if (studentInfoEl) {
    studentInfoEl.textContent = `Student ID: ${studentId} / Name: ${studentName}`;
  }
});

/* iTunes Search API with JSONP helper */
function fetchJSONP(url) {
  return new Promise((resolve, reject) => {
    const callbackName = "itunes_cb_" + Math.random().toString(36).substr(2, 9);
    const script = document.createElement("script");

    const delimiter = url.includes("?") ? "&" : "?";
    script.src = `${url}${delimiter}callback=${callbackName}`;

    window[callbackName] = (data) => {
      delete window[callbackName];
      document.body.removeChild(script);
      resolve(data);
    };

    script.onerror = () => {
      delete window[callbackName];
      if (script.parentNode) document.body.removeChild(script);
      reject(new Error("JSONP Request Failed"));
    };

    document.body.appendChild(script);
  });
}

const ARTIST_NAME = "Drake";
const ITUNES_BASE_URL = "https://itunes.apple.com";

/* Fetching Artist Data */
async function getArtist() {
  const data = await fetchJSONP(`${ITUNES_BASE_URL}/search?term=${encodeURIComponent(ARTIST_NAME)}&entity=musicArtist&limit=1`);
  if (!data.results || data.results.length === 0) throw new Error("Artist not found");
  return data.results[0];
}

/* Fetching Top Tracks */
async function getTopTracks(artistId) {
  const data = await fetchJSONP(`${ITUNES_BASE_URL}/lookup?id=${artistId}&entity=song&limit=11`);
  return (data.results || []).filter(item => item.wrapperType === "track");
}

/* Fetch Albums */
async function getAlbums(artistId) {
  const data = await fetchJSONP(`${ITUNES_BASE_URL}/lookup?id=${artistId}&entity=album&limit=13`);
  return (data.results || []).filter(item => item.wrapperType === "collection");
}

/* Helper to up the res of images */
function getHighResImage(url) {
  if (!url) return "";
  return url.replace("100x100bb.jpg", "600x600bb.jpg");
}

/* Render Functions */
function renderArtist(artist) {
  const section = document.getElementById("artist-section");
  if (!section) return;

  const genre = artist.primaryGenreName || "Hip-Hop/Rap";
  const artistUrl = artist.artistLinkUrl || "#";

  section.innerHTML = `
    <img src="https://upload.wikimedia.org/wikipedia/commons/2/28/Drake_July_2016.jpg" alt="${artist.artistName}" />
    <div class="artist-info">
      2>${artist.artistName}</h2>
      <div class="artist-stats">
        <span class="stat-pill">Apple Music Verified</span>
        <span class="stat-pill">Genre: ${genre}</span>
      </div>
      <div class="genre-tags">
        <span class="genre-tag">${genre}</span>
        <span class="genre-tag">Rap</span>
        <span class="genre-tag">Pop</span>
      </div>
      <a class="spotify-link-btn" href="${artistUrl}" target="_blank" rel="noopener noreferrer">
        Open on Apple Music
      </a>
    </div>
  `;
}
 
function renderTopTracks(tracks) {
  const container = document.getElementById("top-tracks-container");
  if (!container) return;

  container.innerHTML = tracks
    .slice(0, 10)
    .map((track, index) => {
      const albumArt = getHighResImage(track.artworkUrl100);
      
      const durationMs = track.trackTimeMillis || 180000;
      const minutes = Math.floor(durationMs / 60000);
      const seconds = String(Math.floor((durationMs % 60000) / 1000)).padStart(2, "0");

      const audioPlayer = track.previewUrl
        ? `<audio class="preview-audio" controls src="${track.previewUrl}"></audio>`
        : `<span class="track-duration">${minutes}:${seconds}</span>`;

      return `
        <div class="track-row">
          <span class="track-rank">${index + 1}</span>
          <img src="${albumArt}" alt="${track.collectionName || 'Album'}" />
          <div class="track-meta">
            <div class="track-name">${track.trackName}</div>
            <div class="track-album">${track.collectionName || ''}</div>
          </div>
          ${audioPlayer}
        </div>
      `;
    })
    .join("");
}
 
function renderAlbums(albums) {
  const container = document.getElementById("albums-container");
  if (!container) return;

  container.innerHTML = albums
    .slice(0, 12)
    .map(album => {
      const cover = getHighResImage(album.artworkUrl100);
      const year = album.releaseDate ? album.releaseDate.split("-")[0] : "";
      const albumUrl = album.collectionViewUrl || "#";

      return `
        <a class="album-card" href="${albumUrl}" target="_blank" rel="noopener noreferrer">
          <img src="${cover}" alt="${album.collectionName}" />
          <div class="album-card-info">
            <div class="album-name">${album.collectionName}</div>
            <div class="album-year">${year}</div>
          </div>
        </a>
      `;
    })
    .join("");
}
 
function renderError(sectionId, message) {
  const el = document.getElementById(sectionId);
  if (el) el.innerHTML = `<p class="error-msg">⚠️ ${message}</p>`;
}
 
/* Main */
async function init() {
  try {
    const artist = await getArtist();
    
    const [tracks, albums] = await Promise.all([
      getTopTracks(artist.artistId),
      getAlbums(artist.artistId)
    ]);
 
    renderArtist(artist);
    renderTopTracks(tracks);
    renderAlbums(albums);
 
  } catch (err) {
    console.error("Init Error:", err);
    renderError("artist-section", "Couldn't load artist data.");
    renderError("top-tracks-container", "Couldn't load top tracks.");
    renderError("albums-container", "Couldn't load albums.");
  }
}

document.addEventListener("DOMContentLoaded", init);