export interface Service {
  slug: string;
  name: string;
  icon: string;
  short: string;
  problem: string;
  includes: string[];
  process: [string, string][];
  projects: string[];
  faqs: [string, string][];
}

export interface Project {
  id: string;
  title: string;
  client: string;
  cats: string[];
  icon: string;
  problem: string;
  solution: string;
  tools: string[];
  results: [string, string][];
  quote: string;
  who: string;
}

export interface Post {
  title: string;
  tag: string;
  summary: string;
}

/* Edit these for your business */
export const CONFIG = {
  companyEmail: 'hello@example.com',
  phone: '+1 000 000 0000',
  whatsapp: '10000000000', // digits only, with country code
  location: '[City, Country]',
  calendarUrl: 'https://calendly.com/your-link',
  social: { linkedin: '#', instagram: '#', facebook: '#' }
};

export const SERVICES: Service[] = [
  {
    slug: 'software',
    name: 'Software Development',
    icon: '⌘',
    short: 'Custom web apps, mobile apps, SaaS and integrations built to scale.',
    problem: 'Off-the-shelf tools do not fit how your business works, and manual steps slow you down.',
    includes: ['Custom web applications', 'iOS & Android mobile apps', 'SaaS product development (MVP to scale)', 'API integrations with your tools', 'UI/UX design', 'QA, deployment and support'],
    process: [['Discover', 'We map your goals, users and must-have features.'], ['Design', 'Wireframes and clickable prototypes you can test.'], ['Build', 'Two-week sprints with demos so you see progress.'], ['Launch', 'Testing, deployment and handover, plus support after.']],
    projects: [],
    faqs: [['How long does a typical project take?', 'An MVP usually takes 6–12 weeks. Larger platforms are scoped in phases so you can launch early.'], ['Who owns the code?', 'You do. Source code and credentials are handed over when the project completes.'], ['Can you work with our in-house team?', 'Yes. We plug into your existing repos, tools and processes.']]
  },
  {
    slug: 'marketing',
    name: 'Digital Marketing',
    icon: '↗',
    short: 'SEO, paid ads, social, content and email that bring qualified leads.',
    problem: 'Your site gets traffic that does not convert, or your ads spend without a clear return.',
    includes: ['Technical and local SEO', 'Meta, Google and TikTok ads', 'Social media management', 'Short-form video and content', 'Branding and visual identity', 'Email marketing and automations', 'Conversion rate optimization'],
    process: [['Audit', 'We find what is working and what is leaking money.'], ['Strategy', 'A channel plan with clear targets and budget.'], ['Execute', 'Campaigns, content and creative launched fast.'], ['Optimize', 'Weekly reporting and continuous testing.']],
    projects: [],
    faqs: [['How soon will I see results?', 'Paid ads can show results in weeks. SEO usually takes 3–6 months to compound.'], ['Do I need a long contract?', 'No. We offer monthly plans with a 30-day notice period.'], ['Will I have access to my ad accounts?', 'Always. You own every account, pixel and audience we build.']]
  },
  {
    slug: 'ecommerce',
    name: 'E-commerce Development',
    icon: '🛒',
    short: 'Shopify and WooCommerce stores that load fast and sell more.',
    problem: 'Slow checkout, a clunky store and weak product pages are costing you sales.',
    includes: ['Shopify store build and theme customization', 'WooCommerce development', 'Custom checkout and payment setup', 'Catalog import and management', 'Shipping, ERP and CRM integrations', 'Speed and mobile optimization'],
    process: [['Plan', 'Store structure, products and goals.'], ['Design', 'A brand-true storefront built for conversion.'], ['Build', 'Integrations, payments and content loaded.'], ['Launch', 'Speed checks, testing and a go-live plan.']],
    projects: [],
    faqs: [['Shopify or WooCommerce?', 'Shopify is faster to launch and easier to run. WooCommerce suits teams that need full control of WordPress.'], ['Can you migrate our existing store?', 'Yes, including products, customers, SEO URLs and order history.']]
  },
  {
    slug: 'ai',
    name: 'AI Automation & Chatbots',
    icon: '✦',
    short: 'Automate repetitive work and answer customers around the clock.',
    problem: 'Your team spends hours on repetitive tasks and customers wait too long for answers.',
    includes: ['AI chatbots for websites and WhatsApp', 'Lead qualification bots', 'Workflow automation between your tools', 'Document and data processing', 'Custom AI assistants trained on your content'],
    process: [['Find', 'We identify the highest-value tasks to automate.'], ['Prototype', 'A working demo on real examples.'], ['Integrate', 'Connected to your tools and data securely.'], ['Improve', 'Monitoring and tuning over time.']],
    projects: [],
    faqs: [['Is my data safe?', 'We use encrypted connections and only access the data a task needs.'], ['Will the bot sound robotic?', 'We write the tone, guardrails and handoff rules together so it sounds like your brand.']]
  }
];

/*
 * CASE STUDIES: add your own projects here. Each entry appears on the
 * portfolio page and on the home page (first two). Leave empty to hide them.
 */
export const PROJECTS: Project[] = [];

/* TESTIMONIALS: real client quotes. The home section is hidden while this is empty. */
export interface Testimonial { quote: string; who: string; }
export const TESTIMONIALS: Testimonial[] = [];

/* CLIENTS: client or partner names shown as a "trusted by" strip. Hidden while empty. */
export const CLIENTS: string[] = [];

/* STATS: headline numbers, e.g. ['40+', 'Projects delivered']. Hidden while empty. */
export const STATS: [string, string][] = [];

/* REGIONS: markets you serve */
export interface Region { name: string; icon: string; note: string; }
export const REGIONS: Region[] = [
  { name: 'United States', icon: '🇺🇸', note: 'Product builds and growth campaigns for US startups and scale-ups.' },
  { name: 'United Kingdom', icon: '🇬🇧', note: 'Software and marketing for UK SMEs, e-commerce brands and agencies.' },
  { name: 'Europe', icon: '🇪🇺', note: 'Multilingual-ready apps and campaigns for European markets.' },
  { name: 'Asia', icon: '🌏', note: 'Remote-first delivery across time zones for teams in Asia.' }
];

export const POSTS: Post[] = [
  { title: 'The 2026 Guide to Growing Your Business Online', tag: 'Strategy', summary: 'A practical playbook on SEO, paid ads and conversion.' },
  { title: "Why Your Website Traffic Isn't Turning Into Leads", tag: 'Marketing', summary: 'The five most common conversion problems and quick fixes.' },
  { title: 'MVP vs. Full Build: How to Choose Your First Release', tag: 'Software', summary: 'How to scope a product so you launch fast without cutting corners.' },
  { title: 'Shopify or WooCommerce? A Plain-English Comparison', tag: 'E-commerce', summary: 'Cost, control, speed and scale, compared for real businesses.' }
];

export const TEAM = [
  { name: 'Team Member', role: 'CEO & Founder', initials: 'CE' },
  { name: 'Team Member', role: 'Lead Developer', initials: 'LD' },
  { name: 'Team Member', role: 'Head of Design', initials: 'HD' },
  { name: 'Team Member', role: 'Growth Lead', initials: 'GL' },
  { name: 'Team Member', role: 'Paid Ads Specialist', initials: 'PA' },
  { name: 'Team Member', role: 'SEO Specialist', initials: 'SE' },
  { name: 'Team Member', role: 'Mobile Engineer', initials: 'ME' },
  { name: 'Team Member', role: 'Content & Video', initials: 'CV' }
];

export const INDUSTRIES: [string, string, string][] = [
  ['🛒', 'E-commerce & Retail', 'Stores that load fast and convert, with smart product pages and integrations.'],
  ['👗', 'Fashion & Textiles', 'Brand-led storefronts, wholesale portals and visual campaigns.'],
  ['🏠', 'Real Estate', 'Listing sites, lead capture, CRM integrations and local SEO.'],
  ['🏥', 'Healthcare', 'Booking apps, patient portals and secure communication tools.'],
  ['🚀', 'Startups', 'MVPs, SaaS products and launch marketing on a lean budget.'],
  ['🏢', 'B2B Services', 'Lead qualification bots, outbound campaigns and trust-building content.']
];
