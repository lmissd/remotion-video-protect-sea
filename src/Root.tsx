import {Composition} from 'remotion';
import {PromoVertical} from './PromoVertical';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AiCoursePromo"
      component={PromoVertical}
      durationInFrames={1800}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
