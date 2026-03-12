/**
 * Scenario Editor
 * 
 * Visual editor for building branching scenarios and decision trees.
 * Supports conditional logic, score-based paths, and adaptive learning.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '../../../../lib/utils';
import {
  ScenarioNode,
  ScenarioChoice,
  ScenarioCondition,
  ScenarioScore,
} from '../scene-types';
import {
  GitBranch,
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Copy,
  Settings,
  X,
  Edit3,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Move,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface ScenarioData {
  id: string;
  title: string;
  description?: string;
  startNodeId: string;
  nodes: ScenarioNode[];
  scores: ScenarioScore[];
  settings: {
    allowBacktracking: boolean;
    showProgress: boolean;
    trackScore: boolean;
    adaptiveDifficulty: boolean;
  };
}

export interface ScenarioEditorProps {
  initialData?: ScenarioData;
  onSave?: (data: ScenarioData) => void;
  readOnly?: boolean;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function createDefaultNode(type: ScenarioNode['type'] = 'choice'): ScenarioNode {
  return {
    id: generateId(),
    type,
    title: type === 'start' ? 'Start' : type === 'end' ? 'End' : 'Decision Point',
    content: '',
    choices: type === 'choice' ? [
      { id: generateId(), label: 'Option A', targetNodeId: '', feedback: '' },
    ] : [],
    conditions: [],
    scoreModifier: 0,
    position: { x: 0, y: 0 },
  };
}

function createDefaultScenario(): ScenarioData {
  const startNode = createDefaultNode('start');
  const endNode = createDefaultNode('end');
  endNode.id = generateId();
  endNode.title = 'Outcome';
  
  return {
    id: `scenario_${Date.now()}`,
    title: 'New Scenario',
    startNodeId: startNode.id,
    nodes: [startNode, endNode],
    scores: [
      { id: 'default', name: 'Points', value: 0, min: 0, max: 100 },
    ],
    settings: {
      allowBacktracking: true,
      showProgress: true,
      trackScore: true,
      adaptiveDifficulty: false,
    },
  };
}

// ============================================
// NODE TYPE ICONS & COLORS
// ============================================

const NODE_STYLES: Record<ScenarioNode['type'], { color: string; bg: string; border: string }> = {
  start: { color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-300 dark:border-green-700' },
  choice: { color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-300 dark:border-blue-700' },
  condition: { color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-300 dark:border-amber-700' },
  outcome: { color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-300 dark:border-purple-700' },
  end: { color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-300 dark:border-red-700' },
};

const NODE_ICONS: Record<ScenarioNode['type'], React.ElementType> = {
  start: CheckCircle,
  choice: GitBranch,
  condition: Target,
  outcome: Award,
  end: AlertCircle,
};

// ============================================
// NODE EDITOR COMPONENT
// ============================================

interface NodeEditorProps {
  node: ScenarioNode;
  allNodes: ScenarioNode[];
  scores: ScenarioScore[];
  onUpdate: (node: ScenarioNode) => void;
  onDelete: () => void;
  onClose: () => void;
  readOnly?: boolean;
}

const NodeEditor: React.FC<NodeEditorProps> = ({
  node,
  allNodes,
  scores,
  onUpdate,
  onDelete,
  onClose,
  readOnly,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'choices' | 'conditions' | 'settings'>('content');

  const handleUpdate = (updates: Partial<ScenarioNode>) => {
    onUpdate({ ...node, ...updates });
  };

  const addChoice = () => {
    const newChoice: ScenarioChoice = {
      id: generateId(),
      label: `Option ${(node.choices?.length || 0) + 1}`,
      targetNodeId: '',
      feedback: '',
    };
    handleUpdate({ choices: [...(node.choices || []), newChoice] });
  };

  const updateChoice = (index: number, updates: Partial<ScenarioChoice>) => {
    const newChoices = [...(node.choices || [])];
    newChoices[index] = { ...newChoices[index], ...updates };
    handleUpdate({ choices: newChoices });
  };

  const removeChoice = (index: number) => {
    const newChoices = (node.choices || []).filter((_, i) => i !== index);
    handleUpdate({ choices: newChoices });
  };

  const addCondition = () => {
    const newCondition: ScenarioCondition = {
      id: generateId(),
      type: 'score',
      scoreId: scores[0]?.id || 'default',
      operator: 'gte',
      value: 50,
      targetNodeId: '',
    };
    handleUpdate({ conditions: [...(node.conditions || []), newCondition] });
  };

  const updateCondition = (index: number, updates: Partial<ScenarioCondition>) => {
    const newConditions = [...(node.conditions || [])];
    newConditions[index] = { ...newConditions[index], ...updates };
    handleUpdate({ conditions: newConditions });
  };

  const removeCondition = (index: number) => {
    const newConditions = (node.conditions || []).filter((_, i) => i !== index);
    handleUpdate({ conditions: newConditions });
  };

  const availableTargets = allNodes.filter(n => n.id !== node.id);

  return (
    <div className="absolute right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl z-20 overflow-hidden flex flex-col">
      {/* Header */}
      <div className={cn('px-4 py-3 border-b border-gray-200 dark:border-gray-700', NODE_STYLES[node.type].bg)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {React.createElement(NODE_ICONS[node.type], { className: cn('w-5 h-5', NODE_STYLES[node.type].color) })}
            <span className="font-semibold text-gray-900 dark:text-white">Edit Node</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {(['content', 'choices', 'conditions', 'settings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 px-3 py-2 text-xs font-medium capitalize',
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'content' && (
          <>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Title</label>
              <input
                type="text"
                value={node.title}
                onChange={(e) => handleUpdate({ title: e.target.value })}
                disabled={readOnly}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Content</label>
              <textarea
                value={node.content || ''}
                onChange={(e) => handleUpdate({ content: e.target.value })}
                disabled={readOnly}
                rows={4}
                placeholder="What happens at this point..."
                className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Node Type</label>
              <select
                value={node.type}
                onChange={(e) => handleUpdate({ type: e.target.value as ScenarioNode['type'] })}
                disabled={readOnly}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <option value="start">Start</option>
                <option value="choice">Choice</option>
                <option value="condition">Condition</option>
                <option value="outcome">Outcome</option>
                <option value="end">End</option>
              </select>
            </div>
          </>
        )}

        {activeTab === 'choices' && (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Choices</span>
              {!readOnly && (
                <button onClick={addChoice} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add Choice
                </button>
              )}
            </div>
            {(node.choices || []).map((choice, index) => (
              <div key={choice.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Choice {index + 1}</span>
                  {!readOnly && (
                    <button onClick={() => removeChoice(index)} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={choice.label}
                  onChange={(e) => updateChoice(index, { label: e.target.value })}
                  disabled={readOnly}
                  placeholder="Choice label"
                  className="w-full px-2 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded"
                />
                <select
                  value={choice.targetNodeId}
                  onChange={(e) => updateChoice(index, { targetNodeId: e.target.value })}
                  disabled={readOnly}
                  className="w-full px-2 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded"
                >
                  <option value="">Select target...</option>
                  {availableTargets.map(n => (
                    <option key={n.id} value={n.id}>{n.title}</option>
                  ))}
                </select>
                <textarea
                  value={choice.feedback || ''}
                  onChange={(e) => updateChoice(index, { feedback: e.target.value })}
                  disabled={readOnly}
                  placeholder="Feedback after selection (optional)"
                  rows={2}
                  className="w-full px-2 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded resize-none"
                />
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500">Score:</label>
                  <input
                    type="number"
                    value={choice.scoreModifier || 0}
                    onChange={(e) => updateChoice(index, { scoreModifier: parseInt(e.target.value) || 0 })}
                    disabled={readOnly}
                    className="w-20 px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded"
                  />
                </div>
              </div>
            ))}
            {(!node.choices || node.choices.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-4">No choices yet. Add one to create a branching path.</p>
            )}
          </>
        )}

        {activeTab === 'conditions' && (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Conditional Paths</span>
              {!readOnly && (
                <button onClick={addCondition} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add Condition
                </button>
              )}
            </div>
            {(node.conditions || []).map((condition, index) => (
              <div key={condition.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Condition {index + 1}</span>
                  {!readOnly && (
                    <button onClick={() => removeCondition(index)} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={condition.type}
                    onChange={(e) => updateCondition(index, { type: e.target.value as ScenarioCondition['type'] })}
                    disabled={readOnly}
                    className="px-2 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded"
                  >
                    <option value="score">Score Check</option>
                    <option value="choice">Previous Choice</option>
                    <option value="visited">Node Visited</option>
                  </select>
                  {condition.type === 'score' && (
                    <>
                      <select
                        value={condition.operator}
                        onChange={(e) => updateCondition(index, { operator: e.target.value as ScenarioCondition['operator'] })}
                        disabled={readOnly}
                        className="px-2 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded"
                      >
                        <option value="gte">≥ Greater or Equal</option>
                        <option value="lte">≤ Less or Equal</option>
                        <option value="eq">= Equal</option>
                        <option value="gt">&gt; Greater</option>
                        <option value="lt">&lt; Less</option>
                      </select>
                      <input
                        type="number"
                        value={condition.value}
                        onChange={(e) => updateCondition(index, { value: parseInt(e.target.value) || 0 })}
                        disabled={readOnly}
                        className="px-2 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded"
                      />
                    </>
                  )}
                </div>
                <select
                  value={condition.targetNodeId}
                  onChange={(e) => updateCondition(index, { targetNodeId: e.target.value })}
                  disabled={readOnly}
                  className="w-full px-2 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded"
                >
                  <option value="">Select target...</option>
                  {availableTargets.map(n => (
                    <option key={n.id} value={n.id}>{n.title}</option>
                  ))}
                </select>
              </div>
            ))}
            {(!node.conditions || node.conditions.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-4">No conditions. Add one for adaptive branching.</p>
            )}
          </>
        )}

        {activeTab === 'settings' && (
          <>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Score Modifier</label>
              <input
                type="number"
                value={node.scoreModifier || 0}
                onChange={(e) => handleUpdate({ scoreModifier: parseInt(e.target.value) || 0 })}
                disabled={readOnly}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
              />
              <p className="text-xs text-gray-400 mt-1">Points added/subtracted when reaching this node</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Media (Optional)</label>
              <input
                type="url"
                value={node.media?.image || ''}
                onChange={(e) => handleUpdate({ media: { ...node.media, image: e.target.value } })}
                disabled={readOnly}
                placeholder="Image URL"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
              />
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onDelete}
                disabled={readOnly || node.type === 'start'}
                className="w-full py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Node
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================
// NODE CARD COMPONENT
// ============================================

interface NodeCardProps {
  node: ScenarioNode;
  isSelected: boolean;
  isStart: boolean;
  onSelect: () => void;
  onDragStart: (e: React.DragEvent) => void;
}

const NodeCard: React.FC<NodeCardProps> = ({ node, isSelected, isStart, onSelect, onDragStart }) => {
  const Icon = NODE_ICONS[node.type];
  const style = NODE_STYLES[node.type];
  const choiceCount = node.choices?.length || 0;
  const conditionCount = node.conditions?.length || 0;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onSelect}
      className={cn(
        'w-48 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200',
        'hover:shadow-lg hover:scale-[1.02]',
        style.bg,
        style.border,
        isSelected && 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-900'
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn('w-4 h-4', style.color)} />
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
          {node.type}
        </span>
        {isStart && (
          <span className="ml-auto px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold rounded">
            START
          </span>
        )}
      </div>
      <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{node.title}</h4>
      {node.content && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{node.content}</p>
      )}
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
        {choiceCount > 0 && (
          <span className="flex items-center gap-1">
            <GitBranch className="w-3 h-3" /> {choiceCount}
          </span>
        )}
        {conditionCount > 0 && (
          <span className="flex items-center gap-1">
            <Target className="w-3 h-3" /> {conditionCount}
          </span>
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN SCENARIO EDITOR
// ============================================

export const ScenarioEditor: React.FC<ScenarioEditorProps> = ({
  initialData,
  onSave,
  readOnly = false,
}) => {
  const [scenario, setScenario] = useState<ScenarioData>(initialData || createDefaultScenario());
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState<ScenarioData[]>([scenario]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const selectedNode = useMemo(
    () => scenario.nodes.find(n => n.id === selectedNodeId) || null,
    [scenario.nodes, selectedNodeId]
  );

  const pushHistory = useCallback((newScenario: ScenarioData) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newScenario);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setScenario(newScenario);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setScenario(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setScenario(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const updateScenario = useCallback((updates: Partial<ScenarioData>) => {
    pushHistory({ ...scenario, ...updates });
  }, [scenario, pushHistory]);

  const addNode = useCallback((type: ScenarioNode['type'] = 'choice') => {
    const newNode = createDefaultNode(type);
    newNode.position = { x: 250, y: 100 + scenario.nodes.length * 120 };
    pushHistory({ ...scenario, nodes: [...scenario.nodes, newNode] });
    setSelectedNodeId(newNode.id);
  }, [scenario, pushHistory]);

  const updateNode = useCallback((node: ScenarioNode) => {
    pushHistory({
      ...scenario,
      nodes: scenario.nodes.map(n => n.id === node.id ? node : n),
    });
  }, [scenario, pushHistory]);

  const deleteNode = useCallback((nodeId: string) => {
    const node = scenario.nodes.find(n => n.id === nodeId);
    if (node?.type === 'start') return; // Can't delete start node
    
    pushHistory({
      ...scenario,
      nodes: scenario.nodes.filter(n => n.id !== nodeId),
    });
    setSelectedNodeId(null);
  }, [scenario, pushHistory]);

  const duplicateNode = useCallback((nodeId: string) => {
    const node = scenario.nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    const newNode: ScenarioNode = {
      ...JSON.parse(JSON.stringify(node)),
      id: generateId(),
      title: `${node.title} (Copy)`,
      position: { x: node.position.x + 50, y: node.position.y + 50 },
    };
    pushHistory({ ...scenario, nodes: [...scenario.nodes, newNode] });
  }, [scenario, pushHistory]);

  const handleNodeDrag = useCallback((nodeId: string, e: React.DragEvent) => {
    e.dataTransfer.setData('nodeId', nodeId);
  }, []);

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const nodeId = e.dataTransfer.getData('nodeId');
    if (!nodeId) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    pushHistory({
      ...scenario,
      nodes: scenario.nodes.map(n =>
        n.id === nodeId ? { ...n, position: { x, y } } : n
      ),
    });
  }, [scenario, zoom, pushHistory]);

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Left Sidebar - Node Palette */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-gray-900 dark:text-white">Scenario Editor</h3>
          </div>
          <input
            type="text"
            value={scenario.title}
            onChange={(e) => updateScenario({ title: e.target.value })}
            disabled={readOnly}
            className="mt-3 w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
          />
        </div>

        {/* Node Types */}
        <div className="p-4">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">Add Nodes</h4>
          <div className="space-y-2">
            {(['choice', 'condition', 'outcome', 'end'] as const).map(type => {
              const Icon = NODE_ICONS[type];
              const style = NODE_STYLES[type];
              return (
                <button
                  key={type}
                  onClick={() => addNode(type)}
                  disabled={readOnly}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all',
                    'hover:shadow-md hover:scale-[1.02] disabled:opacity-50',
                    style.bg, style.border
                  )}
                >
                  <Icon className={cn('w-5 h-5', style.color)} />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white capitalize">{type}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {type === 'choice' && 'Branching decision'}
                      {type === 'condition' && 'Adaptive path'}
                      {type === 'outcome' && 'Result state'}
                      {type === 'end' && 'Terminal point'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">Settings</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={scenario.settings.allowBacktracking}
                onChange={(e) => updateScenario({
                  settings: { ...scenario.settings, allowBacktracking: e.target.checked }
                })}
                disabled={readOnly}
                className="rounded"
              />
              Allow backtracking
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={scenario.settings.showProgress}
                onChange={(e) => updateScenario({
                  settings: { ...scenario.settings, showProgress: e.target.checked }
                })}
                disabled={readOnly}
                className="rounded"
              />
              Show progress
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={scenario.settings.trackScore}
                onChange={(e) => updateScenario({
                  settings: { ...scenario.settings, trackScore: e.target.checked }
                })}
                disabled={readOnly}
                className="rounded"
              />
              Track score
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => onSave?.(scenario)}
            disabled={readOnly}
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Save Scenario
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative overflow-hidden">
        {/* Toolbar */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1">
          <button
            onClick={undo}
            disabled={historyIndex === 0 || readOnly}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-50"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex === history.length - 1 || readOnly}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-50"
          >
            <Redo className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas */}
        <div
          className="w-full h-full p-8"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
          onDrop={handleCanvasDrop}
          onDragOver={handleCanvasDragOver}
        >
          {/* Connection Lines */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
            {scenario.nodes.map(node => (
              node.choices?.map((choice, idx) => {
                const target = scenario.nodes.find(n => n.id === choice.targetNodeId);
                if (!target) return null;
                
                const startX = node.position.x + 96;
                const startY = node.position.y + 60;
                const endX = target.position.x + 96;
                const endY = target.position.y;
                
                return (
                  <g key={`${node.id}-${choice.id}`}>
                    <path
                      d={`M ${startX} ${startY} C ${startX} ${startY + 50}, ${endX} ${endY - 50}, ${endX} ${endY}`}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="2"
                      strokeDasharray={choice.targetNodeId ? "none" : "5,5"}
                    />
                    <circle cx={endX} cy={endY} r="4" fill="#94a3b8" />
                  </g>
                );
              })
            ))}
            {scenario.nodes.map(node => (
              node.conditions?.map((condition) => {
                const target = scenario.nodes.find(n => n.id === condition.targetNodeId);
                if (!target) return null;
                
                const startX = node.position.x + 96;
                const startY = node.position.y + 60;
                const endX = target.position.x + 96;
                const endY = target.position.y;
                
                return (
                  <g key={`${node.id}-${condition.id}`}>
                    <path
                      d={`M ${startX} ${startY} C ${startX} ${startY + 50}, ${endX} ${endY - 50}, ${endX} ${endY}`}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                    />
                    <circle cx={endX} cy={endY} r="4" fill="#f59e0b" />
                  </g>
                );
              })
            ))}
          </svg>

          {/* Nodes */}
          <div className="relative">
            {scenario.nodes.map(node => (
              <div
                key={node.id}
                className="absolute"
                style={{ left: node.position.x, top: node.position.y }}
              >
                <NodeCard
                  node={node}
                  isSelected={selectedNodeId === node.id}
                  isStart={node.id === scenario.startNodeId}
                  onSelect={() => setSelectedNodeId(node.id)}
                  onDragStart={(e) => handleNodeDrag(node.id, e)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Node Editor Panel */}
        {selectedNode && (
          <NodeEditor
            node={selectedNode}
            allNodes={scenario.nodes}
            scores={scenario.scores}
            onUpdate={updateNode}
            onDelete={() => deleteNode(selectedNode.id)}
            onClose={() => setSelectedNodeId(null)}
            readOnly={readOnly}
          />
        )}
      </div>
    </div>
  );
};

export default ScenarioEditor;
