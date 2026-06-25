/**
 * Gmail OAuth2 Setup Script
 *
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a project → Enable Gmail API
 * 3. Credentials → Create OAuth client ID → Desktop app
 * 4. Download the JSON and save as credentials.json in this directory
 * 5. Run: node scripts/setup-gmail-oauth.cjs
 * 6. Copy the refresh token to .env.local
 */

const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");
const { URL } = require("url");

const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");
const SCOPES = ["https://mail.google.com/"];

async function loadCredentials() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error(`
  ❌ credentials.json not found at: ${CREDENTIALS_PATH}

  Steps:
    1. Go to https://console.cloud.google.com/
    2. Create or select a project
    3. Enable Gmail API (APIs & Services → Library)
    4. Go to Credentials → Create Credentials → OAuth client ID
    5. Application type: Desktop app
    6. Click Download JSON and save it as:
       ${CREDENTIALS_PATH}
    7. Run this script again
`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
}

function getAuthUrl(creds, redirectPort) {
  const redirectUri = `http://localhost:${redirectPort}`;
  const params = new URLSearchParams({
    client_id: creds.installed.client_id,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
  });
  return { url: `https://accounts.google.com/o/oauth2/auth?${params}`, redirectUri };
}

function exchangeCode(creds, code, redirectUri) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      code,
      client_id: creds.installed.client_id,
      client_secret: creds.installed.client_secret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });

    const req = https.request(
      "https://oauth2.googleapis.com/token",
      { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" } },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(new Error("Failed to parse token response: " + data));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(params.toString());
    req.end();
  });
}

async function main() {
  console.log("\n  📧 Gmail OAuth2 Setup for RailBookPro\n");

  const creds = await loadCredentials();
  const redirectPort = 58888;

  const { url: authUrl, redirectUri } = getAuthUrl(creds, redirectPort);

  console.log("  Opening browser for authorization...\n");
  console.log(`  If browser doesn't open, visit:\n  ${authUrl}\n`);

  try {
    const cp = require("child_process");
    cp.exec(`start "" "${authUrl}"`);
  } catch {}

  const code = await new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const parsed = new URL(req.url, `http://localhost:${redirectPort}`);
      const code = parsed.searchParams.get("code");
      const error = parsed.searchParams.get("error");

      if (error) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end(`<h2>❌ Authorization failed: ${error}</h2><p>Please try again.</p>`);
        reject(new Error(error));
        return;
      }

      if (code) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
          <h2>✅ Authorization successful!</h2>
          <p>You can close this window and return to the terminal.</p>
          <script>window.close()</script>
        `);
        server.close();
        resolve(code);
      } else {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end("<h2>❌ No authorization code received</h2>");
        reject(new Error("No code received"));
      }
    });
    server.listen(redirectPort, () => console.log(`  Waiting for authorization on http://localhost:${redirectPort}...\n`));
    server.on("error", reject);
  });

  console.log("  Exchanging code for tokens...");
  const tokens = await exchangeCode(creds, code, redirectUri);

  if (tokens.error) {
    console.error(`\n  ❌ Error: ${tokens.error} - ${tokens.error_description}\n`);
    process.exit(1);
  }

  console.log("\n  ✅ OAuth2 setup complete!\n");
  console.log("  Add these to your .env.local:\n");
  console.log(`  GMAIL_USER="${creds.installed.client_email || creds.installed.client_id.split("-")[0]}"`);
  console.log(`  GMAIL_CLIENT_ID="${creds.installed.client_id}"`);
  console.log(`  GMAIL_CLIENT_SECRET="${creds.installed.client_secret}"`);
  console.log(`  GMAIL_REFRESH_TOKEN="${tokens.refresh_token}"`);
  console.log("");
  console.log(`  Your email: the.ami.work@gmail.com (or whatever Gmail you authorized)`);
  console.log("  (Replace GMAIL_USER with your actual Gmail address)\n");
}

main().catch((err) => {
  console.error("\n  ❌ Error:", err.message, "\n");
  process.exit(1);
});
