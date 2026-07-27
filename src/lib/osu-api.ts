import { redis } from "./redis";

const TOKEN_URL = 'https://osu.ppy.sh/oauth/token';


interface TokenResponse {
  token_type: 'Bearer';
  expires_in: number;
  access_token: string;
}

interface CachedToken {
  expiresAt: number;
  value: string;
}

let cachedToken: CachedToken | null = null;

async function requestOAuthToken() {
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: process.env.OSU_CLIENT_ID!,
      client_secret: process.env.OSU_CLIENT_SECRET!,
      grant_type: 'client_credentials',
      scope: 'public'
    })
  });

  if (!response.ok) {
    throw new Error(`Error requesting token: ${response.status} ${response.statusText}`);
  }

  const token = await response.json() as TokenResponse;
  return token;
}

async function getAccessToken() {
  // L1: Local Memory Cache for hot functions
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  // L2: Redis
  const token = await redis.get<CachedToken>('oauth:access-token');

  if (token) {
    cachedToken = token;
    return token.value;
  }

  // L3: Request new token
  const newToken = await requestOAuthToken();
  const expiresAt = Date.now() + (newToken.expires_in * 1000) - (60 * 1000); // Subtract 1 minute for safety

  cachedToken = { expiresAt, value: newToken.access_token };
  await redis.set('oauth:access-token', JSON.stringify(cachedToken), { ex: newToken.expires_in - 60 });

  return newToken.access_token;
}



export interface Beatmap {
  id: number;
  mode: 'osu' | 'taiko' | 'fruits' | 'mania';
  version: string;
  difficulty_rating: number;
  beatmapset: {
    title: string;
    covers: {
      cover: string;
    }
  }
}

export async function getBeatmapByHash(md5Hash: string) {
  const accessToken = await getAccessToken();
  const response = await fetch(`https://osu.ppy.sh/api/v2/beatmaps/lookup?checksum=${md5Hash}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Error fetching beatmap: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as Beatmap;

  // Return a small subset of the data that we need
  return {
    id: data.id,
    mode: data.mode,
    version: data.version,
    difficulty_rating: data.difficulty_rating,
    beatmapset: {
      title: data.beatmapset.title,
      covers: {
        cover: data.beatmapset.covers.cover
      }
    }
  }
}
