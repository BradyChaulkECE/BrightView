/// gets every grade container
const GradesEarned = [];
const GradesTotal = [];
const rows = document.querySelectorAll("tr");
for (let i = 1; i < rows.length; i++) { 
    /// excludes grouping headers
    if (rows[i].classList.contains("d_ggl1")){
        continue;
    }
    else {
        /// gets the text grades "21 / 53"

        values = rows[i].getElementsByClassName("d_gn d_gr d_gt");
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
console.log(FinalGrade);