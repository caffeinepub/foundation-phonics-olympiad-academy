import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import BottomNav from "../components/BottomNav";
import TopBar from "../components/TopBar";
import { useGetWorksheets } from "../hooks/useQueries";

type PhonicsEntry = {
  letter: string;
  word: string;
  emoji: string;
  ipa: string;
};

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

const PHONICS_DATA: PhonicsEntry[] = [
  { letter: "A", word: "Apple", emoji: "🍎", ipa: "/æ/" },
  { letter: "B", word: "Ball", emoji: "⚽", ipa: "/b/" },
  { letter: "C", word: "Cat", emoji: "🐱", ipa: "/k/" },
  { letter: "D", word: "Dog", emoji: "🐶", ipa: "/d/" },
  { letter: "E", word: "Elephant", emoji: "🐘", ipa: "/ɛ/" },
  { letter: "F", word: "Fish", emoji: "🐟", ipa: "/f/" },
  { letter: "G", word: "Goat", emoji: "🐐", ipa: "/g/" },
  { letter: "H", word: "Hat", emoji: "🎩", ipa: "/h/" },
  { letter: "I", word: "Ice", emoji: "🧊", ipa: "/aɪ/" },
  { letter: "J", word: "Jug", emoji: "🫙", ipa: "/dʒ/" },
  { letter: "K", word: "Kite", emoji: "🪁", ipa: "/k/" },
  { letter: "L", word: "Lion", emoji: "🦁", ipa: "/l/" },
  { letter: "M", word: "Moon", emoji: "🌙", ipa: "/m/" },
  { letter: "N", word: "Nest", emoji: "🪺", ipa: "/n/" },
  { letter: "O", word: "Orange", emoji: "🍊", ipa: "/ɒ/" },
  { letter: "P", word: "Pen", emoji: "✏️", ipa: "/p/" },
  { letter: "Q", word: "Queen", emoji: "👑", ipa: "/kw/" },
  { letter: "R", word: "Rain", emoji: "🌧️", ipa: "/r/" },
  { letter: "S", word: "Sun", emoji: "☀️", ipa: "/s/" },
  { letter: "T", word: "Tree", emoji: "🌳", ipa: "/t/" },
  { letter: "U", word: "Umbrella", emoji: "☂️", ipa: "/ʌ/" },
  { letter: "V", word: "Van", emoji: "🚐", ipa: "/v/" },
  { letter: "W", word: "Water", emoji: "💧", ipa: "/w/" },
  { letter: "X", word: "Xylophone", emoji: "🎵", ipa: "/z/" },
  { letter: "Y", word: "Yellow", emoji: "💛", ipa: "/j/" },
  { letter: "Z", word: "Zebra", emoji: "🦓", ipa: "/z/" },
];

const SAMPLE_WORKSHEETS = [
  {
    id: BigInt(1),
    title: "Vowel Sounds Practice",
    description:
      "Practice the 5 vowel sounds A, E, I, O, U with fun activities.",
  },
  {
    id: BigInt(2),
    title: "Consonant Blends",
    description:
      "Learn bl, cl, fl, gl, pl, sl blends with illustrated examples.",
  },
  {
    id: BigInt(3),
    title: "CVC Words Worksheet",
    description:
      "Practice reading and writing consonant-vowel-consonant words.",
  },
];

export default function PhonicsPage() {
  const [tab, setTab] = useState<"soundboard" | "worksheets">("soundboard");
  const [selected, setSelected] = useState<PhonicsEntry | null>(null);
  const { data: worksheets, isLoading } = useGetWorksheets();

  const worksheetList =
    !isLoading && worksheets && worksheets.length > 0
      ? worksheets
      : SAMPLE_WORKSHEETS;

  return (
    <div className="min-h-screen bg-app-bg">
      <TopBar title="Phonics" />

      {/* Tab Switcher */}
      <div className="px-4 py-3">
        <div className="flex bg-white rounded-2xl p-1 shadow-xs">
          <button
            type="button"
            data-ocid="phonics.soundboard.tab"
            onClick={() => setTab("soundboard")}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: tab === "soundboard" ? "#0A8C84" : "transparent",
              color: tab === "soundboard" ? "#fff" : "#6B7280",
            }}
          >
            🔊 Sound Board
          </button>
          <button
            type="button"
            data-ocid="phonics.worksheets.tab"
            onClick={() => setTab("worksheets")}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: tab === "worksheets" ? "#0A8C84" : "transparent",
              color: tab === "worksheets" ? "#fff" : "#6B7280",
            }}
          >
            📄 Worksheets
          </button>
        </div>
      </div>

      <main className="px-4 pb-24">
        <AnimatePresence mode="wait">
          {tab === "soundboard" ? (
            <motion.div
              key="soundboard"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-app-muted text-xs mb-3">
                Tap any letter to hear its sound 🎵
              </p>
              <div className="grid grid-cols-5 gap-2">
                {PHONICS_DATA.map((p) => {
                  const isVowel = VOWELS.has(p.letter);
                  return (
                    <button
                      key={p.letter}
                      type="button"
                      data-ocid="phonics.letter.button"
                      onClick={() => setSelected(p)}
                      className="aspect-square rounded-2xl flex items-center justify-center font-display font-extrabold text-xl text-white shadow-card transition-transform active:scale-90"
                      style={{ background: isVowel ? "#F39A3A" : "#0A8C84" }}
                    >
                      {p.letter}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-3 mt-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-md bg-amber" />
                  <span className="text-xs text-app-muted">Vowels</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-md bg-teal" />
                  <span className="text-xs text-app-muted">Consonants</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="worksheets"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {isLoading ? (
                <div
                  data-ocid="phonics.worksheets.loading_state"
                  className="space-y-3"
                >
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-4 animate-pulse shadow-card"
                    >
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                worksheetList.map((w, i) => (
                  <div
                    key={String(w.id)}
                    data-ocid={`phonics.worksheet.item.${i + 1}`}
                    className="bg-white rounded-2xl p-4 shadow-card"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ background: "#E8F5F4" }}
                      >
                        📄
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-app-text">
                          {w.title}
                        </p>
                        <p className="text-xs text-app-muted mt-0.5 mb-3">
                          {w.description}
                        </p>
                        <button
                          type="button"
                          data-ocid={`phonics.worksheet.button.${i + 1}`}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                          style={{ background: "#0A8C84" }}
                        >
                          📥 View Worksheet
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Letter Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-5"
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="bg-white rounded-3xl p-8 w-full max-w-xs text-center shadow-card"
              onClick={(e) => e.stopPropagation()}
              data-ocid="phonics.letter.modal"
            >
              <div
                className="w-24 h-24 rounded-3xl flex items-center justify-center text-6xl font-display font-black text-white mx-auto mb-4"
                style={{
                  background: VOWELS.has(selected.letter)
                    ? "#F39A3A"
                    : "#0A8C84",
                }}
              >
                {selected.letter}
              </div>
              <div className="text-5xl mb-3 animate-pulse-icon">
                {selected.emoji}
              </div>
              <p className="font-display font-extrabold text-2xl text-app-text">
                {selected.letter} = {selected.word}
              </p>
              <p
                className="font-mono text-xl font-bold mt-1"
                style={{
                  color: VOWELS.has(selected.letter) ? "#F39A3A" : "#0A8C84",
                }}
              >
                {selected.ipa}
              </p>
              <p className="text-app-muted text-sm mt-2">🔊 Say it out loud!</p>
              <button
                type="button"
                data-ocid="phonics.letter.close_button"
                onClick={() => setSelected(null)}
                className="mt-5 w-full py-3 rounded-2xl font-bold text-white text-sm"
                style={{ background: "#0A8C84" }}
              >
                Got it! ✓
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
