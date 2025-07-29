"use server"

export async function updateProfile(formData: FormData) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const bio = formData.get("bio") as string

  // In a real app, you would save to database here
  console.log("Profile updated:", { name, email, bio })

  return {
    success: true,
    message: "Profile updated successfully!",
  }
}

export async function updateNotifications(formData: FormData) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const notifications = {
    email: formData.get("email") === "on",
    push: formData.get("push") === "on",
    marketing: formData.get("marketing") === "on",
    security: formData.get("security") === "on",
  }

  // In a real app, you would save to database here
  console.log("Notifications updated:", notifications)

  return {
    success: true,
    message: "Notification preferences updated!",
  }
}
