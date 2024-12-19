'use client';
import TypingGame from '@/components/Typing';
import { useState, useEffect } from 'react';
import { getWords, WordEntry } from '@components/SetUp';
import { useRouter } from 'next/navigation';
import { KanaRomanMap, convertYomiToRoman } from '@components/RegisterAlphabet';

export default function Game() {
    const TIME_LIMIT = 60;
    const router = useRouter();
    const words: WordEntry[] = getWords();
    const [romanMap, setRomanMap] = useState<KanaRomanMap[]>([]);
    const [currentWord, setCurrentWord] = useState<WordEntry | null>(null);
    const [currentRoman, setCurrentRoman] = useState<string>('');
    const [gameResult, setGameResult] = useState<{
        wordCount: number, 
        totalCharacters: number
    } | null>(null);
    const [timeRemaining, setTimeRemaining] = useState(60);
    const [isGameActive, setIsGameActive] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [totalCharacters, setTotalCharacters] = useState(0);

    useEffect(() => {
        const savedRomanMap = localStorage.getItem('romanMap');
        if (savedRomanMap) {
            const parsedRomanMap = JSON.parse(savedRomanMap);
            setRomanMap(parsedRomanMap);
            if (parsedRomanMap.length > 0) {
                selectRandomWord(parsedRomanMap);
            }
        } else {
            router.push('/');
        }
    }, []);

    // Timer effect
    useEffect(() => {
        let timerId: NodeJS.Timeout;
        
        if (isGameActive && timeRemaining > 0) {
            timerId = setTimeout(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);
        } else if (timeRemaining === 0) {
            endGame();
        }

        return () => {
            if (timerId) clearTimeout(timerId);
        };
    }, [isGameActive, timeRemaining]);

    // Function to start the game
    const startGame = () => {
        setWordCount(0);
        setTotalCharacters(0);
        setIsGameActive(true);
        setGameResult(null);
        setTimeRemaining(TIME_LIMIT);
        selectRandomWord(romanMap);
    };

    // Function to end the game
    const endGame = () => {
        setIsGameActive(false);
        // You can modify this to track total characters and words completed
        setGameResult({
            wordCount: wordCount, // This will need to be tracked during gameplay
            totalCharacters: totalCharacters // This will need to be tracked during gameplay
        });
    };

    // Function to handle game restart
    const handleRestart = () => {
        startGame();
        // router.replace('/game');
    };

    // Function to select a random word from the list
    const selectRandomWord = (roman_map: KanaRomanMap[]) => {
        const randomIndex = Math.floor(Math.random() * words.length);
        let newWord = words[randomIndex];
        const newRoman = convertYomiToRoman(newWord.yomi, roman_map);
        while (newWord === currentWord) {
            newWord = words[Math.floor(Math.random() * words.length)];
        }
        console.log(newWord);
        setCurrentWord(newWord);
        setCurrentRoman(newRoman);
    };

    // Function to handle moving to next word after successful typing
    const handleWordComplete = () => {
        if (isGameActive) {
            setWordCount(wordCount + 1);
            setTotalCharacters(totalCharacters + currentRoman.length);
            selectRandomWord(romanMap);
        }
    };

    // If no words are loaded, show loading
    if (!currentWord) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            {!isGameActive && !gameResult ? (
                <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-4">Typing Game</h2>
                    <p className="mb-4">制限時間60秒</p>
                    <button 
                        onClick={startGame}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                        Start Game
                    </button>
                </div>
            ) : !gameResult ? (
                <div>
                    <div className="mb-4 text-center">
                        <span className="text-xl font-bold">Time Remaining: {timeRemaining} seconds</span>
                    </div>
                    <TypingGame 
                        targetText={currentRoman}
                        wordInfo={currentWord}
                        onComplete={handleWordComplete}
                    />
                </div>
            ) : (
                <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
                    <div className="mb-4">
                        <p className="text-lg">Words Completed: 
                            <span className="font-bold ml-2">{gameResult.wordCount}</span>
                        </p>
                        <p className="text-lg">Total Characters Typed: 
                            <span className="font-bold ml-2">{gameResult.totalCharacters}</span>
                        </p>
                    </div>
                    <button 
                        onClick={handleRestart}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Play Again
                    </button>
                </div>
            )}
        </div>
    );
}
