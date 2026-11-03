// Which section components make up each docs route, in page order.
// [slug].astro and /print both render from here, so they cannot drift.
import WhatsNew from "./components/WhatsNew.astro";
import Statement from "./components/Statement.astro";
import WhySopsy from "./components/WhySopsy.astro";
import Features from "./components/Features.astro";
import Flow from "./components/Flow.astro";
import Enclave from "./components/Enclave.astro";
import Onboarding from "./components/Onboarding.astro";
import Teams from "./components/Teams.astro";
import Commands from "./components/Commands.astro";
import Install from "./components/Install.astro";
import QuickStart from "./components/QuickStart.astro";
import CIGate from "./components/CIGate.astro";
import Guard from "./components/Guard.astro";
import BreakGlass from "./components/BreakGlass.astro";

type Section = (props: Record<string, never>) => unknown;

export const sections: Record<string, Section[]> = {
  start: [QuickStart],
  new: [WhatsNew],
  why: [Statement, WhySopsy],
  features: [Features, Flow, CIGate, Guard],
  teams: [Onboarding, Teams],
  security: [Enclave, BreakGlass],
  commands: [Commands],
  install: [Install],
};
