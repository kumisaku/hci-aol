"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PlannerEditor } from "@/components/planner/PlannerEditor";
import { getLayout } from "@/lib/storage";
import type { Layout } from "@/types";

export default function EditPlannerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [layout, setLayout] = useState<Layout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const l = getLayout(id);
    if (!l) {
      router.replace("/planner");
      return;
    }
    setLayout(l);
    setLoading(false);
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-muted">Memuat layout...</div>
      </div>
    );
  }

  if (!layout) return null;

  return <PlannerEditor initialLayout={layout} />;
}
