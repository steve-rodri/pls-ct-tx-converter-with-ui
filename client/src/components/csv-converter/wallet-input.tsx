import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function WalletInput({ form }: { form: any }) {
  return (
    <FormField
      control={form.control}
      name="walletAddress"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-sm font-medium text-purple-700">Wallet Address</FormLabel>
          <FormControl>
            <Input 
              placeholder="Enter your PulseChain wallet address" 
              className="w-full px-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              {...field} 
            />
          </FormControl>
          <FormMessage className="text-red-500 text-sm" />
        </FormItem>
      )}
    />
  );
}
