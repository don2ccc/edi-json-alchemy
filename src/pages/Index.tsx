
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { parseEDItoJSON } from "@/utils/ediParser";
import { parseEDIWithAPI } from "@/utils/apiClient";
import { FileUploader } from "@/components/FileUploader";
import { JsonViewer } from "@/components/JsonViewer";
import { Header } from "@/components/Header";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Index = () => {
  const [ediInput, setEdiInput] = useState<string>("");
  const [jsonOutput, setJsonOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [useAPI, setUseAPI] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleConvert = async () => {
    if (!ediInput.trim()) {
      setError("Please enter some EDI data");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (useAPI) {
        // Use the API endpoint
        const result = await parseEDIWithAPI(ediInput);
        setJsonOutput(JSON.stringify(result, null, 2));
      } else {
        // Use client-side parsing
        const result = parseEDItoJSON(ediInput);
        setJsonOutput(result);
      }
    } catch (err) {
      setError(useAPI 
        ? "API error: Failed to parse EDI data. Please check your input and try again." 
        : "Failed to parse EDI data. Please check your input and try again."
      );
      console.error("Parsing error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileContent = (content: string) => {
    setEdiInput(content);
    setError(null);
  };

  const clearAll = () => {
    setEdiInput("");
    setJsonOutput("");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">Input EDI Data</h2>
              <FileUploader onFileContent={handleFileContent} />
              <div className="mt-4">
                <Textarea 
                  placeholder="Or paste your EDI data here..." 
                  className="min-h-[250px] font-mono text-sm"
                  value={ediInput}
                  onChange={(e) => setEdiInput(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                <Switch 
                  id="useApi" 
                  checked={useAPI}
                  onCheckedChange={setUseAPI}
                />
                <Label htmlFor="useApi">Use API endpoint</Label>
              </div>
              
              {error && (
                <div className="mt-2 text-red-500 text-sm">{error}</div>
              )}
              <div className="mt-4 flex space-x-4">
                <Button 
                  className="bg-blue-800 hover:bg-blue-900 transition-colors"
                  onClick={handleConvert}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Convert to JSON"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearAll}
                  disabled={isLoading}
                >
                  Clear All
                </Button>
              </div>
            </Card>
          </div>

          {/* Output Section */}
          <div>
            <Card className="p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">JSON Output</h2>
              <JsonViewer json={jsonOutput} />
            </Card>
          </div>
        </div>
      </main>

      <footer className="container mx-auto p-8 text-center text-gray-600 border-t mt-12">
        <p>EDI JSON Alchemy - Convert EDI X12 to JSON with ease</p>
        {useAPI && <p className="text-sm mt-1">API Mode: Using server-side parser</p>}
      </footer>
    </div>
  );
};

export default Index;
