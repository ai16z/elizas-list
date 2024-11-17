export function IntegrationGuides({ project }: { project: Project }) {
  const [activeFramework, setActiveFramework] = useState('react');
  
  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold mb-4">Integration Guides</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="border-b dark:border-gray-700">
          <div className="flex overflow-x-auto">
            {['react', 'vue', 'angular', 'svelte'].map((framework) => (
              <button
                key={framework}
                onClick={() => setActiveFramework(framework)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeFramework === framework
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {framework.charAt(0).toUpperCase() + framework.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          {/* Framework-specific integration guide */}
        </div>
      </div>
    </div>
  );
} 