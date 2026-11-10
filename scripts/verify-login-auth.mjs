/**
 * End-to-end Login Authentication Verification Script.
 * Tests Firebase configuration, /login route, /api/auth/google, session cookies,
 * 18+ adult age gating, and /api/auth/logout.
 */

import http from "node:http";

const BASE_URL = "http://localhost:3001";

function makeRequest(path, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      method: options.method || "GET",
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: options.headers || {},
    };

    const req = http.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on("error", reject);

    if (body) {
      req.write(typeof body === "string" ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("Starting Login Authentication Verification Suite...\n");
  let passedCount = 0;
  let failedCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passedCount++;
    } else {
      console.error(`[FAIL] ${message}`);
      failedCount++;
    }
  }

  try {
    // 1. Verify /login page HTTP status and content
    console.log("Test Group 1: Public Login Route Rendering");
    const loginRes = await makeRequest("/login");
    assert(loginRes.statusCode === 200, "GET /login returns HTTP 200 OK");
    assert(
      loginRes.body.includes("Continue with Google") || loginRes.body.includes("auth-identifier"),
      "Login page includes Google sign-in and identifier inputs"
    );
    assert(
      loginRes.body.includes("18") || loginRes.body.includes("Adult"),
      "Login page includes 18+ adult declaration"
    );

    // 2. Verify /hi/login Hindi localized page
    console.log("\nTest Group 2: Hindi Localized Login Route");
    const hiLoginRes = await makeRequest("/hi/login");
    assert(hiLoginRes.statusCode === 200, "GET /hi/login returns HTTP 200 OK");
    assert(
      hiLoginRes.body.includes("गूगल") || hiLoginRes.body.includes("अतिथि"),
      "Hindi login page contains Devanagari Hindi text"
    );

    // 3. Verify /api/auth/google with valid adult Google user
    console.log("\nTest Group 3: Google Firebase Authentication Bridge");
    const validGoogleUser = {
      uid: "firebase_user_abc123",
      email: "traveller.ananya@example.com",
      displayName: "Ananya Sharma",
      photoUrl: "https://lh3.googleusercontent.com/photo.jpg",
      idToken: "mock_firebase_id_token_valid",
      isAdultConfirmed: true,
    };

    const authRes = await makeRequest(
      "/api/auth/google",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      validGoogleUser
    );

    assert(authRes.statusCode === 200, "POST /api/auth/google returns HTTP 200 for valid adult user");
    const authJson = JSON.parse(authRes.body);
    assert(authJson.success === true, "Response payload indicates success: true");
    assert(authJson.user.email === "traveller.ananya@example.com", "Session user email matches Google account");
    assert(authJson.user.displayName === "Ananya Sharma", "Session user display name matches Google profile");

    // Check Set-Cookie header for adb_session
    const setCookie = authRes.headers["set-cookie"];
    assert(Array.isArray(setCookie) && setCookie.length > 0, "Response sets cookie header");
    const sessionCookieStr = setCookie ? setCookie.find((c) => c.startsWith("adb_session=")) : null;
    assert(Boolean(sessionCookieStr), "Cookie 'adb_session' is issued");
    assert(/httponly/i.test(sessionCookieStr), "Session cookie enforces HttpOnly flag");
    assert(/samesite=lax/i.test(sessionCookieStr), "Session cookie enforces SameSite=lax");

    // 4. Verify 18+ Adult Invariant (Minor Rejection)
    console.log("\nTest Group 4: Safety & Age Invariant Enforcement");
    const minorUser = {
      uid: "firebase_minor_456",
      email: "minor.user@example.com",
      displayName: "Minor User",
      isAdultConfirmed: false, // Under 18
    };

    const minorRes = await makeRequest(
      "/api/auth/google",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      minorUser
    );

    assert(minorRes.statusCode === 403, "POST /api/auth/google rejects non-adult registrant with HTTP 403 Forbidden");
    const minorJson = JSON.parse(minorRes.body);
    assert(minorJson.success === false, "Minor response indicates success: false");
    assert(
      minorJson.error.includes("18") || minorJson.error.includes("adult"),
      "Error message explicitly references adult (18+) requirement"
    );

    // 5. Verify Missing Credentials Rejection
    console.log("\nTest Group 5: Input Validation & Error Handling");
    const invalidRes = await makeRequest(
      "/api/auth/google",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { displayName: "Incomplete User" } // Missing uid and email
    );

    assert(invalidRes.statusCode === 400, "POST /api/auth/google rejects missing credentials with HTTP 400 Bad Request");

    // 6. Verify Logout endpoint clears session
    console.log("\nTest Group 6: Logout and Session Termination");
    const logoutRes = await makeRequest("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    assert(logoutRes.statusCode === 200, "POST /api/auth/logout returns HTTP 200 OK");
    const logoutJson = JSON.parse(logoutRes.body);
    assert(logoutJson.success === true, "Logout response indicates success: true");

    const logoutCookies = logoutRes.headers["set-cookie"];
    const clearedCookie = logoutCookies ? logoutCookies.find((c) => c.startsWith("adb_session=")) : null;
    assert(Boolean(clearedCookie), "Logout response sets cleared session cookie");
    assert(
      clearedCookie?.includes("Max-Age=0") || clearedCookie?.includes("max-age=0"),
      "Session cookie is immediately invalidated with Max-Age=0"
    );

    console.log("\n------------------------------------------------------------");
    console.log(`Verification Complete: ${passedCount} checks passed, ${failedCount} checks failed.`);
    console.log("------------------------------------------------------------");

    if (failedCount > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Verification failed with error:", err);
    process.exit(1);
  }
}

runTests();
