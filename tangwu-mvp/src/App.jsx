import { useEffect, useMemo, useRef, useState } from "react";
import {
  TOTAL_SEATS,
  difficulties,
  getDifficultyConfig,
  getScenarioByTheme,
  getThemeById,
  seatProfiles,
  themes
} from "./gameData";
import { generateAiQuestion, judgeGuess } from "./lib/minimax";

const DEFAULT_SETUP = {
  humanCount: 1,
  themeId: "bridge",
  difficultyId: "easy"
};

function buildPlayers(humanCount) {
  return seatProfiles.map((profile, index) => ({
    id: profile.id,
    seat: index + 1,
    name: index < humanCount ? profile.humanName : profile.aiName,
    type: index < humanCount ? "human" : "ai",
    avatar: profile.avatar,
    questionsAsked: 0,
    clueHits: 0,
    correctGuesses: 0
  }));
}

function createInitialGame(humanCount, themeId, difficultyId) {
  const scenario = getScenarioByTheme(themeId);
  const difficulty = getDifficultyConfig(difficultyId);

  return {
    phase: "setup",
    humanCount,
    themeId,
    difficultyId,
    questionLimit: difficulty.questionLimit,
    guessLimit: difficulty.guessLimit,
    players: buildPlayers(humanCount),
    scenario,
    activeSeat: 1,
    totalQuestions: 0,
    guessesUsed: 0,
    discoveredClues: [],
    timeline: [
      {
        id: "opening-1",
        type: "keeper",
        speaker: "桥守",
        seatId: "keeper",
        text: scenario.keeperLine,
        clue: null
      }
    ],
    pendingGuess: "",
    pendingQuestion: "",
    result: null
  };
}

function normalize(text) {
  return text
    .replace(/[\s，。、“”‘’？！!?,.:：;；（）()《》<>「」『』—-]/g, "")
    .toLowerCase();
}

const negationTerms = ["不是", "并不是", "并非", "没有", "不算", "非"];

const semanticAnswerRules = {
  "bridge-night": [
    {
      all: [
        ["呼救", "求救", "喊救命", "喊声", "叫声", "声音", "那声"],
        ["死者", "本人", "她本人", "受害者", "白衣女子", "尸体"]
      ],
      negatedAnswer: "是",
      answer: "否",
      clueId: "bridge-false-cry"
    },
    {
      all: [
        ["呼救", "求救", "喊救命", "喊声", "叫声", "声音", "那声"],
        ["别人", "有人", "另一个人", "假扮", "模仿", "冒充", "伪装", "误导"]
      ],
      answer: "是",
      clueId: "bridge-false-cry"
    },
    {
      all: [
        ["尸体", "死者", "受害者"],
        ["半夜", "深夜", "刚刚", "刚才", "听到以后", "呼救后"],
        ["坠桥", "掉下", "落到", "落下", "桥下", "死"]
      ],
      negatedAnswer: "是",
      answer: "否",
      clueId: "bridge-early-death"
    },
    {
      all: [
        ["死者", "受害者", "尸体"],
        ["早就", "之前", "傍晚", "提前", "早已", "先死", "深夜前"]
      ],
      answer: "是",
      clueId: "bridge-early-death"
    },
    {
      all: [
        ["尸体", "手", "指节", "身子", "身体"],
        ["冷", "凉", "发僵", "僵硬", "掰不开", "尸僵"]
      ],
      answer: "是",
      clueId: "bridge-early-death"
    },
    {
      all: [
        ["尸体", "现场", "桥下", "桥边", "桥面"],
        ["挪", "搬", "拖", "移动", "摆", "布置", "动过", "伪造", "拖痕"]
      ],
      answer: "是",
      clueId: "bridge-staged"
    },
    {
      all: [
        ["鞋底", "鞋", "脚底"],
        ["干净", "没泥", "不脏", "无泥", "泥痕"]
      ],
      answer: "是",
      clueId: "bridge-staged"
    },
    {
      all: [["她", "死者", "尸体"], ["自己", "独自"], ["走到", "来到"], ["桥边", "桥上"]],
      negatedAnswer: "是",
      answer: "否",
      clueId: "bridge-staged"
    },
    {
      all: [
        ["玉佩", "玉坠", "玉", "佩饰"],
        ["死后", "塞", "放进", "摆", "伪装", "手里", "关键", "重要", "原本"]
      ],
      answer: "是",
      clueId: "bridge-pendant"
    },
    {
      all: [
        ["月半", "祭夫", "忌辰", "亡夫"],
        ["桥边", "桥上", "玉佩", "习惯", "烧纸"]
      ],
      answer: "是",
      clueId: "bridge-pendant"
    },
    {
      all: [
        ["意外", "失足", "坠桥", "自杀"],
        ["真的", "真实", "自然", "单纯"]
      ],
      answer: "否",
      clueId: "bridge-time-fake"
    },
    {
      all: [
        ["伪造", "假装", "制造", "误导", "骗局", "故意", "让人相信", "证人", "作证"],
        ["死亡时间", "时间", "刚刚", "深夜", "半夜", "还活着"]
      ],
      answer: "是",
      clueId: "bridge-time-fake"
    },
    {
      all: [
        ["桥边", "桥下", "现场", "痕迹", "桥面"],
        ["关键", "重要", "可疑", "反常"]
      ],
      answer: "是",
      clueId: "bridge-staged"
    },
    {
      any: ["深夜前", "傍晚", "提前", "早就", "先死", "早已"],
      answer: "是",
      clueId: "bridge-early-death"
    },
    {
      any: ["尸僵", "发僵", "掰不开", "手冷", "身子冷", "指节发硬"],
      answer: "是",
      clueId: "bridge-early-death"
    },
    {
      any: ["拖痕", "拖拽", "搬运", "挪动", "移动", "桥边痕迹", "桥下现场"],
      answer: "是",
      clueId: "bridge-staged"
    },
    {
      any: ["月半", "祭夫", "亡夫", "烧纸", "习惯", "忌辰"],
      answer: "是",
      clueId: "bridge-pendant"
    },
    {
      any: ["死亡时间", "伪造时间", "刚刚出事", "作证", "证人", "还活着"],
      answer: "是",
      clueId: "bridge-time-fake"
    }
  ],
  "archive-secret": [
    {
      all: [["鬼", "闹鬼", "灵异", "鬼影", "超自然"]],
      negatedAnswer: "是",
      answer: "否"
    },
    {
      all: [
        ["屋里", "宅里", "家里", "古屋", "旧宅"],
        ["第三个人", "三个人", "不止两个人", "还有人", "藏着人"]
      ],
      answer: "是",
      clueId: "archive-third-person"
    },
    {
      all: [
        ["第三只碗", "第三套餐具", "碗", "餐具"],
        ["关键", "重要", "误放", "多出来", "人为"]
      ],
      negatedAnswer: "否",
      answer: "是",
      clueId: "archive-third-bowl"
    },
    {
      all: [
        ["药", "药渍", "药汤", "服药"],
        ["长期", "固定", "病", "老人", "关键", "重要", "照顾", "某个人"]
      ],
      answer: "是",
      clueId: "archive-medicine"
    },
    {
      all: [
        ["扶手", "楼梯", "磨痕", "痕迹"],
        ["借力", "行动不便", "长期", "走路", "搀扶"]
      ],
      answer: "是",
      clueId: "archive-railing"
    },
    {
      all: [
        ["屋主", "主人", "房主"],
        ["隐瞒", "藏", "撒谎", "没说实话"],
        ["家人", "母亲", "老人", "病情"]
      ],
      answer: "是",
      clueId: "archive-elder"
    },
    {
      any: ["鬼", "闹鬼", "灵异", "鬼影", "超自然"],
      negatedAnswer: "是",
      answer: "否"
    },
    {
      any: ["长期照顾", "照顾某个人", "某个人", "照顾", "行动不便"],
      answer: "是",
      clueId: "archive-elder"
    },
    {
      any: ["第三个人", "三个人", "还有人", "藏着人", "屋里", "宅里", "脚步声"],
      answer: "是",
      clueId: "archive-third-person"
    },
    {
      any: ["第三只碗", "第三套餐具", "碗", "餐具"],
      answer: "是",
      clueId: "archive-third-bowl"
    },
    {
      any: ["药", "药渍", "药汤", "服药", "病情"],
      answer: "是",
      clueId: "archive-medicine"
    },
    {
      any: ["扶手", "楼梯", "磨痕", "行动不便", "借力"],
      answer: "是",
      clueId: "archive-railing"
    },
    {
      any: ["屋主", "主人", "母亲", "老人", "家人", "隐瞒", "撒谎"],
      answer: "是",
      clueId: "archive-elder"
    }
  ],
  "dream-corridor": [
    {
      all: [["鬼", "鬼影", "灵异", "超自然", "另一个自己"]],
      negatedAnswer: "是",
      answer: "否",
      clueId: "dream-reflection"
    },
    {
      all: [
        ["镜", "镜子", "镜面", "反射", "倒影", "视错觉", "错觉"],
        ["关键", "重要", "布置", "看到", "人影"]
      ],
      answer: "是",
      clueId: "dream-mirror"
    },
    {
      all: [
        ["灯", "纸灯", "灯笼", "少了一盏", "缺了一盏"],
        ["关键", "重要", "拿走", "人为", "少掉"]
      ],
      answer: "是",
      clueId: "dream-lantern"
    },
    {
      all: [
        ["灰", "灰痕", "地上", "痕迹"],
        ["先行", "提前", "经过", "通过", "去过"]
      ],
      answer: "是",
      clueId: "dream-dust"
    },
    {
      all: [
        ["人数", "人头", "通过的人", "经过人数", "只通过", "一个人"],
        ["误导", "误以为", "错觉", "伪装", "抹掉", "隐藏"]
      ],
      answer: "是",
      clueId: "dream-headcount"
    },
    {
      all: [
        ["同行者", "同伴", "那个人"],
        ["提前", "布置", "拿走", "做过", "伪装"]
      ],
      answer: "是",
      clueId: "dream-mirror"
    },
    {
      any: ["鬼", "鬼影", "灵异", "超自然", "另一个自己"],
      negatedAnswer: "是",
      answer: "否",
      clueId: "dream-reflection"
    },
    {
      any: ["镜", "镜子", "镜面", "反射", "倒影", "视错觉", "错觉", "人影"],
      answer: "是",
      clueId: "dream-mirror"
    },
    {
      any: ["灯", "纸灯", "灯笼", "少了一盏", "缺了一盏"],
      answer: "是",
      clueId: "dream-lantern"
    },
    {
      any: ["灰", "灰痕", "地上", "痕迹", "先行", "提前经过"],
      answer: "是",
      clueId: "dream-dust"
    },
    {
      any: ["人数", "人头", "误导", "误以为", "只通过", "一个人", "错觉", "伪装", "抹掉"],
      answer: "是",
      clueId: "dream-headcount"
    },
    {
      any: ["同行者", "同伴", "布置", "拿走"],
      answer: "是",
      clueId: "dream-mirror"
    }
  ]
};

function includesAny(raw, terms) {
  return terms.some((term) => raw.includes(normalize(term)));
}

function isNegated(raw) {
  const neutralizedQuestionPattern = raw.replace(/是不是/g, "").replace(/是否/g, "");
  return includesAny(neutralizedQuestionPattern, negationTerms);
}

function matchSemanticAnswer(question, scenario) {
  const raw = normalize(question);
  const rules = semanticAnswerRules[scenario.id] || [];
  const matched = rules.find((rule) =>
    rule.all
      ? rule.all.every((terms) => includesAny(raw, terms))
      : includesAny(raw, rule.any || [])
  );

  if (!matched) return null;

  return {
    answer: matched.negatedAnswer && isNegated(raw) ? matched.negatedAnswer : matched.answer,
    clueId: matched.clueId
  };
}

function findAnswer(question, scenario) {
  const raw = normalize(question);
  const semanticMatched = matchSemanticAnswer(question, scenario);
  if (semanticMatched) return semanticMatched;

  const matched = scenario.answers.find((item) =>
    item.match.every((word) => raw.includes(normalize(word)))
  );

  if (matched) return matched;

  if (raw.includes("谁") || raw.includes("身份")) {
    return { answer: "无关" };
  }

  return { answer: "无关" };
}

function getClueCardById(scenario, clueId) {
  if (!clueId) return null;
  return scenario.clueCards.find((card) => card.id === clueId) || null;
}

function getTimelineClueTitle(clue) {
  if (!clue) return "";
  if (typeof clue === "string") return clue;
  return clue.title || "";
}

function evaluateGuess(guess, scenario) {
  const raw = normalize(guess);
  const hitCount = scenario.keywords.filter((group) =>
    group.every((word) => raw.includes(normalize(word)))
  ).length;

  if (hitCount >= 4) return "success";
  if (hitCount >= 2) return "close";
  return "fail";
}

function getFallbackAiQuestion(player, scenario) {
  const script = scenario.aiQuestions?.[player.id] || [];
  const asked = player.questionsAsked;

  return (
    script[Math.min(asked, Math.max(script.length - 1, 0))] ||
    "这件事和最反常的物件有关吗？"
  );
}

function createInitialRuntime() {
  return {
    aiPending: false,
    guessPending: false,
    engineLabel: "轮到你先向桥守发问。",
    engineError: ""
  };
}

function getAiThinkingLabel(playerName) {
  return `${playerName} 正在整理线索，准备向桥守发问……`;
}

function getAiReadyLabel(playerName) {
  return `${playerName} 已经想好问题，正准备接话。`;
}

function getAiFallbackLabel(playerName) {
  return `${playerName} 暂时没接上思路，先按既定线索继续追问。`;
}

function getGuessPendingLabel() {
  return "桥守正在斟酌你的推理，请稍候。";
}

function getGuessFallbackLabel() {
  return "桥守一时未能给出裁定，先按本地规则继续推进。";
}

function createPreviewGame(mode) {
  const previewBase = createInitialGame(
    DEFAULT_SETUP.humanCount,
    DEFAULT_SETUP.themeId,
    DEFAULT_SETUP.difficultyId
  );

  const firstClue = getClueCardById(previewBase.scenario, "bridge-false-cry");
  const secondClue = getClueCardById(previewBase.scenario, "bridge-time-fake");
  const thirdClue = getClueCardById(previewBase.scenario, "bridge-pendant");
  const discoveredClues = [firstClue, secondClue, thirdClue].filter(Boolean);

  const previewPlay = {
    ...previewBase,
    phase: mode === "review" ? "review" : "play",
    totalQuestions: 4,
    guessesUsed: mode === "review" ? 1 : 0,
    activeSeat: 2,
    discoveredClues,
    players: previewBase.players.map((player, index) => ({
      ...player,
      questionsAsked: index === 0 ? 2 : index === 1 ? 1 : 0,
      clueHits: index === 0 ? 1 : index === 1 ? 1 : 0,
      correctGuesses: mode === "review" && index === 0 ? 1 : 0
    })),
    timeline: [
      {
        id: "opening-1",
        type: "keeper",
        speaker: "桥守",
        seatId: "keeper",
        text: "桥上那声求救来得太巧了，巧得像是专门喊给人听的。",
        clue: null
      },
      {
        id: "seat-1-question-1",
        type: "human",
        speaker: "你",
        seatId: "seat-1",
        text: "桥上的呼救声是死者本人喊的吗？",
        clue: null
      },
      {
        id: "seat-1-answer-1",
        type: "keeper",
        speaker: "桥守",
        seatId: "keeper",
        text: "否。",
        clue: firstClue || null
      },
      {
        id: "seat-1-question-2",
        type: "human",
        speaker: "你",
        seatId: "seat-1",
        text: "那声呼救是在故意伪造她刚刚出事的时间吗？",
        clue: null
      },
      {
        id: "seat-1-answer-2",
        type: "keeper",
        speaker: "桥守",
        seatId: "keeper",
        text: "是。",
        clue: secondClue || null
      },
      {
        id: "seat-2-question-1",
        type: "ai",
        speaker: "同行者甲",
        seatId: "seat-2",
        text: "玉佩原本不是握在她手里，而是后来被塞进去的吗？",
        clue: null
      },
      {
        id: "seat-2-answer-1",
        type: "keeper",
        speaker: "桥守",
        seatId: "keeper",
        text: "是。",
        clue: thirdClue || null
      }
    ],
    pendingQuestion: "",
    pendingGuess: "",
    result:
      mode === "review"
        ? {
            outcome: "success",
            title: "真相揭晓",
            note: "你已经抓住了真正的因果链。"
          }
        : null
  };

  if (mode === "review") {
    previewPlay.timeline = [
      ...previewPlay.timeline,
      {
        id: "guess-1",
        type: "human",
        speaker: "你",
        seatId: "seat-1",
        text: "我已知晓真相：沈青黛在傍晚争执时就已遇害，半夜桥上的求救是凶手故意喊给众人听的，尸体和玉佩都是后来被摆到桥边的。",
        clue: null
      }
    ];
  }

  return previewPlay;
}

function getPhaseLabel(phase) {
  if (phase === "play") return "对局中";
  if (phase === "review") return "复盘";
  return "开局台";
}

function getTopPerformer(players) {
  return [...players].sort((left, right) => {
    const leftScore = left.correctGuesses * 5 + left.clueHits * 3 + left.questionsAsked;
    const rightScore = right.correctGuesses * 5 + right.clueHits * 3 + right.questionsAsked;
    return rightScore - leftScore;
  })[0];
}

function OverlayModal({ open, eyebrow, title, subtitle, onClose, children, footer }) {
  if (!open) return null;

  return (
    <div className="tw-modal-backdrop" onClick={onClose}>
      <div className="tw-modal-panel" onClick={(event) => event.stopPropagation()}>
        <div className="tw-modal-head">
          <div>
            <span className="tw-kicker">{eyebrow}</span>
            <h2>{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <button className="tw-icon-button" onClick={onClose} aria-label="关闭弹窗">
            ×
          </button>
        </div>
        <div className="tw-modal-body">{children}</div>
        {footer ? <div className="tw-modal-footer">{footer}</div> : null}
      </div>
    </div>
  );
}

function TopBar({
  phase,
  theme,
  result,
  onOpenStory,
  onOpenRules,
  onOpenReview,
  onBackToSetup
}) {
  return (
    <header className="tw-header">
      <div className="tw-brand-block">
        <div className="tw-brand-lockup">
          <div className="tw-brand-main">汤屋</div>
          <div className="tw-brand-sub">TANG WU</div>
        </div>
        <div className="tw-brand-copy">
          <p className="tw-brand-note">AI 原生 · 沉浸式海龟汤推理</p>
          <div className="tw-brand-tags">
            <span className="tw-phase-pill">{getPhaseLabel(phase)}</span>
            <span className="tw-phase-pill is-soft">{theme.badge}</span>
            {phase === "review" && result ? (
              <span className={`tw-phase-pill is-${result.outcome}`}>{result.title}</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="tw-toolbar">
        {phase === "review" ? (
          <button className="tw-toolbar-button" onClick={onOpenReview}>
            本局回顾
          </button>
        ) : null}
        {phase === "play" ? (
          <button className="tw-toolbar-button" onClick={onBackToSetup}>
            回到开局台
          </button>
        ) : null}
        <button className="tw-toolbar-button" onClick={onOpenStory}>
          故事档案
        </button>
        <button className="tw-toolbar-button" onClick={onOpenRules}>
          玩法规则
        </button>
      </div>
    </header>
  );
}

function SeatInfoCard({ player, note, active = false, showEmblem = false }) {
  return (
    <div
      className={`tw-seat-card ${active ? "is-active" : ""} ${
        showEmblem ? "has-emblem" : ""
      }`}
    >
      <img className="tw-seat-avatar" src={player.avatar} alt={player.name} />
      <div className="tw-seat-copy">
        <div className="tw-seat-line">
          <span className="tw-seat-number">{player.seat}</span>
          <strong>{player.name}</strong>
          <span className={`tw-seat-type ${player.type === "ai" ? "is-ai" : ""}`}>
            {player.type === "human" ? "人类" : "AI"}
          </span>
        </div>
        <p>{note}</p>
      </div>
      {showEmblem ? (
        <img
          className="tw-seat-emblem"
          src="/assets/emblems/emblem-bridge-bell-v1.png"
          alt=""
        />
      ) : null}
    </div>
  );
}

function PerformanceRow({ player }) {
  return (
    <div className="tw-performance-row">
      <img className="tw-performance-avatar" src={player.avatar} alt={player.name} />
      <div className="tw-performance-copy">
        <strong>{player.name}</strong>
        <span>
          提问 {player.questionsAsked} · 线索 {player.clueHits} · 命中 {player.correctGuesses}
        </span>
      </div>
    </div>
  );
}

function SetupScreen({
  game,
  selectedTheme,
  selectedDifficulty,
  onHumanCountChange,
  onThemeChange,
  onDifficultyChange,
  onOpenStory,
  onOpenRules,
  onStart
}) {
  const seats = useMemo(() => buildPlayers(game.humanCount), [game.humanCount]);

  return (
    <div className="tw-page-shell">
      <TopBar
        phase="setup"
        theme={selectedTheme}
        onOpenStory={onOpenStory}
        onOpenRules={onOpenRules}
      />

      <section className="tw-layout tw-setup-layout">
        <aside className="tw-panel tw-story-panel tw-setup-left">
          <div className="tw-keeper-showcase">
            <div className="tw-keeper-showcase-art">
              <img
                src="/assets/characters/character-bridge-keeper-v1.png"
                alt="桥守"
              />
              <div className="tw-keeper-title">桥守</div>
              <div className="tw-keeper-tag">迎面人物</div>
            </div>
            <div className="tw-keeper-showcase-copy">
              <blockquote>“过桥可不是那么容易的事。”</blockquote>
              <p>{game.scenario.keeperLine}</p>
            </div>
          </div>

          <div className="tw-list-card tw-story-dossier">
            <div className="tw-block-head">
              <div>
                <span className="tw-kicker">故事</span>
                <h3>{game.scenario.title}</h3>
              </div>
              <span className="tw-inline-chip">{game.scenario.chapter}</span>
            </div>
            <p>{game.scenario.summary}</p>
          </div>
        </aside>

        <main className="tw-panel tw-center-panel tw-setup-main">
          <div className="tw-hero-stage tw-setup-hero" data-tone={selectedTheme.tone}>
            <img src={selectedTheme.image} alt={game.scenario.title} />
            <div className="tw-setup-hero-copy">
              <span className="tw-kicker">开局台</span>
              <h2>与桥守对话</h2>
              <p>问出正确的问题，揭开这碗汤的入口。</p>
            </div>
            <div className="tw-hero-topline">
              <span>{selectedTheme.badge}</span>
              <span>{selectedDifficulty.title}</span>
            </div>
            <div className="tw-hero-footer">
              <strong>{game.scenario.chapter}</strong>
              <p>{game.scenario.summary}</p>
            </div>
          </div>

          <div className="tw-config-card tw-setup-board">
            <div className="tw-setup-board-row">
              <div className="tw-block-head">
                <h3>人类玩家数量</h3>
                <span>
                  {game.humanCount === TOTAL_SEATS
                    ? "本局全部为人类席位"
                    : `${TOTAL_SEATS - game.humanCount} 个席位将由 AI 补位`}
                </span>
              </div>
              <div className="tw-segment-grid tw-segment-grid-compact">
                {[1, 2, 3, 4].map((count) => (
                  <button
                    key={count}
                    className={`tw-segment-button ${game.humanCount === count ? "is-active" : ""}`}
                    onClick={() => onHumanCountChange(count)}
                  >
                    {count} 人
                  </button>
                ))}
              </div>
            </div>

            <div className="tw-setup-board-row tw-setup-board-row-compact">
              <div className="tw-block-head">
                <h3>主题选择</h3>
              </div>
              <div className="tw-theme-grid tw-theme-grid-compact">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    className={`tw-theme-card ${game.themeId === theme.id ? "is-active" : ""}`}
                    onClick={() => onThemeChange(theme.id)}
                  >
                    <div className="tw-theme-thumb" data-tone={theme.tone}>
                      <img src={theme.image} alt={theme.title} />
                      <span>{theme.badge}</span>
                    </div>
                    <div className="tw-theme-copy">
                      <strong>{theme.title}</strong>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="tw-setup-board-footer tw-setup-board-footer-inline">
              <div className="tw-setup-board-row tw-setup-board-row-compact">
                <div className="tw-block-head">
                  <h3>难度选择</h3>
                </div>
                <div className="tw-difficulty-grid tw-difficulty-grid-compact">
                  {difficulties.map((difficulty) => (
                    <button
                      key={difficulty.id}
                      className={`tw-difficulty-card ${
                        game.difficultyId === difficulty.id ? "is-active" : ""
                      }`}
                      onClick={() => onDifficultyChange(difficulty.id)}
                    >
                      <strong>{difficulty.title}</strong>
                    </button>
                  ))}
                </div>
              </div>

              <div className="tw-setup-cta-wrap">
                <button className="tw-primary-cta" onClick={onStart}>
                  开始游戏
                </button>
              </div>
            </div>
          </div>
        </main>

        <aside className="tw-panel tw-side-panel tw-setup-right">
          <div className="tw-panel-headline">
            <div>
              <span className="tw-kicker">本局玩家</span>
              <h2>{TOTAL_SEATS}/{TOTAL_SEATS}</h2>
            </div>
          </div>

          <div className="tw-seat-stack">
            {seats.map((seat) => (
              <SeatInfoCard
                key={seat.id}
                player={seat}
                note={seat.type === "human" ? "待发问" : "待补位"}
              />
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}

function PlayScreen({
  game,
  currentPlayer,
  runtime,
  selectedTheme,
  selectedDifficulty,
  onOpenStory,
  onOpenRules,
  onOpenGuess,
  onBackToSetup,
  onQuestionChange,
  onAskQuestion,
  onSubmitGuess
}) {
  const progress = Math.round(
    (game.discoveredClues.length / game.scenario.clueCards.length) * 100
  );
  const timelineRef = useRef(null);
  const stickToBottomRef = useRef(true);
  const isHumanTurn = currentPlayer?.type === "human";
  const waitingPlayerName = currentPlayer?.name || "同行者";
  const composerStatus = runtime.engineError
    ? runtime.engineError
    : runtime.aiPending
      ? getAiThinkingLabel(waitingPlayerName)
      : runtime.guessPending
        ? getGuessPendingLabel()
        : runtime.engineLabel;
  const composerPlaceholder = isHumanTurn
    ? `例如：${selectedTheme.starterQuestions[0]}`
    : runtime.aiPending
      ? `${waitingPlayerName} 正在组织问题……`
      : `${waitingPlayerName} 即将接过话头，请稍候。`;

  const handleTimelineScroll = () => {
    const node = timelineRef.current;
    if (!node) return;

    const distanceToBottom = node.scrollHeight - node.scrollTop - node.clientHeight;
    stickToBottomRef.current = distanceToBottom < 48;
  };

  useEffect(() => {
    const node = timelineRef.current;
    if (!node) return;
    if (!stickToBottomRef.current) return;
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [game.timeline.length]);

  return (
    <div className="tw-page-shell">
      <TopBar
        phase="play"
        theme={selectedTheme}
        result={game.result}
        onOpenStory={onOpenStory}
        onOpenRules={onOpenRules}
        onBackToSetup={onBackToSetup}
      />

      <section className="tw-layout tw-play-layout">
        <aside className="tw-panel tw-story-panel">
          <div className="tw-media-frame" data-tone={selectedTheme.tone}>
            <img src={selectedTheme.storyImage} alt={game.scenario.title} />
            <div className="tw-media-label">{selectedTheme.badge}</div>
          </div>

          <div className="tw-copy-block">
            <strong>桥守语</strong>
            <p>{game.scenario.keeperLine}</p>
          </div>

          <div className="tw-list-card">
            <h3>{game.scenario.title}</h3>
            <p>{game.scenario.setupCopy}</p>
          </div>

          <div className="tw-list-card">
            <div className="tw-block-head">
              <h3>已解锁线索</h3>
              <span>
                {game.discoveredClues.length}/{game.scenario.clueCards.length}
              </span>
            </div>
            <div className="tw-discovered-clues is-compact">
              {game.discoveredClues.length > 0 ? (
                game.discoveredClues.map((clue) => (
                  <div key={clue.id} className="tw-discovered-card">
                    <strong>{clue.title}</strong>
                  </div>
                ))
              ) : (
                <div className="tw-empty-note">桥守还没松口，先从最反常的物件问起。</div>
              )}
            </div>
          </div>
        </aside>

        <main className="tw-panel tw-center-panel">
          <div className="tw-dialog-hero" data-tone={selectedTheme.tone}>
            <img src={selectedTheme.image} alt={game.scenario.title} />
            <div className="tw-dialog-hero-copy">
              <h1>与桥守对话</h1>
              <p>问出正确的问题，揭开过桥的条件。</p>
            </div>
            <div className="tw-dialog-hero-stamp">汤屋桥</div>
          </div>

          <div className="tw-log" ref={timelineRef} onScroll={handleTimelineScroll}>
            {game.timeline.map((entry) => {
              return (
                <article key={entry.id} className={`tw-log-row is-${entry.type}`}>
                  <div className="tw-log-speaker">{entry.speaker}</div>
                  <div className="tw-log-bubble">
                    <p>{entry.text}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="tw-composer-card">
            <div className="tw-composer-main">
              <textarea
                value={game.pendingQuestion}
                onChange={(event) => onQuestionChange(event.target.value)}
                placeholder={composerPlaceholder}
                disabled={!isHumanTurn || runtime.guessPending}
              />
              <button
                className="tw-composer-submit"
                disabled={!isHumanTurn || runtime.guessPending || !game.pendingQuestion.trim()}
                onClick={onAskQuestion}
              >
                {runtime.aiPending ? (
                  <span className="tw-inline-wait">
                    <span className="tw-spinner" aria-hidden="true" />
                    {`${waitingPlayerName} 思索中`}
                  </span>
                ) : (
                  "向桥守发问"
                )}
              </button>
            </div>
            <div className="tw-composer-meta">
              <p className={runtime.aiPending || runtime.guessPending ? "is-busy" : ""}>
                {runtime.aiPending || runtime.guessPending ? (
                  <span className="tw-inline-wait">
                    <span className="tw-spinner is-small" aria-hidden="true" />
                    {composerStatus}
                  </span>
                ) : (
                  composerStatus
                )}
              </p>
              <div className="tw-composer-actions">
                <span>
                  {currentPlayer ? `${currentPlayer.seat} 号 · ${currentPlayer.name}` : "—"} /{" "}
                  {game.totalQuestions}/{game.questionLimit} 问
                </span>
                <button className="tw-link-action" onClick={onOpenGuess}>
                  提交汤底
                </button>
              </div>
            </div>
          </div>
        </main>

        <aside className="tw-panel tw-side-panel">
          <div className="tw-panel-headline">
            <div>
              <span className="tw-kicker">席位状态</span>
              <h2>本局玩家（4/4）</h2>
            </div>
          </div>

          <div className="tw-seat-stack">
            {game.players.map((player) => (
              <SeatInfoCard
                key={player.id}
                player={player}
                active={player.seat === game.activeSeat}
                note={
                  player.seat === game.activeSeat
                    ? player.type === "ai" && runtime.aiPending
                      ? "正在思索"
                      : "当前行动"
                    : player.type === "human"
                      ? "等待接力"
                      : "待命补位"
                }
              />
            ))}
          </div>

          <div className="tw-stat-card">
            <div className="tw-block-head">
              <h3>推进进度</h3>
              <span>{progress}%</span>
            </div>
            <div className="tw-progress-track">
              <span style={{ width: `${progress}%` }} />
            </div>
            <div className="tw-inline-stats">
              <div>
                <span>线索</span>
                <strong>{game.discoveredClues.length}</strong>
              </div>
              <div>
                <span>问题</span>
                <strong>{game.totalQuestions}</strong>
              </div>
              <div>
                <span>剩余提交</span>
                <strong>{game.guessLimit - game.guessesUsed}</strong>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function ReviewScreen({
  game,
  selectedTheme,
  onOpenStory,
  onOpenRules,
  onOpenReview,
  onRestart
}) {
  const progress = Math.round(
    (game.discoveredClues.length / game.scenario.clueCards.length) * 100
  );
  const champion = getTopPerformer(game.players);
  const filteredReviewEntries = game.timeline.filter((entry, index) => {
    if (index === 0) return true;
    if (entry.type === "human") return true;
    return Boolean(entry.clue);
  });
  const reviewEntries =
    filteredReviewEntries.length <= 3
      ? filteredReviewEntries
      : [filteredReviewEntries[0], ...filteredReviewEntries.slice(-2)];

  return (
    <div className="tw-page-shell">
      <TopBar
        phase="review"
        theme={selectedTheme}
        result={game.result}
        onOpenStory={onOpenStory}
        onOpenRules={onOpenRules}
        onOpenReview={onOpenReview}
      />

      <section className="tw-layout tw-review-layout">
        <aside className="tw-panel tw-story-panel">
          <div className={`tw-result-banner is-${game.result?.outcome || "failed"}`}>
            <span>{game.result?.outcome === "success" ? "通关结果" : "结局"}</span>
            <strong>{game.result?.title || "本局结束"}</strong>
            <p>{game.result?.note}</p>
          </div>

          <div className="tw-media-frame" data-tone={selectedTheme.tone}>
            <img src={selectedTheme.image} alt={game.scenario.title} />
            <div className="tw-media-label">{game.scenario.chapter}</div>
          </div>

          <div className="tw-list-card">
            <h3>{game.scenario.title}</h3>
            <p>{game.scenario.summary}</p>
          </div>
        </aside>

        <main className="tw-panel tw-center-panel">
          <div className="tw-panel-headline">
            <div>
              <span className="tw-kicker">复盘时间线</span>
              <h1>这碗汤是怎么被推开的</h1>
              <p>把对话、回应和真正掉出来的线索按顺序回看一次。</p>
            </div>
          </div>

          <div className="tw-review-list">
            {reviewEntries.map((entry, index) => {
              const clueTitle = getTimelineClueTitle(entry.clue);

              return (
                <div key={entry.id} className="tw-review-row">
                  <div className="tw-review-index">{index + 1}</div>
                  <div className="tw-review-card">
                    <strong>{entry.speaker}</strong>
                    <p>{entry.text}</p>
                  </div>
                  {clueTitle ? (
                    <span className="tw-clue-badge is-inline">{clueTitle}</span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </main>

        <aside className="tw-panel tw-side-panel">
          <div className="tw-stat-card">
            <div className="tw-block-head">
              <h3>完成度</h3>
              <span>{progress}%</span>
            </div>
            <div className="tw-review-stamp-wrap">
              <img
                className="tw-review-stamp"
                src={
                  game.result?.outcome === "success"
                    ? "/assets/emblems/emblem-settlement-stamp-v1.png"
                    : "/assets/emblems/emblem-review-seal-v1.png"
                }
                alt=""
              />
              <div className="tw-review-stamp-value">{progress}%</div>
            </div>
            <div className="tw-inline-stats">
              <div>
                <span>已提问</span>
                <strong>{game.totalQuestions}</strong>
              </div>
              <div>
                <span>已提交</span>
                <strong>{game.guessesUsed}</strong>
              </div>
              <div>
                <span>最佳席位</span>
                <strong>{champion?.name || "—"}</strong>
              </div>
            </div>
          </div>

          <div className="tw-performance-stack">
            {game.players.map((player) => (
              <PerformanceRow key={player.id} player={player} />
            ))}
          </div>

          <button className="tw-primary-cta" onClick={onRestart}>
            再来一碗
          </button>
        </aside>
      </section>
    </div>
  );
}

export default function App() {
  const [game, setGame] = useState(() => {
    if (typeof window !== "undefined") {
      const preview = new URLSearchParams(window.location.search).get("preview");
      if (preview === "play" || preview === "review") {
        return createPreviewGame(preview);
      }
    }

    return createInitialGame(
      DEFAULT_SETUP.humanCount,
      DEFAULT_SETUP.themeId,
      DEFAULT_SETUP.difficultyId
    );
  });
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [runtime, setRuntime] = useState(() => createInitialRuntime());

  const currentPlayer = useMemo(
    () => game.players.find((player) => player.seat === game.activeSeat),
    [game.activeSeat, game.players]
  );
  const selectedTheme = useMemo(() => getThemeById(game.themeId), [game.themeId]);
  const selectedDifficulty = useMemo(
    () => getDifficultyConfig(game.difficultyId),
    [game.difficultyId]
  );

  useEffect(() => {
    if (!activeOverlay) return undefined;

    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        setActiveOverlay(null);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [activeOverlay]);

  useEffect(() => {
    if (game.phase !== "play" || !currentPlayer || currentPlayer.type !== "ai") return undefined;
    let cancelled = false;

    setRuntime((prev) => ({
      ...prev,
      aiPending: true,
      engineError: "",
      engineLabel: getAiThinkingLabel(currentPlayer.name)
    }));

    const timer = window.setTimeout(async () => {
      const question =
        (() => getFallbackAiQuestion(currentPlayer, game.scenario))();

      let resolvedQuestion = question;
      try {
        resolvedQuestion = await generateAiQuestion(game, currentPlayer);
        if (!cancelled) {
          setRuntime((prev) => ({
            ...prev,
            aiPending: false,
            engineError: "",
            engineLabel: getAiReadyLabel(currentPlayer.name)
          }));
        }
      } catch (error) {
        if (!cancelled) {
          setRuntime((prev) => ({
            ...prev,
            aiPending: false,
            engineLabel: getAiFallbackLabel(currentPlayer.name),
            engineError: error instanceof Error ? error.message : String(error)
          }));
        }
      }

      if (cancelled) return;
      setGame((prev) => {
        if (prev.phase !== "play") return prev;

        const active = prev.players.find((player) => player.seat === prev.activeSeat);
        if (!active || active.type !== "ai") return prev;

        const result = findAnswer(resolvedQuestion, prev.scenario);
        const clueCard = getClueCardById(prev.scenario, result.clueId);
        const clues =
          clueCard && !prev.discoveredClues.some((card) => card.id === clueCard.id)
            ? [...prev.discoveredClues, clueCard]
            : prev.discoveredClues;
        const updatedPlayers = prev.players.map((player) =>
          player.id === active.id
            ? {
                ...player,
                questionsAsked: player.questionsAsked + 1,
                clueHits: player.clueHits + (clueCard ? 1 : 0)
              }
            : player
        );
        const nextSeat = prev.activeSeat === TOTAL_SEATS ? 1 : prev.activeSeat + 1;
        const nextTotal = prev.totalQuestions + 1;
        const nextPhase = nextTotal >= prev.questionLimit ? "review" : "play";

        return {
          ...prev,
          players: updatedPlayers,
          activeSeat: nextSeat,
          totalQuestions: nextTotal,
          discoveredClues: clues,
          timeline: [
            ...prev.timeline,
            {
              id: `${active.id}-question-${active.questionsAsked + 1}`,
              type: "ai",
              speaker: active.name,
              seatId: active.id,
              text: resolvedQuestion,
              clue: null
            },
            {
              id: `${active.id}-answer-${active.questionsAsked + 1}`,
              type: "keeper",
              speaker: "桥守",
              seatId: "keeper",
              text: result.answer,
              clue: clueCard || null
            }
          ],
          result:
            nextPhase === "review"
              ? {
                  outcome: "failed",
                  title: "迷雾未散",
                  note: "提问次数已经耗尽，桥守只好把真相完整摊开。"
                }
              : prev.result?.outcome === "close"
                ? null
                : prev.result,
          phase: nextPhase
        };
      });
    }, 950);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [
    currentPlayer,
    game.activeSeat,
    game.discoveredClues,
    game.phase,
    game.scenario,
    game.timeline,
    game.totalQuestions
  ]);

  const handleStart = () => {
    setActiveOverlay("story");
    setRuntime(createInitialRuntime());
    setGame((prev) => ({
      ...createInitialGame(prev.humanCount, prev.themeId, prev.difficultyId),
      phase: "play"
    }));
  };

  const handleQuestionChange = (value) => {
    setGame((prev) => ({ ...prev, pendingQuestion: value }));
  };

  const handleGuessChange = (value) => {
    setGame((prev) => ({ ...prev, pendingGuess: value }));
  };

  const handleAskQuestion = () => {
    if (
      !currentPlayer ||
      currentPlayer.type !== "human" ||
      runtime.guessPending ||
      !game.pendingQuestion.trim()
    ) {
      return;
    }

    const result = findAnswer(game.pendingQuestion, game.scenario);
    const clueCard = getClueCardById(game.scenario, result.clueId);
    const clues =
      clueCard && !game.discoveredClues.some((card) => card.id === clueCard.id)
        ? [...game.discoveredClues, clueCard]
        : game.discoveredClues;
    const nextTotal = game.totalQuestions + 1;
    const nextSeat = game.activeSeat === TOTAL_SEATS ? 1 : game.activeSeat + 1;
    const nextPhase = nextTotal >= game.questionLimit ? "review" : "play";

    setGame((prev) => ({
      ...prev,
      pendingQuestion: "",
      totalQuestions: nextTotal,
      activeSeat: nextSeat,
      discoveredClues: clues,
      players: prev.players.map((player) =>
        player.id === currentPlayer.id
          ? {
              ...player,
              questionsAsked: player.questionsAsked + 1,
              clueHits: player.clueHits + (clueCard ? 1 : 0)
            }
          : player
      ),
      timeline: [
        ...prev.timeline,
        {
          id: `${currentPlayer.id}-question-${currentPlayer.questionsAsked + 1}`,
          type: "human",
          speaker: currentPlayer.name,
          seatId: currentPlayer.id,
          text: prev.pendingQuestion,
          clue: null
        },
        {
          id: `${currentPlayer.id}-answer-${currentPlayer.questionsAsked + 1}`,
          type: "keeper",
          speaker: "桥守",
          seatId: "keeper",
          text: result.answer,
          clue: clueCard || null
        }
      ],
      result:
        nextPhase === "review"
          ? {
              outcome: "failed",
              title: "迷雾未散",
              note: "提问次数已经耗尽，桥守只好把真相完整摊开。"
            }
          : prev.result?.outcome === "close"
            ? null
            : prev.result,
      phase: nextPhase
    }));
  };

  const handleSubmitGuess = async () => {
    if (!game.pendingGuess.trim() || runtime.guessPending) return;

    const guessText = game.pendingGuess.trim();
    let judgement;

    try {
      setRuntime((prev) => ({
        ...prev,
        guessPending: true,
        engineError: "",
        engineLabel: getGuessPendingLabel()
      }));
      judgement = await judgeGuess(game, guessText);
      setRuntime((prev) => ({
        ...prev,
        guessPending: false,
        engineError: "",
        engineLabel: "桥守已经给出裁定。"
      }));
    } catch (error) {
      const fallbackOutcome = evaluateGuess(guessText, game.scenario);
      judgement = {
        outcome: fallbackOutcome,
        note:
          fallbackOutcome === "success"
            ? "你已经抓住了真正的因果链。"
            : fallbackOutcome === "close"
              ? "你已经非常接近，再补一个关键因果就够了。"
              : "桥守摇头不语。"
      };
      setRuntime((prev) => ({
        ...prev,
        guessPending: false,
        engineLabel: getGuessFallbackLabel(),
        engineError: error instanceof Error ? error.message : String(error)
      }));
    }

    if (judgement.outcome === "success") {
      setGame((prev) => ({
        ...prev,
        phase: "review",
        guessesUsed: prev.guessesUsed + 1,
        pendingGuess: "",
        result: {
          outcome: "success",
          title: "真相揭晓",
          note: judgement.note || "你已经抓住了真正的因果链。"
        },
        players: prev.players.map((player) =>
          player.id === currentPlayer?.id
            ? { ...player, correctGuesses: player.correctGuesses + 1 }
            : player
        ),
        timeline: [
          ...prev.timeline,
          {
            id: `guess-${prev.guessesUsed + 1}`,
            type: "human",
            speaker: currentPlayer?.name || "你",
            seatId: currentPlayer?.id || "seat-1",
            text: `我已知晓真相：${prev.pendingGuess}`,
            clue: null
          }
        ]
      }));
      return;
    }

    setGame((prev) => {
      const nextGuesses = prev.guessesUsed + 1;
      const shouldEnd = nextGuesses >= prev.guessLimit;

      return {
        ...prev,
        guessesUsed: nextGuesses,
        pendingGuess: "",
        phase: shouldEnd ? "review" : prev.phase,
        result: shouldEnd
          ? {
              outcome: "failed",
              title: "迷雾未散",
              note: judgement.note || "提交次数已经耗尽，桥守只能亲自把余下部分讲完。"
            }
          : {
              outcome: judgement.outcome,
              title: judgement.outcome === "close" ? "还差半步" : "桥雾未开",
              note:
                judgement.note ||
                (judgement.outcome === "close"
                  ? "你已经非常接近，再补一个关键因果就够了。"
                  : "这次推理仍偏离主因果。")
            },
        timeline: [
          ...prev.timeline,
          {
            id: `guess-${nextGuesses}`,
            type: "human",
            speaker: currentPlayer?.name || "你",
            seatId: currentPlayer?.id || "seat-1",
            text: `我推测：${prev.pendingGuess}（桥守：${judgement.note}）`,
            clue: null
          }
        ]
      };
    });
  };

  const resetToSetup = () => {
    setActiveOverlay(null);
    setRuntime(createInitialRuntime());
    setGame((prev) => createInitialGame(prev.humanCount, prev.themeId, prev.difficultyId));
  };

  const modalConfig = (() => {
    if (activeOverlay === "guess") {
      return {
        eyebrow: "提交汤底",
        title: "写下你的完整推理",
        subtitle: `剩余 ${Math.max(game.guessLimit - game.guessesUsed, 0)} 次提交机会`,
        children: (
          <>
            {game.result?.outcome === "close" ? (
              <div className="tw-inline-alert">{game.result.note}</div>
            ) : null}
            <div className="tw-guess-modal">
              <textarea
                value={game.pendingGuess}
                onChange={(event) =>
                  setGame((prev) => ({ ...prev, pendingGuess: event.target.value }))
                }
                placeholder={
                  runtime.guessPending
                    ? "桥守正在斟酌你的推理……"
                    : "至少交代人物关系、关键物件、真正时间线和伪装方式。"
                }
                disabled={runtime.guessPending}
              />
              <p>不要只写结论，尽量把因果链写完整。</p>
            </div>
          </>
        ),
        footer: (
          <>
            <button className="tw-secondary-cta" onClick={() => setActiveOverlay(null)}>
              取消
            </button>
            <button
              className="tw-secondary-cta is-dark"
              disabled={!game.pendingGuess.trim() || runtime.guessPending}
              onClick={() => {
                handleSubmitGuess();
                setActiveOverlay(null);
              }}
            >
              {runtime.guessPending ? "裁定中..." : "确认提交"}
            </button>
          </>
        )
      };
    }

    if (activeOverlay === "story") {
      return {
        eyebrow: "故事档案",
        title: game.scenario.title,
        subtitle: `${selectedTheme.title} · ${game.scenario.chapter}`,
        children: (
          <>
            <div className="tw-modal-media" data-tone={selectedTheme.tone}>
              <img src={selectedTheme.image} alt={game.scenario.title} />
            </div>
            <div className="tw-modal-card is-full">
              <span>{game.phase === "review" ? "完整真相" : "当前汤面"}</span>
              <p>{game.phase === "review" ? game.scenario.truth : game.scenario.opening}</p>
            </div>
          </>
        )
      };
    }

    if (activeOverlay === "rules") {
      return {
        eyebrow: "玩法规则",
        title: "桥守只回答，是、否，还是无关",
        subtitle: `${game.questionLimit} 次提问 / ${game.guessLimit} 次提交`,
        children: (
          <>
            <div className="tw-modal-grid">
              <div className="tw-modal-card">
                <span>基本规则</span>
                <strong>每轮一问</strong>
                <p>当前席位只能追一个关键点，尽量避免空泛问题。</p>
              </div>
              <div className="tw-modal-card">
                <span>回答方式</span>
                <strong>是 / 否 / 无关</strong>
                <p>桥守不会解释，只会把你推向更接近真相的方向。</p>
              </div>
              <div className="tw-modal-card">
                <span>提交条件</span>
                <strong>任意时刻可交</strong>
                <p>只要你能还原人物关系、时间线与伪装方式，就能破局。</p>
              </div>
              <div className="tw-modal-card">
                <span>当前难度</span>
                <strong>{selectedDifficulty.title}</strong>
                <p>{selectedDifficulty.helper}</p>
              </div>
            </div>
          </>
        )
      };
    }

    if (activeOverlay === "review") {
      const champion = getTopPerformer(game.players);
      return {
        eyebrow: "本局回顾",
        title: game.result?.title || "本局结束",
        subtitle: champion ? `表现最突出：${champion.name}` : "本局没有最佳席位",
        children: (
          <>
            <div className="tw-modal-grid">
              <div className="tw-modal-card">
                <span>探索完成度</span>
                <strong>
                  {Math.round(
                    (game.discoveredClues.length / game.scenario.clueCards.length) * 100
                  )}
                  %
                </strong>
                <p>已发现 {game.discoveredClues.length} 条关键线索。</p>
              </div>
              <div className="tw-modal-card">
                <span>问题数量</span>
                <strong>{game.totalQuestions}</strong>
                <p>本局共推进了 {game.timeline.length} 条对话记录。</p>
              </div>
              <div className="tw-modal-card">
                <span>提交次数</span>
                <strong>{game.guessesUsed}</strong>
                <p>判断窗口越早越大胆，越能体现推理节奏。</p>
              </div>
              <div className="tw-modal-card">
                <span>最佳席位</span>
                <strong>{champion?.name || "—"}</strong>
                <p>综合线索命中与真相提交计算。</p>
              </div>
            </div>
          </>
        )
      };
    }

    return null;
  })();

  return (
    <>
      {game.phase === "setup" ? (
        <SetupScreen
          game={game}
          selectedTheme={selectedTheme}
          selectedDifficulty={selectedDifficulty}
          onHumanCountChange={(value) =>
            setGame((prev) => ({
              ...prev,
              humanCount: value,
              players: buildPlayers(value)
            }))
          }
          onThemeChange={(value) =>
            setGame((prev) => ({
              ...prev,
              themeId: value,
              scenario: getScenarioByTheme(value)
            }))
          }
          onDifficultyChange={(value) =>
            setGame((prev) => {
              const config = getDifficultyConfig(value);
              return {
                ...prev,
                difficultyId: value,
                questionLimit: config.questionLimit,
                guessLimit: config.guessLimit
              };
            })
          }
          onOpenStory={() => setActiveOverlay("story")}
          onOpenRules={() => setActiveOverlay("rules")}
          onStart={handleStart}
        />
      ) : null}

      {game.phase === "play" ? (
        <PlayScreen
          game={game}
          currentPlayer={currentPlayer}
          runtime={runtime}
          selectedTheme={selectedTheme}
          selectedDifficulty={selectedDifficulty}
          onOpenStory={() => setActiveOverlay("story")}
          onOpenRules={() => setActiveOverlay("rules")}
          onOpenGuess={() => setActiveOverlay("guess")}
          onBackToSetup={resetToSetup}
          onQuestionChange={handleQuestionChange}
          onAskQuestion={handleAskQuestion}
          onSubmitGuess={handleSubmitGuess}
        />
      ) : null}

      {game.phase === "review" ? (
        <ReviewScreen
          game={game}
          selectedTheme={selectedTheme}
          onOpenStory={() => setActiveOverlay("story")}
          onOpenRules={() => setActiveOverlay("rules")}
          onOpenReview={() => setActiveOverlay("review")}
          onRestart={resetToSetup}
        />
      ) : null}

      <OverlayModal
        open={Boolean(modalConfig)}
        eyebrow={modalConfig?.eyebrow}
        title={modalConfig?.title}
        subtitle={modalConfig?.subtitle}
        onClose={() => setActiveOverlay(null)}
        footer={modalConfig?.footer}
      >
        {modalConfig?.children}
      </OverlayModal>
    </>
  );
}
