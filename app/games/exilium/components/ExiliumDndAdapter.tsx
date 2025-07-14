"use client";
import React from "react";
import GenericDragAndDrop, {
  TeamData,
  DndItem,
} from "@/components/dnd/DragAndDrop";
import { DollCard } from "@/components/DollCard";
import { EXILIUM_DOLLS, Doll } from "@/lib/constants";

/**
 * Extends the Doll interface with DndItem for TypeScript compatibility.
 * This ensures our Doll type has the required index signature for DndItem.
 */
interface DollItem extends Doll, DndItem {
  // No need to add additional properties as Doll already has id
  // The DndItem interface provides the index signature
}
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Storage keys for Exilium specific implementation
const STORAGE_KEYS = {
  containers: "exilium-dnd-containers",
  specialSlots: "exilium-dnd-special-slots",
  teamNames: "exilium-dnd-team-names",
  teamNotes: "exilium-dnd-team-notes",
};

// Define team grid layout for Exilium
const EXILIUM_TEAMS: TeamData[] = [
  {
    id: "team-1",
    name: "Team 1",
    notes: "",
    containers: ["droppable-1", "droppable-2", "droppable-3", "droppable-4"],
    specialSlot: "special-team-1",
  },
  {
    id: "team-2",
    name: "Team 2",
    notes: "",
    containers: ["droppable-6", "droppable-7", "droppable-8", "droppable-9"],
    specialSlot: "special-team-2",
  },
  {
    id: "team-3",
    name: "Team 3",
    notes: "",
    containers: [
      "droppable-11",
      "droppable-12",
      "droppable-13",
      "droppable-14",
    ],
    specialSlot: "special-team-3",
  },
];

export default function ExiliumDragAndDrop() {
  // Render a doll card
  const renderDoll = (doll: DollItem) => {
    // DollItem has all the properties needed by DollCard
    // TypeScript considers DollItem compatible with Doll since it extends it
    return <DollCard doll={doll} />;
  };

  // Render the special slot for a team
  const renderSpecialSlot = (
    slotId: string,
    selectedDoll: DollItem | null,
    onSelect: (dollId: string | null) => void,
    allDolls: DollItem[]
  ) => {
    return (
      <>
        <Select
          value={selectedDoll?.id || ""}
          onValueChange={(value) => onSelect(value || null)}
        >
          <SelectTrigger className="w-full mb-2 absolute top-[-44px] left-0">
            <SelectValue placeholder="Pick a support" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="none">None</SelectItem>
              {allDolls.map((doll) => (
                <SelectItem key={doll.id} value={doll.id}>
                  {doll.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {selectedDoll && (
          <div className="flex justify-center">
            {/* DollItem is compatible with the DollCard's doll prop */}
            <DollCard doll={selectedDoll} showName={false} />
          </div>
        )}
      </>
    );
  };

  // Render the header for the DnD component
  const renderHeader = () => (
    <>
      <h2 className="text-xl font-bold">Exilium Dolls Drag & Drop</h2>
      <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors">
        Reset All Items
      </button>
    </>
  );

  // Render the legend for the DnD component
  const renderLegend = () => (
    <>
      <h3 className="font-bold mb-2">Legend</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Border colors */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Border Colors:</h4>
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <div className="w-8 h-8 ring-2 ring-blue-500 rounded-md mr-2"></div>
              <span>Dispel ability</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 ring-2 ring-green-500 rounded-md mr-2"></div>
              <span>Cleanse ability</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 ring-2 ring-yellow-400 rounded-md mr-2"></div>
              <span>Both Dispel and Cleanse abilities</span>
            </div>
          </div>
        </div>
        {/* Dot indicators */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Dot Indicators:</h4>
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <div className="flex mr-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              <span>Dispel (Single Target/Self)</span>
            </div>
            <div className="flex items-center">
              <div className="flex mr-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full ring-1 ring-white"></div>
              </div>
              <span>Dispel (AoE)</span>
            </div>
            <div className="flex items-center">
              <div className="flex mr-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span>Cleanse (Single Target/Self)</span>
            </div>
            <div className="flex items-center">
              <div className="flex mr-2">
                <div className="w-3 h-3 bg-green-500 rounded-full ring-1 ring-white"></div>
              </div>
              <span>Cleanse (AoE)</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Custom render for team notes with accordion
  const renderTeamNotes = (
    team: TeamData,
    notes: string,
    onNotesChange: (teamId: string, notes: string) => void
  ) => {
    // Determine if the accordion should be open by default
    const hasNotes = notes.trim().length > 0;
    const defaultOpenValue = hasNotes ? team.id : undefined;

    return (
      <div className="mt-4">
        <Accordion type="single" collapsible defaultValue={defaultOpenValue}>
          <AccordionItem value={team.id}>
            <AccordionTrigger className="text-sm">
              Rotation Notes
            </AccordionTrigger>
            <AccordionContent>
              <textarea
                placeholder="Add your rotation strategy and notes here..."
                className="min-h-[100px] font-mono w-full p-2 border rounded"
                value={notes}
                onChange={(e) => onNotesChange(team.id, e.target.value)}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  };

  // Convert EXILIUM_DOLLS to DollItem[] in a type-safe way
  const dollItems: DollItem[] = EXILIUM_DOLLS.map((doll) => {
    // Create a new object that satisfies both Doll and DndItem interfaces
    return {
      ...doll,
      // id is already present in Doll
    };
  });

  // Explicitly specify DollItem as the generic type parameter
  return (
    <GenericDragAndDrop<DollItem>
      items={dollItems}
      teams={EXILIUM_TEAMS}
      storageKeys={STORAGE_KEYS}
      renderItem={renderDoll}
      renderSpecialSlot={(slotId, selectedItem, onSelect, allItems) =>
        renderSpecialSlot(slotId, selectedItem, onSelect, allItems)
      }
      renderHeader={renderHeader}
      renderLegend={renderLegend}
      renderTeamNotes={renderTeamNotes}
      droppableContainerClassName="p-2 border border-dashed rounded min-h-20 w-[82px]"
    />
  );
}
