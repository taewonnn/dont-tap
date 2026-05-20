export function getResultType(wrongCount: number, avgReactionMs: number): string {
  if (wrongCount <= 2 && avgReactionMs < 450) return '버튼 감별사';
  if (wrongCount >= 8 && avgReactionMs < 350) return '빠른 급발진러';
  if (wrongCount <= 2 && avgReactionMs >= 500) return '신중한 생존자';
  if (wrongCount >= 10) return '광고 배너 헌터';
  return '침착한 고수';
}
