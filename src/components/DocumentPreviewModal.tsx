
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: any;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  document
}) => {
  const handleDownload = () => {
    console.log('Download document:', document?.fileName);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && document?.content) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${document.title}</title>
          <style>
            body { 
              font-family: 'Times New Roman', serif; 
              margin: 0; 
              padding: 20px; 
              background: white; 
            }
            @media print {
              body { margin: 0; padding: 15px; }
            }
          </style>
        </head>
        <body>
          ${document.content}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {document.title}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handlePrint}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>Imprimir</span>
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto border rounded-lg bg-white">
          <div 
            className="p-6"
            dangerouslySetInnerHTML={{ __html: document.content }}
            style={{
              fontFamily: 'Times New Roman, serif',
              fontSize: '12pt',
              lineHeight: '1.6',
              color: '#000'
            }}
          />
        </div>

        <div className="flex-shrink-0 flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-500">
            <span className="font-medium">Cliente:</span> {document.clientName} | 
            <span className="font-medium ml-2">Tipo:</span> {document.type} | 
            <span className="font-medium ml-2">Status:</span> {document.status}
          </div>
          <Button onClick={onClose} variant="outline">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
