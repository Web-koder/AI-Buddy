import { getRandomJoke } from './jokes.js';
import { startSpeechRecognition } from './speech.js';
import { speak } from './tts.js';

// Response databases
const responseDatabase = {
    food: [
        "Talking about food makes me crave some spicy biryani!",
        "Have you tried pani puri? It's an explosion of flavors!",
        "I could go for some butter chicken right now. Yum!"
    ],
    music: [
        "Nothing beats the rhythm of Bollywood music!",
        "Have you heard A.R. Rahman's latest composition?",
        "Let's have a quick dance party! Put on some bhangra!"
    ],
    greetings: [
        "Namaste! How can I brighten your day?",
        "Arre wah! Ready for some masti?",
        "Kaise ho? How's life treating you?"
    ],
    movies: [
        "Have you seen 'Lagaan'? What a classic!",
        "I love 'Dilwale Dulhania Le Jayenge'! Ja Simran, ja!",
        "Kitne aadmi the? Sorry, couldn't resist a Sholay reference!"
    ],
    weather: [
        "Is it hot, or is it just my circuits overheating? 😅",
        "Perfect weather for a cutting chai, don't you think?",
        "Rain or shine, mausam is always fine with good company!"
    ],
    jokes: [
        "Why did the dosa go to the gym? To get crispy!",
        "What do you call a desi ghost? Bhoot jalabi!",
        "Why don't scientists trust atoms? Because they make up everything!"
    ],
    default: [
        "Interesting! Tell me more about that.",
        "Hmm, that's a tough one. Can you elaborate?",
        "Wow, you've got me thinking now!"
    ]
};

responseDatabase.greetings.push(
    "Kaise ho, mere dost?",
    "Namaste! Aaj ka din kaisa raha?",
    "Arre, bahut time baad mile!"
);

responseDatabase.movies.push(
    "Yaar, Bollywood ke gaane kitne mast hote hain, hai na?",
    "Aaj kal ke movies mein woh baat nahi rahi, kya khayaal hai?",
    "Ek number! Bilkul blockbuster movie lag rahi hai!"
);

const hindiResponses = [
    "Arey baap re! Don't be shocked, I can speak Hindi too!",
    "Kabhi kabhi lagta hai apun hi bhagwan hai!",
    "Mogambo khush hua!",
    "Ek chutki sindoor ki keemat tum kya jaano Ramesh babu?",
    "Mere paas maa hai!",
    "Arey yaar! Kya baat hai?",
    "Arre wah! Kya idea hai!",
    "Bilkul sahi kaha aapne!",
    "Ekdum mast!",
    "Chalo, aage kya plan hai?",
    "Kuch naya batao yaar!",
    "Picture abhi baaki hai mere dost!"
];

const englishResponses = [
    "How's the josh? High, sir!",
    "You know, sometimes I feel like saying 'Kitne aadmi the?'",
    "Let me channel my inner Babu Rao for a moment...",
    "Aal izz well, my friend!",
    "That's awesome, buddy!",
    "You're totally right, yaar!",
    "Oh man, that's interesting!",
    "Wow, I didn't know that!",
    "Hey, tell me more about it!",
    "That's so cool, dost!",
    "Tension lene ka nahi, sirf dene ka!"
];

const games = {
    wordGuess: {
        words: ['bollywood', 'cricket', 'chai', 'diwali', 'taj mahal'],
        currentWord: '',
        guessedLetters: [],
        maxAttempts: 6,
        attempts: 0
    }
};

const triviaQuestions = [
    { question: "What is the capital of India?", answer: "New Delhi" },
    { question: "Which river is considered holy in Hinduism?", answer: "Ganges" },
    { question: "Who is known as the 'Father of the Nation' in India?", answer: "Mahatma Gandhi" }
];

const quotes = [
    "Zindagi badi honi chahiye, lambi nahi.",
    "Kabhi kabhi jeetne ke liye kuch haarna padta hai.",
    "Ek chutki sindoor ki keemat tum kya jaano Ramesh babu?",
    "Bade bade deshon mein aisi choti choti baatein hoti rehti hai."
];

const movieDatabase = [
    { title: "Dilwale Dulhania Le Jayenge", genre: "Romance" },
    { title: "Lagaan", genre: "Drama" },
    { title: "3 Idiots", genre: "Comedy" },
    { title: "Sholay", genre: "Action" },
    { title: "Kabhi Khushi Kabhie Gham", genre: "Family Drama" },
    { title: "Andaz Apna Apna", genre: "Comedy" },
    { title: "Mughal-e-Azam", genre: "Historical Drama" },
    { title: "Gully Boy", genre: "Musical Drama" }
];

const festivals = [
    { name: "Diwali", date: "November 12, 2023" },
    { name: "Holi", date: "March 8, 2024" },
    { name: "Eid al-Fitr", date: "April 10, 2024" },
    { name: "Durga Puja", date: "October 20, 2023" },
    { name: "Ganesh Chaturthi", date: "September 19, 2023" },
    { name: "Navratri", date: "October 15, 2023" }
];

const songLyrics = [
    { song: "Kal Ho Naa Ho", lyrics: "Har ghadi badal rahi hai roop zindagi, Chaav hai kahi kahi hai dhoop zindagi" },
    { song: "Chak De India", lyrics: "Chak De India! Chak De India! Taane maare flyian te, Aaja karle try me" },
    { song: "Kabhi Khushi Kabhie Gham", lyrics: "It's all about loving your parents, Kabhi Khushi Kabhie Gham" },
    { song: "Ae Dil Hai Mushkil", lyrics: "Tu safar mera, hai tu hi meri manzil, Tere bina guzara, ae dil hai mushkil" }
];

let chatHistory = [];
let outputDiv;
let currentContext = '';
let learnedResponses = {};
let userPreferences = {
    name: '',
    favoriteMovie: '',
    favoriteDish: ''
};
let currentTriviaQuestion = null;

function startWordGuessGame() {
    games.wordGuess.currentWord = games.wordGuess.words[Math.floor(Math.random() * games.wordGuess.words.length)];
    games.wordGuess.guessedLetters = [];
    games.wordGuess.attempts = 0;
    return "Let's play a word guessing game! The word is related to India. You have 6 attempts. Guess a letter:";
}

function playWordGuessGame(letter) {
    if (games.wordGuess.guessedLetters.includes(letter)) {
        return "You've already guessed that letter. Try another one!";
    }
    
    games.wordGuess.guessedLetters.push(letter);
    if (!games.wordGuess.currentWord.includes(letter)) {
        games.wordGuess.attempts++;
    }
    
    let displayWord = games.wordGuess.currentWord.split('').map(char => 
        games.wordGuess.guessedLetters.includes(char) ? char : '_'
    ).join(' ');
    
    if (!displayWord.includes('_')) {
        return `Congratulations! You've guessed the word: ${games.wordGuess.currentWord}`;
    } else if (games.wordGuess.attempts >= games.wordGuess.maxAttempts) {
        return `Sorry, you're out of attempts. The word was: ${games.wordGuess.currentWord}`;
    } else {
        return `Word: ${displayWord}\nAttempts left: ${games.wordGuess.maxAttempts - games.wordGuess.attempts}`;
    }
}

function startTriviaGame() {
    currentTriviaQuestion = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
    return `Let's play a trivia game! ${currentTriviaQuestion.question}`;
}

function checkTriviaAnswer(input) {
    if (input.toLowerCase() === currentTriviaQuestion.answer.toLowerCase()) {
        currentTriviaQuestion = null;
        return "Correct! Well done. Want to play again? Just say 'trivia game'.";
    } else {
        return "Sorry, that's not correct. Try again!";
    }
}

function learnNewResponse(keyword, response) {
    if (!learnedResponses[keyword]) {
        learnedResponses[keyword] = [];
    }
    learnedResponses[keyword].push(response);
}

function askFollowUpQuestion() {
    const questions = [
        "What do you think about that?",
        "Can you tell me more?",
        "How does that make you feel?",
        "What's your favorite part about it?"
    ];
    return getRandomCategoryResponse(questions);
}

function rememberUserPreference(key, value) {
    userPreferences[key] = value;
}

function getPersonalizedResponse() {
    if (userPreferences.name && Math.random() < 0.3) {
        if (userPreferences.favoriteMovie) {
            return `By the way ${userPreferences.name}, I remember you like ${userPreferences.favoriteMovie}. Have you watched any similar movies lately? `;
        } else if (userPreferences.favoriteDish) {
            return `Hey ${userPreferences.name}, I recall you enjoy ${userPreferences.favoriteDish}. Had any good food recently? `;
        } else {
            return `${userPreferences.name}, it's always a pleasure chatting with you! `;
        }
    }
    return '';
}

function analyzeSentiment(input) {
    const positiveWords = ['happy', 'glad', 'excited', 'love', 'enjoy', 'fantastic'];
    const negativeWords = ['sad', 'upset', 'angry', 'hate', 'dislike', 'terrible'];
    
    let score = 0;
    const words = input.toLowerCase().split(' ');
    
    words.forEach(word => {
        if (positiveWords.includes(word)) score++;
        if (negativeWords.includes(word)) score--;
    });
    
    return score;
}

function shareQuote() {
    return "Here's a famous Bollywood quote for you: " + quotes[Math.floor(Math.random() * quotes.length)];
}

function recommendMovie(genre) {
    const matchingMovies = movieDatabase.filter(movie => movie.genre.toLowerCase() === genre.toLowerCase());
    if (matchingMovies.length > 0) {
        const movie = matchingMovies[Math.floor(Math.random() * matchingMovies.length)];
        return `For ${genre}, I recommend watching "${movie.title}". It's a great ${movie.genre} movie!`;
    } else {
        return `I'm sorry, I don't have any recommendations for ${genre} movies right now. How about trying a different genre?`;
    }
}

function getUpcomingFestival() {
    const today = new Date();
    const upcomingFestivals = festivals.filter(festival => new Date(festival.date) > today);
    if (upcomingFestivals.length > 0) {
        const nextFestival = upcomingFestivals.reduce((a, b) => new Date(a.date) < new Date(b.date) ? a : b);
        return `The next upcoming festival is ${nextFestival.name} on ${nextFestival.date}. Are you excited?`;
    } else {
        return "I don't have information about upcoming festivals right now. But every day is a celebration with friends!";
    }
}

function getRandomLyrics() {
    const randomSong = songLyrics[Math.floor(Math.random() * songLyrics.length)];
    return `Here's a line from "${randomSong.song}": ${randomSong.lyrics}`;
}

function getRandomCategoryResponse(category) {
    return category[Math.floor(Math.random() * category.length)];
}

function getRandomHindiEnglishResponse() {
    if (Math.random() < 0.5) {
        return hindiResponses[Math.floor(Math.random() * hindiResponses.length)];
    } else {
        return englishResponses[Math.floor(Math.random() * englishResponses.length)];
    }
}

function addEmojiReaction(response) {
    const happyEmojis = ['😊', '😄', '😃', '🙂', '😁'];
    const sadEmojis = ['😔', '😢', '🙁', '😞', '😟'];
    
    const sentiment = analyzeSentiment(response);
    let emoji = '';
    
    if (sentiment > 0) {
        emoji = happyEmojis[Math.floor(Math.random() * happyEmojis.length)];
    } else if (sentiment < 0) {
        emoji = sadEmojis[Math.floor(Math.random() * sadEmojis.length)];
    }
    
    return emoji ? `${response} ${emoji}` : response;
}

function processInput(input) {
    input = input.trim().toLowerCase();
    let response;

    if (input.startsWith('learn:')) {
        const [_, keyword, ...responseParts] = input.split(' ');
        const newResponse = responseParts.join(' ');
        learnNewResponse(keyword, newResponse);
        response = `Great! I've learned a new response for "${keyword}".`;
    } else if (input.startsWith('play word game')) {
        response = startWordGuessGame();
    } else if (games.wordGuess.currentWord && input.length === 1) {
        response = playWordGuessGame(input);
    } else if (input === 'trivia game') {
        response = startTriviaGame();
    } else if (currentTriviaQuestion) {
        response = checkTriviaAnswer(input);
    } else if (input.includes('share a quote')) {
        response = shareQuote();
    } else if (input.includes('recommend') && input.includes('movie')) {
        const genre = input.split('movie')[1].trim();
        response = recommendMovie(genre);
    } else if (input.includes('festival') || input.includes('celebration')) {
        response = getUpcomingFestival();
    } else if (input.includes('song') || input.includes('lyrics')) {
        response = getRandomLyrics();
    } else {
        // Check learned responses first
        for (const keyword in learnedResponses) {
            if (input.includes(keyword)) {
                response = getRandomCategoryResponse(learnedResponses[keyword]);
                break;
            }
        }
        // If no learned response, continue with existing logic
        if (!response) {
            if (input.includes('my name is')) {
                const name = input.split('my name is')[1].trim();
                rememberUserPreference('name', name);
                response = `Nice to meet you, ${name}! I'll remember that.`;
            } else if (input.includes('favorite movie is')) {
                const movie = input.split('favorite movie is')[1].trim();
                rememberUserPreference('favoriteMovie', movie);
                response = `${movie} is a great choice! I'll keep that in mind.`;
            } else if (input.includes('favorite dish is')) {
                const dish = input.split('favorite dish is')[1].trim();
                rememberUserPreference('favoriteDish', dish);
                response = `Yum! ${dish} sounds delicious. I'll remember that you like it.`;
            } else if (currentContext === 'movie' && !input.match(/\b(hi|hello|hey|namaste)\b/)) {
                response = "Speaking of movies, " + getRandomCategoryResponse(responseDatabase.movies);
            } else {
                if (input.match(/\b(hi|hello|hey|namaste)\b/)) {
                    response = getRandomCategoryResponse(responseDatabase.greetings);
                } else if (input.includes('movie') || input.includes('film')) {
                    response = getRandomCategoryResponse(responseDatabase.movies);
                } else if (input.includes('weather') || input.includes('climate')) {
                    response = getRandomCategoryResponse(responseDatabase.weather);
                } else if (input.includes('joke') || input.includes('funny')) {
                    response = getRandomJoke();
                } else if (input.includes('who are you') || input.includes('who are u')) {
                    response = "I'm your AI Buddy, a chatbot with a dash of Bollywood flavor!";
                } else if (input.includes('why')) {
                    response = "Why not? As they say in India, 'Kuch toh log kahenge, logon ka kaam hai kehna!'";
                } else if (input.length < 5) {
                    response = "Could you elaborate a bit more? I'm all ears!";
                } else {
                    response = getRandomCategoryResponse(responseDatabase.default);
                }
            }
        }
    }

    if (input.includes('movie') || input.includes('film')) {
        currentContext = 'movie';
    } else {
        currentContext = '';
    }

    response = getPersonalizedResponse() + response;

    const sentiment = analyzeSentiment(input);
    if (sentiment > 0) {
        response += " I'm glad you're feeling positive!";
    } else if (sentiment < 0) {
        response += " I hope things get better soon.";
    }

    if (Math.random() < 0.3) {  // 30% chance to use Hindi/English responses
        response = getRandomHindiEnglishResponse();
    }

    if (Math.random() < 0.3) {  // 30% chance to ask a follow-up question
        response += " " + askFollowUpQuestion();
    }
    
    response = addEmojiReaction(response);
    
    displayMessage('User', input);
    delayedResponse(response);
}

function showTypingIndicator() {
    const typingIndicator = document.createElement('p');
    typingIndicator.id = 'typing-indicator';
    typingIndicator.textContent = 'AI Buddy is typing...';
    outputDiv.appendChild(typingIndicator);
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function delayedResponse(response, delay = 1000) {
    showTypingIndicator();
    setTimeout(() => {
        hideTypingIndicator();
        displayMessage('AI Buddy', response);
        speak(response); // Add text-to-speech for AI Buddy's responses
    }, delay);
}

function displayMessage(sender, message) {
    const messageElement = document.createElement('p');
    messageElement.textContent = `${sender}: ${message}`;
    outputDiv.appendChild(messageElement);
    updateChatHistory(sender, message);
    outputDiv.scrollTop = outputDiv.scrollHeight;
}

function updateChatHistory(sender, message) {
    chatHistory.push({ sender, message });
    if (chatHistory.length > 50) {
        chatHistory.shift();
    }
}

function clearChat() {
    outputDiv.innerHTML = '';
    displayMessage('AI Buddy', "Chat cleared! What shall we talk about now?");
}

document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const voiceInputBtn = document.getElementById('voice-input-btn');
    const clearChatBtn = document.getElementById('clear-chat');
    const sendBtn = document.getElementById('send-btn');
    outputDiv = document.getElementById('ai-buddy-output');

    sendBtn.addEventListener('click', () => {
        const input = textInput.value;
        if (input.trim() !== '') {
            processInput(input);
            textInput.value = '';
        }
    });

    textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            processInput(textInput.value);
            textInput.value = '';
        }
    });

    voiceInputBtn.addEventListener('click', () => startSpeechRecognition(processInput));
    clearChatBtn.addEventListener('click', clearChat);

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
        });
    }

    // Language switcher
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            currentLanguage = e.target.value;
            // You would need to update all displayed text here
        });
    }

    // Feature showcase buttons
    document.querySelectorAll('.feature-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const feature = btn.dataset.feature;
            let message = '';
            switch(feature) {
                case 'word-game':
                    message = 'play word game';
                    break;
                case 'trivia':
                    message = 'trivia game';
                    break;
                case 'quote':
                    message = 'share a quote';
                    break;
                case 'movie':
                    message = 'recommend a comedy movie';
                    break;
                case 'festival':
                    message = 'upcoming festival';
                    break;
                case 'lyrics':
                    message = 'song lyrics';
                    break;
            }
            processInput(message);
        });
    });

    // Welcome message
    displayMessage('AI Buddy', "Hello! I'm your friendly AI buddy. Ready for some fun conversation?");
});