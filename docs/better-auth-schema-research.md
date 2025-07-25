# Better Auth Schema Research: Separate Schemas & Multi-Tenancy Challenges

**Research Date:** $(date)  
**Sources:** EXA Web Search, Context7 Documentation, DeepWiki Analysis, Tavily Research

## Executive Summary

Better Auth provides limited native support for PostgreSQL schema separation, requiring custom configurations and potential workarounds for multi-tenant architectures. The framework primarily operates within the `public` schema by default, but offers customization options for table and column naming.

---

## 1. Better Auth Schema Configuration

### 1.1 Default Schema Behavior
- **Default Schema:** Better Auth creates tables in the `public` schema by default
- **CLI Generation:** Uses `npx @better-auth/cli@latest generate` for schema creation
- **Migration Support:** Built-in Kysely adapter supports direct migrations to `public` schema

### 1.2 Schema Customization Options

#### Table and Column Name Customization
```typescript
export const auth = betterAuth({
  user: {
    modelName: "users", // Custom table name
    fields: {
      name: "full_name", // Custom column name
      email: "email_address",
    },
  },
  session: {
    modelName: "user_sessions",
    fields: {
      userId: "user_id",
    },
  },
});
```

#### Plugin Schema Customization
```typescript
import { twoFactor } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    twoFactor({
      schema: {
        user: {
          fields: {
            twoFactorEnabled: "two_factor_enabled",
            secret: "two_factor_secret",
          },
        },
      },
    }),
  ],
});
```

#### Schema Extension
```typescript
export const auth = betterAuth({
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
      lang: {
        type: "string",
        required: false,
        defaultValue: "en",
      },
    },
  },
});
```

---

## 2. Challenges with Separate Schemas

### 2.1 🔴 Critical Limitations

#### No Native Schema Support
- **Issue:** Better Auth doesn't provide direct configuration for PostgreSQL schema names
- **Impact:** Tables are created in `public` schema regardless of configuration
- **Workaround:** Requires custom adapter or ORM-level configuration

#### CLI Migration Limitations
- **Issue:** `npx @better-auth/cli migrate` only works with built-in Kysely adapter
- **Impact:** Cannot directly migrate to non-public schemas
- **Workaround:** Use ORM adapters (Drizzle, Prisma) for schema control

#### Schema Resolution Problems
- **Issue:** Better Auth's internal operations default to `public` schema
- **Impact:** May fail to find tables in custom schemas
- **Workaround:** Configure database connection with custom `search_path`

### 2.2 🟠 High-Risk Challenges

#### Connection Pool Issues
- **Problem:** Multiple schemas can cause connection pool conflicts
- **Impact:** Schema bleeding and wrong-table reads under load
- **Solution:** Use dedicated connection pools per schema

#### Migration Complexity
- **Problem:** Schema updates require changes across all tenant schemas
- **Impact:** Operational overhead and potential inconsistencies
- **Solution:** Automated migration scripts and version control

#### ORM Integration Challenges
- **Problem:** Not all ORMs handle multiple schemas cleanly
- **Impact:** Limited tooling support for schema-per-tenant
- **Solution:** Custom adapter development or ORM-specific configurations

### 2.3 🟡 Medium-Risk Challenges

#### Performance Considerations
- **Problem:** All tenants share database resources despite schema isolation
- **Impact:** Potential performance bottlenecks
- **Solution:** Resource monitoring and tenant-specific optimizations

#### Cross-Schema References
- **Problem:** Complex relationships between schemas
- **Impact:** Data integrity and query complexity
- **Solution:** Careful schema design and foreign key management

#### Backup and Recovery
- **Problem:** Tenant-specific backups become complex
- **Impact:** Recovery procedures and data isolation
- **Solution:** Automated backup strategies per schema

---

## 3. Multi-Tenancy Strategies

### 3.1 Schema-per-Tenant Approach

#### Advantages
- ✅ Strong logical boundaries between tenants
- ✅ Database-level security isolation
- ✅ Flexible tenant-specific customizations
- ✅ Cross-schema references possible

#### Disadvantages
- ❌ Operational complexity (migrations across all schemas)
- ❌ Connection pool management overhead
- ❌ Limited ORM support
- ❌ Performance impact with many schemas

#### Implementation Challenges
```typescript
// Challenge: Better Auth doesn't support schema specification
export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    // No native schema configuration
  }),
});
```

### 3.2 Row-Level Security (RLS) Approach

#### Advantages
- ✅ Single schema, simpler operations
- ✅ Better Auth compatibility
- ✅ Easier migrations and maintenance
- ✅ Built-in PostgreSQL security

#### Disadvantages
- ❌ Application-level tenant context required
- ❌ Potential for data leakage if RLS misconfigured
- ❌ Complex policy management

#### Better Auth Integration
```typescript
// Better supported by Better Auth
export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  // RLS policies handled at database level
});
```

### 3.3 Database-per-Tenant Approach

#### Advantages
- ✅ Maximum isolation and security
- ✅ Tenant-specific performance tuning
- ✅ Compliance-friendly for regulated industries

#### Disadvantages
- ❌ Highest operational overhead
- ❌ Complex routing and connection management
- ❌ Resource utilization inefficiency

---

## 4. Best Practices & Solutions

### 4.1 Custom Adapter Development

#### Schema-Aware Adapter
```typescript
import { createAdapter } from "better-auth/adapters";

export const schemaAwareAdapter = (schemaName: string) =>
  createAdapter({
    config: {
      adapterId: "schema-aware-adapter",
      adapterName: "Schema Aware Adapter",
    },
    adapter: ({ options, schema, getField }) => {
      return {
        // Custom implementation with schema prefixing
        create: async ({ model, data }) => {
          const tableName = `${schemaName}.${getField(model, "modelName")}`;
          // Implementation with schema-aware queries
        },
        // ... other adapter methods
      };
    },
  });
```

### 4.2 ORM-Level Schema Configuration

#### Drizzle Adapter with Schema
```typescript
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      // Map Better Auth tables to custom schema
      user: schema.users, // Assuming schema.users is in custom schema
      session: schema.sessions,
    },
  }),
});
```

#### Prisma with Schema Configuration
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["auth", "public"]
}

model User {
  id    String @id @default(cuid())
  email String @unique
  // ... other fields
  
  @@schema("auth")
}
```

### 4.3 Database Connection Configuration

#### Schema-Specific Connections
```typescript
// For schema-per-tenant approach
const createTenantConnection = (tenantId: string) => {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    // Set search_path for tenant schema
    options: `-c search_path=${tenantId},public`,
  });
};

export const auth = betterAuth({
  database: createTenantConnection(currentTenant),
});
```

### 4.4 Migration Strategies

#### Automated Multi-Schema Migrations
```typescript
// Migration script for schema-per-tenant
const migrateAllSchemas = async (tenantIds: string[]) => {
  for (const tenantId of tenantIds) {
    const connection = createTenantConnection(tenantId);
    
    // Run Better Auth migrations for each schema
    await runMigrations(connection, tenantId);
  }
};
```

---

## 5. Recommended Approaches

### 5.1 For New Projects: RLS + Single Schema
```typescript
// Recommended: Use RLS for multi-tenancy
export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  // Add tenant context through middleware
});

// Database-level RLS policies
CREATE POLICY tenant_isolation ON users
  FOR ALL USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

### 5.2 For Existing Multi-Schema Projects: Custom Adapter
```typescript
// Custom adapter for existing schema-per-tenant setup
export const auth = betterAuth({
  database: schemaAwareAdapter(currentTenantSchema),
  // ... rest of configuration
});
```

### 5.3 For Enterprise Requirements: Database-per-Tenant
```typescript
// Route to tenant-specific database
const getTenantDatabase = (tenantId: string) => {
  return new Pool({
    connectionString: getTenantConnectionString(tenantId),
  });
};

export const auth = betterAuth({
  database: getTenantDatabase(currentTenant),
});
```

---

## 6. Implementation Checklist

### 6.1 Pre-Implementation
- [ ] Assess tenant isolation requirements
- [ ] Evaluate compliance and security needs
- [ ] Plan migration strategy
- [ ] Choose multi-tenancy approach

### 6.2 Development
- [ ] Configure Better Auth with chosen approach
- [ ] Implement tenant context management
- [ ] Set up database-level security (RLS or schemas)
- [ ] Create migration automation

### 6.3 Testing
- [ ] Test tenant isolation
- [ ] Verify cross-tenant data protection
- [ ] Performance testing under load
- [ ] Migration rollback testing

### 6.4 Production
- [ ] Monitor schema performance
- [ ] Implement tenant-specific backups
- [ ] Set up alerting for schema issues
- [ ] Document operational procedures

---

## 7. Conclusion

Better Auth provides limited native support for PostgreSQL schema separation, making schema-per-tenant approaches challenging to implement directly. The recommended approach depends on your specific requirements:

- **RLS + Single Schema:** Best for most applications, fully compatible with Better Auth
- **Custom Adapter:** Required for existing schema-per-tenant setups
- **Database-per-Tenant:** Best for enterprise compliance requirements

The key is understanding that Better Auth's strength lies in its authentication features rather than database schema management, requiring custom solutions for advanced multi-tenant scenarios.

---

## References

1. [Better Auth Database Documentation](https://www.better-auth.com/docs/concepts/database)
2. [PostgreSQL Multi-Tenant Strategies](https://aws.amazon.com/blogs/database/multi-tenant-data-isolation-with-postgresql-row-level-security/)
3. [Multi-Tenant SaaS Architecture](https://clerk.com/blog/how-to-design-multitenant-saas-architecture)
4. [PostgreSQL Schema Design Best Practices](https://www.crunchydata.com/blog/designing-your-postgres-database-for-multi-tenancy) 