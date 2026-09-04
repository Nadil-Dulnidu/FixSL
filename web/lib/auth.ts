import { auth, currentUser } from "@clerk/nextjs/server";

export interface AdminAuthResult {
  userId: string | null;
  role: string | null;
  isAdmin: boolean;
}

/**
 * Robust admin authorization helper.
 * Extracts the user's role from sessionClaims (supports multiple JWT claim structures)
 * and falls back to fetching directly from Clerk's Backend API via currentUser().
 */
export async function getAdminAuth(): Promise<AdminAuthResult> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return { userId: null, role: null, isAdmin: false };
  }

  // 1. Try sessionClaims.metadata.role (Default recommended template structure)
  const metadataRole = (sessionClaims?.metadata as Record<string, unknown>)?.role;
  if (typeof metadataRole === "string" && metadataRole) {
    return { userId, role: metadataRole, isAdmin: metadataRole === "admin" };
  }

  // 2. Try root sessionClaims.role
  if (typeof sessionClaims?.role === "string" && sessionClaims.role) {
    return { userId, role: sessionClaims.role, isAdmin: sessionClaims.role === "admin" };
  }

  // 3. Try sessionClaims.publicMetadata.role
  const publicMetaRole = (sessionClaims?.publicMetadata as Record<string, unknown>)?.role;
  if (typeof publicMetaRole === "string" && publicMetaRole) {
    return { userId, role: publicMetaRole, isAdmin: publicMetaRole === "admin" };
  }

  // 4. Try sessionClaims.public_metadata.role
  const publicMetaSnakeRole = (sessionClaims?.public_metadata as Record<string, unknown>)?.role;
  if (typeof publicMetaSnakeRole === "string" && publicMetaSnakeRole) {
    return { userId, role: publicMetaSnakeRole, isAdmin: publicMetaSnakeRole === "admin" };
  }

  // 5. Try custom template namespace if named (e.g. sessionClaims.FixSL.role)
  const templateObj = (sessionClaims as Record<string, unknown>)?.[ "FixSL" ] as Record<string, unknown> | undefined;
  if (templateObj && typeof templateObj.role === "string") {
    return { userId, role: templateObj.role, isAdmin: templateObj.role === "admin" };
  }

  // 6. Direct Backend Fallback: Fetch User directly from Clerk API
  try {
    const user = await currentUser();
    const directRole =
      ((user?.publicMetadata as Record<string, unknown>)?.role as string | undefined) ||
      ((user?.unsafeMetadata as Record<string, unknown>)?.role as string | undefined);

    if (typeof directRole === "string" && directRole) {
      return { userId, role: directRole, isAdmin: directRole === "admin" };
    }
  } catch {
    // If backend fetch fails, proceed with undefined role
  }

  return { userId, role: null, isAdmin: false };
}
