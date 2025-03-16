import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export default function FileUploader({ form }: { form: any }) {
  const [fileState, setFileState] = useState<"default" | "success" | "error">("default");
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Handle the dropped files
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Check if file is CSV
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        form.setValue("file", file, { shouldValidate: true });
        setFileState("success");
      } else {
        setFileState("error");
      }
    }
  }, [form]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });
  
  return (
    <FormField
      control={form.control}
      name="file"
      render={({ field: { onChange, value, ...field } }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-sm font-medium text-blue-700">CSV File</FormLabel>
          <FormControl>
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-primary bg-blue-50" : "border-blue-200 hover:border-primary"
              }`}
            >
              <input 
                {...getInputProps()}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.type === "text/csv" || file.name.endsWith(".csv")) {
                      onChange(file);
                      setFileState("success");
                    } else {
                      setFileState("error");
                    }
                  }
                }}
                {...field}
              />
              
              {/* Default State */}
              {fileState === "default" && (
                <div className="space-y-2">
                  <i className="fas fa-cloud-upload-alt text-4xl text-blue-400"></i>
                  <p className="text-blue-700">Drag & drop your CSV file here</p>
                  <p className="text-blue-500 text-sm">or click to browse</p>
                </div>
              )}
              
              {/* File Selected State */}
              {fileState === "success" && (
                <div className="space-y-2">
                  <i className="fas fa-file-csv text-4xl text-blue-600"></i>
                  <p className="text-blue-800 font-medium">
                    {value?.name || "File selected"}
                  </p>
                  <p className="text-blue-500 text-sm">
                    Click or drag another file to change
                  </p>
                </div>
              )}
              
              {/* Error State */}
              {fileState === "error" && (
                <div className="space-y-2">
                  <i className="fas fa-exclamation-circle text-4xl text-red-500"></i>
                  <p className="text-red-600 font-medium">Invalid file format</p>
                  <p className="text-slate-500 text-sm">
                    Please select a CSV file
                  </p>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage className="text-red-500 text-sm" />
        </FormItem>
      )}
    />
  );
}
