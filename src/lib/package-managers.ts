import axios from 'axios';

interface PackageInfo {
  name: string;
  version: string;
  description: string;
  downloads: number;
  repository: string;
  dependencies: string[];
}

export class PackageManagerClient {
  static async getNpmInfo(packageName: string): Promise<PackageInfo> {
    const response = await axios.get(`https://registry.npmjs.org/${packageName}`);
    const latest = response.data['dist-tags'].latest;
    const info = response.data.versions[latest];
    
    const downloads = await axios.get(
      `https://api.npmjs.org/downloads/point/last-month/${packageName}`
    );

    return {
      name: packageName,
      version: latest,
      description: info.description,
      downloads: downloads.data.downloads,
      repository: info.repository?.url,
      dependencies: Object.keys(info.dependencies || {}),
    };
  }

  static async getPyPiInfo(packageName: string): Promise<PackageInfo> {
    const response = await axios.get(`https://pypi.org/pypi/${packageName}/json`);
    const info = response.data.info;
    
    return {
      name: packageName,
      version: info.version,
      description: info.summary,
      downloads: 0, // PyPI doesn't provide download stats
      repository: info.project_urls?.Repository,
      dependencies: [], // Would need to parse requirements.txt
    };
  }
} 