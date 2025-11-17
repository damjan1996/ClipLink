export interface VideoMetadata {
  title?: string;
  description?: string;
  viewCount: number;
  uploadDate?: Date;
  duration?: number;
  thumbnailUrl?: string;
  error?: string;
}

export class VideoScraper {
  async scrapeVideo(url: string, platform: string): Promise<VideoMetadata> {
    try {
      // For now, return basic metadata without Playwright
      // This can be enhanced with external APIs later
      return {
        title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Video`,
        viewCount: 0,
        error: 'Scraping temporarily disabled for Vercel deployment'
      };
    } catch (error) {
      console.error(`Error scraping ${platform} video:`, error);
      return { 
        viewCount: 0, 
        error: error instanceof Error ? error.message : 'Scraping failed' 
      };
    }
  }

}

export async function getVideoMetadata(url: string, platform: string): Promise<VideoMetadata> {
  const scraper = new VideoScraper();
  return await scraper.scrapeVideo(url, platform);
}