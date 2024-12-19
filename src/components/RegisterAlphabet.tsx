export interface KanaRomanMap {
  kana: string;
  roman: string;
}


export function convertYomiToRoman(yomi: string, kanaRomanMaps: KanaRomanMap[]): string {
    const sortedMaps = kanaRomanMaps.sort((a, b) => b.kana.length / b.roman.length - a.kana.length / a.roman.length);
    let remainingWord = yomi;
    let romanResult = '';
    
    while (remainingWord.length > 0) {
        // 最長一致のローマ字マッピングを探す
        const matchedMapping = sortedMaps.find(mapping => 
        remainingWord.startsWith(mapping.kana)
        );
    
        if (matchedMapping) {
        // マッピングが見つかったら、ローマ字を追加し、単語から対応する文字を削除
        romanResult += matchedMapping.roman;
        remainingWord = remainingWord.slice(matchedMapping.kana.length);
        } else {
        // マッピングが見つからない場合はエラー
        throw new Error(`No mapping found for: ${remainingWord}`);
        }
    }
    
    return romanResult;
}
