import algoliasearch from 'algoliasearch';

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_KEY!
);

const index = client.initIndex('projects');

export async function indexProject(project: any) {
  await index.saveObject({
    objectID: project.id,
    ...project,
  });
}

export async function removeProject(projectId: string) {
  await index.deleteObject(projectId);
} 