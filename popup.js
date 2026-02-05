const ListOfCourses = document.getElementById("courses")
const checkbox = document.getElementById("grade-toggle")
const on = document.getElementsByClassName("onoff")[0]
///Creates button and attaches to course data
function renderstorage(){
    chrome.storage.local.get(["courses"], results => {
                const courses = results.courses || {};

                if (checkbox.checked) {
                    RenderProbCourses(courses);
                } else {
                    RenderCourses(courses);
                }
            });
}
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
function CreateNumberBox(row, title) {
    const Box = document.createElement("input");
    Box.id = "Box-" + title;

    Box.type = "number";
    Box.placeholder = "Target grade %";
    Box.min="0";
    Box.max="100";
    Box.step="0.1";

    Box.className = "course-box";
    Box.dataset.title = title;
    row.appendChild(Box);
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
function RenderProbCourses(courses) {
    ListOfCourses.innerHTML = "";

        Object.entries(courses)
            .sort((a,b) => b[1].savedAt - a[1].savedAt)
            .forEach(([title, data]) => {
                console.log(title, data);

                if ( !Number.isFinite(data.grade) || !Number.isFinite(data.weight) || !Number.isFinite(data.target)) return;
            
                const target = data.target;
                const completed = data.weight;
                const current = data.grade;
                console.log(target, completed, current)
                const row = document.createElement("div");
                row.className = "course-row"
                row.innerHTML = `<div class="course-title">${title}</div>
                                <div class="course-target">Needed grade to achieve ${target}:</div>
                                <div class="course-reminder">${posgrade(target, completed, current)} %</div>`;
                CreateNumberBox(row, title);
                CreateButton(row, title);
                ListOfCourses.appendChild(row);
            })
}
function posgrade(target, completed, current) {
    const gathered = (current/100) * completed;
    const leftover = 100-completed;
    const needed = (target - gathered)/leftover;
    return (needed*100).toFixed(2);
}
document.addEventListener("DOMContentLoaded", () => {   

    checkbox.addEventListener("change", () => {
        on.textContent = checkbox.checked ? "ADVANCED" : "BASIC";

        renderstorage()
    })

    document.getElementById("courses").addEventListener("change", ev => {

        const Boxs = ev.target.closest(".course-box");
        if(!Boxs) return;

        const value = Number(Boxs.value);
        if(!Number.isFinite(value)) return;
        
        const title = Boxs.dataset.title;
        if (!title) return;

        chrome.storage.local.get(["courses"], results => {
            const courses = results.courses || {};

            courses[title].target = value
            console.log(value)

            chrome.storage.local.set({ courses }, () => {
                renderstorage();
            });
        });

    })


    document.getElementById("courses").addEventListener("click", ev => {

            const Button = ev.target.closest(".course-delete");
            if(!Button) return;

            const title = Button.dataset.title;
            if (!title) return;

            chrome.storage.local.get(["courses"], results => {
                const courses = results.courses || {};

                delete courses[title];

                chrome.storage.local.set({ courses }, () => {
                    renderstorage();
                });
        });
    });
   ///loads saved courses if not in mun
    chrome.storage.local.get(["courses"], (results) => {

        renderstorage()
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
                        weight: response.weight,
                        target: courses[response.title]?.target ?? 55,
                        savedAt: Date.now()
                    };
                    chrome.storage.local.set({ courses }, renderstorage);
                });
            }
        );
    })
);
