import { ReplayAnalysis } from '@/lib/analyzer';

function getModeName(rulesetId: number) {
  switch (rulesetId) {
    case 0:
      return 'osu!standard';
    case 1:
      return 'osu!taiko';
    case 2:
      return 'osu!catch';
    case 3:
      return 'osu!mania';
    default:
      return 'Unknown';
  }
}

export function InfoGrid({ replay }: { replay: ReplayAnalysis }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 my-8">
      <div className="rounded-lg border p-4">
        <p className="text-sm text-gray-500">Game Version</p>
        <p className="text-lg font-semibold">{replay.gameVersion}</p>
      </div>

      <div className="rounded-lg border p-4">
        <p className="text-sm text-gray-500">Game Mode</p>
        <p className="text-lg font-semibold">{getModeName(replay.rulesetId)}</p>
      </div>

      <div className="rounded-lg border p-4">
        <p className="text-sm text-gray-500">Replay ID</p>
        <p className="text-lg font-semibold">{replay.replayId}</p>
      </div>

      <div className="rounded-lg border p-4">
        <p className="text-sm text-gray-500">Avg. Frametime</p>
        <p className="text-lg font-semibold">{replay.avgFrameTime}ms</p>
      </div>
    </div>
  );
}