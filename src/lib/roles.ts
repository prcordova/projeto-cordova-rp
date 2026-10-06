export const roleCapabilities = {
  admin: ["products", "posts"],
  editor: ["posts"]
} as const;

export type RoleName = keyof typeof roleCapabilities;
export type Capability = (typeof roleCapabilities)[RoleName][number];

export function capabilitiesOf(user: { admin: boolean; roles?: string[] }) {
  const granted = new Set<Capability>();
  if (user.admin) {
    for (const item of roleCapabilities.admin) granted.add(item);
  }
  for (const role of user.roles || []) {
    const list = roleCapabilities[role as RoleName];
    if (!list) continue;
    for (const item of list) granted.add(item);
  }
  return granted;
}

export function can(user: { admin: boolean; roles?: string[] } | null, capability: Capability) {
  if (!user) return false;
  return capabilitiesOf(user).has(capability);
}
