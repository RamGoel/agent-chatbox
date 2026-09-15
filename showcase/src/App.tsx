import { Routes, Route } from "react-router-dom";
import { ShowcaseLayout } from "./ShowcaseLayout";
import { IntroPage } from "./IntroPage";
import { ComponentPage } from "./ComponentPage";
import { REGISTRY } from "./registry";

export default function App() {
  return (
    <Routes>
      <Route element={<ShowcaseLayout />}>
        <Route path="/" element={<IntroPage />} />
        <Route path="/components/:slug" element={<ComponentPage />} />
      </Route>
    </Routes>
  );
}
