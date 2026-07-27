# Backend spec: `POST /api/v1/auth/oauth`

The frontend now has Google sign-in wired up via NextAuth, but your Express
backend doesn't have an OAuth-aware endpoint yet. Until this exists, Google
sign-in on the frontend will succeed at the NextAuth level but then show the
person a "Google sign-in isn't fully set up yet" message and sign them back
out (see `app/auth/login/page.tsx`).

## What calls it

`auth.ts`'s `jwt` callback, immediately after a successful Google sign-in —
server-to-server, from the Next.js app to your backend. Not called from the
browser.

## Request

```
POST /api/v1/auth/oauth
Content-Type: application/json

{
  "provider": "google",
  "providerAccountId": "1029384756...",   // Google's stable account id
  "email": "person@gmail.com",
  "name": "Adaeze Okafor",
  "image": "https://lh3.googleusercontent.com/..."
}
```

## Expected behavior

1. Look up a user by `email`.
2. If found:
   - If they already have `authProvider: "google"` (or you're fine linking
     accounts by verified email), sign them in.
   - If they registered with a password (`authProvider: "local"`), it's your
     call whether to auto-link or reject with a "sign in with your password
     instead" message. Auto-linking by email is the more common choice, but
     only do this if you trust Google's `email_verified` claim.
3. If not found: create a new **citizen** user (mirroring `POST
   /api/v1/auth/register` but skipping password hashing — there's no
   password from an OAuth user) with `authProvider: "google"` and
   `isVerified: true` (Google already verified the email).
4. Issue the same access token + refresh-token cookie you already issue from
   `/api/v1/auth/signin`, so the rest of the auth pipeline (refresh,
   `/auth/me`, etc.) needs zero changes.

## Response — reuse your existing `AuthResponse` shape

```json
{
  "success": true,
  "message": "Signed in with Google",
  "data": {
    "user": {
      "user": { "_id": "...", "email": "...", "role": "citizen", "...": "..." },
      "profile": { "...": "..." }
    },
    "accessToken": "<jwt>"
  },
  "timestamp": "2026-07-23T00:00:00.000Z"
}
```

On failure, respond with `success: false` and a 4xx status — the frontend
already treats any non-2xx / `success: false` response as "OAuth failed"
and falls back to email/password.

## Sketch (Express + Mongoose, adapt to your actual User model)

```js
// routes/auth.js
router.post("/oauth", async (req, res) => {
  const { provider, providerAccountId, email, name, image } = req.body;

  if (provider !== "google" || !email) {
    return res.status(400).json({ success: false, message: "Invalid OAuth payload" });
  }

  let user = await User.findOne({ email });

  if (!user) {
    const [firstName, ...rest] = (name || "").split(" ");
    user = await User.create({
      firstName: firstName || "User",
      lastName: rest.join(" ") || "",
      email,
      role: "citizen",
      authProvider: "google",
      providerAccountId,
      avatarUrl: image,
      isVerified: true,
      isActive: true,
      // no `password` field — make sure your schema allows this for
      // authProvider !== "local", and that your login route doesn't try
      // to bcrypt.compare against a missing password hash for these users.
    });
    await CitizenProfile.create({ userId: user._id });
  }

  const accessToken = signAccessToken(user); // however you already do this
  const refreshToken = signRefreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  const profile = await CitizenProfile.findOne({ userId: user._id });

  res.json({
    success: true,
    message: "Signed in with Google",
    data: { user: { user, profile }, accessToken },
    timestamp: new Date().toISOString(),
  });
});
```

## Note on lawyers

This only ever creates **citizens**. If you want lawyers to be able to sign
up via Google too, decide how they'll indicate that (e.g. a `?role=lawyer`
query param through the OAuth flow, or a "continue as lawyer" step after
first Google sign-in that upgrades the role and kicks them into
`/auth/lawyer-setup`) — the frontend doesn't currently pass role through the
Google flow at all.
