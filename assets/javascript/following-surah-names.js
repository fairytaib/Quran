document.addEventListener('DOMContentLoaded', function() {

    const quran_api = "https://quranapi.pages.dev/api/";

    const surah_name = document.getElementById('surah-name');
    const surah_name_arabic = document.getElementById('surah-name-arabic');

    const back_button = document.getElementById('back-button');
    const next_button = document.getElementById('next-button');

    let current_surah = 1;

    fetch(quran_api + `${current_surah}.json`)
        .then(response => response.json())
        .then(data => {
            surah_name_arabic.textContent = data.surahNameArabic;
            surah_name.textContent = data.surahName;
        })
        .catch(error => {
            console.error("Error fetching surah name:", error);
            surah_name_arabic.textContent = "Error fetching data";
            surah_name.textContent = "Error fetching data";
        });

    async function get_surah_name_arabic(surah_number) {
        try {
            const response = await fetch(quran_api + `${surah_number}.json`);
            const surah = await response.json();
            return surah.surahNameArabic;  // Ensure the API response has this property
        } catch (error) {
            console.error("Error fetching surah name:", error);
            return "Error fetching data";
        }
    }

    async function get_surah_name(surah_number) {
        try {
            const response = await fetch(quran_api + `${surah_number}.json`);
            const surah = await response.json();
            return surah.surahName;  // Ensure the API response has this property
        } catch (error) {
            console.error("Error fetching surah name:", error);
            return "Error fetching data";
        }
    }

    async function next_surah_name() {
        if (current_surah < 114){
            current_surah++;
            surah_name_arabic.textContent = await get_surah_name_arabic(current_surah);
            surah_name.textContent = await get_surah_name(current_surah);
        } else {
            current_surah = 1;
            surah_name_arabic.textContent = await get_surah_name_arabic(current_surah);
            surah_name.textContent = await get_surah_name(current_surah);
        }
    }

    async function back_surah_name() {
        if (current_surah > 1) {
            current_surah--;
            surah_name_arabic.textContent = await get_surah_name_arabic(current_surah);
            surah_name.textContent = await get_surah_name(current_surah);
        } else {
            current_surah = 114;
            surah_name_arabic.textContent = await get_surah_name_arabic(current_surah);
            surah_name.textContent = await get_surah_name(current_surah);
        }
    }


    next_button.addEventListener('click', next_surah_name);
    back_button.addEventListener('click', back_surah_name);
});