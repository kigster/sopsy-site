# Product Marketing Context

*Last updated: 2026-06-28 — V1 auto-draft from codebase + README + product model. Needs founder review on flagged TODOs.*

## Product Overview
**One-liner:** sopsy keeps your team's shared secrets strongly encrypted right inside your Git repo — unlocked with a fingerprint, never a shared password.

**What it does:** sopsy is a small, fast Rust CLI that wraps SOPS + age to make encrypted secrets in Git delightful instead of fiddly. It bootstraps a repo in seconds, mints each teammate a hardware-backed identity in the macOS Secure Enclave (unlocked by Touch ID), manages who can decrypt, and ships a CI gate that fails the build the moment a plaintext secret is committed.

**Product category:** Secrets management for developers — specifically the "encrypted secrets in Git" shelf (alongside SOPS, git-crypt, sealed-secrets), positioned as the friendly alternative to running a secrets *server* (Vault, Doppler, Infisical).

**Product type:** Open-source CLI tool (Rust). macOS-first, v1. Installed via `cargo install sopsy`.

**Business model:** Free & open source (MIT / Apache-2.0) today. TODO(founder): is there a planned commercial tier — team/SaaS dashboard, audit log, non-macOS support, paid support? This determines whether the site optimizes for installs+stars or for a waitlist/revenue motion.

## Target Audience
**Target companies:** Small-to-mid engineering teams and open-source projects that store config in Git; Apple-Silicon/macOS shops; security-conscious startups without a dedicated platform/secops team.

**Decision-makers:** Individual developers and tech leads (bottoms-up adoption). No procurement — a dev finds it, installs it, brings the team along.

**Primary use case:** Stop scattering API keys and `.env` values across Slack DMs, 1Password notes, and untracked files — keep them encrypted *in the repo* where the code already lives, with per-developer hardware keys.

**Jobs to be done:**
- "Let my team share secrets without a plaintext `.env` ever touching Slack or Git history."
- "Give every developer their own key in hardware, so a leaked laptop file isn't a leaked secret."
- "Onboard/offboard teammates to our secrets without a manual re-keying ritual or a server to run."

**Use cases:** repo bootstrap; onboarding a new engineer; rotating/offboarding a departing one; editing an encrypted file with your normal `$EDITOR`; guarding CI against accidental plaintext leaks; emergency recovery when a device is lost.

## Personas
| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| User (developer) | Not fighting tooling; `git pull` & go | Raw SOPS has ~8 ways to get it wrong | Delightful defaults; Touch ID; secrets just open |
| Champion (tech lead) | Team can self-serve safely | Onboarding/rotation is manual & error-prone | Any member approves the next; CI gate catches leaks |
| Decision maker (eng lead/founder) | Security posture without ops overhead | Vault/Doppler = a server + a bill | No server, no subscription; keys in hardware; break-glass recovery |

## Problems & Pain Points
**Core problem:** Teams need to share secrets, but every easy method is unsafe (plaintext `.env` in Slack/Git) and every safe method is heavy (stand up Vault, pay for Doppler, or wrestle raw SOPS config by hand).

**Why alternatives fall short:**
- Plaintext `.env` over Slack/1Password notes: leaks, no rotation, no audit, drifts instantly.
- Raw SOPS + age: powerful but fiddly — hand-edit `.sops.yaml`, remember `sops updatekeys`, no hardware keys by default, no guardrails.
- Vault / Doppler / Infisical: another service to run or pay for; secrets live *outside* your repo; overkill for most teams.

**What it costs them:** leaked credentials and incident cleanup; hours lost to onboarding/rotation rituals; a departed teammate's key still decrypting new commits; or a monthly bill + ops burden for a secrets server.

**Emotional tension:** the quiet dread of "is there a secret in our Git history?" and the guilt of knowing the `.env` is being passed around in DMs.

## Competitive Landscape
**Direct:** Raw SOPS + age, git-crypt, sealed-secrets — same idea (encrypted secrets in Git), but manual, no per-user Secure Enclave keys, no Touch ID, no onboarding/CI ergonomics.
**Secondary:** Vault, Doppler, Infisical, AWS/GCP Secret Manager — solve the problem with a server/SaaS; cost, ops, and your secrets leave the repo.
**Indirect:** 1Password / shared `.env` over Slack — convenient, deeply unsafe, no rotation or audit story.

## Differentiation
**Key differentiators:**
- Secrets live encrypted **in your repo** — no server, no subscription, no secrets leaving Git.
- Each teammate's private key is **minted in the macOS Secure Enclave and never leaves the chip**; only the public recipient is shared.
- **Touch ID** to decrypt — biometric, not a shared passphrase.
- **Self-service onboarding**: a newcomer runs `join`, any active member runs `approve` — no admin bottleneck, automatic re-keying.
- **Break-glass** emergency key for recovery if devices are lost.
- **CI gate** with seven hygiene invariants that fails the build on any plaintext leak.
- Built on **SOPS + age** — the encryption tools teams already trust; sopsy only removes the friction.

**How we do it differently:** delightful, colorful, opinionated CLI that automates the fiddly parts of a proven crypto stack instead of inventing new crypto or running a service.
**Why that's better:** the security of hardware-backed, per-user encryption with the convenience of "it's just in the repo."
**Why customers choose us:** zero infrastructure, zero cost, real hardware security, and an onboarding flow that doesn't need a secops team.

## Objections
| Objection | Response |
|-----------|----------|
| "Committing secrets to Git is insane." | They're strongly encrypted (SOPS + age); only holders of an approved hardware key can decrypt. The CI gate blocks any *plaintext* leak. |
| "Why not just use SOPS directly?" | You can — sopsy runs SOPS under the hood. It removes the ~8 ways you get raw SOPS wrong, and adds Secure Enclave keys, Touch ID, onboarding, and a CI gate. |
| "Is this just for macOS?" | v1 is macOS-first (Secure Enclave + Touch ID). TODO(founder): Linux/CI decrypt story for mixed teams. |

**Anti-persona:** large enterprises that already run Vault/KMS with compliance mandates; all-Linux/Windows teams (no Secure Enclave) for v1; anyone wanting a hosted UI/dashboard.

## Switching Dynamics
**Push:** fear of secrets in Git history; pain of manual `.env` sharing and rotation; not wanting to run/pay for a secrets server.
**Pull:** "commit your secrets safely + unlock with your fingerprint"; no infra; same trusted engine.
**Habit:** the `.env` in Slack "works fine"; raw SOPS is already set up.
**Anxiety:** "is committing encrypted secrets really safe?"; "is macOS-only a dealbreaker?"; trust in a young tool.

## Customer Language
**How they describe the problem (TODO — replace with verbatim quotes once you have users):**
- "We just pass the `.env` around in Slack and hope."
- "I never know if there's a secret somewhere in our Git history."
**How they describe us (TODO — gather verbatim):**
- placeholder
**Words to use:** secrets, `.env`, API keys, encrypted in Git, hardware key, Touch ID, Secure Enclave, no server, fingerprint, break-glass.
**Words to avoid (in the hero):** "SOPS" as the *lead* concept (jargon to the uninitiated — use it as the credibility anchor, not the hook), "recipient management" (insider term), "creation_rules".
**Glossary:**
| Term | Meaning |
|------|---------|
| SOPS | Mozilla's Secrets OPerationS — the encryption engine sopsy wraps |
| age | modern file-encryption tool / key format SOPS uses |
| Secure Enclave | Apple hardware security chip that stores the private key |
| break-glass | offline emergency key for recovery if devices are lost |
| recipient | a public key allowed to decrypt the secrets |

## Brand Voice
**Tone:** confident, witty, a little provocative; developer-native.
**Style:** direct and concrete; terminal/CLI-flavored; shows, doesn't tell (live `sopsy init` demo).
**Personality:** sharp, security-serious-but-fun, "cryptographic terminal" aesthetic (near-black canvas, rust + acid-lime).

## Proof Points
**Metrics:** TODO(founder) — crates.io downloads, GitHub stars, "bootstraps in 4.2s" demo figure (currently illustrative).
**Customers:** none public yet (pre-launch).
**Testimonials:** TODO — gather 2-3 from first users.
**Value themes:**
| Theme | Proof |
|-------|-------|
| Safe to commit | SOPS + age encryption; CI gate blocks plaintext |
| Hardware-backed per user | Secure Enclave key never leaves the chip; Touch ID |
| No infra, no bill | OSS CLI; nothing to host; secrets stay in your repo |
| Team-ready | join/approve onboarding; break-glass recovery |

## Goals
**Business goal:** adoption (installs + GitHub stars) as the top of a future funnel. TODO(founder): is there a revenue goal/commercial tier behind this?
**Conversion action:** `cargo install sopsy` (primary); GitHub star / Quick start (secondary).
**Current metrics:** unknown / pre-launch.
