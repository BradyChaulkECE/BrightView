/// gets every grade container
shouldAbort = false;
let cachedGrade = null;
let cachedtitle = null;
let cachedWeight = null;
///gets the title
const uncleantitle = document.getElementsByClassName("d2l-navigation-s-title-container")[0].textContent;
cleantitle = uncleantitle.split(" ")[0];
const GradesEarned = [];
const GradesTotal = [];
console.log("1");
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
            console.log("2");

            if (!Number.isFinite(Earned) || !Number.isFinite(Total) || Total == 0) {
                continue;
            }
            /// attatch to an array for further steps past current forloop
            GradesEarned.push(Earned);
            GradesTotal.push(Total);
        }

    }
}
console.log("4");
///creates a sum of earned and total grades
FinalGradeEarned = 0;
FinalGradeTotal = 0;
for (let k = 0; k < GradesEarned.length; k++) {
    FinalGradeEarned += GradesEarned[k];
    FinalGradeTotal += GradesTotal[k];
    console.log(FinalGradeTotal);
}

if (FinalGradeEarned === 0 && FinalGradeTotal === 0) {
    shouldAbort = true;
    console.log("aborted");;
}
///Gets average weighted
FinalGrade = 0;
FinalGrade = ((FinalGradeEarned / FinalGradeTotal)*100);
cachedtitle = cleantitle;
cachedGrade = FinalGrade;
cachedWeight = FinalGradeTotal;

if (!Number.isFinite(FinalGradeTotal)) {
  shouldAbort = true;
}

///pushes values and formates of course and title to be visualized later
if (!shouldAbort && typeof chrome !== "undefined" && chrome.storage?.local) {
    chrome.storage.local.get(["courses"], (results) => {
        const courses = results.courses || {};
        courses[cachedtitle] = {
            grade: cachedGrade,
            weight: cachedWeight,
            target: 55,
            savedAt: Date.now()
    };

    chrome.storage.local.set({ courses });
    });

    ///sends message to popup.js
    chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {

        if (msg.type === "GetCourseData") {

            sendResponse({ title: cachedtitle,
                            grade: cachedGrade,
                            weight: cachedWeight,
                            target: 55});

        }
    });
}
