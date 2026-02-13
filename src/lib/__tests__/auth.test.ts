// @vitest-environment node
import { test, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

const mockCookieStore = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
};
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}));

const { createSession, getSession } = await import("@/lib/auth");

beforeEach(() => {
  vi.clearAllMocks();
});

test("createSession sets an httpOnly auth cookie", async () => {
  await createSession("user-123", "test@example.com");

  expect(mockCookieStore.set).toHaveBeenCalledTimes(1);
  const [name, token, options] = mockCookieStore.set.mock.calls[0];

  expect(name).toBe("auth-token");
  expect(typeof token).toBe("string");
  expect(token.length).toBeGreaterThan(0);
  expect(options.httpOnly).toBe(true);
  expect(options.sameSite).toBe("lax");
  expect(options.path).toBe("/");
});

test("createSession sets cookie expiry to 7 days", async () => {
  await createSession("user-123", "test@example.com");

  const options = mockCookieStore.set.mock.calls[0][2];
  expect(options.expires).toBeInstanceOf(Date);
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const diff = options.expires.getTime() - Date.now();
  expect(diff).toBeGreaterThan(sevenDaysMs - 5000);
  expect(diff).toBeLessThanOrEqual(sevenDaysMs);
});

test("createSession produces a valid JWT containing userId and email", async () => {
  const { jwtVerify } = await import("jose");
  const secret = new TextEncoder().encode("development-secret-key");

  await createSession("user-456", "hello@example.com");

  const token = mockCookieStore.set.mock.calls[0][1];
  const { payload } = await jwtVerify(token, secret);

  expect(payload.userId).toBe("user-456");
  expect(payload.email).toBe("hello@example.com");
});

test("getSession returns payload from a valid token", async () => {
  await createSession("user-789", "session@example.com");
  const token = mockCookieStore.set.mock.calls[0][1];
  mockCookieStore.get.mockReturnValue({ value: token });

  const session = await getSession();
  expect(session).not.toBeNull();
  expect(session!.userId).toBe("user-789");
  expect(session!.email).toBe("session@example.com");
});

test("getSession returns null when no cookie exists", async () => {
  mockCookieStore.get.mockReturnValue(undefined);

  const session = await getSession();
  expect(session).toBeNull();
});

test("getSession returns null for an invalid token", async () => {
  mockCookieStore.get.mockReturnValue({ value: "not-a-valid-jwt" });

  const session = await getSession();
  expect(session).toBeNull();
});
