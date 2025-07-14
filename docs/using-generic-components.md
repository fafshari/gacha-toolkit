# Using Generic React Components with TypeScript

This guide explains how to properly use generic React components in TypeScript, with a focus on our `GenericDragAndDrop` component.

## Understanding Generics in TypeScript

Generics in TypeScript allow you to create components that can work with a variety of data types while maintaining type safety. They are specified using angle brackets `<T>` where `T` is a type parameter that can be replaced with any concrete type.

## Using Our GenericDragAndDrop Component

The `GenericDragAndDrop` component is a generic component that accepts a type parameter `T` which extends the `DndItem` interface:

```tsx
interface DndItem {
  id: string;
  [key: string]: unknown; // Index signature allowing additional properties
}

export default function GenericDragAndDrop<
  T extends DndItem
>({}: /* props */ DndProps<T>) {
  // Component implementation
}
```

### Step 1: Ensure Your Item Type Extends DndItem

Your item type must have an `id` property and be compatible with the `DndItem` interface:

```tsx
// Option 1: Directly extend DndItem when defining your interface
interface MyItem extends DndItem {
  name: string;
  description: string;
  // other properties...
}

// Option 2: Create a wrapper interface for existing types
interface MyExistingType {
  id: string;
  // other properties...
}

interface MyExistingTypeItem extends MyExistingType, DndItem {}
```

### Step 2: Specify the Generic Type Parameter When Using the Component

When using the component, explicitly specify the type parameter:

```tsx
<GenericDragAndDrop<MyItem>
  items={myItems}
  // other props...
/>
```

### Step 3: Handle Type Compatibility for Render Functions

Make sure all your render functions are compatible with the generic type:

```tsx
// Define render function with the correct type
const renderItem = (item: MyItem) => {
  return <MyItemComponent item={item} />;
};

// Pass it to the component
<GenericDragAndDrop<MyItem>
  items={myItems}
  renderItem={renderItem}
  // other props...
/>;
```

## Working with Existing Types

If you're using an existing type (like `Doll` in our case) that doesn't directly extend `DndItem`, you have a few options:

### Option 1: Create a Wrapper Interface (Recommended)

```tsx
interface DollItem extends Doll, DndItem {}

// Cast your existing data to the wrapper type
const dollItems = EXILIUM_DOLLS as unknown as DollItem[];

<GenericDragAndDrop<DollItem>
  items={dollItems}
  // other props...
/>;
```

### Option 2: Modify the Source Interface (If Possible)

```tsx
// In constants.ts
export interface Doll extends DndItem {
  id: string;
  name: string;
  // other properties...
}
```

### Option 3: Use Type Assertions (Not Ideal but Workable)

```tsx
<GenericDragAndDrop<DndItem>
  items={EXILIUM_DOLLS as unknown as DndItem[]}
  renderItem={(item) => <DollCard doll={item as Doll} />}
  // other props...
/>
```

## Common Errors and Solutions

### "Type 'X' does not satisfy the constraint 'DndItem'"

This error occurs when your type doesn't properly extend `DndItem`. Ensure your type has an `id` property and is compatible with the index signature.

### "Index signature for type 'string' is missing in type 'X'"

This error means your type doesn't have an index signature that allows accessing properties with arbitrary string keys. Create a wrapper interface that extends both your type and `DndItem` to resolve this.

## Example: Adapting Existing Types

```tsx
// Original type
interface Product {
  id: string;
  name: string;
  price: number;
}

// Wrapper for DndItem compatibility
interface DraggableProduct extends Product, DndItem {}

// Usage
const productItems = products as unknown as DraggableProduct[];

<GenericDragAndDrop<DraggableProduct>
  items={productItems}
  renderItem={(item) => <ProductCard product={item} />}
  // other props...
/>;
```

By following these guidelines, you can use generic React components effectively while maintaining type safety throughout your application.
