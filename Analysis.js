/// gets every grade container
let cachedGrade = null;
let cachedtitle = null;
///gets the title
const uncleantitle = document.getElementsByClassName("d2l-navigation-s-title-container")[0].textContent;
cleantitle = uncleantitle.split(" ")[0];
const GradesEarned = [];
const GradesTotal = [];

///grade calculator\/\/
const rows = document.querySelectorAll("tr");
for (let i = 1; i < rows.length; i++) { 
    /// excludes grouping headers
    if (rows[i].classList.contains("d_ggl1")){
        continue;
    }
    else {
        /// gets the text grades "21 / 53"

        const values = rows[i].getElementsByClassName("d_gn d_gr d_gt");
        for (let j = 1; ((3*j)-2) < values.length; j++) {
            /// makes text grades usable
 
            const textgrades = values[(3*j)-2].textContent;
            if (textgrades.includes("Dropped!") || textgrades.includes("Dropped")){
                continue;
            }
            const [EarnedString, TotalsString] = textgrades.split(" / ");
            const Earned = parseFloat(EarnedString);
            const Total = parseFloat(TotalsString);
            ///Filters empty + 0/0 cells

            if (!Number.isFinite(Earned) || !Number.isFinite(Total) || Total == 0) {
                continue;
            }
            /// attatch to an array for further steps past current forloop
            GradesEarned.push(Earned);
            GradesTotal.push(Total);
        }
    }
}
///creates a sum of earned and total grades
FinalGradeEarned = 0;
FinalGradeTotal = 0;
for (let k = 0; k < GradesEarned.length; k++) {
    FinalGradeEarned += GradesEarned[k];
    FinalGradeTotal += GradesTotal[k];
}
///Gets average weighted
FinalGrade = 0;
FinalGrade = ((FinalGradeEarned / FinalGradeTotal)*100);
cachedtitle = cleantitle;
cachedGrade = FinalGrade;
///pushes values and formates of course and title to be visualized later
chrome.storage.local.get(["courses"], (results) => {
  const courses = results.courses || {};

  courses[cachedtitle] = {
  grade: cachedGrade,
  savedAt: Date.now()
  };

  chrome.storage.local.set({ courses });
});

///sends message to popup.js
chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  if (msg.type === "GetCourseData") {
    sendResponse({ title: cachedtitle,
                   grade: cachedGrade});
  }
});