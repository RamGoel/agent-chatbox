import { useParams } from "react-router-dom";
import { getRecipe } from "./recipes";
import { PageContent, StoryCard } from "./story";

export function RecipeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const recipe = slug ? getRecipe(slug) : undefined;

  if (!recipe) {
    return (
      <PageContent>
        <p className="text-base text-ak-content-secondary">
          Recipe "{slug}" not found.
        </p>
      </PageContent>
    );
  }

  const Preview = recipe.Preview;

  return (
    <PageContent>
      <div className="flex flex-col gap-3 px-2">
        <h1 className="text-2xl font-medium text-ak-content">{recipe.title}</h1>
        <p className="text-base text-ak-content-secondary">{recipe.when}</p>
      </div>

      <StoryCard name="Live thread" description={recipe.tryIt} code={recipe.code}>
        <div className="w-full">
          <Preview />
        </div>
      </StoryCard>
    </PageContent>
  );
}
