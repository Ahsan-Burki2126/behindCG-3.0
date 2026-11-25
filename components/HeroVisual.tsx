import Icon, { type IconName } from './Icon';
import Render, { type Obj, type Tone } from './Render';

type Shot = { src?: string; tone: Tone; obj: Obj; alt: string };

// Layered hero composition: a large render, a smaller detail render floating over its
// corner, and a label chip. Both renders are image slots, so real work drops straight in.
export default function HeroVisual({
  main,
  inset,
  chip,
  play = false,
}: {
  main: Shot;
  inset: Shot;
  chip: { icon: IconName; text: string };
  play?: boolean;
}) {
  return (
    <div className="hv">
      <div className="hv-light" aria-hidden="true" />
      <Render className="hv-main" ratio="r43" priority sizes="(max-width: 1024px) 90vw, 560px" {...main}>
        {play && <span className="play-lg" aria-hidden="true"><Icon name="play" /></span>}
      </Render>
      <div className="hv-inset">
        <Render ratio="r11" sizes="240px" {...inset} />
      </div>
      <p className="hv-chip">
        <span className="hv-chip-ic"><Icon name={chip.icon} /></span>
        {chip.text}
      </p>
    </div>
  );
}
