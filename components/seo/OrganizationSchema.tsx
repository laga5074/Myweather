import React from 'react';
import JsonLd from './JsonLd';

export default function OrganizationSchema() {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'My Weather',
    url: 'https://myweather.ai.studio',
    logo: 'https://myweather.ai.studio/logo.png',
    sameAs: ['https://twitter.com/myweather', 'https://github.com/myweather'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: 'https://myweather.ai.studio/contact',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'My Weather',
    url: 'https://myweather.ai.studio',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://myweather.ai.studio/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <JsonLd data={orgSchema} />
      <JsonLd data={websiteSchema} />
    </>
  );
}
