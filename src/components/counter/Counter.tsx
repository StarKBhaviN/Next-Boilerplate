"use client";
import { counterAtom } from "@/state/testCounterAtom";
import { useAtom } from "jotai";

export default function Counter() {
  const [count, setCount] = useAtom(counterAtom);

  return (
    <div>
      <p>Jotai Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Jotai Atom Increment</button>
    </div>
  );
}
