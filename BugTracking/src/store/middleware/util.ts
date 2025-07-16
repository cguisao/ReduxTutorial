export default function isActionWithType<T extends string>(
  action: unknown,
  type: T
): action is { type: T } {
  return (
    typeof action === 'object' &&
    action !== null &&
    'type' in action &&
    (action as any).type === type
  );
}