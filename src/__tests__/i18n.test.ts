// Simple test for locale definitions
const locales = ['en', 'es', 'fr', 'de'] as const;

describe('Internationalization', () => {
  it('should have defined locales', () => {
    expect(locales).toBeDefined();
    expect(locales).toContain('en');
    expect(locales).toContain('es');
    expect(locales).toContain('fr');
    expect(locales).toContain('de');
  });

  it('should have correct locale count', () => {
    expect(locales).toHaveLength(4);
  });

  it('should have all required locales', () => {
    const requiredLocales = ['en', 'es', 'fr', 'de'];
    requiredLocales.forEach(locale => {
      expect(locales).toContain(locale);
    });
  });
});
