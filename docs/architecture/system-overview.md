# MyNook System Architecture Overview

## Project Overview
MyNook is a personal productivity dashboard application enabling users to create customizable workspaces with draggable cards for notes, images, links, and embedded content.

## Technology Stack

### Frontend (Angular 17+)
- **Framework**: Angular 17.0+ with TypeScript
- **UI Library**: Angular Material for consistent design system
- **State Management**: RxJS services with reactive patterns
- **Build Tool**: Angular CLI with optimized production builds
- **Styling**: SCSS with Angular Material theming

### Backend (.NET Core 6+)
- **Framework**: .NET Core 6.0+ with C#
- **Architecture**: Clean Architecture with clear separation of concerns
- **API Pattern**: RESTful API with JSON responses
- **Authentication**: JWT tokens via Firebase Auth integration

### Database & Storage
- **Primary Database**: Firebase Firestore (NoSQL document database)
- **Client-side Caching**: IndexedDB for offline capabilities
- **Sync Strategy**: Manual save system (Phase 1 MVP)
- **File Storage**: Firebase Storage for image uploads

### Authentication & Authorization
- **Provider**: Firebase Authentication
- **Social Login**: Google and GitHub OAuth
- **Token Management**: Firebase SDK handles JWT tokens
- **Session Management**: Firebase SDK with persistent sessions

## Architectural Patterns

### Component Architecture
- **Smart/Dumb Components**: Container components manage state, presentation components handle UI
- **Reactive Forms**: Template-driven and reactive forms for user input
- **Material Design**: Consistent UI following Material Design principles
- **Responsive Design**: Mobile-first approach with breakpoints at 768px, 1024px, 1200px

### State Management
- **Service-based State**: Angular services with BehaviorSubjects for state
- **RxJS Streams**: Reactive data flow with observables
- **Local State**: Component-level state for UI-specific data
- **Persistent State**: Firebase Firestore for application data

## System Constraints

### Performance Requirements
- **Initial Load Time**: < 3 seconds
- **Drag Operation Latency**: < 16ms for smooth interactions
- **Memory Usage**: < 100MB for optimal performance
- **Save Operations**: < 5 seconds timeout

### Grid System Architecture
- **Grid Resolution**: 32px base unit for positioning
- **Card Sizing**: Minimum 2x2, maximum 8x8 grid units
- **Collision Detection**: Prevent overlapping cards
- **Snap to Grid**: Automatic alignment to grid boundaries

### Data Constraints
- **Max Cards per Workspace**: 20 cards
- **Max Workspaces per User**: 10 workspaces
- **Content Size Limit**: 1MB per card
- **Concurrent Users**: Support for 50 concurrent users

## Security Architecture

### Authentication Flow
1. User authenticates via Firebase Auth (Google/GitHub)
2. Firebase returns JWT token
3. Frontend stores token securely
4. Backend validates JWT on each API request
5. Firestore security rules enforce user-based access

### Data Security
- **Transport Encryption**: HTTPS/TLS for all communications
- **At-rest Encryption**: Firebase handles data encryption
- **Access Control**: User-based read/write permissions
- **Rate Limiting**: API throttling to prevent abuse

## Integration Points

### Firebase Services
- **Authentication**: Firebase Auth for user management
- **Database**: Firestore for real-time data sync
- **Storage**: Firebase Storage for file uploads
- **Security Rules**: Server-side access control

## Deployment Architecture

### Development Environment
- **Local Development**: Angular dev server + .NET Core local server
- **Hot Reload**: Automatic refresh during development
- **Debugging**: Chrome DevTools integration

### Production Environment
- **Container**: Docker containerization
- **Reverse Proxy**: Nginx for static file serving and SSL termination (optional)
- **SSL**: TLS certificate management
- **Health Checks**: Application health monitoring

## Development Priorities

### Phase 1 MVP (8 weeks)
1. **User Authentication**: Firebase Auth integration
2. **Workspace Management**: Create, read, update, delete workspaces
3. **Text Note Cards**: Basic card creation and editing
4. **Drag & Drop**: Core positioning functionality
5. **Manual Save**: Explicit save operations

### Phase 2 Enhancement (4 weeks)
1. **Additional Card Types**: Image, link, iframe cards
2. **Mobile Optimization**: Touch-friendly interactions
3. **Performance Improvements**: Optimized rendering
4. **Error Handling**: Comprehensive error management

## Quality Gates

### Code Quality
- **TypeScript**: Strict mode enabled
- **Code Coverage**: Minimum 80% test coverage
- **Linting**: ESLint with zero warnings
- **Bundle Size**: < 2MB production build

### Performance Metrics
- **Lighthouse Score**: > 90 performance score
- **Accessibility**: > 85 accessibility score
- **Core Web Vitals**: Meeting Google's performance standards

## Technical Debt & Risks

### Current Technical Debt
- Technology stack selection completed ✅
- Architecture documentation in progress 🚧
- Development environment setup pending ⏳

### Risk Mitigation
- **Firebase Vendor Lock-in**: Abstract database layer for potential migration
- **Performance Scaling**: Monitor metrics and optimize critical paths
- **Browser Compatibility**: Target modern browsers (Chrome 90+, Firefox 88+, Safari 14+)

## Next Steps

1. **Database Schema Design**: Define Firestore collections and documents
2. **API Specification**: REST endpoint definitions
3. **Development Setup**: Environment configuration and tooling
4. **Component Library**: Create reusable UI components
5. **Authentication Implementation**: Firebase Auth integration 