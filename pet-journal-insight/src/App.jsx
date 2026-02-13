import { useState, useEffect, useCallback } from 'react';
import {
  Moon, Footprints, Activity, PenLine, ChevronDown, ChevronUp,
  Heart, AlertTriangle, Info, CheckCircle, Sparkles, Settings,
  UtensilsCrossed, Droplets, Pill, X, Dog, TrendingDown, TrendingUp,
  Zap, Clock,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart,
} from 'recharts';
import {
  scenarios, journalQuestions, calculateScore, generateInsights, weeklyData,
} from './data';

/* ─────────────── Circular Progress ─────────────── */
function VitalityRing({ score, size = 220, strokeWidth = 14 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  const color =
    score >= 80 ? '#10B981' : score >= 50 ? '#F59E0B' : '#E11D48';
  const label =
    score >= 80 ? '최적' : score >= 50 ? '주의' : '회복 필요';
  const bgGlow =
    score >= 80
      ? 'rgba(16,185,129,0.15)'
      : score >= 50
        ? 'rgba(245,158,11,0.15)'
        : 'rgba(225,29,72,0.15)';

  return (
    <div className="relative flex items-center justify-center">
      {/* Glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: size + 30,
          height: size + 30,
          background: `radial-gradient(circle, ${bgGlow} 0%, transparent 70%)`,
        }}
      />
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out circular-progress"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute flex flex-col items-center">
        <span
          className="text-6xl font-black tabular-nums tracking-tight transition-all duration-700"
          style={{ color }}
        >
          {score}
        </span>
        <span className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-widest">
          {label}
        </span>
      </div>
    </div>
  );
}

/* ─────────────── Metric Card ─────────────── */
function MetricCard({ icon: Icon, label, value, sub, alert }) {
  return (
    <div
      className={`
        rounded-2xl p-4 flex flex-col gap-1 border
        ${alert
          ? 'bg-rose-950/30 border-rose-800/40'
          : 'bg-white/[0.03] border-white/[0.06]'}
      `}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon size={16} className={alert ? 'text-rose-400' : 'text-brand-light'} />
        <span className="text-xs text-gray-400 font-medium">{label}</span>
      </div>
      <span className="text-xl font-bold">{value}</span>
      {sub && (
        <span className={`text-xs ${alert ? 'text-rose-400' : 'text-gray-500'}`}>
          {sub}
        </span>
      )}
    </div>
  );
}

/* ─────────────── Insight Card ─────────────── */
function InsightCard({ insight }) {
  const styles = {
    warning: {
      bg: 'bg-amber-950/30',
      border: 'border-amber-700/40',
      icon: <AlertTriangle size={18} className="text-amber-400" />,
      titleColor: 'text-amber-300',
    },
    alert: {
      bg: 'bg-rose-950/30',
      border: 'border-rose-700/40',
      icon: <AlertTriangle size={18} className="text-rose-400" />,
      titleColor: 'text-rose-300',
    },
    positive: {
      bg: 'bg-emerald-950/30',
      border: 'border-emerald-700/40',
      icon: <CheckCircle size={18} className="text-emerald-400" />,
      titleColor: 'text-emerald-300',
    },
    info: {
      bg: 'bg-blue-950/30',
      border: 'border-blue-700/40',
      icon: <Info size={18} className="text-blue-400" />,
      titleColor: 'text-blue-300',
    },
  };
  const s = styles[insight.type] || styles.info;

  return (
    <div className={`${s.bg} ${s.border} border rounded-2xl p-4 fade-in`}>
      <div className="flex items-center gap-2 mb-2">
        {s.icon}
        <span className={`font-semibold text-sm ${s.titleColor}`}>{insight.title}</span>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed">{insight.message}</p>
    </div>
  );
}

/* ─────────────── Journal Bottom Sheet ─────────────── */
function JournalSheet({ onClose, onSubmit }) {
  const [answers, setAnswers] = useState({
    meal: null,
    stool: null,
    medication: null,
    symptoms: [],
  });

  const [step, setStep] = useState(0);
  const currentQ = journalQuestions[step];
  const isMulti = currentQ.multi;
  const totalSteps = journalQuestions.length;

  const iconMap = {
    UtensilsCrossed,
    Droplets,
    Pill,
    AlertTriangle,
  };
  const QIcon = iconMap[currentQ.icon] || Info;

  function handleSelect(value) {
    if (isMulti) {
      setAnswers((prev) => {
        const arr = prev.symptoms || [];
        if (value === 'normal') return { ...prev, symptoms: ['normal'] };
        const filtered = arr.filter((v) => v !== 'normal');
        return {
          ...prev,
          symptoms: filtered.includes(value)
            ? filtered.filter((v) => v !== value)
            : [...filtered, value],
        };
      });
    } else {
      setAnswers((prev) => ({ ...prev, [currentQ.id]: value }));
      // Auto-advance after short delay
      if (step < totalSteps - 1) {
        setTimeout(() => setStep((s) => s + 1), 300);
      }
    }
  }

  function isSelected(value) {
    if (isMulti) return (answers.symptoms || []).includes(value);
    return answers[currentQ.id] === value;
  }

  function handleNext() {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    } else {
      onSubmit(answers);
    }
  }

  function handleBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  const canProceed = isMulti
    ? (answers.symptoms || []).length > 0
    : answers[currentQ.id] !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      {/* Sheet */}
      <div className="relative w-full max-w-[480px] bg-[#1A1A2E] rounded-t-3xl slide-up">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>
        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4">
          <div>
            <h2 className="text-lg font-bold">모닝 체크인</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {step + 1} / {totalSteps}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>
        {/* Progress bar */}
        <div className="px-5 mb-5">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
        {/* Question */}
        <div className="px-5 pb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center">
              <QIcon size={20} className="text-brand-light" />
            </div>
            <div>
              <span className="text-base font-semibold">{currentQ.label}</span>
              {isMulti && (
                <p className="text-xs text-gray-400 mt-0.5">여러 개 선택 가능</p>
              )}
            </div>
          </div>
          {/* Options grid */}
          <div className="grid grid-cols-2 gap-3">
            {currentQ.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`
                  rounded-xl p-4 text-center transition-all duration-200
                  border flex flex-col items-center gap-2
                  ${isSelected(opt.value)
                    ? 'bg-brand/20 border-brand text-white scale-[1.02]'
                    : 'bg-white/[0.03] border-white/[0.08] text-gray-300 hover:bg-white/[0.06]'}
                `}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-sm font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Actions */}
        <div className="px-5 pb-8 flex gap-3">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 py-3 rounded-xl bg-white/[0.06] text-sm font-medium"
            >
              이전
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`
              flex-1 py-3 rounded-xl text-sm font-semibold transition-all
              ${canProceed
                ? 'bg-brand text-white hover:bg-brand-light'
                : 'bg-white/[0.06] text-gray-500 cursor-not-allowed'}
            `}
          >
            {step === totalSteps - 1 ? '저널 저장' : '다음'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Reward Overlay ─────────────── */
function RewardOverlay({ onDone }) {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: 20 + Math.random() * 60,
      delay: Math.random() * 0.5,
      size: 16 + Math.random() * 20,
    }));
    setHearts(newHearts);
    const timer = setTimeout(onDone, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Hearts */}
      {hearts.map((h) => (
        <Heart
          key={h.id}
          size={h.size}
          className="absolute text-rose-400 fill-rose-400 heart-float"
          style={{
            left: `${h.left}%`,
            bottom: '40%',
            animationDelay: `${h.delay}s`,
          }}
        />
      ))}
      {/* Message */}
      <div className="text-center fade-in z-10">
        <div className="text-5xl mb-4">🐾</div>
        <h3 className="text-xl font-bold mb-2">기록해 주셔서 감사합니다</h3>
        <p className="text-gray-400 text-sm">뽀삐를 더 잘 이해하게 되었습니다</p>
      </div>
    </div>
  );
}

/* ─────────────── Weekly Chart ─────────────── */
function WeeklyChart({ data }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
      <h3 className="text-sm font-semibold mb-3 text-gray-300">주간 활력 점수</h3>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6200EA" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#6200EA" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 11 }}
          />
          <YAxis hide domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              background: '#1A1A2E',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              fontSize: 12,
            }}
            labelStyle={{ color: '#9CA3AF' }}
            formatter={(v) => [v !== null ? `${v}점` : '-', '점수']}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#7C4DFF"
            strokeWidth={2}
            fill="url(#scoreGrad)"
            dot={{ fill: '#7C4DFF', r: 3, strokeWidth: 0 }}
            connectNulls={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─────────────── Scenario Selector ─────────────── */
function ScenarioSelector({ current, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <Settings size={14} className="text-gray-500" />
          <span className="text-xs text-gray-400 font-medium">시나리오 변경 (Demo)</span>
        </div>
        {open ? (
          <ChevronUp size={14} className="text-gray-500" />
        ) : (
          <ChevronDown size={14} className="text-gray-500" />
        )}
      </button>
      {open && (
        <div className="mt-3 flex flex-col gap-2 fade-in">
          {Object.entries(scenarios).map(([key, sc]) => (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`
                text-left text-sm px-3 py-2.5 rounded-xl transition-all border
                ${current === key
                  ? 'bg-brand/20 border-brand text-white'
                  : 'bg-white/[0.03] border-white/[0.06] text-gray-400 hover:bg-white/[0.06]'}
              `}
            >
              {sc.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════ MAIN APP ═══════════════ */
export default function App() {
  const [scenarioKey, setScenarioKey] = useState('bad_day');
  const [journalCompleted, setJournalCompleted] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [score, setScore] = useState(65);
  const [prevScore, setPrevScore] = useState(null);
  const [insights, setInsights] = useState([]);
  const [journalAnswers, setJournalAnswers] = useState(null);
  const [scoreAnimating, setScoreAnimating] = useState(false);

  const scenario = scenarios[scenarioKey];
  const { sensorData } = scenario;

  // Reset on scenario change
  useEffect(() => {
    setScore(scenarios[scenarioKey].sensorData.baseScore);
    setJournalCompleted(false);
    setInsights([]);
    setJournalAnswers(null);
    setPrevScore(null);
  }, [scenarioKey]);

  const handleJournalSubmit = useCallback(
    (answers) => {
      setJournalAnswers(answers);
      setJournalOpen(false);
      setShowReward(true);

      const newScore = calculateScore(sensorData.baseScore, answers);
      const newInsights = generateInsights(sensorData, answers, sensorData.baseScore, newScore);

      setPrevScore(score);

      // Delay score update to let reward show first
      setTimeout(() => {
        setScoreAnimating(true);
        setScore(newScore);
        setInsights(newInsights);
        setJournalCompleted(true);
        setTimeout(() => setScoreAnimating(false), 800);
      }, 2000);
    },
    [sensorData, score]
  );

  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayStr = dayNames[today.getDay()] + '요일';

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex justify-center">
      <div className="w-full max-w-[480px] relative pb-20">
        {/* ── Header ── */}
        <header className="px-5 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-lg">
              <Dog size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">뽀삐</h1>
              <p className="text-xs text-gray-500">
                {dateStr} {dayStr}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08]">
            <Zap size={12} className="text-brand-light" />
            <span className="text-xs text-gray-300 font-medium">Pet Vitality</span>
          </div>
        </header>

        {/* ── Status Message ── */}
        <div className="px-5 mb-6">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3 flex items-start gap-3">
            <div className="mt-0.5">
              {score >= 80 ? (
                <Sparkles size={16} className="text-emerald-400" />
              ) : score >= 50 ? (
                <Info size={16} className="text-amber-400" />
              ) : (
                <AlertTriangle size={16} className="text-rose-400" />
              )}
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              {journalCompleted && insights.length > 0
                ? insights[0].message
                : scenario.message}
            </p>
          </div>
        </div>

        {/* ── Vitality Ring ── */}
        <div className="flex flex-col items-center mb-2">
          <div className={scoreAnimating ? 'score-animate' : ''}>
            <VitalityRing score={score} />
          </div>
          <p className="text-xs text-gray-500 mt-3 font-medium uppercase tracking-widest">
            Vitality Score
          </p>
          {prevScore !== null && prevScore !== score && (
            <div
              className={`flex items-center gap-1 mt-2 text-sm font-semibold fade-in ${
                score < prevScore ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {score < prevScore ? (
                <TrendingDown size={14} />
              ) : (
                <TrendingUp size={14} />
              )}
              <span>
                {prevScore}점 → {score}점 ({score - prevScore > 0 ? '+' : ''}
                {score - prevScore})
              </span>
            </div>
          )}
        </div>

        {/* ── Key Metrics ── */}
        <div className="px-5 mt-6 grid grid-cols-3 gap-3">
          <MetricCard
            icon={Moon}
            label="수면"
            value={`${sensorData.sleepHours}h`}
            sub={sensorData.sleepQuality >= 80 ? '양호' : '부족'}
            alert={sensorData.sleepQuality < 70}
          />
          <MetricCard
            icon={Activity}
            label="긁기/털기"
            value={`${sensorData.scratchCount}회`}
            sub={sensorData.scratchCount > 50 ? '평소보다 높음' : '정상 범위'}
            alert={sensorData.scratchCount > 50}
          />
          <MetricCard
            icon={Footprints}
            label="활동량"
            value={`${sensorData.activityKm}km`}
            sub={sensorData.activityLevel}
          />
        </div>

        {/* ── Journal CTA ── */}
        {!journalCompleted && (
          <div className="px-5 mt-6">
            <button
              onClick={() => setJournalOpen(true)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand to-brand-light text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity pulse-glow"
            >
              <PenLine size={18} />
              {scenarioKey === 'bad_day'
                ? '원인 파악을 위해 체크인해 주세요'
                : '모닝 체크인 작성하기'}
            </button>
          </div>
        )}

        {/* ── Journal Summary (after completion) ── */}
        {journalCompleted && journalAnswers && (
          <div className="px-5 mt-6 fade-in">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={14} className="text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">체크인 완료</span>
                <span className="text-xs text-gray-600 ml-auto">
                  <Clock size={12} className="inline mr-1" />
                  방금 전
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {journalAnswers.meal && (
                  <span className="text-xs bg-white/[0.06] px-2.5 py-1 rounded-full text-gray-400">
                    식사: {journalQuestions[0].options.find((o) => o.value === journalAnswers.meal)?.label}
                  </span>
                )}
                {journalAnswers.stool && (
                  <span className="text-xs bg-white/[0.06] px-2.5 py-1 rounded-full text-gray-400">
                    배변: {journalQuestions[1].options.find((o) => o.value === journalAnswers.stool)?.label}
                  </span>
                )}
                {journalAnswers.medication && (
                  <span className="text-xs bg-white/[0.06] px-2.5 py-1 rounded-full text-gray-400">
                    투약: {journalQuestions[2].options.find((o) => o.value === journalAnswers.medication)?.label}
                  </span>
                )}
                {journalAnswers.symptoms?.length > 0 && (
                  <span className="text-xs bg-white/[0.06] px-2.5 py-1 rounded-full text-gray-400">
                    특이: {journalAnswers.symptoms
                      .map((s) => journalQuestions[3].options.find((o) => o.value === s)?.label)
                      .join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Insights ── */}
        {insights.length > 0 && (
          <div className="px-5 mt-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-brand-light" />
              <span className="text-sm font-semibold text-gray-300">AI 인사이트</span>
            </div>
            {insights.map((ins, i) => (
              <InsightCard key={i} insight={ins} />
            ))}
          </div>
        )}

        {/* ── Weekly Chart ── */}
        <div className="px-5 mt-6">
          <WeeklyChart data={weeklyData} />
        </div>

        {/* ── Scenario Selector ── */}
        <div className="px-5 mt-6 mb-8">
          <ScenarioSelector current={scenarioKey} onChange={setScenarioKey} />
        </div>

        {/* ── Journal Bottom Sheet ── */}
        {journalOpen && (
          <JournalSheet
            onClose={() => setJournalOpen(false)}
            onSubmit={handleJournalSubmit}
          />
        )}

        {/* ── Reward Overlay ── */}
        {showReward && <RewardOverlay onDone={() => setShowReward(false)} />}
      </div>
    </div>
  );
}
