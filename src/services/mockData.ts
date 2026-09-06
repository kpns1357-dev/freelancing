import { Client, Project, Invoice, ActivityItem } from '../types';

export const initialClients: Client[] = [
  {
    id: 'cli-1',
    name: 'Sarah Jenkins',
    company: 'Apex Design Studio',
    email: 'sarah@apexstudio.io',
    phone: '+1 (555) 234-5678',
    currency: 'USD',
    hourlyRate: 165,
    notes: 'Graduated from WhatsApp group in Feb; prefers billing on the 1st of every month. Needs Net 15 terms.',
    status: 'Active',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUv-Cn25LuZbDnngy1P5OR954GS5LKV7qYSr8ao6rrfbcf72Ellczj6Npv-SeaMHukf2rAhVvFBmwsgTzRTyCbKk6jgkBGtAE0YFICCD5oaWsXwsyIzfrU-7dC4p4xnDsW1pBQ-144mZr7PuS0zrWisa0Gbv1mwi3HjpXm3LROXHKoWf3rx5ize5ihrdanirJToKhg9g1Pbk2thmPyziEOKJSi6jlQh9sl3J4BnbanP2zrWCazUQ',
    address: '100 Montgomery St, Suite 400, San Francisco, CA 94104',
    taxId: 'US-EIN-94-2831940',
    createdAt: '2024-02-15'
  },
  {
    id: 'cli-2',
    name: 'Marcus Vance',
    company: 'Vance Dynamics Inc.',
    email: 'marcus@vancedynamics.com',
    phone: '+1 (555) 876-5432',
    currency: 'USD',
    hourlyRate: 150,
    notes: 'CEO & Founder. Strict milestones requirement with demo presentations prior to invoice sign-off.',
    status: 'Active',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9Zexa9RJK9FfNe-C0uzoYqx1hDG4HSMLnnlfJtWggCuAV1J2k1m2W0bB4Hrz76ste2zdEnUTEVTTir3_MhWcIlDN13-UCAWtbjMAeByeIGz9hNGMA0Lny1mGcPYbfWCx2XjxS6ITPe5fwb7BGx3w9tNTQ7YoAjN--3M_2UqUf3o0S6fdzR8ujJV8VvPklXi3wB00om7U090YcjCuoD5gKdTjhxsFdIYJTPcj_95wf9s2sDwmc8g',
    address: '742 Evergreen Terrace, Austin, TX 78701',
    taxId: 'US-EIN-74-8839201',
    createdAt: '2024-03-10'
  },
  {
    id: 'cli-3',
    name: 'Elena Rostova',
    company: 'Nexus Architecture',
    email: 'elena@nexusarch.design',
    phone: '+1 (555) 392-8401',
    currency: 'USD',
    hourlyRate: 175,
    notes: 'Approved brand identity revamp. Requires HIPAA compliance documentation and staging environment tests.',
    status: 'Active',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6HOXC4OoeKFDZC6pcF6bsfxtUI1DDV_LQroB_7U54LWHbiQQoGBcrVM1RcQ1l7j_AFw4QRpxtE1mGdPBkRNySQne5RVKnzufncF_jN3wwpTQuY602l6WOhv6p9498q6CQqsqQxdff63xMKe7LwlstYt2uypgLN2saBiXIHOJvjBOyRcWRIXgnHENO-s7ev5pCXXNawFToEyV1NYI65OqQkc2liYIh53DIuBsnIIc46oBwTMSd9g',
    address: '500 Madison Ave, 12th Fl, New York, NY 10022',
    taxId: 'US-EIN-13-9821034',
    createdAt: '2024-04-01'
  },
  {
    id: 'cli-4',
    name: 'Alex Lin',
    company: 'Apex Linear Inc.',
    email: 'alex.lin@apexlinear.co',
    phone: '+1 (555) 432-1098',
    currency: 'USD',
    hourlyRate: 140,
    notes: 'Overdue invoice #INV-2024-031. Regular follow-up required via WhatsApp and email.',
    status: 'Active',
    address: '88 Tech Ridge Blvd, Seattle, WA 98101',
    createdAt: '2024-05-12'
  },
  {
    id: 'cli-5',
    name: 'Dr. Arthur Campbell',
    company: 'Vanguard Labs',
    email: 'campbell@vanguardlabs.org',
    phone: '+1 (555) 654-7890',
    currency: 'USD',
    hourlyRate: 180,
    notes: 'Biotech informatics portal. Bi-weekly sprint reviews.',
    status: 'Active',
    address: '12 Science Park, Cambridge, MA 02142',
    createdAt: '2024-06-05'
  },
  {
    id: 'cli-6',
    name: 'Priya Patel',
    company: 'Kinetic Cloud LLC',
    email: 'priya@kineticcloud.io',
    phone: '+1 (555) 789-0123',
    currency: 'USD',
    hourlyRate: 160,
    notes: 'Cloud architecture & microservices migration.',
    status: 'Active',
    address: '300 S Wacker Dr, Chicago, IL 60606',
    createdAt: '2024-06-20'
  },
  {
    id: 'cli-7',
    name: 'Lucas Morel',
    company: 'Solaris Craft',
    email: 'lucas@solariscraft.com',
    phone: '+1 (555) 321-6549',
    currency: 'USD',
    hourlyRate: 155,
    notes: 'Design systems and accessible UI components.',
    status: 'Active',
    address: '450 Colorado Ave, Boulder, CO 80302',
    createdAt: '2024-07-08'
  },
  {
    id: 'cli-8',
    name: 'Caroline Vance',
    company: 'Beacon Partners',
    email: 'caroline@beaconpartners.vc',
    phone: '+1 (555) 987-1234',
    currency: 'USD',
    hourlyRate: 190,
    notes: 'Venture fund LP reporting dashboard.',
    status: 'Active',
    address: '250 Park Ave, New York, NY 10177',
    createdAt: '2024-07-15'
  },
  {
    id: 'cli-9',
    name: 'Jordan Bell',
    company: 'Verve Logistics',
    email: 'jordan@vervelogistics.com',
    phone: '+1 (555) 234-8901',
    currency: 'USD',
    hourlyRate: 150,
    notes: 'New client onboarded recently. Retainer contract signed.',
    status: 'Onboarding',
    address: '1400 Peachtree St, Atlanta, GA 30309',
    createdAt: '2024-09-01'
  },
  {
    id: 'cli-10',
    name: 'Mia Tanaka',
    company: 'Horizon Labs',
    email: 'mia@horizonlabs.ai',
    phone: '+1 (555) 456-7892',
    currency: 'USD',
    hourlyRate: 165,
    notes: 'Completed sprint phases on time; excellent payment track record.',
    status: 'Active',
    address: '500 University Ave, Palo Alto, CA 94301',
    createdAt: '2024-08-11'
  },
  {
    id: 'cli-11',
    name: 'David Foster',
    company: 'Acme Studios',
    email: 'david@acmestudios.agency',
    phone: '+1 (555) 345-6789',
    currency: 'USD',
    hourlyRate: 145,
    notes: 'Paid recent invoice via Stripe.',
    status: 'Active',
    address: '700 Broadway, New York, NY 10003',
    createdAt: '2024-05-18'
  },
  {
    id: 'cli-12',
    name: 'Samuel Hayes',
    company: 'Zenith Co',
    email: 'samuel@zenithco.net',
    phone: '+1 (555) 890-2345',
    currency: 'USD',
    hourlyRate: 135,
    notes: 'Legacy web maintenance contract.',
    status: 'Archived',
    address: '120 Market St, Denver, CO 80202',
    createdAt: '2024-01-10'
  }
];

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Phase 2: Mobile UI/UX Design System',
    clientId: 'cli-2',
    clientName: 'Marcus Vance (Vance Dynamics)',
    status: 'In Progress',
    startDate: '2024-09-01',
    deadline: '2024-11-14',
    price: 18500,
    progress: 78,
    scope: 'Responsive mobile components, design tokens, and documentation'
  },
  {
    id: 'proj-2',
    name: 'Nova Patient Portal 2.0',
    clientId: 'cli-3',
    clientName: 'Elena Rostova (Nexus Architecture)',
    status: 'In Progress',
    startDate: '2024-08-15',
    deadline: '2024-10-28',
    price: 24000,
    progress: 82,
    scope: 'Frontend React architecture, state management & patient telemetry'
  },
  {
    id: 'proj-3',
    name: 'Brand Identity Revamp & Guidelines',
    clientId: 'cli-1',
    clientName: 'Sarah Jenkins (Apex Design Studio)',
    status: 'Completed',
    startDate: '2024-07-01',
    deadline: '2024-09-15',
    price: 12500,
    progress: 100,
    scope: 'Complete logo suite, color harmony, typography tokens & assets'
  },
  {
    id: 'proj-4',
    name: 'Webflow CMS Architecture & GSAP Animations',
    clientId: 'cli-2',
    clientName: 'Marcus Vance (Vance Dynamics)',
    status: 'In Progress',
    startDate: '2024-09-15',
    deadline: '2024-11-09',
    price: 9500,
    progress: 65,
    scope: 'Custom responsive build with 5 dynamic CMS collections'
  },
  {
    id: 'proj-5',
    name: 'HIPAA Compliance Security Audit',
    clientId: 'cli-3',
    clientName: 'Elena Rostova (Nexus Architecture)',
    status: 'Planning',
    startDate: '2024-10-20',
    deadline: '2024-12-01',
    price: 14000,
    progress: 35,
    scope: 'Security audit, data encryption at rest, access permissioning'
  },
  {
    id: 'proj-6',
    name: 'Cloud Infrastructure Migration',
    clientId: 'cli-6',
    clientName: 'Priya Patel (Kinetic Cloud LLC)',
    status: 'In Progress',
    startDate: '2024-09-10',
    deadline: '2024-10-26', // Due soon!
    price: 8400,
    progress: 50,
    scope: 'Zero-downtime AWS to GCP container cluster deployment'
  },
  {
    id: 'proj-7',
    name: 'Design Token System v2 & Dark Mode',
    clientId: 'cli-7',
    clientName: 'Lucas Morel (Solaris Craft)',
    status: 'Planning',
    startDate: '2024-10-15',
    deadline: '2024-11-30',
    price: 6200,
    progress: 20,
    scope: 'Accessible contrast audit & high-density token matrix'
  },
  {
    id: 'proj-8',
    name: 'Venture Fund LP Analytics Dashboard',
    clientId: 'cli-8',
    clientName: 'Caroline Vance (Beacon Partners)',
    status: 'Completed',
    startDate: '2024-06-01',
    deadline: '2024-08-30',
    price: 11800,
    progress: 100,
    scope: 'Capital call projections, IRR calculators, and CSV export engine'
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-48',
    invoiceNumber: '#INV-2024-048',
    clientId: 'cli-2',
    clientName: 'Marcus Vance',
    clientCompany: 'Vance Dynamics Inc.',
    clientEmail: 'marcus@vancedynamics.com',
    clientPhone: '+1 (555) 876-5432',
    clientAddress: '742 Evergreen Terrace, Austin, TX 78701, United States',
    issueDate: 'Oct 10, 2024',
    dueDate: 'Nov 09, 2024',
    paymentTerms: 'Net 30 Days',
    poReference: 'PO-98214',
    status: 'overdue',
    notes: 'Thank you for your continued partnership! Please mention reference #INV-2024-048 in all wire memos.',
    lineItems: [
      {
        id: 'li-1',
        description: 'UX Research & Competitive Audit (Benchmark audit of 6 top SaaS competitors, user persona synthesis)',
        quantity: 20,
        rate: 150,
        amount: 3000
      },
      {
        id: 'li-2',
        description: 'High-Fidelity Component Library in Figma (45 responsive desktop & mobile components, token integration)',
        quantity: 35,
        rate: 150,
        amount: 5250
      },
      {
        id: 'li-3',
        description: 'Webflow CMS Development & Custom Animations (Full custom responsive build, 5 collections)',
        quantity: 1,
        rate: 4250,
        amount: 4250
      }
    ],
    subtotal: 12500,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 1250, // 10% Retainer discount
    totalAmount: 11250,
    paidAmount: 7050, // Remaining balance = $4,200.00
    createdAt: '2024-10-10'
  },
  {
    id: 'inv-49',
    invoiceNumber: '#INV-2024-049',
    clientId: 'cli-3',
    clientName: 'Elena Rostova',
    clientCompany: 'Nexus Architecture',
    clientEmail: 'elena@nexusarch.design',
    clientPhone: '+1 (555) 392-8401',
    clientAddress: '500 Madison Ave, New York, NY 10022',
    issueDate: 'Nov 01, 2024',
    dueDate: 'Nov 16, 2024',
    paymentTerms: 'Net 15 Days',
    status: 'pending',
    notes: 'Phase 1 Sprint Delivery for Nova Patient Portal architecture.',
    lineItems: [
      {
        id: 'li-4',
        description: 'Sprint 1 & 2 Frontend Architecture delivery',
        quantity: 1,
        rate: 6200,
        amount: 6200
      }
    ],
    subtotal: 6200,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 6200,
    paidAmount: 0,
    createdAt: '2024-11-01'
  },
  {
    id: 'inv-31',
    invoiceNumber: '#INV-2024-031',
    clientId: 'cli-4',
    clientName: 'Alex Lin',
    clientCompany: 'Apex Linear Inc.',
    clientEmail: 'alex.lin@apexlinear.co',
    clientPhone: '+1 (555) 432-1098',
    issueDate: 'Sep 14, 2024',
    dueDate: 'Oct 14, 2024',
    paymentTerms: 'Net 30 Days',
    status: 'overdue',
    lineItems: [
      {
        id: 'li-5',
        description: 'Q3 Enterprise Architecture & Optimization',
        quantity: 1,
        rate: 3400,
        amount: 3400
      }
    ],
    subtotal: 3400,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 3400,
    paidAmount: 0,
    createdAt: '2024-09-14'
  },
  {
    id: 'inv-35',
    invoiceNumber: '#INV-2024-035',
    clientId: 'cli-5',
    clientName: 'Dr. Arthur Campbell',
    clientCompany: 'Vanguard Labs',
    clientEmail: 'campbell@vanguardlabs.org',
    clientPhone: '+1 (555) 654-7890',
    issueDate: 'Sep 20, 2024',
    dueDate: 'Oct 20, 2024',
    paymentTerms: 'Net 30 Days',
    status: 'overdue',
    lineItems: [
      {
        id: 'li-6',
        description: 'Biotech Discovery Portal Mockups & UX',
        quantity: 1,
        rate: 2800,
        amount: 2800
      }
    ],
    subtotal: 2800,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 2800,
    paidAmount: 0,
    createdAt: '2024-09-20'
  },
  {
    id: 'inv-41',
    invoiceNumber: '#INV-2024-041',
    clientId: 'cli-6',
    clientName: 'Priya Patel',
    clientCompany: 'Kinetic Cloud LLC',
    clientEmail: 'priya@kineticcloud.io',
    clientPhone: '+1 (555) 789-0123',
    issueDate: 'Oct 10, 2024',
    dueDate: 'Oct 25, 2024',
    paymentTerms: 'Net 15 Days',
    status: 'pending',
    lineItems: [
      {
        id: 'li-7',
        description: 'Microservices & Container Orchestration Consulting',
        quantity: 35,
        rate: 150,
        amount: 5250
      }
    ],
    subtotal: 5250,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 5250,
    paidAmount: 0,
    createdAt: '2024-10-10'
  },
  {
    id: 'inv-44',
    invoiceNumber: '#INV-2024-044',
    clientId: 'cli-7',
    clientName: 'Lucas Morel',
    clientCompany: 'Solaris Craft',
    clientEmail: 'lucas@solariscraft.com',
    clientPhone: '+1 (555) 321-6549',
    issueDate: 'Oct 14, 2024',
    dueDate: 'Oct 28, 2024',
    paymentTerms: 'Net 14 Days',
    status: 'pending',
    lineItems: [
      {
        id: 'li-8',
        description: 'Design Systems Accessibility & Contrast Pass',
        quantity: 13,
        rate: 150,
        amount: 1950
      }
    ],
    subtotal: 1950,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 1950,
    paidAmount: 0,
    createdAt: '2024-10-14'
  },
  {
    id: 'inv-47',
    invoiceNumber: '#INV-2024-047',
    clientId: 'cli-8',
    clientName: 'Caroline Vance',
    clientCompany: 'Beacon Partners',
    clientEmail: 'caroline@beaconpartners.vc',
    clientPhone: '+1 (555) 987-1234',
    issueDate: 'Oct 18, 2024',
    dueDate: 'Nov 02, 2024',
    paymentTerms: 'Net 15 Days',
    status: 'pending',
    lineItems: [
      {
        id: 'li-9',
        description: 'Venture Capital Investor Portal Phase 2 Final Retainer',
        quantity: 1,
        rate: 5050,
        amount: 5050
      }
    ],
    subtotal: 5050,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 5050,
    paidAmount: 0,
    createdAt: '2024-10-18'
  },
  {
    id: 'inv-42',
    invoiceNumber: '#INV-2024-042',
    clientId: 'cli-11',
    clientName: 'David Foster',
    clientCompany: 'Acme Studios',
    clientEmail: 'david@acmestudios.agency',
    clientPhone: '+1 (555) 345-6789',
    issueDate: 'Oct 04, 2024',
    dueDate: 'Oct 18, 2024',
    paymentTerms: 'Net 14 Days',
    status: 'paid',
    lineItems: [
      {
        id: 'li-10',
        description: 'Creative Direction & Animation Sprint',
        quantity: 30,
        rate: 150,
        amount: 4500
      }
    ],
    subtotal: 4500,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 4500,
    paidAmount: 4500,
    createdAt: '2024-10-04'
  },
  {
    id: 'inv-28',
    invoiceNumber: '#INV-2024-028',
    clientId: 'cli-1',
    clientName: 'Sarah Jenkins',
    clientCompany: 'Apex Design Studio',
    clientEmail: 'sarah@apexstudio.io',
    clientPhone: '+1 (555) 234-5678',
    issueDate: 'Aug 15, 2024',
    dueDate: 'Sep 01, 2024',
    paymentTerms: 'Net 15 Days',
    status: 'paid',
    lineItems: [
      {
        id: 'li-11',
        description: 'Sprint 3 Delivery: Design Tokens & Component Guide',
        quantity: 1,
        rate: 12000,
        amount: 12000
      }
    ],
    subtotal: 12000,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 12000,
    paidAmount: 12000,
    createdAt: '2024-08-15'
  },
  {
    id: 'inv-15',
    invoiceNumber: '#INV-2024-015',
    clientId: 'cli-1',
    clientName: 'Sarah Jenkins',
    clientCompany: 'Apex Design Studio',
    clientEmail: 'sarah@apexstudio.io',
    clientPhone: '+1 (555) 234-5678',
    issueDate: 'Jul 15, 2024',
    dueDate: 'Aug 01, 2024',
    paymentTerms: 'Net 15 Days',
    status: 'paid',
    lineItems: [
      {
        id: 'li-12',
        description: 'Kickoff Deposit & Brand Identity Discovery',
        quantity: 1,
        rate: 12500,
        amount: 12500
      }
    ],
    subtotal: 12500,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 12500,
    paidAmount: 12500,
    createdAt: '2024-07-15'
  },
  {
    id: 'inv-39',
    invoiceNumber: '#INV-2024-039',
    clientId: 'cli-10',
    clientName: 'Mia Tanaka',
    clientCompany: 'Horizon Labs',
    clientEmail: 'mia@horizonlabs.ai',
    clientPhone: '+1 (555) 456-7892',
    issueDate: 'Sep 10, 2024',
    dueDate: 'Sep 25, 2024',
    paymentTerms: 'Net 15 Days',
    status: 'paid',
    lineItems: [
      {
        id: 'li-13',
        description: 'Technical Evaluation & Prototyping',
        quantity: 1,
        rate: 2800,
        amount: 2800
      }
    ],
    subtotal: 2800,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 2800,
    paidAmount: 2800,
    createdAt: '2024-09-10'
  },
  {
    id: 'inv-50',
    invoiceNumber: '#INV-2024-050',
    clientId: 'cli-9',
    clientName: 'Jordan Bell',
    clientCompany: 'Verve Logistics',
    clientEmail: 'jordan@vervelogistics.com',
    clientPhone: '+1 (555) 234-8901',
    issueDate: 'Nov 05, 2024',
    dueDate: 'Nov 30, 2024',
    paymentTerms: 'Net 25 Days',
    status: 'draft',
    lineItems: [
      {
        id: 'li-14',
        description: 'Logistics Telematics Dashboard Onboarding Retainer',
        quantity: 32,
        rate: 150,
        amount: 4800
      }
    ],
    subtotal: 4800,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 4800,
    paidAmount: 0,
    createdAt: '2024-11-05'
  }
];

export const initialActivities: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'payment',
    title: 'Acme Studios paid Invoice #INV-2024-042',
    description: '$4,500.00 settled via Stripe gateway.',
    timestamp: '2024-10-24T14:15:00Z',
    timeAgo: '12m ago',
    highlightText: 'Acme Studios',
    statusTag: 'Payment settled'
  },
  {
    id: 'act-2',
    type: 'comment',
    title: 'Nexus Architecture milestone update',
    description: 'Elena commented: "Approved palette revisions for patient portal!"',
    timestamp: '2024-10-24T13:30:00Z',
    timeAgo: '1h ago',
    highlightText: 'Nexus Architecture'
  },
  {
    id: 'act-3',
    type: 'client',
    title: 'New client onboarded: Verve Logistics',
    description: 'Contract signed & onboarding initialized with $4,000/mo retainer.',
    timestamp: '2024-10-24T11:00:00Z',
    timeAgo: '3h ago',
    highlightText: 'Verve Logistics',
    statusTag: 'Retainer: $4,000/mo'
  },
  {
    id: 'act-4',
    type: 'invoice',
    title: 'Invoice #INV-2024-039 sent to Horizon Labs',
    description: 'Invoice for $2,800.00 issued with 14-day payment link.',
    timestamp: '2024-10-24T09:00:00Z',
    timeAgo: '5h ago',
    highlightText: 'Horizon Labs',
    statusTag: 'Due in 14 days'
  },
  {
    id: 'act-5',
    type: 'reminder',
    title: 'WhatsApp reminder sent to Zenith Co',
    description: 'Automated overdue ledger notice delivered to finance desk.',
    timestamp: '2024-10-23T16:00:00Z',
    timeAgo: '1d ago',
    highlightText: 'Zenith Co'
  }
];
