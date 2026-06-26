import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { z } from "zod";
import { lessonCategories, getAllLessons } from "@/lib/lessons-data";
import { ChevronLeft, ChevronRight, Play, Search, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const searchSchema = z.object({ id: z.string().optional() });

export const Route = createFileRoute("/lessons")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Lessons — PY Play" },
      { name: "description", content: "Step-by-step Python lessons with runnable examples." },
    ],
  }),
  component: LessonsPage,
});

function LessonsPage() {
  const navigate = useNavigate();
  const { id: lessonId } = useSearch({ from: "/lessons" });
  const [searchQuery, setSearchQuery] = useState("");
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, number | null>>({});
  const [exerciseSubmitted, setExerciseSubmitted] = useState<Record<string, boolean>>({});

  const allLessons = useMemo(() => getAllLessons(), []);
  const currentIdx = lessonId ? allLessons.findIndex((l) => l.lesson.id === lessonId) : -1;
  const current = currentIdx >= 0 ? allLessons[currentIdx] : null;
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  const handleTryCode = (code: string) => {
    const encoded = btoa(encodeURIComponent(code));
    window.location.href = "/?code=" + encoded;
  };

  const goToLesson = (id: string) => {
    navigate({ to: "/lessons", search: { id } });
    setExerciseAnswers({});
    setExerciseSubmitted({});
    window.scrollTo(0, 0);
  };

  const filteredCategories = searchQuery
    ? lessonCategories
        .map((cat) => ({
          ...cat,
          lessons: cat.lessons.filter(
            (l) =>
              l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              l.description.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        }))
        .filter((cat) => cat.lessons.length > 0)
    : lessonCategories;

  if (current) {
    const lesson = current.lesson;
    return (
      <div className="min-h-[100dvh] flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 space-y-8">
            <div className="flex items-center justify-between">
              {prevLesson ? (
                <button onClick={() => goToLesson(prevLesson.lesson.id)} className="flex items-center gap-1 rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/20">
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
              ) : <div />}
              {nextLesson ? (
                <button onClick={() => goToLesson(nextLesson.lesson.id)} className="flex items-center gap-1 rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/20">
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              ) : <div />}
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">{current.categoryTitle}</p>
              <h1 className="text-2xl sm:text-3xl font-bold">{lesson.title}</h1>
              <p className="text-muted-foreground mt-1">{lesson.description}</p>
            </div>

            <div className="text-sm text-foreground/85 whitespace-pre-line leading-relaxed border-l-4 border-primary/30 pl-4">
              {lesson.theory}
            </div>

            {lesson.examples.map((ex, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-lg font-semibold">{ex.title}</h3>
                {ex.description && <p className="text-sm text-muted-foreground">{ex.description}</p>}
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                  <pre className="p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap">{ex.code}</pre>
                  <div className="border-t border-border bg-card/80 px-4 py-2">
                    <Button onClick={() => handleTryCode(ex.code)} size="sm" className="gap-1.5 bg-primary text-primary-foreground">
                      <Play className="h-3 w-3" /> Try it Yourself »
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {lesson.exercises.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                <h2 className="text-xl font-bold text-center">Exercise</h2>
                {lesson.exercises.map((ex, idx) => {
                  const key = `${lesson.id}-${idx}`;
                  const selected = exerciseAnswers[key];
                  const submitted = exerciseSubmitted[key];
                  const correct = selected === ex.answer;
                  return (
                    <div key={idx} className="space-y-3">
                      <p className="font-medium">{ex.question}</p>
                      {ex.code && <pre className="rounded-md bg-background p-3 text-sm font-mono">{ex.code}</pre>}
                      <div className="space-y-2">
                        {ex.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => !submitted && setExerciseAnswers((p) => ({ ...p, [key]: optIdx }))}
                            disabled={!!submitted}
                            className={`w-full text-left rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                              submitted
                                ? optIdx === ex.answer
                                  ? "border-primary bg-primary/10 text-primary"
                                  : optIdx === selected
                                    ? "border-destructive bg-destructive/10 text-destructive"
                                    : "border-border text-muted-foreground"
                                : selected === optIdx
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-muted-foreground/50"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              {opt}
                              {submitted && optIdx === ex.answer && <CheckCircle2 className="h-4 w-4 ml-auto text-primary" />}
                              {submitted && optIdx === selected && optIdx !== ex.answer && <XCircle className="h-4 w-4 ml-auto text-destructive" />}
                            </span>
                          </button>
                        ))}
                      </div>
                      {!submitted && (
                        <Button
                          onClick={() => setExerciseSubmitted((p) => ({ ...p, [key]: true }))}
                          disabled={selected == null}
                          size="sm"
                        >
                          Submit Answer »
                        </Button>
                      )}
                      {submitted && (
                        <p className={`text-sm font-medium ${correct ? "text-primary" : "text-destructive"}`}>
                          {correct ? "✅ Correct!" : `❌ Wrong! Answer: ${ex.options[ex.answer]}`}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">📚 Python Tutorial</h1>
            <p className="text-muted-foreground">Learn Python step by step</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lessons…"
              className="w-full rounded-lg border border-border bg-card pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="rounded-xl border border-border bg-card p-4">
              <h2 className="text-lg font-semibold mb-2">{cat.title}</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {cat.lessons.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => goToLesson(l.id)}
                    className="text-left rounded-md border border-border px-3 py-2 hover:border-primary/50 transition-colors"
                  >
                    <div className="text-sm font-medium">{l.title}</div>
                    <div className="text-xs text-muted-foreground">{l.description}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
