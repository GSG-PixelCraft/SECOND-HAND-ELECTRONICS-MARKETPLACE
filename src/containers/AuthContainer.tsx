// // Smart component - Handles auth logic
// import { useAuth } from '@/hooks/queries'
// import { LoginForm } from '@/components/forms'

// export const AuthContainer = ({ mode }) => {
//   const { login, register, isLoading } = useAuth()

//   const handleSubmit = (data) => {
//     if (mode === 'login') {
//       login(data)    // 👈 Logic
//     } else {
//       register(data) // 👈 Logic
//     }
//   }

//   // 👇 بمرر كل شي للـ Form
//   return <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
// }
