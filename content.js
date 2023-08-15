const observer = new MutationObserver(handleMutation);
observer.observe(document, { childList: true, subtree: true });

function handleMutation(mutationsList) {
    for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
            setVolume(volume);
        }
    }
}

function setVolume(volume) {
    const videoElement = document.querySelector("video");
    if (videoElement) {
        videoElement.volume = volume;
    }
}