import Image from "next/image";
import React from "react";
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
    if (hasDispel && hasCleanse) {
      ringColor = "ring-yellow-400"; // Both abilities -> yellow
    } else if (hasDispel) {
      ringColor = "ring-blue-500"; // Dispel only -> blue
    } else if (hasCleanse) {
      ringColor = "ring-green-500"; // Cleanse only -> green
    }

    // Determine ring thickness
    const ringThickness = "ring-2";

    return ringColor ? `${ringColor} ${ringThickness}` : "";
  };

  // Create tooltip text with ability information
  const getAbilityTooltip = () => {
    const parts = [];

    // Add doll name
    parts.push(doll.name);

    // Add cleanse info if available
    if (doll.cleanse && doll.abilities?.cleanse) {
      const type = doll.abilities.cleanse.type || "Unspecified";
      parts.push(`Cleanse: ${type}`);
    }

    // Add dispel info if available
    if (doll.dispel) {
      parts.push("Dispel");
    }

    return parts.join(" - ");
  };

  const ringClasses = getRingClasses();

  return (
    <div className="flex flex-col items-center w-16 [&>*+*]:mt-2">
      {/* Conditionally render the name if showName is true */}
      {showName !== false && (
        <span
          className="text-center font-medium text-xs w-full truncate"
          title={doll.name}
        >
          {doll.name}
        </span>
      )}
      <div
        className={cn(
          "relative w-16 h-16 flex items-center justify-center rounded-md group",
          ringClasses
        )}
        title={getAbilityTooltip()}
      >
        <Image
          src={doll.image}
          alt={doll.name}
          className="object-contain max-w-[56px] max-h-[56px]"
          width={128}
          height={128}
        />

        {/* Indicator icons for cleanse/dispel in corner if applicable */}
        {(doll.dispel || doll.cleanse) && (
          <div className="absolute bottom-0 right-0 flex gap-1">
            {doll.dispel && (
              <div
                className={cn(
                  // Base style
                  "bg-blue-500 rounded-full w-3 h-3",
                  // Add white ring for AoE abilities
                  isAoE && "ring-1 ring-white"
                )}
                title={isAoE ? "Dispel (AoE)" : "Dispel"}
              />
            )}
            {doll.cleanse && (
              <div
                className={cn(
                  // Base style
                  "bg-green-500 rounded-full w-3 h-3",
                  // Add white ring for AoE abilities
                  isAoE && "ring-1 ring-white"
                )}
                title={isAoE ? "Cleanse (AoE)" : "Cleanse"}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
