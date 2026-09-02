# lettersunscrambler.com

Production origin: https://lettersunscrambler.com
Worker name: word-unscrambler
Branch for this cutover: cutover-assets — do not merge main until Gate A is accepted.

Deploy A is origin + security only. Do not inject craft-v3 or smart-v1 until later gates.
Do not fetch raw.githubusercontent.com or dolph/dictionary.
Keep both IndexNow key files. Keep workers_dev = true until after Gate C.
