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
  companyEmail: 'aziz@squarfinity.com',
  phone: '+1 406 316 5766', // shown as the WhatsApp number
  whatsapp: '14063165766', // digits only, with country code
  location: '[City, Country]',
  calendarUrl: 'https://calendly.com/your-link',
  social: { linkedin: '#', instagram: '#', facebook: '#' }
};

export const SERVICES: Service[] = [
  {
    slug: 'workflow-automation', name: 'AI Workflow Automation', icon: '⚙',
    short: 'Automate repetitive, multi-step business processes with AI and reliable integrations.',
    problem: 'Teams lose hours each week copying data between tools, chasing approvals and handling the same requests by hand.',
    includes: ['Process mapping and automation opportunity review', 'AI-assisted document, email and form processing', 'Integrations between your CRM, accounting, helpdesk and data tools', 'Approval steps and exception handling', 'Monitoring dashboards and error alerts'],
    process: [['Assess', 'We map your processes and rank the steps worth automating.'], ['Design', 'We agree on the workflow, approval points and success measures.'], ['Build & test', 'We build the automation and test it on real examples.'], ['Launch & improve', 'We monitor results and tune the workflow over time.']],
    projects: [],
    faqs: [['Will automation replace my team?', 'No. Automations handle routine steps, and people approve the decisions that matter.'], ['Which tools can you connect?', 'We work with the tools your team already uses, through their APIs or approved connectors.']]
  },
  {
    slug: 'agentic-ai', name: 'Agentic AI & AI Assistants', icon: '✦',
    short: 'AI agents that carry out multi-step tasks inside your systems, with clear limits and human approval.',
    problem: 'Simple chatbots answer questions but cannot complete tasks, so your team still does the follow-up work.',
    includes: ['Task-focused AI agents for sales, support and operations', 'Tool and API actions with defined permissions', 'Human approval for sensitive steps', 'Evaluation tests before launch', 'Logging of every agent action'],
    process: [['Scope', 'We pick one task with a clear outcome and define the limits.'], ['Prototype', 'We build a working agent on real cases.'], ['Evaluate', 'We test accuracy and failure cases against agreed criteria.'], ['Deploy & monitor', 'We release in stages and track quality after launch.']],
    projects: [],
    faqs: [['What stops an agent from doing the wrong thing?', 'Each agent gets limited permissions, approval steps for sensitive actions, and tests against realistic cases before launch.'], ['How is this different from a chatbot?', 'Chatbots answer questions. Agents carry out tasks across your tools, within rules you set.']]
  },
  {
    slug: 'crm-revops', name: 'CRM & Revenue Operations', icon: '↗',
    short: 'Cleaner CRM data, automated pipelines and AI-assisted lead follow-up.',
    problem: 'Lead data is incomplete, follow-ups are missed, and pipeline reports take too long to build.',
    includes: ['CRM setup, cleanup and data validation', 'Lead routing and qualification automation', 'AI-assisted lead scoring and follow-up drafts', 'Syncs between marketing, sales and support', 'Pipeline and revenue reporting'],
    process: [['Audit', 'We review your CRM data, pipeline stages and handoffs.'], ['Clean', 'We fix duplicates and validate fields before any automation.'], ['Automate', 'We build routing, scoring and follow-up workflows.'], ['Report', 'We set up dashboards for pipeline and revenue.']],
    projects: [],
    faqs: [['Which CRMs do you work with?', 'We work with common CRMs such as HubSpot and Salesforce, and with custom systems through their APIs.'], ['Can you migrate our data?', 'Yes. We map, clean and validate data before migration, and keep a backup of the original.']]
  },
  {
    slug: 'document-intelligence', name: 'AI Knowledge & Document Intelligence', icon: '▤',
    short: 'Extract, search and act on information in your documents, contracts and internal knowledge base.',
    problem: 'Important information is buried in PDFs, emails and internal documents, and staff spend time searching for answers.',
    includes: ['Data extraction from invoices, forms and contracts', 'Internal knowledge search with source links', 'Classification and routing of incoming documents', 'Secure indexing with access controls', 'Review queues for low-confidence results'],
    process: [['Review', 'We look at your document types and the questions people ask.'], ['Index', 'We organise and secure your content for search.'], ['Build', 'We build extraction and search with source citations.'], ['Validate', 'We measure accuracy and set review rules.']],
    projects: [],
    faqs: [['Do answers show where they came from?', 'Yes. Answers link to the source document so staff can check them.'], ['Is our data used to train public AI models?', 'Your data is not used to train public models. We confirm the configuration with you for each project.']]
  },
  {
    slug: 'custom-software', name: 'Custom Software & Systems Integration', icon: '⌘',
    short: 'Web and mobile applications and integrations built around how your business runs.',
    problem: 'Off-the-shelf tools do not match your processes, and disconnected systems create manual work.',
    includes: ['Custom web and mobile applications', 'SaaS product development', 'API and systems integration', 'Connections to legacy systems', 'UI/UX design and QA testing'],
    process: [['Discover', 'We map your goals, users and systems.'], ['Design', 'We design the product and integration plan.'], ['Build', 'We build in short sprints with regular demos.'], ['Launch', 'We test, deploy and hand over with documentation.']],
    projects: [],
    faqs: [['Who owns the code?', 'You do. Source code and credentials are handed over at completion.'], ['Can you work with our in-house team?', 'Yes. We work inside your repositories and processes.']]
  },
  {
    slug: 'devops-cloud', name: 'Cloud, DevOps & CI/CD', icon: '☁',
    short: 'Reliable cloud infrastructure and automated pipelines so releases are fast and safe.',
    problem: 'Manual deployments are slow and risky, and outages are hard to diagnose.',
    includes: ['Cloud architecture on AWS, Azure or Google Cloud', 'CI/CD pipelines with automated testing', 'Infrastructure as code', 'Monitoring, logging and alerting', 'Security and access reviews'],
    process: [['Assess', 'We review your current setup and release process.'], ['Automate', 'We build pipelines for testing and deployment.'], ['Migrate', 'We move workloads with staged rollouts.'], ['Operate', 'We set up monitoring and on-call runbooks.']],
    projects: [],
    faqs: [['Can you work with our current cloud?', 'Yes. We start from your current setup and improve it step by step.']]
  },
  {
    slug: 'ai-governance', name: 'AI Quality, Security & Governance', icon: '◉',
    short: 'Testing, monitoring and controls that keep AI systems accurate, secure and accountable.',
    problem: 'AI systems can give wrong answers, expose data or take unapproved actions without anyone noticing.',
    includes: ['AI evaluation test sets and quality benchmarks', 'Approval design for sensitive actions', 'Access control and data handling reviews', 'Ongoing monitoring and quality alerts', 'Documentation for audits and client review'],
    process: [['Assess risk', 'We identify where AI could fail or expose data.'], ['Define controls', 'We agree on approval rules and access limits.'], ['Test', 'We run evaluation sets before and after launch.'], ['Monitor', 'We track quality, cost and incidents over time.']],
    projects: [],
    faqs: [['Do you help with compliance?', 'We help design the controls and documentation. Formal certification and legal advice come from your own compliance team or advisers.']]
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
  { name: 'United States', icon: '🇺🇸', note: 'AI workflow and product builds for US startups and scale-ups.' },
  { name: 'United Kingdom', icon: '🇬🇧', note: 'Automation and custom software for UK SMEs and service businesses.' },
  { name: 'Europe', icon: '🇪🇺', note: 'Multilingual-ready systems built with European data rules in mind.' },
  { name: 'Asia', icon: '🌏', note: 'Remote-first delivery across time zones for teams in Asia.' }
];

export const POSTS: Post[] = [
  { title: 'Where to Start With AI Automation: Picking Your First Workflow', tag: 'Strategy', summary: 'How to choose a process that is worth automating and easy to measure.' },
  { title: 'Chatbot or AI Agent? What Each One Can Do', tag: 'Agentic AI', summary: 'The difference between answering questions and completing tasks, in plain English.' },
  { title: 'MVP vs. Full Build: How to Choose Your First Release', tag: 'Software', summary: 'How to scope a product so you launch fast without cutting corners.' },
  { title: 'How to Test an AI System Before You Trust It', tag: 'Engineering', summary: 'Evaluation sets, approval steps and monitoring, explained for business owners.' }
];

export const TEAM = [
  { name: 'Team Member', role: 'CEO & Founder', initials: 'CE' },
  { name: 'Team Member', role: 'Lead Developer', initials: 'LD' },
  { name: 'Team Member', role: 'Head of Design', initials: 'HD' },
  { name: 'Team Member', role: 'AI Solutions Lead', initials: 'AI' },
  { name: 'Team Member', role: 'Automation Engineer', initials: 'AE' },
  { name: 'Team Member', role: 'DevOps Engineer', initials: 'DO' },
  { name: 'Team Member', role: 'Mobile Engineer', initials: 'ME' },
  { name: 'Team Member', role: 'QA & AI Evaluation', initials: 'QA' }
];

export const INDUSTRIES: [string, string, string][] = [
  ['🛒', 'E-commerce & Retail', 'Order, inventory and support workflows automated across your store and back office.'],
  ['🏠', 'Real Estate', 'Lead capture, CRM integrations and automated follow-up for enquiries.'],
  ['🏢', 'B2B Services', 'Lead qualification, CRM automation and internal knowledge search.'],
  ['👗', 'Fashion & Textiles', 'Wholesale portals, order processing and supplier document handling.'],
  ['🏥', 'Healthcare', 'Booking apps, patient portals and secure document workflows.'],
  ['🚀', 'Startups', 'MVPs, SaaS products and AI features on a lean budget.']
];
