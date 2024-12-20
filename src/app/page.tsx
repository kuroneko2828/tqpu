'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KanaRomanMap } from '@components/RegisterAlphabet';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import nextConfig from "../../next.config.js";
const BASE_PATH = nextConfig.basePath || "";

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
    console.log(event.target.files);
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
    <div className="container mx-auto p-4 max-w-2xl">
      {/* ロゴとタイトルセクション */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-32 h-32 relative mb-4">
          <Image
            src={`${BASE_PATH}/tqpu_transparent-.png`}
            alt="サービスロゴ"
            width={700}
            height={700}
          />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2">
        あなただけのタイピングを
        </h1>
        <p className="text-gray-600 text-center mb-8 px-4">
          AZIKなどでローマ字変換をしている方向けのタイピング練習サイトです。<br />
          ローマ字テーブルをアップロードして、練習を始めましょう。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ファイルアップロード</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">使い方</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>ローマ字テーブルをGoogle日本語入力の設定からエクスポートしてください</li>
                <li>下の「ファイルを選択」ボタンからファイルをアップロードしてください</li>
                <li>処理が完了したら「次へ」ボタンをクリックして練習を開始しましょう</li>
              </ol>
            </div>
            
            <input 
              type="file" 
              accept=".txt"
              onChange={handleFileUpload}
              className="mb-4 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            
            {canProceed && (
              <div className="flex flex-col items-center space-y-4">
                <p className="text-green-600 font-bold">処理完了</p>
                <Button 
                  onClick={handleNextPage}
                  className="w-full max-w-xs"
                >
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
