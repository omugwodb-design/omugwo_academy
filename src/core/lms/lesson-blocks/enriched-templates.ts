/**
 * Enriched Demo Templates
 * 
 * Fully populated templates with real demonstration content including
 * actual text, images, videos, and interactive elements to showcase
 * the full capabilities of the interactive learning system.
 */

import {
  LessonTemplate,
  createScene,
  createPlaceholder,
  DEFAULT_TEMPLATE_SETTINGS,
} from './template-types';
import { SceneSection } from './scene-types';

// ============================================
// HELPER FUNCTIONS
// ============================================

function createBlock(
  id: string,
  type: string,
  props: Record<string, any>
): { id: string; type: string; props: Record<string, any> } {
  return { id, type, props };
}

function createSection(
  id: string,
  title?: string,
  blocks: any[] = []
): SceneSection {
  return { id, title, blocks };
}

// ============================================
// ENRICHED TEMPLATE 1: CUSTOMER SERVICE EXCELLENCE
// A complete narrative learning experience about handling difficult customers
// ============================================

export const customerServiceExcellence: LessonTemplate = {
  metadata: {
    id: 'customer-service-excellence',
    name: 'Customer Service Excellence',
    description: 'Learn to handle difficult customer situations with empathy and professionalism',
    longDescription: 'Follow Sarah, a customer service representative, as she navigates challenging customer interactions. Learn proven techniques for de-escalation, active listening, and turning negative experiences into positive outcomes.',
    category: 'narrative',
    difficulty: 'beginner',
    tags: ['customer service', 'communication', 'soft skills', 'de-escalation', 'professional development'],
    components: ['text', 'image', 'video', 'accordion', 'reflection', 'quiz'],
    estimatedTime: 15,
    sceneCount: 6,
    hasBranching: false,
    hasAssessment: true,
    hasGamification: false,
    isInteractive: true,
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4da7958?w=400&h=300&fit=crop',
    featured: true,
    new: true,
    ratings: { average: 4.8, count: 234 },
    usageCount: 1543,
  },
  content: {
    title: 'Customer Service Excellence: Turning Challenges into Opportunities',
    description: 'Master the art of handling difficult customer interactions',
    theme: 'storytelling',
    settings: DEFAULT_TEMPLATE_SETTINGS,
    scenes: [
      // Scene 1: Welcome & Introduction
      createScene('intro', 'Welcome', {
        type: 'welcome',
        description: 'Introduction to the learning journey',
        background: { 
          type: 'gradient', 
          gradient: { type: 'linear', angle: 135, colors: ['#1e3a5f', '#2d5a87'] } 
        },
        sections: [
          createSection('intro-content', 'Your Learning Journey', [
            createBlock('intro-title', 'heading', { 
              level: 1, 
              text: 'Customer Service Excellence' 
            }),
            createBlock('intro-subtitle', 'text', { 
              text: 'Turning Challenges into Opportunities',
              style: 'subtitle'
            }),
            createBlock('intro-image', 'image', {
              src: 'https://images.unsplash.com/photo-1556742049-0cfed4da7958?w=800&h=450&fit=crop',
              alt: 'Customer service representative helping a client',
              caption: 'Great customer service starts with empathy'
            }),
            createBlock('intro-text', 'text', {
              text: `Every customer interaction is an opportunity to create a lasting positive impression. In this lesson, you'll follow Sarah, a seasoned customer service professional, as she handles one of her most challenging days on the job.

You'll learn:
• How to remain calm under pressure
• Active listening techniques that build trust
• De-escalation strategies that work
• How to turn angry customers into loyal advocates`
            }),
            createBlock('intro-stats', 'stat-card', {
              value: '73%',
              label: 'of customers fall in love with a brand because of friendly customer service',
              icon: 'heart'
            }),
          ]),
        ],
      }),

      // Scene 2: The Story Begins
      createScene('story-setup', 'A Challenging Morning', {
        type: 'concept',
        description: 'Sarah encounters her first difficult customer',
        background: { 
          type: 'image',
          image: { 
            src: 'https://images.unsplash.com/photo-1556761175-b413da4b0bcd?w=1200&h=800&fit=crop',
            opacity: 0.3
          }
        },
        sections: [
          createSection('story-content', 'The Situation', [
            createBlock('story-title', 'heading', { 
              level: 2, 
              text: '8:47 AM - The Phone Rings' 
            }),
            createBlock('story-quote', 'quote', {
              text: '"I\'ve been waiting THREE WEEKS for my order, and nobody seems to care! This is absolutely unacceptable!"',
              author: 'Angry Customer',
              style: 'dramatic'
            }),
            createBlock('story-narrative', 'text', {
              text: "Sarah takes a deep breath. On the other end of the line is Michael, a customer who ordered a custom anniversary gift for his wife. The delivery date has passed, and he's frantic—the anniversary is tomorrow.\n\nThis is the moment where many representatives would become defensive or flustered. But Sarah knows better. She's about to demonstrate the first key principle of exceptional customer service."
            }),
            createBlock('story-video', 'video', {
              src: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
              poster: 'https://images.unsplash.com/photo-1556761175-b413da4b0bcd?w=800&h=450&fit=crop',
              title: 'Watch: Sarah\'s Initial Response',
              duration: '2:15',
              transcript: 'Video shows Sarah taking a calm breath, adjusting her headset, and beginning her response with empathy.'
            }),
          ]),
        ],
      }),

      // Scene 3: Key Techniques
      createScene('techniques', 'The HEART Method', {
        type: 'exploration',
        description: 'Learn the proven de-escalation framework',
        background: { 
          type: 'gradient', 
          gradient: { type: 'linear', angle: 180, colors: ['#2d5a87', '#3d7ab7'] } 
        },
        sections: [
          createSection('tech-content', 'Interactive Framework', [
            createBlock('tech-title', 'heading', { 
              level: 2, 
              text: 'The HEART Method' 
            }),
            createBlock('tech-intro', 'text', {
              text: 'Sarah uses the HEART method—a proven framework for handling difficult customer interactions. Click each letter to learn more about each step.'
            }),
            createBlock('tech-accordion', 'accordion', {
              items: [
                { 
                  title: 'H - Hear Them Out', 
                  content: 'Let the customer fully express their frustration without interrupting. Active listening means giving them space to vent while you take notes on key details. Sarah waited 45 seconds before speaking, letting Michael express his full frustration.',
                  icon: 'ear'
                },
                { 
                  title: 'E - Empathize', 
                  content: 'Acknowledge their feelings genuinely. "I completely understand how stressful this must be, especially with your anniversary tomorrow. I would feel exactly the same way in your position." This validates their emotions and builds instant rapport.',
                  icon: 'heart'
                },
                { 
                  title: 'A - Apologize', 
                  content: 'Offer a sincere apology, even if it wasn\'t your personal fault. "I\'m truly sorry we\'ve let you down. You deserve better, and I\'m going to make this right." Take ownership on behalf of the company.',
                  icon: 'hands'
                },
                { 
                  title: 'R - Resolve', 
                  content: 'Take immediate, concrete action. Sarah didn\'t just promise to "look into it"—she called the warehouse while Michael stayed on the line, located his package, and arranged expedited shipping at no extra cost.',
                  icon: 'check-circle'
                },
                { 
                  title: 'T - Thank', 
                  content: 'Express genuine gratitude for their patience and for bringing the issue to your attention. "Thank you for giving us the chance to make this right. Your feedback helps us improve."',
                  icon: 'star'
                },
              ],
              allowMultiple: false,
              style: 'cards'
            }),
          ]),
        ],
      }),

      // Scene 4: Interactive Practice
      createScene('practice', 'Try It Yourself', {
        type: 'activity',
        description: 'Practice the HEART method with a scenario',
        background: { 
          type: 'solid', 
          color: '#f8fafc' 
        },
        sections: [
          createSection('practice-content', 'Scenario Challenge', [
            createBlock('practice-title', 'heading', { 
              level: 2, 
              text: 'Your Turn: Handle This Situation' 
            }),
            createBlock('practice-scenario', 'callout', {
              type: 'scenario',
              title: 'The Situation',
              text: `A customer calls saying: "I've been charged twice for the same subscription! This is the third time this has happened. I want my money back AND I'm cancelling my account!"

What's your first response using the HEART method?`
            }),
            createBlock('practice-quiz', 'quiz', {
              question: 'Which response best demonstrates "Hear Them Out"?',
              options: [
                { 
                  text: '"I understand your frustration. Let me look into this right away."',
                  correct: false,
                  feedback: 'This is empathetic but jumps to solutions too quickly. The customer hasn\'t fully expressed themselves yet.'
                },
                { 
                  text: '"I\'m so sorry about that. Can you tell me exactly what happened?"',
                  correct: true,
                  feedback: 'Perfect! You\'re apologizing while inviting them to share more details, showing you want to understand the full picture.'
                },
                { 
                  text: '"Our billing system sometimes has glitches. I can process a refund for you."',
                  correct: false,
                  feedback: 'This offers a solution but doesn\'t acknowledge the emotional impact or the fact that this has happened multiple times.'
                },
                { 
                  text: '"Please calm down so I can help you."',
                  correct: false,
                  feedback: 'Never tell a customer to calm down. This dismisses their valid feelings and will escalate the situation.'
                },
              ],
              showFeedback: true,
              multipleAttempts: true
            }),
          ]),
        ],
      }),

      // Scene 5: Reflection
      createScene('reflection', 'Personal Reflection', {
        type: 'reflection',
        description: 'Connect the learning to your own experience',
        background: { 
          type: 'gradient', 
          gradient: { type: 'linear', angle: 135, colors: ['#7c3aed', '#a78bfa'] } 
        },
        sections: [
          createSection('reflect-content', 'Think About It', [
            createBlock('reflect-title', 'heading', { 
              level: 2, 
              text: 'Connect to Your Experience' 
            }),
            createBlock('reflect-intro', 'text', {
              text: 'The best learning happens when we connect new knowledge to our own experiences. Take a moment to reflect on these questions.'
            }),
            createBlock('reflect-journal1', 'reflection', {
              prompt: 'Think about a time when you were the frustrated customer. What did the representative do that either helped or made things worse? How did it make you feel?',
              placeholder: 'Share your experience here...',
              minWords: 30
            }),
            createBlock('reflect-journal2', 'reflection', {
              prompt: 'Which part of the HEART method do you think would be most challenging for you to implement? Why?',
              placeholder: 'Reflect on potential challenges...',
              minWords: 20
            }),
            createBlock('reflect-tip', 'callout', {
              type: 'info',
              text: '💡 Tip: Your reflections are private and saved to your learning journal. You can revisit them anytime.'
            }),
          ]),
        ],
      }),

      // Scene 6: Summary & Takeaways
      createScene('summary', 'Key Takeaways', {
        type: 'summary',
        description: 'Summarize and celebrate completion',
        background: { 
          type: 'gradient', 
          gradient: { type: 'linear', angle: 180, colors: ['#059669', '#10b981'] } 
        },
        sections: [
          createSection('sum-content', 'What You Learned', [
            createBlock('sum-title', 'heading', { 
              level: 2, 
              text: '🎉 Lesson Complete!' 
            }),
            createBlock('sum-text', 'text', {
              text: 'Congratulations! You\'ve completed the Customer Service Excellence lesson. Here\'s what you\'ve mastered:'
            }),
            createBlock('sum-list', 'list', {
              items: [
                '✅ The HEART method for de-escalation',
                '✅ Active listening techniques that build trust',
                '✅ How to turn negative situations into positive outcomes',
                '✅ The power of genuine empathy in customer interactions',
              ],
              style: 'checklist'
            }),
            createBlock('sum-stats', 'stat-card', {
              value: '95%',
              label: 'of angry customers will return if their issue is resolved quickly and empathetically',
              icon: 'trending-up'
            }),
            createBlock('sum-badge', 'badge', {
              name: 'Customer Champion',
              icon: 'award',
              description: 'Completed the Customer Service Excellence lesson',
              rarity: 'common'
            }),
            createBlock('sum-cta', 'callout', {
              type: 'success',
              text: '🚀 Ready for the next challenge? Try "Advanced De-escalation Techniques" to level up your skills!'
            }),
          ]),
        ],
      }),
    ],
  },
  placeholders: [],
  instructions: [
    'This template is ready to use as-is for customer service training',
    'Customize the scenario in Scene 4 to match your industry',
    'Add company-specific policies and procedures',
    'Include your own customer testimonials in Scene 6',
  ],
};

// ============================================
// ENRICHED TEMPLATE 2: DATA SECURITY FUNDAMENTALS
// A comprehensive step-based tutorial on password security
// ============================================

export const dataSecurityFundamentals: LessonTemplate = {
  metadata: {
    id: 'data-security-fundamentals',
    name: 'Data Security Fundamentals',
    description: 'Protect yourself and your organization from cyber threats',
    longDescription: 'Learn essential data security practices through interactive scenarios and hands-on exercises. From password hygiene to phishing detection, this lesson covers the fundamentals every employee needs to know.',
    category: 'step-based',
    difficulty: 'beginner',
    tags: ['security', 'cybersecurity', 'passwords', 'phishing', 'compliance', 'training'],
    components: ['text', 'image', 'video', 'checklist', 'quiz', 'interactive'],
    estimatedTime: 20,
    sceneCount: 5,
    hasBranching: false,
    hasAssessment: true,
    hasGamification: true,
    isInteractive: true,
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=300&fit=crop',
    featured: true,
    ratings: { average: 4.9, count: 567 },
    usageCount: 3421,
  },
  content: {
    title: 'Data Security Fundamentals: Your First Line of Defense',
    description: 'Essential cybersecurity practices for everyone',
    theme: 'infographic',
    settings: DEFAULT_TEMPLATE_SETTINGS,
    scenes: [
      // Scene 1: Welcome
      createScene('intro', 'Why Security Matters', {
        type: 'welcome',
        background: { 
          type: 'gradient', 
          gradient: { type: 'linear', angle: 135, colors: ['#0f172a', '#1e293b'] } 
        },
        sections: [
          createSection('intro-content', 'The Reality', [
            createBlock('intro-title', 'heading', { 
              level: 1, 
              text: '🔐 Data Security Fundamentals' 
            }),
            createBlock('intro-stat', 'stat-card', {
              value: '88%',
              label: 'of data breaches are caused by human error',
              icon: 'alert-triangle',
              color: 'red'
            }),
            createBlock('intro-text', 'text', {
              text: `Every 39 seconds, there's a cyber attack somewhere in the world. But here's the good news: the vast majority of these attacks are preventable with basic security practices.

In this lesson, you'll learn the essential skills to protect yourself, your colleagues, and your organization from cyber threats.`
            }),
            createBlock('intro-objectives', 'list', {
              items: [
                '🎯 Create unbreakable passwords',
                '🎯 Recognize phishing attempts',
                '🎯 Secure your devices',
                '🎯 Handle sensitive data safely',
              ],
              style: 'objectives'
            }),
          ]),
        ],
      }),

      // Scene 2: Password Security
      createScene('passwords', 'Password Mastery', {
        type: 'concept',
        background: { 
          type: 'solid', 
          color: '#f1f5f9' 
        },
        sections: [
          createSection('pass-content', 'Step 1: Strong Passwords', [
            createBlock('pass-title', 'heading', { 
              level: 2, 
              text: '🔑 Creating Unbreakable Passwords' 
            }),
            createBlock('pass-intro', 'text', {
              text: 'Your password is often the only thing standing between hackers and your personal information. Let\'s learn how to make it impenetrable.'
            }),
            createBlock('pass-video', 'video', {
              src: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
              poster: 'https://images.unsplash.com/photo-1614124921447-af8a054f1eb3?w=800&h=450&fit=crop',
              title: 'The Art of Strong Passwords',
              duration: '3:45'
            }),
            createBlock('pass-donts', 'callout', {
              type: 'danger',
              title: '❌ Never Use These',
              text: '• Your name, birthday, or family members\' names\n• Common words (password, admin, welcome)\n• Sequential numbers (123456, 987654)\n• Single dictionary words\n• The same password for multiple accounts'
            }),
            createBlock('pass-dos', 'callout', {
              type: 'success',
              title: '✅ Do Use These',
              text: '• At least 16 characters\n• Mix of uppercase, lowercase, numbers, and symbols\n• Passphrases: "My-Dog-Loves-Tennis-Balls-2024!"\n• Unique passwords for every account\n• A password manager to generate and store them'
            }),
            createBlock('pass-interactive', 'password-strength', {
              label: 'Test Your Password Strength',
              placeholder: 'Enter a password to test...',
              showSuggestions: true
            }),
          ]),
        ],
      }),

      // Scene 3: Phishing Detection
      createScene('phishing', 'Spot the Phish', {
        type: 'activity',
        background: { 
          type: 'gradient', 
          gradient: { type: 'linear', angle: 180, colors: ['#7c3aed', '#6d28d9'] } 
        },
        sections: [
          createSection('phish-content', 'Step 2: Phishing Detection', [
            createBlock('phish-title', 'heading', { 
              level: 2, 
              text: '🎣 Spot the Phish' 
            }),
            createBlock('phish-intro', 'text', {
              text: 'Phishing emails have become incredibly sophisticated. Can you tell the difference between a legitimate email and a scam? Let\'s test your skills.'
            }),
            createBlock('phish-example', 'email-preview', {
              from: 'security@amaz0n-support.com',
              subject: 'URGENT: Your account will be suspended!',
              body: `Dear Valued Customer,

We have detected unusual activity on your account. To prevent suspension, please verify your identity immediately by clicking the link below:

[VERIFY NOW]

If you do not verify within 24 hours, your account will be permanently suspended.

Best regards,
Amazon Security Team`,
              isPhishing: true,
              redFlags: [
                'Sender domain is "amaz0n-support.com" (fake domain with zero)',
                'Creates false urgency with 24-hour threat',
                'Asks you to click a link to "verify"',
                'Generic greeting instead of your name',
              ]
            }),
            createBlock('phish-quiz', 'quiz', {
              question: 'Which of these is the BIGGEST red flag in the email above?',
              options: [
                { text: 'The subject line uses all caps for "URGENT"', correct: false, feedback: 'While this is suspicious, there\'s an even bigger red flag.' },
                { text: 'The sender domain is "amaz0n-support.com"', correct: true, feedback: 'Exactly! The domain uses a zero instead of "o" - a classic phishing technique to mimic legitimate domains.' },
                { text: 'The email is from "security"', correct: false, feedback: 'Legitimate companies do have security departments. This alone isn\'t the biggest red flag.' },
                { text: 'It asks you to verify your identity', correct: false, feedback: 'Verification requests can be legitimate. The domain is the real giveaway here.' },
              ]
            }),
          ]),
        ],
      }),

      // Scene 4: Security Checklist
      createScene('checklist', 'Your Security Checklist', {
        type: 'activity',
        background: { 
          type: 'solid', 
          color: '#fef3c7' 
        },
        sections: [
          createSection('check-content', 'Step 3: Take Action', [
            createBlock('check-title', 'heading', { 
              level: 2, 
              text: '📋 Your Security Action Plan' 
            }),
            createBlock('check-intro', 'text', {
              text: 'Complete this checklist to secure your digital life. Check off each item as you complete it.'
            }),
            createBlock('check-list', 'checklist', {
              items: [
                { id: 'pw-manager', text: 'Install a password manager (LastPass, 1Password, or Bitwarden)', completed: false, priority: 'high' },
                { id: 'unique-pw', text: 'Create unique passwords for your 5 most important accounts', completed: false, priority: 'high' },
                { id: '2fa', text: 'Enable two-factor authentication on email and banking', completed: false, priority: 'high' },
                { id: 'phish-learn', text: 'Bookmark your company\'s phishing reporting email', completed: false, priority: 'medium' },
                { id: 'update', text: 'Update your devices to the latest software versions', completed: false, priority: 'medium' },
                { id: 'backup', text: 'Set up automatic backups for important files', completed: false, priority: 'medium' },
                { id: 'vpn', text: 'Install a VPN for public Wi-Fi use', completed: false, priority: 'low' },
              ],
              showProgress: true,
              saveState: true
            }),
            createBlock('check-tip', 'callout', {
              type: 'info',
              text: '💡 Come back to this checklist anytime from your Learning Dashboard to track your progress!'
            }),
          ]),
        ],
      }),

      // Scene 5: Completion
      createScene('complete', 'Security Champion', {
        type: 'summary',
        background: { 
          type: 'gradient', 
          gradient: { type: 'linear', angle: 135, colors: ['#059669', '#047857'] } 
        },
        sections: [
          createSection('comp-content', 'Certification', [
            createBlock('comp-title', 'heading', { 
              level: 2, 
              text: '🏆 You\'re Now a Security Champion!' 
            }),
            createBlock('comp-score', 'score-display', {
              label: 'Security Score',
              value: 100,
              animate: true,
              showConfetti: true
            }),
            createBlock('comp-badge', 'badge', {
              name: 'Security First Responder',
              icon: 'shield',
              description: 'Completed Data Security Fundamentals training',
              rarity: 'rare'
            }),
            createBlock('comp-text', 'text', {
              text: 'You\'ve completed the fundamental security training. You now know how to:\n\n• Create and manage strong passwords\n• Identify phishing attempts\n• Protect your devices and data\n\nRemember: Security is everyone\'s responsibility. Share what you\'ve learned with your colleagues!'
            }),
            createBlock('comp-certificate', 'download', {
              label: 'Download Certificate',
              format: 'pdf',
              filename: 'data-security-certificate'
            }),
          ]),
        ],
      }),
    ],
  },
  placeholders: [],
  instructions: [
    'This template is ready for immediate use in security awareness training',
    'Customize the phishing example with industry-specific scenarios',
    'Add your organization\'s security policies and reporting procedures',
    'Include IT department contact information for suspicious emails',
  ],
};

// ============================================
// ENRICHED TEMPLATE 3: LEADERSHIP DECISION MAKING
// A branching scenario for leadership development
// ============================================

export const leadershipDecisionMaking: LessonTemplate = {
  metadata: {
    id: 'leadership-decision-making',
    name: 'Leadership Decision Making',
    description: 'Navigate complex leadership scenarios with branching outcomes',
    longDescription: 'Step into the role of a team leader facing difficult decisions. Your choices shape the story and reveal the consequences of different leadership approaches. Learn through experience, not just theory.',
    category: 'scenario',
    difficulty: 'intermediate',
    tags: ['leadership', 'management', 'decision-making', 'soft skills', 'professional development'],
    components: ['text', 'image', 'branching', 'scenario', 'reflection', 'callout'],
    estimatedTime: 25,
    sceneCount: 7,
    hasBranching: true,
    hasAssessment: false,
    hasGamification: false,
    isInteractive: true,
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop',
    featured: true,
    ratings: { average: 4.7, count: 189 },
    usageCount: 892,
  },
  content: {
    title: 'Leadership Decision Making: The Project Deadline Crisis',
    description: 'Make critical leadership decisions under pressure',
    theme: 'immersive',
    settings: DEFAULT_TEMPLATE_SETTINGS,
    scenes: [
      // Scene 1: Setup
      createScene('intro', 'The Situation', {
        type: 'welcome',
        background: { 
          type: 'image',
          image: { 
            src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=800&fit=crop',
            opacity: 0.4
          }
        },
        sections: [
          createSection('intro-content', 'Your Role', [
            createBlock('intro-title', 'heading', { 
              level: 1, 
              text: 'The Project Deadline Crisis' 
            }),
            createBlock('intro-role', 'callout', {
              type: 'info',
              title: 'Your Role',
              text: 'You are Alex Chen, Team Lead at TechForward Inc. You manage a team of 6 developers working on a critical client project.'
            }),
            createBlock('intro-text', 'text', {
              text: `It's Monday morning. Your team has been working on the Nexus Project for 8 weeks. The deadline is Friday—just 5 days away.

Here's what you know:
• The project is 90% complete
• Your senior developer, Maya, has been out sick for 3 days
• The client has explicitly stated they cannot accept any delays
• Your team has been working overtime for 2 weeks

As you walk into the office, you receive news that will test your leadership skills...`
            }),
          ]),
        ],
      }),

      // Scene 2: The Crisis
      createScene('crisis', 'Critical Decision', {
        type: 'branching',
        background: { 
          type: 'gradient', 
          gradient: { type: 'linear', angle: 180, colors: ['#991b1b', '#b91c1c'] } 
        },
        navigation: {
          type: 'branching',
          branches: [
            { id: 'push-harder', label: 'Push the team harder with mandatory overtime', targetSceneId: 'outcome-push', style: 'primary' },
            { id: 'negotiate', label: 'Contact the client to negotiate timeline', targetSceneId: 'outcome-negotiate', style: 'secondary' },
            { id: 'resources', label: 'Request additional resources from management', targetSceneId: 'outcome-resources', style: 'secondary' },
          ],
        },
        sections: [
          createSection('crisis-content', 'The News', [
            createBlock('crisis-title', 'heading', { 
              level: 2, 
              text: '⚠️ Critical Bug Discovered' 
            }),
            createBlock('crisis-text', 'text', {
              text: `Your junior developer, Jordan, rushes to your desk.

"Alex, I found something. There's a critical security vulnerability in the authentication module. It wasn't caught in testing. To fix it properly, we need at least 3 days of work."

You feel your stomach tighten. Three days of work, and only five days until deadline. The team is already exhausted.

Your senior developer Maya walks in—she's back from sick leave but clearly not at 100%.

"I'm back, Alex. But honestly, I don't know how much I can help. My energy is low."`
            }),
            createBlock('crisis-decision', 'callout', {
              type: 'warning',
              title: 'Decision Point',
              text: 'What do you do? Consider the impact on your team, the client relationship, and the project quality.'
            }),
          ]),
        ],
      }),

      // Scene 3: Outcome - Push Harder
      createScene('outcome-push', 'Consequences: Push Harder', {
        type: 'summary',
        background: { 
          type: 'gradient', 
          gradient: { type: 'linear', angle: 135, colors: ['#dc2626', '#991b1b'] } 
        },
        sections: [
          createSection('push-content', 'The Result', [
            createBlock('push-title', 'heading', { 
              level: 2, 
              text: 'Short-Term Win, Long-Term Loss' 
            }),
            createBlock('push-text', 'text', {
              text: `You announce mandatory 12-hour days for the rest of the week.

**The Outcome:**
The project is delivered on time. The client is satisfied.

**But three weeks later:**
• Jordan quits, citing burnout
• Maya takes another sick leave, this time for stress
• The remaining team members are disengaged and productivity drops 40%
• Two more team members start interviewing elsewhere

The security fix was rushed and caused issues in production, damaging your reputation with the client.`
            }),
            createBlock('push-lesson', 'callout', {
              type: 'danger',
              title: 'Leadership Lesson',
              text: 'Short-term pressure tactics often create long-term damage. Your team is your most valuable asset—protecting it is a leader\'s primary responsibility.'
            }),
            createBlock('push-reflection', 'reflection', {
              prompt: 'What would you do differently if you could go back? How would you balance the deadline pressure with team wellbeing?',
              placeholder: 'Reflect on this outcome...'
            }),
          ]),
        ],
      }),

      // Scene 4: Outcome - Negotiate
      createScene('outcome-negotiate', 'Consequences: Negotiate', {
        type: 'summary',
        background: { 
          type: 'gradient', 
          gradient: { type: 'linear', angle: 135, colors: ['#2563eb', '#1d4ed8'] } 
        },
        sections: [
          createSection('neg-content', 'The Result', [
            createBlock('neg-title', 'heading', { 
              level: 2, 
              text: 'Transparency Builds Trust' 
            }),
            createBlock('neg-text', 'text', {
              text: `You call the client and explain the situation honestly.

**The Outcome:**
The client appreciates your transparency. They agree to a 3-day extension for proper security fixes.

**The Result:**
• The team works normal hours with focused effort
• Maya contributes meaningfully within her energy limits
• Jordan feels valued and learns from the experience
• The security fix is implemented properly
• The client relationship is strengthened through honest communication

The project launches 3 days late but with zero critical issues.`
            }),
            createBlock('neg-lesson', 'callout', {
              type: 'success',
              title: 'Leadership Lesson',
              text: 'Most clients value honesty and quality over rigid deadlines. Transparent communication builds trust that lasts far beyond a single project.'
            }),
            createBlock('neg-reflection', 'reflection', {
              prompt: 'How did transparency serve both the team and the client relationship? What made this approach successful?',
              placeholder: 'Reflect on this outcome...'
            }),
          ]),
        ],
      }),

      // Scene 5: Outcome - Request Resources
      createScene('outcome-resources', 'Consequences: Request Resources', {
        type: 'summary',
        background: { 
          type: 'gradient', 
          gradient: { type: 'linear', angle: 135, colors: ['#16a34a', '#15803d'] } 
        },
        sections: [
          createSection('res-content', 'The Result', [
            createBlock('res-title', 'heading', { 
              level: 2, 
              text: 'Creative Problem-Solving' 
            }),
            createBlock('res-text', 'text', {
              text: `You approach your manager with a clear proposal: bring in two contractors for 3 days to handle the security fix while your team focuses on final integration.

**The Outcome:**
Management approves the budget for contractors.

**The Result:**
• Your team stays energized and focused
• The security fix is handled by specialists
• Maya mentors the contractors, feeling useful without overexerting
• The project launches on time with all issues resolved
• You've demonstrated resourcefulness and problem-solving

The investment in contractors costs less than the potential cost of team turnover.`
            }),
            createBlock('res-lesson', 'callout', {
              type: 'info',
              title: 'Leadership Lesson',
              text: "Great leaders don't try to solve everything alone. They identify creative solutions and aren't afraid to ask for help when it benefits everyone."
            }),
            createBlock('res-reflection', 'reflection', {
              prompt: 'How did seeking resources demonstrate leadership? What skills did you apply to make this approach successful?',
              placeholder: 'Reflect on this outcome...'
            }),
          ]),
        ],
      }),

      // Scene 6: Final Reflection
      createScene('final-reflection', 'Leadership Principles', {
        type: 'reflection',
        background: { 
          type: 'gradient', 
          gradient: { type: 'linear', angle: 180, colors: ['#475569', '#334155'] } 
        },
        sections: [
          createSection('refl-content', 'Key Takeaways', [
            createBlock('refl-title', 'heading', { 
              level: 2, 
              text: 'Leadership Principles to Remember' 
            }),
            createBlock('refl-principles', 'accordion', {
              items: [
                { 
                  title: 'People Over Deadlines', 
                  content: 'Your team\'s wellbeing directly impacts quality and retention. Short-term wins that sacrifice team health create long-term problems.' 
                },
                { 
                  title: 'Transparency Builds Trust', 
                  content: 'Honest communication with stakeholders—whether clients or team members—creates stronger relationships and better outcomes.' 
                },
                { 
                  title: 'Ask for Help', 
                  content: 'Seeking resources or support isn\'t weakness—it\'s strategic thinking. The best solutions often involve collaboration.' 
                },
                { 
                  title: 'Quality Can\'t Be Rushed', 
                  content: 'Technical debt accumulates quickly. Taking time to do things right saves exponentially more time later.' 
                },
              ]
            }),
            createBlock('refl-journal', 'reflection', {
              prompt: 'Think about a leadership challenge you\'re currently facing. How might you apply these principles?',
              placeholder: 'Apply these lessons to your situation...',
              minWords: 40
            }),
          ]),
        ],
      }),

      // Scene 7: Completion
      createScene('complete', 'Leadership Journey', {
        type: 'summary',
        background: { 
          type: 'gradient', 
          gradient: { type: 'linear', angle: 135, colors: ['#7c3aed', '#6d28d9'] } 
        },
        sections: [
          createSection('comp-content', 'Certification', [
            createBlock('comp-title', 'heading', { 
              level: 2, 
              text: '🎓 Leadership Scenario Complete' 
            }),
            createBlock('comp-text', 'text', {
              text: 'You\'ve navigated a complex leadership scenario and explored different decision-making approaches. The path you chose revealed important lessons about balancing competing priorities.'
            }),
            createBlock('comp-badge', 'badge', {
              name: 'Decision Maker',
              icon: 'compass',
              description: 'Completed Leadership Decision Making scenario',
              rarity: 'epic'
            }),
            createBlock('comp-next', 'callout', {
              type: 'info',
              text: '📚 Continue your leadership journey with "Managing Underperforming Teams" to build on these skills.'
            }),
          ]),
        ],
      }),
    ],
  },
  placeholders: [],
  instructions: [
    'This template demonstrates branching scenario capabilities',
    'Customize the scenario to match your organization\'s context',
    'Add more decision points for longer, more complex scenarios',
    'Include industry-specific challenges and terminology',
  ],
};

// ============================================
// EXPORT ALL ENRICHED TEMPLATES
// ============================================

export const ENRICHED_TEMPLATES: Record<string, LessonTemplate> = {
  'customer-service-excellence': customerServiceExcellence,
  'data-security-fundamentals': dataSecurityFundamentals,
  'leadership-decision-making': leadershipDecisionMaking,
};

export default ENRICHED_TEMPLATES;
