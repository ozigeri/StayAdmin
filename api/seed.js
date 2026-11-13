import { mkdirSync, copyFileSync } from 'node:fs';

const directory = new URL('./data/', import.meta.url);
mkdirSync(directory, { recursive: true });
copyFileSync(new URL('./seed/data.json', import.meta.url), new URL('data.json', directory));
console.log('A seed adatok bemásolva a data/data.json fájlba. Indítás: npm start');
