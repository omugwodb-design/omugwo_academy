# Lesson Builder Dual-Mode Architecture

## Overview

This document outlines the architecture for supporting both **Standard Lessons** and **Interactive Lessons** within the Omugwo Academy platform. The goal is to create a Learning Experience Design Studio comparable to Adapt Learning, Articulate Rise, and Genially.

---

## 1. Dual Content Creation Modes

### 1.1 Lesson Type Model

```typescript
type LessonType = 'standard' | 'interactive';

interface Lesson {
  id: string;
  type: LessonType; // NEW: distinguishes lesson modes
  title: string;
  description?: string;
  
  // Standard mode fields
  content?: StandardLessonContent;
  
  // Interactive mode fields  
  scenes?: Scene[]; // Scene-based structure
  theme?: LessonTheme;
  
  // Shared fields
  metadata: LessonMetadata;
}
```

### 1.2 Mode Selection Flow

```
Create Lesson
     ↓
┌─────────────────────────────────────┐
│     Select Lesson Type              │
│                                     │
│  ┌─────────┐    ┌──────────────┐   │
│  │ Standard │    │ Interactive  │   │
│  │  Lesson  │    │   Lesson     │   │
│  │         │    │              │   │
│  │ Text &  │    │ Advanced     │   │
│  │ Media   │    │ Builder      │   │
│  └─────────┘    └──────────────┘   │
└─────────────────────────────────────┘
     ↓                    ↓
Rich Text Editor    Scene Builder
```

---

## 2. Scene-Based Lesson Structure

### 2.1 Scene Model

```typescript
interface Scene {
  id: string;
  title: string;
  description?: string;
  
  // Visual environment
  background: SceneBackground;
  
  // Content blocks within scene
  sections: SceneSection[];
  
  // Navigation
  navigation: SceneNavigation;
  
  // Completion tracking
  completionCriteria?: CompletionCriteria;
}

interface SceneSection {
  id: string;
  title?: string;
  blocks: LessonBlock[];
  layout?: 'single' | 'two-column' | 'three-column' | 'custom';
}

interface SceneBackground {
  type: 'solid' | 'gradient' | 'image' | 'video' | 'parallax';
  
  // Solid
  color?: string;
  
  // Gradient
  gradient?: {
    type: 'linear' | 'radial';
    colors: string[];
    angle?: number;
  };
  
  // Image/Video
  media?: {
    src: string;
    alt?: string;
    opacity?: number;
    blur?: number;
  };
  
  // Parallax
  parallax?: {
    speed: number;
    layers: ParallaxLayer[];
  };
  
  // Overlay
  overlay?: {
    color: string;
    opacity: number;
  };
}

interface SceneNavigation {
  type: 'scroll' | 'click' | 'auto' | 'branching';
  
  // For click navigation
  nextButton?: {
    label: string;
    style: 'minimal' | 'prominent' | 'hidden';
  };
  
  // For auto-advance
  autoAdvance?: {
    delay: number; // seconds
    allowSkip: boolean;
  };
  
  // For branching
  branches?: SceneBranch[];
}

interface SceneBranch {
  id: string;
  label: string;
  targetSceneId: string;
  condition?: BranchCondition;
}
```

### 2.2 Scene Types (Templates)

| Scene Type | Purpose | Example Use |
|------------|---------|--------------|
| Welcome | Introduction, hook | Course opener, emotional connection |
| Concept | Core instruction | Teaching a principle |
| Exploration | Interactive discovery | Hotspot diagrams, accordions |
| Activity | Practice interaction | Scenarios, drag-drop |
| Assessment | Knowledge check | Quizzes, simulations |
| Reflection | Metacognition | Journaling, discussion |
| Summary | Conclusion | Key takeaways, badges |

---

## 3. Visual Background System

### 3.1 Background Types

```typescript
type BackgroundType = 
  | 'solid'
  | 'gradient'
  | 'image'
  | 'video'
  | 'parallax'
  | 'animated';
```

### 3.2 Pre-built Backgrounds

```typescript
const BACKGROUND_PRESETS = {
  // Solid colors
  solid: {
    white: '#ffffff',
    light: '#f8fafc',
    dark: '#0f172a',
    midnight: '#111827',
    cream: '#fef3c7',
    mint: '#d1fae5',
    lavender: '#ede9fe',
    coral: '#fee2e2',
  },
  
  // Gradients
  gradients: {
    sunrise: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
    ocean: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    forest: 'linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)',
    sunset: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
    night: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
    aurora: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 50%, #22c55e 100%)',
  },
  
  // Themed backgrounds
  themed: {
    classroom: { type: 'image', src: '/backgrounds/classroom.jpg' },
    hospital: { type: 'image', src: '/backgrounds/hospital.jpg' },
    nursery: { type: 'image', src: '/backgrounds/nursery.jpg' },
    nature: { type: 'image', src: '/backgrounds/forest.jpg' },
    abstract: { type: 'image', src: '/backgrounds/abstract.jpg' },
  },
};
```

---

## 4. Interactive Component Library

### 4.1 Component Categories

| Category | Components | Status |
|----------|------------|--------|
| **Content** | Heading, Text, Quote, Callout, Key Insight | ✅ Implemented |
| **Media** | Image, Video, Audio, Gallery, Carousel | ✅ Implemented |
| **Interactive** | Accordion, Tabs, FlipCard, Hotspot, Timeline | ✅ Implemented |
| **Assessment** | KnowledgeCheck, Poll, Matching, Sorting, FillBlank | ✅ Implemented |
| **Scenario** | Scenario (branching), Process Steps | ✅ Implemented |
| **Engagement** | Discussion, Reflection, Checklist, Badge | ✅ Implemented |
| **Layout** | Grid, Section, Divider, Spacer | ✅ Implemented |
| **Resource** | Resource, File Download | ✅ Implemented |

### 4.2 Component Enhancement Roadmap

| Component | Current | Needed Enhancement |
|-----------|---------|-------------------|
| Accordion | Basic reveal | Animation, icons, completion tracking |
| FlipCard | Basic flip | Multiple flip directions, 3D effects |
| Hotspot | Pulse style | Multiple styles, completion tracking |
| Timeline | Vertical/horizontal | Animated progression, milestones |
| Scenario | Basic branching | Visual flow editor, multiple outcomes |
| KnowledgeCheck | Multiple choice | More question types, adaptive feedback |
| Progress | Basic bar | Animated, checkpoints, milestones |
| Badge | Static display | Unlock animations, collection view |

---

## 5. Lesson Themes System

### 5.1 Theme Model

```typescript
interface LessonTheme {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  
  // Typography
  fonts: {
    heading: FontConfig;
    body: FontConfig;
    accent?: FontConfig;
  };
  
  // Colors
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
  };
  
  // Component styles
  components: {
    card: CardStyle;
    button: ButtonStyle;
    input: InputStyle;
    callout: CalloutStyle;
  };
  
  // Animations
  animations: {
    transition: TransitionStyle;
    entrance: EntranceStyle;
    interaction: InteractionStyle;
  };
  
  // Backgrounds
  backgrounds: BackgroundPreset[];
}
```

### 5.2 Built-in Themes

| Theme | Style | Use Case |
|-------|-------|----------|
| **Minimal Light** | Clean, white, modern | Professional courses |
| **Minimal Dark** | Dark mode, sleek | Tech/developer content |
| **Immersive Dark** | Cinematic, atmospheric | Storytelling, scenarios |
| **Illustrated** | Playful, colorful | Child development |
| **Infographic** | Data-focused, bold | Medical, scientific |
| **Storytelling** | Narrative, warm | Personal stories |
| **Educational** | Traditional, structured | Academic content |
| **African Heritage** | Cultural patterns | African-focused content |

---

## 6. Animated Transitions System

### 6.1 Transition Types

```typescript
type TransitionType = 
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'flip'
  | 'rotate'
  | 'blur'
  | 'none';

interface TransitionConfig {
  type: TransitionType;
  duration: number; // ms
  delay?: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}
```

### 6.2 Scroll Reveal Animations

```typescript
interface ScrollRevealConfig {
  enabled: boolean;
  threshold: number; // 0-1, percentage visible to trigger
  rootMargin?: string;
  
  // Animation to apply
  animation: {
    from: CSSProperties;
    to: CSSProperties;
    duration: number;
    easing: string;
  };
}
```

---

## 7. Gamification Elements

### 7.1 Gamification Model

```typescript
interface GamificationConfig {
  // Progress tracking
  progress: {
    enabled: boolean;
    showInHeader: boolean;
    style: 'bar' | 'circle' | 'steps';
  };
  
  // Points system
  points?: {
    enabled: boolean;
    perInteraction: number;
    perCorrectAnswer: number;
    perCompletion: number;
  };
  
  // Badges
  badges?: {
    enabled: boolean;
    triggers: BadgeTrigger[];
  };
  
  // Checkpoints
  checkpoints?: {
    enabled: boolean;
    positions: number[]; // percentage marks
  };
  
  // Streaks
  streaks?: {
    enabled: boolean;
    resetOnFail: boolean;
  };
}

interface BadgeTrigger {
  badgeId: string;
  condition: 'scene-complete' | 'all-correct' | 'time-spent' | 'interaction-count';
  threshold: number;
}
```

---

## 8. Adaptive Learning Logic

### 8.1 Conditional Content

```typescript
interface ConditionalContent {
  id: string;
  conditions: ContentCondition[];
  logic: 'all' | 'any'; // AND or OR
  
  // Content to show if conditions met
  content: LessonBlock[];
  
  // Fallback content
  fallback?: LessonBlock[];
}

interface ContentCondition {
  type: 'answer-correct' | 'answer-incorrect' | 'score-range' | 'time-spent' | 'interaction-complete';
  
  // For answer conditions
  questionId?: string;
  answerId?: string;
  
  // For score conditions
  minScore?: number;
  maxScore?: number;
  
  // For time conditions
  minTime?: number;
  maxTime?: number;
}
```

### 8.2 Branching Logic

```typescript
interface BranchingLogic {
  entryPoint: string; // scene ID
  
  branches: {
    id: string;
    sourceScene: string;
    sourceInteraction: string; // e.g., "choice-A"
    targetScene: string;
  }[];
  
  // Default path if no conditions met
  defaultPath: string[];
}
```

---

## 9. Preview & Simulation Mode

### 9.1 Preview Modes

```typescript
type PreviewMode = 
  | 'desktop'
  | 'tablet'
  | 'mobile'
  | 'simulation'; // Full interactive simulation

interface PreviewConfig {
  mode: PreviewMode;
  
  // For simulation mode
  simulation?: {
    startScene?: string;
    simulateBranching: boolean;
    trackProgress: boolean;
    showDebugInfo: boolean; // Show condition states
  };
}
```

---

## 10. Performance Optimization

### 10.1 Lazy Loading Strategy

```typescript
// Component-level lazy loading
const InteractiveComponents = {
  Accordion: lazy(() => import('./Accordion')),
  FlipCard: lazy(() => import('./FlipCard')),
  Hotspot: lazy(() => import('./Hotspot')),
  Scenario: lazy(() => import('./Scenario')),
  // ... etc
};

// Scene-level lazy loading
const SceneLoader = ({ sceneId }: { sceneId: string }) => {
  const [Scene, setScene] = useState(null);
  
  useEffect(() => {
    // Load scene content when scene becomes active
    import(`./scenes/${sceneId}`).then(setScene);
  }, [sceneId]);
  
  return Scene ? <Scene /> : <LoadingPlaceholder />;
};
```

### 10.2 Media Optimization

```typescript
interface MediaOptimization {
  // Images
  images: {
    lazyLoad: boolean;
    placeholder: 'blur' | 'skeleton' | 'color';
    formats: ['webp', 'avif', 'jpg'];
    responsive: boolean;
  };
  
  // Videos
  videos: {
    lazyLoad: boolean;
    preload: 'none' | 'metadata' | 'auto';
    quality: 'auto' | 'high' | 'medium' | 'low';
  };
}
```

---

## 11. Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Lesson type selection UI
- [ ] Scene data model
- [ ] Scene navigation system
- [ ] Background system basics

### Phase 2: Scene Builder (Week 3-4)
- [ ] Scene editor UI
- [ ] Scene transition animations
- [ ] Background picker component
- [ ] Scene templates

### Phase 3: Enhanced Components (Week 5-6)
- [ ] Component animations
- [ ] Completion tracking
- [ ] Scroll reveal system
- [ ] Progress indicators

### Phase 4: Themes & Gamification (Week 7-8)
- [ ] Theme system
- [ ] Built-in themes
- [ ] Badge unlock system
- [ ] Points & streaks

### Phase 5: Advanced Features (Week 9-10)
- [ ] Adaptive learning logic
- [ ] Visual branching editor
- [ ] Simulation preview mode
- [ ] Performance optimization

---

## 12. Data Migration

### 12.1 Backward Compatibility

Existing lessons remain fully functional:

```typescript
// Legacy lesson format (unchanged)
interface LegacyLesson {
  id: string;
  title: string;
  content: LessonBlock[];
  // ... existing fields
}

// Conversion utility for interactive mode
function convertToInteractive(legacy: LegacyLesson): Lesson {
  return {
    ...legacy,
    type: 'standard', // Preserve as standard
    // Interactive lessons use new format
  };
}
```

### 12.2 Hybrid Course Support

Courses can contain both lesson types:

```typescript
interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[]; // Mixed standard and interactive
}

// Example course structure
const exampleCourse = {
  modules: [
    {
      title: 'Module 1',
      lessons: [
        { type: 'standard', title: 'Introduction' },
        { type: 'interactive', title: 'Hands-on Practice' },
        { type: 'standard', title: 'Video Lesson' },
        { type: 'interactive', title: 'Scenario Simulation' },
      ]
    }
  ]
};
```

---

## 13. API Endpoints

### 13.1 Lesson Endpoints

```
POST   /api/lessons                    # Create lesson (type specified in body)
GET    /api/lessons/:id                # Get lesson (returns based on type)
PUT    /api/lessons/:id                # Update lesson
DELETE /api/lessons/:id                # Delete lesson

# Interactive-specific
GET    /api/lessons/:id/scenes         # Get all scenes
POST   /api/lessons/:id/scenes         # Create scene
PUT    /api/lessons/:id/scenes/:sceneId # Update scene
DELETE /api/lessons/:id/scenes/:sceneId # Delete scene

# Themes
GET    /api/themes                     # List available themes
GET    /api/themes/:id                 # Get theme details
```

---

## Conclusion

This architecture enables the platform to serve as a true Learning Experience Design Studio while maintaining full backward compatibility with existing text-based lessons. The scene-based structure, visual backgrounds, animated transitions, and gamification elements will create immersive learning experiences comparable to Adapt Learning and Articulate Rise.
