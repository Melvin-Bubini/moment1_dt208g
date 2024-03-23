interface Courseinfo {
    code: string;
    name: string;
    progression: string;
    syllabus: string;
}

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



//rensar listan på sidan och localstorage vid klick på knappen "Ta bort alla kurser"
const courseDetailsUl = document.getElementById("courseDetailsUl");
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
function addCourse(courseinfo: Courseinfo): void {
    const courseDetailsUl = document.getElementById("courseDetailsUl");
    if (courseDetailsUl) {
        // const link = document.createElement('a');
        // link.href = "https://www.miun.se/utbildning/program/webbutveckling/";
        // link.textContent = "Kursplanen";

        const liEl = document.createElement("li");
        liEl.innerHTML = `${courseinfo.code}, ${courseinfo.name}, ${courseinfo.progression}, <a class="courseplan" href="${courseinfo.syllabus}">${courseinfo.syllabus}</a>`;
        courseDetailsUl.appendChild(liEl); // Lägg till det nya <li>-elementet till <ul>
    }
};

// Funktion för att kontrollera om en kurskod redan existerar i listan
function isCourseCodeUnique(courseCode: string, courseList: Courseinfo[]): boolean {
    return !courseList.some(course => course.code === courseCode);
}



// Hämta DOM-element för formulär och användardetaljer
const course_form = document.getElementById("course_form") as HTMLFormElement;

// Lägg till händelselyssnare på formuläret
course_form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Hämta värden från formuläret
    const codeInput = document.getElementById("input_code") as HTMLInputElement;
    const nameInput = document.getElementById("input_name") as HTMLInputElement;
    const progressionInput = document.querySelectorAll<HTMLInputElement>('.radio-input');
    const syllabusInput = document.getElementById("input_url") as HTMLInputElement;

    // Loopa igenom alla radioknappar för att hitta den valda knappen
    let selectedValue: string | undefined;
    for (let i = 0; i < progressionInput.length; i++) {
        if (progressionInput[i].checked) {
            selectedValue = progressionInput[i].value;
            break; // Avsluta loopen när den valda knappen har hittats
        }
    }
    // Visa en alert om inget alternativ har valts
    if (!selectedValue) {
        alert('Inget alternativ är valt.');
    }

    // Notering: här borde inputvalidering läggas till


    // Skapa ett användarobjekt
    const newCourse: Courseinfo = {
        code: codeInput.value,
        name: nameInput.value,
        progression: selectedValue ?? "",
        syllabus: syllabusInput.value
    };

    //kontrollerar att kurskoden är unik innan kursen läggs till på listan
    const courses: Courseinfo[] = getCourses();
    if (!isCourseCodeUnique(newCourse.code, courses)) {
        alert("Kurskoden måste vara unik");
        return;
    }

    saveCourseToLocalStorage(newCourse);//anropar funktionen för att spara kursen i localstorage
    course_form.reset();//nollställer formuläret

    // Använd printUserDetails för att skriva ut användardetaljer
    addCourse(newCourse);
});


// Funktion för att spara kursen i localStorage
function saveCourseToLocalStorage(course: Courseinfo): void {
    const courses: Courseinfo[] = getCourses();
    courses.push(course);
    saveCourses(courses);
}
