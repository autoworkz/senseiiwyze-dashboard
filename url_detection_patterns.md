# URL Detection Patterns

## Overview
This document defines formal regex patterns to detect URLs in user queries, ensuring comprehensive coverage of common URL formats that users might reference in their messages.

## Core URL Detection Patterns

### 1. HTTP/HTTPS URLs
**Pattern**: `https?://\S+`
**Description**: Matches complete URLs with HTTP or HTTPS protocol
**Examples**:
- `https://example.com`
- `http://subdomain.example.com/path?query=value`
- `https://api.service.com/v1/endpoint`

### 2. WWW URLs (without protocol)
**Pattern**: `www\.\S+`
**Description**: Matches URLs starting with www but missing protocol
**Examples**:
- `www.example.com`
- `www.google.com/search?q=test`
- `www.sub-domain.example.org/path`

### 3. Domain Names with Common TLDs
**Pattern**: `\S+\.(?:com|org|net|edu|gov|mil|co|io|ai|ly|me|tv|info|biz)\S*`
**Description**: Matches domain names with popular TLDs
**Examples**:
- `example.com`
- `github.io/user/repo`
- `company.co.uk/about`
- `service.ai/api`

### 4. Extended TLD Pattern
**Pattern**: `\S+\.(?:com|org|net|edu|gov|mil|int|co|io|ai|ly|me|tv|cc|info|biz|name|pro|aero|museum|coop|jobs|mobi|travel|tel|asia|cat|post|geo|arpa|test)\S*`
**Description**: Comprehensive list including specialized and country-code TLDs
**Examples**:
- `example.museum`
- `company.travel`
- `service.coop`

### 5. IP Address URLs
**Pattern**: `https?://(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?::[0-9]+)?\S*`
**Description**: Matches URLs with IPv4 addresses
**Examples**:
- `http://192.168.1.1`
- `https://10.0.0.1:8080/admin`
- `http://127.0.0.1:3000/api`

### 6. Localhost URLs
**Pattern**: `https?://(?:localhost|127\.0\.0\.1)(?::[0-9]+)?\S*`
**Description**: Matches local development URLs
**Examples**:
- `http://localhost:3000`
- `https://localhost:8080/app`
- `http://127.0.0.1:5000`

### 7. FTP URLs
**Pattern**: `ftp://\S+`
**Description**: Matches FTP protocol URLs
**Examples**:
- `ftp://files.example.com`
- `ftp://user:pass@server.com/path`

### 8. File URLs
**Pattern**: `file://\S+`
**Description**: Matches file protocol URLs
**Examples**:
- `file:///home/user/document.pdf`
- `file://C:/Users/user/file.txt`

### 9. Custom Protocol URLs
**Pattern**: `[a-zA-Z][a-zA-Z0-9+.-]*://\S+`
**Description**: Matches URLs with custom or specialized protocols
**Examples**:
- `slack://channel?team=T123&id=C456`
- `vscode://file/path/to/file`
- `zoom://meeting?id=123456789`

### 10. Email-like URLs
**Pattern**: `mailto:\S+@\S+\.\S+`
**Description**: Matches mailto protocol URLs
**Examples**:
- `mailto:user@example.com`
- `mailto:support@company.org?subject=Help`

### 11. Shortened URLs
**Pattern**: `(?:bit\.ly|tinyurl\.com|t\.co|short\.link|is\.gd|v\.gd)/\S+`
**Description**: Matches common URL shortening services
**Examples**:
- `bit.ly/abc123`
- `t.co/xyz789`
- `tinyurl.com/example`

## Comprehensive Combined Patterns

### Basic Combined Pattern
```regex
(?:https?://\S+|ftp://\S+|www\.\S+|\S+\.(?:com|org|net|edu|gov|mil|co|io|ai|ly|me|tv|info|biz)\S*)
```

### Extended Combined Pattern
```regex
(?:https?://\S+|ftp://\S+|file://\S+|www\.\S+|\S+\.(?:com|org|net|edu|gov|mil|int|co|io|ai|ly|me|tv|cc|info|biz|name|pro|aero|museum|coop|jobs|mobi|travel|tel|asia|cat|post|geo|arpa|test)\S*|[a-zA-Z][a-zA-Z0-9+.-]*://\S+)
```

### Ultra-Comprehensive Pattern
```regex
(?:(?:https?|ftp|file|mailto)://\S+|www\.\S+|\S+\.(?:com|org|net|edu|gov|mil|int|co|io|ai|ly|me|tv|cc|info|biz|name|pro|aero|museum|coop|jobs|mobi|travel|tel|asia|cat|post|geo|arpa|test|uk|ca|au|de|fr|jp|cn|ru|br|in|mx|es|it|nl|se|no|dk|fi|pl|be|ch|at|pt|cz|hu|gr|ro|bg|hr|sk|si|ee|lv|lt|mt|cy|lu|is|li|ad|mc|sm|va)\S*|(?:bit\.ly|tinyurl\.com|t\.co|short\.link|is\.gd|v\.gd)/\S+|[a-zA-Z][a-zA-Z0-9+.-]*://\S+)
```

## Implementation Guidelines

### Pattern Selection Strategy
1. **Quick Detection**: Use basic combined pattern for general URL detection
2. **Comprehensive Coverage**: Use extended combined pattern for thorough scanning  
3. **Maximum Coverage**: Use ultra-comprehensive pattern when completeness is critical
4. **Specific Protocols**: Use individual patterns when targeting specific URL types

### Usage Recommendations

#### Case Sensitivity
- Use case-insensitive matching (`/i` flag) for broader detection
- Domain names and protocols are typically case-insensitive

#### Word Boundaries
- Consider adding word boundaries `\b` to avoid partial matches within words
- Example: `\b(?:https?://\S+|www\.\S+)\b`

#### Context-Aware Filtering
- Exclude URLs within code blocks (marked by backticks or code fence)
- Filter out placeholder URLs like `example.com` when appropriate
- Skip URLs in technical documentation when not relevant

### Common Edge Cases

#### URLs with Special Characters
- **Authentication**: `https://user:pass@example.com`
- **Fragments**: `https://example.com/page#section`
- **Query Parameters**: `https://site.com/search?q=test&type=web`
- **Encoded Characters**: `https://site.com/search?q=hello%20world`

#### International Domains
- **Internationalized Domain Names**: `https://例え.テスト/path`
- **Punycode**: `https://xn--r8jz45g.xn--zckzah/path`

#### Port Numbers
- **Standard Ports**: `https://example.com:443/secure`
- **Custom Ports**: `http://api.local:8080/v1`

## Validation Considerations

### False Positives to Handle
- File extensions that look like domains: `document.pdf`
- Version numbers: `v2.1.com` (likely not a URL)
- Decimal numbers: `price.99.com` (context-dependent)

### Security Patterns to Watch
- Suspicious domains with unusual TLDs
- URLs with excessive subdomain levels
- Encoded payloads in query parameters
- Shortened URLs from unknown services

### Performance Optimization
- Use non-capturing groups `(?:...)` when grouping is needed but capture isn't
- Compile regex patterns once and reuse
- Consider using multiple simpler patterns instead of one complex pattern
- Implement early termination for long text processing

## Testing Examples

### Valid URLs That Should Match
```
https://www.example.com/path?param=value&other=123
http://subdomain.domain.co.uk/api/v1/endpoint
www.github.com/user/repository/issues/123
example.com/blog/2024/01/post-title
bit.ly/shortened-link
mailto:contact@support.org
ftp://files.server.edu/public/data.zip
localhost:3000/dashboard
192.168.1.1:8080/admin
file:///Users/name/Documents/file.pdf
```

### Edge Cases to Consider
```
https://user:password@secure.example.com:8443/path?query=value#anchor
http://sub.domain.example.co.uk/path-with-dashes/file_name.html
www.domain-with-hyphens.org/underscore_paths/
example.com/path/with/trailing/slash/
api.service.io/v2/endpoint.json?format=pretty&limit=100
```

### Invalid Strings That Should Not Match
```
This is just text with periods. Nothing special here.
Version 2.1.0 of the software was released.
The price is $99.99 for the basic plan.
File saved as document.txt in the folder.
Error code 404.500 encountered during processing.
```
