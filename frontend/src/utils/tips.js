export const TIPS = [
  { icon: '🎯', text: 'Break big tasks into smaller steps — progress feels better when it\'s visible.' },
  { icon: '⏰', text: 'The 2-minute rule: if it takes less than 2 minutes, do it now.' },
  { icon: '🍅', text: 'Pomodoro technique: 25 min focus + 5 min break = deep work without burnout.' },
  { icon: '📅', text: 'Plan tomorrow the night before. You\'ll start the day with clarity.' },
  { icon: '🔥', text: 'Streaks build habits. Complete at least one task every day to keep yours alive.' },
  { icon: '🧠', text: 'Tackle your hardest task first — willpower is strongest in the morning.' },
  { icon: '✅', text: 'Done is better than perfect. Ship it, then improve.' },
  { icon: '📵', text: 'Single-tasking beats multitasking every time. Focus on one thing.' },
  { icon: '💤', text: 'Sleep is productivity. A rested brain works 40% faster.' },
  { icon: '🌱', text: '1% better every day compounds into 37x improvement over a year.' },
  { icon: '📝', text: 'Write tasks down immediately — your brain is for thinking, not storing.' },
  { icon: '🏆', text: 'Celebrate small wins. Every completed task is a step forward.' },
];

export const getDailyTip = () => {
  const dayIndex = new Date().getDate() % TIPS.length;
  return TIPS[dayIndex];
};

export const getStreakMessage = (streak) => {
  if (streak === 0) return { msg: 'Complete a task today to start your streak!', emoji: '🌱' };
  if (streak === 1) return { msg: 'Great start! Come back tomorrow to build your streak.', emoji: '✨' };
  if (streak < 5)  return { msg: `${streak} days strong! You\'re building momentum.`, emoji: '🔥' };
  if (streak < 10) return { msg: `${streak} day streak! You\'re on a roll.`, emoji: '⚡' };
  if (streak < 30) return { msg: `${streak} days! Incredible consistency.`, emoji: '🏆' };
  return { msg: `${streak} day streak! You\'re a productivity legend.`, emoji: '👑' };
};
