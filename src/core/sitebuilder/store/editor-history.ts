// Enhanced History System with Branching and Checkpoints
// Provides robust undo/redo with named checkpoints and history visualization

import { Block, Template, GlobalStyles } from '../types';

// History snapshot representing a single state
export interface HistorySnapshot {
  id: string;
  timestamp: number;
  blocks: Block[];
  globalStyles?: GlobalStyles;
  label?: string; // Named checkpoint
  isCheckpoint: boolean;
  branchId: string;
  parentId: string | null;
  metadata?: {
    action?: string; // e.g., "Added Hero Block", "Changed Colors"
    blockId?: string;
    blockType?: string;
  };
}

// History branch for parallel edit paths
export interface HistoryBranch {
  id: string;
  name: string;
  createdAt: number;
  snapshots: string[]; // Snapshot IDs in order
  isActive: boolean;
  color: string; // For visual distinction
}

// Branch colors for visualization
const BRANCH_COLORS = [
  '#7c3aed', // Primary purple
  '#06b6d4', // Cyan
  '#10b981', // Green
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#ec4899', // Pink
];

// Generate unique ID
const generateId = () => `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// History Manager Class
export class EditorHistoryManager {
  private snapshots: Map<string, HistorySnapshot> = new Map();
  private branches: Map<string, HistoryBranch> = new Map();
  private currentBranchId: string;
  private currentSnapshotId: string | null = null;
  private maxSnapshots: number = 100;
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Create main branch
    const mainBranch: HistoryBranch = {
      id: 'main',
      name: 'Main',
      createdAt: Date.now(),
      snapshots: [],
      isActive: true,
      color: BRANCH_COLORS[0],
    };
    this.branches.set('main', mainBranch);
    this.currentBranchId = 'main';
  }

  // Subscribe to history changes
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify all listeners
  private notify() {
    this.listeners.forEach(listener => listener());
  }

  // Push a new state to history
  push(
    blocks: Block[],
    options?: {
      label?: string;
      isCheckpoint?: boolean;
      metadata?: HistorySnapshot['metadata'];
      globalStyles?: GlobalStyles;
    }
  ): string {
    const branch = this.branches.get(this.currentBranchId);
    if (!branch) throw new Error('Current branch not found');

    // Create new snapshot
    const snapshot: HistorySnapshot = {
      id: generateId(),
      timestamp: Date.now(),
      blocks: JSON.parse(JSON.stringify(blocks)), // Deep clone
      globalStyles: options?.globalStyles ? JSON.parse(JSON.stringify(options.globalStyles)) : undefined,
      label: options?.label,
      isCheckpoint: options?.isCheckpoint || false,
      branchId: this.currentBranchId,
      parentId: this.currentSnapshotId,
      metadata: options?.metadata,
    };

    // Add to snapshots map
    this.snapshots.set(snapshot.id, snapshot);

    // Add to branch
    branch.snapshots.push(snapshot.id);
    this.currentSnapshotId = snapshot.id;

    // Enforce max snapshots per branch
    if (branch.snapshots.length > this.maxSnapshots) {
      const removed = branch.snapshots.shift();
      if (removed) {
        this.snapshots.delete(removed);
      }
    }

    this.notify();
    return snapshot.id;
  }

  // Create a named checkpoint
  createCheckpoint(blocks: Block[], label: string, globalStyles?: GlobalStyles): string {
    return this.push(blocks, {
      label,
      isCheckpoint: true,
      globalStyles,
    });
  }

  // Undo - go to previous snapshot in current branch
  undo(): Block[] | null {
    const branch = this.branches.get(this.currentBranchId);
    if (!branch || branch.snapshots.length <= 1) return null;

    const currentIndex = branch.snapshots.indexOf(this.currentSnapshotId || '');
    if (currentIndex <= 0) return null;

    const prevSnapshotId = branch.snapshots[currentIndex - 1];
    const prevSnapshot = this.snapshots.get(prevSnapshotId);
    if (!prevSnapshot) return null;

    this.currentSnapshotId = prevSnapshotId;
    this.notify();
    return JSON.parse(JSON.stringify(prevSnapshot.blocks));
  }

  // Redo - go to next snapshot in current branch
  redo(): Block[] | null {
    const branch = this.branches.get(this.currentBranchId);
    if (!branch) return null;

    const currentIndex = branch.snapshots.indexOf(this.currentSnapshotId || '');
    if (currentIndex >= branch.snapshots.length - 1) return null;

    const nextSnapshotId = branch.snapshots[currentIndex + 1];
    const nextSnapshot = this.snapshots.get(nextSnapshotId);
    if (!nextSnapshot) return null;

    this.currentSnapshotId = nextSnapshotId;
    this.notify();
    return JSON.parse(JSON.stringify(nextSnapshot.blocks));
  }

  // Jump to specific snapshot
  jumpTo(snapshotId: string): Block[] | null {
    const snapshot = this.snapshots.get(snapshotId);
    if (!snapshot) return null;

    // Switch to snapshot's branch if different
    if (snapshot.branchId !== this.currentBranchId) {
      this.switchBranch(snapshot.branchId);
    }

    this.currentSnapshotId = snapshotId;
    this.notify();
    return JSON.parse(JSON.stringify(snapshot.blocks));
  }

  // Create a new branch from current state
  createBranch(name: string): string {
    const currentSnapshot = this.currentSnapshotId 
      ? this.snapshots.get(this.currentSnapshotId) 
      : null;

    const colorIndex = this.branches.size % BRANCH_COLORS.length;
    const newBranch: HistoryBranch = {
      id: generateId(),
      name,
      createdAt: Date.now(),
      snapshots: [],
      isActive: false,
      color: BRANCH_COLORS[colorIndex],
    };

    this.branches.set(newBranch.id, newBranch);

    // If we have a current snapshot, copy it as the starting point
    if (currentSnapshot) {
      const startSnapshot: HistorySnapshot = {
        id: generateId(),
        timestamp: Date.now(),
        blocks: JSON.parse(JSON.stringify(currentSnapshot.blocks)),
        globalStyles: currentSnapshot.globalStyles 
          ? JSON.parse(JSON.stringify(currentSnapshot.globalStyles)) 
          : undefined,
        label: `Branch: ${name}`,
        isCheckpoint: true,
        branchId: newBranch.id,
        parentId: this.currentSnapshotId,
        metadata: { action: `Created branch: ${name}` },
      };
      this.snapshots.set(startSnapshot.id, startSnapshot);
      newBranch.snapshots.push(startSnapshot.id);
    }

    this.notify();
    return newBranch.id;
  }

  // Switch to a different branch
  switchBranch(branchId: string): boolean {
    const branch = this.branches.get(branchId);
    if (!branch) return false;

    // Deactivate current branch
    const currentBranch = this.branches.get(this.currentBranchId);
    if (currentBranch) currentBranch.isActive = false;

    // Activate new branch
    branch.isActive = true;
    this.currentBranchId = branchId;

    // Set current snapshot to last in branch
    if (branch.snapshots.length > 0) {
      this.currentSnapshotId = branch.snapshots[branch.snapshots.length - 1];
    }

    this.notify();
    return true;
  }

  // Get current state
  getCurrentState(): { blocks: Block[]; globalStyles?: GlobalStyles } | null {
    if (!this.currentSnapshotId) return null;
    const snapshot = this.snapshots.get(this.currentSnapshotId);
    if (!snapshot) return null;

    return {
      blocks: JSON.parse(JSON.stringify(snapshot.blocks)),
      globalStyles: snapshot.globalStyles 
        ? JSON.parse(JSON.stringify(snapshot.globalStyles)) 
        : undefined,
    };
  }

  // Get all checkpoints
  getCheckpoints(): HistorySnapshot[] {
    const checkpoints: HistorySnapshot[] = [];
    this.snapshots.forEach(snapshot => {
      if (snapshot.isCheckpoint) {
        checkpoints.push(snapshot);
      }
    });
    return checkpoints.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Get branch history for visualization
  getBranchHistory(branchId?: string): HistorySnapshot[] {
    const targetBranchId = branchId || this.currentBranchId;
    const branch = this.branches.get(targetBranchId);
    if (!branch) return [];

    return branch.snapshots
      .map(id => this.snapshots.get(id))
      .filter((s): s is HistorySnapshot => s !== undefined);
  }

  // Get all branches
  getBranches(): HistoryBranch[] {
    return Array.from(this.branches.values());
  }

  // Get current branch
  getCurrentBranch(): HistoryBranch | null {
    return this.branches.get(this.currentBranchId) || null;
  }

  // Can undo/redo
  canUndo(): boolean {
    const branch = this.branches.get(this.currentBranchId);
    if (!branch || branch.snapshots.length <= 1) return false;
    const currentIndex = branch.snapshots.indexOf(this.currentSnapshotId || '');
    return currentIndex > 0;
  }

  canRedo(): boolean {
    const branch = this.branches.get(this.currentBranchId);
    if (!branch) return false;
    const currentIndex = branch.snapshots.indexOf(this.currentSnapshotId || '');
    return currentIndex < branch.snapshots.length - 1;
  }

  // Get history size
  getHistorySize(): { snapshots: number; branches: number } {
    return {
      snapshots: this.snapshots.size,
      branches: this.branches.size,
    };
  }

  // Clear all history
  clear(): void {
    this.snapshots.clear();
    this.branches.clear();
    this.currentSnapshotId = null;

    // Recreate main branch
    const mainBranch: HistoryBranch = {
      id: 'main',
      name: 'Main',
      createdAt: Date.now(),
      snapshots: [],
      isActive: true,
      color: BRANCH_COLORS[0],
    };
    this.branches.set('main', mainBranch);
    this.currentBranchId = 'main';

    this.notify();
  }

  // Export history for persistence
  export(): { snapshots: HistorySnapshot[]; branches: HistoryBranch[]; currentBranchId: string; currentSnapshotId: string | null } {
    return {
      snapshots: Array.from(this.snapshots.values()),
      branches: Array.from(this.branches.values()),
      currentBranchId: this.currentBranchId,
      currentSnapshotId: this.currentSnapshotId,
    };
  }

  // Import history from persistence
  import(data: { snapshots: HistorySnapshot[]; branches: HistoryBranch[]; currentBranchId: string; currentSnapshotId: string | null }): void {
    this.snapshots.clear();
    this.branches.clear();

    data.snapshots.forEach(s => this.snapshots.set(s.id, s));
    data.branches.forEach(b => this.branches.set(b.id, b));
    this.currentBranchId = data.currentBranchId;
    this.currentSnapshotId = data.currentSnapshotId;

    this.notify();
  }
}

// Singleton instance
let historyManagerInstance: EditorHistoryManager | null = null;

export const getHistoryManager = (): EditorHistoryManager => {
  if (!historyManagerInstance) {
    historyManagerInstance = new EditorHistoryManager();
  }
  return historyManagerInstance;
};

export default EditorHistoryManager;
