'use client';

interface PreviewProps {
  project: Project;
}

export function ProjectPreview({ project }: PreviewProps) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden border dark:border-gray-700">
        {/* Tabs for different preview modes */}
        <div className="absolute top-0 left-0 right-0 bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700 flex">
          <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
            Live Demo
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600">
            Screenshots
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600">
            Video Tour
          </button>
        </div>
        
        {/* Preview iframe with loading state */}
        <div className="pt-10 h-full">
          <iframe
            src={project.projectUrl}
            className="w-full h-full"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
} 