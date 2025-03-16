import ConverterForm from "@/components/csv-converter/converter-form";

export default function Home() {
  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        {/* App Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">CSV Converter</h1>
          <p className="text-slate-600 mt-2">Convert your CSV files with ease</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <ConverterForm />
        </div>
        
        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-slate-500">
          <p>Need help? <a href="#" className="text-primary hover:text-blue-700">Check our guide</a> or <a href="#" className="text-primary hover:text-blue-700">contact support</a>.</p>
        </div>
      </div>
    </div>
  );
}
