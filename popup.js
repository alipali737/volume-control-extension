let currentVolume = 50;
let debounceTimeout;

chrome.tabs.query({ active: true, currentWindow: true}, function (tabs) {
    const tab = tabs[0];
    const volumeSlider = document.getElementById("volumeSlider");
    const sliderValue = document.getElementById("sliderValue");

    chrome.storage.local.get(["sliderValue"], function (result) {
        currentVolume = result.sliderValue || 50;
        volumeSlider.value = currentVolume;
        sliderValue.textContent = currentVolume;

        updateVolume(currentVolume);
    });

    volumeSlider.addEventListener("input", (event) => {
        const newVolume = parseInt(event.target.value);
        currentVolume = newVolume;
        sliderValue.textContent = newVolume;

        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            chrome.storage.local.set({ sliderValue: newVolume });
            updateVolume(newVolume);
        }, 500);
    });
});

function updateVolume(volume) {
    const normalisedVolume = volume / 1000;
    chrome.tabs.query({ active: true, currentWindow: true}, function (tabs) {
        const tab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: setVolume,
            args: [normalisedVolume]
        });
    });
}

function setVolume(volume) {
    const videoElement = document.querySelector("video");
    if (videoElement) {
        videoElement.volume = volume;
    }
}