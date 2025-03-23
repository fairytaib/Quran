const quran_api = "https://quranapi.pages.dev/api/";

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

async function populate_end_ayah(surah_number) {
    const ayah_amount = await get_ayah_amount(surah_number);
    const field = document.getElementById("end-ayah");
    field.value = ayah_amount;
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

function limit_ayah_search() {
    const start_ayah = document.getElementById("start-ayah");
    const end_ayah = document.getElementById("end-ayah");

    if (parseInt(start_ayah.value) > parseInt(end_ayah.value)) {
        start_ayah.value = end_ayah.value;
    }

    return [parseInt(start_ayah.value), parseInt(end_ayah.value)];
}

async function get_ayah_arabic(surah_number, ayah_number) {
    try {
        const response = await fetch(quran_api + `${surah_number}/${ayah_number}.json`);
        const ayah = await response.json();
        return ayah.arabic1 || "Arabic text not found"; // Ensure the API response has this property
    } catch (error) {
        console.error("Error fetching Arabic ayah:", error);
        return "Error fetching data";
    }
}

async function get_ayah_english(surah_number, ayah_number) {
    try {
        const response = await fetch(quran_api + `${surah_number}/${ayah_number}.json`);
        const ayah = await response.json();
        return ayah.english || "English translation not found"; // Ensure the API response has this property
    } catch (error) {
        console.error("Error fetching English ayah:", error);
        return "Error fetching data";
    }
}

function set_random_ayah(values){
    const random = Math.floor(Math.random() * (values[1] - values[0] + 1)) + values[0];
    return random    
}

document.getElementById("surah-dropdown").addEventListener("change", async function () {
    const surah_number = get_surah();
    populate_end_ayah(surah_number);
});

document.addEventListener("DOMContentLoaded", populateDropdown);

document.getElementById("get-random-ayah-button").addEventListener("click", async function () {
    const surah_number = get_surah();
    const ayah_limit = limit_ayah_search();
    const ayah_number = set_random_ayah(ayah_limit);

    const arabic = await get_ayah_arabic(surah_number, ayah_number);
    const english = await get_ayah_english(surah_number, ayah_number);

    document.getElementById("ayah-arabic").innerText = arabic;
    document.getElementById("ayah-english").innerText = english;
});
