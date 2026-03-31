import { Redirect } from "expo-router";

export default function Schema() {
  console.log("FILE:", "(tabs)/schema.tsx");

  return <Redirect href="/schemas" />;
}
