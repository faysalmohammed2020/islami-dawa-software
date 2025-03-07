import prisma from "../../../../prisma/prisma";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { email, password, role } = await req.json();

    if (!email || !password || !role) {
      return new Response("All fields are required", { status: 400 });
    }

    // Find the user by email and role
    const newUser = await prisma.newUser.findFirst({
      where: { email, role },
    });

    if (!newUser || !(await bcrypt.compare(password, newUser.password))) {
      return new Response("Invalid credentials", { status: 401 });
    }

    // Successful login: return user info without password
    return new Response(
      JSON.stringify({
        message: `Welcome ${role}!`,
        newUser: { id: newUser.id, fullName: newUser.fullName, role: newUser.role },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response("An error occurred", { status: 500 });
  }
}

export async function GET(req) {
  try {
    const users = await prisma.newUser.findMany();
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response("Error fetching users", { status: 500 });
  }
}
