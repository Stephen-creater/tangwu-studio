# 汤屋视觉提示词资产库

## 0. 目标

这份文档是 `汤屋` 项目所有生图素材的统一母版。

用途不是“写一条好看的 prompt”，而是保证下面这些东西在后续所有界面里都保持一致：

- 世界观气质一致
- 角色脸和服装风格一致
- 背景场景的光线与雾感一致
- 纹章、图标、徽记、章纹的语言一致
- UI 中嵌入的图片素材不彼此打架

后面无论是首页、对话页、结算页、玩家头像、桥守、桥景、徽章、纹章、进度章、章回插图，都必须从这套提示词系统衍生，而不是临时写 prompt。

---

## 1. 项目视觉总方向

### 核心气质

`东方志怪` + `古桥迷雾` + `纸本档案感` + `高端叙事游戏界面`

不是传统仙侠。
不是暗黑恐怖。
不是赛博国风。
不是通用古风海报。

它更接近：

- 雾中山桥
- 失落记忆
- 守桥问答
- 旧纸、墨迹、木、铜、石
- 克制而高级的叙事 UI

### 体验关键词

- 克制
- 安静
- 神秘
- 苍老
- 有重量
- 不是吓人，而是压得住气氛

### 审美原则

- 留白多，但不空
- 材质要真实，不塑料
- 光源柔和，不霓虹
- 画面细节丰富，但不花
- 人物要像“画中人”，不是二次元卡通，也不是西式写实游戏脸

---

## 2. 全局风格锚点

所有图像都必须遵守以下统一锚点。

### 2.1 时代与文化语境

- 架空东方古代
- 带一点民间志怪和审判感
- 不出现明显现代物件
- 不出现科技感 UI 元素
- 不出现西幻盔甲、枪械、机械义体

### 2.2 色彩系统

主色：

- 温纸白 `#f3ecdf`
- 旧宣纸米色 `#e8dcc7`
- 墨黑 `#1d1a17`
- 雾灰 `#6a655d`
- 深木褐 `#4b3a2c`

强调色：

- 暗金 `#9a7a49`
- 铜棕 `#86633e`
- 灯火暖黄 `#d7b676`
- 朱砂印章红 `#8c3528`

禁用倾向：

- 亮紫
- 霓虹蓝
- 高饱和荧光绿
- 欧美魔幻金属蓝
- 赛博荧光粉

### 2.3 材质系统

- 旧纸
- 轻微毛边纸张
- 墨迹晕染
- 老木
- 雾湿石桥
- 磨损铜件
- 布袍、麻布、蓑衣、斗笠

避免：

- 塑料光泽
- 电商 3D 渲染感
- 磨皮脸
- 光污染

### 2.4 镜头语言

- 半身肖像：靠近、静止、有呼吸感
- 场景镜头：中远景、纵深强、雾里见桥
- 图标/纹章：正视角、平整、对称、像印记

---

## 3. 统一母提示词

下面这条是所有素材的“母提示词骨架”。

后面不同类型素材都必须从这里长出来。

```text
Tang Wu, premium Chinese narrative mystery game art, ancient eastern bridge in fog, archival paper texture, restrained cinematic lighting, ink wash atmosphere, aged wood and bronze details, off-white parchment palette, charcoal black, mist gray, muted gold, vermilion seal accents, elegant and solemn, highly detailed, atmospheric, tactile materials, story-rich, no modern objects, no sci-fi, no neon, no anime, no cartoon, no glossy plastic
```

---

## 4. 统一负面提示词

后续所有图都默认带这组负面词。

```text
anime, manga, chibi, cartoon, cyberpunk, neon, futuristic UI, modern city, western fantasy armor, plastic texture, glossy 3d toy, oversaturated colors, purple glow, game HUD overlay, low detail face, duplicated limbs, extra fingers, malformed hands, blurry eyes, cheap fantasy poster, mobile game ad style, stock photo smile, text artifacts, watermark, logo, random letters
```

如果是人物图，还要额外加：

```text
deformed face, beauty filter skin, idol makeup, k-pop styling, modern hairstyle, glossy lipstick, fashion photography pose
```

如果是场景图，还要额外加：

```text
sunny vacation landscape, bright blue sky, modern architecture, western castle, sci-fi fog, floating UI symbols
```

---

## 5. 角色类提示词模板

## 5.1 桥守肖像

### 角色定义

- 老年男性
- 守桥数百年的感觉
- 穿旧蓑衣、斗笠或破旧深色长袍
- 手持杖或桥铃
- 不是妖怪脸，但有“看过太多人”的沧桑感

### 模板

```text
Tang Wu bridge keeper portrait, elderly eastern guardian standing beside a mist bridge, weathered face, long gray beard, deep-set eyes, worn straw hat, dark layered robe, old wooden staff with small hanging bell, solemn and quiet expression, ancient ferryman-like presence, parchment and ink atmosphere, restrained warm-gray palette, premium narrative game character art, highly detailed fabric and skin texture, realistic painterly illustration
```

### 要求

- 表情不能凶神恶煞
- 应该像“克制、试探、沉默寡言”
- 眼神要有判断感

---

## 5.2 AI 玩家头像模板

### 角色原则

MVP 阶段 AI 玩家头像不是“随机古风俊男美女”，而是要像同一世界里的穿行者。

统一要求：

- 半写实插画
- 年龄层有区分
- 服装都属于同一世界
- 不同席位有不同气质，但同属一个项目

### 模板

```text
Tang Wu traveler portrait, eastern narrative mystery game character, bust portrait, soft parchment palette, ink-wash atmosphere, subtle fog lighting, antique robe details, calm expression, premium story game illustration, realistic painterly style, clean background, circular portrait composition, no modern fashion
```

### 席位变化词

#### 席位 2：林疏雪

```text
young eastern woman, pale robe, quiet and intelligent, composed gaze, minimal ornament, silver-gray and warm ivory palette
```

#### 席位 3：景沉舟

```text
young eastern man, dark robe, sharp but restrained expression, traveler-scholar aura, muted charcoal and brown palette
```

#### 席位 4：白抱朴

```text
middle-aged eastern man, weathered and ascetic, rough cloth layers, herbalist or hermit aura, slightly older face, calm and heavy presence
```

### 头像统一约束

- 构图统一：胸像或肩像
- 视线统一：略朝镜头或略偏
- 背景统一：干净浅雾或纸本底
- 不要纯摄影感

---

## 6. 场景类提示词模板

## 6.1 主桥背景图

这是中间对话区顶部大图的核心资产。

### 画面要求

- 雾中桥
- 纵深强
- 桥尽头有灯或门楼
- 不是旅游风景
- 更像“要进去问答案的地方”

### 模板

```text
Tang Wu central bridge scene, ancient suspension bridge disappearing into dense mountain fog, dim lanterns, distant gate pavilion, wet wood planks, black pine silhouettes, quiet night atmosphere, restrained cinematic composition, premium Chinese narrative mystery game background, strong depth, soft warm lantern glow against cold mist, highly detailed painterly environment
```

### 构图要求

- 适合横向裁切
- 中景到远景
- 中央有明显引导线

---

## 6.2 左侧故事卡背景插图

这张可以和主桥图不同，更偏插画叙事。

### 模板

```text
Tang Wu story panel illustration, lonely bridge house in mountain mist, old stone steps, rain-soaked wood, dim window light, eastern ghost-story mood, elegant parchment tone, detailed painterly storytelling image, atmospheric and quiet
```

---

## 7. 徽章、纹章、图标类提示词模板

这类素材必须统一成“印记系统”，不能一会儿是写实图标，一会儿是扁平线性图标。

### 统一原则

- 看起来像桥上古印
- 对称
- 线条克制
- 像金属压印或墨印
- 不花哨

### 模板

```text
Tang Wu emblem design, ancient eastern seal-like symbol, symmetrical linework, bridge mystery motif, refined bronze stamp aesthetic, clean circular crest, parchment-compatible, elegant game icon asset, minimal but story-rich, no text, isolated on transparent or plain background
```

### MVP 需要的徽记

1. 玩家席位纹章
2. 线索收集徽记
3. 故事回顾纹章
4. 设置纹章
5. 结算印章

### 设计变化词

- bridge
- bell
- ink seal
- lantern
- mist gate
- ferryman staff

---

## 8. UI 局部装饰图模板

这类素材不是主插图，而是用于局部点缀：

- 页面角落章纹
- 小型边角图形
- 卡片底纹
- 章节印记

### 模板

```text
Tang Wu ornamental UI motif, antique eastern print detail, ink seal fragment, subtle decorative corner emblem, parchment-friendly, elegant, restrained, game interface embellishment, isolated
```

---

## 9. MVP 第一批必生资产清单

先不要无限发散，MVP 只生真正要上屏的东西。

### A. 核心界面资产

1. 桥守肖像
2. 中间主桥背景图
3. 左侧故事卡插图或补充场景图

### B. 头像资产

1. 林疏雪
2. 景沉舟
3. 白抱朴

### C. 徽记资产

1. 通用席位章纹
2. 线索章纹
3. 回顾章纹
4. 结算章纹

### D. 可后置资产

1. 首页附加插画
2. 章节封面
3. 成就卡图
4. 分享海报图

---

## 10. 一致性执行规则

后面每次生图必须先检查这 6 件事：

1. 是否沿用统一母提示词
2. 是否沿用统一负面词
3. 是否保持同一色盘
4. 是否仍处于“东方古桥迷雾叙事游戏”语境
5. 是否避免滑向“古风立绘手游广告”
6. 是否和当前已通过的图放在一起看起来像同一款游戏

如果新图单看不错，但和旧图放在一起不像同一个产品，也算失败。

---

## 11. 当前执行策略

MVP 阶段按这个顺序执行：

1. 先用这套资产库生成两张关键界面概念图
   - 开局 / 设定界面
   - 对话 / 推理主界面
2. 确认细分界面语言一致
3. 再生成第一批正式素材
   - 桥守
   - 三个 AI 玩家头像
   - 主桥图
   - 基础章纹
4. 最后落地到代码

这样可以最大限度避免“先做代码，后补素材，结果整体风格崩掉”。
