// Original, low-key encouragement. One daily message is chosen by date so it stays
// stable for the whole day.

export const dailyMessages = [
  'Small, steady steps still count as progress.',
  'You don’t have to understand everything today — just the next thing.',
  'Confusion is usually the moment right before something clicks.',
  'A short focused session beats a long distracted one.',
  'Rest is part of studying, not a break from it.',
  'Try explaining one idea out loud today. It shows you what you really know.',
  'Mistakes on practice problems are cheap. That’s what they’re for.',
  'Start with the task that feels a little too small. Momentum does the rest.',
  'Your notes don’t need to be pretty to be useful.',
  'Water, a snack, then one problem. In that order.',
  'Progress is quieter than it feels. Keep going.',
  'Ask “why does this step work?” — that question is where learning happens.',
  'It’s okay to come back to a hard problem tomorrow with fresh eyes.',
  'One page, one problem, one card. Then decide what’s next.',
  'You’ve learned hard things before. This is another one.',
  'Curiosity is a better study partner than pressure.',
  'Check the units. They tell you more than you think.',
  'Be as patient with yourself as you would be with a friend.',
]

export const focusDoneMessages = [
  'Session complete. Stretch, sip some water, and let it settle.',
  'Nicely done — that was real, focused work.',
  'Another petal for today. Take your break; you earned it.',
  'Focus session finished. Notice one thing you understand better now.',
  'Done! Step away for a few minutes before the next round.',
]

export const breakDoneMessages = [
  'Break’s over — ready when you are.',
  'Feeling refreshed? Pick one small next step.',
  'Welcome back. Ease in with something manageable.',
]

export function pickDaily(list, key) {
  let h = 0
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return list[h % list.length]
}

export const pickRandom = (list) => list[Math.floor(Math.random() * list.length)]
