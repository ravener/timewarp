import { Histogram } from '@/components/histogram';
import { InfoGrid } from '@/components/info-grid';
import { ScoreCard } from '@/components/score-card';
import { ReplayAnalysis } from '@/lib/analyzer';
import { Beatmap } from '@/lib/osu-api';
import { redis } from '@/lib/redis';
import { notFound } from 'next/navigation';

interface ScoreData {
  replay: ReplayAnalysis;
  beatmap: Beatmap;
}

// Demo data used during development to avoid hitting the osu! API and Redis too often.
const demoData = [
  { start: 0, end: 1, count: 40 },
  { start: 1, end: 2, count: 49 },
  { start: 2, end: 3, count: 263 },
  { start: 3, end: 4, count: 140 },
  { start: 4, end: 5, count: 290 },
  { start: 5, end: 6, count: 102 },
  { start: 6, end: 7, count: 263 },
  { start: 7, end: 8, count: 103 },
  { start: 8, end: 9, count: 280 },
  { start: 9, end: 10, count: 126 },
  { start: 10, end: 11, count: 217 },
  { start: 11, end: 12, count: 133 },
  { start: 12, end: 13, count: 252 },
  { start: 13, end: 14, count: 139 },
  { start: 14, end: 15, count: 248 },
  { start: 15, end: 16, count: 790 },
  { start: 16, end: 17, count: 4652 },
  { start: 17, end: 18, count: 3132 },
  { start: 18, end: 19, count: 2082 },
  { start: 19, end: 20, count: 143 },
  { start: 20, end: 21, count: 0 },
  { start: 21, end: 22, count: 0 },
  { start: 22, end: 23, count: 0 },
  { start: 23, end: 24, count: 1 }
];

const demo: ScoreData = {
  replay: {
    avgFrameTime: 16,
    username: 'Lucid',
    data: demoData.map(bin => ({ x: (bin.start + bin.end) / 2, y: bin.count })),
    date: new Date('2026-01-13T21:26:29.876Z'),
    replayId: 191423269,
    accuracy: 0.9925876010781671,
    maxCombo: 742,
    gameVersion: 20260101,
    beatmapHash: '03c82825a88a4663f4d4248d03d4983e',
    mods: 'NM',
    rulesetId: 1,
    score: 896911,
    grade: 'S',
    hitStats: [
      {
        "count": 731,
        "color": "#FFB300"
      },
      {
        "count": 11,
        "color": "#4CAF50"
      },
      {
        "count": 0,
        "color": "#F44336"
      }
    ]
  },
  beatmap: {
    id: 4379536,
    mode: 'taiko',
    version: 'e',
    difficulty_rating: 3.33253,
    title: 'Calcium',
    beatmapset: {
      covers: {
        // cover: 'https://assets.ppy.sh/beatmaps/2108981/covers/cover.jpg',
        cover: 'https://assets.ppy.sh/beatmaps/2089714/covers/cover.jpg?1719143584'
      }
    }
  }
}

async function getReplay(id: number) {
  if (process.env.NODE_ENV === 'development') {
    return demo;
  }

  const key = `replay:${id}`;
  console.log(key);
  const replay = await redis.getex<ScoreData>(key, { ex: 60 * 60 * 24 * 3 });

  if (!replay) {
    notFound();
  }

  return replay;
}

export default async function ScorePage({ params }: { params: Promise<{ id: string }> }) {
  const id = parseInt((await params).id, 10);
  if (isNaN(id)) {
    return <div>Invalid score ID</div>;
  }

  const score = await getReplay(id);
  
  return (
    <>
      <a href={`https://osu.ppy.sh/b/${score.beatmap.id}`} target="_blank" rel="noopener noreferrer">
       <ScoreCard replay={score.replay} beatmap={score.beatmap} />
      </a>
      <InfoGrid replay={score.replay} />
      <Histogram data={score.replay.data} />
    </>
  );
}