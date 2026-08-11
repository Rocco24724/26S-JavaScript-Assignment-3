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