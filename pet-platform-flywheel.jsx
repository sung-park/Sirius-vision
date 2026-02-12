import { useState } from "react";

const COLORS = {
  bg: "#0a0e1a",
  card: "#111827",
  cardHover: "#1a2332",
  border: "#1e2d3d",
  accent: "#2d8cf0",
  accentLight: "#4da3ff",
  accentDim: "#1a3a5c",
  gold: "#f0a030",
  goldDim: "#3d2a10",
  green: "#34d399",
  greenDim: "#0d3d2a",
  purple: "#a78bfa",
  purpleDim: "#2a1f4d",
  rose: "#fb7185",
  roseDim: "#3d1520",
  cyan: "#22d3ee",
  cyanDim: "#0a2d33",
  orange: "#fb923c",
  orangeDim: "#3d2210",
  text: "#e2e8f0",
  textMuted: "#8899aa",
  textDim: "#556677",
};

const VERTICALS = [
  {
    group: "건강 · 의료",
    color: COLORS.green,
    colorDim: COLORS.greenDim,
    icon: "🏥",
    items: [
      { name: "동물병원", desc: "모니터링 · 이상징후 · 문진", partnership: "진료 데이터 연동, 원격 상담" },
      { name: "보험사", desc: "운동량 기반 보험료 할인", partnership: "활동 데이터 기반 언더라이팅" },
      { name: "펫 헬스케어", desc: "건강검진 · 영양 상담", partnership: "건강 트렌드 데이터 공유" },
    ],
  },
  {
    group: "영양 · 식품",
    color: COLORS.orange,
    colorDim: COLORS.orangeDim,
    icon: "🍖",
    items: [
      { name: "사료사", desc: "맞춤형 사료/간식 구독", partnership: "RS 모델, 서비스피 대납" },
      { name: "영양제/보충제", desc: "건강 데이터 기반 추천", partnership: "활동량 연계 영양 설계" },
    ],
  },
  {
    group: "생활 · 돌봄",
    color: COLORS.purple,
    colorDim: COLORS.purpleDim,
    icon: "🐕",
    items: [
      { name: "반려견 유치원", desc: "돌봄 이행 검증 · 안심", partnership: "활동 리포트 자동 제공" },
      { name: "산책 서비스", desc: "동선 · 활동량 실시간 확인", partnership: "서비스 품질 인증" },
      { name: "펫 호텔/여행", desc: "외출 중 모니터링", partnership: "위치 기반 펫프렌들리 추천" },
      { name: "펫시터/훈련", desc: "행동 변화 추적", partnership: "훈련 효과 데이터 시각화" },
    ],
  },
  {
    group: "커뮤니티 · 웰니스",
    color: COLORS.cyan,
    colorDim: COLORS.cyanDim,
    icon: "🌐",
    items: [
      { name: "건강 챌린지", desc: "9988형 활동 보상 프로그램", partnership: "데이터 플랫폼 API 활용" },
      { name: "소셜 커뮤니티", desc: "반려견 소셜 네트워크", partnership: "매칭 · 모임 · 정보 공유" },
      { name: "지자체/공공", desc: "반려동물 등록 · 실종 방지", partnership: "공공 데이터 연계" },
    ],
  },
  {
    group: "커머스 · 라이프",
    color: COLORS.rose,
    colorDim: COLORS.roseDim,
    icon: "🛍️",
    items: [
      { name: "펫 용품/패션", desc: "사이즈 · 취향 맞춤 추천", partnership: "구매 데이터 연계 마케팅" },
      { name: "펫택시/이동", desc: "위치 기반 호출", partnership: "이동 패턴 데이터 활용" },
      { name: "펫 장례/추모", desc: "라이프사이클 케어", partnership: "헬스 데이터 기반 안내" },
    ],
  },
];

const FLYWHEEL_STEPS = [
  { label: "제품 판매", sub: "Pet Tracker 단품", icon: "📦", angle: 0 },
  { label: "데이터 수집", sub: "행동·활동·산책·이상징후", icon: "📊", angle: 72 },
  { label: "플랫폼 축적", sub: "Pet Data Platform", icon: "🧠", angle: 144 },
  { label: "파트너 가치", sub: "데이터 기반 B2B", icon: "🤝", angle: 216 },
  { label: "사용자 환원", sub: "서비스 확장 · 가격 혜택", icon: "💎", angle: 288 },
];

const SAMSUNG_SYNERGY = [
  { name: "Galaxy Watch", desc: "반려인+반려견 패밀리 룩 웨어러블", icon: "⌚" },
  { name: "Samsung Health", desc: "반려인-반려견 통합 건강 대시보드", icon: "❤️" },
  { name: "SmartThings", desc: "펫 재택 환경 자동화 (온도·조명·CCTV)", icon: "🏠" },
  { name: "Galaxy 생태계", desc: "갤럭시 사용자 Lock-in 강화", icon: "📱" },
];

const REVENUE_MODELS = [
  { type: "하드웨어", detail: "트래커 단품 판매", color: COLORS.accent },
  { type: "구독", detail: "프리미엄 서비스 월정액", color: COLORS.gold },
  { type: "RS/CPA", detail: "파트너 매출 연동 수수료", color: COLORS.green },
  { type: "데이터", detail: "익명화 인사이트 B2B", color: COLORS.purple },
  { type: "광고", detail: "타겟 마케팅 플랫폼", color: COLORS.rose },
];

function FlywheelDiagram() {
  const cx = 160, cy = 160, r = 110;
  return (
    <svg viewBox="0 0 320 320" style={{ width: "100%", maxWidth: 320 }}>
      <defs>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={COLORS.accent} stopOpacity="0.3" />
          <stop offset="100%" stopColor={COLORS.accent} stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      
      <circle cx={cx} cy={cy} r={140} fill="url(#centerGlow)" />
      
      {/* Arrows between steps */}
      {FLYWHEEL_STEPS.map((step, i) => {
        const next = FLYWHEEL_STEPS[(i + 1) % FLYWHEEL_STEPS.length];
        const a1 = (step.angle - 90) * Math.PI / 180;
        const a2 = (next.angle - 90) * Math.PI / 180;
        const midAngle = (a1 + a2) / 2 + (a2 < a1 ? Math.PI : 0);
        const arcR = r + 2;
        const x1 = cx + arcR * Math.cos(a1 + 0.15);
        const y1 = cy + arcR * Math.sin(a1 + 0.15);
        const x2 = cx + arcR * Math.cos(a2 - 0.15);
        const y2 = cy + arcR * Math.sin(a2 - 0.15);
        return (
          <path
            key={`arrow-${i}`}
            d={`M ${x1} ${y1} A ${arcR} ${arcR} 0 0 1 ${x2} ${y2}`}
            fill="none"
            stroke={COLORS.accent}
            strokeWidth="2"
            strokeDasharray="6 4"
            opacity="0.5"
            style={{
              animation: `dashMove 2s linear infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        );
      })}
      
      {/* Center */}
      <circle cx={cx} cy={cy} r={38} fill={COLORS.accentDim} stroke={COLORS.accent} strokeWidth="1.5" filter="url(#glow)" />
      <text x={cx} y={cy - 8} textAnchor="middle" fill={COLORS.accentLight} fontSize="11" fontWeight="700">Pet Data</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill={COLORS.accentLight} fontSize="11" fontWeight="700">Platform</text>
      <text x={cx} y={cy + 22} textAnchor="middle" fill={COLORS.textMuted} fontSize="7">데이터 플라이휠</text>
      
      {/* Steps */}
      {FLYWHEEL_STEPS.map((step, i) => {
        const angle = (step.angle - 90) * Math.PI / 180;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={28} fill={COLORS.card} stroke={COLORS.border} strokeWidth="1" />
            <text x={x} y={y - 10} textAnchor="middle" fontSize="14">{step.icon}</text>
            <text x={x} y={y + 4} textAnchor="middle" fill={COLORS.text} fontSize="8" fontWeight="600">{step.label}</text>
            <text x={x} y={y + 14} textAnchor="middle" fill={COLORS.textMuted} fontSize="5.5">{step.sub}</text>
          </g>
        );
      })}
      
      <style>{`
        @keyframes dashMove {
          to { stroke-dashoffset: -20; }
        }
      `}</style>
    </svg>
  );
}

function VerticalCard({ vertical, isExpanded, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        background: isExpanded ? vertical.colorDim : COLORS.card,
        border: `1px solid ${isExpanded ? vertical.color + "60" : COLORS.border}`,
        borderRadius: 12,
        padding: "14px 16px",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>{vertical.icon}</span>
          <div>
            <div style={{ color: vertical.color, fontSize: 14, fontWeight: 700 }}>{vertical.group}</div>
            <div style={{ color: COLORS.textMuted, fontSize: 11 }}>{vertical.items.length}개 버티컬</div>
          </div>
        </div>
        <span style={{ color: COLORS.textMuted, fontSize: 18, transform: isExpanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }}>▾</span>
      </div>
      
      {isExpanded && (
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          {vertical.items.map((item, j) => (
            <div key={j} style={{
              background: COLORS.bg + "80",
              borderRadius: 8,
              padding: "10px 12px",
              borderLeft: `3px solid ${vertical.color}40`,
            }}>
              <div style={{ color: COLORS.text, fontSize: 13, fontWeight: 600 }}>{item.name}</div>
              <div style={{ color: COLORS.textMuted, fontSize: 11, margin: "3px 0" }}>{item.desc}</div>
              <div style={{ color: vertical.color, fontSize: 10, opacity: 0.8 }}>→ {item.partnership}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PetPlatformFlywheel() {
  const [expandedVertical, setExpandedVertical] = useState(null);
  const [activeView, setActiveView] = useState("overview");

  return (
    <div style={{
      background: COLORS.bg,
      color: COLORS.text,
      minHeight: "100vh",
      fontFamily: "'Pretendard', 'Apple SD Gothic Neo', -apple-system, sans-serif",
      padding: "24px 20px",
      maxWidth: 1200,
      margin: "0 auto",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`,
            width: 32, height: 32, borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>🐾</div>
          <div>
            <div style={{ color: COLORS.textMuted, fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>Samsung MX · C-Lab → Sirius</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, background: `linear-gradient(90deg, ${COLORS.text}, ${COLORS.accentLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              올인원 펫 케어 플랫폼 비즈니스 모델
            </h1>
          </div>
        </div>
        <p style={{ color: COLORS.textMuted, fontSize: 12, margin: 0, lineHeight: 1.6, maxWidth: 700 }}>
          단순 제품·서비스가 아닌, <span style={{ color: COLORS.accent, fontWeight: 600 }}>반려견 데이터 플라이휠</span>을 통해 
          파트너 에코시스템을 구축하고 <span style={{ color: COLORS.gold, fontWeight: 600 }}>다중 수익 모델</span>로 확장하는 플랫폼 전략
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: COLORS.card, borderRadius: 10, padding: 4, width: "fit-content" }}>
        {[
          { id: "overview", label: "플라이휠 전체 구조" },
          { id: "verticals", label: "파트너 버티컬 상세" },
          { id: "samsung", label: "삼성 시너지" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            style={{
              background: activeView === tab.id ? COLORS.accent : "transparent",
              color: activeView === tab.id ? "#fff" : COLORS.textMuted,
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* === OVERVIEW VIEW === */}
      {activeView === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Left: Flywheel */}
          <div>
            <div style={{
              background: COLORS.card,
              borderRadius: 16,
              border: `1px solid ${COLORS.border}`,
              padding: 20,
              textAlign: "center",
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.accentLight, marginBottom: 4 }}>데이터 플라이휠</div>
              <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 12 }}>사용자↔데이터↔파트너 선순환 구조</div>
              <FlywheelDiagram />
            </div>

            {/* Revenue Models */}
            <div style={{
              background: COLORS.card,
              borderRadius: 16,
              border: `1px solid ${COLORS.border}`,
              padding: 16,
              marginTop: 16,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.gold, marginBottom: 12 }}>💰 수익 모델 (5-Layer)</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {REVENUE_MODELS.map((rev, i) => (
                  <div key={i} style={{
                    flex: "1 1 calc(50% - 4px)",
                    minWidth: 130,
                    background: COLORS.bg,
                    borderRadius: 8,
                    padding: "8px 10px",
                    borderLeft: `3px solid ${rev.color}`,
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: rev.color }}>{rev.type}</div>
                    <div style={{ fontSize: 10, color: COLORS.textMuted }}>{rev.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Freemium Structure */}
            <div style={{
              background: COLORS.card,
              borderRadius: 16,
              border: `1px solid ${COLORS.border}`,
              padding: 16,
              marginTop: 16,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>📱 서비스 구조 (Freemium)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div style={{ background: COLORS.bg, borderRadius: 8, padding: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted }}>🆓 무료 (Basic)</div>
                  <div style={{ fontSize: 10, color: COLORS.textDim, marginTop: 4, lineHeight: 1.5 }}>
                    기본 위치 추적<br/>일간 활동 요약<br/>펫 프로필 관리<br/>소셜 기본 기능
                  </div>
                </div>
                <div style={{ background: COLORS.accentDim, borderRadius: 8, padding: 10, border: `1px solid ${COLORS.accent}30` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.accentLight }}>⭐ 유료 (Premium)</div>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 4, lineHeight: 1.5 }}>
                    실시간 위치 추적<br/>행동 시각화 리포트<br/>이상 행동 감지 알림<br/>가족 공유 · AI 인사이트
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Partner Ecosystem Summary */}
          <div>
            <div style={{
              background: `linear-gradient(135deg, ${COLORS.accentDim}, ${COLORS.card})`,
              borderRadius: 16,
              border: `1px solid ${COLORS.accent}30`,
              padding: 16,
              marginBottom: 16,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.accentLight, marginBottom: 4 }}>🔗 파트너 에코시스템</div>
              <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 14 }}>
                펫 케어 롱테일 시장 — 5개 그룹, {VERTICALS.reduce((a, v) => a + v.items.length, 0)}개 버티컬
              </div>
              
              {/* Ecosystem Map */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {VERTICALS.map((v, i) => (
                  <div key={i} style={{
                    background: COLORS.bg,
                    borderRadius: 10,
                    padding: "10px 12px",
                    borderLeft: `3px solid ${v.color}`,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{v.icon}</span>
                      <div>
                        <span style={{ color: v.color, fontSize: 12, fontWeight: 700 }}>{v.group}</span>
                        <div style={{ color: COLORS.textMuted, fontSize: 10 }}>
                          {v.items.map(it => it.name).join(" · ")}
                        </div>
                      </div>
                    </div>
                    <span style={{ color: COLORS.textDim, fontSize: 10 }}>{v.items.length}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Value Exchange */}
            <div style={{
              background: COLORS.card,
              borderRadius: 16,
              border: `1px solid ${COLORS.border}`,
              padding: 16,
              marginBottom: 16,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>⚡ 가치 교환 구조</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { from: "반려인", arrow: "→", to: "플랫폼", value: "데이터 · 구독료 · 서비스 이용", color: COLORS.accent },
                  { from: "플랫폼", arrow: "→", to: "파트너", value: "익명화 데이터 · 고객 접점 · 인사이트", color: COLORS.gold },
                  { from: "파트너", arrow: "→", to: "반려인", value: "맞춤 서비스 · 할인 · 보상", color: COLORS.green },
                  { from: "파트너", arrow: "→", to: "플랫폼", value: "RS 수수료 · 서비스피 대납 · 광고비", color: COLORS.rose },
                ].map((flow, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: COLORS.bg, borderRadius: 8, padding: "8px 10px",
                  }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: flow.color, minWidth: 36 }}>{flow.from}</span>
                    <span style={{ color: flow.color, fontSize: 12 }}>{flow.arrow}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: flow.color, minWidth: 36 }}>{flow.to}</span>
                    <span style={{ fontSize: 10, color: COLORS.textMuted, marginLeft: 4 }}>{flow.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Types */}
            <div style={{
              background: COLORS.card,
              borderRadius: 16,
              border: `1px solid ${COLORS.border}`,
              padding: 16,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>📡 수집 데이터</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["행동 패턴", "활동량", "걸음수", "산책 동선", "수면 패턴", "이상 행동", "소셜 관계", "펫 프로필", "건강 지표", "환경 반응"].map((d, i) => (
                  <span key={i} style={{
                    background: COLORS.accentDim,
                    color: COLORS.accentLight,
                    fontSize: 10,
                    padding: "4px 10px",
                    borderRadius: 20,
                    fontWeight: 500,
                  }}>{d}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === VERTICALS VIEW === */}
      {activeView === "verticals" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {VERTICALS.map((v, i) => (
            <VerticalCard
              key={i}
              vertical={v}
              isExpanded={expandedVertical === i}
              onToggle={() => setExpandedVertical(expandedVertical === i ? null : i)}
            />
          ))}
          
          {/* Win-Win Summary */}
          <div style={{
            gridColumn: "1 / -1",
            background: `linear-gradient(135deg, ${COLORS.goldDim}, ${COLORS.card})`,
            borderRadius: 12,
            border: `1px solid ${COLORS.gold}30`,
            padding: 16,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.gold, marginBottom: 8 }}>💡 핵심 Win-Win 메커니즘</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div style={{ background: COLORS.bg, borderRadius: 8, padding: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.accent }}>파트너 Pain Point</div>
                <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 4, lineHeight: 1.6 }}>
                  • 사료사: 고객 발견 어려움, 실데이터 부재<br/>
                  • 보험사: 낮은 침투율<br/>
                  • 돌봄: 서비스 신뢰 입증 필요
                </div>
              </div>
              <div style={{ background: COLORS.bg, borderRadius: 8, padding: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.gold }}>우리가 제공하는 가치</div>
                <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 4, lineHeight: 1.6 }}>
                  • 실시간 반려견 데이터 인사이트<br/>
                  • 정밀 타겟 고객 접점<br/>
                  • 신뢰 검증 인프라
                </div>
              </div>
              <div style={{ background: COLORS.bg, borderRadius: 8, padding: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.green }}>우리가 얻는 가치</div>
                <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 4, lineHeight: 1.6 }}>
                  • RS 수수료 수익<br/>
                  • 유료 서비스피 파트너 대납<br/>
                  • 번들 판매로 하드웨어 확대
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === SAMSUNG SYNERGY VIEW === */}
      {activeView === "samsung" && (
        <div>
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.purpleDim}, ${COLORS.card})`,
            borderRadius: 16,
            border: `1px solid ${COLORS.purple}30`,
            padding: 20,
            marginBottom: 16,
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.purple, marginBottom: 4 }}>🔮 삼성 갤럭시 에코시스템 시너지</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 16 }}>
              펫 트래커를 통해 반려인을 삼성 생태계에 Lock-in하고, 디바이스 Cross-sell 기회를 창출
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {SAMSUNG_SYNERGY.map((s, i) => (
                <div key={i} style={{
                  background: COLORS.bg,
                  borderRadius: 12,
                  padding: 14,
                  border: `1px solid ${COLORS.border}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 22 }}>{s.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{s.name}</span>
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Synergy Flow */}
          <div style={{
            background: COLORS.card,
            borderRadius: 16,
            border: `1px solid ${COLORS.border}`,
            padding: 20,
            marginBottom: 16,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 14 }}>🔄 시너지 시나리오</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { title: "패밀리 룩 웨어러블", desc: "반려인은 Galaxy Watch, 반려견은 Pet Tracker — 산책 시 동시 활동 추적, 통합 리포트 생성", color: COLORS.accent },
                { title: "Samsung Health 통합", desc: "반려인 건강(걸음수·심박) + 반려견 건강(활동량·이상징후)을 하나의 대시보드로 — '우리 가족 건강' 경험", color: COLORS.green },
                { title: "SmartThings 연동", desc: "외출 시 반려견 행동 패턴 기반 자동 환경 제어 — 온도, 조명, CCTV 연계 알림", color: COLORS.gold },
                { title: "갤럭시 생태계 Lock-in", desc: "펫 서비스는 Samsung 디바이스 간 원활한 경험 → Android/Galaxy 전환 비용 상승 → 충성도 강화", color: COLORS.purple },
              ].map((s, i) => (
                <div key={i} style={{
                  background: COLORS.bg,
                  borderRadius: 10,
                  padding: "12px 14px",
                  borderLeft: `3px solid ${s.color}`,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 3, lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Positioning */}
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.accentDim}, ${COLORS.card})`,
            borderRadius: 16,
            border: `1px solid ${COLORS.accent}30`,
            padding: 20,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.accentLight, marginBottom: 10 }}>🎯 경영진 핵심 메시지</div>
            <div style={{
              fontSize: 14,
              color: COLORS.text,
              lineHeight: 1.8,
              fontWeight: 500,
              textAlign: "center",
              padding: "10px 20px",
            }}>
              "펫 트래커는 <span style={{ color: COLORS.accent, fontWeight: 700 }}>단순 제품이 아니라</span>,<br/>
              반려견 데이터를 중심으로 <span style={{ color: COLORS.gold, fontWeight: 700 }}>파트너 생태계</span>를 구축하고<br/>
              <span style={{ color: COLORS.green, fontWeight: 700 }}>다중 수익 모델</span>을 창출하며,<br/>
              나아가 <span style={{ color: COLORS.purple, fontWeight: 700 }}>삼성 갤럭시 생태계</span>의 차별화된 Lock-in 요소가 됩니다."
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: 24,
        padding: "12px 0",
        borderTop: `1px solid ${COLORS.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div style={{ fontSize: 9, color: COLORS.textDim }}>Samsung MX · C-Lab Pet Tracker → Sirius 전환 · 경영진 보고용</div>
        <div style={{ fontSize: 9, color: COLORS.textDim }}>Confidential</div>
      </div>
    </div>
  );
}
