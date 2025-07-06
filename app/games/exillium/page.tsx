import DragAndDrop from "@/components/dnd/DragAndDrop";

export default function ExilliumHomePage() {
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
