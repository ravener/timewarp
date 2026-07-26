import { ScoreDecoder } from 'osu-parsers';
import { ManiaRuleset } from 'osu-mania-stable';
import { TaikoRuleset } from 'osu-taiko-stable';
import { CatchRuleset } from 'osu-catch-stable';
import { StandardRuleset } from 'osu-standard-stable';
import { getGrade } from './grade';

const rulesets = [
  new StandardRuleset(),
  new TaikoRuleset(),
  new CatchRuleset(),
  new ManiaRuleset(),
];

const decoder = new ScoreDecoder();

const MODS = {
    DoubleTime: 64,
    HalfTime: 256,
    Nightcore: 512,
};

function getModeDivisor(mods: number) {
    if ((mods & MODS.DoubleTime) || (mods & MODS.Nightcore)) return 1.5;
    if (mods & MODS.HalfTime) return 0.75;
    return 1.0;
}


function divideAndRound(n: number, d: number, r: number) {
    const factor = Math.pow(10, r);
    return Math.round((n / d) * factor) / factor;
}

type HistogramBin = {
  start: number;
  end: number;
  count: number;
};

function histogram(
  data: number[],
  bins: number[]
): HistogramBin[] {
  const result: HistogramBin[] = [];

  for (let i = 0; i < bins.length - 1; i++) {
    result.push({
      start: bins[i]!,
      end: bins[i + 1]!,
      count: 0,
    });
  }

  for (const value of data) {
    for (let i = 0; i < result.length; i++) {
      const bin = result[i]!;

      // Last bin includes its right edge
      const isLastBin = i === result.length - 1;

      if (
        value >= bin.start &&
        (value < bin.end || (isLastBin && value <= bin.end))
      ) {
        bin.count++;
        break;
      }
    }
  }

  return result;
}

function getFrameTimeNum(frameTimes: number[]) {
    const frameTimesCount = new Map<number, number>();

    for (const frameTime of frameTimes) {
        const frameTimeCount = frameTimesCount.get(frameTime);
        if (frameTimeCount) {
            frameTimesCount.set(frameTime, frameTimeCount + 1);
            continue;
        }

        frameTimesCount.set(frameTime, 1);
    }

    const entries = [...frameTimesCount.entries()];
    const sorted = entries.sort((a, b) => a[1] > b[1] ? -1 : 1);
    return sorted[0]?.[0];
}

export async function analyzeReplay(buffer: Uint8Array) {
    const score = await decoder.decodeFromBuffer(buffer);

    if (!score.replay) {
        throw new Error('Cannot parse replay frames');
    }

    const ruleset = rulesets[score.info.rulesetId];
    if (!ruleset) {
      throw new Error('Invalid ruleset in replay file');
    }
    
    const mods = ruleset.createModCombination(score.info.rawMods as number).acronyms.join('');
    const divisor = getModeDivisor(score.info.rawMods as number);
    const frameTimes = score.replay.frames.map(frameTime => divideAndRound(frameTime.interval, divisor, 2));

    const bins = Array.from({ length: Math.round(25 * divisor) }, (_, i) => divideAndRound(i, divisor, 2));
    const histogramData = histogram(frameTimes, bins);

    const hitStats: { count: number; color: string }[] = [];
    const grade = getGrade({
      rulesetId: score.info.rulesetId,
      accuracy: score.info.accuracy,
      misses: score.info.countMiss,
      count300: score.info.count300,
      count50: score.info.count50,
      totalHits: score.info.totalHits,
    });

    // osu!standard
    if (score.info.rulesetId === 0) {
      hitStats.push({ count: score.info.count300, color: '#039BE5' });
      hitStats.push({ count: score.info.count100, color: '#4CAF50' });
      hitStats.push({ count: score.info.count50, color: '#FFB300' });
      hitStats.push({ count: score.info.countMiss, color: '#F44336' });
    }

    // osu!taiko
    if (score.info.rulesetId === 1) {
      hitStats.push({ count: score.info.count300, color: '#FFB300' });
      hitStats.push({ count: score.info.count100, color: '#4CAF50' });
      hitStats.push({ count: score.info.countMiss, color: '#F44336' });
    }

    // osu!catch
    if (score.info.rulesetId === 2) {
      hitStats.push({ count: score.info.count300, color: '#FFB300' });
      hitStats.push({ count: score.info.count100, color: '#4CAF50' });
      hitStats.push({ count: score.info.count50, color: '#039BE5' });
      hitStats.push({ count: score.info.countMiss, color: '#F44336' });
    }

    // osu!mania
    if (score.info.rulesetId === 3) {
      hitStats.push({ count: score.info.countGeki, color: '#FF66AA' });
      hitStats.push({ count: score.info.count300, color: '#FFB300' });
      hitStats.push({ count: score.info.countKatu, color: '#4CAF50' });
      hitStats.push({ count: score.info.count100, color: '#039BE5' });
      hitStats.push({ count: score.info.count50, color: '#595959' });
      hitStats.push({ count: score.info.countMiss, color: '#F44336' });
    }

    return {
        data: histogramData.map(bin => ({
            x: (bin.start + bin.end) / 2,
            y: bin.count,
        })),
        username: score.info.username,
        gameVersion: score.replay.gameVersion,
        avgFrameTime: getFrameTimeNum(frameTimes),
        replayId: score.info.id,
        date: score.info.date,
        accuracy: score.info.accuracy,
        maxCombo: score.info.maxCombo,
        beatmapHash: score.info.beatmapHashMD5,
        mods: mods || 'NM',
        rulesetId: score.info.rulesetId,
        score: score.info.totalScore,
        grade,
        hitStats
    };
}

export type ReplayAnalysis = Awaited<ReturnType<typeof analyzeReplay>>;