'use client';
import TypingGame from '@/components/Typing';
import { useState, useEffect } from 'react';
import { getWords, WordEntry } from '@components/SetUp';
import { useRouter } from 'next/navigation';
import { KanaRomanMap, convertYomiToRoman } from '@components/RegisterAlphabet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Award, KeyboardIcon, RotateCcw } from 'lucide-react';

export default function Game() {
    const TIME_LIMIT = 60;
    const router = useRouter();
    const words: WordEntry[] = getWords();
    const [romanMap, setRomanMap] = useState<KanaRomanMap[]>([]);
    const [currentWord, setCurrentWord] = useState<WordEntry | null>(null);
    const [currentRoman, setCurrentRoman] = useState<string>('');
    const [gameResult, setGameResult] = useState<{
        wordCount: number, 
        totalCharacters: number,
        accuracy: number
    } | null>(null);
    const [timeRemaining, setTimeRemaining] = useState(60);
    const [isGameActive, setIsGameActive] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [totalCharacters, setTotalCharacters] = useState(0);
    const [totalMistakes, setTotalMistakes] = useState(0);

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

    const startGame = () => {
        setWordCount(0);
        setTotalCharacters(0);
        setTotalMistakes(0);
        setIsGameActive(true);
        setGameResult(null);
        setTimeRemaining(TIME_LIMIT);
        selectRandomWord(romanMap);
    };

    const endGame = () => {
        setIsGameActive(false);
        const accuracy = totalCharacters > 0 
            ? ((totalCharacters - totalMistakes) / totalCharacters * 100).toFixed(1)
            : 0;
        setGameResult({
            wordCount,
            totalCharacters,
            accuracy: Number(accuracy)
        });
    };

    const handleRestart = () => {
        startGame();
    };

    const handleHome = () => {
        router.push('/');
    };

    const selectRandomWord = (roman_map: KanaRomanMap[]) => {
        const randomIndex = Math.floor(Math.random() * words.length);
        let newWord = words[randomIndex];
        const newRoman = convertYomiToRoman(newWord.yomi, roman_map);
        while (newWord === currentWord) {
            newWord = words[Math.floor(Math.random() * words.length)];
        }
        setCurrentWord(newWord);
        setCurrentRoman(newRoman);
    };

    const handleWordComplete = () => {
        if (isGameActive) {
            setWordCount(wordCount + 1);
            setTotalCharacters(totalCharacters + currentRoman.length);
            selectRandomWord(romanMap);
        }
    };

    const handleMistake = () => {
        setTotalMistakes(prev => prev + 1);
    };

    if (!currentWord) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            {!isGameActive && !gameResult ? (
                <Card className="p-8 text-center">
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center justify-center space-x-2">
                            <Timer className="w-5 h-5 text-gray-600" />
                            <span className="text-lg">制限時間: 60秒</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                            <KeyboardIcon className="w-5 h-5 text-gray-600" />
                            <span className="text-lg">モード: あなた専用</span>
                        </div>
                    </div>
                    <Button 
                        size="lg"
                        onClick={startGame}
                        className="w-full max-w-xs bg-green-500 hover:bg-green-600"
                    >
                        ゲームを始める
                    </Button>
                </Card>
            ) : !gameResult ? (
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center space-x-2">
                            <Timer className="w-5 h-5 text-gray-600" />
                            <span className="text-xl font-bold">
                                {timeRemaining}秒
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold">{wordCount}単語</span>
                        </div>
                    </div>
                    <TypingGame 
                        targetText={currentRoman}
                        wordInfo={currentWord}
                        onComplete={handleWordComplete}
                        onMistake={handleMistake}
                    />
                </div>
            ) : (
                <Card className="p-8 text-center">
                    <div className="flex justify-center mb-6">
                        <Award className="w-16 h-16 text-yellow-400" />
                    </div>
                    <h2 className="text-3xl font-bold mb-8">ゲーム終了！</h2>
                    <div className="space-y-4 mb-8">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-lg mb-2">タイプした単語数</p>
                            <p className="text-3xl font-bold text-blue-600">{gameResult.wordCount}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-lg mb-2">タイプした文字数</p>
                            <p className="text-3xl font-bold text-green-600">{gameResult.totalCharacters}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-lg mb-2">正確率</p>
                            <p className="text-3xl font-bold text-purple-600">{gameResult.accuracy}%</p>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-3">
                        <Button 
                            onClick={handleRestart}
                            className="w-full"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            もう一度プレイ
                        </Button>
                        <Button 
                            onClick={handleHome}
                            variant="outline"
                            className="w-full"
                        >
                            ホームに戻る
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
}
