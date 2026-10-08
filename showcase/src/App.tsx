import { Routes, Route } from "react-router-dom";
import { ShowcaseLayout } from "./ShowcaseLayout";
import { IntroPage } from "./IntroPage";
import { SetupPage } from "./SetupPage";
import { SkillsPage } from "./SkillsPage";
import { RecipeDetailPage } from "./RecipesPage";
import { ComponentPage } from "./ComponentPage";
import { REGISTRY } from "./registry";

export default function App() {
  return (
    <Routes>
      <Route element={<ShowcaseLayout />}>
        <Route path="/" element={<IntroPage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/recipes/:slug" element={<RecipeDetailPage />} />
        <Route path="/components/:slug" element={<ComponentPage />} />
      </Route>
    </Routes>
  );
}
