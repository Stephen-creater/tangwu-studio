export const TOTAL_SEATS = 4;
export const DEFAULT_QUESTION_LIMIT = 12;
export const DEFAULT_GUESS_LIMIT = 3;

export const themes = [
  {
    id: "bridge",
    title: "伪时疑案",
    subtitle: "桥雾伪证",
    lead: "别先追她为什么落水，先追为什么所有细节都刚好把人往“月半祭夫失足坠桥”上推。",
    description: "从“她刚刚坠桥”的自然误解，一层层拆到死亡时间伪造与现场包装。",
    badge: "桥守线",
    image: "/assets/scenes/scene-main-bridge-v1.png",
    storyImage: "/assets/scenes/scene-bridge-house-v1.png",
    tone: "bridge",
    starterQuestions: [
      "桥上的呼救声真的是死者发出的吗？",
      "她在深夜之前就已经死了吗？",
      "那声呼救是在伪造她刚刚出事的时间吗？"
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
    avatar: "/assets/characters/character-jing-chenzhou-v3.png"
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
      "深夜，忘川桥上传来女子求救。众人提灯赶到时，桥下只剩一具白衣女尸，手里攥着亡夫留下的玉佩，身子却冷得不太像刚落水。镇上人都说她是月半祭夫时刚刚坠桥，可桥守觉得，那声喊来得太巧。",
    opening:
      "深夜，山中汤屋前的忘川桥上传来一声女人的“救我”。桥守与住客提灯赶去时，桥面上空无一人，桥下却已经漂着一具白衣女尸。她手里攥着一枚贴身玉佩，指节冷硬得几乎掰不开，鞋底却异常干净，桥栏边还留着几道新磨出来的拖擦痕。偏偏今夜是她亡夫忌辰前的月半，镇上人都知道她逢这夜会带着玉佩去桥边祭纸。大家都认定她是祭夫时呼救后失足坠桥，可桥守偏偏不信。",
    summary:
      "这碗汤最诡异的地方，不是“她为什么落水”，而是为什么每个细节都刚好把人往“月半祭夫、深夜失足”上推。",
    truth:
      "死者名叫沈青黛，是汤屋亡东家的弟媳，近月一直代管账房。她亡夫死后，每逢月半都会带着亡夫留下的玉佩去忘川桥边烧纸，这件事镇上几乎人人都知道。陆怀舟是汤屋代理掌柜，半年里一直侵吞赈银、私改账本，还借夜间封桥时替盐贩暗中转货。沈青黛在旧账房翻出了真账，决定第二天天亮就下山报官。傍晚两人在账房争执，陆怀舟情急之下用捆账绳勒死了她。因为白天已有住客见过他们争吵，他不敢让尸体立刻被发现，于是先把尸体藏进运柴小船，等半夜雾浓时再拖到桥下浅湾。为了替她的死亡时间造假，他学着沈青黛的声线在桥上喊了一声“救我”，故意让桥守和住客都听见，再把她颈间的玉佩扯下塞进已经发僵的手里，磨出桥边拖痕，好把整件事包装成“月半祭夫时，沈青黛独自到桥边，呼救后失足坠桥”。真正关键不在她为什么坠桥，而在那声呼救为什么必须被所有人听见：那不是求救，而是一份替凶手伪造死亡时间的证词。",
    clueCards: [
      {
        id: "bridge-false-cry",
        title: "桥上的呼救不是死者喊的",
        image: "/assets/clues/clue-jade-pendant-v1.png"
      },
      {
        id: "bridge-early-death",
        title: "她在深夜呼救之前就已经死了",
        image: "/assets/clues/clue-bridge-fibers-v1.png"
      },
      {
        id: "bridge-pendant",
        title: "玉佩被人从颈间取下后塞进了掌心",
        image: "/assets/clues/clue-old-case-pendant-v1.png"
      },
      {
        id: "bridge-staged",
        title: "桥边留下的是搬运痕迹",
        image: "/assets/clues/clue-warning-bell-v1.png"
      },
      {
        id: "bridge-time-fake",
        title: "那声呼救是在伪造死亡时间",
        image: "/assets/clues/clue-bridge-fibers-v1.png"
      }
    ],
    keywords: [
      ["呼救", "不是", "死者"],
      ["尸体", "发僵", "提前死亡"],
      ["月半", "祭夫", "玉佩"],
      ["尸体", "拖", "桥下"],
      ["伪造", "死亡时间"]
    ],
    answers: [
      {
        match: ["呼救", "死者"],
        answer: "否",
        clueId: "bridge-false-cry"
      },
      {
        match: ["深夜", "才", "死"],
        answer: "否",
        clueId: "bridge-early-death"
      },
      {
        match: ["尸体", "僵"],
        answer: "是",
        clueId: "bridge-early-death"
      },
      {
        match: ["手", "冷", "发僵"],
        answer: "是",
        clueId: "bridge-early-death"
      },
      {
        match: ["早", "就", "死"],
        answer: "是",
        clueId: "bridge-early-death"
      },
      {
        match: ["尸体", "拖", "桥下"],
        answer: "是",
        clueId: "bridge-staged"
      },
      {
        match: ["桥边", "拖", "痕"],
        answer: "是",
        clueId: "bridge-staged"
      },
      {
        match: ["鞋底", "干净"],
        answer: "是",
        clueId: "bridge-staged"
      },
      {
        match: ["自己", "走到", "桥边"],
        answer: "否",
        clueId: "bridge-staged"
      },
      {
        match: ["玉佩", "原本", "手里"],
        answer: "否",
        clueId: "bridge-pendant"
      },
      {
        match: ["月半", "祭夫"],
        answer: "是",
        clueId: "bridge-pendant"
      },
      {
        match: ["亡夫", "玉佩"],
        answer: "是",
        clueId: "bridge-pendant"
      },
      {
        match: ["玉佩", "关键"],
        answer: "是",
        clueId: "bridge-pendant"
      },
      {
        match: ["玉佩", "死后", "塞"],
        answer: "是",
        clueId: "bridge-pendant"
      },
      {
        match: ["意外", "坠桥"],
        answer: "否",
        clueId: "bridge-time-fake"
      },
      {
        match: ["证人", "活着"],
        answer: "是",
        clueId: "bridge-time-fake"
      },
      {
        match: ["伪造", "死亡", "时间"],
        answer: "是",
        clueId: "bridge-time-fake"
      },
      {
        match: ["死亡", "时间", "关键"],
        answer: "是",
        clueId: "bridge-time-fake"
      },
      {
        match: ["呼救", "凶手"],
        answer: "是",
        clueId: "bridge-false-cry"
      },
      {
        match: ["呼救", "误导"],
        answer: "是",
        clueId: "bridge-false-cry"
      },
      {
        match: ["桥守", "提醒"],
        answer: "是",
        clueId: "bridge-time-fake"
      }
    ],
    aiQuestions: {
      "seat-2": [
        "桥上的呼救声不是死者本人发出的吗？",
        "她在被人听见呼救之前，其实就已经死了吗？",
        "那声呼救是在故意伪造她刚刚出事的时间吗？"
      ],
      "seat-3": [
        "玉佩原本不是握在她手里，而是后来被塞进去的吗？",
        "尸体是从别处拖到桥下来的，对吗？",
        "桥边那些痕迹更像搬运留下的，而不是挣扎留下的吗？"
      ],
      "seat-4": [
        "真正发生在桥上的，不是坠桥，而是有人故意喊了一声“救我”，对吗？",
        "凶手需要让别人相信她是半夜才死的，对吗？",
        "月半祭夫和玉佩这件事，是被人拿来包装现场的吗？"
      ]
    },
    keeperLine:
      "桥上那声求救来得太巧了，巧得像是专门喊给人听的。"
  },
  {
    id: "archive-secret",
    themeId: "archive",
    chapter: "旧宅卷二",
    title: "古屋里的第三套餐具",
    setupCopy:
      "借宿旧宅的一夜后，餐桌上多出一只沾着药渍的汤碗。所有人都说昨晚明明只坐了两个人。",
    opening:
      "你们借宿在山腰旧宅。入夜后，封着的阁楼里不断传来细碎脚步声，像有人拖着鞋底在木板上来回磨蹭；可屋主却始终坚持，宅中只有自己与女儿两个人，还特意叮嘱你们夜里不要离房。清晨时，桌上却多出第三只沾着药渍的汤碗，碗沿残留半圈没擦净的指痕，通往楼上的扶手也添了新鲜磨痕，像有人一夜里反复借力上下。屋主看到那只碗时脸色明显变了，却仍咬定昨晚绝没有第三个人出现。同行的人开始怀疑旧宅闹鬼，但你总觉得，这屋里真正反常的不是脚步声，而是为什么有人要拼命否认“家里还住着另一个人”。",
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
      "你们穿过镜雾长廊时，尽头忽然出现了一个与你身形相同的人影。对方在雾里停了一瞬，像是回头看了你一眼，随后便从镜面与廊柱之间一闪而过，只在地上留下一盏沾灰的纸灯。同行者说自己从头到尾没看见任何人，可长廊出口偏偏少了一盏灯，镜面上还残留着像被人刚刚碰过的雾痕。有人说你是撞了邪，也有人怀疑有人故意混淆视线；但更怪的是，所有人都觉得自己看见了什么，却没人能说清那道人影究竟是从前面跑过去的，还是被镜子映出来的。若真要拆穿这碗汤，恐怕得先问：少掉的那盏灯，到底帮谁藏起了真实人数。",
    summary:
      "这碗汤会故意把你引向“是不是撞鬼”，但真正的切口在镜面角度、纸灯数量和有人想伪装真实经过人数。",
    truth:
      "你看到的并不是鬼影，而是同行者提前布置的对镜和错位灯架形成的反射。他取走了一盏灯，想把真正去过禁区的人数伪装成只有一人，从而抹掉自己先行经过的痕迹。地上的灰、少掉的那盏纸灯和镜面角度共同说明：重点不在“你看到谁”，而在有人故意制造了人数错觉。",
    clueCards: [
      {
        id: "dream-reflection",
        title: "看到的是反射而非鬼影",
        image: "/assets/clues/clue-warning-bell-v1.png"
      },
      {
        id: "dream-lantern",
        title: "少掉的一盏灯非常关键",
        image: "/assets/clues/clue-warning-bell-v1.png"
      },
      {
        id: "dream-dust",
        title: "地上的灰痕说明有人先行通过",
        image: "/assets/clues/clue-bridge-fibers-v1.png"
      },
      {
        id: "dream-headcount",
        title: "有人在制造人数错觉",
        image: "/assets/clues/clue-jade-pendant-v1.png"
      },
      {
        id: "dream-mirror",
        title: "同行者提前布置过镜面",
        image: "/assets/clues/clue-old-case-pendant-v1.png"
      }
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
        clueId: "dream-reflection"
      },
      {
        match: ["镜", "反射"],
        answer: "是",
        clueId: "dream-mirror"
      },
      {
        match: ["灯", "关键"],
        answer: "是",
        clueId: "dream-lantern"
      },
      {
        match: ["灰", "痕", "关键"],
        answer: "是",
        clueId: "dream-dust"
      },
      {
        match: ["人数", "误导"],
        answer: "是",
        clueId: "dream-headcount"
      },
      {
        match: ["同行者", "提前"],
        answer: "是",
        clueId: "dream-mirror"
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
