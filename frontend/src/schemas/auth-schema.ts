import * as z from "zod"

export const loginSchema = z.object({
  email: z.email({ message: "Insira um e-mail válido" }),
  password: z.string().min(6, { message: "A senha é obrigatória" }),
})

export const registerSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  email: z.email({ message: "Insira um e-mail válido" }),
  password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>