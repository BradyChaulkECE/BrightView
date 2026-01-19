const ListOfCourses = document.getElementById("courses")
///Creates button and attaches to course data
function CreateButton(row, title) {
        const Button = document.createElement("button");
        Button.id = "Button-" + title;
        ///visable display of trash icon
        Button.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                                <rect x="6" y="7" width="12" height="14" rx="1"></rect>
                                <rect x="9" y="3" width="6" height="3"></rect>
                            </svg>`;
        Button.className = "course-delete";
        Button.dataset.title = title;
        row.appendChild(Button);
    }
///renders courses after new data is inserted or removed
function RenderCourses(courses) {
        ListOfCourses.innerHTML = "";
        Object.entries(courses)
            .sort((a,b) => b[1].savedAt - a[1].savedAt)
            .forEach(([title, data]) => {
                if (typeof data.grade !== "number" || !Number.isFinite(data.grade)) {
                    return;
                }
                const row = document.createElement("div");
                row.className = "course-row"
                row.innerHTML = `<div class="course-title">${title}</div>
                                <div class="course-grade">${data.grade.toFixed(2)}%    avg</div>`;
                CreateButton(row, title);
                ListOfCourses.appendChild(row);
                
                
        });
    }
document.addEventListener("DOMContentLoaded", () => {   

    document.getElementById("courses").addEventListener("click", ev => {

            const Button = ev.target.closest(".course-delete");
            if(!Button) return;

            const title = Button.dataset.title;
            if (!title) return;

            chrome.storage.local.get(["courses"], results => {
                const courses = results.courses || {};

                delete courses[title];

                chrome.storage.local.set({courses}, results => {
                    RenderCourses(courses);
            });
        });
    });
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
