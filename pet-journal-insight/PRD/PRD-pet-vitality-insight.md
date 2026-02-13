# Pet Vitality Insight - 제품 요구사항 정의서 (PRD)

## 1. 프로젝트 개요 (Project Overview)

* **프로젝트명:** Pet Vitality Insight
* **목표:** Whoop과 Oura Ring의 UX를 벤치마킹하여, 반려동물의 센서 데이터(가상)와 보호자의 관찰 기록(저널링)이 결합된 '펫 활력 점수' 시스템을 시각적으로 구현하고 테스트한다.
* **핵심 가치:** "보호자의 기록(Input)이 데이터의 해석(Insight)을 어떻게 바꾸는가?"를 경험하게 함.
* **타겟 디바이스:** 모바일 웹 (Mobile-First Design)

## 2. 기술 스택 및 환경 (Tech Stack)

* **Framework:** React (Latest version)
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **Icons:** Lucide-react
* **Charts:** Recharts (AreaChart)
* **Data:** 로컬 상태 관리 (useState) 및 가상의 Mock Data 사용

## 3. 주요 기능 명세 (Core Features)

### A. 홈 화면: 대시보드 (Dashboard)

1. **헤더:** 반려동물 프로필 아이콘, 이름(뽀삐), 현재 날짜.
2. **메인 지표 (Pet Vitality Score):**
   * **UI:** Whoop 스타일의 원형 프로그레스 바 (0~100점).
   * **Color Logic:** 80-100(Green/최적), 50-79(Yellow/주의), 0-49(Red/회복필요).
   * **인터랙션:** 점수는 '기본 센서 데이터' + '저널링 입력 결과'에 따라 동적으로 변화.
3. **서브 지표 (Key Metrics):**
   * 수면 시간 (예: 12.5h)
   * 긁기/털기 횟수 (예: 85회 - 평소보다 높음 표시)
   * 활동량 (예: 0.8km)

### B. 모닝 체크인: 펫 저널 (Morning Check-in / Journal)

* **진입점:** 대시보드 하단 CTA 버튼.
* **입력 방식:** Whoop Journal 스타일의 '초고속 토글' 인터페이스 (Bottom Sheet).
* **질문 리스트 (4단계 스텝):**
  1. **식사:** [완료] / [남김] / [거부]
  2. **배변:** [정상] / [묽음] / [설사] / [없음]
  3. **투약:** [심장사상충] / [관절약] / [없음]
  4. **특이사항 (다중선택):** [구토] / [기침] / [다리 절음] / [평소와 다름 없음]
* **완료 액션:** "저널 저장" 클릭 → 점수 재계산 → 대시보드로 이동 + 점수 업데이트 애니메이션.

### C. 인사이트 카드 (Insight Engine)

* 저널 입력 후 대시보드 하단에 생성되는 분석 메시지 카드.
* **로직:** 센서 데이터(가상)와 입력 데이터 간의 인과관계 설명.
* **예시 문구:**
  * "어젯밤 긁는 횟수가 85회로 증가했고, 오늘 '설사'를 기록하셨네요. 식이 알러지가 의심됩니다. 활력 점수가 15점 감소했습니다."
  * "수면 부족과 설사 증상이 결합되어 컨디션이 매우 저조합니다. 오늘 산책은 쉬는 것을 권장합니다."

### D. 시뮬레이션 컨트롤 (Demo Mode)

* 화면 하단에 "시나리오 변경" 기능.
* **Scenario A (건강함):** 센서 데이터 정상 + 저널(이상 없음) = 점수 92점.
* **Scenario B (아픔):** 센서 데이터(수면 부족, 긁음 증가) + 저널(설사/구토) = 점수 65점 → 저널 후 45점.

## 4. 데이터 모델링 (Mock Data Structure)

```json
{
  "scenarios": {
    "good_day": {
      "sensorData": {
        "sleepHours": 12.5,
        "sleepQuality": 95,
        "scratchCount": 12,
        "activityKm": 3.2,
        "activityLevel": "High",
        "baseScore": 92
      }
    },
    "bad_day": {
      "sensorData": {
        "sleepHours": 7.0,
        "sleepQuality": 60,
        "scratchCount": 85,
        "activityKm": 0.8,
        "activityLevel": "Low",
        "baseScore": 65
      }
    }
  },
  "journalLogic": {
    "penalty": {
      "meal_leftover": -5,
      "meal_refused": -10,
      "stool_soft": -5,
      "stool_diarrhea": -15,
      "stool_none": -3,
      "symptom_vomit": -20,
      "symptom_cough": -10,
      "symptom_limping": -10
    }
  }
}
```

## 5. UI/UX 디자인 가이드라인 (Design System)

* **Color Palette:**
  * Primary (Brand): Deep Purple (#6200EA)
  * Score High: Emerald Green (#10B981)
  * Score Mid: Amber (#F59E0B)
  * Score Low: Rose Red (#E11D48)
  * Background: Dark Mode (#0D0D1A)
* **Typography:** Inter (San-serif), 숫자는 크고 굵게(Bold).
* **Layout:**
  * 모바일 세로 모드 최적화 (Max-width: 480px, Center aligned on desktop).
  * 카드형 UI (Rounded Corners).

## 6. 구현 시나리오 (User Flow for Validation)

1. **초기 상태:** 앱 진입 → 기본 시나리오: `bad_day` 로드.
2. **화면 표시:** 활력 점수 65점(노란색). "어젯밤 뽀삐가 잠을 설쳤어요." 메시지 표시.
3. **액션:** "원인 파악을 위해 체크인해 주세요" 버튼 클릭.
4. **저널링:**
   * 식사: [남김]
   * 배변: [설사]
   * 특이사항: [평소와 다름 없음] 선택 후 저장.
5. **피드백:**
   * 하트 플로팅 리워드 애니메이션 표시.
   * 점수가 65점 → 45점(빨간색)으로 하향 조정됨.
   * 인사이트 생성: "수면 부족과 설사 증상이 결합되어 컨디션이 매우 저조합니다."
   * 보상 메시지: "기록해 주셔서 감사합니다. 뽀삐를 더 잘 이해하게 되었습니다."
