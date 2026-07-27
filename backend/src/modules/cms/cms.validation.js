import { z } from "zod";

const singleHeroSlideSchema = z.object({
  titleLine1: z.string().max(100).optional(),
  titleLine2: z.string().max(100).optional(),
  subtitle: z.string().max(500).optional(),
  buttonText: z.string().max(50).optional(),
  badgeText: z.string().max(50).optional(),
  glassCardNumber: z.string().max(20).optional(),
  glassCardText1: z.string().max(100).optional(),
  glassCardText2: z.string().max(100).optional(),
  backgroundImage: z.string().optional(),
  frontImage: z.string().optional(),
}).optional();

export const heroSchema = z.object({
  content: z.object({
    slide1: singleHeroSlideSchema,
    slide2: singleHeroSlideSchema,
    slide3: singleHeroSlideSchema,
  }),
});

// Services Section
export const servicesSchema = z.object({
  content: z.object({
    badgeText: z.string().max(50).optional(),
    title: z.string().max(150).optional(),
    description: z.string().max(500).optional(),
    services: z.array(
      z.object({
        title: z.string().max(100).optional(),
        description: z.string().max(300).optional(),
      })
    ).max(4).optional(),
  }),
});

// About Section
export const aboutSchema = z.object({
  content: z.object({
    badgeText: z.string().max(50).optional(),
    title: z.string().max(150).optional(),
    description: z.string().max(1000).optional(),
    buttonText: z.string().max(50).optional(),
    image: z.string().optional(),
    highlights: z.array(z.string().max(100)).max(6).optional(),
  }),
});

// Our Services Section
export const ourServicesSchema = z.object({
  content: z.object({
    badgeText: z.string().max(50).optional(),
    title: z.string().max(150).optional(),
    description: z.string().max(1000).optional(),
    services: z.array(
      z.object({
        id: z.union([z.string(), z.number()]).optional(),
        title: z.string().max(100).optional(),
        link: z.string().max(255).optional(),
      })
    ).optional(),
    stats: z.array(
      z.object({
        value: z.string().max(20).optional(),
        title: z.string().max(100).optional(),
        description: z.string().max(300).optional(),
      })
    ).optional(),
    image: z.string().optional(),
    bottomImage: z.string().optional(),
  }),
});

// How We Work Section
export const howWeWorkSchema = z.object({
  content: z.object({
    badgeText: z.string().max(50).optional(),
    title: z.string().max(150).optional(),
    description: z.string().max(1000).optional(),
    steps: z.array(
      z.object({
        id: z.union([z.string(), z.number()]).optional(),
        title: z.string().max(100).optional(),
        description: z.string().max(500).optional(),
      })
    ).optional(),
    bottomText: z.string().max(200).optional(),
    bottomLinkText: z.string().max(50).optional(),
    bottomLinkUrl: z.string().max(500).optional(),
  }),
});

// Our Projects Section
export const ourProjectsSchema = z.object({
  content: z.object({
    badgeText: z.string().max(50).optional(),
    title: z.string().max(150).optional(),
    description: z.string().max(1000).optional(),
    projects: z.array(
      z.object({
        id: z.union([z.string(), z.number()]).optional(),
        category: z.string().max(50).optional(),
        title: z.string().max(100).optional(),
        description: z.string().max(500).optional(),
        image: z.string().optional(),
      })
    ).optional(),
    bottomImage: z.string().optional(),
  }),
});

// Panoramas Section
export const panoramasSchema = z.object({
  content: z.object({
    badgeText: z.string().max(50).optional(),
    title: z.string().max(150).optional(),
    image: z.string().optional(),
  }),
});

// Team Section
export const teamSchema = z.object({
  content: z.object({
    badgeText: z.string().max(50).optional(),
    title: z.string().max(150).optional(),
    description: z.string().max(1000).optional(),
    
    members: z.array(
      z.object({
        id: z.union([z.string(), z.number()]).optional(),
        name: z.string().max(100).optional(),
        role: z.string().max(100).optional(),
        image: z.string().optional(),
      })
    ).optional(),
  }),
});

// Testimonials Section
export const testimonialsSchema = z.object({
  content: z.object({
    badgeText: z.string().max(50).optional(),
    title: z.string().max(150).optional(),
    description: z.string().max(1000).optional(),
    image: z.string().optional(),
    ratingValue: z.string().max(10).optional(),
    reviewCount: z.string().max(50).optional(),
    conceptText: z.string().max(500).optional(),
    mainQuote: z.string().max(1000).optional(),
    authorImage: z.string().optional(),
    authorName: z.string().max(100).optional(),
    authorRole: z.string().max(100).optional(),
    bottomText: z.string().max(200).optional(),
    logos: z.array(z.string()).optional(),
  }),
});

// Video Banner Section
export const videoBannerSchema = z.object({
  content: z.object({
    videoId: z.string().max(255).optional(),
    image: z.string().optional(),
    title: z.string().max(150).optional(),
    description: z.string().max(1000).optional(),
  }),
});

// Blog Section
export const blogSectionSchema = z.object({
  content: z.object({
    badgeText: z.string().max(50).optional(),
    title: z.string().max(150).optional(),
    posts: z.array(
      z.object({
        id: z.union([z.string(), z.number()]).optional(),
        author: z.string().max(100).optional(),
        title: z.string().max(200).optional(),
        excerpt: z.string().max(500).optional(),
        image: z.string().optional(),
      })
    ).optional(),
  }),
});

// Gallery Section
export const gallerySchema = z.object({
  content: z.object({
    bgText: z.string().max(50).optional(),
    images: z.array(z.string()).max(10).optional(),
  }),
});

// CTA Section
export const ctaSchema = z.object({
  content: z.object({
    badgeText: z.string().max(50).optional(),
    title: z.string().max(150).optional(),
    buttonText: z.string().max(50).optional(),
  }),
});

// General Settings Section (Crucial for LandingContainer route)
export const generalSettingsSchema = z.object({
  content: z.object({
    landingPage: z.enum(["default", "reference"]).default("default")
  }).strict()
});

// CMS Settings Section
export const cmsSettingsSchema = z.object({
  content: z.object({
    cmsName: z.string().max(100).optional(),
    cmsTagline: z.string().max(200).optional(),
  })
});

// WhatsApp Settings Section
export const whatsappSettingsSchema = z.object({
  content: z.object({
    phoneNumber: z.string().max(50).optional(),
    defaultMessage: z.string().max(300).optional(),
    isActive: z.boolean().default(true),
  })
});


// Footer Section
export const footerSchema = z.object({
  content: z.object({
    description: z.string().max(1000).optional(),
    address: z.string().max(500).optional(),
    phone: z.string().max(100).optional(),
    phone2: z.string().max(100).optional(),
    email: z.string().max(100).optional(),
    email2: z.string().max(100).optional(),
    instagram: z.string().max(255).optional(),
    twitter: z.string().max(255).optional(),
    facebook: z.string().max(255).optional(),
    linkedin: z.string().max(255).optional(),
    copyrightText: z.string().max(255).optional(),
    linksTitle1: z.string().max(100).optional(),
    linksTitle2: z.string().max(100).optional(),
    links1: z.array(
      z.object({
        label: z.string().max(100).optional(),
        url: z.string().max(255).optional(),
      })
    ).optional(),
    links2: z.array(
      z.object({
        label: z.string().max(100).optional(),
        url: z.string().max(255).optional(),
      })
    ).optional(),
  }).optional(),
});

export const globalGeneralSettingsSchema = z.object({
  content: z.object({
    websiteName: z.string().max(100).optional(),
    supportEmail: z.string().email().optional().or(z.literal('')),
    faviconImage: z.string().optional().nullable(),
    adminLoginLogo: z.string().optional().nullable(),
    errorPageImage: z.string().optional().nullable(),
    errorPageTitle: z.string().max(150).optional(),
    errorPageDescription: z.string().max(500).optional(),
    errorPageButtonText: z.string().max(50).optional(),
  })
});