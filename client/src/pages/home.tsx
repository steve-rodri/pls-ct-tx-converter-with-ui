import ConverterForm from "@/components/csv-converter/converter-form";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        {/* App Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 text-transparent bg-clip-text">
            PulseChain to Coin Tracker
          </h1>
          <p className="text-blue-700 mt-2">
            Converts your PulseChain wallet transaction history downloaded from
            the explorer into a CSV file that can be uploaded to Coin Tracker
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 border border-blue-200">
          <ConverterForm />
        </div>
        
        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-blue-600">
          <p>Need help? <a href="#" className="text-primary hover:text-blue-800 font-medium">Check our guide</a> or <a href="#" className="text-primary hover:text-blue-800 font-medium">contact support</a>.</p>
        </div>
      </div>
    </div>
  );
}
