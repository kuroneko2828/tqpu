declare module '*.csv' {
  interface CsvRow {
    word: string;
    yomi: string;
    alphabet: string;
  }
  const content: CsvRow[];
  export default content;
}
