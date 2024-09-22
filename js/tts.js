let selectedVoice = null;

function findVoice() {
    const voices = speechSynthesis.getVoices();
    // Try to find an Indian English voice
    selectedVoice = voices.find(voice => voice.lang === 'en-IN');
    
    // If no Indian English voice is found, fallback to a general English voice
    if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang === 'en-US' || voice.lang === 'en-GB');
    }
    
    // If still no voice is found, use the first available voice
    if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices[0];
    }
}

export function speak(text) {
    // If no voice has been selected yet, find one
    if (!selectedVoice) {
        findVoice();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set the selected voice
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }
    
    // Adjust the pitch and rate to sound more natural
    utterance.pitch = 1.1; // Slightly higher pitch
    utterance.rate = 0.9; // Slightly slower rate

    // Handle Hindi words or phrases
    if (/[\u0900-\u097F]/.test(text)) {
        // If Hindi characters are detected, try to use a Hindi voice
        const hindiVoice = speechSynthesis.getVoices().find(voice => voice.lang === 'hi-IN');
        if (hindiVoice) {
            utterance.voice = hindiVoice;
        }
    }

    window.speechSynthesis.speak(utterance);
}

// Initialize voices when they are loaded
speechSynthesis.onvoiceschanged = findVoice;