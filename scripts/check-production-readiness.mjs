const goLive = process.argv.includes("--go-live");
const errors = [];
const warnings = [];
const productionOrigin = "https://pesdeseda.com.br";

const required = [
  "APP_URL",
  "ASAAS_ACCESS_TOKEN",
  "ASAAS_WEBHOOK_TOKEN",
  "ASAAS_SUCCESS_URL",
  "ASAAS_CANCEL_URL",
  "ASAAS_EXPIRED_URL",
  "ASAAS_WEBHOOK_URL",
  "PDF_STORAGE_KEY",
  "DATABASE_PATH",
];

for (const name of required) {
  if (!process.env[name]?.trim()) errors.push(`${name} não configurada.`);
}

if (process.env.ASAAS_API_URL !== "https://api.asaas.com/v3") {
  errors.push("ASAAS_API_URL deve ser https://api.asaas.com/v3 em produção.");
}

if (process.env.CHECKOUT_MODE !== "asaas") {
  errors.push("CHECKOUT_MODE deve ser asaas para a homologação de produção.");
}

if (process.env.PRODUCT_PRICE_CENTS !== "4990") {
  errors.push("PRODUCT_PRICE_CENTS deve permanecer em 4990 (R$ 49,90).");
}

if (process.env.APP_URL !== productionOrigin) {
  errors.push(`APP_URL deve ser ${productionOrigin}.`);
}

for (const name of ["ASAAS_SUCCESS_URL", "ASAAS_CANCEL_URL", "ASAAS_EXPIRED_URL", "ASAAS_WEBHOOK_URL"]) {
  const value = process.env[name];
  if (!value) continue;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") errors.push(`${name} precisa usar HTTPS.`);
    if (url.origin !== productionOrigin) errors.push(`${name} deve usar o domínio ${productionOrigin}.`);
  } catch {
    errors.push(`${name} não é uma URL válida.`);
  }
}

const expectedPaths = {
  ASAAS_SUCCESS_URL: "/pedido",
  ASAAS_CANCEL_URL: "/pedido",
  ASAAS_EXPIRED_URL: "/pedido",
  ASAAS_WEBHOOK_URL: "/api/webhooks/asaas",
};
for (const [name, expectedPath] of Object.entries(expectedPaths)) {
  const value = process.env[name];
  if (!value) continue;
  try {
    if (new URL(value).pathname !== expectedPath) errors.push(`${name} deve terminar em ${expectedPath}.`);
  } catch {
    // A URL inválida já foi registrada acima.
  }
}

const webhookToken = process.env.ASAAS_WEBHOOK_TOKEN ?? "";
if (webhookToken && (webhookToken.length < 32 || webhookToken.length > 255 || /\s/.test(webhookToken))) {
  errors.push("ASAAS_WEBHOOK_TOKEN deve ter 32 a 255 caracteres e não conter espaços.");
}
if (webhookToken && webhookToken === process.env.ASAAS_ACCESS_TOKEN) {
  errors.push("ASAAS_WEBHOOK_TOKEN deve ser diferente da chave da API.");
}

const accessToken = process.env.ASAAS_ACCESS_TOKEN ?? "";
if (accessToken && !accessToken.startsWith("$aact_prod_")) {
  warnings.push("A chave não tem o prefixo de produção documentado pelo Asaas; confirme o ambiente da credencial.");
}

if ((process.env.PDF_STORAGE_KEY ?? "").toLowerCase().includes("public")) {
  errors.push("PDF_STORAGE_KEY não pode apontar para public/.");
}

if (goLive && process.env.SALES_ENABLED !== "true") {
  errors.push("Para a checagem de abertura, SALES_ENABLED deve ser true após aprovação expressa do titular.");
}
if (goLive && process.env.SITE_INDEXABLE !== "true") {
  errors.push("SITE_INDEXABLE deve ser true após a aprovação da publicação comercial.");
}
if (!goLive && process.env.SALES_ENABLED === "true") {
  warnings.push("SALES_ENABLED está true. Mantenha false até concluir a homologação e receber aprovação do titular.");
}

console.log(`Checagem de produção Pés de Seda (${goLive ? "abertura" : "pré-homologação"})`);
for (const warning of warnings) console.warn(`AVISO: ${warning}`);
for (const error of errors) console.error(`ERRO: ${error}`);

if (errors.length) {
  console.error(`Resultado: reprovado (${errors.length} pendência(s)). Nenhum segredo foi exibido.`);
  process.exitCode = 1;
} else {
  console.log("Resultado: configuração aprovada pela checagem local. Ainda execute uma compra controlada e valide o webhook no ambiente real.");
}
