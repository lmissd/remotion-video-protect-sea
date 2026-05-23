# Remotion AI 课程宣传视频

本仓库用于制作“少儿 AI 创造力体验课”的 Remotion 宣传视频。

## 项目目标

- 制作 9:16 竖版短视频，优先用于小红书、抖音、家长群转发。
- 主题是“珠江帝景附近小学生 AI 创造力体验课”。
- 气质要有科技感，但仍然亲切、明亮、家长能一眼看懂。
- 核心表达：不是教孩子用 AI 写作业，而是带孩子用 AI 做作品。

## 已读取的项目记忆

本仓库的第一版视频提示词参考了：

- `D:\vibe_coding_class\ai_class_plan\AGENT.md`
- `D:\vibe_coding_class\ai_class_plan\PLAN.md`
- `D:\vibe_coding_class\ai_class_plan\poster_reference\POSTER_REFERENCE.md`
- `D:\vibe_coding_class\game\AGENTS.md`
- `D:\vibe_coding_class\game\README.md`
- `D:\vibe_coding_class\game\TEACHING_SYLLABUS.md`
- `D:\vibe_coding_class\game\progress.md`

## 当前文件

- `VIDEO_PROMPT.md`：给 Remotion 制作宣传视频的主提示词、分镜、旁白和禁区。
- `src/PromoVertical.tsx`：60 秒竖版宣传片主 composition。
- `.gitignore`：Node、Remotion、渲染输出和本地环境忽略规则。

## 本地运行

```powershell
npm install
npm run dev
npm run still
npm run render
```

渲染输出默认位于：

```text
out/ai-course-promo.mp4
```

`out/` 已被 `.gitignore` 忽略，不会提交到 GitHub。

## 后续建议

1. 根据真实招生二维码、联系方式或报名方式补充收尾页。
2. 如需正式发布，可增加真实旁白音频并在 Remotion 中挂载。
3. 继续迭代更多版本：30 秒快节奏版、15 秒家长群版、小红书封面版。
