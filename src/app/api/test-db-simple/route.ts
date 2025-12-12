import { db } from "@/db";
import { users } from "@/db/schema/user";

export async function GET() {
  try {
    // Test database connection
    const result = await db.select().from(users).limit(1);
    
    return Response.json({
      success: true,
      message: "Database connection successful",
      count: result.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return Response.json({
      success: false,
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
