"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlaidLink } from "@/components/plaid-link"
import { CsvImporter } from "@/components/csv-importer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BanknoteIcon as Bank, FileSpreadsheet, Lock, Shield } from "lucide-react"
import Link from "next/link"

export function ConnectAccountsPage() {
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([])
  const [importedData, setImportedData] = useState<any[]>([])

  const handlePlaidSuccess = (accounts: any[]) => {
    setConnectedAccounts([...connectedAccounts, ...accounts])
  }

  const handleCsvImport = (data: any[]) => {
    setImportedData([...importedData, ...data])
  }

  return (
    <div className="container py-4 sm:py-6 px-4 sm:px-6">
      <div className="flex items-center mb-6">
        <Link href="/dashboard" className="mr-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold">Connect Your Accounts</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardHeader className="pb-2">
            <Bank className="h-8 w-8 text-blue-500 mb-2" />
            <CardTitle>Bank Connection</CardTitle>
            <CardDescription>Securely connect your bank accounts for automatic transaction syncing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Shield className="h-4 w-4 mr-2 text-green-500" />
              Bank-level security
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Lock className="h-4 w-4 mr-2 text-green-500" />
              Read-only access
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
          <CardHeader className="pb-2">
            <FileSpreadsheet className="h-8 w-8 text-green-500 mb-2" />
            <CardTitle>CSV Import</CardTitle>
            <CardDescription>Import transaction data from CSV files exported from your bank</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Shield className="h-4 w-4 mr-2 text-green-500" />
              Maximum privacy
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Lock className="h-4 w-4 mr-2 text-green-500" />
              Data stays on your device
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle>Why Connect?</CardTitle>
            <CardDescription>Connecting your accounts helps you get the most out of Finance Tracker</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">• Automatic transaction categorization</p>
            <p className="text-sm text-muted-foreground">• Real-time balance updates</p>
            <p className="text-sm text-muted-foreground">• Personalized financial insights</p>
            <p className="text-sm text-muted-foreground">• Accurate spending analysis</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="connect" className="space-y-4">
        <TabsList>
          <TabsTrigger value="connect">Connect Bank</TabsTrigger>
          <TabsTrigger value="import">Import CSV</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>

        <TabsContent value="connect" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Bank Accounts</CardTitle>
              <CardDescription>
                Securely connect your bank accounts using Plaid. We never store your login credentials.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-w-md mx-auto">
                <PlaidLink onSuccess={handlePlaidSuccess} />
              </div>

              {connectedAccounts.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Connected Accounts</h3>
                  <div className="border rounded-md divide-y">
                    {connectedAccounts.map((account, index) => (
                      <div key={index} className="p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{account.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {account.mask ? `••••${account.mask}` : account.id}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${account.balances?.current.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            {account.type} • {account.subtype}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import Transactions from CSV</CardTitle>
              <CardDescription>
                Import your transaction data from a CSV file exported from your bank or financial institution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CsvImporter onImport={handleCsvImport} />

              {importedData.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Imported Data</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Successfully imported {importedData.length} transactions.
                  </p>
                  <Button variant="outline" size="sm">
                    View Imported Transactions
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Account Setup</CardTitle>
              <CardDescription>
                Manually add your accounts and track your finances without connecting to your bank.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Prefer to track your finances manually? You can add accounts and transactions yourself.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Button>Add Account</Button>
                  <Button variant="outline">Add Transaction</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
