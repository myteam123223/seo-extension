import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from 'lucide-react';

const SEOExtension = () => {
  const [pageData, setPageData] = useState({
    general: {
      metaTitle: '',
      metaDescription: '',
      canonicalUrl: '',
      indexable: false,
      robotsTxtBlocked: false,
      metaTags: [],
    },
    headings: {
      structure: [],
      wordRelevance: {
        oneWord: [],
        twoWords: [],
        threeWords: [],
        fourWords: [],
      },
    },
    links: {
      internal: [],
      external: [],
    },
    hreflang: {
      tags: [],
      issues: [],
    },
    images: {
      imagesWithAlt: [],
      imagesWithoutAlt: [],
    },
    schema: {
      presentSchemas: [],
      schemaDetails: {},
    },
    seoScore: 0,
  });

  const fetchPageData = async () => {
    // Lógica para obtener datos de la página actual
    // Esta función se implementaría para extraer información de la página web actual
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "analyzePage" }, (response) => {
        if (response) {
          setPageData(response);
        }
      });
    });
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const renderGeneralTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Análisis SEO General</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold">Meta Title</h3>
            <p>{pageData.general.metaTitle || 'No encontrado'}</p>
          </div>
          <div>
            <h3 className="font-bold">Meta Descripción</h3>
            <p>{pageData.general.metaDescription || 'No encontrado'}</p>
          </div>
          <div>
            <h3 className="font-bold">URL Canónica</h3>
            <p>{pageData.general.canonicalUrl || 'No definida'}</p>
          </div>
          <div className="flex items-center">
            <h3 className="font-bold mr-2">Indexable:</h3>
            {pageData.general.indexable ? 
              <CheckCircle2 color="green" /> : 
              <XCircle color="red" />
            }
          </div>
          <div className="flex items-center">
            <h3 className="font-bold mr-2">Bloqueado por Robots.txt:</h3>
            {pageData.general.robotsTxtBlocked ? 
              <XCircle color="red" /> : 
              <CheckCircle2 color="green" />
            }
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-bold">Meta Tags Adicionales</h3>
          <ul>
            {pageData.general.metaTags.map((tag, index) => (
              <li key={index}>{tag}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );

  const renderHeadingsTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Estructura de Encabezados</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <h3 className="font-bold">Jerarquía de Encabezados</h3>
          {pageData.headings.structure.map((heading, index) => (
            <div key={index} className="mb-2">
              <span className="font-semibold">{heading.tag}:</span> {heading.text}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <h3 className="font-bold">Relevancia de Contenido</h3>
          <div>
            <h4>1 Palabra:</h4>
            <ul>
              {pageData.headings.wordRelevance.oneWord.map((word, index) => (
                <li key={index}>{word}</li>
              ))}
            </ul>
            <h4>2 Palabras:</h4>
            <ul>
              {pageData.headings.wordRelevance.twoWords.map((words, index) => (
                <li key={index}>{words}</li>
              ))}
            </ul>
            <h4>3 Palabras:</h4>
            <ul>
              {pageData.headings.wordRelevance.threeWords.map((words, index) => (
                <li key={index}>{words}</li>
              ))}
            </ul>
            <h4>4 Palabras:</h4>
            <ul>
              {pageData.headings.wordRelevance.fourWords.map((words, index) => (
                <li key={index}>{words}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderLinksTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Análisis de Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <h3 className="font-bold">Links Internos</h3>
          <ul>
            {pageData.links.internal.map((link, index) => (
              <li key={index} className="mb-2">
                <div>URL: {link.url}</div>
                <div>Redirección: {link.redirect ? 'Sí' : 'No'}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <h3 className="font-bold">Links Externos</h3>
          <ul>
            {pageData.links.external.map((link, index) => (
              <li key={index} className="mb-2">
                <div>URL: {link.url}</div>
                <div>Redirección: {link.redirect ? 'Sí' : 'No'}</div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );

  const renderHreflangTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Análisis de Hreflang</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <h3 className="font-bold">Etiquetas Hreflang</h3>
          <ul>
            {pageData.hreflang.tags.map((tag, index) => (
              <li key={index}>{tag}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <h3 className="font-bold">Problemas Detectados</h3>
          <ul>
            {pageData.hreflang.issues.map((issue, index) => (
              <li key={index} className="text-red-500">{issue}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );

  const renderImagesTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Análisis de Imágenes</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <h3 className="font-bold">Imágenes con Alt</h3>
          <ul>
            {pageData.images.imagesWithAlt.map((img, index) => (
              <li key={index}>
                <div>Src: {img.src}</div>
                <div>Alt: {img.alt}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <h3 className="font-bold text-red-500">Imágenes sin Alt</h3>
          <ul>
            {pageData.images.imagesWithoutAlt.map((img, index) => (
              <li key={index} className="text-red-500">
                Src: {img.src}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );

  const renderSchemaTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Análisis de Schema</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <h3 className="font-bold">Schemas Presentes</h3>
          <ul>
            {pageData.schema.presentSchemas.map((schema, index) => (
              <li key={index}>{schema}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <h3 className="font-bold">Detalles de Schemas</h3>
          {Object.entries(pageData.schema.schemaDetails).map(([schemaType, details], index) => (
            <div key={index} className="mb-4">
              <h4 className="font-semibold">{schemaType}</h4>
              <pre className="bg-gray-100 p-2 rounded">
                {JSON.stringify(details, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderSEOScoreTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Puntuación SEO Global</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div 
            className={`text-6xl font-bold ${
              pageData.seoScore >= 80 ? 'text-green-500' : 
              pageData.seoScore >= 60 ? 'text-yellow-500' : 
              'text-red-500'
            }`}
          >
            {pageData.seoScore}
          </div>
          <div className="mt-4 text-center">
            {pageData.seoScore >= 80 ? 
              'Excelente optimización SEO' : 
              pageData.seoScore >= 60 ? 
              'Optimización SEO aceptable' : 
              'Necesita mejoras significativas'}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-[600px] p-4">
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="headings">Estructura</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="hreflang">Hreflang</TabsTrigger>
          <TabsTrigger value="images">Imágenes</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="score">Puntuación SEO</TabsTrigger>
        </TabsList>
        <TabsContent value="general">{renderGeneralTab()}</TabsContent>
        <TabsContent value="headings">{renderHeadingsTab()}</TabsContent>
        <TabsContent value="links">{renderLinksTab()}</TabsContent>
        <TabsContent value="hreflang">{renderHreflangTab()}</TabsContent>
        <TabsContent value="images">{renderImagesTab()}</TabsContent>
        <TabsContent value="schema">{renderSchemaTab()}</TabsContent>
        <TabsContent value="score">{renderSEOScoreTab()}</TabsContent>
      </Tabs>
    </div>
  );
};

export default SEOExtension;