console.log("Script loaded successfully!");

// Modify the loadTranslation function to include the German original sentences and speaker's name
async function loadTranslation(language) {
    try {
        const response = await fetch(`18004-session-${language}.json`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(`Data fetched successfully for ${language}:`, data);

        const sessionContainer = document.querySelector('.session-container');
        if (!sessionContainer) {
            throw new Error('Session container not found');
        }

        // Clear previous content
        sessionContainer.innerHTML = '';

        data.data.forEach(part => {
            part.textContents.forEach(content => {
                // Check if speaker's name exists and add it if available
                if (content.textBody && content.textBody.length > 0 && content.textBody[0].speaker) {
                    const speaker = document.createElement('div');
                    speaker.classList.add('speaker');
                    speaker.textContent = content.textBody[0].speaker;
                    sessionContainer.appendChild(speaker);
                }

                content.textBody.forEach(body => {
                    body.sentences.forEach(sentence => {
                        const speech = document.createElement('div');
                        speech.classList.add('speech');

                        const translatedText = document.createElement('div');
                        translatedText.classList.add('translated-text');
                        translatedText.textContent = sentence.text;
                        speech.appendChild(translatedText);

                        // Append the German original sentence as a sibling to the translated sentence
                        const germanSentence = document.createElement('div');
                        germanSentence.classList.add('german-sentence');
                        germanSentence.textContent = body.text;
                        speech.appendChild(germanSentence);

                        sessionContainer.appendChild(speech);
                    });
                });
            });
        });
    } catch (error) {
        console.error(`Error fetching or parsing data for ${language}:`, error);
    }
}

// Function to get available language versions
async function getAvailableLanguages() {
    const availableLanguages = [];

    // Language codes for the 20 most popular languages
    const languageCodes = [
        'en', 'zh', 'hi', 'es', 'fr', 'ar', 'bn', 'ru', 'pt', 'id',
        'ur', 'ja', 'de', 'sw', 'tr', 'vi', 'ko', 'it', 'pl', 'uk'
    ];

    // Fetch data for each language code and wait for all requests to complete
    await Promise.all(languageCodes.map(async language => {
        try {
            const response = await fetch(`18004-session-${language}.json`);
            if (response.ok) {
                availableLanguages.push(language);
            }
        } catch (error) {
            console.error(`Error fetching data for ${language}:`, error);
        }
    }));

    return availableLanguages;
}

// Load initial translation
async function initialize() {
    const availableLanguages = await getAvailableLanguages();
    if (availableLanguages.length > 0) {
        const languageSelect = document.getElementById('language-select');
        availableLanguages.forEach(language => {
            const option = document.createElement('option');
            option.value = language;
            option.textContent = language.toUpperCase(); // Display language code in uppercase
            languageSelect.appendChild(option);
        });

        loadTranslation(availableLanguages[0]); // Load translation for the first available language

        // Add event listener to language select
        languageSelect.addEventListener('change', function() {
            const selectedLanguage = this.value;
            loadTranslation(selectedLanguage);
        });
    } else {
        console.error('No available languages found.');
    }
}

initialize();

