// "What's new in 2.0" cards. Every command here exists, with exactly these
// flags, in the sopsy README; tests/data.test.ts checks them against an
// allow-list taken from that README.
export interface WhatsNewItem {
  icon: string;
  tag: string;
  title: string;
  /** HTML body copy. */
  body: string;
  /** Example commands, shown as copyable lines. */
  cmds: string[];
}

export const whatsNew: WhatsNewItem[] = [
  {
    icon: "🗝️",
    tag: "key stores",
    title: "Four key stores, and a policy for the repo",
    body: "Your key lives in the Secure Enclave (on-chip), a YubiKey (external hardware), the OS keychain or a plaintext file. <code>init</code> records which stores members may use, hardware only by default, and <code>--store auto</code> picks the strongest one your machine has. Hardware always comes before software, whatever order the list is in.",
    cmds: ["sopsy init --allow-stores yubikey,enclave"],
  },
  {
    icon: "🔑",
    tag: "yubikey",
    title: "YubiKey, without the friction",
    body: "sopsy asks you to plug the YubiKey in instead of failing, reminds you to touch it after the PIN, and caches the PIN for the session with <code>-c cached</code>. Making a key without your YubiKey on you? Press <code>e</code> to use the Secure Enclave instead. Several keys fit on one YubiKey; pick one with <code>--yubikey-slot</code>.",
    cmds: ['sopsy join "Alan Turing" -s yubikey -c cached -b cached'],
  },
  {
    icon: "🚀",
    tag: "run",
    title: "Secrets in a process, not on disk",
    body: "<code>sopsy run</code> decrypts into the environment of one command and writes nothing to disk. One Touch ID per launch, not one per shell or per worktree. Exit codes and signals are the command's own.",
    cmds: ["sopsy run -- bin/rails server"],
  },
  {
    icon: "✍️",
    tag: "set / unset",
    title: "Change one value, no editor",
    body: "<code>sopsy set KEY</code> asks for the value with hidden input, or reads it from stdin, so it never lands in your shell history or a process listing. <code>sopsy unset</code> removes a key. <code>set</code> needs sops 3.11 or newer.",
    cmds: ["sopsy set API_KEY", "op read op://dev/api/key | sopsy set API_KEY"],
  },
  {
    icon: "🔄",
    tag: "rotate",
    title: "Swap your key, keep your name",
    body: "<code>sopsy recipient rotate</code> replaces your key under the same name and approval: move to another store or YubiKey slot, or change a PIN or touch policy. It changes who can unwrap the data key, not the data key itself. After a lost or stolen key, add <code>--new-data-key</code>, then change the secret values.",
    cmds: [
      "sopsy recipient rotate -s enclave -t",
      "sopsy recipient rotate --new-data-key",
    ],
  },
  {
    icon: "♻️",
    tag: "rotate-data-key",
    title: "A fresh data key for every file",
    body: "Removing a recipient re-wraps the data key but keeps it, so anyone who decrypted before still could. <code>sopsy rotate-data-key</code> re-encrypts every managed file under a brand-new data key for the current recipients. Run it after offboarding, then commit.",
    cmds: ["sopsy rotate-data-key"],
  },
  {
    icon: "🧰",
    tag: "deps",
    title: "Tooling installed for you",
    body: "<code>sopsy deps</code> installs whatever is missing: <code>sops</code>, <code>age</code>, <code>age-plugin-se</code>, <code>age-plugin-yubikey</code> and <code>ykman</code>. <code>init</code> runs it first (<code>--skip-deps</code> turns it off), and an interactive <code>init</code> sets up the break-glass key by default.",
    cmds: ["sopsy deps", "sopsy init --skip-deps"],
  },
  {
    icon: "🔌",
    tag: "yubikey · enclave",
    title: "The UX for every tool it wraps",
    body: "<code>sopsy yubikey</code> and <code>sopsy enclave</code> pass your arguments straight to <code>age-plugin-yubikey</code> and <code>age-plugin-se</code>, so you never need to remember the plugin's name.",
    cmds: ["sopsy yubikey --list", "sopsy enclave --help"],
  },
];
