export function ProjectSupport({ project }: { project: Project }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">How to Contribute</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              1
            </div>
            <div>
              <h4 className="font-medium">Fork the Repository</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Create your own copy of the project to work on
              </p>
            </div>
          </div>
          {/* More contribution steps */}
        </div>
        <a
          href={`${project.github}/contribute`}
          className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          View Contribution Guide
        </a>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Support the Project</h3>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="flex items-center gap-3">
              <FaEthereum className="text-2xl text-blue-500" />
              <div>
                <div className="font-medium">Make a Donation</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Support via cryptocurrency
                </div>
              </div>
            </div>
            <FaArrowRight />
          </button>
          {/* Other support options */}
        </div>
      </div>
    </div>
  );
} 