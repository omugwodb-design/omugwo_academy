import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LessonBlockRenderer from '../../../../core/lms/lesson-blocks/LessonBlockRenderer';
import { LessonContent, LessonBlock } from '../../../../core/lms/lesson-blocks/types';
import {
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    Circle,
    Play,
    Maximize2,
    Volume2,
    VolumeX,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface Scene {
    id: string;
    title: string;
    description?: string;
    type: string;
    background: any;
    sections: { id: string; blocks: LessonBlock[] }[];
    navigation: any;
    transition?: any;
    audio?: any;
}

interface InteractiveLesson {
    type: 'interactive';
    id: string;
    title: string;
    scenes: Scene[];
    theme?: string;
    settings: {
        showGlobalProgress?: boolean;
        allowSceneNavigation?: boolean;
        showSceneMenu?: boolean;
        enableAudio?: boolean;
        autoSave?: boolean;
    };
    gamification?: any;
    metadata?: any;
}

interface BlocksLessonProps {
    content: LessonContent | InteractiveLesson | any;
}

// ============================================
// BACKGROUND RENDERER
// ============================================

const getBackgroundCSS = (bg: any): React.CSSProperties => {
    if (!bg) return {};
    switch (bg.type) {
        case 'solid':
            return { backgroundColor: bg.color || '#f8fafc' };
        case 'gradient':
            if (bg.gradient) {
                const { type = 'linear', angle = 135, colors = [] } = bg.gradient;
                if (type === 'radial') {
                    return { background: `radial-gradient(circle, ${colors.join(', ')})` };
                }
                return { background: `linear-gradient(${angle}deg, ${colors.join(', ')})` };
            }
            return {};
        case 'image':
            if (bg.image) {
                return {
                    backgroundImage: `url(${bg.image.src})`,
                    backgroundSize: bg.image.position === 'contain' ? 'contain' : 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    filter: bg.image.blur ? `blur(${bg.image.blur}px)` : undefined,
                    opacity: bg.image.opacity ?? 1,
                };
            }
            return {};
        default:
            return { backgroundColor: '#f8fafc' };
    }
};

// ============================================
// SCENE PROGRESS INDICATOR
// ============================================

const SceneProgressBar: React.FC<{
    totalScenes: number;
    currentScene: number;
    completedScenes: Set<number>;
    onSceneSelect?: (index: number) => void;
    allowNavigation?: boolean;
}> = ({ totalScenes, currentScene, completedScenes, onSceneSelect, allowNavigation }) => (
    <div className="flex items-center gap-1.5 px-4 py-3">
        {Array.from({ length: totalScenes }).map((_, i) => {
            const isCompleted = completedScenes.has(i);
            const isCurrent = i === currentScene;
            return (
                <button
                    key={i}
                    onClick={() => allowNavigation && onSceneSelect?.(i)}
                    disabled={!allowNavigation}
                    className={`
            relative flex-1 h-1.5 rounded-full transition-all duration-500 
            ${isCurrent ? 'bg-purple-500 shadow-lg shadow-purple-500/30' : isCompleted ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'}
            ${allowNavigation ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}
          `}
                >
                    {isCurrent && (
                        <motion.div
                            layoutId="sceneIndicator"
                            className="absolute -top-1 -bottom-1 left-0 right-0 rounded-full bg-purple-500 shadow-lg shadow-purple-500/40"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                    )}
                </button>
            );
        })}
    </div>
);

// ============================================
// SCENE VIEWER COMPONENT
// ============================================

const SceneViewer: React.FC<{
    scene: Scene;
    isActive: boolean;
    direction: number;
}> = ({ scene, isActive, direction }) => {
    const bgStyle = getBackgroundCSS(scene.background);
    const hasOverlay = scene.background?.overlay;

    const slideVariants = {
        enter: (d: number) => ({
            x: d > 0 ? '100%' : '-100%',
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (d: number) => ({
            x: d < 0 ? '100%' : '-100%',
            opacity: 0,
        }),
    };

    return (
        <motion.div
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full min-h-[60vh] relative rounded-2xl overflow-hidden"
            style={bgStyle}
        >
            {/* Background overlay */}
            {hasOverlay && (
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundColor: scene.background.overlay.color,
                        opacity: scene.background.overlay.opacity,
                    }}
                />
            )}

            {/* Content */}
            <div className="relative z-10 py-8 px-6 md:px-12 max-w-4xl mx-auto">
                {/* Scene title */}
                {scene.title && scene.type !== 'custom' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-white/10 backdrop-blur text-white/80 mb-3 border border-white/10">
                            {scene.type}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                            {scene.title}
                        </h2>
                        {scene.description && (
                            <p className="mt-2 text-gray-600 dark:text-gray-300">{scene.description}</p>
                        )}
                    </motion.div>
                )}

                {/* Scene sections with blocks */}
                <div className="space-y-4">
                    {scene.sections?.map((section, sIdx) => (
                        <motion.div
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * (sIdx + 1) }}
                        >
                            {section.blocks?.map((block) => (
                                <div key={block.id} className="mb-4">
                                    <LessonBlockRenderer
                                        block={block}
                                        isEditing={false}
                                    />
                                </div>
                            ))}
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

// ============================================
// INTERACTIVE LESSON VIEWER
// ============================================

const InteractiveLessonViewer: React.FC<{ lesson: InteractiveLesson }> = ({ lesson }) => {
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [completedScenes, setCompletedScenes] = useState<Set<number>>(new Set());
    const [direction, setDirection] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const scenes = lesson.scenes || [];
    const currentScene = scenes[currentSceneIndex];
    const settings = lesson.settings || {};

    const goToScene = useCallback((index: number) => {
        if (index < 0 || index >= scenes.length) return;
        setDirection(index > currentSceneIndex ? 1 : -1);
        // Mark previous scene as completed
        setCompletedScenes((prev) => new Set(prev).add(currentSceneIndex));
        setCurrentSceneIndex(index);
        containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentSceneIndex, scenes.length]);

    const goNext = useCallback(() => goToScene(currentSceneIndex + 1), [goToScene, currentSceneIndex]);
    const goPrev = useCallback(() => goToScene(currentSceneIndex - 1), [goToScene, currentSceneIndex]);

    // Keyboard navigation
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                goNext();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goPrev();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [goNext, goPrev]);

    if (!currentScene) {
        return (
            <div className="w-full bg-white dark:bg-gray-900 rounded-2xl p-8 text-center text-gray-500">
                This interactive lesson has no scenes yet.
            </div>
        );
    }

    const isFirstScene = currentSceneIndex === 0;
    const isLastScene = currentSceneIndex === scenes.length - 1;

    return (
        <div ref={containerRef} className="w-full space-y-4">
            {/* Progress indicator */}
            {settings.showGlobalProgress !== false && scenes.length > 1 && (
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2">
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Scene {currentSceneIndex + 1} of {scenes.length}
                        </span>
                        <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                            {Math.round(((completedScenes.size) / scenes.length) * 100)}% Complete
                        </span>
                    </div>
                    <SceneProgressBar
                        totalScenes={scenes.length}
                        currentScene={currentSceneIndex}
                        completedScenes={completedScenes}
                        onSceneSelect={settings.allowSceneNavigation ? goToScene : undefined}
                        allowNavigation={settings.allowSceneNavigation}
                    />
                </div>
            )}

            {/* Scene content with transitions */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <AnimatePresence mode="wait" custom={direction}>
                    <SceneViewer
                        key={currentScene.id}
                        scene={currentScene}
                        isActive={true}
                        direction={direction}
                    />
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
                <button
                    onClick={goPrev}
                    disabled={isFirstScene}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${isFirstScene
                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </button>

                {/* Scene dots (for small number of scenes) */}
                {scenes.length <= 10 && (
                    <div className="flex items-center gap-2">
                        {scenes.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => settings.allowSceneNavigation && goToScene(i)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === currentSceneIndex
                                    ? 'bg-purple-500 scale-125 shadow-lg shadow-purple-500/40'
                                    : completedScenes.has(i)
                                        ? 'bg-green-400'
                                        : 'bg-gray-300 dark:bg-gray-600'
                                    } ${settings.allowSceneNavigation ? 'cursor-pointer hover:scale-110' : ''}`}
                            />
                        ))}
                    </div>
                )}

                <button
                    onClick={() => {
                        if (isLastScene) {
                            // Mark last scene as completed
                            setCompletedScenes((prev) => new Set(prev).add(currentSceneIndex));
                        } else {
                            goNext();
                        }
                    }}
                    disabled={false}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${isLastScene
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30'
                        : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30'
                        }`}
                >
                    {isLastScene ? (
                        <>
                            <CheckCircle className="w-4 h-4" />
                            Complete Lesson
                        </>
                    ) : (
                        <>
                            {currentScene.navigation?.nextButton?.label || 'Continue'}
                            <ChevronRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

// ============================================
// FLAT BLOCKS VIEWER
// ============================================

const FlatBlocksViewer: React.FC<{ blocks: LessonBlock[] }> = ({ blocks }) => (
    <div className="w-full space-y-2">
        {blocks.map((block) => (
            <LessonBlockRenderer
                key={block.id}
                block={block}
                isEditing={false}
            />
        ))}
    </div>
);

// ============================================
// MAIN BLOCKS LESSON COMPONENT
// ============================================

export const BlocksLesson: React.FC<BlocksLessonProps> = ({ content }) => {
    if (!content) {
        return (
            <div className="w-full bg-white dark:bg-gray-900 rounded-2xl p-8 lg:p-12 border border-gray-200 dark:border-gray-800 text-center text-gray-500">
                No content provided for this lesson.
            </div>
        );
    }

    // Check if this is an interactive scene-based lesson
    const isInteractive = content.type === 'interactive' && content.scenes && Array.isArray(content.scenes);

    if (isInteractive) {
        return <InteractiveLessonViewer lesson={content as InteractiveLesson} />;
    }

    // Flat blocks format
    const blocks = content.blocks;
    if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
        return (
            <div className="w-full bg-white dark:bg-gray-900 rounded-2xl p-8 lg:p-12 border border-gray-200 dark:border-gray-800 text-center text-gray-500">
                No content provided for this lesson.
            </div>
        );
    }

    return <FlatBlocksViewer blocks={blocks} />;
};
