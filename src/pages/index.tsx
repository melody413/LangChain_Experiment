import Header from "@/components/header/Header";
import Input from "@/components/input/Input";
import Navbar from "@/components/navbar/Navbar";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<Messages>([]);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Navbar/>
      <Header messages={messages} />
      <Input setMessages={setMessages} />
    </main>
  )
}
