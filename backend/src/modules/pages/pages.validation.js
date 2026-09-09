import { z } from "zod";

// Registered system protection constraints
const RESERVED_SLUGS = [
  "admin", "api", "login", "register", "dashboard", 
  "cms", "uploads", "settings", "profile", "users",
  "home", "index", "404", "500", "menu"
];

// Dynamic system design layout templates routing blocks
export const ALLOWED_TEMPLATES = [
  "default",
  "landing-page",
  "service-page",
  "contact-page",
  "about-page"
];

const heroBlockSchema = z.object({ type: z.literal("hero"), data: z.record(z.any()).default({}) });
const servicesBlockSchema = z.object({ type: z.literal("services"), data: z.record(z.any()).default({}) });
const aboutBlockSchema = z.object({ type: z.literal("about"), data: z.record(z.any()).default({}) });
const ourServicesBlockSchema = z.object({ type: z.literal("our_services"), data: z.record(z.any()).default({}) });
const howWeWorkBlockSchema = z.object({ type: z.literal("how_we_work"), data: z.record(z.any()).default({}) });
const ourProjectsBlockSchema = z.object({ type: z.literal("our_projects"), data: z.record(z.any()).default({}) });
const panoramasBlockSchema = z.object({ type: z.literal("panoramas"), data: z.record(z.any()).default({}) });
const teamBlockSchema = z.object({ type: z.literal("team"), data: z.record(z.any()).default({}) });
const testimonialsBlockSchema = z.object({ type: z.literal("testimonials"), data: z.record(z.any()).default({}) });
const videoBannerBlockSchema = z.object({ type: z.literal("video_banner"), data: z.record(z.any()).default({}) });
const blogSectionBlockSchema = z.object({ type: z.literal("blog_section"), data: z.record(z.any()).default({}) });
const galleryBlockSchema = z.object({ type: z.literal("gallery"), data: z.record(z.any()).default({}) });
const ctaBlockSchema = z.object({ type: z.literal("cta"), data: z.record(z.any()).default({}) });
const richTextBlockSchema = z.object({ type: z.literal("richText"), data: z.record(z.any()).default({}) });
const heroSectionTwoBlockSchema = z.object({ type: z.literal("heroSectionTwo"), data: z.record(z.any()).default({}) });
const aboutSectionTwoBlockSchema = z.object({ type: z.literal("aboutSectionTwo"), data: z.record(z.any()).default({}) });
const servicesSectionTwoBlockSchema = z.object({ type: z.literal("servicesSectionTwo"), data: z.record(z.any()).default({}) });
const processSectionTwoBlockSchema = z.object({ type: z.literal("processSectionTwo"), data: z.record(z.any()).default({}) });
const projectSliderTwoBlockSchema = z.object({ type: z.literal("projectSliderTwo"), data: z.record(z.any()).default({}) });
const trustedPartnersBlockSchema = z.object({ type: z.literal("trustedPartners"), data: z.record(z.any()).default({}) });
const statsSectionTwoBlockSchema = z.object({ type: z.literal("statsSectionTwo"), data: z.record(z.any()).default({}) });
const happySpacesBlockSchema = z.object({ type: z.literal("happySpaces"), data: z.record(z.any()).default({}) });
const happyCustomersBlockSchema = z.object({ type: z.literal("happyCustomers"), data: z.record(z.any()).default({}) });
const testimonialsTwoBlockSchema = z.object({ type: z.literal("testimonialsTwo"), data: z.record(z.any()).default({}) });
const ctaSectionTwoBlockSchema = z.object({ type: z.literal("ctaSectionTwo"), data: z.record(z.any()).default({}) });
const serviceBannerBlockSchema = z.object({ type: z.literal("serviceBanner"), data: z.record(z.any()).default({}) });
const serviceDetailsBlockSchema = z.object({ type: z.literal("serviceDetails"), data: z.record(z.any()).default({}) });
const ctaSectionBlockSchema = z.object({ type: z.literal("ctaSection"), data: z.record(z.any()).default({}) });
const contactBannerBlockSchema = z.object({ type: z.literal("contactBanner"), data: z.record(z.any()).default({}) });
const contactInfoBlockSchema = z.object({ type: z.literal("contactInfo"), data: z.record(z.any()).default({}) });
const aboutBannerBlockSchema = z.object({ type: z.literal("aboutBanner"), data: z.record(z.any()).default({}) });
const aboutExperienceBlockSchema = z.object({ type: z.literal("aboutExperience"), data: z.record(z.any()).default({}) });
const aboutProcessBlockSchema = z.object({ type: z.literal("aboutProcess"), data: z.record(z.any()).default({}) });
const timelineBlockSchema = z.object({ type: z.literal("timeline"), data: z.record(z.any()).default({}) });
const aboutAwardsBlockSchema = z.object({ type: z.literal("aboutAwards"), data: z.record(z.any()).default({}) });
const aboutGalleryBlockSchema = z.object({ type: z.literal("aboutGallery"), data: z.record(z.any()).default({}) });
const projectsBannerBlockSchema = z.object({ type: z.literal("projectsBanner"), data: z.record(z.any()).default({}) });
const blogBannerBlockSchema = z.object({ type: z.literal("blogBanner"), data: z.record(z.any()).default({}) });

const contactFormBlockSchema = z.object({
  type: z.literal("contactForm"),
  data: z.object({
    formId: z.string().cuid("Block content specification failure: Dynamic rendering requires explicit reference binding to an active contact form engine database instance unique identity format signature."),
    formTitle: z.string().trim().max(100).optional().default("Get in Touch"),
    submitButtonText: z.string().trim().max(50).optional().default("Submit Inquiry"),
    redirectPath: z.string().trim().max(250).refine((path) => path.startsWith("/"), {
      message: "Success redirect target layout routing context must be a valid internal system relative path node string structure loop tracking pattern."
    }).optional()
  }).strict() 
});

const blockSchema = z.discriminatedUnion("type", [
  heroBlockSchema,
  servicesBlockSchema,
  aboutBlockSchema,
  ourServicesBlockSchema,
  howWeWorkBlockSchema,
  ourProjectsBlockSchema,
  panoramasBlockSchema,
  teamBlockSchema,
  testimonialsBlockSchema,
  videoBannerBlockSchema,
  blogSectionBlockSchema,
  galleryBlockSchema,
  ctaBlockSchema,
  richTextBlockSchema,
  contactFormBlockSchema,
  heroSectionTwoBlockSchema,
  aboutSectionTwoBlockSchema,
  servicesSectionTwoBlockSchema,
  processSectionTwoBlockSchema,
  projectSliderTwoBlockSchema,
  trustedPartnersBlockSchema,
  statsSectionTwoBlockSchema,
  happySpacesBlockSchema,
  happyCustomersBlockSchema,
  testimonialsTwoBlockSchema,
  ctaSectionTwoBlockSchema,
  serviceBannerBlockSchema,
  serviceDetailsBlockSchema,
  ctaSectionBlockSchema,
  contactBannerBlockSchema,
  contactInfoBlockSchema,
  aboutBannerBlockSchema,
  aboutExperienceBlockSchema,
  aboutProcessBlockSchema,
  timelineBlockSchema,
  aboutAwardsBlockSchema,
  aboutGalleryBlockSchema,
  projectsBannerBlockSchema,
  blogBannerBlockSchema,
]);

const pageContentSchema = z.object({
  blocks: z.array(blockSchema).default([]),
}).default({ blocks: [] });


// API Request Payload Validation Schemas
export const createPageSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(150, "Title cannot exceed 150 characters"),
  
  slug: z.string().trim().toLowerCase()
    .regex(/^[a-z0-9-\/]+$/, "Slug can only contain lowercase letters, numbers, dashes, and slashes")
    .max(150, "Slug cannot exceed 150 characters")
    .refine((slug) => !RESERVED_SLUGS.includes(slug), {
      message: "This slug is reserved by the system and cannot be used.",
    })
    .optional()
    .nullable(),
    
  excerpt: z.string().trim().max(1000, "Excerpt cannot exceed 1000 characters").optional().nullable(),
  content: pageContentSchema,
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]).default("DRAFT").optional(),
  scheduledUpdateAt: z.string().datetime({ message: "Invalid ISO-8601 datetime format" }).optional().nullable(),
  scheduledUpdateData: z.any().optional().nullable(),
  // Template Design Execution Hard Security Control
  template: z.enum(ALLOWED_TEMPLATES, {
    errorMap: () => ({ message: "Selected layout design template is not registered or supported by system." })
  }).default("default").optional(),

  parentId: z.string().cuid("Invalid Parent ID structural trace context format identifier").optional().nullable(),
  menuOrder: z.coerce.number().int("Menu display re-ordering parameter metrics must remain a valid integer").default(0).optional(),
  showInMenu: z.boolean().default(true).optional(),
  
  metaTitle: z.string().trim().max(100, "Meta title cannot exceed 100 characters").optional().nullable(),
  metaDescription: z.string().trim().max(500, "Meta description cannot exceed 500 characters").optional().nullable(),
  metaKeywords: z.string().trim().max(300, "Meta keywords cannot exceed 300 characters").optional().nullable(),
  
  featuredImageId: z.string().cuid("Invalid Media Asset digital asset cryptographic unique identity mapping").optional().nullable(),

  // SEO Engine Fields
  includeInSitemap: z.boolean().default(true).optional(),
  noIndex: z.boolean().default(false).optional(),
  noFollow: z.boolean().default(false).optional(),
  canonicalUrl: z.union([z.string().trim().url("Invalid canonical URL format."), z.literal("")]).optional().nullable(),
  ogTitle: z.string().trim().max(150).optional().nullable(),
  ogDescription: z.string().trim().max(500).optional().nullable(),
  ogImageId: z.union([z.string().cuid("Invalid OG Image ID format."), z.literal("")]).optional().nullable(),
}).strict();
 
// Core Update Operations Pipeline Matrix Verification Schema  
export const updatePageSchema = createPageSchema.partial().extend({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "SCHEDULED"]).optional(),
});

// Admin Filter Matrix & Pagination Configuration Management Schema Lookups
export const pageQuerySchema = z.object({
  page: z.coerce.number().int().min(1, "Page tracking parameter must remain greater than 0").default(1),
  limit: z.coerce.number().int().min(1, "Pagination capacity constraint limit must register at least 1 data node").max(100, "Maximum network extraction block limit is capped at 100 records buffer").default(100),
  search: z.string().trim().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "SCHEDULED"]).optional(),
  template: z.enum(ALLOWED_TEMPLATES).optional(), 
  authorId: z.string().cuid("Invalid corporate author query sequence filter constraint token").optional(),
  parentId: z.string().cuid("Invalid branch structural parent filter query identity token parameter").optional().nullable(), 
  sortBy: z.enum(["createdAt", "updatedAt", "publishedAt", "title", "menuOrder"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const pageIdParamSchema = z.object({
  id: z.string().cuid("Invalid cryptographic database record or unique execution structural transaction identifier identity format mapped"),
});

export const pageSlugParamSchema = z.object({
  slug: z.string().min(1, "Absolute layout path relative network resource endpoint tracking resource tracking signature processing failed"),
});

export const pageRevisionParamSchema = z.object({
  id: z.string().cuid("Invalid relational Page context unique validation model master layout ID template mapping token"),
  revisionId: z.string().cuid("Invalid historical version revision database checkpoint identifier cryptographic targeted snapshot identity token format")
});