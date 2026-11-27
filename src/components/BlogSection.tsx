import { useMemo, useState } from 'react';
import { ArrowUpRight, Clock, FileSpreadsheet, MapPin, X } from 'lucide-react';
import { COPY, translateBlogCategory } from '../i18n/translations';
import type {
  BlogCategory,
  BlogPost,
  LeadServiceType,
  Locale,
  SiteSettings,
} from '../types/domain';
import { BLOG_CATEGORIES } from '../types/domain';
import { filterBlogsByCategory } from '../utils/validation';
import { AdSlot } from './AdSlot';
import { MediaImage } from './MediaImage';

interface BlogSectionProps {
  lang: Locale;
  posts: BlogPost[];
  siteSettings: SiteSettings;
  onConsultTopic: (service: LeadServiceType, contextNote: string, city?: string) => void;
}

function mapCategoryToLeadService(category: BlogCategory): LeadServiceType {
  switch (category) {
    case 'Strategi OOH':
      return 'OOH & Billboard';
    case 'Partner Hosting':
      return 'Partner Hosting & CMS';
    case 'SEO & GEO':
    case 'Performance Ads':
    default:
      return 'Kampanye Digital';
  }
}

export function BlogSection({
  lang,
  posts,
  siteSettings,
  onConsultTopic,
}: BlogSectionProps) {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | 'Semua'>('Semua');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const t = COPY[lang].blog;

  const filteredPosts = useMemo(
    () => filterBlogsByCategory(posts, activeCategory),
    [posts, activeCategory]
  );

  const getTitle = (post: BlogPost) => (lang === 'en' ? post.titleEn || post.titleId : post.titleId);
  const getExcerpt = (post: BlogPost) =>
    lang === 'en' ? post.excerptEn || post.excerptId : post.excerptId;
  const getContent = (post: BlogPost) =>
    lang === 'en' ? post.contentEn || post.contentId : post.contentId;

  return (
    <section id="blog" className="py-16 lg:py-24 bg-[#F8F7F4] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header + Category Filter */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-[#1D4ED8] mb-2">{t.kicker}</p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#0D1117] [text-wrap:balance] mb-3">
              {t.heading}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">{t.subtitle}</p>
          </div>

          <div
            role="tablist"
            aria-label={lang === 'en' ? 'Blog topic filter' : 'Filter topik artikel blog'}
            className="flex flex-wrap xl:flex-nowrap items-center gap-1 p-1.5 bg-white rounded-lg border border-stone-200 shrink-0 self-start xl:self-end"
          >
            {(['Semua', ...BLOG_CATEGORIES] as const).map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#0D1117] text-white'
                      : 'text-stone-700 hover:text-[#0D1117] hover:bg-stone-100'
                  }`}
                >
                  {translateBlogCategory(category, lang)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredPosts.length === 0 ? (
          <div className="p-10 text-center border border-stone-200 rounded-xl bg-white">
            <p className="text-base font-medium text-[#0D1117] mb-2">{t.emptyTitle}</p>
            <p className="text-sm text-stone-600 mb-4">{t.emptyBody}</p>
            <button
              type="button"
              onClick={() => setActiveCategory('Semua')}
              className="px-4 py-2 bg-[#0D1117] text-white text-sm font-medium rounded-lg cursor-pointer"
            >
              {t.showAll}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => {
              const title = getTitle(post);
              const excerpt = getExcerpt(post);

              return (
                <article
                  key={post.id}
                  className="group flex flex-col justify-between border border-stone-200 rounded-xl overflow-hidden bg-white transition-colors duration-150 hover:border-stone-400"
                >
                  <div>
                    <div className="h-52 overflow-hidden bg-stone-900 relative">
                      <MediaImage
                        src={post.coverImageUrl}
                        alt={title}
                        fallbackTitle={title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 mb-2.5">
                        <span className="font-semibold text-[#1D4ED8]">
                          {translateBlogCategory(post.category, lang)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{post.geoCity}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-tabular">
                          {post.readMinutes} {t.minRead}
                        </span>
                      </div>

                      <h3 className="font-display text-lg sm:text-xl font-bold text-[#0D1117] tracking-tight mb-2.5 [text-wrap:balance]">
                        {title}
                      </h3>

                      <p className="text-sm text-stone-600 leading-relaxed line-clamp-3">{excerpt}</p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                    <div className="text-xs text-stone-500 flex items-center gap-1.5 min-w-0">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-stone-400 shrink-0" aria-hidden="true" />
                      <span className="truncate">
                        {post.source === 'google_sheets' ? t.sourceSheets : t.sourceCms} ·{' '}
                        <span className="font-mono-tabular">{post.publishedAt}</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedPost(post)}
                      aria-label={`${t.readArticle}: ${title}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-stone-300 bg-[#F8F7F4] hover:bg-[#0D1117] hover:text-white hover:border-[#0D1117] text-[#0D1117] text-xs font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>{t.readArticle}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Blog Feed AdSense / Media Partner Slot */}
        <AdSlot
          lang={lang}
          siteSettings={siteSettings}
          variant="leaderboard"
          onConsultSponsor={() =>
            onConsultTopic(
              'Kampanye Digital',
              lang === 'en'
                ? 'Inquiring about sponsored media placement on kotobatuah.com Blog'
                : 'Minat penempatan iklan / sponsor media pada artikel Blog kotobatuah.com'
            )
          }
        />
      </div>

      {/* Article Reader Dialog */}
      {selectedPost && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="blog-reader-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-white border border-stone-200 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-[16/9] bg-stone-900 relative overflow-hidden">
              <MediaImage
                src={selectedPost.coverImageUrl}
                alt={getTitle(selectedPost)}
                fallbackTitle={getTitle(selectedPost)}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                aria-label={lang === 'en' ? 'Close article' : 'Tutup artikel'}
                className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-black/75 text-white hover:bg-black flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 mb-3">
                <span className="font-semibold text-[#1D4ED8]">
                  {translateBlogCategory(selectedPost.category, lang)}
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
                  {selectedPost.geoCity}
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 font-mono-tabular">
                  <Clock className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
                  {selectedPost.readMinutes} {t.minRead}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">{selectedPost.publishedAt}</span>
              </div>

              <h3
                id="blog-reader-title"
                className="font-display text-2xl sm:text-3xl font-bold text-[#0D1117] tracking-tight mb-3 [text-wrap:balance]"
              >
                {getTitle(selectedPost)}
              </h3>

              <p className="text-xs text-stone-500 mb-6">
                {selectedPost.author} ·{' '}
                {selectedPost.source === 'google_sheets' ? t.sourceSheets : t.sourceCms}
              </p>

              <div className="space-y-4 py-6 border-y border-stone-200 text-sm sm:text-base text-stone-700 leading-relaxed">
                {(() => {
                  const paragraphs = getContent(selectedPost)
                    .split(/\n{2,}/)
                    .map((p) => p.trim())
                    .filter(Boolean);
                  return paragraphs.map((paragraph, i) => (
                    <div key={i} className="space-y-4">
                      <p>{paragraph}</p>
                      {i === 0 && (
                        <AdSlot
                          lang={lang}
                          siteSettings={siteSettings}
                          variant="in-article"
                        />
                      )}
                    </div>
                  ));
                })()}
              </div>

              <div className="py-4 flex flex-wrap items-center gap-2 border-b border-stone-100 mb-6">
                <span className="text-xs font-semibold text-stone-500 mr-1">{t.tagsLabel}:</span>
                {selectedPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-[#F8F7F4] border border-stone-200 rounded text-xs text-stone-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-[#0D1117] cursor-pointer"
                >
                  {t.backToBlog}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const svc = mapCategoryToLeadService(selectedPost.category);
                    const title = getTitle(selectedPost);
                    const city = selectedPost.geoCity;
                    setSelectedPost(null);
                    onConsultTopic(
                      svc,
                      lang === 'en'
                        ? `Consultation from blog article: "${title}"`
                        : `Konsultasi lanjutan dari artikel blog: "${title}"`,
                      city
                    );
                  }}
                  className="px-5 py-2.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {t.consultTopic}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
