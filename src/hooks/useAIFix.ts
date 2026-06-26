import { useState, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { fixCode } from "@/lib/ai.functions";

export function useAIFix() {
  const [fixing, setFixing] = useState(false);
  const [fixedCode, setFixedCode] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const fixCodeFn = useServerFn(fixCode);

  const getAIFix = useCallback(
    async (code: string, error: string) => {
      setFixing(true);
      setFixedCode(null);
      setExplanation(null);
      try {
        const data = await fixCodeFn({ data: { code, error } });
        if (data.error) throw new Error(data.error);
        setFixedCode(data.fixedCode);
        setExplanation(data.explanation);
        return data.fixedCode;
      } catch (err) {
        console.error("AI fix error:", err);
        return null;
      } finally {
        setFixing(false);
      }
    },
    [fixCodeFn],
  );

  const clearFix = useCallback(() => {
    setFixedCode(null);
    setExplanation(null);
  }, []);

  return { fixing, fixedCode, explanation, getAIFix, clearFix };
}
