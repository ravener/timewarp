
export function Footer() {
  return (
    <footer className="pt-2.5 pb-1 text-[10px] bg-[#2a2226]">
      <div className="mb-1 flex justify-center flex-wrap">
        <a className="font-bold px-2.5" href="https://discord.gg/DQ2BgNDb6Q" target="_blank">Discord</a>
        <a className="font-bold px-2.5" href="https://github.com/ravener/timewarp" target="_blank">Source Code</a>
        <a className="font-bold px-2.5" href="https://ravener.is-a.dev/donate" target="_blank">Donate</a>
      </div>
      <div className="mb-1 flex justify-center flex-wrap text-[#74646c]"><span>Made by <a href="https://github.com/ravener" target="_blank">Ravener</a> (not affiliated with ppy or osu!)</span></div>
    </footer>
  );
}