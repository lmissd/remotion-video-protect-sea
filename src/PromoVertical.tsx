import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const sceneDurations = [120, 180, 240, 360, 360, 300, 240];
const sceneStarts = sceneDurations.reduce<number[]>((acc, duration, index) => {
  acc.push(index === 0 ? 0 : acc[index - 1] + sceneDurations[index - 1]);
  return acc;
}, []);

const colors = {
  navy: '#09233f',
  ink: '#102033',
  blue: '#178cff',
  cyan: '#34d7ff',
  mint: '#60e6c8',
  yellow: '#ffd55c',
  coral: '#ff7c6e',
  pale: '#eaf8ff',
  white: '#ffffff',
};

const fontStack =
  '"Microsoft YaHei", "PingFang SC", "Noto Sans SC", Arial, sans-serif';

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const easeIn = (frame: number, start = 0, duration = 24) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

const fadeOut = (frame: number, start: number, duration = 18) =>
  interpolate(frame, [start, start + duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

const cardStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.86)',
  border: '2px solid rgba(23, 140, 255, 0.18)',
  boxShadow: '0 26px 70px rgba(14, 70, 120, 0.18)',
  backdropFilter: 'blur(12px)',
};

const Page: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <AbsoluteFill
      style={{
        fontFamily: fontStack,
        color: colors.ink,
        overflow: 'hidden',
      }}
    >
      <TechOceanBackground />
      {children}
    </AbsoluteFill>
  );
};

export const PromoVertical: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Page>
      <Sequence from={sceneStarts[0]} durationInFrames={sceneDurations[0]}>
        <OpeningScene />
      </Sequence>
      <Sequence from={sceneStarts[1]} durationInFrames={sceneDurations[1]}>
        <ValueScene />
      </Sequence>
      <Sequence from={sceneStarts[2]} durationInFrames={sceneDurations[2]}>
        <TrustScene />
      </Sequence>
      <Sequence from={sceneStarts[3]} durationInFrames={sceneDurations[3]}>
        <WorkflowScene />
      </Sequence>
      <Sequence from={sceneStarts[4]} durationInFrames={sceneDurations[4]}>
        <OutcomeScene />
      </Sequence>
      <Sequence from={sceneStarts[5]} durationInFrames={sceneDurations[5]}>
        <InfoScene />
      </Sequence>
      <Sequence from={sceneStarts[6]} durationInFrames={sceneDurations[6]}>
        <ClosingScene />
      </Sequence>
      <Subtitle globalFrame={frame} />
    </Page>
  );
};

const TechOceanBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const slow = frame / 30;

  return (
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(180deg, #f7fcff 0%, #d9f4ff 42%, #c9f1ff 68%, #f6fbff 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.32,
          backgroundImage:
            'linear-gradient(rgba(23,140,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(23,140,255,0.18) 1px, transparent 1px)',
          backgroundSize: '90px 90px',
          transform: `translateY(${(slow * 14) % 90}px) perspective(800px) rotateX(58deg) scale(1.85)`,
          transformOrigin: '50% 80%',
        }}
      />
      <svg
        viewBox="0 0 1080 1920"
        style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}
      >
        {Array.from({length: 7}).map((_, index) => {
          const y = 860 + index * 95 + Math.sin(slow * 0.8 + index) * 14;
          return (
            <path
              key={index}
              d={`M -60 ${y} C 170 ${y - 54}, 330 ${y + 44}, 540 ${y} S 910 ${
                y + 40
              }, 1140 ${y - 18}`}
              fill="none"
              stroke={index % 2 === 0 ? colors.cyan : colors.mint}
              strokeWidth={index % 2 === 0 ? 4 : 2}
              opacity={0.16}
            />
          );
        })}
      </svg>
      {Array.from({length: 34}).map((_, index) => {
        const left = (index * 137) % 1080;
        const top = (index * 211) % 1800;
        const drift = Math.sin(slow * 0.75 + index) * 22;
        const size = 5 + (index % 4) * 3;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              left: left + drift,
              top: top + ((slow * (8 + (index % 5))) % 120),
              borderRadius: 99,
              background: index % 6 === 0 ? colors.yellow : colors.cyan,
              opacity: 0.18 + (index % 4) * 0.06,
              boxShadow: `0 0 18px ${
                index % 6 === 0 ? colors.yellow : colors.cyan
              }`,
            }}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: -160,
          right: -160,
          bottom: -50,
          height: 330,
          background:
            'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(49,191,255,0.12) 36%, rgba(255,255,255,0.7) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

const OpeningScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const title = spring({frame, fps, config: {damping: 14, stiffness: 95}});
  const assistant = easeIn(frame, 18, 30);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: 180,
          left: 82,
          right: 82,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: easeIn(frame, 0, 24),
        }}
      >
        <SmallPill text="诚心招募" />
        <SmallPill text="北京朝阳区｜珠江帝景附近" variant="light" />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 340,
          left: 80,
          right: 80,
          transform: `translateY(${interpolate(title, [0, 1], [55, 0])}px) scale(${interpolate(
            title,
            [0, 1],
            [0.94, 1],
          )})`,
          opacity: title,
        }}
      >
        <div
          style={{
            fontSize: 70,
            lineHeight: 1.1,
            fontWeight: 900,
            letterSpacing: 0,
          }}
        >
          珠江帝景附近小学生
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 132,
            lineHeight: 1,
            fontWeight: 950,
            color: colors.blue,
            textShadow: '0 8px 28px rgba(23, 140, 255, 0.2)',
          }}
        >
          AI 创造力
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 82,
            lineHeight: 1,
            fontWeight: 900,
          }}
        >
          体验课
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 250,
          top: 950,
          width: 580,
          height: 430,
          opacity: assistant,
          transform: `translateY(${interpolate(assistant, [0, 1], [80, 0])}px)`,
        }}
      >
        <HologramPlatform />
        <AiAssistant size={290} />
      </div>
      <ScanBeam opacity={fadeOut(frame, 92, 20)} />
    </AbsoluteFill>
  );
};

const ValueScene: React.FC = () => {
  const frame = useCurrentFrame();
  const entry = easeIn(frame, 0, 28);
  const bullets = ['不是刷题班', '不是 AI 写作业', '是孩子亲手做作品'];

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: 130,
          left: 80,
          right: 80,
          fontSize: 56,
          lineHeight: 1.16,
          fontWeight: 900,
          opacity: entry,
          transform: `translateY(${interpolate(entry, [0, 1], [40, 0])}px)`,
        }}
      >
        让 AI 变成孩子的
        <span style={{color: colors.blue}}> 创作伙伴</span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          top: 330,
          height: 710,
          borderRadius: 44,
          ...cardStyle,
        }}
      >
        <ChildrenWithTablet />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 1110,
          left: 92,
          right: 92,
          display: 'grid',
          gap: 26,
        }}
      >
        {bullets.map((text, index) => {
          const p = easeIn(frame, 34 + index * 16, 24);
          return (
            <div
              key={text}
              style={{
                height: 118,
                borderRadius: 28,
                background:
                  index === 2
                    ? `linear-gradient(90deg, ${colors.blue}, ${colors.cyan})`
                    : 'rgba(255,255,255,0.92)',
                border: `2px solid ${
                  index === 2 ? 'rgba(255,255,255,0.5)' : 'rgba(23,140,255,0.16)'
                }`,
                boxShadow: '0 18px 44px rgba(16, 104, 180, 0.16)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 42px',
                fontSize: 48,
                fontWeight: 900,
                color: index === 2 ? colors.white : colors.ink,
                opacity: p,
                transform: `translateX(${interpolate(p, [0, 1], [-60, 0])}px)`,
              }}
            >
              <span
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 99,
                  marginRight: 28,
                  background: index === 2 ? colors.yellow : colors.cyan,
                  boxShadow: `0 0 24px ${index === 2 ? colors.yellow : colors.cyan}`,
                }}
              />
              {text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const TrustScene: React.FC = () => {
  const frame = useCurrentFrame();
  const entry = easeIn(frame, 0, 28);
  const tags = ['小班体验', '过程可见', '作品可展示'];

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          top: 270,
          borderRadius: 46,
          padding: '66px 60px 72px',
          ...cardStyle,
          opacity: entry,
          transform: `translateY(${interpolate(entry, [0, 1], [60, 0])}px)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 64,
          }}
        >
          <div>
            <div style={{fontSize: 40, fontWeight: 800, color: colors.blue}}>
              可信授课
            </div>
            <div style={{fontSize: 28, marginTop: 12, color: '#527086'}}>
              不使用高校 Logo，仅保留文字背书
            </div>
          </div>
          <AcademicIcon />
        </div>

        <div
          style={{
            fontSize: 66,
            lineHeight: 1.18,
            fontWeight: 950,
            letterSpacing: 0,
          }}
        >
          中国科学院大学
          <br />
          在读博士生
          <br />
          <span style={{color: colors.blue}}>亲自授课</span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          top: 1130,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 22,
        }}
      >
        {tags.map((tag, index) => {
          const p = easeIn(frame, 54 + index * 12, 20);
          return (
            <div
              key={tag}
              style={{
                height: 132,
                borderRadius: 28,
                background: 'rgba(255,255,255,0.92)',
                border: '2px solid rgba(23,140,255,0.18)',
                display: 'grid',
                placeItems: 'center',
                fontSize: 34,
                fontWeight: 900,
                color: colors.navy,
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [36, 0])}px)`,
              }}
            >
              {tag}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const WorkflowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const steps = ['说出想法', '变成 AI 提问', '设计角色和规则', '做出自己的小游戏'];

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          top: 110,
          fontSize: 58,
          lineHeight: 1.14,
          fontWeight: 950,
        }}
      >
        孩子怎么把想法
        <br />
        变成<span style={{color: colors.blue}}> AI 小游戏</span>
      </div>

      <div style={{position: 'absolute', left: 72, right: 72, top: 300}}>
        <ChatBubbles />
      </div>

      <div style={{position: 'absolute', left: 86, right: 86, top: 720}}>
        {steps.map((step, index) => {
          const p = easeIn(frame, 30 + index * 32, 24);
          return (
            <div
              key={step}
              style={{
                position: 'relative',
                marginBottom: 26,
                minHeight: 106,
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                opacity: p,
                transform: `translateX(${interpolate(p, [0, 1], [-50, 0])}px)`,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 22,
                  background: index === 3 ? colors.yellow : colors.blue,
                  color: index === 3 ? colors.ink : colors.white,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 34,
                  fontWeight: 950,
                  boxShadow: '0 14px 34px rgba(23, 140, 255, 0.28)',
                }}
              >
                {index + 1}
              </div>
              <div
                style={{
                  flex: 1,
                  height: 106,
                  borderRadius: 28,
                  background: 'rgba(255,255,255,0.92)',
                  border: '2px solid rgba(23,140,255,0.14)',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 34,
                  fontSize: 42,
                  fontWeight: 900,
                }}
              >
                {step}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{position: 'absolute', left: 82, right: 82, bottom: 120}}>
        <ScratchToGame progress={clamp01((frame - 88) / 210)} />
      </div>
    </AbsoluteFill>
  );
};

const OutcomeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const items = ['我做了什么', 'AI 帮了什么', '哪些是我自己决定的'];

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          top: 100,
          fontSize: 56,
          lineHeight: 1.18,
          fontWeight: 950,
        }}
      >
        体验课结束时，
        <br />
        孩子能<span style={{color: colors.blue}}>讲清楚作品</span>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 300,
          left: 90,
          right: 90,
          height: 750,
          borderRadius: 42,
          padding: 28,
          ...cardStyle,
        }}
      >
        <GamePreview large />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 96,
          right: 96,
          top: 1120,
          display: 'grid',
          gap: 24,
        }}
      >
        {items.map((item, index) => {
          const p = easeIn(frame, 74 + index * 22, 24);
          return (
            <div
              key={item}
              style={{
                borderRadius: 28,
                background: index === 0 ? colors.blue : 'rgba(255,255,255,0.92)',
                color: index === 0 ? colors.white : colors.ink,
                minHeight: 120,
                display: 'flex',
                alignItems: 'center',
                padding: '0 42px',
                fontSize: 42,
                fontWeight: 900,
                border: '2px solid rgba(23,140,255,0.16)',
                boxShadow: '0 18px 44px rgba(16, 104, 180, 0.14)',
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [38, 0])}px)`,
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 58,
                  borderRadius: 12,
                  marginRight: 26,
                  background: index === 0 ? colors.yellow : colors.cyan,
                }}
              />
              {item}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const InfoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const info = ['适合 1-4 年级', '2-4 人小班', '约 90 分钟', '珠江帝景附近'];

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: 150,
          left: 70,
          right: 70,
          height: 500,
          borderRadius: 48,
          background: `linear-gradient(135deg, ${colors.blue}, ${colors.cyan})`,
          color: colors.white,
          boxShadow: '0 34px 80px rgba(23, 140, 255, 0.28)',
          padding: '58px 62px',
          opacity: easeIn(frame, 0, 22),
        }}
      >
        <div style={{fontSize: 46, fontWeight: 850}}>低门槛体验</div>
        <div
          style={{
            fontSize: 120,
            lineHeight: 1.05,
            fontWeight: 950,
            marginTop: 18,
          }}
        >
          99 元
        </div>
        <div style={{fontSize: 54, fontWeight: 900, marginTop: 12}}>体验一次</div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          top: 720,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 26,
        }}
      >
        {info.map((item, index) => {
          const p = easeIn(frame, 36 + index * 14, 20);
          return (
            <div
              key={item}
              style={{
                height: 220,
                borderRadius: 34,
                background: 'rgba(255,255,255,0.92)',
                border: '2px solid rgba(23,140,255,0.16)',
                boxShadow: '0 20px 54px rgba(16, 104, 180, 0.14)',
                display: 'grid',
                placeItems: 'center',
                textAlign: 'center',
                padding: 24,
                fontSize: 44,
                lineHeight: 1.15,
                fontWeight: 950,
                color: colors.navy,
                opacity: p,
                transform: `scale(${interpolate(p, [0, 1], [0.92, 1])})`,
              }}
            >
              {item}
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 96,
          right: 96,
          bottom: 140,
          borderRadius: 34,
          background: 'rgba(255, 213, 92, 0.96)',
          padding: '34px 40px',
          fontSize: 44,
          lineHeight: 1.22,
          fontWeight: 950,
          color: colors.ink,
          opacity: easeIn(frame, 102, 24),
        }}
      >
        会提问｜会创作｜会表达
      </div>
    </AbsoluteFill>
  );
};

const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const entry = easeIn(frame, 0, 24);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 64,
          right: 64,
          top: 120,
          height: 900,
          borderRadius: 48,
          ...cardStyle,
          opacity: entry,
        }}
      >
        <div style={{position: 'absolute', inset: 0}}>
          <ChildrenWithTablet compact />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 78,
          right: 78,
          top: 1060,
          textAlign: 'center',
          opacity: easeIn(frame, 34, 26),
        }}
      >
        <div
          style={{
            fontSize: 64,
            lineHeight: 1.12,
            fontWeight: 950,
            color: colors.navy,
          }}
        >
          亲手设计自己的
          <br />
          <span style={{color: colors.blue}}>第一个 AI 小游戏</span>
        </div>
        <div
          style={{
            margin: '42px auto 0',
            width: 650,
            borderRadius: 34,
            background: `linear-gradient(90deg, ${colors.blue}, ${colors.cyan})`,
            color: colors.white,
            padding: '30px 36px',
            fontSize: 42,
            fontWeight: 950,
            boxShadow: '0 20px 56px rgba(23, 140, 255, 0.28)',
          }}
        >
          小班体验，可私信预约
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          bottom: 220,
          borderRadius: 34,
          background: 'rgba(255,255,255,0.92)',
          border: '2px solid rgba(23,140,255,0.16)',
          padding: '32px 42px',
          textAlign: 'center',
          fontSize: 40,
          lineHeight: 1.32,
          fontWeight: 950,
          color: colors.ink,
          opacity: easeIn(frame, 74, 22),
        }}
      >
        不是教孩子用 AI 写作业
        <br />
        <span style={{color: colors.blue}}>而是带孩子用 AI 做作品</span>
      </div>
    </AbsoluteFill>
  );
};

const SmallPill: React.FC<{text: string; variant?: 'light'}> = ({
  text,
  variant,
}) => (
  <div
    style={{
      borderRadius: 999,
      background: variant === 'light' ? 'rgba(255,255,255,0.88)' : colors.blue,
      color: variant === 'light' ? colors.navy : colors.white,
      border: '2px solid rgba(23,140,255,0.16)',
      padding: '18px 28px',
      fontSize: 28,
      fontWeight: 850,
      boxShadow: '0 10px 30px rgba(23, 140, 255, 0.16)',
    }}
  >
    {text}
  </div>
);

const HologramPlatform: React.FC = () => (
  <svg viewBox="0 0 580 430" style={{position: 'absolute', inset: 0}}>
    <ellipse
      cx="290"
      cy="330"
      rx="250"
      ry="70"
      fill="rgba(52,215,255,0.14)"
      stroke="rgba(23,140,255,0.42)"
      strokeWidth="4"
    />
    <ellipse
      cx="290"
      cy="330"
      rx="170"
      ry="40"
      fill="none"
      stroke="rgba(96,230,200,0.48)"
      strokeWidth="3"
    />
    <path
      d="M120 330 L230 70 L350 70 L460 330"
      fill="rgba(52,215,255,0.08)"
      stroke="rgba(52,215,255,0.22)"
      strokeWidth="3"
    />
  </svg>
);

const AiAssistant: React.FC<{size?: number}> = ({size = 220}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 60,
        width: size,
        height: size * 1.05,
        transform: 'translateX(-50%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: size * 0.45,
          top: 0,
          width: size * 0.1,
          height: size * 0.22,
          background: colors.blue,
          borderRadius: 999,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: size * 0.39,
          top: size * 0.13,
          width: size * 0.22,
          height: size * 0.22,
          borderRadius: 999,
          background: colors.yellow,
          boxShadow: `0 0 26px ${colors.yellow}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: size * 0.1,
          top: size * 0.25,
          width: size * 0.8,
          height: size * 0.54,
          borderRadius: size * 0.18,
          background: `linear-gradient(180deg, ${colors.white}, #cdefff)`,
          border: `${Math.max(4, size * 0.025)}px solid rgba(23,140,255,0.55)`,
          boxShadow: '0 24px 48px rgba(23, 140, 255, 0.18)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: size * 0.18,
            top: size * 0.18,
            width: size * 0.15,
            height: size * 0.15,
            borderRadius: 999,
            background: colors.blue,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: size * 0.18,
            top: size * 0.18,
            width: size * 0.15,
            height: size * 0.15,
            borderRadius: 999,
            background: colors.blue,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: size * 0.28,
            top: size * 0.38,
            width: size * 0.24,
            height: size * 0.06,
            borderRadius: 999,
            background: colors.mint,
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: size * 0.24,
          top: size * 0.83,
          width: size * 0.52,
          height: size * 0.2,
          borderRadius: size * 0.08,
          background: colors.blue,
        }}
      />
    </div>
  );
};

const ChildrenWithTablet: React.FC<{compact?: boolean}> = ({compact}) => {
  const scale = compact ? 1.08 : 1;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: compact ? 135 : 140,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <ChildAvatar shirt={colors.yellow} hair="#26364a" />
      </div>
      <div
        style={{
          position: 'absolute',
          right: 74,
          top: compact ? 132 : 132,
          transform: `scale(${scale})`,
          transformOrigin: 'top right',
        }}
      >
        <ChildAvatar shirt={colors.coral} hair="#4b2d38" variant="girl" />
      </div>
      <div
        style={{
          position: 'absolute',
          left: compact ? 170 : 145,
          right: compact ? 170 : 145,
          bottom: compact ? 105 : 88,
          height: compact ? 330 : 310,
          borderRadius: 34,
          background: '#173b62',
          border: '10px solid #0c2541',
          boxShadow: '0 28px 60px rgba(7, 38, 72, 0.25)',
          overflow: 'hidden',
        }}
      >
        <GamePreview />
      </div>
      <div style={{position: 'absolute', right: 110, top: compact ? 470 : 450}}>
        <AiAssistant size={150} />
      </div>
    </div>
  );
};

const ChildAvatar: React.FC<{
  shirt: string;
  hair: string;
  variant?: 'girl';
}> = ({shirt, hair, variant}) => (
  <div style={{position: 'relative', width: 240, height: 390}}>
    <div
      style={{
        position: 'absolute',
        top: 34,
        left: 42,
        width: 156,
        height: 156,
        borderRadius: 999,
        background: '#ffd5b4',
        border: '6px solid rgba(16,32,51,0.08)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: variant ? 14 : 18,
        left: variant ? 28 : 38,
        width: variant ? 184 : 164,
        height: variant ? 86 : 70,
        borderRadius: '80px 80px 32px 32px',
        background: hair,
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: 92,
        left: 82,
        width: 18,
        height: 18,
        borderRadius: 99,
        background: '#1f2e3f',
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: 92,
        right: 82,
        width: 18,
        height: 18,
        borderRadius: 99,
        background: '#1f2e3f',
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: 132,
        left: 100,
        width: 42,
        height: 14,
        borderRadius: 99,
        background: '#e88979',
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: 188,
        left: 24,
        width: 192,
        height: 166,
        borderRadius: '48px 48px 32px 32px',
        background: shirt,
        border: '6px solid rgba(16,32,51,0.07)',
      }}
    />
  </div>
);

const AcademicIcon: React.FC = () => (
  <svg width="150" height="150" viewBox="0 0 150 150">
    <path d="M75 24 132 52 75 80 18 52 75 24Z" fill={colors.blue} />
    <path d="M42 68v32c0 12 66 12 66 0V68L75 84 42 68Z" fill={colors.cyan} />
    <path d="M122 58v44" stroke={colors.yellow} strokeWidth="8" strokeLinecap="round" />
    <circle cx="122" cy="112" r="10" fill={colors.yellow} />
  </svg>
);

const ChatBubbles: React.FC = () => (
  <div style={{height: 330, position: 'relative'}}>
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 610,
        borderRadius: '34px 34px 34px 8px',
        background: 'rgba(255,255,255,0.94)',
        border: '2px solid rgba(23,140,255,0.16)',
        padding: '30px 36px',
        fontSize: 34,
        lineHeight: 1.3,
        fontWeight: 850,
      }}
    >
      我想保护小海龟，
      <br />
      它遇到了塑料垃圾。
    </div>
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: 150,
        width: 650,
        borderRadius: '34px 34px 8px 34px',
        background: `linear-gradient(90deg, ${colors.blue}, ${colors.cyan})`,
        color: colors.white,
        padding: '30px 36px',
        fontSize: 34,
        lineHeight: 1.3,
        fontWeight: 850,
        boxShadow: '0 18px 44px rgba(23, 140, 255, 0.2)',
      }}
    >
      可以做成小游戏：
      <br />
      避开垃圾，收集海草能量。
    </div>
  </div>
);

const ScratchToGame: React.FC<{progress: number}> = ({progress}) => (
  <div
    style={{
      height: 270,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 28,
    }}
  >
    <div
      style={{
        borderRadius: 34,
        background: 'rgba(255,255,255,0.92)',
        border: '2px solid rgba(23,140,255,0.16)',
        padding: 28,
        overflow: 'hidden',
      }}
    >
      <ScratchBlock text="当绿旗被点击" color="#ffbf3f" />
      <ScratchBlock text="如果碰到垃圾" color="#ff7c6e" indent />
      <ScratchBlock text="生命减少 1" color="#7a8cff" indent />
      <ScratchBlock text="收集海草 +1" color="#51c487" />
    </div>
    <div
      style={{
        borderRadius: 34,
        background: '#173b62',
        border: '8px solid #0c2541',
        overflow: 'hidden',
        opacity: interpolate(progress, [0, 1], [0.65, 1]),
        transform: `scale(${interpolate(progress, [0, 1], [0.96, 1])})`,
      }}
    >
      <GamePreview />
    </div>
  </div>
);

const ScratchBlock: React.FC<{text: string; color: string; indent?: boolean}> = ({
  text,
  color,
  indent,
}) => (
  <div
    style={{
      width: indent ? 330 : 380,
      height: 48,
      marginLeft: indent ? 34 : 0,
      marginBottom: 14,
      borderRadius: 16,
      background: color,
      color: colors.white,
      fontSize: 24,
      fontWeight: 850,
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 22,
      boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
    }}
  >
    {text}
  </div>
);

const GamePreview: React.FC<{large?: boolean}> = ({large}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const score = Math.min(3, Math.floor(Math.max(0, (frame - 45) / 70)));
  const clean = clamp01((frame - 140) / 130);
  const turtleX = 80 + ((frame * (large ? 3.2 : 2.2)) % 560);
  const turtleY = 220 + Math.sin(t * 2.5) * 42;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: `linear-gradient(180deg, rgba(35,154,214,${
          0.92 + clean * 0.05
        }), rgba(31,211,198,${0.46 + clean * 0.22}))`,
        overflow: 'hidden',
      }}
    >
      <svg viewBox="0 0 640 360" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
        <path
          d="M0 260 C90 228 140 300 220 264 S360 230 450 268 570 302 640 260 V360 H0Z"
          fill={`rgba(255,255,255,${0.22 + clean * 0.26})`}
        />
        <path
          d="M0 310 C90 284 150 340 245 308 S410 280 500 314 590 342 640 316 V360 H0Z"
          fill={`rgba(96,230,200,${0.18 + clean * 0.18})`}
        />
        <Seaweed x={110} y={282} />
        <Seaweed x={460} y={286} />
        <Trash x={490 - clean * 40} y={130} opacity={1 - clean * 0.55} />
        <Trash x={250} y={92} opacity={1 - clean * 0.35} kind="bag" />
        <Turtle x={turtleX} y={turtleY} scale={large ? 1.05 : 0.85} />
        {[0, 1, 2].map((index) => (
          <circle
            key={index}
            cx={185 + index * 72}
            cy={72 + Math.sin(t * 2 + index) * 8}
            r={score > index ? 22 : 18}
            fill={score > index ? colors.yellow : 'rgba(255,255,255,0.36)'}
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="5"
          />
        ))}
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: 20,
          borderRadius: 18,
          background: 'rgba(255,255,255,0.86)',
          padding: '12px 18px',
          fontSize: large ? 28 : 20,
          fontWeight: 950,
          color: colors.navy,
        }}
      >
        海草能量 {score}/3
      </div>
      <div
        style={{
          position: 'absolute',
          right: 24,
          top: 20,
          borderRadius: 18,
          background: clean > 0.65 ? colors.yellow : 'rgba(255,255,255,0.86)',
          padding: '12px 18px',
          fontSize: large ? 28 : 20,
          fontWeight: 950,
          color: colors.navy,
        }}
      >
        {clean > 0.65 ? '和美海洋' : '保护小海龟'}
      </div>
    </div>
  );
};

const Turtle: React.FC<{x: number; y: number; scale?: number}> = ({
  x,
  y,
  scale = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx="0" cy="0" rx="42" ry="30" fill="#31c487" stroke="#0b8c72" strokeWidth="5" />
    <circle cx="45" cy="-3" r="18" fill="#70e3a2" stroke="#0b8c72" strokeWidth="4" />
    <ellipse cx="-16" cy="-34" rx="18" ry="10" fill="#70e3a2" transform="rotate(-20)" />
    <ellipse cx="-16" cy="34" rx="18" ry="10" fill="#70e3a2" transform="rotate(20)" />
    <circle cx="51" cy="-8" r="3" fill={colors.navy} />
    <path d="M-22 -4 C-6 -18 12 -18 26 -4" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="4" />
  </g>
);

const Seaweed: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M0 50 C-16 18 12 18 0 -18" fill="none" stroke="#35cc8f" strokeWidth="9" strokeLinecap="round" />
    <path d="M24 52 C8 22 34 12 18 -28" fill="none" stroke="#62e6a8" strokeWidth="8" strokeLinecap="round" />
    <path d="M-24 54 C-36 24 -12 12 -28 -22" fill="none" stroke="#55d99d" strokeWidth="8" strokeLinecap="round" />
  </g>
);

const Trash: React.FC<{x: number; y: number; opacity: number; kind?: 'bag'}> = ({
  x,
  y,
  opacity,
  kind,
}) => (
  <g transform={`translate(${x} ${y})`} opacity={opacity}>
    {kind === 'bag' ? (
      <>
        <path d="M0 0 C18 -18 44 -8 52 14 L42 62 C22 74 -4 66 -12 44Z" fill="#b8c1ce" />
        <path d="M18 2 C26 20 34 20 44 6" fill="none" stroke="#eef5ff" strokeWidth="6" />
      </>
    ) : (
      <>
        <rect x="0" y="0" width="44" height="82" rx="15" fill="#b8c1ce" />
        <rect x="10" y="-14" width="24" height="18" rx="5" fill="#8ca0b8" />
        <path d="M10 24 H34" stroke="#eef5ff" strokeWidth="6" />
      </>
    )}
  </g>
);

const ScanBeam: React.FC<{opacity: number}> = ({opacity}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: 220,
      background:
        'linear-gradient(180deg, rgba(52,215,255,0), rgba(52,215,255,0.22), rgba(52,215,255,0))',
      transform: 'translateY(760px)',
      opacity,
    }}
  />
);

const Subtitle: React.FC<{globalFrame: number}> = ({globalFrame}) => {
  const script = [
    {from: 0, to: 150, text: '现在，孩子接触 AI，不一定从写作业开始。'},
    {
      from: 150,
      to: 330,
      text: '在珠江帝景附近，我们准备了一节适合小学生的 AI 创造力体验课。',
    },
    {
      from: 330,
      to: 570,
      text: '孩子会先说出自己的想法，再把想法变成 AI 提问。',
    },
    {
      from: 570,
      to: 780,
      text: '和 AI 一起设计角色、故事和游戏规则。',
    },
    {
      from: 780,
      to: 990,
      text: '最后，亲手做出一个可以展示的 AI 小游戏。',
    },
    {
      from: 990,
      to: 1230,
      text: '课程由中国科学院大学在读博士生亲自授课。',
    },
    {from: 1230, to: 1440, text: '适合 1 到 4 年级，2 到 4 人小班体验。'},
    {from: 1440, to: 1590, text: '99 元体验一次。'},
    {
      from: 1590,
      to: 1800,
      text: '不是教孩子用 AI 写作业，而是带孩子用 AI 做作品。',
    },
  ];
  const current = script.find((item) => globalFrame >= item.from && globalFrame < item.to);
  if (!current) {
    return null;
  }
  const local = globalFrame - current.from;
  const alpha = Math.min(easeIn(local, 0, 12), fadeOut(local, current.to - current.from - 18, 18));

  return (
    <div
      style={{
        position: 'absolute',
        left: 70,
        right: 70,
        bottom: 26,
        minHeight: 92,
        borderRadius: 24,
        background: 'rgba(8, 32, 58, 0.72)',
        color: colors.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '18px 34px',
        fontSize: 32,
        lineHeight: 1.25,
        fontWeight: 800,
        opacity: alpha,
      }}
    >
      {current.text}
    </div>
  );
};
