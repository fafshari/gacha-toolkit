"use client";
import React, { useState, memo, useCallback } from "react";
import { DndContext, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { Draggable } from "./Draggable";
import { Droppable } from "./Droppable";

// Generic DnD context props
/**
 * Base interface for draggable items.
 * All draggable items must have an id property and allow additional properties.
 * The index signature [key: string]: unknown allows any additional properties
 * to be added to objects of this type.
 */
export interface DndItem {
  id: string;
  [key: string]: unknown; // Index signature allowing additional properties
}

export interface TeamData {
  id: string;
  name: string;
  notes: string;
  containers: string[];
  specialSlot: string | null;
}

export interface DndProps<T extends DndItem> {
  // Data
  items: T[];
  teams: TeamData[];

  // Storage keys for persistence
  storageKeys: {
    containers: string;
    specialSlots: string;
    teamNames: string;
    teamNotes: string;
  };

  // Render functions
  renderItem: (item: T) => React.ReactNode;
  renderSpecialSlot?: (
    slotId: string,
    selectedItem: T | null,
    onSelect: (itemId: string | null) => void,
    allItems: T[]
  ) => React.ReactNode;

  // Optional render overrides
  renderHeader?: (resetHandler: () => void) => React.ReactNode;
  renderLegend?: () => React.ReactNode;
  renderTeamHeader?: (
    team: TeamData,
    teamName: string,
    onNameChange: (teamId: string, name: string) => void
  ) => React.ReactNode;
  renderTeamNotes?: (
    team: TeamData,
    notes: string,
    onNotesChange: (teamId: string, notes: string) => void
  ) => React.ReactNode;

  // Initial values
  defaultContainerValue?: UniqueIdentifier | null;

  // Additional container options
  droppableContainerStyle?: React.CSSProperties;
  droppableContainerClassName?: string;
}

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
      <input
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="text-lg font-semibold h-8 max-w-[200px] px-2 border rounded"
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

// High-performance textarea component with local state that only syncs on blur
const TeamNotesTextarea = memo(
  ({
    teamId,
    initialValue,
    onSave,
  }: {
    teamId: string;
    initialValue: string;
    onSave: (teamId: string, value: string) => void;
  }) => {
    // Local state for the textarea value to avoid re-renders in the parent
    const [localValue, setLocalValue] = useState(initialValue);

    // Sync local value with prop if it changes externally
    React.useEffect(() => {
      setLocalValue(initialValue);
    }, [initialValue]);

    // Handle textarea changes locally without propagating to parent
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

    return (
      <textarea
        placeholder="Add your rotation strategy and notes here..."
        className="min-h-[100px] font-mono w-full p-2 border rounded"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
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

TeamNotesTextarea.displayName = "TeamNotesTextarea";

// Helper function to get stored data with fallback
const getStoredData = <T,>(key: string, fallback: T): T => {
  // Ensure we're in browser environment and not in SSR
  if (typeof window === "undefined") return fallback;

  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : fallback;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return fallback;
  }
};

export default function GenericDragAndDrop<T extends DndItem>({
  items,
  teams,
  storageKeys,
  renderItem,
  renderSpecialSlot,
  renderHeader,
  renderLegend,
  renderTeamHeader,
  renderTeamNotes,
  defaultContainerValue = null,
  droppableContainerStyle,
  droppableContainerClassName,
}: DndProps<T>) {
  // Create default values for item containers
  const defaultContainers = items.reduce(
    (acc, item) => ({
      ...acc,
      [item.id]: defaultContainerValue,
    }),
    {}
  );

  // Default special slots based on team data
  const defaultSpecialSlots = teams.reduce(
    (acc, team) => ({
      ...acc,
      [`special-${team.id}`]: null,
    }),
    {}
  );

  // Default team names
  const defaultTeamNames = teams.reduce(
    (acc, team) => ({
      ...acc,
      [team.id]: team.name,
    }),
    {}
  );

  // Default team notes
  const defaultTeamNotes = teams.reduce(
    (acc, team) => ({
      ...acc,
      [team.id]: team.notes,
    }),
    {}
  );

  // Initialize with default values first to avoid hydration mismatch
  const [itemContainers, setItemContainers] =
    useState<Record<string, UniqueIdentifier | null>>(defaultContainers);

  // Track which items are selected for the special slots
  const [specialSlotSelections, setSpecialSlotSelections] =
    useState<Record<string, string | null>>(defaultSpecialSlots);

  // Track the team names
  const [teamNames, setTeamNames] =
    useState<Record<string, string>>(defaultTeamNames);

  // Track team rotation notes
  const [teamNotes, setTeamNotes] =
    useState<Record<string, string>>(defaultTeamNotes);

  // Once component has mounted on client side, load values from localStorage
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    // Mark as client-side after first render
    setIsClient(true);

    // Load saved data from localStorage
    try {
      const storedContainers = getStoredData(
        storageKeys.containers,
        defaultContainers
      );
      const storedSpecialSlots = getStoredData(
        storageKeys.specialSlots,
        defaultSpecialSlots
      );
      const storedTeamNames = getStoredData(
        storageKeys.teamNames,
        defaultTeamNames
      );
      const storedTeamNotes = getStoredData(
        storageKeys.teamNotes,
        defaultTeamNotes
      );

      setItemContainers(storedContainers);
      setSpecialSlotSelections(storedSpecialSlots);
      setTeamNames(storedTeamNames);
      setTeamNotes(storedTeamNotes);
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
  }, []);

  // Save data to localStorage
  const saveToLocalStorage = React.useCallback((key: string, data: unknown) => {
    if (typeof window === "undefined") return; // SSR check

    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
    }
  }, []);

  // Handle change in dropdown selection for special slots
  const handleSpecialSlotChange = (slotId: string, itemId: string | null) => {
    setSpecialSlotSelections((prev) => {
      const newState = {
        ...prev,
        [slotId]: itemId,
      };

      // Save to localStorage
      saveToLocalStorage(storageKeys.specialSlots, newState);

      return newState;
    });
  };

  // Handle team name changes - only called when input loses focus
  const handleTeamNameChange = React.useCallback(
    (teamId: string, newName: string) => {
      setTeamNames((prev) => {
        const newState = {
          ...prev,
          [teamId]: newName,
        };

        // Save to localStorage
        saveToLocalStorage(storageKeys.teamNames, newState);

        return newState;
      });
    },
    [saveToLocalStorage, storageKeys.teamNames]
  );

  // Handle team notes changes
  const handleTeamNotesChange = React.useCallback(
    (teamId: string, notes: string) => {
      setTeamNotes((prev) => {
        const newState = {
          ...prev,
          [teamId]: notes,
        };

        // Save to localStorage
        saveToLocalStorage(storageKeys.teamNotes, newState);

        return newState;
      });
    },
    [saveToLocalStorage, storageKeys.teamNotes]
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      // If dropped outside a droppable area, return to unassigned state
      setItemContainers((prev) => {
        const newState = {
          ...prev,
          [active.id]: null,
        };

        // Save to localStorage
        saveToLocalStorage(storageKeys.containers, newState);

        return newState;
      });
      return;
    }

    // Skip if dropping into a special slot (handled by dropdown now)
    if (over.id.toString().startsWith("special-")) {
      return;
    }

    // Regular slot handling
    setItemContainers((prev) => {
      const newState = {
        ...prev,
        [active.id]: over.id,
      };

      // Save to localStorage
      saveToLocalStorage(storageKeys.containers, newState);

      return newState;
    });
  }

  // Function to reset all items to unassigned state
  const handleReset = () => {
    // Reset item containers
    setItemContainers(defaultContainers);
    saveToLocalStorage(storageKeys.containers, defaultContainers);

    // Reset special slot selections
    setSpecialSlotSelections(defaultSpecialSlots);
    saveToLocalStorage(storageKeys.specialSlots, defaultSpecialSlots);

    // Reset team names to defaults
    setTeamNames(defaultTeamNames);
    saveToLocalStorage(storageKeys.teamNames, defaultTeamNames);

    // Reset team notes to defaults
    setTeamNotes(defaultTeamNotes);
    saveToLocalStorage(storageKeys.teamNotes, defaultTeamNotes);
  };

  // Get all items assigned to a specific container
  const getContainerItems = React.useCallback(
    (containerId: string): T[] => {
      return items.filter((item) => itemContainers[item.id] === containerId);
    },
    [items, itemContainers]
  );

  // Get all unassigned items
  const getUnassignedItems = React.useCallback((): T[] => {
    // Return all items that are not in a regular container
    return items.filter((item) => itemContainers[item.id] === null);
  }, [items, itemContainers]);

  // Get the item assigned to a special slot
  const getSpecialSlotItem = React.useCallback(
    (slotId: string): T | null => {
      const itemId = specialSlotSelections[slotId];
      if (!itemId) return null;

      const selectedItem = items.find((item) => item.id === itemId);
      return selectedItem || null;
    },
    [specialSlotSelections, items]
  );

  // Helper function to render a grid of droppable containers for a team
  const renderTeam = React.useCallback(
    (team: TeamData) => {
      const specialSlotId = `special-${team.id}`;
      const specialSlotItem = getSpecialSlotItem(specialSlotId);
      const teamName = teamNames[team.id];
      const teamNote = teamNotes[team.id] || "";

      return (
        <div className="mb-6">
          {/* Team header with name */}
          <div className="flex items-center gap-2 mb-2">
            {renderTeamHeader ? (
              renderTeamHeader(team, teamName, handleTeamNameChange)
            ) : (
              <TeamNameInput
                teamId={team.id}
                initialValue={teamName}
                onSave={handleTeamNameChange}
              />
            )}
          </div>

          {/* Containers for this team */}
          <div className="flex flex-wrap gap-4">
            {team.containers.map((containerId) => {
              const containerItems = getContainerItems(containerId);
              const hasItems = containerItems.length > 0;

              return (
                <Droppable
                  key={containerId}
                  id={containerId}
                  hasItems={hasItems}
                >
                  <div
                    className={
                      droppableContainerClassName ||
                      "p-2 border border-dashed rounded min-h-20 w-[82px]"
                    }
                    style={droppableContainerStyle}
                  >
                    {hasItems ? (
                      <div className="flex flex-wrap gap-2">
                        {containerItems.map((item) => (
                          <Draggable key={item.id} id={item.id}>
                            {renderItem(item)}
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

            {/* Special slot */}
            {renderSpecialSlot && (
              <div className="mt-8 min-[636px]:mt-0 p-2 border border-dashed min-h-20 w-[180px] relative">
                {renderSpecialSlot(
                  specialSlotId,
                  specialSlotItem,
                  (itemId) => handleSpecialSlotChange(specialSlotId, itemId),
                  items
                )}
              </div>
            )}
          </div>

          {/* Team Notes */}
          <div className="mt-4">
            {renderTeamNotes ? (
              renderTeamNotes(team, teamNote, handleTeamNotesChange)
            ) : (
              <div className="border p-2 rounded">
                <div className="text-sm font-medium mb-2">Rotation Notes</div>
                <TeamNotesTextarea
                  teamId={team.id}
                  initialValue={teamNote}
                  onSave={handleTeamNotesChange}
                />
              </div>
            )}
          </div>
        </div>
      );
    },
    [
      teamNames,
      teamNotes,
      handleTeamNameChange,
      handleTeamNotesChange,
      getSpecialSlotItem,
      getContainerItems,
      renderItem,
      renderSpecialSlot,
      renderTeamHeader,
      renderTeamNotes,
      droppableContainerClassName,
      droppableContainerStyle,
      items,
    ]
  );

  // Show minimal content until client-side hydration is complete to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Drag & Drop</h2>
        </div>
        <div className="p-4 border border-gray rounded mb-4 text-center">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-4">
        {/* Header with reset button */}
        <div className="flex justify-between items-center mb-2">
          {renderHeader ? (
            renderHeader(handleReset)
          ) : (
            <>
              <h2 className="text-xl font-bold">Drag & Drop</h2>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
              >
                Reset All Items
              </button>
            </>
          )}
        </div>

        {/* Legend section */}
        {renderLegend && (
          <div className="p-4 border border-gray rounded mb-4">
            {renderLegend()}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Unassigned items area */}
          <div className="lg:basis-2/5 p-4 border border-dashed border-gray rounded mb-4">
            <h3 className="font-bold mb-2">Unassigned Items</h3>
            <div className="flex flex-wrap gap-4">
              {getUnassignedItems().map((item) => (
                <Draggable key={item.id} id={item.id}>
                  {renderItem(item)}
                </Draggable>
              ))}
            </div>
          </div>
          <div>
            {/* Render each team */}
            {teams.map((team) => (
              <div key={team.id}>{renderTeam(team)}</div>
            ))}
          </div>
        </div>
      </div>
    </DndContext>
  );
}
