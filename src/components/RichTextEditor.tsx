
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link', 'image'],
    ['clean']
  ],
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'align', 'link', 'image'
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Digite o conteúdo do documento...",
  className = ""
}) => {
  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={false}
        style={{
          height: '400px',
          marginBottom: '50px'
        }}
      />
      <style>{`
        .rich-text-editor .ql-editor {
          font-family: 'Times New Roman', serif !important;
          font-size: 12pt !important;
          line-height: 1.6 !important;
          background-color: white !important;
          color: #000 !important;
        }
        
        .rich-text-editor .ql-container {
          font-family: 'Times New Roman', serif !important;
        }
        
        .rich-text-editor .ql-toolbar {
          border-top: 1px solid #ccc;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          background-color: #f8f9fa;
        }
        
        .rich-text-editor .ql-container {
          border-bottom: 1px solid #ccc;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
        }
        
        .rich-text-editor .ql-editor p {
          margin: 0 0 10px 0 !important;
        }
        
        .rich-text-editor .ql-editor h1,
        .rich-text-editor .ql-editor h2,
        .rich-text-editor .ql-editor h3 {
          margin: 15px 0 10px 0 !important;
          color: #000 !important;
        }
        
        .rich-text-editor .ql-editor ul,
        .rich-text-editor .ql-editor ol {
          margin: 10px 0 !important;
        }
        
        .rich-text-editor .ql-editor strong {
          font-weight: bold !important;
        }
        
        .rich-text-editor .ql-editor em {
          font-style: italic !important;
        }
        
        .rich-text-editor .ql-editor div {
          margin: 0 !important;
          color: #000 !important;
        }
        
        .rich-text-editor .ql-editor img {
          max-width: 60px !important;
          height: auto !important;
          display: inline-block !important;
        }
        
        /* Garante que todo o conteúdo seja editável */
        .rich-text-editor .ql-editor * {
          cursor: text !important;
          user-select: text !important;
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
        }
      `}</style>
    </div>
  );
};
