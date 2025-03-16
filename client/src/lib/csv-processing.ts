/**
 * Processes a CSV file with the given wallet address and triggers a download
 * This is a client-side utility function for local CSV processing if needed
 */
export async function processAndDownloadCsv(file: File, walletAddress: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csvContent = event.target?.result as string;
        if (!csvContent) {
          reject(new Error("Failed to read CSV file"));
          return;
        }
        
        // Process the CSV content
        const processedCsv = addWalletAddressToCSV(csvContent, walletAddress);
        
        // Create a Blob and download it
        const blob = new Blob([processedCsv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `converted_${file.name}`;
        
        // Trigger download
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error reading the file"));
    };
    
    // Start reading the file
    reader.readAsText(file);
  });
}

/**
 * Adds wallet address to each row of a CSV file
 */
function addWalletAddressToCSV(csvContent: string, walletAddress: string): string {
  // Split the content into lines
  const lines = csvContent.split(/\r?\n/);
  
  if (lines.length === 0) {
    return "walletAddress\n" + walletAddress;
  }
  
  // Get the header
  const header = lines[0];
  
  // Add walletAddress to the header if it doesn't exist
  const newHeader = header.includes("walletAddress") 
    ? header 
    : header + ",walletAddress";
  
  // Process each data row
  const newLines = [newHeader];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      // Add wallet address to the end of each line
      const newLine = header.includes("walletAddress") 
        ? line // If walletAddress column exists, we'd need to update it, but for simplicity we keep as is
        : line + "," + walletAddress;
      
      newLines.push(newLine);
    }
  }
  
  return newLines.join("\n");
}
