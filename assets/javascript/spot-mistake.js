const quran_api = "https://quranapi.pages.dev/api/";

const container_one = document.getElementById("container-one");
const container_two = document.getElementById("container-two");

const container_one_ayah_one = document.getElementById("container-one-ayah-one");
const container_one_ayah_two = document.getElementById("container-one-ayah-two");

const container_two_ayah_one = document.getElementById("container-two-ayah-one");
const container_two_ayah_two = document.getElementById("container-two-ayah-two");

const surah_dropdown = document.getElementById("surah-dropdown");

const start_button = document.getElementById("generate-button");

// Standardmäßig den Button deaktivieren
start_button.disabled = true;

let correct_answer = [];
let incorrect_answer = [];

function get_surah() {
    return document.getElementById("surah-dropdown").value;
}

async function get_all_surahs(surah_number) {
    try {
        const response = await fetch(quran_api + `surah.json`);
        const surah = await response.json();
        return surah; // Ensure the API response has this property
    } catch (error) {
        console.error("Error fetching surahs:", error);
        return "Error fetching data";
    }
}

async function get_ayah_amount(surah_number) {
    try {
        const response = await fetch(quran_api + `${surah_number}.json`);
        const surah = await response.json();
        return surah.totalAyah; // Ensure the API response has this property
    } catch (error) {
        console.error("Error fetching ayah amount:", error);
        return 1; // Default to 1 if an error occurs
    }
}

async function populateDropdown() {
    const dropdown = document.getElementById("surah-dropdown");
    const surahs = await get_all_surahs();

    // Vorherige Inhalte entfernen
    dropdown.innerHTML = "";

    // Platzhalteroption hinzufügen
    const defaultOption = document.createElement("option");
    defaultOption.text = "Choose a Surah";
    defaultOption.value = "";
    dropdown.appendChild(defaultOption);

    // Surahs in das Dropdown einfügen
    surahs.forEach((surah, index) => {
        const option = document.createElement("option");
        option.value = index + 1; // Suren-Nummer als Wert
        option.text = `${index + 1}. ${surah.surahName} (${surah.surahNameArabic}) - ${surah.surahNameTranslation}`;
        dropdown.appendChild(option);
    });
}

// Aktiviert den Button, wenn eine Surah ausgewählt wurde
surah_dropdown.addEventListener("change", function () {
    const surah_number = get_surah();

    if (surah_number) {
        start_button.disabled = false; // Aktivieren, wenn eine Surah ausgewählt wurde
    } else {
        start_button.disabled = true; // Deaktivieren, wenn keine Surah ausgewählt wurde
    }
});

async function get_correct_ayah() {
    const surah = document.getElementById("surah-dropdown").value;
    const ayahAmount = await get_ayah_amount(surah);
    let random_ayah = Math.floor(Math.random() * ayahAmount) + 1;

    if (random_ayah > ayahAmount - 1) {
        random_ayah -= 1
    }

    try {
        const response1 = await fetch(quran_api + `${surah}/${random_ayah}.json`);
        const data1 = await response1.json();
        if (data1 && data1.arabic1) {
            correct_answer.push(data1.arabic1);
        } else {
            console.error("Invalid data for correct ayah:", data1);
        }

        if (random_ayah < ayahAmount) {
            const response2 = await fetch(quran_api + `${surah}/${random_ayah + 1}.json`);
            const data2 = await response2.json();
            if (data2 && data2.arabic1) {
                correct_answer.push(data2.arabic1);
            } else {
                console.error("Invalid data for correct ayah (second):", data2);
            }
        }
    } catch (error) {
        console.error("Error fetching correct ayah:", error);
    }
}

async function get_wrong_ayah() {
    const surah = document.getElementById("surah-dropdown").value;
    const ayahAmount = await get_ayah_amount(surah);
    const random_ayah = Math.floor(Math.random() * ayahAmount) + 1;
    let random_ayah_two;

    do {
        random_ayah_two = Math.floor(Math.random() * ayahAmount) + 1;
    } while (random_ayah_two === random_ayah);

    try {
        const response1 = await fetch(quran_api + `${surah}/${random_ayah}.json`);
        const data1 = await response1.json();
        if (data1 && data1.arabic1) {
            incorrect_answer.push(data1.arabic1);
        } else {
            console.error("Invalid data for wrong ayah:", data1);
        }

        const response2 = await fetch(quran_api + `${surah}/${random_ayah_two}.json`);
        const data2 = await response2.json();
        if (data2 && data2.arabic1) {
            incorrect_answer.push(data2.arabic1);
        } else {
            console.error("Invalid data for wrong ayah (second):", data2);
        }
    } catch (error) {
        console.error("Error fetching wrong ayah:", error);
    }
}

function check_answer(isCorrect, container) {
    if (isCorrect) {
        // Wenn die Antwort korrekt ist, färbe den gesamten Container grün
        container.style.backgroundColor = "green";
    } else {
        // Wenn die Antwort falsch ist, färbe den gesamten Container rot
        container.style.backgroundColor = "red";
    }
}

function reset() {
    // Hintergrundfarben zurücksetzen
    container_one.style.backgroundColor = "";
    container_two.style.backgroundColor = "";

    // Klassen zurücksetzen
    container_one.classList.remove("correct", "incorrect");
    container_two.classList.remove("correct", "incorrect");
}


function display_text() {
    const isCorrectInContainerOne = Math.random() < 0.5;

    if (isCorrectInContainerOne) {
        container_one.classList.add("correct");
        container_two.classList.add("incorrect");
        container_one_ayah_one.innerHTML = correct_answer[0];
        container_one_ayah_two.innerHTML = correct_answer[1];
        container_two_ayah_one.innerHTML = incorrect_answer[0];
        container_two_ayah_two.innerHTML = incorrect_answer[1];

        // Füge Event-Listener für Klicks hinzu
        container_one.onclick = () => check_answer(true, container_one); // Container One ist korrekt
        container_two.onclick = () => check_answer(false, container_two); // Container Two ist falsch
    } else {
        container_one.classList.add("incorrect");
        container_two.classList.add("correct");
        container_one_ayah_one.innerHTML = incorrect_answer[0];
        container_one_ayah_two.innerHTML = incorrect_answer[1];
        container_two_ayah_one.innerHTML = correct_answer[0];
        container_two_ayah_two.innerHTML = correct_answer[1];

        // Füge Event-Listener für Klicks hinzu
        container_one.onclick = () => check_answer(false, container_one); // Container One ist falsch
        container_two.onclick = () => check_answer(true, container_two); // Container Two ist korrekt
    }
}

document.addEventListener("DOMContentLoaded", populateDropdown);

start_button.addEventListener("click", async function () {
    correct_answer = []; // Schreibfehler korrigiert
    incorrect_answer = []; // Schreibfehler korrigiert

    reset();
    await get_correct_ayah();
    await get_wrong_ayah();
    display_text();
});