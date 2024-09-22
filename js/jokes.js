const jokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "Why did the scarecrow win an award? He was outstanding in his field!",
    "Why don't eggs tell jokes? They'd crack each other up!",
    "Why did the math book look so sad? Because it had too many problems.",
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "Why did the computer go to the doctor? It had a virus!",
    "Why don't skeletons fight each other? They don't have the guts.",
    "What do you call fake spaghetti? An impasta!",
    "Why did the cookie go to the doctor? Because it was feeling crumbly.",
    "Why did the bicycle fall over? Because it was two-tired!"
];

export function getRandomJoke() {
    return jokes[Math.floor(Math.random() * jokes.length)];
}