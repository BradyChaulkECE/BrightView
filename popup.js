document.addEventListener("DOMContentLoaded", () => {
    const ListOfCourses = document.getElementById("courses")

    ///auto pushes and creates sections to show new courses and grades in html
    function RenderCourses( courses ) {
        ListOfCourses.innerHTML = "";
        Object.entries(courses)
            .sort((a,b) => b[1].savedAt - a[1].savedAt)
            .forEach(([title, data]) => {
                const row = document.createElement("div");
                row.className = "course-row"
                row.innerHTML = `<div class="course-title">${title}</div>
                                <div class="course-grade">${data.grade.toFixed(2)}%</div>`;
                ListOfCourses.appendChild(row);
        });
    }
    ///loads saved courses if not in mun
    chrome.storage.local.get(["courses"], (results) => {
    const courses = results.courses || {};
    RenderCourses(courses);
    });
    },
    ///if in mun loads analysis, reads from its grades and titles, visualizes them.
    chrome.tabs.query({ active: true, currentWindow:true }, tabs => {
        if (!tabs.length) return;
        ///sends message to analysis.js to get grades
        chrome.tabs.sendMessage(
            tabs[0].id,
            { type: "GetCourseData"},
            response => {
                if (!response || typeof response.grade !== "number") {
                    return;
                }
                chrome.storage.local.get(["courses"], (results) => {
                    const courses = results.courses || {};
                    courses[response.title] = {
                        grade: response.grade,
                        savedAt: Date.now()
                    };
                    chrome.storage.local.set({courses},() =>{
                    RenderCourses(courses)})
                });
            }
        );
    })
);