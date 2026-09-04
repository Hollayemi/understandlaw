"use client";
import React, { useState } from "react";
import HomeWrapper from "@/app/components/wrapper";
import { CTASection } from "@/app/components/sections/OtherSections";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import WaitlistPage from "../components/ui/comingSoon";


export default function BlogPage() {
  const [active, setActive] = useState("All");
  
  return (
   <WaitlistPage />
  );
}
