import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Education Center | Personal Wallet",
  description: "Learn about personal finance, investing, and money management",
}

export default function EducationCenterPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Education Center</h1>
      <p className="text-muted-foreground mb-6">
        Welcome to the Education Center, your resource for learning about personal finance, investing, and money
        management strategies.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-2">Budgeting Basics</h2>
          <p className="text-muted-foreground mb-4">
            Learn the fundamentals of creating and maintaining a budget that works for your lifestyle.
          </p>
          <a href="#" className="text-primary hover:underline">
            Read more →
          </a>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-2">Investing 101</h2>
          <p className="text-muted-foreground mb-4">
            Understand the basics of investing, from stocks and bonds to mutual funds and ETFs.
          </p>
          <a href="#" className="text-primary hover:underline">
            Read more →
          </a>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-2">Debt Management</h2>
          <p className="text-muted-foreground mb-4">
            Strategies for managing and eliminating debt to improve your financial health.
          </p>
          <a href="#" className="text-primary hover:underline">
            Read more →
          </a>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-2">Retirement Planning</h2>
          <p className="text-muted-foreground mb-4">
            Plan for a secure retirement with strategies for long-term savings and investments.
          </p>
          <a href="#" className="text-primary hover:underline">
            Read more →
          </a>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-2">Tax Optimization</h2>
          <p className="text-muted-foreground mb-4">
            Learn how to legally minimize your tax burden and maximize your after-tax income.
          </p>
          <a href="#" className="text-primary hover:underline">
            Read more →
          </a>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-2">Financial Glossary</h2>
          <p className="text-muted-foreground mb-4">
            A comprehensive glossary of financial terms to help you understand complex concepts.
          </p>
          <a href="#" className="text-primary hover:underline">
            Read more →
          </a>
        </div>
      </div>
    </div>
  )
}
