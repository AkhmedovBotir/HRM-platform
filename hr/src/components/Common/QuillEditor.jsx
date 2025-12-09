import { useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

function QuillEditor({ value, onChange, placeholder, className = '' }) {
  const editorRef = useRef(null)
  const quillInstanceRef = useRef(null)
  const isUpdatingRef = useRef(false)

  useEffect(() => {
    if (!editorRef.current) return
    if (quillInstanceRef.current) return // Already initialized

    // Ensure container is empty before initializing
    editorRef.current.innerHTML = ''

    // Initialize Quill
    quillInstanceRef.current = new Quill(editorRef.current, {
      theme: 'snow',
      placeholder: placeholder || '',
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link'],
          ['clean'],
        ],
      },
    })

    // Set initial content
    if (value) {
      quillInstanceRef.current.root.innerHTML = value
    }

    // Listen for text changes
    quillInstanceRef.current.on('text-change', () => {
      if (isUpdatingRef.current) return
      const html = quillInstanceRef.current.root.innerHTML
      if (onChange) {
        onChange(html)
      }
    })

    return () => {
      if (quillInstanceRef.current && editorRef.current) {
        // Properly clean up by clearing the container
        editorRef.current.innerHTML = ''
        quillInstanceRef.current = null
      }
    }
  }, [])

  // Update content when value prop changes (for editing mode)
  useEffect(() => {
    if (quillInstanceRef.current && value !== undefined) {
      const currentContent = quillInstanceRef.current.root.innerHTML
      // Only update if the content is different to avoid infinite loops
      if (currentContent !== value) {
        isUpdatingRef.current = true
        quillInstanceRef.current.root.innerHTML = value || ''
        // Reset flag after a short delay
        setTimeout(() => {
          isUpdatingRef.current = false
        }, 0)
      }
    }
  }, [value])

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 [&_.ql-container]:border-0 [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-200">
      <div ref={editorRef} className={className} />
    </div>
  )
}

export default QuillEditor

