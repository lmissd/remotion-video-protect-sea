# AI Animation Lab 制作工作流

## 项目定位

这支视频不是课程招生片，而是 AI 动画制作能力展示片。

核心目标：

- 第一眼足够酷，像一个 AI 视觉工作站正在启动。
- 展示 AI 工具链可以把想法变成 Prompt、代码、3D 画面、动画和视频。
- 用 Remotion 保证视频时间轴可控，用 Three.js 提供更强的空间感和科技视觉底座。

不做：

- 不介绍课程价格、年龄、地点或报名。
- 不使用真实品牌 Logo。
- 不暗示 Codex、Claude Code、ChatGPT、Gemini、豆包与本项目存在官方合作。
- 不做密密麻麻的技术教学说明。

## 工作流

### 1. 视觉概念

关键词：

```text
AI Animation Lab
Prompt Driven
Code Generated
Motion Rendered
Codex / Claude Code / ChatGPT / Gemini / 豆包
```

视觉方向：

- 黑蓝紫宇宙空间。
- 神经网络节点。
- 3D 粒子核心。
- 发光轨道、数据流、扫描线。
- 全息控制台 UI。
- 竖版短视频预览窗口。

### 2. 技术分工

Remotion 负责：

- 9:16 竖版 composition。
- 分镜时间轴。
- 字幕、标题、UI 面板。
- 稳定本地预览和 MP4 渲染。

Three.js 负责：

- 3D 粒子场。
- AI 核心能量球。
- 环形轨道。
- 模型节点空间布局。
- 镜头运动和空间纵深。

CSS / SVG 负责：

- 玻璃拟态面板。
- 代码流。
- 时间轴 UI。
- 发光文字。
- 手机短视频界面框架。

### 3. 分镜结构

```text
0-5 秒
AI 工作站启动：扫描线、粒子、AI Animation Lab 标题。

5-12 秒
多模型协作矩阵：Codex、Claude Code、ChatGPT、Gemini、豆包围绕 Creative Engine 旋转。

12-22 秒
Prompt 变成代码：输入框、代码流、React / Remotion / Three.js / Shaders / Particles。

22-34 秒
3D 场景爆发：粒子核心、轨道、城市轮廓、全息屏幕、镜头推进。

34-45 秒
动画时间轴生成：Script / Visual / Motion / Sound / Render 轨道依次亮起。

45-60 秒
最终展示：竖版视频窗口闪过多个高科技视觉片段，最后定格 AI Animation Lab。
```

### 4. 验证标准

每次大改后至少执行：

```powershell
npm run typecheck
npm run still:lab
npm run render:lab
```

抽帧检查：

- 首屏标题可读。
- 工具名没有遮挡。
- 3D 画面不是空白。
- 右侧/底部字幕不压主体文字。
- 60 秒完整渲染成功。

### 5. 迭代路线

第一版：

- 代码生成的 Three.js 粒子核心。
- Remotion 时间轴 + 全息 UI。
- 无真实音频，仅保留字幕和旁白脚本。

第二版：

- 加入真实旁白音频。
- 加入更复杂的后处理辉光或 shader。
- 增加 15 秒超快节奏版。

第三版：

- 可以寻找授权清晰的 Three.js 模板作为视觉底座。
- 把模板改造成 Remotion 的逐帧确定性动画。
- 将模板视觉与当前分镜和文案合并。
