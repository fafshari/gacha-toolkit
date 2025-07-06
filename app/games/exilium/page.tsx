import DragAndDrop from "@/components/dnd/DragAndDrop";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gunsmoke Exilium Team Planner | Gacha Toolkit",
  description:
    "Plan your Gunsmoke Exilium teams by dragging and dropping dolls into position slots. Optimize your team composition for the best strategy.",
  keywords: [
    "Gunsmoke Exilium",
    "team planner",
    "gacha game",
    "doll planning",
    "team builder",
  ],
  openGraph: {
    title: "Gunsmoke Exilium Team Planner | Gacha Toolkit",
    description:
      "Interactive tool for planning Gunsmoke Exilium teams with drag and drop functionality",
    images: [
      {
        url: "/exillium/gunsmoke.png", // Using one of the doll images as a preview
        width: 1461,
        height: 783,
        alt: "Gunsmoke Exilium Team Planner",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gunsmoke Exilium Team Planner",
    description:
      "Plan your perfect Gunsmoke Exilium team composition with our interactive tool",
    images: ["/exillium/dolls/groza.png"],
  },
};

export default function ExiliumHomePage() {
  return (
    <div className=" min-h-screen p-8 pb-20 gap-16 sm:p-4 font-[family-name:var(--font-geist-sans)]">
      <main className="pb-20">
        <h1 className="text-3xl font-bold">Gunsmoke Team Planning</h1>
        <p className="text-lg">
          Drag doll names into slots to assign positions!
        </p>

        <DragAndDrop />
      </main>
    </div>
  );
}
