import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const minAttempts = searchParams.get("minAttempts");
    const maxAttempts = searchParams.get("maxAttempts");

    // Fetch users with their attempts count
    const { data: users, error } = await supabase
      .from("users") // Fix table name
      .select("name, email, attempts:attempts (id)") // Fix relation alias
      .ilike("name", `%${search}%`);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Ensure `users` is an array before mapping
    const processedUsers = Array.isArray(users)
      ? users.map((user) => ({
          name: user.name,
          email: user.email,
          attempts: user.attempts?.length || 0, // Count number of attempts
        }))
      : [];

    // Apply filters
    let filteredUsers = processedUsers;
    if (minAttempts) filteredUsers = filteredUsers.filter((u) => u.attempts >= +minAttempts);
    if (maxAttempts) filteredUsers = filteredUsers.filter((u) => u.attempts <= +maxAttempts);

    return NextResponse.json(filteredUsers, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
