import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, getDocFromServer, getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
] as const;

const app = initializeApp(firebaseConfig);
const databaseId =
  (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId ||
  'ai-studio-078ec46e-5338-4745-a87d-5cb74cf9bf1c';
export const db = getFirestore(app, databaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
for (const scope of WORKSPACE_SCOPES) {
  googleProvider.addScope(scope);
}
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Strict in-memory cache for Google Workspace OAuth access tokens (never localStorage/sessionStorage)
let cachedWorkspaceToken: string | null = null;
let isSigningInWorkspace = false;

onAuthStateChanged(auth, (user) => {
  if (!user && !isSigningInWorkspace) {
    cachedWorkspaceToken = null;
  }
});

export async function signInWithGoogleWorkspace(): Promise<{
  user: User;
  accessToken: string | null;
}> {
  isSigningInWorkspace = true;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedWorkspaceToken = credential?.accessToken ?? null;
    return {
      user: result.user,
      accessToken: cachedWorkspaceToken,
    };
  } finally {
    isSigningInWorkspace = false;
  }
}

export function getWorkspaceAccessToken(): string | null {
  return cachedWorkspaceToken;
}

export function hasWorkspaceAccessToken(): boolean {
  return Boolean(cachedWorkspaceToken);
}

export function clearWorkspaceToken(): void {
  cachedWorkspaceToken = null;
}

export async function signOutWorkspace(): Promise<void> {
  cachedWorkspaceToken = null;
  await signOut(auth);
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

void testConnection();
