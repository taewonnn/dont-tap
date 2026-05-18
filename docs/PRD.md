# PRD: 가짜 버튼 피하기 게임

## 목표
사용자가 제한 시간 안에 진짜 버튼과 가짜 버튼을 빠르게 구분하며, 반응속도·집중력·충동 억제력을 재미있게 측정하는 짧은 미니게임을 만든다.

## 사용자
- 앱인토스에서 가볍게 즐길 수 있는 테스트/게임형 콘텐츠를 찾는 사용자
- 친구에게 결과를 공유하고 싶은 사용자
- 자신의 반응속도, 집중력, 실수 성향을 재미로 확인하고 싶은 사용자
- 짧은 시간 안에 한 판만 플레이하고 결과를 보고 싶은 사용자

## 핵심 기능
1. 가짜 버튼 피하기 게임 플레이
   - 화면에 여러 개의 버튼이 랜덤하게 표시된다.
   - 사용자는 안내 문구에 맞는 “진짜 버튼”만 눌러야 한다.
   - 가짜 버튼을 누르면 점수 차감 또는 시간 페널티가 발생한다.
   - 제한 시간은 기본 30초로 설정한다.

2. 라운드별 난이도 증가
   - 초반에는 명확한 버튼만 제공한다.
   - 시간이 지날수록 버튼 문구, 색상, 위치, 크기, 애니메이션이 헷갈리게 바뀐다.
   - 예시 미션:
     - “누르세요” 버튼만 누르세요.
     - “누르지 마세요”는 피하세요.
     - 파란색 버튼만 누르세요.
     - 가장 작은 버튼을 누르세요.
     - 이전과 같은 색 버튼을 누르세요.
     - 글자가 아니라 색깔을 보고 누르세요.

3. 결과 카드 제공
   - 최종 점수
   - 정답 수
   - 오답 수
   - 평균 반응속도
   - 최대 콤보
   - 충동 억제력 점수
   - 사용자 유형 텍스트 제공

4. 결과 공유
   - 결과 이미지를 공유할 수 있는 카드 형태로 제공한다.
   - 공유 문구 예시:
     - “나는 낚시 버튼 저항력 상위 12%”
     - “광고 배너 잘못 누르는 타입”
     - “신중한 척하지만 3초 만에 낚이는 타입”

5. 광고 수익화
   - 게임 결과 화면 하단에 배너 광고를 노출한다.
   - 재도전 또는 추가 결과 해석 보기 버튼 클릭 시 전면형/보상형 광고를 사용할 수 있다.
   - 배너 광고는 React Native 기준 `InlineAd` 컴포넌트를 사용한다.
   - 전면형/보상형 광고는 광고 표시 전에 `loadFullScreenAd`로 미리 로드하고, 이벤트 수신 후 `showFullScreenAd`로 노출한다.

## MVP 제외 사항
- 실시간 친구 대전
- 서버 기반 전체 랭킹
- 회원가입 또는 로그인 기반 기록 저장
- 복잡한 캐릭터 성장 시스템
- 유료 아이템 구매
- 상세 심리 분석 리포트
- 소리 기반 반응 테스트
- 멀티 스테이지 캠페인 모드

## 디자인
- 빠르고 직관적인 캐주얼 게임 UI
- 토스 앱 안에서 어색하지 않은 깔끔한 미니앱 스타일
- 과한 게임 그래픽보다는 명확한 정보 전달 중심
- 버튼 중심의 인터랙션을 강조
- 결과 화면은 공유하기 좋은 카드형 디자인
- 기본 배경은 밝은 회색 또는 화이트 계열을 사용한다.
- 주요 버튼은 블랙/화이트 대비를 사용한다.
- 정답 피드백은 초록, 오답 피드백은 빨강, 경고/헷갈림 요소는 노랑 또는 주황을 사용한다.

## 기본 플레이 흐름
1. 시작 화면 진입
2. 게임 설명 확인
3. 시작 버튼 클릭
4. 3초 카운트다운
5. 30초 동안 버튼 선택
6. 정답/오답/반응속도 기록
7. 결과 화면 노출
8. 배너 광고 노출
9. 다시하기 / 공유하기 / 추가 분석 보기

## 게임 규칙
| 항목 | 내용 |
|------|------|
| 제한 시간 | 30초 |
| 기본 점수 | 정답 +100점 |
| 오답 | -50점 |
| 콤보 | 연속 정답 5회마다 추가 +50점 |
| 시간 페널티 | 오답 시 -1초 |
| 게임 종료 | 시간이 0초가 되면 종료 |

## 버튼 예시
### 진짜 버튼
- 누르세요
- 지금!
- 정답
- 파란 버튼
- 이거

### 가짜 버튼
- 누르지 마세요
- 누르면 손해
- 이 버튼 아님
- 광고 아님
- 진짜 같죠?
- 여기 말고
- 급하면 누름

## 난이도 설계
### 1단계: 0~10초
- 버튼 2~3개
- 조건 단순
- 가짜 버튼 문구 명확

### 2단계: 10~20초
- 버튼 3~5개
- 색상 조건 추가
- 위치 랜덤 이동

### 3단계: 20~30초
- 버튼 5~7개
- 문구와 색상 충돌
- 작은 버튼 등장
- 가짜 버튼이 진짜처럼 보임

## 결과 유형
### 신중한 생존자
정확도는 높지만 반응속도는 조금 느린 타입. 낚시 버튼을 잘 피하지만, 한 번 더 생각하느라 시간이 걸린다.

### 빠른 급발진러
반응속도는 빠르지만 오답률이 높은 타입. 손이 머리보다 먼저 움직이는 편이다.

### 버튼 감별사
속도와 정확도 모두 좋은 타입. 가짜 버튼 사이에서도 진짜를 빠르게 찾아낸다.

### 광고 배너 헌터
눈에 띄는 버튼을 보면 일단 누르고 보는 타입. 다음 판에서는 1초만 더 참아보면 좋다.

### 침착한 고수
오답이 거의 없고 콤보 유지력이 좋은 타입. 낚시 버튼 저항력이 상당히 높다.

## 광고 기획
### 결과 화면 하단 배너 광고
- 게임 결과를 본 뒤 자연스럽게 하단에 노출한다.
- 결과 카드와 공유 버튼 아래에 배치한다.
- React Native에서는 `InlineAd` 컴포넌트를 사용한다.

```tsx
<InlineAd
  adGroupId="ait-ad-test-banner-id"
  theme="auto"
  tone="blackAndWhite"
  variant="expanded"
  impressFallbackOnMount={true}
/>
```

### 재도전 전 전면 광고
- 사용자가 2~3회 플레이 후 “다시하기”를 누를 때 노출한다.
- 첫 판 직후에는 노출하지 않는다.
- 광고 피로도를 줄이기 위해 빈도 제한을 둔다.

추천 노출 조건:
- 첫 플레이: 광고 없음
- 두 번째 플레이 결과 후: 배너만 노출
- 세 번째 다시하기 클릭 시: 전면 광고 노출 가능

### 추가 분석 보기 보상형 광고
버튼명: 광고 보고 상세 분석 보기

광고 시청 완료 후 제공:
- 내 실수 패턴
- 가장 많이 낚인 버튼
- 평균 반응속도
- 추천 유형 문구

리워드 광고는 `userEarnedReward` 이벤트가 발생했을 때만 보상을 지급한다. 단순히 광고가 닫혔다는 `dismissed` 이벤트만으로는 보상을 지급하지 않는다.

## 주요 화면 구성
### 시작 화면
- 제목: 가짜 버튼 피하기
- 설명: 진짜 버튼만 빠르게 눌러보세요. 낚시 버튼을 누르면 점수가 깎입니다.
- 버튼: 게임 시작
- 보조 문구: 30초 안에 당신의 낚시 버튼 저항력을 측정해요.

### 카운트다운 화면
- 3
- 2
- 1
- 시작!

### 게임 화면
- 상단: 남은 시간 / 점수 / 콤보
- 미션 문구: “파란색 버튼만 누르세요”
- 중앙: 랜덤 버튼 영역
- 피드백: 정답 +100 / 오답 -50

### 결과 화면
- 당신의 낚시 버튼 저항력은 87점
- 유형: 버튼 감별사
- 상세: 정답 24개 / 오답 3개 / 평균 반응속도 412ms / 최대 콤보 9회
- 버튼: 다시하기 / 결과 공유하기 / 광고 보고 상세 분석 보기
- 하단: 배너 광고

## MVP 개발 범위
### 포함
- 시작 화면
- 게임 설명
- 카운트다운
- 30초 게임 플레이
- 랜덤 버튼 생성
- 정답/오답 판정
- 점수 계산
- 결과 유형 산출
- 결과 공유용 텍스트
- 결과 화면 배너 광고
- 보상형 광고 기반 상세 분석 보기

### 제외
- 서버 저장
- 전체 랭킹
- 친구 초대
- 회원별 기록 관리
- 푸시 알림
- 복잡한 애니메이션
- 유료 결제

## 핵심 지표
### 게임 지표
- 게임 시작률
- 게임 완료율
- 평균 플레이 시간
- 재도전율
- 결과 공유 클릭률
- 평균 오답률
- 평균 반응속도

### 광고 지표
- 배너 노출 수
- 배너 클릭 수
- 전면 광고 노출 수
- 보상형 광고 시청 시작 수
- 보상형 광고 완료 수
- 상세 분석 보기 전환율
- 광고 실패율

## 의사코드
```ts
// 게임 상태
// ready: 시작 전
// countdown: 카운트다운 중
// playing: 게임 진행 중
// finished: 결과 화면

type GameState = 'ready' | 'countdown' | 'playing' | 'finished';

type ButtonItem = {
  id: string;
  label: string;
  color: string;
  isCorrect: boolean;
  x: number;
  y: number;
  size: 'small' | 'medium' | 'large';
};

type GameResult = {
  score: number;
  correctCount: number;
  wrongCount: number;
  averageReactionMs: number;
  maxCombo: number;
  type: string;
};

function startGame() {
  setGameState('countdown');

  // 3초 카운트다운 후 게임 시작
  runCountdown(() => {
    setGameState('playing');
    startTimer(30);
    createNextRound();
  });
}

function createNextRound() {
  const mission = pickRandomMission();
  const buttons = createButtonsByMission(mission);

  setCurrentMission(mission);
  setButtons(buttons);
  setRoundStartedAt(Date.now());
}

function handleButtonClick(button: ButtonItem) {
  const reactionMs = Date.now() - roundStartedAt;

  if (button.isCorrect) {
    increaseScore(100);
    increaseCombo();
    saveReactionTime(reactionMs);
  } else {
    decreaseScore(50);
    decreaseTime(1);
    resetCombo();
    increaseWrongCount();
  }

  createNextRound();
}

function finishGame() {
  const result = calculateResult({
    score,
    correctCount,
    wrongCount,
    reactionTimes,
    maxCombo,
  });

  setGameResult(result);
  setGameState('finished');
}

function getResultType(result: GameResult) {
  if (result.wrongCount <= 2 && result.averageReactionMs < 450) {
    return '버튼 감별사';
  }

  if (result.wrongCount >= 8 && result.averageReactionMs < 350) {
    return '빠른 급발진러';
  }

  if (result.wrongCount <= 2 && result.averageReactionMs >= 500) {
    return '신중한 생존자';
  }

  if (result.wrongCount >= 10) {
    return '광고 배너 헌터';
  }

  return '침착한 고수';
}
```

## 광고 연동 의사코드
```ts
function preloadRewardAd() {
  if (!loadFullScreenAd.isSupported()) {
    return;
  }

  loadFullScreenAd({
    options: {
      adGroupId: REWARDED_AD_GROUP_ID,
    },
    onEvent: event => {
      if (event.type === 'loaded') {
        setIsRewardAdLoaded(true);
      }
    },
    onError: error => {
      console.error('광고 로드 실패:', error);
      setIsRewardAdLoaded(false);
    },
  });
}

function handleShowDetailAnalysis() {
  if (!showFullScreenAd.isSupported() || !isRewardAdLoaded) {
    showBasicAnalysis();
    return;
  }

  showFullScreenAd({
    options: {
      adGroupId: REWARDED_AD_GROUP_ID,
    },
    onEvent: event => {
      if (event.type === 'userEarnedReward') {
        unlockDetailAnalysis();
      }

      if (event.type === 'dismissed') {
        preloadRewardAd();
      }
    },
    onError: error => {
      console.error('광고 표시 실패:', error);
      showBasicAnalysis();
    },
  });
}
```

## 한 줄 컨셉
“당신은 가짜 버튼을 얼마나 잘 피할 수 있나요?”

## 추천 앱 이름
- 가짜 버튼 피하기
- 낚시 버튼 테스트
- 버튼 참기 챌린지
- 누르면 지는 게임
- 광고 버튼 생존 테스트
- 클릭 참기 테스트

최종 추천 이름은 “누르면 지는 게임”이다. 공유용 제목은 “낚시 버튼 테스트”가 적합하다.
