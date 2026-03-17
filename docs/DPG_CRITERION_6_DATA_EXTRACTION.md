# 📤 DPG Criterion 6: Mechanism for Extracting Data and Content

## Overview

**DPG Requirement**: Provide a detailed description of how NON-PII data can be imported or exported into non-proprietary formats such as CSV, XML, JSON, etc., or by exposing the NON-PII data through an API.

## Data Export and Import Capabilities

DPG Pipeline provides comprehensive mechanisms for extracting and importing non-PII data through multiple channels and formats, ensuring data portability and preventing vendor lock-in.

### Non-PII Data Categories

#### Exportable Data Types
| Data Category | Description | Export Formats | API Access |
|---------------|-------------|----------------|------------|
| **Projects** | Project metadata, descriptions, goals | JSON, CSV, XML | ✅ |
| **Categories** | Project categories and classifications | JSON, CSV | ✅ |
| **Contributions** | Non-financial contribution data | JSON, CSV | ✅ |
| **Updates** | Project updates and announcements | JSON, CSV, XML | ✅ |
| **Comments** | Public comments and discussions | JSON, CSV | ✅ |
| **Statistics** | Aggregated platform statistics | JSON, CSV | ✅ |
| **Resources** | Educational and documentation content | JSON, XML | ✅ |

#### Excluded Data (PII Protected)
- User email addresses
- Personal contact information
- Private messages
- Financial transaction details
- Authentication credentials
- Personal profile information

## REST API Data Access

### Public API Endpoints

#### Projects API
```javascript
// Get all public projects
GET /api/projects
Response: JSON array of project objects

// Get single project
GET /api/projects/{id}
Response: JSON project object

// Get projects by category
GET /api/projects?category={category_name}
Response: Filtered JSON array

// Export all projects (public)
GET /api/projects/export?format=json|csv|xml&page=1&limit=100&search=term
Response: Paginated export with metadata

// Export single project (authenticated)
GET /api/projects/{id}/export?format=json|csv|xml
Response: Full project data export
```

#### Categories API
```javascript
// Get all categories
GET /api/categories
Response: JSON array of categories

// Get category statistics
GET /api/categories/{id}/stats
Response: JSON object with category metrics

// Export all categories (public)
GET /api/categories/export?format=json|csv|xml&page=1&limit=100
Response: Paginated export with metadata
```

#### Contributions API
```javascript
// Export contributions (public)
GET /api/contributions/export?format=json|csv|xml&page=1&limit=100&project_id={id}
Response: Paginated export with metadata
```

#### Updates API
```javascript
// Export project updates (public)
GET /api/updates/export?format=json|csv|xml&page=1&limit=100&project_id={id}
Response: Paginated export with metadata
```

#### Public Statistics API
```javascript
// Platform-wide statistics
GET /api/stats/platform
Response: {
  "total_projects": 150,
  "total_contributors": 500,
  "total_contributions": 1250,
  "active_projects": 75
}

// Project statistics
GET /api/stats/projects/{id}
Response: {
  "contributors_count": 25,
  "updates_count": 12,
  "views_count": 1500
}
```

### API Usage Examples

#### Bulk Project Export
```javascript
// Export all projects to JSON
async function exportProjects() {
  const response = await fetch('/api/projects?limit=1000')
  const projects = await response.json()
  
  // Convert to CSV if needed
  const csv = convertToCSV(projects)
  downloadFile(csv, 'projects.csv')
}

// Export with pagination
async function exportAllProjects() {
  let page = 1
  let allProjects = []
  
  while (true) {
    const response = await fetch(`/api/projects?page=${page}&limit=100`)
    const projects = await response.json()
    
    if (projects.length === 0) break
    
    allProjects = [...allProjects, ...projects]
    page++
  }
  
  return allProjects
}
```

#### Category Data Export
```javascript
// Export categories with project counts
async function exportCategories() {
  const response = await fetch('/api/categories')
  const categories = await response.json()
  
  const categoriesWithStats = await Promise.all(
    categories.map(async (category) => {
      const statsResponse = await fetch(`/api/categories/${category.id}/stats`)
      const stats = await statsResponse.json()
      return { ...category, ...stats }
    })
  )
  
  return categoriesWithStats
}
```

## Direct Database Export

### SQL Export Queries
For organizations requiring direct database access, we provide SQL queries for data extraction:

#### Projects Export Query
```sql
-- Export public project data
SELECT 
  p.id,
  p.title,
  p.description,
  p.category,
  p.status,
  p.created_at,
  p.updated_at,
  c.name as category_name,
  COUNT(contrib.id) as contribution_count,
  COUNT(DISTINCT contrib.user_id) as contributor_count
FROM projects p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN contributions contrib ON p.id = contrib.project_id
WHERE p.is_public = true
GROUP BY p.id, c.name
ORDER BY p.created_at DESC;
```

#### Contributions Export Query
```sql
-- Export non-financial contribution data
SELECT 
  c.id,
  c.project_id,
  c.type,
  c.description,
  c.status,
  c.created_at,
  p.title as project_title
FROM contributions c
JOIN projects p ON c.project_id = p.id
WHERE c.type != 'financial'
  AND p.is_public = true
ORDER BY c.created_at DESC;
```

#### Project Updates Export Query
```sql
-- Export public project updates
SELECT 
  u.id,
  u.project_id,
  u.title,
  u.content,
  u.created_at,
  p.title as project_title,
  COUNT(uc.id) as comment_count
FROM project_updates u
JOIN projects p ON u.project_id = p.id
LEFT JOIN update_comments uc ON u.id = uc.update_id
WHERE p.is_public = true
GROUP BY u.id, p.title
ORDER BY u.created_at DESC;
```

## File Format Support

### JSON Export Format
```json
{
  "export_metadata": {
    "timestamp": "2025-01-15T10:30:00Z",
    "format": "json",
    "version": "1.0",
    "total_records": 150
  },
  "projects": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Educational Resource Platform",
      "description": "Open source platform for educational content",
      "category": "education",
      "status": "active",
      "created_at": "2024-06-15T14:30:00Z",
      "updated_at": "2025-01-10T09:15:00Z",
      "contributor_count": 12,
      "update_count": 8,
      "tags": ["education", "open-source", "accessibility"]
    }
  ]
}
```

### CSV Export Format
```csv
id,title,description,category,status,created_at,updated_at,contributor_count
550e8400-e29b-41d4-a716-446655440000,"Educational Resource Platform","Open source platform for educational content",education,active,2024-06-15T14:30:00Z,2025-01-10T09:15:00Z,12
```

### XML Export Format
```xml
<?xml version="1.0" encoding="UTF-8"?>
<projects_export timestamp="2025-01-15T10:30:00Z" format="xml" version="1.0">
  <project>
    <id>550e8400-e29b-41d4-a716-446655440000</id>
    <title>Educational Resource Platform</title>
    <description>Open source platform for educational content</description>
    <category>education</category>
    <status>active</status>
    <created_at>2024-06-15T14:30:00Z</created_at>
    <updated_at>2025-01-10T09:15:00Z</updated_at>
    <contributor_count>12</contributor_count>
  </project>
</projects_export>
```

## User Interface Data Export

### Dashboard Export Features

#### Individual Project Export
Users can export individual project data through the project dashboard:

```svelte
<!-- Export component example -->
<script>
  import { Button } from '$lib/components/ui/button'
  
  async function exportProject(projectId, format) {
    const response = await fetch(`/api/projects/${projectId}/export?format=${format}`)
    const blob = await response.blob()
    
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `project_${projectId}.${format}`
    a.click()
  }
</script>

<div class="export-options">
  <Button on:click={() => exportProject(project.id, 'json')}>
    Export as JSON
  </Button>
  <Button on:click={() => exportProject(project.id, 'csv')}>
    Export as CSV
  </Button>
  <Button on:click={() => exportProject(project.id, 'xml')}>
    Export as XML
  </Button>
</div>
```

#### Bulk Export Interface
```svelte
<!-- Bulk export component -->
<script>
  let selectedCategories = []
  let exportFormat = 'json'
  let dateRange = { start: null, end: null }
  
  async function performBulkExport() {
    const params = new URLSearchParams({
      categories: selectedCategories.join(','),
      format: exportFormat,
      start_date: dateRange.start,
      end_date: dateRange.end
    })
    
    const response = await fetch(`/api/export/bulk?${params}`)
    const blob = await response.blob()
    
    downloadFile(blob, `bulk_export.${exportFormat}`)
  }
</script>

<form on:submit|preventDefault={performBulkExport}>
  <CategorySelector bind:selected={selectedCategories} />
  <FormatSelector bind:value={exportFormat} />
  <DateRangePicker bind:range={dateRange} />
  <Button type="submit">Export Data</Button>
</form>
```

## Data Import Capabilities

### Import API Endpoints

#### Project Import
```javascript
// Import projects from JSON
POST /api/import/projects
Content-Type: application/json

{
  "projects": [
    {
      "title": "Imported Project",
      "description": "Project imported from external source",
      "category": "health",
      "tags": ["imported", "health", "open-source"]
    }
  ]
}
```

#### Bulk Data Import
```javascript
// Import from CSV
POST /api/import/csv
Content-Type: multipart/form-data

FormData with CSV file and mapping configuration
```

### Import Data Validation
```javascript
// Data validation schema for imports
const projectImportSchema = {
  title: { required: true, type: 'string', maxLength: 255 },
  description: { required: true, type: 'string' },
  category: { required: true, type: 'string', enum: validCategories },
  tags: { type: 'array', items: { type: 'string' } },
  external_url: { type: 'string', format: 'url' }
}

function validateImportData(data) {
  const errors = []
  
  data.forEach((item, index) => {
    const validation = validate(item, projectImportSchema)
    if (!validation.valid) {
      errors.push({
        row: index + 1,
        errors: validation.errors
      })
    }
  })
  
  return errors
}
```

## Automated Data Synchronization

### Webhook-based Export
```javascript
// Webhook for real-time data synchronization
POST /api/webhooks/data-sync
Content-Type: application/json

{
  "webhook_url": "https://external-system.com/webhook",
  "events": ["project.created", "project.updated", "contribution.added"],
  "format": "json",
  "authentication": {
    "type": "bearer",
    "token": "your-webhook-token"
  }
}
```

### Scheduled Exports
```javascript
// Configure scheduled data exports
POST /api/exports/schedule
{
  "frequency": "daily",
  "format": "json",
  "data_types": ["projects", "contributions", "updates"],
  "delivery_method": "webhook",
  "webhook_url": "https://your-system.com/data-import"
}
```

## Data Migration Support

### Platform Migration Tools

#### From Other DPG Platforms
```javascript
// Migration utility for common DPG platforms
class DPGMigrationTool {
  async migrateFromPlatform(sourcePlatform, sourceData) {
    const mapper = this.getMapper(sourcePlatform)
    const mappedData = mapper.transform(sourceData)
    
    return await this.importData(mappedData)
  }
  
  getMapper(platform) {
    const mappers = {
      'github': new GitHubMapper(),
      'gitlab': new GitLabMapper(),
      'generic': new GenericMapper()
    }
    
    return mappers[platform] || mappers['generic']
  }
}
```

#### Migration Data Formats
```json
{
  "migration_metadata": {
    "source_platform": "GitHub",
    "migration_date": "2025-01-15T10:30:00Z",
    "total_projects": 50
  },
  "projects": [
    {
      "external_id": "github:user/repo",
      "title": "Migrated Project",
      "description": "Project migrated from GitHub",
      "original_url": "https://github.com/user/repo",
      "migration_notes": "Migrated from GitHub repository"
    }
  ]
}
```

## API Rate Limiting and Bulk Access

### Rate Limiting for Exports
```javascript
// Rate limiting configuration
const exportRateLimits = {
  anonymous: {
    requests_per_hour: 100,
    max_records_per_request: 100
  },
  authenticated: {
    requests_per_hour: 1000,
    max_records_per_request: 1000
  },
  bulk_access: {
    requests_per_hour: 10000,
    max_records_per_request: 10000
  }
}
```

### Bulk Access Authentication
```javascript
// Request bulk access credentials
POST /api/bulk-access/request
{
  "organization": "Research University",
  "purpose": "Academic research on DPG trends",
  "contact_email": "researcher@university.edu",
  "expected_usage": "Monthly exports of project data"
}
```

## Data Privacy and Security

### Privacy Safeguards
1. **PII Filtering**: Automatic removal of personally identifiable information
2. **Access Control**: Authentication required for detailed exports
3. **Audit Logging**: All export activities are logged
4. **Rate Limiting**: Prevents abuse of export functionality

### Security Measures
```javascript
// Export security middleware
function secureExport(req, res, next) {
  // Check authentication
  if (!req.user && req.query.detailed === 'true') {
    return res.status(401).json({ error: 'Authentication required' })
  }
  
  // Apply rate limiting
  if (exceedsRateLimit(req.user, req.ip)) {
    return res.status(429).json({ error: 'Rate limit exceeded' })
  }
  
  // Filter sensitive data
  req.exportFilters = {
    excludeFields: ['email', 'phone', 'address'],
    anonymizeFields: ['ip_address']
  }
  
  next()
}
```

## Documentation and Examples

### Export API Documentation
Complete API documentation with examples available at:
- **API Reference**: `/api/docs` (Swagger/OpenAPI)
- **GitHub Documentation**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Interactive Examples**: Platform API explorer

### Code Examples Repository
```bash
# Clone examples repository
git clone https://github.com/christex-foundation/pipeline-export-examples

# Available examples:
examples/
├── javascript/
│   ├── bulk-export.js
│   ├── real-time-sync.js
│   └── data-migration.js
├── python/
│   ├── data_export.py
│   ├── csv_import.py
│   └── analytics.py
└── curl/
    ├── api-examples.sh
    └── bulk-operations.sh
```

## Quality Assurance and Testing

### Export Data Validation
```javascript
// Automated testing of export functionality
describe('Data Export API', () => {
  test('exports project data in JSON format', async () => {
    const response = await request(app)
      .get('/api/projects/export?format=json')
      .expect(200)
    
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body).toHaveProperty('projects')
    expect(Array.isArray(response.body.projects)).toBe(true)
  })
  
  test('filters PII data from exports', async () => {
    const response = await request(app)
      .get('/api/projects/export?format=json')
    
    response.body.projects.forEach(project => {
      expect(project).not.toHaveProperty('owner_email')
      expect(project).not.toHaveProperty('contact_info')
    })
  })
})
```

### Data Integrity Checks
```javascript
// Verify export data integrity
function validateExportData(exported, original) {
  const checks = {
    recordCount: exported.length === original.length,
    dataConsistency: exported.every((item, index) => 
      item.id === original[index].id
    ),
    noPII: exported.every(item => 
      !containsPII(item)
    )
  }
  
  return checks
}
```

## Conclusion

DPG Pipeline provides comprehensive data extraction capabilities that enable:

1. **Multi-format Export**: Support for JSON, CSV, XML, and custom formats
2. **API Access**: RESTful API for programmatic data access
3. **Bulk Operations**: Efficient handling of large datasets
4. **Data Import**: Capabilities for importing data from external sources
5. **Privacy Protection**: Automatic filtering of PII data
6. **Migration Support**: Tools for migrating from other platforms
7. **Real-time Sync**: Webhook-based real-time data synchronization

All data extraction mechanisms are designed to promote data portability, prevent vendor lock-in, and support the open data principles central to Digital Public Goods.

---

*This document serves as evidence for DPG Criterion 6 compliance and provides comprehensive guidance for data extraction and migration.*