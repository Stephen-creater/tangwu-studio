const MINIMAX_API_BASE_URL = "https://api.minimaxi.com/v1";
const MINIMAX_MODEL = "MiniMax-M2.7";
const MINIMAX_API_KEY =
  "sk-cp-TekIaMAeLsNcA_np_SUNTAM_NvZ8mrLFL_fEnqEYhrrCSWVZ-zsYmJ4n_0dtOWkOPmt7ymr63zyw_LxGpbcuwbuE2ih2FNshrPUyh956MBUN64TrgA7k7mA";

function stripThinkTags(text) {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

function pickJsonBlock(text) {
  const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1);
  }

  return text.trim();
}

function parseJsonObject(text) {
  const candidate = pickJsonBlock(text);
  try {
    return JSON.parse(candidate);
  } catch {
    return null;
  }
}

function extractQuestionFromText(text) {
  const quotedQuestion = text.match(/[“"]([^"”\n]*[？?])["”]/);
  if (quotedQuestion?.[1]) {
    return quotedQuestion[1].trim();
  }

  const lineQuestion = text
    .split("\n")
    .map((line) => line.trim())
    .find((line) => /[？?]$/.test(line));
  if (lineQuestion) {
    return lineQuestion.replace(/^question[:：]\s*/i, "").trim();
  }

  const sentenceQuestion = text.match(/([^。！!\n]*[？?])/);
  return sentenceQuestion?.[1]?.trim() || "";
}

function inferGuessOutcome(text) {
  if (/success|命中|正确|抓住了核心因果/i.test(text)) return "success";
  if (/close|接近|还差|差半步/i.test(text)) return "close";
  if (/fail|偏离|错误|摇头/i.test(text)) return "fail";
  return null;
}

function isUsableQuestion(text) {
  return Boolean(text) && text.length <= 30 && /[？?]$/.test(text) && !/[A-Za-z]/.test(text);
}

function defaultNoteForOutcome(outcome) {
  if (outcome === "success") return "你已经抓住了真正的因果链。";
  if (outcome === "close") return "你已经非常接近，再补一个关键因果就够了。";
  return "桥守摇头不语。";
}

async function callMiniMax(prompt, maxTokens = 500) {
  const response = await fetch(`${MINIMAX_API_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MINIMAX_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MINIMAX_MODEL,
      max_tokens: maxTokens,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          name: "MiniMax AI",
          content: "You are a helpful assistant."
        },
        {
          role: "user",
          name: "用户",
          content: prompt
        }
      ]
    })
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(
      payload?.error?.message || payload?.detail || payload?.error || "MiniMax request failed."
    );
  }

  const text = payload?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("MiniMax returned an empty text block.");
  }

  return stripThinkTags(text);
}

function buildRecentTimeline(game) {
  return game.timeline
    .slice(-8)
    .map((entry) => `${entry.speaker}：${entry.text}`)
    .join("\n");
}

export async function generateAiQuestion(game, player) {
  const prompt = [
    "你是中文海龟汤游戏里的 AI 队友。",
    "请根据题面与已知线索，提出一个最值得问桥守的问题。",
    "要求：只能输出一个中文问题；问题必须能被回答为“是/否/无关”；不要解释；不要英文；不要多问。",
    "",
    `故事标题：${game.scenario.title}`,
    `题面：${game.scenario.opening}`,
    `已发现线索：${
      game.discoveredClues.length > 0
        ? game.discoveredClues.map((clue) => clue.title).join("；")
        : "暂无"
    }`,
    `当前玩家：${player.seat}号 ${player.name}`,
    `最近对话：\n${buildRecentTimeline(game)}`,
    "只输出问题本身。"
  ].join("\n");

  const text = await callMiniMax(prompt, 1200);
  const parsed = parseJsonObject(text);
  const question =
    typeof parsed?.question === "string" ? parsed.question.trim() : extractQuestionFromText(text);

  if (!isUsableQuestion(question)) {
    throw new Error("MiniMax did not return a valid question.");
  }

  return question.replace(/^["'“”]+|["'“”]+$/g, "");
}

export async function judgeGuess(game, guess) {
  const prompt = [
    "你是海龟汤游戏裁定器。",
    "请根据标准真相判断玩家推理是 success、close、还是 fail。",
    "只输出这三个单词中的一个，不要解释，不要中文句子，不要 Markdown。",
    "",
    `题面：${game.scenario.opening}`,
    `标准真相：${game.scenario.truth}`,
    `玩家推理：${guess}`
  ].join("\n");

  const text = await callMiniMax(prompt, 1600);
  const parsed = parseJsonObject(text);
  const outcome =
    parsed?.outcome === "success" || parsed?.outcome === "close" || parsed?.outcome === "fail"
      ? parsed.outcome
      : inferGuessOutcome(text);

  if (!outcome) {
    throw new Error("MiniMax did not return a valid judgement.");
  }

  return {
    outcome,
    note: defaultNoteForOutcome(outcome)
  };
}
