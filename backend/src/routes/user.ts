import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { env } from 'hono/adapter'
import { sign } from 'hono/jwt'
import { signinInput, signupinput } from "@kushagra2809/common";


export const userRouter=new Hono<{
	Bindings:{
		DATABASE_URL: string,
		JWT_SECRET: string,
	  }
}>();



userRouter.post('/signup', async (c) => {
	const body=await c.req.json();
	const { success }=signupinput.safeParse(body);
	if(!success){
		c.status(411);
	}  
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	
	try {
		const user = await prisma.user.create({
			data: {
				username:body.username,
				password: body.password
			}
		});
		const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
		return c.json({ jwt });
	} catch(e) { 
		c.status(403);
		return c.json({ error: "error while signing up" });
	}
})


userRouter.post('/api/v1/signin', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());



	const body = await c.req.json();
	const {success}=signinInput.safeParse(body);
	const user = await prisma.user.findUnique({
		where: {
			username: body.username
		}
	});

	if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}

	const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({ jwt });
})