/**
 * Generates a random email address for testing
 * @returns A unique email address
 */
export function generateTestEmail(): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  return `test.${randomString}.${timestamp}@example.com`
}

/**
 * Generates random test user data
 * @returns Object with test user data
 */
export function generateTestUser() {
  return {
    name: `Test User ${Math.random().toString(36).substring(2, 8)}`,
    email: generateTestEmail(),
    age: Math.floor(Math.random() * 50) + 18, // Random age between 18-67
  }
}

