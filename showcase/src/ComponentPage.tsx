import { useParams } from "react-router-dom";
import { getComponent } from "./registry";
import { PageContent, StoryCard } from "./story";

export function ComponentPage() {
  const { slug } = useParams<{ slug: string }>();
  const config = slug ? getComponent(slug) : undefined;

  if (!config) {
    return (
      <PageContent>
        <p className="text-base text-ak-content-secondary">
          Component "{slug}" not found in registry.
        </p>
      </PageContent>
    );
  }

  return (
    <PageContent>
      <div className="flex flex-col gap-3 px-2">
        <h1 className="text-2xl font-medium text-ak-content">{config.title}</h1>
        <p className="text-base text-ak-content-secondary">{config.description}</p>
      </div>

      {config.stories.map((story) => (
        <StoryCard
          key={story.name}
          name={story.name}
          description={story.description}
          code={story.code}
        >
          {story.render()}
        </StoryCard>
      ))}
    </PageContent>
  );
}
