const API_BASE = "https://quranapi.pages.dev/api/";

const el = {
    containerOne: document.getElementById("container-one"),
    containerTwo: document.getElementById("container-two"),
    ayahOneA: document.getElementById("container-one-ayah-one"),
    ayahOneB: document.getElementById("container-one-ayah-two"),
    ayahTwoA: document.getElementById("container-two-ayah-one"),
    ayahTwoB: document.getElementById("container-two-ayah-two"),
    surahDropdown: document.getElementById("surah-dropdown"),
    startButton: document.getElementById("generate-button"),
};

let correctPair = [];
let incorrectPair = [];

// ------------------ API ------------------

const fetchJSON = async (path) => {
    try {
        const res = await fetch(API_BASE + path);
        return await res.json();
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
};

const fetchAllSurahs = () => fetchJSON("surah.json");

const fetchSurahMeta = (surah) => fetchJSON(`${surah}.json`);

const fetchAyah = (surah, ayah) => fetchJSON(`${surah}/${ayah}.json`);

// ------------------ Helpers ------------------

const getSurah = () => el.surahDropdown.value;

const resetContainers = () => {
    [el.containerOne, el.containerTwo].forEach(container => {
        container.style.backgroundColor = "";
        container.classList.remove("correct", "incorrect");
        container.onclick = null;
    });
};

const highlightResult = (container, isCorrect) => {
    container.style.backgroundColor = isCorrect ? "#4caf50" : "#f44336";
};

// ------------------ Dropdown Setup ------------------

const populateDropdown = async () => {
    const surahs = await fetchAllSurahs();
    if (!surahs) return;

    el.surahDropdown.innerHTML = "";
    el.surahDropdown.appendChild(new Option("Choose a Surah", ""));

    surahs.forEach((surah, i) => {
        const label = `${i + 1}. ${surah.surahName} (${surah.surahNameArabic}) – ${surah.surahNameTranslation}`;
        el.surahDropdown.appendChild(new Option(label, i + 1));
    });
};

// ------------------ Generate Ayah Pairs ------------------

const getCorrectPair = async (surah) => {
    const max = await getAyahCount(surah);
    let n = Math.floor(Math.random() * (max - 1)) + 1;

    const ayah1 = await fetchAyah(surah, n);
    const ayah2 = await fetchAyah(surah, n + 1);
    return [ayah1 ?.arabic1, ayah2 ?.arabic1];
};

const getIncorrectPair = async (surah) => {
    const max = await getAyahCount(surah);
    let a = Math.floor(Math.random() * max) + 1;
    let b;
    do {
        b = Math.floor(Math.random() * max) + 1;
    } while (a === b);

    const ayah1 = await fetchAyah(surah, a);
    const ayah2 = await fetchAyah(surah, b);
    return [ayah1 ?.arabic1, ayah2 ?.arabic1];
};

const getAyahCount = async (surah) => {
    const meta = await fetchSurahMeta(surah);
    return meta ?.totalAyah || 1;
};

// ------------------ Display Logic ------------------

const renderPairs = () => {
    const correctFirst = Math.random() < 0.5;

    if (correctFirst) {
        el.ayahOneA.innerText = correctPair[0];
        el.ayahOneB.innerText = correctPair[1];
        el.ayahTwoA.innerText = incorrectPair[0];
        el.ayahTwoB.innerText = incorrectPair[1];

        el.containerOne.onclick = () => highlightResult(el.containerOne, true);
        el.containerTwo.onclick = () => highlightResult(el.containerTwo, false);
    } else {
        el.ayahOneA.innerText = incorrectPair[0];
        el.ayahOneB.innerText = incorrectPair[1];
        el.ayahTwoA.innerText = correctPair[0];
        el.ayahTwoB.innerText = correctPair[1];

        el.containerOne.onclick = () => highlightResult(el.containerOne, false);
        el.containerTwo.onclick = () => highlightResult(el.containerTwo, true);
    }
};

// ------------------ Init ------------------

document.addEventListener("DOMContentLoaded", populateDropdown);

el.startButton.addEventListener("click", async () => {
    resetContainers();
    correctPair = await getCorrectPair(getSurah());
    incorrectPair = await getIncorrectPair(getSurah());
    renderPairs();
});