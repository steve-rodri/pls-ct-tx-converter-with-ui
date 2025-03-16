import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { apiRequest } from "@/lib/queryClient"
import { csvConversionSchema } from "@shared/schema"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import WalletInput from "@/components/csv-converter/wallet-input"
import FileUploader from "@/components/csv-converter/file-uploader"
import Notification from "@/components/csv-converter/notification"
import { processAndDownloadCsv } from "@/lib/csv-processing"

export default function ConverterForm() {
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [showErrorNotification, setShowErrorNotification] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const form = useForm({
    resolver: zodResolver(csvConversionSchema),
    defaultValues: {
      walletAddress: "",
      file: undefined,
    },
  })

  const convertMutation = useMutation({
    mutationFn: async (data: FormData) => {
      // We can't use the apiRequest helper directly because it sets JSON content type
      // For FormData, we need to let the browser set the content type with boundary
      const response = await fetch("/api/convert-csv", {
        method: "POST",
        body: data,
        credentials: "include",
      })

      if (!response.ok) {
        const text = (await response.text()) || response.statusText
        throw new Error(`${response.status}: ${text}`)
      }

      return response
    },
    onSuccess: async (response) => {
      try {
        const blob = await response.blob()
        const filename =
          response.headers
            .get("Content-Disposition")
            ?.split("filename=")[1]
            ?.replace(/"/g, "") || "converted.csv"

        // Create a download link and trigger it
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        // Show success notification
        setShowSuccessNotification(true)
        setTimeout(() => setShowSuccessNotification(false), 5000)

        // Reset form
        form.reset()
      } catch (error) {
        console.error("Error downloading file:", error)
        setErrorMessage("Error downloading the converted file")
        setShowErrorNotification(true)
      }
    },
    onError: (error: any) => {
      console.error("Error converting CSV:", error)
      setErrorMessage(
        error.message || "Failed to process CSV file. Please try again.",
      )
      setShowErrorNotification(true)
    },
  })

  const onSubmit = (values: any) => {
    // Hide any previous notifications
    setShowSuccessNotification(false)
    setShowErrorNotification(false)

    // Create FormData to send file
    const formData = new FormData()
    formData.append("walletAddress", values.walletAddress)
    formData.append("file", values.file)

    // Send to server
    convertMutation.mutate(formData)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <WalletInput form={form} />
          <FileUploader form={form} />

          {/* Submit Button */}
          <div>
            {convertMutation.isPending ? (
              <Button
                disabled
                className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-medium"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-medium hover:from-purple-700 hover:to-fuchsia-700 transition-all"
              >
                Convert & Download
              </Button>
            )}
          </div>
        </form>
      </Form>

      {/* Notifications */}
      {showSuccessNotification && (
        <Notification
          type="success"
          title="Success!"
          message="Your CSV file has been converted and downloaded successfully."
        />
      )}

      {showErrorNotification && (
        <Notification type="error" title="Error" message={errorMessage} />
      )}
    </>
  )
}
