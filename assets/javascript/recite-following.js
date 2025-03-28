const random_ayah_button = document.getElementById("get-random-ayah-button");
const show_answer_button = document.getElementById("show-answer-button");
const surah_dropdown = document.getElementById("surah-dropdown");

const quran_api = "https://quranapi.pages.dev/api/";

// Standardmäßig den Button deaktivieren
random_ayah_button.disabled = true;

function get_surah() {
    return document.getElementById("surah-dropdown").value;
}

async function populate_end_ayah(surah_number) {
    const ayah_amount = await get_ayah_amount(surah_number);
    const field = document.getElementById("end-ayah");
    field.value = ayah_amount;
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
        return surah.totalAyah; // Ensure the API response has this property
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

async function get_ayah_english_previous(surah_number, ayah_number) {
    if (ayah_number > 1) {
        try {
            const response = await fetch(quran_api + `${surah_number}/${ayah_number - 1}.json`);
            const ayah = await response.json();
            return ayah.english || "English translation not found"; // Ensure the API response has this property
        } catch (error) {
            console.error("Error fetching English ayah:", error);
            return "Error fetching data";
        }

    } else {
        return "";
    }
}

async function get_ayah_english_following(surah_number, ayah_number) {
    const max_ayah = await get_ayah_amount(surah_number);
    if (ayah_number < max_ayah) {
        try {
            const response = await fetch(quran_api + `${surah_number}/${ayah_number + 1}.json`);
            const ayah = await response.json();
            return ayah.english || "English translation not found"; // Ensure the API response has this property
        } catch (error) {
            console.error("Error fetching English ayah:", error);
            return "Error fetching data";
        }
    } else {
        return "";
    }
}

function set_random_ayah(values) {
    const random = Math.floor(Math.random() * (values[1] - values[0] + 1)) + values[0];
    return random;
}

async function get_previous_ayah(surah_number, ayah_number) {
    if (ayah_number > 1) {
        try {
            const response = await fetch(quran_api + `${surah_number}/${ayah_number - 1}.json`);
            const ayah = await response.json();
            return ayah.arabic1 || "Arabic text not found"; // Ensure the API response has this property
        } catch (error) {
            console.error("Error fetching Arabic ayah:", error);
            return "Error fetching data";
        }
    } else {
        return "";
    }
}

async function get_following_ayah(surah_number, ayah_number) {
    const max_ayah = await get_ayah_amount(surah_number);
    if (ayah_number < max_ayah) {
        try {
            const response = await fetch(quran_api + `${surah_number}/${ayah_number + 1}.json`);
            const ayah = await response.json();
            return ayah.arabic1 || "Arabic text not found"; // Ensure the API response has this property
        } catch (error) {
            console.error("Error fetching Arabic ayah:", error);
            return "Error fetching data";
        }
    } else {
        return "";
    }
}

document.addEventListener("DOMContentLoaded", populateDropdown);

// Aktiviert den Button, wenn eine Surah ausgewählt wurde
surah_dropdown.addEventListener("change", async function () {
    const surah_number = get_surah();

    if (surah_number) {
        random_ayah_button.disabled = false; // Aktivieren, wenn eine Surah ausgewählt wurde
        populate_end_ayah(surah_number);
    } else {
        random_ayah_button.disabled = true; // Deaktivieren, wenn keine Surah ausgewählt wurde
    }
});

random_ayah_button.addEventListener("click", async function () {
    const surah_number = get_surah();
    const ayah_limit = limit_ayah_search();
    const ayah_number = set_random_ayah(ayah_limit);
    const arabic = await get_ayah_arabic(surah_number, ayah_number);
    const english = await get_ayah_english(surah_number, ayah_number);

    // Fülle die aktuellen Ayah-Daten
    document.getElementById("ayah-arabic").innerText = arabic;
    document.getElementById("ayah-english").innerText = english;
    document.getElementById("previous-ayah").innerText = "";
    document.getElementById("following-ayah").innerText = "";
    document.getElementById("ayah-english-previous").innerText = "";
    document.getElementById("ayah-english-following").innerText = "";

    // Entferne alte Event-Listener und füge einen neuen hinzu
    const show_answer_button = document.getElementById("show-answer-button");
    const cloned_button = show_answer_button.cloneNode(true);
    show_answer_button.parentNode.replaceChild(cloned_button, show_answer_button);

    cloned_button.addEventListener("click", async function () {
        // Hole die vorherige und folgende Ayah
        const previous_ayah = await get_previous_ayah(surah_number, ayah_number);
        const following_ayah = await get_following_ayah(surah_number, ayah_number);
        const previous_ayah_english = await get_ayah_english_previous(surah_number, ayah_number);
        const following_ayah_english = await get_ayah_english_following(surah_number, ayah_number);

        // Fülle die entsprechenden Felder
        document.getElementById("previous-ayah").innerText = previous_ayah;
        document.getElementById("following-ayah").innerText = following_ayah;
        document.getElementById("ayah-english-previous").innerText = previous_ayah_english;
        document.getElementById("ayah-english-following").innerText = following_ayah_english;
    });
});