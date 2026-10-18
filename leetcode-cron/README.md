# LeetCode Cron Worker

Judge0 API keys must be configured as Cloudflare Worker secrets, not in
`wrangler.jsonc`:

```powershell
npx wrangler secret put JUDGE0_API_KEY_1
```

Repeat with additional numbered names (for example,
`JUDGE0_API_KEY_2`) to configure multiple keys. The worker selects randomly
from the configured keys.
