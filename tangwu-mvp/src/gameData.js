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
    lead: "不要先追鬼影，先追为什么一个“已经死了的人”还会在夜里吃药、上下楼。",
    description: "从闹鬼传闻一路拆到户籍、债务与被藏起来的第三个人。",
    badge: "旧宅线",
    image: "/assets/scenes/scene-bridge-house-v1.png",
    storyImage: "/assets/scenes/scene-bridge-house-v1.png",
    tone: "archive",
    starterQuestions: [
      "屋里其实一直还有第三个人吗？",
      "第三只碗和那个人夜里出来吃药有关吗？",
      "楼上那位人，在官簿上是不是已经算“死了”？"
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
      "借宿旧宅的一夜后，餐桌上多出第三只带着苦药味的汤碗。屋主却坚持昨晚明明只有两个人吃饭，而那扇上锁的东阁里，本该谁都没有。",
    opening:
      "你们借宿在山腰旧宅。屋主老陈对外说，这宅子里如今只剩他与守寡的儿媳两个人，东阁久无人住，夜里千万别靠近。可入夜后，封着的东阁里不断传来细碎脚步声，像有人拖着鞋底在木板上来回磨蹭；楼梯扶手靠下的一截被磨得发亮，像总有人扶着那里慢慢下楼。清晨时，桌上却多出第三只带着苦药味的汤碗，碗沿留着浅浅一圈缺口牙印，药渍还没全干。老陈看到那只碗时脸色明显变了，却仍咬定昨夜绝没有第三个人出现。同行的人开始怀疑旧宅闹鬼，可你总觉得，这屋里真正反常的不是脚步声，而是为什么有人要拼命证明“楼上那个人根本不存在”。",
    summary:
      "如果你先追鬼影，就会被古屋带偏；真正该追问的不是“有没有东西在楼上”，而是“为什么明明有人吃药、走楼梯、留下第三只碗，屋主却还要说屋里只有两个人”。",
    truth:
      "楼上一直藏着老陈年迈失智的母亲陈老太。她中风后行动迟缓，夜里常会扶着楼梯下来找药汤，也会把儿子早年留下的旧碗摸出来自己吃东西，所以才留下第三只药碗、缺口牙印和楼梯扶手靠下的磨痕。真正的关键不是“楼上有没有鬼”，而是为什么老陈非要咬死屋里只有两个人。半年前，老陈的儿子死后留下大笔欠账，宅子的契纸原本在陈老太名下；若债主和官差知道陈老太仍活着，就能逼她按手印、卖宅抵债。为了保住房子，也为了不让行动混乱的老人被拖去官面上折腾，老陈托人把陈老太在户籍上报成了病故。于是楼上那位老人就变成了一个荒唐的存在：她活在屋里，却已经死在官簿上。老陈越是否认第三个人，越说明这不是闹鬼，而是一桩被债务和孝心一同逼出来的活人秘密。",
    clueCards: [
      {
        id: "archive-third-person",
        title: "楼上一直藏着第三个人",
        image: "/assets/clues/clue-old-case-pendant-v1.png"
      },
      {
        id: "archive-third-bowl",
        title: "第三只碗属于夜里出来吃药的人",
        image: "/assets/clues/clue-jade-pendant-v1.png"
      },
      {
        id: "archive-medicine",
        title: "苦药渍指向长期服药的病人",
        image: "/assets/clues/clue-warning-bell-v1.png"
      },
      {
        id: "archive-railing",
        title: "低处磨亮的扶手在帮一个行动不便的老人",
        image: "/assets/clues/clue-bridge-fibers-v1.png"
      },
      {
        id: "archive-elder",
        title: "楼上那位老人活在屋里，死在官簿上",
        image: "/assets/clues/clue-old-case-pendant-v1.png"
      }
    ],
    keywords: [
      ["屋里", "不止", "两个人"],
      ["第三只碗", "夜里", "吃药"],
      ["药渍", "病人"],
      ["扶手", "老人", "行动不便"],
      ["官簿", "已经死了"]
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
        match: ["楼上", "有人"],
        answer: "是",
        clueId: "archive-third-person"
      },
      {
        match: ["第三只碗", "关键"],
        answer: "是",
        clueId: "archive-third-bowl"
      },
      {
        match: ["第三只碗", "吃药"],
        answer: "是",
        clueId: "archive-third-bowl"
      },
      {
        match: ["牙印", "关键"],
        answer: "是",
        clueId: "archive-third-bowl"
      },
      {
        match: ["药", "关键"],
        answer: "是",
        clueId: "archive-medicine"
      },
      {
        match: ["药渍", "病人"],
        answer: "是",
        clueId: "archive-medicine"
      },
      {
        match: ["扶手", "关键"],
        answer: "是",
        clueId: "archive-railing"
      },
      {
        match: ["扶手", "老人"],
        answer: "是",
        clueId: "archive-railing"
      },
      {
        match: ["行动不便", "老人"],
        answer: "是",
        clueId: "archive-railing"
      },
      {
        match: ["屋主", "隐瞒", "家人"],
        answer: "是",
        clueId: "archive-elder"
      },
      {
        match: ["官簿", "死了"],
        answer: "是",
        clueId: "archive-elder"
      },
      {
        match: ["户籍", "死了"],
        answer: "是",
        clueId: "archive-elder"
      },
      {
        match: ["债主", "房契"],
        answer: "是",
        clueId: "archive-elder"
      }
    ],
    aiQuestions: {
      "seat-2": [
        "屋里其实一直还有第三个人，对吗？",
        "第三只碗不是摆给鬼的，而是给一个活人用的吗？",
        "老陈不肯承认那个人存在，是因为那个人在官面上已经“死了”吗？"
      ],
      "seat-3": [
        "阁楼脚步声不是灵异，而是有人夜里自己出来找药，对吗？",
        "药渍说明楼上那个人长期需要服药吗？",
        "楼梯扶手靠下的磨痕，是行动不便的老人长期借力留下的吗？"
      ],
      "seat-4": [
        "被隐藏起来的第三个人，是老人而不是孩子吗？",
        "屋主坚持“屋里只有两个人”，真正原因和债务或房契有关吗？",
        "楼上那位老人，其实活在屋里，却早就在官簿上被报成死了，对吗？"
      ]
    },
    keeperLine:
      "这宅子最会骗人的，不是脚步声，而是人人都被劝着去相信楼上根本没人。"
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
