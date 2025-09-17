# ValidateIt - Component Documentation

This document details the React components used in the ValidateIt application, including their purpose, props, state management, and usage patterns.

## Component Overview

ValidateIt follows a component-based architecture with the following component categories:

1. **Page Components**: Top-level components that represent entire pages
2. **Authentication Components**: Components for authentication flows
3. **Navigation Components**: Components for site navigation
4. **Data Visualization Components**: Charts and visual representation components
5. **Form Components**: Components for user input
6. **Utility Components**: Reusable components for common UI patterns

## Page Components

### Home Component

**File:** `src/pages/Home.jsx`

**Purpose:** Landing page that introduces the application and provides access to authentication.

**Key Features:**
- Introduction to the application with feature highlights
- Authentication call-to-action
- Visual demonstrations of the analysis features

**State Management:**
- Tracks if the current user has reached their question limit

**Notable Props:** None (receives global auth context)

**Usage:**
```jsx
<Route path="/" element={<Home />} />
```

### Dashboard Component

**File:** `src/pages/Dashboard.jsx`

**Purpose:** Displays a user's saved ideas and provides access to create new ones.

**Key Features:**
- List of user's saved ideas with status indicators
- Options to view idea details or create new ideas
- Empty state handling for new users

**State Management:**
- Loads and displays user's ideas from Firestore
- Tracks loading and error states

**Notable Props:** None (receives global auth context)

**Usage:**
```jsx
<Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
```

### NewIdea Component

**File:** `src/pages/NewIdea.jsx`

**Purpose:** Allows users to submit new business ideas for analysis.

**Key Features:**
- Idea submission form
- Progress tracking during analysis
- Error handling and recovery options

**State Management:**
- Manages form input and validation
- Tracks analysis progress with percentage indicator
- Implements timeout detection for stalled analyses

**Notable Props:** None (receives global auth context)

**Usage:**
```jsx
<Route path="/new" element={<PrivateRoute><NewIdea /></PrivateRoute>} />
```

### IdeaDetails Component

**File:** `src/pages/IdeaDetails.jsx`

**Purpose:** Displays detailed analysis of a business idea and allows follow-up questions.

**Key Features:**
- Comprehensive display of idea analysis with visualizations
- Follow-up question functionality
- Navigation back to dashboard

**State Management:**
- Loads idea details from Firestore
- Manages follow-up questions and answers
- Checks user's question limit

**Notable Props:** 
- Receives ideaId from route parameters

**Usage:**
```jsx
<Route path="/idea/:ideaId" element={<PrivateRoute><IdeaDetails /></PrivateRoute>} />
```

## Authentication Components

### Login Component

**File:** `src/components/Login.jsx`

**Purpose:** Provides Google authentication functionality.

**Key Features:**
- Google sign-in button
- Error handling for authentication failures
- Loading state during authentication

**State Management:**
- Tracks loading and error states
- Uses AuthContext for authentication methods

**Notable Props:** None

**Usage:**
```jsx
<Route path="/login" element={<Login />} />
```

### PrivateRoute Component

**File:** `src/components/PrivateRoute.jsx`

**Purpose:** Protects routes that require authentication.

**Key Features:**
- Redirects unauthenticated users to login page
- Renders children when authenticated

**State Management:**
- Uses AuthContext to check authentication status

**Notable Props:**
- `children`: Components to render when authenticated

**Usage:**
```jsx
<Route 
  path="/dashboard" 
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  } 
/>
```

## Navigation Components

### Navbar Component

**File:** `src/components/Navbar.jsx`

**Purpose:** Provides navigation throughout the application and displays user info.

**Key Features:**
- Responsive design with mobile menu
- Conditional rendering based on authentication state
- User question count display

**State Management:**
- Tracks mobile menu open/closed state
- Fetches user's question count from Firestore
- Uses AuthContext for user information and logout

**Notable Props:** None

**Usage:**
```jsx
<Navbar />
```

## Data Visualization Components

### MarketPotentialGauge Component

**File:** `src/components/charts/MarketPotentialGauge.jsx`

**Purpose:** Visualizes market potential score using a gauge chart.

**Key Features:**
- Circular gauge visualization
- Color coding based on score value
- Explanatory text display

**Notable Props:**
- `score`: Number (1-10) representing market potential
- `explanation`: Text explaining the score

**Usage:**
```jsx
<MarketPotentialGauge 
  score={analysis.marketPotential.score}
  explanation={analysis.marketPotential.explanation} 
/>
```

### SentimentChart Component

**File:** `src/components/charts/SentimentChart.jsx`

**Purpose:** Visualizes sentiment analysis as a pie chart.

**Key Features:**
- Pie chart showing positive/neutral/negative proportions
- Color coding for different sentiment categories

**Notable Props:**
- `sentiment`: Object with positive, neutral, negative percentage values

**Usage:**
```jsx
<SentimentChart sentiment={analysis.sentiment} />
```

### RiskFactorsChart Component

**File:** `src/components/charts/RiskFactorsChart.jsx`

**Purpose:** Visualizes risk factors using a radar chart.

**Key Features:**
- Radar chart showing different risk dimensions
- Color coding to highlight risk levels

**Notable Props:**
- `riskFactors`: Object with risk scores for different categories

**Usage:**
```jsx
<RiskFactorsChart riskFactors={analysis.riskFactors} />
```

### SwotAnalysis Component

**File:** `src/components/charts/SwotAnalysis.jsx`

**Purpose:** Displays SWOT analysis in a quadrant layout.

**Key Features:**
- Four-quadrant display for Strengths, Weaknesses, Opportunities, Threats
- Color coding for each quadrant

**Notable Props:**
- `swot`: Object containing arrays for strengths, weaknesses, opportunities, threats

**Usage:**
```jsx
<SwotAnalysis swot={analysis.swot} />
```

### ExecutionSteps Component

**File:** `src/components/charts/ExecutionSteps.jsx`

**Purpose:** Visualizes recommended execution steps as a timeline.

**Key Features:**
- Timeline visualization of implementation phases
- Duration and description for each phase

**Notable Props:**
- `steps`: Array of execution step objects with phase, duration, and description

**Usage:**
```jsx
<ExecutionSteps steps={analysis.executionSteps} />
```

### TimeToMarket Component

**File:** `src/components/charts/TimeToMarket.jsx`

**Purpose:** Visualizes estimated time to market.

**Key Features:**
- Visual representation of timeline
- Explanatory text

**Notable Props:**
- `timeToMarket`: Object with months (number) and explanation (string)

**Usage:**
```jsx
<TimeToMarket timeToMarket={analysis.timeToMarket} />
```

### CompetitorsList Component

**File:** `src/components/charts/CompetitorsList.jsx`

**Purpose:** Displays list of potential competitors with strength indicators.

**Key Features:**
- Categorized display of competitors by strength
- Visual indicators for different competitor types

**Notable Props:**
- `competitors`: Array of competitor objects with name and strength

**Usage:**
```jsx
<CompetitorsList competitors={analysis.competitors} />
```

### KeyTrends Component

**File:** `src/components/charts/KeyTrends.jsx`

**Purpose:** Displays key market trends with impact indicators.

**Key Features:**
- List display of trends with impact indicators
- Color coding for positive/neutral/negative impact

**Notable Props:**
- `trends`: Array of trend objects with trend text and impact type

**Usage:**
```jsx
<KeyTrends trends={analysis.keyTrends} />
```

## Form Components

### RequestMoreQuestionsForm Component

**File:** `src/components/RequestMoreQuestionsForm.jsx`

**Purpose:** Allows users to request additional questions when they've reached their limit.

**Key Features:**
- Form for submitting details about additional question needs
- Status feedback during and after submission
- Pre-filled user information from authentication

**State Management:**
- Tracks form submission loading state
- Manages success/error states
- Uses refs for form access

**Notable Props:**
- `onClose`: Function to close the form modal

**Usage:**
```jsx
<RequestMoreQuestionsForm onClose={() => setShowRequestForm(false)} />
```

## Utility Components

### ViewMoreText Component

**File:** `src/components/ViewMoreText.jsx`

**Purpose:** Displays text with expandable/collapsible functionality for long content.

**Key Features:**
- Shows truncated text initially
- Expand/collapse toggle
- Configurable character limit

**State Management:**
- Tracks expanded/collapsed state

**Notable Props:**
- `text`: The text content to display
- `limit`: Maximum characters to show before truncating (default: 300)

**Usage:**
```jsx
<ViewMoreText 
  text={analysis.summary} 
  limit={500} 
/>
```

## Component Best Practices

The ValidateIt application follows these component best practices:

1. **Component Separation**: Each component has a single responsibility
2. **Prop Validation**: Components validate their props (though not shown in this documentation)
3. **Conditional Rendering**: Components handle loading, error, and empty states
4. **Responsive Design**: All components are designed to work on mobile and desktop
5. **Performance Optimization**: Components implement memoization where appropriate
6. **Accessibility**: Components include proper ARIA attributes and keyboard navigation

## Component Relationships

```
App
├── AuthProvider
│   └── Navbar
│   └── Routes
│       ├── Home
│       ├── Login
│       └── PrivateRoute
│           ├── Dashboard
│           ├── NewIdea
│           └── IdeaDetails
│               ├── MarketPotentialGauge
│               ├── SentimentChart
│               ├── RiskFactorsChart
│               ├── SwotAnalysis
│               ├── ExecutionSteps
│               ├── TimeToMarket
│               ├── CompetitorsList
│               ├── KeyTrends
│               └── ViewMoreText
```

## Component Styling

Components in ValidateIt are styled using TailwindCSS, a utility-first CSS framework. The styling approach follows these patterns:

1. **Utility Classes**: Direct application of utility classes for most styling needs
2. **Component-Specific CSS**: Limited use of component-specific CSS files when needed
3. **Responsive Design**: Mobile-first approach with responsive breakpoints
4. **Theme Consistency**: Consistent use of color schemes and spacing throughout components

## State Management Strategy

ValidateIt uses a combination of state management techniques:

1. **Local Component State**: For component-specific UI state
2. **React Context**: For global states like authentication
3. **URL Parameters**: For navigation state like the currently viewed idea
4. **Firestore**: As the source of truth for persistent data

This approach balances simplicity with performance, avoiding the complexity of a full state management library while still providing efficient state management.