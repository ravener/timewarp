export type Grade = "SS" | "S" | "A" | "B" | "C" | "D";

interface ScoreStats {
  rulesetId: number;
  accuracy: number;
  misses: number;
  count300: number;
  count50: number;
  totalHits: number;
}

export function getGrade({
  rulesetId,
  accuracy,
  misses,
  count300,
  count50,
  totalHits,
}: ScoreStats): Grade {
  switch (rulesetId) {
    // osu!
    case 0: {
      const percent300 = (count300 / totalHits) * 100;
      const percent50 = (count50 / totalHits) * 100;

      if (accuracy === 100) {
        return "SS";
      }

      if (percent300 > 90 && percent50 <= 1 && misses === 0) {
        return "S";
      }

      if ((percent300 > 80 && misses === 0) || percent300 > 90) {
        return "A";
      }

      if ((percent300 > 70 && misses === 0) || percent300 > 80) {
        return "B";
      }

      if (percent300 > 60) {
        return "C";
      }

      return "D";
    }

    // osu!taiko
    case 1: {
      const percentGreat = (count300 / totalHits) * 100;

      if (accuracy === 100) {
        return "SS";
      }

      if (percentGreat > 90 && misses === 0) {
        return "S";
      }

      if ((percentGreat > 80 && misses === 0) || percentGreat > 90) {
        return "A";
      }

      if ((percentGreat > 70 && misses === 0) || percentGreat > 80) {
        return "B";
      }

      if (percentGreat > 60) {
        return "C";
      }

      return "D";
    }

    // osu!catch
    case 2: {
      if (accuracy === 100) {
        return "SS";
      }

      if (accuracy >= 98.01) {
        return "S";
      }

      if (accuracy >= 94.01) {
        return "A";
      }

      if (accuracy >= 90.01) {
        return "B";
      }

      if (accuracy >= 85.01) {
        return "C";
      }

      return "D";
    }

    // osu!mania
    case 3: {
      if (accuracy === 100) {
        return "SS";
      }

      if (accuracy > 95) {
        return "S";
      }

      if (accuracy > 90) {
        return "A";
      }

      if (accuracy > 80) {
        return "B";
      }

      if (accuracy > 70) {
        return "C";
      }

      return "D";
    }

    default:
      throw new Error(`Invalid rulesetId: ${rulesetId}`);
  }
}
