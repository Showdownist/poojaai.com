// Initialize speech synthesis and speech recognition
const synth = window.speechSynthesis;
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true; // Keep listening continuously
recognition.interimResults = false; // Only finalize results

let isListeningForProblems = false;

// Function to speak a given text
function speak(text, callback) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = callback || (() => {});
    synth.speak(utterance);
}

// Function to start or restart listening for user input
function startListening() {
    recognition.start();
    console.log("Listening...");
}

// Function to handle recognition results
recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
    console.log("Heard:", transcript);

    if (!isListeningForProblems) {
        if (transcript.includes("yes")) {
            isListeningForProblems = true;
            speak("Okay, I am listening.", startListening);
        } else if (transcript.includes("exit")) {
            speak("Goodbye, Dear. Take care!", () => recognition.stop());
        } else if (transcript.includes("thanks")) {
            speak("You're welcome, Dear! I'm always here for you.", startListening);
        } else {
            speak("Please say 'yes' if you want me to listen, or 'exit' to quit.", startListening);
        }
    } else {
        if (transcript.includes("Pooja stop")) {
            isListeningForProblems = false;
            speak("I heard everything. I understand your problem, and I know you have the ability to overcome it. I believe in you.", () => {
                speak("Do you want me to continue listening?", startListening);
            });
        } else if (transcript.includes("exit")) {
            speak("Goodbye, Dear. Take care!", () => recognition.stop());
        }
    }
};

// Handle errors gracefully
recognition.onerror = (event) => {
    console.error("Recognition error:", event.error);
    speak("", startListening);
};

// Restart listening when recognition ends unexpectedly
recognition.onend = () => {
    if (isListeningForProblems) {
        startListening();
    } else {
        console.log("Stopped listening.");
    }
};

// Initial greeting and activation
speak("Pooja Emotional Support Artificial Intelligence for listening activated. Welcome, Dear!", () => {
    speak("Do you want me to listen to your problems?", startListening);
});
