import { ReplayAnalysis } from "@/lib/analyzer";
import { Beatmap } from "@/lib/osu-api";
import { Roboto } from "next/font/google";
import { LocalDate } from "./local-date";
import { Grade } from "@/lib/grade";

const roboto = Roboto({
  subsets: ["latin"],
});

interface ScoreCardProps {
  replay: ReplayAnalysis;
  beatmap: Beatmap;
}

function gradeColor(grade: Grade, mods: string) {
    const hd = mods.includes('HD') || mods.includes('FL');

    switch (grade) {
      case "SS":
        return hd ? '#C0C0C0' : '#FFD700'; // Silver/Gold
      case "S":
        return hd ? "#C0C0C0" : '#FFD700'; // Silver / Gold
      case "A":
        return "#00FF00"; // Green
      case "B":
        return "#0000FF"; // Blue
      case "C":
        return "#FFA500"; // Orange
      case "D":
        return "#FF0000"; // Red
    }

    return "#000000"; // Default color if grade is not recognized
}

export function ScoreCard({ replay, beatmap }: ScoreCardProps) {
  return (
    <div className={`${roboto.className} [text-shadow:2px_2px_4px_black] relative h-75 w-full overflow-hidden bg-[#191827] mt-3 mb-8`}>
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${beatmap.beatmapset.covers.cover})`,
          filter: "blur(3px) brightness(0.8)",
          transform: "scale(1.03)",
        }}
      />

      {/* Content */}
      <div className="relative flex h-full flex-col items-center text-white">
        {/* Top right badge */}
        <div className="absolute right-6 top-6 rounded-full bg-amber-400 px-4 py-1 text-lg text-white">
          {replay.mods}
        </div>

        {/* Center information */}
        <div className="mt-9 flex flex-col items-center">
          <h2 className="text-[28px] font-bold">
            {beatmap.title} [{beatmap.version}]
          </h2>

          <div className="flex items-center justify-center gap-1 text-[24px]">
            <span className="text-amber-400">☆</span>
            <span>{beatmap.difficulty_rating.toFixed(2)}</span>
          </div>

          {/* Score */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="flex px-2 py-1 items-center justify-center rounded-xl text-[24px] font-medium" style={{ backgroundColor: gradeColor(replay.grade, replay.mods) }}>
              {replay.grade}
            </div>

            <span className="text-[34px]">
              {replay.score.toLocaleString()}
            </span>
          </div>

          <p className="text-xl font-medium">
            Played by {replay.username}
          </p>

          <p className="text-xl font-medium">
            Submitted on <LocalDate date={replay.date} />
          </p>
        </div>

        {/* Bottom left stats */}
        <div className="absolute -bottom-1 left-2.5 flex gap-3">
          <Stat value={`${replay.maxCombo}x`} className="bg-purple-600" />
          <Stat value={`${(replay.accuracy * 100).toFixed(2)}%`} className="bg-sky-500" />
        </div>

        {/* Bottom right stats */}
        <div className="absolute -bottom-1 right-2.5 flex gap-3">
          {replay.hitStats.map((hitStat, index) => (
            <Stat key={index} value={`${hitStat.count}`} style={{ backgroundColor: hitStat.color }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ value, className, style }: { value: string; className?: string; style?: React.CSSProperties; }) {
  return (
    <div className={`${className ?? ''} flex items-center justify-center rounded-t-lg px-6 py-2 text-sm font-medium shadow-lg`} style={style}>
      {value}
    </div>
  );
}