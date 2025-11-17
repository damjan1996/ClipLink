import { chromium, Browser, Page } from 'playwright';

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
  private browser: Browser | null = null;
  private page: Page | null = null;

  async init() {
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
  }

  async close() {
    if (this.page) await this.page.close();
    if (this.browser) await this.browser.close();
  }

  async scrapeVideo(url: string, platform: string): Promise<VideoMetadata> {
    if (!this.page) await this.init();

    try {
      switch (platform) {
        case 'youtube':
          return await this.scrapeYouTube(url);
        case 'tiktok':
          return await this.scrapeTikTok(url);
        case 'instagram':
          return await this.scrapeInstagram(url);
        case 'twitter':
          return await this.scrapeTwitter(url);
        case 'linkedin':
          return await this.scrapeLinkedIn(url);
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error) {
      console.error(`Error scraping ${platform} video:`, error);
      return { 
        viewCount: 0, 
        error: error instanceof Error ? error.message : 'Scraping failed' 
      };
    }
  }

  private async scrapeYouTube(url: string): Promise<VideoMetadata> {
    await this.page!.goto(url, { waitUntil: 'networkidle' });
    await this.page!.waitForTimeout(2000);

    const title = await this.page!.$eval(
      'h1.ytd-watch-metadata yt-formatted-string',
      el => el.textContent?.trim()
    ).catch(() => undefined);

    const viewCountText = await this.page!.$eval(
      'ytd-video-view-count-renderer span.view-count',
      el => el.textContent?.trim()
    ).catch(() => '0 views');

    const viewCount = this.parseViewCount(viewCountText || '0');

    const uploadDate = await this.page!.$eval(
      '#info-strings yt-formatted-string',
      el => el.textContent?.trim()
    ).catch(() => undefined);

    const description = await this.page!.$eval(
      'ytd-text-inline-expander',
      el => el.textContent?.trim()
    ).catch(() => undefined);

    const thumbnailUrl = await this.page!.$eval(
      'meta[property="og:image"]',
      el => el.getAttribute('content')
    ).catch(() => undefined);

    return {
      title,
      description: description?.slice(0, 1000),
      viewCount,
      uploadDate: uploadDate ? this.parseUploadDate(uploadDate) : undefined,
      thumbnailUrl,
    };
  }

  private async scrapeTikTok(url: string): Promise<VideoMetadata> {
    await this.page!.goto(url, { waitUntil: 'networkidle' });
    await this.page!.waitForTimeout(2000);

    const viewCountText = await this.page!.$eval(
      '[data-e2e="play-count"]',
      el => el.textContent?.trim()
    ).catch(() => '0');

    const viewCount = this.parseViewCount(viewCountText || '0');

    const title = await this.page!.$eval(
      '[data-e2e="browse-video-desc"] span',
      el => el.textContent?.trim()
    ).catch(() => undefined);

    const thumbnailUrl = await this.page!.$eval(
      'meta[property="og:image"]',
      el => el.getAttribute('content')
    ).catch(() => undefined);

    return {
      title,
      viewCount,
      thumbnailUrl,
    };
  }

  private async scrapeInstagram(url: string): Promise<VideoMetadata> {
    await this.page!.goto(url, { waitUntil: 'networkidle' });
    await this.page!.waitForTimeout(2000);

    // Instagram requires login for detailed view counts
    // We'll try to get basic metadata
    const title = await this.page!.$eval(
      'meta[property="og:title"]',
      el => el.getAttribute('content')
    ).catch(() => undefined);

    const thumbnailUrl = await this.page!.$eval(
      'meta[property="og:image"]',
      el => el.getAttribute('content')
    ).catch(() => undefined);

    // For Instagram, view count often requires authentication
    // Return 0 for now, can be updated manually
    return {
      title,
      viewCount: 0,
      thumbnailUrl,
    };
  }

  private async scrapeTwitter(url: string): Promise<VideoMetadata> {
    await this.page!.goto(url, { waitUntil: 'networkidle' });
    await this.page!.waitForTimeout(2000);

    const viewCountText = await this.page!.$eval(
      '[data-testid="app-text-transition-container"] span',
      el => el.textContent?.trim()
    ).catch(() => '0');

    const viewCount = this.parseViewCount(viewCountText || '0');

    const title = await this.page!.$eval(
      '[data-testid="tweetText"]',
      el => el.textContent?.trim()
    ).catch(() => undefined);

    return {
      title: title?.slice(0, 200),
      viewCount,
    };
  }

  private async scrapeLinkedIn(url: string): Promise<VideoMetadata> {
    await this.page!.goto(url, { waitUntil: 'networkidle' });
    await this.page!.waitForTimeout(2000);

    // LinkedIn also requires authentication for most data
    const title = await this.page!.$eval(
      'meta[property="og:title"]',
      el => el.getAttribute('content')
    ).catch(() => undefined);

    return {
      title,
      viewCount: 0, // LinkedIn requires auth for view counts
    };
  }

  private parseViewCount(text: string): number {
    // Remove all non-numeric characters except dots and commas
    const cleanText = text.toLowerCase();
    
    // Handle abbreviations
    let multiplier = 1;
    if (cleanText.includes('k')) multiplier = 1000;
    else if (cleanText.includes('m')) multiplier = 1000000;
    else if (cleanText.includes('b')) multiplier = 1000000000;
    
    // Extract number
    const number = parseFloat(cleanText.replace(/[^0-9.]/g, ''));
    return Math.round((isNaN(number) ? 0 : number) * multiplier);
  }

  private parseUploadDate(text: string): Date | undefined {
    try {
      // Handle various date formats
      const date = new Date(text);
      return isNaN(date.getTime()) ? undefined : date;
    } catch {
      return undefined;
    }
  }
}

// Singleton instance
let scraperInstance: VideoScraper | null = null;

export async function getVideoMetadata(url: string, platform: string): Promise<VideoMetadata> {
  if (!scraperInstance) {
    scraperInstance = new VideoScraper();
  }
  
  try {
    return await scraperInstance.scrapeVideo(url, platform);
  } finally {
    // Clean up after each scrape to avoid memory leaks
    await scraperInstance.close();
    scraperInstance = null;
  }
}