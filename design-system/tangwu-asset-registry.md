# 汤屋资产分类与命名规范

## 0. 目标

这份文档用于约束 `汤屋` 项目里所有图片、图标、UI 素材、概念图、代码侧资源路径的组织方式。

目标有三个：

1. 分类清晰，不混乱
2. 文件命名统一，不出现来源项目痕迹
3. 后续扩图、改图、替换图时可追踪

---

## 1. 一级分类

所有资产分为 5 类：

### 1.1 `concepts`

用于设计阶段，不直接上生产页面。

内容包括：

- 页面概念图
- 模块概念图
- 状态页概念图

### 1.2 `characters`

角色相关图像。

内容包括：

- 桥守
- AI 玩家头像
- 后续新增角色

### 1.3 `scenes`

场景和叙事背景图。

内容包括：

- 主桥背景
- 桥屋插画
- 章节场景图

### 1.4 `emblems`

纹章、徽记、印章、非功能性图形图标。

内容包括：

- 席位章纹
- 进度章
- 线索章
- 结算印章

### 1.5 `ui`

仅放那些**明确属于 UI 视觉素材**、又不是代码图标的位图资源。

MVP 阶段应尽量少用。

---

## 2. 命名规则

### 2.1 总原则

- 全部使用英文小写
- 只用短横线 `-`
- 不用空格
- 不用中文文件名
- 不用拼音堆叠过长命名
- 不出现任何参考样本的品牌或玩法词面痕迹

### 2.2 命名模板

```text
<category>-<subject>-<variant>-v<version>.<ext>
```

例如：

- `character-bridge-keeper-v1.png`
- `character-lin-shuxue-v1.png`
- `scene-main-bridge-v1.png`
- `scene-bridge-house-v1.png`
- `emblem-bridge-bell-v1.png`
- `concept-setup-screen-v1.png`
- `concept-review-screen-v1.png`

---

## 3. 当前已沉淀的资产

## 3.1 概念图

- `concept-setup-screen-v1.png`
  - 用途：起局设定页概念图
- `concept-review-screen-v1.png`
  - 用途：结算复盘页概念图

## 3.2 角色

- `character-bridge-keeper-v1.png`
  - 用途：左侧桥守主卡
- `character-lin-shuxue-v1.png`
  - 用途：席位 2 头像
- `character-jing-chenzhou-v1.png`
  - 用途：席位 3 头像
- `character-bai-baopu-v1.png`
  - 用途：席位 4 头像

## 3.3 场景

- `scene-main-bridge-v1.png`
  - 用途：主对话区顶部背景
- `scene-bridge-house-v1.png`
  - 用途：左侧故事面板插画

## 3.4 纹章

- `emblem-bridge-bell-v1.png`
  - 用途：席位章纹 / 通用桥铃章

---

## 4. 目录结构

```text
tangwu-studio/
  design-system/
    concepts/
      concept-setup-screen-v1.png
      concept-review-screen-v1.png
    tangwu-image-prompt-bible.md
    tangwu-asset-registry.md
  tangwu-mvp/
    public/
      assets/
        characters/
        scenes/
        emblems/
        ui/
```

---

## 5. 代码引用规则

### 5.1 路径规则

代码中统一使用：

- `/assets/characters/...`
- `/assets/scenes/...`
- `/assets/emblems/...`

不要把设计阶段概念图直接拿去页面中使用。

### 5.2 图标规则

- 功能型小图标优先用代码 SVG
- 世界观型徽记优先用 `emblems`
- 不再引用原仓库任何图片路径

---

## 6. 抄袭风险规避规则

为了降低“直接搬运参考样本”嫌疑，后续实现必须遵守：

1. 不复用原项目图片文件
2. 不沿用原项目品牌名称、变量前缀、存储 key 命名
3. 不复制原项目文案
4. 不复制原项目独特角色和规则表达
5. 页面可以借鉴布局密度和交互气质，但组件结构与业务逻辑要重新组织

---

## 7. 当前执行结论

从现在开始：

- 原参考仓库只作为参考样本保留
- 正式实现全部进入 `tangwu-mvp`
- 所有新文件都不得携带来源项目名称痕迹

