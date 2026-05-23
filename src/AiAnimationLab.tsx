import React, {useLayoutEffect, useRef} from 'react';
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import * as THREE from 'three';

const fontStack =
  '"Microsoft YaHei", "PingFang SC", "Noto Sans SC", Arial, sans-serif';

const colors = {
  black: '#030712',
  deep: '#071225',
  panel: 'rgba(8, 18, 39, 0.62)',
  white: '#ffffff',
  cyan: '#34e8ff',
  blue: '#3388ff',
  violet: '#9068ff',
  pink: '#ff4fd8',
  gold: '#ffd76a',
  mint: '#5cffc8',
};

const sceneDurations = [150, 210, 300, 360, 330, 450];
const sceneStarts = sceneDurations.reduce<number[]>((acc, duration, index) => {
  acc.push(index === 0 ? 0 : acc[index - 1] + sceneDurations[index - 1]);
  return acc;
}, []);

const toolNodes = ['Codex', 'Claude Code', 'ChatGPT', 'Gemini', '豆包'];

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const appear = (frame: number, start = 0, duration = 24) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

const leave = (frame: number, start: number, duration = 18) =>
  interpolate(frame, [start, start + duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

const seeded = (seed: number) => {
  const x = Math.sin(seed * 999.17) * 10000;
  return x - Math.floor(x);
};

export const AiAnimationLab: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(circle at 50% 28%, #193277 0%, #071225 43%, #02040b 100%)',
        color: colors.white,
        fontFamily: fontStack,
        overflow: 'hidden',
      }}
    >
      <ThreeEngine frame={frame} />
      <Atmosphere frame={frame} />

      <Sequence from={sceneStarts[0]} durationInFrames={sceneDurations[0]}>
        <BootScene />
      </Sequence>
      <Sequence from={sceneStarts[1]} durationInFrames={sceneDurations[1]}>
        <ModelMatrixScene />
      </Sequence>
      <Sequence from={sceneStarts[2]} durationInFrames={sceneDurations[2]}>
        <PromptToCodeScene />
      </Sequence>
      <Sequence from={sceneStarts[3]} durationInFrames={sceneDurations[3]}>
        <SceneExplosionScene />
      </Sequence>
      <Sequence from={sceneStarts[4]} durationInFrames={sceneDurations[4]}>
        <TimelineScene />
      </Sequence>
      <Sequence from={sceneStarts[5]} durationInFrames={sceneDurations[5]}>
        <FinalShowcaseScene />
      </Sequence>

      <Narration globalFrame={frame} />
    </AbsoluteFill>
  );
};

type EngineState = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  particleCloud: THREE.Points;
  core: THREE.Mesh;
  rings: THREE.Group;
  nodeGroup: THREE.Group;
  lineGroup: THREE.Group;
  cityGroup: THREE.Group;
};

const ThreeEngine: React.FC<{frame: number}> = ({frame}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<EngineState | null>(null);

  useLayoutEffect(() => {
    if (!canvasRef.current || stateRef.current) {
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(1);
    renderer.setSize(1080, 1920, false);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1080 / 1920, 0.1, 100);
    camera.position.set(0, 0.15, 8.2);

    scene.add(new THREE.AmbientLight(0x77dfff, 1.1));
    const key = new THREE.PointLight(0x47e7ff, 12, 32);
    key.position.set(0, 1.4, 2.7);
    const violet = new THREE.PointLight(0xa66bff, 9, 30);
    violet.position.set(-3.2, -1.8, 2.2);
    scene.add(key, violet);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.78, 3),
      new THREE.MeshStandardMaterial({
        color: 0x79f4ff,
        emissive: 0x1b8dff,
        emissiveIntensity: 2.2,
        metalness: 0.42,
        roughness: 0.18,
        transparent: true,
        opacity: 0.82,
      }),
    );
    scene.add(core);

    const rings = new THREE.Group();
    const ringColors = [0x33e8ff, 0x9b72ff, 0xff4fd8, 0x5cffc8];
    for (let index = 0; index < 5; index += 1) {
      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(1.35 + index * 0.35, 0.012, 12, 160),
        new THREE.MeshBasicMaterial({
          color: ringColors[index % ringColors.length],
          transparent: true,
          opacity: 0.42 - index * 0.035,
          blending: THREE.AdditiveBlending,
        }),
      );
      torus.rotation.x = Math.PI / 2.5 + index * 0.22;
      torus.rotation.y = index * 0.34;
      rings.add(torus);
    }
    scene.add(rings);

    const particleCount = 1900;
    const positions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      const radius = 1.8 + seeded(index + 2) * 7.8;
      const theta = seeded(index + 4) * Math.PI * 2;
      const phi = Math.acos(seeded(index + 6) * 2 - 1);
      positions[index * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[index * 3 + 1] = Math.cos(phi) * radius * 1.18;
      positions[index * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;

      const palette = [
        new THREE.Color(0x33e8ff),
        new THREE.Color(0x8b6bff),
        new THREE.Color(0xff4fd8),
        new THREE.Color(0xffd76a),
      ][index % 4];
      particleColors[index * 3] = palette.r;
      particleColors[index * 3 + 1] = palette.g;
      particleColors[index * 3 + 2] = palette.b;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3),
    );
    particleGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(particleColors, 3),
    );
    const particleCloud = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        size: 0.035,
        transparent: true,
        opacity: 0.78,
        vertexColors: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    scene.add(particleCloud);

    const nodeGroup = new THREE.Group();
    const lineGroup = new THREE.Group();
    toolNodes.forEach((_, index) => {
      const angle = (index / toolNodes.length) * Math.PI * 2;
      const radius = 2.75;
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 24, 24),
        new THREE.MeshBasicMaterial({
          color: ringColors[index % ringColors.length],
          transparent: true,
          opacity: 0.86,
        }),
      );
      node.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * 1.1,
        Math.sin(angle) * radius,
      );
      nodeGroup.add(node);

      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        node.position.clone(),
      ]);
      const line = new THREE.Line(
        lineGeometry,
        new THREE.LineBasicMaterial({
          color: ringColors[index % ringColors.length],
          transparent: true,
          opacity: 0.32,
          blending: THREE.AdditiveBlending,
        }),
      );
      lineGroup.add(line);
    });
    scene.add(nodeGroup, lineGroup);

    const cityGroup = new THREE.Group();
    for (let index = 0; index < 32; index += 1) {
      const width = 0.08 + seeded(index + 30) * 0.12;
      const height = 0.28 + seeded(index + 44) * 1.05;
      const tower = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, width),
        new THREE.MeshBasicMaterial({
          color: index % 3 === 0 ? 0x33e8ff : 0x806dff,
          transparent: true,
          opacity: 0.36,
        }),
      );
      tower.position.set(
        -2.9 + index * 0.19,
        -2.45 + height / 2,
        -1.2 + seeded(index + 80) * 0.7,
      );
      cityGroup.add(tower);
    }
    scene.add(cityGroup);

    stateRef.current = {
      renderer,
      scene,
      camera,
      particleCloud,
      core,
      rings,
      nodeGroup,
      lineGroup,
      cityGroup,
    };
  }, []);

  useLayoutEffect(() => {
    const state = stateRef.current;
    if (!state) {
      return;
    }

    const time = frame / 30;
    const stage = frame / 1800;
    state.camera.position.set(
      Math.sin(time * 0.32) * 0.82,
      0.25 + Math.sin(time * 0.18) * 0.28,
      8.1 - stage * 2.1,
    );
    state.camera.lookAt(0, 0, 0);

    const pulse = 1 + Math.sin(time * 4.2) * 0.055;
    state.core.scale.setScalar(pulse);
    state.core.rotation.x = time * 0.42;
    state.core.rotation.y = time * 0.7;

    state.rings.children.forEach((ring, index) => {
      ring.rotation.z = time * (0.35 + index * 0.12);
      ring.rotation.x =
        Math.PI / 2.5 + index * 0.22 + Math.sin(time * 0.22 + index) * 0.16;
    });

    state.particleCloud.rotation.y = time * 0.045;
    state.particleCloud.rotation.x = Math.sin(time * 0.1) * 0.08;
    state.nodeGroup.rotation.y = time * 0.38;
    state.lineGroup.rotation.y = time * 0.38;
    state.cityGroup.rotation.y = Math.sin(time * 0.18) * 0.08;

    state.renderer.render(state.scene, state.camera);
  }, [frame]);

  return (
    <canvas
      ref={canvasRef}
      width={1080}
      height={1920}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        filter: 'saturate(1.25) contrast(1.08)',
      }}
    />
  );
};

const Atmosphere: React.FC<{frame: number}> = ({frame}) => {
  const scan = (frame * 12) % 1920;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 35%, rgba(52,232,255,0.25), transparent 34%), linear-gradient(180deg, rgba(2,4,11,0.08), rgba(2,4,11,0.55))',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.28,
          backgroundImage:
            'linear-gradient(rgba(52,232,255,0.13) 1px, transparent 1px), linear-gradient(90deg, rgba(52,232,255,0.13) 1px, transparent 1px)',
          backgroundSize: '74px 74px',
          transform: `perspective(880px) rotateX(62deg) translateY(${(frame * 0.8) % 74}px) scale(1.9)`,
          transformOrigin: '50% 74%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: scan - 80,
          height: 160,
          background:
            'linear-gradient(180deg, transparent, rgba(52,232,255,0.22), transparent)',
          opacity: 0.45,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 140px rgba(0,0,0,0.82)',
        }}
      />
    </AbsoluteFill>
  );
};

const BootScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const hero = spring({frame, fps, config: {damping: 13, stiffness: 88}});
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: 170,
          left: 72,
          right: 72,
          opacity: hero,
          transform: `translateY(${interpolate(hero, [0, 1], [70, 0])}px)`,
        }}
      >
        <Kicker text="SYSTEM BOOT" />
        <div
          style={{
            marginTop: 32,
            fontSize: 92,
            lineHeight: 1.02,
            fontWeight: 950,
            letterSpacing: 0,
            textShadow: `0 0 38px ${colors.cyan}`,
          }}
        >
          AI Animation
          <br />
          <span style={{color: colors.cyan}}>Lab</span>
        </div>
        <div
          style={{
            marginTop: 34,
            fontSize: 42,
            lineHeight: 1.24,
            fontWeight: 800,
            color: 'rgba(255,255,255,0.82)',
          }}
        >
          用 AI 制作动画的时代
          <br />
          已经开始
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 96,
          right: 96,
          bottom: 190,
          opacity: appear(frame, 56, 26),
        }}
      >
        <StatusStrip
          items={[
            ['PROMPT', 'ONLINE'],
            ['CODEX', 'READY'],
            ['RENDER', 'ARMED'],
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

const ModelMatrixScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <SceneTitle
        kicker="MULTI MODEL MATRIX"
        title="多模型协作矩阵"
        accent="Creative Engine"
      />
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          top: 470,
          height: 710,
        }}
      >
        {toolNodes.map((tool, index) => {
          const angle = (index / toolNodes.length) * Math.PI * 2 + frame * 0.012;
          const x = 430 + Math.cos(angle) * 330;
          const y = 335 + Math.sin(angle) * 230;
          const p = appear(frame, 16 + index * 12, 26);
          return (
            <div
              key={tool}
              style={{
                position: 'absolute',
                left: x - 120,
                top: y - 52,
                width: 240,
                height: 104,
                borderRadius: 28,
                border: '2px solid rgba(52,232,255,0.45)',
                background:
                  'linear-gradient(135deg, rgba(8,18,39,0.76), rgba(49,73,140,0.42))',
                boxShadow: `0 0 38px ${
                  index % 2 === 0 ? colors.cyan : colors.violet
                }`,
                display: 'grid',
                placeItems: 'center',
                fontSize: tool.length > 9 ? 28 : 34,
                fontWeight: 920,
                opacity: p,
                transform: `scale(${interpolate(p, [0, 1], [0.65, 1])})`,
              }}
            >
              {tool}
            </div>
          );
        })}
        <div
          style={{
            position: 'absolute',
            left: 270,
            top: 245,
            width: 320,
            height: 220,
            borderRadius: 44,
            background:
              'radial-gradient(circle, rgba(52,232,255,0.5), rgba(144,104,255,0.24) 48%, rgba(8,18,39,0.74))',
            border: '2px solid rgba(255,255,255,0.32)',
            boxShadow: `0 0 86px ${colors.cyan}`,
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
            fontSize: 36,
            lineHeight: 1.18,
            fontWeight: 950,
            opacity: appear(frame, 72, 24),
          }}
        >
          Creative
          <br />
          Engine
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 82,
          right: 82,
          bottom: 165,
          opacity: appear(frame, 108, 22),
        }}
      >
        <PipelineText />
      </div>
    </AbsoluteFill>
  );
};

const PromptToCodeScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <SceneTitle
        kicker="PROMPT TO CODE"
        title="一句想法，开始生成"
        accent="Prompt → Code"
      />
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          top: 370,
          height: 1130,
          display: 'grid',
          gridTemplateRows: '320px 1fr',
          gap: 34,
        }}
      >
        <GlassPanel delay={18}>
          <div style={{fontSize: 30, color: colors.cyan, fontWeight: 900}}>
            PROMPT
          </div>
          <TypingLine
            frame={frame}
            text="生成一个未来感 AI 动画场景"
            start={44}
          />
        </GlassPanel>
        <GlassPanel delay={84}>
          <CodeRain frame={frame} />
        </GlassPanel>
      </div>
    </AbsoluteFill>
  );
};

const SceneExplosionScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          top: 130,
          textAlign: 'center',
          opacity: appear(frame, 6, 26),
        }}
      >
        <Kicker text="3D SCENE BURST" />
        <div
          style={{
            marginTop: 28,
            fontSize: 66,
            lineHeight: 1.16,
            fontWeight: 950,
          }}
        >
          想法不是停在脑子里
          <br />
          <span style={{color: colors.cyan}}>而是被渲染成画面</span>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 92,
          right: 92,
          bottom: 150,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 22,
          opacity: appear(frame, 135, 28),
        }}
      >
        {['3D Particles', 'Camera Orbit', 'Neural Nodes', 'Hologram UI'].map(
          (item, index) => (
            <MetricCard key={item} title={item} value={`${index + 1}.0`} />
          ),
        )}
      </div>
    </AbsoluteFill>
  );
};

const TimelineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const tracks = ['Script', 'Visual', 'Motion', 'Sound', 'Render'];
  return (
    <AbsoluteFill>
      <SceneTitle
        kicker="MOTION TIMELINE"
        title="动画时间轴自动点亮"
        accent="Script / Visual / Motion / Render"
      />
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          top: 500,
          borderRadius: 42,
          padding: '44px 34px',
          background: 'rgba(2,7,18,0.72)',
          border: '2px solid rgba(52,232,255,0.24)',
          boxShadow: '0 0 70px rgba(52,232,255,0.16)',
        }}
      >
        {tracks.map((track, index) => {
          const p = appear(frame, 30 + index * 26, 28);
          return (
            <div
              key={track}
              style={{
                height: 104,
                display: 'grid',
                gridTemplateColumns: '170px 1fr',
                gap: 24,
                alignItems: 'center',
                marginBottom: 24,
                opacity: p,
              }}
            >
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 900,
                  color: index === tracks.length - 1 ? colors.gold : colors.cyan,
                }}
              >
                {track}
              </div>
              <div
                style={{
                  height: 48,
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${interpolate(p, [0, 1], [0, 68 + index * 6])}%`,
                    borderRadius: 999,
                    background:
                      index === tracks.length - 1
                        ? `linear-gradient(90deg, ${colors.gold}, ${colors.pink})`
                        : `linear-gradient(90deg, ${colors.blue}, ${colors.cyan})`,
                    boxShadow: `0 0 30px ${
                      index === tracks.length - 1 ? colors.gold : colors.cyan
                    }`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 90,
          right: 90,
          bottom: 150,
          fontSize: 44,
          lineHeight: 1.35,
          fontWeight: 920,
          textAlign: 'center',
          opacity: appear(frame, 176, 22),
        }}
      >
        AI 生成创意
        <br />
        <span style={{color: colors.cyan}}>代码控制运动</span>
        <br />
        视频完成表达
      </div>
    </AbsoluteFill>
  );
};

const FinalShowcaseScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 78,
          right: 78,
          top: 120,
          height: 940,
          borderRadius: 58,
          background: 'rgba(4,10,23,0.76)',
          border: '2px solid rgba(52,232,255,0.34)',
          boxShadow: `0 0 86px rgba(52,232,255,0.28)`,
          overflow: 'hidden',
          opacity: appear(frame, 8, 28),
        }}
      >
        <MiniShowreel frame={frame} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 68,
          right: 68,
          top: 1120,
          textAlign: 'center',
          opacity: appear(frame, 92, 30),
        }}
      >
        <div
          style={{
            fontSize: 78,
            lineHeight: 1.05,
            fontWeight: 950,
            textShadow: `0 0 38px ${colors.cyan}`,
          }}
        >
          AI Animation
          <br />
          <span style={{color: colors.cyan}}>Lab</span>
        </div>
        <div
          style={{
            marginTop: 34,
            fontSize: 46,
            lineHeight: 1.28,
            fontWeight: 880,
          }}
        >
          用 AI，把想象力做成视频
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          bottom: 150,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 14,
          opacity: appear(frame, 170, 24),
        }}
      >
        {['Prompt Driven', 'Code Generated', 'Motion Rendered'].map((item) => (
          <div
            key={item}
            style={{
              height: 104,
              borderRadius: 24,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.18)',
              display: 'grid',
              placeItems: 'center',
              textAlign: 'center',
              padding: 16,
              fontSize: 24,
              lineHeight: 1.15,
              fontWeight: 850,
              color: colors.white,
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const SceneTitle: React.FC<{
  kicker: string;
  title: string;
  accent: string;
}> = ({kicker, title, accent}) => {
  const frame = useCurrentFrame();
  const p = appear(frame, 0, 28);
  return (
    <div
      style={{
        position: 'absolute',
        left: 70,
        right: 70,
        top: 120,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [42, 0])}px)`,
      }}
    >
      <Kicker text={kicker} />
      <div
        style={{
          marginTop: 26,
          fontSize: 64,
          lineHeight: 1.12,
          fontWeight: 950,
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 16,
          fontSize: 30,
          color: colors.cyan,
          fontWeight: 850,
          letterSpacing: 0,
        }}
      >
        {accent}
      </div>
    </div>
  );
};

const Kicker: React.FC<{text: string}> = ({text}) => (
  <div
    style={{
      display: 'inline-flex',
      borderRadius: 999,
      border: '1px solid rgba(52,232,255,0.46)',
      background: 'rgba(52,232,255,0.1)',
      color: colors.cyan,
      padding: '13px 22px',
      fontSize: 24,
      fontWeight: 900,
      letterSpacing: 2,
      boxShadow: `0 0 30px rgba(52,232,255,0.18)`,
    }}
  >
    {text}
  </div>
);

const StatusStrip: React.FC<{items: Array<[string, string]>}> = ({items}) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 16,
    }}
  >
    {items.map(([label, value]) => (
      <div
        key={label}
        style={{
          height: 110,
          borderRadius: 24,
          background: colors.panel,
          border: '1px solid rgba(255,255,255,0.18)',
          padding: '22px 20px',
        }}
      >
        <div style={{fontSize: 20, color: 'rgba(255,255,255,0.58)', fontWeight: 800}}>
          {label}
        </div>
        <div style={{fontSize: 28, color: colors.mint, fontWeight: 950, marginTop: 12}}>
          {value}
        </div>
      </div>
    ))}
  </div>
);

const PipelineText: React.FC = () => (
  <div
    style={{
      height: 128,
      borderRadius: 34,
      background: 'rgba(2,7,18,0.74)',
      border: '2px solid rgba(52,232,255,0.28)',
      boxShadow: `0 0 56px rgba(52,232,255,0.16)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      fontSize: 42,
      fontWeight: 950,
    }}
  >
    <span>Prompt</span>
    <span style={{color: colors.cyan}}>→</span>
    <span>Code</span>
    <span style={{color: colors.cyan}}>→</span>
    <span>Motion</span>
    <span style={{color: colors.cyan}}>→</span>
    <span>Video</span>
  </div>
);

const GlassPanel: React.FC<{children: React.ReactNode; delay: number}> = ({
  children,
  delay,
}) => {
  const frame = useCurrentFrame();
  const p = appear(frame, delay, 28);
  return (
    <div
      style={{
        borderRadius: 42,
        background: 'rgba(2,7,18,0.68)',
        border: '2px solid rgba(52,232,255,0.22)',
        boxShadow: '0 0 70px rgba(52,232,255,0.13)',
        padding: '42px 44px',
        overflow: 'hidden',
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [42, 0])}px)`,
      }}
    >
      {children}
    </div>
  );
};

const TypingLine: React.FC<{frame: number; text: string; start: number}> = ({
  frame,
  text,
  start,
}) => {
  const chars = Math.floor(
    interpolate(frame, [start, start + 76], [0, text.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  const caret = Math.floor(frame / 12) % 2 === 0;
  return (
    <div
      style={{
        marginTop: 38,
        minHeight: 120,
        fontSize: 54,
        lineHeight: 1.25,
        fontWeight: 920,
      }}
    >
      {text.slice(0, chars)}
      <span style={{color: colors.cyan}}>{caret ? '|' : ''}</span>
    </div>
  );
};

const CodeRain: React.FC<{frame: number}> = ({frame}) => {
  const lines = [
    'const idea = prompt("future AI animation");',
    '<Sequence from={0} durationInFrames={1800}>',
    'camera.position.z = interpolate(frame, [0,1800], [8,5]);',
    'particles.rotation.y += frame * 0.004;',
    'render(<ThreeScene glow particles nodes />);',
    'exportVideo({format: "mp4", fps: 30});',
    'timeline.addLayer("Script", "Visual", "Motion");',
    'shader.uniforms.energy.value = Math.sin(frame / 12);',
  ];
  return (
    <div style={{fontFamily: 'Consolas, monospace'}}>
      {lines.map((line, index) => {
        const p = appear(frame, 108 + index * 12, 18);
        return (
          <div
            key={line}
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              fontSize: 25,
              color:
                index % 3 === 0
                  ? colors.mint
                  : index % 3 === 1
                    ? colors.cyan
                    : colors.violet,
              opacity: 0.2 + p * 0.8,
              transform: `translateX(${interpolate(p, [0, 1], [-42, 0])}px)`,
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span style={{color: 'rgba(255,255,255,0.28)', width: 56}}>
              {String(index + 1).padStart(2, '0')}
            </span>
            {line}
          </div>
        );
      })}
    </div>
  );
};

const MetricCard: React.FC<{title: string; value: string}> = ({title, value}) => (
  <div
    style={{
      height: 148,
      borderRadius: 30,
      background: 'rgba(2,7,18,0.68)',
      border: '1px solid rgba(52,232,255,0.26)',
      padding: '26px 28px',
    }}
  >
    <div style={{fontSize: 24, color: 'rgba(255,255,255,0.58)', fontWeight: 800}}>
      {title}
    </div>
    <div style={{fontSize: 42, color: colors.cyan, fontWeight: 950, marginTop: 16}}>
      {value}
    </div>
  </div>
);

const MiniShowreel: React.FC<{frame: number}> = ({frame}) => {
  const index = Math.floor(frame / 54) % 5;
  const labels = ['AI CORE', 'PARTICLE NEBULA', 'DIGITAL OCEAN', 'NEON CITY', 'CODE RAIN'];
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            index % 2 === 0
              ? 'radial-gradient(circle at 50% 45%, rgba(52,232,255,0.42), transparent 42%), linear-gradient(135deg, rgba(51,136,255,0.24), rgba(255,79,216,0.12))'
              : 'radial-gradient(circle at 38% 30%, rgba(255,79,216,0.38), transparent 42%), linear-gradient(135deg, rgba(144,104,255,0.32), rgba(52,232,255,0.1))',
        }}
      />
      {Array.from({length: 24}).map((_, item) => (
        <div
          key={item}
          style={{
            position: 'absolute',
            left: `${(item * 37 + frame * 0.22) % 100}%`,
            top: `${(item * 61 + frame * 0.14) % 100}%`,
            width: 8 + (item % 5) * 5,
            height: 8 + (item % 5) * 5,
            borderRadius: 99,
            background: item % 3 === 0 ? colors.gold : colors.cyan,
            boxShadow: `0 0 24px ${item % 3 === 0 ? colors.gold : colors.cyan}`,
            opacity: 0.35 + (item % 4) * 0.12,
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: 44,
          right: 44,
          top: 52,
          height: 96,
          borderRadius: 24,
          background: 'rgba(2,7,18,0.72)',
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 32,
          fontSize: 32,
          fontWeight: 950,
          color: colors.cyan,
        }}
      >
        {labels[index]}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 110,
          right: 110,
          top: 260,
          height: 360,
          borderRadius: 999,
          border: '3px solid rgba(52,232,255,0.38)',
          boxShadow: `0 0 110px rgba(52,232,255,0.42), inset 0 0 80px rgba(144,104,255,0.38)`,
          transform: `rotate(${frame * 0.45}deg) scale(${1 + Math.sin(frame / 16) * 0.04})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 210,
          right: 210,
          top: 350,
          height: 180,
          borderRadius: 44,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.24)',
          display: 'grid',
          placeItems: 'center',
          fontSize: 42,
          fontWeight: 950,
          textAlign: 'center',
        }}
      >
        VIDEO
        <br />
        RENDER
      </div>
    </div>
  );
};

const Narration: React.FC<{globalFrame: number}> = ({globalFrame}) => {
  const lines = [
    {from: 0, to: 150, text: '以前，做动画需要复杂的软件和漫长的制作流程。'},
    {from: 150, to: 360, text: '现在，一个想法，可以先变成 Prompt。'},
    {from: 360, to: 660, text: 'Prompt 变成代码，代码控制镜头、粒子和三维空间。'},
    {from: 660, to: 1020, text: '多个 AI 工具，可以一起成为创作工作流的一部分。'},
    {from: 1020, to: 1350, text: 'AI 不只是回答问题，它正在成为新的动画制作引擎。'},
    {from: 1350, to: 1800, text: '把想象力，变成画面；把画面，变成一支完整的视频。'},
  ];
  const current = lines.find((line) => globalFrame >= line.from && globalFrame < line.to);
  if (!current) {
    return null;
  }
  const local = globalFrame - current.from;
  const alpha = Math.min(
    appear(local, 0, 12),
    leave(local, current.to - current.from - 18, 18),
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: 64,
        right: 64,
        bottom: 32,
        minHeight: 92,
        borderRadius: 24,
        background: 'rgba(2,7,18,0.72)',
        border: '1px solid rgba(255,255,255,0.14)',
        color: colors.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '18px 34px',
        fontSize: 31,
        lineHeight: 1.25,
        fontWeight: 800,
        opacity: alpha,
      }}
    >
      {current.text}
    </div>
  );
};
