interface Courseinfo {
    code: string;
    name: string;
    progression: string;
    syllabus: string;
}

// LOCAL STORAGE
//funktion som hämtar kurser från local storage
function getCourses(): Courseinfo[] {
    const courseJSON: string | null = localStorage.getItem("courses");
    return courseJSON ? JSON.parse(courseJSON) : [];
}

//funktion som sparar kurser till localstorage
function saveCourses(courses: Courseinfo[]): void {
    localStorage.setItem("courses", JSON.stringify(courses));
}


//när sidan laddas skrivs sparade kurser ut
window.addEventListener("load", () => {
    const courses: Courseinfo[] = getCourses();
    courses.forEach(course => {
        addCourse(course);
    });
});



//rensar listan på sidan och localstorage vid klick på knappen "Rensa"
const courseDetailsUl = document.getElementById("courseDetailsUl") as HTMLUListElement;
const deleteBtn: HTMLButtonElement | null = document.getElementById("deleteBtn") as HTMLButtonElement | null;
if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
        if (courseDetailsUl) {
            courseDetailsUl.innerHTML = "";
        }
        saveCourses([]); // rensar localStorage        
    });
}



// lägger till en kurs
function addCourse(course: Courseinfo): void {
    const courseDetailsUl = document.getElementById("courseDetailsUl") as HTMLUListElement;
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
        const editBtn: HTMLButtonElement | null = liEl.querySelector('.edit');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                editCourse(course);
            });
        }
    }
};

// Funktion för att uppdatera listan med kurser på sidan
function updateCourseList(courses: Courseinfo[]): void {

    saveCourses(courses); // sparar kurserna till localstorage

    if (courseDetailsUl) {
        courseDetailsUl.innerHTML = ""; // Rensar befintlig kurslista på webbsidan
        courses.forEach(course => {//loopar igenom och visar alla befintliga kurser på websidan
            addCourse(course);
        });
    }
}

// Funktion för att kontrollera om en kurskod redan existerar i listan
function isCourseCodeUnique(code: string, courseDetailsUl: Courseinfo[]): boolean {

   // Konverterar inmatad kurskod till antingen alla små bokstäver eller alla stora bokstäver
   const normalizedCode = code.toUpperCase();

   // Jämför den normaliserade kurskoden med kurskoderna i listan, även de normaliserade
   return !courseDetailsUl.some(course => course.code.toUpperCase() === normalizedCode);
}



// Hämta DOM-element för formulär och användardetaljer
const course_form = document.getElementById("course_form") as HTMLFormElement;

// Lägg till händelselyssnare på formuläret
course_form.addEventListener("submit", function (event: Event) {
    event.preventDefault();

    // Hämta värden från formuläret
    const codeInput : string = (document.getElementById("input_code") as HTMLInputElement).value;
    const nameInput : string = (document.getElementById("input_name") as HTMLInputElement).value; 
    const progressionInput : string = (document.getElementById("select_input") as HTMLInputElement).value;
    const syllabusInput : string = (document.getElementById("input_url") as HTMLInputElement).value;



    // Skapa ett objekt
    const newCourse: Courseinfo = {
        code: codeInput,
        name: nameInput,
        progression: progressionInput,
        syllabus: syllabusInput
    };

    //kontrollerar att kurskoden är unik innan kursen läggs till på listan
    const courses: Courseinfo[] = getCourses();
    if (!isCourseCodeUnique(newCourse.code, courses)) {
        alert("Kurskoden måste vara unik");
        return;
    }

    saveCourseToLocalStorage(newCourse);//anropar funktionen för att spara kursen i localstorage
    course_form.reset();//nollställer formuläret

    // Använder addCourse 
    addCourse(newCourse);
});


// Funktion för att spara kursen i localStorage
function saveCourseToLocalStorage(course: Courseinfo): void {
    const courses: Courseinfo[] = getCourses();
    courses.push(course);
    saveCourses(courses);
}



// Redigering av kurser

function editCourse(course: Courseinfo): void {
    // tar bort tidigare redigeringsformulär för samma kurs
    const existingEditForm = document.getElementById(`courseEditForm-${course.code}`) as HTMLFormElement;
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
            const updatedCourse : Courseinfo = {
                code : (document.getElementById("input_code_edit") as HTMLInputElement).value,
                name : (document.getElementById("input_name_edit") as HTMLInputElement).value,
                progression : (document.getElementById("select_input_edit") as HTMLInputElement).value,
                syllabus : (document.getElementById("input_url_edit") as HTMLInputElement).value
            };

            // hämtar de gamla kurserna och uppdaterar till den nya i localstorage
            let courses : Courseinfo[] = getCourses();

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
        })
    }
}