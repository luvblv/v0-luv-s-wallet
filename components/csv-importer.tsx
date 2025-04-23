"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileUp, AlertCircle, Check, FileText } from "lucide-react"
import Papa from "papaparse"

interface CsvImporterProps {
  onImport: (data: any[]) => void
}

export function CsvImporter({ onImport }: CsvImporterProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any[]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [headers, setHeaders] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [importStep, setImportStep] = useState<"upload" | "map" | "confirm">("upload")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const requiredFields = ["date", "description", "amount"]
  const fieldOptions = [
    { value: "date", label: "Date" },
    { value: "description", label: "Description" },
    { value: "amount", label: "Amount" },
    { value: "category", label: "Category" },
    { value: "account", label: "Account" },
    { value: "type", label: "Type" },
    { value: "notes", label: "Notes" },
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const selectedFile = e.target.files?.[0]

    if (!selectedFile) {
      return
    }

    if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
      setError("Please upload a CSV file")
      return
    }

    setFile(selectedFile)
    parseCSV(selectedFile)
  }

  const parseCSV = (file: File) => {
    setIsLoading(true)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length === 0) {
          setError("The CSV file appears to be empty")
          setIsLoading(false)
          return
        }

        // Get headers from the first row
        const headers = Object.keys(results.data[0])
        setHeaders(headers)

        // Create initial mapping by trying to match headers to required fields
        const initialMapping: Record<string, string> = {}
        headers.forEach((header) => {
          const lowerHeader = header.toLowerCase()

          if (lowerHeader.includes("date")) {
            initialMapping[header] = "date"
          } else if (
            lowerHeader.includes("desc") ||
            lowerHeader.includes("narration") ||
            lowerHeader.includes("memo")
          ) {
            initialMapping[header] = "description"
          } else if (lowerHeader.includes("amount") || lowerHeader.includes("sum") || lowerHeader.includes("value")) {
            initialMapping[header] = "amount"
          } else if (lowerHeader.includes("categ")) {
            initialMapping[header] = "category"
          } else if (lowerHeader.includes("account") || lowerHeader.includes("acc")) {
            initialMapping[header] = "account"
          } else if (lowerHeader.includes("type") || lowerHeader.includes("transaction")) {
            initialMapping[header] = "type"
          } else if (lowerHeader.includes("note")) {
            initialMapping[header] = "notes"
          }
        })

        setMapping(initialMapping)
        setPreview(results.data.slice(0, 5))
        setImportStep("map")
        setIsLoading(false)
      },
      error: (error) => {
        setError(`Error parsing CSV: ${error.message}`)
        setIsLoading(false)
      },
    })
  }

  const handleMappingChange = (header: string, value: string) => {
    setMapping((prev) => ({
      ...prev,
      [header]: value,
    }))
  }

  const handleImport = () => {
    if (!file) return

    // Check if all required fields are mapped
    const mappedFields = Object.values(mapping)
    const missingRequiredFields = requiredFields.filter((field) => !mappedFields.includes(field))

    if (missingRequiredFields.length > 0) {
      setError(`Missing required fields: ${missingRequiredFields.join(", ")}`)
      return
    }

    setIsLoading(true)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Transform data based on mapping
        const transformedData = results.data.map((row: any) => {
          const transformedRow: Record<string, any> = {}

          Object.entries(mapping).forEach(([header, field]) => {
            if (field && row[header] !== undefined) {
              transformedRow[field] = row[header]
            }
          })

          // Ensure amount is a number
          if (transformedRow.amount) {
            // Remove currency symbols and commas
            const cleanedAmount = transformedRow.amount
              .toString()
              .replace(/[$,£€]/g, "")
              .trim()
            transformedRow.amount = Number.parseFloat(cleanedAmount)

            // If parsing fails, set to 0
            if (isNaN(transformedRow.amount)) {
              transformedRow.amount = 0
            }
          }

          return transformedRow
        })

        onImport(transformedData)
        setImportStep("confirm")
        setIsLoading(false)
      },
      error: (error) => {
        setError(`Error importing CSV: ${error.message}`)
        setIsLoading(false)
      },
    })
  }

  const resetImport = () => {
    setFile(null)
    setPreview([])
    setMapping({})
    setHeaders([])
    setError(null)
    setImportStep("upload")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {importStep === "upload" && (
        <div className="border-2 border-dashed rounded-lg p-6 text-center">
          <FileUp className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-medium mb-2">Upload CSV File</h3>
          <p className="text-sm text-muted-foreground mb-4">Drag and drop your CSV file here, or click to browse</p>
          <Input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-upload"
          />
          <Button onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
            {isLoading ? "Processing..." : "Select CSV File"}
          </Button>

          <div className="mt-6 text-xs text-muted-foreground">
            <p className="mb-1">Supported formats:</p>
            <p>• Bank statement exports (.csv)</p>
            <p>• Credit card statement exports (.csv)</p>
            <p>• Financial software exports (.csv)</p>
          </div>
        </div>
      )}

      {importStep === "map" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium">Map CSV Columns</h3>
              <p className="text-sm text-muted-foreground">Match your CSV columns to the appropriate fields</p>
            </div>
            <div className="flex items-center text-sm">
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              {file?.name}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {headers.map((header) => (
              <div key={header} className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                <div className="text-sm font-medium">{header}</div>
                <Select value={mapping[header] || ""} onValueChange={(value) => handleMappingChange(header, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ignore">Ignore this column</SelectItem>
                    {fieldOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label} {requiredFields.includes(option.value) ? "(Required)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <Card className="mb-4">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2 text-sm">Preview (First 5 rows)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr>
                      {headers.map((header) => (
                        <th key={header} className="border p-1 bg-muted text-left">
                          {header}
                          {mapping[header] && (
                            <span className="block text-xs text-muted-foreground">→ {mapping[header]}</span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i}>
                        {headers.map((header) => (
                          <td key={`${i}-${header}`} className="border p-1">
                            {row[header]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <Button variant="outline" onClick={resetImport} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={isLoading}>
              {isLoading ? "Processing..." : "Import Data"}
            </Button>
          </div>
        </div>
      )}

      {importStep === "confirm" && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">Import Successful!</h3>
          <p className="text-muted-foreground mb-6">Your data has been successfully imported.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button onClick={resetImport}>Import Another File</Button>
          </div>
        </div>
      )}
    </div>
  )
}
