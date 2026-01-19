# Pocketdev — Agentic PRD (v1)

## 🚀 Product Vision

Pocketdev is a mobile-first, chat-first control plane for software development. It replaces terminal-first and IDE-first workflows with **intent → agent → execution**.

> The user does not "code by hand" by default.  
> The user issues instructions.  
> Agents do the work.  
> The terminal exists, but only as an implementation detail.

---

## 👤 Target User

**Primary user (initial, explicit):**

- Solo developer / power user
- Agent-heavy workflow (Claude Code, OpenCode, Codex CLI)
- Mobile-first thinking (phone is the main thinking surface)
- Uses cloud Linux (Ubuntu EC2)
- Comfortable with infra, Terraform, SSH, CLI tools
- Already delegates most work to AI agents

> This is not a beginner product and not a mass-market IDE replacement.

---

## 🎯 Core Principles (Non-Negotiable)

1. **Chat is the primary interface**
2. **Agents are first-class primitives**
3. **Terminal is hidden by default**
4. **State is persistent**
5. **Mobile UX comes first**
6. **No fake execution** (everything runs for real)
7. **User stays in control** (inspectability is mandatory)

---

## 🚫 What Pocketdev Is Not

- ❌ Not a terminal emulator
- ❌ Not a code editor
- ❌ Not a VS Code replacement
- ❌ Not a toy chat UI
- ❌ Not a generic chatbot

> Pocketdev is a **control plane**, not a workspace.

---

## 🏗️ Core Abstractions

### Agents (First-Class)

Each supported CLI tool is wrapped as a native agent adapter.

**Initial required agents:**
- OpenCode Agent
- Claude Code Agent
- Codex CLI Agent

**Each agent adapter must:**
- Manage its own process lifecycle
- Maintain session state
- Handle auth/session restoration
- Stream structured output
- Fail gracefully (re-auth, restart, retry)

**User experience:**
- The user never types: `opencode ask ...`
- They type: `> "Refactor service layer and explain tradeoffs."`
- Pocketdev decides which agent handles it

### Chat Message Types

Every message is classified into exactly one of these:

1. **Reason-only** - No execution, planning/explanation/thinking
2. **Plan** - Explains what will be done, no execution yet
3. **Execute** - Runs real commands via agents or shell, streams output
4. **Delegate** - Explicitly routed to a specific agent

> The UI must make this classification visible.

---

## ⚙️ Execution Model

### Runtime
- **Real Ubuntu environment** (EC2)
- **One persistent shell** (PTY)
- **Backed by tmux or PTY manager**
- **Shell state persists across messages:** working directory, env vars, git state

### Transport
- **WebSocket** (preferred)
- Streaming output
- Low latency
- Mobile-friendly

### Terminal Visibility
Terminal output is rendered as:
- Collapsible logs
- Diffs
- Summaries

> Raw terminal view is optional, not default

---

## 📱 Mobile UX Requirements

### Must Have
- ChatGPT-style conversation UI
- Large touch targets
- Collapsible execution blocks
- Clear separation between: intent, execution, result
- Agent indicator per message

### Must Not Have
- `$ prompt` as primary UI
- Manual flag typing as default
- Dense terminal walls of text

---

## 🔐 Auth & Secrets Strategy

### Explicit Decisions
- No browser session cookies
- No AWS keys on mobile
- No long-lived secrets hardcoded

### Supported Sources
- **Bitwarden** (Secure Notes) for CLI auth caches and tokens that unblock mobile workflows
- **IAM roles** for EC2 infra access

> Pocketdev restores agent sessions automatically at runtime.

---

## 🚀 One-Move Setup (Critical)

Pocketdev must support:
- Terraform-driven EC2 provisioning
- Automatic bootstrap on first boot
- Automatic restore of: dotfiles (from GitHub, e.g. judigot/user), agent sessions, workspace state

**User flow:**
```
bun dev
→ EC2 spins up
→ Pocketdev backend comes online
→ User opens mobile app
→ Chat is live
```

> No manual setup inside the instance.

---

## ⚠️ Failure Handling (Required)

Pocketdev must:
- Detect agent crashes
- Detect expired auth
- Prompt for re-auth when unavoidable
- Never silently fail
- Never fake success

> Failure must be visible and explainable.

---

## 🔒 Security Posture

- Single-user first
- No multi-tenant assumptions
- No shared shells
- Minimal attack surface
- Explicit command execution boundaries

---

## 🎯 MVP Scope (V0)

### V0 Must Include
- Chat UI (mobile-first)
- One persistent shell
- One agent adapter (pick OpenCode)
- Streaming output
- Manual agent selection
- Inspectable logs

### V0 Explicitly Does Not Need
- Teams
- Collaboration
- Plugins
- Marketplace
- Monetization

---

## 📋 Success Criteria

Pocketdev succeeds if:
- The user rarely opens a raw terminal
- The user completes real work from a phone
- Agent usage feels native, not hacked
- The user thinks in intent, not syntax

---

## 🧪 Ultimate MVP Test

The single test that determines if Pocketdev is a successful MVP/POC:

**Step 1:** Run this command in Pocketdev chat interface:
```bash
. <(curl -fsSL "https://raw.githubusercontent.com/judigot/user/main/load-devrc.sh?cachebustkey=$(date +%s)")
```

**Step 2:** Run this command:
```bash
hi
```

### Success Criteria
- Both commands execute successfully through chat interface
- Output shows `Hello, root!` or `Hello, [username]!` with actual OS username
- User never sees terminal prompt or direct shell access
- All functionality works entirely through mobile chat interface
- Terminal remains hidden (implementation detail only)

### What This Validates
- ✅ Real command execution on Ubuntu terminal
- ✅ Network connectivity (curl access)
- ✅ Shell scripting support (process substitution)
- ✅ Environment loading and alias system
- ✅ State persistence across commands
- ✅ Complete chat → execution → results flow
- ✅ Mobile-first interaction without terminal exposure

> **Failure = Not MVP:** If user cannot successfully run both commands and get greeting through chat alone, core premise fails.

---

## 🤖 MVP Golden Test Automation

The ultimate MVP test is fully automatable using Detox:

```typescript
test('MVP golden test', async () => {
  // Execute devrc loading
  await element(by.id('chat-input')).typeText(
    '. <(curl -fsSL "https://raw.githubusercontent.com/judigot/user/main/load-devrc.sh?cachebustkey=$(date +%s)")'
  );
  await element(by.id('send-button')).tap();
  await waitFor(element(by.id('command-success'))).toBeVisible({timeout: 30000});
  
  // Execute hi command
  await element(by.id('chat-input')).typeText('hi');
  await element(by.id('send-button')).tap();
  await waitFor(element(by.text('Hello, ubuntu!'))).toBeVisible({timeout: 10000});
  
  // Verify terminal invisibility
  await expect(element(by.id('terminal-prompt'))).not.toExist();
  
  // Verify state persistence
  await device.reloadReactNative();
  await expect(element(by.text('Hello, ubuntu!'))).toBeVisible();
});
```

---

## 🧪 MVP Testing Stack

- **E2E**: Detox for React Native automation
- **Component**: React Native Testing Library
- **Unit**: Jest (built-in)

---

## ✅ MVP Success Criteria

- All automated tests pass
- Golden test executes successfully  
- Terminal never appears in UI
- Complete workflow through mobile chat

---

## 🎯 One-Sentence Product Definition

Pocketdev is a mobile-first, chat-driven control plane that lets you instruct agentic CLI tools to do real development work on a real machine—without living in a terminal.