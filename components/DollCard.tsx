import Image from "next/image";
import React, { useState } from "react";
import { Doll } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface DollCardProps {
  doll: Doll;
  showName?: boolean; // Optional prop to control name display
}

export function DollCard({
  doll,
  showName = true, // Default to true if not provided
}: DollCardProps) {
  // Check if any ability is AoE - needed for both ring and dot indicators
  const isAoE =
    // Check cleanse type first (most reliable)
    doll.abilities?.cleanse?.type?.includes("AoE") ||
    // Fallback to description search for both abilities
    doll.abilities?.cleanse?.description?.some(
      (desc) =>
        desc.toLowerCase().includes("aoe") ||
        desc.toLowerCase().includes("all party") ||
        desc.toLowerCase().includes("party members")
    ) ||
    doll.abilities?.dispel?.description?.some(
      (desc) =>
        desc.toLowerCase().includes("aoe") ||
        desc.toLowerCase().includes("all party") ||
        desc.toLowerCase().includes("party members")
    );

  // Determine the ring color and thickness based on abilities
  const getRingClasses = () => {
    const hasDispel = doll.dispel;
    const hasCleanse = doll.cleanse;

    // Determine ring color based on abilities
    let ringColor = "";

    // Determine ring thickness
    const ringThickness = "ring-2";

    return ringColor ? `${ringColor} ${ringThickness}` : "";
  };

  // Helper function to format ability descriptions
  const formatAbilityDetails = () => {
    const details = {
      dispel: {
        has: doll.dispel || false,
        // Dispel doesn't have a type property in the interface, so we infer from isAoE
        type:
          doll.abilities?.dispel?.type ||
          (isAoE ? "AoE" : "Single Target/Self"),
        descriptions: doll.abilities?.dispel?.description || [],
      },
      cleanse: {
        has: doll.cleanse || false,
        type:
          doll.abilities?.cleanse?.type ||
          (isAoE ? "AoE" : "Single Target/Self"),
        descriptions: doll.abilities?.cleanse?.description || [],
      },
    };

    return details;
  };

  const ringClasses = getRingClasses();
  const abilityDetails = formatAbilityDetails();
  const [showTooltip, setShowTooltip] = useState(false);

  // Reference for the card element
  const cardRef = React.useRef<HTMLDivElement>(null);

  // Handle click outside to close tooltip
  React.useEffect(() => {
    if (!showTooltip) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);

  return (
    <div className="flex flex-col items-center w-16">
      <div className="relative" ref={cardRef}>
        <div
          className={cn(
            "relative w-16 h-16 flex items-center justify-center rounded-md group cursor-pointer border-0 bg-transparent p-0",
            ringClasses
          )}
          onMouseDown={() => setShowTooltip(!showTooltip)}
        >
          <Image
            src={doll.image}
            alt={doll.name}
            className="object-contain max-w-[64px] max-h-[64px] rounded-md"
            width={128}
            height={128}
          />

          {/* Name overlapping the image at bottom */}
          {showName !== false && (
            <div className="absolute bottom-0 left-0 right-0 text-shadow-zinc-950 text-shadow-md truncate">
              <span
                className="text-center font-medium text-xs w-full text-white"
                title={doll.name}
              >
                {doll.name}
              </span>
            </div>
          )}

          {/* Moved indicator icons for cleanse/dispel to top right */}
          {(doll.dispel || doll.cleanse) && (
            <div className="absolute top-0 right-0 flex gap-1 p-0.5">
              {doll.dispel && (
                <div className={cn("bg-blue-700 rounded-full w-4 h-4 text-xs")}>
                  {String(doll.abilities?.dispel?.type).indexOf("AoE") >= 0
                    ? "A"
                    : "S"}
                </div>
              )}
              {doll.cleanse && (
                <div
                  className={cn(
                    // Base style
                    "bg-green-700 rounded-full w-4 h-4 text-xs"
                  )}
                >
                  {String(doll.abilities?.cleanse?.type).indexOf("AoE") >= 0
                    ? "A"
                    : "S"}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Custom tooltip/popover */}
        {showTooltip && (
          <div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 w-80 p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 flex-shrink-0">
                  <Image
                    src={doll.image}
                    alt={doll.name}
                    width={48}
                    height={48}
                    className="object-contain w-full h-full"
                  />
                </div>
                <h3 className="text-lg font-bold">{doll.name}</h3>
              </div>

              {abilityDetails.dispel.has && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-blue-700 rounded-full"></div>
                    <h4 className="font-semibold">
                      Dispel ({abilityDetails.dispel.type})
                    </h4>
                  </div>
                  <div className="text-sm pl-5 list-disc text-start [&>*+*]:mt-1">
                    {abilityDetails.dispel.descriptions.map((desc, i) => (
                      <p key={`dispel-${i}`}>{desc}</p>
                    ))}
                  </div>
                </div>
              )}

              {abilityDetails.cleanse.has && (
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-green-700 rounded-full"></div>
                    <h4 className="font-semibold">
                      Cleanse ({abilityDetails.cleanse.type || "Unknown"})
                    </h4>
                  </div>
                  <div className="text-sm pl-5 list-disc text-start [&>*+*]:mt-1">
                    {abilityDetails.cleanse.descriptions.map((desc, i) => (
                      <p key={`cleanse-${i}`}>{desc}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Arrow pointing to the card */}
              <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
