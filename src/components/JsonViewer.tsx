
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface JsonViewerProps {
  json: string;
}

export const JsonViewer = ({ json }: JsonViewerProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    if (!json) return;
    
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "JSON has been copied to your clipboard",
      });
      
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formattedJson = () => {
    if (!json) return "";
    
    try {
      // If it's already an object, stringify it properly
      if (typeof json === "object") {
        return JSON.stringify(json, null, 2);
      }
      
      // If it's a JSON string, parse and re-stringify for formatting
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch (e) {
      // If it can't be parsed or formatted, return as is
      return json;
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          disabled={!json}
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="sr-only">Copy</span>
        </Button>
      </div>
      
      <pre
        className={`p-4 rounded-md bg-gray-900 text-gray-100 font-mono text-sm overflow-auto min-h-[300px] ${
          !json ? "flex items-center justify-center text-gray-500" : ""
        }`}
      >
        {json ? formattedJson() : "JSON output will appear here"}
      </pre>
    </div>
  );
};
