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
