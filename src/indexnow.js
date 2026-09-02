/** Wired after Gate C only. Kept so Deploy A tree matches the planned layout. */
export const INDEXNOW_KEY = "b7e4c91a0f3d68e25a14c0b9d8e7f612";
export const INDEXNOW_KEY_FILE = "https://lettersunscrambler.com/b7e4c91a0f3d68e25a14c0b9d8e7f612.txt";

export async function pingIndexNow(_env, urls) {
  if (!urls || !urls.length) return { skipped: true };
  return { skipped: true, reason: "cron disabled until Gate C" };
}
