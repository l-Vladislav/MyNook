# MyNook Project Context for AI Assistants

## Project Overview

**MyNook** is a personal productivity dashboard application that allows users to create customizable workspaces with drag-and-drop card widgets. This document provides comprehensive context for AI assistants to deliver informed development support.

**Project Type**: Personal Productivity Tool  
**Development Stage**: Planning & Architecture (Pre-MVP)  
**Target**: Production-ready MVP with basic functionality  
**Scale**: Pet project supporting dozens of concurrent users  

---

## Technical Architecture

### Technology Stack

#### Frontend
- **Framework**: Angular (primary choice due to developer expertise)
  - Consider React/Vue.js if Angular limitations emerge for drag-and-drop requirements
- **Language**: TypeScript (mandatory for type safety and code quality)
- **State Management**: RxJS reactive streams (Angular's natural choice)
- **UI Components**: Angular Material or custom component library
- **Build Tools**: Angular CLI with standard webpack configuration

#### Backend
- **Architecture**: Modular monolith approach
- **Technology**: .NET Core/C# (leveraging existing developer knowledge)
  - Alternative: Node.js with Express for simpler JSON handling
- **API Design**: RESTful API optimized for configuration management
  - Endpoints focused on CRUD operations for workspace configurations
  - JSON-centric API design for NoSQL data structures

#### Database & Storage
- **Primary Database**: Firebase Firestore (NoSQL)
  - Rationale: Natural JSON storage, built-in authentication, real-time capabilities for future features
  - Document structure optimized for workspace configurations
- **Client-side Caching**: IndexedDB for offline capability and performance
  - Cache workspace configurations locally
  - Sync strategy for data consistency

#### Authentication
- **Primary**: Firebase Authentication with JWT tokens
- **Social Login**: OAuth integration (Google, GitHub, Microsoft)
- **Session Management**: Firebase SDK handles token refresh automatically

### Architecture Patterns

#### Component Architecture
```
MyNook/
├── Core/                   # Shared services and utilities
├── Workspace/              # Workspace management module
├── Cards/                  # Card system and widget types
├── Auth/                   # Authentication module
├── Layout/                 # Grid system and drag-and-drop
└── Shared/                 # Reusable UI components
```

#### Data Flow
- **Reactive Streams**: RxJS-based state management
- **Component Communication**: Observer pattern with Subject/BehaviorSubject
- **Data Persistence**: Manual save with optimistic UI updates
- **Offline Strategy**: IndexedDB cache-first, sync on connection

---

## Feature Specifications

### Core Functionality

#### Drag-and-Drop Grid System
- **Grid Resolution**: 32x32 or 64x64 subdivisions for precise positioning
- **Card Constraints**: 
  - Minimum size: 2x2 grid units
  - Maximum size: 8x8 grid units  
  - Collision detection with grid-based snapping
- **Performance**: Maximum 20 cards per workspace for optimal performance
- **Responsive Design**: Grid adapts to mobile viewports with touch support

#### Card Types (MVP)
1. **Static Content Cards**
   - Text notes with rich formatting
   - Image display cards
   - Quick links/bookmarks

2. **Embedded Content**
   - iframe widgets for external content
   - Web page previews
   - Social media embeds

3. **Future: Live Data Feeds**
   - Weather widgets
   - Stock prices
   - RSS feed readers

#### Workspace Management
- **Multiple Workspaces**: Tab-based interface
- **Workspace Persistence**: Auto-save to Firebase on manual save action
- **Data Limits**: Maximum 100 cards per user across all workspaces

### User Experience Requirements

#### Browser Support
- **Target**: Modern browsers only (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **No Legacy Support**: IE11 not supported

#### Mobile Responsiveness
- **Priority**: High-level mobile optimization required
- **Touch Interface**: Full touch support for drag-and-drop operations
- **Viewport Adaptation**: Responsive grid system with mobile-first approach
- **Performance**: Optimized for mobile devices with limited resources

---

## Development Guidelines

### Code Quality Standards

#### TypeScript Configuration
- **Strict Mode**: Enabled for all TypeScript compiler checks
- **Type Coverage**: Minimum 95% type coverage
- **ESLint Rules**: Angular-specific linting with strict rules
- **Formatting**: Prettier with consistent code style

#### Testing Requirements
- **Unit Tests**: Jest for business logic, Jasmine/Karma for Angular components
- **Coverage Target**: Minimum 80% code coverage
- **Integration Tests**: Cypress for critical user flows
- **Component Testing**: Angular Testing Library for UI components

#### Architecture Patterns
```typescript
// Example service structure
@Injectable({ providedIn: 'root' })
export class WorkspaceService {
  private workspaces$ = new BehaviorSubject<Workspace[]>([]);
  
  getWorkspaces(): Observable<Workspace[]> {
    return this.workspaces$.asObservable();
  }
  
  // Firebase integration with RxJS
  syncWithFirebase(): Observable<Workspace[]> {
    // Implementation details
  }
}
```

### Firebase Integration Guidelines

#### Firestore Document Structure
```json
{
  "users/{userId}/workspaces/{workspaceId}": {
    "name": "My Workspace",
    "createdAt": "timestamp",
    "lastModified": "timestamp",
    "gridSize": { "width": 32, "height": 32 },
    "cards": [
      {
        "id": "card-uuid",
        "type": "text-note",
        "position": { "x": 4, "y": 8, "width": 4, "height": 3 },
        "content": { "title": "Note", "text": "Content" },
        "createdAt": "timestamp"
      }
    ]
  }
}
```

#### Security Rules
```javascript
// Firestore security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/workspaces/{workspaceId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## AI Assistant Guidelines

### Development Assistance Priorities

#### Primary Focus Areas
1. **Angular Implementation**: Component architecture, service patterns, RxJS integration
2. **Drag-and-Drop Logic**: Grid-based positioning, collision detection algorithms
3. **Firebase Integration**: Authentication flows, Firestore queries, security rules
4. **TypeScript Patterns**: Type definitions, interface design, generic implementations
5. **Responsive Design**: CSS Grid, Flexbox layouts, mobile optimization

#### Code Style Preferences
- **Angular Style Guide**: Follow official Angular coding conventions
- **Reactive Programming**: Prefer Observable patterns over imperative code
- **Component Design**: Smart/dumb component separation
- **Service Layer**: Thin controllers, fat services pattern
- **Error Handling**: Comprehensive error boundaries with user-friendly messages

#### Common Tasks for AI Assistance
1. **Component Generation**: Angular components with proper lifecycle hooks
2. **Service Implementation**: Firebase integration services with RxJS
3. **Type Definitions**: TypeScript interfaces for workspace and card models
4. **CSS Layouts**: Responsive grid systems and drag-and-drop styling
5. **Testing Code**: Unit tests and component testing scenarios

### Technical Decision Context

#### Why Angular?
- Developer expertise and familiarity
- Strong TypeScript integration
- Comprehensive ecosystem with Angular Material
- Built-in dependency injection and service architecture
- RxJS integration for reactive programming

#### Why Firebase?
- NoSQL document storage perfect for JSON configurations
- Built-in authentication with social login
- Real-time capabilities for future collaboration features
- Serverless architecture reduces backend complexity
- Generous free tier suitable for pet project scale

#### Why .NET Core Backend?
- Developer's existing C# knowledge
- Strong JSON serialization capabilities
- Robust API development framework
- Good Firebase Admin SDK support
- Option to switch to Node.js if needed

---

## Development Phases

### Phase 1: Foundation (Current)
- [x] Project structure and documentation
- [ ] Angular project setup with TypeScript configuration
- [ ] Firebase project initialization and authentication setup
- [ ] Basic component architecture with routing

### Phase 2: Core Features (Next)
- [ ] Grid system implementation with drag-and-drop
- [ ] Basic card types (text, image, link)
- [ ] Workspace creation and management
- [ ] Firebase integration for data persistence

### Phase 3: Enhancement
- [ ] Additional card types and embedded content
- [ ] Mobile optimization and touch interactions
- [ ] Performance optimization and caching
- [ ] User experience improvements

### Phase 4: Polish
- [ ] Comprehensive testing coverage
- [ ] Error handling and user feedback
- [ ] Documentation and deployment preparation
- [ ] Performance monitoring and optimization

---

## Current Blockers and Priorities

### Immediate Next Steps
1. **Angular Project Setup**: Initialize Angular project with proper TypeScript and ESLint configuration
2. **Firebase Configuration**: Set up Firebase project with authentication and Firestore
3. **Component Architecture**: Design core component hierarchy and service structure
4. **Grid System**: Implement basic grid layout with responsive design

### Technical Decisions Needed
1. **Grid Implementation**: CSS Grid vs. Canvas vs. SVG for drag-and-drop surface
2. **State Management**: NgRx vs. pure RxJS for complex state scenarios
3. **UI Framework**: Angular Material vs. custom components for design consistency
4. **Backend Necessity**: Whether .NET Core API is needed or Firebase is sufficient

### Risks and Mitigation
- **Drag-and-Drop Complexity**: Start with simple implementation, iterate based on user feedback
- **Mobile Performance**: Regular testing on actual devices, performance budgets
- **Firebase Costs**: Monitor usage, implement efficient querying patterns
- **Browser Compatibility**: Progressive enhancement approach for advanced features

---

## AI Assistant Instructions

When providing development assistance for MyNook:

1. **Always consider mobile-first responsive design**
2. **Prioritize TypeScript type safety and Angular best practices**
3. **Include Firebase integration patterns in backend suggestions**
4. **Focus on performance optimization for 20+ cards per workspace**
5. **Suggest testing approaches for drag-and-drop interactions**
6. **Consider offline functionality and data synchronization**
7. **Provide progressive enhancement suggestions for advanced features**

Remember: This is a personal productivity tool MVP. Keep solutions simple, maintainable, and focused on core functionality rather than over-engineering.