import { LessonBlock } from './types';

// Find a block and its parent hierarchy
export const findBlock = (
    blocks: LessonBlock[],
    id: string,
    parentPath: string[] = []
): { block: LessonBlock; parentPath: string[] } | null => {
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].id === id) {
            return { block: blocks[i], parentPath };
        }
        if (blocks[i].children) {
            const found = findBlock(blocks[i].children!, id, [...parentPath, blocks[i].id]);
            if (found) return found;
        }
    }
    return null;
};

// Update a block by ID
export const updateBlockInTree = (
    blocks: LessonBlock[],
    id: string,
    updateFn: (block: LessonBlock) => LessonBlock
): LessonBlock[] => {
    return blocks.map(block => {
        if (block.id === id) {
            return updateFn(block);
        }
        if (block.children) {
            return {
                ...block,
                children: updateBlockInTree(block.children, id, updateFn)
            };
        }
        return block;
    });
};

// Remove a block from the tree
export const removeBlockFromTree = (
    blocks: LessonBlock[],
    id: string
): LessonBlock[] => {
    return blocks.filter(block => block.id !== id).map(block => {
        if (block.children) {
            return {
                ...block,
                children: removeBlockFromTree(block.children, id)
            };
        }
        return block;
    });
};

// Insert a block into the tree at a specific path/index
export const insertBlockInTree = (
    blocks: LessonBlock[],
    parentId: string | null,
    index: number,
    newBlock: LessonBlock,
    column?: number
): LessonBlock[] => {
    if (parentId === null) {
        const newBlocks = [...blocks];
        newBlocks.splice(index, 0, newBlock);
        return newBlocks;
    }

    return blocks.map(block => {
        if (block.id === parentId) {
            const children = [...(block.children || [])];
            // If column is specified (for column layouts), we merge it into props
            // Wait, if we use a flat children array, how do we know which column? 
            // We can store a "columnIndex" on the child's props.
            if (column !== undefined) {
                newBlock = { ...newBlock, props: { ...newBlock.props, columnIndex: column } };
            }
            children.splice(index, 0, newBlock);
            return { ...block, children };
        }
        if (block.children) {
            return {
                ...block,
                children: insertBlockInTree(block.children, parentId, index, newBlock, column)
            };
        }
        return block;
    });
};
