import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import React, { useEffect } from 'react';

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    const buttonClass = (isActive) =>
        `p-2 rounded hover:bg-gray-200 transition-colors ${isActive ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`;

    return (
        <div className="flex flex-wrap gap-1 border-b p-2 bg-gray-50 rounded-t-lg">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={buttonClass(editor.isActive('bold'))}
                title="Bold"
            >
                <strong>B</strong>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={buttonClass(editor.isActive('italic'))}
                title="Italic"
            >
                <em>I</em>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={buttonClass(editor.isActive('underline'))}
                title="Underline"
            >
                <u>U</u>
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
            <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={buttonClass(editor.isActive({ textAlign: 'left' }))}
                title="Align Left"
            >
                Left
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={buttonClass(editor.isActive({ textAlign: 'center' }))}
                title="Align Center"
            >
                Center
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={buttonClass(editor.isActive({ textAlign: 'right' }))}
                title="Align Right"
            >
                Right
            </button>
             <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
             <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={buttonClass(editor.isActive('bulletList'))}
                title="Bullet List"
            >
                • List
            </button>
             <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={buttonClass(editor.isActive('orderedList'))}
                title="Ordered List"
            >
                1. List
            </button>
        </div>
    );
};

export default function RichTextEditor({ content, onChange, editable = true }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right', 'justify'],
            }),
            Highlight,
        ],
        content: content,
        editable: editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[300px]',
            },
        },
    });

    // Update content if it changes externally
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
             // Only set content if it's different to avoid cursor jumping
             // This is a simple check; for production might need better diffing
             if (editor.getText() === '' && content !== '') {
                 editor.commands.setContent(content);
             }
        }
    }, [content, editor]);

    return (
        <div className="border rounded-lg bg-white shadow-sm w-full">
            {editable && <MenuBar editor={editor} />}
            <EditorContent editor={editor} />
        </div>
    );
}
