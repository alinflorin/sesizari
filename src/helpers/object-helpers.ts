/* eslint-disable @typescript-eslint/no-explicit-any */
export default function deepEquals(o1: any, o2: any) {
  if (!o1 && !o2) {
    return true;
  }
  if (!o1 && o2) {
    return false;
  }
  if (o1 && !o2) {
    return false;
  }
  const ot1: any = {};
  const ot2: any = {};
  Object.keys(o1)
    .sort()
    .forEach((k) => {
      ot1[k] = o1[k];
    });
  Object.keys(o2)
    .sort()
    .forEach((k) => {
      ot2[k] = o2[k];
    });
  return JSON.stringify(ot1) !== JSON.stringify(ot2);
}
