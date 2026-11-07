# Screencast script: sopsy 2.0 with a YubiKey

The site already has a screencast (`public/sopsy-demo.gif`), but it doesn't show a YubiKey. This one does. The real output can also replace the hand-written `sopsy init` lines in the hero terminal on the home page.

It has to be recorded by a person, because the YubiKey asks for its PIN and a touch. `bin/screencast` does the typing.

All commands are from the sopsy 2.0 README and `--help`. The names are placeholders: Grace Hopper owns the repository and Alan Turing joins it.

## The story

The session lives in `docs/screencast/yubikey.yml`.

1. **Grace (green prompt)** creates `sopsy-demo` with `origin` at `git@github.com:kigster/sopsy-demo.git`.
   - She writes a two-line `Brewfile` (`brew tap kigster/tap`, `brew "sopsy"`) and runs `brew bundle`.
   - `sopsy init -s yubikey --allow-stores onchip,exthardware` sets up a hardware-only repository.
   - She appends two fake API keys to `.env` and runs `sopsy encrypt .env -o .env.encrypted`.
   - She appends `.env` and `!.env.encrypted` to `.gitignore`.
   - `sopsy set BRAINTRUST_API_KEY …` adds a third key.
   - She commits and pushes, then types a few `#` lines explaining that others can now join.
2. **Ten seconds later the screen clears. Alan (magenta prompt)** clones the repository and runs `brew bundle`.
   - `sopsy join "Alan Turing" -s yubikey -c cached -b cached` creates his key.
   - He commits and pushes the request.
3. **Back to Grace:** `git pull`, then `sopsy approve "Alan Turing" -g && git commit -m 'Approve Alan' && git push`.

Two commands differ from the first draft:

- `sopsy join` needs a name, so Alan runs `sopsy join "Alan Turing" …`.
- `sopsy approve` matches the member's name, not the username, so Grace approves `"Alan Turing"` rather than `alan`. `-g` stages the files approve changed, so the following `git commit` has something to commit.

## Before each take

- [ ] An empty GitHub repository `kigster/sopsy-demo`. It doesn't exist yet. Grace's first push needs it empty, so recreate it between takes.
- [ ] A clean `/tmp/sopsy-demo`. `sopsy init` refuses an already set-up repository, so remove the folder by hand before each take.
- [ ] A YubiKey with two free PIV slots, one for Grace's key and one for Alan's. Know its PIN.
- [ ] `sopsy --version` prints 2.0.x.
- [ ] A terminal with a Powerline or Nerd Font, about 110 × 32, with a dark theme. The prompts use the powerline arrow (U+E0B0) and branch (U+E0A0) glyphs.
- [ ] [asciinema](https://asciinema.org) (`brew install asciinema`), plus `agg` if you want a GIF.

Both "laptops" are folders on this Mac: `/tmp/sopsy-demo/grace` and `/tmp/sopsy-demo/alan`. Alan's commands run with `USER=alan`.

## Record

```bash
bin/screencast -n docs/screencast/yubikey.yml   # rehearse: types everything, runs nothing
asciinema rec -c "bin/screencast --seed 7 docs/screencast/yubikey.yml" sopsy-yubikey.cast
```

You only answer sopsy's prompts: the PIN, the touch and its confirmations.

- `--speed 1.5` types faster; `--typo-rate 0` turns typos off.
- `--seed N` gives the same typos on every take.
- `--step` waits for Enter (not shown) before each command, so you control the pace.

## Editing the session

The YAML is a list of groups. Each group can:

- `clear:` the screen;
- `pause:` for some seconds first;
- set its own `prompt:`, `dir:` and `env:`;
- run `quiet:`, off camera.

Lines starting with `#` are typed but not run, and `cd DIR` carries over to the next commands.

## Export

```bash
agg --theme monokai sopsy-yubikey.cast sopsy-yubikey.gif   # optional GIF
```

## What happens to the recording

- The real `sopsy init` lines replace the hand-written ones in the hero terminal (`src/components/Hero.astro`).
- The GIF goes next to `public/sopsy-demo.gif` as a second, YubiKey screencast.
- Before publishing, check that no real secrets, PINs or personal paths are visible. The three API keys are made up.
