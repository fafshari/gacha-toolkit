"use client";
import React, { useState, memo, useCallback } from "react";
import { DndContext, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { Draggable } from "./Draggable";
import { Droppable } from "./Droppable";
import { DollCard } from "@/components/DollCard";
import { EXILLIUM_DOLLS, Doll, DOLLS_BY_ID } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// High-performance input component with local state that only syncs on blur
const TeamNameInput = memo(
  ({
    teamId,
    initialValue,
    onSave,
  }: {
    teamId: string;
    initialValue: string;
    onSave: (teamId: string, value: string) => void;
  }) => {
    // Local state for the input value to avoid re-renders in the parent
    const [localValue, setLocalValue] = useState(initialValue);

    // Sync local value with prop if it changes externally
    React.useEffect(() => {
      setLocalValue(initialValue);
    }, [initialValue]);

    // Handle input changes locally without propagating to parent
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalValue(e.target.value);
      },
      []
    );

    // Only update parent state when the field loses focus
    const handleBlur = useCallback(() => {
      if (localValue !== initialValue) {
        onSave(teamId, localValue);
      }
    }, [teamId, localValue, initialValue, onSave]);

    // Also update on Enter key
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          (e.target as HTMLInputElement).blur();
        }
      },
      []
    );

    return (
      <Input
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="text-lg font-semibold h-8 max-w-[200px]"
      />
    );
  },
  // Custom equality function to prevent unnecessary re-renders
  (prevProps, nextProps) => {
    return (
      prevProps.teamId === nextProps.teamId &&
      prevProps.initialValue === nextProps.initialValue
    );
  }
);

TeamNameInput.displayName = "TeamNameInput";

export default function DragAndDrop() {
  // Track which items are in which containers
  const [itemContainers, setItemContainers] = useState<
    Record<string, UniqueIdentifier | null>
  >(
    // Initialize all dolls as unassigned
    EXILLIUM_DOLLS.reduce(
      (acc, doll) => ({
        ...acc,
        [doll.id]: null,
      }),
      {}
    )
  );

  // Define three separate sets of containers
  const gridOne = [1, 2, 3, 4];
  const gridTwo = [6, 7, 8, 9];
  const gridThree = [11, 12, 13, 14];

  // Track which dolls are selected for the special slots
  const [specialSlotSelections, setSpecialSlotSelections] = useState<
    Record<string, string | null>
  >({
    "special-1": null,
    "special-2": null,
    "special-3": null,
  });

  // Track the team names
  const [teamNames, setTeamNames] = useState<Record<string, string>>({
    "team-1": "Team 1",
    "team-2": "Team 2",
    "team-3": "Team 3",
  });

  // Handle change in dropdown selection for special slots
  const handleSpecialSlotChange = (slotId: string, dollId: string | null) => {
    setSpecialSlotSelections((prev) => ({
      ...prev,
      [slotId]: dollId,
    }));
  };

  // Handle team name changes - only called when input loses focus
  const handleTeamNameChange = React.useCallback(
    (teamId: string, newName: string) => {
      setTeamNames((prev) => ({
        ...prev,
        [teamId]: newName,
      }));
    },
    []
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      // If dropped outside a droppable area, return to unassigned state
      setItemContainers((prev) => ({
        ...prev,
        [active.id]: null,
      }));
      return;
    }

    // Skip if dropping into a special slot (handled by dropdown now)
    if (over.id.toString().startsWith("special-")) {
      return;
    }

    // Regular slot handling
    setItemContainers((prev) => ({
      ...prev,
      [active.id]: over.id,
    }));
  }

  // Function to reset all items to unassigned state
  const handleReset = () => {
    setItemContainers(
      EXILLIUM_DOLLS.reduce(
        (acc, doll) => ({
          ...acc,
          [doll.id]: null,
        }),
        {}
      )
    );

    // Also reset special slot selections
    setSpecialSlotSelections({
      "special-1": null,
      "special-2": null,
      "special-3": null,
    });
  };

  // Get all items assigned to a specific container
  const getContainerItems = React.useCallback(
    (containerId: string): Doll[] => {
      return EXILLIUM_DOLLS.filter(
        (doll) => itemContainers[doll.id] === containerId
      );
    },
    [itemContainers]
  );

  // Get all unassigned items
  const getUnassignedItems = React.useCallback((): Doll[] => {
    // Return all dolls that are not in a regular container
    return EXILLIUM_DOLLS.filter((doll) => itemContainers[doll.id] === null);
  }, [itemContainers]);

  // Get the doll assigned to a special slot
  const getSpecialSlotDoll = React.useCallback(
    (slotId: string): Doll | null => {
      const dollId = specialSlotSelections[slotId];
      return dollId && dollId !== "none" ? DOLLS_BY_ID[dollId] : null;
    },
    [specialSlotSelections]
  );

  // Helper function to render a grid of droppable containers
  const renderGrid = React.useCallback(
    (
      containers: number[],
      teamId: string,
      specialSlotId: string,
      gridIndex: number
    ) => {
      const specialSlotDoll = getSpecialSlotDoll(specialSlotId);
      const teamName = teamNames[teamId];

      return (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <TeamNameInput
              teamId={teamId}
              initialValue={teamName}
              onSave={handleTeamNameChange}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            {containers.map((container) => {
              const containerId = `droppable-${container}`;
              const containerItems = getContainerItems(containerId);
              const hasItems = containerItems.length > 0;

              return (
                <Droppable
                  key={containerId}
                  id={containerId}
                  hasItems={hasItems}
                >
                  <div className="p-4 border border-dashed rounded min-h-20 w-[96px]">
                    {hasItems ? (
                      <div className="flex flex-wrap gap-2">
                        {containerItems.map((doll) => (
                          <Draggable key={doll.id} id={doll.id}>
                            <DollCard doll={doll} />
                          </Draggable>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500">Empty Slot</div>
                    )}
                  </div>
                </Droppable>
              );
            })}

            {/* Special slot with shadcn select dropdown */}
            <div className="p-2 border-2 rounded min-h-20 w-[180px] bg-warning">
              <Select
                value={specialSlotSelections[specialSlotId] || ""}
                onValueChange={(value) =>
                  handleSpecialSlotChange(specialSlotId, value || null)
                }
              >
                <SelectTrigger className="w-full mb-2">
                  <SelectValue placeholder="Pick a support" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="none">None</SelectItem>
                    {EXILLIUM_DOLLS.map((doll) => (
                      <SelectItem key={doll.id} value={doll.id}>
                        {doll.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {specialSlotDoll && (
                <div className="flex justify-center mt-2">
                  <DollCard doll={specialSlotDoll} showName={false} />
                </div>
              )}
            </div>
          </div>
        </div>
      );
    },
    [
      teamNames,
      specialSlotSelections,
      itemContainers,
      handleTeamNameChange,
      getSpecialSlotDoll,
      getContainerItems,
    ]
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-4">
        {/* Header with reset button */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Exillium Dolls Drag & Drop</h2>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
          >
            Reset All Items
          </button>
        </div>

        {/* Legend section to explain the visual indicators */}
        <div className="p-4 border border-gray rounded mb-4">
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
        </div>

        {/* Unassigned items area */}
        <div className="p-4 border border-dashed  border-gray rounded mb-4">
          <h3 className="font-bold mb-2">Unassigned Dolls</h3>
          <div className="flex flex-wrap gap-4">
            {getUnassignedItems().map((doll) => (
              <Draggable key={doll.id} id={doll.id}>
                <DollCard doll={doll} />
              </Draggable>
            ))}
          </div>
        </div>

        {/* The three separate grids with special slots */}
        {renderGrid(gridOne, "team-1", "special-1", 1)}
        {renderGrid(gridTwo, "team-2", "special-2", 2)}
        {renderGrid(gridThree, "team-3", "special-3", 3)}
      </div>
    </DndContext>
  );
}
