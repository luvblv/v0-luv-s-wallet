import type { Metadata } from "next"
import { ProfileForm } from "@/components/profile-form"

export const metadata: Metadata = {
  title: "Profile | Personal Wallet",
  description: "Manage your profile and account settings",
}

export default function ProfilePage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Profile Settings</h1>
      <ProfileForm />
    </div>
  )
}
