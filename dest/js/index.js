"use strict";
// // elements
// let form: HTMLFormElement | null = document.getElementById("search-form") as HTMLFormElement;
// let inputValue: string | null = (document.getElementById("search-input") as HTMLInputElement)?.value ?? null;
// let subBtn: HTMLButtonElement | null = document.getElementById("subBtn") as HTMLButtonElement | null;
// if (subBtn) {
//     // Lägg till händelsehanteraren
//     subBtn.addEventListener("click", addCourse);
// }
// lägger till en kurs
function addCourse(courseinfo) {
    const courseDetailsUl = document.getElementById("courseDetailsUl");
    if (courseDetailsUl) {
        const link = document.createElement('a');
        link.href = "https://www.miun.se/utbildning/program/webbutveckling/";
        link.textContent = "Kursplanen";
        const liEl = document.createElement("li");
        liEl.textContent = `${courseinfo.code}, ${courseinfo.name}, ${courseinfo.progression}`;
        courseDetailsUl.appendChild(liEl);
        liEl.appendChild(link);
    }
}
;
// Hämta DOM-element för formulär och användardetaljer
const course_form = document.getElementById("course_form");
// Lägg till händelselyssnare på formuläret
course_form.addEventListener("submit", (event) => {
    event.preventDefault();
    // Hämta värden från formuläret
    const codeInput = document.getElementById("input_code");
    const nameInput = document.getElementById("input_name");
    const progressionInput = document.querySelectorAll('.radio-input');
    //   const syllabusInput = document.getElementById("phoneNumber") as HTMLInputElement;
    // Loopa igenom alla radioknappar för att hitta den valda knappen
    let selectedValue;
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
    const newCourse = {
        code: codeInput.value,
        name: nameInput.value,
        progression: selectedValue !== null && selectedValue !== void 0 ? selectedValue : "",
        // syllabus: syllabusInput.value
    };
    // Använd printUserDetails för att skriva ut användardetaljer
    addCourse(newCourse);
});