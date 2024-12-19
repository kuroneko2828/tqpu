'use client';
import React, { useState, useEffect, useRef } from 'react';
import { WordEntry } from '@components/SetUp';

interface TypingGameProps {
    targetText: string;
    wordInfo: WordEntry;
    onComplete: () => void;
}

const TypingGame: React.FC<TypingGameProps> = ({ 
    targetText, 
    wordInfo, 
    onComplete 
}) => {
    const [userInput, setUserInput] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isCorrect, setIsCorrect] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus input when component mounts or new word is selected
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.value = ''; // Directly clear the input value
            inputRef.current.focus();
        }
        setUserInput('');
        setCurrentIndex(0);
        setIsCorrect(true);
    }, [targetText]);

    // Count the number of matching characters between input and target text
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
        console.log(inputValue);
        
        // Check if the input matches the target text up to the current index
        setUserInput(inputValue);
        // setCurrentIndex(inputValue.length);
        setCurrentIndex(countMatchingCharacters(inputValue, targetText));

        // Check correctness of input
        if (targetText.startsWith(inputValue)) {
            setIsCorrect(true);
            
            // Check if word is completely typed
            if (inputValue === targetText) {
                console.log('Word complete!');
                onComplete();
            }
        } else {
            setIsCorrect(false);
        }
    };

    // Render the target text with typed and remaining parts
    const renderTargetText = () => {
        const typedPart = targetText.slice(0, currentIndex);
        const remainingPart = targetText.slice(currentIndex);

        return (
            <p className="text-gray-500 mb-2">
                <span className="text-black">{typedPart}</span>
                <span className="text-gray-300">{remainingPart}</span>
            </p>
        );
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">{wordInfo.word}</h2>
                <p className="text-gray-600 mb-2">読み: {wordInfo.yomi}</p>
            </div>

            <div className="mb-4">
                {renderTargetText()}
                <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    className={`w-full p-2 border-2 rounded ${
                        isCorrect 
                        ? 'border-green-300 focus:border-green-500' 
                        : 'border-red-300 focus:border-red-500'
                    }`}
                    placeholder="Type the alphabet here"
                />
            </div>

            {!isCorrect && (
                <div className="text-red-500 mb-4">
                    Incorrect typing. Please try again.
                </div>
            )}
        </div>
    );
};

export default TypingGame;
