/* Adding in my info to the webpage */
const studentId = "200647328";       
const studentName = "Rocco Minetola"; 
 
document.addEventListener("DOMContentLoaded", () => {
  const studentInfoEl = document.getElementById("student-info");
  studentInfoEl.textContent = `Student ID: ${studentId} / Name: ${studentName}`;
});
