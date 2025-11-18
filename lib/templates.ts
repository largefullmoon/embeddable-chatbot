export interface FormTemplate {
  id: string
  name: string
  description: string
  cta_type: string
  fields: any[]
  context: string
}

export const formTemplates: FormTemplate[] = [
  {
    id: 'strategy-call',
    name: 'Strategy Call',
    description: 'Book a strategy session with qualified leads',
    cta_type: 'Book a Call',
    fields: [
      {
        id: '1',
        type: 'text',
        label: 'Full Name',
        placeholder: 'John Doe',
        required: true,
        order: 1,
      },
      {
        id: '2',
        type: 'email',
        label: 'Email Address',
        placeholder: 'john@example.com',
        required: true,
        order: 2,
      },
      {
        id: '3',
        type: 'text',
        label: 'Company Name',
        placeholder: 'Acme Inc.',
        required: false,
        order: 3,
      },
      {
        id: '4',
        type: 'dropdown',
        label: 'Company Size',
        required: false,
        options: ['1-10', '11-50', '51-200', '201-1000', '1000+'],
        order: 4,
      },
    ],
    context: `You are a friendly business consultant helping potential clients book a strategy call. 
Your goal is to understand their business challenges and determine if our services are a good fit.

Key points to cover:
- Current business challenges
- Goals for the next 6-12 months
- What solutions they've tried before
- Budget range

Keep the conversation natural and consultative. Ask follow-up questions based on their responses.`,
  },
  {
    id: 'webinar-registration',
    name: 'Webinar Registration',
    description: 'Register attendees for your webinar or event',
    cta_type: 'Register for Webinar',
    fields: [
      {
        id: '1',
        type: 'text',
        label: 'Full Name',
        placeholder: 'Jane Smith',
        required: true,
        order: 1,
      },
      {
        id: '2',
        type: 'email',
        label: 'Email Address',
        placeholder: 'jane@example.com',
        required: true,
        order: 2,
      },
      {
        id: '3',
        type: 'text',
        label: 'Job Title',
        placeholder: 'Marketing Manager',
        required: false,
        order: 3,
      },
      {
        id: '4',
        type: 'radio',
        label: 'What interests you most?',
        required: false,
        options: [
          'Learning new strategies',
          'Case studies',
          'Networking opportunities',
          'Q&A with experts',
        ],
        order: 4,
      },
    ],
    context: `You are registering attendees for an upcoming webinar. Be enthusiastic and helpful.

Key points:
- Confirm their interest in the topic
- Understand what they hope to learn
- Ask about their current experience level
- Mention key speakers or takeaways

Keep responses brief and engaging.`,
  },
  {
    id: 'waitlist',
    name: 'Waitlist',
    description: 'Build anticipation for your product launch',
    cta_type: 'Join Waitlist',
    fields: [
      {
        id: '1',
        type: 'text',
        label: 'Full Name',
        placeholder: 'Your name',
        required: true,
        order: 1,
      },
      {
        id: '2',
        type: 'email',
        label: 'Email Address',
        placeholder: 'your@email.com',
        required: true,
        order: 2,
      },
      {
        id: '3',
        type: 'dropdown',
        label: 'How did you hear about us?',
        required: false,
        options: [
          'Social Media',
          'Friend/Colleague',
          'Search Engine',
          'Blog/Article',
          'Other',
        ],
        order: 3,
      },
    ],
    context: `You are helping people join a waitlist for an exciting new product launch.

Key points:
- Build excitement about the product
- Understand their use case
- Ask what features they're most interested in
- Mention estimated launch timeline

Be enthusiastic and make them feel like insiders.`,
  },
  {
    id: 'lead-qualification',
    name: 'Lead Qualification',
    description: 'Qualify leads for your sales team',
    cta_type: 'Get Started',
    fields: [
      {
        id: '1',
        type: 'text',
        label: 'Full Name',
        placeholder: 'Your name',
        required: true,
        order: 1,
      },
      {
        id: '2',
        type: 'email',
        label: 'Work Email',
        placeholder: 'you@company.com',
        required: true,
        order: 2,
      },
      {
        id: '3',
        type: 'phone',
        label: 'Phone Number',
        placeholder: '+1 (555) 000-0000',
        required: false,
        order: 3,
      },
      {
        id: '4',
        type: 'text',
        label: 'Company',
        placeholder: 'Company name',
        required: true,
        order: 4,
      },
      {
        id: '5',
        type: 'dropdown',
        label: 'Budget Range',
        required: false,
        options: ['< $5k', '$5k - $20k', '$20k - $50k', '$50k+'],
        order: 5,
      },
    ],
    context: `You are qualifying leads for a B2B sales team.

Key qualification criteria:
- Budget availability
- Decision-making authority
- Timeline for implementation
- Current pain points
- Competitive solutions being considered

Be professional and consultative. Gather information while providing value.`,
  },
  {
    id: 'customer-feedback',
    name: 'Customer Feedback',
    description: 'Collect detailed feedback from customers',
    cta_type: 'Share Feedback',
    fields: [
      {
        id: '1',
        type: 'text',
        label: 'Name (Optional)',
        placeholder: 'Your name',
        required: false,
        order: 1,
      },
      {
        id: '2',
        type: 'email',
        label: 'Email (Optional)',
        placeholder: 'your@email.com',
        required: false,
        order: 2,
      },
      {
        id: '3',
        type: 'radio',
        label: 'Overall Satisfaction',
        required: true,
        options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
        order: 3,
      },
    ],
    context: `You are collecting customer feedback in a friendly, conversational way.

Key areas to explore:
- What they liked most
- Areas for improvement
- Specific pain points or issues
- Feature requests
- Likelihood to recommend

Be empathetic and thank them for their time.`,
  },
]

export function getTemplateById(id: string): FormTemplate | undefined {
  return formTemplates.find((t) => t.id === id)
}

