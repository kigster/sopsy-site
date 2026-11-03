// The "Team scenarios" story, mirroring the sopsy README section of the same
// name: one team, four people, one policy. The people are historical figures,
// never real users; tests/data.test.ts enforces that.
export interface TeamMember {
  name: string;
  role: string;
  /** Short label for the key store this person ends up with. */
  store: string;
  /** Card accent: maps to a .team__card--<accent> modifier. */
  accent: "policy" | "yubikey" | "enclave" | "linux";
  cmd: string;
  /** HTML bullet points. */
  notes: string[];
}

export const team: TeamMember[] = [
  {
    name: "Ada",
    role: "VP of Engineering",
    store: "sets the policy",
    accent: "policy",
    cmd: "sopsy init -A onchip,exthardware",
    notes: [
      "Hardware only: the Secure Enclave or a YubiKey. The policy is committed in <code>.sopsy.yml</code>.",
      "Interactive <code>init</code> also creates the <b>break-glass</b> key. Ada saves it in the team vault and presses ENTER; sopsy deletes the local copy.",
      "CI never runs <code>init</code>. It gets its own portable key with <code>sopsy recipient ci</code>.",
    ],
  },
  {
    name: "Alan Turing",
    role: "engineer",
    store: "YubiKey",
    accent: "yubikey",
    cmd: 'sopsy join "Alan Turing" -s yubikey -c cached -b cached',
    notes: [
      "<code>-c cached</code>: the PIN is asked once per session, until the YubiKey is unplugged.",
      "<code>-b cached</code>: after the PIN, one touch, then not again for 15 seconds.",
      'He pushes the pending entry; Ada runs <code>sopsy approve "Alan Turing"</code>.',
    ],
  },
  {
    name: "Grace Hopper",
    role: "engineer",
    store: "Secure Enclave",
    accent: "enclave",
    cmd: 'sopsy join "Grace Hopper" -s enclave',
    notes: [
      "Every decryption asks for Touch ID. Fine for an occasional <code>sopsy edit</code>.",
      "A problem once tools decrypt on their own, in every worktree and every shell. See the caching tips below.",
    ],
  },
  {
    name: "Dennis Ritchie",
    role: "engineer",
    store: "Linux, no hardware",
    accent: "linux",
    cmd: 'sopsy join "Dennis Ritchie"',
    notes: [
      "Whether Dennis can join at all is Ada's call, made when she ran <code>init</code>.",
      "Under the default hardware-only policy he is refused until he has a YubiKey, or Ada widens the policy.",
    ],
  },
];

export interface PolicyRow {
  policy: string;
  cmd: string;
  result: string;
  /** Visual tone of the result cell. */
  tone: "refused" | "ok" | "warn";
}

// What happens to Dennis under each policy Ada could have chosen.
export const dennisPolicy: PolicyRow[] = [
  {
    policy: "-A onchip,exthardware",
    cmd: 'sopsy join "Dennis Ritchie"',
    result:
      "Refused: no allowed store works on his machine. He needs a YubiKey, or Ada widens the policy.",
    tone: "refused",
  },
  {
    policy: "-A onchip,exthardware,keychain",
    cmd: 'sopsy join "Dennis Ritchie" -s keychain',
    result:
      "His key lives in the Secret Service keyring (GNOME Keyring, KWallet), encrypted at rest. No plaintext key on disk.",
    tone: "ok",
  },
  {
    policy: "-A any",
    cmd: 'sopsy join "Dennis Ritchie" -s file',
    result:
      "His key is a plaintext file in keys.txt. Anyone who can read his home directory can decrypt every secret.",
    tone: "warn",
  },
];

export interface CachingTip {
  h: string;
  /** HTML body copy. */
  p: string;
  cmd: string;
}

// Worktree / direnv advice: fewer Touch ID and PIN prompts.
export const cachingTips: CachingTip[] = [
  {
    h: "Drop the Touch ID gate",
    p: "Swap in an Enclave key without Touch ID. It still never leaves the chip, but any program running as you can decrypt silently.",
    cmd: "sopsy recipient rotate -s enclave -t",
  },
  {
    h: "PIN once, no touch",
    p: "A YubiKey key that asks for the PIN once per session and never for a touch. Policies are fixed in the key, so rotate to change them.",
    cmd: "sopsy recipient rotate -s yubikey -c cached -b never",
  },
  {
    h: "Skip .env entirely",
    p: "Decrypt into one command's environment. Nothing on disk, one prompt per launch instead of one per shell.",
    cmd: "sopsy run -- bin/rails server",
  },
];
