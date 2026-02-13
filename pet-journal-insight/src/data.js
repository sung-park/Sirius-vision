export const scenarios = {
  good_day: {
    label: 'Scenario A: 건강함',
    sensorData: {
      sleepHours: 12.5,
      sleepQuality: 95,
      scratchCount: 12,
      activityKm: 3.2,
      activityLevel: 'High',
      baseScore: 92,
    },
    message: '뽀삐가 어젯밤 푹 잤어요! 컨디션이 좋습니다.',
    insightBase: null,
  },
  bad_day: {
    label: 'Scenario B: 아픔',
    sensorData: {
      sleepHours: 7.0,
      sleepQuality: 60,
      scratchCount: 85,
      activityKm: 0.8,
      activityLevel: 'Low',
      baseScore: 65,
    },
    message: '어젯밤 뽀삐가 잠을 설쳤어요.',
    insightBase: '수면 부족과 긁기 횟수 증가가 감지되었습니다.',
  },
};

export const journalQuestions = [
  {
    id: 'meal',
    label: '식사',
    icon: 'UtensilsCrossed',
    options: [
      { value: 'complete', label: '완료', emoji: '✅' },
      { value: 'leftover', label: '남김', emoji: '🍽️' },
      { value: 'refused', label: '거부', emoji: '❌' },
    ],
  },
  {
    id: 'stool',
    label: '배변',
    icon: 'Droplets',
    options: [
      { value: 'normal', label: '정상', emoji: '👍' },
      { value: 'soft', label: '묽음', emoji: '💧' },
      { value: 'diarrhea', label: '설사', emoji: '⚠️' },
      { value: 'none', label: '없음', emoji: '➖' },
    ],
  },
  {
    id: 'medication',
    label: '투약',
    icon: 'Pill',
    options: [
      { value: 'heartworm', label: '심장사상충', emoji: '💊' },
      { value: 'joint', label: '관절약', emoji: '🦴' },
      { value: 'none', label: '없음', emoji: '➖' },
    ],
  },
  {
    id: 'symptoms',
    label: '특이사항',
    icon: 'AlertTriangle',
    multi: true,
    options: [
      { value: 'vomit', label: '구토', emoji: '🤮' },
      { value: 'cough', label: '기침', emoji: '😮‍💨' },
      { value: 'limping', label: '다리 절음', emoji: '🦵' },
      { value: 'normal', label: '평소와 다름 없음', emoji: '😊' },
    ],
  },
];

export const penalties = {
  meal_leftover: -5,
  meal_refused: -10,
  stool_soft: -5,
  stool_diarrhea: -15,
  stool_none: -3,
  symptom_vomit: -20,
  symptom_cough: -10,
  symptom_limping: -10,
};

export function calculateScore(baseScore, journalAnswers) {
  let penalty = 0;

  if (journalAnswers.meal === 'leftover') penalty += penalties.meal_leftover;
  if (journalAnswers.meal === 'refused') penalty += penalties.meal_refused;
  if (journalAnswers.stool === 'soft') penalty += penalties.stool_soft;
  if (journalAnswers.stool === 'diarrhea') penalty += penalties.stool_diarrhea;
  if (journalAnswers.stool === 'none') penalty += penalties.stool_none;

  if (journalAnswers.symptoms) {
    if (journalAnswers.symptoms.includes('vomit')) penalty += penalties.symptom_vomit;
    if (journalAnswers.symptoms.includes('cough')) penalty += penalties.symptom_cough;
    if (journalAnswers.symptoms.includes('limping')) penalty += penalties.symptom_limping;
  }

  return Math.max(0, Math.min(100, baseScore + penalty));
}

export function generateInsights(sensorData, journalAnswers, oldScore, newScore) {
  const insights = [];
  const diff = newScore - oldScore;

  if (journalAnswers.stool === 'diarrhea' && sensorData.scratchCount > 50) {
    insights.push({
      type: 'warning',
      title: '식이 알러지 의심',
      message: `어젯밤 긁는 횟수가 ${sensorData.scratchCount}회로 증가했고, 오늘 '설사'를 기록하셨네요. 식이 알러지가 의심됩니다. 활력 점수가 ${Math.abs(diff)}점 감소했습니다.`,
    });
  }

  if (sensorData.sleepQuality < 70 && journalAnswers.stool === 'diarrhea') {
    insights.push({
      type: 'alert',
      title: '컨디션 저조',
      message: '수면 부족과 설사 증상이 결합되어 컨디션이 매우 저조합니다. 오늘 산책은 쉬는 것을 권장합니다.',
    });
  }

  if (journalAnswers.symptoms?.includes('vomit')) {
    insights.push({
      type: 'alert',
      title: '구토 감지',
      message: '구토가 보고되었습니다. 지속될 경우 수의사 상담을 권장합니다.',
    });
  }

  if (journalAnswers.meal === 'refused') {
    insights.push({
      type: 'warning',
      title: '식욕 부진',
      message: '식사를 거부했습니다. 스트레스나 건강 이상의 신호일 수 있으니 주의 깊게 관찰해 주세요.',
    });
  }

  if (diff === 0 && newScore >= 80) {
    insights.push({
      type: 'positive',
      title: '좋은 컨디션',
      message: '뽀삐의 컨디션이 좋습니다! 오늘도 활기찬 하루 보내세요. 🐾',
    });
  }

  if (insights.length === 0 && diff < 0) {
    insights.push({
      type: 'info',
      title: '점수 변동',
      message: `기록을 반영하여 활력 점수가 ${Math.abs(diff)}점 조정되었습니다.`,
    });
  }

  return insights;
}

export const weeklyData = [
  { day: '월', score: 85, sleep: 12 },
  { day: '화', score: 78, sleep: 10 },
  { day: '수', score: 92, sleep: 13 },
  { day: '목', score: 70, sleep: 9 },
  { day: '금', score: 65, sleep: 7 },
  { day: '토', score: 58, sleep: 8 },
  { day: '일', score: null, sleep: null },
];
