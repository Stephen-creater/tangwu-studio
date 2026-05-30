import { useEffect, useMemo, useRef, useState } from "react";
import {
  TOTAL_SEATS,
  difficulties,
  getDifficultyConfig,
  getScenarioByTheme,
  getThemeById,
  seatProfiles
} from "./gameData";
import { generateAiQuestion, judgeGuess } from "./lib/minimax";

const DEFAULT_SETUP = {
  humanCount: 4,
  themeId: "bridge",
  difficultyId: "normal"
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

function findAnswer(question, scenario) {
  const raw = normalize(question);
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
    engineLabel: "MiniMax M2.7 已接入，等待首轮调用",
    engineError: ""
  };
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
  onOpenSettings,
  onOpenReview,
  onPrimaryAction
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
        <button className="tw-toolbar-button" onClick={onOpenStory}>
          故事档案
        </button>
        <button className="tw-toolbar-button" onClick={onOpenRules}>
          玩法规则
        </button>
        <button className="tw-toolbar-button" onClick={onOpenSettings}>
          设置
        </button>
        <button className="tw-toolbar-button is-primary" onClick={onPrimaryAction}>
          {phase === "setup" ? "恢复默认" : "返回开局"}
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

function SetupScreen({
  game,
  selectedTheme,
  selectedDifficulty,
  onHumanCountChange,
  onDifficultyChange,
  onOpenStory,
  onOpenRules,
  onOpenSettings,
  onReset,
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
        onOpenSettings={onOpenSettings}
        onPrimaryAction={onReset}
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
  onOpenSettings,
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
  const isHumanTurn = currentPlayer?.type === "human";

  useEffect(() => {
    const node = timelineRef.current;
    if (!node) return;
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
        onOpenSettings={onOpenSettings}
        onPrimaryAction={onBackToSetup}
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
            <div className="tw-discovered-clues">
              {game.discoveredClues.length > 0 ? (
                game.discoveredClues.map((clue) => (
                  <div key={clue.id} className="tw-discovered-card">
                    <img src={clue.image} alt={clue.title} />
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

          <div className="tw-log" ref={timelineRef}>
            {game.timeline.map((entry) => (
              <article
                key={entry.id}
                className={`tw-log-row is-${entry.type} ${
                  entry.clue ? "has-clue" : ""
                }`}
              >
                <div className="tw-log-speaker">{entry.speaker}</div>
                <div className="tw-log-bubble">
                  <p>{entry.text}</p>
                  {entry.clue ? <span className="tw-clue-badge">{entry.clue}</span> : null}
                </div>
              </article>
            ))}
          </div>

          <div className="tw-composer-card">
            <div className="tw-composer-main">
              <textarea
                value={game.pendingQuestion}
                onChange={(event) => onQuestionChange(event.target.value)}
                placeholder={
                  isHumanTurn
                    ? `例如：${selectedTheme.starterQuestions[0]}`
                    : runtime.aiPending
                      ? "MiniMax 正在为 AI 席位生成问题……"
                      : "当前不是人类席位，桥守正在等待 AI 行动。"
                }
                disabled={!isHumanTurn || runtime.guessPending}
              />
              <button
                className="tw-composer-submit"
                disabled={!isHumanTurn || runtime.guessPending || !game.pendingQuestion.trim()}
                onClick={onAskQuestion}
              >
                {runtime.aiPending ? "等待 AI..." : "提问"}
              </button>
            </div>
            <div className="tw-composer-meta">
              <p>
                {runtime.engineError
                  ? `当前改用兜底逻辑：${runtime.engineError}`
                  : runtime.engineLabel}
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
                    ? "当前行动"
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
  onOpenSettings,
  onOpenReview,
  onRestart
}) {
  const progress = Math.round(
    (game.discoveredClues.length / game.scenario.clueCards.length) * 100
  );
  const champion = getTopPerformer(game.players);

  return (
    <div className="tw-page-shell">
      <TopBar
        phase="review"
        theme={selectedTheme}
        result={game.result}
        onOpenStory={onOpenStory}
        onOpenRules={onOpenRules}
        onOpenSettings={onOpenSettings}
        onOpenReview={onOpenReview}
        onPrimaryAction={onRestart}
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
            <p>{game.scenario.truth}</p>
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
            {game.timeline.map((entry, index) => (
              <div key={entry.id} className="tw-review-row">
                <div className="tw-review-index">{index + 1}</div>
                <div className="tw-review-card">
                  <strong>{entry.speaker}</strong>
                  <p>{entry.text}</p>
                </div>
                {entry.clue ? (
                  <span className="tw-clue-badge is-inline">{entry.clue.title}</span>
                ) : null}
              </div>
            ))}
          </div>

          <div className="tw-list-card">
            <div className="tw-block-head">
              <h3>关键线索总表</h3>
              <span>{game.discoveredClues.length} 条已解锁</span>
            </div>
            <div className="tw-clue-grid">
              {game.scenario.clueCards.map((clue) => (
                <div
                  key={clue.id}
                  className={`tw-clue-card ${
                    game.discoveredClues.some((card) => card.id === clue.id) ? "is-found" : ""
                  }`}
                >
                  <img src={clue.image} alt={clue.title} />
                  <span>
                    {game.discoveredClues.some((card) => card.id === clue.id) ? "已找到" : "未触发"}
                  </span>
                  <strong>{clue.title}</strong>
                </div>
              ))}
            </div>
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

          <div className="tw-seat-stack">
            {game.players.map((player) => (
              <SeatInfoCard
                key={player.id}
                player={player}
                note={`提问 ${player.questionsAsked} · 线索 ${player.clueHits} · 命中 ${player.correctGuesses}`}
              />
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
  const [game, setGame] = useState(() =>
    createInitialGame(
      DEFAULT_SETUP.humanCount,
      DEFAULT_SETUP.themeId,
      DEFAULT_SETUP.difficultyId
    )
  );
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

    const timer = window.setTimeout(async () => {
      const question =
        (() => getFallbackAiQuestion(currentPlayer, game.scenario))();

      let resolvedQuestion = question;
      try {
        setRuntime((prev) => ({
          ...prev,
          aiPending: true,
          engineError: "",
          engineLabel: "MiniMax M2.7 正在为 AI 席位生成问题"
        }));
        resolvedQuestion = await generateAiQuestion(game, currentPlayer);
        if (!cancelled) {
          setRuntime((prev) => ({
            ...prev,
            aiPending: false,
            engineError: "",
            engineLabel: "MiniMax M2.7 已生成本轮 AI 提问"
          }));
        }
      } catch (error) {
        if (!cancelled) {
          setRuntime((prev) => ({
            ...prev,
            aiPending: false,
            engineLabel: "MiniMax 暂时不可用，本轮改用本地兜底逻辑",
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
    setActiveOverlay(null);
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
        engineLabel: "MiniMax M2.7 正在裁定这次推理"
      }));
      judgement = await judgeGuess(game, guessText);
      setRuntime((prev) => ({
        ...prev,
        guessPending: false,
        engineError: "",
        engineLabel: "MiniMax M2.7 已完成本轮裁定"
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
        engineLabel: "MiniMax 暂时不可用，本轮改用本地裁定",
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

  const restoreDefaults = () => {
    setActiveOverlay(null);
    setRuntime(createInitialRuntime());
    setGame(
      createInitialGame(
        DEFAULT_SETUP.humanCount,
        DEFAULT_SETUP.themeId,
        DEFAULT_SETUP.difficultyId
      )
    );
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
                    ? "MiniMax 正在裁定这次推理……"
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
            <div className="tw-modal-grid">
              <div className="tw-modal-card">
                <span>题材方向</span>
                <strong>{selectedTheme.subtitle}</strong>
                <p>{selectedTheme.lead}</p>
              </div>
              <div className="tw-modal-card">
                <span>本局切口</span>
                <strong>{selectedTheme.starterQuestions[0]}</strong>
                <p>{game.scenario.summary}</p>
              </div>
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

    if (activeOverlay === "settings") {
      return {
        eyebrow: "设置",
        title: "当前开局参数",
        subtitle: "当前阶段先把桥守这一碗汤打磨完整，不开放多案切换。",
        children: (
          <>
            <div className="tw-modal-grid">
              <div className="tw-modal-card">
                <span>人类席位</span>
                <strong>
                  {game.humanCount}/{TOTAL_SEATS}
                </strong>
                <p>剩余席位由 AI 自动补位。</p>
              </div>
              <div className="tw-modal-card">
                <span>当前案件</span>
                <strong>{selectedTheme.title}</strong>
                <p>{selectedTheme.description}</p>
              </div>
              <div className="tw-modal-card">
                <span>难度</span>
                <strong>{selectedDifficulty.title}</strong>
                <p>
                  {game.questionLimit} 次提问 / {game.guessLimit} 次提交
                </p>
              </div>
              <div className="tw-modal-card">
                <span>当前阶段</span>
                <strong>{getPhaseLabel(game.phase)}</strong>
                <p>{game.phase === "setup" ? "尚未开局" : "本局已经开始推进"}</p>
              </div>
            </div>
          </>
        ),
        footer: (
          <>
            <button
              className="tw-secondary-cta"
              onClick={game.phase === "setup" ? restoreDefaults : resetToSetup}
            >
              {game.phase === "setup" ? "恢复默认配置" : "回到开局台"}
            </button>
            <button className="tw-secondary-cta is-dark" onClick={() => setActiveOverlay(null)}>
              关闭
            </button>
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
          onOpenSettings={() => setActiveOverlay("settings")}
          onReset={restoreDefaults}
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
          onOpenSettings={() => setActiveOverlay("settings")}
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
          onOpenSettings={() => setActiveOverlay("settings")}
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
