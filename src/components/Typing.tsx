'use client';
import React, { useState, useEffect, useRef } from 'react';
import { WordEntry } from '@components/SetUp';
import { Card, CardContent } from '@/components/ui/card';

interface TypingGameProps {
    targetText: string;
    wordInfo: WordEntry;
    onComplete: () => void;
    onMistake: () => void;
}

const TypingGame: React.FC<TypingGameProps> = ({ 
    targetText, 
    wordInfo, 
    onComplete,
    onMistake 
}) => {
    const [userInput, setUserInput] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isCorrect, setIsCorrect] = useState(true);
    const [isWordComplete, setIsWordComplete] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const wasMistakeMade = useRef(false);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.value = '';
            inputRef.current.focus();
        }
        setUserInput('');
        setCurrentIndex(0);
        setIsCorrect(true);
        setIsWordComplete(false);
        wasMistakeMade.current = false;
    }, [targetText]);

    const countMatchingCharacters = (input: string, target: string) => {
        let count = 0;
        for (let i = 0; i < input.length; i++) {
            if (input[i] === target[i]) {
                count++;
            } else {
                break;
            }
        }
        return count;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        
        setUserInput(inputValue);
        const matchingCount = countMatchingCharacters(inputValue, targetText);
        setCurrentIndex(matchingCount);

        if (targetText.startsWith(inputValue)) {
            setIsCorrect(true);
            
            if (inputValue === targetText) {
                setIsWordComplete(true);
                setTimeout(() => {
                    onComplete();
                }, 100);
            }
        } else {
            setIsCorrect(false);
            if (!wasMistakeMade.current) {
                onMistake();
                wasMistakeMade.current = true;
            }
        }
    };

    const renderTargetText = () => {
        const typedPart = targetText.slice(0, currentIndex);
        const currentChar = targetText[currentIndex];
        const remainingPart = targetText.slice(currentIndex + 1);

        return (
            <div className="font-mono text-xl tracking-wide text-center">
                <span className="text-green-600">{typedPart}</span>
                <span className="text-blue-600 bg-blue-100 px-1 animate-pulse">
                    {currentChar || ' '}
                </span>
                <span className="text-gray-400">{remainingPart}</span>
            </div>
        );
    };

    return (
        <Card className={`transition-all duration-300 ${
            isWordComplete ? 'bg-green-50' : 'bg-white'
        }`}>
            <CardContent className="p-6">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">{wordInfo.word}</h2>
                    <p className="text-gray-600">読み: {wordInfo.yomi}</p>
                </div>

                <div className="space-y-4">
                    {renderTargetText()}
                    <input
                        ref={inputRef}
                        type="text"
                        value={userInput}
                        onChange={handleInputChange}
                        className={`w-full p-3 text-lg border-2 rounded-lg transition-colors duration-200 focus:outline-none ${
                            isCorrect 
                                ? 'border-green-300 focus:border-green-500 bg-green-50' 
                                : 'border-red-300 focus:border-red-500 bg-red-50'
                        }`}
                        placeholder="ここにローマ字で入力"
                    />
                </div>

                {!isCorrect && (
                    <div className="mt-4 text-center text-red-500 animate-fade-in">
                        入力が間違っています
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TypingGame;
