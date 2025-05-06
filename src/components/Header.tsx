
import { FileJson } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-blue-800 text-white">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileJson className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">EDI JSON Alchemy</h1>
              <p className="text-blue-200">Convert X12 EDI to JSON effortlessly</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
