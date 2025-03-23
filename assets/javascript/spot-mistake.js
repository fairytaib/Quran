const quran_api = "https://quranapi.pages.dev/api/";

const container_one_ayah_one = document.getElementById("container-one-ayah-one");
const container_one_ayah_two = document.getElementById("container-one-ayah-two");

const container_two_ayah_one = document.getElementById("container-two-ayah-one");
const container_two_ayah_two = document.getElementById("container-two-ayah-two");

const surah_dropdown = document.getElementById("surah-dropdown");

let correct_anwser = []
let incorrect_anwser = []

function get_surah(){
    return document.getElementById("surah-dropdown").value;
}

async function get_all_surahs(surah_number) {
    try {
        const response = await fetch(quran_api + `surah.json`);
        const surah = await response.json();
        return surah;  // Ensure the API response has this property
    } catch (error) {
        console.error("Error fetching surahs:", error);
        return "Error fetching data";
    }
}

async function get_ayah_amount(surah_number) {
    try {
        const response = await fetch(quran_api + `${surah_number}.json`);
        const surah = await response.json();
        return surah.totalAyah;  // Ensure the API response has this property
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

async function get_correct_ayah(){
    const surah = document.getElementById("surah-dropdown").value;
    const random_ayah = Math.floor(Math.random() * get_ayah_amount(surah)) + 1;

    if (random_ayah < 1){
        random_ayah += 1
    } else if (random_ayah > get_ayah_amount(surah)){
        random_ayah -= 1
    }

    fetch(quran_api + `${surah}/${random_ayah}.json`)
        .then(response => response.json())
        .then(data => {
            correct_anwser.push(data.text);
        })
        .catch(error => {
            console.error("Error fetching ayah:", error);
        });

    fetch(quran_api + `${surah}/${random_ayah + 1}.json`)
        .then(response => response.json())
        .then(data => {
            correct_anwser.push(data.text);
        })
        .catch(error => {
            console.error("Error fetching ayah:", error);
        });
}

async function get_wrong_ayah(){
    const surah = document.getElementById("surah-dropdown").value;
    const random_ayah = Math.floor(Math.random() * get_ayah_amount(surah)) + 1;
    const random_ayah_two = Math.floor(Math.random() * get_ayah_amount(surah)) + 1;

    if (random_ayah < 1){
        random_ayah += 1
    } else if (random_ayah > get_ayah_amount(surah)){
        random_ayah -= 1
    }

    fetch(quran_api + `${surah}/${random_ayah}.json`)
        .then(response => response.json())
        .then(data => {
            incorrect_anwser.push(data.text);
        })
        .catch(error => {
            console.error("Error fetching ayah:", error);
        });

    fetch(quran_api + `${surah}/${random_ayah_two}.json`)
        .then(response => response.json())
        .then(data => {
            incorrect_anwser.push(data.text);
        })
        .catch(error => {
            console.error("Error fetching ayah:", error);
        });
}

document.addEventListener("DOMContentLoaded", populateDropdown);