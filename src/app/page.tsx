"use client";

import Counter from "@/components/counter/Counter";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { counterAtom } from "@/state/testCounterAtom";
import { useAtom } from "jotai";

export default function Home() {
  const [count, setCount] = useAtom(counterAtom);
  return (
    <>
      <div className="flex justify-end mb-4 border border-red-400">
        <ThemeToggle />
      </div>
      <Button variant={"default"} className="w-full">
        ShadCN Button with tailwind w-full
      </Button>
      Jotai Count Here : {count}
      <Counter />
      <Button
        variant={"default"}
        className="w-full"
        onClick={() => setCount((c) => c - 1)}
      >
        Jotai Atom Decrement
      </Button>
    </>
  );
}
