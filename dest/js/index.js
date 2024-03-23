"use strict";
// LOCAL STORAGE
//funktion som hämtar kurser från local storage
function getCourses() {
    const courseJSON = localStorage.getItem("courses");
    return courseJSON ? JSON.parse(courseJSON) : [];
}
//funktion som sparar kurser till localstorage
function saveCourses(courses) {
    localStorage.setItem("courses", JSON.stringify(courses));
}
//när sidan laddas skrivs sparade kurser ut
window.addEventListener("load", () => {
    const courses = getCourses();
    courses.forEach(course => {
        addCourse(course);
    });
});
//rensar listan på sidan och localstorage vid klick på knappen "Rensa"
const courseDetailsUl = document.getElementById("courseDetailsUl");
const deleteBtn = document.getElementById("deleteBtn");
if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
        if (courseDetailsUl) {
            courseDetailsUl.innerHTML = "";
        }
        saveCourses([]); // rensar localStorage        
    });
}
// lägger till en kurs
function addCourse(course) {
    const courseDetailsUl = document.getElementById("courseDetailsUl");
    if (courseDetailsUl) {
        // skapar ett list element och ger den ett id
        const liEl = document.createElement("li");
        liEl.id = `course_${course.code}`;
        liEl.innerHTML = `${course.code}, ${course.name}, 
        ${course.progression}, 
        <a class="courseplan" href="${course.syllabus}">${course.syllabus}</a>
        <button class="edit">Redigera</button>`;
        courseDetailsUl.appendChild(liEl); // Lägg till det nya <li>-elementet till <ul>
        // Eventlyssnare för klick på redigeringsknappen
        const editBtn = liEl.querySelector('.edit');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                editCourse(course);
            });
        }
    }
}
;
// Funktion för att uppdatera listan med kurser på sidan
function updateCourseList(courses) {
    saveCourses(courses); // sparar kurserna till localstorage
    if (courseDetailsUl) {
        courseDetailsUl.innerHTML = ""; // Rensar befintlig kurslista på webbsidan
        courses.forEach(course => {
            addCourse(course);
        });
    }
}
// Funktion för att kontrollera om en kurskod redan existerar i listan
function isCourseCodeUnique(code, courseDetailsUl) {
    return !courseDetailsUl.some(course => course.code === code);
}
// Hämta DOM-element för formulär och användardetaljer
const course_form = document.getElementById("course_form");
// Lägg till händelselyssnare på formuläret
course_form.addEventListener("submit", function (event) {
    event.preventDefault();
    // Hämta värden från formuläret
    const codeInput = document.getElementById("input_code").value;
    const nameInput = document.getElementById("input_name").value; // lägga till : String
    const progressionInput = document.getElementById("select_input").value;
    const syllabusInput = document.getElementById("input_url").value;
    // Notering: här borde inputvalidering läggas till
    // Skapa ett användarobjekt
    const newCourse = {
        code: codeInput,
        name: nameInput,
        progression: progressionInput,
        syllabus: syllabusInput
    };
    //kontrollerar att kurskoden är unik innan kursen läggs till på listan
    const courses = getCourses();
    if (!isCourseCodeUnique(newCourse.code, courses)) {
        alert("Kurskoden måste vara unik");
        return;
    }
    saveCourseToLocalStorage(newCourse); //anropar funktionen för att spara kursen i localstorage
    course_form.reset(); //nollställer formuläret
    // Använd printUserDetails för att skriva ut användardetaljer
    addCourse(newCourse);
});
// Funktion för att spara kursen i localStorage
function saveCourseToLocalStorage(course) {
    const courses = getCourses();
    courses.push(course);
    saveCourses(courses);
}
// Redigering av kurser
function editCourse(course) {
    // tar bort tidigare redigeringsformulär för samma kurs
    const existingEditForm = document.getElementById(`courseEditForm-${course.code}`);
    if (existingEditForm) {
        existingEditForm.remove();
    }
    // skapar ett nytt form för att redigera
    const editForm = document.createElement("form");
    editForm.id = `courseEditForm_${course.code}`;
    editForm.setAttribute('course_data_code', course.code);
    editForm.innerHTML = `
            <label for="input_code_edit">Kurskod:</label>
            <input type="text" class="search_input_edit" id="input_code_edit" placeholder="Skriv kurskod" value="${course.code}">
            <br>
            <label for="input_name_edit">Kursnamn:</label>
            <input type="text" class="search_input_edit" id="input_name_edit" placeholder="Skriv kursnamn" value="${course.name}">
            <br>
            <label for="input_url_edit">URL:</label>
            <input type="text" class="search_input_edit" id="input_url_edit" placeholder="Skriv url" value="${course.syllabus}">
            <br>
            <label for="select_input_edit">Progression:</label>
            <select name="Progression" id="select_input_edit" required>
                <option value="A" ${course.progression === 'A' ? 'selected' : ''}>A</option>
                <option value="B" ${course.progression === 'B' ? 'selected' : ''}>B</option>
                <option value="C" ${course.progression === 'C' ? 'selected' : ''}>C</option>
            </select>
            <button type="submit" id="updateBtn">Uppdatera</button>
    `;
    // Lägger till formuläret till den kursen
    const courseElForEdit = document.getElementById(`course_${course.code}`);
    if (courseElForEdit) {
        courseElForEdit.appendChild(editForm);
        // använder en eventlistner på formulärets knapp
        editForm.addEventListener("submit", (event) => {
            event.preventDefault();
            // uppdaterar informatione för kursen i webbläsaren
            const updatedCourse = {
                code: document.getElementById("input_code_edit").value,
                name: document.getElementById("input_name_edit").value,
                progression: document.getElementById("select_input_edit").value,
                syllabus: document.getElementById("input_url_edit").value
            };
            // hämtar de gamla kurserna och uppdaterar till den nya i localstorage
            let courses = getCourses();
            if (!isCourseCodeUnique(updatedCourse.code, courses.filter(c => c.code !== course.code))) {
                alert("Kurskoden måste vara unik");
                return;
            }
            courses = courses.map(c => c.code === course.code ? updatedCourse : c);
            saveCourses(courses);
            // Uppdaterar kurslistan på webbsidan
            updateCourseList(courses);
            // Tar bort redigeringsformuläret
            editForm.remove();
        });
    }
}
