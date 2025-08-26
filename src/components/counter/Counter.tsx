"use client";
import { counterAtom } from "@/state/testCounterAtom";
import { useAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";

export default function Counter() {
  const [count, setCount] = useAtom(counterAtom);
  const { data } = useQuery({ queryKey: ["demo"], queryFn: async () => {
    const res = await fetch("/api/user");
    return res.json();
  }});

  return (
    <div>
      <p>Jotai Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Jotai Atom Increment</button>
      <p className="text-sm opacity-70">TanStack Query: {data?.message ?? "loading..."}</p>
    </div>
  );
}
