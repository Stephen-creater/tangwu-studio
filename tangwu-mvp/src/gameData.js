export const TOTAL_SEATS = 4;
export const DEFAULT_QUESTION_LIMIT = 12;
export const DEFAULT_GUESS_LIMIT = 3;

export const themes = [
  {
    id: "bridge",
    title: "失忆往事",
    subtitle: "桥雾旧案",
    lead: "从桥、铃声与尸体状态，一层层倒推真正的死亡时间。",
    description: "线索骨架清晰，适合第一碗汤。",
    badge: "桥守线",
    image: "/assets/scenes/scene-main-bridge-v1.png",
    storyImage: "/assets/scenes/scene-bridge-house-v1.png",
    tone: "bridge",
    starterQuestions: [
      "死者和我有关吗？",
      "尸体真的昨夜才出现吗？",
      "桥守的铃声是在提醒什么？"
    ]
  },
  {
    id: "archive",
    title: "古屋秘闻",
    subtitle: "封闭旧宅",
    lead: "不要先追鬼影，先追第三套餐具、药渍与楼梯上的磨痕。",
    description: "更偏向封闭空间与家族隐情。",
    badge: "旧宅线",
    image: "/assets/scenes/scene-bridge-house-v1.png",
    storyImage: "/assets/scenes/scene-bridge-house-v1.png",
    tone: "archive",
    starterQuestions: [
      "屋里是否真的只有两个人？",
      "第三只碗是不是关键？",
      "屋主在隐瞒家人吗？"
    ]
  },
  {
    id: "dream",
    title: "幻境梦魇",
    subtitle: "镜雾错觉",
    lead: "表面像灵异事件，真正关键却是反射、缺失物与错位视角。",
    description: "误导更多，更考验反向推理。",
    badge: "镜廊线",
    image: "/assets/scenes/scene-main-bridge-v1.png",
    storyImage: "/assets/scenes/scene-main-bridge-v1.png",
    tone: "dream",
    starterQuestions: [
      "我看到的是人还是反射？",
      "少掉的那盏灯重要吗？",
      "有人在故意制造人数错觉吗？"
    ]
  }
];

export const difficulties = [
  {
    id: "easy",
    title: "入门",
    note: "桥守更愿意给出直接线索。",
    questionLimit: 14,
    guessLimit: 4,
    helper: "适合第一次体验，尽量先把因果链问完整。"
  },
  {
    id: "normal",
    title: "普通",
    note: "节奏平衡，适合作为默认开局。",
    questionLimit: DEFAULT_QUESTION_LIMIT,
    guessLimit: DEFAULT_GUESS_LIMIT,
    helper: "先锁定关键物件，再追问时间差和人物关系。"
  },
  {
    id: "hard",
    title: "困难",
    note: "可试错空间更少，误导更强。",
    questionLimit: 10,
    guessLimit: 2,
    helper: "不要问泛问题，优先追问最反常的细节。"
  }
];

export const seatProfiles = [
  {
    id: "seat-1",
    humanName: "你",
    aiName: "雁回",
    avatar: "/assets/characters/character-jing-chenzhou-v1.png"
  },
  {
    id: "seat-2",
    humanName: "同行者甲",
    aiName: "林疏雪",
    avatar: "/assets/characters/character-lin-shuxue-v1.png"
  },
  {
    id: "seat-3",
    humanName: "同行者乙",
    aiName: "景沉舟",
    avatar: "/assets/characters/character-jing-chenzhou-v1.png"
  },
  {
    id: "seat-4",
    humanName: "同行者丙",
    aiName: "白抱朴",
    avatar: "/assets/characters/character-bai-baopu-v1.png"
  }
];

export const scenarios = [
  {
    id: "bridge-night",
    themeId: "bridge",
    chapter: "桥守卷一",
    title: "雾锁汤屋桥",
    setupCopy:
      "夜里桥下出现了一具白衣尸体。桥守不阻拦你，却只肯用“是 / 否 / 无关”回答问题。",
    opening:
      "山中有汤屋，汤屋有一桥，名曰“忘川”。你半夜听见桥上传来女子的呼救声。赶到桥边时，桥下深潭里已漂着一具白衣尸体，手里紧攥着一枚褪色玉佩。",
    summary:
      "桥守知道昨夜的呼救只是烟幕，真正应该追问的是尸体状态、玉佩和桥下痕迹。",
    truth:
      "死者并不是昨夜才来到桥边的陌生人，而是你失散多年的妹妹。她早在数日前身亡，被人挪到桥边伪装成昨夜坠桥。桥守的铃声并非招魂，而是在提醒你：不要只盯着桥上的“呼救”，而要追问玉佩、尸体状态和桥下痕迹。真正的凶手是同行商贩，他认出玉佩后担心旧案败露，才制造意外坠桥的假象。",
    clueCards: [
      {
        id: "bridge-stranger",
        title: "死者并非陌生人",
        image: "/assets/clues/clue-jade-pendant-v1.png"
      },
      {
        id: "bridge-timeline",
        title: "并非昨夜才坠桥",
        image: "/assets/clues/clue-bridge-fibers-v1.png"
      },
      {
        id: "bridge-old-case",
        title: "玉佩与旧案有关",
        image: "/assets/clues/clue-old-case-pendant-v1.png"
      },
      {
        id: "bridge-warning",
        title: "桥守的铃声是提醒",
        image: "/assets/clues/clue-warning-bell-v1.png"
      },
      {
        id: "bridge-staged",
        title: "凶手试图伪装成意外",
        image: "/assets/clues/clue-bridge-fibers-v1.png"
      }
    ],
    keywords: [
      ["死者", "不是", "陌生人"],
      ["妹妹", "失散"],
      ["尸体", "不是", "昨夜"],
      ["玉佩", "旧案"],
      ["商贩", "伪装", "意外"]
    ],
    answers: [
      {
        match: ["死者", "你", "有关"],
        answer: "是",
        clueId: "bridge-stranger"
      },
      {
        match: ["外来", "事件"],
        answer: "否"
      },
      {
        match: ["桥", "下", "尸体", "刻意"],
        answer: "是",
        clueId: "bridge-staged"
      },
      {
        match: ["昨夜", "才", "死"],
        answer: "否",
        clueId: "bridge-timeline"
      },
      {
        match: ["玉佩", "关键"],
        answer: "是",
        clueId: "bridge-old-case"
      },
      {
        match: ["桥守", "提醒"],
        answer: "是",
        clueId: "bridge-warning"
      }
    ],
    aiQuestions: {
      "seat-2": [
        "这起事件和死者身份有关吗？",
        "玉佩是不是能确认死者是谁？",
        "昨夜的呼救声本身有误导作用吗？"
      ],
      "seat-3": [
        "尸体并不是昨夜才落到桥下的吗？",
        "桥守敲铃是在提醒我们别看错重点吗？",
        "是不是有人故意把尸体挪到了桥边？"
      ],
      "seat-4": [
        "真凶更像熟人而不是路人吗？",
        "桥下痕迹比桥面本身更关键吗？",
        "这件事与旧案有关吗？"
      ]
    },
    keeperLine:
      "铃声不会替你们说真相，但它会告诉你们，该看向哪里。"
  },
  {
    id: "archive-secret",
    themeId: "archive",
    chapter: "旧宅卷二",
    title: "古屋里的第三套餐具",
    setupCopy:
      "借宿旧宅的一夜后，餐桌上多出一只沾着药渍的汤碗。所有人都说昨晚明明只坐了两个人。",
    opening:
      "你们借宿在山腰旧宅。夜里阁楼不断传来细碎脚步声，屋主却坚称宅中只有自己与女儿。清晨时，桌上多出第三只沾着药渍的汤碗，楼梯扶手还留着新鲜磨痕。",
    summary:
      "如果你先追鬼影，就会被古屋带偏；真正该追问的是第三只碗、药渍和屋主为什么坚持说家里没有第三个人。",
    truth:
      "旧宅里一直藏着屋主失智多年的母亲。她夜里会从封着的侧阁出来找药汤，脚步声和多出来的碗都来自她。屋主对外谎称宅里只有两个人，是为了掩饰母亲的病情和家中长期的失控状态。药渍、第三只碗、楼梯扶手上的磨痕，说明真正的问题不是闹鬼，而是有人一直在隐瞒“屋里其实还有第三个人”。",
    clueCards: [
      {
        id: "archive-third-person",
        title: "屋里并不止两个人",
        image: "/assets/clues/clue-old-case-pendant-v1.png"
      },
      {
        id: "archive-third-bowl",
        title: "第三只碗不是误放",
        image: "/assets/clues/clue-jade-pendant-v1.png"
      },
      {
        id: "archive-medicine",
        title: "药渍对应长期服药",
        image: "/assets/clues/clue-warning-bell-v1.png"
      },
      {
        id: "archive-railing",
        title: "楼梯扶手有人长期借力",
        image: "/assets/clues/clue-bridge-fibers-v1.png"
      },
      {
        id: "archive-elder",
        title: "屋主在隐瞒家中老人",
        image: "/assets/clues/clue-old-case-pendant-v1.png"
      }
    ],
    keywords: [
      ["屋里", "不止", "两个人"],
      ["第三只碗", "关键"],
      ["药渍", "服药"],
      ["扶手", "借力"],
      ["屋主", "隐瞒", "老人"]
    ],
    answers: [
      {
        match: ["屋里", "第三个人"],
        answer: "是",
        clueId: "archive-third-person"
      },
      {
        match: ["鬼"],
        answer: "否"
      },
      {
        match: ["第三只碗", "关键"],
        answer: "是",
        clueId: "archive-third-bowl"
      },
      {
        match: ["药", "关键"],
        answer: "是",
        clueId: "archive-medicine"
      },
      {
        match: ["扶手", "关键"],
        answer: "是",
        clueId: "archive-railing"
      },
      {
        match: ["屋主", "隐瞒", "家人"],
        answer: "是",
        clueId: "archive-elder"
      }
    ],
    aiQuestions: {
      "seat-2": [
        "屋主其实没有说实话，对吗？",
        "第三只碗并不是清晨才被放出来的吗？",
        "这和家里长期照顾某个人有关吗？"
      ],
      "seat-3": [
        "阁楼脚步声并不是灵异现象吗？",
        "药渍说明有人需要固定喝药吗？",
        "楼梯扶手上的磨痕是行动不便留下的吗？"
      ],
      "seat-4": [
        "屋里其实一直住着第三个人？",
        "被隐藏的人是老人而不是孩子吗？",
        "屋主隐瞒的动机和家人病情有关吗？"
      ]
    },
    keeperLine:
      "古屋最会骗人，因为很多人宁可信鬼，也不愿问家里真正少了什么。"
  },
  {
    id: "dream-corridor",
    themeId: "dream",
    chapter: "镜廊卷三",
    title: "镜雾回廊的缺口",
    setupCopy:
      "灯会散场后，你在镜廊尽头看见“另一个自己”转身离开，可同行人却说那条走廊根本没人经过。",
    opening:
      "你们穿过镜雾长廊时，尽头忽然出现了一个与你身形相同的人影。对方转身消失，只在地上留下了一盏沾灰的纸灯。同行者说自己从头到尾没看见任何人，可长廊出口偏偏少了一盏灯。",
    summary:
      "这碗汤会故意把你引向“是不是撞鬼”，但真正的切口在镜面角度、纸灯数量和有人想伪装真实经过人数。",
    truth:
      "你看到的并不是鬼影，而是同行者提前布置的对镜和错位灯架形成的反射。他取走了一盏灯，想把真正去过禁区的人数伪装成只有一人，从而抹掉自己先行经过的痕迹。地上的灰、少掉的那盏纸灯和镜面角度共同说明：重点不在“你看到谁”，而在有人故意制造了人数错觉。",
    clueCards: [
      "看到的是反射而非鬼影",
      "少掉的一盏灯非常关键",
      "地上的灰痕说明有人先行通过",
      "有人在制造人数错觉",
      "同行者提前布置过镜面"
    ],
    keywords: [
      ["不是", "鬼影"],
      ["镜子", "反射"],
      ["少", "一盏灯"],
      ["灰痕", "先行"],
      ["人数", "错觉"]
    ],
    answers: [
      {
        match: ["鬼"],
        answer: "否",
        clue: "看到的是反射而非鬼影"
      },
      {
        match: ["镜", "反射"],
        answer: "是",
        clue: "同行者提前布置过镜面"
      },
      {
        match: ["灯", "关键"],
        answer: "是",
        clue: "少掉的一盏灯非常关键"
      },
      {
        match: ["灰", "痕", "关键"],
        answer: "是",
        clue: "地上的灰痕说明有人先行通过"
      },
      {
        match: ["人数", "误导"],
        answer: "是",
        clue: "有人在制造人数错觉"
      },
      {
        match: ["同行者", "提前"],
        answer: "是",
        clue: "同行者提前布置过镜面"
      }
    ],
    aiQuestions: {
      "seat-2": [
        "我看到的并不是超自然现象，对吗？",
        "镜面和走廊结构比人影本身更关键吗？",
        "少掉的一盏纸灯其实是人为拿走的？"
      ],
      "seat-3": [
        "有人想让我们误以为只通过了一个人吗？",
        "地上的灰痕能证明有人先行去过禁区吗？",
        "同行者提前做过布置？"
      ],
      "seat-4": [
        "关键是反射而不是伪装成我本人吗？",
        "真正的目的在于抹掉经过人数？",
        "这件事是人为制造的视错觉？"
      ]
    },
    keeperLine:
      "镜子不会说谎，它只会替真正布置过它的人说谎。"
  }
];

export function getThemeById(themeId) {
  return themes.find((theme) => theme.id === themeId) ?? themes[0];
}

export function getDifficultyConfig(difficultyId) {
  return (
    difficulties.find((difficulty) => difficulty.id === difficultyId) ?? difficulties[1]
  );
}

export function getScenarioByTheme(themeId) {
  return scenarios.find((scenario) => scenario.themeId === themeId) ?? scenarios[0];
}
