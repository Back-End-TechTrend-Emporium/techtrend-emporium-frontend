export function levenshtein(a: string, b: string): number {
  const aa = a ?? '';
  const bb = b ?? '';
  const m = aa.length;
  const n = bb.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[] = Array(n + 1).fill(0);
  for (let j = 0; j <= n; j++) dp[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const temp = dp[j];
      const cost = aa.charAt(i - 1) === bb.charAt(j - 1) ? 0 : 1;
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost);
      prev = temp;
    }
  }
  return dp[n];
}

export function fuzzyMatchScore(source: string, target: string): number {
  // lower-case and trim, compute normalized distance ratio
  const s = (source || '').toLowerCase().trim();
  const t = (target || '').toLowerCase().trim();
  const d = levenshtein(s, t);
  // normalized: 0 (exact) to 1 (completely different)
  const maxLen = Math.max(s.length, t.length, 1);
  return d / maxLen;
}

export function fuzzyLooksLike(source: string, target: string, maxRatio = 0.35): boolean {
  // returns true if distance ratio is <= maxRatio
  return fuzzyMatchScore(source, target) <= maxRatio;
}
