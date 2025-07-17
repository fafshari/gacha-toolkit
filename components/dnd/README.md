# Generic Drag and Drop Component

The `GenericDragAndDrop` component provides a flexible and reusable drag-and-drop system that can be used with any type of data and UI components. It handles state management, persistence, and the drag-and-drop interactions, while allowing you to customize the rendering of items, containers, and other UI elements.

## Basic Usage

```tsx
import GenericDragAndDrop from "@/components/dnd/DragAndDrop";

// Define your items (must have an id property)
const myItems = [
  { id: "item-1", name: "Item 1" /* ...other properties */ },
  { id: "item-2", name: "Item 2" /* ...other properties */ },
  // ...more items
];

// Define your team/group structure
const myTeams = [
  {
    id: "team-1",
    name: "Team 1",
    notes: "",
    containers: ["container-1", "container-2", "container-3"],
    specialSlot: "special-1",
  },
  // ...more teams
];

// Storage keys for persistence
const storageKeys = {
  containers: "my-app-containers",
  specialSlots: "my-app-special-slots",
  teamNames: "my-app-team-names",
  teamNotes: "my-app-team-notes",
};

// Render function for items
const renderItem = (item) => {
  return <MyItemComponent item={item} />;
};

export default function MyDragAndDrop() {
  return (
    <GenericDragAndDrop
      items={myItems}
      teams={myTeams}
      storageKeys={storageKeys}
      renderItem={renderItem}
      // ...other optional props
    />
  );
}
```

## Props

| Prop                          | Type                                                                                                                | Required | Description                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| `items`                       | `Array<T>`                                                                                                          | Yes      | Array of items to be dragged. Each item must have an `id` property.                             |
| `teams`                       | `Array<TeamData>`                                                                                                   | Yes      | Array of team/group definitions.                                                                |
| `storageKeys`                 | `Object`                                                                                                            | Yes      | Keys used for localStorage persistence.                                                         |
| `renderItem`                  | `(item: T) => ReactNode`                                                                                            | Yes      | Function to render an individual item.                                                          |
| `renderSpecialSlot`           | `(slotId: string, selectedItem: T \| null, onSelect: (itemId: string \| null) => void, allItems: T[]) => ReactNode` | No       | Function to render the special slot UI.                                                         |
| `renderHeader`                | `(resetHandler: () => void) => ReactNode`                                                                           | No       | Function to render the header section. The `resetHandler` parameter is used to reset all items. |
| `renderLegend`                | `() => ReactNode`                                                                                                   | No       | Function to render the legend/info section.                                                     |
| `renderTeamHeader`            | `(team: TeamData, teamName: string, onNameChange: (teamId: string, name: string) => void) => ReactNode`             | No       | Function to render a team header.                                                               |
| `renderTeamNotes`             | `(team: TeamData, notes: string, onNotesChange: (teamId: string, notes: string) => void) => ReactNode`              | No       | Function to render team notes.                                                                  |
| `defaultContainerValue`       | `UniqueIdentifier \| null`                                                                                          | No       | Default value for unassigned items (default: `null`).                                           |
| `droppableContainerStyle`     | `React.CSSProperties`                                                                                               | No       | Style object for droppable containers.                                                          |
| `droppableContainerClassName` | `string`                                                                                                            | No       | CSS class for droppable containers.                                                             |

## Types

```tsx
export interface DndItem {
  id: string;
  [key: string]: any;
}

export interface TeamData {
  id: string;
  name: string;
  notes: string;
  containers: string[];
  specialSlot: string | null;
}

export interface DndProps<T extends DndItem> {
  // See props table above
}
```

## Examples

### Exillium Dolls

The Exillium Dolls implementation shows how to use the component with game character data, including custom rendering for special slots, team notes with accordions, and a detailed legend.

### File Manager

The File Manager example demonstrates using the same component with file data, featuring a different UI for items, special slots, and containers.

## Extending the Component

To create your own implementation:

1. Define your data types (must include `id` property)
2. Create render functions for your items and UI elements
3. Define team/group structures with containers and special slots
4. Set up storage keys for persistence
5. Pass everything to the `GenericDragAndDrop` component

You can customize almost every aspect of the UI while leveraging the core drag-and-drop functionality.

## Key Features

### State Persistence

The component automatically saves and loads state using localStorage, allowing users to maintain their configurations between sessions.

### Auto-detection of New Items

When new items are added to the `items` array, they will automatically appear in the unassigned section even if users have saved state. This ensures that newly added items are always visible without requiring users to reset their configuration.
