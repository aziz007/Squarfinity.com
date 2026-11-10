export type LeadType = 'consultation' | 'audit' | 'quote' | 'guide' | 'contact' | 'ad-landing';

export interface LeadField {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'url' | 'tel' | 'textarea';
  required?: boolean;
  options?: string[];
}

export interface LeadConfig {
  type: LeadType;
  eyebrow: string;
  title: string;
  intro: string;
  bullets?: string[];
  landing?: boolean;
  submitLabel: string;
  steps: LeadField[][];
}

export const LEAD_CONFIG: Record<LeadType, LeadConfig> = {
  consultation: {
    type: 'consultation',
    eyebrow: 'AI workflow assessment',
    title: 'Book a 30-minute AI workflow assessment',
    intro: 'We will map your most repetitive processes, show where AI and automation fit, and outline what it would take. No obligation.',
    bullets: ['A review of the processes most worth automating', 'An honest view of what AI should and should not do for you', 'A rough scope, budget range and timeline'],
    submitLabel: 'Continue to Booking →',
    steps: [
      [
        { name: 'name', label: 'Full name', required: true },
        { name: 'email', label: 'Work email', type: 'email', required: true },
        { name: 'company', label: 'Company', required: true },
        { name: 'role', label: 'Your role' },
        { name: 'website', label: 'Website', type: 'url' }
      ],
      [
        { name: 'process', label: 'Which process takes the most manual work?', type: 'textarea', required: true },
        { name: 'tools', label: 'Tools you use today (CRM, helpdesk, accounting, etc.)', type: 'textarea' },
        { name: 'team_size', label: 'Team size', options: ['1–10', '11–50', '51–200', '200+'] },
        { name: 'service', label: 'What do you want to achieve?', options: ['Automate workflows', 'Build an AI agent or assistant', 'Connect CRM and revenue tools', 'Document or knowledge search', 'Custom software', 'Cloud and DevOps', 'Not sure yet'] },
        { name: 'timeline', label: 'Timeline', options: ['ASAP (under 1 month)', '1–3 months', '3–6 months', 'Just exploring'] }
      ]
    ]
  },
  audit: {
    type: 'audit',
    eyebrow: 'Free website audit',
    title: 'Is your website costing you customers?',
    intro: 'Slow pages, weak messaging, broken SEO and confusing forms quietly lose sales. Get a free report showing what to fix first.',
    bullets: ['Speed and mobile performance', 'SEO basics and technical issues', 'Conversion points and drop-offs'],
    submitLabel: 'Send Me My Free Audit →',
    steps: [[
      { name: 'url', label: 'Your website URL', type: 'url', required: true },
      { name: 'email', label: 'Work email', type: 'email', required: true },
      { name: 'goal', label: 'Main goal', options: ['More leads', 'More sales', 'More traffic', 'Better design'] }
    ]]
  },
  quote: {
    type: 'quote',
    eyebrow: 'Project quote',
    title: 'Get a project quote in 60 seconds',
    intro: 'Answer a few quick questions and we will send a tailored proposal.',
    submitLabel: 'Get My Quote →',
    steps: [
      [{ name: 'need', label: 'What do you need?', required: true, options: ['AI workflow automation', 'AI agent or assistant', 'CRM and revenue operations', 'Document or knowledge search', 'Custom web or mobile software', 'Cloud and DevOps'] }],
      [{ name: 'budget', label: "What's your budget?", required: true, options: ['Under $5k', '$5k–$20k', '$20k–$50k', '$50k+'] }],
      [{ name: 'timeline', label: 'When do you want to start?', required: true, options: ['ASAP', 'Within 1 month', '1–3 months', 'Just exploring'] }],
      [
        { name: 'name', label: 'Name', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'company', label: 'Company' },
        { name: 'phone', label: 'Phone / WhatsApp', type: 'tel' }
      ]
    ]
  },
  guide: {
    type: 'guide',
    eyebrow: 'Free download',
    title: 'The 2026 Guide to Growing Your Business Online',
    intro: 'A practical playbook covering the website, the offer, the channels and the follow-up that turn visitors into customers.',
    bullets: ['A 90-day growth checklist', 'Conversion fixes you can make this week', 'Budget guide for ads, SEO and content'],
    submitLabel: 'Download the Guide →',
    steps: [[
      { name: 'name', label: 'First name', required: true },
      { name: 'email', label: 'Work email', type: 'email', required: true }
    ]]
  },
  contact: {
    type: 'contact',
    eyebrow: 'Contact',
    title: "Let's talk about your project",
    intro: 'Send us a message and we will reply within one business day.',
    submitLabel: 'Send Message →',
    steps: [[
      { name: 'name', label: 'Name', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'company', label: 'Company' },
      { name: 'phone', label: 'Phone / WhatsApp', type: 'tel' },
      { name: 'service', label: 'How can we help?', options: ['AI workflow automation', 'AI agent or assistant', 'CRM and revenue operations', 'Custom software', 'Cloud and DevOps', 'Not sure yet'] },
      { name: 'message', label: 'Message', type: 'textarea' }
    ]]
  },
  'ad-landing': {
    type: 'ad-landing',
    eyebrow: 'Limited spots this month',
    title: 'Get More Qualified Leads in 30 Days',
    intro: 'Book a free strategy call. We will show you how to get more customers from your website and ads.',
    landing: true,
    submitLabel: 'Claim My Free Strategy Call →',
    steps: [[
      { name: 'email', label: 'Work email', type: 'email', required: true },
      { name: 'website', label: 'Company website', type: 'url' }
    ]]
  }
};
