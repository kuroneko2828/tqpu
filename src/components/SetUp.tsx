import csvContent from '@/data/words.csv';

export interface WordEntry {
    word: string;
    yomi: string;
    alphabet: string;
}

export function getWords(): WordEntry[] {
    const words = []
    try {
        for (let i = 0; i < csvContent.length; i++) {
            const row = csvContent[i];
            words.push(row);
        }

        if (words.length === 0) {
            throw new Error('No records found');
        }

        return words;
    } catch (error) {
        throw new Error(`Failed to read file: ${error}`);
    }
}


