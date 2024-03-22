interface Courseinfo {
    code: string;
    name: string;
    progression: string;
    // syllabus  : string;
}

// lägger till en kurs
function addCourse(courseinfo: Courseinfo): void {
    const courseDetailsUl = document.getElementById("courseDetailsUl");
    if (courseDetailsUl) {
        const link = document.createElement('a');
        link.href = "https://www.miun.se/utbildning/program/webbutveckling/";
        link.textContent = "Kursplanen";

        const liEl = document.createElement("li");
        liEl.textContent = `${courseinfo.code}, ${courseinfo.name}, ${courseinfo.progression}, `;

        courseDetailsUl.appendChild(liEl);
        liEl.appendChild(link);
    }
};

// Hämta DOM-element för formulär och användardetaljer
const course_form = document.getElementById("course_form") as HTMLFormElement;

// Lägg till händelselyssnare på formuläret
course_form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Hämta värden från formuläret
    const codeInput = document.getElementById("input_code") as HTMLInputElement;
    const nameInput = document.getElementById("input_name") as HTMLInputElement;
    const progressionInput = document.querySelectorAll<HTMLInputElement>('.radio-input');
    //   const syllabusInput = document.getElementById("phoneNumber") as HTMLInputElement;

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
        // syllabus: syllabusInput.value
    };

    // Använd printUserDetails för att skriva ut användardetaljer
    addCourse(newCourse);
});
