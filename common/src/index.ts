import z from "zod";

export const signupinput=z.object({
	username:z.string().email(),
	password:z.string().min(6),
	name:z.string().optional()
})

//type inference in zod ->good for frontend developer
export type SignupInput=z.infer<typeof signupinput>

export const signinInput=z.object({
    username:z.string().email(),
	password:z.string().min(6),
})

export type SigninInput=z.infer<typeof signinInput>

export const createBlogInput=z.object({
    title:z.string(),
    content:z.string(),
})

export type CreateBlogInput=z.infer<typeof createBlogInput>

export const updateBlogInput=z.object({
    title:z.string(),
    content:z.string(),
    id:z.number()
})

export type UpdateBlogInput=z.infer<typeof updateBlogInput>



