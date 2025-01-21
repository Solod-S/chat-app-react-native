import React from "react";
import { HomeHeader } from "@/components";
import { Stack } from "expo-router";
export default function _layout() {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ header: () => <HomeHeader /> }} />
    </Stack>
  );
}
