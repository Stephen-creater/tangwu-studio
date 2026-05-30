import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const envFilePath = path.join(rootDir, ".env.local");
const apiPort = Number(process.env.MINIMAX_API_PORT || 4176);
const apiBaseUrl = process.env.MINIMAX_API_BASE_URL || "https://api.minimaxi.com/v1";
const defaultModel = process.env.MINIMAX_MODEL || "MiniMax-M2.7";

loadLocalEnv(envFilePath);

function loadLocalEnv(filePath) {
  if (!existsSync(filePath)) return;

  const content = readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) continue;

    const key = line.slice(0, separatorIndex).trim();
    if (!key || process.env[key] !== undefined) continue;

    let value = line.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function writeJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  });
  res.end(JSON.stringify(payload));
}

function collectRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function stripThinkTags(text) {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

function extractTextFromOpenAIResponse(payload) {
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content === "string") return stripThinkTags(content);

  if (Array.isArray(content)) {
    return stripThinkTags(
      content
        .map((part) => {
          if (typeof part === "string") return part;
          if (typeof part?.text === "string") return part.text;
          if (typeof part?.content === "string") return part.content;
          return "";
        })
        .join("")
    );
  }

  return "";
}

async function handleMinimaxRequest(req, res) {
  const apiKey = process.env.MINIMAX_API_KEY?.trim();
  if (!apiKey) {
    writeJson(res, 500, {
      error: "Missing MINIMAX_API_KEY. Add it to .env.local or your shell environment."
    });
    return;
  }

  let body;
  try {
    body = JSON.parse(await collectRequestBody(req));
  } catch {
    writeJson(res, 400, { error: "Request body must be valid JSON." });
    return;
  }

  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) {
    writeJson(res, 400, { error: "Field `prompt` is required." });
    return;
  }

  const maxTokens =
    typeof body?.maxTokens === "number" && Number.isFinite(body.maxTokens)
      ? Math.max(64, Math.min(2048, Math.round(body.maxTokens)))
      : 600;

  const endpoint = `${apiBaseUrl.replace(/\/$/, "")}/chat/completions`;

  let upstreamResponse;
  try {
    upstreamResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: defaultModel,
        max_tokens: maxTokens,
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }]
      })
    });
  } catch (error) {
    writeJson(res, 502, {
      error: "Failed to reach MiniMax upstream.",
      detail: error instanceof Error ? error.message : String(error)
    });
    return;
  }

  const rawText = await upstreamResponse.text();
  let payload;
  try {
    payload = JSON.parse(rawText);
  } catch {
    writeJson(res, 502, {
      error: "MiniMax returned non-JSON content.",
      detail: rawText.slice(0, 400)
    });
    return;
  }

  if (!upstreamResponse.ok) {
    writeJson(res, upstreamResponse.status, {
      error: "MiniMax API error.",
      detail: payload?.error?.message || payload?.message || rawText.slice(0, 400)
    });
    return;
  }

  const text = extractTextFromOpenAIResponse(payload);
  writeJson(res, 200, {
    model: payload?.model || defaultModel,
    text,
    usage: payload?.usage || null
  });
}

const server = createServer(async (req, res) => {
  if (!req.url || !req.method) {
    writeJson(res, 404, { error: "Not found." });
    return;
  }

  if (req.method === "OPTIONS") {
    writeJson(res, 204, {});
    return;
  }

  if (req.method === "GET" && req.url === "/api/health") {
    writeJson(res, 200, {
      ok: true,
      model: defaultModel,
      baseUrl: apiBaseUrl,
      hasApiKey: Boolean(process.env.MINIMAX_API_KEY?.trim())
    });
    return;
  }

  if (req.method === "POST" && req.url === "/api/minimax") {
    await handleMinimaxRequest(req, res);
    return;
  }

  writeJson(res, 404, { error: "Not found." });
});

server.listen(apiPort, "127.0.0.1", () => {
  console.log(
    `[minimax-api] listening on http://127.0.0.1:${apiPort} using ${defaultModel}`
  );
});
