
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface FileUploaderProps {
  onFileContent: (content: string) => void;
}

export const FileUploader = ({ onFileContent }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileContent(content);
    };
    reader.readAsText(file);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center ${
        isDragging ? "border-blue-600 bg-blue-50" : "border-gray-300"
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Upload className="mx-auto h-8 w-8 text-blue-800 mb-2" />
      <p className="text-gray-600 mb-2">
        {fileName ? `File uploaded: ${fileName}` : "Drag and drop your EDI file here"}
      </p>
      <label htmlFor="file-upload">
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          Or select a file
        </Button>
      </label>
      <input 
        id="file-upload" 
        type="file" 
        className="hidden"
        onChange={handleFileChange} 
        accept=".txt,.edi,.x12"
      />
    </div>
  );
};
