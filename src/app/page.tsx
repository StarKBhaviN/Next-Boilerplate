"use client";

import Counter from "@/components/counter/Counter";
import { Button } from "@/components/ui/button";
import { counterAtom } from "@/state/testCounterAtom";
import { useAtom } from "jotai";

export default function Home() {
  const [count, setCount] = useAtom(counterAtom);
  return (
    <>
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
      <p>You are not signed in</p>
      <Button variant={"default"} className="w-full">
        Sign in
      </Button>
    </>
  );
}
