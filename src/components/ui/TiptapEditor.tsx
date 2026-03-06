import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Undo,
  Redo,
  Image as ImageIcon,
  Link as LinkIcon
} from 'lucide-react'
import React, { useCallback } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null
  }

  const addImage = useCallback(() => {
    const url = window.prompt('URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-t-xl">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-800 text-primary-600' : 'text-gray-600 dark:text-gray-400'}`}
        type="button"
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-800 text-primary-600' : 'text-gray-600 dark:text-gray-400'}`}
        type="button"
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('strike') ? 'bg-gray-200 dark:bg-gray-800 text-primary-600' : 'text-gray-600 dark:text-gray-400'}`}
        type="button"
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />
      
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-800 text-primary-600' : 'text-gray-600 dark:text-gray-400'}`}
        type="button"
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-800 text-primary-600' : 'text-gray-600 dark:text-gray-400'}`}
        type="button"
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />
      
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-800 text-primary-600' : 'text-gray-600 dark:text-gray-400'}`}
        type="button"
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-800 text-primary-600' : 'text-gray-600 dark:text-gray-400'}`}
        type="button"
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-800 text-primary-600' : 'text-gray-600 dark:text-gray-400'}`}
        type="button"
        title="Quote"
      >
        <Quote className="w-4 h-4" />
      </button>
      
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />
      
      <button
        onClick={setLink}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('link') ? 'bg-gray-200 dark:bg-gray-800 text-primary-600' : 'text-gray-600 dark:text-gray-400'}`}
        type="button"
        title="Add Link"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
      <button
        onClick={addImage}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
        type="button"
        title="Add Image"
      >
        <ImageIcon className="w-4 h-4" />
      </button>
      
      <div className="flex-1" />
      
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:hover:bg-transparent"
        type="button"
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:hover:bg-transparent"
        type="button"
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  )
}

export const TiptapEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      })
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] p-4 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 rounded-b-xl',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent transition-all">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
