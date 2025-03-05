/* eslint-disable */
// @ts-nocheck

function analyzePageSEO() {
  const pageData = {
    general: {
      metaTitle: document.title,
      metaDescription: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      canonicalUrl: document.querySelector('link[rel="canonical"]')?.href || '',
      indexable: !document.querySelector('meta[name="robots"][content*="noindex"]'),
      robotsTxtBlocked: false, // Requiere verificación adicional
      metaTags: Array.from(document.querySelectorAll('meta')).map(meta => 
        `${meta.getAttribute('name') || meta.getAttribute('property')}: ${meta.getAttribute('content')}`
      ),
    },
    headings: {
      structure: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(heading => ({
        tag: heading.tagName,
        text: heading.textContent.trim()
      })),
      wordRelevance: extractWordRelevance()
    },
    links: {
      internal: extractLinks(true),
      external: extractLinks(false)
    },
    hreflang: extractHreflang(),
    images: extractImageAnalysis(),
    schema: extractSchemaMarkup(),
    seoScore: calculateSEOScore()
  };

  return pageData;
}

function extractWordRelevance() {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const relevance = {
    oneWord: [],
    twoWords: [],
    threeWords: [],
    fourWords: []
  };

  headings.forEach(heading => {
    const words = heading.textContent.trim().split(/\s+/);
    
    if (words.length === 1) relevance.oneWord.push(words[0]);
    if (words.length === 2) relevance.twoWords.push(words.join(' '));
    if (words.length === 3) relevance.threeWords.push(words.join(' '));
    if (words.length === 4) relevance.fourWords.push(words.join(' '));
  });

  return relevance;
}

function extractLinks(internal = true) {
  const currentDomain = window.location.hostname;
  return Array.from(document.querySelectorAll('a')).filter(link => {
    const href = link.href;
    const isInternalLink = href.includes(currentDomain);
    return internal ? isInternalLink : !isInternalLink;
  }).map(link => ({
    url: link.href,
    redirect: false // Para verificar redirecciones se necesitaría una solicitud adicional
  }));
}

function extractHreflang() {
  const hreflangTags = Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]')).map(link => {
    return `hreflang="${link.getAttribute('hreflang')}" href="${link.href}"`;
  });

  const issues = [];
  const languageCodes = new Set();

  // Verificar duplicados y otros problemas
  hreflangTags.forEach(tag => {
    const langCode = tag.match(/hreflang="([^"]+)"/)?.[1];
    
    if (langCode) {
      if (languageCodes.has(langCode)) {
        issues.push(`Código de idioma duplicado: ${langCode}`);
      }
      languageCodes.add(langCode);

      // Validar formato de código de idioma
      if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(langCode)) {
        issues.push(`Formato de código de idioma inválido: ${langCode}`);
      }
    }
  });

  // Verificar x-default
  const xDefaultTags = hreflangTags.filter(tag => tag.includes('x-default'));
  if (xDefaultTags.length === 0) {
    issues.push('Falta etiqueta x-default');
  }
  if (xDefaultTags.length > 1) {
    issues.push('Múltiples etiquetas x-default');
  }

  return {
    tags: hreflangTags,
    issues: issues
  };
}

function extractImageAnalysis() {
  const images = Array.from(document.querySelectorAll('img'));
  
  const imagesWithAlt = images
    .filter(img => img.alt && img.alt.trim() !== '')
    .map(img => ({
      src: img.src,
      alt: img.alt
    }));

  const imagesWithoutAlt = images
    .filter(img => !img.alt || img.alt.trim() === '')
    .map(img => ({
      src: img.src
    }));

  return {
    imagesWithAlt,
    imagesWithoutAlt
  };
}

function extractSchemaMarkup() {
  const schemaScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
  
  const presentSchemas = [];
  const schemaDetails = {};

  schemaScripts.forEach(script => {
    try {
      const schemaData = JSON.parse(script.textContent);
      
      if (schemaData['@type']) {
        const schemaType = schemaData['@type'];
        presentSchemas.push(schemaType);
        schemaDetails[schemaType] = schemaData;
      }
    } catch (error) {
      console.error('Error parsing schema:', error);
    }
  });

  return {
    presentSchemas,
    schemaDetails
  };
}

function calculateSEOScore() {
  let score = 100;

  // Deducciones basadas en diferentes criterios
  const metaTitle = document.title;
  const metaDescription = document.querySelector('meta[name="description"]');
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const robotsMeta = document.querySelector('meta[name="robots"]');
  const images = document.querySelectorAll('img');

  // Verificaciones de Meta Title
  if (!metaTitle || metaTitle.length < 10 || metaTitle.length > 60) {
    score -= 10;
  }

  // Verificaciones de Meta Description
  if (!metaDescription || metaDescription.getAttribute('content')?.length < 50 || metaDescription.getAttribute('content')?.length > 160) {
    score -= 10;
  }

  // Verificaciones de URL Canónica
  if (!canonicalLink) {
    score -= 5;
  }

  // Verificaciones de Encabezados
  if (document.querySelectorAll('h1').length !== 1) {
    score -= 10;
  }

  // Verificaciones de Imágenes
  const imagesWithoutAlt = Array.from(images).filter(img => !img.alt || img.alt.trim() === '');
  if (imagesWithoutAlt.length > 0) {
    score -= Math.min(imagesWithoutAlt.length * 2, 15);
  }

  // Verificaciones de Schema
  const schemaScripts = document.querySelectorAll('script[type="application/ld+json"]');
  if (schemaScripts.length === 0) {
    score -= 10;
  }

  // Verificaciones de Robots
  if (robotsMeta && robotsMeta.getAttribute('content')?.includes('noindex')) {
    score -= 20;
  }

  // Asegurar que la puntuación no sea negativa
  return Math.max(0, score);
}

// Listener para manejar solicitudes de análisis
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzePage") {
    sendResponse(analyzePageSEO());
    return true; // Importante para mantener el canal de comunicación abierto
  }
});

// Al cargar la página
console.log("SEO Analysis content script loaded");