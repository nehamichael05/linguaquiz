import { useState, useEffect, useRef } from 'react'
import {
  Heart, Zap, Trophy, Star, ArrowRight, RotateCcw,
  Flame, Globe, ChevronRight, Check, X, Loader2,
  BookOpen, Target, Award
} from 'lucide-react'

const API_URL = 'https://linguaquiz.onrender.com'

// ─── DATA ────────────────────────────────────────────────────
const LANGUAGES = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸', color: '#f5a623' },
  { code: 'fr', name: 'French', flag: '🇫🇷', color: '#4a90d9' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', color: '#e74c3c' },
  { code: 'de', name: 'German', flag: '🇩🇪', color: '#2ecc71' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', color: '#ff6b35' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', color: '#27ae60' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷', color: '#16a085' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', color: '#c0392b' },
]

const LEVELS = [
  { id: 'beginner', label: 'Beginner', desc: 'Basic greetings & numbers', icon: '🌱', xp: 10 },
  { id: 'intermediate', label: 'Intermediate', desc: 'Common phrases & vocab', icon: '🌿', xp: 20 },
  { id: 'advanced', label: 'Advanced', desc: 'Grammar & complex sentences', icon: '🌳', xp: 30 },
]

const OPTION_LABELS = ['A', 'B', 'C', 'D']

// ─── SCREENS ─────────────────────────────────────────────────

// Home Screen
function HomeScreen({ xp, streak, onStart }) {
  const [selectedLang, setSelectedLang] = useState(null)
  const [selectedLevel, setSelectedLevel] = useState(null)

  return (
    <div className="fade-in">
      {/* Header stats */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <Globe size={16} className="text-white"/>
          </div>
          <span className="font-black text-xl text-white">Lingua<span className="text-[#58cc02]">Quiz</span></span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-[#161b22] border border-[#21262d] rounded-full px-3 py-1.5">
            <Flame size={14} className="text-orange-400"/>
            <span className="text-sm font-bold text-orange-400">{streak}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#161b22] border border-[#21262d] rounded-full px-3 py-1.5">
            <Zap size={14} className="text-yellow-400"/>
            <span className="text-sm font-bold text-yellow-400">{xp} XP</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-black mb-2">What do you want to learn? 🌍</h1>
        <p className="text-[#8b949e] text-sm">AI generates fresh questions every time</p>
      </div>

      {/* Language grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {LANGUAGES.map(lang => (
          <button key={lang.code} onClick={() => setSelectedLang(lang)}
            className={`p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
              selectedLang?.code === lang.code
                ? 'border-[#58cc02] bg-[#58cc02]/10 scale-[1.02]'
                : 'border-[#21262d] bg-[#0d1117] hover:border-[#30363d]'
            }`}>
            <span className="text-3xl">{lang.flag}</span>
            <span className="text-sm font-semibold text-[#c9d1d9]">{lang.name}</span>
          </button>
        ))}
      </div>

      {/* Level selection */}
      {selectedLang && (
        <div className="fade-in mb-8">
          <p className="text-sm text-[#8b949e] uppercase tracking-widest mb-3">Choose difficulty</p>
          <div className="grid grid-cols-3 gap-3">
            {LEVELS.map(level => (
              <button key={level.id} onClick={() => setSelectedLevel(level)}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                  selectedLevel?.id === level.id
                    ? 'border-[#58cc02] bg-[#58cc02]/10'
                    : 'border-[#21262d] bg-[#0d1117] hover:border-[#30363d]'
                }`}>
                <div className="text-2xl mb-2">{level.icon}</div>
                <div className="font-bold text-sm text-white">{level.label}</div>
                <div className="text-xs text-[#8b949e] mt-0.5">{level.desc}</div>
                <div className="text-xs text-yellow-400 mt-1 flex items-center gap-1">
                  <Zap size={10}/> +{level.xp} XP/question
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Start button */}
      {selectedLang && selectedLevel && (
        <div className="fade-in">
          <button onClick={() => onStart(selectedLang, selectedLevel)}
            className="w-full py-4 rounded-2xl font-black text-white text-lg bg-[#58cc02] hover:bg-[#46a302] active:scale-[0.99] transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2">
            Start Learning {selectedLang.flag}
            <ArrowRight size={20}/>
          </button>
        </div>
      )}
    </div>
  )
}

// Loading Screen
function LoadingScreen({ language }) {
  const tips = [
    "Did you know? Learning a language improves memory! 🧠",
    "Consistent practice beats marathon sessions! 📅",
    "Mistakes are proof that you're trying! 💪",
    "AI is crafting fresh questions just for you! ✨",
  ]
  const [tip] = useState(tips[Math.floor(Math.random() * tips.length)])

  return (
    <div className="fade-in flex flex-col items-center justify-center min-h-[400px] gap-6">
      <div className="text-6xl animate-bounce">{language.flag}</div>
      <div className="w-12 h-12 rounded-full border-3 border-[#58cc02] border-t-transparent animate-spin" style={{ borderWidth: 3 }}></div>
      <div className="text-center">
        <p className="text-white font-bold mb-1">Generating your {language.name} quiz...</p>
        <p className="text-[#8b949e] text-sm max-w-xs text-center">{tip}</p>
      </div>
    </div>
  )
}

// Quiz Screen
function QuizScreen({ questions, language, level, onComplete, onLoseLife, lives, xp, streak }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [shaking, setShaking] = useState(false)
  const [xpGained, setXpGained] = useState(null)
  const xpRef = useRef(null)

  const question = questions[current]
  const progress = ((current) / questions.length) * 100

  const handleSelect = (idx) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)

    if (idx === question.correct) {
      setScore(s => s + 1)
      const gained = level.xp
      setXpGained(gained)
      setTimeout(() => setXpGained(null), 1000)
    } else {
      setShaking(true)
      onLoseLife()
      setTimeout(() => setShaking(false), 400)
    }
  }

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      onComplete(score + (selected === question.correct ? 1 : 0))
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  const getOptionClass = (idx) => {
    if (!answered) return 'option-btn'
    if (idx === question.correct) return 'option-btn correct'
    if (idx === selected && idx !== question.correct) return 'option-btn wrong'
    return 'option-btn opacity-50'
  }

  return (
    <div className="fade-in">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart key={i} size={22} className={i < lives ? 'text-red-400 fill-red-400' : 'text-[#30363d]'}/>
          ))}
        </div>
        <div className="flex-1 h-3 bg-[#21262d] rounded-full overflow-hidden">
          <div className="progress-bar h-full bg-gradient-to-r from-[#58cc02] to-[#46a302] rounded-full"
            style={{ width: `${progress}%` }}></div>
        </div>
        <span className="text-xs text-[#8b949e] font-mono whitespace-nowrap">{current + 1}/{questions.length}</span>
      </div>

      {/* Language + level badge */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-lg">{language.flag}</span>
        <span className="text-sm font-semibold text-[#c9d1d9]">{language.name}</span>
        <span className="text-xs text-[#8b949e] bg-[#161b22] border border-[#21262d] rounded-full px-2 py-0.5">{level.label}</span>
        <span className="ml-auto flex items-center gap-1 text-xs text-yellow-400">
          <Zap size={11}/>{xp} XP
        </span>
      </div>

      {/* Question type badge */}
      <div className="mb-4">
        <span className="text-xs text-[#58cc02] uppercase tracking-widest font-bold">
          {question.type === 'translate' ? '🔤 Translate' :
           question.type === 'reverse' ? '↩️ What does this mean?' :
           question.type === 'fill' ? '✏️ Fill in the blank' :
           '💭 Word meaning'}
        </span>
      </div>

      {/* Question */}
      <div className={`bg-[#0d1117] border border-[#21262d] rounded-2xl p-6 mb-6 relative ${shaking ? 'shake' : ''}`}>
        <p className="text-xl font-bold text-white leading-relaxed">{question.question}</p>
        {xpGained && (
          <div className="absolute top-2 right-4 text-yellow-400 font-black text-sm xp-float">
            +{xpGained} XP!
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {question.options.map((opt, idx) => (
          <button key={idx} onClick={() => handleSelect(idx)} disabled={answered}
            className={`${getOptionClass(idx)} bg-[#0d1117] rounded-2xl p-4 text-left flex items-center gap-4 w-full`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${
              answered && idx === question.correct ? 'bg-[#58cc02] text-white' :
              answered && idx === selected && idx !== question.correct ? 'bg-red-500 text-white' :
              'bg-[#21262d] text-[#8b949e]'
            }`}>
              {answered && idx === question.correct ? <Check size={14}/> :
               answered && idx === selected && idx !== question.correct ? <X size={14}/> :
               OPTION_LABELS[idx]}
            </div>
            <span className="text-sm font-medium text-[#c9d1d9]">{opt}</span>
          </button>
        ))}
      </div>

      {/* Explanation + Next */}
      {answered && (
        <div className="fade-in space-y-3">
          <div className={`rounded-2xl p-4 border ${
            selected === question.correct
              ? 'bg-[#58cc02]/10 border-[#58cc02]/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <p className={`text-sm font-bold mb-1 ${selected === question.correct ? 'text-[#58cc02]' : 'text-red-400'}`}>
              {selected === question.correct ? '✅ Correct!' : '❌ Not quite!'}
            </p>
            <p className="text-xs text-[#8b949e]">{question.explanation}</p>
          </div>
          <button onClick={handleNext}
            className="w-full py-4 rounded-2xl font-black text-white bg-[#58cc02] hover:bg-[#46a302] transition-all flex items-center justify-center gap-2">
            {current + 1 >= questions.length ? 'See Results 🏆' : 'Continue'}
            <ChevronRight size={18}/>
          </button>
        </div>
      )}
    </div>
  )
}

// Complete Screen
function CompleteScreen({ score, total, language, level, xpEarned, onRestart, onHome }) {
  const percent = Math.round((score / total) * 100)
  const stars = percent >= 90 ? 3 : percent >= 60 ? 2 : 1

  return (
    <div className="fade-in text-center">
      <div className="text-7xl mb-4">{percent >= 90 ? '🏆' : percent >= 60 ? '🎉' : '💪'}</div>
      <h2 className="text-3xl font-black mb-2">
        {percent >= 90 ? 'Amazing!' : percent >= 60 ? 'Great job!' : 'Keep going!'}
      </h2>
      <p className="text-[#8b949e] mb-8">
        {language.flag} {language.name} · {level.label}
      </p>

      {/* Stars */}
      <div className="flex justify-center gap-2 mb-6">
        {[1,2,3].map(s => (
          <Star key={s} size={36} className={s <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-[#30363d]'}/>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-4">
          <div className="text-2xl font-black text-white">{score}/{total}</div>
          <div className="text-xs text-[#8b949e] mt-1">Correct</div>
        </div>
        <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-4">
          <div className="text-2xl font-black text-[#58cc02]">{percent}%</div>
          <div className="text-xs text-[#8b949e] mt-1">Accuracy</div>
        </div>
        <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-4">
          <div className="text-2xl font-black text-yellow-400">+{xpEarned}</div>
          <div className="text-xs text-[#8b949e] mt-1">XP Earned</div>
        </div>
      </div>

      <div className="space-y-3">
        <button onClick={onRestart}
          className="w-full py-4 rounded-2xl font-black text-white bg-[#58cc02] hover:bg-[#46a302] transition-all flex items-center justify-center gap-2">
          <RotateCcw size={18}/> Practice Again
        </button>
        <button onClick={onHome}
          className="w-full py-3 rounded-2xl font-semibold text-[#58cc02] border border-[#58cc02]/40 hover:bg-[#58cc02]/10 transition-all">
          Choose Different Language
        </button>
      </div>
    </div>
  )
}

// Game Over Screen
function GameOverScreen({ onRestart, onHome }) {
  return (
    <div className="fade-in text-center">
      <div className="text-7xl mb-4">💔</div>
      <h2 className="text-3xl font-black mb-2">Out of lives!</h2>
      <p className="text-[#8b949e] mb-8">Don't worry — practice makes perfect!</p>
      <div className="space-y-3">
        <button onClick={onRestart}
          className="w-full py-4 rounded-2xl font-black text-white bg-red-500 hover:bg-red-600 transition-all flex items-center justify-center gap-2">
          <RotateCcw size={18}/> Try Again
        </button>
        <button onClick={onHome}
          className="w-full py-3 rounded-2xl font-semibold text-[#8b949e] border border-[#21262d] hover:border-[#30363d] transition-all">
          Go Home
        </button>
      </div>
    </div>
  )
}

// ─── MAIN APP ────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('home')
  const [language, setLanguage] = useState(null)
  const [level, setLevel] = useState(null)
  const [questions, setQuestions] = useState([])
  const [lives, setLives] = useState(3)
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [xpEarned, setXpEarned] = useState(0)
  const [error, setError] = useState('')

  const startQuiz = async (lang, lvl) => {
    setLanguage(lang)
    setLevel(lvl)
    setLives(3)
    setXpEarned(0)
    setError('')
    setScreen('loading')

    try {
      const res = await fetch(`${API_URL}/generate-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang.name, level: lvl.id, count: 7 })
      })
      if (!res.ok) throw new Error('Failed to generate quiz')
      const data = await res.json()
      setQuestions(data.questions)
      setScreen('quiz')
    } catch (err) {
      setError('Could not load quiz. Check your connection and try again.')
      setScreen('home')
    }
  }

  const handleLoseLife = () => {
    setLives(l => {
      if (l - 1 <= 0) {
        setTimeout(() => setScreen('gameover'), 600)
      }
      return l - 1
    })
  }

  const handleComplete = (score) => {
    const earned = score * level.xp
    setXp(x => x + earned)
    setXpEarned(earned)
    setStreak(s => s + 1)
    setScreen('complete')
  }

  const handleRestart = () => startQuiz(language, level)
  const handleHome = () => setScreen('home')

  return (
    <div className="min-h-screen bg-[#0a0f1a] py-8 px-4">
      <div className="max-w-lg mx-auto">
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        {screen === 'home' && <HomeScreen xp={xp} streak={streak} onStart={startQuiz}/>}
        {screen === 'loading' && <LoadingScreen language={language}/>}
        {screen === 'quiz' && (
          <QuizScreen
            questions={questions}
            language={language}
            level={level}
            lives={lives}
            xp={xp}
            streak={streak}
            onComplete={handleComplete}
            onLoseLife={handleLoseLife}
          />
        )}
        {screen === 'complete' && (
          <CompleteScreen
            score={questions.filter((_, i) => i < questions.length).length}
            total={questions.length}
            language={language}
            level={level}
            xpEarned={xpEarned}
            onRestart={handleRestart}
            onHome={handleHome}
          />
        )}
        {screen === 'gameover' && <GameOverScreen onRestart={handleRestart} onHome={handleHome}/>}

        <footer className="mt-10 text-center text-xs text-[#484f58]">
          Built with React + FastAPI + Claude AI
        </footer>
      </div>
    </div>
  )
}
