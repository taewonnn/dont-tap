import type { ButtonDef, ButtonSize, MissionDef } from './types';
import { COLORS } from './constants';

export function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function createButtons(mission: MissionDef): ButtonDef[] {
  return shuffleArray(
    mission.buttons.map((b, i) => ({ ...b, id: `btn-${i}-${Date.now()}` }))
  );
}

export function generatePhase1Mission(): MissionDef {
  const wordSets = [
    { target: '누르세요', decoys: ['누르지 마세요', '누르면 손해', '누르면 안돼요', '절대 누르지 마'] },
    { target: '정답', decoys: ['오답', '정답같은 오답', '거짓 정답', '정답처럼 보임'] },
    { target: '클릭', decoys: ['클릭!', '클릭하기', '클릭하세요', '클릭해요'] },
    { target: '확인', decoys: ['확인하기', '확인했어요', '확인 바람', '확인하시오'] },
    { target: '완료', decoys: ['완료!', '완료하기', '미완료', '완료 취소'] },
    { target: '선택', decoys: ['선택하기', '선택!', '선택 금지', '선택하지 마세요'] },
    { target: '다음', decoys: ['다음으로', '다음!', '다음 아님', '이전'] },
    { target: '터치', decoys: ['터치!', '터치하기', '터치 금지', '터치하지 마세요'] },
    { target: '시작', decoys: ['시작!', '시작하기', '시작 취소', '중단'] },
    { target: '진행', decoys: ['진행하기', '진행!', '진행 중단', '정지'] },
    { target: '동의', decoys: ['비동의', '동의 안 함', '동의하기', '취소'] },
    { target: '네', decoys: ['아니요', '글쎄요', '나중에', '모르겠어요'] },
  ];

  const set = wordSets[Math.floor(Math.random() * wordSets.length)]!;
  const style =
    Math.random() > 0.5
      ? { bg: COLORS.btnPrimary, text: '#fff' }
      : { bg: COLORS.btnSecondary, text: COLORS.textBody };
  const decoyCount = Math.floor(Math.random() * 2) + 2;
  const decoys = [...set.decoys].sort(() => Math.random() - 0.5).slice(0, decoyCount);

  return {
    description: `"${set.target}" 버튼을 누르세요`,
    phase: 1,
    buttons: [
      { label: set.target, bgColor: style.bg, textColor: style.text, isCorrect: true, size: 'medium' },
      ...decoys.map(d => ({ label: d, bgColor: style.bg, textColor: style.text, isCorrect: false, size: 'medium' as ButtonSize })),
    ],
  };
}

export function generatePhase2Mission(): MissionDef {
  const types = ['bgColor', 'textColor', 'size'] as const;
  const type = types[Math.floor(Math.random() * types.length)]!;

  if (type === 'bgColor') {
    const colors = [
      { name: '파란색', value: COLORS.blue },
      { name: '빨간색', value: COLORS.error },
      { name: '초록색', value: COLORS.success },
      { name: '노란색', value: COLORS.warning },
      { name: '검은색', value: COLORS.btnPrimary },
    ];
    const shuffled = [...colors].sort(() => Math.random() - 0.5);
    const [correct, ...wrongs] = shuffled;
    const labels = ['이거', '누르세요', '클릭', '선택', '여기'];
    const label = labels[Math.floor(Math.random() * labels.length)]!;
    return {
      description: `${correct!.name} 배경 버튼을 누르세요`,
      phase: 2,
      buttons: [
        { label, bgColor: correct!.value, textColor: '#fff', isCorrect: true, size: 'medium' },
        ...wrongs.slice(0, 3).map(c => ({ label, bgColor: c.value, textColor: '#fff', isCorrect: false, size: 'medium' as ButtonSize })),
      ],
    };
  }

  if (type === 'textColor') {
    const colors = [
      { name: '파란', value: COLORS.blue },
      { name: '빨간', value: COLORS.error },
      { name: '초록', value: COLORS.success },
      { name: '노란', value: COLORS.warning },
    ];
    const correct = colors[Math.floor(Math.random() * colors.length)]!;
    const labels = ['눌러', '클릭', '여기', '이거'];
    const label = labels[Math.floor(Math.random() * labels.length)]!;
    return {
      description: `글자 색이 ${correct.name} 버튼을 누르세요`,
      phase: 2,
      buttons: [
        { label, bgColor: COLORS.btnSecondary, textColor: correct.value, isCorrect: true, size: 'medium' },
        { label, bgColor: correct.value, textColor: '#fff', isCorrect: false, size: 'medium' },
        { label, bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'medium' },
        { label, bgColor: COLORS.btnSecondary, textColor: COLORS.textSub, isCorrect: false, size: 'medium' },
      ],
    };
  }

  const isLargest = Math.random() > 0.5;
  const labels = ['클릭', '정답', '누르세요', '여기'];
  const label = labels[Math.floor(Math.random() * labels.length)]!;
  return {
    description: isLargest ? '가장 큰 버튼을 누르세요' : '가장 작은 버튼을 누르세요',
    phase: 2,
    buttons: isLargest
      ? [
          { label, bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: true, size: 'large' as ButtonSize },
          { label, bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'medium' as ButtonSize },
          { label, bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'small' as ButtonSize },
          { label, bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'medium' as ButtonSize },
        ]
      : [
          { label, bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: true, size: 'small' as ButtonSize },
          { label, bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'large' as ButtonSize },
          { label, bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'medium' as ButtonSize },
          { label, bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'medium' as ButtonSize },
        ],
  };
}

export function generatePhase3Mission(): MissionDef {
  const templates: (() => MissionDef)[] = [
    () => ({
      description: '느낌표(!)가 있는 버튼을 누르세요',
      phase: 3,
      buttons: [
        { label: '클릭!', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: true, size: 'small' },
        { label: '클릭', bgColor: COLORS.btnPrimary, textColor: '#fff', isCorrect: false, size: 'large' },
        { label: '클릭하기', bgColor: COLORS.error, textColor: '#fff', isCorrect: false, size: 'medium' },
        { label: '클릭해요', bgColor: COLORS.blue, textColor: '#fff', isCorrect: false, size: 'medium' },
      ],
    }),
    () => ({
      description: '물음표(?)가 있는 버튼을 누르세요',
      phase: 3,
      buttons: [
        { label: '이게 정답?', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: true, size: 'small' },
        { label: '이게 정답!', bgColor: COLORS.warning, textColor: '#fff', isCorrect: false, size: 'large' },
        { label: '이게 정답', bgColor: COLORS.blue, textColor: '#fff', isCorrect: false, size: 'medium' },
        { label: '확실히 정답', bgColor: COLORS.error, textColor: '#fff', isCorrect: false, size: 'medium' },
      ],
    }),
    () => ({
      description: '영어가 포함된 버튼을 누르세요',
      phase: 3,
      buttons: [
        { label: 'OK', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: true, size: 'small' },
        { label: '확인', bgColor: COLORS.btnPrimary, textColor: '#fff', isCorrect: false, size: 'large' },
        { label: '클릭', bgColor: COLORS.error, textColor: '#fff', isCorrect: false, size: 'medium' },
        { label: '선택', bgColor: COLORS.blue, textColor: '#fff', isCorrect: false, size: 'medium' },
      ],
    }),
    () => ({
      description: '숫자가 없는 버튼을 누르세요',
      phase: 3,
      buttons: [
        { label: '정답', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: true, size: 'small' },
        { label: '정답1', bgColor: COLORS.btnPrimary, textColor: '#fff', isCorrect: false, size: 'large' },
        { label: '정답2', bgColor: COLORS.error, textColor: '#fff', isCorrect: false, size: 'medium' },
        { label: '3번', bgColor: COLORS.blue, textColor: '#fff', isCorrect: false, size: 'medium' },
      ],
    }),
    () => ({
      description: '숫자가 있는 버튼을 누르세요',
      phase: 3,
      buttons: [
        { label: `${Math.floor(Math.random() * 5) + 1}번`, bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: true, size: 'small' },
        { label: '클릭', bgColor: COLORS.btnPrimary, textColor: '#fff', isCorrect: false, size: 'large' },
        { label: '확인', bgColor: COLORS.error, textColor: '#fff', isCorrect: false, size: 'medium' },
        { label: '선택', bgColor: COLORS.blue, textColor: '#fff', isCorrect: false, size: 'medium' },
      ],
    }),
    () => ({
      description: '테두리 없는 버튼을 누르세요',
      phase: 3,
      buttons: [
        { label: '이게 정답', bgColor: COLORS.btnPrimary, textColor: '#fff', isCorrect: true, size: 'small' },
        { label: '이게 정답', bgColor: '#fff', textColor: COLORS.textBody, isCorrect: false, size: 'large' },
        { label: '이게 정답', bgColor: '#fff', textColor: COLORS.textBody, isCorrect: false, size: 'medium' },
        { label: '이게 정답', bgColor: '#fff', textColor: COLORS.textBody, isCorrect: false, size: 'medium' },
      ],
    }),
    () => ({
      description: '글자가 흰색인 버튼을 누르세요',
      phase: 3,
      buttons: [
        { label: '여기', bgColor: COLORS.btnSecondary, textColor: '#fff', isCorrect: true, size: 'small' },
        { label: '여기', bgColor: COLORS.btnPrimary, textColor: '#fff', isCorrect: false, size: 'large' },
        { label: '여기', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'medium' },
        { label: '여기', bgColor: COLORS.btnSecondary, textColor: COLORS.textSub, isCorrect: false, size: 'medium' },
      ],
    }),
    () => ({
      description: '검은 배경 버튼을 누르세요',
      phase: 3,
      buttons: [
        { label: '클릭', bgColor: COLORS.btnPrimary, textColor: '#fff', isCorrect: true, size: 'small' },
        { label: '클릭', bgColor: '#fff', textColor: COLORS.textBody, isCorrect: false, size: 'large' },
        { label: '클릭', bgColor: COLORS.blue, textColor: '#fff', isCorrect: false, size: 'medium' },
        { label: '클릭', bgColor: COLORS.error, textColor: '#fff', isCorrect: false, size: 'medium' },
        { label: '클릭', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'medium' },
      ],
    }),
    () => ({
      description: '광고 아닌 버튼을 누르세요',
      phase: 3,
      buttons: [
        { label: '닫기', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: true, size: 'small' },
        { label: '광고 아님 100%', bgColor: COLORS.warning, textColor: '#fff', isCorrect: false, size: 'large' },
        { label: '× 광고 닫기', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: false, size: 'medium' },
        { label: '무료 혜택 받기', bgColor: COLORS.error, textColor: '#fff', isCorrect: false, size: 'large' },
        { label: '급하면 누름', bgColor: COLORS.blue, textColor: '#fff', isCorrect: false, size: 'medium' },
      ],
    }),
    () => ({
      description: '"이거" 버튼을 누르세요',
      phase: 3,
      buttons: [
        { label: '이거', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: true, size: 'small' },
        { label: '이거 아님', bgColor: COLORS.error, textColor: '#fff', isCorrect: false, size: 'large' },
        { label: '이거?', bgColor: COLORS.warning, textColor: '#fff', isCorrect: false, size: 'medium' },
        { label: '확실히 이거', bgColor: COLORS.blue, textColor: '#fff', isCorrect: false, size: 'large' },
        { label: '진짜 이거', bgColor: COLORS.btnPrimary, textColor: '#fff', isCorrect: false, size: 'medium' },
      ],
    }),
    () => ({
      description: '글자가 가장 적은 버튼을 누르세요',
      phase: 3,
      buttons: [
        { label: '네', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: true, size: 'medium' },
        { label: '맞아요', bgColor: COLORS.error, textColor: '#fff', isCorrect: false, size: 'medium' },
        { label: '그렇습니다', bgColor: COLORS.warning, textColor: '#fff', isCorrect: false, size: 'medium' },
        { label: '물론이죠', bgColor: COLORS.blue, textColor: '#fff', isCorrect: false, size: 'medium' },
      ],
    }),
    () => ({
      description: '글자가 가장 많은 버튼을 누르세요',
      phase: 3,
      buttons: [
        { label: '클릭하면 정답입니다', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: true, size: 'medium' },
        { label: '정답', bgColor: COLORS.error, textColor: '#fff', isCorrect: false, size: 'large' },
        { label: '클릭해요', bgColor: COLORS.warning, textColor: '#fff', isCorrect: false, size: 'large' },
        { label: '확인하기', bgColor: COLORS.blue, textColor: '#fff', isCorrect: false, size: 'medium' },
      ],
    }),
    () => ({
      description: '띄어쓰기 없는 버튼을 누르세요',
      phase: 3,
      buttons: [
        { label: '클릭', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: true, size: 'small' },
        { label: '클릭 하기', bgColor: COLORS.btnPrimary, textColor: '#fff', isCorrect: false, size: 'large' },
        { label: '눌러 봐', bgColor: COLORS.error, textColor: '#fff', isCorrect: false, size: 'medium' },
        { label: '누르 세요', bgColor: COLORS.blue, textColor: '#fff', isCorrect: false, size: 'medium' },
      ],
    }),
    () => ({
      description: '회색 배경 버튼을 누르세요',
      phase: 3,
      buttons: [
        { label: '여기', bgColor: COLORS.btnSecondary, textColor: COLORS.textBody, isCorrect: true, size: 'small' },
        { label: '여기', bgColor: COLORS.blue, textColor: '#fff', isCorrect: false, size: 'large' },
        { label: '여기', bgColor: COLORS.error, textColor: '#fff', isCorrect: false, size: 'medium' },
        { label: '여기', bgColor: COLORS.btnPrimary, textColor: '#fff', isCorrect: false, size: 'medium' },
      ],
    }),
  ];
  return templates[Math.floor(Math.random() * templates.length)]!();
}

export function pickMission(timeRemaining: number, lastMission: MissionDef | null): MissionDef {
  const generate = (): MissionDef => {
    if (timeRemaining > 20) return generatePhase1Mission();
    if (timeRemaining > 10) return Math.random() > 0.4 ? generatePhase2Mission() : generatePhase1Mission();
    const r = Math.random();
    if (r < 0.15) return generatePhase1Mission();
    if (r < 0.45) return generatePhase2Mission();
    return generatePhase3Mission();
  };
  for (let i = 0; i < 5; i++) {
    const m = generate();
    if (!lastMission || m.description !== lastMission.description) return m;
  }
  return generate();
}
