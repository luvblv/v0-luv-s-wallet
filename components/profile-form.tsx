"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useUser } from "@/contexts/user-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, CreditCard, Check, X, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { BillingHistory } from "@/components/billing-history"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ProfileForm() {
  const { userName, setUserName } = useUser()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [dob, setDob] = useState<Date>()
  const [occupation, setOccupation] = useState<string>("")
  const [primaryInterest, setPrimaryInterest] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")
  const [currentPlan, setCurrentPlan] = useState("monthly")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Simulate fetching user data
  useEffect(() => {
    // In a real app, this would be an API call to get user profile
    const nameParts = userName.split(" ")
    if (nameParts.length > 0) {
      setFirstName(nameParts[0])
      if (nameParts.length > 1) {
        setLastName(nameParts.slice(1).join(" "))
      }
    }
    setEmail("user@example.com")
    setOccupation("employee") // Default value
    setPrimaryInterest("budgeting") // Default value
  }, [userName])

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to update profile
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the user name in context
      const fullName = `${firstName} ${lastName}`.trim()
      setUserName(fullName)

      // Show success message
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)

      toast({
        title: "Profile updated",
        description: "Your personal information has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to update payment info
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success message
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)

      toast({
        title: "Payment information updated",
        description: "Your payment details have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlanChange = async (plan: string) => {
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to update subscription
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setCurrentPlan(plan)

      toast({
        title: "Subscription updated",
        description: `You have successfully switched to the ${plan === "monthly" ? "Monthly" : "Annual"} plan.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tabs defaultValue="personal" className="w-full max-w-3xl mx-auto">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="personal" className="text-xs sm:text-sm">
          Personal Information
        </TabsTrigger>
        <TabsTrigger value="payment" className="text-xs sm:text-sm">
          Payment Methods
        </TabsTrigger>
        <TabsTrigger value="plan" className="text-xs sm:text-sm">
          Current Plan
        </TabsTrigger>
      </TabsList>

      <TabsContent value="personal">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Personal Information</CardTitle>
            <CardDescription>Update your personal details and preferences</CardDescription>
          </CardHeader>
          <form onSubmit={handlePersonalInfoSubmit}>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">What best describes you</Label>
                <Select value={occupation} onValueChange={setOccupation}>
                  <SelectTrigger id="occupation" className="w-full">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="founder">Founder/Small Business Owner</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary-interest">What is your primary interest</Label>
                <Select value={primaryInterest} onValueChange={setPrimaryInterest}>
                  <SelectTrigger id="primary-interest" className="w-full">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="saving">Saving</SelectItem>
                    <SelectItem value="budgeting">Budgeting</SelectItem>
                    <SelectItem value="debt">Handling Debt</SelectItem>
                    <SelectItem value="networth">Building Net Worth</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="dob"
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !dob && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dob ? format(dob, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dob}
                      onSelect={setDob}
                      initialFocus
                      captionLayout="dropdown-buttons"
                      fromYear={1940}
                      toYear={2023}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
            <CardFooter className="p-4 sm:p-6 pt-0 sm:pt-0">
              <Button type="submit" disabled={isLoading} className="ml-auto">
                {isLoading ? (
                  "Saving..."
                ) : isSaved ? (
                  <span className="flex items-center">
                    Saved <Check className="ml-2 h-4 w-4" />
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      <TabsContent value="payment">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Payment Methods</CardTitle>
            <CardDescription>Manage your payment methods and preferences</CardDescription>
          </CardHeader>
          <form onSubmit={handlePaymentInfoSubmit}>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0 sm:pt-0">
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem value="card" id="card" className="peer sr-only" />
                  <Label
                    htmlFor="card"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <CreditCard className="mb-3 h-6 w-6" />
                    Credit/Debit Card
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="apple" id="apple" className="peer sr-only" />
                  <Label
                    htmlFor="apple"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Smartphone className="mb-3 h-6 w-6" />
                    Apple Pay
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
                  <Label
                    htmlFor="paypal"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <CreditCard className="mb-3 h-6 w-6" />
                    PayPal
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-name">Name on Card</Label>
                    <Input
                      id="card-name"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "apple" && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-center mb-4">
                    <Smartphone className="h-12 w-12 text-primary" />
                  </div>
                  <p className="text-center text-sm text-muted-foreground mb-2">
                    To use Apple Pay, you'll need to add your card to Apple Wallet on your iOS device.
                  </p>
                  <p className="text-center text-sm text-muted-foreground">
                    When you complete your purchase, you'll be prompted to authorize the payment with Face ID, Touch ID,
                    or your passcode.
                  </p>
                </div>
              )}

              {paymentMethod === "paypal" && (
                <div className="space-y-2 mt-4">
                  <Label htmlFor="paypal-email">PayPal Email</Label>
                  <Input id="paypal-email" type="email" placeholder="your-email@example.com" />
                </div>
              )}
            </CardContent>
            <CardFooter className="p-4 sm:p-6 pt-0 sm:pt-0">
              <Button type="submit" disabled={isLoading} className="ml-auto">
                {isLoading ? (
                  "Saving..."
                ) : isSaved ? (
                  <span className="flex items-center">
                    Saved <Check className="ml-2 h-4 w-4" />
                  </span>
                ) : (
                  "Save Payment Method"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      <TabsContent value="plan">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Subscription Plan</CardTitle>
            <CardDescription>Manage your subscription and billing cycle</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Monthly Plan */}
              <div
                className={`border rounded-lg p-4 sm:p-6 ${currentPlan === "monthly" ? "border-primary ring-2 ring-primary ring-opacity-50" : ""}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold">Monthly Plan</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Billed monthly</p>
                  </div>
                  {currentPlan === "monthly" && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary text-xs">
                      Current Plan
                    </Badge>
                  )}
                </div>

                <div className="mb-4">
                  <span className="text-2xl sm:text-3xl font-bold">$9.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Unlimited transactions</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Connect up to 3 bank accounts</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Basic financial insights</span>
                  </li>
                  <li className="flex items-center">
                    <X className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm text-muted-foreground">Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <X className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm text-muted-foreground">Investment tracking</span>
                  </li>
                </ul>

                <Button
                  className="w-full"
                  variant={currentPlan === "monthly" ? "outline" : "default"}
                  disabled={currentPlan === "monthly" || isLoading}
                  onClick={() => handlePlanChange("monthly")}
                >
                  {currentPlan === "monthly" ? "Current Plan" : "Switch to Monthly"}
                </Button>
              </div>

              {/* Annual Plan */}
              <div
                className={`border rounded-lg p-4 sm:p-6 ${currentPlan === "annual" ? "border-primary ring-2 ring-primary ring-opacity-50" : ""}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold">Annual Plan</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Billed annually</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {currentPlan === "annual" && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary text-xs">
                        Current Plan
                      </Badge>
                    )}
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 text-xs">
                      Save 20%
                    </Badge>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-2xl sm:text-3xl font-bold">$95.88</span>
                  <span className="text-muted-foreground">/year</span>
                  <p className="text-xs sm:text-sm text-muted-foreground">$7.99/month, billed annually</p>
                </div>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Unlimited transactions</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Connect unlimited bank accounts</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Advanced financial insights</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Investment tracking</span>
                  </li>
                </ul>

                <Button
                  className="w-full"
                  variant={currentPlan === "annual" ? "outline" : "default"}
                  disabled={currentPlan === "annual" || isLoading}
                  onClick={() => handlePlanChange("annual")}
                >
                  {currentPlan === "annual" ? "Current Plan" : "Switch to Annual"}
                </Button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2 text-sm sm:text-base">Subscription Details</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                You are currently on the{" "}
                <span className="font-medium">{currentPlan === "monthly" ? "Monthly" : "Annual"}</span> plan.
                {currentPlan === "monthly"
                  ? " Your next billing date is May 15, 2025."
                  : " Your subscription will renew on April 15, 2026."}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                You can cancel or change your subscription at any time. Changes will take effect at the end of your
                current billing period.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between p-4 sm:p-6 pt-0 sm:pt-0 gap-2">
            <Button variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto">
              Cancel Subscription
            </Button>
            <BillingHistory />
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
