let lastSpokenText = "Welcome to AuraConnect. Tap a category or speak your query.";

function speak(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop any ongoing speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
        lastSpokenText = text;
    }
}

function stopSpeech() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
}

function replayLastAudio() {
    if (lastSpokenText) {
        speak(lastSpokenText);
    }
}

async function fetchService(category) {
    const outputBox = document.getElementById('output');
    outputBox.innerText = "Loading service details...";
    
    try {
        const res = await fetch('/api/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: category, query_text: "Button click: " + category })
        });
        const data = await res.json();
        outputBox.innerText = data.response;
        speak(data.response);
    } catch (err) {
        const errorMsg = "Error connecting to server. Please check your connection.";
        outputBox.innerText = errorMsg;
        speak(errorMsg);
    }
}

function startVoiceQuery() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const statusEl = document.getElementById('voice-status');
    const outputBox = document.getElementById('output');

    if (!SpeechRecognition) {
        alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        statusEl.innerText = "Listening... Speak clearly now.";
        speak("Listening");
    };

    recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript.toLowerCase();
        statusEl.innerText = "You said: \"" + speechToText + "\"";
        outputBox.innerText = "Processing voice query: " + speechToText + "...";

        let detectedCategory = "general";
        if (speechToText.includes('education') || speechToText.includes('school') || speechToText.includes('study') || speechToText.includes('learn')) {
            detectedCategory = 'education';
        } else if (speechToText.includes('health') || speechToText.includes('doctor') || speechToText.includes('hospital') || speechToText.includes('medical')) {
            detectedCategory = 'healthcare';
        } else if (speechToText.includes('job') || speechToText.includes('work') || speechToText.includes('employment') || speechToText.includes('career')) {
            detectedCategory = 'employment';
        }

        if (detectedCategory !== 'general') {
            fetchService(detectedCategory);
        } else {
            const fallback = "I heard: \"" + speechToText + "\". Please clearly mention Education, Healthcare, or Employment.";
            outputBox.innerText = fallback;
            speak(fallback);
        }
    };

    recognition.onerror = (event) => {
        statusEl.innerText = "Microphone error: " + event.error;
    };

    recognition.onend = () => {
        if (statusEl.innerText.includes("Listening")) {
            statusEl.innerText = "Microphone ready.";
        }
    };

    recognition.start();
}

async function loadHistory() {
    const historyBox = document.getElementById('history-box');
    historyBox.innerHTML = "<p class='placeholder-text'>Loading history...</p>";

    try {
        const res = await fetch('/api/history');
        const data = await res.json();
        
        if (data.length === 0) {
            historyBox.innerHTML = "<p class='placeholder-text'>No past interactions found in database.</p>";
            return;
        }

        let html = "";
        data.forEach(item => {
            html += `<div class="history-item">
                <strong>[${item.category.toUpperCase()}]</strong> ${item.response_text.substring(0, 75)}...
                <span class="history-time">${item.timestamp}</span>
            </div>`;
        });
        historyBox.innerHTML = html;
    } catch (err) {
        historyBox.innerHTML = "<p class='placeholder-text'>Failed to load history from database.</p>";
    }
}

function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
}

let currentFontSize = 1;
function adjustFontSize(direction) {
    currentFontSize += direction * 0.1;
    if (currentFontSize < 0.8) currentFontSize = 0.8;
    if (currentFontSize > 1.5) currentFontSize = 1.5;
    document.documentElement.style.setProperty('--font-size-base', currentFontSize + 'rem');
          }
