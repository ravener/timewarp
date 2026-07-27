'use server';

import { analyzeReplay } from '@/lib/analyzer';
import { getBeatmapByHash } from '@/lib/osu-api';
import { redis } from '@/lib/redis';

export type UploadResult =
  | { success: true; id: number; }
  | { success: false; error: string; };


export async function uploadReplay(formData: FormData): Promise<UploadResult> {
    const file = formData.get('file');

    if (!(file instanceof File)) {
        return { success: false, error: 'No file uploaded' };
    }

    if (file.size > 1 * 1024 * 1024) {
        return { success: false, error: 'File size exceeds 1MB' };
    }

    if (!file.name.endsWith('.osr')) {
        return { success: false, error: 'Invalid file type. Only .osr files are allowed.' };
    }
    
    try {
        const replay = await analyzeReplay(new Uint8Array(await file.arrayBuffer()));
        const beatmap = await getBeatmapByHash(replay.beatmapHash);

        const id = await redis.incr('replay:id');
        const key = `replay:${id}`;
        const value = JSON.stringify({ replay, beatmap });
        const ex = 60 * 60 * 24 * 3; // 3 days
        
        await redis.set(key, value, { ex });
        return { success: true, id };
    } catch (err) {
        console.log(err);
        return { success: false, error: (err as Error).message };
    }
}
