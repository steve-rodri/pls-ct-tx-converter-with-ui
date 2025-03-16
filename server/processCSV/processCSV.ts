import { parse } from "csv-parse"
import { stringify } from "csv-stringify/sync"
import { convertTransaction } from "./convertTransaction"
import type { PulseTransaction } from "./interfaces/PulseTransaction"
import type { CoinTrackerRow } from "./interfaces/CoinTrackerRow"
import { Readable } from "stream"

export async function processCsvFile(
  buffer: Buffer,
  walletAddress: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const transactions: PulseTransaction[] = []
    const parser = parse({ columns: true, trim: true })

    // Create a readable stream from the buffer
    const stream = Readable.from(buffer)

    // Parse the CSV file
    stream
      .pipe(parser)
      .on("data", (row) => {
        transactions.push(row as PulseTransaction)
      })
      .on("error", (error) => {
        reject(error)
      })
      .on("end", () => {
        try {
          console.log(`Parsed ${transactions.length} transactions.`)
          const coinTrackerRows: CoinTrackerRow[] = transactions.map((row) =>
            convertTransaction(row, walletAddress),
          )
          const result = stringify(coinTrackerRows, { header: true })
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
  })
}
