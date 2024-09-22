const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

export function startSpeechRecognition(processInput) {
    recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        processInput(result);
    };
    recognition.start();
}