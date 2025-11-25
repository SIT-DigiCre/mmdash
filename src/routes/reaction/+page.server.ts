import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const dataPath = path.resolve('src/lib/reaction-counts.json');
	const raw = await readFile(dataPath, 'utf8');
	return JSON.parse(raw);
};
