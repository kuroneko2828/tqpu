'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KanaRomanMap } from '@components/RegisterAlphabet';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    // Check if userWords exist in cookies on component mount
    const savedRomanMap = localStorage.getItem('romanMap');
    if (savedRomanMap) {
      setCanProceed(true);
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // const file = event.target.files[0];
    const files = event.target.files;
    if (!files) return;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target || !e.target.result) return;
        const content = e.target.result;
        // content to string
        const content_str = content.toString();
        const roman_data: KanaRomanMap[] = [];
        const lines = content_str.split('\n');
        
        for (const line of lines) {
          const row_split = line.split('\t');
          if (row_split.length >= 2) {
            roman_data.push({
              kana: row_split[1],
              roman: row_split[0]
            });
          }
        }
        saveRomanMapToLocalStorage(roman_data);
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
