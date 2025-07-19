"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud } from "lucide-react";

export function FileUpload({ onFileUpload, setIsLoadingFile }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const { toast } = useToast();

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (
        file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload an .xls or .xlsx file.",
          variant: "destructive",
        });
        setSelectedFile(null);
        event.target.value = ""; 
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select an Excel file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingFile(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result;
        if (!arrayBuffer) {
          throw new Error("Failed to read file.");
        }
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const headersRaw = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
        const headers = headersRaw.map(String); 

        const data = XLSX.utils.sheet_to_json(worksheet);
        
        const csvString = XLSX.utils.sheet_to_csv(worksheet);

        onFileUpload(data, headers, csvString);
        toast({
          title: "File Uploaded Successfully",
          description: `${selectedFile.name} has been processed.`,
        });
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        toast({
          title: "Error Processing File",
          description:
            "There was an error parsing the Excel file. Please ensure it's a valid format.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingFile(false);
      }
    };

    reader.onerror = () => {
      console.error("FileReader error");
      toast({
        title: "File Read Error",
        description: "Could not read the selected file.",
        variant: "destructive",
      });
      setIsLoadingFile(false);
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="excel-file" className="text-base font-semibold">Upload Excel File</Label>
        <p className="text-sm text-muted-foreground">
          Select an .xls or .xlsx file to analyze.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <Input
          id="excel-file"
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFileChange}
          className="flex-grow text-sm"
        />
        <Button onClick={handleUpload} disabled={!selectedFile} className="w-full sm:w-auto">
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload and Process
        </Button>
      </div>
    </div>
  );
}
