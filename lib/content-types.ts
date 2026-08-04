// ─── Hero ─────────────────────────────────────────────────────────────────────
export interface HeroContent {
  preHeadline?: string;
  headline: string;
  subtitle: string;
  ctaLabel: string;
  badgeNumber: string;
  badgeLabel: string;
  factTitle: string;
  tags: string[];
  mainTileBg: string;
  factTileBg: string;
}

// ─── Pains ────────────────────────────────────────────────────────────────────
export interface PainItem {
  text: string;
  bg: string;
  label?: string;
}

export interface PainsContent {
  sectionLabel: string;
  title: string;
  items: PainItem[];
}

// ─── Services ─────────────────────────────────────────────────────────────────
export type PriceType = 'fixed' | 'per_unit' | 'select' | 'base_plus' | 'range';

export interface ParamOption {
  label: string;
  price: number;
}

export interface ServiceParam {
  id: string;
  label: string;
  type: 'number' | 'select';
  options?: ParamOption[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | string;
  unitLabel?: string;
}

export interface ServiceItem {
  id: string;
  tag: string;
  name: string;
  description: string;
  priceType: PriceType;
  fixedPrice?: number;
  pricePerUnit?: number;
  unitLabel?: string;
  basePrice?: number;
  pricePerExtra?: number;
  extraLabel?: string;
  priceFrom?: number;
  priceTo?: number;
  params?: ServiceParam[];
  note?: string;
}

export interface ServicesContent {
  sectionLabel: string;
  title: string;
  honestyBadge: string;
  items: ServiceItem[];
}

// ─── Clients ──────────────────────────────────────────────────────────────────
export interface ClientItem {
  name: string;
  logoPath?: string;
}

export interface ClientsContent {
  sectionLabel: string;
  clients: ClientItem[];
}

// ─── Cases ────────────────────────────────────────────────────────────────────
export interface CaseItem {
  client: string;
  logoPath?: string;
  bg: string;          // hex color, e.g. "#CC2222"
  result: string;      // e.g. "+23%"
  resultLabel?: string; // e.g. "рост выручки"
  description: string;
  tags: string[];
}

export interface CasesContent {
  sectionLabel: string;
  title: string;
  items: CaseItem[];
}

// ─── Team ─────────────────────────────────────────────────────────────────────
export interface TeamMember {
  name: string;
  role: string;
  focus: string;
  bio: string;
  bg: string;
  photoPath?: string;
}

export interface TeamContent {
  sectionLabel: string;
  title: string;
  members: TeamMember[];
}

// ─── Process ──────────────────────────────────────────────────────────────────
export interface ProcessStep {
  n: string;
  title: string;
  text: string;
}

export interface ProcessContent {
  sectionLabel: string;
  title: string;
  steps: ProcessStep[];
}

// ─── About ────────────────────────────────────────────────────────────────────
export interface AboutValue {
  title: string;
  desc: string;
}

export interface AboutContent {
  sectionLabel: string;
  title: string;
  text1: string;
  text2: string;
  ctaLabel: string;
  mainTileBg: string;
  values: AboutValue[];
}

// ─── Contacts ─────────────────────────────────────────────────────────────────
export interface ContactsContent {
  sectionLabel: string;
  title: string;
  telegramLabel: string;
  successTitle: string;
  successText: string;
}

// ─── Services V2 ──────────────────────────────────────────────────────────────

export interface PerUnitModifier {
  id: string;
  type: 'per_unit';
  label: string;
  pricePerUnit: number;
  unitLabel: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface CheckboxModifier {
  id: string;
  type: 'checkbox';
  label: string;
  addedPrice: number;
  defaultChecked: boolean;
}

export interface SelectOption {
  id: string;
  label: string;
  addedPrice: number;
}

export interface SelectModifier {
  id: string;
  type: 'select';
  label: string;
  options: SelectOption[];
  defaultOptionId: string;
}

export type ServiceModifier = PerUnitModifier | CheckboxModifier | SelectModifier;

export interface ServiceV2 {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  tags: string[];
  basePrice: number;
  modifiers: ServiceModifier[];
  deliverables: string[];   // "Что вы получите"
  timeline?: string;        // "Срок"
  revisions?: string;       // "Правки"
  excludes: string[];       // "Не входит"
}

export interface ServicesData {
  sectionLabel: string;
  title: string;
  honestyBadge: string;
  items: ServiceV2[];
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export type SectionId =
  | 'hero' | 'pains' | 'services' | 'clients'
  | 'cases' | 'team' | 'process' | 'about' | 'contacts';

export interface SectionMeta {
  id: SectionId;
  label: string;
  visible: boolean;
}

export interface LayoutContent {
  sections: SectionMeta[];
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export interface SiteContent {
  hero: HeroContent;
  pains: PainsContent;
  services: ServicesContent;
  clients: ClientsContent;
  cases: CasesContent;
  team: TeamContent;
  process: ProcessContent;
  about: AboutContent;
  contacts: ContactsContent;
  layout: LayoutContent;
}
