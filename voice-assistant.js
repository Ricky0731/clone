class VoiceAssistant {
    constructor() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.showError("Voice recognition is not supported in this browser. Please use Chrome.");
            return;
        }

        this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        
        // Gemini API key
        this.apiKey = 'AIzaSyDSmJBRoyMgFEBm-uqGwJPzKZiZVxSJ5DY';
        
        this.setupRecognition();
    }

    setupRecognition() {
        this.recognition.continuous = false;
        this.recognition.lang = 'en-US';
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;

        this.recognition.onstart = () => {
            this.showMessage("Listening... Ask anything about Vel Tech University");
            this.updateButtonState(true);
        };

        this.recognition.onresult = async (event) => {
            const query = event.results[0][0].transcript;
            this.showMessage(`You asked: ${query}`);
            await this.getGeminiResponse(query);
        };

        this.recognition.onerror = (event) => {
            if (event.error === 'no-speech') {
                this.showError("No speech was detected. Please try again.");
            } else if (event.error === 'audio-capture') {
                this.showError("No microphone was found. Ensure it is plugged in and allowed.");
            } else if (event.error === 'not-allowed') {
                this.showError("Microphone permission was denied. Please allow access to use voice assistant.");
            } else {
                this.showError("Error occurred during recognition. Please try again.");
            }
            this.updateButtonState(false);
        };

        this.recognition.onend = () => {
            this.updateButtonState(false);
        };
    }

    async getGeminiResponse(query) {
        try {
            const prompt = `
                You are a helpful assistant for Vel Tech University in Chennai, India. 
                Answer the following question about the university: "${query}"
                
                Important guidelines:
                1. Provide only the direct answer without any formatting or symbols
                2. Keep responses natural and conversational
                3. Don't use markdown, asterisks, or any special characters
                4. Don't mention that you are an AI or assistant
                5. Just give the information directly
                
                Please respond in simple text format.
            `;

            const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=' + this.apiKey, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                let answer = data.candidates[0].content.parts[0].text;
                
                // Clean up the response
                answer = this.cleanResponse(answer);
                
                this.showMessage(answer);
                this.speak(answer);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = "I'm having trouble getting that information right now. Please try again.";
            this.showError(errorMessage);
            this.speak(errorMessage);
        }
    }

    cleanResponse(text) {
        // Remove markdown symbols and clean up the text
        return text
            .replace(/\*\*/g, '') // Remove bold markers
            .replace(/\*/g, '')   // Remove italic markers
            .replace(/`/g, '')    // Remove code markers
            .replace(/#{1,6}\s/g, '') // Remove headers
            .replace(/\n/g, ' ')  // Replace newlines with spaces
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/^\s+|\s+$/g, '') // Trim start and end
            .replace(/\[|\]/g, '') // Remove square brackets
            .replace(/\(|\)/g, '') // Remove parentheses
            .replace(/>/g, '')    // Remove blockquotes
            .replace(/•/g, '')    // Remove bullet points
            .replace(/[\u2022\u2023\u2043]/g, '') // Remove various bullet point characters
            .trim();
    }

    speak(text) {
        this.synthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        this.synthesis.speak(utterance);
    }

    showMessage(text) {
        const responseDiv = document.getElementById('assistant-response');
        responseDiv.textContent = text;
        responseDiv.style.display = 'block';
        responseDiv.style.backgroundColor = '#f0f8ff';
        responseDiv.style.padding = '15px';
        responseDiv.style.borderRadius = '5px';
        responseDiv.style.marginTop = '10px';
        
        setTimeout(() => {
            if (responseDiv.textContent === text) {
                responseDiv.style.display = 'none';
            }
        }, 15000);
    }

    showError(text) {
        const responseDiv = document.getElementById('assistant-response');
        responseDiv.textContent = text;
        responseDiv.style.display = 'block';
        responseDiv.style.backgroundColor = '#ffebee';
        responseDiv.style.color = '#c62828';
        responseDiv.style.padding = '15px';
        responseDiv.style.borderRadius = '5px';
        responseDiv.style.marginTop = '10px';
        
        setTimeout(() => {
            responseDiv.style.display = 'none';
            responseDiv.style.backgroundColor = '#f0f8ff';
            responseDiv.style.color = 'inherit';
        }, 5000);
    }

    toggleListening() {
        if (!this.recognition) {
            this.showError("Voice recognition is not supported in this browser. Please use Chrome.");
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        } else {
            try {
                this.recognition.start();
                this.isListening = true;
            } catch (error) {
                console.error('Recognition error:', error);
                this.showError("Error starting voice recognition. Please try again.");
            }
        }
    }

    updateButtonState(isListening) {
        const button = document.getElementById('voice-assistant-btn');
        const icon = button.querySelector('i');
        
        if (isListening) {
            icon.className = 'fas fa-stop';
            button.classList.add('listening');
        } else {
            icon.className = 'fas fa-microphone';
            button.classList.remove('listening');
        }
    }
}

// Initialize voice assistant when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.voiceAssistant = new VoiceAssistant();
});
