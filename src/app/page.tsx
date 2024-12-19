'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getWords, WordEntry } from '@components/SetUp';
import { KanaRomanMap } from '@components/RegisterAlphabet';
import { convertWordsToRoman } from '@components/RegisterAlphabet';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Home() {
  const router = useRouter();
  const words: WordEntry[] = getWords();
  const [romanMap, setRomanMap] = useState<WordEntry[]>([]);
  const [fileContent, setFileContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);
  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    // Check if userWords exist in cookies on component mount
    const savedRomanMap = localStorage.getItem('romanMap');
    if (savedRomanMap) {
      setRomanMap(JSON.parse(savedRomanMap));
      setCanProceed(true);
      setIsProcessing(false);
    }
  }, []);

  const saveRomanMapToLocalStorage = (roman_map: KanaRomanMap[]) => {
    try {
      // Save to cookies (stringifying the array)
      setCanProceed(false);
      localStorage.setItem('romanMap', JSON.stringify(roman_map));
      setCanProceed(true);
    } catch (error) {
      console.error('Failed to save words to cookies', error);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setFileContent(content);
        const roman_data: KanaRomanMap[] = [];
        const lines = content.split('\n');
        
        for (let line of lines) {
          const row_split = line.split('\t');
          if (row_split.length >= 2) {
            roman_data.push({
              kana: row_split[1],
              roman: row_split[0]
            });
          }
        }
        setRomanMap(roman_data);
        saveRomanMapToLocalStorage(roman_data);
        setIsProcessing(false);
      };
      reader.readAsText(file);
    }
  };

  const handleNextPage = () => {
    router.push('/game');
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>ファイルアップロード</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <input 
              type="file" 
              accept=".txt"
              onChange={handleFileUpload}
              className="mb-4"
            />
            
            {(canProceed) && (
              <div className="flex flex-col items-center space-y-4">
                <p className="text-green-600 font-bold">処理完了</p>
                <Button onClick={handleNextPage}>
                  次へ
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
