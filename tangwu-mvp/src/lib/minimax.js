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

function inferQuestionAnswer(text) {
  const trimmed = text.trim();
  if (/^yes$/i.test(trimmed) || /^是$/.test(trimmed) || /"answer"\s*:\s*"是"/.test(trimmed)) {
    return "是";
  }
  if (/^no$/i.test(trimmed) || /^否$/.test(trimmed) || /"answer"\s*:\s*"否"/.test(trimmed)) {
    return "否";
  }
  if (
    /^irrelevant$/i.test(trimmed) ||
    /^无关$/.test(trimmed) ||
    /"answer"\s*:\s*"无关"/.test(trimmed)
  ) {
    return "无关";
  }
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
  const response = await fetch("/api/minimax", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt,
      maxTokens
    })
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.detail || payload?.error || "MiniMax request failed.");
  }

  if (!payload?.text) {
    throw new Error("MiniMax returned an empty text block.");
  }

  return payload.text;
}

function buildRecentTimeline(game) {
  return game.timeline
    .slice(-8)
    .map((entry) => `${entry.speaker}：${entry.text}`)
    .join("\n");
}

function formatDiscoveredClues(game) {
  if (!game.discoveredClues.length) return "暂无";
  return game.discoveredClues.map((clue) => clue.title || clue.id || String(clue)).join("；");
}

function formatClueOptions(game) {
  return game.scenario.clueCards
    .map((clue) => `${clue.id}：${clue.title}`)
    .join("\n");
}

function normalizeClueId(game, clueId) {
  if (typeof clueId !== "string") return null;
  const trimmed = clueId.trim();
  if (!trimmed || trimmed === "null" || trimmed === "无") return null;
  return game.scenario.clueCards.some((clue) => clue.id === trimmed) ? trimmed : null;
}

export async function generateAiQuestion(game, player) {
  const prompt = [
    "你是中文海龟汤游戏里的 AI 队友。",
    "请根据题面与已知线索，提出一个最值得问桥守的问题。",
    "要求：只能输出一个中文问题；问题必须能被回答为“是/否/无关”；不要解释；不要英文；不要多问。",
    "",
    `故事标题：${game.scenario.title}`,
    `题面：${game.scenario.opening}`,
    `已发现线索：${formatDiscoveredClues(game)}`,
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

export async function judgeQuestion(game, question) {
  const prompt = [
    "你是中文海龟汤游戏的桥守。",
    "玩家会问一个只能回答“是 / 否 / 无关”的问题。",
    "请严格根据题面与标准真相判断这个问题的答案。",
    "如果问题与谜题真相、关键线索、人物行为、时间线、物证或现场无关，回答“无关”。",
    "如果命中或接近某条关键线索，请给出对应 clueId；如果没有明确线索，clueId 为 null。",
    "不要解释，不要泄露额外真相，不要输出 Markdown。",
    "只输出 JSON，格式必须是：{\"answer\":\"是|否|无关\",\"clueId\":\"线索ID或null\"}",
    "",
    `故事标题：${game.scenario.title}`,
    `题面：${game.scenario.opening}`,
    `标准真相：${game.scenario.truth}`,
    `可用线索：\n${formatClueOptions(game)}`,
    `已发现线索：${formatDiscoveredClues(game)}`,
    `最近对话：\n${buildRecentTimeline(game)}`,
    `玩家问题：${question}`
  ].join("\n");

  const text = await callMiniMax(prompt, 1000);
  const parsed = parseJsonObject(text);
  const answer =
    parsed?.answer === "是" || parsed?.answer === "否" || parsed?.answer === "无关"
      ? parsed.answer
      : inferQuestionAnswer(text);

  if (!answer) {
    throw new Error("MiniMax did not return a valid question judgement.");
  }

  return {
    answer,
    clueId: answer === "无关" ? null : normalizeClueId(game, parsed?.clueId)
  };
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
