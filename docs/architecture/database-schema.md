# MyNook Database Schema

## Overview
MyNook uses Firebase Firestore as the primary database, providing real-time synchronization, offline support, and scalable NoSQL document storage.

## Database Architecture

### Firestore Structure
```
/users/{userId}
/workspaces/{workspaceId}
/cards/{cardId}
/user-settings/{userId}
```

## Collections & Documents

### Users Collection
**Path**: `/users/{userId}`

```typescript
interface User {
	id: string;                    // Firebase Auth UID
	email: string;                 // User email from Firebase Auth
	displayName: string;           // User's display name
	photoURL?: string;             // Profile picture URL
	createdAt: Timestamp;          // Account creation timestamp
	lastLoginAt: Timestamp;        // Last login timestamp
	preferences: UserPreferences;   // User-specific settings
	subscription: SubscriptionInfo; // Future: subscription details
}

interface UserPreferences {
	theme: 'light' | 'dark' | 'auto';
	gridSnap: boolean;
	autoSave: boolean;
	defaultWorkspace?: number;      // Default workspace ID
}

interface SubscriptionInfo {
	plan: 'free' | 'premium';
	expiresAt?: Timestamp;
	features: string[];
}
```

**Constraints**:
- Document ID matches Firebase Auth UID
- Email must be unique (enforced by Firebase Auth)
- CreatedAt is immutable after creation

**Indexes**:
- `email` (automatic)
- `lastLoginAt` for analytics
- `subscription.plan` for feature filtering

### Workspaces Collection
**Path**: `/workspaces/{workspaceId}`

```typescript
interface Workspace {
	id: number;                    // Auto-generated document ID
	name: string;                  // Workspace display name (max 100 chars)
	description?: string;          // Optional description
	ownerId: string;               // User ID who owns this workspace
	createdAt: Timestamp;          // Creation timestamp
	lastModified: Timestamp;       // Last modification timestamp
	settings: WorkspaceSettings;   // Workspace-specific configuration
	cardCount: number;             // Current number of cards (max 20)
	isActive: boolean;             // Soft delete flag
	tags: string[];                // Optional tags for organization
}

interface WorkspaceSettings {
	gridSize: GridSize;            // Workspace dimensions
	backgroundColor: string;       // Hex color code
	backgroundImage?: string;      // Optional background image URL
	isPublic: boolean;             // Future: public workspace sharing
	allowComments: boolean;        // Future: collaboration features
}

interface GridSize {
	width: number;                 // Grid width in units
	height: number;                // Grid height in units
	unit: number;                  // Grid unit size (default 32px)
}
```

**Constraints**:
- `name` length: 1-100 characters
- `cardCount` max: 20 cards per workspace
- `ownerId` must reference valid user
- Max 10 workspaces per user (enforced by security rules)

**Indexes**:
- `ownerId` (for user's workspaces query)
- `lastModified` (for recent workspaces)
- `isActive` (for filtering deleted workspaces)

### Cards Collection
**Path**: `/cards/{cardId}`

```typescript
interface Card {
	id: number;                    // Auto-generated document ID (guid?)
	workspaceId: number;           // Parent workspace ID
	ownerId: string;               // User ID who owns this card
	type: CardType;                // Card type enum
	title: string;                 // Card title (max 200 chars)
	content: CardContent;          // Type-specific content
	position: Position;            // Grid position and size
	style: CardStyle;              // Visual styling options
	createdAt: Timestamp;          // Creation timestamp
	lastModified: Timestamp;       // Last modification timestamp
	version: number;               // Optimistic locking version
	isLocked: boolean;             // Prevent editing
}

type CardType = 'text_note' | 'image_card' | 'link_card' | 'iframe_card';

interface Position {
	x: number;                     // Grid X coordinate (0-based)
	y: number;                     // Grid Y coordinate (0-based)
	width: number;                 // Width in grid units (2-8)
	height: number;                // Height in grid units (2-8)
}

interface CardStyle {
	backgroundColor: string;       // Hex color code
	textColor: string;             // Hex color code
	borderColor?: string;          // Optional border color
	borderWidth: number;           // Border width in pixels
	borderRadius: number;          // Corner radius in pixels
	opacity: number;               // 0.0 to 1.0
	shadow: boolean;               // Drop shadow enable/disable
}

// Type-specific content interfaces
interface TextNoteContent {
	text: string;                  // Rich text content (max 10KB)
	format: 'plain' | 'markdown' | 'rich';
	fontSize: number;              // Font size in pixels
	fontFamily: string;            // Font family name
}

interface ImageCardContent {
	imageUrl: string;              // Firebase Storage URL
	altText: string;               // Accessibility text
	caption?: string;              // Optional image caption
	originalFileName: string;      // Original file name
	fileSize: number;              // File size in bytes
	dimensions: { width: number; height: number };
}

interface LinkCardContent {
	url: string;                   // Target URL
	title?: string;                // Link title (auto-fetched)
	description?: string;          // Link description (auto-fetched)
	faviconUrl?: string;           // Favicon URL (auto-fetched)
	previewImageUrl?: string;      // Preview image URL (auto-fetched)
	lastFetched?: Timestamp;       // Last metadata fetch
}

interface IframeCardContent {
	url: string;                   // Iframe source URL
	allowedDomains: string[];      // Security whitelist
	sandbox: string[];             // Sandbox permissions
	title: string;                 // Iframe title for accessibility
}

type CardContent = TextNoteContent | ImageCardContent | LinkCardContent | IframeCardContent;
```

**Constraints**:
- `title` length: 1-200 characters
- `content` size: max 1MB per card
- `position.width/height`: 2-8 grid units
- `position.x/y`: within workspace bounds
- No position overlaps within workspace
- Max 20 cards per workspace

**Indexes**:
- `workspaceId` (for workspace cards query)
- `ownerId` (for user's cards query)
- `type` (for filtering by card type)
- `lastModified` (for recent cards)
- Compound: `workspaceId + position.x + position.y` (for collision detection)

### User Settings Collection
**Path**: `/user-settings/{userId}`

```typescript
interface UserSettings {
	userId: string;                // References user document
	workspaceOrder: string[];      // Ordered list of workspace IDs
	recentWorkspaces: string[];    // Recently accessed workspace IDs
	favoriteWorkspaces: string[];  // Favorited workspace IDs
	keyboardShortcuts: Record<string, string>; // Custom shortcuts
	notifications: NotificationSettings;
	privacy: PrivacySettings;
	lastBackup?: Timestamp;        // Last data backup timestamp
}

interface NotificationSettings {
	emailNotifications: boolean;
	pushNotifications: boolean;
	collaborationUpdates: boolean;
	systemUpdates: boolean;
}

interface PrivacySettings {
	profileVisibility: 'public' | 'private';
	workspaceSharing: boolean;
	analyticsOptOut: boolean;
}
```

## Security Rules

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only access their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only access workspaces they own
    match /workspaces/{workspaceId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.ownerId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.ownerId && // probably won't work double check
        // Enforce max 10 workspaces per user
        getUserWorkspaceCount(request.auth.uid) < 10;
    }
    
    // Users can only access cards in their workspaces
    match /cards/{cardId} {
      allow read, write: if request.auth != null && 
        resource.data.ownerId == request.auth.uid;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.ownerId && // probably won't work double check
        // Enforce max 20 cards per workspace
        getWorkspaceCardCount(request.resource.data.workspaceId) < 20;
    }
    
    // Users can only access their own settings
    match /user-settings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Helper functions
    function getUserWorkspaceCount(userId) {
      return get(/databases/$(database)/documents/users/$(userId)).data.workspaceCount;
    }
    
    function getWorkspaceCardCount(workspaceId) {
      return get(/databases/$(database)/documents/workspaces/$(workspaceId)).data.cardCount;
    }
  }
}
```

## Data Relationships

### Entity Relationship Diagram
```
User (1) ──────── (0-10) Workspace
                     │
                     └── (0-20) Card

User (1) ──────── (1) UserSettings
```

### Relationship Constraints
- **User → Workspaces**: One user can own 0-10 workspaces
- **Workspace → Cards**: One workspace can contain 0-20 cards
- **User → UserSettings**: One-to-one relationship
- **Cascading Deletes**: When workspace is deleted, all its cards are deleted

## Data Migration & Versioning

### Schema Versioning
```typescript

interface SchemaVersion {
	version: string;               // Semantic version (e.g., "1.2.0")
	migrationRequired: boolean;    // Whether migration is needed
	compatibleVersions: string[];  // Backward compatible versions
	migrationScript?: string;      // Cloud Function name for migration
}
```
### Migration Strategy
1. **Backward Compatibility**: New fields are optional with defaults
2. **Version Tracking**: Each document includes schema version
3. **Gradual Migration**: Migrate documents on read/write
4. **Data Validation**: Strict validation on client and server

## Performance Optimizations

### Query Optimization
- **Composite Indexes**: Pre-configured for common query patterns
- **Query Limits**: Pagination for large result sets
- **Field Selection**: Only fetch required fields
- **Caching Strategy**: Cache frequently accessed data locally

### Data Denormalization
- **Card Count**: Stored in workspace document for quick access
- **User Stats**: Aggregate data stored in user document (need to double check)
- **Recent Items**: Denormalized lists for quick access (optional)

## Backup & Recovery

### Backup Strategy
- **Daily Exports**: Automated Firestore exports to Cloud Storage
- **Point-in-Time Recovery**: 30-day retention period
- **User Data Export**: GDPR-compliant data export functionality
- **Disaster Recovery**: Multi-region replication

## Monitoring & Analytics

### Database Metrics
- **Read/Write Operations**: Monitor usage patterns
- **Query Performance**: Track slow queries
- **Storage Usage**: Monitor document sizes and collection growth
- **Error Rates**: Track failed operations and validation errors

### Data Quality
- **Orphaned Records**: Detect and clean up orphaned cards
- **Data Consistency**: Validate referential integrity
- **Schema Compliance**: Ensure documents match expected schema

## Future Enhancements

### Planned Features
- **Workspace Collaboration**: Shared workspaces with multiple users
- **Real-time Sync**: Live cursor tracking and simultaneous editing
- **Version History**: Document revision tracking
- **Advanced Search**: Full-text search across all user content
- **Data Export/Import**: Backup and restore functionality 