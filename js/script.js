/* Adding in my info to the webpage */
const studentId = "200647328";       
const studentName = "Rocco Minetola"; 
 
document.addEventListener("DOMContentLoaded", () => {
  const studentInfoEl = document.getElementById("student-info");
  studentInfoEl.textContent = `Student ID: ${studentId} / Name: ${studentName}`;
});

/* Spotify Info */
/* For now i'm leaving these blank because I do not want to upload them to Github but will add them later on when I upload to a web server */
const CLIENT_ID = "Temp";
const CLIENT_SECRET = "Temp-Secret"
const DRAKE_ARTIST_ID = "3TVXtAsR1Inumwj472S9r4";

/* Getting Access Token */
async function getAccessToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
        },
        body: "grant_type=client_credentials"
    });

    if (!response.ok) {
        throw new Error(`Token request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
}

/* Fetching Artist Data */
async function getArtist(token) {
    const response = await fetch(`https://api.spotify.com/v1/artists/${DRAKE_ARTIST_ID}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error(`Artist request failed: ${response.status}`);
    return response.json();
}

/* Fetching Top Tracks */
async function getTopTracks(token) {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${DRAKE_ARTIST_ID}/top-tracks?market=US`,
    { headers: { "Authorization": `Bearer ${token}` } }
  );
  if (!response.ok) throw new Error(`Top tracks request failed: ${response.status}`);
  const data = await response.json();
  return data.tracks;
}

/* Fetch Albums */
async function getAlbums(token) {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${DRAKE_ARTIST_ID}/albums?include_groups=album&market=US&limit=12`,
    { headers: { "Authorization": `Bearer ${token}` } }
  );
  if (!response.ok) throw new Error(`Albums request failed: ${response.status}`);
  const data = await response.json();
  return data.items;
}

/* Render Functions */
function renderArtist(artist) {
  const section = document.getElementById("artist-section");
  const image = artist.images?.[0]?.url ?? "";
  const followers = artist.followers?.total?.toLocaleString() ?? "N/A";
  const genres = artist.genres?.length ? artist.genres : ["N/A"];
 
  section.innerHTML = `
    <img src="${image}" alt="${artist.name}" />
    <div class="artist-info">
      <h2>${artist.name}</h2>
      <div class="artist-stats">
        <span class="stat-pill">${followers} followers</span>
        <span class="stat-pill">Popularity: ${artist.popularity}/100</span>
      </div>
      <div class="genre-tags">
        ${genres.map(g => `<span class="genre-tag">${g}</span>`).join("")}
      </div>
      <a class="spotify-link-btn" href="${artist.external_urls.spotify}" target="_blank" rel="noopener noreferrer">
        Open on Spotify
      </a>
    </div>
  `;
}
 
function renderTopTracks(tracks) {
  const container = document.getElementById("top-tracks-container");
 
  container.innerHTML = tracks
    .slice(0, 10)
    .map((track, index) => {
      const albumArt = track.album?.images?.[2]?.url ?? track.album?.images?.[0]?.url ?? "";
      const minutes = Math.floor(track.duration_ms / 60000);
      const seconds = String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, "0");
 
      const audioPlayer = track.preview_url
        ? `<audio class="preview-audio" controls src="${track.preview_url}"></audio>`
        : `<span class="track-duration">${minutes}:${seconds}</span>`;
 
      return `
        <div class="track-row">
          <span class="track-rank">${index + 1}</span>
          <img src="${albumArt}" alt="${track.album.name}" />
          <div class="track-meta">
            <div class="track-name">${track.name}</div>
            <div class="track-album">${track.album.name}</div>
          </div>
          ${audioPlayer}
        </div>
      `;
    })
    .join("");
}
 
function renderAlbums(albums) {
  const container = document.getElementById("albums-container");
 
  container.innerHTML = albums
    .map(album => {
      const cover = album.images?.[0]?.url ?? "";
      const year = album.release_date?.split("-")[0] ?? "";
      return `
        <a class="album-card" href="${album.external_urls.spotify}" target="_blank" rel="noopener noreferrer">
          <img src="${cover}" alt="${album.name}" />
          <div class="album-card-info">
            <div class="album-name">${album.name}</div>
            <div class="album-year">${year}</div>
          </div>
        </a>
      `;
    })
    .join("");
}
 
function renderError(sectionId, message) {
  document.getElementById(sectionId).innerHTML =
    `<p class="error-msg">⚠️ ${message}</p>`;
}
 
/* Main */
async function init() {
  try {
    const token = await getAccessToken();
 
    // Run all three data calls in parallel for speed
    const [artist, tracks, albums] = await Promise.all([
      getArtist(token),
      getTopTracks(token),
      getAlbums(token)
    ]);
 
    renderArtist(artist);
    renderTopTracks(tracks);
    renderAlbums(albums);
 
  } catch (err) {
    console.error(err);
    renderError("artist-section", "Couldn't load artist data. Check your Client ID/Secret in js/script.js.");
    renderError("top-tracks-container", "Couldn't load top tracks.");
    renderError("albums-container", "Couldn't load albums.");
  }
}
 
document.addEventListener("DOMContentLoaded", init);

