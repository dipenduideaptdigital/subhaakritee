import { 
  heroSchema, 
  servicesSchema, 
  aboutSchema,
  ourServicesSchema,
  howWeWorkSchema,
  ourProjectsSchema,
  panoramasSchema,
  teamSchema,
  testimonialsSchema,
  videoBannerSchema,
  blogSectionSchema,
  gallerySchema,
  ctaSchema,
  generalSettingsSchema,
  cmsSettingsSchema,
  whatsappSettingsSchema,
  footerSchema,
  globalGeneralSettingsSchema
} from "./cms.validation.js";

// Maps frontend section keys to backend validation schemas
export const CMS_REGISTRY = {
  "homepage_hero": heroSchema,
  "homepage_services": servicesSchema,
  "homepage_about": aboutSchema,
  "homepage_our_services": ourServicesSchema,
  "homepage_how_we_work": howWeWorkSchema,
  "homepage_our_projects": ourProjectsSchema,
  "homepage_panoramas": panoramasSchema,
  "homepage_team": teamSchema,
  "homepage_testimonials": testimonialsSchema,
  "homepage_video_banner": videoBannerSchema,
  "homepage_blog_section": blogSectionSchema,
  "homepage_gallery": gallerySchema,
  "homepage_cta": ctaSchema,
  "homepage_general": generalSettingsSchema,
  "homepage_footer": footerSchema,
  "cms_settings": cmsSettingsSchema,
  "whatsapp_settings": whatsappSettingsSchema,
  "global_general_settings": globalGeneralSettingsSchema
};