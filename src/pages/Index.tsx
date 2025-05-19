
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
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Index = () => {
  const [ediInput, setEdiInput] = useState<string>("");
  const [jsonOutput, setJsonOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [useAPI, setUseAPI] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [segmentDelimiter, setSegmentDelimiter] = useState<string>("");
  const [elementDelimiter, setElementDelimiter] = useState<string>("");
  const [customDelimiters, setCustomDelimiters] = useState<boolean>(false);
  
  const predefinedSegmentDelimiters = ["~", "\n", "|", "^"];
  const predefinedElementDelimiters = ["*", "|", ",", ":", "^"];

  const handleConvert = async () => {
    if (!ediInput.trim()) {
      setError("Please enter some EDI data");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // Determine which delimiters to use
    const finalSegmentDelimiter = customDelimiters && segmentDelimiter ? segmentDelimiter : undefined;
    const finalElementDelimiter = customDelimiters && elementDelimiter ? elementDelimiter : undefined;

    try {
      if (useAPI) {
        // Use the API endpoint with delimiter parameters
        const result = await parseEDIWithAPI(
          ediInput, 
          finalSegmentDelimiter,
          finalElementDelimiter
        );
        setJsonOutput(JSON.stringify(result, null, 2));
      } else {
        // Use client-side parsing with delimiter parameters
        const result = parseEDItoJSON(
          ediInput,
          finalSegmentDelimiter,
          finalElementDelimiter
        );
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
    setSegmentDelimiter("");
    setElementDelimiter("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">输入 EDI 数据</h2>
              <FileUploader onFileContent={handleFileContent} />
              <div className="mt-4">
                <Textarea 
                  placeholder="或在此处粘贴您的 EDI 数据..." 
                  className="min-h-[250px] font-mono text-sm"
                  value={ediInput}
                  onChange={(e) => setEdiInput(e.target.value)}
                />
              </div>
              
              {/* Delimiter Configuration */}
              <div className="mt-4 border-t pt-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Switch 
                    id="useCustomDelimiters" 
                    checked={customDelimiters}
                    onCheckedChange={setCustomDelimiters}
                  />
                  <Label htmlFor="useCustomDelimiters">自定义分隔符</Label>
                </div>
                
                {customDelimiters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="segmentDelimiter">段分隔符</Label>
                      <div className="flex gap-2">
                        <Input
                          id="segmentDelimiter"
                          value={segmentDelimiter}
                          onChange={(e) => setSegmentDelimiter(e.target.value)}
                          placeholder="例如: ~"
                          className="flex-1"
                          maxLength={1}
                        />
                        <Select onValueChange={setSegmentDelimiter}>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="预设" />
                          </SelectTrigger>
                          <SelectContent>
                            {predefinedSegmentDelimiters.map((delim, idx) => (
                              <SelectItem key={idx} value={delim}>
                                {delim === "\n" ? "换行符" : delim}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="elementDelimiter">元素分隔符</Label>
                      <div className="flex gap-2">
                        <Input
                          id="elementDelimiter"
                          value={elementDelimiter}
                          onChange={(e) => setElementDelimiter(e.target.value)}
                          placeholder="例如: *"
                          className="flex-1"
                          maxLength={1}
                        />
                        <Select onValueChange={setElementDelimiter}>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="预设" />
                          </SelectTrigger>
                          <SelectContent>
                            {predefinedElementDelimiters.map((delim, idx) => (
                              <SelectItem key={idx} value={delim}>{delim}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                <Switch 
                  id="useApi" 
                  checked={useAPI}
                  onCheckedChange={setUseAPI}
                />
                <Label htmlFor="useApi">使用 API 端点</Label>
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
                  {isLoading ? "处理中..." : "转换为 JSON"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearAll}
                  disabled={isLoading}
                >
                  清除所有
                </Button>
              </div>
            </Card>
          </div>

          {/* Output Section */}
          <div>
            <Card className="p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">JSON 输出</h2>
              <JsonViewer json={jsonOutput} />
            </Card>
          </div>
        </div>
      </main>

      <footer className="container mx-auto p-8 text-center text-gray-600 border-t mt-12">
        <p>EDI JSON Alchemy - 轻松转换 EDI X12 到 JSON</p>
        {useAPI && <p className="text-sm mt-1">API 模式: 使用服务器端解析器</p>}
        {customDelimiters && (
          <p className="text-sm mt-1">
            自定义分隔符: 段分隔符 [{segmentDelimiter || '自动检测'}], 元素分隔符 [{elementDelimiter || '自动检测'}]
          </p>
        )}
      </footer>
    </div>
  );
};

export default Index;
