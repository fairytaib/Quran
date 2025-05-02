const API_BASE = "https://quranapi.pages.dev/api/";

const el = {
    randomBtn: document.getElementById("get-random-ayah-button"),
    showAnswerBtn: document.getElementById("show-answer-button"),
    surahDropdown: document.getElementById("surah-dropdown"),
    startAyah: document.getElementById("start-ayah"),
    endAyah: document.getElementById("end-ayah"),
    previous: document.getElementById("previous-ayah"),
    current: document.getElementById("ayah-arabic"),
    following: document.getElementById("following-ayah"),
    english: document.getElementById("ayah-english"),
    englishPrev: document.getElementById("ayah-english-previous"),
    englishNext: document.getElementById("ayah-english-following")
};

// --------------------------- Helpers ---------------------------

const getSurahNumber = () => el.surahDropdown.value;

const limitAyahRange = () => {
    const start = parseInt(el.startAyah.value);
    const end = parseInt(el.endAyah.value);
    if (start > end) el.startAyah.value = end;
    return [start, end];
};

const randomAyah = ([start, end]) =>
    Math.floor(Math.random() * (end - start + 1)) + start;

const fetchJSON = async (path) => {
    try {
        const response = await fetch(API_BASE + path);
        return await response.json();
    } catch (err) {
        console.error("Fetch error:", err);
        return null;
    }
};

// --------------------------- API Wrappers ---------------------------

const fetchAllSurahs = () => fetchJSON("surah.json");

const fetchSurahData = (surah) => fetchJSON(`${surah}.json`);

const fetchAyah = (surah, ayah) => fetchJSON(`${surah}/${ayah}.json`);

const fetchAyahAmount = async (surah) => {
    const data = await fetchSurahData(surah);
    return data?.totalAyah || 1;
};

// --------------------------- Populate UI ---------------------------

const populateDropdown = async () => {
    const surahs = await fetchAllSurahs();
    if (!surahs) return;

    el.surahDropdown.innerHTML = "";
    el.surahDropdown.appendChild(new Option("Choose a Surah", ""));

    surahs.forEach((surah, i) => {
        const text = `${i + 1}. ${surah.surahName} (${surah.surahNameArabic}) – ${surah.surahNameTranslation}`;
        el.surahDropdown.appendChild(new Option(text, i + 1));
    });
};

const updateEndAyahField = async (surah) => {
    el.endAyah.value = await fetchAyahAmount(surah);
    el.randomBtn.classList.toggle("disabled");
    el.showAnswerBtn.classList.toggle("disabled");
};

// --------------------------- Display Logic ---------------------------

const displayRandomAyah = async () => {
    const surah = getSurahNumber();
    const range = limitAyahRange();
    const ayahNum = randomAyah(range);
    const ayahData = await fetchAyah(surah, ayahNum);

    el.previous.textContent = "";
    el.current.textContent = ayahData?.arabic1 || "❌ Arabic not found";
    el.following.textContent = "";
    el.english.textContent = ayahData?.english || "❌ English not found";
    el.englishPrev.textContent = "";
    el.englishNext.textContent = "";

    replaceShowAnswerHandler(surah, ayahNum);
};

const replaceShowAnswerHandler = (surah, ayahNum) => {
    const newBtn = el.showAnswerBtn.cloneNode(true);
    el.showAnswerBtn.parentNode.replaceChild(newBtn, el.showAnswerBtn);
    el.showAnswerBtn = newBtn;

    el.showAnswerBtn.addEventListener("click", async () => {
        const maxAyah = await fetchAyahAmount(surah);
        const [prevData, nextData] = await Promise.all([
            ayahNum > 1 ? fetchAyah(surah, ayahNum - 1) : null,
            ayahNum < maxAyah ? fetchAyah(surah, ayahNum + 1) : null
        ]);

        el.previous.textContent = prevData?.arabic1 || "";
        el.following.textContent = nextData?.arabic1 || "";
        el.englishPrev.textContent = prevData?.english || "";
        el.englishNext.textContent = nextData?.english || "";
    });
};

// --------------------------- Init ---------------------------

document.addEventListener("DOMContentLoaded", () => {
    populateDropdown();
    el.surahDropdown.addEventListener("change", () =>
        updateEndAyahField(getSurahNumber())
    );
    el.randomBtn.addEventListener("click", displayRandomAyah);
});
